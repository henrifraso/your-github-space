// Converte CodifyApiCard (response do backend) em RoleFeedCard (shape do
// Feed do app). Mantém o mesmo formato dos cards demo/browser/mapa — nada
// visual muda. Campos extras (whyItMatters, status, visibility, etc.) são
// descartados aqui porque RoleFeedCard não os usa; ficam disponíveis no
// backend caso futuras telas precisem.

import type { RoleFeedCard } from '../../config/roleConfig';
import type { CodifyApiCard } from './codify-feed-client';

function normalizeUrgencia(u: string): 'baixa' | 'media' | 'alta' {
  if (u === 'alta' || u === 'media' || u === 'baixa') return u;
  return 'baixa';
}

function normalizeTipo(t: string): 'informacao' | 'alerta' {
  // RoleFeedCard só aceita 2 tipos. API tem 4 (alerta/oportunidade/informacao/risco).
  // Tudo que não for 'alerta' cai em 'informacao' (incluindo 'oportunidade', 'risco').
  return t === 'alerta' || t === 'risco' ? 'alerta' : 'informacao';
}

/**
 * Converte um card vindo da API em RoleFeedCard.
 * Não define `origem` — cards da API são tratados como cards "do role"
 * pela UI atual (mesma renderização dos demos), mantendo invisível ao
 * usuário a diferença entre demo e dado real.
 */
export function codifyCardToRoleFeedCard(card: CodifyApiCard): RoleFeedCard {
  const out: RoleFeedCard = {
    id: card.id,
    titulo: card.title,
    resumo: card.summary,
    tipo: normalizeTipo(card.type),
    urgencia: normalizeUrgencia(card.urgency),
    tags: Array.isArray(card.tags) ? card.tags : [],
  };

  if (card.evidenceIds && card.evidenceIds.length > 0) {
    out.evidenceId = card.evidenceIds[0];
  }
  if (card.mapSignalId) out.mapSignalId = card.mapSignalId;
  if (card.sourceUrl) out.sourceUrl = card.sourceUrl;
  if (card.sourceTitle) out.sourceTitle = card.sourceTitle;
  if (card.createdAt) out.createdAt = card.createdAt;

  return out;
}

export function codifyCardsToRoleFeedCards(cards: CodifyApiCard[]): RoleFeedCard[] {
  return cards.map(codifyCardToRoleFeedCard);
}
