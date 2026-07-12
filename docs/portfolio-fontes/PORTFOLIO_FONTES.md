# Portfólio de Fontes de Dados — Motor OS¹

**Última atualização:** 12/jul/2026 — 15 fontes confirmadas testadas  
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

Fontes de evento capturam o movimento; fontes de macro/commodities explicam a
causa; a análise (cards) traduz em significado. Dados internos do cliente não são
necessários para as camadas 1 e 2 — o produto é de análise de mercado **externa**.

---

## Status dos testes

| Símbolo | Significado |
|---------|-------------|
| ✅ | Testado, dado real confirmado, URL correta anotada |
| 🔜 | A testar — identificada, não confirmada |
| ❌ | Bloqueada ou descartada |
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
| **Owler** | Notícias, receita estimada, headcount estimado | — | ❌ | WAF Akamai (403 total), API só Enterprise paga, crowdsourcing não verificado, cobertura BR fraca. Substituído por Receita CNPJ |
| **Reclame Aqui** | Reclamações de consumidor por empresa | — | ❌ | 403 total — sem acesso programático |
| **Trustpilot** | Reviews internacionais | — | ❌ | 403 total |

---

## 2. Dado financeiro / resultado de empresas

| Nome | O que entrega | Grátis/Pago | Status | Observação |
|------|---------------|-------------|--------|------------|
| **CVM Dados Abertos** | DFP, ITR, FRE de empresas **abertas** (BR) | Grátis | ✅ | CSV semicolon latin-1. CD_CVM zero-padded 6 dígitos. Camil=024228, Josapar=013285 |
| **Receita Federal CNPJ** | Perfil oficial de **qualquer** empresa BR — capital social, porte, CNAE, filiais, sócios, data de abertura | Grátis | ✅ | Via BrasilAPI: `brasilapi.com.br/api/cnpj/v1/{CNPJ}`. Sem token, ~70ms. Cobre empresas **fechadas** (a CVM não cobre). Usos: dimensionar concorrente, detectar filial nova (CNPJ novo) ou mudança societária (holding entrando = possível M&A). Não entrega faturamento de empresa fechada (não existe legalmente) |
| **Bureau van Dijk Orbis** | Financeiro de empresas privadas globais | 💰 | 💰 | Referência máxima para privadas |
| **Boa Vista / SCPC** | Score, inadimplência, crédito empresarial BR | 💰 | 💰 | Risco de crédito de fornecedor/cliente |
| **Quod** | Bureau de crédito BR | 💰 | 💰 | Alternativa ao Boa Vista |

---

## 3. Macro e contexto de custo

| Nome | O que entrega | Grátis/Pago | Status | Observação |
|------|---------------|-------------|--------|------------|
| **BCB SGS** | Selic, IPCA geral, IPCA Alimentação, câmbio, IPA, ICC, IPCA Cereais | Grátis | ✅ | `api.bcb.gov.br/dados/serie/bcdata.sgs.{id}/dados` sem auth. IDs: 432 Selic · 433 IPCA · 7478 IPCA Alim · 3698 USD/BRL · 28479 ICC · 7468 IPA Agro · 25433 IPCA Cereais |
| **IPEA Data API** | Preços de commodity, câmbio, indicadores econômicos | Grátis | ✅ | OData v4. `$top=12&$orderby=VALDATA desc`. Filtro: `substringof()` não `contains()`. Séries testadas: arroz atacado, milho SP, milho internacional |

---

## 4. Dado setorial / commodities / agronegócio

> **agrobr.dev** agrega 40+ fontes desta seção numa biblioteca Python. Ver nota abaixo da tabela.

| Nome | O que entrega | Grátis/Pago | Status | Via agrobr? |
|------|---------------|-------------|--------|------------|
| **agrobr.dev** | Biblioteca Python que agrega 40+ fontes agro BR: CEPEA, CONAB, IBGE PAM/PPM/LSPA/Censo, IMEA, INMET, ANTAQ, Comex Stat, MapBiomas, EMBRAPA, CAR/SICAR, B3 futuros e outras | Grátis | ✅ | É a lib |
| **CEPEA / ESALQ (USP)** | Preços físicos BR: soja, milho, arroz, café, boi, frango, etanol, algodão | Grátis | ✅ | `await agrobr.cepea.indicador('milho')` |
| **B3 Futuros** | Ajustes diários de contratos futuros: milho, soja, café, boi, etanol | Grátis | ✅ | `await agrobr.b3.ajustes(data=..., contrato='milho')` — **DESCOBERTA NOVA** |
| **IBGE LSPA** | Produção agrícola mensal por cultura | Grátis | ✅ | `await agrobr.ibge.lspa('milho_1')` |
| **CONAB** | Balanço oferta-demanda safra | Grátis | ✅ | `await agrobr.conab.balanco(...)` ⚠️ requer Playwright |
| **IMEA** | Cotações soja/milho/algodão por cidade do MT | Grátis | ✅ | `await agrobr.imea.cotacoes()` ⚠️ **proíbe redistribuição comercial** — não pode virar card |
| **INMET** | Clima por UF e estação | Grátis (token) | ✅ | `await agrobr.inmet.clima_uf('GO', ano=2025)` — requer `AGROBR_INMET_TOKEN` (gratuito, registro) |
| **MapBiomas** | Uso da terra, desmatamento, área cultivada | Grátis | ✅ | `agrobr.mapbiomas` |
| **EMBRAPA** | Dados agropecuários técnicos | Grátis | ✅ | `agrobr.embrapa_solos` |
| **CAR / SICAR** | Cadastro ambiental rural | Grátis | ✅ | `agrobr.acervo_fundiario` |
| **ESALQ-LOG / SIFRECA** | Fretes agro por corredor (MT → Paranaguá/Santos) | Grátis | 🔜 | Não confirmado no agrobr |
| **ANP** | Preços de combustíveis, etanol | Grátis | 🔜 | — |
| **MAPA / Agrofit** | Defensivos agrícolas registrados | Grátis | 🔜 | — |
| **ABRAS / ABIA / ABIEC** | Dados setoriais varejo/alimentos/carne | Grátis | 🔜 | — |
| **FNP / Informa Economics IEG** | Indicadores agro premium | 💰 | 💰 | — |

**Nota agrobr.dev:** `pip install agrobr` (Python ≥ 3.11, MIT). Cache DuckDB local,
fallback automático entre fontes, rate limiting embutido. O Railway já roda Python
— só adicionar ao `requirements.txt`. Fontes que **não estão** no agrobr e precisam
de acesso direto: Google News, CVM, BCB SGS, IPEA, Mercado Livre, OpenStreetMap.

---

## 5. Comércio exterior

| Nome | O que entrega | Grátis/Pago | Status | Observação |
|------|---------------|-------------|--------|------------|
| **Comex Stat (MDIC)** | Export/import por NCM, mês, país, UF | Grátis | ✅ | ⚠️ `.csv` não `.zip`. `balanca.mdic.gov.br/balanca/bd/comexstat-bd/ncm/EXP_{ano}.csv`. Streaming (113MB). Também via `await agrobr.comexstat.exportacao('milho', ano=2025)` — mais limpo |
| **ANTAQ** | Movimentação portuária, carga, armadores | Grátis | ✅ | Via `agrobr.antaq` |
| **Panjiva / S&P Global** | Manifesto de carga: quem compra de quem | 💰 | 💰 | Supply chain empresa-a-empresa |
| **Spire Global** | AIS de navios, tracking de cargas | 💰 | 💰 | — |

---

## 6. Demanda e consumo

| Nome | O que entrega | Grátis/Pago | Status | Observação |
|------|---------------|-------------|--------|------------|
| **Índice Stone do Varejo** | Faturamento real do varejo por setor/região via maquininha de cartão | Grátis | ✅ | CSV mensal sem login. URL: `conteudo.stone.com.br/wp-content/uploads/{ano}/{mm}/dataset_de_divulgacao_{mes}_{ano}.csv`. Cobre hipermercados/supermercados/alimentos. YoY jun/26: **+7,4%** (maior alta do ano). **Único sinal do lado da demanda** — o que o consumidor efetivamente comprou. 5 regiões BR; 27 UFs (só "geral restrito" por UF, não por setor) |
| **Mercado Livre API** | Preço praticado, sold_quantity (proxy de demanda), concorrentes no e-commerce | Grátis (token) | ✅ | OAuth token grátis: `developers.mercadolibre.com`, 10k calls/dia. Sem token: 403 |
| **Cielo ICVA** | Índice de vendas no varejo — 18 setores, frequência mensal | Grátis | 🔜 | PDF mensal (`cielo.com.br/docs/inteligencia-de-dados/2026/{AAAAMM}_ICVA.pdf`). Maio/26 disponível. Não é CSV — leitura manual |
| **Kantar Worldpanel BR** | Painel domiciliar: penetração de marca, frequência de compra | 💰 | 💰 | — |
| **Scanntech Brasil** | Scanner PDV supermercados pequenos/médios | 💰 | 💰 | Share de gôndola real por SKU |
| **data.ai (App Annie)** | Performance de apps mobile | 💰 | 💰 | — |
| **Kantar IBOPE** | Audiência TV, pesquisa de mídia | 💰 | 💰 | — |

---

## 7. Distribuição física e presença geográfica

| Nome | O que entrega | Grátis/Pago | Status | Observação |
|------|---------------|-------------|--------|------------|
| **OpenStreetMap / Overpass API** | Unidades físicas por rede (Atacadão, Assaí, etc.) | Grátis | ✅ | GET `overpass-api.de/api/interpreter`. 5-10 req/min; `time.sleep(2)`. Tags: brand, shop, payment |
| **Placer.ai** | Tráfego de pedestres em varejo físico | 💰 | 💰 | — |
| **Foursquare Analytics** | POI data + visit data | 💰 | 💰 | — |

---

## 8. Trabalhista / expansão via contratação

| Nome | O que entrega | Grátis/Pago | Status | Observação |
|------|---------------|-------------|--------|------------|
| **Revelio Labs** | Headcount estimado de concorrente via vagas | 💰 | 💰 | Sinal de expansão antes do resultado financeiro |
| **Lightcast** | Mercado de trabalho, skills em demanda | 💰 | 💰 | — |

---

## 9. Regulatório / marca / patente / ESG

| Nome | O que entrega | Grátis/Pago | Status | Observação |
|------|---------------|-------------|--------|------------|
| **INPI** | Marcas e patentes registradas BR | Grátis | 🔜 | Sinal antecipado de lançamento |
| **CDP** | Score ESG de empresas | Grátis + 💰 | 🔜 | — |

---

## 10. Inteligência competitiva paga (alto valor)

| Nome | O que entrega | Grátis/Pago | Status | Observação |
|------|---------------|-------------|--------|------------|
| **Euromonitor / Passport** | Tamanho de mercado, share por empresa | 💰 | 💰 | Melhor dado de market size |
| **Mintel** | Relatórios de categoria (lançamentos, tendências) | 💰 | 💰 | Referência CPG e alimentos |
| **Statista** | Estatísticas de mercado compiladas | 💰 | 💰 | — |
| **Edge by Ascential** | Digital shelf analytics (share de busca online) | 💰 | 💰 | — |
| **Profitero** | E-commerce: Amazon, Americanas, Magalu | 💰 | 💰 | — |
| **Satellogic** | Satélite LatAm/BR: área de colheita, nível de pátio | 💰 | 💰 | — |

---

## Fontes bloqueadas / descartadas

| Fonte | Problema | Substituto |
|-------|----------|------------|
| Owler | WAF Akamai 403 total; API Enterprise paga; crowdsourcing não verificado; cobertura BR fraca | Receita CNPJ via BrasilAPI (oficial, grátis) |
| Reclame Aqui | 403 total | Google News: Anvisa, Procon, recall |
| Trustpilot | 403 total | idem |
| `dados.conab.gov.br` (API antiga) | DNS fail | xlsx via `gov.br/conab` ou `agrobr.conab` |
| IBGE SIDRA v3 (`servicodados.ibge.gov.br`) tabela 6588 | 500 interno | `apisidra.ibge.gov.br` tabela 6588 ou `agrobr.ibge.lspa` |
| Comex Stat portal (`comexstat.mdic.gov.br`) | 403 WAF | CSV direto `balanca.mdic.gov.br` ou `agrobr.comexstat` |
| Comex Stat API (`api.comexstat.mdic.gov.br`) | DNS fail | idem |
| Comex Stat mensal (`EXP_202501.csv`) | PHP error | Apenas anual funciona |
| `dados.gov.br` API | 401 | — |
| IMEA (redistribuição) | Termos de uso proíbem redistribuição comercial | BCB SGS + IPEA para preços de commodity |

---

## Arquitetura de camadas provada (sem custo)

```
MOVIMENTO        →  Google News + RSS Setorial (SuperHiper, AgFeed)
CAUSA / OFERTA   →  BCB SGS + IPEA + CONAB + IBGE LSPA + Comex Stat
CAUSA / PREÇO    →  CEPEA (via agrobr) + B3 Futuros (via agrobr)
NÚMERO (abertas) →  CVM Dados Abertos
NÚMERO (fechadas)→  Receita CNPJ via BrasilAPI
DEMANDA          →  Índice Stone + Mercado Livre API
FÍSICO           →  OpenStreetMap / Overpass
CLIMA / AGRO     →  INMET via agrobr (token gratuito)
```

Custo: zero. Dado: real, testado, convergente. Cada camada ativada por perfil de
cliente via `codify-sector-scope.ts`.

---

## Próximos a testar

1. **INPI** — marca/patente (sinal antecipado de lançamento)
2. **ESALQ-LOG / SIFRECA** — frete agro por corredor (custo logístico)
3. **Portal Transparência / PNCP** — movimento via compra pública
4. **GDELT** — eventos em escala para setores com muita notícia
5. **Cielo ICVA** — estruturar leitura do PDF mensal
6. **INMET via agrobr** — obter `AGROBR_INMET_TOKEN` (gratuito) e testar
7. Redes sociais (Instagram, TikTok) — provavelmente bloqueadas; testar antes de assumir

---

## Notas operacionais críticas

- **agrobr.dev:** Python 3.11+. `pip install agrobr`. Cache DuckDB persiste entre
  execuções — segunda chamada é instantânea. CONAB via agrobr requer Playwright
  (`pip install playwright && playwright install chromium`). IMEA: NÃO redistribuir
  dados comercialmente.

- **Índice Stone — URL do CSV:** muda todo mês. Padrão:
  `conteudo.stone.com.br/wp-content/uploads/{AAAA}/{MM}/dataset_de_divulgacao_{mes}_{ano}.csv`
  Publicado até dia 10 do mês seguinte.

- **Receita CNPJ — filiais:** cada filial tem CNPJ próprio (mesmo prefixo de 8
  dígitos, número de estabelecimento diferente). Para encontrar filiais de um
  concorrente, é preciso buscar no arquivo completo da Receita (5GB) ou serviços
  como Casa dos Dados / EconoData.

- **Auto-compact corrompeu URLs:** CONAB, IBGE e Comex foram marcados "mortos"
  após compactação. Os três funcionam — só mudaram de endereço. Regra: sempre
  reconfirmar do zero após compact.

- **CSV > ZIP:** Comex Stat retorna PHP error no `.zip`; `.csv` anual funciona
  (113MB). Ler por streaming, filtrar por prefixo NCM — ou usar `agrobr.comexstat`.

- **Encoding:** CVM e Comex = latin-1. IBGE, BCB, BrasilAPI = UTF-8.

- **Convergência CONAB × IBGE LSPA:** diferença < 1% para milho e arroz.
