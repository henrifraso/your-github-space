import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowLeft, ArrowRight, RotateCcw, ExternalLink, Globe } from 'lucide-react';

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
  // inputVal é só a barra de endereço — NÃO alimenta o src do webview.
  // Navegações internas da página (pushState, redirects) atualizam a barra
  // sem disparar re-render do webview, quebrando o loop.
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

    // Só atualiza a barra de endereço — nunca o src do webview
    const onNavigate = (e: any) => {
      const newUrl = e.url || '';
      if (newUrl) setInputVal(newUrl);
      refreshNav();
      if (newUrl && window.electron) {
        window.electron.captureNavigation({ url: newUrl, title: pageTitleRef.current, ts: Date.now() });
      }
    };

    const onTitle = (e: any) => {
      pageTitleRef.current = e.title || '';
    };

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
  }, [refreshNav]); // sem pageTitle nas deps — usamos ref pra evitar re-attach de listeners

  function navigate(target: string) {
    const resolved = normalizeUrl(target);
    if (!resolved) return;
    setInputVal(resolved);
    // loadURL direto no elemento — não passa pelo src/state do React
    webviewRef.current?.loadURL?.(resolved);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') navigate(inputVal);
  }

  return (
    <div className="flex flex-col w-full h-full">
      {/* Barra de endereço */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#111] border-b border-[#262626] flex-shrink-0">
        <button
          onClick={() => webviewRef.current?.goBack?.()}
          disabled={!canGoBack}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
        >
          <ArrowLeft size={15} />
        </button>
        <button
          onClick={() => webviewRef.current?.goForward?.()}
          disabled={!canGoFwd}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
        >
          <ArrowRight size={15} />
        </button>
        <button
          onClick={() => webviewRef.current?.reload?.()}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <RotateCcw size={14} className={loading ? 'animate-spin' : ''} />
        </button>

        <div className="flex-1 flex items-center bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-1.5 gap-2">
          <Globe size={12} className="text-neutral-500 flex-shrink-0" />
          <input
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={e => e.target.select()}
            className="flex-1 bg-transparent text-xs text-neutral-200 outline-none placeholder:text-neutral-600 min-w-0"
            placeholder="Endereço ou busca..."
          />
        </div>

        <a
          href={inputVal}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors"
          title="Abrir no navegador externo"
        >
          <ExternalLink size={14} />
        </a>
      </div>

      {/* Webview — sem restrição de CORS no Electron */}
      <div className="flex-1 relative min-h-0">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a] z-10 pointer-events-none">
            <div className="w-6 h-6 border-2 border-[#3b82f6] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore — webview aceita booleanos como atributos Chromium */}
        <webview
          ref={webviewRef as any}
          src={initialUrl}
          disablewebsecurity
          allowpopups
          style={{ width: '100%', height: '100%', display: 'flex' }}
        />
      </div>
    </div>
  );
}

// ── Fallback com <iframe> — browser normal ────────────────────────────────────
function IframeBrowser({ initialUrl }: { initialUrl: string }) {
  const [url, setUrl] = useState(initialUrl);
  const [inputVal, setInputVal] = useState(initialUrl);
  const [blocked, setBlocked] = useState(false);

  function navigate(target: string) {
    const resolved = normalizeUrl(target);
    if (!resolved) return;
    setUrl(resolved);
    setInputVal(resolved);
    setBlocked(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') navigate(inputVal);
  }

  return (
    <div className="flex flex-col w-full h-full">
      {/* Aviso */}
      <div className="px-3 py-2 bg-[#1a1a0a] border-b border-[#3a3a1a] text-xs text-[#f59e0b] flex items-center gap-2 flex-shrink-0">
        <span>⚠️</span>
        <span>Modo browser: alguns sites bloqueiam iframe. Use o app desktop para navegação completa.</span>
      </div>

      {/* Barra de endereço */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#111] border-b border-[#262626] flex-shrink-0">
        <div className="flex-1 flex items-center bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-1.5 gap-2">
          <Globe size={12} className="text-neutral-500 flex-shrink-0" />
          <input
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={e => e.target.select()}
            className="flex-1 bg-transparent text-xs text-neutral-200 outline-none placeholder:text-neutral-600 min-w-0"
            placeholder="Endereço ou busca..."
          />
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3b82f6] text-white text-xs font-medium hover:bg-[#2563eb] transition-colors whitespace-nowrap"
        >
          <ExternalLink size={12} />
          Abrir
        </a>
      </div>

      {/* iframe */}
      <div className="flex-1 relative min-h-0 bg-[#0a0a0a]">
        {blocked ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-8">
            <span className="text-4xl">🔒</span>
            <p className="text-sm text-neutral-400">Este site bloqueou a exibição em iframe.</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3b82f6] text-white text-sm font-medium hover:bg-[#2563eb] transition-colors"
            >
              <ExternalLink size={14} />
              Abrir em nova aba
            </a>
            <p className="text-xs text-neutral-600">Use o Omni Desktop para navegar sem restrições.</p>
          </div>
        ) : (
          <iframe
            key={url}
            src={url}
            className="w-full h-full border-0"
            onError={() => setBlocked(true)}
            title="Omni Browser"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
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
}

export function BrowserView({ open, onClose, initialUrl = 'https://www.google.com' }: BrowserViewProps) {
  // Fechar com Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[300] flex flex-col">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Janela do browser */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 340 }}
            className="relative m-auto w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl border border-[#262626] bg-[#0a0a0a] flex flex-col"
            style={{ height: '82vh' }}
          >
            {/* Titlebar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#111] border-b border-[#262626] flex-shrink-0">
              <div className="flex items-center gap-2">
                <Globe size={14} className="text-[#3b82f6]" />
                <span className="text-xs font-semibold text-neutral-300">
                  {isElectron ? 'Navegador Omni' : 'Sincronizar'}
                </span>
                {isElectron && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#3b82f6]/20 text-[#60a5fa] font-medium">
                    sem CORS
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Conteúdo: webview (Electron) ou iframe (browser) */}
            <div className="flex-1 min-h-0">
              {isElectron
                ? <ElectronBrowser initialUrl={initialUrl} />
                : <IframeBrowser initialUrl={initialUrl} />
              }
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
