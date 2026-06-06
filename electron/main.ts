import { app, BrowserWindow, ipcMain, session, nativeTheme, nativeImage, desktopCapturer, screen, shell, globalShortcut, type Rectangle } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV !== 'production';

// Nome que aparece na menu bar do macOS (canto superior esquerdo) e no Dock.
// Tem que ser chamado o MAIS CEDO possível, antes de qualquer outra coisa.
app.setName('OS¹');

// ── Desktop Capture / Desktop Control / SCK ──────────────────────────────
// PAUSADO em 2026-05-28. Motivo: desktopCapturer puro gera espelho/tela preta
// em 1 monitor com janela maximizada. Retomar futuramente com window-exclusion:
//   • Windows: SetWindowDisplayAffinity(WDA_EXCLUDEFROMCAPTURE) via FFI
//   • macOS:   ScreenCaptureKit com SCContentFilter(excludingWindows:)
// Código mantido atrás das flags. Defaults: TODAS FALSE.
// Pra reativar SCK em macOS: ENABLE_DESKTOP_CAPTURE=true ENABLE_SCK_CAPTURE=true
const ENABLE_DESKTOP_CAPTURE = process.env.ENABLE_DESKTOP_CAPTURE === 'true';
const ENABLE_DESKTOP_CONTROL = process.env.ENABLE_DESKTOP_CONTROL === 'true';
const ENABLE_SCK_CAPTURE = process.env.ENABLE_SCK_CAPTURE === 'true';
const ANY_DESKTOP_FEATURE = ENABLE_DESKTOP_CAPTURE || ENABLE_DESKTOP_CONTROL || ENABLE_SCK_CAPTURE;
const ANTI_MIRROR_VERSION = 'v2';

// Banner explícito no startup pra confirmar versão. Aparece SEMPRE.
console.log('═══════════════════════════════════════════════════════════════');
console.log(`[main] OS¹ Electron — Anti-Mirror ${ANTI_MIRROR_VERSION.toUpperCase()} ACTIVE`);
console.log(`[main] ENABLE_DESKTOP_CAPTURE=${ENABLE_DESKTOP_CAPTURE}`);
console.log(`[main] ENABLE_DESKTOP_CONTROL=${ENABLE_DESKTOP_CONTROL}`);
console.log(`[main] ENABLE_SCK_CAPTURE=${ENABLE_SCK_CAPTURE} (macOS-only)`);
console.log(`[main] desktop features any-on: ${ANY_DESKTOP_FEATURE}`);
console.log(`[main] main.ts compilado: ${new Date().toISOString()}`);
console.log('═══════════════════════════════════════════════════════════════');

// ── ScreenCaptureKit nativo (macOS-first) ─────────────────────────────────
// Carrega o .node compilado em electron/native/sck-capture. Não-bloqueante.
// Só carrega se platform=darwin && ENABLE_SCK_CAPTURE=true.
const nativeRequire = createRequire(import.meta.url);
type SckModule = {
  listContent: () => { windows: { windowID: number; title: string; ownerName: string; ownerPID: number; onScreen: boolean }[]; displays: { displayID: number; width: number; height: number }[] };
  start: (opts: { displayId?: number; excludeWindowIds?: number[]; fps?: number; scale?: number; jpegQuality?: number }) => boolean;
  stop: () => boolean;
  getFrame: () => Buffer | null;
  getStats: () => { running: boolean; frameCount: number; latestSize: number };
};
let sck: SckModule | null = null;
let sckLoadError: string | null = null;
if (process.platform === 'darwin' && ENABLE_SCK_CAPTURE) {
  try {
    sck = nativeRequire(path.resolve(process.cwd(), 'electron/native/sck-capture/build/Release/sck_capture.node')) as SckModule;
    console.log('[sck] native module carregado:', Object.keys(sck));
  } catch (err: any) {
    sckLoadError = String(err?.message ?? err);
    console.warn('[sck] falha ao carregar native module:', sckLoadError);
  }
} else if (process.platform === 'darwin') {
  console.log('[sck] desligado (ENABLE_SCK_CAPTURE não está true). Caminho desktopCapturer continua disponível.');
} else {
  console.log('[sck] não-macOS, pulando native module.');
}

// Estado de Compact Mode (POC anti-self-capture). Salvamos TUDO pra restaurar fielmente.
interface PrevWindowState {
  bounds: Rectangle;
  alwaysOnTop: boolean;
  isMaximized: boolean;
  isFullScreen: boolean;
}
let previousWindowState: PrevWindowState | null = null;
let compactModeActive = false;

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
    // app.os1.space é o domínio público; os1app.vercel.app retorna 401
    // (Vercel SSO). NÃO trocar de volta.
    win.loadURL('https://app.os1.space');
  }

  return win;
}

// Handlers IPC — removeHandler antes de handle para evitar erro no activate
ipcMain.removeHandler('get-platform');
ipcMain.handle('get-platform', () => process.platform);

ipcMain.removeHandler('save-offline');
ipcMain.handle('save-offline', async (_e, _key, _data) => ({ ok: true }));

ipcMain.on('navigation-captured', (_e, data) => {
  console.log('[nav]', data.url);
});

// ─── POC Desktop Capture (Nível 2) ─────────────────────────────────────────────
// Tudo local. Nenhum frame sai do processo Electron. Nada é enviado pra backend.

ipcMain.removeHandler('desktop:is-enabled');
// Botão Desktop só deve aparecer se QUALQUER das 3 flags de Desktop estiver on.
// Default: false (pausado em 2026-05-28 — ver comentário no topo do arquivo).
ipcMain.handle('desktop:is-enabled', () => ANY_DESKTOP_FEATURE);

// Shell helper: abrir URL no navegador externo padrão do SO.
ipcMain.removeHandler('shell:open-external');
ipcMain.handle('shell:open-external', async (_event, url: string) => {
  if (typeof url !== 'string' || !/^https?:\/\//i.test(url)) return false;
  await shell.openExternal(url);
  return true;
});

ipcMain.removeHandler('desktop:list-sources');
ipcMain.handle('desktop:list-sources', async (event) => {
  if (!ENABLE_DESKTOP_CAPTURE) return { ok: false, reason: 'disabled', sources: [], displays: [], hostDisplayId: null, primaryDisplayId: null };
  try {
    // Apenas telas inteiras (não janelas individuais). Thumbnail pequeno é seguro.
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: { width: 256, height: 144 },
      fetchWindowIcons: false,
    });

    const displays = screen.getAllDisplays();
    const primary = screen.getPrimaryDisplay();

    // Detecta em qual display a janela do OS¹ está renderizando AGORA.
    // Usa o centro da janela pra evitar ambiguidade quando ela atravessa monitores.
    let hostDisplayId: string | null = null;
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
      const b = win.getBounds();
      const center = { x: Math.round(b.x + b.width / 2), y: Math.round(b.y + b.height / 2) };
      const hostDisplay = screen.getDisplayNearestPoint(center);
      hostDisplayId = String(hostDisplay.id);
    }

    // Robustez: quando `display_id` vier vazio (algumas versões de Electron em
    // Win/Linux + cenários raros no macOS), parear sources↔displays por ordem.
    // Isso permite o lado React detectar o host display de forma confiável.
    const sourcesEnriched = sources.map((s, i) => {
      let dispId = s.display_id;
      if (!dispId && displays[i]) dispId = String(displays[i].id);
      return {
        id: s.id,
        name: s.name,
        display_id: dispId || '',
        thumbnailDataURL: s.thumbnail?.toDataURL?.() ?? '',
      };
    });

    return {
      ok: true,
      sources: sourcesEnriched,
      displays: displays.map(d => ({
        id: String(d.id),
        bounds: d.bounds,
        workArea: d.workArea,
        scaleFactor: d.scaleFactor,
        rotation: d.rotation,
        isPrimary: d.id === primary.id,
        isInternal: (d as any).internal ?? false,
      })),
      hostDisplayId,
      primaryDisplayId: String(primary.id),
      windowState: win ? {
        isMaximized: win.isMaximized(),
        isFullScreen: win.isFullScreen(),
        isMinimized: win.isMinimized(),
        compactModeActive,
      } : null,
    };
  } catch (err: any) {
    // macOS sem permissão de Screen Recording geralmente lança aqui.
    return { ok: false, reason: 'error', message: String(err?.message ?? err), sources: [], displays: [], hostDisplayId: null, primaryDisplayId: null, windowState: null };
  }
});

ipcMain.removeHandler('desktop:get-primary-display');
ipcMain.handle('desktop:get-primary-display', () => {
  if (!ENABLE_DESKTOP_CAPTURE) return null;
  const primary = screen.getPrimaryDisplay();
  return {
    id: primary.id,
    bounds: primary.bounds,
    workArea: primary.workArea,
    scaleFactor: primary.scaleFactor,
    rotation: primary.rotation,
  };
});

ipcMain.removeHandler('desktop:open-system-prefs');
ipcMain.handle('desktop:open-system-prefs', () => {
  if (!ENABLE_DESKTOP_CAPTURE) return false;
  if (process.platform === 'darwin') {
    // Abre direto o painel de Screen Recording.
    shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture');
    return true;
  }
  if (process.platform === 'win32') {
    shell.openExternal('ms-settings:privacy-displaycapture');
    return true;
  }
  return false;
});

// ─── Anti self-capture: ocultar/restaurar janela e Modo Compacto ───────────────
// Resolução do espelho infinito em laptops com 1 monitor.
// Hotkey global Cmd/Ctrl+Shift+D restaura a janela em caso de pânico.

async function restoreOS1Window(win: BrowserWindow) {
  if (!win) return;
  if (compactModeActive && previousWindowState) {
    // Reaplicar na ordem inversa: alwaysOnTop, visible-on-all-workspaces, bounds, depois fullscreen/maximize.
    win.setAlwaysOnTop(previousWindowState.alwaysOnTop);
    if (process.platform === 'darwin') win.setVisibleOnAllWorkspaces(false);
    win.setBounds(previousWindowState.bounds, true);
    // Pequeno delay pra layout assentar antes de entrar em fullscreen/maximize.
    await new Promise(r => setTimeout(r, 80));
    if (previousWindowState.isFullScreen) {
      win.setFullScreen(true);
    } else if (previousWindowState.isMaximized) {
      win.maximize();
    }
    compactModeActive = false;
    console.log('[desktop] restored previous window state:', previousWindowState);
  }
  if (win.isMinimized()) win.restore();
  if (!win.isVisible()) win.show();
  win.focus();
}

ipcMain.removeHandler('desktop:hide-window');
ipcMain.handle('desktop:hide-window', (event) => {
  if (!ENABLE_DESKTOP_CAPTURE) return false;
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return false;
  // minimize é mais seguro que hide (hide some completamente, sem dock icon no mac).
  win.minimize();
  return true;
});

ipcMain.removeHandler('desktop:show-window');
ipcMain.handle('desktop:show-window', (event) => {
  if (!ENABLE_DESKTOP_CAPTURE) return false;
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return false;
  restoreOS1Window(win);
  return true;
});

ipcMain.removeHandler('desktop:set-compact-mode');
ipcMain.handle('desktop:set-compact-mode', async (event, enable: boolean) => {
  if (!ENABLE_DESKTOP_CAPTURE) return false;
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return false;

  if (enable && !compactModeActive) {
    const wasFullScreen = win.isFullScreen();
    const wasMaximized = !wasFullScreen && win.isMaximized();
    // getNormalBounds() devolve o bounds pré-maximize/fullscreen (a janela "lembrada").
    const savedBounds = (wasFullScreen || wasMaximized) ? win.getNormalBounds() : win.getBounds();

    previousWindowState = {
      bounds: savedBounds,
      alwaysOnTop: win.isAlwaysOnTop(),
      isMaximized: wasMaximized,
      isFullScreen: wasFullScreen,
    };
    console.log('[desktop] entering compact mode. saved state:', previousWindowState);

    // ── 1) Sair de fullscreen com await na animação (macOS Spaces transition ~500ms) ──
    if (wasFullScreen) {
      await new Promise<void>(resolve => {
        const onLeave = () => { win.off('leave-full-screen', onLeave); resolve(); };
        win.on('leave-full-screen', onLeave);
        win.setFullScreen(false);
        // Fallback se evento não disparar (Win/Linux ou edge cases).
        setTimeout(() => { win.off('leave-full-screen', onLeave); resolve(); }, 1500);
      });
    } else if (wasMaximized) {
      // unmaximize é mais rápido; uma soneca curta cobre a animação no macOS.
      win.unmaximize();
      await new Promise(r => setTimeout(r, 200));
    }

    // ── 2) Aplicar bounds compactos + always-on-top + visible-on-all-workspaces ──
    const primary = screen.getPrimaryDisplay();
    const W = 480;
    const H = 120;
    const margin = 16;
    win.setBounds({
      x: primary.workArea.x + primary.workArea.width - W - margin,
      y: primary.workArea.y + primary.workArea.height - H - margin,
      width: W,
      height: H,
    }, true);
    win.setAlwaysOnTop(true, 'floating');
    if (process.platform === 'darwin') win.setVisibleOnAllWorkspaces(true);

    compactModeActive = true;
    console.log('[desktop] compact mode ON. window=480x120 bottom-right, alwaysOnTop=floating');
  } else if (!enable && compactModeActive) {
    if (previousWindowState) {
      win.setAlwaysOnTop(previousWindowState.alwaysOnTop);
      if (process.platform === 'darwin') win.setVisibleOnAllWorkspaces(false);
      win.setBounds(previousWindowState.bounds, true);
      await new Promise(r => setTimeout(r, 80));
      if (previousWindowState.isFullScreen) {
        win.setFullScreen(true);
      } else if (previousWindowState.isMaximized) {
        win.maximize();
      }
    }
    compactModeActive = false;
    console.log('[desktop] compact mode OFF, restored');
  }
  return compactModeActive;
});

ipcMain.removeHandler('desktop:is-compact-mode');
ipcMain.handle('desktop:is-compact-mode', () => compactModeActive);

ipcMain.removeHandler('desktop:get-window-state');
ipcMain.handle('desktop:get-window-state', (event) => {
  if (!ENABLE_DESKTOP_CAPTURE) return null;
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return null;
  return {
    isMaximized: win.isMaximized(),
    isFullScreen: win.isFullScreen(),
    isMinimized: win.isMinimized(),
    isAlwaysOnTop: win.isAlwaysOnTop(),
    bounds: win.getBounds(),
    displayCount: screen.getAllDisplays().length,
    compactModeActive,
  };
});

// ── SCK SPIKE handlers ────────────────────────────────────────────────────
ipcMain.removeHandler('sck:status');
ipcMain.handle('sck:status', () => ({
  enabled: ENABLE_SCK_CAPTURE,
  available: sck !== null,
  loadError: sckLoadError,
  platform: process.platform,
  pid: process.pid,
  isMacOS: process.platform === 'darwin',
}));

ipcMain.removeHandler('sck:list-content');
ipcMain.handle('sck:list-content', () => {
  if (!sck) return { ok: false, error: sckLoadError ?? 'sck not available' };
  try {
    const content = sck.listContent();
    const me = process.pid;
    const selfWindows = content.windows.filter(w => w.ownerPID === me);
    return {
      ok: true,
      windows: content.windows,
      displays: content.displays,
      selfWindowIds: selfWindows.map(w => w.windowID),
      selfPid: me,
    };
  } catch (err: any) {
    return { ok: false, error: String(err?.message ?? err) };
  }
});

ipcMain.removeHandler('sck:start');
ipcMain.handle('sck:start', (event, opts: { fps?: number; scale?: number; jpegQuality?: number } = {}) => {
  if (!sck) return { ok: false, error: sckLoadError ?? 'sck not available' };
  try {
    // Pegamos as janelas do PID atual e excluímos TODAS (DevTools incluso, se aberto).
    const content = sck.listContent();
    const me = process.pid;
    const selfWindowIds = content.windows.filter(w => w.ownerPID === me).map(w => w.windowID);
    const primaryDisplayId = screen.getPrimaryDisplay().id;
    // O CGDirectDisplayID que SCDisplay.displayID retorna é o mesmo que Electron's screen.id no macOS.
    const targetDisplayId = content.displays.find(d => d.displayID === primaryDisplayId)?.displayID
      ?? content.displays[0]?.displayID
      ?? 0;
    console.log('[sck] start request', {
      fps: opts.fps ?? 15,
      scale: opts.scale ?? 0.5,
      targetDisplayId,
      selfWindowIds,
      selfPid: me,
    });
    const ok = sck.start({
      displayId: targetDisplayId,
      excludeWindowIds: selfWindowIds,
      fps: opts.fps ?? 15,
      scale: opts.scale ?? 0.5,
      jpegQuality: opts.jpegQuality ?? 0.55,
    });
    return { ok, selfWindowIds, targetDisplayId };
  } catch (err: any) {
    return { ok: false, error: String(err?.message ?? err) };
  }
});

ipcMain.removeHandler('sck:stop');
ipcMain.handle('sck:stop', () => {
  if (!sck) return { ok: false };
  try {
    const r = sck.stop();
    return { ok: r };
  } catch (err: any) {
    return { ok: false, error: String(err?.message ?? err) };
  }
});

ipcMain.removeHandler('sck:get-frame');
ipcMain.handle('sck:get-frame', () => {
  if (!sck) return null;
  try {
    const buf = sck.getFrame();
    return buf; // Electron serializa Buffer via structured clone para o renderer
  } catch (err: any) {
    console.warn('[sck] getFrame err:', err);
    return null;
  }
});

ipcMain.removeHandler('sck:get-stats');
ipcMain.handle('sck:get-stats', () => {
  if (!sck) return { running: false, frameCount: 0, latestSize: 0, available: false };
  return { ...sck.getStats(), available: true };
});

// Garante UMA única instância. Sem isso, abrir o app 2x corrompe o leveldb
// dos cookies/Local Storage do partition persist:omni-browser. Quando a 2ª
// instância tenta subir, focamos a janela existente.
const hasLock = app.requestSingleInstanceLock();
if (!hasLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    const wins = BrowserWindow.getAllWindows();
    if (wins.length > 0) {
      const w = wins[0];
      if (w.isMinimized()) w.restore();
      w.show();
      w.focus();
    }
  });
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

  // Headers: só removemos X-Frame-Options (pra permitir incorporar em iframes do app
  // se rodar fora do Electron). Mantemos Content-Security-Policy intacto: alguns
  // serviços (Google, Auth, bancos) detectam strip de CSP como sinal de proxy e
  // reagem com mais captchas. Trade-off intencional pra preservar comportamento Chrome-like.
  ses.webRequest.onHeadersReceived({ urls: ['*://*/*'] }, (details, callback) => {
    const headers = { ...details.responseHeaders };
    delete headers['x-frame-options'];
    delete headers['X-Frame-Options'];
    callback({ responseHeaders: headers });
  });

  createWindow();

  app.on('activate', () => {
    const windows = BrowserWindow.getAllWindows();
    if (windows.length === 0) createWindow();
    else windows[0].show(); // traz a janela existente para frente
  });

  // Hotkey de emergência (só quando a flag tá ligada): restaura janela do OS¹
  // mesmo se ela estiver minimizada / em modo compacto / atrás de qualquer coisa.
  if (ENABLE_DESKTOP_CAPTURE) {
    const accelerator = process.platform === 'darwin' ? 'CommandOrControl+Shift+D' : 'Control+Shift+D';
    try {
      globalShortcut.register(accelerator, () => {
        const wins = BrowserWindow.getAllWindows();
        if (wins.length === 0) return;
        restoreOS1Window(wins[0]);
      });
      console.log(`[desktop] hotkey de emergência registrada: ${accelerator}`);
    } catch (err) {
      console.warn('[desktop] falha ao registrar hotkey:', err);
    }
    // Banner consolidado: confirma que TODOS os handlers de desktop estão no ar.
    console.log('[desktop] handlers registrados: is-enabled, list-sources, get-primary-display, open-system-prefs, hide-window, show-window, set-compact-mode, is-compact-mode, get-window-state');
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
