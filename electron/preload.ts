import { contextBridge, ipcRenderer } from 'electron';

interface DesktopSource {
  id: string;
  name: string;
  display_id: string;
  thumbnailDataURL: string;
}

interface ListSourcesResult {
  ok: boolean;
  reason?: 'disabled' | 'error';
  message?: string;
  sources: DesktopSource[];
}

interface PrimaryDisplay {
  id: number;
  bounds: { x: number; y: number; width: number; height: number };
  workArea: { x: number; y: number; width: number; height: number };
  scaleFactor: number;
  rotation: number;
}

contextBridge.exposeInMainWorld('electron', {
  isElectron: true,
  platform: process.platform,

  captureNavigation: (data: { url: string; title: string; ts: number }) => {
    ipcRenderer.send('navigation-captured', data);
  },

  saveOffline: (key: string, data: unknown): Promise<{ ok: boolean; file?: string }> =>
    ipcRenderer.invoke('save-offline', key, data),

  onNavigationUpdate: (cb: (data: unknown) => void) => {
    ipcRenderer.on('navigation-update', (_e, data) => cb(data));
  },

  getPlatform: (): Promise<string> => ipcRenderer.invoke('get-platform'),

  // Abrir URL no navegador externo padrão do SO.
  openExternal: (url: string): Promise<boolean> => ipcRenderer.invoke('shell:open-external', url),

  // ─── POC Desktop Capture (Nível 2) — PAUSADO em 2026-05-28 ─────────────
  //     Motivo: desktopCapturer puro gera espelho/preto em 1 monitor.
  //     Reativar com window-exclusion (Win SetWindowDisplayAffinity / macOS SCK).
  //     Tudo abaixo só é visível na UI quando ENABLE_DESKTOP_CAPTURE=true (ou as outras flags).
  // Toda comunicação passa pelo main process. Nada fora do Electron.
  desktop: {
    isEnabled: (): Promise<boolean> => ipcRenderer.invoke('desktop:is-enabled'),
    listSources: (): Promise<ListSourcesResult> => ipcRenderer.invoke('desktop:list-sources'),
    getPrimaryDisplay: (): Promise<PrimaryDisplay | null> => ipcRenderer.invoke('desktop:get-primary-display'),
    openSystemScreenPrefs: (): Promise<boolean> => ipcRenderer.invoke('desktop:open-system-prefs'),
    // Anti-self-capture: minimizar, restaurar, ativar/sair de modo compacto.
    hideWindow: (): Promise<boolean> => ipcRenderer.invoke('desktop:hide-window'),
    showWindow: (): Promise<boolean> => ipcRenderer.invoke('desktop:show-window'),
    setCompactMode: (enable: boolean): Promise<boolean> => ipcRenderer.invoke('desktop:set-compact-mode', enable),
    isCompactMode: (): Promise<boolean> => ipcRenderer.invoke('desktop:is-compact-mode'),
    getWindowState: (): Promise<{ isMaximized: boolean; isFullScreen: boolean; isMinimized: boolean; isAlwaysOnTop: boolean; bounds: { x: number; y: number; width: number; height: number }; displayCount: number; compactModeActive: boolean } | null> =>
      ipcRenderer.invoke('desktop:get-window-state'),
  },

  // ─── SPIKE: SCK (ScreenCaptureKit) com window-exclusion ─────────────────
  sck: {
    status: (): Promise<{ enabled: boolean; available: boolean; loadError: string | null; platform: string; pid: number; isMacOS: boolean }> =>
      ipcRenderer.invoke('sck:status'),
    listContent: (): Promise<{ ok: boolean; error?: string; windows?: any[]; displays?: any[]; selfWindowIds?: number[]; selfPid?: number }> =>
      ipcRenderer.invoke('sck:list-content'),
    start: (opts?: { fps?: number; scale?: number; jpegQuality?: number }): Promise<{ ok: boolean; error?: string; selfWindowIds?: number[]; targetDisplayId?: number }> =>
      ipcRenderer.invoke('sck:start', opts ?? {}),
    stop: (): Promise<{ ok: boolean; error?: string }> => ipcRenderer.invoke('sck:stop'),
    getFrame: (): Promise<Uint8Array | null> => ipcRenderer.invoke('sck:get-frame'),
    getStats: (): Promise<{ running: boolean; frameCount: number; latestSize: number; available: boolean }> =>
      ipcRenderer.invoke('sck:get-stats'),
  },
});
