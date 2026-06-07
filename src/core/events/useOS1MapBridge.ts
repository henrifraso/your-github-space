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
        // Estrutura: resumo + 3 mais próximos + 3 mais fortes + riscos + brechas
        const proximos = (a?.concorrentesProximos ?? []).slice(0, 3).join(', ');
        const fortes = (a?.concorrentesMaisFortes ?? []).slice(0, 3).join(', ');
        const riscos = (a?.riscos ?? []).slice(0, 3).join(' · ');
        const brechas = (a?.brechas ?? []).slice(0, 2).join(' · ');
        const porQue = [
          proximos ? `Mais próximos: ${proximos}.` : '',
          fortes ? `Mais fortes: ${fortes}.` : '',
          riscos ? `Riscos: ${riscos}.` : '',
          brechas ? `Brechas: ${brechas}.` : '',
        ].filter(Boolean).join(' · ');
        const urgenciaFinal = (a?.riscos ?? []).length >= 2 ? 'alta' as const : 'media' as const;
        const card: IntelligenceCard = {
          ...synthBase,
          id: `synth-map-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          titulo: 'Análise competitiva local',
          resumo: a?.resumo ?? 'Análise competitiva no raio selecionado.',
          por_que_importa: porQue,
          onde_afeta: sector,
          o_que_fazer: a?.recomendacao ?? '',
          dominio: sector,
          area: 'concorrencia-territorial',
          urgencia: urgenciaFinal,
          tipo_card: 'informacao',
        };
        onWorkspaceCard(card, 'utilizar');
        closeMap();
        return;
      }

      // F3 — Encontrar oportunidades
      if (d.type === 'find-opportunities') {
        const op = d.payload;
        // Quando vem a versão detalhada, monta texto com justificativa e
        // prioridade — fica explícito por que cada oportunidade aparece.
        const detalhadas = op?.oportunidadesDetalhadas as { titulo: string; justificativa: string; prioridade: string }[] | undefined;
        const porQue = detalhadas && detalhadas.length > 0
          ? detalhadas.slice(0, 3).map(d => `${d.prioridade.toUpperCase()} · ${d.titulo}: ${d.justificativa}`).join(' · ')
          : (op?.oportunidades ?? []).slice(0, 3).join(' · ');
        const temPrioridadeAlta = detalhadas?.some(d => d.prioridade === 'alta');
        const card: IntelligenceCard = {
          ...synthBase,
          id: `synth-map-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          titulo: 'Oportunidades no território',
          resumo: op?.resumo ?? 'Oportunidades detectadas no raio.',
          por_que_importa: porQue,
          onde_afeta: sector,
          o_que_fazer: op?.acaoRecomendada ?? '',
          dominio: sector,
          area: 'oportunidade',
          urgencia: temPrioridadeAlta ? 'alta' : 'media',
          tipo_card: 'informacao',
        };
        onWorkspaceCard(card, 'utilizar');
        closeMap();
        return;
      }

      // F4 — Comparar regiões
      if (d.type === 'compare-regions') {
        const cmp = d.payload;
        const a = cmp?.regiaoA;
        const b = cmp?.regiaoB;
        const aDens = a?.densidade ?? 'baixa';
        const bDens = b?.densidade ?? 'baixa';
        const porQue = [
          a ? `Região A (${a.label}): ${a.total} concorrente(s), ★ ${(a.avg ?? 0).toFixed(1)}, densidade ${aDens}.` : '',
          b ? `Região B (${b.label}): ${b.total} concorrente(s), ★ ${(b.avg ?? 0).toFixed(1)}, densidade ${bDens}.` : '',
        ].filter(Boolean).join(' · ');
        const card: IntelligenceCard = {
          ...synthBase,
          id: `synth-map-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          titulo: `Comparação territorial: ${a?.label ?? 'A'} vs ${b?.label ?? 'B'}`,
          resumo: cmp?.resumo ?? 'Comparação entre dois recortes territoriais.',
          por_que_importa: porQue,
          onde_afeta: sector,
          o_que_fazer: cmp?.recomendacao ?? '',
          dominio: sector,
          area: 'comparacao-territorial',
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
        const evidenciasTxt = (m?.evidencias ?? []).length > 0
          ? `Evidências territoriais: ${(m?.evidencias ?? []).slice(0, 3).join(' · ')}.`
          : '';
        const porQue = [
          m?.contextoTerritorial ?? '',
          evidenciasTxt,
          m?.responsavelSugerido ? `Responsável: ${m.responsavelSugerido}.` : '',
          m?.prazoSugerido ? `Prazo: ${m.prazoSugerido}.` : '',
          m?.metricaSucesso ? `Métrica de sucesso: ${m.metricaSucesso}.` : '',
        ].filter(Boolean).join(' · ');
        const oQueFazer = [
          (m?.etapas ?? []).join(' · '),
          m?.criterioConclusao ? `Critério de conclusão: ${m.criterioConclusao}` : '',
        ].filter(Boolean).join(' · ');
        const card: IntelligenceCard = {
          ...synthBase,
          id: `synth-map-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          titulo: m?.titulo ?? 'Missão territorial',
          resumo: m?.objetivo ?? 'Missão operacional gerada do território selecionado.',
          por_que_importa: porQue,
          onde_afeta: sector,
          o_que_fazer: oQueFazer,
          dominio: sector,
          area: 'missao-territorial',
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
        // Estrutura: prioridade visível (ALTO/MÉDIO/BAIXO) + tipo + descrição
        const riscosTxt = (r?.riscos ?? []).slice(0, 4).map((x: any) => `${x.nivel.toUpperCase()} · ${x.tipo}: ${x.descricao}`).join(' · ');
        const altosCount = (r?.riscos ?? []).filter((x: any) => x.nivel === 'alto').length;
        const tipoFinal: 'alerta' | 'informacao' = altosCount > 0 ? 'alerta' : 'informacao';
        const card: IntelligenceCard = {
          ...synthBase,
          id: `synth-map-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          titulo: altosCount > 0 ? `Mapa de risco territorial — ${altosCount} risco(s) alto(s)` : 'Mapa de risco territorial',
          resumo: r?.resumo ?? 'Avaliação de risco no território selecionado.',
          por_que_importa: riscosTxt,
          onde_afeta: sector,
          o_que_fazer: r?.recomendacao ?? '',
          dominio: sector,
          area: 'risco-territorial',
          urgencia: (altosCount > 0 ? 'alta' : 'media') as 'alta' | 'media',
          tipo_card: tipoFinal,
        };
        onWorkspaceCard(card, 'utilizar');
        closeMap();
        return;
      }
      if (d.type === 'sector-opportunities') {
        const op = d.payload;
        // Mostra prioridade (ALTA/MEDIA/BAIXA) + tipo + descrição
        const opsTxt = (op?.oportunidades ?? []).slice(0, 3).map((x: any) => `${x.prioridade.toUpperCase()} · ${x.tipo}: ${x.descricao}`).join(' · ');
        const altas = (op?.oportunidades ?? []).filter((x: any) => x.prioridade === 'alta').length;
        const card: IntelligenceCard = {
          ...synthBase,
          id: `synth-map-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          titulo: altas > 0 ? `Oportunidades por setor — ${altas} de alta prioridade` : `Oportunidades por setor (${sector})`,
          resumo: op?.resumo ?? 'Oportunidades específicas do setor no raio selecionado.',
          por_que_importa: opsTxt,
          onde_afeta: sector,
          o_que_fazer: op?.acaoRecomendada ?? '',
          dominio: sector,
          area: 'oportunidade-setorial',
          urgencia: altas > 0 ? 'media' : 'baixa',
          tipo_card: 'informacao',
        };
        onWorkspaceCard(card, 'utilizar');
        closeMap();
        return;
      }
      if (d.type === 'nearby-partners') {
        const np = d.payload;
        // Diferencia parceiros reais vs concorrentes a monitorar. Mostra tipo + parceriaSugerida.
        const candidatos = (np?.candidatos ?? []) as { nome: string; tipo: string; observacao: string; parceriaSugerida?: string }[];
        const parceirosReais = candidatos.filter(c => c.tipo !== 'concorrente-monitorar');
        const concorrentes = candidatos.filter(c => c.tipo === 'concorrente-monitorar');
        const parceirosTxt = parceirosReais.slice(0, 3).map(c =>
          `${c.nome} (${c.tipo}${c.parceriaSugerida ? `, ${c.parceriaSugerida}` : ''})`
        ).join(' · ');
        const concorrentesTxt = concorrentes.length > 0
          ? ` · ⚠ Concorrente(s) a monitorar (não parceiro): ${concorrentes.map(c => c.nome).join(', ')}`
          : '';
        const card: IntelligenceCard = {
          ...synthBase,
          id: `synth-map-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          titulo: 'Parceiros próximos identificados',
          resumo: np?.resumo ?? 'Candidatos a parceria detectados no raio.',
          por_que_importa: `${parceirosTxt}${concorrentesTxt}`,
          onde_afeta: sector,
          o_que_fazer: np?.recomendacao ?? '',
          dominio: sector,
          area: 'parceiros-territoriais',
          urgencia: 'baixa',
          tipo_card: 'informacao',
        };
        onWorkspaceCard(card, 'utilizar');
        closeMap();
        return;
      }
      if (d.type === 'simulate-territory-action') {
        const s = d.payload;
        const fundamentoStr = Array.isArray(s?.fundamento) && s.fundamento.length
          ? `Fundamento — ${s.fundamento.slice(0, 3).join(' · ')}`
          : '';
        // por_que_importa: avisa que é estimativa + mostra cenários +
        // fundamento. Cliente vê de onde saiu o número, não levanta a
        // suspeita de "previsão mágica".
        const porQue = [
          s?.aviso || 'Estimativa baseada em fatores territoriais — não é previsão garantida.',
          `Cenários: conservador ${s?.cenarios?.conservador?.metrica} · provável ${s?.cenarios?.provavel?.metrica} · agressivo ${s?.cenarios?.agressivo?.metrica}`,
          fundamentoStr,
        ].filter(Boolean).join(' · ');
        const card: IntelligenceCard = {
          ...synthBase,
          id: `synth-map-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          titulo: `Simulação estimativa: ${s?.acao ?? 'ação territorial'}`,
          resumo: s?.resumo ?? '',
          por_que_importa: porQue,
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
