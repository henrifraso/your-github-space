import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowLeft, ArrowRight, RotateCcw, ExternalLink, Globe, RefreshCw } from 'lucide-react';
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

// ── Navegador com <webview> — só funciona dentro do Electron ─────────────────
function ElectronBrowser({ initialUrl }: { initialUrl: string }) {
  const webviewRef = useRef<WebviewElement | null>(null);
  const [inputVal, setInputVal] = useState(initialUrl);
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoFwd, setCanGoFwd] = useState(false);
  const pageTitleRef = useRef('');

  const refreshNav = useCallback(() => {
    const wv = webviewRef.current;
    if (!wv) return;
    setCanGoBack(wv.canGoBack?.() ?? false);
    setCanGoFwd(wv.canGoForward?.() ?? false);
  }, []);

  useEffect(() => {
    const wv = webviewRef.current;
    if (!wv) return;

    const onStart = () => setLoading(true);
    const onStop = () => { setLoading(false); refreshNav(); };

    const onNavigate = (e: any) => {
      const newUrl = e.url || '';
      if (newUrl) setInputVal(newUrl);
      refreshNav();
      if (newUrl && window.electron) {
        window.electron.captureNavigation({ url: newUrl, title: pageTitleRef.current, ts: Date.now() });
      }
    };

    const onTitle = (e: any) => { pageTitleRef.current = e.title || ''; };

    wv.addEventListener('did-start-loading', onStart);
    wv.addEventListener('did-stop-loading', onStop);
    wv.addEventListener('did-navigate', onNavigate);
    wv.addEventListener('did-navigate-in-page', onNavigate);
    wv.addEventListener('page-title-updated', onTitle);

    return () => {
      wv.removeEventListener('did-start-loading', onStart);
      wv.removeEventListener('did-stop-loading', onStop);
      wv.removeEventListener('did-navigate', onNavigate);
      wv.removeEventListener('did-navigate-in-page', onNavigate);
      wv.removeEventListener('page-title-updated', onTitle);
    };
  }, [refreshNav]);

  function navigate(target: string) {
    const resolved = normalizeUrl(target);
    if (!resolved) return;
    setInputVal(resolved);
    webviewRef.current?.loadURL?.(resolved);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') navigate(inputVal);
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex items-center gap-2 px-3 py-2 bg-[#111] border-b border-[#262626] flex-shrink-0">
        <button onClick={() => webviewRef.current?.goBack?.()} disabled={!canGoBack}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-white disabled:opacity-30 transition-colors cursor-pointer">
          <ArrowLeft size={15} />
        </button>
        <button onClick={() => webviewRef.current?.goForward?.()} disabled={!canGoFwd}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-white disabled:opacity-30 transition-colors cursor-pointer">
          <ArrowRight size={15} />
        </button>
        <button onClick={() => webviewRef.current?.reload?.()}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer">
          <RotateCcw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
        <div className="flex-1 flex items-center bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-1.5 gap-2">
          <Globe size={12} className="text-neutral-500 flex-shrink-0" />
          <input value={inputVal} onChange={e => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown} onFocus={e => e.target.select()}
            className="flex-1 bg-transparent text-xs text-neutral-200 outline-none placeholder:text-neutral-600 min-w-0"
            placeholder="Endereço ou busca..." />
        </div>
        <a href={inputVal} target="_blank" rel="noopener noreferrer"
          className="p-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors"
          title="Abrir no navegador externo">
          <ExternalLink size={14} />
        </a>
      </div>
      <div className="flex-1 relative min-h-0">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a] z-10 pointer-events-none">
            <div className="w-6 h-6 border-2 border-[#3b82f6] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {/* @ts-ignore */}
        <webview ref={webviewRef as any} src={initialUrl} disablewebsecurity allowpopups
          style={{ width: '100%', height: '100%', display: 'flex' }} />
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
  html = html.replace(/\starget=["']_blank["']/gi, '');
  html = html.replace(/(\s(?:href|src|action|data-src|poster)=")([^"]+)(")/g,
    (_, a, u, b) => u.startsWith('/api/proxy') ? _ : a + proxifyClient(u, pageUrl) + b);
  html = html.replace(/(\s(?:href|src|action|data-src|poster)=')([^']+)(')/g,
    (_, a, u, b) => u.startsWith('/api/proxy') ? _ : a + proxifyClient(u, pageUrl) + b);
  const pageOrigin = (() => { try { return new URL(pageUrl).origin; } catch { return ''; } })();
  const tracker = `<script>(function(){
// ── Guarda referência real do parent ANTES de sobrescrever ──────────────────
var __rp=window.parent;
// ── Fix iframe detection: window.top/parent/self apontam para si mesmo ──────
try{Object.defineProperty(window,'top',{get:function(){return window;},configurable:true});}catch(e){}
try{Object.defineProperty(window,'parent',{get:function(){return window;},configurable:true});}catch(e){}
try{Object.defineProperty(window,'self',{get:function(){return window;},configurable:true});}catch(e){}
// ────────────────────────────────────────────────────────────────────────────
var BASE=${JSON.stringify(pageUrl)};
var BASE_ORIGIN=${JSON.stringify(pageOrigin)};
// ── Fake location com URL real da página ─────────────────────────────────────
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
}catch(e){}
// ─────────────────────────────────────────────────────────────────────────────
function nav(url){try{__rp.postMessage({type:'omni-nav',url:url},'*')}catch(e){}}
function loading(){try{__rp.postMessage({type:'omni-loading'},'*')}catch(e){}}
function toReal(u){
  try{
    var abs=new URL(u,BASE).href;
    var p=new URL(abs).searchParams.get('url');
    return p||abs;
  }catch(e){return u;}
}
function intercept(u){
  if(!u)return false;
  try{
    var abs=new URL(u,BASE).href;
    if(abs.includes('/api/proxy?url='))return false; // já é proxy — ignorar
    nav(toReal(abs));
    return true;
  }catch(e){return false;}
}
// Intercepta location.assign e location.replace
try{
  var lp=Location.prototype;
  var oa=lp.assign.bind(location);
  lp.assign=function(u){if(!intercept(u))oa(u);};
  var or=lp.replace.bind(location);
  lp.replace=function(u){if(!intercept(u))or(u);};
}catch(e){}
// Intercepta location.href setter
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
// Intercepta submit de formulários GET
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
// Intercepta cliques em links <a>
document.addEventListener('click',function(e){
  var el=e.target;while(el&&el.nodeName!=='A')el=el.parentElement;
  if(!el)return;
  var href=el.getAttribute('href');
  if(!href||href.startsWith('javascript:')||href.startsWith('#')||href.startsWith('mailto:'))return;
  e.preventDefault();e.stopPropagation();loading();nav(toReal(href));
},true);
})();</script>`;
  return /<head/i.test(html)
    ? html.replace(/(<head[^>]*>)/i, '$1' + tracker)
    : tracker + html;
}

// ── Navegador com libcurl.js (primário) + iframe proxy (fallback) ─────────────
function IframeBrowser({ initialUrl, lightMode = false }: { initialUrl: string; lightMode?: boolean }) {
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
      navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister()));
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
      }
    });
    return await resp.text();
  }, []);

  const goLibcurl = useCallback(async (url: string) => {
    if (url.includes('/api/proxy?url=')) return;
    currentUrlRef.current = url;
    setLoading(true);
    setNavCount(c => c + 1);
    setInputVal(url);
    try {
      const html = await fetchWithLibcurl(url);
      setSrcDoc(rewriteHtmlClient(html, url));
      setProxyUrl(null);
      setLoading(false);
    } catch (err) {
      console.warn('[libcurl] fetch falhou, fallback proxy:', err);
      // Só usa proxy se a URL for absoluta e externa (não já proxiada)
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
      if (url === currentUrlRef.current) return;
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

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex items-center gap-2 px-3 py-2 flex-shrink-0"
        style={{
          background: lm ? '#EDE8DF' : '#111',
          borderBottom: lm ? '1px solid rgba(28,23,18,0.10)' : '1px solid #262626',
        }}>
        <div className="flex-1 flex items-center rounded-lg px-3 py-1.5 gap-2"
          style={{
            background: lm ? 'rgba(28,23,18,0.06)' : '#1a1a1a',
            border: lm ? '1px solid rgba(28,23,18,0.12)' : '1px solid #333',
          }}>
          <Globe size={12} style={{ color: lm ? '#7a6f64' : '#737373', flexShrink: 0 }} />
          <input value={inputVal} onChange={e => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown} onFocus={e => e.target.select()}
            className="flex-1 bg-transparent text-xs outline-none min-w-0"
            style={{ color: lm ? '#1C1712' : '#e5e5e5' }}
            placeholder="Endereço ou busca..." />
        </div>
        <button onClick={() => navigate(inputVal)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer"
          style={lm
            ? { background: 'rgba(28,23,18,0.08)', color: '#1C1712' }
            : { background: '#3b82f6', color: '#fff' }}>
          <ArrowRight size={12} />
          Ir
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
            sandbox="allow-scripts allow-forms allow-modals allow-popups"
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
          {/* Titlebar */}
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
              <AnimatePresence mode="wait">
                {syncing ? (
                  <motion.span key="entrar"
                    initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.18 }}
                    className="flex items-center gap-1 overflow-hidden whitespace-nowrap">
                    {lm ? 'Entrar' : <><X size={11} /> Fechar</>}
                  </motion.span>
                ) : (
                  <motion.span key="sincronizar"
                    initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.18 }}
                    className="overflow-hidden whitespace-nowrap">
                    Sincronizar
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Conteúdo: webview (Electron) ou iframe (browser) */}
          <div className="flex-1 min-h-0">
            {isElectron
              ? <ElectronBrowser initialUrl={initialUrl} />
              : <IframeBrowser initialUrl={initialUrl} lightMode={lm} />
            }
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
