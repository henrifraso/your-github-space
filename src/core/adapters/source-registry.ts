// Estrutura de conectores Fase 2 — ainda não conectada ao fluxo de feed.
// Ver projeto_omni_perfis_demo.md.
//
// Catálogo central de fontes de dado conhecidas pelo sistema.
// Inclui fontes já implementadas (status: 'disponivel') e planejadas
// (status: 'planejado' | 'contratado') — serve como documentação viva
// do catálogo de mineradoras/fornecedores.
//
// Para adicionar uma nova fonte: criar o conector em cmed-connector.ts
// como modelo, implementar toIntelligenceCards, e registrar aqui.
// NÃO conectar ao fluxo de feed sem aprovação — ver regras de licença.

import type { SourceConnector } from './source-connector';
import { CMED_CONNECTOR } from './cmed-connector';
import { CMED_FIXTURE } from '../../data/cmed-fixture';

/** Dados brutos de demonstração por sourceId. Alimenta toIntelligenceCards em dev/demo. */
export const FIXTURE_MAP: Record<string, unknown> = {
  cmed: CMED_FIXTURE,
};

// Fontes planejadas para Fase 2 (sem conector implementado ainda).
// Referência: Bright Data, Oxylabs, Zyte (licença comercial — exige contrato);
// Datarade como marketplace de partida para compra de dado bruto.
// Tipos de dado profundo: transação de PDV, mobilidade/geolocalização,
// scraping de concorrente, painel de cesta.
// ⚠️ Consultar advogado antes de ativar qualquer fonte 'comercial'.

export const SOURCE_REGISTRY: SourceConnector[] = [
  CMED_CONNECTOR,
  // Fontes planejadas — adicionar conectores aqui na Fase 2:
  // BRIGHTDATA_ECOMMERCE_CONNECTOR,
  // OXYLABS_COMPETITOR_CONNECTOR,
  // ZYTE_SCRAPER_CONNECTOR,
  // PDV_PANEL_CONNECTOR,
  // MOBILITY_GEO_CONNECTOR,
];

/** Busca um conector pelo id. Retorna undefined se não encontrado. */
export function getConnector(id: string): SourceConnector | undefined {
  return SOURCE_REGISTRY.find(c => c.id === id);
}

/** Lista conectores por tipo de análise. */
export function getConnectorsByAnalysis(type: SourceConnector['analysisTypes'][number]): SourceConnector[] {
  return SOURCE_REGISTRY.filter(c => c.analysisTypes.includes(type));
}
