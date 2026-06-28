// Registry de fontes de inteligência do OS¹.
//
// O OS¹ transforma fontes externas de mercado em sinais acionáveis.
// O horizontal define o motor. O vertical define quais fontes externas
// o motor prioriza para cada setor.
//
// Não é objetivo do OS¹ conectar ERP, CRM, PDV ou sistemas internos.
// O motor lê o mercado de fora para dentro.

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type IntelligenceInputMode   = 'horizontal' | 'vertical' | 'both';
export type IntelligenceInputStatus = 'active' | 'demo' | 'future' | 'api_vertical' | 'not_connected';
export type IntelligenceInputOrigin = 'manual' | 'upload' | 'browser' | 'map' | 'public' | 'api';
export type IntelligenceTargetScreen = 'feed' | 'score' | 'map' | 'workspace' | 'settings';

export type IntelligenceInputCategory =
  | 'context'      // dados declarados pelo usuário para calibrar o motor
  | 'signal'       // sinais externos captados de fontes públicas
  | 'reputation'   // percepção pública, avaliações e menções
  | 'competitor'   // presença e movimentos de concorrentes
  | 'territory'    // geográfico e territorial
  | 'search'       // busca web, notícias e tendências
  | 'pricing'      // preços e marketplaces públicos
  | 'trend';       // tendências de mercado e indicadores externos

export interface IntelligenceInput {
  id:             string;
  label:          string;
  description:    string;
  origin:         IntelligenceInputOrigin;
  mode:           IntelligenceInputMode;
  status:         IntelligenceInputStatus;
  category:       IntelligenceInputCategory;
  screens:        IntelligenceTargetScreen[];
  isConnected:    boolean;
  isDemo:         boolean;
  isFuture:       boolean;
  verticals:      string[];
  exampleSignals: string[];
}

// ── Fontes horizontais ────────────────────────────────────────────────────────
// Servem para qualquer empresa, independente de setor.

const HORIZONTAL_INPUTS: IntelligenceInput[] = [
  {
    id:          'company_settings',
    label:       'Configuração da Empresa',
    description: 'Dados declarados pela empresa para calibrar o radar: setor, região, concorrentes, marcas acompanhadas, canais e sinais prioritários.',
    origin:      'manual',
    mode:        'horizontal',
    status:      'active',
    category:    'context',
    screens:     ['feed', 'score', 'map', 'workspace', 'settings'],
    isConnected: true,
    isDemo:      false,
    isFuture:    false,
    verticals:   [],
    exampleSignals: [
      'Setor configurado: bebidas e distribuição — foco em bares e mercados',
      'Região prioritária: Curitiba e Região Metropolitana',
      'Concorrentes monitorados: 3 marcas regionais',
    ],
  },
  {
    id:          'uploaded_file',
    label:       'Arquivos e documentos',
    description: 'Materiais enviados pelo usuário para enriquecer a leitura: pesquisas, relatórios, listas de pontos, planilhas e contextos de mercado.',
    origin:      'upload',
    mode:        'horizontal',
    status:      'active',
    category:    'context',
    screens:     ['score', 'workspace'],
    isConnected: true,
    isDemo:      false,
    isFuture:    false,
    verticals:   [],
    exampleSignals: [
      'Relatório de mercado enviado — 3 tendências identificadas',
      'Lista de pontos de interesse carregada como contexto territorial',
    ],
  },
  {
    id:          'manual_context',
    label:       'Contexto manual',
    description: 'Informações inseridas diretamente pelo usuário para alimentar a análise do motor com observações de campo.',
    origin:      'manual',
    mode:        'horizontal',
    status:      'active',
    category:    'context',
    screens:     ['feed', 'score', 'workspace'],
    isConnected: true,
    isDemo:      false,
    isFuture:    false,
    verticals:   [],
    exampleSignals: [
      'Usuário relatou: concorrente abriu ponto novo na região Norte',
      'Observação de campo: canal de bares com menos movimento nos últimos 15 dias',
    ],
  },
  {
    id:          'browser_url',
    label:       'Fontes navegadas',
    description: 'URLs acessadas no Navegador OS¹ que entram como contexto de inteligência — sites de concorrentes, notícias, dados públicos.',
    origin:      'browser',
    mode:        'horizontal',
    status:      'active',
    category:    'signal',
    screens:     ['score', 'workspace'],
    isConnected: true,
    isDemo:      false,
    isFuture:    false,
    verticals:   [],
    exampleSignals: [
      'Fonte navegada: site do concorrente — nova campanha de preço identificada',
      'Fonte navegada: notícia regional sobre evento com impacto no mercado',
    ],
  },
  {
    id:          'map_signal',
    label:       'Sinais do Mapa',
    description: 'Pontos, territórios, concorrentes e pressões competitivas observadas no mapa.',
    origin:      'map',
    mode:        'horizontal',
    status:      'active',
    category:    'territory',
    screens:     ['map', 'feed', 'score'],
    isConnected: true,
    isDemo:      false,
    isFuture:    false,
    verticals:   ['beverage_distribution', 'pharmacy_retail', 'food_franchise'],
    exampleSignals: [
      '3 concorrentes novos no raio de 2 km',
      'Região Sul com baixa presença de marcas — oportunidade territorial',
    ],
  },
  {
    id:          'public_reputation',
    label:       'Reputação pública',
    description: 'Sinais públicos de avaliação, percepção, menções e presença da marca em fontes abertas.',
    origin:      'public',
    mode:        'horizontal',
    status:      'active',
    category:    'reputation',
    screens:     ['score', 'feed'],
    isConnected: true,
    isDemo:      false,
    isFuture:    false,
    verticals:   ['pharmacy_retail', 'food_franchise'],
    exampleSignals: [
      'Nota pública caiu de 4,3 para 3,9 nos últimos 30 dias',
      'Pico de menções negativas na semana do feriado',
    ],
  },
  {
    id:          'google_reviews',
    label:       'Google Avaliações',
    description: 'Fonte monitorável de avaliações públicas, presença local e percepção em busca.',
    origin:      'public',
    mode:        'horizontal',
    status:      'demo',
    category:    'reputation',
    screens:     ['score', 'feed', 'map'],
    isConnected: false,
    isDemo:      true,
    isFuture:    false,
    verticals:   ['pharmacy_retail', 'food_franchise'],
    exampleSignals: [
      'Nota média local: 4,1 vs concorrente: 4,6',
      'Avaliação recente menciona: "produto indisponível"',
    ],
  },
  {
    id:          'reclame_aqui',
    label:       'Reclame Aqui',
    description: 'Fonte monitorável de reclamações públicas, tempo de resposta e confiança da marca.',
    origin:      'public',
    mode:        'horizontal',
    status:      'demo',
    category:    'reputation',
    screens:     ['score', 'feed'],
    isConnected: false,
    isDemo:      true,
    isFuture:    false,
    verticals:   ['pharmacy_retail', 'food_franchise'],
    exampleSignals: [
      '12 reclamações abertas nos últimos 7 dias — alta para o setor',
      'Tempo médio de resposta: 3,2 dias (benchmark: 1 dia)',
    ],
  },
  {
    id:          'social_public_signal',
    label:       'Redes sociais públicas',
    description: 'Sinais públicos de presença, engajamento, campanhas e percepção em canais sociais.',
    origin:      'public',
    mode:        'horizontal',
    status:      'demo',
    category:    'signal',
    screens:     ['feed', 'score'],
    isConnected: false,
    isDemo:      true,
    isFuture:    false,
    verticals:   [],
    exampleSignals: [
      'Campanha de concorrente com alto engajamento regional',
      'Menção negativa viral sobre produto da categoria',
    ],
  },
  {
    id:          'news_signal',
    label:       'Notícias e imprensa',
    description: 'Menções públicas, imprensa regional, notícias de mercado e movimentos relevantes no setor.',
    origin:      'public',
    mode:        'horizontal',
    status:      'demo',
    category:    'search',
    screens:     ['feed', 'workspace'],
    isConnected: false,
    isDemo:      true,
    isFuture:    false,
    verticals:   [],
    exampleSignals: [
      'Notícia regional: cidade recebe evento com 30 mil pessoas no fim de semana',
      'Nova regulação pode afetar importação de insumos da categoria',
    ],
  },
  {
    id:          'events_signal',
    label:       'Eventos e calendário',
    description: 'Eventos locais, sazonalidade e datas que podem afetar demanda, presença e oportunidades de mercado.',
    origin:      'public',
    mode:        'horizontal',
    status:      'demo',
    category:    'signal',
    screens:     ['feed', 'map'],
    isConnected: false,
    isDemo:      true,
    isFuture:    false,
    verticals:   ['beverage_distribution'],
    exampleSignals: [
      'Carnaval fora de época confirmado na região — oportunidade de demanda',
      'Feira setorial no próximo mês: janela de posicionamento',
    ],
  },
  {
    id:          'competitor_signal',
    label:       'Movimentos de concorrentes',
    description: 'Sinais públicos de presença, expansão, campanhas e posicionamento de concorrentes observáveis externamente.',
    origin:      'public',
    mode:        'horizontal',
    status:      'demo',
    category:    'competitor',
    screens:     ['feed', 'map', 'score'],
    isConnected: false,
    isDemo:      true,
    isFuture:    false,
    verticals:   ['beverage_distribution', 'pharmacy_retail', 'food_franchise'],
    exampleSignals: [
      'Concorrente abriu ponto novo no raio de 500m',
      'Marca nacional lançou campanha de preço baixo na região',
    ],
  },
  {
    id:          'official_registry_signal',
    label:       'Registros públicos',
    description: 'Fontes monitoráveis como registros empresariais, marcas, CNPJ e informações institucionais públicas.',
    origin:      'public',
    mode:        'horizontal',
    status:      'future',
    category:    'signal',
    screens:     ['score', 'feed'],
    isConnected: false,
    isDemo:      false,
    isFuture:    true,
    verticals:   [],
    exampleSignals: [
      'Novo CNPJ de concorrente registrado na região',
      'Registro de marca nova na categoria — monitorar',
    ],
  },
];

// ── Fontes externas verticais/especializadas ─────────────────────────────────
// Fontes de inteligência de mercado monitoráveis por setor.
// Não são sistemas internos da empresa — são leituras externas de mercado.

const VERTICAL_MARKET_INPUTS: IntelligenceInput[] = [
  {
    id:          'web_search',
    label:       'Busca web',
    description: 'Resultados de busca pública sobre temas, marcas, concorrentes e mercado.',
    origin:      'public',
    mode:        'vertical',
    status:      'api_vertical',
    category:    'search',
    screens:     ['feed', 'workspace'],
    isConnected: false,
    isDemo:      false,
    isFuture:    true,
    verticals:   ['beverage_distribution', 'pharmacy_retail', 'food_franchise'],
    exampleSignals: [
      'Pico de buscas por "cerveja artesanal Curitiba" — tendência de demanda',
      'Buscas por concorrente cresceram 34% no mês',
    ],
  },
  {
    id:          'market_trends',
    label:       'Tendências de mercado',
    description: 'Sinais de tendência setorial, comportamento de consumo e movimentos de categoria.',
    origin:      'public',
    mode:        'both',
    status:      'api_vertical',
    category:    'trend',
    screens:     ['feed', 'score', 'workspace'],
    isConnected: false,
    isDemo:      false,
    isFuture:    true,
    verticals:   ['beverage_distribution', 'pharmacy_retail', 'food_franchise'],
    exampleSignals: [
      'Categoria de bebidas sem álcool em crescimento de 18% no trimestre',
      'Tendência de farmácias com espaço de bem-estar cresce no Brasil',
    ],
  },
  {
    id:          'pricing_public_signals',
    label:       'Preços públicos',
    description: 'Dados públicos de preços em canais digitais, anúncios e marketplaces observáveis.',
    origin:      'public',
    mode:        'both',
    status:      'api_vertical',
    category:    'pricing',
    screens:     ['feed', 'score'],
    isConnected: false,
    isDemo:      false,
    isFuture:    true,
    verticals:   ['beverage_distribution', 'pharmacy_retail', 'food_franchise'],
    exampleSignals: [
      'Concorrente reduziu preço de produto-chave em 12% no iFood',
      'Produto da categoria com variação de 23% entre canais na região',
    ],
  },
  {
    id:          'marketplace_public_signals',
    label:       'Marketplaces e delivery',
    description: 'Sinais públicos de presença, avaliação e posicionamento em plataformas de delivery e marketplaces.',
    origin:      'public',
    mode:        'vertical',
    status:      'api_vertical',
    category:    'pricing',
    screens:     ['feed', 'map', 'score'],
    isConnected: false,
    isDemo:      false,
    isFuture:    true,
    verticals:   ['food_franchise', 'pharmacy_retail'],
    exampleSignals: [
      'Concorrente com 4,8★ no iFood vs 3,9★ da unidade — gap de reputação',
      'Produto indisponível em 3 plataformas — risco de perda de visibilidade',
    ],
  },
  {
    id:          'ads_public_signals',
    label:       'Anúncios públicos',
    description: 'Campanhas e anúncios públicos observáveis de concorrentes em Google, redes sociais e mídia programática.',
    origin:      'public',
    mode:        'both',
    status:      'api_vertical',
    category:    'competitor',
    screens:     ['feed', 'score'],
    isConnected: false,
    isDemo:      false,
    isFuture:    true,
    verticals:   ['food_franchise', 'beverage_distribution'],
    exampleSignals: [
      'Concorrente com campanha ativa de geolocalização na região',
      'Anúncio de promoção de produto-chave detectado no canal local',
    ],
  },
  {
    id:          'brand_mentions',
    label:       'Menções da marca',
    description: 'Menções públicas da marca ou setor em fóruns, notícias, blogs e redes sociais abertas.',
    origin:      'public',
    mode:        'both',
    status:      'api_vertical',
    category:    'reputation',
    screens:     ['feed', 'score'],
    isConnected: false,
    isDemo:      false,
    isFuture:    true,
    verticals:   ['beverage_distribution', 'pharmacy_retail', 'food_franchise'],
    exampleSignals: [
      'Menção positiva em blog regional: marca citada como referência',
      'Comentário negativo em fórum sobre disponibilidade na região Sul',
    ],
  },
  {
    id:          'weather_seasonality',
    label:       'Clima e sazonalidade',
    description: 'Dados climáticos e sazonais que afetam demanda, consumo e padrões de mercado.',
    origin:      'public',
    mode:        'both',
    status:      'api_vertical',
    category:    'trend',
    screens:     ['feed', 'map'],
    isConnected: false,
    isDemo:      false,
    isFuture:    true,
    verticals:   ['beverage_distribution', 'pharmacy_retail'],
    exampleSignals: [
      'Onda de calor prevista — demanda de bebidas deve subir 40% na semana',
      'Temporada de gripe: busca por antigripais 3× acima da média',
    ],
  },
  {
    id:          'seo_visibility',
    label:       'Visibilidade em busca',
    description: 'Presença e posicionamento público da marca e concorrentes em resultados de busca.',
    origin:      'public',
    mode:        'both',
    status:      'future',
    category:    'search',
    screens:     ['score', 'feed'],
    isConnected: false,
    isDemo:      false,
    isFuture:    true,
    verticals:   ['pharmacy_retail', 'food_franchise'],
    exampleSignals: [
      'Concorrente aparece em 1ª posição para "farmácia 24h Curitiba"',
      'Queda de posição em busca local nos últimos 30 dias',
    ],
  },
  {
    id:          'economic_indicators',
    label:       'Indicadores econômicos',
    description: 'Dados macroeconômicos públicos relevantes para o setor: inflação, renda, consumo, câmbio.',
    origin:      'public',
    mode:        'horizontal',
    status:      'future',
    category:    'trend',
    screens:     ['score', 'workspace'],
    isConnected: false,
    isDemo:      false,
    isFuture:    true,
    verticals:   [],
    exampleSignals: [
      'Índice de confiança do consumidor em queda — pressão sobre ticket médio',
      'Alta do dólar impacta importados da categoria',
    ],
  },
  {
    id:          'jobs_and_hiring_signals',
    label:       'Vagas e contratação',
    description: 'Sinais públicos de contratação que indicam expansão, abertura de filiais ou movimentos estratégicos de concorrentes.',
    origin:      'public',
    mode:        'both',
    status:      'future',
    category:    'competitor',
    screens:     ['feed', 'score'],
    isConnected: false,
    isDemo:      false,
    isFuture:    true,
    verticals:   ['pharmacy_retail', 'food_franchise'],
    exampleSignals: [
      'Concorrente publicou 8 vagas de operador em bairros sem unidade — sinal de expansão',
      'Rede farmacêutica contratando gerente de loja na região Sul',
    ],
  },
];

// ── Registry completo ─────────────────────────────────────────────────────────

export const INTELLIGENCE_INPUTS: IntelligenceInput[] = [
  ...HORIZONTAL_INPUTS,
  ...VERTICAL_MARKET_INPUTS,
];

// Filtros utilitários
export const ACTIVE_INPUTS       = INTELLIGENCE_INPUTS.filter(i => i.status === 'active');
export const DEMO_INPUTS         = INTELLIGENCE_INPUTS.filter(i => i.status === 'demo');
export const FUTURE_INPUTS       = INTELLIGENCE_INPUTS.filter(i => i.status === 'future');
export const VERTICAL_API_INPUTS = INTELLIGENCE_INPUTS.filter(i => i.status === 'api_vertical');

export function getInputsByScreen(screen: IntelligenceTargetScreen): IntelligenceInput[] {
  return INTELLIGENCE_INPUTS.filter(i => i.screens.includes(screen));
}

export function getInputsByVertical(verticalId: string): IntelligenceInput[] {
  return INTELLIGENCE_INPUTS.filter(i => i.verticals.includes(verticalId));
}
