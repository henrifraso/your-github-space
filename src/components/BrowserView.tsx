import React, { useRef, useState, useEffect, useCallback, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowLeft, ArrowRight, RotateCcw, ExternalLink, Globe, RefreshCw, Plus, Monitor, Sparkles, Send, Target, FileText, LayoutGrid, BarChart3, Layers, Bell, Scissors, FolderOpen, Bot } from 'lucide-react';
import {
  dispatchBrowserAction,
  recordVisit,
  saveEvidence,
  buildMission,
  buildFeedCard,
  buildSessionReport,
  // P4 novas
  buildTabComparison,
  addWatcher,
  captureSnippet,
  quickAddToSectorDossier,
  buildSectorAgentAnswer,
  type BrowserActionContext,
} from '../lib/browser-actions';
import { libcurl as _libcurl } from 'libcurl.js';
import { DesktopView } from './DesktopView';

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

// URL sentinela: representa a "tela do desktop real". Não navega — apenas marca a aba como modo desktop.
const DESKTOP_URL = 'omni://desktop';

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

// ── Tipos para o sistema de abas ─────────────────────────────────────────────
interface Tab {
  id: string;
  url: string;
  title: string;
  favicon: string;
  loading: boolean;
  canGoBack: boolean;
  canGoFwd: boolean;
}

function makeTab(url: string): Tab {
  return { id: crypto.randomUUID(), url, title: new URL(url).hostname, favicon: '', loading: true, canGoBack: false, canGoFwd: false };
}

// ── Navegador com <webview> + abas — só funciona dentro do Electron ───────────
function ElectronBrowser({ initialUrl, syncing = false, onSyncClick }: {
  initialUrl: string; syncing?: boolean; onSyncClick?: () => void;
}) {
  const [tabs, setTabs] = useState<Tab[]>(() => [makeTab(normalizeUrl(initialUrl))]);
  const [activeId, setActiveId] = useState(() => tabs[0].id);
  const [inputVal, setInputVal] = useState(initialUrl);
  const webviewRefs = useRef<Map<string, WebviewElement>>(new Map());
  const inputRef = useRef<HTMLInputElement>(null);
  const [desktopEnabled, setDesktopEnabled] = useState(false);
  // Detecta página de bloqueio do Google (captcha / unusual traffic).
  const [googleBlocked, setGoogleBlocked] = useState(false);
  // Fase 5 — menu de Ações universais do navegador (5 funções)
  const [actionsOpen, setActionsOpen] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string>('');
  const actionFeedbackTimerRef = useRef<number | null>(null);
  function flashFeedback(msg: string) {
    setActionFeedback(msg);
    if (actionFeedbackTimerRef.current) window.clearTimeout(actionFeedbackTimerRef.current);
    actionFeedbackTimerRef.current = window.setTimeout(() => setActionFeedback(''), 2400) as unknown as number;
  }
  async function captureContext(): Promise<BrowserActionContext> {
    const wv = webviewRefs.current.get(activeId) as any;
    const url = wv?.getURL?.() || activeTab?.url || '';
    const title = wv?.getTitle?.() || activeTab?.title || '';
    let capturedText = '';
    try {
      const txt = await wv?.executeJavaScript?.(
        'try { (document.body && document.body.innerText) ? document.body.innerText.slice(0, 2000) : "" } catch(e){ "" }'
      );
      if (typeof txt === 'string') capturedText = txt;
    } catch { /* webview indisponível ou bloqueado por CSP — segue sem texto */ }
    return { url, title, capturedText, capturedAt: new Date().toISOString(), origin: 'navegador' };
  }
  type BrowserActionId =
    | 'send-to-workspace' | 'create-mission' | 'save-evidence' | 'generate-feed-card' | 'analyze-session'
    | 'compare-tabs' | 'monitor-page' | 'capture-snippet' | 'create-dossier' | 'ask-sector-agent';
  async function runAction(type: BrowserActionId) {
    setActionsOpen(false);
    if (activeTab && activeTab.url === DESKTOP_URL) {
      flashFeedback('Sem URL ativa nesta aba');
      return;
    }
    const ctx = await captureContext();
    if (!ctx.url || !/^https?:\/\//i.test(ctx.url)) {
      flashFeedback('Página não-navegável');
      return;
    }
    if (type === 'save-evidence') {
      const ev = saveEvidence(ctx, {});
      dispatchBrowserAction({ type, context: ctx, payload: ev });
      flashFeedback('Evidência salva');
      return;
    }
    if (type === 'create-mission') {
      const m = buildMission(ctx, {});
      dispatchBrowserAction({ type, context: ctx, payload: m });
      flashFeedback('Missão proposta enviada');
      return;
    }
    if (type === 'generate-feed-card') {
      const fc = buildFeedCard(ctx, {});
      dispatchBrowserAction({ type, context: ctx, payload: fc });
      flashFeedback('Card adicionado ao feed');
      return;
    }
    if (type === 'analyze-session') {
      const r = buildSessionReport({});
      dispatchBrowserAction({ type, context: ctx, payload: r });
      flashFeedback('Sessão analisada');
      return;
    }
    // ── P4: novas 5 ──
    if (type === 'compare-tabs') {
      const cmp = buildTabComparison();
      dispatchBrowserAction({ type, context: ctx, payload: cmp });
      flashFeedback('Comparação de abas enviada');
      return;
    }
    if (type === 'monitor-page') {
      const w = addWatcher(ctx, 'mudança');
      dispatchBrowserAction({ type, context: ctx, payload: w });
      flashFeedback('Monitoramento desta página ativado');
      return;
    }
    if (type === 'capture-snippet') {
      // Tenta pegar texto selecionado pelo user (no Electron, executeJavaScript ainda funciona)
      let selectedText = '';
      try {
        const wv = webviewRefs.current.get(activeId) as any;
        const sel = await wv?.executeJavaScript?.('window.getSelection()?.toString() || ""');
        if (typeof sel === 'string') selectedText = sel;
      } catch { /* ignore */ }
      const ev = captureSnippet(ctx, { selectedText });
      dispatchBrowserAction({ type, context: ctx, payload: ev });
      flashFeedback(selectedText ? 'Trecho selecionado salvo' : 'Trecho da página salvo');
      return;
    }
    if (type === 'create-dossier') {
      const d = quickAddToSectorDossier(ctx);
      dispatchBrowserAction({ type, context: ctx, payload: d as any });
      flashFeedback(`Página adicionada ao "${d.nome}"`);
      return;
    }
    if (type === 'ask-sector-agent') {
      const a = buildSectorAgentAnswer(ctx);
      dispatchBrowserAction({ type, context: ctx, payload: a });
      flashFeedback('Pergunta enviada ao agente do setor');
      return;
    }
    // default: send-to-workspace
    dispatchBrowserAction({ type, context: ctx });
    flashFeedback('Enviado para Área de Trabalho');
  }

  const activeTab = tabs.find(t => t.id === activeId) ?? tabs[0];
  const isDesktopTab = activeTab?.url === DESKTOP_URL;

  // Detecta se ALGUMA flag de Desktop está ligada (Capture/Control/SCK).
  // Default: false (pausado em 2026-05-28). Quando off:
  //  • botão Monitor não aparece
  //  • DesktopView não monta
  //  • aba que está em omni://desktop é forçada de volta pra google.com
  useEffect(() => {
    let cancelled = false;
    window.electron?.desktop?.isEnabled?.().then(enabled => {
      if (!cancelled) {
        setDesktopEnabled(!!enabled);
        if (!enabled) {
          // Defesa em profundidade: limpa qualquer aba persistida em omni://desktop.
          setTabs(prev => prev.map(t => t.url === DESKTOP_URL ? { ...t, url: 'https://www.google.com', title: 'google.com', loading: true } : t));
        }
      }
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Sincroniza input com a aba ativa — vazio na aba desktop.
  useEffect(() => {
    if (!activeTab) return;
    setInputVal(activeTab.url === DESKTOP_URL ? '' : activeTab.url);
    setGoogleBlocked(/google\.[a-z.]+\/sorry/i.test(activeTab.url) || /\/recaptcha\//i.test(activeTab.url));
  }, [activeId, activeTab?.url]);

  // Registra eventos de uma webview quando ela é montada
  const bindWebview = useCallback((id: string, wv: WebviewElement | null) => {
    if (!wv) { webviewRefs.current.delete(id); return; }
    webviewRefs.current.set(id, wv);

    const update = (patch: Partial<Tab>) =>
      setTabs(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));

    const refreshNav = () => update({
      canGoBack: wv.canGoBack?.() ?? false,
      canGoFwd: wv.canGoForward?.() ?? false,
    });

    const onStart = () => update({ loading: true });
    const onStop = () => {
      update({ loading: false });
      refreshNav();
      // Registra visita pra alimentar análise de sessão (Fase 5, F5).
      try {
        const u = (wv as any).getURL?.() || wv.src || '';
        const t = (wv as any).getTitle?.() || '';
        if (u && !u.startsWith('about:')) recordVisit(u, t);
      } catch { /* ignore */ }
    };
    const onNavigate = (e: any) => {
      const url = e.url || '';
      if (url && !url.startsWith('about:')) {
        update({ url });
        setTabs(prev => prev.map(t => t.id === id && id === activeId ? { ...t, url } : t));
        if (id === activeId) {
          setInputVal(url);
          // Detecta página de captcha/bloqueio do Google (.com/.com.br/qualquer TLD).
          setGoogleBlocked(/google\.[a-z.]+\/sorry/i.test(url) || /\/recaptcha\//i.test(url));
        }
      }
      refreshNav();
      if (url && window.electron) {
        window.electron.captureNavigation({ url, title: '', ts: Date.now() });
      }
    };
    const onTitle = (e: any) => update({ title: e.title || new URL(wv.src || 'about:blank').hostname });
    const onFavicon = (e: any) => update({ favicon: e.favicons?.[0] || '' });

    wv.addEventListener('did-start-loading', onStart);
    wv.addEventListener('did-stop-loading', onStop);
    wv.addEventListener('did-navigate', onNavigate);
    wv.addEventListener('did-navigate-in-page', onNavigate);
    wv.addEventListener('page-title-updated', onTitle);
    wv.addEventListener('page-favicon-updated', onFavicon);
  }, [activeId]);

  function openTab(url = 'https://www.google.com') {
    const tab = makeTab(normalizeUrl(url));
    setTabs(prev => [...prev, tab]);
    setActiveId(tab.id);
  }

  function closeTab(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setTabs(prev => {
      const next = prev.filter(t => t.id !== id);
      if (next.length === 0) return [makeTab('https://www.google.com')];
      return next;
    });
    setActiveId(prev => {
      if (prev !== id) return prev;
      const idx = tabs.findIndex(t => t.id === id);
      return tabs[Math.max(0, idx - 1)]?.id ?? tabs[0].id;
    });
  }

  function navigate(target: string) {
    const trimmed = target.trim();
    // URL vazia + flag ligada → modo desktop. Sem navegar.
    if (!trimmed && desktopEnabled) {
      goDesktop();
      return;
    }
    const resolved = normalizeUrl(trimmed);
    if (!resolved) return;
    webviewRefs.current.get(activeId)?.loadURL?.(resolved);
    setTabs(prev => prev.map(t => t.id === activeId ? { ...t, url: resolved, loading: true, title: 'Carregando...', favicon: '' } : t));
    setInputVal(resolved);
  }

  function goDesktop() {
    // Marca a aba ativa como modo desktop. Não chama loadURL — o <webview> é desmontado pelo render condicional.
    setTabs(prev => prev.map(t => t.id === activeId ? { ...t, url: DESKTOP_URL, title: 'Desktop', loading: false, favicon: '', canGoBack: false, canGoFwd: false } : t));
    setInputVal('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { navigate(inputVal); inputRef.current?.blur(); }
    if (e.key === 'Escape') {
      const cur = activeTab?.url === DESKTOP_URL ? '' : (activeTab?.url ?? '');
      setInputVal(cur);
      inputRef.current?.blur();
    }
  }

  const wv = webviewRefs.current.get(activeId);

  const btnBase = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#747474' };
  const btnActive = { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.13)', color: '#d0d0d0' };

  return (
    <div className="flex flex-col w-full h-full select-none">

      {/* ── Barra de abas — slim ───────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', padding: '8px 12px 0',
        background: '#0d0d0d', borderBottom: '1px solid rgba(255,255,255,0.05)',
        overflowX: 'auto', scrollbarWidth: 'none' as const, flexShrink: 0 }}>
        {tabs.map(tab => (
          <motion.button key={tab.id} layout
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.15 }}
            onClick={() => setActiveId(tab.id)}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg flex-shrink-0 group cursor-pointer transition-colors"
            style={{
              maxWidth: 200, minWidth: 100,
              background: tab.id === activeId ? '#111' : 'transparent',
              border: '1px solid transparent',
              borderBottom: 'none',
              ...(tab.id === activeId ? { borderColor: 'rgba(255,255,255,0.07)', marginBottom: -1 } : {}),
            }}>
            {tab.loading
              ? <div style={{ width: 12, height: 12, borderRadius: '50%', flexShrink: 0,
                  border: '1.5px solid rgba(255,255,255,0.12)',
                  borderTopColor: 'rgba(255,255,255,0.5)',
                  animation: 'spin 0.7s linear infinite' }} />
              : tab.favicon
                ? <img src={tab.favicon} style={{ width: 12, height: 12, flexShrink: 0 }} alt=""
                    onError={e => (e.currentTarget.style.display = 'none')} />
                : <Globe size={11} style={{ color: '#555', flexShrink: 0 }} />
            }
            <span className="text-xs truncate flex-1 text-left"
              style={{ color: tab.id === activeId ? '#d0d0d0' : '#555' }}>
              {tab.title || 'Nova aba'}
            </span>
            {tabs.length > 1 && (
              <button onClick={e => closeTab(tab.id, e)}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded transition-all flex-shrink-0 cursor-pointer"
                style={{ color: '#666' }}>
                <X size={10} />
              </button>
            )}
          </motion.button>
        ))}
        <button onClick={() => openTab()}
          style={{ width: 28, height: 28, marginBottom: 2, marginLeft: 4, borderRadius: 8, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#555', cursor: 'pointer', transition: 'all 0.15s' }}>
          <Plus size={13} />
        </button>
      </div>

      {/* ── Barra de endereço — mesma aparência do IframeBrowser ─── */}
      <div style={{
        padding: '20px 16px 14px', background: '#111',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
      }}>
        {/* Botão Desktop — só se a feature flag estiver ligada */}
        {desktopEnabled && (
          <button onClick={goDesktop} title="Mostrar tela real do desktop"
            style={{ width: 52, height: 52, borderRadius: 16, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.15s',
              ...(isDesktopTab ? btnActive : btnBase) }}>
            <Monitor size={16} strokeWidth={1.8} />
          </button>
        )}

        {/* URL input */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10,
          paddingLeft: 16, paddingRight: 16, height: 52, borderRadius: 16,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {isDesktopTab
            ? <Monitor size={17} style={{ color: '#464646', flexShrink: 0 }} />
            : activeTab?.loading
              ? <div style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                  border: '1.5px solid rgba(255,255,255,0.12)',
                  borderTopColor: 'rgba(255,255,255,0.55)',
                  animation: 'spin 0.7s linear infinite' }} />
              : activeTab?.favicon
                ? <img src={activeTab.favicon} style={{ width: 17, height: 17, flexShrink: 0 }} alt=""
                    onError={e => (e.currentTarget.style.display = 'none')} />
                : <Globe size={17} style={{ color: '#464646', flexShrink: 0 }} />
          }
          <input ref={inputRef} value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown} onFocus={e => e.target.select()}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: '#d0d0d0', fontSize: 15, minWidth: 0 }}
            placeholder={isDesktopTab ? 'Desktop ativo — digite uma URL pra abrir um site' : 'Endereço ou busca...'} />
        </div>

        {/* Fase 5 — Botão Ações universais do navegador (5 funções OS¹) */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button
            onClick={() => setActionsOpen(o => !o)}
            title="OS¹ — ações sobre a página atual"
            style={{ width: 52, height: 52, borderRadius: 16, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.15s',
              ...(actionsOpen ? btnActive : btnBase) }}>
            <Sparkles size={15} strokeWidth={1.8} />
          </button>
          {actionsOpen && (
            <>
              {/* clique fora fecha o menu */}
              <div onClick={() => setActionsOpen(false)}
                style={{ position: 'fixed', inset: 0, zIndex: 49, background: 'transparent' }} />
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 8px)', zIndex: 50,
                width: 280, background: '#0f0f10',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14,
                boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
                padding: 6, color: '#d0d0d0',
              }}>
                <div style={{ padding: '8px 12px 6px', fontSize: 10, letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>OS¹ · Ações</div>
                {[
                  { id: 'send-to-workspace', label: 'Enviar para Área de Trabalho', Icon: Send },
                  { id: 'create-mission',    label: 'Transformar em missão',         Icon: Target },
                  { id: 'save-evidence',     label: 'Salvar como evidência',         Icon: FileText },
                  { id: 'generate-feed-card', label: 'Gerar card no feed',           Icon: LayoutGrid },
                  { id: 'analyze-session',   label: 'Analisar sessão inteira',       Icon: BarChart3 },
                  { id: 'compare-tabs',      label: 'Comparar abas abertas',         Icon: Layers },
                  { id: 'monitor-page',      label: 'Monitorar página',              Icon: Bell },
                  { id: 'capture-snippet',   label: 'Capturar trecho',               Icon: Scissors },
                  { id: 'create-dossier',    label: 'Criar dossiê',                  Icon: FolderOpen },
                  { id: 'ask-sector-agent',  label: 'Perguntar ao agente do setor',  Icon: Bot },
                ].map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => runAction(id as any)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                      background: 'transparent', border: 'none', color: '#d0d0d0',
                      fontSize: 13, textAlign: 'left', transition: 'background 0.12s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Icon size={14} strokeWidth={1.8} style={{ color: 'rgba(255,255,255,0.55)', flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{label}</span>
                  </button>
                ))}
                <div style={{ padding: '10px 12px 8px', fontSize: 10, color: 'rgba(255,255,255,0.32)',
                  borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 4, lineHeight: 1.4 }}>
                  Você controla o que o OS¹ salva. As ações são manuais e nada é capturado sem você clicar.
                </div>
              </div>
            </>
          )}
        </div>

        {/* Abrir no navegador externo do SO (Safari/Chrome padrão) */}
        <button
          onClick={() => {
            const u = activeTab?.url && activeTab.url !== DESKTOP_URL ? activeTab.url : (inputVal && normalizeUrl(inputVal)) || '';
            if (u && /^https?:\/\//i.test(u)) window.electron?.openExternal?.(u);
          }}
          title="Abrir esta página no navegador externo do sistema"
          style={{ width: 52, height: 52, borderRadius: 16, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.15s', ...btnBase }}>
          <ExternalLink size={15} strokeWidth={1.8} />
        </button>

        {/* Ir */}
        <button onClick={() => { navigate(inputVal); inputRef.current?.blur(); }}
          style={{ width: 52, height: 52, borderRadius: 16, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.15s', ...btnBase }}>
          <ArrowRight size={16} strokeWidth={1.8} />
        </button>

        {/* Sincronizar / Fechar */}
        <button onClick={onSyncClick}
          style={{ width: 52, height: 52, borderRadius: 16, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s', ...(syncing ? btnActive : btnBase) }}>
          <AnimatePresence mode="wait">
            <motion.div key={syncing ? 'x' : 'sync'}
              initial={{ opacity: 0, rotate: -20, scale: 0.75 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 20, scale: 0.75 }}
              transition={{ duration: 0.16 }}>
              {syncing ? <X size={16} strokeWidth={1.8} /> : <RefreshCw size={15} strokeWidth={1.8} />}
            </motion.div>
          </AnimatePresence>
        </button>
      </div>

      {/* ── Webviews — uma por aba, mostrar/ocultar via CSS ────────── */}
      <div className="flex-1 relative min-h-0 bg-[#0a0a0a]">
        {tabs.map(tab => {
          const isDesktop = tab.url === DESKTOP_URL;
          // Desktop só monta se a flag estiver ligada. Pausado em 2026-05-28.
          if (isDesktop && !desktopEnabled) {
            return (
              <div key={tab.id}
                style={{ position: 'absolute', inset: 0, display: tab.id === activeId ? 'flex' : 'none' }} />
            );
          }
          return (
            <div
              key={tab.id}
              style={{ position: 'absolute', inset: 0, display: tab.id === activeId ? 'flex' : 'none' }}>
              {isDesktop ? (
                <DesktopView />
              ) : (
                // @ts-ignore — <webview> é elemento nativo do Electron, tipos parciais
                // Sem disablewebsecurity: preserva SameSite, Trust Tokens, COOP/COEP.
                // UA setado tanto via `useragent` aqui quanto via `ses.setUserAgent` no main (defesa em profundidade).
                <webview
                  ref={(el: any) => bindWebview(tab.id, el)}
                  src={tab.url}
                  partition="persist:omni-browser"
                  useragent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
                  allowpopups
                  style={{ width: '100%', height: '100%', display: 'flex' }}
                />
              )}
            </div>
          );
        })}

        {/* Toast de feedback das ações OS¹ (Fase 5) */}
        {actionFeedback && (
          <div style={{
            position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)',
            zIndex: 6, background: 'rgba(20,20,22,0.94)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12,
            padding: '10px 16px', display: 'inline-flex', alignItems: 'center', gap: 8,
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)', color: 'rgba(255,255,255,0.92)',
            fontSize: 13, fontWeight: 500,
          }}>
            <Sparkles size={13} strokeWidth={2} style={{ color: '#fbbf24' }} />
            {actionFeedback}
          </div>
        )}

        {/* Overlay amigável quando Google bloqueia com captcha (não burla — só oferece saída) */}
        {googleBlocked && !isDesktopTab && (
          <div style={{
            position: 'absolute', top: 12, left: 12, right: 12, zIndex: 5,
            background: 'rgba(20, 20, 22, 0.96)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14, padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: '0 8px 30px rgba(0,0,0,0.45)'
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <Globe size={18} style={{ color: '#fbbf24' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: '#f5f5f5', fontSize: 13, fontWeight: 600, margin: 0, marginBottom: 2 }}>
                O Google pediu verificação
              </p>
              <p style={{ color: '#a3a3a3', fontSize: 12, margin: 0, lineHeight: 1.4 }}>
                Você pode concluir manualmente aqui ou abrir no navegador externo.
              </p>
            </div>
            <button
              onClick={() => {
                const u = activeTab?.url;
                if (u && /^https?:\/\//i.test(u)) window.electron?.openExternal?.(u);
              }}
              style={{
                padding: '8px 14px', borderRadius: 10, flexShrink: 0,
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                color: '#f5f5f5', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 6
              }}>
              <ExternalLink size={13} strokeWidth={1.8} />
              Abrir no navegador externo
            </button>
            <button
              onClick={() => setGoogleBlocked(false)}
              title="Fechar aviso"
              style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: '#737373', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
              <X size={15} strokeWidth={1.8} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const WISP_URL = 'wss://wisp.mercurywork.shop/';

function proxifyClient(url: string, base: string): string {
  if (!url) return url;
  const skip = ['data:', 'blob:', 'javascript:', 'mailto:', 'tel:', '#', 'about:'];
  if (skip.some(p => url.startsWith(p))) return url;
  if (url.startsWith('/api/proxy')) return url;
  try {
    const abs = /^https?:\/\//i.test(url) ? url : new URL(url, base).href;
    if (abs.includes('/api/proxy?url=')) return abs; // já é URL proxiada — não envelopar de novo
    return `/api/proxy?url=${encodeURIComponent(abs)}`;
  } catch { return url; }
}

function rewriteHtmlClient(html: string, pageUrl: string): string {
  html = html.replace(/<meta[^>]+(?:x-frame-options|content-security-policy)[^>]*>/gi, '');
  html = html.replace(/<meta[^>]+name=["']viewport["'][^>]*>/gi, '');
  html = html.replace(/\starget=["']_blank["']/gi, '');
  html = html.replace(/(\s(?:href|src|action|data-src|poster)=")([^"]+)(")/g,
    (_, a, u, b) => u.startsWith('/api/proxy') ? _ : a + proxifyClient(u, pageUrl) + b);
  html = html.replace(/(\s(?:href|src|action|data-src|poster)=')([^']+)(')/g,
    (_, a, u, b) => u.startsWith('/api/proxy') ? _ : a + proxifyClient(u, pageUrl) + b);
  html = html.replace(
    /(<script[^>]*>)([\s\S]*?ytInitialPlayerResponse[\s\S]*?)(<\/script>)/gi,
    (_m, open, body, close) => open + body.replace(
      /"(https:\/\/[^"]*googlevideo\.com[^"]+)"/g,
      (_u: string, u: string) => `"/api/proxy?url=${encodeURIComponent(u)}"`
    ) + close
  );
  const pageOrigin = (() => { try { return new URL(pageUrl).origin; } catch { return ''; } })();
  const tracker = `<script>(function(){
var __rp=window.parent;
try{Object.defineProperty(window,'top',{get:function(){return window;},configurable:true});}catch(e){}
try{Object.defineProperty(window,'parent',{get:function(){return window;},configurable:true});}catch(e){}
try{Object.defineProperty(window,'self',{get:function(){return window;},configurable:true});}catch(e){}
try{Object.defineProperty(window,'frameElement',{get:function(){return null;},configurable:true});}catch(e){}
try{Object.defineProperty(navigator,'webdriver',{get:function(){return false;},configurable:true});}catch(e){}
try{if(!window.chrome)window.chrome={runtime:{}};}catch(e){}
try{window.rwt=function(){return true;};}catch(e){}
var BASE=${JSON.stringify(pageUrl)};
var BASE_ORIGIN=${JSON.stringify(pageOrigin)};
try{
  var _pu=new URL(BASE);
  var _fakeLocation={
    href:_pu.href,origin:_pu.origin,hostname:_pu.hostname,
    host:_pu.host,pathname:_pu.pathname,search:_pu.search,
    hash:_pu.hash,protocol:_pu.protocol,port:_pu.port,
    assign:function(u){intercept(u);},
    replace:function(u){intercept(u);},
    reload:function(){},
    toString:function(){return _pu.href;}
  };
  Object.defineProperty(window,'location',{get:function(){return _fakeLocation;},configurable:true});
  try{Object.defineProperty(document,'referrer',{get:function(){return BASE_ORIGIN;},configurable:true});}catch(e){}
  try{Object.defineProperty(document,'URL',{get:function(){return BASE;},configurable:true});}catch(e){}
  try{Object.defineProperty(document,'documentURI',{get:function(){return BASE;},configurable:true});}catch(e){}
  try{Object.defineProperty(document,'location',{get:function(){return _fakeLocation;},configurable:true});}catch(e){}
}catch(e){}
try{
  var _fakeHistory={
    pushState:function(s,t,u){if(u){try{var abs=new URL(u,BASE).href;var pn=new URL(BASE);var nn=new URL(abs);if(pn.pathname+pn.search!==nn.pathname+nn.search){BASE=abs;var real=toReal(abs);if(!real.includes('/api/proxy')){loading();nav(real);}}}catch(e){}}},
    replaceState:function(s,t,u){if(u){try{BASE=new URL(u,BASE).href;}catch(e){}}},
    go:function(){},back:function(){},forward:function(){},state:null,length:1
  };
  Object.defineProperty(window,'history',{get:function(){return _fakeHistory;},configurable:true});
}catch(e){}
function nav(url){try{__rp.postMessage({type:'omni-nav',url:url},'*')}catch(e){}}
function loading(){try{__rp.postMessage({type:'omni-loading'},'*')}catch(e){}}
function toReal(u){
  try{
    var abs=new URL(u,BASE).href;
    var pu=new URL(abs);
    var p=pu.searchParams.get('url');
    if(p)return p;
    if(pu.hostname.includes('google.')&&pu.pathname==='/url'){var q=pu.searchParams.get('q');if(q)return q;}
    return abs;
  }catch(e){return u;}
}
function intercept(u){
  if(!u)return false;
  try{
    var abs=new URL(u,BASE).href;
    if(abs.includes('/api/proxy?url='))return false;
    nav(toReal(abs));
    return true;
  }catch(e){return false;}
}
try{
  var lp=Location.prototype;
  var oa=lp.assign.bind(location);
  lp.assign=function(u){if(!intercept(u))oa(u);};
  var or_=lp.replace.bind(location);
  lp.replace=function(u){if(!intercept(u))or_(u);};
}catch(e){}
try{
  var ld=Object.getOwnPropertyDescriptor(Location.prototype,'href')||
         Object.getOwnPropertyDescriptor(Object.getPrototypeOf(location),'href');
  if(ld&&ld.set){
    var oh=ld.set;
    Object.defineProperty(Location.prototype,'href',{
      get:ld.get,
      set:function(u){if(!intercept(u))oh.call(this,u);},
      configurable:true
    });
  }
}catch(e){}
document.addEventListener('submit',function(e){
  var f=e.target;
  if(!f||f.nodeName!=='FORM')return;
  if((f.getAttribute('method')||'get').toLowerCase()!=='get')return;
  try{
    var action=toReal(f.getAttribute('action')||'');
    var fd=new URLSearchParams(new FormData(f));
    var url=action.split('?')[0]+'?'+fd.toString();
    e.preventDefault();loading();nav(url);
  }catch(ex){}
},true);
document.addEventListener('click',function(e){
  var el=e.target;var d=0;
  while(el&&el.nodeName!=='A'&&d<8){el=el.parentElement;d++;}
  if(!el||el.nodeName!=='A')return;
  var href=el.getAttribute('href')||el.getAttribute('data-href');
  if(!href||href.startsWith('javascript:')||href.startsWith('#')||href.startsWith('mailto:'))return;
  if(!/^https?:\/\/|^\//i.test(href))return;
  e.preventDefault();loading();nav(toReal(href));
},true);
try{
  var _of=window.fetch;
  window.fetch=function(input,init){
    try{
      var u=typeof input==='string'?input:(input&&input.url?input.url:'');
      if(u&&/^https?:\/\//i.test(u)&&!u.includes('/api/proxy')){
        var pu='/api/proxy?url='+encodeURIComponent(u);
        input=typeof input==='string'?pu:new Request(pu,input);
      }
    }catch(e){}
    return _of.apply(this,arguments);
  };
}catch(e){}
try{
  var _ox=XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open=function(m,u){
    if(u&&typeof u==='string'&&/^https?:\/\//i.test(u)&&!u.includes('/api/proxy')){
      arguments[1]='/api/proxy?url='+encodeURIComponent(u);
    }
    return _ox.apply(this,arguments);
  };
}catch(e){}
})();</script>`;
  return /<head/i.test(html)
    ? html.replace(/(<head[^>]*>)/i, '$1' + tracker)
    : tracker + html;
}

// ── Navegador com libcurl.js (primário) + iframe proxy (fallback) ─────────────
function IframeBrowser({ initialUrl, lightMode = false, syncing = false, onSyncClick }: {
  initialUrl: string; lightMode?: boolean; syncing?: boolean; onSyncClick?: () => void;
}) {
  const [inputVal, setInputVal] = useState(initialUrl);
  const [loading, setLoading] = useState(true);
  const [navCount, setNavCount] = useState(0);
  const [srcDoc, setSrcDoc] = useState<string | null>(null);
  const [proxyUrl, setProxyUrl] = useState<string | null>(null);
  const [lcState, setLcState] = useState<'loading' | 'ready' | 'failed'>('loading');
  const lcRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const didInitRef = useRef(false);
  const currentUrlRef = useRef(initialUrl); // URL atual para deduplicação
  const lm = lightMode;
  // ── Menu OS¹ Ações (10 funções) — mesmo do ElectronBrowser, sem executeJavaScript
  const [actionsOpen, setActionsOpen] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string>('');
  const actionFeedbackTimerRef = useRef<number | null>(null);
  function flashFeedback(msg: string) {
    setActionFeedback(msg);
    if (actionFeedbackTimerRef.current) window.clearTimeout(actionFeedbackTimerRef.current);
    actionFeedbackTimerRef.current = window.setTimeout(() => setActionFeedback(''), 2400) as unknown as number;
  }
  function getIframeCtx(): BrowserActionContext {
    const url = currentUrlRef.current || inputVal || '';
    // No web (CORS) não conseguimos ler innerText do iframe — capturedText fica vazio.
    return { url, title: '', capturedText: '', capturedAt: new Date().toISOString(), origin: 'navegador' };
  }
  type BrowserActionId =
    | 'send-to-workspace' | 'create-mission' | 'save-evidence' | 'generate-feed-card' | 'analyze-session'
    | 'compare-tabs' | 'monitor-page' | 'capture-snippet' | 'create-dossier' | 'ask-sector-agent';
  function runAction(type: BrowserActionId) {
    setActionsOpen(false);
    const ctx = getIframeCtx();
    if (!ctx.url || !/^https?:\/\//i.test(ctx.url)) { flashFeedback('Página não-navegável'); return; }
    if (type === 'save-evidence') {
      const ev = saveEvidence(ctx, {});
      dispatchBrowserAction({ type, context: ctx, payload: ev });
      flashFeedback('Evidência salva'); return;
    }
    if (type === 'create-mission') {
      dispatchBrowserAction({ type, context: ctx, payload: buildMission(ctx, {}) });
      flashFeedback('Missão proposta enviada'); return;
    }
    if (type === 'generate-feed-card') {
      dispatchBrowserAction({ type, context: ctx, payload: buildFeedCard(ctx, {}) });
      flashFeedback('Card adicionado ao feed'); return;
    }
    if (type === 'analyze-session') {
      dispatchBrowserAction({ type, context: ctx, payload: buildSessionReport({}) });
      flashFeedback('Sessão analisada'); return;
    }
    if (type === 'compare-tabs') {
      dispatchBrowserAction({ type, context: ctx, payload: buildTabComparison() });
      flashFeedback('Comparação de abas enviada'); return;
    }
    if (type === 'monitor-page') {
      addWatcher(ctx, 'mudança');
      dispatchBrowserAction({ type, context: ctx });
      flashFeedback('Monitoramento ativado'); return;
    }
    if (type === 'capture-snippet') {
      captureSnippet(ctx, {});
      dispatchBrowserAction({ type, context: ctx });
      flashFeedback('Trecho da página salvo'); return;
    }
    if (type === 'create-dossier') {
      const d = quickAddToSectorDossier(ctx);
      dispatchBrowserAction({ type, context: ctx });
      flashFeedback(`Página adicionada ao "${d.nome}"`); return;
    }
    if (type === 'ask-sector-agent') {
      dispatchBrowserAction({ type, context: ctx, payload: buildSectorAgentAnswer(ctx) });
      flashFeedback('Pergunta enviada ao agente do setor'); return;
    }
    // default: send-to-workspace
    dispatchBrowserAction({ type, context: ctx });
    flashFeedback('Enviado para Área de Trabalho');
  }

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(err =>
        console.warn('[SW]', err)
      );
    }
  }, []);

  // Carrega libcurl.js + WASM (named export { libcurl } — não usa .default)
  useEffect(() => {
    (async () => {
      try {
        await _libcurl.load_wasm('/libcurl.wasm');
        _libcurl.set_websocket(WISP_URL);
        lcRef.current = _libcurl;
        setLcState('ready');
      } catch (err) {
        console.warn('[libcurl] falhou ao carregar, usando proxy:', err);
        setLcState('failed');
      }
    })();
  }, []);

  const fetchWithLibcurl = useCallback(async (url: string) => {
    const lc = lcRef.current;
    if (!lc) throw new Error('libcurl não disponível');
    const resp = await lc.fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,*/*;q=0.9',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
      }
    });
    return await resp.text();
  }, []);

  const goLibcurl = useCallback(async (url: string) => {
    if (url.includes('/api/proxy?url=')) return;
    currentUrlRef.current = url;
    setLoading(true);
    setInputVal(url);
    try {
      const html = await fetchWithLibcurl(url);
      setSrcDoc(rewriteHtmlClient(html, url));
      setProxyUrl(null);
      setNavCount(c => c + 1);
      setLoading(false);
    } catch (err) {
      console.warn('[libcurl] fetch falhou, fallback proxy:', err);
      if (/^https?:\/\//i.test(url) && !url.includes('/api/proxy')) {
        setProxyUrl(url);
        setSrcDoc(null);
        setNavCount(c => c + 1);
      } else {
        setLoading(false);
      }
    }
  }, [fetchWithLibcurl]);

  // Navegação inicial após libcurl carregar
  useEffect(() => {
    if (didInitRef.current) return;
    if (lcState === 'ready') {
      didInitRef.current = true;
      goLibcurl(initialUrl);
    } else if (lcState === 'failed') {
      didInitRef.current = true;
      setProxyUrl(initialUrl);
      setSrcDoc(null);
      setNavCount(c => c + 1);
    }
  }, [lcState, initialUrl, goLibcurl]);

  // Safety timeout
  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), 12000);
    return () => clearTimeout(t);
  }, [loading, navCount]);

  // postMessage do iframe (cliques em links no srcDoc)
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.data?.type === 'omni-loading') { setLoading(true); return; }
      if (e.data?.type !== 'omni-nav') return;
      const url = e.data.url as string;
      if (!url) return;
      if (url.includes('/api/proxy?url=')) return;
      // Deduplicação: SPA (Google, etc.) pode enviar a mesma URL várias vezes
      if (url === currentUrlRef.current) { setLoading(false); return; }
      if (lcRef.current) goLibcurl(url);
      else if (/^https?:\/\//i.test(url)) { setProxyUrl(url); setSrcDoc(null); setInputVal(url); setNavCount(c => c + 1); }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [goLibcurl]);

  function navigate(target: string) {
    const resolved = normalizeUrl(target);
    if (!resolved) return;
    if (lcRef.current) goLibcurl(resolved);
    else { setProxyUrl(resolved); setSrcDoc(null); setInputVal(resolved); setLoading(true); setNavCount(c => c + 1); }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') navigate(inputVal);
  }

  function handleLoad() {
    setLoading(false);
    if (proxyUrl && !srcDoc) {
      try {
        const loc = iframeRef.current?.contentWindow?.location;
        if (loc) { const r = new URLSearchParams(loc.search).get('url'); if (r) setInputVal(r); }
      } catch {}
    }
  }

  const isInit = lcState === 'loading' && navCount === 0;

  const btnBase = lm
    ? { background: 'rgba(28,23,18,0.05)', border: '1px solid rgba(28,23,18,0.10)', color: '#4a3f36' }
    : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#747474' };
  const btnActive = lm
    ? { background: 'rgba(28,23,18,0.11)', border: '1px solid rgba(28,23,18,0.18)', color: '#1C1712' }
    : { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.13)', color: '#d0d0d0' };

  return (
    <div className="flex flex-col w-full h-full">
      {/* ── Barra única — espaço acima + URL + ações ─── */}
      <div style={{
        padding: '20px 16px 14px',
        background: lm ? '#EDE8DF' : '#111',
        borderBottom: lm ? '1px solid rgba(28,23,18,0.08)' : '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
      }}>
        {/* Input URL */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 10,
          paddingLeft: 16, paddingRight: 16, height: 52, borderRadius: 16,
          background: lm ? 'rgba(28,23,18,0.05)' : 'rgba(255,255,255,0.04)',
          border: lm ? '1px solid rgba(28,23,18,0.10)' : '1px solid rgba(255,255,255,0.07)',
        }}>
          {loading
            ? <div style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                border: lm ? '1.5px solid rgba(28,23,18,0.15)' : '1.5px solid rgba(255,255,255,0.12)',
                borderTopColor: lm ? 'rgba(28,23,18,0.55)' : 'rgba(255,255,255,0.55)',
                animation: 'spin 0.7s linear infinite' }} />
            : <Globe size={17} style={{ color: lm ? '#9a8f84' : '#464646', flexShrink: 0 }} />
          }
          <input value={inputVal} onChange={e => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown} onFocus={e => e.target.select()}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: lm ? '#1C1712' : '#d0d0d0', fontSize: 15, minWidth: 0 }}
            placeholder="Endereço ou busca..." />
        </div>

        {/* Botão nova aba — inativo por enquanto */}
        <button disabled
          style={{ width: 52, height: 52, borderRadius: 16, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'default', transition: 'all 0.15s', ...btnBase }}>
          <ExternalLink size={15} strokeWidth={1.8} />
        </button>

        {/* Botão OS¹ Ações (10 funções) — antes do "Ir" e do "Sincronizar" */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button
            onClick={() => setActionsOpen(o => !o)}
            title="OS¹ — ações sobre a página atual"
            style={{ width: 52, height: 52, borderRadius: 16, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.15s',
              ...(actionsOpen ? btnActive : btnBase) }}>
            <Sparkles size={15} strokeWidth={1.8} />
          </button>
          {actionsOpen && (
            <>
              <div onClick={() => setActionsOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 49, background: 'transparent' }} />
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 8px)', zIndex: 50,
                width: 300, background: '#0f0f10', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14, boxShadow: '0 24px 60px rgba(0,0,0,0.6)', padding: 6, color: '#d0d0d0',
              }}>
                <div style={{ padding: '8px 12px 6px', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>OS¹ · Ações</div>
                {[
                  { id: 'send-to-workspace', label: 'Enviar para Área de Trabalho', Icon: Send },
                  { id: 'create-mission',    label: 'Transformar em missão',         Icon: Target },
                  { id: 'save-evidence',     label: 'Salvar como evidência',         Icon: FileText },
                  { id: 'generate-feed-card', label: 'Gerar card no feed',           Icon: LayoutGrid },
                  { id: 'analyze-session',   label: 'Analisar sessão inteira',       Icon: BarChart3 },
                  { id: 'compare-tabs',      label: 'Comparar abas abertas',         Icon: Layers },
                  { id: 'monitor-page',      label: 'Monitorar página',              Icon: Bell },
                  { id: 'capture-snippet',   label: 'Capturar trecho',               Icon: Scissors },
                  { id: 'create-dossier',    label: 'Criar dossiê',                  Icon: FolderOpen },
                  { id: 'ask-sector-agent',  label: 'Perguntar ao agente do setor',  Icon: Bot },
                ].map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => runAction(id as any)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                      background: 'transparent', border: 'none', color: '#d0d0d0',
                      fontSize: 13, textAlign: 'left', transition: 'background 0.12s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Icon size={14} strokeWidth={1.8} style={{ color: 'rgba(255,255,255,0.55)', flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{label}</span>
                  </button>
                ))}
                <div style={{ padding: '10px 12px 8px', fontSize: 10, color: 'rgba(255,255,255,0.32)', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 4, lineHeight: 1.4 }}>
                  Você controla o que o OS¹ salva. As ações são manuais.
                </div>
              </div>
            </>
          )}
        </div>

        {/* Botão Ir */}
        <button onClick={() => navigate(inputVal)}
          style={{ width: 52, height: 52, borderRadius: 16, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.15s', ...btnBase }}>
          <ArrowRight size={16} strokeWidth={1.8} />
        </button>

        {/* Botão Sincronizar ↔ Fechar */}
        <button onClick={onSyncClick}
          style={{ width: 52, height: 52, borderRadius: 16, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s', ...(syncing ? btnActive : btnBase) }}>
          <AnimatePresence mode="wait">
            <motion.div key={syncing ? 'x' : 'sync'}
              initial={{ opacity: 0, rotate: -20, scale: 0.75 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 20, scale: 0.75 }}
              transition={{ duration: 0.16 }}>
              {syncing ? <X size={16} strokeWidth={1.8} /> : <RefreshCw size={15} strokeWidth={1.8} />}
            </motion.div>
          </AnimatePresence>
        </button>
      </div>

      <div className="flex-1 relative min-h-0" style={{ background: lm ? '#F5F1EA' : '#0a0a0a' }}>
        {/* Toast feedback das ações OS¹ */}
        {actionFeedback && (
          <div style={{
            position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)',
            zIndex: 20, background: 'rgba(20,20,22,0.94)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12,
            padding: '10px 16px', display: 'inline-flex', alignItems: 'center', gap: 8,
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)', color: 'rgba(255,255,255,0.92)',
            fontSize: 13, fontWeight: 500,
          }}>
            <Sparkles size={13} strokeWidth={2} style={{ color: '#fbbf24' }} />
            {actionFeedback}
          </div>
        )}
        {(loading || isInit) && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
            style={{ background: lm ? '#F5F1EA' : '#0a0a0a' }}>
            <div className="w-6 h-6 border-2 border-[#3b82f6] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {srcDoc !== null && (
          <iframe
            ref={iframeRef}
            key={'lc-' + navCount}
            srcDoc={srcDoc}
            className="w-full h-full border-0"
            onLoad={handleLoad}
            onError={() => setLoading(false)}
            title="Omni Browser"
            sandbox="allow-scripts allow-forms allow-modals allow-popups allow-same-origin"
          />
        )}
        {srcDoc === null && proxyUrl && (
          <iframe
            ref={iframeRef}
            key={'px-' + navCount}
            src={`/api/proxy?url=${encodeURIComponent(proxyUrl)}`}
            className="w-full h-full border-0"
            onLoad={handleLoad}
            onError={() => setLoading(false)}
            title="Omni Browser"
            sandbox="allow-same-origin allow-scripts allow-forms allow-modals"
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
