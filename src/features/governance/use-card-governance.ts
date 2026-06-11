// Hook React de governança para um card específico.
//
// Carrega decisions + distributions via governance-client. Calcula
// derivados: `latestDecision`, `derivedStatus`, `distributionCount`.
// Define `accessLevel`:
//
//   'matrix'           → user é matriz na org do card (GETs deram 200)
//   'non_matrix'       → user logado mas sem matriz (403) — esconde ações
//   'unauthenticated'  → sem token (401)               — esconde
//   'unsupported'      → card sintético/sem id válido  — esconde
//   'unknown'          → carregando ou erro de rede    — esconde
//
// `reload()` refaz fetch (usado após approve/reject/distribute).

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  getCardDecisions,
  getCardDistributions,
  GovernanceDecision,
  GovernanceDistribution,
  Result,
} from './governance-client';

export type AccessLevel =
  | 'matrix'
  | 'non_matrix'
  | 'unauthenticated'
  | 'unsupported'
  | 'unknown';

export type DerivedStatus =
  | 'pending'      // nenhuma decisão
  | 'approved'     // última = approved
  | 'rejected'     // última = rejected
  | 'distributed'; // pelo menos 1 distribuição (sobrepõe a decisão)

export interface CardGovernanceState {
  accessLevel: AccessLevel;
  loading: boolean;
  decisions: GovernanceDecision[];
  distributions: GovernanceDistribution[];
  latestDecision: GovernanceDecision | null;
  derivedStatus: DerivedStatus;
  distributionCount: number;
  organizationId: string | null;
  reload: () => void;
}

/**
 * Card IDs reais começam com `card-` (publisher Codify) ou são UUIDs do
 * banco. Cards sintéticos (feed demo, mapa, navegador) começam com
 * `synthetic-`. Pra esses, NÃO chamamos backend — `accessLevel='unsupported'`.
 */
function isRealCardId(cardId: string | null | undefined): boolean {
  if (!cardId) return false;
  if (cardId.startsWith('synthetic-')) return false;
  return true;
}

function classifyAccess(
  decisionsResult: Result<unknown>,
  distributionsResult: Result<unknown>,
): AccessLevel {
  // Se qualquer um deu 401, tratar como não-autenticado
  if (decisionsResult.status === 'unauthenticated' || distributionsResult.status === 'unauthenticated') {
    return 'unauthenticated';
  }
  // Se ambos 200 → matriz
  if (decisionsResult.status === 'ok' && distributionsResult.status === 'ok') {
    return 'matrix';
  }
  // 403 em qualquer → não matriz
  if (decisionsResult.status === 'forbidden' || distributionsResult.status === 'forbidden') {
    return 'non_matrix';
  }
  // 404 (card não existe) → tratamos como unsupported pra esconder
  if (decisionsResult.status === 'not_found' || distributionsResult.status === 'not_found') {
    return 'unsupported';
  }
  // Resto: rede/erro genérico
  return 'unknown';
}

function pickLatestDecision(decisions: GovernanceDecision[]): GovernanceDecision | null {
  if (decisions.length === 0) return null;
  // Backend ORDER BY decided_at DESC, mas defendemos no client tb.
  let latest = decisions[0];
  for (const d of decisions) {
    if (d.decided_at > latest.decided_at) latest = d;
  }
  return latest;
}

function deriveStatus(
  latest: GovernanceDecision | null,
  distributionCount: number,
): DerivedStatus {
  if (distributionCount > 0) return 'distributed';
  if (latest?.status === 'approved') return 'approved';
  if (latest?.status === 'rejected') return 'rejected';
  return 'pending';
}

export function useCardGovernance(cardId: string | null | undefined): CardGovernanceState {
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('unknown');
  const [decisions, setDecisions] = useState<GovernanceDecision[]>([]);
  const [distributions, setDistributions] = useState<GovernanceDistribution[]>([]);
  const [loading, setLoading] = useState(false);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  // Evita setState após unmount
  const aliveRef = useRef(true);
  useEffect(() => () => { aliveRef.current = false; }, []);

  useEffect(() => {
    aliveRef.current = true;
    if (!isRealCardId(cardId)) {
      setAccessLevel('unsupported');
      setDecisions([]);
      setDistributions([]);
      setOrganizationId(null);
      return;
    }
    setLoading(true);
    let cancelled = false;
    (async () => {
      const [decRes, distRes] = await Promise.all([
        getCardDecisions(cardId as string),
        getCardDistributions(cardId as string),
      ]);
      if (cancelled || !aliveRef.current) return;
      const level = classifyAccess(decRes, distRes);
      setAccessLevel(level);
      const decItems = decRes.status === 'ok' ? decRes.data.items : [];
      const distItems = distRes.status === 'ok' ? distRes.data.items : [];
      setDecisions(decItems);
      setDistributions(distItems);
      // OrgId vem da primeira decision/distribution se houver
      const orgFromDec = decItems[0]?.organization_id ?? null;
      const orgFromDist = distItems[0]?.organization_id ?? null;
      setOrganizationId(orgFromDec ?? orgFromDist ?? null);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [cardId, nonce]);

  const reload = useCallback(() => setNonce(n => n + 1), []);

  const latestDecision = useMemo(() => pickLatestDecision(decisions), [decisions]);
  const distributionCount = distributions.length;
  const derivedStatus = useMemo(
    () => deriveStatus(latestDecision, distributionCount),
    [latestDecision, distributionCount],
  );

  return {
    accessLevel,
    loading,
    decisions,
    distributions,
    latestDecision,
    derivedStatus,
    distributionCount,
    organizationId,
    reload,
  };
}
