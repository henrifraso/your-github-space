import React, { useState, useCallback, useRef, useMemo } from 'react';
import { MapPin, X } from 'lucide-react';
import { CircleF } from '@react-google-maps/api';
import { AnimatePresence } from 'motion/react';
import type { Competitor } from '../../types';
import { GoogleMapWrapper } from './GoogleMapWrapper';
import { ClientMarker } from './ClientMarker';
import { CompetitorMarker } from './CompetitorMarker';
import { CompetitorCard } from './CompetitorCard';
import { MapLegend } from './MapLegend';
import { RadiusSlider } from './RadiusSlider';
import { DEFAULT_CENTER, DEFAULT_ZOOM } from '../../config/googleMaps';

const COORDS: google.maps.LatLngLiteral[] = [
  // ── Grande SP (raio até 50km) ──────────────────────────────────────────────
  { lat: -23.5590, lng: -46.6564 }, // [0]  ~270m N
  { lat: -23.5612, lng: -46.6519 }, // [1]  ~400m E
  { lat: -23.5571, lng: -46.6509 }, // [2]  ~830m NE
  { lat: -23.5514, lng: -46.6609 }, // [3]  ~1.2km NW
  { lat: -23.5491, lng: -46.6571 }, // [4]  ~1.4km N
  { lat: -23.5672, lng: -46.6451 }, // [5]  ~1.5km SE
  { lat: -23.5739, lng: -46.6421 }, // [6]  ~2.3km SE
  { lat: -23.5467, lng: -46.6336 }, // [7]  ~3.5km NE
  { lat: -23.5614, lng: -46.7051 }, // [8]  ~5km W
  { lat: -23.5974, lng: -46.6560 }, // [9]  ~4km S
  { lat: -23.5932, lng: -46.6213 }, // [10] ~5km SE
  { lat: -23.5614, lng: -46.7346 }, // [11] ~8km W
  { lat: -23.5614, lng: -46.5578 }, // [12] ~10km E
  { lat: -23.4533, lng: -46.6560 }, // [13] ~11km N
  { lat: -23.6569, lng: -46.7600 }, // [14] ~15km SW
  { lat: -23.6888, lng: -46.5172 }, // [15] ~20km SE
  { lat: -23.3832, lng: -46.4617 }, // [16] ~28km NE
  { lat: -23.5614, lng: -47.0684 }, // [17] ~42km W
  // ── Brasil nacional (só visíveis no Sem limite) ───────────────────────────
  { lat: -22.9068, lng: -43.1729 }, // [18] Rio de Janeiro — ~360km
  { lat: -19.9191, lng: -43.9386 }, // [19] Belo Horizonte — ~590km
  { lat: -25.4284, lng: -49.2733 }, // [20] Curitiba — ~400km S
  { lat: -30.0346, lng: -51.2177 }, // [21] Porto Alegre — ~900km S
  { lat: -15.7801, lng: -47.9292 }, // [22] Brasília — ~1000km N
  { lat: -12.9714, lng: -38.5014 }, // [23] Salvador — ~1900km NE
  { lat: -8.0476,  lng: -34.8770 }, // [24] Recife — ~2600km NE
  { lat: -3.7172,  lng: -38.5434 }, // [25] Fortaleza — ~2800km NE
  { lat: -3.1190,  lng: -60.0217 }, // [26] Manaus — ~2700km NW
  { lat: -27.5954, lng: -48.5480 }, // [27] Florianópolis — ~700km S
];

function haversineMeters(a: google.maps.LatLngLiteral, b: google.maps.LatLngLiteral): number {
  const R = 6371000;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const s = Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

const RADIUS_ZOOM: Record<number, number> = {
  500: 17, 1000: 16, 2000: 15, 3000: 15, 5000: 14, 10000: 13, 25000: 12, 50000: 11, [Infinity]: 4,
};

interface Props {
  competitors: Competitor[];
  onClose: () => void;
  clientPosition?: google.maps.LatLngLiteral;
}

export function CompetitiveMap({ competitors, onClose, clientPosition }: Props) {
  const center = clientPosition ?? DEFAULT_CENTER;
  const [radius, setRadius] = useState(5000);
  const [selected, setSelected] = useState<Competitor | null>(null);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

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

  const analysis = useMemo(() => {
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

  const handleRadiusChange = useCallback((meters: number) => {
    setRadius(meters);
    setAnalysisOpen(false);
    if (mapRef.current) {
      mapRef.current.panTo(center);
      mapRef.current.setZoom(RADIUS_ZOOM[meters] ?? 11);
    }
  }, [center]);

  return (
    <div className="fixed inset-0 z-[190] bg-[#121212] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0 border-b border-white/8">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-[#3b82f6]" />
          <p className="text-xs font-bold uppercase tracking-widest text-[#3b82f6]">Mapa do Mercado</p>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl text-white/30 hover:text-white hover:bg-white/5 transition-all cursor-pointer">
          <X size={20} />
        </button>
      </div>

      {/* Slider de raio */}
      <RadiusSlider value={radius} onChange={handleRadiusChange} competitorCount={filtered.length} />

      {/* Mapa — só o mapa aqui dentro, sem botões nem cards */}
      <div className="flex-1 min-h-0 relative">
        <GoogleMapWrapper center={center} zoom={DEFAULT_ZOOM} onMapLoad={m => { mapRef.current = m; }}>
          <ClientMarker position={center} />
          {filtered.map(({ c, pos }) => (
            <CompetitorMarker key={c.nome} competitor={c} position={pos} onClick={setSelected} />
          ))}
          {radius !== Infinity && (
            <CircleF
              center={center}
              radius={radius}
              options={{ strokeColor: '#3b82f6', strokeWeight: 2, fillColor: '#3b82f6', fillOpacity: 0.08 }}
            />
          )}
        </GoogleMapWrapper>

        <MapLegend />

        <AnimatePresence>
          {selected && (
            <CompetitorCard competitor={selected} onClose={() => setSelected(null)} />
          )}
        </AnimatePresence>
      </div>

      {/* ── Botão Analisar — fora do div do mapa, sem conflito de z-index ── */}
      <button
        onClick={() => setAnalysisOpen(v => !v)}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 h-10 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xl"
      >
        {analysisOpen ? 'Fechar análise' : 'Analisar este raio'}
      </button>

      {/* ── Card de análise — fora do div do mapa ── */}
      {analysisOpen && analysis && (
        <div className="absolute top-[130px] left-3 right-3 lg:left-auto lg:right-3 lg:w-72 bg-[#1a1a1a] border border-white/10 rounded-2xl p-4 text-xs space-y-3 shadow-2xl">
          <div className="flex justify-between items-center">
            <span className="text-white/60 font-semibold uppercase tracking-wider text-[10px]">Análise do raio</span>
            <button onClick={() => setAnalysisOpen(false)} className="text-white/30 hover:text-white cursor-pointer"><X size={14} /></button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/5 rounded-xl p-2.5">
              <p className="text-white/40 text-[10px]">Concorrentes</p>
              <p className="text-white font-bold text-lg">{analysis.total}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-2.5">
              <p className="text-white/40 text-[10px]">Nota média</p>
              <p className="text-white font-bold text-lg">★ {analysis.avg.toFixed(1)}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1 bg-white/5 rounded-xl p-2 text-center">
              <p className="text-[#22c55e] font-bold text-sm">{analysis.green}</p>
              <p className="text-white/30 text-[9px]">≥ 4.3</p>
            </div>
            <div className="flex-1 bg-white/5 rounded-xl p-2 text-center">
              <p className="text-[#f59e0b] font-bold text-sm">{analysis.orange}</p>
              <p className="text-white/30 text-[9px]">4.0–4.2</p>
            </div>
            <div className="flex-1 bg-white/5 rounded-xl p-2 text-center">
              <p className="text-[#ef4444] font-bold text-sm">{analysis.red}</p>
              <p className="text-white/30 text-[9px]">{'< 4.0'}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1 bg-white/5 rounded-xl p-2 text-center">
              <p className="text-white font-bold text-sm">{analysis.diretos}</p>
              <p className="text-white/30 text-[9px]">Diretos</p>
            </div>
            <div className="flex-1 bg-white/5 rounded-xl p-2 text-center">
              <p className="text-white font-bold text-sm">{analysis.indiretos}</p>
              <p className="text-white/30 text-[9px]">Indiretos</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-2.5">
            <p className="text-white/40 text-[10px] mb-0.5">Mais forte</p>
            <p className="text-white text-xs font-medium">{analysis.strongest.nome}</p>
            <p className="text-white/40 text-[10px]">★ {Number(analysis.strongest.nota_google).toFixed(1)}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5">
            <p className="text-white/40 text-[10px] mb-0.5">Mais fraco</p>
            <p className="text-white text-xs font-medium">{analysis.weakest.nome}</p>
            <p className="text-white/40 text-[10px]">★ {Number(analysis.weakest.nota_google).toFixed(1)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
