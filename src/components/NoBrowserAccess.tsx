// Tela mostrada quando o app é aberto em browser desktop comum.
// Direciona pro os1.space (onde a área de Colaboradores faz login + download).

export function NoBrowserAccess() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6 py-10 bg-[#0a0a0a] text-white font-sans">
      <div className="w-full max-w-md text-center space-y-7">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-3">OS¹</p>
          <h1 className="text-2xl font-semibold tracking-tight mb-2">Acesse pelo site oficial</h1>
          <p className="text-sm text-neutral-400 leading-relaxed">
            O OS¹ é distribuído pelo nosso site. Acesse <span className="text-white">os1.space</span> para entrar como colaborador e baixar o app.
          </p>
        </div>
        <div className="flex justify-center">
          <a
            href="https://os1.space"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-black text-sm font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Ir para os1.space
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        </div>
        <p className="text-xs text-neutral-500">
          Em caso de dúvida, fale com a Codify.
        </p>
      </div>
    </div>
  );
}
