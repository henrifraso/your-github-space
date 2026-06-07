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
  // Etapa 10 — rastreabilidade
  evidenceId?: string;
  evidenciaUrl?: string;
  pageType?: string;
  sourceTitle?: string;
  capturedAt?: string;
  deduped?: boolean;
}

export function browserPayloadToFeedCard(fc: BrowserGeneratedPayload | undefined | null, sector: string): RoleFeedCard {
  // Tipo do card varia por urgência (alta → alerta)
  const tipo: 'informacao' | 'alerta' = fc?.urgencia === 'alta' ? 'alerta' : 'informacao';
  // Tags expandidas: navegador + evidência + setor + tipo da página
  const tags = ['navegador', 'evidência', sector];
  if (fc?.pageType) tags.push(fc.pageType);
  return {
    id: fc?.id ?? `bfc-${Date.now()}`,
    titulo: fc?.titulo ?? 'Card do navegador',
    resumo: fc?.resumo ?? '',
    tipo,
    urgencia: fc?.urgencia ?? 'media',
    tags,
    origem: 'navegador',
    evidenceId: fc?.evidenceId,
    sourceUrl: fc?.evidenciaUrl,
    sourceTitle: fc?.sourceTitle,
    createdAt: fc?.capturedAt,
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
  /** Nível de risco territorial — usado pra decidir tipo do card (alerta vs informacao). */
  risco?: 'alto' | 'medio' | 'baixo' | string;
  /** Etapa 11: rastreabilidade do sinal territorial. */
  mapSignalId?: string;
  raioMetros?: number;
  localizacao?: { lat: number; lng: number };
  competitorsCount?: number;
  sourceLabel?: string;
  capturedAt?: string;
  /** Domínio competitivo/risco/oportunidade pra tags. */
  oportunidade?: string;
}

export function mapPayloadToFeedCards(cards: MapGeneratedCard[], sector: string): RoleFeedCard[] {
  return cards.map(c => {
    // Risco alto + urgência alta = alerta. Resto vira informacao.
    const tipo = (c.risco === 'alto' || c.urgencia === 'alta') ? 'alerta' : 'informacao';

    // Tags Etapa 11: mapa + território + raio + setor + dominio + risco/oportunidade
    const tags: string[] = ['mapa', 'território', sector];
    if (c.raioMetros) {
      const km = c.raioMetros / 1000;
      tags.push(km < 1 ? `raio:${Math.round(c.raioMetros)}m` : `raio:${km.toFixed(1)}km`);
    }
    if (c.dominio && c.dominio !== sector) tags.push(c.dominio);
    if (c.risco === 'alto' || c.risco === 'medio') tags.push('risco');
    if (c.oportunidade === 'alta' || c.oportunidade === 'média') tags.push('oportunidade');
    if (/parceir/i.test(c.titulo) || /fornecedor/i.test(c.titulo)) tags.push('parceiros');

    return {
      id: c.id,
      titulo: c.titulo,
      resumo: c.resumo,
      tipo,
      urgencia: c.urgencia,
      tags: tags.filter(Boolean) as string[],
      origem: 'mapa' as const,
      mapSignalId: c.mapSignalId,
      radius: c.raioMetros,
      center: c.localizacao,
      competitorsCount: c.competitorsCount,
      sourceLabel: c.sourceLabel,
      createdAt: c.capturedAt,
    };
  });
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
