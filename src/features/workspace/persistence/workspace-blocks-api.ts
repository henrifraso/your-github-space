import { apiFetch, getOrgContext } from '../../../api';
import type { WorkspaceBlock } from '../generation/workspace-generation';

function _isSynth(cardId: string): boolean {
  return cardId.startsWith('synth-');
}

interface _StoredPayload {
  result: Record<string, unknown>;
  mode: string;
  subLabel: string;
  difficulty: string;
}

/**
 * Salva bloco gerado no backend. Fire-and-forget — erros são silenciosos.
 * Não salva: card sintético, sem endpoint (fallback local), resultado com erro.
 */
export function saveWorkspaceBlock(block: WorkspaceBlock, cardTitle: string): void {
  if (_isSynth(block.cardId)) return;
  if (!block.endpoint) return;
  if ('erro' in block.result) return;

  const { orgId, buId } = getOrgContext();
  if (!orgId || !buId) return;

  const payload: _StoredPayload = {
    result:    block.result,
    mode:      block.mode,
    subLabel:  block.subLabel,
    difficulty: block.difficulty,
  };

  apiFetch('/api/workspace/blocks', {
    method: 'POST',
    body: JSON.stringify({
      org_id:     orgId,
      bu_id:      buId,
      card_id:    block.cardId,
      card_title: cardTitle,
      source:     'feed',
      block_kind: block.kind ?? 'standard',
      endpoint:   block.endpoint,
      sub_key:    block.subKey,
      block_json: JSON.stringify(payload),
    }),
  }).catch(() => { /* fail-soft */ });
}

/**
 * Recupera o último bloco salvo para um card.
 * Retorna null se não houver registro ou em caso de erro (fail-soft).
 */
export async function loadLastWorkspaceBlock(
  cardId: string,
): Promise<WorkspaceBlock | null> {
  if (_isSynth(cardId)) return null;

  const { orgId, buId } = getOrgContext();
  if (!orgId || !buId) return null;

  try {
    const rows = await apiFetch<Array<{
      id: string;
      card_id: string;
      endpoint: string | null;
      sub_key: string | null;
      block_kind: string;
      block_json: string;
      created_at: string;
    }>>(`/api/workspace/blocks?card_id=${encodeURIComponent(cardId)}`);

    if (!Array.isArray(rows) || rows.length === 0) return null;

    const row = rows[0];
    let payload: Partial<_StoredPayload> = {};
    try { payload = JSON.parse(row.block_json); } catch { return null; }

    if (!payload.result || typeof payload.result !== 'object') return null;

    return {
      id:         `persisted-${row.id}`,
      cardId:     row.card_id,
      mode:       (payload.mode as WorkspaceBlock['mode']) ?? 'executar',
      subKey:     row.sub_key ?? '',
      subLabel:   payload.subLabel ?? '',
      endpoint:   (row.endpoint as WorkspaceBlock['endpoint']) ?? null,
      result:     payload.result,
      difficulty: (payload.difficulty as WorkspaceBlock['difficulty']) ?? 'facil',
      pinned:     false,
      createdAt:  row.created_at,
      kind:       (row.block_kind as WorkspaceBlock['kind']) ?? 'standard',
    };
  } catch {
    return null;
  }
}
