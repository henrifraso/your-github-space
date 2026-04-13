import React from 'react';
import { motion } from 'motion/react';
import type { TimelineEvent } from '../types';
import { BottomModal, CloseButton } from './BottomModal';

export const TIPO_COLOR: Record<string, string> = {
  concorrente: '#ef4444',
  fornecedor: '#3b82f6',
  mercado: '#f97316',
};

const TIPO_BG: Record<string, string> = {
  concorrente: 'rgba(239,68,68,0.10)',
  fornecedor: 'rgba(59,130,246,0.10)',
  mercado: 'rgba(34,197,94,0.10)',
};

export function TimelineCard({ event, onOpen }: { event: TimelineEvent; onOpen: () => void }) {
  return (
    <motion.div onClick={onOpen}
      className="flex-shrink-0 w-[240px] md:w-auto rounded-2xl border border-neutral-200 dark:border-[#262626] bg-[#fafafa] dark:bg-[#161616] p-6 cursor-pointer transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0" style={{ background: TIPO_BG[event.tipo] }}>
          {event.icone}
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide" style={{ color: TIPO_COLOR[event.tipo] }}>{event.tipo}</p>
          <p className="text-xs text-neutral-500 mt-0.5">{event.data}</p>
        </div>
      </div>
      <p className="text-base font-bold text-neutral-800 dark:text-neutral-100 leading-snug mb-3">{event.titulo}</p>
      <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3">{event.detalhe}</p>
      <p className="text-xs font-semibold mt-4" style={{ color: TIPO_COLOR[event.tipo] }}>Ver mais →</p>
    </motion.div>
  );
}

export function TimelineModal({ event, onClose }: { event: TimelineEvent; onClose: () => void }) {
  return (
    <BottomModal onClose={onClose} zIndex={150}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0" style={{ background: TIPO_BG[event.tipo] }}>
            {event.icone}
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: TIPO_COLOR[event.tipo] }}>{event.tipo}</p>
            <p className="text-[10px] text-neutral-500">{event.data}</p>
          </div>
        </div>
        <CloseButton onClose={onClose} />
      </div>
      <h2 className="text-base font-bold text-neutral-800 dark:text-neutral-100 mb-4">{event.titulo}</h2>
      <p className="text-sm text-neutral-500 leading-relaxed">{event.detalhe}</p>
    </BottomModal>
  );
}
