// Motor de Diagnóstico Ontológico OS¹ v1
// Compara empresa real vs estrutura ideal definida pela Ontologia v1.2
// Tudo local, determinístico, sem LLM, sem backend, sem token.

// Tipos públicos vivem em core/types/ontology.ts.
// Reexportamos aqui para manter compatibilidade com imports existentes.
import type {
  OntologyTerm, CompanyProfileInput, IdealDomainProfile, CompanyDomainSignal,
  DomainStatus, DomainDiagnosis, DiagnosisCardSuggestion, CompanyOntologyDiagnosis,
  BuildProfileInput, RankedDiagnosis,
} from '../core/types/ontology';
export type {
  OntologyTerm, CompanyProfileInput, IdealDomainProfile, CompanyDomainSignal,
  DomainStatus, DomainDiagnosis, DiagnosisCardSuggestion, CompanyOntologyDiagnosis,
  BuildProfileInput, RankedDiagnosis,
};

import { safeGetString, safeGetJSON, safeSetJSON } from '../core/storage/local-storage';
import { dispatchOS1Event, OS1_EVENTS } from '../core/events/os1-events';

// ── Constantes ──
export const ONTOLOGY_DIAGNOSIS_LS = {
  latest: 'os1_ontology_diagnosis_latest',
  cards: 'os1_ontology_diagnosis_cards',
  scores: 'os1_ontology_domain_scores',
} as const;

export const SENSITIVE_DOMAINS = [
  'Fiscal', 'Contábil', 'Jurídico', 'Trabalhista',
  'LGPD', 'Compliance', 'Regulatório', 'Contratos',
];

export const LEGAL_NOTICE =
  'Diagnóstico local gerado a partir dos dados disponíveis nesta sessão. ' +
  'Áreas sensíveis como Fiscal, Jurídico, Contábil, Trabalhista e LGPD exigem ' +
  'validação humana antes de qualquer decisão. As indicações abaixo são ' +
  'orientativas e baseadas em sinais. Não constituem parecer fiscal, ' +
  'contábil ou jurídico.';

// ─────────────────────────────────────────────────────────────────────
// FUNÇÕES — load + profile + ideal
// ─────────────────────────────────────────────────────────────────────

// 1. Carrega a ontologia via fetch do estático /ontology-data.json
let _cachedOntology: OntologyTerm[] | null = null;
export async function loadOntologyTerms(): Promise<OntologyTerm[]> {
  if (_cachedOntology) return _cachedOntology;
  // Tenta window.OS1_ONTOLOGY_TERMS (caso a esfera já tenha exposto)
  const w = (window as any).OS1_ONTOLOGY_TERMS;
  if (Array.isArray(w) && w.length > 0) {
    _cachedOntology = w as OntologyTerm[];
    return _cachedOntology;
  }
  const r = await fetch('/ontology-data.json', { cache: 'force-cache' });
  if (!r.ok) throw new Error(`ontology-data.json HTTP ${r.status}`);
  const data = await r.json() as OntologyTerm[];
  _cachedOntology = data;
  return data;
}

// 2. Monta CompanyProfileInput a partir do localStorage + props
// (BuildProfileInput agora vem de core/types/ontology.ts via re-export acima)
export function buildCompanyProfile(opts: BuildProfileInput = {}): CompanyProfileInput {
  let ctx: any = {};
  try {
    const raw = safeGetString('os1_onboarding_context');
    if (raw) ctx = JSON.parse(raw);
  } catch { /* ignore */ }
  const role = opts.role || safeGetString('os1_role') || 'codify';
  const activeSector = opts.activeSector || 'os1';
  // Heurística de estrutura por role interno (preservado conforme Fase 2)
  const structureByRole: Record<string, string> = {
    franchisor: 'central',
    franchise: 'unidade',
    codify: 'central',
    affiliate: 'central',
    partner: 'central',
    team_member: 'central',
  };
  const segment =
    opts.segment ||
    ctx.segment ||
    safeGetString('os1_onboarding_segment') ||
    (activeSector === 'mcdonalds' ? 'Alimentação'
      : activeSector === 'natura' ? 'Beleza/estética'
      : activeSector === 'nubank' ? 'Tecnologia'
      : activeSector === 'magalu' || activeSector === 'amazon' ? 'Varejo'
      : 'Serviços');
  return {
    companyType: ctx.companyType || safeGetString('os1_onboarding_company_type') ||
      (role === 'franchisor' ? 'Franquia/franqueadora'
        : role === 'franchise' ? 'Loja/unidade'
        : 'Empresa com múltiplos setores'),
    cnpj: ctx.cnpj || safeGetString('os1_onboarding_cnpj') || '',
    employeeCount: ctx.employeeCount || safeGetString('os1_onboarding_employee_count') || '21–50',
    revenueRange: ctx.revenueRange || safeGetString('os1_onboarding_revenue_range') || 'não informado',
    segment,
    structure: structureByRole[role] || 'central',
    role,
    activeSector,
    businessName: opts.businessName || safeGetString('os1_negocio_id') || activeSector,
    unitsCount: opts.unitsCount,
    country: 'BR',
  };
}

// 3. Define quais domínios a empresa DEVERIA ter
export function buildIdealDomainProfile(
  profile: CompanyProfileInput,
  terms: OntologyTerm[]
): IdealDomainProfile {
  // Domínios sempre exigidos pra qualquer empresa brasileira
  const required = new Set<string>([
    'Vendas', 'Clientes', 'Caixa', 'Faturamento',
    'Fiscal', 'Contábil', 'Trabalhista', 'LGPD',
    'Documentos', 'Licenças',
    'Atendimento', 'Reputação',
  ]);
  const recommended = new Set<string>([
    'CRM', 'Estoque', 'Compras', 'Fornecedores',
    'Marketing', 'Conversão', 'Pós-venda',
    'Processos', 'Qualidade', 'Entregas',
    'RH', 'Folha', 'Performance', 'Liderança',
    'Custos', 'Margem', 'Precificação',
    'Contratos', 'Compliance', 'Regulatório',
    'Segurança da Informação', 'Sistemas', 'BI',
    'Indicadores', 'Planejamento',
  ]);
  const advanced = new Set<string>([
    'OKR', 'OKR Review', 'Benchmark',
    'Data Analytics', 'Data Governance', 'Machine Learning',
    'Customer Success', 'NPS', 'Jornada do Cliente',
    'Modelo de Negócios', 'Diferencial Competitivo',
    'IA', 'Automação',
  ]);
  const strategic = new Set<string>([
    'Expansão', 'Novos Produtos', 'Novos Canais',
    'Market Share', 'Aquisição de Clientes',
    'Parcerias', 'Escala', 'Franquias', 'Unidades',
  ]);

  // Ajustes por estrutura
  if (profile.structure === 'central' || profile.companyType.toLowerCase().includes('franq')) {
    ['Governança', 'Conselho', 'Comitês', 'Auditoria', 'Ética',
     'Unidades', 'Expansão', 'Indicadores'].forEach(d => required.add(d));
  }
  if (profile.companyType.toLowerCase().includes('múltiplos setores') ||
      profile.companyType.toLowerCase().includes('grupo')) {
    ['Governança', 'Auditoria', 'Compliance', 'Risco Operacional'].forEach(d => required.add(d));
  }

  // Ajustes por porte (faturamento alto = governança vira essencial)
  const big = /1 milh|10 milh|acima/i.test(profile.revenueRange);
  if (big) {
    ['Conselho', 'Comitês', 'Auditoria', 'Risco Fiscal', 'Risco Financeiro',
     'Indicadores Financeiros', 'Tesouraria'].forEach(d => required.add(d));
  }

  // Ajustes por setor (usa setoresEspecificos da ontologia)
  const segLower = profile.segment.toLowerCase();
  const setorMap: Record<string, string[]> = {
    alimentação: ['Qualidade', 'Estoque', 'Insumos', 'Atendimento', 'Sazonalidade'],
    varejo: ['Canais de Venda', 'Estoque', 'Logística', 'Precificação', 'Reputação'],
    saúde: ['Regulatório', 'Qualidade', 'Compliance', 'Atendimento', 'Risco Regulatório'],
    educação: ['Regulatório', 'Atendimento', 'Performance', 'Reputação'],
    tecnologia: ['Sistemas', 'IA', 'Segurança da Informação', 'Data Analytics', 'Integrações'],
    indústria: ['Produção', 'Manutenção', 'Qualidade', 'Logística', 'Cadeia de Valor'],
    imobiliário: ['Contratos', 'Jurídico', 'Documentos', 'Regulatório'],
    'beleza/estética': ['Atendimento', 'Reputação', 'Estoque'],
    'fiscal/contábil': ['Fiscal', 'Contábil', 'Compliance', 'Documentos', 'Segurança da Informação', 'Trabalhista'],
    jurídico: ['Jurídico', 'Contratos', 'Contencioso', 'Compliance'],
    serviços: ['Atendimento', 'CRM', 'Pós-venda', 'Qualidade'],
  };
  for (const k of Object.keys(setorMap)) {
    if (segLower.includes(k)) {
      setorMap[k].forEach(d => required.add(d));
      break;
    }
  }

  // Sensíveis derivados da ontologia
  const sensitiveSet = new Set<string>();
  for (const t of terms) {
    if (t.sensibilidade === 'critica' || t.sensibilidade === 'alta') {
      if (required.has(t.dominio) || recommended.has(t.dominio)) {
        sensitiveSet.add(t.dominio);
      }
    }
  }

  // Recomendados e avançados nunca sobrepõem required
  for (const r of required) { recommended.delete(r); advanced.delete(r); }
  for (const r of recommended) { advanced.delete(r); }

  return {
    requiredDomains: Array.from(required).sort(),
    recommendedDomains: Array.from(recommended).sort(),
    advancedDomains: Array.from(advanced).sort(),
    sensitiveDomains: Array.from(sensitiveSet).sort(),
    strategicDomains: Array.from(strategic).sort(),
  };
}

// ─────────────────────────────────────────────────────────────────────
// FUNÇÕES — sinais + diagnóstico + cards
// ─────────────────────────────────────────────────────────────────────

function normalizar(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
}
// safeReadLS substituído por safeGetJSON de core/storage/local-storage.
// Mantemos alias com mesma assinatura pra não tocar nos call sites.
const safeReadLS = <T,>(key: string, fb: T): T => safeGetJSON<T>(key, fb);

// 4. Extrai sinais reais da empresa a partir dos dados locais
export function extractCompanySignals(profile: CompanyProfileInput): CompanyDomainSignal[] {
  const out: CompanyDomainSignal[] = [];

  // ── A) Sinais do perfil declarado ──
  if (profile.cnpj) out.push({ source: 'onboarding', text: 'cnpj informado', confidence: 0.7 });
  if (profile.segment) out.push({ source: 'onboarding', text: `segmento ${profile.segment}`, confidence: 0.6 });
  if (profile.companyType) out.push({ source: 'onboarding', text: `tipo ${profile.companyType}`, confidence: 0.5 });
  if (profile.businessName) out.push({ source: 'profile', text: `empresa ${profile.businessName}`, confidence: 0.4 });
  out.push({ source: 'profile', text: `papel ${profile.role}`, confidence: 0.3 });

  // ── B) Navegador (todas as 9 chaves) ──
  const browserSources: Array<[string, string]> = [
    ['os1_browser_evidences', 'evidência salva'],
    ['os1_browser_missions', 'missão proposta'],
    ['os1_browser_session_visits', 'página visitada'],
    ['os1_browser_feed_cards', 'card gerado no navegador'],
    ['os1_browser_session_reports', 'análise de sessão'],
    ['os1_browser_watchers', 'monitoramento ativo'],
    ['os1_browser_dossiers', 'dossiê criado'],
    ['os1_browser_tab_comparisons', 'comparação de abas'],
    ['os1_browser_agent_answers', 'pergunta ao agente'],
  ];
  for (const [key, label] of browserSources) {
    const arr = safeReadLS<any[]>(key, []);
    arr.slice(0, 30).forEach(it => {
      const text = `${label}: ${it.titulo ?? it.title ?? it.termo ?? it.url ?? ''}`;
      out.push({
        source: 'browser', text,
        url: it.url, createdAt: it.capturedAt ?? it.createdAt,
        confidence: 0.5,
      });
    });
  }

  // ── C) Mapa (todas as 10 chaves) ──
  const mapSources: Array<[string, string]> = [
    ['os1_map_generated_cards', 'card do mapa'],
    ['os1_map_missions', 'missão territorial'],
    ['os1_map_opportunities', 'oportunidade no território'],
    ['os1_map_comparisons', 'comparação de regiões'],
    ['os1_map_analyses', 'análise de concorrência'],
    ['os1_map_watchers', 'território monitorado'],
    ['os1_map_risks', 'mapa de risco'],
    ['os1_map_sector_opportunities', 'oportunidade por setor'],
    ['os1_map_nearby_partners', 'parceiro próximo'],
    ['os1_map_simulations', 'simulação territorial'],
  ];
  for (const [key, label] of mapSources) {
    const arr = safeReadLS<any[]>(key, []);
    arr.slice(0, 20).forEach(it => {
      const text = `${label}: ${it.titulo ?? it.resumo ?? it.acao ?? ''}`;
      out.push({
        source: 'map', text,
        createdAt: it.capturedAt ?? it.createdAt,
        confidence: 0.55,
      });
    });
  }

  return out;
}

// 5. Casa sinais com termos da ontologia (term match + sinônimos)
function matchSignalsToTerms(
  signals: CompanyDomainSignal[],
  terms: OntologyTerm[]
): Map<string, Set<string>> {  // dominio → Set(termoNormalizado matched)
  const byDom = new Map<string, Set<string>>();
  const normalizedSignals = signals.map(s => normalizar(s.text));
  for (const t of terms) {
    const candidates = [t.termoNormalizado, ...(t.sinonimos ?? []).map(normalizar)];
    let matched = false;
    for (const cand of candidates) {
      if (cand.length < 3) continue;
      if (normalizedSignals.some(ns => ns.includes(cand))) { matched = true; break; }
    }
    if (matched) {
      if (!byDom.has(t.dominio)) byDom.set(t.dominio, new Set());
      byDom.get(t.dominio)!.add(t.termoNormalizado);
    }
  }
  return byDom;
}

// 6. Diagnostica empresa contra ontologia
export function diagnoseCompanyAgainstOntology(
  profile: CompanyProfileInput,
  terms: OntologyTerm[],
  signals: CompanyDomainSignal[]
): DomainDiagnosis[] {
  const ideal = buildIdealDomainProfile(profile, terms);
  const matches = matchSignalsToTerms(signals, terms);

  // Agrupar termos por domínio (uma vez)
  const termsByDomain = new Map<string, OntologyTerm[]>();
  for (const t of terms) {
    if (!termsByDomain.has(t.dominio)) termsByDomain.set(t.dominio, []);
    termsByDomain.get(t.dominio)!.push(t);
  }

  // Universo de domínios a diagnosticar
  const all = new Set<string>([
    ...ideal.requiredDomains, ...ideal.recommendedDomains,
    ...ideal.advancedDomains, ...ideal.strategicDomains,
  ]);

  const result: DomainDiagnosis[] = [];
  for (const dominio of all) {
    const domTerms = termsByDomain.get(dominio) || [];
    const matched = matches.get(dominio) || new Set();
    const totalTermsOnArea = domTerms.length;
    const evidenceCount = matched.size;
    const coverageScore = totalTermsOnArea > 0
      ? Math.min(100, Math.round((evidenceCount / Math.max(1, Math.min(10, totalTermsOnArea))) * 100))
      : 0;
    const areaMacro = domTerms[0]?.areaMacro || '—';
    const isRequired = ideal.requiredDomains.includes(dominio);
    const isStrategic = ideal.strategicDomains.includes(dominio);
    const sensitivity = (
      domTerms.find(t => t.sensibilidade === 'critica')?.sensibilidade
      ?? domTerms.find(t => t.sensibilidade === 'alta')?.sensibilidade
      ?? 'media'
    ) as DomainDiagnosis['sensitivity'];
    const requerValidacaoHumana =
      sensitivity === 'critica' || sensitivity === 'alta' || SENSITIVE_DOMAINS.includes(dominio);

    // Status
    let status: DomainStatus;
    let riskLevel: DomainDiagnosis['riskLevel'] = 'baixo';
    let opportunityLevel: DomainDiagnosis['opportunityLevel'] = 'baixo';
    if (isRequired && evidenceCount === 0) {
      status = 'ausente';
      riskLevel = sensitivity === 'critica' ? 'critico' : sensitivity === 'alta' ? 'alto' : 'medio';
    } else if (evidenceCount === 0) {
      status = isStrategic ? 'oportunidade' : 'monitorado';
      opportunityLevel = isStrategic ? 'alto' : 'baixo';
    } else if (coverageScore < 30) {
      status = (sensitivity === 'critica' || sensitivity === 'alta') ? 'risco' : 'fraco';
      riskLevel = sensitivity === 'critica' ? 'alto' : 'medio';
    } else if (coverageScore < 70) {
      status = 'presente';
      opportunityLevel = 'medio';
    } else {
      status = 'forte';
    }

    const matchedList = Array.from(matched).slice(0, 5);
    // Top missing termos centrais (peso alto, não casados)
    const missing = domTerms
      .filter(t => !matched.has(t.termoNormalizado))
      .sort((a, b) => b.pesoBase - a.pesoBase)
      .slice(0, 4)
      .map(t => t.termo);

    result.push({
      areaMacro, dominio, status,
      coverageScore, evidenceCount,
      matchedTerms: matchedList, missingTerms: missing,
      riskLevel, opportunityLevel, sensitivity,
      requerValidacaoHumana, isRequired, isStrategic,
      totalTermsOnArea,
    });
  }
  return result;
}

// 7. Ranking — separa em strongest/weakest/critical/opportunities
// (RankedDiagnosis agora vem de core/types/ontology.ts via re-export acima)
export function rankDiagnosis(diags: DomainDiagnosis[]): RankedDiagnosis {
  const sortedScore = [...diags].sort((a, b) => b.coverageScore - a.coverageScore);
  const strongest = sortedScore.filter(d => d.status === 'forte' || d.status === 'presente').slice(0, 5);
  const weakest = sortedScore
    .filter(d => d.status === 'fraco' || d.status === 'ausente')
    .reverse().slice(0, 5);
  const critical = diags.filter(d =>
    d.isRequired && (d.status === 'ausente' || d.riskLevel === 'critico' || d.riskLevel === 'alto')
  ).slice(0, 5);
  const opportunities = diags.filter(d =>
    d.status === 'oportunidade' || (d.isStrategic && d.status !== 'forte')
  ).slice(0, 5);
  const sensitiveRisks = diags.filter(d =>
    d.requerValidacaoHumana && (d.status === 'risco' || d.status === 'ausente')
  ).slice(0, 5);
  return { strongest, weakest, critical, opportunities, sensitiveRisks };
}

// 8. Status auxiliar exportado
export function getDomainStatus(d: DomainDiagnosis): DomainStatus { return d.status; }

// 9. Cards sugeridos a partir do ranking
export function generateDiagnosisCards(
  ranked: RankedDiagnosis,
  diags: DomainDiagnosis[]
): DiagnosisCardSuggestion[] {
  const now = new Date().toISOString();
  const mk = (
    prefix: string, d: DomainDiagnosis,
    tipo: DiagnosisCardSuggestion['tipo'],
    urgencia: DiagnosisCardSuggestion['urgencia'],
    titulo: string, resumo: string, acao: string
  ): DiagnosisCardSuggestion => ({
    id: `ontodiag-${prefix}-${d.dominio.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.random().toString(36).slice(2, 6)}`,
    titulo, resumo,
    origem: 'diagnostico_ontologico',
    dominio: d.dominio, areaMacro: d.areaMacro,
    tipo, urgencia,
    risco: d.riskLevel, oportunidade: d.opportunityLevel,
    acaoRecomendada: acao,
    requerValidacaoHumana: d.requerValidacaoHumana,
    evidencias: d.matchedTerms,
    createdAt: now,
  });

  const cards: DiagnosisCardSuggestion[] = [];

  // Lacunas críticas (sempre primeiro)
  for (const d of ranked.critical.slice(0, 2)) {
    cards.push(mk('gap', d, 'lacuna', 'alta',
      `Indício de lacuna em ${d.dominio}`,
      `O domínio ${d.dominio} (${d.areaMacro}) é considerado essencial para o perfil informado e não foi identificado sinal na sessão atual.`,
      d.requerValidacaoHumana
        ? `Recomenda-se validação com responsável pelo domínio antes do próximo fechamento.`
        : `Considerar estruturar ${d.dominio} ou registrar evidência local.`
    ));
  }

  // Riscos sensíveis (fiscal/jurídico/contábil/trabalhista/LGPD)
  for (const d of ranked.sensitiveRisks.slice(0, 2)) {
    cards.push(mk('risk', d, 'risco', 'alta',
      `Risco potencial em ${d.dominio}`,
      `Há indício de cobertura insuficiente em ${d.dominio}, área sensível que demanda atenção e revisão por especialista.`,
      `Validar formalmente o estado de ${d.dominio} antes de qualquer decisão.`
    ));
  }

  // Domínios fracos
  for (const d of ranked.weakest.slice(0, 2)) {
    cards.push(mk('weak', d, 'fraco', 'media',
      `Cobertura fraca em ${d.dominio}`,
      `Sinais limitados foram identificados em ${d.dominio}. Cobertura estimada: ${d.coverageScore}%. Termos centrais não cobertos: ${d.missingTerms.slice(0, 3).join(', ') || '—'}.`,
      `Mapear termos centrais de ${d.dominio} e registrar evidências durante a operação semanal.`
    ));
  }

  // Oportunidades estratégicas
  for (const d of ranked.opportunities.slice(0, 2)) {
    cards.push(mk('opp', d, 'oportunidade', 'baixa',
      `Oportunidade em ${d.dominio}`,
      `${d.dominio} é estratégico para crescimento neste perfil e ainda não está consolidado.`,
      `Avaliar caminho de evolução em ${d.dominio} no plano dos próximos 90 dias.`
    ));
  }

  return cards.slice(0, 7);
}

// 10. Diagnóstico geral (compõe tudo)
function _resumoTexto(rk: RankedDiagnosis, profile: CompanyProfileInput): string {
  const fortes = rk.strongest.map(d => d.dominio).slice(0, 3);
  const lacunas = rk.critical.map(d => d.dominio).slice(0, 3);
  const opos = rk.opportunities.map(d => d.dominio).slice(0, 3);
  const partes: string[] = [];
  partes.push(`Diagnóstico local da empresa ${profile.businessName || '—'} (papel ${profile.role}, segmento ${profile.segment}).`);
  if (fortes.length) partes.push(`Presença identificada em ${fortes.join(', ')}.`);
  if (lacunas.length) partes.push(`Lacunas relevantes em ${lacunas.join(', ')}.`);
  if (opos.length) partes.push(`Oportunidades em ${opos.join(', ')}.`);
  partes.push('O OS¹ recomenda priorizar validação dos domínios sensíveis e organização de evidências.');
  return partes.join(' ');
}

function _maturityScore(diags: DomainDiagnosis[]): number {
  if (!diags.length) return 0;
  // Score ponderado: requeridos pesam mais
  let total = 0, weight = 0;
  for (const d of diags) {
    const w = d.isRequired ? 3 : d.isStrategic ? 2 : 1;
    total += d.coverageScore * w;
    weight += 100 * w;
  }
  return Math.round((total / Math.max(1, weight)) * 100);
}

export async function runFullDiagnosis(opts: BuildProfileInput = {}): Promise<CompanyOntologyDiagnosis> {
  const terms = await loadOntologyTerms();
  const profile = buildCompanyProfile(opts);
  const signals = extractCompanySignals(profile);
  const diags = diagnoseCompanyAgainstOntology(profile, terms, signals);
  const rk = rankDiagnosis(diags);
  const cards = generateDiagnosisCards(rk, diags);
  const diagnosis: CompanyOntologyDiagnosis = {
    version: 'ontology-diagnostics-v1',
    generatedAt: new Date().toISOString(),
    companyProfile: profile,
    summary: _resumoTexto(rk, profile),
    legalNotice: LEGAL_NOTICE,
    maturityScore: _maturityScore(diags),
    domains: diags,
    strongestDomains: rk.strongest.map(d => d.dominio),
    weakestDomains: rk.weakest.map(d => d.dominio),
    criticalGaps: rk.critical.map(d => d.dominio),
    opportunities: rk.opportunities.map(d => d.dominio),
    recommendedActions: cards.map(c => c.acaoRecomendada),
    cards,
  };
  // Persiste (helpers do core protegem contra quota/JSON inválido)
  safeSetJSON(ONTOLOGY_DIAGNOSIS_LS.latest, diagnosis);
  safeSetJSON(ONTOLOGY_DIAGNOSIS_LS.cards, cards);
  safeSetJSON(
    ONTOLOGY_DIAGNOSIS_LS.scores,
    Object.fromEntries(diags.map(d => [d.dominio, d.coverageScore])),
  );
  // Emite evento (App.tsx pode escutar pra injetar cards no feed)
  dispatchOS1Event(OS1_EVENTS.ONTOLOGY_DIAGNOSIS, diagnosis);
  return diagnosis;
}



