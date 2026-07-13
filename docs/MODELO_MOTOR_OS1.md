# Modelo do Motor — OS¹

---

## REGRA DE VISÃO (o que o OS¹ É e NÃO é)

O OS¹ **NÃO é uma mineradora.** Não entrega dado bruto, número solto ou cadastro.
A visão de mercado é entregue **ATRAVÉS dos concorrentes** (diretos e indiretos):
a MOVIMENTAÇÃO deles + o PORQUÊ dessa movimentação no mercado + INSIGHTS +
DIRECIONAMENTO.

**REGRA DO MOTOR:** nenhuma fonte gera card sozinha. Toda fonte é INGREDIENTE que
alimenta a costura:

> movimento do concorrente → causa de mercado → insight → direcionamento (apontamento)

Dado que não vira direcionamento **NÃO vira card.** A mesma fonte pode ser usada como
mineradora (dado cru — proibido) ou como OS¹ (insight costurado — correto). A
diferença é sempre terminar em direcionamento — e direcionamento é apontamento,
nunca ordem. (Ver seção abaixo.)

**Exemplos:**

| Fonte | ❌ Mineradora (proibido) | ✅ OS¹ (correto) |
|-------|--------------------------|-----------------|
| Receita CNPJ | "Urbano: capital R$ 347M" | "Holding entrou em 2021 → possível M&A → atenção ao movimento da Urbano" |
| Índice Stone | Planilha de variações por setor | "Varejo de alimentos acelera +7,4% → negocie gôndola agora" |
| CEPEA via agrobr | "Milho: R$ 64,51/sc" | "Milho sobe 3º mês seguido → pressão no custo do concorrente → janela de preço" |
| CONAB safra | "Milho 25/26: 140,4 Mt" | "Supersafra pressiona preço → margem do concorrente melhora → risco de guerra de preço em Q3" |
| Comex Stat | Tabela de exportações por NCM | "BR exporta 41 Mt de milho e importa 1,8 Mt do sul → arbitragem regional → sinal de custo diferente por praça" |

---

## As duas camadas e a Regra do Apontamento

### Por que duas camadas?

O card de feed e o conteúdo por trás do clique servem propósitos diferentes.
Confundi-los é o principal jeito de cruzar a linha entre análise e consultoria.

| Camada | Onde aparece | Função | Voz |
|--------|-------------|--------|-----|
| **Camada 1 — Leitura** | Card no feed (visível sempre) | Diz o que está acontecendo no mercado e por quê | Descritiva, factual |
| **Camada 2 — Direcionamento** | Por trás do clique ("destrinchar") | Aponta o que o contexto sugere para o cliente | Condicional, de tendência |

A Camada 1 existe sem o clique. A Camada 2 só aparece quando o cliente quis aprofundar.

**Essa distinção não é só de interface — é de valor:**

- **Camada 1 é a isca.** Faz o dono enxergar o que está acontecendo no mercado. Mas ver o mercado é commodity: qualquer ferramenta mostra o que o concorrente fez.
- **Camada 2 é o produto.** O que o cliente paga não é ver o mercado — é a ideia do que fazer. O apontamento enriquecido com melhores práticas é onde está o valor que justifica a cobrança.

### A cadeia completa

```
movimento → causa → insight → direcionamento (apontamento)
```

- **Movimento:** o que aconteceu (dado verificado de fonte)
- **Causa:** por que aconteceu (leitura do contexto de mercado)
- **Insight:** o que isso significa para o setor do cliente
- **Direcionamento:** o que o contexto *tende a sugerir* — nunca o que o cliente *deve fazer*

### Apontamento vs. Ordem — a distinção crítica

O OS¹ é uma plataforma de análise, não de consultoria. A diferença concreta:

| ❌ Ordem (proibido) | ✅ Apontamento (correto) |
|--------------------|------------------------|
| "Negocie gôndola agora" | "Transições de comando costumam abrir uma janela curta antes das coisas se reorganizarem" |
| "Ligue para o distribuidor X" | "Vale pensar onde vocês se cruzam com a Yoki hoje" |
| "Faça campanha nesta região" | "É aí que o momento tende a pesar mais" |
| Resultado prometido | Possibilidade identificada |

**Regras do apontamento:**
1. Usar linguagem de tendência: *"costuma"*, *"tende a"*, *"vale pensar"*, *"é comum que"*
2. Nunca nomear a jogada específica do cliente (*"ligue", "negocie", "contrate"*)
3. Nunca prometer resultado (*"isso vai gerar"*, *"você vai ganhar"*)
4. O direcionamento pertence ao conteúdo do card — não vira card solto

### Gabarito de Camada 2

Exemplo correto de direcionamento (Combrasil / Yoki):

> *"Transições de comando costumam abrir uma janela curta antes das coisas se
> reorganizarem. Vale pensar onde vocês se cruzam com a Yoki hoje — porque é aí
> que o momento tende a pesar mais."*

O que esse exemplo faz certo: (a) linguagem de tendência em todo lugar, (b) aponta
o CONTEXTO, não a jogada, (c) o cliente decide o que fazer com isso.

### Sinais de que o card cruzou a linha

Revisar (e possivelmente reprovar) qualquer card que contenha:

- Verbos no imperativo dirigidos ao dono: *"negocie", "ligue", "faça", "acione", "contrate"*
- Jogada nomeada: *"aborde o distribuidor X"*, *"entre no segmento Y agora"*
- Resultado prometido: *"isso vai gerar margem"*, *"você vai ganhar participação"*
- Referência a dado interno do cliente (o OS¹ não acessa dado interno)

**Trava futura sugerida:** sinalizar automaticamente cards de Camada 2 que contenham
verbos imperativos para revisão antes de publicar.

---

## Arquitetura do motor

### Camadas de dado

```
MOVIMENTO        →  Google News + RSS Setorial
CAUSA / OFERTA   →  BCB SGS + IPEA + CONAB + IBGE LSPA + Comex Stat
CAUSA / PREÇO    →  CEPEA + B3 Futuros (ambos via agrobr)
NÚMERO (abertas) →  CVM Dados Abertos
NÚMERO (fechadas)→  Receita CNPJ via BrasilAPI
DEMANDA          →  Índice Stone + Mercado Livre API
FÍSICO           →  OpenStreetMap / Overpass
```

### Costura de card (obrigatória)

Todo card precisa dos três elementos abaixo. Faltando qualquer um, não é card OS¹:

1. **FATO** — dado verificado de fonte (ex: Stone +7,4%, CNPJ holding 2021)
2. **LEITURA** — o que esse fato significa no contexto do setor/concorrente
3. **DIRECIONAMENTO (apontamento)** — uma direção que o contexto sugere, não uma ordem

### O que NÃO é card OS¹

- Número sem contexto ("IPCA Alimentação: 0,8% em junho")
- Notícia sem leitura ("Camil reportou receita de R$ 3,2bi")
- Dado interno do cliente ("seu faturamento caiu X%") — o OS¹ não acessa dado interno
- Projeção inventada sem fonte

---

## Fontes por perfil de cliente

A configuração do perfil (setor, porte, região, concorrentes declarados) define
quais camadas são ativadas. Não existe "ligar tudo" — cada fonte tem custo de
processamento e relevância varia por setor.

| Setor do cliente | Fontes prioritárias |
|-----------------|---------------------|
| Indústria de alimentos (ex: Combrasil) | CEPEA + CONAB + IBGE LSPA + Stone + Comex Stat + CVM (abertas) + CNPJ (fechadas) |
| Varejo / distribuição | Stone + Mercado Livre + OSM + Google News |
| Agronegócio exportador | Comex Stat + B3 Futuros + CONAB + BCB (câmbio) |
| Serviços / saúde | CVM + Google News + CNPJ + INPI |

---

## Estado do motor — v0.1 (12/jul/2026)

O motor de coleta + geração de card foi construído e **provado em miniatura**,
no backend Python (repo `omni`, branch `motor-v0.1-intelligence-engine`, commit `d0a60af`).

**O que funciona hoje:**

- **COLETA:** busca notícias dos concorrentes da Combrasil via Google News RSS.
  Regra aprendida: sempre incluir o setor no termo de busca
  (ex: `"Broto Legal feijão"`) para cortar ruído de nome de marca genérico.

- **CONCORRENTES DA COMBRASIL** (definidos por pesquisa de mercado —
  feijão/arroz/pipoca): Camil, Urbano Alimentos, Josapar (Tio João),
  Kicaldo, Broto Legal, Yoki.

- **CHEF (geração de card):** a LLM (Mistral Small, via infra PragmaLab do omni)
  transforma a notícia em card seguindo a Regra de Visão
  (movimento → causa → insight → direção). Testado: gerou cards reais e válidos
  para os 6 concorrentes.

- **ANTI-ALUCINAÇÃO:** instrução no prompt do chef proíbe inventar número.
  Funcionou — parou de fabricar cifra. Há também uma trava de código, mas está
  dura demais (reprova cards bons por confundir mês numérico com número inventado).
  **Pendente:** decidir se ajusta (elevar limiar para 3 dígitos) ou remove a trava.

**O que ainda falta:**

- **Trava de código:** ajustar ou remover (pendente — ver nota acima).
- **Integração com o banco:** os scripts de teste geram os cards mas não os
  publicam no banco Railway. Falta o job que chama o motor e publica via
  `/api/feed/codify` (modelo de conector já existe, `CMED_CONNECTOR`).
- **Job periódico:** nada roda automaticamente ainda. Execução é manual
  (`python3 scripts/teste_lote_cards.py --lote N`).
- **Configuração do cliente conectada ao feed:** dados de `CompanySettings`
  salvos em localStorage mas não consumidos pelo motor — o fio ainda está cortado.

**Referências:**
- Scripts: `scripts/teste_coleta_google_news.py` · `scripts/teste_card_chef.py` · `scripts/teste_lote_cards.py`
- Portfólio de fontes: `docs/portfolio-fontes/PORTFOLIO_FONTES.md`

---

## Restrições legais de dados

| Fonte | Restrição |
|-------|-----------|
| IMEA (via agrobr) | Proíbe redistribuição comercial sem autorização escrita — **NÃO pode virar card** |
| B3 (via agrobr) | Zona cinza — ajustes publicados sem autenticação mas termos de acesso programático não são claros |
| CEPEA | Dados públicos; uso comercial indireto (análise) geralmente aceito, mas confirmar com advogado antes de escalar |
| Demais fontes gov (CONAB, IBGE, BCB, Receita) | Dados públicos, uso livre |
