import React from 'react';
import { motion } from 'motion/react';

export function PieChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, g) => s + g.value, 0);
  if (total === 0) return null;
  const cx = 80, cy = 80, r = 62;
  let angle = -Math.PI / 2;
  return (
    <svg viewBox="0 0 160 160" className="w-36 h-36">
      {segments.map((seg, i) => {
        const sweep = (seg.value / total) * 2 * Math.PI;
        const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle);
        const x2 = cx + r * Math.cos(angle + sweep), y2 = cy + r * Math.sin(angle + sweep);
        const d = `M${cx},${cy} L${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r},0,${sweep > Math.PI ? 1 : 0},1,${x2.toFixed(2)},${y2.toFixed(2)}Z`;
        angle += sweep;
        return <path key={i} d={d} fill={seg.color} stroke="#0a0a0a" strokeWidth="1.5" />;
      })}
    </svg>
  );
}

export function CircleProgress({ pct, label, color, delay = 0, onClick }: {
  pct: number; label: string; color: string; delay?: number; onClick?: () => void;
}) {
  const r = 26;
  const circ = 2 * Math.PI * r;
  const [displayPct, setDisplayPct] = React.useState(0);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      const duration = 2800;
      const startTime = performance.now();
      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayPct(Math.round(eased * pct));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [pct, delay]);

  return (
    <div className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer transition-all duration-200 hover:scale-105" onClick={onClick}>
      <div className="relative w-14 h-14 md:w-20 md:h-20">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={r} fill="none" stroke="currentColor" strokeWidth="3.5" className="text-neutral-200 dark:text-[#262626]" />
          <motion.circle
            cx="32" cy="32" r={r}
            fill="none" stroke={color} strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ * (1 - pct / 100) }}
            transition={{ duration: 2.8, ease: 'easeOut', delay }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-xs md:text-base font-bold text-neutral-800 dark:text-neutral-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.4 }}
          >
            {displayPct}%
          </motion.span>
        </div>
      </div>
      <span className="text-[10px] md:text-xs font-semibold text-neutral-500 tracking-tight text-center leading-tight w-full">{label}</span>
    </div>
  );
}
