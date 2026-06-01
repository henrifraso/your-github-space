// useOS1MapBridge — ponte do Mapa Competitivo OS¹.
//
// Escuta `OS1_EVENTS.MAP_ACTION` e roteia as 10 ações territoriais:
//   feed-from-radius, analyze-competition, find-opportunities,
//   compare-regions, territory-to-mission, monitor-territory, risk-map,
//   sector-opportunities, nearby-partners, simulate-territory-action.
//
// `monitor-territory` é silenciosa — só persiste em localStorage no
// próprio CompetitiveMap; o mapa continua aberto.
//
// Conteúdo extraído de src/App.tsx (Fase 17) — sem alteração de
// comportamento. Mesmas closures, mesmo dep array (`[activeSector]`),
// mesmos textos, mesmos IDs `synth-map-*`, mesmo `setMapOpen(false)`.

import { useEffect } from 'react';
import { OS1_EVENTS } from './os1-events';
import type { IntelligenceCard, WorkspaceIntent } from '../types/card';
import type { RoleFeedCard } from '../../config/roleConfig';
import {
  mapPayloadToFeedCards,
  type MapGeneratedCard,
} from '../../features/feed/feed-generated-cards';

interface UseOS1MapBridgeArgs {
  activeSector: string;
  onWorkspaceCard: (card: IntelligenceCard, intent: WorkspaceIntent) => void;
  /** Adiciona N cards no TOPO da lista de cards gerados pelo mapa. */
  onMapCards: (cards: RoleFeedCard[]) => void;
  /** Fecha o overlay do CompetitiveMap (= `setMapOpen(false)`). */
  closeMap: () => void;
}

export function useOS1MapBridge({
  activeSector, onWorkspaceCard, onMapCards, closeMap,
}: UseOS1MapBridgeArgs): void {
  useEffect(() => {
    function handler(e: Event) {
      const ce = e as CustomEvent<{
        type: 'feed-from-radius' | 'analyze-competition' | 'find-opportunities' | 'compare-regions' | 'territory-to-mission' | 'monitor-territory' | 'risk-map' | 'sector-opportunities' | 'nearby-partners' | 'simulate-territory-action';
        context: { center: { lat: number; lng: number }; radius: number; sector: string };
        payload?: any;
      }>;
      const d = ce.detail;
      if (!d) return;
      const sector = (d.context.sector || activeSector || 'os1');
      const synthBase = {
        confianca: 'media' as const,
        confianca_score: 0.5,
        impacto: 'a avaliar',
        risco_erro: 0.4,
        _synthetic: true as const,
      };

      // F1 — Gerar feed do raio: injeta múltiplos cards no feed
      if (d.type === 'feed-from-radius') {
        const cards = (d.payload ?? []) as MapGeneratedCard[];
        const novos = mapPayloadToFeedCards(cards, sector);
        onMapCards(novos);
        return;
      }

      // F2 — Analisar concorrência local: card pra workspace
      if (d.type === 'analyze-competition') {
        const a = d.payload;
        const card: IntelligenceCard = {
          ...synthBase,
          id: `synth-map-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          titulo: 'Análise de concorrência local',
          resumo: a?.resumo ?? 'Análise gerada pelo mapa.',
          por_que_importa: `Riscos: ${(a?.riscos ?? []).join(' · ')}`,
          onde_afeta: sector,
          o_que_fazer: a?.recomendacao ?? '',
          dominio: sector,
          area: 'concorrencia',
          urgencia: 'media',
          tipo_card: 'informacao',
        };
        onWorkspaceCard(card, 'utilizar');
        closeMap();
        return;
      }

      // F3 — Encontrar oportunidades
      if (d.type === 'find-opportunities') {
        const op = d.payload;
        const card: IntelligenceCard = {
          ...synthBase,
          id: `synth-map-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          titulo: 'Oportunidades no território',
          resumo: op?.resumo ?? 'Oportunidades detectadas no raio.',
          por_que_importa: (op?.oportunidades ?? []).slice(0, 3).join(' · '),
          onde_afeta: sector,
          o_que_fazer: op?.acaoRecomendada ?? '',
          dominio: sector,
          area: 'oportunidade',
          urgencia: 'media',
          tipo_card: 'informacao',
        };
        onWorkspaceCard(card, 'utilizar');
        closeMap();
        return;
      }

      // F4 — Comparar regiões
      if (d.type === 'compare-regions') {
        const cmp = d.payload;
        const card: IntelligenceCard = {
          ...synthBase,
          id: `synth-map-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          titulo: `Comparação ${cmp?.regiaoA?.label ?? 'A'} vs ${cmp?.regiaoB?.label ?? 'B'}`,
          resumo: cmp?.resumo ?? 'Comparação de regiões.',
          por_que_importa: `A: ${cmp?.regiaoA?.total ?? 0} (★ ${(cmp?.regiaoA?.avg ?? 0).toFixed?.(1) ?? '0.0'}, densidade ${cmp?.regiaoA?.densidade}) · B: ${cmp?.regiaoB?.total ?? 0} (★ ${(cmp?.regiaoB?.avg ?? 0).toFixed?.(1) ?? '0.0'}, densidade ${cmp?.regiaoB?.densidade})`,
          onde_afeta: sector,
          o_que_fazer: cmp?.recomendacao ?? '',
          dominio: sector,
          area: 'territorio',
          urgencia: 'baixa',
          tipo_card: 'informacao',
        };
        onWorkspaceCard(card, 'utilizar');
        closeMap();
        return;
      }

      // F5 — Transformar território em missão
      if (d.type === 'territory-to-mission') {
        const m = d.payload;
        const card: IntelligenceCard = {
          ...synthBase,
          id: `synth-map-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          titulo: m?.titulo ?? 'Missão territorial sugerida',
          resumo: m?.objetivo ?? '',
          por_que_importa: m?.contextoTerritorial ?? '',
          onde_afeta: sector,
          o_que_fazer: (m?.etapas ?? []).join(' · '),
          dominio: sector,
          area: 'missao',
          urgencia: 'media',
          tipo_card: 'missao',
        };
        onWorkspaceCard(card, 'utilizar');
        closeMap();
        return;
      }
      // ── P5: 5 novas ──
      if (d.type === 'monitor-territory') {
        // Silencioso — só persiste em LS. Mapa continua aberto pro user seguir.
        return;
      }
      if (d.type === 'risk-map') {
        const r = d.payload;
        const card: IntelligenceCard = {
          ...synthBase,
          id: `synth-map-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          titulo: 'Mapa de risco territorial',
          resumo: r?.resumo ?? '',
          por_que_importa: (r?.riscos ?? []).slice(0, 3).map((x: any) => `${x.nivel.toUpperCase()}: ${x.tipo}`).join(' · '),
          onde_afeta: sector,
          o_que_fazer: r?.recomendacao ?? '',
          dominio: sector,
          area: 'risco',
          urgencia: ((r?.riscos ?? []).some((x: any) => x.nivel === 'alto') ? 'alta' : 'media') as 'alta' | 'media',
          tipo_card: 'alerta',
        };
        onWorkspaceCard(card, 'utilizar');
        closeMap();
        return;
      }
      if (d.type === 'sector-opportunities') {
        const op = d.payload;
        const card: IntelligenceCard = {
          ...synthBase,
          id: `synth-map-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          titulo: `Oportunidades para ${sector}`,
          resumo: op?.resumo ?? '',
          por_que_importa: (op?.oportunidades ?? []).slice(0, 3).map((x: any) => `${x.tipo}: ${x.descricao}`).join(' · '),
          onde_afeta: sector,
          o_que_fazer: op?.acaoRecomendada ?? '',
          dominio: sector,
          area: 'oportunidade',
          urgencia: 'media',
          tipo_card: 'informacao',
        };
        onWorkspaceCard(card, 'utilizar');
        closeMap();
        return;
      }
      if (d.type === 'nearby-partners') {
        const np = d.payload;
        const card: IntelligenceCard = {
          ...synthBase,
          id: `synth-map-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          titulo: 'Parceiros/fornecedores próximos',
          resumo: np?.resumo ?? '',
          por_que_importa: (np?.candidatos ?? []).slice(0, 3).map((x: any) => `${x.nome} (${x.tipo})`).join(' · '),
          onde_afeta: sector,
          o_que_fazer: np?.recomendacao ?? '',
          dominio: sector,
          area: 'parceiros',
          urgencia: 'baixa',
          tipo_card: 'informacao',
        };
        onWorkspaceCard(card, 'utilizar');
        closeMap();
        return;
      }
      if (d.type === 'simulate-territory-action') {
        const s = d.payload;
        const card: IntelligenceCard = {
          ...synthBase,
          id: `synth-map-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          titulo: `Simulação: ${s?.acao ?? 'ação territorial'}`,
          resumo: s?.resumo ?? '',
          por_que_importa: `Conservador: ${s?.cenarios?.conservador?.metrica} · Provável: ${s?.cenarios?.provavel?.metrica} · Agressivo: ${s?.cenarios?.agressivo?.metrica}`,
          onde_afeta: sector,
          o_que_fazer: s?.proximaAcao ?? '',
          dominio: sector,
          area: 'simulacao',
          urgencia: 'media',
          tipo_card: 'informacao',
        };
        onWorkspaceCard(card, 'utilizar');
        closeMap();
        return;
      }
    }
    window.addEventListener(OS1_EVENTS.MAP_ACTION, handler as EventListener);
    return () => window.removeEventListener(OS1_EVENTS.MAP_ACTION, handler as EventListener);
  }, [activeSector]); // eslint-disable-line react-hooks/exhaustive-deps
}
