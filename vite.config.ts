import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { buildTracker } from './api/tracker';
import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

// ── Lógica do proxy (espelho de api/proxy.ts para dev local) ──────────────────

const STRIP = new Set([
  'x-frame-options','content-security-policy','content-security-policy-report-only',
  'cross-origin-embedder-policy','cross-origin-opener-policy','cross-origin-resource-policy',
  'content-encoding','transfer-encoding','connection','keep-alive',
]);

function proxify(url: string, base: string, origin: string): string {
  if (!url) return url;
  const skip = ['data:','blob:','javascript:','mailto:','tel:','#','about:'];
  if (skip.some(p => url.startsWith(p))) return url;
  if (url.startsWith('/api/proxy')) return origin + url;
  try {
    const abs = /^https?:\/\//i.test(url) ? url : new URL(url, base).href;
    return `${origin}/api/proxy?url=${encodeURIComponent(abs)}`;
  } catch { return url; }
}

function rewriteHtml(html: string, pageUrl: string, origin: string): string {
  const tracker = buildTracker();
  html = /<head/i.test(html)
    ? html.replace(/(<head[^>]*>)/i, '$1' + tracker)
    : tracker + html;
  html = html.replace(/(\s(?:href|src|action|data-src|poster)=")([^"]+)(")/g,
    (_, a, u, b) => u.startsWith('/api/proxy') ? _ : a + proxify(u, pageUrl, origin) + b);
  html = html.replace(/(\s(?:href|src|action|data-src|poster)=')([^']+)(')/g,
    (_, a, u, b) => u.startsWith('/api/proxy') ? _ : a + proxify(u, pageUrl, origin) + b);
  html = html.replace(/\starget=["']_blank["']/gi, '');
  html = html.replace(/<meta[^>]+(?:x-frame-options|content-security-policy)[^>]*>/gi, '');
  return html;
}

function rewriteCss(css: string, pageUrl: string, origin: string): string {
  return css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi,
    (_, q, u) => `url(${q}${proxify(u, pageUrl, origin)}${q})`);
}

async function proxyMiddleware(req: IncomingMessage, res: ServerResponse, origin: string) {
  const rawUrl = new URL(req.url!, `http://localhost`).searchParams.get('url');
  if (!rawUrl) { res.statusCode = 400; res.end('Missing ?url='); return; }

  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), 15000);
  try {
    const upstream = await fetch(rawUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
      },
      redirect: 'follow',
      signal: abort.signal,
    });
    clearTimeout(timer);

    const ct = upstream.headers.get('content-type') || 'application/octet-stream';
    for (const [k, v] of upstream.headers.entries()) {
      if (!STRIP.has(k.toLowerCase())) res.setHeader(k, v);
    }
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (ct.includes('text/html')) {
      const html = await upstream.text();
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(rewriteHtml(html, rawUrl, origin));
      return;
    }
    if (ct.includes('text/css')) {
      const css = await upstream.text();
      res.setHeader('Content-Type', ct);
      res.end(rewriteCss(css, rawUrl, origin));
      return;
    }
    const buf = Buffer.from(await upstream.arrayBuffer());
    res.setHeader('Content-Type', ct);
    res.end(buf);
  } catch (err) {
    res.statusCode = 502;
    res.end(`Proxy error: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// ── Plugin: copia dist files do Scramjet para public/ (dev) e dist/ (build) ──
const NM = 'node_modules';

const SCRAMJET_COPIES = [
  { from: `${NM}/@mercuryworkshop/scramjet/dist/scramjet.js`,   to: 'scramjet/scramjet.js' },
  { from: `${NM}/@mercuryworkshop/scramjet/dist/scramjet.wasm`, to: 'scramjet/scramjet.wasm' },
  { from: `${NM}/@mercuryworkshop/scramjet-controller/dist/controller.api.js`,    to: 'controller/controller.api.js' },
  { from: `${NM}/@mercuryworkshop/scramjet-controller/dist/controller.inject.js`, to: 'controller/controller.inject.js' },
  { from: `${NM}/@mercuryworkshop/scramjet-controller/dist/controller.sw.js`,     to: 'controller/controller.sw.js' },
];

function copyScramjetAssets(targetDir: string) {
  for (const { from, to } of SCRAMJET_COPIES) {
    const src = resolve(from);
    const dest = resolve(targetDir, to);
    if (!existsSync(src)) { console.warn(`[scramjet] not found: ${src}`); continue; }
    mkdirSync(resolve(dest, '..'), { recursive: true });
    copyFileSync(src, dest);
  }
}

// ─────────────────────────────────────────────────────────────────────────────

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'scramjet-assets',
      // Dev: serve os arquivos diretamente de node_modules
      configureServer(server) {
        for (const { from, to } of SCRAMJET_COPIES) {
          const src = resolve(from);
          server.middlewares.use(`/${to}`, (_req, res) => {
            if (!existsSync(src)) { res.statusCode = 404; res.end('not found'); return; }
            const ext = to.endsWith('.wasm') ? 'application/wasm' : 'application/javascript';
            res.setHeader('Content-Type', ext);
            res.setHeader('Cache-Control', 'no-cache');
            const { createReadStream } = require('node:fs');
            createReadStream(src).pipe(res);
          });
        }
      },
      // Build: copia para o diretório de saída
      closeBundle() {
        copyScramjetAssets('dist');
      },
    },
    {
      name: 'omni-proxy',
      configureServer(server) {
        server.middlewares.use('/api/proxy', (req, res) => {
          const origin = `http://${req.headers.host || 'localhost:3000'}`;
          proxyMiddleware(req, res, origin);
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
