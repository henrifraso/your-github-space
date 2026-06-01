// Helpers de URL e proxy do Navegador OS¹.
//
// Conteúdo movido de src/components/BrowserView.tsx (Fase 12) — sem
// alteração de comportamento. `proxifyClient` e `rewriteHtmlClient`
// continuam usando exatamente as mesmas regex e o mesmo script injetado
// (template string com interpolação de `pageUrl`/`pageOrigin`).
//
// IMPORTANTE: este módulo é puro (sem JSX, sem hooks, sem state).
// `isElectron` é avaliado uma única vez no carregamento do módulo.

// URL sentinela: representa a "tela do desktop real". Não navega —
// apenas marca a aba como modo desktop.
export const DESKTOP_URL = 'omni://desktop';

// Endpoint WISP usado pelo libcurl.js no fallback iframe.
export const WISP_URL = 'wss://wisp.mercurywork.shop/';

// Detecta ambiente Electron. Mantém comportamento idêntico ao inline anterior.
export const isElectron = typeof window !== 'undefined' && !!window.electron?.isElectron;

// Normaliza o que o usuário digita na barra:
//   - URL completa → mantém
//   - hostname (foo.com/path) → adiciona `https://`
//   - qualquer outra coisa → manda pra busca do Google
export function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^[\w-]+\.[\w.-]+/.test(trimmed)) return `https://${trimmed}`;
  return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
}

// Envelopa uma URL relativa/absoluta no proxy server-side (/api/proxy).
// Pula esquemas que não fazem sentido proxiar (data:, blob:, mailto:, etc).
export function proxifyClient(url: string, base: string): string {
  if (!url) return url;
  const skip = ['data:', 'blob:', 'javascript:', 'mailto:', 'tel:', '#', 'about:'];
  if (skip.some(p => url.startsWith(p))) return url;
  if (url.startsWith('/api/proxy')) return url;
  try {
    const abs = /^https?:\/\//i.test(url) ? url : new URL(url, base).href;
    if (abs.includes('/api/proxy?url=')) return abs; // já é URL proxiada — não envelopar de novo
    return `/api/proxy?url=${encodeURIComponent(abs)}`;
  } catch { return url; }
}

// Reescreve HTML do iframe pra rotear todas as requisições via proxy +
// injeta um runtime tracker que intercepta cliques, submits, fetch e
// XMLHttpRequest, e usa postMessage `omni-nav`/`omni-loading` pra
// comunicar com o BrowserView host.
//
// O script injetado é uma TEMPLATE STRING que interpola `pageUrl` e
// `pageOrigin` via `JSON.stringify`. NÃO ALTERAR a interpolação nem o
// conteúdo do script: cada `function nav(...)`, `function loading(...)`
// é código JavaScript que vai pro iframe — não código TypeScript.
export function rewriteHtmlClient(html: string, pageUrl: string): string {
  html = html.replace(/<meta[^>]+(?:x-frame-options|content-security-policy)[^>]*>/gi, '');
  html = html.replace(/<meta[^>]+name=["']viewport["'][^>]*>/gi, '');
  html = html.replace(/\starget=["']_blank["']/gi, '');
  html = html.replace(/(\s(?:href|src|action|data-src|poster)=")([^"]+)(")/g,
    (_, a, u, b) => u.startsWith('/api/proxy') ? _ : a + proxifyClient(u, pageUrl) + b);
  html = html.replace(/(\s(?:href|src|action|data-src|poster)=')([^']+)(')/g,
    (_, a, u, b) => u.startsWith('/api/proxy') ? _ : a + proxifyClient(u, pageUrl) + b);
  html = html.replace(
    /(<script[^>]*>)([\s\S]*?ytInitialPlayerResponse[\s\S]*?)(<\/script>)/gi,
    (_m, open, body, close) => open + body.replace(
      /"(https:\/\/[^"]*googlevideo\.com[^"]+)"/g,
      (_u: string, u: string) => `"/api/proxy?url=${encodeURIComponent(u)}"`
    ) + close
  );
  const pageOrigin = (() => { try { return new URL(pageUrl).origin; } catch { return ''; } })();
  const tracker = `<script>(function(){
var __rp=window.parent;
try{Object.defineProperty(window,'top',{get:function(){return window;},configurable:true});}catch(e){}
try{Object.defineProperty(window,'parent',{get:function(){return window;},configurable:true});}catch(e){}
try{Object.defineProperty(window,'self',{get:function(){return window;},configurable:true});}catch(e){}
try{Object.defineProperty(window,'frameElement',{get:function(){return null;},configurable:true});}catch(e){}
try{Object.defineProperty(navigator,'webdriver',{get:function(){return false;},configurable:true});}catch(e){}
try{if(!window.chrome)window.chrome={runtime:{}};}catch(e){}
try{window.rwt=function(){return true;};}catch(e){}
var BASE=${JSON.stringify(pageUrl)};
var BASE_ORIGIN=${JSON.stringify(pageOrigin)};
try{
  var _pu=new URL(BASE);
  var _fakeLocation={
    href:_pu.href,origin:_pu.origin,hostname:_pu.hostname,
    host:_pu.host,pathname:_pu.pathname,search:_pu.search,
    hash:_pu.hash,protocol:_pu.protocol,port:_pu.port,
    assign:function(u){intercept(u);},
    replace:function(u){intercept(u);},
    reload:function(){},
    toString:function(){return _pu.href;}
  };
  Object.defineProperty(window,'location',{get:function(){return _fakeLocation;},configurable:true});
  try{Object.defineProperty(document,'referrer',{get:function(){return BASE_ORIGIN;},configurable:true});}catch(e){}
  try{Object.defineProperty(document,'URL',{get:function(){return BASE;},configurable:true});}catch(e){}
  try{Object.defineProperty(document,'documentURI',{get:function(){return BASE;},configurable:true});}catch(e){}
  try{Object.defineProperty(document,'location',{get:function(){return _fakeLocation;},configurable:true});}catch(e){}
}catch(e){}
try{
  var _fakeHistory={
    pushState:function(s,t,u){if(u){try{var abs=new URL(u,BASE).href;var pn=new URL(BASE);var nn=new URL(abs);if(pn.pathname+pn.search!==nn.pathname+nn.search){BASE=abs;var real=toReal(abs);if(!real.includes('/api/proxy')){loading();nav(real);}}}catch(e){}}},
    replaceState:function(s,t,u){if(u){try{BASE=new URL(u,BASE).href;}catch(e){}}},
    go:function(){},back:function(){},forward:function(){},state:null,length:1
  };
  Object.defineProperty(window,'history',{get:function(){return _fakeHistory;},configurable:true});
}catch(e){}
function nav(url){try{__rp.postMessage({type:'omni-nav',url:url},'*')}catch(e){}}
function loading(){try{__rp.postMessage({type:'omni-loading'},'*')}catch(e){}}
function toReal(u){
  try{
    var abs=new URL(u,BASE).href;
    var pu=new URL(abs);
    var p=pu.searchParams.get('url');
    if(p)return p;
    if(pu.hostname.includes('google.')&&pu.pathname==='/url'){var q=pu.searchParams.get('q');if(q)return q;}
    return abs;
  }catch(e){return u;}
}
function intercept(u){
  if(!u)return false;
  try{
    var abs=new URL(u,BASE).href;
    if(abs.includes('/api/proxy?url='))return false;
    nav(toReal(abs));
    return true;
  }catch(e){return false;}
}
try{
  var lp=Location.prototype;
  var oa=lp.assign.bind(location);
  lp.assign=function(u){if(!intercept(u))oa(u);};
  var or_=lp.replace.bind(location);
  lp.replace=function(u){if(!intercept(u))or_(u);};
}catch(e){}
try{
  var ld=Object.getOwnPropertyDescriptor(Location.prototype,'href')||
         Object.getOwnPropertyDescriptor(Object.getPrototypeOf(location),'href');
  if(ld&&ld.set){
    var oh=ld.set;
    Object.defineProperty(Location.prototype,'href',{
      get:ld.get,
      set:function(u){if(!intercept(u))oh.call(this,u);},
      configurable:true
    });
  }
}catch(e){}
document.addEventListener('submit',function(e){
  var f=e.target;
  if(!f||f.nodeName!=='FORM')return;
  if((f.getAttribute('method')||'get').toLowerCase()!=='get')return;
  try{
    var action=toReal(f.getAttribute('action')||'');
    var fd=new URLSearchParams(new FormData(f));
    var url=action.split('?')[0]+'?'+fd.toString();
    e.preventDefault();loading();nav(url);
  }catch(ex){}
},true);
document.addEventListener('click',function(e){
  var el=e.target;var d=0;
  while(el&&el.nodeName!=='A'&&d<8){el=el.parentElement;d++;}
  if(!el||el.nodeName!=='A')return;
  var href=el.getAttribute('href')||el.getAttribute('data-href');
  if(!href||href.startsWith('javascript:')||href.startsWith('#')||href.startsWith('mailto:'))return;
  if(!/^https?:\/\/|^\//i.test(href))return;
  e.preventDefault();loading();nav(toReal(href));
},true);
try{
  var _of=window.fetch;
  window.fetch=function(input,init){
    try{
      var u=typeof input==='string'?input:(input&&input.url?input.url:'');
      if(u&&/^https?:\/\//i.test(u)&&!u.includes('/api/proxy')){
        var pu='/api/proxy?url='+encodeURIComponent(u);
        input=typeof input==='string'?pu:new Request(pu,input);
      }
    }catch(e){}
    return _of.apply(this,arguments);
  };
}catch(e){}
try{
  var _ox=XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open=function(m,u){
    if(u&&typeof u==='string'&&/^https?:\/\//i.test(u)&&!u.includes('/api/proxy')){
      arguments[1]='/api/proxy?url='+encodeURIComponent(u);
    }
    return _ox.apply(this,arguments);
  };
}catch(e){}
})();</script>`;
  return /<head/i.test(html)
    ? html.replace(/(<head[^>]*>)/i, '$1' + tracker)
    : tracker + html;
}
