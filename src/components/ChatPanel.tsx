import React, { useState, useRef, useEffect } from 'react';
import {
  X, ArrowUp, LayoutDashboard, Search, Zap, BookOpen, BarChart2, Compass, Eye, ClipboardList, Target,
  Lightbulb, FileText, FlaskConical, CheckCircle, Gauge, AlignLeft, Star as StarIcon, TrendingUp,
  Plus, Globe, Upload, Settings2, Bell, RefreshCw, Pin, Copy, AlertTriangle, Info, Layers, GitCompare,
  Languages, Users, Send as SendIcon, Bookmark, Share2, Brain, Award, MessageSquare, FileQuestion,
  Sparkles, Loader2, History,
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
        pontos_chave: [
          `Em uma frase: ${resumo}`,
          `Domínio afetado: ${dom} — urgência ${urg}.`,
          `Direção sugerida: ${acao}.`,
          `Janela de reação: ${urg === 'alta' ? '48–72 horas' : urg === 'media' ? '2 semanas' : '30 dias'}.`,
        ],
        contexto_setorial: `Resumo executivo (${_dif}) sobre ${dom}.`,
      };
    case 'explicar':
      return {
        pontos_chave: [
          `Explicação simples: ${resumo}`,
          `Contexto: o sinal aparece em ${dom} e reflete combinação de comportamento do cliente, movimento de concorrentes e variação interna de operação.`,
          `Exemplo aplicado: unidade comparável tratou caso similar com ${acao} e recuperou indicador em 45 dias.`,
          `Por que importa: ignorar abre espaço pra concorrentes consolidarem posição na região; cada semana sem ação multiplica o esforço de recuperação depois.`,
          `Próximo passo: validar com 1-2 indicadores adicionais antes de comprometer recursos — investe 30 min, evita executar plano errado.`,
        ],
        contexto_setorial: `Leitura prática de "${titulo}" — explicada em camadas, do simples ao aplicável.`,
        perguntas_a_investigar: [`Quem é responsável formal por ${dom}?`, `Quais dados confirmam que a mudança é real e não ruído?`, `Existe ação semelhante já em curso na unidade?`],
      };
    case 'aprofundar':
      return {
        paragrafos: [
          `Análise profunda de "${titulo}" — contexto, causas, consequências e hipóteses.`,
          `Contexto: ${dom} é área onde o cliente decide rápido e a operação responde com pouco delay; sinais aqui costumam refletir mudança real do mercado em até 2 semanas.`,
          `Causas possíveis: (1) movimento competitivo direto, (2) gap operacional interno, (3) mudança no comportamento do cliente local, (4) sazonalidade ou evento externo.`,
          `Consequências encadeadas: queda em ${dom} → pressão sobre indicador correlato → variação em ticket médio/frequência → impacto em margem em 60-90 dias.`,
          `Sinais relacionados: avaliações públicas, comportamento de concorrentes próximos, feedback qualitativo da equipe de linha de frente, variação de fluxo orgânico.`,
          `Hipótese principal: ${resumo} reflete movimento real do mercado com janela curta de reação (${urg === 'alta' ? '48-72h' : urg === 'media' ? '2 semanas' : '30 dias'}).`,
          `Hipótese alternativa: pode ser flutuação sazonal ou ruído de medição — vale confirmar com 2 indicadores adicionais antes de decisão grande.`,
          `Recomendação: validar hipótese principal em 7 dias; se confirmada, executar ${acao} como piloto; revisar em ${urg === 'alta' ? '14' : '30'} dias.`,
        ],
      };
    case 'evidencias':
      return {
        pontos_chave: [
          `Evidência disponível: histórico interno de ${dom} (últimas 4-12 semanas), tendência observada e comparação com período anterior.`,
          `Sinais usados: indicador direto de ${dom} + variação de avaliação pública (Google, iFood, redes sociais) + comportamento de concorrentes próximos.`,
          `Nível de confiança: ${card.confianca || 'média'} (score ${Math.round((card.confianca_score || 0.5) * 100)}%). Indica que o sinal vale agir, mas com 1 etapa de validação antes.`,
          `Lacunas de dados: granularidade por turno/dia, segmentação por público (recorrente vs novo), dados externos sobre movimento exato de concorrentes.`,
          `O que buscar depois: 1 conversa de 20 min com gestor de ${dom}, leitura de últimas 30 avaliações públicas, checagem rápida de 2 concorrentes próximos.`,
          `Decisão possível com esses dados: executar piloto controlado em 14 dias OU agendar revisão em 30 dias se confiança ainda parecer baixa.`,
        ],
        contexto_setorial: `Fontes e nível de confiança para "${titulo}".`,
      };
    case 'comparar':
      return {
        pontos_chave: [
          `Comparação com mercado/concorrente: ${dom} hoje opera abaixo do nível observado em líderes regionais — ${resumo}.`,
          `Onde estamos melhor: histórico operacional, proximidade da base de clientes e capacidade de execução local.`,
          `Onde estamos pior: ${urg === 'alta' ? 'tempo de reação a sinais externos' : 'consistência de indicador entre semanas'} — falta ritmo de revisão.`,
          `Oportunidade prática: usar ${acao} como diferencial enquanto concorrentes ainda não responderam.`,
          `Decisão recomendada: executar plano piloto em 30 dias com KPI claro de ${dom} e meta percentual definida.`,
        ],
        contexto_setorial: `Comparação ${dom} vs mercado regional · ${_dif}.`,
      };
    case 'risco':
      return {
        pontos_chave: [
          `Risco principal: ${urg === 'alta' ? 'perda rápida de demanda pra concorrentes diretos em até 30 dias' : urg === 'media' ? 'erosão gradual de reputação e ticket médio em 60 dias' : 'desgaste lento de indicadores sem reação aparente'}.`,
          `Riscos secundários: clima de equipe, aumento de custos operacionais, leitura negativa pra investidor/franqueado.`,
          `Impacto provável: queda de ${urg === 'alta' ? '8 a 15%' : urg === 'media' ? '3 a 7%' : '1 a 3%'} no indicador-chave em 60 dias se sem ação.`,
          `Sinais de agravamento: queda em avaliações públicas, aumento de cancelamentos, perda de buscas orgânicas, virada negativa em NPS.`,
          `Ação preventiva: ${acao} · revisar em ${urg === 'alta' ? '14' : '30'} dias com responsável e KPI definido.`,
        ],
        contexto_setorial: `Mapa de risco do sinal — ${dom}.`,
      };
    case 'oportunidade':
      return {
        pontos_chave: [
          `Oportunidade principal: posicionar ${dom} como diferencial competitivo na região antes dos pares reagirem.`,
          `Por que existe: gap entre expectativa do cliente local e oferta atual do mercado em ${dom}.`,
          `Como capturar: combinar ${acao} com comunicação clara em canais próprios (mídia local, base de WhatsApp, parcerias).`,
          `Esforço necessário: 2–4 semanas de execução com 1 responsável focado, orçamento moderado e ritual semanal de check-in.`,
          `Retorno esperado: ganho de 5–12% no indicador-chave em 60 dias, com efeito composto em 90 dias se sustentado.`,
        ],
        contexto_setorial: `Mapa de oportunidade — ${dom}.`,
      };
    case 'confianca':
      return {
        pontos_chave: [
          `Nível de confiança: ${card.confianca || 'média'} · score ${Math.round((card.confianca_score || 0.5) * 100)}% · risco de interpretação ${Math.round((card.risco_erro || 0.5) * 100)}%.`,
          `Por que essa confiança: combinação de sinais cruzados, histórico operacional disponível e padrão observado no setor.`,
          `Sinais que sustentam: tendência consistente em ${dom}, comportamento observado em unidades similares, urgência ${urg}.`,
          `Lacunas de dados: granularidade por turno/dia, segmentação por público, atribuição de causa raiz e dados externos do concorrente.`,
          `Como aumentar a confiança: cruzar com 2 indicadores adicionais (NPS, ticket, conversão) e validar com gestor de ${dom} em até 7 dias.`,
        ],
        contexto_setorial: 'Diagnóstico de confiança do sinal.',
      };
    case 'cruzar':
      return {
        pontos_chave: [
          `Sinal A (primário): "${titulo}" — variação direta em ${dom} detectada nas últimas semanas.`,
          `Sinal B (operacional): indicadores internos de ${dom} (frequência, ticket médio, conversão) mostram movimento correlato.`,
          `Sinal C (competitivo): concorrentes próximos com mudanças recentes em proposta ou comunicação na região.`,
          `Padrão observado: os 3 sinais apontam pra mesma direção — não é coincidência, é tendência em curso em ${dom}.`,
          `Hipótese principal: mudança real do mercado/comportamento, com janela de ${urg === 'alta' ? '48-72h' : urg === 'media' ? '2 semanas' : '30 dias'} pra reagir antes dos pares.`,
          `Hipótese alternativa: sazonalidade ou efeito de evento único — vale validar com período comparável (mesma semana de mês anterior, mesma estação).`,
          `Risco se ignorar: concorrente captura janela e o sinal vira commodity em 60-90 dias, com custo maior pra reverter depois.`,
          `Oportunidade se agir: reposicionamento em ${dom} com 2-4 semanas de vantagem competitiva e efeito composto em 90 dias.`,
          `Recomendação: priorizar ${dom} como tema de revisão dos próximos 14 dias, com gestor responsável e KPI cruzado dos 3 sinais.`,
        ],
        contexto_setorial: `Cruzamento de 3 sinais — ${dom} merece prioridade ${urg}.`,
      };
    case 'negocio':
      return {
        pontos_chave: [
          `Vendas: impacto direto em ticket médio e frequência se ${dom} for tratado nas próximas ${urg === 'alta' ? '2' : '4'} semanas.`,
          `Margem: pressão de ${urg === 'alta' ? '2 a 4 pontos percentuais' : '1 a 2 pontos percentuais'} sobre margem operacional caso o problema persista.`,
          `Reputação: efeito direto em NPS e nota pública — cada 0,1★ no Google representa ~7% na conversão de novos clientes.`,
          `Operação: ${urg === 'alta' ? 'risco de gargalo recorrente em horário de pico e sobrecarga da equipe' : 'desgaste gradual da rotina e queda de eficiência sem ação dirigida'}.`,
          `Decisão recomendada: ${acao} · executar em até ${urg === 'alta' ? '7' : '30'} dias com responsável e meta de indicador definida.`,
        ],
        contexto_setorial: `Tradução de impacto de negócio — ${dom}.`,
      };

    // ── EXECUTAR ────────────────────────────────────────────────────────────
    case 'checklist':
      return {
        itens: [
          { tarefa: `Mapear situação atual de ${dom} (últimas 4-12 semanas) · pronto quando houver baseline numérico`,        responsavel: 'Gestor da área',         prazo: 'Hoje',         prioridade: urg },
          { tarefa: `Conversa de 20 min com equipe de linha de frente sobre ${dom} · pronto quando 3 percepções foram capturadas`, responsavel: 'Gestor',                 prazo: '2 dias',       prioridade: 'alta' },
          { tarefa: `Validar com 2 indicadores adicionais (avaliação pública + ticket médio) · pronto quando ambos checados`,      responsavel: 'Analista',               prazo: '3 dias',       prioridade: 'alta' },
          { tarefa: `Definir responsável formal por ${dom} · pronto quando nome registrado e comunicado`,                        responsavel: 'Liderança',              prazo: '3 dias',       prioridade: 'alta' },
          { tarefa: `Definir KPI semanal de ${dom} com meta numérica · pronto quando estiver no dashboard`,                       responsavel: 'Liderança',              prazo: '5 dias',       prioridade: 'alta' },
          { tarefa: `Executar ${acao} como piloto controlado · pronto quando rodado por 1 semana inteira`,                       responsavel: 'Operação',               prazo: '7-14 dias',    prioridade: urg },
          { tarefa: `Comunicar equipe sobre plano e responsáveis · pronto quando todos souberem prazo e meta`,                  responsavel: 'Gerente operacional',    prazo: '7 dias',       prioridade: 'media' },
          { tarefa: `Ritual semanal de revisão (30 min) por 4 semanas · pronto quando 4 ciclos rodados`,                         responsavel: 'Gestor',                 prazo: 'Semanal',      prioridade: 'media' },
          { tarefa: `Medir resultado preliminar · pronto quando indicador comparado com baseline`,                              responsavel: 'Analista',               prazo: '15 dias',      prioridade: 'media' },
          { tarefa: `Ajustar plano com base no resultado · pronto quando decisão escalar/recuar tomada`,                        responsavel: 'Liderança',              prazo: '30 dias',      prioridade: 'media' },
        ],
      };
    case 'plano':
      return {
        itens: [
          { tarefa: `[Hoje] Diagnóstico rápido de ${dom} (conversa + 2 indicadores)`,                            responsavel: 'Gestor',     prazo: 'Hoje',         prioridade: urg },
          { tarefa: `[Hoje-3d] Definir responsável formal + KPI semanal + meta numérica`,                       responsavel: 'Liderança',  prazo: '3 dias',       prioridade: 'alta' },
          { tarefa: `[7 dias] Execução piloto da ação prioritária (${acao})`,                                   responsavel: 'Operação',   prazo: '7 dias',       prioridade: 'alta' },
          { tarefa: `[7 dias] Comunicação interna do plano (equipe sabe o que, quem, quando)`,                  responsavel: 'Gerente',    prazo: '7 dias',       prioridade: 'media' },
          { tarefa: `[14 dias] Ritual semanal de revisão (30 min) com gestor + liderança`,                      responsavel: 'Gestor',     prazo: '14 dias',      prioridade: 'media' },
          { tarefa: `[14 dias] Primeira medição de KPI vs baseline (decisão: escalar, ajustar ou recuar)`,      responsavel: 'Analista',   prazo: '14 dias',      prioridade: 'alta' },
          { tarefa: `[30 dias] Avaliação completa e decisão de escala`,                                          responsavel: 'Liderança',  prazo: '30 dias',      prioridade: 'alta' },
          { tarefa: `[30 dias] Captura de aprendizado em base interna (memória pra próxima ocorrência)`,        responsavel: 'Gestor',     prazo: '30 dias',      prioridade: 'media' },
        ],
        recomendacao: `Plano em 3 fases — Diagnóstico (até 3 dias) → Execução piloto (até 14 dias) → Avaliação e escala (até 30 dias). Métricas: indicador direto de ${dom}, NPS/avaliação pública, ticket médio. Riscos principais: diagnóstico errado, falta de responsável claro, ritual de revisão pulado.`,
      };
    case 'campanha':
      return {
        paragrafos: [
          `Conceito da campanha: "${dom} em foco" — proposta diferenciada que responde diretamente ao sinal "${titulo}" e cria narrativa local antes dos concorrentes reagirem.`,
          `Público-alvo: clientes recorrentes da unidade (base atual) + público da região no raio relevante (1-3 km). Segmentar por canal: base de WhatsApp pra recorrentes, mídia local + Google Meu Negócio pra novos.`,
          `Mensagem central: simples, direta e ligada a ${dom}. Foco em transformar o sinal detectado em vantagem percebida. Evitar tom corporativo — falar como vizinhos falam.`,
          `Canais sugeridos: (1) WhatsApp da base — alcance imediato; (2) redes sociais locais — orgânico + impulsionado leve; (3) Google Meu Negócio (post + fotos atualizadas); (4) parcerias regionais (comércio próximo); (5) sinalização no ponto físico.`,
          `Variação 1 (curta — WhatsApp): "Você que já é cliente sabe que aqui ${dom} é diferente. [oferta/ação concreta]. Válido até [data]."`,
          `Variação 2 (atrativa — rede social): foco em prova social, mostrar bastidor, valorizar o que já é feito bem em ${dom}.`,
          `Variação 3 (premium — público específico): oferta exclusiva pra base recorrente, mostrando que o esforço extra é reconhecido.`,
          `Ação prática: executar piloto de 14 dias em 1 canal antes de escalar pra todos. Investimento inicial pequeno, mensurável e reversível.`,
          `Métrica: tracking de conversão por canal + variação em ${dom} no período + avaliação pública pós-campanha. Meta inicial: +5% no indicador-chave em 30 dias.`,
        ],
      };
    case 'tarefa':
      return {
        itens: [
          { tarefa: `${acao} · pronto quando indicador de ${dom} for medido e comparado com baseline`, responsavel: 'Gestor da área',     prazo: urg === 'alta' ? 'Hoje' : '7 dias', prioridade: urg },
          { tarefa: `Definir KPI semanal de ${dom} · pronto quando estiver no dashboard com meta clara`,    responsavel: 'Liderança',          prazo: '3 dias',                          prioridade: 'alta' },
          { tarefa: `Alinhar equipe sobre próximos passos · pronto quando todos souberem responsável/prazo`, responsavel: 'Gerente operacional', prazo: '5 dias',                          prioridade: 'media' },
        ],
      };
    case 'delegar':
      return {
        paragrafos: [
          `Delegação responsável e mensurável de ${dom}.`,
          `Área responsável: ${dom} — gestor da área é o ponto único de contato pra essa ação.`,
          `Instrução clara: "${acao}" — executar como piloto controlado, sem expandir escopo até primeira medição.`,
          `Quem acompanha: liderança da unidade em ritual semanal de 30 min, com sponsor sênior pra desbloquear recursos rápido.`,
          `Prazo: ${urg === 'alta' ? 'piloto até o fim desta semana, medição em 14 dias' : 'piloto em 7 dias, medição em 30 dias'}.`,
          `Como medir execução: (1) indicador direto de ${dom} vs baseline; (2) ritual semanal aconteceu; (3) equipe sabe quem é responsável; (4) decisão de escalar/recuar tomada com dados.`,
          `O que entregar de volta: relatório curto com ação executada, medição de resultado, recomendação de escala ou ajuste, captura de aprendizado.`,
        ],
      };
    case 'mensagem':
      return {
        texto_mensagem:
          `📱 VERSÃO WHATSAPP (curta, direta):\n` +
          `Equipe, atenção: ${titulo}. Próximo passo: ${acao}. Urgência ${urg}. Quem tocar avisa hoje.\n\n` +
          `─────────────────────\n\n` +
          `📧 VERSÃO E-MAIL (formal):\n` +
          `Assunto: ${titulo} — ação necessária em ${dom}\n\n` +
          `Time, identificamos um sinal relevante em ${dom}: ${resumo}\n\n` +
          `Próximo passo recomendado: ${acao}\n\n` +
          `Prazo: ${urg === 'alta' ? '7 dias' : '30 dias'} · Urgência: ${urg}\n\n` +
          `Quem assumir a ação, me confirme até o fim do dia pra alinharmos KPI e ritual de revisão.\n\n` +
          `─────────────────────\n\n` +
          `👥 VERSÃO EQUIPE (clara, com contexto):\n` +
          `Pessoal, surgiu algo em ${dom} que vale a gente olhar junto: ${titulo}. ${resumo} O caminho que faz sentido é ${acao}. Não é emergência mas também não é pra empurrar com a barriga. Quem topa puxar?\n\n` +
          `─────────────────────\n\n` +
          `⚡ VERSÃO CURTA (1 linha):\n` +
          `${dom}: ${titulo} → ${acao} (${urg}).\n\n` +
          `─────────────────────\n\n` +
          `💎 VERSÃO PREMIUM (pra cliente/parceiro):\n` +
          `Estamos acompanhando de perto ${dom} na nossa unidade. Identificamos uma oportunidade de melhoria e já iniciamos ${acao} pra garantir que sua experiência continue no nível que você espera.`,
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
          { nome: 'Conservador',  resultado_30d: `+2% em ${dom} · execução parcial, sem ritual semanal`,      resultado_90d: `+5% se mantido o investimento mínimo` },
          { nome: 'Provável',     resultado_30d: `+5% em ${dom} · piloto executado completo com KPI semanal`, resultado_90d: `+12% sustentado, com efeito composto em reputação` },
          { nome: 'Agressivo',    resultado_30d: `+10% em ${dom} · execução intensa + comunicação local forte`, resultado_90d: `+22% sustentado, vantagem competitiva consolidada` },
        ],
        recomendacao: `Riscos por cenário: Conservador (ritual fraco → resultado dilui em 60 dias). Provável (execução média, melhor relação esforço/retorno — recomendado). Agressivo (depende de capacidade de equipe + orçamento, alta variância). Decisão recomendada: cenário Provável como base, com gatilho de escalar pra Agressivo se primeiros 14 dias superarem meta. Métrica de acompanhamento: indicador direto de ${dom} (semanal) + avaliação pública (quinzenal).`,
      };
    case 'validar':
      return {
        paragrafos: [
          `Checklist de sanidade antes de executar "${titulo}".`,
          `Critério 1 — Dados: o sinal de origem está atualizado e cruzado com pelo menos 1 indicador adicional?`,
          `Critério 2 — Iniciativas: existe ação semelhante já em curso na unidade ou em outra unidade da rede?`,
          `Critério 3 — Recursos: orçamento + equipe + tempo disponíveis na janela necessária (${urg === 'alta' ? '7' : '30'} dias)?`,
          `Critério 4 — Retorno: o ganho estimado (5-12% em 60 dias) supera o esforço (2-4 semanas de execução + ritual semanal)?`,
          `Critério 5 — Risco regulatório/imagem: a ação tem alguma exposição jurídica, reputacional ou de marca?`,
          `Critério 6 — Reversibilidade: se der errado, dá pra desfazer rápido sem prejuízo permanente?`,
          `Critério 7 — Alinhamento: liderança e gestor de ${dom} estão de acordo com prazo e meta?`,
          `Perguntas de segurança: o que muda se atrasarmos 30 dias? O que perdemos se não fizermos? O que ganhamos se fizermos certo?`,
          `Decisão: AVANÇAR (se 5+ critérios verdes) · AJUSTAR (se 1-2 critérios amarelos) · ESPERAR (se algum critério vermelho ou falta de dado).`,
        ],
      };
    case 'missao':
      return {
        paragrafos: [
          `Missão operacional gerada a partir de "${titulo}".`,
          `Título da missão: "${titulo}" — tratar como projeto curto com começo, meio e fim claros.`,
          `Objetivo: ${acao}. Resultado esperado: indicador de ${dom} retornar ao baseline ou superar em 30 dias.`,
          `Etapas: (1) Diagnóstico em 3 dias; (2) Piloto em 14 dias; (3) Medição em 21 dias; (4) Decisão de escala em 30 dias.`,
          `Responsável: gestor de ${dom} com sponsor de liderança. Prazo total: ${urg === 'alta' ? '21 dias' : '60 dias'}.`,
          `Recompensa simbólica: reconhecimento público quando indicador retornar ao baseline + captura como case na base interna.`,
          `Evidência de conclusão: relatório de 1 página com baseline, ação executada, resultado medido e aprendizado capturado.`,
          `Status inicial: ABERTA — aguardando confirmação de responsável e definição de KPI.`,
          `Como aparece no painel: missão "${dom}" com prazo ${urg === 'alta' ? '21d' : '60d'} e ícone de urgência ${urg}.`,
        ],
      };

    // ── APRENDER ────────────────────────────────────────────────────────────
    case 'conceito':
      return {
        conceito: `${dom} é o termômetro operacional do negócio nessa área. Quando aparece um sinal aqui, raramente é sobre ${dom} isoladamente — é sobre como a operação como um todo está respondendo a mudanças de mercado e comportamento de cliente.`,
        por_que_importa_para_negocios: card.por_que_importa
          ? `${card.por_que_importa} No nível estratégico, isso afeta a percepção do cliente, a margem operacional e a capacidade da unidade de reagir a movimentos competitivos antes dos pares.`
          : `Esse conceito antecipa problemas maiores e oportunidades de diferenciação. Empresas que dominam essa leitura ganham 2-4 semanas de vantagem competitiva.`,
        exemplos_praticos: [
          `No dia-a-dia operacional: ${dom} aparece em conversas com cliente, variação de avaliação pública e ritmo da equipe — três pistas baratas pra ler cedo.`,
          `Em rede competitiva madura: existe ritual semanal de 30 min revisando ${dom} com KPI definido e responsável formal.`,
          `Erro frequente: tratar ${dom} apenas quando vira problema visível — quando isso acontece, custo de recuperação é 3-5x maior.`,
          `Aplicação prática no caso atual: cruzar "${titulo}" com 2 indicadores em 7 dias, definir responsável e executar ${acao} como piloto.`,
        ],
      };
    case 'exemplo':
      return {
        exemplos_praticos: [
          `Exemplo simples (todo dia): unidade percebeu queda de 3% em ${dom} numa semana, conversou com equipe, identificou causa em 2 dias e ajustou rotina. Indicador voltou ao baseline em 14 dias. Custo: 4 horas de gestor.`,
          `Exemplo intermediário (mensal): rede regional detectou padrão em 3 unidades correlatas, criou playbook de 5 passos, treinou gerentes em 1 hora cada. Em 60 dias, indicador médio subiu 8% e variância caiu 40%.`,
          `Exemplo avançado (estratégico): grupo grande integrou sinais de ${dom} com dados externos (Google, redes sociais, mídia local) e construiu alerta automático. Tempo médio de reação caiu de 30 pra 5 dias.`,
          `Adaptação para o caso atual ("${titulo}"): comece pelo nível simples — diagnóstico rápido + ação focada + medição em 14 dias. Não pule pra avançado sem dominar o básico primeiro.`,
        ],
      };
    case 'referencia':
      return {
        paragrafos: [
          `Referências e boas práticas para aprofundamento em ${dom}.`,
          `Boa prática: empresas referência em ${dom} têm KPI semanal claro + responsável formal + ritual de 30 min de revisão. Sem essas 3 coisas, vira "todo mundo cuida ninguém cuida".`,
          `Referência de mercado: relatórios setoriais (Sebrae, ABIA pra alimentação, Abrasce pra varejo, Anbima pra fintech) costumam ter benchmark anual sobre ${dom} no segmento.`,
          `Aplicação prática: comparar baseline da unidade com mediana do segmento; gap >15% indica oportunidade clara de melhoria.`,
          `Cuidado ao copiar: o que funciona em rede grande pode ser overkill pra unidade única; adaptar protocolo ao tamanho/contexto antes de implementar.`,
          `Onde buscar mais: associação setorial local, cases de unidades comparáveis, conversas com ex-colaboradores de redes maiores que conhecem o ritual.`,
          `Próximo passo: escolher 1 referência simples (não 3 ao mesmo tempo) e adaptar pra o caso atual em ${dom}.`,
        ],
      };
    case 'erro':
      return {
        paragrafos: [
          `Armadilhas frequentes ao tratar sinais de ${dom}.`,
          `Erro 1: agir sem dados de origem. Por que acontece: pressão por resposta rápida. Consequência: solução pra problema errado, esforço desperdiçado. Como evitar: 30 min de validação com 2 indicadores antes de comprometer recursos.`,
          `Erro 2: delegar sem responsável claro. Por que acontece: liderança quer envolver todos. Consequência: "todo mundo cuida ninguém cuida", ação se dilui. Como evitar: 1 nome único formal + sponsor de liderança.`,
          `Erro 3: ignorar a janela de reação. Por que acontece: prioridade é puxada por urgências aparentes. Consequência: oportunidade vira commodity, concorrente ocupa o espaço. Como evitar: rituais semanais com prazo curto.`,
          `Erro 4: ritual semanal pulado nas primeiras semanas. Por que acontece: agenda apertada, parece "perda de tempo". Consequência: piloto sem feedback rápido vira projeto largado. Como evitar: 30 min agendados firmes, sem cancelar.`,
          `Erro 5: medir só impacto final sem checar execução. Consequência: descobre tarde que o problema foi execução, não a tese. Como evitar: medir execução semanalmente (não só resultado mensal).`,
          `Correção prática se já cometeu algum desses: parar a ação atual, refazer diagnóstico em 1 dia, reabrir com responsável formal e KPI claro — perda real é semanas, não meses.`,
        ],
      };
    case 'medir':
      return {
        paragrafos: [
          `Como medir efeito da ação em ${dom} — KPIs, fórmulas e frequência.`,
          `KPI 1 (direto): indicador específico de ${dom} medido semanalmente. Fórmula simples: variação % vs período anterior. Meta inicial: voltar a ${urg === 'alta' ? '+0% em 30d' : '+0% em 60d'} (baseline).`,
          `KPI 2 (reputação): nota Google + sentiment de avaliações públicas. Fórmula: média móvel de 30 dias. Sinal de alerta: queda >0,2★ em 14 dias.`,
          `KPI 3 (operacional): ticket médio + frequência de visita. Fórmula: ticket × visitas/mês. Sinal de alerta: queda >5% no produto dos dois.`,
          `KPI 4 (execução): % de itens do plano executados na semana. Fórmula: itens feitos / itens planejados. Meta: 80%+ nas primeiras 4 semanas.`,
          `Frequência de acompanhamento: KPI 1 e 4 semanalmente em ritual de 30 min; KPI 2 e 3 quinzenalmente.`,
          `Sinal de alerta agregado: se 2+ KPIs piorarem por 2 semanas consecutivas, escalar pra liderança + revisar diagnóstico.`,
          `Meta inicial da semana 1: ter os 4 KPIs no dashboard com baseline definido. Meta da semana 4: 1ª avaliação completa com decisão de escalar/ajustar.`,
        ],
      };
    case 'aula':
      return {
        paragrafos: [
          `📚 AULA RÁPIDA — ${dom} (leitura: 4 min)`,
          `1) CONCEITO. ${dom} é o termômetro operacional dessa área do negócio. Quando aparece um sinal aqui, é a pista mais barata e mais cedo pra detectar mudança real — antes do impacto virar público.`,
          `2) EXEMPLO. "${titulo}" é um sinal típico em ${dom}: parece pequeno, mas em 60-90 dias pode virar problema visível se ignorado. Histórico mostra que unidades que tratam cedo recuperam em 14 dias; quem ignora paga 3-5x mais depois.`,
          `3) APLICAÇÃO. No caso atual: (a) cruze o sinal com 2 indicadores adicionais; (b) defina 1 responsável formal; (c) execute ${acao} como piloto; (d) meça em 14 dias; (e) ajuste ou escale com base no resultado.`,
          `4) ERRO COMUM. Os 3 erros mais frequentes: agir sem validar, delegar sem responsável claro, pular o ritual semanal. Cada um sozinho transforma boa intenção em projeto largado.`,
          `5) EXERCÍCIO PRÁTICO. Nas próximas 24h: (1) abra o card "${titulo}" novamente, (2) escreva em 1 linha qual é a hipótese principal, (3) defina quem seria o responsável se virasse missão, (4) liste 2 indicadores que cruzaria pra validar. Esse exercício custa 10 min e prepara decisão rápida quando voltar ao tema.`,
        ],
      };
    case 'perguntas':
      return {
        paragrafos: [
          `10 perguntas estratégicas para guiar a decisão — categorizadas por dimensão.`,
          `🎯 DECISÃO 1 — Vale tratar este sinal agora ou esperar mais 14 dias pra ver se persiste?`,
          `🎯 DECISÃO 2 — Quem é o responsável formal se virar ação — e essa pessoa tem capacidade hoje?`,
          `⚙️ OPERAÇÃO 1 — Existe ação semelhante já em curso na unidade ou em outra unidade da rede?`,
          `⚙️ OPERAÇÃO 2 — Quanto custa, em horas de equipe e dinheiro, executar a ação prioritária?`,
          `📈 MERCADO 1 — Concorrentes próximos têm mexido em ${dom} nos últimos 30 dias?`,
          `📈 MERCADO 2 — O comportamento do cliente local em ${dom} mudou em comparação com período comparável?`,
          `⚠️ RISCO 1 — O que muda se atrasarmos a ação em 30 dias?`,
          `⚠️ RISCO 2 — Há risco regulatório, reputacional ou de marca em executar?`,
          `💎 OPORTUNIDADE 1 — Se sairmos na frente dos concorrentes em ${dom}, quanto isso vale em 90 dias?`,
          `💎 OPORTUNIDADE 2 — O aprendizado dessa ação serve pra replicar em outras unidades ou outros sinais?`,
        ],
      };
    case 'analogia':
      return {
        paragrafos: [
          `Analogia simples: ${dom} funciona como o painel de um carro — quando uma luz acende, é mais barato verificar agora do que esperar quebrar.`,
          `Explicação da analogia: o sinal detectado é a "luz acendendo" no painel. Ignorar custa mais depois (oficina) do que checar antes (5 minutos de revisão).`,
          `Ligação com o card: "${titulo}" é o equivalente a um aviso amarelo no painel — não é vermelho ainda, mas indica algo concreto a observar nos próximos dias.`,
          `Conclusão prática: tratar agora custa minutos da equipe; tratar depois pode custar dias de operação, reputação e clientes perdidos.`,
        ],
      };
    case 'nivel':
      return {
        paragrafos: [
          `Empresa básica em ${dom}: trata reativamente, apenas quando o cliente reclama ou o indicador despenca de forma visível.`,
          `Empresa madura em ${dom}: monitora semanalmente com KPI definido, age em desvios moderados antes do impacto público.`,
          `Empresa excelente em ${dom}: cruza com sinais externos (concorrência, mercado, sazonalidade) e age preventivamente com alerta automatizado.`,
          `Próximo passo recomendado: subir um nível — definir KPI semanal de ${dom}, criar ritual quinzenal de revisão com gestor responsável e meta numérica clara.`,
        ],
      };
    case 'memoria':
      return {
        paragrafos: [
          `Aprendizado principal: sinais em ${dom} antecipam impacto em vendas e reputação quando ignorados por mais de 30 dias.`,
          `Regra de decisão: ao ver ${dom} com urgência ${urg}, ${urg === 'alta' ? 'agir em até 7 dias com responsável definido' : 'agendar revisão em 14 dias com KPI claro'}.`,
          `Quando lembrar disso: sempre que aparecer novo sinal em ${dom} ou domínios correlatos (atendimento, reputação, conversão, ticket médio).`,
          `Como aplicar no futuro: cruzar este aprendizado com o próximo sinal similar e medir se o efeito previsto se confirma — ajustar a regra conforme.`,
          `Frase de referência: "${titulo}" → ${acao}.`,
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
  const urg = card.urgencia || 'media';
  const acao = card.o_que_fazer || 'definir próximo passo';
  const janela = urg === 'alta' ? '48 a 72 horas' : urg === 'media' ? '2 semanas' : '30 dias';

  const o_que_aconteceu = card.resumo
    ? `${card.resumo} O sinal aparece em ${dom} e foi identificado a partir do cruzamento de indicadores operacionais e de mercado. Não é ruído isolado — vale tratar como ponto de atenção real.`
    : `Detectamos um sinal relevante em ${dom}: "${card.titulo}". Trata-se de uma variação que merece atenção nos próximos dias, com base no cruzamento de indicadores internos e externos.`;

  const por_que_importa = card.por_que_importa
    ? `${card.por_que_importa} Em prática, isso afeta a forma como o cliente percebe a unidade e como a operação reage a mudanças. Ignorar abre espaço pra concorrentes consolidarem posição na região.`
    : `Esse tipo de sinal afeta diretamente a percepção do cliente local, a operação cotidiana e a competitividade da unidade. Empresas que leem cedo ganham 2-4 semanas de vantagem; quem reage tarde paga mais pra recuperar.`;

  const onde_afeta = card.onde_afeta
    ? `${card.onde_afeta} Efeito direto em ${dom} e secundário em atendimento, conversão e reputação pública. Indicadores correlatos costumam mover juntos nas próximas semanas.`
    : `Principalmente em ${dom}, com efeito secundário em atendimento ao cliente, conversão de novos visitantes e reputação pública (Google, redes sociais, delivery). Esses indicadores costumam mover-se juntos quando há sinal nessa área.`;

  const risco = urg === 'alta'
    ? `Alto — exige reação rápida. Concorrentes podem capturar demanda em ${janela}, e cada semana sem ação multiplica o esforço de recuperação depois. Impacto provável: queda de 8 a 15% no indicador-chave em 60 dias se nada for feito.`
    : urg === 'media'
      ? `Moderado — vale monitorar evolução nos próximos dias. Risco maior é normalizar a piora gradualmente e perder a janela de reação barata. Impacto provável: queda de 3 a 7% em 60 dias se persistir.`
      : `Baixo — manter sob acompanhamento periódico. Risco principal é deixar o sinal sair do radar e descobrir tarde quando virar problema visível. Custo de monitorar é mínimo, vale manter no painel semanal.`;

  const oportunidade = `Reagir antes dos concorrentes pode reposicionar a unidade como referência em ${dom} na região. A janela típica dura ${janela}: depois disso, pares copiam ou o sinal vira commodity. Investimento pequeno hoje rende efeito composto em 60-90 dias se sustentado.`;

  const acao_recomendada = card.o_que_fazer
    ? `${card.o_que_fazer} Executar com responsável definido, indicador semanal e meta numérica clara. Sem essas três coisas, vira "intenção" e não ação. Começar pela validação mais barata antes de comprometer recursos.`
    : `Revisar o contexto rapidamente, definir 1 responsável claro, escolher 1 indicador semanal de ${dom} com meta numérica, e executar piloto em ${janela}. Antes de plano grande, validar com 2 indicadores cruzados.`;

  const proximo_passo = `1) Use os atalhos abaixo (Entender melhor / Criar checklist / Gerar mensagem / Ver exemplos / Simular impacto) pra aprofundar. 2) Decidir nos próximos 3 dias se vira ação ou monitoramento. 3) Se virar ação, definir responsável e KPI antes do fim da semana. 4) Revisar em ${urg === 'alta' ? '14' : '30'} dias.`;
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
  const janela = urg === 'alta' ? '48 a 72 horas' : urg === 'media' ? '2 semanas' : '30 dias';
  let result: Record<string, unknown>;
  if (mode === 'pesquisar') {
    result = {
      leitura_inicial:     `O sinal "${titulo}" indica movimento concreto em ${dom}, com urgência ${urg}. Não é ruído isolado — combinado com indicadores correlatos, sugere mudança em curso que pede atenção nas próximas ${janela}.`,
      resumo_sinal:        `${resumo} O dado por trás disso normalmente vem da combinação de comportamento de cliente, movimento de concorrentes e variação interna de operação em ${dom}.`,
      por_que_importa:     card.por_que_importa
        ? `${card.por_que_importa} Ignorar significa abrir espaço pra concorrentes locais consolidarem posição enquanto o problema cresce.`
        : `Esse sinal toca diretamente ${dom} e pode antecipar mudanças mais amplas. Se a unidade tratar antes dos pares, ganha 2-4 semanas de vantagem competitiva. Se não tratar, perde terreno em janela curta.`,
      pode_estar_por_tras: `Variações em ${dom} costumam refletir três vetores: (1) mudança no comportamento do cliente local, (2) movimento de concorrente próximo, (3) ajuste interno de operação ou equipe. Identificar qual vetor predomina é o primeiro filtro pra decisão.`,
      risco_ignorar:       urg === 'alta'
        ? `Alto — concorrentes podem capturar terreno em ${janela}. Custo de inação tende a crescer exponencialmente: cada semana sem reação multiplica o esforço de recuperação depois.`
        : urg === 'media'
          ? `Moderado — erosão gradual de indicador-chave em 60 dias se sem ação. Risco maior é normalizar a piora e perder a janela de reação barata.`
          : `Baixo — manter sob acompanhamento periódico. Risco principal é deixar o sinal sair do radar e descobrir tarde quando virar problema visível.`,
      oportunidade_agir:   `Reagir antes dos pares posiciona ${dom} como referência local. Janela típica de oportunidade dura ${janela}: depois disso, concorrentes copiam ou o sinal vira commodity. Investimento pequeno hoje rende efeito composto em 60-90 dias.`,
      observar_agora:      `Indicador direto de ${dom} (medição semanal), variação de avaliação pública (Google/iFood), comportamento de concorrentes próximos (mídia local + posts orgânicos), feedback qualitativo da equipe de linha de frente. Cruzar pelo menos 2 desses nos próximos ${urg === 'alta' ? '7' : '30'} dias.`,
      impacto_negocio:     `Em vendas: efeito direto em ticket médio e frequência se sem ação. Em reputação: cada 0,1★ no Google representa ~7% em conversão de novos clientes. Em operação: pressão crescente sobre rotina e clima de equipe. Em margem: ${urg === 'alta' ? '2-4 pontos percentuais' : '1-2 pontos'} de pressão se persistir.`,
      hipotese:            `Hipótese principal: ${resumo} reflete movimento real do mercado em ${dom}, com janela curta de reação. Hipótese alternativa: pode ser flutuação sazonal ou ruído de medição — vale confirmar com 1-2 indicadores adicionais antes de decisão grande.`,
      proximo_passo:       `1) Validar hipótese cruzando com 2 indicadores adicionais em 7 dias. 2) Se confirmada, executar ${acao}. 3) Definir KPI semanal de ${dom} com meta numérica. 4) Marcar revisão em ${urg === 'alta' ? '14' : '30'} dias com gestor responsável.`,
    };
  } else if (mode === 'executar') {
    result = {
      objetivo:        `Transformar o sinal "${titulo}" em ação operacional concreta em ${dom}, com indicador mensurável, responsável definido e prazo curto. Saída esperada: indicador de ${dom} retornar ao nível-base ou superar em até 30 dias.`,
      diagnostico:     `Situação atual: ${resumo} Sintoma principal em ${dom}. Causas prováveis: (a) movimento competitivo, (b) gap operacional interno, (c) mudança no comportamento do cliente. Antes de agir, confirmar qual causa predomina — dispara decisão diferente em cada caso.`,
      primeiro_passo:  `${acao} — começar pela validação mais barata (uma conversa com a equipe de linha de frente + checagem de 1 indicador objetivo). Custa 30 min, evita executar plano errado.`,
      plano_inicial:   `Fase 1 (esta semana): diagnóstico + definição de responsável + indicador-chave. Fase 2 (próximas 2 semanas): execução piloto da ação prioritária. Fase 3 (semana 4): medição, ajuste e decisão de escalar ou recuar.`,
      quem_executa:    `Gestor responsável por ${dom}, com sponsor de liderança pra desbloquear recursos rapidamente. Equipe de execução: 2-3 pessoas focadas, não diluído entre vários. Quem acompanha: liderança da unidade em ritual semanal de 30 min.`,
      prazo:           urg === 'alta'
        ? `Primeiro passo hoje. Execução piloto até o fim da semana. Medição em 14 dias. Decisão de escalar/recuar em 30 dias.`
        : `Diagnóstico em 3 dias. Piloto em 2 semanas. Medição em 30 dias. Próximo ciclo em 60 dias.`,
      risco_antes:     `Verificar: (1) há iniciativa semelhante já em curso? (2) orçamento e equipe disponíveis? (3) ação tem risco regulatório ou de imagem? (4) o ganho esperado supera o esforço? Se algum item bloquear, ajustar plano antes de começar.`,
      criterio_sucesso:`KPI 1: indicador direto de ${dom} retornar ao baseline ou superar em 30 dias. KPI 2: NPS/nota pública estável ou em alta. KPI 3: ticket médio sem queda. Meta inicial: ${urg === 'alta' ? '+5% em 30d' : '+3% em 60d'} no indicador-chave.`,
      plano_b:         `Se piloto não der resultado em 14 dias: revisar diagnóstico (causa estava errada). Se concorrente reagir antes: acelerar timing e ajustar mensagem. Se equipe não conseguir executar: redefinir escopo menor ou trazer apoio externo. Em todos os casos, evitar dobrar aposta sem dados novos.`,
      proximo_passo:   `Hoje: marcar conversa de 30 min com gestor de ${dom}. Esta semana: definir responsável formal + indicador-chave + meta. Próximas 2 semanas: piloto. Daqui a 30 dias: revisão de resultado.`,
    };
  } else {
    result = {
      conceito:           `${dom} é o termômetro operacional do negócio nessa área. Quando um sinal aparece em ${dom}, raramente é sobre ${dom} isoladamente — é sobre como a operação como um todo está respondendo a mudanças. Tratar bem aqui evita problemas em cascata.`,
      explicacao_simples: `Pense em ${dom} como um indicador de saúde da operação: se algo está fora do esperado, é a primeira pista de que algo maior pode estar mudando. Ler esse sinal cedo é mais barato e mais inteligente do que reagir tarde quando o impacto já está visível.`,
      por_que_negocio:    card.por_que_importa
        ? `${card.por_que_importa} No nível estratégico, isso afeta a percepção do cliente, a margem operacional e a capacidade da unidade de reagir a movimentos competitivos.`
        : `Sinais como este antecipam problemas maiores e oportunidades de diferenciação. Empresas que aprendem a ler isso ganham 2-4 semanas de vantagem sobre concorrentes que só reagem quando o impacto é público.`,
      exemplo:            `Caso A: unidade comparável do setor reagiu a sinal similar em ${dom} com ${acao} e recuperou indicador em 45 dias. Caso B: rede regional ignorou sinal parecido por 90 dias e perdeu 12% de fluxo orgânico que custou 6 meses pra recuperar. Padrão: agir cedo custa pouco, agir tarde custa muito.`,
      erro_comum:         `Três erros típicos: (1) agir antes de confirmar a causa raiz — gasta energia em solução errada; (2) delegar sem responsável claro — vira "todo mundo cuida ninguém cuida"; (3) ignorar a janela de reação adequada — toma decisão tarde demais quando o ganho já evaporou.`,
      como_medir:         `KPI principal: indicador direto de ${dom} (medição semanal). KPI de suporte: avaliação pública (Google/iFood/redes sociais). KPI de impacto: ticket médio + frequência. Revisar a cada 7-14 dias nas primeiras 4 semanas, depois quinzenal.`,
      empresa_madura:     `Empresa madura em ${dom} tem ritual semanal de 30 min revisando o indicador, com responsável formal e meta numérica. Quando um sinal aparece, há protocolo de resposta em 48h. Aprendizado é capturado em base interna pra repetir resposta na próxima vez.`,
      aplicar_caso:       `No caso de "${titulo}": (1) cruze o sinal com 2 indicadores adicionais nos próximos 7 dias; (2) defina responsável e meta; (3) execute ${acao} como ação piloto; (4) meça em 30 dias; (5) capture aprendizado pra próxima ocorrência similar.`,
      proximo_nivel:      `Subir de nível significa sair de reação manual pra resposta proativa: cruzar este sinal automaticamente com indicadores externos (concorrência, mercado, sazonalidade), antecipar com 14-30 dias de folga, e ter playbook documentado por tipo de sinal em ${dom}.`,
      regra_lembrar:      `Quando vir novo sinal em ${dom} com urgência ${urg}, ${urg === 'alta' ? 'agir em até 7 dias com responsável definido' : 'agendar revisão em 14 dias com KPI claro'}. Cruzar sempre com 2 indicadores antes de decisão grande. Capturar resultado pra base de aprendizado: "${titulo}" → ${acao}.`,
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
  const chipBase = "flex items-center justify-center gap-1.5 h-9 rounded-xl border-[0.5px] transition-all duration-150 active:scale-[0.97] cursor-pointer disabled:cursor-default disabled:opacity-100 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)]";
  return (
    <div className="flex flex-col gap-1.5">
      {/* Área de Trabalho — toggle dos 3 modos */}
      <button
        type="button"
        onClick={onWorkspaceClick}
        disabled={disabled}
        className={`${chipBase} w-full !h-11 ${workspaceOpen
          ? 'bg-[#f7f8f9] dark:bg-[#2f2f2f] border-neutral-200 dark:border-[#3d3d3d]'
          : 'bg-[#f7f8f9] dark:bg-[#2f2f2f] border-neutral-200 dark:border-[#3d3d3d] hover:bg-neutral-200 dark:hover:bg-[#353535]'}`}
      >
        <span className="text-[10px] lg:text-sm text-neutral-500 dark:text-white font-medium whitespace-nowrap">Área de Trabalho</span>
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
                  className={`${chipBase} !h-11 ${isActive
                    ? 'bg-[#3b82f6] border-[#3b82f6]'
                    : 'bg-[#f7f8f9] dark:bg-[#2f2f2f] border-neutral-200 dark:border-[#3d3d3d] hover:bg-neutral-200 dark:hover:bg-[#353535]'}`}
                >
                  <btn.Icon size={12} className={isActive ? 'text-white' : 'text-neutral-400 dark:text-white'} />
                  <span className={`text-[10px] lg:text-sm font-medium whitespace-nowrap ${isActive ? 'text-white' : 'text-neutral-500 dark:text-white'}`}>{btn.label}</span>
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

function ChatBody({ onClose, showClose, workspaceContext, activeSector, onArchive, chatHistoryOpen, archivedSessions, onSelectHistorySession }: { onClose?: () => void; showClose?: boolean; workspaceContext?: WorkspaceContext | null; activeSector?: string; onArchive?: (cardTitle: string, sector: string, snapshot: { messages: Message[]; activeCard: IntelligenceCard | null; activeMode: MainKey | null }) => void; chatHistoryOpen?: boolean; archivedSessions?: Array<{ id: string; ts: number; cardTitle: string; sector: string; snapshot?: { messages: Message[]; activeCard: IntelligenceCard | null; activeMode: MainKey | null } }>; onSelectHistorySession?: (id: string) => void }) {
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
    // Se está aberto e vai recolher: arquiva sessão atual + limpa container
    if (workspaceOpen && activeCard && messages.length > 0) {
      onArchive?.(activeCard.titulo, activeSector ?? 'os1', { messages, activeCard, activeMode });
      setMessages([]);
      setActiveCard(null);
      setActiveMode(null);
      lastCardIdRef.current = null;
      setActionLoading(null);
    }
    setWorkspaceOpen(prev => !prev);
  }

  // Restaura uma sessão arquivada — chamado quando user clica num item da lista de histórico.
  const restoreSession = (s: { messages: Message[]; activeCard: IntelligenceCard | null; activeMode: MainKey | null }) => {
    setMessages(s.messages);
    setActiveCard(s.activeCard);
    setActiveMode(s.activeMode);
    if (s.activeCard) lastCardIdRef.current = s.activeCard.id;
    setWorkspaceOpen(true);
  };

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

  // Quando histórico está aberto, mostra apenas a lista de conversas arquivadas
  if (chatHistoryOpen) {
    return (
      <div className="flex flex-col h-full overflow-y-auto px-4 py-4 gap-2">
        {(!archivedSessions || archivedSessions.length === 0) ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-8">Nenhuma conversa anterior.</p>
        ) : (
          [...archivedSessions].reverse().map(s => (
            <button
              key={s.id}
              onClick={() => {
                if (s.snapshot) restoreSession(s.snapshot);
                onSelectHistorySession?.(s.id);
              }}
              className="text-left px-4 py-3 rounded-xl bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)] hover:bg-[#e4e7ea] dark:hover:bg-[#353535] transition-colors duration-150 cursor-pointer active:scale-[0.99]"
            >
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate">{s.cardTitle}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{new Date(s.ts).toLocaleString('pt-BR')} · {s.sector}</p>
            </button>
          ))
        )}
      </div>
    );
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
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 space-y-3">
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
                <div className="max-w-[92%] w-full p-3.5 rounded-2xl bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)]">
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
                <div className="max-w-[94%] w-full rounded-2xl bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)] overflow-hidden">
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
            <div className="bg-[#f7f8f9] dark:bg-[#2f2f2f] rounded-2xl border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)] px-4 py-3 flex items-center gap-1">
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
  onShowHistory?: () => void;
  chatHistoryOpen?: boolean;
  archivedSessions?: Array<{ id: string; ts: number; cardTitle: string; sector: string; snapshot?: { messages: Message[]; activeCard: IntelligenceCard | null; activeMode: MainKey | null } }>;
  onSelectHistorySession?: (id: string) => void;
  onArchive?: (cardTitle: string, sector: string, snapshot: { messages: Message[]; activeCard: IntelligenceCard | null; activeMode: MainKey | null }) => void;
}

export function ChatDesktop({ wide, onSector, onBrowser, onDifficulty, activeSector, workspaceContext, dark, onToggleTheme, onShowHistory, chatHistoryOpen, archivedSessions, onSelectHistorySession, onArchive }: ChatDesktopProps) {
  const btnCls = "cursor-pointer text-neutral-500 dark:text-neutral-300 p-2 rounded-full bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_4px_10px_-1px_rgba(0,0,0,0.22),0_1px_3px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.6)] dark:shadow-[0_4px_10px_-1px_rgba(0,0,0,0.55),0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.04)] hover:bg-[#e4e7ea] dark:hover:bg-[#353535] hover:text-neutral-800 dark:hover:text-white transition-all duration-200 active:scale-90";
  return (
    <div
      style={{ width: wide ? 'calc(50vw - 16px)' : '380px', transition: 'width 500ms cubic-bezier(0.25,0.1,0.25,1)' }}
      className="fixed top-[92px] right-4 bottom-4 z-[40] hidden lg:flex flex-col bg-[#f0f2f4] dark:bg-[#323232] border-[0.5px] border-neutral-100 dark:border-[#414141] rounded-2xl overflow-hidden shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)]"
    >
      {/* Header com ícones — ordem: Plus / Globe / Settings / Sun-Moon / Bell */}
      <div className="px-4 pt-4 pb-3 flex-shrink-0">
      <div className="flex items-center justify-between gap-3 px-3 py-3 bg-[#f0f2f4] dark:bg-[#323232] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] rounded-xl shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)]">
        <button onClick={onSector} className={`${btnCls} relative`} title="Trocar feed por área">
          <Plus size={22} className={activeSector && activeSector !== 'geral' ? 'text-[#3b82f6]' : ''} />
          {activeSector && activeSector !== 'geral' && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
          )}
        </button>
        <button onClick={onBrowser} className={btnCls} title="Sincronizar">
          <Globe size={22} />
        </button>
        <label className={`${btnCls} relative`} title="Enviar arquivo">
          <Upload size={22} />
          <input type="file" className="hidden" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) alert(`Arquivo selecionado: ${f.name}`);
            e.currentTarget.value = '';
          }} />
        </label>
        <button onClick={onDifficulty} className={btnCls} title="Dificuldade">
          <Settings2 size={22} />
        </button>
        <button onClick={() => onShowHistory?.()} className={btnCls} title="Conversas anteriores">
          <History size={22} />
        </button>
        <button className={btnCls} title="Notificações">
          <Bell size={22} />
        </button>
      </div>
      </div>
      <div className="flex-1 min-h-0">
        <ChatBody workspaceContext={workspaceContext} activeSector={activeSector} onArchive={onArchive} chatHistoryOpen={chatHistoryOpen} archivedSessions={archivedSessions} onSelectHistorySession={onSelectHistorySession} />
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
  dark, onToggleTheme, onShowHistory, chatHistoryOpen, archivedSessions, onSelectHistorySession, onArchive,
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
  onShowHistory?: () => void;
  chatHistoryOpen?: boolean;
  archivedSessions?: Array<{ id: string; ts: number; cardTitle: string; sector: string; snapshot?: { messages: Message[]; activeCard: IntelligenceCard | null; activeMode: MainKey | null } }>;
  onSelectHistorySession?: (id: string) => void;
  onArchive?: (cardTitle: string, sector: string, snapshot: { messages: Message[]; activeCard: IntelligenceCard | null; activeMode: MainKey | null }) => void;
}) {
  const btnCls = "cursor-pointer text-neutral-500 dark:text-neutral-300 p-2 rounded-full bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_4px_10px_-1px_rgba(0,0,0,0.22),0_1px_3px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.6)] dark:shadow-[0_4px_10px_-1px_rgba(0,0,0,0.55),0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.04)] hover:bg-[#e4e7ea] dark:hover:bg-[#353535] hover:text-neutral-800 dark:hover:text-white transition-all duration-200 active:scale-90";
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
          {/* Header com ícones — ordem: Plus / Globe / Settings / Sun-Moon / Bell / X */}
          <div className="px-4 pt-4 pb-3 flex-shrink-0">
          <div className="flex items-center justify-between gap-2 px-3 py-3 bg-[#f0f2f4] dark:bg-[#323232] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] rounded-xl shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)]">
            <button onClick={onSector} className={`${btnCls} relative`} title="Trocar feed por área">
              <Plus size={22} className={activeSector && activeSector !== 'geral' ? 'text-[#3b82f6]' : ''} />
              {activeSector && activeSector !== 'geral' && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
              )}
            </button>
            <button onClick={onBrowser} className={btnCls} title="Sincronizar">
              <Globe size={22} />
            </button>
            <label className={`${btnCls} relative`} title="Enviar arquivo">
              <Upload size={22} />
              <input type="file" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) alert(`Arquivo selecionado: ${f.name}`);
                e.currentTarget.value = '';
              }} />
            </label>
            <button onClick={onDifficulty} className={btnCls} title="Dificuldade">
              <Settings2 size={22} />
            </button>
            <button onClick={() => onShowHistory?.()} className={btnCls} title="Conversas anteriores">
              <History size={22} />
            </button>
            <button className={`${btnCls} relative`} title="Notificações">
              <Bell size={22} />
              {(unreadCount ?? 0) > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            <button onClick={onClose} className={btnCls} title="Fechar">
              <X size={20} />
            </button>
          </div>
          </div>
          <div className="flex-1 min-h-0">
            <ChatBody workspaceContext={workspaceContext} activeSector={activeSector} onArchive={onArchive} chatHistoryOpen={chatHistoryOpen} archivedSessions={archivedSessions} onSelectHistorySession={onSelectHistorySession} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
