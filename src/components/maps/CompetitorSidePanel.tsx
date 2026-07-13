import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import type { Competitor } from '../../types';

interface Props {
  competitor: Competitor;
  onClose: () => void;
}

const CARD = [
  'bg-[#EFEFF1] dark:bg-[#2f2f2f]',
  'border-[0.5px] border-neutral-200 dark:border-[#3d3d3d]',
  'rounded-2xl',
  'shadow-[0_2px_6px_-2px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_10px_-2px_rgba(0,0,0,0.4)]',
].join(' ');

const LABEL = 'text-[9px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500';

export function CompetitorSidePanel({ competitor: c, onClose }: Props) {
  const riskLabel =
    c.risco_competitivo === 'alto'  ? 'Alto risco' :
    c.risco_competitivo === 'medio' ? 'Médio risco' :
    c.risco_competitivo === 'baixo' ? 'Baixo risco' : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="h-full flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 pt-4 pb-3.5 border-b border-neutral-200 dark:border-[#414141] flex-shrink-0">
        <div className="flex items-start gap-2">
          <button
            onClick={onClose}
            className="flex-shrink-0 mt-0.5 p-1.5 -ml-1 rounded-lg text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title="Voltar ao resumo"
          >
            <ArrowLeft size={14} />
          </button>
          <div className="min-w-0 flex-1">
            <h3 className="text-neutral-800 dark:text-neutral-100 font-semibold text-sm leading-tight truncate">
              {c.nome}
            </h3>
            {(c.cidade || c.endereco) && (
              <p className="text-neutral-400 dark:text-neutral-500 text-[10px] mt-0.5 truncate">
                {[c.cidade, c.endereco].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
          {riskLabel && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 bg-neutral-100 dark:bg-[#3d3d3d] text-neutral-500 dark:text-neutral-400">
              {riskLabel}
            </span>
          )}
        </div>
      </div>

      {/* Scroll */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">

        {/* Reputação + ticket */}
        <div className="grid grid-cols-2 gap-2">
          <div className={`${CARD} px-3 py-2.5`}>
            <p className={`${LABEL} mb-1.5`}>Google</p>
            <p className="text-neutral-800 dark:text-neutral-100 text-2xl font-bold tabular-nums leading-none">
              {Number(c.nota_google).toFixed(1)}
            </p>
            <p className="text-neutral-400 dark:text-neutral-500 text-[9px] mt-1">★ avaliação</p>
          </div>
          {c.ticket_medio ? (
            <div className={`${CARD} px-3 py-2.5`}>
              <p className={`${LABEL} mb-1.5`}>Ticket médio</p>
              <p className="text-neutral-700 dark:text-neutral-200 text-[11px] font-semibold leading-tight">
                {c.ticket_medio}
              </p>
            </div>
          ) : (
            <div className={`${CARD} px-3 py-2.5`}>
              <p className={`${LABEL} mb-1.5`}>Faixa de preço</p>
              <p className="text-neutral-700 dark:text-neutral-200 text-xs font-medium mt-0.5">
                {c.faixa_preco ?? '—'}
              </p>
            </div>
          )}
        </div>

        {/* Presença digital */}
        {c.notas_digitais && c.notas_digitais.length > 0 && (
          <div className={`${CARD} p-3.5`}>
            <p className={`${LABEL} mb-2.5`}>Presença digital</p>
            <div className="space-y-2">
              {c.notas_digitais.map(({ plataforma, nota }) => (
                <div key={plataforma} className="flex items-center gap-2">
                  <span className="text-neutral-400 dark:text-neutral-500 text-[10px] w-[70px] flex-shrink-0 truncate">
                    {plataforma}
                  </span>
                  <div className="flex-1 h-1 bg-neutral-100 dark:bg-[#3a3a3a] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-neutral-400 dark:bg-neutral-500"
                      style={{ width: `${(nota / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-neutral-400 dark:text-neutral-500 text-[10px] w-5 text-right flex-shrink-0">
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
            <p className={`${LABEL} mb-1.5`}>Proposta</p>
            <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed">{c.proposta_principal}</p>
          </div>
        )}

        {/* Pontos fortes / fracos */}
        {((c.faz_bem && c.faz_bem.length > 0) || (c.nao_oferece && c.nao_oferece.length > 0)) && (
          <div className="grid grid-cols-2 gap-2">
            {c.faz_bem && c.faz_bem.length > 0 && (
              <div className={`${CARD} p-3`}>
                <p className={`${LABEL} mb-2`}>Faz bem</p>
                <ul className="space-y-1.5">
                  {c.faz_bem.slice(0, 4).map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-neutral-300 dark:text-neutral-600 text-[8px] mt-0.5 flex-shrink-0">●</span>
                      <span className="text-neutral-600 dark:text-neutral-400 text-[10px] leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {c.nao_oferece && c.nao_oferece.length > 0 && (
              <div className={`${CARD} p-3`}>
                <p className={`${LABEL} mb-2`}>Fraqueza</p>
                <ul className="space-y-1.5">
                  {c.nao_oferece.slice(0, 4).map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-neutral-300 dark:text-neutral-600 text-[8px] mt-0.5 flex-shrink-0">●</span>
                      <span className="text-neutral-600 dark:text-neutral-400 text-[10px] leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Oportunidade para Oscar */}
        {c.oportunidade && (
          <div className={`${CARD} p-3.5`}>
            <p className={`${LABEL} mb-1.5`}>Oportunidade para Oscar</p>
            <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed">{c.oportunidade}</p>
          </div>
        )}

        {/* Fonte + data */}
        {(c.evidencia || c.ultima_atualizacao) && (
          <div className={`${CARD} px-3 py-2.5`}>
            <div className="flex items-start justify-between gap-3">
              {c.evidencia && (
                <div className="min-w-0">
                  <p className={`${LABEL} mb-0.5`}>Fonte</p>
                  <p className="text-neutral-500 dark:text-neutral-500 text-[10px] leading-relaxed">{c.evidencia}</p>
                </div>
              )}
              {c.ultima_atualizacao && (
                <div className="flex-shrink-0 text-right">
                  <p className={`${LABEL} mb-0.5`}>Atualizado</p>
                  <p className="text-neutral-500 dark:text-neutral-500 text-[10px] whitespace-nowrap">
                    {c.ultima_atualizacao}
                  </p>
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
