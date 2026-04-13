import React from 'react';
import { motion } from 'motion/react';

interface BottomModalProps {
  onClose: () => void;
  zIndex?: number;
  maxWidth?: string;
  height?: string;
  children: React.ReactNode;
}

export function BottomModal({ onClose, zIndex = 150, maxWidth = 'md:max-w-lg', height = '70vh', children }: BottomModalProps) {
  return (
    <div className="fixed inset-0 flex items-end md:items-center justify-center" style={{ zIndex }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 350, mass: 0.8 }}
        className={`relative w-full ${maxWidth} bg-[#fafafa] dark:bg-[#161616] rounded-t-2xl md:rounded-2xl p-5 sm:p-6 overflow-y-auto border border-transparent dark:border-[#262626]`}
        style={{ height }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-white p-2 rounded-xl transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/50">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  );
}

export function ModalHeader({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">{children}</div>
      <CloseButton onClose={onClose} />
    </div>
  );
}
