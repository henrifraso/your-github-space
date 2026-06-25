import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Check, ChevronRight, ChevronLeft, Globe, Megaphone, TrendingUp, Banknote, Users, Settings2, Package, Scale } from 'lucide-react';
import type { DepartmentId } from '../types';

export type SectorId = 'os1' | 'mcdonalds' | 'nike' | 'nubank' | 'oscar-piloto-01' | 'cerveja-imperio' | 'cerveja-imperio-distribuidora-01' | 'ifood' | 'ambev' | 'magalu' | 'embraer' | 'tesla' | 'netflix' | 'spotify' | 'airbnb' | 'uber' | 'apple' | 'amazon' | 'natura';

export type ProfileConfig = {
  id: SectorId;
  label: string;
  niche: string;
  desc: string;
  color: string;
  logo: string;
  active: boolean;
};

export const SECTORS: ProfileConfig[] = [
  {
    id: 'os1',
    label: 'OS1',
    niche: 'SaaS & Inteligência Artificial',
    desc: 'Plataforma de inteligência de negócios com IA',
    color: '#3b82f6',
    logo: '001',
    active: true,
  },
  {
    id: 'mcdonalds',
    label: "McDonald's",
    niche: 'Fast Food & Alimentação Rápida',
    desc: 'Maior rede de fast food do mundo',
    color: '#f59e0b',
    logo: 'Mc',
    active: false,
  },
  {
    id: 'nike',
    label: 'Oscar Calçados',
    niche: 'Varejo de Calçados & Moda',
    desc: 'Maior rede calçadista do Vale do Paraíba — 186 lojas',
    color: '#f97316',
    logo: 'Os',
    active: false,
  },
  {
    id: 'nubank',
    label: 'Drogarias Pacheco',
    niche: 'Varejo Farmacêutico',
    desc: '134 anos no RJ — Grupo DPSP, 1.600+ lojas no Brasil',
    color: '#e11d48',
    logo: 'DP',
    active: false,
  },
  {
    id: 'oscar-piloto-01',
    label: 'Oscar Loja Piloto 01',
    niche: 'Varejo de Calçados · Loja',
    desc: 'Oscar Calçados · Unidade piloto conectada (visão não-matriz)',
    color: '#f97316',
    logo: 'OL',
    active: false,
  },
  {
    id: 'cerveja-imperio',
    label: 'Cerveja Império',
    niche: 'Bebidas & Mercado Regional',
    desc: 'Marca de cerveja com leitura consolidada de presença, reputação, distribuição e oportunidades comerciais no mercado de bebidas.',
    color: '#b8860b',
    logo: 'CI',
    active: false,
  },
  {
    id: 'cerveja-imperio-distribuidora-01',
    label: 'Distribuidora Império',
    niche: 'Bebidas · Distribuição Regional',
    desc: 'Unidade de distribuição focada em rotas, abastecimento de pontos de venda, giro de produto e execução comercial regional.',
    color: '#b8860b',
    logo: 'DI',
    active: false,
  },
  {
    id: 'ifood',
    label: 'iFood',
    niche: 'Delivery & Foodtech',
    desc: 'Plataforma líder de delivery no Brasil',
    color: '#ef4444',
    logo: 'iF',
    active: false,
  },
  {
    id: 'ambev',
    label: 'Ambev',
    niche: 'Bebidas & FMCG',
    desc: 'Maior produtora de bebidas da América Latina',
    color: '#f97316',
    logo: 'Ab',
    active: false,
  },
  {
    id: 'magalu',
    label: 'Magazine Luiza',
    niche: 'Varejo & E-commerce',
    desc: 'Líder omnichannel do varejo brasileiro',
    color: '#3b82f6',
    logo: 'ML',
    active: false,
  },
  {
    id: 'embraer',
    label: 'Embraer',
    niche: 'Aeronáutica & Defesa',
    desc: '3ª maior fabricante de aeronaves do mundo',
    color: '#0891b2',
    logo: 'Em',
    active: false,
  },
  {
    id: 'tesla',
    label: 'Tesla',
    niche: 'Veículos Elétricos & Energia',
    desc: 'Líder global em veículos elétricos e baterias',
    color: '#cc0000',
    logo: 'T',
    active: false,
  },
  {
    id: 'netflix',
    label: 'Netflix',
    niche: 'Streaming & Entretenimento',
    desc: 'Maior plataforma de streaming do mundo',
    color: '#e50914',
    logo: 'Nf',
    active: false,
  },
  {
    id: 'spotify',
    label: 'Spotify',
    niche: 'Música & Áudio Digital',
    desc: 'Plataforma de streaming musical líder global',
    color: '#1db954',
    logo: 'Sp',
    active: false,
  },
  {
    id: 'airbnb',
    label: 'Airbnb',
    niche: 'Viagens & Hospitalidade',
    desc: 'Plataforma líder de acomodações alternativas',
    color: '#ff5a5f',
    logo: 'Ai',
    active: false,
  },
  {
    id: 'uber',
    label: 'Uber',
    niche: 'Mobilidade & Logística',
    desc: 'Maior plataforma de mobilidade urbana do mundo',
    color: '#09091a',
    logo: 'Ub',
    active: false,
  },
  {
    id: 'apple',
    label: 'Apple',
    niche: 'Eletrônicos & Ecossistema Digital',
    desc: 'Empresa mais valiosa do mundo — iPhone, Mac, serviços',
    color: '#6e6e73',
    logo: 'Ap',
    active: false,
  },
  {
    id: 'amazon',
    label: 'Amazon',
    niche: 'E-commerce & Cloud Computing',
    desc: 'Maior e-commerce e provedor de cloud do planeta',
    color: '#ff9900',
    logo: 'Az',
    active: false,
  },
  {
    id: 'natura',
    label: 'Natura',
    niche: 'Cosméticos & Sustentabilidade',
    desc: 'Grupo de beleza mais sustentável do mundo',
    color: '#00a651',
    logo: 'Na',
    active: false,
  },
];

interface RoleSection {
  title: string;
  tabs: { id: string; label: string }[];
  activeTab: string;
  onSelectTab: (id: string) => void;
  renderContent?: (tabId: string) => React.ReactNode;
}

interface Props {
  active: SectorId;
  onSelect: (id: SectorId) => void;
  onClose: () => void;
  roleSection?: RoleSection;
  hideDemoProfiles?: boolean;
  /** Quando fornecido, substitui a lista padrão de perfis exibidos. */
  filterProfileIds?: string[];
  /** Rótulo acima da grade de perfis. Se omitido, usa 'Perfis demo' quando roleSection presente. */
  profilesHeader?: string;
}

const cardVariants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
};

function ProfileLogo({ profile, size = 48 }: { profile: ProfileConfig; size?: number }) {
  const isOS1 = profile.id === 'os1';
  return (
    <div
      style={{
        width: size, height: size,
        borderRadius: 14,
        background: isOS1
          ? 'radial-gradient(ellipse 80% 60% at center, #1a1a1a 0%, #0a0a0a 50%, #000000 100%)'
          : profile.color + '18',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden',
        border: isOS1 ? '1px solid rgba(255,255,255,0.1)' : undefined,
      }}
    >
      {isOS1 && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.025,
        }} />
      )}
      <span style={{
        color: isOS1 ? '#ffffff' : profile.color,
        fontFamily: isOS1 ? "'Big Shoulders Display', sans-serif" : 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, monospace',
        fontWeight: 900,
        fontSize: isOS1 ? 26 : 15,
        letterSpacing: isOS1 ? '-0.04em' : '-0.01em',
        userSelect: 'none',
        position: 'relative', zIndex: 2,
        textShadow: 'none',
      }}>
        {profile.logo}
      </span>
    </div>
  );
}

export function SectorSwitcherModal({ active, onSelect, onClose, roleSection, hideDemoProfiles, filterProfileIds, profilesHeader }: Props) {
  const DEFAULT_PROFILE_IDS = ['os1', 'mcdonalds', 'nike', 'nubank', 'cerveja-imperio'];
  const [openTab, setOpenTab] = useState<string | null>(null);
  const openTabLabel = openTab ? roleSection?.tabs.find(t => t.id === openTab)?.label : null;
  const showSubview = !!openTab && !!roleSection?.renderContent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed inset-0 z-[190] bg-[#dcdfe2] dark:bg-[#181818] flex flex-col overflow-y-auto"
      style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#dcdfe2]/80 dark:bg-[#181818]/80 backdrop-blur-xl border-b border-neutral-200 dark:border-[#414141] px-5 py-4 flex items-center justify-between max-w-[935px] w-full mx-auto">
        {showSubview ? (
          <button
            onClick={() => setOpenTab(null)}
            className="flex items-center gap-2 p-2 -ml-2 rounded-xl text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-white/5 transition-all duration-200 cursor-pointer"
          >
            <ChevronLeft size={18} />
            <span className="text-sm font-bold">{openTabLabel}</span>
          </button>
        ) : <span />}
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-white/5 transition-all duration-200 cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 px-4 sm:px-5 py-6 max-w-[935px] w-full mx-auto">
        {/* Subview: conteúdo da tab selecionada */}
        {showSubview && roleSection?.renderContent?.(openTab!)}

        {/* View principal: grid de tabs + grid de perfis */}
        {!showSubview && roleSection && roleSection.tabs.length > 0 && (
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2.5">{roleSection.title}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {roleSection.tabs.map(tab => {
                const isActive = roleSection.activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      const hasContent = roleSection.renderContent && roleSection.renderContent(tab.id) != null;
                      if (hasContent) {
                        // Subview dentro do modal — não muda o feed
                        setOpenTab(tab.id);
                      } else {
                        // Tab sem conteúdo no modal (ex: demos) — fecha e atualiza feed
                        roleSection.onSelectTab(tab.id);
                        onClose();
                      }
                    }}
                    className={`flex items-center justify-between gap-2 px-4 py-3 rounded-2xl border transition-all duration-200 shadow-[0_2px_12px_rgba(0,0,0,0.07)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)] cursor-pointer
                      ${isActive
                        ? 'bg-[#f0f2f4] dark:bg-[#323232] border-[#3b82f6]'
                        : 'bg-[#f0f2f4] dark:bg-[#323232] border-neutral-100 dark:border-[#414141] hover:bg-[#e4e7ea] dark:hover:bg-[#353535]'
                      }`}
                  >
                    <span className="text-sm font-bold text-neutral-800 dark:text-neutral-100 leading-tight">{tab.label}</span>
                    {isActive
                      ? <div className="w-5 h-5 rounded-full bg-[#3b82f6] flex items-center justify-center flex-shrink-0"><Check size={11} className="text-white" strokeWidth={3} /></div>
                      : <ChevronRight size={16} className="text-neutral-300 dark:text-neutral-600 flex-shrink-0" />
                    }
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {!showSubview && (profilesHeader || (roleSection && !hideDemoProfiles)) && (
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2.5">
            {profilesHeader ?? 'Perfis demo'}
          </p>
        )}
        {!showSubview && !hideDemoProfiles && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SECTORS.filter(p => (filterProfileIds ?? DEFAULT_PROFILE_IDS).includes(p.id)).map((profile, i) => {
            const isActive = active === profile.id;
            return (
              <motion.div
                key={profile.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                onClick={() => { onSelect(profile.id); onClose(); }}
                className={`relative flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-200 shadow-[0_2px_12px_rgba(0,0,0,0.07)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)] cursor-pointer
                  ${isActive
                    ? 'bg-[#f0f2f4] dark:bg-[#323232] border-[#3b82f6]'
                    : 'bg-[#f0f2f4] dark:bg-[#323232] border-neutral-100 dark:border-[#414141] hover:bg-[#e4e7ea] dark:hover:bg-[#353535]'
                  }`}
              >
                <ProfileLogo profile={profile} />

                {/* Texto */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-neutral-800 dark:text-neutral-100 leading-tight">{profile.label}</p>
                    {profile.id === 'os1' && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#3b82f6]/15 text-[#3b82f6] uppercase tracking-wide">master</span>
                    )}
                  </div>
                  <p className="text-[11px] font-medium text-[#3b82f6] dark:text-[#60a5fa] mt-0.5 leading-snug">{profile.niche}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-snug truncate">{profile.desc}</p>
                </div>

                {/* Estado */}
                {isActive ? (
                  <div className="w-5 h-5 rounded-full bg-[#3b82f6] flex items-center justify-center flex-shrink-0">
                    <Check size={11} className="text-white" strokeWidth={3} />
                  </div>
                ) : (
                  <ChevronRight size={16} className="text-neutral-300 dark:text-neutral-600 flex-shrink-0" />
                )}
              </motion.div>
            );
          })}
        </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── DepartmentSwitcher (usado em perfis não-OS1) ─────────────────────────────

const DEPARTMENTS: { id: Exclude<DepartmentId, 'geral'>; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
  { id: 'marketing',  label: 'Marketing',   desc: 'Campanhas, marca e reputação',    icon: <Megaphone size={22}/>,  color: '#ec4899' },
  { id: 'vendas',     label: 'Vendas',       desc: 'Resultados, metas e canais',      icon: <TrendingUp size={22}/>, color: '#10b981' },
  { id: 'financeiro', label: 'Financeiro',   desc: 'Fiscal, custos e margens',        icon: <Banknote size={22}/>,   color: '#f59e0b' },
  { id: 'rh',         label: 'RH',           desc: 'Equipe, escalas e treinamentos',  icon: <Users size={22}/>,      color: '#8b5cf6' },
  { id: 'operacoes',  label: 'Operações',    desc: 'Qualidade e processos internos',  icon: <Settings2 size={22}/>,  color: '#06b6d4' },
  { id: 'estoque',    label: 'Estoque',      desc: 'Insumos, pedidos e fornecedores', icon: <Package size={22}/>,    color: '#84cc16' },
  { id: 'juridico',   label: 'Jurídico',     desc: 'Compliance, contratos e leis',    icon: <Scale size={22}/>,      color: '#f97316' },
];

interface DeptProps {
  active: DepartmentId;
  onSelect: (id: DepartmentId) => void;
  onClose: () => void;
}

export function DepartmentSwitcherModal({ active, onSelect, onClose }: DeptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed inset-0 z-[190] bg-[#dcdfe2] dark:bg-[#181818] flex flex-col overflow-y-auto"
      style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
    >
      <div className="sticky top-0 z-10 bg-[#dcdfe2]/80 dark:bg-[#181818]/80 backdrop-blur-xl border-b border-neutral-200 dark:border-[#414141] px-5 py-4 flex items-center justify-between max-w-[935px] w-full mx-auto">
        <div>
          <h1 className="text-base font-bold text-neutral-800 dark:text-neutral-100">Feed por Área</h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Escolha uma área da empresa</p>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-white/5 transition-all duration-200 cursor-pointer">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 px-4 sm:px-5 py-6 max-w-[935px] w-full mx-auto">
        {/* Botão Geral */}
        <motion.div
          onClick={() => { onSelect('geral'); onClose(); }}
          className={`flex items-center gap-4 px-5 py-4 mb-3 rounded-2xl border cursor-pointer transition-all duration-200 shadow-[0_2px_12px_rgba(0,0,0,0.07)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)]
            ${active === 'geral'
              ? 'bg-[#f0f2f4] dark:bg-[#323232] border-[#3b82f6]'
              : 'bg-[#f0f2f4] dark:bg-[#323232] border-neutral-100 dark:border-[#414141] hover:bg-[#e4e7ea] dark:hover:bg-[#353535]'
            }`}
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#3b82f618' }}>
            <Globe size={22} className="text-[#3b82f6]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-neutral-800 dark:text-neutral-100">Geral</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Todas as áreas combinadas</p>
          </div>
          {active === 'geral'
            ? <div className="w-5 h-5 rounded-full bg-[#3b82f6] flex items-center justify-center flex-shrink-0"><Check size={11} className="text-white" strokeWidth={3} /></div>
            : <ChevronRight size={16} className="text-neutral-300 dark:text-neutral-600 flex-shrink-0" />
          }
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DEPARTMENTS.map((dept, i) => {
            const isActive = active === dept.id;
            return (
              <motion.div
                key={dept.id}
                onClick={() => { onSelect(dept.id); onClose(); }}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl border cursor-pointer transition-all duration-200 shadow-[0_2px_12px_rgba(0,0,0,0.07)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)]
                  ${isActive
                    ? 'bg-[#f0f2f4] dark:bg-[#323232] border-[#3b82f6]'
                    : 'bg-[#f0f2f4] dark:bg-[#323232] border-neutral-100 dark:border-[#414141] hover:bg-[#e4e7ea] dark:hover:bg-[#353535]'
                  }`}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: dept.color + '18' }}>
                  <span style={{ color: dept.color }}>{dept.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-neutral-800 dark:text-neutral-100">{dept.label}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-snug">{dept.desc}</p>
                </div>
                {isActive
                  ? <div className="w-5 h-5 rounded-full bg-[#3b82f6] flex items-center justify-center flex-shrink-0"><Check size={11} className="text-white" strokeWidth={3} /></div>
                  : <ChevronRight size={16} className="text-neutral-300 dark:text-neutral-600 flex-shrink-0" />
                }
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
