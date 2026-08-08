# Pendências — UI órfã (código morto de interação)

Achado durante a correção do perfil da Combrasil (08/ago/2026), ao investigar
onde `progresso_pct`/`gamificacao_log`/`fornecedores`/`praticas` apareciam na
tela. Registrado aqui pra não se perder — não é bloqueante, mas vale limpar
quando alguém mexer nessas áreas do código.

Padrão comum aos três: existe estado (`useState`), existe JSX condicional
(`{estado && (...)}`), mas a função que setaria o estado pra `true`/um valor
não-nulo **nunca é chamada em lugar nenhum do código**. Mesma classe de
problema já conhecida do sino (`unreadCount` busca real mas o botão não tem
`onClick` — ver `QUALIDADE.md` seção 4).

## 1. Modal "Evolução"

- **Onde**: `src/App.tsx:2186-2214`
- **Estado**: `evolucaoOpen` / `setEvolucaoOpen` (declarado em `App.tsx:405`)
- **Achado**: `setEvolucaoOpen(true)` não existe no arquivo — só
  `setEvolucaoOpen(false)` (fechar).
- **Conteúdo que nunca aparece**: nível atual + pontos, barra de progresso
  (`data.progresso_pct`), e "Histórico de Atividades" (`data.gamificacao_log`).
- **Opções**: (a) achar/criar um gatilho real (ex.: clique em algum stat da
  bio) e reconectar; (b) remover o modal e os campos que só existem pra ele.

## 2. "Modal Item Grid"

- **Onde**: `src/App.tsx:2511-2546`
- **Estado**: `selectedItem` / `setSelectedItem` (declarado em `App.tsx:363`)
- **Achado**: `setSelectedItem` só é chamado com `null` (fechar) em dois
  pontos (`App.tsx:2514`, `:2545`) — nunca com um item real
  (`{id, type, content}`).
- **Conteúdo que nunca aparece**: detalhe de concorrente/fornecedor/prática/
  nível, incluindo o segundo lugar onde `data.progresso_pct` era lido
  (`App.tsx:2539-2540`).
- **Relacionado**: `gridItems` (`App.tsx:1188-1197`) monta os itens desse
  modal a partir de `concorrentes`/`fornecedores`/`praticas` — hoje o único
  efeito visível de `gridItems` é a contagem do chip "Oportunidades"
  (`gridItems.length`, `App.tsx:1767`); o grid visual em si nunca renderiza.
- **Opções**: (a) achar/criar o clique que abriria o card de detalhe (provável
  candidato: cards do feed/destaques); (b) remover o modal.

## 3. `openEmpresaInWorkspace`

- **Onde**: `src/App.tsx:654-665`
- **Achado**: zero call sites — ficou órfã quando o clique no nome da empresa
  da navbar foi trocado por `openScoreInWorkspace` (ver histórico de sessão,
  bio sem cliques desnecessários).
- **Conteúdo que nunca é usado**: `mercado_tamanho` e `ranking_local` só são
  lidos dentro dessa função — por isso ficaram "seguros" (sem efeito visível)
  quando decidimos não corrigi-los no perfil da Combrasil.
- **Opções**: (a) remover a função (ela mesma e os dois campos, se nada mais
  os usar); (b) achar outro gatilho se a intenção era manter esse conteúdo
  acessível de algum jeito.

## Por que isso importa

Enquanto esses três ficarem órfãos, qualquer campo de `OmniData` que só
alimenta eles (`progresso_pct` parcialmente, `gamificacao_log`,
`mercado_tamanho`, `ranking_local` parcialmente) é **seguro de deixar errado
ou desatualizado** — não é visível. Mas isso também significa que consertar
esses campos sem reconectar a UI não teria efeito prático nenhum: o trabalho
real, se algum dia vier, é decidir reconectar ou remover — não só corrigir dado.
