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
  Gauge, Compass, Languages, Target, Users,
  MessageSquare, FlaskConical, Brain, Lightbulb,
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
  executar:  'Analisar',
  aprender:  'Aprender',
};

export const MODE_TITLES: Record<MainKey, string> = {
  pesquisar: 'Entendendo este sinal',
  executar:  'Análise do sinal',
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
    { label: 'Objetivo',              key: 'objetivo' },
    { label: 'Diagnóstico',           key: 'diagnostico' },
    { label: 'Primeiro passo',        key: 'primeiro_passo' },
    { label: 'Plano inicial',         key: 'plano_inicial' },
    { label: 'Quem executa',          key: 'quem_executa' },
    { label: 'Prazo',                 key: 'prazo' },
    { label: 'Risco antes de agir',   key: 'risco_antes' },
    { label: 'Critério de sucesso',   key: 'criterio_sucesso' },
    { label: 'Plano B',               key: 'plano_b' },
    { label: 'Próximo passo',         key: 'proximo_passo' },
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
  executar:  ['evidencias', 'simular', 'mercado', 'canal', 'ignorar'],
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
    { key: 'evidencias',  label: 'Separar evidências',          Icon: FileText,      endpoint: 'executar', extra: { tipo: 'evidencias' } },
    { key: 'simular',     label: 'Simular cenário',             Icon: FlaskConical,  endpoint: 'simular',  extra: { cenario: 'realista' } },
    { key: 'mercado',     label: 'Comparar com mercado',        Icon: GitCompare,    endpoint: 'executar', extra: { tipo: 'mercado' } },
    { key: 'canal',       label: 'Ver impacto por canal',       Icon: TrendingUp,    endpoint: 'executar', extra: { tipo: 'canal' } },
    { key: 'ignorar',     label: 'O que muda se ignorado?',     Icon: AlertTriangle, endpoint: 'executar', extra: { tipo: 'ignorar' } },
    { key: 'dados',       label: 'Comparar com contexto da empresa', Icon: Compass,       endpoint: 'executar', extra: { tipo: 'dados_internos' } },
    { key: 'oportunidade',label: 'Onde está a oportunidade?',  Icon: Target,        endpoint: 'executar', extra: { tipo: 'oportunidade' } },
    { key: 'territorial', label: 'Ver impacto territorial',     Icon: Layers,        endpoint: 'executar', extra: { tipo: 'territorial' } },
    { key: 'risco',       label: 'Qual é o risco comercial?',   Icon: Gauge,         endpoint: 'executar', extra: { tipo: 'risco' } },
    { key: 'mensagem',    label: 'Preparar mensagem',           Icon: MessageSquare, endpoint: 'executar', extra: { tipo: 'mensagem' } },
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

// Metadados de proveniência do LLM, ecoados pelo backend (agents/base_agent.py)
// em cada resposta de /api/workspace/*. Ausente quando o bloco veio de
// fallback local do frontend (card sintético ou sem endpoint) — nesse caso
// não houve tentativa de chamar o backend, então não há o que reportar aqui.
export type WorkspaceLlmMeta = {
  usedLlm: boolean;
  llmProvider: string | null;
  /** "missing_api_key" | "missing_package" | "llm_error" | null (LLM não tentado ou respondeu de verdade) */
  fallbackReason: string | null;
};

export type WorkspaceBlock = {
  id: string;
  cardId: string;
  mode: MainKey;
  subKey: string;
  subLabel: string;
  endpoint: SubAction['endpoint'];
  extra?: Record<string, string>;
  result: Record<string, unknown>;
  /** Presente só quando `result` veio de uma chamada real ao backend (não fallback local). */
  llmMeta?: WorkspaceLlmMeta;
  difficulty: Dificuldade;
  pinned: boolean;
  createdAt: string;
  kind?: BlockKind;
};

// ── Botões compactos do rodapé do bloco inicial ─────────────────────
export const INITIAL_ACTIONS: { key: string; label: string; mode: MainKey; subKey: string }[] = [
  { key: 'i-entender',   label: 'Entender melhor',   mode: 'pesquisar', subKey: 'explicar' },
  { key: 'i-evidencias', label: 'Separar evidências', mode: 'executar',  subKey: 'evidencias' },
  { key: 'i-risco',      label: 'Ver risco',          mode: 'executar',  subKey: 'risco' },
  { key: 'i-exemplos',   label: 'Ver exemplos',       mode: 'aprender',  subKey: 'exemplo' },
  { key: 'i-simular',    label: 'Simular cenário',    mode: 'executar',  subKey: 'simular' },
];

// ── Opções do bloco de compartilhamento ─────────────────────────────
export const SHARE_OPTIONS: { id: string; label: string; Icon: React.ElementType; text: (c: IntelligenceCard) => string }[] = [
  { id: 'wa',      label: 'WhatsApp',                Icon: MessageSquare, text: c => `${c.titulo}\n\n${c.resumo || ''}` },
  { id: 'email',   label: 'E-mail',                  Icon: SendIcon,      text: c => `Assunto: ${c.titulo}\n\n${c.resumo || ''}\n\nAção recomendada: ${c.o_que_fazer || '—'}` },
  { id: 'resumo',  label: 'Resumo executivo',        Icon: AlignLeft,     text: c => `RESUMO EXECUTIVO\n• ${c.titulo}\n• Domínio: ${c.dominio || '—'}\n• Urgência: ${c.urgencia}\n• Ação: ${c.o_que_fazer || '—'}` },
  { id: 'equipe',  label: 'Mensagem para equipe',    Icon: Users,         text: c => `Equipe, atenção:\n${c.titulo}\n\nPróximo passo: ${c.o_que_fazer || 'revisar e discutir'}` },
  { id: 'unidade', label: 'Mensagem para unidade',   Icon: Bell,          text: c => `Unidade — alerta:\n${c.titulo}\n${c.resumo || ''}` },
];
