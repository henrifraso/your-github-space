# core/adapters

Conversões entre formatos de dados usados por diferentes features.

Conteúdo previsto:
- adaptação de `RoleFeedCard` → `IntelligenceCard`
- adaptação de `BrowserFeedCard` → `IntelligenceCard`
- adaptação de `MapFeedCard` → `IntelligenceCard`
- adaptação de cards de diagnóstico → bloco de Área de Trabalho

Regra: cada adapter deve ser função pura — recebe um shape, devolve outro.
Sem efeitos colaterais, sem dependência de React, sem leitura de localStorage.
