// PasswordField — input de senha com toggle de mostrar/ocultar.
//
// Conteúdo movido de src/components/LoginScreen.tsx (Fase 19) byte-a-byte.
// Componente self-contained: state `show` interno + ícones Eye/EyeOff.
// Classes Tailwind, placeholder default e transições preservados.

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordFieldProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function PasswordField({ value, onChange, placeholder }: PasswordFieldProps) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder ?? 'Senha'}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-white/25 transition-colors duration-200"
      />
      <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors duration-200 cursor-pointer">
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
