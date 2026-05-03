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
    $scramjet?: any;
    $scramjetController?: {
      Controller: new (init: { serviceworker: ServiceWorker; transport: any }) => ScramjetController;
      config: {
        prefix: string;
        scramjetPath: string;
        injectPath: string;
        wasmPath: string;
        virtualWasmPath: string;
      };
    };
  }
}

interface ScramjetController {
  wait(): Promise<void>;
  createFrame(el: HTMLIFrameElement): ScramjetFrame;
}
interface ScramjetFrame {
  go(url: string): void;
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

// URL do Wisp server — Railway (fallback: localhost dev)
const WISP_URL = (import.meta as any).env?.VITE_WISP_URL ?? 'ws://localhost:3003';

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^[\w-]+\.[\w.-]+/.test(trimmed)) return `https://${trimmed}`;
  return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

function timeout<T>(ms: number, msg: string): Promise<T> {
  return new Promise((_, reject) => setTimeout(() => reject(new Error(msg)), ms));
}

// Singleton — inicializa Scramjet uma única vez por sessão
let scramjetPromise: Promise<ScramjetController> | null = null;

function getScramjetController(): Promise<ScramjetController> {
  if (scramjetPromise) return scramjetPromise;

  // Listener registrado ANTES de qualquer await — garante que não perde o evento
  const controllerReady = new Promise<ServiceWorker>(resolve => {
    if (navigator.serviceWorker.controller) { resolve(navigator.serviceWorker.controller); return; }
    navigator.serviceWorker.addEventListener('controllerchange', function h() {
      navigator.serviceWorker.removeEventListener('controllerchange', h);
      resolve(navigator.serviceWorker.controller!);
    });
  });

  scramjetPromise = (async () => {
    // 1. Carregar runtime Scramjet (define window.$scramjet)
    await loadScript('/scramjet/scramjet.js');
    // 2. Carregar controller API (lê window.$scramjet, define window.$scramjetController)
    await loadScript('/controller/controller.api.js');
    // 3. Registrar SW — clients.claim() no activate dispara controllerchange
    await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    const sw = await Promise.race([
      controllerReady,
      timeout<never>(12000, 'Service Worker timeout — recarregue a página'),
    ]);
    // 4. Inicializar transporte Epoxy (Wisp)
    const { default: EpoxyTransport } = await import('@mercuryworkshop/epoxy-transport');
    const transport = new EpoxyTransport({ wisp: WISP_URL });
    // 5. Criar controller
    const Controller = window.$scramjetController!.Controller;
    const controller = new Controller({ serviceworker: sw, transport });
    await Promise.race([
      controller.wait(),
      timeout<never>(15000, 'Controller timeout — verifique o servidor Wisp'),
    ]);
    return controller;
  })().catch(err => {
    scramjetPromise = null; // permite retry em caso de falha
    throw err;
  });
  return scramjetPromise;
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

// ── Navegador com Scramjet Service Worker — browser normal ───────────────────
function IframeBrowser({ initialUrl, lightMode = false }: { initialUrl: string; lightMode?: boolean }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [inputVal, setInputVal] = useState(initialUrl);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const frameRef = useRef<ScramjetFrame | null>(null);
  const pendingNavRef = useRef<string | null>(null);
  const lm = lightMode;

  // Inicializar Scramjet e criar frame quando o iframe montar
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getScramjetController()
      .then(controller => {
        if (cancelled || !iframeRef.current) return;
        const frame = controller.createFrame(iframeRef.current);
        frameRef.current = frame;
        const target = pendingNavRef.current ?? initialUrl;
        pendingNavRef.current = null;
        frame.go(normalizeUrl(target) || initialUrl);
      })
      .catch(err => {
        if (cancelled) return;
        console.error('Scramjet init error:', err);
        setError('Não foi possível inicializar o navegador. Verifique a conexão.');
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [initialUrl]);

  // Spinner: ouve postMessage do frame (Scramjet injeta tracker compatível)
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.data?.type === 'omni-loading') setLoading(true);
      if (e.data?.type === 'omni-nav') {
        setLoading(false);
        const url = e.data.url as string;
        if (url) setInputVal(url);
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  function handleIframeLoad() {
    setLoading(false);
  }

  function navigate(target: string) {
    const resolved = normalizeUrl(target);
    if (!resolved) return;
    setInputVal(resolved);
    setLoading(true);
    if (frameRef.current) {
      frameRef.current.go(resolved);
    } else {
      pendingNavRef.current = resolved;
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') navigate(inputVal);
  }

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

      {/* Área do iframe */}
      <div className="flex-1 relative min-h-0" style={{ background: lm ? '#F5F1EA' : '#0a0a0a' }}>
        {loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
            style={{ background: lm ? '#F5F1EA' : '#0a0a0a' }}>
            <div className="w-6 h-6 border-2 border-[#3b82f6] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 px-6"
            style={{ background: lm ? '#F5F1EA' : '#0a0a0a' }}>
            <p className="text-xs text-center" style={{ color: lm ? '#7a6f64' : '#737373' }}>{error}</p>
            <button onClick={() => { setError(null); setLoading(true); scramjetPromise = null; navigate(inputVal); }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
              style={{ background: '#3b82f6', color: '#fff' }}>
              Tentar novamente
            </button>
          </div>
        )}
        <iframe
          ref={iframeRef}
          className="w-full h-full border-0"
          onLoad={handleIframeLoad}
          title="Omni Browser"
          style={{ display: error ? 'none' : 'block' }}
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

          {/* Conteúdo: webview (Electron) ou Scramjet (browser) */}
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
