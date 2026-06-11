// Badge inline mostrando o estado de governança de um card Codify.
//
// Estados (calculados em useCardGovernance.derivedStatus):
//   pending      → "Pendente"          (cinza neutro)
//   approved     → "Aprovado"          (verde discreto)
//   rejected     → "Rejeitado"         (vermelho discreto)
//   distributed  → "Distribuído para N unidade(s)"  (azul discreto)
//
// Pra coerência com os outros badges do WorkspacePanel (urgência, área),
// segue o padrão rounded-full, border, dark-aware. Renderiza null se
// estado for desconhecido — não polui o header de cards de cards
// sintéticos / sem acesso.

import type { DerivedStatus } from '../features/governance/use-card-governance';

interface Props {
  status: DerivedStatus;
  distributionCount?: number;
  /** Mostra um spinner discreto enquanto carrega o estado real. */
  loading?: boolean;
}

const STATUS_STYLES: Record<DerivedStatus, { label: string; classes: string }> = {
  pending: {
    label: 'Pendente',
    classes:
      'bg-neutral-100 dark:bg-[#2a2a2a] text-neutral-600 dark:text-neutral-400 ' +
      'border-neutral-200 dark:border-[#3a3a3a]',
  },
  approved: {
    label: 'Aprovado',
    classes:
      'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 ' +
      'border-emerald-200 dark:border-emerald-800/50',
  },
  rejected: {
    label: 'Rejeitado',
    classes:
      'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 ' +
      'border-rose-200 dark:border-rose-800/50',
  },
  distributed: {
    label: 'Distribuído',
    classes:
      'bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 ' +
      'border-sky-200 dark:border-sky-800/50',
  },
};

export function CardStatusBadge({ status, distributionCount, loading }: Props) {
  const conf = STATUS_STYLES[status];
  if (!conf) return null;

  const label =
    status === 'distributed' && typeof distributionCount === 'number'
      ? `Distribuído para ${distributionCount} ${distributionCount === 1 ? 'unidade' : 'unidades'}`
      : conf.label;

  return (
    <span
      className={
        'inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 ' +
        'rounded-full border ' + conf.classes
      }
      title={loading ? 'Atualizando…' : undefined}
    >
      {loading && (
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-50 animate-pulse" />
      )}
      <span>{label}</span>
    </span>
  );
}
