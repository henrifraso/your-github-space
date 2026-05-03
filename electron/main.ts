import { app, BrowserWindow, ipcMain, session, nativeTheme, nativeImage } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV !== 'production';

nativeTheme.themeSource = 'dark';

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'hidden',
    backgroundColor: '#0a0a0a',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true,
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });

  win.once('ready-to-show', () => win.show());

  if (isDev) {
    win.loadURL('http://localhost:3000');
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Expõe info da janela para o renderer
  ipcMain.handle('get-platform', () => process.platform);

  ipcMain.on('navigation-captured', (_e, data) => {
    // Persiste histórico de navegação se necessário
    console.log('[nav]', data.url);
  });

  ipcMain.handle('save-offline', async (_e, _key, _data) => {
    return { ok: true };
  });

  return win;
}

app.whenReady().then(() => {
  if (process.platform === 'darwin') {
    const iconPath = path.join(__dirname, '../build/icon.png');
    const icon = nativeImage.createFromPath(iconPath);
    app.dock.setIcon(icon);
  }

  // Sessão persistente compartilhada entre abas — cookies ficam gravados em disco
  const ses = session.fromPartition('persist:omni-browser');

  ses.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
  );

  // Remove headers que bloqueiam iframe
  ses.webRequest.onHeadersReceived({ urls: ['*://*/*'] }, (details, callback) => {
    const headers = { ...details.responseHeaders };
    delete headers['x-frame-options'];
    delete headers['X-Frame-Options'];
    delete headers['content-security-policy'];
    delete headers['Content-Security-Policy'];
    callback({ responseHeaders: headers });
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
