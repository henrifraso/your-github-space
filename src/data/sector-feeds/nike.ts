import type { CompanySectorFeeds } from '../../types';

export const NIKE_SECTOR_FEEDS: CompanySectorFeeds = {
  marketing: [
    {
      sectionTitle: 'Coleção Inverno 2026',
      cards: [
        {
          color: '#ec4899',
          tag: 'COLEÇÃO',
          title: 'Carioca e Paquetá lançam Inverno 26 com botas over-the-knee e western',
          detail: 'Bandeira Carioca focada em SP/jovem fashion e Paquetá em RS/SC. Mix Inverno 2026 prioriza couro feminino, botas long-boot e estampas western. Lançamento sincronizado em 186 lojas + e-commerce em 15/mai.',
          badge: { label: 'No ar', type: 'ok' },
        },
        {
          color: '#ec4899',
          tag: 'DROP',
          title: 'Diadora B.Elite "Made in Italy" exclusivo na Oscar',
          detail: 'Licença exclusiva Diadora desde 2022. Drop limitado a 4.200 pares no Brasil — só na Oscar (loja + e-commerce). Preço R$ 1.299. Margem 18 p.p. acima da média do tênis multimarca.',
          badge: { label: 'Sold Out', type: 'ok' },
        },
        {
          color: '#ec4899',
          tag: 'CAMPANHA',
          title: 'Dia das Mães +30% vs projeção do setor',
          detail: 'Campanha "Para Quem Caminha com Você" rodou em rádio, OOH e digital. Receita +30% YoY no Dia das Mães. Tícket médio R$ 312 (+12 p.p.). Conversão e-commerce +22%.',
          badge: { label: '+30% YoY', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Digital & Redes',
      cards: [
        {
          color: '#ec4899',
          tag: 'INSTAGRAM',
          title: '@oscarcalcados atinge 480 mil seguidores',
          detail: 'Crescimento 23% nos últimos 12 meses. Reels com unboxing Diadora performam 3,4x acima da média. Recomendação: aumentar UGC de loja física e ativar @oscarcalcadossatelite e demais perfis por loja.',
          badge: { label: '+23% YoY', type: 'ok' },
        },
        {
          color: '#ec4899',
          tag: 'TIKTOK',
          title: 'Vídeo "Tour pela maior loja do Vale" passa 4,2 mi views',
          detail: 'Loja-modelo da Vila Nair (SJC) virou destino de creators. Pico de buscas por "Oscar Calçados" no Google Trends em maio. Próximo passo: parceria com 5 creators de SJC e Taubaté para junho.',
          badge: { label: 'Viral', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Bandeiras & Identidade',
      cards: [
        {
          color: '#ec4899',
          tag: 'BRAND',
          title: 'Bandeira tríplice Oscar+Paquetá+Carioca evita canibalização',
          detail: 'Estudo interno: 73% dos clientes Carioca SP não compram em Oscar, e 68% dos clientes Paquetá RS não conhecem Oscar. Segmentação geográfica + posicionamento por bandeira maximiza share sem sobreposição.',
          badge: { label: 'Estratégico', type: 'info' },
        },
        {
          color: '#ec4899',
          tag: 'OOH',
          title: 'Outdoor inverno em 12 cidades do Vale do Paraíba',
          detail: 'Mídia exterior + busdoor nas linhas SJC ↔ Taubaté, Caçapava, Jacareí. CPM R$ 5,80. Foco: Conforto Diadora + botas Carioca. Investimento: R$ 420 mil para mai-jun 26.',
          badge: { label: 'Ativo', type: 'info' },
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
          tag: 'LOJA FÍSICA',
          title: 'Sell-through Inverno 26 maio: 81% — acima da meta de 75%',
          detail: 'Top regiões: Vale do Paraíba 87%, RS 84%, SC 79%. Bandeira Oscar (média/premium) puxou ticket médio para R$ 298. Carioca SP teve sell-through 76%. Paquetá Sports 71% (abaixo).',
          badge: { label: '81% geral', type: 'ok' },
        },
        {
          color: '#10b981',
          tag: 'E-COMMERCE',
          title: 'oscarcalcados.com.br: GMV +28% YoY em maio',
          detail: 'GMV maio R$ 14,2 mi (+28% YoY). Same-day delivery via Infracommerce em SP/RS/SC respondeu por 36% dos pedidos. NPS digital atingiu 72 (vs 58 pré-Infracommerce).',
          badge: { label: '+28% YoY', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Performance por Bandeira',
      cards: [
        {
          color: '#10b981',
          tag: 'OSCAR',
          title: 'Oscar (Vale do Paraíba) — ticket médio R$ 312, +18% YoY',
          detail: '92 lojas no Vale + interior SP. Mix premium/médio puxa ticket. Diadora B.Elite e Carioca over-the-knee respondem por 24% das vendas. Conversão 31% (acima média setor).',
          badge: { label: '+18% ticket', type: 'ok' },
        },
        {
          color: '#10b981',
          tag: 'PAQUETÁ',
          title: 'Paquetá (RS/SC) — sell-through 78%, ticket R$ 198',
          detail: '63 lojas em RS/SC herdadas em 2023. Mix popular/médio. Coleção Inverno 26 com botas Vizzano e Pegada. Pós-integração estabilizou em 3.500 colaboradores totais no grupo.',
          badge: { label: '78% sell-through', type: 'info' },
        },
        {
          color: '#10b981',
          tag: 'CARIOCA',
          title: 'Carioca (SP/jovem fashion) — +42% YoY em SP capital',
          detail: 'Bandeira jovem/fashion dispara em SP. Linha botas western Inverno 26 viralizou no TikTok @cariocacalcados. Ticket R$ 215, conversão 28%. Recomendação: abrir 3 lojas adicionais SP em 2T26.',
          badge: { label: '+42% YoY', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Metas Q2 2026',
      cards: [
        {
          color: '#10b981',
          tag: 'META',
          title: 'Meta Q2: R$ 285 mi consolidado — pace 91%',
          detail: 'Acumulado mai-jun semana 4: R$ 173 mi. Principais alavancas: Inverno 26 (botas), aniversário Oscar (julho), reposição Diadora pós-Mercosul-UE. Risco: chuvas RS afetam Paquetá.',
          badge: { label: '91% pace', type: 'info' },
        },
        {
          color: '#10b981',
          tag: 'CROSSELL',
          title: 'Bundle "tênis + meia + flanela" eleva ticket 24%',
          detail: 'Bundle promocional testado em 28 lojas Oscar. Aceitação 47% no checkout. Margem do bundle: 58% vs 49% do tênis solo. Ação: ampliar para 186 lojas em 15 dias com treinamento de venda assistida.',
          badge: { label: '+24% ticket', type: 'ok' },
        },
      ],
    },
  ],

  financeiro: [
    {
      sectionTitle: 'Margens & Mix',
      cards: [
        {
          color: '#f59e0b',
          tag: 'MARGEM',
          title: 'Margem bruta consolidada 38% — Diadora puxa pra cima',
          detail: 'Licença Diadora rende 18 p.p. de margem extra vs tênis multimarca padrão (Nike/Olympikus). Diadora respondeu por 11% do volume e 18% da margem em mai/26. Meta 2026: ampliar Diadora pra 16% do mix.',
          badge: { label: '+18pp Diadora', type: 'ok' },
        },
        {
          color: '#f59e0b',
          tag: 'PAGAMENTOS',
          title: 'PIX = 41% do tíquete em loja física',
          detail: 'PIX já passa crédito parcelado em volume nas lojas Oscar (41% vs 38%). Margem PIX é melhor: zero taxa de antecipação. Em junho, será ativada campanha "Compre no PIX, ganhe R$ 30" pra acelerar adoção.',
          badge: { label: '41% mix', type: 'ok' },
        },
        {
          color: '#f59e0b',
          tag: 'ICMS',
          title: 'ICMS-ST de calçados em SP — análise pós-aquisição Paquetá',
          detail: 'Tributário avalia impacto da unificação fiscal pós-Paquetá. Crédito tributário acumulado em RS estimado em R$ 4,8 mi. Compensação prevista no 2T26 com PEC do PIS/COFINS regional.',
          badge: { label: 'Análise', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Resultado Pós-Paquetá',
      cards: [
        {
          color: '#f59e0b',
          tag: 'EBITDA',
          title: 'EBITDA 1T26: R$ 42 mi — +27% vs 1T25 (já consolidado)',
          detail: 'Sinergias da Paquetá: redução de overhead R$ 8 mi/ano (jurídico + TI integrados). CD do RS reduziu frete pra Sul em 18%. Margem operacional 13,4% (vs 11,1% no 1T25 standalone).',
          badge: { label: '+27% YoY', type: 'ok' },
        },
        {
          color: '#f59e0b',
          tag: 'CAPEX',
          title: 'Aporte de R$ 12 mi pra modernização do CD RS em 2T26',
          detail: 'Investimento foca em WMS, esteira automatizada e ampliação de docas. ROI em 22 meses. Capacidade do CD passará de 28k pares/dia pra 48k. Beneficia bandeiras Paquetá+Oscar+Carioca no Sul.',
          badge: { label: 'R$ 12 mi', type: 'info' },
        },
      ],
    },
  ],

  rh: [
    {
      sectionTitle: 'Equipe Consolidada',
      cards: [
        {
          color: '#8b5cf6',
          tag: 'HEADCOUNT',
          title: '3.500 colaboradores no grupo — 1.800 só no Vale do Paraíba',
          detail: 'Pós-Paquetá: 2.800 no Sul (RS/SC). Turnover varejo 28%/ano. Custo de substituição: R$ 6.400/colaborador. Ação 2026: PLR atrelada ao sell-through por loja + plano de carreira "Gerente de Loja Júnior".',
          badge: { label: 'Turnover 28%', type: 'warn' },
        },
        {
          color: '#8b5cf6',
          tag: 'CONTRATAÇÃO',
          title: '48 vagas abertas pra Inverno 26 — 28 em SP/Vale e 20 no Sul',
          detail: 'Prioridade: 12 vendedores Carioca SP, 8 visuais Oscar SJC, 14 caixas Paquetá RS/SC, 6 backoffice e 8 tech (e-commerce). Tempo médio de contratação: 21 dias (meta 18).',
          badge: { label: '48 vagas', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Integração Pós-Paquetá',
      cards: [
        {
          color: '#8b5cf6',
          tag: 'CULTURA',
          title: 'Pesquisa de clima 2026: eNPS 38 nas lojas Paquetá vs 56 nas Oscar',
          detail: 'Gap explicado por insegurança pós-aquisição. Programa "Sou Oscar, Sou Paquetá" rodando workshops em todas as 63 lojas do Sul. Meta: equiparar eNPS até fim de 2026.',
          badge: { label: 'eNPS 38/56', type: 'warn' },
        },
        {
          color: '#8b5cf6',
          tag: 'BENEFÍCIOS',
          title: 'Unificação de benefícios Oscar+Paquetá completa em jul/26',
          detail: 'Vale-alimentação R$ 580 + plano de saúde Unimed + day-off no aniversário. Investimento: R$ 22 mi/ano (vs R$ 16 mi anterior). PLR atrelada a NPS de loja + sell-through.',
          badge: { label: 'Jul/26', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Treinamento & Cultura',
      cards: [
        {
          color: '#8b5cf6',
          tag: 'ACADEMY',
          title: 'Oscar Academy: 4.800 horas de treinamento em Q1 2026',
          detail: 'Foco em venda assistida + storytelling Diadora. 96% de conclusão do módulo "Conheça seu Tênis". Certificação obrigatória pra promoção a vendedor sênior desde jan/26. Próximo módulo: "Atendimento via WhatsApp".',
          badge: { label: '96% conclusão', type: 'ok' },
        },
        {
          color: '#8b5cf6',
          tag: 'D&I',
          title: 'Programa Mulheres na Liderança: 42% de gerentes mulheres',
          detail: 'Meta 50% até 2027. 14 mulheres em programa de mentoria com diretoria. Bandeira Carioca já tem 68% de gerentes mulheres. Próximo passo: mentoria pra alta liderança via VC Oscar.',
          badge: { label: '42% liderança', type: 'info' },
        },
      ],
    },
  ],

  operacoes: [
    {
      sectionTitle: 'Rede de 186 Lojas',
      cards: [
        {
          color: '#06b6d4',
          tag: 'FLAGSHIP SJC',
          title: 'Loja matriz Vila Nair (SJC): 2.400 visitas/dia — NPS 78',
          detail: 'Rua Paraibuna 1692 — maior loja Oscar do grupo (820m²). Faturamento R$ 1,8 mi/mês. Tempo médio de atendimento 7 min. Tour pela loja viralizou no TikTok em maio (4,2 mi views).',
          badge: { label: 'NPS 78', type: 'ok' },
        },
        {
          color: '#06b6d4',
          tag: 'VISUAL MERCH',
          title: 'Troca de vitrine Inverno 26 finalizada em 178 das 186 lojas',
          detail: 'Vitrine "Caminhe Comigo" focada em botas + couro feminino. 8 lojas atrasadas (RS pós-chuvas). Kit centralizado garantiu consistência visual. Próxima troca: Black Friday novembro.',
          badge: { label: '178/186', type: 'info' },
        },
        {
          color: '#06b6d4',
          tag: 'EXPANSÃO',
          title: 'Plano 2026: abrir 12 lojas (8 Carioca SP + 4 Oscar interior SP)',
          detail: 'CAPEX médio por loja R$ 1,4 mi. Foco bandeira Carioca (que cresce +42% YoY) e expansão Oscar no interior SP (Bauru, Araçatuba). Localização: shoppings premium e ruas de alto fluxo.',
          badge: { label: '+12 lojas', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Logística & Same-day',
      cards: [
        {
          color: '#06b6d4',
          tag: 'HUB',
          title: 'CD RS opera a 71% de capacidade — modernização em Q2/26',
          detail: 'Centro de distribuição em Sapiranga (RS) processa 28 mil pares/dia. CAPEX de R$ 12 mi pra WMS + esteira + ampliação de docas elevará capacidade a 48 mil pares/dia até dez/26.',
          badge: { label: '71% capacidade', type: 'info' },
        },
        {
          color: '#06b6d4',
          tag: 'SAME-DAY',
          title: 'Same-day Infracommerce: 36% dos pedidos do e-commerce',
          detail: 'Parceria com Infracommerce ativa em SP/RS/SC. Same-day responde por 36% e next-day por 47% dos pedidos. NPS digital 72 (vs 58 antes). Expansão pra MG e PR planejada pra 3T26.',
          badge: { label: '36% same-day', type: 'ok' },
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
          title: 'Inverno 2025 encalhado: 14.200 pares em RS — liquidação ativa',
          detail: 'Modelos de bota inverno 25 (Pegada/Vizzano) encalhados pós-chuvas RS em 2024. Custo de oportunidade: R$ 2,8 mi. Outlet ativo nas lojas RS com desconto 40% — fim em jun/26.',
          badge: { label: '14.200 pares', type: 'warn' },
        },
        {
          color: '#84cc16',
          tag: 'SAZONALIDADE',
          title: 'Giro de botas Inverno 26 +38% em mai vs proj — replenishment',
          detail: 'Botas Carioca western e over-the-knee surpreenderam projeção. Sell-through 87% em 30 dias. Replenishment de 8 mil pares via Vizzano confirmado pra jun. Risco: stockout em jul.',
          badge: { label: 'Giro +38%', type: 'ok' },
        },
        {
          color: '#84cc16',
          tag: 'CURADORIA',
          title: 'Mix de SKUs por bandeira otimizado pós-Paquetá',
          detail: 'Oscar mantém ~3.200 SKUs (mix premium/médio). Paquetá foca 1.800 SKUs populares. Carioca 2.100 SKUs jovem/fashion. Redução de 22% no overlap entre bandeiras pós-integração.',
          badge: { label: 'Mix por bandeira', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Fornecimento Multimarca',
      cards: [
        {
          color: '#84cc16',
          tag: 'DIADORA',
          title: 'Diadora: estoque +120% pra capturar janela Mercosul-UE',
          detail: 'Mercosul-UE em vigor desde 01/mai/26 com tarifa zero pra calçado brasileiro. Oscar reforçou estoque de Diadora "Made in Italy" pra alavancar margem (18 p.p.) e revender pra Europa via parceria.',
          badge: { label: 'Janela Europa', type: 'ok' },
        },
        {
          color: '#84cc16',
          tag: 'NIKE/OLYMPIKUS',
          title: 'Nike representa 28% do volume — Olympikus 18% — Adidas 12%',
          detail: 'Top 3 fornecedores externos = 58% do volume total. Nike puxa ticket alto, Olympikus alta giro popular e Adidas mix médio. Risco: estoque Nike concentrado em 6 SKUs (Air Max, Air Force, Dunk).',
          badge: { label: '58% top 3', type: 'info' },
        },
      ],
    },
  ],

  juridico: [
    {
      sectionTitle: 'Licença Diadora',
      cards: [
        {
          color: '#f97316',
          tag: 'CONTRATO',
          title: 'Renovação Diadora 2026-2030 em negociação',
          detail: 'Licença exclusiva Diadora no Brasil desde 2022 vence em dez/26. Negociação avançada pra renovação por mais 5 anos com royalty 1,5 p.p. menor. Cláusula de exclusividade Mercosul incluída.',
          badge: { label: 'Negociação', type: 'info' },
        },
        {
          color: '#f97316',
          tag: 'IP',
          title: 'Registro de marcas próprias: Carioca, Gaston, Jô',
          detail: 'Três marcas próprias registradas no INPI. Renovação programada pra 2026-2027. Risco médio: marca "Carioca" tem 3 oposições por terceiros — defesa em andamento via escritório Pinheiro Neto.',
          badge: { label: '3 oposições', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Compliance Pós-Aquisição',
      cards: [
        {
          color: '#f97316',
          tag: 'AQUISIÇÃO',
          title: 'Passivo Paquetá: 142 processos trabalhistas herdados',
          detail: 'Auditoria pós-aquisição 2023 identificou 142 processos trabalhistas ativos. 89 já encerrados (acordo). 53 ainda em curso. Provisão R$ 6,2 mi. Cláusula de earn-out compensa 60% do passivo até dez/26.',
          badge: { label: 'R$ 6,2 mi prov', type: 'warn' },
        },
        {
          color: '#f97316',
          tag: 'CADE',
          title: 'Notificação CADE do crescimento orgânico Sul/Sudeste',
          detail: 'Pós-aquisição Paquetá, Oscar ultrapassou 20% de share em SC e RS. CADE notificado proativamente pra evitar Ato de Concentração formal em futuras aquisições. Status: análise informal.',
          badge: { label: 'Análise CADE', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'LGPD & Consumidor',
      cards: [
        {
          color: '#f97316',
          tag: 'LGPD',
          title: 'DPO interno + adequação concluída em 6 e-commerces',
          detail: 'Adequação LGPD completa nos 6 sites do grupo (oscarcalcados, gaston, paqueta, paqueta-sports, donehead, diadora). 0 incidentes em 18 meses. ANPD: relatório anual em dia.',
          badge: { label: 'OK ANPD', type: 'ok' },
        },
        {
          color: '#f97316',
          tag: 'PROCON',
          title: 'Reclamações Procon SJC: -32% em 6 meses pós-treinamento',
          detail: 'Programa "Atende com Empatia" reduziu reclamações de troca/devolução. Acervo Procon Vale do Paraíba: 42 (vs 62). Recomendação: replicar treinamento nas 63 lojas Paquetá no Sul.',
          badge: { label: '-32% reclamações', type: 'ok' },
        },
      ],
    },
  ],
};
