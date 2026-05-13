import React from 'react';

const ITEMS = [
  { color: '#8e8e8e', label: 'Direto',   filled: true },
  { color: '#8e8e8e', label: 'Indireto', filled: false },
  { color: '#22c55e', label: '≥ 4.3',    filled: true },
  { color: '#f59e0b', label: '4.0–4.2',  filled: true },
  { color: '#ef4444', label: '< 4.0',    filled: true },
  { color: '#3b82f6', label: 'Você',     filled: true },
];

export function MapLegend() {
  return (
    <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 px-3 py-2 rounded-xl"
      style={{ background: 'rgba(20,20,20,0.82)', backdropFilter: 'blur(8px)' }}>
      {ITEMS.map(({ color, label, filled }) => (
        <div key={label} className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: filled ? color : 'transparent', border: filled ? 'none' : `1.5px solid ${color}` }} />
          <span className="text-[11px] text-white/60">{label}</span>
        </div>
      ))}
    </div>
  );
}
