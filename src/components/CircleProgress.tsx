import React from 'react';
import { motion } from 'motion/react';

const EMPTY_DURATION = 1.2;

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

export function CircleProgress({ pct, label, color, delay = 0, onEmptyComplete, onClick }: {
  pct: number; label: string; color: string; delay?: number;
  onEmptyComplete?: () => void; onClick?: () => void;
}) {
  const [displayPct, setDisplayPct] = React.useState(0);
  const [emptying, setEmptying] = React.useState(false);
  const animRef = React.useRef<number | null>(null);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentValRef = React.useRef(0);
  const emptyingRef = React.useRef(false);
  emptyingRef.current = emptying;

  // Fill on mount — comportamento original
  React.useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      const duration = 2800;
      const startTime = performance.now();
      const tick = (now: number) => {
        if (emptyingRef.current) return; // interrompido pelo clique
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const val = Math.round(eased * pct);
        setDisplayPct(val);
        currentValRef.current = val;
        if (progress < 1) animRef.current = requestAnimationFrame(tick);
      };
      animRef.current = requestAnimationFrame(tick);
    }, delay * 1000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [pct, delay]);

  // Contagem regressiva quando esvaziando
  React.useEffect(() => {
    if (!emptying) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (animRef.current) cancelAnimationFrame(animRef.current);

    const startVal = currentValRef.current;
    if (startVal === 0) return; // anel já vazio, onAnimationComplete cuida do callback
    const duration = EMPTY_DURATION * 1000;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const val = Math.round(startVal * (1 - progress));
      setDisplayPct(val);
      currentValRef.current = val;
      if (progress < 1) animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [emptying]);

  const handleClick = () => {
    if (emptying) return;
    onClick?.();
    setEmptying(true);
  };

  return (
    <div
      className="flex flex-col items-center gap-1 sm:gap-1.5 flex-shrink-0 cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
      onClick={handleClick}
    >
      <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-20 md:h-20">
        <div className="absolute inset-0 rounded-2xl shadow-[0_6px_16px_-3px_rgba(0,0,0,0.18),0_2px_4px_rgba(0,0,0,0.10),0_-1px_3px_rgba(255,255,255,0.75)] dark:shadow-[0_8px_20px_-3px_rgba(0,0,0,0.6),0_2px_6px_rgba(0,0,0,0.4)] pointer-events-none" />
        <div className="absolute inset-0 rounded-2xl border-[0.5px] border-neutral-300 dark:border-[#4a4a4a] pointer-events-none z-[2]" />
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 64 64" style={{ filter: `drop-shadow(0 0 1.5px ${color}55)` }}>
          <rect x="6" y="6" width="52" height="52" rx="16" ry="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" className="text-neutral-300 dark:text-[#4a4a4a]" />
          <motion.rect
            x="6" y="6" width="52" height="52" rx="16" ry="16"
            fill="none" stroke={color} strokeWidth="2.5"
            strokeLinejoin="round" strokeLinecap="butt"
            pathLength={100}
            strokeDasharray="100"
            initial={{ strokeDashoffset: 100 }}
            animate={{ strokeDashoffset: emptying ? 100 : 100 - pct }}
            transition={emptying
              ? { duration: EMPTY_DURATION, ease: 'easeIn' }
              : { duration: 2.8, ease: 'easeOut', delay }
            }
            onAnimationComplete={() => {
              if (emptyingRef.current && onEmptyComplete) onEmptyComplete();
            }}
          />
        </svg>
        <div className="absolute inset-[20%] rounded-full bg-[#E6E6E8] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[inset_0_2px_7px_rgba(0,0,0,0.18),inset_0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(255,255,255,0.9)] dark:shadow-[0_4px_10px_-1px_rgba(0,0,0,0.55),0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.04)] pointer-events-none" />
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
