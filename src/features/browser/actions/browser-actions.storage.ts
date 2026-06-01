// Camada de I/O das ações do navegador OS¹.
//
// Conteúdo movido de src/lib/browser-actions.ts (Fase 13). Inclui:
//   - aliases internos `safeRead`/`safeWrite` (envoltórios sobre
//     core/storage/local-storage, mantidos com mesma assinatura usada
//     internamente nos demais módulos)
//   - todos os `load*` (somente leitura)
//   - `clearAllBrowserData` (remoção segura)
//
// Builders e o dispatcher de evento vivem em arquivos irmãos:
//   - browser-actions.builders.ts
//   - browser-actions.session.ts

import { safeGetJSON, safeSetJSON, safeRemove } from '../../../core/storage/local-storage';
import type {
  BrowserEvidence, BrowserMission, BrowserSessionVisit, BrowserFeedCard,
  BrowserSessionReport, BrowserTabComparison, BrowserWatcher, BrowserDossier,
  BrowserSectorAgentAnswer,
} from '../../../core/types/browser';
import { BROWSER_LS_KEYS } from './browser-actions.catalog';

// Helpers locais foram unificados em core/storage/local-storage.ts.
// Mantemos aliases internos com a mesma assinatura pra não tocar nos
// dezenas de call sites que dependem deles.
export const safeRead = <T,>(key: string, fallback: T): T => safeGetJSON<T>(key, fallback);
export const safeWrite = (key: string, val: unknown): void => { safeSetJSON(key, val); };

// ─── Loaders (somente leitura) ───────────────────────────────────────────
export function loadEvidences(): BrowserEvidence[] { return safeRead(BROWSER_LS_KEYS.evidences, []); }
export function loadMissions(): BrowserMission[] { return safeRead(BROWSER_LS_KEYS.missions, []); }
export function loadSessionVisits(): BrowserSessionVisit[] { return safeRead(BROWSER_LS_KEYS.visits, []); }
export function loadBrowserFeedCards(): BrowserFeedCard[] { return safeRead(BROWSER_LS_KEYS.feedCards, []); }
export function loadSessionReports(): BrowserSessionReport[] { return safeRead(BROWSER_LS_KEYS.reports, []); }
export function loadTabComparisons(): BrowserTabComparison[] { return safeRead(BROWSER_LS_KEYS.comparisons, []); }
export function loadWatchers(): BrowserWatcher[] { return safeRead(BROWSER_LS_KEYS.watchers, []); }
export function loadDossiers(): BrowserDossier[] { return safeRead(BROWSER_LS_KEYS.dossiers, []); }
export function loadAgentAnswers(): BrowserSectorAgentAnswer[] { return safeRead(BROWSER_LS_KEYS.agentAnswers, []); }

// ─── Helper opcional: limpar tudo (controle do usuário, LGPD) ───────────
export function clearAllBrowserData(): void {
  Object.values(BROWSER_LS_KEYS).forEach(k => safeRemove(k));
}
