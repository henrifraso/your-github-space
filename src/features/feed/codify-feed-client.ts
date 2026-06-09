// Cliente HTTP da rota pública /api/feed/codify.
//
// Lê cards/evidências/sinais reais do backend usando o Bearer JWT do user
// logado. Nunca usa x-codify-api-key — essa chave é admin-only e fica no
// Railway. Vite proxy do projeto manda /api/* pro Railway via vercel.json.
//
// Política de erro: tudo silencioso. Qualquer falha (sem rede, 401, 5xx,
// timeout) → retorna `null`. Caller usa `?? []` pra cair em fallback
// invisível ao usuário.

import { getAuthState } from '../../hooks/useAuth';

const REQUEST_TIMEOUT_MS = 8000;

export interface CodifyApiCard {
  id: string;
  organizationId: string;
  unitId: string;
  title: string;
  summary: string;
  whyItMatters?: string | null;
  whatToDo?: string | null;
  urgency: string;
  area?: string | null;
  domain?: string | null;
  type: string;
  tags: string[];
  evidenceIds: string[];
  mapSignalId?: string | null;
  sourceUrl?: string | null;
  sourceTitle?: string | null;
  source?: string | null;
  createdBy?: string | null;
  status: string;
  visibility: string;
  createdAt: string;
}

interface CodifyFeedResponse {
  ok: boolean;
  data: {
    items: CodifyApiCard[];
    total: number;
    limit: number;
    offset: number;
    scopeOrganizationId: string;
    scopeUnitId: string | null;
  };
}

async function fetchWithTimeout(url: string, init: RequestInit, ms: number): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

/**
 * Busca cards reais via /api/feed/codify. Retorna `null` em qualquer falha
 * (sem token, sem org, rede, 401, timeout, JSON inválido) pra caller cair
 * em fallback silencioso.
 */
export async function fetchCodifyCards(options?: {
  organizationId?: string;
  unitId?: string;
  limit?: number;
}): Promise<CodifyApiCard[] | null> {
  const { token, orgId, buId } = getAuthState();
  if (!token) return null;

  const effectiveOrg = options?.organizationId ?? orgId ?? undefined;
  const effectiveUnit = options?.unitId ?? buId ?? undefined;

  const params = new URLSearchParams();
  if (effectiveOrg) params.set('organizationId', effectiveOrg);
  if (effectiveUnit) params.set('unitId', effectiveUnit);
  params.set('limit', String(options?.limit ?? 50));

  const url = `/api/feed/codify?${params.toString()}`;

  try {
    const r = await fetchWithTimeout(
      url,
      { method: 'GET', headers: { Authorization: `Bearer ${token}` } },
      REQUEST_TIMEOUT_MS,
    );
    if (!r.ok) return null;
    const body = (await r.json()) as CodifyFeedResponse;
    if (!body?.ok || !Array.isArray(body?.data?.items)) return null;
    return body.data.items;
  } catch {
    return null;
  }
}
