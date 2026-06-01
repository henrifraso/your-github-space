// Controles compactos usados nos rodapés dos blocos da Área de Trabalho.
//
// Extraídos de src/components/ChatPanel.tsx (Fase 9). Aqui ficam os
// componentes auto-suficientes (sem dependência de constantes internas
// do ChatPanel).
//
// `BlockCtrl` é o botão padrão dos rodapés: Gerar novamente / Exemplos /
// Fixar / Copiar. Recebe ícone + label + onClick + flags visuais.
//
// AINDA NO ChatPanel (vão migrar em fase posterior junto com as
// constantes que cada um consome):
//   - `DifficultyRow`       (depende de DIFICULDADE_LABELS, Dificuldade)
//   - `ModeShortcuts`       (depende de MODE_TOP5, SUB_BTNS, SubAction)
//   - `BlockShortcutsRow`   (depende de LocalShortcut, MainKey)

import React from 'react';

interface BlockCtrlProps {
  Icon: React.ElementType;
  label: string;
  onClick?: () => void;
  active?: boolean;
  dimmed?: boolean;
}

export function BlockCtrl({ Icon, label, onClick, active, dimmed }: BlockCtrlProps) {
  const base = "inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold transition-colors cursor-pointer";
  const cls = active
    ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
    : dimmed
      ? "text-neutral-400 dark:text-neutral-500 cursor-default"
      : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-[#414141] hover:text-neutral-700 dark:hover:text-neutral-200";
  return (
    <button type="button" onClick={onClick} disabled={dimmed} className={`${base} ${cls}`}>
      <Icon size={10} />
      <span>{label}</span>
    </button>
  );
}
