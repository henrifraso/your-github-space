// Merge de fontes do feed.
//
// O feed exibido no perfil consome até 4 fontes simultâneas:
//   1. cards reais via Codify API (`api`, vindo de useCodifyFeed) — opcional
//   2. cards gerados pelo mapa e pelo diagnóstico (`map`)
//   3. cards gerados pelo navegador (`browser`)
//   4. cards do role (`roleConfig.feedCards`, possivelmente filtrados por aba)
//
// Cards "dismissed" (aprovados/reprovados pelo Perfil Central) são
// removidos sempre.
//
// Dedupe: cards com mesmo `id` aparecem só na primeira fonte (api > map >
// browser > role). Isso evita duplicação visual caso um card real coincida
// em id com um gerado localmente.
//
// Ordem: api → mapa → navegador → role.

import type { RoleFeedCard } from '../../config/roleConfig';

export interface MergeFeedSourcesArgs {
  /** Cards reais do backend (Codify Intelligence API). Opcional. */
  api?: RoleFeedCard[];
  map: RoleFeedCard[];
  browser: RoleFeedCard[];
  role: RoleFeedCard[];
  dismissed: Set<string>;
}

export function mergeFeedSources({ api, map, browser, role, dismissed }: MergeFeedSourcesArgs): RoleFeedCard[] {
  const seen = new Set<string>();
  const out: RoleFeedCard[] = [];
  for (const c of [...(api ?? []), ...map, ...browser, ...role]) {
    if (dismissed.has(c.id)) continue;
    if (seen.has(c.id)) continue;
    seen.add(c.id);
    out.push(c);
  }
  return out;
}
