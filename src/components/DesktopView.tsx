import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Monitor, Square, AlertTriangle, RefreshCw, ExternalLink, Info, EyeOff, Minimize2, Maximize2, Keyboard } from 'lucide-react';

// POC Nível 2 — captura local da tela real via desktopCapturer + getUserMedia.
// Nenhum frame sai do renderer. Nada vai pra backend. Apenas <video> local.
// ──────────────────────────────────────────────────────────────────────────
// ANTI-MIRROR V2 — versão atual:
//   • setCompactMode async com leave-full-screen await + unmaximize antes de bounds
//   • windowState (isMaximized/isFullScreen) chega via desktop:list-sources
//   • single-monitor-warning é OBRIGATÓRIO antes de qualquer startCapture
//   • <video> só renderiza em modo 'normal' ou 'debug-mirror'
//   • Ordem: setState(preparing) → hide/setCompact → wait 600ms → startCapture
// ──────────────────────────────────────────────────────────────────────────
const ANTI_MIRROR_VERSION = 'v2';

interface DesktopSource {
  id: string;
  name: string;
  display_id: string;
  thumbnailDataURL: string;
}

interface DisplayInfo {
  id: string;
  bounds: { x: number; y: number; width: number; height: number };
  workArea: { x: number; y: number; width: number; height: number };
  scaleFactor: number;
  rotation: number;
  isPrimary: boolean;
  isInternal: boolean;
}

interface WindowState {
  isMaximized: boolean;
  isFullScreen: boolean;
  isMinimized: boolean;
  compactModeActive: boolean;
}

interface ListResult {
  ok: boolean;
  reason?: string;
  message?: string;
  sources: DesktopSource[];
  displays: DisplayInfo[];
  hostDisplayId: string | null;
  primaryDisplayId: string | null;
  windowState?: WindowState | null;
}

type CaptureMode = 'normal' | 'minimize' | 'compact' | 'debug-mirror';

type State =
  | { kind: 'idle' }
  | { kind: 'loading-sources' }
  | { kind: 'no-sources' }
  | { kind: 'permission-denied'; message: string }
  | { kind: 'single-monitor-warning'; isMaximized: boolean; isFullScreen: boolean }
  | { kind: 'preparing'; mode: CaptureMode; step: string }
  | { kind: 'requesting'; sourceId: string }
  | { kind: 'streaming'; sourceId: string; sourceName: string; isHost: boolean; mode: CaptureMode }
  | { kind: 'error'; message: string };

// A tipagem de window.electron vive em BrowserView.tsx (declare global).
// Aqui apenas consumimos via optional chaining.

export function DesktopView({ onStopAndType }: { onStopAndType?: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [state, setState] = useState<State>({ kind: 'idle' });
  const [sources, setSources] = useState<DesktopSource[]>([]);
  const [hostDisplayId, setHostDisplayId] = useState<string | null>(null);
  const [acceptedSelfCapture, setAcceptedSelfCapture] = useState(false);
  const platform = (window as any).electron?.platform ?? 'unknown';

  // ── SPIKE SCK ────────────────────────────────────────────────────────────
  type SckState =
    | { kind: 'sck-idle' }
    | { kind: 'sck-starting' }
    | { kind: 'sck-streaming'; selfWindowIds: number[]; targetDisplayId: number }
    | { kind: 'sck-error'; message: string };
  const [sckState, setSckState] = useState<SckState>({ kind: 'sck-idle' });
  const [sckStats, setSckStats] = useState<{ frameCount: number; latestSize: number }>({ frameCount: 0, latestSize: 0 });
  const sckImgRef = useRef<HTMLImageElement>(null);
  const sckPollRef = useRef<number | null>(null);
  const sckLastUrlRef = useRef<string | null>(null);

  const stopSCKPoll = useCallback(() => {
    if (sckPollRef.current !== null) {
      window.clearInterval(sckPollRef.current);
      sckPollRef.current = null;
    }
    if (sckLastUrlRef.current) {
      URL.revokeObjectURL(sckLastUrlRef.current);
      sckLastUrlRef.current = null;
    }
  }, []);

  const startSCK = useCallback(async () => {
    const sck = (window as any).electron?.sck;
    if (!sck) {
      setSckState({ kind: 'sck-error', message: 'window.electron.sck indisponível. Rebuild do native module talvez tenha falhado.' });
      return;
    }
    const status = await sck.status();
    // eslint-disable-next-line no-console
    console.log('[sck] status:', status);
    if (!status.available) {
      setSckState({ kind: 'sck-error', message: `Native module não carregou: ${status.loadError ?? 'unknown'}` });
      return;
    }
    setSckState({ kind: 'sck-starting' });
    const r = await sck.start({ fps: 15, scale: 0.5, jpegQuality: 0.55 });
    // eslint-disable-next-line no-console
    console.log('[sck] start result:', r);
    if (!r.ok) {
      setSckState({ kind: 'sck-error', message: r.error ?? 'falha desconhecida ao iniciar SCK' });
      return;
    }
    setSckState({ kind: 'sck-streaming', selfWindowIds: r.selfWindowIds ?? [], targetDisplayId: r.targetDisplayId ?? 0 });

    // Polling a ~12fps. 80ms é suficiente pra POC.
    sckPollRef.current = window.setInterval(async () => {
      const buf = await sck.getFrame();
      if (!buf) return;
      const blob = new Blob([buf], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      if (sckImgRef.current) {
        sckImgRef.current.src = url;
      }
      if (sckLastUrlRef.current) URL.revokeObjectURL(sckLastUrlRef.current);
      sckLastUrlRef.current = url;
      // Stats periódico (não a cada frame — pesado)
      if (Math.random() < 0.1) {
        const s = await sck.getStats();
        setSckStats({ frameCount: s.frameCount, latestSize: s.latestSize });
      }
    }, 80) as unknown as number;
  }, []);

  const stopSCK = useCallback(async () => {
    stopSCKPoll();
    const sck = (window as any).electron?.sck;
    if (sck) await sck.stop();
    setSckState({ kind: 'sck-idle' });
    setSckStats({ frameCount: 0, latestSize: 0 });
  }, [stopSCKPoll]);

  // Cleanup on unmount
  useEffect(() => () => { stopSCKPoll(); (window as any).electron?.sck?.stop?.(); }, [stopSCKPoll]);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Decide se uma source representa a tela onde a janela OS¹ está renderizando.
  const isHostSource = useCallback((src: DesktopSource): boolean => {
    if (!hostDisplayId) return false;
    if (!src.display_id) return false;
    return String(src.display_id) === String(hostDisplayId);
  }, [hostDisplayId]);

  const startCapture = useCallback(async (sourceId: string, sourceName: string, isHost: boolean, mode: CaptureMode = 'normal') => {
    stopStream();
    setState({ kind: 'requesting', sourceId });
    // eslint-disable-next-line no-console
    console.log('[desktop] startCapture', { sourceId, sourceName, isHost, mode });
    try {
      // Encanamento Electron-only: chromeMediaSource + chromeMediaSourceId
      const stream = await (navigator.mediaDevices as any).getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: sourceId,
            maxWidth: 1920,
            maxHeight: 1080,
            maxFrameRate: 30,
          },
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setState({ kind: 'streaming', sourceId, sourceName, isHost, mode });
    } catch (err: any) {
      const msg = String(err?.message ?? err);
      if (/Permission|NotAllowed|denied/i.test(msg)) {
        setState({ kind: 'permission-denied', message: msg });
      } else {
        setState({ kind: 'error', message: msg });
      }
    }
  }, [stopStream]);

  const loadSources = useCallback(async () => {
    // ── Banner de versão no console (prova que rodou versão nova) ─────────
    // eslint-disable-next-line no-console
    console.log(`%c[desktop] ANTI-MIRROR ${ANTI_MIRROR_VERSION.toUpperCase()} ACTIVE`, 'background:#10b981;color:#000;padding:2px 6px;border-radius:3px;font-weight:bold');

    // ── macOS-first: prioriza SCK quando flag + native module disponíveis ──
    const sck = (window as any).electron?.sck;
    if (sck) {
      const status = await sck.status();
      // eslint-disable-next-line no-console
      console.log('[desktop] sck status:', status);
      if (status.isMacOS && status.enabled && status.available) {
        // eslint-disable-next-line no-console
        console.log('[desktop] usando ScreenCaptureKit como caminho padrão (macOS-first)');
        await startSCK();
        return;
      }
      if (status.isMacOS && status.enabled && !status.available && status.loadError) {
        // eslint-disable-next-line no-console
        console.warn('[desktop] SCK enabled mas native module falhou — caindo no desktopCapturer:', status.loadError);
      }
    }

    const desktop = (window as any).electron?.desktop;
    if (!desktop) {
      setState({ kind: 'error', message: 'API electron.desktop indisponível. Rode com ENABLE_DESKTOP_CAPTURE=true e via Electron (não navegador).' });
      return;
    }
    setState({ kind: 'loading-sources' });
    const res: ListResult = await desktop.listSources();
    if (!res.ok) {
      if (res.reason === 'disabled') {
        setState({ kind: 'error', message: 'Feature flag desligada. Reinicie o Electron com ENABLE_DESKTOP_CAPTURE=true.' });
      } else if (res.message && /TCC|denied|permission/i.test(res.message)) {
        setState({ kind: 'permission-denied', message: res.message });
      } else {
        setState({ kind: 'error', message: res.message ?? 'Erro ao listar fontes.' });
      }
      return;
    }
    if (!res.sources.length) {
      setState({ kind: 'no-sources' });
      return;
    }
    setSources(res.sources);
    setHostDisplayId(res.hostDisplayId);

    // ── Estratégia de seleção pra evitar self-capture ────────────────────
    // Cenários:
    //   (a) Múltiplos monitores E sabemos qual é o host → pega outro auto.
    //   (b) 1 monitor único OU todos os displays são o host → aviso de espelho.
    //   (c) display_id vazio em todas as sources (fallback raro) → seguro: aviso.
    const displayCount = (res.displays?.length ?? 0) || res.sources.length;
    const nonHost = res.hostDisplayId
      ? res.sources.find(s => s.display_id && String(s.display_id) !== String(res.hostDisplayId))
      : undefined;

    const isSelfCaptureScenario =
      // 1 monitor físico + a janela OS¹ está nele
      (displayCount <= 1) ||
      // múltiplos monitores mas TODAS as sources são o host
      (!nonHost && res.hostDisplayId != null && res.sources.every(s => s.display_id && String(s.display_id) === String(res.hostDisplayId))) ||
      // Não conseguimos identificar host display nem temos como escolher seguro
      (res.hostDisplayId == null && res.sources.length === 1);

    if (isSelfCaptureScenario && !acceptedSelfCapture) {
      const ws = res.windowState;
      // eslint-disable-next-line no-console
      console.log('[desktop] ──── 1-MONITOR self-capture cenário detectado ────');
      // eslint-disable-next-line no-console
      console.log('[desktop] displayCount:', displayCount);
      // eslint-disable-next-line no-console
      console.log('[desktop] hostDisplayId:', res.hostDisplayId);
      // eslint-disable-next-line no-console
      console.log('[desktop] selectedSourceDisplayId:', '(nenhum — bloqueado pelo aviso)');
      // eslint-disable-next-line no-console
      console.log('[desktop] state:', 'single-monitor-warning');
      // eslint-disable-next-line no-console
      console.log('[desktop] mode:', '(captura NÃO iniciada — aguardando escolha do user)');
      // eslint-disable-next-line no-console
      console.log('[desktop] showVideoPreview:', false);
      // eslint-disable-next-line no-console
      console.log('[desktop] windowState:', { isMaximized: ws?.isMaximized ?? false, isFullScreen: ws?.isFullScreen ?? false, compactModeActive: ws?.compactModeActive ?? false });
      setState({
        kind: 'single-monitor-warning',
        isMaximized: !!ws?.isMaximized,
        isFullScreen: !!ws?.isFullScreen,
      });
      return;
    }

    const pick = nonHost ?? res.sources[0];
    const isHost = res.hostDisplayId ? String(pick.display_id) === String(res.hostDisplayId) : displayCount <= 1;
    // eslint-disable-next-line no-console
    console.log('[desktop] loadSources -> normal flow', {
      displayCount,
      hostDisplayId: res.hostDisplayId,
      selectedSourceDisplayId: pick.display_id,
      mode: 'normal',
    });
    startCapture(pick.id, pick.name, isHost, 'normal');
  }, [startCapture, acceptedSelfCapture, startSCK]);

  // ── Anti-self-capture: ocultar/restaurar janela e modo compacto ──────────
  const [compactMode, setCompactMode] = useState(false);

  const hideOS1 = useCallback(async () => {
    await (window as any).electron?.desktop?.hideWindow?.();
  }, []);

  const toggleCompactMode = useCallback(async () => {
    const desktop = (window as any).electron?.desktop;
    if (!desktop?.setCompactMode) return;
    const next = await desktop.setCompactMode(!compactMode);
    setCompactMode(!!next);
  }, [compactMode]);

  // ── Anti-self-capture flows (ORDEM CORRETA: minimize/compact → delay → capture) ──
  const wait = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

  const startMinimizedCapture = useCallback(async () => {
    const first = sources[0];
    if (!first) return;
    setAcceptedSelfCapture(true);
    // eslint-disable-next-line no-console
    console.log('[desktop] startMinimizedCapture: minimizing OS¹ BEFORE capture', {
      displayCount: sources.length,
      hostDisplayId,
      selectedSourceDisplayId: first.display_id,
      mode: 'minimize',
    });
    setState({ kind: 'preparing', mode: 'minimize', step: 'Minimizando janela do OS¹...' });
    await (window as any).electron?.desktop?.hideWindow?.();
    // Aguarda framebuffer atualizar (animação de minimize + repaint do Mission Control).
    await wait(600);
    // eslint-disable-next-line no-console
    console.log('[desktop] capture starting AFTER minimize, startedAfter=minimize');
    await startCapture(first.id, first.name, true, 'minimize');
  }, [sources, hostDisplayId, startCapture]);

  const startCompactCapture = useCallback(async () => {
    const first = sources[0];
    if (!first) return;
    const desktop = (window as any).electron?.desktop;
    if (!desktop) return;
    setAcceptedSelfCapture(true);
    // eslint-disable-next-line no-console
    console.log('[desktop] startCompactCapture: compacting OS¹ BEFORE capture', {
      displayCount: sources.length,
      hostDisplayId,
      selectedSourceDisplayId: first.display_id,
      mode: 'compact',
    });
    setState({ kind: 'preparing', mode: 'compact', step: 'Ativando modo compacto...' });
    await desktop.setCompactMode(true);
    setCompactMode(true);
    await wait(600);
    // eslint-disable-next-line no-console
    console.log('[desktop] capture starting AFTER compact, startedAfter=compact');
    await startCapture(first.id, first.name, true, 'compact');
  }, [sources, hostDisplayId, startCapture]);

  const startDebugMirrorCapture = useCallback(async () => {
    const first = sources[0];
    if (!first) return;
    setAcceptedSelfCapture(true);
    // eslint-disable-next-line no-console
    console.log('[desktop] startDebugMirrorCapture: NO mitigation (debug mode)', {
      displayCount: sources.length,
      hostDisplayId,
      mode: 'debug-mirror',
    });
    await startCapture(first.id, first.name, true, 'debug-mirror');
  }, [sources, hostDisplayId, startCapture]);

  // Parar captura — também restaura janela se estiver minimizada/compacta.
  const stopAndRestore = useCallback(async () => {
    stopStream();
    const desktop = (window as any).electron?.desktop;
    if (desktop) {
      await desktop.showWindow?.();
      if (compactMode) {
        await desktop.setCompactMode?.(false);
        setCompactMode(false);
      }
    }
    setState({ kind: 'idle' });
  }, [stopStream, compactMode]);

  // Carrega fontes ao montar.
  useEffect(() => { loadSources(); }, [loadSources]);

  // Para o stream quando desmontar (volta pra web, fecha browser etc).
  useEffect(() => () => { stopStream(); }, [stopStream]);

  const openPrefs = () => {
    (window as any).electron?.desktop?.openSystemScreenPrefs?.();
  };

  const isStreaming = state.kind === 'streaming';
  const streamingIsHost = state.kind === 'streaming' && state.isHost;
  const streamingMode: CaptureMode = state.kind === 'streaming' ? state.mode : 'normal';
  // Só renderizar <video> em modos seguros. Em minimize/compact, NUNCA mostrar preview.
  const showVideoPreview = isStreaming && (streamingMode === 'normal' || streamingMode === 'debug-mirror');
  const hasMultipleMonitors = sources.length > 1;
  const nonHostSources = sources.filter(s => !isHostSource(s));

  return (
    <div className="w-full h-full flex flex-col bg-[#0a0a0a] text-neutral-200">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between gap-3 px-5 py-3 border-b border-white/5">
        <div className="flex items-center gap-2 min-w-0">
          <Monitor size={16} className="text-neutral-400 flex-shrink-0" />
          <span className="text-sm font-medium truncate">
            {isStreaming ? `Capturando: ${(state as any).sourceName}` : 'Modo Desktop (POC Nível 2)'}
          </span>
          {/* Badge que prova que estamos na versão Anti-Mirror v2 */}
          <span
            className="text-[10px] uppercase tracking-wider text-emerald-300 bg-emerald-500/15 border border-emerald-500/40 rounded px-1.5 py-0.5 ml-1 flex-shrink-0 font-bold"
            title="Build novo: setCompactMode async + fullscreen/maximize-aware. Se você não ver este badge, está rodando versão antiga."
          >
            ANTI-MIRROR {ANTI_MIRROR_VERSION.toUpperCase()} ACTIVE
          </span>
          {isStreaming && (
            <span className="flex items-center gap-1.5 text-[11px] text-red-400 font-semibold uppercase tracking-wider ml-2 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              REC
            </span>
          )}
          {streamingIsHost && (
            <span className="text-[10px] uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded px-1.5 py-0.5 ml-1 flex-shrink-0">
              Esta janela
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {streamingIsHost && nonHostSources.length > 0 && (
            <button
              onClick={() => {
                const other = nonHostSources[0];
                startCapture(other.id, other.name, false);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-colors cursor-pointer"
              title="Capturar outro monitor"
            >
              <Monitor size={12} />
              Usar outro monitor
            </button>
          )}
          {isStreaming && (
            <button
              onClick={hideOS1}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
              title="Minimiza a janela do OS¹. Use Cmd/Ctrl+Shift+D pra trazer de volta."
            >
              <EyeOff size={12} />
              Ocultar OS¹
            </button>
          )}
          {isStreaming && (
            <button
              onClick={toggleCompactMode}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                compactMode
                  ? 'bg-blue-500/15 border-blue-500/30 text-blue-300 hover:bg-blue-500/20'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-300'
              }`}
              title={compactMode ? 'Restaurar tamanho normal' : 'Janela vira barra no canto inferior direito'}
            >
              {compactMode ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
              {compactMode ? 'Voltar ao normal' : 'Modo compacto'}
            </button>
          )}
          {isStreaming && (
            <button
              onClick={stopAndRestore}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold transition-colors cursor-pointer"
              title="Encerrar captura e restaurar janela"
            >
              <Square size={12} />
              Parar captura
            </button>
          )}
          {!isStreaming && state.kind !== 'loading-sources' && state.kind !== 'single-monitor-warning' && (
            <button
              onClick={loadSources}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
              title="Tentar de novo"
            >
              <RefreshCw size={12} />
              Tentar novamente
            </button>
          )}
        </div>
      </div>

      {/* Área principal */}
      <div className="flex-1 min-h-0 relative bg-black flex items-center justify-center">
        {/* SPIKE SCK — prioridade máxima quando ativo */}
        {(sckState.kind === 'sck-streaming' || sckState.kind === 'sck-starting' || sckState.kind === 'sck-error') && (
          <div className="absolute inset-0 z-20 bg-black flex flex-col">
            <div className="flex items-center justify-between gap-3 px-4 py-2 bg-emerald-950/40 border-b border-emerald-500/30">
              <div className="flex items-center gap-2 text-xs text-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold uppercase tracking-wider">Desktop · macOS</span>
                {sckState.kind === 'sck-streaming' && (
                  <span className="text-emerald-300/70">
                    OS¹ excluído (windowIDs [{sckState.selfWindowIds.join(', ')}]) · display {sckState.targetDisplayId} · {sckStats.frameCount} frames · {(sckStats.latestSize / 1024).toFixed(0)}KB
                  </span>
                )}
                {sckState.kind === 'sck-starting' && <span className="text-emerald-300/70">iniciando captura...</span>}
              </div>
              <button
                onClick={stopSCK}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-red-500/15 hover:bg-red-500/30 border border-red-500/40 text-red-200 text-xs font-semibold"
              >
                <Square size={11} /> Parar SCK
              </button>
            </div>
            <div className="flex-1 min-h-0 relative flex items-center justify-center bg-black">
              {sckState.kind === 'sck-streaming' && (
                <img ref={sckImgRef} alt="SCK frame" className="max-w-full max-h-full object-contain" />
              )}
              {sckState.kind === 'sck-starting' && (
                <div className="flex flex-col items-center gap-3 text-emerald-200">
                  <div className="w-6 h-6 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" />
                  <p className="text-sm">Negociando SCStream + SCContentFilter…</p>
                </div>
              )}
              {sckState.kind === 'sck-error' && (() => {
                const msg = sckState.message;
                const isPermission = /TCC|denied|permission|consent|recording|approval/i.test(msg);
                return (
                  <div className="text-center max-w-md px-6">
                    <AlertTriangle size={32} className="mx-auto mb-3 text-red-400" />
                    <p className="text-sm font-semibold text-neutral-100 mb-2">
                      {isPermission ? 'Permissão de Gravação de Tela necessária' : 'Captura não pôde iniciar'}
                    </p>
                    <p className="text-xs text-neutral-400 leading-relaxed mb-3">
                      {isPermission
                        ? 'Pra capturar a área de trabalho, o OS¹ precisa de permissão de Gravação de Tela nas Configurações do Sistema. Abra, marque "OS¹" na lista, e tente de novo.'
                        : msg}
                    </p>
                    <details className="text-[10px] text-neutral-500 mb-3 text-left">
                      <summary className="cursor-pointer opacity-60">Detalhes técnicos</summary>
                      <pre className="mt-1 whitespace-pre-wrap break-all">{msg}</pre>
                    </details>
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      {isPermission && (
                        <button
                          onClick={() => (window as any).electron?.desktop?.openSystemScreenPrefs?.()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-neutral-100 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <ExternalLink size={12} />
                          Abrir Configurações
                        </button>
                      )}
                      <button
                        onClick={() => { setSckState({ kind: 'sck-idle' }); startSCK(); }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <RefreshCw size={12} />
                        Tentar novamente
                      </button>
                      <button
                        onClick={() => setSckState({ kind: 'sck-idle' })}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Voltar
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Video — só em modo normal ou debug-mirror. Minimize/compact NUNCA renderiza preview. */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-contain"
          style={{ display: showVideoPreview ? 'block' : 'none', background: '#000' }}
        />

        {/* Painel "preparing" — durante minimize/compact antes da captura iniciar */}
        {state.kind === 'preparing' && (
          <div className="flex flex-col items-center gap-3 text-neutral-300 px-6 text-center">
            <div className="w-6 h-6 rounded-full border-2 border-white/10 border-t-white/60 animate-spin" />
            <p className="text-sm font-semibold">{state.step}</p>
            <p className="text-xs text-neutral-500">Aguardando 600ms antes de iniciar a captura para evitar o espelho.</p>
          </div>
        )}

        {/* Painel "streaming sem preview" — quando captura está rodando em minimize/compact */}
        {isStreaming && !showVideoPreview && (
          <div className="flex flex-col items-center gap-4 text-center max-w-md px-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-500/15">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            </div>
            <div>
              <p className="text-base font-semibold text-neutral-100 mb-1">
                Capturando em background
              </p>
              <p className="text-xs text-neutral-400 leading-relaxed mb-1">
                Tela <strong>{(state as any).sourceName}</strong> está sendo capturada agora.
              </p>
              <p className="text-xs text-neutral-500 leading-relaxed">
                {streamingMode === 'minimize'
                  ? 'A janela do OS¹ está minimizada pra não aparecer na captura. Sem preview interno (evita espelho).'
                  : 'A janela do OS¹ está em modo compacto pra não dominar a tela. Sem preview interno.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={stopAndRestore}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Square size={12} />
                Parar captura e restaurar
              </button>
              {streamingMode === 'minimize' && (
                <span className="text-[10px] text-neutral-500 inline-flex items-center gap-1">
                  <Keyboard size={11} />
                  <kbd className="text-[10px] bg-white/10 px-1 rounded">Cmd/Ctrl+Shift+D</kbd> também restaura
                </span>
              )}
            </div>
          </div>
        )}

        {state.kind === 'loading-sources' && (
          <div className="flex flex-col items-center gap-3 text-neutral-400">
            <div className="w-6 h-6 rounded-full border-2 border-white/10 border-t-white/60 animate-spin" />
            <p className="text-sm">Listando telas disponíveis...</p>
          </div>
        )}

        {state.kind === 'requesting' && (
          <div className="flex flex-col items-center gap-3 text-neutral-400">
            <div className="w-6 h-6 rounded-full border-2 border-white/10 border-t-white/60 animate-spin" />
            <p className="text-sm">Iniciando captura...</p>
          </div>
        )}

        {state.kind === 'no-sources' && (
          <div className="text-center max-w-md px-6">
            <Monitor size={32} className="mx-auto mb-3 text-neutral-500" />
            <p className="text-sm text-neutral-400">Nenhuma tela disponível pra capturar.</p>
          </div>
        )}

        {/* ── ESPELHO INFINITO — 1 monitor + sem monitor externo ─────────── */}
        {state.kind === 'single-monitor-warning' && (
          <div className="text-center max-w-xl px-6 py-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/15 mb-4">
              <Info size={22} className="text-amber-400" />
            </div>
            <p className="text-base font-semibold text-neutral-100 mb-2">
              {state.isFullScreen
                ? 'OS¹ está em tela cheia — captura ficaria preta'
                : state.isMaximized
                  ? 'OS¹ está maximizado — captura ficaria preta ou espelhada'
                  : 'Captura mostraria o próprio OS¹'}
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed mb-4">
              {state.isFullScreen || state.isMaximized
                ? 'Quando a janela do OS¹ cobre o monitor inteiro, o desktopCapturer só "vê" a própria janela ou tela preta atrás. Pra mostrar a área de trabalho real, o OS¹ precisa sair de tela cheia/maximizado e virar um painel compacto sobre o desktop.'
                : 'Você tem só uma tela conectada e ela é onde a janela do OS¹ está aberta. Se eu iniciar a captura agora, vai aparecer espelho infinito (OS¹ dentro de OS¹ dentro de OS¹...).'} Isso é esperado, não é bug — é como o <code className="text-[11px] bg-white/5 px-1 rounded">desktopCapturer</code> funciona.
            </p>

            <p className="text-xs text-neutral-500 mb-3 uppercase tracking-wider">Escolha um caminho:</p>

            {/* macOS-first: ScreenCaptureKit com exclusão da janela do OS¹ */}
            <button
              onClick={startSCK}
              className="w-full flex items-start gap-3 p-3 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 transition-colors cursor-pointer text-left mb-2"
            >
              <Monitor size={20} className="text-emerald-300 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-emerald-100 mb-0.5">
                  Capturar com ScreenCaptureKit
                  <span className="text-[10px] uppercase tracking-wider bg-emerald-500/25 px-1.5 py-0.5 rounded ml-1">macOS</span>
                </p>
                <p className="text-[11px] text-emerald-200/70 leading-snug">
                  Captura o display do macOS EXCLUINDO a janela do OS¹. Pode ficar maximizado: desktop real aparece atrás, sem espelho. Requer permissão de Gravação de Tela.
                </p>
              </div>
            </button>

            {/* Botão principal: Compact é o recomendado em 1 monitor */}
            <button
              onClick={startCompactCapture}
              className="w-full flex items-start gap-3 p-3 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/40 transition-colors cursor-pointer text-left mb-2"
            >
              <Minimize2 size={20} className="text-blue-300 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-blue-100 mb-0.5">
                  Usar modo compacto {(state.isMaximized || state.isFullScreen) && <span className="text-[10px] uppercase tracking-wider bg-blue-500/25 px-1.5 py-0.5 rounded ml-1">recomendado</span>}
                </p>
                <p className="text-[11px] text-blue-200/70 leading-snug">
                  {state.isFullScreen
                    ? 'Sai de tela cheia, vira painel 480×120 no canto, libera a área de trabalho real e inicia a captura. Cmd/Ctrl+Shift+D restaura tela cheia.'
                    : state.isMaximized
                      ? 'Sai do maximizado, vira painel 480×120 no canto, libera a área de trabalho real e inicia a captura. Cmd/Ctrl+Shift+D restaura maximizado.'
                      : 'Janela vira painel 480×120 no canto inferior direito. Captura inicia depois. Cmd/Ctrl+Shift+D restaura.'}
                </p>
              </div>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left mb-4">
              {/* Minimizar OS¹ — alternativa */}
              <button
                onClick={startMinimizedCapture}
                className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-colors cursor-pointer text-left"
              >
                <EyeOff size={16} className="text-neutral-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-neutral-100 mb-0.5">Minimizar OS¹</p>
                  <p className="text-[10px] text-neutral-500 leading-snug">
                    Janela vai pro Dock. Sem preview. <kbd className="text-[9px] bg-white/10 px-1 rounded">Cmd/Ctrl+Shift+D</kbd> restaura.
                  </p>
                </div>
              </button>

              {/* Esperar 2º monitor */}
              <button
                onClick={loadSources}
                className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-colors cursor-pointer text-left"
              >
                <Monitor size={16} className="text-neutral-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-neutral-100 mb-0.5">Conectar 2º monitor</p>
                  <p className="text-[10px] text-neutral-500 leading-snug">
                    Plugue HDMI/USB-C e clique aqui pra reavaliar.
                  </p>
                </div>
              </button>

              {/* Debug — span 2 colunas pra ficar discreto embaixo */}
              <button
                onClick={startDebugMirrorCapture}
                className="sm:col-span-2 flex items-start gap-3 p-2.5 rounded-lg bg-red-500/[0.06] hover:bg-red-500/[0.12] border border-red-500/30 transition-colors cursor-pointer text-left"
              >
                <AlertTriangle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-red-200 mb-0 uppercase tracking-wider">
                    ⚠ DEBUG / NÃO RECOMENDADO — Capturar com espelho mesmo
                  </p>
                  <p className="text-[10px] text-red-300/70 leading-snug">
                    Pula TODA mitigação anti-mirror. Só pra reproduzir o bug propositalmente em desenvolvimento.
                  </p>
                </div>
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 flex-wrap">
              <button
                onClick={() => setState({ kind: 'idle' })}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-neutral-100 text-xs font-semibold transition-colors cursor-pointer"
              >
                Entendi, cancelar
              </button>
            </div>

            <div className="mt-4 inline-flex items-center gap-1.5 text-[10px] text-neutral-500 bg-white/[0.02] border border-white/5 rounded-lg px-2 py-1">
              <Keyboard size={11} />
              Hotkey de emergência: <kbd className="text-[10px] bg-white/10 px-1 rounded">Cmd/Ctrl+Shift+D</kbd> restaura a janela
            </div>
          </div>
        )}

        {state.kind === 'permission-denied' && (
          <div className="text-center max-w-md px-6">
            <AlertTriangle size={32} className="mx-auto mb-3 text-amber-400" />
            <p className="text-sm font-semibold text-neutral-100 mb-2">Permissão de Gravação de Tela negada</p>
            {platform === 'darwin' ? (
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                Para mostrar sua tela aqui, você precisa permitir <strong>Gravação de Tela</strong> para o OS¹ nas
                <em> Configurações do Sistema → Privacidade e Segurança → Gravação de Tela</em>. Depois, reabra o app.
              </p>
            ) : (
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                Verifique as permissões de captura de tela do sistema operacional e tente novamente.
              </p>
            )}
            <div className="flex items-center justify-center gap-2">
              <button onClick={openPrefs}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-neutral-100 text-xs font-semibold transition-colors cursor-pointer">
                <ExternalLink size={12} />
                Abrir Configurações
              </button>
              <button onClick={loadSources}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 text-xs font-semibold transition-colors cursor-pointer">
                <RefreshCw size={12} />
                Tentar novamente
              </button>
            </div>
          </div>
        )}

        {state.kind === 'error' && (
          <div className="text-center max-w-md px-6">
            <AlertTriangle size={32} className="mx-auto mb-3 text-red-400" />
            <p className="text-sm font-semibold text-neutral-100 mb-1">Captura indisponível</p>
            <p className="text-xs text-neutral-400 leading-relaxed mb-3">{state.message}</p>
            <button onClick={loadSources}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 text-xs font-semibold transition-colors cursor-pointer">
              <RefreshCw size={12} />
              Tentar novamente
            </button>
          </div>
        )}

        {state.kind === 'idle' && (
          <div className="text-center text-neutral-500 text-sm">Aguardando...</div>
        )}
      </div>

      {/* Rodapé com seleção de monitor — sempre exibido quando >1 source */}
      {hasMultipleMonitors && (
        <div className="flex-shrink-0 flex items-center gap-2 px-5 py-2 border-t border-white/5 bg-[#0d0d0d] overflow-x-auto">
          <span className="text-[10px] uppercase tracking-wider text-neutral-500 mr-1 flex-shrink-0">Telas:</span>
          {sources.map(s => {
            const active = state.kind === 'streaming' && (state as any).sourceId === s.id;
            const isHost = isHostSource(s);
            return (
              <button
                key={s.id}
                onClick={() => startCapture(s.id, s.name, isHost)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-medium transition-colors cursor-pointer flex-shrink-0 ${
                  active
                    ? (isHost ? 'bg-amber-500/15 border-amber-500/40 text-amber-200' : 'bg-white/10 border-white/20 text-neutral-100')
                    : 'bg-white/[0.02] border-white/5 text-neutral-400 hover:bg-white/5'
                }`}
                title={isHost ? 'Este monitor contém a janela do OS¹ (gera espelho)' : 'Outro monitor'}
              >
                <Monitor size={10} />
                {s.name}
                {isHost && (
                  <span className="text-[9px] uppercase tracking-wider opacity-80">
                    {active ? '· esta janela' : '· OS¹'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Silencia warn — prop reservada pro futuro Overlay Mode (Nível 3). */}
      {onStopAndType && null}
    </div>
  );
}
