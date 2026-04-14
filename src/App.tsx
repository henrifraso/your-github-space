/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Bookmark, ChevronRight, TrendingUp, Package,
  Lightbulb, Trophy, ChevronDown,
  Moon, Sun, Layers, Info, Bell, Camera,
  MapPin, Scale, Wrench, Handshake, Store, Zap,
  Settings2, X
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

import type { OmniData, Competitor, TimelineEvent } from './types';
import { MOCK_DATA, buildStories, BARBER_PHOTOS } from './mockData';
import { BottomModal, ModalHeader } from './components/BottomModal';
import { FeedSection, FeedCard } from './components/FeedComponents';
import { CircleProgress, PieChart } from './components/CircleProgress';
import { StoryViewer } from './components/StoryViewer';
import { ConcorrenteModal } from './components/ConcorrenteModal';
import { TimelineModal } from './components/TimelineComponents';
import { MarketMapButton, MarketMapContent } from './components/MarketMap';
import { PhotoEditor, loadPhotoSettings } from './components/PhotoEditor';
import type { PhotoSettings } from './components/PhotoEditor';

export default function App() {
  const [data, setData] = useState<OmniData>(MOCK_DATA);
  const [selectedItem, setSelectedItem] = useState<{ id: string; type: string; content: any } | null>(null);
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [difficulty, setDifficulty] = useState<Difficulty>(() => (localStorage.getItem('difficulty') as Difficulty) ?? 'normal');
  const [difficultyOpen, setDifficultyOpen] = useState(false);
  const txt = (key: TextKey) => TEXTS[key][difficulty];
  const [scrolled, setScrolled] = useState(false);
  const touchStartY = useRef(0);
  const scrollCooldownRef = useRef(false);
  const [storyIndex, setStoryIndex] = useState<number | null>(null);
  const [planoOpen, setPlanoOpen] = useState(false);
  const [evolucaoOpen, setEvolucaoOpen] = useState(false);
  const [empresaOpen, setEmpresaOpen] = useState(false);
  const [circlePopupIdx, setCirclePopupIdx] = useState<number | null>(null);
  const [salvosOpen, setSalvosOpen] = useState(false);
  const [estrategiaOpen, setEstrategiaOpen] = useState(false);
  const [praticaOpen, setPraticaOpen] = useState(false);
  const [selectedConcorrente, setSelectedConcorrente] = useState<Competitor | null>(null);
  const [selectedTimelineEvent, setSelectedTimelineEvent] = useState<TimelineEvent | null>(null);
  const [savedItems, setSavedItems] = useState<{ id: string; title: string; section: string; preview: string }[]>([]);
  const [mapOpen, setMapOpen] = useState(false);
  const [photoEditorOpen, setPhotoEditorOpen] = useState(false);
  const [photoHover, setPhotoHover] = useState(false);
  const [photoSettings, setPhotoSettings] = useState<PhotoSettings>(() => {
    const serverSettings = (window as any).__OMNI_DATA__?.photo_settings;
    if (serverSettings) return serverSettings;
    const saved = loadPhotoSettings();
    return saved ?? { src: BARBER_PHOTOS.profile, x: 0, y: 0, zoom: 1 };
  });
  const omniToken = useMemo(
    () => window.location.pathname.match(/\/client\/([^/]+)/)?.[1] ?? null,
    []
  );

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

  const anyModalOpen = storyIndex !== null || planoOpen || evolucaoOpen || empresaOpen ||
    circlePopupIdx !== null || salvosOpen || estrategiaOpen || praticaOpen || mapOpen ||
    selectedConcorrente !== null || selectedTimelineEvent !== null || selectedItem !== null || difficultyOpen;
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
    document.body.style.backgroundColor = dark ? '#0a0a0a' : '#fafafa';
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
        if (e.deltaY > 5) setScrolled(true);
      };
      const onTouchStart = (e: TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
      const onTouchMove = (e: TouchEvent) => {
        if (anyModalOpenRef.current || scrollCooldownRef.current) return;
        if (touchStartY.current - e.touches[0].clientY > 15) setScrolled(true);
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

  return (
    <div className={dark ? 'dark' : ''}>
    <div className="min-h-screen bg-[#f3f3f3] dark:bg-[#080808] text-neutral-800 dark:text-neutral-100 font-sans">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl border-b border-neutral-100 dark:border-[#262626] py-2.5 sm:py-3">
        <div className="max-w-[935px] mx-auto px-4 sm:px-5 flex items-center justify-between gap-3">
          <button onClick={() => setEmpresaOpen(true)} className="flex items-center gap-2 cursor-pointer transition-all duration-200 active:scale-[0.97]">
            <span className="flex-shrink-0 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#16a34a] shadow-[0_0_6px_2px_rgba(34,197,94,0.7)] animate-pulse" />
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-neutral-800 dark:text-neutral-100">{data.negocio.nome_fantasia}</h1>
            <ChevronDown size={14} className="text-neutral-400 sm:hidden" />
            <ChevronDown size={16} className="text-neutral-400 hidden sm:block" />
          </button>
          <div className="flex items-center gap-0.5 sm:gap-1">
            <button onClick={() => setDifficultyOpen(true)} className="cursor-pointer text-neutral-800 dark:text-neutral-100 p-2 sm:p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 transition-all duration-200 active:scale-90" title="Dificuldade">
              <Settings2 size={18} className="sm:hidden" />
              <Settings2 size={20} className="hidden sm:block" />
            </button>
            <button onClick={() => setDark(d => !d)} className="cursor-pointer text-neutral-800 dark:text-neutral-100 p-2 sm:p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 transition-all duration-200 active:scale-90">
              {dark ? <Sun size={18} className="sm:hidden" /> : <Moon size={18} className="sm:hidden" />}
              {dark ? <Sun size={20} className="hidden sm:block" /> : <Moon size={20} className="hidden sm:block" />}
            </button>
            <button className="cursor-pointer text-neutral-800 dark:text-neutral-100 p-2 sm:p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 transition-all duration-200 active:scale-90">
              <Bell size={18} className="sm:hidden" />
              <Bell size={20} className="hidden sm:block" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[935px] mx-auto pt-3 sm:pt-4 md:pt-8">
        {/* Perfil — colapsa ao rolar */}
        <div style={{ display: 'grid', gridTemplateRows: scrolled ? '0fr' : '1fr', opacity: scrolled ? 0 : 1, transition: 'grid-template-rows 0.4s cubic-bezier(0.25,0.1,0.25,1), opacity 0.3s ease', pointerEvents: scrolled ? 'none' : 'auto' }}>
        <div style={{ overflow: 'hidden' }}>

          {/* Foto + bio + botões */}
          <section className="mb-6 sm:mb-8 md:mb-10 px-4 sm:px-5">
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
                    onMouseEnter={() => setPhotoHover(true)}
                    onMouseLeave={() => setPhotoHover(false)}
                    onClick={() => setPhotoEditorOpen(true)}
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
                    {photoHover && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full transition-opacity duration-200">
                        <Camera size={20} className="text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-2 sm:gap-3 mt-0 md:mt-4">
                <div className="flex gap-3 sm:gap-4 md:gap-10 text-[11px] sm:text-xs md:text-base">
                  <span><strong>{gridItems.length}</strong> {txt('stat_opor')}</span>
                  <span><strong>{data.concorrentes.length}</strong> {txt('stat_conc')}</span>
                  <span><strong>{data.negocio.nivel}</strong> {txt('stat_nivel')}</span>
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
            <MarketMapButton open={mapOpen} onToggle={() => setMapOpen(o => !o)} />
            <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
              {[[txt('btn_plano'), () => setPlanoOpen(true)], [txt('btn_estrat'), () => setEstrategiaOpen(true)], [txt('btn_prat'), () => setPraticaOpen(true)]].map(([label, fn]) => (
                <button key={label as string} onClick={fn as () => void}
                  className="flex-[2] h-8 sm:h-9 md:h-11 flex items-center justify-center bg-white dark:bg-[#161616] border border-neutral-100 dark:border-[#262626] hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] rounded-xl text-[11px] sm:text-xs md:text-sm font-semibold transition-all duration-200 active:scale-[0.97] cursor-pointer">
                  {label as string}
                </button>
              ))}
            </div>
          </section>

          {/* Destaques */}
          <section className="flex gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar px-4 sm:px-5 pt-1 pb-2 md:justify-between">
            {circleData.map((c, i) => (
              <CircleProgress key={c.label} pct={c.pct} label={c.label} color={c.color} delay={i * 0.08} onClick={() => setCirclePopupIdx(i)} />
            ))}
          </section>

        </div>
        </div>
      </main>

      {/* Feed */}
      <motion.div
        className="max-w-[935px] mx-auto mt-4 sm:mt-6 pb-12 space-y-6 sm:space-y-8 px-4 sm:px-5"
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
      >

        {/* O que mudou */}
        <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } } }}>
        <FeedSection title={txt('sec_mudou')} icon={<TrendingUp size={18}/>}>
          {[
            { label: txt('lbl_conc'), color: '#ef4444', titulo: timeline.filter(e=>e.tipo==='concorrente')[0]?.titulo ?? `${[...data.concorrentes].sort((a,b)=>Number(b.nota_google)-Number(a.nota_google))[0]?.nome ?? 'Concorrente'} lidera com ★ ${Number([...data.concorrentes].sort((a,b)=>Number(b.nota_google)-Number(a.nota_google))[0]?.nota_google||0).toFixed(1)}`, detalhe: timeline.filter(e=>e.tipo==='concorrente')[0]?.detalhe ?? `${data.concorrentes.length} concorrentes mapeados. Monitore os movimentos da região.`, onClick: () => { const e = timeline.filter(e=>e.tipo==='concorrente')[0]; if(e) setSelectedTimelineEvent(e); } },
            { label: txt('lbl_merc'), color: '#3b82f6', titulo: timeline.filter(e=>e.tipo==='mercado')[0]?.titulo ?? 'Delivery cresce 31% no fast food em 2025', detalhe: timeline.filter(e=>e.tipo==='mercado')[0]?.detalhe ?? 'iFood e Rappi concentram 78% dos pedidos de fast food em SP. Quem não está no delivery perde fatia crescente.', onClick: () => { const e = timeline.filter(e=>e.tipo==='mercado')[0]; if(e) setSelectedTimelineEvent(e); } },
            { label: txt('lbl_econ'), color: '#3b82f6', titulo: `Ticket médio R$ 38–52 · Nota média ★ ${notaMediaNum} na região`, detalhe: 'Poder de compra estável na Paulista. Combos e promoções de app são o principal driver de decisão.', onClick: undefined },
            { label: txt('lbl_even'), color: '#3b82f6', titulo: 'Páscoa 13–20/abr · Dia das Mães 11/mai · Festa Junina Jun', detalhe: data.previsao_clima[0] ? `Clima SP: ${data.previsao_clima[0].icone} ${data.previsao_clima[0].temp_max}° — ${data.previsao_clima[0].dia_label}` : 'Prepare campanhas e lançamentos sazonais com antecedência.', onClick: undefined },
            { label: txt('lbl_rep'), color: '#3b82f6', titulo: `Nota média ★ ${notaMediaNum} · ${data.concorrentes.filter(c=>Number(c.nota_google)>=4.5).length} concorrentes acima de 4,5`, detalhe: 'Avaliações no Google e iFood são o principal critério de escolha. Responda reviews negativos em até 24h.', onClick: undefined },
          ].map(item => (
            <FeedCard key={item.label} onClick={item.onClick}>
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{color: item.color}}>{item.label}</p>
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 leading-snug">{item.titulo}</p>
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{item.detalhe}</p>
                </div>
                <ChevronRight size={16} className="text-neutral-300 dark:text-neutral-600 flex-shrink-0 mt-1" />
              </div>
            </FeedCard>
          ))}
        </FeedSection>
        </motion.div>

        {/* Geografia */}
        <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } } }}>
        <FeedSection title={txt('sec_geo')} icon={<MapPin size={18}/>}>
          <FeedCard>
            <p className="text-xs font-bold uppercase tracking-wider text-[#3b82f6] mb-2">{txt('geo_regiao')}</p>
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 leading-snug">Av. Paulista, {data.negocio.cidade} — {difficulty === 'muito_facil' ? 'lugar com muita gente passando' : difficulty === 'facil' ? 'área movimentada com forte concorrência' : difficulty === 'dificil' ? 'corredor de alto tráfego com densidade competitiva elevada' : difficulty === 'muito_dificil' ? 'high-density corridor com intense competitive pressure' : 'alto fluxo e forte concorrência no corredor'}</p>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{difficulty === 'muito_facil' ? 'Muita gente passa por aqui todo dia. Horários cheios: 11h–14h e 18h–21h. Público: trabalhadores, turistas e moradores.' : difficulty === 'muito_dificil' ? '+500k people/day. Peak hours: 11h–14h, 18h–21h. Demographics: corporate professionals, tourists, local residents.' : 'Corredor com +500 mil pessoas/dia. Pico de movimento: 11h–14h e 18h–21h. Público: executivos, turistas e moradores da região.'}</p>
          </FeedCard>
          {data.previsao_clima.length > 0 && (
            <FeedCard>
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
          )}
        </FeedSection>
        </motion.div>

        {/* Legislação */}
        <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } } }}>
        <FeedSection title={txt('sec_leg')} icon={<Scale size={18}/>}>
          <FeedCard>
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
          <FeedCard>
            <p className="text-xs font-bold uppercase tracking-wider text-[#3b82f6] mb-1">{txt('leg_atenc')}</p>
            <p className="text-sm text-neutral-500 leading-relaxed">{txt('leg_desc')}</p>
          </FeedCard>
        </FeedSection>
        </motion.div>

        {/* Produtos */}
        <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } } }}>
        <FeedSection title={txt('sec_prod')} icon={<Package size={18}/>}>
          <FeedCard>
            <p className="text-xs font-bold uppercase tracking-wider text-[#3b82f6] mb-2">{txt('prod_novo')}</p>
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 leading-snug">{data.fornecedores[0]?.produto_servico ?? 'Lançamentos em máquinas e produtos para cabelo'}</p>
            <p className="text-xs text-neutral-500 mt-1">{data.fornecedores[0] ? `${data.fornecedores[0].nome} · R$ ${Number(data.fornecedores[0].preco_referencia||0).toFixed(0)}` : 'Novas tecnologias de finalização com menor tempo de serviço.'}</p>
          </FeedCard>
          {data.fornecedores.filter(f => f.produto_servico).slice(0, 4).map((f, i) => (
            <FeedCard key={i}>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate">{f.produto_servico}</p>
                  <p className="text-xs text-neutral-500 truncate">{f.nome} · {f.cidade}</p>
                </div>
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 ml-3 flex-shrink-0">{Number(f.preco_referencia) > 0 ? `R$ ${Number(f.preco_referencia).toFixed(0)}` : '—'}</p>
              </div>
            </FeedCard>
          ))}
        </FeedSection>
        </motion.div>

        {/* Serviços */}
        <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } } }}>
        <FeedSection title={txt('sec_serv')} icon={<Wrench size={18}/>}>
          <FeedCard>
            <p className="text-xs font-bold uppercase tracking-wider text-[#3b82f6] mb-1">{txt('serv_acao')}</p>
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 leading-snug">{data.praticas[0]?.titulo ?? 'Automação do Agendamento via WhatsApp'}</p>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{data.praticas[0]?.conteudo ?? 'Confirmações automáticas reduzem no-show em até 35%.'}</p>
          </FeedCard>
          {data.praticas.slice(1, 4).map((p, i) => (
            <FeedCard key={i}>
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 leading-snug">{p.titulo}</p>
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{p.conteudo}</p>
                </div>
                <ChevronRight size={16} className="text-neutral-300 dark:text-neutral-600 flex-shrink-0 mt-1" />
              </div>
            </FeedCard>
          ))}
        </FeedSection>
        </motion.div>

        {/* Parceiros */}
        <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } } }}>
        <FeedSection title={txt('sec_parc')} icon={<Handshake size={18}/>} count={`${data.fornecedores.length}`}>
          <FeedCard>
            <p className="text-xs font-bold uppercase tracking-wider text-[#3b82f6] mb-4">{txt('parc_label')} · {data.fornecedores.length} mapeados</p>
            {data.fornecedores.map((f, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-neutral-100 dark:border-[#262626] last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate">{f.nome}</p>
                  <p className="text-xs text-neutral-500 truncate">{f.produto_servico} · {f.cidade}{f.telefone ? ` · ${f.telefone}` : ''}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{Number(f.preco_referencia) > 0 ? `R$ ${Number(f.preco_referencia).toFixed(0)}` : '—'}</p>
                  <button onClick={() => toggleSave(`forn-${i}`, f.nome, 'Fornecedores', f.produto_servico)} className="p-1 text-neutral-400 hover:text-neutral-800 dark:hover:text-white transition-all duration-200 cursor-pointer">
                    <Bookmark size={16} fill={isSaved(`forn-${i}`) ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
            ))}
          </FeedCard>
        </FeedSection>
        </motion.div>

      </motion.div>

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

      {/* Modal Plano */}
      <AnimatePresence>
        {planoOpen && (
          <BottomModal onClose={() => setPlanoOpen(false)}>
            <ModalHeader onClose={() => setPlanoOpen(false)}><Trophy size={18} className="text-[#3b82f6]" /><h2 className="text-base font-bold">Plano de Ação</h2></ModalHeader>
            <p className="text-xs text-neutral-500 uppercase font-bold tracking-widest mb-4">Semana atual · {data.semana_label}</p>
            <div className="space-y-3">
              {data.praticas.slice(0, 5).map((p, i) => (
                <div key={i} className="flex gap-3 py-3 border-b border-neutral-100 dark:border-[#262626] last:border-0">
                  <div className="w-7 h-7 rounded-full bg-[#3b82f6]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-[#3b82f6]">{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-snug">{p.titulo}</p>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed line-clamp-2">{p.conteudo}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-neutral-200 dark:border-[#262626]">
              <div className="flex items-center gap-2 text-[#3b82f6]">
                <TrendingUp size={16} />
                <span className="text-xs font-semibold">{data.progresso_pct}% do nível concluído · {data.negocio.pontos} pts</span>
              </div>
            </div>
          </BottomModal>
        )}
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
              <div className="w-full h-2 bg-neutral-100 dark:bg-[#262626] rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${data.progresso_pct}%` }} transition={{ duration: 1, ease: 'easeOut' }} className="h-full bg-[#3b82f6] rounded-full" />
              </div>
              <p className="text-xs text-neutral-500 mt-2">{data.progresso_pct}% para o próximo nível</p>
            </div>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Histórico de Atividades</p>
            <div className="space-y-1">
              {data.gamificacao_log.map((log, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-neutral-100 dark:border-[#262626] last:border-0">
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">{log.acao}</span>
                  <span className="text-sm font-bold text-[#3b82f6]">+{log.pontos} pts</span>
                </div>
              ))}
            </div>
          </BottomModal>
        )}
      </AnimatePresence>

      {/* Modal Prática */}
      <AnimatePresence>
        {praticaOpen && (
          <BottomModal onClose={() => setPraticaOpen(false)}>
            <ModalHeader onClose={() => setPraticaOpen(false)}><Lightbulb size={18} className="text-[#0891b2]" /><h2 className="text-base font-bold">Prática</h2></ModalHeader>
            <div className="space-y-1">
              {data.praticas.map((p, i) => (
                <div key={i} className="py-4 border-b border-neutral-100 dark:border-[#262626] last:border-0">
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 mb-1">{p.titulo}</p>
                  <p className="text-xs text-neutral-500 leading-relaxed">{p.conteudo}</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mt-2">Fonte: {p.fonte}</p>
                </div>
              ))}
            </div>
          </BottomModal>
        )}
      </AnimatePresence>

      {/* Modal Estratégia */}
      <AnimatePresence>
        {estrategiaOpen && (
          <BottomModal onClose={() => setEstrategiaOpen(false)}>
            <ModalHeader onClose={() => setEstrategiaOpen(false)}><Layers size={18} className="text-[#3b82f6]" /><h2 className="text-base font-bold">Estratégia</h2></ModalHeader>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Posição no mercado</p>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-xl font-bold">{data.ranking_local ?? '—'}° lugar</p>
                  <p className="text-xs text-neutral-500">de {data.concorrentes.length + 1} na região</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-[#3b82f6]">{notaMediaNum}</p>
                  <p className="text-xs text-neutral-500">nota média mercado</p>
                </div>
              </div>
              <p className="text-xs text-neutral-500">{data.mercado_nome ?? 'Beleza & Estética'} · {data.mercado_tamanho ?? '—'}</p>
            </div>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Oportunidades identificadas</p>
            <div className="space-y-2 mb-6">
              {Array.from(new Set(data.concorrentes.flatMap(c => c.nao_oferece ?? []))).slice(0, 4).map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-3 bg-[#f0fdf4] dark:bg-[#0d2b1a] rounded-xl border border-[#bbf7d0] dark:border-[#166534]">
                  <span className="text-[#16a34a] text-sm">↗</span>
                  <span className="text-sm text-neutral-800 dark:text-neutral-300">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Movimentos recentes dos concorrentes</p>
            <div className="space-y-2">
              {data.concorrentes.flatMap(c => (c.mudancas_recentes ?? []).map(m => ({ nome: c.nome, mudanca: m }))).slice(0, 4).map((item, i) => (
                <div key={i} className="flex items-start gap-2 px-4 py-3 bg-[#fff7ed] dark:bg-[#2d1600] rounded-xl border border-[#fed7aa] dark:border-[#7c2d12]">
                  <span className="text-[#ea580c] text-sm mt-0.5">!</span>
                  <div>
                    <p className="text-xs font-bold text-[#ea580c]">{item.nome}</p>
                    <p className="text-sm text-neutral-800 dark:text-neutral-300">{item.mudanca}</p>
                  </div>
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
                <div key={i} className="flex justify-between items-center py-3 border-b border-neutral-100 dark:border-[#262626] last:border-0">
                  <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">{item.label}</span>
                  <span className="text-sm font-medium text-neutral-800 dark:text-neutral-300">{item.value}</span>
                </div>
              ))}
            </div>
          </BottomModal>
        )}
      </AnimatePresence>

      {/* Modal Gráfico Pizza */}
      <AnimatePresence>
        {circlePopupIdx !== null && (() => {
          const circle = circleData[circlePopupIdx];
          return (
            <BottomModal onClose={() => setCirclePopupIdx(null)} zIndex={160}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: circle.color }} />
                  <h2 className="text-neutral-800 dark:text-white font-bold text-base">{circle.label}</h2>
                  <span className="text-sm font-bold ml-1" style={{ color: circle.color }}>{circle.pct}%</span>
                </div>
                <button onClick={() => setCirclePopupIdx(null)} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-white p-2 rounded-xl transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 cursor-pointer">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-5">
                <div className="flex-shrink-0"><PieChart segments={circle.slices} /></div>
                <div className="flex flex-col gap-3 min-w-0">
                  {circle.slices.map((s, i) => {
                    const total = circle.slices.reduce((acc, x) => acc + x.value, 0);
                    return (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0 mt-0.5" style={{ backgroundColor: s.color }} />
                        <div>
                          <p className="text-neutral-800 dark:text-neutral-300 text-xs leading-tight">{s.label}</p>
                          <p className="text-neutral-500 text-xs">{Math.round((s.value / total) * 100)}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-neutral-200 dark:border-[#262626]">
                {circle.descricao.split('\n').map((linha, i) => (
                  <p key={i} className={`text-xs leading-relaxed ${i === 0 ? 'text-neutral-800 dark:text-neutral-300 font-medium mb-1' : 'text-neutral-500'}`}>{linha}</p>
                ))}
              </div>
            </BottomModal>
          );
        })()}
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
                  <div key={item.id} className="flex items-start justify-between gap-3 py-3 border-b border-neutral-100 dark:border-[#262626] last:border-0">
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

      {/* Modal Item Grid */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedItem(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div layoutId={selectedItem.id} className="relative w-full max-w-[400px] bg-white dark:bg-[#161616] rounded-2xl overflow-hidden shadow-2xl border border-neutral-100 dark:border-[#262626]">
              <div className="p-6 flex flex-col items-center text-center">
                <div className="text-5xl mb-4">{gridItems.find(i => i.id === selectedItem.id)?.emoji}</div>
                <h3 className="text-xl font-bold mb-1">{gridItems.find(i => i.id === selectedItem.id)?.title}</h3>
                <p className="text-neutral-500 text-xs uppercase tracking-widest font-bold mb-8">{gridItems.find(i => i.id === selectedItem.id)?.subtitle}</p>
                <div className="w-full space-y-5 text-left bg-neutral-50 dark:bg-[#0a0a0a] p-5 rounded-xl border border-neutral-100 dark:border-[#262626]">
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
                      <div className="w-full h-1.5 bg-neutral-100 dark:bg-[#262626] rounded-full overflow-hidden"><div className="h-full bg-neutral-800 dark:bg-neutral-100" style={{ width: `${data.progresso_pct}%` }} /></div>
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

      {/* Gaveta de Dificuldade */}
      <AnimatePresence>
        {difficultyOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDifficultyOpen(false)}
              className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 34 }}
              className="fixed bottom-0 left-0 right-0 z-[130] bg-white dark:bg-[#111111] rounded-t-2xl px-5 pt-5 pb-8 max-w-[935px] mx-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Settings2 size={18} className="text-[#3b82f6]" />
                  <h2 className="text-base font-bold text-neutral-800 dark:text-neutral-100">Dificuldade</h2>
                </div>
                <button onClick={() => setDifficultyOpen(false)} className="p-2 rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition-all duration-200 cursor-pointer">
                  <X size={18} />
                </button>
              </div>
              <p className="text-xs text-neutral-500 mb-4">Escolha como os dados são apresentados — de linguagem simples a técnica.</p>
              <div className="space-y-2">
                {DIFF_ORDER.map((d) => {
                  const meta = DIFF_META[d];
                  const isSelected = difficulty === d;
                  return (
                    <button
                      key={d}
                      onClick={() => { setDifficulty(d); setDifficultyOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-200 cursor-pointer text-left ${
                        isSelected
                          ? 'bg-[#3b82f6]/10 border-[#3b82f6] dark:border-[#3b82f6]'
                          : 'bg-white dark:bg-[#161616] border-neutral-100 dark:border-[#262626] hover:bg-neutral-50 dark:hover:bg-[#1a1a1a]'
                      }`}
                    >
                      <span className="text-xl">{meta.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${isSelected ? 'text-[#3b82f6]' : 'text-neutral-800 dark:text-neutral-100'}`}>{meta.label}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">{meta.desc}</p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#3b82f6] flex items-center justify-center flex-shrink-0">
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
    </div>
  );
}
