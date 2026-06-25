import React, { useState, useCallback, useRef } from 'react';
import { X } from 'lucide-react';
import { CircleF } from '@react-google-maps/api';
import { AnimatePresence } from 'motion/react';
import type { Competitor } from '../../types';
import { GoogleMapWrapper, useGoogleMaps } from './GoogleMapWrapper';
import { LeafletFallbackMap } from './LeafletFallbackMap';
import { useDarkMode } from '../../hooks/useDarkMode';
import { ClientMarker } from './ClientMarker';
import { CompetitorMarker } from './CompetitorMarker';
import { CompetitorSidePanel } from './CompetitorSidePanel';
import { MapRadiusSummary } from './MapRadiusSummary';
import { MapLegend } from './MapLegend';
import { RadiusSlider } from './RadiusSlider';
import { DEFAULT_CENTER, DEFAULT_ZOOM } from '../../config/googleMaps';
import { RADIUS_ZOOM, OSCAR_COORDS } from '../../features/map/map-ui-utils';
import { useMapAnalysis } from '../../features/map/useMapAnalysis';

const OSCAR_SECTORS = new Set(['nike', 'oscar-piloto-01']);

const SECTOR_CENTERS: Record<string, google.maps.LatLngLiteral> = {
  nike:              { lat: -23.2237, lng: -45.9009 },
  'oscar-piloto-01': { lat: -23.2237, lng: -45.9009 },
};

interface Props {
  competitors: Competitor[];
  onClose: () => void;
  clientPosition?: google.maps.LatLngLiteral;
  sector?: string;
  businessName?: string;
}

export function CompetitiveMap({ competitors, onClose, clientPosition, sector, businessName }: Props) {
  const center = SECTOR_CENTERS[sector ?? ''] ?? clientPosition ?? DEFAULT_CENTER;
  const coords = OSCAR_SECTORS.has(sector ?? '') ? OSCAR_COORDS : undefined;
  const [radius, setRadius] = useState(5000);
  const [selected, setSelected] = useState<Competitor | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const isDark = useDarkMode();
  // FORCE_LEAFLET (piloto): mudar pra false só quando o projeto Google Cloud
  // tiver billing habilitado. Enquanto a chave estiver sem billing, o Google
  // mostra overlay "Esta página não carregou o Google Maps corretamente"
  // por cima do mapa — UX inaceitável pro cliente. Leaflet (CartoDB Dark
  // Matter) cobre 100% da funcionalidade do piloto sem custo nem chave.
  const FORCE_LEAFLET = true;
  // Detecta falha do Google Maps (Safari ITP, AdBlock, etc.) e cai pra Leaflet.
  const { loadError: gmapsError } = useGoogleMaps();
  const useFallback = FORCE_LEAFLET || gmapsError !== null;

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (selected) { setSelected(null); return; }
      onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selected, onClose]);

  const { withCoords, filtered } = useMapAnalysis(competitors, center, radius, coords);

  const handleRadiusChange = useCallback((meters: number) => {
    setRadius(meters);
    // mapRef é do Google Maps; Leaflet re-centra sozinho via prop change.
    if (mapRef.current) {
      mapRef.current.panTo(center);
      mapRef.current.setZoom(RADIUS_ZOOM[meters] ?? 11);
    }
  }, [center]);

  return (
    <div
      className="fixed inset-0 z-[190] bg-[#f0f2f4] dark:bg-[#181818] flex flex-col select-none"
      style={{ WebkitAppRegion: 'no-drag', WebkitUserSelect: 'none' } as React.CSSProperties}
    >
      {/* Header */}
      <div className="flex-shrink-0 px-5 pt-4 pb-3.5 border-b border-neutral-200 dark:border-[#2e2e2e] flex items-center justify-between gap-4 bg-[#f0f2f4] dark:bg-[#242424] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.35)]">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
            Mapa competitivo
          </p>
          {businessName && (
            <h2 className="text-neutral-800 dark:text-neutral-100 font-semibold text-sm mt-0.5">{businessName}</h2>
          )}
        </div>
        <button
          onClick={onClose}
          title="Fechar mapa"
          className="flex-shrink-0 p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-white/5 transition-all cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      {/* Slider de raio */}
      <RadiusSlider value={radius} onChange={handleRadiusChange} competitorCount={filtered.length} />

      {/* Área principal: mapa + painel lateral (split quando concorrente selecionado) */}
      <div className="flex-1 min-h-0 flex overflow-hidden">

        {/* Mapa — ocupa o espaço restante à esquerda */}
        <div className="flex-1 min-w-0 min-h-0 relative">
          {useFallback ? (
            <LeafletFallbackMap
              center={center}
              zoom={RADIUS_ZOOM[radius] ?? DEFAULT_ZOOM}
              radius={radius}
              clientPosition={center}
              markers={filtered.map(({ c, pos }) => ({ position: pos, competitor: c, onClick: setSelected }))}
              isDark={isDark}
            />
          ) : (
            <GoogleMapWrapper center={center} zoom={DEFAULT_ZOOM} onMapLoad={m => {
              mapRef.current = m;
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
          <MapLegend />
        </div>

        {/* Painel lateral — sempre visível; conteúdo alterna entre resumo e detalhe */}
        <div className="w-[400px] flex-shrink-0 h-full bg-[#f0f2f4] dark:bg-[#181818] border-l border-neutral-200 dark:border-[#2e2e2e] overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            {selected ? (
              <CompetitorSidePanel
                key={selected.nome}
                competitor={selected}
                onClose={() => setSelected(null)}
              />
            ) : (
              <MapRadiusSummary
                key="radius-summary"
                competitors={filtered.map(({ c }) => c)}
                radiusMeters={radius}
              />
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
