// Builders das 10 ações do mapa OS¹.
//
// Cada `buildX`/`addX` constrói o objeto da ação e persiste no
// localStorage via `safeWrite`. Conteúdo movido de
// src/lib/map-actions.ts (Fase 15) byte-a-byte. Nenhum byte de texto,
// label, ID, formato ou ordem foi alterado.
//
// Funções:
//   - buildMapFeedCards          (F1)
//   - buildCompetitionAnalysis   (F2)
//   - buildOpportunities         (F3)
//   - buildComparison            (F4)
//   - buildMapMission            (F5)
//   - addTerritoryWatcher        (F6)
//   - buildRiskAnalysis          (F7)
//   - buildSectorOpportunities   (F8)
//   - buildNearbyPartners        (F9)
//   - buildTerritorySimulation   (F10)

import type { Competitor } from '../../../types';
import type {
  MapContextSnapshot, MapFeedCard, MapMission, MapCompetitionAnalysis,
  MapOpportunity, MapComparison, MapTerritoryWatcher, MapRiskAnalysis,
  MapSectorOpportunity, MapNearbyPartner, MapTerritorySimulation,
  MapTerritorialSignal, MapActionType,
} from '../../../core/types/map';
import { MAP_LS_KEYS } from './map-actions.catalog';
import { fmtKm, sectorVoice } from './map-actions.scoring';
import { safeRead, safeWrite, loadMapFeedCards } from './map-actions.storage';

// ─── Sinal territorial unificado (Etapa 9) ──────────────────────────────
// Registra cross-action o contexto territorial. Dedupe: mesma action +
// sector + raio + centro próximo (~10m) nas últimas 30 entries atualiza
// timestamp + flags em vez de criar nova.
//
// Distância em metros entre dois pontos (haversine simplificada — suficiente
// pra tolerância de centro).
function distanceMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371000;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const lat1 = a.lat * Math.PI / 180;
  const lat2 = b.lat * Math.PI / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

interface SaveSignalMeta {
  action: MapActionType | 'codify-territory-watchlist';
  signalType: MapTerritorialSignal['signalType'];
  summary: string;
  role?: string;
  regionLabel?: string;
  riskLevel?: 'alto' | 'medio' | 'baixo';
  opportunityLevel?: 'alta' | 'media' | 'baixa';
  usedInWorkspace?: boolean;
  usedInFeed?: boolean;
  missionId?: string;
}

export function saveTerritorialSignal(ctx: MapContextSnapshot, meta: SaveSignalMeta): MapTerritorialSignal {
  const all = safeRead<MapTerritorialSignal[]>(MAP_LS_KEYS.signals, []);

  // Dedupe: mesma action + sector + raio + centro próximo (~10m) nas últimas 30
  const dupIdx = all.slice(0, 30).findIndex(s =>
    s.action === meta.action &&
    s.sector === ctx.sector &&
    Math.abs(s.radius - ctx.radius) < 50 && // tolerância de 50m no raio
    distanceMeters(s.center, ctx.center) < 10
  );

  if (dupIdx >= 0) {
    const existing = all[dupIdx];
    const updated: MapTerritorialSignal = {
      ...existing,
      timestamp: new Date().toISOString(),
      usedInWorkspace: meta.usedInWorkspace ?? existing.usedInWorkspace,
      usedInFeed: meta.usedInFeed ?? existing.usedInFeed,
      missionId: meta.missionId ?? existing.missionId,
      summary: meta.summary || existing.summary,
    };
    all.splice(dupIdx, 1);
    all.unshift(updated);
    safeWrite(MAP_LS_KEYS.signals, all.slice(0, 200));
    return updated;
  }

  const a = ctx.analysis;
  const signal: MapTerritorialSignal = {
    id: `mts-sig-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    source: 'map',
    action: meta.action,
    sector: ctx.sector,
    role: meta.role,
    radius: isFinite(ctx.radius) ? ctx.radius : 0,
    center: ctx.center,
    regionLabel: meta.regionLabel,
    competitorsCount: a?.total ?? 0,
    competitorsUsed: ctx.competitorsInRadius.slice(0, 10).map(c => c.nome),
    averageRating: a?.avg ?? 0,
    strongCompetitors: a?.green ?? 0,
    weakCompetitors: a?.red ?? 0,
    directCompetitors: a?.diretos ?? 0,
    indirectCompetitors: a?.indiretos ?? 0,
    signalType: meta.signalType,
    summary: meta.summary,
    riskLevel: meta.riskLevel,
    opportunityLevel: meta.opportunityLevel,
    usedInWorkspace: meta.usedInWorkspace,
    usedInFeed: meta.usedInFeed,
    missionId: meta.missionId,
    timestamp: new Date().toISOString(),
  };
  all.unshift(signal);
  safeWrite(MAP_LS_KEYS.signals, all.slice(0, 200));
  return signal;
}

// ─── Função 1: Gerar feed do raio ────────────────────────────────────────
// `loadMapFeedCards` agora vive em ./map-actions.storage (importado acima).
export function buildMapFeedCards(ctx: MapContextSnapshot): MapFeedCard[] {
  const a = ctx.analysis;
  const radiusLabel = fmtKm(ctx.radius);
  const sector = ctx.sector || 'mercado';
  const ts = new Date().toISOString();
  const mk = (suffix: string, partial: Omit<MapFeedCard, 'id' | 'origem' | 'capturedAt' | 'raioMetros' | 'localizacao'>): MapFeedCard => ({
    id: `mfc-${Date.now()}-${suffix}-${Math.random().toString(36).slice(2, 6)}`,
    origem: 'mapa',
    capturedAt: ts,
    raioMetros: isFinite(ctx.radius) ? ctx.radius : 0,
    localizacao: ctx.center,
    ...partial,
  });

  const cards: MapFeedCard[] = [];
  const total = a?.total ?? 0;
  const avg = a?.avg ?? 0;

  // Card 1 — densidade concorrencial
  if (total >= 6) {
    cards.push(mk('1', {
      titulo: `Concorrência forte detectada dentro de ${radiusLabel}`,
      resumo: `${total} concorrentes mapeados no raio. Nota média ★ ${avg.toFixed(1)}. Densidade alta — monitorar movimento e diferencial.`,
      dominio: sector, risco: 'alto', oportunidade: 'média', urgencia: 'alta',
      acaoRecomendada: 'Mapear os 3 mais fortes e reforçar diferencial de oferta.',
    }));
  } else if (total <= 2) {
    cards.push(mk('1', {
      titulo: `Baixa concorrência em ${radiusLabel}`,
      resumo: `Apenas ${total} concorrente(s) registrados no raio. Janela curta de captura antes que outros cheguem.`,
      dominio: sector, risco: 'baixo', oportunidade: 'alta', urgencia: 'media',
      acaoRecomendada: 'Acelerar visibilidade local e ocupar posicionamento antes da disputa.',
    }));
  } else {
    cards.push(mk('1', {
      titulo: `Competição equilibrada em ${radiusLabel}`,
      resumo: `${total} concorrentes no raio com nota média ★ ${avg.toFixed(1)}. Disputa por reputação e proximidade.`,
      dominio: sector, risco: 'medio', oportunidade: 'média', urgencia: 'media',
      acaoRecomendada: 'Reforçar reputação local e investir em campanhas por proximidade.',
    }));
  }

  // Card 2 — reputação relativa
  if (a) {
    if (a.green >= a.red) {
      cards.push(mk('2', {
        titulo: 'Reputação local pode estar abaixo da média do raio',
        resumo: `${a.green} concorrentes com nota ≥ 4.3 nesta região. Pressão por consistência de atendimento.`,
        dominio: sector, risco: 'medio', oportunidade: 'média', urgencia: 'media',
        acaoRecomendada: 'Auditar avaliações recentes e responder as últimas críticas em 24h.',
      }));
    } else {
      cards.push(mk('2', {
        titulo: 'Reputação abaixo da média concentrada no raio',
        resumo: `${a.red} concorrentes com nota < 4.0. Espaço claro pra diferenciar por qualidade percebida.`,
        dominio: sector, risco: 'baixo', oportunidade: 'alta', urgencia: 'media',
        acaoRecomendada: 'Estimular avaliações positivas e visibilidade do diferencial.',
      }));
    }
  }

  // Card 3 — campanha local (só entra quando há densidade que justifica)
  if (total >= 4) {
    cards.push(mk('3', {
      titulo: `Densidade no raio favorece campanha por proximidade`,
      resumo: `${total} concorrentes no raio de ${radiusLabel} — público regional comprovado. Ativação geográfica tende a ter CAC menor.`,
      dominio: sector, risco: 'baixo', oportunidade: 'alta', urgencia: 'baixa',
      acaoRecomendada: 'Testar campanha por proximidade com mensagem regional por 7 dias.',
    }));
  }

  // Card 4 — fornecedor/parceiro (só entra se há indiretos no raio)
  if (a && a.indiretos >= 2) {
    cards.push(mk('4', {
      titulo: `${a.indiretos} possível(is) parceiro(s) indireto(s) no raio`,
      resumo: `${a.indiretos} concorrente(s) de categoria adjacente em ${radiusLabel}. Candidatos naturais a bundling, cross-promo ou parceria operacional.`,
      dominio: sector, risco: 'baixo', oportunidade: 'média', urgencia: 'baixa',
      acaoRecomendada: 'Mapear 3 candidatos e cotar tipo de parceria.',
    }));
  }

  // Card 5 — expansão / presença
  if (total <= 4) {
    cards.push(mk('5', {
      titulo: `Área com potencial de expansão no raio de ${radiusLabel}`,
      resumo: `Baixa saturação: ${total} concorrente(s) mapeado(s). Avaliar ponto, demanda demográfica e fluxo antes de decidir.`,
      dominio: sector, risco: 'medio', oportunidade: 'alta', urgencia: 'media',
      acaoRecomendada: 'Estudar viabilidade de unidade ou presença comercial nesta área.',
    }));
  }

  // Card 6 — brecha por reputação (só se a barra está alta E ainda há nota baixa)
  if (a && a.avg >= 4.2 && a.red >= 2) {
    cards.push(mk('6', {
      titulo: `Brecha de qualidade em região exigente`,
      resumo: `Nota média ★ ${a.avg.toFixed(1)} no raio, mas ${a.red} concorrente(s) ainda com nota < 4.0 — espaço para se posicionar pela experiência.`,
      dominio: sector, risco: 'baixo', oportunidade: 'alta', urgencia: 'media',
      acaoRecomendada: 'Mapear queixas dos concorrentes fracos e desenhar diferenciação por qualidade percebida.',
    }));
  }

  // Etapa 9 + 11: registra sinal territorial primeiro pra ter o ID
  // disponível pra vincular em cada card.
  const riscoSig: 'alto' | 'medio' | 'baixo' = total >= 6 ? 'alto' : total <= 2 ? 'baixo' : 'medio';
  const oportSig: 'alta' | 'media' | 'baixa' = total <= 4 ? 'alta' : total <= 6 ? 'media' : 'baixa';
  const signal = saveTerritorialSignal(ctx, {
    action: 'feed-from-radius',
    signalType: 'feed',
    summary: `${cards.length} card(s) territoriais gerados no raio de ${radiusLabel}. ${total} concorrente(s) considerados.`,
    riskLevel: riscoSig,
    opportunityLevel: oportSig,
    usedInFeed: true,
  });

  // Etapa 11: cada card recebe mapSignalId + competitorsCount + sourceLabel
  const sourceLabel = `Raio ${radiusLabel} · ${total} concorrente(s)`;
  const cardsEnriched: MapFeedCard[] = cards.map(c => ({
    ...c,
    mapSignalId: signal.id,
    competitorsCount: total,
    sourceLabel,
    deduped: false,
  }));

  // Dedupe (Etapa 11): mesma feed-from-radius + sector + raio + centro
  // próximo nas últimas 30 entries (signal já foi deduplicado via
  // saveTerritorialSignal). Marca os cards como deduped pra UI mostrar
  // toast adequado, mas sempre injeta os cards atualizados.
  const all = loadMapFeedCards();
  const isDedup = signal.timestamp !== new Date().toISOString() && all.some(c => c.mapSignalId === signal.id);
  if (isDedup) {
    cardsEnriched.forEach(c => (c.deduped = true));
  }
  all.unshift(...cardsEnriched);
  safeWrite(MAP_LS_KEYS.generatedCards, all.slice(0, 200));

  return cardsEnriched;
}
// ─── Função 2: Analisar concorrência local ───────────────────────────────
export function buildCompetitionAnalysis(ctx: MapContextSnapshot): MapCompetitionAnalysis {
  const a = ctx.analysis;
  const list = ctx.competitorsInRadius;
  const proximos = list.slice(0, 3).map(c => `${c.nome} (★ ${Number(c.nota_google).toFixed(1)})`);
  const fortes = [...list]
    .sort((x, y) => Number(y.nota_google) - Number(x.nota_google))
    .slice(0, 3)
    .map(c => `${c.nome} (★ ${Number(c.nota_google).toFixed(1)})`);
  const riscos: string[] = [];
  if (a && a.green >= 3) riscos.push(`${a.green} concorrentes com reputação ≥ 4.3 no raio`);
  if (a && a.diretos >= 4) riscos.push(`${a.diretos} concorrentes diretos — disputa concentrada`);
  if (a && a.avg >= 4.2) riscos.push(`Nota média alta (★ ${a.avg.toFixed(1)}) — barra de qualidade elevada`);
  if (riscos.length === 0) riscos.push('Sem riscos concentrados detectados no raio.');

  const brechas: string[] = [];
  if (a && a.red >= 2) brechas.push(`${a.red} concorrentes com nota < 4.0 — espaço por qualidade`);
  if (a && a.indiretos >= 2) brechas.push(`${a.indiretos} concorrentes indiretos — possível bundling de oferta`);
  if (ctx.totalAvailable - (a?.total ?? 0) > 0) brechas.push(`${ctx.totalAvailable - (a?.total ?? 0)} concorrentes fora do raio — território além ainda sub-mapeado`);
  if (brechas.length === 0) brechas.push('Avaliar diferenciais não cobertos no raio (oferta, atendimento, conveniência).');

  const v = sectorVoice(ctx.sector);
  const recomendacao = `Para ${v.audience}: reforçar reputação local, revisar campanhas por raio e comparar oferta com os 3 principais concorrentes. ${v.emphasis} aplicada ao raio de ${fmtKm(ctx.radius)}.`;
  const resumo = a
    ? `Dentro de ${fmtKm(ctx.radius)} há ${a.total} concorrentes (★ médio ${a.avg.toFixed(1)}, ${a.green} fortes, ${a.red} fracos). ${riscos[0]}.`
    : `Sem concorrentes mapeados no raio de ${fmtKm(ctx.radius)}.`;

  const r: MapCompetitionAnalysis = {
    id: `mca-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    resumo, concorrentesProximos: proximos, concorrentesMaisFortes: fortes,
    riscos, brechas, recomendacao, capturedAt: new Date().toISOString(),
  };
  const all = safeRead<MapCompetitionAnalysis[]>(MAP_LS_KEYS.analyses, []);
  all.unshift(r);
  safeWrite(MAP_LS_KEYS.analyses, all.slice(0, 100));

  // Etapa 9: sinal territorial — análise vai pra workspace.
  const riscoSig: 'alto' | 'medio' | 'baixo' = riscos.length >= 2 ? 'alto' : riscos.length === 1 ? 'medio' : 'baixo';
  saveTerritorialSignal(ctx, {
    action: 'analyze-competition',
    signalType: 'concorrencia',
    summary: resumo,
    riskLevel: riscoSig,
    usedInWorkspace: true,
  });

  return r;
}

// ─── Função 3: Encontrar oportunidades no território ─────────────────────
// Cada oportunidade só entra quando há gatilho real (densidade, reputação,
// categoria, posição, etc.). Cada uma traz justificativa e prioridade
// pra evitar lista plana de frases.
export function buildOpportunities(ctx: MapContextSnapshot): MapOpportunity {
  const a = ctx.analysis;
  const radiusLabel = fmtKm(ctx.radius);
  const v = sectorVoice(ctx.sector);
  const sector = ctx.sector || 'mercado';

  const detalhadas: NonNullable<MapOpportunity['oportunidadesDetalhadas']> = [];

  // 1. Baixa concorrência local
  if (a && a.total <= 3) {
    detalhadas.push({
      titulo: `Captura precoce em região de baixa concorrência`,
      justificativa: `Apenas ${a.total} concorrente(s) mapeado(s) no raio de ${radiusLabel}. Janela curta antes da chegada de novos players.`,
      prioridade: 'alta',
    });
  }

  // 2. Brecha por reputação
  if (a && a.red >= 2) {
    detalhadas.push({
      titulo: `Diferenciação por qualidade percebida`,
      justificativa: `${a.red} concorrente(s) com nota < 4.0 no raio — espaço claro para se posicionar pela experiência.`,
      prioridade: 'alta',
    });
  }

  // 3. Cobertura ampla além do raio (potencial de expansão real)
  if (a && ctx.totalAvailable - a.total > 3) {
    detalhadas.push({
      titulo: `Expansão de presença além do raio atual`,
      justificativa: `${ctx.totalAvailable - a.total} concorrente(s) fora do raio. Borda externa com presença esparsa — território de avanço comercial.`,
      prioridade: 'media',
    });
  }

  // 4. Parceiros indiretos no raio
  if (a && a.indiretos >= 2) {
    detalhadas.push({
      titulo: `Bundling com concorrentes indiretos`,
      justificativa: `${a.indiretos} concorrente(s) indireto(s) no raio. Categoria adjacente — espaço para cross-promo ou bundling.`,
      prioridade: 'media',
    });
  }

  // 5. Campanha por proximidade (entra se há densidade que justifica)
  if (a && a.total >= 3) {
    detalhadas.push({
      titulo: `Campanha por proximidade`,
      justificativa: `${a.total} concorrentes no raio — público regional comprovado. Ativação geográfica tem CAC menor do que aquisição ampla.`,
      prioridade: 'media',
    });
  }

  // 6. Captação por nota elevada do raio (mostra que clientes valorizam qualidade)
  if (a && a.avg >= 4.3 && a.green >= 2) {
    detalhadas.push({
      titulo: `Aproveitar barra de qualidade elevada da região`,
      justificativa: `Nota média ★ ${a.avg.toFixed(1)} no raio. Clientes locais valorizam reputação — investimento em avaliações e atendimento tem retorno alto.`,
      prioridade: 'media',
    });
  }

  // 7. Reforço operacional em raio amplo sem competidor direto
  if (a && a.diretos === 0 && a.total >= 1) {
    detalhadas.push({
      titulo: `Posicionamento como referência direta na região`,
      justificativa: `Nenhum concorrente direto no raio — espaço para se estabelecer como opção principal do território.`,
      prioridade: 'alta',
    });
  }

  // Fallback genérico apenas se NADA bateu — não entra "campanha local" como default
  if (detalhadas.length === 0) {
    detalhadas.push({
      titulo: `Levantar sinais comerciais no raio`,
      justificativa: `Raio de ${radiusLabel} com perfil indefinido — capturar evidências de demanda antes de investir.`,
      prioridade: 'baixa',
    });
  }

  // Ordena por prioridade
  const ordem = { alta: 0, media: 1, baixa: 2 };
  detalhadas.sort((x, y) => ordem[x.prioridade] - ordem[y.prioridade]);

  const ops = detalhadas.map(d => d.titulo);

  // Ação recomendada depende da prioridade mais alta encontrada
  const principal = detalhadas[0];
  const acaoRecomendada = principal.prioridade === 'alta'
    ? `Priorizar "${principal.titulo}" — ${v.audience} executa em 7 dias e mede impacto.`
    : `Mapear viabilidade das ${detalhadas.length} oportunidade(s) antes de comprometer recursos.`;

  const resumo = detalhadas.length === 1
    ? `1 oportunidade identificada para ${sector} no raio de ${radiusLabel}.`
    : `${detalhadas.length} oportunidades identificadas para ${sector} no raio de ${radiusLabel} — ordenadas por prioridade.`;

  const r: MapOpportunity = {
    id: `mop-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    oportunidades: ops,
    oportunidadesDetalhadas: detalhadas,
    acaoRecomendada,
    resumo,
    capturedAt: new Date().toISOString(),
  };
  const all = safeRead<MapOpportunity[]>(MAP_LS_KEYS.opportunities, []);
  all.unshift(r);
  safeWrite(MAP_LS_KEYS.opportunities, all.slice(0, 100));

  // Etapa 9: sinal territorial vinculado.
  const oportSig: 'alta' | 'media' | 'baixa' = principal.prioridade;
  saveTerritorialSignal(ctx, {
    action: 'find-opportunities',
    signalType: 'oportunidade',
    summary: resumo,
    opportunityLevel: oportSig,
    usedInWorkspace: true,
  });

  return r;
}

// ─── Função 4: Comparar regiões (raio menor vs maior) ────────────────────
export function buildComparison(ctx: MapContextSnapshot, altCompetitorsByDistance: { meters: number; competitor: Competitor }[]): MapComparison {
  const r = ctx.radius;
  // Região A: raio atual. Região B: metade do raio (zoom-in) ou 2x (zoom-out) se raio for muito pequeno.
  const altRadius = r <= 1000 ? r * 2 : r / 2;
  const altList = altCompetitorsByDistance.filter(x => x.meters <= altRadius).map(x => x.competitor);
  const aA = ctx.analysis;
  const totalA = aA?.total ?? 0;
  const avgA = aA?.avg ?? 0;
  const totalB = altList.length;
  const avgB = totalB ? altList.reduce((s, c) => s + Number(c.nota_google), 0) / totalB : 0;
  const densidade = (n: number, raio: number) => {
    if (!isFinite(raio) || raio === 0) return 'nacional';
    if (n === 0) return 'nula';
    const km = raio / 1000;
    const ratio = n / km;
    if (ratio > 4) return 'alta';
    if (ratio > 1.5) return 'média';
    return 'baixa';
  };
  const labelA = `Raio ${fmtKm(r)}`;
  const labelB = `Raio ${fmtKm(altRadius)}`;
  const recomendacao = totalA > totalB
    ? `${labelB} tem menor competição e pode ser melhor para campanha de aquisição focada ou ponto de teste.`
    : `${labelA} tem maior potencial de demanda agregada mas exige mais disputa por visibilidade.`;
  const resumo = `Comparando ${labelA} (${totalA} concorrentes, ★ ${avgA.toFixed(1)}) vs ${labelB} (${totalB}, ★ ${avgB.toFixed(1)}). ${recomendacao}`;

  const out: MapComparison = {
    id: `mcp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    regiaoA: { label: labelA, total: totalA, avg: avgA, densidade: densidade(totalA, r) },
    regiaoB: { label: labelB, total: totalB, avg: avgB, densidade: densidade(totalB, altRadius) },
    recomendacao, resumo,
    capturedAt: new Date().toISOString(),
  };
  const all = safeRead<MapComparison[]>(MAP_LS_KEYS.comparisons, []);
  all.unshift(out);
  safeWrite(MAP_LS_KEYS.comparisons, all.slice(0, 50));

  // Etapa 9: sinal territorial — comparação vai pra workspace.
  saveTerritorialSignal(ctx, {
    action: 'compare-regions',
    signalType: 'comparacao',
    summary: resumo,
    usedInWorkspace: true,
  });

  return out;
}

// ─── Função 5: Transformar território em missão ──────────────────────────
export function buildMapMission(ctx: MapContextSnapshot): MapMission {
  const a = ctx.analysis;
  const radiusLabel = fmtKm(ctx.radius);
  const v = sectorVoice(ctx.sector);
  const titulo = `Reforçar presença local no raio de ${radiusLabel}`;
  const objetivo = `Melhorar presença, reputação e ação comercial na região selecionada (${ctx.center.lat.toFixed(3)}, ${ctx.center.lng.toFixed(3)}).`;
  const contextoTerritorial = a
    ? `Raio de ${radiusLabel} com ${a.total} concorrentes (★ médio ${a.avg.toFixed(1)}). ${a.green} fortes / ${a.red} fracos. ${a.diretos} diretos / ${a.indiretos} indiretos.`
    : `Raio de ${radiusLabel} sem concorrentes mapeados.`;
  const etapas = [
    'Mapear os 3 concorrentes mais fortes do raio',
    'Revisar reputação local nas últimas 30 avaliações',
    `Criar campanha por raio com mensagem ${v.emphasis}`,
    'Definir oferta ou mensagem regional',
    'Medir resposta em 7 dias e ajustar',
  ];
  const evidencias = (ctx.competitorsInRadius.slice(0, 5).map(c => `${c.nome} — ${c.endereco || c.cidade}`));

  // Métrica de sucesso contextual: muda conforme reputação, densidade e
  // categoria do raio. Evita o "+20% em 7 dias" fixo.
  let metricaSucesso: string;
  if (a && a.green >= 3 && a.avg >= 4.3) {
    metricaSucesso = `+0.1 em nota média e +15% em interações regionais em 7 dias (barra de qualidade alta).`;
  } else if (a && a.red >= 2) {
    metricaSucesso = `Pelo menos 5 novas avaliações positivas e captação de 2 clientes que vinham de concorrente com nota < 4.0.`;
  } else if (a && a.indiretos >= 2) {
    metricaSucesso = `1 parceria piloto fechada com candidato indireto do raio em 7 dias.`;
  } else if (a && a.total <= 3) {
    metricaSucesso = `+30% em interações regionais ou primeira referência espontânea no raio em 14 dias.`;
  } else {
    metricaSucesso = `+20% em interações regionais ou +0.1 em nota média em 7 dias.`;
  }

  const m: MapMission = {
    id: `mms-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    titulo, objetivo, contextoTerritorial, etapas,
    responsavelSugerido: v.audience,
    prazoSugerido: '7 dias',
    evidencias,
    metricaSucesso,
    criterioConclusao: 'Campanha publicada, concorrentes mapeados e métrica inicial registrada.',
    capturedAt: new Date().toISOString(),
  };
  const all = safeRead<MapMission[]>(MAP_LS_KEYS.missions, []);
  all.unshift(m);
  safeWrite(MAP_LS_KEYS.missions, all.slice(0, 200));

  // Etapa 9: sinal territorial vinculado à missão (missionId preenchido).
  // C1-A: signalType canônico atual é 'rascunho'; o type union em map.ts
  // mantém 'missao' como leitura legada por 1 release. Cards/sinais novos
  // saem como 'rascunho'.
  saveTerritorialSignal(ctx, {
    action: 'territory-to-mission',
    signalType: 'rascunho',
    summary: `Missão "${titulo}" criada a partir do território.`,
    usedInWorkspace: true,
    missionId: m.id,
  });

  return m;
}
// ─── F6: Acompanhar território (Codify watchlist) ───────────────────────
// AVISO: hoje só registra o território numa lista. NÃO há mecanismo de
// detecção automática. Visível só pra Codify. Quando houver polling
// real, trocar 'codify-territory-watchlist' por 'monitor-territory'.
export function addTerritoryWatcher(ctx: MapContextSnapshot): MapTerritoryWatcher {
  const w: MapTerritoryWatcher = {
    id: `mtw-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    center: ctx.center,
    radius: isFinite(ctx.radius) ? ctx.radius : 0,
    sector: ctx.sector,
    watchTypes: ['novos concorrentes', 'reputação', 'fornecedor próximo', 'oportunidade regional'],
    createdAt: new Date().toISOString(),
  };
  const all = safeRead<MapTerritoryWatcher[]>(MAP_LS_KEYS.watchers, []);
  all.unshift(w);
  safeWrite(MAP_LS_KEYS.watchers, all.slice(0, 50));

  // Sinal territorial com aviso explícito de que não há detecção ativa.
  saveTerritorialSignal(ctx, {
    action: 'codify-territory-watchlist',
    signalType: 'watchlist',
    summary: 'Território registrado na watchlist Codify para revisão manual. Não há monitoramento automático ativo — a lista serve como referência interna, não como alerta em tempo real.',
  });

  return w;
}

// ─── F7: Mapa de risco ───────────────────────────────────────────────────
export function buildRiskAnalysis(ctx: MapContextSnapshot): MapRiskAnalysis {
  const a = ctx.analysis;
  const riscos: MapRiskAnalysis['riscos'] = [];
  if (a && a.total >= 6) riscos.push({ tipo: 'concorrência forte', nivel: 'alto', descricao: `${a.total} concorrentes no raio de ${fmtKm(ctx.radius)}.` });
  if (a && a.green >= 3) riscos.push({ tipo: 'barra de reputação alta', nivel: 'medio', descricao: `${a.green} concorrentes com nota ≥ 4.3 — pressão por consistência.` });
  if (a && a.red >= 3) riscos.push({ tipo: 'reputação local baixa', nivel: 'medio', descricao: `${a.red} concorrentes com nota < 4.0 — risco de contaminação da percepção regional.` });
  if (a && a.diretos >= 4) riscos.push({ tipo: 'saturação direta', nivel: 'alto', descricao: `${a.diretos} concorrentes diretos — disputa concentrada.` });
  if (ctx.totalAvailable - (a?.total ?? 0) <= 0 && isFinite(ctx.radius)) riscos.push({ tipo: 'cobertura limitada', nivel: 'baixo', descricao: `Raio cobre todo o universo mapeado — pode haver gap de dados além.` });
  if (!isFinite(ctx.radius)) riscos.push({ tipo: 'distância operacional', nivel: 'medio', descricao: 'Sem limite de raio — operação dispersa nacional.' });
  if (riscos.length === 0) riscos.push({ tipo: 'sem riscos concentrados', nivel: 'baixo', descricao: 'Território com baixa pressão competitiva no raio atual.' });

  const v = sectorVoice(ctx.sector);
  const altosCountTxt = riscos.filter(x => x.nivel === 'alto').length;
  const mediosCountTxt = riscos.filter(x => x.nivel === 'medio').length;
  // Resumo mais "decisão territorial" do que lista mecânica
  let resumoTxt: string;
  if (altosCountTxt >= 2) {
    resumoTxt = `Território no raio de ${fmtKm(ctx.radius)} tem pressão competitiva acima da média: ${altosCountTxt} risco(s) alto(s) + ${mediosCountTxt} médio(s) a tratar antes da próxima decisão local.`;
  } else if (altosCountTxt === 1) {
    resumoTxt = `Território no raio de ${fmtKm(ctx.radius)} tem 1 risco alto a tratar e ${mediosCountTxt} médio(s) em acompanhamento.`;
  } else if (mediosCountTxt > 0) {
    resumoTxt = `Território no raio de ${fmtKm(ctx.radius)} sem risco alto, mas com ${mediosCountTxt} risco(s) médio(s) para monitorar.`;
  } else {
    resumoTxt = `Território no raio de ${fmtKm(ctx.radius)} com baixa pressão competitiva — espaço para ação sem urgência crítica.`;
  }
  const recomendacaoTxt = altosCountTxt > 0
    ? `${v.audience} prioriza mitigação dos ${altosCountTxt} risco(s) alto(s) em 48-72h. Riscos médios entram em ciclo semanal.`
    : mediosCountTxt > 0
      ? `${v.audience} mantém os riscos médios em ciclo semanal. Reabrir avaliação se densidade ou reputação mudar.`
      : `${v.audience} pode avançar com a ação principal — território aberto para iniciativa.`;
  const r: MapRiskAnalysis = {
    id: `mr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    riscos,
    resumo: resumoTxt,
    recomendacao: recomendacaoTxt,
    capturedAt: new Date().toISOString(),
  };
  const all = safeRead<MapRiskAnalysis[]>(MAP_LS_KEYS.risks, []);
  all.unshift(r);
  safeWrite(MAP_LS_KEYS.risks, all.slice(0, 100));

  // Etapa 9: sinal territorial com nível de risco derivado.
  const altosCount = riscos.filter(x => x.nivel === 'alto').length;
  const riscoSig: 'alto' | 'medio' | 'baixo' = altosCount > 0 ? 'alto' : riscos.some(x => x.nivel === 'medio') ? 'medio' : 'baixo';
  saveTerritorialSignal(ctx, {
    action: 'risk-map',
    signalType: 'risco',
    summary: r.resumo,
    riskLevel: riscoSig,
    usedInWorkspace: true,
  });

  return r;
}

// ─── F8: Oportunidades por setor ─────────────────────────────────────────
// Cada perfil de setor (mcdonalds, natura, tesla, etc.) tem um conjunto
// próprio de oportunidades territoriais. Antes a heurística era por
// palavra-chave ("marketing", "vendas") e quase tudo caía no fallback —
// agora o mapping bate diretamente com os IDs de setor usados no app.
interface SectorOpProfile {
  oportunidades: (radiusLabel: string) => { tipo: string; descricao: string; prioridade: 'alta' | 'media' | 'baixa' }[];
}

const SECTOR_PROFILES: Record<string, SectorOpProfile> = {
  // Alimentação / Delivery / Restaurantes
  mcdonalds: { oportunidades: (r) => [
    { tipo: 'fluxo regional',          descricao: `Avaliar movimento dentro de ${r} para hora de pico e cardápio regional.`,                  prioridade: 'alta' },
    { tipo: 'delivery próprio',        descricao: `Concentrar promoção de delivery no raio de ${r} — reduz dependência de marketplace.`,      prioridade: 'alta' },
    { tipo: 'parcerias hiperlocais',   descricao: `Eventos, escolas e empresas no raio — combo dedicado para canal direto.`,                  prioridade: 'media' },
    { tipo: 'reputação local',         descricao: `Resposta a avaliações nas últimas 30 unidades do raio aumenta visibilidade orgânica.`,     prioridade: 'media' },
  ] },
  ifood: { oportunidades: (r) => [
    { tipo: 'parceria com restaurantes', descricao: `Captação de novos parceiros no raio de ${r} — categoria menos saturada.`,                prioridade: 'alta' },
    { tipo: 'promo por região',          descricao: `Campanha de cupom restrita ao raio para ativar pedidos no horário ocioso.`,              prioridade: 'media' },
    { tipo: 'logística regional',        descricao: `Otimizar entregador disponível no raio reduz tempo médio e churn.`,                      prioridade: 'media' },
  ] },

  // Beleza / Cosmético / Varejo
  natura: { oportunidades: (r) => [
    { tipo: 'rede de consultoras',     descricao: `Captar e ativar consultoras dentro do raio de ${r} para presença porta-a-porta.`,          prioridade: 'alta' },
    { tipo: 'ponto físico regional',   descricao: `Avaliar abertura de balcão de relacionamento na área com maior densidade do raio.`,        prioridade: 'media' },
    { tipo: 'parceria com salões',     descricao: `Salões e clínicas estéticas no raio são pontos naturais de revenda e demonstração.`,       prioridade: 'media' },
    { tipo: 'campanha sazonal',        descricao: `Datas comemorativas com ativação regional dentro do raio têm conversão maior.`,            prioridade: 'baixa' },
  ] },

  // Mobilidade
  tesla: { oportunidades: (r) => [
    { tipo: 'pontos de recarga',       descricao: `Mapear pontos críticos dentro do raio de ${r} para infraestrutura de carga.`,              prioridade: 'alta' },
    { tipo: 'test-drive itinerante',   descricao: `Eventos de experiência no raio aumentam consideração em mercado novo.`,                    prioridade: 'media' },
    { tipo: 'serviço pós-venda',       descricao: `Cobertura de assistência técnica no raio reduz fricção pós-compra.`,                       prioridade: 'media' },
  ] },
  uber: { oportunidades: (r) => [
    { tipo: 'oferta por demanda',      descricao: `Surge inteligente em horários ociosos do raio de ${r} captura demanda latente.`,           prioridade: 'alta' },
    { tipo: 'verticais novas',         descricao: `Mercearia, farmácia, pet — categorias adjacentes pouco saturadas no raio.`,                prioridade: 'media' },
    { tipo: 'pontos de retirada',      descricao: `Pontos físicos de retirada no raio aceleram entregas e reduzem cancelamento.`,             prioridade: 'media' },
  ] },

  // Saúde / Farmácia
  nubank: { oportunidades: (r) => [
    { tipo: 'cobertura regional',      descricao: `Pontos no raio de ${r} com nota baixa são alvos prioritários de migração.`,                prioridade: 'alta' },
    { tipo: 'farmácia popular',        descricao: `Programa farmácia popular não está em todos os pontos do raio — oportunidade.`,            prioridade: 'media' },
    { tipo: 'serviços ampliados',      descricao: `Vacinas, aplicação, teste — diferencial nas farmácias do raio com nota alta.`,             prioridade: 'media' },
    { tipo: 'parceria com clínicas',   descricao: `Clínicas no raio para fluxo de receitas e fidelização.`,                                   prioridade: 'baixa' },
  ] },

  // Calçados / Moda
  nike: { oportunidades: (r) => [
    { tipo: 'experiência regional',    descricao: `Ativação esportiva (corrida, futebol) no raio gera engajamento e captura clientela.`,      prioridade: 'alta' },
    { tipo: 'pontos de revenda',       descricao: `Lojas multimarca no raio são canais naturais — avaliar relação atual.`,                    prioridade: 'media' },
    { tipo: 'campanha sazonal',        descricao: `Volta às aulas, Black Friday — datas com ativação regional dentro do raio.`,               prioridade: 'media' },
  ] },

  // Bebidas / FMCG
  ambev: { oportunidades: (r) => [
    { tipo: 'cobertura de bar',        descricao: `Bares e restaurantes no raio sem cobertura direta — captação prioritária.`,                prioridade: 'alta' },
    { tipo: 'rota de distribuição',    descricao: `Otimização da rota dentro do raio reduz custo e tempo de reposição.`,                      prioridade: 'media' },
    { tipo: 'parceria sazonal',        descricao: `Eventos regionais (carnaval, festa) no raio com presença de marca.`,                       prioridade: 'media' },
  ] },

  // Varejo / E-commerce
  magalu:  { oportunidades: (r) => [
    { tipo: 'parceiro Magalu',         descricao: `Captação de pequenos varejistas no raio de ${r} para marketplace.`,                        prioridade: 'alta' },
    { tipo: 'ponto físico',            descricao: `Avaliar densidade do raio para abertura ou reforço de loja.`,                              prioridade: 'media' },
    { tipo: 'logística regional',      descricao: `Hub no raio acelera entrega Same Day e reduz frete.`,                                      prioridade: 'media' },
  ] },
  amazon: { oportunidades: (r) => [
    { tipo: 'lojas de entrega',        descricao: `Pontos de retirada no raio de ${r} aumentam alcance sem CapEx pesado.`,                    prioridade: 'alta' },
    { tipo: 'AWS regional',            descricao: `Empresas no raio são alvo de prospecção AWS — vendedores locais relevantes.`,              prioridade: 'media' },
    { tipo: 'parceria com lojas',      descricao: `Pequenos varejistas no raio são vendedores potenciais do marketplace.`,                    prioridade: 'media' },
  ] },

  // Aeronáutica / Defesa
  embraer: { oportunidades: (r) => [
    { tipo: 'fornecedores locais',     descricao: `Cadeia de suprimentos dentro do raio reduz prazo e custo logístico.`,                      prioridade: 'alta' },
    { tipo: 'parceria acadêmica',      descricao: `Universidades e centros de pesquisa no raio para P&D.`,                                    prioridade: 'media' },
    { tipo: 'serviço regional',        descricao: `Cobertura de serviço técnico no raio é diferencial vs concorrente global.`,                prioridade: 'media' },
  ] },

  // Streaming / Música
  netflix: { oportunidades: (r) => [
    { tipo: 'parceria com operadora',  descricao: `Bundle com operadora regional do raio amplia base sem CAC.`,                               prioridade: 'alta' },
    { tipo: 'conteúdo local',          descricao: `Conteúdo regional gera engajamento desproporcional na região de origem.`,                  prioridade: 'media' },
  ] },
  spotify: { oportunidades: (r) => [
    { tipo: 'parceria sonora',         descricao: `Eventos e bares no raio são pontos de descoberta musical — branded audio.`,                prioridade: 'alta' },
    { tipo: 'curadoria regional',      descricao: `Playlist regional captura audiência segmentada e melhora retenção.`,                       prioridade: 'media' },
  ] },

  // Viagem / Hospitalidade
  airbnb: { oportunidades: (r) => [
    { tipo: 'captação de host',        descricao: `Áreas do raio com baixa oferta — captação tem retorno alto.`,                              prioridade: 'alta' },
    { tipo: 'experiências locais',     descricao: `Anfitriões de experiência no raio diversificam receita.`,                                  prioridade: 'media' },
  ] },

  // Eletrônicos
  apple: { oportunidades: (r) => [
    { tipo: 'autorizado regional',     descricao: `Reseller e serviço autorizado no raio de ${r} amplia cobertura sem loja própria.`,         prioridade: 'alta' },
    { tipo: 'experience pop-up',       descricao: `Ativação temporária no raio aproxima produto de público novo.`,                            prioridade: 'media' },
  ] },

  // OS¹ / Codify
  os1: { oportunidades: (r) => [
    { tipo: 'pilotos comerciais',      descricao: `Empresas no raio de ${r} com perfil de inovação — alvo natural pra piloto.`,               prioridade: 'alta' },
    { tipo: 'parceria com consultoria', descricao: `Consultorias regionais no raio aceleram adoção via canal.`,                               prioridade: 'media' },
    { tipo: 'comunidade local',        descricao: `Eventos de tecnologia/startup no raio para captação direta.`,                              prioridade: 'media' },
  ] },
  codify: { oportunidades: (r) => [
    { tipo: 'pilotos comerciais',      descricao: `Empresas no raio de ${r} com perfil de inovação — alvo natural pra piloto.`,               prioridade: 'alta' },
    { tipo: 'parceria com consultoria', descricao: `Consultorias regionais no raio aceleram adoção via canal.`,                               prioridade: 'media' },
    { tipo: 'comunidade local',        descricao: `Eventos de tecnologia/startup no raio para captação direta.`,                              prioridade: 'media' },
  ] },
};

export function buildSectorOpportunities(ctx: MapContextSnapshot): MapSectorOpportunity {
  const sectorKey = (ctx.sector || '').toLowerCase();
  const radiusLabel = fmtKm(ctx.radius);
  const profile = SECTOR_PROFILES[sectorKey];

  const ops: MapSectorOpportunity['oportunidades'] = profile
    ? profile.oportunidades(radiusLabel)
    : [
        { tipo: 'presença local',     descricao: `Reforço de visibilidade regional no raio de ${radiusLabel}.`,             prioridade: 'media' },
        { tipo: 'concorrência local', descricao: `Mapear movimento competitivo dentro do raio.`,                            prioridade: 'media' },
        { tipo: 'reputação',          descricao: `Resposta a avaliações dentro do raio aumenta consideração local.`,        prioridade: 'media' },
        { tipo: 'parcerias regionais', descricao: `Players complementares no raio para distribuição ou bundling.`,          prioridade: 'baixa' },
      ];

  // Ordena por prioridade
  const ordem = { alta: 0, media: 1, baixa: 2 };
  ops.sort((x, y) => ordem[x.prioridade] - ordem[y.prioridade]);

  const v = sectorVoice(ctx.sector);
  const altas = ops.filter(o => o.prioridade === 'alta').length;

  const r: MapSectorOpportunity = {
    id: `mso-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    sector: ctx.sector,
    oportunidades: ops,
    acaoRecomendada: altas > 0
      ? `Priorizar as ${altas} oportunidade(s) de alta prioridade. ${v.audience} executa em 7 dias e mede impacto.`
      : `${v.audience} valida ${ops.length} oportunidade(s) e seleciona uma para piloto de 14 dias.`,
    resumo: `${ops.length} oportunidade(s) específicas para ${ctx.sector || 'o setor atual'} no raio de ${radiusLabel}.`,
    capturedAt: new Date().toISOString(),
  };
  const all = safeRead<MapSectorOpportunity[]>(MAP_LS_KEYS.sectorOpportunities, []);
  all.unshift(r);
  safeWrite(MAP_LS_KEYS.sectorOpportunities, all.slice(0, 100));

  // Etapa 9: sinal territorial setorial.
  const oportSig: 'alta' | 'media' | 'baixa' = altas > 0 ? 'alta' : ops.some(o => o.prioridade === 'media') ? 'media' : 'baixa';
  saveTerritorialSignal(ctx, {
    action: 'sector-opportunities',
    signalType: 'sector-opportunity',
    summary: r.resumo,
    opportunityLevel: oportSig,
    usedInWorkspace: true,
  });

  return r;
}

// ─── F9: Parceiros/fornecedores próximos ─────────────────────────────────
// Critério amplo (não só categoria === 'indireto'):
//   1. categoria indireta → parceiro / cross-promo
//   2. categoria complementar → parceiro / bundling
//   3. nome contém "fornecedor"/"distribuidor"/"atacado" → fornecedor
//   4. nome contém "parceiro"/"agência"/"consultoria" → parceiro
//   5. categoria direta → marcado como concorrente-monitorar (não parceiro)
//   6. fallback: 3 primeiros do raio com observação de avaliação manual
//
// Concorrente direto NÃO aparece como parceiro sem aviso explícito.
export function buildNearbyPartners(ctx: MapContextSnapshot): MapNearbyPartner {
  const list = ctx.competitorsInRadius;
  const candidatos: MapNearbyPartner['candidatos'] = [];

  // Heurística por nome
  const isFornecedor = (nome: string) => /fornecedor|distribuidor|atacado|insumo|insumos|matéria/i.test(nome);
  const isParceiroLike = (nome: string) => /parceir|agência|agencia|consultoria|representante|revend/i.test(nome);
  const isComplementar = (cat?: string) => /complement/i.test(cat || '');
  const isIndireto = (cat?: string) => /indir/i.test(cat || '');
  const isDireto = (cat?: string) => /direto|directo/i.test(cat || '');

  for (const c of list) {
    const cat = (c as any).categoria as string | undefined;
    const distancia = c.cidade || 'no raio';

    if (isIndireto(cat)) {
      candidatos.push({
        nome: c.nome,
        tipo: 'parceiro',
        distancia,
        observacao: c.diferencial || c.proposta_principal || 'Categoria adjacente — espaço para cross-promo ou co-marketing.',
        parceriaSugerida: 'cross-promo ou bundling',
      });
      continue;
    }
    if (isComplementar(cat)) {
      candidatos.push({
        nome: c.nome,
        tipo: 'complementar',
        distancia,
        observacao: c.diferencial || c.proposta_principal || 'Negócio complementar — bundling natural.',
        parceriaSugerida: 'bundling de oferta',
      });
      continue;
    }
    if (isFornecedor(c.nome)) {
      candidatos.push({
        nome: c.nome,
        tipo: 'fornecedor',
        distancia,
        observacao: c.proposta_principal || 'Nome sugere fornecedor — avaliar capacidade e termos comerciais.',
        parceriaSugerida: 'fornecedor regional',
      });
      continue;
    }
    if (isParceiroLike(c.nome)) {
      candidatos.push({
        nome: c.nome,
        tipo: 'parceiro',
        distancia,
        observacao: c.proposta_principal || 'Nome sugere parceiro — avaliar tipo de relação possível.',
        parceriaSugerida: 'co-marketing ou canal',
      });
      continue;
    }
    if (isDireto(cat)) {
      // Concorrente direto: NÃO é parceiro natural — aviso explícito pro
      // texto da UI nunca tratar como candidato a parceria.
      candidatos.push({
        nome: c.nome,
        tipo: 'concorrente-monitorar',
        distancia,
        observacao: `⚠ Concorrente direto — NÃO é candidato a parceria. Marcado apenas para acompanhamento competitivo.`,
        parceriaSugerida: 'monitoramento competitivo (não parceria)',
      });
      continue;
    }
  }

  // Fallback: nenhum candidato identificado por critério — pega 3 primeiros
  // como "avaliar manualmente"
  if (candidatos.length === 0 && list.length > 0) {
    list.slice(0, 3).forEach(c => {
      candidatos.push({
        nome: c.nome,
        tipo: 'prestador',
        distancia: c.cidade || 'no raio',
        observacao: 'Categoria não classificada — avaliar manualmente potencial de parceria.',
      });
    });
  }

  // Limita a 5
  const finalList = candidatos.slice(0, 5);
  const parceirosReais = finalList.filter(c => c.tipo !== 'concorrente-monitorar').length;
  const concorrentes = finalList.filter(c => c.tipo === 'concorrente-monitorar').length;

  const r: MapNearbyPartner = {
    id: `mnp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    candidatos: finalList,
    recomendacao: parceirosReais > 0
      ? `Avalie os ${parceirosReais} candidato(s) elegível(is) a parceria antes de abordar — mapear capacidade, termos e tipo de relação possível.${concorrentes > 0 ? ` Os ${concorrentes} concorrente(s) direto(s) detectado(s) não são candidatos a parceria; ficam apenas em acompanhamento.` : ''}`
      : finalList.length > 0
        ? `Sem candidato direto a parceria no raio. ${concorrentes} concorrente(s) sinalizado(s) apenas para acompanhamento competitivo — não confundir com parceria possível.`
        : 'Sem candidatos detectados no raio. Aumentar raio ou trocar perfil de análise.',
    resumo: finalList.length
      ? `Raio de ${fmtKm(ctx.radius)} tem ${parceirosReais} candidato(s) elegível(is) a parceria${concorrentes > 0 ? ` e ${concorrentes} concorrente(s) direto(s) para acompanhamento (NÃO são parceiros)` : ''}.`
      : 'Sem candidatos detectados no raio.',
    capturedAt: new Date().toISOString(),
  };
  const all = safeRead<MapNearbyPartner[]>(MAP_LS_KEYS.nearbyPartners, []);
  all.unshift(r);
  safeWrite(MAP_LS_KEYS.nearbyPartners, all.slice(0, 100));

  // Etapa 9: sinal territorial de parceiros.
  saveTerritorialSignal(ctx, {
    action: 'nearby-partners',
    signalType: 'parceiros',
    summary: r.resumo,
    opportunityLevel: parceirosReais >= 2 ? 'media' : 'baixa',
    usedInWorkspace: true,
  });

  return r;
}

// ─── F10: Simular ação no território ─────────────────────────────────────
// Esta é uma ESTIMATIVA OPERACIONAL — não é previsão garantida. Os
// cenários (conservador/provável/agressivo) são derivados de fatores
// territoriais explícitos no campo `fundamento`. O `aviso` deixa claro
// que serve para comparar decisões, não para projetar resultado.
export function buildTerritorySimulation(ctx: MapContextSnapshot, acao?: string): MapTerritorySimulation {
  const radiusLabel = fmtKm(ctx.radius);
  const sector = ctx.sector || 'mercado';
  const a = ctx.analysis;
  const acaoFinal = acao || (a && a.total >= 6
    ? 'reforço de reputação local em 7 dias'
    : 'campanha local por 7 dias');

  // Cenários derivados de densidade. Mantém a heurística mas EXPÕE o
  // fundamento — cliente vê de onde saiu o número.
  const totalCompetidores = a?.total ?? 1;
  const notaMedia = a?.avg ?? 0;
  const greenCount = a?.green ?? 0;

  const baseDensidade = Math.max(50, totalCompetidores * 30);
  const conservador = Math.round(baseDensidade * 0.6);
  const provavel    = Math.round(baseDensidade * 1.0);
  const agressivo   = Math.round(baseDensidade * 1.8);

  const fundamento: string[] = [
    `Densidade no raio: ${totalCompetidores} concorrente(s) — base estimativa = ${baseDensidade}.`,
    `Reputação média do raio: ★ ${notaMedia.toFixed(1)} (${greenCount} com nota ≥ 4.3).`,
    `Conservador = base × 0.6 (concorrência neutraliza parte da mensagem).`,
    `Provável = base × 1.0 (resposta proporcional à densidade do raio).`,
    `Agressivo = base × 1.8 (recall e penetração superiores).`,
  ];

  // Risco depende da barra competitiva
  let risco: string;
  if (greenCount >= 3) {
    risco = `Reputação alta dos concorrentes (${greenCount} com ★ ≥ 4.3) pode neutralizar a mensagem.`;
  } else if (totalCompetidores >= 6) {
    risco = `Densidade alta (${totalCompetidores} no raio) eleva CAC e disputa por atenção.`;
  } else {
    risco = `Risco baixo de saturação — concorrência local não bloqueia a ação.`;
  }

  const v = sectorVoice(ctx.sector);
  const sim: MapTerritorySimulation = {
    id: `mts-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    acao: acaoFinal,
    cenarios: {
      conservador: { resultado: `Engajamento abaixo da expectativa`, metrica: `≈ ${conservador} interações estimadas em 7 dias` },
      provavel:    { resultado: `Resposta proporcional ao território`, metrica: `≈ ${provavel} interações estimadas em 7 dias` },
      agressivo:   { resultado: `Tração regional acima da média`,     metrica: `≈ ${agressivo} interações estimadas em 7 dias` },
    },
    risco,
    metricaSucesso: greenCount >= 3
      ? `+0.1 em nota média e +15% em interações regionais em 7 dias`
      : totalCompetidores <= 3
        ? `+30% em interações regionais ou primeira referência espontânea no raio`
        : `+20% em interações regionais em 7 dias`,
    proximaAcao: `${v.audience} executa "${acaoFinal}" no raio de ${radiusLabel} e mede em 7 dias.`,
    resumo: `Simulação estimativa de "${acaoFinal}" para ${sector} no raio de ${radiusLabel}.`,
    fundamento,
    aviso: 'Estimativa territorial — não é previsão garantida. Serve para comparar decisões antes de executar, não para projetar resultado exato.',
    capturedAt: new Date().toISOString(),
  };
  const all = safeRead<MapTerritorySimulation[]>(MAP_LS_KEYS.simulations, []);
  all.unshift(sim);
  safeWrite(MAP_LS_KEYS.simulations, all.slice(0, 100));

  // Etapa 9: sinal territorial — simulação registra fundamento via summary.
  const riscoSig: 'alto' | 'medio' | 'baixo' = greenCount >= 3 ? 'medio' : totalCompetidores >= 6 ? 'medio' : 'baixo';
  saveTerritorialSignal(ctx, {
    action: 'simulate-territory-action',
    signalType: 'simulacao',
    summary: `${sim.resumo} · ${sim.aviso || 'Estimativa baseada em densidade competitiva e reputação local.'}`,
    riskLevel: riscoSig,
    usedInWorkspace: true,
  });

  return sim;
}
