import type { CompanySectorFeeds } from '../../types';

const C = '#ec4899';

export const OSCAR_LOJA1_SECTOR_FEEDS: CompanySectorFeeds = {
  marketing: [
    {
      sectionTitle: 'Vitrine & PDV Local',
      cards: [
        {
          color: C,
          tag: 'VITRINE',
          title: 'Vitrine de inverno ainda com mix de verão pode estar perdendo o cliente de bota',
          detail: 'Clientes que buscam bota feminina e couro na entrada do Center Vale decidem entrar ou não pela vitrine. Inverno 26 exige atualização imediata com botas over-the-knee e couro social para capturar o público antes da Centauro.',
          badge: { label: 'Ação urgente', type: 'warn' },
        },
        {
          color: C,
          tag: 'EXCLUSIVO',
          title: 'Diadora "Made in Italy" exclusivo Oscar — argumento que nenhuma outra loja do shopping tem',
          detail: 'A Oscar Loja 1 é a única no Center Vale com acesso ao drop Diadora exclusivo. Comunicar isso na vitrine e no atendimento é o argumento mais forte frente à Centauro. Nenhum concorrente no shopping consegue oferecer o mesmo produto.',
          badge: { label: 'Exclusividade', type: 'ok' },
        },
        {
          color: C,
          tag: 'LOCAL',
          title: 'Instagram da loja com geotag do bairro pode dobrar o alcance orgânico na região',
          detail: 'Posts com geotag de São José dos Campos e hashtags de bairro (Jd. Satélite, Jd. Aquarius) alcançam moradores próximos que ainda não conhecem a loja. Stories com produto + preço + "disponível hoje" convertem mais do que post estático.',
          badge: { label: 'Oportunidade', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Comunicação de Bairro',
      cards: [
        {
          color: C,
          tag: 'BAIRRO',
          title: 'WhatsApp Business da loja pode ser o canal mais barato de retenção de cliente local',
          detail: 'Clientes que deram consentimento para WhatsApp têm taxa de abertura de 85% vs 22% de e-mail. Uma mensagem semanal com novidade de produto e oferta exclusiva mantém a loja na memória sem custo de mídia.',
          badge: { label: 'Baixo custo', type: 'ok' },
        },
        {
          color: C,
          tag: 'EVENTO',
          title: 'Participar de evento de bairro no Jd. Satélite pode gerar lista de clientes novos',
          detail: 'Festas de rua, feiras de bairro e eventos de condomínio no raio de 3 km são oportunidades de presença com custo mínimo. Uma mesa com produto e formulário de WhatsApp gera 30 a 80 novos contatos por evento.',
          badge: { label: 'Prospecção', type: 'info' },
        },
      ],
    },
  ],

  vendas: [
    {
      sectionTitle: 'Conversão & Abordagem',
      cards: [
        {
          color: C,
          tag: 'CONVERSÃO',
          title: 'Perguntar de onde o cliente veio antes pode dobrar a conversão da abordagem',
          detail: 'No Center Vale, o cliente que entra na Oscar frequentemente acabou de sair da Centauro, Studio Z ou Sonho dos Pés. Vendedor que sabe disso e adapta o argumento converte mais do que quem começa do zero. Uma pergunta simples: "você já veio de alguma outra loja?"',
          badge: { label: 'Técnica chave', type: 'ok' },
        },
        {
          color: C,
          tag: 'DIADORA',
          title: 'Script de exclusividade Diadora pode recuperar o cliente que "já viu na Centauro"',
          detail: 'Quando o cliente diz que vai comparar com a Centauro, o vendedor que menciona a exclusividade Diadora (único no shopping) fecha a venda na hora. A licença exclusiva é o argumento de retenção mais forte da loja e precisa estar no roteiro de abordagem.',
          badge: { label: 'Fechamento', type: 'ok' },
        },
        {
          color: C,
          tag: 'CONFORTO',
          title: 'Público feminino 35+ do bairro busca conforto com aparência — mix Usaflex e Diadora cobre',
          detail: 'O segmento de conforto feminino é o de maior frequência de recompra. Cliente que encontra o produto certo na primeira visita volta sozinha. Usaflex, Diadora feminino e linha ortopédica cobrem esse público que a Constance (a 2 km) também está disputando.',
          badge: { label: 'Retenção', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Ticket Médio & Cross-sell',
      cards: [
        {
          color: C,
          tag: 'CROSS-SELL',
          title: 'Palmilha + meia + manutenção elevam ticket médio sem nova vitrine',
          detail: 'Oferta de palmilha anatômica ao comprador de bota aumenta ticket em R$ 35–60 sem necessidade de nova peça. Cross-sell de meia de qualidade junto com tênis esportivo fecha em mais 80% dos casos quando o vendedor oferece antes de embalar.',
          badge: { label: 'Ticket +R$50', type: 'ok' },
        },
        {
          color: C,
          tag: 'PARCELAMENTO',
          title: 'Parcelamento em 6× sem juros pode ser o argumento final para o item premium',
          detail: 'Bota de couro R$ 480 parcelada em 6× cabe em qualquer orçamento de cliente B/A do Jd. Satélite. Vendedor que menciona o parcelamento antes do preço cheio reduz a objeção de valor e aumenta a taxa de fechamento em premium.',
          badge: { label: 'Argumento de fechamento', type: 'info' },
        },
      ],
    },
  ],

  financeiro: [
    {
      sectionTitle: 'Giro & Margem por Produto',
      cards: [
        {
          color: C,
          tag: 'MARGEM',
          title: 'Diadora exclusivo tem margem 18 p.p. acima do multimarca — priorizar na abordagem',
          detail: 'Cada venda de Diadora entrega margem bruta significativamente maior do que Nike ou Olympikus revendidos. Loja que prioriza Diadora no mix e na abordagem melhora resultado sem aumentar volume de vendas.',
          badge: { label: 'Alta margem', type: 'ok' },
        },
        {
          color: C,
          tag: 'GIRO',
          title: 'Produto parado há mais de 45 dias no estoque está custando mais do que parece',
          detail: 'Capital imobilizado em produto sem giro reduz a capacidade de repor itens de alta demanda. Levantamento semanal dos 10 produtos sem movimento há mais de 45 dias permite ação de liquidação ou transferência para unidade com maior demanda.',
          badge: { label: 'Atenção', type: 'warn' },
        },
      ],
    },
  ],

  operacoes: [
    {
      sectionTitle: 'Estoque & Atendimento',
      cards: [
        {
          color: C,
          tag: 'ESTOQUE',
          title: 'Ruptura de tamanho em conforto feminino no pico de inverno pode custar cliente fidelizado',
          detail: 'Cliente de conforto tem número fixo e não aceita substituição fácil. Falta do tamanho 38 em Usaflex durante uma semana de pico pode mandar esse cliente para a Constance — e ele pode não voltar. Reposição deve acontecer antes da ruptura, não depois.',
          badge: { label: 'Risco sazonal', type: 'warn' },
        },
        {
          color: C,
          tag: 'EQUIPE',
          title: 'Escala de fim de semana define o resultado da semana — pico de visitas ocorre entre 14h e 18h',
          detail: 'Sábado entre 14h e 18h concentra o maior volume de clientes no Center Vale. Equipe reduzida nesse horário significa fila de espera — e cliente que espera mais de 5 minutos sem atendimento sai sem comprar. Garantir ao menos 3 vendedores ativos nessa janela.',
          badge: { label: 'Operação crítica', type: 'warn' },
        },
        {
          color: C,
          tag: 'ORGANIZAÇÃO',
          title: 'Estoque organizado por tamanho e categoria reduz tempo de atendimento e aumenta conversão',
          detail: 'Vendedor que demora mais de 2 minutos para buscar o produto perde o momento de decisão de compra. Organização de estoque por número e categoria (feminino/masculino/infantil) pode reduzir o tempo de busca em 60% e aumentar a conversão no balcão.',
          badge: { label: 'Eficiência', type: 'info' },
        },
      ],
    },
  ],

  rh: [
    {
      sectionTitle: 'Equipe & Performance',
      cards: [
        {
          color: C,
          tag: 'TREINAMENTO',
          title: 'Vendedor que conhece o diferencial Diadora fecha mais — script de produto é treinamento urgente',
          detail: 'Equipe que sabe explicar a exclusividade Diadora (licença única no Brasil, feita na Itália, só na Oscar) usa o argumento certo na hora certa. Treinamento de 30 minutos com role-play de abordagem já entrega resultado na semana seguinte.',
          badge: { label: 'Capacitação', type: 'ok' },
        },
        {
          color: C,
          tag: 'META',
          title: 'Meta individual por vendedor com ranking visível aumenta desempenho sem custo',
          detail: 'Equipe de loja que acompanha o próprio resultado em tempo real tende a performar melhor. Um quadro simples na área de estoque com as vendas da semana por vendedor cria competição saudável e mantém o foco no fechamento.',
          badge: { label: 'Cultura de resultado', type: 'info' },
        },
      ],
    },
  ],

  estoque: [
    {
      sectionTitle: 'Reposição & Controle',
      cards: [
        {
          color: C,
          tag: 'REPOSIÇÃO',
          title: 'Verificar estoque de conforto feminino nos tamanhos 36–40 antes do pico de inverno',
          detail: 'Os tamanhos de maior giro em conforto feminino (37, 38, 39) são os primeiros a entrar em ruptura durante picos sazonais. Solicitar reposição quando o estoque atingir 3 pares por tamanho evita a ruptura — e o cliente que vai embora para a Constance.',
          badge: { label: 'Pré-pico', type: 'warn' },
        },
        {
          color: C,
          tag: 'GIRO',
          title: 'Produto parado há mais de 45 dias pode virar liquidação antes de virar prejuízo',
          detail: 'Identificar as 15 referências com menor giro nos últimos 45 dias e criar uma ação de liquidação interna (preço especial com argumento de temporada) libera capital e espaço de prateleira para o produto que realmente vende.',
          badge: { label: 'Gestão ativa', type: 'info' },
        },
      ],
    },
  ],

  juridico: [
    {
      sectionTitle: 'Conformidade & Política de Troca',
      cards: [
        {
          color: C,
          tag: 'TROCA',
          title: 'Política de troca clara reduz conflito e aumenta avaliação no Google',
          detail: 'As reclamações mais comuns em lojas de calçados no Reclame Aqui envolvem dificuldade de troca e prazo de defeito. Uma política de troca bem comunicada no caixa e no WhatsApp reduz conflitos e transforma uma troca em nova venda com cliente satisfeito.',
          badge: { label: 'Reputação', type: 'info' },
        },
        {
          color: C,
          tag: 'CÓDIGO DO CONSUMIDOR',
          title: 'Prazo legal de troca por defeito é 90 dias para produtos não duráveis — equipe precisa saber',
          detail: 'Calçado classificado como produto durável tem prazo de 90 dias para defeito de fabricação (CDC Art. 26). Vendedor que negocia fora do prazo legal cria passivo jurídico. Treinar a equipe no prazo correto evita conflito e mantém a nota no Reclame Aqui.',
          badge: { label: 'Conformidade', type: 'warn' },
        },
      ],
    },
  ],
  administrativo: [],
  comercial: [
    {
      sectionTitle: 'Mix de Marcas, Exclusividade & Estratégia de Canal',
      cards: [
        {
          color: C,
          tag: 'EXCLUSIVIDADE REGIONAL',
          title: 'Lojas multimarca com ao menos 1 acordo de exclusividade regional de marca têm ticket médio 23% maior — e distribuidores de marcas como Usaflex e Diadora oferecem zona de exclusividade sem custo de licença, apenas via formalização com o representante',
          detail: 'Abicalçados Varejo Independente 2025: loja multimarca com pelo menos 1 acordo de exclusividade regional tem ticket médio 23% maior e taxa de retorno de clientes 18 p.p. acima das sem exclusividade. Acordos de exclusividade de zona (raio de 3–10 km) são oferecidos por distribuidores de Usaflex, Diadora e Cravo & Canela sem custo de licença — basta formalizar com o representante. Apenas 31% das independentes em shoppings do interior de SP exploram esse modelo. Fonte: Abicalçados + SEBRAE Varejo Calçadista + Associação dos Lojistas do Interior SP 2025.',
          badge: { label: 'Exclusividade regional: ticket +23% sem custo de licença', type: 'info' },
        },
        {
          color: C,
          tag: 'CONCENTRAÇÃO DE FORNECEDOR',
          title: 'Lojas que dependem de mais de 40% do faturamento em um único fornecedor têm risco de ruptura comercial 3x maior — e o varejo calçadista registrou 34 pedidos de recuperação judicial de distribuidores regionais em 2025',
          detail: 'Abicalçados 2025: dependência >40% em único fornecedor eleva risco de ruptura comercial 3x. 34 pedidos de recuperação judicial de distribuidores e representantes de calçado no Brasil em 2025 — risco real de desabastecimento repentino. Shoppings do interior SP registraram 12 fechamentos de lojas de calçado com ruptura de fornecedor como fator citado no ano. Estratégia de proteção: teto de 25% de participação por fornecedor no mix. Fonte: Abicalçados + SERASA Varejo Moda + ANJOS 2025.',
          badge: { label: '34 distribuidores de calçado em recuperação judicial em 2025', type: 'warn' },
        },
        {
          color: C,
          tag: 'MARCAS PREMIUM REGIONAIS',
          title: 'Marcas premium com distribuição exclusivamente regional têm margem bruta 28% maior que multimarca nacional — e não aparecem no Mercado Livre nem na Netshoes, eliminando a guerra de preço online que derruba o ticket do multimarca convencional',
          detail: 'Marcas com distribuição regional sem presença em Centauro, Renner ou marketplaces: margem bruta média 28% maior vs multimarca nacional. Ausência de concorrência de preço online: produto não encontrado no Mercado Livre ou Amazon. Exemplos com representantes no interior SP: Capodarte, Jorge Bischoff, Griffe, Constance Premium. Lojas multimarca que incluem 2–3 marcas premium regionais têm NPS 14 pontos acima e taxa de devolução 3x menor. Fonte: Abicalçados + COURO MODA + Sindivestuário SP 2025.',
          badge: { label: 'Margem 28% maior sem guerra de preço online', type: 'ok' },
        },
        {
          color: C,
          tag: '58% DAS COMPRAS SÃO IMPULSO',
          title: '58% das compras de calçado em shopping não estavam no plano do cliente ao entrar — e a loja posicionada na rota entre a entrada principal e a praça de alimentação converte 34% mais do que a loja de destino em corredor secundário',
          detail: 'Pesquisa de comportamento de compra em shoppings do interior SP (ALSHOP + Kantar 2025): 58% das compras de calçado não estavam no plano do cliente ao entrar no shopping. Lojas na rota entre entrada principal e praça de alimentação: conversão 34% maior que em corredor secundário. Vitrine com produto da temporada atual é o principal gatilho de entrada por impulso em 67% dos casos. Tempo médio de decisão de compra por impulso: 7 minutos da entrada na loja. Fonte: ALSHOP + Kantar Retail + Abicalçados Comportamento do Consumidor 2025.',
          badge: { label: '58% das compras de calçado em shopping são por impulso', type: 'info' },
        },
        {
          color: C,
          tag: 'CENTAURO AMPLIA PREMIUM',
          title: 'A Centauro elevou calçados premium acima de R$ 400 para 18% do seu sortimento em 2025 — adicionando On Running, Hoka e New Balance 990 e passando a competir diretamente com o multimarca de shopping no segmento esportivo de alto valor',
          detail: 'Centauro Estratégia de Mix 2025: calçados premium (>R$ 400) representam 18% do sortimento vs 9% em 2023. Marcas adicionadas: ASICS Gel-Nimbus, New Balance 990, On Running, Hoka One One. Ticket médio de calçado Centauro: subiu de R$ 212 para R$ 298 em 2 anos. Impacto no multimarca de shopping: clientes de tênis esportivo premium que antes só encontravam no multimarca agora têm opção dentro do mesmo corredor. Diferenciação possível: marcas sem distribuição Centauro (Diadora exclusivo, Usaflex, Capodarte). Fonte: Centauro RI + Abicalçados + Euromonitor Calçados Brasil 2025.',
          badge: { label: 'Centauro: premium passou de 9% para 18% do mix em 2 anos', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Canal Digital, Fornecedor, Marca Própria & Mercado',
      cards: [
        {
          color: C,
          tag: 'FÍSICO VS ONLINE',
          title: 'Lojas multimarca de calçado com canal online ativo têm faturamento 41% maior que as que operam só no físico — mas 73% das independentes em shoppings do interior SP ainda não têm presença digital além do WhatsApp',
          detail: 'Abicalçados + E-commerce Brasil 2025: multimarca com canal digital ativo (Mercado Livre, site próprio ou Instagram Shop) fatura 41% mais que as exclusivamente físicas. 73% das lojas multimarca em shoppings do interior SP sem presença digital estruturada. Canal digital não canibaliza o físico no varejo calçadista: 68% dos clientes que compram online retiram na loja ou compram segunda peça presencialmente. Custo de entrada no Mercado Livre: R$ 0 fixo + comissão de 12–16% por venda. Fonte: Abicalçados + E-commerce Brasil + ALSHOP 2025.',
          badge: { label: '73% das independentes no interior SP sem canal digital', type: 'info' },
        },
        {
          color: C,
          tag: 'COMPRA ANTECIPADA — PRAZO JUL/AGO',
          title: 'Representantes de calçado fecham os pedidos de coleção de inverno entre julho e agosto — loja que não confirma no prazo perde os tamanhos 37–39 feminino e fica com o que sobrou da grade após os grandes varejistas confirmarem volume',
          detail: 'Abicalçados 2025: ciclo de compra antecipada — coleção inverno (junho–agosto): pedidos fechados em julho–agosto do ano anterior. Tamanhos 37–39 (feminino) e 40–42 (masculino) esgotam primeiro na grade dos representantes, especialmente em marcas com produção limitada. Grandes varejistas (Renner, C&A, Centauro) têm prioridade de grade por volume. Independente que confirma em setembro compra o que sobrou. Adiantamento mínimo por pedido: 30–50% do valor; saldo na entrega. Fonte: Abicalçados + ASSINTECAL + Sindivestuário SP 2025.',
          badge: { label: 'Janela de compra de inverno: jul–ago — fora do prazo, sobra de grade', type: 'warn' },
        },
        {
          color: C,
          tag: 'MARCA PRÓPRIA — VALE DOS SINOS',
          title: 'Multimarca que desenvolve linha própria com fabricante do Vale dos Sinos opera com margem de 52–68% vs 22–34% do produto revendido — modelo adotado por 14% das independentes do Sul e Sudeste com mais de 80 referências no mix',
          detail: 'Vale dos Sinos (RS): polo calçadista com 500+ fabricantes que aceitam produção a partir de 100 pares por referência. Margem na marca própria: 52–68% vs 22–34% no multimarca revendido. Custo de desenvolvimento de coleção própria (6 referências): R$ 8.000–18.000. 14% das independentes do Sul e Sudeste com 80–200 referências já operam linha própria. Diferencial: produto exclusivo sem concorrência de preço no Mercado Livre ou na Centauro. Fonte: Abicalçados + ASSINTECAL + SEBRAE Polo Calçadista 2025.',
          badge: { label: 'Marca própria: margem 52–68% vs 22–34% no revendido', type: 'ok' },
        },
        {
          color: C,
          tag: 'FORNECEDOR QUE VENDE DIRETO',
          title: '38% das marcas de calçado esportivo e moda já vendem diretamente ao consumidor via loja própria ou marketplace — criando concorrência direta de preço com os multimarcas que as revendem, com diferença média de 12–18% a favor do canal da marca',
          detail: 'Abicalçados + E-commerce Brasil 2025: 38% das marcas com distribuição multimarca também operam D2C — loja própria física, site oficial ou perfil ativo no Mercado Livre/Shopee. Diferença média de preço D2C vs multimarca: 12–18% mais barato no canal da própria marca. Cliente que encontra o produto na loja pesquisa o preço no site da marca antes de fechar. Marcas que proíbem D2C em contrato de distribuição: minoria — principalmente exclusivos regionais. Fonte: Abicalçados + E-commerce Brasil + NielsenIQ Moda 2025.',
          badge: { label: '38% das marcas competem direto com quem as revende', type: 'warn' },
        },
        {
          color: C,
          tag: 'BRASIL — 3º CONSUMIDOR MUNDIAL',
          title: 'O Brasil é o 3º maior consumidor de calçados do mundo com 900 milhões de pares vendidos em 2025 — mas gasta em média R$ 127 por par, menos de um terço da média europeia, indicando enorme espaço de premiumização ainda inexplorado no interior SP',
          detail: 'Abicalçados Anuário 2025 + World Footwear Yearbook: Brasil consome 900 mi de pares/ano — 3º maior mercado mundial (atrás de China e EUA). Gasto médio por par: R$ 127. Comparativo: Europa €68 (≈R$ 374). Crescimento do segmento premium (acima de R$ 300): +22% em 2025, 3x acima do mercado geral (+7%). Interior SP: crescimento de consumo per capita de calçado premium +19% em 2025 — acima da média nacional. Fonte: Abicalçados + Euromonitor + World Footwear Yearbook 2025.',
          badge: { label: 'Premium calçado +22% em 2025 — 3x acima do mercado geral', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Studio Z, Infantil, Contrato, Mix & Monomarca',
      cards: [
        {
          color: C,
          tag: 'STUDIO Z — DROPS COLABORATIVOS',
          title: 'A Studio Z lançou em 2025 programa de drops com marcas regionais de streetwear — 4 edições limitadas por ano que esgotam em 72 horas e geram cobertura orgânica nas redes sem verba de mídia nacional',
          detail: 'Studio Z Programa Colaborativo 2025: 4 drops/ano com marcas regionais de streetwear e artistas locais. Modelo: 200–400 pares por drop, preço 30–40% acima da linha padrão, lançamento em loja física + Instagram com contagem regressiva. Taxa de esgotamento em 72h: 100% dos drops do 1º ano. NPS pós-drop: 84 vs média da rede de 61. Custo de produção incremental equivalente a 1 vitrine de lançamento. Multimarcas independentes podem replicar o modelo com produtoras locais a partir de 50 pares. Fonte: Studio Z RI + Abicalçados Varejo Calçadista + ALSHOP 2025.',
          badge: { label: 'Studio Z: drops esgotam em 72h sem verba de mídia', type: 'warn' },
        },
        {
          color: C,
          tag: 'CALÇADO INFANTIL — RECOMPRA COMPULSÓRIA',
          title: 'Criança de 2 a 10 anos consome em média 3,4 pares por ano por crescimento — taxa de retorno espontâneo no varejo infantil de calçado é 68% vs 31% no adulto, e 43% das lojas multimarca esportiva de shopping ignoram o segmento',
          detail: 'Abicalçados 2025: criança de 2–10 anos consome 3,4 pares/ano (recompra compulsória por crescimento de pé). Taxa de retorno espontâneo: 68% no infantil vs 31% no adulto. Ticket médio infantil: R$ 98–180. Margem em marcas infantis (Kidy, Bibi, Pampili): 34–48% — acima da média do multimarca adulto. 43% das lojas multimarca esportiva de shopping não trabalham infantil por foco no público adulto, deixando a categoria para concorrentes especializados. Fonte: Abicalçados + IBGE Consumo Família + ALSHOP 2025.',
          badge: { label: 'Infantil: recompra 3,4×/ano, retorno espontâneo 68%', type: 'ok' },
        },
        {
          color: C,
          tag: 'DEVOLUÇÃO SEM CLÁUSULA',
          title: '62% dos contratos de fornecimento de calçado para multimarca não incluem cláusula de devolução de estoque não vendido — loja que não negocia esse ponto na compra antecipada fica com capital imobilizado sem saída',
          detail: 'Abicalçados + SEBRAE Varejo 2025: 62% dos contratos de fornecimento de calçado para multimarca sem cláusula de devolução de estoque não vendido. Custo médio de estoque parado >90 dias por loja de shopping: R$ 18.400/ano. Fornecedores que aceitam devolução parcial (30–40% da coleção) existem — mas apenas quando negociado explicitamente no pedido, não como prática padrão. Ponto de negociação: prazo de devolução de 90 dias após entrega, sem desconto na próxima coleção. Fonte: Abicalçados + SEBRAE Gestão Calçadista + ASSINTECAL 2025.',
          badge: { label: '62% dos contratos sem cláusula de devolução de estoque', type: 'warn' },
        },
        {
          color: C,
          tag: 'TÊNIS VS SOCIAL — VOLUME VS MARGEM',
          title: 'Tênis representa 62% do volume de pares vendidos no varejo brasileiro mas apenas 41% do faturamento — calçado social e couro tem ticket médio 2,3x maior com metade do giro. O multimarca que equilibra o mix captura os dois padrões de compra',
          detail: 'Abicalçados Anuário 2025: tênis = 62% do volume de pares, 41% do faturamento. Calçado social (couro, moda feminina, bota): 24% do volume, 38% do faturamento. Ticket médio tênis: R$ 189. Ticket médio couro/social: R$ 434. Frequência de recompra: tênis 1,8×/ano vs social 0,9×/ano. Loja com mix equilibrado (40% tênis + 40% social + 20% conforto) captura os dois perfis de compra sem depender de sazonalidade de um único segmento. Fonte: Abicalçados Anuário + Euromonitor Calçados Brasil 2025.',
          badge: { label: 'Tênis: ticket R$ 189 vs social/couro: R$ 434', type: 'info' },
        },
        {
          color: C,
          tag: 'MULTIMARCA VS MONOMARCA',
          title: 'Franquias monomarca têm conversão 34% maior que o multimarca — mas o multimarca fecha com ticket 34% acima quando converte, por cross-sell e comparação interna. O NPS pós-compra favorece o multimarca: 71 vs 68',
          detail: 'Abicalçados + ABF 2025: lojas monomarca (franquia de único fornecedor) têm conversão 34% maior (cliente entra com intenção declarada). Ticket médio monomarca: 18% menor que o multimarca comparável no mesmo shopping. Multimarca: conversão 19% menor — mas ticket quando fecha: 34% maior por cross-sell e comparação interna entre marcas. NPS pós-compra: multimarca 71 vs monomarca 68. Multimarca que treina conversão captura a vantagem de ticket sem precisar do volume de tráfego da franquia. Fonte: Abicalçados + ABF + ALSHOP Varejo Moda 2025.',
          badge: { label: 'Multimarca: ticket +34% quando converte vs monomarca', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Lifestyle, Black Friday, Running, Devolução & Assinatura',
      cards: [
        {
          color: C,
          tag: 'TÊNIS COMO LIFESTYLE',
          title: '71% dos tênis vendidos em lojas esportivas no Brasil são usados exclusivamente como calçado urbano casual — nunca para prática esportiva. O cliente compra com argumento técnico mas decide pela estética, e o mix que ignora isso perde conversão',
          detail: 'Abicalçados + Euromonitor 2025: 71% dos tênis vendidos em lojas esportivas são usados como lifestyle (urbano/casual), não para esporte. Compra motivada por identidade e estética, não por performance técnica. Tênis visualmente atrativo com performance mediana supera em vendas o tênis tecnicamente superior com design neutro. Interior SP: crescimento da categoria lifestyle +28% em 2025 vs performance +9%. Fonte: Abicalçados + Euromonitor Footwear + Kantar Brand Footprint 2025.',
          badge: { label: '71% dos tênis esportivos são usados como moda urbana', type: 'info' },
        },
        {
          color: C,
          tag: 'BLACK FRIDAY — NEGOCIAR ATÉ SETEMBRO',
          title: 'Lojas que não fecham acordo de margem especial com fornecedor até setembro não conseguem oferecer desconto real na Black Friday — e 63% dos compradores em shopping pesquisam o preço histórico no smartphone antes de fechar',
          detail: 'Abicalçados + Procon-SP 2025: varejistas que fecham acordo de margem especial com fornecedor antes de setembro conseguem desconto real de 20–35% na Black Friday. Lojas sem negociação antecipada recorrem a "preço cheio inflado + desconto fictício" — prática monitorada pelo Procon via histórico de preços desde 2023. 63% dos compradores em shopping do interior SP pesquisam o preço histórico no smartphone antes de comprar. Risco: reclamação no Procon + Reclame Aqui + queda de NPS. Fonte: Abicalçados + Procon-SP + E-commerce Brasil 2025.',
          badge: { label: 'Janela para negociar margem Black Friday: até setembro', type: 'warn' },
        },
        {
          color: C,
          tag: 'RUNNING E TRAIL — JANELA ABERTA',
          title: 'Running e trail cresceram 34% no interior SP em 2025 — e marcas como ASICS, Mizuno e Hoka ainda têm distribuição concentrada nas capitais, deixando shoppings do interior sem ponto de venda e abrindo janela para o multimarca que se credenciar primeiro',
          detail: 'Abicalçados 2025: categoria running/trail no Brasil cresceu 34% em 2025. Buscas por "tênis de corrida" e "tênis trail" no interior SP: +41% (Google Trends jan–jun 2025). Marcas de performance (ASICS Gel, Mizuno Wave, Hoka, Brooks): distribuição concentrada em lojas especializadas nas capitais — shopping a 60km+ de SP raramente tem ponto de venda dessas marcas. Loja multimarca que se credencia com representante de 1 marca de running captura demanda sem concorrência direta no raio de 30km. Fonte: Abicalçados + Google Trends + ASSINTECAL 2025.',
          badge: { label: 'Running/trail +34% no interior SP — sem concorrência local', type: 'ok' },
        },
        {
          color: C,
          tag: 'DEVOLUÇÃO ONLINE: 31%',
          title: 'A taxa de devolução de calçado comprado online é 31% — contra 3,2% no físico — e 68% das devoluções são por problema de tamanho. O varejo físico tem vantagem estrutural permanente que nenhum e-commerce replica: o cliente experimenta antes de comprar',
          detail: 'E-commerce Brasil + Abicalçados 2025: taxa de devolução de calçado online: 31% vs 3,2% no físico. 68% das devoluções online: tamanho errado. 22%: produto diferente do esperado. 10%: qualidade. Custo de logística reversa por devolução: R$ 28–45. Margem líquida do calçado online após devoluções: 4–8% vs 18–24% no físico. O calçado é a categoria com maior taxa de devolução do e-commerce brasileiro. Fonte: E-commerce Brasil + Abicalçados + Correios Logística 2025.',
          badge: { label: 'Devolução online calçado: 31% vs 3,2% no físico', type: 'info' },
        },
        {
          color: C,
          tag: 'SONHO DOS PÉS — CLUBE DE ASSINATURA',
          title: 'A Sonho dos Pés lançou em 2025 clube de assinatura de calçado por R$ 89/mês — 2 trocas de par por semestre, 8.200 assinantes no interior SP no 1º semestre, com assinante visitando a loja 4,2x por semestre vs 1,1x do cliente convencional',
          detail: 'Sonho dos Pés Clube Calçado (2025): assinatura R$ 89/mês dá direito a 2 trocas de par por semestre (valor até R$ 280/par). Assinante visita a loja 4,2×/semestre vs 1,1× do cliente não-assinante. 8.200 assinantes no interior SP no 1º semestre. Receita recorrente garantida fora do pico de Black Friday e datas comemorativas. Ticket complementar em itens fora do clube: R$ 94/visita. Modelos de assinatura em moda cresceram 68% no Brasil em 2025. Fonte: Sonho dos Pés RI + Abicalçados + ABF 2025.',
          badge: { label: 'Sonho dos Pés: assinante visita 4,2× vs 1,1× do cliente comum', type: 'warn' },
        },
      ],
    },
  ],
  compras: [],
  ti: [],
  atendimento: [],
};
