# Auditoria Técnica — OS¹ — Estado Atual

Auditoria somente leitura. Nenhum arquivo de código, configuração, dado ou fixture foi alterado. Repositórios auditados: frontend `/Users/luttor/codify/your-github-space` (branch `main`), backend `/Users/luttor/codify/omni`.

---

## 1. Resumo executivo

O OS¹ hoje é, tecnicamente, **duas coisas sobrepostas**: (a) uma camada de experiência (feed + "Área de Trabalho") bem desenhada e majoritariamente funcional, alimentada quase 100% por fixture estático manual; e (b) um conjunto real e maduro de mineradoras de dados no backend (CNPJ, Google Maps, Google Search, Reclame Aqui, Instagram, clima) que **não está conectado** à experiência que o usuário vê. Essas duas metades existem, funcionam cada uma por si, mas não se falam ainda.

O "workspace" originalmente concebido como grid de blocos foi **removido e substituído** por um painel de chat linear (`ChatPanel.tsx`) — decisão já tomada e documentada no próprio código, não um bug. Vários componentes antigos (modais, `WorkspacePanel.tsx`, `GridItem.tsx`, `CreateMissionModal.tsx`) continuam no repositório como código morto inatingível, o que é dívida de limpeza, não risco funcional.

A geração de linguagem por LLM é **real** (Anthropic, via `agents/base_agent.py`) nos endpoints de Área de Trabalho (`/api/workspace/*`) e parcialmente no pipeline de cards do orquestrador, mas roda atrás de 5 camadas de fallback silencioso — e há um risco de deploy concreto: o pacote `anthropic` não está listado em nenhum `requirements.txt` do backend, o que pode fazer todo o sistema cair permanentemente no fallback determinístico em produção sem que ninguém perceba.

O motor de "setas" (relações causais entre termos de negócio, o "fosso" do produto) **não existe como motor operante** — existe como tipo/interface bem desenhado + 4 exemplos fixture manuais de um único vertical (farmácia). A ontologia de termos (3.003 termos) é uma taxonomia plana, sem nenhuma aresta modelada, nem no frontend nem no backend.

Os "10 módulos de análise" existem apenas como rótulo — um `enum` TypeScript e 10 toggles idênticos e travados ("Em breve") em `CompanySettingsModal.tsx`. Não há nenhuma lógica, prompt ou pipeline que trate um módulo de forma diferente de outro. Os rótulos atribuídos aos produtos no registry parecem arbitrários: o McDonald's é rotulado "preditiva" mas o texto do feed nunca usa a palavra, enquanto a Pacheco é rotulada só "descritiva/diagnóstica" mas contém "reposição preditiva" no texto.

Segurança: autenticação é JWT real (72h), mas com uma porta dos fundos ativa (qualquer token começando com `demo.`/`simple.` é aceito sem verificação) e uma secret key default hardcoded no repositório. Isso é aceitável para demo controlada, não para cliente pagante.

Build, lint e a maioria dos testes do backend passam. Dois arquivos de teste do backend revelam falhas reais e reprodutíveis (não de infraestrutura): `test_codify_api.py` e `test_feed_codify.py` — cards não sendo encontrados por ID após inserção, o que merece investigação antes de qualquer venda que dependa da API `/api/feed/codify`.

---

## 2. Stack e arquitetura

**Frontend** (`your-github-space`): React 18 + Vite + TypeScript, empacotado também como app **Electron** (`electron/main.ts`, `dist-electron/`) via `electron-builder`. Não usa `react-router` — toda a "navegação" é estado local (`useState`) dentro de `src/App.tsx` (2356 linhas). Mapas: `leaflet`/`react-leaflet` + `@react-google-maps/api` (Google desativado via flag, ver seção 10). Navegador embutido usa `<webview>` nativo do Electron ou, na web, `libcurl.js` (WASM) + proxy WISP externo + fallback `/api/proxy` (Vercel function).

**Backend** (`omni`): FastAPI (Python 3.9), banco principal **SQLite** (`server/auth.db`, path configurável via `AUTH_DB_PATH`) cobrindo auth, organizações, workspace blocks, cards, missões, governança. Um **segundo banco, PostgreSQL + pgvector**, isolado em `database/`, é usado só pelo subsistema de QR/fidelidade (`qr_router.py`) — os dois mundos não se cruzam.

**LLM**: Anthropic (`claude-haiku-4-5-20251001` / `claude-sonnet-4-6`), chamado diretamente via SDK `anthropic` em `agents/base_agent.py` e `server/classifier.py`. Um router multi-provider (`router/router.py`, 10 providers) existe mas **não é usado** por nenhum arquivo de `server/` — só por um módulo de storyboard desconectado (`narrativa/`).

**Coleta de dados**: `scrapers/` (Playwright + APIs reais: CNPJ via ReceitaWS/BrasilAPI, Google Maps, Google Search, Reclame Aqui, Instagram, clima via OpenMeteo) → `external/collectors/` (padrão `BaseCollector`) → `external/orchestrator.py` → `etl/pipeline.py` (limpeza → embeddings Ollama → Postgres). Um segundo "motor" mais novo e paralelo, `tools/motor_v0/`, usa Tavily/SerpApi + Anthropic para gerar cards offline via CLI.

**Deploy**: Frontend via `vercel --prod` manual (`vercel.json` reescreve `/api/*` para `https://omni-production-32d3.up.railway.app`); GitHub **não** aciona deploy automaticamente. Backend via push directo no Railway (projeto `tender-clarity`). CI/CD (`.github/workflows/electron-release.yml`) só builda e publica o instalador desktop quando uma tag `v*` é criada — **não há pipeline de lint/test/typecheck automatizado em push ou PR** (não confirmado se existe fora do que foi encontrado neste repositório).

**O que roda onde:**
- **Navegador (web)**: React app completo, mas navegador embutido degradado (sem captura de texto real, sem abas múltiplas, sem back/forward), Google Maps sempre desativado por flag.
- **Electron (desktop)**: tudo do navegador + `<webview>` nativo com múltiplas abas, captura de texto de página, abertura de link externo, captura de tela (pausada por flag).
- **Backend**: auth, organizações, cards, feed, workspace (com LLM real), governança, missões, shortcuts/marketplace, scrapers.
- **Fixture/local apenas**: praticamente todo o conteúdo dos perfis demo (`src/data/sector-feeds/*.ts`), coordenadas do mapa, catálogo de ferramentas/atalhos do workspace, dado do CMED no frontend.
- **Depende de variável de ambiente**: `ANTHROPIC_API_KEY`, `JWT_SECRET` (com default inseguro se ausente), `AUTH_DB_PATH`, `VITE_GOOGLE_MAPS_KEY` (chave existe mas billing do Google Cloud não está habilitado), `TAVILY_API_KEY`/`SERPAPI_API_KEY` (motor_v0).
- **Depende de Vercel/serviço externo**: proxy de navegação (`api/proxy.ts`, Vercel function), proxy WISP externo (`wss://wisp.mercurywork.shop`, domínio de terceiro, não confirmado se é infraestrutura própria).

---

## 3. Front-end

Não há rotas — `App.tsx` controla tudo via ~50 `useState` (flags como `mapOpen`, `browserOpen`, `scoreOpen`, `sectorOpen`, `chatOpen`, `scrolled`). "Trocar de tela" é montar/desmontar overlays por cima do feed, não navegação com histórico/URL.

**Layout**: nav superior fixa (`App.tsx:1183-1255`) com nome da empresa, atalhos de logout/setor/score/mapa/notificações. Não há sidebar tradicional — o papel de painel lateral é do `ChatPanel` (`src/components/ChatPanel.tsx`), que ocupa 340px fixos e se expande para `calc(50vw - 20px)` em modo "split" quando `scrolled=true`.

**Feed**: `FeedComponents.tsx` + `SectorFeed.tsx`. Fontes mescladas em ordem (`feed-sources.ts`): API real (`useCodifyFeed`) → cards do mapa → cards do navegador → config estática por perfil (`roleConfig.feedCards`). Sem organização/token reais, cai 100% em fixture (`src/data/sector-feeds/*.ts`, `demo-feed-cards.ts`). Os 4 botões de cada card (Analisar/Entender/Aprender/Compartilhar) têm uma animação de loading interna que é **código morto** — quando a prop real (`onWorkspaceIntent`) está presente, o que ocorre sempre em produção, o handler delega direto para a Área de Trabalho sem passar pela animação.

**"Área de Trabalho"**: o componente originalmente fullscreen com grid de blocos (`WorkspacePanel.tsx`) está **desligado** — comentário explícito em `App.tsx:2066`: *"WorkspacePanel fullscreen removido — cards do feed agora alimentam o chat"*. O que existe hoje é uma lista linear de mensagens/blocos dentro do `ChatPanel`, um card ativo por vez por setor. `GridItem.tsx` é código morto (zero imports). `DesktopView.tsx` não é grid de workspace — é a UI de captura de tela do navegador Electron (feature pausada).

**Persistência de blocos**: real no backend (SQLite, upsert por `card_id`+`endpoint`+`sub_key` — grava só o **último resultado**, não histórico). O histórico de mensagens da sessão de chat **não persiste** — comentário explícito em `workspace-history.ts`: recarregar a página zera a conversa.

**Modais**: funcionais — `SectorSwitcherModal`, `CompanySettingsModal`, `ConcorrenteModal`, `TimelineModal`. Órfãos/inatingíveis (substituídos por cards sintéticos no workspace, mas código não removido): `StatInfoModal`, `EmpresaModal`, `SettingsModal` (dificuldade), `BottomModal` genérico (telas "Evolução"/"Salvos"), `StoryViewer`, `CreateMissionModal`.

**Estado global**: não há Context/Redux/Zustand. `useAuth.ts` não é hook reativo — são funções puras lendo/escrevendo `localStorage` diretamente. `useFeedState.ts` está pronto mas explicitamente não usado ainda ("Fase 17", comentário do próprio arquivo). Bridges de evento (`src/core/events/useOS1*Bridge.ts`) fazem o papel de barramento entre navegador/mapa/ontologia e o estado central via `CustomEvent`/`postMessage`.

**Classificação por área**: Feed (renderização) — funcional. Feed (dados reais) — parcial, depende de org/token. Workspace/chat — funcional, mas fundamentalmente diferente de um "grid de blocos". Workspace antigo fullscreen — morto. Persistência de blocos — parcial (sem histórico completo). Chat de texto livre (`handleSend`) — **mockado**: `setTimeout` de 1.4s devolvendo texto fixo, sem chamar LLM/backend algum. Notificações (sino) — placeholder, toast "em breve".

---

## 4. Feed e cards

Tipos de card: `IntelligenceCard` (schema rico, usado pela via `codify-feed-client`/API real) e `SectorCard` (schema simples — `color/tag/title/detail/badge` — usado pelos fixtures `sector-feeds/*.ts`). Nenhum dos dois tem campo `analysisType` — os "10 módulos de análise" não se materializam estruturalmente em nenhum card.

**Origem dos cards**: API real (`GET /api/feed/codify`, autenticado, retorna cards persistidos no banco — não gera nada na hora), Mapa (10 ações via `useOS1MapBridge`), Navegador (ações via `useOS1BrowserBridge`, hoje com a barra de ações oculta por padrão), e fixture estático por perfil (`sector-feeds/*.ts`, escrito à mão). O CMED (`CMED_CONNECTOR`) também é injetado no feed da Pacheco via `useMemo` em `App.tsx`, mas seus dados são fixture (`cmed-fixture.ts`), não uma consulta real à ANVISA.

**Cards informativos vs. acionáveis**: todo card do feed tem os mesmos 4 botões (Analisar/Entender/Aprender/Compartilhar); a diferença entre "informativo" e "acionável" está no que a Área de Trabalho faz com o card, não no card em si. Card vira "bloco" na Área de Trabalho via `openWorkspaceFromCard(card, intent)` (`App.tsx:524`), que dispara (best-effort, silencioso) `POST /api/orchestrator/interact` para cards reais e ignora cards sintéticos (`_synthetic`/`synth-`).

**O que funciona hoje como ato completo**: os fluxos de Área de Trabalho que chamam `/api/workspace/{pesquisar,executar,aprender,simular,estender}` — geram conteúdo real (LLM real com fallback) e o resultado persiste (última versão) no backend.

**O que só demonstra formato**: praticamente todo o conteúdo dos 4 perfis demo ativos (Oscar/nike, Pacheco/nubank, McDonald's, Cervejaria Império) — texto redigido à mão, sem geração dinâmica. Cards com `_synthetic: true` mostram aviso explícito no código de que é demonstrativo (`WorkspacePanel.tsx:132-138`, ainda que esse componente específico esteja morto, a lógica de aviso é reaproveitada em outros pontos).

**Cards bloqueados/escondidos**: as 12 empresas extras em `sector-feeds/` (ifood, ambev, magalu, embraer, tesla, netflix, spotify, airbnb, uber, apple, amazon, natura) não são alcançáveis pelo fluxo normal de troca de perfil — são dado morto do ponto de vista de produto. O conteúdo mais rico do Oscar (`oscar-loja1.ts`, 12 departamentos) fica atrás de um login de loja separado (`oscar-piloto-01`), não do perfil "matriz" padrão (que só tem 7 de 12 departamentos populados).

**Já bom o suficiente para demonstração comercial**: o conjunto Pacheco/Farmácia (único com `arrowsUnlocked` e fonte CMED associada) e o conteúdo completo de `oscar-loja1.ts` (se usado via a conta de loja piloto, não a conta matriz).

---

## 5. Workspace

Ver detalhamento em Seção 3. Resumo direto: o "workspace" real do produto hoje é o `ChatPanel` — uma lista linear de blocos (`WorkspaceBlock`: `initial`/`mode`/`tool`/`share`/`diagnostico`) associada a um card ativo por setor, não um canvas/grid de blocos posicionáveis. Ferramentas (`WorkspaceTools` → `workspace-tools.catalog.ts`) e atalhos (`WorkspaceShortcutsBlock` → `workspace-shortcuts.catalog.ts`) rodam localmente (templates de string com interpolação de contexto), sem LLM nem backend — ver Seção 14 para o detalhe de por que isso é relevante para "ato completo".

Persistência: só o último resultado de cada combinação card+ação sobrevive a um reload (SQLite, `workspace_blocks_db.py`); a sequência de conversa em si (mensagens, blocos anteriores, ordem) não persiste — comportamento documentado no próprio código, não bug latente.

Governança (Aprovar/Rejeitar/Distribuir) está embutida no card dentro do chat (`CardGovernanceActions`) e **é real** — chama backend real (`server/governance.py`), sem LLM envolvido, com controle de acesso matriz/não-matriz.

---

## 6. Botões e ações

Tabela consolidada (evidência completa de cada linha nos relatórios de auditoria por área; arquivo:linha citado onde relevante).

| Área | Botão | Componente/arquivo | Função/chamada | Chama o quê | Status | Observações |
|---|---|---|---|---|---|---|
| Feed | Analisar/Entender/Aprender/Compartilhar (card) | `FeedComponents.tsx:269-314` | `onWorkspaceIntent` → `openWorkspaceFromCard` (`App.tsx:524`) | Local + `POST /api/orchestrator/interact` (best-effort) | Funcional | Animação de loading interna é código morto residual |
| Workspace | Ferramentas (grid, ~80 itens) | `workspace-tools.catalog.ts` + `WorkspaceToolsPanel.tsx` | `template(ctx)` | 100% local (template string) | Funcional (não é IA) | Comentário do runner admite: "puramente local/fallback" |
| Workspace | Atalhos compactos (~95 itens, com badges de tier) | `workspace-shortcuts.catalog.ts` + `WorkspaceShortcutsBlock.tsx` | `runShortcut()` → `template(ctx)` | 100% local | Funcional (não é IA) | Badges tier só visíveis a `role==='codify' && sector==='os1'` |
| Workspace (chat) | Chips "Atalhos" por bloco | `ChatPanel.tsx:908-927` | `shortcutsForCard(card)` + fetch remoto descartado | Local; resultado real do backend é buscado e jogado fora (`s.kind !== 'local'` filtrado, linha 917) | **Parcial/enganoso** | Backend real (`/api/shortcuts/para-card`) nunca chega à tela |
| Workspace | Enviar mensagem livre no chat | `ChatPanel.tsx:416-429` (`handleSend`) | `setTimeout` 1.4s | **Mock** — texto fixo, sem LLM/backend | Mockado | "Analisando os dados... Em breve terei uma resposta completa" |
| Workspace | Pesquisar/Executar/Aprender/Simular/Estender | `action-executor.ts` → `POST /api/workspace/{endpoint}` | `agents/base_agent.py` → Anthropic real | Real backend/LLM (com fallback silencioso) | Funcional | Ver Seção 7 |
| Score | Abrir Score | `App.tsx:1227` | `setScoreOpen` | Local | Funcional | Só para quem tem `canAccessCompanyVision(role)` |
| Score | Conteúdo (evidências, dimensões) | `ScoreOS1Panel.tsx:484` | `apiFetch('/api/codify/v0/evidences')` (orgs c/ integração) ou `getMock(sector)` | Misto: real (McDonald's) / mock hardcoded (Oscar/Pacheco/Império) | Funcional/Mock | Textos de evidência dos perfis demo são copy manual |
| Score | Badges "Ver Feed"/setas em sinais relacionados | `ScoreOS1Panel.tsx:625,731-745` | nenhum `onClick` | N/A | **Decorativo/enganoso** | Parecem clicáveis, não navegam |
| Config | Toggles "Módulos de análise" (10) | `CompanySettingsModal.tsx:404-419` | nenhum (`cursor-not-allowed`) | N/A | **Placeholder explícito** | Todos "Em breve", sempre travados |
| Config | Salvar configuração da empresa | `CompanySettingsModal.tsx:458` | `saveSettings()` → `localStorage` | **Local apenas** | Parcial/enganoso | Mensagem diz "salva localmente"; não influencia motor de sinais |
| Bio/Header | Nome da empresa / Stats clicáveis / Diagnóstico | `App.tsx:1188,1435,1489,1551,640` | `openEmpresaInWorkspace`/`openStatInWorkspace`/`openDiagnosisInWorkspace` | Local (agregação real sobre dado mock) | Funcional | Diagnóstico usa motor de cobertura, não LLM, não setas |
| Bio/Header | Sino de notificações | `App.tsx:1246` / `ChatPanel.tsx:1036` | `showToast('em breve')` / nenhum handler | N/A | Placeholder | No `ChatDesktop` nem toast existe |
| Bio/Header | Convite por e-mail | `App.tsx:598` | card sintético → workspace | Local, fim de cadeia | Placeholder | — |
| Mapa | Menu de ações (10 ações) | `MapActionsMenu.tsx:28-41` | `dispatchMapAction` → `useOS1MapBridge.ts` | Local (heurística sobre fixture) + eventos para Feed/Workspace | Funcional (não é IA) | "monitor-territory" só visível para role `codify` |
| Navegador | 10 ações (enviar p/ workspace, gerar card, etc.) | `core/types/browser.ts:97-107`, `useOS1BrowserBridge.ts` | `runAction()` → `CustomEvent` | Local (localStorage) | **Apenas demo / oculto por padrão** | Barra de ações com `display:'none'` nos dois componentes |
| Navegador | Voltar/Avançar/Recarregar | — | — | — | **Ausente na UI** | Estado rastreado internamente, sem botão no JSX |
| Governança | Aprovar/Rejeitar/Distribuir card | `CardGovernanceActions.tsx` | backend real (`server/governance.py`) | Real backend | Funcional | Sem LLM |
| Ontologia | Esfera Ontológica | `App.tsx:2265` | `ONTOLOGY_HIDDEN=true` | — | **Desligado por decisão de produto** | Nunca montado |
| Ontologia/Setas | "Direções possíveis" (4 botões) | `ChatPanel.tsx:576-596` | `onClick={() => {}}` | Nenhum | **No-op decorativo** | Só visível no produto Pacheco (`arrowsUnlocked`) |
| Modais órfãos | Salvos, StatInfo, Empresa, Dificuldade, Story, Criar Missão | vários | states de abertura nunca setados `true` | — | **Inatingível/código morto** | Substituídos por cards sintéticos, código não removido |

---

## 7. LLMs e geração

**Onde ficam os prompts**: strings inline (f-strings Python), sem templates externos em produção. Principais: `server/workspace.py:46-226` (um prompt/system-prompt por ação: pesquisar/executar/aprender/simular/estender), `agents/agent_1..9_*.py` (um prompt por etapa do pipeline), `server/classifier.py` (classificação de domínio).

**Endpoints que chamam LLM de verdade**: `POST /api/workspace/{pesquisar,executar,aprender,simular,estender}` (`server/workspace.py` → `agents/base_agent.py:69-98`, Anthropic real). `POST /api/orchestrator/scan` (`server/orch_api.py` → `server/cards.py` → 3 dos 9 agentes: `agent_7_writer`, `agent_8_reviewer`, `agent_9_actions`). `server/classifier.py:_classify_by_llm`, fallback de 3 camadas quando a regra determinística falha.

**Provider**: só Anthropic é de fato usado em produção (`claude-haiku-4-5-20251001` / `claude-sonnet-4-6`, hardcoded em `agents/base_agent.py:22-23`). O `router/router.py` (multi-provider: Groq, Cerebras, SambaNova, GitHub Models, HF, Together, OpenRouter, OpenAI, Anthropic, Ollama) **não é chamado por nenhum arquivo de `server/`** — só por `narrativa/` (módulo de storyboard desconectado do FastAPI). A dependência `@google/genai` no frontend (`package.json:19`) **não tem nenhum import** em `src/` nem `api/` — resíduo morto de scaffold anterior. **Não há chamada de LLM direto do client hoje.**

**Risco de deploy confirmado**: nem `omni/requirements.txt` nem `omni/server/requirements.txt` listam o pacote `anthropic` (verificado diretamente — `grep -i anthropic` não retorna nada em nenhum dos dois arquivos). Como `agents/base_agent.py:100-102` engole qualquer exceção (incluindo `ImportError`) e retorna `"{}"`, se o ambiente de produção não tiver o pacote instalado por outro meio, **todo o sistema de geração real cai silenciosamente no fallback determinístico**, sem qualquer sinal de erro visível.

**Payload/resposta**: frontend → `apiFetch('/api/workspace/{endpoint}', {card_id, tipo?, cenario?})` → backend monta prompt com campos do card + negócio → Anthropic Messages API → `msg.content[0].text` parseado como JSON (`_extract_json`) → devolvido estruturado ao cliente.

**Tratamento de erro/fallback**: 5 camadas, todas silenciosas — (1) `base_agent.py` engole exceção de chamada LLM, (2) parse de JSON inválido retorna `{}`, (3) cada agente tem fallback determinístico próprio, (4) se o módulo `external` inteiro falhar ao importar, os endpoints usam `server/workspace_fallback.py` (templates de string, sem rede, campo `"fallback": true` na resposta), (5) clients do frontend (feed/context/governance/missions) engolem timeout/erro e caem em `[]`/`null` sem loading/toast visível ao usuário — comentado explicitamente como "Política de erro: tudo silencioso" em `codify-feed-client.ts:7-9`.

**Separação por tipo de ação**: sim, real — cada ação (pesquisar/executar/aprender/simular/estender) tem system prompt, modelo (cheap/strong) e schema JSON próprios em `server/workspace.py`. Não é uma função genérica reaproveitada com só o texto trocado.

**Custo/tier/permissão de uso de LLM**: não encontrado nenhum controle de quota, rate limit ou billing associado a chamadas de LLM. Permissão existente é de autorização de acesso a dado (matriz/não-matriz), não de uso de modelo.

**Classificação por fluxo**:
| Fluxo | Classificação |
|---|---|
| `/api/workspace/{pesquisar,executar,aprender,simular,estender}` | Real backend/LLM, com fallback determinístico |
| `/api/workspace/regenerar` | Parcial — delega a `external/feed_generator.py`, não confirmado se usa LLM |
| `/api/orchestrator/scan` (writer/reviewer/actions) | Real backend/LLM (parcial — só 3 de 9 agentes) |
| `agents/pipeline.py` (9 agentes completo) | Não ligado — só usado em `agents/test_pipeline.py` |
| `router/router.py` (multi-provider) | Não ligado ao produto OS¹ web |
| `server/classifier.py` | Real backend/LLM com fallback de 3 camadas |
| `@google/genai` no frontend | Morto/não ligado |
| Chat livre (`ChatPanel.handleSend`) | Mockado |
| Ferramentas/atalhos do workspace | Local/mock (templates, não LLM) |

---

## 8. Perfis demo, papéis e tiers

`PRODUCT_VERSION_REGISTRY` (`src/core/product/product-registry.ts`) tem 4 produtos ativos:

| Produto | sectorId | Formato | Módulos (`analysisTypes`) | `arrowsUnlocked` | `sourceIds` | Org real |
|---|---|---|---|---|---|---|
| Pacheco (Farmácia) | `nubank` | Vertical | descritiva, diagnostica | **true** | `['cmed']` | `org-drogaria-pacheco` |
| Oscar (Calçados) | `nike` | Horizontal | descritiva, comparativa, tendencias | false | `[]` | `org-oscar-calcados` |
| McDonald's (Fast Food) | `mcdonalds` | Vertical | preditiva | false | `[]` | `org-mcdonalds-brasil` |
| Império (Bebidas) | `cerveja-imperio` | Vertical | descritiva | false | `[]` | — (sem `realOrgId`) |

**Achado relevante**: os rótulos de `analysisTypes` parecem editoriais, não derivados do conteúdo — Oscar (Horizontal) tem 3 módulos, mais que os perfis Vertical (contraintuitivo se "vertical" fosse sinônimo de "mais avançado"). McDonald's é rotulado "preditiva" mas o texto do feed (1886 linhas) não contém a palavra "predit" nenhuma vez; Pacheco/nubank é rotulado só "descritiva/diagnóstica" mas contém "reposição preditiva" 2 vezes. Não existe no repositório o documento `projeto_omni_perfis_demo.md` citado nos comentários do código — está fora do repo (Drive/Notion) ou foi removido.

O campo `blocksStoreSwitcher` (`true` em todos os 4 produtos) **não é consumido em lugar nenhum do frontend** — o guard real de bloqueio do switcher de loja é feito por comparação de string hardcoded direto no `App.tsx`, não pelo registry. `realOrgId`/`realUnitId` também não são lidos por nenhum componente — servem só de documentação para ligação futura.

**Papéis**: dois níveis distintos — `os1_role` (localStorage, client-side, controla só UI/copy, sem consequência de segurança) vs. `role`+`access_scope` em `memberships` (backend, validado server-side de verdade em rotas sensíveis). É fácil confundir os dois porque têm o mesmo nome conceitual.

**Perfil mais forte para vender agora**: Pacheco/Farmácia — único com fonte de dado real (CMED, ainda que fixture) e setas de direção habilitadas (`arrowsUnlocked`), sinalizando um produto "mais avançado" mesmo que as setas em si sejam decorativas. Segundo lugar: conteúdo completo do Oscar via a conta de loja piloto (`oscar-piloto-01`/`oscar-loja1.ts`), hoje fora do fluxo normal de demo.

**O que pode gerar confusão no pitch**: perfil Oscar/nike "matriz" (o alcançável pelo fluxo normal) só tem 7 de 12 departamentos populados — visivelmente incompleto se o prospect explorar todos os setores. Cervejaria Império tem conteúdo completo mas **sem organização real conectada**; o switcher de loja/distribuidora existe na UI mas abre a mesma matriz (alias sem conteúdo próprio) — perceptível a um clique.

**O que está escondido que talvez devesse aparecer**: nada de relevante identificado — o padrão observado é o oposto (coisas aparecendo que talvez devessem ficar escondidas, ver Seção 21).

**O que já parece produto real**: fluxo de Governança, motor de ranking de fornecedores no backend (`shortcuts.py`), isolamento de dados por organização/membership. **O que parece demo demais**: badges "Vertical/Horizontal Segmentado" sem lastro consistente no conteúdo; toggles de módulos de análise sempre travados.

---

## 9. Navegador embutido

**Mecanismo**: Electron usa `<webview>` nativo Chromium (`ElectronBrowserView.tsx`), não iframe — múltiplas abas reais, sessão `persist:omni-browser` com `X-Frame-Options` removido. Fora do Electron, é iframe + `libcurl.js` (WASM) conectando a um servidor WISP **externo** (`wss://wisp.mercurywork.shop`, não confirmado se é infraestrutura própria — o `wisp-server/` local do repositório não é o destino usado pelo cliente), com fallback para `/api/proxy` (Vercel function que reescreve HTML/remove headers de segurança).

**Navegação**: abrir URL, criar/fechar abas — funcional no Electron via `webview.loadURL()`. **Voltar/Avançar/Recarregar são rastreados internamente mas não têm botão na UI** — ícones importados e nunca usados no JSX. Sem múltiplas abas no fallback web.

**Leitura de URL/título**: nativa no Electron (`wv.getURL()`/`wv.getTitle()`). No fallback web, título **sempre vazio** (`getIframeCtx()` retorna `title: ''` por design, apesar do sandbox permitir `allow-same-origin`).

**Captura de texto**: só no Electron, via `wv.executeJavaScript('...document.body.innerText...')`. Alimenta `analyzePageContext()` — classificação heurística (regex/hostname) de tipo de página (preço/regulatório/concorrente/etc.), sem LLM.

**Ações do navegador → feed/workspace**: 10 ações tipadas (`send-to-workspace`, `create-mission`, `generate-feed-card`, etc.) via `useOS1BrowserBridge.ts`, mas a **barra de ações está oculta por padrão** (`display:'none'`) nos dois componentes — inacessível ao usuário a menos que outro componente dispare programaticamente. Tudo persiste só em `localStorage`, sem backend.

**Linguagem antiga**: resquício documentado e em migração controlada — tipo interno `BrowserMission`/`create-mission` mantido por compatibilidade, mas texto visível já é "Plano da página"/"rascunho". Risco baixo, bem comentado no código.

**Classificação**: navegação básica — funcional (Electron). Voltar/avançar/recarregar — ausente. Fallback web — parcial, dependente de infraestrutura externa (WISP de terceiro). Captura de texto — dependente de Electron. As 10 ações — apenas demo/oculto, tudo local. Desktop Capture — pausado por flag. `epoxy-transport`/`scramjet-controller` (deps declaradas) — código morto, sem uso.

**Potencial como capturador de sinal**: a base é sólida (heurística de classificação de página, dedupe de evidências, rastreabilidade via `evidenceId`/`dossierId`) mas hoje só funciona plenamente no Electron, é 100% local (sem backend), é regra estática (sem LLM) e está desligada por padrão na UI — o potencial existe, a ativação não.

---

## 10. Mapa competitivo

**Tecnologia ativa**: Leaflet, não Google Maps — `FORCE_LEAFLET = true` hardcoded em `CompetitiveMap.tsx:62`, com comentário explícito: mudar só quando o billing do Google Cloud for habilitado. A chave (`VITE_GOOGLE_MAPS_KEY`) existe e é válida, mas o projeto não tem billing — causa raiz documentada no próprio código (`GoogleMapWrapper.tsx:144-159`, `BillingNotEnabledMapError`). `react-leaflet` é dependência morta (o fallback usa `leaflet` puro).

**Coordenadas**: 100% hardcoded em arrays fixos (`map-ui-utils.ts`), pareados por **índice de array** com a lista de concorrentes do mock — acoplamento frágil, sem geocodificação real, sem API de distância.

**Raio e distância**: matemática real (Haversine, `map-ui-utils.ts:120-127`), aplicada localmente sobre o dataset fixture. Steps discretos (500m a 50km + "sem limite"), não slider contínuo.

**Painel lateral**: métricas agregadas reais sobre o subconjunto filtrado (contagem, ticket médio via regex, tags mais frequentes), mas todos os campos-fonte vêm de texto escrito à mão no mock — "análise do raio" é heurística condicional simples (thresholds fixos), não NLG real.

**Integração**: conectado a Feed e Workspace via barramento de eventos (`useOS1MapBridge.ts`) — arquitetura real, não isolada. Não confirmado uso direto do motor de ontologia a partir do mapa.

**Vendável hoje?** Sim, com ressalva de enquadramento — UX polida, fallback resiliente Google→Leaflet, cálculo geográfico real. Falta: fonte de dado real de concorrentes/geocodificação, billing do Google (ou decisão definitiva por Leaflet/OSM), geração de insight por IA real substituindo os templates condicionais, persistência em backend (hoje é `localStorage`). **Risco de credibilidade**: textos de concorrentes com "fonte/evidência" e "última atualização" escritos à mão podem passar impressão de dado coletado ao vivo para quem não conhece o código.

---

## 11. Registry e fontes de dados

Existem **dois vocabulários paralelos e não unificados** de "fonte de dado" no frontend: `SourceConnector`/`SOURCE_REGISTRY` (`src/core/adapters/source-registry.ts`, campos `analysisTypes`, `license: 'publica'|'aberta'|'comercial'|'restrita'`, `status: 'disponivel'|'planejado'|'contratado'`) e `IntelligenceInput` (`src/data/intelligence-inputs.ts`, campos `origin/mode/status/category/isConnected/isDemo/isFuture`). Não há ponte de código entre os dois.

**Mineradoras reais hoje**: apenas 1 conector real está registrado no frontend — `CMED_CONNECTOR`, e mesmo esse consome fixture estático (`cmed-fixture.ts`), não a ANVISA de verdade (o próprio arquivo confirma: "substituível por fetch real em etapa futura"). No **backend**, a realidade é bem diferente e mais madura: 7 scrapers reais e funcionais — CNPJ (ReceitaWS/BrasilAPI), Google Maps, Google Search (+ DuckDuckGo fallback), Reclame Aqui, Instagram, clima (OpenMeteo), fornecedores — todos orquestrados por `external/orchestrator.py` via padrão `BaseCollector`. `fornecedores_collector.py` existe mas não está de fato registrado no orquestrador (órfão parcial).

**Ponto de plugagem pronto**: sim, nos dois lados. Frontend: criar `SourceConnector` seguindo `cmed-connector.ts` como modelo + registrar em `SOURCE_REGISTRY` (comentário explícito no próprio arquivo). Backend: subclasse de `BaseCollector` + registro em `entity_types.EXTERNAL_SOURCES` + chamada em `orchestrator.py` — padrão já provado em 6+ integrações reais.

**Onde plugar a próxima fonte com mais segurança**: pelo **backend**, seguindo o padrão scraper → collector → orchestrator → persistência via `snapshot_db` → ponte para o feed real via `server/codify_api.py` (`POST /api/codify/v0/cards`, autenticado por API key, já testado em produção). Esse caminho é mais maduro que o `SourceConnector` do frontend, que nunca foi exercitado com dado dinâmico real.

**Risco de licença (avaliação técnica, não jurídica)**: CMED/ANVISA, CNPJ (ReceitaWS/BrasilAPI) e clima (OpenMeteo) são fontes públicas/abertas. Scraping direto de Google Maps, Google Search, Instagram e Reclame Aqui usa técnicas anti-detecção (rotação de user-agent, remoção de fingerprint `webdriver`) — sinal técnico de risco de violação de Termos de Serviço dessas plataformas. Há uma divergência entre o discurso do frontend (comentário pedindo "consultar advogado antes de ativar fonte comercial" para Bright Data/Oxylabs/Zyte) e a prática do backend, que já roda scraping direto contra essas mesmas categorias de fonte sem os intermediários comerciais.

---

## 12. Motor de setas e ontologia

**Nível (a) — existe e está ligado**: a ontologia como taxonomia plana (3.003 termos, `public/ontology-data.json`) alimenta o motor de **diagnóstico de cobertura** (`src/lib/ontology-diagnostics.ts`) — keyword-matching determinístico, sem LLM, que gera o card de "Análise da empresa". Isso **não é** o motor de setas — é um classificador de presença/ausência por domínio.

**Nível (b) — existe no código mas não ligado**: `src/core/relations/relation.ts` (tipos: `Relation`, `RelationType`, `RelationStatus`, `RelationOrigin`), `relation-generator.ts` (`generateCandidateRelations()` apenas filtra um array **hardcoded** de 4 relações fixture do vertical farmácia — comentário do próprio arquivo: "Futuro: substituir por chamada LLM real"), `relation-registry.ts` (mesmo fixture, sem chamadores externos). A Esfera Ontológica (`OntologySphereOverlay.tsx`) está completa mas desligada por `ONTOLOGY_HIDDEN = true` (`App.tsx:413`). Existe um resquício de UI — bloco "Direções possíveis" no `ChatPanel.tsx:576-596`, visível só no produto Pacheco (`arrowsUnlocked`), mas os botões são `onClick={() => {}}` — decorativos, sem ação real.

**Nível (c) — ainda não existe**: qualquer schema de aresta tipada persistida (nem frontend nem backend — `omni/ontology/schema.py` é estritamente `Domain→Subdomain→Capability→EvidenceRule`, sem campo `from/to/relationType` em nenhum dos 36 JSONs de ontologia); qualquer chamada real a LLM para gerar relação; qualquer UI funcional de grafo/setas com confirmação/rejeição.

**Fundação técnica real do fosso**: uma taxonomia de domínio madura e testada (30+ testes unitários no backend) — um "vocabulário" sólido — mais um **desenho de interface bem pensado** para relações (tipos TypeScript corretos) e 4 exemplos manuais de um único vertical. Não há gerador, não há persistência de grafo, não há chamada de LLM implementada. A frase "setas geradas sob demanda por LLM" **não está implementada** — o que existe hoje é fixture estático, não geração sob demanda de fato.

**Menor caminho seguro para ligar a Camada A**: reaproveitar o contrato de dados já tipado (`Relation`), a assinatura de `generateCandidateRelations(activeTerms)` (já recebe só termos "acesos", não o grafo inteiro), e o conceito de "termos acesos" que já existe em `ontology-diagnostics.ts` (`matchSignalsToTerms`) — hoje os dois sistemas nunca se falam. Falta: um client/endpoint de LLM real plugado a esse fluxo, persistência real (hoje é array estático em memória), e um `onClick` funcional nos botões de seta hoje no-op.

**Riscos de ligar cedo demais**: a UI atual não distingue "candidata" de "validada" (mostra só `type`+`rationale`, sem `confidence`/`status`); não há mecanismo de correção/curadoria implementado; domínios sensíveis (fiscal/jurídico, já marcados `sensibilidade: 'alta'/'critica'` na ontologia) não têm o mesmo gate de validação humana usado no diagnóstico de cobertura; sem paginação real de "termos acesos", o custo pode degenerar para o "grafo completo" que a arquitetura quer evitar.

---

## 13. 10 módulos de análise

`AnalysisType` existe **só no frontend**, como union type TypeScript — zero referência no backend Python. `CompanySettingsModal.tsx:404-419` renderiza os 10 como toggles idênticos, todos com `title="Em breve"`, `cursor-not-allowed`, sem `onClick`/`onChange` — o único diferencial entre eles é cosmético (rótulo "incluído" se o produto ativo listar aquele tipo em `analysisTypes`).

| Módulo | Status | Atribuído a algum produto? | Observação |
|---|---|---|---|
| Descritiva | Tipo + 1 conector real (fixture) | Pacheco, Oscar, Império | Único com fonte associada (CMED) |
| Diagnóstica | Só rótulo | Pacheco | Conteúdo do feed não reflete o rótulo |
| Preditiva | Só rótulo | McDonald's | 0 ocorrências de "predit" no feed correspondente |
| Prescritiva | Só tipo/label | Nenhum | Nunca atribuída |
| Comparativa | Só rótulo | Oscar | Palavra aparece solta em textos de outros perfis também |
| Tendências | Só rótulo + 1 card hardcoded solto no App.tsx | Oscar | Card fixo desconectado do conceito de módulo |
| Sentimento | Só rótulo | Nenhum | Só citado como recurso de concorrentes no mock |
| Inferencial | Só tipo/label | Nenhum | Nunca atribuída |
| Exploratória | Só tipo/label | Nenhum | Nunca atribuída |
| Cognitiva | Só tipo/label | Nenhum | Única ocorrência é incidental, sem relação com o módulo |

Nenhum dos 10 tem prompt, pipeline ou lógica de geração diferenciada — `IntelligenceCard` nem `SectorCard` têm campo `analysisType`. O módulo mais avançado tecnicamente é a Descritiva via CMED (fonte com licença pública, função de transformação implementada, já associada a um produto real) — mas falta: fetch real (hoje fixture), o campo `analysisType` propagado ponta a ponta, destravar a UI (trocar `<div>` por `<button>` real), e um modelo de cobrança/tier que **não existe em nenhum lugar do código hoje**.

A escada Horizontal→Vertical está documentada só como comentário (`product-version.ts:12-16`), sem mecanismo de código que promova produtos ou libere módulos automaticamente — e a distribuição atual de módulos por produto contraria a intuição da própria escada (Oscar, Horizontal, tem mais módulos que os Verticais).

---

## 14. Atalhos, marketplace e terceiros

Dois sistemas de atalho no workspace, ambos **100% locais** (templates de string, sem LLM, sem backend): "Ferramentas" (`workspace-tools.catalog.ts`, ~80 itens) e "Atalhos compactos" (`workspace-shortcuts.catalog.ts`, ~95 itens, com badges de tier). O runner do primeiro admite no próprio comentário: "hoje é puramente local/fallback".

Labels `Incluso`/`Beta`/`API parceira`/`Em breve` (`ShortcutTier`) são puramente visuais — sem gate de permissão/tier por trás — e **só aparecem quando `role==='codify' && sector==='os1'`**, ou seja, nunca visíveis a um cliente real. Um atalho marcado "Em breve" ainda executa normalmente se clicado (o rótulo não bloqueia nada tecnicamente).

**`server/shortcuts.py`** é, na prática, um motor de marketplace real: ranking multi-critério (preço, reputação, qualidade, disponibilidade etc.) + regra ética explícita (patrocínio não compra o rótulo "melhor escolha") + catálogo seed real de 12 fornecedores (Google Meu Negócio, WhatsApp Business, iFood Parceiros, Stone, RD Station etc.) + endpoint de registro de novo parceiro. **Achado crítico**: o frontend busca esse resultado real (`/api/shortcuts/para-card`) e **descarta explicitamente** tudo que não seja `kind: 'local'` antes de renderizar (`ChatPanel.tsx:917`) — o motor de marketplace real nunca chega ao usuário.

Não há iframe/embed de produto de terceiro dentro de card ou workspace em nenhum lugar do frontend.

**O marketplace existe de fato?** Parcialmente — infraestrutura backend real e não-trivial (ranking, regra ética, catálogo, endpoint de registro), mas zero consumo no produto: sem tela de catálogo, sem preço visível, sem contrato, sem ativação. É motor backend órfão + linguagem visual interna sem consumidor de produto.

**Vendável hoje**: o catálogo de ferramentas/atalhos locais (geração determinística de texto útil — checklists, planos, simulações). **Placeholder**: qualquer atalho que promete "ver fornecedores/parceiros próximos" — o template devolve critérios genéricos, não uma lista real. **Deveria ser escondido antes de mostrar a cliente/investidor**: a promessa implícita de "o sistema já indica fornecedores reais" nos atalhos de conexão, e o endpoint `/api/shortcuts/registrar` sem qualquer verificação de identidade de parceiro.

---

## 15. Auth, permissões e persistência

**Autenticação**: JWT real (HS256, expiração 72h, `server/auth.py:395`), mas com **dois riscos de segurança concretos e verificados**: (1) `decode_token` aceita **qualquer token começando com `"simple."` ou `"demo."` sem verificar assinatura ou expiração** (`auth.py:406-409`) — um "token mágico" sempre válido; (2) a `SECRET_KEY` tem um default hardcoded no repositório (`"os1-secret-key-change-in-production-2026"`) usado se a env `JWT_SECRET` não estiver definida — não confirmado se está de fato configurada em produção.

**Papéis**: `os1_role` (localStorage) é só de exibição/UI, sem força de segurança — trocável livremente pelo cliente. A autorização real vive em `memberships` (`role`+`access_scope`), validada no backend rota a rota (`_assert_membership`/`_require_user`, reimplementado de forma duplicada em cada router — não há camada central de authz, risco de uma rota nova esquecer a checagem).

**Sessão**: 100% `localStorage`, sem cookie HttpOnly. Chaves confirmadas: `os1_token`, `os1_org_id`, `os1_bu_id`, `os1_role`, `os1_negocio_id`, `os1_consent`, `os1_theme`/`theme` (duplicadas), `difficulty`, `photo_settings_${profileId}`, chaves de onboarding, navegação e uploads namespaced por org/bu/setor/perfil.

**Persistência de blocos**: confirmado — SQLite (`server/auth.db`), upsert por `(org_id, bu_id, card_id, endpoint, sub_key)`, só o último resultado por combinação sobrevive; cards sintéticos (`synth-`/`browser-`/`map-`/`ontology-`) são explicitamente excluídos da persistência.

**Isolamento de dados**: real — schema `organizations`/`business_units`/`memberships`, validado server-side (`_resolve_scope` em `feed_codify.py` retorna 404 sem confirmar existência do recurso se o usuário não tiver membership). Um segundo banco (Postgres+pgvector, `omni/database/`) existe só para o subsistema de QR/fidelidade, desconectado do mundo de auth/organizações.

**Risco de vazamento entre perfis**: mitigado no caminho principal — trocar de "setor" na UI não altera `os1_org_id`/`os1_bu_id` da sessão real; o backend valida membership antes de retornar qualquer card real. Todos os usuários demo (exceto a loja piloto Oscar) têm membership em `org-mcdonalds-brasil` por design de demo compartilhada, não vazamento acidental. **Não confirmado**: se todas as rotas (não só as auditadas) aplicam a mesma checagem de forma consistente — recomenda-se teste manual.

**Risco de estado antigo**: logout não revoga o JWT no servidor (sem blacklist — token continua válido até expirar); `clearAuthState()` não limpa chaves namespaced por perfil (fotos, uploads, configurações), o que pode vazar dado residual entre usuários que compartilham dispositivo (cenário plausível em tablet de loja/demo).

**Suficiência**: para demo controlada — aceitável, com ressalvas. Para cliente pagante — insuficiente: falta eliminar o backdoor `demo.`/`simple.`, forçar `JWT_SECRET` obrigatório, revogação de sessão, cookies HttpOnly, rate limiting de login, camada central de authz, limpeza completa de localStorage no logout, e decidir se SQLite (`server/auth.db`) tem volume persistente garantido em produção.

---

## 16. Build, testes, lint e smoke

Comandos rodados nesta auditoria (todos read-only/build, sem commit/push/deploy):

| Comando | Resultado |
|---|---|
| `npm run lint` (`tsc --noEmit`, frontend) | **PASS**, zero erros |
| `npm run build` (`vite build`, frontend) | **PASS** em 280ms — aviso: chunk único de 2,66MB (805KB gzip), sem code-splitting |
| `python3 -m pytest` (backend, coleção em massa) | **Falha de coleção** — `test_authz.py` chama `sys.exit()` em nível de módulo; os arquivos `test_*.py` do backend são scripts standalone (`python3 test_X.py`), não uma suíte pytest tradicional |
| `python3 test_*.py` individualmente (16 arquivos rodados) | 14 arquivos **100% PASS** (totalizando 500+ casos): `test_authz` (22), `test_benchmark` (40), `test_cards` (31), `test_experience` (55), `test_intelligence` (43), `test_missions` (39), `test_navegacao` (28), `test_orchestrator` (46), `test_organizations` (35), `test_recommendation` (36), `test_roles_extras` (55), `test_scoring` (48), `test_shortcuts` (43), `test_signals` (40), `test_workspace_blocks` (10), `test_workspace` (15) |
| `test_codify_api.py` | **1 falha real** (34 testes): `test_33_user_with_membership_accesses_feed` — esperava ≥1 card, recebeu 0 |
| `test_feed_codify.py` | **3 falhas reais** (13 testes): `test_03_valid_bearer_returns_user_cards`, `test_05_isolation_user_b_does_not_see_org_a`, `test_06_metadata_returned` — card inserido não é encontrado por ID na consulta subsequente |
| `test_auth.py` | Falha por dependência de infraestrutura — exige servidor rodando em `localhost:3002` (não estava ativo nesta auditoria), não é bug de código |
| `test_qr.py` | Falha por dependência de infraestrutura — exige PostgreSQL em `127.0.0.1:6432` (não confirmado se ativo em produção); subsistema já desconectado do restante do produto |

**Achado que merece investigação (não corrigido, apenas documentado)**: as falhas de `test_codify_api.py` e `test_feed_codify.py` **não são de infraestrutura** (ambos os arquivos declaram explicitamente "roda in-process via TestClient, não exige servidor rodando") — são falhas reais e reprodutíveis de busca/isolamento de card por ID, no mesmo router (`/api/feed/codify`, `/api/codify/v0/*`) que é a via mais madura de ingestão de dado real no produto. Antes de qualquer demonstração que dependa dessa API, vale investigar a causa raiz.

**Dependências ausentes confirmadas**: pacote `anthropic` não está em `omni/requirements.txt` nem `omni/server/requirements.txt` (ver Seção 7). **CI/CD**: `.github/workflows/electron-release.yml` só builda/publica o instalador desktop quando uma tag `v*` é criada — não há pipeline de lint/test/typecheck automatizado em push/PR. **Deploy**: `vercel.json` do frontend reescreve `/api/*` para `https://omni-production-32d3.up.railway.app`; GitHub não aciona deploy automaticamente (confirmado por memória de projeto — deploy é sempre manual via `vercel --prod`).

---

## 17. O que é vendável agora

- Fluxo Feed → Área de Trabalho (chat) com os 4 intents (Analisar/Entender/Aprender/Compartilhar) para cards reais, com geração real de conteúdo via `/api/workspace/*` (Anthropic real, fallback silencioso decente).
- Governança de cards (Aprovar/Rejeitar/Distribuir) — real, ponta a ponta.
- Mapa competitivo (Leaflet) como demonstração de UX e cálculo geográfico real, com a ressalva honesta de que os dados são fixture.
- Catálogo de ferramentas/atalhos do workspace (geração determinística de checklists, planos, simulações) — útil mesmo não sendo IA generativa.
- Perfil Pacheco/Farmácia como o mais coerente tecnicamente (única fonte real associada, setas de direção sinalizadas).
- Motor de scrapers do backend (CNPJ, Google Maps, Reclame Aqui, Instagram, clima) — real e funcional, ainda que não conectado à experiência do usuário hoje.

## 18. O que é piloto guiado

- Perfil Oscar/nike via a conta de loja piloto (`oscar-piloto-01`), com acompanhamento explicando que a conta "matriz" padrão está incompleta.
- Score OS¹ para orgs sem integração real (Oscar/Pacheco/Império) — precisa de enquadramento claro de que o conteúdo é ilustrativo.
- Navegador embutido como capturador de sinal — funciona, mas só no Electron, e precisa de curadoria humana no momento (heurística simples, sem LLM).
- Mapa competitivo como "prova de conceito" de módulo territorial — vendável como piloto se o cliente entender que dados reais de concorrentes ainda dependem de uma fonte a conectar.

## 19. O que é fundação técnica

- Padrão `SourceConnector`/`SOURCE_REGISTRY` (frontend) e `BaseCollector`/`orchestrator` (backend) — pontos de plugagem prontos, mas com só 1 e ~7 implementações reais respectivamente, desconectados entre si.
- Tipos e registro de relações (`core/relations/*`) — desenho pronto, zero geração real.
- `AnalysisType` / 10 módulos de análise — enum e UI travada, zero lógica diferenciada.
- Motor de marketplace de fornecedores (`server/shortcuts.py`) — real no backend, sem consumo no frontend.
- `ProductVersion`/registry de produto — parcialmente ligado (campos reais: `feedKey`, `analysisTypes`, `arrowsUnlocked`; campos mortos: `blocksStoreSwitcher`, `realOrgId`/`realUnitId`, `badge`, `format`).
- `useFeedState.ts` — hook pronto, não usado ("Fase 17").

## 20. O que é visão (não vendável, não deve ser prometido)

- Motor de setas geradas por LLM sob demanda (Camada A/B/C) — hoje é fixture estático, não geração real.
- 9 dos 10 módulos de análise além da Descritiva/CMED — puro rótulo de roadmap.
- Marketplace de parceiros como produto (catálogo navegável, preço, contrato, ativação) — hoje é infraestrutura backend órfã.
- API parceira / Beta / tiers de monetização — labels sem gate técnico por trás.
- Esfera Ontológica como ponto de entrada de produto — componente pronto mas deliberadamente desligado.
- Google Maps ativo — bloqueado por billing, não por decisão técnica definitiva.

---

## 21. Problemas encontrados

1. **Backdoor de autenticação**: `decode_token` aceita qualquer token `simple.`/`demo.` sem verificação (`server/auth.py:406-409`).
2. **Secret key default hardcoded** no repositório, usada se `JWT_SECRET` não estiver configurada.
3. **`anthropic` ausente de todos os `requirements.txt`** do backend — risco de queda silenciosa para fallback determinístico em produção.
4. **Marketplace de fornecedores real (backend) descartado no frontend** antes de renderizar (`ChatPanel.tsx:917`) — trabalho real não chega ao usuário.
5. **Falhas reais e reprodutíveis** em `test_codify_api.py` (1) e `test_feed_codify.py` (3) — busca de card por ID falhando no router mais maduro de ingestão de dado real.
6. **Rótulos de módulo de análise (`analysisTypes`) inconsistentes com o conteúdo real** dos feeds (McDonald's "preditiva" sem menção a "predit"; Pacheco com "descritiva/diagnóstica" mas conteúdo preditivo).
7. **Perfil Oscar/nike (fluxo padrão) incompleto** — só 7 de 12 departamentos, enquanto o conteúdo completo existe atrás de um login separado não usado no fluxo comercial padrão.
8. **Cervejaria Império sem organização real conectada** e switcher de loja/distribuidora que abre conteúdo idêntico ao da matriz — perceptível em demo.
9. **Google Maps permanentemente desativado** por flag `FORCE_LEAFLET`, dependente de billing do Google Cloud não habilitado.
10. **Logout incompleto**: não revoga JWT no servidor, não limpa chaves de localStorage namespaced por perfil — risco em dispositivo compartilhado.
11. **Código morto extenso e não removido**: `WorkspacePanel.tsx`, `GridItem.tsx`, `CreateMissionModal.tsx`, `StatInfoModal`, `EmpresaModal`, `SettingsModal`(dificuldade), `BottomModal` (Salvos/Evolução), `StoryViewer`, dependências npm (`@google/genai`, `react-leaflet`, `epoxy-transport`, `scramjet-controller`).
12. **Autorização duplicada por rota** no backend (`_assert_membership`/`_require_user` reimplementado em cada router) em vez de camada central — risco de uma rota nova esquecer a checagem.
13. **CI/CD só cobre build/release do Electron** — sem pipeline automatizado de lint/test em push/PR.

---

## 22. Riscos

- **Segurança**: backdoor de token + secret default (Seção 15/21) — o mais grave tecnicamente, deve ser tratado antes de qualquer cliente pagante.
- **Credibilidade de produto**: badges de formato/módulo sem lastro consistente no conteúdo; textos de mapa/concorrentes parecendo dado real; perfis demo incompletos alcançáveis por qualquer clique exploratório de um prospect.
- **Confiabilidade em produção**: dependência LLM ausente do requirements.txt pode causar degradação silenciosa; SQLite sem confirmação de volume persistente.
- **Dívida técnica**: volume de código morto/inatingível aumenta o custo de manutenção e o risco de um desenvolvedor futuro reativar algo por engano (ex.: um modal órfão) sem entender que foi deliberadamente substituído.
- **Motor de setas**: se ligado sem UI de candidata/validação e sem gate para domínios sensíveis, risco de apresentar hipótese de LLM como fato ao usuário.
- **Legal/licença**: scraping direto de Google Maps/Search/Instagram/Reclame Aqui no backend, sem camada comercial intermediária, enquanto o frontend já sinaliza cautela jurídica para essas mesmas categorias de fonte.

---

## 23. Próximos passos recomendados

**Próximas 24-48h**
- Confirmar (não corrigir sem decisão) se o backdoor `demo.`/`simple.` em `decode_token` é intencional para o ambiente de demo atual; se não for, é o item de maior prioridade de segurança.
- Confirmar se `JWT_SECRET` está de fato configurada em produção (Railway).
- Confirmar se `anthropic` está instalado em produção por algum outro meio (fora de `requirements.txt`) — testar um endpoint real de `/api/workspace/pesquisar` em produção e verificar se a resposta tem `"fallback": true`.
- Investigar a causa das falhas em `test_codify_api.py`/`test_feed_codify.py` antes de qualquer demo que dependa de `/api/feed/codify`.
- Decidir o roteiro de demo do Oscar (loja piloto vs. matriz) para não expor departamentos vazios a um prospect.

**Próxima semana**
- Decidir se o resultado real de `/api/shortcuts/para-card` deve voltar a ser renderizado no `ChatPanel`, ou se o motor de marketplace do backend fica pausado por ora.
- Reconciliar `blocksStoreSwitcher`/`realOrgId`/`realUnitId` do registry com os guards reais hardcoded em `App.tsx` (ou aceitar formalmente que o registry ainda não é fonte única de verdade).
- Limpar/remover ou isolar claramente o código morto listado na Seção 21, item 11, para reduzir risco de reativação acidental.
- Decidir sobre Google Maps: billing habilitado ou compromisso definitivo com Leaflet/OSM.

**Próxima grande atualização**
- Ligar a Camada A do motor de setas (LLM real sobre "termos acesos", com UI de candidata/validação) — ver caminho técnico na Seção 12.
- Conectar pelo menos 1 mineradora real do backend (CNPJ ou Google Maps) à experiência do usuário via `codify_api.py`, substituindo fixture por dado vivo em pelo menos um perfil.
- Definir e implementar o primeiro módulo de análise realmente diferenciado (Descritiva/CMED é o candidato mais avançado) ponta a ponta, incluindo modelo de cobrança.

---

## 24. Decisões pendentes para o CEO

- Prioridade de segurança: remover o backdoor de autenticação e o secret default antes ou depois do próximo pitch a cliente pagante?
- Google Maps: vale o custo de billing do Google Cloud, ou o produto assume Leaflet/OpenStreetMap como escolha definitiva?
- Marketplace de fornecedores: reativar o consumo do motor real do backend no frontend agora, ou manter pausado até haver modelo de comissão/contrato definido?
- Rota de demo comercial: usar a conta de loja piloto do Oscar (mais completa, mas fora do fluxo padrão) ou investir em completar os 5 departamentos faltantes da conta matriz?
- Licenciamento de fonte de dado: formalizar (ou suspender) o uso de scraping direto de Google Maps/Search/Instagram/Reclame Aqui no backend antes de expandir a coleta.
- Motor de setas: aprovar o primeiro experimento real de geração por LLM (Camada A) com escopo restrito a 1 vertical (farmácia), ou manter só fixture até haver mais validação manual?
- Escada Horizontal→Vertical: os rótulos atuais de `analysisTypes` por perfil devem ser revisados para refletir o conteúdo real, já que hoje parecem arbitrários?

---

## 25. Apêndice — arquivos principais auditados

**Frontend** (`your-github-space`): `src/App.tsx`, `src/components/{FeedComponents,SectorFeed,SectorSwitcher,WorkspacePanel,WorkspaceTools,GridItem,DesktopView,ChatPanel,BottomModal,StoryViewer,TimelineComponents,BrowserView,NoBrowserAccess}.tsx`, `src/components/maps/*`, `src/features/{feed,workspace,browser,map,ontology,profiles,auth,governance,missions,modals,onboarding,score}/*`, `src/core/{product,relations,adapters,events,storage,types}/*`, `src/data/{sector-feeds/*,demo-feed-cards,cmed-fixture,intelligence-inputs,intelligence-signals,roleMocks,vertical-packages}.ts`, `src/hooks/{useAuth,useFeed,useDarkMode}.ts`, `src/lib/{browser-actions,map-actions,onboarding,ontology-diagnostics,workspace-tools}.ts`, `src/config/{googleMaps,roleConfig}.ts`, `api/{proxy,tracker}.ts`, `electron/`, `wisp-server/`, `package.json`, `vercel.json`, `.github/workflows/electron-release.yml`.

**Backend** (`omni`): `server/{auth,authz,organizations,workspace,workspace_blocks_db,workspace_fallback,cards,feed_codify,codify_api,classifier,shortcuts,governance,missions,intelligence,signals,scoring,recommendation,benchmark_engine,experience,roles_extras,qr_router,server}.py` e respectivos `test_*.py`, `agents/{base_agent,pipeline,agent_1..9}.py`, `router/{router,providers,caller,paperclip_integration}.py`, `ontology/{schema,loader,validator}.py` + `industries/*.json` + `universal/*.json`, `external/{orchestrator,collectors/*,feed_generator,signal_detector,diff_engine,gap_engine,entity_types,shortcut_db}.py`, `scrapers/{base_scraper,cnpj,google_maps,google_search,reclame_aqui,instagram,clima,fornecedores}.py`, `etl/{pipeline,limpeza,embeddings,db_writer}.py`, `tools/motor_v0/*`, `database/schema.sql`, `requirements.txt`, `server/requirements.txt`.

**Comandos executados**: `npm run lint`, `npm run build`, `python3 -m pytest -q` (falhou na coleta), `python3 test_*.py` (16 arquivos, individualmente), `grep -i anthropic requirements.txt`, inspeção de `.github/workflows/`.


