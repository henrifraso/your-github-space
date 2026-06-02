import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { FeedSection, FeedCard } from './FeedComponents';
import type { DepartmentId, CompanySectorFeeds } from '../types';
import type { IntelligenceCard, WorkspaceIntent } from './WorkspacePanel';

const fadeItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] } },
};

function sectorCardToIntelligence(c: { tag: string; title: string; detail: string }, dept: string, idx: number): IntelligenceCard {
  return {
    id:              `synthetic-sector-${dept}-${idx}`,
    titulo:          c.title,
    resumo:          c.detail,
    por_que_importa: '',
    onde_afeta:      '',
    o_que_fazer:     '',
    dominio:         c.tag,
    area:            dept,
    urgencia:        'media',
    tipo_card:       'informacao',
    confianca:       'media',
    confianca_score: 0.5,
    impacto:         '',
    risco_erro:      0.3,
    _synthetic:      true,
  };
}

function SimpleCard({ color, tag, title, detail, badge, onOpenWorkspace, intelligence }: {
  color: string; tag: string; title: string; detail: string;
  badge?: { label: string; type: 'ok' | 'warn' | 'info' };
  onOpenWorkspace?: (card: IntelligenceCard, intent: WorkspaceIntent) => void;
  intelligence?: IntelligenceCard;
}) {
  const callbacks = (onOpenWorkspace && intelligence) ? {
    onWorkspaceIntent: (intent: WorkspaceIntent) => onOpenWorkspace(intelligence, intent),
    // onFullscreen removido — o clique no card inteiro NÃO deve mais abrir
    // a Área de Trabalho. Só os botões (Aprender / Entender / Executar) levam.
  } : {};
  return (
    <FeedCard {...callbacks}>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color }}>{tag}</p>
          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 leading-snug">{title}</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">{detail}</p>
        </div>
        {badge && (
          <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5
            ${badge.type === 'ok'   ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
              badge.type === 'warn' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
              'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'}`}>
            {badge.label}
          </span>
        )}
      </div>
    </FeedCard>
  );
}

interface Props {
  department: Exclude<DepartmentId, 'geral'>;
  feeds: CompanySectorFeeds;
  onOpenWorkspace?: (card: IntelligenceCard, intent: WorkspaceIntent) => void;
  /** Classe de margin-top do wrapper raiz. Permite que o caller sincronize o
      gap do topo com o da Área de Trabalho em modo split (mesmo token). */
  topGapClass?: string;
}

export function SectorFeed({ department, feeds, onOpenWorkspace, topGapClass }: Props) {
  const sections = feeds[department] ?? [];

  return (
    <motion.div
      className={`max-w-[935px] mx-auto ${topGapClass ?? 'mt-5'} pb-12 space-y-5 px-5`}
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } }}
    >
      {sections.length === 0 ? (
        <motion.div variants={fadeItem}>
          <FeedCard>
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
              <ChevronRight size={28} className="text-neutral-300 dark:text-neutral-600" />
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Conteúdo em construção para esta área.</p>
            </div>
          </FeedCard>
        </motion.div>
      ) : (
        sections.map((section, i) => (
          <motion.div key={i} variants={fadeItem}>
            <FeedSection title={section.sectionTitle} icon={<ChevronRight size={18}/>}>
              {section.cards.map((card, j) => (
                <SimpleCard
                  key={j}
                  {...card}
                  onOpenWorkspace={onOpenWorkspace}
                  intelligence={sectorCardToIntelligence(card, department, i * 100 + j)}
                />
              ))}
            </FeedSection>
          </motion.div>
        ))
      )}
    </motion.div>
  );
}
