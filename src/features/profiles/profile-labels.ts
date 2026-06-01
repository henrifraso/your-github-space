// Labels e mapeamentos visíveis de perfil/role.
//
// IMPORTANTE: os VALORES INTERNOS de role (`codify`, `franchisor`,
// `franchise`, `affiliate`, `partner`, `team_member`) não mudam. Aqui
// só centralizamos:
//   - role → handle visível no login (@codify, @franqueador, ...)
//   - role → nome visível (Codify, Perfil Central, Perfil Unidade, ...)
//
// Display names mais ricos (avatar, bio.displayName, swipeOptions, etc.)
// continuam em `src/config/roleConfig.ts`, que é uma camada acima.

// Role do backend → handle visível no typewriter / autoFill.
// Origem original: src/components/LoginScreen.tsx (mantido como fonte da
// verdade até esta fase; agora centralizado aqui).
export const ROLE_TO_HANDLE: Record<string, string> = {
  codify: 'codify',
  franchisor: 'franqueador',
  franchise: 'franquia',
  team_member: 'afiliado',
  affiliate: 'afiliado',
  partner: 'parceiro',
};

// Inverso útil para ler um handle digitado e descobrir o role do backend.
// `team_member` e `affiliate` colidem em 'afiliado' — convencionamos
// `affiliate` como destino canônico (alinha com o que o backend retorna
// hoje para contas demo).
//
// NÃO aplicado em nenhum call site ainda — só disponível para uso futuro.
export const HANDLE_TO_ROLE: Record<string, string> = {
  codify: 'codify',
  franqueador: 'franchisor',
  franquia: 'franchise',
  afiliado: 'affiliate',
  parceiro: 'partner',
};

// Nome visível canônico de cada role. Usado apenas como referência
// nesta fase — chamadas reais continuam pegando `displayName` do
// `RoleConfig` (config/roleConfig.ts), que é mais rico e por instância
// (Codify Demo, Perfil Central Demo, etc.).
export const ROLE_DISPLAY_LABEL: Record<string, string> = {
  codify: 'Codify',
  franchisor: 'Perfil Central',
  franchise: 'Perfil Unidade',
  affiliate: 'Afiliado',
  team_member: 'Afiliado',
  partner: 'Parceiro',
};
