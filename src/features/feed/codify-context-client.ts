// Cliente HTTP de /api/feed/codify/evidences e /api/feed/codify/map-signals.
//
// Mesmo padrão silencioso do codify-feed-client.ts (Fase 4.2):
// usa Bearer JWT do user logado, timeout curto, em qualquer erro
// retorna null pra caller cair em fallback sem barulho.
//
// Backend valida membership do user via _resolve_scope — se org/unit
// fora do escopo do user, devolve 404 e este client retorna null.

import { getAuthState } from '../../hooks/useAuth';

const REQUEST_TIMEOUT_MS = 8000;

// ── Tipos espelhando o response model do backend (codify_api_schemas.py)

export interface CodifyEvidence {
  id: string;
  organizationId: string;
  unitId: string;
  title: string;
  summary: string;
  url?: string | null;
  sourceTitle?: string | null;
  capturedText?: string | null;
  evidenceType?: string | null;
  area?: string | null;
  urgency?: string | null;
  tags: string[];
  source?: string | null;
  createdBy?: string | null;
  visibility: string;
  confidence: number;
  createdAt: string;
}

export interface CodifySignal {
  id: string;
  organizationId: string;
  unitId: string;
  title?: string | null;
  summary: string;
  radius?: number | null;
  center?: { lat: number; lng: number } | null;
  competitorsCount?: number | null;
  competitorsUsed: string[];
  averageRating?: number | null;
  signalType: string;
  riskLevel: string;
  opportunityLevel?: string | null;
  urgency: string;
  tags: string[];
  source?: string | null;
  createdBy?: string | null;
  visibility: string;
  confidence: number;
  createdAt: string;
}

interface ListResponse<T> {
  ok: boolean;
  data: {
    items: T[];
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

async function _fetchList<T>(path: string, organizationId: string, unitId?: string): Promise<T[] | null> {
  const { token } = getAuthState();
  if (!token) return null;
  const params = new URLSearchParams();
  params.set('organizationId', organizationId);
  if (unitId) params.set('unitId', unitId);
  params.set('limit', '50');
  try {
    const r = await fetchWithTimeout(
      `${path}?${params.toString()}`,
      { method: 'GET', headers: { Authorization: `Bearer ${token}` } },
      REQUEST_TIMEOUT_MS,
    );
    if (!r.ok) return null;
    const body = (await r.json()) as ListResponse<T>;
    if (!body?.ok || !Array.isArray(body?.data?.items)) return null;
    return body.data.items;
  } catch {
    return null;
  }
}

export function fetchCodifyEvidences(organizationId: string, unitId?: string): Promise<CodifyEvidence[] | null> {
  return _fetchList<CodifyEvidence>('/api/feed/codify/evidences', organizationId, unitId);
}

export function fetchCodifyMapSignals(organizationId: string, unitId?: string): Promise<CodifySignal[] | null> {
  // /map-signals serve tanto signals gerais (6.4) quanto territoriais (6.5);
  // separação fica no adapter via tags.
  return _fetchList<CodifySignal>('/api/feed/codify/map-signals', organizationId, unitId);
}
