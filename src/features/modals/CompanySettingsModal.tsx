import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Building2, CircleDot, Clock, Wifi } from 'lucide-react';
import { ACTIVE_INPUTS, DEMO_INPUTS, VERTICAL_API_INPUTS } from '../../data/intelligence-inputs';

// ── Tipos ─────────────────────────────────────────────────────────────────────

interface SettingField {
  id: string;
  question: string;
  explanation: string;
  placeholder: string;
  defaultActive: boolean;
}

interface SettingSection {
  title: string;
  fields: SettingField[];
}

type CompanyType =
  | 'marca' | 'industria' | 'distribuidora' | 'franquia'
  | 'rede_lojas' | 'loja' | 'restaurante' | 'farmacia'
  | 'servico' | 'marketplace' | 'outro';

interface CompanySettings {
  companyType: CompanyType | '';
  toggles: Record<string, boolean>;
  values: Record<string, string>;
}

// ── Configuração das seções ───────────────────────────────────────────────────

const COMPANY_TYPES: { value: CompanyType; label: string }[] = [
  { value: 'marca',       label: 'Marca' },
  { value: 'industria',   label: 'Indústria' },
  { value: 'distribuidora', label: 'Distribuidora' },
  { value: 'franquia',    label: 'Franquia' },
  { value: 'rede_lojas',  label: 'Rede de lojas' },
  { value: 'loja',        label: 'Loja' },
  { value: 'restaurante', label: 'Restaurante' },
  { value: 'farmacia',    label: 'Farmácia' },
  { value: 'servico',     label: 'Serviço' },
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'outro',       label: 'Outro' },
];

const SECTIONS: SettingSection[] = [
  {
    title: 'Perfil de mercado',
    fields: [
      {
        id: 'faturamento',
        question: 'Qual é a faixa de porte da empresa?',
        explanation: 'Ajuda o motor a calibrar prioridade, impacto estimado e relevância dos sinais de mercado.',
        placeholder: 'Ex.: R$ 500 mil, R$ 2 milhões, R$ 10 milhões por mês',
        defaultActive: true,
      },
      {
        id: 'produtos_prioritarios',
        question: 'Quais produtos ou linhas são prioridade?',
        explanation: 'Define quais sinais de mercado merecem mais peso na leitura.',
        placeholder: 'Ex.: cerveja pilsen, puro malte, long neck, chope, distribuição para bares',
        defaultActive: true,
      },
    ],
  },
  {
    title: 'Território e canais',
    fields: [
      {
        id: 'regioes',
        question: 'Quais regiões a empresa atende?',
        explanation: 'Cruza território, mapa, concorrência e oportunidades regionais.',
        placeholder: 'Ex.: Curitiba, Região Metropolitana, litoral, interior do Paraná',
        defaultActive: true,
      },
      {
        id: 'canais',
        question: 'Quais canais de venda são mais importantes?',
        explanation: 'Ajuda o Feed e o Mapa a priorizarem sinais por canal.',
        placeholder: 'Ex.: bares, mercados, atacarejos, restaurantes, eventos, distribuidores',
        defaultActive: true,
      },
      {
        id: 'unidades',
        question: 'Quais unidades, lojas ou distribuidores devem ser acompanhados?',
        explanation: 'Permite leitura e cruzamento por perfil e unidade.',
        placeholder: 'Ex.: Distribuidora Império, Loja 1, Unidade Norte, Unidade Centro',
        defaultActive: false,
      },
    ],
  },
  {
    title: 'Prioridades estratégicas',
    fields: [
      {
        id: 'metas',
        question: 'Quais metas comerciais importam agora?',
        explanation: 'Orienta o motor sobre quais oportunidades devem virar prioridade.',
        placeholder: 'Ex.: crescer em bares, fortalecer presença regional, acompanhar concorrentes, abrir novos canais',
        defaultActive: true,
      },
      {
        id: 'capacidade',
        question: 'Quais limites ou prioridades devem orientar a leitura do mercado?',
        explanation: 'Ajuda o motor a evitar sinais pouco relevantes e priorizar oportunidades alinhadas ao momento da empresa.',
        placeholder: 'Ex.: crescer em bares, fortalecer presença regional, proteger marca, abrir novos canais',
        defaultActive: false,
      },
    ],
  },
  {
    title: 'Concorrência e sinais',
    fields: [
      {
        id: 'concorrentes',
        question: 'Quem são os principais concorrentes?',
        explanation: 'Alimenta o radar competitivo do Feed, Score e Mapa.',
        placeholder: 'Ex.: marcas nacionais, marcas regionais, distribuidoras locais',
        defaultActive: true,
      },
      {
        id: 'alertas',
        question: 'Quais sinais devem gerar alerta?',
        explanation: 'Define os gatilhos do Feed e do Score para este perfil.',
        placeholder: 'Ex.: queda de reputação, concorrente novo, menção negativa, entrada de marca',
        defaultActive: true,
      },
      {
        id: 'fontes',
        question: 'Quais fontes devem ser consideradas?',
        explanation: 'Organiza a cobertura de fontes para os cruzamentos de inteligência.',
        placeholder: 'Ex.: Reclame Aqui, Google, redes sociais, notícias, mapa, arquivos enviados',
        defaultActive: true,
      },
    ],
  },
  {
    title: 'Radar de fontes',
    fields: [
      {
        id: 'api_vertical',
        question: 'Quais fontes externas devem ter prioridade no radar?',
        explanation: 'Calibra quais fontes de mercado o motor monitora com maior atenção.',
        placeholder: 'Ex.: Google Maps, Reclame Aqui, iFood, notícias regionais, sites de concorrentes',
        defaultActive: false,
      },
    ],
  },
];

// ── Helpers de persistência ───────────────────────────────────────────────────

function getKey(profileId: string) {
  return `os1_company_settings_${profileId}`;
}

function loadSettings(profileId: string): CompanySettings {
  try {
    const raw = localStorage.getItem(getKey(profileId));
    if (raw) return JSON.parse(raw) as CompanySettings;
  } catch { /* ignore */ }

  const defaultToggles: Record<string, boolean> = {};
  SECTIONS.forEach(s => s.fields.forEach(f => { defaultToggles[f.id] = f.defaultActive; }));
  return { companyType: '', toggles: defaultToggles, values: {} };
}

function saveSettings(profileId: string, settings: CompanySettings) {
  localStorage.setItem(getKey(profileId), JSON.stringify(settings));
}

// ── Toggle estilo Apple ───────────────────────────────────────────────────────

function Toggle({ active, onChange }: { active: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!active)}
      className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer focus:outline-none ${active ? 'bg-neutral-700 dark:bg-neutral-300' : 'bg-neutral-300 dark:bg-neutral-600'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white dark:bg-neutral-900 shadow transition-transform duration-200 ${active ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

export function CompanySettingsModal({
  open,
  onClose,
  profileId,
}: {
  open: boolean;
  onClose: () => void;
  profileId: string;
}) {
  const [settings, setSettings] = useState<CompanySettings>(() => loadSettings(profileId));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (open) setSettings(loadSettings(profileId));
  }, [open, profileId]);

  const setToggle = (id: string, v: boolean) =>
    setSettings(s => ({ ...s, toggles: { ...s.toggles, [id]: v } }));

  const setValue = (id: string, v: string) =>
    setSettings(s => ({ ...s, values: { ...s.values, [id]: v } }));

  const handleSave = () => {
    saveSettings(profileId, settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-hidden p-6"
          onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full max-w-[1480px] max-h-[calc(100vh-48px)] bg-[#f0f2f4] dark:bg-[#323232] border-[0.5px] border-neutral-100 dark:border-[#414141] rounded-2xl shadow-[0_8px_20px_-4px_rgba(0,0,0,0.14),0_2px_6px_-2px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden"
            style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
          >
            {/* Header */}
            <div className="flex-shrink-0 px-6 pt-6 pb-5 border-b border-neutral-200 dark:border-[#414141] flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#e4e7ea] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] flex items-center justify-center">
                <Building2 size={18} className="text-neutral-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 leading-tight">Configuração da Empresa</h2>
                <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
                  Calibre o radar de inteligência do OS¹ para ler o mercado externo com mais precisão.
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-[#d1d4d8] dark:hover:bg-[#404040] transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Conteúdo scrollável */}
            <div className="flex-1 overflow-y-auto min-h-0">

              {/* Subtítulo */}
              <div className="px-6 py-4 border-b border-neutral-200 dark:border-[#414141]">
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Essas informações ajudam o motor a entender setor, território, canais, concorrentes,
                  prioridades e sinais relevantes para transformar fontes externas em inteligência acionável.
                </p>
              </div>

              {/* Tipo da empresa */}
              <div className="px-6 py-5 border-b border-neutral-200 dark:border-[#414141]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-500 mb-3">Tipo da empresa</p>
                <div className="flex flex-wrap gap-2">
                  {COMPANY_TYPES.map(ct => (
                    <button
                      key={ct.value}
                      type="button"
                      onClick={() => setSettings(s => ({ ...s, companyType: ct.value }))}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                        settings.companyType === ct.value
                          ? 'bg-neutral-800 text-white border-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:border-neutral-100'
                          : 'bg-transparent text-neutral-500 border-neutral-300 dark:border-[#414141] hover:border-neutral-400 hover:text-neutral-700 dark:hover:border-neutral-500 dark:hover:text-neutral-300'
                      }`}
                    >
                      {ct.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seções — 2 colunas em telas largas */}
              <div className="grid grid-cols-1 xl:grid-cols-2 border-b border-neutral-200 dark:border-[#414141]">
                {SECTIONS.map((section, idx) => (
                  <div
                    key={section.title}
                    className={`px-6 py-5 border-b border-neutral-200 dark:border-[#414141] xl:border-b-0 ${idx % 2 === 0 ? 'xl:border-r xl:border-r-neutral-200 dark:xl:border-r-[#414141]' : ''}`}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-500 mb-4">
                      {section.title}
                    </p>
                    <div className="space-y-5">
                      {section.fields.map(field => (
                        <div key={field.id} className="flex items-start gap-4">
                          {/* Texto */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 leading-snug mb-1">{field.question}</p>
                            <p className="text-[11px] text-neutral-500 dark:text-neutral-600 mb-2 leading-snug">{field.explanation}</p>
                            {settings.toggles[field.id] && (
                              <input
                                type="text"
                                value={settings.values[field.id] ?? ''}
                                onChange={e => setValue(field.id, e.target.value)}
                                placeholder={field.placeholder}
                                className="w-full bg-white border-[0.5px] border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-700 placeholder-neutral-400 dark:bg-[#2a2a2a] dark:border-[#414141] dark:text-neutral-200 dark:placeholder-neutral-500 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-colors"
                              />
                            )}
                          </div>
                          {/* Toggle */}
                          <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-0.5">
                            <Toggle
                              active={settings.toggles[field.id] ?? field.defaultActive}
                              onChange={v => setToggle(field.id, v)}
                            />
                            <span className={`text-[9px] font-semibold uppercase tracking-wider ${settings.toggles[field.id] ? 'text-neutral-500 dark:text-neutral-400' : 'text-neutral-400 dark:text-neutral-700'}`}>
                              {settings.toggles[field.id] ? 'Ativo' : 'Off'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Fontes de inteligência — 3 colunas em telas largas */}
              <div className="px-6 py-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-600 mb-4">Fontes de inteligência</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <CircleDot size={10} className="text-emerald-600" />
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-600">Ativas</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {ACTIVE_INPUTS.map(i => (
                        <span key={i.id} className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#e4e7ea] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] text-[10px] text-neutral-600 dark:text-neutral-300">{i.label}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <CircleDot size={10} className="text-neutral-400 dark:text-neutral-600" />
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-600">Demonstrativas</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {DEMO_INPUTS.map(i => (
                        <span key={i.id} className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#e4e7ea] dark:bg-[#2a2a2a] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] text-[10px] text-neutral-500 dark:text-neutral-500">{i.label}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <Wifi size={10} className="text-neutral-400 dark:text-neutral-700" />
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-700">Monitoráveis</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {VERTICAL_API_INPUTS.map(i => (
                        <span key={i.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#dcdfe2] dark:bg-[#252525] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] text-[10px] text-neutral-400 dark:text-neutral-600">
                          <Clock size={8} />
                          {i.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>{/* fim scroll */}

            {/* Footer */}
            <div className="flex-shrink-0 px-6 py-5 border-t border-neutral-200 dark:border-[#414141] flex items-center justify-between gap-4">
              <div className="flex-1">
                <AnimatePresence>
                  {saved && (
                    <motion.p
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-neutral-500"
                    >
                      Configuração salva localmente para este perfil.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-[#d1d4d8] dark:hover:bg-[#404040] transition-all cursor-pointer"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-5 py-2 rounded-lg text-sm font-semibold bg-neutral-900 text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white transition-colors cursor-pointer"
                >
                  Salvar configuração
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
