export interface AuthState {
  token: string | null;
  negocioId: string | null;
  orgId: string | null;
  buId: string | null;
  isAuthenticated: boolean;
}

export function getAuthState(): AuthState {
  const token = localStorage.getItem('os1_token');
  const negocioId = localStorage.getItem('os1_negocio_id');
  const orgId = localStorage.getItem('os1_org_id');
  const buId = localStorage.getItem('os1_bu_id') ?? negocioId;
  return { token, negocioId, orgId, buId, isAuthenticated: !!(token && negocioId) };
}

export function setAuthState(token: string, negocioId: string): void {
  localStorage.setItem('os1_token', token);
  localStorage.setItem('os1_negocio_id', negocioId);
}

export function setOrgContext(orgId: string, buId: string): void {
  localStorage.setItem('os1_org_id', orgId);
  localStorage.setItem('os1_bu_id', buId);
}

export function clearAuthState(): void {
  localStorage.removeItem('os1_token');
  localStorage.removeItem('os1_negocio_id');
  localStorage.removeItem('os1_consent');
  localStorage.removeItem('os1_org_id');
  localStorage.removeItem('os1_bu_id');
  localStorage.removeItem('os1_role');
}

export function getRole(): string {
  return localStorage.getItem('os1_role') ?? 'franchise';
}

export function setRole(role: string): void {
  localStorage.setItem('os1_role', role);
}
