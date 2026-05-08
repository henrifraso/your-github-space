import type { CompanySectorFeeds } from '../../types';

export const MAGALU_SECTOR_FEEDS: CompanySectorFeeds = {

  marketing: [
    {
      sectionTitle: "O que mudou em Marketing",
      cards: [
        {
          color: "#ec4899",
          tag: "Influência",
          title: "Lu do Magalu atinge 7mi de seguidores",
          detail: "CPM 62% menor que influenciadores humanos comparáveis. Campanha Dia das Mães ativa até 11/05 — meta de 45mi de impressões orgânicas.",
          badge: { label: "ATIVA", type: "ok" },
        },
        {
          color: "#ec4899",
          tag: "Super App",
          title: "Super App Magalu: DAU +18% em abril",
          detail: "Push notifications segmentados por histórico de compra elevaram CTR para 9.4%. A/B test em banner de eletrônicos ainda em andamento — resultado esperado 12/05.",
          badge: { label: "CRESCENDO", type: "ok" },
        },
        {
          color: "#ec4899",
          tag: "Concorrente",
          title: "Meli Air entra em São Paulo — resposta urgente",
          detail: "Mercado Livre lançou frota própria de drones em SP para entregas de até 1 kg em <30min. Risco de perda de percepção de velocidade. Equipe de mídia aguarda briefing para contra-campanha.",
          badge: { label: "ALERTA", type: "warn" },
        },
      ],
    },
    {
      sectionTitle: "Marca & Reputação",
      cards: [
        {
          color: "#ec4899",
          tag: "NPS",
          title: "NPS Magalu: 61 (alta de 4 pontos no trimestre)",
          detail: "Principais elogios: velocidade de entrega same-day e atendimento via chat. Principal ponto de melhoria: processo de troca em loja física (34% das reclamações no Reclame Aqui).",
        },
        {
          color: "#ec4899",
          tag: "Reclame Aqui",
          title: "Índice RA: 7.8 — abaixo da meta 8.0",
          detail: "Reclamações de atraso de entrega representam 28% do total — concentradas em regiões Norte e Centro-Oeste. Operações foi notificada. Prazo de resposta interno: 48h.",
          badge: { label: "ABAIXO META", type: "warn" },
        },
      ],
    },
    {
      sectionTitle: "Oportunidades de Campanha",
      cards: [
        {
          color: "#ec4899",
          tag: "Sazonalidade",
          title: "Black Friday: planejamento deve iniciar agora (D-200)",
          detail: "Histórico indica que campanhas iniciadas em maio têm ROI 2.3x maior. Sugestão: teasers de ofertas de linha branca a partir de junho, aproveitando reajuste Samsung como urgência narrativa.",
        },
        {
          color: "#ec4899",
          tag: "Marketplace",
          title: "200k sellers ativos — oportunidade de co-marketing",
          detail: "Sellers com GMV >R$50k/mês têm budget para participar de campanhas conjuntas. Proposta de programa de co-marketing com top 500 sellers pode gerar R$8-12mi em mídia incrementada.",
          badge: { label: "OPORTUNIDADE", type: "info" },
        },
        {
          color: "#ec4899",
          tag: "Shopee",
          title: "Shopee investe R$320mi em mídia no Brasil em 2026",
          detail: "Shopee aumentou budget de mídia 40% vs 2025, focando em categorias de eletrônicos e moda. Monitorar share of voice nas categorias de maior margem do Magalu.",
          badge: { label: "MONITORAR", type: "warn" },
        },
      ],
    },
  ],

  vendas: [
    {
      sectionTitle: "O que mudou em Vendas",
      cards: [
        {
          color: "#10b981",
          tag: "GMV",
          title: "GMV diário: R$142mi (meta R$135mi)",
          detail: "Superação de meta puxada por eletrônicos (+23% vs semana anterior) e marketplace (+11%). Categoria linha branca abaixo do esperado — sell-through de geladeiras em 61% (meta 75%).",
          badge: { label: "+5.2%", type: "ok" },
        },
        {
          color: "#10b981",
          tag: "Marketplace",
          title: "Marketplace representa 41% do GMV — recorde histórico",
          detail: "Take rate médio de 12.8% gera margem 3.5x superior à revenda direta. Categoria de moda liderou crescimento de sellers (+4.200 novos em abril). Meta anual de 45% do GMV no marketplace.",
        },
        {
          color: "#10b981",
          tag: "Luizacred",
          title: "Luizacred financia 40% das vendas — inadimplência em 4.2%",
          detail: "Inadimplência acima dos 3.8% orçados. Operações de crédito junto ao Itaú revisando critérios de aprovação para faixa de renda <3SM. Impacto estimado: queda de 6-8% nas vendas parceladas a partir de jun.",
          badge: { label: "RISCO", type: "warn" },
        },
      ],
    },
    {
      sectionTitle: "Pipeline e Forecast",
      cards: [
        {
          color: "#10b981",
          tag: "Sell-through",
          title: "Eletrônicos: sell-through 88% — risco de ruptura",
          detail: "Smartphones Samsung Galaxy A55 e A35 com giro acelerado pós-lançamento. Estoque projetado para 9 dias — abaixo do piso operacional de 14 dias. Replenishment automático acionado.",
          badge: { label: "RUPTURA", type: "warn" },
        },
        {
          color: "#10b981",
          tag: "Forecast",
          title: "Forecast Q2 revisado para R$12.4bi (+3% vs orçamento)",
          detail: "Revisão positiva puxada por marketplace e crescimento de categorias de saúde/beleza. Risco negativo: câmbio USD/BRL acima de R$5.60 impacta custo de importados em ~R$180mi no semestre.",
          badge: { label: "REVISADO", type: "info" },
        },
      ],
    },
  ],

  financeiro: [
    {
      sectionTitle: "O que mudou em Financeiro",
      cards: [
        {
          color: "#f59e0b",
          tag: "Câmbio",
          title: "USD/BRL a R$5.71 — impacto de R$94mi em compras Samsung",
          detail: "Reajuste de +7% da Samsung (contrato de mai/26) combinado com câmbio elevado pressiona margem de eletrônicos em 1.8 p.p. CFO avalia hedge adicional para H2. Reunião agendada 09/05.",
          badge: { label: "CRÍTICO", type: "warn" },
        },
        {
          color: "#f59e0b",
          tag: "Take Rate",
          title: "Take rate marketplace: margem 3.5x vs revenda",
          detail: "Marketplace gerou R$210mi de receita líquida em abril com custo marginal 18% do que revenda direta. Meta de mix: cada ponto percentual a mais no marketplace equivale a ~R$28mi de EBITDA incremental/ano.",
          badge: { label: "POSITIVO", type: "ok" },
        },
        {
          color: "#f59e0b",
          tag: "DIFAL",
          title: "DIFAL e-commerce: provisão de R$43mi para 2026",
          detail: "Discussão tributária sobre DIFAL em operações interestaduais ainda em fase recursal no STF. Provisão conservadora constituída. Decisão esperada para Q3 — impacto máximo de R$43mi ou reversão total.",
          badge: { label: "PROVISIONADO", type: "info" },
        },
      ],
    },
    {
      sectionTitle: "Obrigações e Riscos",
      cards: [
        {
          color: "#f59e0b",
          tag: "Inadimplência",
          title: "Luizacred: provisão adicional de R$120mi para PDD",
          detail: "Inadimplência de 4.2% exige ajuste de provisão para devedores duvidosos. Impacto negativo de R$120mi no resultado do trimestre. Revisão de política de crédito em discussão com Itaú.",
          badge: { label: "PENDENTE", type: "warn" },
        },
        {
          color: "#f59e0b",
          tag: "Capex",
          title: "Investimento em CDs: R$380mi aprovados para 2026",
          detail: "Expansão de centro de distribuição em Cajamar (SP) e novo CD em Recife para reduzir custo de frete para Norte/Nordeste. Payback estimado em 4.2 anos. Obra inicia em julho.",
        },
      ],
    },
  ],

  rh: [
    {
      sectionTitle: "O que mudou em RH",
      cards: [
        {
          color: "#8b5cf6",
          tag: "Lojas",
          title: "Turnover de vendedores de loja: 38% a.a. — acima da meta",
          detail: "Meta de turnover era 28%. Principais causas mapeadas: comissionamento percebido como baixo vs concorrentes e falta de plano de carreira estruturado. Projeto de revisão salarial em andamento — entrega em jun/26.",
          badge: { label: "CRÍTICO", type: "warn" },
        },
        {
          color: "#8b5cf6",
          tag: "Tecnologia",
          title: "Time de tech: 180 vagas abertas em maio/26",
          detail: "Pressão de crescimento do Super App exige contratação acelerada de engenheiros de software e data scientists. Salários médios 12% acima do mercado para fechar posições seniores. Budget aprovado.",
          badge: { label: "URGENTE", type: "warn" },
        },
        {
          color: "#8b5cf6",
          tag: "Logística",
          title: "Motoristas Logística Magalu: acordo coletivo vence 30/06",
          detail: "Negociação com sindicato em andamento. Reivindicação principal: reajuste de 18% (IPCA acumulado + 4%). Posição da empresa: oferta de 14%. Conciliação prevista para maio.",
          badge: { label: "NEGOCIANDO", type: "info" },
        },
      ],
    },
    {
      sectionTitle: "Capacitação e Cultura",
      cards: [
        {
          color: "#8b5cf6",
          tag: "Treinamento",
          title: "Programa Magalu Academy: 12.400 funcionários certificados em Q1",
          detail: "Cursos de técnicas de venda digital e atendimento omnichannel. NPS interno do programa: 74. Meta de 50.000 certificações até dezembro — ritmo atual requer aceleração de 40%.",
        },
        {
          color: "#8b5cf6",
          tag: "Diversidade",
          title: "Meta DEI 2026: 40% de liderança feminina — atual 36%",
          detail: "Programa de mentoria para mulheres em cargos de liderança com 340 participantes ativos. Meta de 40% requer promoção de 28 mulheres adicionais até dezembro.",
          badge: { label: "EM PROGRESSO", type: "info" },
        },
        {
          color: "#8b5cf6",
          tag: "Benefícios",
          title: "Plano de saúde: reajuste de 22% aprovado pela ANS",
          detail: "Impacto de R$34mi no orçamento anual de benefícios. RH avaliando coparticipação escalonada por faixa salarial para absorver parte do aumento sem afetar cargos de entrada.",
          badge: { label: "APROVADO", type: "info" },
        },
      ],
    },
    {
      sectionTitle: "Riscos Trabalhistas",
      cards: [
        {
          color: "#8b5cf6",
          tag: "Passivo",
          title: "Passivo trabalhista: 3.200 ações ativas — R$280mi provisionados",
          detail: "Maior concentração em reclamatórias de ex-entregadores que pleiteiam vínculo empregatício. Decisão do TST sobre tema deve sair em Q3 — pode impactar provisão em R$80-120mi.",
          badge: { label: "MONITORAR", type: "warn" },
        },
        {
          color: "#8b5cf6",
          tag: "CIPA",
          title: "Acidentes em CDs: índice de frequência 3.1 (meta <2.5)",
          detail: "Concentração de acidentes leves (cortes e torções) em CD Louveira. CIPA recomendou revisão de layout de esteiras e treinamento obrigatório de NR-11. Prazo: 60 dias.",
          badge: { label: "FORA DA META", type: "warn" },
        },
      ],
    },
  ],

  operacoes: [
    {
      sectionTitle: "O que mudou em Operações",
      cards: [
        {
          color: "#06b6d4",
          tag: "Same-Day",
          title: "Same-day delivery: 78% dos pedidos SP entregues em <6h",
          detail: "CD Louveira processa 180k pedidos/dia com taxa de erro de separação de 0.8%. Meta operacional: <0.5%. Automação de picking com AGVs prevista para Q4 deve reduzir erro para 0.2%.",
          badge: { label: "78%", type: "ok" },
        },
        {
          color: "#06b6d4",
          tag: "Mini-CDs",
          title: "1.500 lojas como mini-CDs: cobertura de 92% dos municípios >50k hab.",
          detail: "Ship-from-store representa 34% dos pedidos de e-commerce. Custo de frete 28% menor vs CD centralizado. Projeto de expansão para mais 200 pontos de ship-from-store até dezembro.",
        },
        {
          color: "#06b6d4",
          tag: "Meli Air",
          title: "Resposta ao Meli Air: estudo de viabilidade de drones iniciado",
          detail: "Parceria com startup brasileira de drones em análise para entregas de até 500g em SP capital. Regulação ANAC ainda em definição — janela operacional estimada em 18-24 meses.",
          badge: { label: "ESTUDO", type: "info" },
        },
      ],
    },
    {
      sectionTitle: "Riscos Operacionais",
      cards: [
        {
          color: "#06b6d4",
          tag: "Capacidade",
          title: "CD Louveira em 94% de capacidade — gargalo para Q3",
          detail: "Projeção de crescimento de volume em +22% para Q3 (Black Friday antecipada) coloca CD em risco de saturação. Expansão emergencial de área de 8.000m² aprovada — entrega em agosto.",
          badge: { label: "GARGALO", type: "warn" },
        },
        {
          color: "#06b6d4",
          tag: "SLA",
          title: "SLA de entrega: 96.2% (meta 98%) — foco Norte/Nordeste",
          detail: "Regiões Norte e Nordeste com SLA de 91.4% puxando média para baixo. Novo CD em Recife (previsto para jan/27) é a solução de longo prazo. Medida imediata: parceria com Jadlog para cobertura complementar.",
          badge: { label: "ABAIXO META", type: "warn" },
        },
      ],
    },
  ],

  estoque: [
    {
      sectionTitle: "O que mudou em Estoque",
      cards: [
        {
          color: "#84cc16",
          tag: "Ruptura",
          title: "Samsung Galaxy A55: cobertura de 9 dias — abaixo do piso",
          detail: "Piso operacional é 14 dias. Replenishment automático acionado com pedido de 28.000 unidades. Entrega prevista 15/05 — risco de 6 dias de stockout em lojas físicas categoria premium.",
          badge: { label: "CRÍTICO", type: "warn" },
        },
        {
          color: "#84cc16",
          tag: "Dead Stock",
          title: "Linha branca: R$68mi em estoque >90 dias (Whirlpool/Brastemp)",
          detail: "Geladeiras e fogões com giro abaixo do esperado após aumento de preço em março. Sell-through de 61% vs meta de 75%. Ação recomendada: promoção relâmpago de 48h com desconto de 15% para queima de estoque.",
          badge: { label: "DEAD STOCK", type: "warn" },
        },
        {
          color: "#84cc16",
          tag: "Replenishment",
          title: "Replenishment automático: 82% dos SKUs com reposição ativa",
          detail: "Sistema de reposição automática cobre 82% dos 1.2mi de SKUs ativos. Os 18% restantes são itens sazonais ou de cauda longa com parâmetros manuais. Projeto de expansão para 95% em Q4.",
          badge: { label: "OK", type: "ok" },
        },
      ],
    },
    {
      sectionTitle: "Sazonalidade e Planejamento",
      cards: [
        {
          color: "#84cc16",
          tag: "Black Friday",
          title: "Black Friday: janela de compras abertas para Q3 (entregas novembro)",
          detail: "Pedidos de eletrônicos para Black Friday devem ser fechados até julho para garantir disponibilidade. Samsung e LG exigem pedido firme com 120 dias de antecedência. Reunião de planejamento: 20/05.",
        },
        {
          color: "#84cc16",
          tag: "Sazonalidade",
          title: "Ar-condicionado: pré-posicionamento para verão 2026/27",
          detail: "Histórico indica sell-out de 95% em nov-fev. Necessidade de posicionar 180.000 unidades até outubro. LG e Consul com capacidade de fornecimento confirmada — contrato em negociação.",
          badge: { label: "PLANEJAMENTO", type: "info" },
        },
      ],
    },
  ],

  juridico: [
    {
      sectionTitle: "O que mudou em Jurídico",
      cards: [
        {
          color: "#f97316",
          tag: "PROCON",
          title: "Auto de infração PROCON-SP: R$4.2mi por publicidade enganosa",
          detail: "Notificação referente a campanha de preços de novembro/25 onde preço final divergia do anunciado em 12% dos casos auditados. Prazo de defesa: 30 dias (vence 18/05). Jurídico avalia contestação com chance de redução a R$1.8mi.",
          badge: { label: "PRAZO 18/05", type: "warn" },
        },
        {
          color: "#f97316",
          tag: "LGPD",
          title: "ANPD: auditoria de dados de clientes prevista para junho",
          detail: "ANPD comunicou auditoria de conformidade LGPD para junho/26. Foco: consentimento para uso de dados em personalização de ofertas e compartilhamento com Luizacred. DPO revisando documentação — 14 pontos de atenção identificados.",
          badge: { label: "PREPARAR", type: "warn" },
        },
      ],
    },
    {
      sectionTitle: "Compliance e Riscos",
      cards: [
        {
          color: "#f97316",
          tag: "Tributário",
          title: "DIFAL: recurso no STF — audiência marcada para agosto",
          detail: "Discussão sobre constitucionalidade do DIFAL em operações de e-commerce para consumidor final. Provisionados R$43mi. Se desfavorável, pagamento imediato da provisão + multa de 20%. Probabilidade de derrota: 35% (consultoria tributária).",
          badge: { label: "MONITORAR", type: "info" },
        },
        {
          color: "#f97316",
          tag: "Trabalhista",
          title: "Vínculo empregatício de entregadores: risco de R$200mi",
          detail: "3 decisões de primeira instância em SP reconhecendo vínculo de entregadores da Logística Magalu. TST deve uniformizar jurisprudência em Q3. Provisionados R$80mi — análise indica necessidade de R$120-200mi se consolidado.",
          badge: { label: "ALTO RISCO", type: "warn" },
        },
        {
          color: "#f97316",
          tag: "CDC",
          title: "Política de devolução: adequação ao prazo de 7 dias CDC",
          detail: "Auditoria interna identificou que 8% das lojas físicas cobram frete de devolução indevidamente em compras online retiradas em loja. Risco de ação coletiva. Circular operacional em elaboração — prazo 15/05.",
          badge: { label: "AJUSTAR", type: "warn" },
        },
      ],
    },
  ],
};
