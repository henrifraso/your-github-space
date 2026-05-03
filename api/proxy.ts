import type { VercelRequest, VercelResponse } from '@vercel/node';

const STRIP_HEADERS = new Set([
  'x-frame-options',
  'content-security-policy',
  'content-security-policy-report-only',
  'cross-origin-embedder-policy',
  'cross-origin-opener-policy',
  'cross-origin-resource-policy',
  'content-encoding',
  'transfer-encoding',
  'connection',
  'keep-alive',
]);

function proxify(url: string, base: string, origin: string): string {
  if (!url) return url;
  const skip = ['data:', 'blob:', 'javascript:', 'mailto:', 'tel:', '#', 'about:'];
  if (skip.some(p => url.startsWith(p))) return url;
  if (url.startsWith('/api/proxy')) return origin + url;
  try {
    const abs = /^https?:\/\//i.test(url) ? url : new URL(url, base).href;
    return `${origin}/api/proxy?url=${encodeURIComponent(abs)}`;
  } catch {
    return url;
  }
}

function rewriteHtml(html: string, pageUrl: string, origin: string): string {
  // Script injected in every page: tracks SPA navigation via postMessage
  const tracker = `<script>(function(){
var fn=function(u){try{parent.postMessage({type:'omni-nav',url:u},'*')}catch(e){}};
var pp=history.pushState,pr=history.replaceState;
history.pushState=function(){pp.apply(this,arguments);fn(location.href)};
history.replaceState=function(){pr.apply(this,arguments);fn(location.href)};
addEventListener('popstate',function(){fn(location.href)});
})();</script>`;

  html = /<head/i.test(html)
    ? html.replace(/(<head[^>]*>)/i, '$1' + tracker)
    : tracker + html;

  // Rewrite href/src/action (double quotes)
  html = html.replace(/(\s(?:href|src|action|data-src|poster)=")([^"]+)(")/g, (_, a, url, b) =>
    url.startsWith('/api/proxy') ? _ : a + proxify(url, pageUrl, origin) + b
  );
  // Rewrite href/src/action (single quotes)
  html = html.replace(/(\s(?:href|src|action|data-src|poster)=')([^']+)(')/g, (_, a, url, b) =>
    url.startsWith('/api/proxy') ? _ : a + proxify(url, pageUrl, origin) + b
  );

  // Strip target="_blank" so links open inside the iframe
  html = html.replace(/\starget=["']_blank["']/gi, '');

  // Remove meta tags with X-Frame-Options or CSP
  html = html.replace(/<meta[^>]+(?:x-frame-options|content-security-policy)[^>]*>/gi, '');

  return html;
}

function rewriteCss(css: string, pageUrl: string, origin: string): string {
  return css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi, (_, q, url) =>
    `url(${q}${proxify(url, pageUrl, origin)}${q})`
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const rawUrl = req.query.url as string | undefined;
  if (!rawUrl) return res.status(400).send('Missing ?url=');

  let targetUrl: URL;
  try { targetUrl = new URL(rawUrl); } catch {
    return res.status(400).send('Invalid URL');
  }

  const proto = (req.headers['x-forwarded-proto'] as string) || 'https';
  const origin = `${proto}://${req.headers.host}`;

  try {
    const upstream = await fetch(rawUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
      },
      redirect: 'follow',
    });

    const ct = upstream.headers.get('content-type') || 'application/octet-stream';

    // Forward safe headers
    for (const [k, v] of upstream.headers.entries()) {
      if (!STRIP_HEADERS.has(k.toLowerCase())) res.setHeader(k, v);
    }
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (ct.includes('text/html')) {
      const html = await upstream.text();
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.send(rewriteHtml(html, rawUrl, origin));
    }

    if (ct.includes('text/css')) {
      const css = await upstream.text();
      res.setHeader('Content-Type', ct);
      return res.send(rewriteCss(css, rawUrl, origin));
    }

    // Binary passthrough (images, fonts, JS, etc.)
    const buf = Buffer.from(await upstream.arrayBuffer());
    res.setHeader('Content-Type', ct);
    return res.send(buf);

  } catch (err) {
    return res.status(502).send(`Proxy error: ${err instanceof Error ? err.message : String(err)}`);
  }
}
