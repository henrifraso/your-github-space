import React from 'react';

const STEPS = [
  { label: '500m', meters: 500 },
  { label: '1km',  meters: 1000 },
  { label: '2km',  meters: 2000 },
  { label: '3km',  meters: 3000 },
  { label: '5km',  meters: 5000 },
  { label: '10km', meters: 10000 },
  { label: '25km', meters: 25000 },
  { label: '50km', meters: 50000 },
  { label: 'Sem limite', meters: Infinity },
];

interface Props {
  value: number;
  onChange: (meters: number) => void;
  competitorCount: number;
}

export function RadiusSlider({ value, onChange, competitorCount }: Props) {
  const idx = STEPS.findIndex(s => s.meters === value);
  const currentStep = STEPS[idx] ?? STEPS[4];

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/8 bg-[#181818]">
      <span className="text-white/40 text-[11px] flex-shrink-0 w-16">Raio</span>
      <input
        type="range"
        min={0}
        max={STEPS.length - 1}
        value={idx === -1 ? 4 : idx}
        onChange={e => onChange(STEPS[Number(e.target.value)].meters)}
        className="flex-1 h-1 appearance-none rounded-full cursor-pointer"
        style={{ accentColor: '#3b82f6' }}
      />
      <span className="text-white/80 text-xs font-medium w-16 text-right flex-shrink-0">{currentStep.label}</span>
      <span className={`text-xs flex-shrink-0 w-28 text-right ${competitorCount === 0 ? 'text-[#ef4444]' : 'text-white/40'}`}>
        {value === Infinity ? 'todos' : `${competitorCount} concorrente${competitorCount !== 1 ? 's' : ''}`}
      </span>
    </div>
  );
}
