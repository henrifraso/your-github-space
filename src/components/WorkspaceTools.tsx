// WorkspaceTools — Caixa de Ferramentas da Área de Trabalho.
// Container visual separado que aparece embaixo do conteúdo gerado.
// NÃO é dropdown nem menu; é um painel/caixa com cards-botões operacionais
// que executam funções reais de trabalho (checklist, simular, evidências, etc).
//
// Diferença explícita em relação aos botões inline do conteúdo:
//   - Chips inline = pequenos, finos, focados em continuar o texto.
//   - Ferramentas  = cards com título + descrição + ícone, focados em entregar
//                    trabalho prático (planilha, doc, mensagem, decisão).

import {
  ChevronDown,
  ChevronUp,
  CheckSquare,
  ListChecks,
  FileSearch,
  Send,
  Activity,
  ShieldCheck,
  BarChart3,
  FileText,
  Hammer,
} from 'lucide-react';
import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  getToolsForContext,
  runWorkspaceTool,
} from '../lib/workspace-tools';
import type {
  WorkspaceTool,
  WorkspaceToolContext,
  ToolOutput,
  ToolGroup,
} from '../lib/workspace-tools';

interface WorkspaceToolsProps {
  ctx: WorkspaceToolContext;
  onRun: (tool: WorkspaceTool, output: ToolOutput) => void;
  defaultOpen?: boolean;
}

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

const INITIAL_VISIBLE = 6;

export function WorkspaceTools({ ctx, onRun, defaultOpen = true }: WorkspaceToolsProps) {
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
        <div className="flex items-start justify-between gap-3 px-3.5 pt-3 pb-2">
          <div className="flex items-start gap-2">
            <div className="mt-0.5 w-6 h-6 rounded-md bg-[#eef2f7] dark:bg-[#3a3a3a] border border-neutral-200 dark:border-[#4a4a4a] flex items-center justify-center">
              <Hammer size={12} className="text-neutral-600 dark:text-neutral-300" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[12px] font-semibold text-neutral-800 dark:text-neutral-100">
                Ferramentas
              </span>
              <span className="text-[10.5px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                Ações práticas para continuar este trabalho.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="
              shrink-0 mt-0.5 w-6 h-6 rounded-md
              flex items-center justify-center
              text-neutral-500 dark:text-neutral-400
              hover:bg-neutral-100 dark:hover:bg-[#3a3a3a]
              hover:text-neutral-800 dark:hover:text-neutral-100
              transition-colors
            "
            title={open ? 'Recolher caixa' : 'Expandir caixa'}
          >
            {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>

        {open && (
          <div className="px-3.5 pb-3 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {visible.map((tool) => {
                const Icon = GROUP_ICON[tool.group] || ListChecks;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => handleClick(tool)}
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
              })}
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

// Conteúdo renderizado dentro do bloco gerado por uma ferramenta.
// Mantém estética do painel pra criar continuidade visual entre a caixa
// de Ferramentas e o resultado produzido por ela.
export function ToolBlockContent({ output }: { output: ToolOutput }) {
  return (
    <div className="flex flex-col gap-2.5">
      {output.context && (
        <p className="text-[12px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {output.context}
        </p>
      )}

      {output.items && output.items.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {output.items.map((item, idx) => (
            <li
              key={idx}
              className="text-[12px] text-neutral-700 dark:text-neutral-200 leading-relaxed pl-3 relative"
            >
              <span className="absolute left-0 top-[0.45em] w-1 h-1 rounded-full bg-[#3b82f6]" />
              {item}
            </li>
          ))}
        </ul>
      )}

      {output.expectedResult && (
        <div className="text-[11.5px] text-neutral-600 dark:text-neutral-300 bg-[#f3f4f6] dark:bg-[#373737] px-2.5 py-1.5 rounded-md border-l-2 border-[#3b82f6]">
          <span className="font-semibold text-neutral-700 dark:text-neutral-200">Resultado esperado: </span>
          {output.expectedResult}
        </div>
      )}

      {output.nextStep && (
        <div className="text-[11.5px] text-neutral-600 dark:text-neutral-300">
          <span className="font-semibold text-neutral-700 dark:text-neutral-200">Próximo passo: </span>
          {output.nextStep}
        </div>
      )}

      {output.sensitiveNotice && (
        <div className="text-[10.5px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1.5 rounded-md border border-amber-200 dark:border-amber-800/40 leading-relaxed">
          {output.sensitiveNotice}
        </div>
      )}
    </div>
  );
}
