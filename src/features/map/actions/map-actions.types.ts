// Tipos das Ações do Mapa Competitivo OS¹ — re-export central.
//
// Os tipos canônicos vivem em `core/types/map.ts` (movidos na Fase 3).
// Este arquivo existe pra que o módulo `features/map/actions/` tenha
// seu próprio ponto de entrada de tipos, conforme convenção da pasta.

export type {
  MapContextSnapshot, MapFeedCard, MapMission, MapCompetitionAnalysis,
  MapOpportunity, MapComparison, MapActionType, MapTerritoryWatcher,
  MapRiskAnalysis, MapSectorOpportunity, MapNearbyPartner,
  MapTerritorySimulation, MapActionEventDetail,
} from '../../../core/types/map';
