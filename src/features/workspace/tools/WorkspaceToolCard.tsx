// Card individual de Ferramenta.
//
// Botão-card com ícone + título + descrição curta. NÃO é chip — é
// um cartão operacional com presença visual própria, focado em
// entregar trabalho prático.
//
// Conteúdo movido de src/components/WorkspaceTools.tsx (Fase 8).
// JSX, classes, ícones por grupo e descrições por grupo preservados
// byte-a-byte. As constantes GROUP_ICON, GROUP_BLURB e o helper
// toolBlurb vivem aqui porque são consumidos só pelo card.

import {
  CheckSquare,
  ListChecks,
  FileSearch,
  Send,
  Activity,
  ShieldCheck,
  BarChart3,
  FileText,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ToolGroup, WorkspaceTool } from '../../../core/types/workspace';

const GROUP_ICON: Record<ToolGroup, LucideIcon> = {
  decisao: CheckSquare,
  execucao: ListChecks,
  evidencia: FileSearch,
  comunicacao: Send,
  monitoramento: Activity,
  validacao: ShieldCheck,
  analise: BarChart3,
  documento: FileText,
};

const GROUP_BLURB: Record<ToolGroup, string> = {
  decisao: 'Estrutura uma decisão prática.',
  execucao: 'Gera um plano executável.',
  evidencia: 'Organiza evidências e lacunas.',
  comunicacao: 'Prepara mensagem pronta pra enviar.',
  monitoramento: 'Cria rotina de acompanhamento.',
  validacao: 'Confere o que ficou em pé.',
  analise: 'Estrutura uma análise rápida.',
  documento: 'Produz documento pronto pra arquivar.',
};

// Devolve a descrição da ferramenta — usa o campo explícito quando existe,
// senão deriva uma frase curta a partir do grupo. Mantém o texto humano
// (sem jargão interno) e curto pra caber dentro do card.
function toolBlurb(tool: WorkspaceTool): string {
  if (tool.description) return tool.description;
  return GROUP_BLURB[tool.group] || 'Ação prática para continuar o trabalho.';
}

interface WorkspaceToolCardProps {
  tool: WorkspaceTool;
  onClick: () => void;
}

export function WorkspaceToolCard({ tool, onClick }: WorkspaceToolCardProps) {
  const Icon = GROUP_ICON[tool.group] || ListChecks;
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group/tool
        flex items-start gap-2.5
        text-left
        px-3 py-2.5
        rounded-xl
        bg-white dark:bg-[#333333]
        border border-neutral-200 dark:border-[#484848]
        hover:border-[#3b82f6] dark:hover:border-[#60a5fa]
        hover:bg-[#f5f8ff] dark:hover:bg-[#3a4255]
        hover:shadow-[0_4px_12px_-4px_rgba(59,130,246,0.25)]
        active:scale-[0.985]
        transition-all duration-150
      "
    >
      <div
        className="
          shrink-0 w-7 h-7 rounded-lg
          flex items-center justify-center
          bg-[#eef2f7] dark:bg-[#3f3f3f]
          text-neutral-600 dark:text-neutral-300
          group-hover/tool:bg-[#3b82f6]
          group-hover/tool:text-white
          transition-colors
        "
      >
        <Icon size={13} />
      </div>
      <div className="flex flex-col leading-tight min-w-0">
        <span
          className="
            text-[12px] font-semibold
            text-neutral-800 dark:text-neutral-100
            group-hover/tool:text-[#1e3a8a]
            dark:group-hover/tool:text-white
            truncate
          "
        >
          {tool.label}
        </span>
        <span
          className="
            text-[10.5px]
            text-neutral-500 dark:text-neutral-400
            leading-snug mt-0.5
            line-clamp-2
          "
        >
          {toolBlurb(tool)}
        </span>
      </div>
    </button>
  );
}
