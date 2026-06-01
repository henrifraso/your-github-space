// Tipos de domínio do Navegador OS¹.
//
// Espelham as 10 ações operacionais e seus shapes de saída/storage.
// Sem runtime — só tipos.

export interface BrowserActionContext {
  url: string;
  title: string;
  capturedText?: string;
  capturedAt: string; // ISO
  origin: 'navegador';
}

export interface BrowserEvidence extends BrowserActionContext {
  id: string;
  sector?: string;
  businessName?: string;
}

export interface BrowserMission extends BrowserActionContext {
  id: string;
  titulo: string;
  objetivo: string;
  etapas: string[];
  responsavelSugerido: string;
  prazoSugerido: string;
  evidenciaUrl: string;
  criterioConclusao: string;
}

export interface BrowserSessionVisit {
  url: string;
  title: string;
  visitedAt: string;
}

export interface BrowserFeedCard {
  id: string;
  titulo: string;
  resumo: string;
  dominio: string;
  risco: string;
  urgencia: 'alta' | 'media' | 'baixa';
  impacto: string;
  acaoRecomendada: string;
  evidenciaUrl: string;
  origem: 'navegador';
  capturedAt: string;
}

export interface BrowserSessionReport {
  id: string;
  generatedAt: string;
  totalVisits: number;
  sinaisDetectados: string[];
  riscos: string[];
  oportunidades: string[];
  possiveisCards: string[];
  proximosPassos: string[];
  resumo: string;
}

export type BrowserActionType =
  | 'send-to-workspace'
  | 'create-mission'
  | 'save-evidence'
  | 'generate-feed-card'
  | 'analyze-session'
  | 'compare-tabs'
  | 'monitor-page'
  | 'capture-snippet'
  | 'create-dossier'
  | 'ask-sector-agent';

export interface BrowserWatcher {
  id: string;
  url: string;
  title: string;
  watchType: 'mudança' | 'preço' | 'regra' | 'concorrente' | 'fornecedor';
  createdAt: string;
  sector?: string;
}

export interface BrowserDossier {
  id: string;
  nome: string;
  tipo: string;
  pages: { url: string; title: string; addedAt: string }[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrowserTabComparison {
  id: string;
  resumo: string;
  diferencas: string[];
  riscos: string[];
  vantagens: string[];
  recomendacao: string;
  melhorOpcao: string;
  capturedAt: string;
}

export interface BrowserSectorAgentAnswer {
  id: string;
  agente: string;
  pergunta: string;
  analise: string;
  observacoes: string[];
  proximosPassos: string[];
  capturedAt: string;
}

export interface BrowserActionEventDetail {
  type: BrowserActionType;
  context: BrowserActionContext;
  payload?:
    | BrowserMission
    | BrowserEvidence
    | BrowserFeedCard
    | BrowserSessionReport
    | BrowserTabComparison
    | BrowserWatcher
    | BrowserDossier
    | BrowserSectorAgentAnswer;
}
