// WorkspaceShortcutsBlock — bloco compacto de atalhos contextuais.
//
// Substitui o painel grande de "Ferramentas" pelo formato:
//   [Tipo] Frase curta descritiva. CTA →
//
// Regras visuais:
//   - 1 a 3 atalhos no máximo
//   - sem cabeçalho "Ferramentas"
//   - sem grid de cards
//   - sem ícone grande
//   - sem painel grande
//   - [Dado] é apenas leitura (não clicável)
//   - [Referência] / [Ferramenta] / [Atalho] / [Conexão] são clicáveis
//   - Cor da pílula varia por tipo
//
// O caller controla o `onRun` — clique gera novo bloco abaixo no ChatPanel.

import { ArrowRight } from 'lucide-react';
import { Toast, useToast } from '../../../components/Toast';
import type {
  ShortcutKind,
  ShortcutTier,
  WorkspaceShortcut,
  WorkspaceToolContext,
  ToolOutput,
} from '../../../core/types/workspace';
import { getShortcutsForContext } from './workspace-shortcuts.selector';
import { runShortcut } from './workspace-shortcuts.runner';

interface WorkspaceShortcutsBlockProps {
  ctx: WorkspaceToolContext;
  onRun: (shortcut: WorkspaceShortcut, output: ToolOutput) => void;
}

// Rótulo visível e cor da pílula por tipo.
const KIND_LABEL: Record<ShortcutKind, string> = {
  dado:       'Dado',
  referencia: 'Referência',
  ferramenta: 'Ferramenta',
  atalho:     'Atalho',
  conexao:    'Conexão',
};

// Tom de cor sutil pra cada tipo. Mantém o bloco "premium e direto".
const KIND_PILL: Record<ShortcutKind, string> = {
  dado:       'bg-neutral-100  text-neutral-600  dark:bg-[#3a3a3a] dark:text-neutral-300',
  referencia: 'bg-blue-50      text-blue-700     dark:bg-blue-900/30  dark:text-blue-300',
  ferramenta: 'bg-violet-50    text-violet-700   dark:bg-violet-900/30 dark:text-violet-300',
  atalho:     'bg-emerald-50   text-emerald-700  dark:bg-emerald-900/25 dark:text-emerald-300',
  conexao:    'bg-amber-50     text-amber-700    dark:bg-amber-900/25 dark:text-amber-300',
};

// Badge de tier — aparece só para beta / api_parceira / em_breve.
// 'incluso' não renderiza badge (é o padrão silencioso).
const TIER_LABEL: Partial<Record<ShortcutTier, string>> = {
  incluso:      'Incluso',
  beta:         'Beta',
  api_parceira: 'API parceira',
  em_breve:     'Em breve',
};

const TIER_PILL: Partial<Record<ShortcutTier, string>> = {
  incluso:      'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/25 dark:text-emerald-400',
  beta:         'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  api_parceira: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  em_breve:     'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400',
};

// Cor do CTA (texto + seta) por tipo — segue a cor da pílula.
const KIND_CTA: Record<ShortcutKind, string> = {
  dado:       '',
  referencia: 'text-blue-600    dark:text-blue-400    hover:text-blue-700    dark:hover:text-blue-300',
  ferramenta: 'text-violet-600  dark:text-violet-400  hover:text-violet-700  dark:hover:text-violet-300',
  atalho:     'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300',
  conexao:    'text-amber-600   dark:text-amber-400   hover:text-amber-700   dark:hover:text-amber-300',
};

export function WorkspaceShortcutsBlock({ ctx, onRun }: WorkspaceShortcutsBlockProps) {
  const shortcuts = getShortcutsForContext(ctx);
  const { toast, show: showToast, hide: hideToast } = useToast();
  const showTierBadge = ctx.role === 'codify' && ctx.activeSector === 'os1';
  if (shortcuts.length === 0) return null;

  const handleClick = (sc: WorkspaceShortcut) => {
    if (sc.kind === 'dado' || !sc.template) return;
    const output = runShortcut(sc, ctx);
    onRun(sc, output);
    showToast(output.title, 'blue');
  };

  return (
    <>
      <div
        className="
          w-full
          rounded-xl
          border-[0.5px] border-neutral-200 dark:border-[#3d3d3d]
          bg-[#fbfcfd] dark:bg-[#2a2a2a]
          shadow-[0_2px_6px_-2px_rgba(0,0,0,0.08)]
          dark:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.35)]
          px-3.5 py-3
        "
      >
        <div className="flex flex-col gap-3">
          {shortcuts.map((sc) => {
            const clickable = sc.kind !== 'dado' && !!sc.template;
            return (
              <ShortcutRow
                key={sc.id}
                shortcut={sc}
                clickable={clickable}
                showTierBadge={showTierBadge}
                onClick={() => handleClick(sc)}
              />
            );
          })}
        </div>
      </div>
      <Toast message={toast.message} color={toast.color} visible={toast.visible} onHide={hideToast} />
    </>
  );
}

interface ShortcutRowProps {
  shortcut: WorkspaceShortcut;
  clickable: boolean;
  showTierBadge: boolean;
  onClick: () => void;
}

function ShortcutRow({ shortcut, clickable, showTierBadge, onClick }: ShortcutRowProps) {
  const pill = KIND_PILL[shortcut.kind];
  const ctaColor = KIND_CTA[shortcut.kind];
  const label = KIND_LABEL[shortcut.kind];

  const tierLabel = shortcut.tier ? TIER_LABEL[shortcut.tier] : undefined;
  const tierPill  = shortcut.tier ? TIER_PILL[shortcut.tier]  : undefined;

  // Linha não-clicável (dado): renderiza como bloco estático.
  if (!clickable) {
    return (
      <div className="flex items-start gap-2 text-[12px] leading-[1.55] text-neutral-700 dark:text-neutral-200">
        <span className={`shrink-0 mt-0.5 inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold tracking-wide ${pill}`}>
          {label}
        </span>
        {showTierBadge && tierLabel && tierPill && (
          <span className={`shrink-0 mt-0.5 inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold tracking-wide ${tierPill}`}>
            {tierLabel}
          </span>
        )}
        <span className="flex-1 text-neutral-600 dark:text-neutral-300">{shortcut.tagline}</span>
      </div>
    );
  }

  // Linha clicável: hover sutil, sem aparência de botão grande nem de menu.
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        flex items-start gap-2
        text-left text-[12px] leading-[1.55]
        text-neutral-700 dark:text-neutral-200
        hover:bg-neutral-50 dark:hover:bg-[#363636]
        rounded-md px-1 -mx-1 py-0.5
        transition-colors
      "
    >
      <span className={`shrink-0 mt-0.5 inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold tracking-wide ${pill}`}>
        {label}
      </span>
      {showTierBadge && tierLabel && tierPill && (
        <span className={`shrink-0 mt-0.5 inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold tracking-wide ${tierPill}`}>
          {tierLabel}
        </span>
      )}
      <span className="flex-1 text-neutral-600 dark:text-neutral-300">
        {shortcut.tagline}{' '}
        {shortcut.cta && (
          <span className={`whitespace-nowrap font-medium ${ctaColor} transition-colors inline-flex items-center gap-0.5`}>
            {shortcut.cta}
            <ArrowRight size={11} className="inline-block translate-y-[1px] group-hover:translate-x-0.5 transition-transform" />
          </span>
        )}
      </span>
    </button>
  );
}
