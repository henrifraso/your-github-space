// WorkspaceTools — fachada compatível.
//
// Os componentes reais vivem em src/features/workspace/tools/:
//   WorkspaceToolsPanel.tsx   — caixa principal (Header + grid + paginação)
//   WorkspaceToolsHeader.tsx  — ícone + título + chevron
//   WorkspaceToolCard.tsx     — card-botão individual
//   WorkspaceToolResult.tsx   — conteúdo do bloco gerado pela ferramenta
//
// Este arquivo continua sendo importado pelo ChatPanel.tsx; mantém os
// nomes públicos antigos (`WorkspaceTools`, `ToolBlockContent`) para
// que nenhum call site precise mudar nesta fase.
//
// Diferença explícita em relação aos botões inline do conteúdo:
//   - Chips inline = pequenos, finos, focados em continuar o texto.
//   - Ferramentas  = cards com título + descrição + ícone, focados em entregar
//                    trabalho prático (planilha, doc, mensagem, decisão).

export { WorkspaceToolsPanel as WorkspaceTools } from '../features/workspace/tools/WorkspaceToolsPanel';
export { ToolBlockContent } from '../features/workspace/tools/WorkspaceToolResult';
