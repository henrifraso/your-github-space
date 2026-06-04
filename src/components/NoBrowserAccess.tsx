// Tela mostrada quando o app é aberto em browser comum (Chrome/Safari/etc).
// O OS¹ só funciona dentro do Electron — esta tela direciona pro download.

const MAC_ARM64_URL = 'https://github.com/henrifraso/your-github-space/releases/latest/download/OS1-mac-arm64.dmg';
const MAC_INTEL_URL = 'https://github.com/henrifraso/your-github-space/releases/latest/download/OS1-mac-x64.dmg';
const WIN_URL       = 'https://github.com/henrifraso/your-github-space/releases/latest/download/OS1-windows.exe';

export function NoBrowserAccess() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6 py-10 bg-[#0a0a0a] text-white font-sans">
      <div className="w-full max-w-md text-center space-y-7">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-3">OS¹</p>
          <h1 className="text-2xl font-semibold tracking-tight mb-2">O app desktop precisa ser instalado</h1>
          <p className="text-sm text-neutral-400 leading-relaxed">
            O OS¹ funciona apenas no aplicativo nativo. Baixe e abra o instalador pra continuar.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={MAC_ARM64_URL}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-black text-sm font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17.05 12.04c-.03-3.02 2.46-4.46 2.58-4.54-1.4-2.06-3.6-2.34-4.39-2.37-1.87-.19-3.65 1.1-4.6 1.1-.95 0-2.41-1.07-3.96-1.04-2.04.03-3.92 1.19-4.97 3.01-2.12 3.67-.54 9.1 1.53 12.07 1 1.45 2.2 3.08 3.74 3.02 1.5-.06 2.07-.97 3.88-.97 1.8 0 2.32.97 3.9.94 1.61-.03 2.63-1.48 3.62-2.94 1.14-1.69 1.61-3.31 1.64-3.4-.04-.02-3.14-1.21-3.17-4.78zM14.13 3.79c.83-1.01 1.39-2.4 1.24-3.79-1.2.05-2.65.8-3.51 1.81-.77.89-1.45 2.32-1.27 3.68 1.34.1 2.71-.69 3.54-1.7z"/></svg>
            Baixar pra macOS
          </a>
          <a
            href={WIN_URL}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#f7f8f9]/10 text-white text-sm font-semibold border border-white/15 hover:bg-white/15 transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M0 3.449L9.75 2.1v9.451H0V3.449zm0 17.151L9.75 21.9v-9.301H0V20.6zM10.949 2.1l13.05-1.8v11.249H10.949V2.1zM10.949 21.9L24 23.7V12.6H10.949V21.9z"/></svg>
            Baixar pra Windows
          </a>
        </div>
        <p className="text-xs text-neutral-500">
          Mac Intel? <a href={MAC_INTEL_URL} className="underline">Baixe aqui</a>. Em caso de dúvida, fale com a Codify.
        </p>
      </div>
    </div>
  );
}
