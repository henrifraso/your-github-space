// Tipos de domínio da Área de Trabalho.
//
// Agrupa os tipos públicos consumidos por:
//  - ChatPanel (WorkspaceContext, CompanyDiagnosticPayload)
//  - Ferramentas (ToolGroup, ToolSource, ToolMode, ToolOutput,
//    WorkspaceToolContext, WorkspaceTool)
//
// Nenhum runtime aqui — só tipos.

import type { IntelligenceCard, WorkspaceIntent } from './card';

// ── Diagnóstico da empresa ──────────────────────────────────────────
// Payload entregue pela esfera/análise quando o resultado entra na
// Área de Trabalho como bloco kind='diagnostico'.
export interface CompanyDiagnosticPayload {
  summary: string;
  strongDomains: string[];
  weakDomains: string[];
  gaps: string[];
  risks: string[];
  opportunities: string[];
  nextSteps: string[];
  maturityScore?: number;
  legalNotice?: string;
}

// ── Contexto que abre a Área de Trabalho a partir de um card ────────
export type WorkspaceContext = {
  card: IntelligenceCard;
  intent: WorkspaceIntent;
  seq: number;
  diagnostic?: CompanyDiagnosticPayload;
};

// ── Ferramentas da Área de Trabalho ─────────────────────────────────
export type ToolGroup =
  | 'decisao' | 'execucao' | 'evidencia'
  | 'comunicacao' | 'monitoramento' | 'validacao'
  | 'analise' | 'documento';

export type ToolSource = 'feed' | 'browser' | 'map' | 'workspace' | 'diagnosis' | 'upload' | 'manual';
export type ToolMode = 'entender' | 'executar' | 'aprender' | 'compartilhar';

export interface ToolOutput {
  title: string;
  context: string;
  items: string[];
  expectedResult: string;
  nextStep: string;
  sensitiveNotice?: string;
}

export interface WorkspaceToolContext {
  source?: ToolSource;
  mode?: ToolMode;
  role?: string;
  activeSector?: string;
  domain?: string;
  areaMacro?: string;
  isSensitive?: boolean;
  cardTitle?: string;
  cardSummary?: string;
  contentText?: string;
  urgency?: string;
  tipo?: string;
}

export interface WorkspaceTool {
  id: string;
  label: string;
  description?: string;
  group: ToolGroup;
  appliesTo: string[];     // áreas/setores onde faz sentido. ['*'] = universal
  sensitive?: boolean;     // ferramenta destinada a contexto sensível
  source?: ToolSource[];   // fontes que disparam (opcional)
  modes?: ToolMode[];      // modos onde aparece (opcional)
  profile?: string[];      // perfis específicos (codify/franchisor/franchise/affiliate/partner)
  template: (ctx: WorkspaceToolContext) => ToolOutput;
}
