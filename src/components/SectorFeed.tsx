import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { FeedCard } from './FeedComponents';
import type { DepartmentId } from '../types';
import type { IntelligenceCard, WorkspaceIntent } from './WorkspacePanel';

const fadeItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] } },
};

interface Props {
  /** Mantido pra reativar filtro por departamento depois — hoje não filtra nada
      (09/ago/2026): as abas mostram os mesmos cards do feed geral, sem
      distinção, até decidir o que fazer com sector-feeds/*.ts. */
  department: Exclude<DepartmentId, 'geral'>;
  cards: IntelligenceCard[];
  onOpenWorkspace?: (card: IntelligenceCard, intent: WorkspaceIntent) => void;
  /** Classe de margin-top do wrapper raiz. Permite que o caller sincronize o
      gap do topo com o da Área de Trabalho em modo split (mesmo token). */
  topGapClass?: string;
  /** Classe de padding-right — caller passa pr-5 (split) ou pr-10 (normal). */
  rightPadClass?: string;
}

export function SectorFeed({ cards, onOpenWorkspace, topGapClass, rightPadClass }: Props) {
  return (
    <motion.div
      className={`${topGapClass ?? 'mt-5'} pb-32 space-y-5 pl-5 ${rightPadClass ?? 'pr-5'}`}
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } }}
    >
      {cards.length === 0 ? (
        <motion.div variants={fadeItem}>
          <FeedCard>
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
              <ChevronRight size={28} className="text-neutral-300 dark:text-neutral-600" />
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Conteúdo em construção para esta área.</p>
            </div>
          </FeedCard>
        </motion.div>
      ) : (
        cards.map(card => (
          <motion.div key={card.id} variants={fadeItem}>
            <FeedCard
              onWorkspaceIntent={onOpenWorkspace ? (intent) => onOpenWorkspace(card, intent) : undefined}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: card.urgencia === 'alta' ? '#ef4444' : card.urgencia === 'media' ? '#f59e0b' : '#6b7280' }}>{card.tag ?? card.dominio}</p>
                  <div className="min-h-[81.5px]">
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 leading-snug line-clamp-2">{card.titulo}</p>
                    <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed line-clamp-2">{card.resumo}</p>
                  </div>
                </div>
              </div>
            </FeedCard>
          </motion.div>
        ))
      )}
    </motion.div>
  );
}
