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
