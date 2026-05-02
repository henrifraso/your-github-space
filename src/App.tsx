/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Bookmark, ChevronRight, TrendingUp,
  Lightbulb, Trophy, ChevronDown,
  Moon, Sun, Layers, Info, Bell, Camera, Plus,
  MapPin, Scale, Store, Zap,
  Settings2, X, Globe, LayoutGrid, Power
} from 'lucide-react';

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
import { getAuthState, setAuthState, clearAuthState } from './hooks/useAuth';
import type { OmniData, Competitor, TimelineEvent } from './types';
import { MOCK_DATA, buildStories, BARBER_PHOTOS } from './mockData';
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
import { SectorSwitcherModal, SECTORS } from './components/SectorSwitcher';
import type { SectorId } from './components/SectorSwitcher';
import { SectorFeed } from './components/SectorFeed';
import { WorkspacePanel } from './components/WorkspacePanel';
import type { IntelligenceCard } from './components/WorkspacePanel';

export default function App() {
  const [auth, setAuth] = useState(() => getAuthState());

  if (!auth.isAuthenticated) {
    return (
      <LoginScreen
        onAuthenticated={(token, negocioId) => {
          setAuthState(token, negocioId);
          setAuth({ token, negocioId, isAuthenticated: true });
        }}
      />
    );
  }

  return <AuthenticatedApp />;
}

function AuthenticatedApp() {
  const [data, setData] = useState<OmniData>(MOCK_DATA);
  const [selectedItem, setSelectedItem] = useState<{ id: string; type: string; content: any } | null>(null);
  const [dark] = useState(true);
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
  const [bioOpen, setBioOpen] = useState(false);
  const [destaqueOpen, setDestaqueOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  type FullscreenContent =
    | { type: 'card'; label: string; color: string; titulo: string; detalhe: string }
    | { type: 'plano' }
    | { type: 'estrategia' }
    | { type: 'pratica' }
    | { type: 'destaque'; idx: number }
    | { type: 'workspace'; card: IntelligenceCard };
  const [fullscreenCard, setFullscreenCard] = useState<FullscreenContent | null>(null);
  const [browserOpen, setBrowserOpen] = useState(false);
  const [sectorOpen, setSectorOpen] = useState(false);
  const [activeSector, setActiveSector] = useState<SectorId>('geral');
  const [photoEditorOpen, setPhotoEditorOpen] = useState(false);
  const [photoHover, setPhotoHover] = useState(false);
  const [photoSettings, setPhotoSettings] = useState<PhotoSettings>(
    () => (window as any).__OMNI_DATA__?.photo_settings
      ?? { src: '/profile-photo.jpg', x: 0, y: 0, zoom: 1, locked: true }
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

  const handleUtilizar = (containerType: string, selected: boolean) => {
    setSelectedContainers(prev => {
      const next = new Set(prev);
      if (selected) next.add(containerType); else next.delete(containerType);
      return next;
    });
    if (selected) {
      const negocioId = (data as any).negocio?.id ?? omniToken;
      if (negocioId) fetch('/api/interacoes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ negocio_id: negocioId, container_tipo: containerType, tipo: 'utilizar' }) }).catch(() => {});
      setFullscreenCard({ type: 'plano' });
    }
  };

  const handlePhotoSave = async (s: PhotoSettings) => {
    setPhotoSettings(s);
    if (omniToken) {
      try {
        await fetch(`/api/client/${omniToken}/photo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(s),
        });
      } catch (e) {
        console.error('Erro ao salvar foto no servidor:', e);
      }
    }
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
    document.body.style.backgroundColor = dark ? '#000000' : '#dcdfe2';
  }, [dark]);

  useEffect(() => {
    localStorage.setItem('difficulty', difficulty);
  }, [difficulty]);

  useEffect(() => {
    const omniData = (window as any).__OMNI_DATA__;
    if (omniData) setData(omniData);
  }, []);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!scrolled) {
      document.body.style.overflow = 'hidden';
      const onWheel = (e: WheelEvent) => {
        if (anyModalOpenRef.current || scrollCooldownRef.current) return;
        if (e.deltaY > 5) { setScrolled(true); setBioOpen(false); setDestaqueOpen(false); }
      };
      const onTouchStart = (e: TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
      const onTouchMove = (e: TouchEvent) => {
        if (anyModalOpenRef.current || scrollCooldownRef.current) return;
        if (touchStartY.current - e.touches[0].clientY > 15) { setScrolled(true); setBioOpen(false); setDestaqueOpen(false); }
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
  }, [scrolled]);

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
      { label: 'Geografia',    pct: Math.max(20, 100 - (data.previsao_clima[0]?.chuva_mm ?? 0) * 5), color: '#3b82f6' },
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
    clearAuthState();
    window.location.reload();
  }

  return (
    <div className={dark ? 'dark' : ''}>

      {/* Botão de deslogar — canto superior direito */}
      <button
        onClick={handleLogout}
        title="Sair"
        className="fixed top-3 right-4 z-[999] p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/8 transition-all duration-200 cursor-pointer active:scale-90"
      >
        <Power size={18} />
      </button>

      {/* Navbar — fora do container com padding para o border-b ser full width */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#2d2d2d]/80 backdrop-blur-xl border-b border-neutral-100 dark:border-[#414141] py-2.5 sm:py-3 relative shadow-[0_2px_12px_rgba(0,0,0,0.07)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
        <div className="w-full max-w-[935px] lg:mx-0 mx-auto px-4 sm:px-5 flex items-center justify-between gap-3">
          <button onClick={() => setEmpresaOpen(true)} className="flex items-center gap-2 cursor-pointer transition-all duration-200 active:scale-[0.97]">
            <span className="flex-shrink-0 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#16a34a] shadow-[0_0_6px_2px_rgba(34,197,94,0.7)] animate-pulse" />
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-neutral-800 dark:text-neutral-100">{data.negocio.nome_fantasia}</h1>
            <ChevronDown size={14} className="text-neutral-400 sm:hidden" />
            <ChevronDown size={16} className="text-neutral-400 hidden sm:block" />
          </button>
          {/* Botões — mobile/tablet apenas; desktop fica no topo do chat */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setSectorOpen(true)}
              className="cursor-pointer p-2 sm:p-2.5 lg:p-3.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 transition-all duration-200 active:scale-90 relative"
              title="Trocar feed por área"
            >
              <Plus size={22} className={`sm:hidden ${activeSector !== 'geral' ? 'text-[#3b82f6]' : 'text-neutral-800 dark:text-neutral-100'}`} />
              <Plus size={22} className={`hidden sm:block lg:hidden ${activeSector !== 'geral' ? 'text-[#3b82f6]' : 'text-neutral-800 dark:text-neutral-100'}`} />
              <Plus size={30} className={`hidden lg:block ${activeSector !== 'geral' ? 'text-[#3b82f6]' : 'text-neutral-800 dark:text-neutral-100'}`} />
              {activeSector !== 'geral' && (
                <span className="absolute top-1.5 right-1.5 lg:top-2.5 lg:right-2.5 w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
              )}
            </button>
            <button onClick={() => setBrowserOpen(true)} className="cursor-pointer text-neutral-800 dark:text-neutral-100 p-2 sm:p-2.5 lg:p-3.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 transition-all duration-200 active:scale-90" title="Sincronizar">
              <Globe size={18} className="sm:hidden" />
              <Globe size={20} className="hidden sm:block lg:hidden" />
              <Globe size={24} className="hidden lg:block" />
            </button>
            <button onClick={() => setDifficultyOpen(true)} className="cursor-pointer text-neutral-800 dark:text-neutral-100 p-2 sm:p-2.5 lg:p-3.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 transition-all duration-200 active:scale-90" title="Dificuldade">
              <Settings2 size={18} className="sm:hidden" />
              <Settings2 size={20} className="hidden sm:block lg:hidden" />
              <Settings2 size={24} className="hidden lg:block" />
            </button>
            <button className="cursor-pointer text-neutral-800 dark:text-neutral-100 p-2 sm:p-2.5 lg:p-3.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 transition-all duration-200 active:scale-90">
              <Bell size={18} className="sm:hidden" />
              <Bell size={20} className="hidden sm:block lg:hidden" />
              <Bell size={24} className="hidden lg:block" />
            </button>
          </div>
        </div>
      </nav>

    <div
      style={{ paddingRight: (scrolled && isDesktop) ? '50vw' : undefined, transition: 'padding-right 500ms cubic-bezier(0.25,0.1,0.25,1)' }}
      className="min-h-screen bg-[#dcdfe2] dark:bg-[#181818] text-neutral-800 dark:text-neutral-100 font-sans lg:pr-[380px] xl:pr-[396px]"
    >

      <main className="max-w-[935px] mx-auto pt-3 sm:pt-4 md:pt-8">
        {/* Perfil — colapsa ao rolar */}
        <motion.div
          initial={false}
          animate={{
            height: scrolled ? 0 : 'auto',
            opacity: scrolled ? 0 : 1,
          }}
          transition={{
            height: { duration: 0.38, ease: [0.4, 0, 0.2, 1] },
            opacity: { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
          }}
          style={{ overflow: 'hidden', pointerEvents: scrolled ? 'none' : 'auto' }}
        >

          {/* Foto + bio + botões */}
          <section className="mb-0 px-4 sm:px-5">
            <div className="flex flex-row gap-3 sm:gap-4 md:gap-24 items-center mb-4 sm:mb-5">
              <div className="flex-shrink-0 relative w-20 h-20 md:w-[150px] md:h-[150px]">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="profileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%"   stopColor="#2563eb"/>
                      <stop offset="33%"  stopColor="#3b82f6"/>
                      <stop offset="66%"  stopColor="#60a5fa"/>
                      <stop offset="100%" stopColor="#2563eb"/>
                    </linearGradient>
                  </defs>
                  <motion.circle cx="50" cy="50" r="47" fill="none" stroke="url(#profileGrad)" strokeWidth="4"
                    strokeLinecap="round" strokeDasharray={2 * Math.PI * 47}
                    initial={{ strokeDashoffset: 2 * Math.PI * 47 }} animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 2.8, ease: 'easeOut' }} />
                </svg>
                <div className="w-full h-full rounded-full overflow-hidden p-[3px] md:p-[5px]">
                  <div
                    className="w-full h-full rounded-full overflow-hidden relative cursor-pointer"
                    onClick={() => setDestaqueOpen(d => !d)}
                  >
                    <img
                      src={photoSettings.src || BARBER_PHOTOS.profile}
                      alt="perfil"
                      style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        transform: `scale(${photoSettings.zoom}) translate(${photoSettings.x / photoSettings.zoom}px, ${photoSettings.y / photoSettings.zoom}px)`,
                        transformOrigin: 'center',
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-2 sm:gap-3 mt-0 md:mt-4">
                <div className="flex gap-3 sm:gap-4 md:gap-10 items-center text-[11px] sm:text-xs md:text-base">
                  <span><strong>{gridItems.length}</strong> {txt('stat_opor')}</span>
                  <span><strong>{data.concorrentes.length}</strong> Oponentes</span>
                  <span><strong>{data.negocio.nivel}</strong> {txt('stat_nivel')}</span>
                  {!bioOpen && (
                    <button
                      onClick={() => setBioOpen(true)}
                      className="hidden lg:inline-flex ml-auto items-center gap-2 px-3 py-2 bg-[#f0f2f4] dark:bg-[#323232] border border-neutral-200 dark:border-[#3d3d3d] shadow-[0_3px_10px_rgba(0,0,0,0.12)] dark:shadow-[0_3px_10px_rgba(0,0,0,0.45)] hover:bg-[#e4e7ea] dark:hover:bg-[#353535] rounded-xl text-[11px] sm:text-xs md:text-base font-semibold text-neutral-800 dark:text-neutral-200 transition-all duration-200 cursor-pointer"
                    >
                      <ChevronDown size={13} strokeWidth={1.8} className="text-neutral-300 dark:text-neutral-600" />
                      <span>Saiba mais</span>
                      <ChevronDown size={13} strokeWidth={1.8} className="text-neutral-300 dark:text-neutral-600" />
                    </button>
                  )}
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
              </div>
            </div>
            <MarketMapButton bioOpen={bioOpen} onHome={() => setBioOpen(true)} onMap={() => setMapOpen(true)} />
            {bioOpen && (
              <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
                {[['Missão', () => setFullscreenCard({ type: 'plano' })], ['Visão', () => setFullscreenCard({ type: 'estrategia' })], ['Valores', () => setFullscreenCard({ type: 'pratica' })]].map(([label, fn]) => (
                  <button key={label as string} onClick={fn as () => void}
                    className="flex-[2] h-8 sm:h-9 md:h-11 flex items-center justify-center bg-[#f0f2f4] dark:bg-[#323232] border border-neutral-100 dark:border-[#414141] hover:bg-[#e4e7ea] dark:hover:bg-[#353535] rounded-xl text-[11px] sm:text-xs md:text-sm font-semibold transition-all duration-200 active:scale-[0.97] cursor-pointer">
                    {label as string}
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Destaques */}
          <AnimatePresence>
            {destaqueOpen && (
              <motion.section
                key="destaques"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar px-4 sm:px-5 pt-1 pb-2 md:justify-between overflow-hidden"
              >
                {circleData.map((c, i) => (
                  <CircleProgress key={c.label} pct={c.pct} label={c.label} color={c.color} delay={i * 0.08} onClick={() => setFullscreenCard({ type: 'destaque', idx: i })} />
                ))}
              </motion.section>
            )}
          </AnimatePresence>

        </motion.div>
      </main>

      {/* Feed de setor específico */}
      {activeSector !== 'geral' && <SectorFeed sector={activeSector} />}

      {/* Feed geral */}
      {activeSector === 'geral' && <motion.div
        className="max-w-[935px] mx-auto mt-3 sm:mt-4 pb-12 space-y-3 sm:space-y-4 px-4 sm:px-5"
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
      >

        {/* Cards 1–5 */}
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

        {/* Carregar mais */}
        <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } } }}>
          <button className="w-full py-4 flex items-center justify-between px-4 md:px-5 bg-[#f0f2f4] dark:bg-[#323232] border border-neutral-100 dark:border-[#414141] hover:bg-[#e4e7ea] dark:hover:bg-[#353535] rounded-2xl text-sm font-semibold text-neutral-500 dark:text-neutral-400 transition-all duration-200 cursor-pointer active:scale-[0.99]">
            <ChevronDown size={14} strokeWidth={1.8} className="text-neutral-300 dark:text-neutral-600" />
            <span>Mais feed</span>
            <ChevronDown size={14} strokeWidth={1.8} className="text-neutral-300 dark:text-neutral-600" />
          </button>
        </motion.div>

      </motion.div>}

      {/* Stories */}
      {storyIndex !== null && <StoryViewer groups={stories} startIndex={storyIndex} onClose={() => setStoryIndex(null)} />}

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
      <BrowserView open={browserOpen} onClose={() => setBrowserOpen(false)} />

      {/* Chat */}
      <ChatDesktop
        wide={scrolled}
        dark={dark}
        onToggleDark={() => setDark(d => !d)}
        onSector={() => setSectorOpen(true)}
        onBrowser={() => setBrowserOpen(true)}
        onDifficulty={() => setDifficultyOpen(true)}
        activeSector={activeSector}
      />
      <ChatFAB onClick={() => setChatOpen(true)} />
      <ChatMobile open={chatOpen} onClose={() => setChatOpen(false)} />

      {/* Fullscreen */}
      <AnimatePresence>
        {fullscreenCard?.type === 'workspace' && (
          <WorkspacePanel card={fullscreenCard.card} onClose={() => setFullscreenCard(null)} />
        )}
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
            <motion.div layoutId={selectedItem.id} className="relative w-full max-w-[400px] bg-[#f0f2f4] dark:bg-[#323232] rounded-2xl overflow-hidden shadow-2xl border border-neutral-100 dark:border-[#414141]">
              <div className="p-6 flex flex-col items-center text-center">
                <div className="text-5xl mb-4">{gridItems.find(i => i.id === selectedItem.id)?.emoji}</div>
                <h3 className="text-xl font-bold mb-1">{gridItems.find(i => i.id === selectedItem.id)?.title}</h3>
                <p className="text-neutral-500 text-xs uppercase tracking-widest font-bold mb-8">{gridItems.find(i => i.id === selectedItem.id)?.subtitle}</p>
                <div className="w-full space-y-5 text-left bg-neutral-50 dark:bg-[#323232] p-5 rounded-xl border border-neutral-100 dark:border-[#414141]">
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

      {/* Sector Switcher */}
      <AnimatePresence>
        {sectorOpen && (
          <SectorSwitcherModal
            active={activeSector}
            onSelect={setActiveSector}
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

    </div>
    </div>
  );
}
