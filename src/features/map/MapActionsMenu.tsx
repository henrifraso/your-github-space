// Menu "OS¹ · Mapa" — dropdown com as 10 ações sobre o território.
//
// Conteúdo movido de src/components/maps/CompetitiveMap.tsx (Fase 14)
// byte-a-byte. JSX, classes, ordem dos botões, ícones e textos
// preservados. O componente é puramente apresentacional: o caller
// decide quando abrir (botão "Ações") e o que fazer no clique
// (`runMapAction(id)`).

import {
  Sparkles, LayoutGrid, BarChart3, Search, GitCompareArrows, Target, Bell,
  AlertTriangle, Briefcase, Handshake, FlaskConical,
} from 'lucide-react';
import type { MapActionId } from './useMapActions';
import { getRole } from '../../hooks/useAuth';

interface MapActionsMenuProps {
  open: boolean;
  onClose: () => void;
  onAction: (id: MapActionId) => void;
  /** Toggle do botão "Ações" — controlado pelo caller. */
  actionsButtonRef?: React.RefObject<HTMLButtonElement>;
  onToggle?: () => void;
}

// 10 entradas do menu — IDs idênticos aos consumidos por `runMapAction`.
// `adminOnly: true` esconde a ação do cliente (só Codify vê). Aplicado
// quando a ação ainda não entrega valor real (ex.: watcher fantasma).
const ACTION_ITEMS: { id: MapActionId; label: string; Icon: typeof LayoutGrid; adminOnly?: boolean }[] = [
  { id: 'feed-from-radius',     label: 'Gerar feed do raio',                Icon: LayoutGrid },
  { id: 'analyze-competition',  label: 'Analisar concorrência local',       Icon: BarChart3 },
  { id: 'find-opportunities',   label: 'Encontrar oportunidades no território', Icon: Search },
  { id: 'compare-regions',      label: 'Comparar regiões',                  Icon: GitCompareArrows },
  { id: 'territory-to-mission', label: 'Transformar território em missão',  Icon: Target },
  // monitor-territory: watcher persiste mas não há mecanismo de detecção.
  // Visível só pra Codify acompanhar a lista — não promete monitoramento.
  { id: 'monitor-territory',    label: 'Acompanhar território (Codify)',    Icon: Bell, adminOnly: true },
  { id: 'risk-map',             label: 'Gerar mapa de risco',               Icon: AlertTriangle },
  { id: 'sector-opportunities', label: 'Oportunidades por setor',           Icon: Briefcase },
  { id: 'nearby-partners',      label: 'Encontrar parceiros próximos',      Icon: Handshake },
  { id: 'simulate-territory-action', label: 'Simular ação no território',   Icon: FlaskConical },
];

export function MapActionsMenu({ open, onClose, onAction, onToggle }: MapActionsMenuProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        title="OS¹ — ações sobre o território"
        className={`h-10 px-3 inline-flex items-center gap-1.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xl border ${
          open
            ? 'bg-[#fbbf24]/15 border-[#fbbf24]/45 text-[#fbbf24]'
            : 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
        }`}
      >
        <Sparkles size={13} strokeWidth={2} />
        Ações
      </button>
      {open && (
        <>
          <div onClick={onClose} className="fixed inset-0 z-[195]" style={{ background: 'transparent' }} />
          <div className="absolute right-0 bottom-[calc(100%+8px)] z-[196] w-[300px] bg-[#0f0f10] border border-white/10 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.6)] p-1.5 text-left">
            <div className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-[0.12em] text-white/35">OS¹ · Mapa</div>
            {(() => {
              const isAdmin = getRole() === 'codify';
              return ACTION_ITEMS.filter(a => !a.adminOnly || isAdmin);
            })().map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => onAction(id)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs text-white/85 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <Icon size={13} strokeWidth={2} className="text-white/50 flex-shrink-0" />
                <span className="flex-1 text-left">{label}</span>
              </button>
            ))}
            <div className="px-3 pt-2 pb-2 mt-1 text-[10px] text-white/35 leading-relaxed border-t border-white/5">
              Você controla o que o OS¹ salva. Ações manuais — nada é capturado sem você clicar.
            </div>
          </div>
        </>
      )}
    </div>
  );
}
