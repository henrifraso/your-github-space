// Componentes de conteúdo de blocos da Área de Trabalho.
//
// Extraídos de src/components/ChatPanel.tsx (Fase 9). Cada componente
// é puramente de renderização — recebe dados via props e devolve JSX,
// sem dependência de refs / hooks externos do ChatBody.
//
// Mantidos byte-a-byte: campos, classes, ícones, textos visíveis,
// ordem dos blocos e estilos preservados.
//
// IMPORTANTE: ainda não estão aqui:
//   - `ShareOptionsContent`  (depende de SHARE_OPTIONS, lista de 5 opções
//                            com text builders — vive no ChatPanel)
//   - `ModeBlockContent`     (depende de MODE_FIELDS por MainKey)
//
// Esses ficam no ChatPanel até a Fase 10 (geração) reorganizar as
// constantes compartilhadas, sem risco de quebrar o render atual.

import type { CompanyDiagnosticPayload } from '../../../core/types/workspace';

// ─────────────────────────────────────────────────────────────────────
// Bloco INITIAL — "Análise inicial"
// 8 campos canônicos do resultado, exibidos quando presentes.
// ─────────────────────────────────────────────────────────────────────
export function InitialBlockContent({ result }: { result: Record<string, unknown> }) {
  const fields: { label: string; key: string; emphasis?: boolean }[] = [
    { label: 'O que aconteceu',   key: 'o_que_aconteceu' },
    { label: 'Por que importa',   key: 'por_que_importa', emphasis: true },
    { label: 'Onde afeta',        key: 'onde_afeta' },
    { label: 'Risco',             key: 'risco' },
    { label: 'Oportunidade',      key: 'oportunidade' },
    { label: 'Domínio',           key: 'dominio' },
    { label: 'Contexto para análise', key: 'acao_recomendada', emphasis: true },
    { label: 'Próximo passo',     key: 'proximo_passo' },
  ];
  return (
    <div className="space-y-2.5">
      {fields.map(f => {
        const v = result[f.key];
        if (!v) return null;
        return (
          <div key={f.key}>
            <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-0.5">{f.label}</p>
            <p className={`text-[12px] leading-relaxed ${f.emphasis ? 'text-neutral-800 dark:text-neutral-200 font-medium' : 'text-neutral-600 dark:text-neutral-400'}`}>
              {String(v)}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Bloco DIAGNÓSTICO — "Análise da empresa"
// 6 seções claras + score de maturidade + aviso legal opcional.
// Linguagem de produto, sem jargão técnico de ontologia.
// ─────────────────────────────────────────────────────────────────────
export function DiagnosticBlockContent({ payload }: { payload: CompanyDiagnosticPayload }) {
  const sections: { label: string; items?: string[]; text?: string; emphasis?: boolean }[] = [
    { label: 'Resumo',              text: payload.summary, emphasis: true },
    { label: 'Áreas fortes',        items: payload.strongDomains },
    { label: 'Lacunas',             items: payload.gaps },
    { label: 'Riscos potenciais',   items: payload.risks },
    { label: 'Oportunidades',       items: payload.opportunities },
    { label: 'Próximos passos',     items: payload.nextSteps, emphasis: true },
  ];
  return (
    <div className="space-y-3">
      {typeof payload.maturityScore === 'number' && (
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#eff6ff] dark:bg-[#1e3a5f]/40 border border-[#bfdbfe] dark:border-[#3b82f6]/30">
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#1e40af] dark:text-[#93c5fd]">Maturidade</p>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-300">Leitura geral da estrutura observada.</p>
          </div>
          <div className="text-[20px] font-bold tabular-nums text-[#1e40af] dark:text-[#93c5fd]">{payload.maturityScore}</div>
        </div>
      )}
      {sections.map((s, idx) => {
        const hasItems = s.items && s.items.length > 0;
        const hasText  = !!s.text;
        if (!hasItems && !hasText) return null;
        return (
          <div key={idx}>
            <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">{s.label}</p>
            {hasText && (
              <p className={`text-[12px] leading-relaxed ${s.emphasis ? 'text-neutral-800 dark:text-neutral-200 font-medium' : 'text-neutral-600 dark:text-neutral-400'}`}>
                {s.text}
              </p>
            )}
            {hasItems && (
              <ul className="flex flex-col gap-1">
                {s.items!.map((item, i) => (
                  <li key={i} className={`text-[12px] leading-relaxed pl-3 relative ${s.emphasis ? 'text-neutral-800 dark:text-neutral-200' : 'text-neutral-600 dark:text-neutral-300'}`}>
                    <span className="absolute left-0 top-[0.45em] w-1 h-1 rounded-full bg-[#0ea5e9]" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
      {payload.legalNotice && (
        <div className="text-[10.5px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1.5 rounded-md border border-amber-200 dark:border-amber-800/40 leading-relaxed">
          {payload.legalNotice}
        </div>
      )}
    </div>
  );
}
