// Tipos de domínio do Mapa Competitivo OS¹.
// Espelham as 10 ações operacionais e seus shapes de saída/storage.

import type { Competitor } from '../../types';

export interface MapContextSnapshot {
  center: { lat: number; lng: number };
  radius: number; // metros (Infinity = sem limite)
  competitorsInRadius: Competitor[];
  totalAvailable: number;
  sector: string;
  businessName?: string;
  analysis: {
    total: number;
    avg: number;
    strongest?: Competitor;
    weakest?: Competitor;
    green: number; orange: number; red: number;
    diretos: number; indiretos: number;
  } | null;
}

export interface MapFeedCard {
  id: string;
  titulo: string;
  resumo: string;
  dominio: string;
  risco: string;
  oportunidade: string;
  urgencia: 'alta' | 'media' | 'baixa';
  raioMetros: number;
  localizacao: { lat: number; lng: number };
  acaoRecomendada: string;
  origem: 'mapa';
  capturedAt: string;
}

export interface MapMission {
  id: string;
  titulo: string;
  objetivo: string;
  contextoTerritorial: string;
  etapas: string[];
  responsavelSugerido: string;
  prazoSugerido: string;
  evidencias: string[];
  metricaSucesso: string;
  criterioConclusao: string;
  capturedAt: string;
}

export interface MapCompetitionAnalysis {
  id: string;
  resumo: string;
  concorrentesProximos: string[];
  concorrentesMaisFortes: string[];
  riscos: string[];
  brechas: string[];
  recomendacao: string;
  capturedAt: string;
}

export interface MapOpportunity {
  id: string;
  oportunidades: string[];
  acaoRecomendada: string;
  resumo: string;
  capturedAt: string;
}

export interface MapComparison {
  id: string;
  regiaoA: { label: string; total: number; avg: number; densidade: string };
  regiaoB: { label: string; total: number; avg: number; densidade: string };
  recomendacao: string;
  resumo: string;
  capturedAt: string;
}

export type MapActionType =
  | 'feed-from-radius'
  | 'analyze-competition'
  | 'find-opportunities'
  | 'compare-regions'
  | 'territory-to-mission'
  | 'monitor-territory'
  | 'risk-map'
  | 'sector-opportunities'
  | 'nearby-partners'
  | 'simulate-territory-action';

export interface MapTerritoryWatcher {
  id: string;
  center: { lat: number; lng: number };
  radius: number;
  sector: string;
  watchTypes: string[];
  createdAt: string;
}

export interface MapRiskAnalysis {
  id: string;
  riscos: { tipo: string; nivel: 'alto' | 'medio' | 'baixo'; descricao: string }[];
  resumo: string;
  recomendacao: string;
  capturedAt: string;
}

export interface MapSectorOpportunity {
  id: string;
  sector: string;
  oportunidades: { tipo: string; descricao: string; prioridade: 'alta' | 'media' | 'baixa' }[];
  acaoRecomendada: string;
  resumo: string;
  capturedAt: string;
}

export interface MapNearbyPartner {
  id: string;
  candidatos: { nome: string; tipo: 'fornecedor' | 'parceiro' | 'prestador'; distancia: string; observacao: string }[];
  recomendacao: string;
  resumo: string;
  capturedAt: string;
}

export interface MapTerritorySimulation {
  id: string;
  acao: string;
  cenarios: {
    conservador: { resultado: string; metrica: string };
    provavel: { resultado: string; metrica: string };
    agressivo: { resultado: string; metrica: string };
  };
  risco: string;
  metricaSucesso: string;
  proximaAcao: string;
  resumo: string;
  capturedAt: string;
}

export interface MapActionEventDetail {
  type: MapActionType;
  context: MapContextSnapshot;
  payload?:
    | MapFeedCard[]
    | MapMission
    | MapCompetitionAnalysis
    | MapOpportunity
    | MapComparison
    | MapTerritoryWatcher
    | MapRiskAnalysis
    | MapSectorOpportunity
    | MapNearbyPartner
    | MapTerritorySimulation;
}
