// Observa a classe `dark` em <html> e devolve um booleano reativo.
// O App.tsx já controla `document.documentElement.classList.toggle('dark')`
// — este hook só espelha esse estado pra componentes que precisam reagir
// (Mapa, Navegador, etc.) sem precisar consumir o state do App.

import { useEffect, useState } from 'react';

export function useDarkMode(): boolean {
  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const update = () => setIsDark(document.documentElement.classList.contains('dark'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return isDark;
}
