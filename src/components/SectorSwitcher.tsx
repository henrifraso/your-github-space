import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Share2, Globe, Megaphone, TrendingUp, Banknote, Users, Settings2, Package, Scale } from 'lucide-react';

export type SectorId = 'geral' | 'marketing' | 'vendas' | 'financeiro' | 'rh' | 'operacoes' | 'estoque' | 'juridico';

export const SECTORS: { id: SectorId; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'geral',      label: 'Geral',       icon: <Globe size={17}/>,     color: '#3b82f6' },
  { id: 'marketing',  label: 'Marketing',   icon: <Megaphone size={17}/>, color: '#ec4899' },
  { id: 'vendas',     label: 'Vendas',      icon: <TrendingUp size={17}/>,color: '#10b981' },
  { id: 'financeiro', label: 'Financeiro',  icon: <Banknote size={17}/>,  color: '#f59e0b' },
  { id: 'rh',         label: 'RH',          icon: <Users size={17}/>,     color: '#8b5cf6' },
  { id: 'operacoes',  label: 'Operações',   icon: <Settings2 size={17}/>, color: '#06b6d4' },
  { id: 'estoque',    label: 'Estoque',     icon: <Package size={17}/>,   color: '#84cc16' },
  { id: 'juridico',   label: 'Jurídico',    icon: <Scale size={17}/>,     color: '#f97316' },
];

interface Props {
  active: SectorId;
  onSelect: (id: SectorId) => void;
  onClose: () => void;
}

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
    <div className="fixed inset-0 z-[160]">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="absolute bottom-0 left-0 right-0 bg-[#f0f2f4] dark:bg-[#2d2d2d] rounded-t-2xl px-5 pt-5 pb-10 max-w-[935px] mx-auto shadow-[0_-8px_32px_rgba(0,0,0,0.12)]"
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-bold text-neutral-800 dark:text-neutral-100">Feed por Área</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition-all duration-200 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
          Escolha uma área para ver notícias específicas ou compartilhe o link do feed com a equipe.
        </p>
        <div className="space-y-1.5">
          {SECTORS.map(sector => (
            <div
              key={sector.id}
              onClick={() => { onSelect(sector.id); onClose(); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all duration-200
                ${active === sector.id
                  ? 'border-[#3b82f6] bg-[#3b82f6]/5 dark:bg-[#3b82f6]/10'
                  : 'border-neutral-100 dark:border-[#414141] hover:bg-[#e4e7ea] dark:hover:bg-[#353535]'
                }`}
            >
              <span style={{ color: sector.color }} className="flex-shrink-0">{sector.icon}</span>
              <span className="flex-1 text-sm font-semibold text-neutral-800 dark:text-neutral-100">{sector.label}</span>
              {active === sector.id && <Check size={14} className="text-[#3b82f6] flex-shrink-0" />}
              <button
                onClick={e => handleShare(e, sector.id)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition-all duration-200 flex-shrink-0 cursor-pointer"
                title={`Compartilhar feed de ${sector.label}`}
              >
                {copied === sector.id
                  ? <Check size={13} className="text-[#10b981]" />
                  : <Share2 size={13} />
                }
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
