# Pendências e alcançabilidade — auditorias de ago/2026

Registro de achados que existiam só em conversa até 09/ago/2026 — read-only
audits feitas nesta sessão, nenhuma delas alterou código. Consolidado aqui
pra não se perder.

---

## 1. Auditoria dos 21 perfis do sistema

Perfis encontrados cruzando `src/data/demo-feed-cards.ts`,
`src/features/feed/codify-sector-scope.ts` e `src/mockData.ts`.

| Perfil | Cards | Tag gancho | DENSE_TEST_CTX | Fonte fecha frase | Scope (codify-sector-scope.ts) | Dado inventado no mockData (+fornecedores) | Real ou fictícia |
|---|---|---|---|---|---|---|---|
| **mcdonalds** | 14 (10 reais + 4 legado a confirmar contagem pós-limpeza) | reais: 10/10 | reais: 10/10 | reais: 10/10 | preenchido | concorrentes/praticas/timeline limpos; **fornecedores não tocado** | Real |
| **combrasil** | 10 | 10/10 | 10/10 | 7/10 (3 EXEMPLO, sem fonte por design) | preenchido | concorrentes/praticas/timeline/fornecedores limpos | Real |
| **nubank (Pacheco)** | 4 (só reais — `pch-1..12` fictícios removidos do feed em 09/ago/2026) | reais: 4/4 | reais: 4/4 | reais: 4/4 | preenchido | mockData limpo (concorrentes/praticas/timeline); fornecedores não tocado | Real |
| nike (Oscar) | 0 (osc-1/2/3/4/5 removidos em 09/ago/2026 — nenhum passou nas 7 checagens da régua: regra do sujeito violada, eixo de território, número/prazo sem fonte, e dois com dado interno inventado — osc-5 NPS/conversão, osc-3 plano de expansão via Diadora SpA não verificado. Perfil fica sem card demo até o motor trazer dado real) | — | — | — | preenchido | mockData limpo, mas fornecedores ainda tem "186 lojas" | Real |
| pacheco-loja-01 | 12 | 0/12 | 0/12 | 0/12 | null (proposital) | array de concorrentes PRÓPRIO, nunca tocado — nota numérica, endereço exato, notas_digitais fabricadas | Real |
| oscar-piloto-01 | 12 | 0/12 | 0/12 | 0/12 | null (proposital) | herda de NIKE_DATA (limpo) via spread | Real |
| cerveja-imperio | 12 | 0/12 | 0/12 | 0/12 | null | não limpo, mas autodeclarado "Sinal demonstrativo · Base demo OS¹" em todo card | Fictícia |
| cerveja-imperio-distribuidora-01 | 12 | 0/12 | 0/12 | 0/12 | null | idem acima | Fictícia |
| natura, ifood, ambev, magalu, embraer, tesla, netflix, spotify, airbnb, uber, apple, amazon (12 perfis) | 5 cada | 0/5 cada | 0/5 cada | 0/5 cada | null (todos) | concorrentes com nota numérica/endereço/notas_digitais fabricados; praticas/timeline não vazios | Real (todos) |

18 dos 20 perfis (fora `os1`) mapeiam pra empresa real — só cerveja-imperio e
sua distribuidora são fictícias.

---

## 2. Auditoria de alcançabilidade — o que o usuário realmente consegue abrir

### Duas allowlists diferentes, divergentes entre si

- **`src/components/SectorSwitcher.tsx:276`** — `DEFAULT_PROFILE_IDS =
  ['os1', 'mcdonalds', 'nike', 'nubank', 'cerveja-imperio']` (5 perfis),
  usada pelo `SectorSwitcherModal` fullscreen — só alcançável pelo botão
  mobile-only (`App.tsx:1496`, `onClick={() => setSectorOpen(true)}`).
- **`src/components/ChatPanel.tsx:1785`** — `PROFILE_SWITCHER_IDS = ['os1',
  'mcdonalds', 'nike', 'nubank', 'cerveja-imperio', 'combrasil']` (6
  perfis, inclui Combrasil) — é a lista que o fluxo real de desktop usa
  (`handleSectorButtonClick`, `App.tsx:903-913`, via
  `openProfileSwitcherInWorkspace()`).

**Resultado:** mobile mostra 5 perfis (sem Combrasil), desktop mostra 6.
Divergência real, não impressão de quem usa os dois ambientes.

### Componentes de UI que corrigi mas que são código morto hoje

`MapAnalysisPanel`/`MapActionResult.tsx`, `ConcorrenteModal`,
`CompetitorCard.tsx` — todos com a correção de `nota_google` aplicada nesta
sessão, mas **nenhum dos três é renderizado em lugar nenhum do app atual**
(confirmado via grep de importadores). A correção fica pronta pra quando/se
esses componentes forem religados, mas não é visível hoje.

### Perfis intencionalmente desligados da navegação

- **`pacheco-loja-01`** — comentário no próprio código confirma:
  `App.tsx:2584`, *"nubank (Pacheco vertical): seletor de lojas
  desabilitado — pacheco-loja-01 contém conteúdo operacional incompatível
  com a demo vertical"*. Tem array de concorrentes próprio, nunca limpo.
- **`oscar-piloto-01`** — só entra via
  `localStorage.getItem('os1_bu_id') === 'bu-oscar-piloto-01'` setado no
  login (`App.tsx:496-497, 510-511`) — não existe clique que leve lá.

### 12 perfis "showcase" totalmente inalcançáveis

`ifood`, `ambev`, `magalu`, `embraer`, `tesla`, `netflix`, `spotify`,
`airbnb`, `uber`, `apple`, `amazon`, `natura` — existem em `SECTORS`
(`SectorSwitcher.tsx`), em `DEMO_FEED_CARDS` e em `PROFILE_MOCK_DATA`, mas
não aparecem em nenhuma das duas allowlists. Nenhum link ou botão leva a
eles hoje. Cada um carrega dado 100% fabricado (nota numérica, endereço,
notas_digitais, `mudancas_recentes`) sem nenhuma limpeza.

**Total: 7 perfis alcançáveis** (`os1`, `mcdonalds`, `nike`, `nubank`,
`cerveja-imperio`, `combrasil` — só desktop, `cerveja-imperio-distribuidora-01`
— aninhado dentro de cerveja-imperio) **de 21 existentes no código.**

---

## 3. Divergência Electron local vs navegador — causa raiz

Investigada porque o feed do McDonald's aparecia diferente nos dois
ambientes.

- **Não é diferença de filtro nem de dado local** — os dois ambientes leem
  o mesmo `DEMO_FEED_CARDS` e o mesmo `mockData.ts`. A causa é qual backend
  cada ambiente resolve pra `/api/feed/codify`.
- **Electron empacotado** (`.app` instalado): `electron/main.ts:9`
  `const isDev = !app.isPackaged` → `app.isPackaged === true` →
  `electron/main.ts:141` carrega `https://app.os1.space` — deploy Vercel
  de produção, **sem nenhuma das mudanças desta sessão** (nada foi
  push/deploy).
- **Electron em modo dev** (`ELECTRON=true NODE_ENV=development electron
  .`) e **navegador em `localhost:3000`**: os dois carregam o mesmo Vite
  dev server. `vite.config.ts:134` faz proxy de `/api/*` pra
  `http://localhost:3002` (backend local — só retorna dado real se estiver
  rodando e seedado).
- McDonald's tem escopo real configurado (`codify-sector-scope.ts:23`,
  `org-mcdonalds-brasil`) — se o backend local responder, cards reais da
  API entram por cima dos 10 demo; se não responder, só aparecem os demo.

**Ação tomada:** fechei o `.app` empacotado e abri Electron em modo dev
(`ELECTRON=true NODE_ENV=development ./node_modules/.bin/electron .`),
processo em background — estado de runtime, não precisa virar arquivo, mas
some quando a sessão/terminal fechar.

---

## 4. `fornecedores` nunca limpo em nenhum dos 3 perfis reais tratados

McDonald's, Oscar (nike) e Pacheco (nubank) tiveram `concorrentes`,
`praticas` e `timeline` limpos nesta sessão — `fornecedores` ficou
explicitamente fora do escopo definido com o Henri em cada rodada.
Continua com empresa real + dado não confirmado (telefone, email,
`preco_referencia`) nos três. No caso da Oscar, além de não confirmado,
**contém a alegação "186 lojas"**, já registrada como não confirmada em
`docs/kiq-oscar.md`.

---

## 5. `os1` — 3 dos 5 cards fixos ainda têm número sem fonte

`os1` não usa `DEMO_FEED_CARDS` — usa um bloco de 5 cards fixo em
`App.tsx` (`activeSector === 'os1'`, linhas ~2058-2064: concorrência /
mercado / economia / eventos / reputação). Nesta sessão corrigi só os 2
primeiros (fallback de "concorrência" e "mercado", que usavam
`nota_google`/texto hardcoded sem fonte). **Os outros 3 continuam com
número sem fonte, hardcoded direto no JSX:**

- `economia`: `` `Ticket médio R$ 38–52 · Nota média ★ ${notaMediaNum} na região` ``
- `eventos`: `'Páscoa 13–20/abr · Dia das Mães 11/mai · Festa Junina Jun'`
- `reputação`: `` `Nota média ★ ${notaMediaNum} · ${concorrentes acima de 4,5} concorrentes` ``

Não corrigidos porque estavam fora do pedido original (só os 2 fallbacks
de timeline foram citados). Ficam registrados aqui pra não se perder.

---

## 6. Metadados de medição — só a Oscar tem hoje

`src/data/card-metadata.ts` (criado em 09/ago/2026, ver
`docs/MODELO_MOTOR_OS1.md` seção "Decisão de arquitetura — metadados de
medição") só tem os 4 registros dos cards da Oscar
(`oscar-centauro-azzas-1t26`, `oscar-nike-lojas-proprias`,
`oscar-pmc-vestuario-virada`, `oscar-confianca-consumidor`). Os cards reais
de Combrasil (10, sendo 7 com fonte), McDonald's (10) e Pacheco (4) foram
escritos **antes** dessa decisão de arquitetura e não têm entrada
correspondente no arquivo. Enquanto isso não for preenchido, a base de
medição de diferencial fica pela metade — não dá pra fazer a leitura futura
("este atributo te distinguia e hoje N de M concorrentes já oferecem") pros
27 cards reais de fora da Oscar. Preencher exige reconstruir os 5 metadados
(atributo tocado, concorrente(s), movimento, eixo, data da fonte) pra cada
card já publicado — trabalho equivalente ao que foi feito pra Oscar, só que
retroativo.

---

## 7. `CompetitiveMap`/`MarketMap` são código morto — a correção de coordenadas não aparece na tela

Em 09/ago/2026, o mapa de concorrentes (`CompetitiveMap.tsx`, aberto via
`MarketMapContent`/`MarketMap.tsx`) recebeu correção estrutural completa:
`lat`/`lng` reais adicionados a `negocio` em `types.ts`/`mockData.ts` pra
todos os perfis, `clientPosition` passado desde `App.tsx` até o mapa,
`SECTOR_CENTERS` (tabela hardcoded duplicada) removida. **Essa correção foi
aplicada corretamente, mas não é visível em lugar nenhum do app hoje** — o
único caminho de UI que abriria esse mapa fullscreen (o botão/fluxo que
chama `setMapOpen(true)`) não está mais na navegação atual. `CompetitiveMap`
e `MarketMap` continuam existindo no código, compilam, mas não são
alcançáveis por nenhum clique. Não desfazer a correção — ela fica pronta
pra quando/se esse mapa for religado à navegação — mas não contar esse
trabalho como visível na demo hoje.

O mapa que **é** visível — o de fundo dentro do container da Área de
Trabalho, montado sempre (`ChatPanel.tsx`, componente `ChatDesktop`, dentro
de `<div ref={mapWrapperRef}>`) — usa `LeafletFallbackMap` diretamente, sem
passar por `CompetitiveMap`. Recebeu a mesma correção separadamente, no
mesmo dia: antes tinha centro fixo hardcoded (`{ lat: -23.1896, lng:
-45.8841 }`, um ponto perto de SJC, sem relação com o perfil ativo); agora
`ChatDesktop` aceita prop `clientPosition` e `App.tsx` passa
`{ lat: data.negocio.lat, lng: data.negocio.lng }` do perfil ativo — esse
sim reflete o perfil na tela.
