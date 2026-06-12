// Header do card de bloco da Área de Trabalho.
//
// Faixa fina no topo do card com:
//   - rótulo colorido pelo kind (Análise inicial / Análise da empresa /
//     Compartilhar / Ferramenta da Área de Trabalho / Entender / ...)
//   - subLabel quando aplica (modo, ferramenta, diagnóstico, standard)
//   - pin (se fixado) + timestamp pt-BR (hh:mm)
//
// Extraído de src/components/ChatPanel.tsx (Fase 9). JSX, classes,
// ordem dos elementos e textos preservados byte-a-byte.

import { Pin } from 'lucide-react';
import type { ToolSource } from '../../../core/types/workspace';

// MainKey é interno do ChatPanel — replicado aqui pra que este componente
// não dependa de exports privados. 3 valores literais, baratíssimo.
type MainKey = 'pesquisar' | 'executar' | 'aprender';
type BlockKind = 'standard' | 'initial' | 'share' | 'mode' | 'tool' | 'diagnostico';

// MODE_LABEL idêntico ao original do ChatPanel (rótulo visível por modo).
const MODE_LABEL: Record<MainKey, string> = {
  pesquisar: 'Entender',
  executar:  'Executar',
  aprender:  'Aprender',
};

// Chip de origem — visível apenas para fontes não-triviais.
// 'feed' e ausente ficam sem chip (default silencioso).
const SOURCE_LABEL: Partial<Record<ToolSource, string>> = {
  browser:   'Navegador',
  map:       'Mapa',
  diagnosis: 'Diagnóstico',
  workspace: 'Área de Trabalho',
  upload:    'Arquivo',
  manual:    'Editorial',
};

const SOURCE_PILL: Partial<Record<ToolSource, string>> = {
  browser:   'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  map:       'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
  diagnosis: 'bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400',
  workspace: 'bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400',
  upload:    'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
  manual:    'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400',
};

interface WorkspaceBlockHeaderProps {
  kind: BlockKind | undefined;
  mode: MainKey;
  subLabel: string;
  pinned?: boolean;
  createdAt: string;
  headerColor: string;
  source?: ToolSource;
}

export function WorkspaceBlockHeader({
  kind, mode, subLabel, pinned, createdAt, headerColor, source,
}: WorkspaceBlockHeaderProps) {
  const isInitial = kind === 'initial';
  const isShare   = kind === 'share';
  const isMode    = kind === 'mode';
  const isTool    = kind === 'tool';
  const isDiag    = kind === 'diagnostico';

  const sourceLabel = source ? SOURCE_LABEL[source] : undefined;
  const sourcePill  = source ? SOURCE_PILL[source]  : undefined;

  return (
    <div className="px-3.5 py-2 border-b border-neutral-100 dark:border-[#414141] flex items-center gap-2">
      <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: headerColor }}>
        {isDiag ? 'Análise da empresa' : isInitial ? 'Análise inicial' : isShare ? 'Compartilhar' : isTool ? 'Ferramenta da Área de Trabalho' : isMode ? MODE_LABEL[mode] : MODE_LABEL[mode]}
      </span>
      {(isMode || isTool || isDiag) && (
        <>
          <span className="text-[10px] text-neutral-400">·</span>
          <span className="text-[10px] font-semibold text-neutral-600 dark:text-neutral-300 flex-1 truncate">{subLabel}</span>
        </>
      )}
      {!isInitial && !isShare && !isMode && !isTool && !isDiag && (
        <>
          <span className="text-[10px] text-neutral-400">·</span>
          <span className="text-[10px] font-semibold text-neutral-600 dark:text-neutral-300 flex-1 truncate">{subLabel}</span>
        </>
      )}
      {(isInitial || isShare) && <div className="flex-1" />}
      {sourceLabel && sourcePill && (
        <span className={`shrink-0 inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-medium tracking-wide ${sourcePill}`}>
          {sourceLabel}
        </span>
      )}
      {pinned && <Pin size={10} className="text-amber-500 flex-shrink-0" />}
      <span className="text-[9px] text-neutral-400 tabular-nums">
        {new Date(createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
}
