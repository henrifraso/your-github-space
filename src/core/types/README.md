# core/types

Tipos e interfaces de domínio compartilhados entre features.

Exemplos de conteúdo previsto:
- `card.ts`       — `IntelligenceCard` e variações sintéticas
- `workspace.ts`  — `WorkspaceBlock`, `BlockKind`, `WorkspaceContext`
- `profile.ts`    — `Role`, mapeamentos de perfil
- `browser.ts`    — `BrowserActionContext`, `BrowserEvidence`, etc.
- `map.ts`        — `MapContextSnapshot`, `MapFeedCard`, etc.
- `ontology.ts`   — payload de diagnóstico

Regra: somente tipos — nada de runtime, nada de import de React.
