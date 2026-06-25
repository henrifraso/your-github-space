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
};
