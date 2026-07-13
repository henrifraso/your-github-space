import React, { useState, useRef, useEffect } from 'react';
import {
  X, ArrowUp, LayoutDashboard, Search, Zap, BookOpen, BarChart2, Compass, Eye, ClipboardList, Target,
  Lightbulb, FileText, FlaskConical, CheckCircle, Gauge, AlignLeft, Star as StarIcon, TrendingUp,
  Home, Plus, Globe, Upload, Bell, RefreshCw, Pin, Copy, AlertTriangle, Info, GitCompare,
  Languages, Users, Send as SendIcon, Bookmark, Share2, Brain, Award, MessageSquare, FileQuestion,
  Sparkles, Loader2, History, MapPin, ChevronDown, ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { IntelligenceCard, WorkspaceIntent } from './WorkspacePanel';
import { ActionResult } from './WorkspacePanel';
import { getFixtureRelations } from '../core/relations/relation-generator';
import type { Relation } from '../core/relations/relation';
import { apiFetch } from '../api';
import { SPLIT_TOP_GAP_PB, SPLIT_FRAME_TOP_PX, SPLIT_FRAME_TOP_EXTRA_PX, getDesktopChatLayout } from '../constants/split-layout';
import { WorkspaceTools, ToolBlockContent } from './WorkspaceTools';
import {
  InitialBlockContent,
  DiagnosticBlockContent,
} from '../features/workspace/blocks/WorkspaceBlockContent';
import { WorkspaceBlockHeader } from '../features/workspace/blocks/WorkspaceBlockHeader';
import { BlockCtrl } from '../features/workspace/blocks/WorkspaceBlockActions';
import { CardGovernanceActions } from './CardGovernanceActions';
import { normalizeUrl } from '../features/browser/browser-url-utils';
import { DEPARTMENTS, VISIBLE_DEPARTMENT_IDS, SECTORS } from './SectorSwitcher';
import {
  SECTIONS as SETTINGS_SECTIONS,
  COMPANY_TYPES,
  Toggle as SettingsToggle,
  loadSettings,
  saveSettings,
  type CompanySettings,
} from '../features/modals/CompanySettingsModal';
import type { DepartmentId } from '../types';
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
  const sharedBg = "bg-[#EFEFF1] dark:bg-[#2f2f2f] border-neutral-200 dark:border-[#3d3d3d] hover:bg-neutral-200 dark:hover:bg-[#353535]";
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
          className={`${chipBase} w-full !h-11 ${workspaceOpen ? 'bg-[#EFEFF1] dark:bg-[#2f2f2f] border-neutral-200 dark:border-[#3d3d3d]' : sharedBg}`}>
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

function ChatBody({ onClose, showClose, workspaceContext, activeSector, userRole, onArchive, onAutoArchive, onWorkspaceCleared, chatHistoryOpen, archivedSessions, onSelectHistorySession, onCloseHistory, onDeleteSessions, codifyScope, onOpenBrowserUrl, onOpenMapWithRadius, activeDepartment, onSelectDepartment, onSelectSector, logoutPending, onCancelLogout, onConfirmLogout }: { onClose?: () => void; showClose?: boolean; workspaceContext?: WorkspaceContext | null; activeSector?: string; userRole?: string; onArchive?: (cardTitle: string, sector: string, snapshot: { messages: Message[]; activeCard: IntelligenceCard | null; activeMode: MainKey | null }) => void; onAutoArchive?: (cardTitle: string, sector: string, snapshot: { messages: Message[]; activeCard: IntelligenceCard | null; activeMode: MainKey | null }) => void; onWorkspaceCleared?: () => void; chatHistoryOpen?: boolean; archivedSessions?: Array<{ id: string; ts: number; cardTitle: string; sector: string; snapshot?: { messages: Message[]; activeCard: IntelligenceCard | null; activeMode: MainKey | null } }>; onSelectHistorySession?: (id: string) => void; onCloseHistory?: () => void; onDeleteSessions?: (ids: string[]) => void; codifyScope?: CodifyScope | null; onOpenBrowserUrl?: (url: string) => void; onOpenMapWithRadius?: (radiusKm: number) => void; activeDepartment?: DepartmentId; onSelectDepartment?: (id: DepartmentId) => void; onSelectSector?: (id: string) => void; logoutPending?: boolean; onCancelLogout?: () => void; onConfirmLogout?: () => void }) {
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
  const lastSeqRef = useRef<number | null>(null);

  // Estados do modo seleção/exclusão dentro do histórico
  const [histSelectionMode, setHistSelectionMode] = useState(false);
  const [histSelectedIds, setHistSelectedIds] = useState<Set<string>>(new Set());
  const [histConfirmPending, setHistConfirmPending] = useState(false);
  const [destrincharByBlock, setDestrincharByBlock] = useState<Record<string, { key: string; text: string } | null>>({});
  type InsightPayload = { insights: string[]; decisoes: Array<{ titulo: string; texto: string }> };
  const [insightsByBlock, setInsightsByBlock] = useState<Record<string, InsightPayload | null>>({});
  const [mappingBlocks, setMappingBlocks] = useState<Set<string>>(new Set());
  // Reseta ao fechar o histórico para que não persista entre aberturas
  useEffect(() => {
    if (!chatHistoryOpen) {
      setHistSelectionMode(false);
      setHistSelectedIds(new Set());
      setHistConfirmPending(false);
    }
  }, [chatHistoryOpen]);

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
    lastSeqRef.current = null;
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
      lastSeqRef.current = null;
      setActionLoading(null);
    }
    setWorkspaceOpen(prev => !prev);
  }

  // "Apagar" — limpa o conteúdo da Área de Trabalho SEM arquivar.
  function handleApagar() {
    setMessages([]);
    setActiveCard(null);
    setActiveMode(null);
    lastSeqRef.current = null;
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
    lastSeqRef.current = null;
    setWorkspaceOpen(true);
  };

  // Card chegou do feed — anexa ao histórico, define card ativo, carrega atalhos,
  // gera bloco inicial expandido + bloco de compartilhamento quando aplicável.
  useEffect(() => {
    if (!workspaceContext) return;
    const { card, intent, seq } = workspaceContext;
    // Marcadores dos cards sintéticos de Score/Navegador/Mapa/Feed (App.tsx) —
    // nenhum deles gera bloco de modo/compartilhamento, só o bloco leve
    // correspondente (kind: 'score' | 'browserLauncher' | 'mapLauncher' | 'departmentLauncher').
    const isScoreCard              = card.dominio === 'Score';
    const isBrowserLauncherCard    = card.dominio === 'Navegador';
    const isMapLauncherCard        = card.dominio === 'Mapa';
    const isDeptLauncherCard       = card.dominio === 'Feed';
    const isSettingsCard           = card.dominio === 'Configuração';
    const isProfileSwitcherCard    = card.dominio === 'Perfis';
    const isFranchiseSwitcherCard  = card.dominio === 'Franquia';
    const isLauncherCard           = isScoreCard || isBrowserLauncherCard || isMapLauncherCard || isDeptLauncherCard || isSettingsCard || isProfileSwitcherCard || isFranchiseSwitcherCard;

    // Antes de trocar: arquiva o conteúdo atual sem navegar de volta à bio.
    // Só arquiva se há algo real aberto (card + mensagens).
    if (activeCard !== null && messages.length > 0) {
      onAutoArchive?.(activeCard.titulo, activeSector ?? 'os1', { messages, activeCard, activeMode });
    }

    lastSeqRef.current = seq;
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
    //    - Card de Score → bloco leve kind:'score' (números + textos curtos,
    //      mock/preview local — sem componente grande, sem tela cheia).
    //    - Card de Navegador/Mapa → bloco lançador (kind:'browserLauncher' /
    //      'mapLauncher') — só a intenção (URL / raio), o fullscreen abre
    //      depois, disparado pelo próprio conteúdo do bloco.
    //    - Se o contexto carrega payload de Diagnóstico → bloco de diagnóstico.
    //    - Caso contrário → bloco inicial expandido padrão.
    const mainBlock: WorkspaceBlock = isScoreCard
      ? {
          id: `blk-score-${Date.now()}`,
          cardId: card.id,
          mode: 'pesquisar',
          subKey: 'score',
          subLabel: 'Score OS¹',
          endpoint: null,
          result: {
            score_geral: 76,
            resumo: 'Leitura geral da empresa diante do mercado',
            dimensoes: [
              { label: 'Mercado',      valor: 78, texto: 'Sinais externos indicam atenção moderada ao comportamento da categoria.' },
              { label: 'Concorrência', valor: 72, texto: 'Movimentos próximos sugerem observar preço, oferta e presença regional.' },
              { label: 'Reputação',    valor: 81, texto: 'Percepção pública estável, com atenção a avaliações e atendimento.' },
              { label: 'Presença',     valor: 69, texto: 'Há espaço para melhorar visibilidade e consistência nos canais.' },
              { label: 'Execução',     valor: 74, texto: 'A leitura operacional indica bom ponto de partida, com pontos a acompanhar.' },
            ],
          },
          difficulty: dificuldade,
          pinned: false,
          createdAt: new Date().toISOString(),
          kind: 'score',
        }
      : isBrowserLauncherCard
        ? {
            id: `blk-browser-launcher-${Date.now()}`,
            cardId: card.id,
            mode: 'pesquisar',
            subKey: 'browserLauncher',
            subLabel: 'Navegador',
            endpoint: null,
            result: {},
            difficulty: dificuldade,
            pinned: false,
            createdAt: new Date().toISOString(),
            kind: 'browserLauncher',
          }
        : isMapLauncherCard
          ? {
              id: `blk-map-launcher-${Date.now()}`,
              cardId: card.id,
              mode: 'pesquisar',
              subKey: 'mapLauncher',
              subLabel: 'Mapa de mercado',
              endpoint: null,
              result: {},
              difficulty: dificuldade,
              pinned: false,
              createdAt: new Date().toISOString(),
              kind: 'mapLauncher',
            }
          : isDeptLauncherCard
            ? {
                id: `blk-department-launcher-${Date.now()}`,
                cardId: card.id,
                mode: 'pesquisar',
                subKey: 'departmentLauncher',
                subLabel: 'Feed por área',
                endpoint: null,
                result: {},
                difficulty: dificuldade,
                pinned: false,
                createdAt: new Date().toISOString(),
                kind: 'departmentLauncher',
              }
            : isSettingsCard
              ? {
                  id: `blk-settings-launcher-${Date.now()}`,
                  cardId: card.id,
                  mode: 'pesquisar',
                  subKey: 'settingsLauncher',
                  subLabel: 'Configuração da empresa',
                  endpoint: null,
                  result: {},
                  difficulty: dificuldade,
                  pinned: false,
                  createdAt: new Date().toISOString(),
                  kind: 'settingsLauncher' as const,
                }
              : isProfileSwitcherCard
                ? {
                    id: `blk-profile-switcher-${Date.now()}`,
                    cardId: card.id,
                    mode: 'pesquisar',
                    subKey: 'profileSwitcher',
                    subLabel: 'Perfis',
                    endpoint: null,
                    result: {},
                    difficulty: dificuldade,
                    pinned: false,
                    createdAt: new Date().toISOString(),
                    kind: 'profileSwitcher' as const,
                  }
              : isFranchiseSwitcherCard
                ? {
                    id: `blk-franchise-switcher-${Date.now()}`,
                    cardId: card.id,
                    mode: 'pesquisar',
                    subKey: 'franchiseSwitcher',
                    subLabel: 'Lojas da rede',
                    endpoint: null,
                    result: {},
                    difficulty: dificuldade,
                    pinned: false,
                    createdAt: new Date().toISOString(),
                    kind: 'franchiseSwitcher' as const,
                  }
              : workspaceContext.diagnostic
              ? buildDiagnosticBlock(card, workspaceContext.diagnostic, dificuldade)
              : buildInitialBlock(card, dificuldade);
    const initialMsg: Message = { id: mainBlock.id, role: 'block', text: mainBlock.subLabel, block: mainBlock };

    // Para launchers e diagnóstico: mantém o bloco inicial (é o conteúdo real).
    // Para cards normais: o contexto inicial vai embutido no bloco de modo/share via _ctx.
    const newMessages: Message[] = (isLauncherCard || workspaceContext.diagnostic)
      ? [cardMsg, initialMsg]
      : [cardMsg];

    // Score/Navegador/Mapa não geram bloco de modo/compartilhamento — só o bloco leve.
    if (isLauncherCard) {
      setWorkspaceOpen(false);
      skipBottomScrollRef.current = true;
      setMessages(newMessages);
      setShortcuts([]);
      return;
    }

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
    // Card novo: começa limpo — sem empilhar sobre o card anterior.
    skipBottomScrollRef.current = true;
    setMessages(newMessages);

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
      const seqAtLoad = seq;
      loadLastWorkspaceBlock(card.id).then(loaded => {
        if (!loaded) return;
        if (lastSeqRef.current !== seqAtLoad) return;
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

  // 8 templates locais de "destrinchar" — sem LLM nem backend.
  function buildDestrincharContent(key: string, card: IntelligenceCard): string {
    const titulo = card.titulo;
    const resumo = card.resumo || titulo;
    const dom = card.dominio || card.area || 'operação';
    const urg = card.urgencia || 'media';
    const acao = card.o_que_fazer || 'definir próximo passo';
    const janela = urg === 'alta' ? '48 a 72 horas' : urg === 'media' ? '2 semanas' : '30 dias';
    switch (key) {
      case 'exemplos':
        return `Exemplos aplicados — "${titulo}"\n\n1. Empresa de ${dom} identificou sinal similar e reagiu com ${acao}. Resultado: recuperação do indicador em 30 dias, custo de ação 3× menor do que agir tarde.\n\n2. Unidade de varejo em contexto equivalente ignorou o sinal por 60 dias. Custo de recuperação subiu 4× e a janela de vantagem competitiva fechou.\n\n3. Rede regional com urgência ${urg} similar priorizou leitura rápida (30 min com equipe de linha de frente) antes de qualquer plano amplo — evitou executar ação incorreta e economizou 2 ciclos de recuperação.`;
      case 'cases':
        return `Cases do setor — "${titulo}"\n\nCase 1 — Reação rápida:\nEmpresa de porte médio em ${dom} detectou o sinal em ciclo semanal, definiu responsável em 48h e executou piloto em 2 semanas. Indicador voltou ao baseline em 45 dias e o time identificou oportunidade adicional no mesmo movimento.\n\nCase 2 — Reação tardia:\nOperação similar deixou o sinal sem responsável por 90 dias. Custo de recuperação era 4× maior, equipe sobrecarregada com efeitos secundários e janela de vantagem fechada.\n\nPadrão: quem age dentro de ${janela} paga menos, colhe mais e aprende mais rápido.`;
      case 'perspectivas':
        return `3 ângulos sobre "${titulo}"\n\nPerspectiva operacional:\nO sinal aponta para um ajuste necessário em ${dom}. Foco em: quem executa, qual indicador monitora e qual prazo é aceitável. Sem essas três definições, análise vira intenção.\n\nPerspectiva competitiva:\nEnquanto a unidade processa o sinal, concorrentes próximos podem estar fazendo o mesmo — ou já ter reagido. Urgência real: ${urg}. Janela antes que o sinal vire commodity: ${janela}.\n\nPerspectiva do cliente:\nO cliente não vê o sinal técnico, mas sente o efeito na experiência. Se ${dom} piora sem resposta, a percepção pública (avaliações, recorrência, boca-a-boca) começa a mover antes da operação perceber.`;
      case 'simplificar':
        return `Em linguagem simples — "${titulo}"\n\nO que aconteceu:\n${resumo}\n\nO que isso significa na prática:\nAlgo mudou em ${dom} e vale prestar atenção agora. Não é alarme — é sinal que pede uma resposta calibrada.\n\nO que fazer:\n${acao}\n\nQuando:\nNos próximos ${urg === 'alta' ? '3 dias' : urg === 'media' ? '2 semanas' : '30 dias'}.\n\nQuem decide:\nO responsável por ${dom} — com clareza de indicador e meta antes de começar.`;
      case 'comparar':
        return `Comparação com referência — "${titulo}"\n\nSinal identificado (urgência ${urg}):\n${resumo}\n\nBenchmark de mercado:\nOperações maduras em ${dom} monitoram esse tipo de sinal semanalmente e têm protocolo de resposta em 48h. A diferença entre o quartil superior e a média não está na tecnologia — está na disciplina de leitura.\n\nGap atual:\nSem responsável definido e indicador-chave claro, o gap entre "perceber" e "agir" aumenta o custo de recuperação em 2–3×.\n\nReferência de performance:\n${urg === 'alta' ? 'Reagir em até 7 dias' : urg === 'media' ? 'Reagir em até 2 semanas' : 'Monitorar quinzenalmente'} é o padrão do quartil superior em ${dom}.`;
      case 'aprofundar':
        return `Análise aprofundada — "${titulo}"\n\n${resumo}\n\nEsse sinal raramente está isolado. Em ${dom}, variações costumam refletir ao menos dois vetores simultâneos: comportamento do cliente e movimento competitivo. O que está visível hoje pode ser eco de mudança que aconteceu 2–4 semanas antes.\n\nDinâmica de ${dom}:\nIndicadores nessa área têm lag natural entre causa e efeito. Agir cedo é mais barato porque a causa ainda é tratável — depois do efeito aparecer, o custo de correção escala.\n\nO que pode estar por trás:\n1. Mudança no comportamento do cliente local\n2. Movimento de concorrente próximo\n3. Ajuste interno de operação ou equipe\n\nCaminho de profundidade:\nValidar hipótese → definir KPI → executar piloto → medir em ${urg === 'alta' ? '14' : '30'} dias → ajustar.`;
      case 'resumir':
        return `Resumo executivo — "${titulo}"\n\nSinal: ${resumo}\nDomínio: ${dom}  ·  Urgência: ${urg}\nAção: ${acao}\nJanela de reação: ${janela}\n\nEm uma linha:\nSinal real em ${dom}, urgência ${urg}. Requer ação com responsável definido e indicador claro nos próximos ${janela}. Custo de agir agora: baixo. Custo de agir depois: alto.`;
      case 'questionar':
        return `Questões para reflexão — "${titulo}"\n\n1. Quem é o responsável formal por ${dom} hoje? Tem autoridade e recursos para agir dentro de ${janela}?\n\n2. Existe dado interno que confirme — ou conteste — que o sinal é real e não ruído sazonal?\n\n3. O que mudaria na decisão se a urgência fosse classificada como maior do que ${urg}? E se fosse menor?\n\n4. Há iniciativa similar já em curso na unidade? Se sim, como conectar ao invés de duplicar?\n\n5. Se nada for feito em ${janela}, qual é o cenário mais provável para ${dom} — e quem vai ter que lidar com ele?`;
      default:
        return '';
    }
  }

  // 8 botões de destrinchar o bloco — resultado aparece dentro do bloco,
  // substituindo o anterior ao clicar (ou recolhendo ao clicar no mesmo).
  function ContentActionButtons({ blockId }: { blockId: string }) {
    const DESTRINCHAR_ACTIONS: { key: string; label: string; Icon: React.ElementType }[] = [
      { key: 'exemplos',     label: 'Exemplos',     Icon: Lightbulb },
      { key: 'cases',        label: 'Cases',        Icon: BookOpen },
      { key: 'perspectivas', label: 'Perspectivas', Icon: Eye },
      { key: 'simplificar',  label: 'Simplificar',  Icon: AlignLeft },
      { key: 'comparar',     label: 'Comparar',     Icon: GitCompare },
      { key: 'aprofundar',   label: 'Aprofundar',   Icon: Search },
      { key: 'resumir',      label: 'Resumir',      Icon: FileText },
      { key: 'questionar',   label: 'Questionar',   Icon: MessageSquare },
    ];
    const current = destrincharByBlock[blockId];
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1 flex-wrap">
          {DESTRINCHAR_ACTIONS.map(a => (
            <BlockCtrl
              key={a.key}
              Icon={a.Icon}
              label={a.label}
              active={current?.key === a.key}
              onClick={() => {
                if (!activeCard) return;
                if (current?.key === a.key) {
                  setDestrincharByBlock(prev => ({ ...prev, [blockId]: null }));
                } else {
                  const text = buildDestrincharContent(a.key, activeCard);
                  setDestrincharByBlock(prev => ({ ...prev, [blockId]: { key: a.key, text } }));
                }
              }}
            />
          ))}
        </div>
        {current?.text && (
          <div className="rounded-xl bg-white dark:bg-[#242424] border border-neutral-100 dark:border-[#3a3a3a] px-3 py-2.5">
            <p className="text-[11px] leading-relaxed text-neutral-700 dark:text-neutral-300 whitespace-pre-line">{current.text}</p>
          </div>
        )}
      </div>
    );
  }

  // Template local de insights e direcionamentos — sem LLM nem backend.
  // Template local de insights e direcionamentos — retorna dados estruturados
  // para renderizar como linhas com pílulas (mesmo padrão visual do card original).
  function buildInsightsData(_card: IntelligenceCard): InsightPayload {
    return {
      insights: [
        'Insight de exemplo 1 — aqui aparecerá a leitura gerada pelo motor sobre o padrão identificado no sinal. Este bloco é um placeholder de formato para demonstrar como o conteúdo se acomoda no layout quando ocupa algumas linhas.',
        'Insight de exemplo 2 — aqui o motor apresentará a análise de contexto e urgência relativa ao domínio do card. Placeholder de formato — o texto real terá esta extensão aproximada, podendo variar conforme o sinal recebido.',
        'Insight de exemplo 3 — aqui aparecerá a comparação com padrões similares observados em empresas do setor. Placeholder de formato para testar como o card se comporta com múltiplos itens de texto moderadamente longo.',
        'Insight de exemplo 4 — aqui o motor indicará os sinais secundários relacionados e o que sugerem em conjunto. Placeholder de formato — o conteúdo real será gerado dinamicamente pelo motor de análise na Fase 2.',
        'Insight de exemplo 5 — aqui aparecerá a síntese dos padrões identificados e a leitura consolidada sobre o sinal. Placeholder de formato para validar o layout com cinco itens completos antes de conectar o motor real.',
      ],
      decisoes: [
        { titulo: 'Direcionamento 1', texto: 'Placeholder de formato 1 — aqui o motor apresentará um caminho de decisão possível com base na leitura do sinal. Serve para testar como texto de algumas linhas se comporta dentro do card e se o layout aguenta sem quebrar.' },
        { titulo: 'Direcionamento 2', texto: 'Placeholder de formato 2 — aqui aparecerá uma alternativa de ação com custo e prazo diferentes do primeiro caminho. O texto real terá esta extensão aproximada conforme a complexidade do sinal analisado.' },
        { titulo: 'Direcionamento 3', texto: 'Placeholder de formato 3 — aqui o motor indicará uma opção de monitoramento antes de comprometer recursos. Demonstra como cinco itens de decisão ficam organizados no card expandido.' },
        { titulo: 'Direcionamento 4', texto: 'Placeholder de formato 4 — aqui aparecerá uma opção de delegação com critério de revisão e responsável sugerido. Serve para testar espaçamento, legibilidade e scroll quando há bastante conteúdo.' },
        { titulo: 'Direcionamento 5', texto: 'Placeholder de formato 5 — aqui o motor apresentará a opção de adiamento com justificativa e data de revisão sugerida. Completa os cinco direcionamentos e valida o layout com o conjunto inteiro.' },
      ],
    };
  }

  // Card de "Insights e direcionamentos" — visual igual ao WorkspaceShortcutsBlock
  // (tall, composto, pílulas coloridas). 3 fases:
  //   idle    → 3 preview rows com pílulas (Insight / Decisão / Direção)
  //   mapping → título centralizado + barra de progresso ~1.8s
  //   open    → linhas com pílulas mostrando insights + decisões gerados
  function InsightsCard({ blockId }: { blockId: string }) {
    const payload   = insightsByBlock[blockId];
    const isMapping = mappingBlocks.has(blockId);
    const isOpen    = !!payload && !isMapping;

    const handleClick = () => {
      const card = activeCard;
      if (!card) return;
      if (isOpen) { setInsightsByBlock(prev => ({ ...prev, [blockId]: null })); return; }
      if (isMapping) return;
      setMappingBlocks(prev => new Set([...prev, blockId]));
      setTimeout(() => {
        setMappingBlocks(prev => { const n = new Set(prev); n.delete(blockId); return n; });
        setInsightsByBlock(prev => ({ ...prev, [blockId]: buildInsightsData(card) }));
      }, 1800);
    };

    // Linha clicável — mesmo padrão visual do ShortcutRow do WorkspaceShortcutsBlock
    const Row = ({ pill, pillCls, cta, ctaCls, children }: {
      pill: string; pillCls: string; cta?: string; ctaCls?: string; children: React.ReactNode;
    }) => (
      <button
        type="button"
        onClick={handleClick}
        className="group flex items-start gap-2 text-left text-[12px] leading-[1.55] text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-[#363636] rounded-md px-1 -mx-1 py-0.5 transition-colors w-full cursor-pointer"
      >
        <span className={`shrink-0 mt-0.5 inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold tracking-wide ${pillCls}`}>{pill}</span>
        <span className="flex-1 text-neutral-600 dark:text-neutral-300">
          {children}
          {cta && <span className={`whitespace-nowrap font-medium ml-1 ${ctaCls}`}>{cta} →</span>}
        </span>
      </button>
    );

    const outerCls = 'w-full rounded-xl border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] bg-[#fbfcfd] dark:bg-[#2a2a2a] shadow-[0_2px_6px_-2px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.35)]';

    // Fase: mapeando
    if (isMapping) {
      return (
        <div className={`${outerCls} px-3.5 py-4 flex flex-col items-center gap-2.5`}>
          <span className="text-[12px] font-semibold text-neutral-700 dark:text-neutral-200">Insights e direcionamentos</span>
          <div className="w-full flex flex-col items-center gap-1.5">
            <span className="text-[9px] font-bold tracking-widest text-neutral-400 dark:text-neutral-500 uppercase">mapeando</span>
            <div className="w-full h-[2px] bg-neutral-100 dark:bg-[#3a3a3a] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-neutral-500 dark:bg-neutral-400 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.8, ease: [0.4, 0, 0.6, 1] }}
              />
            </div>
          </div>
        </div>
      );
    }

    // Fase: idle — 1 linha com pílula [Atalho] emerald + tagline + CTA "Mapear →"
    if (!isOpen) {
      return (
        <div className={`${outerCls} px-3.5 py-3`}>
          <button
            type="button"
            onClick={handleClick}
            className="group flex items-start gap-2 text-left text-[12px] leading-[1.55] text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-[#363636] rounded-md px-1 -mx-1 py-0.5 transition-colors w-full cursor-pointer"
          >
            <span className="shrink-0 mt-0.5 inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold tracking-wide bg-emerald-50 text-emerald-700 dark:bg-emerald-900/25 dark:text-emerald-300">
              Atalho
            </span>
            <span className="flex-1 text-neutral-600 dark:text-neutral-300">
              Transforme o sinal em insights concretos e caminhos de decisão — leitura do padrão, análise de urgência e opções de resposta calibradas.{' '}
              <span className="whitespace-nowrap font-medium text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-0.5">
                Mapear
                <ArrowRight size={11} className="inline-block translate-y-[0.5px] group-hover:translate-x-0.5 transition-transform" />
              </span>
            </span>
          </button>
        </div>
      );
    }

    // Fase: open — insight rows + decision rows
    const DECISION_PILLS = [
      'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/25 dark:text-emerald-300',
      'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
      'bg-amber-50 text-amber-700 dark:bg-amber-900/25 dark:text-amber-300',
      'bg-neutral-100 text-neutral-600 dark:bg-[#3a3a3a] dark:text-neutral-300',
    ];
    return (
      <div className={`${outerCls} px-3.5 py-3`}>
        <div className="flex flex-col gap-3">
          {payload!.insights.map((txt, i) => (
            <Row key={`ins-${i}`} pill="Insight" pillCls="bg-amber-50 text-amber-700 dark:bg-amber-900/25 dark:text-amber-300">
              {txt}
            </Row>
          ))}
          <div className="border-t border-neutral-100 dark:border-[#3a3a3a] -mx-1 my-0.5" />
          {payload!.decisoes.map((d, i) => (
            <Row key={`dec-${i}`} pill={d.titulo} pillCls={DECISION_PILLS[i] || DECISION_PILLS[3]}>
              {d.texto}
            </Row>
          ))}
          <button
            type="button"
            onClick={handleClick}
            className="self-start text-[10px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors cursor-pointer"
          >
            Fechar ×
          </button>
        </div>
      </div>
    );
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

  // Confirmação de logout — pausa o conteúdo atual sem arquivar.
  // Cancelar restaura o conteúdo (messages intactas); Sair chama handleLogout.
  if (logoutPending) {
    return (
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 scroll-pt-6 space-y-3">
        <div className="flex flex-col items-start gap-2.5">
          <div className="max-w-[94%] w-full mx-auto rounded-2xl bg-[#EFEFF1] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)] overflow-hidden">
            <div className="px-3.5 py-2 border-b border-neutral-100 dark:border-[#414141] flex items-center gap-2">
              <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: '#ef4444' }}>Sair do OS¹</span>
              <div className="flex-1" />
            </div>
            <div className="px-3.5 py-3 text-[12px] text-neutral-700 dark:text-neutral-300 space-y-3">
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Você está saindo da plataforma. Todas as análises abertas na área de trabalho ficam arquivadas automaticamente — ao retornar, basta acessar a lista de conversas salvas para retomar de onde parou, com o mesmo estado e contexto.
              </p>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Suas configurações de perfil, preferências de feed, departamento ativo e dados preenchidos no painel de configuração são preservados entre sessões. Nenhuma informação configurada se perde ao encerrar a sessão atual.
              </p>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Placeholder de formato — este parágrafo representa contexto adicional de sessão que será exibido aqui: tempo de uso, alertas pendentes não lidos ou notificações que ficaram em aberto durante a navegação. Volume de texto para validar o layout do container antes de conectar os dados reais.
              </p>
              <p className="text-[13px] font-semibold text-neutral-800 dark:text-neutral-100">Tem certeza que quer sair?</p>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                O que estava aberto na área de trabalho será retomado se você cancelar. Nenhuma ação é irreversível neste momento — cancele para continuar de onde estava sem perder nenhum contexto.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={onCancelLogout}
                  className="flex-1 h-9 rounded-lg text-[12px] font-medium border border-neutral-200 dark:border-[#414141] bg-white dark:bg-[#242424] text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-[#2f2f2f] transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={onConfirmLogout}
                  className="flex-1 h-9 rounded-lg text-[12px] font-medium bg-[#ef4444] text-white hover:bg-[#dc2626] transition-colors cursor-pointer"
                >
                  Sair
                </button>
              </div>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500 leading-relaxed">
                Ao sair, você retornará à tela de login do OS¹. Seus dados, configurações e histórico ficam salvos e estarão disponíveis no próximo acesso com as mesmas credenciais.
              </p>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500 leading-relaxed">
                Placeholder de formato — este espaço será usado para exibir informações de sessão: último acesso registrado, dispositivos ativos e opções de segurança da conta. Funcionalidade prevista para a Fase 2 do produto.
              </p>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500 leading-relaxed">
                Placeholder de formato — linha adicional para preencher o rodapé do container e validar o volume visual. O texto real deste bloco virá do estado de sessão do usuário autenticado, incluindo data e hora do último login.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quando histórico está aberto, mostra apenas a lista de conversas arquivadas
  if (chatHistoryOpen) {
    const sessions = archivedSessions ?? [];
    const allIds = sessions.map(s => s.id);
    const allSelected = allIds.length > 0 && allIds.every(id => histSelectedIds.has(id));

    const toggleId = (id: string) => setHistSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

    const toggleAll = () => setHistSelectedIds(
      allSelected ? new Set() : new Set(allIds)
    );

    const exitSelection = () => {
      setHistSelectionMode(false);
      setHistSelectedIds(new Set());
      setHistConfirmPending(false);
    };

    const confirmDelete = () => {
      onDeleteSessions?.([...histSelectedIds]);
      exitSelection();
    };

    const btnBase = "flex-1 h-9 rounded-lg text-[12px] font-medium transition-colors cursor-pointer";
    const btnSecondary = `${btnBase} border border-neutral-200 dark:border-[#414141] bg-white dark:bg-[#242424] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-[#2e2e2e]`;
    const btnDanger = `${btnBase} bg-[#ef4444] text-white hover:bg-[#dc2626]`;
    const btnDangerDisabled = `${btnBase} bg-neutral-200 dark:bg-[#353535] text-neutral-400 dark:text-neutral-600 cursor-not-allowed`;

    // Confirmação de exclusão
    if (histConfirmPending) {
      return (
        <div className="flex flex-col h-full">
          <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4">
            <div className="max-w-[94%] w-full rounded-2xl bg-[#EFEFF1] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)] overflow-hidden">
              <div className="px-3.5 py-2 border-b border-neutral-100 dark:border-[#414141] flex items-center gap-2">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#ef4444]">Confirmar exclusão</span>
                <div className="flex-1" />
              </div>
              <div className="px-3.5 py-4 space-y-3">
                <p className="text-[13px] font-semibold text-neutral-800 dark:text-neutral-100">
                  Apagar {histSelectedIds.size} {histSelectedIds.size === 1 ? 'conversa' : 'conversas'} selecionadas?
                </p>
                <p className="text-[12px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Esta ação não pode ser desfeita.
                </p>
                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={() => setHistConfirmPending(false)} className={btnSecondary}>Cancelar</button>
                  <button type="button" onClick={confirmDelete} className={btnDanger}>Sim, apagar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full">
        {/* Cabeçalho do modo seleção */}
        {histSelectionMode && (
          <div className="px-4 pt-3 pb-2.5 flex items-center gap-2.5 border-b border-neutral-100 dark:border-[#414141] flex-shrink-0">
            <button
              type="button"
              onClick={toggleAll}
              className={`w-4 h-4 rounded border-[1.5px] flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${
                allSelected ? 'bg-[#3b82f6] border-[#3b82f6]' : 'border-neutral-300 dark:border-neutral-600 bg-white dark:bg-[#2a2a2a]'
              }`}
            >
              {allSelected && <CheckCircle size={10} className="text-white" />}
            </button>
            <span className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-300 flex-1">
              {histSelectedIds.size === 0 ? 'Selecionar todos' : `${histSelectedIds.size} selecionado${histSelectedIds.size > 1 ? 's' : ''}`}
            </span>
            <button type="button" onClick={exitSelection} className="text-[11px] text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 cursor-pointer px-1">
              Cancelar
            </button>
          </div>
        )}

        {/* Lista */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
          {sessions.length === 0 ? (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-8">Nenhuma conversa anterior.</p>
          ) : (
            [...sessions].reverse().map(s => {
              if (histSelectionMode) {
                const isSelected = histSelectedIds.has(s.id);
                return (
                  <div
                    key={s.id}
                    onClick={() => toggleId(s.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border-[0.5px] transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#3b82f6]/5 dark:bg-[#3b82f6]/10 border-[#3b82f6]/40'
                        : 'bg-[#EFEFF1] dark:bg-[#2f2f2f] border-neutral-200 dark:border-[#3d3d3d] hover:bg-[#E3E4E6] dark:hover:bg-[#353535]'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border-[1.5px] flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected ? 'bg-[#3b82f6] border-[#3b82f6]' : 'border-neutral-300 dark:border-neutral-600 bg-white dark:bg-[#2a2a2a]'
                    }`}>
                      {isSelected && <CheckCircle size={10} className="text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate">{s.cardTitle}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{new Date(s.ts).toLocaleString('pt-BR')} · {s.sector}</p>
                    </div>
                  </div>
                );
              }
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    if (s.snapshot) restoreSession(s.snapshot);
                    onSelectHistorySession?.(s.id);
                  }}
                  className="text-left px-4 py-3 rounded-xl bg-[#EFEFF1] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)] hover:bg-[#E3E4E6] dark:hover:bg-[#353535] transition-colors duration-150 cursor-pointer active:scale-[0.99]"
                >
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate">{s.cardTitle}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{new Date(s.ts).toLocaleString('pt-BR')} · {s.sector}</p>
                </button>
              );
            })
          )}
        </div>

        {/* Barra de ações */}
        <div className="px-4 py-3 border-t border-neutral-100 dark:border-[#414141] flex gap-2 flex-shrink-0">
          {histSelectionMode ? (
            <>
              <button type="button" onClick={exitSelection} className={btnSecondary}>Cancelar</button>
              <button
                type="button"
                onClick={() => { if (histSelectedIds.size > 0) setHistConfirmPending(true); }}
                className={histSelectedIds.size > 0 ? btnDanger : btnDangerDisabled}
                disabled={histSelectedIds.size === 0}
              >
                {histSelectedIds.size > 0 ? `Apagar ${histSelectedIds.size}` : 'Apagar'}
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={onCloseHistory} className={btnSecondary}>Voltar</button>
              <button
                type="button"
                onClick={() => { if (sessions.length > 0) setHistSelectionMode(true); }}
                className={sessions.length > 0 ? btnDanger : btnDangerDisabled}
                disabled={sessions.length === 0}
              >
                Apagar
              </button>
            </>
          )}
        </div>
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
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 scroll-pt-6 space-y-3">
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
                  <div className="max-w-[94%] w-full mx-auto p-3.5 rounded-2xl bg-[#EFEFF1] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)]">
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
            const isScore   = b.kind === 'score';
            const isBrowserLauncher       = b.kind === 'browserLauncher';
            const isMapLauncher           = b.kind === 'mapLauncher';
            const isDeptLauncher          = b.kind === 'departmentLauncher';
            const isSettingsLauncher      = b.kind === 'settingsLauncher';
            const isProfileSwitcherLauncher = b.kind === 'profileSwitcher';
            const isFranchiseSwitcherLauncher = b.kind === 'franchiseSwitcher';
            const headerColor = isDiag ? '#0ea5e9' : isInitial ? '#10b981' : isShare ? '#f59e0b' : isTool ? '#8b5cf6' : isScore ? '#6366f1' : isBrowserLauncher ? '#0891b2' : isMapLauncher ? '#059669' : isDeptLauncher ? '#d946ef' : isSettingsLauncher ? '#7c3aed' : isProfileSwitcherLauncher ? '#3b82f6' : isFranchiseSwitcherLauncher ? '#b8860b' : isMode ? '#3b82f6' : '#3b82f6';
            // Tools aparecem em blocos com conteúdo gerado (mode, standard, diagnostico).
            // Initial / share / tool / score / browserLauncher / mapLauncher / departmentLauncher / settingsLauncher / profileSwitcher / franchiseSwitcher não geram contêiner.
            const toolCtx = !isShare && !isTool && !isInitial && !isScore && !isBrowserLauncher && !isMapLauncher && !isDeptLauncher && !isSettingsLauncher && !isProfileSwitcherLauncher && !isFranchiseSwitcherLauncher ? buildToolCtx(activeCard, b) : null;
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
                <div className="max-w-[94%] w-full mx-auto rounded-2xl bg-[#EFEFF1] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)] overflow-hidden">
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
                      <div className="space-y-3">
                        {(b.result._ctx as Record<string, unknown> | undefined) && (
                          <ContextSection ctx={b.result._ctx as Record<string, unknown>} />
                        )}
                        <ShareOptionsContent card={activeCard} />
                      </div>
                    ) : isTool ? (
                      <ToolBlockContent output={b.result as unknown as ToolOutput} />
                    ) : isDiag ? (
                      <DiagnosticBlockContent payload={b.result as unknown as CompanyDiagnosticPayload} />
                    ) : isScore ? (
                      <ScoreBlockContent result={b.result} />
                    ) : isBrowserLauncher ? (
                      <WorkspaceBrowserLauncherBlock onOpen={(url) => { onOpenBrowserUrl?.(url); handleApagar(); }} />
                    ) : isMapLauncher ? (
                      <WorkspaceMapLauncherBlock onOpen={(radiusKm) => { onOpenMapWithRadius?.(radiusKm); handleApagar(); }} />
                    ) : isDeptLauncher ? (
                      <WorkspaceDepartmentLauncherBlock active={activeDepartment} onSelect={(id) => { onSelectDepartment?.(id); handleApagar(); }} />
                    ) : isSettingsLauncher ? (
                      <WorkspaceSettingsBlock profileId={activeSector} />
                    ) : isProfileSwitcherLauncher ? (
                      <WorkspaceProfileSwitcherBlock active={activeSector} onSelect={(id) => onSelectSector?.(id)} />
                    ) : isFranchiseSwitcherLauncher ? (
                      <WorkspaceProfileSwitcherBlock
                        active={activeSector}
                        onSelect={(id) => onSelectSector?.(id)}
                        filterIds={['cerveja-imperio', 'cerveja-imperio-distribuidora-01']}
                        header="Lojas da rede"
                        contextBefore="Alterne entre as unidades da rede Império para comparar leituras de mercado, fornecedores e operação entre a central e as distribuidoras. Cada unidade tem seu próprio feed de sinais e análise de contexto independente."
                        contextAfter="Ao escolher uma unidade, o feed atualiza e a área de trabalho fecha automaticamente, mostrando o perfil selecionado. Para voltar à central, escolha Cerveja Império na lista acima."
                      />
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
                      {/* Botões de conteúdo — mesma estética dos outros blocos */}
                      <div className="pt-1 border-t border-dashed border-neutral-100 dark:border-[#414141]">
                        <ContentActionButtons blockId={b.id} />
                      </div>
                    </div>
                  ) : isShare ? (
                    <div className="px-2.5 py-2 border-t border-neutral-100 dark:border-[#414141]">
                      <ContentActionButtons blockId={b.id} />
                    </div>
                  ) : isTool ? (
                    <div className="px-2.5 py-2 border-t border-neutral-100 dark:border-[#414141] flex items-center gap-1 flex-wrap">
                      <BlockCtrl Icon={Pin}  label={b.pinned ? 'Fixado' : 'Fixar'} active={b.pinned} onClick={() => togglePinBlock(b.id)} />
                      <BlockCtrl Icon={Copy} label="Copiar"      onClick={() => copyBlock(b)} />
                    </div>
                  ) : isScore || isBrowserLauncher || isMapLauncher || isDeptLauncher || isProfileSwitcherLauncher || isFranchiseSwitcherLauncher ? null : isDiag ? (
                    <div className="px-2.5 py-2 border-t border-neutral-100 dark:border-[#414141] flex items-center gap-1 flex-wrap">
                      <BlockCtrl Icon={Pin}  label={b.pinned ? 'Fixado' : 'Fixar'} active={b.pinned} onClick={() => togglePinBlock(b.id)} />
                      <BlockCtrl Icon={Copy} label="Copiar"      onClick={() => copyBlock(b)} />
                    </div>
                  ) : isMode ? (
                    <div className="px-2.5 py-2 border-t border-neutral-100 dark:border-[#414141] flex flex-col gap-2">
                      <ContentActionButtons blockId={b.id} />
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
                      <ContentActionButtons blockId={b.id} />
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
                  <div className="max-w-[94%] w-full mx-auto">
                    <InsightsCard blockId={b.id} />
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
            <div className="bg-[#EFEFF1] dark:bg-[#2f2f2f] rounded-2xl border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)] px-4 py-3 flex items-center gap-1">
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

// Bloco leve de Score — números e textos curtos, sem componente grande
// (ScoreOS1Panel) e sem tela cheia. Mock/preview local; sem chamada de API.
function ScoreBlockContent({ result }: { result: Record<string, unknown> }) {
  const scoreGeral = typeof result.score_geral === 'number' ? result.score_geral : null;
  const resumo = typeof result.resumo === 'string' ? result.resumo : '';
  const dimensoes = Array.isArray(result.dimensoes)
    ? result.dimensoes as { label: string; valor: number; texto: string }[]
    : [];
  return (
    <div className="space-y-3">
      {resumo && (
        <p className="text-neutral-500 dark:text-neutral-400">{resumo}</p>
      )}
      {scoreGeral !== null && (
        <p className="text-[26px] font-bold text-neutral-800 dark:text-neutral-100 tabular-nums">
          {scoreGeral}<span className="text-[13px] font-normal text-neutral-400 dark:text-neutral-500">/100</span>
        </p>
      )}
      <div className="space-y-2.5">
        {dimensoes.map((d, i) => (
          <div key={i}>
            <p className="font-semibold text-neutral-700 dark:text-neutral-200">{d.label} · {d.valor}</p>
            <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">{d.texto}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Bloco lançador do Navegador — só o campo de URL, sem renderizar o
// navegador (ElectronBrowser/iframe) dentro da Área de Trabalho. Abre o
// fullscreen já existente via onOpen, que recebe a URL já normalizada.
function WorkspaceBrowserLauncherBlock({ onOpen }: { onOpen: (url: string) => void }) {
  const [url, setUrl] = useState('');
  const handleOpen = () => {
    const normalized = normalizeUrl(url);
    if (!normalized) return;
    onOpen(normalized);
  };
  return (
    <div className="space-y-3">
      <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
        Para pesquisar, validar informações externas ou explorar referências de mercado sem sair da área de trabalho, use o navegador integrado. Cole o endereço de qualquer site — concorrentes, fornecedores, publicações do setor ou portais de dados — e ele abre imediatamente em tela cheia dentro do app.
      </p>
      <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
        O navegador mantém o contexto da sessão ativa: tudo que você pesquisar aqui pode ser usado como referência para as análises em andamento. Páginas de preços, avaliações, notícias recentes ou relatórios públicos ficam acessíveis sem a necessidade de alternar entre janelas.
      </p>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') handleOpen(); }}
        placeholder="https://..."
        className="w-full px-3 py-2 rounded-lg text-[12px] bg-neutral-50 dark:bg-[#353535] border border-neutral-200 dark:border-[#414141] text-neutral-700 dark:text-neutral-200 placeholder:text-neutral-400 focus:outline-none focus:border-[#3b82f6]"
      />
      <button
        type="button"
        onClick={handleOpen}
        disabled={!url.trim()}
        className="w-full h-9 rounded-lg text-[12px] font-medium bg-[#3b82f6] text-white disabled:opacity-40 disabled:cursor-default cursor-pointer hover:bg-[#2f6fd6] transition-colors"
      >
        Abrir navegador
      </button>
      <p className="text-[11px] text-neutral-400 dark:text-neutral-500 leading-relaxed">
        Ao fechar o navegador, você retorna automaticamente à área de trabalho com o estado exatamente como estava. O histórico de navegação fica ativo durante a sessão e é descartado ao encerrar.
      </p>
      <p className="text-[11px] text-neutral-400 dark:text-neutral-500 leading-relaxed">
        Placeholder de formato — este espaço será usado para exibir ações contextuais baseadas na página visitada: fixar referência, adicionar ao relatório ou comparar com dados do perfil ativo. Funcionalidade prevista para a Fase 2 do produto.
      </p>
    </div>
  );
}

// Bloco lançador do Mapa — só a escolha de raio, sem renderizar o
// CompetitiveMap dentro da Área de Trabalho. Abre o fullscreen já
// existente via onOpen(radiusKm). PENDÊNCIA: CompetitiveMap ainda não
// aceita raio como parâmetro — o valor escolhido aqui ainda não é
// aplicado no mapa fullscreen (ver App.tsx: openMapWithRadius).
const MAP_RADIUS_OPTIONS_KM = [1, 3, 5, 10];

function WorkspaceMapLauncherBlock({ onOpen }: { onOpen: (radiusKm: number) => void }) {
  const [radiusKm, setRadiusKm] = useState(3);
  return (
    <div className="space-y-3">
      <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
        Explore o território ao redor do negócio com um mapa interativo que cruza a geolocalização da unidade com dados de concorrência, fluxo e sinais locais. A análise territorial complementa o feed de mercado com uma camada geográfica — útil para entender densidade competitiva, movimentação de clientes e oportunidades por região.
      </p>
      <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
        Escolha o raio de cobertura antes de abrir. Raios menores (1–3 km) revelam o entorno imediato e são indicados para análise de concorrentes diretos; raios maiores (5–10 km) ampliam o contexto regional e mostram o cenário competitivo mais amplo do setor.
      </p>
      <div className="flex items-center gap-1.5 flex-wrap">
        {MAP_RADIUS_OPTIONS_KM.map((km) => (
          <button
            key={km}
            type="button"
            onClick={() => setRadiusKm(km)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border cursor-pointer transition-colors ${
              radiusKm === km
                ? 'bg-[#3b82f6] text-white border-[#3b82f6]'
                : 'bg-neutral-50 dark:bg-[#353535] text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-[#414141]'
            }`}
          >
            {km} km
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onOpen(radiusKm)}
        className="w-full h-9 rounded-lg text-[12px] font-medium bg-[#3b82f6] text-white cursor-pointer hover:bg-[#2f6fd6] transition-colors"
      >
        Abrir mapa
      </button>
      <p className="text-[11px] text-neutral-400 dark:text-neutral-500 leading-relaxed">
        O mapa abre em tela cheia com os dados do perfil ativo já carregados. Concorrentes mapeados, notas Google e faixas de preço disponíveis aparecem como marcadores interativos dentro do raio selecionado.
      </p>
      <p className="text-[11px] text-neutral-400 dark:text-neutral-500 leading-relaxed">
        Placeholder de formato — este espaço será usado para exibir um resumo territorial gerado após o fechamento do mapa: pontos identificados, concentrações de concorrência e sugestões de ação baseadas no que foi visualizado. Funcionalidade prevista para a Fase 2 do produto.
      </p>
    </div>
  );
}

// Bloco seletor de Feed por área — reaproveita a lista real de departamentos
// (DEPARTMENTS/VISIBLE_DEPARTMENT_IDS de SectorSwitcher.tsx, a mesma fonte
// do seletor "Mais"/DepartmentSwitcherModal). Clicar muda activeDepartment
// direto — sem navegar, sem fechar a Área de Trabalho, sem abrir modal.
const DEPARTMENT_LAUNCHER_OPTIONS: { id: DepartmentId; label: string; color: string }[] = [
  { id: 'geral', label: 'Geral', color: '#3b82f6' },
  ...DEPARTMENTS.filter((d) => VISIBLE_DEPARTMENT_IDS.has(d.id)).map((d) => ({ id: d.id as DepartmentId, label: d.label, color: d.color })),
];

function WorkspaceDepartmentLauncherBlock({ active, onSelect }: { active?: DepartmentId; onSelect: (id: DepartmentId) => void }) {
  return (
    <div className="space-y-3">
      <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
        Cada área filtra o feed de mercado por uma lente específica — Financeiro traz sinais de crédito, margem e custos; Comercial traz concorrência, preços e demanda; RH traz mercado de trabalho e salários do setor. A leitura muda, os dados do perfil continuam os mesmos.
      </p>
      <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
        Escolha a área abaixo para trocar o feed. O perfil ativo é mantido — só a lente de leitura muda, permitindo alternar rapidamente entre perspectivas sem perder o contexto da sessão.
      </p>
      <div className="flex flex-wrap gap-1.5">
        {DEPARTMENT_LAUNCHER_OPTIONS.map((opt) => {
          const isActive = active === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border cursor-pointer transition-colors ${
                isActive ? 'text-white' : 'bg-neutral-50 dark:bg-[#353535] text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-[#414141]'
              }`}
              style={isActive ? { backgroundColor: opt.color, borderColor: opt.color } : undefined}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-neutral-400 dark:text-neutral-500 leading-relaxed">
        Ao selecionar uma área, o feed atualiza e a área de trabalho fecha automaticamente, mostrando o perfil com a leitura nova. Para voltar à visão geral, escolha a opção Geral.
      </p>
      <p className="text-[11px] text-neutral-400 dark:text-neutral-500 leading-relaxed">
        Placeholder de formato — este espaço será usado para exibir um resumo dos sinais mais recentes da área selecionada, com destaque para os cards de maior urgência dentro da lente escolhida. Funcionalidade prevista para a Fase 2 do produto.
      </p>
    </div>
  );
}

// Bloco de configuração da empresa — mesma experiência do modal CompanySettingsModal,
// mas renderizado diretamente na Área de Trabalho (padrão launcher). Persiste via
// loadSettings/saveSettings (localStorage), sem backend, sem prop de callback.
function WorkspaceSettingsBlock({ profileId }: { profileId?: string }) {
  const id = profileId ?? 'os1';
  const [settings, setSettings] = useState<CompanySettings>(() => loadSettings(id));

  const update = (next: CompanySettings) => {
    setSettings(next);
    saveSettings(id, next);
  };

  const setToggle = (fieldId: string, value: boolean) => {
    update({ ...settings, toggles: { ...settings.toggles, [fieldId]: value } });
  };

  const setValue = (fieldId: string, value: string) => {
    update({ ...settings, values: { ...settings.values, [fieldId]: value } });
  };

  return (
    <div className="space-y-4">
      <p className="text-neutral-500 dark:text-neutral-400 text-[12px]">
        Calibre o radar de inteligência. As respostas afinam a leitura do mercado para o seu perfil.
      </p>

      {/* Tipo de empresa */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1.5">Tipo de empresa</p>
        <div className="flex flex-wrap gap-1.5">
          {COMPANY_TYPES.map((ct) => {
            const isActive = settings.companyType === ct.value;
            return (
              <button
                key={ct.value}
                type="button"
                onClick={() => update({ ...settings, companyType: ct.value })}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'bg-neutral-50 dark:bg-[#353535] text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-[#414141] hover:border-violet-400 dark:hover:border-violet-700'
                }`}
              >
                {ct.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Seções de campos */}
      {SETTINGS_SECTIONS.map((section) => (
        <div key={section.title} className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">{section.title}</p>
          {section.fields.map((field) => {
            const active = settings.toggles[field.id] ?? field.defaultActive;
            const val = settings.values[field.id] ?? '';
            return (
              <div key={field.id} className="rounded-xl border border-neutral-200 dark:border-[#414141] bg-white dark:bg-[#242424] overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-neutral-100 dark:border-[#333]">
                  <SettingsToggle active={active} onChange={(v) => setToggle(field.id, v)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-200 truncate">{field.question}</p>
                    {field.explanation && (
                      <p className="text-[10px] text-neutral-400 dark:text-neutral-500 leading-snug mt-0.5">{field.explanation}</p>
                    )}
                  </div>
                </div>
                {active && (
                  <textarea
                    value={val}
                    onChange={(e) => setValue(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    rows={2}
                    className="w-full px-3 py-2 text-[12px] bg-transparent text-neutral-700 dark:text-neutral-200 placeholder:text-neutral-400 resize-none focus:outline-none"
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}

      <p className="text-[10px] text-neutral-400 dark:text-neutral-500">
        As informações são salvas automaticamente e usadas para afinar a análise.
      </p>
    </div>
  );
}

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

const CTX_FIELDS: { label: string; key: string; emphasis?: boolean }[] = [
  { label: 'O que aconteceu',       key: 'o_que_aconteceu' },
  { label: 'Por que importa',       key: 'por_que_importa', emphasis: true },
  { label: 'Onde afeta',            key: 'onde_afeta' },
  { label: 'Risco',                 key: 'risco' },
  { label: 'Oportunidade',          key: 'oportunidade' },
  { label: 'Domínio',               key: 'dominio' },
  { label: 'Contexto para análise', key: 'acao_recomendada', emphasis: true },
  { label: 'Próximo passo',         key: 'proximo_passo' },
];

function ContextSection({ ctx }: { ctx: Record<string, unknown> }) {
  const hasAny = CTX_FIELDS.some(f => ctx[f.key]);
  if (!hasAny) return null;
  return (
    <>
      <div className="space-y-2.5">
        {CTX_FIELDS.map(f => {
          const v = ctx[f.key];
          if (!v) return null;
          return (
            <div key={f.key}>
              <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-0.5">{f.label}</p>
              <p className={`text-[12px] leading-relaxed ${f.emphasis ? 'text-neutral-800 dark:text-neutral-200 font-medium' : 'text-neutral-600 dark:text-neutral-400'}`}>{String(v)}</p>
            </div>
          );
        })}
      </div>
      <hr className="border-neutral-100 dark:border-[#414141] my-3" />
    </>
  );
}

// Conteúdo de um bloco de modo (Entender / Executar / Aprender) — contexto inicial no topo + campos do modo.
function ModeBlockContent({ result, mode }: { result: Record<string, unknown>; mode: MainKey }) {
  const ctx = result._ctx as Record<string, unknown> | undefined;
  const fields = MODE_FIELDS[mode];
  return (
    <div className="space-y-2.5">
      {ctx && <ContextSection ctx={ctx} />}
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

const PROFILE_SWITCHER_IDS = ['os1', 'mcdonalds', 'nike', 'nubank', 'cerveja-imperio', 'combrasil'];

function WorkspaceProfileSwitcherBlock({ active, onSelect, filterIds, header, contextBefore, contextAfter }: {
  active?: string; onSelect: (id: string) => void;
  filterIds?: string[]; header?: string; contextBefore?: string; contextAfter?: string;
}) {
  const profiles = SECTORS.filter(p => (filterIds ?? PROFILE_SWITCHER_IDS).includes(p.id));
  return (
    <div className="space-y-3">
      {contextBefore ? (
        <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">{contextBefore}</p>
      ) : (
        <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
          Escolha um perfil para mudar a leitura do feed. Cada perfil tem seu próprio conjunto de dados, feed de mercado e área de trabalho independente. Ao trocar, o conteúdo atual é arquivado automaticamente.
        </p>
      )}
      {header && <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">{header}</p>}
      <div className="flex flex-col gap-2">
        {profiles.map((profile) => {
          const isActive = active === profile.id;
          return (
            <button
              key={profile.id}
              type="button"
              onClick={() => onSelect(profile.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all cursor-pointer text-left ${
                isActive
                  ? 'border-[#3b82f6] bg-[#3b82f6]/5 dark:bg-[#3b82f6]/10'
                  : 'border-neutral-200 dark:border-[#414141] bg-white dark:bg-[#242424] hover:bg-neutral-50 dark:hover:bg-[#2e2e2e]'
              }`}
            >
              <div style={{ width: 32, height: 32, borderRadius: 9, background: profile.id === 'os1' ? '#000' : profile.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: profile.id === 'os1' ? '#fff' : profile.color, fontSize: 11, fontWeight: 900, letterSpacing: '-0.01em' }}>
                  {profile.logo}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[12px] font-semibold leading-tight ${isActive ? 'text-[#3b82f6]' : 'text-neutral-800 dark:text-neutral-100'}`}>{profile.label}</p>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-snug truncate mt-0.5">{profile.niche}</p>
              </div>
              {isActive && <CheckCircle size={14} className="text-[#3b82f6] flex-shrink-0" />}
            </button>
          );
        })}
      </div>
      {contextAfter ? (
        <p className="text-[11px] text-neutral-400 dark:text-neutral-500 leading-relaxed">{contextAfter}</p>
      ) : (
        <p className="text-[11px] text-neutral-400 dark:text-neutral-500 leading-relaxed">
          Ao escolher um perfil, o feed e a área de trabalho atualizam automaticamente. O conteúdo em andamento é salvo no histórico e pode ser retomado a qualquer momento.
        </p>
      )}
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
  onAutoArchive?: (cardTitle: string, sector: string, snapshot: { messages: Message[]; activeCard: IntelligenceCard | null; activeMode: MainKey | null }) => void;
  onWorkspaceCleared?: () => void;
  logoutPending?: boolean;
  onCancelLogout?: () => void;
  onConfirmLogout?: () => void;
  onMapOpen?: () => void;
  /** Abre o navegador fullscreen com a URL informada no bloco lançador. */
  onOpenBrowserUrl?: (url: string) => void;
  /** Abre o mapa fullscreen depois do raio escolhido no bloco lançador. */
  onOpenMapWithRadius?: (radiusKm: number) => void;
  activeDepartment?: DepartmentId;
  onSelectDepartment?: (id: DepartmentId) => void;
  onSelectSector?: (id: string) => void;
  onDeleteSessions?: (ids: string[]) => void;
  codifyScope?: CodifyScope | null;
  windowWidth?: number;
}

export function ChatDesktop({ wide, onHome, homeTitle, onSector, onBrowser, onMapOpen, onOpenBrowserUrl, onOpenMapWithRadius, activeDepartment, onSelectDepartment, onSelectSector, onDeleteSessions, activeSector, userRole, workspaceContext, dark, onToggleTheme, onShowHistory, chatHistoryOpen, archivedSessions, onSelectHistorySession, onArchive, onAutoArchive, onWorkspaceCleared, logoutPending, onCancelLogout, onConfirmLogout, codifyScope, windowWidth }: ChatDesktopProps) {
  const btnCls = "cursor-pointer text-neutral-500 dark:text-neutral-300 p-2 rounded-full bg-[#EFEFF1] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_4px_10px_-1px_rgba(0,0,0,0.22),0_1px_3px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.6)] dark:shadow-[0_4px_10px_-1px_rgba(0,0,0,0.55),0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.04)] hover:bg-[#E3E4E6] dark:hover:bg-[#353535] hover:text-neutral-800 dark:hover:text-white transition-all duration-200 hover:scale-105 active:scale-90";
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
  const { rightPx, widthPx } = getDesktopChatLayout(ww, !!wide);
  return (
    <div
      ref={wrapperRef}
      style={{
        width: wide ? 'calc(50vw - 20px)' : `${widthPx}px`,
        top: `${SPLIT_FRAME_TOP_PX + SPLIT_FRAME_TOP_EXTRA_PX}px`,
        right: `${rightPx}px`,
        transition: 'right 500ms cubic-bezier(0.25,0.1,0.25,1), width 500ms cubic-bezier(0.25,0.1,0.25,1)',
      }}
      className="fixed bottom-5 z-[40] hidden lg:flex flex-col bg-[#EDEEF0] dark:bg-[#323232] border-[0.5px] border-neutral-100 dark:border-[#414141] rounded-2xl overflow-hidden shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)]"
    >
      {/* Header com ícones — ordem: Home / Plus / Search / Upload / History / Bell */}
      <div className="px-5 pt-5 flex-shrink-0">
      <div className="flex items-center justify-between gap-2 px-2 py-3 bg-[#EDEEF0] dark:bg-[#323232] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] rounded-xl shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)] transition-transform duration-200 hover:scale-[1.01]">
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
        <ChatBody workspaceContext={workspaceContext} activeSector={activeSector} userRole={userRole} onArchive={onArchive} onAutoArchive={onAutoArchive} onWorkspaceCleared={onWorkspaceCleared} chatHistoryOpen={chatHistoryOpen} archivedSessions={archivedSessions} onSelectHistorySession={onSelectHistorySession} onCloseHistory={onShowHistory} onDeleteSessions={onDeleteSessions} codifyScope={codifyScope} onOpenBrowserUrl={onOpenBrowserUrl} onOpenMapWithRadius={onOpenMapWithRadius} activeDepartment={activeDepartment} onSelectDepartment={onSelectDepartment} onSelectSector={onSelectSector} logoutPending={logoutPending} onCancelLogout={onCancelLogout} onConfirmLogout={onConfirmLogout} />
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
  onHome, homeTitle, onSector, onBrowser, onOpenBrowserUrl, onOpenMapWithRadius, activeDepartment, onSelectDepartment, onSelectSector, onDeleteSessions, unreadCount,
  dark, onToggleTheme, onShowHistory, chatHistoryOpen, archivedSessions, onSelectHistorySession, onArchive, onAutoArchive, codifyScope,
  logoutPending, onCancelLogout, onConfirmLogout,
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
  /** Abre o navegador fullscreen com a URL informada no bloco lançador. */
  onOpenBrowserUrl?: (url: string) => void;
  /** Abre o mapa fullscreen depois do raio escolhido no bloco lançador. */
  onOpenMapWithRadius?: (radiusKm: number) => void;
  activeDepartment?: DepartmentId;
  onSelectDepartment?: (id: DepartmentId) => void;
  onSelectSector?: (id: string) => void;
  onDeleteSessions?: (ids: string[]) => void;
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
  onAutoArchive?: (cardTitle: string, sector: string, snapshot: { messages: Message[]; activeCard: IntelligenceCard | null; activeMode: MainKey | null }) => void;
  codifyScope?: CodifyScope | null;
  logoutPending?: boolean;
  onCancelLogout?: () => void;
  onConfirmLogout?: () => void;
}) {
  const btnCls = "cursor-pointer text-neutral-500 dark:text-neutral-300 p-2 rounded-full bg-[#EFEFF1] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_4px_10px_-1px_rgba(0,0,0,0.22),0_1px_3px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.6)] dark:shadow-[0_4px_10px_-1px_rgba(0,0,0,0.55),0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.04)] hover:bg-[#E3E4E6] dark:hover:bg-[#353535] hover:text-neutral-800 dark:hover:text-white transition-all duration-200 hover:scale-105 active:scale-90";
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed inset-0 z-[200] lg:hidden bg-[#EDEEF0] dark:bg-[#2b2b2b] flex flex-col"
        >
          {/* Header com ícones — ordem: Plus / Globe / Settings / Sun-Moon / Bell / X */}
          <div className="px-4 pt-4 pb-3 flex-shrink-0">
          <div className="flex items-center justify-between gap-2 px-3 py-3 bg-[#EDEEF0] dark:bg-[#323232] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] rounded-xl shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)]">
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
            <ChatBody workspaceContext={workspaceContext} activeSector={activeSector} userRole={userRole} onArchive={onArchive} onAutoArchive={onAutoArchive} chatHistoryOpen={chatHistoryOpen} archivedSessions={archivedSessions} onSelectHistorySession={onSelectHistorySession} onCloseHistory={onShowHistory} onDeleteSessions={onDeleteSessions} codifyScope={codifyScope} onOpenBrowserUrl={onOpenBrowserUrl} onOpenMapWithRadius={onOpenMapWithRadius} activeDepartment={activeDepartment} onSelectDepartment={onSelectDepartment} onSelectSector={onSelectSector} logoutPending={logoutPending} onCancelLogout={onCancelLogout} onConfirmLogout={onConfirmLogout} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
