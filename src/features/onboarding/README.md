# features/onboarding

Onboarding inicial — perguntas da empresa, storage local, fluxo
landing → auth → business → consent.

Conteúdo previsto (também pode ganhar uma irmã `features/auth/` numa fase
seguinte para isolar login/register/check-handle do onboarding em si):
- `onboarding-questions.ts` — perguntas da empresa (porte, segmento, etc.)
- `onboarding-storage.ts`   — persistência local das respostas

Regras críticas (não regredir):
- contas demo: `@codify/1234`, `@franqueador/1234`, `@franquia/1234`,
  `@parceiro/1234`, `@afiliado/1234`
- auto-login via querystring (`?token=...&org=...&bu=...&role=...`)
  continua funcionando exatamente igual
- ordem de escrita em localStorage durante o autoLogin é crítica
