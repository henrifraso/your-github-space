// Cliente HTTP de missões (P10 v1, bloco GM1-B).
//
// Mesmo padrão de `governance-client.ts` (GA3):
//   - Bearer JWT do user logado (`localStorage.os1_token`);
//   - Nunca usa chaves admin — essas vivem no Railway, fora do frontend;
//   - Nunca toca em rotas admin-only — usa exclusivamente endpoints
//     Bearer públicos sob `/api/governance/missions` e `/api/feed/missions`;
//   - Retorna `Result<T>` discriminado por status para o caller decidir
//     se mostra UI, esconde silenciosamente ou exibe erro.
//
// Endpoints (criados em GM1-A — commit backend e1465e9):
//   POST /api/governance/missions                      (matriz)
//   GET  /api/governance/missions                      (matriz)
//   GET  /api/governance/missions/{mission_id}         (matriz OU unit dona)
//   POST /api/governance/missions/{mission_id}/status  (matriz OU unit dona)
//   GET  /api/feed/missions                            (qualquer Bearer; escopo automático)

import { getAuthState } from '../../hooks/useAuth';
import type {
  Mission,
  MissionCreateInput,
  MissionDetailResponse,
  MissionListResponse,
  MissionStatusEvent,
  MissionStatusUpdateInput,
} from '../../core/types/mission';

const REQUEST_TIMEOUT_MS = 8000;

// ── Result discriminado (idêntico ao governance-client) ──────────────────

export type Result<T> =
  | { status: 'ok'; data: T }
  | { status: 'unauthenticated' }
  | { status: 'forbidden' }
  | { status: 'not_found' }
  | { status: 'error'; message: string };


// ── Helpers ──────────────────────────────────────────────────────────────

async function fetchWithTimeout(url: string, init: RequestInit, ms: number): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

function authHeaders(): Record<string, string> | null {
  const { token } = getAuthState();
  if (!token) return null;
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

function mapErrorStatus(httpStatus: number): Result<never> {
  if (httpStatus === 401) return { status: 'unauthenticated' };
  if (httpStatus === 403) return { status: 'forbidden' };
  if (httpStatus === 404) return { status: 'not_found' };
  return { status: 'error', message: `HTTP ${httpStatus}` };
}

async function call<T>(
  method: 'GET' | 'POST',
  path: string,
  body?: unknown,
): Promise<Result<T>> {
  const headers = authHeaders();
  if (!headers) return { status: 'unauthenticated' };
  try {
    const r = await fetchWithTimeout(
      path,
      {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      },
      REQUEST_TIMEOUT_MS,
    );
    if (!r.ok) return mapErrorStatus(r.status);
    const json = await r.json().catch(() => ({}));
    // Endpoints novos retornam { ok, data: ... } — extraímos `data`.
    const data = (json && typeof json === 'object' && 'data' in (json as object))
      ? (json as { data: T }).data
      : (json as T);
    return { status: 'ok', data };
  } catch (e) {
    return { status: 'error', message: e instanceof Error ? e.message : 'fetch_failed' };
  }
}

function buildQuery<P extends object>(params: P): string {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params as Record<string, unknown>)) {
    if (v === undefined || v === null || v === '') continue;
    usp.set(k, String(v));
  }
  const s = usp.toString();
  return s ? `?${s}` : '';
}


// ── Parâmetros públicos ──────────────────────────────────────────────────

export interface ListGovernanceMissionsParams {
  organizationId: string;
  unitId?:        string;
  cardId?:        string;
  status?:        string;
  limit?:         number;
  offset?:        number;
}

export interface ListFeedMissionsParams {
  organizationId: string;
  unitId?:        string;
  status?:        string;
  limit?:         number;
  offset?:        number;
}


// ── Endpoints ────────────────────────────────────────────────────────────

/**
 * Lista missões da org (visão matriz). 403 se o user não for matriz.
 *
 * GET /api/governance/missions?organizationId=...&unitId=...&cardId=...&status=...
 */
export async function listGovernanceMissions(
  params: ListGovernanceMissionsParams,
): Promise<Result<MissionListResponse>> {
  return call<MissionListResponse>('GET', `/api/governance/missions${buildQuery(params)}`);
}

/**
 * Detalhe da missão + histórico ordenado. Permitido para matriz OU
 * membro da unit dona (validação no backend via authz.require_can_view_mission).
 *
 * GET /api/governance/missions/{mission_id}
 */
export async function getMission(
  missionId: string,
): Promise<Result<MissionDetailResponse>> {
  return call<MissionDetailResponse>(
    'GET',
    `/api/governance/missions/${encodeURIComponent(missionId)}`,
  );
}

/**
 * Feed de missões da loja. Backend escopa automaticamente:
 *   - matriz → todas as missões da org (com filtro opcional unitId)
 *   - não-matriz → só missões atribuídas às units do user
 *
 * GET /api/feed/missions?organizationId=...&unitId=...&status=...
 */
export async function listFeedMissions(
  params: ListFeedMissionsParams,
): Promise<Result<MissionListResponse>> {
  return call<MissionListResponse>('GET', `/api/feed/missions${buildQuery(params)}`);
}

/**
 * Cria missão. Matriz only (backend gateado por authz.require_can_create_mission).
 * GM1-B: função implementada, mas **não chamada automaticamente em prod**.
 * Será consumida pela UI da matriz na fase GM1-C.
 *
 * POST /api/governance/missions
 */
export async function createMission(
  input: MissionCreateInput,
): Promise<Result<Mission>> {
  return call<Mission>('POST', '/api/governance/missions', input);
}

/**
 * Anexa evento de mudança de status (append-only no backend). Permitido
 * para matriz ou unit dona, com transições gateadas.
 * GM1-B: função implementada, mas **não chamada automaticamente em prod**.
 * Será consumida pela UI da loja na fase GM1-D.
 *
 * POST /api/governance/missions/{mission_id}/status
 */
export async function updateMissionStatus(
  missionId: string,
  input: MissionStatusUpdateInput,
): Promise<Result<MissionStatusEvent>> {
  return call<MissionStatusEvent>(
    'POST',
    `/api/governance/missions/${encodeURIComponent(missionId)}/status`,
    input,
  );
}
