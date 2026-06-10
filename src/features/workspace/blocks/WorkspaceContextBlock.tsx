// Bloco "Contexto Editorial" do WorkspacePanel (Sub-fase 6.6.c).
//
// Renderiza 3 seções a partir do retorno de useCodifyCardContext:
//   1. Evidências (pública oficial / pública setorial / dado interno pendente)
//   2. Signals — monitoramento a configurar (signal type 6.4)
//   3. Monitoramento territorial — estrutura pendente (map-signal 6.5)
//
// Política editorial:
//   - badges textuais (sem emoji) por tipo
//   - confidence numérico no canto direito
//   - URL clicável só quando evidence.url existe
//   - loading: skeleton neutro (sem spinner novo)
//   - empty + error: bloco NÃO renderiza (silencioso, sem toast)
//
// IMPORTANTE: textos de signal/map-signal deixam claro estado dormente.
// Evidência "dado interno pendente" carrega badge dedicado pra não
// parecer fato medido.
//
// Não plugado no WorkspacePanel ainda — escopo da Sub-fase 6.6.d.

import { ExternalLink } from 'lucide-react';

import type {
  CodifyEvidence,
  CodifySignal,
} from '../../feed/codify-context-client';

export interface WorkspaceContextBlockProps {
  evidences: CodifyEvidence[];
  signals: CodifySignal[];
  mapSignals: CodifySignal[];
  loading: boolean;
  error: boolean;
}

// ── Badge helpers ─────────────────────────────────────────────────────────────

type BadgeKind =
  | 'FONTE OFICIAL'
  | 'FONTE PÚBLICA'
  | 'DADO INTERNO PENDENTE'
  | 'MONITORAMENTO DORMENTE'
  | 'ESTRUTURA TERRITORIAL'
  | null;

function badgeForEvidence(e: CodifyEvidence): BadgeKind {
  switch (e.evidenceType) {
    case 'fonte_oficial':         return 'FONTE OFICIAL';
    case 'referencia_setorial':   return 'FONTE PÚBLICA';
    case 'dado_interno_pendente': return 'DADO INTERNO PENDENTE';
    default:                      return null;
  }
}

function badgeForSignal(s: CodifySignal, isTerritorial: boolean): BadgeKind {
  if (isTerritorial) return 'ESTRUTURA TERRITORIAL';
  if (s.signalType === 'monitoramento_a_configurar') return 'MONITORAMENTO DORMENTE';
  return null;
}

// ── Componentes internos ──────────────────────────────────────────────────────

function Badge({ kind }: { kind: BadgeKind }) {
  if (!kind) return null;
  // Tom neutro pra todos os badges — diferenciação é só textual,
  // sem semáforo de cor (alinha com a regra "sem afirmar nada como ativo").
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 bg-neutral-200/70 dark:bg-[#2a2a2a] border border-neutral-300 dark:border-[#3a3a3a]">
      {kind}
    </span>
  );
}

function Confidence({ value }: { value: number }) {
  // Mostra como decimal com 2 casas. Sem rótulo "confidence:" pra não
  // poluir — o valor numérico curto no canto é suficiente.
  return (
    <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 shrink-0 ml-2">
      {value.toFixed(2)}
    </span>
  );
}

function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-baseline justify-between mb-2">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-500">
        {label}
      </h3>
      <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500">
        ({count})
      </span>
    </div>
  );
}

function ItemCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 py-2.5 bg-white dark:bg-[#1f1f1f] border border-neutral-200 dark:border-[#2e2e2e] rounded-lg">
      {children}
    </div>
  );
}

function EvidenceItem({ e }: { e: CodifyEvidence }) {
  const badge = badgeForEvidence(e);
  return (
    <ItemCard>
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <Badge kind={badge} />
          </div>
          <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-100 leading-snug">
            {e.title}
          </p>
          {e.summary && (
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed line-clamp-2">
              {e.summary}
            </p>
          )}
          {(e.sourceTitle || e.url) && (
            <div className="flex items-center gap-1 mt-1.5 text-[10px] text-neutral-500 dark:text-neutral-500">
              {e.url ? (
                <a
                  href={e.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 underline-offset-2 hover:underline"
                >
                  {e.sourceTitle ?? e.url}
                  <ExternalLink size={10} />
                </a>
              ) : (
                <span>{e.sourceTitle}</span>
              )}
            </div>
          )}
        </div>
        <Confidence value={e.confidence} />
      </div>
    </ItemCard>
  );
}

function SignalItem({ s, isTerritorial }: { s: CodifySignal; isTerritorial: boolean }) {
  const badge = badgeForSignal(s, isTerritorial);
  return (
    <ItemCard>
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <Badge kind={badge} />
          </div>
          {s.title && (
            <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-100 leading-snug">
              {s.title}
            </p>
          )}
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed line-clamp-2">
            {s.summary}
          </p>
        </div>
        <Confidence value={s.confidence} />
      </div>
    </ItemCard>
  );
}

function Skeleton() {
  // Skeleton neutro: 2 retângulos cinza animados. Sem spinner novo.
  return (
    <div className="space-y-2 animate-pulse">
      {[0, 1].map(i => (
        <div
          key={i}
          className="h-14 rounded-lg bg-neutral-200/70 dark:bg-[#252525]"
        />
      ))}
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

export function WorkspaceContextBlock(props: WorkspaceContextBlockProps) {
  const { evidences, signals, mapSignals, loading, error } = props;

  const hasContent =
    evidences.length > 0 || signals.length > 0 || mapSignals.length > 0;

  // Empty silencioso (inclui error) — bloco inteiro não renderiza.
  if (!loading && !hasContent) return null;
  // Note: 'error' é apenas info pro consumer; UI trata error igual a empty.
  void error;

  return (
    <div className="mt-2">
      <h2 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-3">
        Contexto Editorial
      </h2>

      <div className="space-y-4">
        {loading && <Skeleton />}

        {!loading && evidences.length > 0 && (
          <div>
            <SectionHeader label="Evidências" count={evidences.length} />
            <div className="space-y-2">
              {evidences.map(e => (
                <EvidenceItem key={e.id} e={e} />
              ))}
            </div>
          </div>
        )}

        {!loading && signals.length > 0 && (
          <div>
            <SectionHeader
              label="Signals — monitoramento a configurar"
              count={signals.length}
            />
            <div className="space-y-2">
              {signals.map(s => (
                <SignalItem key={s.id} s={s} isTerritorial={false} />
              ))}
            </div>
          </div>
        )}

        {!loading && mapSignals.length > 0 && (
          <div>
            <SectionHeader
              label="Monitoramento territorial — estrutura pendente"
              count={mapSignals.length}
            />
            <div className="space-y-2">
              {mapSignals.map(s => (
                <SignalItem key={s.id} s={s} isTerritorial={true} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
