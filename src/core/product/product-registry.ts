// ProductVersion — molde de produto versionado (Fase 2). Ainda NÃO ligado ao App.tsx;
// a migração do framing é etapa futura. Ver projeto_omni_perfis_demo.md.
//
// Registro dos produtos OS¹ ativos. Hoje contém os 3 que já estão no ar.
// Os valores de name/badge/org foram copiados literalmente do App.tsx e do
// codify-sector-scope.ts para garantir consistência — NÃO foram inferidos.
//
// Para adicionar um produto novo: criar uma entrada aqui + o sector correspondente
// nos 6 pontos de toque (SectorSwitcher, sector-feeds, demo-feed-cards,
// codify-sector-scope, App.tsx framing, guards). A Fase 2 colapsa esses 6 pontos
// neste registro, eliminando a dispersão.

import type { SectorId } from '../../components/SectorSwitcher';
import type { ProductVersion } from './product-version';

export const PRODUCT_VERSION_REGISTRY: ProductVersion[] = [
  {
    id:                  'pacheco',
    sectorId:            'nubank',
    name:                'OS¹ Farmácia — Análise de Demanda e Categorias',
    badge:               'Vertical Segmentado',
    format:              'vertical',
    analysisTypes:       ['descritiva', 'diagnostica'],
    sourceIds:           ['cmed'],
    realOrgId:           'org-drogaria-pacheco',
    realUnitId:          'bu-pacheco-matriz',
    blocksStoreSwitcher: true,
  },
  {
    id:                  'oscar',
    sectorId:            'nike',
    name:                'OS¹ Calçados — Análise de Mercado',
    badge:               'Horizontal Segmentado',
    format:              'horizontal',
    analysisTypes:       ['descritiva', 'comparativa', 'tendencias'],
    sourceIds:           [],
    realOrgId:           'org-oscar-calcados',
    realUnitId:          'bu-oscar-matriz',
    blocksStoreSwitcher: true,
  },
  {
    id:                  'mcdonalds',
    sectorId:            'mcdonalds',
    name:                "OS¹ Fast Food — Inteligência Preditiva de Mercado",
    badge:               'Radial — Preditivo',
    format:              'radial',
    analysisTypes:       ['preditiva'],
    sourceIds:           [],
    realOrgId:           'org-mcdonalds-brasil',
    realUnitId:          'bu-mcdo-paulista',
    blocksStoreSwitcher: true,
  },
];

/** Busca um ProductVersion pelo sectorId legado (ex: 'nubank' → Pacheco). */
export function getProductBySector(sectorId: SectorId): ProductVersion | undefined {
  return PRODUCT_VERSION_REGISTRY.find(p => p.sectorId === sectorId);
}

/** Busca um ProductVersion pelo id semântico (ex: 'pacheco'). */
export function getProductById(id: string): ProductVersion | undefined {
  return PRODUCT_VERSION_REGISTRY.find(p => p.id === id);
}
