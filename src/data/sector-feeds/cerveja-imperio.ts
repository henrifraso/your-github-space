import type { CompanySectorFeeds } from '../../types';

const C = '#b8860b';

export const CERVEJA_IMPERIO_SECTOR_FEEDS: CompanySectorFeeds = {
  marketing: [
    {
      sectionTitle: 'Identidade Regional, PDV & Disputa de Marca no Mercado de Cerveja',
      cards: [
        {
          color: C,
          tag: 'ORIGEM SERRANA — CONSUMIDOR DE CERVEJA REGIONAL PAGA MAIS QUANDO CONHECE A HISTÓRIA POR TRÁS DO RÓTULO',
          title: 'Cerveja com identidade regional bem contada (origem, processo, região produtora) sustenta preço mais alto na prateleira do que rótulo sem narrativa — a Região Serrana é um ativo de marketing que a Império ainda pode explorar mais.',
          detail: 'CervBrasil + Sebrae Marcas Regionais 2024: cervejarias regionais que investem em contar a origem do produto no rótulo e na comunicação de PDV registram menor sensibilidade a preço frente a marcas de massa. Falta de comunicação ativa da origem reduz esse efeito a zero.',
          badge: { label: 'Origem contada no rótulo: reduz sensibilidade a preço frente às marcas de massa', type: 'ok' },
        },
        {
          color: C,
          tag: 'MATERIAL DE PDV — REGIONAL DISPUTA VISIBILIDADE NO BALCÃO COM ORÇAMENTO MUITO MENOR QUE AMBEV/HEINEKEN',
          title: 'Grande cervejaria domina o espaço visual do bar com banner, luminoso e freezer de marca — cervejaria regional precisa disputar a mesma atenção do cliente com fração do orçamento de comunicação no ponto de venda.',
          detail: 'Abrabe + Sebrae Comunicação no PDV 2024: material de PDV de baixo custo (adesivo de porta, porta-copo, cardápio de mesa) ainda é subutilizado por marca regional, que costuma investir só em desconto de preço, deixando o espaço visual do balcão só para o concorrente de escala.',
          badge: { label: 'PDV: regional disputa espaço visual com fração do orçamento da grande cervejaria', type: 'warn' },
        },
        {
          color: C,
          tag: 'FESTIVAL GASTRONÔMICO — PATROCÍNIO LOCAL CUSTA UMA FRAÇÃO DE CAMPANHA NACIONAL E FALA COM O PÚBLICO CERTO',
          title: 'Patrocinar festival gastronômico ou evento cultural da própria região custa uma fração de uma campanha de mídia nacional e coloca a marca diante do público que já valoriza produto regional — janela que a grande cervejaria não disputa com a mesma intensidade.',
          detail: 'Embratur + Sebrae Turismo e Eventos 2024: eventos regionais de médio porte têm custo de patrocínio acessível e alta afinidade de público com produto local. Marca regional ausente desses eventos abre espaço para concorrente regional ocupar o mesmo território simbólico.',
          badge: { label: 'Patrocínio de evento local: custo baixo, público certo, pouca disputa da grande cervejaria', type: 'ok' },
        },
        {
          color: C,
          tag: 'VERÃO CONCENTRA A JANELA DE MARKETING — QUEM NÃO SE COMUNICA ANTES DE OUTUBRO CHEGA ATRASADO NO PICO',
          title: 'A maior parte do investimento de marketing de cerveja no Brasil se concentra entre outubro e fevereiro — marca que só começa a se comunicar quando o calor já chegou está competindo por atenção que o concorrente já capturou semanas antes.',
          detail: 'CervBrasil Sazonalidade 2024: comunicação de marca iniciada ainda no fim do inverno tem custo de mídia menor e menos concorrência por atenção do consumidor do que a comunicação feita já no auge do verão, quando todas as marcas disputam o mesmo público ao mesmo tempo.',
          badge: { label: 'Comunicar antes do verão custa menos e disputa menos atenção', type: 'warn' },
        },
        {
          color: C,
          tag: 'CONSUMIDOR 18–29 ANOS — PREFERÊNCIA POR RÓTULO LOCAL CRESCE MAIS RÁPIDO QUE A MÉDIA DO MERCADO',
          title: 'Consumidor de 18 a 29 anos declara preferência crescente por marca regional e artesanal frente à cerveja de massa — esse público é o que mais define o hábito de consumo em bar e o que mais interage com conteúdo de marca nas redes.',
          detail: 'CervBrasil + Sebrae Comportamento do Consumidor 2024: a busca por identidade e autenticidade de marca é mais forte nessa faixa etária do que em consumidores mais velhos, que tendem a manter hábito de marca já estabelecido há mais tempo.',
          badge: { label: 'Jovem 18–29: preferência por regional cresce mais rápido que a média do setor', type: 'info' },
        },
        {
          color: C,
          tag: 'CERVEJA SEM ÁLCOOL — CATEGORIA CRESCE NO BRASIL E REGIONAL AINDA QUASE NÃO DISPUTA ESSE ESPAÇO',
          title: 'Cerveja sem álcool é uma das categorias que mais cresce dentro do mercado brasileiro de cerveja — e é um espaço ainda dominado quase inteiramente por grandes marcas, com pouquíssima presença de cervejaria regional.',
          detail: 'CervBrasil Tendências de Consumo 2024: consumidor que reduz álcool por saúde ou hábito social ainda não encontra opção regional na maioria dos PDVs. Cervejaria que entra cedo nessa categoria disputa um território quase sem concorrência regional direta.',
          badge: { label: 'Sem álcool: categoria em crescimento, quase sem disputa de marca regional', type: 'info' },
        },
        {
          color: C,
          tag: 'CONTEÚDO DE CLIENTE NO BAR — VÍDEO ESPONTÂNEO NA MESA VALE MAIS QUE POST PAGO DA MARCA',
          title: 'Vídeo ou foto espontânea de cliente consumindo a cerveja no bar, publicado nas próprias redes, tem alcance percebido como mais autêntico do que post pago da marca — e custa zero de produção para a cervejaria.',
          detail: 'Meta Business + Abrabe Marketing Digital 2024: incentivo simples (identificação de hashtag regional, nome do bar na etiqueta) aumenta a chance desse conteúdo espontâneo aparecer. Marca regional sem estímulo ativo deixa esse canal de exposição gratuito vazio.',
          badge: { label: 'Conteúdo espontâneo do cliente no bar: mais autêntico que post pago, custo zero', type: 'ok' },
        },
        {
          color: C,
          tag: 'PROPAGANDA NACIONAL — GRANDE CERVEJARIA GASTA EM 1 COMERCIAL O QUE A REGIONAL GASTA NO ANO INTEIRO',
          title: 'O investimento em mídia de televisão de uma grande cervejaria numa única campanha nacional supera, muitas vezes, todo o orçamento anual de marketing de uma cervejaria regional — a disputa de marca não pode ser pela mesma régua de investimento.',
          detail: 'CervBrasil + Sebrae Investimento em Marketing 2024: marca regional que tenta competir em volume de mídia paga com grande cervejaria perde antes de começar. Estratégia eficaz costuma migrar o investimento para PDV, evento local e relacionamento direto com o consumidor da região.',
          badge: { label: 'Regional não vence em volume de mídia — vence em PDV, evento e proximidade', type: 'warn' },
        },
        {
          color: C,
          tag: 'RÓTULO NA PRATELEIRA — DESIGN DIFERENTE CHAMA ATENÇÃO EM 3 SEGUNDOS ANTES DE QUALQUER ARGUMENTO DE SABOR',
          title: 'Decisão de compra por impulso no mercado ou na geladeira do bar acontece em poucos segundos — rótulo com design diferente da estética padrão das grandes marcas chama atenção antes mesmo de qualquer argumento sobre sabor ou origem.',
          detail: 'Sebrae Design de Embalagem 2024: embalagem que foge do padrão visual dominante da categoria (cores, tipografia, formato) tem taxa de notação maior em prateleira compartilhada com marcas de massa. Design genérico "que parece com todo mundo" se perde no conjunto.',
          badge: { label: 'Rótulo diferente chama atenção antes do argumento de sabor', type: 'info' },
        },
        {
          color: C,
          tag: 'TURISTA EM PETRÓPOLIS — FLUXO TURÍSTICO DA SERRA É CANAL DE MARKETING QUE JÁ EXISTE E QUASE NÃO É EXPLORADO',
          title: 'O fluxo de turista que visita a Região Serrana já é, por si só, uma vitrine de marca para produto regional — mas poucos bares e pontos turísticos da rota comunicam ativamente que a cerveja servida é da própria região.',
          detail: 'Embratur + Sebrae Turismo 2024: turista tende a valorizar e levar de lembrança produto associado ao destino visitado. Falta de comunicação no PDV turístico ("cerveja daqui da Serra") desperdiça esse fluxo já existente sem custo de aquisição de mídia.',
          badge: { label: 'Turista já está na região — falta comunicar que a cerveja é local', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Redes Sociais, Merchandising & Gestão de Reputação de Marca Regional',
      cards: [
        {
          color: C,
          tag: 'PERFIL DO BAR NO INSTAGRAM — MARCA APARECE DE GRAÇA QUANDO O PONTO DE VENDA POSTA O PRÓPRIO CARDÁPIO',
          title: 'Bar que posta foto do próprio cardápio ou ambiente nas redes sociais frequentemente inclui a cerveja servida na composição da imagem — exposição de marca que não custa nada à cervejaria, mas raramente é incentivada ativamente.',
          detail: 'Meta Business + Abrabe Marketing Digital 2024: identificar a marca (@) ou etiqueta física visível no copo aumenta a chance do produto aparecer citado no post do próprio PDV. Cervejaria sem relacionamento digital com o bar perde essa vitrine gratuita.',
          badge: { label: 'Post do próprio bar já expõe a marca — só falta incentivar a menção', type: 'ok' },
        },
        {
          color: C,
          tag: 'CERVEJA ARTESANAL — CATEGORIA CRESCE E DISPUTA O MESMO CONSUMIDOR QUE A REGIONAL TRADICIONAL',
          title: 'O crescimento da cerveja artesanal no Brasil disputa o mesmo consumidor que busca autenticidade e sabor diferenciado que a cerveja regional tradicional também atrai — a Império precisa se posicionar entre "regional clássica" e "artesanal", não deixar a categoria se apropriar do discurso sozinha.',
          detail: 'CervBrasil Tendências de Consumo 2024: consumidor migra entre regional e artesanal buscando o mesmo valor de autenticidade, o que torna a fronteira entre as duas categorias cada vez mais tênue na cabeça do cliente de bar.',
          badge: { label: 'Artesanal e regional disputam o mesmo consumidor por autenticidade', type: 'info' },
        },
        {
          color: C,
          tag: 'EDIÇÃO LIMITADA — RÓTULO SAZONAL GERA URGÊNCIA DE COMPRA QUE O RÓTULO PERMANENTE NÃO PROVOCA',
          title: 'Rótulo de edição limitada, ligado a uma estação ou evento específico da Região Serrana, cria senso de urgência de compra e motivo de conversa no bar que o rótulo permanente sozinho não consegue gerar.',
          detail: 'Sebrae Marketing Sazonal 2024: produto "só existe por tempo limitado" ativa gatilho de escassez no consumidor, incentivando experimentação e compartilhamento espontâneo em redes sociais — tática amplamente usada por craft beer, ainda pouco explorada por regional tradicional.',
          badge: { label: 'Edição limitada: urgência de compra que o rótulo permanente não gera', type: 'ok' },
        },
        {
          color: C,
          tag: 'TIME LOCAL — PATROCÍNIO DE CLUBE OU EVENTO ESPORTIVO REGIONAL GERA IDENTIFICAÇÃO QUE MARCA NACIONAL NÃO REPLICA',
          title: 'Patrocinar time de futebol amador ou evento esportivo regional cria identificação emocional com a torcida local que nenhuma marca nacional de cerveja consegue replicar na mesma escala — o vínculo é com o time do bairro, não com o campeonato nacional.',
          detail: 'Sebrae Marketing Esportivo Regional 2024: patrocínio de evento esportivo de pequena e média escala tem custo baixo e retorno de exposição de marca concentrado exatamente no público que frequenta bar da região.',
          badge: { label: 'Time local: identificação que marca nacional não replica na mesma escala', type: 'ok' },
        },
        {
          color: C,
          tag: 'RETORNO DE GARRAFA — MARKETING DE SUSTENTABILIDADE AINDA É POUCO EXPLORADO POR CERVEJARIA REGIONAL',
          title: 'Comunicar ativamente o retorno de garrafa (logística reversa) como prática sustentável é um argumento de marca ainda pouco explorado por cervejaria regional — enquanto grandes marcas já usam sustentabilidade como pilar de comunicação institucional.',
          detail: 'CervBrasil + Sebrae Sustentabilidade 2024: consumidor mais jovem valoriza marca que comunica prática ambiental concreta, não apenas discurso genérico. Cervejaria regional que já retorna garrafa mas não comunica isso deixa um argumento de marca sem uso.',
          badge: { label: 'Retorno de garrafa: prática sustentável que a marca ainda não comunica', type: 'info' },
        },
        {
          color: C,
          tag: 'INFLUENCIADOR LOCAL — CUSTO MENOR E CONFIANÇA MAIOR QUE INFLUENCIADOR NACIONAL PARA O PÚBLICO DA REGIÃO',
          title: 'Criador de conteúdo local, com audiência concentrada na própria região serrana, custa uma fração de um influenciador nacional e gera mais confiança junto ao público que efetivamente frequenta os bares da rota de distribuição.',
          detail: 'Abrabe Marketing de Influência 2024: audiência regional de criador local tem taxa de engajamento mais alta com produto que o seguidor pode efetivamente encontrar no bar da esquina, diferente de influenciador nacional promovendo produto sem essa conexão geográfica.',
          badge: { label: 'Influenciador local: mais barato e mais confiável para o público da região', type: 'ok' },
        },
        {
          color: C,
          tag: 'COPO E CAMISETA DE MARCA — MERCHANDISING NO BAR VIRA PUBLICIDADE QUE O CLIENTE LEVA PARA CASA',
          title: 'Copo personalizado, camiseta de garçom ou boné de marca no bar funciona como publicidade que sai do ponto de venda e circula fora dele — item de merchandising de baixo custo que a maioria das cervejarias regionais ainda trata como brinde secundário.',
          detail: 'Sebrae Merchandising de Marca 2024: material físico de marca que o consumidor ou funcionário do bar usa fora do ambiente de consumo estende o alcance da comunicação sem custo de mídia. Regional que só distribui adesivo de geladeira deixa esse potencial parado.',
          badge: { label: 'Merchandising de bar: publicidade que sai da porta e circula de graça', type: 'ok' },
        },
        {
          color: C,
          tag: 'NOTA DO BAR NO GOOGLE — REPUTAÇÃO DO PDV JÁ INFLUENCIA A PERCEPÇÃO DA MARCA SERVIDA LÁ DENTRO',
          title: 'Bar bem avaliado no Google e no TripAdvisor transfere parte dessa reputação positiva para a marca de cerveja servida no local — cervejaria que escolhe criteriosamente os PDVs de maior nota reforça a própria imagem por associação.',
          detail: 'Google Business Profile + Abrabe Reputação de Canal 2024: consumidor associa a qualidade percebida do estabelecimento ao produto consumido ali, mesmo sem relação direta de causa. Presença estratégica em PDVs bem avaliados é forma indireta de construir reputação de marca.',
          badge: { label: 'PDV bem avaliado empresta reputação para a marca servida ali dentro', type: 'info' },
        },
        {
          color: C,
          tag: 'HARMONIZAÇÃO COM QUEIJO SERRANO — CO-MARKETING COM PRODUTO REGIONAL REFORÇA A MESMA IDENTIDADE DE ORIGEM',
          title: 'Parceria de comunicação com queijo, embutido ou outro produto típico da Região Serrana para sugerir harmonização reforça a mesma narrativa de origem em dois produtos ao mesmo tempo, dividindo o custo de comunicação entre marcas complementares.',
          detail: 'Sebrae Marcas Regionais 2024: co-marketing entre produtos da mesma região amplia alcance sem duplicar investimento e reforça, para o consumidor, a ideia de um "ecossistema" de produto local coerente — tática ainda incomum no setor de bebidas regional.',
          badge: { label: 'Co-marketing com produto serrano: reforça origem e divide o custo', type: 'ok' },
        },
        {
          color: C,
          tag: 'BOATO SOBRE O PRODUTO — MARCA REGIONAL TEM MENOS ESTRUTURA DE RESPOSTA A CRISE QUE A GRANDE CERVEJARIA',
          title: 'Boato ou reclamação isolada sobre qualidade do produto se espalha nas redes da região com a mesma velocidade para marca regional ou nacional — mas a cervejaria regional geralmente não tem estrutura de comunicação de crise pronta para responder rápido.',
          detail: 'Abrabe + Sebrae Gestão de Reputação 2024: ausência de protocolo simples de resposta rápida (quem responde, em quanto tempo, com que mensagem) transforma um boato pontual em dano de imagem que dura semanas, enquanto grande marca já tem esse processo institucionalizado.',
          badge: { label: 'Sem protocolo de crise, um boato pontual dura semanas na reputação', type: 'warn' },
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
