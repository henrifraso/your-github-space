// Pacotes verticais do OS¹.
//
// Cada pacote representa um setor com suas entradas, sinais,
// dimensões de score, camadas de mapa e análises de workspace específicas.
//
// O OS¹ continua sendo um sistema único.
// A interface, o motor e a lógica são os mesmos.
// O que muda são as fontes de dados que entram no motor.

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
    description: 'Motor vertical para distribuidoras, indústrias e marcas do setor de bebidas. Cruza PDV, rota, giro, estoque, eventos e concorrência territorial.',
    sector:      'bebidas',
    status:      'demo',
    inputs: [
      'sales_api',
      'inventory_api',
      'pdv_api',
      'orders_api',
      'logistics_api',
      'routes_api',
      'production_api',
      'crm_api',
      'events_signal',
      'competitor_signal',
      'map_signal',
      'company_settings',
      'uploaded_file',
    ],
    signalTypes: [
      'sales_drop',
      'inventory_risk',
      'pdv_opportunity',
      'competitive_pressure',
      'route_opportunity',
      'seasonality_signal',
      'demand_signal',
      'territory_opportunity',
    ],
    scoreDimensions: [
      'Giro de produto',
      'Cobertura de estoque',
      'Presença territorial',
      'Pressão competitiva',
      'Demanda por canal',
      'Cobertura de PDV',
      'Reputação da marca',
      'Eficiência de rota',
    ],
    mapLayers: [
      'Bares',
      'Mercados',
      'Atacarejos',
      'Rotas de distribuição',
      'Regiões de evento',
      'Concorrentes',
      'Canais de alto giro',
      'PDVs sem recompra',
    ],
    feedThemes: [
      'Rota e cobertura',
      'PDV e canal',
      'Concorrência',
      'Demanda e sazonalidade',
      'Estoque e reposição',
      'Oportunidade territorial',
      'Giro e performance',
    ],
    workspaceAnalyses: [
      'Análise de rota',
      'Análise de PDV',
      'Análise de giro',
      'Análise de ruptura de estoque',
      'Análise de concorrência',
      'Análise territorial',
      'Análise de demanda por evento',
    ],
    settingsQuestions: [
      'Quais produtos têm maior giro por canal?',
      'Quais rotas são prioridade de cobertura?',
      'Quais canais concentram maior volume de venda?',
      'Qual é a meta de cobertura de PDV?',
      'Quais eventos regionais afetam a demanda?',
    ],
    targetScreens: ['feed', 'score', 'map', 'workspace'],
  },

  {
    id:          'pharmacy_retail',
    label:       'Farmácias e Varejo Farma',
    description: 'Motor vertical para redes de farmácias e varejo farmacêutico. Cruza ruptura de categoria, reputação local, pressão competitiva e demanda sazonal.',
    sector:      'farma',
    status:      'planned',
    inputs: [
      'sales_api',
      'inventory_api',
      'pdv_api',
      'reviews_api',
      'support_api',
      'google_reviews',
      'reclame_aqui',
      'competitor_signal',
      'map_signal',
      'company_settings',
      'uploaded_file',
    ],
    signalTypes: [
      'inventory_risk',
      'competitive_pressure',
      'reputation_signal',
      'seasonality_signal',
      'demand_signal',
      'customer_complaint',
      'territory_opportunity',
    ],
    scoreDimensions: [
      'Disponibilidade de categoria',
      'Reputação local',
      'Pressão de concorrente',
      'Demanda sazonal',
      'Satisfação do cliente',
      'Cobertura de PDV',
      'Presença digital',
    ],
    mapLayers: [
      'Farmácias concorrentes',
      'Raio de atendimento',
      'Regiões de demanda sazonal',
      'Unidades próprias',
      'Pontos de alta reclamação',
    ],
    feedThemes: [
      'Ruptura de categoria',
      'Reputação e avaliação',
      'Concorrência local',
      'Demanda sazonal',
      'Atendimento e satisfação',
      'Oportunidade por região',
    ],
    workspaceAnalyses: [
      'Análise de ruptura',
      'Análise de reputação',
      'Análise de concorrência local',
      'Análise de demanda sazonal',
      'Análise de atendimento',
    ],
    settingsQuestions: [
      'Quais categorias são mais críticas para disponibilidade?',
      'Quais farmácias concorrentes monitorar?',
      'Qual é a meta de nota no Google por unidade?',
      'Quais produtos têm demanda sazonal relevante?',
    ],
    targetScreens: ['feed', 'score', 'map', 'workspace'],
  },

  {
    id:          'food_franchise',
    label:       'Franquias de Alimentação',
    description: 'Motor vertical para redes de alimentação e franquias. Cruza avaliação de unidade, delivery, desvio entre lojas, pressão local e oportunidade de campanha.',
    sector:      'alimentacao',
    status:      'planned',
    inputs: [
      'sales_api',
      'delivery_api',
      'reviews_api',
      'support_api',
      'inventory_api',
      'google_reviews',
      'competitor_signal',
      'map_signal',
      'company_settings',
      'uploaded_file',
    ],
    signalTypes: [
      'sales_drop',
      'demand_signal',
      'reputation_signal',
      'customer_complaint',
      'competitive_pressure',
      'territory_opportunity',
      'seasonality_signal',
    ],
    scoreDimensions: [
      'Ticket médio por unidade',
      'Avaliação de atendimento',
      'Desempenho de delivery',
      'Desvio entre unidades',
      'Pressão competitiva local',
      'Satisfação do cliente',
      'Demanda por região',
    ],
    mapLayers: [
      'Unidades próprias',
      'Concorrentes diretos',
      'Raio de entrega',
      'Regiões de demanda',
      'Unidades com queda de ticket',
    ],
    feedThemes: [
      'Avaliação negativa',
      'Desvio entre unidades',
      'Pressão de concorrente',
      'Oportunidade de campanha',
      'Demanda por região',
      'Desempenho de entrega',
    ],
    workspaceAnalyses: [
      'Análise de avaliação por unidade',
      'Análise de delivery',
      'Análise de desvio entre lojas',
      'Análise de pressão competitiva',
      'Análise de campanha regional',
    ],
    settingsQuestions: [
      'Quais unidades são prioritárias para monitoramento?',
      'Qual é a meta de avaliação Google por loja?',
      'Quais concorrentes diretos acompanhar por região?',
      'Qual é o raio de entrega de cada unidade?',
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
