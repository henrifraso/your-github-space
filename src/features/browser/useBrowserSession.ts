// Tipos e helpers de sessão do Navegador OS¹.
//
// Conteúdo movido de src/components/BrowserView.tsx (Fase 12):
//   - `declare global` para `window.electron` (Electron preload IPC),
//     `desktop` (Desktop Capture — PAUSADO atrás de flags) e `sck`
//     (ScreenCaptureKit — também PAUSADO).
//   - tipo `WebviewElement` (subconjunto da API <webview> Chromium)
//   - tipo `Tab` e helper `makeTab` (sistema de abas do Electron browser)
//
// IMPORTANTE: nenhum gating (`ENABLE_DESKTOP_CAPTURE`, `ENABLE_SCK`, etc.)
// é controlado aqui — só TIPOS. A flag continua intocada nos componentes
// que decidem se chamam ou não as APIs.

import { normalizeUrl } from './browser-url-utils';

declare global {
  interface Window {
    electron?: {
      isElectron: boolean;
      platform?: string;
      captureNavigation: (data: { url: string; title: string; ts: number }) => void;
      saveOffline: (key: string, data: unknown) => Promise<{ ok: boolean; file?: string }>;
      onNavigationUpdate: (cb: (data: unknown) => void) => void;
      openExternal?: (url: string) => Promise<boolean>;
      desktop?: {
        isEnabled: () => Promise<boolean>;
        listSources: () => Promise<{ ok: boolean; reason?: string; message?: string; sources: any[]; displays?: any[]; hostDisplayId?: string | null; primaryDisplayId?: string | null; windowState?: { isMaximized: boolean; isFullScreen: boolean; isMinimized: boolean; compactModeActive: boolean } | null }>;
        getPrimaryDisplay: () => Promise<any>;
        openSystemScreenPrefs: () => Promise<boolean>;
        hideWindow: () => Promise<boolean>;
        showWindow: () => Promise<boolean>;
        setCompactMode: (enable: boolean) => Promise<boolean>;
        isCompactMode: () => Promise<boolean>;
        getWindowState: () => Promise<{ isMaximized: boolean; isFullScreen: boolean; isMinimized: boolean; isAlwaysOnTop: boolean; bounds: { x: number; y: number; width: number; height: number }; displayCount: number; compactModeActive: boolean } | null>;
      };
      sck?: {
        status: () => Promise<{ enabled: boolean; available: boolean; loadError: string | null; platform: string; pid: number; isMacOS: boolean }>;
        listContent: () => Promise<{ ok: boolean; error?: string; windows?: any[]; displays?: any[]; selfWindowIds?: number[]; selfPid?: number }>;
        start: (opts?: { fps?: number; scale?: number; jpegQuality?: number }) => Promise<{ ok: boolean; error?: string; selfWindowIds?: number[]; targetDisplayId?: number }>;
        stop: () => Promise<{ ok: boolean; error?: string }>;
        getFrame: () => Promise<Uint8Array | null>;
        getStats: () => Promise<{ running: boolean; frameCount: number; latestSize: number; available: boolean }>;
      };
    };
  }
}

// `webview` é um elemento Chromium/Electron — React tem tipos parciais,
// então usamos `any` no ref e este wrapper estrutural só pra digitar os
// métodos que o BrowserView consome.
export type WebviewElement = HTMLElement & {
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

// ── Tipos para o sistema de abas ─────────────────────────────────────
export interface Tab {
  id: string;
  url: string;
  title: string;
  favicon: string;
  loading: boolean;
  canGoBack: boolean;
  canGoFwd: boolean;
}

export function makeTab(url: string): Tab {
  return {
    id: crypto.randomUUID(),
    url,
    title: new URL(url).hostname,
    favicon: '',
    loading: true,
    canGoBack: false,
    canGoFwd: false,
  };
}

// Helper conveniente: cria uma aba já com `normalizeUrl` aplicada.
// Espelha o padrão usado dentro do ElectronBrowser quando uma nova
// tab é criada a partir de input do usuário.
export function makeTabFromInput(raw: string): Tab {
  return makeTab(normalizeUrl(raw));
}
