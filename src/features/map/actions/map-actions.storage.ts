// Camada de I/O das ações do mapa OS¹.
//
// Conteúdo movido de src/lib/map-actions.ts (Fase 15). Inclui:
//   - aliases internos `safeRead`/`safeWrite` (envoltórios sobre
//     core/storage/local-storage, mantidos com mesma assinatura usada
//     internamente nos demais módulos)
//   - loaders (apenas o `loadMapFeedCards` é hoje público — os outros
//     são chamados inline dentro dos builders via `safeRead<T>`)
//   - `clearAllMapData` (remoção segura)

import { safeGetJSON, safeSetJSON, safeRemove } from '../../../core/storage/local-storage';
import type { MapFeedCard } from '../../../core/types/map';
import { MAP_LS_KEYS } from './map-actions.catalog';

// Helpers locais foram unificados em core/storage/local-storage.ts.
// Mantemos aliases internos com a mesma assinatura pra não tocar nos
// dezenas de call sites que dependem deles.
export const safeRead = <T,>(key: string, fallback: T): T => safeGetJSON<T>(key, fallback);
export const safeWrite = (key: string, val: unknown): void => { safeSetJSON(key, val); };

// ─── Loaders públicos ────────────────────────────────────────────────────
export function loadMapFeedCards(): MapFeedCard[] { return safeRead(MAP_LS_KEYS.generatedCards, []); }

// ─── Helper opcional: limpar tudo (controle do usuário, LGPD) ───────────
export function clearAllMapData(): void {
  Object.values(MAP_LS_KEYS).forEach(k => safeRemove(k));
}
