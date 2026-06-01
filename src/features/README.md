# features

Módulos por área do produto. Cada subpasta encapsula uma feature completa
(tipos específicos, componentes, hooks, lógica).

Subpastas:
- `workspace/`  — Área de Trabalho (ChatPanel, blocos, ferramentas, histórico)
- `feed/`       — feed do perfil ativo, cards gerados, fontes
- `browser/`    — navegador OS¹ (Electron webview + iframe fallback, 10 ações)
- `map/`        — mapa competitivo (Google Maps + Leaflet fallback, 10 ações)
- `ontology/`   — esfera + análise da empresa
- `profiles/`   — labels, role mapping, permissões
- `onboarding/` — perguntas, storage de onboarding (e auth quando coexistir)

Regras:
- Features podem importar de `core/`.
- Features NÃO devem importar entre si quando possível. Quando precisarem
  trocar dados, fazem isso via `core/events/` ou `core/types/`.
- Componentes visuais devem ficar perto da feature deles. Componentes
  realmente reutilizáveis sobem para `core/` ou ganham módulo próprio.
