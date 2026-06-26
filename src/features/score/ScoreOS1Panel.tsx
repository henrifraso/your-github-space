import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import { apiFetch } from '../../api';
import { getContextUploads, resolveUploadOrgBu, type ContextUpload } from './contextUploads';
import { calcScoreInicial, nivelLabelCalculado } from './score-formula';
import {
  TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp,
  FileText, BarChart2, ShieldCheck, MapPin, Zap,
  ExternalLink, ArrowRight, RefreshCw, ClipboardList, X, Globe,
} from 'lucide-react';
import { loadNavigatedSources, type NavigatedSource } from '../../features/browser/navigated-sources';

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
  'cerveja-imperio': 'Cerveja Império', 'cerveja-imperio-distribuidora-01': 'Distribuidora Império',
  ifood: 'iFood', ambev: 'Ambev', magalu: 'Magazine Luiza',
  embraer: 'Embraer', tesla: 'Tesla', netflix: 'Netflix',
  spotify: 'Spotify', airbnb: 'Airbnb', uber: 'Uber',
  apple: 'Apple', amazon: 'Amazon', natura: 'Natura', os1: 'OS¹',
};

const OSCAR_SECTORS = new Set(['oscar-piloto-01', 'nike']);

function getMock(activeSector?: string): ScoreMock {
  if (activeSector === 'nike') return OSCAR_MOCK;
  if (activeSector === 'oscar-piloto-01') return { ...OSCAR_MOCK, companyName: 'Oscar Loja 1' };
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

  const [navigatedSources, setNavigatedSources] = useState<NavigatedSource[]>([]);
  const refreshNavigatedSources = useCallback(() => {
    if (activeSector) setNavigatedSources(loadNavigatedSources(activeSector));
  }, [activeSector]);
  useEffect(() => { refreshNavigatedSources(); }, [refreshNavigatedSources]);

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
          <span className="text-[12px] font-medium text-neutral-600 dark:text-neutral-300">Score OS¹</span>
          {onClose && (
            <button onClick={onClose} className="ml-auto p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-[#2a2a2a] transition-colors">
              <X size={13} />
            </button>
          )}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4 [&::-webkit-scrollbar]:hidden">

        {/* Intro do Score OS¹ */}
        <div className={`${cardCls} p-4 flex flex-col gap-3`}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-0.5">Score OS¹</p>
              <h1 className="text-[17px] font-bold text-neutral-900 dark:text-white leading-tight truncate">{mock.companyName}</h1>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1 leading-relaxed">
                Painel de reputação, fontes e sinais da empresa nos últimos 30 dias.
              </p>
            </div>
            <span className="flex-shrink-0 mt-0.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-neutral-300 dark:border-[#484848] text-neutral-500 dark:text-neutral-400 bg-transparent whitespace-nowrap">
              {mock.status}
            </span>
          </div>

          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed border-t border-neutral-200 dark:border-[#3a3a3a] pt-3">
            O Score OS¹ organiza notas, fontes, evidências e sinais públicos ou enviados para mostrar o estado inicial da leitura da empresa. Os sinais mais relevantes podem aparecer no Feed em forma de cards de inteligência.
          </p>

          <div className="flex items-center gap-1.5 flex-wrap">
            {([
              { label: 'Sinais',    value: evidencias.length         },
              { label: 'Fontes',    value: mock.dimensoes.length     },
              { label: 'Contextos', value: conteudosToShow.length    },
              { label: 'Navegadas', value: navigatedSources.length   },
            ] as { label: string; value: number }[]).map(s => (
              <div key={s.label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-neutral-200 dark:border-[#414141] bg-transparent">
                <strong className="text-[12px] tabular-nums text-neutral-700 dark:text-neutral-200">{s.value}</strong>
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Número principal do Score */}
        <div className={`${cardCls} overflow-hidden`}>
          <div className="px-4 pt-5 pb-4 flex flex-col gap-5">
            {/* Score central */}
            <div className="flex flex-col items-center gap-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Score atual</p>
              <div className="flex items-end gap-2">
                <motion.span
                  className="text-[80px] font-black tabular-nums leading-none text-neutral-900 dark:text-white"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  {scoreGeral}
                </motion.span>
                <span className="text-[18px] font-semibold text-neutral-300 dark:text-neutral-600 pb-3 tabular-nums">/100</span>
              </div>
              <p className="text-[13px] font-semibold text-neutral-600 dark:text-neutral-300">{nivelLabel(scoreGeral)}</p>
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500">{mock.periodo} · leitura inicial</p>
            </div>

            {/* Barra de progresso */}
            <div className="h-[3px] bg-neutral-100 dark:bg-[#2a2a2a] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-neutral-600 dark:bg-neutral-300"
                initial={{ width: 0 }}
                animate={{ width: `${scoreGeral}%` }}
                transition={{ duration: 1.8, ease: 'easeOut', delay: 0.2 }}
              />
            </div>

            {/* Indicadores em grade */}
            <div className="grid grid-cols-3 gap-2">
              {([
                { valor: `${mock.periodo}`,           label: 'Janela de leitura'   },
                { valor: `${evidencias.length} sinais`,     label: 'Evidências usadas'   },
                { valor: `${mock.dimensoes.length} fontes`, label: 'Dimensões ativas'    },
                { valor: conteudosToShow.length > 0 ? `${conteudosToShow.length} arq.` : 'Nenhum', label: 'Contexto enviado' },
                { valor: navigatedSources.length > 0 ? `${navigatedSources.length} URLs` : 'Nenhuma', label: 'Fontes navegadas' },
                { valor: 'Inicial',                   label: 'Maturidade da leitura' },
              ] as { valor: string; label: string }[]).map(ind => (
                <div key={ind.label} className="flex flex-col gap-0.5 px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#252525] border border-neutral-200 dark:border-[#3a3a3a]">
                  <span className="text-[13px] font-bold tabular-nums text-neutral-800 dark:text-neutral-100 leading-tight">{ind.valor}</span>
                  <span className="text-[9px] text-neutral-400 dark:text-neutral-500 leading-snug">{ind.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Evolução do Score */}
        <div className={`${cardCls} overflow-hidden`}>
          <div className="px-4 pt-4 pb-3 border-b border-neutral-200 dark:border-[#3a3a3a]">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-neutral-400" strokeWidth={1.8} />
              <h3 className="text-[13px] font-semibold text-neutral-800 dark:text-neutral-100">Evolução do Score</h3>
            </div>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">A evolução acompanha o aumento de fontes, sinais e contextos considerados pelo OS¹.</p>
          </div>

          {/* Timeline vertical */}
          <div className="px-4 py-3">
            {mock.evolucao.map((pt, i) => {
              const isLast = i === mock.evolucao.length - 1;
              return (
                <div key={pt.semana} className="flex gap-3">
                  {/* Coluna da linha + dot */}
                  <div className="flex flex-col items-center w-6 flex-shrink-0">
                    <div className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center mt-0.5 ${
                      isLast
                        ? 'bg-neutral-700 dark:bg-neutral-200 border-neutral-700 dark:border-neutral-200'
                        : 'bg-neutral-100 dark:bg-[#2a2a2a] border-neutral-300 dark:border-[#484848]'
                    }`}>
                      {isLast && <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-[#181818]" />}
                    </div>
                    {!isLast && <div className="w-px flex-1 bg-neutral-200 dark:bg-[#3a3a3a] my-1" />}
                  </div>
                  {/* Conteúdo da linha */}
                  <div className={`flex-1 min-w-0 ${!isLast ? 'pb-3' : ''}`}>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={`text-[12px] font-semibold ${isLast ? 'text-neutral-800 dark:text-neutral-100' : 'text-neutral-500 dark:text-neutral-400'}`}>{pt.semana}</span>
                      <span className={`text-[13px] font-bold tabular-nums ${isLast ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400'}`}>{pt.score}</span>
                    </div>
                    <div className="h-[2px] bg-neutral-100 dark:bg-[#3a3a3a] rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-neutral-500 dark:bg-neutral-400 transition-all duration-700"
                        style={{ width: `${pt.score}%`, opacity: isLast ? 0.9 : 0.4 }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rodapé: variação total */}
          {(() => {
            const d = mock.evolucao[mock.evolucao.length - 1].score - mock.evolucao[0].score;
            return (
              <div className="px-4 pb-4">
                <div className="flex items-center justify-between px-3 py-2 bg-neutral-50 dark:bg-[#252525] border border-neutral-200 dark:border-[#3a3a3a] rounded-xl">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">Variação total</span>
                  <span className="text-[14px] font-black tabular-nums text-neutral-900 dark:text-white">{d >= 0 ? `+${d}` : d}</span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Fontes de reputação */}
        <div className={`${cardCls} overflow-hidden`}>
          <div className="px-4 pt-4 pb-3 border-b border-neutral-200 dark:border-[#3a3a3a]">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-neutral-400" strokeWidth={1.8} />
              <h3 className="text-[13px] font-semibold text-neutral-800 dark:text-neutral-100">Fontes de reputação</h3>
            </div>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">Fontes públicas e internas que compõem ou podem compor a leitura</p>
          </div>
          <div className="divide-y divide-neutral-100 dark:divide-[#3a3a3a]">
            {([
              { icon: ShieldCheck, nome: 'Reclame Aqui',     desc: 'Reclamações públicas e percepção de atendimento.',    badge: 'Fonte possível'  },
              { icon: MapPin,      nome: 'Google',            desc: 'Avaliações locais, presença pública e mapas.',        badge: 'Fonte possível'  },
              { icon: Zap,         nome: 'Redes sociais',    desc: 'Menções, engajamento e reputação de marca.',          badge: 'Fonte possível'  },
              { icon: FileText,    nome: 'Notícias',          desc: 'Cobertura pública e eventos de impacto na empresa.',  badge: 'Fonte possível'  },
              { icon: Globe,       nome: 'Fontes navegadas',  desc: navigatedSources.length > 0 ? `${navigatedSources.length} URL${navigatedSources.length > 1 ? 's' : ''} registrada${navigatedSources.length > 1 ? 's' : ''} no Navegador OS¹.` : 'URLs acessadas no Navegador OS¹ entram como contexto externo.', badge: navigatedSources.length > 0 ? `${navigatedSources.length} registradas` : 'Sem registros' },
              { icon: FileText,    nome: 'Contexto enviado', desc: conteudosToShow.length > 0 ? `${conteudosToShow.length} arquivo${conteudosToShow.length > 1 ? 's' : ''} interno${conteudosToShow.length > 1 ? 's' : ''} considerado${conteudosToShow.length > 1 ? 's' : ''} na leitura.` : 'Arquivos e observações internas aumentam a precisão.', badge: conteudosToShow.length > 0 ? `${conteudosToShow.length} arquivo${conteudosToShow.length > 1 ? 's' : ''}` : 'Aguardando' },
            ] as { icon: React.ElementType; nome: string; desc: string; badge: string }[]).map(f => {
              const Icon = f.icon;
              return (
                <div key={f.nome} className="flex items-center gap-3.5 px-4 py-3">
                  <div className="w-8 h-8 rounded-full flex-shrink-0 bg-neutral-100 dark:bg-[#2a2a2a] border border-neutral-200 dark:border-[#3d3d3d] flex items-center justify-center">
                    <Icon size={13} className="text-neutral-500 dark:text-neutral-400" strokeWidth={1.6} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-neutral-800 dark:text-neutral-100">{f.nome}</p>
                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500 leading-snug">{f.desc}</p>
                  </div>
                  <span className="flex-shrink-0 text-[9px] font-semibold px-2 py-0.5 rounded-full border border-neutral-300 dark:border-[#505050] text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                    {f.badge}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sinais dos últimos 30 dias */}
        <div className={`${cardCls} overflow-hidden`}>
          <div className="px-4 pt-4 pb-3 border-b border-neutral-200 dark:border-[#3a3a3a]">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-neutral-400" strokeWidth={1.8} />
              <h3 className="text-[13px] font-semibold text-neutral-800 dark:text-neutral-100">Sinais dos últimos 30 dias</h3>
            </div>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">Reclamações, elogios, eventos e oportunidades identificados neste ciclo</p>
          </div>
          <div className="divide-y divide-neutral-100 dark:divide-[#3a3a3a]">
            {([
              { titulo: 'Reclamações críticas',   valor: '0 identificadas',      desc: 'Nenhuma reclamação crítica registrada nesta leitura inicial.',         badge: 'Sem alertas'   },
              { titulo: 'Sinais positivos',        valor: `${Math.max(0, evidencias.filter(e => e.impacto > 0).length)} sinais`,  desc: 'Evidências com impacto positivo na leitura atual.',                     badge: 'Leitura inicial' },
              { titulo: 'Fontes externas',         valor: navigatedSources.length > 0 ? `${navigatedSources.length} URLs` : 'Em formação', desc: 'Fontes externas registradas como contexto de análise.',              badge: navigatedSources.length > 0 ? 'Ativo' : 'Em formação' },
              { titulo: 'Contexto interno',        valor: conteudosToShow.length > 0 ? `${conteudosToShow.length} arquivo${conteudosToShow.length > 1 ? 's' : ''}` : 'Nenhum enviado', desc: 'Contexto enviado aumenta a precisão e o Score da leitura.', badge: conteudosToShow.length > 0 ? 'Recebido' : 'Aguardando' },
              { titulo: 'Feed de inteligência',    valor: 'Cards ativos',         desc: 'Quando um sinal ganha relevância, aparece no Feed como card de inteligência.', badge: 'Ver Feed'      },
            ] as { titulo: string; valor: string; desc: string; badge: string }[]).map(s => (
              <div key={s.titulo} className="flex items-start gap-3.5 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="text-[12px] font-semibold text-neutral-800 dark:text-neutral-100">{s.titulo}</p>
                    <span className="flex-shrink-0 text-[9px] font-semibold px-2 py-0.5 rounded-full border border-neutral-300 dark:border-[#505050] text-neutral-500 dark:text-neutral-400 whitespace-nowrap">{s.badge}</span>
                  </div>
                  <p className="text-[11px] font-medium tabular-nums text-neutral-600 dark:text-neutral-300 mb-0.5">{s.valor}</p>
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500 leading-snug">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indicadores do Score — Dimensões */}
        <div className={`${cardCls} overflow-hidden`}>
          <div className="px-4 pt-4 pb-3 border-b border-neutral-200 dark:border-[#3a3a3a]">
            <div className="flex items-center gap-2">
              <BarChart2 size={14} className="text-neutral-400" strokeWidth={1.8} />
              <h3 className="text-[13px] font-semibold text-neutral-800 dark:text-neutral-100">Indicadores do Score</h3>
            </div>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">Dimensões que compõem a nota e a leitura do ambiente</p>
          </div>
          <div className="divide-y divide-neutral-100 dark:divide-[#3a3a3a]">
            {mock.dimensoes.map(dim => {
              const Icon = dim.icon;
              return (
                <div key={dim.id} className="flex items-center gap-3.5 px-4 py-3.5">
                  {/* Círculo monocromático */}
                  <div className="w-9 h-9 rounded-full flex-shrink-0 bg-neutral-100 dark:bg-[#2a2a2a] border border-neutral-200 dark:border-[#3d3d3d] flex items-center justify-center">
                    <Icon size={14} className="text-neutral-500 dark:text-neutral-400" strokeWidth={1.6} />
                  </div>
                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[13px] font-semibold text-neutral-800 dark:text-neutral-100">{dim.label}</span>
                      <span className="text-[13px] font-bold tabular-nums text-neutral-700 dark:text-neutral-200 flex-shrink-0">{dim.score}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 dark:text-neutral-500 leading-snug mb-1.5">{dim.descricao}</p>
                    <div className="h-[2px] bg-neutral-100 dark:bg-[#3a3a3a] rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-neutral-500 dark:bg-neutral-400 transition-all duration-700"
                        style={{ width: `${dim.score}%`, opacity: 0.5 + (dim.score / 100) * 0.4 }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fontes consideradas */}
        <div className={`${cardCls} overflow-hidden`}>
          <div className="px-4 pt-4 pb-3 border-b border-neutral-200 dark:border-[#3a3a3a]">
            <div className="flex items-center gap-2">
              <ExternalLink size={14} className="text-neutral-400" strokeWidth={1.8} />
              <h3 className="text-[13px] font-semibold text-neutral-800 dark:text-neutral-100">Fontes consideradas</h3>
            </div>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">Parâmetros que alimentam a leitura deste perfil</p>
          </div>
          <div className="divide-y divide-neutral-100 dark:divide-[#3a3a3a]">
            {([
              { icon: Zap,         nome: 'Feed',                  desc: 'Sinais de mercado usados para compor a leitura.',              badge: 'Ativo'     },
              { icon: MapPin,      nome: 'Mapa / Concorrência',   desc: 'Pressão competitiva considerada no contexto local.',           badge: 'Ativo'     },
              { icon: FileText,    nome: 'Conteúdos enviados',    desc: 'Materiais internos ajudam a calibrar a precisão.',             badge: conteudosToShow.length > 0 ? `${conteudosToShow.length} arquivo${conteudosToShow.length > 1 ? 's' : ''}` : 'Aguardando' },
              { icon: ShieldCheck, nome: 'Evidências',            desc: 'Sinais observados que sustentam a leitura.',                  badge: `${evidencias.length} sinal${evidencias.length !== 1 ? 'is' : ''}` },
              { icon: BarChart2,   nome: 'Perfil',                desc: 'Contexto da empresa e unidade analisada.',                    badge: 'Ativo'     },
              { icon: ClipboardList, nome: 'Operação',            desc: 'Sinais de resposta e capacidade de execução.',                badge: 'Em leitura'},
            ] as { icon: React.ElementType; nome: string; desc: string; badge: string }[]).map(f => {
              const Icon = f.icon;
              return (
                <div key={f.nome} className="flex items-center gap-3.5 px-4 py-3">
                  <div className="w-8 h-8 rounded-full flex-shrink-0 bg-neutral-100 dark:bg-[#2a2a2a] border border-neutral-200 dark:border-[#3d3d3d] flex items-center justify-center">
                    <Icon size={13} className="text-neutral-500 dark:text-neutral-400" strokeWidth={1.6} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-neutral-800 dark:text-neutral-100">{f.nome}</p>
                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500 leading-snug">{f.desc}</p>
                  </div>
                  <span className="flex-shrink-0 text-[9px] font-semibold px-2 py-0.5 rounded-full border border-neutral-300 dark:border-[#505050] text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                    {f.badge}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fontes do Navegador */}
        <div className={`${cardCls} overflow-hidden`}>
          <div className="px-4 pt-4 pb-3 border-b border-neutral-200 dark:border-[#3a3a3a]">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Globe size={14} className="text-neutral-400" strokeWidth={1.8} />
                <h3 className="text-[13px] font-semibold text-neutral-800 dark:text-neutral-100">Fontes do Navegador</h3>
              </div>
              <div className="flex items-center gap-2">
                {navigatedSources.length > 0 && (
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full border border-neutral-300 dark:border-[#505050] text-neutral-500 dark:text-neutral-400">
                    {navigatedSources.length} {navigatedSources.length === 1 ? 'fonte' : 'fontes'}
                  </span>
                )}
                <button onClick={refreshNavigatedSources} className="p-1 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                  <RefreshCw size={11} strokeWidth={1.8} />
                </button>
              </div>
            </div>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">URLs acessadas no Navegador OS¹ para este perfil</p>
          </div>
          {navigatedSources.length === 0 ? (
            <div className="px-4 py-5">
              <p className="text-[12px] text-neutral-400 dark:text-neutral-500 leading-relaxed">
                Nenhuma fonte navegada registrada para este perfil. Acesse o Navegador OS¹ para adicionar fontes externas à análise.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-[#3a3a3a]">
              {navigatedSources.map(src => (
                <div key={src.url} className="flex items-center gap-3.5 px-4 py-3">
                  <div className="w-8 h-8 rounded-full flex-shrink-0 bg-neutral-100 dark:bg-[#2a2a2a] border border-neutral-200 dark:border-[#3d3d3d] flex items-center justify-center">
                    <Globe size={13} className="text-neutral-500 dark:text-neutral-400" strokeWidth={1.6} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-neutral-800 dark:text-neutral-100 truncate">{src.host}</p>
                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate leading-snug">{src.url}</p>
                    <p className="text-[9px] text-neutral-300 dark:text-neutral-600 mt-0.5">{new Date(src.visitedAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <span className="flex-shrink-0 text-[9px] font-semibold px-2 py-0.5 rounded-full border border-neutral-300 dark:border-[#505050] text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                    Navegador
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Evidências */}
        <div className={`${cardCls} overflow-hidden`}>
          <div className="px-4 pt-4 pb-3 border-b border-neutral-200 dark:border-[#3a3a3a]">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-neutral-400" strokeWidth={1.8} />
                <h3 className="text-[13px] font-semibold text-neutral-800 dark:text-neutral-100">Sinais considerados</h3>
              </div>
              <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full border border-neutral-300 dark:border-[#505050] text-neutral-500 dark:text-neutral-400">
                {evidencias.length} {evidencias.length === 1 ? 'sinal' : 'sinais'}
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">Evidências que sustentam e calibram a leitura atual</p>
          </div>

          {evidencias.length === 0 ? (
            <div className="px-4 py-5">
              <p className="text-[12px] text-neutral-400 dark:text-neutral-500 leading-relaxed">
                Sem evidências específicas suficientes para este recorte. O OS¹ usa os sinais gerais do perfil até novas evidências entrarem.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-[#3a3a3a]">
              {evidencias.map(ev => {
                const confPct = Math.round(ev.confianca * 100);
                return (
                  <div key={ev.id} className="flex items-start gap-3.5 px-4 py-3.5">
                    <div className="w-8 h-8 rounded-full flex-shrink-0 bg-neutral-100 dark:bg-[#2a2a2a] border border-neutral-200 dark:border-[#3d3d3d] flex items-center justify-center mt-0.5">
                      <ShieldCheck size={13} className="text-neutral-500 dark:text-neutral-400" strokeWidth={1.6} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[12px] font-semibold text-neutral-800 dark:text-neutral-100 leading-snug">{ev.titulo}</p>
                        <span className="flex-shrink-0 text-[9px] font-semibold px-2 py-0.5 rounded-full border border-neutral-300 dark:border-[#505050] text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                          {ev.tipo}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5 leading-snug">{ev.fonte} · Confiança {confPct}%</p>
                      {ev.descricao && (
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">{ev.descricao}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Contexto enviado */}
        <div className={`${cardCls} overflow-hidden`}>
          <div className="px-4 pt-4 pb-3 border-b border-neutral-200 dark:border-[#3a3a3a]">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-neutral-400" strokeWidth={1.8} />
                <h3 className="text-[13px] font-semibold text-neutral-800 dark:text-neutral-100">Contexto enviado</h3>
              </div>
              {conteudosToShow.length > 0 && (
                <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full border border-neutral-300 dark:border-[#505050] text-neutral-500 dark:text-neutral-400">
                  {conteudosToShow.length} {conteudosToShow.length === 1 ? 'arquivo' : 'arquivos'}
                </span>
              )}
            </div>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">Arquivos e observações internas que aumentam a precisão do Score</p>
          </div>

          {conteudosToShow.length === 0 ? (
            <div className="px-4 py-5">
              <p className="text-[12px] text-neutral-400 dark:text-neutral-500 leading-relaxed">
                Nenhum conteúdo específico foi enviado para este recorte. A leitura usa os sinais disponíveis até novos materiais entrarem no sistema.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-[#3a3a3a]">
              {conteudosToShow.map((c, i) => (
                <div key={`${c.nome}-${i}`} className="flex items-center gap-3.5 px-4 py-3">
                  <div className="w-8 h-8 rounded-full flex-shrink-0 bg-neutral-100 dark:bg-[#2a2a2a] border border-neutral-200 dark:border-[#3d3d3d] flex items-center justify-center">
                    <FileText size={13} className="text-neutral-500 dark:text-neutral-400" strokeWidth={1.6} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-neutral-800 dark:text-neutral-100 truncate">{c.nome}</p>
                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500">Material interno considerado na leitura atual · {c.data}</p>
                  </div>
                  <span className="flex-shrink-0 text-[9px] font-semibold px-2 py-0.5 rounded-full border border-neutral-300 dark:border-[#505050] text-neutral-500 dark:text-neutral-400">
                    {c.tipo}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cards relacionados */}
        {(() => {
          const realInsights = insights && insights.length > 0 ? insights.slice(0, 5) : null;
          const badge = realInsights ? realInsights.length : mock.cardsRelacionados.length;
          return (
            <div className={`${cardCls} p-4`}>
              <SecaoHeader icon={ClipboardList} titulo="Sinais no Feed" badge={badge} />
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

        {/* O que está pesando no Score */}
        <div className={`${cardCls} p-4`}>
          <SecaoHeader icon={Zap} titulo="O que está pesando no Score" />
          <div className="bg-neutral-50 dark:bg-[#252525] border-[0.5px] border-neutral-200 dark:border-[#3a3a3a] rounded-xl p-3 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_1px_4px_rgba(0,0,0,0.28),0_1px_2px_rgba(0,0,0,0.2)]">
            <p className="text-[12px] text-neutral-600 dark:text-neutral-400 leading-relaxed">{mock.explicacao}</p>
          </div>
        </div>

        {/* Sobre o Score OS¹ */}
        <div className={`${cardCls} p-4`}>
          <SecaoHeader icon={ShieldCheck} titulo="Sobre o Score OS¹" />
          <div className="bg-neutral-50 dark:bg-[#252525] border-[0.5px] border-neutral-200 dark:border-[#3a3a3a] rounded-xl p-2 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_1px_4px_rgba(0,0,0,0.28),0_1px_2px_rgba(0,0,0,0.2)] grid grid-cols-4 gap-1.5">
            <InfoChip label="Painel de indicadores e reputação da empresa" icon={BarChart2} />
            <InfoChip label="Baseado nos sinais, fontes e contexto disponíveis" icon={FileText} />
            <InfoChip label="Aumenta conforme mais fontes e contextos entram" icon={RefreshCw} />
            <InfoChip label="Leitura inicial — não substitui decisão estratégica" icon={ShieldCheck} />
          </div>
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}
