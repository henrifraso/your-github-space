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

export interface UseCodifyFeedResult {
  cards: RoleFeedCard[];
  /**
   * True desde o primeiro render com uma org nova até o fetch terminar.
   * Derivado no render (não em estado) para eliminar o frame de gap onde
   * loading=false antes do useEffect rodar — isso evitava demos piscarem.
   */
  loading: boolean;
}

/**
 * Retorna { cards, loading } do backend.
 *
 * loading é derivado de forma síncrona: compara a chave org::unit atual com
 * a última chave cujo fetch já completou (fetchedKey). Assim, no primeiro
 * render após trocar de sector, loading já é true — sem frame de gap.
 */
export function useCodifyFeed(options: UseCodifyFeedOptions = {}): UseCodifyFeedResult {
  const enabled = options.enabled ?? true;
  const [cardsState, setCardsState] = useState<RoleFeedCard[]>([]);
  // Chave da última busca concluída. null = nenhuma busca completada ainda.
  const [fetchedKey, setFetchedKey] = useState<string | null>(null);

  // Re-fetcha quando token/org/unit mudam. Lê do localStorage em cada render
  // pra detectar mudanças sem precisar de event system.
  const { token, orgId, buId } = getAuthState();

  // Escopo explícito vindo de options (sector→org) tem precedência sobre
  // o orgId/buId do localStorage. Se não vier, mantém fallback Fase 4.2.
  const effectiveOrg = options.organizationId ?? orgId ?? undefined;
  const effectiveUnit = options.unitId ?? buId ?? undefined;

  // Chave da requisição atual. null quando não há nada para buscar.
  const currentKey = (enabled && token) ? `${effectiveOrg}::${effectiveUnit}` : null;

  // loading é DERIVADO: true quando currentKey difere do que já foi buscado.
  // Calculado no render — sem depender de efeito — então já é true no
  // primeiro render após troca de sector.
  const loading = currentKey !== null && currentKey !== fetchedKey;

  // Não expõe cards de um sector anterior enquanto o novo ainda carrega.
  const cards = loading ? [] : cardsState;

  useEffect(() => {
    if (!enabled || !token) {
      setCardsState([]);
      setFetchedKey(null);
      return;
    }
    let cancelled = false;
    (async () => {
      const items = await fetchCodifyCards({
        organizationId: effectiveOrg,
        unitId: effectiveUnit,
      });
      if (cancelled) return;
      setCardsState(items ? codifyCardsToRoleFeedCards(items) : []);
      setFetchedKey(`${effectiveOrg}::${effectiveUnit}`);
    })();
    return () => { cancelled = true; };
  }, [enabled, token, effectiveOrg, effectiveUnit]);

  return { cards, loading };
}
