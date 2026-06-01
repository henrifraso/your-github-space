// Execução de um atalho — chama o template e injeta aviso sensível
// quando aplicável. Atalhos do tipo 'dado' não são clicáveis e nunca
// chegam aqui (a UI bloqueia).

import type {
  ToolOutput,
  WorkspaceShortcut,
  WorkspaceToolContext,
} from '../../../core/types/workspace';
import { ctxPhrase, mkSensitive } from './workspace-tools.templates';

export function runShortcut(shortcut: WorkspaceShortcut, ctx: WorkspaceToolContext): ToolOutput {
  if (!shortcut.template) {
    // Fallback defensivo — nunca deve acontecer pra atalhos clicáveis.
    return {
      title: shortcut.tagline,
      context: `Não há geração disponível para "${shortcut.tagline}" no momento.`,
      items: ['Escolha outro atalho ou aguarde a próxima versão.'],
      expectedResult: 'Sem resultado.',
      nextStep: 'Repetir com outro atalho.',
    };
  }
  try {
    const output = shortcut.template(ctx);
    if (output.sensitiveNotice == null) {
      const notice = mkSensitive(ctx);
      if (notice) output.sensitiveNotice = notice;
    }
    return output;
  } catch {
    return {
      title: shortcut.tagline,
      context: `Não foi possível gerar o conteúdo para ${ctxPhrase(ctx)}.`,
      items: ['Tente novamente em alguns instantes.', 'Se persistir, escolha outro atalho.'],
      expectedResult: 'Sem resultado neste momento.',
      nextStep: 'Repetir a ação.',
    };
  }
}
