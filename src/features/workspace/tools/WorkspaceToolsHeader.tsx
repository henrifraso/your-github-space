// Cabeçalho do painel de Ferramentas.
//
// Mostra ícone (Hammer) + título "Ferramentas" + subtítulo + botão
// chevron pra recolher/expandir a caixa. NÃO é menu/dropdown — é
// cabeçalho de um painel/caixa.
//
// Conteúdo movido de src/components/WorkspaceTools.tsx (Fase 8).
// JSX, classes, ícones e textos preservados byte-a-byte.

import { Hammer, ChevronDown, ChevronUp } from 'lucide-react';

interface WorkspaceToolsHeaderProps {
  open: boolean;
  onToggle: () => void;
}

export function WorkspaceToolsHeader({ open, onToggle }: WorkspaceToolsHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3 px-3.5 pt-3 pb-2">
      <div className="flex items-start gap-2">
        <div className="mt-0.5 w-6 h-6 rounded-md bg-[#eef2f7] dark:bg-[#3a3a3a] border border-neutral-200 dark:border-[#4a4a4a] flex items-center justify-center">
          <Hammer size={12} className="text-neutral-600 dark:text-neutral-300" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[12px] font-semibold text-neutral-800 dark:text-neutral-100">
            Ferramentas
          </span>
          <span className="text-[10.5px] text-neutral-500 dark:text-neutral-400 mt-0.5">
            Ações práticas para continuar este trabalho.
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className="
          shrink-0 mt-0.5 w-6 h-6 rounded-md
          flex items-center justify-center
          text-neutral-500 dark:text-neutral-400
          hover:bg-neutral-100 dark:hover:bg-[#3a3a3a]
          hover:text-neutral-800 dark:hover:text-neutral-100
          transition-colors
        "
        title={open ? 'Recolher caixa' : 'Expandir caixa'}
      >
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>
    </div>
  );
}
