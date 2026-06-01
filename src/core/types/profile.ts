// Tipos relacionados a perfil/role/auth.
//
// Mantemos as strings de role exatamente como são consumidas pelo backend
// e pelo banco; nada aqui muda valores, só centraliza a tipagem.

// Auto-login via querystring (?token=...&org=...&bu=...&role=...).
// O App escuta esses params no startup e, se presentes, pula o login.
export interface AutoLoginParams {
  token: string;
  orgId: string;
  buId: string;
  role: string;
}

// Os valores possíveis de role hoje (conforme já existem no backend).
// Não estreitar `role: string` pra union em call sites ainda — pode quebrar
// código que recebe role como string genérica. Mantemos como referência.
export type Role =
  | 'codify'
  | 'franchisor'
  | 'franchise'
  | 'affiliate'
  | 'partner'
  | 'team_member'
  | (string & {}); // tolerante a roles futuros sem TS error
