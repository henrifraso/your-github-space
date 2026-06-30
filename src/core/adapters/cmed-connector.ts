// Estrutura de conectores Fase 2 — ainda não conectada ao fluxo de feed.
// Ver projeto_omni_perfis_demo.md.
//
// Conector CMED/ANVISA — fonte pública de preços de medicamentos.
// Publicada pelo Ministério da Saúde, licença aberta para uso comercial.
// URL base (quando implementado): https://www.gov.br/anvisa/pt-br/assuntos/medicamentos/cmed/precos
//
// STUB: toIntelligenceCards retorna [] até a implementação real na Fase 2.
// Quando implementado: receberá o JSON/CSV da CMED e gerará cards descritivos
// de preço de referência para perfis de farmácia (ex: Pacheco VERTICAL).

import type { SourceConnector } from './source-connector';

export const CMED_CONNECTOR: SourceConnector = {
  id: 'cmed',
  name: 'CMED/ANVISA — Tabela de Preços de Medicamentos',
  analysisTypes: ['descritiva'],
  license: 'publica',
  status: 'planejado',
  toIntelligenceCards: (_raw: unknown) => {
    // Placeholder — implementação Fase 2.
    // Quando real: parsear o CSV/JSON da CMED e retornar cards do tipo:
    // "Preço máximo autorizado de [Produto]: R$ X,XX (PMVG) — vigência [data]"
    return [];
  },
};
