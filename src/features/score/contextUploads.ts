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
