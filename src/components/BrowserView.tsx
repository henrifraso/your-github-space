// BrowserView — fachada/router do Navegador OS¹.
//
// Decide entre Electron <webview> e iframe fallback baseado em `isElectron`.
// Os dois implementadores vivem em `src/features/browser/`:
//   - ElectronBrowserView.tsx   (webview Chromium + abas + 10 ações)
//   - IframeBrowserFallback.tsx (libcurl.js + iframe proxy + 10 ações)
//
// Helpers e tipos compartilhados:
//   - browser-url-utils.ts      (normalizeUrl, proxifyClient, rewriteHtmlClient, DESKTOP_URL, WISP_URL, isElectron)
//   - useBrowserSession.ts      (Tab, makeTab, WebviewElement, declare global window.electron)
//
// Esta refatoração (Fase 12) NÃO mudou nada de UX, visual, fluxo do
// Electron, fallback ou bloqueio do Desktop Capture — só reorganizou
// os módulos. ChatPanel/App continuam importando { BrowserView }
// daqui mesmo.

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { isElectron } from '../features/browser/browser-url-utils';
import { ElectronBrowser } from '../features/browser/ElectronBrowserView';
import { IframeBrowser } from '../features/browser/IframeBrowserFallback';

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
          {/* Conteúdo: webview (Electron) ou iframe (browser) */}
          <div className="flex-1 min-h-0">
            {isElectron
              ? <ElectronBrowser initialUrl={initialUrl} syncing={syncing} onSyncClick={() => {
                  if (syncing) { onSync ? onSync() : onClose(); }
                  else setSyncing(true);
                }} />
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
