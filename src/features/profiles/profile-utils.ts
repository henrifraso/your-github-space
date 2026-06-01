// Helpers de perfil/role — ponto de entrada único para a feature.
//
// Esta camada faz re-export do que já existe em `utils/roleUtils.ts` e
// `config/roleConfig.ts`. Não muda nenhum call site nesta fase. Imports
// futuros devem preferir o caminho `features/profiles/profile-utils`
// (ou os módulos irmãos `profile-labels` / `profile-permissions`).
//
// Não removemos os arquivos originais ainda — eles continuam servindo os
// imports legados. A migração gradual fica para fases posteriores.

export {
  isPersonalizedRole,
  getPendingCount,
  filterFranchisorCardsByTab,
  shouldShowRoleDemos,
} from '../../utils/roleUtils';

export {
  getRoleConfig,
  PERSONALIZED_ROLES,
} from '../../config/roleConfig';

export type { RoleConfig, RoleFeedCard } from '../../config/roleConfig';
