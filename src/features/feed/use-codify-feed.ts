// Hook que carrega cards reais via /api/feed/codify e devolve um array
// de RoleFeedCard pronto pra entrar em mergeFeedSources.
//
// Política: silencioso e idempotente. Sem spinner, sem toast, sem badge.
// Se o usuário não tiver token/org, ou se a API estiver fora/lenta, o hook
// devolve [] e o Feed continua exibindo demos/locais como sempre.
//
// Re-fetcha quando o organizationId/unitId do user muda (login, switch de
// sector real). Lê os IDs do localStorage via useAuth.

import { useEffect, useState } from 'react';

import type { RoleFeedCard } from '../../config/roleConfig';
import { getAuthState } from '../../hooks/useAuth';
import { codifyCardsToRoleFeedCards } from './codify-feed-adapter';
import { fetchCodifyCards } from './codify-feed-client';

export interface UseCodifyFeedOptions {
  /** Quando false, hook não dispara fetch. Útil em demos OS¹ que não têm org real. */
  enabled?: boolean;
  /**
   * Escopo explícito. Quando passado, sobrescreve o orgId/buId do localStorage
   * (Fase 4.3.c — sector atual mapeia pra org real via codify-sector-scope).
   * Sem esses params, hook cai no comportamento da Fase 4.2 (lê de useAuth).
   */
  organizationId?: string;
  unitId?: string;
}

/**
 * Retorna apiCards (RoleFeedCard[]) carregados do backend. [] enquanto
 * estiver carregando ou em qualquer falha. Caller passa em mergeFeedSources
 * como primeiro elemento da ordem.
 */
export function useCodifyFeed(options: UseCodifyFeedOptions = {}): RoleFeedCard[] {
  const enabled = options.enabled ?? true;
  const [cards, setCards] = useState<RoleFeedCard[]>([]);

  // Re-fetcha quando token/org/unit mudam. Lê do localStorage em cada render
  // pra detectar mudanças sem precisar de event system.
  const { token, orgId, buId } = getAuthState();

  // Escopo explícito vindo de options (sector→org) tem precedência sobre
  // o orgId/buId do localStorage. Se não vier, mantém fallback Fase 4.2.
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
      setCards(items ? codifyCardsToRoleFeedCards(items) : []);
    })();
    return () => { cancelled = true; };
  }, [enabled, token, effectiveOrg, effectiveUnit]);

  return cards;
}
