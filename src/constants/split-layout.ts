// Token compartilhado para o gap vertical no topo de cada coluna em modo split.
// Feed (mt) e ChatDesktop (pb do header wrapper) precisam usar o MESMO valor
// para que as duas colunas pareçam alinhadas no mesmo grid vertical.
// Em split, o `mainPadTop` (App.tsx) já posiciona o feed alinhado com o
// ChatDesktop top. Por isso o feed wrapper NÃO recebe margin-top em split —
// senão somaria 20px extras e desalinharia verticalmente.
export const SPLIT_TOP_GAP_MT = '';
export const SPLIT_TOP_GAP_PB = 'pb-5';

// Moldura da tela: respiro único de 20px em TODAS as bordas e gaps.
// - Laterais: mx-5, pr-5, right-5, ml-5, pl-5 (20px).
// - Top do ChatDesktop (e do feed alinhado): 98px = 20 (nav sticky top-5)
//   + ~58 (nav height default) + 20 (frame gap). mainPadTop deriva desse valor.
export const SPLIT_FRAME_GAP_PX = 20;
export const SPLIT_FRAME_TOP_PX = 98;
export const NAV_STICKY_TOP_PX = 20;

// Ajuste fino aplicado a SPLIT_FRAME_TOP_PX tanto no topo do ChatDesktop
// (ChatPanel.tsx) quanto no mainPadTop do feed (App.tsx). Precisa ser o
// MESMO valor nos dois lados — por isso vive aqui como constante única, em
// vez de "+ 12" solto repetido nos dois arquivos.
export const SPLIT_FRAME_TOP_EXTRA_PX = 12;

export interface DesktopChatLayout {
  /** Espaço total (px) que o feed precisa reservar à direita pra não ficar
      coberto pelo ChatDesktop pequeno (rightPx + largura do painel + gap). */
  reservedRightPx: number;
  /** Distância (px) do painel até a borda direita da viewport. */
  rightPx: number;
  /** Largura (px) do painel — undefined quando `wide` (split-view usa
      'calc(50vw - 20px)', uma largura relativa, não um px fixo). */
  widthPx: number | undefined;
}

// Fonte única da posição/largura do ChatDesktop — usada tanto por
// ChatPanel.tsx (posiciona o painel de verdade) quanto por App.tsx (calcula
// quanto espaço o feed precisa reservar pra não ficar coberto por ele).
// Antes essa fórmula só existia em ChatPanel.tsx, e App.tsx usava classes
// Tailwind fixas (lg:pr-[320px] xl:pr-[336px]) que não acompanhavam a
// posição real — daí o feed ficar mais ou menos espremido dependendo da
// largura exata da janela. Não inventar matemática nova aqui: mesma fórmula
// de antes, só extraída pra um lugar só.
export function getDesktopChatLayout(windowWidth: number, wide: boolean): DesktopChatLayout {
  const pr = windowWidth >= 1280 ? 336 : 320;
  const rightPx = wide ? 20 : Math.max(5, (windowWidth + pr - 1575) / 2);
  const widthPx = wide ? undefined : 340;
  const reservedRightPx = rightPx + (widthPx ?? 0) + 20;
  return { reservedRightPx, rightPx, widthPx };
}
