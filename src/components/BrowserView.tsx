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
import { X } from 'lucide-react';
import { isElectron } from '../features/browser/browser-url-utils';
import { ElectronBrowser } from '../features/browser/ElectronBrowserView';
import { IframeBrowser } from '../features/browser/IframeBrowserFallback';
import { ScoreOS1Panel, type ScoreInsight } from '../features/score/ScoreOS1Panel';

// URLs internas do OS¹ — renderizam React, não webview/iframe
const OS1_INTERNAL_URLS = ['os1://score', 'os1://contexto'];

const SECTOR_DISPLAY_URL: Record<string, string> = {
  'oscar-piloto-01': 'www.oscarcalcados.com.br/score',
  nike:              'www.oscarcalcados.com.br/score',
  nubank:            'www.drogariaspacheco.com.br/score',
  mcdonalds:         'www.mcdonalds.com.br/score',
  ifood:             'www.ifood.com.br/score',
  ambev:             'www.ambev.com.br/score',
  magalu:            'www.magazineluiza.com.br/score',
  embraer:           'www.embraer.com/score',
  tesla:             'www.tesla.com/score',
  netflix:           'www.netflix.com/score',
  spotify:           'www.spotify.com/score',
  airbnb:            'www.airbnb.com.br/score',
  uber:              'www.uber.com/score',
  apple:             'www.apple.com/score',
  amazon:            'www.amazon.com.br/score',
  natura:            'www.natura.com.br/score',
  'cerveja-imperio':                  'www.cervejaimperio.com.br/score',
  'cerveja-imperio-distribuidora-01': 'www.cervejaimperio.com.br/score',
  os1:               'www.os1.space/score',
};

// Topo do Score OS¹ — pill flutuante igual ao nav da bio e ao header do mapa
function InternalPageBar({ onClose }: { activeSector?: string; onClose?: () => void }) {
  return (
    <div className="flex-shrink-0 px-5 pt-8 pb-2 bg-[#dcdfe2] dark:bg-[#181818]">
      <div className="bg-[#f0f2f4] dark:bg-[#323232] border-[0.5px] border-neutral-100 dark:border-[#414141] rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.18),0_1px_3px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.5),0_1px_3px_rgba(0,0,0,0.3)] px-4 py-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">Score OS¹</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-[#2a2a2a] transition-colors">
            <X size={13} />
          </button>
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
  activeSector?: string;
  role?: string;
  insights?: ScoreInsight[];
}

export function BrowserView({ open, onClose, initialUrl = 'https://www.google.com', lightMode = false, onSync, activeSector, role, insights }: BrowserViewProps) {
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
          {/* Página interna OS¹: shell do navegador + Score na área de conteúdo */}
          {isInternal ? (
            <div className="flex-1 min-h-0 overflow-hidden">
              <ScoreOS1Panel activeSector={activeSector} role={role} standalone={false} insights={insights} onClose={onClose} />
            </div>
          ) : (
            /* URL externa: navegador normal (Electron webview ou iframe) */
            <div className="flex-1 min-h-0">
              {isElectron
                ? <ElectronBrowser initialUrl={initialUrl} syncing={syncing} activeSector={activeSector} onSyncClick={() => {
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
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
