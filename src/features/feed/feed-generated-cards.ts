// Cards gerados pelo navegador, mapa e diagnóstico ontológico.
//
// Conteúdo movido de src/App.tsx (Fase 16). Cada helper recebe o
// payload bruto do evento OS¹ correspondente e devolve `RoleFeedCard[]`
// (formato do feed), exatamente como hoje os useEffects do App.tsx
// constroem inline.
//
// Os listeners de evento continuam no App.tsx por enquanto (acoplados a
// state/setters/closures). Esta camada só centraliza a transformação
// payload → card, pra que a Fase 17 (bridges/hooks) possa migrar os
// useEffects com confiança.

import type { RoleFeedCard } from '../../config/roleConfig';

// ── Browser → feed ────────────────────────────────────────────────
// Vem de OS1_EVENTS.BROWSER_ACTION com type='generate-feed-card'.
// Payload é o `BrowserFeedCard` produzido por `lib/browser-actions`.
export interface BrowserGeneratedPayload {
  id?: string;
  titulo?: string;
  resumo?: string;
  urgencia?: 'baixa' | 'media' | 'alta';
}

export function browserPayloadToFeedCard(fc: BrowserGeneratedPayload | undefined | null, sector: string): RoleFeedCard {
  return {
    id: fc?.id ?? `bfc-${Date.now()}`,
    titulo: fc?.titulo ?? 'Card do navegador',
    resumo: fc?.resumo ?? '',
    tipo: 'informacao',
    urgencia: fc?.urgencia ?? 'media',
    tags: ['navegador', sector],
  };
}

// ── Mapa → feed (F1 — Gerar feed do raio) ─────────────────────────
// Vem de OS1_EVENTS.MAP_ACTION com type='feed-from-radius'.
// Payload é `MapFeedCard[]` de `lib/map-actions`.
export interface MapGeneratedCard {
  id: string;
  titulo: string;
  resumo: string;
  urgencia: 'alta' | 'media' | 'baixa';
  dominio: string;
}

export function mapPayloadToFeedCards(cards: MapGeneratedCard[], sector: string): RoleFeedCard[] {
  return cards.map(c => ({
    id: c.id,
    titulo: c.titulo,
    resumo: c.resumo,
    tipo: 'informacao',
    urgencia: c.urgencia,
    tags: ['mapa', sector, c.dominio].filter(Boolean) as string[],
  }));
}

// ── Diagnóstico ontológico → feed ─────────────────────────────────
// Vem de OS1_EVENTS.ONTOLOGY_DIAGNOSIS_TO_FEED.
// Payload é `DiagnosisCardSuggestion[]` de `lib/ontology-diagnostics`.
export interface DiagnosisGeneratedCard {
  id: string;
  titulo: string;
  resumo: string;
  tipo: string;
  urgencia: 'alta' | 'media' | 'baixa';
  dominio: string;
}

export function diagnosisPayloadToFeedCards(cards: DiagnosisGeneratedCard[], sector: string): RoleFeedCard[] {
  return cards.map(c => ({
    id: c.id,
    titulo: c.titulo,
    resumo: c.resumo,
    tipo: c.tipo === 'risco' || c.tipo === 'lacuna' ? 'alerta' : 'informacao',
    urgencia: c.urgencia,
    tags: ['ontologia', sector, c.dominio].filter(Boolean) as string[],
  }));
}
