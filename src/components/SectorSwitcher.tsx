import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Share2, Globe, Megaphone, TrendingUp, Banknote, Users, Settings2, Package, Scale } from 'lucide-react';

export type SectorId = 'geral' | 'marketing' | 'vendas' | 'financeiro' | 'rh' | 'operacoes' | 'estoque' | 'juridico';

export const SECTORS: { id: SectorId; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
  { id: 'geral',      label: 'Geral',       desc: 'Todas as áreas combinadas',       icon: <Globe size={22}/>,     color: '#3b82f6' },
  { id: 'marketing',  label: 'Marketing',   desc: 'Campanhas, marca e reputação',    icon: <Megaphone size={22}/>, color: '#ec4899' },
  { id: 'vendas',     label: 'Vendas',      desc: 'Resultados, metas e delivery',    icon: <TrendingUp size={22}/>,color: '#10b981' },
  { id: 'financeiro', label: 'Financeiro',  desc: 'Fiscal, custos e margens',        icon: <Banknote size={22}/>,  color: '#f59e0b' },
  { id: 'rh',         label: 'RH',          desc: 'Equipe, escalas e treinamentos',  icon: <Users size={22}/>,     color: '#8b5cf6' },
  { id: 'operacoes',  label: 'Operações',   desc: 'Qualidade, ANVISA e processos',   icon: <Settings2 size={22}/>, color: '#06b6d4' },
  { id: 'estoque',    label: 'Estoque',     desc: 'Insumos, pedidos e fornecedores', icon: <Package size={22}/>,   color: '#84cc16' },
  { id: 'juridico',   label: 'Jurídico',    desc: 'Compliance, contratos e leis',    icon: <Scale size={22}/>,     color: '#f97316' },
];

interface Props {
  active: SectorId;
  onSelect: (id: SectorId) => void;
  onClose: () => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number], delay: i * 0.05 },
  }),
};

export function SectorSwitcherModal({ active, onSelect, onClose }: Props) {
  const [copied, setCopied] = useState<SectorId | null>(null);

  function handleShare(e: React.MouseEvent, id: SectorId) {
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}?sector=${id}`;
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed inset-0 z-[190] bg-[#dcdfe2] dark:bg-[#181818] flex flex-col overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#dcdfe2]/80 dark:bg-[#181818]/80 backdrop-blur-xl border-b border-neutral-200 dark:border-[#414141] px-5 py-4 flex items-center justify-between max-w-[935px] w-full mx-auto">
        <div>
          <h1 className="text-base font-bold text-neutral-800 dark:text-neutral-100">Feed por Área</h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Escolha uma área ou compartilhe o link com a equipe</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-white/5 transition-all duration-200 cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      {/* Grid de setores */}
      <div className="flex-1 px-4 sm:px-5 py-6 max-w-[935px] w-full mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SECTORS.map((sector, i) => {
            const isActive = active === sector.id;
            return (
              <motion.div
                key={sector.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                onClick={() => { onSelect(sector.id); onClose(); }}
                className={`relative flex items-center gap-4 px-5 py-4 rounded-2xl border cursor-pointer transition-all duration-200 shadow-[0_2px_12px_rgba(0,0,0,0.07)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)]
                  ${isActive
                    ? 'bg-[#f0f2f4] dark:bg-[#323232] border-[#3b82f6]'
                    : 'bg-[#f0f2f4] dark:bg-[#323232] border-neutral-100 dark:border-[#414141] hover:bg-[#e4e7ea] dark:hover:bg-[#353535]'
                  }`}
              >
                {/* Ícone */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: sector.color + '18' }}
                >
                  <span style={{ color: sector.color }}>{sector.icon}</span>
                </div>

                {/* Texto */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-neutral-800 dark:text-neutral-100 leading-tight">{sector.label}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-snug">{sector.desc}</p>
                </div>

                {/* Ativo */}
                {isActive && (
                  <div className="w-5 h-5 rounded-full bg-[#3b82f6] flex items-center justify-center flex-shrink-0">
                    <Check size={11} className="text-white" strokeWidth={3} />
                  </div>
                )}

                {/* Compartilhar */}
                <button
                  onClick={e => handleShare(e, sector.id)}
                  className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-white/5 transition-all duration-200 flex-shrink-0 cursor-pointer"
                  title={`Compartilhar feed de ${sector.label}`}
                >
                  {copied === sector.id
                    ? <Check size={14} className="text-[#10b981]" />
                    : <Share2 size={14} />
                  }
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
