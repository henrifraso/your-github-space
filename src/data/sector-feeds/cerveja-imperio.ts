import type { CompanySectorFeeds } from '../../types';

const C = '#b8860b';

export const CERVEJA_IMPERIO_SECTOR_FEEDS: CompanySectorFeeds = {
  marketing: [
    {
      sectionTitle: 'Presença de Marca & PDV',
      cards: [
        {
          color: C,
          tag: 'MARCA',
          title: 'Presença da Cerveja Império em bares e restaurantes pode indicar raio de influência regional',
          detail: 'Monitorar visibilidade da marca em pontos de consumo imediato (bares, restaurantes, baladas) tende a revelar regiões com maior potencial de giro e fidelização. Presença de material de PDV (balde de gelo, toalha, porta-copos) é sinal de comprometimento do ponto com a marca.',
          badge: { label: 'Sinal inicial', type: 'info' },
        },
        {
          color: C,
          tag: 'REPUTAÇÃO',
          title: 'Percepção de "cerveja premium regional" pode ser vantagem frente a marcas nacionais de massa',
          detail: 'Cervejas artesanais e regionais crescem em participação no consumo de bares no Sudeste. Posicionar a Império como referência de qualidade serrana (Petrópolis) pode criar diferenciação frente a marcas de maior escala com menor identidade local.',
          badge: { label: 'Oportunidade', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Campanhas & Sazonalidade',
      cards: [
        {
          color: C,
          tag: 'SAZONAL',
          title: 'Verão concentra maior volume de vendas em bebidas — janela de visibilidade de marca',
          detail: 'O período entre outubro e março tende a representar pico de consumo para cervejas no Brasil. Ações de marketing próximas ao Carnaval e datas de verão podem ampliar penetração em novos pontos de venda e reforçar recall de marca em distribuidoras parceiras.',
          badge: { label: 'Período crítico', type: 'warn' },
        },
        {
          color: C,
          tag: 'EVENTOS',
          title: 'Patrocínio de eventos locais pode acelerar penetração em novos mercados',
          detail: 'Festivais gastronômicos, eventos esportivos regionais e feiras de empreendedorismo são canais de exposição com custo menor do que mídia de massa. Presença como marca patrocinadora em eventos de nicho reforça posicionamento premium sem diluir identidade.',
          badge: { label: 'Ação possível', type: 'info' },
        },
      ],
    },
  ],

  vendas: [
    {
      sectionTitle: 'Canais & Relacionamento com PDV',
      cards: [
        {
          color: C,
          tag: 'PDV',
          title: 'Relacionamento com pontos de venda pode definir prioridade de giro no ponto',
          detail: 'Em mercados de bebidas, a disposição e visibilidade do produto na gôndola e no balcão do bar impacta diretamente o giro. Distribuidoras com maior frequência de visita e material de apoio de PDV tendem a conseguir melhores posicionamentos e espaço preferencial.',
          badge: { label: 'Fator chave', type: 'ok' },
        },
        {
          color: C,
          tag: 'CANAL',
          title: 'Diversificação de canais (mercados, restaurantes, empórios) reduz dependência de distribuidoras únicas',
          detail: 'A dependência de poucos distribuidores aumenta vulnerabilidade a rupturas de entrega e negociações de margem desfavoráveis. Ampliar a cobertura em canais variados (atacarejo, empórios, delivery de bebidas) distribui risco e expande alcance da marca.',
          badge: { label: 'Diversificação', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Oportunidades de Expansão',
      cards: [
        {
          color: C,
          tag: 'EXPANSÃO',
          title: 'Mercados de bairro e botecos são canais de entrada eficientes para marcas regionais',
          detail: 'Botecos e botequins respondem por parcela significativa do consumo de cerveja no Brasil. A penetração nesse canal costuma ser mais rápida quando a distribuidora tem relacionamento comercial estabelecido e oferece condições de pagamento flexíveis.',
          badge: { label: 'Canal prioritário', type: 'ok' },
        },
        {
          color: C,
          tag: 'GIRO',
          title: 'Giro de produto em alta em regiões turísticas pode indicar janelas sazonais de expansão',
          detail: 'Regiões com fluxo turístico elevado no verão (litoral, serras, destinos gastronômicos) tendem a registrar demanda pontual mas de alto volume. Ter presença nesses pontos durante a alta temporada fortalece o recall de marca e pode gerar pedidos recorrentes.',
          badge: { label: 'Sazonalidade', type: 'info' },
        },
      ],
    },
  ],

  financeiro: [
    {
      sectionTitle: 'Margens & Distribuição',
      cards: [
        {
          color: C,
          tag: 'MARGEM',
          title: 'Margem por canal varia consideravelmente entre atacado, varejo e canal direto a bares',
          detail: 'A estrutura de custos de distribuição de bebidas inclui frete, armazenagem fria, prazo de pagamento e devoluções. Canais de consumo imediato (bares) tendem a oferecer margens brutas superiores ao atacarejo, mas exigem maior frequência de visita e menor escala por pedido.',
          badge: { label: 'Análise inicial', type: 'info' },
        },
        {
          color: C,
          tag: 'SAZONALIDADE',
          title: 'Fluxo de caixa em distribuidoras de bebidas costuma ter variação de até 40% entre verão e inverno',
          detail: 'O comportamento sazonal do mercado de cervejas impacta o planejamento financeiro das distribuidoras. Manter capital de giro suficiente para pré-compra no início do verão e gerenciar estoque no inverno são desafios financeiros recorrentes do setor.',
          badge: { label: 'Risco sazonal', type: 'warn' },
        },
      ],
    },
  ],

  rh: [
    {
      sectionTitle: 'Equipe Comercial & Campo',
      cards: [
        {
          color: C,
          tag: 'COMERCIAL',
          title: 'Promotores de vendas e repositores são camada crítica para execução no PDV',
          detail: 'Em distribuidoras de bebidas, a qualidade da equipe de campo — frequência de visita, cadastro de pontos, execução de material de PDV — diferencia o desempenho de rota. Treinamento contínuo e metas por região tendem a aumentar cobertura e giro.',
          badge: { label: 'Equipe de campo', type: 'info' },
        },
        {
          color: C,
          tag: 'RETENÇÃO',
          title: 'Rotatividade de motoristas e promotores pode afetar continuidade do relacionamento com PDV',
          detail: 'A troca frequente de profissionais de campo interrompe vínculos estabelecidos com donos de bares e mercados. Programas de retenção e bonificação por resultado de rota podem mitigar esse risco.',
          badge: { label: 'Atenção', type: 'warn' },
        },
      ],
    },
  ],

  operacoes: [
    {
      sectionTitle: 'Logística & Rotas',
      cards: [
        {
          color: C,
          tag: 'ROTA',
          title: 'Eficiência de rota é determinante para competitividade em custo de distribuição',
          detail: 'O custo logístico em distribuidoras de bebidas pode representar 15–25% do custo total. Otimização de rotas, sequenciamento de entrega e consolidação de carga são alavancas diretas de margem. Ferramentas simples de roteirização já entregam ganhos relevantes.',
          badge: { label: 'Alavanca de margem', type: 'ok' },
        },
        {
          color: C,
          tag: 'ENTREGA',
          title: 'Prazo de entrega e confiabilidade são fatores de retenção de PDVs',
          detail: 'Pontos de venda que trabalham com estoque mínimo dependem de previsibilidade de entrega. Rupturas frequentes levam o PDV a complementar com marcas concorrentes, reduzindo participação da Império no mix do ponto.',
          badge: { label: 'Retenção de PDV', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Armazenagem & Conservação',
      cards: [
        {
          color: C,
          tag: 'FRIO',
          title: 'Controle de temperatura no transporte impacta qualidade percebida pelo consumidor',
          detail: 'Cerveja exposta a variações térmicas excessivas pode apresentar alterações de sabor e redução de vida útil. Manter cadeia fria adequada — especialmente em regiões mais quentes — é diferencial operacional e de reputação de produto.',
          badge: { label: 'Qualidade', type: 'info' },
        },
      ],
    },
  ],

  estoque: [
    {
      sectionTitle: 'Giro & Validade',
      cards: [
        {
          color: C,
          tag: 'GIRO',
          title: 'Controle de validade é crítico em distribuidoras de bebidas com produtos perecíveis',
          detail: 'Gerenciar o giro de estoque por lote e data de validade evita perdas e retornos de PDV por produto vencido. Sistemas simples de FIFO (primeiro que entra, primeiro que sai) já reduzem significativamente o descarte no setor.',
          badge: { label: 'Gestão de lote', type: 'ok' },
        },
        {
          color: C,
          tag: 'RUPTURA',
          title: 'Ruptura de estoque em alta temporada pode custar participação permanente no PDV',
          detail: 'Quando o ponto de venda não recebe o produto no período de maior demanda, substitui por concorrente e pode manter o hábito de compra com outra marca após o verão. Antecipar pedidos de abastecimento para alta temporada é prática preventiva relevante.',
          badge: { label: 'Risco sazonal', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Devoluções & Perdas',
      cards: [
        {
          color: C,
          tag: 'DEVOLUÇÃO',
          title: 'Taxa de devolução por avaria ou vencimento indica eficiência operacional e de roteirização',
          detail: 'Devoluções elevadas pressionam margem e exigem retrabalho logístico. Monitorar a taxa de devolução por rota e por PDV ajuda a identificar pontos críticos de operação e a renegociar condições de armazenagem no ponto de venda.',
          badge: { label: 'Indicador chave', type: 'info' },
        },
      ],
    },
  ],

  juridico: [
    {
      sectionTitle: 'Licenciamento & Regulação',
      cards: [
        {
          color: C,
          tag: 'ALVARÁ',
          title: 'Distribuidoras de bebidas alcoólicas precisam de alvará específico por município de atuação',
          detail: 'A distribuição de bebidas alcoólicas é regulada em nível municipal e estadual. Operar sem alvará atualizado pode resultar em multas e interrupção de atividade. Verificar periodicamente a validade dos documentos por município de cobertura é prática essencial.',
          badge: { label: 'Conformidade', type: 'warn' },
        },
        {
          color: C,
          tag: 'MAPA',
          title: 'Registro no MAPA (Ministério da Agricultura) é obrigatório para produção e distribuição de cerveja',
          detail: 'Cervejas devem ter registro no MAPA. A distribuidora precisa garantir que os produtos que comercializa possuem registro ativo. Vender produto com registro vencido ou incorreto configura infração sanitária.',
          badge: { label: 'Regulação federal', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Responsabilidade Civil & Comercial',
      cards: [
        {
          color: C,
          tag: 'CONTRATO',
          title: 'Contratos com PDVs e acordos de exclusividade podem gerar obrigações contratuais relevantes',
          detail: 'Acordos de exclusividade de fornecimento com pontos de venda devem ser formalizados e revisados periodicamente. Ausência de contrato formal aumenta risco de inadimplência e dificulta cobrança em caso de devolução indevida ou não pagamento.',
          badge: { label: 'Gestão contratual', type: 'info' },
        },
      ],
    },
  ],
  administrativo: [],
  comercial: [
    {
      sectionTitle: 'Positivação, Comodato & Território no Canal de Bebidas',
      cards: [
        {
          color: C,
          tag: 'POSITIVAÇÃO DE PDV — SÓ 1 EM CADA 3 BARES DA ROTA TEM TODOS OS RÓTULOS DISPONÍVEIS',
          title: 'Positivação completa (todos os rótulos do mix disponíveis no ponto) ocorre em apenas 1 a cada 3 PDVs visitados pela distribuidora regional — o resto vende parte do portfólio, não o mix inteiro.',
          detail: 'CervBrasil + Sebrae Distribuição 2024: baixa positivação é a principal perda silenciosa de receita em distribuidora regional — o PDV já compra da marca, mas não o catálogo completo. Reforço de argumento de venda por rótulo aumenta o ticket sem abrir PDV novo.',
          badge: { label: 'Positivação completa: só 1 em 3 PDVs tem o mix inteiro', type: 'warn' },
        },
        {
          color: C,
          tag: 'FREEZER EM COMODATO — QUEM CEDE O EQUIPAMENTO OCUPA O ESPAÇO FRIO E TIRA O CONCORRENTE DA VISTA',
          title: 'Freezer cedido em comodato ao PDV costuma travar contratualmente a exposição do espaço frio para a marca cedente — bar que já tem freezer de grande cervejaria dificilmente abre espaço equivalente pra uma segunda marca.',
          detail: 'Abrabe + Sebrae Varejo de Bebidas 2024: contrato de comodato de equipamento é uma das ferramentas comerciais mais eficazes de bloqueio de concorrência no PDV. Distribuidora regional sem freezer próprio disputa o espaço restante, quase sempre pior posicionado.',
          badge: { label: 'Freezer em comodato: quem cede, ocupa o espaço frio e bloqueia o resto', type: 'warn' },
        },
        {
          color: C,
          tag: 'PREÇO VS AMBEV/HEINEKEN — ESCALA NACIONAL DÁ DESCONTO QUE A REGIONAL NÃO IGUALA NO PAPEL',
          title: 'Grande cervejaria negocia preço de tabela com desconto por volume nacional que a distribuidora regional não consegue igualar apenas no papel — a disputa comercial da regional precisa migrar para argumento de margem e relacionamento, não de preço direto.',
          detail: 'CervBrasil + Sebrae Precificação 2024: escala de produção das grandes cervejarias permite política agressiva de desconto por volume em rede. Regional que compete só por preço tende a operar no vermelho; argumento vencedor costuma ser margem por giro e serviço.',
          badge: { label: 'Preço não vence a escala nacional — margem e serviço são o argumento real', type: 'info' },
        },
        {
          color: C,
          tag: 'COBERTURA DE TERRITÓRIO — PDV NOVO SEM MAPA ATUALIZADO FICA INVISÍVEL PARA A ROTA',
          title: 'PDV novo (bar ou mercado recém-aberto) que abre dentro do raio de cobertura da distribuidora só é visitado, em média, semanas depois — tempo suficiente para o concorrente regional ou a grande cervejaria fechar o contrato primeiro.',
          detail: 'Sebrae Território Comercial 2024: mapeamento georreferenciado atualizado mensalmente reduz o tempo de descoberta de PDV novo. Rota comercial sem esse controle depende de o vendedor "notar por acaso" ao passar na rua.',
          badge: { label: 'PDV novo: descoberta tardia dá tempo do concorrente fechar primeiro', type: 'warn' },
        },
        {
          color: C,
          tag: 'ATACAREJO VS BAR — MARGEM CAI PELA METADE, MAS O VOLUME POR PEDIDO CRESCE VÁRIAS VEZES',
          title: 'Venda para atacarejo tem margem bruta bem menor que a venda direta ao bar, mas o volume por pedido compensa em escala — misturar os dois canais na mesma meta comercial distorce a leitura de desempenho do vendedor.',
          detail: 'Abrabe + Sebrae Canais de Distribuição 2024: distribuidora que mede só volume total sem segmentar por canal pode premiar vendedor que empurrou atacarejo e penalizar quem investiu tempo em positivar bar, canal de margem mais alta.',
          badge: { label: 'Atacarejo: margem menor, volume maior — meta precisa separar os canais', type: 'info' },
        },
        {
          color: C,
          tag: 'IDENTIDADE SERRANA — ARGUMENTO DE VENDA QUE A GRANDE CERVEJARIA NÃO COPIA NO PDV',
          title: 'A origem regional (Região Serrana, Petrópolis) é um argumento comercial que nenhuma grande cervejaria nacional consegue replicar no mesmo PDV — mas só funciona se o vendedor souber contar essa história na visita, não só entregar o produto.',
          detail: 'Sebrae Marcas Regionais 2024: consumidor de bar valoriza a história de origem quando o vendedor a apresenta ativamente; sem esse discurso, o produto regional compete só por preço e perde para a marca de escala. Script com a narrativa serrana é ativo subutilizado.',
          badge: { label: 'Identidade serrana: diferencial que só funciona se o vendedor contar a história', type: 'ok' },
        },
        {
          color: C,
          tag: 'CONTRATO DE VERÃO — NEGOCIAR EM SETEMBRO GARANTE CONDIÇÃO MELHOR QUE EM DEZEMBRO',
          title: 'Renovar contrato e condição comercial com PDV antes do pico de verão (setembro–outubro) garante margem de negociação maior do que tentar renegociar em dezembro, quando o bar já recebeu proposta agressiva de concorrente para a alta temporada.',
          detail: 'CervBrasil Sazonalidade 2024: grandes cervejarias intensificam ofensiva comercial em pontos de alto giro nos meses que antecedem o verão. Distribuidora regional que antecipa a negociação evita perder o PDV na janela de maior faturamento do ano.',
          badge: { label: 'Negociar em setembro, não em dezembro — concorrente ataca antes do verão', type: 'warn' },
        },
        {
          color: C,
          tag: 'CLÁUSULA DE EXCLUSIVIDADE — FREEZER DA CONCORRENTE PODE SIGNIFICAR EXCLUSIVIDADE JÁ ASSINADA',
          title: 'Muitos donos de bar assinam cláusula de exclusividade de fornecimento ao aceitar o freezer em comodato de uma grande cervejaria — e só descobrem a restrição quando o vendedor de uma segunda marca tenta negociar espaço.',
          detail: 'Abrabe + Sebrae Contratos de PDV 2024: cláusula costuma ficar em letra miúda do termo de comodato. Distribuidora regional que pergunta sobre exclusividade antes de investir tempo na visita evita negociação já contratualmente travada.',
          badge: { label: 'Freezer da concorrente pode significar exclusividade já assinada', type: 'warn' },
        },
        {
          color: C,
          tag: 'FREQUÊNCIA DE VISITA — PDV VISITADO 2X POR SEMANA GIRA MAIS QUE O MESMO VISITADO 1X POR MÊS',
          title: 'PDV visitado com frequência quinzenal ou semanal pelo vendedor da distribuidora tende a girar volume visivelmente maior que o mesmo tipo de ponto visitado uma vez por mês — a presença do vendedor sustenta o pedido, não só a demanda do bar.',
          detail: 'Sebrae Rota Comercial 2024: contato recorrente permite ajustar pedido conforme evento local, reposição de rótulo específico e cobrança de pagamento em dia. Rota com frequência baixa perde giro para o concorrente que visita mais.',
          badge: { label: 'Visita frequente sustenta o giro — não é só a demanda do bar que decide', type: 'ok' },
        },
        {
          color: C,
          tag: 'MIX DE RÓTULOS — BAR COM SÓ 1 RÓTULO DA IMPÉRIO ESTÁ MAIS PERTO DE TROCAR DE FORNECEDOR',
          title: 'PDV que compra apenas 1 rótulo da distribuidora, em vez do mix completo, tem vínculo comercial mais frágil e maior chance de trocar de fornecedor na primeira oferta agressiva do concorrente — a diversificação de rótulo no ponto é também retenção.',
          detail: 'CervBrasil + Sebrae Fidelização de Canal 2024: PDV com 3 ou mais rótulos ativos da mesma distribuidora troca de fornecedor com frequência bem menor, porque a substituição exigiria negociar múltiplos produtos ao mesmo tempo, não um só.',
          badge: { label: 'Mais rótulos no PDV = vínculo comercial mais difícil de quebrar', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Crédito, Incentivo, Retenção & Concorrência no Canal de Bebidas',
      cards: [
        {
          color: C,
          tag: 'PRAZO DE PAGAMENTO — CONDIÇÃO DE 15 DIAS FECHA PDV QUE A CONCORRENTE PERDEU NO PREÇO À VISTA',
          title: 'Bar pequeno com fluxo de caixa apertado costuma escolher o fornecedor pelo prazo de pagamento, não pelo preço da caixa — distribuidora que oferece 15 dias fecha PDV que o concorrente perdeu insistindo em pagamento à vista.',
          detail: 'Sebrae Crédito ao Varejo 2024: inadimplência é o principal motivo para distribuidora recusar prazo, mas PDV com histórico de pagamento em dia vira ativo de retenção quando recebe condição diferenciada. Regra de crédito clara evita decisão informal do vendedor.',
          badge: { label: 'Prazo de pagamento decide o fornecedor antes do preço da caixa', type: 'info' },
        },
        {
          color: C,
          tag: 'COMISSÃO POR RÓTULO — SEM META ESPECÍFICA, O VENDEDOR SÓ EMPURRA O PRODUTO MAIS FÁCIL',
          title: 'Vendedor sem comissão diferenciada por rótulo tende a empurrar só o produto de giro mais fácil, deixando o rótulo de maior margem parado no catálogo — a meta genérica de volume não direciona o mix que a distribuidora mais precisa vender.',
          detail: 'Sebrae Gestão Comercial 2024: comissão escalonada por rótulo ou por linha de produto é a ferramenta mais citada para corrigir esse viés natural do vendedor. Sem incentivo específico, o mix reflete o caminho de menor resistência, não a estratégia da empresa.',
          badge: { label: 'Comissão genérica: vendedor empurra o fácil, não o estratégico', type: 'warn' },
        },
        {
          color: C,
          tag: 'EVENTO LOCAL — JOGO E FESTA JUNINA GERAM PEDIDO EXTRA QUE A ROTA PADRÃO NÃO CAPTURA',
          title: 'Jogo de futebol importante, festa junina ou evento de bairro gera pico de pedido no PDV que a rota comercial padrão só percebe depois, quando o bar já resolveu o problema com o concorrente mais rápido.',
          detail: 'Abrasel + Sebrae Sazonalidade Local 2024: calendário de eventos da praça de atuação, compartilhado com a equipe de vendas, permite antecipar contato antes do pico. Distribuidora sem esse calendário reage ao pedido emergencial, não o antecipa.',
          badge: { label: 'Evento local sem calendário: pedido emergencial vira venda do concorrente', type: 'warn' },
        },
        {
          color: C,
          tag: 'CROSS-SELLING — GELO E REFRIGERANTE JUNTO DA CERVEJA AUMENTAM O TICKET SEM MEXER NO PREÇO',
          title: 'Distribuidora que oferece gelo, refrigerante e água junto com a cerveja no mesmo pedido aumenta o ticket médio do PDV sem precisar negociar desconto na caixa de cerveja — o cliente resolve mais de uma necessidade numa única entrega.',
          detail: 'Sebrae Distribuição de Bebidas 2024: PDV que compra portfólio ampliado do mesmo fornecedor reduz o número de fornecedores que atende, o que também é argumento de retenção. Distribuidora regional com portfólio único de cerveja perde essa alavanca de ticket.',
          badge: { label: 'Cross-selling com gelo e refrigerante: ticket sobe sem mexer no preço', type: 'ok' },
        },
        {
          color: C,
          tag: 'TROCA DE DONO DO BAR — RELACIONAMENTO DE ANOS PODE SUMIR NUMA SEMANA SEM AVISO',
          title: 'Quando o bar muda de dono, o relacionamento comercial construído ao longo de anos com o antigo proprietário não é transferido automaticamente — o novo dono decide o fornecedor do zero, e o vendedor que chega primeiro leva vantagem.',
          detail: 'Sebrae Rotatividade Comercial 2024: monitorar sinais de transição de propriedade do PDV (reforma, mudança de nome, novo alvará) permite à distribuidora se antecipar. Vendedor que só descobre a troca na visita de rotina já chega atrasado na negociação.',
          badge: { label: 'Bar trocou de dono: relacionamento antigo não garante nada com o novo', type: 'warn' },
        },
        {
          color: C,
          tag: 'DEGUSTAÇÃO NO PDV — AÇÃO DE UM DIA PODE MUDAR O HÁBITO DE COMPRA POR SEMANAS',
          title: 'Ação de degustação ou ativação de marca num único dia no bar pode influenciar a escolha do consumidor por semanas depois — o investimento pontual tem efeito mais duradouro do que desconto de preço repetido.',
          detail: 'Abrabe Ativação de Marca 2024: degustação gera experimentação que desconto de preço não garante — cliente que já provou o produto tende a pedir de novo mesmo sem o mesmo estímulo. Custo de uma ativação pontual é menor que meses de desconto sustentado.',
          badge: { label: 'Degustação de um dia influencia o hábito de compra por semanas', type: 'ok' },
        },
        {
          color: C,
          tag: 'PEDIDO PELO WHATSAPP — PDV PEQUENO REPÕE MAIS RÁPIDO SEM ESPERAR A VISITA DO VENDEDOR',
          title: 'PDV pequeno que pode fazer pedido de reposição direto pelo WhatsApp, sem esperar a próxima visita programada do vendedor, tende a repor estoque com mais frequência e evita ficar sem produto entre uma visita e outra.',
          detail: 'Sebrae Digitalização do Pequeno Varejo 2024: canal assíncrono de pedido reduz a dependência da rota fixa de visita para reposição emergencial. Distribuidora regional que só aceita pedido presencial perde venda nos dias entre visitas.',
          badge: { label: 'Pedido pelo WhatsApp evita ruptura entre uma visita e outra', type: 'ok' },
        },
        {
          color: C,
          tag: 'PDV FANTASMA — PONTO CADASTRADO SEM VISITA HÁ MESES JÁ PODE SER CLIENTE DO CONCORRENTE',
          title: 'Ponto de venda que consta na carteira da distribuidora mas não recebe visita ou pedido há vários meses provavelmente já foi conquistado pelo concorrente — carteira "cheia" no papel pode esconder cobertura real bem menor.',
          detail: 'Sebrae Gestão de Carteira Comercial 2024: auditoria periódica de PDVs sem movimentação recente revela a diferença entre cobertura nominal e cobertura ativa. Rota que não descarta PDV fantasma da meta superestima o potencial real do território.',
          badge: { label: 'PDV sem visita há meses: provavelmente já é cliente do concorrente', type: 'warn' },
        },
        {
          color: C,
          tag: 'DISTRIBUIDORA REGIONAL VIZINHA — CONCORRÊNCIA NÃO É SÓ A GRANDE CERVEJARIA',
          title: 'Distribuidora regional de município vizinho que amplia o raio de entrega para a mesma praça de atuação da Império disputa o mesmo argumento de identidade local — a concorrência mais imediata pode não ser a grande cervejaria, e sim outra regional.',
          detail: 'Abrabe + Sebrae Concorrência Regional 2024: duas marcas regionais na mesma praça competem pelo mesmo discurso de proximidade e origem, o que anula parte da vantagem de diferenciação. Mapear a expansão de raio de distribuidoras vizinhas é tão relevante quanto monitorar a grande cervejaria.',
          badge: { label: 'Concorrente mais imediato pode ser a regional vizinha, não a grande cervejaria', type: 'info' },
        },
        {
          color: C,
          tag: 'PROGRAMA DE PONTOS PARA O DONO DO BAR — INCENTIVO AO LOJISTA, NÃO SÓ AO CONSUMIDOR FINAL',
          title: 'Programa de pontos ou bonificação por volume comprado, direcionado ao próprio dono do bar (não ao consumidor final), é ferramenta comercial pouco explorada por distribuidora regional de pequeno porte — geralmente restrita às grandes cervejarias.',
          detail: 'Sebrae Fidelização de Canal 2024: bonificação em produto ou vantagem por meta de compra do lojista fortalece o vínculo comercial direto com quem decide o fornecedor. Distribuidora regional sem programa formal depende só do relacionamento pessoal do vendedor, que não escala.',
          badge: { label: 'Bonificação ao dono do bar: ferramenta comum nas grandes, rara nas regionais', type: 'info' },
        },
      ],
    },
  ],
  compras: [],
  ti: [],
  atendimento: [],
};
