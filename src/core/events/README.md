# core/events

Centraliza nomes e helpers dos eventos globais usados entre App, esfera,
navegador, mapa e Área de Trabalho.

Conteúdo previsto:
- `os1-events.ts` — constantes (`OS1_ANALYZE_COMPANY`, `os1:browser-action`,
  `os1:map-action`, `os1:ontology-diagnosis-cards-to-feed`, etc.) e helpers
  como `dispatchOS1Event` / `addOS1EventListener`.

Regra: nomes de evento como string literal só devem viver aqui. Quem dispara
ou ouve importa daqui — não digita a string solta.
