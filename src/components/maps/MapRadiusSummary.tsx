import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import type { Competitor } from '../../types';

interface Props {
  competitors: Competitor[];
  radiusMeters: number;
}

function formatRadius(m: number): string {
  if (m === Infinity) return 'Sem limite — Nacional';
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
  return min === Infinity ? null : `R$ ${min} – R$ ${max}`;
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
      return `${n} concorrentes no raio local. Destaque para ${names} — presença no mesmo shopping e público-alvo similar.`;
    }
    return `${n} concorrentes no raio local, nenhum de alto risco. Raio favorável para Oscar consolidar posicionamento.`;
  }
  if (radiusMeters <= 50000) {
    return `${n} concorrentes na região. Inclui atores do Vale do Paraíba com raio de influência amplo — Taubaté e Jacareí na bacia de clientes da Oscar.`;
  }
  return `${n} concorrentes no mapa, incluindo redes nacionais e e-commerces. A maior parte não compite diretamente com a loja física Oscar em SJC.`;
}

export function MapRadiusSummary({ competitors: comps, radiusMeters }: Props) {
  const alto  = comps.filter(c => c.risco_competitivo === 'alto');
  const medio = comps.filter(c => c.risco_competitivo === 'medio');
  const baixo = comps.filter(c => !c.risco_competitivo || c.risco_competitivo === 'baixo');

  const ticket   = useMemo(() => calcTicketRange(comps), [comps]);
  const strengths = useMemo(() => topTags(comps.map(c => c.faz_bem), 5), [comps]);
  const insight  = useMemo(() => buildInsight(comps, radiusMeters), [comps, radiusMeters]);
  const topOp    = alto[0]?.oportunidade ?? medio[0]?.oportunidade;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="h-full flex flex-col overflow-hidden"
    >
      {/* Cabeçalho */}
      <div className="px-5 pt-5 pb-4 border-b border-white/8 flex-shrink-0">
        <p className="text-white/25 text-[10px] uppercase tracking-wider mb-1">Inteligência competitiva</p>
        <div className="flex items-end justify-between gap-2">
          <h3 className="text-white font-semibold text-sm">Raio de {formatRadius(radiusMeters)}</h3>
          <span className="text-white/30 text-xs flex-shrink-0">{comps.length} concorrentes</span>
        </div>

        {comps.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
            {alto.length > 0 && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                {alto.length} alto risco
              </span>
            )}
            {medio.length > 0 && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                {medio.length} médio
              </span>
            )}
            {baixo.length > 0 && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                {baixo.length} baixo
              </span>
            )}
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

        {/* Estado vazio */}
        {comps.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-white/25 text-xs">Nenhum concorrente neste raio.</p>
            <p className="text-white/15 text-[10px] mt-1">Tente aumentar o raio.</p>
          </div>
        )}

        {/* Insight gerado */}
        {comps.length > 0 && (
          <div className="bg-white/[0.03] border border-white/6 rounded-xl p-3.5">
            <p className="text-white/62 text-xs leading-relaxed">{insight}</p>
          </div>
        )}

        {/* Ticket do raio */}
        {ticket && (
          <div className="flex items-center bg-white/[0.04] rounded-xl px-3 py-2.5">
            <span className="text-white/28 text-[10px] uppercase tracking-wide">Ticket no raio</span>
            <span className="text-white/82 text-xs font-semibold ml-auto">{ticket}</span>
          </div>
        )}

        {/* Principais ameaças */}
        {alto.length > 0 && (
          <div>
            <p className="text-white/25 text-[10px] uppercase tracking-wide mb-2">Principais ameaças</p>
            <div>
              {alto.slice(0, 4).map(c => (
                <div key={c.nome} className="flex items-center gap-2 py-2 border-b border-white/4 last:border-0">
                  <span className="text-red-400/50 text-[8px] flex-shrink-0">●</span>
                  <span className="text-white/68 text-xs min-w-0 truncate">{c.nome}</span>
                  {c.ticket_medio && (
                    <span className="text-white/22 text-[10px] flex-shrink-0 ml-auto">{c.ticket_medio}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Padrão competitivo (top faz_bem) */}
        {strengths.length > 0 && (
          <div>
            <p className="text-white/25 text-[10px] uppercase tracking-wide mb-2">Padrão do raio</p>
            <div className="flex flex-wrap gap-1.5">
              {strengths.map(s => (
                <span
                  key={s}
                  className="text-[10px] px-2 py-0.5 bg-white/[0.05] text-white/48 rounded-full border border-white/6"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Oportunidade para Oscar */}
        {topOp && (
          <div className="bg-emerald-500/8 border border-emerald-500/15 rounded-xl p-3.5">
            <p className="text-emerald-400/55 text-[10px] uppercase tracking-wide mb-1.5">
              Oportunidade para Oscar
            </p>
            <p className="text-white/72 text-xs leading-relaxed">{topOp}</p>
          </div>
        )}

        {/* Dica de interação */}
        {comps.length > 0 && (
          <p className="text-white/16 text-[10px] text-center pt-2">
            Clique em um concorrente para ver inteligência detalhada
          </p>
        )}
      </div>
    </motion.div>
  );
}
