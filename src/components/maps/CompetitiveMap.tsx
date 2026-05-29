import React, { useState, useCallback, useRef, useMemo } from 'react';
import { MapPin, X, Sparkles, LayoutGrid, BarChart3, Search, GitCompareArrows, Target, Bell, AlertTriangle, Briefcase, Handshake, FlaskConical } from 'lucide-react';
import { CircleF } from '@react-google-maps/api';
import { AnimatePresence } from 'motion/react';
import type { Competitor } from '../../types';
import { GoogleMapWrapper, useGoogleMaps } from './GoogleMapWrapper';
import { LeafletFallbackMap } from './LeafletFallbackMap';
import { ClientMarker } from './ClientMarker';
import { CompetitorMarker } from './CompetitorMarker';
import { CompetitorCard } from './CompetitorCard';
import { MapLegend } from './MapLegend';
import { RadiusSlider } from './RadiusSlider';
import { DEFAULT_CENTER, DEFAULT_ZOOM } from '../../config/googleMaps';
import {
  dispatchMapAction,
  buildMapFeedCards,
  buildCompetitionAnalysis,
  buildOpportunities,
  buildComparison,
  buildMapMission,
  // P5 novas
  addTerritoryWatcher,
  buildRiskAnalysis,
  buildSectorOpportunities,
  buildNearbyPartners,
  buildTerritorySimulation,
  type MapContextSnapshot,
} from '../../lib/map-actions';

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
  sector?: string;
  businessName?: string;
}

export function CompetitiveMap({ competitors, onClose, clientPosition, sector, businessName }: Props) {
  const center = clientPosition ?? DEFAULT_CENTER;
  const [radius, setRadius] = useState(5000);
  const [selected, setSelected] = useState<Competitor | null>(null);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [toast, setToast] = useState<string>('');
  const toastTimerRef = useRef<number | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  // Detecta falha do Google Maps (Safari ITP, AdBlock, etc.) e cai pra Leaflet.
  const { loadError: gmapsError } = useGoogleMaps();
  const useFallback = gmapsError !== null;

  function flashToast(msg: string) {
    setToast(msg);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(''), 2400) as unknown as number;
  }

  // P1: ESC fecha o mapa. Se o menu de Ações estiver aberto, fecha o menu primeiro.
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (actionsOpen) { setActionsOpen(false); return; }
      if (analysisOpen) { setAnalysisOpen(false); return; }
      if (selected) { setSelected(null); return; }
      onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [actionsOpen, analysisOpen, selected, onClose]);

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

  // Pré-cálculo: todos os concorrentes com distância (usado pelo Comparar regiões).
  const allWithDistance = useMemo(
    () => withCoords.map(({ c, pos }) => ({ competitor: c, meters: haversineMeters(center, pos) })),
    [withCoords, center]
  );

  function buildCtx(): MapContextSnapshot {
    return {
      center,
      radius,
      competitorsInRadius: filtered.map(f => f.c),
      totalAvailable: withCoords.length,
      sector: sector ?? '',
      businessName,
      analysis,
    };
  }

  type MapActionId =
    | 'feed-from-radius' | 'analyze-competition' | 'find-opportunities' | 'compare-regions' | 'territory-to-mission'
    | 'monitor-territory' | 'risk-map' | 'sector-opportunities' | 'nearby-partners' | 'simulate-territory-action';
  function runMapAction(type: MapActionId) {
    setActionsOpen(false);
    const ctx = buildCtx();
    if (type === 'feed-from-radius') {
      const cards = buildMapFeedCards(ctx);
      dispatchMapAction({ type, context: ctx, payload: cards });
      flashToast(`${cards.length} card(s) gerados no feed`);
      return;
    }
    if (type === 'analyze-competition') {
      dispatchMapAction({ type, context: ctx, payload: buildCompetitionAnalysis(ctx) });
      flashToast('Análise enviada para Área de Trabalho');
      return;
    }
    if (type === 'find-opportunities') {
      dispatchMapAction({ type, context: ctx, payload: buildOpportunities(ctx) });
      flashToast('Oportunidades enviadas para Área de Trabalho');
      return;
    }
    if (type === 'compare-regions') {
      dispatchMapAction({ type, context: ctx, payload: buildComparison(ctx, allWithDistance) });
      flashToast('Comparação enviada para Área de Trabalho');
      return;
    }
    if (type === 'territory-to-mission') {
      dispatchMapAction({ type, context: ctx, payload: buildMapMission(ctx) });
      flashToast('Missão sugerida enviada');
      return;
    }
    // ── P5: novas 5 ──
    if (type === 'monitor-territory') {
      addTerritoryWatcher(ctx);
      dispatchMapAction({ type, context: ctx });
      flashToast('Monitoramento do território ativado');
      return;
    }
    if (type === 'risk-map') {
      dispatchMapAction({ type, context: ctx, payload: buildRiskAnalysis(ctx) });
      flashToast('Mapa de risco enviado');
      return;
    }
    if (type === 'sector-opportunities') {
      dispatchMapAction({ type, context: ctx, payload: buildSectorOpportunities(ctx) });
      flashToast('Oportunidades por setor enviadas');
      return;
    }
    if (type === 'nearby-partners') {
      dispatchMapAction({ type, context: ctx, payload: buildNearbyPartners(ctx) });
      flashToast('Parceiros próximos enviados');
      return;
    }
    if (type === 'simulate-territory-action') {
      dispatchMapAction({ type, context: ctx, payload: buildTerritorySimulation(ctx) });
      flashToast('Simulação de território enviada');
      return;
    }
  }

  const handleRadiusChange = useCallback((meters: number) => {
    setRadius(meters);
    setAnalysisOpen(false);
    // mapRef é do Google Maps; Leaflet re-centra sozinho via prop change.
    if (mapRef.current) {
      mapRef.current.panTo(center);
      mapRef.current.setZoom(RADIUS_ZOOM[meters] ?? 11);
    }
  }, [center]);

  return (
    <div className="fixed inset-0 z-[190] bg-[#121212] flex flex-col">
      {/* Header — X simples no canto (Esc também fecha, via listener) */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0 border-b border-white/8">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-[#3b82f6]" />
          <p className="text-xs font-bold uppercase tracking-widest text-[#3b82f6]">Mapa do Mercado</p>
        </div>
        <button
          onClick={onClose}
          title="Fechar mapa"
          className="p-2 rounded-xl text-white/30 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      {/* Slider de raio */}
      <RadiusSlider value={radius} onChange={handleRadiusChange} competitorCount={filtered.length} />

      {/* Mapa — Google Maps por padrão; Leaflet (OSM) como fallback automático
          quando Google Maps falha (Safari ITP, AdBlock, etc). */}
      <div className="flex-1 min-h-0 relative">
        {useFallback ? (
          <LeafletFallbackMap
            center={center}
            zoom={RADIUS_ZOOM[radius] ?? DEFAULT_ZOOM}
            radius={radius}
            clientPosition={center}
            markers={filtered.map(({ c, pos }) => ({ position: pos, competitor: c, onClick: setSelected }))}
          />
        ) : (
          <GoogleMapWrapper center={center} zoom={DEFAULT_ZOOM} onMapLoad={m => {
            mapRef.current = m;
            // Fix: durante animação de abertura do modal, o container pode ainda estar
            // com altura final em transição. Força recálculo em vários momentos.
            const trig = () => { try { (window as any).google?.maps?.event?.trigger(m, 'resize'); m.panTo(center); } catch { /* ignore */ } };
            [50, 200, 500].forEach(ms => window.setTimeout(trig, ms));
          }}>
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
        )}

        {/* Badge de fallback quando Leaflet está ativo */}
        {useFallback && (
          <div className="absolute top-3 left-3 z-[1000] inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[rgba(20,20,22,0.85)] border border-white/10 text-[10px] text-white/70">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            OpenStreetMap (fallback)
          </div>
        )}

        <MapLegend />

        <AnimatePresence>
          {selected && (
            <CompetitorCard competitor={selected} onClose={() => setSelected(null)} />
          )}
        </AnimatePresence>
      </div>

      {/* ── Botões inferiores: Analisar (centro) + Ações OS¹ (direita do Analisar)
          z-[1100] pra ficar acima dos panes do Leaflet (até ~1000) e dos controles
          do Google Maps. ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-[1100]">
        <button
          onClick={() => setAnalysisOpen(v => !v)}
          className="px-6 h-10 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xl"
        >
          {analysisOpen ? 'Fechar análise' : 'Analisar este raio'}
        </button>
        <div className="relative">
          <button
            onClick={() => setActionsOpen(o => !o)}
            title="OS¹ — ações sobre o território"
            className={`h-10 px-3 inline-flex items-center gap-1.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xl border ${
              actionsOpen
                ? 'bg-[#fbbf24]/15 border-[#fbbf24]/45 text-[#fbbf24]'
                : 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
            }`}
          >
            <Sparkles size={13} strokeWidth={2} />
            Ações
          </button>
          {actionsOpen && (
            <>
              <div onClick={() => setActionsOpen(false)} className="fixed inset-0 z-[195]" style={{ background: 'transparent' }} />
              <div className="absolute right-0 bottom-[calc(100%+8px)] z-[196] w-[300px] bg-[#0f0f10] border border-white/10 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.6)] p-1.5 text-left">
                <div className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-[0.12em] text-white/35">OS¹ · Mapa</div>
                {[
                  { id: 'feed-from-radius',     label: 'Gerar feed do raio',                Icon: LayoutGrid },
                  { id: 'analyze-competition',  label: 'Analisar concorrência local',       Icon: BarChart3 },
                  { id: 'find-opportunities',   label: 'Encontrar oportunidades no território', Icon: Search },
                  { id: 'compare-regions',      label: 'Comparar regiões',                  Icon: GitCompareArrows },
                  { id: 'territory-to-mission', label: 'Transformar território em missão',  Icon: Target },
                  { id: 'monitor-territory',    label: 'Monitorar território',              Icon: Bell },
                  { id: 'risk-map',             label: 'Gerar mapa de risco',               Icon: AlertTriangle },
                  { id: 'sector-opportunities', label: 'Oportunidades por setor',           Icon: Briefcase },
                  { id: 'nearby-partners',      label: 'Encontrar parceiros próximos',      Icon: Handshake },
                  { id: 'simulate-territory-action', label: 'Simular ação no território',   Icon: FlaskConical },
                ].map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => runMapAction(id as any)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs text-white/85 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <Icon size={13} strokeWidth={2} className="text-white/50 flex-shrink-0" />
                    <span className="flex-1 text-left">{label}</span>
                  </button>
                ))}
                <div className="px-3 pt-2 pb-2 mt-1 text-[10px] text-white/35 leading-relaxed border-t border-white/5">
                  Você controla o que o OS¹ salva. Ações manuais — nada é capturado sem você clicar.
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Toast de feedback das ações OS¹ do mapa */}
      {toast && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[197] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[rgba(20,20,22,0.94)] border border-white/8 shadow-[0_8px_30px_rgba(0,0,0,0.5)] text-white text-xs font-medium">
          <Sparkles size={12} strokeWidth={2} className="text-[#fbbf24]" />
          {toast}
        </div>
      )}

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
