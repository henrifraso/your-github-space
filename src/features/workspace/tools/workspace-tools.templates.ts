// Helpers compartilhados entre os catálogos de ferramentas.
//
// Cada template de ferramenta consome estes helpers para montar saídas
// consistentes — frase contextual, janela de urgência e aviso sensível.
// Conteúdo movido de src/lib/workspace-tools.ts (Fase 7 — refatoração
// técnica sem alteração de comportamento).

import type { ToolSource, WorkspaceToolContext } from '../../../core/types/workspace';

// ── Áreas sensíveis (linguagem segura obrigatória) ───────────────────
export const SENSITIVE_AREAS = new Set([
  'fiscal', 'contabil', 'contábil', 'juridico', 'jurídico',
  'trabalhista', 'lgpd', 'compliance', 'regulatorio', 'regulatório',
]);

export function isSensitiveDomain(domain?: string, areaMacro?: string): boolean {
  const a = (domain || '').toLowerCase();
  const b = (areaMacro || '').toLowerCase();
  if (SENSITIVE_AREAS.has(a)) return true;
  if (b === 'jurídico-regulatório' || b === 'juridico-regulatorio') return true;
  if (b === 'risco') return true;
  return false;
}

export const SENSITIVE_NOTICE =
  'Área sensível: use esta saída como apoio e valide com o responsável antes de tomar decisão final.';

// ── Helpers de inferência de contexto ────────────────────────────────
export function inferSourceFromCardId(cardId?: string): ToolSource | undefined {
  if (!cardId) return;
  if (cardId.startsWith('synth-map-') || cardId.startsWith('mfc-') || cardId.startsWith('mms-')) return 'map';
  if (cardId.startsWith('synth-browser-') || cardId.startsWith('bfc-') || cardId.startsWith('bw-')) return 'browser';
  if (cardId.startsWith('synth-')) return 'workspace';
  if (cardId.startsWith('ontodiag-')) return 'diagnosis';
  return 'feed';
}

// Frase contextual curta pra ser injetada nos templates
export function ctxPhrase(ctx: WorkspaceToolContext): string {
  const t = ctx.cardTitle || 'o tema em análise';
  const d = ctx.domain || ctx.areaMacro || 'a área relacionada';
  return `${t} (${d})`;
}

// ── Builders de template (reusáveis) ─────────────────────────────────
// Padrão: cada template devolve {title, context, items[5-8], expectedResult, nextStep, sensitiveNotice?}
export function mkSensitive(ctx: WorkspaceToolContext): string | undefined {
  return ctx.isSensitive ? SENSITIVE_NOTICE : undefined;
}

export function urgencyWindow(u?: string): string {
  return u === 'alta' ? '48 a 72 horas' : u === 'media' ? '7 a 14 dias' : '30 dias';
}
