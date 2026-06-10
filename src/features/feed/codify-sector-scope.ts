// Mapeia activeSector (legado do SectorSwitcher) → escopo real no backend
// (organizationId + unitId da Codify API v0). Função pura, sem deps.
//
// IDs vêm do seed da Sub-fase 4.3.b em produção (orgs reais criadas via
// /api/codify/v0/organizations). Mantemos os ids legados do SectorSwitcher
// (nike, nubank) por compatibilidade visual — só mapeamos o dado por baixo.
//
// Quando getCodifyScopeForSector retorna null:
//   - hook useCodifyFeed não dispara fetch
//   - Feed continua com demos/fallback como sempre (comportamento Fase 4.2)

import type { SectorId } from '../../components/SectorSwitcher';

export interface CodifyScope {
  organizationId: string;
  unitId?: string;
}

const SCOPE_MAP: Record<SectorId, CodifyScope | null> = {
  // OS¹ = perfil central do user logado; sem mapeamento estático
  os1: null,
  // 3 empresas reais (Sub-fase 4.3.b)
  mcdonalds: { organizationId: 'org-mcdonalds-brasil',  unitId: 'bu-mcdo-paulista' },
  nike:      { organizationId: 'org-oscar-calcados',    unitId: 'bu-oscar-matriz' },
  nubank:    { organizationId: 'org-drogaria-pacheco',  unitId: 'bu-pacheco-matriz' },
  // Demais sectors permanecem sem org real — não disparam fetch
  ifood:   null,
  ambev:   null,
  magalu:  null,
  embraer: null,
  tesla:   null,
  netflix: null,
  spotify: null,
  airbnb:  null,
  uber:    null,
  apple:   null,
  amazon:  null,
  natura:  null,
};

export function getCodifyScopeForSector(sector: SectorId): CodifyScope | null {
  return SCOPE_MAP[sector] ?? null;
}
