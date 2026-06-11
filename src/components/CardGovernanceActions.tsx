// Botões matrix-only de governança (approve / reject / distribute).
//
// Renderiza somente quando o user tem membership matriz na org do card
// (useCardGovernance.accessLevel === 'matrix'). Caso contrário retorna
// null — não polui UI nem deixa botão fantasma.
//
// - Approve / Reject: clica e prompta (window.prompt) por comentário
//   opcional. Sucesso → reload(). Erro → mostra mensagem inline.
// - Distribute: abre modal leve com lista de business_units da org
//   (carregadas via listOrgUnits). Permite multi-seleção. Tem fallback
//   discreto: se o backend não retornar unidades (404 / lista vazia),
//   modal mostra mensagem clara em vez de quebrar.
//
// Acesso "matrix" é decidido pelo backend (GA1/GA2 require_matrix). O
// frontend não recria essa regra — apenas reage ao resultado dos GETs.

import { useEffect, useState } from 'react';

import {
  approveCard,
  distributeCard,
  listOrgUnits,
  OrgUnit,
  rejectCard,
} from '../features/governance/governance-client';
import {
  useCardGovernance,
} from '../features/governance/use-card-governance';
import { CardStatusBadge } from './CardStatusBadge';

interface Props {
  cardId: string;
  /** Chamado após qualquer ação concluída com sucesso. */
  onChange?: () => void;
}

type Busy = 'idle' | 'approving' | 'rejecting' | 'distributing';

const BTN_BASE =
  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] ' +
  'font-semibold border transition-all cursor-pointer disabled:opacity-50 ' +
  'disabled:cursor-not-allowed';

const BTN_APPROVE =
  BTN_BASE +
  ' bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 ' +
  'border-emerald-200 dark:border-emerald-800/50 ' +
  'hover:bg-emerald-100 dark:hover:bg-emerald-900/30';

const BTN_REJECT =
  BTN_BASE +
  ' bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 ' +
  'border-rose-200 dark:border-rose-800/50 ' +
  'hover:bg-rose-100 dark:hover:bg-rose-900/30';

const BTN_DISTRIBUTE =
  BTN_BASE +
  ' bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 ' +
  'border-sky-200 dark:border-sky-800/50 ' +
  'hover:bg-sky-100 dark:hover:bg-sky-900/30';


export function CardGovernanceActions({ cardId, onChange }: Props) {
  const gov = useCardGovernance(cardId);
  const [busy, setBusy] = useState<Busy>('idle');
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [distOpen, setDistOpen] = useState(false);

  if (gov.accessLevel !== 'matrix') {
    return null;
  }

  async function runApprove() {
    setErrMsg(null);
    const comment = window.prompt(
      'Comentário (opcional) para registro de aprovação:',
      '',
    );
    if (comment === null) return;
    setBusy('approving');
    const res = await approveCard(cardId, comment || undefined);
    setBusy('idle');
    if (res.status === 'ok') {
      gov.reload();
      onChange?.();
    } else if (res.status === 'error') {
      setErrMsg(res.message);
    } else if (res.status === 'forbidden') {
      setErrMsg('Sem permissão de matriz.');
    } else {
      setErrMsg(`Falha: ${res.status}`);
    }
  }

  async function runReject() {
    setErrMsg(null);
    const comment = window.prompt(
      'Comentário (opcional) para registro de rejeição:',
      '',
    );
    if (comment === null) return;
    setBusy('rejecting');
    const res = await rejectCard(cardId, comment || undefined);
    setBusy('idle');
    if (res.status === 'ok') {
      gov.reload();
      onChange?.();
    } else if (res.status === 'error') {
      setErrMsg(res.message);
    } else {
      setErrMsg(`Falha: ${res.status}`);
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <CardStatusBadge
        status={gov.derivedStatus}
        distributionCount={gov.distributionCount}
        loading={gov.loading || busy !== 'idle'}
      />
      <button
        type="button"
        className={BTN_APPROVE}
        onClick={runApprove}
        disabled={busy !== 'idle'}
      >
        {busy === 'approving' ? 'Aprovando…' : 'Aprovar'}
      </button>
      <button
        type="button"
        className={BTN_REJECT}
        onClick={runReject}
        disabled={busy !== 'idle'}
      >
        {busy === 'rejecting' ? 'Rejeitando…' : 'Rejeitar'}
      </button>
      <button
        type="button"
        className={BTN_DISTRIBUTE}
        onClick={() => { setErrMsg(null); setDistOpen(true); }}
        disabled={busy !== 'idle'}
      >
        Distribuir
      </button>
      {errMsg && (
        <span className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
          {errMsg}
        </span>
      )}
      {distOpen && (
        <DistributeModal
          cardId={cardId}
          organizationId={gov.organizationId}
          onClose={() => setDistOpen(false)}
          onDone={() => { setDistOpen(false); gov.reload(); onChange?.(); }}
        />
      )}
    </div>
  );
}


// ── Modal de distribuição ────────────────────────────────────────────────

interface DistributeModalProps {
  cardId: string;
  /** Se null, o modal tenta usar `localStorage.os1_org_id` como fallback. */
  organizationId: string | null;
  onClose: () => void;
  onDone: () => void;
}

type LoadState =
  | { kind: 'loading' }
  | { kind: 'ready'; units: OrgUnit[] }
  | { kind: 'empty' }
  | { kind: 'fallback'; reason: string };

function resolveOrgId(orgFromState: string | null): string | null {
  if (orgFromState) return orgFromState;
  try { return localStorage.getItem('os1_org_id'); } catch { return null; }
}

function DistributeModal({ cardId, organizationId, onClose, onDone }: DistributeModalProps) {
  const orgId = resolveOrgId(organizationId);
  const [load, setLoad] = useState<LoadState>({ kind: 'loading' });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [fallbackIds, setFallbackIds] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!orgId) {
      setLoad({ kind: 'fallback', reason: 'org-desconhecida' });
      return;
    }
    let cancelled = false;
    (async () => {
      const res = await listOrgUnits(orgId);
      if (cancelled) return;
      if (res.status === 'ok') {
        if (res.data.length === 0) setLoad({ kind: 'empty' });
        else setLoad({ kind: 'ready', units: res.data });
      } else {
        setLoad({ kind: 'fallback', reason: res.status });
      }
    })();
    return () => { cancelled = true; };
  }, [orgId]);

  function toggle(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function submit() {
    setErr(null);
    let ids: string[] = [];
    if (load.kind === 'ready') {
      ids = Array.from(selected);
    } else if (load.kind === 'fallback' || load.kind === 'empty') {
      ids = fallbackIds.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (ids.length === 0) {
      setErr('Selecione pelo menos uma unidade.');
      return;
    }
    setSubmitting(true);
    const res = await distributeCard(cardId, ids, note || undefined);
    setSubmitting(false);
    if (res.status === 'ok') {
      onDone();
    } else if (res.status === 'error') {
      setErr(res.message);
    } else {
      setErr(`Falha: ${res.status}`);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[300] bg-black/40 dark:bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#1e1e1e] border border-neutral-200 dark:border-[#2e2e2e] rounded-2xl shadow-2xl max-w-md w-full p-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Distribuir card para unidades
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {load.kind === 'loading' && (
          <p className="text-[12px] text-neutral-500">Carregando unidades…</p>
        )}

        {load.kind === 'ready' && (
          <div className="max-h-60 overflow-y-auto space-y-1 mb-3 border border-neutral-100 dark:border-[#2e2e2e] rounded-lg p-2">
            {load.units.map(u => (
              <label
                key={u.id}
                className="flex items-center gap-2 text-[12px] text-neutral-700 dark:text-neutral-300 cursor-pointer hover:bg-neutral-50 dark:hover:bg-[#252525] rounded px-2 py-1"
              >
                <input
                  type="checkbox"
                  checked={selected.has(u.id)}
                  onChange={() => toggle(u.id)}
                />
                <span className="flex-1 truncate">
                  <span className="font-medium">{u.name}</span>
                  <span className="text-neutral-400 dark:text-neutral-500"> · {u.id}</span>
                </span>
              </label>
            ))}
          </div>
        )}

        {load.kind === 'empty' && (
          <div className="mb-3">
            <p className="text-[12px] text-neutral-500 mb-2">
              Nenhuma unidade encontrada na organização. Você pode informar IDs manualmente:
            </p>
            <input
              type="text"
              placeholder="bu-piloto-01, bu-piloto-02"
              value={fallbackIds}
              onChange={e => setFallbackIds(e.target.value)}
              className="w-full text-[12px] px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-[#3a3a3a] bg-neutral-50 dark:bg-[#252525] text-neutral-900 dark:text-neutral-100"
            />
          </div>
        )}

        {load.kind === 'fallback' && (
          <div className="mb-3">
            <p className="text-[12px] text-amber-700 dark:text-amber-400 mb-2">
              Não foi possível carregar unidades (motivo: {load.reason}). Informe IDs manualmente:
            </p>
            <input
              type="text"
              placeholder="bu-piloto-01, bu-piloto-02"
              value={fallbackIds}
              onChange={e => setFallbackIds(e.target.value)}
              className="w-full text-[12px] px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-[#3a3a3a] bg-neutral-50 dark:bg-[#252525] text-neutral-900 dark:text-neutral-100"
            />
          </div>
        )}

        <input
          type="text"
          placeholder="Nota opcional"
          value={note}
          onChange={e => setNote(e.target.value)}
          className="w-full text-[12px] px-2 py-1.5 mb-3 rounded-lg border border-neutral-200 dark:border-[#3a3a3a] bg-neutral-50 dark:bg-[#252525] text-neutral-900 dark:text-neutral-100"
        />

        {err && (
          <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400 mb-2">{err}</p>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="text-[12px] font-semibold px-3 py-1.5 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#252525] cursor-pointer"
            onClick={onClose}
            disabled={submitting}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="text-[12px] font-semibold px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white cursor-pointer disabled:opacity-50"
            onClick={submit}
            disabled={submitting}
          >
            {submitting ? 'Enviando…' : 'Distribuir'}
          </button>
        </div>
      </div>
    </div>
  );
}
