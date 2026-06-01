// ─────────────────────────────────────────────────────────────────────
// Fachada das Ações do Navegador OS¹ (10 funções).
//
// Conteúdo real foi separado em módulos menores na Fase 13:
//   src/features/browser/actions/
//     browser-actions.types.ts      — re-export dos tipos públicos
//     browser-actions.catalog.ts    — BROWSER_LS_KEYS (chaves localStorage)
//     browser-actions.storage.ts    — loaders, aliases safeRead/safeWrite, clearAllBrowserData
//     browser-actions.builders.ts   — 10 builders (saveEvidence, buildMission, ...)
//     browser-actions.session.ts    — recordVisit + dispatchBrowserAction
//
// Imports antigos `from '../lib/browser-actions'` continuam funcionando
// — todos os símbolos públicos saem daqui.
//
// COMENTÁRIO TÉCNICO (preservado):
// Fase 5 — 5 funções universais do navegador interno.
// Cada função:
//  1. é manual (usuário clica explicitamente — sem captura invisível);
//  2. salva localmente quando não há backend equivalente;
//  3. emite CustomEvent pra que o App.tsx ponte com workspace/feed.
// ─────────────────────────────────────────────────────────────────────

// Tipos
export type {
  BrowserActionContext, BrowserEvidence, BrowserMission, BrowserSessionVisit,
  BrowserFeedCard, BrowserSessionReport, BrowserActionType, BrowserWatcher,
  BrowserDossier, BrowserTabComparison, BrowserSectorAgentAnswer,
  BrowserActionEventDetail,
} from '../core/types/browser';

// Catálogo de chaves
export { BROWSER_LS_KEYS } from '../features/browser/actions/browser-actions.catalog';

// Storage: loaders + clear
export {
  loadEvidences,
  loadMissions,
  loadSessionVisits,
  loadBrowserFeedCards,
  loadSessionReports,
  loadTabComparisons,
  loadWatchers,
  loadDossiers,
  loadAgentAnswers,
  clearAllBrowserData,
} from '../features/browser/actions/browser-actions.storage';

// Builders das 10 ações
export {
  saveEvidence,
  buildMission,
  buildFeedCard,
  buildSessionReport,
  buildTabComparison,
  addWatcher,
  captureSnippet,
  getOrCreateDossier,
  addPageToDossier,
  quickAddToSectorDossier,
  buildSectorAgentAnswer,
} from '../features/browser/actions/browser-actions.builders';

// Sessão + dispatcher de evento
export {
  recordVisit,
  dispatchBrowserAction,
} from '../features/browser/actions/browser-actions.session';
