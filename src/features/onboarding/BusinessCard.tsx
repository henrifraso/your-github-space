// BusinessCard — card seletor de unidade/negócio.
//
// Conteúdo movido de src/components/LoginScreen.tsx (Fase 19) byte-a-byte.
// Componente puro: state controlado pelo caller via `selected`.
// Ícone Building2 (lucide), classes Tailwind, hover states e
// formatação do segmento (`replace('_', ' ')`) preservados.

import { Building2, Check } from 'lucide-react';
import type { Business } from '../auth/login-api';

interface BusinessCardProps {
  b: Business;
  selected: boolean;
  onClick: () => void;
}

export function BusinessCard({ b, selected, onClick }: BusinessCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left
        ${selected
          ? 'bg-[#3b82f6]/10 border-[#3b82f6]/50 text-white'
          : 'bg-white/[0.03] border-white/8 text-white/70 hover:bg-white/[0.06] hover:border-white/15 hover:text-white'}`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${selected ? 'bg-[#3b82f6]/20' : 'bg-white/5'}`}>
        <Building2 size={18} className={selected ? 'text-[#3b82f6]' : 'text-white/40'} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{b.nome}</p>
        <p className="text-xs text-white/35 mt-0.5">{b.cidade}, {b.estado} · {b.segmento.replace('_', ' ')}</p>
      </div>
      {selected && <Check size={16} className="text-[#3b82f6] flex-shrink-0" />}
    </button>
  );
}
