import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, TrendingUp, TrendingDown, Minus, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { apiFetch } from '../api';

// ── Tipos ─────────────────────────────────────────────────────────────────────

type CapStatus = 'unknown' | 'absent' | 'weak' | 'present' | 'strong';

interface DomainCap {
  capability_id: string;
  domain_id: string;
  subdomain_id: string;
  status: CapStatus;
  strength_score: number;
  evidence_count: number;
  last_detected_at: string | null;
  source_types: string;
  confidence: number;
}

interface DomainBlock {
  score: number;
  capabilities: DomainCap[];
}

interface SummaryData {
  detected: string[];
  unknown: string[];
  strongest_domains: string[];
  weakest_domains: string[];
  last_evidence: DomainCap[];
  by_domain: Record<string, DomainBlock>;
}

// ── Helpers visuais ───────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<CapStatus, { label: string; dot: string; bar: string }> = {
  unknown: { label: 'Desconhecido', dot: 'bg-neutral-300 dark:bg-neutral-600', bar: 'bg-neutral-200 dark:bg-[#3a3a3a]' },
  absent:  { label: 'Ausente',      dot: 'bg-red-400',                          bar: 'bg-red-400/30' },
  weak:    { label: 'Fraco',        dot: 'bg-amber-400',                        bar: 'bg-amber-400/50' },
  present: { label: 'Presente',     dot: 'bg-blue-400',                         bar: 'bg-blue-400/60' },
  strong:  { label: 'Forte',        dot: 'bg-emerald-400',                      bar: 'bg-emerald-400' },
};

const DOMAIN_LABELS: Record<string, string> = {
  marketing: 'Marketing', vendas: 'Vendas', atendimento: 'Atendimento',
  financeiro: 'Financeiro', operacao: 'Operação', tecnologia: 'Tecnologia',
  dados_indicadores: 'Dados & KPIs', distribuicao_canais: 'Canais',
  gestao_processos: 'Gestão', comunicacao_interna: 'Comunicação Interna',
  retencao_fidelizacao: 'Retenção', pessoas_rh: 'Pessoas & RH',
  juridico_compliance: 'Jurídico', marca_posicionamento: 'Marca',
  estoque: 'Estoque', fornecedores: 'Fornecedores', compras: 'Compras',
  reputacao: 'Reputação', estrategia: 'Estratégia', inovacao: 'Inovação',
};

function domainLabel(id: string): string {
  return DOMAIN_LABELS[id] || id.replace(/_/g, ' ');
}

function capLabel(id: string): string {
  const parts = id.split('.');
  return parts[parts.length - 1].replace(/_/g, ' ');
}

function sourcesFromJson(raw: string | null): string[] {
  try { return JSON.parse(raw || '[]'); } catch { return []; }
}

// ── Barra de força ────────────────────────────────────────────────────────────

function StrengthBar({ score, status }: { score: number; status: CapStatus }) {
  const pct = Math.min(100, Math.max(0, score));
  const cfg = STATUS_CONFIG[status];
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-neutral-100 dark:bg-[#3a3a3a] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className={`h-full rounded-full ${cfg.bar}`}
        />
      </div>
      <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 w-6 text-right">{Math.round(pct)}</span>
    </div>
  );
}

// ── Badge de status ───────────────────────────────────────────────────────────

function StatusDot({ status }: { status: CapStatus }) {
  return (
    <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${STATUS_CONFIG[status].dot}`} />
  );
}

// ── Card de domínio ───────────────────────────────────────────────────────────

function DomainCard({
  domainId,
  block,
  expanded,
  onToggle,
}: {
  domainId: string;
  block: DomainBlock;
  expanded: boolean;
  onToggle: () => void;
}) {
  const caps = block.capabilities;
  const detected = caps.filter(c => c.status !== 'unknown' && c.status !== 'absent');
  const score = Math.round(block.score);

  const scoreColor =
    score >= 70 ? 'text-emerald-500 dark:text-emerald-400' :
    score >= 40 ? 'text-blue-500 dark:text-blue-400' :
    score > 0   ? 'text-amber-500 dark:text-amber-400' :
                  'text-neutral-400 dark:text-neutral-500';

  return (
    <div className="bg-white dark:bg-[#282828] border border-neutral-100 dark:border-[#353535] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-neutral-50 dark:hover:bg-[#2e2e2e] transition-colors duration-150"
      >
        <div className="flex items-center gap-3">
          <span className={`text-base font-semibold tabular-nums ${scoreColor}`}>{score}</span>
          <span className="text-sm font-medium text-neutral-800 dark:text-neutral-100">{domainLabel(domainId)}</span>
          <span className="text-xs text-neutral-400 dark:text-neutral-500">
            {detected.length}/{caps.length}
          </span>
        </div>
        <ChevronRight
          size={14}
          strokeWidth={2}
          className={`text-neutral-300 dark:text-neutral-600 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-4 pb-3 border-t border-neutral-100 dark:border-[#353535] space-y-2.5 pt-3">
              {caps.map(cap => (
                <div key={cap.capability_id} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <StatusDot status={cap.status} />
                    <span className="text-xs text-neutral-600 dark:text-neutral-300 capitalize flex-1 truncate">
                      {capLabel(cap.capability_id)}
                    </span>
                    <span className={`text-[10px] font-medium ${STATUS_CONFIG[cap.status].dot.replace('bg-', 'text-').replace('/60', '').replace('/50', '').replace('/30', '')}`}>
                      {STATUS_CONFIG[cap.status].label}
                    </span>
                    {cap.evidence_count > 0 && (
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">×{cap.evidence_count}</span>
                    )}
                  </div>
                  {cap.strength_score > 0 && (
                    <StrengthBar score={cap.strength_score} status={cap.status} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Painel resumo ─────────────────────────────────────────────────────────────

function SummaryStrip({ data }: { data: SummaryData }) {
  const total = data.detected.length + data.unknown.length;
  const pct = total > 0 ? Math.round((data.detected.length / total) * 100) : 0;

  return (
    <div className="grid grid-cols-3 gap-2 mb-4">
      {[
        { value: data.detected.length, label: 'Detectadas', color: 'text-emerald-500 dark:text-emerald-400' },
        { value: data.unknown.length,  label: 'Desconhecidas', color: 'text-neutral-400 dark:text-neutral-500' },
        { value: `${pct}%`, label: 'Cobertura', color: 'text-blue-500 dark:text-blue-400' },
      ].map(item => (
        <div
          key={item.label}
          className="bg-white dark:bg-[#282828] border border-neutral-100 dark:border-[#353535] rounded-xl px-3 py-2.5 text-center shadow-[0_2px_6px_rgba(0,0,0,0.05)] dark:shadow-none"
        >
          <div className={`text-xl font-bold tabular-nums ${item.color}`}>{item.value}</div>
          <div className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

interface CapabilityMapProps {
  token: string | null;
  onClose?: () => void;
  inline?: boolean;
}

export default function CapabilityMap({ token, onClose, inline }: CapabilityMapProps) {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    apiFetch<SummaryData>('/api/capabilities/resumo')
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  const domainEntries = data
    ? Object.entries(data.by_domain).sort((a, b) => b[1].score - a[1].score)
    : [];

  const visible = showAll ? domainEntries : domainEntries.slice(0, 6);

  const toggle = (id: string) =>
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const inner = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-3 flex-shrink-0">
        <div>
          <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">Mapa de Capacidades</h2>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">Detectado via navegador sincronizado</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X size={15} strokeWidth={2} className="text-neutral-400 dark:text-neutral-500" />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-3">
        {loading && (
          <div className="flex items-center justify-center h-32 text-sm text-neutral-400 dark:text-neutral-500">
            carregando...
          </div>
        )}

        {!loading && !data && (
          <div className="flex items-center justify-center h-32 text-sm text-neutral-400 dark:text-neutral-500">
            Nenhum dado disponível.
          </div>
        )}

        {!loading && data && (
          <>
            <SummaryStrip data={data} />

            {/* Últimas evidências */}
            {data.last_evidence.length > 0 && (
              <div className="bg-white dark:bg-[#282828] border border-neutral-100 dark:border-[#353535] rounded-2xl px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-none mb-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">
                  Últimas evidências
                </p>
                {data.last_evidence.map((ev, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5 border-b border-neutral-50 dark:border-[#323232] last:border-0">
                    <StatusDot status={ev.status} />
                    <span className="flex-1 text-xs text-neutral-600 dark:text-neutral-300 truncate capitalize">
                      {capLabel(ev.capability_id)}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500">
                      {ev.last_detected_at ? new Date(ev.last_detected_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '—'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Domínios */}
            {visible.map(([domainId, block]) => (
              <DomainCard
                key={domainId}
                domainId={domainId}
                block={block}
                expanded={!!expanded[domainId]}
                onToggle={() => toggle(domainId)}
              />
            ))}

            {domainEntries.length > 6 && (
              <button
                onClick={() => setShowAll(p => !p)}
                className="w-full py-3 text-xs font-medium text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors cursor-pointer"
              >
                {showAll ? 'Mostrar menos' : `Ver mais ${domainEntries.length - 6} domínios`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );

  if (inline) return <div className="h-full">{inner}</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        className="w-full sm:max-w-md bg-[#f5f5f4] dark:bg-[#1e1e1e] rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {inner}
      </motion.div>
    </motion.div>
  );
}
