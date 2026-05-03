import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation, useMotionValue, animate } from 'motion/react';
import { Eye, EyeOff, ChevronRight, Check, Shield, Building2, X } from 'lucide-react';
import { BrowserView } from './BrowserView';

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

// ── LupaIcon ──────────────────────────────────────────────────────────────────
function LupaIcon({ size, strokeWidth, style, className }: { size: number; strokeWidth?: number; style?: React.CSSProperties; className?: string }) {
  const sw = strokeWidth ?? 1.5;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} className={className}>
      <circle cx="10.5" cy="10.5" r="6.2" stroke="currentColor" strokeWidth={sw} />
      <line x1="15.3" y1="15.3" x2="21.2" y2="21.2" stroke="currentColor" strokeWidth={sw * 1.3} strokeLinecap="round" />
    </svg>
  );
}

// ── RippleButton ──────────────────────────────────────────────────────────────
function RippleButton({
  onTap, loginPhase, onNextPhase, onProfileClick, started, overlayDone,
}: {
  onTap: () => void;
  loginPhase: 'idle' | 'user' | 'pass';
  onNextPhase: () => void;
  onProfileClick: () => void;
  started: boolean;
  overlayDone: boolean;
}) {
  const FULL_TEXT    = 'Um lugar único. Milhões de possibilidades.';
  const MOBILE_TEXTS = ['Um lugar único.', 'Milhões de possibilidades.'] as const;
  const CURSOR_STYLE = { animation: 'cursor-blink 0.9s step-end infinite' };
  const TEXT_SHADOW  = { textShadow: '0 1px 4px rgba(0,0,0,0.38), 0 0 2px rgba(0,0,0,0.18)' };
  const LUPA_SHADOW  = 'drop-shadow(0 2px 6px rgba(28,23,18,0.5)) drop-shadow(0 0 2px rgba(28,23,18,0.22))';

  const [ripples,    setRipples]    = useState<{ id: number; x: number; y: number }[]>([]);
  const [inputVal,   setInputVal]   = useState('');
  const [typed,      setTyped]      = useState('');
  const [phaseTyped, setPhaseTyped] = useState('');
  const [kbHeight,   setKbHeight]   = useState(0);
  const [isMobile,   setIsMobile]   = useState(() => window.innerWidth < 640);
  const [introDone,         setIntroDone]         = useState(false);
  const [isSpinning,        setIsSpinning]        = useState(false);
  const [introLupaVisible,  setIntroLupaVisible]  = useState(true);
  const [mobileTypingPhase, setMobileTypingPhase] = useState<0|1>(0);
  const iRef            = useRef(0);
  const phaseRef        = useRef(0);
  const animCancelRef   = useRef<(() => void) | null>(null);
  const btnRef          = useRef<HTMLButtonElement>(null);
  const inputRef        = useRef<HTMLInputElement>(null);
  const controls        = useAnimation();
  const lupaControls    = useAnimation();    // intro lupa (spin Phase A)
  const idleLupaX       = useMotionValue(0); // idle lupa — posição x (0 = centro)
  const idleLupaOpacity = useMotionValue(0); // idle lupa — opacidade
  const idleLupaTargetX = useRef(0);         // destino x para shake
  const idleLupaDivRef  = useRef<HTMLDivElement>(null); // para toggle da classe de glow

  const currentTarget = isMobile ? MOBILE_TEXTS[mobileTypingPhase === 1 ? 1 : 0] : FULL_TEXT;
  const typingDone    = isMobile
    ? (mobileTypingPhase === 1 && typed.length >= MOBILE_TEXTS[1].length)
    : typed.length >= FULL_TEXT.length;

  // ── Phase B: só começa quando overlay SAIU completamente (onExitComplete) ──
  useEffect(() => {
    if (!started || !overlayDone) return;
    let alive = true;
    async function runPhaseB() {
      const w    = btnRef.current!.offsetWidth;
      const rPad = window.innerWidth < 640 ? 16 : 24;
      const lSz  = window.innerWidth < 640 ? 60 : 48;
      const tX   = w / 2 - rPad - lSz / 2;
      idleLupaTargetX.current = tX;

      setIntroLupaVisible(false);
      idleLupaOpacity.set(1);
      animate(idleLupaX, [0, tX], { duration: 2.6, ease: [0.16, 1, 0.3, 1] });

      const introTimer = setTimeout(() => { if (alive) setIntroDone(true); }, 2000);
      await controls.start({
        clipPath: 'inset(0% 0% 0% 0% round 20px)',
        transition: { duration: 2.6, ease: [0.16, 1, 0.3, 1] },
      });
      clearTimeout(introTimer);
      if (!alive) return;
      setIntroDone(true);
    }
    runPhaseB();
    return () => { alive = false; };
  }, [started, overlayDone]); // eslint-disable-line react-hooks/exhaustive-deps

  // Typewriter idle — desktop: texto completo; mobile: fase 0 ("Um lugar único.")
  useEffect(() => {
    if (!introDone) return;
    iRef.current = 0;
    const target = isMobile ? MOBILE_TEXTS[0] : FULL_TEXT;
    const t0 = setTimeout(() => {
      const iv = setInterval(() => {
        iRef.current += 1;
        setTyped(target.slice(0, iRef.current));
        if (iRef.current >= target.length) {
          clearInterval(iv);
          if (isMobile) {
            // pausa, depois apaga caractere a caractere, depois digita fase 1
            setTimeout(() => {
              const eraseIv = setInterval(() => {
                setTyped(prev => {
                  if (prev.length <= 1) {
                    clearInterval(eraseIv);
                    iRef.current = 0;
                    setTimeout(() => setMobileTypingPhase(1), 180);
                    return '';
                  }
                  return prev.slice(0, -1);
                });
              }, 32);
            }, 1100);
          }
        }
      }, 48);
    }, 30);
    return () => clearTimeout(t0);
  }, [introDone]); // eslint-disable-line react-hooks/exhaustive-deps

  // Typewriter mobile fase 1 ("Milhões de possibilidades.")
  useEffect(() => {
    if (mobileTypingPhase !== 1) return;
    const target = MOBILE_TEXTS[1];
    const iv = setInterval(() => {
      iRef.current += 1;
      setTyped(target.slice(0, iRef.current));
      if (iRef.current >= target.length) clearInterval(iv);
    }, 48);
    return () => clearInterval(iv);
  }, [mobileTypingPhase]); // eslint-disable-line react-hooks/exhaustive-deps

  // Shake da lupa idle: imediato ao terminar o typewriter, depois a cada 3s
  useEffect(() => {
    if (!typingDone || loginPhase !== 'idle') return;
    const tx = idleLupaTargetX.current;
    const shake = () => {
      animate(idleLupaX, [tx, tx-3, tx+3, tx-3, tx+3, tx-2, tx+2, tx-2, tx+2, tx-1, tx+1, tx], { duration: 0.6, ease: 'easeInOut' });
      const el = idleLupaDivRef.current;
      if (el) {
        el.classList.remove('lupa-shake-glow');
        void el.offsetWidth; // força reflow para reiniciar a animação CSS
        el.classList.add('lupa-shake-glow');
      }
    };
    shake();
    const iv = setInterval(shake, 3000);
    return () => clearInterval(iv);
  }, [typingDone, loginPhase]); // eslint-disable-line react-hooks/exhaustive-deps

  // Anima label e valor — digita caractere a caractere e trava no final
  const startPhaseAnim = useCallback((phase: 'user' | 'pass') => {
    animCancelRef.current?.();
    const label = phase === 'user' ? 'Usuário' : 'Senha';
    const real  = phase === 'user' ? '@mcdonalds' : 'Teste123!';
    phaseRef.current = 0;
    setPhaseTyped('');
    setInputVal('');
    let cancelled = false;
    animCancelRef.current = () => { cancelled = true; };
    const ok = () => !cancelled;

    // digita o label
    const t0 = setTimeout(() => {
      if (!ok()) return;
      const iv = setInterval(() => {
        if (!ok()) { clearInterval(iv); return; }
        phaseRef.current += 1;
        setPhaseTyped(label.slice(0, phaseRef.current));
        if (phaseRef.current >= label.length) clearInterval(iv);
      }, 55);
    }, 80);

    // digita o valor real
    const t1 = setTimeout(() => {
      if (!ok()) return;
      let i = 0;
      const iv = setInterval(() => {
        if (!ok()) { clearInterval(iv); return; }
        i++;
        setInputVal(real.slice(0, i));
        if (i >= real.length) clearInterval(iv);
      }, 55);
    }, 80 + label.length * 55 + 80);

    return () => { cancelled = true; clearTimeout(t0); clearTimeout(t1); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (loginPhase !== 'idle') return;
    const rect = btnRef.current!.getBoundingClientRect();
    const id = Date.now();
    setRipples(r => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 700);
    onTap();
    startPhaseAnim('user');
  }, [loginPhase, onTap, startPhaseAnim]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    if (!inputVal.trim()) return;
    if (loginPhase === 'user') { onNextPhase(); startPhaseAnim('pass'); return; }
    if (loginPhase === 'pass') { onProfileClick(); return; }
  }, [inputVal, loginPhase, onNextPhase, onProfileClick, startPhaseAnim]);

  const handleLupaClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!inputVal.trim()) return;
    if (loginPhase === 'user') { onNextPhase(); startPhaseAnim('pass'); return; }
    if (loginPhase === 'pass') { onProfileClick(); return; }
  }, [inputVal, loginPhase, onNextPhase, onProfileClick, startPhaseAnim]);

  useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);

  // Detecta abertura do teclado via visualViewport
  // Usa baseline fixo do mount — no iOS, window.innerHeight também encolhe com o teclado
  const baseVH = useRef(0);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    baseVH.current = vv.height;
    const handle = () => {
      const delta = baseVH.current - vv.height;
      setKbHeight(delta > 120 ? delta : 0);
    };
    vv.addEventListener('resize', handle);
    return () => vv.removeEventListener('resize', handle);
  }, []);

  const isLogin = loginPhase !== 'idle';
  const kbOpen  = kbHeight > 0;

  const lupaSize   = isMobile ? 60 : 48;
  const lupaStroke = isMobile ? 1.6 : 1.4;

  return (
    <motion.div
      className="w-full max-w-[340px] sm:max-w-[760px] z-20 relative"
      initial={{ opacity: 0 }}
      animate={{
        opacity: started ? 1 : 0,
        scale: started && kbOpen ? (loginPhase !== 'idle' ? 1 : 0.82) : 1,
        y: started && kbOpen ? (loginPhase !== 'idle' ? -(kbHeight * 0.46) : -(kbHeight * 0.38)) : 0,
      }}
      transition={{
        opacity: { duration: 0, delay: 0 }, // snap instantâneo — revelado pelo overlay
        scale:   { type: 'spring', damping: 30, stiffness: 320 },
        y:       { type: 'spring', damping: 30, stiffness: 320 },
      }}
    >

      <motion.button
        ref={btnRef}
        initial={{ clipPath: 'inset(calc(50% - 44px) calc(50% - 44px) round 44px)' }}
        animate={controls}
        onClick={handleClick}
        whileTap={!isLogin && introDone ? { scale: 0.994 } : {}}
        className="login-btn relative w-full rounded-[20px] sm:rounded-[20px] px-6 py-5 min-h-[84px] sm:min-h-[88px] flex items-center overflow-hidden outline-none"
        style={{
          cursor: isLogin ? 'default' : 'pointer',
          background: '#F5F1EA',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.5), 0 0 80px rgba(245,241,234,0.06), inset 0 0 24px rgba(28,23,18,0.07), inset 0 2px 8px rgba(28,23,18,0.05)',
          touchAction: 'manipulation',
          outline: 'none',
        }}
      >
        {ripples.map(rp => (
          <span key={rp.id} className="ripple-circle absolute rounded-full bg-[#3b82f6]/20 pointer-events-none"
            style={{ width: 80, height: 80, left: rp.x - 40, top: rp.y - 40 }} />
        ))}

        {/* Lupa intro — centrada, visível durante Phase A/B, crossfade para idle */}
        {loginPhase === 'idle' && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
            style={{ opacity: introLupaVisible ? 1 : 0 }}>
            <motion.div
              animate={lupaControls}
              style={isSpinning ? { animation: 'intro-lupa-glow 0.5s 0.6s ease-in-out infinite backwards' } : { filter: LUPA_SHADOW }}
            >
              <LupaIcon size={lupaSize} strokeWidth={lupaStroke} style={{ color: '#1C1712' }} />
            </motion.div>
          </div>
        )}

        {/* Lupa idle — parte do centro (mesma origem da intro), anima x para a direita */}
        {loginPhase === 'idle' && (
          <div ref={idleLupaDivRef} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
            <motion.div style={{ x: idleLupaX, opacity: idleLupaOpacity, filter: LUPA_SHADOW }}>
              <LupaIcon size={lupaSize} strokeWidth={lupaStroke} style={{ color: '#1C1712' }} />
            </motion.div>
          </div>
        )}

        {introDone && (<>

          {/* Idle — typewriter */}
          {loginPhase === 'idle' && (
            <div style={{ position: 'absolute', left: 24, right: isMobile ? 84 : 80, top: '50%', transform: 'translateY(-50%)', direction: 'ltr', textAlign: 'left', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <span style={{ color: '#1C1712', fontSize: isMobile ? '18px' : '22px', fontWeight: 400, fontFamily: "'Inter', sans-serif", ...TEXT_SHADOW }}>
                {typed}
              </span>
              {typed.length < currentTarget.length && (
                <span className="inline-block w-[1.5px] h-[1em] bg-[#B8913A] ml-[1px] align-middle" style={{ animation: 'cursor-blink 0.9s step-end infinite' }} />
              )}
            </div>
          )}

          {/* Fases user/pass — typewriter + input */}
          {loginPhase !== 'idle' && (() => {
            const target = loginPhase === 'user' ? 'Usuário' : 'Senha';
            const isDone = phaseTyped.length >= target.length;
            return (
              <div style={{ position: 'absolute', left: 24, right: isMobile ? 84 : 80, top: '50%', transform: 'translateY(-50%)', direction: 'ltr', textAlign: 'left', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {!isDone && (
                  <span style={{ color: '#1C1712', fontSize: isMobile ? '18px' : '22px', fontWeight: 400, fontFamily: "'Inter', sans-serif", ...TEXT_SHADOW }}>
                    {phaseTyped}
                    {phaseTyped.length > 0 && (
                      <span className="inline-block w-[1.5px] h-[1em] bg-[#B8913A] ml-[1px] align-middle" style={CURSOR_STYLE} />
                    )}
                  </span>
                )}
                {isDone && (
                  <input
                    ref={inputRef}
                    type="text"
                    autoComplete={loginPhase === 'pass' ? 'new-password' : 'username'}
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={target}
                    className="bg-transparent outline-none border-none w-full text-left"
                    style={{ color: '#1C1712', WebkitTextFillColor: '#1C1712', fontFamily: "'Inter', sans-serif", fontSize: isMobile ? '18px' : '22px', fontWeight: 400, opacity: 1, caretColor: '#B8913A', touchAction: 'manipulation', textShadow: TEXT_SHADOW.textShadow, ...(loginPhase === 'pass' ? { WebkitTextSecurity: 'disc' } as React.CSSProperties : {}) }}
                    onClick={e => e.stopPropagation()}
                  />
                )}
              </div>
            );
          })()}

          {/* Lupa fases login — clicável */}
          {loginPhase !== 'idle' && (
            <div
              className={`absolute ${isMobile ? 'right-4' : 'right-6'} top-1/2 -translate-y-1/2 z-10 cursor-pointer`}
              style={{ color: '#1C1712', filter: LUPA_SHADOW }}
              onClick={handleLupaClick}
            >
              <LupaIcon size={lupaSize} strokeWidth={lupaStroke} />
            </div>
          )}
        </>)}
      </motion.button>

    </motion.div>
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

  const [loginPhase, setLoginPhase] = useState<'idle'|'user'|'pass'>('idle');
  const [lightBrowser, setLightBrowser] = useState(false);
  const pendingAuth = useRef<{ tkn: string; nid: string } | null>(null);

  // ── GIF intro — 2 loops completos
  // Frame 124 = 4960ms por loop. Loop 2 frame 124 = 5040 + 4960 = 10000ms desde o início do GIF.
  const [gifStarted,  setGifStarted]  = useState(false);
  const [overlayDone, setOverlayDone] = useState(false);
  const gifTimerSet = useRef(false);
  const gifImgRef   = useRef<HTMLImageElement>(null);

  function startGifTimer() {
    if (gifTimerSet.current) return;
    gifTimerSet.current = true;
    setTimeout(() => setGifStarted(true), 10000);
  }

  // Força restart do GIF a partir do frame 0 — browser cacheado continua de onde parou
  useEffect(() => {
    const img = gifImgRef.current;
    if (!img) return;
    const src = img.src;
    img.src = '';
    img.src = src;
    // Após reset: se já estava completo (cacheado), dispara timer imediatamente
    if (img.complete) startGifTimer();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Congela o GIF no frame exato ao disparar — canvas captura o frame atual antes do primeiro paint
  useEffect(() => {
    if (!gifStarted || !gifImgRef.current) return;
    const img = gifImgRef.current;
    try {
      const canvas = document.createElement('canvas');
      canvas.width  = img.naturalWidth  || 1440;
      canvas.height = img.naturalHeight || 900;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        img.src = canvas.toDataURL('image/png');
      }
    } catch { /* CORS ou GIF já removido */ }
  }, [gifStarted]);

  function handleContainerTap() {
    if (loginPhase !== 'idle') return;
    setLoginPhase('user');
  }

  async function handleFinalLogin() {
    let tkn = `demo.${Date.now()}`;
    try {
      const r = await apiLogin('admin@mcdonalds-os1.test', 'Teste123!');
      tkn = r.access_token;
    } catch {}
    await apiSelectBusiness(tkn, 'mcdo-paulista');
    if (window.innerWidth < 640) {
      onAuthenticated(tkn, 'mcdo-paulista');
      return;
    }
    pendingAuth.current = { tkn, nid: 'mcdo-paulista' };
    setLightBrowser(true);
  }

  function handleBrowserSync() {
    setLightBrowser(false);
    const p = pendingAuth.current;
    if (p) onAuthenticated(p.tkn, p.nid);
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 16 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.32, ease: [0.4, 0, 0.2, 1] } },
    exit: { opacity: 0, scale: 0.95, y: 8, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } },
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center px-4 overflow-hidden" style={{ fontFamily: "system-ui, sans-serif", background: '#000000' }}>

      <style>{`
        @keyframes ripple-out {
          0%   { transform: scale(0); opacity: 0.35; }
          100% { transform: scale(4); opacity: 0; }
        }
        .ripple-circle { animation: ripple-out 0.7s ease-out forwards; }

        input::-webkit-credentials-auto-fill-button,
        input::-webkit-strong-password-auto-fill-button,
        input::-webkit-contacts-auto-fill-button {
          visibility: hidden !important; pointer-events: none !important; display: none !important;
        }
        input::-ms-reveal, input::-ms-clear { display: none !important; }

        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes intro-lupa-glow {
          0%, 100% { filter: drop-shadow(0 2px 6px rgba(28,23,18,0.5)) drop-shadow(0 0 2px rgba(28,23,18,0.22)); }
          50%      { filter: drop-shadow(0 2px 6px rgba(28,23,18,0.5)) drop-shadow(0 0 2px rgba(28,23,18,0.22)) drop-shadow(0 0 14px rgba(28,23,18,0.45)); }
        }
        @keyframes lupa-shake-glow-kf {
          0%        { filter: drop-shadow(0 2px 6px rgba(28,23,18,0.5)) drop-shadow(0 0 2px rgba(28,23,18,0.22)); }
          18%, 45%  { filter: drop-shadow(0 0 14px rgba(28,23,18,0.7)) drop-shadow(0 0 6px rgba(28,23,18,0.4)); }
          30%, 60%  { filter: drop-shadow(0 0 9px rgba(28,23,18,0.55)); }
          100%      { filter: drop-shadow(0 2px 6px rgba(28,23,18,0.5)) drop-shadow(0 0 2px rgba(28,23,18,0.22)); }
        }
        .lupa-shake-glow { animation: lupa-shake-glow-kf 0.6s ease-in-out forwards; }
        .login-btn:focus-visible {
          outline: 1.5px solid rgba(255,255,255,0.55) !important;
          outline-offset: 2px;
        }
      `}</style>

      {/* Grain overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.032, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundSize: '200px 200px' }} />
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 75% 65% at 50% 50%, transparent 38%, rgba(0,0,0,0.5) 100%)' }} />

      {/* Container — centrado, frases dentro */}
      <RippleButton
        onTap={handleContainerTap}
        loginPhase={loginPhase}
        onNextPhase={() => setLoginPhase('pass')}
        onProfileClick={handleFinalLogin}
        started={gifStarted}
        overlayDone={overlayDone}
      />

      {/* ── GIF Intro Overlay ─────────────────────────────────────────────── */}
      <AnimatePresence onExitComplete={() => setOverlayDone(true)}>
        {!gifStarted && (
          <motion.div
            key="gif-overlay"
            className="fixed inset-0 z-[200] bg-black"
            style={{ pointerEvents: 'auto' }}
            initial={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 0px)' }}
            exit={{
              clipPath: 'inset(calc(50% - 44px) calc(50% - 44px) round 44px)',
              opacity: 0,
            }}
            transition={{
              clipPath: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
              opacity:   { duration: 0.2,  delay: 0.3, ease: 'linear' },
            }}
          >
            <img
              ref={gifImgRef}
              src="/intro.gif"
              alt=""
              className="w-full h-full object-cover"
              draggable={false}
              onLoad={startGifTimer}
            />
            {/* Grain cinematográfico sobre o GIF */}
            <div className="absolute inset-0 pointer-events-none" style={{
              opacity: 0.035,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px',
            }} />
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Browser em modo claro — aparece após senha antes de entrar no feed */}
      <BrowserView
        open={lightBrowser}
        onClose={handleBrowserSync}
        onSync={handleBrowserSync}
      />
    </div>
  );
}
