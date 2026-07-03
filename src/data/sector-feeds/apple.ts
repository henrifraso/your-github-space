import type { CompanySectorFeeds } from '../../types';

export const APPLE_SECTOR_FEEDS: CompanySectorFeeds = {
  marketing: [
    {
      sectionTitle: 'iPhone & Hardware',
      cards: [
        {
          color: '#6e6e73',
          tag: 'IPHONE',
          title: 'iPhone 16 sell-through: 82 mi de unidades no ciclo de lançamento — recorde em China',
          detail: 'Ciclo de lançamento do iPhone 16 (set-dez/25) vendeu 82 mi de unidades, alta de 4% vs iPhone 15. China foi destaque: 19,4 mi de unidades, impulsionada por Apple Intelligence localizado em mandarim. Modelos Pro representaram 47% do mix — maior share Pro da história.',
          badge: { label: '82mi unidades', type: 'ok' },
        },
        {
          color: '#6e6e73',
          tag: 'TRADE-IN',
          title: 'Apple Trade-in: 38% das compras de iPhone incluem troca — valor médio US$ 312',
          detail: 'Programa de trade-in gera 38% das vendas de iPhone com valor de troca médio de US$ 312. Dispositivos recebidos: 42 mi/ano — 78% revendidos como certified refurbished, 22% desmontados pela Daisy (robô de reciclagem). Receita de refurb: US$ 2,8 bi/ano.',
          badge: { label: 'US$312 médio', type: 'info' },
        },
        {
          color: '#6e6e73',
          tag: 'MAC',
          title: 'Mac com Apple Silicon: 96% das unidades vendidas — M4 lidera em criadores',
          detail: 'Linha Mac migrou 96% das vendas para Apple Silicon. MacBook Pro M4 Pro (16") é o produto mais vendido entre criadores de conteúdo e desenvolvedores. Participação de mercado Mac em PCs premium (acima de US$ 1.500): 42% globalmente.',
          badge: { label: '96% Silicon', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Serviços & Ecossistema',
      cards: [
        {
          color: '#6e6e73',
          tag: 'APPLE TV+',
          title: 'Apple TV+: 75 mi de assinantes — "Silo S3" foi o conteúdo mais assistido da história',
          detail: 'Base de assinantes TV+ cresceu 22% YoY. Temporada 3 de Silo (out/25) bateu recorde de audiência da plataforma. Budget de conteúdo original 2026: US$ 8,5 bi. Custo de assinatura BR: R$ 21,90/mês. Bundled em 68% dos planos Apple One.',
          badge: { label: '75mi assinantes', type: 'ok' },
        },
        {
          color: '#6e6e73',
          tag: 'APPLE MUSIC',
          title: 'Apple Music: 98 mi de assinantes — integração com Apple Intelligence aumenta engajamento 19%',
          detail: 'Plataforma de streaming musical atingiu 98 mi de assinantes após parceria de distribuição com operadoras. Apple Intelligence personaliza playlists com base em contexto do calendário e localização. Engajamento semanal aumentou 19% após feature em out/25.',
          badge: { label: '98mi assinantes', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Apple Intelligence & Campanha',
      cards: [
        {
          color: '#6e6e73',
          tag: 'AI MARKETING',
          title: '"Your iPhone just got smarter" — campanha Apple Intelligence em 68 países',
          detail: 'Campanha de Apple Intelligence em TV, OOH e digital atingiu 68 países com adaptações locais. EUA e Japão receberam maior investimento. NPS de percepção de marca após campanha subiu 8 pontos. Principal mensagem: privacidade + inteligência on-device.',
        },
        {
          color: '#6e6e73',
          tag: 'VISIONPRO',
          title: 'Apple Vision Pro: 780 mil unidades vendidas — developer adoption cresce 210%',
          detail: 'Vision Pro atingiu 780 mil unidades acumuladas (lan set/24–abr/26). Apps nativos visionOS na App Store: 2.800, crescimento de 210% YoY. Enterprise adoption (saúde, arquitetura, treinamento) cresce mais que consumer. Versão 2 com preço reduzido planejada para 2027.',
          badge: { label: '780k unidades', type: 'info' },
        },
        {
          color: '#6e6e73',
          tag: 'ICLOUD',
          title: 'iCloud+: 1,1 bi de usuários pagos — maior nível de conversão freemium-pago do setor',
          detail: 'iCloud passou de 5 GB gratuitos em 2011 e hoje converte 28% dos usuários para planos pagos (R$ 3,90 a R$ 37,90/mês no BR). ARPU de iCloud BR: R$ 9,20/mês. Crescimento de usuários iCloud+ 50 GB: +34% YoY — plano mais popular.',
          badge: { label: '1,1bi usuários', type: 'ok' },
        },
      ],
    },
  ],

  vendas: [
    {
      sectionTitle: 'App Store & Receita Digital',
      cards: [
        {
          color: '#6e6e73',
          tag: 'APP STORE',
          title: 'App Store: US$ 109 bi de GMV no FY25 — comissão Apple: US$ 25 bi',
          detail: 'Gross merchandise value da App Store cresceu 14% no FY25. Comissão média efetiva: 23% (17% pequenos devs, 30% grandes publishers). Jogos representam 69% do GMV. Mudanças após decisão Epic Games reduzem take rate em US$ 820 mi/ano estimados.',
          badge: { label: 'GMV US$109bi', type: 'ok' },
        },
        {
          color: '#6e6e73',
          tag: 'SERVIÇOS',
          title: 'Receita de Serviços Q1/26: US$ 26,3 bi — margem de 74,6% (vs 36% hardware)',
          detail: 'Segmento de serviços (App Store, iCloud, Apple Pay, Licensing, AppleCare, Apple TV+, Music) registrou US$ 26,3 bi no Q1/26, com margem bruta de 74,6%. Meta CEO Tim Cook: Services ultrapassará hardware em receita até FY28.',
          badge: { label: 'Margem 74,6%', type: 'ok' },
        },
        {
          color: '#6e6e73',
          tag: 'APPLE PAY',
          title: 'Apple Pay: 6,4 bi de transações/mês — share de 8% do e-commerce global',
          detail: 'Volume mensal de transações Apple Pay cresceu 31% YoY. Em mercados como UK e Austrália, Apple Pay representa 32% e 28% das compras mobile, respectivamente. Brasil: 4,2% de share, limitado por não integração com Pix. Negociação com BACEN em andamento.',
          badge: { label: '6,4bi transações', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Canal & Distribuição',
      cards: [
        {
          color: '#6e6e73',
          tag: 'RETAIL',
          title: '542 Apple Stores em 26 países — receita por m² de US$ 62.000/ano (recorde varejista)',
          detail: 'Rede de lojas próprias gera receita por metro quadrado de US$ 62.000/ano, maior do setor varejista global. Cinco Stores abertas no Q1/26: Mumbai (2ª), Delhi, Singapura (expansão), Melbourne e Toronto. Próximas: Bogotá e Santiago (2027).',
          badge: { label: 'US$62k/m²', type: 'ok' },
        },
        {
          color: '#6e6e73',
          tag: 'OPERADORAS',
          title: 'Canal de operadoras: 62% das vendas de iPhone — Vivo e Claro lideram no BR',
          detail: 'Maioria das vendas de iPhone passa por operadoras via subsídio. No Brasil, Vivo responde por 34% e Claro por 28% das vendas com plano. Comissão de canal: 8-12% dependendo do mercado. Pressão de operadoras por maior participação no serviço de Apple TV+.',
        },
      ],
    },
    {
      sectionTitle: 'Mercados Emergentes',
      cards: [
        {
          color: '#6e6e73',
          tag: 'INDIA',
          title: 'Índia: 12,4 mi de iPhones vendidos no FY25 — crescimento de 28%, maior mercado emergente',
          detail: 'Índia tornou-se o 4º maior mercado de iPhone. Fabricação local (Foxconn Chennai, Tata Electronics Hosur) cobre 18% do volume global de iPhone. Plano de expansão: 30% de produção global na Índia até 2027, reduzindo dependência de China.',
          badge: { label: '28% crescimento', type: 'ok' },
        },
        {
          color: '#6e6e73',
          tag: 'BRASIL',
          title: 'Brasil: 4,8 mi de iPhones no FY25 — imposto de importação eleva preço 42% vs EUA',
          detail: 'Mercado brasileiro vendeu 4,8 mi de unidades apesar do alto custo fiscal. iPhone 16 128GB custa R$ 7.299 no BR vs US$ 799 nos EUA — diferença de 42% mesmo em PPP ajustado. iPhone 16e (US$ 599) vira foco de expansão de volume em países emergentes.',
          badge: { label: '4,8mi unidades', type: 'info' },
        },
      ],
    },
  ],

  financeiro: [
    {
      sectionTitle: 'Resultados Consolidados',
      cards: [
        {
          color: '#6e6e73',
          tag: 'RECEITA',
          title: 'Receita FY25: US$ 412 bi — lucro líquido US$ 106 bi; maior lucratividade corporativa global',
          detail: 'Apple encerrou FY25 (set/25) com receita de US$ 412 bi e lucro líquido de US$ 106 bi, mantendo posição de empresa mais lucrativa do mundo. EPS: US$ 7,02 (+11% YoY). ROIC de 163% reflete modelo asset-light em serviços.',
          badge: { label: 'Lucro US$106bi', type: 'ok' },
        },
        {
          color: '#6e6e73',
          tag: 'CAIXA',
          title: 'Caixa líquido: US$ 51 bi — recompra de ações de US$ 110 bi em FY25',
          detail: 'Apple executou US$ 110 bi em recompras e pagou US$ 15,2 bi em dividendos no FY25. Caixa bruto: US$ 164 bi; dívida de longo prazo: US$ 113 bi. Estratégia de retorno a acionistas supera CAPEX de US$ 10,8 bi no mesmo período.',
          badge: { label: 'US$110bi recompra', type: 'ok' },
        },
        {
          color: '#6e6e73',
          tag: 'CHINA RISCO',
          title: 'China: 22% da receita global — risco de retaliação comercial EUA-China em escalada',
          detail: 'Receita na Grande China (China continental + HK + Taiwan) totaliza US$ 91 bi/ano. Tarifas de retaliação de 30% sobre produtos eletrônicos americanos em discussão no parlamento chinês afetariam revenda de Apple na China. Impacto estimado: -US$ 18 bi de receita.',
          badge: { label: 'Risco tarifário', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Investimentos & P&D',
      cards: [
        {
          color: '#6e6e73',
          tag: 'P&D',
          title: 'Investimento em P&D FY25: US$ 31,4 bi — maior da história da empresa',
          detail: 'Gasto com pesquisa e desenvolvimento cresceu 14% YoY, concentrado em Apple Intelligence (LLMs on-device), chips Apple Silicon M-series, Apple Vision Pro e veículo autônomo (Projeto Titan reformulado). Equipe de P&D: 34.000 engenheiros.',
          badge: { label: 'US$31,4bi P&D', type: 'info' },
        },
        {
          color: '#6e6e73',
          tag: 'AI CAPEX',
          title: 'Servidores Apple Intelligence: US$ 4 bi investidos em infra — nuvem privada vs AWS/Azure',
          detail: 'Apple Intelligence usa Private Cloud Compute: servidores Apple Silicon M2 Ultra em datacenters próprios. Investimento de US$ 4 bi em 2025 para escalar infraestrutura. Estratégia: processamento on-device (90% dos requests) + nuvem privada (10%), sem compartilhar dados com terceiros.',
          badge: { label: 'US$4bi infra AI', type: 'info' },
        },
      ],
    },
  ],

  rh: [
    {
      sectionTitle: 'Força de Trabalho',
      cards: [
        {
          color: '#6e6e73',
          tag: 'HEADCOUNT',
          title: '164.000 colaboradores globais — Silicon Valley concentra 38.000 (23%)',
          detail: 'Apple mantém 164.000 funcionários diretos. Cupertino e Silicon Valley: 38.000. Austin TX: 12.000 (campus de US$ 1 bi inaugurado em 2022). Irlanda (EMEA HQ): 6.800. Crescimento líquido no FY25: +2.400 vagas — foco em ML/AI engineers.',
          badge: { label: '164k globais', type: 'info' },
        },
        {
          color: '#6e6e73',
          tag: 'RETENÇÃO',
          title: 'Turnover voluntário: 4,8% — abaixo da média Silicon Valley (12,3%) pelo 6º ano',
          detail: 'Apple mantém a menor taxa de turnover do setor tech. Fatores: RSUs com vesting de 4 anos, cultura de longo prazo e missão de produto. Salary survey interno: engenheiro sênior ML ganha US$ 340-420k total comp. Listas Glassdoor Top 25 Employer por 11 anos consecutivos.',
          badge: { label: 'Turnover 4,8%', type: 'ok' },
        },
        {
          color: '#6e6e73',
          tag: 'RTO',
          title: 'Return-to-office: política híbrida 3 dias/semana — resistência em equipes de software',
          detail: 'Política de presença obrigatória 3x/semana (ter, qua, qui) desde set/22 gerou petição interna assinada por 2.800 engenheiros. Turnover elevado em 2022-23 após anúncio foi parcialmente atribuído ao RTO. Exceções para equipes distribuídas (ML, privacidade) mantidas.',
          badge: { label: '3 dias RTO', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Diversidade & Cultura',
      cards: [
        {
          color: '#6e6e73',
          tag: 'DEI',
          title: 'Mulheres em liderança: 35% — metas DEI revisadas após pressão de shareholders conservadores',
          detail: 'Percentual de mulheres em posições de VP+ chegou a 35% — progresso de 4pp em 3 anos. Em 2025, shareholders aprovaram proposta para rever metas de DEI com 53% dos votos, tornando Apple a 1ª Big Tech a ceder à pressão. Programas mantidos, mas metas se tornaram recomendações.',
          badge: { label: '35% liderança', type: 'info' },
        },
        {
          color: '#6e6e73',
          tag: 'SILICON VALLEY',
          title: 'Salary benchmark Q1/26: ML Engineer L6 = US$ 380k total comp — acima do Google e Meta',
          detail: 'Análise de levels.fyi confirma Apple pagando acima de mercado para papéis críticos em AI. L6 ML Engineer (senior staff): US$ 200k base + US$ 140k RSU/ano + US$ 40k bônus. Recrutamento agressivo de ex-Google Brain, DeepMind e OpenAI — 180 contratações em AI desde jan/26.',
          badge: { label: 'US$380k L6', type: 'info' },
        },
      ],
    },
  ],

  operacoes: [
    {
      sectionTitle: 'Supply Chain Global',
      cards: [
        {
          color: '#6e6e73',
          tag: 'TSMC',
          title: 'TSMC N3E: 100% da produção de chips A18 e M4 — dependência crítica de Taiwan',
          detail: 'Apple é cliente exclusivo da TSMC no processo N3E (3nm). Chips A18 Pro (iPhone 16 Pro) e M4 (iPad/Mac) produzidos 100% em Hsinchu e Tainan. Risco geopolítico Estreito de Taiwan exige plano de contingência — investimento de US$ 430 mi na TSMC Arizona (N4 process).',
          badge: { label: '100% TSMC N3E', type: 'warn' },
        },
        {
          color: '#6e6e73',
          tag: 'FOXCONN',
          title: 'Foxconn Zhengzhou: 200 mil trabalhadores — 68% do volume de iPhone montado',
          detail: 'Maior fábrica da Apple (iPhone City) emprega 200 mil pessoas. Concentra 68% da montagem global de iPhone. Evento de out/22 (protestos de trabalhadores) causou deficit de 6 mi de unidades no Q4/22. Plano de diversificação: reduzir para 55% até 2028.',
          badge: { label: '68% volume', type: 'warn' },
        },
        {
          color: '#6e6e73',
          tag: 'SAMSUNG DISPLAY',
          title: 'Samsung Display: fornece 60% das telas OLED do iPhone — LG Display complementa 40%',
          detail: 'Apple depende de Samsung Display para os painéis OLED dos modelos iPhone 16/16 Pro. LG Display fornece os 40% restantes — relação de dual-sourcing estabelecida em 2020. BOE (China) aprovada como 3º fornecedor para modelos base em 2026, reduzindo custo em 8%.',
          badge: { label: 'BOE aprovada', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Logística & Qualidade',
      cards: [
        {
          color: '#6e6e73',
          tag: 'LOGÍSTICA',
          title: 'Apple Store: 99,2% de disponibilidade de produto no dia do lançamento — mínimo histórico 96%',
          detail: 'Operação de lançamento do iPhone 16 manteve 99,2% de disponibilidade de SKUs nos 542 Apple Stores no Dia 1 — acima do mínimo histórico de 96% (iPhone 12 em 2020, afetado pela pandemia). Tempo médio de reposição de estoque pós-lançamento: 8 dias.',
          badge: { label: '99,2% disponível', type: 'ok' },
        },
        {
          color: '#6e6e73',
          tag: 'QUALIDADE',
          title: 'Taxa de retorno de produto: 0,8% — DSAT acima de 4,2/5 em 94% dos modelos',
          detail: 'Apple mantém taxa de retorno por defeito em 0,8% — benchmark da indústria: 2-3%. Satisfaction score de produto (DSAT) acima de 4,2/5 em 94% dos SKUs ativos. Único modelo com DSAT <4,0: Apple Vision Pro (3,8 — principalmente por ergonomia de uso prolongado).',
          badge: { label: '0,8% retorno', type: 'ok' },
        },
      ],
    },
  ],

  estoque: [
    {
      sectionTitle: 'Gestão de Componentes',
      cards: [
        {
          color: '#6e6e73',
          tag: 'CHIPS',
          title: 'Estoque de chips A18: 38 mi de unidades — cobertura de 14 semanas de produção',
          detail: 'Apple mantém estoque estratégico de 38 mi de chips A18/A18 Pro, cobertura equivalente a 14 semanas de produção no ritmo atual. Política pós-crise de semicondutores 2021: mínimo de 12 semanas de cobertura para chips críticos. Custo do estoque de chips: US$ 9,2 bi.',
          badge: { label: '14 sem. cobertura', type: 'ok' },
        },
        {
          color: '#6e6e73',
          tag: 'MEMÓRIA',
          title: 'NAND Flash: dual-sourcing Samsung + Kioxia — risco de concentração em 38%',
          detail: 'Memória NAND Flash (armazenamento interno) vem de Samsung (38%), Kioxia (34%), SK Hynix (28%). Aumento de demanda por modelos Pro com 512GB e 1TB pressiona fornecimento de NAND 3D. Negociação de contrato plurianual com Kioxia em andamento — +R$ 400 mi/ano.',
          badge: { label: 'Dual-source ativo', type: 'ok' },
        },
        {
          color: '#6e6e73',
          tag: 'DISPLAYS',
          title: 'Display OLED Pro Motion (120Hz): alocação de 48 mi de unidades para FY26',
          detail: 'Painéis ProMotion LTPO OLED alocados em 48 mi de unidades para os modelos iPhone 17 Pro/Pro Max. Samsung Display: 28 mi; LG Display: 20 mi. Custo por painel Pro: US$ 82 vs US$ 48 do modelo padrão. Margem bruta de modelos Pro: 52% vs 38% dos base.',
          badge: { label: '48mi alocados', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Refurbished & Sustentabilidade',
      cards: [
        {
          color: '#6e6e73',
          tag: 'REFURB',
          title: 'Apple Certified Refurbished: 8,4 mi de unidades revendidas em FY25 — margem 44%',
          detail: 'Programa de refurbished revendeu 8,4 mi de produtos certificados no FY25, com margem bruta de 44% — superior à margem de hardware novo (38%). Principal mercado: Índia e Brasil (preço 30% abaixo do novo). Ciclo: trade-in → teste → remanufatura → revenda em 21 dias.',
          badge: { label: 'Margem 44%', type: 'ok' },
        },
        {
          color: '#6e6e73',
          tag: 'DAISY',
          title: 'Robô Daisy: desmonta 1,2 mi de iPhones/ano — recupera 14 minerais críticos',
          detail: 'Segunda geração do robô de desmontagem Daisy opera em 4 fábricas (EUA, NL, BR, AU). Processa 1,2 mi de iPhones/ano — recupera lítio, cobalto, tungstênio, terras raras e 11 outros minerais. Apple afirma que 22% do alumínio usado em produtos FY25 veio de reciclagem.',
          badge: { label: '1,2mi/ano', type: 'info' },
        },
      ],
    },
  ],

  juridico: [
    {
      sectionTitle: 'Antitruste & Regulação',
      cards: [
        {
          color: '#6e6e73',
          tag: 'CADE',
          title: 'CADE: investigação de App Store BR aberta em fev/26 — foco em comissões e sideloading',
          detail: 'Conselho Administrativo de Defesa Econômica abriu inquérito sobre práticas da App Store no Brasil. Pontos investigados: comissão de 30% considerada abusiva, proibição de sideloading e condições de pagamento. Prazo de resposta Fase 1: 60 dias. Multa potencial: até 20% da receita BR.',
          badge: { label: 'Inquérito aberto', type: 'warn' },
        },
        {
          color: '#6e6e73',
          tag: 'DMA',
          title: 'Digital Markets Act (UE): Apple multada em € 500 mi — sideloading exigido no iOS',
          detail: 'Comissão Europeia multou Apple em € 500 mi por descumprimento do DMA em mar/26. Apple obrigada a permitir lojas de apps alternativas no iOS na UE. Implementação via "Core Technology Fee" de € 0,50/install (>1mi instalações) gerou nova investigação por "compliance malicioso".',
          badge: { label: '€500mi multa', type: 'warn' },
        },
        {
          color: '#6e6e73',
          tag: 'DOJ EUA',
          title: 'DOJ processa Apple por monopólio de smartphones — julgamento previsto para 2027',
          detail: 'Processo antitruste do Departamento de Justiça dos EUA (mar/24) acusa Apple de monopolizar mercado de smartphones via ecossistema fechado. Argumentos: bloqueio de iMessage no Android, restrições ao Apple Watch e controles de App Store. Julgamento de mérito previsto para Q2/27.',
          badge: { label: 'Julgamento 2027', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Privacidade & ATT',
      cards: [
        {
          color: '#6e6e73',
          tag: 'ATT',
          title: 'App Tracking Transparency: 35% de opt-in global — Meta perdeu US$ 12 bi de receita',
          detail: 'App Tracking Transparency (iOS 14.5+) reduziu rastreamento cross-app. Taxa de opt-in global estável em 35% — EUA: 28%, Europa: 21%, Brasil: 41%. Meta estimou perda de US$ 12 bi de receita em 2022 atribuída ao ATT. CNIL francesa investigou se Apple aplica ATT de forma isonômica à si própria.',
          badge: { label: '35% opt-in', type: 'info' },
        },
        {
          color: '#6e6e73',
          tag: 'PRIVATE RELAY',
          title: 'iCloud Private Relay: 62 mi de usuários — bloqueado em China, Rússia e Bielorrússia',
          detail: 'Serviço de relay de tráfego (VPN-like) integrado ao iCloud+ tem 62 mi de usuários ativos. Bloqueado por reguladores em China, Rússia, Bielorrússia e Arábia Saudita. Apple retirou o serviço nesses mercados sem notificação prévia a usuários, gerando crítica de grupos de direitos digitais.',
          badge: { label: '62mi usuários', type: 'info' },
        },
        {
          color: '#6e6e73',
          tag: 'PATENTES',
          title: 'Disputa Qualcomm: acordo renovado até 2027 — royalty US$ 7,50/chip 5G',
          detail: 'Acordo de licenciamento de patentes com Qualcomm renovado em jan/26 por mais 3 anos. Royalty fixo de US$ 7,50 por chip 5G (estimativa analistas). Apple continua desenvolvendo modem 5G próprio (Projeto Ganymede) — previsto para iPhone 18 (2026). Economias projetadas: US$ 1,4 bi/ano pós-modem próprio.',
          badge: { label: 'Acordo até 2027', type: 'info' },
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
