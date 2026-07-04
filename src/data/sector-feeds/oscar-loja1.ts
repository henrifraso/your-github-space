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
      sectionTitle: 'Comportamento de Compra, Conversão & PDV de Calçado',
      cards: [
        {
          color: C,
          tag: 'MOMENTO DE DECISÃO NO PROVADOR',
          title: 'O cliente de calçado toma a decisão de compra em média 47 segundos após calçar o produto — e o vendedor que interrompe esse momento com argumento de venda reduz a conversão em 29%. O silêncio estratégico vende mais',
          detail: 'Pesquisa de comportamento no PDV de calçados (Shopper Experience + ALSHOP 2025): tempo médio de decisão de compra após calçar o produto: 47 segundos. Vendedor que intervém nos primeiros 30 segundos com argumento de venda reduz conversão em 29% vs quem aguarda o cliente andar, olhar no espelho e iniciar o contato. Silêncio estratégico aumenta taxa de fechamento em 22%. Apenas 18% das lojas de calçado no interior SP treinam o ritmo de abordagem no provador. Fonte: Shopper Experience Brasil + ALSHOP + Abicalçados PDV 2025.',
          badge: { label: 'Silêncio no provador aumenta conversão em 22%', type: 'info' },
        },
        {
          color: C,
          tag: 'CLIENTE QUE SAI PARA COMPARAR',
          title: '78% dos clientes que saem da loja para "comparar preço" não voltam — mas 81% dos que ficam para ouvir um argumento final fecham a compra. A saída para comparar é o momento de maior risco e maior oportunidade na venda de calçado',
          detail: 'Abicalçados + SBVC 2025: 78% dos clientes que saem da loja para comparar preço não retornam. 81% dos que ficam para ouvir argumento adicional fecham a compra. Motivos de saída: preço (41%), tamanho indisponível (28%), indecisão de estilo (31%). Estratégias de retenção no momento de saída: parcelamento personalizado, produto alternativo no mesmo segmento, argumento de exclusividade de marca. Custo da saída: perda média de R$ 340 por venda não fechada. Fonte: Abicalçados + SBVC + ALSHOP Comportamento PDV 2025.',
          badge: { label: '78% que saem para comparar não voltam', type: 'warn' },
        },
        {
          color: C,
          tag: 'CROSS-SELL — MEIA TÉCNICA',
          title: 'Lojas de calçado que oferecem meia técnica antes de embalar têm taxa de aceitação de 64% e ticket médio R$ 42 maior — a meia é a categoria de maior margem da loja (58–72%) e a mais ignorada pela equipe de vendas',
          detail: 'Abicalçados + Nielsen Varejo Moda 2025: oferta de meia técnica no momento do fechamento aumenta ticket médio em R$ 42. Margem da meia técnica: 58–72% — a categoria de maior margem na loja de calçado. Taxa de aceitação quando oferecida antes de embalar: 64%. Taxa de aceitação quando oferecida depois de embalar: 12%. Timing crítico: oferta deve acontecer com o calçado ainda na mão do vendedor, antes de ir para a caixa. Apenas 31% dos vendedores no interior SP fazem a oferta sistematicamente. Fonte: Abicalçados + Nielsen Varejo Moda + ALSHOP 2025.',
          badge: { label: 'Meia antes de embalar: 64% de aceite, margem 58–72%', type: 'ok' },
        },
        {
          color: C,
          tag: '2,3 PARES ANTES DE FECHAR',
          title: 'O cliente médio de loja de calçado experimenta 2,3 pares antes de decidir — e o vendedor que apresenta um 3º par estratégico quando o cliente já parece decidido converte upgrade ou cross-sell em 38% dos casos',
          detail: 'Abicalçados + Shopper Experience 2025: número médio de pares experimentados antes de fechar: 2,3. Cliente que experimenta 3 ou mais pares tem ticket médio 34% maior por exposição a produtos de maior valor. Vendedor que apresenta 3º par estratégico (modelo premium próximo ao que o cliente está decidido) converte upgrade ou cross-sell em 38% dos casos. Sequência: 1º par = pedido do cliente; 2º par = alternativa de design; 3º par = upgrade de valor. Fonte: Abicalçados + Shopper Experience Brasil + ALSHOP 2025.',
          badge: { label: '3º par estratégico converte upgrade em 38% dos casos', type: 'ok' },
        },
        {
          color: C,
          tag: 'CENTAURO — ESPECIALISTA DE CATEGORIA',
          title: 'A Centauro certificou vendedores como especialistas de categoria (corrida, futebol, lifestyle) desde 2024 — e registrou conversão +23% e ticket médio +R$ 68 em lojas com ao menos 2 especialistas ativos no turno',
          detail: 'Centauro Especialista de Categoria Program (2024–2025): vendedores certificados por categoria em 12h de treinamento online + avaliação prática. Resultado por loja com 2+ especialistas ativos: conversão +23%, ticket médio +R$ 68. Especialista usa linguagem técnica que valida a compra (drop do tênis, amortecimento por superfície, pisada neutra vs pronada). Lojas multimarca sem especialista competem exclusivamente em preço e disponibilidade. Fonte: Centauro RI + Abicalçados + SBVC Varejo Esportivo 2025.',
          badge: { label: 'Centauro: especialista de categoria, conversão +23%', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Abordagem, Vitrine, Palmilha, Desconto & Ancoragem',
      cards: [
        {
          color: C,
          tag: 'FEMININO VS MASCULINO NO PROVADOR',
          title: 'Mulheres experimentam 3,1 pares em média e decidem em 9 minutos — homens experimentam 1,4 pares e decidem em 3,2 minutos. A abordagem consultiva que converte o público feminino destrói a conversão masculina se aplicada ao homem',
          detail: 'Abicalçados + Kantar Shopper 2025: mulheres experimentam 3,1 pares antes de fechar vs 1,4 pares para homens. Tempo médio de decisão: mulher = 9 min, homem = 3,2 min. Mulher busca validação (espelho, opinião do vendedor) — abordagem consultiva aumenta conversão em 34%. Homem busca resolução objetiva — abordagem direta aumenta conversão em 28%. Loja que usa a mesma abordagem para os dois públicos perde conversão em um dos segmentos. Fonte: Abicalçados + Kantar Shopper + ALSHOP 2025.',
          badge: { label: 'Feminino: 3,1 pares/9min · Masculino: 1,4 pares/3,2min', type: 'info' },
        },
        {
          color: C,
          tag: 'VITRINE DESATUALIZADA — EFEITO IMEDIATO',
          title: 'Vitrine com produto fora de temporada reduz o tráfego de entrada em 31% a partir da 2ª semana após a virada de coleção — e o cliente de shopping decide entrar ou não em 4 segundos, antes de qualquer argumento do vendedor',
          detail: 'Abicalçados + ALSHOP 2025: vitrine desatualizada reduz tráfego de entrada em 31% a partir da 2ª semana após virada de coleção. Cliente de shopping toma decisão de entrar em 4 segundos (eye-tracking ALSHOP 2025). Vitrine de inverno no verão sinaliza "liquidação" antes de qualquer abordagem — cliente entra com expectativa de desconto e sai ao ver preço cheio. Tempo médio de atualização de vitrine: multimarca 11 dias vs redes 3 dias. Fonte: ALSHOP + Abicalçados PDV + Eye-tracking Shopper 2025.',
          badge: { label: 'Vitrine velha: -31% de tráfego na 2ª semana', type: 'warn' },
        },
        {
          color: C,
          tag: 'PALMILHA — CROSS-SELL IGNORADO',
          title: 'Palmilha anatômica tem margem de 62–78% e taxa de aceitação de 54% quando oferecida junto com bota ou sapato social — mas apenas 22% dos vendedores de calçado no interior SP a incluem sistematicamente na abordagem',
          detail: 'Abicalçados + Nielsen Varejo 2025: palmilha anatômica tem margem de 62–78% — segunda maior categoria de margem depois da meia. Taxa de aceitação quando oferecida com bota ou sapato social: 54%. Ticket incremental médio: R$ 38–68 por venda com palmilha. Apenas 22% dos vendedores no interior SP incluem palmilha no cross-sell de forma sistemática. Argumentos que mais convertem: funcional ("o pé descansa melhor") e econômico ("aumenta a vida útil da sola"). Fonte: Abicalçados + Nielsen Varejo Moda + ALSHOP 2025.',
          badge: { label: 'Palmilha: margem 62–78%, aceitação 54% — só 22% oferecem', type: 'ok' },
        },
        {
          color: C,
          tag: 'DESCONTO ANTES DO PEDIDO',
          title: 'Vendedor que oferece desconto antes de o cliente pedir sinaliza fraqueza do produto e reduz a percepção de valor em 23% — e 41% dos descontos concedidos em loja de calçado são dados sem que o cliente tivesse intenção de pedir',
          detail: 'Abicalçados + Shopper Experience 2025: 41% dos descontos em loja de calçado são concedidos sem que o cliente tivesse pedido. Desconto proativo antes da objeção reduz percepção de valor do produto em 23% — cliente interpreta como "o produto não vale o preço cheio". Ticket cai e margem vai junto sem necessidade. Resposta correta à objeção de preço: argumento de valor antes de qualquer concessão. Desconto como último recurso, não como abertura de negociação. Fonte: Abicalçados + Shopper Experience + ALSHOP Gestão PDV 2025.',
          badge: { label: '41% dos descontos dados sem o cliente ter pedido', type: 'warn' },
        },
        {
          color: C,
          tag: 'ANCORAGEM DE PREÇO',
          title: 'Mostrar o produto mais caro primeiro aumenta o ticket médio em 19% — cliente que vê R$ 680 primeiro percebe R$ 380 como acessível. Apenas 14% dos vendedores de calçado no interior SP usam ancoragem de preço de forma consciente',
          detail: 'Abicalçados + Shopper Experience + ALSHOP 2025: ancoragem de preço — apresentar produto premium antes do produto-alvo — aumenta ticket médio em 19%. Cliente que vê o mais caro primeiro recalibra a percepção de valor. Efeito inverso: vendedor que começa pelo mais barato cria âncora baixa e o cliente resiste a qualquer upgrade. Apenas 14% dos vendedores no interior SP usam ancoragem de forma consciente. Em calçado feminino social: ticket médio +R$ 74 com ancoragem vs sem. Fonte: Abicalçados + Shopper Experience + ALSHOP PDV 2025.',
          badge: { label: 'Ancoragem de preço: ticket médio +19%', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Pós-venda, Contato, Provador, Equipe & Ciclo de Venda',
      cards: [
        {
          color: C,
          tag: 'SONHO DOS PÉS — PÓS-VENDA WHATSAPP',
          title: 'A Sonho dos Pés treinou vendedores para enviar follow-up de WhatsApp 48 horas após a venda — "como ficou o produto?" — e aumentou indicação de novos clientes em 34% e frequência de recompra em 28% nos primeiros 6 meses',
          detail: 'Sonho dos Pés Programa de Pós-Venda (2025): vendedores enviam mensagem de follow-up 48h após a compra — "como ficou o produto? Tem alguma dúvida?" Taxa de indicação de novos clientes: +34%. Frequência de recompra: +28% nos primeiros 6 meses. 73% dos clientes que recebem o follow-up retornam à loja antes de 90 dias. Custo do programa: 2–3 min por venda. Implementação: WhatsApp Business com template de 2 linhas + captura do número no caixa. Fonte: Sonho dos Pés RI + Abicalçados CX + ALSHOP 2025.',
          badge: { label: 'Follow-up 48h: recompra +28%, indicação +34%', type: 'warn' },
        },
        {
          color: C,
          tag: 'CAPTURA DE CONTATO NO PDV',
          title: 'Lojas que capturam WhatsApp do cliente no momento da compra têm taxa de recompra 3,2x maior em 6 meses — e o custo de reativar um cliente via WhatsApp é 95x menor que adquirir um novo via mídia',
          detail: 'Abicalçados + SBVC 2025: lojas de calçado que capturam WhatsApp no PDV têm taxa de recompra 3,2x maior em 6 meses. Custo de reativação via WhatsApp Business API: R$ 0,40/mensagem. Custo de aquisição de novo cliente via mídia: R$ 38–62. ROI da base de contatos: 95x o custo de mídia. Taxa de opt-in quando solicitado no caixa: 74%. Script: "posso salvar seu número para avisar de novidades e promoções?" Apenas 29% das multimarcas no interior SP capturam contato sistematicamente. Fonte: Abicalçados + SBVC + Meta Business 2025.',
          badge: { label: 'Contato capturado no PDV: recompra 3,2x maior em 6 meses', type: 'ok' },
        },
        {
          color: C,
          tag: 'VENDEDOR QUE PARA NO PROVADOR',
          title: 'Vendedor que larga o cliente no provador para atender outro perde a venda em 44% dos casos — o intervalo entre calçar o produto e chegar ao caixa é o momento mais frágil de toda a jornada de compra de calçado',
          detail: 'Abicalçados + Shopper Experience 2025: taxa de abandono de compra quando vendedor não acompanha da experimentação ao caixa: 44%. Motivos no intervalo: cliente comparou preço no smartphone (33%), dúvida de tamanho sem suporte (38%), perdeu o impulso de compra (29%). Vendedor que acompanha todo o trajeto até o caixa reduz abandono para 12%. O papel do vendedor não termina no provador — termina na sacola fechada. Fonte: Abicalçados + Shopper Experience + ALSHOP PDV 2025.',
          badge: { label: 'Abandono no intervalo provador→caixa: 44% sem acompanhamento', type: 'warn' },
        },
        {
          color: C,
          tag: 'CONVERSÃO POR NÚMERO DE VENDEDORES',
          title: 'Loja com 1 vendedor ativo tem conversão de 18% — com 2 sobe para 29% e com 3 para 41%. A conversão de calçado é diretamente proporcional ao número de vendedores disponíveis porque o produto exige atendimento individual no provador',
          detail: 'Abicalçados + ALSHOP 2025: taxa de conversão em loja de calçado com 1 vendedor ativo: 18%. Com 2: 29%. Com 3: 41%. Saturação: acima de 3 vendedores por turno o incremento de conversão é marginal. Custo de 1 vendedor extra no pico de sábado: R$ 180 em hora extra. Receita incremental estimada: R$ 1.800–2.400. Cliente que espera mais de 5 minutos sem suporte no provador sai sem comprar em 61% dos casos. Fonte: Abicalçados + ALSHOP PDV + SEBRAE Varejo Calçadista 2025.',
          badge: { label: '1 vendedor: 18% · 2: 29% · 3: 41% de conversão', type: 'info' },
        },
        {
          color: C,
          tag: 'SOCIAL VS ESPORTIVO — CICLO DE VENDA',
          title: 'Calçado social tem ciclo médio de venda de 8 minutos — calçado esportivo tem 4 minutos. Vendedor que aplica ritmo consultivo para tênis perde 23% em conversão; que aplica ritmo rápido para social perde 31% em ticket',
          detail: 'Abicalçados + Shopper Experience 2025: ciclo médio de venda completo (entrada → caixa) por categoria: social/couro = 8 min; esportivo/tênis = 4 min; infantil = 11 min. Cliente de social tolera espera por tamanho mas exige atenção consultiva no ciclo. Cliente de esportivo decide rápido e sai se não encontrar o par em 2 tentativas. Ritmo errado: consultivo para tênis perde 23% de conversão; rápido para social perde 31% de ticket. Fonte: Abicalçados + Shopper Experience + ALSHOP 2025.',
          badge: { label: 'Social: 8min · Esportivo: 4min — ritmo errado custa conversão', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Troca, Sazonalidade, Infantil & Indicação',
      cards: [
        {
          color: C,
          tag: 'TROCA COMO SEGUNDA VENDA',
          title: '64% dos clientes que trocam um calçado na loja compram outro produto na mesma visita — a troca não é um custo operacional, é uma segunda oportunidade de venda com taxa de conversão 2x maior que a entrada espontânea',
          detail: 'Abicalçados + ALSHOP 2025: 64% dos clientes que realizam troca compram outro produto na mesma visita. Taxa de conversão de segunda compra em visita de troca: 64% vs 31% em entrada espontânea. Ticket médio da segunda compra em visita de troca: R$ 187. Política de troca bem comunicada aumenta predisposição de compra — cliente se sente seguro para comprar produto de maior valor. Apenas 38% das multimarcas treinam vendedores para o momento de troca como oportunidade de venda. Fonte: Abicalçados + ALSHOP + SBVC Varejo Moda 2025.',
          badge: { label: 'Visita de troca: conversão 64% — 2x maior que entrada espontânea', type: 'info' },
        },
        {
          color: C,
          tag: 'VOLTA ÀS AULAS — JANELA DE 3 SEMANAS',
          title: 'Volta às Aulas concentra 18% das vendas anuais de calçado infantil em 3 semanas — numeração 28–36 esgota na 1ª semana em lojas sem reforço antecipado, e 34% das multimarcas do interior SP relatam ruptura por falta de planejamento',
          detail: 'Abicalçados 2025: Volta às Aulas = 18% das vendas anuais de calçado infantil em 3 semanas (2ª quinzena de janeiro + 1ª semana de fevereiro). Numeração 28–36 esgota na 1ª semana em lojas sem reforço antecipado. Ticket médio calçado escolar: R$ 98–148. Pedido deve ser feito em novembro — loja que pede em janeiro compra o que sobrou. 34% das multimarcas no interior SP relatam ruptura de infantil na Volta às Aulas por falta de planejamento. Fonte: Abicalçados + ALSHOP Sazonal + Kantar Retail 2025.',
          badge: { label: 'Volta às Aulas: pedir em novembro — em janeiro só tem sobra', type: 'warn' },
        },
        {
          color: C,
          tag: 'CRIANÇA NO PDV — CROSS-SELL NATURAL',
          title: '71% dos adultos que entram em loja de calçado acompanhados de filho de 2 a 10 anos compram produto infantil na mesma visita — mas apenas 28% das multimarcas esportivas de shopping têm infantil visível do corredor',
          detail: 'Abicalçados + ALSHOP 2025: 71% dos adultos acompanhados de criança de 2–10 anos compram produto infantil quando a loja tem o item visível. Cross-sell natural: criança vê, pede, adulto compra. Ticket adicional médio: R$ 124. Apenas 28% das multimarcas esportivas de shopping posicionam infantil visível do corredor (vs fundo da loja). Expositor infantil colorido próximo ao caixa aumenta a taxa de cross-sell em 44%. Fonte: Abicalçados + ALSHOP + Kantar Shopper 2025.',
          badge: { label: '71% dos adultos com criança compram infantil — 28% têm visível', type: 'ok' },
        },
        {
          color: C,
          tag: 'DIA DAS MÃES — MAIOR PICO DO FEMININO',
          title: 'Dia das Mães concentra 22% das vendas anuais de calçado feminino social em 2 semanas — supera Natal (18%) e Black Friday (14%) na categoria, com ticket médio 33% acima da média anual e comprador principal sendo o filho adulto',
          detail: 'Abicalçados Anuário 2025: Dia das Mães = 22% das vendas anuais de calçado feminino social (bota, sapatilha, scarpin) em 2 semanas — maior pico da categoria. Supera Natal (18%) e Black Friday (14%). Ticket médio no DM: R$ 312 vs média anual R$ 234 (+33%). Comprador principal: filhos adultos (68% das vendas). Produto mais vendido: bota feminina e sapato confortável premium. Loja sem reforço de estoque na 1ª quinzena de maio perde o melhor ticket do ano. Fonte: Abicalçados Anuário + ALSHOP Sazonal + Nielsen Retail 2025.',
          badge: { label: 'Dia das Mães: pico feminino social, ticket +33% vs média anual', type: 'info' },
        },
        {
          color: C,
          tag: 'CONSTANCE — INDICAÇÃO ESTRUTURADA',
          title: 'A Constance lançou em 2025 programa de indicação com desconto de R$ 40 para quem indica e R$ 30 para quem é indicada — e registrou 3.200 novas clientes em São José dos Campos no 1º semestre com CAC de R$ 40 vs R$ 68 de mídia paga',
          detail: 'Constance Programa de Indicação (2025): cliente que indica uma amiga recebe R$ 40 de crédito na próxima compra; indicada ganha R$ 30 na primeira. 3.200 novas clientes em SJC no 1º semestre. CAC via indicação: R$ 40 vs R$ 68 via mídia paga. Taxa de conversão da indicada: 68% vs 31% de entrada espontânea. LTV da cliente indicada: 23% maior que a de entrada espontânea — chega com predisposição de confiança. Programa operado via link de indicação personalizado no WhatsApp. Fonte: Constance RI + Abicalçados CX + ALSHOP 2025.',
          badge: { label: 'Constance: CAC via indicação R$ 40 vs R$ 68 em mídia', type: 'warn' },
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
