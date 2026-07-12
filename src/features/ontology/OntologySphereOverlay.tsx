// OntologySphereOverlay — overlay fullscreen do iframe da Visão da Empresa.
//
// Quando `departments` é fornecido, renderiza uma sidebar à esquerda com
// botões pra cada setor. Click chama `onSelectDepartment` (que normalmente
// atualiza `activeDepartment` no caller). A `url` recebe `?dept=<id>` para
// que o HTML da esfera possa filtrar os termos do setor quando for adaptado
// no futuro.
//
// `onAnalyze` é apenas um disparador (callback) — toda a orquestração
// do diagnóstico continua no caller (geralmente
// `openDiagnosisInWorkspace` no App.tsx), que envia o resultado para a
// Área de Trabalho como bloco — nunca como overlay sobre o feed.

import { useEffect, useMemo } from 'react';
import { Sparkles, X } from 'lucide-react';

interface DepartmentItem {
  id: string;
  label: string;
}

interface OntologySphereOverlayProps {
  open: boolean;
  url: string;
  onClose: () => void;
  onAnalyze: () => void;
  /** Rótulo do CTA. Default: "Analisar empresa". */
  analyzeLabel?: string;
  /** Título visível do iframe (sem "ontologia"). */
  title?: string;
  /** Lista de setores clicáveis na sidebar. Quando vazia, sidebar não aparece. */
  departments?: DepartmentItem[];
  /** Id do setor atualmente ativo (destacado na sidebar). */
  activeDepartment?: string;
  /** Disparado ao clicar em um setor da sidebar. */
  onSelectDepartment?: (id: string) => void;
  /** Quando true, esconde sidebar e botões sobrepostos — só a esfera, ESC fecha. */
  minimal?: boolean;
}

export function OntologySphereOverlay({
  open, url, onClose, onAnalyze,
  analyzeLabel = 'Analisar empresa',
  title = 'Visão da empresa',
  departments,
  activeDepartment,
  onSelectDepartment,
  minimal = false,
}: OntologySphereOverlayProps) {
  // ESC fecha a esfera (substitui o botão X removido).
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);

  // URL com `?dept=` pra o HTML da esfera filtrar (quando adaptado).
  const iframeUrl = useMemo(() => {
    if (!activeDepartment || activeDepartment === 'geral') return url;
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}dept=${encodeURIComponent(activeDepartment)}`;
  }, [url, activeDepartment]);

  if (!open) return null;
  const showSidebar = departments && departments.length > 0;
  return (
    <div className="fixed inset-0 z-[300] bg-black">
      <iframe
        src={iframeUrl}
        className="w-full h-full border-0"
        title={title}
      />
      {/* Sidebar de setores — sobreposição React à esquerda. */}
      {showSidebar && (
        <div className="fixed top-1/2 left-5 -translate-y-1/2 z-[310] flex flex-col gap-2 max-h-[80vh] overflow-y-auto rounded-2xl bg-black/55 backdrop-blur border border-white/10 p-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 px-2 pb-1">Setores</p>
          {departments.map(d => {
            const active = d.id === activeDepartment;
            return (
              <button
                key={d.id}
                onClick={() => onSelectDepartment?.(d.id)}
                className={`text-left px-3 py-2 rounded-xl text-[12px] font-medium transition-colors ${active
                  ? 'bg-[rgba(184,145,58,0.28)] border border-[rgba(184,145,58,0.55)] text-white'
                  : 'bg-white/5 border border-white/10 text-white/75 hover:bg-white/10 hover:text-white'}`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      )}
      {/* Botões sobrepostos: análise contextual + Fechar. Ocultos no modo minimal. */}
      {!minimal && <div className="fixed top-4 right-4 z-[310] flex items-center gap-2">
        <button
          onClick={onAnalyze}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[rgba(184,145,58,0.16)] hover:bg-[rgba(184,145,58,0.28)] border border-[rgba(184,145,58,0.45)] text-white text-[12px] font-semibold shadow-2xl backdrop-blur transition-colors"
        >
          <Sparkles size={13} className="text-[#fbbf24]" />
          {analyzeLabel}
        </button>
        <button
          onClick={onClose}
          className="w-9 h-9 inline-flex items-center justify-center rounded-xl bg-black/55 hover:bg-black/75 border border-white/10 text-white/70 hover:text-white backdrop-blur"
          title="Fechar"
        >
          <X size={14} />
        </button>
      </div>}
    </div>
  );
}
