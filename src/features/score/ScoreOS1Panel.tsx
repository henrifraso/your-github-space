import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { apiFetch } from '../../api';
import { getContextUploads, resolveUploadOrgBu, type ContextUpload } from './contextUploads';
import { calcScoreInicial, nivelLabelCalculado } from './score-formula';
import {
  TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp,
  FileText, BarChart2, ShieldCheck, MapPin, Zap,
  ExternalLink, ArrowRight, RefreshCw, ClipboardList, X,
} from 'lucide-react';

interface Dimensao { id: string; label: string; score: number; icon: React.ElementType; descricao: string; }
interface Evidencia { id: number; tipo: string; fonte: string; confianca: number; impacto: number; titulo: string; descricao: string; }
interface Conteudo { nome: string; tipo: string; data: string; }
interface ScoreMock {
  companyName: string; status: string; periodo: string; scoreGeral: number;
  dimensoes: Dimensao[]; evolucao: { semana: string; score: number }[];
  evidencias: Evidencia[]; conteudos: Conteudo[]; cardsRelacionados: string[]; explicacao: string;
}

const OSCAR_MOCK: ScoreMock = {
  companyName: 'Oscar Calçados', status: 'Em monitoramento', periodo: 'Últimos 30 dias', scoreGeral: 72,
  dimensoes: [
    { id: 'mercado', label: 'Mercado', score: 81, icon: TrendingUp, descricao: 'Sinais positivos de demanda e tendência no setor de calçados.' },
    { id: 'concorrencia', label: 'Concorrência', score: 64, icon: BarChart2, descricao: 'Atenção por movimentação de concorrentes próximos no raio competitivo.' },
    { id: 'reputacao', label: 'Reputação', score: 76, icon: ShieldCheck, descricao: 'Avaliações estáveis com pontos de atenção em preço e atendimento.' },
    { id: 'presenca', label: 'Presença Local', score: 69, icon: MapPin, descricao: 'Visibilidade média na região. Abaixo da média do raio competitivo.' },
    { id: 'execucao', label: 'Ações', score: 58, icon: Zap, descricao: 'Poucos cards transformados em plano na Área de Trabalho.' },
  ],
  evolucao: [{ semana: 'Início', score: 61 }, { semana: 'Semana 2', score: 66 }, { semana: 'Semana 3', score: 70 }, { semana: 'Agora', score: 72 }],
  evidencias: [
    { id: 1, tipo: 'Concorrência', fonte: 'Google Maps', confianca: 0.70, impacto: -3, titulo: 'Concorrente no raio competitivo', descricao: 'Arezzo e Mr. Cat com avaliações acima de 4.4★ a menos de 2 km.' },
    { id: 2, tipo: 'Mercado', fonte: 'Valor Econômico', confianca: 0.82, impacto: 5, titulo: 'Crescimento do varejo de calçados em SP', descricao: 'Setor cresceu 8% no primeiro semestre. Demanda por marcas nacionais em alta.' },
    { id: 3, tipo: 'Reputação', fonte: 'Reclame Aqui', confianca: 0.85, impacto: -2, titulo: 'Menções a preço e atendimento', descricao: 'Varejistas com política de troca clara têm 40% mais satisfação.' },
    { id: 4, tipo: 'Ações', fonte: 'Área de Trabalho', confianca: 1.0, impacto: 4, titulo: 'Card transformado em plano', descricao: 'Plano de revisão de mix de produtos iniciado.' },
    { id: 5, tipo: 'Conteúdo', fonte: 'Empresa', confianca: 0.90, impacto: 2, titulo: 'Conteúdo enviado para análise', descricao: 'Relatório comercial e campanha compõem o contexto atual.' },
  ],
  conteudos: [
    { nome: 'Relatório comercial.pdf', tipo: 'PDF', data: '12/06/2026' },
    { nome: 'Campanha Dia dos Namorados.docx', tipo: 'DOCX', data: '08/06/2026' },
    { nome: 'Lista de unidades.csv', tipo: 'CSV', data: '01/06/2026' },
    { nome: 'Observação manual do gestor', tipo: 'Texto', data: '18/06/2026' },
  ],
  cardsRelacionados: [
    'Concorrentes em SP podem estar se reposicionando',
    'Reputação local exige atenção em atendimento e política de troca',
    'Presença digital abaixo da média do raio competitivo',
  ],
  explicacao: 'O score subiu porque o sistema já possui uma leitura inicial do ambiente externo. A precisão aumentará conforme a empresa enviar contexto interno, novos sinais forem coletados e ações forem executadas na Área de Trabalho.',
};

const NEUTRO_BASE: Omit<ScoreMock, 'companyName'> = {
  status: 'Leitura inicial', periodo: 'Últimos 30 dias', scoreGeral: 68,
  dimensoes: [
    { id: 'mercado', label: 'Mercado', score: 72, icon: TrendingUp, descricao: 'Sinais de mercado em coleta.' },
    { id: 'concorrencia', label: 'Concorrência', score: 61, icon: BarChart2, descricao: 'Análise de concorrência em andamento.' },
    { id: 'reputacao', label: 'Reputação', score: 70, icon: ShieldCheck, descricao: 'Dados de reputação em validação.' },
    { id: 'presenca', label: 'Presença Local', score: 65, icon: MapPin, descricao: 'Visibilidade local em análise.' },
    { id: 'execucao', label: 'Ações', score: 54, icon: Zap, descricao: 'Histórico de ações ainda em construção.' },
  ],
  evolucao: [{ semana: 'Início', score: 60 }, { semana: 'Semana 2', score: 63 }, { semana: 'Semana 3', score: 66 }, { semana: 'Agora', score: 68 }],
  evidencias: [
    { id: 1, tipo: 'Mercado', fonte: 'Sinal externo', confianca: 0.60, impacto: 2, titulo: 'Sinal externo em monitoramento', descricao: 'Fonte pública identificada e em validação.' },
    { id: 2, tipo: 'Reputação', fonte: 'Sinal externo', confianca: 0.55, impacto: 0, titulo: 'Fonte pública em validação', descricao: 'Dados ainda sendo processados pelo sistema.' },
    { id: 3, tipo: 'Ações', fonte: 'Área de Trabalho', confianca: 0.80, impacto: 1, titulo: 'Card em análise pelo sistema', descricao: 'Ação identificada, aguardando execução.' },
    { id: 4, tipo: 'Conteúdo', fonte: 'Empresa', confianca: 0.50, impacto: 0, titulo: 'A empresa ainda não enviou contexto interno para enriquecer a leitura.', descricao: 'Envie relatórios ou observações para enriquecer a leitura.' },
  ],
  conteudos: [],
  cardsRelacionados: ['Contexto da empresa em construção — envie dados para enriquecer a análise'],
  explicacao: 'Este score é uma leitura inicial. Ele ficará mais preciso conforme o OS¹ acumular sinais externos, evidências, conteúdos enviados e ações executadas.',
};

const NOME_POR_SECTOR: Record<string, string> = {
  mcdonalds: "McDonald's Brasil", nike: 'Oscar Calçados', nubank: 'Drogarias Pacheco',
  ifood: 'iFood', ambev: 'Ambev', magalu: 'Magazine Luiza',
  embraer: 'Embraer', tesla: 'Tesla', netflix: 'Netflix',
  spotify: 'Spotify', airbnb: 'Airbnb', uber: 'Uber',
  apple: 'Apple', amazon: 'Amazon', natura: 'Natura', os1: 'OS¹',
};

const OSCAR_SECTORS = new Set(['oscar-piloto-01', 'nike']);

function getMock(activeSector?: string): ScoreMock {
  if (activeSector && OSCAR_SECTORS.has(activeSector)) return OSCAR_MOCK;
  const nome = activeSector ? (NOME_POR_SECTOR[activeSector] ?? 'Empresa selecionada') : 'Empresa selecionada';
  return { ...NEUTRO_BASE, companyName: nome };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function nivelLabel(s: number) {
  return nivelLabelCalculado(s);
}

function ImpactoTag({ v }: { v: number }) {
  if (v > 0) return (
    <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
      <TrendingUp size={10} strokeWidth={2} />+{v}
    </span>
  );
  if (v < 0) return (
    <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-neutral-500 dark:text-neutral-500">
      <TrendingDown size={10} strokeWidth={2} />{v}
    </span>
  );
  return (
    <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-neutral-400 dark:text-neutral-600">
      <Minus size={10} />0
    </span>
  );
}

// ── Gráfico SVG — curva bezier + grid sutil + currentColor ───────────────────

function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return '';
  const t = 0.35;
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) * t;
    const cp1y = p1.y + (p2.y - p0.y) * t;
    const cp2x = p2.x - (p3.x - p1.x) * t;
    const cp2y = p2.y - (p3.y - p1.y) * t;
    d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return d;
}

function Grafico({ pts }: { pts: { semana: string; score: number }[] }) {
  const W = 320, H = 80, PX = 14, PY = 14, min = 50, max = 88;
  const coords = pts.map((e, i) => ({
    x: PX + (i / (pts.length - 1)) * (W - PX * 2),
    y: H - PY - ((e.score - min) / (max - min)) * (H - PY * 2),
    ...e,
  }));
  const linePath = smoothPath(coords);
  const lastC = coords[coords.length - 1];
  const firstC = coords[0];
  const areaPath = `${linePath} L${lastC.x},${H - PY} L${firstC.x},${H - PY} Z`;
  // grid lines horizontais a 25/50/75% do range visível
  const gridYs = [0.25, 0.5, 0.75].map(f => H - PY - f * (H - PY * 2));

  return (
    <div className="text-neutral-900 dark:text-white w-full -mx-1">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* grid lines */}
        {gridYs.map((gy, i) => (
          <line key={i} x1={PX} y1={gy} x2={W - PX} y2={gy}
            stroke="currentColor" strokeOpacity="0.06" strokeWidth="0.8" strokeDasharray="3 4" />
        ))}
        {/* área */}
        <path d={areaPath} fill="currentColor" opacity="0.05" />
        {/* linha */}
        <path d={linePath} fill="none" stroke="currentColor" strokeWidth="1.4"
          strokeOpacity="0.75" strokeLinecap="round" strokeLinejoin="round" />
        {/* pontos + labels */}
        {coords.map(p => (
          <g key={p.semana}>
            <circle cx={p.x} cy={p.y} r={2.5} fill="currentColor" opacity="0.85" />
            <text x={p.x} y={p.y - 7} textAnchor="middle" fontSize="8.5"
              fill="currentColor" fillOpacity="0.65" fontFamily="system-ui" fontWeight="600">{p.score}</text>
            <text x={p.x} y={H - 2} textAnchor="middle" fontSize="7"
              fill="currentColor" fillOpacity="0.3" fontFamily="system-ui">{p.semana}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ── Classes de container — igual ao feed ─────────────────────────────────────

const cardCls = 'bg-[#f0f2f4] dark:bg-[#323232] border-[0.5px] border-neutral-200 dark:border-[#414141] rounded-2xl shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)]';
const innerCls = 'bg-neutral-50 dark:bg-[#2a2a2a] border-[0.5px] border-neutral-200 dark:border-[#3a3a3a] rounded-xl shadow-[inset_0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_1px_4px_rgba(0,0,0,0.28),0_1px_2px_rgba(0,0,0,0.2)]';

function SecaoHeader({ icon: Icon, titulo, badge }: { icon: React.ElementType; titulo: string; badge?: string | number }) {
  return (
    <div className="flex items-center gap-2.5 mb-3">
      <Icon size={15} className="text-neutral-400" strokeWidth={1.8} />
      <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-100">{titulo}</h3>
      {badge !== undefined && (
        <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-[#353535] px-2 py-0.5 rounded-full">{badge}</span>
      )}
    </div>
  );
}

function InfoChip({ label, icon: Icon }: { label: string; icon: React.ElementType }) {
  return (
    <div className="flex flex-col items-center text-center gap-1.5 px-2 py-3 rounded-xl border-[0.5px] bg-[#f7f8f9] dark:bg-[#2f2f2f] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_2px_6px_-1px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(255,255,255,0.6)] dark:shadow-[0_2px_6px_-1px_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(255,255,255,0.04)] select-none">
      <Icon size={14} strokeWidth={1.6} className="text-neutral-400 dark:text-neutral-500 flex-shrink-0" />
      <span className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400 leading-tight">{label}</span>
    </div>
  );
}

function EvidenciaItem({ ev }: { ev: Evidencia }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-neutral-100 dark:border-[#3a3a3a] last:border-0">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-start gap-3 py-2.5 hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] rounded-xl px-2 -mx-2 transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-[#353535] px-1.5 py-0.5 rounded-full">{ev.tipo}</span>
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500">{ev.fonte}</span>
            <span className="ml-auto flex items-center gap-2">
              <ImpactoTag v={ev.impacto} />
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500">Confiança {Math.round(ev.confianca * 100)}%</span>
            </span>
          </div>
          <p className="text-[13px] font-medium text-neutral-700 dark:text-neutral-200">{ev.titulo}</p>
        </div>
        <span className="text-neutral-400 mt-0.5 flex-shrink-0">{open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}</span>
      </button>
      {open && <p className="text-[12px] text-neutral-500 dark:text-neutral-400 pb-2.5 px-2 leading-relaxed">{ev.descricao}</p>}
    </div>
  );
}

// ── Tipos públicos ────────────────────────────────────────────────────────────

export interface ScoreInsight { titulo: string; resumo?: string; dominio?: string; urgencia?: string; }

// ── Painel principal ──────────────────────────────────────────────────────────

interface ScoreOS1PanelProps { onClose?: () => void; activeSector?: string; role?: string; standalone?: boolean; insights?: ScoreInsight[]; }

export function ScoreOS1Panel({ onClose, activeSector, role: _role, standalone = true, insights }: ScoreOS1PanelProps) {
  const mock = getMock(activeSector);
  const [evidenciasReais, setEvidenciasReais] = useState<Evidencia[] | null>(null);

  useEffect(() => {
    // Sectores Oscar e OS¹ (Codify puro) usam mock — sem chamada de evidências
    if (!activeSector || OSCAR_SECTORS.has(activeSector) || activeSector === 'os1') return;
    const orgId = localStorage.getItem('os1_org_id');
    const buId  = localStorage.getItem('os1_bu_id');
    if (!orgId || !buId) return;
    apiFetch(`/api/codify/v0/evidences?organizationId=${encodeURIComponent(orgId)}&unitId=${encodeURIComponent(buId)}&limit=5`)
      .then((res: any) => {
        const items = res?.data?.items;
        if (!Array.isArray(items) || items.length === 0) return;
        setEvidenciasReais(items.map((ev: any, i: number) => ({
          id: i + 1,
          titulo: ev.title ?? ev.sourceTitle ?? 'Evidência identificada',
          descricao: ev.summary ?? '',
          confianca: typeof ev.confidence === 'number' ? ev.confidence : 0.5,
          tipo: ev.evidenceType ?? 'Sinal externo',
          fonte: ev.sourceTitle ?? ev.source ?? ev.url ?? 'Fonte pública',
          impacto: 0,
        })));
      })
      .catch(() => {});
  }, [activeSector]);

  const evidencias = evidenciasReais ?? mock.evidencias;

  const [uploads, setUploads] = useState<ContextUpload[]>([]);
  useEffect(() => {
    const rawOrgId = localStorage.getItem('os1_org_id') ?? undefined;
    const rawBuId  = localStorage.getItem('os1_bu_id')  ?? undefined;
    const { orgId, buId } = resolveUploadOrgBu(activeSector, rawOrgId, rawBuId);
    setUploads(getContextUploads(orgId, buId, activeSector));
  }, [activeSector]);

  const mappedUploads = uploads.map(u => ({
    nome: u.name,
    tipo: u.extension ? u.extension.toUpperCase() : 'Arquivo',
    data: new Date(u.uploadedAt).toLocaleDateString('pt-BR'),
  }));
  const conteudosToShow: { nome: string; tipo: string; data: string }[] =
    (activeSector && OSCAR_SECTORS.has(activeSector))
      ? [...mock.conteudos, ...mappedUploads]
      : mappedUploads;

  // Score calculado apenas quando `insights` prop está presente (perfis com codifyScope).
  // Codify puro (os1) passa insights=undefined → scoreGeral permanece do mock.
  const scoreGeral = useMemo(() => {
    if (!insights) return mock.scoreGeral;
    return calcScoreInicial(insights, uploads.length);
  }, [insights, uploads.length, mock.scoreGeral]);

  return (
    <div className="flex flex-col h-full bg-[#dcdfe2] dark:bg-[#181818] text-neutral-800 dark:text-neutral-200 overflow-hidden">

      {/* Barra própria — só quando standalone (fora do BrowserView) */}
      {standalone && (
        <div className="flex items-center gap-2 px-4 pt-10 pb-3 bg-[#f0f2f4] dark:bg-[#323232] border-b border-neutral-200 dark:border-[#414141] shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] flex-shrink-0">
          <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">OS¹</span>
          <span className="text-neutral-300 dark:text-neutral-600">/</span>
          <span className="text-[12px] font-medium text-neutral-600 dark:text-neutral-300">Score da Empresa</span>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-600 bg-neutral-100 dark:bg-[#2a2a2a] px-2 py-0.5 rounded-full ml-auto">{evidenciasReais ? 'evidências reais' : 'mockado'}</span>
          {onClose && (
            <button onClick={onClose} className="ml-1 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-[#2a2a2a] transition-colors">
              <X size={13} />
            </button>
          )}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4 [&::-webkit-scrollbar]:hidden">

        {/* Cabeçalho — Ajustes da Análise */}
        <div className={`${cardCls} p-4 flex flex-col gap-3`}>

          {/* Linha 1: nome + badge de status */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-0.5">Análise OS¹</p>
              <h1 className="text-[17px] font-bold text-neutral-900 dark:text-white leading-tight truncate">{mock.companyName}</h1>
            </div>
            <span className="flex-shrink-0 mt-0.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-neutral-300 dark:border-[#484848] text-neutral-500 dark:text-neutral-400 bg-transparent whitespace-nowrap">
              {mock.status}
            </span>
          </div>

          {/* Linha 2: círculo monocromático + leitura */}
          <div className="flex items-center gap-4">
            {/* Círculo */}
            <div className="relative w-[88px] h-[88px] flex-shrink-0">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 88 88">
                <circle cx="44" cy="44" r="38" fill="none"
                  stroke="currentColor" strokeWidth="4"
                  className="text-neutral-200 dark:text-[#383838]" />
                <motion.circle cx="44" cy="44" r="38" fill="none"
                  stroke="currentColor" strokeWidth="4"
                  pathLength={100} strokeDasharray="100"
                  initial={{ strokeDashoffset: 100 }}
                  animate={{ strokeDashoffset: 100 - scoreGeral }}
                  transition={{ duration: 2.4, ease: 'easeOut' }}
                  className="text-neutral-700 dark:text-neutral-200" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[24px] font-black tabular-nums text-neutral-900 dark:text-white leading-none">{scoreGeral}</span>
                <span className="text-[8px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide">/100</span>
              </div>
            </div>

            {/* Leitura textual */}
            <div className="flex-1 min-w-0 space-y-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">Leitura atual</p>
                <p className="text-[15px] font-bold text-neutral-800 dark:text-neutral-100 leading-tight">{nivelLabel(scoreGeral)}</p>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2">{mock.periodo} · {mock.explicacao}</p>
            </div>
          </div>

          {/* Linha 3: contadores como chips de borda */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {([
              { label: 'Dimensões',  value: mock.dimensoes.length         },
              { label: 'Evidências', value: evidencias.length             },
              { label: 'Insights',   value: mock.cardsRelacionados.length },
              { label: 'Conteúdos', value: conteudosToShow.length         },
            ] as { label: string; value: number }[]).map(s => (
              <div key={s.label}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-neutral-200 dark:border-[#414141] bg-transparent">
                <strong className="text-[12px] tabular-nums text-neutral-700 dark:text-neutral-200">{s.value}</strong>
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500">{s.label}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Evolução */}
        <div className={`${cardCls} p-4`}>
          <SecaoHeader icon={TrendingUp} titulo="Evolução do Score" />

          <div className="flex items-center gap-4">
            {/* Ring — padrão CircleProgress monochromatic, sem cor semântica */}
            <div className="relative w-32 h-32 flex-shrink-0">
              <div className="absolute inset-0 rounded-2xl shadow-[0_6px_16px_-3px_rgba(0,0,0,0.22),0_2px_4px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_20px_-3px_rgba(0,0,0,0.6),0_2px_6px_rgba(0,0,0,0.4)]" />
              <div className="absolute inset-0 rounded-2xl border-[0.5px] border-neutral-200 dark:border-[#4a4a4a] z-[2] pointer-events-none" />
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 128 128">
                {/* track */}
                <rect x="8" y="8" width="112" height="112" rx="28" ry="28" fill="none"
                  stroke="currentColor" strokeWidth="5"
                  className="text-neutral-200 dark:text-[#383838]" />
                {/* progresso animado */}
                <motion.rect x="8" y="8" width="112" height="112" rx="28" ry="28" fill="none"
                  stroke="currentColor" strokeWidth="5"
                  pathLength={100} strokeDasharray="100"
                  initial={{ strokeDashoffset: 100 }}
                  animate={{ strokeDashoffset: 100 - scoreGeral }}
                  transition={{ duration: 2.8, ease: 'easeOut' }}
                  className="text-neutral-800 dark:text-neutral-100" />
              </svg>
              {/* Miolo — círculo inner com Bio shadow */}
              <div className="absolute inset-[20%] rounded-full bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_4px_10px_-1px_rgba(0,0,0,0.22),0_1px_3px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.6)] dark:shadow-[0_4px_10px_-1px_rgba(0,0,0,0.55),0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.04)] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-[22px] font-black tabular-nums text-neutral-900 dark:text-white leading-none">{scoreGeral}</div>
                  <div className="text-[9px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide">/100</div>
                </div>
              </div>
            </div>

            {/* Semanas — barra por semana com número, em container inner */}
            <div className="flex-1 flex flex-col gap-2.5 bg-neutral-50 dark:bg-[#252525] border-[0.5px] border-neutral-200 dark:border-[#3a3a3a] rounded-xl p-3 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_1px_4px_rgba(0,0,0,0.28),0_1px_2px_rgba(0,0,0,0.2)]">
              {mock.evolucao.map(pt => (
                <div key={pt.semana} className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 w-14 flex-shrink-0">{pt.semana}</span>
                  <div className="flex-1 h-[5px] bg-neutral-100 dark:bg-[#3a3a3a] rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-neutral-800 dark:bg-neutral-100 transition-all duration-700"
                      style={{ width: `${pt.score}%`, opacity: 0.3 + (pt.score / 100) * 0.6 }} />
                  </div>
                  <span className="text-[13px] font-bold tabular-nums text-neutral-800 dark:text-neutral-100 w-6 text-right flex-shrink-0">{pt.score}</span>
                </div>
              ))}
              {/* Delta total */}
              {(() => {
                const d = mock.evolucao[mock.evolucao.length - 1].score - mock.evolucao[0].score;
                return (
                  <div className="pt-2 border-t border-neutral-100 dark:border-[#3a3a3a] flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide">Variação</span>
                    <span className="text-[14px] font-black tabular-nums text-neutral-900 dark:text-white">{d >= 0 ? `+${d}` : d}</span>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Dimensões */}
        <div className={`${cardCls} p-4`}>
          <SecaoHeader icon={BarChart2} titulo="Dimensões" />
          <div className="bg-neutral-50 dark:bg-[#252525] border-[0.5px] border-neutral-200 dark:border-[#3a3a3a] rounded-xl p-2.5 space-y-2 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_1px_4px_rgba(0,0,0,0.28),0_1px_2px_rgba(0,0,0,0.2)]">
            {mock.dimensoes.map(dim => {
              const Icon = dim.icon;
              return (
                <div key={dim.id} className="inline-flex items-center gap-2.5 pl-1 pr-3 py-1 w-full bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] rounded-xl shadow-[0_4px_10px_-1px_rgba(0,0,0,0.12),0_1px_3px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(255,255,255,0.7)] dark:shadow-[0_4px_10px_-1px_rgba(0,0,0,0.4),0_1px_3px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(255,255,255,0.04)]">
                  {/* círculo interno */}
                  <div className="w-8 h-8 rounded-full flex-shrink-0 bg-[#f0f2f4] dark:bg-[#2a2a2a] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_3px_8px_-1px_rgba(0,0,0,0.18),inset_0_1px_2px_rgba(255,255,255,0.6)] dark:shadow-[0_3px_8px_-1px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.04)] flex items-center justify-center">
                    <Icon size={13} className="text-neutral-500 dark:text-neutral-400" strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-medium text-neutral-700 dark:text-neutral-200 flex-1 truncate">{dim.label}</span>
                      <span className="text-[13px] font-bold tabular-nums text-neutral-800 dark:text-neutral-100">{dim.score}</span>
                    </div>
                    <div className="h-[3px] bg-neutral-100 dark:bg-[#3a3a3a] rounded-full overflow-hidden mt-1.5">
                      <div className="h-full rounded-full bg-neutral-800 dark:bg-neutral-100 transition-all duration-700"
                        style={{ width: `${dim.score}%`, opacity: 0.35 + (dim.score / 100) * 0.55 }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Evidências */}
        <div className={`${cardCls} p-4`}>
          <SecaoHeader icon={ShieldCheck} titulo="Evidências" badge={evidencias.length} />
          <div className="bg-neutral-50 dark:bg-[#252525] border-[0.5px] border-neutral-200 dark:border-[#3a3a3a] rounded-xl px-3 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_1px_4px_rgba(0,0,0,0.28),0_1px_2px_rgba(0,0,0,0.2)]">
            {evidencias.map(ev => <EvidenciaItem key={ev.id} ev={ev} />)}
          </div>
        </div>

        {/* Contexto enviado */}
        <div className={`${cardCls} p-4`}>
          <SecaoHeader icon={FileText} titulo="Contexto enviado" />
          <div className="bg-neutral-50 dark:bg-[#252525] border-[0.5px] border-neutral-200 dark:border-[#3a3a3a] rounded-xl p-1.5 space-y-1 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_1px_4px_rgba(0,0,0,0.28),0_1px_2px_rgba(0,0,0,0.2)]">
            {conteudosToShow.length === 0
              ? <p className="px-3 py-2.5 text-[12px] text-neutral-400 dark:text-neutral-500">Nenhum conteúdo enviado ainda. Use o botão de upload para registrar contexto da empresa.</p>
              : conteudosToShow.map((c, i) => (
                <div key={`${c.nome}-${i}`} className="flex items-center gap-3 px-3 py-2 bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] rounded-lg shadow-[0_2px_6px_-1px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_6px_-1px_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.2)]">
                  <FileText size={12} className="text-neutral-400 flex-shrink-0" strokeWidth={1.8} />
                  <span className="text-[12px] text-neutral-700 dark:text-neutral-300 flex-1 truncate">{c.nome}</span>
                  <span className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-[#353535] px-1.5 py-0.5 rounded">{c.tipo}</span>
                  <span className="text-[10px] text-neutral-400 dark:text-neutral-500 flex-shrink-0">{c.data}</span>
                </div>
              ))
            }
          </div>
        </div>

        {/* Cards relacionados */}
        {(() => {
          const realInsights = insights && insights.length > 0 ? insights.slice(0, 5) : null;
          const badge = realInsights ? realInsights.length : mock.cardsRelacionados.length;
          return (
            <div className={`${cardCls} p-4`}>
              <SecaoHeader icon={ClipboardList} titulo="Insights relacionados" badge={badge} />
              <div className="bg-neutral-50 dark:bg-[#252525] border-[0.5px] border-neutral-200 dark:border-[#3a3a3a] rounded-xl p-1.5 space-y-1 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_1px_4px_rgba(0,0,0,0.28),0_1px_2px_rgba(0,0,0,0.2)]">
                {realInsights
                  ? realInsights.map((ins, i) => (
                      <div key={i} className="flex items-start gap-3 px-3 py-2.5 bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] rounded-lg shadow-[0_2px_6px_-1px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_6px_-1px_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.2)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 flex-shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] text-neutral-700 dark:text-neutral-300 leading-snug">{ins.titulo}</p>
                          {ins.dominio && <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5 uppercase tracking-wide">{ins.dominio}</p>}
                        </div>
                        <ArrowRight size={11} className="text-neutral-400 flex-shrink-0 mt-1" />
                      </div>
                    ))
                  : mock.cardsRelacionados.map((c, i) => (
                      <div key={i} className="flex items-center gap-3 px-3 py-2.5 bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] rounded-lg shadow-[0_2px_6px_-1px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_6px_-1px_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.2)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 flex-shrink-0" />
                        <span className="text-[12px] text-neutral-700 dark:text-neutral-300 flex-1 leading-snug">{c}</span>
                        <ArrowRight size={11} className="text-neutral-400 flex-shrink-0" />
                      </div>
                    ))}
              </div>
            </div>
          );
        })()}

        {/* Explicação */}
        <div className={`${cardCls} p-4`}>
          <SecaoHeader icon={Zap} titulo="Por que o score mudou?" />
          <div className="bg-neutral-50 dark:bg-[#252525] border-[0.5px] border-neutral-200 dark:border-[#3a3a3a] rounded-xl p-3 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_1px_4px_rgba(0,0,0,0.28),0_1px_2px_rgba(0,0,0,0.2)]">
            <p className="text-[12px] text-neutral-600 dark:text-neutral-400 leading-relaxed">{mock.explicacao}</p>
          </div>
        </div>

        {/* Sobre esta leitura */}
        <div className={`${cardCls} p-4`}>
          <SecaoHeader icon={ShieldCheck} titulo="Sobre esta leitura" />
          <div className="bg-neutral-50 dark:bg-[#252525] border-[0.5px] border-neutral-200 dark:border-[#3a3a3a] rounded-xl p-2 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_1px_4px_rgba(0,0,0,0.28),0_1px_2px_rgba(0,0,0,0.2)] grid grid-cols-4 gap-1.5">
            <InfoChip label="Gerado automaticamente pelo OS¹" icon={Zap} />
            <InfoChip label="Baseado em sinais externos e conteúdo enviado" icon={FileText} />
            <InfoChip label="Atualizado conforme novos sinais forem coletados" icon={RefreshCw} />
            <InfoChip label="Leitura exclusiva para o perfil selecionado" icon={ShieldCheck} />
          </div>
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}
