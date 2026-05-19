import React, { useState, useRef, useEffect } from 'react';
import {
  X, ArrowUp, LayoutDashboard, Search, Zap, BookOpen, BarChart2, Compass, Eye, ClipboardList, Target,
  Lightbulb, FileText, FlaskConical, CheckCircle, Gauge, AlignLeft, Star as StarIcon, TrendingUp,
  Plus, Globe, Settings2, Bell, RefreshCw, Pin, Copy, AlertTriangle, Info, Layers, GitCompare,
  Languages, Users, Send as SendIcon, Bookmark, Share2, Brain, Award, MessageSquare, FileQuestion,
  Sparkles, Loader2, Sun, Moon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { IntelligenceCard, WorkspaceIntent } from './WorkspacePanel';
import { ActionResult } from './WorkspacePanel';
import { apiFetch } from '../api';

// Card vindo do feed, anexado ao chat para alimentar o modo selecionado.
export type WorkspaceContext = { card: IntelligenceCard; intent: WorkspaceIntent; seq: number };

type Phase = 'init' | 'expanded' | 'selected';
type MainKey = 'pesquisar' | 'executar' | 'aprender';

const MAIN_BTNS: { key: MainKey; label: string; Icon: React.ElementType }[] = [
  { key: 'pesquisar', label: 'Entender', Icon: Search    },
  { key: 'executar',  label: 'Executar', Icon: Zap       },
  { key: 'aprender',  label: 'Aprender', Icon: BookOpen  },
];

const INTENT_TO_MAIN: Record<WorkspaceIntent, MainKey | null> = {
  utilizar:     'executar',
  perguntas:    'pesquisar',
  exemplos:     'aprender',
  compartilhar: null,
};

// ── Dificuldade ───────────────────────────────────────────────────────────────
type Dificuldade = 'muito_facil' | 'facil' | 'dificil' | 'muito_dificil';
const DIFICULDADE_LABELS: Record<Dificuldade, string> = {
  muito_facil:   'Muito fácil',
  facil:         'Fácil',
  dificil:       'Difícil',
  muito_dificil: 'Muito difícil',
};

// ── Atalhos do card ───────────────────────────────────────────────────────────
// Atalho local executa uma sub-ação existente. Atalho remoto abre URL.
type LocalShortcut =
  | { id: string; label: string; kind: 'local'; mode: MainKey; subKey: string }
  | { id: string; label: string; kind: 'remote'; url: string; url_label: string };

// Atalhos do backend (/api/shortcuts/para-card)
interface RemoteShortcut {
  id: string;
  titulo: string;
  descricao?: string;
  tipo?: string;
  url: string;
  url_label?: string;
}

function shortcutsForCard(card: IntelligenceCard): LocalShortcut[] {
  const d = ((card.dominio || '') + ' ' + (card.area || '')).toLowerCase();
  if (/reput|nota|avalia|review/.test(d)) return [
    { id: 'sc-r1', kind: 'local', label: 'Responder avaliações pendentes', mode: 'executar', subKey: 'mensagem' },
    { id: 'sc-r2', kind: 'local', label: 'Criar plano de recuperação de nota', mode: 'executar', subKey: 'plano' },
    { id: 'sc-r3', kind: 'local', label: 'Gerar mensagem para equipe', mode: 'executar', subKey: 'mensagem' },
    { id: 'sc-r4', kind: 'local', label: 'Criar checklist de atendimento', mode: 'executar', subKey: 'checklist' },
    { id: 'sc-r5', kind: 'local', label: 'Ver concorrentes com melhor avaliação', mode: 'pesquisar', subKey: 'comparar' },
  ];
  if (/concorr|posicio/.test(d)) return [
    { id: 'sc-c1', kind: 'local', label: 'Comparar concorrente',         mode: 'pesquisar', subKey: 'comparar' },
    { id: 'sc-c2', kind: 'local', label: 'Criar resposta comercial',     mode: 'executar',  subKey: 'campanha' },
    { id: 'sc-c3', kind: 'local', label: 'Monitorar este concorrente',   mode: 'executar',  subKey: 'tarefa' },
    { id: 'sc-c4', kind: 'local', label: 'Analisar raio no mapa',        mode: 'pesquisar', subKey: 'cruzar' },
    { id: 'sc-c5', kind: 'local', label: 'Criar campanha local',         mode: 'executar',  subKey: 'campanha' },
  ];
  if (/forneced|supply|estoque/.test(d)) return [
    { id: 'sc-f1', kind: 'local', label: 'Comparar fornecedor',          mode: 'pesquisar', subKey: 'comparar' },
    { id: 'sc-f2', kind: 'local', label: 'Criar mensagem de cotação',    mode: 'executar',  subKey: 'mensagem' },
    { id: 'sc-f3', kind: 'local', label: 'Simular economia',             mode: 'executar',  subKey: 'simular' },
    { id: 'sc-f4', kind: 'local', label: 'Criar checklist de troca',     mode: 'executar',  subKey: 'checklist' },
    { id: 'sc-f5', kind: 'local', label: 'Validar risco operacional',    mode: 'executar',  subKey: 'validar' },
  ];
  if (/marketing|midia|trafego|presenca/.test(d)) return [
    { id: 'sc-m1', kind: 'local', label: 'Criar campanha',               mode: 'executar',  subKey: 'campanha' },
    { id: 'sc-m2', kind: 'local', label: 'Gerar post',                   mode: 'executar',  subKey: 'mensagem' },
    { id: 'sc-m3', kind: 'local', label: 'Criar WhatsApp',               mode: 'executar',  subKey: 'mensagem' },
    { id: 'sc-m4', kind: 'local', label: 'Atualizar Google Maps',        mode: 'executar',  subKey: 'tarefa' },
    { id: 'sc-m5', kind: 'local', label: 'Calendário de ação',           mode: 'executar',  subKey: 'plano' },
  ];
  // Genérico
  return [
    { id: 'sc-g1', kind: 'local', label: 'Entender melhor',  mode: 'pesquisar', subKey: 'explicar' },
    { id: 'sc-g2', kind: 'local', label: 'Criar plano',      mode: 'executar',  subKey: 'plano' },
    { id: 'sc-g3', kind: 'local', label: 'Criar checklist',  mode: 'executar',  subKey: 'checklist' },
    { id: 'sc-g4', kind: 'local', label: 'Gerar mensagem',   mode: 'executar',  subKey: 'mensagem' },
    { id: 'sc-g5', kind: 'local', label: 'Simular resultado',mode: 'executar',  subKey: 'simular' },
  ];
}

// ── Sub-actions: 10 por modo, todas com label e função ────────────────────────
type SubAction = {
  key: string;
  label: string;
  Icon: React.ElementType;
  endpoint: 'pesquisar' | 'executar' | 'aprender' | 'simular' | 'regenerar' | 'estender' | null;
  extra?: Record<string, string>;
};

const SUB_BTNS: Record<MainKey, SubAction[]> = {
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
    { key: 'missao',          label: 'Marcar como missão',   Icon: StarIcon,     endpoint: null },
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

const MODE_LABEL: Record<MainKey, string> = {
  pesquisar: 'Entender',
  executar:  'Executar',
  aprender:  'Aprender',
};

// ── Bloco gerado por uma ação ─────────────────────────────────────────────────
type BlockKind = 'standard' | 'initial' | 'share' | 'mode';

const MODE_TITLES: Record<MainKey, string> = {
  pesquisar: 'Entendendo este sinal',
  executar:  'Caminho de execução',
  aprender:  'Aprendizado aplicado',
};

const MODE_FIELDS: Record<MainKey, { label: string; key: string }[]> = {
  pesquisar: [
    { label: 'Resumo do sinal',           key: 'resumo_sinal' },
    { label: 'Por que isso importa',      key: 'por_que_importa' },
    { label: 'O que pode estar por trás', key: 'pode_estar_por_tras' },
    { label: 'Risco de ignorar',          key: 'risco_ignorar' },
    { label: 'Oportunidade se agir',      key: 'oportunidade_agir' },
    { label: 'O que observar agora',      key: 'observar_agora' },
  ],
  executar: [
    { label: 'Objetivo da ação',          key: 'objetivo' },
    { label: 'Primeiro passo',            key: 'primeiro_passo' },
    { label: 'Quem deveria executar',     key: 'quem_executa' },
    { label: 'Prazo sugerido',            key: 'prazo' },
    { label: 'Critério de sucesso',       key: 'criterio_sucesso' },
    { label: 'Risco antes de executar',   key: 'risco_antes' },
  ],
  aprender: [
    { label: 'Conceito principal',        key: 'conceito' },
    { label: 'Por que importa p/ negócio',key: 'por_que_negocio' },
    { label: 'Exemplo prático',           key: 'exemplo' },
    { label: 'Erro comum',                key: 'erro_comum' },
    { label: 'Como medir',                key: 'como_medir' },
    { label: 'Próximo nível',             key: 'proximo_nivel' },
  ],
};

// Ordem dos atalhos dentro de cada bloco de modo — top 5 + outros 5 em "Mais ações"
const MODE_TOP5: Record<MainKey, string[]> = {
  pesquisar: ['resumir', 'risco', 'evidencias', 'comparar', 'negocio'],
  executar:  ['checklist', 'plano', 'mensagem', 'simular', 'missao'],
  aprender:  ['exemplo', 'conceito', 'erro', 'medir', 'memoria'],
};

type WorkspaceBlock = {
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

// Fallback local específico por sub-ação. Cada botão gera conteúdo distinto,
// no shape compatível com o renderer do endpoint (pesquisar/executar/aprender/...).
function buildFallbackForSub(card: IntelligenceCard, sub: SubAction, difficulty: Dificuldade): Record<string, unknown> {
  const titulo  = card.titulo;
  const resumo  = card.resumo || titulo;
  const dom     = card.area || card.dominio || 'operação';
  const urg     = card.urgencia || 'media';
  const acao    = card.o_que_fazer || 'definir próximo passo';
  const _dif    = DIFICULDADE_LABELS[difficulty];

  switch (sub.key) {
    // ── ENTENDER ────────────────────────────────────────────────────────────
    case 'resumir':
      return {
        pontos_chave: [`Em uma frase: ${resumo}`],
        contexto_setorial: `Resumo executivo (${_dif}) sobre ${dom}.`,
      };
    case 'explicar':
      return {
        pontos_chave: [resumo, `Impacto em ${dom}.`, `Urgência: ${urg}.`],
        contexto_setorial: `Este sinal indica mudança na dinâmica de ${dom}. ${card.por_que_importa || ''}`.trim(),
        perguntas_a_investigar: [`Quem é responsável por ${dom}?`, `Quais dados confirmam essa mudança?`],
      };
    case 'aprofundar':
      return {
        contexto_setorial: `Análise profunda de ${titulo}.`,
        pontos_chave: [
          `Origem do sinal: ${dom}`,
          `Mecanismo provável: ${resumo}`,
          `Impacto secundário: atendimento e conversão`,
          `Janela de reação: ${urg === 'alta' ? '48–72h' : urg === 'media' ? '2 semanas' : '30 dias'}`,
        ],
      };
    case 'evidencias':
      return {
        pontos_chave: [
          `Histórico interno de ${dom}`,
          `Avaliações públicas (Google, redes sociais)`,
          `Movimentação de concorrentes próximos`,
          `Indicadores operacionais relacionados`,
        ],
        contexto_setorial: `Fontes recomendadas para validar "${titulo}".`,
      };
    case 'comparar':
      return {
        paragrafos: [
          `Cenário atual: ${resumo}`,
          `Cenário ideal: ${dom} performando acima da média regional, com ${acao} já em execução.`,
        ],
      };
    case 'risco':
      return {
        paragrafos: [
          urg === 'alta'
            ? `Risco alto. Reação rápida necessária — concorrentes podem capturar demanda.`
            : urg === 'media'
              ? `Risco moderado. Monitorar evolução nas próximas semanas.`
              : `Risco baixo. Acompanhar periodicamente.`,
          `Áreas mais expostas: ${dom}, atendimento, reputação.`,
        ],
      };
    case 'oportunidade':
      return {
        paragrafos: [
          `Reagindo antes dos concorrentes, ${dom} pode se reposicionar como referência local.`,
          `Atalho prático: ${acao}.`,
        ],
      };
    case 'confianca':
      return {
        paragrafos: [
          `Confiança no sinal: ${card.confianca || 'média'} (score ${Math.round((card.confianca_score || 0.5) * 100)}%).`,
          `Risco de interpretação: ${Math.round((card.risco_erro || 0.5) * 100)}%.`,
        ],
      };
    case 'cruzar':
      return {
        pontos_chave: [
          `Sinal A: ${titulo}`,
          `Sinal B: indicadores operacionais de ${dom}`,
          `Sinal C: movimentos competitivos locais`,
        ],
        contexto_setorial: `Cruzando os 3 sinais acima, ${dom} merece prioridade ${urg}.`,
      };
    case 'negocio':
      return {
        paragrafos: [
          `Em linguagem de negócio: ${resumo}`,
          `O que isso significa hoje: ${acao}.`,
        ],
      };

    // ── EXECUTAR ────────────────────────────────────────────────────────────
    case 'checklist':
      return {
        itens: [
          { tarefa: `Mapear situação atual de ${dom}`,            responsavel: 'Gestor',     prazo: 'Hoje',     prioridade: urg },
          { tarefa: `Definir responsável por ${acao}`,            responsavel: 'Liderança',  prazo: 'Esta semana', prioridade: 'alta' },
          { tarefa: `Executar primeira ação`,                     responsavel: 'Operação',   prazo: '7 dias',   prioridade: 'alta' },
          { tarefa: `Medir resultado preliminar`,                 responsavel: 'Gestor',     prazo: '15 dias',  prioridade: 'media' },
          { tarefa: `Ajustar plano com base no resultado`,        responsavel: 'Liderança',  prazo: '30 dias',  prioridade: 'media' },
        ],
      };
    case 'plano':
      return {
        itens: [
          { tarefa: `Passo 1 — Diagnóstico de ${dom}`,            responsavel: 'Gestor',     prazo: 'Semana 1', prioridade: 'alta' },
          { tarefa: `Passo 2 — Definir alvo e responsável`,       responsavel: 'Liderança',  prazo: 'Semana 1', prioridade: 'alta' },
          { tarefa: `Passo 3 — Execução piloto`,                  responsavel: 'Operação',   prazo: 'Semana 2', prioridade: 'media' },
          { tarefa: `Passo 4 — Avaliar e escalar`,                responsavel: 'Liderança',  prazo: 'Semana 4', prioridade: 'media' },
        ],
      };
    case 'campanha':
      return {
        paragrafos: [
          `Nome sugerido: "${dom} em foco".`,
          `Público-alvo: clientes recorrentes da unidade + público da região.`,
          `Mensagem-chave: reagir a "${titulo}" com proposta diferenciada de ${dom}.`,
          `Canais: redes sociais locais, WhatsApp da base, parcerias regionais.`,
        ],
      };
    case 'tarefa':
      return {
        itens: [
          { tarefa: acao, responsavel: 'A definir', prazo: urg === 'alta' ? 'Hoje' : '7 dias', prioridade: urg },
        ],
      };
    case 'delegar':
      return {
        paragrafos: [
          `Responsável sugerido: gestor de ${dom}.`,
          `Prazo: ${urg === 'alta' ? 'esta semana' : '15 dias'}.`,
          `Entregável: relatório com ação executada + medição de resultado.`,
        ],
      };
    case 'mensagem':
      return {
        texto_mensagem:
          `Equipe, atenção:\n\n` +
          `${titulo}\n\n` +
          `${resumo}\n\n` +
          `Próximo passo: ${acao}.\n\n` +
          `Urgência: ${urg}. Quem tocar essa ação me avise hoje.`,
      };
    case 'roteiro':
      return {
        itens: [
          { tarefa: 'Abertura — contexto', responsavel: 'Apresentador', prazo: '2 min',  prioridade: 'media' },
          { tarefa: `Problema — ${titulo}`,            responsavel: 'Apresentador', prazo: '3 min',  prioridade: 'alta' },
          { tarefa: `Causas — análise de ${dom}`,      responsavel: 'Apresentador', prazo: '4 min',  prioridade: 'alta' },
          { tarefa: `Plano de ação — ${acao}`,         responsavel: 'Apresentador', prazo: '4 min',  prioridade: 'alta' },
          { tarefa: 'Próximos passos e responsáveis',  responsavel: 'Apresentador', prazo: '2 min',  prioridade: 'media' },
        ],
      };
    case 'simular':
      return {
        cenarios: [
          { nome: 'Otimista',  resultado_30d: `+8% em ${dom}`,      resultado_90d: `+18% sustentado` },
          { nome: 'Realista',  resultado_30d: `+3% em ${dom}`,      resultado_90d: `+8% sustentado` },
          { nome: 'Pessimista',resultado_30d: `estável`,             resultado_90d: `-2% se sem ação` },
        ],
        recomendacao: `Em 30d, execução do plano sugere ganho moderado em ${dom}.`,
      };
    case 'validar':
      return {
        pontos_chave: [
          `Critério 1: dado de origem do sinal está atualizado?`,
          `Critério 2: existe ação semelhante em andamento?`,
          `Critério 3: orçamento e equipe disponíveis?`,
          `Critério 4: o ganho esperado supera o esforço?`,
          `Critério 5: existe risco regulatório/operacional?`,
        ],
        contexto_setorial: 'Validar antes de executar — checklist de sanidade.',
      };
    case 'missao':
      return {
        paragrafos: [
          `Missão criada: "${titulo}".`,
          `Responsável a definir. Prazo: ${urg === 'alta' ? '7 dias' : '30 dias'}. Esta missão fica no seu painel de execução.`,
        ],
      };

    // ── APRENDER ────────────────────────────────────────────────────────────
    case 'conceito':
      return {
        conceito: `${dom} — conceito central observado neste sinal.`,
        por_que_importa_para_negocios: card.por_que_importa || resumo,
        exemplos_praticos: [
          `Como ${dom} aparece no dia-a-dia operacional`,
          `Como rede competitiva trata ${dom}`,
        ],
      };
    case 'exemplo':
      return {
        exemplos_praticos: [
          `Caso A: unidade comparável reagiu a sinal similar com ${acao}.`,
          `Caso B: rede regional ignorou sinal parecido e perdeu fluxo em 60 dias.`,
          `Caso C: ação preventiva em ${dom} dobrou taxa de conversão local.`,
        ],
      };
    case 'referencia':
      return {
        pontos_chave: [
          `Estudo setorial: tendências em ${dom}.`,
          `Benchmark interno: unidades referência.`,
          `Manual operacional: protocolos para ${dom}.`,
        ],
        contexto_setorial: 'Referências sugeridas para aprofundamento.',
      };
    case 'erro':
      return {
        pontos_chave: [
          `Erro comum 1: agir sem dados de origem.`,
          `Erro comum 2: delegar sem responsável claro.`,
          `Erro comum 3: ignorar a janela de reação adequada.`,
        ],
        contexto_setorial: `Armadilhas frequentes ao tratar sinais de ${dom}.`,
      };
    case 'medir':
      return {
        pontos_chave: [
          `KPI 1: indicador direto de ${dom} (medido semanalmente).`,
          `KPI 2: NPS ou nota pública local.`,
          `KPI 3: variação de ticket médio na unidade.`,
        ],
        contexto_setorial: 'Como medir o efeito da ação tomada.',
      };
    case 'aula':
      return {
        paragrafos: [
          `Aula rápida — ${dom}.`,
          `1) Contexto: ${resumo}.`,
          `2) Mecanismo: por que esse sinal aparece e o que ele indica.`,
          `3) Ação: ${acao}, com responsáveis e prazo definidos.`,
        ],
      };
    case 'perguntas':
      return {
        perguntas_a_investigar: [
          `O que causou o sinal "${titulo}"?`,
          `Quanto tempo o problema vem se desenvolvendo?`,
          `Quais unidades estão sendo afetadas?`,
          `Existe ação semelhante já em curso?`,
          `Como medir o resultado da resposta?`,
        ],
      };
    case 'analogia':
      return {
        paragrafos: [
          `Pense em ${dom} como o termostato da operação: indica quando algo está fora da temperatura ideal.`,
          `Sinais como "${titulo}" são alertas iniciais — agir cedo é mais barato que reagir tarde.`,
        ],
      };
    case 'nivel':
      return {
        paragrafos: [
          `Próximo nível: cruzar este sinal com outros 2 indicadores de ${dom}.`,
          `Quando dominar, considere automatizar alerta antes do impacto.`,
        ],
      };
    case 'memoria':
      return {
        paragrafos: [
          `Memória salva: "${titulo}" será lembrada quando padrões similares aparecerem.`,
        ],
      };

    default:
      return {
        paragrafos: [`${sub.label}: ${resumo}`],
      };
  }
}

// Expande o card num bloco inicial com 8 campos preenchidos via fallback local
// quando o backend não forneceu detalhes específicos.
function buildInitialBlock(card: IntelligenceCard, difficulty: Dificuldade): WorkspaceBlock {
  const dom = (card.area || card.dominio || 'área de operação').toLowerCase();
  const o_que_aconteceu =
    card.resumo ||
    `Detectamos um sinal relevante relacionado a ${dom}. ${card.titulo}`;
  const por_que_importa =
    card.por_que_importa ||
    `Esse tipo de sinal costuma afetar a percepção de clientes próximos, a operação local e a competitividade da unidade.`;
  const onde_afeta =
    card.onde_afeta ||
    `Principalmente em ${dom}, com efeito secundário em atendimento, conversão e reputação local.`;
  const risco =
    card.urgencia === 'alta'
      ? 'Alto — exige reação rápida. Concorrentes podem capturar demanda enquanto o problema persiste.'
      : card.urgencia === 'media'
        ? 'Moderado — monitorar evolução nos próximos dias.'
        : 'Baixo — manter sob acompanhamento periódico.';
  const oportunidade =
    `Reagir antes dos concorrentes pode reposicionar a unidade como referência em ${dom}.`;
  const acao_recomendada =
    card.o_que_fazer ||
    `Revisar o contexto, definir responsável e prazo, e gerar plano de ação operacional.`;
  const proximo_passo =
    `Use os atalhos abaixo ou clique em "Entender melhor" para aprofundar antes de decidir.`;
  return {
    id:         `blk-init-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    cardId:     card.id,
    mode:       'pesquisar',
    subKey:     'inicial',
    subLabel:   'Análise inicial',
    endpoint:   null,
    result: {
      o_que_aconteceu,
      por_que_importa,
      onde_afeta,
      risco,
      oportunidade,
      dominio: dom,
      acao_recomendada,
      proximo_passo,
    },
    difficulty,
    pinned:     false,
    createdAt:  new Date().toISOString(),
    kind:       'initial',
  };
}

// Bloco com opções de compartilhamento (intent === 'compartilhar').
function buildShareBlock(card: IntelligenceCard, difficulty: Dificuldade): WorkspaceBlock {
  return {
    id:         `blk-share-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    cardId:     card.id,
    mode:       'executar',
    subKey:     'compartilhar',
    subLabel:   'Compartilhar',
    endpoint:   null,
    result:     { share: true, titulo: card.titulo, resumo: card.resumo },
    difficulty,
    pinned:     false,
    createdAt:  new Date().toISOString(),
    kind:       'share',
  };
}

// Atalhos contextuais que aparecem abaixo de cada bloco gerado.
// Reaproveita o tipo LocalShortcut.kind='local' — clicar dispara handleSubAction.
function buildBlockShortcuts(block: WorkspaceBlock): LocalShortcut[] {
  const m = block.mode;
  const s = block.subKey;
  const mk = (label: string, mode: MainKey, subKey: string, suffix: string): LocalShortcut =>
    ({ id: `bsc-${block.id}-${suffix}`, kind: 'local', label, mode, subKey });

  // ── EXECUTAR — atalhos por sub ────────────────────────────────────────────
  if (s === 'checklist') return [
    mk('Transformar em missão',         'executar',  'missao',    '1'),
    mk('Definir responsável',           'executar',  'delegar',   '2'),
    mk('Adicionar prazo',               'executar',  'tarefa',    '3'),
    mk('Gerar mensagem p/ equipe',      'executar',  'mensagem',  '4'),
    mk('Compartilhar checklist',        'executar',  'mensagem',  '5'),
  ];
  if (s === 'plano') return [
    mk('Quebrar em tarefas',            'executar',  'checklist', '1'),
    mk('Criar cronograma',              'executar',  'roteiro',   '2'),
    mk('Definir prioridades',           'executar',  'validar',   '3'),
    mk('Simular resultado',             'executar',  'simular',   '4'),
    mk('Validar antes de executar',     'executar',  'validar',   '5'),
  ];
  if (s === 'campanha') return [
    mk('Gerar post',                    'executar',  'mensagem',  '1'),
    mk('Gerar WhatsApp',                'executar',  'mensagem',  '2'),
    mk('Versão mais agressiva',         'executar',  'campanha',  '3'),
    mk('Versão premium',                'executar',  'campanha',  '4'),
    mk('Simular impacto',               'executar',  'simular',   '5'),
  ];
  if (s === 'mensagem') return [
    mk('Adaptar para WhatsApp',         'executar',  'mensagem',  '1'),
    mk('Adaptar para e-mail',           'executar',  'mensagem',  '2'),
    mk('Deixar mais direto',            'executar',  'mensagem',  '3'),
    mk('Deixar mais premium',           'executar',  'mensagem',  '4'),
    mk('Versão para equipe',            'executar',  'mensagem',  '5'),
  ];
  if (s === 'tarefa' || s === 'delegar') return [
    mk('Adicionar prazo',               'executar',  'tarefa',    '1'),
    mk('Definir responsável',           'executar',  'delegar',   '2'),
    mk('Criar checklist',               'executar',  'checklist', '3'),
    mk('Marcar como missão',            'executar',  'missao',    '4'),
    mk('Compartilhar tarefa',           'executar',  'mensagem',  '5'),
  ];
  if (s === 'simular' || s === 'validar') return [
    mk('Plano para melhor cenário',     'executar',  'plano',     '1'),
    mk('Riscos do pior cenário',        'pesquisar', 'risco',     '2'),
    mk('Comparar cenários',             'pesquisar', 'comparar',  '3'),
    mk('Transformar em decisão',        'executar',  'missao',    '4'),
    mk('Checklist de validação',        'executar',  'checklist', '5'),
  ];
  if (s === 'missao') return [
    mk('Criar checklist',               'executar',  'checklist', '1'),
    mk('Definir responsável',           'executar',  'delegar',   '2'),
    mk('Criar cronograma',              'executar',  'roteiro',   '3'),
    mk('Gerar mensagem',                'executar',  'mensagem',  '4'),
    mk('Simular impacto',               'executar',  'simular',   '5'),
  ];
  if (s === 'roteiro') return [
    mk('Criar checklist',               'executar',  'checklist', '1'),
    mk('Definir responsáveis',          'executar',  'delegar',   '2'),
    mk('Gerar mensagem',                'executar',  'mensagem',  '3'),
    mk('Marcar como missão',            'executar',  'missao',    '4'),
    mk('Simular resultado',             'executar',  'simular',   '5'),
  ];

  // ── ENTENDER — atalhos por sub ────────────────────────────────────────────
  if (s === 'risco') return [
    mk('Plano de prevenção',            'executar',  'plano',     '1'),
    mk('Simular impacto',               'executar',  'simular',   '2'),
    mk('Checklist de risco',            'executar',  'checklist', '3'),
    mk('Alerta para equipe',            'executar',  'mensagem',  '4'),
    mk('Ver sinais relacionados',       'pesquisar', 'cruzar',    '5'),
  ];
  if (s === 'evidencias') return [
    mk('Resumir evidências',            'pesquisar', 'resumir',   '1'),
    mk('Comparar com concorrente',      'pesquisar', 'comparar',  '2'),
    mk('Ver confiança',                 'pesquisar', 'confianca', '3'),
    mk('Cruzar sinais',                 'pesquisar', 'cruzar',    '4'),
    mk('Criar relatório curto',         'executar',  'plano',     '5'),
  ];
  if (s === 'comparar') return [
    mk('Resposta competitiva',          'executar',  'campanha',  '1'),
    mk('Gerar campanha',                'executar',  'campanha',  '2'),
    mk('Ver pontos fracos',             'pesquisar', 'risco',     '3'),
    mk('Ver oportunidade',              'pesquisar', 'oportunidade','4'),
    mk('Plano de ação',                 'executar',  'plano',     '5'),
  ];
  if (m === 'pesquisar') return [
    mk('Explicar mais simples',         'pesquisar', 'explicar',  '1'),
    mk('Ver evidências',                'pesquisar', 'evidencias','2'),
    mk('Ver risco',                     'pesquisar', 'risco',     '3'),
    mk('Ver oportunidade',              'pesquisar', 'oportunidade','4'),
    mk('Traduzir para ação',            'executar',  'tarefa',    '5'),
  ];

  // ── APRENDER — atalhos por sub ────────────────────────────────────────────
  if (s === 'exemplo') return [
    mk('Exemplo p/ meu negócio',        'aprender',  'exemplo',   '1'),
    mk('Transformar em checklist',      'executar',  'checklist', '2'),
    mk('Gerar mensagem',                'executar',  'mensagem',  '3'),
    mk('Criar plano',                   'executar',  'plano',     '4'),
    mk('Próximo nível',                 'aprender',  'nivel',     '5'),
  ];
  if (s === 'conceito') return [
    mk('Explicar mais simples',         'pesquisar', 'explicar',  '1'),
    mk('Criar analogia',                'aprender',  'analogia',  '2'),
    mk('Mostrar caso real',             'aprender',  'exemplo',   '3'),
    mk('Criar perguntas',               'aprender',  'perguntas', '4'),
    mk('Salvar aprendizado',            'aprender',  'memoria',   '5'),
  ];
  if (m === 'aprender') return [
    mk('Mostrar exemplo prático',       'aprender',  'exemplo',   '1'),
    mk('Criar aula rápida',             'aprender',  'aula',      '2'),
    mk('Explicar erro comum',           'aprender',  'erro',      '3'),
    mk('Mostrar como medir',            'aprender',  'medir',     '4'),
    mk('Salvar como referência',        'aprender',  'memoria',   '5'),
  ];

  // ── Fallback genérico ─────────────────────────────────────────────────────
  return [
    mk('Entender melhor',               'pesquisar', 'explicar',  '1'),
    mk('Criar checklist',               'executar',  'checklist', '2'),
    mk('Gerar mensagem',                'executar',  'mensagem',  '3'),
    mk('Simular resultado',             'executar',  'simular',   '4'),
    mk('Salvar referência',             'aprender',  'memoria',   '5'),
  ];
}

// Conteúdo do bloco de modo (Entender / Executar / Aprender) — fallback local.
function buildModeBlock(card: IntelligenceCard, mode: MainKey, difficulty: Dificuldade): WorkspaceBlock {
  const dom = (card.area || card.dominio || 'área de operação').toLowerCase();
  const titulo = card.titulo;
  const resumo = card.resumo || titulo;
  const urg = card.urgencia || 'media';
  const acao = card.o_que_fazer || 'definir próximo passo';
  let result: Record<string, unknown>;
  if (mode === 'pesquisar') {
    result = {
      resumo_sinal:        resumo,
      por_que_importa:     card.por_que_importa || `Esse sinal toca diretamente ${dom} e pode antecipar mudanças mais amplas.`,
      pode_estar_por_tras: `Variações em ${dom} costumam refletir movimento competitivo ou mudança de comportamento.`,
      risco_ignorar:       urg === 'alta'
        ? 'Alto — concorrentes podem capturar terreno antes da reação.'
        : urg === 'media' ? 'Moderado — vale acompanhar nas próximas semanas.' : 'Baixo — manter sob acompanhamento.',
      oportunidade_agir:   `Reagir antes dos pares posiciona ${dom} como referência local.`,
      observar_agora:      `Indicador correlato de ${dom} nos próximos ${urg === 'alta' ? '7' : '30'} dias.`,
    };
  } else if (mode === 'executar') {
    result = {
      objetivo:         `Tratar o sinal "${titulo}" com ação operacional concreta.`,
      primeiro_passo:   acao,
      quem_executa:     `Gestor responsável por ${dom}.`,
      prazo:            urg === 'alta' ? 'Esta semana' : 'Próximas 2 semanas',
      criterio_sucesso: `Indicador de ${dom} retornar ao nível esperado em 30 dias.`,
      risco_antes:      'Verificar se há iniciativa semelhante já em curso antes de duplicar esforço.',
    };
  } else {
    result = {
      conceito:        `${dom} como termômetro operacional do negócio.`,
      por_que_negocio: card.por_que_importa || 'Sinais como este antecipam problemas maiores e oportunidades de diferenciação.',
      exemplo:         `Unidade do mesmo setor reagiu a sinal similar com ${acao} e ganhou tração em 60 dias.`,
      erro_comum:      'Agir antes de confirmar a causa raiz e sem definir responsável.',
      como_medir:      'KPI semanal específico para a área, com revisão quinzenal.',
      proximo_nivel:   'Automatizar alerta direto para o gestor quando o padrão se repetir.',
    };
  }
  return {
    id:         `blk-mode-${mode}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    cardId:     card.id,
    mode,
    subKey:     'mode',
    subLabel:   MODE_TITLES[mode],
    endpoint:   null,
    result,
    difficulty,
    pinned:     false,
    createdAt:  new Date().toISOString(),
    kind:       'mode',
  };
}

// 5 botões de ação rápida no rodapé do bloco inicial.
const INITIAL_ACTIONS: { key: string; label: string; mode: MainKey; subKey: string }[] = [
  { key: 'i-entender',  label: 'Entender melhor', mode: 'pesquisar', subKey: 'explicar' },
  { key: 'i-checklist', label: 'Criar checklist', mode: 'executar',  subKey: 'checklist' },
  { key: 'i-msg',       label: 'Gerar mensagem',  mode: 'executar',  subKey: 'mensagem' },
  { key: 'i-exemplos',  label: 'Ver exemplos',    mode: 'aprender',  subKey: 'exemplo' },
  { key: 'i-simular',   label: 'Simular impacto', mode: 'executar',  subKey: 'simular' },
];

// Opções no bloco de compartilhamento.
const SHARE_OPTIONS: { id: string; label: string; Icon: React.ElementType; text: (c: IntelligenceCard) => string }[] = [
  { id: 'wa',      label: 'WhatsApp',                Icon: MessageSquare, text: c => `${c.titulo}\n\n${c.resumo || ''}` },
  { id: 'email',   label: 'E-mail',                  Icon: SendIcon,      text: c => `Assunto: ${c.titulo}\n\n${c.resumo || ''}\n\nAção recomendada: ${c.o_que_fazer || '—'}` },
  { id: 'resumo',  label: 'Resumo executivo',        Icon: AlignLeft,     text: c => `RESUMO EXECUTIVO\n• ${c.titulo}\n• Domínio: ${c.dominio || '—'}\n• Urgência: ${c.urgencia}\n• Ação: ${c.o_que_fazer || '—'}` },
  { id: 'equipe',  label: 'Mensagem para equipe',    Icon: Users,         text: c => `Equipe, atenção:\n${c.titulo}\n\nPróximo passo: ${c.o_que_fazer || 'revisar e discutir'}` },
  { id: 'unidade', label: 'Mensagem para unidade',   Icon: Bell,          text: c => `Unidade — alerta:\n${c.titulo}\n${c.resumo || ''}` },
];

// Toolbar fixo do ChatPanel: 4 chips premium e limpos, sem expansão de listas.
// Cada modo gera um bloco de conteúdo abaixo — os 10 atalhos vão dentro do bloco.
function WorkspaceToolbar({ activeMode, workspaceOpen, onModeClick, onWorkspaceClick, disabled }: {
  activeMode?: MainKey | null;
  workspaceOpen: boolean;
  onModeClick: (mode: MainKey) => void;
  onWorkspaceClick: () => void;
  disabled?: boolean;
}) {
  const chipBase = "flex items-center justify-center gap-1.5 h-9 rounded-xl border text-[11px] font-semibold transition-all duration-150 active:scale-[0.97] cursor-pointer disabled:opacity-40 disabled:cursor-default";
  return (
    <div className="flex flex-col gap-1.5">
      {/* Área de Trabalho — toggle dos 3 modos */}
      <button
        type="button"
        onClick={onWorkspaceClick}
        disabled={disabled}
        className={`${chipBase} w-full ${workspaceOpen
          ? 'bg-[#3b82f6]/10 border-[#3b82f6]/40 text-[#3b82f6] dark:text-[#60a5fa]'
          : 'bg-neutral-100 dark:bg-[#2b2b2b] border-neutral-200 dark:border-[#3d3d3d] text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200/70 dark:hover:bg-[#353535]'}`}
      >
        Área de Trabalho
      </button>
      {/* 3 modos — chips (só aparecem quando workspaceOpen) */}
      <AnimatePresence initial={false}>
        {workspaceOpen && (
          <motion.div
            key="modes"
            initial={{ opacity: 0, height: 0, marginTop: -6 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 0 }}
            exit={{ opacity: 0, height: 0, marginTop: -6 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="grid grid-cols-3 gap-1.5 overflow-hidden"
          >
            {MAIN_BTNS.map(btn => {
              const isActive = activeMode === btn.key;
              return (
                <button
                  key={btn.key}
                  type="button"
                  onClick={() => onModeClick(btn.key)}
                  disabled={disabled}
                  className={`${chipBase} ${isActive
                    ? 'bg-[#3b82f6] border-[#3b82f6] text-white'
                    : 'bg-white dark:bg-[#373737] border-neutral-200 dark:border-[#4e4e4e] text-neutral-600 dark:text-neutral-300 hover:border-[#3b82f6]/40 hover:text-[#3b82f6] dark:hover:text-[#60a5fa]'}`}
                >
                  <btn.Icon size={12} />
                  {btn.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'card' | 'block';
  text: string;
  card?: IntelligenceCard;
  block?: WorkspaceBlock;
}

function ChatBody({ onClose, showClose, workspaceContext, activeSector }: { onClose?: () => void; showClose?: boolean; workspaceContext?: WorkspaceContext | null; activeSector?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [activeCard, setActiveCard] = useState<IntelligenceCard | null>(null);
  const [dificuldade, setDificuldade] = useState<Dificuldade>('facil');
  const [shortcuts, setShortcuts] = useState<LocalShortcut[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // sub.key em execução
  const [activeMode, setActiveMode] = useState<MainKey | null>(null);
  // Toggle dos 3 modos no toolbar (Área de Trabalho expande/recolhe).
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const lastCardIdRef = useRef<string | null>(null);
  const firstBlockRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, actionLoading]);

  // Trocar de perfil/demo (activeSector) zera o chat — cada empresa tem sua Área de Trabalho própria.
  useEffect(() => {
    setMessages([]);
    setShortcuts([]);
    setActiveCard(null);
    setActionLoading(null);
    setActiveMode(null);
    setWorkspaceOpen(false);
    lastCardIdRef.current = null;
  }, [activeSector]);

  // Clique no botão de modo (Entender/Executar/Aprender) — gera bloco de modo no chat.
  function handleModeClick(mode: MainKey) {
    if (!activeCard) return;
    setActiveMode(mode);
    const block = buildModeBlock(activeCard, mode, dificuldade);
    setMessages(prev => [...prev, { id: block.id, role: 'block', text: block.subLabel, block }]);
  }

  // Clique em "Área de Trabalho" — alterna a visibilidade dos 3 modos no toolbar.
  // NÃO gera bloco, NÃO apaga conteúdo, NÃO abre fullscreen.
  function handleAreaTrabalhoClick() {
    setWorkspaceOpen(prev => !prev);
  }

  // Card chegou do feed — anexa ao histórico, define card ativo, carrega atalhos,
  // gera bloco inicial expandido + bloco de compartilhamento quando aplicável.
  useEffect(() => {
    if (!workspaceContext) return;
    const { card, intent, seq } = workspaceContext;

    // Mesmo card reativado: só dispara bloco de modo conforme intent (sem duplicar análise).
    if (lastCardIdRef.current === card.id) {
      const mainKey = INTENT_TO_MAIN[intent];
      if (mainKey) {
        setActiveMode(mainKey);
        setWorkspaceOpen(true);
        const modeBlock = buildModeBlock(card, mainKey, dificuldade);
        setMessages(prev => [...prev, { id: modeBlock.id, role: 'block', text: modeBlock.subLabel, block: modeBlock }]);
      }
      if (intent === 'compartilhar') {
        // Compartilhar não abre os 3 modos automaticamente.
        const shareBlock = buildShareBlock(card, dificuldade);
        setMessages(prev => [...prev, { id: shareBlock.id, role: 'block', text: shareBlock.subLabel, block: shareBlock }]);
      }
      return;
    }
    lastCardIdRef.current = card.id;
    setActiveCard(card);

    // 1) Card pequeno na conversa
    const cardMsg: Message = { id: `card-${seq}-${card.id}`, role: 'card', text: card.titulo, card };
    // 2) Bloco inicial expandido (fallback local — usa dados do card)
    const initialBlock = buildInitialBlock(card, dificuldade);
    const initialMsg: Message = { id: initialBlock.id, role: 'block', text: initialBlock.subLabel, block: initialBlock };

    const newMessages: Message[] = [cardMsg, initialMsg];

    // 3) Bloco de compartilhamento (apenas para intent='compartilhar')
    if (intent === 'compartilhar') {
      const shareBlock = buildShareBlock(card, dificuldade);
      newMessages.push({ id: shareBlock.id, role: 'block', text: shareBlock.subLabel, block: shareBlock });
    }
    // 4) Intent que mapeia pra modo (utilizar/perguntas/exemplos) pré-gera bloco de modo
    //    e abre o workspace toolbar. Compartilhar NÃO abre os 3 modos.
    const mainKey = INTENT_TO_MAIN[intent];
    if (mainKey) {
      setActiveMode(mainKey);
      setWorkspaceOpen(true);
      const modeBlock = buildModeBlock(card, mainKey, dificuldade);
      newMessages.push({ id: modeBlock.id, role: 'block', text: modeBlock.subLabel, block: modeBlock });
    } else {
      // Intent compartilhar (ou desconhecido) — mantém workspace fechado.
      setWorkspaceOpen(false);
    }
    setMessages(prev => [...prev, ...newMessages]);

    // 4) Atalhos: começa com fallback local por domínio; tenta backend e mescla
    setShortcuts(shortcutsForCard(card));
    if (!card._synthetic) {
      apiFetch<{ shortcuts?: RemoteShortcut[] }>('/api/shortcuts/para-card', {
        method: 'POST',
        body: JSON.stringify({ card_id: card.id, limit: 3 }),
      })
        .then(d => {
          const remote = (d?.shortcuts || []).map<LocalShortcut>(s => ({
            id: `rs-${s.id}`, kind: 'remote', label: s.titulo, url: s.url, url_label: s.url_label || 'Abrir',
          }));
          if (remote.length) {
            // Mescla: 2 remotos + 3 locais
            setShortcuts(prev => [...remote.slice(0, 2), ...prev.slice(0, 3)]);
          }
        })
        .catch(() => { /* mantém locais */ });
    }

  }, [workspaceContext]); // eslint-disable-line react-hooks/exhaustive-deps

  // Dispara uma sub-ação: chama endpoint ou usa fallback local, gera bloco.
  async function handleSubAction(mode: MainKey, sub: SubAction) {
    if (!activeCard) return;
    setActionLoading(sub.key);
    const blockId = `blk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    let result: Record<string, unknown>;
    const useFallback = !sub.endpoint || activeCard._synthetic;
    if (useFallback) {
      await new Promise(r => setTimeout(r, 300));
      result = buildFallbackForSub(activeCard, sub, dificuldade);
    } else {
      try {
        result = await apiFetch<Record<string, unknown>>(`/api/workspace/${sub.endpoint}`, {
          method: 'POST',
          body: JSON.stringify({ card_id: activeCard.id, ...(sub.extra || {}) }),
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Falha ao conectar';
        result = { erro: msg };
      }
    }
    const block: WorkspaceBlock = {
      id:         blockId,
      cardId:     activeCard.id,
      mode,
      subKey:     sub.key,
      subLabel:   sub.label,
      endpoint:   sub.endpoint,
      extra:      sub.extra,
      result,
      difficulty: dificuldade,
      pinned:     false,
      createdAt:  new Date().toISOString(),
    };
    setMessages(prev => [...prev, { id: blockId, role: 'block', text: sub.label, block }]);
    setActionLoading(null);
  }

  // Re-dispara a mesma ação que gerou um bloco anterior.
  function regenerateBlock(block: WorkspaceBlock) {
    const sub = SUB_BTNS[block.mode].find(s => s.key === block.subKey);
    if (!sub) return;
    handleSubAction(block.mode, sub);
  }

  function togglePinBlock(blockId: string) {
    setMessages(prev => prev.map(m => {
      if (m.role !== 'block' || !m.block || m.block.id !== blockId) return m;
      return { ...m, block: { ...m.block, pinned: !m.block.pinned } };
    }));
  }

  function copyBlock(block: WorkspaceBlock) {
    try {
      const txt = JSON.stringify(block.result, null, 2);
      navigator.clipboard?.writeText(txt).catch(() => {});
    } catch { /* ignore */ }
  }

  // "Exemplos" no bloco: chama Aprender · exemplo pro mesmo card.
  function blockExamples() {
    const sub = SUB_BTNS.aprender.find(s => s.key === 'exemplo');
    if (sub) handleSubAction('aprender', sub);
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text }]);
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      text: 'Analisando os dados do seu negócio. Em breve terei uma resposta completa para você.',
    }]);
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-full">

      {/* Close — mobile only */}
      {showClose && onClose && (
        <div className="flex justify-end px-5 pt-5 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-[#353535] transition-all duration-200 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-3">
        {messages.map((msg) => {
          if (msg.role === 'card' && msg.card) {
            const c = msg.card;
            const urgColor = c.urgencia === 'alta' ? '#ef4444' : c.urgencia === 'media' ? '#f59e0b' : '#6b7280';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="flex justify-start"
              >
                <div className="max-w-[92%] w-full p-3.5 rounded-2xl rounded-bl-sm bg-white dark:bg-[#373737] border border-neutral-200 dark:border-[#414141]">
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: urgColor }}>{c.dominio || c.area || 'Card'}</p>
                  <p className="text-[13px] font-semibold text-neutral-800 dark:text-neutral-100 leading-snug">{c.titulo}</p>
                  {c.resumo && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">{c.resumo}</p>
                  )}
                </div>
              </motion.div>
            );
          }
          if (msg.role === 'block' && msg.block) {
            const b = msg.block;
            const isInitial = b.kind === 'initial';
            const isShare   = b.kind === 'share';
            const isMode    = b.kind === 'mode';
            const headerColor = isInitial ? '#10b981' : isShare ? '#f59e0b' : isMode ? '#3b82f6' : '#3b82f6';
            return (
              <motion.div
                ref={isInitial ? firstBlockRef : undefined}
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="flex justify-start"
              >
                <div className="max-w-[94%] w-full rounded-2xl rounded-bl-sm bg-white dark:bg-[#373737] border border-neutral-200 dark:border-[#414141] overflow-hidden">
                  <div className="px-3.5 py-2 border-b border-neutral-100 dark:border-[#414141] flex items-center gap-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: headerColor }}>
                      {isInitial ? 'Análise inicial' : isShare ? 'Compartilhar' : isMode ? MODE_LABEL[b.mode] : MODE_LABEL[b.mode]}
                    </span>
                    {isMode && (
                      <>
                        <span className="text-[10px] text-neutral-400">·</span>
                        <span className="text-[10px] font-semibold text-neutral-600 dark:text-neutral-300 flex-1 truncate">{b.subLabel}</span>
                      </>
                    )}
                    {!isInitial && !isShare && !isMode && (
                      <>
                        <span className="text-[10px] text-neutral-400">·</span>
                        <span className="text-[10px] font-semibold text-neutral-600 dark:text-neutral-300 flex-1 truncate">{b.subLabel}</span>
                      </>
                    )}
                    {(isInitial || isShare) && <div className="flex-1" />}
                    {b.pinned && <Pin size={10} className="text-amber-500 flex-shrink-0" />}
                    <span className="text-[9px] text-neutral-400 tabular-nums">
                      {new Date(b.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="px-3.5 py-3 text-[12px] text-neutral-700 dark:text-neutral-300">
                    {isInitial ? (
                      <InitialBlockContent result={b.result} />
                    ) : isShare ? (
                      <ShareOptionsContent card={activeCard} />
                    ) : isMode ? (
                      <ModeBlockContent result={b.result} mode={b.mode} />
                    ) : (
                      <ActionResult result={b.result} action={b.endpoint || null} />
                    )}
                  </div>
                  {/* Rodapé: ações + seletor de dificuldade no próprio bloco */}
                  {isInitial ? (
                    <div className="px-2.5 py-2 border-t border-neutral-100 dark:border-[#414141] flex flex-col gap-2">
                      {/* Atalhos principais do card */}
                      <div className="flex items-center gap-1 flex-wrap">
                        {INITIAL_ACTIONS.map(a => {
                          const sub = SUB_BTNS[a.mode].find(s => s.key === a.subKey);
                          return (
                            <BlockCtrl
                              key={a.key}
                              Icon={sub?.Icon || Sparkles}
                              label={a.label}
                              onClick={() => { if (sub) handleSubAction(a.mode, sub); }}
                            />
                          );
                        })}
                      </div>
                      {/* Controles do bloco — mesma estética dos outros blocos */}
                      <div className="flex items-center gap-1 flex-wrap pt-1 border-t border-dashed border-neutral-100 dark:border-[#414141]">
                        <BlockCtrl Icon={RefreshCw} label="Gerar novamente" onClick={() => {
                          if (!activeCard) return;
                          const newBlock = buildInitialBlock(activeCard, dificuldade);
                          setMessages(prev => [...prev, { id: newBlock.id, role: 'block', text: newBlock.subLabel, block: newBlock }]);
                        }} />
                        <BlockCtrl Icon={Lightbulb} label="Exemplos" onClick={blockExamples} />
                        <BlockCtrl Icon={Pin}       label={b.pinned ? 'Fixado' : 'Fixar'} active={b.pinned} onClick={() => togglePinBlock(b.id)} />
                        <BlockCtrl Icon={Copy}      label="Copiar"   onClick={() => copyBlock(b)} />
                      </div>
                      <DifficultyRow value={dificuldade} onChange={setDificuldade} />
                    </div>
                  ) : isShare ? (
                    <div className="px-2.5 py-2 border-t border-neutral-100 dark:border-[#414141] flex items-center gap-1 flex-wrap">
                      <BlockCtrl Icon={Pin}  label={b.pinned ? 'Fixado' : 'Fixar'} active={b.pinned} onClick={() => togglePinBlock(b.id)} />
                      <BlockCtrl Icon={Copy} label="Copiar tudo" onClick={() => copyBlock(b)} />
                    </div>
                  ) : isMode ? (
                    <div className="px-2.5 py-2 border-t border-neutral-100 dark:border-[#414141] flex flex-col gap-2">
                      <ModeShortcuts
                        mode={b.mode}
                        onPick={(subKey) => {
                          const sub = SUB_BTNS[b.mode].find(x => x.key === subKey);
                          if (sub) handleSubAction(b.mode, sub);
                        }}
                      />
                      <div className="flex items-center gap-1 flex-wrap pt-1 border-t border-dashed border-neutral-100 dark:border-[#414141]">
                        <BlockCtrl Icon={RefreshCw} label="Gerar novamente" onClick={() => {
                          const newBlock = buildModeBlock(activeCard!, b.mode, dificuldade);
                          setMessages(prev => [...prev, { id: newBlock.id, role: 'block', text: newBlock.subLabel, block: newBlock }]);
                        }} />
                        <BlockCtrl Icon={Lightbulb} label="Exemplos" onClick={blockExamples} />
                        <BlockCtrl Icon={Pin}       label={b.pinned ? 'Fixado' : 'Fixar'} active={b.pinned} onClick={() => togglePinBlock(b.id)} />
                        <BlockCtrl Icon={Copy}      label="Copiar"   onClick={() => copyBlock(b)} />
                      </div>
                      <DifficultyRow value={dificuldade} onChange={setDificuldade} />
                    </div>
                  ) : (
                    <div className="px-2.5 py-2 border-t border-neutral-100 dark:border-[#414141] flex flex-col gap-2">
                      <div className="flex items-center gap-1 flex-wrap">
                        <BlockCtrl Icon={RefreshCw} label="Gerar novamente" onClick={() => regenerateBlock(b)} />
                        <BlockCtrl Icon={Lightbulb}  label="Exemplos"     onClick={blockExamples} />
                        <BlockCtrl Icon={Pin}        label={b.pinned ? 'Fixado' : 'Fixar'} active={b.pinned} onClick={() => togglePinBlock(b.id)} />
                        <BlockCtrl Icon={Copy}       label="Copiar"       onClick={() => copyBlock(b)} />
                      </div>
                      <DifficultyRow value={dificuldade} onChange={setDificuldade} />
                      <BlockShortcutsRow shortcuts={buildBlockShortcuts(b)} onPick={(mode, subKey) => {
                        const sub = SUB_BTNS[mode].find(x => x.key === subKey);
                        if (sub) handleSubAction(mode, sub);
                      }} />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          }
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`
                max-w-[88%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed
                ${msg.role === 'user'
                  ? 'bg-[#3b82f6] text-white rounded-br-sm'
                  : 'bg-neutral-100 dark:bg-[#373737] text-neutral-700 dark:text-neutral-300 rounded-bl-sm'
                }
              `}>
                {msg.text}
              </div>
            </motion.div>
          );
        })}

        {/* Loader da ação em curso */}
        {actionLoading && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-neutral-100 dark:bg-[#373737] w-fit"
          >
            <Loader2 size={12} className="animate-spin text-[#3b82f6]" />
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400">Gerando · {SUB_BTNS[Object.keys(SUB_BTNS).find(k => SUB_BTNS[k as MainKey].some(s => s.key === actionLoading)) as MainKey]?.find(s => s.key === actionLoading)?.label || actionLoading}</span>
          </motion.div>
        )}

        {/* Typing indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-neutral-100 dark:bg-[#373737] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
              {[0, 1, 2].map(i => (
                <motion.span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 block"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 flex-shrink-0">
        <AnimatePresence mode="wait">
          {!started ? (
            <motion.div
              key="inicializar"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <WorkspaceToolbar
                activeMode={activeMode}
                workspaceOpen={workspaceOpen}
                onModeClick={handleModeClick}
                onWorkspaceClick={handleAreaTrabalhoClick}
                disabled={!activeCard || actionLoading !== null}
              />
            </motion.div>
          ) : (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex items-end gap-2 bg-neutral-50 dark:bg-[#353535] border border-neutral-200 dark:border-[#414141] rounded-2xl px-4 py-3 focus-within:border-neutral-300 dark:focus-within:border-[#414141] transition-colors duration-200"
            >
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={e => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
                onKeyDown={handleKey}
                placeholder="Escreva uma mensagem..."
                className="flex-1 bg-transparent text-[13px] text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-600 outline-none resize-none leading-relaxed"
                style={{ minHeight: '20px', maxHeight: '120px' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="w-7 h-7 rounded-xl bg-[#3b82f6] disabled:bg-neutral-200 dark:disabled:bg-[#414141] flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:bg-[#2563eb] active:scale-90 cursor-pointer disabled:cursor-default mb-0.5"
              >
                <ArrowUp size={13} className="text-white" strokeWidth={2.5} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}

// Renderiza os 8 campos do bloco inicial em formato de lista.
function InitialBlockContent({ result }: { result: Record<string, unknown> }) {
  const fields: { label: string; key: string; emphasis?: boolean }[] = [
    { label: 'O que aconteceu',   key: 'o_que_aconteceu' },
    { label: 'Por que importa',   key: 'por_que_importa', emphasis: true },
    { label: 'Onde afeta',        key: 'onde_afeta' },
    { label: 'Risco',             key: 'risco' },
    { label: 'Oportunidade',      key: 'oportunidade' },
    { label: 'Domínio',           key: 'dominio' },
    { label: 'Ação recomendada',  key: 'acao_recomendada', emphasis: true },
    { label: 'Próximo passo',     key: 'proximo_passo' },
  ];
  return (
    <div className="space-y-2.5">
      {fields.map(f => {
        const v = result[f.key];
        if (!v) return null;
        return (
          <div key={f.key}>
            <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-0.5">{f.label}</p>
            <p className={`text-[12px] leading-relaxed ${f.emphasis ? 'text-neutral-800 dark:text-neutral-200 font-medium' : 'text-neutral-600 dark:text-neutral-400'}`}>
              {String(v)}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// Render do bloco de compartilhamento — 5 opções, cada uma copia/envia o texto formatado.
function ShareOptionsContent({ card }: { card: IntelligenceCard | null }) {
  function fire(textBuilder: (c: IntelligenceCard) => string) {
    if (!card) return;
    const txt = textBuilder(card);
    try {
      if (navigator.share) {
        navigator.share({ title: card.titulo, text: txt }).catch(() => {
          navigator.clipboard?.writeText(txt).catch(() => {});
        });
      } else {
        navigator.clipboard?.writeText(txt).catch(() => {});
      }
    } catch { /* noop */ }
  }
  return (
    <div className="grid grid-cols-1 gap-1.5">
      {SHARE_OPTIONS.map(opt => (
        <button key={opt.id} onClick={() => fire(opt.text)}
          className="flex items-center gap-2 px-2 py-2 rounded-lg border border-neutral-200 dark:border-[#4e4e4e] hover:bg-neutral-50 dark:hover:bg-[#414141] transition-colors cursor-pointer text-left">
          <opt.Icon size={13} className="text-[#f59e0b] flex-shrink-0" />
          <span className="text-[11px] font-medium text-neutral-700 dark:text-neutral-200">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

// Conteúdo de um bloco de modo (Entender / Executar / Aprender) — 6 campos por modo.
function ModeBlockContent({ result, mode }: { result: Record<string, unknown>; mode: MainKey }) {
  const fields = MODE_FIELDS[mode];
  return (
    <div className="space-y-2.5">
      {fields.map(f => {
        const v = result[f.key];
        if (!v) return null;
        return (
          <div key={f.key}>
            <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-0.5">{f.label}</p>
            <p className="text-[12px] leading-relaxed text-neutral-700 dark:text-neutral-300">{String(v)}</p>
          </div>
        );
      })}
    </div>
  );
}

// Atalhos do bloco de modo: 5 primeiros + "Mais ações" para os 5 seguintes.
function ModeShortcuts({ mode, onPick }: { mode: MainKey; onPick: (subKey: string) => void }) {
  const [showMore, setShowMore] = useState(false);
  const top5Keys = MODE_TOP5[mode];
  const allSubs = SUB_BTNS[mode];
  const top5 = top5Keys.map(k => allSubs.find(s => s.key === k)).filter(Boolean) as SubAction[];
  const rest = allSubs.filter(s => !top5Keys.includes(s.key));
  const visible = showMore ? [...top5, ...rest] : top5;
  return (
    <div className="flex flex-wrap gap-1">
      {visible.map(s => (
        <button key={s.key} type="button" onClick={() => onPick(s.key)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-neutral-200 dark:border-[#4e4e4e] text-neutral-600 dark:text-neutral-300 hover:bg-[#3b82f6]/10 hover:text-[#3b82f6] hover:border-[#3b82f6]/40 dark:hover:text-[#60a5fa] transition-colors cursor-pointer">
          <s.Icon size={11} />
          {s.label}
        </button>
      ))}
      {!showMore && rest.length > 0 && (
        <button type="button" onClick={() => setShowMore(true)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-dashed border-neutral-300 dark:border-[#4e4e4e] text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-[#414141] transition-colors cursor-pointer">
          Mais ações
        </button>
      )}
    </div>
  );
}

function BlockShortcutsRow({ shortcuts, onPick }: {
  shortcuts: LocalShortcut[];
  onPick: (mode: MainKey, subKey: string) => void;
}) {
  if (!shortcuts.length) return null;
  return (
    <div className="flex items-center gap-1 flex-wrap pt-1 border-t border-dashed border-neutral-100 dark:border-[#414141]">
      <span className="text-[9px] uppercase tracking-wider text-neutral-400 mr-1">Atalhos</span>
      {shortcuts.slice(0, 5).map(s => {
        if (s.kind !== 'local') return null;
        return (
          <button key={s.id} type="button" onClick={() => onPick(s.mode, s.subKey)}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-neutral-200 dark:border-[#4e4e4e] text-neutral-600 dark:text-neutral-300 hover:bg-[#3b82f6]/10 hover:text-[#3b82f6] hover:border-[#3b82f6]/40 dark:hover:text-[#60a5fa] transition-colors cursor-pointer">
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

function DifficultyRow({ value, onChange }: { value: Dificuldade; onChange: (d: Dificuldade) => void }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      <span className="text-[9px] uppercase tracking-wider text-neutral-400 mr-1">Dificuldade</span>
      {(Object.keys(DIFICULDADE_LABELS) as Dificuldade[]).map(d => (
        <button key={d} onClick={() => onChange(d)}
          className={`px-1.5 py-0.5 rounded-md text-[9px] font-semibold transition-colors cursor-pointer ${value === d
            ? 'bg-[#3b82f6] text-white'
            : 'text-neutral-500 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}>
          {DIFICULDADE_LABELS[d]}
        </button>
      ))}
    </div>
  );
}

function BlockCtrl({ Icon, label, onClick, active, dimmed }: {
  Icon: React.ElementType; label: string; onClick?: () => void; active?: boolean; dimmed?: boolean;
}) {
  const base = "inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold transition-colors cursor-pointer";
  const cls = active
    ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
    : dimmed
      ? "text-neutral-400 dark:text-neutral-500 cursor-default"
      : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-[#414141] hover:text-neutral-700 dark:hover:text-neutral-200";
  return (
    <button type="button" onClick={onClick} disabled={dimmed} className={`${base} ${cls}`}>
      <Icon size={10} />
      <span>{label}</span>
    </button>
  );
}

interface ChatDesktopProps {
  wide?: boolean;
  onSector?: () => void;
  onBrowser?: () => void;
  onDifficulty?: () => void;
  activeSector?: string;
  workspaceContext?: WorkspaceContext | null;
  dark?: boolean;
  onToggleTheme?: () => void;
}

export function ChatDesktop({ wide, onSector, onBrowser, onDifficulty, activeSector, workspaceContext, dark, onToggleTheme }: ChatDesktopProps) {
  const btnCls = "cursor-pointer text-neutral-400 dark:text-neutral-200 p-2 rounded-xl hover:bg-neutral-200/60 dark:hover:bg-white/5 hover:text-neutral-800 dark:hover:text-white transition-all duration-200 active:scale-90";
  return (
    <div
      style={{ width: wide ? 'calc(50vw - 16px)' : '380px', transition: 'width 500ms cubic-bezier(0.25,0.1,0.25,1)' }}
      className="fixed top-[72px] right-4 bottom-4 z-[40] hidden lg:flex flex-col bg-[#f0f2f4] dark:bg-[#323232] border border-neutral-100 dark:border-[#414141] rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.13)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
    >
      {/* Header com ícones — ordem: Plus / Globe / Bell / Sun-Moon / Settings */}
      <div className="flex items-center justify-between gap-6 px-6 pt-5 pb-2 flex-shrink-0 border-b border-neutral-100 dark:border-[#414141]">
        <button onClick={onSector} className={`${btnCls} relative`} title="Trocar feed por área">
          <Plus size={22} className={activeSector && activeSector !== 'geral' ? 'text-[#3b82f6]' : ''} />
          {activeSector && activeSector !== 'geral' && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
          )}
        </button>
        <button onClick={onBrowser} className={btnCls} title="Sincronizar">
          <Globe size={22} />
        </button>
        <button className={btnCls} title="Notificações">
          <Bell size={22} />
        </button>
        {onToggleTheme && (
          <button onClick={onToggleTheme} className={btnCls} title={dark ? 'Modo claro' : 'Modo escuro'}>
            {dark ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        )}
        <button onClick={onDifficulty} className={btnCls} title="Dificuldade">
          <Settings2 size={22} />
        </button>
      </div>
      <div className="flex-1 min-h-0">
        <ChatBody workspaceContext={workspaceContext} activeSector={activeSector} />
      </div>
    </div>
  );
}

function GamepadIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <path d="M4.5 11C4.5 9.067 6.067 7.5 8 7.5H20C21.933 7.5 23.5 9.067 23.5 11V15.5C23.5 18.538 21.538 21.2 18.7 22.2L17.5 22.6C15.23 23.4 12.77 23.4 10.5 22.6L9.3 22.2C6.462 21.2 4.5 18.538 4.5 15.5V11Z" stroke="white" strokeWidth="1.6" strokeLinejoin="round"/>
      {/* D-pad vertical */}
      <path d="M9 13.5V16.5" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
      {/* D-pad horizontal */}
      <path d="M7.5 15H10.5" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
      {/* Button circle right */}
      <circle cx="19" cy="13" r="1.1" fill="white"/>
      {/* Button circle top */}
      <circle cx="17" cy="11.2" r="1.1" fill="white"/>
      {/* Button circle bottom */}
      <circle cx="17" cy="14.8" r="1.1" fill="white"/>
      {/* Button circle left */}
      <circle cx="15" cy="13" r="1.1" fill="white"/>
      {/* Center line hint */}
      <path d="M13 10.5H15" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}

export function ChatFAB({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.88, rotate: -12 }}
      transition={{ type: 'spring', stiffness: 500, damping: 18 }}
      className="fixed right-5 z-[170] rounded-full backdrop-blur-md bg-white/30 border border-white/40 dark:bg-black/30 dark:border-white/10 flex items-center justify-center lg:hidden cursor-pointer"
      style={{ width: 72, height: 72, bottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
    >
      <LayoutDashboard size={24} className="text-neutral-600 dark:text-neutral-300" strokeWidth={1.8} />
    </motion.button>
  );
}

export function ChatMobile({
  open, onClose, workspaceContext, activeSector,
  onSector, onBrowser, onDifficulty, unreadCount,
  dark, onToggleTheme,
}: {
  open: boolean;
  onClose: () => void;
  workspaceContext?: WorkspaceContext | null;
  activeSector?: string;
  onSector?: () => void;
  onBrowser?: () => void;
  onDifficulty?: () => void;
  unreadCount?: number;
  dark?: boolean;
  onToggleTheme?: () => void;
}) {
  const btnCls = "cursor-pointer text-neutral-600 dark:text-neutral-200 p-2 rounded-xl hover:bg-neutral-200/60 dark:hover:bg-white/5 hover:text-neutral-800 dark:hover:text-white transition-all duration-200 active:scale-90";
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed inset-0 z-[200] lg:hidden bg-[#f0f2f4] dark:bg-[#2b2b2b] flex flex-col"
        >
          {/* Header com ícones — ordem: Plus / Globe / Bell / Sun-Moon / Settings / X */}
          <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-2 flex-shrink-0 border-b border-neutral-100 dark:border-[#414141]">
            <button onClick={onSector} className={`${btnCls} relative`} title="Trocar feed por área">
              <Plus size={22} className={activeSector && activeSector !== 'geral' ? 'text-[#3b82f6]' : ''} />
              {activeSector && activeSector !== 'geral' && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
              )}
            </button>
            <button onClick={onBrowser} className={btnCls} title="Sincronizar">
              <Globe size={22} />
            </button>
            <button className={`${btnCls} relative`} title="Notificações">
              <Bell size={22} />
              {(unreadCount ?? 0) > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            {onToggleTheme && (
              <button onClick={onToggleTheme} className={btnCls} title={dark ? 'Modo claro' : 'Modo escuro'}>
                {dark ? <Sun size={22} /> : <Moon size={22} />}
              </button>
            )}
            <button onClick={onDifficulty} className={btnCls} title="Dificuldade">
              <Settings2 size={22} />
            </button>
            <button onClick={onClose} className={btnCls} title="Fechar">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <ChatBody workspaceContext={workspaceContext} activeSector={activeSector} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
