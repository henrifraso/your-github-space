import React, { useRef, useState, useEffect, useCallback, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowLeft, ArrowRight, RotateCcw, ExternalLink, Globe, RefreshCw, Plus } from 'lucide-react';
import { libcurl as _libcurl } from 'libcurl.js';

declare global {
  interface Window {
    electron?: {
      isElectron: boolean;
      captureNavigation: (data: { url: string; title: string; ts: number }) => void;
      saveOffline: (key: string, data: unknown) => Promise<{ ok: boolean; file?: string }>;
      onNavigationUpdate: (cb: (data: unknown) => void) => void;
    };
  }
}

// webview é um elemento Chromium/Electron — React já tem tipos parciais; usamos any no ref
type WebviewElement = HTMLElement & {
  src: string;
  loadURL: (url: string) => void;
  canGoBack: () => boolean;
  canGoForward: () => boolean;
  goBack: () => void;
  goForward: () => void;
  reload: () => void;
  addEventListener: (event: string, handler: (e: any) => void) => void;
  removeEventListener: (event: string, handler: (e: any) => void) => void;
};

const isElectron = typeof window !== 'undefined' && !!window.electron?.isElectron;

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^[\w-]+\.[\w.-]+/.test(trimmed)) return `https://${trimmed}`;
  return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
}

// ── Tipos para o sistema de abas ─────────────────────────────────────────────
interface Tab {
  id: string;
  url: string;
  title: string;
  favicon: string;
  loading: boolean;
  canGoBack: boolean;
  canGoFwd: boolean;
}

function makeTab(url: string): Tab {
  return { id: crypto.randomUUID(), url, title: new URL(url).hostname, favicon: '', loading: true, canGoBack: false, canGoFwd: false };
}

// ── Navegador com <webview> + abas — só funciona dentro do Electron ───────────
function ElectronBrowser({ initialUrl }: { initialUrl: string }) {
  const [tabs, setTabs] = useState<Tab[]>(() => [makeTab(normalizeUrl(initialUrl))]);
  const [activeId, setActiveId] = useState(() => tabs[0].id);
  const [inputVal, setInputVal] = useState(initialUrl);
  const webviewRefs = useRef<Map<string, WebviewElement>>(new Map());
  const inputRef = useRef<HTMLInputElement>(null);

  const activeTab = tabs.find(t => t.id === activeId) ?? tabs[0];

  // Sincroniza input com a aba ativa
  useEffect(() => { setInputVal(activeTab?.url ?? ''); }, [activeId]);

  // Registra eventos de uma webview quando ela é montada
  const bindWebview = useCallback((id: string, wv: WebviewElement | null) => {
    if (!wv) { webviewRefs.current.delete(id); return; }
    webviewRefs.current.set(id, wv);

    const update = (patch: Partial<Tab>) =>
      setTabs(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));

    const refreshNav = () => update({
      canGoBack: wv.canGoBack?.() ?? false,
      canGoFwd: wv.canGoForward?.() ?? false,
    });

    const onStart = () => update({ loading: true });
    const onStop = () => { update({ loading: false }); refreshNav(); };
    const onNavigate = (e: any) => {
      const url = e.url || '';
      if (url && !url.startsWith('about:')) {
        update({ url });
        setTabs(prev => prev.map(t => t.id === id && id === activeId ? { ...t, url } : t));
        if (id === activeId) setInputVal(url);
      }
      refreshNav();
      if (url && window.electron) {
        window.electron.captureNavigation({ url, title: '', ts: Date.now() });
      }
    };
    const onTitle = (e: any) => update({ title: e.title || new URL(wv.src || 'about:blank').hostname });
    const onFavicon = (e: any) => update({ favicon: e.favicons?.[0] || '' });

    wv.addEventListener('did-start-loading', onStart);
    wv.addEventListener('did-stop-loading', onStop);
    wv.addEventListener('did-navigate', onNavigate);
    wv.addEventListener('did-navigate-in-page', onNavigate);
    wv.addEventListener('page-title-updated', onTitle);
    wv.addEventListener('page-favicon-updated', onFavicon);
  }, [activeId]);

  function openTab(url = 'https://www.google.com') {
    const tab = makeTab(normalizeUrl(url));
    setTabs(prev => [...prev, tab]);
    setActiveId(tab.id);
  }

  function closeTab(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setTabs(prev => {
      const next = prev.filter(t => t.id !== id);
      if (next.length === 0) return [makeTab('https://www.google.com')];
      return next;
    });
    setActiveId(prev => {
      if (prev !== id) return prev;
      const idx = tabs.findIndex(t => t.id === id);
      return tabs[Math.max(0, idx - 1)]?.id ?? tabs[0].id;
    });
  }

  function navigate(target: string) {
    const resolved = normalizeUrl(target);
    if (!resolved) return;
    webviewRefs.current.get(activeId)?.loadURL?.(resolved);
    setTabs(prev => prev.map(t => t.id === activeId ? { ...t, url: resolved, loading: true } : t));
    setInputVal(resolved);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { navigate(inputVal); inputRef.current?.blur(); }
    if (e.key === 'Escape') { setInputVal(activeTab?.url ?? ''); inputRef.current?.blur(); }
  }

  const wv = webviewRefs.current.get(activeId);

  return (
    <div className="flex flex-col w-full h-full select-none">

      {/* ── Barra de abas ─────────────────────────────────────────── */}
      <div className="flex items-end gap-0 px-2 pt-1 flex-shrink-0 overflow-x-auto"
        style={{ background: '#0d0d0d', borderBottom: '1px solid #1f1f1f', scrollbarWidth: 'none' }}>
        {tabs.map(tab => (
          <motion.button
            key={tab.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            onClick={() => setActiveId(tab.id)}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg flex-shrink-0 group cursor-pointer transition-colors"
            style={{
              maxWidth: 200, minWidth: 100,
              background: tab.id === activeId ? '#111' : 'transparent',
              borderTop: tab.id === activeId ? '1px solid #2a2a2a' : '1px solid transparent',
              borderLeft: tab.id === activeId ? '1px solid #2a2a2a' : '1px solid transparent',
              borderRight: tab.id === activeId ? '1px solid #2a2a2a' : '1px solid transparent',
              marginBottom: tab.id === activeId ? '-1px' : 0,
            }}>
            {tab.loading
              ? <div className="w-3 h-3 border border-[#3b82f6] border-t-transparent rounded-full animate-spin flex-shrink-0" />
              : tab.favicon
                ? <img src={tab.favicon} className="w-3 h-3 flex-shrink-0" alt="" onError={e => (e.currentTarget.style.display = 'none')} />
                : <Globe size={11} className="text-neutral-500 flex-shrink-0" />
            }
            <span className="text-xs truncate flex-1 text-left"
              style={{ color: tab.id === activeId ? '#e5e5e5' : '#737373' }}>
              {tab.title || 'Nova aba'}
            </span>
            {tabs.length > 1 && (
              <button onClick={e => closeTab(tab.id, e)}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-white/10 transition-all flex-shrink-0 cursor-pointer">
                <X size={10} className="text-neutral-400" />
              </button>
            )}
          </motion.button>
        ))}
        <button onClick={() => openTab()}
          className="flex items-center justify-center w-7 h-7 mb-0.5 ml-1 rounded-lg flex-shrink-0 text-neutral-500 hover:text-neutral-200 hover:bg-white/8 transition-colors cursor-pointer">
          <Plus size={14} />
        </button>
      </div>

      {/* ── Barra de endereço ─────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-3 py-2 flex-shrink-0"
        style={{ background: '#111', borderBottom: '1px solid #1f1f1f' }}>
        <button onClick={() => wv?.goBack?.()} disabled={!activeTab?.canGoBack}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-white disabled:opacity-20 transition-colors cursor-pointer">
          <ArrowLeft size={14} />
        </button>
        <button onClick={() => wv?.goForward?.()} disabled={!activeTab?.canGoFwd}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-white disabled:opacity-20 transition-colors cursor-pointer">
          <ArrowRight size={14} />
        </button>
        <button onClick={() => wv?.reload?.()}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer">
          <RotateCcw size={13} className={activeTab?.loading ? 'animate-spin' : ''} />
        </button>
        <div className="flex-1 flex items-center bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-1.5 gap-2 focus-within:border-[#3b82f6]/50 transition-colors">
          <Globe size={11} className="text-neutral-600 flex-shrink-0" />
          <input
            ref={inputRef}
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={e => e.target.select()}
            className="flex-1 bg-transparent text-xs text-neutral-200 outline-none placeholder:text-neutral-600 min-w-0"
            placeholder="Endereço ou busca..." />
        </div>
        <button onClick={() => openTab(inputVal)}
          className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-200 transition-colors cursor-pointer"
          title="Abrir em nova aba">
          <ExternalLink size={13} />
        </button>
      </div>

      {/* ── Webviews — uma por aba, mostrar/ocultar via CSS ────────── */}
      <div className="flex-1 relative min-h-0 bg-[#0a0a0a]">
        {tabs.map(tab => (
          <div
            key={tab.id}
            style={{ position: 'absolute', inset: 0, display: tab.id === activeId ? 'flex' : 'none' }}>
            {/* @ts-ignore */}
            <webview
              ref={(el: any) => bindWebview(tab.id, el)}
              src={tab.url}
              partition="persist:omni-browser"
              disablewebsecurity
              allowpopups
              style={{ width: '100%', height: '100%', display: 'flex' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const WISP_URL = 'wss://wisp.mercurywork.shop/';

function proxifyClient(url: string, base: string): string {
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

function rewriteHtmlClient(html: string, pageUrl: string): string {
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

// ── Navegador com libcurl.js (primário) + iframe proxy (fallback) ─────────────
function IframeBrowser({ initialUrl, lightMode = false, syncing = false, onSyncClick }: {
  initialUrl: string; lightMode?: boolean; syncing?: boolean; onSyncClick?: () => void;
}) {
  const [inputVal, setInputVal] = useState(initialUrl);
  const [loading, setLoading] = useState(true);
  const [navCount, setNavCount] = useState(0);
  const [srcDoc, setSrcDoc] = useState<string | null>(null);
  const [proxyUrl, setProxyUrl] = useState<string | null>(null);
  const [lcState, setLcState] = useState<'loading' | 'ready' | 'failed'>('loading');
  const lcRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const didInitRef = useRef(false);
  const currentUrlRef = useRef(initialUrl); // URL atual para deduplicação
  const lm = lightMode;

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(err =>
        console.warn('[SW]', err)
      );
    }
  }, []);

  // Carrega libcurl.js + WASM (named export { libcurl } — não usa .default)
  useEffect(() => {
    (async () => {
      try {
        await _libcurl.load_wasm('/libcurl.wasm');
        _libcurl.set_websocket(WISP_URL);
        lcRef.current = _libcurl;
        setLcState('ready');
      } catch (err) {
        console.warn('[libcurl] falhou ao carregar, usando proxy:', err);
        setLcState('failed');
      }
    })();
  }, []);

  const fetchWithLibcurl = useCallback(async (url: string) => {
    const lc = lcRef.current;
    if (!lc) throw new Error('libcurl não disponível');
    const resp = await lc.fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,*/*;q=0.9',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
      }
    });
    return await resp.text();
  }, []);

  const goLibcurl = useCallback(async (url: string) => {
    if (url.includes('/api/proxy?url=')) return;
    currentUrlRef.current = url;
    setLoading(true);
    setInputVal(url);
    try {
      const html = await fetchWithLibcurl(url);
      setSrcDoc(rewriteHtmlClient(html, url));
      setProxyUrl(null);
      setNavCount(c => c + 1);
      setLoading(false);
    } catch (err) {
      console.warn('[libcurl] fetch falhou, fallback proxy:', err);
      if (/^https?:\/\//i.test(url) && !url.includes('/api/proxy')) {
        setProxyUrl(url);
        setSrcDoc(null);
        setNavCount(c => c + 1);
      } else {
        setLoading(false);
      }
    }
  }, [fetchWithLibcurl]);

  // Navegação inicial após libcurl carregar
  useEffect(() => {
    if (didInitRef.current) return;
    if (lcState === 'ready') {
      didInitRef.current = true;
      goLibcurl(initialUrl);
    } else if (lcState === 'failed') {
      didInitRef.current = true;
      setProxyUrl(initialUrl);
      setSrcDoc(null);
      setNavCount(c => c + 1);
    }
  }, [lcState, initialUrl, goLibcurl]);

  // Safety timeout
  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), 12000);
    return () => clearTimeout(t);
  }, [loading, navCount]);

  // postMessage do iframe (cliques em links no srcDoc)
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.data?.type === 'omni-loading') { setLoading(true); return; }
      if (e.data?.type !== 'omni-nav') return;
      const url = e.data.url as string;
      if (!url) return;
      if (url.includes('/api/proxy?url=')) return;
      // Deduplicação: SPA (Google, etc.) pode enviar a mesma URL várias vezes
      if (url === currentUrlRef.current) { setLoading(false); return; }
      if (lcRef.current) goLibcurl(url);
      else if (/^https?:\/\//i.test(url)) { setProxyUrl(url); setSrcDoc(null); setInputVal(url); setNavCount(c => c + 1); }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [goLibcurl]);

  function navigate(target: string) {
    const resolved = normalizeUrl(target);
    if (!resolved) return;
    if (lcRef.current) goLibcurl(resolved);
    else { setProxyUrl(resolved); setSrcDoc(null); setInputVal(resolved); setLoading(true); setNavCount(c => c + 1); }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') navigate(inputVal);
  }

  function handleLoad() {
    setLoading(false);
    if (proxyUrl && !srcDoc) {
      try {
        const loc = iframeRef.current?.contentWindow?.location;
        if (loc) { const r = new URLSearchParams(loc.search).get('url'); if (r) setInputVal(r); }
      } catch {}
    }
  }

  const isInit = lcState === 'loading' && navCount === 0;

  const btnBase = lm
    ? { background: 'rgba(28,23,18,0.05)', border: '1px solid rgba(28,23,18,0.10)', color: '#4a3f36' }
    : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#747474' };
  const btnActive = lm
    ? { background: 'rgba(28,23,18,0.11)', border: '1px solid rgba(28,23,18,0.18)', color: '#1C1712' }
    : { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.13)', color: '#d0d0d0' };

  return (
    <div className="flex flex-col w-full h-full">
      {/* ── Barra única — espaço acima + URL + ações ─── */}
      <div style={{
        padding: '20px 16px 14px',
        background: lm ? '#EDE8DF' : '#111',
        borderBottom: lm ? '1px solid rgba(28,23,18,0.08)' : '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
      }}>
        {/* Input URL */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 10,
          paddingLeft: 16, paddingRight: 16, height: 52, borderRadius: 16,
          background: lm ? 'rgba(28,23,18,0.05)' : 'rgba(255,255,255,0.04)',
          border: lm ? '1px solid rgba(28,23,18,0.10)' : '1px solid rgba(255,255,255,0.07)',
        }}>
          {loading
            ? <div style={{ width: 13, height: 13, borderRadius: '50%', flexShrink: 0,
                border: lm ? '1.5px solid rgba(28,23,18,0.15)' : '1.5px solid rgba(255,255,255,0.12)',
                borderTopColor: lm ? 'rgba(28,23,18,0.55)' : 'rgba(255,255,255,0.55)',
                animation: 'spin 0.7s linear infinite' }} />
            : <Globe size={13} style={{ color: lm ? '#9a8f84' : '#464646', flexShrink: 0 }} />
          }
          <input value={inputVal} onChange={e => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown} onFocus={e => e.target.select()}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: lm ? '#1C1712' : '#d0d0d0', fontSize: 13, minWidth: 0 }}
            placeholder="Endereço ou busca..." />
        </div>

        {/* Botão Ir */}
        <button onClick={() => navigate(inputVal)}
          style={{ width: 52, height: 52, borderRadius: 16, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.15s', ...btnBase }}>
          <ArrowRight size={16} strokeWidth={1.8} />
        </button>

        {/* Botão Sincronizar ↔ Fechar */}
        <button onClick={onSyncClick}
          style={{ width: 52, height: 52, borderRadius: 16, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s', ...(syncing ? btnActive : btnBase) }}>
          <AnimatePresence mode="wait">
            <motion.div key={syncing ? 'x' : 'sync'}
              initial={{ opacity: 0, rotate: -20, scale: 0.75 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 20, scale: 0.75 }}
              transition={{ duration: 0.16 }}>
              {syncing ? <X size={16} strokeWidth={1.8} /> : <RefreshCw size={15} strokeWidth={1.8} />}
            </motion.div>
          </AnimatePresence>
        </button>
      </div>

      <div className="flex-1 relative min-h-0" style={{ background: lm ? '#F5F1EA' : '#0a0a0a' }}>
        {(loading || isInit) && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
            style={{ background: lm ? '#F5F1EA' : '#0a0a0a' }}>
            <div className="w-6 h-6 border-2 border-[#3b82f6] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {srcDoc !== null && (
          <iframe
            ref={iframeRef}
            key={'lc-' + navCount}
            srcDoc={srcDoc}
            className="w-full h-full border-0"
            onLoad={handleLoad}
            onError={() => setLoading(false)}
            title="Omni Browser"
            sandbox="allow-scripts allow-forms allow-modals allow-popups allow-same-origin"
          />
        )}
        {srcDoc === null && proxyUrl && (
          <iframe
            ref={iframeRef}
            key={'px-' + navCount}
            src={`/api/proxy?url=${encodeURIComponent(proxyUrl)}`}
            className="w-full h-full border-0"
            onLoad={handleLoad}
            onError={() => setLoading(false)}
            title="Omni Browser"
            sandbox="allow-same-origin allow-scripts allow-forms allow-modals"
          />
        )}
      </div>
    </div>
  );
}

// ── Modal principal — exportado ───────────────────────────────────────────────
interface BrowserViewProps {
  open: boolean;
  onClose: () => void;
  initialUrl?: string;
  lightMode?: boolean;
  onSync?: () => void;
}

export function BrowserView({ open, onClose, initialUrl = 'https://www.google.com', lightMode = false, onSync }: BrowserViewProps) {
  const [syncing, setSyncing] = useState(false);

  useEffect(() => { if (!open) setSyncing(false); }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const lm = lightMode;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[300] flex flex-col"
          style={{ background: lm ? '#F5F1EA' : '#0a0a0a' }}
        >
          {/* Titlebar — só para ElectronBrowser */}
          {isElectron && (
            <div className="flex items-center gap-3 px-4 py-2.5 flex-shrink-0"
              style={{
                background: lm ? '#EDE8DF' : '#111',
                borderBottom: lm ? '1px solid rgba(28,23,18,0.10)' : '1px solid #262626',
              }}>
              <div className="flex-1 min-w-0" />
              <button
                onClick={() => {
                  if (syncing) { onSync ? onSync() : onClose(); }
                  else setSyncing(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer flex-shrink-0"
                style={lm
                  ? { background: 'rgba(28,23,18,0.07)', color: '#1C1712' }
                  : { background: 'rgba(255,255,255,0.05)', color: '#a3a3a3' }}>
                <RefreshCw size={13} className={syncing ? 'animate-spin' : ''} />
                {syncing ? 'Fechar' : 'Sincronizar'}
              </button>
            </div>
          )}

          {/* Conteúdo: webview (Electron) ou iframe (browser) */}
          <div className="flex-1 min-h-0">
            {isElectron
              ? <ElectronBrowser initialUrl={initialUrl} />
              : <IframeBrowser
                  initialUrl={initialUrl}
                  lightMode={lm}
                  syncing={syncing}
                  onSyncClick={() => {
                    if (syncing) { onSync ? onSync() : onClose(); }
                    else setSyncing(true);
                  }}
                />
            }
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
