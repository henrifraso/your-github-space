import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { apiFetch } from '../api';
import {
  X, Search, Zap, BookOpen, BarChart2, RefreshCw,
  Share2, ChevronRight, AlertTriangle, TrendingUp, Info, Shield,
  CheckSquare, Target, MessageSquare, LayoutList, Loader2,
  ExternalLink, Star, Wrench, Package, Handshake, BadgeDollarSign, Sparkles,
} from 'lucide-react';

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface IntelligenceCard {
  id: string;
  titulo: string;
  resumo: string;
  por_que_importa?: string;
  onde_afeta?: string;
  o_que_fazer?: string;
  dominio: string;
  area: string;
  dificuldade?: string;
  confianca: string;
  confianca_score: number;
  impacto: string;
  risco_erro: number;
  sinais_usados?: string[];
  gap_id?: string;
  tipo_card: string;
  urgencia: string;
  versoes?: Record<string, {
    titulo: string;
    o_que_aconteceu: string;
    por_que_importa: string;
    onde_afeta: string;
    o_que_fazer: string;
  }>;
  share_token?: string;
  publicado_em?: string;
  // Sintético = card mockado que não existe no backend. WorkspacePanel não chama API.
  _synthetic?: boolean;
}

type ActionType = 'pesquisar' | 'executar' | 'aprender' | 'simular' | 'regenerar' | 'estender';
type Dificuldade = 'muito_facil' | 'facil' | 'dificil' | 'muito_dificil';
type ExecutarTipo = 'campanha' | 'checklist' | 'mensagem' | 'plano' | 'simulacao' | 'tarefa';

export type WorkspaceIntent = 'utilizar' | 'perguntas' | 'exemplos' | 'compartilhar';

// Mapa intent → ação inicial no painel
const INTENT_TO_ACTION: Record<WorkspaceIntent, ActionType | null> = {
  utilizar:     'executar',   // mostra o picker de tipo (campanha, checklist, ...)
  perguntas:    'pesquisar',  // dispara a pesquisa (perguntas a investigar)
  exemplos:     'aprender',   // exemplos práticos
  compartilhar: null,         // só abre o painel
};

interface Shortcut {
  id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  url: string;
  url_label: string;
  _score: number;
  _rotulos: string[];
  patrocinado: boolean;
}

const DIFICULDADE_LABELS: Record<Dificuldade, string> = {
  muito_facil: 'Muito Fácil',
  facil: 'Fácil',
  dificil: 'Difícil',
  muito_dificil: 'Muito Difícil',
};

const URGENCIA_COLOR: Record<string, string> = {
  alta:  'bg-red-500/15 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
  media: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  baixa: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
};

const TIPO_ICON: Record<string, React.ReactNode> = {
  risco:        <AlertTriangle size={14} />,
  oportunidade: <TrendingUp size={14} />,
  alerta:       <AlertTriangle size={14} />,
  informacao:   <Info size={14} />,
};

// Cada chamada de ação gera um bloco que entra no histórico local da sessão.
type WorkspaceBlock = {
  id: string;
  cardId: string;
  mode: string;
  action: string;
  title: string;
  result: Record<string, unknown>;
  difficulty?: string;
  pinned?: boolean;
  createdAt: string;
};

const EXECUTAR_OPTIONS: { tipo: ExecutarTipo; label: string; icon: React.ReactNode }[] = [
  { tipo: 'campanha',  label: 'Campanha',    icon: <Target size={16} /> },
  { tipo: 'checklist', label: 'Checklist',   icon: <CheckSquare size={16} /> },
  { tipo: 'mensagem',  label: 'Mensagem',    icon: <MessageSquare size={16} /> },
  { tipo: 'plano',     label: 'Plano',       icon: <LayoutList size={16} /> },
  { tipo: 'simulacao', label: 'Simulação',   icon: <BarChart2 size={16} /> },
  { tipo: 'tarefa',    label: 'Tarefa',      icon: <CheckSquare size={16} /> },
];

// ── Componente principal ──────────────────────────────────────────────────────

export function WorkspacePanel({ card, onClose, initialIntent }: { card: IntelligenceCard; onClose: () => void; initialIntent?: WorkspaceIntent }) {
  const [dificuldade, setDificuldade]   = useState<Dificuldade>((card.dificuldade as Dificuldade) || 'facil');
  const [activeAction, setActiveAction] = useState<ActionType | null>(null);
  const [blocks, setBlocks]             = useState<WorkspaceBlock[]>([]);
  const [loading, setLoading]           = useState(false);
  const [executarStep, setExecutarStep] = useState<'choose' | 'result'>('choose');
  const [executarTipo, setExecutarTipo] = useState<ExecutarTipo>('checklist');
  const [shortcuts, setShortcuts]       = useState<Shortcut[]>([]);
  const scrollEndRef                    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    apiFetch<{ shortcuts?: Shortcut[] }>('/api/shortcuts/para-card', {
      method: 'POST',
      body: JSON.stringify({ card_id: card.id, limit: 5 }),
    })
      .then(data => { if (data?.shortcuts) setShortcuts(data.shortcuts); })
      .catch(() => {});
  }, [card.id]);

  // Conteúdo na dificuldade selecionada
  const v = card.versoes?.[dificuldade];
  const content = {
    titulo:           v?.titulo           || card.titulo,
    o_que_aconteceu:  v?.o_que_aconteceu  || card.resumo,
    por_que_importa:  v?.por_que_importa  || card.por_que_importa || '',
    onde_afeta:       v?.onde_afeta       || card.onde_afeta       || '',
    o_que_fazer:      v?.o_que_fazer      || card.o_que_fazer      || '',
  };

  const appendBlock = (action: ActionType, result: Record<string, unknown>, extra: Record<string, string>) => {
    const subtipo = extra.tipo || extra.cenario;
    const label = LABEL_BY_ACTION[action] || action;
    setBlocks(prev => [...prev, {
      id:         `blk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      cardId:     card.id,
      mode:       action,
      action,
      title:      subtipo ? `${label} · ${subtipo}` : label,
      result,
      difficulty: dificuldade,
      pinned:     false,
      createdAt:  new Date().toISOString(),
    }]);
  };

  const callApi = async (action: ActionType, extra: Record<string, string> = {}) => {
    setLoading(true);
    setActiveAction(action);
    // Card sintético (mock) — não chama API, gera bloco demonstrativo local.
    if (card._synthetic) {
      setTimeout(() => {
        appendBlock(action, {
          demo: true,
          mensagem: 'Este card é demonstrativo — quando a IA estiver conectada, este modo gerará a resposta real.',
          referencia: card.resumo || card.titulo,
        }, extra);
        setLoading(false);
      }, 350);
      return;
    }
    try {
      const data = await apiFetch<Record<string, unknown>>(`/api/workspace/${action}`, {
        method: 'POST',
        body: JSON.stringify({ card_id: card.id, ...extra }),
      });
      appendBlock(action, data, extra);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Não foi possível conectar ao servidor.';
      appendBlock(action, { erro: msg }, extra);
    } finally {
      setLoading(false);
    }
  };

  // Reservado pra próxima etapa (botão Fixar nos blocos).
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const togglePinBlock = (blockId: string) => {
    setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, pinned: !b.pinned } : b));
  };

  // Scroll suave pro último bloco quando algo novo é gerado.
  useEffect(() => {
    if (blocks.length === 0) return;
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [blocks.length]);

  const handleAction = (action: ActionType) => {
    if (action === 'executar') { setActiveAction('executar'); setExecutarStep('choose'); return; }
    if (action === 'regenerar') { callApi('regenerar'); return; }
    callApi(action);
  };

  const handleExecutar = (tipo: ExecutarTipo) => {
    setExecutarTipo(tipo);
    setExecutarStep('result');
    callApi('executar', { tipo });
  };

  // Pré-seleciona ação com base no intent que abriu o painel.
  // Para perguntas/exemplos: dispara a API automaticamente (backend tem fallback).
  // Para utilizar: deixa no step 'choose' para o usuário escolher o tipo.
  // Para compartilhar: não pré-seleciona nada.
  // Card sintético: skip auto-dispatch (evita 404 confuso na abertura).
  useEffect(() => {
    if (!initialIntent) return;
    const action = INTENT_TO_ACTION[initialIntent];
    if (!action) return;
    if (action === 'executar') {
      setActiveAction('executar');
      setExecutarStep('choose');
      return;
    }
    if (card._synthetic) return;
    handleAction(action);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialIntent, card.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.26, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed inset-0 z-[190] bg-[#f0f2f4] dark:bg-[#181818] flex flex-col overflow-hidden"
    >
      {/* ── Cabeçalho ─────────────────────────────────────────────── */}
      <div className="flex-shrink-0 px-5 sm:px-8 pt-5 pb-4 border-b border-neutral-200 dark:border-[#2e2e2e] flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${URGENCIA_COLOR[card.urgencia] || URGENCIA_COLOR.baixa}`}>
              {TIPO_ICON[card.tipo_card]} {card.urgencia?.toUpperCase()}
            </span>
            <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">{card.area}</span>
            <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-600">· Confiança {card.confianca}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 leading-snug">{content.titulo}</h2>
        </div>
        <button onClick={onClose} className="flex-shrink-0 p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-white/5 transition-all cursor-pointer">
          <X size={20} />
        </button>
      </div>

      {/* ── Corpo scrollável ──────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 sm:px-8 py-5 max-w-4xl mx-auto w-full space-y-5">

          {/* Seletor de dificuldade */}
          <div className="flex gap-1 p-1 bg-neutral-200 dark:bg-[#252525] rounded-xl w-fit">
            {(Object.keys(DIFICULDADE_LABELS) as Dificuldade[]).map(d => (
              <button key={d} onClick={() => setDificuldade(d)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${dificuldade === d ? 'bg-white dark:bg-[#333] text-neutral-900 dark:text-neutral-100 shadow-sm' : 'text-neutral-500 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}>
                {DIFICULDADE_LABELS[d]}
              </button>
            ))}
          </div>

          {/* Grid de campos do insight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InsightField label="O QUE ACONTECEU" value={content.o_que_aconteceu} />
            <InsightField label="POR QUE IMPORTA" value={content.por_que_importa} accent />
            <InsightField label="ONDE AFETA" value={content.onde_afeta} />
            <RiscoField risco={card.risco_erro} confianca={card.confianca_score} />
            <InsightField label="DOMÍNIO AFETADO" value={`${card.area} · ${card.dominio}`} mono />
            <InsightField label="AÇÃO RECOMENDADA" value={content.o_que_fazer} highlight />
          </div>

          {/* Barra de ações */}
          <div className="pt-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-3">Área de Decisão</p>

            {/* 3 modos principais — dominantes */}
            <div className="grid grid-cols-3 gap-2">
              {PRIMARY_MODES.map(m => (
                <ActionBtn key={m.action} {...m}
                  active={activeAction === m.action}
                  onClick={() => handleAction(m.action)} />
              ))}
            </div>

            {/* Outras ações — discretas */}
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-600">Outras ações</span>
              {SECONDARY_ACTIONS.map(a => (
                <button key={a.action} onClick={() => handleAction(a.action)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${activeAction === a.action
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-[#242424] text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-[#2e2e2e] hover:border-blue-300 dark:hover:border-blue-700 hover:text-neutral-800 dark:hover:text-neutral-200'}`}>
                  {a.icon}
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Seletor de tipo de Executar */}
          <AnimatePresence>
            {activeAction === 'executar' && executarStep === 'choose' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                className="bg-white dark:bg-[#242424] border border-neutral-200 dark:border-[#303030] rounded-2xl p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-500 mb-3">Escolha o que gerar</p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {EXECUTAR_OPTIONS.map(opt => (
                    <button key={opt.tipo} onClick={() => handleExecutar(opt.tipo)}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl bg-neutral-50 dark:bg-[#2a2a2a] border border-neutral-200 dark:border-[#353535] hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all cursor-pointer text-neutral-700 dark:text-neutral-300">
                      {opt.icon}
                      <span className="text-[11px] font-semibold">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Histórico de blocos gerados nesta sessão */}
          <AnimatePresence initial={false}>
            {blocks.map(block => (
              <motion.div key={block.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                className="bg-white dark:bg-[#242424] border border-neutral-200 dark:border-[#303030] rounded-2xl overflow-hidden">
                <div className="px-5 py-3 border-b border-neutral-100 dark:border-[#2e2e2e] flex items-center gap-2">
                  <ChevronRight size={14} className="text-neutral-400" />
                  <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 flex-1 truncate">
                    {block.title}
                  </p>
                  {block.difficulty && (
                    <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500">
                      {DIFICULDADE_LABELS[block.difficulty as Dificuldade] || block.difficulty}
                    </span>
                  )}
                  <span className="text-[10px] tabular-nums text-neutral-400 dark:text-neutral-600">
                    {new Date(block.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="px-5 py-4">
                  <ActionResult result={block.result} action={block.action as ActionType} />
                </div>
              </motion.div>
            ))}
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-3 px-5 py-4 bg-white dark:bg-[#242424] rounded-2xl border border-neutral-200 dark:border-[#303030]">
                <Loader2 size={16} className="animate-spin text-blue-500" />
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  Processando · {activeAction ? (LABEL_BY_ACTION[activeAction] || activeAction) : ''}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Seção de Atalhos */}
          {shortcuts.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-3">Atalhos para este insight</p>
              <div className="flex flex-col gap-2">
                {shortcuts.map(s => <ShortcutCard key={s.id} shortcut={s} />)}
              </div>
            </div>
          )}

          <div ref={scrollEndRef} className="h-8" />
        </div>
      </div>
    </motion.div>
  );
}

// ── Sub-componentes ───────────────────────────────────────────────────────────

function InsightField({ label, value, accent, mono, highlight }: {
  label: string; value?: string; accent?: boolean; mono?: boolean; highlight?: boolean;
}) {
  if (!value) return null;
  return (
    <div className={`p-4 rounded-2xl border ${highlight ? 'bg-blue-50 dark:bg-blue-900/15 border-blue-200 dark:border-blue-800' : 'bg-white dark:bg-[#242424] border-neutral-200 dark:border-[#2e2e2e]'}`}>
      <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-2">{label}</p>
      <p className={`text-sm leading-relaxed ${accent ? 'font-medium text-neutral-800 dark:text-neutral-200' : mono ? 'font-mono text-xs text-neutral-600 dark:text-neutral-400' : 'text-neutral-700 dark:text-neutral-300'}`}>{value}</p>
    </div>
  );
}

function RiscoField({ risco, confianca }: { risco: number; confianca: number }) {
  const pct    = Math.round(risco * 100);
  const color  = risco > 0.5 ? 'text-red-500' : risco > 0.3 ? 'text-amber-500' : 'text-emerald-500';
  const barBg  = risco > 0.5 ? 'bg-red-400' : risco > 0.3 ? 'bg-amber-400' : 'bg-emerald-400';
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-[#242424] border border-neutral-200 dark:border-[#2e2e2e]">
      <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-2">RISCO DE INTERPRETAÇÃO</p>
      <div className="flex items-end gap-3 mb-2">
        <span className={`text-2xl font-bold tabular-nums ${color}`}>{pct}%</span>
        <span className="text-xs text-neutral-400 dark:text-neutral-600 mb-1">risco · {Math.round(confianca * 100)}% confiança</span>
      </div>
      <div className="h-1.5 bg-neutral-100 dark:bg-[#333] rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${barBg}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ActionBtn({ action, label, icon, active, onClick }: {
  action: string; label: string; icon: React.ReactNode; active?: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick}
      className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl text-[11px] font-semibold transition-all cursor-pointer border ${active ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white dark:bg-[#242424] text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-[#2e2e2e] hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}>
      {icon}
      {label}
    </button>
  );
}

export function ActionResult({ result, action }: { result: Record<string, unknown>; action: string | null }) {
  if (result.erro) return <p className="text-sm text-red-500">{String(result.erro)}</p>;
  if (result.demo) return (
    <div className="space-y-2">
      <p className="text-sm text-neutral-700 dark:text-neutral-300">{String(result.mensagem)}</p>
      {result.referencia ? (
        <p className="text-xs text-neutral-500 italic border-l-2 border-neutral-200 dark:border-[#3a3a3a] pl-3">{String(result.referencia)}</p>
      ) : null}
    </div>
  );

  // Mensagem pronta (sub: mensagem) — bloco de texto monoespaço pra copiar/colar.
  if (typeof result.texto_mensagem === 'string') {
    return (
      <pre className="whitespace-pre-wrap font-sans text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
        {result.texto_mensagem}
      </pre>
    );
  }

  // Conteúdo livre em parágrafos (comparar, risco, oportunidade, etc.)
  if (Array.isArray(result.paragrafos)) {
    return (
      <div className="space-y-2">
        {(result.paragrafos as string[]).map((p, i) => (
          <p key={i} className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">{p}</p>
        ))}
      </div>
    );
  }

  if (action === 'pesquisar') return <PesquisarResult r={result} />;
  if (action === 'executar')  return <ExecutarResult  r={result} />;
  if (action === 'aprender')  return <AprenderResult  r={result} />;
  if (action === 'simular')   return <SimularResult   r={result} />;
  if (action === 'regenerar') return <RegenerarResult r={result} />;
  if (action === 'estender')  return <EstenderResult  r={result} />;
  return <pre className="text-xs text-neutral-500 whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>;
}

function PesquisarResult({ r }: { r: Record<string, unknown> }) {
  return (
    <div className="space-y-4">
      {(r.pontos_chave as string[] | undefined)?.length ? (
        <Section title="Pontos-Chave">
          {(r.pontos_chave as string[]).map((p, i) => <BulletItem key={i}>{p}</BulletItem>)}
        </Section>
      ) : null}
      {r.contexto_setorial ? <Section title="Contexto Setorial"><p className="text-sm text-neutral-700 dark:text-neutral-300">{String(r.contexto_setorial)}</p></Section> : null}
      {(r.perguntas_a_investigar as string[] | undefined)?.length ? (
        <Section title="Perguntas a Investigar">
          {(r.perguntas_a_investigar as string[]).map((q, i) => <BulletItem key={i}>{q}</BulletItem>)}
        </Section>
      ) : null}
    </div>
  );
}

function ExecutarResult({ r }: { r: Record<string, unknown> }) {
  if (r.itens) return (
    <Section title="Checklist">
      {(r.itens as Record<string, string>[]).map((item, i) => (
        <div key={i} className="flex items-start gap-3 py-2 border-b border-neutral-100 dark:border-[#2e2e2e] last:border-0">
          <CheckSquare size={14} className="mt-0.5 text-neutral-400 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{item.tarefa}</p>
            <p className="text-xs text-neutral-500">{item.responsavel} · {item.prazo} · {item.prioridade}</p>
          </div>
        </div>
      ))}
    </Section>
  );
  // Generic fallback for other tipos
  return <JsonResult r={r} />;
}

function AprenderResult({ r }: { r: Record<string, unknown> }) {
  return (
    <div className="space-y-4">
      {r.conceito ? <Section title="Conceito"><p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">{String(r.conceito)}</p></Section> : null}
      {r.por_que_importa_para_negocios ? <Section title="Por que importa"><p className="text-sm text-neutral-700 dark:text-neutral-300">{String(r.por_que_importa_para_negocios)}</p></Section> : null}
      {(r.exemplos_praticos as string[] | undefined)?.length ? (
        <Section title="Exemplos Práticos">
          {(r.exemplos_praticos as string[]).map((e, i) => <BulletItem key={i}>{e}</BulletItem>)}
        </Section>
      ) : null}
    </div>
  );
}

function SimularResult({ r }: { r: Record<string, unknown> }) {
  const cenarios = (r.cenarios as Record<string, unknown>[] | undefined) || [];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {cenarios.map((c, i) => (
          <div key={i} className={`p-3 rounded-xl border ${i === 0 ? 'border-emerald-200 dark:border-emerald-900' : i === 2 ? 'border-red-200 dark:border-red-900' : 'border-neutral-200 dark:border-[#303030]'}`}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">{String(c.nome)}</p>
            <p className="text-xs text-neutral-700 dark:text-neutral-300 mb-1"><span className="font-medium">30d:</span> {String(c.resultado_30d)}</p>
            <p className="text-xs text-neutral-700 dark:text-neutral-300"><span className="font-medium">90d:</span> {String(c.resultado_90d)}</p>
          </div>
        ))}
      </div>
      {r.recomendacao ? <p className="text-sm text-neutral-700 dark:text-neutral-300 border-t border-neutral-100 dark:border-[#2e2e2e] pt-3">{String(r.recomendacao)}</p> : null}
    </div>
  );
}

function RegenerarResult({ r }: { r: Record<string, unknown> }) {
  const newCard = r.card_regenerado as Record<string, unknown> | undefined;
  if (!newCard) return <p className="text-sm text-neutral-500">Não foi possível regenerar o card.</p>;
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Novo card gerado</p>
      <p className="font-semibold text-neutral-800 dark:text-neutral-200">{String(newCard.titulo || '')}</p>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">{String(newCard.resumo || '')}</p>
    </div>
  );
}

function EstenderResult({ r }: { r: Record<string, unknown> }) {
  const cards = (r.cards_relacionados as Record<string, unknown>[] | undefined) || [];
  const adicionados = r.adicionados_ao_feed as number | undefined;
  const label = (r.fallback || !adicionados)
    ? `${cards.length} sugestões relacionadas geradas`
    : `${adicionados} cards adicionados ao feed`;
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-3">
        {label}
      </p>
      {cards.map((c, i) => (
        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-[#2a2a2a] border border-neutral-200 dark:border-[#303030]">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mt-0.5 flex-shrink-0">{String(c.area || '')}</span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 leading-snug">{String(c.titulo || '')}</p>
            <p className="text-xs text-neutral-500 mt-0.5">{String(c.resumo || '')}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Primitivos de layout ──────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-2">{title}</p>
      {children}
    </div>
  );
}

function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 py-1">
      <span className="w-1 h-1 rounded-full bg-neutral-400 mt-2 flex-shrink-0" />
      <p className="text-sm text-neutral-700 dark:text-neutral-300">{children}</p>
    </div>
  );
}

function JsonResult({ r }: { r: Record<string, unknown> }) {
  return (
    <div className="space-y-3">
      {Object.entries(r).filter(([k]) => k !== 'tipo').map(([k, v]) => (
        <div key={k}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">{k.replace(/_/g, ' ')}</p>
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            {Array.isArray(v) ? v.join(' · ') : String(v)}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Atalhos ──────────────────────────────────────────────────────────────────

const ROTULO_CONFIG: Record<string, { label: string; className: string }> = {
  melhor_escolha: { label: 'Melhor escolha', className: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800' },
  boa_alternativa: { label: 'Boa alternativa', className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
  parceiro_os1: { label: 'Parceiro OS¹', className: 'bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800' },
  patrocinado: { label: 'Patrocinado', className: 'bg-amber-500/10 text-amber-700 dark:text-amber-500 border-amber-200 dark:border-amber-800' },
};

const TIPO_ICON_MAP: Record<string, React.ReactNode> = {
  acao_nativa:          <Sparkles size={14} className="text-blue-500" />,
  ferramenta_externa:   <Wrench    size={14} className="text-neutral-500" />,
  fornecedor:           <Package   size={14} className="text-orange-500" />,
  parceiro_patrocinado: <Handshake size={14} className="text-violet-500" />,
  servico_recomendado:  <Star      size={14} className="text-amber-500" />,
};

function ShortcutCard({ shortcut: s }: { shortcut: Shortcut }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-[#242424] border border-neutral-200 dark:border-[#2e2e2e] hover:border-neutral-300 dark:hover:border-[#3a3a3a] transition-colors">
      {/* Ícone do tipo */}
      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-neutral-100 dark:bg-[#2e2e2e] flex items-center justify-center mt-0.5">
        {TIPO_ICON_MAP[s.tipo] || <Wrench size={14} className="text-neutral-400" />}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">{s.titulo}</p>
          {s.url && (
            <a href={s.url} target="_blank" rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer whitespace-nowrap">
              {s.url_label} <ExternalLink size={11} />
            </a>
          )}
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-500 leading-relaxed mb-2">{s.descricao}</p>
        {s._rotulos?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {s._rotulos.map(r => {
              const cfg = ROTULO_CONFIG[r];
              if (!cfg) return null;
              return (
                <span key={r} className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.className}`}>
                  {r === 'patrocinado' && <BadgeDollarSign size={10} className="mr-1" />}
                  {cfg.label}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Configuração dos modos de ação ────────────────────────────────────────────

// Modos principais — UI dominante. Cada um chama o endpoint já existente.
const PRIMARY_MODES: { action: ActionType; label: string; icon: React.ReactNode }[] = [
  { action: 'pesquisar', label: 'Entender', icon: <Search size={16} /> },
  { action: 'executar',  label: 'Executar', icon: <Zap size={16} /> },
  { action: 'aprender',  label: 'Aprender', icon: <BookOpen size={16} /> },
];

// Ações secundárias — chips discretos abaixo.
const SECONDARY_ACTIONS: { action: ActionType; label: string; icon: React.ReactNode }[] = [
  { action: 'simular',   label: 'Simular',   icon: <BarChart2 size={13} /> },
  { action: 'regenerar', label: 'Regenerar', icon: <RefreshCw size={13} /> },
  { action: 'estender',  label: 'Estender',  icon: <Share2 size={13} /> },
];

// Label amigável usada no título do bloco e no estado de loading.
const LABEL_BY_ACTION: Record<string, string> = {
  pesquisar: 'Entender',
  executar:  'Executar',
  aprender:  'Aprender',
  simular:   'Simular',
  regenerar: 'Regenerar',
  estender:  'Estender',
};
