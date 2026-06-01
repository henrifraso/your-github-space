// Chamadas de API do fluxo de login/cadastro.
//
// Conteúdo movido de src/components/LoginScreen.tsx (Fase 19) byte-a-byte.
// Funções puras (fetch direto) — sem state React, sem efeitos.
// Mantêm o fallback offline: `apiRegister` devolve um token demo se
// `fetch` falhar (`Failed to fetch`), e `apiBusinesses` devolve
// `FALLBACK_BUSINESSES` em caso de erro/zero resultados.

// Tipo `Business` consumido por `apiBusinesses`, `BusinessCard` e pelo
// state do LoginScreen.
export interface Business {
  id: string;
  orgId: string;
  nome: string;
  segmento: string;
  cidade: string;
  estado: string;
}

export function formatBackendDetail(detail: unknown): string {
  if (typeof detail === 'string' && detail.trim()) return detail;
  if (Array.isArray(detail)) {
    const msgs = detail
      .map(d => (d && typeof d === 'object' && 'msg' in (d as any) ? String((d as any).msg) : ''))
      .filter(Boolean);
    if (msgs.length) return msgs.join(' · ');
  }
  return 'Credenciais inválidas';
}

export async function apiLogin(handle: string, password: string) {
  const isHandle = handle.startsWith('@') || !handle.includes('@');
  const body = isHandle
    ? { handle: handle.replace(/^@+/, ''), password }
    : { email: handle, password };
  try {
    const r = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (r.ok) return await r.json();
    const e = await r.json().catch(() => ({}));
    throw new Error(formatBackendDetail(e.detail));
  } catch (err: any) {
    if (err?.message && err.message !== 'Failed to fetch') throw err;
  }
  throw new Error('Credenciais inválidas');
}

export async function apiRegister(nome: string, email: string, password: string) {
  try {
    const r = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nome, email, password }) });
    if (r.ok) return await r.json();
    const e = await r.json().catch(() => ({}));
    throw new Error(e.detail || 'Erro ao criar conta');
  } catch (err: any) {
    if (err?.message === 'Failed to fetch') return { access_token: `demo.${Date.now()}`, user: { nome, email } };
    throw err;
  }
}

export const FALLBACK_BUSINESSES: Business[] = [
  { id: 'bu-mcdo-paulista', orgId: 'org-mcdonalds-brasil', nome: "McDonald's Avenida Paulista", segmento: 'fast_food', cidade: 'São Paulo', estado: 'SP' },
];

export async function apiBusinesses(token: string): Promise<Business[]> {
  try {
    const headers = { Authorization: `Bearer ${token}` };
    const orgs: { id: string; name: string }[] = await fetch('/api/organizations', { headers })
      .then(r => (r.ok ? r.json() : []));
    const all: Business[] = [];
    for (const org of orgs) {
      const units: { id: string; organization_id: string; name: string; segment: string; city: string | null }[] =
        await fetch(`/api/organizations/${org.id}/units`, { headers }).then(r => (r.ok ? r.json() : []));
      for (const u of units) {
        all.push({ id: u.id, orgId: org.id, nome: u.name, segmento: u.segment, cidade: u.city ?? '', estado: '' });
      }
    }
    return all.length > 0 ? all : FALLBACK_BUSINESSES;
  } catch {
    return FALLBACK_BUSINESSES;
  }
}

export async function apiConsent(token: string, negocioId: string) {
  try { await fetch('/api/sync/consent', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ negocio_id: negocioId, consent_version: '1.0' }) }); } catch {}
}
