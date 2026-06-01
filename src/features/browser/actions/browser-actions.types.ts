// Tipos das Ações do Navegador OS¹ — re-export central.
//
// Os tipos canônicos vivem em `core/types/browser.ts` (movidos na Fase 3).
// Este arquivo existe pra que o módulo `features/browser/actions/` tenha
// seu próprio ponto de entrada de tipos, conforme convenção da pasta.

export type {
  BrowserActionContext, BrowserEvidence, BrowserMission, BrowserSessionVisit,
  BrowserFeedCard, BrowserSessionReport, BrowserActionType, BrowserWatcher,
  BrowserDossier, BrowserTabComparison, BrowserSectorAgentAnswer,
  BrowserActionEventDetail,
} from '../../../core/types/browser';
