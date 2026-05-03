import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowLeft, ArrowRight, RotateCcw, ExternalLink, Globe, RefreshCw } from 'lucide-react';

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

// ── Navegador com iframe + proxy server-side — browser normal ─────────────────
function IframeBrowser({ initialUrl, lightMode = false }: { initialUrl: string; lightMode?: boolean }) {
  // iframeUrl controla quando o iframe remonta (só muda via navigate())
  // url/inputVal são só a barra de endereço (atualizam via onLoad/postMessage)
  const [iframeUrl, setIframeUrl] = useState(initialUrl);
  const [inputVal, setInputVal] = useState(initialUrl);
  const [loading, setLoading] = useState(true);
  const [navCount, setNavCount] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const lm = lightMode;

  function toProxyUrl(realUrl: string): string {
    return `/api/proxy?url=${encodeURIComponent(realUrl)}`;
  }

  function navigate(target: string) {
    const resolved = normalizeUrl(target);
    if (!resolved) return;
    setIframeUrl(resolved);
    setInputVal(resolved);
    setLoading(true);
    setNavCount(c => c + 1);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') navigate(inputVal);
  }

  // Atualiza só a barra de endereço quando iframe navega — não remonta
  function handleLoad() {
    setLoading(false);
    try {
      const loc = iframeRef.current?.contentWindow?.location;
      if (loc) {
        const realUrl = new URLSearchParams(loc.search).get('url');
        if (realUrl) setInputVal(realUrl);
      }
    } catch {}
  }

  // Navegação interna via postMessage (SPAs, tracker injected)
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.data?.type === 'omni-loading') { setLoading(true); return; }
      if (e.data?.type !== 'omni-nav') return;
      try {
        const realUrl = new URLSearchParams(new URL(e.data.url as string).search).get('url');
        if (realUrl) setInputVal(realUrl);
      } catch {}
      setLoading(false);
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <div className="flex flex-col w-full h-full">
      {/* Barra de endereço */}
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

      {/* iframe via proxy */}
      <div className="flex-1 relative min-h-0" style={{ background: lm ? '#F5F1EA' : '#0a0a0a' }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
            style={{ background: lm ? '#F5F1EA' : '#0a0a0a' }}>
            <div className="w-6 h-6 border-2 border-[#3b82f6] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <iframe
          ref={iframeRef}
          key={iframeUrl + navCount}
          src={toProxyUrl(iframeUrl)}
          className="w-full h-full border-0"
          onLoad={handleLoad}
          onError={() => setLoading(false)}
          title="Omni Browser"
          sandbox="allow-same-origin allow-scripts allow-forms allow-modals"
        />
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
