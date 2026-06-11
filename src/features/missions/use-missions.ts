// Hooks React de missões (GM1-B).
//
// Padrão idêntico ao `use-card-governance.ts` (GA3): expõe state
// `data/loading/error/refetch`. Sem polling automático. Sem POST.
//
// Hooks:
//   useMissionDetail(missionId)        → MissionDetailResponse
//   useMissionsFeed(params)            → MissionListResponse (loja)
//   useGovernanceMissions(params)      → MissionListResponse (matriz)
//
// As funções de mutação (`createMission`, `updateMissionStatus`)
// vivem em `missions-client.ts` e devem ser chamadas explicitamente
// pelo caller (UI da matriz em GM1-C; UI da loja em GM1-D).

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  getMission,
  listFeedMissions,
  listGovernanceMissions,
  ListFeedMissionsParams,
  ListGovernanceMissionsParams,
  Result,
} from './missions-client';
import type {
  MissionDetailResponse,
  MissionListResponse,
} from '../../core/types/mission';


// ── State comum ──────────────────────────────────────────────────────────

export interface AsyncState<T> {
  data:     T | null;
  loading:  boolean;
  /** Pegou um Result com status != 'ok' OU exceção inesperada. */
  error:    null | {
    kind:    'unauthenticated' | 'forbidden' | 'not_found' | 'error';
    message?: string;
  };
  refetch:  () => void;
}

function errorFromResult<T>(r: Result<T>): AsyncState<T>['error'] {
  if (r.status === 'ok') return null;
  if (r.status === 'error') return { kind: 'error', message: r.message };
  return { kind: r.status };
}


// ── useMissionDetail(missionId) ──────────────────────────────────────────

/**
 * Carrega detalhe + histórico de UMA missão. Quando `missionId` é
 * null/undefined, o hook fica em estado idle (sem fetch).
 */
export function useMissionDetail(
  missionId: string | null | undefined,
): AsyncState<MissionDetailResponse> {
  const [data, setData] = useState<MissionDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AsyncState<MissionDetailResponse>['error']>(null);
  const [nonce, setNonce] = useState(0);

  const aliveRef = useRef(true);
  useEffect(() => () => { aliveRef.current = false; }, []);

  useEffect(() => {
    aliveRef.current = true;
    if (!missionId) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      const res = await getMission(missionId);
      if (cancelled || !aliveRef.current) return;
      if (res.status === 'ok') {
        setData(res.data);
        setError(null);
      } else {
        setData(null);
        setError(errorFromResult(res));
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [missionId, nonce]);

  const refetch = useCallback(() => setNonce(n => n + 1), []);
  return { data, loading, error, refetch };
}


// ── useMissionsFeed(params) ──────────────────────────────────────────────

/**
 * Lista missões via /api/feed/missions (loja vê só as suas units;
 * matriz vê todas). Quando `params` é null, fica idle.
 *
 * O caller controla a estabilidade do `params` (passe um objeto cuja
 * referência só muda quando o filtro real mudar — ou memoize com
 * useMemo). Não vamos tentar deep-equal aqui pra manter o hook simples.
 */
export function useMissionsFeed(
  params: ListFeedMissionsParams | null,
): AsyncState<MissionListResponse> {
  const [data, setData] = useState<MissionListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AsyncState<MissionListResponse>['error']>(null);
  const [nonce, setNonce] = useState(0);

  const aliveRef = useRef(true);
  useEffect(() => () => { aliveRef.current = false; }, []);

  useEffect(() => {
    aliveRef.current = true;
    if (!params) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      const res = await listFeedMissions(params);
      if (cancelled || !aliveRef.current) return;
      if (res.status === 'ok') {
        setData(res.data);
        setError(null);
      } else {
        setData(null);
        setError(errorFromResult(res));
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [params, nonce]);

  const refetch = useCallback(() => setNonce(n => n + 1), []);
  return { data, loading, error, refetch };
}


// ── useGovernanceMissions(params) ────────────────────────────────────────

/**
 * Lista missões via /api/governance/missions (matriz only no backend —
 * non-matrix recebe 403, que vira `error.kind === 'forbidden'`).
 * Será consumido pelo painel de acompanhamento da matriz em GM1-E.
 */
export function useGovernanceMissions(
  params: ListGovernanceMissionsParams | null,
): AsyncState<MissionListResponse> {
  const [data, setData] = useState<MissionListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AsyncState<MissionListResponse>['error']>(null);
  const [nonce, setNonce] = useState(0);

  const aliveRef = useRef(true);
  useEffect(() => () => { aliveRef.current = false; }, []);

  useEffect(() => {
    aliveRef.current = true;
    if (!params) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      const res = await listGovernanceMissions(params);
      if (cancelled || !aliveRef.current) return;
      if (res.status === 'ok') {
        setData(res.data);
        setError(null);
      } else {
        setData(null);
        setError(errorFromResult(res));
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [params, nonce]);

  const refetch = useCallback(() => setNonce(n => n + 1), []);
  return { data, loading, error, refetch };
}
