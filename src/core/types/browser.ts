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

  // Estrutura mínima da Etapa 8 (todos opcionais pra retro-compatibilidade
  // com evidências antigas no localStorage).
  /** Sempre 'browser' para evidências do navegador. */
  source?: 'browser';
  /** Ação que originou a evidência (save-evidence, capture-snippet, etc.). */
  action?: BrowserActionType | 'codify-watchlist';
  /** Trecho selecionado pelo usuário, se houver. Diferente de capturedText. */
  snippet?: string;
  /** Tipo da página classificada (regulatório, preço, concorrente, etc.). */
  pageType?: string;
  /** Role do usuário no momento da captura (codify, franchise, etc.). */
  role?: string;
  /** Label curta exibível na lista de evidências. */
  evidenceLabel?: string;
  /** Resumo curto (1-2 frases) gerado da página. */
  summary?: string;
  /** Nível de risco derivado do tipo da página ('alto'|'medio'|'baixo'). */
  riskLevel?: 'alto' | 'medio' | 'baixo';
  /** Marcada quando a evidência foi usada para abrir/popular workspace. */
  usedInWorkspace?: boolean;
  /** Marcada quando a evidência gerou card no feed. */
  usedInFeed?: boolean;
  /** ID do dossiê que referencia esta evidência, se houver. */
  dossierId?: string;
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
  // Etapa 10
  /** ID da evidência associada (rastreabilidade) */
  evidenceId?: string;
  /** Tipo da página (regulatório/preço/concorrente/...) */
  pageType?: string;
  /** Título da página de origem */
  sourceTitle?: string;
  /** Indica que foi deduplicado (mesma URL+tipo já existia) */
  deduped?: boolean;
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

// Síntese mínima do dossiê: payload enviado quando `create-dossier`
// abre a Área de Trabalho com tema central, pontos críticos, pendências
// e próximos passos. Não é uma entidade persistida (o dossiê embedded
// já está salvo); é só estrutura de exibição.
export interface BrowserDossierSynthesis {
  dossier: BrowserDossier;
  temaCentral: string;
  pontosCriticos: string[];
  pendencias: string[];
  proximosPassos: string[];
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
    | BrowserSectorAgentAnswer
    | BrowserDossierSynthesis;
}
