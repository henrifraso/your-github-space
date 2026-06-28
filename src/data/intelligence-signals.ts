// Modelo de sinal padronizado do motor OS¹.
//
// Fontes externas de mercado → normalização → StandardIntelligenceSignal
// → Feed / Score / Mapa / Área de Trabalho.
//
// O motor lê o mercado de fora para dentro.
// Não processa dados internos de ERP, CRM ou PDV.

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type SignalImpact     = 'low' | 'medium' | 'high';
export type SignalConfidence = 'low' | 'medium' | 'high';
export type SignalStatus     = 'active' | 'dismissed' | 'archived' | 'pending';
export type SignalTarget     = 'feed' | 'score' | 'map' | 'workspace';

export type SignalType =
  | 'competitive_movement'     // presença, expansão ou campanha de concorrente
  | 'reputation_signal'        // avaliações, menções e percepção pública
  | 'market_opportunity'       // oportunidade identificada no mercado
  | 'territorial_gap'          // lacuna ou oportunidade geográfica
  | 'public_demand_signal'     // sinal de demanda observável externamente
  | 'trend_signal'             // tendência de mercado ou comportamento de categoria
  | 'event_signal'             // evento ou sazonalidade com impacto de mercado
  | 'pricing_signal'           // variação de preço ou posicionamento de mercado
  | 'brand_visibility_signal'  // presença pública da marca em busca, ads ou mídia
  | 'regulatory_signal'        // movimentos regulatórios, registros ou normas públicas
  | 'customer_complaint'       // reclamação pública
  | 'public_mention'           // menção em notícia, imprensa ou rede social
  | 'uploaded_context'         // contexto inserido via arquivo
  | 'navigated_source'         // fonte acessada no Navegador
  | 'map_pressure'             // pressão competitiva ou territorial via mapa
  | 'seasonality_signal'       // sazonalidade ou demanda sazonal
  | 'source_context_signal';   // dado declarado via Configuração da Empresa

export interface StandardIntelligenceSignal {
  id:                string;
  type:              SignalType;
  title:             string;
  summary:           string;
  originInputId:     string;         // ID da fonte em intelligence-inputs.ts
  profileId:         string;         // perfil/empresa onde o sinal foi gerado
  verticalPackage?:  string;         // ID do pacote vertical que gerou o sinal
  sector?:           string;         // setor de mercado
  entities?:         string[];       // entidades observadas (marcas, pontos, regiões)
  geography?:        string;         // área geográfica do sinal
  entity?:           string;         // entidade principal (compat)
  metric?:           string;         // ex: "queda de 18%", "nota 3,7"
  evidence?:         string;         // dado ou trecho que sustenta o sinal
  impact:            SignalImpact;
  confidence:        SignalConfidence;
  timeframe?:        string;         // ex: "últimos 14 dias", "próximas 2 semanas"
  targets:           SignalTarget[];
  recommendedScreens?: SignalTarget[];
  riskLevel?:        SignalImpact;
  opportunityLevel?: SignalImpact;
  status:            SignalStatus;
  isDemo:            boolean;
  createdAt:         string;         // ISO 8601
}

// ── Normalizer conceitual ─────────────────────────────────────────────────────
//
// Esta função representa a ideia central do motor:
//   raw input → StandardIntelligenceSignal
//
// Não conecta API real. Não chama LLM. Não grava no banco.
// É o contrato de dados que qualquer conector deve honrar.
//
// Exemplos de normalização:
//
//   1. Venda caiu em um PDV:
//      source: sales_api → type: sales_drop → targets: [feed, score, map, workspace]
//
//   2. URL navegada:
//      source: browser_url → type: navigated_source → targets: [score, workspace]
//
//   3. Concorrente no mapa:
//      source: map_signal → type: competitive_pressure → targets: [map, feed, score]
//
//   4. Arquivo enviado:
//      source: uploaded_file → type: uploaded_context → targets: [score, workspace, feed]

export interface RawInputPayload {
  inputId:    string;           // ID da entrada (intelligence-inputs.ts)
  profileId:  string;
  rawData:    Record<string, unknown>;
  timestamp?: string;
}

export function normalizeInputToSignal(
  raw: RawInputPayload,
  overrides?: Partial<StandardIntelligenceSignal>,
): StandardIntelligenceSignal {
  const base: StandardIntelligenceSignal = {
    id:           `sig_${raw.inputId}_${Date.now()}`,
    type:         inferSignalType(raw.inputId),
    title:        String(raw.rawData['title'] ?? 'Sinal sem título'),
    summary:      String(raw.rawData['summary'] ?? ''),
    originInputId: raw.inputId,
    profileId:    raw.profileId,
    entity:       raw.rawData['entity'] as string | undefined,
    metric:       raw.rawData['metric'] as string | undefined,
    evidence:     raw.rawData['evidence'] as string | undefined,
    impact:       (raw.rawData['impact'] as SignalImpact) ?? 'medium',
    confidence:   (raw.rawData['confidence'] as SignalConfidence) ?? 'medium',
    timeframe:    raw.rawData['timeframe'] as string | undefined,
    targets:      inferTargets(raw.inputId),
    riskLevel:    raw.rawData['riskLevel'] as SignalImpact | undefined,
    opportunityLevel: raw.rawData['opportunityLevel'] as SignalImpact | undefined,
    status:       'active',
    isDemo:       false,
    createdAt:    raw.timestamp ?? new Date().toISOString(),
  };

  return { ...base, ...overrides };
}

// Mapeamento de fonte externa → tipo de sinal
function inferSignalType(inputId: string): SignalType {
  const map: Record<string, SignalType> = {
    // fontes horizontais ativas
    company_settings:          'source_context_signal',
    uploaded_file:             'uploaded_context',
    manual_context:            'uploaded_context',
    browser_url:               'navigated_source',
    map_signal:                'map_pressure',
    public_reputation:         'reputation_signal',
    // fontes públicas demo
    google_reviews:            'reputation_signal',
    reclame_aqui:              'customer_complaint',
    social_public_signal:      'public_mention',
    news_signal:               'public_mention',
    events_signal:             'event_signal',
    competitor_signal:         'competitive_movement',
    official_registry_signal:  'regulatory_signal',
    // fontes externas verticais monitoráveis
    web_search:                'public_demand_signal',
    market_trends:             'trend_signal',
    pricing_public_signals:    'pricing_signal',
    marketplace_public_signals:'pricing_signal',
    ads_public_signals:        'competitive_movement',
    brand_mentions:            'brand_visibility_signal',
    weather_seasonality:       'seasonality_signal',
    seo_visibility:            'brand_visibility_signal',
    economic_indicators:       'trend_signal',
    jobs_and_hiring_signals:   'competitive_movement',
  };
  return map[inputId] ?? 'market_opportunity';
}

// Mapeamento de fonte → telas que recebem o sinal
function inferTargets(inputId: string): SignalTarget[] {
  const map: Record<string, SignalTarget[]> = {
    // fontes horizontais ativas
    company_settings:          ['feed', 'score', 'map', 'workspace'],
    uploaded_file:             ['score', 'workspace', 'feed'],
    manual_context:            ['feed', 'score', 'workspace'],
    browser_url:               ['score', 'workspace'],
    map_signal:                ['map', 'feed', 'score'],
    public_reputation:         ['score', 'feed'],
    // fontes públicas demo
    google_reviews:            ['score', 'feed', 'map'],
    reclame_aqui:              ['score', 'feed'],
    social_public_signal:      ['feed', 'score'],
    news_signal:               ['feed', 'workspace'],
    events_signal:             ['feed', 'map'],
    competitor_signal:         ['feed', 'map', 'score'],
    official_registry_signal:  ['score', 'feed'],
    // fontes externas verticais monitoráveis
    web_search:                ['feed', 'workspace'],
    market_trends:             ['feed', 'score', 'workspace'],
    pricing_public_signals:    ['feed', 'score'],
    marketplace_public_signals:['feed', 'map', 'score'],
    ads_public_signals:        ['feed', 'score'],
    brand_mentions:            ['feed', 'score'],
    weather_seasonality:       ['feed', 'map'],
    seo_visibility:            ['score', 'feed'],
    economic_indicators:       ['score', 'workspace'],
    jobs_and_hiring_signals:   ['feed', 'score'],
  };
  return map[inputId] ?? ['feed'];
}
