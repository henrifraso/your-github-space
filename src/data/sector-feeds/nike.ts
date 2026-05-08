import type { CompanySectorFeeds } from '../../types';

export const NIKE_SECTOR_FEEDS: CompanySectorFeeds = {
  marketing: [
    {
      sectionTitle: 'SNKRS & Drops',
      cards: [
        {
          color: '#ec4899',
          tag: 'DROP',
          title: 'Air Jordan 1 Retro High OG "Bred" — sell-out em 4 min',
          detail: 'Lançamento via SNKRS App gerou 340 mil acessos simultâneos no Brasil. Taxa de conversão 2,3% acima da média de drops anteriores. Próximo drop: Dunk Low Panda em 14/mai.',
          badge: { label: 'Sold Out', type: 'ok' },
        },
        {
          color: '#ec4899',
          tag: 'COLLAB',
          title: 'Parceria com Anitta para coleção Nike x A11y confirmada',
          detail: 'Campanha "Move Like Anitta" atinge público 18-34 anos no digital. Previsão de 12 mil unidades para o Brasil com exclusividade SNKRS por 48h. Verba de mídia: R$ 2,1 mi.',
          badge: { label: 'Em produção', type: 'info' },
        },
        {
          color: '#ec4899',
          tag: 'APP',
          title: 'NRC atinge 1,4 mi de usuários ativos no Brasil',
          detail: 'Nike Run Club registrou +18% de DAU no Q1 2026 vs Q1 2025. Desafio "Corrida de Maio" captou 87 mil inscrições em 72h. Integração com Garmin aumentou retenção 30 dias em 22%.',
          badge: { label: '+18% DAU', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Sustentabilidade & Branding',
      cards: [
        {
          color: '#ec4899',
          tag: 'MOVE TO ZERO',
          title: 'Meta: 50% dos produtos com material reciclado até dez/2026',
          detail: 'Atualmente 31% do portfólio Nike Brasil usa Flyknit reciclado ou sola reprocessada. Campanha "Reuse-A-Shoe" coletou 4,2 toneladas de tênis usados em lojas flagship SP/RJ no Q1.',
          badge: { label: '31% atual', type: 'warn' },
        },
        {
          color: '#ec4899',
          tag: 'OOH',
          title: 'Campanha outdoor "Just Move" em 8 capitais — CPM R$ 4,20',
          detail: 'Mídia exterior + digital OOH nas estações de metrô de SP e RJ. Recall de marca em pesquisa pós-campanha: 67%. Investimento total: R$ 980 mil para Q2 2026.',
          badge: { label: 'Ativo', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'DTC & Canal Digital',
      cards: [
        {
          color: '#ec4899',
          tag: 'E-COMMERCE',
          title: 'Nike.com.br cresce 34% YoY — participação DTC sobe para 41%',
          detail: 'Canal direto ao consumidor atingiu R$ 148 mi em GMV no Q1 2026. App Nike superou nike.com.br em volume de pedidos pela primeira vez. Ticket médio DTC: R$ 389 vs R$ 312 no atacado.',
          badge: { label: '+34% YoY', type: 'ok' },
        },
        {
          color: '#ec4899',
          tag: 'SOCIAL',
          title: 'Engajamento no Instagram BR cai 8% — revisão de conteúdo necessária',
          detail: 'Taxa de engajamento atual: 1,9% (benchmark setor: 2,4%). Posts de produto performam 40% abaixo de conteúdo de lifestyle. Recomendação: aumentar UGC e athlete content para Q2.',
          badge: { label: 'Atenção', type: 'warn' },
        },
      ],
    },
  ],

  vendas: [
    {
      sectionTitle: 'Sell-Through & Canais',
      cards: [
        {
          color: '#10b981',
          tag: 'SELL-THROUGH',
          title: 'Sell-through geral abril: 78% — Running acima da meta com 84%',
          detail: 'Categoria Running lidera sell-through impulsionada por Nike Pegasus 41. Lifestyle (Jordan/AF1) em 74%, abaixo da meta de 80%. Footwear feminino a 71% — requer ação promocional.',
          badge: { label: '78% geral', type: 'info' },
        },
        {
          color: '#10b981',
          tag: 'ATACADO',
          title: 'Centauro representa 18% da receita BR — renovação de contrato em jul/26',
          detail: 'Pedido Q3 da Centauro cresceu 12% vs Q3 anterior. SportZone solicitou ampliação de SKUs Jordan para lojas de rua. Margem bruta no canal atacado: 42% vs 61% no DTC.',
          badge: { label: 'Renovação jul', type: 'warn' },
        },
        {
          color: '#10b981',
          tag: 'MARKETPLACE',
          title: 'Shopee BR bloqueada após detecção de 1.200 listings falsos',
          detail: 'Operação anti-falsificação removeu 1.218 anúncios em março/26. Nike Brasil decidiu suspender operação própria na Shopee até garantia de proteção de marca. Perdas estimadas: R$ 340 mil/mês.',
          badge: { label: 'Suspenso', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Performance de Produto',
      cards: [
        {
          color: '#10b981',
          tag: 'TOP SKU',
          title: 'Nike Air Max 270 — SKU mais vendido do Q1 com 48 mil pares',
          detail: 'Air Max 270 liderou vendas em todas as regiões do Brasil. Margem bruta unitária: R$ 187. Reposição Q2 já confirmada com aumento de 20% no volume de importação via DHL.',
          badge: { label: '#1 vendas', type: 'ok' },
        },
        {
          color: '#10b981',
          tag: 'OPORTUNIDADE',
          title: 'Futebol Society cresce 27% — Nike ainda sem SKU dedicado no BR',
          detail: 'Mercado de chuteiras society cresceu 27% em 2025 (IBGE/Sebrae). Adidas domina com 38% de share. Nike tem apenas modelos de futsal adaptados — gap de portfólio avaliado em R$ 45 mi/ano.',
          badge: { label: 'Gap de portfólio', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Metas Q2 2026',
      cards: [
        {
          color: '#10b981',
          tag: 'META',
          title: 'Meta Q2: R$ 520 mi em receita líquida — pace atual 94%',
          detail: 'Acumulado até semana 5 de Q2: R$ 112 mi (pace de 94% da meta). Principais alavancas: lançamento Pegasus Trail 5 em mai e campanha Copa América com Vini Jr.',
          badge: { label: '94% do pace', type: 'info' },
        },
        {
          color: '#10b981',
          tag: 'NRC SALES',
          title: 'Usuários NRC convertem 3,1x mais no e-commerce vs visitante anônimo',
          detail: 'Programa Nike Run Club gera efeito halo direto em vendas digitais. Usuários ativos no NRC têm AOV 2,4x maior e LTV 4,8x superior. Ação proposta: push de produto pós-corrida via app.',
          badge: { label: 'Alta conversão', type: 'ok' },
        },
      ],
    },
  ],

  financeiro: [
    {
      sectionTitle: 'Margens & Câmbio',
      cards: [
        {
          color: '#f59e0b',
          tag: 'MARGEM',
          title: 'Margem bruta DTC 61% vs atacado 42% — mix favorece DTC',
          detail: 'Aumento de 4pp na participação DTC no Q1 elevou margem consolidada de 51% para 53%. Meta 2026: atingir 55% de margem bruta com DTC em 45% do mix de vendas.',
          badge: { label: '+2pp margem', type: 'ok' },
        },
        {
          color: '#f59e0b',
          tag: 'CÂMBIO',
          title: 'Dólar a R$ 5,72 pressiona custo de importação em 8,3%',
          detail: 'Apreciação do dólar no Q1 elevou custo médio de importação de tênis para R$ 142/par (FOB Vietnã + frete DHL). Hedge cambial cobre apenas 60% do volume Q2 — exposição de R$ 18 mi.',
          badge: { label: 'Exposição R$18mi', type: 'warn' },
        },
        {
          color: '#f59e0b',
          tag: 'ICMS-ST',
          title: 'ICMS substituição tributária têxtil aumenta 3pp em SP a partir de jun/26',
          detail: 'Decreto estadual SP elevará alíquota efetiva de produtos têxteis/calçados de 18% para 21% via ST. Impacto estimado: R$ 6,2 mi/ano na operação SP. Jurídico analisa contestação via mandado de segurança.',
          badge: { label: 'Impacto jun/26', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Resultado & Investimentos',
      cards: [
        {
          color: '#f59e0b',
          tag: 'EBITDA',
          title: 'EBITDA Q1 2026: R$ 89 mi — crescimento de 14% vs Q1 2025',
          detail: 'Resultado impulsionado por crescimento DTC e redução de 2pp em despesas de distribuição com novo hub logístico em Jundiaí. Depreciação do Capex de lojas flagship: R$ 4,1 mi no período.',
          badge: { label: '+14% YoY', type: 'ok' },
        },
        {
          color: '#f59e0b',
          tag: 'CAPEX',
          title: 'Reforma loja flagship Oscar Freire: R$ 4,8 mi — entrega ago/26',
          detail: 'Projeto de expansão da flagship de 420m² para 680m² inclui zona de customização Nike By You e espaço NRC. ROI projetado em 28 meses com aumento de 35% no tráfego esperado.',
          badge: { label: 'Entrega ago/26', type: 'info' },
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
          title: 'Total: 1.840 colaboradores BR — turnover 22% acima da meta de 15%',
          detail: 'Alta rotatividade concentrada em lojas (vendedores e caixas): 34% ao ano. Custo de substituição estimado em R$ 8.200/colaborador. Ação em curso: revisão de pacote de benefícios e PLR para varejo.',
          badge: { label: 'Turnover 22%', type: 'warn' },
        },
        {
          color: '#8b5cf6',
          tag: 'CONTRATAÇÃO',
          title: '38 vagas abertas — 12 em tech/produto e 26 em operações de loja',
          detail: 'Prioridade: Engenheiro Full Stack (Nike Digital), UX Designer (SNKRS BR) e 2 Visual Merchandisers para flagships. Tempo médio de contratação atual: 47 dias — meta reduzir para 30 dias.',
          badge: { label: '38 vagas', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Atletas & Embaixadores',
      cards: [
        {
          color: '#8b5cf6',
          tag: 'ATLETA',
          title: 'Vini Jr. renovado por 5 anos — maior contrato de atleta Nike no BR',
          detail: 'Contrato de patrocínio estimado em EUR 12 mi/ano inclui coleção signature, campanhas globais e ativações no Brasil. Primeiro lançamento assinado: chuteira Mercurial Vini Jr. Edition em jul/26.',
          badge: { label: 'Renovado 5 anos', type: 'ok' },
        },
        {
          color: '#8b5cf6',
          tag: 'EMBAIXADOR',
          title: 'Programa Nike Athlete Ambassador: 14 atletas locais em 6 modalidades',
          detail: 'Atletas de running, basquete, futebol feminino, skate, natação e vôlei. Budget anual de R$ 3,4 mi em produtos + fees. ROI medido via reach orgânico: 42 mi de impressões/mês.',
          badge: { label: '14 atletas', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Cultura & Desenvolvimento',
      cards: [
        {
          color: '#8b5cf6',
          tag: 'ENGAJAMENTO',
          title: 'eNPS interno Q1: 54 — queda de 8 pontos vs Q4 2025',
          detail: 'Principais drivers negativos: carga de trabalho em época de drops, falta de clareza em planos de carreira no varejo. Ação: workshops de carreira em maio + revisão de escala de lojas.',
          badge: { label: 'eNPS 54', type: 'warn' },
        },
        {
          color: '#8b5cf6',
          tag: 'TREINAMENTO',
          title: 'Nike Academy BR: 3.200 horas de treinamento em Q1 2026',
          detail: 'Plataforma interna de e-learning registrou 94% de conclusão no módulo "Know Your Product" para equipe de lojas. Certificação em produto é pré-requisito para promoção a vendedor sênior desde jan/26.',
          badge: { label: '94% conclusão', type: 'ok' },
        },
      ],
    },
  ],

  operacoes: [
    {
      sectionTitle: 'Lojas Flagship',
      cards: [
        {
          color: '#06b6d4',
          tag: 'FLAGSHIP SP',
          title: 'Loja Oscar Freire: 3.800 visitas/dia — NPS de loja 71',
          detail: 'Maior volume de vendas por m² da rede Brasil. Tempo médio de atendimento: 8 min. Fila em drops dura em média 2h40 — protocolo de gestão de fila com senhas digitais implementado em março.',
          badge: { label: 'NPS 71', type: 'ok' },
        },
        {
          color: '#06b6d4',
          tag: 'VISUAL MERCH',
          title: 'Troca de vitrine Q2 programada para 02/mai — 14 lojas multimarcas incluídas',
          detail: 'Kit de visual merchandising enviado para 14 parceiros multimarca (Centauro, SportZone, lojas independentes). Tema Q2: "Speed & Elevation" com foco em Running e Trail. Prazo de implementação: 7 dias.',
          badge: { label: 'Em execução', type: 'info' },
        },
        {
          color: '#06b6d4',
          tag: 'SNKRS OP',
          title: 'Operação drop presencial: protocolo atualizado reduz incidentes em 60%',
          detail: 'Novo protocolo de drops presenciais (pulseiras numeradas + app de check-in) reduziu tumultos de 5 para 2 ocorrências no Q1. Parceria com PM-SP para drops de alto risco (Jordan retros, collabs).',
          badge: { label: '-60% incidentes', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Logística & Distribuição',
      cards: [
        {
          color: '#06b6d4',
          tag: 'HUB',
          title: 'CD Jundiaí opera a 88% de capacidade — expansão prevista para Q4/26',
          detail: 'Centro de distribuição de 18.000m² processa 42 mil pares/dia. Pico de drops satura para 65 mil pares/dia — gap de 35%. Projeto de expansão para 26.000m² aprovado com Capex de R$ 12 mi.',
          badge: { label: '88% capacidade', type: 'warn' },
        },
        {
          color: '#06b6d4',
          tag: 'ENTREGA',
          title: 'SLA de entrega DTC: 3,2 dias úteis — meta 2,5 dias para Q3/26',
          detail: 'DHL opera 94% das entregas DTC. Last mile em SP e RJ via Loggi reduz SLA para 1,8 dias nas capitais. Devoluções representam 6,8% dos pedidos — principal motivo: tamanho incorreto (41%).',
          badge: { label: '3,2 dias SLA', type: 'info' },
        },
      ],
    },
  ],

  estoque: [
    {
      sectionTitle: 'Gestão de SKU',
      cards: [
        {
          color: '#84cc16',
          tag: 'DEAD STOCK',
          title: 'Dead stock tênis inverno: 18.400 pares — liquidação necessária',
          detail: 'Modelos de corrida com cabedal térmico (Nike Therma-FIT) encalhados após inverno 2025 fraco. Custo de oportunidade estimado em R$ 4,1 mi. Recomendação: outlet digital com desconto de 35-45% em mai/26.',
          badge: { label: '18.400 pares', type: 'warn' },
        },
        {
          color: '#84cc16',
          tag: 'SAZONALIDADE',
          title: 'Giro de estoque running +22% em abr — pré-maratonas sazonais',
          detail: 'Maratona de SP (jun) e Rio (ago) geram pico de demanda em running 90 dias antes. Sell-through do Pegasus 41 acelerou para 91% em abril. Replenishment de 22 mil pares confirmado via Yue Yuen para jun.',
          badge: { label: 'Giro +22%', type: 'ok' },
        },
        {
          color: '#84cc16',
          tag: 'REPLENISHMENT',
          title: 'Air Force 1 em stockout em 6 SKUs — reposição em 47 dias',
          detail: 'Seis colorways do AF1 Low atingiram estoque zero em lojas BR. Pedido de emergência enviado — prazo de reposição: 47 dias (produção Yue Yuen + frete aéreo DHL). Estimativa de vendas perdidas: R$ 820 mil.',
          badge: { label: 'Stockout', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Fornecimento & Importação',
      cards: [
        {
          color: '#84cc16',
          tag: 'FORNECEDOR',
          title: 'Yue Yuen (Vietnã) representa 68% do volume importado — risco de concentração',
          detail: 'Dependência elevada de único fornecedor asiático. Greve parcial na fábrica de Dong Nai em fev/26 causou atraso de 12 dias em 4 SKUs. Diversificação com Alpargatas BR em estudo para modelos básicos.',
          badge: { label: 'Risco concentrado', type: 'warn' },
        },
        {
          color: '#84cc16',
          tag: 'NACIONAL',
          title: 'Alpargatas produz linha Nike básica no Brasil — margem 6pp superior',
          detail: 'Tênis produzidos localmente via Alpargatas eliminam imposto de importação (35%) e frete internacional. Margem bruta 6pp acima da linha importada. Capacidade atual: 8 mil pares/mês — expansão para 15 mil em estudo.',
          badge: { label: 'Margem +6pp', type: 'ok' },
        },
      ],
    },
  ],

  juridico: [
    {
      sectionTitle: 'Propriedade Intelectual',
      cards: [
        {
          color: '#f97316',
          tag: 'FALSIFICAÇÃO',
          title: '12.400 pares falsificados apreendidos no BR em Q1 2026',
          detail: 'Parceria com Receita Federal e SENACON resultou em operação "Swoosh Limpo" com apreensão de 12.400 pares em São Paulo, Feira de Santana e Manaus. 3 fornecedores investigados criminalmente.',
          badge: { label: '12.400 pares', type: 'ok' },
        },
        {
          color: '#f97316',
          tag: 'MARCA',
          title: 'INPI: 3 processos de oposição de marca em andamento',
          detail: 'Dois casos de marcas similares ao Swoosh por concorrentes locais e um processo de disputa pelo termo "Air" em calçados esportivos. Prazo médio de resolução no INPI: 18-24 meses.',
          badge: { label: '3 processos', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Contratos & Compliance',
      cards: [
        {
          color: '#f97316',
          tag: 'ATLETA',
          title: 'Revisão de 6 contratos de atletas com cláusula moral — ação preventiva',
          detail: 'Após casos de atletas patrocinados envolvidos em polêmicas nas redes, Nike BR revisou cláusulas de conduta em 6 contratos. Nova cláusula moral inclui rescisão por comportamento que "denigra a marca ou valores Nike".',
          badge: { label: 'Revisão ativa', type: 'info' },
        },
        {
          color: '#f97316',
          tag: 'CONSUMIDOR',
          title: 'Reclamações no Procon SP subiram 18% — foco em defeito de solado',
          detail: 'Principal reclamação: descolamento de solado em modelos Nike React dentro do prazo de garantia (90 dias). Acervo de 214 processos ativos. Recomendação: recall preventivo ou revisão de QC no fornecedor.',
          badge: { label: '+18% Procon', type: 'warn' },
        },
        {
          color: '#f97316',
          tag: 'TRIBUTÁRIO',
          title: 'Auto de infração ICMS-SP: R$ 3,8 mi — contestação em 2ª instância',
          detail: 'Fiscalização autuou diferença de base de cálculo do ICMS-ST em importações de 2023-2024. Advogados tributaristas estimam 70% de chance de êxito na 2ª instância administrativa (CARF-SP). Prazo: ago/26.',
          badge: { label: 'R$ 3,8mi', type: 'warn' },
        },
      ],
    },
  ],
};
