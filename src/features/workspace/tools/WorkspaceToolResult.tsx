// Render do conteúdo do bloco gerado por uma ferramenta.
//
// Mantém estética do painel para criar continuidade visual entre a
// caixa de Ferramentas e o resultado produzido por ela.
//
// Conteúdo movido de src/components/WorkspaceTools.tsx (Fase 8) —
// JSX, classes, ordem dos blocos e textos preservados byte-a-byte.
// Era exportado como `ToolBlockContent`; mantemos esse nome público
// via re-export na fachada src/components/WorkspaceTools.tsx.

import type { ToolOutput } from '../../../core/types/workspace';

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
