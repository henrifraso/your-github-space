// Adapter + filtro editorial pra contexto do card (Etapa 6.6).
//
// Como cards 6.2 e itens 6.3/6.4/6.5 NÃO têm vínculo estrutural (Codify
// API v0 não tem PATCH /cards), o vínculo é editorial via tags. Este
// módulo concentra:
//   - extrair tema do card (tags - tags genéricas)
//   - filtrar items por match de tema
//   - separar signals gerais de map-signals territoriais (tags
//     `territorio` ou `mapa`)
//
// Conservador no critério: prefere falso-negativo (item não aparece)
// a falso-positivo (item de outro tema aparece).

import type { CodifyEvidence, CodifySignal } from './codify-context-client';

// Tags consideradas "genéricas" — não definem tema editorial. Tudo que
// sobra após remover essas é o tema-chave do card. Mantemos conservador:
// tags da empresa, camada (etapa-6), origem (codify-editorial), e
// tags transversais de signal/map-signal.
const GENERIC_TAGS: ReadonlySet<string> = new Set([
  'etapa-6',
  'codify-editorial',
  // Empresas (sectorIds mapeados):
  'oscar',
  'pacheco',
  // Camadas de origem editorial:
  'monitoramento',
  'setorial',
  'interno',
  'historico',
  'fonte-oficial',
  // Mapa/território (separação 6.4 vs 6.5 — não-tema):
  'mapa',
  'territorio',
  'cobertura',
  // Genéricas amplas:
  'concorrencia',
]);

export interface CardForContext {
  /** Tags do card editorial (do payload original criado em 6.2). */
  tags?: string[];
  /** Flag de card sintético (demo, browser-generated). */
  _synthetic?: boolean;
  /** Id pra dedupe / re-fetch. */
  id?: string;
  /** Rastreador do pacote de ingestão (publisher F2+). Usado para
   *  vínculo estrutural prioritário com itens de contexto. */
  createdBy?: string | null;
}

/**
 * Extrai o tema-chave a partir das tags do card.
 * Retorna lista vazia se card não tem tags ou só tem genéricas.
 */
export function extractCardTema(card: CardForContext): string[] {
  const tags = card.tags ?? [];
  return tags.filter(t => !GENERIC_TAGS.has(t));
}

/**
 * Filtra items por match de tema. Se o card não tem tema-chave
 * detectável, retorna **lista vazia** (conservador — evita mostrar
 * tudo da org indiscriminadamente).
 */
export function filterByCardTema<T extends { tags: string[] }>(
  items: T[],
  card: CardForContext,
): T[] {
  const tema = extractCardTema(card);
  if (tema.length === 0) return [];
  const temaSet = new Set(tema);
  return items.filter(item => item.tags.some(t => temaSet.has(t)));
}

/**
 * Separa items vindos de /map-signals em:
 * - signals: gerais (tags sem 'territorio'/'mapa')
 * - mapSignals: territoriais (tags com 'territorio' OU 'mapa')
 *
 * Map-signals territoriais são transversais à empresa (não têm tema
 * específico) — caller pode optar por mostrar todos da org, não só
 * os do tema. Este split NÃO aplica filtro de tema.
 */
export function splitSignalsAndMapSignals(items: CodifySignal[]): {
  signals: CodifySignal[];
  mapSignals: CodifySignal[];
} {
  const isTerritorial = (s: CodifySignal): boolean =>
    s.tags.includes('territorio') || s.tags.includes('mapa');
  return {
    signals: items.filter(s => !isTerritorial(s)),
    mapSignals: items.filter(s => isTerritorial(s)),
  };
}

/**
 * Escolhe itens de contexto para um card. Política em duas camadas:
 *
 *   1. Estrutural (preferida): se card.createdBy existir e ≥1 item tiver
 *      o mesmo createdBy, retorna SOMENTE esses itens. Garante zero
 *      overmatching para pacotes publicados pelo publisher pós-F2.
 *
 *   2. Editorial (fallback): se card.createdBy estiver vazio, ou se
 *      nenhum item bater por createdBy, cai para filterByCardTema
 *      (comportamento atual — match por tags-tema).
 *
 * O fallback preserva comportamento atual para:
 *   - card F1 Markdown (createdBy=None por bug pré-F2)
 *   - cards Etapa 6 (card.createdBy='etapa-6.2' mas itens têm
 *     'etapa-6.3'/'6.4'/'6.5' — sem match estrutural)
 *   - cards demo (interceptados antes pelo hook)
 */
export function pickContextItems<T extends { createdBy?: string | null; tags: string[] }>(
  items: T[],
  card: CardForContext,
): T[] {
  if (card.createdBy) {
    const matches = items.filter(i => i.createdBy === card.createdBy);
    if (matches.length > 0) return matches;
  }
  return filterByCardTema(items, card);
}

/**
 * Verifica se um item pertence à org/unit esperada — camada defensiva
 * contra vazamento. Apenas extra checagem além do scope do backend.
 */
export function belongsToScope<T extends { organizationId: string; unitId?: string }>(
  item: T,
  scope: { organizationId: string; unitId?: string },
): boolean {
  if (item.organizationId !== scope.organizationId) return false;
  if (scope.unitId && item.unitId && item.unitId !== scope.unitId) return false;
  return true;
}

/** Re-export pra testes/consumer. */
export type { CodifyEvidence, CodifySignal };
