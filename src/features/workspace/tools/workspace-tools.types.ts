// Tipos das Ferramentas — re-export central.
//
// Tipos públicos vivem em `core/types/workspace.ts` (movidos na Fase 3).
// Este arquivo existe pra que o módulo `features/workspace/tools/` tenha
// seu próprio ponto de entrada de tipos, conforme convenção da pasta.

export type {
  ToolGroup, ToolSource, ToolMode,
  ToolOutput, WorkspaceToolContext, WorkspaceTool,
} from '../../../core/types/workspace';
