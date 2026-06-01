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
} from '../../../core/types/map';
import { MAP_LS_KEYS } from './map-actions.catalog';
import { fmtKm, sectorVoice } from './map-actions.scoring';
import { safeRead, safeWrite, loadMapFeedCards } from './map-actions.storage';

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

  // Card 3 — campanha local
  cards.push(mk('3', {
    titulo: 'Região com oportunidade de campanha local',
    resumo: `Raio de ${radiusLabel} é território denso pra campanhas hiperlocais (geofence, social local, parcerias de bairro).`,
    dominio: sector, risco: 'baixo', oportunidade: 'alta', urgencia: 'baixa',
    acaoRecomendada: 'Testar campanha por proximidade com mensagem regional por 7 dias.',
  }));

  // Card 4 — fornecedor/parceiro
  cards.push(mk('4', {
    titulo: 'Fornecedor ou parceiro próximo pode reduzir custo operacional',
    resumo: `Verificar fornecedores locais no raio de ${radiusLabel}. Logística próxima reduz custo e prazo.`,
    dominio: sector, risco: 'baixo', oportunidade: 'média', urgencia: 'baixa',
    acaoRecomendada: 'Mapear 3 fornecedores próximos e cotar substituição parcial.',
  }));

  // Card 5 — expansão / presença
  if (total <= 4) {
    cards.push(mk('5', {
      titulo: 'Área com potencial de expansão ou nova presença',
      resumo: `Baixa saturação no raio de ${radiusLabel}. Avaliar ponto, demanda demográfica e fluxo antes de decidir.`,
      dominio: sector, risco: 'medio', oportunidade: 'alta', urgencia: 'media',
      acaoRecomendada: 'Estudar viabilidade de unidade ou presença comercial nesta área.',
    }));
  }

  const all = loadMapFeedCards();
  all.unshift(...cards);
  safeWrite(MAP_LS_KEYS.generatedCards, all.slice(0, 200));
  return cards;
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
  return r;
}

// ─── Função 3: Encontrar oportunidades no território ─────────────────────
export function buildOpportunities(ctx: MapContextSnapshot): MapOpportunity {
  const a = ctx.analysis;
  const radiusLabel = fmtKm(ctx.radius);
  const v = sectorVoice(ctx.sector);
  const ops: string[] = [];

  if (a && a.total <= 3) ops.push(`Região com baixa concorrência em ${radiusLabel} — janela curta de captura.`);
  if (a && a.red >= 2)   ops.push(`${a.red} concorrentes com baixa reputação — espaço por qualidade percebida.`);
  if (ctx.totalAvailable > (a?.total ?? 0)) ops.push(`Borda do raio com presença esparsa — testar ativação por proximidade.`);
  ops.push('Área para campanha local hiperlocal (geofence, parcerias de bairro).');
  if (a && a.indiretos >= 2) ops.push(`Possíveis parceiros indiretos (${a.indiretos}) no raio — bundling ou cross-promo.`);
  ops.push(`Área com potencial de expansão ou nova frente de presença em ${radiusLabel}.`);

  const acaoRecomendada = `Testar campanha por proximidade antes de considerar expansão física. ${v.audience} valida em 7 dias.`;
  const resumo = `Existem ${ops.length} caminho(s) de oportunidade no raio de ${radiusLabel}. Priorizar o de menor custo e maior visibilidade local.`;

  const r: MapOpportunity = {
    id: `mop-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    oportunidades: ops, acaoRecomendada, resumo,
    capturedAt: new Date().toISOString(),
  };
  const all = safeRead<MapOpportunity[]>(MAP_LS_KEYS.opportunities, []);
  all.unshift(r);
  safeWrite(MAP_LS_KEYS.opportunities, all.slice(0, 100));
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
  const m: MapMission = {
    id: `mms-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    titulo, objetivo, contextoTerritorial, etapas,
    responsavelSugerido: v.audience,
    prazoSugerido: '7 dias',
    evidencias,
    metricaSucesso: 'Tráfego/visitas ou interações regionais +20% em 7 dias',
    criterioConclusao: 'Campanha publicada, concorrentes mapeados e métrica inicial registrada.',
    capturedAt: new Date().toISOString(),
  };
  const all = safeRead<MapMission[]>(MAP_LS_KEYS.missions, []);
  all.unshift(m);
  safeWrite(MAP_LS_KEYS.missions, all.slice(0, 200));
  return m;
}
// ─── F6: Monitorar território ────────────────────────────────────────────
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
  const r: MapRiskAnalysis = {
    id: `mr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    riscos,
    resumo: `${riscos.length} risco(s) detectado(s) no raio de ${fmtKm(ctx.radius)}. ${riscos.filter(x => x.nivel === 'alto').length} alto(s).`,
    recomendacao: `${v.audience} deve priorizar mitigação dos riscos altos e monitorar os médios em ciclo semanal.`,
    capturedAt: new Date().toISOString(),
  };
  const all = safeRead<MapRiskAnalysis[]>(MAP_LS_KEYS.risks, []);
  all.unshift(r);
  safeWrite(MAP_LS_KEYS.risks, all.slice(0, 100));
  return r;
}

// ─── F8: Oportunidades por setor ─────────────────────────────────────────
export function buildSectorOpportunities(ctx: MapContextSnapshot): MapSectorOpportunity {
  const sector = (ctx.sector || '').toLowerCase();
  const radiusLabel = fmtKm(ctx.radius);
  const ops: MapSectorOpportunity['oportunidades'] = [];
  // Heurística por setor
  if (sector.includes('marketing') || sector === 'codify' || sector === 'os1') {
    ops.push({ tipo: 'campanha local', descricao: `Geofence + social regional no raio de ${radiusLabel}.`, prioridade: 'alta' });
  }
  if (sector.includes('vendas') || sector === 'os1') {
    ops.push({ tipo: 'região de aquisição', descricao: 'Ativação comercial por proximidade nas zonas menos saturadas do raio.', prioridade: 'alta' });
  }
  if (sector.includes('compras') || sector.includes('fornecedor')) {
    ops.push({ tipo: 'fornecedores próximos', descricao: `Mapear fornecedores no raio de ${radiusLabel} pra reduzir prazo e custo logístico.`, prioridade: 'media' });
  }
  if (sector.includes('rh')) {
    ops.push({ tipo: 'região para contratação', descricao: 'Concentração demográfica e densidade do raio favorecem captação de talento local.', prioridade: 'media' });
  }
  if (sector.includes('operac') || sector === 'os1') {
    ops.push({ tipo: 'gargalo/cobertura', descricao: 'Avaliar pontos com cobertura esparsa no raio pra reforço operacional.', prioridade: 'media' });
  }
  if (sector.includes('expansao') || sector.includes('expansão')) {
    ops.push({ tipo: 'local potencial', descricao: 'Borda do raio com baixa saturação — candidato a nova unidade.', prioridade: 'alta' });
  }
  // Fallback genérico
  if (ops.length === 0) {
    ops.push({ tipo: 'presença local', descricao: `Reforço de visibilidade regional no raio de ${radiusLabel}.`, prioridade: 'media' });
    ops.push({ tipo: 'parcerias regionais', descricao: 'Identificar players complementares na região.', prioridade: 'baixa' });
  }
  const v = sectorVoice(ctx.sector);
  const r: MapSectorOpportunity = {
    id: `mso-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    sector: ctx.sector,
    oportunidades: ops,
    acaoRecomendada: `${v.audience} valida ${ops.length} oportunidade(s) em ciclo de 7 dias.`,
    resumo: `${ops.length} oportunidade(s) específicas para ${ctx.sector || 'o domínio atual'} no raio de ${radiusLabel}.`,
    capturedAt: new Date().toISOString(),
  };
  const all = safeRead<MapSectorOpportunity[]>(MAP_LS_KEYS.sectorOpportunities, []);
  all.unshift(r);
  safeWrite(MAP_LS_KEYS.sectorOpportunities, all.slice(0, 100));
  return r;
}

// ─── F9: Parceiros/fornecedores próximos ─────────────────────────────────
// Heurística sobre os competitors (categoria 'indireto' = candidato natural a parceiro/fornecedor).
export function buildNearbyPartners(ctx: MapContextSnapshot): MapNearbyPartner {
  const list = ctx.competitorsInRadius;
  const indiretos = list.filter(c => c.categoria === 'indireto').slice(0, 5);
  const candidatos: MapNearbyPartner['candidatos'] = indiretos.length
    ? indiretos.map(c => ({
        nome: c.nome,
        tipo: 'parceiro' as const,
        distancia: c.cidade || 'no raio',
        observacao: c.diferencial || c.proposta_principal || 'Categoria indireta — bundling/cross-promo possível.',
      }))
    : list.slice(0, 3).map(c => ({
        nome: c.nome,
        tipo: 'prestador' as const,
        distancia: c.cidade || 'no raio',
        observacao: 'Sem categoria indireta clara — avaliar parceria operacional.',
      }));
  const r: MapNearbyPartner = {
    id: `mnp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    candidatos,
    recomendacao: candidatos.length
      ? `Avaliar ${candidatos.length} candidato(s) na ordem de prioridade.`
      : 'Sem candidatos no raio. Expandir raio ou trocar perfil.',
    resumo: candidatos.length
      ? `${candidatos.length} candidato(s) a parceiro/fornecedor no raio de ${fmtKm(ctx.radius)}.`
      : 'Sem candidatos detectados.',
    capturedAt: new Date().toISOString(),
  };
  const all = safeRead<MapNearbyPartner[]>(MAP_LS_KEYS.nearbyPartners, []);
  all.unshift(r);
  safeWrite(MAP_LS_KEYS.nearbyPartners, all.slice(0, 100));
  return r;
}

// ─── F10: Simular ação no território ─────────────────────────────────────
export function buildTerritorySimulation(ctx: MapContextSnapshot, acao?: string): MapTerritorySimulation {
  const radiusLabel = fmtKm(ctx.radius);
  const sector = ctx.sector || 'mercado';
  const a = ctx.analysis;
  const acaoFinal = acao || (a && a.total >= 6
    ? 'reforço de reputação local em 7 dias'
    : 'campanha local por 7 dias');
  // Cenários proporcionais à densidade
  const base = Math.max(50, (a?.total ?? 1) * 30);
  const conservador = Math.round(base * 0.6);
  const provavel = Math.round(base * 1.0);
  const agressivo = Math.round(base * 1.8);
  const v = sectorVoice(ctx.sector);
  const sim: MapTerritorySimulation = {
    id: `mts-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    acao: acaoFinal,
    cenarios: {
      conservador: { resultado: `Baixo engajamento local`, metrica: `~${conservador} interações em 7 dias` },
      provavel:    { resultado: `Resposta moderada`,       metrica: `~${provavel} interações em 7 dias` },
      agressivo:   { resultado: `Tração regional forte`,   metrica: `~${agressivo} interações em 7 dias` },
    },
    risco: a && a.green >= 3 ? 'Reputação dos concorrentes pode neutralizar mensagem.' : 'Risco baixo de saturação.',
    metricaSucesso: `+20% em interações regionais ou +0.1 em nota média em 7 dias`,
    proximaAcao: `${v.audience} executa "${acaoFinal}" no raio de ${radiusLabel} e mede em 7 dias.`,
    resumo: `Simulação de "${acaoFinal}" no raio de ${radiusLabel}, ${sector}: conservador ${conservador}, provável ${provavel}, agressivo ${agressivo}.`,
    capturedAt: new Date().toISOString(),
  };
  const all = safeRead<MapTerritorySimulation[]>(MAP_LS_KEYS.simulations, []);
  all.unshift(sim);
  safeWrite(MAP_LS_KEYS.simulations, all.slice(0, 100));
  return sim;
}
