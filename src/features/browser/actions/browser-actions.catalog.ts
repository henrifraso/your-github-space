// Catálogo das chaves de localStorage usadas pelas ações do navegador.
//
// Conteúdo movido de src/lib/browser-actions.ts (Fase 13). Mantém os
// nomes EXATOS das chaves — qualquer mudança aqui invalidaria dados
// salvos por versões anteriores.

export const BROWSER_LS_KEYS = {
  evidences: 'os1_browser_evidences',
  missions: 'os1_browser_missions',
  visits: 'os1_browser_session_visits',
  feedCards: 'os1_browser_feed_cards',
  reports: 'os1_browser_session_reports',
  // P4 novas
  watchers: 'os1_browser_watchers',
  dossiers: 'os1_browser_dossiers',
  comparisons: 'os1_browser_tab_comparisons',
  agentAnswers: 'os1_browser_agent_answers',
} as const;
