// Conversões entre formatos de cards do feed.
//
// Os componentes do feed (FeedCard, FeedSection) consomem `RoleFeedCard`
// vindo do `roleConfig` ou de cards locais sintéticos. Quando o usuário
// clica num desses cards, o WorkspacePanel (Área de Trabalho) espera um
// `IntelligenceCard`. Este módulo faz a ponte com função pura.
//
// Conteúdo movido de src/App.tsx (Fase 16) — sem alteração de
// comportamento. Mesmas chaves, mesmos defaults, mesmo cálculo de
// `risco_erro` por urgência.

import type { RoleFeedCard } from '../../config/roleConfig';
import type { IntelligenceCard } from '../../core/types/card';

/** Converte um `RoleFeedCard` em `IntelligenceCard` sintético para o WorkspacePanel. */
export function roleFeedCardToIntelligenceCard(c: RoleFeedCard): IntelligenceCard {
  // Etapa 10: quando o card vem de uma ação do Navegador, preserva
  // origem + URL/título da página + ID de evidência no IntelligenceCard.
  // Isso permite que a Área de Trabalho mostre "página analisada" e
  // dê atalhos contextuais (criar missão, dossiê) sem perder o link.
  const isFromBrowser = c.origem === 'navegador';
  const isFromMap = c.origem === 'mapa';

  let porQueImporta = '';
  let oQueFazer = '';
  if (isFromBrowser) {
    porQueImporta = c.sourceUrl ? `Origem: ${c.sourceUrl}` : 'Card gerado da navegação atual.';
    oQueFazer = 'Revisar a evidência da página e decidir próxima ação: salvar dossiê, transformar em missão ou descartar.';
  } else if (isFromMap) {
    // Etapa 11: contexto territorial completo (raio + concorrentes + label)
    const parts: string[] = [];
    if (c.sourceLabel) parts.push(`Origem territorial: ${c.sourceLabel}`);
    if (c.center) parts.push(`Centro: ${c.center.lat.toFixed(3)}, ${c.center.lng.toFixed(3)}`);
    if (c.competitorsCount !== undefined) parts.push(`${c.competitorsCount} concorrente(s) considerados`);
    porQueImporta = parts.length > 0 ? parts.join(' · ') : 'Card gerado a partir de análise territorial.';
    oQueFazer = 'Revisar o sinal territorial e decidir próxima ação: missão territorial, simulação ou descarte.';
  }

  return {
    id:              `synthetic-${c.id}`,
    titulo:          c.titulo,
    resumo:          c.resumo,
    por_que_importa: porQueImporta,
    onde_afeta:      c.tags[1] ?? c.tags[0] ?? '',
    o_que_fazer:     oQueFazer,
    dominio:         c.tags[0] ?? '',
    area:            isFromBrowser ? 'navegador-feed' : isFromMap ? 'mapa-feed' : (c.tags[0] ?? ''),
    urgencia:        c.urgencia,
    tipo_card:       c.tipo,
    confianca:       'media',
    confianca_score: 0.5,
    impacto:         '',
    risco_erro:      c.urgencia === 'alta' ? 0.6 : c.urgencia === 'media' ? 0.4 : 0.2,
    _synthetic:      true,
  };
}
