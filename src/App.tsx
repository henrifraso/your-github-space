/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Bookmark, ChevronRight, TrendingUp,
  Lightbulb, Trophy, ChevronDown,
  Layers, Info, Bell, Camera, Plus,
  MapPin, Scale, Store, Zap,
  Settings2, X, LayoutGrid, Power
} from 'lucide-react';

const isElectron = typeof window !== 'undefined' && !!(window as any).electron?.isElectron;

// ─── Sistema de Dificuldade ───────────────────────────────────────────────────
type Difficulty = 'muito_facil' | 'facil' | 'normal' | 'dificil' | 'muito_dificil';

const DIFF_META: Record<Difficulty, { label: string; emoji: string; desc: string }> = {
  muito_facil: { label: 'Muito Fácil',   emoji: '🌱', desc: 'Linguagem bem simples e direta' },
  facil:       { label: 'Fácil',         emoji: '😊', desc: 'Fácil de entender' },
  normal:      { label: 'Normal',        emoji: '⚖️', desc: 'Linguagem do dia a dia' },
  dificil:     { label: 'Difícil',       emoji: '📊', desc: 'Termos de negócios' },
  muito_dificil: { label: 'Muito Difícil', emoji: '🎯', desc: 'Linguagem técnica e estratégica' },
};

const DIFF_ORDER: Difficulty[] = ['muito_facil', 'facil', 'normal', 'dificil', 'muito_dificil'];

type TextKey =
  | 'sec_mudou' | 'sec_geo' | 'sec_leg' | 'sec_prod' | 'sec_serv' | 'sec_parc'
  | 'lbl_conc' | 'lbl_merc' | 'lbl_econ' | 'lbl_even' | 'lbl_rep'
  | 'stat_opor' | 'stat_conc' | 'stat_nivel'
  | 'bio_mercado' | 'bio_posicao' | 'bio_evolucao'
  | 'btn_plano' | 'btn_estrat' | 'btn_prat'
  | 'geo_regiao' | 'geo_clima'
  | 'leg_conf' | 'leg_atenc' | 'leg_desc'
  | 'prod_novo' | 'serv_acao' | 'parc_label';

const TEXTS: Record<TextKey, Record<Difficulty, string>> = {
  sec_mudou:    { muito_facil: 'Novidades',            facil: 'Novidades',            normal: 'O que mudou',           dificil: 'Inteligência de Mercado',   muito_dificil: 'Market Intelligence' },
  sec_geo:      { muito_facil: 'Sua região',           facil: 'Região',               normal: 'Geografia',             dificil: 'Análise Geográfica',        muito_dificil: 'Geomarketing' },
  sec_leg:      { muito_facil: 'Regras',               facil: 'Documentação',         normal: 'Legislação',            dificil: 'Compliance',                muito_dificil: 'Regulatory Framework' },
  sec_prod:     { muito_facil: 'Produtos',             facil: 'Produtos',             normal: 'Produtos',              dificil: 'Portfólio',                 muito_dificil: 'Product Portfolio' },
  sec_serv:     { muito_facil: 'Dicas práticas',       facil: 'Dicas',                normal: 'Serviços',              dificil: 'Operações',                 muito_dificil: 'Service Operations' },
  sec_parc:     { muito_facil: 'Fornecedores',         facil: 'Fornecedores',         normal: 'Parceiros',             dificil: 'Supply Chain',              muito_dificil: 'Supply Chain & Partners' },
  lbl_conc:     { muito_facil: 'Concorrentes',         facil: 'Concorrência',         normal: 'Concorrência',          dificil: 'Landscape Competitivo',     muito_dificil: 'Competitive Intelligence' },
  lbl_merc:     { muito_facil: 'O mercado',            facil: 'Mercado',              normal: 'Mercado',               dificil: 'Market Trends',             muito_dificil: 'Market Dynamics' },
  lbl_econ:     { muito_facil: 'Preços na área',       facil: 'Economia',             normal: 'Economia',              dificil: 'Indicadores econômicos',    muito_dificil: 'Economic Indicators' },
  lbl_even:     { muito_facil: 'Datas importantes',    facil: 'Eventos',              normal: 'Eventos',               dificil: 'Calendário estratégico',    muito_dificil: 'Strategic Calendar' },
  lbl_rep:      { muito_facil: 'Avaliações',           facil: 'Reputação',            normal: 'Reputação',             dificil: 'Brand Equity',              muito_dificil: 'Reputation Management' },
  stat_opor:    { muito_facil: 'dicas',                facil: 'oportunidades',        normal: 'oportunidades',         dificil: 'insights',                  muito_dificil: 'business opportunities' },
  stat_conc:    { muito_facil: 'na área',              facil: 'concorrentes',         normal: 'concorrentes',          dificil: 'players',                   muito_dificil: 'market players' },
  stat_nivel:   { muito_facil: 'Fase',                 facil: 'Nível',                normal: 'Nível',                 dificil: 'Tier',                      muito_dificil: 'Performance Tier' },
  bio_mercado:  { muito_facil: 'Tipo de negócio',      facil: 'Seu mercado',          normal: 'Seu mercado',           dificil: 'Segmento de mercado',       muito_dificil: 'Market Segment' },
  bio_posicao:  { muito_facil: 'Posição na área',      facil: 'Posição',              normal: 'Posição',               dificil: 'Market position',           muito_dificil: 'Competitive ranking' },
  bio_evolucao: { muito_facil: 'Progresso',            facil: 'Evolução',             normal: 'Evolução',              dificil: 'Performance score',         muito_dificil: 'Growth trajectory' },
  btn_plano:    { muito_facil: 'O que fazer',          facil: 'Plano',                normal: 'Plano',                 dificil: 'Roadmap',                   muito_dificil: 'Strategic Roadmap' },
  btn_estrat:   { muito_facil: 'Posição',              facil: 'Estratégia',           normal: 'Estratégia',            dificil: 'Posicionamento',            muito_dificil: 'Market Positioning' },
  btn_prat:     { muito_facil: 'Dicas',                facil: 'Prática',              normal: 'Prática',               dificil: 'Operações',                 muito_dificil: 'Best Practices' },
  geo_regiao:   { muito_facil: 'Sua área',             facil: 'Região de atuação',    normal: 'Região de atuação',     dificil: 'Área de influência',        muito_dificil: 'Primary trade area' },
  geo_clima:    { muito_facil: 'Tempo da semana',      facil: 'Clima da semana',      normal: 'Clima da semana',       dificil: 'Previsão meteorológica',    muito_dificil: 'Weather forecast' },
  leg_conf:     { muito_facil: 'Licenças e documentos', facil: 'Documentação',        normal: 'Conformidade',          dificil: 'Status regulatório',        muito_dificil: 'Regulatory compliance' },
  leg_atenc:    { muito_facil: 'Cuidado com isso',     facil: 'Importante',           normal: 'Atenção',               dificil: 'Risk Alert',                muito_dificil: 'Compliance Risk Alert' },
  leg_desc:     {
    muito_facil: 'Você precisa guardar registros de temperatura dos alimentos e as notas dos produtos. A Vigilância Sanitária de SP vai fazer vistoria em maio/2026.',
    facil: 'A lei exige registro de temperatura e rastreabilidade dos alimentos (RDC 216/2004). Auditorias da Vigilância Sanitária SP previstas para mai/2026.',
    normal: 'Resolução RDC 216/2004 ANVISA exige registro de temperatura e rastreabilidade de alimentos. Auditorias trimestrais da Vigilância Sanitária SP programadas para mai/2026.',
    dificil: 'RDC 216/2004 ANVISA: compliance mandatório para controle de temperatura e rastreabilidade. Auditorias regulatórias Q2/2026 — risco de interdição em caso de não conformidade.',
    muito_dificil: 'Regulatory exposure: RDC 216/2004 ANVISA mandates temperature logging & supply chain traceability. Q2/2026 regulatory audit cycle — non-compliance risk: operational shutdown.',
  },
  prod_novo:    { muito_facil: 'Novidades para vender', facil: 'Novidades do mercado', normal: 'Novidades do mercado', dificil: 'Innovation pipeline',       muito_dificil: 'Product Innovation Pipeline' },
  serv_acao:    { muito_facil: 'Dica desta semana',    facil: 'Dica da semana',       normal: 'Ação da semana',        dificil: 'Quick win da semana',       muito_dificil: 'Weekly tactical execution' },
  parc_label:   { muito_facil: 'Quem pode te fornecer', facil: 'Fornecedores',        normal: 'Fornecedores',          dificil: 'Supplier network',          muito_dificil: 'Strategic supplier network' },
};
import { motion, AnimatePresence } from 'motion/react';

import LoginScreen from './components/LoginScreen';
import { getAuthState, setAuthState, clearAuthState, getRole, setRole } from './hooks/useAuth';
import { apiFetch, getOrgContext } from './api';
import type { OmniData, Competitor, TimelineEvent } from './types';
import { MOCK_DATA, PROFILE_MOCK_DATA, buildStories, BARBER_PHOTOS } from './mockData';
import { BottomModal, ModalHeader } from './components/BottomModal';
import { FeedSection, FeedCard, PEPItemRow } from './components/FeedComponents';
import { CircleProgress, PieChart } from './components/CircleProgress';
import { StoryViewer } from './components/StoryViewer';
import { ConcorrenteModal } from './components/ConcorrenteModal';
import { BrowserView } from './components/BrowserView';
import { ChatDesktop, ChatFAB, ChatMobile } from './components/ChatPanel';
import { TimelineModal } from './components/TimelineComponents';
import { MarketMapButton, MarketMapContent } from './components/MarketMap';
import { PhotoEditor, loadPhotoSettings } from './components/PhotoEditor';
import type { PhotoSettings } from './components/PhotoEditor';
import { SectorSwitcherModal, DepartmentSwitcherModal, SECTORS, type ProfileConfig } from './components/SectorSwitcher';
import type { SectorId } from './components/SectorSwitcher';
import type { DepartmentId, CompanySectorFeeds } from './types';
import { SectorFeed } from './components/SectorFeed';
import { PROFILE_SECTOR_FEEDS } from './data/sector-feeds/index';
import { WorkspacePanel } from './components/WorkspacePanel';
import type { IntelligenceCard, WorkspaceIntent } from './components/WorkspacePanel';
import type { WorkspaceContext } from './components/ChatPanel';
import { DEMO_FEED_CARDS } from './data/demo-feed-cards';

// Presets de logo por demo — usados como avatar default quando o usuário
// ainda não fez upload de uma foto custom via PhotoEditor.
const DEMO_LOGOS: Record<string, { src: string; bg: string; pad?: string }> = {
  mcdonalds: { src: '/logos/mcdonalds.png', bg: '#ffffff', pad: '18%' },
  natura:    { src: '/logos/natura.png',    bg: '#ffffff', pad: '18%' },
  nike:      { src: '/logos/nike.png',      bg: '#ffffff', pad: '22%' },
  nubank:    { src: '/logos/nubank.png',    bg: '#ffffff', pad: '18%' },
  ifood:     { src: '/logos/ifood.svg',     bg: '#ffffff', pad: '22%' },
  ambev:     { src: '/logos/ambev.png',     bg: '#ffffff', pad: '15%' },
  magalu:    { src: '/logos/magalu.png',    bg: '#ffffff', pad: '16%' },
  embraer:   { src: '/logos/embraer.png',   bg: '#ffffff', pad: '12%' },
  tesla:     { src: '/logos/tesla.png',     bg: '#ffffff', pad: '20%' },
  netflix:   { src: '/logos/netflix.png',   bg: '#000000', pad: '14%' },
  spotify:   { src: '/logos/spotify.png',   bg: '#000000', pad: '20%' },
  airbnb:    { src: '/logos/airbnb.png',    bg: '#ffffff', pad: '22%' },
  uber:      { src: '/logos/uber.png',      bg: '#ffffff', pad: '20%' },
  apple:     { src: '/logos/apple.png',     bg: '#ffffff', pad: '22%' },
  amazon:    { src: '/logos/amazon.png',    bg: '#ffffff', pad: '15%' },
};
import { useGoogleMaps } from './components/maps/GoogleMapWrapper';
import { getRoleConfig } from './config/roleConfig';
import type { RoleFeedCard } from './config/roleConfig';
import { CODIFY_TAB_DATA, AFFILIATE_TAB_DATA, FRANCHISOR_FRANCHISE_NAMES, PARTNER_SOLD_COMPANIES } from './data/roleMocks';
import { isPersonalizedRole, filterFranchisorCardsByTab, shouldShowRoleDemos } from './utils/roleUtils';
import { Toast, useToast } from './components/Toast';
import { Mail, MapPinned, Target, Eye, Award, Search, Sparkles, Layers3, UserCircle } from 'lucide-react';

function GoogleMapsPreloader() {
  useGoogleMaps();
  return null;
}

interface AutoLoginParams {
  token: string;
  orgId: string;
  buId: string;
  role: string;
}

export default function App() {
  // Detecta redirect vindo de os1.space (?token=...&org=...&bu=...&role=...)
  // Quando vem do site, força um novo ciclo de animação cinemática mesmo se
  // o usuário já tava logado antes (limpa auth anterior pra LoginScreen rodar).
  const [autoLogin, setAutoLogin] = useState<AutoLoginParams | null>(() => {
    const p = new URLSearchParams(window.location.search);
    const urlToken = p.get('token');
    if (!urlToken) return null;
    const bu = p.get('bu') || 'bu-mcdo-paulista';
    const org = p.get('org') || 'org-mcdonalds-brasil';
    const role = p.get('role') || '';
    window.history.replaceState({}, '', window.location.pathname);
    // Limpa auth anterior — força LoginScreen a renderizar e tocar a animação.
    clearAuthState();
    return { token: urlToken, orgId: org, buId: bu, role };
  });

  const [auth, setAuth] = useState(() => getAuthState());

  if (!auth.isAuthenticated) {
    return (
      <LoginScreen
        autoLogin={autoLogin}
        onAuthenticated={(token, negocioId) => {
          setAuthState(token, negocioId);
          if (autoLogin) {
            localStorage.setItem('os1_org_id', autoLogin.orgId);
            localStorage.setItem('os1_bu_id', autoLogin.buId);
            if (autoLogin.role) localStorage.setItem('os1_role', autoLogin.role);
          }
          setAutoLogin(null);
          setAuth(getAuthState());
        }}
      />
    );
  }

  return <AuthenticatedApp />;
}

function AuthenticatedApp() {
  const role = getRole();
  const roleConfig = getRoleConfig(role);
  const [activeRoleTab, setActiveRoleTab] = useState(roleConfig.swipeOptions[0]?.id ?? 'demos');
  const [dismissedCards, setDismissedCards] = useState<Set<string>>(new Set());
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteInput, setInviteInput] = useState('');
  const saibaMaisRef = useRef<HTMLButtonElement>(null);
  const inviteContainerRef = useRef<HTMLDivElement>(null);
  const [saibaMaisWidth, setSaibaMaisWidth] = useState<number | null>(null);
  useEffect(() => {
    if (!saibaMaisRef.current) return;
    const measure = () => setSaibaMaisWidth(saibaMaisRef.current?.offsetWidth ?? null);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  });
  useEffect(() => {
    if (!inviteOpen) return;
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      if (target && inviteContainerRef.current && !inviteContainerRef.current.contains(target)) {
        setInviteOpen(false);
        setInviteInput('');
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [inviteOpen]);
  const { toast, show: showToast, hide: hideToast } = useToast();
  const [sendNetworkOpen, setSendNetworkOpen] = useState<string | null>(null);
  const [sendNetworkSelected, setSendNetworkSelected] = useState<Set<string>>(new Set(FRANCHISOR_FRANCHISE_NAMES));

  const [data, setData] = useState<OmniData>(MOCK_DATA);

  // Cards reais do backend (intelligence_cards via /api/orchestrator/feed)
  const [orchCards, setOrchCards] = useState<IntelligenceCard[]>([]);
  useEffect(() => {
    const { orgId, buId } = getOrgContext();
    if (!orgId || !buId) return;
    apiFetch<any[]>('/api/orchestrator/feed')
      .then(cards => {
        const mapped: IntelligenceCard[] = cards.map(c => ({
          id:              c.id,
          titulo:          c.title,
          resumo:          c.summary,
          por_que_importa: c.probable_impact ?? '',
          onde_afeta:      c.domain_id ?? '',
          o_que_fazer:     c.recommended_action ?? '',
          dominio:         c.domain_id ?? '',
          area:            c.gap_type ?? '',
          urgencia:        c.urgency,
          tipo_card:       c.card_type,
          confianca:       c.confidence_level ?? 'media',
          confianca_score: c.confidence_score ?? 0.5,
          impacto:         c.probable_impact ?? '',
          risco_erro:      Math.max(0, 1 - (c.confidence_score ?? 0.5)),
        }));
        if (mapped.length > 0) setOrchCards(mapped);
      })
      .catch(() => {});
  }, []);

  const [unreadCount, setUnreadCount] = useState(0);
  useEffect(() => {
    const { orgId } = getOrgContext();
    if (!orgId) return;
    apiFetch<{ unread: number }>(`/api/notifications/unread-count?org_id=${encodeURIComponent(orgId)}`)
      .then(d => setUnreadCount(d.unread ?? 0))
      .catch(() => {});
  }, []);
  const [selectedItem, setSelectedItem] = useState<{ id: string; type: string; content: any } | null>(null);
  // Modo escuro travado — o botão Sun/Moon será reaproveitado pra outra função.
  const [dark] = useState<boolean>(true);
  useEffect(() => { localStorage.setItem('os1_theme', 'dark'); }, []);
  const toggleTheme = () => {};
  const [difficulty, setDifficulty] = useState<Difficulty>(() => (localStorage.getItem('difficulty') as Difficulty) ?? 'normal');
  const [difficultyOpen, setDifficultyOpen] = useState(false);
  const txt = (key: TextKey) => TEXTS[key][difficulty];
  const [scrolled, setScrolled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);
  useEffect(() => {
    const fn = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  const touchStartY = useRef(0);
  const scrollCooldownRef = useRef(false);
  const [storyIndex, setStoryIndex] = useState<number | null>(null);
  const [evolucaoOpen, setEvolucaoOpen] = useState(false);
  const [empresaOpen, setEmpresaOpen] = useState(false);
  const [salvosOpen, setSalvosOpen] = useState(false);
  const [selectedConcorrente, setSelectedConcorrente] = useState<Competitor | null>(null);
  const [selectedTimelineEvent, setSelectedTimelineEvent] = useState<TimelineEvent | null>(null);
  const [savedItems, setSavedItems] = useState<{ id: string; title: string; section: string; preview: string }[]>([]);
  const [mapOpen, setMapOpen] = useState(false);
  const [bioOpen, setBioOpen] = useState(true);
  const bioOpenRef = useRef(false);
  useEffect(() => { bioOpenRef.current = bioOpen; }, [bioOpen]);
  const [destaqueOpen, setDestaqueOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatHistoryOpen, setChatHistoryOpen] = useState(false);
  const [statInfo, setStatInfo] = useState<{ label: string; value: any; description: string } | null>(null);
  // Sessões arquivadas — cada vez que o user clica em "Área de Trabalho" pra recolher, salva a sessão atual aqui.
  // Sessões arquivadas separadas POR SECTOR — cada perfil tem seu próprio histórico.
  const [archivedSessionsBySector, setArchivedSessionsBySector] = useState<Record<string, Array<{ id: string; ts: number; cardTitle: string; sector: string; snapshot?: any }>>>({});
  // Card enviado do feed para o contêiner do chat (botão "Área de trabalho").
  const [workspaceContext, setWorkspaceContext] = useState<WorkspaceContext | null>(null);
  const workspaceSeqRef = useRef(0);
  // Ref espelha workspaceContext pra ser lido dentro de listeners do useEffect[scrolled].
  const workspaceContextRef = useRef<WorkspaceContext | null>(null);
  useEffect(() => { workspaceContextRef.current = workspaceContext; }, [workspaceContext]);
  // Mede a altura da navbar pra calcular o paddingTop do <main> quando
  // scrolled=true (alinha topo do feed com top-[72px] do ChatPanel).
  const navRef = useRef<HTMLElement>(null);
  const [navHeight, setNavHeight] = useState(56);
  useEffect(() => {
    const measure = () => { if (navRef.current) setNavHeight(navRef.current.offsetHeight); };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  // Quando scrolled=true, paddingTop do <main> compensa o gap entre fim
  // da navbar e o top-[72px] do ChatPanel. Feed encosta exatamente em 72px.
  // 92 (top ChatPanel) − 16 (sticky top-4 da navbar) − navHeight = padding alinhado
  const mainPadTop = scrolled ? Math.max(0, 92 - 16 - navHeight) : undefined;
  type FullscreenContent =
    | { type: 'card'; label: string; color: string; titulo: string; detalhe: string }
    | { type: 'plano' }
    | { type: 'estrategia' }
    | { type: 'pratica' }
    | { type: 'destaque'; idx: number }
    | { type: 'workspace'; card: IntelligenceCard; intent?: WorkspaceIntent };
  const [fullscreenCard, setFullscreenCard] = useState<FullscreenContent | null>(null);
  const [consentAccepted, setConsentAccepted] = useState(true);
  const [consentChecks, setConsentChecks] = useState({ termos: false, navegador: false, lido: false });
  const [browserOpen, setBrowserOpen] = useState(false);
  const [esferaOpen, setEsferaOpen] = useState(false);
  const ESFERA_URL = '/esfera-ontologica.html';
  const [sectorOpen, setSectorOpen] = useState(false);
  const [activeSector, setActiveSector] = useState<SectorId>('os1');
  const [activeDepartment, setActiveDepartment] = useState<DepartmentId>('geral');
  const [photoEditorOpen, setPhotoEditorOpen] = useState(false);
  const [photoHover, setPhotoHover] = useState(false);

  function loadPhotoForProfile(profileId: string): PhotoSettings {
    const saved = localStorage.getItem(`photo_settings_${profileId}`);
    if (saved) { try { return JSON.parse(saved); } catch {} }
    // Default: codify (perfil personalizado em os1) usa moldura quadrada; demos usam redonda.
    const defaultShape: 'round' | 'square' = profileId === 'os1' ? 'square' : 'round';
    return { src: '', x: 0, y: 0, zoom: 1, locked: true, shape: defaultShape };
  }

  const [photoSettings, setPhotoSettings] = useState<PhotoSettings>(
    () => loadPhotoForProfile('os1')
  );
  const omniToken = useMemo(
    () => window.location.pathname.match(/\/client\/([^/]+)/)?.[1] ?? null,
    []
  );

  const [selectedContainers, setSelectedContainers] = useState<Set<string>>(new Set());
  const pepData = (data as any).pep as Record<string, { plano: { tipo: string; texto: string }[]; estrategia: { tipo: string; texto: string }[]; pratica: { tipo: string; texto: string }[] }> | undefined;

  const CONTAINER_LABELS: Record<string, string> = {
    concorrencia: 'Concorrência', mercado: 'Mercado', economia: 'Economia',
    eventos: 'Eventos', fornecedores: 'Fornecedores',
    produtos: 'Produtos', servicos: 'Serviços', praticas: 'Práticas',
  };

  function renderPEPItem(item: { tipo: string; texto: string; icone?: string; acao?: string }, idx: number) {
    return (
      <PEPItemRow
        key={idx}
        item={item}
        stepIndex={idx}
        onCheck={(pontos) => {
          setData(prev => ({
            ...prev,
            negocio: { ...prev.negocio, pontos: prev.negocio.pontos + pontos },
            gamificacao_log: [{ acao: `Tarefa concluída: ${item.texto.slice(0, 40)}…`, pontos }, ...prev.gamificacao_log],
          }));
        }}
      />
    );
  }

  // Converte card de role/mock em IntelligenceCard sintético pro WorkspacePanel.
  const roleFeedCardToIntelligenceCard = (c: RoleFeedCard): IntelligenceCard => ({
    id:              `synthetic-${c.id}`,
    titulo:          c.titulo,
    resumo:          c.resumo,
    por_que_importa: '',
    onde_afeta:      '',
    o_que_fazer:     '',
    dominio:         c.tags[0] ?? '',
    area:            c.tags[0] ?? '',
    urgencia:        c.urgencia,
    tipo_card:       c.tipo,
    confianca:       'media',
    confianca_score: 0.5,
    impacto:         '',
    risco_erro:      c.urgencia === 'alta' ? 0.6 : c.urgencia === 'media' ? 0.4 : 0.2,
    _synthetic:      true,
  });

  // Abre o WorkspacePanel a partir de um card real do feed.
  // Registra a interação correspondente (best-effort, não bloqueia abertura).
  const openWorkspaceFromCard = (card: IntelligenceCard, intent: WorkspaceIntent) => {
    const INTERACTION_BY_INTENT: Record<WorkspaceIntent, string> = {
      utilizar:     'utilizou',
      perguntas:    'perguntou',
      exemplos:     'clicou',
      compartilhar: 'compartilhou',
    };
    const { orgId, buId } = getOrgContext();
    // Cards sintéticos não existem no backend — interação retornaria 404.
    if (orgId && buId && !card._synthetic) {
      apiFetch('/api/orchestrator/interact', {
        method: 'POST',
        body: JSON.stringify({
          org_id: orgId,
          bu_id: buId,
          card_id: card.id,
          interaction_type: INTERACTION_BY_INTENT[intent],
        }),
      }).catch((err) => { console.warn('[workspace] interact falhou:', err); });
    }
    // Envia o card pro contêiner do chat (botão "Área de trabalho") em vez de fullscreen.
    workspaceSeqRef.current += 1;
    setWorkspaceContext({ card, intent, seq: workspaceSeqRef.current });
    // Alinhamento automático: simula o "deslize manual" que divide a tela ao meio.
    // No mobile abre o drawer do chat fullscreen; no desktop ativa o split view.
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setChatOpen(true);
    } else {
      // Esconde o bio (se aberto) e aciona o split — mesmo estado do deslize manual.
      setBioOpen(false);
      setScrolled(true);
    }
  };

  const handleUtilizar = (containerType: string, selected: boolean) => {
    setSelectedContainers(prev => {
      const next = new Set(prev);
      if (selected) next.add(containerType); else next.delete(containerType);
      return next;
    });
    if (selected) {
      const { orgId, buId } = getOrgContext();
      if (orgId && buId) {
        apiFetch('/api/orchestrator/interact', {
          method: 'POST',
          body: JSON.stringify({ org_id: orgId, bu_id: buId, interaction_type: 'utilizar', metadata: { container_tipo: containerType } }),
        }).catch(() => {});
      }
      setFullscreenCard({ type: 'plano' });
    }
  };

  const handlePhotoSave = async (s: PhotoSettings) => {
    setPhotoSettings(s);
    localStorage.setItem(`photo_settings_${activeSector}`, JSON.stringify(s));
  };

  const anyModalOpen = storyIndex !== null || evolucaoOpen || empresaOpen ||
    fullscreenCard !== null || salvosOpen || mapOpen || chatOpen ||
    selectedConcorrente !== null || selectedTimelineEvent !== null || selectedItem !== null || difficultyOpen || sectorOpen;
  const anyModalOpenRef = useRef(false);
  useEffect(() => { anyModalOpenRef.current = anyModalOpen; }, [anyModalOpen]);

  const toggleSave = (id: string, title: string, section: string, preview: string) => {
    setSavedItems(prev =>
      prev.find(i => i.id === id) ? prev.filter(i => i.id !== id) : [...prev, { id, title, section, preview }]
    );
  };
  const isSaved = (id: string) => savedItems.some(i => i.id === id);

  useEffect(() => {
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    document.body.style.backgroundColor = dark ? '#181818' : '#dcdfe2';
    // Sincroniza classe dark no html pra o CSS global (html.dark) responder
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [dark]);

  useEffect(() => {
    localStorage.setItem('difficulty', difficulty);
  }, [difficulty]);

  useEffect(() => {
    const omniData = (window as any).__OMNI_DATA__;
    if (omniData) setData(omniData);
  }, []);

  useEffect(() => {
    const profileData = PROFILE_MOCK_DATA[activeSector];
    if (profileData) setData(profileData);
    setPhotoSettings(loadPhotoForProfile(activeSector));
    setActiveDepartment('geral');
    setScrolled(false);
    // Zera o card ativo do chat — cada perfil/demo tem sua própria Área de Trabalho.
    setWorkspaceContext(null);
  }, [activeSector]);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!scrolled) {
      document.body.style.overflow = 'hidden';
      const onWheel = (e: WheelEvent) => {
        if (anyModalOpenRef.current || scrollCooldownRef.current) return;
        if (e.deltaY > 5) {
          if (!bioOpenRef.current) { setBioOpen(true); }
          else { setScrolled(true); setBioOpen(false); }
        }
      };
      const onTouchStart = (e: TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
      const onTouchMove = (e: TouchEvent) => {
        if (anyModalOpenRef.current || scrollCooldownRef.current) return;
        if (touchStartY.current - e.touches[0].clientY > 15) {
          if (!bioOpenRef.current) { setBioOpen(true); }
          else { setScrolled(true); setBioOpen(false); }
        }
      };
      window.addEventListener('wheel', onWheel);
      window.addEventListener('touchstart', onTouchStart, { passive: true });
      window.addEventListener('touchmove', onTouchMove, { passive: true });
      return () => {
        window.removeEventListener('wheel', onWheel);
        window.removeEventListener('touchstart', onTouchStart);
        window.removeEventListener('touchmove', onTouchMove);
      };
    } else {
      document.body.style.overflow = 'hidden';
      let released = false;
      const t = setTimeout(() => { document.body.style.overflow = ''; released = true; }, 400);
      const showProfile = () => {
        if (!released) return;
        // Enquanto houver card ativo na Área de Trabalho, mantém o split fixo.
        // Rolar pra cima não reabre o perfil — só fica meio a meio.
        if (workspaceContextRef.current) return;
        scrollCooldownRef.current = true;
        setScrolled(false);
        setTimeout(() => { scrollCooldownRef.current = false; }, 700);
      };
      const onScroll = () => { if (anyModalOpenRef.current) return; if (released && window.scrollY === 0) showProfile(); };
      const onWheel = (e: WheelEvent) => { if (anyModalOpenRef.current) return; if (released && e.deltaY < -5 && window.scrollY === 0) showProfile(); };
      const onTouchStart = (e: TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
      const onTouchMove = (e: TouchEvent) => {
        if (anyModalOpenRef.current || !released) return;
        if (e.touches[0].clientY - touchStartY.current > 30 && window.scrollY === 0) showProfile();
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('wheel', onWheel, { passive: true });
      window.addEventListener('touchstart', onTouchStart, { passive: true });
      window.addEventListener('touchmove', onTouchMove, { passive: true });
      return () => {
        clearTimeout(t);
        if (!released) document.body.style.overflow = '';
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('wheel', onWheel);
        window.removeEventListener('touchstart', onTouchStart);
        window.removeEventListener('touchmove', onTouchMove);
      };
    }
  }, [scrolled, workspaceContext]);

  const stories = useMemo(() => buildStories(data), [data]);

  const gridItems = useMemo(() => {
    const photo = (seed: string) => `https://picsum.photos/seed/${seed}/400/400`;
    const rng = (seed: number, max: number) => ((seed * 1103515245 + 12345) & 0x7fffffff) % max;
    return [
      { id: 'level', type: 'level', title: data.nivel_label, emoji: '🏆', subtitle: `Nível ${data.negocio.nivel}`, imageUrl: photo('trophy2025'), likes: rng(1, 200), comments: rng(2, 40) },
      ...data.concorrentes.map((c, i) => ({ id: `conc-${i}`, type: 'competitor', title: c.nome, emoji: '📊', subtitle: 'Concorrente', content: c, imageUrl: photo(`comp${i}`), likes: rng(i + 10, 150), comments: rng(i + 20, 30) })),
      ...data.fornecedores.map((f, i) => ({ id: `forn-${i}`, type: 'supplier', title: f.nome, emoji: '📦', subtitle: 'Fornecedor', content: f, imageUrl: photo(`supp${i}`), likes: rng(i + 30, 120), comments: rng(i + 40, 25) })),
      ...data.praticas.map((p, i) => ({ id: `prac-${i}`, type: 'practice', title: p.titulo, emoji: '💡', subtitle: 'Prática', content: p, imageUrl: photo(`tip${i}`), likes: rng(i + 50, 180), comments: rng(i + 60, 35) })),
    ];
  }, [data]);

  const circleData = useMemo(() => {
    const n = Math.max(1, data.concorrentes.length);
    const comNota  = data.concorrentes.filter(c => Number(c.nota_google) > 0).length;
    const comFaixa = data.concorrentes.filter(c => c.faixa_preco).length;
    const notaMedia = data.concorrentes.length
      ? Math.round((data.concorrentes.reduce((s, c) => s + (Number(c.nota_google) || 0), 0) / data.concorrentes.length / 5) * 100)
      : 0;
    const fn = data.fornecedores.length;
    const pn = data.praticas.length;
    const impl = Math.max(1, Math.ceil(pn * 0.55));
    const analise = Math.max(1, Math.floor(pn * 0.45));
    const sol = data.previsao_clima.filter(w => (w.chuva_mm ?? 0) === 0).length;
    const chuva = data.previsao_clima.filter(w => (w.chuva_mm ?? 0) > 0).length;
    const semDad = Math.max(0, 7 - data.previsao_clima.length);
    const comPreco = data.fornecedores.filter(f => Number(f.preco_referencia) > 0).length;
    const circles = [
      { label: 'Concorrência', pct: Math.min(100, Math.round((comNota / n) * 100)),              color: '#ef4444' },
      { label: 'Mercado',      pct: notaMedia,                                                    color: '#3b82f6' },
      { label: 'Economia',     pct: Math.min(100, Math.round((comFaixa / n) * 100)),              color: '#3b82f6' },
      { label: 'Legislação',   pct: 72,                                                           color: '#3b82f6' },
      { label: 'Produtos',     pct: Math.min(100, comPreco * 10),                                 color: '#3b82f6' },
      { label: 'Serviços',     pct: Math.min(100, pn * 12),                                      color: '#3b82f6' },
      { label: 'Parceiros',    pct: Math.min(100, fn * 8),                                       color: '#3b82f6' },
      { label: 'Eventos',      pct: Math.max(0, 100 - (chuva / Math.max(1, data.previsao_clima.length)) * 100), color: '#3b82f6' },
      { label: 'Reputação',    pct: data.progresso_pct,                                          color: '#3b82f6' },
    ];
    const allSlices = [
      [{ label: `Com nota (${comNota})`, value: Math.max(1, comNota), color: '#ef4444' }, { label: `Sem nota (${n - comNota})`, value: Math.max(1, n - comNota), color: '#1e3a5f' }],
      [{ label: `Notas Google (${comNota})`, value: Math.max(1, comNota), color: '#3b82f6' }, { label: `Faixa de preço (${comFaixa})`, value: Math.max(1, comFaixa), color: '#60a5fa' }, { label: `A mapear (${n - comNota})`, value: Math.max(1, n - comNota), color: '#1e3a5f' }],
      [{ label: `Dias ensolarados (${sol})`, value: Math.max(1, sol), color: '#3b82f6' }, { label: `Dias com chuva (${chuva})`, value: Math.max(1, chuva), color: '#1e3a5f' }, ...(semDad > 0 ? [{ label: `Sem previsão (${semDad})`, value: semDad, color: '#1e293b' }] : [])],
      [{ label: `Com faixa de preço (${comFaixa})`, value: Math.max(1, comFaixa), color: '#3b82f6' }, { label: `Sem dados (${n - comFaixa})`, value: Math.max(1, n - comFaixa), color: '#1e3a5f' }],
      [{ label: 'Conformidades OK', value: 72, color: '#3b82f6' }, { label: 'A revisar', value: 28, color: '#1e3a5f' }],
      [{ label: `Com preço (${comPreco})`, value: Math.max(1, comPreco), color: '#3b82f6' }, { label: `A mapear (${fn - comPreco})`, value: Math.max(1, fn - comPreco), color: '#7c2d12' }],
      [{ label: `Identificadas (${impl})`, value: impl, color: '#3b82f6' }, { label: `Em análise (${analise})`, value: analise, color: '#67e8f9' }, { label: `A implementar (${Math.max(1, 8 - pn)})`, value: Math.max(1, 8 - pn), color: '#164e63' }],
      [{ label: `Mapeados (${fn})`, value: Math.max(1, fn), color: '#3b82f6' }, { label: `A mapear (${Math.max(0, 12 - fn)})`, value: Math.max(1, 12 - fn), color: '#1e3a5f' }],
      [{ label: `Dias favoráveis (${sol})`, value: Math.max(1, sol), color: '#3b82f6' }, { label: `Dias adversos (${chuva})`, value: Math.max(1, chuva), color: '#1e3a5f' }, ...(semDad > 0 ? [{ label: `Sem previsão (${semDad})`, value: semDad, color: '#1e1b2e' }] : [])],
      [{ label: 'Pontos conquistados', value: Math.max(1, data.negocio.pontos), color: '#3b82f6' }, { label: 'Faltando', value: Math.max(1, data.pontos_proximo - data.negocio.pontos), color: '#1e3a5f' }],
    ];
    const descricoes = [
      `Percentual de concorrentes com nota Google mapeada.\n${comNota} de ${n} concorrentes têm avaliação registrada.\nMonitore quem está crescendo em reputação na região.`,
      `Score baseado na média de avaliações dos ${n} concorrentes mapeados.\nQuanto mais alto, maior a pressão competitiva no segmento.\nUse para posicionar preço e diferenciar o atendimento.`,
      `Índice de favorabilidade de fluxo na região.\nClima e sazonalidade impactam diretamente o movimento de clientes.\nPlaneje promoções e reforço digital nos dias adversos.`,
      `Cobertura de dados de faixa de preço entre concorrentes.\n${comFaixa} de ${n} têm preço mapeado.\nAmpliar essa cobertura ajuda a posicionar melhor seus serviços.`,
      `Nível de conformidade regulatória estimado.\nInclui alvarás, vigilância sanitária, ANVISA e NR-01.\nMantenha documentação em dia para evitar autuações.`,
      `Cobertura de fornecedores com preço de referência mapeado.\n${comPreco} de ${fn} fornecedores têm dados completos.\nExpanda para garantir poder de negociação e comparação.`,
      `Percentual de boas práticas identificadas para o segmento.\nCada prática pode virar uma ação concreta na semana.\nPriorize as de maior impacto em receita ou retenção.`,
      `Cobertura de parceiros mapeados na plataforma.\nMeta ideal: 12 parceiros para garantir alternativas.\nDiversifique para reduzir dependência de um único fornecedor.`,
      `Índice de favorabilidade de eventos e calendário.\nFeiras, datas comemorativas e clima influenciam a demanda.\nPrepare campanhas com antecedência para datas estratégicas.`,
      `Progresso no programa de evolução do negócio.\nA cada meta cumprida, pontos são acumulados rumo ao próximo nível.\nNível mais alto libera novos recursos e análises na plataforma.`,
    ];
    return circles.map((c, i) => ({ ...c, slices: allSlices[i], descricao: descricoes[i] }));
  }, [data]);

  // ─── helpers ─────────────────────────────────────────────────────────────────
  const timeline = data.timeline ?? MOCK_DATA.timeline!;
  const notaMediaNum = (() => {
    const ns = data.concorrentes.map(c => Number(c.nota_google)).filter(n => n > 0);
    return ns.length ? (ns.reduce((a, b) => a + b, 0) / ns.length).toFixed(1) : '—';
  })();

  function handleLogout() {
    if (activeSector !== 'os1') {
      setActiveSector('os1');
      return;
    }
    clearAuthState();
    const isLocal = window.location.hostname === 'localhost';
    window.location.href = isLocal ? 'http://localhost:5000' : 'https://os1.space';
  }

  // Conteúdo das tabs do role (codify/affiliate) renderizado dentro do modal "+"
  function renderRoleTabContent(tabId: string): React.ReactNode {
    if (role === 'codify' || role === 'franchisor') {
      if (tabId === 'empresas') {
        return (
          <div className="space-y-2.5">
            {CODIFY_TAB_DATA.empresas.map(emp => (
              <div key={emp.id} className="bg-[#f0f2f4] dark:bg-[#323232] border-[0.5px] border-neutral-100 dark:border-[#414141] rounded-2xl px-5 py-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{emp.nome}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{emp.segmento} · {emp.cidade}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${emp.status === 'ativo' ? 'bg-green-500/15 text-green-600 dark:text-green-400' : emp.status === 'em risco' ? 'bg-red-500/15 text-red-600 dark:text-red-400' : 'bg-blue-500/15 text-blue-600 dark:text-blue-400'}`}>
                  {emp.status}
                </span>
              </div>
            ))}
          </div>
        );
      }
      if (tabId === 'afiliados') {
        return (
          <div className="space-y-2.5">
            {CODIFY_TAB_DATA.afiliados.length > 0 ? CODIFY_TAB_DATA.afiliados.map(afl => (
              <div key={afl.id} className="bg-[#f0f2f4] dark:bg-[#323232] border-[0.5px] border-neutral-100 dark:border-[#414141] rounded-2xl px-5 py-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{afl.nome}</p>
                  <span className="text-sm font-bold text-[#3b82f6]">{afl.conversao}</span>
                </div>
                <p className="text-xs text-neutral-500">{afl.clientes} cliente{afl.clientes !== 1 ? 's' : ''} ativo{afl.clientes !== 1 ? 's' : ''} · Último contato: {afl.ultimoContato}</p>
              </div>
            )) : <div className="text-center text-neutral-400 py-12 text-sm">Nenhum afiliado ainda.</div>}
          </div>
        );
      }
      if (tabId === 'parceiros') {
        return (
          <div className="space-y-2.5">
            {CODIFY_TAB_DATA.parceiros.length > 0 ? CODIFY_TAB_DATA.parceiros.map(par => (
              <div key={par.id} className="bg-[#f0f2f4] dark:bg-[#323232] border-[0.5px] border-neutral-100 dark:border-[#414141] rounded-2xl px-5 py-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{par.nome}</p>
                  <span className="text-xs text-neutral-500">{par.oportunidades} oportunidade{par.oportunidades !== 1 ? 's' : ''}</span>
                </div>
                <p className="text-xs text-neutral-500">Setor: {par.setor}</p>
              </div>
            )) : <div className="text-center text-neutral-400 py-12 text-sm">Nenhum parceiro ainda.</div>}
          </div>
        );
      }
    }
    if ((role === 'affiliate' || role === 'team_member')) {
      if (tabId === 'meus-clientes') {
        return (
          <div className="space-y-2.5">
            {AFFILIATE_TAB_DATA['meus-clientes'].map(cli => (
              <div key={cli.id} className="bg-[#f0f2f4] dark:bg-[#323232] border-[0.5px] border-neutral-100 dark:border-[#414141] rounded-2xl px-5 py-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{cli.nome}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">Último contato: {cli.ultimaInteracao}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${cli.status === 'ativo' ? 'bg-green-500/15 text-green-600 dark:text-green-400' : cli.status === 'em risco' ? 'bg-red-500/15 text-red-600 dark:text-red-400' : 'bg-blue-500/15 text-blue-600 dark:text-blue-400'}`}>
                  {cli.status}
                </span>
              </div>
            ))}
          </div>
        );
      }
      if (tabId === 'parceiros') {
        return (
          <div className="space-y-2.5">
            {AFFILIATE_TAB_DATA.parceiros.map(par => (
              <div key={par.id} className="bg-[#f0f2f4] dark:bg-[#323232] border-[0.5px] border-neutral-100 dark:border-[#414141] rounded-2xl px-5 py-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{par.nome}</p>
                  <span className="text-sm font-bold text-[#3b82f6]">{par.comissao}</span>
                </div>
                <p className="text-xs text-neutral-500">Setor: {par.setor}</p>
              </div>
            ))}
          </div>
        );
      }
    }
    if (role === 'partner') {
      const company = PARTNER_SOLD_COMPANIES.find(c => c.id === tabId);
      if (!company) return null;
      const statusColor =
        company.status === 'ativo'
          ? 'bg-green-500/15 text-green-600 dark:text-green-400'
          : company.status === 'pendente'
          ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
          : 'bg-blue-500/15 text-blue-600 dark:text-blue-400';
      return (
        <div className="bg-[#f0f2f4] dark:bg-[#323232] border-[0.5px] border-neutral-100 dark:border-[#414141] rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-base sm:text-lg font-bold text-neutral-800 dark:text-neutral-100">{company.nome}</p>
              <p className="text-xs text-neutral-500 mt-0.5">{company.segmento} · {company.cidade}</p>
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusColor}`}>{company.status}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-200 dark:border-[#414141]">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Valor mensal</p>
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{company.valor}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Cliente desde</p>
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{company.desde}</p>
            </div>
          </div>
          <div className="pt-2 border-t border-neutral-200 dark:border-[#414141]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Contato</p>
            <p className="text-sm text-neutral-800 dark:text-neutral-100">{company.contato}</p>
          </div>
        </div>
      );
    }
    // tabId='demos' e outras sem conteúdo retornam null → modal fecha
    return null;
  }

  return (
    <div className={dark ? 'dark' : ''}>

      <GoogleMapsPreloader />

      {/* Botão deslogar + Convite + placeholders — desktop only */}
      {!browserOpen && !esferaOpen && !mapOpen && (
        <div className="fixed top-[26px] sm:top-[30px] right-9 sm:right-11 z-[51] hidden lg:flex items-center gap-1">
          <button
            onClick={handleLogout}
            title="Sair"
            className="flex items-center justify-center p-2 rounded-full text-neutral-500 dark:text-neutral-300 bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_4px_10px_-1px_rgba(0,0,0,0.22),0_1px_3px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.6)] dark:shadow-[0_4px_10px_-1px_rgba(0,0,0,0.55),0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.04)] hover:bg-[#e4e7ea] dark:hover:bg-[#353535] hover:text-neutral-800 dark:hover:text-white transition-all duration-200 cursor-pointer active:scale-90"
          >
            <Power size={22} />
          </button>
        </div>
      )}

      {/* Navbar — fora do container com padding para o border-b ser full width */}
      <nav ref={navRef} className="sticky top-3 sm:top-4 z-50 mx-4 sm:mx-5 mt-3 sm:mt-4 bg-[#f0f2f4] dark:bg-[#323232] border-[0.5px] border-neutral-100 dark:border-[#414141] rounded-2xl py-3.5 sm:py-4 relative shadow-[0_2px_8px_-2px_rgba(0,0,0,0.18),0_1px_3px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.5),0_1px_3px_rgba(0,0,0,0.3)]"
        style={isElectron ? { WebkitAppRegion: 'drag' } as React.CSSProperties : undefined}>
        <div className="w-full max-w-[935px] lg:mx-0 mx-auto px-4 sm:px-5 flex items-center justify-between gap-3"
          style={isElectron ? { paddingLeft: 82 } : undefined}>
          <div className="flex items-center gap-2"
            style={isElectron ? { WebkitAppRegion: 'no-drag' } as React.CSSProperties : undefined}>
            <button onClick={(e) => { e.stopPropagation(); setInviteOpen(true); }} title="Convite"
              className="flex-shrink-0 flex items-center justify-center p-2 rounded-full text-neutral-500 dark:text-neutral-300 bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_4px_10px_-1px_rgba(0,0,0,0.22),0_1px_3px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.6)] dark:shadow-[0_4px_10px_-1px_rgba(0,0,0,0.55),0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.04)] hover:bg-[#e4e7ea] dark:hover:bg-[#353535] hover:text-neutral-800 dark:hover:text-white transition-all duration-200 cursor-pointer active:scale-90">
              <Mail size={22} />
            </button>
            <button onClick={() => setEmpresaOpen(true)} className="flex items-center gap-2 cursor-pointer transition-all duration-200 active:scale-[0.97]">
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-neutral-800 dark:text-neutral-100">
                {isPersonalizedRole(role) && activeSector === 'os1' ? roleConfig.bio.displayName : data.negocio.nome_fantasia}
              </h1>
              <ChevronDown size={14} className="text-neutral-400 sm:hidden" />
              <ChevronDown size={16} className="text-neutral-400 hidden sm:block" />
            </button>
          </div>
          {/* Botões — mobile/tablet apenas; desktop fica no topo do chat.
              Modo escuro foi movido pro header da Área de Trabalho. */}
          <div className="flex items-center lg:hidden"
            style={isElectron ? { WebkitAppRegion: 'no-drag' } as React.CSSProperties : undefined}>
            <button
              onClick={handleLogout}
              title="Sair"
              className="cursor-pointer text-neutral-800 dark:text-neutral-100 p-2 sm:p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 transition-all duration-200 active:scale-90"
            >
              <Power size={18} className="sm:hidden" />
              <Power size={20} className="hidden sm:block" />
            </button>
            <button
              onClick={() => setSectorOpen(true)}
              className="cursor-pointer p-2 sm:p-2.5 lg:p-3.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 transition-all duration-200 active:scale-90 relative"
              title={activeSector === 'os1' ? 'Trocar perfil de empresa' : 'Trocar área da empresa'}
            >
              {(() => {
                const highlighted = (activeSector !== 'os1' || role === 'franchise') ? activeDepartment !== 'geral' : false;
                const cls = (size: string) => `${size} ${highlighted ? 'text-[#3b82f6]' : 'text-neutral-800 dark:text-neutral-100'}`;
                return (<>
                  <Plus size={22} className={`sm:hidden ${cls('')}`} />
                  <Plus size={22} className={`hidden sm:block lg:hidden ${cls('')}`} />
                  <Plus size={30} className={`hidden lg:block ${cls('')}`} />
                </>);
              })()}
              {(activeSector !== 'os1' || role === 'franchise') && activeDepartment !== 'geral' && (
                <span className="absolute top-1.5 right-1.5 lg:top-2.5 lg:right-2.5 w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
              )}
            </button>
            <button onClick={() => (role === 'codify' && activeSector === 'os1') ? setEsferaOpen(true) : setDifficultyOpen(true)} className="cursor-pointer text-neutral-800 dark:text-neutral-100 p-2 sm:p-2.5 lg:p-3.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 transition-all duration-200 active:scale-90" title="Dificuldade">
              <Settings2 size={18} className="sm:hidden" />
              <Settings2 size={20} className="hidden sm:block lg:hidden" />
              <Settings2 size={24} className="hidden lg:block" />
            </button>
            <button className="relative cursor-pointer text-neutral-800 dark:text-neutral-100 p-2 sm:p-2.5 lg:p-3.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 transition-all duration-200 active:scale-90">
              <Bell size={18} className="sm:hidden" />
              <Bell size={20} className="hidden sm:block lg:hidden" />
              <Bell size={24} className="hidden lg:block" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
          </div>
        </div>
      </nav>

    <div
      style={{ paddingRight: (scrolled && isDesktop) ? '50vw' : undefined, transition: 'padding-right 500ms cubic-bezier(0.25,0.1,0.25,1)' }}
      className="min-h-screen bg-[#dcdfe2] dark:bg-[#181818] text-neutral-800 dark:text-neutral-100 font-sans lg:pr-[380px] xl:pr-[396px]"
    >

      <main
        style={mainPadTop !== undefined ? { paddingTop: mainPadTop } : undefined}
        className={`max-w-[935px] mx-auto ${scrolled ? '' : 'pt-3 sm:pt-4 md:pt-8 lg:pt-3'}`}
      >
        {/* Container unificado de fundo — os elementos internos flutuam por cima */}
        <div className="mx-4 sm:mx-5 bg-[#f0f2f4] dark:bg-[#323232] rounded-2xl border-[0.5px] border-neutral-100 dark:border-[#414141] shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)] relative"
          style={{ clipPath: 'inset(0 round 1rem)' }}>
        {/* Perfil — colapsa ao rolar */}
        <motion.div
          initial={false}
          animate={{
            height: scrolled ? 0 : 'auto',
            opacity: scrolled ? 0 : 1,
          }}
          transition={{
            height: { type: 'spring', stiffness: 260, damping: 32, mass: 1 },
            opacity: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
          }}
          style={{ overflow: 'hidden', pointerEvents: scrolled ? 'none' : 'auto' }}
        >

          {/* Foto + bio + botões */}
          <section className="px-4 sm:px-5 flex flex-col gap-3 sm:gap-4">
            {(() => {
              const isRoleView = isPersonalizedRole(role) && activeSector === 'os1';
              const bio = roleConfig.bio;
              const photoShape: 'round' | 'square' = photoSettings.shape ?? (activeSector === 'os1' ? 'square' : 'round');
              const photoShapeOuter = photoShape === 'round' ? 'rounded-full' : 'rounded-2xl';
              const photoShapeMid   = photoShape === 'round' ? 'rounded-full' : 'rounded-[14px] md:rounded-[18px]';
              const photoShapeInner = photoShape === 'round' ? 'rounded-full' : 'rounded-[12px] md:rounded-[14px]';
              return (
            <div className="py-3 sm:py-4 flex flex-row gap-3 sm:gap-4 items-center">
              <div className="flex-shrink-0 relative w-20 h-20 md:w-[150px] md:h-[150px]">
                {/* Sombra externa do disco — separa o anel do fundo (igual destaques) */}
                <div className={`absolute inset-0 ${photoShapeOuter} shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)] pointer-events-none`} />
                {/* Camada 1: anel cinza base (padding outer cria a espessura visível) */}
                <div className={`absolute inset-0 ${photoShapeOuter} bg-neutral-200 dark:bg-[#262626] p-[2px] md:p-[4px]`}>
                  {/* Camada 2: anel gradient azul (CSS gradient border via padding + bg) */}
                  <div
                    className={`w-full h-full ${photoShapeMid} p-[3px] md:p-[5px] relative overflow-hidden`}
                    style={{
                      background: 'conic-gradient(from 135deg at 50% 50%, #2563eb, #60a5fa, #3b82f6, #2563eb, #60a5fa, #2563eb)',
                    }}
                  >
                {/* Sombra interna do miolo — separa a foto do anel */}
                <div className={`absolute inset-[6px] md:inset-[10px] ${photoShapeInner} shadow-[inset_0_2px_5px_rgba(0,0,0,0.22),inset_0_-1px_2px_rgba(0,0,0,0.08)] dark:shadow-[inset_0_2px_6px_rgba(0,0,0,0.6),inset_0_-1px_3px_rgba(0,0,0,0.35)] pointer-events-none z-[3]`} />
                <div className={`w-full h-full ${photoShapeInner} overflow-hidden relative bg-white dark:bg-[#1a1a1a]`}>
                  <div
                    className="w-full h-full rounded-xl overflow-hidden relative"
                    style={isRoleView ? bio.gradientStyle : activeSector === 'os1' ? {
                      background: 'radial-gradient(ellipse 100% 100% at 45% 40%, #5a5a5a 0%, #2a2a2a 40%, #080808 100%)',
                    } : undefined}
                  >
                    {(isRoleView ? role === 'codify' : activeSector === 'os1') && (
                      <div style={{
                        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                        opacity: 0.07,
                      }} />
                    )}
                    {isRoleView && roleConfig.bio.photoUrl ? (
                      <img
                        src={roleConfig.bio.photoUrl}
                        alt={roleConfig.bio.displayName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 2 }}
                      />
                    ) : !isRoleView && photoSettings.src ? (
                      <img
                        src={photoSettings.src}
                        alt="perfil"
                        style={{
                          width: '100%', height: '100%', objectFit: 'cover',
                          transform: `scale(${photoSettings.zoom}) translate(${photoSettings.x / photoSettings.zoom}px, ${photoSettings.y / photoSettings.zoom}px)`,
                          transformOrigin: 'center',
                          position: 'relative', zIndex: 2,
                        }}
                      />
                    ) : !isRoleView && DEMO_LOGOS[activeSector] ? (
                      <div style={{
                        width: '100%', height: '100%',
                        background: DEMO_LOGOS[activeSector].bg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: DEMO_LOGOS[activeSector].pad ?? '18%',
                        position: 'relative', zIndex: 2,
                      }}>
                        <img
                          src={DEMO_LOGOS[activeSector].src}
                          alt={activeSector}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </div>
                    ) : (() => {
                      if (isRoleView) {
                        return (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            <span style={{
                              color: '#ffffff',
                              fontFamily: role === 'codify' ? "'Big Shoulders Display', sans-serif" : 'ui-monospace, SFMono-Regular, Consolas, monospace',
                              fontWeight: 900,
                              fontSize: role === 'codify' ? 'clamp(34px, 11vw, 56px)' : 'clamp(24px, 8vw, 40px)',
                              letterSpacing: '-0.04em',
                              userSelect: 'none', position: 'relative', zIndex: 2,
                            }}>{bio.initials}</span>
                          </div>
                        );
                      }
                      const activeProfile = SECTORS.find(s => s.id === activeSector);
                      const isOS1 = activeSector === 'os1';
                      return (
                        <div style={{
                          width: '100%', height: '100%',
                          background: isOS1 ? 'transparent' : (activeProfile?.color ?? '#3b82f6') + '22',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          position: 'relative', overflow: 'hidden',
                        }}>
                          <span style={{
                            color: isOS1 ? '#ffffff' : (activeProfile?.color ?? '#3b82f6'),
                            fontFamily: isOS1 ? "'Big Shoulders Display', sans-serif" : 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, monospace',
                            fontWeight: 900,
                            fontSize: 'clamp(34px, 11vw, 56px)',
                            letterSpacing: isOS1 ? '-0.04em' : '-0.05em',
                            userSelect: 'none',
                            position: 'relative',
                            textShadow: 'none',
                            zIndex: 2,
                          }}>{activeProfile?.logo ?? '?'}</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
                  </div>
                </div>
              </div>
              <div className={`flex-1 flex-shrink-0 min-w-0 flex flex-col gap-2 sm:gap-3 ${isRoleView ? 'justify-start' : 'justify-center'} min-h-[140px] md:min-h-[180px] bg-[#f7f8f9] dark:bg-[#2f2f2f] rounded-xl border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)] p-3 sm:p-4`}>
                {isRoleView ? (
                  <>
                    {/* Barra de resumo — só codify */}
                    {roleConfig.showSummaryBar && roleConfig.summaryNumbers && (
                      <div className="flex items-center gap-2 text-[11px] sm:text-xs md:text-sm text-neutral-500 dark:text-white font-medium">
                        {[
                          { label: 'empresas',  value: roleConfig.summaryNumbers.empresas,  description: `${roleConfig.summaryNumbers.empresas} empresas ativas no sistema. Aqui você vê o pipeline de cada uma, o status (ativo/em risco/inativo), nível, faturamento estimado e próximas ações de gestão.` },
                          { label: 'afiliados', value: roleConfig.summaryNumbers.afiliados, description: `${roleConfig.summaryNumbers.afiliados} afiliados vendendo. Lista de afiliados ativos com seus indicadores de performance — comissão acumulada, conversões, lifetime value e ranking.` },
                          { label: 'parceiros', value: roleConfig.summaryNumbers.parceiros, description: `${roleConfig.summaryNumbers.parceiros} parceiro(s) conectado(s). Lista de parceiros estratégicos — categoria, contratos ativos, datas de renovação, contatos comerciais e métricas conjuntas.` },
                        ].map(({ label, value, description }) => (
                          <button key={label} onClick={() => setStatInfo({ label, value, description })}
                            className="inline-flex items-center gap-1.5 pl-1 pr-2.5 py-1 bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)] hover:bg-[#e4e7ea] dark:hover:bg-[#353535] rounded-xl cursor-pointer transition-all duration-150 active:scale-[0.97]">
                            <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_4px_10px_-1px_rgba(0,0,0,0.22),0_1px_3px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.6)] dark:shadow-[0_4px_10px_-1px_rgba(0,0,0,0.55),0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.04)] text-sm sm:text-base">
                              <strong>{value}</strong>
                            </div>
                            {label}
                          </button>
                        ))}
                        <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => setMapOpen(true)}
                          className="inline-flex justify-center items-center gap-1 pl-1 pr-2 py-1 bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)] hover:bg-[#e4e7ea] dark:hover:bg-[#353535] rounded-xl text-[11px] sm:text-xs md:text-sm font-medium text-neutral-500 dark:text-white transition-opacity duration-150 cursor-pointer"
                        >
                          <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_4px_10px_-1px_rgba(0,0,0,0.22),0_1px_3px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.6)] dark:shadow-[0_4px_10px_-1px_rgba(0,0,0,0.55),0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.04)]">
                            <MapPinned size={22} className="text-neutral-400 dark:text-white" />
                          </div>
                          <span>Concorrentes</span>
                        </button>
                        <button onClick={() => setInviteOpen(true)} title="Convite"
                          className="inline-flex items-center justify-center p-1 bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)] hover:bg-[#e4e7ea] dark:hover:bg-[#353535] rounded-lg cursor-pointer transition-all duration-150 active:scale-[0.97]">
                          <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_4px_10px_-1px_rgba(0,0,0,0.22),0_1px_3px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.6)] dark:shadow-[0_4px_10px_-1px_rgba(0,0,0,0.55),0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.04)]">
                            <Mail size={18} className="text-neutral-400 dark:text-white" />
                          </div>
                        </button>
                        </div>
                      </div>
                    )}
                    {/* Stats inline + 3 linhas com ícones — franqueador/franquia/afiliado/parceiro */}
                    {roleConfig.roleStats && (
                      <div className="flex gap-3 sm:gap-4 md:gap-10 items-center text-[11px] sm:text-xs md:text-base text-neutral-800 dark:text-neutral-200">
                        {roleConfig.roleStats.map((s, i) => (
                          <span key={i}><strong>{s.value}</strong> {s.label}</span>
                        ))}
                      </div>
                    )}
                    {roleConfig.bioLines && (
                      <div className="space-y-0.5 sm:space-y-1">
                        {roleConfig.bioLines.map((line, i) => {
                          const color = line.icon === 'store' ? '#0891b2' : line.icon === 'mappin' ? '#f59e0b' : '#16a34a';
                          const Icon = line.icon === 'store' ? Store : line.icon === 'mappin' ? MapPin : Zap;
                          return (
                            <div key={i} className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs md:text-sm">
                              <Icon size={13} className="sm:hidden flex-shrink-0" style={{ color }} strokeWidth={2.2} />
                              <Icon size={15} className="hidden sm:block flex-shrink-0" style={{ color }} strokeWidth={2.2} />
                              <span className="text-neutral-800 dark:text-neutral-200 truncate">{line.text}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <p className="text-[11px] sm:text-xs md:text-sm text-neutral-500 dark:text-white font-medium mt-0.5 sm:mt-1">{bio.bioText}</p>
                    {bio.bioSubtext && (
                      <p className="text-[11px] sm:text-xs md:text-sm text-neutral-800 dark:text-neutral-200">{bio.bioSubtext}</p>
                    )}
                  </>
                ) : (
                  <>
                <div className="flex items-center gap-2 text-[11px] sm:text-xs md:text-sm text-neutral-500 dark:text-white font-medium">
                  {[
                    { label: txt('stat_opor'),  value: gridItems.length,           description: `${gridItems.length} ${txt('stat_opor')} no seu negócio. Cada uma tem prioridade, prazo, esforço estimado e impacto potencial. Aqui você vê o pipeline completo, status e próximos passos.` },
                    { label: 'Oponentes',       value: data.concorrentes.length,   description: `${data.concorrentes.length} Oponentes monitorados na região. Lista detalhada com posicionamento, faixa de preço, força de marca, atividade recente e nível de ameaça.` },
                    { label: txt('stat_nivel'), value: data.negocio.nivel,         description: `${txt('stat_nivel')} ${data.negocio.nivel}. Progressão do negócio — métricas que compõem o nível atual, o que falta pra subir, comparativo com pares e ações recomendadas pra evolução.` },
                  ].map(({ label, value, description }) => (
                    <button key={String(label)} onClick={() => setStatInfo({ label: String(label), value, description })}
                      className="inline-flex items-center gap-1.5 pl-1 pr-2.5 py-1 bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)] hover:bg-[#e4e7ea] dark:hover:bg-[#353535] rounded-xl cursor-pointer transition-all duration-150 active:scale-[0.97]">
                      <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_4px_10px_-1px_rgba(0,0,0,0.22),0_1px_3px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.6)] dark:shadow-[0_4px_10px_-1px_rgba(0,0,0,0.55),0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.04)] text-sm sm:text-base">
                        <strong>{value}</strong>
                      </div>
                      {label}
                    </button>
                  ))}
                <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setMapOpen(true)}
                  className="inline-flex justify-center items-center gap-1 pl-1 pr-2 py-1 bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)] hover:bg-[#e4e7ea] dark:hover:bg-[#353535] rounded-xl text-[11px] sm:text-xs md:text-sm font-medium text-neutral-500 dark:text-white transition-opacity duration-150 cursor-pointer"
                >
                  <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_4px_10px_-1px_rgba(0,0,0,0.22),0_1px_3px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.6)] dark:shadow-[0_4px_10px_-1px_rgba(0,0,0,0.55),0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.04)]">
                    <MapPinned size={22} className="text-neutral-400 dark:text-white" />
                  </div>
                  <span>Concorrentes</span>
                </button>
                <button onClick={() => setInviteOpen(true)} title="Convite"
                  className="inline-flex items-center justify-center p-1 bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)] hover:bg-[#e4e7ea] dark:hover:bg-[#353535] rounded-lg cursor-pointer transition-all duration-150 active:scale-[0.97]">
                  <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_4px_10px_-1px_rgba(0,0,0,0.22),0_1px_3px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.6)] dark:shadow-[0_4px_10px_-1px_rgba(0,0,0,0.55),0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.04)]">
                    <Mail size={18} className="text-neutral-400 dark:text-white" />
                  </div>
                </button>
                </div>
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs md:text-sm mt-0.5 sm:mt-1">
                    <Store size={13} className="sm:hidden text-[#0891b2] flex-shrink-0" strokeWidth={2.2} />
                    <Store size={15} className="hidden sm:block text-[#0891b2] flex-shrink-0" strokeWidth={2.2} />
                    <span className="text-neutral-800 dark:text-neutral-200 truncate">{txt('bio_mercado')} · {data.mercado_nome ?? 'Beleza & Estética'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs md:text-sm">
                    <MapPin size={13} className="sm:hidden text-[#f59e0b] flex-shrink-0" strokeWidth={2.2} />
                    <MapPin size={15} className="hidden sm:block text-[#f59e0b] flex-shrink-0" strokeWidth={2.2} />
                    <span className="text-neutral-800 dark:text-neutral-200 truncate">{txt('bio_posicao')} · {data.ranking_local ?? '—'}° de {data.concorrentes.length + 1} na região</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs md:text-sm">
                    <Zap size={13} className="sm:hidden text-[#16a34a] flex-shrink-0" strokeWidth={2.2} />
                    <Zap size={15} className="hidden sm:block text-[#16a34a] flex-shrink-0" strokeWidth={2.2} />
                    <span className="text-neutral-800 dark:text-neutral-200 truncate">{txt('bio_evolucao')} · {data.progresso_pct}% para o próximo nível</span>
                  </div>
                </div>
                  </>
                )}
              </div>
            </div>
              );
            })()}
          </section>

          {/* Destaques */}
          <AnimatePresence>
            {destaqueOpen && (
              <motion.section
                key="bio-destaques"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="px-4 sm:px-5 overflow-hidden"
              >
                <div className="pb-3 sm:pb-4 flex flex-col gap-3 sm:gap-4">
                  {destaqueOpen && (
                    <div className="flex gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar md:justify-between">
                      {circleData.map((c, i) => (
                        <CircleProgress key={c.label} pct={c.pct} label={c.label} color={c.color} delay={i * 0.08} onClick={() => setFullscreenCard({ type: 'destaque', idx: i })} />
                      ))}
                    </div>
                  )}
                </div>
              </motion.section>
            )}
          </AnimatePresence>

        </motion.div>
        </div>
      </main>

      {/* Feed de setor por empresa (não-OS1 com departamento ativo, ou Franquia em setor específico) */}
      {((activeSector !== 'os1' && activeDepartment !== 'geral') || (role === 'franchise' && activeDepartment !== 'geral')) && (
        <SectorFeed
          department={activeDepartment as Exclude<DepartmentId, 'geral'>}
          feeds={PROFILE_SECTOR_FEEDS[activeSector] ?? PROFILE_SECTOR_FEEDS['mcdonalds']}
          onOpenWorkspace={openWorkspaceFromCard}
        />
      )}

      {/* Feed role-specific (codify, affiliate, franchisor que não usa setores padrão) */}
      {isPersonalizedRole(role) && activeSector === 'os1' && !roleConfig.useDefaultSectors && (() => {
        const isRoleView = true;
        const showDemos = shouldShowRoleDemos(role, activeRoleTab);

        if (showDemos) {
          // mostra o feed normal do OS1 (demos)
          return null;
        }

        // Determina quais cards mostrar
        let cards: RoleFeedCard[] = [];

        // Cards do franchisor por aba
        if (role === 'franchisor') {
          const relevantCards = filterFranchisorCardsByTab(roleConfig.feedCards, activeRoleTab);
          cards = relevantCards.filter(c => !dismissedCards.has(c.id));
        } else {
          cards = roleConfig.feedCards.filter(c => !dismissedCards.has(c.id));
        }

        const urgenciaColor = (u: string) => u === 'alta' ? '#ef4444' : u === 'media' ? '#f59e0b' : '#6b7280';

        return (
          <motion.div
            className={`max-w-[935px] mx-auto ${scrolled ? '' : 'mt-3 sm:mt-4'} pb-12 space-y-3 sm:space-y-4 px-4 sm:px-5`}
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }}
          >
            {cards.length === 0 && (
              <div className="text-center text-neutral-400 py-12 text-sm">Nenhum item nesta aba.</div>
            )}
            {cards.map(card => (
              <motion.div key={card.id} variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } } }}>
                <AnimatePresence>
                  <motion.div layout exit={{ opacity: 0, height: 0, marginBottom: 0 }} transition={{ duration: 0.25 }}>
                    <FeedCard
                      onWorkspaceIntent={(intent) => openWorkspaceFromCard(roleFeedCardToIntelligenceCard(card), intent)}
                      onFullscreen={() => openWorkspaceFromCard(roleFeedCardToIntelligenceCard(card), 'utilizar')}
                    >
                      <div className="relative">
                        {roleConfig.showPendingBadge && card.isPending && (
                          <span className="absolute -top-0.5 right-0 px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full">Pendente</span>
                        )}
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: urgenciaColor(card.urgencia) }}>{card.tags[0]}</p>
                        <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 leading-snug pr-16">{card.titulo}</p>
                        <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{card.resumo}</p>
                        {roleConfig.showApproveButtons && card.isPending && (
                          <div className="flex gap-2 mt-3">
                            <button onClick={() => { setDismissedCards(s => new Set(s).add(card.id)); showToast('Aprovado', 'green'); }} className="flex-1 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-xl transition-all cursor-pointer">Aprovar</button>
                            <button onClick={() => { setDismissedCards(s => new Set(s).add(card.id)); showToast('Reprovado', 'red'); }} className="flex-1 py-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold rounded-xl transition-all cursor-pointer">Reprovar</button>
                          </div>
                        )}
                        {role === 'franchisor' && !card.isPending && (
                          <div className="mt-2">
                            <button onClick={() => setSendNetworkOpen(card.id)} className="px-3 py-1.5 bg-white/50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-white/10 transition-all cursor-pointer">Enviar pra rede</button>
                          </div>
                        )}
                      </div>
                    </FeedCard>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        );
      })()}

      {/* Modal "Enviar pra rede" */}
      <AnimatePresence>
        {sendNetworkOpen && (
          <>
            <motion.div key="overlay-network" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm" onClick={() => setSendNetworkOpen(null)} />
            <motion.div key="modal-network" initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[90] flex items-center justify-center px-4 pointer-events-none"
            >
              <div className="w-full max-w-[360px] bg-[#1a1a1a] border border-white/10 rounded-2xl p-5 shadow-xl pointer-events-auto">
                <h3 className="text-white font-semibold text-sm mb-3">Enviar pra unidades</h3>
                <div className="space-y-2 mb-4">
                  {FRANCHISOR_FRANCHISE_NAMES.map(f => (
                    <label key={f} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sendNetworkSelected.has(f)}
                        onChange={e => {
                          setSendNetworkSelected(prev => {
                            const next = new Set(prev);
                            if (e.target.checked) next.add(f); else next.delete(f);
                            return next;
                          });
                        }}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm text-white/80">{f}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSendNetworkOpen(null)} className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white/60 text-sm rounded-xl transition-all cursor-pointer">Cancelar</button>
                  <button
                    onClick={() => { setSendNetworkOpen(null); showToast(`Enviado pra ${sendNetworkSelected.size} unidade${sendNetworkSelected.size !== 1 ? 's' : ''}`, 'blue'); }}
                    className="flex-[2] py-2.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast global */}
      <Toast message={toast.message} color={toast.color} visible={toast.visible} onHide={hideToast} />

      {/* Feed geral da empresa (OS1 sempre, ou outros perfis em modo Geral) */}
      {(activeSector === 'os1' || activeDepartment === 'geral') &&
       !(role === 'franchise' && activeDepartment !== 'geral') &&
       (!isPersonalizedRole(role) || roleConfig.useDefaultSectors ||
        ((role === 'codify' || role === 'affiliate' || role === 'team_member') && activeRoleTab === 'demos') ||
        (roleConfig.swipeOptions.length === 0)
       ) && <motion.div
        className={`max-w-[935px] mx-auto ${scrolled ? '' : 'mt-3 sm:mt-4'} pb-12 space-y-3 sm:space-y-4 px-4 sm:px-5`}
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
      >

        {/* Cards do role no topo do feed (codify/afiliado/parceiro/franquia na aba Demos ou useDefaultSectors).
            Só aparecem no perfil próprio (activeSector === 'os1') — em demos eles confundiriam com cards da demo. */}
        {isPersonalizedRole(role) && activeSector === 'os1' && roleConfig.feedCards.length > 0 && roleConfig.feedCards.map(card => (
          <motion.div key={card.id} variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } } }}>
            <FeedCard
              onWorkspaceIntent={(intent) => openWorkspaceFromCard(roleFeedCardToIntelligenceCard(card), intent)}
              onFullscreen={() => openWorkspaceFromCard(roleFeedCardToIntelligenceCard(card), 'utilizar')}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: card.urgencia === 'alta' ? '#ef4444' : card.urgencia === 'media' ? '#f59e0b' : '#6b7280' }}>{card.tags[0]}</p>
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 leading-snug">{card.titulo}</p>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{card.resumo}</p>
                </div>
                <ChevronRight size={16} className="text-neutral-300 dark:text-neutral-600 flex-shrink-0 mt-1" />
              </div>
            </FeedCard>
          </motion.div>
        ))}

        {/* Cards do feed da empresa:
            - activeSector === 'os1' → cards reais do backend (orchCards)
            - outras demos → cards mockados específicos da empresa (DEMO_FEED_CARDS) */}
        {(activeSector === 'os1' ? orchCards : (DEMO_FEED_CARDS[activeSector] ?? [])).map(card => (
          <motion.div key={card.id} variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } } }}>
            <FeedCard
              onWorkspaceIntent={(intent) => openWorkspaceFromCard(card, intent)}
              onFullscreen={() => openWorkspaceFromCard(card, 'utilizar')}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: card.urgencia === 'alta' ? '#ef4444' : card.urgencia === 'media' ? '#f59e0b' : '#6b7280' }}>{card.dominio}</p>
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 leading-snug">{card.titulo}</p>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed line-clamp-2">{card.resumo}</p>
                </div>
                <ChevronRight size={16} className="text-neutral-300 dark:text-neutral-600 flex-shrink-0 mt-1" />
              </div>
            </FeedCard>
          </motion.div>
        ))}

        {/* Cards 1–10 fixos (Av. Paulista / ANVISA / fast food) — só na empresa OS1.
            Demais demos usam apenas DEMO_FEED_CARDS específicos do setor. */}
        {activeSector === 'os1' && (<>
        {[
          { label: txt('lbl_conc'), containerType: 'concorrencia', color: '#ef4444', titulo: timeline.filter(e=>e.tipo==='concorrente')[0]?.titulo ?? `${[...data.concorrentes].sort((a,b)=>Number(b.nota_google)-Number(a.nota_google))[0]?.nome ?? 'Concorrente'} lidera com ★ ${Number([...data.concorrentes].sort((a,b)=>Number(b.nota_google)-Number(a.nota_google))[0]?.nota_google||0).toFixed(1)}`, detalhe: timeline.filter(e=>e.tipo==='concorrente')[0]?.detalhe ?? `${data.concorrentes.length} concorrentes mapeados. Monitore os movimentos da região.`, onClick: () => { const e = timeline.filter(e=>e.tipo==='concorrente')[0]; if(e) setSelectedTimelineEvent(e); } },
          { label: txt('lbl_merc'), containerType: 'mercado', color: '#3b82f6', titulo: timeline.filter(e=>e.tipo==='mercado')[0]?.titulo ?? 'Delivery cresce 31% no fast food em 2025', detalhe: timeline.filter(e=>e.tipo==='mercado')[0]?.detalhe ?? 'iFood e Rappi concentram 78% dos pedidos de fast food em SP. Quem não está no delivery perde fatia crescente.', onClick: () => { const e = timeline.filter(e=>e.tipo==='mercado')[0]; if(e) setSelectedTimelineEvent(e); } },
          { label: txt('lbl_econ'), containerType: 'economia', color: '#3b82f6', titulo: `Ticket médio R$ 38–52 · Nota média ★ ${notaMediaNum} na região`, detalhe: 'Poder de compra estável na Paulista. Combos e promoções de app são o principal driver de decisão.', onClick: undefined },
          { label: txt('lbl_even'), containerType: 'eventos', color: '#3b82f6', titulo: 'Páscoa 13–20/abr · Dia das Mães 11/mai · Festa Junina Jun', detalhe: data.previsao_clima[0] ? `Clima SP: ${data.previsao_clima[0].icone} ${data.previsao_clima[0].temp_max}° — ${data.previsao_clima[0].dia_label}` : 'Prepare campanhas e lançamentos sazonais com antecedência.', onClick: undefined },
          { label: txt('lbl_rep'), containerType: undefined as string | undefined, color: '#3b82f6', titulo: `Nota média ★ ${notaMediaNum} · ${data.concorrentes.filter(c=>Number(c.nota_google)>=4.5).length} concorrentes acima de 4,5`, detalhe: 'Avaliações no Google e iFood são o principal critério de escolha. Responda reviews negativos em até 24h.', onClick: undefined },
        ].map(item => (
          <motion.div key={item.label} variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } } }}>
            <FeedCard locked>
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{color: item.color}}>{item.label}</p>
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 leading-snug">{item.titulo}</p>
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{item.detalhe}</p>
                </div>
                <ChevronRight size={16} className="text-neutral-300 dark:text-neutral-600 flex-shrink-0 mt-1" />
              </div>
            </FeedCard>
          </motion.div>
        ))}

        {/* Card 6: Região */}
        <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } } }}>
          <FeedCard locked>
            <p className="text-xs font-bold uppercase tracking-wider text-[#3b82f6] mb-2">{txt('geo_regiao')}</p>
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 leading-snug">Av. Paulista, {data.negocio.cidade} — {difficulty === 'muito_facil' ? 'lugar com muita gente passando' : difficulty === 'facil' ? 'área movimentada com forte concorrência' : difficulty === 'dificil' ? 'corredor de alto tráfego com densidade competitiva elevada' : difficulty === 'muito_dificil' ? 'high-density corridor com intense competitive pressure' : 'alto fluxo e forte concorrência no corredor'}</p>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{difficulty === 'muito_facil' ? 'Muita gente passa por aqui todo dia. Horários cheios: 11h–14h e 18h–21h. Público: trabalhadores, turistas e moradores.' : difficulty === 'muito_dificil' ? '+500k people/day. Peak hours: 11h–14h, 18h–21h. Demographics: corporate professionals, tourists, local residents.' : 'Corredor com +500 mil pessoas/dia. Pico de movimento: 11h–14h e 18h–21h. Público: executivos, turistas e moradores da região.'}</p>
          </FeedCard>
        </motion.div>

        {/* Card 7: Clima */}
        {data.previsao_clima.length > 0 && (
          <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } } }}>
            <FeedCard locked>
              <p className="text-xs font-bold uppercase tracking-wider text-[#3b82f6] mb-3">{txt('geo_clima')}</p>
              <div className="flex gap-4 overflow-x-auto no-scrollbar">
                {data.previsao_clima.map((w, i) => (
                  <div key={i} className="flex-shrink-0 text-center">
                    <p className="text-xl">{w.icone}</p>
                    <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-100">{w.dia_label}</p>
                    <p className="text-xs text-neutral-500">{w.temp_max}°</p>
                  </div>
                ))}
              </div>
            </FeedCard>
          </motion.div>
        )}

        {/* Card 8: Legislação */}
        <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } } }}>
          <FeedCard locked>
            <p className="text-xs font-bold uppercase tracking-wider text-[#3b82f6] mb-3">{txt('leg_conf')}</p>
            <div className="grid grid-cols-2 gap-4">
              {[{label:'Vigilância sanitária',valor:'OK'},{label:'Alvará municipal',valor:'OK'},{label:'ANVISA alimentos',valor:'2025'},{label:'CVS-5 manipulação',valor:'Jan/25'}].map(s => (
                <div key={s.label}>
                  <p className="text-lg font-bold text-neutral-800 dark:text-neutral-100">{s.valor}</p>
                  <p className="text-xs text-neutral-500">{s.label}</p>
                </div>
              ))}
            </div>
          </FeedCard>
        </motion.div>

        {/* Card 9: Alertas */}
        <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } } }}>
          <FeedCard locked>
            <p className="text-xs font-bold uppercase tracking-wider text-[#3b82f6] mb-1">{txt('leg_atenc')}</p>
            <p className="text-sm text-neutral-500 leading-relaxed">{txt('leg_desc')}</p>
          </FeedCard>
        </motion.div>

        {/* Card 10: Tendências */}
        <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } } }}>
          <FeedCard locked>
            <p className="text-xs font-bold uppercase tracking-wider text-[#3b82f6] mb-2">Tendências</p>
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 leading-snug">Frango crispy e combos personalizáveis lideram pedidos em SP</p>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">Clientes buscam opções sem glúten e proteína vegetal. Pedidos via app crescem 22% — customização é o diferencial competitivo do momento.</p>
          </FeedCard>
        </motion.div>
        </>)}

        {/* Carregar mais */}
        <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } } }}>
          <button className="w-full py-4 flex items-center justify-between px-4 md:px-5 bg-[#f0f2f4] dark:bg-[#323232] border-[0.5px] border-neutral-100 dark:border-[#414141] hover:bg-[#e4e7ea] dark:hover:bg-[#353535] rounded-2xl text-sm font-semibold text-neutral-500 dark:text-neutral-400 transition-all duration-200 cursor-pointer active:scale-[0.99]">
            <ChevronDown size={14} strokeWidth={1.8} className="text-neutral-300 dark:text-neutral-600" />
            <span>Mais feed</span>
            <ChevronDown size={14} strokeWidth={1.8} className="text-neutral-300 dark:text-neutral-600" />
          </button>
        </motion.div>

      </motion.div>}

      {/* Stories */}
      {storyIndex !== null && <StoryViewer groups={stories} startIndex={storyIndex} onClose={() => setStoryIndex(null)} />}

      {/* Detalhes do Stat (3 empresas / 2 afiliados / etc) */}
      <AnimatePresence>
        {statInfo && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-end md:items-center justify-center"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setStatInfo(null)} />
            <motion.div
              initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full md:max-w-md bg-[#f0f2f4] dark:bg-[#323232] rounded-t-2xl md:rounded-2xl p-6 border border-transparent dark:border-[#414141]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_4px_10px_-1px_rgba(0,0,0,0.22),0_1px_3px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.6)] dark:shadow-[0_4px_10px_-1px_rgba(0,0,0,0.55),0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.04)] text-base font-bold text-neutral-800 dark:text-white">
                    {statInfo.value}
                  </div>
                  <h2 className="text-base font-bold text-neutral-800 dark:text-neutral-100 capitalize">{statInfo.label}</h2>
                </div>
                <button onClick={() => setStatInfo(null)} className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white cursor-pointer">✕</button>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">{statInfo.description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor de Foto */}
      <AnimatePresence>
        {photoEditorOpen && (
          <PhotoEditor
            defaultSrc={BARBER_PHOTOS.profile}
            initial={photoSettings}
            onSave={handlePhotoSave}
            onClose={() => setPhotoEditorOpen(false)}
          />
        )}
      </AnimatePresence>


      {/* Modal Mapa do Mercado */}
      <AnimatePresence>
        {mapOpen && <MarketMapContent open={mapOpen} onClose={() => setMapOpen(false)} competitors={data.concorrentes} onCompetitorClick={setSelectedConcorrente} />}
      </AnimatePresence>


      {/* Modal Evolução */}
      <AnimatePresence>
        {evolucaoOpen && (
          <BottomModal onClose={() => setEvolucaoOpen(false)}>
            <ModalHeader onClose={() => setEvolucaoOpen(false)}><Trophy size={18} className="text-[#3b82f6]" /><h2 className="text-base font-bold">Evolução</h2></ModalHeader>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-xs text-neutral-500 uppercase font-bold tracking-widest">Nível atual</p>
                  <p className="text-xl font-bold mt-1">{data.nivel_label}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#3b82f6]">{data.negocio.pontos}</p>
                  <p className="text-xs text-neutral-500">/ {data.pontos_proximo} pts</p>
                </div>
              </div>
              <div className="w-full h-2 bg-neutral-100 dark:bg-[#414141] rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${data.progresso_pct}%` }} transition={{ duration: 1, ease: 'easeOut' }} className="h-full bg-[#3b82f6] rounded-full" />
              </div>
              <p className="text-xs text-neutral-500 mt-2">{data.progresso_pct}% para o próximo nível</p>
            </div>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Histórico de Atividades</p>
            <div className="space-y-1">
              {data.gamificacao_log.map((log, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-neutral-100 dark:border-[#414141] last:border-0">
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">{log.acao}</span>
                  <span className="text-sm font-bold text-[#3b82f6]">+{log.pontos} pts</span>
                </div>
              ))}
            </div>
          </BottomModal>
        )}
      </AnimatePresence>


      {/* Modal Empresa */}
      <AnimatePresence>
        {empresaOpen && (
          <BottomModal onClose={() => setEmpresaOpen(false)}>
            <ModalHeader onClose={() => setEmpresaOpen(false)}><Info size={18} className="text-[#3b82f6]" /><h2 className="text-base font-bold">Empresa</h2></ModalHeader>
            <div className="space-y-0">
              {[{label:'Nome',value:data.negocio.nome_fantasia},{label:'Segmento',value:data.negocio.segmento},{label:'Cidade',value:`${data.negocio.cidade}, ${data.negocio.estado}`},{label:'Telefone',value:data.negocio.telefone},{label:'Nível',value:`${data.nivel_label} (Nível ${data.negocio.nivel})`},{label:'Pontos',value:`${data.negocio.pontos} pts`},{label:'Semana',value:data.semana_label}].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-neutral-100 dark:border-[#414141] last:border-0">
                  <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">{item.label}</span>
                  <span className="text-sm font-medium text-neutral-800 dark:text-neutral-300">{item.value}</span>
                </div>
              ))}
            </div>
          </BottomModal>
        )}
      </AnimatePresence>


      {/* Modal Salvos */}
      <AnimatePresence>
        {salvosOpen && (
          <BottomModal onClose={() => setSalvosOpen(false)}>
            <ModalHeader onClose={() => setSalvosOpen(false)}>
              <Bookmark size={18} className="text-[#3b82f6]" />
              <h2 className="text-base font-bold">Salvos</h2>
              {savedItems.length > 0 && <span className="bg-[#3b82f6] text-white text-xs rounded-full px-1.5 py-0.5 leading-none">{savedItems.length}</span>}
            </ModalHeader>
            {savedItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 gap-3 text-neutral-400">
                <Bookmark size={48} strokeWidth={1.5} />
                <p className="text-sm font-medium text-neutral-500">Nenhum item salvo ainda.</p>
                <p className="text-xs text-neutral-500 text-center">Toque no ícone de marcador em qualquer card do feed para salvar.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {savedItems.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-3 py-3 border-b border-neutral-100 dark:border-[#414141] last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide mb-0.5">{item.section}</p>
                      <p className="text-sm font-semibold leading-snug">{item.title}</p>
                      <p className="text-xs text-neutral-500 mt-1 leading-relaxed line-clamp-2">{item.preview}</p>
                    </div>
                    <button onClick={() => toggleSave(item.id, item.title, item.section, item.preview)} className="flex-shrink-0 p-1 text-[#3b82f6] hover:text-[#2563eb] transition-all duration-200 cursor-pointer">
                      <Bookmark size={16} fill="currentColor" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </BottomModal>
        )}
      </AnimatePresence>

      {/* Modal Timeline */}
      <AnimatePresence>
        {selectedTimelineEvent && <TimelineModal event={selectedTimelineEvent} onClose={() => setSelectedTimelineEvent(null)} />}
      </AnimatePresence>

      {/* Modal Concorrente */}
      <AnimatePresence>
        {selectedConcorrente && <ConcorrenteModal concorrente={selectedConcorrente} onClose={() => setSelectedConcorrente(null)} />}
      </AnimatePresence>

      {/* Browser / Sincronizar */}
      <BrowserView
        open={browserOpen}
        onClose={() => setBrowserOpen(false)}
        onSync={() => { setBrowserOpen(false); setTimeout(() => setScrolled(false), 300); }}
      />

      {/* Chat */}
      <ChatDesktop
        wide={scrolled}
        onSector={() => setSectorOpen(true)}
        onBrowser={() => setBrowserOpen(true)}
        onDifficulty={() => (role === 'codify' && activeSector === 'os1') ? setEsferaOpen(true) : setDifficultyOpen(true)}
        activeSector={activeSector}
        workspaceContext={workspaceContext}
        dark={dark}
        onToggleTheme={toggleTheme}
        onShowHistory={() => setChatHistoryOpen(o => !o)}
        chatHistoryOpen={chatHistoryOpen}
        archivedSessions={archivedSessionsBySector[activeSector] ?? []}
        onSelectHistorySession={() => { setChatHistoryOpen(false); setScrolled(true); }}
        onArchive={(cardTitle, sector, snapshot) => {
          const newSession = { id: `${Date.now()}`, ts: Date.now(), cardTitle, sector, snapshot };
          setArchivedSessionsBySector(prev => ({ ...prev, [sector]: [...(prev[sector] ?? []), newSession] }));
          setWorkspaceContext(null);
          setScrolled(false);
          setBioOpen(true);
          setDestaqueOpen(true);
        }}
      />
      <ChatFAB onClick={() => setChatOpen(true)} />
      <ChatMobile
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        workspaceContext={workspaceContext}
        activeSector={activeSector}
        onSector={() => setSectorOpen(true)}
        onBrowser={() => setBrowserOpen(true)}
        onDifficulty={() => (role === 'codify' && activeSector === 'os1') ? setEsferaOpen(true) : setDifficultyOpen(true)}
        unreadCount={unreadCount}
        dark={dark}
        onToggleTheme={toggleTheme}
        onShowHistory={() => setChatHistoryOpen(o => !o)}
        chatHistoryOpen={chatHistoryOpen}
        archivedSessions={archivedSessionsBySector[activeSector] ?? []}
        onSelectHistorySession={() => { setChatHistoryOpen(false); setScrolled(true); }}
        onArchive={(cardTitle, sector, snapshot) => {
          const newSession = { id: `${Date.now()}`, ts: Date.now(), cardTitle, sector, snapshot };
          setArchivedSessionsBySector(prev => ({ ...prev, [sector]: [...(prev[sector] ?? []), newSession] }));
          setWorkspaceContext(null);
          setScrolled(false);
          setBioOpen(true);
          setDestaqueOpen(true);
        }}
      />

      {/* Fullscreen */}
      <AnimatePresence>
        {/* WorkspacePanel fullscreen removido — cards do feed agora alimentam o chat. */}
        {fullscreenCard && fullscreenCard.type !== 'workspace' && (() => {
          const META: Record<string, { icon: React.ReactNode; title: string; color: string }> = {
            plano:     { icon: <Trophy size={20} className="text-[#3b82f6]" />,   title: 'Plano de Ação',  color: '#3b82f6' },
            estrategia:{ icon: <Layers size={20} className="text-[#3b82f6]" />,   title: 'Estratégia',     color: '#3b82f6' },
            pratica:   { icon: <Lightbulb size={20} className="text-[#0891b2]" />,title: 'Prática',        color: '#0891b2' },
          };

          const renderPEPSection = (pepKey: 'plano' | 'estrategia' | 'pratica', emptyIcon: React.ReactNode) => {
            if (selectedContainers.size === 0) return null;
            if (!pepData) return (
              <div className="flex flex-col items-center justify-center h-32 gap-2 text-neutral-400">
                <span className="text-3xl">⏳</span>
                <p className="text-sm text-center text-neutral-500">Ainda sendo gerado.</p>
              </div>
            );
            return Array.from(selectedContainers).map(ct => {
              const pep = pepData[ct];
              const items = pep?.[pepKey];
              if (!items?.length) return null;
              return (
                <div key={ct} className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: fullscreenCard.type !== 'card' ? META[fullscreenCard.type]?.color : '#3b82f6' }}>{CONTAINER_LABELS[ct] ?? ct}</p>
                  <div>{items.map((item, i) => renderPEPItem(item, i))}</div>
                </div>
              );
            });
          };

          const headerLabel = fullscreenCard.type === 'card' ? fullscreenCard.label
            : fullscreenCard.type === 'destaque' ? circleData[fullscreenCard.idx].label
            : META[fullscreenCard.type]?.title;
          const headerColor = fullscreenCard.type === 'card' ? fullscreenCard.color
            : fullscreenCard.type === 'destaque' ? circleData[fullscreenCard.idx].color
            : META[fullscreenCard.type]?.color;

          return (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed inset-0 z-[190] bg-[#f0f2f4] dark:bg-[#323232] flex flex-col overflow-y-auto"
            >
              <div className="flex items-center justify-between px-6 sm:px-8 pt-6 sm:pt-8 pb-4 flex-shrink-0 border-b border-neutral-100 dark:border-[#414141]">
                <div className="flex items-center gap-2">
                  {fullscreenCard.type !== 'card' && META[fullscreenCard.type]?.icon}
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: headerColor }}>{headerLabel}</p>
                </div>
                <button
                  onClick={() => setFullscreenCard(null)}
                  className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition-all duration-200 cursor-pointer"
                >
                  <X size={22} />
                </button>
              </div>
              <div className="flex-1 px-6 sm:px-8 py-8 max-w-3xl mx-auto w-full">
                {fullscreenCard.type === 'card' ? (
                  <>
                    <h2 className="text-2xl sm:text-3xl font-bold text-neutral-800 dark:text-neutral-100 leading-snug mb-5">{fullscreenCard.titulo}</h2>
                    <p className="text-sm sm:text-base text-neutral-500 leading-relaxed">{fullscreenCard.detalhe}</p>
                  </>
                ) : fullscreenCard.type === 'destaque' ? (() => {
                  const circle = circleData[fullscreenCard.idx];
                  const total = circle.slices.reduce((acc, x) => acc + x.value, 0);
                  return (
                    <>
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: circle.color }} />
                        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-800 dark:text-neutral-100">{circle.label}</h2>
                        <span className="text-xl font-bold" style={{ color: circle.color }}>{circle.pct}%</span>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-8">
                        <div className="flex-shrink-0"><PieChart segments={circle.slices} /></div>
                        <div className="flex flex-col gap-3 w-full">
                          {circle.slices.map((s, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <div className="w-3 h-3 rounded-sm flex-shrink-0 mt-0.5" style={{ backgroundColor: s.color }} />
                              <div>
                                <p className="text-sm text-neutral-800 dark:text-neutral-300 leading-tight">{s.label}</p>
                                <p className="text-xs text-neutral-500">{Math.round((s.value / total) * 100)}%</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="pt-6 border-t border-neutral-100 dark:border-[#414141] space-y-1">
                        {circle.descricao.split('\n').map((linha, i) => (
                          <p key={i} className={`text-sm leading-relaxed ${i === 0 ? 'text-neutral-800 dark:text-neutral-300 font-medium' : 'text-neutral-500'}`}>{linha}</p>
                        ))}
                      </div>
                    </>
                  );
                })()
                : fullscreenCard.type === 'plano' ? renderPEPSection('plano', <Trophy size={32} strokeWidth={1.5} />)
                  : fullscreenCard.type === 'estrategia' ? renderPEPSection('estrategia', <Layers size={32} strokeWidth={1.5} />)
                  : renderPEPSection('pratica', <Lightbulb size={32} strokeWidth={1.5} />)
                }
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Modal Item Grid */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedItem(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div layoutId={selectedItem.id} className="relative w-full max-w-[400px] bg-[#f0f2f4] dark:bg-[#323232] rounded-2xl overflow-hidden shadow-2xl border-[0.5px] border-neutral-100 dark:border-[#414141]">
              <div className="p-6 flex flex-col items-center text-center">
                <div className="text-5xl mb-4">{gridItems.find(i => i.id === selectedItem.id)?.emoji}</div>
                <h3 className="text-xl font-bold mb-1">{gridItems.find(i => i.id === selectedItem.id)?.title}</h3>
                <p className="text-neutral-500 text-xs uppercase tracking-widest font-bold mb-8">{gridItems.find(i => i.id === selectedItem.id)?.subtitle}</p>
                <div className="w-full space-y-5 text-left bg-neutral-50 dark:bg-[#323232] p-5 rounded-xl border-[0.5px] border-neutral-100 dark:border-[#414141]">
                  {selectedItem.type === 'competitor' && (<>
                    <div className="flex justify-between items-center"><span className="text-neutral-500 text-sm">Nota Google</span><span className="font-bold text-[#f9ce34]">⭐ {selectedItem.content.nota_google}</span></div>
                    <div className="flex justify-between items-center"><span className="text-neutral-500 text-sm">Faixa de Preço</span><span className="font-bold text-[#3b82f6]">{selectedItem.content.faixa_preco}</span></div>
                    <div className="space-y-1"><span className="text-neutral-500 text-sm">Endereço</span><p className="text-sm font-medium">{selectedItem.content.endereco}</p></div>
                  </>)}
                  {selectedItem.type === 'supplier' && (<>
                    <div className="flex justify-between items-center"><span className="text-neutral-500 text-sm">Produto</span><span className="font-bold">{selectedItem.content.produto_servico}</span></div>
                    <div className="flex justify-between items-center"><span className="text-neutral-500 text-sm">Preço Ref.</span><span className="font-bold text-[#3b82f6]">R$ {Number(selectedItem.content.preco_referencia) > 0 ? Number(selectedItem.content.preco_referencia).toFixed(2) : 'Sob consulta'}</span></div>
                    <div className="space-y-1"><span className="text-neutral-500 text-sm">Contato</span><p className="text-sm font-medium">{selectedItem.content.telefone}</p><p className="text-sm text-neutral-500">{selectedItem.content.email}</p></div>
                  </>)}
                  {selectedItem.type === 'practice' && (
                    <div className="space-y-4">
                      <p className="text-neutral-800 dark:text-neutral-300 leading-relaxed italic text-sm">"{selectedItem.content.conteudo}"</p>
                      <div className="flex items-center gap-2 text-xs text-neutral-500 uppercase font-bold"><Info size={14} /><span>Fonte: {selectedItem.content.fonte}</span></div>
                    </div>
                  )}
                  {selectedItem.type === 'level' && (
                    <div className="space-y-5">
                      <div className="flex justify-between items-end"><span className="text-neutral-500 text-sm font-medium">Progresso de Nível</span><span className="text-lg font-bold">{data.progresso_pct}%</span></div>
                      <div className="w-full h-1.5 bg-neutral-100 dark:bg-[#414141] rounded-full overflow-hidden"><div className="h-full bg-neutral-800 dark:bg-neutral-100" style={{ width: `${data.progresso_pct}%` }} /></div>
                      <p className="text-xs text-neutral-500 text-center font-medium">Faltam {data.pontos_proximo - data.negocio.pontos} pontos para o próximo nível!</p>
                    </div>
                  )}
                </div>
                <button onClick={() => setSelectedItem(null)} className="mt-8 w-full py-3 bg-[#3b82f6] text-white font-bold rounded-xl hover:bg-[#2563eb] transition-all duration-200 cursor-pointer">Fechar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sector Switcher — OS1: troca empresa | franchise: troca direto pra setor | outros: troca departamento */}
      <AnimatePresence>
        {sectorOpen && activeSector === 'os1' && role !== 'franchise' && (
          <SectorSwitcherModal
            active={activeSector}
            onSelect={setActiveSector}
            onClose={() => setSectorOpen(false)}
            hideDemoProfiles={role === 'franchisor' || role === 'partner'}
            roleSection={
              isPersonalizedRole(role) && !roleConfig.useDefaultSectors && roleConfig.swipeOptions.length > 0
                ? {
                    title: roleConfig.bio.displayName,
                    tabs: roleConfig.swipeOptions,
                    activeTab: activeRoleTab,
                    onSelectTab: setActiveRoleTab,
                    renderContent: renderRoleTabContent,
                  }
                : undefined
            }
          />
        )}
        {sectorOpen && (activeSector !== 'os1' || role === 'franchise') && (
          <DepartmentSwitcherModal
            active={activeDepartment}
            onSelect={setActiveDepartment}
            onClose={() => setSectorOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Dificuldade — tela cheia */}
      <AnimatePresence>
        {difficultyOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-[190] bg-[#dcdfe2] dark:bg-[#181818] flex flex-col overflow-y-auto"
          >
            <div className="sticky top-0 z-10 bg-[#dcdfe2]/80 dark:bg-[#181818]/80 backdrop-blur-xl border-b border-neutral-200 dark:border-[#414141] px-5 py-4 flex items-center justify-between max-w-[935px] w-full mx-auto">
              <div>
                <h1 className="text-base font-bold text-neutral-800 dark:text-neutral-100">Nível de Linguagem</h1>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Ajuste como as informações são apresentadas</p>
              </div>
              <button
                onClick={() => setDifficultyOpen(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-white/5 transition-all duration-200 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 px-4 sm:px-5 py-6 max-w-[935px] w-full mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DIFF_ORDER.map((d, i) => {
                  const meta = DIFF_META[d];
                  const isSelected = difficulty === d;
                  return (
                    <motion.button
                      key={d}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.06 }}
                      onClick={() => { setDifficulty(d); setDifficultyOpen(false); }}
                      className={`flex items-center gap-4 px-5 py-4 rounded-2xl border cursor-pointer text-left transition-all duration-200 shadow-[0_2px_12px_rgba(0,0,0,0.07)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)] ${
                        isSelected
                          ? 'bg-[#f0f2f4] dark:bg-[#323232] border-[#3b82f6]'
                          : 'bg-[#f0f2f4] dark:bg-[#323232] border-neutral-100 dark:border-[#414141] hover:bg-[#e4e7ea] dark:hover:bg-[#353535]'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${isSelected ? 'bg-[#3b82f6]/10' : 'bg-neutral-100 dark:bg-[#404040]'}`}>
                        {meta.emoji}
                      </div>
                      <p className={`flex-1 text-sm font-bold ${isSelected ? 'text-[#3b82f6]' : 'text-neutral-800 dark:text-neutral-100'}`}>{meta.label}</p>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#3b82f6] flex items-center justify-center flex-shrink-0">
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Esfera Ontológica — fullscreen iframe (só perfil OS1) */}
      {esferaOpen && (
        <div className="fixed inset-0 z-[300] bg-black">
          <iframe
            src={ESFERA_URL}
            className="w-full h-full border-0"
            title="Esfera Ontológica"
          />
        </div>
      )}

      {/* Overlay de Consentimento */}
      {!consentAccepted && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full max-w-sm rounded-2xl p-6 space-y-5"
            style={{ background: dark ? '#323232' : '#f0f2f4', border: `1px solid ${dark ? '#414141' : 'rgba(0,0,0,0.08)'}`, boxShadow: dark ? '0 2px 32px rgba(0,0,0,0.5)' : '0 2px 32px rgba(0,0,0,0.12)' }}
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: dark ? '#9ca3af' : '#6b7280' }}>Para continuar</p>
              <p className="text-sm" style={{ color: dark ? '#9ca3af' : '#6b7280' }}>Confirme os itens abaixo para acessar o feed.</p>
            </div>
            <div className="space-y-3">
              {([
                { key: 'termos', label: 'Termos de uso e Política de privacidade' },
                { key: 'navegador', label: 'Navegador sincronizado' },
                { key: 'lido', label: 'Li e concordo' },
              ] as { key: keyof typeof consentChecks; label: string }[]).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setConsentChecks(prev => ({ ...prev, [key]: !prev[key] }))}
                  className="w-full flex items-center gap-3 cursor-pointer"
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                    border: `1.5px solid ${consentChecks[key] ? '#3b82f6' : dark ? '#6b7280' : '#d1d5db'}`,
                    background: consentChecks[key] ? '#3b82f6' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s',
                  }}>
                    {consentChecks[key] && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    )}
                  </div>
                  <span className="text-sm text-left leading-snug" style={{ color: dark ? '#e5e7eb' : '#1f2937' }}>{label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                if (consentChecks.termos && consentChecks.navegador && consentChecks.lido) setConsentAccepted(true);
              }}
              disabled={!consentChecks.termos || !consentChecks.navegador || !consentChecks.lido}
              style={{
                width: '100%', padding: '12px 0', borderRadius: 12,
                fontSize: 14, fontWeight: 700,
                background: (consentChecks.termos && consentChecks.navegador && consentChecks.lido) ? '#3b82f6' : (dark ? '#414141' : '#e5e7eb'),
                color: (consentChecks.termos && consentChecks.navegador && consentChecks.lido) ? '#fff' : (dark ? '#6b7280' : '#9ca3af'),
                cursor: (consentChecks.termos && consentChecks.navegador && consentChecks.lido) ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s', border: 'none',
              }}
            >
              Continuar
            </button>
          </motion.div>
        </div>
      )}

    </div>
    </div>
  );
}
