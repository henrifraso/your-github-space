import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Camera, Check, Minus, Plus, Circle, Square } from 'lucide-react';
import { ModalHeader } from './BottomModal';

export type PhotoShape = 'round' | 'square';

export interface PhotoSettings {
  src: string;
  x: number;
  y: number;
  zoom: number;
  locked?: boolean;
  shape?: PhotoShape;
}

const LS_KEY = 'omni_profile_photo';

export function loadPhotoSettings(): PhotoSettings | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as PhotoSettings) : null;
  } catch { return null; }
}

function savePhotoSettings(s: PhotoSettings) {
  localStorage.setItem(LS_KEY, JSON.stringify(s));
}

async function resizeToBase64(file: File, maxPx = 500): Promise<string> {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.88));
      };
      img.src = e.target!.result as string;
    };
    reader.readAsDataURL(file);
  });
}

interface Props {
  defaultSrc: string;
  initial: PhotoSettings;
  onSave: (s: PhotoSettings) => void;
  onClose: () => void;
}

const PREVIEW = 240;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

export function PhotoEditor({ defaultSrc, initial, onSave, onClose }: Props) {
  const [src, setSrc] = useState(initial.src || defaultSrc);
  const [zoom, setZoom] = useState(initial.zoom);
  const [pos, setPos] = useState({ x: initial.x, y: initial.y });
  const [shape, setShape] = useState<PhotoShape>(initial.shape ?? 'round');
  const fileRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<{ px: number; py: number; ix: number; iy: number } | null>(null);

  const maxPan = useCallback((z: number) => ((z - 1) * PREVIEW) / 2, []);

  const clamp = (v: number, z: number) => {
    const m = maxPan(z);
    return Math.max(-m, Math.min(m, v));
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { px: e.clientX, py: e.clientY, ix: pos.x, iy: pos.y };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.px;
    const dy = e.clientY - dragRef.current.py;
    setPos({ x: clamp(dragRef.current.ix + dx, zoom), y: clamp(dragRef.current.iy + dy, zoom) });
  };

  const onPointerUp = () => { dragRef.current = null; };

  const changeZoom = (delta: number) => {
    setZoom(z => {
      const next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z + delta));
      setPos(p => ({ x: clamp(p.x, next), y: clamp(p.y, next) }));
      return next;
    });
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await resizeToBase64(file);
    setSrc(b64);
    setPos({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleSave = () => {
    const s: PhotoSettings = { src, x: pos.x, y: pos.y, zoom, locked: true, shape };
    savePhotoSettings(s);
    onSave(s);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-end md:items-center justify-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full md:max-w-sm bg-[#fafafa] dark:bg-[#323232] rounded-t-2xl md:rounded-2xl p-6 border border-transparent dark:border-[#414141]"
      >
        <ModalHeader onClose={onClose}>
          <Camera size={18} className="text-[#3b82f6]" />
          <h2 className="text-base font-bold">Foto do Perfil</h2>
        </ModalHeader>

        <div className="flex flex-col items-center gap-5">
          <div
            className={`${shape === 'round' ? 'rounded-full' : 'rounded-3xl'} overflow-hidden cursor-grab active:cursor-grabbing select-none border-4 border-[#3b82f6]/25`}
            style={{ width: PREVIEW, height: PREVIEW, touchAction: 'none' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            <img src={src} alt="preview" draggable={false}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                transform: `scale(${zoom}) translate(${pos.x / zoom}px, ${pos.y / zoom}px)`,
                transformOrigin: 'center', userSelect: 'none', pointerEvents: 'none',
              }} />
          </div>

          <p className="text-xs text-neutral-500">Arraste para reposicionar</p>

          {/* Escolha de formato da moldura */}
          <div className="flex items-center gap-2 w-full">
            <button onClick={() => setShape('round')}
              className={`flex-1 h-10 rounded-xl border-[0.5px] flex items-center justify-center gap-2 text-xs font-semibold transition-all duration-150 cursor-pointer ${shape === 'round' ? 'bg-[#3b82f6] border-[#3b82f6] text-white' : 'bg-[#EFEFF1] dark:bg-[#2f2f2f] border-neutral-200 dark:border-[#3d3d3d] text-neutral-700 dark:text-neutral-200'}`}>
              <Circle size={14} />
              Redonda
            </button>
            <button onClick={() => setShape('square')}
              className={`flex-1 h-10 rounded-xl border-[0.5px] flex items-center justify-center gap-2 text-xs font-semibold transition-all duration-150 cursor-pointer ${shape === 'square' ? 'bg-[#3b82f6] border-[#3b82f6] text-white' : 'bg-[#EFEFF1] dark:bg-[#2f2f2f] border-neutral-200 dark:border-[#3d3d3d] text-neutral-700 dark:text-neutral-200'}`}>
              <Square size={14} />
              Quadrada
            </button>
          </div>

          <div className="flex items-center gap-3 w-full">
            <button onClick={() => changeZoom(-0.1)}
              className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-[#353535] flex items-center justify-center text-neutral-800 dark:text-white transition-all duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-800/50 cursor-pointer">
              <Minus size={16} />
            </button>
            <input type="range" min={MIN_ZOOM} max={MAX_ZOOM} step={0.05} value={zoom}
              onChange={e => { const next = Number(e.target.value); setZoom(next); setPos(p => ({ x: clamp(p.x, next), y: clamp(p.y, next) })); }}
              className="flex-1 accent-[#3b82f6]" />
            <button onClick={() => changeZoom(0.1)}
              className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-[#353535] flex items-center justify-center text-neutral-800 dark:text-white transition-all duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-800/50 cursor-pointer">
              <Plus size={16} />
            </button>
            <span className="text-xs text-neutral-500 w-8 text-right">{zoom.toFixed(1)}×</span>
          </div>

          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
          <button onClick={() => fileRef.current?.click()}
            className="w-full h-11 rounded-xl border border-neutral-200 dark:border-[#414141] text-sm font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer">
            <Camera size={16} />
            Escolher nova foto
          </button>

          <button onClick={handleSave}
            className="w-full h-11 rounded-xl bg-[#3b82f6] text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#2563eb] transition-all duration-200 cursor-pointer">
            <Check size={16} />
            Salvar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
