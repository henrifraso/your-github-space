// OntologySphereOverlay — overlay fullscreen do iframe da Esfera Ontológica.
//
// O componente é APENAS visual: monta o iframe e os 2 botões sobrepostos
// ("Analisar minha empresa" + Fechar). Nenhuma lógica de diagnóstico
// vive aqui — o `onAnalyze` é chamado tal qual (e o caller decide o que
// fazer, geralmente `openDiagnosisInWorkspace` no App.tsx).
//
// Conteúdo movido de src/App.tsx (Fase 18) byte-a-byte. JSX, classes,
// posicionamento (`fixed top-4 right-4 z-[310]`), z-index `z-[300]` do
// iframe e textos preservados.
//
// Regras críticas (não regredir — registradas no README de features/ontology):
//   - clicar "Analisar minha empresa" envia o resultado para a Área de
//     Trabalho como bloco — nunca como overlay sobre o feed
//   - este componente NÃO abre `CompanyDiagnosisPanel`
//   - `onAnalyze` é apenas um disparador (callback) — toda a orquestração
//     do diagnóstico continua no caller

import { Sparkles, X } from 'lucide-react';

interface OntologySphereOverlayProps {
  open: boolean;
  url: string;
  onClose: () => void;
  onAnalyze: () => void;
}

export function OntologySphereOverlay({ open, url, onClose, onAnalyze }: OntologySphereOverlayProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[300] bg-black">
      <iframe
        src={url}
        className="w-full h-full border-0"
        title="Esfera Ontológica"
      />
      {/* Botão sobreposto: "Analisar empresa" + Fechar */}
      <div className="fixed top-4 right-4 z-[310] flex items-center gap-2">
        <button
          onClick={onAnalyze}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[rgba(184,145,58,0.16)] hover:bg-[rgba(184,145,58,0.28)] border border-[rgba(184,145,58,0.45)] text-white text-[12px] font-semibold shadow-2xl backdrop-blur transition-colors"
        >
          <Sparkles size={13} className="text-[#fbbf24]" />
          Analisar minha empresa
        </button>
        <button
          onClick={onClose}
          className="w-9 h-9 inline-flex items-center justify-center rounded-xl bg-black/55 hover:bg-black/75 border border-white/10 text-white/70 hover:text-white backdrop-blur"
          title="Fechar esfera"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
