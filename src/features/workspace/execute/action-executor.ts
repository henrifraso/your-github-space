// Executor central de ações da Área de Trabalho (W3.1).
//
// W3.1-A: implementa apenas source='workspace' (SUB_BTNS).
// O pipeline é idêntico ao handleSubAction anterior do ChatPanel:
//   useFallback = !sub.endpoint || card._synthetic
//   payload     = { card_id, ...sub.extra }
//   endpoint    = /api/workspace/{sub.endpoint}
//
// Outras origens (shortcut/tool/browser/map/ontology) retornam null
// até que os endpoints correspondentes existam no backend.

import { apiFetch } from '../../../api';
import { buildFallbackForSub } from '../generation/workspace-mode-generators';
import type { WorkspaceBlock } from '../generation/workspace-generation';
import type { ActionContext } from './action-context';

export interface ExecuteResult {
  block: WorkspaceBlock;
  /** true quando o resultado veio de fallback local (template ou card sintético). */
  usedFallback: boolean;
}

export async function executeAction(context: ActionContext): Promise<ExecuteResult | null> {
  if (context.source === 'workspace') {
    return _executeWorkspace(context);
  }
  // Origens ainda não conectadas (W3.1-B/C/D/E+)
  return null;
}

async function _executeWorkspace(context: ActionContext): Promise<ExecuteResult | null> {
  const { card, mode, sub, dificuldade = 'facil' } = context;
  if (!card || !mode || !sub) return null;

  const blockId = `blk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  // Regra de fallback preservada exatamente: sem endpoint OU card sintético.
  const useFallback = !sub.endpoint || !!card._synthetic;
  let result: Record<string, unknown>;

  if (useFallback) {
    await new Promise(r => setTimeout(r, 300));
    result = buildFallbackForSub(card, sub, dificuldade);
  } else {
    try {
      // Payload idêntico ao pipeline original dos SUB_BTNS.
      result = await apiFetch<Record<string, unknown>>(`/api/workspace/${sub.endpoint}`, {
        method: 'POST',
        body: JSON.stringify({ card_id: card.id, ...(sub.extra || {}) }),
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Falha ao conectar';
      result = { erro: msg };
    }
  }

  const block: WorkspaceBlock = {
    id:         blockId,
    cardId:     card.id,
    mode,
    subKey:     sub.key,
    subLabel:   sub.label,
    endpoint:   sub.endpoint,
    extra:      sub.extra,
    result,
    difficulty: dificuldade,
    pinned:     false,
    createdAt:  new Date().toISOString(),
  };

  return { block, usedFallback: useFallback };
}
