export async function apiFetch<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('os1_token');
  const orgId = localStorage.getItem('os1_org_id') ?? '';
  const buId  = localStorage.getItem('os1_bu_id') ?? localStorage.getItem('os1_negocio_id') ?? '';

  // Injeta org_id e bu_id como query params se não estiverem presentes na URL
  let url = path;
  if (orgId || buId) {
    try {
      const u = new URL(path, window.location.origin);
      if (orgId && !u.searchParams.has('org_id') && !u.searchParams.has('organizationId')) u.searchParams.set('org_id', orgId);
      if (buId  && !u.searchParams.has('bu_id')  && !u.searchParams.has('unitId'))          u.searchParams.set('bu_id', buId);
      url = u.pathname + u.search + u.hash;
    } catch { /* URL relativa inválida — usa path original */ }
  }

  const r = await fetch(url, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers ?? {}),
    },
  });
  if (!r.ok) {
    const e = await r.json().catch(() => ({}));
    throw new Error((e as any).detail ?? r.statusText);
  }
  return r.json() as Promise<T>;
}

export function getOrgContext() {
  return {
    orgId: localStorage.getItem('os1_org_id') ?? '',
    buId:  localStorage.getItem('os1_bu_id') ?? localStorage.getItem('os1_negocio_id') ?? '',
  };
}
