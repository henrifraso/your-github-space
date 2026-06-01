# features/profiles

Perfis (roles), labels visíveis e utilitários relacionados.

Conteúdo previsto:
- `profile-labels.ts`      — nomes visíveis (Perfil Central, Perfil Unidade, ...)
- `profile-permissions.ts` — permissões simples por role
- `profile-utils.ts`       — helpers de role (mapping, isPersonalizedRole, etc.)

Regras críticas (não regredir):
- valores internos `codify`, `franchisor`, `franchise`, `affiliate`, `partner`,
  `team_member` continuam idênticos no banco e nas chamadas de API
- handles `@codify`, `@franqueador`, `@franquia`, `@parceiro`, `@afiliado`
  continuam válidos no login
- mapeamentos entre role e UI continuam idênticos
