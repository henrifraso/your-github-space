import React, { useState, useEffect, useCallback } from 'react';
import type { StoryGroup } from '../types';
import { BARBER_PHOTOS, STORY_DURATION } from '../mockData';

export function StoryViewer({ groups, startIndex, onClose }: { groups: StoryGroup[]; startIndex: number; onClose: () => void }) {
  const [groupIdx, setGroupIdx] = useState(startIndex);
  const [slideIdx, setSlideIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const group = groups[groupIdx];
  const slide = group.slides[slideIdx];
  const totalSlides = group.slides.length;

  const goNext = useCallback(() => {
    if (slideIdx < totalSlides - 1) { setSlideIdx(s => s + 1); setProgress(0); }
    else if (groupIdx < groups.length - 1) { setGroupIdx(g => g + 1); setSlideIdx(0); setProgress(0); }
    else { onClose(); }
  }, [slideIdx, totalSlides, groupIdx, groups.length, onClose]);

  const goPrev = () => {
    if (slideIdx > 0) { setSlideIdx(s => s - 1); setProgress(0); }
    else if (groupIdx > 0) { setGroupIdx(g => g - 1); setSlideIdx(0); setProgress(0); }
  };

  useEffect(() => {
    setProgress(0);
    if (timerRef.current) clearInterval(timerRef.current);
    const step = 100 / (STORY_DURATION / 50);
    timerRef.current = setInterval(() => {
      setProgress(p => {
        if (p + step >= 100) { clearInterval(timerRef.current!); goNext(); return 100; }
        return p + step;
      });
    }, 50);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [groupIdx, slideIdx, goNext]);

  return (
    <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center">
      <div className="relative w-full max-w-sm h-full max-h-[100dvh] overflow-hidden">
        <img src={slide.image} alt={slide.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />

        <div className="absolute top-3 left-3 right-3 flex gap-1 z-10">
          {group.slides.map((_, i) => (
            <div key={i} className="flex-1 h-[2px] bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-none"
                style={{ width: i < slideIdx ? '100%' : i === slideIdx ? `${progress}%` : '0%' }} />
            </div>
          ))}
        </div>

        <div className="absolute top-8 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/50">
              <img src={BARBER_PHOTOS.profile} alt="perfil" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-white text-xs font-bold leading-none">McDonald's</p>
              <p className="text-white/60 text-[10px]">{group.label}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="absolute bottom-12 left-4 right-4 z-10">
          <p className="text-white font-bold text-lg leading-tight mb-2 drop-shadow">{slide.title}</p>
          <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line drop-shadow">{slide.body}</p>
        </div>

        <button className="absolute left-0 top-0 w-1/3 h-full z-20" onClick={goPrev} />
        <button className="absolute right-0 top-0 w-2/3 h-full z-20" onClick={goNext} />
      </div>

      {groupIdx > 0 && (
        <button onClick={() => { setGroupIdx(g => g - 1); setSlideIdx(0); setProgress(0); }}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white z-30">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
      )}
      {groupIdx < groups.length - 1 && (
        <button onClick={() => { setGroupIdx(g => g + 1); setSlideIdx(0); setProgress(0); }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white z-30">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      )}
    </div>
  );
}
