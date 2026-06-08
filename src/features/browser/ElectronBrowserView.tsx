// ElectronBrowser — navegador <webview> nativo (Chromium) com abas.
//
// Conteúdo movido de src/components/BrowserView.tsx (Fase 12) byte-a-byte.
// Nenhum byte de lógica foi alterado: barra de URL, abas, navegação,
// 10 ações OS¹, sincronização e bloco de Desktop Capture (PAUSADO
// atrás das flags do componente — esta refatoração não muda nada disso).
//
// Imports auxiliares vêm de:
//   - ./browser-url-utils   (normalizeUrl, isElectron, DESKTOP_URL, WISP_URL)
//   - ./useBrowserSession   (Tab, makeTab, WebviewElement, declare global)

import React, { useRef, useState, useEffect, useCallback, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, ArrowLeft, ArrowRight, RotateCcw, ExternalLink, Globe, RefreshCw, Plus,
  Monitor, Sparkles, Send, Target, FileText, LayoutGrid, BarChart3, Layers,
  Bell, Scissors, FolderOpen, Bot,
} from 'lucide-react';
import {
  dispatchBrowserAction,
  recordVisit,
  saveEvidence,
  buildMission,
  buildFeedCard,
  buildSessionReport,
  buildTabComparison,
  addWatcher,
  captureSnippet,
  quickAddToSectorDossier,
  buildSectorAgentAnswer,
  type BrowserActionContext,
} from '../../lib/browser-actions';
import { buildDossierSynthesis } from './actions/browser-actions.builders';
import { getRole } from '../../hooks/useAuth';
import { useDarkMode } from '../../hooks/useDarkMode';
import { DesktopView } from '../../components/DesktopView';
import { DESKTOP_URL, normalizeUrl } from './browser-url-utils';
import { makeTab } from './useBrowserSession';
import type { Tab, WebviewElement } from './useBrowserSession';

// ── Navegador com <webview> + abas — só funciona dentro do Electron ───────────
export function ElectronBrowser({ initialUrl, syncing = false, onSyncClick }: {
  initialUrl: string; syncing?: boolean; onSyncClick?: () => void;
}) {
  const isDark = useDarkMode();
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
      flashFeedback('Evidência salva — usável nas análises desta sessão');
      return;
    }
    if (type === 'create-mission') {
      const m = buildMission(ctx, {});
      dispatchBrowserAction({ type, context: ctx, payload: m });
      flashFeedback('Missão criada a partir da página');
      return;
    }
    if (type === 'generate-feed-card') {
      const fc = buildFeedCard(ctx, {});
      dispatchBrowserAction({ type, context: ctx, payload: fc });
      flashFeedback(fc.deduped
        ? 'Este sinal já está no Feed (atualizado para o topo)'
        : 'Card criado no Feed a partir desta página'
      );
      return;
    }
    if (type === 'analyze-session') {
      const r = buildSessionReport({});
      dispatchBrowserAction({ type, context: ctx, payload: r });
      flashFeedback('Relatório da sessão pronto na Área de Trabalho');
      return;
    }
    // ── P4: novas 5 ──
    if (type === 'compare-tabs') {
      const cmp = buildTabComparison();
      dispatchBrowserAction({ type, context: ctx, payload: cmp });
      flashFeedback('Análise de páginas recentes pronta na Área de Trabalho');
      return;
    }
    if (type === 'monitor-page') {
      const w = addWatcher(ctx, 'mudança');
      dispatchBrowserAction({ type, context: ctx, payload: w });
      flashFeedback('Página registrada na watchlist Codify — sem detecção automática ativa');
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
      // Etapa 8: captureSnippet retorna null se nada útil pra salvar.
      // Não salvar evidência vazia — pedir seleção em vez disso.
      if (!ev) {
        flashFeedback('Selecione um trecho da página antes de capturar');
        return;
      }
      dispatchBrowserAction({ type, context: ctx, payload: ev });
      flashFeedback(selectedText ? 'Trecho selecionado capturado e salvo como evidência desta sessão' : 'Trecho da página capturado e salvo como evidência desta sessão');
      return;
    }
    if (type === 'create-dossier') {
      const d = quickAddToSectorDossier(ctx);
      const syn = buildDossierSynthesis(d, ctx);
      dispatchBrowserAction({ type, context: ctx, payload: syn });
      flashFeedback(`Dossiê "${d.nome}" atualizado — síntese pronta na Área de Trabalho`);
      return;
    }
    if (type === 'ask-sector-agent') {
      const a = buildSectorAgentAnswer(ctx);
      dispatchBrowserAction({ type, context: ctx, payload: a });
      flashFeedback('Leitura preliminar pronta na Área de Trabalho');
      return;
    }
    // default: send-to-workspace
    dispatchBrowserAction({ type, context: ctx });
    flashFeedback('Análise da página pronta na Área de Trabalho');
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

  // Estética de container do sistema (mesma usada na Área de Trabalho e Feed):
  // background com elevação visual via shadow externa forte + inset highlight.
  const btnBase = isDark
    ? { background: '#2f2f2f', border: '0.5px solid #3d3d3d', color: '#a0a0a0', boxShadow: '0 10px 24px -4px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.04)' }
    : { background: '#f7f8f9', border: '0.5px solid #e5e7eb', color: '#666',    boxShadow: '0 8px 20px -4px rgba(0,0,0,0.22), 0 2px 6px -2px rgba(0,0,0,0.12), inset 0 1px 2px rgba(255,255,255,0.6)' };
  const btnActive = isDark
    ? { background: '#353535', border: '0.5px solid #4a4a4a', color: '#d0d0d0', boxShadow: '0 10px 24px -4px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.04)' }
    : { background: '#e4e7ea', border: '0.5px solid #d4d7da', color: '#333',    boxShadow: '0 8px 20px -4px rgba(0,0,0,0.22), 0 2px 6px -2px rgba(0,0,0,0.12), inset 0 1px 2px rgba(255,255,255,0.6)' };

  return (
    <div className="flex flex-col w-full h-full select-none">

      {/* ── Barra de abas — slim ───────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', padding: '40px 12px 0',
        background: isDark ? '#2f2f2f' : '#f7f8f9',
        borderBottom: isDark ? '1px solid #4a4a4a' : '1px solid #d4d7da',
        boxShadow: isDark
          ? '0 10px 24px -4px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)'
          : '0 8px 20px -4px rgba(0,0,0,0.22), 0 2px 6px -2px rgba(0,0,0,0.12)',
        overflowX: 'auto', scrollbarWidth: 'none' as const, flexShrink: 0 }}>
        {tabs.map(tab => (
          <motion.button key={tab.id} layout
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.15 }}
            onClick={() => setActiveId(tab.id)}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg flex-shrink-0 group cursor-pointer transition-colors"
            style={{
              maxWidth: 200, minWidth: 100,
              background: tab.id === activeId ? (isDark ? '#ffffff' : '#111') : 'transparent',
              border: '1px solid transparent',
              borderBottom: 'none',
              ...(tab.id === activeId ? { borderColor: isDark ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.07)', marginBottom: -1 } : {}),
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
              style={{ color: tab.id === activeId ? (isDark ? '#111' : '#d0d0d0') : '#555' }}>
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
        padding: '10px 16px 12px',
        background: isDark ? '#2f2f2f' : '#f7f8f9',
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
          ...btnBase }}>
          {isDesktopTab
            ? <Monitor size={17} style={{ color: isDark ? '#464646' : '#888', flexShrink: 0 }} />
            : activeTab?.loading
              ? <div style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                  border: isDark ? '1.5px solid rgba(255,255,255,0.12)' : '1.5px solid rgba(0,0,0,0.12)',
                  borderTopColor: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)',
                  animation: 'spin 0.7s linear infinite' }} />
              : activeTab?.favicon
                ? <img src={activeTab.favicon} style={{ width: 17, height: 17, flexShrink: 0 }} alt=""
                    onError={e => (e.currentTarget.style.display = 'none')} />
                : <Globe size={17} style={{ color: isDark ? '#464646' : '#888', flexShrink: 0 }} />
          }
          <input ref={inputRef} value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown} onFocus={e => e.target.select()}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: isDark ? '#d0d0d0' : '#333', fontSize: 15, minWidth: 0 }}
            placeholder={isDesktopTab ? 'Desktop ativo — digite uma URL pra abrir um site' : 'Endereço ou busca...'} />
        </div>

        {/* Botão Ações removido — ações agora aparecem inline na barra abaixo da URL */}

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

      {/* ── Barra de ações inline (OS¹ · Ações) ────────────────────── */}
      <div style={{
        display: 'flex', gap: 8, padding: '8px 16px 16px',
        background: isDark ? '#2f2f2f' : '#f7f8f9',
        borderBottom: isDark ? '0.5px solid #3d3d3d' : '0.5px solid #e5e7eb',
        // Shadow só pra baixo (spread negativo = blur elimina halo superior)
        boxShadow: isDark
          ? '0 12px 20px -16px rgba(0,0,0,0.8), 0 4px 8px -6px rgba(0,0,0,0.5)'
          : '0 12px 20px -16px rgba(0,0,0,0.35), 0 4px 8px -6px rgba(0,0,0,0.18)',
        flexShrink: 0,
      }}>
        {(() => {
          const role = getRole();
          const isAdmin = role === 'codify';
          const allActions: { id: BrowserActionId; label: string; Icon: typeof Send; adminOnly?: boolean }[] = [
            { id: 'send-to-workspace',  label: 'Enviar',              Icon: Send },
            { id: 'create-mission',     label: 'Missão',              Icon: Target },
            { id: 'save-evidence',      label: 'Evidência',           Icon: FileText },
            { id: 'generate-feed-card', label: 'Card',                Icon: LayoutGrid },
            { id: 'analyze-session',    label: 'Sessão',              Icon: BarChart3 },
            { id: 'compare-tabs',       label: 'Comparar',            Icon: Layers },
            { id: 'monitor-page',       label: 'Acompanhar (Codify)', Icon: Bell, adminOnly: true },
            { id: 'capture-snippet',    label: 'Trecho',              Icon: Scissors },
            { id: 'create-dossier',     label: 'Dossiê',              Icon: FolderOpen },
            { id: 'ask-sector-agent',   label: 'Leitura (Codify)',    Icon: Bot, adminOnly: true },
          ];
          return allActions.filter(a => !a.adminOnly || isAdmin);
        })().map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => runAction(id as any)}
            title={label}
            className="flex-1 min-w-0 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[12px] font-medium cursor-pointer transition-all duration-200 hover:scale-105 active:scale-[0.97] bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] text-neutral-700 dark:text-neutral-200 shadow-[0_4px_10px_-1px_rgba(0,0,0,0.22),0_1px_3px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.6)] dark:shadow-[0_4px_10px_-1px_rgba(0,0,0,0.55),0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.04)] hover:bg-[#e4e7ea] dark:hover:bg-[#353535]"
          >
            <Icon size={13} strokeWidth={1.8} className="text-neutral-500 dark:text-neutral-400 flex-shrink-0" />
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">{label}</span>
          </button>
        ))}
      </div>

      {/* ── Webviews — uma por aba, mostrar/ocultar via CSS ────────── */}
      <div className={`flex-1 relative min-h-0 ${isDark ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
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
