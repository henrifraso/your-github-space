import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'motion/react';
import { Eye, EyeOff, ChevronRight, Check, Shield, Building2, X, Search } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
type Step = 'landing' | 'auth' | 'business' | 'consent';
type AuthMode = 'login' | 'register';

interface Business { id: string; nome: string; segmento: string; cidade: string; estado: string; }

export interface Props { onAuthenticated: (token: string, negocioId: string) => void; }

// ── Phrases ───────────────────────────────────────────────────────────────────
// ── API ───────────────────────────────────────────────────────────────────────
async function apiLogin(email: string, password: string) {
  try {
    const r = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    if (r.ok) return await r.json();
    const e = await r.json().catch(() => ({}));
    throw new Error(e.detail || 'Credenciais inválidas');
  } catch (err: any) {
    if (err?.message && err.message !== 'Failed to fetch') throw err;
  }
  if (email === 'admin@mcdonalds-os1.test' && password === 'Teste123!') return { access_token: `demo.${Date.now()}`, user: { nome: 'Admin', email } };
  throw new Error('Credenciais inválidas');
}

async function apiRegister(nome: string, email: string, password: string) {
  try {
    const r = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nome, email, password }) });
    if (r.ok) return await r.json();
    const e = await r.json().catch(() => ({}));
    throw new Error(e.detail || 'Erro ao criar conta');
  } catch (err: any) {
    if (err?.message === 'Failed to fetch') return { access_token: `demo.${Date.now()}`, user: { nome, email } };
    throw err;
  }
}

async function apiBusinesses(token: string): Promise<Business[]> {
  try {
    const r = await fetch('/api/negocios', { headers: { Authorization: `Bearer ${token}` } });
    if (r.ok) return await r.json();
  } catch {}
  return [
    { id: 'mcdo-paulista', nome: "McDonald's Avenida Paulista", segmento: 'fast_food', cidade: 'São Paulo', estado: 'SP' },
    { id: 'mcdo-brigadeiro', nome: "McDonald's Brigadeiro", segmento: 'fast_food', cidade: 'São Paulo', estado: 'SP' },
  ];
}

async function apiSelectBusiness(token: string, negocioId: string) {
  try { await fetch('/api/negocios/selecionar', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ negocio_id: negocioId }) }); } catch {}
}

async function apiConsent(token: string, negocioId: string) {
  try { await fetch('/api/sync/consent', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ negocio_id: negocioId, consent_version: '1.0' }) }); } catch {}
}

// ── RippleButton ──────────────────────────────────────────────────────────────
function RippleButton({
  onTap, exiting, exitY, loginPhase, onNextPhase, onProfileClick,
}: {
  onTap: (yToTop: number) => void;
  exiting: boolean;
  exitY: number;
  loginPhase: 'idle' | 'user' | 'pass' | 'profile';
  onNextPhase: () => void;
  onProfileClick: () => void;
}) {
  const [ripples,  setRipples]  = useState<{ id: number; x: number; y: number }[]>([]);
  const [inputVal, setInputVal] = useState('');
  const btnRef   = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const controls = useAnimation();

  // ── Animação de entrada (3 fases) ──────────────────────────────────────────
  useEffect(() => {
    // mesma fórmula do exitY — container começa exatamente onde vai ao ser clicado
    const rect = btnRef.current!.getBoundingClientRect();
    const loginY = -rect.top + 32;
    controls.set({ y: loginY, scaleX: 1.45 });
    controls.start({ opacity: 1, filter: 'blur(0px)', y: loginY, scaleX: 1.45 }, { duration: 0.40, ease: 'easeOut' });
    const t1 = setTimeout(() =>
      controls.start({ y: 0, scaleX: 1 }, { duration: 1.10, ease: [0.25, 0.46, 0.45, 0.94] }), 520);
    return () => { clearTimeout(t1); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sobe quando exiting dispara ────────────────────────────────────────────
  useEffect(() => {
    if (!exiting) return;
    controls.start(
      { scaleX: 1.45, y: exitY },
      { duration: 1.05, ease: [0.25, 0.46, 0.45, 0.94] },
    );
  }, [exiting, exitY]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Foca input e limpa valor quando loginPhase muda ──────────────────────
  useEffect(() => {
    if (loginPhase === 'idle') return;
    setInputVal('');
    setTimeout(() => inputRef.current?.focus(), 60);
  }, [loginPhase]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Enter global para fase 'profile' (sem input na tela) ─────────────────
  // Guard de 300ms para não capturar o mesmo Enter que ativou a fase
  useEffect(() => {
    if (loginPhase !== 'profile') return;
    const activatedAt = Date.now();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && Date.now() - activatedAt > 300) onProfileClick();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [loginPhase, onProfileClick]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (exiting) return;
    const rect = btnRef.current!.getBoundingClientRect();
    const id = Date.now();
    setRipples(r => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 700);
    onTap(-rect.top + 32);
  }, [exiting, onTap]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    if (loginPhase === 'profile') { onProfileClick(); return; }
    if (inputVal.trim()) onNextPhase();
  }, [inputVal, loginPhase, onNextPhase, onProfileClick]);

  const isLogin = loginPhase !== 'idle';

  return (
    <div className="w-full max-w-[760px] z-20 relative">
      <motion.button
        ref={btnRef}
        initial={{ opacity: 0, filter: 'blur(14px)' }}
        animate={controls}
        onClick={handleClick}
        whileTap={!isLogin ? { scale: 0.994 } : {}}
        className="relative w-full rounded-2xl border border-white/70 px-10 py-4 min-h-[54px] flex items-center justify-center overflow-hidden outline-none"
        style={{
          cursor: isLogin ? 'default' : 'pointer',
          background: 'rgba(255,255,255,0.55)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 8px 48px rgba(0,0,0,0.18), 0 2px 12px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.9)',
        }}
      >
        {ripples.map(rp => (
          <span key={rp.id} className="ripple-circle absolute rounded-full bg-[#3b82f6]/20 pointer-events-none"
            style={{ width: 80, height: 80, left: rp.x - 40, top: rp.y - 40 }} />
        ))}

        {/* Lupa permanente — canto direito em todas as fases */}
        <motion.div
          animate={{ opacity: exiting ? 0 : 1 }}
          transition={{ duration: 0.12, ease: 'easeIn' }}
          className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none"
        >
          <Search size={18} strokeWidth={1.5} className="text-stone-400" />
        </motion.div>

        {(loginPhase === 'user' || loginPhase === 'pass') && (
          <motion.div
            key={loginPhase}
            className="w-full pr-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <input
              ref={inputRef}
              type={loginPhase === 'pass' ? 'password' : 'text'}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={loginPhase === 'user' ? 'usuário' : 'senha'}
              className="bg-transparent outline-none border-none w-full text-left text-[15px] sm:text-base font-normal text-stone-700 placeholder-stone-300 caret-stone-400"
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}

        {loginPhase === 'profile' && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.28 }}
            className="text-[15px] sm:text-base font-normal text-stone-600"
          >
            meu perfil
          </motion.span>
        )}
      </motion.button>
    </div>
  );
}

// ── PasswordField ─────────────────────────────────────────────────────────────
function PasswordField({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
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

// ── BusinessCard ──────────────────────────────────────────────────────────────
function BusinessCard({ b, selected, onClick }: { b: Business; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left
        ${selected
          ? 'bg-[#3b82f6]/10 border-[#3b82f6]/50 text-white'
          : 'bg-white/[0.03] border-white/8 text-white/70 hover:bg-white/[0.06] hover:border-white/15 hover:text-white'}`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${selected ? 'bg-[#3b82f6]/20' : 'bg-white/5'}`}>
        <Building2 size={18} className={selected ? 'text-[#3b82f6]' : 'text-white/40'} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{b.nome}</p>
        <p className="text-xs text-white/35 mt-0.5">{b.cidade}, {b.estado} · {b.segmento.replace('_', ' ')}</p>
      </div>
      {selected && <Check size={16} className="text-[#3b82f6] flex-shrink-0" />}
    </button>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function LoginScreen({ onAuthenticated }: Props) {
  const [step, setStep] = useState<Step>('landing');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBiz, setSelectedBiz] = useState('');


  function resetForm() { setNome(''); setEmail(''); setPassword(''); setConfirmPassword(''); setError(''); }

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      let result;
      if (authMode === 'login') {
        result = await apiLogin(email, password);
      } else {
        if (!nome.trim()) throw new Error('Nome obrigatório');
        if (password !== confirmPassword) throw new Error('Senhas não coincidem');
        if (password.length < 8) throw new Error('Senha deve ter mínimo 8 caracteres');
        result = await apiRegister(nome, email, password);
      }
      setToken(result.access_token);
      const list = await apiBusinesses(result.access_token);
      setBusinesses(list);
      if (list.length > 0) setSelectedBiz(list[0].id);
      setStep('business');
    } catch (err: any) {
      setError(err.message ?? 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectBusiness() {
    if (!selectedBiz) return;
    setLoading(true);
    await apiSelectBusiness(token, selectedBiz);
    setLoading(false);
    setStep('consent');
  }

  async function handleConsent() {
    setLoading(true);
    await apiConsent(token, selectedBiz);
    setLoading(false);
    onAuthenticated(token, selectedBiz);
  }

  const [exiting,    setExiting]    = useState(false);
  const [exitY,      setExitY]      = useState(0);
  const [loginPhase, setLoginPhase] = useState<'idle'|'user'|'pass'|'profile'>('idle');

  function handleExitStart(yToTop: number) {
    if (exiting) return;
    setExitY(yToTop);
    setExiting(true);
    setTimeout(() => setLoginPhase('user'), 720);
  }

  async function handleFinalLogin() {
    let tkn = `demo.${Date.now()}`;
    try {
      const r = await apiLogin('admin@mcdonalds-os1.test', 'Teste123!');
      tkn = r.access_token;
    } catch {}
    await apiSelectBusiness(tkn, 'mcdo-paulista');
    onAuthenticated(tkn, 'mcdo-paulista');
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 16 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.32, ease: [0.4, 0, 0.2, 1] } },
    exit: { opacity: 0, scale: 0.95, y: 8, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-x-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#0C0A09' }}>

      {/* Plus Jakarta Sans */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

        @keyframes bg-breathe {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
        @keyframes ripple-out {
          0%   { transform: scale(0); opacity: 0.35; }
          100% { transform: scale(4); opacity: 0; }
        }
        .ripple-circle {
          animation: ripple-out 0.7s ease-out forwards;
        }

      `}</style>

      {/* Gradiente que respira */}
      <div className="absolute inset-0 pointer-events-none" style={{ animation: 'bg-breathe 6s ease-in-out infinite', backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255,255,255,0.05) 0%, transparent 70%)' }} />

      {/* Headline — estática, container desce por cima */}
      <div className="max-w-[760px] w-full mb-3 sm:mb-5 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: exiting ? 0 : 1 }}
            transition={exiting
              ? { duration: 0.20, ease: 'easeIn' }
              : { duration: 0.08, delay: 1.30 }}
            className="text-[clamp(1.8rem,3.5vw,3.2rem)] font-semibold tracking-tight text-[#F5F3F0] leading-[1.1]"
          >
            Um único lugar.
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: exiting ? 0 : 1 }}
            transition={exiting
              ? { duration: 0.20, ease: 'easeIn' }
              : { duration: 0.08, delay: 1.48 }}
            className="text-[clamp(1.4rem,3.2vw,3.2rem)] font-extralight tracking-tight text-white/35 leading-[1.1] mt-1"
          >
            Milhões de possibilidades.
          </motion.h2>
      </div>

      {/* Portal container — glassmorphism + parallax */}
      <RippleButton
        onTap={handleExitStart}
        exiting={exiting}
        exitY={exitY}
        loginPhase={loginPhase}
        onNextPhase={() => setLoginPhase(p => p === 'user' ? 'pass' : 'profile')}
        onProfileClick={handleFinalLogin}
      />

      {/* ── Overlay + Modal ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {step !== 'landing' && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-0 z-[80] bg-black/72 backdrop-blur-sm"
              onClick={() => { if (step === 'auth') { setStep('landing'); resetForm(); } }}
            />

            {/* Modal */}
            <motion.div
              key={`modal-${step}`}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-8 pointer-events-none"
            >
              <div className="w-full max-w-[420px] bg-[#0F0F0E] rounded-2xl border border-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.7)] overflow-hidden pointer-events-auto">

                {/* Modal top bar */}
                <div className="flex items-center justify-between px-6 pt-6 pb-0">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center">
                      <span className="text-white/80 text-[8px] font-bold leading-none">OS</span>
                    </div>
                    <span className="text-white/30 text-[11px] tracking-widest uppercase font-light">
                      {step === 'auth' ? 'Acesso' : step === 'business' ? 'Negócio' : 'Sincronização'}
                    </span>
                  </div>
                  {step === 'auth' && (
                    <button onClick={() => { setStep('landing'); resetForm(); }} className="text-white/25 hover:text-white/60 transition-colors duration-200 cursor-pointer">
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* ── AUTH STEP ── */}
                {step === 'auth' && (
                  <div className="px-6 pt-5 pb-6">
                    {/* Tab switcher */}
                    <div className="flex bg-white/[0.04] rounded-xl p-1 mb-6">
                      {(['login', 'register'] as const).map(m => (
                        <button
                          key={m}
                          onClick={() => { setAuthMode(m); resetForm(); }}
                          className={`flex-1 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 cursor-pointer
                            ${authMode === m ? 'bg-white/10 text-white' : 'text-white/35 hover:text-white/60'}`}
                        >
                          {m === 'login' ? 'Entrar' : 'Criar conta'}
                        </button>
                      ))}
                    </div>

                    <form onSubmit={handleAuth} className="flex flex-col gap-3.5">
                      <AnimatePresence mode="wait">
                        {authMode === 'register' && (
                          <motion.div key="nome" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }}>
                            <label className="block text-[11px] font-medium text-white/40 mb-1.5 tracking-wide uppercase">Nome</label>
                            <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome completo" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-white/25 transition-colors duration-200" />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div>
                        <label className="block text-[11px] font-medium text-white/40 mb-1.5 tracking-wide uppercase">E-mail</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-white/25 transition-colors duration-200" />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-white/40 mb-1.5 tracking-wide uppercase">Senha</label>
                        <PasswordField value={password} onChange={setPassword} placeholder="Mínimo 8 caracteres" />
                      </div>

                      <AnimatePresence mode="wait">
                        {authMode === 'register' && (
                          <motion.div key="confirm" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }}>
                            <label className="block text-[11px] font-medium text-white/40 mb-1.5 tracking-wide uppercase">Confirmar senha</label>
                            <PasswordField value={confirmPassword} onChange={setConfirmPassword} placeholder="Repita a senha" />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <AnimatePresence>
                        {error && (
                          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-400/90 text-xs px-1">
                            {error}
                          </motion.p>
                        )}
                      </AnimatePresence>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-1 h-11 bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-default rounded-xl text-white text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98]"
                      >
                        {loading
                          ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          : authMode === 'login' ? 'Entrar' : 'Criar conta'
                        }
                      </button>
                    </form>

                    <p className="text-center text-[11px] text-white/20 mt-5">
                      {authMode === 'login' ? 'Não tem conta?' : 'Já tem conta?'}{' '}
                      <button onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); resetForm(); }} className="text-white/50 hover:text-white/80 transition-colors duration-200 cursor-pointer underline underline-offset-2">
                        {authMode === 'login' ? 'Criar conta' : 'Entrar'}
                      </button>
                    </p>

                    {authMode === 'login' && (
                      <p className="text-center text-[10px] text-white/12 mt-3">
                        Demo: admin@mcdonalds-os1.test · Teste123!
                      </p>
                    )}
                  </div>
                )}

                {/* ── BUSINESS STEP ── */}
                {step === 'business' && (
                  <div className="px-6 pt-5 pb-6">
                    <h3 className="text-white font-semibold text-base mb-1">Selecione seu negócio</h3>
                    <p className="text-white/35 text-xs mb-5 leading-relaxed">Escolha qual operação você quer acessar agora. Você pode alternar depois.</p>
                    <div className="flex flex-col gap-2.5 mb-5">
                      {businesses.map(b => (
                        <BusinessCard key={b.id} b={b} selected={selectedBiz === b.id} onClick={() => setSelectedBiz(b.id)} />
                      ))}
                    </div>
                    <button
                      onClick={handleSelectBusiness}
                      disabled={!selectedBiz || loading}
                      className="w-full h-11 bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-40 disabled:cursor-default rounded-xl text-white text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                      {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Continuar <ChevronRight size={15} /></>}
                    </button>
                  </div>
                )}

                {/* ── CONSENT STEP ── */}
                {step === 'consent' && (
                  <div className="px-6 pt-5 pb-6">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/15 flex items-center justify-center flex-shrink-0">
                        <Shield size={18} className="text-[#3b82f6]" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-base leading-tight">Sincronização do navegador</h3>
                        <p className="text-white/35 text-xs mt-0.5">Consentimento necessário</p>
                      </div>
                    </div>

                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 mb-5 space-y-3">
                      {[
                        { icon: '●', text: 'O navegador sincronizado observa padrões de uso da sua operação — como sites visitados relacionados ao negócio.' },
                        { icon: '●', text: 'Esses dados ficam vinculados à sua empresa e são usados exclusivamente para personalizar as recomendações do sistema.' },
                        { icon: '●', text: 'Nenhuma informação pessoal ou de navegação privada é armazenada. Você pode revogar a qualquer momento.' },
                      ].map((item, i) => (
                        <div key={i} className="flex gap-3">
                          <span className="text-[#3b82f6] text-[8px] mt-1.5 flex-shrink-0">●</span>
                          <p className="text-white/50 text-[12px] leading-relaxed">{item.text}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => onAuthenticated(token, selectedBiz)}
                        className="flex-1 h-11 bg-white/5 hover:bg-white/8 border border-white/10 rounded-xl text-white/50 text-sm font-medium transition-all duration-200 cursor-pointer"
                      >
                        Agora não
                      </button>
                      <button
                        onClick={handleConsent}
                        disabled={loading}
                        className="flex-[2] h-11 bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-40 rounded-xl text-white text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98]"
                      >
                        {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Check size={15} /> Aceitar e entrar</>}
                      </button>
                    </div>

                    <p className="text-center text-[10px] text-white/18 mt-4 leading-relaxed">
                      Ao aceitar, você concorda com a política de sincronização v1.0
                    </p>
                  </div>
                )}

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
