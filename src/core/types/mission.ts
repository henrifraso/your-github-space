// Tipos de domínio para missões (GM1-B).
//
// Espelham os shapes que o backend retorna em /api/governance/missions
// e /api/feed/missions (ver server/missions.py do commit e1465e9).
// Mantemos snake_case nos campos por simetria com o backend — evita
// camada de adapter desnecessária.

export type MissionStatus =
  | 'assigned'
  | 'in_progress'
  | 'blocked'
  | 'done'
  | 'canceled';

export type MissionPriority = 'low' | 'medium' | 'high';

export interface Mission {
  id:                   string;
  organization_id:      string;
  business_unit_id:     string;
  card_id:              string | null;
  title:                string;
  description:          string | null;
  priority:             MissionPriority;
  due_date:             string | null;
  created_by_user_id:   string;
  created_at:           string;
  /** Estado vigente = último evento por changed_at no backend. */
  current_status:       MissionStatus | null;
}

export interface MissionStatusEvent {
  id:                   string;
  mission_id:           string;
  status:               MissionStatus;
  changed_by_user_id:   string;
  changed_at:           string;
  note:                 string | null;
}

// ── Responses ────────────────────────────────────────────────────────────

export interface MissionListResponse {
  items:                Mission[];
  total:                number;
  limit:                number;
  offset:               number;
  /** Presente apenas no /api/feed/missions (escopo da loja). */
  scopeOrganizationId?: string;
  scopeUnitId?:         string | null;
}

export interface MissionDetailResponse {
  mission:       Mission;
  history:       MissionStatusEvent[];
  total_events:  number;
}

// ── Inputs ───────────────────────────────────────────────────────────────

export interface MissionCreateInput {
  organization_id:   string;
  business_unit_id:  string;
  card_id?:          string | null;
  title:             string;
  description?:      string | null;
  priority?:         MissionPriority;
  due_date?:         string | null;
}

export interface MissionStatusUpdateInput {
  status: MissionStatus;
  note?:  string | null;
}
