import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'motion/react';
import type { Competitor } from '../../types';
import { ratingColor, formatNota } from '../../features/map/map-ui-utils';

interface Props {
  competitor: Competitor;
  onClose: () => void;
  onDeepAnalysis?: (c: Competitor) => void;
}

export function CompetitorCard({ competitor: c, onClose, onDeepAnalysis }: Props) {
  const color = ratingColor(c.nota_google);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 32 }}
      transition={{ duration: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
      className="absolute bottom-0 left-0 right-0 lg:bottom-auto lg:top-0 lg:right-0 lg:left-auto lg:w-80 z-[1200] bg-[#1a1a1a] border border-white/10 rounded-t-2xl lg:rounded-2xl lg:m-3 overflow-hidden"
    >
      <div className="flex items-start justify-between p-4 border-b border-white/8">
        <div>
          <h3 className="text-white font-semibold text-sm leading-tight">{c.nome}</h3>
          <p className="text-white/40 text-xs mt-0.5">{c.endereco}</p>
        </div>
        <button onClick={onClose} className="p-1 text-white/40 hover:text-white transition-colors cursor-pointer flex-shrink-0 ml-2">
          <X size={16} />
        </button>
      </div>

      <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
        {/* Nota geral */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold" style={{ color }}>★ {formatNota(c.nota_google)}</span>
          <span className="text-white/40 text-xs">{c.faixa_preco}</span>
        </div>

        {/* Notas por plataforma */}
        {c.notas_digitais && c.notas_digitais.length > 0 && (
          <div className="space-y-1.5">
            {c.notas_digitais.map(({ plataforma, nota }) => (
              <div key={plataforma} className="flex items-center gap-2">
                <span className="text-white/50 text-xs w-14 flex-shrink-0">{plataforma}</span>
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-[#f59e0b]" style={{ width: `${(nota / 5) * 100}%` }} />
                </div>
                <span className="text-white/60 text-xs w-6 text-right">{nota.toFixed(1)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Proposta */}
        {c.proposta_principal && (
          <div>
            <p className="text-white/40 text-[10px] uppercase tracking-wide mb-1">Proposta</p>
            <p className="text-white/80 text-xs leading-relaxed">{c.proposta_principal}</p>
          </div>
        )}

        {/* Diferencial */}
        {c.diferencial && (
          <div>
            <p className="text-white/40 text-[10px] uppercase tracking-wide mb-1">Diferencial</p>
            <p className="text-white/80 text-xs leading-relaxed">{c.diferencial}</p>
          </div>
        )}

        {/* Pontos fortes */}
        {c.faz_bem && c.faz_bem.length > 0 && (
          <div>
            <p className="text-white/40 text-[10px] uppercase tracking-wide mb-1">Pontos fortes</p>
            <ul className="space-y-0.5">
              {c.faz_bem.map((item, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-white/70">
                  <span className="text-[#22c55e] mt-0.5 flex-shrink-0">●</span>{item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pontos fracos */}
        {c.nao_oferece && c.nao_oferece.length > 0 && (
          <div>
            <p className="text-white/40 text-[10px] uppercase tracking-wide mb-1">Pontos fracos</p>
            <ul className="space-y-0.5">
              {c.nao_oferece.map((item, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-white/70">
                  <span className="text-[#ef4444] mt-0.5 flex-shrink-0">●</span>{item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Ticket médio estimado */}
        {c.ticket_medio && (
          <div className="flex items-center gap-2">
            <p className="text-white/40 text-[10px] uppercase tracking-wide">Ticket médio</p>
            <p className="text-white/80 text-xs font-medium">{c.ticket_medio}</p>
          </div>
        )}

        {/* Risco competitivo */}
        {c.risco_competitivo && (
          <div className="flex items-center gap-2">
            <p className="text-white/40 text-[10px] uppercase tracking-wide">Risco</p>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              c.risco_competitivo === 'alto'  ? 'bg-red-500/20 text-red-400' :
              c.risco_competitivo === 'medio' ? 'bg-amber-500/20 text-amber-400' :
                                                'bg-emerald-500/20 text-emerald-400'
            }`}>
              {c.risco_competitivo.charAt(0).toUpperCase() + c.risco_competitivo.slice(1)}
            </span>
          </div>
        )}

        {/* Oportunidade para Oscar */}
        {c.oportunidade && (
          <div>
            <p className="text-white/40 text-[10px] uppercase tracking-wide mb-1">Oportunidade</p>
            <p className="text-white/80 text-xs leading-relaxed">{c.oportunidade}</p>
          </div>
        )}

        {/* Evidência / fonte */}
        {c.evidencia && (
          <div className="border-t border-white/6 pt-2 flex items-start gap-1.5">
            <span className="text-white/25 text-[10px] flex-shrink-0 mt-px">Fonte:</span>
            <span className="text-white/35 text-[10px] leading-relaxed">{c.evidencia}</span>
          </div>
        )}

        {/* Última atualização */}
        {c.ultima_atualizacao && (
          <p className="text-white/20 text-[10px] text-right">{c.ultima_atualizacao}</p>
        )}

        {/* Botão análise profunda */}
        {onDeepAnalysis && (
          <button
            onClick={() => onDeepAnalysis(c)}
            className="w-full mt-2 h-9 border border-[#3b82f6] text-[#3b82f6] text-xs font-medium rounded-xl hover:bg-[#3b82f6]/10 transition-colors cursor-pointer"
          >
            Análise profunda
          </button>
        )}
      </div>
    </motion.div>
  );
}
