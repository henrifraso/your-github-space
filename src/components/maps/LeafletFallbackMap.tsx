import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Competitor } from '../../types';

// Fallback automático quando Google Maps não carrega (Safari ITP, AdBlock, rede).
// Usa OpenStreetMap via CartoDB Dark Matter (tile dark coerente com o tema OS¹).
// Não envia tráfego pra maps.googleapis.com — passa por qualquer browser.

interface MarkerInput {
  position: { lat: number; lng: number };
  competitor: Competitor;
  onClick: (c: Competitor) => void;
}

interface Props {
  center: { lat: number; lng: number };
  zoom: number;
  radius: number;            // metros; Infinity = sem círculo
  clientPosition: { lat: number; lng: number };
  markers: MarkerInput[];
  /** Respeita o tema do app: dark=CartoDB Dark Matter, light=CartoDB Positron. */
  isDark?: boolean;
}

export function LeafletFallbackMap({ center, zoom, radius, clientPosition, markers, isDark = true }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const circleRef = useRef<L.Circle | null>(null);

  // Inicializa o mapa uma vez
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [center.lat, center.lng],
      zoom,
      zoomControl: false,
      attributionControl: true,
    });
    const tileUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    L.tileLayer(tileUrl, {
      attribution: '© OpenStreetMap · CARTO',
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);
    mapRef.current = map;
    layerGroupRef.current = L.layerGroup().addTo(map);

    // Fix: container pode estar com altura 0 durante animação de entrada do CompetitiveMap.
    // Força recálculo de tiles em vários momentos cobrindo possibilidades de timing.
    // `cancelled` evita chamar invalidateSize() após desmontagem (crash _leaflet_pos).
    let cancelled = false;
    const raf = requestAnimationFrame(() => {
      if (!cancelled && mapRef.current) map.invalidateSize();
    });
    const tids = [50, 150, 300, 600, 1000].map(ms =>
      window.setTimeout(() => { if (!cancelled && mapRef.current) map.invalidateSize(); }, ms)
    );

    // ResizeObserver pega qualquer mudança subsequente (ex.: split view do ChatPanel)
    const ro = new ResizeObserver(() => {
      if (!cancelled && mapRef.current) mapRef.current.invalidateSize();
    });
    if (containerRef.current) ro.observe(containerRef.current);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      tids.forEach(t => window.clearTimeout(t));
      ro.disconnect();
      map.remove();
      mapRef.current = null;
      layerGroupRef.current = null;
      circleRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-centra quando center/zoom mudam
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setView([center.lat, center.lng], zoom, { animate: true });
  }, [center.lat, center.lng, zoom]);

  // Atualiza markers + cliente + círculo a cada mudança
  useEffect(() => {
    const map = mapRef.current;
    const group = layerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // Marker do cliente (centro)
    const clientIcon = L.divIcon({
      className: 'os1-leaflet-client',
      html: '<div style="width:18px;height:18px;border-radius:50%;background:#3b82f6;border:2px solid white;box-shadow:0 0 0 4px rgba(59,130,246,0.25)"></div>',
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });
    L.marker([clientPosition.lat, clientPosition.lng], { icon: clientIcon, zIndexOffset: 1000 }).addTo(group);

    // Markers dos concorrentes — bolinha + etiqueta clicável numa div unificada
    markers.forEach(({ position, competitor, onClick }) => {
      const risk = competitor.risco_competitivo;
      const color = risk === 'alto' ? '#ef4444' : risk === 'medio' ? '#f59e0b' : '#22c55e';
      const nome = competitor.nome;
      const icon = L.divIcon({
        className: '',
        html: `<div style="display:flex;align-items:center;gap:5px;cursor:pointer;pointer-events:all">` +
          `<div style="width:12px;height:12px;flex-shrink:0;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.18);box-shadow:0 0 0 2px rgba(0,0,0,0.45),0 1px 5px rgba(0,0,0,0.7)"></div>` +
          `<span style="color:#f0f0f0;font-size:10px;font-weight:600;white-space:nowrap;line-height:1.4;` +
            `background:rgba(8,8,10,0.82);padding:2px 6px;border-radius:4px;` +
            `border:0.5px solid rgba(255,255,255,0.1);text-shadow:0 1px 2px rgba(0,0,0,0.8)">` +
            `${nome}</span>` +
          `</div>`,
        iconAnchor: [7, 8],
      });
      const m = L.marker([position.lat, position.lng], { icon }).addTo(group);
      m.on('click', () => onClick(competitor));
    });

    // Círculo do raio
    if (circleRef.current) { map.removeLayer(circleRef.current); circleRef.current = null; }
    if (isFinite(radius) && radius > 0) {
      circleRef.current = L.circle([center.lat, center.lng], {
        radius,
        color: '#3b82f6',
        weight: 2,
        fillColor: '#3b82f6',
        fillOpacity: 0.08,
      }).addTo(map);
    }
  }, [markers, clientPosition.lat, clientPosition.lng, radius, center.lat, center.lng]);

  return (
    <>
      <style>{`
        .os1-leaflet-tooltip {
          background: rgba(20,20,22,0.94) !important;
          color: #fff !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          font-size: 11px !important;
          padding: 4px 8px !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important;
        }
        .os1-leaflet-tooltip::before { display: none !important; }
        .leaflet-container { background: #1a1a1a !important; }
        .leaflet-control-attribution { background: rgba(0,0,0,0.5) !important; color: rgba(255,255,255,0.4) !important; font-size: 9px !important; }
        .leaflet-control-attribution a { color: rgba(255,255,255,0.55) !important; }
        .leaflet-control-zoom a { background: rgba(20,20,22,0.85) !important; color: #fff !important; border: 1px solid rgba(255,255,255,0.1) !important; }
        .leaflet-control-zoom a:hover { background: rgba(40,40,45,0.95) !important; }
      `}</style>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </>
  );
}
