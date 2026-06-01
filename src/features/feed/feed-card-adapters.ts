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
  return {
    id:              `synthetic-${c.id}`,
    titulo:          c.titulo,
    resumo:          c.resumo,
    por_que_importa: '',
    onde_afeta:      '',
    o_que_fazer:     '',
    dominio:         c.tags[0] ?? '',
    area:            c.tags[0] ?? '',
    urgencia:        c.urgencia,
    tipo_card:       c.tipo,
    confianca:       'media',
    confianca_score: 0.5,
    impacto:         '',
    risco_erro:      c.urgencia === 'alta' ? 0.6 : c.urgencia === 'media' ? 0.4 : 0.2,
    _synthetic:      true,
  };
}
