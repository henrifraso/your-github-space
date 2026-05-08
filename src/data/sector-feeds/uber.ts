import type { CompanySectorFeeds } from '../../types';

export const UBER_SECTOR_FEEDS: CompanySectorFeeds = {
  marketing: [
    {
      sectionTitle: 'Marca & Aquisição',
      cards: [
        {
          color: '#1d1d2e',
          tag: 'CAMPANHA',
          title: '"Go Anywhere" — campanha global Q1/26 atinge 1,4 bi de impressões',
          detail: 'Campanha multiplataforma com foco em mobilidade integrada (ride + Eats + Reserve) registrou 1,4 bi de impressões em 72 mercados. ROAS consolidado: 4,2x. Brasil foi o 3º maior mercado por investimento, atrás de EUA e Índia.',
          badge: { label: 'ROAS 4,2x', type: 'ok' },
        },
        {
          color: '#1d1d2e',
          tag: 'AQUISIÇÃO',
          title: 'CAC de novos passageiros cai para US$ 8,10 — mínimo histórico',
          detail: 'Custo de aquisição de novo passageiro (first trip) recuou 14% YoY puxado por maior eficiência em mídia programática e expansão do programa de indicação. Benchmark do setor: US$ 14-18. Indicações respondem por 29% das primeiras viagens.',
          badge: { label: 'CAC US$8,10', type: 'ok' },
        },
        {
          color: '#1d1d2e',
          tag: 'UBER ONE',
          title: 'Uber One: 26 mi de assinantes — crescimento de 70% YoY',
          detail: 'Plano de assinatura premium (US$ 9,99/mês) atingiu 26 mi de membros globais. Membros fazem 3,4x mais viagens e 2,8x mais pedidos no Eats que não-membros. Receita de assinaturas: US$ 3,1 bi anualizados. Churn mensal: 4,2%.',
          badge: { label: '26mi assinantes', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Uber Eats & Cross-sell',
      cards: [
        {
          color: '#1d1d2e',
          tag: 'EATS',
          title: 'Uber Eats GMV Q1/26: US$ 18,1 bi — +21% YoY em mercados emergentes',
          detail: 'GMV global de Eats cresceu 18% YoY; mercados emergentes (Brasil, México, Índia) puxaram com +21%. Take rate médio de Eats: 14,2%. Brasil representa 8% do GMV global de Eats, com ticket médio de R$ 62 por pedido.',
          badge: { label: 'GMV US$18,1bi', type: 'ok' },
        },
        {
          color: '#1d1d2e',
          tag: 'CROSS-APP',
          title: 'Usuários que usam Ride + Eats têm LTV 4,6x maior — programa de bundling ativo',
          detail: 'Análise de coorte confirma: clientes com ambos os produtos geram receita líquida 4,6x superior. Push notifications cross-app convertem 11% dos passageiros em usuários de Eats dentro de 30 dias. Campanha de bundling expandida para 15 cidades BR.',
        },
        {
          color: '#1d1d2e',
          tag: 'GROCERY',
          title: 'Uber Grocery cresce 44% YoY — parceria com Carrefour ampliada para 22 cidades BR',
          detail: 'Entrega de supermercado via Uber Grocery avança no Brasil com Carrefour, Pão de Açúcar e Atacadão. Tempo médio de entrega: 28 min. Ticket médio: R$ 148. Margem de contribuição positiva em 14 das 22 cidades.',
          badge: { label: '+44% YoY', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Surge & Pricing',
      cards: [
        {
          color: '#1d1d2e',
          tag: 'SURGE',
          title: 'Surge pricing médio 1,8x em horário de pico — NPS cai 12 pontos durante surges',
          detail: 'Análise de satisfação mostra queda consistente de NPS durante preços dinâmicos acima de 2x. Meta de UX: comunicar estimativa de tempo para preço normal antes da confirmação. A/B test de "surge transparency" em São Paulo desde mar/26.',
          badge: { label: 'NPS -12pts', type: 'warn' },
        },
        {
          color: '#1d1d2e',
          tag: 'PROMO',
          title: 'Budget de descontos Q1/26: US$ 890 mi — redução de 8% vs Q1/25',
          detail: 'Uber reduziu gastos com promoções em 8% mantendo volume de viagens estável — evidência de menor dependência de subsídios. Brasil recebeu 6,2% do budget global de promoções. Promo mais eficiente: primeira viagem gratuita (conversão 34%).',
        },
      ],
    },
  ],

  vendas: [
    {
      sectionTitle: 'Volume de Corridas',
      cards: [
        {
          color: '#1d1d2e',
          tag: 'TRIPS',
          title: 'Q1/26: 2,84 bi de viagens — +18% YoY; Brasil 310 mi de corridas',
          detail: 'Volume global de trips cresceu 18% YoY no Q1/26. Brasil registrou 310 mi de corridas no trimestre — média de 3,4 mi/dia. São Paulo é o maior mercado individual global com 1,1 mi de corridas/dia, à frente de Nova York (840 mil).',
          badge: { label: '2,84bi viagens', type: 'ok' },
        },
        {
          color: '#1d1d2e',
          tag: 'FREQUÊNCIA',
          title: 'Frequência média do passageiro ativo: 5,8 viagens/mês — meta é 6,5',
          detail: 'Passageiro ativo global realiza 5,8 viagens/mês em média. Gap vs meta (6,5) concentrado em usuários casuais (1-2 trips/mês). Programa de reativação por push personalizado com oferta de desconto converteu 18% dos inativos 30+ dias.',
          badge: { label: '5,8 trips/mês', type: 'warn' },
        },
        {
          color: '#1d1d2e',
          tag: 'RESERVE',
          title: 'Uber Reserve cresce 62% YoY — aeroporto responde por 54% das reservas',
          detail: 'Produto de agendamento antecipado cresceu 62% em volume. Aeroportos são o principal uso: 54% das reservas. Ticket médio de Reserve: 2,3x maior que corrida padrão. Parceria com 48 aeroportos para integração com sistema de chegada de voos.',
          badge: { label: '+62% YoY', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Uber for Business & B2B',
      cards: [
        {
          color: '#1d1d2e',
          tag: 'B2B',
          title: 'Uber for Business: 175 mil empresas clientes — receita B2B cresce 34% YoY',
          detail: 'Plataforma corporativa atinge 175 mil empresas em 100+ países. Receita de viagens corporativas: US$ 4,2 bi anualizados. Módulo de gestão de despesas integrado com SAP Concur e Oracle. Tempo médio de ciclo de venda: 18 dias para SMB, 94 dias para enterprise.',
          badge: { label: '175k empresas', type: 'ok' },
        },
        {
          color: '#1d1d2e',
          tag: 'BRASIL B2B',
          title: 'Uber for Business Brasil: 8.200 empresas ativas — crescimento de 28% em Q1',
          detail: 'Base corporativa brasileira cresceu 28% no Q1/26. Setores líderes: consultorias (22%), saúde (18%), varejo (15%). Ticket médio mensal por empresa: R$ 4.800. Integração com Totvs em fase de homologação para controle de expense.',
        },
        {
          color: '#1d1d2e',
          tag: 'EATS B2B',
          title: 'Uber Eats for Business: almoço corporativo em 12 cidades BR — NPS 76',
          detail: 'Produto de refeições corporativas disponível em 12 cidades brasileiras. 3.200 empresas ativas, média de 180 pedidos/mês por empresa. Subsídio médio por refeição: R$ 28. NPS de 76 entre usuários finais do benefício.',
          badge: { label: 'NPS 76', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Motoristas Parceiros',
      cards: [
        {
          color: '#1d1d2e',
          tag: 'OFERTA',
          title: '7,8 mi de motoristas ativos globalmente — Brasil: 1,2 mi de parceiros',
          detail: 'Base global de motoristas parceiros cresce 14% YoY. Brasil tem 1,2 mi de motoristas ativos mensais, concentrados em SP (340 mil), RJ (180 mil) e NE (210 mil). Taxa de aceitação de corridas: 72% — abaixo da meta de 80%.',
          badge: { label: '1,2mi no BR', type: 'info' },
        },
        {
          color: '#1d1d2e',
          tag: 'RETENÇÃO',
          title: 'Churn de motoristas: 4,8%/mês — principal motivo: ganhos abaixo da expectativa',
          detail: 'Survey de desligamento indica que 61% dos motoristas que param citam ganhos abaixo da expectativa como razão principal. Ganho médio BR após descontos Uber: R$ 22/hora líquido. Programa Pro (incentivos por avaliação) retém 38% mais que controle.',
          badge: { label: 'Churn 4,8%', type: 'warn' },
        },
      ],
    },
  ],

  financeiro: [
    {
      sectionTitle: 'Receita & Margem',
      cards: [
        {
          color: '#1d1d2e',
          tag: 'RECEITA',
          title: 'Receita Q1/26: US$ 11,5 bi — crescimento de 20% YoY; Adjusted EBITDA US$ 1,9 bi',
          detail: 'Receita líquida de US$ 11,5 bi cresceu 20% YoY. Adjusted EBITDA de US$ 1,9 bi representa margem de 16,5% — expansão de 3,8pp vs Q1/25. Mobility contribui com 57% da receita; Delivery 38%; Freight 5%.',
          badge: { label: '+20% YoY', type: 'ok' },
        },
        {
          color: '#1d1d2e',
          tag: 'TAKE RATE',
          title: 'Take rate de Mobility: 27,8% — alta de 1,2pp; pressão regulatória em 8 mercados',
          detail: 'Take rate de corridas subiu para 27,8% no Q1/26 após redução de subsídios. Oito mercados (UK, França, Espanha, Austrália, Brasil, Canadá, Alemanha, México) têm investigações regulatórias sobre comissionamento. Provisão jurídica: US$ 340 mi.',
          badge: { label: 'Take 27,8%', type: 'warn' },
        },
        {
          color: '#1d1d2e',
          tag: 'FREE CASH',
          title: 'Free cash flow Q1/26: US$ 1,4 bi — primeiro ano com FCF positivo em todos os trimestres',
          detail: 'Uber gerou US$ 1,4 bi de FCF no Q1/26, primeiro ano consecutivo de FCF positivo em todos os trimestres. Cash & equivalentes: US$ 5,8 bi. Programa de recompra de ações de US$ 7 bi aprovado: US$ 2,1 bi executados até abr/26.',
          badge: { label: 'FCF US$1,4bi', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Custos & Incentivos',
      cards: [
        {
          color: '#1d1d2e',
          tag: 'INCENTIVOS',
          title: 'Incentivos a motoristas: US$ 890 mi no Q1 — 7,7% da receita bruta',
          detail: 'Gastos com incentivos e garantias de ganhos a motoristas totalizaram US$ 890 mi no Q1, representando 7,7% da receita bruta de Mobility. Redução de 1,1pp vs Q1/25 graças ao menor estresse de oferta em mercados maduros.',
          badge: { label: 'US$890mi', type: 'info' },
        },
        {
          color: '#1d1d2e',
          tag: 'SEGUROS',
          title: 'Custo de seguros: US$ 1,1 bi no Q1 — alta de 18% por sinistros nos EUA',
          detail: 'Seguros de responsabilidade civil representam o maior custo variável. Alta de 18% no Q1 reflete aumento de sinistros nos EUA e reajuste de prêmios pelo mercado segurador. Uber explore auto-seguro para frota de 80 mil veículos alugados.',
          badge: { label: '+18% sinistros', type: 'warn' },
        },
      ],
    },
  ],

  rh: [
    {
      sectionTitle: 'Headcount & Estrutura',
      cards: [
        {
          color: '#1d1d2e',
          tag: 'HEADCOUNT',
          title: '34.100 colaboradores CLT globais — engenharia representa 42% do total',
          detail: 'Uber mantém 34.100 funcionários diretos após cortes de 2024. Engenharia e produto: 14.300 pessoas. Operações e suporte: 9.800. Maior concentração: San Francisco (8.200), Amsterdã (3.100), São Paulo (2.400), Hyderabad (4.600).',
          badge: { label: '34.100 globais', type: 'info' },
        },
        {
          color: '#1d1d2e',
          tag: 'BRASIL',
          title: 'Time BR: 2.400 colaboradores — expansão de 15% planejada para H2/26',
          detail: 'Escritório de São Paulo sedia operações de Mobility BR, Eats BR, políticas públicas e engenharia. Vagas abertas: 180, com foco em engenharia de dados (60), operações de marketplace (45) e regulatório (22). Salário médio engenheiro sênior: R$ 32.000/mês.',
          badge: { label: '+15% H2/26', type: 'info' },
        },
        {
          color: '#1d1d2e',
          tag: 'ENGAJAMENTO',
          title: 'Glassdoor rating: 3,9/5 — queda após layoffs de 2024; eNPS interno: 44',
          detail: 'Rating no Glassdoor caiu de 4,2 para 3,9 após reestruturação de 2024 (corte de 13% do headcount). eNPS interno em 44 — abaixo da meta de 55. Principais críticas: carga de trabalho pós-corte e incerteza sobre IA substituindo funções.',
          badge: { label: 'eNPS 44', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Motoristas: Relação de Trabalho',
      cards: [
        {
          color: '#1d1d2e',
          tag: 'CLASSIFICAÇÃO',
          title: 'Classificação de motoristas: 14 processos judiciais ativos em 9 países',
          detail: 'Discussão sobre vínculo empregatício de motoristas active em UK, FR, ES, AU, BR, CA, NL, DE, MX. Decisão do STJ brasileiro em jun/26 pode exigir contribuição previdenciária para 1,2 mi de parceiros — custo estimado de R$ 4,2 bi/ano.',
          badge: { label: 'STJ jun/26', type: 'warn' },
        },
        {
          color: '#1d1d2e',
          tag: 'BENEFÍCIOS',
          title: 'Uber Pro Shield: fundo de acidentes para motoristas — R$ 12 mi pagos no Q1 BR',
          detail: 'Programa voluntário de proteção contra acidentes pagou R$ 12 mi a motoristas brasileiros no Q1/26. Cobertura de até R$ 50.000 por acidente. Adesão: 38% dos motoristas ativos. Estratégia pró-ativa para mitigar risco de reclassificação trabalhista.',
          badge: { label: 'R$12mi pagos', type: 'info' },
        },
      ],
    },
  ],

  operacoes: [
    {
      sectionTitle: 'Marketplace & Matching',
      cards: [
        {
          color: '#1d1d2e',
          tag: 'ETA',
          title: 'ETA médio global: 4,2 min — São Paulo: 3,8 min; Record: 2,1 min em Tóquio',
          detail: 'Tempo de chegada estimado melhorou 11% YoY por avanços no algoritmo de pré-posicionamento de motoristas. São Paulo atinge 3,8 min em média graças à densidade de motoristas. Metas Q4/26: 3,5 min global, 3,2 min em SP.',
          badge: { label: 'ETA 4,2min', type: 'ok' },
        },
        {
          color: '#1d1d2e',
          tag: 'UPTIME',
          title: 'Disponibilidade da plataforma: 99,95% — 3 incidentes P1 em Q1/26',
          detail: 'Infraestrutura em AWS e GCP manteve 99,95% de uptime no Q1. Três incidentes P1: falha de matching em SP (18min), degradação de ETA global (9min), e falha de pagamento PIX BR (22min). MTTR médio: 16 min.',
          badge: { label: '99,95% uptime', type: 'ok' },
        },
        {
          color: '#1d1d2e',
          tag: 'SAFETY',
          title: 'Safety Toolkit: verificação de rota ativa em 100% das corridas no Brasil',
          detail: 'Recurso de verificação de rota em tempo real (detecção de desvio) ativo em 100% das corridas BR desde jan/26. Incidentes com desvio de rota detectados e resolvidos: 4.200 no Q1. Parceria com SSP-SP para resposta em 8 min em emergências.',
          badge: { label: '100% cobertura', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Delivery Operations',
      cards: [
        {
          color: '#1d1d2e',
          tag: 'ENTREGA',
          title: 'Tempo médio de entrega Eats no BR: 32 min — meta é 28 min até Q3/26',
          detail: 'Tempo de entrega subiu 2 min vs Q4/25 por congestionamento em SP e RJ. Restaurantes parceiros com tempo de preparo >18 min concentram 68% dos atrasos. Ferramenta de ML para previsão de preparo em deploy: reduz atraso estimado em 4 min.',
          badge: { label: '32min entrega', type: 'warn' },
        },
        {
          color: '#1d1d2e',
          tag: 'DARK KITCHENS',
          title: 'Uber Eats Kitchen: 28 dark kitchens operacionais no BR — 4 novas em H1/26',
          detail: 'Cozinhas exclusivas para delivery em 12 cidades brasileiras operam com marcas virtuais próprias e parceiras. Margem de contribuição das dark kitchens: 22% vs 14% de restaurantes físicos. Quatro novas unidades previstas para H1/26 em Curitiba e Manaus.',
          badge: { label: '28 dark kitchens', type: 'info' },
        },
      ],
    },
  ],

  estoque: [
    {
      sectionTitle: 'Frota & Veículos',
      cards: [
        {
          color: '#1d1d2e',
          tag: 'FROTA EV',
          title: 'Uber Green: 420 mil EVs na plataforma — meta de 1 mi até 2030',
          detail: 'Veículos elétricos representam 5,4% da frota ativa global. Brasil tem 28.000 EVs cadastrados, concentrados em SP (18.000). Parceria com BYD para financiamento subsidiado: 12.000 unidades entregues em 2025, 20.000 previstas para 2026.',
          badge: { label: '420k EVs', type: 'info' },
        },
        {
          color: '#1d1d2e',
          tag: 'ALUGUEL',
          title: 'Uber Rent: 80 mil veículos alugados para motoristas — ROI de 18% a.a.',
          detail: 'Programa de locação de veículos para motoristas sem carro próprio opera 80 mil unidades globalmente. Parceiros: Hertz (EUA), Movida (Brasil), Sixt (Europa). ROI médio de 18% a.a. por veículo. Expansão para 110 mil unidades planejada para Q4/26.',
          badge: { label: '80k veículos', type: 'ok' },
        },
        {
          color: '#1d1d2e',
          tag: 'MANUTENÇÃO',
          title: 'Motoristas com veículo sem CRLV ativo: 3,2% da frota BR — risco regulatório',
          detail: 'Sistema de verificação documental detectou 38.400 veículos com documentação vencida ou pendente no Brasil. Detran-SP iniciou auditoria em fev/26. Uber bloqueia corridas automaticamente após 30 dias de vencimento — 91% de conformidade.',
          badge: { label: '3,2% irregulares', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Supply de Entregadores',
      cards: [
        {
          color: '#1d1d2e',
          tag: 'ENTREGADORES',
          title: '980 mil entregadores ativos no Eats BR — pico de demanda aumenta 2,4x aos fins de semana',
          detail: 'Base de entregadores Eats cresceu 12% YoY no Brasil. Composição: 61% moto, 31% bicicleta elétrica, 8% a pé. Fins de semana e feriados criam pico 2,4x acima da média semanal. Programa de incentivo de pico paga bônus de R$ 6/entrega em horário de rush.',
          badge: { label: '980k ativos', type: 'info' },
        },
        {
          color: '#1d1d2e',
          tag: 'EQUIPAMENTO',
          title: 'Mochilas térmicas Eats: estoque de 180 mil unidades — lead time 60 dias da China',
          detail: 'Equipamentos de entrega (mochilas térmicas, suportes de celular) distribuídos via hubs regionais. Estoque atual de 180 mil unidades cobre 55 dias de demanda prevista. Fornecedor principal: Nidoo (Shenzhen). Alternativa local em homologação: Canguru (SP).',
        },
      ],
    },
  ],

  juridico: [
    {
      sectionTitle: 'Regulação & ANTT',
      cards: [
        {
          color: '#1d1d2e',
          tag: 'ANTT',
          title: 'Resolução ANTT 5.940/26: licença federal para apps de transporte aprovada',
          detail: 'Nova regulamentação federal exige licença da ANTT para operar plataformas de transporte de passageiros. Uber obteve licença provisória em jan/26; definitiva prevista para ago/26. Taxa de licença: R$ 18 mi/ano. Concorrentes 99 e InDriver ainda aguardam homologação.',
          badge: { label: 'Licença provisional', type: 'info' },
        },
        {
          color: '#1d1d2e',
          tag: 'MUNICIPAL',
          title: 'Lei municipal SP: piso mínimo de R$ 2,50/km para corridas — vigência jul/26',
          detail: 'Câmara Municipal de SP aprovou piso de R$ 2,50/km líquido para motoristas. Impacto estimado: aumento de 8-12% no preço final ao passageiro em São Paulo. Uber projeta queda de 6% no volume de corridas em SP no curto prazo. Recurso no TJ-SP em análise.',
          badge: { label: 'Vigência jul/26', type: 'warn' },
        },
        {
          color: '#1d1d2e',
          tag: 'INTERNACIONAL',
          title: 'UK Supreme Court: motoristas são "workers" — passivo trabalhista de £ 620 mi',
          detail: 'Decisão de 2021 do UK Supreme Court gerou processo de reclassificação para 70.000 motoristas britânicos. Acordos de férias, seguro desemprego e salário mínimo garantidos. Custo total liquidado até abr/26: £ 620 mi. Modelo replicado em CA e AU parcialmente.',
          badge: { label: '£620mi passivo', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Segurança & Privacidade',
      cards: [
        {
          color: '#1d1d2e',
          tag: 'SAFETY',
          title: 'Processo DOJ EUA: investigação de subnotificação de agressões sexuais — fase de descoberta',
          detail: 'Departamento de Justiça dos EUA investiga práticas de reporte de incidentes de segurança da Uber. Uber publicou relatório de transparência de segurança (2021 e 2023). Fase de discovery em curso; Uber coopera com 18 subpoenas recebidas até mar/26.',
          badge: { label: 'Em discovery', type: 'warn' },
        },
        {
          color: '#1d1d2e',
          tag: 'LGPD',
          title: 'ANPD: notificação sobre dados de geolocalização de motoristas — prazo 45 dias',
          detail: 'Autoridade Nacional de Proteção de Dados notificou Uber sobre retenção de dados de geolocalização por 5 anos além do prazo contratual. Política atual retinha dados para treinar modelos de ETA. Nova política: retenção máxima de 90 dias. Resposta em preparação.',
          badge: { label: 'Prazo 45 dias', type: 'warn' },
        },
      ],
    },
  ],
};
