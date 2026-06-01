// Painel principal de Ferramentas da Área de Trabalho.
//
// Caixa visual separada — NÃO é dropdown nem menu. Orquestra:
//   - WorkspaceToolsHeader  (ícone + título + chevron)
//   - WorkspaceToolCard     (cards-botões em grid 2 colunas)
//   - botão "Ver mais ferramentas (N)" / "Mostrar menos"
//
// Comportamento: pega o conjunto de ferramentas via getToolsForContext,
// limita a 6 inicialmente, gera novo bloco no clique (via onRun).
// Conteúdo movido de src/components/WorkspaceTools.tsx (Fase 8).

import { useState } from 'react';
import {
  getToolsForContext,
  runWorkspaceTool,
} from '../../../lib/workspace-tools';
import type {
  WorkspaceTool,
  WorkspaceToolContext,
  ToolOutput,
} from '../../../core/types/workspace';
import { WorkspaceToolsHeader } from './WorkspaceToolsHeader';
import { WorkspaceToolCard } from './WorkspaceToolCard';

interface WorkspaceToolsPanelProps {
  ctx: WorkspaceToolContext;
  onRun: (tool: WorkspaceTool, output: ToolOutput) => void;
  defaultOpen?: boolean;
}

const INITIAL_VISIBLE = 6;

export function WorkspaceToolsPanel({ ctx, onRun, defaultOpen = true }: WorkspaceToolsPanelProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [showAll, setShowAll] = useState(false);

  const sel = getToolsForContext(ctx);
  if (sel.total === 0) return null;

  const allTools: WorkspaceTool[] = [
    ...sel.gerais,
    ...sel.area,
    ...sel.perfil,
    ...sel.origem,
  ];
  const visible = showAll ? allTools : allTools.slice(0, INITIAL_VISIBLE);
  const hidden = Math.max(0, allTools.length - INITIAL_VISIBLE);

  const handleClick = (tool: WorkspaceTool) => {
    const output = runWorkspaceTool(tool, ctx);
    onRun(tool, output);
  };

  return (
    <div className="px-3.5 pt-3 pb-3.5">
      <div
        className="
          rounded-2xl
          border border-neutral-200 dark:border-[#454545]
          bg-[#fbfcfd] dark:bg-[#2a2a2a]
          shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_2px_8px_-2px_rgba(0,0,0,0.08)]
          dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_2px_8px_-2px_rgba(0,0,0,0.4)]
        "
      >
        {/* Cabeçalho do painel — não é botão de menu, é cabeçalho da caixa */}
        <WorkspaceToolsHeader open={open} onToggle={() => setOpen((v) => !v)} />

        {open && (
          <div className="px-3.5 pb-3 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {visible.map((tool) => (
                <WorkspaceToolCard
                  key={tool.id}
                  tool={tool}
                  onClick={() => handleClick(tool)}
                />
              ))}
            </div>

            {hidden > 0 && (
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                className="
                  mt-2.5 w-full
                  text-[11px] font-semibold
                  text-neutral-500 dark:text-neutral-400
                  hover:text-[#3b82f6] dark:hover:text-[#60a5fa]
                  py-1.5 rounded-md
                  border border-dashed border-neutral-200 dark:border-[#4a4a4a]
                  hover:border-[#3b82f6] dark:hover:border-[#60a5fa]
                  transition-colors
                "
              >
                {showAll ? 'Mostrar menos' : `Ver mais ferramentas (${hidden})`}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
