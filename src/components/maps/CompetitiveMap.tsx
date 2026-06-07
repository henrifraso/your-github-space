import React, { useState, useCallback, useRef } from 'react';
import { MapPin, X } from 'lucide-react';
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
import type { MapContextSnapshot } from '../../lib/map-actions';
import { RADIUS_ZOOM } from '../../features/map/map-ui-utils';
import { useMapAnalysis } from '../../features/map/useMapAnalysis';
import { useMapActions, type MapActionId } from '../../features/map/useMapActions';
import { MapActionsMenu } from '../../features/map/MapActionsMenu';
import { MapActionToast, MapAnalysisPanel } from '../../features/map/MapActionResult';

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
  const mapRef = useRef<google.maps.Map | null>(null);
  // FORCE_LEAFLET (piloto): mudar pra false só quando o projeto Google Cloud
  // tiver billing habilitado. Enquanto a chave estiver sem billing, o Google
  // mostra overlay "Esta página não carregou o Google Maps corretamente"
  // por cima do mapa — UX inaceitável pro cliente. Leaflet (CartoDB Dark
  // Matter) cobre 100% da funcionalidade do piloto sem custo nem chave.
  const FORCE_LEAFLET = true;
  // Detecta falha do Google Maps (Safari ITP, AdBlock, etc.) e cai pra Leaflet.
  const { loadError: gmapsError } = useGoogleMaps();
  const useFallback = FORCE_LEAFLET || gmapsError !== null;

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

  // Análise memoizada do raio (Fase 14: extraído para hook).
  const { withCoords, filtered, analysis, allWithDistance } = useMapAnalysis(competitors, center, radius);

  // Snapshot do contexto para as ações OS¹. Continua local (depende do escopo do componente).
  const buildCtx = useCallback((): MapContextSnapshot => ({
    center,
    radius,
    competitorsInRadius: filtered.map(f => f.c),
    totalAvailable: withCoords.length,
    sector: sector ?? '',
    businessName,
    analysis,
  }), [center, radius, filtered, withCoords, sector, businessName, analysis]);

  // 10 ações OS¹ + toast de feedback (Fase 14: extraído para hook).
  const { toast, runMapAction } = useMapActions({ buildCtx, allWithDistance });

  function handleMenuAction(id: MapActionId) {
    setActionsOpen(false);
    runMapAction(id);
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
    <div
      className="fixed inset-0 z-[190] bg-[#121212] flex flex-col select-none"
      style={{ WebkitAppRegion: 'no-drag', WebkitUserSelect: 'none' } as React.CSSProperties}
    >
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
        <MapActionsMenu
          open={actionsOpen}
          onToggle={() => setActionsOpen(o => !o)}
          onClose={() => setActionsOpen(false)}
          onAction={handleMenuAction}
        />
      </div>

      {/* Toast de feedback das ações OS¹ do mapa */}
      <MapActionToast message={toast} />

      {/* ── Card de análise — fora do div do mapa ── */}
      {analysisOpen && analysis && (
        <MapAnalysisPanel analysis={analysis} onClose={() => setAnalysisOpen(false)} />
      )}
    </div>
  );
}
