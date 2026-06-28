// Registry de fontes de inteligência do OS¹.
//
// O OS¹ não é um dashboard por integração.
// Ele é um motor de inteligência que transforma qualquer fonte em sinal padronizado.
// O horizontal usa fontes gerais. O vertical usa conectores específicos de setor.
// Mas a interface, o motor e a lógica continuam os mesmos.
//
// Não expor termos técnicos ao usuário final.
// Na interface usar: "Fontes de dados", "Configuração da Empresa",
// "Sinais acompanhados", "Cruzamentos de inteligência", "Dados conectáveis".

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type IntelligenceInputMode   = 'horizontal' | 'vertical' | 'both';
export type IntelligenceInputStatus = 'active' | 'demo' | 'future' | 'api_vertical' | 'not_connected';
export type IntelligenceInputOrigin = 'manual' | 'upload' | 'browser' | 'map' | 'public' | 'api';
export type IntelligenceTargetScreen = 'feed' | 'score' | 'map' | 'workspace' | 'settings';

export type IntelligenceInputCategory =
  | 'context'       // dados internos declarados
  | 'signal'        // eventos externos captados
  | 'reputation'    // percepção e avaliações públicas
  | 'competitor'    // concorrência e posicionamento
  | 'territory'     // geográfico e territorial
  | 'internal'      // operacional interno via API
  | 'integration';  // conectores e integrações futuras

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
  verticals:      string[];        // IDs de pacotes verticais que usam esta entrada
  exampleSignals: string[];        // exemplos legíveis de sinais que esta fonte gera
}

// ── Entradas horizontais ──────────────────────────────────────────────────────
// Servem para qualquer empresa, independente de setor.

const HORIZONTAL_INPUTS: IntelligenceInput[] = [
  {
    id:          'company_settings',
    label:       'Configuração da Empresa',
    description: 'Dados internos declarados pela empresa para calibrar o motor, como tipo de empresa, regiões, canais, metas, concorrentes e sinais relevantes.',
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
      'Meta comercial ativa: crescer em bares na região Norte',
      'Sinal de alerta configurado: ruptura de PDV',
      'Região prioritária: Curitiba e Região Metropolitana',
    ],
  },
  {
    id:          'uploaded_file',
    label:       'Arquivos enviados',
    description: 'Materiais internos enviados pela empresa para enriquecer a leitura do negócio.',
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
      'Planilha de PDVs enviada — 42 pontos mapeados',
      'Contrato de distribuição carregado como contexto',
    ],
  },
  {
    id:          'manual_context',
    label:       'Contexto manual',
    description: 'Informações inseridas manualmente por operador ou usuário para alimentar a inteligência.',
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
      'Operador relatou queda de giro no canal bares',
      'Usuário inseriu contexto: distribuidora Oeste com estoque crítico',
    ],
  },
  {
    id:          'browser_url',
    label:       'Fontes navegadas',
    description: 'URLs acessadas dentro do Navegador do OS¹ que entram como fontes externas simples da análise.',
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
      'Fonte navegada: g1.globo.com — matéria sobre mercado de bebidas',
      'Fonte navegada: reclameaqui.com.br — menções à marca',
    ],
  },
  {
    id:          'map_signal',
    label:       'Sinais do Mapa',
    description: 'Pontos, concorrentes, territórios, regiões e pressões competitivas observadas no mapa.',
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
      'Região Sul com menor cobertura de PDV identificada',
      'Concentração de bares sem distribuidora mapeada',
    ],
  },
  {
    id:          'public_reputation',
    label:       'Reputação pública',
    description: 'Sinais públicos de avaliação, percepção, reclamações e presença da marca.',
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
      'Nota Google caiu de 4,3 para 3,9 nos últimos 30 dias',
      'Pico de reclamações na semana do feriado',
    ],
  },
  {
    id:          'google_reviews',
    label:       'Google Avaliações',
    description: 'Fonte monitorável para avaliações públicas, presença local e percepção do cliente.',
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
      'Avaliação recente: "atendimento rápido mas produto sem estoque"',
      'Nota média local: 4,1 vs concorrente: 4,6',
    ],
  },
  {
    id:          'reclame_aqui',
    label:       'Reclame Aqui',
    description: 'Fonte monitorável para reclamações públicas, atendimento e confiança da marca.',
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
    description: 'Menções públicas, imprensa regional, notícias de mercado e movimentos relevantes.',
    origin:      'public',
    mode:        'horizontal',
    status:      'demo',
    category:    'signal',
    screens:     ['feed', 'workspace'],
    isConnected: false,
    isDemo:      true,
    isFuture:    false,
    verticals:   [],
    exampleSignals: [
      'Notícia regional: "cidade recebe evento com 30 mil pessoas no fim de semana"',
      'Imprensa: nova regulação afeta importação de insumos da categoria',
    ],
  },
  {
    id:          'events_signal',
    label:       'Eventos e calendário',
    description: 'Eventos locais, sazonalidade e datas que podem afetar demanda, presença e giro.',
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
      'Carnaval fora de época confirmado na região — demanda de bebidas +40%',
      'Feira setorial prevista para próximo mês: oportunidade de posicionamento',
    ],
  },
  {
    id:          'competitor_signal',
    label:       'Concorrência',
    description: 'Sinais de presença, pressão, expansão ou posicionamento de concorrentes.',
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
      'Concorrente abriu PDV novo no raio de 500m',
      'Marca nacional lançou campanha de preço baixo na região',
    ],
  },
  {
    id:          'official_registry_signal',
    label:       'Registros públicos',
    description: 'Fontes públicas monitoráveis como CNPJ, marcas, registros oficiais e informações institucionais.',
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
      'Alvará de funcionamento renovado — empresa operacional confirmada',
    ],
  },
];

// ── Entradas verticais por API ────────────────────────────────────────────────
// Não conectadas agora. Preparam a arquitetura para integração futura por setor.

const VERTICAL_INPUTS: IntelligenceInput[] = [
  {
    id:          'sales_api',
    label:       'Vendas',
    description: 'Dados de vendas, faturamento, ticket médio, queda, crescimento e performance comercial.',
    origin:      'api',
    mode:        'vertical',
    status:      'api_vertical',
    category:    'internal',
    screens:     ['feed', 'score', 'workspace'],
    isConnected: false,
    isDemo:      false,
    isFuture:    true,
    verticals:   ['beverage_distribution', 'pharmacy_retail', 'food_franchise'],
    exampleSignals: [
      'Venda caiu 18% no canal bares nos últimos 14 dias',
      'Ticket médio subiu em mercados — oportunidade de mix',
    ],
  },
  {
    id:          'inventory_api',
    label:       'Estoque',
    description: 'Dados de estoque, ruptura, excesso, disponibilidade e cobertura operacional.',
    origin:      'api',
    mode:        'vertical',
    status:      'api_vertical',
    category:    'internal',
    screens:     ['feed', 'workspace'],
    isConnected: false,
    isDemo:      false,
    isFuture:    true,
    verticals:   ['beverage_distribution', 'pharmacy_retail'],
    exampleSignals: [
      'Produto pilsen com cobertura crítica — reposição urgente',
      'Estoque de long neck excessivo — risco de vencimento',
    ],
  },
  {
    id:          'crm_api',
    label:       'CRM',
    description: 'Dados de relacionamento, clientes ativos, oportunidades, funil e histórico comercial.',
    origin:      'api',
    mode:        'vertical',
    status:      'api_vertical',
    category:    'internal',
    screens:     ['feed', 'workspace'],
    isConnected: false,
    isDemo:      false,
    isFuture:    true,
    verticals:   ['beverage_distribution'],
    exampleSignals: [
      '14 clientes sem visita há mais de 21 dias',
      'Oportunidade de reativação: bar com histórico de compra alto',
    ],
  },
  {
    id:          'erp_api',
    label:       'ERP',
    description: 'Dados estruturados de operação, financeiro, cadastro, pedidos e gestão interna.',
    origin:      'api',
    mode:        'vertical',
    status:      'api_vertical',
    category:    'internal',
    screens:     ['score', 'workspace'],
    isConnected: false,
    isDemo:      false,
    isFuture:    true,
    verticals:   ['beverage_distribution', 'pharmacy_retail'],
    exampleSignals: [
      'Margem operacional abaixo do target nos últimos 2 meses',
      'Pedidos com atraso de faturamento acima de 5 dias',
    ],
  },
  {
    id:          'pdv_api',
    label:       'PDV',
    description: 'Dados de ponto de venda, giro, recompra, canais, lojas, bares, mercados ou unidades.',
    origin:      'api',
    mode:        'vertical',
    status:      'api_vertical',
    category:    'internal',
    screens:     ['feed', 'map', 'score'],
    isConnected: false,
    isDemo:      false,
    isFuture:    true,
    verticals:   ['beverage_distribution', 'pharmacy_retail'],
    exampleSignals: [
      '3 PDVs sem recompra nos últimos 30 dias — risco de perda de canal',
      'Bar com giro crescente — oportunidade de mix ou exclusividade',
    ],
  },
  {
    id:          'orders_api',
    label:       'Pedidos',
    description: 'Dados de pedidos, frequência, recompra, cancelamento, demanda e comportamento comercial.',
    origin:      'api',
    mode:        'vertical',
    status:      'api_vertical',
    category:    'internal',
    screens:     ['feed', 'workspace'],
    isConnected: false,
    isDemo:      false,
    isFuture:    true,
    verticals:   ['beverage_distribution', 'food_franchise'],
    exampleSignals: [
      'Queda de 22% em pedidos recorrentes na semana',
      'Cancelamento concentrado em canal de entrega — investigar',
    ],
  },
  {
    id:          'logistics_api',
    label:       'Logística',
    description: 'Dados de rotas, entregas, prazos, frota, cobertura e eficiência operacional.',
    origin:      'api',
    mode:        'vertical',
    status:      'api_vertical',
    category:    'internal',
    screens:     ['map', 'feed'],
    isConnected: false,
    isDemo:      false,
    isFuture:    true,
    verticals:   ['beverage_distribution'],
    exampleSignals: [
      'Rota Sul com atraso médio de 2,3h — acima do SLA',
      'Região Leste sem cobertura nos últimos 3 dias',
    ],
  },
  {
    id:          'support_api',
    label:       'Atendimento',
    description: 'Dados de chamados, reclamações internas, tempo de resposta e satisfação.',
    origin:      'api',
    mode:        'vertical',
    status:      'api_vertical',
    category:    'internal',
    screens:     ['score', 'workspace'],
    isConnected: false,
    isDemo:      false,
    isFuture:    true,
    verticals:   ['pharmacy_retail', 'food_franchise'],
    exampleSignals: [
      'Pico de chamados: produto indisponível — correlato com ruptura de estoque',
      'NPS caiu 12 pontos — investigar origem',
    ],
  },
  {
    id:          'reviews_api',
    label:       'Avaliações',
    description: 'Dados conectados de avaliações, notas, comentários e percepção do cliente.',
    origin:      'api',
    mode:        'vertical',
    status:      'api_vertical',
    category:    'reputation',
    screens:     ['score', 'feed'],
    isConnected: false,
    isDemo:      false,
    isFuture:    true,
    verticals:   ['pharmacy_retail', 'food_franchise'],
    exampleSignals: [
      'Avaliação interna média: 3,7 — abaixo da meta de 4,2',
      'Comentários negativos concentrados em "tempo de espera"',
    ],
  },
  {
    id:          'delivery_api',
    label:       'Delivery',
    description: 'Dados de pedidos, tempo de entrega, raio de atendimento, canais digitais e avaliação.',
    origin:      'api',
    mode:        'vertical',
    status:      'api_vertical',
    category:    'internal',
    screens:     ['feed', 'map', 'workspace'],
    isConnected: false,
    isDemo:      false,
    isFuture:    true,
    verticals:   ['food_franchise'],
    exampleSignals: [
      'Tempo médio de entrega: 38 min — 8 min acima da meta',
      'Bairro Centro com alta demanda e nenhum entregador disponível',
    ],
  },
  {
    id:          'routes_api',
    label:       'Rotas',
    description: 'Dados de rotas, cobertura territorial, visitas, frequência comercial e oportunidades por região.',
    origin:      'api',
    mode:        'vertical',
    status:      'api_vertical',
    category:    'territory',
    screens:     ['map', 'feed', 'workspace'],
    isConnected: false,
    isDemo:      false,
    isFuture:    true,
    verticals:   ['beverage_distribution'],
    exampleSignals: [
      'Rota 7 com potencial de +8 PDVs não visitados',
      'Região industrial sem cobertura semanal — oportunidade de expansão',
    ],
  },
  {
    id:          'production_api',
    label:       'Produção',
    description: 'Dados de capacidade produtiva, máquinas, volumes, gargalos e disponibilidade operacional.',
    origin:      'api',
    mode:        'vertical',
    status:      'api_vertical',
    category:    'internal',
    screens:     ['score', 'workspace'],
    isConnected: false,
    isDemo:      false,
    isFuture:    true,
    verticals:   ['beverage_distribution'],
    exampleSignals: [
      'Linha 2 operando a 67% da capacidade — oportunidade de volume',
      'Parada técnica programada: planejar estoque antecipado',
    ],
  },
];

// ── Registry completo ─────────────────────────────────────────────────────────

export const INTELLIGENCE_INPUTS: IntelligenceInput[] = [
  ...HORIZONTAL_INPUTS,
  ...VERTICAL_INPUTS,
];

// Filtros utilitários
export const ACTIVE_INPUTS      = INTELLIGENCE_INPUTS.filter(i => i.status === 'active');
export const DEMO_INPUTS        = INTELLIGENCE_INPUTS.filter(i => i.status === 'demo');
export const FUTURE_INPUTS      = INTELLIGENCE_INPUTS.filter(i => i.status === 'future');
export const VERTICAL_API_INPUTS = INTELLIGENCE_INPUTS.filter(i => i.status === 'api_vertical');

export function getInputsByScreen(screen: IntelligenceTargetScreen): IntelligenceInput[] {
  return INTELLIGENCE_INPUTS.filter(i => i.screens.includes(screen));
}

export function getInputsByVertical(verticalId: string): IntelligenceInput[] {
  return INTELLIGENCE_INPUTS.filter(i => i.verticals.includes(verticalId));
}
