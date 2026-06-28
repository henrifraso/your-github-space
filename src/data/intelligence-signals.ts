// Modelo de sinal padronizado do motor OS¹.
//
// Raw data from APIs, uploads, browser, map or manual context should be
// normalized into StandardIntelligenceSignal before feeding OS¹ surfaces.
//
// O motor não recebe dados crus — recebe sinais padronizados.
// Isso garante que Feed, Score, Mapa e Área de Trabalho sempre consumam
// o mesmo formato, independente da origem (horizontal ou vertical).

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type SignalImpact     = 'low' | 'medium' | 'high';
export type SignalConfidence = 'low' | 'medium' | 'high';
export type SignalStatus     = 'active' | 'dismissed' | 'archived' | 'pending';
export type SignalTarget     = 'feed' | 'score' | 'map' | 'workspace';

export type SignalType =
  | 'competitive_pressure'   // presença ou movimento de concorrente
  | 'reputation_signal'      // avaliações, menções, percepção pública
  | 'demand_signal'          // oportunidade ou queda de demanda
  | 'territory_opportunity'  // oportunidade geográfica ou territorial
  | 'sales_drop'             // queda de venda detectada
  | 'inventory_risk'         // risco de ruptura ou excesso de estoque
  | 'route_opportunity'      // oportunidade em rota ou cobertura
  | 'customer_complaint'     // reclamação ou insatisfação
  | 'public_mention'         // menção pública (notícia, imprensa, rede social)
  | 'uploaded_context'       // contexto inserido via arquivo
  | 'navigated_source'       // fonte acessada no Navegador
  | 'map_pressure'           // pressão competitiva ou territorial via mapa
  | 'pdv_opportunity'        // oportunidade em ponto de venda
  | 'seasonality_signal'     // sazonalidade ou evento com impacto de demanda
  | 'settings_context';      // dado inserido via Configuração da Empresa

export interface StandardIntelligenceSignal {
  id:                string;
  type:              SignalType;
  title:             string;
  summary:           string;
  originInputId:     string;       // ID da entrada em intelligence-inputs.ts
  profileId:         string;       // perfil/setor onde o sinal foi gerado
  entity?:           string;       // ex: "Bar do João", "Rua XV", "Produto X"
  metric?:           string;       // ex: "queda de 18%", "nota 3,7", "3 concorrentes"
  evidence?:         string;       // trecho ou dado que sustenta o sinal
  impact:            SignalImpact;
  confidence:        SignalConfidence;
  timeframe?:        string;       // ex: "últimos 14 dias", "próximas 2 semanas"
  targets:           SignalTarget[];
  riskLevel?:        SignalImpact;
  opportunityLevel?: SignalImpact;
  status:            SignalStatus;
  isDemo:            boolean;
  createdAt:         string;       // ISO 8601
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

// Mapeamento de entrada → tipo de sinal padrão
function inferSignalType(inputId: string): SignalType {
  const map: Record<string, SignalType> = {
    sales_api:              'sales_drop',
    inventory_api:          'inventory_risk',
    pdv_api:                'pdv_opportunity',
    orders_api:             'demand_signal',
    crm_api:                'demand_signal',
    erp_api:                'sales_drop',
    logistics_api:          'route_opportunity',
    routes_api:             'route_opportunity',
    production_api:         'inventory_risk',
    delivery_api:           'demand_signal',
    support_api:            'customer_complaint',
    reviews_api:            'reputation_signal',
    google_reviews:         'reputation_signal',
    reclame_aqui:           'customer_complaint',
    social_public_signal:   'public_mention',
    news_signal:            'public_mention',
    events_signal:          'seasonality_signal',
    competitor_signal:      'competitive_pressure',
    official_registry_signal: 'competitive_pressure',
    map_signal:             'map_pressure',
    public_reputation:      'reputation_signal',
    browser_url:            'navigated_source',
    uploaded_file:          'uploaded_context',
    manual_context:         'uploaded_context',
    company_settings:       'settings_context',
  };
  return map[inputId] ?? 'demand_signal';
}

// Mapeamento de entrada → telas que recebem o sinal
function inferTargets(inputId: string): SignalTarget[] {
  const map: Record<string, SignalTarget[]> = {
    sales_api:              ['feed', 'score', 'map', 'workspace'],
    inventory_api:          ['feed', 'workspace'],
    pdv_api:                ['feed', 'map', 'score'],
    orders_api:             ['feed', 'workspace'],
    crm_api:                ['feed', 'workspace'],
    erp_api:                ['score', 'workspace'],
    logistics_api:          ['map', 'feed'],
    routes_api:             ['map', 'feed', 'workspace'],
    production_api:         ['score', 'workspace'],
    delivery_api:           ['feed', 'map', 'workspace'],
    support_api:            ['score', 'workspace'],
    reviews_api:            ['score', 'feed'],
    google_reviews:         ['score', 'feed', 'map'],
    reclame_aqui:           ['score', 'feed'],
    social_public_signal:   ['feed', 'score'],
    news_signal:            ['feed', 'workspace'],
    events_signal:          ['feed', 'map'],
    competitor_signal:      ['feed', 'map', 'score'],
    official_registry_signal: ['score', 'feed'],
    map_signal:             ['map', 'feed', 'score'],
    public_reputation:      ['score', 'feed'],
    browser_url:            ['score', 'workspace'],
    uploaded_file:          ['score', 'workspace', 'feed'],
    manual_context:         ['feed', 'score', 'workspace'],
    company_settings:       ['feed', 'score', 'map', 'workspace'],
  };
  return map[inputId] ?? ['feed'];
}
