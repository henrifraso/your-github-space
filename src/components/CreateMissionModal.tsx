// Modal de criação de missão pela matriz (P10 v1, bloco GM1-C).
//
// Reusa o helper `listOrgUnits` (já carregado pelo GA3 governance-client)
// pra listar as business_units da org. Quando o user é matriz, o backend
// devolve as units válidas. Mesma fonte usada no `DistributeModal`.
//
// Permissão é gateada no caller (`CardGovernanceActions`) com 2 condições:
//   - accessLevel === 'matrix' (permissão real)
//   - viewSector não está em STORE_SECTORS (contexto visual ≠ loja)
//
// Sucesso: NÃO fecha automaticamente. Mostra o mission_id retornado e um
// botão "Fechar" — assim o operador consegue conferir o ID, copiar pra
// um log/teste, e fechar manualmente. Reduz risco de criação duplicada
// por dedo trêmulo.

import { useEffect, useState } from 'react';

import { listOrgUnits, OrgUnit } from '../features/governance/governance-client';
import { createMission } from '../features/missions/missions-client';
import type { MissionPriority } from '../core/types/mission';

interface Props {
  cardId: string;
  /** Org do card (vinda do backend via IntelligenceCard.organizationId).
   *  Se null, fallback pra localStorage.os1_org_id. */
  cardOrganizationId: string | null;
  /** Pré-preenche o campo título (default: vazio). */
  defaultTitle?: string;
  /** Pré-preenche o campo descrição (default: vazio). */
  defaultDescription?: string;
  onClose: () => void;
  /** Chamado quando a missão é criada com sucesso. */
  onDone?: (missionId: string) => void;
}

type LoadState =
  | { kind: 'loading' }
  | { kind: 'ready'; units: OrgUnit[] }
  | { kind: 'empty' }
  | { kind: 'fallback'; reason: string };

function resolveOrgId(orgFromProp: string | null): string | null {
  if (orgFromProp) return orgFromProp;
  try { return localStorage.getItem('os1_org_id'); } catch { return null; }
}

const INPUT_CLS =
  'w-full text-[12px] px-2 py-1.5 rounded-lg border border-neutral-200 ' +
  'dark:border-[#3a3a3a] bg-neutral-50 dark:bg-[#252525] ' +
  'text-neutral-900 dark:text-neutral-100';

const LABEL_CLS =
  'block text-[10px] font-bold uppercase tracking-widest ' +
  'text-neutral-500 dark:text-neutral-400 mb-1';


export function CreateMissionModal({
  cardId,
  cardOrganizationId,
  defaultTitle = '',
  defaultDescription = '',
  onClose,
  onDone,
}: Props) {
  const orgId = resolveOrgId(cardOrganizationId);
  const [load, setLoad] = useState<LoadState>({ kind: 'loading' });

  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState(defaultDescription);
  const [priority, setPriority] = useState<MissionPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [unitId, setUnitId] = useState('');
  const [fallbackUnitId, setFallbackUnitId] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [createdMissionId, setCreatedMissionId] = useState<string | null>(null);

  // Carrega unidades da org assim que o modal monta.
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
        else {
          setLoad({ kind: 'ready', units: res.data });
          // Pré-seleciona a primeira unit pra evitar submit com unitId vazio.
          setUnitId(res.data[0].id);
        }
      } else {
        setLoad({ kind: 'fallback', reason: res.status });
      }
    })();
    return () => { cancelled = true; };
  }, [orgId]);

  async function submit() {
    setErr(null);
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setErr('Título é obrigatório.');
      return;
    }
    if (!orgId) {
      setErr('Organização desconhecida.');
      return;
    }
    let chosenUnit = '';
    if (load.kind === 'ready') {
      chosenUnit = unitId;
    } else {
      chosenUnit = fallbackUnitId.trim();
    }
    if (!chosenUnit) {
      setErr('Selecione (ou informe) uma unidade destino.');
      return;
    }
    setSubmitting(true);
    const res = await createMission({
      organization_id:  orgId,
      business_unit_id: chosenUnit,
      card_id:          cardId,
      title:            trimmedTitle,
      description:      description.trim() || null,
      priority,
      due_date:         dueDate.trim() || null,
    });
    setSubmitting(false);
    if (res.status === 'ok') {
      setCreatedMissionId(res.data.id);
      onDone?.(res.data.id);
    } else if (res.status === 'error') {
      setErr(res.message);
    } else {
      setErr(`Falha: ${res.status}`);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[300] bg-black/40 dark:bg-black/60 flex items-center justify-center p-4"
      onClick={() => { if (!submitting) onClose(); }}
    >
      <div
        className="bg-white dark:bg-[#1e1e1e] border border-neutral-200 dark:border-[#2e2e2e] rounded-2xl shadow-2xl max-w-md w-full p-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Criar missão
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white text-sm cursor-pointer"
            disabled={submitting}
          >
            ✕
          </button>
        </div>

        {/* Sucesso: missão criada — mostra ID + botão Fechar */}
        {createdMissionId ? (
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800/50">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-violet-700 dark:text-violet-300 mb-1">
                ✓ Missão criada
              </p>
              <p className="text-[12px] font-mono text-violet-900 dark:text-violet-100 break-all">
                {createdMissionId}
              </p>
              <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-2">
                Status inicial: <span className="font-semibold">assigned</span>
              </p>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="text-[12px] font-semibold px-3 py-1.5 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#252525] cursor-pointer"
                onClick={onClose}
              >
                Fechar
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className={LABEL_CLS}>Título</label>
              <input
                type="text"
                placeholder="O que precisa ser feito?"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className={INPUT_CLS}
                disabled={submitting}
              />
            </div>

            <div>
              <label className={LABEL_CLS}>Descrição</label>
              <textarea
                placeholder="Contexto e critérios de conclusão (opcional)"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                className={INPUT_CLS}
                disabled={submitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL_CLS}>Prioridade</label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as MissionPriority)}
                  className={INPUT_CLS}
                  disabled={submitting}
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                </select>
              </div>
              <div>
                <label className={LABEL_CLS}>Prazo (opcional)</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className={INPUT_CLS}
                  disabled={submitting}
                />
              </div>
            </div>

            <div>
              <label className={LABEL_CLS}>Unidade destino</label>
              {load.kind === 'loading' && (
                <p className="text-[11px] text-neutral-500">Carregando unidades…</p>
              )}
              {load.kind === 'ready' && (
                <select
                  value={unitId}
                  onChange={e => setUnitId(e.target.value)}
                  className={INPUT_CLS}
                  disabled={submitting}
                >
                  {load.units.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} · {u.id}
                    </option>
                  ))}
                </select>
              )}
              {load.kind === 'empty' && (
                <>
                  <p className="text-[11px] text-neutral-500 mb-1">
                    Nenhuma unidade encontrada. Informe o ID manualmente:
                  </p>
                  <input
                    type="text"
                    placeholder="bu-..."
                    value={fallbackUnitId}
                    onChange={e => setFallbackUnitId(e.target.value)}
                    className={INPUT_CLS}
                    disabled={submitting}
                  />
                </>
              )}
              {load.kind === 'fallback' && (
                <>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 mb-1">
                    Não foi possível carregar unidades (motivo: {load.reason}). Informe o ID:
                  </p>
                  <input
                    type="text"
                    placeholder="bu-..."
                    value={fallbackUnitId}
                    onChange={e => setFallbackUnitId(e.target.value)}
                    className={INPUT_CLS}
                    disabled={submitting}
                  />
                </>
              )}
            </div>

            {err && (
              <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
                {err}
              </p>
            )}

            <div className="flex justify-end gap-2 pt-1">
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
                className="text-[12px] font-semibold px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white cursor-pointer disabled:opacity-50"
                onClick={submit}
                disabled={submitting}
              >
                {submitting ? 'Criando…' : 'Criar missão'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
