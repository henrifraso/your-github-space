// Catálogo das chaves de localStorage usadas pelas ações do mapa.
//
// Conteúdo movido de src/lib/map-actions.ts (Fase 15). Mantém os
// nomes EXATOS das chaves — qualquer mudança aqui invalidaria dados
// salvos por versões anteriores.

export const MAP_LS_KEYS = {
  generatedCards: 'os1_map_generated_cards',
  missions: 'os1_map_missions',
  opportunities: 'os1_map_opportunities',
  comparisons: 'os1_map_comparisons',
  analyses: 'os1_map_analyses',
  // P5 novas
  watchers: 'os1_map_watchers',
  risks: 'os1_map_risks',
  sectorOpportunities: 'os1_map_sector_opportunities',
  nearbyPartners: 'os1_map_nearby_partners',
  simulations: 'os1_map_simulations',
  // Etapa 9: sinal territorial unificado (cross-action)
  signals: 'os1_map_signals',
} as const;
