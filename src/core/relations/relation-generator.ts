// Gerador localizado de setas candidatas — Motor de Relações Fase 2.
// NÃO ligado a nenhum fluxo. Ver projeto_omni_perfis_demo.md.
//
// Recebe um subconjunto PEQUENO de termos (os que foram "acesos" pelo match
// de conteúdo da mineradora — não os 3.003) e retorna Relation[] candidatas
// entre eles. Custo escala com os termos acesos, NÃO com o mapa completo.
//
// Estado atual: fixture hardcoded (igual o CMED começou com CMED_FIXTURE).
// Futuro (Metade 1 real): substituir FIXTURE_RELATIONS por chamada LLM
// que recebe os termos acesos + vizinhos diretos e gera as setas localmente.

import type { OntologyTerm } from '../types/ontology';
import type { Relation } from './relation';

// Setas candidatas de exemplo usando ids de termos reais do ontology-data.json.
// Representam relações plausíveis no contexto de farmácia (Pacheco).
const FIXTURE_RELATIONS: Relation[] = [
  {
    sourceTermId: 'caixa-preco-de-custo',
    targetTermId: 'vendas-reajuste-de-precos',
    type:         'precede',
    confidence:   0.78,
    status:       'candidata',
    origin:       'fixture',
    rationale:    'Aumento no preço de custo de medicamento regulado (CMED) precede necessidade de reajuste de preços na farmácia.',
  },
  {
    sourceTermId: 'vendas-reajuste-de-precos',
    targetTermId: 'vendas-estrategia-de-precos',
    type:         'causa',
    confidence:   0.71,
    status:       'candidata',
    origin:       'fixture',
    rationale:    'Reajuste de preços força revisão da estratégia de precificação do portfólio.',
  },
  {
    sourceTermId: 'caixa-preco-de-custo',
    targetTermId: 'vendas-estrategia-de-precos',
    type:         'agrava',
    confidence:   0.65,
    status:       'candidata',
    origin:       'fixture',
    rationale:    'Alta no custo de insumos agrava a pressão sobre a estratégia de preços ao consumidor final.',
  },
  {
    sourceTermId: 'vendas-ajuste-de-precos-sazonais',
    targetTermId: 'vendas-estrategia-de-precos',
    type:         'mede',
    confidence:   0.68,
    status:       'candidata',
    origin:       'fixture',
    rationale:    'Ajustes sazonais são um indicador operacional da estratégia de preços em execução.',
  },
];

/**
 * Recebe termos "acesos" pelo match de conteúdo (subconjunto pequeno dos 3.003)
 * e retorna as setas candidatas cujos DOIS extremos estão nesse subconjunto.
 *
 * Uso de Set para lookup O(1) — importante quando activeTerms cresce.
 */
export function generateCandidateRelations(activeTerms: OntologyTerm[]): Relation[] {
  const termIds = new Set(activeTerms.map(t => t.id));
  return FIXTURE_RELATIONS.filter(
    r => termIds.has(r.sourceTermId) && termIds.has(r.targetTermId)
  );
}
