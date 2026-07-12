# Portfólio de Fontes de Dados — Motor OS¹

**Última atualização:** jul/2026  
**Escopo:** referência de negócio, não código. Nenhuma fonte aqui está integrada
ao sistema — este documento registra o que existe, o que foi testado e o que está
bloqueado para informar a construção do motor.

---

## Lógica do motor

O motor do OS¹ não monitora o que a sua empresa faz — monitora o que o **mercado**
faz. A leitura útil tem três camadas:

1. **MOVIMENTO** — o que um concorrente ou player setorial fez (lançamento,
   expansão, M&A, recall, mudança de preço)
2. **CAUSA** — o que mudou no mercado que gerou esse movimento (commodity sobe,
   câmbio vira, novo regulatório entra)
3. **SIGNIFICADO** — o que esse conjunto implica para a empresa do cliente

O motor precisa de fontes para cada camada. Fontes de evento capturam o movimento;
fontes de macro/commodities explicam a causa; a análise (cards) traduz em
significado. Dados internos do cliente não são necessários para a camada 1 e 2 —
o produto é de análise de mercado **externa**.

---

## Status dos testes

| Símbolo | Significado |
|---------|-------------|
| ✅ | Testado, dado real confirmado, URL correta anotada |
| 🔜 | A testar — identificada, não confirmada |
| ❌ | Bloqueada — 403, DNS fail ou sem acesso sem pagamento |
| 💰 | Paga — requer contrato ou assinatura |

---

## 1. Movimento de concorrentes — eventos, M&A, recall, campanhas

| Nome | O que entrega | Grátis/Pago | Status | Observação |
|------|---------------|-------------|--------|------------|
| **Google News RSS** | Artigos de notícia por query em PT-BR | Grátis | ✅ | Espinha dorsal de eventos. ~semanas de defasagem; paywall só traz snippet |
| **RSS SuperHiper** | Trade de alimentos/varejo (ABRAS) | Grátis | ✅ | 5/5 links ok; publicação regular |
| **RSS AgFeed** | M&A agro, expansion, deals | Grátis | ✅ | 5/5 links ok |
| **RSS Consumidor Moderno** | Tendências de consumo e CX | Grátis | ✅ | Requer fix XML: `re.sub(r'^[^<]+', '', text)` antes de parsear |
| **RSS Canal Rural** | Agro geral | Grátis | ✅ | Só snippet (artigos retornam 403) |
| **GDELT Project** | Eventos globais extraídos de notícias (GKG) | Grátis | 🔜 | Base enorme; filtrar por país BR + tema |
| **Portal Transparência** | Contratos públicos, sanções, CNPJ gov | Grátis | 🔜 | Empresa licitante = sinal de expansão |
| **PNCP** | Compras públicas federais em tempo real | Grátis | 🔜 | Novo portal gov (2023); API documentada |
| **Owler** | Notícias, receita estimada, headcount estimado de empresas | Freemium | 🔜 | Tier grátis limitado; dado agregado de concorrentes |
| **Reclame Aqui** | Reclamações de consumidor por empresa | Grátis | ❌ | 403 total — sem acesso programático |
| **Trustpilot** | Reviews internacionais | Grátis | ❌ | 403 total |

---

## 2. Dado financeiro / resultado de empresas abertas

| Nome | O que entrega | Grátis/Pago | Status | Observação |
|------|---------------|-------------|--------|------------|
| **CVM Dados Abertos** | DFP, ITR, FRE de empresas abertas (BR) | Grátis | ✅ | CSV semicolon latin-1. CD_CVM = 6 dígitos zero-padded. Camil=024228, Josapar=013285 |
| **Bureau van Dijk Orbis** | Financeiro de empresas privadas globais | 💰 | 💰 | Referência máxima para privadas |
| **Boa Vista / SCPC** | Score, inadimplência, crédito empresarial BR | 💰 | 💰 | Risco de crédito de fornecedor/cliente |
| **Quod** | Bureau de crédito BR (sócios Bradesco, Itaú, BB, etc.) | 💰 | 💰 | Alternativa ao Boa Vista |

---

## 3. Macro e contexto de custo

| Nome | O que entrega | Grátis/Pago | Status | Observação |
|------|---------------|-------------|--------|------------|
| **BCB SGS** | Selic, IPCA geral, IPCA Alimentação, câmbio, IPA, ICC, IPCA Cereais | Grátis | ✅ | `api.bcb.gov.br/dados/serie/bcdata.sgs.{id}/dados` sem auth. IDs: 432 Selic · 433 IPCA · 7478 IPCA Alim · 3698 USD/BRL · 28479 ICC · 7468 IPA Agro · 25433 IPCA Cereais |
| **IPEA Data API** | Preços de commodity, câmbio, indicadores econômicos | Grátis | ✅ | OData v4. Usar `$top=12&$orderby=VALDATA desc`. Filtro: `substringof()` não `contains()`. Séries testadas: arroz atacado, milho SP, milho internacional |
| **INMET** | Clima, temperatura, precipitação BR | Grátis | 🔜 | Impacta produção agrícola diretamente |

---

## 4. Dado setorial / commodities / agronegócio

| Nome | O que entrega | Grátis/Pago | Status | Observação |
|------|---------------|-------------|--------|------------|
| **CONAB** | Balanço oferta-demanda safra por produto (milho, arroz, soja, feijão) | Grátis | ✅ | ⚠️ domínio: `gov.br/conab` (não `dados.conab.gov.br`). Boletins mensais xlsx. openpyxl para ler. Milho 25/26: 140.4 Mt · Arroz: 11.1 Mt |
| **IBGE LSPA** | Produção agrícola mensal por cultura | Grátis | ✅ | ⚠️ endpoint: `apisidra.ibge.gov.br` (não `servicodados`). Tabela 6588. Milho mai/26: 139.4 Mt. Convergência CONAB < 1% |
| **CEPEA / ESALQ (USP)** | Preços de commodities BR (soja, milho, café, cana, frango) | Grátis | 🔜 | Referência de mercado físico BR. Scraping via site ou planilha download |
| **agrobr.dev** | API unificada de 38 fontes agro BR (CEPEA, CONAB, IBGE, IMEA, INMET, MapBiomas, BCB/SICOR) | Grátis | 🔜 | Descoberta nova — se funciona, elimina integração individual de 6+ fontes |
| **ESALQ-LOG / SIFRECA** | Fretes agro por corredor (MT → Paranaguá/Santos) | Grátis | 🔜 | Único banco público de frete agrícola. Impacta margem de exportadores |
| **IMEA** | Soja, milho, algodão — dados do Mato Grosso | Grátis + Premium | 🔜 | Granular por estado; MT = maior produtor BR |
| **EMBRAPA / AgroAPI** | Dados agropecuários técnicos, pesquisa | Grátis | 🔜 | Qualidade técnica alta; frequência baixa |
| **MapBiomas** | Uso da terra, desmatamento, área cultivada | Grátis | 🔜 | Contexto fundiário e expansão de área plantada |
| **ANP** | Preços de combustíveis, etanol, produção petrolífera | Grátis | 🔜 | Custo logístico direto para toda cadeia |
| **MAPA / Agrofit** | Produtos fitossanitários registrados, defensivos | Grátis | 🔜 | Insumos: qual defensivo está aprovado/banido |
| **CAR / SICAR** | Cadastro ambiental rural, área de propriedades | Grátis | 🔜 | ESG / due diligence agro |
| **ANM / SIGMINE** | Mineração: concessões, produção, empresas | Grátis | 🔜 | Setor mineral BR |
| **ABRAS** | Dados de varejo/supermercados (relatório anual) | Grátis | 🔜 | Concentração, crescimento do setor |
| **ABIA** | Indústria de alimentos BR (faturamento, emprego) | Grátis | 🔜 | Dados setoriais de alimentos processados |
| **ABIEC** | Pecuária bovina, exportação de carne | Grátis | 🔜 | Grãos → ração → carne: impacto em cadeia |
| **FNP / Informa Economics IEG** | Indicadores agro premium, previsões | 💰 | 💰 | Padrão para fundo/trader de commodities |

---

## 5. Comércio exterior

| Nome | O que entrega | Grátis/Pago | Status | Observação |
|------|---------------|-------------|--------|------------|
| **Comex Stat (MDIC)** | Exportação e importação por NCM, mês, país, UF | Grátis | ✅ | ⚠️ usar CSV anual (`.csv`, não `.zip`). URLs: `balanca.mdic.gov.br/balanca/bd/comexstat-bd/ncm/EXP_{ano}.csv`. Ler por streaming (113MB). EXP_2025: Milho 41 Mt · Soja 108 Mt |
| **ANTAQ** | Movimentação portuária, carga, armadores | Grátis | 🔜 | Proxy de fluxo import/export por porto |
| **Panjiva / S&P Global** | Manifesto de carga: quem compra de quem (empresa-a-empresa) | 💰 | 💰 | Inteligência competitiva de supply chain |
| **Spire Global** | Dados de AIS (navios) + contexto logístico global | 💰 | 💰 | Tracking de cargas em trânsito |

---

## 6. Demanda e consumo

| Nome | O que entrega | Grátis/Pago | Status | Observação |
|------|---------------|-------------|--------|------------|
| **Mercado Livre API** | Preço praticado, sold_quantity (demanda proxy), concorrentes no e-commerce | Grátis (token) | ✅ | OAuth token grátis: `developers.mercadolibre.com`, 10k calls/dia. Sem token: 403. Metadados de categoria: 200 sem token |
| **Receita Federal CNPJ** | Cadastro completo de empresas BR (razão social, CNAE, sócios, abertura/fechamento) | Grátis | 🔜 | `dados.rfb.gov.br`. Dado aberto anual em CSV/ZIP. Novo concorrente entrando via CNAE |
| **Índice Stone (StoneCo)** | Desempenho mensal do varejo por segmento via dados de maquininha | Grátis | 🔜 | Proxy de volume de vendas por setor sem survey |
| **Cielo ICVA** | Índice de vendas no varejo por setor e região | Grátis | 🔜 | Publicação mensal; contexto de mercado |
| **Kantar Worldpanel BR** | Painel domiciliar: penetração de marca, frequência de compra | 💰 | 💰 | Dado mais profundo de comportamento do consumidor BR |
| **Scanntech Brasil** | Dados de scanner de PDV (supermercados pequenos/médios) | 💰 | 💰 | Share de gôndola real por SKU |
| **data.ai (App Annie)** | Performance de apps mobile (downloads, DAU, receita) | 💰 | 💰 | Para concorrentes com estratégia digital |
| **Kantar IBOPE** | Audiência TV, pesquisa de mídia e consumo | 💰 | 💰 | Mídia e awareness de marca |

---

## 7. Distribuição física e presença geográfica

| Nome | O que entrega | Grátis/Pago | Status | Observação |
|------|---------------|-------------|--------|------------|
| **OpenStreetMap / Overpass API** | Unidades físicas por rede (Atacadão, Assaí, etc.), cobertura geográfica | Grátis | ✅ | GET `overpass-api.de/api/interpreter`. 5-10 req/min; usar `time.sleep(2)`. Tags: brand, shop, payment |
| **Placer.ai** | Tráfego de pedestres em varejo físico | 💰 | 💰 | Fluxo real em loja por semana |
| **Foursquare Analytics** | POI data + visit data de locais físicos | 💰 | 💰 | Contexto de frequência e horário |

---

## 8. Trabalhista / expansão via contratação

| Nome | O que entrega | Grátis/Pago | Status | Observação |
|------|---------------|-------------|--------|------------|
| **Revelio Labs** | Workforce analytics via vagas: headcount estimado por empresa | 💰 | 💰 | Sinal de expansão/retração antes do resultado financeiro |
| **Lightcast** | Mercado de trabalho: contratações, skills em demanda | 💰 | 💰 | Pressão salarial + planejamento de concorrente |

---

## 9. Regulatório / marca / patente / ESG

| Nome | O que entrega | Grátis/Pago | Status | Observação |
|------|---------------|-------------|--------|------------|
| **INPI** | Marcas e patentes registradas BR | Grátis | 🔜 | Novo lançamento = registro de marca antes do produto chegar ao mercado |
| **CDP** | Score ESG de empresas (emissões, água, florestas) | Grátis + 💰 | 🔜 | Pressão regulatória ESG de grandes compradores |

---

## 10. Inteligência competitiva paga (alto valor)

| Nome | O que entrega | Grátis/Pago | Status | Observação |
|------|---------------|-------------|--------|------------|
| **Euromonitor / Passport** | Tamanho de mercado, share por empresa, tendências globais | 💰 | 💰 | Melhor dado de market size disponível |
| **Mintel** | Relatórios de categoria (lançamentos, tendências de produto, consumidor) | 💰 | 💰 | Referência para CPG e alimentos |
| **Statista** | Estatísticas de mercado compiladas (BR + global) | 💰 | 💰 | Dado de entrada rápido; muitas categorias |
| **Edge by Ascential** | Digital shelf analytics (share de busca, preço online, compliance de conteúdo) | 💰 | 💰 | Para marcas que vendem em e-commerce |
| **Profitero** | E-commerce analytics: Amazon, Americanas, Magalu | 💰 | 💰 | Share de busca + pricing por SKU |
| **Satellogic** | Satélite de observação da Terra (foco LatAm/BR) | 💰 | 💰 | Nível de estoque em pátio, expansão de planta, colheita por imagem |

---

## Fontes bloqueadas (confirmar antes de tentar de novo)

| Fonte | Problema | Substituto |
|-------|----------|------------|
| Reclame Aqui | 403 total | Google News: Anvisa, Procon, recall |
| Trustpilot | 403 total | idem |
| `dados.conab.gov.br` (API antiga) | DNS fail | xlsx via `gov.br/conab` |
| IBGE SIDRA v3 (`servicodados.ibge.gov.br`) tabela 6588 | 500 interno | `apisidra.ibge.gov.br` tabela 6588 |
| Comex Stat portal (`comexstat.mdic.gov.br`) | 403 WAF | CSV direto `balanca.mdic.gov.br` |
| Comex Stat API (`api.comexstat.mdic.gov.br`) | DNS fail | idem |
| Comex Stat mensal (`EXP_202501.csv`) | PHP error | Apenas anual funciona |
| `dados.gov.br` API | 401 | — |

---

## Arquitetura de camadas provada (sem custo)

```
MOVIMENTO   →  Google News + RSS Setorial (SuperHiper, AgFeed)
CAUSA       →  BCB SGS + IPEA Data + CONAB + IBGE LSPA + Comex Stat
NÚMERO      →  CVM Dados Abertos (empresas abertas)
DEMANDA     →  Mercado Livre API (token grátis)
FÍSICO      →  OpenStreetMap / Overpass
```

Cada camada ativada por perfil de cliente via `codify-sector-scope.ts`.
Custo: zero. Dado: real, testado, convergente.

---

## Próximos a testar (ordem de prioridade)

1. **INPI** — marca/patente (sinal antecipado de lançamento)
2. **Receita Federal CNPJ** — novo concorrente via CNAE
3. **agrobr.dev** — se funciona, consolida 6 fontes em 1
4. **CEPEA/ESALQ** — preço físico BR de commodity (mais preciso que IPEA para trading)
5. **INMET** — clima como variável de custo agro
6. **Portal Transparência / PNCP** — movimento via compra pública
7. **GDELT** — eventos em escala para setores com muita notícia
8. **Cielo ICVA / Índice Stone** — demanda agregada por setor sem survey
9. **Mercado Livre com token** — dado de demanda real (sold_quantity)
10. Redes sociais (Instagram, TikTok) — provavelmente bloqueadas; testar antes de assumir

---

## Notas operacionais críticas

- **Auto-compact corrompeu URLs:** após compactação de contexto, CONAB, IBGE e
  Comex foram marcados "mortos". Os três funcionam — apenas mudaram de endereço.
  Regra: sempre reconfirmar do zero após compact, nunca assumir que a URL antiga
  está morta sem tentar a nova.

- **CSV > ZIP:** Comex Stat retorna PHP bootstrap error no `.zip`; o `.csv` anual
  funciona e tem 113 MB. Ler por streaming, filtrar por prefixo de NCM.

- **Encoding:** CVM e Comex = latin-1. IBGE e BCB = UTF-8.

- **Convergência CONAB × IBGE LSPA:** diferença < 1% para milho e arroz.
  Usar CONAB para balanço oferta-demanda; IBGE para série temporal mensal.

- **Mercado Livre sem token:** bloqueia tudo exceto metadados de categoria.
  Token grátis: registro em `developers.mercadolibre.com`, 5 min, 10k calls/dia.
