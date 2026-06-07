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
  // Etapa 11
  /** ID do sinal territorial associado (rastreabilidade). */
  mapSignalId?: string;
  /** Quantidade de concorrentes considerados na análise do raio. */
  competitorsCount?: number;
  /** Label legível (ex: "Raio 1,0 km · 8 concorrentes"). */
  sourceLabel?: string;
  /** True se foi deduplicado (mesma action+sector+raio+centro). */
  deduped?: boolean;
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
  /**
   * Versão enriquecida da lista de oportunidades. Opcional pra manter
   * retro-compatibilidade com payloads antigos. Quando presente, o bridge
   * usa estes campos pra montar resumo + por que importa + ação.
   */
  oportunidadesDetalhadas?: { titulo: string; justificativa: string; prioridade: 'alta' | 'media' | 'baixa' }[];
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
  candidatos: {
    nome: string;
    /** Categorização do candidato: parceiro/fornecedor/prestador/complementar/concorrente-a-monitorar. */
    tipo: 'fornecedor' | 'parceiro' | 'prestador' | 'complementar' | 'concorrente-monitorar';
    distancia: string;
    observacao: string;
    /** Sugestão de tipo de parceria (bundling, cross-promo, white-label, etc.). Opcional. */
    parceriaSugerida?: string;
  }[];
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
  /**
   * Como os cenários foram estimados. Lista de fatores considerados
   * (densidade competitiva, reputação, etc.). Necessária pra evitar
   * "número mágico" — o cliente vê de onde saiu a estimativa.
   */
  fundamento?: string[];
  /** Aviso explícito de que isto é estimativa, não previsão. */
  aviso?: string;
  capturedAt: string;
}

// ─── Sinal territorial unificado (Etapa 9) ──────────────────────────────
// Estrutura cross-action que registra o contexto territorial de cada
// ação do mapa. Permite saber depois: que raio foi analisado, quais
// concorrentes foram considerados, que tipo de sinal foi gerado, se foi
// pra workspace/feed/missão, etc. Todos os campos opcionais são tolerados
// pra retro-compatibilidade — `MapTerritorialSignal` pode crescer sem
// quebrar dados antigos no localStorage.
export interface MapTerritorialSignal {
  id: string;
  source: 'map';
  /** Ação do mapa que gerou o sinal. */
  action: MapActionType | 'codify-territory-watchlist';
  /** Setor/perfil ativo no momento. */
  sector: string;
  /** Role do usuário (codify, franchise, etc.). */
  role?: string;
  /** Raio analisado, em metros. */
  radius: number;
  /** Centro da análise (lat/lng). */
  center: { lat: number; lng: number };
  /** Label opcional da região (cidade, bairro, descrição). */
  regionLabel?: string;
  /** Quantidade de concorrentes considerados. */
  competitorsCount: number;
  /** Nomes dos concorrentes considerados (até 10 pra não inflar storage). */
  competitorsUsed: string[];
  /** Nota média dos concorrentes no raio. */
  averageRating: number;
  /** Concorrentes com nota ≥ 4.3. */
  strongCompetitors: number;
  /** Concorrentes com nota < 4.0. */
  weakCompetitors: number;
  /** Concorrentes diretos no raio. */
  directCompetitors: number;
  /** Concorrentes indiretos no raio. */
  indirectCompetitors: number;
  /** Tipo de sinal — derivado da action ou heurística. */
  signalType:
    | 'concorrencia'
    | 'oportunidade'
    | 'risco'
    | 'comparacao'
    | 'missao'
    | 'parceiros'
    | 'simulacao'
    | 'feed'
    | 'watchlist'
    | 'sector-opportunity';
  /** Resumo curto (1-2 frases) gerado da análise. */
  summary: string;
  /** Nível de risco territorial. */
  riskLevel?: 'alto' | 'medio' | 'baixo';
  /** Nível de oportunidade territorial. */
  opportunityLevel?: 'alta' | 'media' | 'baixa';
  /** Marcado quando o sinal foi levado pra Área de Trabalho. */
  usedInWorkspace?: boolean;
  /** Marcado quando o sinal gerou cards no feed. */
  usedInFeed?: boolean;
  /** ID da missão derivada, se houver. */
  missionId?: string;
  /** Timestamp ISO. */
  timestamp: string;
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
