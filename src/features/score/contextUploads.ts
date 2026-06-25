import { getCodifyScopeForSector } from '../feed/codify-sector-scope';
import type { SectorId } from '../../components/SectorSwitcher';

/** Retorna org/bu canônico para sectores com escopo fixo (Oscar, Pacheco…).
 *  Sectores com escopo real sempre usam a mesma chave de upload,
 *  independentemente de quem está logado. Fallback: valores do localStorage. */
export function resolveUploadOrgBu(
  activeSector: string | undefined,
  fallbackOrgId: string | undefined,
  fallbackBuId: string | undefined,
): { orgId: string | undefined; buId: string | undefined } {
  if (activeSector) {
    const scope = getCodifyScopeForSector(activeSector as SectorId);
    if (scope) return { orgId: scope.organizationId, buId: scope.unitId ?? undefined };
  }
  return { orgId: fallbackOrgId, buId: fallbackBuId };
}

export interface ContextUpload {
  id: string;
  name: string;
  extension: string;
  mimeType?: string;
  size?: number;
  uploadedAt: string;
  orgId?: string;
  buId?: string;
  activeSector?: string;
  source: 'upload';
}

export function getUploadKey(orgId?: string, buId?: string, activeSector?: string): string {
  return `os1_ctx_uploads_${activeSector ?? 'geral'}_${orgId ?? 'x'}_${buId ?? 'x'}`;
}

export function getContextUploads(orgId?: string, buId?: string, activeSector?: string): ContextUpload[] {
  try {
    const raw = localStorage.getItem(getUploadKey(orgId, buId, activeSector));
    return raw ? (JSON.parse(raw) as ContextUpload[]) : [];
  } catch {
    return [];
  }
}

export function addContextUpload(upload: ContextUpload): void {
  const existing = getContextUploads(upload.orgId, upload.buId, upload.activeSector);
  localStorage.setItem(
    getUploadKey(upload.orgId, upload.buId, upload.activeSector),
    JSON.stringify([...existing, upload]),
  );
}
