# features/feed

Lógica do feed do perfil ativo: cards do role, cards gerados (navegador e
mapa), cards sintéticos de diagnóstico e adapters para a Área de Trabalho.

Conteúdo previsto:
- `useFeedState.ts`        — estado consolidado do feed por setor
- `feed-sources.ts`        — origens de cards (role, demo, browser, map, ontology)
- `feed-card-adapters.ts`  — conversões para `IntelligenceCard`
- `feed-generated-cards.ts`— cards injetados pelo navegador e mapa

Regra: feed não decide UX — entrega `IntelligenceCard[]` pronto e cuida da
ordem. Render fica no componente que consome.
