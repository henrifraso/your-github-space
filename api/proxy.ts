import type { VercelRequest, VercelResponse } from '@vercel/node';

// Camada 1 — SSRF: hostnames/ranges que nunca devem ser atingidos pelo proxy.
const SSRF_HOSTNAME_RE = /^(localhost|.*\.local)$/i;
const SSRF_IP_RE = /^(127\.|0\.0\.0\.0|10\.|192\.168\.|169\.254\.|::1$|fc00:|fd)/;
// Faixas 172.16.0.0–172.31.255.255
function isPrivate172(host: string): boolean {
  const m = host.match(/^172\.(\d+)\./);
  return !!m && +m[1] >= 16 && +m[1] <= 31;
}
function isBlockedHost(host: string): boolean {
  return SSRF_HOSTNAME_RE.test(host) || SSRF_IP_RE.test(host) || isPrivate172(host);
}

// Camada 3 — Origin/Referer: domínios legítimos do app.
const ALLOWED_ORIGINS = new Set([
  'https://app.os1.space',
  'https://os1-deploy.vercel.app',
]);

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
    if (abs.includes('/api/proxy?url=')) return abs; // já é URL proxiada — não envelopar de novo
    return `${origin}/api/proxy?url=${encodeURIComponent(abs)}`;
  } catch {
    return url;
  }
}

function buildTracker(origin: string): string {
  return `<script>(function(){
var o=${JSON.stringify(origin)};
function loading(){try{parent.postMessage({type:'omni-loading'},'*')}catch(e){}}
function nav(u){try{parent.postMessage({type:'omni-nav',url:u},'*')}catch(e){}}
function fixForm(f){
  if(!f||f.nodeName!=='FORM')return false;
  if((f.getAttribute('method')||'get').toLowerCase()!=='get')return false;
  try{
    var pa=new URL(f.action),orig=pa.searchParams.get('url');
    if(!orig)return false;
    var fd=new URLSearchParams(new FormData(f));
    loading();
    window.location.href=o+'/api/proxy?url='+encodeURIComponent(orig.split('?')[0]+'?'+fd.toString());
    return true;
  }catch(ex){return false;}
}
document.addEventListener('submit',function(e){if(fixForm(e.target))e.preventDefault();},true);
var os=HTMLFormElement.prototype.submit;
HTMLFormElement.prototype.submit=function(){if(!fixForm(this))os.call(this);};
var ors=HTMLFormElement.prototype.requestSubmit;
if(ors)HTMLFormElement.prototype.requestSubmit=function(s){if(!fixForm(this))ors.call(this,s);};
document.addEventListener('click',function(e){
  var el=e.target;
  while(el&&el.nodeName!=='A')el=el.parentElement;
  if(!el)return;
  var href=el.getAttribute('href');
  if(!href||href.startsWith('javascript:')||href.startsWith('#')||href.startsWith('mailto:'))return;
  try{
    var abs=new URL(href,location.href).href;
    loading();
    if(href.indexOf('/api/proxy')===-1){
      e.preventDefault();
      window.location.href=o+'/api/proxy?url='+encodeURIComponent(abs);
    }
  }catch(ex){}
},true);
})();</script>`;
}

function rewriteHtml(html: string, pageUrl: string, origin: string): string {
  const tracker = buildTracker(origin);

  html = /<head/i.test(html)
    ? html.replace(/(<head[^>]*>)/i, '$1' + tracker)
    : tracker + html;

  html = html.replace(/(\s(?:href|src|action|data-src|poster)=")([^"]+)(")/g, (_, a, url, b) =>
    url.startsWith('/api/proxy') ? _ : a + proxify(url, pageUrl, origin) + b
  );
  html = html.replace(/(\s(?:href|src|action|data-src|poster)=')([^']+)(')/g, (_, a, url, b) =>
    url.startsWith('/api/proxy') ? _ : a + proxify(url, pageUrl, origin) + b
  );
  html = html.replace(/\starget=["']_blank["']/gi, '');
  html = html.replace(/<meta[^>]+(?:x-frame-options|content-security-policy)[^>]*>/gi, '');

  return html;
}

function rewriteCss(css: string, pageUrl: string, origin: string): string {
  return css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi, (_, q, url) =>
    `url(${q}${proxify(url, pageUrl, origin)}${q})`
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Camada 3 — Origin/Referer check (se presente e não for do app, rejeita).
  const originHeader = (req.headers['origin'] || req.headers['referer'] || '') as string;
  if (originHeader) {
    let requestOrigin = '';
    try { requestOrigin = new URL(originHeader).origin; } catch { requestOrigin = originHeader; }
    if (!ALLOWED_ORIGINS.has(requestOrigin)) {
      return res.status(403).send('Forbidden');
    }
  }

  const rawUrl = req.query.url as string | undefined;
  if (!rawUrl) return res.status(400).send('Missing ?url=');

  let targetUrl: URL;
  try { targetUrl = new URL(rawUrl); } catch {
    return res.status(400).send('Invalid URL');
  }

  // Camada 2 — Protocol enforcement: só http/https.
  if (targetUrl.protocol !== 'http:' && targetUrl.protocol !== 'https:') {
    return res.status(400).send('Invalid protocol');
  }

  // Camada 1 — SSRF: bloquear IPs e hostnames privados/internos.
  if (isBlockedHost(targetUrl.hostname)) {
    return res.status(400).send('Blocked host');
  }

  const proto = (req.headers['x-forwarded-proto'] as string) || 'https';
  const origin = `${proto}://${req.headers.host}`;

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

    const buf = Buffer.from(await upstream.arrayBuffer());
    res.setHeader('Content-Type', ct);
    return res.send(buf);

  } catch (err) {
    clearTimeout(timer);
    return res.status(502).send(`Proxy error: ${err instanceof Error ? err.message : String(err)}`);
  }
}
