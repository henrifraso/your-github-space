import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageSquare, Bot, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
}

function now() {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

const WELCOME: Message = {
  id: 'welcome',
  role: 'assistant',
  text: 'Olá! Sou o assistente Omni. Posso ajudar com análise de mercado, estratégias e insights do seu negócio.',
  time: now(),
};

function ChatBody({ onClose, showClose }: { onClose?: () => void; showClose?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text, time: now() }]);
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      text: 'Estou processando sua pergunta com os dados do negócio. Em breve terei uma análise completa para você.',
      time: now(),
    }]);
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0f0f0f] border-l border-neutral-100 dark:border-[#1f1f1f]">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-neutral-100 dark:border-[#1f1f1f] flex-shrink-0 bg-white/80 dark:bg-[#0f0f0f]/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] flex items-center justify-center shadow-sm">
            <Bot size={15} className="text-white" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#16a34a] border-2 border-white dark:border-[#0f0f0f]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 leading-none">Omni IA</p>
            <p className="text-[10px] text-neutral-400 mt-0.5">assistente de mercado</p>
          </div>
        </div>
        {showClose && onClose && (
          <button onClick={onClose} className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition-all duration-200 cursor-pointer">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 scroll-smooth">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start items-end'}`}>
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] flex items-center justify-center flex-shrink-0 mb-0.5">
                <Bot size={11} className="text-white" />
              </div>
            )}
            <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${
              msg.role === 'user'
                ? 'bg-[#3b82f6] text-white rounded-br-sm'
                : 'bg-neutral-100 dark:bg-[#1a1a1a] text-neutral-800 dark:text-neutral-200 rounded-bl-sm border border-transparent dark:border-[#262626]'
            }`}>
              <p className="text-[13px] leading-relaxed">{msg.text}</p>
              <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-blue-200' : 'text-neutral-400'}`}>{msg.time}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2 items-end justify-start">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] flex items-center justify-center flex-shrink-0">
              <Bot size={11} className="text-white" />
            </div>
            <div className="bg-neutral-100 dark:bg-[#1a1a1a] border border-transparent dark:border-[#262626] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
              {[0, 1, 2].map(i => (
                <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] block"
                  animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.18 }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Sugestões rápidas */}
      <div className="px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
        {['Concorrentes', 'Mercado', 'Estratégia'].map(label => (
          <button key={label} onClick={() => { setInput(label); }}
            className="flex-shrink-0 flex items-center gap-1.5 text-[11px] font-medium text-[#3b82f6] bg-[#3b82f6]/8 dark:bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded-full px-3 py-1.5 hover:bg-[#3b82f6]/15 transition-all duration-200 cursor-pointer">
            <Sparkles size={9} />
            {label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 pb-4 flex-shrink-0">
        <div className="flex items-center gap-2 bg-neutral-50 dark:bg-[#1a1a1a] rounded-2xl border border-neutral-200 dark:border-[#2a2a2a] px-4 py-2.5 focus-within:border-[#3b82f6]/50 transition-colors duration-200">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            placeholder="Pergunte sobre seu mercado..."
            className="flex-1 bg-transparent text-[13px] text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="w-7 h-7 rounded-xl bg-[#3b82f6] disabled:bg-neutral-200 dark:disabled:bg-[#2a2a2a] flex items-center justify-center transition-all duration-200 hover:bg-[#2563eb] active:scale-90 cursor-pointer disabled:cursor-default flex-shrink-0"
          >
            <Send size={12} className="text-white" />
          </button>
        </div>
      </div>

    </div>
  );
}

// Painel fixo desktop
export function ChatDesktop() {
  return (
    <div className="fixed top-0 right-0 bottom-0 w-[300px] xl:w-[340px] z-[40] hidden lg:block">
      <ChatBody />
    </div>
  );
}

// Botão flutuante mobile
export function ChatFAB({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-6 right-5 z-[170] w-13 h-13 rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] text-white shadow-xl shadow-blue-500/30 flex items-center justify-center lg:hidden cursor-pointer"
      style={{ width: 52, height: 52 }}
    >
      <MessageSquare size={20} />
    </motion.button>
  );
}

// Modal fullscreen mobile
export function ChatMobile({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed inset-0 z-[200] lg:hidden"
        >
          <ChatBody onClose={onClose} showClose />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
