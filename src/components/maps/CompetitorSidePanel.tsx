import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'motion/react';
import type { Competitor } from '../../types';

interface Props {
  competitor: Competitor;
  onClose: () => void;
}

function ratingColor(n: number | string) {
  const v = Number(n);
  if (v >= 4.3) return '#22c55e';
  if (v >= 4.0) return '#f59e0b';
  return '#ef4444';
}

export function CompetitorSidePanel({ competitor: c, onClose }: Props) {
  const color = ratingColor(c.nota_google);

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-[400px] flex-shrink-0 h-full flex flex-col bg-[#161618] border-l border-white/10 overflow-hidden"
    >
      {/* Cabeçalho */}
      <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-white/8 flex-shrink-0">
        <div className="min-w-0 mr-3">
          <h3 className="text-white font-semibold text-sm leading-tight truncate">{c.nome}</h3>
          <p className="text-white/35 text-xs mt-0.5 truncate">{c.cidade} · {c.endereco}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-white/25 hover:text-white transition-colors cursor-pointer flex-shrink-0 rounded-lg hover:bg-white/6"
        >
          <X size={15} />
        </button>
      </div>

      {/* Conteúdo scrollável */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

        {/* Reputação + faixa de preço + badge de risco */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xl font-bold" style={{ color }}>
            ★ {Number(c.nota_google).toFixed(1)}
          </span>
          <span className="text-white/35 text-xs">{c.faixa_preco}</span>
          {c.risco_competitivo && (
            <span className={`ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              c.risco_competitivo === 'alto'  ? 'bg-red-500/20 text-red-400' :
              c.risco_competitivo === 'medio' ? 'bg-amber-500/20 text-amber-400' :
                                                'bg-emerald-500/20 text-emerald-400'
            }`}>
              Risco {c.risco_competitivo}
            </span>
          )}
        </div>

        {/* Ticket médio */}
        {c.ticket_medio && (
          <div className="flex items-center bg-white/[0.04] rounded-xl px-3 py-2.5">
            <span className="text-white/35 text-[10px] uppercase tracking-wide">Ticket médio estimado</span>
            <span className="text-white/90 text-xs font-semibold ml-auto">{c.ticket_medio}</span>
          </div>
        )}

        {/* Presença digital */}
        {c.notas_digitais && c.notas_digitais.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-white/30 text-[10px] uppercase tracking-wide">Presença digital</p>
            {c.notas_digitais.map(({ plataforma, nota }) => (
              <div key={plataforma} className="flex items-center gap-2">
                <span className="text-white/45 text-xs w-20 flex-shrink-0">{plataforma}</span>
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-[#f59e0b]" style={{ width: `${(nota / 5) * 100}%` }} />
                </div>
                <span className="text-white/55 text-xs w-6 text-right">{nota.toFixed(1)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Proposta */}
        {c.proposta_principal && (
          <div>
            <p className="text-white/30 text-[10px] uppercase tracking-wide mb-1">Proposta</p>
            <p className="text-white/70 text-xs leading-relaxed">{c.proposta_principal}</p>
          </div>
        )}

        {/* Pontos fortes */}
        {c.faz_bem && c.faz_bem.length > 0 && (
          <div>
            <p className="text-white/30 text-[10px] uppercase tracking-wide mb-1.5">Pontos fortes</p>
            <ul className="space-y-1">
              {c.faz_bem.map((item, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-white/65">
                  <span className="text-[#22c55e] mt-0.5 flex-shrink-0 text-[8px]">●</span>{item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pontos fracos */}
        {c.nao_oferece && c.nao_oferece.length > 0 && (
          <div>
            <p className="text-white/30 text-[10px] uppercase tracking-wide mb-1.5">Pontos fracos</p>
            <ul className="space-y-1">
              {c.nao_oferece.map((item, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-white/65">
                  <span className="text-[#ef4444] mt-0.5 flex-shrink-0 text-[8px]">●</span>{item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Oportunidade para Oscar */}
        {c.oportunidade && (
          <div className="bg-emerald-500/8 border border-emerald-500/15 rounded-xl p-3.5">
            <p className="text-emerald-400/60 text-[10px] uppercase tracking-wide mb-1.5">
              Oportunidade para Oscar
            </p>
            <p className="text-white/78 text-xs leading-relaxed">{c.oportunidade}</p>
          </div>
        )}

        {/* Fonte + última atualização */}
        {(c.evidencia || c.ultima_atualizacao) && (
          <div className="border-t border-white/6 pt-3 flex items-start justify-between gap-3">
            {c.evidencia && (
              <div className="flex items-start gap-1.5 min-w-0">
                <span className="text-white/20 text-[10px] flex-shrink-0 mt-px">Fonte:</span>
                <span className="text-white/28 text-[10px] leading-relaxed">{c.evidencia}</span>
              </div>
            )}
            {c.ultima_atualizacao && (
              <span className="text-white/20 text-[10px] flex-shrink-0 whitespace-nowrap">
                {c.ultima_atualizacao}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
