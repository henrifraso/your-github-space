import type { CompanySectorFeeds } from '../../types';

export const OS1_SECTOR_FEEDS: CompanySectorFeeds = {
  marketing: [
    {
      sectionTitle: 'Lançamentos e Campanhas',
      cards: [
        {
          color: '#ec4899',
          tag: 'LANÇAMENTO',
          title: 'Feature: Relatórios com IA — Go-Live em 3 dias',
          detail: 'A nova funcionalidade de relatórios gerados por IA será lançada na sexta-feira. Email de anúncio programado para base de 12.400 usuários ativos. Landing page de feature page revisada e aprovada pelo time de design.',
          badge: { label: 'Agendado', type: 'info' },
        },
        {
          color: '#ec4899',
          tag: 'CAMPANHA',
          title: 'Google Ads: CPC médio R$8,40 — CTR 3,2%',
          detail: 'Campanha de performance ativa com orçamento de R$18.000/mês. CTR acima da média do setor (2,1%). Grupo de anúncio "IA para PMEs" tem ROAS de 4,8x — recomendado aumentar budget em 20%.',
          badge: { label: 'Saudável', type: 'ok' },
        },
        {
          color: '#ec4899',
          tag: 'SEO',
          title: 'Blog: 3 artigos publicados — 14.200 sessões orgânicas/mês',
          detail: 'Tráfego orgânico cresceu 18% no último mês. Palavra-chave "plataforma de BI para startups" subiu para posição 4 no Google Brasil. Próximo artigo: "Como usar IA em análise de vendas" — deadline 10/05.',
          badge: { label: '+18% tráfego', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Webinars e Eventos',
      cards: [
        {
          color: '#ec4899',
          tag: 'WEBINAR',
          title: 'Webinar "IA no seu Negócio" — 340 inscritos',
          detail: 'Webinar agendado para 15/05 às 19h. Meta era 300 inscritos — superada em 13%. Taxa de confirmação de presença está em 58%, dentro da média esperada de 50-60% para eventos online.',
          badge: { label: 'Meta atingida', type: 'ok' },
        },
        {
          color: '#ec4899',
          tag: 'PARCERIA',
          title: 'Co-marketing com Conta Azul — proposta enviada',
          detail: 'Parceria de co-marketing enviada para aprovação da Conta Azul. Proposta inclui troca de newsletters (base combinada de 90k leads) e um webinar conjunto em junho. Aguardando retorno em até 5 dias úteis.',
          badge: { label: 'Aguardando', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Reputação e NPS',
      cards: [
        {
          color: '#ec4899',
          tag: 'NPS',
          title: 'NPS mensal: 68 — queda de 4 pontos vs. mês anterior',
          detail: 'NPS caiu de 72 para 68 em abril. Principal detrator: "onboarding confuso" (mencionado em 34% dos comentários negativos). Time de produto priorizou revisão do fluxo de onboarding para sprint de maio.',
          badge: { label: 'Atenção', type: 'warn' },
        },
        {
          color: '#ec4899',
          tag: 'REVIEWS',
          title: 'G2 Rating: 4.5 ⭐ — 12 novas avaliações em abril',
          detail: '12 novas avaliações recebidas em abril, média 4,6. 3 avaliações negativas (3 estrelas) respondidas pelo time de CS em menos de 48h. Campanha para solicitar reviews a clientes com +6 meses de uso será disparada em 09/05.',
          badge: { label: '4.5/5', type: 'ok' },
        },
      ],
    },
  ],

  vendas: [
    {
      sectionTitle: 'Receita e Pipeline',
      cards: [
        {
          color: '#10b981',
          tag: 'MRR',
          title: 'MRR: R$487.200 — crescimento 6,3% MoM',
          detail: 'MRR acumulou R$487.200 no fechamento de abril, alta de R$28.900 versus março. ARR projetado em R$5,8M. Crescimento acima da meta de 5% MoM. Top 3 planos contribuindo: Pro (48%), Business (37%), Enterprise (15%).',
          badge: { label: '+6,3% MoM', type: 'ok' },
        },
        {
          color: '#10b981',
          tag: 'PIPELINE',
          title: 'Pipeline ativo: R$1,2M — 47 oportunidades abertas',
          detail: '47 oportunidades abertas com valor médio de R$25.500. 8 oportunidades em fase de proposta (R$320k combinados). Ciclo médio de venda: 28 dias. Taxa de fechamento histórica: 32%.',
          badge: { label: '47 oportunidades', type: 'info' },
        },
        {
          color: '#10b981',
          tag: 'DEMOS',
          title: '18 demos agendadas esta semana — 6 sem-show rate',
          detail: '18 demos agendadas para a semana. Sem-show rate de 33% está acima do tolerável (20%). Implementado lembrete automático via WhatsApp 2h antes — aguardar resultado nas próximas semanas.',
          badge: { label: 'No-show alto', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Retenção e Expansão',
      cards: [
        {
          color: '#10b981',
          tag: 'CHURN',
          title: 'Churn de abril: 1,8% — dentro da meta de 2%',
          detail: '9 clientes cancelaram em abril (MRR perdido: R$8.820). Principal motivo: "não percebeu valor suficiente" (5 de 9 clientes). Time de CS iniciou programa de health score para identificar clientes em risco com 30 dias de antecedência.',
          badge: { label: '1,8% — OK', type: 'ok' },
        },
        {
          color: '#10b981',
          tag: 'UPSELL',
          title: 'Expansão MRR: R$31.400 — 14 upgrades em abril',
          detail: '14 clientes fizeram upgrade de plano em abril, gerando R$31.400 de expansão MRR. Taxa de expansão: 6,4% — acima da meta de 5%. Segmento Enterprise foi responsável por 60% do valor de expansão.',
          badge: { label: 'Meta superada', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Canais e Parceiros',
      cards: [
        {
          color: '#10b981',
          tag: 'INBOUND',
          title: 'Leads inbound: 312 em abril — conversão 8,4%',
          detail: '312 leads inbound gerados em abril, com 26 convertidos em clientes pagantes (8,4%). Principal canal: busca orgânica (42%), seguido de indicações (28%). Custo de aquisição por cliente (CAC): R$1.840.',
          badge: { label: '8,4% conversão', type: 'ok' },
        },
        {
          color: '#10b981',
          tag: 'PARCEIROS',
          title: 'Programa de parceiros: 8 revenda ativas — R$62k MRR indireto',
          detail: '8 revendas ativas gerando R$62.000 de MRR indireto (12,7% do total). 2 novas parcerias em processo de onboarding. Meta para Q2: atingir 15% do MRR via canal indireto.',
          badge: { label: '12,7% do MRR', type: 'info' },
        },
      ],
    },
  ],

  financeiro: [
    {
      sectionTitle: 'Saúde Financeira',
      cards: [
        {
          color: '#f59e0b',
          tag: 'RUNWAY',
          title: 'Runway: 14 meses — caixa R$2,1M',
          detail: 'Caixa disponível de R$2,1M com burn rate mensal de R$148.000. Runway de 14 meses sem novas entradas. Com crescimento projetado, ponto de equilíbrio (breakeven) em 9 meses. Rodada Série A em preparação para Q3.',
          badge: { label: '14 meses runway', type: 'warn' },
        },
        {
          color: '#f59e0b',
          tag: 'ARR',
          title: 'ARR: R$5,85M — crescimento 74% YoY',
          detail: 'ARR atingiu R$5,85M no fechamento de abril, crescimento de 74% em relação ao mesmo período do ano anterior (R$3,36M). Margem bruta de 78% — dentro da faixa saudável para SaaS B2B.',
          badge: { label: '+74% YoY', type: 'ok' },
        },
        {
          color: '#f59e0b',
          tag: 'CUSTOS',
          title: 'AWS: R$42.300/mês — alta de 12% vs. março',
          detail: 'Custos de infraestrutura AWS subiram 12% em abril por conta do aumento de uso de LLMs (Claude e GPT-4) nos relatórios automáticos. Time de engenharia avaliando implementação de cache para reduzir chamadas em 30%.',
          badge: { label: 'Monitorar', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Obrigações Fiscais',
      cards: [
        {
          color: '#f59e0b',
          tag: 'IMPOSTOS',
          title: 'ISS e PIS/COFINS — vencimento em 8 dias',
          detail: 'ISS sobre serviços de software: R$9.744 com vencimento em 15/05. PIS/COFINS: R$7.210 com vencimento em 20/05. Contador confirmou valores e já gerou boletos. Provisão realizada no fluxo de caixa.',
          badge: { label: 'Vence em 8 dias', type: 'warn' },
        },
        {
          color: '#f59e0b',
          tag: 'CONTABIL',
          title: 'Demonstrações Q1 finalizadas — DRE aprovada',
          detail: 'DRE do primeiro trimestre aprovada pelo conselho em 30/04. EBITDA negativo de R$-62.000 no trimestre, dentro do esperado para fase de crescimento. Relatório enviado a todos os investidores via data room.',
          badge: { label: 'Concluído', type: 'ok' },
        },
      ],
    },
  ],

  rh: [
    {
      sectionTitle: 'Contratações e Headcount',
      cards: [
        {
          color: '#8b5cf6',
          tag: 'VAGA ABERTA',
          title: '3 vagas abertas: 2 Engenheiros Backend + 1 ML Engineer',
          detail: '2 vagas de Engenheiro Backend (Node.js/Python) e 1 de ML Engineer abertas há 21 dias. Pipeline: 48 candidatos triados, 12 em entrevistas técnicas, 3 em oferta final. Meta: contratar até 31/05.',
          badge: { label: '3 vagas abertas', type: 'warn' },
        },
        {
          color: '#8b5cf6',
          tag: 'ONBOARDING',
          title: '2 novos contratados iniciando semana que vem',
          detail: 'Product Designer (Mariana Costa) e Dev Frontend (Lucas Menezes) iniciam na segunda-feira 12/05. Onboarding de 2 semanas estruturado com buddy program. Equipamentos solicitados e acesso aos sistemas configurados.',
          badge: { label: 'Pronto', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Cultura e Engajamento',
      cards: [
        {
          color: '#8b5cf6',
          tag: 'eNPS',
          title: 'eNPS do time: 71 — estável vs. trimestre anterior',
          detail: 'eNPS de abril: 71 (promotores 80%, neutros 15%, detratores 5%). Estável em relação ao Q1 (eNPS 72). Principal ponto positivo: flexibilidade de horário e trabalho remoto. Principal ponto de melhora: clareza nos planos de carreira.',
          badge: { label: 'eNPS 71', type: 'ok' },
        },
        {
          color: '#8b5cf6',
          tag: 'CULTURA',
          title: 'All-Hands mensal — 15/05 às 10h',
          detail: 'All-Hands mensal agendado para 15/05 às 10h via Google Meet. Pauta: resultados de abril, apresentação dos novos contratados, atualização da roadmap de produto e espaço de perguntas abertas. Presença média histórica: 94%.',
          badge: { label: 'Agendado', type: 'info' },
        },
        {
          color: '#8b5cf6',
          tag: 'BENEFÍCIOS',
          title: 'Health insurance renovação — prazo 20/05',
          detail: 'Contrato de plano de saúde (Amil — 32 vidas) vence em 20/05. 3 cotações recebidas: Amil (reajuste +9,2%), Bradesco Saúde (+7,8%), SulAmérica (+8,4%). Recomendação do RH: Bradesco Saúde. Decisão até 13/05.',
          badge: { label: 'Prazo 20/05', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Treinamentos e Desenvolvimento',
      cards: [
        {
          color: '#8b5cf6',
          tag: 'TREINAMENTO',
          title: 'Certificações AWS — 4 engenheiros inscritos',
          detail: '4 engenheiros inscritos para a certificação AWS Solutions Architect em junho. Empresa cobre 100% do custo (R$1.200/pessoa). Estudo em grupo às terças-feiras 17h — participação voluntária, mas 8 de 10 engenheiros participam.',
          badge: { label: 'Em andamento', type: 'info' },
        },
        {
          color: '#8b5cf6',
          tag: 'LGPD',
          title: 'Treinamento LGPD obrigatório — 3 pendentes',
          detail: 'Treinamento anual de LGPD com prazo até 31/05. 29 de 32 colaboradores já concluíram. 3 pendentes: 2 estão em férias (concluirão ao retorno) e 1 em licença médica. Compliança prevista antes do prazo.',
          badge: { label: '3 pendentes', type: 'warn' },
        },
      ],
    },
  ],

  operacoes: [
    {
      sectionTitle: 'Infraestrutura e Uptime',
      cards: [
        {
          color: '#06b6d4',
          tag: 'UPTIME',
          title: 'Uptime do mês: 99,94% — SLA de 99,9% cumprido',
          detail: 'Uptime de abril: 99,94% (26 minutos de indisponibilidade total). Incidente em 18/04 causou 22 minutos de lentidão em queries de relatórios — corrigido com ajuste de índice no PostgreSQL. SLA de 99,9% garantido para todos os clientes.',
          badge: { label: '99,94% uptime', type: 'ok' },
        },
        {
          color: '#06b6d4',
          tag: 'INCIDENTE',
          title: 'Incident #47 resolvido — P1 causado por spike de CPU',
          detail: 'Incidente P1 de 24/04 resolvido: spike de CPU no cluster principal causou degradação de 8 minutos. Root cause: job de processamento batch rodando em horário de pico. Correção: job movido para 03h00. Post-mortem publicado.',
          badge: { label: 'Resolvido', type: 'ok' },
        },
        {
          color: '#06b6d4',
          tag: 'ALERTA',
          title: 'Disco do banco de dados em 78% — threshold de 85%',
          detail: 'Partição de dados do RDS está em 78% de capacidade. Threshold de alerta é 85%. Estimativa de crescimento: +2,5% ao mês. Engenharia tem tarefa aberta para purge de logs antigos (+90 dias) e avaliação de storage tier mais econômico.',
          badge: { label: 'Monitorar', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'CI/CD e Deploys',
      cards: [
        {
          color: '#06b6d4',
          tag: 'DEPLOY',
          title: '23 deploys em abril — tempo médio de build: 4m12s',
          detail: '23 deploys realizados em abril via GitHub Actions. Tempo médio de build: 4m12s, dentro da meta de 5min. Taxa de rollback: 4,3% (1 deploy revertido). Pipeline com cobertura de testes em 87% — meta é 90%.',
          badge: { label: '23 deploys', type: 'info' },
        },
        {
          color: '#06b6d4',
          tag: 'SEGURANÇA',
          title: 'Scan de vulnerabilidades — 2 CVEs médios abertos',
          detail: 'Scan semanal de dependências identificou 2 CVEs de severidade média (CVSS 5.4 e 6.1). Ambos em bibliotecas de parsing de PDF. Patches disponíveis — tickets criados para sprint atual com prioridade média.',
          badge: { label: '2 CVEs abertos', type: 'warn' },
        },
      ],
    },
  ],

  estoque: [
    {
      sectionTitle: 'Créditos e APIs',
      cards: [
        {
          color: '#84cc16',
          tag: 'API CRÍTICO',
          title: 'Créditos Anthropic: 68% consumidos — 23 dias restantes',
          detail: 'Consumo de créditos da API da Anthropic (Claude) está em 68% do plano mensal com 23 dias restantes no ciclo. Ritmo atual projeta estouro de 12% antes do renovar. Solução: limitar chamadas de usuários free tier a 5/dia (implementação em 48h).',
          badge: { label: 'Atenção', type: 'warn' },
        },
        {
          color: '#84cc16',
          tag: 'API',
          title: 'OpenAI GPT-4o — consumo dentro do orçamento',
          detail: 'Uso da API OpenAI (GPT-4o para embeddings e fallback): R$8.200 em abril, dentro do orçamento de R$10.000/mês. Custo por usuário ativo: R$0,66/mês. Implementação de cache semântico reduziu custos em 22% vs. março.',
          badge: { label: 'No orçamento', type: 'ok' },
        },
        {
          color: '#84cc16',
          tag: 'LICENÇAS',
          title: 'Licenças GitHub Copilot — 18 ativas de 20 contratadas',
          detail: '18 das 20 licenças de GitHub Copilot estão atribuídas. 2 licenças ociosas (ex-colaboradores desligados). Ação: revogar e redistribuir para novos contratados que iniciam na próxima semana. Custo: US$19/dev/mês.',
          badge: { label: '2 licenças ociosas', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Infraestrutura Cloud',
      cards: [
        {
          color: '#84cc16',
          tag: 'PLANO',
          title: 'AWS Reserved Instances — renovação em 45 dias',
          detail: 'Contrato de Reserved Instances da AWS para instâncias de produção vence em 21/06. Renovação antecipada de 1 ano garante desconto de 35% vs. on-demand. Estimativa de economia: US$8.400/ano. CFO aprovou orçamento.',
          badge: { label: 'Renovar em 45d', type: 'info' },
        },
        {
          color: '#84cc16',
          tag: 'FERRAMENTAS',
          title: 'Stack de ferramentas SaaS — custo total R$22.400/mês',
          detail: 'Inventário de SaaS tools: Figma, Linear, Notion, Hubspot, Datadog, Sentry, Intercom e outros (24 ferramentas). Custo total: R$22.400/mês. Revisão trimestral identificou 3 ferramentas com baixo uso (<20% do time) — candidatas a corte.',
          badge: { label: 'Revisão pendente', type: 'warn' },
        },
      ],
    },
  ],

  juridico: [
    {
      sectionTitle: 'Privacidade e Compliance',
      cards: [
        {
          color: '#f97316',
          tag: 'LGPD',
          title: 'DPA assinado com 94% dos clientes Enterprise',
          detail: 'Data Processing Agreement (DPA) assinado com 94% dos clientes do plano Enterprise (16 de 17). 1 cliente (Grupo Alfa) solicitou cláusulas adicionais sobre retenção de dados — análise jurídica em andamento. Prazo: 30/05.',
          badge: { label: '94% assinados', type: 'ok' },
        },
        {
          color: '#f97316',
          tag: 'LGPD',
          title: 'Relatório de Impacto (RIPD) — atualização anual vence em junho',
          detail: 'O Relatório de Impacto à Proteção de Dados Pessoais (RIPD) precisa de atualização anual até 30/06. DPO externo iniciou coleta de informações junto aos times. Alterações relevantes: novo módulo de IA gera necessidade de nova categoria de tratamento.',
          badge: { label: 'Prazo jun/26', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Contratos e Termos',
      cards: [
        {
          color: '#f97316',
          tag: 'CONTRATO',
          title: 'Termos de Uso atualizados — nova versão em revisão final',
          detail: 'Nova versão dos Termos de Uso e Política de Privacidade em revisão final pelo jurídico. Mudanças incluem: cláusula de uso de dados para treino de modelos (opt-out garantido) e atualização dos SLAs de disponibilidade. Publicação prevista para 20/05.',
          badge: { label: 'Revisão final', type: 'info' },
        },
        {
          color: '#f97316',
          tag: 'ACORDO',
          title: 'MSA com cliente Enterprise (R$120k/ano) — assinatura pendente',
          detail: 'Master Service Agreement com cliente Distribuidora Norte Ltda (contrato de R$120.000/ano) aguarda assinatura final do diretor financeiro deles. Enviado em 28/04, SLA jurídico do cliente é 15 dias úteis. Follow-up agendado para 09/05.',
          badge: { label: 'Assinatura pendente', type: 'warn' },
        },
        {
          color: '#f97316',
          tag: 'PROPRIEDADE IP',
          title: 'Registro de marca "OS1" no INPI — em análise há 8 meses',
          detail: 'Pedido de registro da marca OS1 no INPI (classe 42 — serviços de tecnologia) aguarda análise há 8 meses. Prazo médio do INPI: 18-24 meses. Advogado confirma pedido sem oposições até o momento. Status: Exame Formal Cumprido.',
          badge: { label: 'Em análise INPI', type: 'info' },
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
