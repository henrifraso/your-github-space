import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, ChevronRight, Check, Shield, Building2, X, ArrowRight } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
type Step = 'landing' | 'auth' | 'business' | 'consent';
type AuthMode = 'login' | 'register';

interface Business { id: string; nome: string; segmento: string; cidade: string; estado: string; }

export interface Props { onAuthenticated: (token: string, negocioId: string) => void; }

// ── Phrases ───────────────────────────────────────────────────────────────────
const PHRASES = [
  'Comece com apenas um toque.',
  'Entre na sua operação em um só lugar.',
  'O sistema aprende enquanto você trabalha.',
  'Navegue e deixe o sistema entender sua empresa.',
  'Tudo começa aqui.',
  'Sua empresa em um único fluxo.',
  'O centro da sua operação começa aqui.',
];

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

// ── RotatingPhrase ────────────────────────────────────────────────────────────
function RotatingPhrase() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIdx(i => (i + 1) % PHRASES.length); setVisible(true); }, 500);
    }, 3800);
    return () => clearInterval(t);
  }, []);
  return (
    <motion.p
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 6 }}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      className="text-stone-400 text-[15px] sm:text-base font-light tracking-wide select-none"
    >
      {PHRASES[idx]}
    </motion.p>
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

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 16 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.32, ease: [0.4, 0, 0.2, 1] } },
    exit: { opacity: 0, scale: 0.95, y: 8, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } },
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Subtle background texture */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(59,130,246,0.04) 0%, transparent 60%)' }} />

      {/* Logo mark */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="mb-10 flex items-center gap-2"
      >
        <div className="w-6 h-6 rounded-lg bg-[#0C0A09] flex items-center justify-center">
          <span className="text-white text-[10px] font-bold tracking-tighter leading-none">OS</span>
        </div>
        <span className="text-stone-300 text-xs font-light tracking-widest uppercase">Sistema Operacional</span>
      </motion.div>

      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08, ease: [0.4, 0, 0.2, 1] }}
        className="text-center mb-10"
      >
        <h1 className="text-[clamp(2.2rem,5vw,4rem)] font-semibold tracking-tight text-[#0C0A09] leading-[1.1]">
          Um único lugar.
        </h1>
        <h2 className="text-[clamp(2rem,4.5vw,3.6rem)] font-extralight tracking-tight text-stone-400 leading-[1.1] mt-1">
          Toda sua empresa.
        </h2>
      </motion.div>

      {/* Portal container */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.18, ease: [0.4, 0, 0.2, 1] }}
        onClick={() => setStep('auth')}
        whileHover={{ boxShadow: '0 8px 48px rgba(0,0,0,0.12)', y: -2 }}
        whileTap={{ scale: 0.993 }}
        transition2={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-[760px] bg-white rounded-3xl border border-stone-100 shadow-[0_4px_32px_rgba(0,0,0,0.06)] px-10 py-11 flex flex-col items-center gap-5 cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6]/40"
        style={{ transition: 'box-shadow 0.25s ease, transform 0.25s ease' }}
      >
        {/* Pulse dot */}
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3b82f6] opacity-40" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3b82f6]" />
          </span>
          <span className="text-[11px] font-medium tracking-widest uppercase text-stone-300">Sistema ativo</span>
        </div>

        <RotatingPhrase />

        <div className="flex items-center gap-2 text-stone-300 group-hover:text-stone-500 transition-colors duration-300">
          <span className="text-xs font-medium tracking-wide">Entrar na plataforma</span>
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-300" />
        </div>
      </motion.button>

      {/* Hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.4 }}
        className="mt-6 text-[11px] text-stone-300 tracking-wide"
      >
        Toque para acessar seu painel
      </motion.p>

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
