import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import type { Competitor } from '../../types';

interface Props {
  competitors: Competitor[];
  radiusMeters: number;
}

function formatRadius(m: number): string {
  if (m === Infinity) return 'Nacional';
  if (m >= 1000) return `${m / 1000} km`;
  return `${m} m`;
}

function calcTicketRange(comps: Competitor[]): string | null {
  let min = Infinity, max = -Infinity;
  for (const c of comps) {
    if (!c.ticket_medio) continue;
    const nums = c.ticket_medio.match(/\d+/g);
    if (nums && nums.length >= 2) {
      min = Math.min(min, parseInt(nums[0]));
      max = Math.max(max, parseInt(nums[1]));
    }
  }
  return min === Infinity ? null : `R$ ${min}–${max}`;
}

function topTags(lists: (string[] | undefined)[], n: number): string[] {
  const counts: Record<string, number> = {};
  for (const list of lists) {
    for (const item of list ?? []) {
      counts[item] = (counts[item] ?? 0) + 1;
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([s]) => s);
}

function buildInsight(comps: Competitor[], radiusMeters: number): string {
  if (comps.length === 0) return 'Nenhum concorrente visível neste raio.';
  const alto = comps.filter(c => c.risco_competitivo === 'alto');
  const n = comps.length;
  if (radiusMeters <= 5000) {
    if (alto.length > 0) {
      const names = alto.slice(0, 2).map(c => c.nome.replace(/\s+SJC$/, '')).join(' e ');
      return `${n} concorrentes no raio local. ${names} lideram o risco — presença no mesmo shopping, público-alvo similar ao Oscar.`;
    }
    return `${n} concorrentes no raio local, nenhum de alto risco. Raio favorável para consolidar posicionamento.`;
  }
  if (radiusMeters <= 50000) {
    return `${n} concorrentes na região. Inclui atores do Vale do Paraíba — Taubaté e Jacareí dentro da bacia de clientes da Oscar.`;
  }
  return `${n} concorrentes no mapa, incluindo redes nacionais e e-commerces. A maioria não compite diretamente com a loja física Oscar em SJC.`;
}

const CARD = [
  'bg-[#f7f8f9] dark:bg-[#2f2f2f]',
  'border-[0.5px] border-neutral-200 dark:border-[#3d3d3d]',
  'rounded-2xl',
  'shadow-[0_2px_6px_-2px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_10px_-2px_rgba(0,0,0,0.4)]',
].join(' ');

const LABEL = 'text-[9px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500';

export function MapRadiusSummary({ competitors: comps, radiusMeters }: Props) {
  const alto  = comps.filter(c => c.risco_competitivo === 'alto');
  const medio = comps.filter(c => c.risco_competitivo === 'medio');

  const ticket    = useMemo(() => calcTicketRange(comps), [comps]);
  const strengths = useMemo(() => topTags(comps.map(c => c.faz_bem), 5), [comps]);
  const insight   = useMemo(() => buildInsight(comps, radiusMeters), [comps, radiusMeters]);
  const topOp     = alto[0]?.oportunidade ?? medio[0]?.oportunidade;

  const dominantRisk = alto.length > 0 ? 'alto' : medio.length > 0 ? 'médio' : 'baixo';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="h-full flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-neutral-200 dark:border-[#414141] flex-shrink-0">
        <p className={`${LABEL} mb-1.5`}>Inteligência competitiva</p>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-neutral-800 dark:text-neutral-100 font-semibold text-sm leading-tight">
              Raio de {formatRadius(radiusMeters)}
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400 text-[11px] mt-0.5">
              {comps.length} {comps.length === 1 ? 'concorrente' : 'concorrentes'} visíveis
            </p>
          </div>
          {comps.length > 0 && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 bg-neutral-100 dark:bg-[#3d3d3d] text-neutral-500 dark:text-neutral-400">
              {dominantRisk} risco
            </span>
          )}
        </div>
      </div>

      {/* Scroll */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">

        {/* Empty state */}
        {comps.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-neutral-400 dark:text-neutral-500 text-xs">Nenhum concorrente neste raio.</p>
            <p className="text-neutral-300 dark:text-neutral-600 text-[10px] mt-1">Tente aumentar o raio.</p>
          </div>
        )}

        {/* Grid 2×2 de métricas */}
        {comps.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {/* Total */}
            <div className={`${CARD} px-3 py-2.5`}>
              <p className={`${LABEL} mb-1.5`}>Total</p>
              <p className="text-neutral-800 dark:text-neutral-100 text-2xl font-bold tabular-nums leading-none">
                {comps.length}
              </p>
            </div>
            {/* Ticket */}
            <div className={`${CARD} px-3 py-2.5`}>
              <p className={`${LABEL} mb-1.5`}>Ticket estimado</p>
              <p className="text-neutral-700 dark:text-neutral-200 text-[11px] font-semibold leading-tight">
                {ticket ?? '—'}
              </p>
            </div>
            {/* Alto risco */}
            <div className={`${CARD} px-3 py-2.5`}>
              <p className={`${LABEL} mb-1.5`}>Alto risco</p>
              <div className="flex items-end gap-1.5">
                <span className="text-neutral-800 dark:text-neutral-100 text-2xl font-bold tabular-nums leading-none">
                  {alto.length}
                </span>
                {alto.length > 0 && (
                  <span className="text-neutral-400 dark:text-neutral-500 text-[10px] mb-0.5">concorrentes</span>
                )}
              </div>
            </div>
            {/* Médio risco */}
            <div className={`${CARD} px-3 py-2.5`}>
              <p className={`${LABEL} mb-1.5`}>Risco médio</p>
              <div className="flex items-end gap-1.5">
                <span className="text-neutral-800 dark:text-neutral-100 text-2xl font-bold tabular-nums leading-none">
                  {medio.length}
                </span>
                {medio.length > 0 && (
                  <span className="text-neutral-400 dark:text-neutral-500 text-[10px] mb-0.5">concorrentes</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Análise do raio */}
        {comps.length > 0 && (
          <div className={`${CARD} p-3.5`}>
            <p className={`${LABEL} mb-2`}>Análise do raio</p>
            <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed">{insight}</p>
          </div>
        )}

        {/* Principais ameaças */}
        {alto.length > 0 && (
          <div className={`${CARD} p-3.5`}>
            <p className={`${LABEL} mb-2.5`}>Principais ameaças</p>
            <div>
              {alto.slice(0, 4).map(c => (
                <div
                  key={c.nome}
                  className="flex items-center gap-2 py-2 border-b border-neutral-100 dark:border-[#2e2e2e] last:border-0"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600 flex-shrink-0" />
                  <span className="text-neutral-700 dark:text-neutral-300 text-xs min-w-0 truncate">{c.nome}</span>
                  {c.ticket_medio && (
                    <span className="text-neutral-400 dark:text-neutral-500 text-[10px] flex-shrink-0 ml-auto">
                      {c.ticket_medio}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Padrão competitivo */}
        {strengths.length > 0 && (
          <div className={`${CARD} p-3.5`}>
            <p className={`${LABEL} mb-2.5`}>Padrão competitivo</p>
            <div className="flex flex-wrap gap-1.5">
              {strengths.map(s => (
                <span
                  key={s}
                  className="text-[10px] font-medium px-2 py-0.5 bg-neutral-100 dark:bg-[#353535] text-neutral-600 dark:text-neutral-300 rounded-full border border-neutral-200 dark:border-[#484848]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Oportunidade para Oscar */}
        {topOp && (
          <div className={`${CARD} p-3.5`}>
            <p className={`${LABEL} mb-1.5`}>Oportunidade para Oscar</p>
            <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed">{topOp}</p>
          </div>
        )}

        {/* Dica de interação */}
        {comps.length > 0 && (
          <p className="text-neutral-300 dark:text-neutral-600 text-[10px] text-center pt-1 pb-2">
            Clique em um concorrente para ver inteligência detalhada
          </p>
        )}
      </div>
    </motion.div>
  );
}
