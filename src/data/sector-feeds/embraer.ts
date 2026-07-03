import type { CompanySectorFeeds } from '../../types';

export const EMBRAER_SECTOR_FEEDS: CompanySectorFeeds = {

  marketing: [
    {
      sectionTitle: "O que mudou em Marketing",
      cards: [
        {
          color: "#ec4899",
          tag: "E2",
          title: "Campanha E195-E2: 25% menos combustível vs concorrentes",
          detail: "Campanha global 'Efficiency Redefined' ativa em 14 países. Foco em companhias regionais europeias (Lufthansa CityLine, Air France HOP). Pipeline de 28 prospects qualificados — 6 em fase final de proposta.",
          badge: { label: "ATIVA", type: "ok" },
        },
        {
          color: "#ec4899",
          tag: "eVTOL",
          title: "Eve eVTOL: carteira de US$14bi — maior do setor",
          detail: "180 acordos de pré-compra com operadores de mobilidade aérea urbana em 25 países. Certificação FAA prevista para 2026. Campanha de posicionamento como líder em Urban Air Mobility em fase de mídia especializada.",
          badge: { label: "US$14BI", type: "ok" },
        },
        {
          color: "#ec4899",
          tag: "Defesa",
          title: "KC-390 Millennium: campanha de exportação para 6 países",
          detail: "Após venda para Países Baixos, Áustria e Hungria, Embraer intensifica campanha para Chile, Índia, Coreia do Sul, Indonésia e Austrália. Participação no DSEI (Londres, set/26) confirmada.",
          badge: { label: "ATIVA", type: "ok" },
        },
      ],
    },
    {
      sectionTitle: "Posicionamento vs Concorrentes",
      cards: [
        {
          color: "#ec4899",
          tag: "Bombardier",
          title: "Global 7500 vs Praetor 600: material comparativo em atualização",
          detail: "Bombardier lançou nova campanha atacando autonomia de voo do segmento executivo. Embraer prepara resposta com dados de TCO (Total Cost of Ownership) — Praetor 600 tem custo 18% menor em 5 anos.",
        },
        {
          color: "#ec4899",
          tag: "COMAC",
          title: "C919 entra na Ásia — contenção de narrativa necessária",
          detail: "COMAC C919 certificado pela CAAC, sendo operado pela Air China. Campanha de desinformação técnica em mercados asiáticos compara o C919 ao E195-E2. Área de comunicação preparando fact-sheets técnicos para imprensa especializada.",
          badge: { label: "MONITORAR", type: "warn" },
        },
      ],
    },
    {
      sectionTitle: "Eventos e Feiras",
      cards: [
        {
          color: "#ec4899",
          tag: "Paris Air Show",
          title: "Paris Air Show 2027: planejamento de estande iniciado",
          detail: "Maior vitrine do setor aeronáutico — edição anterior gerou US$4.2bi em anúncios de pedidos para Embraer. Briefing criativo para estande E2 + KC-390 previsto para Q3/26. Budget de US$8mi aprovado.",
          badge: { label: "PLANEJAMENTO", type: "info" },
        },
        {
          color: "#ec4899",
          tag: "NBAA",
          title: "NBAA-BACE out/26: foco em jatos executivos Phenom e Praetor",
          detail: "Principal evento de aviação executiva dos EUA. Embraer lidera market share de jatos leves com Phenom 300E. Novo configurador digital 3D do Praetor 600 será lançado no evento.",
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
          tag: "Backlog",
          title: "Backlog consolidado: US$21.1bi — equivalente a 7 anos de receita",
          detail: "Aviação comercial: US$14.2bi | Executiva: US$3.8bi | Defesa/Segurança: US$3.1bi. Maior backlog da história da empresa. Risco: atraso de motores GE pode comprometer conversão de US$1.2bi no H2.",
          badge: { label: "RECORDE", type: "ok" },
        },
        {
          color: "#10b981",
          tag: "Entregas Q1",
          title: "Q1/26: 48 aeronaves entregues (meta 52) — déficit por GE",
          detail: "Déficit de 4 aeronaves causado por atraso de entrega de motores LEAP-1E pela GE Aviation (60-90 dias de atraso). Aeronaves prontas aguardam motor no hangar de Gavião Peixoto. Impacto financeiro estimado: US$280-320mi em receita deslocada para Q2/Q3.",
          badge: { label: "DÉFICIT", type: "warn" },
        },
        {
          color: "#10b981",
          tag: "Aftermarket",
          title: "MRO e peças: US$1.1bi em receita no último ano — 26% do total",
          detail: "Contratos de suporte Power by the Hour (PBH) crescem 14% a.a. 12 AOG pools globais garantem AOG support <24h. Pipeline de novos contratos de MRO multi-year no valor de US$680mi em negociação.",
          badge: { label: "+14% a.a.", type: "ok" },
        },
      ],
    },
    {
      sectionTitle: "Pipeline e Novos Negócios",
      cards: [
        {
          color: "#10b981",
          tag: "Pipeline",
          title: "Pipeline comercial: 140 aeronaves em negociação avançada",
          detail: "E175-E2: 62 aeronaves para 3 companhias americanas (certificação FAA pendente). E195-E2: 44 aeronaves para mercado europeu e asiático. KC-390: 6 aeronaves para 2 países (Índia e Chile em fase LOI).",
        },
        {
          color: "#10b981",
          tag: "ATR",
          title: "Segmento de turbohélices: vacância após saída do ATR-42",
          detail: "ATR enfrenta problemas de entrega e perdeu 2 contratos para companhias regionais africanas. Embraer estuda reintrodução de versão turbohélice do E175 para ilhas e rotas de baixa densidade — decisão em Q4.",
          badge: { label: "OPORTUNIDADE", type: "info" },
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
          tag: "Receita",
          title: "Receita Q1: US$1.34bi — impacto de US$300mi por atraso GE",
          detail: "Receita abaixo do guidance de US$1.62bi devido a 4 aeronaves não entregues. Revenue recognition apenas na entrega ao cliente. Gestão financeira reafirma guidance anual — receita será realizada em Q2/Q3.",
          badge: { label: "ABAIXO GUIDANCE", type: "warn" },
        },
        {
          color: "#f59e0b",
          tag: "Hedge",
          title: "Hedge cambial BRL/USD: posição de US$2.1bi para 2026",
          detail: "98% da receita em dólar; 60% dos custos em reais. Hedge garantido até dez/26 a taxa média de R$5.48. Cenário atual (R$5.71) gera ganho de BRL 480mi no resultado não operacional.",
          badge: { label: "PROTEGIDO", type: "ok" },
        },
      ],
    },
    {
      sectionTitle: "Riscos e Provisões",
      cards: [
        {
          color: "#f59e0b",
          tag: "GE",
          title: "Cláusula de penalidade GE: notificação formal enviada em 02/05",
          detail: "Contrato de fornecimento prevê penalidade de US$12.000/dia por atraso acima de 30 dias. Embraer acionou cláusula referente a 28 motores em atraso — crédito estimado de US$18-24mi. GE contesta força maior.",
          badge: { label: "DISPUTA", type: "warn" },
        },
        {
          color: "#f59e0b",
          tag: "MRO",
          title: "MRO representa 26% da receita — meta de 30% até 2028",
          detail: "Receita de serviços é mais estável e margeada que venda de aeronaves. Expansão dos Embraer Services Centers em Dallas, Évora e Singapura prevista para 2027 com investimento de US$320mi.",
          badge: { label: "CRESCIMENTO", type: "info" },
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
          title: "Contratação de 420 engenheiros aeronáuticos até dez/26",
          detail: "Expansão das linhas E2 e KC-390 exige reforço de engenharia. Parceria com ITA e USP para contratação de recém-formados. 180 vagas para desenvolvimento da Eve eVTOL em São José dos Campos.",
          badge: { label: "URGENTE", type: "warn" },
        },
        {
          color: "#8b5cf6",
          tag: "Certificação",
          title: "Pilotos de teste: 3 vagas abertas — certificação FAA obrigatória",
          detail: "Processo seletivo exige mínimo 3.000h de voo e certificação FAA/ANAC como piloto experimental. Pool global escasso — Embraer compete com Boeing, Bombardier e Textron. Prazo de fechamento: 90 dias.",
          badge: { label: "ESCASSEZ", type: "warn" },
        },
        {
          color: "#8b5cf6",
          tag: "Retenção",
          title: "Turnover de engenheiros seniores: 8.2% a.a. (meta <6%)",
          detail: "Principal destino: startups de eVTOL (Eve, Joby, Archer). Programa de retenção revisado inclui equity vinculado ao IPO da Eve Urban Air Mobility (NYSE: EVEX). Custo adicional: US$28mi/ano.",
          badge: { label: "FORA META", type: "warn" },
        },
      ],
    },
    {
      sectionTitle: "Capacitação Técnica",
      cards: [
        {
          color: "#8b5cf6",
          tag: "Técnicos MRO",
          title: "Programa de técnicos de manutenção: 800 certificações ANAC em 2026",
          detail: "Expansão da rede de MRO autorizada requer técnicos certificados localmente. Parceria com SENAI para programa de 18 meses em manutenção aeronáutica. 1ª turma de 120 técnicos inicia em junho.",
        },
        {
          color: "#8b5cf6",
          tag: "Diversidade",
          title: "Programa Voe Mulher: 35% de mulheres em engenharia até 2028",
          detail: "Atual: 22% de mulheres em posições de engenharia. Parceria com universidades para bolsas em engenharia aeronáutica. 180 bolsistas ativas em 2026 — pipeline para contratação futura.",
          badge: { label: "22% → 35%", type: "info" },
        },
        {
          color: "#8b5cf6",
          tag: "Expatriados",
          title: "80 engenheiros em missão internacional — revisão de política",
          detail: "Engenheiros em Melbourne (Eve), Fort Lauderdale (Embraer EXJ) e Melbourne (certificação FAA). Política de expatriação desatualizada desde 2018 — revisão para alinhar com mercado prevista para Q3.",
        },
      ],
    },
    {
      sectionTitle: "Relações de Trabalho",
      cards: [
        {
          color: "#8b5cf6",
          tag: "Sindicato",
          title: "SINDAER: negociação de PLR encerrada com acordo de 4.2x salário",
          detail: "Acordo de PLR 2025 fechado em abril/26 com pagamento de 4.2x salário base para funcionários com atingimento de meta de entregas. Total distribuído: R$420mi. Greve evitada.",
          badge: { label: "FECHADO", type: "ok" },
        },
        {
          color: "#8b5cf6",
          tag: "Saúde",
          title: "Programa de saúde mental: 3.200 atendimentos em Q1",
          detail: "Pressão de entregas e atraso GE geraram aumento de 28% nos pedidos de afastamento por saúde mental em Q1. Expansão do programa de psicólogos internos: de 8 para 14 profissionais até junho.",
          badge: { label: "ATENÇÃO", type: "warn" },
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
          tag: "Linha de Montagem",
          title: "Gavião Peixoto: 6 aeronaves na linha de montagem final aguardando motor",
          detail: "E195-E2 (4 unidades) e E190-E2 (2 unidades) com montagem 100% completa exceto instalação de motores LEAP-1E. Custo de hangar por aeronave parada: US$18.000/mês. Total: US$108.000/mês em custos improdutivos.",
          badge: { label: "BLOQUEADO", type: "warn" },
        },
        {
          color: "#06b6d4",
          tag: "AOG Support",
          title: "AOG response <24h: 98.3% de conformidade nos últimos 90 dias",
          detail: "12 AOG pools globais com peças rotables garantem atendimento de Aircraft on Ground em qualquer localização. Resposta média: 14.2h. Apenas 2 eventos acima de 24h em Q1 (ambos em rotas remotas da Oceania).",
          badge: { label: "98.3%", type: "ok" },
        },
        {
          color: "#06b6d4",
          tag: "Certificação",
          title: "FAA: processo de certificação E175-E2 para mercado americano",
          detail: "E175-E2 aguarda certificação FAA desde 2022 — impasse regulatório sobre definição de categoria do avião. Reunião com FAA prevista para jun/26. Se resolvido, abre mercado de 60+ aeronaves em contratos já pré-acordados com regionais americanas.",
          badge: { label: "PENDENTE", type: "warn" },
        },
      ],
    },
    {
      sectionTitle: "Qualidade e Segurança",
      cards: [
        {
          color: "#06b6d4",
          tag: "ANAC",
          title: "ANAC: auditoria de linha de montagem programada para jul/26",
          detail: "Auditoria de rotina cobre processos de controle de qualidade na linha do E2 e KC-390. Último relatório (2024) resultou em 3 NCRs menores — todas encerradas. Preparação interna iniciada.",
          badge: { label: "PROGRAMADA", type: "info" },
        },
        {
          color: "#06b6d4",
          tag: "EASA",
          title: "Praetor 600: certificação EASA para operação em espaço aéreo europeu expandida",
          detail: "Aprovação de ETOPS-180 pelo EASA para o Praetor 600 habilitou rotas transatlânticas. 14 aeronaves europeias já operando sob nova certificação. Abre mercado de US$800mi em vendas adicionais para operadores de charter europeus.",
          badge: { label: "APROVADO", type: "ok" },
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
          tag: "Motores GE",
          title: "Motores LEAP-1E: 28 unidades em atraso — lead time de 18 meses",
          detail: "GE Aviation reportou gargalo de fornecimento de superligas em fundições no Japão. Embraer tem apenas 4 motores em estoque de contingência (2 semanas de produção). Alternativa de fornecimento via Pratt & Whitney descartada por incompatibilidade técnica.",
          badge: { label: "CRÍTICO", type: "warn" },
        },
        {
          color: "#84cc16",
          tag: "Aviônica",
          title: "Collins Aerospace: estoque de aviônica para 6 meses de produção",
          detail: "Sistemas de gerenciamento de voo (FMS) e displays de cockpit com estoque adequado. Collins confirmou capacidade de entrega para 2026 inteiro. Único risco: chip FPGA específico com lead time de 9 meses — 1.200 unidades em trânsito.",
          badge: { label: "OK", type: "ok" },
        },
        {
          color: "#84cc16",
          tag: "MRO Rotables",
          title: "Rotables em 12 AOG pools: US$280mi em valor de inventário",
          detail: "Componentes rotativos de alto valor (turbinas, atuadores, trens de pouso) pré-posicionados globalmente. Taxa de utilização de rotables: 68% — meta de 75% para otimizar capital imobilizado. Projeto de otimização com ML em andamento.",
        },
      ],
    },
    {
      sectionTitle: "Gestão de Fornecedores",
      cards: [
        {
          color: "#84cc16",
          tag: "Liebherr",
          title: "Liebherr: sistemas de trem de pouso sem restrições para 2026",
          detail: "Fornecimento de trens de pouso do E2 e Phenom garantido até Q4/26. Liebherr investiu em nova linha de usinagem em Lindenberg — capacidade +30%. Contrato de longo prazo (2027-2032) em negociação final.",
          badge: { label: "GARANTIDO", type: "ok" },
        },
        {
          color: "#84cc16",
          tag: "Pratt & Whitney",
          title: "P&W GTF: recall de discos HPT afeta 400 aeronaves globais — impacto indireto",
          detail: "Recall de discos de turbina de alta pressão do GTF (usado em A220, não em E2) gerou escassez de capacidade MRO de P&W. Técnicos de MRO Embraer sendo solicitados por companhias aéreas — oportunidade de receita adicional de US$40-60mi.",
          badge: { label: "OPORTUNIDADE", type: "info" },
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
          tag: "FAA",
          title: "E175-E2: impasse FAA sobre classificação de aeronave — 4 anos em análise",
          detail: "Disputa regulatória sobre se E175-E2 se enquadra como 'regional jet' sob acordos de scope clause. Embraer contratou escritório de lobismo em Washington (orçamento US$4.2mi/ano). Nova proposta de certificação baseada em peso máximo apresentada em mar/26.",
          badge: { label: "CRÍTICO", type: "warn" },
        },
        {
          color: "#f97316",
          tag: "Defesa",
          title: "Contratos KC-390: acordos de offset com Países Baixos e Áustria",
          detail: "Acordos de offset obrigam Embraer a gerar US$1.2bi em benefícios industriais nos países compradores em 10 anos. Subcontratos com DAF (NL) e FACC (AT) já somam US$380mi. Relatório anual de offset vence em agosto.",
          badge: { label: "EM DIA", type: "ok" },
        },
      ],
    },
    {
      sectionTitle: "Propriedade Intelectual e Compliance",
      cards: [
        {
          color: "#f97316",
          tag: "Patentes",
          title: "52 novos pedidos de patente em 2026 — foco em eVTOL e sistemas fly-by-wire",
          detail: "Embraer detém 4.200 patentes ativas. Área de PI reforçada para proteger propriedade intelectual da Eve frente a concorrentes Joby e Archer (ambas com IPO na NYSE). Três ações de violação de patente em análise contra fabricantes chineses.",
          badge: { label: "52 PEDIDOS", type: "info" },
        },
        {
          color: "#f97316",
          tag: "Anticorrupção",
          title: "Programa de compliance pós-DPA: 5º ano de monitoramento DOJ",
          detail: "Deferred Prosecution Agreement com DOJ em vigor até 2027. Monitor independente realiza auditoria semestral. Última auditoria (Q4/25): zero achados críticos. Programa de treinamento obrigatório de ética: 100% de conclusão em toda empresa.",
          badge: { label: "CONFORME", type: "ok" },
        },
        {
          color: "#f97316",
          tag: "ANAC",
          title: "Certificação tipo: 3 produtos aguardando aprovação ANAC",
          detail: "Eve eVTOL (certificação tipo nova categoria), modificação do KC-390 para tanque adicional e sistema ADS-B da série E aguardam aprovação da ANAC. Prazo médio de análise: 18-24 meses após submissão completa.",
          badge: { label: "AGUARDANDO", type: "info" },
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
