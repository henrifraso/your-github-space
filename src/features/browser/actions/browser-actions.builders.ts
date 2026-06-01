// Builders das 10 ações do navegador OS¹.
//
// Cada `build*`/`save*`/`add*` constrói o objeto da ação e persiste no
// localStorage via `safeWrite`. Conteúdo movido de
// src/lib/browser-actions.ts (Fase 13) byte-a-byte. Nenhum byte de
// label, ID, formato ou ordem foi alterado.

import type {
  BrowserActionContext, BrowserEvidence, BrowserMission, BrowserFeedCard,
  BrowserSessionReport, BrowserTabComparison, BrowserWatcher, BrowserDossier,
  BrowserSectorAgentAnswer,
} from '../../../core/types/browser';
import { BROWSER_LS_KEYS } from './browser-actions.catalog';
import {
  safeWrite,
  loadEvidences, loadMissions, loadBrowserFeedCards, loadSessionReports,
  loadSessionVisits, loadTabComparisons, loadWatchers, loadDossiers,
  loadAgentAnswers,
} from './browser-actions.storage';

// Helper interno: nomes humanos dos agentes por setor.
// Usado pelo `buildSectorAgentAnswer`.
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

// ─── Função 3: Salvar evidência ──────────────────────────────────────────
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

// ─── Função 4: Gerar card no feed ────────────────────────────────────────
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
