// Hook que orquestra a busca de contexto editorial (evidences, signals,
// map-signals) do card aberto no WorkspacePanel.
//
// Política idêntica à Fase 4.2: silencioso. Sem token, sem scope, card
// sintético, ou erro de qualquer fetch → retorna arrays vazios.
//
// Caller passa { card, scope } — scope vem de getCodifyScopeForSector
// do activeSector ativo no App.tsx. Hook NÃO lê activeSector direto
// pra continuar testável isoladamente.

import { useEffect, useState } from 'react';

import {
  fetchCodifyEvidences,
  fetchCodifyMapSignals,
  type CodifyEvidence,
  type CodifySignal,
} from './codify-context-client';
import {
  filterByCardTema,
  splitSignalsAndMapSignals,
  belongsToScope,
  type CardForContext,
} from './codify-context-adapter';

export interface CodifyScope {
  organizationId: string;
  unitId?: string;
}

export interface UseCodifyCardContextOptions {
  card: CardForContext;
  scope: CodifyScope | null;
}

export interface CodifyCardContext {
  evidences: CodifyEvidence[];
  signals: CodifySignal[];
  mapSignals: CodifySignal[];
  loading: boolean;
  error: boolean;
}

const EMPTY: CodifyCardContext = {
  evidences: [],
  signals: [],
  mapSignals: [],
  loading: false,
  error: false,
};

export function useCodifyCardContext(options: UseCodifyCardContextOptions): CodifyCardContext {
  const { card, scope } = options;
  const [ctx, setCtx] = useState<CodifyCardContext>(EMPTY);

  // Critérios de short-circuit (sem fetch):
  //   - sem scope (sector sem org real, ex.: os1/tesla/ifood/...)
  //   - card sintético (demo, browser-generated, mapa-generated)
  //   - sem id de card
  const shouldFetch = Boolean(
    scope &&
    !card._synthetic &&
    card.id,
  );

  const scopeOrg = scope?.organizationId;
  const scopeUnit = scope?.unitId;
  const cardId = card.id;

  useEffect(() => {
    if (!shouldFetch || !scopeOrg) {
      setCtx(EMPTY);
      return;
    }
    let cancelled = false;
    setCtx({ ...EMPTY, loading: true });
    (async () => {
      // Fetch paralelo evidências + map-signals (que serve gerais+territoriais)
      const [evRaw, sigRaw] = await Promise.all([
        fetchCodifyEvidences(scopeOrg, scopeUnit),
        fetchCodifyMapSignals(scopeOrg, scopeUnit),
      ]);
      if (cancelled) return;

      // Erro silencioso: qualquer null vira [] (consumer não distingue)
      const failed = evRaw === null || sigRaw === null;
      const evidencesAll: CodifyEvidence[] = evRaw ?? [];
      const signalsAll:   CodifySignal[]   = sigRaw ?? [];

      // Camada defensiva extra contra vazamento (além do scope do backend)
      const scopeCheck = { organizationId: scopeOrg, unitId: scopeUnit };
      const evScoped  = evidencesAll.filter(e => belongsToScope(e, scopeCheck));
      const sigScoped = signalsAll.filter(s => belongsToScope(s, scopeCheck));

      // Filtro editorial por tema (apenas evidências e signals gerais).
      // Map-signals territoriais são transversais à empresa — não filtra.
      const evFiltered = filterByCardTema(evScoped, card);
      const { signals, mapSignals } = splitSignalsAndMapSignals(sigScoped);
      const signalsFiltered = filterByCardTema(signals, card);

      setCtx({
        evidences:  evFiltered,
        signals:    signalsFiltered,
        mapSignals: mapSignals,  // todos da org, sem filtro de tema
        loading:    false,
        error:      failed,
      });
    })();
    return () => { cancelled = true; };
  }, [shouldFetch, scopeOrg, scopeUnit, cardId]);

  return ctx;
}
