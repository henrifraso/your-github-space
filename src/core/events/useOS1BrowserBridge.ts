// useOS1BrowserBridge — ponte do Navegador OS¹.
//
// Escuta `OS1_EVENTS.BROWSER_ACTION` e roteia cada uma das 10 ações:
//   send-to-workspace, create-mission, save-evidence, generate-feed-card,
//   analyze-session, compare-tabs, monitor-page, capture-snippet,
//   create-dossier, ask-sector-agent.
//
// As ações silenciosas (`save-evidence`, `monitor-page`, `capture-snippet`,
// `create-dossier`) já persistem em localStorage no próprio BrowserView;
// aqui não fazemos nada com elas.
//
// Conteúdo extraído de src/App.tsx (Fase 17) — sem alteração de
// comportamento. Mesmas closures, mesmo dep array (`[activeSector]`),
// mesmos cases, mesmas mensagens, mesmo `setBrowserOpen(false)` no fim
// das ações que enviam para a Área de Trabalho.

import { useEffect } from 'react';
import { OS1_EVENTS } from './os1-events';
import type { IntelligenceCard, WorkspaceIntent } from '../types/card';
import type { RoleFeedCard } from '../../config/roleConfig';
import {
  browserPayloadToFeedCard,
  type BrowserGeneratedPayload,
} from '../../features/feed/feed-generated-cards';

interface UseOS1BrowserBridgeArgs {
  activeSector: string;
  /** Mesma assinatura de `openWorkspaceFromCard` do App.tsx. */
  onWorkspaceCard: (card: IntelligenceCard, intent: WorkspaceIntent) => void;
  /** Adiciona um card no TOPO da lista de cards gerados pelo navegador. */
  onBrowserCard: (card: RoleFeedCard) => void;
  /** Fecha o overlay do BrowserView (= `setBrowserOpen(false)`). */
  closeBrowser: () => void;
}

export function useOS1BrowserBridge({
  activeSector, onWorkspaceCard, onBrowserCard, closeBrowser,
}: UseOS1BrowserBridgeArgs): void {
  useEffect(() => {
    function handler(e: Event) {
      const ce = e as CustomEvent<{
        type: 'send-to-workspace' | 'create-mission' | 'save-evidence' | 'generate-feed-card' | 'analyze-session'
            | 'compare-tabs' | 'monitor-page' | 'capture-snippet' | 'create-dossier' | 'ask-sector-agent';
        context: { url: string; title: string; capturedText?: string; capturedAt: string };
        payload?: any;
      }>;
      const d = ce.detail;
      if (!d) return;
      const sector = activeSector || 'os1';
      const fechaUrl = d.context.url;
      const synthBase = {
        id: `synth-browser-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        confianca: 'media' as const,
        confianca_score: 0.5,
        impacto: 'a avaliar',
        risco_erro: 0.4,
        _synthetic: true as const,
      };
      if (d.type === 'send-to-workspace') {
        const card: IntelligenceCard = {
          ...synthBase,
          titulo: d.context.title || 'Página do navegador',
          resumo: (d.context.capturedText || 'Conteúdo capturado do navegador interno.').slice(0, 280),
          por_que_importa: `Origem: ${fechaUrl}`,
          onde_afeta: sector,
          o_que_fazer: 'Decidir próxima ação (missão, card no feed, descarte).',
          dominio: sector,
          area: sector,
          urgencia: 'media',
          tipo_card: 'informacao',
        };
        onWorkspaceCard(card, 'utilizar');
        closeBrowser();
        return;
      }
      if (d.type === 'create-mission') {
        const m = d.payload;
        const card: IntelligenceCard = {
          ...synthBase,
          titulo: m?.titulo ?? 'Missão sugerida',
          resumo: m?.objetivo ?? '',
          por_que_importa: `Evidência: ${fechaUrl}`,
          onde_afeta: sector,
          o_que_fazer: (m?.etapas ?? []).join(' · '),
          dominio: sector,
          area: 'missao',
          urgencia: 'media',
          tipo_card: 'missao',
        };
        onWorkspaceCard(card, 'utilizar');
        closeBrowser();
        return;
      }
      if (d.type === 'analyze-session') {
        const r = d.payload;
        const sinais = (r?.sinaisDetectados ?? []).join(' · ');
        const card: IntelligenceCard = {
          ...synthBase,
          titulo: 'Análise da sessão de navegação',
          resumo: r?.resumo ?? 'Resumo da sessão atual.',
          por_que_importa: sinais,
          onde_afeta: sector,
          o_que_fazer: (r?.proximosPassos ?? []).join(' · '),
          dominio: sector,
          area: 'analise',
          urgencia: 'baixa',
          tipo_card: 'informacao',
        };
        onWorkspaceCard(card, 'utilizar');
        closeBrowser();
        return;
      }
      if (d.type === 'generate-feed-card') {
        const newCard = browserPayloadToFeedCard(d.payload as BrowserGeneratedPayload | undefined, sector);
        onBrowserCard(newCard);
        return;
      }
      // 'save-evidence', 'monitor-page', 'capture-snippet', 'create-dossier':
      // já persistem em localStorage no próprio BrowserView; aqui são silenciosos.

      // P4: comparação de abas → workspace
      if (d.type === 'compare-tabs') {
        const cmp = d.payload;
        const card: IntelligenceCard = {
          ...synthBase,
          id: `synth-browser-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          titulo: 'Comparação de abas abertas',
          resumo: cmp?.resumo ?? '',
          por_que_importa: (cmp?.diferencas ?? []).slice(0, 4).join(' · '),
          onde_afeta: sector,
          o_que_fazer: cmp?.recomendacao ?? '',
          dominio: sector,
          area: 'comparacao',
          urgencia: 'baixa',
          tipo_card: 'informacao',
        };
        onWorkspaceCard(card, 'utilizar');
        closeBrowser();
        return;
      }
      // P4: agente do setor → workspace
      if (d.type === 'ask-sector-agent') {
        const a = d.payload;
        const card: IntelligenceCard = {
          ...synthBase,
          id: `synth-browser-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          titulo: a?.agente ?? 'Agente do setor',
          resumo: a?.analise ?? '',
          por_que_importa: (a?.observacoes ?? []).join(' · '),
          onde_afeta: sector,
          o_que_fazer: (a?.proximosPassos ?? []).join(' · '),
          dominio: sector,
          area: 'agente',
          urgencia: 'baixa',
          tipo_card: 'informacao',
        };
        onWorkspaceCard(card, 'utilizar');
        closeBrowser();
        return;
      }
    }
    window.addEventListener(OS1_EVENTS.BROWSER_ACTION, handler as EventListener);
    return () => window.removeEventListener(OS1_EVENTS.BROWSER_ACTION, handler as EventListener);
  }, [activeSector]); // eslint-disable-line react-hooks/exhaustive-deps
}
