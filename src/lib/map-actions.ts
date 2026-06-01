// ─────────────────────────────────────────────────────────────────────
// Fachada das Ações do Mapa Competitivo OS¹ (10 funções).
//
// Conteúdo real foi separado em módulos menores na Fase 15:
//   src/features/map/actions/
//     map-actions.types.ts      — re-export dos tipos públicos
//     map-actions.catalog.ts    — MAP_LS_KEYS (chaves localStorage)
//     map-actions.scoring.ts    — fmtKm + sectorVoice (helpers textuais)
//     map-actions.storage.ts    — loaders, aliases safeRead/safeWrite, clearAllMapData
//     map-actions.builders.ts   — 10 builders (buildMapFeedCards, ...)
//     map-actions.session.ts    — dispatchMapAction (canal OS1_EVENTS.MAP_ACTION)
//
// Imports antigos `from '../lib/map-actions'` continuam funcionando
// — todos os símbolos públicos saem daqui.
//
// COMENTÁRIO TÉCNICO (preservado):
// Fase 6 — 5 funções universais do Mapa Competitivo.
// Mesmo padrão das ações do navegador: manuais, locais (LS),
// CustomEvent pra App.tsx pontear.
// ─────────────────────────────────────────────────────────────────────

// Tipos
export type {
  MapContextSnapshot, MapFeedCard, MapMission, MapCompetitionAnalysis,
  MapOpportunity, MapComparison, MapActionType, MapTerritoryWatcher,
  MapRiskAnalysis, MapSectorOpportunity, MapNearbyPartner,
  MapTerritorySimulation, MapActionEventDetail,
} from '../core/types/map';

// Catálogo de chaves
export { MAP_LS_KEYS } from '../features/map/actions/map-actions.catalog';

// Storage: loader público + clear
export {
  loadMapFeedCards,
  clearAllMapData,
} from '../features/map/actions/map-actions.storage';

// Builders das 10 ações
export {
  buildMapFeedCards,
  buildCompetitionAnalysis,
  buildOpportunities,
  buildComparison,
  buildMapMission,
  addTerritoryWatcher,
  buildRiskAnalysis,
  buildSectorOpportunities,
  buildNearbyPartners,
  buildTerritorySimulation,
} from '../features/map/actions/map-actions.builders';

// Dispatcher de evento
export { dispatchMapAction } from '../features/map/actions/map-actions.session';
