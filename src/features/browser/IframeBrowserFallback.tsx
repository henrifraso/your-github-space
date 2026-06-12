// IframeBrowserFallback — navegador iframe + libcurl.js (fallback web).
//
// Usado quando o app NÃO está rodando dentro do Electron. Faz:
//   - libcurl.js (WebSocket WISP) como primário pra buscar HTML real
//   - proxy server-side (`/api/proxy`) como fallback
//   - rewrite do HTML pra interceptar cliques/forms/fetch/XHR e rotear
//     navegação via postMessage (protocolos `omni-nav`/`omni-loading`)
//
// Conteúdo movido de src/components/BrowserView.tsx (Fase 12) byte-a-byte.
// Nenhum byte de comportamento foi alterado.
//
// Imports auxiliares vêm de:
//   - ./browser-url-utils   (normalizeUrl, proxifyClient, rewriteHtmlClient, WISP_URL)
//   - ../../lib/browser-actions (10 ações OS¹)

import React, { useRef, useState, useEffect, useCallback, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, ArrowLeft, ArrowRight, RotateCcw, ExternalLink, Globe, RefreshCw, Plus,
  Monitor, Sparkles, Send, Target, FileText, LayoutGrid, BarChart3, Layers,
  Bell, Scissors, FolderOpen, Bot,
} from 'lucide-react';
import {
  dispatchBrowserAction,
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
import { libcurl as _libcurl } from 'libcurl.js';
import {
  normalizeUrl,
  proxifyClient,
  rewriteHtmlClient,
  WISP_URL,
} from './browser-url-utils';

// ── Navegador com libcurl.js (primário) + iframe proxy (fallback) ─────────────
export function IframeBrowser({ initialUrl, lightMode = false, syncing = false, onSyncClick }: {
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
      flashFeedback('Evidência salva — usável nas análises desta sessão'); return;
    }
    if (type === 'create-mission') {
      dispatchBrowserAction({ type, context: ctx, payload: buildMission(ctx, {}) });
      // C1-B: feedback alinhado ao canônico do C1 ('plano'/'rascunho'). Id da
      // ação ('create-mission') é union type fixo em core/types/browser.ts e
      // permanece como contrato interno — só texto user-facing foi limpo.
      flashFeedback('Plano da página criado'); return;
    }
    if (type === 'generate-feed-card') {
      const fc = buildFeedCard(ctx, {});
      dispatchBrowserAction({ type, context: ctx, payload: fc });
      flashFeedback(fc.deduped
        ? 'Este sinal já está no Feed (atualizado para o topo)'
        : 'Card criado no Feed a partir desta página'
      ); return;
    }
    if (type === 'analyze-session') {
      dispatchBrowserAction({ type, context: ctx, payload: buildSessionReport({}) });
      flashFeedback('Relatório da sessão pronto na Área de Trabalho'); return;
    }
    if (type === 'compare-tabs') {
      dispatchBrowserAction({ type, context: ctx, payload: buildTabComparison() });
      flashFeedback('Análise de páginas recentes pronta na Área de Trabalho'); return;
    }
    if (type === 'monitor-page') {
      addWatcher(ctx, 'mudança');
      dispatchBrowserAction({ type, context: ctx });
      flashFeedback('Página registrada na watchlist Codify — sem detecção automática ativa'); return;
    }
    if (type === 'capture-snippet') {
      const ev = captureSnippet(ctx, {});
      if (!ev) {
        // Em fallback web não há getSelection cross-origin; só salva se
        // capturedText estiver presente. Se ambos vazios, peça seleção.
        flashFeedback('Selecione um trecho da página antes de capturar');
        return;
      }
      dispatchBrowserAction({ type, context: ctx, payload: ev });
      flashFeedback('Trecho da página capturado e salvo como evidência desta sessão'); return;
    }
    if (type === 'create-dossier') {
      const d = quickAddToSectorDossier(ctx);
      const syn = buildDossierSynthesis(d, ctx);
      dispatchBrowserAction({ type, context: ctx, payload: syn });
      flashFeedback(`Dossiê "${d.nome}" atualizado — síntese pronta na Área de Trabalho`); return;
    }
    if (type === 'ask-sector-agent') {
      dispatchBrowserAction({ type, context: ctx, payload: buildSectorAgentAnswer(ctx) });
      flashFeedback('Leitura preliminar pronta na Área de Trabalho'); return;
    }
    // default: send-to-workspace
    dispatchBrowserAction({ type, context: ctx });
    flashFeedback('Análise da página pronta na Área de Trabalho');
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
                {(() => {
                  const role = getRole();
                  const isAdmin = role === 'codify';
                  const allActions: { id: BrowserActionId; label: string; Icon: typeof Send; adminOnly?: boolean }[] = [
                    { id: 'send-to-workspace', label: 'Enviar para Área de Trabalho', Icon: Send },
                    { id: 'create-mission',    label: 'Preparar plano da página',     Icon: Target },
                    { id: 'save-evidence',     label: 'Salvar como evidência',        Icon: FileText },
                    { id: 'generate-feed-card', label: 'Gerar card no feed',          Icon: LayoutGrid },
                    { id: 'analyze-session',   label: 'Analisar sessão inteira',      Icon: BarChart3 },
                    { id: 'compare-tabs',      label: 'Comparar páginas recentes',    Icon: Layers },
                    { id: 'monitor-page',      label: 'Acompanhar página (Codify)',   Icon: Bell, adminOnly: true },
                    { id: 'capture-snippet',   label: 'Capturar trecho',              Icon: Scissors },
                    { id: 'create-dossier',    label: 'Criar dossiê',                 Icon: FolderOpen },
                    { id: 'ask-sector-agent',  label: 'Leitura preliminar do setor (Codify)', Icon: Bot, adminOnly: true },
                  ];
                  return allActions.filter(a => !a.adminOnly || isAdmin);
                })().map(({ id, label, Icon }) => (
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
