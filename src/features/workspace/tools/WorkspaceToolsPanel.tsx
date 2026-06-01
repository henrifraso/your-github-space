// WorkspaceToolsPanel — wrapper compatível.
//
// Esta versão usa o NOVO padrão de atalhos contextuais
// ([Tipo] Descrição. CTA →) — substitui o painel grande de cards
// que existia antes.
//
// O contrato externo segue o mesmo (`ctx` + `onRun`), pra que o
// ChatPanel continue chamando sem precisar mudar. A `WorkspaceTools`
// fachada em `src/components/WorkspaceTools.tsx` aliasa este
// componente como `WorkspaceTools`.

import type {
  ToolOutput,
  WorkspaceTool,
  WorkspaceToolContext,
} from '../../../core/types/workspace';
import { WorkspaceShortcutsBlock } from './WorkspaceShortcutsBlock';

interface WorkspaceToolsPanelProps {
  ctx: WorkspaceToolContext;
  /**
   * Mantém a assinatura antiga (`tool: WorkspaceTool`) pra preservar
   * compatibilidade com o `handleRunTool` no ChatPanel, que usa
   * `tool.id`, `tool.label` e `output`. Internamente convertemos cada
   * shortcut em um `WorkspaceTool` mínimo antes de chamar.
   */
  onRun: (tool: WorkspaceTool, output: ToolOutput) => void;
  /** Mantido por compat — não tem efeito visual no novo formato. */
  defaultOpen?: boolean;
}

export function WorkspaceToolsPanel({ ctx, onRun }: WorkspaceToolsPanelProps) {
  return (
    <WorkspaceShortcutsBlock
      ctx={ctx}
      onRun={(shortcut, output) => {
        // Adaptador: o ChatPanel só consome `id` e `label`. O `label`
        // visível no bloco gerado vem do `title` do output (mais limpo
        // que a tagline longa do atalho). Demais campos são placeholders
        // mínimos pra satisfazer o tipo `WorkspaceTool`.
        const adapted: WorkspaceTool = {
          id: shortcut.id,
          label: output.title,
          group: 'execucao',
          appliesTo: ['*'],
          template: () => output,
        };
        onRun(adapted, output);
      }}
    />
  );
}
