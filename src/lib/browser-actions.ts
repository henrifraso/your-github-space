// Fase 5 — 5 funções universais do navegador interno.
// Cada função:
//  1. é manual (usuário clica explicitamente — sem captura invisível);
//  2. salva localmente quando não há backend equivalente;
//  3. emite CustomEvent pra que o App.tsx ponte com workspace/feed.

export interface BrowserActionContext {
  url: string;
  title: string;
  capturedText?: string;
  capturedAt: string; // ISO
  origin: 'navegador';
}

export interface BrowserEvidence extends BrowserActionContext {
  id: string;
  sector?: string;
  businessName?: string;
}

export interface BrowserMission extends BrowserActionContext {
  id: string;
  titulo: string;
  objetivo: string;
  etapas: string[];
  responsavelSugerido: string;
  prazoSugerido: string;
  evidenciaUrl: string;
  criterioConclusao: string;
}

export interface BrowserSessionVisit {
  url: string;
  title: string;
  visitedAt: string;
}

export interface BrowserFeedCard {
  id: string;
  titulo: string;
  resumo: string;
  dominio: string;
  risco: string;
  urgencia: 'alta' | 'media' | 'baixa';
  impacto: string;
  acaoRecomendada: string;
  evidenciaUrl: string;
  origem: 'navegador';
  capturedAt: string;
}

export interface BrowserSessionReport {
  id: string;
  generatedAt: string;
  totalVisits: number;
  sinaisDetectados: string[];
  riscos: string[];
  oportunidades: string[];
  possiveisCards: string[];
  proximosPassos: string[];
  resumo: string;
}

export type BrowserActionType =
  | 'send-to-workspace'
  | 'create-mission'
  | 'save-evidence'
  | 'generate-feed-card'
  | 'analyze-session'
  // P4: novas 5 (10 totais)
  | 'compare-tabs'
  | 'monitor-page'
  | 'capture-snippet'
  | 'create-dossier'
  | 'ask-sector-agent';

export interface BrowserWatcher {
  id: string;
  url: string;
  title: string;
  watchType: 'mudança' | 'preço' | 'regra' | 'concorrente' | 'fornecedor';
  createdAt: string;
  sector?: string;
}

export interface BrowserDossier {
  id: string;
  nome: string;
  tipo: string; // Fiscal, Fornecedor, Concorrente, Jurídico, Campanha, etc
  pages: { url: string; title: string; addedAt: string }[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrowserTabComparison {
  id: string;
  resumo: string;
  diferencas: string[];
  riscos: string[];
  vantagens: string[];
  recomendacao: string;
  melhorOpcao: string;
  capturedAt: string;
}

export interface BrowserSectorAgentAnswer {
  id: string;
  agente: string; // ex: "Agente Fiscal"
  pergunta: string;
  analise: string;
  observacoes: string[];
  proximosPassos: string[];
  capturedAt: string;
}

export interface BrowserActionEventDetail {
  type: BrowserActionType;
  context: BrowserActionContext;
  // payload secundário (opcional): qualquer estrutura de saída das 10 funções.
  payload?: BrowserMission | BrowserEvidence | BrowserFeedCard | BrowserSessionReport | BrowserTabComparison | BrowserWatcher | BrowserDossier | BrowserSectorAgentAnswer;
}

// ─── localStorage keys ────────────────────────────────────────────────────
export const BROWSER_LS_KEYS = {
  evidences: 'os1_browser_evidences',
  missions: 'os1_browser_missions',
  visits: 'os1_browser_session_visits',
  feedCards: 'os1_browser_feed_cards',
  reports: 'os1_browser_session_reports',
  // P4 novas
  watchers: 'os1_browser_watchers',
  dossiers: 'os1_browser_dossiers',
  comparisons: 'os1_browser_tab_comparisons',
  agentAnswers: 'os1_browser_agent_answers',
} as const;

function sectorAgentName(sector?: string): string {
  const s = (sector || '').toLowerCase();
  const map: Record<string, string> = {
    codify: 'Agente Codify', os1: 'Agente OS¹',
    fiscal: 'Agente Fiscal', contabil: 'Agente Contábil', juridico: 'Agente Jurídico',
    rh: 'Agente RH', compras: 'Agente Compras', marketing: 'Agente Marketing',
    vendas: 'Agente Vendas', operacao: 'Agente Operação', financeiro: 'Agente Financeiro',
    tecnologia: 'Agente Tecnologia', administrativo: 'Agente Administrativo',
    atendimento: 'Agente Atendimento', estrategia: 'Agente Estratégia',
  };
  if (map[s]) return map[s];
  return `Agente ${sector || 'do setor'}`;
}

function safeRead<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); if (raw) return JSON.parse(raw) as T; } catch { /* ignore */ }
  return fallback;
}
function safeWrite(key: string, val: unknown): void {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* ignore quota */ }
}

// ─── Função 3: Salvar evidência ──────────────────────────────────────────
export function loadEvidences(): BrowserEvidence[] { return safeRead(BROWSER_LS_KEYS.evidences, []); }
export function saveEvidence(ctx: BrowserActionContext, meta: { sector?: string; businessName?: string }): BrowserEvidence {
  const ev: BrowserEvidence = {
    id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ...ctx,
    sector: meta.sector,
    businessName: meta.businessName,
  };
  const all = loadEvidences();
  all.unshift(ev);
  safeWrite(BROWSER_LS_KEYS.evidences, all.slice(0, 500));
  return ev;
}

// ─── Função 2: Transformar em missão ─────────────────────────────────────
export function loadMissions(): BrowserMission[] { return safeRead(BROWSER_LS_KEYS.missions, []); }
export function buildMission(ctx: BrowserActionContext, meta: { sector?: string }): BrowserMission {
  const titulo = ctx.title ? `Investigar: ${ctx.title.slice(0, 60)}` : `Investigar página`;
  const sector = meta.sector || 'geral';
  const m: BrowserMission = {
    id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ...ctx,
    titulo,
    objetivo: `Avaliar o que esta página significa para o domínio ${sector} e propor ação concreta.`,
    etapas: [
      'Ler conteúdo da página e identificar fato/sinal principal',
      'Cruzar com dados internos relevantes',
      'Decidir se vira ação, comunicação ou descarte',
      'Registrar conclusão como card no feed',
    ],
    responsavelSugerido: 'Time de inteligência',
    prazoSugerido: '48h',
    evidenciaUrl: ctx.url,
    criterioConclusao: 'Card publicado no feed ou descarte com justificativa.',
  };
  const all = loadMissions();
  all.unshift(m);
  safeWrite(BROWSER_LS_KEYS.missions, all.slice(0, 200));
  return m;
}

// ─── Histórico de visitas (alimenta análise de sessão) ───────────────────
export function loadSessionVisits(): BrowserSessionVisit[] { return safeRead(BROWSER_LS_KEYS.visits, []); }
export function recordVisit(url: string, title: string): void {
  if (!url || !/^https?:\/\//i.test(url)) return;
  const all = loadSessionVisits();
  // Evita registrar a mesma URL N vezes seguidas em rajada de eventos.
  if (all[0]?.url === url) return;
  all.unshift({ url, title: title || url, visitedAt: new Date().toISOString() });
  safeWrite(BROWSER_LS_KEYS.visits, all.slice(0, 200));
}

// ─── Função 4: Gerar card no feed ────────────────────────────────────────
export function loadBrowserFeedCards(): BrowserFeedCard[] { return safeRead(BROWSER_LS_KEYS.feedCards, []); }
export function buildFeedCard(ctx: BrowserActionContext, meta: { sector?: string }): BrowserFeedCard {
  const sector = meta.sector || 'geral';
  const fc: BrowserFeedCard = {
    id: `bfc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    titulo: ctx.title ? `Sinal de navegação: ${ctx.title.slice(0, 80)}` : 'Sinal de navegação',
    resumo: ctx.capturedText
      ? ctx.capturedText.slice(0, 240) + (ctx.capturedText.length > 240 ? '…' : '')
      : `Página visitada manualmente em ${new Date(ctx.capturedAt).toLocaleString('pt-BR')}`,
    dominio: sector,
    risco: 'a avaliar',
    urgencia: 'media',
    impacto: 'a avaliar',
    acaoRecomendada: 'Revisar conteúdo e decidir próxima ação',
    evidenciaUrl: ctx.url,
    origem: 'navegador',
    capturedAt: ctx.capturedAt,
  };
  const all = loadBrowserFeedCards();
  all.unshift(fc);
  safeWrite(BROWSER_LS_KEYS.feedCards, all.slice(0, 200));
  return fc;
}

// ─── Função 5: Analisar sessão inteira ───────────────────────────────────
export function loadSessionReports(): BrowserSessionReport[] { return safeRead(BROWSER_LS_KEYS.reports, []); }
export function buildSessionReport(meta: { sector?: string }): BrowserSessionReport {
  const visits = loadSessionVisits();
  const evidences = loadEvidences();
  const missions = loadMissions();
  const cards = loadBrowserFeedCards();
  const sector = meta.sector || 'geral';

  const domains = Array.from(new Set(visits.map(v => {
    try { return new URL(v.url).hostname; } catch { return v.url; }
  })));
  const sinais: string[] = [];
  if (visits.length > 0) sinais.push(`${visits.length} páginas visitadas nesta sessão`);
  if (evidences.length > 0) sinais.push(`${evidences.length} evidências salvas`);
  if (domains.length > 0) sinais.push(`Domínios: ${domains.slice(0, 5).join(', ')}${domains.length > 5 ? '…' : ''}`);
  if (missions.length > 0) sinais.push(`${missions.length} missões propostas`);

  const r: BrowserSessionReport = {
    id: `rep-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    generatedAt: new Date().toISOString(),
    totalVisits: visits.length,
    sinaisDetectados: sinais,
    riscos: visits
      .filter(v => /captcha|sorry|forbidden|error|denied/i.test(v.url + ' ' + v.title))
      .slice(0, 3)
      .map(v => `Bloqueio/erro em ${v.title || v.url}`),
    oportunidades: cards.slice(0, 3).map(c => c.titulo),
    possiveisCards: cards.slice(0, 5).map(c => c.titulo),
    proximosPassos: [
      missions.length > 0 ? `Revisar ${missions.length} missão(ões) sugerida(s)` : 'Transformar evidências relevantes em missões',
      evidences.length > 0 ? `Catalogar ${evidences.length} evidência(s) por relevância` : 'Salvar evidências das páginas mais relevantes',
      `Compartilhar achados com o time de ${sector}`,
    ],
    resumo: visits.length === 0
      ? 'Sessão sem navegação registrada. Comece visitando páginas e use as ações do navegador para gerar inteligência.'
      : `${visits.length} páginas em ${domains.length} domínio(s) durante esta sessão. ${evidences.length} evidências guardadas, ${cards.length} cards gerados, ${missions.length} missões propostas.`,
  };
  const all = loadSessionReports();
  all.unshift(r);
  safeWrite(BROWSER_LS_KEYS.reports, all.slice(0, 50));
  return r;
}

// ─── Função 6: Comparar abas abertas ────────────────────────────────────
// Hoje compara o histórico de visitas (últimas N) — não temos API de abas abertas.
export function loadTabComparisons(): BrowserTabComparison[] { return safeRead(BROWSER_LS_KEYS.comparisons, []); }
export function buildTabComparison(): BrowserTabComparison {
  const visits = loadSessionVisits().slice(0, 5);
  const itens = visits.map(v => {
    try { return `${new URL(v.url).hostname}${v.title ? ` — ${v.title.slice(0, 50)}` : ''}`; } catch { return v.title || v.url; }
  });
  const c: BrowserTabComparison = {
    id: `bcmp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    resumo: visits.length >= 2
      ? `${visits.length} páginas visitadas recentemente — comparação cruzada gerada localmente.`
      : 'Poucas páginas visitadas. Abra mais 1-2 abas e refaça pra comparação mais rica.',
    diferencas: itens.slice(0, 5).map((t, i) => `Item ${i + 1}: ${t}`),
    riscos: visits.filter(v => /captcha|sorry|error|denied/i.test(v.title + v.url)).slice(0, 3).map(v => `Sinal de bloqueio em ${v.title || v.url}`),
    vantagens: visits.length > 0 ? [`Histórico recente de ${visits.length} fonte(s) preservado pra cross-reference`] : [],
    recomendacao: visits.length >= 2 ? 'Revisar diferenças e descartar fontes redundantes; transformar os 2 mais relevantes em evidência.' : 'Continue navegando e refaça com mais contexto.',
    melhorOpcao: visits[0] ? `${itens[0]}` : 'sem páginas suficientes',
    capturedAt: new Date().toISOString(),
  };
  const all = loadTabComparisons();
  all.unshift(c);
  safeWrite(BROWSER_LS_KEYS.comparisons, all.slice(0, 50));
  return c;
}

// ─── Função 7: Monitorar página (watcher local) ─────────────────────────
export function loadWatchers(): BrowserWatcher[] { return safeRead(BROWSER_LS_KEYS.watchers, []); }
export function addWatcher(ctx: BrowserActionContext, watchType: BrowserWatcher['watchType'], sector?: string): BrowserWatcher {
  const w: BrowserWatcher = {
    id: `bw-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    url: ctx.url,
    title: ctx.title,
    watchType,
    createdAt: ctx.capturedAt,
    sector,
  };
  const all = loadWatchers();
  all.unshift(w);
  safeWrite(BROWSER_LS_KEYS.watchers, all.slice(0, 200));
  return w;
}

// ─── Função 8: Capturar trecho ──────────────────────────────────────────
// Usa o capturedText do ctx (que o BrowserView já tira via executeJavaScript).
// Salva como evidência com flag "trecho".
export function captureSnippet(ctx: BrowserActionContext, meta: { sector?: string; selectedText?: string }): BrowserEvidence {
  const snippetText = (meta.selectedText && meta.selectedText.trim()) || (ctx.capturedText || '');
  const evCtx: BrowserActionContext = { ...ctx, capturedText: snippetText };
  return saveEvidence(evCtx, { sector: meta.sector });
}

// ─── Função 9: Criar dossiê ─────────────────────────────────────────────
export function loadDossiers(): BrowserDossier[] { return safeRead(BROWSER_LS_KEYS.dossiers, []); }
export function getOrCreateDossier(nome: string, tipo: string): BrowserDossier {
  const all = loadDossiers();
  const existing = all.find(d => d.nome === nome);
  if (existing) return existing;
  const d: BrowserDossier = {
    id: `bd-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    nome, tipo,
    pages: [], notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  all.unshift(d);
  safeWrite(BROWSER_LS_KEYS.dossiers, all.slice(0, 100));
  return d;
}
export function addPageToDossier(dossierId: string, ctx: BrowserActionContext): BrowserDossier | null {
  const all = loadDossiers();
  const idx = all.findIndex(d => d.id === dossierId);
  if (idx < 0) return null;
  all[idx].pages.unshift({ url: ctx.url, title: ctx.title, addedAt: ctx.capturedAt });
  all[idx].updatedAt = new Date().toISOString();
  safeWrite(BROWSER_LS_KEYS.dossiers, all);
  return all[idx];
}
// Default: cria/usa o dossiê do setor atual e adiciona a página
export function quickAddToSectorDossier(ctx: BrowserActionContext, sector?: string): BrowserDossier {
  const s = sector || 'geral';
  const cap = s.charAt(0).toUpperCase() + s.slice(1);
  const d = getOrCreateDossier(`Dossiê ${cap}`, cap);
  return addPageToDossier(d.id, ctx) || d;
}

// ─── Função 10: Perguntar ao agente do setor ────────────────────────────
export function loadAgentAnswers(): BrowserSectorAgentAnswer[] { return safeRead(BROWSER_LS_KEYS.agentAnswers, []); }
export function buildSectorAgentAnswer(ctx: BrowserActionContext, sector?: string): BrowserSectorAgentAnswer {
  const agente = sectorAgentName(sector);
  const pergunta = `Analisar a página ${ctx.title || ctx.url} sob a ótica de ${agente}.`;
  const analise = ctx.capturedText
    ? `${agente} avaliou: "${ctx.capturedText.slice(0, 280)}…". Pontos cruzados com contexto de ${sector || 'mercado'}.`
    : `${agente} sugere capturar mais conteúdo antes de fechar análise. Sem texto extraído da página.`;
  const obs: string[] = [];
  try {
    const host = new URL(ctx.url).hostname;
    obs.push(`Origem da fonte: ${host}`);
  } catch { /* ignore */ }
  if (ctx.capturedText && ctx.capturedText.length > 500) obs.push('Página com conteúdo extenso — vale criar dossiê dedicado.');
  if (/preço|valor|R\$|R\\$|tarifa/i.test(ctx.capturedText || '')) obs.push('Há sinais de preço/condições comerciais.');
  if (/lei|regulamento|portaria|norma/i.test(ctx.capturedText || '')) obs.push('Conteúdo regulatório detectado.');
  const proximos = [
    'Salvar como evidência se relevante',
    'Adicionar ao dossiê do setor',
    'Transformar em missão se precisar de ação',
  ];
  const a: BrowserSectorAgentAnswer = {
    id: `ba-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    agente, pergunta, analise,
    observacoes: obs,
    proximosPassos: proximos,
    capturedAt: new Date().toISOString(),
  };
  const all = loadAgentAnswers();
  all.unshift(a);
  safeWrite(BROWSER_LS_KEYS.agentAnswers, all.slice(0, 100));
  return a;
}

// ─── Helper opcional: limpar tudo (controle do usuário, LGPD) ────────────
export function clearAllBrowserData(): void {
  Object.values(BROWSER_LS_KEYS).forEach(k => { try { localStorage.removeItem(k); } catch { /* ignore */ } });
}

// ─── Dispatcher unificado pra emitir o evento ────────────────────────────
export function dispatchBrowserAction(detail: BrowserActionEventDetail): void {
  window.dispatchEvent(new CustomEvent<BrowserActionEventDetail>('os1:browser-action', { detail }));
}
