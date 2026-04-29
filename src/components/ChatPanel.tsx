import React, { useState, useRef, useEffect } from 'react';
import { X, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

function ChatBody({ onClose, showClose }: { onClose?: () => void; showClose?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
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
    <div className="flex flex-col h-full bg-white dark:bg-[#0f0f0f]">

      {/* Close — mobile only */}
      {showClose && onClose && (
        <div className="flex justify-end px-5 pt-5 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-[#1a1a1a] transition-all duration-200 cursor-pointer"
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
                : 'bg-neutral-100 dark:bg-[#1c1c1c] text-neutral-700 dark:text-neutral-300 rounded-bl-sm'
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
            <div className="bg-neutral-100 dark:bg-[#1c1c1c] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
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
        <div className="flex items-end gap-2 bg-neutral-50 dark:bg-[#161616] border border-neutral-200 dark:border-[#262626] rounded-2xl px-4 py-3 focus-within:border-neutral-300 dark:focus-within:border-[#363636] transition-colors duration-200">
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
            className="w-7 h-7 rounded-xl bg-[#3b82f6] disabled:bg-neutral-200 dark:disabled:bg-[#262626] flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:bg-[#2563eb] active:scale-90 cursor-pointer disabled:cursor-default mb-0.5"
          >
            <ArrowUp size={13} className="text-white" strokeWidth={2.5} />
          </button>
        </div>
      </div>

    </div>
  );
}

export function ChatDesktop() {
  return (
    <div className="fixed top-0 right-0 bottom-0 w-[300px] xl:w-[320px] z-[40] hidden lg:block border-l border-neutral-100 dark:border-[#262626]">
      <ChatBody />
    </div>
  );
}

export function ChatFAB({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-6 right-5 z-[170] rounded-full backdrop-blur-md bg-white/40 border border-white/50 dark:bg-black/30 dark:border-white/10 flex items-center justify-center lg:hidden cursor-pointer"
      style={{ width: 48, height: 48 }}
    >
      <ArrowUp size={17} strokeWidth={2} className="text-neutral-600 dark:text-neutral-400" />
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
          className="fixed inset-0 z-[200] lg:hidden"
        >
          <ChatBody onClose={onClose} showClose />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
