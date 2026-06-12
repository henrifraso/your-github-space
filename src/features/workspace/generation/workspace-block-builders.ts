// Builders de blocos da Área de Trabalho.
//
// Cada `buildXBlock(card, ...)` cria um WorkspaceBlock pronto pra
// entrar na timeline do ChatBody. Hoje 100% local; mantém shape
// estável pra futuras integrações backend/LLM.
//
// Também vive aqui o `shortcutsForCard(card)` (atalhos contextuais
// por domínio) e o `buildBlockShortcuts(block)` (atalhos derivados
// do bloco gerado).
//
// Conteúdo movido de src/components/ChatPanel.tsx (Fase 10) byte-a-byte.
// Nenhum texto, label, chave, ordem ou ID foi alterado.

import type { IntelligenceCard } from '../../../core/types/card';
import type { CompanyDiagnosticPayload } from '../../../core/types/workspace';
import type {
  Dificuldade,
  LocalShortcut,
  MainKey,
  WorkspaceBlock,
} from './workspace-generation';
import { MODE_TITLES } from './workspace-generation';
import { buildFallbackForSub } from './workspace-mode-generators';

// Visual entity IDs (brand slugs like 'nike') and technical area slugs
// ('relatorio-sessao', etc.) must not appear in narrative prose as if they
// were operational domains. narDom() replaces them with a neutral label.
const ENTITY_AND_TECH_IDS = new Set([
  'nike', 'mcdonalds', 'nubank', 'os1',
  'relatorio-sessao', 'dossie', 'comparacao', 'leitura-setor',
]);
function narDom(card: IntelligenceCard): string {
  const raw = (card.area || card.dominio || '').toLowerCase().trim();
  if (!raw) return 'área de operação';
  if (ENTITY_AND_TECH_IDS.has(raw)) return 'análise externa';
  return raw;
}

export function shortcutsForCard(card: IntelligenceCard): LocalShortcut[] {
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
export function buildInitialBlock(card: IntelligenceCard, difficulty: Dificuldade): WorkspaceBlock {
  const dom = narDom(card);
  const urg = card.urgencia || 'media';
  const acao = card.o_que_fazer || 'definir próximo passo';
  const janela = urg === 'alta' ? '48 a 72 horas' : urg === 'media' ? '2 semanas' : '30 dias';
  // F6b: cards de hipótese ganham variante editorial conservadora —
  // sem percentual inventado, sem prazo arbitrário, sem previsão forte.
  const isHyp = card.isHypothesis === true;

  const o_que_aconteceu = card.resumo
    ? (isHyp
        ? `${card.resumo} Trate como hipótese a validar com indicadores próprios — ainda não é leitura medida.`
        : `${card.resumo} O sinal aparece em ${dom} e foi identificado a partir do cruzamento de indicadores operacionais e de mercado. Não é ruído isolado — vale tratar como ponto de atenção real.`)
    : (isHyp
        ? `Hipótese em ${dom}: "${card.titulo}". Tema com dado interno ainda pendente — vale acompanhar antes de qualquer conclusão.`
        : `Detectamos um sinal relevante em ${dom}: "${card.titulo}". Trata-se de uma variação que merece atenção nos próximos dias, com base no cruzamento de indicadores internos e externos.`);

  const por_que_importa = card.por_que_importa
    ? (isHyp
        ? `${card.por_que_importa} Por ser hipótese, o foco é validar o tema com indicador simples antes de comprometer recursos.`
        : `${card.por_que_importa} Em prática, isso afeta a forma como o cliente percebe a unidade e como a operação reage a mudanças. Ignorar abre espaço pra concorrentes consolidarem posição na região.`)
    : (isHyp
        ? `Tema relevante para ${dom}, mas ainda depende de validação com dado interno antes de virar ação ampla.`
        : `Esse tipo de sinal afeta diretamente a percepção do cliente local, a operação cotidiana e a competitividade da unidade. Empresas que leem cedo ganham 2-4 semanas de vantagem; quem reage tarde paga mais pra recuperar.`);

  const onde_afeta = card.onde_afeta
    ? `${card.onde_afeta} Efeito direto em ${dom} e secundário em atendimento, conversão e reputação pública. Indicadores correlatos costumam mover juntos nas próximas semanas.`
    : `Principalmente em ${dom}, com efeito secundário em atendimento ao cliente, conversão de novos visitantes e reputação pública (Google, redes sociais, delivery). Esses indicadores costumam mover-se juntos quando há sinal nessa área.`;

  const risco = isHyp
    ? `Sem dado medido, não estimar impacto numérico. O risco editorial aqui é tratar a hipótese como fato — vale manter como monitoramento até a primeira leitura interna confirmar ou descartar.`
    : (urg === 'alta'
        ? `Alto — exige reação rápida. Concorrentes podem capturar demanda em ${janela}, e cada semana sem ação multiplica o esforço de recuperação depois. Impacto provável: queda de 8 a 15% no indicador-chave em 60 dias se nada for feito.`
        : urg === 'media'
          ? `Moderado — vale monitorar evolução nos próximos dias. Risco maior é normalizar a piora gradualmente e perder a janela de reação barata. Impacto provável: queda de 3 a 7% em 60 dias se persistir.`
          : `Baixo — manter sob acompanhamento periódico. Risco principal é deixar o sinal sair do radar e descobrir tarde quando virar problema visível. Custo de monitorar é mínimo, vale manter no painel semanal.`);

  const oportunidade = isHyp
    ? `Se a hipótese se confirmar com dado interno, abre espaço para uma decisão melhor calibrada em ${dom}. Por ora, ganho está em definir baseline antes de executar plano amplo.`
    : `Reagir antes dos concorrentes pode reposicionar a unidade como referência em ${dom} na região. A janela típica dura ${janela}: depois disso, pares copiam ou o sinal vira commodity. Investimento pequeno hoje rende efeito composto em 60-90 dias se sustentado.`;

  const acao_recomendada = card.o_que_fazer
    ? (isHyp
        ? `${card.o_que_fazer} Comece pela validação mais simples possível — 1 indicador, 1 responsável, sem comprometer recursos antes da leitura inicial.`
        : `${card.o_que_fazer} Executar com responsável definido, indicador semanal e meta numérica clara. Sem essas três coisas, vira "intenção" e não ação. Começar pela validação mais barata antes de comprometer recursos.`)
    : (isHyp
        ? `Definir 1 indicador simples para validar a hipótese em ${dom}, com 1 responsável e prazo curto de leitura. Plano amplo só depois da confirmação.`
        : `Revisar o contexto rapidamente, definir 1 responsável claro, escolher 1 indicador semanal de ${dom} com meta numérica, e executar piloto em ${janela}. Antes de plano grande, validar com 2 indicadores cruzados.`);

  const proximo_passo = isHyp
    ? `1) Use os atalhos abaixo para aprofundar o tema. 2) Definir 1 indicador interno para checar a hipótese. 3) Atribuir responsável pela leitura. 4) Revisar quando a primeira medição estiver disponível.`
    : `1) Use os atalhos abaixo (Entender melhor / Criar checklist / Gerar mensagem / Ver exemplos / Simular impacto) pra aprofundar. 2) Decidir nos próximos 3 dias se vira ação ou monitoramento. 3) Se virar ação, definir responsável e KPI antes do fim da semana. 4) Revisar em ${urg === 'alta' ? '14' : '30'} dias.`;
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

// Bloco de Diagnóstico da empresa — gerado quando "Analisar minha empresa"
// é chamado a partir da Esfera. Renderizado como conteúdo estruturado
// (resumo / áreas fortes / lacunas / riscos / oportunidades / próximos passos)
// dentro do ChatPanel — NÃO abre overlay nem cobre o feed.
export function buildDiagnosticBlock(card: IntelligenceCard, payload: CompanyDiagnosticPayload, difficulty: Dificuldade): WorkspaceBlock {
  return {
    id:         `blk-diag-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    cardId:     card.id,
    mode:       'pesquisar',
    subKey:     'diagnostico',
    subLabel:   'Diagnóstico da empresa',
    endpoint:   null,
    result:     payload as unknown as Record<string, unknown>,
    difficulty,
    pinned:     false,
    createdAt:  new Date().toISOString(),
    kind:       'diagnostico',
  };
}

// Bloco com opções de compartilhamento (intent === 'compartilhar').
export function buildShareBlock(card: IntelligenceCard, difficulty: Dificuldade): WorkspaceBlock {
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
export function buildBlockShortcuts(block: WorkspaceBlock): LocalShortcut[] {
  const m = block.mode;
  const s = block.subKey;
  const mk = (label: string, mode: MainKey, subKey: string, suffix: string): LocalShortcut =>
    ({ id: `bsc-${block.id}-${suffix}`, kind: 'local', label, mode, subKey });

  // ── EXECUTAR — atalhos por sub ────────────────────────────────────────────
  if (s === 'checklist') return [
    // C1-A: subKey alinhada à key canônica nova ('rascunho') de SUB_BTNS.executar.
    mk('Rascunho de execução',          'executar',  'rascunho',  '1'),
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
    // C1-A: subKey alinhada à key canônica nova ('rascunho').
    mk('Rascunho de execução',          'executar',  'rascunho',  '4'),
    mk('Compartilhar tarefa',           'executar',  'mensagem',  '5'),
  ];
  if (s === 'simular' || s === 'validar') return [
    mk('Plano para melhor cenário',     'executar',  'plano',     '1'),
    mk('Riscos do pior cenário',        'pesquisar', 'risco',     '2'),
    mk('Comparar cenários',             'pesquisar', 'comparar',  '3'),
    // C1-A: subKey alinhada à key canônica nova ('rascunho').
    mk('Transformar em decisão',        'executar',  'rascunho',  '4'),
    mk('Checklist de validação',        'executar',  'checklist', '5'),
  ];
  // C1-A: 'rascunho' é a key canônica; 'missao' mantido por 1 release
  // pra compat com blocos restaurados de sessão antiga.
  if (s === 'rascunho' || s === 'missao') return [
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
    // C1-A: subKey alinhada à key canônica nova ('rascunho').
    mk('Rascunho de execução',          'executar',  'rascunho',  '4'),
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
export function buildModeBlock(card: IntelligenceCard, mode: MainKey, difficulty: Dificuldade): WorkspaceBlock {
  const dom = narDom(card);
  const titulo = card.titulo;
  const resumo = card.resumo || titulo;
  const urg = card.urgencia || 'media';
  const acao = card.o_que_fazer || 'definir próximo passo';
  const janela = urg === 'alta' ? '48 a 72 horas' : urg === 'media' ? '2 semanas' : '30 dias';
  // F6b: cards de hipótese ganham variante editorial conservadora.
  const isHyp = card.isHypothesis === true;
  let result: Record<string, unknown>;
  if (mode === 'pesquisar') {
    result = {
      leitura_inicial:     isHyp
        ? `O tema "${titulo}" é hipótese a validar em ${dom}. Não tratar como leitura medida — ainda depende de dado interno antes de qualquer conclusão.`
        : `O sinal "${titulo}" indica movimento concreto em ${dom}, com urgência ${urg}. Não é ruído isolado — combinado com indicadores correlatos, sugere mudança em curso que pede atenção nas próximas ${janela}.`,
      resumo_sinal:        `${resumo} O dado por trás disso normalmente vem da combinação de comportamento de cliente, movimento de concorrentes e variação interna de operação em ${dom}.`,
      por_que_importa:     card.por_que_importa
        ? (isHyp
            ? `${card.por_que_importa} Por ser hipótese, o foco é validar com indicador simples antes de comprometer recursos.`
            : `${card.por_que_importa} Ignorar significa abrir espaço pra concorrentes locais consolidarem posição enquanto o problema cresce.`)
        : (isHyp
            ? `Tema relevante para ${dom}, mas depende de validação com dado interno antes de virar ação ampla.`
            : `Esse sinal toca diretamente ${dom} e pode antecipar mudanças mais amplas. Se a unidade tratar antes dos pares, ganha 2-4 semanas de vantagem competitiva. Se não tratar, perde terreno em janela curta.`),
      pode_estar_por_tras: `Variações em ${dom} costumam refletir três vetores: (1) mudança no comportamento do cliente local, (2) movimento de concorrente próximo, (3) ajuste interno de operação ou equipe. Identificar qual vetor predomina é o primeiro filtro pra decisão.`,
      risco_ignorar:       isHyp
        ? `Sem dado medido, qualquer previsão numérica é palpite. O risco editorial aqui é tratar a hipótese como fato — trate como monitoramento até haver evidência suficiente.`
        : (urg === 'alta'
            ? `Alto — concorrentes podem capturar terreno em ${janela}. Custo de inação tende a crescer exponencialmente: cada semana sem reação multiplica o esforço de recuperação depois.`
            : urg === 'media'
              ? `Moderado — erosão gradual de indicador-chave em 60 dias se sem ação. Risco maior é normalizar a piora e perder a janela de reação barata.`
              : `Baixo — manter sob acompanhamento periódico. Risco principal é deixar o sinal sair do radar e descobrir tarde quando virar problema visível.`),
      oportunidade_agir:   isHyp
        ? `Se a hipótese se confirmar com dado interno, abre espaço para uma decisão melhor calibrada em ${dom}. Por ora, ganho está em definir baseline antes de executar plano amplo.`
        : `Reagir antes dos pares posiciona ${dom} como referência local. Janela típica de oportunidade dura ${janela}: depois disso, concorrentes copiam ou o sinal vira commodity. Investimento pequeno hoje rende efeito composto em 60-90 dias.`,
      observar_agora:      `Indicador direto de ${dom} (medição semanal), variação de avaliação pública (Google/iFood), comportamento de concorrentes próximos (mídia local + posts orgânicos), feedback qualitativo da equipe de linha de frente. Cruzar pelo menos 2 desses nos próximos ${urg === 'alta' ? '7' : '30'} dias.`,
      impacto_negocio:     isHyp
        ? `Sem dado interno medido, não estimar impacto numérico. Vale acompanhar o tema com indicador próprio antes de discutir efeito em vendas, margem ou reputação.`
        : `Em vendas: efeito direto em ticket médio e frequência se sem ação. Em reputação: cada 0,1★ no Google representa ~7% em conversão de novos clientes. Em operação: pressão crescente sobre rotina e clima de equipe. Em margem: ${urg === 'alta' ? '2-4 pontos percentuais' : '1-2 pontos'} de pressão se persistir.`,
      hipotese:            `Hipótese principal: ${resumo} reflete movimento real do mercado em ${dom}, com janela curta de reação. Hipótese alternativa: pode ser flutuação sazonal ou ruído de medição — vale confirmar com 1-2 indicadores adicionais antes de decisão grande.`,
      proximo_passo:       isHyp
        ? `1) Definir 1 indicador interno simples para checar a hipótese. 2) Atribuir 1 responsável pela leitura. 3) Revisar quando a primeira medição estiver disponível. 4) Só depois discutir plano amplo.`
        : `1) Validar hipótese cruzando com 2 indicadores adicionais em 7 dias. 2) Se confirmada, executar ${acao}. 3) Definir KPI semanal de ${dom} com meta numérica. 4) Marcar revisão em ${urg === 'alta' ? '14' : '30'} dias com gestor responsável.`,
    };
  } else if (mode === 'executar') {
    result = {
      objetivo:        isHyp
        ? `Validar a hipótese "${titulo}" em ${dom} com 1 indicador interno simples antes de executar plano amplo. Saída esperada: leitura clara de "confirmada" ou "descartada".`
        : `Transformar o sinal "${titulo}" em ação operacional concreta em ${dom}, com indicador mensurável, responsável definido e prazo curto. Saída esperada: indicador de ${dom} retornar ao nível-base ou superar em até 30 dias.`,
      diagnostico:     isHyp
        ? `Hipótese: ${resumo} Por ora é tema sem dado interno medido — não é diagnóstico, é leitura editorial. Antes de qualquer plano, vale definir baseline com 1 indicador simples.`
        : `Situação atual: ${resumo} Sintoma principal em ${dom}. Causas prováveis: (a) movimento competitivo, (b) gap operacional interno, (c) mudança no comportamento do cliente. Antes de agir, confirmar qual causa predomina — dispara decisão diferente em cada caso.`,
      primeiro_passo:  isHyp
        ? `${acao} — comece pela leitura mais simples possível: 1 conversa com a equipe + 1 indicador interno acessível. Sem compromisso de recurso até a primeira leitura.`
        : `${acao} — começar pela validação mais barata (uma conversa com a equipe de linha de frente + checagem de 1 indicador objetivo). Custa 30 min, evita executar plano errado.`,
      plano_inicial:   isHyp
        ? `Etapa 1: validar hipótese com 1 indicador interno simples. Etapa 2: só depois da leitura, decidir entre monitoramento contínuo ou plano operacional. Etapa 3: revisar editorial em ciclo regular conforme dado for chegando.`
        : `Fase 1 (esta semana): diagnóstico + definição de responsável + indicador-chave. Fase 2 (próximas 2 semanas): execução piloto da ação prioritária. Fase 3 (semana 4): medição, ajuste e decisão de escalar ou recuar.`,
      quem_executa:    `Gestor responsável por ${dom}, com sponsor de liderança pra desbloquear recursos rapidamente. Equipe de execução: 2-3 pessoas focadas, não diluído entre vários. Quem acompanha: liderança da unidade em ritual semanal de 30 min.`,
      prazo:           isHyp
        ? `Prazo da validação depende da disponibilidade do dado interno. Definir agora apenas: quem lê, qual indicador, e em que ciclo (semanal/quinzenal). Plano operacional só após a primeira leitura.`
        : (urg === 'alta'
            ? `Primeiro passo hoje. Execução piloto até o fim da semana. Medição em 14 dias. Decisão de escalar/recuar em 30 dias.`
            : `Diagnóstico em 3 dias. Piloto em 2 semanas. Medição em 30 dias. Próximo ciclo em 60 dias.`),
      risco_antes:     `Verificar: (1) há iniciativa semelhante já em curso? (2) orçamento e equipe disponíveis? (3) ação tem risco regulatório ou de imagem? (4) o ganho esperado supera o esforço? Se algum item bloquear, ajustar plano antes de começar.`,
      criterio_sucesso:isHyp
        ? `Critério editorial: hipótese fica "confirmada" se o indicador interno mostrar padrão consistente em pelo menos 2 leituras, e "descartada" se a leitura não bater. Sem meta numérica inventada — meta é ter dado para decidir.`
        : `KPI 1: indicador direto de ${dom} retornar ao baseline ou superar em 30 dias. KPI 2: NPS/nota pública estável ou em alta. KPI 3: ticket médio sem queda. Meta inicial: ${urg === 'alta' ? '+5% em 30d' : '+3% em 60d'} no indicador-chave.`,
      plano_b:         isHyp
        ? `Se a leitura não confirmar a hipótese: arquivar como editorial revisitável, sem ação operacional. Se confirmar: aí sim desenhar plano com responsável, KPI e prazo. Evitar dobrar aposta sem dado interno.`
        : `Se piloto não der resultado em 14 dias: revisar diagnóstico (causa estava errada). Se concorrente reagir antes: acelerar timing e ajustar mensagem. Se equipe não conseguir executar: redefinir escopo menor ou trazer apoio externo. Em todos os casos, evitar dobrar aposta sem dados novos.`,
      proximo_passo:   isHyp
        ? `Hoje: definir quem lê o indicador interno e em que ciclo. Esta semana: primeira leitura registrada. Depois disso: decidir entre monitoramento contínuo ou plano operacional. Sem plano amplo antes da primeira medição.`
        : `Hoje: marcar conversa de 30 min com gestor de ${dom}. Esta semana: definir responsável formal + indicador-chave + meta. Próximas 2 semanas: piloto. Daqui a 30 dias: revisão de resultado.`,
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
