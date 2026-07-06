import React, { useState, useRef, useEffect } from 'react';
import {
  X, ArrowUp, LayoutDashboard, Search, Zap, BookOpen, BarChart2, Compass, Eye, ClipboardList, Target,
  Lightbulb, FileText, FlaskConical, CheckCircle, Gauge, AlignLeft, Star as StarIcon, TrendingUp,
  Home, Plus, Globe, Upload, Bell, RefreshCw, Pin, Copy, AlertTriangle, Info, Layers, GitCompare,
  Languages, Users, Send as SendIcon, Bookmark, Share2, Brain, Award, MessageSquare, FileQuestion,
  Sparkles, Loader2, History, MapPin,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { IntelligenceCard, WorkspaceIntent } from './WorkspacePanel';
import { ActionResult } from './WorkspacePanel';
import { getFixtureRelations } from '../core/relations/relation-generator';
import type { Relation } from '../core/relations/relation';
import { apiFetch } from '../api';
import { SPLIT_TOP_GAP_PB, SPLIT_FRAME_TOP_PX } from '../constants/split-layout';
import { WorkspaceTools, ToolBlockContent } from './WorkspaceTools';
import {
  InitialBlockContent,
  DiagnosticBlockContent,
} from '../features/workspace/blocks/WorkspaceBlockContent';
import { WorkspaceBlockHeader } from '../features/workspace/blocks/WorkspaceBlockHeader';
import { BlockCtrl } from '../features/workspace/blocks/WorkspaceBlockActions';
import { CardGovernanceActions } from './CardGovernanceActions';
import type {
  WorkspaceTool,
  WorkspaceToolContext,
  ToolOutput,
  ToolMode,
  ToolSource,
} from '../lib/workspace-tools';
import { isSensitiveDomain, inferSourceFromCardId } from '../lib/workspace-tools';
import { useCodifyCardContext, type CodifyScope } from '../features/feed/use-codify-card-context';
import { WorkspaceContextBlock } from '../features/workspace/blocks/WorkspaceContextBlock';
import { saveWorkspaceBlock, loadLastWorkspaceBlock } from '../features/workspace/persistence/workspace-blocks-api';

// Tipos públicos do Workspace foram movidos para core/types/workspace.ts.
// Reexportamos para manter compatibilidade com imports existentes.
import type { CompanyDiagnosticPayload, WorkspaceContext } from '../core/types/workspace';
export type { CompanyDiagnosticPayload, WorkspaceContext };

// Tipos e constantes-base de geração foram movidos para
// src/features/workspace/generation/* (Fase 10).
// Mantemos importados aqui os símbolos consumidos pelo ChatBody/WorkspaceToolbar.
import type {
  MainKey, Dificuldade, LocalShortcut, RemoteShortcut, SubAction, WorkspaceBlock,
} from '../features/workspace/generation/workspace-generation';
import {
  INTENT_TO_MAIN, DIFICULDADE_LABELS, MODE_LABEL, MODE_FIELDS, MODE_TOP5,
  SUB_BTNS, SHARE_OPTIONS,
} from '../features/workspace/generation/workspace-generation';
import {
  shortcutsForCard, buildInitialBlock, buildDiagnosticBlock, buildShareBlock,
  buildBlockShortcuts, buildModeBlock,
} from '../features/workspace/generation/workspace-block-builders';
import { executeAction } from '../features/workspace/execute/action-executor';
import { addContextUpload, resolveUploadOrgBu } from '../features/score/contextUploads';

type Phase = 'init' | 'expanded' | 'selected';

// Flags de experiência — leitura simples a partir do card, sem parecer painel
// de ferramentas soltas. Desligadas nesta versão; lógica/JSX preservados
// para reativação futura.
const SHOW_BLOCK_SHORTCUTS = false; // atalhos "Separar evidências/Simular cenário/..." por bloco
const SHOW_SAVE_BUTTON = false;     // botão "Salvar" — hoje idêntico a arquivar, sem persistência própria

const MAIN_BTNS: { key: MainKey; label: string; Icon: React.ElementType }[] = [
  { key: 'pesquisar', label: 'Entender', Icon: Search    },
  { key: 'executar',  label: 'Analisar', Icon: Zap       },
  { key: 'aprender',  label: 'Aprender', Icon: BookOpen  },
];

// SUB_BTNS, MODE_LABEL, MODE_FIELDS, MODE_TOP5, BlockKind, MODE_TITLES,
// SubAction, WorkspaceBlock — todos movidos para
// src/features/workspace/generation/workspace-generation.ts (Fase 10).

// Toolbar fixo do ChatPanel: 4 chips premium e limpos, sem expansão de listas.
// Cada modo gera um bloco de conteúdo abaixo — os 10 atalhos vão dentro do bloco.
function WorkspaceToolbar({ activeMode, workspaceOpen, onModeClick, onWorkspaceClick, disabled, hasContent, onErase, onFinish }: {
  activeMode?: MainKey | null;
  workspaceOpen: boolean;
  onModeClick: (mode: MainKey) => void;
  onWorkspaceClick: () => void;
  disabled?: boolean;
  /** Quando true, o botão único vira 3 botões: Apagar · Salvar · Finalizar. */
  hasContent?: boolean;
  /** Handler do botão "Apagar" (esquerdo) — só usado quando hasContent. */
  onErase?: () => void;
  /** Handler do botão "Finalizar" (direito) — só usado quando hasContent. */
  onFinish?: () => void;
}) {
  const chipBase = "flex items-center justify-center gap-1.5 h-9 rounded-xl border-[0.5px] transition-all duration-150 hover:scale-105 active:scale-[0.97] cursor-pointer disabled:cursor-default disabled:opacity-100 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)]";
  const sharedBg = "bg-[#f7f8f9] dark:bg-[#2f2f2f] border-neutral-200 dark:border-[#3d3d3d] hover:bg-neutral-200 dark:hover:bg-[#353535]";
  const labelCls = "text-[10px] lg:text-sm text-neutral-500 dark:text-white font-medium whitespace-nowrap";
  return (
    <div className="flex flex-col gap-1.5">
      {hasContent ? (
        SHOW_SAVE_BUTTON ? (
          // 3 botões: Apagar · Salvar · Finalizar
          <div className="grid grid-cols-3 gap-1.5">
            <button type="button" onClick={onErase} disabled={disabled}
              className={`${chipBase} !h-11 ${sharedBg}`}>
              <span className={labelCls}>Apagar</span>
            </button>
            <button type="button" onClick={onWorkspaceClick} disabled={disabled}
              className={`${chipBase} !h-11 ${sharedBg}`}>
              <span className={labelCls}>Salvar</span>
            </button>
            <button type="button" onClick={onFinish} disabled={disabled}
              className={`${chipBase} !h-11 ${sharedBg}`}>
              <span className={labelCls}>Finalizar</span>
            </button>
          </div>
        ) : (
          // 2 botões: Apagar · Finalizar (Salvar oculto — sem persistência própria)
          <div className="grid grid-cols-2 gap-1.5">
            <button type="button" onClick={onErase} disabled={disabled}
              className={`${chipBase} !h-11 ${sharedBg}`}>
              <span className={labelCls}>Apagar</span>
            </button>
            <button type="button" onClick={onFinish} disabled={disabled}
              className={`${chipBase} !h-11 ${sharedBg}`}>
              <span className={labelCls}>Finalizar</span>
            </button>
          </div>
        )
      ) : (
        // Botão único: Área de Trabalho
        <button type="button" onClick={onWorkspaceClick} disabled={disabled}
          className={`${chipBase} w-full !h-11 ${workspaceOpen ? 'bg-[#f7f8f9] dark:bg-[#2f2f2f] border-neutral-200 dark:border-[#3d3d3d]' : sharedBg}`}>
          <span className={labelCls}>Área de Trabalho</span>
        </button>
      )}
    </div>
  );
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'card' | 'block';
  text: string;
  card?: IntelligenceCard;
  block?: WorkspaceBlock;
  _fromPersistence?: boolean;
}

function ChatBody({ onClose, showClose, workspaceContext, activeSector, userRole, onArchive, onWorkspaceCleared, chatHistoryOpen, archivedSessions, onSelectHistorySession, codifyScope }: { onClose?: () => void; showClose?: boolean; workspaceContext?: WorkspaceContext | null; activeSector?: string; userRole?: string; onArchive?: (cardTitle: string, sector: string, snapshot: { messages: Message[]; activeCard: IntelligenceCard | null; activeMode: MainKey | null }) => void; onWorkspaceCleared?: () => void; chatHistoryOpen?: boolean; archivedSessions?: Array<{ id: string; ts: number; cardTitle: string; sector: string; snapshot?: { messages: Message[]; activeCard: IntelligenceCard | null; activeMode: MainKey | null } }>; onSelectHistorySession?: (id: string) => void; codifyScope?: CodifyScope | null }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [activeCard, setActiveCard] = useState<IntelligenceCard | null>(null);
  const [dificuldade, setDificuldade] = useState<Dificuldade>('facil');
  const [shortcuts, setShortcuts] = useState<LocalShortcut[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // sub.key em execução
  const [activeMode, setActiveMode] = useState<MainKey | null>(null);
  // Toggle dos 3 modos no toolbar (Área de Trabalho expande/recolhe).
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const lastCardIdRef = useRef<string | null>(null);

  // Sub-fase 6.6.d — Contexto editorial do card aberto (evidências, signals,
  // map-signals da org do sector ativo). Hook tem short-circuit interno pra
  // card sintético / sem scope / sem id — retorna EMPTY sem fetch.
  const codifyContextCard = activeCard ?? { id: '' };
  const codifyContext = useCodifyCardContext({
    card: codifyContextCard,
    scope: codifyScope ?? null,
  });

  const firstBlockRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // true logo após abrir um card novo — sinaliza ao efeito de scroll abaixo
  // para pousar no overview (firstBlockRef), não no fim da lista.
  const skipBottomScrollRef = useRef(false);

  useEffect(() => {
    if (skipBottomScrollRef.current) {
      skipBottomScrollRef.current = false;
      firstBlockRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, actionLoading]);

  // Trocar de perfil/demo (activeSector) zera o chat — cada empresa tem sua Área de Trabalho própria.
  useEffect(() => {
    setMessages([]);
    setShortcuts([]);
    setActiveCard(null);
    setActionLoading(null);
    setActiveMode(null);
    setWorkspaceOpen(false);
    lastCardIdRef.current = null;
  }, [activeSector]);

  // Clique no botão de modo (Entender/Executar/Aprender) — gera bloco de modo no chat.
  function handleModeClick(mode: MainKey) {
    if (!activeCard) return;
    setActiveMode(mode);
    const block = buildModeBlock(activeCard, mode, dificuldade);
    setMessages(prev => [...prev, { id: block.id, role: 'block', text: block.subLabel, block }]);
  }

  // Clique em "Área de Trabalho" — alterna a visibilidade dos 3 modos no toolbar.
  // NÃO gera bloco, NÃO apaga conteúdo, NÃO abre fullscreen.
  function handleAreaTrabalhoClick() {
    // Se está aberto e vai recolher: arquiva sessão atual + limpa container
    if (workspaceOpen && activeCard && messages.length > 0) {
      onArchive?.(activeCard.titulo, activeSector ?? 'os1', { messages, activeCard, activeMode });
      setMessages([]);
      setActiveCard(null);
      setActiveMode(null);
      lastCardIdRef.current = null;
      setActionLoading(null);
    }
    setWorkspaceOpen(prev => !prev);
  }

  // "Apagar" — limpa o conteúdo da Área de Trabalho SEM arquivar.
  function handleApagar() {
    setMessages([]);
    setActiveCard(null);
    setActiveMode(null);
    lastCardIdRef.current = null;
    setActionLoading(null);
    // Sinaliza ao App.tsx pra reabrir a bio (mesmo comportamento de Salvar/Finalizar,
    // que reabrem a bio via onArchive).
    onWorkspaceCleared?.();
  }

  // "Finalizar" — arquiva a sessão atual e limpa tudo (encerra a sessão).
  function handleFinalizar() {
    if (activeCard && messages.length > 0) {
      onArchive?.(activeCard.titulo, activeSector ?? 'os1', { messages, activeCard, activeMode });
    }
    handleApagar();
  }

  // Restaura uma sessão arquivada — chamado quando user clica num item da lista de histórico.
  const restoreSession = (s: { messages: Message[]; activeCard: IntelligenceCard | null; activeMode: MainKey | null }) => {
    setMessages(s.messages);
    setActiveCard(s.activeCard);
    setActiveMode(s.activeMode);
    if (s.activeCard) lastCardIdRef.current = s.activeCard.id;
    setWorkspaceOpen(true);
  };

  // Card chegou do feed — anexa ao histórico, define card ativo, carrega atalhos,
  // gera bloco inicial expandido + bloco de compartilhamento quando aplicável.
  useEffect(() => {
    if (!workspaceContext) return;
    const { card, intent, seq } = workspaceContext;

    // Mesmo card reativado: só dispara bloco de modo conforme intent (sem duplicar análise).
    if (lastCardIdRef.current === card.id) {
      const mainKey = INTENT_TO_MAIN[intent];
      if (mainKey) {
        setActiveMode(mainKey);
        setWorkspaceOpen(true);
        const modeBlock = buildModeBlock(card, mainKey, dificuldade);
        setMessages(prev => [...prev, { id: modeBlock.id, role: 'block', text: modeBlock.subLabel, block: modeBlock }]);
      }
      if (intent === 'compartilhar') {
        // Compartilhar não abre os 3 modos automaticamente.
        const shareBlock = buildShareBlock(card, dificuldade);
        setMessages(prev => [...prev, { id: shareBlock.id, role: 'block', text: shareBlock.subLabel, block: shareBlock }]);
      }
      return;
    }
    lastCardIdRef.current = card.id;
    setActiveCard(card);

    // 1) Card pequeno na conversa.
    //    GM1-C UX fix (revertido — leitura simples a partir do card): o
    //    card carrega os botões de governança (Aprovar/Rejeitar/Distribuir/
    //    Criar missão). A versão GM1-C colocava o card por ÚLTIMO, "para
    //    que a decisão venha ao fim do raciocínio". A diretriz atual de
    //    produto pede o oposto: a experiência deve abrir como uma leitura
    //    rica a partir do card/post do feed — por isso o card (contexto
    //    original: tag/categoria, título, resumo) volta a ser o PRIMEIRO
    //    item, com a análise/diagnóstico/modo se desenvolvendo depois dele.
    const cardMsg: Message = { id: `card-${seq}-${card.id}`, role: 'card', text: card.titulo, card };

    // 2) Bloco principal:
    //    - Se o contexto carrega payload de Diagnóstico → bloco de diagnóstico.
    //    - Caso contrário → bloco inicial expandido padrão.
    const mainBlock = workspaceContext.diagnostic
      ? buildDiagnosticBlock(card, workspaceContext.diagnostic, dificuldade)
      : buildInitialBlock(card, dificuldade);
    const initialMsg: Message = { id: mainBlock.id, role: 'block', text: mainBlock.subLabel, block: mainBlock };

    // Card primeiro (overview/contexto original), depois a análise que se desenvolve a partir dele.
    const newMessages: Message[] = [cardMsg, initialMsg];

    // 3) Bloco de compartilhamento (apenas para intent='compartilhar')
    if (intent === 'compartilhar') {
      const shareBlock = buildShareBlock(card, dificuldade);
      newMessages.push({ id: shareBlock.id, role: 'block', text: shareBlock.subLabel, block: shareBlock });
    }
    // 4) Intent que mapeia pra modo (utilizar/perguntas/exemplos) pré-gera bloco de modo
    //    e abre o workspace toolbar. Compartilhar NÃO abre os 3 modos.
    const mainKey = INTENT_TO_MAIN[intent];
    if (mainKey) {
      setActiveMode(mainKey);
      setWorkspaceOpen(true);
      const modeBlock = buildModeBlock(card, mainKey, dificuldade);
      newMessages.push({ id: modeBlock.id, role: 'block', text: modeBlock.subLabel, block: modeBlock });
    } else {
      // Intent compartilhar (ou desconhecido) — mantém workspace fechado.
      setWorkspaceOpen(false);
    }
    // Card novo: pousar no contexto original do card (firstBlockRef), não no fim da lista.
    skipBottomScrollRef.current = true;
    setMessages(prev => [...prev, ...newMessages]);

    // 4) Atalhos: começa com fallback local por domínio; tenta backend e mescla
    setShortcuts(shortcutsForCard(card));
    if (!card._synthetic) {
      apiFetch<{ shortcuts?: RemoteShortcut[] }>('/api/shortcuts/para-card', {
        method: 'POST',
        body: JSON.stringify({ card_id: card.id, limit: 3 }),
      })
        .then(d => {
          const remote = (d?.shortcuts || []).map<LocalShortcut>(s => ({
            id: `rs-${s.id}`, kind: 'remote', label: s.titulo, url: s.url, url_label: s.url_label || 'Abrir',
          }));
          if (remote.length) {
            // Mescla: 2 remotos + 3 locais
            setShortcuts(prev => [...remote.slice(0, 2), ...prev.slice(0, 3)]);
          }
        })
        .catch(() => { /* mantém locais */ });
    }

    // W2.2 — carrega último bloco salvo para este card (fail-soft)
    if (!card._synthetic && !card.id.startsWith('synth-')) {
      const cardIdAtLoad = card.id;
      loadLastWorkspaceBlock(card.id).then(loaded => {
        if (!loaded) return;
        if (lastCardIdRef.current !== cardIdAtLoad) return;
        setMessages(prev => [...prev, {
          id: `persisted-${loaded.id}`,
          role: 'block' as const,
          text: loaded.subLabel || 'Resultado anterior',
          block: loaded,
          _fromPersistence: true,
        }]);
      }).catch(() => { /* fail-soft */ });
    }

  }, [workspaceContext]); // eslint-disable-line react-hooks/exhaustive-deps

  // Dispara uma sub-ação via executor central (W3.1-A).
  async function handleSubAction(mode: MainKey, sub: SubAction) {
    if (!activeCard) return;
    setActionLoading(sub.key);
    const res = await executeAction({ source: 'workspace', card: activeCard, mode, sub, dificuldade });
    if (!res) { setActionLoading(null); return; }
    const { block, usedFallback } = res;
    setMessages(prev => [...prev, { id: block.id, role: 'block', text: sub.label, block }]);
    if (!usedFallback && !('erro' in block.result)) saveWorkspaceBlock(block, activeCard.titulo);
    setActionLoading(null);
  }

  // Re-dispara a mesma ação que gerou um bloco anterior.
  function regenerateBlock(block: WorkspaceBlock) {
    const sub = SUB_BTNS[block.mode].find(s => s.key === block.subKey);
    if (!sub) return;
    handleSubAction(block.mode, sub);
  }

  function togglePinBlock(blockId: string) {
    setMessages(prev => prev.map(m => {
      if (m.role !== 'block' || !m.block || m.block.id !== blockId) return m;
      return { ...m, block: { ...m.block, pinned: !m.block.pinned } };
    }));
  }

  function copyBlock(block: WorkspaceBlock) {
    try {
      const txt = JSON.stringify(block.result, null, 2);
      navigator.clipboard?.writeText(txt).catch(() => {});
    } catch { /* ignore */ }
  }

  // Constrói o contexto da Área de Trabalho a partir do card e do bloco atual.
  // Bloco "share", "tool" e "initial" não geram contexto.
  // O perfil vem do userRole real do usuário; activeSector é só contexto de setor.
  function buildToolCtx(card: IntelligenceCard | null, b: WorkspaceBlock | null): WorkspaceToolContext | null {
    if (!card) return null;
    const mode: ToolMode | undefined =
      b?.kind === 'mode' || b?.kind === 'standard'
        ? (b.mode === 'pesquisar' ? 'entender' : (b.mode as ToolMode))
        : (b?.kind === 'share' ? 'compartilhar' : 'entender');
    const source: ToolSource = inferSourceFromCardId(card.id) || 'feed';
    return {
      source,
      mode,
      role: userRole,
      activeSector: activeSector,
      domain: card.dominio,
      areaMacro: card.area,
      cardTitle: card.titulo,
      cardSummary: card.resumo,
      isSensitive: isSensitiveDomain(card.dominio, card.area),
      urgency: card.urgencia,
      tipo: card.tipo_card,
    };
  }

  // Executa uma ferramenta da Área de Trabalho — cria um novo bloco com o
  // resultado abaixo do bloco atual (não substitui o conteúdo anterior).
  function handleRunTool(tool: WorkspaceTool, output: ToolOutput) {
    const blockId = `tool-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const block: WorkspaceBlock = {
      id: blockId,
      cardId: activeCard?.id || '',
      mode: 'executar',
      subKey: tool.id,
      subLabel: tool.label,
      endpoint: 'executar',
      result: output as unknown as Record<string, unknown>,
      difficulty: dificuldade,
      pinned: false,
      createdAt: new Date().toISOString(),
      kind: 'tool',
    };
    setMessages(prev => [...prev, { id: blockId, role: 'block', text: tool.label, block }]);
    // W3.1-B-A: persistir blocos de atalho/ferramenta se card é real e sem erro.
    const SYNTHETIC_PREFIXES = ['synth-', 'browser-', 'map-', 'ontology-'];
    if (
      activeCard &&
      !activeCard._synthetic &&
      !SYNTHETIC_PREFIXES.some(p => block.cardId.startsWith(p)) &&
      !('erro' in block.result)
    ) {
      saveWorkspaceBlock(block, activeCard.titulo);
    }
  }

  // Botões de aprofundamento do raciocínio — fixos, mode-agnósticos,
  // reaproveitam sub-ações já existentes (sem LLM/backend novo).
  function blockExamples() {
    const sub = SUB_BTNS.aprender.find(s => s.key === 'exemplo');
    if (sub) handleSubAction('aprender', sub);
  }
  function blockIdeias() {
    const sub = SUB_BTNS.pesquisar.find(s => s.key === 'oportunidade');
    if (sub) handleSubAction('pesquisar', sub);
  }
  function blockAnalogias() {
    const sub = SUB_BTNS.aprender.find(s => s.key === 'analogia');
    if (sub) handleSubAction('aprender', sub);
  }
  function blockCases() {
    const sub = SUB_BTNS.aprender.find(s => s.key === 'referencia');
    if (sub) handleSubAction('aprender', sub);
  }


  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text }]);
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      text: 'Analisando os dados do seu negócio. Em breve terei uma resposta completa para você.',
    }]);
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // Quando histórico está aberto, mostra apenas a lista de conversas arquivadas
  if (chatHistoryOpen) {
    return (
      <div className="flex flex-col h-full overflow-y-auto px-4 py-4 gap-2">
        {(!archivedSessions || archivedSessions.length === 0) ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-8">Nenhuma conversa anterior.</p>
        ) : (
          [...archivedSessions].reverse().map(s => (
            <button
              key={s.id}
              onClick={() => {
                if (s.snapshot) restoreSession(s.snapshot);
                onSelectHistorySession?.(s.id);
              }}
              className="text-left px-4 py-3 rounded-xl bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)] hover:bg-[#e4e7ea] dark:hover:bg-[#353535] transition-colors duration-150 cursor-pointer active:scale-[0.99]"
            >
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate">{s.cardTitle}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{new Date(s.ts).toLocaleString('pt-BR')} · {s.sector}</p>
            </button>
          ))
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">

      {/* Close — mobile only */}
      {showClose && onClose && (
        <div className="flex justify-end px-5 pt-5 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-[#353535] transition-all duration-200 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 space-y-3">
        {messages.map((msg) => {
          if (msg.role === 'card' && msg.card) {
            const c = msg.card;
            const urgColor = c.urgencia === 'alta' ? '#ef4444' : c.urgencia === 'media' ? '#f59e0b' : '#6b7280';
            return (
              <React.Fragment key={msg.id}>
                <motion.div
                  ref={firstBlockRef}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="flex justify-start"
                >
                  <div className="max-w-[92%] w-full p-3.5 rounded-2xl bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)]">
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: urgColor }}>{c.dominio || c.area || 'Card'}</p>
                    <p className="text-[13px] font-semibold text-neutral-800 dark:text-neutral-100 leading-snug">{c.titulo}</p>
                    {c.resumo && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">{c.resumo}</p>
                    )}
                    {/* GA3: governança matrix-only. Componente retorna null
                        pra non-matrix / synthetic / 401 / 403 — não polui card.
                        GA4 fix: passa organizationId do card pra o modal Distribuir
                        listar unidades da org certa (não cair no fallback McDo).
                        GA4 contexto: passa activeSector pra esconder botões quando
                        a matriz @codify estiver "visitando" um perfil de loja.
                        GM1 correção: "Criar missão" foi removido da matriz; a
                        missão deve nascer na área de trabalho da filial via
                        botões/ferramentas, não no painel da matriz. */}
                    <div className="mt-2">
                      <CardGovernanceActions
                        cardId={c.id}
                        cardOrganizationId={c.organizationId}
                        viewSector={activeSector}
                      />
                    </div>
                  </div>
                </motion.div>
                {/* Sub-fase 6.6.d — Contexto editorial logo abaixo do card aberto.
                    Componente retorna null em McDonald's / OS¹ / sectors sem scope /
                    cards sintéticos / sem tema. Silencioso em erro. */}
                <WorkspaceContextBlock {...codifyContext} />
              </React.Fragment>
            );
          }
          if (msg.role === 'block' && msg.block) {
            const b = msg.block;
            const isInitial = b.kind === 'initial';
            const isShare   = b.kind === 'share';
            const isMode    = b.kind === 'mode';
            const isTool    = b.kind === 'tool';
            const isDiag    = b.kind === 'diagnostico';
            const headerColor = isDiag ? '#0ea5e9' : isInitial ? '#10b981' : isShare ? '#f59e0b' : isTool ? '#8b5cf6' : isMode ? '#3b82f6' : '#3b82f6';
            // Tools aparecem em blocos com conteúdo gerado (mode, standard, diagnostico).
            // Initial / share / tool não geram contêiner.
            const toolCtx = !isShare && !isTool && !isInitial ? buildToolCtx(activeCard, b) : null;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="flex flex-col items-start gap-2.5"
              >
                {msg._fromPersistence && (
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500 px-1 flex items-center gap-1">
                    <History size={10} /> Último resultado salvo
                  </p>
                )}
                <div className="max-w-[94%] w-full rounded-2xl bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)] overflow-hidden">
                  <WorkspaceBlockHeader
                    kind={b.kind}
                    mode={b.mode}
                    subLabel={b.subLabel}
                    pinned={b.pinned}
                    createdAt={b.createdAt}
                    headerColor={headerColor}
                    source={toolCtx?.source}
                  />
                  <div className="px-3.5 py-3 text-[12px] text-neutral-700 dark:text-neutral-300">
                    {isInitial ? (
                      <InitialBlockContent result={b.result} />
                    ) : isShare ? (
                      <ShareOptionsContent card={activeCard} />
                    ) : isTool ? (
                      <ToolBlockContent output={b.result as unknown as ToolOutput} />
                    ) : isDiag ? (
                      <DiagnosticBlockContent payload={b.result as unknown as CompanyDiagnosticPayload} />
                    ) : isMode ? (
                      <ModeBlockContent result={b.result} mode={b.mode} />
                    ) : (
                      <ActionResult result={b.result} action={b.endpoint || null} />
                    )}
                  </div>
                  {/* Rodapé: ações + seletor de dificuldade no próprio bloco */}
                  {isInitial ? (
                    <div className="px-2.5 py-2 border-t border-neutral-100 dark:border-[#414141] flex flex-col gap-2">
                      {/* Setas de direção — destravadas pela ficha do perfil (arrowsUnlocked) */}
                      {workspaceContext?.arrowsUnlocked && (
                        <div className="flex flex-col gap-1.5 pb-2 mb-1 border-b border-neutral-100 dark:border-[#414141]">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">
                            Direções possíveis
                          </p>
                          <div className="flex flex-col gap-1.5">
                            {(getFixtureRelations() as Relation[]).map((r, i) => (
                              <button
                                key={i}
                                onClick={() => {}}
                                title={r.rationale}
                                className="text-left flex items-start gap-2 px-2.5 py-2 rounded-lg text-[11px] sm:text-xs border bg-white dark:bg-[#242424] text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-[#2e2e2e] hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-blue-500 mt-0.5 flex-shrink-0">
                                  {r.type}
                                </span>
                                <span className="leading-snug">{r.rationale}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Botões de aprofundamento do raciocínio — mesma estética dos outros blocos */}
                      <div className="flex items-center gap-1 flex-wrap pt-1 border-t border-dashed border-neutral-100 dark:border-[#414141]">
                        <BlockCtrl Icon={Lightbulb}  label="Exemplos"  onClick={blockExamples} />
                        <BlockCtrl Icon={Sparkles}   label="Ideias"    onClick={blockIdeias} />
                        <BlockCtrl Icon={GitCompare} label="Analogias" onClick={blockAnalogias} />
                        <BlockCtrl Icon={BookOpen}   label="Cases"     onClick={blockCases} />
                      </div>
                    </div>
                  ) : isShare ? (
                    <div className="px-2.5 py-2 border-t border-neutral-100 dark:border-[#414141] flex items-center gap-1 flex-wrap">
                      <BlockCtrl Icon={Lightbulb}  label="Exemplos"  onClick={blockExamples} />
                      <BlockCtrl Icon={Sparkles}   label="Ideias"    onClick={blockIdeias} />
                      <BlockCtrl Icon={GitCompare} label="Analogias" onClick={blockAnalogias} />
                      <BlockCtrl Icon={BookOpen}   label="Cases"     onClick={blockCases} />
                    </div>
                  ) : isTool ? (
                    <div className="px-2.5 py-2 border-t border-neutral-100 dark:border-[#414141] flex items-center gap-1 flex-wrap">
                      <BlockCtrl Icon={Pin}  label={b.pinned ? 'Fixado' : 'Fixar'} active={b.pinned} onClick={() => togglePinBlock(b.id)} />
                      <BlockCtrl Icon={Copy} label="Copiar"      onClick={() => copyBlock(b)} />
                    </div>
                  ) : isDiag ? (
                    <div className="px-2.5 py-2 border-t border-neutral-100 dark:border-[#414141] flex items-center gap-1 flex-wrap">
                      <BlockCtrl Icon={Pin}  label={b.pinned ? 'Fixado' : 'Fixar'} active={b.pinned} onClick={() => togglePinBlock(b.id)} />
                      <BlockCtrl Icon={Copy} label="Copiar"      onClick={() => copyBlock(b)} />
                    </div>
                  ) : isMode ? (
                    <div className="px-2.5 py-2 border-t border-neutral-100 dark:border-[#414141] flex flex-col gap-2">
                      <div className="flex items-center gap-1 flex-wrap">
                        <BlockCtrl Icon={Lightbulb}  label="Exemplos"  onClick={blockExamples} />
                        <BlockCtrl Icon={Sparkles}   label="Ideias"    onClick={blockIdeias} />
                        <BlockCtrl Icon={GitCompare} label="Analogias" onClick={blockAnalogias} />
                        <BlockCtrl Icon={BookOpen}   label="Cases"     onClick={blockCases} />
                      </div>
                      {SHOW_BLOCK_SHORTCUTS && (
                        <ModeShortcuts
                          mode={b.mode}
                          onPick={(subKey) => {
                            const sub = SUB_BTNS[b.mode].find(x => x.key === subKey);
                            if (sub) handleSubAction(b.mode, sub);
                          }}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="px-2.5 py-2 border-t border-neutral-100 dark:border-[#414141] flex flex-col gap-2">
                      <div className="flex items-center gap-1 flex-wrap">
                        <BlockCtrl Icon={Lightbulb}  label="Exemplos"  onClick={blockExamples} />
                        <BlockCtrl Icon={Sparkles}   label="Ideias"    onClick={blockIdeias} />
                        <BlockCtrl Icon={GitCompare} label="Analogias" onClick={blockAnalogias} />
                        <BlockCtrl Icon={BookOpen}   label="Cases"     onClick={blockCases} />
                      </div>
                      {SHOW_BLOCK_SHORTCUTS && (
                        <BlockShortcutsRow shortcuts={buildBlockShortcuts(b)} onPick={(mode, subKey) => {
                          const sub = SUB_BTNS[mode].find(x => x.key === subKey);
                          if (sub) handleSubAction(mode, sub);
                        }} />
                      )}
                    </div>
                  )}
                </div>
                {toolCtx && (
                  <div className="max-w-[94%] w-full">
                    <WorkspaceTools ctx={toolCtx} onRun={handleRunTool} defaultOpen={true} />
                  </div>
                )}
              </motion.div>
            );
          }
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`
                max-w-[88%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed
                ${msg.role === 'user'
                  ? 'bg-[#3b82f6] text-white rounded-br-sm'
                  : 'bg-neutral-100 dark:bg-[#373737] text-neutral-700 dark:text-neutral-300 rounded-bl-sm'
                }
              `}>
                {msg.text}
              </div>
            </motion.div>
          );
        })}

        {/* Loader da ação em curso */}
        {actionLoading && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-neutral-100 dark:bg-[#373737] w-fit"
          >
            <Loader2 size={12} className="animate-spin text-[#3b82f6]" />
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400">Gerando · {SUB_BTNS[Object.keys(SUB_BTNS).find(k => SUB_BTNS[k as MainKey].some(s => s.key === actionLoading)) as MainKey]?.find(s => s.key === actionLoading)?.label || actionLoading}</span>
          </motion.div>
        )}

        {/* Typing indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-[#f7f8f9] dark:bg-[#2f2f2f] rounded-2xl border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)] px-4 py-3 flex items-center gap-1">
              {[0, 1, 2].map(i => (
                <motion.span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 block"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 flex-shrink-0">
        <AnimatePresence mode="wait">
          {!started ? (
            <motion.div
              key="inicializar"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <WorkspaceToolbar
                activeMode={activeMode}
                workspaceOpen={workspaceOpen}
                onModeClick={handleModeClick}
                onWorkspaceClick={handleAreaTrabalhoClick}
                disabled={!activeCard || actionLoading !== null}
                hasContent={messages.length > 0}
                onErase={handleApagar}
                onFinish={handleFinalizar}
              />
            </motion.div>
          ) : (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex items-end gap-2 bg-neutral-50 dark:bg-[#353535] border border-neutral-200 dark:border-[#414141] rounded-2xl px-4 py-3 focus-within:border-neutral-300 dark:focus-within:border-[#414141] transition-colors duration-200"
            >
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={e => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
                onKeyDown={handleKey}
                placeholder="Escreva uma mensagem..."
                className="flex-1 bg-transparent text-[13px] text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-600 outline-none resize-none leading-relaxed"
                style={{ minHeight: '20px', maxHeight: '120px' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="w-7 h-7 rounded-xl bg-[#3b82f6] disabled:bg-neutral-200 dark:disabled:bg-[#414141] flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:bg-[#2563eb] active:scale-90 cursor-pointer disabled:cursor-default mb-0.5"
              >
                <ArrowUp size={13} className="text-white" strokeWidth={2.5} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}

// Renderiza os 8 campos do bloco inicial em formato de lista.
// InitialBlockContent e DiagnosticBlockContent migrados na Fase 9 para
// src/features/workspace/blocks/WorkspaceBlockContent.tsx (re-import abaixo).

// Render do bloco de compartilhamento — 5 opções, cada uma copia/envia o texto formatado.
function ShareOptionsContent({ card }: { card: IntelligenceCard | null }) {
  // Card sintético "Convite" disparado pelo botão da bio — substitui o modal
  // flutuante por um formulário inline no bloco da Área de Trabalho.
  if (card?.tipo_card === 'convite' || card?.dominio === 'Convite') {
    return <InviteForm />;
  }
  function fire(textBuilder: (c: IntelligenceCard) => string) {
    if (!card) return;
    const txt = textBuilder(card);
    try {
      if (navigator.share) {
        navigator.share({ title: card.titulo, text: txt }).catch(() => {
          navigator.clipboard?.writeText(txt).catch(() => {});
        });
      } else {
        navigator.clipboard?.writeText(txt).catch(() => {});
      }
    } catch { /* noop */ }
  }
  return (
    <div className="grid grid-cols-1 gap-1.5">
      {SHARE_OPTIONS.map(opt => (
        <button key={opt.id} onClick={() => fire(opt.text)}
          className="flex items-center gap-2 px-2 py-2 rounded-lg border border-neutral-200 dark:border-[#4e4e4e] hover:bg-neutral-50 dark:hover:bg-[#414141] transition-colors cursor-pointer text-left">
          <opt.Icon size={13} className="text-[#f59e0b] flex-shrink-0" />
          <span className="text-[11px] font-medium text-neutral-700 dark:text-neutral-200">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

// Formulário de convite inline — substitui o antigo modal flutuante.
// Validação simples de email; estado local; mostra confirmação após enviar.
function InviteForm() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const submit = () => {
    if (!valid) return;
    // TODO: integrar com endpoint real de convite. Por enquanto só simula.
    setSent(true);
  };
  if (sent) {
    return (
      <div className="flex flex-col gap-1 text-[12px] text-neutral-700 dark:text-neutral-200">
        <span className="font-medium text-emerald-600 dark:text-emerald-400">Convite enviado pra {email}.</span>
        <button onClick={() => { setSent(false); setEmail(''); }}
          className="self-start text-[11px] text-neutral-500 hover:text-neutral-800 dark:hover:text-white underline underline-offset-2">
          Enviar outro
        </button>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
        Digite o email da pessoa que você quer convidar:
      </p>
      <div className="flex items-center gap-1.5">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && valid) submit(); }}
          placeholder="email@dominio.com"
          autoFocus
          className="flex-1 px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-[#4e4e4e] bg-white dark:bg-[#2f2f2f] text-[12px] text-neutral-800 dark:text-neutral-100 outline-none focus:border-[#f59e0b]"
        />
        <button
          onClick={submit}
          disabled={!valid}
          className="px-3 py-1.5 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] disabled:opacity-40 disabled:cursor-not-allowed text-white text-[11px] font-semibold transition-colors cursor-pointer"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

// Conteúdo de um bloco de modo (Entender / Executar / Aprender) — 6 campos por modo.
function ModeBlockContent({ result, mode }: { result: Record<string, unknown>; mode: MainKey }) {
  const fields = MODE_FIELDS[mode];
  return (
    <div className="space-y-2.5">
      {fields.map(f => {
        const v = result[f.key];
        if (!v) return null;
        return (
          <div key={f.key}>
            <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-0.5">{f.label}</p>
            <p className="text-[12px] leading-relaxed text-neutral-700 dark:text-neutral-300">{String(v)}</p>
          </div>
        );
      })}
    </div>
  );
}

// Atalhos do bloco de modo: 5 primeiros + "Mais ações" para os 5 seguintes.
function ModeShortcuts({ mode, onPick }: { mode: MainKey; onPick: (subKey: string) => void }) {
  const [showMore, setShowMore] = useState(false);
  const top5Keys = MODE_TOP5[mode];
  const allSubs = SUB_BTNS[mode];
  const top5 = top5Keys.map(k => allSubs.find(s => s.key === k)).filter(Boolean) as SubAction[];
  const rest = allSubs.filter(s => !top5Keys.includes(s.key));
  const visible = showMore ? [...top5, ...rest] : top5;
  return (
    <div className="flex flex-wrap gap-1">
      {visible.map(s => (
        <button key={s.key} type="button" onClick={() => onPick(s.key)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-neutral-200 dark:border-[#4e4e4e] text-neutral-600 dark:text-neutral-300 hover:bg-[#3b82f6]/10 hover:text-[#3b82f6] hover:border-[#3b82f6]/40 dark:hover:text-[#60a5fa] transition-colors cursor-pointer">
          <s.Icon size={11} />
          {s.label}
        </button>
      ))}
      {!showMore && rest.length > 0 && (
        <button type="button" onClick={() => setShowMore(true)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-dashed border-neutral-300 dark:border-[#4e4e4e] text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-[#414141] transition-colors cursor-pointer">
          Mais ações
        </button>
      )}
    </div>
  );
}

function BlockShortcutsRow({ shortcuts, onPick }: {
  shortcuts: LocalShortcut[];
  onPick: (mode: MainKey, subKey: string) => void;
}) {
  if (!shortcuts.length) return null;
  return (
    <div className="flex items-center gap-1 flex-wrap pt-1 border-t border-dashed border-neutral-100 dark:border-[#414141]">
      <span className="text-[9px] uppercase tracking-wider text-neutral-400 mr-1">Atalhos</span>
      {shortcuts.slice(0, 5).map(s => {
        if (s.kind !== 'local') return null;
        return (
          <button key={s.id} type="button" onClick={() => onPick(s.mode, s.subKey)}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-neutral-200 dark:border-[#4e4e4e] text-neutral-600 dark:text-neutral-300 hover:bg-[#3b82f6]/10 hover:text-[#3b82f6] hover:border-[#3b82f6]/40 dark:hover:text-[#60a5fa] transition-colors cursor-pointer">
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

function DifficultyRow({ value, onChange }: { value: Dificuldade; onChange: (d: Dificuldade) => void }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      <span className="text-[9px] uppercase tracking-wider text-neutral-400 mr-1">Dificuldade</span>
      {(Object.keys(DIFICULDADE_LABELS) as Dificuldade[]).map(d => (
        <button key={d} onClick={() => onChange(d)}
          className={`px-1.5 py-0.5 rounded-md text-[9px] font-semibold transition-colors cursor-pointer ${value === d
            ? 'bg-[#3b82f6] text-white'
            : 'text-neutral-500 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}>
          {DIFICULDADE_LABELS[d]}
        </button>
      ))}
    </div>
  );
}

// BlockCtrl migrado na Fase 9 para
// src/features/workspace/blocks/WorkspaceBlockActions.tsx (re-import abaixo).

interface ChatDesktopProps {
  wide?: boolean;
  onHome?: () => void;
  homeTitle?: string;
  onSector?: () => void;
  onBrowser?: () => void;
  /** Mantido por compat — não renderiza mais botão dedicado. */
  onDifficulty?: () => void;
  activeSector?: string;
  userRole?: string;
  workspaceContext?: WorkspaceContext | null;
  dark?: boolean;
  onToggleTheme?: () => void;
  onShowHistory?: () => void;
  chatHistoryOpen?: boolean;
  archivedSessions?: Array<{ id: string; ts: number; cardTitle: string; sector: string; snapshot?: { messages: Message[]; activeCard: IntelligenceCard | null; activeMode: MainKey | null } }>;
  onSelectHistorySession?: (id: string) => void;
  onArchive?: (cardTitle: string, sector: string, snapshot: { messages: Message[]; activeCard: IntelligenceCard | null; activeMode: MainKey | null }) => void;
  onWorkspaceCleared?: () => void;
  onMapOpen?: () => void;
  codifyScope?: CodifyScope | null;
  windowWidth?: number;
}

export function ChatDesktop({ wide, onHome, homeTitle, onSector, onBrowser, onMapOpen, activeSector, userRole, workspaceContext, dark, onToggleTheme, onShowHistory, chatHistoryOpen, archivedSessions, onSelectHistorySession, onArchive, onWorkspaceCleared, codifyScope, windowWidth }: ChatDesktopProps) {
  const btnCls = "cursor-pointer text-neutral-500 dark:text-neutral-300 p-2 rounded-full bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_4px_10px_-1px_rgba(0,0,0,0.22),0_1px_3px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.6)] dark:shadow-[0_4px_10px_-1px_rgba(0,0,0,0.55),0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.04)] hover:bg-[#e4e7ea] dark:hover:bg-[#353535] hover:text-neutral-800 dark:hover:text-white transition-all duration-200 hover:scale-105 active:scale-90";
  // Bloqueia scroll do body (= feed) enquanto o cursor está sobre o ChatDesktop.
  // O scroll interno do ChatBody (overflow-y-auto) continua funcionando — só o
  // "overflow" pro body é prevenido.
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      // Sobe a árvore procurando algum ancestor com scroll que possa rolar
      // na direção do deltaY. Se achar, deixa o evento seguir naturalmente.
      let node: HTMLElement | null = e.target as HTMLElement;
      while (node && node !== el) {
        const style = window.getComputedStyle(node);
        const oy = style.overflowY;
        if ((oy === 'auto' || oy === 'scroll') && node.scrollHeight > node.clientHeight) {
          const canScrollDown = node.scrollTop + node.clientHeight < node.scrollHeight - 1;
          const canScrollUp = node.scrollTop > 0;
          if ((e.deltaY > 0 && canScrollDown) || (e.deltaY < 0 && canScrollUp)) return;
        }
        node = node.parentElement;
      }
      // Nenhum scroll interno disponível — bloqueia pra não rolar o body/feed.
      e.preventDefault();
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, []);
  const ww = windowWidth ?? window.innerWidth;
  const pr = ww >= 1280 ? 336 : 320;
  const rightPx = wide ? 20 : Math.max(5, (ww + pr - 1575) / 2);
  return (
    <div
      ref={wrapperRef}
      style={{
        width: wide ? 'calc(50vw - 20px)' : '340px',
        top: `${SPLIT_FRAME_TOP_PX + 12}px`,
        right: `${rightPx}px`,
        transition: 'right 500ms cubic-bezier(0.25,0.1,0.25,1), width 500ms cubic-bezier(0.25,0.1,0.25,1)',
      }}
      className="fixed bottom-5 z-[40] hidden lg:flex flex-col bg-[#f0f2f4] dark:bg-[#323232] border-[0.5px] border-neutral-100 dark:border-[#414141] rounded-2xl overflow-hidden shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)]"
    >
      {/* Header com ícones — ordem: Home / Plus / Search / Upload / History / Bell */}
      <div className="px-5 py-5 flex-shrink-0">
      <div className="flex items-center justify-between gap-2 px-2 py-3 bg-[#f0f2f4] dark:bg-[#323232] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] rounded-xl shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)] transition-transform duration-200 hover:scale-[1.01]">
        <button onClick={onHome} className={btnCls} title={homeTitle ?? 'Visão da empresa'}>
          <Home size={22} />
        </button>
        <button onClick={onSector} className={`${btnCls} relative`} title="Trocar feed por área">
          <Plus size={22} className={activeSector && activeSector !== 'geral' ? 'text-[#3b82f6]' : ''} />
          {activeSector && activeSector !== 'geral' && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
          )}
        </button>
        <button onClick={onBrowser} className={btnCls} title="Sincronizar">
          <Search size={22} />
        </button>
        <button onClick={() => onMapOpen?.()} className={btnCls} title="Mapa">
          <MapPin size={22} />
        </button>
        <button onClick={() => onShowHistory?.()} className={btnCls} title="Conversas anteriores">
          <History size={22} />
        </button>
        <button className={btnCls} title="Notificações">
          <Bell size={22} />
        </button>
      </div>
      </div>
      <div className="flex-1 min-h-0">
        <ChatBody workspaceContext={workspaceContext} activeSector={activeSector} userRole={userRole} onArchive={onArchive} onWorkspaceCleared={onWorkspaceCleared} chatHistoryOpen={chatHistoryOpen} archivedSessions={archivedSessions} onSelectHistorySession={onSelectHistorySession} codifyScope={codifyScope} />
      </div>
    </div>
  );
}

function GamepadIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <path d="M4.5 11C4.5 9.067 6.067 7.5 8 7.5H20C21.933 7.5 23.5 9.067 23.5 11V15.5C23.5 18.538 21.538 21.2 18.7 22.2L17.5 22.6C15.23 23.4 12.77 23.4 10.5 22.6L9.3 22.2C6.462 21.2 4.5 18.538 4.5 15.5V11Z" stroke="white" strokeWidth="1.6" strokeLinejoin="round"/>
      {/* D-pad vertical */}
      <path d="M9 13.5V16.5" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
      {/* D-pad horizontal */}
      <path d="M7.5 15H10.5" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
      {/* Button circle right */}
      <circle cx="19" cy="13" r="1.1" fill="white"/>
      {/* Button circle top */}
      <circle cx="17" cy="11.2" r="1.1" fill="white"/>
      {/* Button circle bottom */}
      <circle cx="17" cy="14.8" r="1.1" fill="white"/>
      {/* Button circle left */}
      <circle cx="15" cy="13" r="1.1" fill="white"/>
      {/* Center line hint */}
      <path d="M13 10.5H15" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}

export function ChatFAB({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.88, rotate: -12 }}
      transition={{ type: 'spring', stiffness: 500, damping: 18 }}
      className="fixed right-5 z-[170] rounded-full backdrop-blur-md bg-white/30 border border-white/40 dark:bg-black/30 dark:border-white/10 flex items-center justify-center lg:hidden cursor-pointer"
      style={{ width: 72, height: 72, bottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
    >
      <LayoutDashboard size={24} className="text-neutral-600 dark:text-neutral-300" strokeWidth={1.8} />
    </motion.button>
  );
}

export function ChatMobile({
  open, onClose, workspaceContext, activeSector, userRole,
  onHome, homeTitle, onSector, onBrowser, unreadCount,
  dark, onToggleTheme, onShowHistory, chatHistoryOpen, archivedSessions, onSelectHistorySession, onArchive, codifyScope,
}: {
  open: boolean;
  onClose: () => void;
  workspaceContext?: WorkspaceContext | null;
  activeSector?: string;
  userRole?: string;
  onHome?: () => void;
  homeTitle?: string;
  onSector?: () => void;
  onBrowser?: () => void;
  /** Mantido por compat — não renderiza mais botão dedicado. */
  onDifficulty?: () => void;
  unreadCount?: number;
  dark?: boolean;
  onToggleTheme?: () => void;
  onShowHistory?: () => void;
  chatHistoryOpen?: boolean;
  archivedSessions?: Array<{ id: string; ts: number; cardTitle: string; sector: string; snapshot?: { messages: Message[]; activeCard: IntelligenceCard | null; activeMode: MainKey | null } }>;
  onSelectHistorySession?: (id: string) => void;
  onArchive?: (cardTitle: string, sector: string, snapshot: { messages: Message[]; activeCard: IntelligenceCard | null; activeMode: MainKey | null }) => void;
  codifyScope?: CodifyScope | null;
}) {
  const btnCls = "cursor-pointer text-neutral-500 dark:text-neutral-300 p-2 rounded-full bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_4px_10px_-1px_rgba(0,0,0,0.22),0_1px_3px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.6)] dark:shadow-[0_4px_10px_-1px_rgba(0,0,0,0.55),0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.04)] hover:bg-[#e4e7ea] dark:hover:bg-[#353535] hover:text-neutral-800 dark:hover:text-white transition-all duration-200 hover:scale-105 active:scale-90";
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed inset-0 z-[200] lg:hidden bg-[#f0f2f4] dark:bg-[#2b2b2b] flex flex-col"
        >
          {/* Header com ícones — ordem: Plus / Globe / Settings / Sun-Moon / Bell / X */}
          <div className="px-4 pt-4 pb-3 flex-shrink-0">
          <div className="flex items-center justify-between gap-2 px-3 py-3 bg-[#f0f2f4] dark:bg-[#323232] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] rounded-xl shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)]">
            <button onClick={onHome} className={btnCls} title={homeTitle ?? 'Visão da empresa'}>
              <Home size={22} />
            </button>
            <button onClick={onSector} className={`${btnCls} relative`} title="Trocar feed por área">
              <Plus size={22} className={activeSector && activeSector !== 'geral' ? 'text-[#3b82f6]' : ''} />
              {activeSector && activeSector !== 'geral' && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
              )}
            </button>
            <button onClick={onBrowser} className={btnCls} title="Sincronizar">
              <Search size={22} />
            </button>
            <label className={`${btnCls} relative`} title="Enviar arquivo">
              <Upload size={22} />
              <input type="file" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  const rawOrgId = localStorage.getItem('os1_org_id') ?? undefined;
                  const rawBuId  = localStorage.getItem('os1_bu_id')  ?? undefined;
                  const { orgId, buId } = resolveUploadOrgBu(activeSector, rawOrgId, rawBuId);
                  const ext = f.name.includes('.') ? (f.name.split('.').pop() ?? '') : '';
                  addContextUpload({
                    id: crypto.randomUUID(),
                    name: f.name,
                    extension: ext,
                    mimeType: f.type || undefined,
                    size: f.size,
                    uploadedAt: new Date().toISOString(),
                    orgId, buId,
                    activeSector: activeSector ?? undefined,
                    source: 'upload',
                  });
                  console.log('[OS¹] Contexto registrado:', f.name);
                }
                e.currentTarget.value = '';
              }} />
            </label>
            <button onClick={() => onShowHistory?.()} className={btnCls} title="Conversas anteriores">
              <History size={22} />
            </button>
            <button className={`${btnCls} relative`} title="Notificações">
              <Bell size={22} />
              {(unreadCount ?? 0) > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            <button onClick={onClose} className={btnCls} title="Fechar">
              <X size={20} />
            </button>
          </div>
          </div>
          <div className="flex-1 min-h-0">
            <ChatBody workspaceContext={workspaceContext} activeSector={activeSector} userRole={userRole} onArchive={onArchive} chatHistoryOpen={chatHistoryOpen} archivedSessions={archivedSessions} onSelectHistorySession={onSelectHistorySession} codifyScope={codifyScope} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
