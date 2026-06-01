# core

Camada compartilhada por toda a aplicação OS¹.

Aqui ficam coisas que são usadas por mais de uma feature e que não pertencem a
nenhuma delas em particular:

- `types/`    — tipos e interfaces de domínio (card, workspace, profile, etc.)
- `events/`   — nomes e helpers dos eventos globais do OS¹ (postMessage, CustomEvent)
- `storage/`  — leitura/escrita segura de `localStorage`
- `adapters/` — conversões entre formatos (ex.: RoleFeedCard → IntelligenceCard)

Regra: nada aqui pode depender de `features/`. As features dependem de `core/`,
nunca o contrário.
