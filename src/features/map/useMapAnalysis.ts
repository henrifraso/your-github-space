// Hook de análise do raio do Mapa Competitivo.
//
// Encapsula os 4 useMemo originais do CompetitiveMap.tsx (Fase 14)
// preservando exatamente:
//   - mesma ordem de cálculo
//   - mesmas dependências de cada useMemo
//   - mesmo conteúdo das estruturas retornadas
//
// Isso garante referência estável idêntica ao comportamento anterior.

import { useMemo } from 'react';
import type { Competitor } from '../../types';
import { COORDS, haversineMeters, parseNota } from './map-ui-utils';

export interface CompetitorWithPos {
  c: Competitor;
  pos: google.maps.LatLngLiteral;
}

export interface CompetitorWithDistance {
  competitor: Competitor;
  meters: number;
}

export interface MapAnalysisResult {
  total: number;
  avg: number | null;
  strongest: Competitor | null;
  weakest: Competitor | null;
  green: number;
  orange: number;
  red: number;
  // Concorrentes sem nota_google confirmada — não entram em avg/green/orange/red
  // nem em strongest/weakest, pra não misturar dado real com "sem avaliação".
  semAvaliacao: number;
  diretos: number;
  indiretos: number;
}

export interface UseMapAnalysisReturn {
  withCoords: CompetitorWithPos[];
  filtered: CompetitorWithPos[];
  analysis: MapAnalysisResult | null;
  allWithDistance: CompetitorWithDistance[];
}

export function useMapAnalysis(
  competitors: Competitor[],
  center: google.maps.LatLngLiteral,
  radius: number,
  coords: google.maps.LatLngLiteral[] = COORDS,
): UseMapAnalysisReturn {
  const withCoords = useMemo(() =>
    competitors.slice(0, coords.length).map((c, i) => ({ c, pos: coords[i] })),
    [competitors, coords]
  );

  const filtered = useMemo(() =>
    radius === Infinity
      ? withCoords
      : withCoords.filter(({ pos }) => haversineMeters(center, pos) <= radius),
    [withCoords, radius, center]
  );

  const analysis = useMemo<MapAnalysisResult | null>(() => {
    if (!filtered.length) return null;
    const rated = filtered
      .map(({ c }) => ({ c, nota: parseNota(c.nota_google) }))
      .filter((x): x is { c: Competitor; nota: number } => x.nota !== null);
    const avg = rated.length ? rated.reduce((s, r) => s + r.nota, 0) / rated.length : null;
    const sorted = [...rated].sort((a, b) => b.nota - a.nota);
    const green    = rated.filter(r => r.nota >= 4.3).length;
    const orange   = rated.filter(r => r.nota >= 4.0 && r.nota < 4.3).length;
    const red      = rated.filter(r => r.nota < 4.0).length;
    const semAvaliacao = filtered.length - rated.length;
    const diretos  = filtered.filter(({ c }) => (c.categoria ?? 'direto') === 'direto').length;
    const indiretos = filtered.filter(({ c }) => c.categoria === 'indireto').length;
    return {
      total: filtered.length, avg,
      strongest: sorted[0]?.c ?? null,
      weakest: sorted.length ? sorted[sorted.length - 1].c : null,
      green, orange, red, semAvaliacao, diretos, indiretos,
    };
  }, [filtered]);

  // Pré-cálculo: todos os concorrentes com distância (usado pelo Comparar regiões).
  const allWithDistance = useMemo(
    () => withCoords.map(({ c, pos }) => ({ competitor: c, meters: haversineMeters(center, pos) })),
    [withCoords, center]
  );

  return { withCoords, filtered, analysis, allWithDistance };
}
