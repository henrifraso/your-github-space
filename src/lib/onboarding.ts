// Onboarding inicial — 5 perguntas antes de usuário/senha.
// Persistência: localStorage. Não há endpoint backend nesta fase.

export const OB_KEYS = {
  companyType: 'os1_onboarding_company_type',
  cnpj: 'os1_onboarding_cnpj',
  employeeCount: 'os1_onboarding_employee_count',
  revenueRange: 'os1_onboarding_revenue_range',
  segment: 'os1_onboarding_segment',
  context: 'os1_onboarding_context',
} as const;

export const OB_COMPANY_TYPES = [
  'Empresa individual',
  'Loja/unidade',
  'Grupo empresarial',
  'Franquia/franqueadora',
  'Associação',
  'Empresa com múltiplos setores',
  'Outro',
] as const;

export const OB_EMPLOYEE_COUNTS = [
  '1–5',
  '6–20',
  '21–50',
  '51–200',
  '201–1000',
  '1000+',
] as const;

export const OB_REVENUE_RANGES = [
  'Até R$ 50 mil/mês',
  'R$ 50 mil a R$ 200 mil/mês',
  'R$ 200 mil a R$ 1 milhão/mês',
  'R$ 1 milhão a R$ 10 milhões/mês',
  'Acima de R$ 10 milhões/mês',
  'Prefiro não informar',
] as const;

export const OB_SEGMENTS = [
  'Alimentação', 'Varejo', 'Saúde', 'Educação', 'Serviços', 'Indústria',
  'Imobiliário', 'Tecnologia', 'Beleza/estética', 'Fiscal/contábil', 'Jurídico', 'Outro',
] as const;

export interface OnboardingContext {
  companyType: string;
  cnpj: string;
  employeeCount: string;
  revenueRange: string;
  segment: string;
  createdAt: string;
}

const FIELD_KEY: Record<keyof Omit<OnboardingContext, 'createdAt'>, string> = {
  companyType: OB_KEYS.companyType,
  cnpj: OB_KEYS.cnpj,
  employeeCount: OB_KEYS.employeeCount,
  revenueRange: OB_KEYS.revenueRange,
  segment: OB_KEYS.segment,
};

export function loadOnboarding(): Partial<OnboardingContext> {
  try {
    const raw = localStorage.getItem(OB_KEYS.context);
    if (raw) {
      const parsed = JSON.parse(raw) as OnboardingContext;
      return parsed;
    }
  } catch { /* ignore parse error */ }
  return {
    companyType: localStorage.getItem(OB_KEYS.companyType) ?? '',
    cnpj: localStorage.getItem(OB_KEYS.cnpj) ?? '',
    employeeCount: localStorage.getItem(OB_KEYS.employeeCount) ?? '',
    revenueRange: localStorage.getItem(OB_KEYS.revenueRange) ?? '',
    segment: localStorage.getItem(OB_KEYS.segment) ?? '',
  };
}

export function saveOnboardingField(field: keyof Omit<OnboardingContext, 'createdAt'>, value: string) {
  try { localStorage.setItem(FIELD_KEY[field], value); } catch { /* ignore quota */ }
}

export function saveOnboardingContext(partial: Partial<OnboardingContext>): OnboardingContext {
  const full: OnboardingContext = {
    companyType: partial.companyType ?? localStorage.getItem(OB_KEYS.companyType) ?? '',
    cnpj: partial.cnpj ?? localStorage.getItem(OB_KEYS.cnpj) ?? '',
    employeeCount: partial.employeeCount ?? localStorage.getItem(OB_KEYS.employeeCount) ?? '',
    revenueRange: partial.revenueRange ?? localStorage.getItem(OB_KEYS.revenueRange) ?? '',
    segment: partial.segment ?? localStorage.getItem(OB_KEYS.segment) ?? '',
    createdAt: partial.createdAt ?? new Date().toISOString(),
  };
  try { localStorage.setItem(OB_KEYS.context, JSON.stringify(full)); } catch { /* ignore */ }
  return full;
}

// CNPJ é opcional. Os outros 4 são obrigatórios pra considerar completo.
export function isOnboardingComplete(ctx: Partial<OnboardingContext>): boolean {
  return !!(ctx.companyType && ctx.employeeCount && ctx.revenueRange && ctx.segment);
}

export type OnboardingPhase =
  | 'ob-company-type'
  | 'ob-cnpj'
  | 'ob-employees'
  | 'ob-revenue'
  | 'ob-segment';

export const OB_PHASES_ORDER: OnboardingPhase[] = [
  'ob-company-type', 'ob-cnpj', 'ob-employees', 'ob-revenue', 'ob-segment',
];

export const OB_PHASE_LABELS: Record<OnboardingPhase, string> = {
  'ob-company-type': 'Tipo de empresa',
  'ob-cnpj': 'CNPJ',
  'ob-employees': 'Quantos funcionários?',
  'ob-revenue': 'Faturamento aproximado',
  'ob-segment': 'Segmento principal',
};

export const OB_PHASE_FIELD: Record<OnboardingPhase, keyof Omit<OnboardingContext, 'createdAt'>> = {
  'ob-company-type': 'companyType',
  'ob-cnpj': 'cnpj',
  'ob-employees': 'employeeCount',
  'ob-revenue': 'revenueRange',
  'ob-segment': 'segment',
};

export const OB_PHASE_OPTIONS: Record<Exclude<OnboardingPhase, 'ob-cnpj'>, readonly string[]> = {
  'ob-company-type': OB_COMPANY_TYPES,
  'ob-employees': OB_EMPLOYEE_COUNTS,
  'ob-revenue': OB_REVENUE_RANGES,
  'ob-segment': OB_SEGMENTS,
};
