# features/ontology

Esfera ontológica + Análise da empresa.

Conteúdo previsto:
- `OntologySphereOverlay.tsx` — wrapper do iframe da esfera
- listener/dispatcher de `OS1_ANALYZE_COMPANY`
- mapeamento `CompanyOntologyDiagnosis` → `CompanyDiagnosticPayload`

Regra de linguagem (UI): nada de "rodando algoritmo ontológico" ou
"classificação ontológica" para o usuário final. Internamente os módulos
podem manter o termo. Para o usuário a expressão é "Análise da empresa".

Regra de fluxo: clique em "Analisar minha empresa" envia o resultado para a
Área de Trabalho como bloco — nunca como overlay sobre o feed.
