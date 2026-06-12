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

// Helper interno: leitura por setor (sem prometer agente/IA).
// Usado pelo `buildSectorAgentAnswer` (renomeado para leitura contextual preliminar).
function sectorReaderLabel(sector?: string): string {
  const s = (sector || '').toLowerCase();
  const map: Record<string, string> = {
    codify: 'Codify', os1: 'OS¹',
    fiscal: 'Fiscal', contabil: 'Contábil', juridico: 'Jurídico',
    rh: 'RH', compras: 'Compras', marketing: 'Marketing',
    vendas: 'Vendas', operacao: 'Operação', financeiro: 'Financeiro',
    tecnologia: 'Tecnologia', administrativo: 'Administrativo',
    atendimento: 'Atendimento', estrategia: 'Estratégia',
  };
  if (map[s]) return map[s];
  return sector || 'do setor';
}

// ─── Helper: análise de contexto da página ──────────────────────────────────
// Detecta o tipo de sinal a partir de URL + texto capturado. Saída orienta
// títulos, urgência, próximos passos e missões — evita texto genérico.
export interface PageContextAnalysis {
  pageType: 'preço' | 'regulatório' | 'concorrente' | 'fornecedor' | 'notícia' | 'pesquisa' | 'rede-social' | 'genérico';
  signals: string[];                       // sinais factuais detectados
  urgencyHint: 'baixa' | 'media' | 'alta'; // derivada do tipo
  hostname: string;                        // domínio (ex: g1.globo.com)
}

export function analyzePageContext(ctx: { url: string; title?: string; capturedText?: string }): PageContextAnalysis {
  const text = `${ctx.title || ''} ${ctx.capturedText || ''}`;
  let hostname = '';
  try { hostname = new URL(ctx.url).hostname.toLowerCase(); } catch { /* noop */ }

  const signals: string[] = [];

  // Heurísticas por hostname
  const isGovOrLegal = /\.gov\.br$|jusbrasil|conjur|planalto|receita|stf|stj|trf|trt/i.test(hostname);
  const isNews       = /globo|uol|folha|estadao|valor|exame|infomoney|g1|cnn|bbc|nyt|reuters|forbes/i.test(hostname);
  const isSocial     = /instagram|linkedin|twitter|x\.com|facebook|tiktok|youtube/i.test(hostname);
  const isResearch   = /google\.com\/search|bing|duckduckgo|scholar|gartner|forrester|mckinsey/i.test(hostname);
  const isMarketplace = /mercadolivre|amazon|magalu|americanas|shopee|aliexpress/i.test(hostname);

  // Heurísticas por texto
  const hasPrice    = /R\$\s*\d+|\$\s*\d+|preço|valor|tarifa|desconto|promoç/i.test(text);
  const hasRegulatory = /lei|regulamento|portaria|norma|decreto|resolução|conformidade|compliance/i.test(text);
  const hasCompetitor = /concorrente|líder de mercado|market share|share de mercado/i.test(text);
  const hasSupplier   = /fornecedor|distribuidor|insumo|atacado|matéria-prima/i.test(text);

  // Decide tipo (prioridade: regulatório > preço > concorrente > fornecedor > notícia > social > pesquisa > genérico)
  let pageType: PageContextAnalysis['pageType'] = 'genérico';
  if (isGovOrLegal || hasRegulatory) pageType = 'regulatório';
  else if (isMarketplace || hasPrice) pageType = 'preço';
  else if (hasCompetitor) pageType = 'concorrente';
  else if (hasSupplier) pageType = 'fornecedor';
  else if (isNews) pageType = 'notícia';
  else if (isSocial) pageType = 'rede-social';
  else if (isResearch) pageType = 'pesquisa';

  // Sinais factuais
  if (isGovOrLegal) signals.push('Origem em fonte oficial/regulatória');
  if (hasRegulatory) signals.push('Termos regulatórios na página');
  if (hasPrice) signals.push('Indicações de preço/condições comerciais');
  if (hasCompetitor) signals.push('Menção explícita a concorrência');
  if (hasSupplier) signals.push('Conteúdo de fornecedor/cadeia de suprimentos');
  if (isNews) signals.push(`Imprensa: ${hostname}`);
  if (isSocial) signals.push(`Rede social: ${hostname}`);
  if (ctx.capturedText && ctx.capturedText.length > 800) signals.push('Página com conteúdo extenso — vale dossiê dedicado');

  // Urgência sugerida
  let urgencyHint: PageContextAnalysis['urgencyHint'] = 'baixa';
  if (pageType === 'regulatório') urgencyHint = 'alta';
  else if (pageType === 'preço' || pageType === 'concorrente') urgencyHint = 'media';

  return { pageType, signals, urgencyHint, hostname };
}

// ─── Função 3: Salvar evidência ──────────────────────────────────────────
// Estrutura unificada (Etapa 8):
//   - dedupe: mesma URL + action + snippet nas últimas 50 atualiza timestamp
//   - pageType/summary/riskLevel calculados via analyzePageContext
//   - flags usedInWorkspace/usedInFeed/dossierId opcionais pra rastrear uso
//
// Retorna a evidência criada OU a existente (atualizada).
export interface SaveEvidenceMeta {
  sector?: string;
  businessName?: string;
  role?: string;
  action?: BrowserEvidence['action'];   // default 'save-evidence'
  snippet?: string;                     // trecho selecionado
  usedInWorkspace?: boolean;
  usedInFeed?: boolean;
  dossierId?: string;
  evidenceLabel?: string;
}

export function saveEvidence(ctx: BrowserActionContext, meta: SaveEvidenceMeta = {}): BrowserEvidence {
  const action = meta.action || 'save-evidence';
  const analysis = analyzePageContext(ctx);

  // Mapping risco por tipo (mesmo do buildFeedCard)
  const riscoMap: Record<PageContextAnalysis['pageType'], 'alto' | 'medio' | 'baixo'> = {
    'regulatório': 'alto',
    'preço': 'medio',
    'concorrente': 'medio',
    'fornecedor': 'baixo',
    'notícia': 'baixo',
    'rede-social': 'baixo',
    'pesquisa': 'baixo',
    'genérico': 'baixo',
  };

  const all = loadEvidences();

  // Dedupe: mesma URL + action + snippet nas últimas 50 evidências
  const snippet = (meta.snippet || '').trim();
  const dupIdx = all.slice(0, 50).findIndex(e =>
    e.url === ctx.url &&
    (e.action || 'save-evidence') === action &&
    ((e.snippet || '').trim() === snippet)
  );
  if (dupIdx >= 0) {
    // Atualiza timestamp + merges flags + move pro topo
    const existing = all[dupIdx];
    const updated: BrowserEvidence = {
      ...existing,
      capturedAt: ctx.capturedAt,
      usedInWorkspace: meta.usedInWorkspace ?? existing.usedInWorkspace,
      usedInFeed: meta.usedInFeed ?? existing.usedInFeed,
      dossierId: meta.dossierId ?? existing.dossierId,
    };
    all.splice(dupIdx, 1);
    all.unshift(updated);
    safeWrite(BROWSER_LS_KEYS.evidences, all.slice(0, 500));
    return updated;
  }

  // Resumo curto: sinais + primeiras palavras do capturedText
  const summaryFromSignals = analysis.signals.slice(0, 2).join(' · ');
  const summaryFromText = ctx.capturedText ? ctx.capturedText.slice(0, 120).replace(/\s+/g, ' ').trim() : '';
  const summary = summaryFromSignals || summaryFromText || `Página revisada em ${new Date(ctx.capturedAt).toLocaleDateString('pt-BR')}`;

  const evidenceLabel = meta.evidenceLabel || ctx.title?.slice(0, 60) || analysis.hostname || 'Evidência sem título';

  const ev: BrowserEvidence = {
    id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ...ctx,
    source: 'browser',
    action,
    sector: meta.sector,
    businessName: meta.businessName,
    role: meta.role,
    snippet: snippet || undefined,
    pageType: analysis.pageType,
    riskLevel: riscoMap[analysis.pageType],
    summary,
    evidenceLabel,
    usedInWorkspace: meta.usedInWorkspace,
    usedInFeed: meta.usedInFeed,
    dossierId: meta.dossierId,
  };
  all.unshift(ev);
  safeWrite(BROWSER_LS_KEYS.evidences, all.slice(0, 500));
  return ev;
}

// ─── Função 2: Preparar plano da página ─────────────────────────────────
// Plano/rascunho contextual: título, etapas, responsável e prazo variam
// conforme tipo de página (regulatório/preço/concorrente/etc.) detectado em
// `analyzePageContext`. Evita as 4 etapas fixas de antes.
// C1-B: linguagem alinhada ao canônico do C1 ('plano'/'rascunho'). O nome
// `buildMission` e o tipo `BrowserMission` são mantidos como contrato interno
// (action id 'create-mission' é union type fixo em core/types/browser.ts).
export function buildMission(ctx: BrowserActionContext, meta: { sector?: string }): BrowserMission {
  const sector = meta.sector || 'geral';
  const a = analyzePageContext(ctx);

  // Título por tipo
  const tituloBase = ctx.title ? ctx.title.slice(0, 60) : (a.hostname || 'página');
  const tituloMap: Record<PageContextAnalysis['pageType'], string> = {
    'regulatório': `Avaliar mudança regulatória: ${tituloBase}`,
    'preço':       `Reagir a sinal de preço: ${tituloBase}`,
    'concorrente': `Investigar movimento competitivo: ${tituloBase}`,
    'fornecedor':  `Avaliar opção de fornecedor: ${tituloBase}`,
    'notícia':     `Acompanhar repercussão: ${tituloBase}`,
    'rede-social': `Capturar sinal social: ${tituloBase}`,
    'pesquisa':    `Aprofundar pesquisa: ${tituloBase}`,
    'genérico':    `Revisar página: ${tituloBase}`,
  };
  const titulo = tituloMap[a.pageType];

  // Objetivo por tipo
  const objetivoMap: Record<PageContextAnalysis['pageType'], string> = {
    'regulatório': `Entender o que muda na operação e ajustar conformidade no contexto analisado.`,
    'preço':       `Avaliar se preço/condição da página exige ajuste comercial no contexto analisado.`,
    'concorrente': `Mapear o movimento e definir resposta competitiva no contexto analisado.`,
    'fornecedor':  `Validar viabilidade do fornecedor e potencial de redução de custo/prazo.`,
    'notícia':     `Avaliar impacto da notícia no contexto analisado e decidir comunicação.`,
    'rede-social': `Capturar sinal social e decidir se vira posicionamento ou resposta.`,
    'pesquisa':    `Aprofundar pesquisa em fontes adjacentes e consolidar achado.`,
    'genérico':    `Avaliar relevância da página no contexto analisado e propor ação concreta.`,
  };

  // Etapas por tipo (4-6, contextuais)
  const etapasMap: Record<PageContextAnalysis['pageType'], string[]> = {
    'regulatório': [
      'Identificar a norma/regra mencionada e a data de vigência',
      'Mapear quais processos internos são afetados',
      'Cruzar com checklist de conformidade do setor',
      'Definir responsável pela adaptação operacional',
      'Definir prazo de adequação e métrica de conformidade',
      'Comunicar à liderança e registrar plano de ação',
    ],
    'preço': [
      'Comparar preço/condição da página com a oferta atual',
      'Avaliar se há margem para acompanhar ou diferenciar',
      'Verificar se o sinal afeta margem, mix ou posicionamento',
      'Decidir resposta comercial (ajuste, combo, comunicação)',
      'Medir impacto em 7 dias após implementação',
    ],
    'concorrente': [
      'Resumir o movimento detectado em uma frase',
      'Avaliar a abrangência (regional, segmento, canal)',
      'Mapear impacto direto no nosso pipeline',
      'Definir resposta (defender, neutralizar, ignorar)',
      'Comunicar time comercial e monitorar em 14 dias',
    ],
    'fornecedor': [
      'Listar critérios mínimos de avaliação do fornecedor',
      'Verificar capacidade, lead time e termos comerciais',
      'Comparar com fornecedor atual (custo, qualidade, risco)',
      'Decidir teste piloto ou descarte com justificativa',
      'Definir métrica de aprovação após o piloto',
    ],
    'notícia': [
      'Extrair fato principal e fonte da notícia',
      'Avaliar se afeta cliente, mercado ou regulação',
      'Mapear ângulos relevantes para o setor',
      'Definir se vira comunicação interna ou externa',
      'Registrar como evidência para repercussão futura',
    ],
    'rede-social': [
      'Capturar o sinal (post, comentário, tendência)',
      'Verificar volume e alcance estimado',
      'Avaliar tom (positivo, neutro, negativo)',
      'Decidir resposta (engajar, monitorar, ignorar)',
      'Registrar como dossiê de reputação se for relevante',
    ],
    'pesquisa': [
      'Identificar pergunta-chave que motivou a pesquisa',
      'Listar 3 fontes complementares para validar o achado',
      'Comparar findings com a hipótese inicial',
      'Consolidar conclusão e próximas perguntas',
      'Publicar achado para o time como evidência',
    ],
    'genérico': [
      'Identificar fato/sinal principal da página',
      'Cruzar com dados internos relevantes',
      'Avaliar impacto no setor e prioridade',
      'Decidir próxima ação (plano, card, descarte)',
      'Registrar conclusão para uso futuro',
    ],
  };

  // Responsável e prazo por tipo
  const responsavelMap: Record<PageContextAnalysis['pageType'], string> = {
    'regulatório': 'Time de compliance + liderança do setor',
    'preço':       'Time comercial',
    'concorrente': 'Time de inteligência competitiva',
    'fornecedor':  'Time de compras',
    'notícia':     'Time de comunicação',
    'rede-social': 'Time de marca/marketing',
    'pesquisa':    'Time de inteligência',
    'genérico':    'Time de inteligência',
  };
  const prazoMap: Record<PageContextAnalysis['pageType'], string> = {
    'regulatório': '5 dias úteis',
    'preço':       '48h',
    'concorrente': '7 dias',
    'fornecedor':  '10 dias',
    'notícia':     '48h',
    'rede-social': '24h',
    'pesquisa':    '7 dias',
    'genérico':    '48h',
  };
  const criterioMap: Record<PageContextAnalysis['pageType'], string> = {
    'regulatório': 'Plano de adequação publicado com responsável e prazo.',
    'preço':       'Decisão comercial documentada e comunicada ao time.',
    'concorrente': 'Resposta competitiva definida ou justificativa para ignorar.',
    'fornecedor':  'Teste piloto agendado ou fornecedor descartado com motivo.',
    'notícia':     'Comunicação publicada ou registrada como descarte com motivo.',
    'rede-social': 'Resposta dada ou sinal registrado para acompanhamento.',
    'pesquisa':    'Achado consolidado e compartilhado com o time.',
    'genérico':    'Card publicado no feed ou descarte com justificativa.',
  };

  // Auto-cria/vincula evidência: plano sempre referencia uma evidência salva.
  // Marca usedInWorkspace=true porque o plano vai pra Área de Trabalho.
  saveEvidence(ctx, {
    sector,
    action: 'create-mission',
    usedInWorkspace: true,
    evidenceLabel: `Plano: ${titulo}`,
  });

  const m: BrowserMission = {
    id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ...ctx,
    titulo,
    objetivo: objetivoMap[a.pageType],
    etapas: etapasMap[a.pageType],
    responsavelSugerido: responsavelMap[a.pageType],
    prazoSugerido: prazoMap[a.pageType],
    evidenciaUrl: ctx.url,
    criterioConclusao: criterioMap[a.pageType],
  };
  const all = loadMissions();
  all.unshift(m);
  safeWrite(BROWSER_LS_KEYS.missions, all.slice(0, 200));
  return m;
}

// ─── Função 4: Gerar card no feed ────────────────────────────────────────
// Card adapta título, urgência, risco e ação à página detectada.
// Em vez de "Sinal de navegação" sempre, usa o tipo identificado.
// Etapa 10:
//   - Cria evidência associada e retorna evidenceId no card
//   - Dedupe: mesma URL + mesmo pageType nas últimas 30 atualiza
//     timestamp em vez de criar duplicata
//   - Urgência derivada por tipo (regulatório → alta, preço/concorrente
//     → media, resto → baixa)
export function buildFeedCard(ctx: BrowserActionContext, meta: { sector?: string }): BrowserFeedCard {
  const sector = meta.sector || 'geral';
  const a = analyzePageContext(ctx);

  const tituloBase = ctx.title ? ctx.title.slice(0, 80) : a.hostname || 'página';
  const tituloMap: Record<PageContextAnalysis['pageType'], string> = {
    'regulatório': `Atualização regulatória identificada: ${tituloBase}`,
    'preço':       `Sinal de preço encontrado: ${tituloBase}`,
    'concorrente': `Movimento competitivo observado: ${tituloBase}`,
    'fornecedor':  `Fornecedor identificado: ${tituloBase}`,
    'notícia':     `Notícia relevante: ${tituloBase}`,
    'rede-social': `Sinal reputacional observado: ${tituloBase}`,
    'pesquisa':    `Oportunidade encontrada na navegação: ${tituloBase}`,
    'genérico':    `Evidência operacional registrada: ${tituloBase}`,
  };
  const riscoMap: Record<PageContextAnalysis['pageType'], string> = {
    'regulatório': 'conformidade',
    'preço':       'margem',
    'concorrente': 'competitivo',
    'fornecedor':  'custo/cadeia',
    'notícia':     'reputação',
    'rede-social': 'reputação',
    'pesquisa':    'a avaliar',
    'genérico':    'a avaliar',
  };
  // Urgência por tipo (Etapa 10):
  //   regulatório → alta
  //   preço, concorrente, fornecedor, rede-social → média
  //   notícia, pesquisa, genérico → baixa
  const urgenciaMap: Record<PageContextAnalysis['pageType'], 'alta' | 'media' | 'baixa'> = {
    'regulatório': 'alta',
    'preço':       'media',
    'concorrente': 'media',
    'fornecedor':  'media',
    'rede-social': 'media',
    'notícia':     'baixa',
    'pesquisa':    'baixa',
    'genérico':    'baixa',
  };
  const acaoMap: Record<PageContextAnalysis['pageType'], string> = {
    'regulatório': 'Avaliar impacto na operação e definir plano de adequação.',
    'preço':       'Comparar com oferta atual e decidir resposta comercial.',
    'concorrente': 'Mapear o movimento e definir resposta em 7 dias.',
    'fornecedor':  'Validar capacidade e termos antes de pilotar.',
    'notícia':     'Avaliar repercussão e necessidade de comunicação.',
    'rede-social': 'Capturar sinal e decidir resposta ou monitoramento.',
    'pesquisa':    'Aprofundar em fontes complementares.',
    'genérico':    'Revisar e decidir próxima ação.',
  };

  // Resumo: 1-2 frases — o que foi encontrado + área que pode afetar
  const fato = ctx.capturedText
    ? ctx.capturedText.slice(0, 160).replace(/\s+/g, ' ').trim() + (ctx.capturedText.length > 160 ? '…' : '')
    : a.signals.length > 0
      ? a.signals.slice(0, 1).join('')
      : `Página revisada em ${new Date(ctx.capturedAt).toLocaleDateString('pt-BR')}`;
  const areaImpacto: Record<PageContextAnalysis['pageType'], string> = {
    'regulatório': 'Pode afetar conformidade do setor.',
    'preço':       'Pode afetar margem comercial.',
    'concorrente': 'Pode afetar disputa competitiva.',
    'fornecedor':  'Pode afetar cadeia de suprimentos.',
    'notícia':     'Pode afetar reputação ou repercussão.',
    'rede-social': 'Pode afetar percepção de marca.',
    'pesquisa':    'Pode informar decisão estratégica.',
    'genérico':    'Pode informar decisão operacional.',
  };
  const resumo = `${fato} ${areaImpacto[a.pageType]}`;

  // Vincula evidência (Etapa 8 + 10): card sempre referencia evidência.
  const evidence = saveEvidence(ctx, {
    sector,
    action: 'generate-feed-card',
    usedInFeed: true,
    evidenceLabel: `Feed: ${tituloMap[a.pageType]}`,
  });

  // Dedupe (Etapa 10): mesma URL + mesmo pageType nas últimas 30 cards
  // atualiza timestamp em vez de criar duplicata.
  const all = loadBrowserFeedCards();
  const dupIdx = all.slice(0, 30).findIndex(c =>
    c.evidenciaUrl === ctx.url && c.pageType === a.pageType
  );
  if (dupIdx >= 0) {
    const existing = all[dupIdx];
    const updated: BrowserFeedCard = {
      ...existing,
      capturedAt: ctx.capturedAt,
      evidenceId: evidence.id,
      deduped: true,
    };
    all.splice(dupIdx, 1);
    all.unshift(updated);
    safeWrite(BROWSER_LS_KEYS.feedCards, all.slice(0, 200));
    return updated;
  }

  const fc: BrowserFeedCard = {
    id: `bfc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    titulo: tituloMap[a.pageType],
    resumo,
    dominio: sector,
    risco: riscoMap[a.pageType],
    urgencia: urgenciaMap[a.pageType],
    impacto: a.pageType === 'regulatório' || a.pageType === 'preço' ? 'direto' : 'a avaliar',
    acaoRecomendada: acaoMap[a.pageType],
    evidenciaUrl: ctx.url,
    origem: 'navegador',
    capturedAt: ctx.capturedAt,
    evidenceId: evidence.id,
    pageType: a.pageType,
    sourceTitle: ctx.title,
    deduped: false,
  };
  all.unshift(fc);
  safeWrite(BROWSER_LS_KEYS.feedCards, all.slice(0, 200));
  return fc;
}

// ─── Função 5: Analisar sessão inteira ───────────────────────────────────
// Relatório da sessão atual: padrões percebidos (não só contagem), o que
// merece ação primeiro, e próximos passos contextuais.
export function buildSessionReport(meta: { sector?: string }): BrowserSessionReport {
  const visits = loadSessionVisits();
  const evidences = loadEvidences();
  const missions = loadMissions();
  const cards = loadBrowserFeedCards();
  const sector = meta.sector || 'geral';

  // Classifica cada visita por tipo via analyzePageContext
  const classified = visits.map(v => ({
    visit: v,
    analysis: analyzePageContext({ url: v.url, title: v.title, capturedText: '' }),
  }));

  // Distribuição por tipo
  const distribuicao = new Map<PageContextAnalysis['pageType'], number>();
  classified.forEach(c => distribuicao.set(c.analysis.pageType, (distribuicao.get(c.analysis.pageType) || 0) + 1));

  // Domínios únicos
  const domains = Array.from(new Set(classified.map(c => c.analysis.hostname).filter(Boolean)));

  // Padrões percebidos — análise qualitativa, não só contagem
  const padroes: string[] = [];
  const tipoDominante = Array.from(distribuicao.entries()).sort((x, y) => y[1] - x[1])[0];
  if (tipoDominante && tipoDominante[1] >= 2) {
    padroes.push(`Foco em conteúdo do tipo ${tipoDominante[0]} (${tipoDominante[1]} página(s)).`);
  }
  const regulatorioCount = distribuicao.get('regulatório') || 0;
  const precoCount = distribuicao.get('preço') || 0;
  const concorrenteCount = distribuicao.get('concorrente') || 0;
  if (regulatorioCount >= 1) padroes.push(`${regulatorioCount} página(s) regulatória(s) — exige atenção a prazos.`);
  if (precoCount >= 2) padroes.push(`${precoCount} sinal(is) de preço — investigação comercial em curso.`);
  if (concorrenteCount >= 2) padroes.push(`${concorrenteCount} sinal(is) competitivo(s) — movimento de mercado em monitoramento.`);
  if (domains.length === 1 && visits.length > 1) padroes.push(`Toda a navegação em um único domínio (${domains[0]}) — investigação aprofundada.`);
  if (domains.length > 5) padroes.push(`Pesquisa ampla: ${domains.length} domínio(s) diferente(s) consultado(s).`);

  // Sinais factuais (mantém estatística mas concisa)
  const sinais: string[] = [];
  if (visits.length > 0) sinais.push(`${visits.length} página(s) revisada(s) em ${domains.length} domínio(s)`);
  if (evidences.length > 0) sinais.push(`${evidences.length} evidência(s) salva(s)`);
  if (missions.length > 0) sinais.push(`${missions.length} plano(s) já preparado(s) na sessão`);

  // Riscos: bloqueios + páginas regulatórias urgentes
  const riscos: string[] = [];
  visits
    .filter(v => /captcha|sorry|forbidden|error|denied/i.test(v.url + ' ' + v.title))
    .slice(0, 2)
    .forEach(v => riscos.push(`Bloqueio/erro em ${v.title || v.url}`));
  classified
    .filter(c => c.analysis.pageType === 'regulatório')
    .slice(0, 2)
    .forEach(c => riscos.push(`Regulatório a tratar: ${c.visit.title || c.analysis.hostname}`));

  // O que merece ação primeiro: ordem de prioridade
  const prioridade: PageContextAnalysis['pageType'][] = ['regulatório', 'preço', 'concorrente', 'fornecedor', 'notícia', 'rede-social', 'pesquisa', 'genérico'];
  const merecemAcao = [...classified]
    .sort((x, y) => prioridade.indexOf(x.analysis.pageType) - prioridade.indexOf(y.analysis.pageType))
    .slice(0, 3)
    .map(c => `${c.visit.title || c.analysis.hostname} (${c.analysis.pageType})`);

  // Próximos passos contextuais
  const proximosPassos: string[] = [];
  if (regulatorioCount > 0) proximosPassos.push(`Tratar ${regulatorioCount} página(s) regulatória(s) prioritariamente.`);
  if (missions.length === 0 && visits.length >= 3) proximosPassos.push('Transformar 1-2 páginas mais relevantes em missões.');
  if (evidences.length < visits.length / 3) proximosPassos.push('Capturar evidências (trechos) das páginas centrais.');
  if (cards.length === 0 && visits.length >= 2) proximosPassos.push('Promover sinais relevantes para o feed.');
  proximosPassos.push(`Compartilhar achados com o time de ${sector}.`);

  // Resumo executivo
  let resumo: string;
  if (visits.length === 0) {
    resumo = 'Sessão sem navegação registrada. Comece visitando páginas e use as ações do navegador para gerar inteligência.';
  } else {
    const tipoTxt = tipoDominante && tipoDominante[1] >= 2 ? ` Foco em ${tipoDominante[0]}.` : '';
    resumo = `${visits.length} página(s) em ${domains.length} domínio(s).${tipoTxt} ${evidences.length} evidência(s) e ${missions.length} plano(s) gerado(s) nesta sessão.`;
  }

  const r: BrowserSessionReport = {
    id: `rep-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    generatedAt: new Date().toISOString(),
    totalVisits: visits.length,
    // Compatibilidade: armazena "padrões + sinais" em sinaisDetectados
    // (o tipo é string[]; bridge agrega os dois pra exibição).
    sinaisDetectados: padroes.length > 0 ? [...padroes, ...sinais] : sinais,
    riscos,
    oportunidades: merecemAcao,
    possiveisCards: cards.slice(0, 5).map(c => c.titulo),
    proximosPassos,
    resumo,
  };
  const all = loadSessionReports();
  all.unshift(r);
  safeWrite(BROWSER_LS_KEYS.reports, all.slice(0, 50));
  return r;
}

// ─── Função 6: Comparar páginas recentes ─────────────────────────────────
// Renomeada conceitualmente de "Comparar abas abertas" — não existe API
// de abas abertas; comparamos as últimas N visitas. Texto é honesto:
// fala "páginas recentes", classifica por tipo via analyzePageContext
// e aponta qual merece ação primeiro.
export function buildTabComparison(): BrowserTabComparison {
  const visits = loadSessionVisits().slice(0, 5);

  // Classifica cada visita por pageType usando o helper
  const classificadas = visits.map(v => {
    const ctx = { url: v.url, title: v.title, capturedAt: v.visitedAt || new Date().toISOString(), origin: 'navegador' as const };
    const a = analyzePageContext(ctx);
    return { v, a };
  });

  const itens = classificadas.map(({ v, a }) => {
    const host = a.hostname || (() => { try { return new URL(v.url).hostname; } catch { return v.url; } })();
    return `${host} — ${a.pageType}${v.title ? ` · ${v.title.slice(0, 50)}` : ''}`;
  });

  // Diferenças: agrupa por pageType pra mostrar diversidade de origens
  const tipos = Array.from(new Set(classificadas.map(c => c.a.pageType)));
  const diferencas = tipos.length === 1
    ? [`Todas as ${visits.length} páginas recentes são do tipo ${tipos[0]} — origem semelhante.`, ...itens.slice(0, 3).map((t, i) => `Recente ${i + 1}: ${t}`)]
    : [`${tipos.length} tipos diferentes nas páginas recentes: ${tipos.join(', ')}.`, ...itens.slice(0, 5).map((t, i) => `Recente ${i + 1}: ${t}`)];

  // Riscos: páginas bloqueadas + páginas regulatórias (urgentes)
  const riscos: string[] = [];
  visits.filter(v => /captcha|sorry|error|denied/i.test(v.title + v.url))
    .slice(0, 3)
    .forEach(v => riscos.push(`Sinal de bloqueio: ${v.title || v.url}`));
  classificadas.filter(c => c.a.pageType === 'regulatório')
    .slice(0, 2)
    .forEach(c => riscos.push(`Regulatório detectado: ${c.v.title || c.a.hostname}`));

  // Vantagens
  const vantagens = visits.length > 0
    ? [`${visits.length} página(s) preservadas para cross-reference durante esta sessão.`]
    : [];

  // Qual merece ação primeiro: prioridade regulatório > preço > concorrente > resto
  const ordemPrioridade: PageContextAnalysis['pageType'][] = ['regulatório', 'preço', 'concorrente', 'fornecedor', 'notícia', 'rede-social', 'pesquisa', 'genérico'];
  const prioridade = [...classificadas].sort((x, y) => ordemPrioridade.indexOf(x.a.pageType) - ordemPrioridade.indexOf(y.a.pageType));
  const melhor = prioridade[0];
  const melhorOpcao = melhor
    ? `${melhor.a.hostname || 'página'} — ${melhor.a.pageType}${melhor.v.title ? ` · ${melhor.v.title.slice(0, 50)}` : ''}`
    : 'sem páginas suficientes';

  const recomendacao = visits.length >= 2
    ? `Prioridade: ${melhor?.a.pageType || 'revisar'}. Separar evidência da página acima e preparar plano de ação se exigir.`
    : 'Navegue por mais 1-2 páginas e refaça para enriquecer a comparação.';

  const c: BrowserTabComparison = {
    id: `bcmp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    resumo: visits.length >= 2
      ? `${visits.length} páginas recentes comparadas. ${tipos.length} tipo(s) de origem identificados.`
      : 'Poucas páginas para comparar. Continue navegando e refaça.',
    diferencas,
    riscos,
    vantagens,
    recomendacao,
    melhorOpcao,
    capturedAt: new Date().toISOString(),
  };
  const all = loadTabComparisons();
  all.unshift(c);
  safeWrite(BROWSER_LS_KEYS.comparisons, all.slice(0, 50));
  return c;
}

// ─── Função 7: Acompanhar página (Codify watchlist) ─────────────────────
// AVISO: hoje só registra a página numa lista. NÃO há mecanismo de
// detecção automática de mudanças — visível só pra Codify. Quando houver
// detecção real (polling/diff/hash), trocar 'codify-watchlist' por
// 'monitor-page' na evidência.
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

  // Evidência vinculada com aviso explícito de que não há detecção ativa.
  saveEvidence(ctx, {
    sector,
    action: 'codify-watchlist',
    evidenceLabel: `Watchlist Codify: ${ctx.title?.slice(0, 50) || ctx.url}`,
  });

  return w;
}

// ─── Função 8: Capturar trecho ──────────────────────────────────────────
// Captura texto selecionado (preferência) ou texto da página. Se ambos
// vazios, retorna null e o caller mostra feedback pedindo seleção —
// evita salvar evidência vazia inútil.
export function captureSnippet(
  ctx: BrowserActionContext,
  meta: { sector?: string; role?: string; selectedText?: string }
): BrowserEvidence | null {
  const selected = (meta.selectedText && meta.selectedText.trim()) || '';
  const pageText = (ctx.capturedText || '').trim();
  const snippetText = selected || pageText;

  // Nada útil pra salvar — caller decide o que mostrar.
  if (!snippetText) return null;

  const evCtx: BrowserActionContext = { ...ctx, capturedText: snippetText };
  return saveEvidence(evCtx, {
    sector: meta.sector,
    role: meta.role,
    action: 'capture-snippet',
    snippet: selected || undefined,        // só registra snippet se houve seleção real
    evidenceLabel: selected
      ? `Trecho: ${selected.slice(0, 50)}${selected.length > 50 ? '…' : ''}`
      : ctx.title?.slice(0, 60) || 'Trecho da página',
  });
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
export function addPageToDossier(dossierId: string, ctx: BrowserActionContext, sector?: string): BrowserDossier | null {
  const all = loadDossiers();
  const idx = all.findIndex(d => d.id === dossierId);
  if (idx < 0) return null;
  all[idx].pages.unshift({ url: ctx.url, title: ctx.title, addedAt: ctx.capturedAt });
  all[idx].updatedAt = new Date().toISOString();
  safeWrite(BROWSER_LS_KEYS.dossiers, all);

  // Vincula evidência ao dossiê (Etapa 8): cada página adicionada ao
  // dossiê cria/atualiza uma evidência com dossierId — fica rastreável.
  saveEvidence(ctx, {
    sector,
    action: 'create-dossier',
    dossierId,
    evidenceLabel: `Dossiê: ${all[idx].nome}`,
  });

  return all[idx];
}
// Default: cria/usa o dossiê do setor atual e adiciona a página
export function quickAddToSectorDossier(ctx: BrowserActionContext, sector?: string): BrowserDossier {
  const s = sector || 'geral';
  const cap = s.charAt(0).toUpperCase() + s.slice(1);
  const d = getOrCreateDossier(`Dossiê ${cap}`, cap);
  return addPageToDossier(d.id, ctx, sector) || d;
}

// ─── Síntese mínima do dossiê pra mostrar na Área de Trabalho ───────────
// Não cria nova entidade — agrega o estado atual do dossiê em um payload
// pra exibição. Tema central, pontos críticos e pendências são deduzidos
// das páginas via analyzePageContext.
export interface DossierSynthesis {
  dossier: BrowserDossier;
  temaCentral: string;
  pontosCriticos: string[];
  pendencias: string[];
  proximosPassos: string[];
}

export function buildDossierSynthesis(dossier: BrowserDossier, ctx: BrowserActionContext, sector?: string): DossierSynthesis {
  // Classifica todas as páginas do dossiê
  const tiposEncontrados = new Map<PageContextAnalysis['pageType'], number>();
  dossier.pages.forEach(p => {
    const a = analyzePageContext({ url: p.url, title: p.title, capturedText: '' });
    tiposEncontrados.set(a.pageType, (tiposEncontrados.get(a.pageType) || 0) + 1);
  });
  // Também classifica a página atual
  const ctxAnalysis = analyzePageContext(ctx);

  // Tema central = tipo mais frequente
  const tipoMaisFrequente = Array.from(tiposEncontrados.entries())
    .sort((x, y) => y[1] - x[1])[0]?.[0] || ctxAnalysis.pageType;
  const temaCentral = tipoMaisFrequente === 'genérico'
    ? `Acompanhamento contínuo no contexto analisado`
    : `Acompanhamento de ${tipoMaisFrequente} no contexto analisado`;

  // Pontos críticos = sinais detectados nas últimas 3 páginas + atuais
  const pontosCriticos: string[] = [];
  ctxAnalysis.signals.slice(0, 2).forEach(s => pontosCriticos.push(s));
  if (tiposEncontrados.get('regulatório')) pontosCriticos.push(`${tiposEncontrados.get('regulatório')} página(s) regulatória(s) no dossiê.`);
  if (tiposEncontrados.get('preço')) pontosCriticos.push(`${tiposEncontrados.get('preço')} sinal(is) de preço.`);
  if (tiposEncontrados.get('concorrente')) pontosCriticos.push(`${tiposEncontrados.get('concorrente')} sinal(is) competitivo(s).`);
  if (pontosCriticos.length === 0) pontosCriticos.push(`${dossier.pages.length} página(s) acumulada(s) — sem sinal crítico identificado ainda.`);

  // Pendências = faltas claras
  const pendencias: string[] = [];
  if (dossier.pages.length < 3) pendencias.push('Volume baixo — adicione mais páginas para fortalecer a síntese.');
  if (!dossier.notes) pendencias.push('Sem anotações livres no dossiê — registre conclusões à medida que avança.');
  if (tipoMaisFrequente === 'genérico') pendencias.push('Tipo central ainda indefinido — capture páginas mais específicas.');
  if (pendencias.length === 0) pendencias.push('Dossiê com volume suficiente. Pronto para virar evidência ou plano de ação.');

  // Próximos passos contextuais
  const proximosPassos: string[] = [];
  proximosPassos.push(`Revisar as ${Math.min(dossier.pages.length, 5)} página(s) mais recentes do dossiê.`);
  if (tipoMaisFrequente === 'regulatório') proximosPassos.push('Mapear obrigações e prazos identificados.');
  else if (tipoMaisFrequente === 'preço') proximosPassos.push('Comparar com oferta atual e decidir resposta.');
  else if (tipoMaisFrequente === 'concorrente') proximosPassos.push('Consolidar movimentos competitivos em diagnóstico.');
  proximosPassos.push('Preparar plano de ação se houver ação concreta a tomar.');

  return { dossier, temaCentral, pontosCriticos, pendencias, proximosPassos };
}

// ─── Função 10: Leitura contextual preliminar por setor ─────────────────
// NÃO é um agente de IA. É uma leitura heurística da página com base em
// regex sobre URL e texto, anotada com o ponto de vista declarado do setor.
// O texto de saída deixa explícito que é uma leitura preliminar.
export function buildSectorAgentAnswer(ctx: BrowserActionContext, sector?: string): BrowserSectorAgentAnswer {
  const setorLabel = sectorReaderLabel(sector);
  const a = analyzePageContext(ctx);

  const pergunta = `Leitura preliminar da página "${ctx.title || a.hostname}" sob o ponto de vista de ${setorLabel}.`;
  const analise = ctx.capturedText
    ? `Leitura preliminar de ${setorLabel} — a página foi classificada como ${a.pageType}${a.signals.length ? `, com sinais: ${a.signals.slice(0, 3).join(' · ')}` : ''}. Esta é uma leitura inicial baseada no conteúdo capturado, não uma análise de IA: revise e confirme antes de transformar em decisão.`
    : `Leitura preliminar de ${setorLabel} — pouco texto disponível na página. Capture um trecho ou navegue mais antes de fechar a análise.`;

  const obs: string[] = [];
  if (a.hostname) obs.push(`Origem da fonte: ${a.hostname}`);
  if (a.pageType !== 'genérico') obs.push(`Classificação automática: ${a.pageType}.`);
  a.signals.slice(0, 3).forEach(s => obs.push(s));

  const proximos = [
    'Salvar como evidência se for relevante',
    'Adicionar ao dossiê do setor',
    a.pageType === 'regulatório' ? 'Preparar plano de conformidade'
      : a.pageType === 'preço' ? 'Preparar plano comercial'
      : a.pageType === 'concorrente' ? 'Preparar plano competitivo'
      : 'Preparar plano de ação se precisar agir',
  ];
  const out: BrowserSectorAgentAnswer = {
    id: `ba-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    agente: `Leitura ${setorLabel}`,
    pergunta, analise,
    observacoes: obs,
    proximosPassos: proximos,
    capturedAt: new Date().toISOString(),
  };
  const all = loadAgentAnswers();
  all.unshift(out);
  safeWrite(BROWSER_LS_KEYS.agentAnswers, all.slice(0, 100));
  return out;
}
