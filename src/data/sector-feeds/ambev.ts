import type { CompanySectorFeeds } from '../../types';

export const AMBEV_SECTOR_FEEDS: CompanySectorFeeds = {
  marketing: [
    {
      sectionTitle: "O que mudou em Marketing",
      cards: [
        {
          color: "#ec4899",
          tag: "Perfect Store",
          title: "Score Perfect Store: 73/100 — abaixo da meta de 80",
          detail: "Avaliação de 180 critérios (PDV, ponto extra, preço sugerido, material de ponto de venda). Região Sul e Centro-Oeste abaixo da média nacional. Plano de ação para jun/26.",
          badge: { label: "ABAIXO", type: "warn" },
        },
        {
          color: "#ec4899",
          tag: "Patrocínio",
          title: "Champions League 2025/26 — R$180 mi em ativação Brahma",
          detail: "Naming rights do intervalo da transmissão Band/streaming. Recall de marca pós-final: +12 pts. Campanha integrada TV, OOH e Zé Delivery com lata comemorativa.",
          badge: { label: "ATIVA", type: "ok" },
        },
        {
          color: "#ec4899",
          tag: "Carnaval",
          title: "Pós-balanço Carnaval 2026: Skol/Brahma share of voice 61%",
          detail: "Skol Pipoca e Brahma patrocinaram 14 blocos no RJ e SP. Volume vendido Carnaval: 4,8 mi de hectolitros. Custo de ativação: R$220 mi. ROI de imagem: positivo.",
          badge: { label: "ENCERRADO", type: "info" },
        },
      ],
    },
    {
      sectionTitle: "Marca & Share of Throat",
      cards: [
        {
          color: "#ec4899",
          tag: "Share of Throat",
          title: "Share of Throat Ambev: 58% no Brasil — queda de 2 pts",
          detail: "Heineken avança em bares premium de SP e RJ com Corona e Heineken Silver. Grupo Petrópolis em recuperação judicial reduz pressão de preço no popular. Cenário misto.",
          badge: { label: "MONITORAR", type: "warn" },
        },
        {
          color: "#ec4899",
          tag: "Zé Delivery D2C",
          title: "Zé Delivery: 8,4 mi de pedidos em abr/26 — +29% a/a",
          detail: "Canal D2C com margem 22% superior ao atacado. App com 32 mi de usuários cadastrados. Expansão para 80 cidades novas prevista para Q3/26.",
          badge: { label: "+29%", type: "ok" },
        },
        {
          color: "#ec4899",
          tag: "Inovação",
          title: "Lançamento Brahma Duplo Malte Zero Açúcar — mar/26",
          detail: "Categoria no-sugar crescendo 38% a/a. SKU disponível em 42.000 PDVs em 60 dias de lançamento. Investimento de lançamento: R$35 mi em mídia.",
          badge: { label: "NOVO", type: "info" },
        },
      ],
    },
    {
      sectionTitle: "Oportunidades",
      cards: [
        {
          color: "#ec4899",
          tag: "Verão Antecipado",
          title: "Aquecimento precoce no Sul eleva demanda 3 semanas antes",
          detail: "Forecast meteorológico indica verão antecipado na região Sul em out/26. Oportunidade de antecipar campanha Skol verão e garantir espaço de gôndola prioritário.",
          badge: { label: "OPORTUNIDADE", type: "info" },
        },
        {
          color: "#ec4899",
          tag: "San Juan 51",
          title: "Cervejaria San Juan 51 cresce 67% — ameaça no segmento premium",
          detail: "Marca argentina ganha espaço em bares de Mirafiori, Pinheiros e Lapa. Resposta planejada: ativação Stella Artois em bares selecionados com programa de exclusividade.",
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
          title: "Volume Q1/26: 31,4 mi de hectolitros — +3,2% vs. Q1/25",
          detail: "Crescimento puxado por cerveja (78% do mix) e não-alcoólicos Guaraná Antarctica. Queda em spirits (-4%) por câmbio desfavorável para importação de matérias-primas.",
          badge: { label: "+3,2%", type: "ok" },
        },
        {
          color: "#10b981",
          tag: "Market Share",
          title: "Market share cerveja: 67,1% — queda de 0,8 pts vs. 2025",
          detail: "Heineken avança 0,5 pt para 22,4%. Petrópolis perde 0,3 pt em recuperação judicial. Pressão maior no canal bar/restaurante premium em capitais.",
          badge: { label: "ATENÇÃO", type: "warn" },
        },
        {
          color: "#10b981",
          tag: "Canal",
          title: "Sell-out supermercado: +5,1% | Bar/Restaurante: -1,8%",
          detail: "Off-trade (supermercado) cresce impulsionado pelo Zé Delivery e promoções de volume. On-trade (bar) perde para concorrentes premium. Estratégia de retenção de bares em avaliação.",
        },
      ],
    },
    {
      sectionTitle: "Contas & Precificação",
      cards: [
        {
          color: "#10b981",
          tag: "Precificação",
          title: "Reajuste de preço de 4,5% aplicado em mai/26 — faixa popular",
          detail: "Reajuste inferior ao custo de cevada (+9%) para não perder volume no popular. Margem comprimida em ~1,2 pts no portfólio Brahma/Skol. Premium compensa parcialmente.",
          badge: { label: "APLICADO", type: "info" },
        },
        {
          color: "#10b981",
          tag: "Grandes Contas",
          title: "Contrato Carrefour renovado — R$1,4 bi em gôndola garantida",
          detail: "Parceria de 2 anos com share de gôndola mínimo de 60% na categoria cervejas. Inclui exclusividade de ponto extra em 320 lojas. Assinado em mar/26.",
          badge: { label: "ASSINADO", type: "ok" },
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
          tag: "Custo de Insumos",
          title: "Cevada Barke: reajuste de 9% — impacto de R$210 mi/ano",
          detail: "Fornecedor Barke aplicou reajuste por quebra de safra na Europa. Contrato atual até dez/26. Negociação de fornecedor alternativo do Chile em andamento (prazo: 90 dias).",
          badge: { label: "IMPACTO", type: "warn" },
        },
        {
          color: "#f59e0b",
          tag: "Câmbio",
          title: "Lúpulo importado: exposição de R$85 mi/trim em USD/EUR",
          detail: "Brasil importa 100% do lúpulo. Com câmbio a R$5,42, custo subiu R$14 mi/trim vs. orçamento. Hedge cambial de 60% do volume contratado até set/26.",
          badge: { label: "HEDGE PARCIAL", type: "warn" },
        },
        {
          color: "#f59e0b",
          tag: "ICMS",
          title: "ICMS bebidas alcoólicas — alíquota revisada em MG para 31%",
          detail: "Decreto estadual de abr/26 eleva alíquota de 27% para 31% em Minas Gerais. Impacto: R$48 mi/ano. Área tributária avaliando compensação por créditos de exportação.",
          badge: { label: "NOVO", type: "warn" },
        },
      ],
    },
    {
      sectionTitle: "Resultado & Guidance",
      cards: [
        {
          color: "#f59e0b",
          tag: "EBITDA",
          title: "EBITDA Q1/26: R$4,8 bi — margem 32,1% (meta: 34%)",
          detail: "Compressão de margem por custo de matérias-primas e investimento em ativação de verão. Guidance mantido para 2026: margem EBITDA entre 33–35% no acumulado do ano.",
          badge: { label: "ABAIXO", type: "warn" },
        },
        {
          color: "#f59e0b",
          tag: "Dividendos",
          title: "JCP declarado: R$0,38/ação — pagamento 20/jun/26",
          detail: "Total distribuído: R$2,4 bi. Payout ratio de 65% sobre lucro líquido ajustado Q1/26. Data com: 09/mai/26.",
          badge: { label: "OK", type: "ok" },
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
          tag: "Motoristas",
          title: "8.200 motoristas de frota própria — negociação sindical em abr/26",
          detail: "Sindicato pleiteou reajuste de 12% + adicional de insalubridade. Proposta Ambev: 8,5% + PLR vinculada ao volume. Negociação em mediação no TRT. Prazo: 31/mai.",
          badge: { label: "EM NEGOCIAÇÃO", type: "warn" },
        },
        {
          color: "#8b5cf6",
          tag: "Brewmasters",
          title: "12 brewmasters formados no programa anual — 3 vagas abertas",
          detail: "Programa de 18 meses forma mestres-cervejeiros internamente. Taxa de retenção pós-formação: 94%. Vagas abertas para Manaus, Jaguariúna e Porto Alegre.",
          badge: { label: "INFO", type: "info" },
        },
        {
          color: "#8b5cf6",
          tag: "Promotores",
          title: "4.800 promotores de trade em 380 cidades ativas",
          detail: "Cobertura de PDV: visita semanal para 62.000 pontos prioritários. Absenteísmo de promotores em mar/26: 9,2% — acima da meta de 7%. Revisão de rota em andamento.",
          badge: { label: "ATENÇÃO", type: "warn" },
        },
      ],
    },
    {
      sectionTitle: "Desenvolvimento & Clima",
      cards: [
        {
          color: "#8b5cf6",
          tag: "Clima Organizacional",
          title: "Pesquisa de clima 2026: 74/100 — +3 pts vs. 2025",
          detail: "3.200 respondentes (78% de adesão). Pontos fortes: segurança no trabalho e benefícios. Pontos de melhoria: comunicação de mudanças e desenvolvimento de carreira.",
          badge: { label: "OK", type: "ok" },
        },
        {
          color: "#8b5cf6",
          tag: "Treinamento",
          title: "Academia Ambev: 42h de treinamento/colaborador em 2025",
          detail: "Plataforma de e-learning com 380 cursos. Certificações técnicas em cervejaria, logística e trade marketing. Budget de T&D 2026: R$88 mi.",
        },
      ],
    },
    {
      sectionTitle: "Saúde & Segurança",
      cards: [
        {
          color: "#8b5cf6",
          tag: "Segurança",
          title: "Taxa de acidentes: 1,8 por milhão de horas trabalhadas",
          detail: "Redução de 12% vs. 2025. Meta Ambev: zero acidentes graves. Programa DDS (Diálogo Diário de Segurança) em 100% das plantas. Auditoria ISO 45001 agendada para jul/26.",
          badge: { label: "META: ZERO", type: "info" },
        },
        {
          color: "#8b5cf6",
          tag: "Saúde",
          title: "Plano de saúde: cobertura de 32.000 colaboradores e dependentes",
          detail: "Sinistralidade Q1/26: 74% (meta: <80%). Programa de saúde mental lançado em fev/26 com 8 sessões gratuitas de terapia por colaborador/ano.",
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
          tag: "Produção",
          title: "36 cervejarias — utilização de capacidade: 81% em abr/26",
          detail: "Plantas de Jaguariúna (SP) e Águas Claras (DF) operando acima de 95% de capacidade. Estudo de expansão de capacidade em R$420 mi para 2027–2028.",
          badge: { label: "INFO", type: "info" },
        },
        {
          color: "#06b6d4",
          tag: "Cadeia Fria",
          title: "Cadeia fria end-to-end: 94,1% dos pontos em temperatura adequada",
          detail: "Sistema de telemetria em 12.400 geladeiras Ambev em PDVs. Meta: 97%. Principais falhas em bares de interior sem acesso a peças de reposição em <48h.",
          badge: { label: "ABAIXO", type: "warn" },
        },
        {
          color: "#06b6d4",
          tag: "Sustentabilidade",
          title: "Consumo de água: 3,2 hl/hl — meta 2025 de 3,0 hl não atingida",
          detail: "Planta de Lages (SC) com problemas de eficiência hídrica por equipamentos com 12 anos. Substituição de linha de envase orçada em R$68 mi para 2026.",
          badge: { label: "FORA DA META", type: "warn" },
        },
      ],
    },
    {
      sectionTitle: "Logística & Distribuição",
      cards: [
        {
          color: "#06b6d4",
          tag: "Frota",
          title: "8.200 caminhões próprios — OTIF de entregas: 91,4%",
          detail: "On Time In Full abaixo da meta de 94%. Gargalo: congestionamento nas capitais e prazo de carregamento nas plantas. Projeto de cross-docking em 6 novas cidades aprovado.",
          badge: { label: "ABAIXO", type: "warn" },
        },
        {
          color: "#06b6d4",
          tag: "Perfect Store Ops",
          title: "180 critérios auditados — 62% dos PDVs atingem nota A",
          detail: "Critérios: geladeira abastecida, preço visível, material de PDV correto, sem SKU vencido. Região Norte tem pior score (51% atingem nota A). Plano de melhoria em elaboração.",
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
          tag: "Vasilhame",
          title: "Inventário de garrafas retornáveis: 380 mi de unidades",
          detail: "Taxa de retorno em abr/26: 78% (meta: 83%). Perda anual estimada de garrafas: R$240 mi. Campanha de devolução com desconto no próximo pedido em teste em 3 cidades.",
          badge: { label: "ABAIXO", type: "warn" },
        },
        {
          color: "#84cc16",
          tag: "Matéria-Prima",
          title: "Estoque de cevada malteada: 68 dias de cobertura",
          detail: "Abaixo do nível de conforto de 90 dias por restrições de capacidade de armazenagem. Negociação de aluguel de silo adicional em Curitiba (PR) em andamento — prazo: 30 dias.",
          badge: { label: "RISCO", type: "warn" },
        },
        {
          color: "#84cc16",
          tag: "Produto Acabado",
          title: "Estoque de produto acabado: 22 dias de cobertura",
          detail: "Dentro do range ideal (18–28 dias). Skus críticos com <14 dias: Brahma 473ml lata e Guaraná Antárctica 2L. Reposição programada para 08/mai e 11/mai.",
          badge: { label: "OK", type: "ok" },
        },
      ],
    },
    {
      sectionTitle: "Sazonalidade & Validade",
      cards: [
        {
          color: "#84cc16",
          tag: "Validade",
          title: "Volume vencido em PDV (abr/26): 0,18% do sell-out",
          detail: "Acima da meta de 0,10%. Principal categoria: long neck premium com giro lento. Programa de recall preventivo iniciado em 280 PDVs com risco elevado.",
          badge: { label: "FORA DA META", type: "warn" },
        },
        {
          color: "#84cc16",
          tag: "Planejamento Verão",
          title: "Pré-build estoque verão 26/27: início em ago/26",
          detail: "Histórico indica pico de demanda 40% acima da média entre nov e fev. Plano de produção antecipada exige aumento de estoque de lata (Crown Holdings) contratado em abr.",
          badge: { label: "PLANEJADO", type: "info" },
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
          tag: "CONAR",
          title: "CONAR — 3 representações contra campanhas de cerveja em 2026",
          detail: "Duas arquivadas (Skol e Brahma). Uma pendente: campanha Beats com influencer menor de 25 anos. Área jurídica ajustando briefing criativo para conformidade com o Código CONAR.",
          badge: { label: "1 PENDENTE", type: "warn" },
        },
        {
          color: "#f97316",
          tag: "MAPA",
          title: "Renovação de registros MAPA — 14 SKUs com vencimento em jun/26",
          detail: "Processo de renovação iniciado com 90 dias de antecedência. 11 de 14 registros já protocolados. 3 pendentes por necessidade de atualização de rótulo. Risco de interrupção de venda baixo.",
          badge: { label: "EM PROCESSO", type: "info" },
        },
      ],
    },
    {
      sectionTitle: "Licenças & Compliance Ambiental",
      cards: [
        {
          color: "#f97316",
          tag: "Licença Ambiental",
          title: "Licença de operação planta Lages (SC) — renovação set/26",
          detail: "Laudo de conformidade ambiental em elaboração pelo IBAM. Exigência de adequação de efluentes industriais até ago/26 para não comprometer renovação. Investimento: R$12 mi aprovado.",
          badge: { label: "PRAZO SET/26", type: "warn" },
        },
        {
          color: "#f97316",
          tag: "Tributário",
          title: "Discussão judicial ICMS-ST — R$1,4 bi em créditos em disputa",
          detail: "Ação no STJ sobre base de cálculo do ICMS-ST em bebidas. Decisão esperada para Q4/26. Cenário favorável pode gerar crédito de R$1,4 bi. Área tributária com tese consolidada.",
          badge: { label: "ACOMPANHANDO", type: "info" },
        },
      ],
    },
  ],
};
