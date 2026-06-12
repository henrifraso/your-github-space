// Tipos e constantes da camada de geração de blocos da Área de Trabalho.
//
// Conteúdo movido de src/components/ChatPanel.tsx (Fase 10).
// JSX dos componentes consumidores fica no ChatPanel; aqui só vivem
// dados puros (tipos, mapeamentos por modo, catálogos de sub-ações,
// opções de compartilhamento, etc.).
//
// IMPORTANTE: nada de comportamento foi alterado. Labels, keys, ordem
// dos campos, ícones e textos visíveis são exatamente os mesmos.

import React from 'react';
import {
  AlignLeft, Info, Layers, FileText, GitCompare, AlertTriangle, TrendingUp,
  Gauge, Compass, Languages, ClipboardList, Target, CheckCircle, Users,
  MessageSquare, FlaskConical, Eye, Star as StarIcon, Brain, Lightbulb,
  BookOpen, FileQuestion, Sparkles, Award, Bookmark, Send as SendIcon, Bell,
} from 'lucide-react';
import type { IntelligenceCard, WorkspaceIntent } from '../../../core/types/card';

// ── Modos ─────────────────────────────────────────────────────────────
export type MainKey = 'pesquisar' | 'executar' | 'aprender';

export const INTENT_TO_MAIN: Record<WorkspaceIntent, MainKey | null> = {
  utilizar:     'executar',
  perguntas:    'pesquisar',
  exemplos:     'aprender',
  compartilhar: null,
};

export const MODE_LABEL: Record<MainKey, string> = {
  pesquisar: 'Entender',
  executar:  'Executar',
  aprender:  'Aprender',
};

export const MODE_TITLES: Record<MainKey, string> = {
  pesquisar: 'Entendendo este sinal',
  executar:  'Caminho de execução',
  aprender:  'Aprendizado aplicado',
};

export const MODE_FIELDS: Record<MainKey, { label: string; key: string }[]> = {
  pesquisar: [
    { label: 'Leitura inicial do sinal',         key: 'leitura_inicial' },
    { label: 'O que aconteceu',                  key: 'resumo_sinal' },
    { label: 'Por que isso importa',             key: 'por_que_importa' },
    { label: 'O que pode estar por trás',        key: 'pode_estar_por_tras' },
    { label: 'Riscos envolvidos',                key: 'risco_ignorar' },
    { label: 'Oportunidades possíveis',          key: 'oportunidade_agir' },
    { label: 'Sinais a observar',                key: 'observar_agora' },
    { label: 'Impacto no negócio',               key: 'impacto_negocio' },
    { label: 'Hipótese principal',               key: 'hipotese' },
    { label: 'Próximo passo recomendado',        key: 'proximo_passo' },
  ],
  executar: [
    { label: 'Objetivo da ação',                 key: 'objetivo' },
    { label: 'Diagnóstico prático',              key: 'diagnostico' },
    { label: 'Primeiro passo recomendado',       key: 'primeiro_passo' },
    { label: 'Plano de ação inicial',            key: 'plano_inicial' },
    { label: 'Responsável sugerido',             key: 'quem_executa' },
    { label: 'Prazo sugerido',                   key: 'prazo' },
    { label: 'Riscos antes de executar',         key: 'risco_antes' },
    { label: 'Métricas de sucesso',              key: 'criterio_sucesso' },
    { label: 'Plano B',                          key: 'plano_b' },
    { label: 'Próximo passo imediato',           key: 'proximo_passo' },
  ],
  aprender: [
    { label: 'Conceito principal',               key: 'conceito' },
    { label: 'Explicação simples',               key: 'explicacao_simples' },
    { label: 'Por que importa p/ o negócio',     key: 'por_que_negocio' },
    { label: 'Exemplo aplicado',                 key: 'exemplo' },
    { label: 'Erro comum',                       key: 'erro_comum' },
    { label: 'Como medir',                       key: 'como_medir' },
    { label: 'Como empresa madura trata',        key: 'empresa_madura' },
    { label: 'Como aplicar no caso atual',       key: 'aplicar_caso' },
    { label: 'Próximo nível',                    key: 'proximo_nivel' },
    { label: 'Regra para lembrar depois',        key: 'regra_lembrar' },
  ],
};

// Ordem dos atalhos dentro de cada bloco de modo — top 5 + outros 5 em "Mais ações"
// C1-A: a key 'missao' do top-5 de executar foi renomeada pra 'rascunho'
// pra refletir o que a sub-ação faz de fato (template local, sem POST).
export const MODE_TOP5: Record<MainKey, string[]> = {
  pesquisar: ['resumir', 'risco', 'evidencias', 'comparar', 'negocio'],
  executar:  ['checklist', 'plano', 'mensagem', 'simular', 'rascunho'],
  aprender:  ['exemplo', 'conceito', 'erro', 'medir', 'memoria'],
};

// ── Dificuldade ──────────────────────────────────────────────────────
export type Dificuldade = 'muito_facil' | 'facil' | 'dificil' | 'muito_dificil';
export const DIFICULDADE_LABELS: Record<Dificuldade, string> = {
  muito_facil:   'Muito fácil',
  facil:         'Fácil',
  dificil:       'Difícil',
  muito_dificil: 'Muito difícil',
};

// ── Sub-actions: 10 por modo, todas com label e função ────────────────
export type SubAction = {
  key: string;
  label: string;
  Icon: React.ElementType;
  endpoint: 'pesquisar' | 'executar' | 'aprender' | 'simular' | 'regenerar' | 'estender' | null;
  extra?: Record<string, string>;
};

export const SUB_BTNS: Record<MainKey, SubAction[]> = {
  pesquisar: [
    { key: 'resumir',         label: 'Resumir',              Icon: AlignLeft,    endpoint: 'pesquisar' },
    { key: 'explicar',        label: 'Explicar',             Icon: Info,         endpoint: 'pesquisar' },
    { key: 'aprofundar',      label: 'Aprofundar',           Icon: Layers,       endpoint: 'estender'  },
    { key: 'evidencias',      label: 'Ver evidências',       Icon: FileText,     endpoint: 'pesquisar' },
    { key: 'comparar',        label: 'Comparar',             Icon: GitCompare,   endpoint: 'pesquisar' },
    { key: 'risco',           label: 'Ver risco',            Icon: AlertTriangle, endpoint: 'pesquisar' },
    { key: 'oportunidade',    label: 'Ver oportunidade',     Icon: TrendingUp,   endpoint: 'pesquisar' },
    { key: 'confianca',       label: 'Ver confiança',        Icon: Gauge,        endpoint: 'pesquisar' },
    { key: 'cruzar',          label: 'Cruzar sinais',        Icon: Compass,      endpoint: 'pesquisar' },
    { key: 'negocio',         label: 'Traduzir p/ negócio',  Icon: Languages,    endpoint: 'pesquisar' },
  ],
  executar: [
    { key: 'checklist',       label: 'Criar checklist',      Icon: ClipboardList, endpoint: 'executar', extra: { tipo: 'checklist' } },
    { key: 'plano',           label: 'Criar plano',          Icon: FileText,     endpoint: 'executar', extra: { tipo: 'plano' } },
    { key: 'campanha',        label: 'Criar campanha',       Icon: Target,       endpoint: 'executar', extra: { tipo: 'campanha' } },
    { key: 'tarefa',          label: 'Criar tarefa',         Icon: CheckCircle,  endpoint: 'executar', extra: { tipo: 'tarefa' } },
    { key: 'delegar',         label: 'Delegar',              Icon: Users,        endpoint: 'executar', extra: { tipo: 'tarefa' } },
    { key: 'mensagem',        label: 'Criar mensagem',       Icon: MessageSquare, endpoint: 'executar', extra: { tipo: 'mensagem' } },
    { key: 'roteiro',         label: 'Criar roteiro',        Icon: AlignLeft,    endpoint: 'executar', extra: { tipo: 'plano' } },
    { key: 'simular',         label: 'Simular resultado',    Icon: FlaskConical, endpoint: 'simular',  extra: { cenario: 'realista' } },
    { key: 'validar',         label: 'Validar antes',        Icon: Eye,          endpoint: 'simular',  extra: { cenario: 'realista' } },
    // C1-A: key renomeada de 'missao' pra 'rascunho' pra alinhar com o que
    // a sub-ação faz (template local, sem POST). Backend GM1-A continua
    // disponível em /api/governance/missions; quando a missão real for
    // ligada à workspace, vira outro botão explícito (não esta sub-ação).
    { key: 'rascunho',        label: 'Rascunho de execução', Icon: StarIcon,     endpoint: null },
  ],
  aprender: [
    { key: 'conceito',        label: 'Ensinar conceito',     Icon: Brain,        endpoint: 'aprender' },
    { key: 'exemplo',         label: 'Mostrar exemplo',      Icon: Lightbulb,    endpoint: 'aprender' },
    { key: 'referencia',      label: 'Mostrar referência',   Icon: BookOpen,     endpoint: 'aprender' },
    { key: 'erro',            label: 'Explicar erro comum',  Icon: AlertTriangle, endpoint: 'aprender' },
    { key: 'medir',           label: 'Como medir',           Icon: Gauge,        endpoint: 'aprender' },
    { key: 'aula',            label: 'Criar aula rápida',    Icon: BookOpen,     endpoint: 'aprender' },
    { key: 'perguntas',       label: 'Criar perguntas',      Icon: FileQuestion, endpoint: 'aprender' },
    { key: 'analogia',        label: 'Criar analogia',       Icon: Sparkles,     endpoint: 'aprender' },
    { key: 'nivel',           label: 'Próximo nível',        Icon: Award,        endpoint: 'aprender' },
    { key: 'memoria',         label: 'Criar memória',        Icon: Bookmark,     endpoint: null },
  ],
};

// ── Atalhos genéricos do card / shortcuts compartilhados ────────────
// Atalho local executa uma sub-ação existente. Atalho remoto abre URL.
export type LocalShortcut =
  | { id: string; label: string; kind: 'local'; mode: MainKey; subKey: string }
  | { id: string; label: string; kind: 'remote'; url: string; url_label: string };

// Atalhos do backend (/api/shortcuts/para-card)
export interface RemoteShortcut {
  id: string;
  titulo: string;
  descricao?: string;
  tipo?: string;
  url: string;
  url_label?: string;
}

// ── Bloco gerado por uma ação ───────────────────────────────────────
export type BlockKind = 'standard' | 'initial' | 'share' | 'mode' | 'tool' | 'diagnostico';

export type WorkspaceBlock = {
  id: string;
  cardId: string;
  mode: MainKey;
  subKey: string;
  subLabel: string;
  endpoint: SubAction['endpoint'];
  extra?: Record<string, string>;
  result: Record<string, unknown>;
  difficulty: Dificuldade;
  pinned: boolean;
  createdAt: string;
  kind?: BlockKind;
};

// ── Botões compactos do rodapé do bloco inicial ─────────────────────
export const INITIAL_ACTIONS: { key: string; label: string; mode: MainKey; subKey: string }[] = [
  { key: 'i-entender',  label: 'Entender melhor', mode: 'pesquisar', subKey: 'explicar' },
  { key: 'i-checklist', label: 'Criar checklist', mode: 'executar',  subKey: 'checklist' },
  { key: 'i-msg',       label: 'Gerar mensagem',  mode: 'executar',  subKey: 'mensagem' },
  { key: 'i-exemplos',  label: 'Ver exemplos',    mode: 'aprender',  subKey: 'exemplo' },
  { key: 'i-simular',   label: 'Simular impacto', mode: 'executar',  subKey: 'simular' },
];

// ── Opções do bloco de compartilhamento ─────────────────────────────
export const SHARE_OPTIONS: { id: string; label: string; Icon: React.ElementType; text: (c: IntelligenceCard) => string }[] = [
  { id: 'wa',      label: 'WhatsApp',                Icon: MessageSquare, text: c => `${c.titulo}\n\n${c.resumo || ''}` },
  { id: 'email',   label: 'E-mail',                  Icon: SendIcon,      text: c => `Assunto: ${c.titulo}\n\n${c.resumo || ''}\n\nAção recomendada: ${c.o_que_fazer || '—'}` },
  { id: 'resumo',  label: 'Resumo executivo',        Icon: AlignLeft,     text: c => `RESUMO EXECUTIVO\n• ${c.titulo}\n• Domínio: ${c.dominio || '—'}\n• Urgência: ${c.urgencia}\n• Ação: ${c.o_que_fazer || '—'}` },
  { id: 'equipe',  label: 'Mensagem para equipe',    Icon: Users,         text: c => `Equipe, atenção:\n${c.titulo}\n\nPróximo passo: ${c.o_que_fazer || 'revisar e discutir'}` },
  { id: 'unidade', label: 'Mensagem para unidade',   Icon: Bell,          text: c => `Unidade — alerta:\n${c.titulo}\n${c.resumo || ''}` },
];
