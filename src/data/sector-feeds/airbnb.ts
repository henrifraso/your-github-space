import type { CompanySectorFeeds } from '../../types';

export const AIRBNB_SECTOR_FEEDS: CompanySectorFeeds = {
  marketing: [
    {
      sectionTitle: 'Sazonalidade & Campanhas',
      cards: [
        {
          color: '#ff5a5f',
          tag: 'CARNAVAL',
          title: 'Carnaval 2026: GBV de R$ 1,84 bi no Brasil — 92% das listagens no RJ/BA esgotadas',
          detail: 'Maior Carnaval da história do Airbnb no Brasil em volume transacionado. Rio de Janeiro e Salvador com 92% de ocupação em acomodações listadas. Diária média no RJ durante Carnaval: R$ 980. Campanha "Viva o Bloco" atingiu 48 mi de impressões no Instagram e TikTok.',
          badge: { label: 'GBV R$1,84bi', type: 'ok' },
        },
        {
          color: '#ff5a5f',
          tag: 'VERÃO',
          title: 'Verão 2025/26: receita de hospedagem no Litoral SP sobe 38% vs ano anterior',
          detail: 'Temporada de verão concentrada em dez/25 a fev/26. Destinos mais reservados no BR: Florianópolis, Ilhabela, Trancoso, Jericoacoara. Diária média na temporada: R$ 720. Campanha "Mais Perto do Paraíso" com influenciadores de viagem gerou ROAS de 4,2x.',
          badge: { label: '+38% receita', type: 'ok' },
        },
        {
          color: '#ff5a5f',
          tag: 'BRAND',
          title: '"Made Possible by Hosts": campanha global — 1,4 bi de impressões em Q1/26',
          detail: 'Campanha de marca focada em histórias reais de hosts atingiu 1,4 bi de impressões globais. Custo total: US$ 42 mi. Lift de brand consideration: +11pp em mercados-foco. Versão Brasil ("Feito Possível por Anfitriões") com testimoniais de hosts do Nordeste.',
          badge: { label: '1,4bi impressões', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Experiências & Diferenciação',
      cards: [
        {
          color: '#ff5a5f',
          tag: 'EXPERIÊNCIAS',
          title: 'Airbnb Experiences: 320 mi de reservas acumuladas — Brasil tem 4.200 experiências ativas',
          detail: 'Vertical de experiências (tours, aulas, vivências) tem 4.200 experiências ativas no Brasil. Mais reservadas no BR: aula de capoeira em Salvador, surfe em Florianópolis, cerâmica no Rio. Take rate médio: 20%. Receita de Experiences BR em 2025: R$ 48 mi.',
          badge: { label: '4.200 no BR', type: 'info' },
        },
        {
          color: '#ff5a5f',
          tag: 'ROOMS',
          title: 'Airbnb Rooms (quarto em casa do host): 1,8 mi de listagens reativadas em 2025',
          detail: 'Relançamento do produto Rooms (onde o host divide a casa com o hóspede) recuperou vertical que havia perdido tração. 1,8 mi de listagens ativas globalmente. Preço médio 62% menor que hospedagem inteira. Alvo: viajantes solo e backpackers com budget restrito.',
          badge: { label: '1,8mi listagens', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Aquisição & Performance',
      cards: [
        {
          color: '#ff5a5f',
          tag: 'SEO',
          title: 'Tráfego orgânico: 62% das visitas ao site — redução de dependência de Google Ads',
          detail: 'Airbnb reduziu investimento em Google Hotel Ads em 2022 e manteve estratégia de SEO e brand. Em Q1/26, 62% do tráfego é orgânico/direto. CPA de aquisição via orgânico: US$ 8 vs US$ 68 em mídia paga. Saving anualizado estimado: US$ 280 mi.',
          badge: { label: '62% orgânico', type: 'ok' },
        },
        {
          color: '#ff5a5f',
          tag: 'APP',
          title: 'App Airbnb: 4,8 estrelas no Brasil — 68% das reservas feitas via mobile',
          detail: 'Aplicativo com rating 4,8 na App Store e 4,7 no Google Play no Brasil. 68% das reservas concluídas via mobile — crescimento de 8pp em 12 meses. Feature "Explore por mapa" tem taxa de conversão 31% maior que busca por lista. Retenção D30 do app: 44%.',
          badge: { label: '68% mobile', type: 'ok' },
        },
      ],
    },
  ],

  vendas: [
    {
      sectionTitle: 'GBV & Reservas',
      cards: [
        {
          color: '#ff5a5f',
          tag: 'GBV GLOBAL',
          title: 'GBV Q1/26: US$ 24,2 bi — crescimento de 12% YoY; noites reservadas: 143 mi',
          detail: 'Gross Booking Value de US$ 24,2 bi no Q1/26 com 143 mi de noites reservadas. ADR (Average Daily Rate) global: US$ 169. Receita líquida (take rate médio de 14,2%): US$ 3,4 bi. Crescimento desacelerado vs Q1/25 (+18%) reflete maturação nos mercados core da Europa e EUA.',
          badge: { label: 'GBV US$24,2bi', type: 'ok' },
        },
        {
          color: '#ff5a5f',
          tag: 'BRASIL GBV',
          title: 'GBV Brasil: R$ 6,8 bi em 2025 — maior crescimento da LATAM (+31% YoY)',
          detail: 'Brasil é o 5º maior mercado do Airbnb globalmente em GBV. Crescimento de 31% YoY impulsionado por Carnaval, verão e expansão de estadias longas. Número de hóspedes únicos no BR: 8,4 mi em 2025. Top destinos: Rio de Janeiro, Florianópolis, São Paulo, Salvador, Trancoso.',
          badge: { label: '+31% YoY', type: 'ok' },
        },
        {
          color: '#ff5a5f',
          tag: 'ADR',
          title: 'ADR Brasil: R$ 428/noite em Q1/26 — alta de 11% vs Q1/25 pressiona demanda',
          detail: 'Average Daily Rate no Brasil sobe consistentemente. Alta de 11% pode frear conversão em segmentos de viajantes budget. Análise de elasticidade indica queda de 3,2% na demanda para cada 10% de alta no ADR. Ação: promoções via cupom Airbnb Coupon para reativar usuários inativos.',
          badge: { label: 'ADR R$428', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Estadias Longas & Superhosts',
      cards: [
        {
          color: '#ff5a5f',
          tag: 'LONG STAYS',
          title: 'Estadias longas (28+ noites): 18% do GBV global — crescimento de 42% desde 2022',
          detail: 'Segmento de estadias longas cresceu 42% desde 2022, impulsionado pelo trabalho remoto. 18% do GBV global vem de reservas de 28+ noites. ADR médio em long stays: US$ 98/noite — 42% abaixo do curto prazo, mas com ocupação de 88%. Destinos top: Lisboa, Medellín, Bali, Florianópolis.',
          badge: { label: '18% do GBV', type: 'ok' },
        },
        {
          color: '#ff5a5f',
          tag: 'SUPERHOSTS',
          title: '5 mi de Superhosts globais — geram 38% das noites reservadas com 4% das listagens',
          detail: 'Superhost (rating ≥ 4,8, taxa de resposta ≥ 90%, taxa de cancelamento < 1%) representa 4% das listagens mas 38% das noites reservadas. Conversão de busca para reserva 2,4x maior em listagens Superhost. Programa de recompensas: cupom de US$ 100 por trimestre mantido como Superhost.',
          badge: { label: '5mi Superhosts', type: 'ok' },
        },
        {
          color: '#ff5a5f',
          tag: 'HOSTS BR',
          title: '580 mil hosts ativos no Brasil — renda média de R$ 2.840/mês por host',
          detail: 'Brasil tem 580 mil hosts ativos, com crescimento de 22% YoY. Renda média mensal: R$ 2.840 — equivalente a 1,4x o salário mínimo. 28% dos hosts brasileiros declaram a renda do Airbnb como principal fonte de renda. Programa AirCover garante até US$ 3 mi em proteção de danos para hosts.',
          badge: { label: '580k hosts', type: 'ok' },
        },
      ],
    },
  ],

  financeiro: [
    {
      sectionTitle: 'Take Rate & Receita',
      cards: [
        {
          color: '#ff5a5f',
          tag: 'TAKE RATE',
          title: 'Take rate médio: 14,2% — divisão 3% hóspede + 11,2% host (média ponderada)',
          detail: 'Estrutura de taxa: hóspedes pagam até 14,2% de service fee sobre o subtotal; hosts pagam 3% split ou 14-16% no modelo somente host. Take rate consolidado em 14,2% no Q1/26 — queda de 0,3pp vs Q4/25 por mix de mercados emergentes de menor ADR.',
          badge: { label: 'Take 14,2%', type: 'info' },
        },
        {
          color: '#ff5a5f',
          tag: 'RECEITA',
          title: 'Receita Q1/26: US$ 3,4 bi — crescimento de 14% YoY; margem operacional de 18,3%',
          detail: 'Receita de US$ 3,4 bi com margem operacional de 18,3% (era 15,1% no Q1/25). EBITDA ajustado: US$ 820 mi. FCF: US$ 1,1 bi. Guidance Q2/26: receita de US$ 3,7-3,8 bi. Principal vento favorável: crescimento de Experiences e long stays com margem superior à hospedagem tradicional.',
          badge: { label: 'Margem 18,3%', type: 'ok' },
        },
        {
          color: '#ff5a5f',
          tag: 'CÂMBIO BR',
          title: 'Impacto cambial no Brasil: BRL/USD em R$5,80 reduz receita US$ em 8%',
          detail: 'Flutuação do real impacta receita consolidada em dólares. R$ 6,8 bi de GBV no Brasil = US$ 1,17 bi a câmbio de R$5,80 (era US$ 1,28 bi projetado no budget a R$5,30). Hedge parcial via contratos FX de US$ 400 mi/semestre. Política de hedge revisada para Q3/26.',
          badge: { label: 'FX impacto -8%', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Custos & Eficiência',
      cards: [
        {
          color: '#ff5a5f',
          tag: 'AIRCOVER',
          title: 'AirCover: sinistros pagos em 2025 — US$ 180 mi em indenizações a hosts',
          detail: 'Programa de proteção AirCover (substituiu Host Guarantee) pagou US$ 180 mi em sinistros em 2025. Casos mais frequentes: danos a móveis e eletrodomésticos (62%), furto (21%), danos estruturais (17%). Taxa de sinistro: 0,08% das reservas. Seguro ressegurado com Lloyd\'s of London.',
          badge: { label: 'US$180mi sinistros', type: 'info' },
        },
        {
          color: '#ff5a5f',
          tag: 'PAGAMENTOS BR',
          title: 'Pix como método de pagamento no BR: 44% das reservas — taxa de fraude 0,04%',
          detail: 'Airbnb integrou Pix em jul/24 — em abr/26, 44% das reservas no Brasil são pagas via Pix. Taxa de fraude em Pix: 0,04% (cartão de crédito: 0,18%). Custo de processamento Pix: 0,22% do valor transacionado vs 2,1% no cartão. Saving anual estimado: R$ 48 mi.',
          badge: { label: 'Pix 44%', type: 'ok' },
        },
      ],
    },
  ],

  rh: [
    {
      sectionTitle: 'Força de Trabalho',
      cards: [
        {
          color: '#ff5a5f',
          tag: 'HEADCOUNT',
          title: '6.900 funcionários globais — escritório BR (SP) com 220 pessoas em Customer Support e Ops',
          detail: 'Após layoff de 25% em 2020 e crescimento seletivo, Airbnb mantém 6.900 funcionários em 2026. Escritório de São Paulo foca em Customer Support (140), Operações LATAM (50) e Comercial (30). Hub tech principal: San Francisco. Segundo hub: Singapura (800 funcionários).',
          badge: { label: '6.900 globais', type: 'info' },
        },
        {
          color: '#ff5a5f',
          tag: 'LIVE & WORK ANYWHERE',
          title: 'Política "Live and Work Anywhere": 95% dos funcionários em regime remoto ou híbrido',
          detail: 'Desde mai/22, funcionários podem morar e trabalhar de qualquer lugar do mundo onde a empresa tem entidade. 95% optaram por remoto/híbrido. Brian Chesky exige presença no escritório de San Francisco para líderes sêniores: 4 dias/semana. Conflito cultural documentado com engenheiros.',
          badge: { label: '95% remoto/híbrido', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Cultura & Operações de Pessoas',
      cards: [
        {
          color: '#ff5a5f',
          tag: 'ENGAJAMENTO',
          title: 'eNPS global: 58 — queda de 4pp após exigência de presença física para líderes',
          detail: 'Pesquisa de pulso trimestral (Q1/26) registra eNPS de 58. Principais insatisfações: inconsistência entre política oficial de flexibilidade e exigência de presença para líderes, ambiguidade em progressão de carreira e carga de trabalho pós-layoffs. Ação: revisão de política de presença prevista para Q3/26.',
          badge: { label: 'eNPS 58', type: 'warn' },
        },
        {
          color: '#ff5a5f',
          tag: 'CONTRATAÇÃO',
          title: '64 vagas abertas em Q2/26 — prioridade em Trust & Safety e engenharia de pagamentos',
          detail: 'Contratações priorizadas: Trust & Safety Analysts (25 vagas, globais), Backend Engineers de pagamentos (18), Data Scientists de pricing (12), Comercial LATAM (9). Tempo médio de contratação: 42 dias. Parceria com Lambda School para pipeline de engenheiros não-tradicionais.',
          badge: { label: '64 vagas', type: 'info' },
        },
        {
          color: '#ff5a5f',
          tag: 'CAPACITAÇÃO BR',
          title: 'Programa "Superhost Academy" no Brasil: 12 mil hosts treinados em 2025',
          detail: 'Treinamento gratuito para hosts brasileiros em hospitalidade, fotografia e precificação. 12 mil hosts concluíram o programa em 2025 — conversão para Superhost: 31% em 6 meses após conclusão. Parceria com Sebrae para hosts MEI. Expansão para 20 mil hosts em 2026.',
          badge: { label: '12k treinados', type: 'ok' },
        },
      ],
    },
  ],

  operacoes: [
    {
      sectionTitle: 'Trust & Safety',
      cards: [
        {
          color: '#ff5a5f',
          tag: 'VERIFICAÇÃO',
          title: 'Verificação de identidade: 98% dos hóspedes verificados em mercados core',
          detail: 'Sistema de verificação (selfie + documento) obrigatório em 38 países desde jan/26. Taxa de conclusão: 98% nos mercados core, 89% em emergentes. Recusas por incompatibilidade de identidade: 0,4%. Parceria com Stripe Identity para processamento biométrico. LGPD: dados biométricos não armazenados após verificação.',
          badge: { label: '98% verificados', type: 'ok' },
        },
        {
          color: '#ff5a5f',
          tag: 'FRAUDES',
          title: 'Tentativas de fraude bloqueadas: 1,8 mi em Q1/26 — sistema ML detecta 94% automaticamente',
          detail: 'Modelo de detecção de fraude (treinado com 10 anos de dados) bloqueou 1,8 mi de tentativas no Q1/26. Tipos principais: listagens falsas (38%), fraude de pagamento (31%), contas duplicadas (21%), reviews manipulados (10%). MTTR para remoção de listagem fraudulenta: 2,8h.',
          badge: { label: '94% auto-detectado', type: 'ok' },
        },
        {
          color: '#ff5a5f',
          tag: 'SUPORTE',
          title: 'Suporte 24/7: CSAT de 4,2/5 — resolução no primeiro contato em 71% dos casos',
          detail: 'Time de suporte com 3.200 agentes globais (800 no BR via terceirização com Atento). FCR de 71% — meta é 78%. Motivos de escalation: cancelamentos de última hora por host (42%), disputas de danos (28%), problemas de check-in (18%). Implementação de chatbot com GPT-4 reduziu volume humano em 22%.',
          badge: { label: 'FCR 71%', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Plataforma & Produto',
      cards: [
        {
          color: '#ff5a5f',
          tag: 'UPTIME',
          title: 'Uptime da plataforma: 99,96% — infraestrutura 100% em AWS com multi-region',
          detail: 'Airbnb opera 100% em AWS (us-east-1, eu-west-1, ap-southeast-1). SLA interno: 99,95% — uptime real de 99,96% no Q1/26. Único incidente relevante: 22 min de degradação do sistema de pagamentos em fev/26 por falha na integração com Stripe. RCA publicado em 48h.',
          badge: { label: '99,96% uptime', type: 'ok' },
        },
        {
          color: '#ff5a5f',
          tag: 'PRECIFICAÇÃO',
          title: 'Smart Pricing: 38% dos hosts ativos usam precificação dinâmica automática',
          detail: 'Ferramenta de precificação dinâmica ajusta diárias com base em demanda local, eventos e sazonalidade. 38% dos hosts ativos ativaram o recurso. Hosts com Smart Pricing ativo têm ocupação 22% maior e receita 18% superior. Expansão do algoritmo para incluir dados de shows e eventos locais em mai/26.',
          badge: { label: '+18% receita hosts', type: 'ok' },
        },
      ],
    },
  ],

  estoque: [
    {
      sectionTitle: 'Listagens & Oferta',
      cards: [
        {
          color: '#ff5a5f',
          tag: 'LISTAGENS',
          title: '8,1 mi de listagens ativas globalmente — Brasil com 420 mil (5º maior mercado)',
          detail: 'Airbnb tem 8,1 mi de listagens ativas em 220 países. Brasil: 420 mil listagens — crescimento de 18% YoY. Tipo de listagem no BR: apartamento inteiro (58%), casa inteira (31%), quarto privativo (8%), quarto compartilhado (3%). Estados com mais listagens: SP (31%), RJ (22%), SC (14%).',
          badge: { label: '420k no Brasil', type: 'ok' },
        },
        {
          color: '#ff5a5f',
          tag: 'TAXA DE OCUPAÇÃO',
          title: 'Taxa de ocupação média Brasil: 62% — alta temporada atinge 89% em destinos de praia',
          detail: 'Ocupação média das listagens brasileiras: 62% no acumulado 2025. Destinos de praia em jan/fev: 89%. Destinos de cidade (SP, RJ) em período comum: 51%. Listagens com 10+ fotos profissionais têm ocupação 34% maior. Oferta de fotógrafo Airbnb disponível em 18 cidades do BR.',
          badge: { label: 'Ocupação 62%', type: 'info' },
        },
        {
          color: '#ff5a5f',
          tag: 'ESCASSEZ',
          title: 'Rio de Janeiro durante Rock in Rio 2026: 0 listagens disponíveis — 3 semanas antes',
          detail: 'Rock in Rio (set/26) esgotou todas as listagens no Rio em raio de 15km 3 semanas antes do evento. Diária média durante o festival: R$ 1.840 (alta de 3,1x vs período normal). Airbnb ativa "modo evento" com proteção extra contra cancelamento de host. 4.200 estadias intermediadas.',
          badge: { label: 'Esgotado 3sem antes', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Qualidade & Reviews',
      cards: [
        {
          color: '#ff5a5f',
          tag: 'REVIEWS',
          title: 'Rating médio global: 4,74 estrelas — 92% das listagens com rating acima de 4,0',
          detail: 'Sistema de reviews duplo (host avalia hóspede e vice-versa) gera rating médio de 4,74. 92% das listagens ativas têm rating ≥ 4,0. Listagens abaixo de 3,5 após 10 reviews são suspensas automaticamente. Volume de reviews em Q1/26: 28 mi — crescimento de 16% YoY.',
          badge: { label: 'Rating 4,74', type: 'ok' },
        },
        {
          color: '#ff5a5f',
          tag: 'REMOÇÃO',
          title: 'Listagens removidas Q1/26: 48 mil — 71% por violação de padrões de qualidade',
          detail: 'Sistema de qualidade removeu 48 mil listagens no Q1/26. Motivos: padrões de qualidade (71%), fraude confirmada (18%), violações de regulação local (11%). Taxa de remoção: 0,59% do total de listagens ativas. Hosts removidos podem recorrer em 30 dias com documentação.',
          badge: { label: '48k removidas', type: 'warn' },
        },
      ],
    },
  ],

  juridico: [
    {
      sectionTitle: 'Regulação Municipal & IPTU',
      cards: [
        {
          color: '#ff5a5f',
          tag: 'SÃO PAULO',
          title: 'Decreto SP 64.044/26: licença obrigatória para aluguel de curto prazo — vigência jan/27',
          detail: 'Prefeitura de São Paulo publicou decreto em mar/26 exigindo cadastro municipal para hospedagem de curto prazo a partir de jan/27. Custo de licença: R$ 480/ano. Estimativa: 68% dos 130 mil hosts em SP não têm CNPJ. Airbnb monta força-tarefa de adequação com Sebrae e contabilidades parceiras.',
          badge: { label: 'Vigência jan/27', type: 'warn' },
        },
        {
          color: '#ff5a5f',
          tag: 'RIO DE JANEIRO',
          title: 'Lei Municipal Rio 7.284/25: IPTU comercial para imóveis em plataformas de aluguel',
          detail: 'Lei aprovada em dez/25 classifica como uso comercial imóveis alugados por mais de 90 dias/ano em plataformas digitais — sujeitos a IPTU 2x maior. Estimativa de impacto: 22 mil hosts no Rio afetados. Airbnb contesta constitucionalidade via ABED (Associação Brasileira de Empresas Digitais). Liminar obtida em fev/26.',
          badge: { label: 'Liminar obtida', type: 'warn' },
        },
        {
          color: '#ff5a5f',
          tag: 'FLORIANÓPOLIS',
          title: 'Florianópolis zoneamento 2026: 40% das praias com restrição de novas listagens',
          detail: 'Novo plano diretor de Florianópolis (aprovado jan/26) restringe novos cadastros em zonas residenciais de Jurerê Internacional, Campeche e Lagoa da Conceição. Listagens existentes mantidas (grandfathering). Impacto: crescimento limitado de oferta nos destinos mais rentáveis do sul do BR.',
          badge: { label: '40% com restrição', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Compliance & Disputas',
      cards: [
        {
          color: '#ff5a5f',
          tag: 'RECEITA FEDERAL',
          title: 'Receita Federal BR: Airbnb notificado para informar rendimentos de hosts acima de R$ 28.559/ano',
          detail: 'Instrução normativa RFB 2.175/26 exige que plataformas reportem rendimentos de usuários acima do limite de isenção IR (R$ 28.559/ano). Airbnb tem até jun/26 para integrar API de reporte. Estimativa: 84 mil hosts brasileiros no escopo de declaração. DPO avalia impacto em LGPD.',
          badge: { label: 'Prazo jun/26', type: 'warn' },
        },
        {
          color: '#ff5a5f',
          tag: 'PROCON SP',
          title: 'Procon-SP: 3.200 reclamações em 2025 — cancelamento de host é 58% dos casos',
          detail: 'Procon-SP registrou 3.200 reclamações contra Airbnb em 2025 — crescimento de 28% vs 2024. Motivos: cancelamento pelo host (58%), cobrança indevida (24%), problemas de qualidade (18%). Multa aplicada em jan/26: R$ 2,1 mi por não resolução em prazo. Airbnb recorre administrativamente.',
          badge: { label: 'Multa R$2,1mi', type: 'warn' },
        },
        {
          color: '#ff5a5f',
          tag: 'LGPD',
          title: 'ANPD: auditoria de transferência internacional de dados — dados de hóspedes BR vão a servidores EUA',
          detail: 'ANPD abriu procedimento em abr/26 para verificar conformidade da transferência de dados de hóspedes brasileiros para servidores da AWS em us-east-1. Airbnb apresentará Standard Contractual Clauses adaptadas para LGPD. Prazo de resposta: 60 dias. DPO BR mobilizado com escritório Pinheiro Neto.',
          badge: { label: 'Auditoria ANPD', type: 'warn' },
        },
      ],
    },
  ],
};
