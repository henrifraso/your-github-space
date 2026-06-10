// Variante do useCodifyFeed (Fase 4.2) que devolve IntelligenceCard[] em
// vez de RoleFeedCard[]. Necessário porque o Feed dos sectors usa
// IntelligenceCard como shape canônico (orchCards + DEMO_FEED_CARDS), e
// o adapter RoleFeedCard perderia whyItMatters/whatToDo/domain.
//
// Política idêntica ao useCodifyFeed: silencioso, sem spinner/toast/badge.
// Sem token, sem org/unit, ou em qualquer falha → retorna [].
//
// Re-fetcha quando enabled/token/organizationId/unitId mudam.

import { useEffect, useState } from 'react';

import type { IntelligenceCard } from '../../core/types/card';
import { getAuthState } from '../../hooks/useAuth';
import { codifyCardsToIntelligenceCards } from './codify-feed-adapter-intel';
import { fetchCodifyCards } from './codify-feed-client';

export interface UseCodifyFeedIntelligenceOptions {
  enabled?: boolean;
  organizationId?: string;
  unitId?: string;
}

export function useCodifyFeedIntelligence(
  options: UseCodifyFeedIntelligenceOptions = {},
): IntelligenceCard[] {
  const enabled = options.enabled ?? true;
  const [cards, setCards] = useState<IntelligenceCard[]>([]);

  const { token, orgId, buId } = getAuthState();
  const effectiveOrg = options.organizationId ?? orgId ?? undefined;
  const effectiveUnit = options.unitId ?? buId ?? undefined;

  useEffect(() => {
    if (!enabled || !token) {
      setCards([]);
      return;
    }
    let cancelled = false;
    (async () => {
      const items = await fetchCodifyCards({
        organizationId: effectiveOrg,
        unitId: effectiveUnit,
      });
      if (cancelled) return;
      setCards(items ? codifyCardsToIntelligenceCards(items) : []);
    })();
    return () => { cancelled = true; };
  }, [enabled, token, effectiveOrg, effectiveUnit]);

  return cards;
}
