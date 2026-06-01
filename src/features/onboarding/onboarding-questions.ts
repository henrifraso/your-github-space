// Perguntas / fases / opções do onboarding inicial.
//
// Fachada — os símbolos canônicos vivem em `src/lib/onboarding.ts`.
// Esta camada é o ponto de entrada da feature `features/onboarding/`,
// alinhada com a estrutura adotada nas fases anteriores.
//
// Quando call sites futuros forem migrados, podem importar daqui em
// vez de `../../lib/onboarding`. O arquivo legado segue intocado.

export type { OnboardingPhase } from '../../lib/onboarding';
export {
  OB_PHASES_ORDER,
  OB_PHASE_LABELS,
  OB_PHASE_FIELD,
  OB_PHASE_OPTIONS,
  OB_COMPANY_TYPES,
  OB_EMPLOYEE_COUNTS,
  OB_REVENUE_RANGES,
  OB_SEGMENTS,
} from '../../lib/onboarding';
