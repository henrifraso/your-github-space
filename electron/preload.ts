import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  isElectron: true,

  captureNavigation: (data: { url: string; title: string; ts: number }) => {
    ipcRenderer.send('navigation-captured', data);
  },

  saveOffline: (key: string, data: unknown): Promise<{ ok: boolean; file?: string }> =>
    ipcRenderer.invoke('save-offline', key, data),

  onNavigationUpdate: (cb: (data: unknown) => void) => {
    ipcRenderer.on('navigation-update', (_e, data) => cb(data));
  },

  getPlatform: (): Promise<string> => ipcRenderer.invoke('get-platform'),
});
