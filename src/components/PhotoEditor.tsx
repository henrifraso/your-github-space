import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Camera, Check, Minus, Plus } from 'lucide-react';
import { ModalHeader } from './BottomModal';

export interface PhotoSettings {
  src: string;
  x: number;   // translate em px (espaço da tela)
  y: number;
  zoom: number; // 1.0 – 3.0
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

const PREVIEW = 240; // px — tamanho do círculo de preview
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

export function PhotoEditor({ defaultSrc, initial, onSave, onClose }: Props) {
  const [src, setSrc] = useState(initial.src || defaultSrc);
  const [zoom, setZoom] = useState(initial.zoom);
  const [pos, setPos] = useState({ x: initial.x, y: initial.y });
  const fileRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<{ px: number; py: number; ix: number; iy: number } | null>(null);

  // Limite de pan: metade do excesso de tamanho em coordenadas de tela
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
    setPos({
      x: clamp(dragRef.current.ix + dx, zoom),
      y: clamp(dragRef.current.iy + dy, zoom),
    });
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
    const s: PhotoSettings = { src, x: pos.x, y: pos.y, zoom };
    savePhotoSettings(s);
    onSave(s);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-end md:items-center justify-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70" onClick={onClose} />

      <motion.div
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full md:max-w-sm bg-white dark:bg-[#1c1c1c] rounded-t-2xl md:rounded-2xl p-6"
      >
        <ModalHeader onClose={onClose}>
          <Camera size={18} className="text-[#0095f6]" />
          <h2 className="text-base font-bold">Foto do Perfil</h2>
        </ModalHeader>

        {/* Preview arrastável */}
        <div className="flex flex-col items-center gap-5">
          <div
            className="rounded-full overflow-hidden cursor-grab active:cursor-grabbing select-none border-4 border-[#0095f6]/30"
            style={{ width: PREVIEW, height: PREVIEW, touchAction: 'none' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            <img
              src={src}
              alt="preview"
              draggable={false}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `scale(${zoom}) translate(${pos.x / zoom}px, ${pos.y / zoom}px)`,
                transformOrigin: 'center',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            />
          </div>

          <p className="text-[11px] text-[#8e8e8e]">Arraste para reposicionar</p>

          {/* Zoom */}
          <div className="flex items-center gap-3 w-full">
            <button onClick={() => changeZoom(-0.1)}
              className="w-8 h-8 rounded-full bg-[#f0f0f0] dark:bg-[#2a2a2a] flex items-center justify-center text-[#262626] dark:text-white">
              <Minus size={14} />
            </button>
            <input
              type="range" min={MIN_ZOOM} max={MAX_ZOOM} step={0.05}
              value={zoom}
              onChange={e => {
                const next = Number(e.target.value);
                setZoom(next);
                setPos(p => ({ x: clamp(p.x, next), y: clamp(p.y, next) }));
              }}
              className="flex-1 accent-[#0095f6]"
            />
            <button onClick={() => changeZoom(0.1)}
              className="w-8 h-8 rounded-full bg-[#f0f0f0] dark:bg-[#2a2a2a] flex items-center justify-center text-[#262626] dark:text-white">
              <Plus size={14} />
            </button>
            <span className="text-xs text-[#8e8e8e] w-8 text-right">{zoom.toFixed(1)}×</span>
          </div>

          {/* Upload */}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full h-11 rounded-xl border border-[#dbdbdb] dark:border-[#333] text-sm font-semibold text-[#262626] dark:text-[#f0f0f0] hover:bg-[#f7f7f7] dark:hover:bg-[#2a2a2a] transition-colors flex items-center justify-center gap-2">
            <Camera size={16} />
            Escolher nova foto
          </button>

          {/* Salvar */}
          <button
            onClick={handleSave}
            className="w-full h-11 rounded-xl bg-[#0095f6] text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#0080d6] transition-colors">
            <Check size={16} />
            Salvar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
