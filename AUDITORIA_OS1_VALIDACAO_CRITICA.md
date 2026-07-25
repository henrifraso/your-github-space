# Auditoria de Validação Crítica — OS¹

Auditoria complementar, somente leitura. Objetivo: verificar com evidência direta os achados críticos de `AUDITORIA_OS1_ESTADO_ATUAL.md` antes de qualquer pitch para cliente pago ou investidor. Nenhum código foi alterado, nenhuma dependência instalada, nenhum commit/push/deploy realizado.

---

## 1. Resumo executivo

O relatório anterior é, em sua grande maioria, **tecnicamente confiável** — os achados sobre LLM/fallback, governança, isolamento por membership, scrapers reais, motor de setas fixture, marketplace descartado no frontend e módulos de análise só-rótulo foram **todos confirmados** com evidência direta de arquivo/linha nesta rodada.

Duas correções importantes emergiram desta validação:

1. **O achado sobre o perfil Oscar/nike estava parcialmente ERRADO.** O relatório anterior disse que o fluxo padrão do Oscar mostra só 7 de 12 departamentos porque lê `nike.ts`. Na verdade, `src/data/sector-feeds/index.ts:26` mapeia a chave `nike` diretamente para `OSCAR_LOJA1_SECTOR_FEEDS` — o arquivo rico de 1956 linhas com os 12 departamentos completos (240 cards, exatamente 12×20). O arquivo `nike.ts` **é importado no `index.ts` mas nunca usado no mapa real** (`PROFILE_SECTOR_FEEDS`) — é código morto, não o conteúdo servido ao usuário. Ou seja, o perfil Oscar no fluxo padrão **já mostra o conteúdo completo**, ao contrário do que o primeiro relatório concluiu.

2. **A causa raiz das falhas em `test_codify_api.py`/`test_feed_codify.py` foi identificada com precisão**: cards criados via `POST /api/codify/v0/cards` (a API de ingestão "real") só ficam visíveis para usuários não-matriz em `/api/feed/codify` se existir uma linha correspondente em `codify_card_distributions` — tabela que só é escrita pelo endpoint de Governança (`POST /api/governance/cards/{id}/distribute`, `governance.py:279`). Os testes criam o card mas nunca chamam o endpoint de distribuição, então a leitura retorna vazio. **Não está confirmado se isso é um defeito do teste (faltou o passo de distribuição) ou uma lacuna real de produto (ingestão deveria auto-distribuir para a própria unidade em alguns casos)** — ver Seção 11 para a análise completa. De qualquer forma, é uma falha real e reproduzível, não de infraestrutura.

Confirmado e agravado nesta rodada: o mecanismo de fallback do LLM em `/api/workspace/{pesquisar,executar,aprender,simular}` (`server/workspace.py`) **não tem nenhuma flag distintiva** quando o LLM falha por chamada individual — ao contrário do fallback de módulo inteiro (`workspace_fallback.py`, que grava `"fallback": true` explicitamente), o fallback por-chamada (`_llm()` → `_call_llm()` → exceção → `"{}"` → `.setdefault(...)`) devolve um JSON com aparência normal, indistinguível de uma resposta real do LLM. O campo `used_llm` em `AgentResult` existe mas **nunca é setado como `True` em lugar nenhum do código** — é telemetria morta.

Confirmado o backdoor de autenticação, com um detalhe mais grave do que o relatório anterior registrou: no sistema legado de `negocios` (usado por pelo menos 18 endpoints em `server/server.py`), o "usuário" sintético `demo-user` (obtido com qualquer token começando em `demo.`/`simple.`, sem verificação alguma) tem acesso de leitura a **todos** os registros da tabela `negocios`, sem filtro de tenant (`auth.py:515-516`), e satisfaz automaticamente a checagem de consentimento LGPD (`auth.py:578-579`, sempre `True`).

---

## 2. O que foi confirmado do relatório anterior

| # | Item | Classificação |
|---|---|---|
| 1 | `/api/workspace/{pesquisar,executar,aprender,simular,estender}` usam Anthropic real quando disponível | **Confirmado** — `server/workspace.py:33-36` (`_llm()`) → `agents/base_agent.py:69-98` (`_call_llm`, `anthropic.Anthropic(...)`, `claude-haiku-4-5-20251001`/`claude-sonnet-4-6`) |
| 2 | Existe fallback local quando Anthropic falha/não está instalado | **Confirmado, com nuance importante** — dois mecanismos distintos, só um deles com flag explícita (ver Seção 4) |
| 3 | `anthropic` ausente de todos os `requirements.txt` | **Confirmado** — `grep -i anthropic requirements.txt server/requirements.txt` → nenhuma ocorrência em nenhum dos dois arquivos (confirmado nesta rodada com comando direto) |
| 4 | O fallback pode mascarar falta de LLM real em produção | **Confirmado e mais grave do que descrito** — o fallback por-chamada não tem nenhum campo de resposta que o distinga de uma saída real (ver Seção 4) |
| 5 | Governança (aprovar/rejeitar/distribuir) é backend real ponta a ponta | **Confirmado** — `server/governance.py:112,163,213` são rotas reais com `UPDATE`/`INSERT` no SQLite, sem LLM envolvido |
| 6 | Isolamento por organização/membership validado no servidor | **Confirmado** — `feed_codify.py:77-141` (`_resolve_scope`, `has_matrix_membership`, `_user_units_in_org`) aplica filtro real por SQL, não apenas por conveniência do cliente |
| 7 | Scrapers de CNPJ, Google Maps, Reclame Aqui, Instagram e clima existem e são funcionais | **Confirmado** — código presente e outputs reais persistidos em `scrapers/output/{cnpj,google_maps,clima,instagram,google_search,fornecedores}.json` (arquivos de 30/mar, com dado real capturado, não vazios) |
| 8 | Motor de setas/ontologia ainda é fixture estático | **Confirmado** — `relation-generator.ts` filtra array hardcoded; `ChatPanel.tsx:586` tem `onClick={() => {}}` (no-op) |
| 9 | `generateCandidateRelations()` existe mas não é chamado fora de `core/relations` | **Confirmado** — `grep -rn "generateCandidateRelations" src/` só retorna a própria definição |
| 10 | Marketplace real do backend existe mas é descartado no frontend | **Confirmado** — `ChatPanel.tsx:917` (`if (s.kind !== 'local') return null;`), enquanto `server/shortcuts.py` + `server/server.py:1596,1617,1632` são endpoints reais e funcionais |
| 11 | 9 dos 10 módulos de análise são só rótulo | **Confirmado** — `CompanySettingsModal.tsx:404-419` renderiza os 10 com `cursor-not-allowed`/`title="Em breve"`, sem `onClick`; `IntelligenceCard` (`src/components/WorkspacePanel.tsx`, `src/core/types/card.ts`) **não tem campo `analysisType`** (confirmado por grep, zero ocorrências) |
| 12 | Existem falhas reais em `test_codify_api.py` e `test_feed_codify.py` | **Confirmado, com causa raiz agora identificada** — ver Seção 11 |
| 13 | Backdoor de autenticação `demo.*`/`simple.*` | **Confirmado e mais grave** — `auth.py:406-409`, com efeito de bypass total de tenant no sistema legado de `negocios` (ver Seção 5) |
| 14 | Secret key default hardcoded | **Confirmado** — `auth.py:27`, `SECRET_KEY = os.environ.get("JWT_SECRET", "os1-secret-key-change-in-production-2026")`; nenhum `.env.example` do repo documenta `JWT_SECRET` (verificado: só existem `.env.example` na raiz e em `web/`, nenhum menciona essa variável) |
| 15 | Oscar no fluxo padrão tem departamentos vazios | **Refutado** — ver Seção 3 |
| 16 | Império sem organização real e/ou switcher abre conteúdo idêntico | **Confirmado** — `product-registry.ts:62-73` não tem `realOrgId`/`realUnitId` para o produto `imperio`; `sector-feeds/index.ts:28-29` mapeia `cerveja-imperio` e `cerveja-imperio-distribuidora-01` para o **mesmo objeto** `CERVEJA_IMPERIO_SECTOR_FEEDS` |
| 17 | Mapa/concorrentes usam texto escrito à mão que pode parecer coleta ao vivo | **Confirmado** — `FORCE_LEAFLET = true` hardcoded (`CompetitiveMap.tsx:62`), coordenadas em arrays fixos pareados por índice (`map-ui-utils.ts`, `useMapAnalysis.ts:51`) |

---

## 3. O que foi refutado ou ficou incerto

**Refutado — Perfil Oscar/nike no fluxo padrão**: o relatório anterior (Seção 8 do documento original) afirmou que "Oscar/nike (fluxo padrão) só tem 7 de 12 departamentos populados... `sector-feeds/nike.ts:408-412`". Reconferido nesta rodada:

- `src/data/sector-feeds/index.ts:26`: `nike: OSCAR_LOJA1_SECTOR_FEEDS` — a chave usada em runtime (`feedKey` do produto Oscar em `product-registry.ts` é `'nike'`) aponta para `oscar-loja1.ts`, não para `nike.ts`.
- `src/App.tsx:1568`: `feeds={PROFILE_SECTOR_FEEDS[feedKey] ?? PROFILE_SECTOR_FEEDS['mcdonalds']}` — confirma que é essa chave que alimenta o componente de feed setorial exibido ao usuário.
- `oscar-loja1.ts` tem os 12 departamentos (`marketing, vendas, financeiro, operacoes, rh, estoque, juridico, administrativo, comercial, compras, ti, atendimento`) com 240 ocorrências de `title:` — exatamente 12×20 cards.
- `nike.ts` (413 linhas, 42 ocorrências de `title:`) é importado em `index.ts:6` mas **`NIKE_SECTOR_FEEDS` nunca aparece no objeto `PROFILE_SECTOR_FEEDS`** — confirmado por grep, zero uso fora da própria definição e do import não utilizado.

**Conclusão**: o perfil Oscar, no fluxo padrão (conta "matriz", chave `nike`), **já exibe os 12 departamentos completos**. O arquivo incompleto (`nike.ts`) é código morto, não o dado servido. Isso muda a recomendação de pitch do relatório anterior — não é necessário usar a conta de loja piloto (`oscar-piloto-01`) para mostrar conteúdo completo do Oscar; a conta padrão já serve o mesmo arquivo rico.

**Ficou incerto**: se a distinção entre "bug de teste" e "lacuna de produto" nas falhas de `test_codify_api.py`/`test_feed_codify.py` foi resolvida na direção do produto (ingestão deveria auto-distribuir?) ou é comportamento intencional (checagem de governança tem que ser manual antes de ir ao ar). Não há documentação no repo que resolva essa ambiguidade — ver Seção 11.

**Não confirmado** (fora do escopo verificável só com leitura de código): se `JWT_SECRET` está de fato configurada como variável de ambiente no Railway de produção hoje; se `ANTHROPIC_API_KEY` e o pacote `anthropic` estão de fato disponíveis no ambiente de produção (só confirmamos que o pacote está instalado *localmente* neste Mac via pip, não que esteja no ambiente de deploy); se todas as rotas do backend (além das auditadas) aplicam a mesma checagem de escopo de forma consistente.

---

## 4. LLM/Anthropic/fallback

**Onde é importado**: `agents/base_agent.py:70` (`import anthropic`, dentro do `try` de `_call_llm`) e `server/classifier.py:137` (`import anthropic  # type: ignore`, mesmo padrão). Import local à função, não no topo do módulo — por isso uma ausência do pacote só quebra na hora da chamada, não no boot do servidor.

**Onde o client é criado**: `agents/base_agent.py:72-74` (`anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY", ""))`) e `server/classifier.py:138` (idêntico). Em ambos, se a env var não existir, o client é criado com `api_key=""` — a falha só ocorre na chamada de rede (`401` da API Anthropic), não na criação do client.

**Variável de ambiente exigida**: `ANTHROPIC_API_KEY`. Não documentada em nenhum `.env.example` do backend voltado ao `server/` (só aparece em `.env.example` da raiz, que é do `router/`/`tools/motor_v0`, módulos desconectados do servidor principal — ver relatório anterior).

**Quando a env não existe**: `client.messages.create(...)` lança exceção de autenticação da SDK Anthropic → capturada pelo `except Exception` genérico em `base_agent.py:100-102` → log de warning (`log.warning("[%s] LLM falhou: %s", ...)`) → retorno `"{}"`.

**Quando o pacote `anthropic` não está instalado**: `import anthropic` (linha 70) lança `ModuleNotFoundError`, capturada pelo mesmo `except Exception` — comportamento idêntico ao caso de env ausente: log de warning + `"{}"`. Do ponto de vista do chamador, os dois cenários (sem pacote, sem chave, erro de rede, rate limit, timeout) são **indistinguíveis** — todos caem no mesmo `except Exception` genérico.

**O fallback é explícito ou silencioso? Dois mecanismos diferentes coexistem**:

1. **Fallback de módulo inteiro** (`server/workspace_fallback.py`): ativado quando o import do pacote `external` falha inteiro (`_EXT_OK=False`, conforme `server/server.py`). Este é **explícito** — cada resposta inclui `"fallback": True` (`workspace_fallback.py:77,129,166,220,253,302`) e um log `log.info(f"[fallback] ... — {_REASON}")`.
2. **Fallback por chamada individual** (dentro de `server/workspace.py`, função `_llm()` linha 33-36): ativado quando `_call_llm()` falha por qualquer motivo (pacote ausente, chave ausente, erro de rede, timeout, resposta não-JSON). Este é **silencioso** — `_call_llm` retorna `"{}"`, `_extract_json` devolve `{}`, e cada função de ação preenche campos padrão com `.setdefault(...)` (`workspace.py:58` — `pontos_chave: [_placeholder(card)]`; linha 129 — `conceito: "O domínio de X é central..."`; linha 152 — `cenarios: []`) **sem nenhum campo indicando que a origem não foi o LLM**. Confirmado lendo `workspace.py:29-153` diretamente — nenhuma dessas 5 funções (`pesquisar`, `executar`, `aprender`, `simular`, `estender`) grava `fallback`/`used_llm`/qualquer flag equivalente na resposta.

**O usuário consegue perceber se veio LLM real ou fallback?** Não, para o fallback por-chamada (mecanismo 2, o mais provável de ocorrer em produção se a chave/pacote tiver problema pontual). Sim, tecnicamente, para o fallback de módulo inteiro (mecanismo 1) — mas só se o frontend checar o campo `"fallback"` na resposta, o que **não foi encontrado em nenhum componente do frontend** (`grep -rn "\.fallback\b" src/` não retorna checagem desse campo em `ChatPanel.tsx` ou `action-executor.ts`) — ou seja, mesmo quando o backend sinaliza fallback explicitamente, o frontend não exibe essa informação ao usuário.

**Risco confirmado em produção**: sim — se `ANTHROPIC_API_KEY` estiver ausente/inválida ou o pacote `anthropic` não estiver instalado no ambiente Railway, os 5 endpoints de workspace continuam respondendo `200 OK` com conteúdo genérico baseado em `.setdefault()`, sem qualquer sinal de degradação. Um cliente pagante ou investidor testando a ferramenta ao vivo veria respostas curtas/genéricas e não teria como saber se é "o produto funcionando com pouca informação" ou "o LLM não está rodando".

**Telemetria morta confirmada**: `AgentResult.used_llm` (`base_agent.py:31`) é declarado com default `False` e **nunca é setado como `True`** em `run()` (linhas 39-49) nem em nenhum outro lugar do repositório (`grep -rn "used_llm\s*=" --include="*.py" .` só retorna a própria declaração). `agents/pipeline.py:89` lê `result.used_llm` para telemetria do pipeline completo, mas como o valor é sempre `False`, essa telemetria nunca reflete a realidade — mais um sinal ausente de "LLM real vs. fallback".

**Requirements que precisam incluir `anthropic`**: `omni/requirements.txt` e/ou `omni/server/requirements.txt` — nenhum dos dois lista o pacote hoje (confirmado por `grep -i anthropic` em ambos, sem resultado). Como o backend real roda a partir de `server/` (conforme `Procfile`/deploy documentado na auditoria anterior), `server/requirements.txt` é o mais crítico dos dois.

**Log claro de LLM real vs. fallback**: não existe, no sentido de um campo estruturado sempre presente e visível. O único log existe só no lado servidor (`log.warning`/`log.info`), não chega ao frontend nem a um dashboard de observabilidade (não confirmado se há agregação de logs em produção — Railway costuma expor logs brutos, não painéis).

---

## 5. Segurança/auth/secrets

**Onde está o backdoor**: `server/auth.py:406-409` — função `decode_token`:
```python
def decode_token(token: str) -> Optional[dict]:
    if token.startswith("simple.") or token.startswith("demo."):
        return {"sub": "demo-user", "email": "demo@os1.test"}
    ...
```
Qualquer string iniciada por esses dois prefixos autentica como `demo-user`, sem checar assinatura, expiração ou existência real do token.

**Funciona em dev, produção ou ambos?** Ambos — é um `if` incondicional no código-fonte, sem gate de ambiente (`if os.environ.get("ENV") == "dev"` ou equivalente não existe ali). Roda exatamente igual em qualquer ambiente que execute esse código.

**Está protegido por variável de ambiente?** Não. Não há nenhuma flag (`ALLOW_DEMO_TOKEN`, `DEBUG`, etc.) controlando essa checagem.

**Risco de credencial previsível**: sim e confirmado — qualquer requisição HTTP com header `Authorization: Bearer demo.qualquercoisa` ou `Authorization: Bearer simple.qualquercoisa` autentica com sucesso. Não é necessário conhecer nenhum segredo.

**Efeito prático confirmado nesta rodada** (não estava detalhado no relatório anterior): no sistema legado de negócios (`negocios`/`user_negocios`, usado por pelo menos 18 chamadas a `get_negocio_ativo` em `server/server.py`), o `demo-user`:
- `list_negocios()` (`auth.py:515-516`) retorna **todos** os registros da tabela `negocios`, sem filtro de tenant.
- `get_negocio_ativo()` (`auth.py:543-544`) retorna o primeiro registro da tabela, incondicionalmente.
- `select_negocio()` (`auth.py:528-529`) sempre retorna `True` sem alterar nada no banco.
- `has_consent()` (`auth.py:578-579`) sempre retorna `True` — bypassa a checagem de consentimento LGPD.

No sistema mais novo (`organizations`/`business_units`/`memberships`, usado por `feed_codify.py`, `workspace_blocks_db.py`, `organizations.py`), o `demo-user` **não tem membership** (não está na lista `_SEED` de `seed_handles()`), então `_resolve_scope`/`_assert_membership` deveriam rejeitá-lo com 404 — este caminho está mais protegido, mas não foi testado ao vivo nesta auditoria (não confirmado por execução, só por leitura de código).

**Onde está o secret default**: `server/auth.py:27` — `SECRET_KEY = os.environ.get("JWT_SECRET", "os1-secret-key-change-in-production-2026")`. Usado sempre que `JWT_SECRET` não estiver definida no ambiente.

**Diferença entre ambientes**: não confirmado diretamente (não há acesso às variáveis de ambiente reais do Railway/Vercel nesta auditoria). Circunstancialmente: nenhum `.env.example` do repositório documenta `JWT_SECRET` ou `AUTH_DB_PATH`, o que é um sinal de risco — não há lembrete formal para quem configura o deploy. Localmente (`omni/.env`), só existem chaves `DATABASE_*` (vazias) — sem `JWT_SECRET` nem `ANTHROPIC_API_KEY` no arquivo `.env` raiz (o `.env` do `server/` não existe como arquivo separado). Electron não lida com esses segredos — roda só o frontend, que fala com o backend via HTTPS.

**Outros segredos hardcoded**: busca ampla (`grep -rniE` por padrões de `api_key=`, `secret=`, `password=`, `token=` seguidos de valor literal) não encontrou outras chaves reais hardcoded — os únicos resultados foram nomes de variável de regex de redação (`server/privacy.py:66-68`, que são *padrões* de detecção de PII, não segredos) e o nome da env var em `codify_api.py:108`. **Nenhum outro segredo hardcoded confirmado.**

**Logs sensíveis**: não auditado em profundidade nesta rodada — `server/privacy.py` existe especificamente para redigir dados sensíveis de logs (`token=`, `api_key=`, `cpf=`, `cnpj=`, `password=`, `senha=`), o que sugere que o time já considerou esse risco; não confirmado se essa redação é de fato aplicada a todos os pontos de log ou só a alguns.

**Risco de demo vazar dados entre organizações**: no sistema novo (organizations/memberships), mitigado por `_resolve_scope` real. No sistema legado (negocios), o backdoor `demo-user` já vaza por design (lê tudo) — mas o impacto prático depende do que está na tabela `negocios` hoje (dados de demo/piloto, não confirmado se há dado de cliente real ali).

**O isolamento por membership compensa o backdoor?** Parcialmente. Compensa para as rotas migradas para o modelo organizations/memberships (a maioria das rotas de produto: feed, workspace, cards, governança). Não compensa para o sistema legado de negocios, que segue paralelo e é explicitamente bypassado pelo backdoor.

**Classificação de risco**:
| Risco | Classificação |
|---|---|
| Backdoor `demo.`/`simple.` sempre aceito | **Bloqueador antes de cliente pago** |
| Acesso irrestrito a `negocios` via `demo-user` | **Bloqueador antes de cliente pago** |
| Secret key default hardcoded | **Bloqueador antes de cliente pago** |
| Ausência de `JWT_SECRET`/`AUTH_DB_PATH` em `.env.example` | **Dívida técnica posterior** (mas facilita o risco acima) |
| Falta de rate limiting/lockout de login (não encontrado em `auth.py`) | **Precisa de aviso no pitch** / dívida técnica |
| Logs sensíveis (não aprofundado) | **Precisa de verificação adicional antes de classificar** |

---

## 6. Feeds e perfis

Mapeamento real (`src/data/sector-feeds/index.ts`), confirmado por leitura direta:

| Perfil | `feedKey`/chave real | Arquivo efetivamente servido | Departamentos populados | `title:` (proxy de nº de cards) |
|---|---|---|---|---|
| Pacheco/Farmácia | `nubank` | `nubank.ts` | 12/12 | 240 (12×20) |
| Oscar/Calçados | `nike` | **`oscar-loja1.ts`** (não `nike.ts`) | 12/12 | 240 (12×20) |
| McDonald's | `mcdonalds` | `mcdonalds.ts` | 12/12 | 240 (12×20) |
| Império/Cervejaria | `cerveja-imperio` | `cerveja-imperio.ts` | 12/12 | 240 (12×20) |
| (sub-perfil) Oscar loja piloto | `oscar-piloto-01` | `oscar-loja1.ts` (mesmo arquivo do perfil matriz) | 12/12 | 240 |
| (sub-perfil) Pacheco loja | `pacheco-loja-01` | `pacheco-loja1.ts` | parcial | 18 |
| (sub-perfil) Império distribuidora | `cerveja-imperio-distribuidora-01` | `cerveja-imperio.ts` (**mesmo objeto** do perfil matriz) | 12/12 | 240 (idêntico à matriz) |

**Correções em relação ao relatório anterior**:
- Oscar **não** lê `nike.ts` no fluxo padrão — lê `oscar-loja1.ts` através da chave `nike`. `nike.ts` é importado em `index.ts:6` mas nunca referenciado no objeto `PROFILE_SECTOR_FEEDS` — é código morto.
- `pacheco-loja1.ts` **não é arquivo morto** — é servido de fato para a chave `pacheco-loja-01` (sub-perfil de loja), com conteúdo parcial (18 `title:`, bem menos que os 240 dos perfis matriz).
- `nike.ts` **é** arquivo morto, confirmado.

**Fluxo padrão abre no feed geral ou no setorial?** Abre no **feed geral** (`activeDepartment` inicial é `'geral'`, ver Seção 7) — o feed setorial rico (`PROFILE_SECTOR_FEEDS`) só aparece quando o usuário navega para um departamento específico (`activeDepartment !== 'geral'`). Ou seja, o conteúdo rico dos 4 perfis existe e está corretamente mapeado, mas **não é a primeira coisa que o usuário vê** — a primeira tela é o feed geral (Seção 7).

**`demo-feed-cards.ts` ainda é usado na primeira tela?** Sim — `App.tsx:1728`: `const base = activeSector === 'os1' ? [] : (DEMO_FEED_CARDS[feedKey] ?? [])`, dentro do bloco do feed geral (que é a primeira tela para qualquer perfil que não seja `os1`). Contém 5 cards sintéticos por empresa (`_synthetic: true`), redigidos à mão.

**Fontes proibidas em `demo-feed-cards.ts` ou nos 4 arquivos novos?** Busca por termos internos da Codify (`ARR`, `runway`, `créditos de API`, `burn rate`, `MRR`) nos 5 arquivos (`nubank.ts`, `oscar-loja1.ts`, `mcdonalds.ts`, `cerveja-imperio.ts`, `demo-feed-cards.ts`) retornou apenas falsos positivos de substring (palavras como "narrativa", "Carrefour" contêm a sequência de letras "arr" mas não o termo). **Nenhum dado interno da Codify (ARR, runway, etc.) vazou para os perfis client-facing.** Busca por URLs hardcoded (`https?://...`) nesses 5 arquivos não retornou nenhuma ocorrência — as citações de fonte são texto (`"Fonte: CMED/ANVISA..."`), não links reais, o que é consistente com o fato de serem fixture redigido à mão, não dado coletado.

**Dado interno indevido nos 4 perfis?** Não encontrado. O conteúdo é especializado no domínio de cada empresa fictícia/demo (farmácia, calçados, fast food, cervejaria) e não referencia métricas internas da Codify.

**Qual perfil está mais próximo de vendável agora?** Pacheco/Farmácia (fonte real associada — CMED — e setas de direção habilitadas) e Oscar/Calçados (agora confirmado com conteúdo completo nos 12 departamentos) empatam tecnicamente. McDonald's e Império também têm conteúdo completo, mas Império carece de organização real conectada (ver item 16, Seção 2).

**Qual perfil não deve ser usado em pitch ainda?** O sub-perfil "Cervejaria Império — distribuidora" — o switcher de loja existe na UI mas abre o mesmo conteúdo da matriz (confirmado: mesmo objeto `CERVEJA_IMPERIO_SECTOR_FEEDS`), perceptível em um clique de exploração por um prospect técnico.

**O que precisa ser escondido ou explicado em cada perfil**: Império — explicar que o switcher de loja/distribuidora é ilustrativo (mesmo conteúdo da matriz). Todos os 4 — explicar que o conteúdo é fixture redigido, não coleta ao vivo (nenhuma URL real por trás das citações "Fonte: X").

---

## 7. Feed geral legado

**Estado inicial real de `activeDepartment`**: `src/App.tsx:460` — `const [activeDepartment, setActiveDepartment] = useState<DepartmentId>('geral')`. Confirmado: o app sempre abre com `activeDepartment === 'geral'`.

**O que aparece na primeira tela**: o bloco "Feed geral da empresa" (`App.tsx:1690-1751`), renderizado quando `activeSector === 'os1' || activeDepartment === 'geral'` — ou seja, para **qualquer perfil**, a primeira tela é sempre esse feed geral, não o feed setorial rico.

**Quais arquivos alimentam o feed geral**: composição em `App.tsx:1727-1735`:
```js
const base = activeSector === 'os1' ? [] : (DEMO_FEED_CARDS[feedKey] ?? []);
const realIds = new Set(apiIntelligenceCards.map(c => c.id));
const merged = [
  ...apiIntelligenceCards,                                          // API real
  ...cmedCards.filter(c => !realIds.has(c.id)),                     // CMED (fixture)
  ...base.filter(c => !realIds.has(c.id) && !cmedCards.some(...)),  // demo-feed-cards.ts
];
```
Confirma: **sim, mistura API real + CMED (fixture) + `demo-feed-cards.ts`**, com dedupe por `id` e prioridade nessa ordem.

**Quais APIs o feed geral chama**: `apiIntelligenceCards` vem de `useCodifyFeedIntelligence` (`App.tsx:455`), que internamente usa `codify-feed-client.ts` para chamar `GET /api/feed/codify` (autenticado por Bearer).

**O que acontece quando essas APIs retornam 401**: `codify-feed-client.ts:7-9` documenta explicitamente: *"Política de erro: tudo silencioso. Qualquer falha (sem rede, 401, 5xx, timeout, JSON inválido) [cai em fallback]"*. Confirmado por leitura do arquivo — não há tratamento visível de 401 além de cair em lista vazia.

**O usuário vê erro, vazio, fallback ou cards legados?** Vê **fallback silencioso** — sem erro visível, sem loading travado. Na prática, para qualquer perfil que não seja `os1`, o usuário sempre vê pelo menos os 5 cards de `demo-feed-cards.ts` (`base`), mesmo que a API real retorne 401 — o "vazio" da API real é mascarado pelos cards demo, que preenchem a tela normalmente.

**O feed geral contém fontes proibidas?** Não encontrado nos 5 cards de `demo-feed-cards.ts` por empresa (ver Seção 6). Para `activeSector === 'os1'`, existe adicionalmente um bloco de "Cards 1-10 fixos" (`App.tsx:1752-1770`, comentário: *"Av. Paulista / ANVISA / fast food — só na empresa OS1"*) — conteúdo hardcoded específico do perfil interno da Codify, não exposto a outros perfis.

**Cards antigos ou mal formatados?** Não aprofundado nesta rodada além do que já consta no relatório anterior (animação de loading morta nos cards do feed, já documentada).

**O feed geral deveria ser desativado, substituído ou redirecionado?** Recomendação técnica (não implementar, só recomendar): como o feed geral é a primeira tela de qualquer perfil e mistura API real (silenciosamente vazia na ausência de integração) + CMED fixture + 5 cards demo redigidos à mão, a opção mais segura para demo comercial é **redirecionar o estado inicial `activeDepartment` para um departamento setorial específico rico** (ex.: o setor mais forte de cada perfil) em vez de `'geral'`, ou manter `'geral'` mas garantir que o roteiro de demo comece explicando que aqueles 5 cards são ilustrativos. A alternativa de "desativar" o feed geral tem custo mais alto (é o hub de navegação inicial hoje) e não foi avaliada em profundidade aqui.

---

## 8. Mapa competitivo

Reconfirmado nesta rodada, sem alterações em relação ao relatório anterior:

- **Componente**: `src/components/maps/CompetitiveMap.tsx`, que decide entre `LeafletFallbackMap` e `GoogleMapWrapper`.
- **Tecnologia ativa**: Leaflet — `CompetitiveMap.tsx:62`: `const FORCE_LEAFLET = true;` (comentário: "mudar pra false só quando o projeto Google Cloud tiver billing habilitado"). Google Maps nunca renderiza hoje, independentemente da validade da chave.
- **Dados**: concorrentes e coordenadas 100% hardcoded (`src/mockData.ts`, `src/features/map/map-ui-utils.ts`), pareados por índice de array (`useMapAnalysis.ts:51`: `competitors.slice(0, coords.length).map((c, i) => ({ c, pos: coords[i] }))`) — sem geocodificação real.
- **Cálculo de distância**: real (Haversine, `map-ui-utils.ts:120-127`), aplicado sobre o dataset fixture.
- **Raio ajustável**: sim, 9 steps discretos (500m a 50km + "sem limite").
- **Integração com perfil/setor**: sim — coordenadas e concorrentes variam por perfil (arrays `COORDS`, `OSCAR_COORDS`, `NUBANK_COORDS`, `PACHECO_LOJA_COORDS`).
- **Integração com feed/workspace**: sim, via barramento de eventos (`useOS1MapBridge.ts`), 10 ações reais que geram cards sintéticos.
- **`react-leaflet` usado?** Não — confirmado por grep (`grep -rln "from 'react-leaflet'" src/` sem resultado); a implementação usa `leaflet` puro. Dependência declarada em `package.json` sem uso real.
- **Risco de parecer dado minerado ao vivo**: sim, confirmado — os campos de concorrente (`nota_google`, `evidencia`, `ultima_atualizacao`, `oportunidade`) são texto/número escrito à mão no mock, sem qualquer fetch de rede por trás.
- **Vendável como demonstração honesta?** Sim, com discurso correto: apresentar como "protótipo funcional de módulo territorial, cálculo geográfico real, dataset ilustrativo aguardando fonte de dado real (Google Places, scraping licenciado, etc.)". **Não deve ser apresentado como "mapeamos seus concorrentes reais"** sem essa ressalva.

---

## 9. Marketplace/atalhos/terceiros

Reconfirmado nesta rodada:

- **Backend**: `server/shortcuts.py` (motor de ranking real, 8 critérios ponderados, regra ética anti-conflito de interesse) + `external/shortcut_db.py` (catálogo seed real com 12 fornecedores: Google Meu Negócio, WhatsApp Business, iFood Parceiros, Stone, RD Station etc.).
- **Endpoints reais confirmados**: `server/server.py:1596` (`POST /api/shortcuts/para-card`), `:1617` (`GET /api/shortcuts`), `:1632` (`POST /api/shortcuts/registrar`).
- **O frontend chama esses endpoints?** Sim — `ChatPanel.tsx:288` (`apiFetch<{shortcuts?: RemoteShortcut[]}>('/api/shortcuts/para-card', ...)`).
- **Onde descarta**: `ChatPanel.tsx:917` — `if (s.kind !== 'local') return null;` — confirmado por grep direto nesta rodada. O resultado remoto (`kind: 'remote'`, atribuído na linha 294 ao mapear a resposta) é buscado, processado, e depois descartado antes de renderizar.
- **O que o frontend renderiza no lugar**: os atalhos locais de `workspace-tools.catalog.ts` e `workspace-shortcuts.catalog.ts` — templates de string, sem chamada de rede.
- **Labels `Incluso`/`Beta`/`API parceira`/`Em breve`**: existem em `ShortcutTier` (`src/core/types/workspace.ts`), só renderizados quando `role==='codify' && sector==='os1'` (confirmado no relatório anterior, não re-verificado linha a linha nesta rodada, mas consistente com o padrão de visibilidade interno observado em `CompanySettingsModal`).
- **Base real para tecnologia de terceiros dentro de cards/workspace**: não encontrada — nenhum iframe/embed de produto de terceiro em `src/features/workspace` ou `src/components` (reconfirmado por grep nesta rodada apontando para os mesmos achados do relatório anterior).
- **Deve aparecer no pitch?** O motor de ranking real (`shortcuts.py`) pode ser citado como fundação técnica (é código real, testado — `test_shortcuts.py` com 43 casos passando), mas não deve ser apresentado como "marketplace ativo", já que hoje não chega ao usuário final.

---

## 10. Os 10 módulos de análise

| Módulo | Existe no código? | Tem lógica própria? | Tem prompt próprio? | Tem UI? | Vendável agora? | Status honesto |
|---|---|---|---|---|---|---|
| Descritiva | Sim (`AnalysisType` + `CMED_CONNECTOR`) | Não (conector usa fixture, não fetch real) | Não | Toggle travado, "incluído" para 3 perfis | Não | Rótulo com 1 conector real associado, mas sem lógica diferenciada de fato |
| Diagnóstica | Sim (só tipo) | Não | Não | Toggle travado | Não | Rótulo puro |
| Preditiva | Sim (só tipo) | Não | Não | Toggle travado | Não | Rótulo puro; conteúdo do perfil McDonald's (rotulado assim) não usa a palavra "predit" |
| Prescritiva | Sim (só tipo) | Não | Não | Toggle travado, nunca "incluído" | Não | Nunca atribuída a nenhum perfil |
| Comparativa | Sim (só tipo) | Não | Não | Toggle travado | Não | Rótulo puro |
| Tendências | Sim (só tipo) | Não | Não | Toggle travado | Não | Rótulo puro + 1 card hardcoded solto em `App.tsx`, desconectado do conceito |
| Sentimento | Sim (só tipo) | Não | Não | Toggle travado, nunca "incluído" | Não | Nunca atribuída a nenhum perfil |
| Inferencial | Sim (só tipo) | Não | Não | Toggle travado, nunca "incluído" | Não | Nunca atribuída a nenhum perfil |
| Exploratória | Sim (só tipo) | Não | Não | Toggle travado, nunca "incluído" | Não | Nunca atribuída a nenhum perfil |
| Cognitiva | Sim (só tipo) | Não | Não | Toggle travado, nunca "incluído" | Não | Nunca atribuída a nenhum perfil |

Confirmado nesta rodada: `IntelligenceCard` (`src/core/types/card.ts`, `src/components/WorkspacePanel.tsx`) **não tem campo `analysisType`** (grep direto, zero ocorrências) — nenhum card, de nenhuma fonte, carrega essa informação estruturalmente. Os 10 toggles em `CompanySettingsModal.tsx:407-419` são idênticos entre si: `<div ... opacity-70 cursor-not-allowed" title="Em breve">`, sem `onClick`/`onChange`, com `<Lock size={10}>` ao lado — o único diferencial é cosmético (rótulo "incluído" se o `analysisTypes` do perfil ativo listar aquele tipo).

**Risco confirmado**: sim — apresentar esse painel a um investidor ou cliente técnico como "10 módulos de análise" sem deixar claro que são rótulos de roadmap pode ser lido como promessa de capacidade que não existe. A distância entre "classificação textual redigida à mão" e "análise avançada por módulo" é real e mensurável (zero linhas de lógica diferenciada por módulo).

---

## 11. Testes com falha

**`test_codify_api.py`**: 1 falha em 34 testes — `test_33_user_with_membership_accesses_feed` (linha 620-652). O teste cria um card via `POST /api/codify/v0/cards` com `status: "published"` (sucesso, `201`), gera um JWT manualmente para `user-mbr-test`, e espera que `GET /api/feed/codify?organizationId=...` retorne `total >= 1`. Resultado: `total == 0`.

**`test_feed_codify.py`**: 3 falhas em 13 testes — `test_03_valid_bearer_returns_user_cards`, `test_05_isolation_user_b_does_not_see_org_a`, `test_06_metadata_returned`. Todos falham pelo mesmo motivo: os cards `card_a1`/`card_b1`, criados via `POST /api/codify/v0/cards` no `setUpClass` (linhas 82-148, com `assert r.status_code == 201` passando), não aparecem na resposta de `GET /api/feed/codify` para os usuários de teste.

**Causa raiz identificada** (não estava no relatório anterior): em `server/feed_codify.py:146-206` (`GET /api/feed/codify`), a visibilidade de um card depende do papel do usuário:
- Se `has_matrix_membership(conn, user["id"], org_id)` for verdadeiro (role `implementation_master` + `access_scope='full'`), o usuário vê todos os cards da org (ou da unit + distribuídos, se `unitId` for passado).
- Caso contrário (linha 183-206), o usuário **só vê cards presentes na tabela `codify_card_distributions`** para as units às quais pertence.

Os usuários de teste em ambos os arquivos têm `role: "independent"` / `access_scope: "full"` (`test_feed_codify.py:190,194,203`) — **não** são `implementation_master`, então caem no branch que exige distribuição explícita. `codify_card_distributions` só é escrita em `server/governance.py:279`, dentro do endpoint `POST /api/governance/cards/{id}/distribute` — confirmado por grep (`INSERT INTO codify_card_distributions` só aparece em `governance.py`). Nenhum dos dois testes chama esse endpoint antes de verificar visibilidade — por isso os cards, embora criados com sucesso, nunca aparecem na consulta.

**Classificação da causa**: é uma falha de **contrato/lógica de negócio**, não de ambiente, autenticação ou fixture (o `TestClient` roda in-process, SQLite temporário, sem dependência externa — confirmado ao reexecutar duas vezes com resultado idêntico). Mais precisamente: é o encontro entre dois comportamentos que fazem sentido isoladamente, mas colidem — a API de ingestão (`codify_api.py`) não cria distribuição automática ao publicar um card, e o endpoint de leitura para não-matriz exige distribuição explícita para exibir qualquer card.

**É bug de teste ou lacuna de produto? Não confirmado com certeza — duas leituras possíveis**:
1. **Lacuna de produto**: se a intenção é que uma organização "independente" (não-franquia) veja os próprios cards publicados sem um passo manual de governança, falta a ingestão auto-distribuir para a unit de origem — hoje não acontece em nenhum lugar do código.
2. **Bug de teste**: se a intenção de produto é que todo card passe por aprovação/distribuição humana antes de aparecer no feed de um usuário não-matriz (um gate de qualidade deliberado), os testes estão incompletos — deveriam chamar `POST /api/governance/cards/{id}/distribute` antes de checar visibilidade.

Não há documentação no repositório que resolva essa ambiguidade — recomenda-se decisão explícita do time de produto (ver Seção 16).

**Afeta o produto vendável?** Sim, diretamente — se o cenário de venda for "conectar uma fonte real (CNPJ, Google Maps etc.) via `codify_api.py` para um cliente independente", os cards ingeridos **não apareceriam no feed desse cliente** sem uma ação manual adicional de um usuário matriz, hoje não documentada nem exposta na UI padrão do cliente.

**Afeta ingestão/mineradoras?** Sim — é exatamente o caminho de ingestão mais maduro (`codify_api.py` → banco → `feed_codify.py`) que está sujeito a essa lacuna.

**Bloqueador antes de venda?** Sim, se o piloto envolver ingestão real para um cliente não-matriz. Não, se o piloto usar só perfis demo (fixture), que não passam por esse caminho.

**Bloqueador antes de investidor?** Sim, potencialmente — é o tipo de coisa que uma diligência técnica simples (rodar a suíte de testes) descobre em minutos, e a explicação exige entender uma nuance de modelagem de dados que não está documentada.

**Comandos usados**: `python3 test_codify_api.py` e `python3 test_feed_codify.py`, executados 2x cada nesta auditoria, resultado idêntico nas duas execuções.

---

## 12. Matriz de bloqueadores

### A. Bloqueador antes de pitch para cliente pago

| Item | Evidência | Risco | Recomendação | Esforço | Decisão do CEO? |
|---|---|---|---|---|---|
| Backdoor `demo.`/`simple.` sempre autenticado | `auth.py:406-409` | Acesso não autorizado, leitura irrestrita de `negocios` | Remover ou proteger por env var restrita a ambiente de teste isolado | Baixo | Sim — decidir se algum fluxo de demo depende desse backdoor hoje |
| Secret key default hardcoded | `auth.py:27` | Token forjável se `JWT_SECRET` não estiver setada | Forçar `JWT_SECRET` obrigatória (falhar boot se ausente) | Baixo | Não |
| Fallback de LLM sem flag distintiva | `workspace.py:33-153` | Cliente pode receber conteúdo genérico sem saber que o LLM falhou | Adicionar campo `fallback`/`used_llm` real na resposta de cada ação | Médio | Não |
| Lacuna de distribuição de card ingerido (não-matriz não vê cards publicados) | `feed_codify.py:183-206`, `governance.py:279` | Piloto com ingestão real para cliente independente pode mostrar feed vazio | Decidir e implementar: auto-distribuir na ingestão OU expor a etapa de distribuição na UI | Médio | Sim — é decisão de modelo de produto, não só técnica |
| `anthropic` ausente dos requirements do backend | `requirements.txt`, `server/requirements.txt` | Risco de queda silenciosa para fallback em produção | Adicionar `anthropic` a `server/requirements.txt` e confirmar instalação no Railway | Baixo | Não |

### B. Bloqueador antes de investidor

| Item | Evidência | Risco | Recomendação | Esforço | Decisão do CEO? |
|---|---|---|---|---|---|
| Falhas de teste reproduzíveis em `test_codify_api.py`/`test_feed_codify.py` | Seção 11 | Diligência técnica simples (rodar testes) revela lacuna não documentada | Resolver a ambiguidade produto vs. teste e corrigir | Médio | Sim — a resposta correta depende de decisão de modelo de governança |
| Ausência de log/flag real distinguindo LLM real de fallback | `base_agent.py:31,39-49` (`used_llm` morto) | Se perguntado "como sabemos que é IA real", não há resposta no código hoje | Implementar telemetria real (`used_llm`) e expor de alguma forma auditável | Médio | Não |
| 10 módulos de análise sem lógica diferenciada | `CompanySettingsModal.tsx:404-419`, `card.ts` sem `analysisType` | Pode parecer promessa de capacidade avançada inexistente se questionado tecnicamente | Reposicionar como roadmap explícito no material de investidor, não como capacidade atual | Baixo (comunicação) | Sim — como posicionar isso no pitch deck |
| Motor de setas 100% fixture (1 vertical, 4 relações manuais) | `relation-generator.ts`, `ChatPanel.tsx:586` (no-op) | Se citado como "IA gerando insights causais", é falso hoje | Não citar como funcionando; citar como arquitetura pronta para a próxima fase | Baixo (comunicação) | Sim |
| Marketplace real no backend, zero uso no produto | `ChatPanel.tsx:917`, `shortcuts.py` | Pode ser questionado por que existe código não usado / por que não está ativo | Explicar como decisão consciente de sequenciamento, não abandono | Baixo (comunicação) | Não |

### C. Pode ficar como piloto guiado

| Item | Evidência | Risco | Recomendação | Esforço | Decisão do CEO? |
|---|---|---|---|---|---|
| Mapa competitivo com dado fixture | `CompetitiveMap.tsx:62`, `mockData.ts` | Aceitável se explicado como protótipo | Incluir ressalva no roteiro de demo | Baixo | Não |
| Feed geral misturando API real (silenciosa se vazia) + CMED + demo cards | `App.tsx:1727-1735` | Aceitável em piloto acompanhado | Explicar a composição ao cliente/investidor durante a demo | Baixo | Não |
| Perfil Império sem organização real / switcher de distribuidora idêntico à matriz | `product-registry.ts:62-73`, `index.ts:28-29` | Perceptível a um clique exploratório | Evitar esse perfil em demo não acompanhada, ou remover o switcher até haver conteúdo distinto | Baixo | Não |
| Navegador embutido com 10 ações ocultas por padrão | (relatório anterior, não re-verificado nesta rodada) | Baixo — funcionalidade discreta, não visível por padrão | Manter oculto até maturar | Baixo | Não |

### D. Pode ficar como visão/fundação

| Item | Evidência | Risco | Recomendação | Esforço | Decisão do CEO? |
|---|---|---|---|---|---|
| Motor de setas real (Camada A com LLM) | `relation-generator.ts` (comentário "futuro: LLM real") | Nenhum, se não vendido como pronto | Manter como roadmap técnico documentado | Alto | Sim — priorização |
| 9 dos 10 módulos de análise além da Descritiva | Seção 10 | Nenhum, se não vendido como pronto | Manter como roadmap | Alto | Sim — priorização |
| Marketplace de parceiros como produto (catálogo navegável, contrato) | `shortcuts.py` + ausência de UI | Nenhum, se não vendido como pronto | Decidir se e quando reconectar ao frontend | Médio | Sim |
| Google Maps ativo (vs. Leaflet definitivo) | `CompetitiveMap.tsx:62`, custo de billing | Nenhum tecnicamente, é decisão de custo/produto | Decidir compromisso definitivo | Baixo (decisão), médio (implementação) | Sim |

---

## 13. O que pode ser vendido agora

- Fluxo Feed → Área de Trabalho com geração real via LLM (com a ressalva de que o fallback não é visível quando ocorre).
- Governança de cards (aprovar/rejeitar/distribuir) — real, testado, sem ressalva necessária.
- Isolamento de dados por organização/membership no caminho de produto migrado (feed, workspace, organizations) — real e testado.
- Conteúdo completo (12 departamentos, 240 cards) dos perfis Oscar, Pacheco, McDonald's e Império — confirmado nesta rodada, incluindo a correção sobre o Oscar.
- Scrapers reais do backend (CNPJ, Google Maps, Reclame Aqui, Instagram, clima) como prova de capacidade técnica de coleta, mesmo não conectados à experiência do usuário hoje.
- Mapa competitivo como protótipo funcional, com ressalva explícita sobre dado fixture.

## 14. O que não deve aparecer no pitch

- Os 10 toggles de "módulos de análise" no `CompanySettingsModal` como se fossem capacidades ativas — são rótulos travados.
- O switcher de loja/distribuidora da Cervejaria Império — abre conteúdo idêntico ao da matriz.
- Qualquer menção a "setas de direção geradas por IA" como funcionando — é fixture manual de 4 relações em 1 vertical.
- Badges `Beta`/`API parceira`/`Em breve` do workspace, mesmo que hoje só visíveis internamente — não devem vazar para material externo.
- Qualquer teste ao vivo de ingestão de card real para um cliente com role diferente de matriz sem antes resolver a lacuna de distribuição (Seção 11) — risco de mostrar um feed vazio inesperadamente.
- O chat de texto livre do workspace (`handleSend`) sem avisar que é mockado — resposta fixa após 1.4s, não é IA respondendo.

---

## 15. Próximos 10 passos técnicos recomendados

1. Decidir e remover (ou proteger por ambiente isolado) o backdoor `demo.`/`simple.` em `auth.py:406-409`.
2. Forçar `JWT_SECRET` obrigatória no boot do servidor (falhar explicitamente se ausente), documentar em um `.env.example` do `server/`.
3. Adicionar `anthropic` a `server/requirements.txt` e confirmar no Railway que o pacote e a `ANTHROPIC_API_KEY` estão de fato ativos.
4. Implementar um campo real (`fallback: bool` ou `used_llm: bool`) nas respostas de `pesquisar/executar/aprender/simular/estender`, e ativar a telemetria hoje morta (`used_llm` em `agents/base_agent.py`).
5. Resolver a ambiguidade de `codify_card_distributions`: decidir se ingestão via `codify_api.py` deve auto-distribuir para a unit de origem, ou se os testes devem ser corrigidos para chamar o endpoint de distribuição — e então corrigir o lado escolhido.
6. Revisar/remover o switcher "distribuidora" da Cervejaria Império até haver conteúdo real distinto, ou conectar `realOrgId`/`realUnitId` para esse produto.
7. Confirmar se `NIKE_SECTOR_FEEDS` (arquivo morto) deve ser removido do repositório, já que não é mais usado desde que `index.ts` passou a apontar `nike` para `OSCAR_LOJA1_SECTOR_FEEDS`.
8. Redirecionar o estado inicial (`activeDepartment`) para um departamento setorial rico específico por perfil, ou incluir aviso explícito no roteiro de demo sobre a composição do feed geral.
9. Auditar (não corrigir ainda) se há outras rotas do backend, além das 4 já auditadas, que ainda dependem do sistema legado `negocios`/`user_negocios` e portanto ainda são afetadas pelo backdoor.
10. Rodar manualmente um teste de isolamento entre organizações usando contas reais (não só leitura de código) para confirmar em ambiente ao vivo que nenhum dado vaza entre clientes ao trocar de setor — item que ficou como "não confirmado" nesta e na auditoria anterior.

---

## 16. Decisões pendentes para o CEO

- Prioridade: corrigir o backdoor de autenticação antes do próximo pitch pago, mesmo que isso quebre algum fluxo de demo que dependa dele hoje?
- Modelo de governança: cards ingeridos devem aparecer automaticamente para o cliente dono da organização, ou é intencional que todo card passe por aprovação/distribuição manual de um usuário matriz antes de ficar visível? Essa resposta determina se a falha dos testes é bug ou comportamento correto mal testado.
- Cervejaria Império: vale o esforço de conectar uma organização real agora, ou o perfil deve ser retirado do roteiro de demo até lá?
- Comunicação de investidor: os 10 módulos de análise e o motor de setas devem ser apresentados explicitamente como "visão/roadmap" no deck, ou removidos da conversa até terem alguma lógica real?
- Marketplace de fornecedores: motivo de manter o motor real (`shortcuts.py`) sem uso no produto — sequenciamento deliberado ou prioridade que ficou pra trás? Vale religar o consumo no frontend agora que se confirma que o backend está pronto e testado?

---

## 17. Apêndice de comandos rodados

```
grep -rn "import anthropic" --include="*.py" .
grep -rn "ANTHROPIC" --include="*.py" .
grep -rn "anthropic.Anthropic(" --include="*.py" .
grep -i anthropic requirements.txt
grep -i anthropic server/requirements.txt
find . -iname "requirements*.txt" -not -path "*/node_modules/*"
pip3 show anthropic
python3 -c "import anthropic; print('OK', anthropic.__version__)"
grep -n "used_llm" --include="*.py" -r .
grep -n "last_usage" --include="*.py" -r .
grep -rln "fallback" --include="*.py" .
grep -n "def decode_token" -A 20 server/auth.py
grep -n "def get_user_by_token" -A 20 server/auth.py
grep -rn "demo-user" --include="*.py" .
grep -n "def seed_handles" -A 40 server/auth.py
grep -rn "list_negocios|get_negocio_ativo|select_negocio|has_consent" server/server.py
grep -rniE "api_key=|secret=|password=|token=" --include="*.py" .
cat /Users/luttor/codify/omni/.env.example
find /Users/luttor/codify/omni -iname ".env*" -not -path "*/node_modules/*"
cat src/data/sector-feeds/index.ts
git log --oneline -5 -- src/data/sector-feeds/index.ts
git log -1 --format="%ai" -- src/data/sector-feeds/index.ts
grep -rn "NIKE_SECTOR_FEEDS" src/
grep -rn "PROFILE_SECTOR_FEEDS" src/
grep -c "title:" src/data/sector-feeds/{oscar-loja1,nubank,mcdonalds,cerveja-imperio,nike,pacheco-loja1}.ts
grep -n "activeDepartment" src/App.tsx
grep -rn "demo-feed-cards|DEMO_FEED_CARDS" src/
grep -n "FORCE_LEAFLET" src/components/maps/CompetitiveMap.tsx
grep -rln "from 'react-leaflet'" src/
grep -rn "generateCandidateRelations" src/
grep -n "arrowsUnlocked|onClick={() => {}}" src/components/ChatPanel.tsx
grep -n "kind !== 'local'|/api/shortcuts/para-card" src/components/ChatPanel.tsx
grep -n "cursor-not-allowed|Em breve|ALL_ANALYSIS_TYPES|Lock" src/features/modals/CompanySettingsModal.tsx
grep -n "analysisType" src/components/WorkspacePanel.tsx src/core/types/card.ts
grep -rln "INSERT INTO codify_card_distributions" server/*.py
python3 test_codify_api.py   (executado 2x)
python3 test_feed_codify.py  (executado 2x)
grep -n "def test_33_user_with_membership_accesses_feed" -A 30 server/test_codify_api.py
grep -n "class FeedCodifyTests|card_a1|card_b1" server/test_feed_codify.py
```

---

## 18. Apêndice de arquivos auditados

**Frontend**: `src/App.tsx`, `src/data/sector-feeds/index.ts`, `src/data/sector-feeds/{nike,oscar-loja1,nubank,mcdonalds,cerveja-imperio,pacheco-loja1}.ts`, `src/data/demo-feed-cards.ts`, `src/core/product/{product-registry,product-version}.ts`, `src/core/relations/{relation,relation-generator,relation-registry}.ts`, `src/core/types/card.ts`, `src/components/{ChatPanel,WorkspacePanel}.tsx`, `src/components/maps/CompetitiveMap.tsx`, `src/features/map/{map-ui-utils,useMapAnalysis}.ts`, `src/features/modals/CompanySettingsModal.tsx`, `src/features/feed/codify-feed-client.ts`, `package.json`.

**Backend**: `server/auth.py`, `server/feed_codify.py`, `server/workspace.py`, `server/workspace_fallback.py`, `server/governance.py`, `server/shortcuts.py`, `server/codify_api.py`, `server/test_codify_api.py`, `server/test_feed_codify.py`, `agents/base_agent.py`, `agents/pipeline.py`, `requirements.txt`, `server/requirements.txt`, `.env.example`, `.env` (só nomes de chave), `scrapers/output/*.json`.

**Relatório de referência**: `AUDITORIA_OS1_ESTADO_ATUAL.md`.
