import type { CompanySectorFeeds } from '../../types';

export const AMAZON_SECTOR_FEEDS: CompanySectorFeeds = {
  marketing: [
    {
      sectionTitle: 'Prime & Aquisição',
      cards: [
        {
          color: '#ff9900',
          tag: 'PRIME',
          title: 'Prime Brasil atinge 18,4 mi de assinantes — crescimento de 27% YoY',
          detail: 'Base Prime no Brasil cresceu de 14,5 mi para 18,4 mi em 12 meses. Fee mensal: R$ 19,90. Receita de assinaturas: R$ 4,4 bi/ano. Penetração nas capitais: 34%. Expansão para interior via campanhas regionais no Q2/26.',
          badge: { label: '18,4mi assinantes', type: 'ok' },
        },
        {
          color: '#ff9900',
          tag: 'CAMPANHA',
          title: 'Prime Day 2026 confirmado para jul/26 — budget de marketing: R$ 120 mi',
          detail: 'Prime Day 2026 terá duração de 48h (edição anterior: 36h). Budget de mídia: R$ 120 mi — 40% em TV aberta, 35% em digital, 25% em OOH. Meta de novos assinantes Prime durante o evento: 900 mil.',
          badge: { label: 'jul/26', type: 'info' },
        },
        {
          color: '#ff9900',
          tag: 'VIDEO',
          title: 'Prime Video: 2,1 mi de usuários ativos/mês — Brasileirão impulsiona engajamento',
          detail: 'Transmissão de 38 jogos do Brasileirão Série A em 2026 elevou MAU do Prime Video em 31%. Watch time médio por usuário: 4,2h/semana. Produção local "Arcanjo Renegado S3" estreia em jun/26 — maior aposta de conteúdo BR.',
          badge: { label: '4,2h/semana', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Marketplace & Sellers',
      cards: [
        {
          color: '#ff9900',
          tag: 'SELLERS',
          title: '110 mil sellers ativos no marketplace BR — GMV de R$ 28 bi em 2025',
          detail: 'Marketplace Amazon BR registrou GMV de R$ 28 bi em 2025, crescimento de 41% vs 2024. Sellers ativos: 110 mil. Take rate médio: 12,8%. Categorias líderes: eletrônicos (31%), moda (18%), casa & decoração (14%).',
          badge: { label: 'GMV R$28bi', type: 'ok' },
        },
        {
          color: '#ff9900',
          tag: 'ADS',
          title: 'Amazon Ads BR: receita de R$ 1,2 bi em 2025 — crescimento de 68% YoY',
          detail: 'Sponsored Products, Sponsored Brands e DSP geraram R$ 1,2 bi em receita publicitária no Brasil. ROAS médio dos anunciantes: 4,8x. Base de anunciantes ativos: 38 mil. CPM médio do DSP: R$ 12,40.',
          badge: { label: '+68% YoY', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Dispositivos & Ecossistema',
      cards: [
        {
          color: '#ff9900',
          tag: 'ECHO',
          title: 'Echo Dot: 4,8 mi de unidades vendidas no BR — líder de smart speakers',
          detail: 'Amazon mantém 62% de share no mercado brasileiro de smart speakers. Echo Dot (5ª geração) é o modelo mais vendido: R$ 349 (preço Prime). Alexa Skills em português: 8.200 skills disponíveis, crescimento de 22% em 12 meses.',
          badge: { label: '62% share', type: 'ok' },
        },
        {
          color: '#ff9900',
          tag: 'KINDLE',
          title: 'Kindle Unlimited BR: 620 mil assinantes — catálogo de 4,1 mi de títulos',
          detail: 'Kindle Unlimited no Brasil (R$ 19,90/mês) tem 620 mil assinantes. Catálogo: 4,1 mi de títulos, sendo 380 mil em português. Leitura média: 2,8 livros/mês por assinante. Parceria com 1.200 editoras brasileiras.',
          badge: { label: '620k assinantes', type: 'info' },
        },
      ],
    },
  ],

  vendas: [
    {
      sectionTitle: 'GMV & Conversão',
      cards: [
        {
          color: '#10b981',
          tag: 'GMV',
          title: 'GMV total Q1/26: R$ 8,4 bi — crescimento de 38% vs Q1/25',
          detail: 'Volume bruto de mercadorias do Q1/26 superou projeção em 6%. Itens vendidos: 92 mi de unidades. ASP (preço médio por item): R$ 91,30. Crescimento acelerado por expansão de FBA e chegada de sellers internacionais.',
          badge: { label: 'R$8,4bi Q1/26', type: 'ok' },
        },
        {
          color: '#10b981',
          tag: 'CONVERSÃO',
          title: 'Taxa de conversão do site: 4,1% — usuários Prime convertem a 7,8%',
          detail: 'Conversão geral do site Amazon BR: 4,1%. Usuários Prime têm conversão de 7,8% — 1,9x maior. Mobile representa 68% das sessões e tem conversão de 3,4%. A/B test de página de produto com vídeo aumentou conversão em 0,6pp.',
          badge: { label: 'Prime 7,8%', type: 'ok' },
        },
        {
          color: '#10b981',
          tag: 'DEVOLUÇÕES',
          title: 'Taxa de devolução: 6,2% — categoria eletrônicos lidera com 9,4%',
          detail: 'Taxa geral de devolução de 6,2% dentro da meta de 7%. Eletrônicos (9,4%) e calçados (8,1%) são as categorias com maior retorno. Programa de devolução sem fricção custa R$ 48 mi/trimestre em logística reversa.',
          badge: { label: '6,2% devoluções', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'FBA & Fulfillment',
      cards: [
        {
          color: '#10b981',
          tag: 'FBA',
          title: 'FBA: 62% dos sellers utilizam — receita de fulfillment R$ 1,8 bi em 2025',
          detail: 'Fulfilled by Amazon tem 68.200 sellers ativos (62% do total). Receita de fulfillment services: R$ 1,8 bi em 2025. Fee médio por item: R$ 18,40. Satisfação dos sellers com FBA: NPS 71. Novos fulfillment centers previstos para Manaus e Recife.',
          badge: { label: '68,2k sellers FBA', type: 'ok' },
        },
        {
          color: '#10b981',
          tag: 'CROSS-BORDER',
          title: 'Importados via marketplace: R$ 4,2 bi GMV — cresce sob ameaça de taxação',
          detail: 'Sellers internacionais (China, EUA, Europa) geraram R$ 4,2 bi em GMV no BR em 2025. Proposta de taxação de importados até US$ 50 (PL 1087/26) pode reduzir GMV em 18%. Amazon BR monitora tramitação no Congresso.',
          badge: { label: 'PL 1087/26 risco', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'B2B & Amazon Business',
      cards: [
        {
          color: '#10b981',
          tag: 'B2B',
          title: 'Amazon Business BR: 48 mil empresas cadastradas — GMV R$ 920 mi em 2025',
          detail: 'Plataforma B2B tem 48 mil CNPJs ativos. Ticket médio por pedido: R$ 1.840 (vs R$ 91 no B2C). Categorias top: TI e escritório (44%), industrial (28%), saúde corporativa (15%). Meta 2026: atingir 80 mil empresas.',
          badge: { label: '48k empresas', type: 'info' },
        },
        {
          color: '#10b981',
          tag: 'PARCERIA',
          title: 'Parceria com Mercado Livre revertida — Amazon Brasil cresce sozinha na América Latina',
          detail: 'Amazon encerrou acordo de cross-listing com Mercado Livre em dez/25. Estratégia: crescimento orgânico com foco em logística própria e conteúdo Prime. Share de market de e-commerce no Brasil: 11,4% (vs MELI 27,1%).',
          badge: { label: 'Share 11,4%', type: 'info' },
        },
      ],
    },
  ],

  financeiro: [
    {
      sectionTitle: 'AWS Brasil & Receita Cloud',
      cards: [
        {
          color: '#f59e0b',
          tag: 'AWS',
          title: 'AWS Brasil: receita de R$ 6,8 bi em 2025 — crescimento de 34% YoY',
          detail: 'AWS South America (sa-east-1 São Paulo) registrou receita de R$ 6,8 bi em 2025. Clientes ativos: 41.000 empresas brasileiras. Margem operacional da divisão: 38,2%. Principais verticais: fintech (29%), varejo (21%), governo (18%).',
          badge: { label: 'R$6,8bi AWS BR', type: 'ok' },
        },
        {
          color: '#f59e0b',
          tag: 'CAPEX',
          title: 'Investimento em infraestrutura AWS BR: R$ 2,4 bi em 2026 — 3ª AZ confirmada',
          detail: 'Amazon anunciou R$ 2,4 bi em investimentos em infraestrutura no Brasil para 2026. Terceira Availability Zone em São Paulo entra em operação no Q3/26. Novo data center no Rio de Janeiro em fase de licenciamento.',
          badge: { label: 'R$2,4bi capex', type: 'info' },
        },
        {
          color: '#f59e0b',
          tag: 'MARGEM',
          title: 'Margem operacional do e-commerce BR ainda negativa: -2,1% em 2025',
          detail: 'A operação de varejo no Brasil ainda opera com margem negativa de 2,1%, sustentada pelos resultados de AWS e publicidade. Projeção de break-even para 2027. Principais custos: logística last-mile (44% do COGS) e marketing (18%).',
          badge: { label: 'Margem -2,1%', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Tributação & Regulação Fiscal',
      cards: [
        {
          color: '#f59e0b',
          tag: 'TRIBUTAÇÃO',
          title: 'Reforma tributária IBS/CBS: impacto estimado de +R$ 340 mi/ano em 2027',
          detail: 'A Reforma Tributária brasileira (Lei Complementar 214/25) eleva a alíquota efetiva sobre marketplaces de 9,2% para 11,8% a partir de jan/27. Time fiscal renegocia contratos com sellers e FBA para redistribuição do impacto.',
          badge: { label: '+R$340mi/ano', type: 'warn' },
        },
        {
          color: '#f59e0b',
          tag: 'IMPORTADOS',
          title: 'ICMS sobre importados: liminares em 3 estados suspendem cobrança',
          detail: 'SP, MG e RS concederam liminares suspendendo cobrança de ICMS diferenciado sobre importados via e-commerce. Litígio fiscal envolve R$ 280 mi em créditos contestados. STF deve julgar RE 1.306.920 no Q3/26.',
          badge: { label: '3 liminares ativas', type: 'info' },
        },
      ],
    },
  ],

  rh: [
    {
      sectionTitle: 'Força de Trabalho',
      cards: [
        {
          color: '#8b5cf6',
          tag: 'HEADCOUNT',
          title: '28.400 colaboradores no Brasil — 18.200 em operações de fulfillment',
          detail: 'Amazon Brasil emprega 28.400 pessoas. Operações (fulfillment centers + last-mile): 18.200 (64% do total). Tecnologia e produto: 4.100. Corporativo e suporte: 6.100. 73% são CLT e 27% terceirizados em logística.',
          badge: { label: '28,4k colaboradores', type: 'info' },
        },
        {
          color: '#8b5cf6',
          tag: 'TURNOVER',
          title: 'Turnover em fulfillment centers: 48%/ano — programa de retenção em revisão',
          detail: 'Alta rotatividade nos centros de distribuição (CD) em São Paulo (Cajamar), MG (Betim) e PE (Caruaru). Salário inicial operador: R$ 2.180/mês + benefícios. Programa Amazon Career Choice reembolsa até R$ 12.000/ano em cursos técnicos para reduzir turnover.',
          badge: { label: '48% turnover', type: 'warn' },
        },
        {
          color: '#8b5cf6',
          tag: 'VAGAS',
          title: '2.200 vagas abertas — 1.400 em tecnologia (SDE, ML, DevOps)',
          detail: 'Amazon está contratando 2.200 pessoas no Brasil. Tech: 1.400 vagas em São Paulo. Fulfillment: 600 vagas em expansão de CD. Programa "Amazon TechGen" forma 500 desenvolvedores/ano em parceria com SENAI e Alura.',
          badge: { label: '2.200 vagas', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Saúde & Cultura',
      cards: [
        {
          color: '#8b5cf6',
          tag: 'SEGURANÇA',
          title: 'TCIR fulfillment centers: 4,2 — acima da média do setor logístico (2,8)',
          detail: 'Total Case Incident Rate (lesões/100 funcionários/ano) nos CDs brasileiros está em 4,2, acima da média do setor de 2,8. Amazon investiu R$ 38 mi em ergonomia e automação de tarefas repetitivas em 2025. Meta 2026: reduzir TCIR para 3,0.',
          badge: { label: 'TCIR 4,2', type: 'warn' },
        },
        {
          color: '#8b5cf6',
          tag: 'ENGAJAMENTO',
          title: 'eNPS Brasil: 58 — abaixo da média global Amazon (67)',
          detail: 'Pesquisa interna "Connections" aponta eNPS de 58 no Brasil, impactado por ritmo de trabalho em fulfillment e política de retorno ao escritório 5x/semana para corporativos. Plano de ação: revisão de benefícios regionais em andamento.',
          badge: { label: 'eNPS 58', type: 'warn' },
        },
      ],
    },
  ],

  operacoes: [
    {
      sectionTitle: 'Logística & Entrega',
      cards: [
        {
          color: '#06b6d4',
          tag: 'ENTREGA',
          title: 'Same-day delivery disponível em SP, RJ e BH — 2,8 mi de entregas/mês',
          detail: 'Amazon Logistics opera entrega no mesmo dia em São Paulo (capital e ABCD), Rio de Janeiro e Belo Horizonte. Volume: 2,8 mi de pacotes/mês em same-day. Expansão para Curitiba, Fortaleza e Recife prevista para Q4/26.',
          badge: { label: 'Same-day em 3 cidades', type: 'ok' },
        },
        {
          color: '#06b6d4',
          tag: 'FROTA',
          title: 'Frota Amazon Logistics BR: 8.400 veículos — 620 elétricos (7,4%)',
          detail: 'Amazon Logistics opera 8.400 veículos no Brasil, sendo 620 elétricos (modelos BYD e Volvo). Meta de eletrificação: 30% da frota até 2028. Custo médio por entrega: R$ 14,80 (frota própria) vs R$ 22,10 (parceiros Flex).',
          badge: { label: '620 elétricos', type: 'info' },
        },
        {
          color: '#06b6d4',
          tag: 'FULFILLMENT',
          title: '4 fulfillment centers operacionais — capacidade total de 1,2 mi m²',
          detail: 'CDs em Cajamar/SP (420 mil m²), Betim/MG (280 mil m²), Caruaru/PE (240 mil m²) e Extrema/MG (260 mil m²). 5º CD em São José dos Pinhais/PR em construção (380 mil m²), operação prevista para set/26.',
          badge: { label: '5º CD em construção', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Tecnologia de Operações',
      cards: [
        {
          color: '#06b6d4',
          tag: 'AUTOMAÇÃO',
          title: 'Robôs Proteus e Hercules implantados em Cajamar — produtividade +28%',
          detail: 'Amazon implantou 420 robôs Proteus (movimentação autônoma de pods) e 18 estações Hercules no CD de Cajamar em jan/26. Produtividade de picking aumentou 28%. Investimento: R$ 180 mi. Próximo CD a receber automação: Betim.',
          badge: { label: '+28% produtividade', type: 'ok' },
        },
        {
          color: '#06b6d4',
          tag: 'RASTREIO',
          title: 'Precisão de entrega na janela prometida: 94,2% — meta: 96%',
          detail: 'Taxa de entregas realizadas dentro da janela prometida (same-day ou next-day) é de 94,2%. Principal causa de falha: endereçamento incompleto (41% das ocorrências) e tráfego em SP (28%). Novo sistema de roteirização com ML lançado em mar/26.',
          badge: { label: '94,2% no prazo', type: 'warn' },
        },
      ],
    },
  ],

  estoque: [
    {
      sectionTitle: 'Gestão de Inventário',
      cards: [
        {
          color: '#84cc16',
          tag: 'INVENTÁRIO',
          title: 'SKUs ativos no Brasil: 48 mi — 12 mi com estoque próprio Amazon',
          detail: 'Amazon Brasil opera 48 mi de SKUs ativos no marketplace. Estoque próprio (1P): 12 mi de SKUs. Estoque FBA (3P): 36 mi de SKUs espalhados pelos 4 CDs. Giro médio de estoque próprio: 28 dias. Taxa de out-of-stock 1P: 1,8%.',
          badge: { label: '48mi SKUs', type: 'info' },
        },
        {
          color: '#84cc16',
          tag: 'PREVISÃO',
          title: 'Modelo de previsão de demanda MAPE: 8,4% — abaixo da meta de 10%',
          detail: 'Sistema de demand forecasting baseado em modelos de série temporal + ML (DeepAR) atingiu MAPE de 8,4% em abr/26. Eletrodomésticos têm maior erro (MAPE 14,2%) por volatilidade de promoções. Revisão sazonal para Black Friday em andamento.',
          badge: { label: 'MAPE 8,4%', type: 'ok' },
        },
        {
          color: '#84cc16',
          tag: 'DEVOLUÇÃO',
          title: 'Taxa de dano em CD: 0,31% do inventário — meta <0,4%',
          detail: 'Índice de dano (avaria, extravio, vencimento) no inventário armazenado nos CDs está em 0,31% — dentro da meta de 0,4%. Categoria com maior perda: alimentos perecíveis (0,92%). Maior causa de avaria: manuseio em esteira (58% dos casos).',
          badge: { label: '0,31% dano', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Fornecedores & Reposição',
      cards: [
        {
          color: '#84cc16',
          tag: 'FORNECEDORES',
          title: '1.840 fornecedores 1P ativos — 34% são fabricantes nacionais',
          detail: 'Amazon 1P (wholesale) opera com 1.840 fornecedores diretos no Brasil. 34% são fabricantes nacionais. Prazo médio de pagamento: 45 dias. Prazo médio de reposição: 12 dias. Fornecedores com scorecard A+: 620 (34%).',
          badge: { label: '1.840 fornecedores', type: 'info' },
        },
        {
          color: '#84cc16',
          tag: 'IMPORTAÇÃO',
          title: 'Lead time de importados asiáticos: 38 dias — alta de 8 dias vs 2024',
          detail: 'Atrasos em cadeias de fornecimento do sudeste asiático (principalmente China e Vietnam) elevaram lead time médio de 30 para 38 dias. Impacto maior em eletrônicos e brinquedos. Amazon aumentou estoque de segurança de 15 para 22 dias nestas categorias.',
          badge: { label: 'Lead time +8 dias', type: 'warn' },
        },
      ],
    },
  ],

  juridico: [
    {
      sectionTitle: 'CADE & Antitruste',
      cards: [
        {
          color: '#f97316',
          tag: 'CADE',
          title: 'CADE abre inquérito sobre Amazon Ads e auto-preferência no marketplace',
          detail: 'Conselho Administrativo de Defesa Econômica iniciou inquérito (PA 08700.002341/2026) para investigar se Amazon privilegia produtos próprios e sellers FBA nos resultados de busca. Prazo de resposta: 60 dias. Multa potencial: até 20% do faturamento bruto.',
          badge: { label: 'Inquérito CADE', type: 'warn' },
        },
        {
          color: '#f97316',
          tag: 'ANTITRUSTE',
          title: 'Acordo DMA (Digital Markets Act) europeu como referência para regulação BR',
          detail: 'CADE e Senado acompanham DMA europeu que entrou em vigor para Amazon em mar/24. Brasil considera legislação similar (PL 2768/22 — "DMA brasileiro"). Amazon BR se prepara com relatório de fairness de algoritmo a ser apresentado ao CADE.',
          badge: { label: 'PL 2768/22', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Regulação de Dados & Consumidor',
      cards: [
        {
          color: '#f97316',
          tag: 'LGPD',
          title: 'ANPD: auditoria de dados de compras e Alexa voice data — prazo jun/26',
          detail: 'ANPD solicitou detalhamento do tratamento de dados de voz coletados pela Alexa e do histórico de compras para fins de personalização de anúncios. Time jurídico prepara DPA (Data Processing Agreement) revisado. Risco de multa: R$ 80 mi.',
          badge: { label: 'Prazo jun/26', type: 'warn' },
        },
        {
          color: '#f97316',
          tag: 'PROCON',
          title: '14.200 reclamações no Procon-SP em 2025 — ranking 7º entre varejistas',
          detail: 'Amazon recebeu 14.200 reclamações no Procon-SP em 2025 (7ª posição). Principais motivos: produto não entregue (38%), produto divergente do anunciado (27%), reembolso não realizado (22%). Índice de resolução: 91%.',
          badge: { label: '91% resolução', type: 'ok' },
        },
        {
          color: '#f97316',
          tag: 'TRABALHISTA',
          title: '820 ações trabalhistas ativas — concentração em entregadores Flex',
          detail: 'Amazon Brasil tem 820 ações trabalhistas em andamento. 68% envolvem entregadores do programa Amazon Flex que buscam reconhecimento de vínculo empregatício. Provisionamento: R$ 42 mi. TST deve julgar leading case de Flex em ago/26.',
          badge: { label: 'TST ago/26', type: 'warn' },
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
