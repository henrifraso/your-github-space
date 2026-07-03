import type { CompanySectorFeeds } from '../../types';

export const NUBANK_SECTOR_FEEDS: CompanySectorFeeds = {
  marketing: [
    {
      sectionTitle: 'Marca & Reputação',
      cards: [
        {
          color: '#ec4899',
          tag: 'BRAND',
          title: '134 anos no RJ — pesquisa mostra 71% de reconhecimento espontâneo',
          detail: 'Pacheco é a farmácia mais reconhecida espontaneamente pelos cariocas. Estudo Abrafarma/2025 aponta 71% vs 38% do principal concorrente local. NPS regional: 78 (vs média setor 64). Patrimônio de marca de 134 anos é o principal moat regional.',
          badge: { label: '71% awareness', type: 'ok' },
        },
        {
          color: '#ec4899',
          tag: 'CAMPANHA',
          title: 'Campanha "Sua Saúde, Nossa História" reforça presença carioca',
          detail: 'Campanha 360 com Globo + OOH + digital em maio/26. Sentimento positivo de marca subiu 9 p.p. no monitor BrandRadar. Investimento: R$ 18 mi. Reach estimado: 22 mi cariocas/mês.',
          badge: { label: '+9pp sentimento', type: 'ok' },
        },
        {
          color: '#ec4899',
          tag: 'MARCA PRÓPRIA',
          title: 'Ever: visibilidade in-store dobrou após replano-grama',
          detail: 'Replano-grama de 1.600 lojas priorizou marcas próprias Ever (Baby, Care, You, Nutri) em 38% mais espaço de gôndola. Receita de Ever cresceu 30% em 2024. Meta 2026: dobrar share total de marca própria.',
          badge: { label: '+30% Ever', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Fidelidade Bem-Estar',
      cards: [
        {
          color: '#ec4899',
          tag: 'CLUBE',
          title: 'Programa Bem-Estar atinge 7 mi de membros ativos',
          detail: 'Crescimento de 18% em 12 meses. Membros têm ticket médio 32% maior e frequência 2,4x maior que não-membros. Migração para Bem-Estar+ (premium R$ 9,90/mês) em teste em SP — adesão de 11% na base elegível.',
          badge: { label: '7mi membros', type: 'ok' },
        },
        {
          color: '#ec4899',
          tag: 'CRM',
          title: 'CRM personalizado: aumentou conversão de promo em 24%',
          detail: 'Push notifications baseados em histórico de compra elevaram conversão de promo. Crônicos respondem 41% melhor a recall personalizado. Plataforma: Salesforce + Braze. Investimento de retenção: R$ 8,2 mi/ano.',
          badge: { label: '+24% conv', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Performance Digital',
      cards: [
        {
          color: '#ec4899',
          tag: 'APP',
          title: 'App Drogarias Pacheco: 4 mi de downloads e DAU de 380k',
          detail: 'App reformulado em 2025 unificou Pacheco + DSP. DAU subiu 47% YoY. NPS app: 71. Receita digital via app: 8,1% do total. Próximo passo: integração com Bem-Estar e Caixinha de Crônicos.',
          badge: { label: '4mi downloads', type: 'ok' },
        },
        {
          color: '#ec4899',
          tag: 'SEO',
          title: 'Sintomas/medicamentos: SEO ranqueia top-3 em 1.200 termos',
          detail: 'Conteúdo de blog drogariaspacheco.com.br/saude ranqueia top-3 em 1.200 termos farmacêuticos. Tráfego orgânico: 14 mi visitas/mês. Investimento em conteúdo SEO: R$ 3,4 mi/ano.',
          badge: { label: '14mi visitas', type: 'info' },
        },
      ],
    },
  ],

  vendas: [
    {
      sectionTitle: 'Novos Clientes & Ativação',
      cards: [
        {
          color: '#10b981',
          tag: 'GMV',
          title: 'GMV mai/26: R$ 1,42 bi — +14% vs mai/25',
          detail: 'Mês fechado em alta acima da projeção do setor (+10,6%). Categoria dermocosmético puxou ticket. Top 10 lojas no RJ tiveram crescimento +21% YoY. Sell-through de campanhas Dia das Mães: 87%.',
          badge: { label: '+14% YoY', type: 'ok' },
        },
        {
          color: '#10b981',
          tag: 'TICKET',
          title: 'Ticket médio mai/26: R$ 62 — alta de R$ 4 vs mai/25',
          detail: 'Mix de conveniência e dermocosmético eleva ticket. Lojas com programa Bem-Estar Premium: R$ 84 (vs R$ 62 média). Crônicos com assinatura têm ticket R$ 98 e frequência mensal.',
          badge: { label: '+R$4 ticket', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Categorias em Foco',
      cards: [
        {
          color: '#10b981',
          tag: 'DERMOCOSMÉTICO',
          title: 'Dermocosmético: +22% YoY — categoria mais lucrativa',
          detail: 'Receita dermocosmético cresce 22% em 12 meses. Margem bruta 42% (vs 26% medicamento). Marcas líderes: La Roche, Vichy, Eucerin. Pacheco testa corner dermo nas 200 maiores lojas com presença de dermo consultoras.',
          badge: { label: 'Margem 42%', type: 'ok' },
        },
        {
          color: '#10b981',
          tag: 'CRÔNICOS',
          title: 'Crônicos assinatura: 280 mil pacientes ativos',
          detail: 'Programa de recompra automática de medicamentos crônicos atinge 280 mil pacientes. Renovação mensal: 94%. Recomendação: integrar Bem-Estar + Caixinha de Crônicos pra elevar adesão pra 500 mil até dez/26.',
          badge: { label: '94% renov', type: 'ok' },
        },
        {
          color: '#10b981',
          tag: 'CONVENIÊNCIA',
          title: 'Conveniência (hortifrúti+higiene) cresce 19% YoY',
          detail: 'Categoria adicionada em 2024 segue crescendo. Lojas com mix expandido têm ticket R$ 18 maior. Foco H2 26: expandir absorventes/íntimo (segmento liderado pela DPSP).',
          badge: { label: '+19% YoY', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Metas Q2 2026',
      cards: [
        {
          color: '#10b981',
          tag: 'META',
          title: 'Meta Q2 2026: R$ 4,8 bi — pace 93%',
          detail: 'Acumulado até semana 4 de Q2: R$ 1,87 bi. Alavancas: Inverno (gripe/imunidade), Dia dos Namorados, reposição pós-CMED. Risco: ANVISA estuda novas regras de adesão a programas em pacientes crônicos.',
          badge: { label: '93% pace', type: 'info' },
        },
        {
          color: '#10b981',
          tag: 'BUNDLING',
          title: 'Bundle "Anti-Gripe Inverno" eleva ticket 28%',
          detail: 'Combo Anti-Gripe (vitamina C + analgésico + spray nasal) testado em 80 lojas RJ. Aceitação 38% no checkout. Margem 51% (vs 32% itens solo). Ação: ampliar pra 1.600 lojas até 10/jun.',
          badge: { label: '+28% ticket', type: 'ok' },
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
          title: 'Margem bruta consolidada 28% — Ever puxa pra cima',
          detail: 'Marcas próprias Ever rendem 18 p.p. de margem extra vs medicamento comercial. Ever respondeu por 14% do mix e 24% da margem em mai/26. Meta 2026: ampliar Ever pra 20% do mix.',
          badge: { label: '+18pp Ever', type: 'ok' },
        },
        {
          color: '#f59e0b',
          tag: 'CMED',
          title: 'CMED autoriza reajuste de 5,8% — impacto positivo na margem',
          detail: 'Câmara de Regulação aprovou teto de reajuste anual de 5,8% em medicamentos. Compensa 1,2 p.p. na margem bruta do 2T26. Comunicação à indústria já enviada. Repasse em ondas a partir de 01/jul.',
          badge: { label: '+1,2pp margem', type: 'ok' },
        },
        {
          color: '#f59e0b',
          tag: 'CARTÃO/PIX',
          title: 'PIX = 38% do tíquete em loja física',
          detail: 'PIX cresceu 8 p.p. em 12 meses no mix de pagamentos. Margem PIX é melhor: zero taxa de antecipação. Campanha "Compra com PIX, ganha R$ 10 de cashback" rodando em SP em jun/26.',
          badge: { label: '38% PIX', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Resultado Grupo DPSP',
      cards: [
        {
          color: '#f59e0b',
          tag: 'EBITDA',
          title: 'EBITDA 1T26: R$ 412 mi — +18% YoY',
          detail: 'Sinergia operacional Pacheco+DSP rende R$ 32 mi/ano em overhead reduzido. CD compartilhado (7 ao todo) corta frete em 14%. Margem operacional 9,1% (vs 8,2% no 1T25).',
          badge: { label: '+18% YoY', type: 'ok' },
        },
        {
          color: '#f59e0b',
          tag: 'CAPEX',
          title: 'CAPEX expansão: R$ 1,2 bi pra 400 lojas até 2028',
          detail: 'Plano de expansão aprovado prevê 400 novas lojas, com CAPEX médio de R$ 3 mi/loja. Foco: Grande SP (180), interior SP (110), MG/ES (70), Nordeste novo (40). ROI projetado: 22 meses por loja.',
          badge: { label: 'R$ 1,2 bi', type: 'info' },
        },
      ],
    },
  ],

  rh: [
    {
      sectionTitle: 'Equipe Grupo DPSP',
      cards: [
        {
          color: '#8b5cf6',
          tag: 'HEADCOUNT',
          title: '29.600 colaboradores no grupo — 12.000 só na Pacheco',
          detail: 'Grupo DPSP atinge 29.600 colaboradores. Pacheco isolada tem 12.000. Turnover varejo farma: 32%/ano. Custo de substituição R$ 5.800/colaborador. Programa "Carreira Pacheco" cria trilha de balconista a gerente em 24 meses.',
          badge: { label: 'Turnover 32%', type: 'warn' },
        },
        {
          color: '#8b5cf6',
          tag: 'CONTRATAÇÃO',
          title: '420 vagas abertas para expansão Q2 26',
          detail: 'Prioridade: 180 atendentes RJ/SP, 120 farmacêuticos, 80 gerentes de loja, 40 backoffice. Tempo médio de hiring: 24 dias (meta 18). Parceria com CRF-RJ pra acelerar credenciamento de farmacêuticos.',
          badge: { label: '420 vagas', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Cultura & Desenvolvimento',
      cards: [
        {
          color: '#8b5cf6',
          tag: 'CULTURA',
          title: 'Pesquisa de clima 2026: eNPS 64 — alta de 6pts vs 2025',
          detail: 'Programa "Você é Pacheco" elevou engajamento. Principais ganhos: clareza de carreira (78%) e orgulho de marca (89%). Gap: salário (54%). Ação: revisão de remuneração variável atrelada a NPS de loja em jul/26.',
          badge: { label: 'eNPS 64', type: 'ok' },
        },
        {
          color: '#8b5cf6',
          tag: 'ACADEMY',
          title: 'Pacheco Academy: 6.200 horas de treinamento em Q1 2026',
          detail: 'Foco em atendimento humanizado + storytelling Ever. 91% de conclusão do módulo "Cuide do Seu Cliente". Certificação obrigatória pra promoção a balconista sênior desde jan/26. Próximo módulo: "Vendas Dermo".',
          badge: { label: '91% conclusão', type: 'ok' },
        },
        {
          color: '#8b5cf6',
          tag: 'D&I',
          title: 'Mulheres em liderança: 47% — meta 55% até 2028',
          detail: 'Pacheco está acima da média do setor varejo farma (38%). Mentoria estruturada com 80 mulheres em pipeline. Foco H2 26: ampliar acesso a cargo de gerência regional. Bandeira DSP tem 52% de gerentes mulheres.',
          badge: { label: '47% liderança', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Atendimento Farmacêutico',
      cards: [
        {
          color: '#8b5cf6',
          tag: 'CRF',
          title: '4.800 farmacêuticos ativos — TMA de 4 min no balcão',
          detail: 'Time farmacêutico totalmente credenciado pelo CRF. TMA balcão 4 min (benchmark setor 7). Ferramenta de IA "Pacheco AI" sugere medicamentos similares e interações — reduziu erro de orientação em 38%.',
          badge: { label: 'TMA 4min', type: 'ok' },
        },
      ],
    },
  ],

  operacoes: [
    {
      sectionTitle: 'Rede de 1.600 Lojas',
      cards: [
        {
          color: '#06b6d4',
          tag: 'FLAGSHIP RJ',
          title: 'Loja Pacheco Av. Marechal Floriano: 8.200 visitas/dia',
          detail: 'Loja histórica no Centro do Rio (Rua dos Andradas/Av. Marechal Floriano) — maior em movimento da rede. Faturamento R$ 3,8 mi/mês. Mix completo: medicamento, dermo, conveniência, manipulação.',
          badge: { label: 'Top 1 RJ', type: 'ok' },
        },
        {
          color: '#06b6d4',
          tag: 'EXPANSÃO',
          title: 'Plano 2026: abrir 150 lojas (95 Grande SP + 35 interior + 20 NE)',
          detail: 'CAPEX médio R$ 3 mi/loja. Parte do plano 400 lojas até 2028. Foco: shoppings premium + ruas de alto fluxo. Estratégia "encostar na RD Saúde em SP" segundo Neofeed.',
          badge: { label: '+150 lojas', type: 'info' },
        },
        {
          color: '#06b6d4',
          tag: 'VISUAL MERCH',
          title: 'Replano-grama Inverno 26 finalizado em 94% das lojas',
          detail: 'Replano focado em vitamina C, anti-gripal e dermocosmético de inverno. 6% restantes em RS pós-chuvas. Kit unificado garantiu consistência visual. Próximo: Black Friday novembro.',
          badge: { label: '1.504/1.600', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Logística & Same-day',
      cards: [
        {
          color: '#06b6d4',
          tag: 'CDS',
          title: '7 centros de distribuição ativos — RJ, SP, MG, PE, BA',
          detail: 'Sete CDs operam pra 1.600 lojas. CD principal RJ (Rod. Pres. Dutra, 56.000 m²) processa 280 mil itens/dia. CDs Recife e Salvador suportam expansão NE. Investimento de R$ 180 mi em modernização 2025-26.',
          badge: { label: '7 CDs', type: 'info' },
        },
        {
          color: '#06b6d4',
          tag: 'SAME-DAY',
          title: 'Same-day delivery Loggi: 90% de cobertura no RJ',
          detail: 'Parceria com Loggi entrega em 2h em casos urgentes. NPS digital: 76. Vendas digitais 12% do total. Expansão pra Grande SP em jul/26 e BH em set/26. Meta cobertura SP: 50% em dez/26.',
          badge: { label: '90% RJ', type: 'ok' },
        },
      ],
    },
  ],

  estoque: [
    {
      sectionTitle: 'Mix de Medicamentos',
      cards: [
        {
          color: '#84cc16',
          tag: 'GIRO',
          title: 'Giro de estoque crônicos: 28 dias — ideal pra programa de assinatura',
          detail: 'Categoria crônicos tem giro 4x mais rápido que medicamento comum. Programa de assinatura "Crônicos Fácil" eleva previsibilidade de demanda em 87%. Recomendação: ampliar programa de 280 pra 500 mil pacientes em H2 26.',
          badge: { label: '28 dias giro', type: 'ok' },
        },
        {
          color: '#84cc16',
          tag: 'RUPTURA',
          title: 'Ruptura semanal: 1,4% — meta 1,2%',
          detail: 'Ruptura concentrada em medicamentos hospitalares (3,8%) e raros (8,1%). Sistema de previsão Vtex+SAP reduziu ruptura geral em 0,6 p.p. em 6 meses. Ação: integrar previsão com dados de gripe sazonal pra Inverno 26.',
          badge: { label: '1,4% ruptura', type: 'warn' },
        },
        {
          color: '#84cc16',
          tag: 'DEAD STOCK',
          title: 'Dead stock dermatológico Verão 25: R$ 4,2 mi em RJ/SP',
          detail: 'Protetores solares e protetores capilares Verão 25 encalhados nas lojas RJ. Custo de oportunidade R$ 4,2 mi. Outlet ativo com -40% até jun/26. Recomendação: revisar planejamento de SKUs sazonais.',
          badge: { label: 'R$ 4,2 mi', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Marcas Próprias Ever',
      cards: [
        {
          color: '#84cc16',
          tag: 'EVER',
          title: 'Ever: 800 SKUs ativos — 100 novos lançamentos em 2025-26',
          detail: 'Linhas Ever Baby, Ever Care, Ever You, Ever Nutri respondem por 14% do faturamento e 24% da margem. 100 novos SKUs previstos pra H2 26 (suplementos + dermo). Margem 18 p.p. acima das marcas comerciais.',
          badge: { label: '800 SKUs', type: 'ok' },
        },
        {
          color: '#84cc16',
          tag: 'FORNECIMENTO',
          title: 'EMS (28%) + Eurofarma + Hypera = 58% do volume',
          detail: 'Top 3 fornecedores externos = 58% do volume total. EMS puxa volume de genéricos populares (28%). Risco: dependência alta em EMS, mas margens superiores em marcas próprias compensam o risco de barganha.',
          badge: { label: '58% top 3', type: 'info' },
        },
      ],
    },
  ],

  juridico: [
    {
      sectionTitle: 'ANVISA & Compliance',
      cards: [
        {
          color: '#f97316',
          tag: 'ANVISA',
          title: 'RDC 44/2009 e renovação de licenças: 1.600 lojas em compliance',
          detail: 'Todas as 1.600 lojas com Autorização de Funcionamento (AFE) renovada. Auditoria ANVISA Q1 26 sem ressalvas. Compliance farmacêutico responsável (RT) garantido em todas as unidades.',
          badge: { label: '100% AFE', type: 'ok' },
        },
        {
          color: '#f97316',
          tag: 'CMED',
          title: 'CMED reajuste 5,8%: comunicação pra 32 fornecedores',
          detail: 'Comunicação formal enviada a 32 fornecedores principais sobre reajuste autorizado. Cronograma de repasse em ondas — crônicos primeiro (01/jul), depois OTC e MIPs. Compliance fiscal validado pelo PwC.',
          badge: { label: 'OK', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Marcas Próprias & IP',
      cards: [
        {
          color: '#f97316',
          tag: 'IP',
          title: 'Registros Ever: 800 SKUs com proteção marcária no INPI',
          detail: 'Todas as 4 linhas Ever (Baby, Care, You, Nutri) com marca registrada. 12 oposições por terceiros — defesa em andamento via escritório Pinheiro Neto. Renovação programada pra 2027-2028.',
          badge: { label: '12 oposições', type: 'warn' },
        },
        {
          color: '#f97316',
          tag: 'CONTRATOS',
          title: 'Renovação contratos fornecedores estratégicos em 1T/2T 26',
          detail: 'EMS, Eurofarma e Hypera em renegociação. Cláusulas em revisão: ANS sazonalidade, escala de descontos, exclusividade em marcas próprias. Time jurídico do grupo DPSP centralizou todos os contratos pós-fusão.',
          badge: { label: 'Em curso', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'LGPD & Consumidor',
      cards: [
        {
          color: '#f97316',
          tag: 'LGPD',
          title: 'DPO ativo + ANPD: 0 incidentes em 18 meses',
          detail: 'Adequação LGPD completa em app + site + 1.600 lojas. Auditoria PwC anual sem ressalvas. Sistema de consentimento integrado ao Bem-Estar pra ofertas personalizadas com base legal sólida.',
          badge: { label: 'OK ANPD', type: 'ok' },
        },
        {
          color: '#f97316',
          tag: 'PROCON',
          title: 'Reclamações Procon RJ: -28% em 12 meses pós-treinamento',
          detail: 'Programa "Atende com Empatia" reduziu reclamações em RJ. Acervo Procon-RJ: 87 (vs 121). Recomendação: replicar treinamento em SP onde acervo é 142.',
          badge: { label: '-28% RJ', type: 'ok' },
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
