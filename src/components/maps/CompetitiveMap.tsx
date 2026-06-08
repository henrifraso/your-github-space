import React, { useState, useCallback, useRef } from 'react';
import { MapPin, X,
  LayoutGrid, BarChart3, Search, GitCompareArrows, Target, Bell,
  AlertTriangle, Briefcase, Handshake, FlaskConical,
} from 'lucide-react';
import { CircleF } from '@react-google-maps/api';
import { AnimatePresence } from 'motion/react';
import type { Competitor } from '../../types';
import { GoogleMapWrapper, useGoogleMaps } from './GoogleMapWrapper';
import { LeafletFallbackMap } from './LeafletFallbackMap';
import { useDarkMode } from '../../hooks/useDarkMode';
import { getRole } from '../../hooks/useAuth';
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
      className={`fixed inset-0 z-[190] ${isDark ? 'bg-[#121212]' : 'bg-white'} flex flex-col select-none`}
      style={{ WebkitAppRegion: 'no-drag', WebkitUserSelect: 'none' } as React.CSSProperties}
    >
      {/* Header — X simples no canto (Esc também fecha, via listener) */}
      <div
        className="flex items-center justify-end px-5 pt-5 pb-3 flex-shrink-0"
        style={{
          background: isDark ? '#2f2f2f' : '#f7f8f9',
          borderBottom: isDark ? '1px solid #4a4a4a' : '0.5px solid #ebedef',
          boxShadow: isDark
            ? '0 10px 24px -4px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)'
            : '0 8px 20px -4px rgba(0,0,0,0.22), 0 2px 6px -2px rgba(0,0,0,0.12)',
        }}
      >
        <button
          onClick={onClose}
          title="Fechar mapa"
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            isDark ? 'text-white/30 hover:text-white hover:bg-white/5' : 'text-black/30 hover:text-black hover:bg-black/5'
          }`}
        >
          <X size={20} />
        </button>
      </div>

      {/* Barra de ações inline (OS¹ · Mapa) — mesmo padrão do navegador */}
      <div style={{
        display: 'flex', gap: 8, padding: '8px 16px 16px',
        background: isDark ? '#2f2f2f' : '#f7f8f9',
        boxShadow: isDark
          ? '0 12px 20px -16px rgba(0,0,0,0.8), 0 4px 8px -6px rgba(0,0,0,0.5)'
          : '0 12px 20px -16px rgba(0,0,0,0.35), 0 4px 8px -6px rgba(0,0,0,0.18)',
        flexShrink: 0,
      }}>
        {(() => {
          const isAdmin = getRole() === 'codify';
          const allActions: { id: MapActionId; label: string; Icon: typeof LayoutGrid; adminOnly?: boolean }[] = [
            { id: 'feed-from-radius',          label: 'Feed do raio',     Icon: LayoutGrid },
            { id: 'analyze-competition',       label: 'Concorrência',     Icon: BarChart3 },
            { id: 'find-opportunities',        label: 'Oportunidades',    Icon: Search },
            { id: 'compare-regions',           label: 'Comparar regiões', Icon: GitCompareArrows },
            { id: 'territory-to-mission',      label: 'Missão',           Icon: Target },
            { id: 'monitor-territory',         label: 'Acompanhar (Codify)', Icon: Bell, adminOnly: true },
            { id: 'risk-map',                  label: 'Risco',            Icon: AlertTriangle },
            { id: 'sector-opportunities',      label: 'Oport. por setor', Icon: Briefcase },
            { id: 'nearby-partners',           label: 'Parceiros',        Icon: Handshake },
            { id: 'simulate-territory-action', label: 'Simular',          Icon: FlaskConical },
          ];
          return allActions.filter(a => !a.adminOnly || isAdmin);
        })().map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => handleMenuAction(id)}
            title={label}
            className={`flex-1 min-w-0 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[12px] font-medium cursor-pointer transition-all duration-200 hover:scale-105 active:scale-[0.97] ${
              isDark
                ? 'bg-[#2f2f2f] border-[0.5px] border-[#3d3d3d] text-neutral-200 shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.04)] hover:bg-[#353535]'
                : 'bg-[#f7f8f9] border-[0.5px] border-neutral-200 text-neutral-700 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12),inset_0_1px_2px_rgba(255,255,255,0.6)] hover:bg-[#e4e7ea]'
            }`}
          >
            <Icon size={13} strokeWidth={1.8} className={`flex-shrink-0 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`} />
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">{label}</span>
          </button>
        ))}
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
            isDark={isDark}
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

        {/* Badge de fallback escondido — Leaflet continua ativo, só não exibe o badge */}

        <MapLegend />

        <AnimatePresence>
          {selected && (
            <CompetitorCard competitor={selected} onClose={() => setSelected(null)} />
          )}
        </AnimatePresence>
      </div>

      {/* ── Botão inferior central: Analisar (ações OS¹ agora ficam na barra de cima)
          z-[1100] pra ficar acima dos panes do Leaflet (até ~1000) e dos controles
          do Google Maps. ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-[1100]">
        <button
          onClick={() => setAnalysisOpen(v => !v)}
          className="px-6 h-10 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xl"
        >
          {analysisOpen ? 'Fechar análise' : 'Analisar este raio'}
        </button>
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
