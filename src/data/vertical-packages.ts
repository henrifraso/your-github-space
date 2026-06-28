// Pacotes verticais do OS¹.
//
// Cada pacote define quais fontes externas de mercado o motor prioriza
// para um setor específico. A interface, o motor e a lógica são os mesmos.
// O que muda de um setor para outro não é a tela —
// são as fontes, entidades, sinais e perguntas que o motor acompanha.

import type { SignalType } from './intelligence-signals';
import type { IntelligenceTargetScreen } from './intelligence-inputs';

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type VerticalStatus = 'active' | 'demo' | 'planned';

export interface VerticalIntelligencePackage {
  id:                  string;
  label:               string;
  description:         string;
  sector:              string;
  status:              VerticalStatus;
  inputs:              string[];           // IDs de intelligence-inputs.ts
  signalTypes:         SignalType[];       // tipos de sinal que este vertical gera
  scoreDimensions:     string[];          // dimensões do score específicas do setor
  mapLayers:           string[];          // camadas do mapa disponíveis
  feedThemes:          string[];          // temas de card no feed
  workspaceAnalyses:   string[];          // lentes de análise disponíveis na Área de Trabalho
  settingsQuestions:   string[];          // perguntas extra na Configuração da Empresa
  targetScreens:       IntelligenceTargetScreen[];
}

// ── Pacotes ───────────────────────────────────────────────────────────────────

export const VERTICAL_PACKAGES: VerticalIntelligencePackage[] = [
  {
    id:          'beverage_distribution',
    label:       'Bebidas e Distribuição',
    description: 'Pacote de inteligência externa para distribuidoras e marcas de bebidas. Prioriza eventos, preços públicos, concorrência territorial, tendências e sazonalidade.',
    sector:      'bebidas',
    status:      'demo',
    inputs: [
      'map_signal',
      'events_signal',
      'competitor_signal',
      'pricing_public_signals',
      'marketplace_public_signals',
      'social_public_signal',
      'news_signal',
      'weather_seasonality',
      'market_trends',
      'brand_mentions',
      'official_registry_signal',
      'company_settings',
      'uploaded_file',
      'browser_url',
    ],
    signalTypes: [
      'competitive_movement',
      'market_opportunity',
      'territorial_gap',
      'event_signal',
      'seasonality_signal',
      'pricing_signal',
      'public_demand_signal',
      'trend_signal',
    ],
    scoreDimensions: [
      'Presença territorial',
      'Pressão competitiva',
      'Visibilidade de marca',
      'Tendência de demanda',
      'Oportunidade de canal',
      'Reputação pública',
      'Cobertura de mercado',
      'Sazonalidade e eventos',
    ],
    mapLayers: [
      'Bares e restaurantes',
      'Mercados e atacarejos',
      'Concorrentes visíveis',
      'Regiões de evento',
      'Lacunas territoriais',
      'Pontos de alta presença',
      'Rotas de entrega pública',
    ],
    feedThemes: [
      'Concorrência e posicionamento',
      'Eventos e sazonalidade',
      'Oportunidade territorial',
      'Tendência de mercado',
      'Preços e canais públicos',
      'Reputação e menções',
    ],
    workspaceAnalyses: [
      'Análise de oportunidade territorial',
      'Análise de concorrência regional',
      'Análise de demanda por evento',
      'Análise de tendência de categoria',
      'Análise de presença competitiva',
      'Análise de sazonalidade',
    ],
    settingsQuestions: [
      'Quais regiões são prioritárias para crescimento?',
      'Quais marcas concorrentes acompanhar?',
      'Quais eventos regionais afetam a demanda?',
      'Quais canais de venda são mais relevantes?',
      'Quais marcas ou produtos monitorar em preço público?',
    ],
    targetScreens: ['feed', 'score', 'map', 'workspace'],
  },

  {
    id:          'pharmacy_retail',
    label:       'Farmácias e Varejo Farma',
    description: 'Pacote de inteligência externa para redes de farmácias. Prioriza reputação pública, concorrência local, demanda sazonal, preços e registros públicos.',
    sector:      'farma',
    status:      'planned',
    inputs: [
      'maps_places',
      'public_reviews',
      'reclame_aqui',
      'google_reviews',
      'news_signal',
      'market_trends',
      'official_registry_signal',
      'pricing_public_signals',
      'competitor_signal',
      'map_signal',
      'weather_seasonality',
      'seo_visibility',
      'brand_mentions',
      'company_settings',
      'uploaded_file',
    ],
    signalTypes: [
      'competitive_movement',
      'reputation_signal',
      'seasonality_signal',
      'public_demand_signal',
      'customer_complaint',
      'territorial_gap',
      'pricing_signal',
      'regulatory_signal',
    ],
    scoreDimensions: [
      'Reputação pública',
      'Pressão competitiva',
      'Demanda sazonal',
      'Presença digital',
      'Visibilidade em busca',
      'Cobertura territorial',
      'Menções da marca',
    ],
    mapLayers: [
      'Farmácias concorrentes',
      'Raio de atendimento',
      'Regiões de demanda sazonal',
      'Lacunas de cobertura',
      'Pontos de alta concentração',
    ],
    feedThemes: [
      'Reputação e avaliação',
      'Concorrência local',
      'Demanda sazonal',
      'Oportunidade territorial',
      'Preços e marketplaces',
      'Regulação e registros',
    ],
    workspaceAnalyses: [
      'Análise de reputação pública',
      'Análise de concorrência local',
      'Análise de demanda sazonal',
      'Análise de presença territorial',
      'Análise de visibilidade em busca',
    ],
    settingsQuestions: [
      'Quais farmácias concorrentes monitorar por região?',
      'Quais categorias têm maior demanda sazonal?',
      'Quais regiões são prioritárias para expansão?',
      'Quais marcas monitorar em preço público?',
    ],
    targetScreens: ['feed', 'score', 'map', 'workspace'],
  },

  {
    id:          'food_franchise',
    label:       'Franquias de Alimentação',
    description: 'Pacote de inteligência externa para redes e franquias de alimentação. Prioriza reputação pública, delivery, concorrência local, eventos e anúncios visíveis.',
    sector:      'alimentacao',
    status:      'planned',
    inputs: [
      'map_signal',
      'public_reputation',
      'google_reviews',
      'social_public_signal',
      'events_signal',
      'competitor_signal',
      'marketplace_public_signals',
      'market_trends',
      'news_signal',
      'ads_public_signals',
      'brand_mentions',
      'company_settings',
      'uploaded_file',
      'browser_url',
    ],
    signalTypes: [
      'competitive_movement',
      'reputation_signal',
      'public_demand_signal',
      'customer_complaint',
      'event_signal',
      'territorial_gap',
      'trend_signal',
      'brand_visibility_signal',
    ],
    scoreDimensions: [
      'Reputação pública por unidade',
      'Presença em delivery',
      'Pressão competitiva local',
      'Visibilidade em busca',
      'Menções da marca',
      'Demanda por região',
      'Eventos e sazonalidade',
    ],
    mapLayers: [
      'Unidades próprias',
      'Concorrentes diretos',
      'Raio de entrega visível',
      'Regiões de alta demanda',
      'Lacunas de cobertura',
    ],
    feedThemes: [
      'Reputação e avaliação',
      'Concorrência local',
      'Eventos e demanda',
      'Presença em delivery',
      'Oportunidade territorial',
      'Anúncios de concorrentes',
    ],
    workspaceAnalyses: [
      'Análise de reputação por unidade',
      'Análise de presença em delivery',
      'Análise de concorrência local',
      'Análise de eventos e demanda',
      'Análise de visibilidade pública',
    ],
    settingsQuestions: [
      'Quais regiões são prioritárias para monitorar?',
      'Quais concorrentes diretos acompanhar?',
      'Quais plataformas de delivery monitorar?',
      'Quais eventos locais afetam o fluxo de clientes?',
    ],
    targetScreens: ['feed', 'score', 'map', 'workspace'],
  },
];

// Filtros utilitários
export const ACTIVE_PACKAGES  = VERTICAL_PACKAGES.filter(p => p.status === 'active');
export const DEMO_PACKAGES    = VERTICAL_PACKAGES.filter(p => p.status === 'demo');
export const PLANNED_PACKAGES = VERTICAL_PACKAGES.filter(p => p.status === 'planned');

export function getPackageById(id: string): VerticalIntelligencePackage | undefined {
  return VERTICAL_PACKAGES.find(p => p.id === id);
}

export function getPackageInputIds(id: string): string[] {
  return getPackageById(id)?.inputs ?? [];
}
