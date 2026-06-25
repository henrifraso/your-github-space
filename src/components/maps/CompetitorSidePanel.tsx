import React from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import type { Competitor } from '../../types';

interface Props {
  competitor: Competitor;
  onClose: () => void;
}

function ratingColor(n: number | string): string {
  const v = Number(n);
  if (v >= 4.3) return 'text-emerald-400';
  if (v >= 4.0) return 'text-amber-400';
  return 'text-red-400';
}

const CARD = 'bg-[#1e1e20] border-[0.5px] border-white/10 rounded-xl shadow-[0_4px_10px_-1px_rgba(0,0,0,0.45),0_1px_2px_rgba(0,0,0,0.3)]';

export function CompetitorSidePanel({ competitor: c, onClose }: Props) {
  const ratingCls = ratingColor(c.nota_google);
  const riskBg =
    c.risco_competitivo === 'alto'  ? 'bg-red-500/15 text-red-400' :
    c.risco_competitivo === 'medio' ? 'bg-amber-500/15 text-amber-400' :
                                      'bg-emerald-500/15 text-emerald-400';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="h-full flex flex-col bg-[#161618] overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3.5 border-b border-white/8 flex-shrink-0">
        <div className="flex items-start gap-2">
          <button
            onClick={onClose}
            className="p-1.5 -ml-1 text-white/25 hover:text-white/60 transition-colors cursor-pointer rounded-lg hover:bg-white/5 flex-shrink-0 mt-0.5"
            title="Voltar ao resumo"
          >
            <ArrowLeft size={14} />
          </button>
          <div className="min-w-0 flex-1">
            <h3 className="text-white font-semibold text-sm leading-tight truncate pr-1">
              {c.nome}
            </h3>
            {(c.cidade || c.endereco) && (
              <p className="text-white/30 text-[10px] mt-0.5 truncate">
                {[c.cidade, c.endereco].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
          {c.risco_competitivo && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${riskBg}`}>
              {c.risco_competitivo === 'alto' ? 'Alto risco' :
               c.risco_competitivo === 'medio' ? 'Médio' : 'Baixo'}
            </span>
          )}
        </div>
      </div>

      {/* Scroll */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">

        {/* Reputação + ticket em grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Nota Google */}
          <div className={`${CARD} px-3 py-2.5 flex flex-col gap-1`}>
            <p className="text-white/28 text-[9px] font-semibold uppercase tracking-wide">Google</p>
            <p className={`text-2xl font-bold tabular-nums leading-none ${ratingCls}`}>
              {Number(c.nota_google).toFixed(1)}
            </p>
            <p className="text-white/20 text-[9px]">★ avaliação</p>
          </div>
          {/* Ticket */}
          {c.ticket_medio ? (
            <div className={`${CARD} px-3 py-2.5 flex flex-col gap-1`}>
              <p className="text-white/28 text-[9px] font-semibold uppercase tracking-wide">Ticket médio</p>
              <p className="text-white/85 text-[11px] font-semibold leading-tight mt-0.5">{c.ticket_medio}</p>
            </div>
          ) : (
            <div className={`${CARD} px-3 py-2.5 flex flex-col gap-1`}>
              <p className="text-white/28 text-[9px] font-semibold uppercase tracking-wide">Preço</p>
              <p className="text-white/55 text-xs font-medium mt-0.5">{c.faixa_preco ?? '—'}</p>
            </div>
          )}
        </div>

        {/* Presença digital */}
        {c.notas_digitais && c.notas_digitais.length > 0 && (
          <div className={`${CARD} p-3.5`}>
            <p className="text-white/28 text-[9px] font-semibold uppercase tracking-wide mb-2.5">
              Presença digital
            </p>
            <div className="space-y-2">
              {c.notas_digitais.map(({ plataforma, nota }) => (
                <div key={plataforma} className="flex items-center gap-2">
                  <span className="text-white/38 text-[10px] w-[72px] flex-shrink-0 truncate">{plataforma}</span>
                  <div className="flex-1 h-1 bg-white/8 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-400/70"
                      style={{ width: `${(nota / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-white/40 text-[10px] w-5 text-right flex-shrink-0">
                    {nota.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Proposta */}
        {c.proposta_principal && (
          <div className={`${CARD} p-3.5`}>
            <p className="text-white/28 text-[9px] font-semibold uppercase tracking-wide mb-1.5">Proposta</p>
            <p className="text-white/65 text-xs leading-relaxed">{c.proposta_principal}</p>
          </div>
        )}

        {/* Pontos fortes / fracos */}
        {((c.faz_bem && c.faz_bem.length > 0) || (c.nao_oferece && c.nao_oferece.length > 0)) && (
          <div className="grid grid-cols-2 gap-2">
            {c.faz_bem && c.faz_bem.length > 0 && (
              <div className={`${CARD} p-3`}>
                <p className="text-emerald-400/50 text-[9px] font-semibold uppercase tracking-wide mb-2">
                  Faz bem
                </p>
                <ul className="space-y-1.5">
                  {c.faz_bem.slice(0, 4).map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400/50 text-[8px] mt-0.5 flex-shrink-0">●</span>
                      <span className="text-white/58 text-[10px] leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {c.nao_oferece && c.nao_oferece.length > 0 && (
              <div className={`${CARD} p-3`}>
                <p className="text-red-400/50 text-[9px] font-semibold uppercase tracking-wide mb-2">
                  Fraqueza
                </p>
                <ul className="space-y-1.5">
                  {c.nao_oferece.slice(0, 4).map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-red-400/50 text-[8px] mt-0.5 flex-shrink-0">●</span>
                      <span className="text-white/58 text-[10px] leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Oportunidade */}
        {c.oportunidade && (
          <div className="bg-emerald-950/60 border-[0.5px] border-emerald-500/20 rounded-xl p-3.5 shadow-[0_4px_10px_-1px_rgba(0,0,0,0.45)]">
            <p className="text-emerald-400/55 text-[9px] font-semibold uppercase tracking-wide mb-1.5">
              Oportunidade para Oscar
            </p>
            <p className="text-white/72 text-xs leading-relaxed">{c.oportunidade}</p>
          </div>
        )}

        {/* Fonte + data */}
        {(c.evidencia || c.ultima_atualizacao) && (
          <div className={`${CARD} px-3 py-2.5`}>
            <div className="flex items-start justify-between gap-3">
              {c.evidencia && (
                <div className="min-w-0">
                  <p className="text-white/20 text-[9px] font-semibold uppercase tracking-wide mb-0.5">Fonte</p>
                  <p className="text-white/30 text-[10px] leading-relaxed">{c.evidencia}</p>
                </div>
              )}
              {c.ultima_atualizacao && (
                <div className="flex-shrink-0 text-right">
                  <p className="text-white/20 text-[9px] font-semibold uppercase tracking-wide mb-0.5">
                    Atualizado
                  </p>
                  <p className="text-white/28 text-[10px] whitespace-nowrap">{c.ultima_atualizacao}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="pb-2" />
      </div>
    </motion.div>
  );
}
