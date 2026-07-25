# Mapeamento Técnico — Piloto Analítico OS¹

Mapeamento somente leitura. Nenhum código alterado, nenhuma dependência instalada, nenhum commit/push/deploy. Escopo: perfil automático → mineradoras/scrapers → sinais → cards analíticos via LLM → feed → botões LLM → workspace.

---

## 1. Resumo executivo

O backend tem **duas gerações de infraestrutura paralelas e desconectadas** para quase toda etapa do fluxo (legado `external_*`/`feed_cards`/`negocio_id` vs. novo `intelligence_*`/`organizations`/`organization_id`). A fundação multi-tenant (organizations → business_units → memberships) está sólida e testada, mas o "perfil de empresa" em si (CNPJ, CNAE, faturamento, equipe, concorrentes) **não é persistido em nenhuma tabela real** — existe só como capacidade de scraping isolada. As mineradoras de dado público (CNPJ, clima) são reais e funcionais; as de scraping direto (Google Maps, Instagram, Reclame Aqui) são reais mas com risco de ToS já sinalizado em auditoria anterior. Existe um modelo de "sinal bruto" (`intelligence_evidence`) já pronto, mas o endpoint de ingestão externa trava o campo de origem em `"manual"`, o que impede que esse sinal dispare o pipeline automático de detecção. A geração de card via LLM funciona (Anthropic real, `agents/agent_7/8/9`), mas tem um bug confirmado (Agent 9 devolve `"actions"`, o pipeline lê `"acoes"` — ações sempre vazias) e nenhuma tabela guarda se um card veio de LLM real ou fallback. O maior bloqueio de produto, não técnico, é a exigência de distribuição manual de card via Governança antes de um usuário não-matriz enxergar qualquer card real — já identificado em auditoria de segurança anterior. Os botões do workspace (`pesquisar/executar/aprender/simular/estender`) já chamam LLM real quando o card não é sintético; falta só ligar a entrada (card gerado por sinal real) e a saída (persistência de proveniência). O mapa competitivo tem toda a infraestrutura de backend pronta (endpoint `/map/competitors`, Haversine, `business_units.lat/lng`), mas falta uma única peça: geocoding — o scraper de Google Maps não extrai lat/lng.

---

## 2. Escopo do produto de agora

Fluxo mínimo vendável, conforme delimitado pelo pedido: (1) perfil de empresa preenchido automaticamente; (2) mineradoras alimentando o feed; (3) cards gerados a partir de sinal real; (4) botões principais com LLM; (5) primeiro módulo — analítico; (6) workspace recebendo o resultado. Fora de escopo aqui (mapeados em auditorias anteriores, não repetidos): 10 módulos completos, motor de setas, ontologia avançada, marketplace, tecnologia de terceiros, automação sem supervisão.

---

## 3. O que já está pronto

- Autenticação JWT real, com proteção de produção já corrigida (auditoria de segurança anterior).
- Schema multi-tenant `organizations`/`business_units`/`memberships`, testado (`server/test_organizations.py`), com hierarquia matriz/franquia via `parent_organization_id` e localização (`city/address/lat/lng`) em `business_units`.
- Scraper de CNPJ real (`scrapers/cnpj.py`), via ReceitaWS/BrasilAPI, sem Playwright — só `httpx`. Retorna razão social, fantasia, situação cadastral, CNAE (`atividade_principal`), porte, endereço estruturado.
- Scrapers reais de Google Maps, Google Search, Reclame Aqui, Instagram, clima — todos com output real capturado em `scrapers/output/*.json`.
- Modelo de "sinal bruto" já existente e testado (`intelligence_evidence`, `server/migrations/0002_intelligence.sql`), com `confidence` limitado a 0.92 (hedge estrutural) e `entity_type` controlado (`competitor|supplier|client|market|location|trend`).
- Cadeia signal→gap→card já implementada e encadeável (`server/signals.py`, `server/scoring.py`, `server/cards.py`), com LLM real (Anthropic) nos agentes 7/8/9.
- Endpoint de ingestão de card pronto (`POST /api/codify/v0/cards`), validado por Pydantic, autenticado por API key, testado.
- Endpoint de mapa com raio e Haversine já implementado no backend (`GET /map/competitors`, `server/roles_extras.py:534-590`), incluindo modelo `CompetitorPoint` com `lat/lng`.
- Botões de workspace (`pesquisar/executar/aprender/simular/estender`) já ligados a LLM real via `agents/base_agent.py`, com `usedFallback` retornado pelo `action-executor.ts` do frontend.
- Governança real (aprovar/rejeitar/distribuir), testada.

---

## 4. O que falta para preenchimento automático de perfil

**Schema atual**: `organizations` tem só 5 campos (`id, name, type, parent_organization_id, created_at`); `business_units` tem 9 (`id, organization_id, name, segment, city, address, lat, lng, created_at`). Nenhum dos dois tem CNPJ, razão social, CNAE estruturado, faturamento, equipe, concorrentes ou contexto interno livre.

**Criação hoje é sempre manual**: `POST /api/organizations` (usuário autenticado) ou `POST /api/codify/v0/organizations` (admin, `x-codify-api-key`). Não existe nenhum fluxo de auto-cadastro nem endpoint que receba um CNPJ e crie a organização a partir dele — confirmado por ausência total (`grep` não encontrou nenhum `INSERT INTO organizations` disparado a partir de `CNPJScraper.buscar()`).

**O scraper de CNPJ já resolve boa parte do preenchimento**: `scrapers/cnpj.py:19` (`CNPJScraper.buscar(cnpj)`) devolve razão social, fantasia, situação cadastral, CNAE/atividade principal, natureza jurídica, porte, telefone, e-mail, endereço estruturado (logradouro/número/bairro/município/UF/CEP), capital social — mas nada disso persiste hoje; é só retorno de função.

**Setor/departamento não existe como conceito de banco** — o único campo relacionado é `business_units.segment` (texto livre, sem CHECK, sem FK para os JSONs de `ontology/industries/`).

**Concorrentes, faturamento, equipe e contexto interno**: não existem em nenhuma tabela do sistema atual (organizations/business_units). Concorrentes existem só num produto legado desconectado (`database/schema.sql`, tabela `concorrentes`, Postgres separado) e como campo efêmero de um fluxo antigo (`ExternalCollectPayload.concorrentes`, não persistido).

**O que falta, concretamente**: (a) colunas novas em `organizations`/`business_units`, ou uma tabela `organization_profile` separada, para CNPJ, CNAE, porte, faturamento declarado, equipe, contexto livre; (b) um endpoint que chame `CNPJScraper.buscar()` e grave o resultado nesses campos — esse elo simplesmente não existe hoje.

**Para o primeiro cliente**: CNPJ + nome + localização podem ser preenchidos automaticamente hoje mesmo (scraper já funciona, só falta a gravação). Faturamento, equipe e contexto interno leve — mais seguro manter manual no primeiro piloto (formulário curto preenchido pelo cliente/CS), já que não há schema nem fonte de dado automatizável madura para isso.

**Menor schema real de perfil para a primeira venda** (derivado do que já existe, não inventado): estender `organizations`/`business_units` com `cnpj, razao_social, cnae, situacao_cadastral, porte` (vindos do scraper) + `faturamento_declarado, equipe_declarada, contexto_livre` (preenchidos manualmente/onboarding) — sem tabela nova, só colunas adicionais.

---

## 5. O que falta para mineradoras alimentarem o feed

| Fonte | Arquivo/função | Entrada | Saída | API key? | Funciona hoje? | Teste? | Estruturado? | Uso | Classificação |
|---|---|---|---|---|---|---|---|---|---|
| CNPJ | `scrapers/cnpj.py:19` `buscar(cnpj)` | CNPJ (string) | dict: razão social, CNAE, endereço, porte etc. | Não (API pública) | Sim | Não confirmado teste dedicado | Sim | Perfil | **Usável agora** |
| Google Maps | `scrapers/google_maps.py` | termo de busca/local | nome, categoria, endereço, telefone, nota, reviews, horário, fotos (sem lat/lng) | Não (scraping via Playwright) | Sim, output real capturado | Não confirmado | Sim | Feed, mapa (parcial — falta geocoding) | **Usável com ajuste pequeno** (mapa) / **usável agora** (feed) |
| Google Search | `scrapers/google_search.py` | termo de busca | resultados de busca (título/snippet/link) | Não | Sim, com fallback DuckDuckGo | Não confirmado | Parcial | Feed (sinal genérico) | **Usável com ajuste pequeno** |
| Reclame Aqui | `scrapers/reclame_aqui.py` | nome da empresa | reputação/reclamações | Não | Sim (Playwright) | Não confirmado | Sim | Feed | **Usável agora, risco de ToS já sinalizado** |
| Instagram | `scrapers/instagram.py` | handle | perfil público (seguidores, posts) | Não | Sim, com fallback Playwright | Não confirmado | Parcial | Feed | **Usável agora, risco de ToS já sinalizado** |
| Clima | `scrapers/clima.py` | cidade/coordenada | previsão 7 dias | Não (OpenMeteo, API aberta) | Sim | Não confirmado | Sim | Feed (sazonalidade) | **Usável agora** |
| CMED | `src/core/adapters/cmed-connector.ts` (frontend) | — | fixture estático | — | Não (fixture, não ANVISA real) | — | Sim | Perfil de farmácia (fixture) | **Não usar agora** (não é mineradora real) |

**Modelo de sinal intermediário**: existe e está pronto — `intelligence_evidence` (`server/migrations/0002_intelligence.sql:24-42`), campos `organization_id, business_unit_id, source_id, source_type, entity_type, entity_name, entity_ref, raw_data, normalized_data, domain_id, confidence (≤0.92), collected_at`. Alimenta `intelligence_signals` (com FK real `evidence_id`) e depois `intelligence_gaps`.

**A lacuna real**: `POST /api/codify/v0/evidences` (`server/codify_api.py:579-617`) aceita evidência de fora, mas grava `source_type` fixo em `"manual"` — e o motor de detecção (`server/signals.py:89-93`, lista `WATCHERS`) só processa `source_type`s de uma lista fechada (`google_maps`, `google_search`, etc.). Uma evidência inserida via API fica presa, sem disparar o pipeline signal→gap→card automaticamente.

**Cadeia de chamadas hoje** (sistema novo): `POST /api/signals/detect` → `_run_watcher` → `intelligence_signals` → (scoring/gap, `server/scoring.py`) → `intelligence_gaps` → geração de card (`server/cards.py`) → `intelligence_cards`. São chamadas HTTP separadas, sem uma função única "fim a fim".

**Menor caminho técnico** (sem inventar feature nova): (a) parametrizar `source_type` no payload de `POST /api/codify/v0/evidences` em vez de hardcoded; (b) generalizar `_run_watcher`/`WATCHERS` para aceitar qualquer `source_type` presente na tabela, não só a lista fechada; (c) permitir `raw_data` como JSON livre (já é `TEXT NOT NULL`, só falta aceitar payload maior que `capturedText`/`summary`).

**Classificação geral**: CNPJ e clima — usáveis agora, sem ajuste. Google Maps/Search — usáveis com ajuste pequeno (geocoding para mapa; wiring de `source_type` para feed). Instagram/Reclame Aqui — usáveis agora tecnicamente, mas com risco de ToS já documentado, decisão de produto necessária antes de usar com cliente real. CMED (frontend) — não usar agora, é fixture, não mineradora.

---

## 6. O que falta para LLM gerar cards analíticos

**Onde a Anthropic é chamada no caminho de card**: `agents/base_agent.py:57-98` (`_call_llm`), usado por `agent_7_writer.py`, `agent_8_reviewer.py`, `agent_9_actions.py` (caminho `POST /api/cards/generate` → `server/cards.py:_run_card_pipeline`) e por `external/feed_generator.py:231-239` (`_generate_versoes`, caminho `POST /api/feed/gerar` e `server/workspace.py`).

**Dois schemas de card coexistem, sem tradução automática entre eles**:
- `feed_cards` (legado, `external/feed_db.py`) — schema PT-BR (`dominio/area/dificuldade/tipo_card`), gerado por `FeedGenerator.generate_from_gap`. É o schema que mais se parece com o `IntelligenceCard` do frontend.
- `intelligence_cards` (novo, `server/migrations/0005_cards.sql`) — schema misto EN/PT (`title/summary/detail/card_type/urgency/domain_id`), gerado pelos agentes 7/8/9 ou inserido direto via `POST /api/codify/v0/cards`. É o schema lido por `feed_codify.py`/`codify_api.py` — a via "oficial" para o frontend real.

**Bug confirmado**: `server/cards.py:145` lê `actions_result.output.get("acoes", [])`, mas `agent_9_actions.py:89` devolve a chave `"actions"` — nunca `"acoes"`. As ações do Agent 9 são descartadas silenciosamente; o pipeline sempre cai no fallback determinístico `_GAP_ACTIONS`.

**Validação de JSON**: só na saída (Pydantic, `CreateCardPayload`/`CardOut`) e na entrada de `POST /api/codify/v0/cards`. A saída do LLM (agentes 7/8/9) **não** passa por schema/jsonschema antes do INSERT — só `_extract_json` (best-effort, devolve `{}` em falha).

**Flag de LLM real vs. fallback**: não existe em nenhuma tabela. `AgentResult.used_llm` existe como campo mas nunca é setado `True`; `_run_card_pipeline` descarta esse campo, só lê `.output`.

**Reaproveitamento de endpoints atuais**: sim, dá para reaproveitar `POST /api/codify/v0/cards` para o piloto, com ajustes pontuais — não precisa endpoint novo:
1. `domain`/`area` são gravados de forma cruzada (`body.area` vira `domain_id`; `body.domain` fica só em `metadata`) — funciona, mas é frágil para quem inserir fora do endpoint.
2. `confidence_level`/`confidence_score` são hardcoded (`"baixa"`, `0.5`) na inserção via API — o payload não tem campo de confiança, ao contrário de `CreateEvidencePayload`. Se o piloto precisa de confiança real, adicionar esse campo ao payload.
3. `actions` sempre `"[]"` nessa via — a rota não gera nem aceita ações.
4. Sem flag de proveniência LLM — precisa ser adicionado se o piloto quer diferenciar "gerado por IA" de "inserido manualmente".
5. Sem campo de "módulo analítico" em nenhuma tabela do backend (`intelligence_cards` não tem `module`/`analysis_type`) — para garantir que um card seja classificado como módulo **analítico**, hoje não há nenhum mecanismo; seria necessário adicionar uma coluna e um valor fixo `"analitico"` para tudo que vier deste pipeline no piloto (não precisa resolver os outros 9 módulos agora).

**Falta só prompt? Não** — o prompt e a chamada já existem e funcionam (confirmado pelas auditorias anteriores: Anthropic real, com fallback). O que falta é: corrigir o bug `"acoes"`/`"actions"`, adicionar campo de confiança real ao payload de ingestão externa, adicionar flag de proveniência, e adicionar (ou fixar) um campo de módulo.

---

## 7. O que falta para botões funcionarem com LLM

Botões do módulo analítico (`pesquisar/executar/aprender/simular/estender`), via `src/features/workspace/execute/action-executor.ts:31-59`:

- Regra de fallback já implementada e explícita no código: `const useFallback = !sub.endpoint || !!card._synthetic;` — ou seja, **card real + endpoint mapeado = chamada LLM real**; card sintético ou sem endpoint = template local, com `await new Promise(r => setTimeout(r, 300))` simulando latência.
- `executeAction` já devolve `usedFallback: boolean` no resultado — **essa é uma flag real e já existente no frontend**, diferente da lacuna de proveniência dentro do backend (Seção 6). Ela sabe se a chamada foi feita ou pulada, mas não sabe se, tendo sido feita, o LLM respondeu de verdade ou caiu no fallback silencioso interno do backend (`server/workspace.py`, já documentado na auditoria de segurança).
- Payload: `{ card_id: card.id, ...(sub.extra || {}) }`, `POST /api/workspace/${sub.endpoint}`.
- Funciona igual para card local (sintético) e card vindo da API — a única diferença é a flag `_synthetic`, que decide se vai para o backend ou fica no fallback local.

**O que falta para ficarem confiáveis**: (a) card real gerado pelo pipeline de sinal→gap→card (Seção 5/6) precisa chegar ao frontend sem `_synthetic: true` para que os botões de fato cheguem ao backend; (b) propagar a flag `usedFallback` do frontend + a proveniência real do backend (quando existir, Seção 6) até a UI, hoje nenhuma das duas chega ao usuário visualmente; (c) resolver o bug de ações do Agent 9 antes de expor "Executar" como confiável.

Classificação por botão (módulo analítico, card real não-sintético):
| Botão | Endpoint | LLM real? | Fallback possível? | Grava bloco? | Status |
|---|---|---|---|---|---|
| Pesquisar/Entender | `/api/workspace/pesquisar` | Sim | Sim, silencioso (`.setdefault`) | Sim (upsert por card+endpoint) | Pronto com ajuste pequeno (flag de proveniência) |
| Executar | `/api/workspace/executar` | Sim | Sim, silencioso | Sim | Pronto com ajuste pequeno |
| Aprender | `/api/workspace/aprender` | Sim | Sim, silencioso | Sim | Pronto com ajuste pequeno |
| Simular | `/api/workspace/simular` | Sim | Sim (`cenarios: []`) | Sim | Pronto com ajuste pequeno |
| Estender | `/api/workspace/estender` | Sim | Parcial (`cards_relacionados: []`) | Sim | Pronto com ajuste pequeno |
| Compartilhar | não mapeado como sub-ação LLM nos arquivos auditados | — | — | — | Não confirmado — checar se existe endpoint dedicado |

---

## 8. O que falta para workspace persistir os resultados

`server/workspace_blocks_db.py` — tabela `workspace_blocks` (`org_id, bu_id, user_id, card_id, card_title, source, block_kind, endpoint, sub_key, block_json, created_at, updated_at`), upsert por `(org_id, bu_id, card_id, endpoint, sub_key)` — só o último resultado por combinação sobrevive, sem histórico. Cards sintéticos (prefixo `synth-`) são explicitamente rejeitados da persistência (`workspace_blocks_db.py:15,191`).

**O workspace já suporta o piloto?** Sim, para o caso de uso mínimo (card real → botão → resultado → persiste o último resultado, sobrevive a reload). Não suporta histórico de múltiplas execuções da mesma ação sobre o mesmo card — mas isso não é bloqueador para um piloto analítico simples.

**O que falta para ser confiável para o módulo analítico**: nada de estrutural — a persistência já funciona igual para card local e card vindo da API (mesma tabela, mesma chave). O que falta é upstream: garantir que o card chegue como não-sintético (Seção 7) para que o resultado de fato persista (hoje cards sintéticos nunca gravam bloco).

---

## 9. O que falta para mapa usar concorrentes minerados

**Estado atual**: `Competitor` (frontend, `src/types.ts`) não tem `lat`/`lng`. O mapa usa 3 tabelas hardcoded de coordenadas (`COORDS`/`OSCAR_COORDS`/`NUBANK_COORDS`) pareadas por **posição de array**, não por identidade do concorrente.

**O scraper de Google Maps não retorna coordenadas** — só nome, categoria, endereço textual, telefone, nota, reviews, horário, fotos (confirmado no output real `scrapers/output/google_maps.json`). Sem geocoding, esse dado não tem como virar ponto no mapa.

**Já existe infraestrutura de backend pronta e não usada pelo frontend**: `GET /map/competitors` (`server/roles_extras.py:534-590`), com modelo `CompetitorPoint` (`lat, lng, distance_km`), lendo `intelligence_evidence.raw_data` e calculando Haversine contra `business_units.lat/lng`. Funciona hoje só com dado de teste inserido manualmente com lat/lng — nunca com dado real do scraper (que não produz esse campo). O frontend atual **não chama esse endpoint** (confirmado por busca em `App.tsx`).

**Cálculo de distância**: Haversine (`map-ui-utils.ts:120-127` no frontend, `roles_extras.py:_haversine_km` no backend) é matemática pura sobre lat/lng — funciona identicamente com dado real, sem qualquer alteração necessária.

**O que falta, em ordem de esforço**:
1. **Geocoding** (o único bloqueador real): extrair lat/lng da página de detalhe do Google Maps durante o scraping (a URL do mapa contém `@lat,lng,zoom`), ou rodar geocoding textual pós-scraping sobre o campo de endereço.
2. **Ponte de formato**: `CompetitorPoint` (backend) e `Competitor` (frontend) têm campos diferentes — juntar os dois (lat/lng real + nota/faixa de preço/diferencial) num único endpoint ou adaptador.
3. **Frontend**: adicionar `lat?/lng?` ao tipo `Competitor`, substituir o pareamento por índice por leitura direta do campo, e trocar `MOCK_DATA.concorrentes` por um fetch real.

**Classificação**: precisa de geocoding + reestruturação pontual — não é "pronto" (dado é 100% fixture hoje) nem "reestruturação grande" (a peça estrutural de backend — endpoint, modelo, Haversine, coluna lat/lng em business_units — já existe e está testada).

**O que pode funcionar no primeiro cliente**: se o geocoding for resolvido (mesmo que via geocoding textual simples, não perfeito), o restante da cadeia (Haversine, raio, endpoint) já está pronto para uso real.

---

## 10. Decisões de produto necessárias

- **Distribuição de card**: cards ingeridos automaticamente devem aparecer direto para o cliente dono da organização, ou passar sempre por aprovação humana (Governança) antes? Determina se o piloto usa aprovação humana ou automação direta (Seção 5 da auditoria de segurança já documentou esse gap).
- **Fontes com risco de ToS** (Instagram, Reclame Aqui, scraping direto de Google Maps/Search): usar já no primeiro piloto ou aguardar avaliação jurídica? Tecnicamente funcionam; a decisão é de risco, não de código.
- **Schema de perfil**: estender `organizations`/`business_units` com colunas novas, ou criar tabela `organization_profile` separada? Afeta quantas migrations serão necessárias.
- **Qual pipeline de card é a fonte de verdade**: `intelligence_cards` (novo, já lido por `feed_codify.py`) ou seguir mantendo `feed_cards` (legado) vivo em paralelo? Recomendação técnica: convergir para `intelligence_cards`, já que é o que o frontend real consome.
- **Geocoding**: usar API paga (Google Geocoding) ou solução gratuita (Nominatim/OSM) para resolver coordenadas a partir do endereço minerado?
- **Confiança do card**: o piloto precisa exibir/filtrar por confiança real, ou o valor fixo atual (`0.5`/`"baixa"` na ingestão via API) é aceitável por ora?

## 11. Ajustes pequenos

- Corrigir o bug `"acoes"` vs. `"actions"` em `server/cards.py:145`.
- Adicionar campo de confiança real ao payload de `POST /api/codify/v0/cards` (hoje hardcoded).
- Parametrizar `source_type` em `CreateEvidencePayload`/`create_evidence` (hoje fixo em `"manual"`).
- Adicionar `source_type` real (ex.: nome da mineradora) à lista `WATCHERS` de `server/signals.py:89-93`, ou generalizar `_run_watcher` para não depender de lista fechada.
- Adicionar `lat?/lng?` ao tipo `Competitor` no frontend e trocar o pareamento por índice por leitura direta do campo.
- Adicionar flag de proveniência (`gerado_por_llm: bool` ou similar) em `intelligence_cards` e propagar no retorno de `POST /api/codify/v0/cards`/`_run_card_pipeline`.
- Adicionar coluna de módulo (`analysis_type` fixo em `"analitico"` para este piloto) em `intelligence_cards`.

## 12. Ajustes médios

- Criar endpoint (ou estender `CNPJScraper`) que grave o resultado da consulta de CNPJ direto em `organizations`/`business_units` (hoje só retorna, não persiste).
- Extrair coordenadas (lat/lng) no scraper de Google Maps ou rodar geocoding pós-scraping sobre o endereço textual.
- Construir a ponte de formato entre `CompetitorPoint` (backend, `/map/competitors`) e `Competitor` (frontend) — ou expor um endpoint novo que já devolva o shape completo com lat/lng.
- Encadear signal→gap→card numa função/rotina única (hoje são 3-4 chamadas HTTP manuais separadas) para reduzir a operação manual do piloto.
- Adicionar colunas de perfil real (`cnpj, cnae, porte, faturamento_declarado, equipe_declarada, contexto_livre`) a `organizations`/`business_units` via migration nova.

## 13. Itens que não são para agora

10 módulos completos além do analítico; motor de setas real (Camada A/B/C); ontologia avançada de relações; marketplace de fornecedores conectado ao frontend; embed de tecnologia de terceiros; qualquer automação sem revisão humana antes de o card virar visível ao cliente; unificação definitiva dos dois pipelines legado/novo (pode ficar paralelo por mais um ciclo, desde que a fonte de verdade escolhida — Seção 10 — seja a única alimentada pelo piloto).

---

## 14. Melhor fluxo mínimo recomendado

1. **Usuário informa CNPJ/nome/local** → chama `CNPJScraper.buscar()` (já existe) → grava em `organizations`/`business_units` (ajuste pequeno: persistir o retorno, hoje só é devolvido).
2. **Sistema preenche perfil básico** → automático para CNPJ/razão social/endereço/CNAE/porte; manual para faturamento/equipe/contexto (formulário curto no onboarding — não vale a pena automatizar agora, não há fonte madura).
3. **Mineradora busca sinais externos** → rodar scrapers já existentes (Google Maps, Google Search, clima; Instagram/Reclame Aqui conforme decisão de risco) → gravar em `intelligence_evidence` com `source_type` parametrizado (ajuste pequeno).
4. **LLM transforma sinais em cards analíticos** → encadear `POST /api/signals/detect` → gap (scoring) → `server/cards.py` (agentes 7/8/9, já reais) → corrigir bug de ações antes de expor "Executar".
5. **Humano revisa/aprova** → usar Governança já existente (`aprovar/rejeitar/distribuir`) como gate supervisionado no piloto — não pular essa etapa agora.
6. **Card aparece no feed correto** → via `intelligence_cards` + distribuição (já existe, mas exige o passo manual de Governança — aceitável como supervisão no piloto, não como bug a esconder).
7. **Usuário clica em Analisar/Entender/Aprender** → já funciona com LLM real para card não-sintético (`action-executor.ts`).
8. **LLM gera bloco no workspace** → já funciona e persiste (`workspace_blocks_db.py`).

**O que o sistema já faz sozinho**: scraping, chamada de LLM para gerar card, chamada de LLM para os botões de workspace, persistência de perfil localização/CNPJ (após o ajuste pequeno), cálculo de distância no mapa.
**O que o humano supervisiona**: aprovação/distribuição de card antes de virar visível ao cliente (recomendado manter no piloto), decisão sobre fontes com risco de ToS.
**O que ainda é manual**: faturamento, equipe, contexto interno leve; encadeamento das chamadas signal→gap→card (não há "rodar tudo" numa chamada só ainda).

---

## 15. Primeiro perfil recomendado para testar

Tecnicamente, o perfil mais adequado para o primeiro teste real do fluxo completo é uma organização **nova, criada do zero via CNPJ real**, não um dos 4 perfis demo existentes (Pacheco/Oscar/McDonald's/Império) — porque esses já têm conteúdo fixture estático que mascararia se o pipeline de sinal→card real está de fato funcionando. Usar um CNPJ de teste (empresa pequena, real, do próprio time) para validar ponta a ponta: CNPJ → perfil → scraper → sinal → card → feed → botão → workspace, sem nenhum fixture no caminho.

---

## 16. Riscos

- Dois pipelines paralelos (`external_*`/`feed_cards` vs. `intelligence_*`) — decisão de convergência não tomada aumenta custo de manutenção e risco de inconsistência.
- Bug do Agent 9 (`"acoes"`/`"actions"`) já derruba silenciosamente parte do conteúdo gerado por LLM — se não corrigido, o botão "Executar"/ações sempre usa fallback determinístico, sem ninguém perceber.
- Fontes com risco de ToS (Instagram, Reclame Aqui, Google Maps/Search scraping direto) usadas num piloto real antes de decisão jurídica.
- Ausência de flag de proveniência LLM — mesmo depois do ajuste, se não for exposta na UI, o cliente não distingue conteúdo real de fallback.
- Confiança hardcoded na ingestão de card via API pode gerar cards "de baixa confiança" mesmo quando o dado é bom, ou vice-versa, distorcendo a governança.
- Geocoding textual (se optar por solução gratuita) pode ter imprecisão suficiente para gerar distância errada no mapa — vale QA manual antes de mostrar a cliente.

## 17. Próximos passos técnicos em ordem

1. Corrigir bug `"acoes"`/`"actions"` em `server/cards.py`.
2. Persistir o retorno do `CNPJScraper.buscar()` em `organizations`/`business_units` (endpoint novo ou extensão do existente).
3. Parametrizar `source_type` na ingestão de evidência externa e no `WATCHERS`.
4. Decidir e implementar geocoding para o scraper de Google Maps (ou pós-processamento).
5. Adicionar colunas de proveniência LLM e módulo analítico em `intelligence_cards`.
6. Construir a ponte de formato `CompetitorPoint` ↔ `Competitor` para o mapa.
7. Encadear signal→gap→card como rotina única para reduzir operação manual no piloto.
8. Rodar o fluxo ponta a ponta com um CNPJ real de teste (Seção 15) antes de qualquer cliente real.
9. Decidir fontes com risco de ToS antes de ativar no piloto.
10. Adicionar colunas de perfil real (`cnpj, cnae, porte, faturamento_declarado, equipe_declarada, contexto_livre`).

---

## 18. Arquivos auditados

**Backend**: `server/organizations.py`, `server/migrations/000{1,2,3,4,5}_*.sql`, `server/codify_api.py`, `server/codify_api_schemas.py`, `server/cards.py`, `server/signals.py`, `server/scoring.py`, `server/roles_extras.py`, `server/workspace.py`, `server/workspace_blocks_db.py`, `server/test_organizations.py`, `agents/agent_7_writer.py`, `agents/agent_8_reviewer.py`, `agents/agent_9_actions.py`, `agents/base_agent.py`, `external/orchestrator.py`, `external/signal_detector.py`, `external/diff_engine.py`, `external/gap_engine.py`, `external/entity_types.py`, `external/snapshot_db.py`, `external/signal_db.py`, `external/gap_db.py`, `external/feed_db.py`, `external/feed_generator.py`, `external/external_classifier.py`, `external/collectors/google_maps_collector.py`, `scrapers/cnpj.py`, `scrapers/google_maps.py`, `scrapers/base_scraper.py`, `scrapers/output/google_maps.json`, `database/schema.sql`, `test_signals.py`.

**Frontend**: `src/types.ts`, `src/core/types/card.ts`, `src/components/WorkspacePanel.tsx`, `src/mockData.ts`, `src/features/map/map-ui-utils.ts`, `src/features/map/useMapAnalysis.ts`, `src/components/maps/CompetitiveMap.tsx`, `src/features/feed/codify-feed-adapter-intel.ts`, `src/features/feed/codify-feed-adapter.ts`, `src/features/feed/codify-feed-client.ts`, `src/features/workspace/execute/action-executor.ts`, `src/App.tsx`.

**Relatórios de referência desta sessão**: `AUDITORIA_OS1_ESTADO_ATUAL.md`, `AUDITORIA_OS1_VALIDACAO_CRITICA.md`.

## 19. Comandos rodados

Nenhum comando de shell foi necessário para este mapeamento — feito inteiramente via leitura de código (Read/Grep) e 4 agentes de exploração somente-leitura em paralelo, cobrindo: perfil/organizations, modelo de sinal, geração de card/schema, e mapa/concorrentes. Nenhum teste foi executado nesta tarefa (não solicitado; a bateria de testes já foi validada nas duas auditorias anteriores desta sessão).
