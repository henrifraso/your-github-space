// Merge de fontes do feed.
//
// O feed exibido no perfil consome até 3 fontes simultâneas:
//   1. cards do role (`roleConfig.feedCards`, possivelmente filtrados por aba)
//   2. cards gerados pelo navegador (`browserFeedCards`)
//   3. cards gerados pelo mapa e pelo diagnóstico (`mapFeedCards`)
//
// Cards "dismissed" (aprovados/reprovados pelo Perfil Central) são
// removidos sempre.
//
// Helper movido de src/App.tsx (Fase 16) — JSX inline:
//     [...mapFeedCards, ...browserFeedCards, ...relevantCards]
//       .filter(c => !dismissedCards.has(c.id))
//
// Ordem preservada: mapa → navegador → role.

import type { RoleFeedCard } from '../../config/roleConfig';

export interface MergeFeedSourcesArgs {
  map: RoleFeedCard[];
  browser: RoleFeedCard[];
  role: RoleFeedCard[];
  dismissed: Set<string>;
}

export function mergeFeedSources({ map, browser, role, dismissed }: MergeFeedSourcesArgs): RoleFeedCard[] {
  return [...map, ...browser, ...role].filter(c => !dismissed.has(c.id));
}
