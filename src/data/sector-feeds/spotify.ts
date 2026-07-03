import type { CompanySectorFeeds } from '../../types';

export const SPOTIFY_SECTOR_FEEDS: CompanySectorFeeds = {
  marketing: [
    {
      sectionTitle: 'Wrapped & Campanhas de Marca',
      cards: [
        {
          color: '#1db954',
          tag: 'WRAPPED',
          title: 'Spotify Wrapped 2025: 723 mi de compartilhamentos em 72h pós-lançamento',
          detail: 'Campanha anual gerou 723 mi de compartilhamentos em redes sociais — crescimento de 19% vs 2024. Países com maior engajamento: Brasil (1º), Índia (2º), EUA (3º). CPE (custo por engajamento) zero em orgânico. Investimento total em mídia paga de suporte: US$ 8,2 mi.',
          badge: { label: '723mi shares', type: 'ok' },
        },
        {
          color: '#1db954',
          tag: 'DISCOVER WEEKLY',
          title: 'Discover Weekly: 4,1 bi de playlists geradas/semana — retenção de 68%',
          detail: 'Algoritmo de recomendação personalizada mantém 68% dos ouvintes retornando semanalmente para a playlist. Usuários que consomem DW regularmente têm LTV 2,4x maior. Feature mencionada como principal motivo de permanência no plano Premium em pesquisa Q1/26.',
          badge: { label: 'Retenção 68%', type: 'ok' },
        },
        {
          color: '#1db954',
          tag: 'DAYLIST',
          title: 'Daylist ultrapassa 180 mi de usuários ativos — feature lançada há 14 meses',
          detail: 'Playlist dinâmica que muda ao longo do dia atingiu 180 mi de usuários ativos mensais. Taxa de compartilhamento orgânico: 22% dos ouvintes. Daylist contribui com 11% do tempo total de escuta na plataforma entre 8h e 18h.',
          badge: { label: '180mi usuários', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Podcasts & Joe Rogan',
      cards: [
        {
          color: '#1db954',
          tag: 'JOE ROGAN',
          title: 'The Joe Rogan Experience: 220 mi de downloads/mês — exclusividade renovada até 2027',
          detail: 'JRE mantém posição de podcast mais ouvido do mundo. Contrato de exclusividade renovado em dez/25 por US$ 250 mi por 2 anos. Episódios ficam no top 3 de charts em 38 países na semana de lançamento. Receita estimada de publicidade do JRE: US$ 80 mi/ano.',
          badge: { label: '220mi downloads', type: 'ok' },
        },
        {
          color: '#1db954',
          tag: 'PODCAST ADS',
          title: 'Receita de anúncios em podcasts: US$ 410 mi no Q1/26 — crescimento de 34%',
          detail: 'Streaming Ad Insertion (SAI) permite anúncios dinâmicos e mensuráveis em podcasts. CPM médio: US$ 24. Anunciantes top: Samsung, BetMGM, Airbnb, Audible. Crescimento de 34% YoY com expansão para 9 novos mercados em 2026.',
          badge: { label: '+34% YoY', type: 'ok' },
        },
        {
          color: '#1db954',
          tag: 'BRASIL PODCASTS',
          title: 'Brasil: 2º maior mercado de podcasts do mundo — 18,4 mi de ouvintes únicos/mês',
          detail: 'Podcasts brasileiros mais ouvidos no Spotify: Flow Podcast, Inteligência Ltda., Podpah. Crescimento de ouvintes no BR: +28% YoY. Parceria com Globo para distribuição exclusiva de podcasts jornalísticos assinada em fev/26.',
          badge: { label: '18,4mi ouvintes BR', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Planos & Aquisição',
      cards: [
        {
          color: '#1db954',
          tag: 'PREMIUM',
          title: 'Plano Individual Premium: US$ 11,99/mês — conversão freemium de 28,3%',
          detail: 'Taxa de conversão de usuário free para Premium atingiu 28,3% — melhor resultado histórico. Fator principal: restrição de shuffles ilimitados no free implementada em nov/25. ARPU Premium global: US$ 4,38/mês (média ponderada por mercado).',
          badge: { label: 'Conversão 28,3%', type: 'ok' },
        },
        {
          color: '#1db954',
          tag: 'FAMÍLIA & DUO',
          title: 'Plano Família (R$ 34,90/mês): adoção cresce 41% — foco em mercados emergentes',
          detail: 'Plano Família com até 6 contas é o mais vendido no Brasil. Plano Duo (R$ 24,90) tem crescimento de 22% em casais jovens. Campanha Q2/26 "Dois que ouvem juntos" terá influenciadores de casal no TikTok. Budget: R$ 3,2 mi.',
          badge: { label: '+41% Família', type: 'ok' },
        },
      ],
    },
  ],

  vendas: [
    {
      sectionTitle: 'MAU & Base Global',
      cards: [
        {
          color: '#1db954',
          tag: 'MAU',
          title: 'MAU global: 678 mi — meta 2026 é atingir 730 mi até dez/26',
          detail: 'Monthly Active Users cresceram 14% YoY. Regiões de maior crescimento: Ásia-Pacífico (+31%) e América Latina (+22%). Europa mantém-se estável com +6%. Meta anual de 730 mi exige adição líquida de 52 mi de usuários nos próximos 8 meses.',
          badge: { label: '678mi MAU', type: 'ok' },
        },
        {
          color: '#1db954',
          tag: 'PREMIUM',
          title: 'Assinantes Premium: 252 mi — meta Q4/26 é 270 mi',
          detail: 'Base paga cresceu 12% YoY. Brasil tem 18,4 mi de assinantes Premium — 4º maior mercado global. Gap de meta: 18 mi de novos assinantes em 8 meses. Principal alavanca: conversão de 180 mi de usuários free com 90+ dias de uso ativo.',
          badge: { label: '252mi Premium', type: 'info' },
        },
        {
          color: '#1db954',
          tag: 'CHURN',
          title: 'Churn mensal Premium: 4,2% — pico de 6,8% após remover plano estudantil gratuito',
          detail: 'Encerramento do benefício de 3 meses grátis para estudantes em jan/26 causou spike de churn em fev/26 (6,8%). Estabilização em 4,2% em abr/26. Ação de recuperação: oferta de retorno com 2 meses a 50% para churned dos últimos 90 dias.',
          badge: { label: 'Churn 4,2%', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Audiobooks & Novos Verticais',
      cards: [
        {
          color: '#1db954',
          tag: 'AUDIOBOOKS',
          title: 'Audiobooks: 15 horas/mês incluídas no Premium — 42 mi de ouvintes ativos',
          detail: 'Vertical de audiobooks lançada globalmente em 2024 tem 42 mi de ouvintes únicos mensais. Integração no plano Premium (sem custo extra) acelerou adoção. Parceria com Editora Companhia das Letras para catálogo BR: 1.200 títulos exclusivos.',
          badge: { label: '42mi ouvintes', type: 'ok' },
        },
        {
          color: '#1db954',
          tag: 'ARTIST MERCH',
          title: 'Spotify Merch: parceria com Shopify — US$ 28 mi em GMV no Q1/26',
          detail: 'Integração de loja de merchandising de artistas na página de perfil do Spotify via Shopify. GMV de US$ 28 mi no Q1/26. Artistas participantes: 8.400 globalmente, 320 no Brasil. Comissão Spotify: 5% do GMV. Oportunidade de expansão: shows e ingressos.',
          badge: { label: 'GMV US$28mi', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Publicidade & Free Tier',
      cards: [
        {
          color: '#1db954',
          tag: 'SPOTIFY ADS',
          title: 'Receita de publicidade: US$ 520 mi no Q1/26 — 18% da receita total',
          detail: 'Crescimento de 24% YoY em receita de anúncios. Formatos: áudio (58%), vídeo (28%), display (14%). Lançamento do Spotify Audience Network em mar/26 permite veicular anúncios em podcasts de terceiros. CPM médio áudio: US$ 12,80.',
          badge: { label: 'US$520mi', type: 'ok' },
        },
        {
          color: '#1db954',
          tag: 'BRASIL ADS',
          title: 'Brasil: mercado de mídia programática no Spotify cresce 48% YoY',
          detail: 'Spotify Ad Studio permite compra de mídia self-serve. PMEs brasileiras são 31% dos anunciantes locais. Campanha mínima: R$ 250. Setores que mais anunciam no BR: varejo (22%), telco (18%), alimentação (15%). Expansão do time comercial BR: +12 executivos em 2026.',
          badge: { label: '+48% YoY BR', type: 'ok' },
        },
      ],
    },
  ],

  financeiro: [
    {
      sectionTitle: 'Royalties & ECAD',
      cards: [
        {
          color: '#1db954',
          tag: 'ROYALTIES',
          title: 'Royalties pagos em 2025: US$ 9,8 bi — 70% da receita de streaming repassada',
          detail: 'Spotify distribuiu US$ 9,8 bi em royalties para gravadoras, distribuidoras e artistas em 2025. Divisão: major labels (Universal, Sony, Warner) recebem 52% do total. Artistas independentes via distribuidoras (DistroKid, TuneCore): 18%. Repasse mínimo por stream: US$ 0,003.',
          badge: { label: 'US$9,8bi pagos', type: 'info' },
        },
        {
          color: '#1db954',
          tag: 'ECAD',
          title: 'ECAD Brasil: acordo de licenciamento renovado — R$ 480 mi/ano em direitos autorais',
          detail: 'Contrato com ECAD (Escritório Central de Arrecadação e Distribuição) renovado em jan/26 por 3 anos. Valor: R$ 480 mi/ano, reajustado pelo IPCA. Inclui direitos de execução pública e streaming de repertório nacional e internacional administrado pelo ECAD.',
          badge: { label: 'R$480mi/ano', type: 'ok' },
        },
        {
          color: '#1db954',
          tag: 'GRAVADORAS',
          title: 'Renegociação com Sony Music — novo deal de licenciamento por 4 anos fechado em mar/26',
          detail: 'Acordo com Sony Music cobre catálogo de 4 mi de faixas. Termos: royalty rate de 52,5% sobre receita atribuída (era 54% no contrato anterior). Cláusula de most-favored-nation aplicada. Negociação com Universal Music prevista para jul/26 — contrato atual vence em set/26.',
          badge: { label: 'Sony 52,5%', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Receita & Margem',
      cards: [
        {
          color: '#1db954',
          tag: 'RECEITA',
          title: 'Receita Q1/26: US$ 4,19 bi — crescimento de 20% YoY; margem bruta de 31,6%',
          detail: 'Composição: Premium (82%), anúncios (18%). Margem bruta de 31,6% é recorde histórico — meta 2026 é 35%. Principal driver de margem: podcasts exclusivos amortizando contratos (JRE, Conan O\'Brien) e eficiência em royalties via deals diretos com artistas.',
          badge: { label: 'Margem 31,6%', type: 'ok' },
        },
        {
          color: '#1db954',
          tag: 'OPEX',
          title: 'OPEX Q1/26: US$ 1,1 bi — redução de 8% após reestruturação de dez/25',
          detail: 'Layoff de 1.500 funcionários em dez/25 (17% do headcount) reduziu OPEX em 8%. Principais cortes: divisão de podcasts/studios e equipe de marketing de marca global. Saving anualizado estimado: US$ 320 mi. Reinvestimento previsto em IA de recomendação.',
          badge: { label: 'OPEX -8%', type: 'ok' },
        },
        {
          color: '#1db954',
          tag: 'FCF',
          title: 'Free Cash Flow Q1/26: US$ 580 mi — primeiro FCF positivo consistente na história',
          detail: 'Spotify atingiu FCF positivo por 5 trimestres consecutivos. Caixa total: US$ 8,1 bi. Programa de recompra de ações de US$ 1 bi aprovado em fev/26. Guidance Q2/26: receita de US$ 4,4 bi e MAU de 692 mi.',
          badge: { label: 'FCF US$580mi', type: 'ok' },
        },
      ],
    },
  ],

  rh: [
    {
      sectionTitle: 'Headcount & Reestruturação',
      cards: [
        {
          color: '#1db954',
          tag: 'HEADCOUNT',
          title: '7.200 funcionários globais após layoff de dez/25 — redução de 17%',
          detail: 'Spotify encerrou 2025 com 7.200 funcionários (era 8.700 antes da reestruturação). Escritórios principais: Estocolmo, Nova York, Londres, São Paulo. Escritório de SP tem 380 funcionários — operações de mídia, vendas e engenharia para LATAM.',
          badge: { label: '7.200 globais', type: 'info' },
        },
        {
          color: '#1db954',
          tag: 'CONTRATAÇÃO',
          title: '95 vagas abertas em Q2/26 — foco em IA/ML e engenharia de plataforma',
          detail: 'Após freeze de contratação no Q1/26, retomada seletiva em abr/26. Prioridades: ML Engineers para Personalization (40 vagas), Backend Engineers em Estocolmo (30), Sales LATAM em SP (15), Data Scientists (10). Programa de estágio "Spotify Beat" com 80 vagas globais.',
          badge: { label: '95 vagas', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Cultura & Modelo de Trabalho',
      cards: [
        {
          color: '#1db954',
          tag: 'WORK FROM ANYWHERE',
          title: 'Work From Anywhere ativo: 74% dos funcionários trabalham fora do escritório principal',
          detail: 'Política WFA permite trabalhar de qualquer país onde o Spotify tem entidade legal. 74% dos funcionários não trabalham no escritório de referência. Encontros presenciais obrigatórios: 2 por trimestre. eNPS global: 66 — queda de 9 pontos após layoff.',
          badge: { label: 'eNPS 66', type: 'warn' },
        },
        {
          color: '#1db954',
          tag: 'DIVERSIDADE',
          title: 'Mulheres em tech: 32% — programa Amplify! acelera 60 líderes femininas em 2026',
          detail: 'Meta de 40% de mulheres em cargos técnicos até 2028. Gap atual: 8pp. Programa Amplify! oferece mentoria com executivas sêniores, acesso a conferências e rotação entre times. Parceria com Women Who Code para pipeline de talentos em 18 universidades.',
          badge: { label: '32% mulheres tech', type: 'info' },
        },
        {
          color: '#1db954',
          tag: 'BENEFÍCIOS',
          title: 'Benefício "Learning Fund": US$ 3.000/ano por funcionário — 61% de utilização',
          detail: 'Verba anual para cursos, conferências e livros. Utilização de 61% (meta: 75%). Cursos mais acessados: IA/ML no Coursera (28%), liderança (19%), design de produto (14%). Novo benefício 2026: subsídio de R$ 800/mês para coworking no BR.',
          badge: { label: '61% utilização', type: 'warn' },
        },
      ],
    },
  ],

  operacoes: [
    {
      sectionTitle: 'Infraestrutura & Streaming',
      cards: [
        {
          color: '#1db954',
          tag: 'CDN',
          title: 'CDN própria + Google Cloud: 99,98% de uptime — 620 petabytes de áudio',
          detail: 'Spotify opera rede híbrida: CDN proprietária para mercados core + Google Cloud Platform (GCP) para expansão. Catálogo total: 620 petabytes de áudio. Uptime de streaming: 99,98% no Q1/26. Latência de início de reprodução: P50 = 180ms, P99 = 420ms.',
          badge: { label: '99,98% uptime', type: 'ok' },
        },
        {
          color: '#1db954',
          tag: 'AI RECOMENDAÇÃO',
          title: 'Modelo de recomendação v7 lançado em mar/26 — CTR de playlists +22%',
          detail: 'Nova versão do algoritmo de recomendação (baseado em transformer + graph neural network) aumentou CTR de playlists automáticas em 22%. Treinamento com 4 bi de eventos de escuta/dia. Rollout gradual: 100% da base atingida em 3 semanas.',
          badge: { label: 'CTR +22%', type: 'ok' },
        },
        {
          color: '#1db954',
          tag: 'LICENCIAMENTO',
          title: 'Processamento de royalties: 180 bi de streams computados por mês',
          detail: 'Sistema de royalty accounting processa 180 bi de streams mensais para cálculo de repasses. Pipeline: captura de evento → deduplicação → atribuição de obra → cálculo de share. SLA de repasse às distribuidoras: D+45. Auditoria independente trimestral pela Deloitte.',
          badge: { label: '180bi streams', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Suporte & Moderação',
      cards: [
        {
          color: '#1db954',
          tag: 'SUPORTE',
          title: 'CSAT de suporte: 4,4/5 — 88% dos tickets resolvidos via self-service',
          detail: 'Central de ajuda resolve 88% dos problemas sem contato humano. Volume de tickets humanos: 1,8 mi/mês. Tempo médio de primeira resposta: 4,2h. Principal motivo de contato: problemas de pagamento (34%), acesso à conta (28%), qualidade de áudio (12%).',
          badge: { label: 'CSAT 4,4', type: 'ok' },
        },
        {
          color: '#1db954',
          tag: 'MODERAÇÃO',
          title: 'Conteúdo removido Q1/26: 142 mil faixas — desinformação e violação de direitos',
          detail: 'Política de moderação de conteúdo (atualizada jan/26) removeu 142 mil faixas. Motivos: violação de direitos autorais (61%), conteúdo de ódio (22%), desinformação em saúde (17%). Sistema automatizado de detecção cobre 95% dos casos — revisão humana nos 5% restantes.',
          badge: { label: '142k removidos', type: 'warn' },
        },
      ],
    },
  ],

  estoque: [
    {
      sectionTitle: 'Catálogo & Conteúdo',
      cards: [
        {
          color: '#1db954',
          tag: 'CATÁLOGO',
          title: '100 mi de faixas no catálogo — 120 mil novas músicas carregadas por dia',
          detail: 'Spotify ultrapassou 100 mi de faixas em fev/26. Média de 120 mil uploads diários via distribuidoras e artistas independentes. Distribuição: música (78%), podcasts (18%), audiobooks (4%). Catálogo exclusivo (licenças únicas): 2,3 mi de faixas.',
          badge: { label: '100mi faixas', type: 'ok' },
        },
        {
          color: '#1db954',
          tag: 'PODCASTS EXCLUSIVOS',
          title: 'Portfólio de 28 podcasts exclusivos — investimento acumulado de US$ 1,2 bi',
          detail: 'Contratos exclusivos incluem JRE (US$ 250mi), Call Her Daddy, Armchair Expert, SmartLess. ROI direto em retenção: usuários que consomem exclusivos têm churn 38% menor. Revisão de portfólio: 6 títulos não renovados em 2025 por baixa audiência.',
          badge: { label: '28 exclusivos', type: 'info' },
        },
        {
          color: '#1db954',
          tag: 'ARTISTAS DIRETOS',
          title: 'Spotify for Artists: 9,8 mi de artistas ativos — 1,2 mi com +50 ouvintes/mês',
          detail: 'Plataforma de gestão para artistas tem 9,8 mi de perfis ativos. Artistas com acesso a dados detalhados de audiência, pitch para playlists e monetização: 1,2 mi. Ferramenta AI Songwriter (beta) permite co-criação de letras — 340 mil usuários em teste.',
          badge: { label: '9,8mi artistas', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Playlists & Curadoria',
      cards: [
        {
          color: '#1db954',
          tag: 'EDITORIAL',
          title: '5.000 playlists editoriais ativas — equipe de 180 curadores em 40 países',
          detail: 'Playlists editoriais (ex: RapCaviar, Today\'s Top Hits, Hot Hits Brasil) têm 180 curadores globais. RapCaviar: 14,8 mi de seguidores — maior playlist hip-hop do mundo. Hot Hits Brasil: 6,2 mi de seguidores. Inclusão em playlist editorial aumenta streams do artista em média 340%.',
          badge: { label: '5.000 playlists', type: 'info' },
        },
        {
          color: '#1db954',
          tag: 'AI PLAYLISTS',
          title: 'AI Playlist (gerada por prompt): 48 mi de criações em 2 meses de beta',
          detail: 'Feature de criação de playlist via linguagem natural lançada em fev/26 (beta global). Usuário digita prompt ("músicas para academia anos 2000 com batida forte") e IA gera lista. 48 mi de playlists criadas nos primeiros 2 meses. Aprovação: 4,6/5 na pesquisa in-app.',
          badge: { label: '48mi criadas', type: 'ok' },
        },
      ],
    },
  ],

  juridico: [
    {
      sectionTitle: 'Licenciamento & Direitos Autorais',
      cards: [
        {
          color: '#1db954',
          tag: 'LICENCIAMENTO BR',
          title: 'ABRAMUS e UBC: contratos de licenciamento coletivo vigentes até dez/27',
          detail: 'Licenças com ABRAMUS (Associação Brasileira de Música e Artes) e UBC (União Brasileira de Compositores) cobertas por acordo coletivo com ECAD. Valor consolidado: R$ 480 mi/ano. Processos de fiscalização do ECAD: 2 auditorias abertas referentes a 2023 e 2024.',
          badge: { label: '2 auditorias ECAD', type: 'warn' },
        },
        {
          color: '#1db954',
          tag: 'UMG',
          title: 'Universal Music Group: contrato vence em set/26 — negociação iniciada em abr/26',
          detail: 'UMG representa 32% do catálogo streamado no Spotify globalmente. Contrato atual: royalty rate de 53,8%. UMG pediu revisão para 56% + participação nos lucros de podcasts. Gap de negociação estimado em US$ 180 mi/ano. Deadline: 90 dias antes do vencimento (jun/26).',
          badge: { label: 'Vence set/26', type: 'warn' },
        },
        {
          color: '#1db954',
          tag: 'SONGWRITERS',
          title: 'Processo de compositores nos EUA: US$ 150 mi em disputa de royalties mecânicos',
          detail: 'Coalizão de compositores (National Music Publishers Association) aciona Spotify por subdeclaração de streams para cálculo de royalties mecânicos entre 2016 e 2020. Valor em disputa: US$ 150 mi. Spotify provisiona US$ 80 mi. Julgamento previsto para Q3/26.',
          badge: { label: 'US$150mi disputa', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Regulatório & Privacidade',
      cards: [
        {
          color: '#1db954',
          tag: 'GDPR',
          title: 'DPC Irlanda: investigação GDPR sobre dados de menores — prazo de resposta jun/26',
          detail: 'Data Protection Commission irlandesa abriu investigação em mar/26 sobre coleta de dados comportamentais de usuários menores de 18 anos. Spotify tem até jun/26 para apresentar defesa técnica. Multa potencial: até 4% da receita global (US$ 200 mi). DPO mobilizado com escritório Fieldfisher.',
          badge: { label: 'Investigação GDPR', type: 'warn' },
        },
        {
          color: '#1db954',
          tag: 'ANPD',
          title: 'ANPD BR: adequação à LGPD — 3 políticas internas atualizadas em Q1/26',
          detail: 'Atualização de políticas de privacidade, consentimento de dados de recomendação e política de retenção de dados de áudio. DPO Brasil designado em jan/26 (cargo novo). Treinamento de LGPD para 380 funcionários do escritório SP concluído. Próxima auditoria interna: jul/26.',
          badge: { label: 'LGPD atualizada', type: 'ok' },
        },
        {
          color: '#1db954',
          tag: 'ANTITRUSTE',
          title: 'Apple App Store: vitória parcial — Spotify isento de comissão em 32 países da UE',
          detail: 'Decisão da Comissão Europeia em jan/26 obriga Apple a isentar apps de streaming de música da comissão de 27% em compras de assinatura em 32 países. Impacto positivo: saving de US$ 160 mi/ano em comissões. Implementação técnica prevista para jun/26.',
          badge: { label: 'Saving US$160mi', type: 'ok' },
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
