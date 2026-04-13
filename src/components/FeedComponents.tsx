import React, { useState, useEffect } from 'react';
import { Rocket, MessageCircle, Share2, Check, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function FeedSection({ title, icon, count, badge, children }: {
  title: string; icon: React.ReactNode; count?: string; badge?: string; children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2 px-1 pt-2">
        <span className="text-[#8e8e8e]">{icon}</span>
        <h3 className="text-sm font-bold text-[#262626] dark:text-[#f0f0f0]">{title}</h3>
        {badge && <span className="ml-auto text-[10px] font-semibold text-[#8e8e8e] bg-[#f0f0f0] dark:bg-[#2a2a2a] px-2 py-0.5 rounded-full">{badge}</span>}
        {count && !badge && <span className="ml-auto text-[11px] text-[#8e8e8e]">{count}</span>}
      </div>
      {children}
    </section>
  );
}

const UTILIZAR_STEPS  = ['Iniciando...', 'Gerando plano...', 'Estratégia...', 'Preparando...'];
const PERGUNTAS_STEPS = ['Analisando...', 'Buscando...', 'Montando...', 'Finalizando...'];
const IDEIAS_STEPS    = ['Pensando...', 'Conectando...', 'Criando...', 'Finalizando...'];
const SHARE_STEPS     = ['Preparando...', 'Gerando link...', 'Pronto!'];

const PERGUNTAS_OPCOES = [
  { key: 'o-que', label: 'O que fazer', color: '#0077cc' },
  { key: 'como',  label: 'Como fazer',  color: '#0095f6' },
  { key: 'onde',  label: 'Onde fazer',  color: '#38bdf8' },
];

const IDEIAS_OPCOES = [
  { key: 'simples',      label: 'Ideia simples',      color: '#7c3aed' },
  { key: 'elaborada',    label: 'Ideia elaborada',    color: '#a855f7' },
];

const DOT_COLORS = ['#0077cc', '#0095f6', '#38bdf8'];

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

export function FeedCard({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) {
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
      else { clearInterval(iv); setUtilStatus('done'); setLikes(n => n + 1); }
    }, 600);
    return () => clearInterval(iv);
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
    if (utilStatus !== 'idle') return;
    setUtilStatus('loading');
  }

  function handlePerguntas(e: React.MouseEvent) {
    e.stopPropagation();
    if (pergStatus === 'idle') setPergStatus('picking');
    else if (pergStatus === 'picking') setPergStatus('idle');
  }

  function handlePergChoice(e: React.MouseEvent, label: string) {
    e.stopPropagation();
    setPergChoice(label);
    setPergStatus('loading');
  }

  function handleIdeias(e: React.MouseEvent) {
    e.stopPropagation();
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
    if (shareStatus !== 'idle') return;
    setShareStatus('loading');
    if (navigator.share) navigator.share({ title: 'Omni', text: 'Confira essa informação no Omni' }).catch(() => {});
    else navigator.clipboard.writeText(window.location.href).catch(() => {});
  }

  const cardContent = (
    <>
      <div>{children}</div>
      <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-[#f0f0f0] dark:border-[#2a2a2a] grid grid-cols-4 items-center min-h-[28px] sm:min-h-[40px]">

        {/* ── Utilizar ── */}
        <button onClick={handleLike} disabled={utilStatus === 'loading'} className="flex items-center justify-start gap-1.5 sm:gap-2 overflow-hidden w-full">
          <AnimatePresence mode="wait">
            {utilStatus === 'idle' && (
              <motion.div key="u-idle" className="flex items-center gap-1.5 sm:gap-2"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}>
                <Rocket size={14} className="sm:hidden" stroke="#8e8e8e" />
                <Rocket size={18} className="hidden sm:block" stroke="#8e8e8e" />
                <span className="text-[11px] sm:text-sm text-[#8e8e8e] font-medium">Utilizar</span>
                <span className="hidden sm:inline text-sm text-[#8e8e8e]">· {likes}</span>
              </motion.div>
            )}
            {utilStatus === 'loading' && (
              <motion.div key="u-load" className="flex items-center gap-1.5 sm:gap-2 min-w-0"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <AnimatedDots />
                <AnimatePresence mode="wait">
                  <motion.span key={utilStep} className="hidden sm:inline text-sm text-[#0095f6] font-medium truncate"
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
                <Check size={14} className="sm:hidden" stroke="#38bdf8" strokeWidth={2.5} />
                <Check size={18} className="hidden sm:block" stroke="#38bdf8" strokeWidth={2.5} />
                <span className="text-[11px] sm:text-sm text-[#38bdf8] font-semibold">Implementado</span>
                <span className="hidden sm:inline text-sm text-[#8e8e8e]">· {likes}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* ── Perguntas ── */}
        <button onClick={handlePerguntas} disabled={pergStatus === 'loading'} className="flex items-center justify-center gap-1.5 sm:gap-2 overflow-hidden w-full">
          <AnimatePresence mode="wait">
            {pergStatus === 'idle' && (
              <motion.div key="p-idle" className="flex items-center gap-1.5 sm:gap-2"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}>
                <MessageCircle size={14} className="sm:hidden" stroke="#8e8e8e" />
                <MessageCircle size={18} className="hidden sm:block" stroke="#8e8e8e" />
                <span className="text-[11px] sm:text-sm text-[#8e8e8e] font-medium">Perguntas</span>
              </motion.div>
            )}
            {pergStatus === 'picking' && (
              <motion.div key="p-pick" className="flex items-center gap-1.5 sm:gap-2"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}>
                <MessageCircle size={14} className="sm:hidden" stroke="#0095f6" fill="rgba(0,149,246,0.12)" />
                <MessageCircle size={18} className="hidden sm:block" stroke="#0095f6" fill="rgba(0,149,246,0.12)" />
                <span className="text-[11px] sm:text-sm text-[#0095f6] font-medium">Perguntas</span>
              </motion.div>
            )}
            {pergStatus === 'loading' && (
              <motion.div key="p-load" className="flex items-center gap-1.5 sm:gap-2 min-w-0"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <AnimatedDots />
                <AnimatePresence mode="wait">
                  <motion.span key={pergStep} className="hidden sm:inline text-sm text-[#0095f6] font-medium truncate"
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
                <Check size={14} className="sm:hidden" stroke="#f97316" strokeWidth={2.5} />
                <Check size={18} className="hidden sm:block" stroke="#f97316" strokeWidth={2.5} />
                <span className="text-[11px] sm:text-sm text-[#f97316] font-semibold truncate">{pergChoice}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* ── Ideias ── */}
        <button onClick={handleIdeias} disabled={ideiaStatus === 'loading'} className="flex items-center justify-center gap-1.5 sm:gap-2 overflow-hidden w-full">
          <AnimatePresence mode="wait">
            {ideiaStatus === 'idle' && (
              <motion.div key="i-idle" className="flex items-center gap-1.5 sm:gap-2"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}>
                <Lightbulb size={14} className="sm:hidden" stroke="#8e8e8e" />
                <Lightbulb size={18} className="hidden sm:block" stroke="#8e8e8e" />
                <span className="text-[11px] sm:text-sm text-[#8e8e8e] font-medium">Ideias</span>
              </motion.div>
            )}
            {ideiaStatus === 'picking' && (
              <motion.div key="i-pick" className="flex items-center gap-1.5 sm:gap-2"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}>
                <Lightbulb size={14} className="sm:hidden" stroke="#a855f7" fill="rgba(168,85,247,0.12)" />
                <Lightbulb size={18} className="hidden sm:block" stroke="#a855f7" fill="rgba(168,85,247,0.12)" />
                <span className="text-[11px] sm:text-sm text-[#a855f7] font-medium">Ideias</span>
              </motion.div>
            )}
            {ideiaStatus === 'loading' && (
              <motion.div key="i-load" className="flex items-center gap-1.5 sm:gap-2 min-w-0"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <AnimatedDots />
                <AnimatePresence mode="wait">
                  <motion.span key={ideiaStep} className="hidden sm:inline text-sm text-[#a855f7] font-medium truncate"
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
                <Check size={14} className="sm:hidden" stroke="#f97316" strokeWidth={2.5} />
                <Check size={18} className="hidden sm:block" stroke="#f97316" strokeWidth={2.5} />
                <span className="text-[11px] sm:text-sm text-[#f97316] font-semibold truncate">{ideiaChoice}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* ── Compartilhar ── */}
        <button onClick={handleShare} disabled={shareStatus === 'loading'} className="flex items-center justify-end gap-1 sm:gap-2 overflow-hidden w-full">
          <AnimatePresence mode="wait">
            {shareStatus === 'idle' && (
              <motion.div key="sh-idle" className="flex items-center gap-1.5 sm:gap-2"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}>
                <Share2 size={14} className="sm:hidden" stroke="#8e8e8e" />
                <Share2 size={18} className="hidden sm:block" stroke="#8e8e8e" />
                <span className="text-[9px] sm:text-sm text-[#8e8e8e] font-medium">Compartilhar</span>
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
                <Check size={14} className="sm:hidden" stroke="#f97316" strokeWidth={2.5} />
                <Check size={18} className="hidden sm:block" stroke="#f97316" strokeWidth={2.5} />
                <span className="text-[9px] sm:text-sm text-[#f97316] font-semibold">Compartilhado</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>

      </div>

      {/* ── Picker de Perguntas ── */}
      <AnimatePresence>
        {pergStatus === 'picking' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }}
            className="mt-2 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex gap-2">
              {PERGUNTAS_OPCOES.map((op, i) => (
                <motion.button key={op.key}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={e => handlePergChoice(e, op.label)}
                  style={{ color: op.color, borderColor: op.color + '50', backgroundColor: op.color + '10' }}
                  className="flex-1 text-[11px] sm:text-xs font-semibold border rounded-full py-1.5 sm:py-2 transition-colors hover:opacity-80">
                  {op.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Picker de Ideias ── */}
      <AnimatePresence>
        {ideiaStatus === 'picking' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }}
            className="mt-2 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex gap-2">
              {IDEIAS_OPCOES.map((op, i) => (
                <motion.button key={op.key}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={e => handleIdeiaChoice(e, op.label)}
                  style={{ color: op.color, borderColor: op.color + '50', backgroundColor: op.color + '10' }}
                  className="flex-1 text-[11px] sm:text-xs font-semibold border rounded-full py-1.5 sm:py-2 transition-colors hover:opacity-80">
                  {op.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  const cls = "w-full bg-white dark:bg-[#1c1c1c] rounded-2xl shadow-sm px-5 py-4 text-left transition-colors " +
    (onClick ? "hover:bg-[#f7f7f7] dark:hover:bg-[#252525] cursor-pointer" : "");

  return onClick
    ? <button onClick={onClick} className={cls}>{cardContent}</button>
    : <div className={cls}>{cardContent}</div>;
}
