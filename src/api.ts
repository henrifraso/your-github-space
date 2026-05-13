export async function apiFetch<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('os1_token');
  const r = await fetch(path, {
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
    buId: localStorage.getItem('os1_bu_id') ?? localStorage.getItem('os1_negocio_id') ?? '',
  };
}
