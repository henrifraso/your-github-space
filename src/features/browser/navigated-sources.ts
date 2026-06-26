// Fontes navegadas — registra URLs acessadas no Navegador OS¹ por perfil.
// Armazenamento local (localStorage), sem backend, sem API, sem LLM.
// Alimenta a seção "Fontes do Navegador" no Score/Análise.

export interface NavigatedSource {
  url: string;
  host: string;
  title: string;
  visitedAt: string;
}

const MAX_SOURCES = 20;
const storageKey = (sector: string) => `os1:navigated-sources:${sector}`;

export function recordNavigatedSource(url: string, title: string, activeSector: string): void {
  if (!url || !/^https?:\/\//i.test(url) || !activeSector) return;
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    const existing: NavigatedSource[] = JSON.parse(localStorage.getItem(storageKey(activeSector)) ?? '[]');
    const deduped = existing.filter(s => s.url !== url);
    const entry: NavigatedSource = { url, host, title: title || host, visitedAt: new Date().toISOString() };
    localStorage.setItem(storageKey(activeSector), JSON.stringify([entry, ...deduped].slice(0, MAX_SOURCES)));
  } catch { /* storage indisponível */ }
}

export function loadNavigatedSources(activeSector: string): NavigatedSource[] {
  if (!activeSector) return [];
  try {
    return JSON.parse(localStorage.getItem(storageKey(activeSector)) ?? '[]');
  } catch { return []; }
}
