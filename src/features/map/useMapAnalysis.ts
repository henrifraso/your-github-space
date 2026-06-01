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
import { COORDS, haversineMeters } from './map-ui-utils';

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
  avg: number;
  strongest: Competitor;
  weakest: Competitor;
  green: number;
  orange: number;
  red: number;
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
): UseMapAnalysisReturn {
  const withCoords = useMemo(() =>
    competitors.slice(0, COORDS.length).map((c, i) => ({ c, pos: COORDS[i] })),
    [competitors]
  );

  const filtered = useMemo(() =>
    radius === Infinity
      ? withCoords
      : withCoords.filter(({ pos }) => haversineMeters(center, pos) <= radius),
    [withCoords, radius, center]
  );

  const analysis = useMemo<MapAnalysisResult | null>(() => {
    if (!filtered.length) return null;
    const ratings = filtered.map(({ c }) => Number(c.nota_google));
    const avg = ratings.reduce((s, r) => s + r, 0) / ratings.length;
    const sorted = [...filtered].sort((a, b) => Number(b.c.nota_google) - Number(a.c.nota_google));
    const green    = filtered.filter(({ c }) => Number(c.nota_google) >= 4.3).length;
    const orange   = filtered.filter(({ c }) => Number(c.nota_google) >= 4.0 && Number(c.nota_google) < 4.3).length;
    const red      = filtered.filter(({ c }) => Number(c.nota_google) < 4.0).length;
    const diretos  = filtered.filter(({ c }) => (c.categoria ?? 'direto') === 'direto').length;
    const indiretos = filtered.filter(({ c }) => c.categoria === 'indireto').length;
    return { total: filtered.length, avg, strongest: sorted[0].c, weakest: sorted[sorted.length - 1].c, green, orange, red, diretos, indiretos };
  }, [filtered]);

  // Pré-cálculo: todos os concorrentes com distância (usado pelo Comparar regiões).
  const allWithDistance = useMemo(
    () => withCoords.map(({ c, pos }) => ({ competitor: c, meters: haversineMeters(center, pos) })),
    [withCoords, center]
  );

  return { withCoords, filtered, analysis, allWithDistance };
}
