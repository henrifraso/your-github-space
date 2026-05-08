import type { CompanySectorFeeds } from '../../types';

export const IFOOD_SECTOR_FEEDS: CompanySectorFeeds = {
  marketing: [
    {
      sectionTitle: "O que mudou em Marketing",
      cards: [
        {
          color: "#ec4899",
          tag: "Assinatura",
          title: "iFood Card R$9,90 — base ativa cresce 18% em 90 dias",
          detail: "Assinantes iFood Card geram ticket médio 31% maior e taxa de retenção de 74% no mês. Meta: 8 mi de assinantes até dez/26.",
          badge: { label: "EM ALTA", type: "ok" },
        },
        {
          color: "#ec4899",
          tag: "Cashback",
          title: "Campanha supermercado: 12% cashback via iFood Card",
          detail: "Parceria Carrefour e Extra ativa até 30/jun. Volume de pedidos grocery +22% na primeira semana. Custo de subsídio projetado: R$4,2 mi.",
          badge: { label: "ATIVA", type: "ok" },
        },
        {
          color: "#ec4899",
          tag: "Push Notification",
          title: "Algoritmo 'hora da fome' — open rate 34% acima da média",
          detail: "Notificações segmentadas por horário de pico (11h30 e 18h45) com personalização por histórico de pedidos. Teste A/B rodando para usuários iOS.",
          badge: { label: "TESTANDO", type: "info" },
        },
      ],
    },
    {
      sectionTitle: "Marca & Reputação",
      cards: [
        {
          color: "#ec4899",
          tag: "NPS Consumidor",
          title: "NPS app: 71 pontos — queda de 4 pts vs. trimestre anterior",
          detail: "Principal driver de queda: tempo de espera acima de 40 min nos finais de semana. Top elogio: variedade de restaurantes e interface.",
          badge: { label: "ATENÇÃO", type: "warn" },
        },
        {
          color: "#ec4899",
          tag: "Badge Premium",
          title: "Selo 'Restaurante Verificado' em 12.400 parceiros",
          detail: "Badge aumenta taxa de conversão em 17% no card de restaurante. Novos critérios de higiene e tempo de preparo implementados em mar/26.",
        },
        {
          color: "#ec4899",
          tag: "Competição",
          title: "Rappi anuncia entrega em 10 min para SP e RJ",
          detail: "Resposta planejada: piloto iFood Flash (15 min) em Pinheiros e Barra da Tijuca para jul/26. Orçamento de mídia defensivo aprovado: R$12 mi.",
          badge: { label: "URGENTE", type: "warn" },
        },
      ],
    },
    {
      sectionTitle: "Oportunidades",
      cards: [
        {
          color: "#ec4899",
          tag: "Anúncios",
          title: "Receita de mídia interna: R$380 mi projetado 2026",
          detail: "Restaurantes pagam CPC de R$0,45–R$1,20 por clique em destaque. Taxa de ocupação de inventory publicitário: 81%. Novo formato de vídeo em teste.",
          badge: { label: "INFO", type: "info" },
        },
        {
          color: "#ec4899",
          tag: "Zé Delivery",
          title: "Parceria estratégica amplia bebidas no iFood em 3x",
          detail: "SKUs de bebidas no app saltaram de 320 para 940 com integração Zé Delivery. Categoria cresce 28% MoM. Oportunidade de bundle com iFood Card.",
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
          tag: "Volume",
          title: "79,8 mi de pedidos em abr/26 — recorde histórico",
          detail: "Crescimento de 11% vs. abr/25. Pico registrado: 3,2 mi de pedidos no domingo de Páscoa. Categorias líderes: pizza (19%), lanches (17%), japonesa (12%).",
          badge: { label: "+11%", type: "ok" },
        },
        {
          color: "#10b981",
          tag: "Take Rate",
          title: "Take rate consolidado: 26,4% — estável vs. Q4/25",
          detail: "Comissão base de restaurantes em 25–27%. Receita incremental de anúncios eleva take rate efetivo para 26,4%. Pressão de Rappi pode forçar redução pontual.",
          badge: { label: "ESTÁVEL", type: "ok" },
        },
        {
          color: "#10b981",
          tag: "Conversão",
          title: "Taxa de conversão app: 41% — alta de 3 pts em 60 dias",
          detail: "Melhoria atribuída ao novo layout de cards de restaurante e filtros de tempo estimado. Teste de checkout em 1 clique aumentou conversão em 8% no grupo experimental.",
        },
      ],
    },
    {
      sectionTitle: "Parceiros & Canal",
      cards: [
        {
          color: "#10b981",
          tag: "Base Parceiros",
          title: "350.000 restaurantes ativos — +28.000 nos últimos 6 meses",
          detail: "Dark kitchens respondem por 9% da base e 14% da receita. Estratégia de upsell de planos premium a restaurantes com >200 pedidos/mês.",
          badge: { label: "INFO", type: "info" },
        },
        {
          color: "#10b981",
          tag: "Receita por Pedido",
          title: "Ticket médio: R$51,20 (+R$3,80 vs. 2025)",
          detail: "Alta impulsionada por inflação de alimentos (+6,1% IPCA alimentação) e upsell de itens adicionais via IA no checkout. Frete médio cobrado: R$6,40.",
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
          tag: "Subsídio de Frete",
          title: "Custo de subsídio: R$180 mi em abr/26 — acima do budget",
          detail: "Budget mensal de R$155 mi superado em 16%. Subsídios para novos usuários (primeiros 3 pedidos grátis) respondem por 38% do total. Revisão de política em maio/26.",
          badge: { label: "ACIMA", type: "warn" },
        },
        {
          color: "#f59e0b",
          tag: "Receita de Anúncios",
          title: "Ads iFood: R$31,4 mi em abr/26 — +44% a/a",
          detail: "Crescimento acelerado de sponsored listings e banners contextuais. Projeção anual: R$380 mi. Margem bruta de anúncios estimada em 82%.",
          badge: { label: "+44%", type: "ok" },
        },
        {
          color: "#f59e0b",
          tag: "iFood Pay",
          title: "Volume transacionado iFood Pay: R$4,1 bi/mês",
          detail: "MDR médio de 1,8% sobre transações processadas. Receita financeira de R$73 mi/mês. Inadimplência de restaurantes no parcelamento: 2,1%.",
        },
      ],
    },
    {
      sectionTitle: "Obrigações & Riscos",
      cards: [
        {
          color: "#f59e0b",
          tag: "Imposto",
          title: "CSLL e IRPJ trimestral — prazo 30/jun/26",
          detail: "Estimativa de pagamento: R$140 mi referente ao lucro do Q1/26. Área fiscal revisando aproveitamento de JCP para redução de carga.",
          badge: { label: "PENDENTE", type: "warn" },
        },
        {
          color: "#f59e0b",
          tag: "Câmbio",
          title: "Exposição cambial: Google Cloud contratos em USD",
          detail: "Contratos de infraestrutura com Google Cloud em dólares representam R$28 mi/mês de exposição. Hedge parcial contratado até dez/26 com trava em R$5,15.",
          badge: { label: "HEDGE", type: "info" },
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
          tag: "Engenharia",
          title: "60 vagas abertas em Engenharia de Dados e ML — SP",
          detail: "Foco em engenheiros sênior de recommendation system e MLOps. Salário médio ofertado: R$22.000–R$35.000 CLT. Time-to-hire atual: 68 dias. Meta: 45 dias.",
          badge: { label: "URGENTE", type: "warn" },
        },
        {
          color: "#8b5cf6",
          tag: "Turnover",
          title: "Turnover Q1/26: 18% — alta de 4 pts vs. Q4/25",
          detail: "Maior evasão em CS de Restaurantes (24%) e Produto Jr (21%). Exit interviews apontam salário e crescimento de carreira. Revisão de banda salarial programada para jun/26.",
          badge: { label: "ATENÇÃO", type: "warn" },
        },
        {
          color: "#8b5cf6",
          tag: "Entregadores",
          title: "320.000 entregadores ativos (parceiros PJ) em abr/26",
          detail: "Média de 18 entregas/dia por entregador ativo. Programa iFood Junto oferece seguro de acidentes e auxílio equipamento. Sem vínculo CLT — pressão regulatória crescente.",
        },
      ],
    },
    {
      sectionTitle: "Cultura & Benefícios",
      cards: [
        {
          color: "#8b5cf6",
          tag: "Clima",
          title: "eNPS interno: 54 — abaixo da meta de 65",
          detail: "Pesquisa realizada em mar/26 com 4.800 colaboradores. Pontos críticos: comunicação da liderança e carga de trabalho em squads de crescimento.",
          badge: { label: "ATENÇÃO", type: "warn" },
        },
        {
          color: "#8b5cf6",
          tag: "Benefícios",
          title: "Stock options para sêniors: plano de vesting 4 anos cliff 1",
          detail: "Revisão do plano de equity aprovada pelo board em abr/26. Elegibilidade ampliada para Engenharia e Produto nível sênior. Ferramenta Carta implementada para gestão.",
          badge: { label: "NOVO", type: "info" },
        },
      ],
    },
    {
      sectionTitle: "Operações de Pessoas",
      cards: [
        {
          color: "#8b5cf6",
          tag: "CS Restaurantes",
          title: "Time de CS: 1.200 atendentes — SLA 4h de resposta",
          detail: "350.000 parceiros atendidos por 1.200 agentes. Taxa de resolução no 1º contato: 68%. Automação via chatbot resolve 41% dos tickets antes do humano.",
        },
        {
          color: "#8b5cf6",
          tag: "Headcount",
          title: "Headcount total: 6.800 CLTs — crescimento de 8% em 12 meses",
          detail: "Áreas que mais cresceram: Engenharia (+320), Produto (+140), Dados (+95). Budget de folha 2026: R$820 mi incluindo encargos.",
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
          tag: "SLA Entrega",
          title: "Tempo médio de entrega: 37 min — acima da meta de 35 min",
          detail: "Meta de SLA <35 min não atingida em abr/26. Problema concentrado em finais de semana (pico 48 min) e chuvas na região SE. Algoritmo de roteamento v3.2 em teste.",
          badge: { label: "FORA DA META", type: "warn" },
        },
        {
          color: "#06b6d4",
          tag: "Uptime App",
          title: "Uptime iFood app: 99,91% — 1 incidente P1 em abr/26",
          detail: "Incidente de 43 min no dia 14/abr afetou checkout em iOS. Post-mortem publicado internamente. Revisão de runbooks de incident response concluída.",
          badge: { label: "OK", type: "ok" },
        },
        {
          color: "#06b6d4",
          tag: "Dark Kitchens",
          title: "48 dark kitchens iFood operando em 12 cidades",
          detail: "Ticket médio das dark kitchens: R$47,80 com margem bruta 9% maior que restaurantes tradicionais. Expansão para Manaus e Fortaleza planejada para Q3/26.",
          badge: { label: "EXPANDINDO", type: "info" },
        },
      ],
    },
    {
      sectionTitle: "Infraestrutura & Tecnologia",
      cards: [
        {
          color: "#06b6d4",
          tag: "Algoritmo",
          title: "Roteamento v3.2: redução de 12% no custo por entrega",
          detail: "Modelo de ML prevê demanda por zona com 91% de acurácia (30 min de antecedência). Reposicionamento preditivo de entregadores reduziu tempo de aceite de 4,2 para 2,8 min.",
          badge: { label: "EM TESTE", type: "info" },
        },
        {
          color: "#06b6d4",
          tag: "Infraestrutura",
          title: "Migração para Google Cloud concluída em 94% — prazo jul/26",
          detail: "Últimos microsserviços de legacy on-premise sendo migrados. Economia projetada pós-migração: R$18 mi/ano em CAPEX de data center.",
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
          tag: "Capacidade",
          title: "Pico processado: 3.200 pedidos/segundo — infra elástica GCP",
          detail: "Auto-scaling ativado durante pico de Páscoa absorveu demanda sem degradação. Custo adicional de infra no pico: R$380 mil. Budget para Dia das Mães alocado.",
          badge: { label: "OK", type: "ok" },
        },
        {
          color: "#84cc16",
          tag: "Frota",
          title: "Disponibilidade de entregadores: queda 22% nas chuvas de abr",
          detail: "Zonas de SP Leste e Zona Sul tiveram cobertura <60% em 6 dias de chuva forte. Programa de incentivo climático (R$4 extra/entrega) ativado em caráter emergencial.",
          badge: { label: "RISCO", type: "warn" },
        },
        {
          color: "#84cc16",
          tag: "Estoque Parceiros",
          title: "Sistema de sinalização de indisponibilidade: 98,2% de precisão",
          detail: "Integração Totvs PDV com 12.000 restaurantes permite atualização de cardápio em tempo real. Pedidos cancelados por item indisponível: reduzidos de 3,8% para 1,4%.",
        },
      ],
    },
    {
      sectionTitle: "Sazonalidade & Planejamento",
      cards: [
        {
          color: "#84cc16",
          tag: "Dia das Mães",
          title: "Projeção Dia das Mães (11/mai): +35% vs. domingo comum",
          detail: "Pré-posicionamento de 28.000 entregadores adicionais previsto. Parceiros alertados para reforço de estoque de insumos. Campanha de pré-agendamento de pedidos no ar.",
          badge: { label: "PLANEJADO", type: "info" },
        },
        {
          color: "#84cc16",
          tag: "Grocery",
          title: "SKUs de supermercado disponíveis: 22.000 em SP e RJ",
          detail: "Prazo médio de entrega grocery: 41 min. Taxa de ruptura de estoque parceiro: 8,4%. Meta: reduzir para 5% com integração de APIs de WMS dos supermercados.",
          badge: { label: "EM MELHORIA", type: "info" },
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
          tag: "Regulação Trabalhista",
          title: "PL 2630 — regulação de plataformas digitais aguarda votação",
          detail: "Projeto tramita no Senado com previsão de votação para jul/26. Cenário adverso: obrigação de CLT para entregadores. Impacto estimado na folha: R$2,1 bi/ano. Lobby e jurídico mobilizados.",
          badge: { label: "CRÍTICO", type: "warn" },
        },
        {
          color: "#f97316",
          tag: "LGPD",
          title: "ANPD — auditoria de dados de consumo concluída em fev/26",
          detail: "iFood processou 18 bi de eventos de comportamento em 2025. ANPD solicitou relatório ROPA detalhado. Entregue em 15/mar. Sem notificação de irregularidade até mai/26.",
          badge: { label: "OK", type: "ok" },
        },
      ],
    },
    {
      sectionTitle: "Compliance & Contratos",
      cards: [
        {
          color: "#f97316",
          tag: "Antitruste",
          title: "CADE monitora concentração de mercado — market share 75% delivery",
          detail: "CADE abriu procedimento preparatório em jan/26 para avaliar práticas de exclusividade com restaurantes. Área jurídica em diálogo preventivo. Sem medida cautelar até o momento.",
          badge: { label: "MONITORAR", type: "warn" },
        },
        {
          color: "#f97316",
          tag: "Contratos",
          title: "Renovação de contrato Google Cloud — R$310 mi/3 anos",
          detail: "Negociação concluída em abr/26 com desconto de 14% vs. contrato anterior. SLAs de disponibilidade mantidos em 99,95%. Cláusula de saída após 18 meses incluída.",
          badge: { label: "ASSINADO", type: "ok" },
        },
      ],
    },
  ],
};
