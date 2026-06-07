// Hook das 10 ações OS¹ do Mapa Competitivo.
//
// Encapsula o switch de `runMapAction` que vivia inline em
// src/components/maps/CompetitiveMap.tsx (Fase 14), preservando:
//   - IDs das 10 ações (mesma string literal `feed-from-radius`, ...)
//   - mesma ordem de checks
//   - mesmas chamadas de `buildX(ctx)` / `dispatchMapAction(...)`
//   - mesma mensagem de toast por ação
//
// Toast funciona via state local + ref de timer (auto-clear em 2400ms).
// O caller só precisa renderizar o `toast` retornado e chamar
// `runMapAction(id)` no clique do menu.

import { useRef, useState, useCallback } from 'react';
import {
  dispatchMapAction,
  buildMapFeedCards,
  buildCompetitionAnalysis,
  buildOpportunities,
  buildComparison,
  buildMapMission,
  addTerritoryWatcher,
  buildRiskAnalysis,
  buildSectorOpportunities,
  buildNearbyPartners,
  buildTerritorySimulation,
  type MapContextSnapshot,
} from '../../lib/map-actions';
import type { CompetitorWithDistance } from './useMapAnalysis';

export type MapActionId =
  | 'feed-from-radius' | 'analyze-competition' | 'find-opportunities' | 'compare-regions' | 'territory-to-mission'
  | 'monitor-territory' | 'risk-map' | 'sector-opportunities' | 'nearby-partners' | 'simulate-territory-action';

export interface UseMapActionsArgs {
  /** Devolve um snapshot fresco do contexto do mapa (raio, filtrados, etc.). */
  buildCtx: () => MapContextSnapshot;
  /** Lista completa com distâncias — usada apenas pelo `compare-regions`. */
  allWithDistance: CompetitorWithDistance[];
}

export interface UseMapActionsReturn {
  toast: string;
  runMapAction: (type: MapActionId) => void;
  /** Limpa o toast manualmente (raro — auto-clear faz o trabalho). */
  clearToast: () => void;
}

export function useMapActions({ buildCtx, allWithDistance }: UseMapActionsArgs): UseMapActionsReturn {
  const [toast, setToast] = useState<string>('');
  const toastTimerRef = useRef<number | null>(null);

  const flashToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(''), 2400) as unknown as number;
  }, []);

  const clearToast = useCallback(() => setToast(''), []);

  const runMapAction = useCallback((type: MapActionId) => {
    const ctx = buildCtx();
    if (type === 'feed-from-radius') {
      const cards = buildMapFeedCards(ctx);
      dispatchMapAction({ type, context: ctx, payload: cards });
      // Etapa 11: toast distingue novo vs deduplicado
      const isDedup = cards.length > 0 && cards.every(c => c.deduped);
      flashToast(isDedup
        ? `Este sinal territorial já está no Feed (${cards.length} card(s) atualizado(s))`
        : `${cards.length} card(s) criado(s) no Feed a partir deste território`
      );
      return;
    }
    if (type === 'analyze-competition') {
      dispatchMapAction({ type, context: ctx, payload: buildCompetitionAnalysis(ctx) });
      flashToast('Análise competitiva pronta na Área de Trabalho');
      return;
    }
    if (type === 'find-opportunities') {
      dispatchMapAction({ type, context: ctx, payload: buildOpportunities(ctx) });
      flashToast('Oportunidades territoriais prontas na Área de Trabalho');
      return;
    }
    if (type === 'compare-regions') {
      dispatchMapAction({ type, context: ctx, payload: buildComparison(ctx, allWithDistance) });
      flashToast('Comparação entre raios pronta na Área de Trabalho');
      return;
    }
    if (type === 'territory-to-mission') {
      dispatchMapAction({ type, context: ctx, payload: buildMapMission(ctx) });
      flashToast('Missão territorial pronta na Área de Trabalho');
      return;
    }
    // ── P5: novas 5 ──
    if (type === 'monitor-territory') {
      addTerritoryWatcher(ctx);
      dispatchMapAction({ type, context: ctx });
      flashToast('Território registrado na watchlist Codify — sem detecção automática ativa');
      return;
    }
    if (type === 'risk-map') {
      dispatchMapAction({ type, context: ctx, payload: buildRiskAnalysis(ctx) });
      flashToast('Mapa de risco territorial pronto na Área de Trabalho');
      return;
    }
    if (type === 'sector-opportunities') {
      dispatchMapAction({ type, context: ctx, payload: buildSectorOpportunities(ctx) });
      flashToast('Oportunidades por setor prontas na Área de Trabalho');
      return;
    }
    if (type === 'nearby-partners') {
      dispatchMapAction({ type, context: ctx, payload: buildNearbyPartners(ctx) });
      flashToast('Candidatos a parceria prontos na Área de Trabalho');
      return;
    }
    if (type === 'simulate-territory-action') {
      dispatchMapAction({ type, context: ctx, payload: buildTerritorySimulation(ctx) });
      flashToast('Simulação territorial pronta na Área de Trabalho — estimativa, não previsão');
      return;
    }
  }, [buildCtx, allWithDistance, flashToast]);

  return { toast, runMapAction, clearToast };
}
