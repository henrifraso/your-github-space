// Tipos do motor de diagnóstico ontológico.
//
// Espelha o vocabulário interno (Ontologia v1.2) — vocabulário visível
// ao usuário NÃO usa esses termos (a Esfera fala "Análise da empresa").

export interface OntologyTerm {
  id: string;
  termo: string;
  termoNormalizado: string;
  areaMacro: string;
  dominio: string;
  subdominio: string;
  categoriaOriginal: string | null;
  camada: string;
  tipo: string[];
  sensibilidade: 'baixa' | 'media' | 'alta' | 'critica';
  aplicavelA: string[];
  portes: string[];
  estruturas: string[];
  segmentos: string[];
  sinaisRelacionados: string[];
  riscosRelacionados: string[];
  oportunidadesRelacionadas: string[];
  acoesPossiveis: string[];
  agentesSugeridos: string[];
  requerValidacaoHumana: boolean;
  paisBase: string;
  escopo: string;
  pesoBase: number;
  maturidadeEsperada: string;
  setoresEspecificos?: string[];
  sinonimos?: string[];
}

export interface CompanyProfileInput {
  companyType: string;
  cnpj: string;
  employeeCount: string;
  revenueRange: string;
  segment: string;
  structure: string;
  role: string;
  activeSector: string;
  businessName: string;
  unitsCount?: number;
  country: 'BR';
}

export interface IdealDomainProfile {
  requiredDomains: string[];
  recommendedDomains: string[];
  advancedDomains: string[];
  sensitiveDomains: string[];
  strategicDomains: string[];
}

export interface CompanyDomainSignal {
  source: 'onboarding' | 'browser' | 'map' | 'feed' | 'workspace' | 'profile';
  text: string;
  url?: string;
  domainGuess?: string;
  areaGuess?: string;
  confidence: number; // 0..1
  createdAt?: string;
}

export type DomainStatus =
  | 'forte'
  | 'presente'
  | 'fraco'
  | 'ausente'
  | 'risco'
  | 'oportunidade'
  | 'monitorado';

export interface DomainDiagnosis {
  areaMacro: string;
  dominio: string;
  status: DomainStatus;
  coverageScore: number; // 0..100
  evidenceCount: number;
  matchedTerms: string[];
  missingTerms: string[];
  riskLevel: 'baixo' | 'medio' | 'alto' | 'critico';
  opportunityLevel: 'baixo' | 'medio' | 'alto';
  sensitivity: 'baixa' | 'media' | 'alta' | 'critica';
  requerValidacaoHumana: boolean;
  isRequired: boolean;
  isStrategic: boolean;
  totalTermsOnArea: number;
}

export interface DiagnosisCardSuggestion {
  id: string;
  titulo: string;
  resumo: string;
  origem: 'diagnostico_ontologico';
  dominio: string;
  areaMacro: string;
  tipo: 'lacuna' | 'risco' | 'oportunidade' | 'fraco' | 'acao' | 'analise' | 'missao';
  urgencia: 'alta' | 'media' | 'baixa';
  risco: string;
  oportunidade: string;
  acaoRecomendada: string;
  requerValidacaoHumana: boolean;
  evidencias: string[];
  createdAt: string;
}

export interface CompanyOntologyDiagnosis {
  version: 'ontology-diagnostics-v1';
  generatedAt: string;
  companyProfile: CompanyProfileInput;
  summary: string;
  legalNotice: string;
  maturityScore: number; // 0..100
  domains: DomainDiagnosis[];
  strongestDomains: string[];
  weakestDomains: string[];
  criticalGaps: string[];
  opportunities: string[];
  recommendedActions: string[];
  cards: DiagnosisCardSuggestion[];
}

export interface BuildProfileInput {
  role?: string;
  activeSector?: string;
  businessName?: string;
  segment?: string;
  unitsCount?: number;
}

export interface RankedDiagnosis {
  strongest: DomainDiagnosis[];
  weakest: DomainDiagnosis[];
  critical: DomainDiagnosis[];
  opportunities: DomainDiagnosis[];
  sensitiveRisks: DomainDiagnosis[];
}
