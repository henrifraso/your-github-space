// Execução de uma ferramenta da Área de Trabalho.
//
// Recebe a tool selecionada + contexto e devolve o ToolOutput.
// Conteúdo movido de src/lib/workspace-tools.ts (Fase 7) — sem
// alteração de comportamento.
//
// Hoje é puramente local/fallback (template síncrono). Futuramente
// pode passar a delegar pra backend / LLM / integrações; a interface
// pública (`runWorkspaceTool`) permanece igual.

import type {
  ToolOutput,
  WorkspaceTool,
  WorkspaceToolContext,
} from '../../../core/types/workspace';
import { ctxPhrase, mkSensitive } from './workspace-tools.templates';

export function runWorkspaceTool(tool: WorkspaceTool, ctx: WorkspaceToolContext): ToolOutput {
  try {
    const output = tool.template(ctx);
    if (output.sensitiveNotice == null) {
      const notice = mkSensitive(ctx);
      if (notice) output.sensitiveNotice = notice;
    }
    return output;
  } catch (err) {
    return {
      title: tool.label,
      context: `Não foi possível gerar o conteúdo para ${ctxPhrase(ctx)}.`,
      items: ['Tente novamente em alguns instantes.', 'Se persistir, ajuste o contexto e repita.'],
      expectedResult: 'Sem resultado neste momento.',
      nextStep: 'Repetir a ação ou escolher outra ferramenta.',
    };
  }
}
