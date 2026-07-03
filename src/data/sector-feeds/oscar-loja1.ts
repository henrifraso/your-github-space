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
  comercial: [],
  compras: [],
  ti: [],
  atendimento: [],
};
