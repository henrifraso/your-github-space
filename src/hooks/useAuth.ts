export interface AuthState {
  token: string | null;
  negocioId: string | null;
  isAuthenticated: boolean;
}

export function getAuthState(): AuthState {
  const token = localStorage.getItem('os1_token');
  const negocioId = localStorage.getItem('os1_negocio_id');
  return { token, negocioId, isAuthenticated: !!(token && negocioId) };
}

export function setAuthState(token: string, negocioId: string): void {
  localStorage.setItem('os1_token', token);
  localStorage.setItem('os1_negocio_id', negocioId);
}

export function clearAuthState(): void {
  localStorage.removeItem('os1_token');
  localStorage.removeItem('os1_negocio_id');
  localStorage.removeItem('os1_consent');
}
