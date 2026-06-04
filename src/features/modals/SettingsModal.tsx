// SettingsModal — modal "Nível de Linguagem" (sistema de dificuldade).
//
// Tela cheia com grid de 5 opções (muito_facil / facil / normal / dificil /
// muito_dificil). Clicar numa opção aplica a dificuldade e fecha o modal.
//
// Conteúdo movido de src/App.tsx (Fase 18) byte-a-byte. JSX, animações
// Motion (`duration: 0.25, ease: [0.25, 0.1, 0.25, 1]`, stagger de 0.06s
// por item) e textos preservados.

import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type Difficulty = 'muito_facil' | 'facil' | 'normal' | 'dificil' | 'muito_dificil';

export interface DifficultyMeta {
  label: string;
  emoji: string;
  desc: string;
}

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  current: Difficulty;
  onChange: (d: Difficulty) => void;
  order: Difficulty[];
  meta: Record<Difficulty, DifficultyMeta>;
}

export function SettingsModal({ open, onClose, current, onChange, order, meta }: SettingsModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed inset-0 z-[190] bg-[#dcdfe2] dark:bg-[#181818] flex flex-col overflow-y-auto"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          <div className="sticky top-0 z-10 bg-[#dcdfe2]/80 dark:bg-[#181818]/80 backdrop-blur-xl border-b border-neutral-200 dark:border-[#414141] px-5 py-4 flex items-center justify-between max-w-[935px] w-full mx-auto">
            <div>
              <h1 className="text-base font-bold text-neutral-800 dark:text-neutral-100">Nível de Linguagem</h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Ajuste como as informações são apresentadas</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-white/5 transition-all duration-200 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 px-4 sm:px-5 py-6 max-w-[935px] w-full mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {order.map((d, i) => {
                const m = meta[d];
                const isSelected = current === d;
                return (
                  <motion.button
                    key={d}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.06 }}
                    onClick={() => { onChange(d); onClose(); }}
                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl border cursor-pointer text-left transition-all duration-200 shadow-[0_2px_12px_rgba(0,0,0,0.07)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)] ${
                      isSelected
                        ? 'bg-[#f0f2f4] dark:bg-[#323232] border-[#3b82f6]'
                        : 'bg-[#f0f2f4] dark:bg-[#323232] border-neutral-100 dark:border-[#414141] hover:bg-[#e4e7ea] dark:hover:bg-[#353535]'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${isSelected ? 'bg-[#3b82f6]/10' : 'bg-neutral-100 dark:bg-[#404040]'}`}>
                      {m.emoji}
                    </div>
                    <p className={`flex-1 text-sm font-bold ${isSelected ? 'text-[#3b82f6]' : 'text-neutral-800 dark:text-neutral-100'}`}>{m.label}</p>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#3b82f6] flex items-center justify-center flex-shrink-0">
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
