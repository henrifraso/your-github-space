// Motor de relações (fosso do Business Brain) — Fase 2.
// Estrutura isolada, ainda NÃO ligada a nada. Ver projeto_omni_perfis_demo.md.
//
// Uma Relation é uma seta tipada entre dois termos da ontologia.
// Leitura: sourceTermId [type] targetTermId
// ex: 'caixa-preco-de-custo' PRECEDE 'vendas-reajuste-de-precos'
//
// Estado atual: geração via fixture (setas escritas à mão).
// Futuro — Metade 1: LLM gera candidatas a partir de termos acesos pelo match.
// Futuro — Metade 2: dados reais do cliente promovem candidatas a validadas.

// Tipo de causalidade entre dois termos.
export type RelationType =
  | 'causa'      // A diretamente provoca B
  | 'mede'       // A é métrica/indicador de B
  | 'precede'    // A tende a ocorrer antes de B (temporal)
  | 'agrava'     // A torna B mais severo quando coexistem
  | 'mitiga'     // A reduz o impacto de B
  | 'correlata'; // A e B covariam; causalidade não estabelecida

// Ciclo de vida de uma seta.
export type RelationStatus =
  | 'candidata'   // gerada por LLM ou fixture, não confirmada
  | 'validada'    // aprovada por humano ou por dados reais
  | 'rejeitada';  // descartada após revisão

// Como a seta foi originada.
export type RelationOrigin =
  | 'llm'      // gerada pelo gerador localizado (Metade 1 do motor)
  | 'fixture'  // escrita à mão como exemplo (estado atual da Fase 2)
  | 'humano'   // inserida ou validada por curador humano
  | 'dados';   // confirmada por evidência em dados reais (Metade 2)

export interface Relation {
  // IDs dos dois termos — mesmo formato que OntologyTerm.id (ex: 'dominio-slug-termo-slug').
  sourceTermId: string;
  targetTermId: string;

  type: RelationType;

  // Confiança na seta: 0..1.
  // Candidatas LLM/fixture geralmente ficam em 0.65–0.85.
  // Validadas por dados chegam a 0.90+.
  confidence: number;

  status: RelationStatus;
  origin: RelationOrigin;

  // Explicação legível da seta — preenchida pelo LLM ou curador.
  rationale?: string;
}
