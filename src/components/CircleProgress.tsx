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
    <div className="flex flex-col items-center gap-1 sm:gap-1.5 flex-shrink-0 cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95" onClick={onClick}>
      <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-20 md:h-20">
        {/* Sombra externa do disco — separa do fundo do container */}
        <div className="absolute inset-0 rounded-2xl shadow-[0_6px_16px_-3px_rgba(0,0,0,0.22),0_2px_4px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_20px_-3px_rgba(0,0,0,0.6),0_2px_6px_rgba(0,0,0,0.4)] pointer-events-none" />
        {/* Borda fina externa — clara no light, mais escura no dark */}
        <div className="absolute inset-0 rounded-2xl border-[0.5px] border-neutral-200 dark:border-[#4a4a4a] pointer-events-none z-[2]" />
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 64 64" style={{ filter: `drop-shadow(0 0 1.5px ${color}55)` }}>
          <rect x="6" y="6" width="52" height="52" rx="16" ry="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" className="text-neutral-400 dark:text-[#4a4a4a]" />
          <motion.rect
            x="6" y="6" width="52" height="52" rx="16" ry="16"
            fill="none" stroke={color} strokeWidth="2.5"
            strokeLinejoin="round" strokeLinecap="butt"
            pathLength={100}
            strokeDasharray="100"
            initial={{ strokeDashoffset: 100 }}
            animate={{ strokeDashoffset: 100 - pct }}
            transition={{ duration: 2.8, ease: 'easeOut', delay }}
          />
        </svg>
        {/* Background claro circular do miolo — botão redondo no centro */}
        <div className="absolute inset-[20%] rounded-full bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_4px_10px_-1px_rgba(0,0,0,0.22),0_1px_3px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.6)] dark:shadow-[0_4px_10px_-1px_rgba(0,0,0,0.55),0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.04)] pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-[9px] sm:text-[11px] md:text-sm font-bold text-neutral-800 dark:text-neutral-100"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.4, duration: 0.3 }}
          >
            {displayPct}%
          </motion.span>
        </div>
      </div>
      <span className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-neutral-500 dark:text-neutral-200 tracking-tight text-center leading-tight w-full max-w-[60px] sm:max-w-none">{label}</span>
    </div>
  );
}
