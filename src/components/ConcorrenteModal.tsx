import React from 'react';
import { motion } from 'motion/react';
import { MapPin, TrendingUp, Zap, CheckCircle, XCircle, Clock } from 'lucide-react';
import type { Competitor } from '../types';

function notaPublica(c: Competitor): number {
  if (!c.notas_digitais || c.notas_digitais.length === 0) return Number(c.nota_google) || 0;
  const soma = c.notas_digitais.reduce((s, n) => s + n.nota, 0);
  return soma / c.notas_digitais.length;
}

function notaColor(n: number) {
  if (n >= 4.3) return { bg: 'rgba(34,197,94,0.10)', border: 'rgba(34,197,94,0.25)', text: '#16a34a' };
  if (n >= 4.0) return { bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.25)', text: '#d97706' };
  return { bg: 'rgba(239,68,68,0.10)', border: 'rgba(239,68,68,0.25)', text: '#dc2626' };
}

function ScoreBar({ label, nota }: { label: string; nota: number }) {
  const pct = (nota / 5) * 100;
  const { text } = notaColor(nota);
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-neutral-500 w-20 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-neutral-100 dark:bg-[#262626] overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ backgroundColor: text }}
          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }} />
      </div>
      <span className="text-xs font-semibold w-6 text-right flex-shrink-0" style={{ color: text }}>
        {nota.toFixed(1)}
      </span>
    </div>
  );
}

export function ConcorrenteModal({ concorrente, onClose }: { concorrente: Competitor; onClose: () => void }) {
  const notaMedia = notaPublica(concorrente);
  const { bg, border, text } = notaColor(notaMedia);

  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full md:max-w-md bg-[#fafafa] dark:bg-[#161616] rounded-t-2xl md:rounded-2xl overflow-y-auto border border-transparent dark:border-[#262626]"
        style={{ maxHeight: '88vh' }}>

        {/* Header */}
        <div className="flex items-start gap-3 px-6 pt-6 pb-4">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#3b82f6] flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
            {concorrente.nome.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-neutral-800 dark:text-white leading-tight">{concorrente.nome}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin size={12} className="text-neutral-500 flex-shrink-0" />
              <span className="text-xs text-neutral-500 truncate">{concorrente.endereco}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-white text-2xl leading-none p-1 flex-shrink-0 transition-colors duration-200">×</button>
        </div>

        {/* Nota Pública Digital */}
        <div className="mx-6 mb-4 rounded-2xl px-5 py-4 border" style={{ background: bg, borderColor: border }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: text }}>Nota Pública Digital</span>
            <span className="text-xs text-neutral-500">{concorrente.notas_digitais?.length ?? 1} plataforma{(concorrente.notas_digitais?.length ?? 1) > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-end gap-2 mb-3">
            <span className="text-4xl font-bold leading-none" style={{ color: text }}>{notaMedia.toFixed(1)}</span>
            <span className="text-neutral-500 text-sm mb-1">/ 5.0</span>
            <span className="text-[#f59e0b] text-base tracking-wide mb-0.5">{'★'.repeat(Math.round(notaMedia))}</span>
          </div>
          {concorrente.notas_digitais && concorrente.notas_digitais.length > 0 && (
            <div className="space-y-1.5">
              {concorrente.notas_digitais.map(n => (
                <ScoreBar key={n.plataforma} label={n.plataforma} nota={n.nota} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-5 px-6 pb-6">

          {/* Proposta Principal */}
          {concorrente.proposta_principal && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <TrendingUp size={14} className="text-[#3b82f6]" />
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Proposta Principal</span>
              </div>
              <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed">{concorrente.proposta_principal}</p>
            </div>
          )}

          {/* Diferencial */}
          {concorrente.diferencial && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Zap size={14} className="text-[#f59e0b]" />
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Diferencial</span>
              </div>
              <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed">{concorrente.diferencial}</p>
            </div>
          )}

          {/* Pontos Fortes */}
          {concorrente.faz_bem && concorrente.faz_bem.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <CheckCircle size={14} className="text-[#22c55e]" />
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Pontos Fortes</span>
              </div>
              <div className="space-y-2">
                {concorrente.faz_bem.map((t, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] flex-shrink-0 mt-1.5" />
                    <span className="text-sm text-neutral-800 dark:text-neutral-200">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pontos Fracos */}
          {concorrente.nao_oferece && concorrente.nao_oferece.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <XCircle size={14} className="text-[#ef4444]" />
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Pontos Fracos</span>
              </div>
              <div className="space-y-2">
                {concorrente.nao_oferece.map((t, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] flex-shrink-0 mt-1.5" />
                    <span className="text-sm text-neutral-800 dark:text-neutral-200">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mudanças Recentes */}
          {concorrente.mudancas_recentes && concorrente.mudancas_recentes.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Clock size={14} className="text-[#a855f7]" />
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Mudanças Recentes</span>
              </div>
              <div className="space-y-2">
                {concorrente.mudancas_recentes.map((m, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7] flex-shrink-0 mt-1.5" />
                    <span className="text-sm text-neutral-500 leading-relaxed">{m}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Faixa de Preço */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-[#262626]">
            <span className="text-xs text-neutral-500">Faixa de preço</span>
            <span className="text-sm font-bold text-neutral-800 dark:text-neutral-200">{concorrente.faixa_preco}</span>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
