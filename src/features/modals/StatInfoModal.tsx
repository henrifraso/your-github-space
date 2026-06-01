// StatInfoModal — modal de detalhes de stat clicável.
//
// Aparece quando o usuário clica num número/badge na bio (ex.: "3 empresas",
// "2 afiliados", etc.). Mostra valor + label + descrição.
//
// Conteúdo movido de src/App.tsx (Fase 18) byte-a-byte. JSX, classes,
// animações Motion (`type: spring, damping: 25, stiffness: 300`) e
// textos preservados. Caller controla abertura via `info != null`.

import { motion, AnimatePresence } from 'motion/react';

export interface StatInfoData {
  label: string;
  value: any;
  description: string;
}

interface StatInfoModalProps {
  info: StatInfoData | null;
  onClose: () => void;
}

export function StatInfoModal({ info, onClose }: StatInfoModalProps) {
  return (
    <AnimatePresence>
      {info && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-end md:items-center justify-center"
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full md:max-w-md bg-[#f0f2f4] dark:bg-[#323232] rounded-t-2xl md:rounded-2xl p-6 border border-transparent dark:border-[#414141]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_4px_10px_-1px_rgba(0,0,0,0.22),0_1px_3px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.6)] dark:shadow-[0_4px_10px_-1px_rgba(0,0,0,0.55),0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.04)] text-base font-bold text-neutral-800 dark:text-white">
                  {info.value}
                </div>
                <h2 className="text-base font-bold text-neutral-800 dark:text-neutral-100 capitalize">{info.label}</h2>
              </div>
              <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white cursor-pointer">✕</button>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">{info.description}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
