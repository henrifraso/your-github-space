import type { CompanySectorFeeds } from '../../types';

export const NUBANK_SECTOR_FEEDS: CompanySectorFeeds = {
  marketing: [
    {
      sectionTitle: 'Aquisição & Indicação',
      cards: [
        {
          color: '#ec4899',
          tag: 'INDICAÇÃO',
          title: 'Programa de indicação responde por 38% das novas contas abertas',
          detail: 'Em abril/26, 1,4 mi de novas contas foram abertas no Brasil — 532 mil via link de indicação. CAC médio por indicação: R$ 8,20 vs R$ 74 em mídia paga. Programa sem alterações desde Q3/25.',
          badge: { label: 'CAC R$8,20', type: 'ok' },
        },
        {
          color: '#ec4899',
          tag: 'VIRAL',
          title: 'Campanha "O banco que não te odeia" — 94 mi de impressões orgânicas',
          detail: 'Série de conteúdos no TikTok e Instagram comparando experiências bancárias gerou 94 mi de impressões sem impulsionamento. Sentimento positivo: 78% nas menções monitoradas pelo Sprinklr.',
          badge: { label: '94mi impressões', type: 'ok' },
        },
        {
          color: '#ec4899',
          tag: 'NPS',
          title: 'NPS de marca: 83 — maior no setor financeiro BR pelo 4º ano consecutivo',
          detail: 'Pesquisa Bain/Nubank Q1/26 confirma NPS 83 entre clientes ativos. Itaú íon aparece em 2º lugar com NPS 61. Principais drivers: atendimento sem fila, transparência de tarifas e app intuitivo.',
          badge: { label: 'NPS 83', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Ultravioleta & Premium',
      cards: [
        {
          color: '#ec4899',
          tag: 'ULTRAVIOLETA',
          title: 'Base Ultravioleta atinge 4,2 mi de clientes — crescimento de 31% YoY',
          detail: 'Cartão Nubank Ultravioleta (Infinite Mastercard) tem fee de R$ 49/mês com cashback de 1%. Receita de anuidade: R$ 206 mi/ano. Churn de 2,8%/mês — abaixo do break-even de retenção em 4,1%.',
          badge: { label: '4,2mi clientes', type: 'ok' },
        },
        {
          color: '#ec4899',
          tag: 'POSICIONAMENTO',
          title: 'Campanha Ultravioleta Q2: foco em viagem — parceria com Latam Pass',
          detail: 'Co-marketing com Latam Pass promove conversão de cashback Ultravioleta em milhas. Budget da campanha: R$ 4,8 mi para Q2/26. Teste A/B em andamento: landing pages com foco em viagem vs liberdade financeira.',
          badge: { label: 'Em produção', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Performance de Mídia',
      cards: [
        {
          color: '#ec4899',
          tag: 'MÍDIA PAGA',
          title: 'CPL de mídia paga sobe para R$ 74 — pressão de Mercado Pago e C6',
          detail: 'Custo por lead em Google e Meta subiu 22% no Q1/26 vs Q1/25. Concorrentes Mercado Pago e C6 aumentaram budget em 40% no período. Revisão de mix de canais proposta: maior peso em CTV e YouTube bumper.',
          badge: { label: 'CPL R$74', type: 'warn' },
        },
        {
          color: '#ec4899',
          tag: 'CONTEÚDO',
          title: 'Creators Nubank: 120 criadores ativos no programa embaixadores',
          detail: 'Programa "NuCreators" remunera criadores por abertura de conta via link rastreado. Taxa de conversão média: 3,1%. Custo por conta: R$ 18. Expansão para criadores de finanças pessoais planejada para mai/26.',
          badge: { label: '120 criadores', type: 'info' },
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
          tag: 'AQUISIÇÃO',
          title: '1,4 mi de novas contas em abril/26 — meta mensal era 1,2 mi',
          detail: 'Superação de meta em 17% impulsionada por campanha de indicação + lançamento da conta MEI no app. Base total Brasil: 98,3 mi de clientes ativos. Meta 2026: atingir 110 mi.',
          badge: { label: '+17% vs meta', type: 'ok' },
        },
        {
          color: '#10b981',
          tag: 'ATIVAÇÃO',
          title: 'Taxa de ativação de cartão: 61% nos primeiros 30 dias',
          detail: 'Do total de cartões aprovados, 61% realizam primeira transação em 30 dias. Meta: 68%. Gap concentrado em clientes score 300-450 que recebem limite inicial de R$ 50-200. Ação: onboarding push com incentivo de cashback na primeira compra.',
          badge: { label: '61% ativação', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Cross-sell & Produtos',
      cards: [
        {
          color: '#10b981',
          tag: 'CROSS-SELL',
          title: 'Penetração de investimentos: 31% da base — meta 40% até dez/26',
          detail: 'NuInvest tem 30,5 mi de clientes. Produtos mais adotados: CDB Nubank (88% dos investidores) e Tesouro Direto (12%). Clientes com 2+ produtos têm churn 6x menor. Pipeline de produto: fundo imobiliário em beta.',
          badge: { label: '31% penetração', type: 'info' },
        },
        {
          color: '#10b981',
          tag: 'EMPRÉSTIMO',
          title: 'NuCrédito: R$ 18,4 bi em carteira ativa — crescimento de 28% YoY',
          detail: 'Portfólio de crédito pessoal e crédito consignado cresceu 28% em 12 meses. Ticket médio de empréstimo pessoal: R$ 4.200. Taxa média de juros: 3,9%/mês vs 7,1%/mês da média dos bancões.',
          badge: { label: '+28% YoY', type: 'ok' },
        },
        {
          color: '#10b981',
          tag: 'MEI',
          title: 'Conta MEI lançada em mar/26 — 280 mil aberturas em 45 dias',
          detail: 'Produto direcionado a microempreendedores inclui conta PJ gratuita, maquininha integrada e crédito MEI. 280 mil contas abertas nos primeiros 45 dias. Referral de conta PF para MEI representa 43% das aberturas.',
          badge: { label: '280k contas', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Concorrência & Retenção',
      cards: [
        {
          color: '#10b981',
          tag: 'CHURN',
          title: 'Churn mensal: 1,2% — Mercado Pago aumenta pressão com rendimento 110% CDI',
          detail: 'Mercado Pago passou a oferecer rendimento de 110% CDI no saldo da conta em jan/26. Nubank mantém 100% CDI. Impacto de churn estimado: +0,3pp. Produto de conta remunerada premium em avaliação pelo time de produto.',
          badge: { label: 'Pressão MP', type: 'warn' },
        },
        {
          color: '#10b981',
          tag: 'RETENÇÃO',
          title: 'Clientes com 3+ produtos têm NPS 91 e churn 0,4% — foco em bundling',
          detail: 'Análise de coorte mostra forte correlação entre adoção de múltiplos produtos e LTV elevado. Cliente com cartão + investimentos + empréstimo gera receita 6,8x maior que cliente mono-produto. Programa NuBundles sendo prototipado.',
          badge: { label: 'LTV 6,8x', type: 'ok' },
        },
      ],
    },
  ],

  financeiro: [
    {
      sectionTitle: 'Crédito & Inadimplência',
      cards: [
        {
          color: '#f59e0b',
          tag: 'INADIMPLÊNCIA',
          title: 'NPL 90+ dias: 2,1% da carteira — abaixo do setor (4,8% Febraban)',
          detail: 'Inadimplência acima de 90 dias em 2,1% — melhor que a média dos 5 maiores bancos. Modelos de machine learning para concessão de crédito revisados em fev/26 reduziram NPL em 0,3pp. Provisão de crédito: R$ 2,8 bi.',
          badge: { label: 'NPL 2,1%', type: 'ok' },
        },
        {
          color: '#f59e0b',
          tag: 'PROVISÃO',
          title: 'Provisão para devedores duvidosos: R$ 2,8 bi — cobertura de 133%',
          detail: 'Índice de cobertura (provisão / NPL) em 133% — confortável ante o mínimo regulatório de 100%. Revisão trimestral de modelos de precificação de risco considera score Serasa + comportamento interno.',
          badge: { label: 'Cobertura 133%', type: 'ok' },
        },
        {
          color: '#f59e0b',
          tag: 'FUNDING',
          title: 'Custo de funding sobe para CDI + 0,8% após alta do Copom',
          detail: 'Selic a 13,75% eleva custo de captação via CDB e LCI. Spread de crédito comprimido em 1,2pp no Q1/26. Estratégia de funding diversificado: 38% CDB, 28% poupança, 22% LCI, 12% emissão no exterior.',
          badge: { label: 'CDI + 0,8%', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Receita & Resultado',
      cards: [
        {
          color: '#f59e0b',
          tag: 'RECEITA',
          title: 'Receita Q1/26: R$ 7,9 bi — crescimento de 38% vs Q1/25',
          detail: 'Composição: interchange de cartões (42%), receita de crédito (35%), investimentos (14%), outros (9%). Crescimento acelerado impulsionado por expansão de carteira de crédito e Ultravioleta.',
          badge: { label: '+38% YoY', type: 'ok' },
        },
        {
          color: '#f59e0b',
          tag: 'INTERCHANGE',
          title: 'Receita de interchange: R$ 3,3 bi no Q1 — Mastercard taxa média 1,72%',
          detail: 'Taxa de intercâmbio média de 1,72% sobre volume transacionado de R$ 192 bi no Q1. Revisão de tabela Mastercard em jul/26 pode reduzir taxa para 1,68% — impacto negativo estimado de R$ 77 mi/trimestre.',
          badge: { label: 'Revisão jul/26', type: 'warn' },
        },
      ],
    },
  ],

  rh: [
    {
      sectionTitle: 'Força de Trabalho Tech',
      cards: [
        {
          color: '#8b5cf6',
          tag: 'HEADCOUNT',
          title: '11.200 colaboradores globais — 7.400 no Brasil (66% em tecnologia)',
          detail: 'Nubank mantém 66% do headcount em engenharia, produto e dados. Política remote-first permite contratar em 180 cidades brasileiras. Média salarial engenheiro sênior: R$ 28.000/mês — 22% acima do mercado.',
          badge: { label: '7.400 no BR', type: 'info' },
        },
        {
          color: '#8b5cf6',
          tag: 'CONTRATAÇÃO',
          title: '180 vagas abertas em tech — time de dados cresce 40% no H1/26',
          detail: 'Prioridades de contratação: ML Engineers (60 vagas), Backend Kotlin (45), Platform Engineers (35). Expansão do time de dados para suportar modelos de crédito de próxima geração. Tempo médio de hiring: 38 dias.',
          badge: { label: '180 vagas', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Cultura & Performance',
      cards: [
        {
          color: '#8b5cf6',
          tag: 'ENGAJAMENTO',
          title: 'eNPS interno: 72 — queda de 6 pontos após processo de layoff Q4/25',
          detail: 'Redução de 8% no headcount em out/25 gerou queda de engajamento. Principais preocupações: clareza de metas em período de reestruturação e progressão de carreira em squads ágeis. Ação: Nubank Culture Week em jun/26.',
          badge: { label: 'eNPS 72', type: 'warn' },
        },
        {
          color: '#8b5cf6',
          tag: 'SQUADS',
          title: '320 squads autônomos — modelo "You build it, you own it" em toda a empresa',
          detail: 'Cada squad de 6-8 pessoas possui ownership total de produto, infra e métricas. OKRs revisados trimestralmente com alinhamento bottom-up. 94% dos squads com OKR de produto definido para Q2/26.',
          badge: { label: '320 squads', type: 'ok' },
        },
        {
          color: '#8b5cf6',
          tag: 'DIVERSIDADE',
          title: 'Mulheres em liderança: 38% — meta de 45% até dez/27',
          detail: 'Programa "Nubank Para Todas" acelerou pipeline de liderança feminina. Crescimento de 4pp em um ano. Gap maior em engenharia (24% mulheres) vs produto (43%). Mentoria estruturada para 120 engenheiras em andamento.',
          badge: { label: '38% liderança', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Atendimento ao Cliente',
      cards: [
        {
          color: '#8b5cf6',
          tag: 'XPEERS',
          title: '4.200 Xpeers (atendentes) — TMA de 3,8 min via chat',
          detail: 'Equipe de atendimento totalmente remota. Tempo médio de atendimento via chat: 3,8 min (benchmark setor: 12 min por telefone). Ferramenta de IA generativa "Nu Assist" reduziu TMA em 22% desde jan/26.',
          badge: { label: 'TMA 3,8min', type: 'ok' },
        },
      ],
    },
  ],

  operacoes: [
    {
      sectionTitle: 'Disponibilidade & Performance',
      cards: [
        {
          color: '#06b6d4',
          tag: 'UPTIME',
          title: 'Uptime do app: 99,97% no Q1/26 — SLA contratual com AWS: 99,95%',
          detail: 'Infraestrutura em AWS (us-east-1 + sa-east-1) manteve uptime acima do SLA. Único incidente no Q1: degradação de 14 min no PIX em 12/mar por falha na integração com BACEN. MTTR: 8 min.',
          badge: { label: '99,97% uptime', type: 'ok' },
        },
        {
          color: '#06b6d4',
          tag: 'PIX',
          title: 'Processamento Pix: 38 mi de transações/dia — P99 latência: 420ms',
          detail: 'Nubank processa 38 mi de transações Pix/dia com P99 de latência em 420ms. Meta P99: 500ms — dentro do SLA do BACEN. Pico de processamento: véspera de feriado atinge 52 mi TPS.',
          badge: { label: '38mi TPS/dia', type: 'ok' },
        },
        {
          color: '#06b6d4',
          tag: 'INCIDENT',
          title: 'War Room Protocol: tempo de resposta a incidente crítico em 4 min',
          detail: 'Novo protocolo de incident response (implementado dez/25) reduziu MTTR de 28 para 4 min em incidentes P1. On-call rotativo com 12 engenheiros 24/7. Post-mortem obrigatório em 48h para todos os P1s.',
          badge: { label: 'MTTR 4min', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Atendimento & Processos',
      cards: [
        {
          color: '#06b6d4',
          tag: 'ATENDIMENTO',
          title: 'CSAT de atendimento: 4,7/5 — resolvido em primeiro contato: 84%',
          detail: 'Taxa de resolução no primeiro contato (FCR) de 84% — acima da meta de 80%. Principais gargalos: contestações de chargeback (FCR 61%) e bloqueio de conta por fraude (FCR 58%). Automação via LLM reduzindo backlog.',
          badge: { label: 'CSAT 4,7', type: 'ok' },
        },
        {
          color: '#06b6d4',
          tag: 'FRAUDE',
          title: 'Taxa de fraude: 0,08% do volume transacionado — modelo ML atualizado',
          detail: 'Sistema de detecção de fraude em tempo real baseado em ML (Conductor + modelos internos) mantém taxa em 0,08%. Novo modelo treinado com 2,1 bi de transações lançado em abr/26 reduziu falsos positivos em 15%.',
          badge: { label: '0,08% fraude', type: 'ok' },
        },
      ],
    },
  ],

  estoque: [
    {
      sectionTitle: 'Crédito & Limites',
      cards: [
        {
          color: '#84cc16',
          tag: 'CARTEIRA',
          title: 'Crédito disponível para concessão: R$ 62 bi — utilização atual 29,7%',
          detail: 'Carteira total de crédito aprovado: R$ 62 bi, com R$ 18,4 bi utilizados (29,7%). Headroom de R$ 43,6 bi para crescimento sem necessidade de funding adicional no curto prazo. Meta de utilização para Q4/26: 38%.',
          badge: { label: 'R$43,6bi disponível', type: 'ok' },
        },
        {
          color: '#84cc16',
          tag: 'LIMITE',
          title: 'Revisão de limites automática mensal: 6,2 mi de clientes beneficiados',
          detail: 'Motor de crédito revisa limites automaticamente todo dia 15. Em abr/26, 6,2 mi de clientes tiveram limite aumentado (média: +R$ 840). Aumento de limite correlaciona com +18% em faturamento de cartão no mês seguinte.',
          badge: { label: '6,2mi revisados', type: 'info' },
        },
        {
          color: '#84cc16',
          tag: 'RISCO',
          title: 'Vintage de safras 2024 performando 0,4pp acima do modelo — positivo',
          detail: 'Clientes aprovados nas safras de out-dez/24 apresentam inadimplência 0,4pp abaixo do previsto pelo modelo de concessão. Indica qualidade superior ao esperado e suporta expansão de crédito para perfis similares.',
          badge: { label: '+0,4pp vs modelo', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Plásticos & Emissão',
      cards: [
        {
          color: '#84cc16',
          tag: 'PLÁSTICOS',
          title: 'Estoque de cartões Ultravioleta: 380 mil unidades — lead time 45 dias',
          detail: 'Cartão Ultravioleta (metal + policarbonato roxo) tem fornecedor único no México. Estoque atual de 380 mil unidades cobre 27 dias de demanda no ritmo atual. Pedido de reposição de 500 mil unidades em trânsito.',
          badge: { label: '27 dias cobertura', type: 'warn' },
        },
        {
          color: '#84cc16',
          tag: 'EMISSÃO',
          title: 'Capacidade de emissão de cartões: 1,8 mi/mês — pico foi 2,3 mi em jan/26',
          detail: 'Parceiro de personalização e gráfica (Conductor) entrega 1,8 mi de cartões/mês em condições normais. Pico de jan/26 (2,3 mi) causou atraso médio de entrega de 5 para 8 dias úteis. Contrato de expansão de capacidade assinado.',
          badge: { label: 'Cap. 1,8mi/mês', type: 'info' },
        },
      ],
    },
  ],

  juridico: [
    {
      sectionTitle: 'Regulatório & BACEN',
      cards: [
        {
          color: '#f97316',
          tag: 'BACEN',
          title: 'Revisão de limite de crédito rotativo: nova norma BACEN entra em jul/26',
          detail: 'Circular BACEN 4.980 limita rotativo de cartão a 30 dias sem parcelamento obrigatório. Nubank estima impacto de -R$ 280 mi/ano em receita de juros rotativos. Produto de parcelamento de fatura sendo redesenhado para compensar.',
          badge: { label: 'Impacto jul/26', type: 'warn' },
        },
        {
          color: '#f97316',
          tag: 'OPEN FINANCE',
          title: 'Fase 4 do Open Finance: compartilhamento de dados de investimentos ativo',
          detail: 'Nubank integrou APIs de compartilhamento de dados de investimentos (Fase 4 BACEN) em mar/26. 1,2 mi de clientes já autorizaram portabilidade de dados. Oportunidade: cross-sell de NuInvest para clientes de outros bancos.',
          badge: { label: 'Fase 4 ativa', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Litígios & Compliance',
      cards: [
        {
          color: '#f97316',
          tag: 'CHARGEBACK',
          title: '2,1 mi de disputas de chargeback em Q1/26 — custo operacional R$ 48 mi',
          detail: 'Volume de chargebacks cresceu 18% vs Q1/25, acompanhando expansão da base. Taxa de chargeback sobre volume: 0,14% — abaixo do limite Mastercard de 0,20%. Custo médio de processamento por disputa: R$ 22,80.',
          badge: { label: '0,14% taxa', type: 'ok' },
        },
        {
          color: '#f97316',
          tag: 'LGPD',
          title: 'ANPD: 2 notificações recebidas no Q1/26 — resposta em 30 dias',
          detail: 'ANPD notificou Nubank sobre uso de dados biométricos na abertura de conta e compartilhamento com bureau Serasa. DPO e equipe jurídica preparando resposta técnica. Prazo: 30 dias. Multa potencial: até R$ 50 mi (2% da receita).',
          badge: { label: '2 notificações', type: 'warn' },
        },
        {
          color: '#f97316',
          tag: 'AML',
          title: 'Compliance anti-lavagem: 14.200 SARs enviados ao COAF no Q1/26',
          detail: 'Nubank reportou 14.200 Suspicious Activity Reports ao COAF no Q1/26 — aumento de 31% impulsionado por expansão da conta MEI e PJ. Sistema de monitoramento integra regras determinísticas + modelo ML treinado em tipologias GAFI.',
          badge: { label: '14.200 SARs', type: 'info' },
        },
      ],
    },
  ],
};
