# features/browser

Navegador OS¹ — Electron webview + iframe fallback, com 10 ações operacionais
ligadas ao OS¹ (evidência, missão, dossiê, comparativo, etc.).

Conteúdo previsto:
- `BrowserToolbar.tsx`, `BrowserActionsMenu.tsx`, `BrowserFrame.tsx`,
  `IframeBrowserFallback.tsx`
- `useBrowserSession.ts`, `browser-url-utils.ts`
- `actions/` — catálogo, builders, storage, sessão das 10 ações

Regras críticas (não regredir):
- Electron webview com partition persistente
- iframe fallback (libcurl proxy quando aplicável)
- user-agent / cookies preservados
- menu "OS¹/Ações" com as 10 funções
- Desktop Capture continua atrás das flags default false (não reativar)
