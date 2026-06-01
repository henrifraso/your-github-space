// Helpers de scoring/textualização das ações do Mapa.
//
// Conteúdo movido de src/lib/map-actions.ts (Fase 15). Funções puras
// usadas por todos os builders pra manter consistência de unidade
// (km) e tom por setor.

// Formata distância em metros pra string legível ("500 m", "5 km",
// "sem limite" pra Infinity).
export function fmtKm(meters: number): string {
  if (!isFinite(meters)) return 'sem limite';
  if (meters >= 1000) return `${(meters / 1000).toFixed(meters % 1000 === 0 ? 0 : 1)} km`;
  return `${meters} m`;
}

// Adapta tom por setor — não é IA, só heurística textual.
export function sectorVoice(sector: string): { audience: string; emphasis: string } {
  const s = (sector || '').toLowerCase();
  if (s.includes('codify')) return { audience: 'Time interno', emphasis: 'visão consolidada do território' };
  if (s.includes('os1'))    return { audience: 'Operação principal', emphasis: 'presença e disputa local' };
  return { audience: `Time de ${sector || 'mercado'}`, emphasis: 'ação local com base no raio' };
}
