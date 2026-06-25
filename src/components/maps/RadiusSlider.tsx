import React from 'react';

const STEPS = [
  { label: '500m',      meters: 500 },
  { label: '1 km',      meters: 1000 },
  { label: '2 km',      meters: 2000 },
  { label: '3 km',      meters: 3000 },
  { label: '5 km',      meters: 5000 },
  { label: '10 km',     meters: 10000 },
  { label: '25 km',     meters: 25000 },
  { label: '50 km',     meters: 50000 },
  { label: 'Sem\nlimite', meters: Infinity },
];

interface Props {
  value: number;
  onChange: (meters: number) => void;
  competitorCount: number;
}

export function RadiusSlider({ value, onChange, competitorCount }: Props) {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Topo — label */}
      <div className="flex-shrink-0 px-2 pt-3 pb-2 border-b border-neutral-200 dark:border-[#414141]">
        <p className="text-[9px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500 text-center">
          Raio
        </p>
      </div>

      {/* Opções verticais */}
      <div className="flex-1 flex flex-col justify-around py-2 px-1.5 min-h-0">
        {STEPS.map(step => {
          const active = step.meters === value;
          return (
            <button
              key={step.meters}
              onClick={() => onChange(step.meters)}
              className={`w-full py-1.5 rounded-xl text-[9px] font-semibold text-center leading-tight transition-all duration-150 cursor-pointer whitespace-pre-line ${
                active
                  ? 'bg-[#3b82f6] text-white shadow-sm'
                  : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-white/10 hover:text-neutral-700 dark:hover:text-white'
              }`}
            >
              {step.label}
            </button>
          );
        })}
      </div>

      {/* Rodapé — contagem */}
      <div className="flex-shrink-0 px-2 pt-2 pb-3 border-t border-neutral-200 dark:border-[#414141] text-center">
        <p className={`text-[11px] font-bold tabular-nums ${
          competitorCount === 0 ? 'text-red-500 dark:text-red-400' : 'text-neutral-600 dark:text-neutral-300'
        }`}>
          {value === Infinity ? '∞' : competitorCount}
        </p>
        <p className="text-[8px] text-neutral-400 dark:text-neutral-500 mt-0.5 leading-none">
          {value === Infinity ? 'todos' : 'visíveis'}
        </p>
      </div>
    </div>
  );
}
