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

interface WorkspaceBlockHeaderProps {
  kind: BlockKind | undefined;
  mode: MainKey;
  subLabel: string;
  pinned?: boolean;
  createdAt: string;
  headerColor: string;
}

export function WorkspaceBlockHeader({
  kind, mode, subLabel, pinned, createdAt, headerColor,
}: WorkspaceBlockHeaderProps) {
  const isInitial = kind === 'initial';
  const isShare   = kind === 'share';
  const isMode    = kind === 'mode';
  const isTool    = kind === 'tool';
  const isDiag    = kind === 'diagnostico';

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
      {pinned && <Pin size={10} className="text-amber-500 flex-shrink-0" />}
      <span className="text-[9px] text-neutral-400 tabular-nums">
        {new Date(createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
}
