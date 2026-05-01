import React, { useState, useRef, useEffect } from 'react';
import { X, ArrowUp, LayoutDashboard, Search, Zap, BookOpen, BarChart2, Compass, Eye, ClipboardList, Target, Send, Lightbulb, FileText, FlaskConical, CheckCircle, Gauge, AlignLeft, Star as StarIcon, TrendingUp, Map, Plus, Globe, Settings2, Moon, Sun, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Phase = 'init' | 'expanded' | 'selected';
type MainKey = 'pesquisar' | 'executar' | 'aprender';

const MAIN_BTNS: { key: MainKey; label: string; Icon: React.ElementType }[] = [
  { key: 'pesquisar', label: 'Pesquisar', Icon: Search    },
  { key: 'executar',  label: 'Executar',  Icon: Zap       },
  { key: 'aprender',  label: 'Aprender',  Icon: BookOpen  },
];

const SUB_BTNS: Record<MainKey, { key: string; label: string; Icon: React.ElementType }[]> = {
  pesquisar: [
    { key: 's1', label: '', Icon: BarChart2  },
    { key: 's2', label: '', Icon: BarChart2  },
    { key: 's3', label: '', Icon: BarChart2  },
    { key: 's4', label: '', Icon: BarChart2  },
    { key: 's5', label: '', Icon: BarChart2  },
  ],
  executar: [
    { key: 'e1', label: '', Icon: BarChart2  },
    { key: 'e2', label: '', Icon: BarChart2  },
    { key: 'e3', label: '', Icon: BarChart2  },
    { key: 'e4', label: '', Icon: BarChart2  },
    { key: 'e5', label: '', Icon: BarChart2  },
  ],
  aprender: [
    { key: 'a1', label: '', Icon: BarChart2  },
    { key: 'a2', label: '', Icon: BarChart2  },
    { key: 'a3', label: '', Icon: BarChart2  },
    { key: 'a4', label: '', Icon: BarChart2  },
    { key: 'a5', label: '', Icon: BarChart2  },
  ],
};

function InitializerButtons() {
  const [phase,      setPhase]      = useState<Phase>('init');
  const [activeMain, setActiveMain] = useState<MainKey | null>(null);
  const [activeSub,  setActiveSub]  = useState<string | null>(null);

  function handleMain(key: MainKey) {
    setActiveMain(key);
    setActiveSub(null);
    setPhase('selected');
  }

  function handleReset() {
    setPhase('init');
    setActiveMain(null);
    setActiveSub(null);
  }

  const subIdle   = "flex-1 min-w-[28%] flex flex-col items-center justify-center gap-1 h-10 rounded-xl border text-[10px] sm:text-[11px] font-semibold transition-all duration-200 active:scale-[0.97] cursor-pointer px-2 bg-transparent border-neutral-200 dark:border-[#4e4e4e] text-neutral-600 dark:text-neutral-300 hover:bg-[#3b82f6]/10 hover:text-[#3b82f6] dark:hover:text-[#3b82f6]";
  const subActive = "flex-1 min-w-[28%] flex flex-col items-center justify-center gap-1 h-10 rounded-xl border text-[10px] sm:text-[11px] font-semibold transition-all duration-200 active:scale-[0.97] cursor-pointer px-2 bg-[#3b82f6] border-[#3b82f6] text-white";

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence mode="wait">

        {/* — INIT — */}
        {phase === 'init' && (
          <motion.button
            key="init"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            whileTap={{ scale: 1.05 }}
            onClick={() => setPhase('expanded')}
            className="w-full h-11 rounded-2xl bg-neutral-200/50 dark:bg-[#2b2b2b] border border-neutral-200 dark:border-[#3d3d3d] shadow-[0_3px_10px_rgba(0,0,0,0.12)] dark:shadow-[0_3px_10px_rgba(0,0,0,0.45)] text-neutral-800 dark:text-neutral-100 text-[13px] font-semibold tracking-wide hover:bg-neutral-200 dark:hover:bg-[#353535] transition-all duration-200 cursor-pointer"
          >
            Inicializar
          </motion.button>
        )}

        {/* — EXPANDED: 3 botões — */}
        {phase === 'expanded' && (
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-2"
          >
            <div className="flex sm:flex-row flex-col gap-1.5">
              {MAIN_BTNS.map((btn, i) => {
                const offset = (i - 1) * 28;
                return (
                  <motion.button
                    key={btn.key}
                    initial={{ opacity: 0, x: offset }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.05, ease: 'easeOut' }}
                    onClick={() => handleMain(btn.key)}
                    className="flex-1 flex flex-col items-center justify-center gap-1 h-11 rounded-2xl border text-[11px] sm:text-xs font-semibold transition-all duration-200 active:scale-[0.97] cursor-pointer bg-[#f0f2f4] dark:bg-[#414141] border-neutral-200 dark:border-[#4e4e4e] text-neutral-700 dark:text-neutral-200 hover:bg-[#3b82f6] hover:text-white hover:border-[#3b82f6]"
                  >
                    <btn.Icon size={14} />
                    <span>{btn.label}</span>
                  </motion.button>
                );
              })}
            </div>
            <div className="flex justify-center gap-4">
              <button onClick={handleReset} className="text-[10px] text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors duration-200 cursor-pointer">
                ✕ fechar
              </button>
            </div>
          </motion.div>
        )}

        {/* — SELECTED: sub-botões acima + botão ativo — */}
        {phase === 'selected' && activeMain && (
          <motion.div
            key={`selected-${activeMain}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-2"
          >
            {/* Sub-botões — aparecem acima */}
            <div className="flex flex-wrap gap-1.5">
              {SUB_BTNS[activeMain].map((sub, i) => (
                <motion.button
                  key={sub.key}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 14 }}
                  transition={{ duration: 0.25, delay: i * 0.08, ease: 'easeOut' }}
                  onClick={() => setActiveSub(sub.key)}
                  className={activeSub === sub.key ? subActive : subIdle}
                >
                  <sub.Icon size={12} />
                  <span>{sub.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Botão principal selecionado */}
            {(() => {
              const btn = MAIN_BTNS.find(b => b.key === activeMain)!;
              return (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  onClick={() => setPhase('expanded')}
                  className="w-full flex items-center justify-center gap-2 h-11 rounded-2xl border text-[12px] font-semibold transition-all duration-200 cursor-pointer bg-[#3b82f6] border-[#3b82f6] text-white hover:bg-[#2563eb]"
                >
                  <btn.Icon size={14} />
                  <span>{btn.label}</span>
                </motion.button>
              );
            })()}

            <div className="flex justify-center gap-4">
              <button onClick={() => setPhase('expanded')} className="text-[10px] text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors duration-200 cursor-pointer">
                ← voltar
              </button>
              <button onClick={handleReset} className="text-[10px] text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors duration-200 cursor-pointer">
                ✕ fechar
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

function ChatBody({ onClose, showClose }: { onClose?: () => void; showClose?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

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
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-3">
        {messages.map((msg, i) => (
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
        ))}

        {/* Typing indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-neutral-100 dark:bg-[#373737] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
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
              <InitializerButtons />
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

interface ChatDesktopProps {
  wide?: boolean;
  dark?: boolean;
  onToggleDark?: () => void;
  onSector?: () => void;
  onBrowser?: () => void;
  onDifficulty?: () => void;
  activeSector?: string;
}

export function ChatDesktop({ wide, dark, onToggleDark, onSector, onBrowser, onDifficulty, activeSector }: ChatDesktopProps) {
  const btnCls = "cursor-pointer text-neutral-400 dark:text-neutral-200 p-2 rounded-xl hover:bg-neutral-200/60 dark:hover:bg-white/5 hover:text-neutral-800 dark:hover:text-white transition-all duration-200 active:scale-90";
  return (
    <div
      style={{ width: wide ? 'calc(50vw - 16px)' : '380px', transition: 'width 500ms cubic-bezier(0.25,0.1,0.25,1)' }}
      className="fixed top-[72px] right-4 bottom-4 z-[40] hidden lg:flex flex-col bg-[#f0f2f4] dark:bg-[#323232] border border-neutral-100 dark:border-[#414141] rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.13)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
    >
      {/* Header com ícones */}
      <div className="flex items-center justify-between gap-8 px-6 pt-5 pb-2 flex-shrink-0">
        <button onClick={onSector} className={`${btnCls} relative`} title="Trocar feed por área">
          <Plus size={22} className={activeSector && activeSector !== 'geral' ? 'text-[#3b82f6]' : ''} />
          {activeSector && activeSector !== 'geral' && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
          )}
        </button>
        <button onClick={onBrowser} className={btnCls} title="Sincronizar">
          <Globe size={22} />
        </button>
        <button onClick={onDifficulty} className={btnCls} title="Dificuldade">
          <Settings2 size={22} />
        </button>
        <button onClick={onToggleDark} className={btnCls}>
          {dark ? <Sun size={22} /> : <Moon size={22} />}
        </button>
        <button className={btnCls}>
          <Bell size={22} />
        </button>
      </div>
      <ChatBody />
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

export function ChatMobile({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed inset-0 z-[200] lg:hidden bg-[#f0f2f4] dark:bg-[#2b2b2b]"
        >
          <ChatBody onClose={onClose} showClose />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
