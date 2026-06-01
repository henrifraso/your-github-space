// Camada de sessão de navegação + canal de saída de eventos.
//
// Conteúdo movido de src/lib/browser-actions.ts (Fase 13):
//   - `recordVisit`              registra cada URL única visitada nesta
//                                sessão (alimenta `buildSessionReport`)
//   - `dispatchBrowserAction`    canal de saída para `App.tsx` ponte com
//                                workspace/feed via OS1_EVENTS.BROWSER_ACTION
//
// Os tipos vêm de core/types/browser.ts e os eventos de core/events/os1-events.ts.

import { dispatchOS1Event, OS1_EVENTS } from '../../../core/events/os1-events';
import type { BrowserActionEventDetail } from '../../../core/types/browser';
import { BROWSER_LS_KEYS } from './browser-actions.catalog';
import { safeWrite, loadSessionVisits } from './browser-actions.storage';

// ─── Histórico de visitas (alimenta análise de sessão) ───────────────────
export function recordVisit(url: string, title: string): void {
  if (!url || !/^https?:\/\//i.test(url)) return;
  const all = loadSessionVisits();
  // Evita registrar a mesma URL N vezes seguidas em rajada de eventos.
  if (all[0]?.url === url) return;
  all.unshift({ url, title: title || url, visitedAt: new Date().toISOString() });
  safeWrite(BROWSER_LS_KEYS.visits, all.slice(0, 200));
}

// ─── Dispatcher unificado pra emitir o evento ────────────────────────────
export function dispatchBrowserAction(detail: BrowserActionEventDetail): void {
  dispatchOS1Event<BrowserActionEventDetail>(OS1_EVENTS.BROWSER_ACTION, detail);
}
