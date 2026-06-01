// Histórico da Área de Trabalho — helpers puros.
//
// Hoje o histórico vive apenas em state React (App.tsx mantém um
// `archivedSessionsBySector`). Não há persistência em localStorage —
// uma reload da página zera o histórico. Esta fase apenas centraliza
// tipos e helpers puros; comportamento e formato seguem idênticos.
//
// Quando/se a persistência for adicionada no futuro, basta plugar os
// helpers `safeGetJSON`/`safeSetJSON` de `core/storage/local-storage`
// em uma camada de persistência — sem mudar a API dos helpers daqui.
//
// Conteúdo movido conceitualmente de:
//   - src/App.tsx (state `archivedSessionsBySector` e callbacks
//     `onArchive`)
//   - src/components/ChatPanel.tsx (callback `restoreSession` e
//     renderização da lista no `chatHistoryOpen`)

import type { IntelligenceCard } from '../../../core/types/card';
import type { MainKey } from '../generation/workspace-generation';

// Snapshot do que era exibido na Área de Trabalho no momento do arquivamento.
// `Msg` é genérico porque o tipo `Message` é interno do ChatPanel.
export interface WorkspaceSessionSnapshot<Msg = unknown> {
  messages: Msg[];
  activeCard: IntelligenceCard | null;
  activeMode: MainKey | null;
}

// Entrada arquivada — o ID é uma string `Date.now()`, o `ts` é o número.
// Mantemos exatamente o shape que já existe hoje em runtime.
export interface ArchivedSession<Msg = unknown> {
  id: string;
  ts: number;
  cardTitle: string;
  sector: string;
  snapshot?: WorkspaceSessionSnapshot<Msg>;
}

// Estado consolidado de histórico por setor/perfil. Mesma assinatura
// que o `archivedSessionsBySector` em App.tsx.
export type HistoryBucket<Msg = unknown> = Record<string, ArchivedSession<Msg>[]>;

// ─── Constantes / convenções ────────────────────────────────────────
// Setor padrão quando o caller não souber qual está ativo. Mantém
// equivalência com `activeSector ?? 'os1'` espalhado no código atual.
export const DEFAULT_HISTORY_SECTOR = 'os1';

// ─── Helpers puros ──────────────────────────────────────────────────

/**
 * Cria uma sessão arquivada com `id` e `ts` derivados de `Date.now()`.
 * Mantém EXATAMENTE o padrão existente em App.tsx: `id = String(Date.now())`,
 * `ts = Date.now()`. Não toca em localStorage.
 */
export function createArchivedSession<Msg>(
  cardTitle: string,
  sector: string,
  snapshot?: WorkspaceSessionSnapshot<Msg>,
): ArchivedSession<Msg> {
  const now = Date.now();
  return {
    id: `${now}`,
    ts: now,
    cardTitle,
    sector,
    snapshot,
  };
}

/**
 * Devolve uma cópia imutável de `bucket` com `session` adicionada ao
 * setor `sector`. Espelha o padrão atual:
 *     setArchivedSessionsBySector(prev => ({
 *       ...prev,
 *       [sector]: [...(prev[sector] ?? []), newSession],
 *     }))
 */
export function appendSession<Msg>(
  bucket: HistoryBucket<Msg>,
  session: ArchivedSession<Msg>,
): HistoryBucket<Msg> {
  return {
    ...bucket,
    [session.sector]: [...(bucket[session.sector] ?? []), session],
  };
}

/**
 * Lê sessões arquivadas do setor `sector`. Sempre devolve um array
 * (nunca `undefined`) — mantém o `?? []` do call site atual em App.tsx.
 */
export function getSessionsForSector<Msg>(
  bucket: HistoryBucket<Msg>,
  sector: string,
): ArchivedSession<Msg>[] {
  return bucket[sector] ?? [];
}

/**
 * Remove uma sessão por `id` dentro de um setor. Imutável.
 * Não é usado em produção ainda; disponível pra futuro botão "remover
 * conversa anterior".
 */
export function removeSession<Msg>(
  bucket: HistoryBucket<Msg>,
  sector: string,
  id: string,
): HistoryBucket<Msg> {
  const current = bucket[sector];
  if (!current) return bucket;
  const next = current.filter(s => s.id !== id);
  if (next.length === current.length) return bucket;
  return { ...bucket, [sector]: next };
}

/**
 * Zera o histórico de um setor. Imutável.
 * Não é usado em produção ainda; pronto para futuro botão "limpar
 * histórico desta empresa".
 */
export function clearSector<Msg>(
  bucket: HistoryBucket<Msg>,
  sector: string,
): HistoryBucket<Msg> {
  if (!bucket[sector]) return bucket;
  const next = { ...bucket };
  delete next[sector];
  return next;
}
