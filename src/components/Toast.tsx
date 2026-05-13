import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ToastProps {
  message: string;
  color?: 'green' | 'red' | 'blue';
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

export function Toast({ message, color = 'blue', visible, onHide, duration = 1800 }: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onHide, duration);
    return () => clearTimeout(t);
  }, [visible, onHide, duration]);

  const bg = color === 'green' ? '#16a34a' : color === 'red' ? '#dc2626' : '#2563eb';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          className="fixed top-16 left-1/2 z-[999] pointer-events-none"
          style={{ transform: 'translateX(-50%)' }}
        >
          <div
            className="px-4 py-2.5 rounded-xl text-white text-sm font-semibold shadow-lg"
            style={{ background: bg, minWidth: 160, textAlign: 'center' }}
          >
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function useToast() {
  const [toast, setToast] = React.useState<{ message: string; color: 'green' | 'red' | 'blue'; visible: boolean }>({
    message: '', color: 'blue', visible: false,
  });

  const show = React.useCallback((message: string, color: 'green' | 'red' | 'blue' = 'blue') => {
    setToast({ message, color, visible: true });
  }, []);

  const hide = React.useCallback(() => {
    setToast(t => ({ ...t, visible: false }));
  }, []);

  return { toast, show, hide };
}
