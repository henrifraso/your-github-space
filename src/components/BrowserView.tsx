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
import { ScoreOS1Panel } from '../features/score/ScoreOS1Panel';

// URLs internas do OS¹ — renderizam React, não webview/iframe
const OS1_INTERNAL_URLS = ['os1://score', 'os1://contexto'];

// ── Modal principal — exportado ───────────────────────────────────────────────
interface BrowserViewProps {
  open: boolean;
  onClose: () => void;
  initialUrl?: string;
  lightMode?: boolean;
  onSync?: () => void;
  activeSector?: string;
  role?: string;
}

export function BrowserView({ open, onClose, initialUrl = 'os1://score', lightMode = false, onSync, activeSector, role }: BrowserViewProps) {
  const [syncing, setSyncing] = useState(false);

  useEffect(() => { if (!open) setSyncing(false); }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const lm = lightMode;
  const isInternal = OS1_INTERNAL_URLS.includes(initialUrl);

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
          {/* Conteúdo: página interna OS¹, webview (Electron) ou iframe (browser) */}
          <div className="flex-1 min-h-0">
            {isInternal
              ? <ScoreOS1Panel onClose={onClose} activeSector={activeSector} role={role} />
              : isElectron
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
