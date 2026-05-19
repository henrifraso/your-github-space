import React, { useState, useEffect } from 'react';
import { Rocket, MessageCircle, Share2, Check, Lightbulb, ChevronDown, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─── PEP Item Row ─────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, string> = {
  missao: '☐', dado: '📊', referencia: '📎',
  ferramenta: '🔧', acao: '⚡', parceria: '🤝',
};

const ICON_DONE = '✅';

export function PEPItemRow({
  item, stepIndex, onCheck,
}: {
  item: { tipo: string; texto: string; icone?: string; acao?: string };
  stepIndex?: number;
  onCheck?: (pontos: number) => void;
}) {
  const [checked, setChecked]     = useState(false);
  const [expanded, setExpanded]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [content, setContent]     = useState('');

  const hasAction = !!item.acao;

  function handleCheck(e: React.MouseEvent) {
    e.stopPropagation();
    const next = !checked;
    setChecked(next);
    if (next && onCheck) onCheck(5);
  }

  async function handleExpand(e: React.MouseEvent) {
    e.stopPropagation();
    if (expanded) { setExpanded(false); return; }
    setExpanded(true);
    if (content) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setContent('Conteúdo sendo gerado pelo sistema. Disponível com dados reais do cliente.');
  }

  // ── Missão (checkbox) ──
  if (item.tipo === 'missao') return (
    <div className="pt-3 pb-1">
      <button onClick={handleCheck} className="flex items-start gap-2.5 w-full text-left cursor-pointer group">
        <span className="text-base flex-shrink-0 mt-0.5 transition-all duration-200">
          {checked ? ICON_DONE : <span className="text-[#3b82f6]">☐</span>}
        </span>
        <p className={`text-sm font-semibold leading-snug transition-all duration-200 ${checked ? 'line-through text-neutral-400' : 'text-neutral-800 dark:text-neutral-100'}`}>
          {item.texto}
        </p>
      </button>
    </div>
  );

  // ── Passo numerado (Prática) ──
  if (item.tipo === 'passo') return (
    <div className="flex items-start gap-3 py-2.5 border-b border-neutral-100 dark:border-[#414141] last:border-0">
      <div className="w-5 h-5 rounded-full bg-[#3b82f6]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-[10px] font-bold text-[#3b82f6]">{stepIndex ?? ''}</span>
      </div>
      <p className="text-sm text-neutral-700 dark:text-neutral-200 leading-snug">{item.texto}</p>
    </div>
  );

  // ── Dado (estático) ──
  if (item.tipo === 'dado') return (
    <div className="flex items-start gap-2 py-1 pl-4">
      <span className="text-xs flex-shrink-0 mt-0.5">📊</span>
      <p className="text-xs text-neutral-500 dark:text-neutral-300 italic leading-relaxed">{item.texto}</p>
    </div>
  );

  // ── Parágrafo narrativo (Estratégia) ──
  if (item.tipo === 'paragrafo') return (
    <div className="py-2.5 border-b border-neutral-100 dark:border-[#414141] last:border-0">
      <p className="text-sm text-neutral-700 dark:text-neutral-200 leading-relaxed">{item.texto}</p>
    </div>
  );

  // ── Itens com ação expansível (referencia, ferramenta, acao, parceria) ──
  const colorMap: Record<string, string> = {
    ferramenta: 'text-[#3b82f6]',
    acao:       'text-[#7c3aed]',
    parceria:   'text-[#0891b2]',
    referencia: 'text-neutral-500',
  };
  const textColor = colorMap[item.tipo] ?? 'text-neutral-500';
  const icon = item.icone ?? ICON_MAP[item.tipo] ?? '•';

  return (
    <div className="py-1 pl-4">
      <div className="flex items-start gap-2">
        <span className="text-xs flex-shrink-0 mt-0.5">{icon}</span>
        <div className="flex-1 min-w-0">
          <span className={`text-xs italic leading-relaxed ${textColor}`}>{item.texto}</span>
          {hasAction && (
            <button
              onClick={handleExpand}
              className={`ml-1.5 text-xs font-semibold underline underline-offset-2 cursor-pointer inline-flex items-center gap-0.5 ${textColor}`}
            >
              {item.acao}
              <ChevronDown size={10} className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
            className="overflow-hidden ml-5 mt-2">
            {loading ? (
              <div className="flex items-center gap-2 py-2">
                <div className="w-1 h-1 rounded-full bg-[#3b82f6] animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1 h-1 rounded-full bg-[#3b82f6] animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1 h-1 rounded-full bg-[#3b82f6] animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-xs text-neutral-400">Gerando...</span>
              </div>
            ) : (
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed bg-neutral-50 dark:bg-[#353535] rounded-xl p-3 border border-neutral-100 dark:border-[#414141]">
                {content}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FeedSection({ title, icon, count, badge, children }: {
  title: string; icon: React.ReactNode; count?: string; badge?: string; children: React.ReactNode;
}) {
  return (
    <section className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2.5 px-1 pt-1 sm:pt-2">
        <span className="text-neutral-400">{icon}</span>
        <h3 className="text-base sm:text-lg font-semibold text-neutral-800 dark:text-neutral-100">{title}</h3>
        {badge && <span className="ml-auto text-[11px] sm:text-xs font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-[#353535] px-2 sm:px-2.5 py-0.5 rounded-full">{badge}</span>}
        {count && !badge && <span className="ml-auto text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400">{count}</span>}
      </div>
      <div className="space-y-2.5 sm:space-y-3">
        {children}
      </div>
    </section>
  );
}

const UTILIZAR_STEPS  = ['Iniciando...', 'Gerando plano...', 'Estratégia...', 'Preparando...'];
const PERGUNTAS_STEPS = ['Analisando...', 'Buscando...', 'Montando...', 'Finalizando...'];
const IDEIAS_STEPS    = ['Pensando...', 'Conectando...', 'Criando...', 'Finalizando...'];
const SHARE_STEPS     = ['Preparando...', 'Gerando link...', 'Pronto!'];

const PERGUNTAS_OPCOES = [
  { key: 'o-que', label: 'O que fazer', color: '#64748b' },
  { key: 'como',  label: 'Como fazer',  color: '#64748b' },
  { key: 'onde',  label: 'Onde fazer',  color: '#64748b' },
];

const IDEIAS_OPCOES = [
  { key: 'simples',   label: 'Exemplo simples',   color: '#64748b' },
  { key: 'elaborada', label: 'Exemplo elaborado', color: '#64748b' },
];

const DOT_COLORS = ['#3b82f6', '#60a5fa', '#93c5fd'];

type UtilStatus  = 'idle' | 'loading' | 'done';
type PergStatus  = 'idle' | 'picking' | 'loading' | 'done';
type IdeiaStatus = 'idle' | 'picking' | 'loading' | 'done';
type ShareStatus = 'idle' | 'loading' | 'done';

function AnimatedDots() {
  return (
    <div className="flex gap-[3px] items-center flex-shrink-0">
      {DOT_COLORS.map((color, i) => (
        <motion.span key={i} className="w-1 h-1 rounded-full block"
          style={{ backgroundColor: color }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.18 }} />
      ))}
    </div>
  );
}

type WorkspaceIntent = 'utilizar' | 'perguntas' | 'exemplos' | 'compartilhar';

export function FeedCard({ onClick, onFullscreen, containerType, onUtilizar, onWorkspaceIntent, locked, children }: {
  onClick?: () => void;
  onFullscreen?: () => void;
  containerType?: string;
  onUtilizar?: (containerType: string, selected: boolean) => void;
  onWorkspaceIntent?: (intent: WorkspaceIntent) => void;
  locked?: boolean;
  children: React.ReactNode;
}) {
  const [utilStatus,   setUtilStatus]   = useState<UtilStatus>('idle');
  const [utilStep,     setUtilStep]     = useState(0);
  const [likes,        setLikes]        = useState(() => Math.floor(Math.random() * 180) + 20);

  const [pergStatus,   setPergStatus]   = useState<PergStatus>('idle');
  const [pergStep,     setPergStep]     = useState(0);
  const [pergChoice,   setPergChoice]   = useState('');

  const [ideiaStatus,  setIdeiaStatus]  = useState<IdeiaStatus>('idle');
  const [ideiaStep,    setIdeiaStep]    = useState(0);
  const [ideiaChoice,  setIdeiaChoice]  = useState('');

  const [shareStatus,  setShareStatus]  = useState<ShareStatus>('idle');
  const [shareStep,    setShareStep]    = useState(0);

  useEffect(() => {
    if (utilStatus !== 'loading') return;
    setUtilStep(0); let i = 0;
    const iv = setInterval(() => {
      i++;
      if (i < UTILIZAR_STEPS.length) setUtilStep(i);
      else {
        clearInterval(iv);
        setUtilStatus('done');
        setLikes(n => n + 1);
        if (containerType && onUtilizar) onUtilizar(containerType, true);
      }
    }, 600);
    return () => clearInterval(iv);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [utilStatus]);

  useEffect(() => {
    if (pergStatus !== 'loading') return;
    setPergStep(0); let i = 0;
    const iv = setInterval(() => {
      i++;
      if (i < PERGUNTAS_STEPS.length) setPergStep(i);
      else { clearInterval(iv); setPergStatus('done'); }
    }, 600);
    return () => clearInterval(iv);
  }, [pergStatus]);

  useEffect(() => {
    if (ideiaStatus !== 'loading') return;
    setIdeiaStep(0); let i = 0;
    const iv = setInterval(() => {
      i++;
      if (i < IDEIAS_STEPS.length) setIdeiaStep(i);
      else { clearInterval(iv); setIdeiaStatus('done'); }
    }, 600);
    return () => clearInterval(iv);
  }, [ideiaStatus]);

  useEffect(() => {
    if (shareStatus !== 'loading') return;
    setShareStep(0); let i = 0;
    const iv = setInterval(() => {
      i++;
      if (i < SHARE_STEPS.length) setShareStep(i);
      else { clearInterval(iv); setShareStatus('done'); }
    }, 500);
    return () => clearInterval(iv);
  }, [shareStatus]);

  function handleLike(e: React.MouseEvent) {
    e.stopPropagation();
    if (onWorkspaceIntent) { onWorkspaceIntent('utilizar'); return; }
    if (utilStatus === 'loading') return;
    if (utilStatus === 'done') {
      setUtilStatus('idle');
      setLikes(n => n - 1);
      if (containerType && onUtilizar) onUtilizar(containerType, false);
      return;
    }
    setUtilStatus('loading');
  }

  function handlePerguntas(e: React.MouseEvent) {
    e.stopPropagation();
    if (onWorkspaceIntent) { onWorkspaceIntent('perguntas'); return; }
    if (pergStatus === 'idle') setPergStatus('picking');
    else if (pergStatus === 'picking') setPergStatus('idle');
  }

  function handlePergChoice(e: React.MouseEvent, label: string) {
    e.stopPropagation();
    setPergChoice(label);
    setPergStatus('loading');
  }

  function handleExemplos(e: React.MouseEvent) {
    e.stopPropagation();
    if (onWorkspaceIntent) { onWorkspaceIntent('exemplos'); return; }
    if (ideiaStatus === 'idle') setIdeiaStatus('picking');
    else if (ideiaStatus === 'picking') setIdeiaStatus('idle');
  }

  function handleIdeiaChoice(e: React.MouseEvent, label: string) {
    e.stopPropagation();
    setIdeiaChoice(label);
    setIdeiaStatus('loading');
  }

  function handleShare(e: React.MouseEvent) {
    e.stopPropagation();
    // Mantém o comportamento de share/copy e dispara o workspace em paralelo.
    if (navigator.share) navigator.share({ title: 'Omni', text: 'Confira essa informação no Omni' }).catch(() => {});
    else navigator.clipboard.writeText(window.location.href).catch(() => {});
    if (onWorkspaceIntent) { onWorkspaceIntent('compartilhar'); return; }
    if (shareStatus !== 'idle') return;
    setShareStatus('loading');
  }

  // Cards locked não recebem callbacks de workspace — escondem os 4 botões para
  // não parecerem clicáveis (estão bloqueados de propósito: dados antigos/containers PEP).
  const showActionButtons = !locked;

  const cardContent = (
    <>
      <div className="bg-neutral-200/50 dark:bg-[#2b2b2b] border border-neutral-200 dark:border-[#3d3d3d] shadow-[0_3px_10px_rgba(0,0,0,0.12)] dark:shadow-[0_3px_10px_rgba(0,0,0,0.45)] rounded-xl p-3 sm:p-4">{children}</div>
      {showActionButtons && (
      <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-neutral-100 dark:border-[#414141] grid grid-cols-2 lg:grid-cols-4 gap-1.5">

        {/* ── Utilizar ── */}
        <div className="bg-neutral-200/50 dark:bg-[#2b2b2b] border border-neutral-200 dark:border-[#3d3d3d] shadow-[0_3px_10px_rgba(0,0,0,0.12)] dark:shadow-[0_3px_10px_rgba(0,0,0,0.45)] rounded-xl overflow-hidden">
        <button onClick={handleLike} disabled={utilStatus === 'loading'} className="w-full h-9 sm:h-10 flex items-center justify-center gap-1 overflow-hidden cursor-pointer hover:bg-neutral-200 dark:hover:bg-[#353535] transition-colors duration-150">
          <AnimatePresence mode="wait">
            {utilStatus === 'idle' && (
              <motion.div key="u-idle" className="flex items-center gap-1 sm:gap-2"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}>
                <Rocket size={14} className="lg:hidden text-neutral-400 dark:text-white flex-shrink-0" />
                <Rocket size={20} className="hidden lg:block text-neutral-400 dark:text-white flex-shrink-0" />
                <span className="text-[10px] lg:text-sm text-neutral-500 dark:text-white font-medium whitespace-nowrap">Utilizar</span>
                <span className="hidden lg:inline text-sm text-neutral-500 dark:text-white">· {likes}</span>
              </motion.div>
            )}
            {utilStatus === 'loading' && (
              <motion.div key="u-load" className="flex items-center gap-1.5 sm:gap-2 min-w-0"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <AnimatedDots />
                <AnimatePresence mode="wait">
                  <motion.span key={utilStep} className="hidden lg:inline text-sm text-[#3b82f6] font-medium truncate"
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}>
                    {UTILIZAR_STEPS[utilStep]}
                  </motion.span>
                </AnimatePresence>
              </motion.div>
            )}
            {utilStatus === 'done' && (
              <motion.div key="u-done" className="flex items-center gap-1.5 sm:gap-2"
                initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}>
                <Check size={16} className="lg:hidden text-[#3b82f6]" strokeWidth={2.5} />
                <Check size={20} className="hidden lg:block text-[#3b82f6]" strokeWidth={2.5} />
                <span className="text-[10px] lg:text-sm text-[#3b82f6] font-semibold whitespace-nowrap">Implementado</span>
                <span className="hidden lg:inline text-sm text-neutral-500 dark:text-white">· {likes}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
        </div>

        {/* ── Perguntas ── */}
        <div className="bg-neutral-200/50 dark:bg-[#2b2b2b] border border-neutral-200 dark:border-[#3d3d3d] shadow-[0_3px_10px_rgba(0,0,0,0.12)] dark:shadow-[0_3px_10px_rgba(0,0,0,0.45)] rounded-xl overflow-hidden">
        <button onClick={handlePerguntas} disabled={pergStatus === 'loading'} className="w-full h-9 sm:h-10 flex items-center justify-center gap-1 overflow-hidden cursor-pointer hover:bg-neutral-200 dark:hover:bg-[#353535] transition-colors duration-150">
          <AnimatePresence mode="wait">
            {pergStatus === 'idle' && (
              <motion.div key="p-idle" className="flex items-center gap-1 sm:gap-2"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}>
                <MessageCircle size={14} className="lg:hidden text-neutral-400 dark:text-white flex-shrink-0" />
                <MessageCircle size={20} className="hidden lg:block text-neutral-400 dark:text-white flex-shrink-0" />
                <span className="text-[10px] lg:text-sm text-neutral-500 dark:text-white font-medium whitespace-nowrap">Perguntas</span>
              </motion.div>
            )}
            {pergStatus === 'picking' && (
              <motion.div key="p-pick" className="flex items-center gap-1 sm:gap-2"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}>
                <MessageCircle size={14} className="lg:hidden text-neutral-400 dark:text-neutral-300 flex-shrink-0" />
                <MessageCircle size={20} className="hidden lg:block text-neutral-400 dark:text-neutral-300 flex-shrink-0" />
                <span className="text-[10px] lg:text-sm text-neutral-500 dark:text-neutral-300 font-medium whitespace-nowrap">Perguntas</span>
              </motion.div>
            )}
            {pergStatus === 'loading' && (
              <motion.div key="p-load" className="flex items-center gap-1.5 sm:gap-2 min-w-0"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <AnimatedDots />
                <AnimatePresence mode="wait">
                  <motion.span key={pergStep} className="hidden lg:inline text-sm text-neutral-500 dark:text-neutral-300 font-medium truncate"
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}>
                    {PERGUNTAS_STEPS[pergStep]}
                  </motion.span>
                </AnimatePresence>
              </motion.div>
            )}
            {pergStatus === 'done' && (
              <motion.div key="p-done" className="flex items-center gap-1.5 sm:gap-2"
                initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}>
                <Check size={16} className="lg:hidden text-[#f97316]" strokeWidth={2.5} />
                <Check size={20} className="hidden lg:block text-[#f97316]" strokeWidth={2.5} />
                <span className="text-[10px] lg:text-sm text-[#f97316] font-semibold truncate whitespace-nowrap">{pergChoice}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
        </div>

        {/* ── Exemplos ── */}
        <div className="bg-neutral-200/50 dark:bg-[#2b2b2b] border border-neutral-200 dark:border-[#3d3d3d] shadow-[0_3px_10px_rgba(0,0,0,0.12)] dark:shadow-[0_3px_10px_rgba(0,0,0,0.45)] rounded-xl overflow-hidden">
        <button onClick={handleExemplos} disabled={ideiaStatus === 'loading'} className="w-full h-9 sm:h-10 flex items-center justify-center gap-1 overflow-hidden cursor-pointer hover:bg-neutral-200 dark:hover:bg-[#353535] transition-colors duration-150">
          <AnimatePresence mode="wait">
            {ideiaStatus === 'idle' && (
              <motion.div key="i-idle" className="flex items-center gap-1 sm:gap-2"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}>
                <Lightbulb size={14} className="lg:hidden text-neutral-400 dark:text-white flex-shrink-0" />
                <Lightbulb size={20} className="hidden lg:block text-neutral-400 dark:text-white flex-shrink-0" />
                <span className="text-[10px] lg:text-sm text-neutral-500 dark:text-white font-medium whitespace-nowrap">Exemplos</span>
              </motion.div>
            )}
            {ideiaStatus === 'picking' && (
              <motion.div key="i-pick" className="flex items-center gap-1 sm:gap-2"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}>
                <Lightbulb size={14} className="lg:hidden text-slate-500 dark:text-neutral-300 flex-shrink-0" />
                <Lightbulb size={20} className="hidden lg:block text-slate-500 dark:text-neutral-300 flex-shrink-0" />
                <span className="text-[10px] lg:text-sm text-slate-500 dark:text-neutral-300 font-medium whitespace-nowrap">Exemplos</span>
              </motion.div>
            )}
            {ideiaStatus === 'loading' && (
              <motion.div key="i-load" className="flex items-center gap-1.5 sm:gap-2 min-w-0"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <AnimatedDots />
                <AnimatePresence mode="wait">
                  <motion.span key={ideiaStep} className="hidden lg:inline text-sm text-slate-500 dark:text-neutral-300 font-medium truncate"
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}>
                    {IDEIAS_STEPS[ideiaStep]}
                  </motion.span>
                </AnimatePresence>
              </motion.div>
            )}
            {ideiaStatus === 'done' && (
              <motion.div key="i-done" className="flex items-center gap-1.5 sm:gap-2"
                initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}>
                <Check size={16} className="lg:hidden text-[#f97316]" strokeWidth={2.5} />
                <Check size={20} className="hidden lg:block text-[#f97316]" strokeWidth={2.5} />
                <span className="text-[10px] lg:text-sm text-[#f97316] font-semibold truncate whitespace-nowrap">{ideiaChoice}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
        </div>

        {/* ── Compartilhar ── */}
        <div className="bg-neutral-200/50 dark:bg-[#2b2b2b] border border-neutral-200 dark:border-[#3d3d3d] shadow-[0_3px_10px_rgba(0,0,0,0.12)] dark:shadow-[0_3px_10px_rgba(0,0,0,0.45)] rounded-xl overflow-hidden">
        <button onClick={handleShare} disabled={shareStatus === 'loading'} className="w-full h-9 sm:h-10 flex items-center justify-center gap-1 overflow-hidden cursor-pointer hover:bg-neutral-200 dark:hover:bg-[#353535] transition-colors duration-150">
          <AnimatePresence mode="wait">
            {shareStatus === 'idle' && (
              <motion.div key="sh-idle" className="flex items-center gap-1 sm:gap-2"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}>
                <Share2 size={14} className="lg:hidden text-neutral-400 dark:text-white flex-shrink-0" />
                <Share2 size={20} className="hidden lg:block text-neutral-400 dark:text-white flex-shrink-0" />
                <span className="text-[10px] lg:text-sm text-neutral-500 dark:text-white font-medium whitespace-nowrap">Compartilhar</span>
              </motion.div>
            )}
            {shareStatus === 'loading' && (
              <motion.div key="sh-load" className="flex items-center gap-1.5 sm:gap-2 min-w-0"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <AnimatedDots />
              </motion.div>
            )}
            {shareStatus === 'done' && (
              <motion.div key="sh-done" className="flex items-center gap-1.5 sm:gap-2"
                initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}>
                <Check size={16} className="lg:hidden text-[#f97316]" strokeWidth={2.5} />
                <Check size={20} className="hidden lg:block text-[#f97316]" strokeWidth={2.5} />
                <span className="text-[10px] lg:text-sm text-[#f97316] font-semibold whitespace-nowrap">Compartilhado</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
        </div>

      </div>
      )}

      {/* ── Picker de Perguntas ── */}
      <AnimatePresence>
        {pergStatus === 'picking' && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: 6 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }} transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex gap-2">
              {PERGUNTAS_OPCOES.map((op, i) => (
                <motion.button key={op.key}
                  initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.06, duration: 0.2, ease: 'easeOut' }}
                  onClick={e => handlePergChoice(e, op.label)}
                  className="flex-1 text-[11px] sm:text-xs font-semibold border rounded-xl py-2.5 sm:py-2 transition-all duration-200 hover:opacity-80 active:scale-95 cursor-pointer text-neutral-600 dark:text-neutral-100 border-neutral-300 dark:border-neutral-500 bg-neutral-100 dark:bg-neutral-600/30">
                  {op.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Picker de Exemplos ── */}
      <AnimatePresence>
        {ideiaStatus === 'picking' && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: 6 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }} transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex gap-2">
              {IDEIAS_OPCOES.map((op, i) => (
                <motion.button key={op.key}
                  initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.06, duration: 0.2, ease: 'easeOut' }}
                  onClick={e => handleIdeiaChoice(e, op.label)}
                  className="flex-1 text-[11px] sm:text-xs font-semibold border rounded-xl py-2.5 sm:py-2 transition-all duration-200 hover:opacity-80 active:scale-95 cursor-pointer text-neutral-600 dark:text-neutral-100 border-neutral-300 dark:border-neutral-500 bg-neutral-100 dark:bg-neutral-600/30">
                  {op.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  function handleCardClick() {
    if (onFullscreen) { onFullscreen(); return; }
    if (onClick) onClick();
  }

  const isClickable = !locked && !!(onClick || onFullscreen);
  const cls = "relative w-full bg-[#f0f2f4] dark:bg-[#323232] rounded-2xl border shadow-[0_2px_12px_rgba(0,0,0,0.09)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)] px-4 py-4 sm:px-6 sm:py-5 text-left transition-all duration-200 " +
    (utilStatus === 'done' && containerType ? "border-[#3b82f6] ring-1 ring-[#3b82f6]/30 " : "border-neutral-100 dark:border-[#414141] ") +
    (locked ? "cursor-default hover:bg-[#e4e7ea] dark:hover:bg-[#353535] " : "") +
    (isClickable ? "hover:bg-[#e4e7ea] dark:hover:bg-[#353535] active:scale-[0.99] cursor-pointer" : "");

  return (
    <div onClick={isClickable ? handleCardClick : undefined} className={cls}
      role={isClickable ? 'button' : undefined} tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(); } : undefined}>
      {cardContent}
    </div>
  );
}
