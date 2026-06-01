// Tipos e mapeamentos de role usados pelo fluxo de login.
//
// Esta camada é uma fachada — os símbolos canônicos já vivem em
// `core/types/profile.ts` (Fase 3) e `features/profiles/profile-labels.ts`
// (Fase 4). Re-exportamos aqui pra dar à pasta `features/auth/` seu
// próprio ponto de entrada.
//
// Mantém compatibilidade com o re-export histórico em
// `src/components/LoginScreen.tsx`.

export type { AutoLoginParams } from '../../core/types/profile';
export { ROLE_TO_HANDLE, HANDLE_TO_ROLE } from '../profiles/profile-labels';
