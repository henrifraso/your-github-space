// Cliente HTTP da governança Codify (P10 v1, bloco GA3).
//
// Usa SEMPRE Bearer JWT do user logado (localStorage 'os1_token').
// Nunca usa x-codify-api-key — essa chave é admin-only no Railway.
// Nunca toca em /api/codify/v0 — esse prefixo é admin-only.
//
// Política de erro:
//   - 401  → { status: 'unauthenticated' }
//   - 403  → { status: 'forbidden' } (user não é matriz na org do card)
//   - 404  → { status: 'not_found' }
//   - 4xx/5xx, rede, timeout → { status: 'error', message }
//   - 200  → { status: 'ok', data }
//
// Caller decide se mostra UI ou esconde silenciosamente. Para o badge,
// 'forbidden' / 'unauthenticated' / 'not_found' / 'error' viram "esconder".

import { getAuthState } from '../../hooks/useAuth';

const REQUEST_TIMEOUT_MS = 8000;

// ── Tipos do backend (espelham governance.py) ────────────────────────────

export interface GovernanceDecision {
  id: string;
  card_id: string;
  organization_id: string;
  status: 'approved' | 'rejected';
  decided_by_user_id: string;
  decided_at: string;
  comment?: string | null;
}

export interface GovernanceDistribution {
  id: string;
  card_id: string;
  organization_id: string;
  business_unit_id: string;
  distributed_by_user_id: string;
  distributed_at: string;
  note?: string | null;
}

export interface OrgUnit {
  id: string;
  organization_id: string;
  name: string;
  segment?: string | null;
  city?: string | null;
}

export type Result<T> =
  | { status: 'ok'; data: T }
  | { status: 'unauthenticated' }
  | { status: 'forbidden' }
  | { status: 'not_found' }
  | { status: 'error'; message: string };

// ── Helper ───────────────────────────────────────────────────────────────

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
    // Endpoints governance retornam { ok, data: ... }; helper de orgs retorna lista direta.
    const data = (json && typeof json === 'object' && 'data' in (json as object))
      ? (json as { data: T }).data
      : (json as T);
    return { status: 'ok', data };
  } catch (e) {
    return { status: 'error', message: e instanceof Error ? e.message : 'fetch_failed' };
  }
}

// ── Endpoints governance (GA1) ───────────────────────────────────────────

export async function getCardDecisions(
  cardId: string,
): Promise<Result<{ items: GovernanceDecision[]; total: number }>> {
  return call('GET', `/api/governance/cards/${encodeURIComponent(cardId)}/decisions`);
}

export async function getCardDistributions(
  cardId: string,
): Promise<Result<{ items: GovernanceDistribution[]; total: number }>> {
  return call('GET', `/api/governance/cards/${encodeURIComponent(cardId)}/distributions`);
}

export async function approveCard(
  cardId: string,
  comment?: string,
): Promise<Result<GovernanceDecision>> {
  return call('POST', `/api/governance/cards/${encodeURIComponent(cardId)}/approve`,
    { comment: comment ?? null });
}

export async function rejectCard(
  cardId: string,
  comment?: string,
): Promise<Result<GovernanceDecision>> {
  return call('POST', `/api/governance/cards/${encodeURIComponent(cardId)}/reject`,
    { comment: comment ?? null });
}

export async function distributeCard(
  cardId: string,
  businessUnitIds: string[],
  note?: string,
): Promise<Result<{ created: GovernanceDistribution[]; skipped: string[]; created_count: number; skipped_count: number }>> {
  return call('POST', `/api/governance/cards/${encodeURIComponent(cardId)}/distribute`,
    { business_unit_ids: businessUnitIds, note: note ?? null });
}

// ── Auxiliar para listar unidades pra distribuir ─────────────────────────

/**
 * Lista business_units de uma org. Usa endpoint público Bearer JWT já
 * existente desde Etapa 1 (`organizations.py:list_business_units`).
 * Retorna 404 se o user não tem nenhum membership na org (default do
 * backend) — para matriz, isso sempre passa.
 */
export async function listOrgUnits(orgId: string): Promise<Result<OrgUnit[]>> {
  return call<OrgUnit[]>('GET', `/api/organizations/${encodeURIComponent(orgId)}/units`);
}
