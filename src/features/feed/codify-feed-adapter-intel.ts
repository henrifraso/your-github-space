// Converte CodifyApiCard (response do backend Codify) DIRETAMENTE em
// IntelligenceCard (formato rico usado pelo Feed e WorkspacePanel).
//
// Diferente do codify-feed-adapter.ts, que converte pra RoleFeedCard
// (formato simples), este adapter preserva os campos editoriais ricos
// (whyItMatters, whatToDo, domain, area, type, urgency) que aparecem na
// Área de Trabalho quando o card é aberto.
//
// Usado pelo hook useCodifyFeedIntelligence, que alimenta o Feed dos
// sectors (mcdonalds/nike/nubank) — onde IntelligenceCard é o shape
// esperado por orchCards e DEMO_FEED_CARDS.

import type { IntelligenceCard } from '../../core/types/card';
import type { CodifyApiCard } from './codify-feed-client';

// Tags que sinalizam que o card é hipótese editorial (não dado medido).
const HYPOTHESIS_TAGS: ReadonlySet<string> = new Set([
  'hipotese',
  'hipotese-a-validar',
  'dado-interno-pendente',
  'dado_interno_pendente',
]);

// Frases que sinalizam hipótese quando aparecem no texto do card.
// Comparação case-insensitive contra título + summary.
const HYPOTHESIS_PHRASES: readonly string[] = [
  'hipótese',
  'hipotese',
  'hipótese a validar',
  'hipotese a validar',
  'dado interno pendente',
];

/**
 * Detecta se um card real do Codify deve ser tratado como hipótese
 * editorial. True quando:
 *   - tags contém pelo menos uma de HYPOTHESIS_TAGS, OU
 *   - título/summary contém alguma frase de HYPOTHESIS_PHRASES
 * (case-insensitive em ambos os casos).
 *
 * Não depende só de tag porque cards já publicados podem não ter tag
 * explícita mas abrem com "Hipótese a validar" no texto.
 *
 * Por enquanto só calcula o sinal. Templates de workspace ainda não
 * leem esse campo (sub-bloco F6b).
 */
function isHypothesisCard(card: CodifyApiCard): boolean {
  const tags = card.tags ?? [];
  for (const t of tags) {
    if (HYPOTHESIS_TAGS.has(t)) return true;
  }
  const haystack = `${card.title ?? ''} ${card.summary ?? ''}`.toLowerCase();
  for (const phrase of HYPOTHESIS_PHRASES) {
    if (haystack.includes(phrase)) return true;
  }
  return false;
}

function urgencyConfidence(u: string): { confianca: string; confianca_score: number; impacto: string; risco_erro: number } {
  // Aproximação calibrada igual ao mk() de demo-feed-cards.ts pra manter
  // consistência visual com os demos do mesmo Feed.
  if (u === 'alta') return { confianca: 'media', confianca_score: 0.82, impacto: 'alto',      risco_erro: 0.25 };
  if (u === 'media') return { confianca: 'media', confianca_score: 0.74, impacto: 'moderado', risco_erro: 0.35 };
  return { confianca: 'media', confianca_score: 0.68, impacto: 'moderado', risco_erro: 0.35 };
}

/**
 * Mapeia 1-para-1 mantendo todos os campos editoriais. Strings vazias
 * quando o backend não tem o campo, pra não quebrar o consumer.
 */
export function codifyCardToIntelligenceCard(card: CodifyApiCard): IntelligenceCard {
  const { confianca, confianca_score, impacto, risco_erro } = urgencyConfidence(card.urgency);
  return {
    id: card.id,
    titulo: card.title,
    resumo: card.summary,
    por_que_importa: card.whyItMatters ?? '',
    o_que_fazer:    card.whatToDo ?? '',
    dominio:        card.domain ?? card.area ?? '',
    area:           card.area ?? card.domain ?? '',
    urgencia:       card.urgency,
    tipo_card:      card.type,
    confianca,
    confianca_score,
    impacto,
    risco_erro,
    tags: card.tags,
    isHypothesis: isHypothesisCard(card),
    // Cards reais NÃO são sintéticos — vêm do backend Codify
  };
}

export function codifyCardsToIntelligenceCards(cards: CodifyApiCard[]): IntelligenceCard[] {
  return cards.map(codifyCardToIntelligenceCard);
}
