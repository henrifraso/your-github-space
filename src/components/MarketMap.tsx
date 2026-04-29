import React, { useEffect } from 'react';
import { MapPin, X } from 'lucide-react';
import { motion } from 'motion/react';
import type { Competitor } from '../types';
import 'leaflet/dist/leaflet.css';

// Coordenadas reais de São Paulo — Av. Paulista e entorno
const COORDS: [number, number][] = [
  [-23.5600, -46.6572], [-23.5628, -46.6545], [-23.5601, -46.6580],
  [-23.5590, -46.6598], [-23.5640, -46.6520], [-23.5620, -46.6490],
  [-23.5605, -46.6610], [-23.5648, -46.6530],
];

const YOU: [number, number] = [-23.5614, -46.6560];

function isDireto(nome: string) {
  return /burger king|bob's|bobs|kfc|giraffas|habib|popeyes/i.test(nome);
}

function ratingColor(nota: number | string) {
  const n = Number(nota);
  if (n >= 4.3) return '#22c55e';
  if (n >= 4.0) return '#f59e0b';
  return '#ef4444';
}

interface ButtonProps { open: boolean; onToggle: () => void; }
interface ContentProps { open: boolean; onClose: () => void; competitors: Competitor[]; onCompetitorClick?: (c: Competitor) => void; }

export function MarketMapButton({ open, onToggle }: ButtonProps) {
  return (
    <button
      onClick={onToggle}
      className="w-full h-9 md:h-11 flex items-center justify-center bg-white dark:bg-[#272727] border border-neutral-100 dark:border-[#363636] hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] rounded-xl text-xs md:text-sm font-semibold text-neutral-800 dark:text-neutral-200 transition-all duration-200 cursor-pointer">
      {open ? 'Fechar' : 'Mapa'}
    </button>
  );
}

export function MarketMapContent({ open, onClose, competitors, onCompetitorClick }: ContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed inset-0 z-[190] bg-white dark:bg-[#1b1b1b] flex flex-col"
    >
      <div className="flex items-center justify-between px-6 sm:px-8 pt-6 sm:pt-8 pb-4 flex-shrink-0 border-b border-neutral-100 dark:border-[#363636]">
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-[#3b82f6]" />
          <p className="text-xs font-bold uppercase tracking-widest text-[#3b82f6]">Mapa do Mercado</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition-all duration-200 cursor-pointer"
        >
          <X size={22} />
        </button>
      </div>

      <div className="flex-1 min-h-0">
        <LeafletMap competitors={competitors} onCompetitorClick={onCompetitorClick} />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-6 py-3 border-t border-neutral-200 dark:border-[#363636] flex-shrink-0">
        {[
          { color: '#8e8e8e', label: 'Direto', filled: true },
          { color: '#8e8e8e', label: 'Indireto', filled: false },
          { color: '#22c55e', label: '≥ 4.3', filled: true },
          { color: '#f59e0b', label: '4.0–4.2', filled: true },
          { color: '#ef4444', label: '< 4.0', filled: true },
        ].map(({ color, label, filled }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: filled ? color : 'transparent', border: filled ? 'none' : `1.5px solid ${color}` }} />
            <span className="text-xs text-neutral-500">{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-[#3b82f6]" />
          <span className="text-xs text-neutral-500">Você</span>
        </div>
      </div>
    </motion.div>
  );
}

function LeafletMap({ competitors, onCompetitorClick }: { competitors: Competitor[]; onCompetitorClick?: (c: Competitor) => void }) {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const mapInstanceRef = React.useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    import('leaflet').then(L => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current!, { center: YOU, zoom: 15, zoomControl: true, scrollWheelZoom: true });
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap', maxZoom: 19,
      }).addTo(map);

      const youIcon = L.divIcon({
        className: '',
        html: `<div style="width:20px;height:20px;border-radius:50%;background:#3b82f6;border:3px solid white;box-shadow:0 2px 8px rgba(59,130,246,0.5);"></div>`,
        iconSize: [20, 20], iconAnchor: [10, 10],
      });
      L.marker(YOU, { icon: youIcon }).addTo(map).bindPopup('<strong style="font-size:13px">Você está aqui</strong>');

      competitors.slice(0, 8).forEach((c, i) => {
        const coord = COORDS[i] ?? YOU;
        const color = ratingColor(c.nota_google);
        const direto = isDireto(c.nome);
        const icon = L.divIcon({
          className: '',
          html: `<div style="width:14px;height:14px;border-radius:50%;background:${direto ? color : 'white'};border:2.5px solid ${color};box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [14, 14], iconAnchor: [7, 7],
        });
        const popup = `<div style="min-width:160px;font-family:sans-serif"><strong style="font-size:13px;display:block;margin-bottom:2px">${c.nome}</strong><span style="font-size:11px;color:#8e8e8e">${c.endereco}</span><br/><span style="font-size:12px;font-weight:600;color:${color}">★ ${Number(c.nota_google).toFixed(1)}</span><span style="font-size:11px;color:#8e8e8e;margin-left:6px">${c.faixa_preco}</span></div>`;
        L.marker(coord, { icon }).addTo(map).bindPopup(popup).on('click', () => { if (onCompetitorClick) onCompetitorClick(c); });
      });
    });

    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, []);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
}
