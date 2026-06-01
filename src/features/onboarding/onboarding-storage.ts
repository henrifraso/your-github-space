// Persistência do contexto de onboarding em localStorage.
//
// Fachada — os helpers canônicos vivem em `src/lib/onboarding.ts`
// (usam por baixo `core/storage/local-storage.ts` desde a Fase 5).
// Esta camada centraliza o ponto de entrada da feature
// `features/onboarding/`, alinhada com a estrutura adotada nas fases
// anteriores. Comportamento e chaves de localStorage idênticos.

export type { OnboardingContext } from '../../lib/onboarding';
export {
  OB_KEYS,
  loadOnboarding,
  saveOnboardingField,
  saveOnboardingContext,
  isOnboardingComplete,
} from '../../lib/onboarding';
