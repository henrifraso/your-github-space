// useOS1OntologyBridge — ponte do Diagnóstico da Empresa → Feed.
//
// Escuta `OS1_EVENTS.ONTOLOGY_DIAGNOSIS_TO_FEED` (disparado pelo
// overlay legado `CompanyDiagnosisPanel` quando o user clica "Enviar
// cards ao feed"). Os cards entram em `mapFeedCards` — mesma infra de
// cards locais — não criando overlay nem alterando o feed atual.
//
// Conteúdo extraído de src/App.tsx (Fase 17) — sem alteração de
// comportamento. Mesmo dep array (`[activeSector]`), mesma closure de
// `activeSector || 'os1'`, mesmo `setMapFeedCards(prev => [...novos, ...prev])`.
//
// IMPORTANTE: o fluxo principal de "Analisar minha empresa" (botão na
// Esfera) não passa por aqui — ele chama `openDiagnosisInWorkspace`
// direto, e a Esfera fecha. Este bridge é só para o canal legado de
// injeção em massa de cards.

import { useEffect } from 'react';
import { OS1_EVENTS } from './os1-events';
import type { RoleFeedCard } from '../../config/roleConfig';
import {
  diagnosisPayloadToFeedCards,
  type DiagnosisGeneratedCard,
} from '../../features/feed/feed-generated-cards';

interface UseOS1OntologyBridgeArgs {
  activeSector: string;
  /** Adiciona N cards no TOPO da lista de cards gerados pelo mapa/ontologia. */
  onMapCards: (cards: RoleFeedCard[]) => void;
}

export function useOS1OntologyBridge({ activeSector, onMapCards }: UseOS1OntologyBridgeArgs): void {
  useEffect(() => {
    function handler(e: Event) {
      const ce = e as CustomEvent<any[]>;
      const cards = (ce.detail || []) as DiagnosisGeneratedCard[];
      const sector = activeSector || 'os1';
      const novos = diagnosisPayloadToFeedCards(cards, sector);
      onMapCards(novos);
    }
    window.addEventListener(OS1_EVENTS.ONTOLOGY_DIAGNOSIS_TO_FEED, handler as EventListener);
    return () => window.removeEventListener(OS1_EVENTS.ONTOLOGY_DIAGNOSIS_TO_FEED, handler as EventListener);
  }, [activeSector]); // eslint-disable-line react-hooks/exhaustive-deps
}
