// useOS1WorkspaceBridge — ponte cross-frame para "Analisar minha empresa".
//
// Escuta `window.message` filtrando por `data.type === 'OS1_ANALYZE_COMPANY'`
// (constante `OS1_POST_MESSAGE.ANALYZE_COMPANY`). Caso o iframe da Esfera
// (ou outra origem confiável) queira disparar a Análise da empresa via
// postMessage, este hook chama `onAnalyze()` — que deve abrir o
// diagnóstico na Área de Trabalho (sem overlay sobre o feed).
//
// Conteúdo extraído de src/App.tsx (Fase 17) — sem alteração de
// comportamento. O pattern de `useRef` + `useEffect (sem deps)` para
// manter a callback fresca foi preservado byte-a-byte:
//   const openDiagnosisRef = useRef(onAnalyze);
//   useEffect(() => { openDiagnosisRef.current = onAnalyze; });
//   useEffect(() => { window.addEventListener('message', ...); }, []);

import { useEffect, useRef } from 'react';
import { OS1_POST_MESSAGE } from './os1-events';

interface UseOS1WorkspaceBridgeArgs {
  /** Função que dispara o fluxo de "Analisar minha empresa". */
  onAnalyze: () => Promise<void> | void;
}

export function useOS1WorkspaceBridge({ onAnalyze }: UseOS1WorkspaceBridgeArgs): void {
  // Ref evita re-attach do listener a cada render (mesmo pattern do App.tsx).
  const onAnalyzeRef = useRef(onAnalyze);
  useEffect(() => { onAnalyzeRef.current = onAnalyze; });

  useEffect(() => {
    const onMessage = (ev: MessageEvent) => {
      const d = ev.data;
      if (!d || typeof d !== 'object') return;
      if (d.type !== OS1_POST_MESSAGE.ANALYZE_COMPANY) return;
      void onAnalyzeRef.current();
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);
}
