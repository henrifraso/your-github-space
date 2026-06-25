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

const CARD = 'bg-[#1e1e20] border-[0.5px] border-white/10 rounded-xl shadow-[0_4px_10px_-1px_rgba(0,0,0,0.45),0_1px_2px_rgba(0,0,0,0.3)]';

export function MapRadiusSummary({ competitors: comps, radiusMeters }: Props) {
  const alto  = comps.filter(c => c.risco_competitivo === 'alto');
  const medio = comps.filter(c => c.risco_competitivo === 'medio');
  const baixo = comps.filter(c => !c.risco_competitivo || c.risco_competitivo === 'baixo');

  const ticket    = useMemo(() => calcTicketRange(comps), [comps]);
  const strengths = useMemo(() => topTags(comps.map(c => c.faz_bem), 5), [comps]);
  const insight   = useMemo(() => buildInsight(comps, radiusMeters), [comps, radiusMeters]);
  const topOp     = alto[0]?.oportunidade ?? medio[0]?.oportunidade;

  const dominantRisk = alto.length > 0 ? 'alto' : medio.length > 0 ? 'médio' : 'baixo';
  const dominantColor =
    dominantRisk === 'alto'  ? { bg: 'bg-red-500/15',     text: 'text-red-400' } :
    dominantRisk === 'médio' ? { bg: 'bg-amber-500/15',   text: 'text-amber-400' } :
                               { bg: 'bg-emerald-500/15', text: 'text-emerald-400' };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="h-full flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 pt-5 pb-4 border-b border-white/8 flex-shrink-0">
        <p className="text-white/30 text-[10px] font-semibold uppercase tracking-wider mb-2">
          Inteligência competitiva
        </p>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-white font-semibold text-sm leading-tight">
              Raio de {formatRadius(radiusMeters)}
            </h3>
            <p className="text-white/35 text-[11px] mt-0.5">
              {comps.length} {comps.length === 1 ? 'concorrente' : 'concorrentes'} visíveis
            </p>
          </div>
          {comps.length > 0 && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${dominantColor.bg} ${dominantColor.text}`}>
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
            <p className="text-white/25 text-xs">Nenhum concorrente neste raio.</p>
            <p className="text-white/15 text-[10px] mt-1">Tente aumentar o raio.</p>
          </div>
        )}

        {/* Métricas em grid 2×2 */}
        {comps.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {/* Total */}
            <div className={`${CARD} px-3 py-2.5 flex flex-col gap-1`}>
              <p className="text-white/30 text-[9px] font-semibold uppercase tracking-wide">Total</p>
              <p className="text-white text-2xl font-bold tabular-nums leading-none">{comps.length}</p>
            </div>
            {/* Ticket */}
            <div className={`${CARD} px-3 py-2.5 flex flex-col gap-1`}>
              <p className="text-white/30 text-[9px] font-semibold uppercase tracking-wide">Ticket estimado</p>
              <p className="text-white/85 text-[11px] font-semibold leading-tight mt-0.5">
                {ticket ?? '—'}
              </p>
            </div>
            {/* Alto risco */}
            <div className={`${CARD} px-3 py-2.5 flex flex-col gap-1`}>
              <p className="text-white/30 text-[9px] font-semibold uppercase tracking-wide">Alto risco</p>
              <div className="flex items-end gap-1.5">
                <span className="text-red-400 text-2xl font-bold tabular-nums leading-none">{alto.length}</span>
                {alto.length > 0 && <span className="text-white/25 text-[10px] mb-0.5">concorrentes</span>}
              </div>
            </div>
            {/* Risco médio */}
            <div className={`${CARD} px-3 py-2.5 flex flex-col gap-1`}>
              <p className="text-white/30 text-[9px] font-semibold uppercase tracking-wide">Risco médio</p>
              <div className="flex items-end gap-1.5">
                <span className="text-amber-400 text-2xl font-bold tabular-nums leading-none">{medio.length}</span>
                {medio.length > 0 && <span className="text-white/25 text-[10px] mb-0.5">concorrentes</span>}
              </div>
            </div>
          </div>
        )}

        {/* Insight */}
        {comps.length > 0 && (
          <div className={`${CARD} p-3.5`}>
            <p className="text-white/28 text-[9px] font-semibold uppercase tracking-wide mb-2">Análise do raio</p>
            <p className="text-white/62 text-xs leading-relaxed">{insight}</p>
          </div>
        )}

        {/* Principais ameaças */}
        {alto.length > 0 && (
          <div className={`${CARD} p-3.5`}>
            <p className="text-white/28 text-[9px] font-semibold uppercase tracking-wide mb-2.5">
              Principais ameaças
            </p>
            <div className="space-y-0">
              {alto.slice(0, 4).map(c => (
                <div key={c.nome} className="flex items-center gap-2 py-2 border-b border-white/5 last:border-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400/60 flex-shrink-0" />
                  <span className="text-white/72 text-xs min-w-0 truncate">{c.nome}</span>
                  {c.ticket_medio && (
                    <span className="text-white/22 text-[10px] flex-shrink-0 ml-auto">{c.ticket_medio}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Padrão competitivo */}
        {strengths.length > 0 && (
          <div className={`${CARD} p-3.5`}>
            <p className="text-white/28 text-[9px] font-semibold uppercase tracking-wide mb-2.5">
              Padrão competitivo
            </p>
            <div className="flex flex-wrap gap-1.5">
              {strengths.map(s => (
                <span
                  key={s}
                  className="text-[10px] font-medium px-2 py-0.5 bg-white/[0.06] text-white/50 rounded-full border-[0.5px] border-white/10"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Oportunidade */}
        {topOp && (
          <div className="bg-emerald-950/60 border-[0.5px] border-emerald-500/20 rounded-xl p-3.5 shadow-[0_4px_10px_-1px_rgba(0,0,0,0.45)]">
            <p className="text-emerald-400/60 text-[9px] font-semibold uppercase tracking-wide mb-1.5">
              Oportunidade para Oscar
            </p>
            <p className="text-white/72 text-xs leading-relaxed">{topOp}</p>
          </div>
        )}

        {/* Dica */}
        {comps.length > 0 && (
          <p className="text-white/16 text-[10px] text-center pt-1 pb-2">
            Clique em um concorrente para ver inteligência detalhada
          </p>
        )}
      </div>
    </motion.div>
  );
}
