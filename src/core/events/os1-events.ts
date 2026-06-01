// Eventos globais do OS¹.
//
// Centraliza nomes e helpers usados entre App, Navegador, Mapa, Esfera e
// Área de Trabalho. Nenhum nome muda — só sai de string solta espalhada
// em N arquivos para um único módulo importado.
//
// Os payloads (CustomEvent.detail) continuam exatamente os mesmos que
// hoje. Os tipos abaixo são *referência* — quem dispara/escuta segue
// montando o detail manualmente; nada de wrapping silencioso.
//
// NÃO inclui o protocolo interno do iframe browser (omni-nav,
// omni-loading) — isso é detalhe da feature/browser, não evento OS¹.

import type { BrowserActionEventDetail } from '../types/browser';
import type { MapActionEventDetail } from '../types/map';
import type {
  CompanyOntologyDiagnosis,
  DiagnosisCardSuggestion,
} from '../types/ontology';

// ─── Custom events (window.dispatchEvent / addEventListener) ───────
export const OS1_EVENTS = {
  /** Disparado por browser-actions quando o usuário executa uma das 10 ações. */
  BROWSER_ACTION:               'os1:browser-action',
  /** Disparado por map-actions quando o usuário executa uma das 10 ações. */
  MAP_ACTION:                   'os1:map-action',
  /** Disparado pelo motor de diagnóstico ao concluir a análise da empresa. */
  ONTOLOGY_DIAGNOSIS:           'os1:ontology-diagnosis',
  /** Disparado pelo overlay legado de diagnóstico — injeta cards no feed. */
  ONTOLOGY_DIAGNOSIS_TO_FEED:   'os1:ontology-diagnosis-cards-to-feed',
} as const;

export type OS1EventName = typeof OS1_EVENTS[keyof typeof OS1_EVENTS];

// Mapeia cada nome de evento ao shape do `detail` que ele carrega hoje.
// Usado só como referência tipada — não inferimos automaticamente nos
// helpers para manter o boilerplate de cada call site idêntico.
export interface OS1EventDetailMap {
  [OS1_EVENTS.BROWSER_ACTION]:             BrowserActionEventDetail;
  [OS1_EVENTS.MAP_ACTION]:                 MapActionEventDetail;
  [OS1_EVENTS.ONTOLOGY_DIAGNOSIS]:         CompanyOntologyDiagnosis;
  [OS1_EVENTS.ONTOLOGY_DIAGNOSIS_TO_FEED]: DiagnosisCardSuggestion[];
}

// ─── postMessage (cross-frame) ─────────────────────────────────────
// A esfera é renderizada em iframe; pode (no futuro) postar uma
// mensagem `OS1_ANALYZE_COMPANY` pra disparar a análise. O App já
// escuta isso desde a fase do diagnóstico via Área de Trabalho.
export const OS1_POST_MESSAGE = {
  ANALYZE_COMPANY: 'OS1_ANALYZE_COMPANY',
} as const;

export type OS1PostMessageType = typeof OS1_POST_MESSAGE[keyof typeof OS1_POST_MESSAGE];

// ─── helpers ───────────────────────────────────────────────────────
function hasWindow(): boolean {
  try { return typeof window !== 'undefined'; } catch { return false; }
}

/**
 * Dispara um CustomEvent global. Wrapper enxuto sobre
 * `window.dispatchEvent(new CustomEvent(name, { detail }))`.
 *
 * Não trata payload — passa adiante exatamente como recebido.
 * Não lança erro se `window` não existir.
 */
export function dispatchOS1Event<D = unknown>(name: OS1EventName | string, detail: D): void {
  if (!hasWindow()) return;
  try {
    window.dispatchEvent(new CustomEvent(name, { detail }));
  } catch {
    /* ignore */
  }
}

/**
 * Registra um listener para um evento OS¹. Devolve a função de
 * unsubscribe — útil pra usar direto em `useEffect`:
 *
 *     useEffect(() => addOS1EventListener(OS1_EVENTS.MAP_ACTION, h), []);
 *
 * O handler recebe o CustomEvent inteiro (com `event.detail`),
 * preservando a semântica atual dos listeners em App.tsx.
 */
export function addOS1EventListener(
  name: OS1EventName | string,
  handler: (event: Event) => void,
): () => void {
  if (!hasWindow()) return () => {};
  try {
    window.addEventListener(name, handler as EventListener);
    return () => {
      try { window.removeEventListener(name, handler as EventListener); }
      catch { /* ignore */ }
    };
  } catch {
    return () => {};
  }
}
