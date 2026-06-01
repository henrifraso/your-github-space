// Resultados visuais das ações do Mapa Competitivo.
//
// Exporta dois componentes:
//   - MapActionToast     toast inferior que mostra feedback de cada
//                        ação OS¹ executada (auto-clear via hook)
//   - MapAnalysisPanel   painel lateral com leitura do raio atual
//                        (concorrentes / nota / cores / strongest/weakest)
//
// Conteúdo movido de src/components/maps/CompetitiveMap.tsx (Fase 14)
// byte-a-byte. JSX, classes, ordem dos blocos, símbolos (★) e textos
// preservados.

import { Sparkles, X } from 'lucide-react';
import type { MapAnalysisResult } from './useMapAnalysis';

// ── Toast de feedback ───────────────────────────────────────────────
export function MapActionToast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[197] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[rgba(20,20,22,0.94)] border border-white/8 shadow-[0_8px_30px_rgba(0,0,0,0.5)] text-white text-xs font-medium">
      <Sparkles size={12} strokeWidth={2} className="text-[#fbbf24]" />
      {message}
    </div>
  );
}

// ── Painel de análise do raio ───────────────────────────────────────
interface MapAnalysisPanelProps {
  analysis: MapAnalysisResult;
  onClose: () => void;
}

export function MapAnalysisPanel({ analysis, onClose }: MapAnalysisPanelProps) {
  return (
    <div className="absolute top-[130px] left-3 right-3 lg:left-auto lg:right-3 lg:w-72 bg-[#1a1a1a] border border-white/10 rounded-2xl p-4 text-xs space-y-3 shadow-2xl">
      <div className="flex justify-between items-center">
        <span className="text-white/60 font-semibold uppercase tracking-wider text-[10px]">Análise do raio</span>
        <button onClick={onClose} className="text-white/30 hover:text-white cursor-pointer"><X size={14} /></button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white/5 rounded-xl p-2.5">
          <p className="text-white/40 text-[10px]">Concorrentes</p>
          <p className="text-white font-bold text-lg">{analysis.total}</p>
        </div>
        <div className="bg-white/5 rounded-xl p-2.5">
          <p className="text-white/40 text-[10px]">Nota média</p>
          <p className="text-white font-bold text-lg">★ {analysis.avg.toFixed(1)}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 bg-white/5 rounded-xl p-2 text-center">
          <p className="text-[#22c55e] font-bold text-sm">{analysis.green}</p>
          <p className="text-white/30 text-[9px]">≥ 4.3</p>
        </div>
        <div className="flex-1 bg-white/5 rounded-xl p-2 text-center">
          <p className="text-[#f59e0b] font-bold text-sm">{analysis.orange}</p>
          <p className="text-white/30 text-[9px]">4.0–4.2</p>
        </div>
        <div className="flex-1 bg-white/5 rounded-xl p-2 text-center">
          <p className="text-[#ef4444] font-bold text-sm">{analysis.red}</p>
          <p className="text-white/30 text-[9px]">{'< 4.0'}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 bg-white/5 rounded-xl p-2 text-center">
          <p className="text-white font-bold text-sm">{analysis.diretos}</p>
          <p className="text-white/30 text-[9px]">Diretos</p>
        </div>
        <div className="flex-1 bg-white/5 rounded-xl p-2 text-center">
          <p className="text-white font-bold text-sm">{analysis.indiretos}</p>
          <p className="text-white/30 text-[9px]">Indiretos</p>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-2.5">
        <p className="text-white/40 text-[10px] mb-0.5">Mais forte</p>
        <p className="text-white text-xs font-medium">{analysis.strongest.nome}</p>
        <p className="text-white/40 text-[10px]">★ {Number(analysis.strongest.nota_google).toFixed(1)}</p>
      </div>
      <div className="bg-white/5 rounded-xl p-2.5">
        <p className="text-white/40 text-[10px] mb-0.5">Mais fraco</p>
        <p className="text-white text-xs font-medium">{analysis.weakest.nome}</p>
        <p className="text-white/40 text-[10px]">★ {Number(analysis.weakest.nota_google).toFixed(1)}</p>
      </div>
    </div>
  );
}
