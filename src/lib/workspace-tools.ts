// ─────────────────────────────────────────────────────────────────────
// Fachada das Ferramentas da Área de Trabalho — OS¹
//
// Este arquivo virou um ponto de re-export depois da Fase 7. O conteúdo
// real foi separado em módulos menores dentro de
//   src/features/workspace/tools/
//
//   .templates.ts   — helpers (sensibilidade, frase contextual, etc.)
//   .catalog.ts     — 17 catálogos de ferramentas (gerais, áreas, perfis)
//   .selector.ts    — getToolsForContext + helpers de grupo
//   .runner.ts      — runWorkspaceTool
//   .types.ts       — re-export dos tipos de core/types/workspace
//
// Imports antigos do tipo `from '../lib/workspace-tools'` continuam
// funcionando — todos os símbolos públicos saem daqui.
//
// COMENTÁRIO TÉCNICO (não exibido ao usuário):
// As ferramentas da Área de Trabalho são a camada operacional do OS¹.
// Nesta fase funcionam em fallback local/template. Futuramente cada
// ferramenta pode ser conectada a backend, LLM, APIs, integrações,
// workflows, criação de tarefas, envio de mensagens, geração de
// documentos e automações. Elas também servem como base para empacotar
// funções comerciais por plano, perfil, área ou setor.
//
// Vocabulário visível ao usuário NUNCA usa: "ontologia", "algoritmo",
// "domínio ontológico", "agente", "IA", "ativar inteligência".
// Usa sempre verbos de trabalho real: revisar, separar, criar, simular,
// preparar, enviar, comparar, registrar, marcar.
// ─────────────────────────────────────────────────────────────────────

// Tipos
export type {
  ToolGroup, ToolSource, ToolMode,
  ToolOutput, WorkspaceToolContext, WorkspaceTool,
} from '../core/types/workspace';

// Helpers compartilhados / sensibilidade / inferência
export {
  SENSITIVE_AREAS,
  SENSITIVE_NOTICE,
  isSensitiveDomain,
  inferSourceFromCardId,
  ctxPhrase,
} from '../features/workspace/tools/workspace-tools.templates';

// Catálogos
export {
  TOOLS_GERAIS,
  TOOLS_FISCAL,
  TOOLS_JURIDICO,
  TOOLS_FINANCEIRO,
  TOOLS_MARKETING,
  TOOLS_VENDAS,
  TOOLS_OPERACAO,
  TOOLS_COMPRAS,
  TOOLS_RH,
  TOOLS_TECNOLOGIA,
  TOOLS_MERCADO,
  TOOLS_DOCUMENTO,
  TOOLS_PERFIL_CENTRAL,
  TOOLS_PERFIL_UNIDADE,
  TOOLS_PERFIL_CODIFY,
  TOOLS_PERFIL_AFILIADO,
  TOOLS_PERFIL_PARCEIRO,
} from '../features/workspace/tools/workspace-tools.catalog';

// Seletor + metadados de grupo
export {
  getToolsForContext,
  GROUP_LABEL,
  GROUP_ORDER,
  groupTools,
} from '../features/workspace/tools/workspace-tools.selector';

// Runner
export { runWorkspaceTool } from '../features/workspace/tools/workspace-tools.runner';
