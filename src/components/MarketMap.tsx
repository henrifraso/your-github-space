import React from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import type { Competitor } from '../types';
import { CompetitiveMap } from './maps/CompetitiveMap';

// Backup do Leaflet em backup/leaflet-original/MarketMap.tsx

interface ButtonProps { bioOpen: boolean; onHome: () => void; onMap: () => void; }
interface ContentProps {
  open: boolean;
  onClose: () => void;
  competitors: Competitor[];
  onCompetitorClick?: (c: Competitor) => void;
  sector?: string;
  businessName?: string;
}

export function MarketMapButton({ bioOpen, onHome: _onHome, onMap }: ButtonProps) {
  if (!bioOpen) return null;
  return (
    <button
      onClick={onMap}
      className="w-full h-9 md:h-11 flex items-center justify-center px-4 md:px-5 bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)] hover:bg-[#e4e7ea] dark:hover:bg-[#353535] rounded-xl text-xs md:text-sm font-semibold text-neutral-800 dark:text-neutral-200 transition-all duration-200 cursor-pointer"
    >
      Concorrentes
    </button>
  );
}

export function MarketMapContent({ open, onClose, competitors, sector, businessName }: ContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <CompetitiveMap competitors={competitors} onClose={onClose} sector={sector} businessName={businessName} />
    </motion.div>
  );
}
