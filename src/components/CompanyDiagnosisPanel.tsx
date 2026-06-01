import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, AlertTriangle, TrendingUp, Target, ShieldAlert, CheckCircle2, BarChart3, Send } from 'lucide-react';
import {
  runFullDiagnosis,
  type CompanyOntologyDiagnosis,
  type DomainDiagnosis,
  LEGAL_NOTICE,
} from '../lib/ontology-diagnostics';
import { dispatchOS1Event, OS1_EVENTS } from '../core/events/os1-events';

interface Props {
  open: boolean;
  onClose: () => void;
  role: string;
  activeSector: string;
  businessName?: string;
}

const STATUS_COLOR: Record<string, string> = {
  forte:        '#22c55e',
  presente:     '#84cc16',
  fraco:        '#f59e0b',
  ausente:      '#ef4444',
  risco:        '#dc2626',
  oportunidade: '#3b82f6',
  monitorado:   '#94a3b8',
};
const STATUS_LABEL: Record<string, string> = {
  forte: 'Forte',
  presente: 'Presente',
  fraco: 'Cobertura fraca',
  ausente: 'Indício de lacuna',
  risco: 'Risco potencial',
  oportunidade: 'Oportunidade',
  monitorado: 'Monitorado',
};

export function CompanyDiagnosisPanel({ open, onClose, role, activeSector, businessName }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diag, setDiag] = useState<CompanyOntologyDiagnosis | null>(null);
  const [tab, setTab] = useState<'resumo' | 'dominios' | 'cards'>('resumo');

  useEffect(() => {
    if (!open || diag) return;
    let alive = true;
    setLoading(true); setError(null);
    runFullDiagnosis({ role, activeSector, businessName })
      .then(d => { if (alive) { setDiag(d); setLoading(false); } })
      .catch(e => { if (alive) { setError(String(e?.message ?? e)); setLoading(false); } });
    return () => { alive = false; };
  }, [open, diag, role, activeSector, businessName]);

  // Esc fecha
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);

  function reanalyze() {
    setDiag(null); setError(null);
  }

  function sendCardsToFeed() {
    if (!diag) return;
    // Dispara evento que App.tsx ouve pra injetar cards no feed (canal compatível)
    dispatchOS1Event(OS1_EVENTS.ONTOLOGY_DIAGNOSIS_TO_FEED, diag.cards);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[210] bg-black/72 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-[220] flex items-center justify-center px-3 py-6 pointer-events-none"
          >
            <div
              className="w-full max-w-[720px] max-h-[88vh] bg-[#0F0F0E] rounded-2xl border border-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.7)] overflow-hidden pointer-events-auto flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <DiagHeader onClose={onClose} reanalyze={reanalyze} loading={loading} />
              <Tabs tab={tab} setTab={setTab} hasDiag={!!diag} />
              <div className="flex-1 min-h-0 overflow-y-auto">
                {loading && <LoadingState />}
                {error && <ErrorState error={error} retry={reanalyze} />}
                {!loading && !error && diag && (
                  <>
                    {tab === 'resumo' && <ResumoTab diag={diag} sendCardsToFeed={sendCardsToFeed} />}
                    {tab === 'dominios' && <DominiosTab diag={diag} />}
                    {tab === 'cards' && <CardsTab diag={diag} sendCardsToFeed={sendCardsToFeed} />}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Sub-componentes ──────────────────────────────────────────────────

function DiagHeader({ onClose, reanalyze, loading }: { onClose: () => void; reanalyze: () => void; loading: boolean }) {
  return (
    <div className="flex items-center justify-between px-6 pt-6 pb-3 border-b border-white/5">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-[rgba(184,145,58,0.16)] border border-[rgba(184,145,58,0.4)] flex items-center justify-center">
          <Sparkles size={14} className="text-[#fbbf24]" />
        </div>
        <div>
          <p className="text-white/30 text-[10px] tracking-widest uppercase font-light">OS¹ · Diagnóstico</p>
          <p className="text-white/85 text-sm font-semibold">Empresa vs Ontologia ideal</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={reanalyze}
          disabled={loading}
          className="text-[11px] text-white/55 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-40"
        >
          Reanalisar
        </button>
        <button onClick={onClose} className="text-white/40 hover:text-white p-1.5 rounded-lg hover:bg-white/5">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

function Tabs({ tab, setTab, hasDiag }: { tab: string; setTab: (t: any) => void; hasDiag: boolean }) {
  const items = [
    { id: 'resumo',   label: 'Resumo' },
    { id: 'dominios', label: 'Domínios' },
    { id: 'cards',    label: 'Cards sugeridos' },
  ];
  return (
    <div className="flex gap-1 px-4 pt-3 pb-2 border-b border-white/5">
      {items.map(it => (
        <button
          key={it.id}
          onClick={() => setTab(it.id)}
          disabled={!hasDiag}
          className={`px-3 py-1.5 rounded-lg text-[11.5px] font-medium transition-all duration-150 ${
            tab === it.id ? 'bg-white/8 text-white' : 'text-white/45 hover:text-white/75 hover:bg-white/3'
          } disabled:opacity-30`}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="px-8 py-16 flex flex-col items-center gap-3 text-white/40 text-xs">
      <div className="w-6 h-6 rounded-full border-2 border-white/10 border-t-white/60 animate-spin" />
      Carregando ontologia e analisando sinais…
    </div>
  );
}
function ErrorState({ error, retry }: { error: string; retry: () => void }) {
  return (
    <div className="px-6 py-12 text-center max-w-md mx-auto">
      <AlertTriangle size={28} className="text-amber-400 mx-auto mb-3" />
      <p className="text-sm font-semibold text-white/85 mb-2">Não foi possível gerar o diagnóstico</p>
      <p className="text-xs text-white/55 mb-4">{error}</p>
      <button onClick={retry} className="px-4 py-2 rounded-lg bg-white/8 hover:bg-white/14 border border-white/10 text-white text-xs font-medium">
        Tentar novamente
      </button>
    </div>
  );
}

// ─── Aba Resumo ───────────────────────────────────────────────────────
function ResumoTab({ diag, sendCardsToFeed }: { diag: CompanyOntologyDiagnosis; sendCardsToFeed: () => void }) {
  const score = diag.maturityScore;
  const scoreColor = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <div className="px-6 py-5 space-y-5">
      {/* Score + sumário */}
      <div className="flex items-center gap-5 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
        <div className="flex flex-col items-center justify-center w-20 flex-shrink-0">
          <div className="text-3xl font-bold tabular-nums" style={{ color: scoreColor }}>{score}</div>
          <div className="text-[10px] uppercase tracking-wider text-white/40">maturidade</div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] text-white/75 leading-relaxed">{diag.summary}</p>
          <p className="text-[10px] text-white/35 mt-2">
            Perfil: {diag.companyProfile.companyType} · {diag.companyProfile.segment} ·
            {diag.companyProfile.employeeCount} func · {diag.companyProfile.structure}
          </p>
        </div>
      </div>

      {/* 4 blocos rápidos */}
      <div className="grid grid-cols-2 gap-3">
        <Bloco
          icon={<CheckCircle2 size={13} className="text-emerald-400" />}
          title="Domínios fortes"
          items={diag.strongestDomains}
          empty="Nenhum domínio com cobertura alta detectada ainda."
        />
        <Bloco
          icon={<AlertTriangle size={13} className="text-red-400" />}
          title="Lacunas críticas"
          items={diag.criticalGaps}
          empty="Sem lacunas críticas para o perfil informado."
          warning
        />
        <Bloco
          icon={<TrendingUp size={13} className="text-amber-400" />}
          title="Oportunidades"
          items={diag.opportunities}
          empty="Sem oportunidades estratégicas evidentes neste momento."
        />
        <Bloco
          icon={<ShieldAlert size={13} className="text-rose-400" />}
          title="Riscos sensíveis"
          items={diag.domains.filter(d => d.requerValidacaoHumana && (d.status === 'risco' || d.status === 'ausente')).map(d => d.dominio).slice(0, 5)}
          empty="Sem riscos sensíveis ativos."
          warning
        />
      </div>

      {/* CTA cards */}
      <div className="bg-[rgba(184,145,58,0.06)] border border-[rgba(184,145,58,0.22)] rounded-xl p-4 flex items-center gap-3">
        <BarChart3 size={20} className="text-[#fbbf24] flex-shrink-0" />
        <div className="flex-1">
          <p className="text-[12.5px] text-white/85 font-semibold">{diag.cards.length} cards sugeridos pronto pra revisão</p>
          <p className="text-[10.5px] text-white/45 mt-0.5">Você revisa antes de injetar no feed. Áreas sensíveis exigem validação.</p>
        </div>
        <button
          onClick={sendCardsToFeed}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[rgba(184,145,58,0.18)] hover:bg-[rgba(184,145,58,0.32)] border border-[rgba(184,145,58,0.45)] text-white text-[11px] font-semibold transition-colors"
        >
          <Send size={11} />
          Enviar cards ao feed
        </button>
      </div>

      <LegalBox notice={diag.legalNotice} />
    </div>
  );
}

function Bloco({ icon, title, items, empty, warning }: { icon: React.ReactNode; title: string; items: string[]; empty: string; warning?: boolean }) {
  return (
    <div className={`p-3 rounded-xl border ${warning ? 'bg-[rgba(255,80,80,0.04)] border-[rgba(255,80,80,0.15)]' : 'bg-white/[0.02] border-white/5'}`}>
      <div className="flex items-center gap-1.5 mb-2">
        {icon}
        <span className="text-[10.5px] uppercase tracking-wider text-white/50 font-semibold">{title}</span>
      </div>
      {items.length === 0 && <p className="text-[11px] text-white/35 leading-snug">{empty}</p>}
      {items.length > 0 && (
        <ul className="space-y-1">
          {items.map(it => (
            <li key={it} className="text-[12px] text-white/82 leading-tight">{it}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function LegalBox({ notice }: { notice: string }) {
  return (
    <div className="text-[10.5px] text-white/40 leading-relaxed bg-white/[0.015] border border-white/5 rounded-lg p-3">
      <span className="text-white/55 font-semibold">Aviso · </span>{notice}
    </div>
  );
}

// ─── Aba Domínios ─────────────────────────────────────────────────────
function DominiosTab({ diag }: { diag: CompanyOntologyDiagnosis }) {
  const byArea = new Map<string, DomainDiagnosis[]>();
  for (const d of diag.domains) {
    if (!byArea.has(d.areaMacro)) byArea.set(d.areaMacro, []);
    byArea.get(d.areaMacro)!.push(d);
  }
  // Sort dentro de cada área por status crítico → bom
  const STATUS_ORDER = ['ausente','risco','fraco','oportunidade','monitorado','presente','forte'];
  for (const arr of byArea.values()) {
    arr.sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status));
  }
  const areasSorted = Array.from(byArea.keys()).sort();
  return (
    <div className="px-5 py-4 space-y-5">
      {areasSorted.map(area => (
        <div key={area}>
          <p className="text-[10.5px] uppercase tracking-wider text-white/45 font-semibold mb-2">{area}</p>
          <div className="space-y-1.5">
            {byArea.get(area)!.map(d => <DomainRow key={d.dominio} d={d} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

function DomainRow({ d }: { d: DomainDiagnosis }) {
  const color = STATUS_COLOR[d.status] || '#94a3b8';
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
      <div className="w-1.5 h-9 rounded-full flex-shrink-0" style={{ background: color }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[12.5px] text-white/85 font-medium">{d.dominio}</span>
          {d.isRequired && <span className="text-[9px] uppercase tracking-wider text-white/40">essencial</span>}
          {d.isStrategic && <span className="text-[9px] uppercase tracking-wider text-blue-400/70">estratégico</span>}
          {d.requerValidacaoHumana && <span className="text-[9px] uppercase tracking-wider text-rose-300/70">validação humana</span>}
        </div>
        <p className="text-[10.5px] text-white/45 mt-0.5">
          {STATUS_LABEL[d.status]} · cobertura {d.coverageScore}% · {d.evidenceCount} sinal(is)
          {d.missingTerms.length > 0 && <> · falta: {d.missingTerms.slice(0, 2).join(', ')}</>}
        </p>
      </div>
    </div>
  );
}

// ─── Aba Cards ────────────────────────────────────────────────────────
function CardsTab({ diag, sendCardsToFeed }: { diag: CompanyOntologyDiagnosis; sendCardsToFeed: () => void }) {
  if (diag.cards.length === 0) {
    return <div className="px-6 py-12 text-center text-white/40 text-xs">Nenhum card sugerido nesta análise.</div>;
  }
  return (
    <div className="px-5 py-4 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-[11px] text-white/55">{diag.cards.length} cards · revise antes de enviar ao feed</p>
        <button
          onClick={sendCardsToFeed}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(184,145,58,0.16)] hover:bg-[rgba(184,145,58,0.28)] border border-[rgba(184,145,58,0.4)] text-white text-[11px] font-semibold"
        >
          <Send size={11} />
          Enviar todos ao feed
        </button>
      </div>
      {diag.cards.map(c => {
        const colorMap: Record<string, string> = {
          lacuna: '#ef4444', risco: '#dc2626', fraco: '#f59e0b',
          oportunidade: '#3b82f6', acao: '#22c55e', analise: '#94a3b8', missao: '#a855f7',
        };
        const color = colorMap[c.tipo] || '#94a3b8';
        return (
          <div key={c.id} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/8">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[10px] uppercase tracking-wider text-white/45 font-semibold">{c.tipo}</span>
                  <span className="text-[10px] text-white/35">·</span>
                  <span className="text-[10px] text-white/55">{c.dominio}</span>
                  <span className="text-[10px] text-white/30">·</span>
                  <span className="text-[10px]" style={{ color }}>{c.urgencia}</span>
                  {c.requerValidacaoHumana && (
                    <span className="text-[9px] uppercase tracking-wider text-rose-300/80 ml-1">val. humana</span>
                  )}
                </div>
                <p className="text-[12.5px] text-white/90 font-medium leading-snug mb-1">{c.titulo}</p>
                <p className="text-[11px] text-white/55 leading-relaxed mb-2">{c.resumo}</p>
                <div className="flex items-start gap-1.5">
                  <Target size={11} className="text-[#fbbf24] flex-shrink-0 mt-0.5" />
                  <p className="text-[10.5px] text-white/70 leading-snug"><span className="text-white/45">Ação: </span>{c.acaoRecomendada}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <LegalBox notice={LEGAL_NOTICE} />
    </div>
  );
}
