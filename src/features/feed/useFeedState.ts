// useFeedState — hook que encapsula o state dos cards gerados.
//
// IMPORTANTE: este hook ainda NÃO é consumido em produção. Foi criado
// na Fase 16 como preparação para a Fase 17 (bridges/hooks), quando
// os useEffects que escutam OS1_EVENTS.BROWSER_ACTION / MAP_ACTION /
// ONTOLOGY_DIAGNOSIS_TO_FEED forem extraídos do App.tsx.
//
// Hoje o App.tsx segue gerenciando:
//   - useState<RoleFeedCard[]>([])  para `browserFeedCards`
//   - useState<RoleFeedCard[]>([])  para `mapFeedCards`
//
// Aplicar o hook agora exigiria propagar 4 setters e refatorar 3
// useEffects acoplados a closures (sector, openWorkspaceFromCard).
// Fica para a Fase 17.

import { useCallback, useState } from 'react';
import type { RoleFeedCard } from '../../config/roleConfig';

export interface UseFeedStateReturn {
  browserFeedCards: RoleFeedCard[];
  mapFeedCards: RoleFeedCard[];
  /** Adiciona um único card do navegador no TOPO da lista. */
  pushBrowserCard: (card: RoleFeedCard) => void;
  /** Adiciona múltiplos cards do mapa/ontologia no TOPO da lista. */
  prependMapCards: (cards: RoleFeedCard[]) => void;
  /** Reseta as listas (uso futuro: trocar de perfil, logout). */
  clearGenerated: () => void;
}

export function useFeedState(): UseFeedStateReturn {
  const [browserFeedCards, setBrowserFeedCards] = useState<RoleFeedCard[]>([]);
  const [mapFeedCards, setMapFeedCards] = useState<RoleFeedCard[]>([]);

  const pushBrowserCard = useCallback((card: RoleFeedCard) => {
    setBrowserFeedCards(prev => [card, ...prev]);
  }, []);

  const prependMapCards = useCallback((cards: RoleFeedCard[]) => {
    setMapFeedCards(prev => [...cards, ...prev]);
  }, []);

  const clearGenerated = useCallback(() => {
    setBrowserFeedCards([]);
    setMapFeedCards([]);
  }, []);

  return { browserFeedCards, mapFeedCards, pushBrowserCard, prependMapCards, clearGenerated };
}
