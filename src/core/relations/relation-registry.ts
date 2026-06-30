// Registro central de relações validadas — Motor de Relações Fase 2.
// NÃO ligado a nenhum fluxo. Ver projeto_omni_perfis_demo.md.
//
// Padrão idêntico ao source-registry.ts: array + funções de busca.
// Por ora começa com as mesmas setas fixture do gerador.
// Futuro: validadas (status 'validada') migram do gerador para cá
// após curadoria humana ou confirmação por dados reais (Metade 2).

import type { Relation, RelationType } from './relation';

export const RELATION_REGISTRY: Relation[] = [
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

/** Retorna todas as setas onde o termo é origem OU destino. */
export function getRelationsByTerm(termId: string): Relation[] {
  return RELATION_REGISTRY.filter(
    r => r.sourceTermId === termId || r.targetTermId === termId
  );
}

/** Retorna todas as setas de um tipo específico. */
export function getRelationsByType(type: RelationType): Relation[] {
  return RELATION_REGISTRY.filter(r => r.type === type);
}
