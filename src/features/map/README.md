# features/map

Mapa competitivo — Google Maps SDK + fallback Leaflet, com 10 funções
operacionais (análise de concorrência, oportunidades, simulação, etc.).

Conteúdo previsto:
- `MapActionsMenu.tsx`, `MapActionResult.tsx`
- `useMapAnalysis.ts`, `useMapActions.ts`, `map-ui-utils.ts`
- `actions/` — catálogo, builders, storage, scoring das 10 ações

Regras críticas (não regredir):
- Google Maps como primária, Leaflet como fallback
- raio configurável + 28 concorrentes por perfil já mockados
- botão "Ações" com 10 funções
- envio de cards para o feed/Área de Trabalho mantém canal atual
- ESC fecha o mapa
