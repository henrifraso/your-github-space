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

// Rótulo legível por slug de domínio — sem artigo embutido (a preposição/artigo
// certo é escolhido em cada frase, já que "na concorrência" e "no mercado"
// exigem gênero diferente e um mapa com artigo fixo quebraria metade dos casos).
const DOM_LABELS: Record<string, string> = {
  concorrencia: 'concorrência',
  demanda: 'demanda',
  digital: 'ambiente digital',
  distribuicao: 'distribuição',
  ecommerce: 'e-commerce',
  estoque: 'estoque',
  eventos: 'eventos',
  expansao: 'expansão',
  fidelizacao: 'fidelização',
  financeiro: 'área financeira',
  marketing: 'marketing',
  mercado: 'mercado',
  operacao: 'operação',
  oportunidade: 'oportunidade',
  pdv: 'ponto de venda',
  presenca: 'presença',
  'presenca-digital': 'presença digital',
  produto: 'produto',
  regulatorio: 'campo regulatório',
  reputacao: 'reputação',
  servico: 'serviço',
  territorio: 'território',
};

function narDom(card: IntelligenceCard): string {
  const raw = (card.area || card.dominio || '').toLowerCase().trim();
  if (!raw) return 'essa área';
  if (ENTITY_AND_TECH_IDS.has(raw)) return 'análise externa';
  return DOM_LABELS[raw] ?? 'essa área';
}

export function shortcutsForCard(card: IntelligenceCard): LocalShortcut[] {
  const d = ((card.dominio || '') + ' ' + (card.area || '')).toLowerCase();
  if (/reput|nota|avalia|review/.test(d)) return [
    { id: 'sc-r1', kind: 'local', label: 'Separar evidências de avaliação', mode: 'executar', subKey: 'evidencias' },
    { id: 'sc-r2', kind: 'local', label: 'Ver impacto da queda de nota',    mode: 'executar', subKey: 'ignorar' },
    { id: 'sc-r3', kind: 'local', label: 'Preparar mensagem para equipe',   mode: 'executar', subKey: 'mensagem' },
    { id: 'sc-r4', kind: 'local', label: 'Simular cenário de recuperação',  mode: 'executar', subKey: 'simular' },
    { id: 'sc-r5', kind: 'local', label: 'Ver concorrentes com melhor nota',mode: 'pesquisar', subKey: 'comparar' },
  ];
  if (/concorr|posicio/.test(d)) return [
    { id: 'sc-c1', kind: 'local', label: 'Comparar com concorrente',        mode: 'pesquisar', subKey: 'comparar' },
    { id: 'sc-c2', kind: 'local', label: 'Separar evidências competitivas', mode: 'executar',  subKey: 'evidencias' },
    { id: 'sc-c3', kind: 'local', label: 'Ver impacto territorial',         mode: 'executar',  subKey: 'territorial' },
    { id: 'sc-c4', kind: 'local', label: 'Analisar raio no mapa',           mode: 'pesquisar', subKey: 'cruzar' },
    { id: 'sc-c5', kind: 'local', label: 'Simular cenário competitivo',     mode: 'executar',  subKey: 'simular' },
  ];
  if (/forneced|supply|estoque/.test(d)) return [
    { id: 'sc-f1', kind: 'local', label: 'Comparar com mercado',            mode: 'executar',  subKey: 'mercado' },
    { id: 'sc-f2', kind: 'local', label: 'Preparar mensagem para fornecedor', mode: 'executar', subKey: 'mensagem' },
    { id: 'sc-f3', kind: 'local', label: 'Simular cenário de ruptura',      mode: 'executar',  subKey: 'simular' },
    { id: 'sc-f4', kind: 'local', label: 'Separar evidências de estoque',   mode: 'executar',  subKey: 'evidencias' },
    { id: 'sc-f5', kind: 'local', label: 'Ver impacto por canal',           mode: 'executar',  subKey: 'canal' },
  ];
  if (/marketing|midia|trafego|presenca/.test(d)) return [
    { id: 'sc-m1', kind: 'local', label: 'Separar evidências de presença',  mode: 'executar',  subKey: 'evidencias' },
    { id: 'sc-m2', kind: 'local', label: 'Preparar mensagem para equipe',   mode: 'executar',  subKey: 'mensagem' },
    { id: 'sc-m3', kind: 'local', label: 'Ver impacto por canal',           mode: 'executar',  subKey: 'canal' },
    { id: 'sc-m4', kind: 'local', label: 'Comparar com mercado',            mode: 'executar',  subKey: 'mercado' },
    { id: 'sc-m5', kind: 'local', label: 'Simular cenário de oportunidade', mode: 'executar',  subKey: 'simular' },
  ];
  // Genérico
  return [
    { id: 'sc-g1', kind: 'local', label: 'Entender melhor',       mode: 'pesquisar', subKey: 'explicar' },
    { id: 'sc-g2', kind: 'local', label: 'Separar evidências',    mode: 'executar',  subKey: 'evidencias' },
    { id: 'sc-g3', kind: 'local', label: 'Simular cenário',       mode: 'executar',  subKey: 'simular' },
    { id: 'sc-g4', kind: 'local', label: 'Preparar mensagem',     mode: 'executar',  subKey: 'mensagem' },
    { id: 'sc-g5', kind: 'local', label: 'Comparar com mercado',  mode: 'executar',  subKey: 'mercado' },
  ];
}
// Campos de contexto inicial reutilizados no topo dos blocos de modo/share unificados.
function buildInitialContextFields(card: IntelligenceCard): Record<string, unknown> {
  const dom = narDom(card);
  const urg = card.urgencia || 'media';
  const janela = urg === 'alta' ? '48 a 72 horas' : urg === 'media' ? '2 semanas' : '30 dias';
  const isHyp = card.isHypothesis === true;

  const o_que_aconteceu = card.resumo
    ? (isHyp
        ? `${card.resumo} Trate como hipótese a validar com indicadores próprios — ainda não é leitura medida.`
        : `${card.resumo} O sinal foi identificado a partir do cruzamento de indicadores operacionais e de mercado sobre ${dom} — não é ruído isolado, vale tratar como ponto de atenção real.`)
    : (isHyp
        ? `Hipótese sobre ${dom}, ligada a "${card.titulo}" — tema com dado interno ainda pendente, vale acompanhar antes de qualquer conclusão.`
        : `Identificamos um sinal relevante sobre ${dom}: "${card.titulo}" — uma variação que merece sua atenção nos próximos dias, com base no cruzamento de indicadores internos e externos.`);

  const por_que_importa = card.por_que_importa
    ? (isHyp
        ? `${card.por_que_importa} Por ser hipótese, o foco é validar o tema com indicador simples antes de comprometer recursos.`
        : `${card.por_que_importa} Em prática, isso tende a afetar a forma como o cliente percebe o seu negócio e como você reage a mudanças — ignorar esse tipo de sinal costuma abrir espaço para concorrentes locais.`)
    : (isHyp
        ? `Tema relevante em termos de ${dom} pro seu negócio, mas ainda depende de validação com dado interno antes de virar ação ampla.`
        : `Esse tipo de sinal costuma afetar a percepção do seu cliente local, a operação cotidiana e a competitividade — sinais lidos cedo tendem a pesar menos do que sinais lidos tarde.`);

  const ondeAfetaSafe = (card.onde_afeta && !ENTITY_AND_TECH_IDS.has(card.onde_afeta.toLowerCase().trim()))
    ? card.onde_afeta : null;
  const onde_afeta = ondeAfetaSafe
    ? `${ondeAfetaSafe} Efeito direto sobre ${dom} no seu negócio, e secundário em atendimento, conversão e reputação pública. Indicadores correlatos costumam se mover juntos nas próximas semanas.`
    : `Principalmente sobre ${dom} no seu negócio, com efeito secundário em atendimento, conversão de novos clientes e reputação pública (Google, redes sociais, delivery). Esses indicadores costumam se mover juntos quando há sinal nessa área.`;

  const risco = isHyp
    ? `Sem dado medido, não estimar impacto numérico. O risco editorial aqui é tratar a hipótese como fato — vale manter como monitoramento até a primeira leitura interna confirmar ou descartar.`
    : (urg === 'alta'
        ? `Alto — tende a pedir reação mais rápida que o normal. Sinais desse tipo, quando a urgência é alta, costumam ter uma janela de reação mais curta: concorrentes tendem a se antecipar, e cada semana sem leitura tende a tornar a recuperação mais trabalhosa.`
        : urg === 'media'
          ? `Moderado — costuma valer monitorar a evolução nos próximos dias. O maior risco tende a ser normalizar a piora aos poucos e deixar passar o momento mais barato de agir.`
          : `Baixo — tende a valer manter acompanhamento periódico. O risco principal costuma ser o sinal sair do radar e só ser percebido quando já estiver mais visível.`);

  const oportunidade = isHyp
    ? `Se a hipótese se confirmar com dado interno, abre espaço pra você calibrar melhor a decisão sobre ${dom}. Por ora, o ganho está em ter uma base antes de qualquer resposta mais ampla.`
    : `Reagir antes dos concorrentes tende a te posicionar como referência sobre ${dom} na região — esse tipo de janela costuma se fechar com o tempo: depois de um ponto, os pares tendem a copiar ou o sinal vira commodity.`;

  const acao_recomendada = card.o_que_fazer
    ? (isHyp
        ? `${card.o_que_fazer} Comece pela validação mais simples possível — 1 indicador, 1 responsável, sem comprometer recursos antes da leitura inicial.`
        : `${card.o_que_fazer} Executar com responsável definido, indicador semanal e meta numérica clara. Sem essas três coisas, vira "intenção" e não ação. Começar pela validação mais barata antes de comprometer recursos.`)
    : (isHyp
        ? `Definir 1 indicador simples para validar a hipótese em ${dom}, com 1 responsável e prazo curto de leitura. Plano amplo só depois da confirmação.`
        : `Revisar o contexto rapidamente, definir 1 responsável claro, escolher 1 indicador semanal de ${dom} com meta numérica, e executar piloto em ${janela}. Antes de plano grande, validar com 2 indicadores cruzados.`);

  const proximo_passo = isHyp
    ? `1) Use os atalhos abaixo para aprofundar o tema. 2) Definir 1 indicador interno para checar a hipótese. 3) Atribuir responsável pela leitura. 4) Revisar quando a primeira medição estiver disponível.`
    : `1) Use os atalhos abaixo (Entender melhor / Separar evidências / Ver risco / Ver exemplos / Simular cenário) pra aprofundar. 2) Decidir nos próximos 3 dias se vira monitoramento contínuo ou ponto de atenção. 3) Identificar responsável e indicador antes do fim da semana. 4) Revisar em ${urg === 'alta' ? '14' : '30'} dias.`;

  return {
    o_que_aconteceu,
    por_que_importa,
    onde_afeta,
    risco,
    oportunidade,
    dominio: dom,
    acao_recomendada,
    proximo_passo,
  };
}

export function buildInitialBlock(card: IntelligenceCard, difficulty: Dificuldade): WorkspaceBlock {
  return {
    id:         `blk-init-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    cardId:     card.id,
    mode:       'pesquisar',
    subKey:     'inicial',
    subLabel:   'Análise inicial',
    endpoint:   null,
    result:     DENSE_TEST_CTX[card.id] ?? buildInitialContextFields(card),
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
    result:     { share: true, titulo: card.titulo, resumo: card.resumo, _ctx: DENSE_TEST_CTX[card.id] ?? buildInitialContextFields(card) },
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

  // ── ANALISAR (executar) — atalhos por sub ────────────────────────────────
  if (s === 'evidencias') return [
    mk('Simular cenário',               'executar',  'simular',       '1'),
    mk('Comparar com mercado',          'executar',  'mercado',       '2'),
    mk('Ver impacto por canal',         'executar',  'canal',         '3'),
    mk('Preparar mensagem',             'executar',  'mensagem',      '4'),
    mk('Cruzar sinais',                 'pesquisar', 'cruzar',        '5'),
  ];
  if (s === 'simular') return [
    mk('Separar evidências',            'executar',  'evidencias',    '1'),
    mk('Ver risco comercial',           'executar',  'risco',         '2'),
    mk('Comparar com mercado',          'executar',  'mercado',       '3'),
    mk('Ver impacto territorial',       'executar',  'territorial',   '4'),
    mk('Onde está a oportunidade?',     'executar',  'oportunidade',  '5'),
  ];
  if (s === 'mercado') return [
    mk('Separar evidências',            'executar',  'evidencias',    '1'),
    mk('Ver impacto territorial',       'executar',  'territorial',   '2'),
    mk('Ver impacto por canal',         'executar',  'canal',         '3'),
    mk('Onde está a oportunidade?',     'executar',  'oportunidade',  '4'),
    mk('Cruzar sinais',                 'pesquisar', 'cruzar',        '5'),
  ];
  if (s === 'canal' || s === 'territorial') return [
    mk('Separar evidências',            'executar',  'evidencias',    '1'),
    mk('Simular cenário',               'executar',  'simular',       '2'),
    mk('Ver risco comercial',           'executar',  'risco',         '3'),
    mk('Comparar com mercado',          'executar',  'mercado',       '4'),
    mk('Comparar com dados internos',   'executar',  'dados',         '5'),
  ];
  if (s === 'ignorar') return [
    mk('Separar evidências',            'executar',  'evidencias',    '1'),
    mk('Simular cenário',               'executar',  'simular',       '2'),
    mk('Ver risco comercial',           'executar',  'risco',         '3'),
    mk('Preparar mensagem',             'executar',  'mensagem',      '4'),
    mk('Ver sinais relacionados',       'pesquisar', 'cruzar',        '5'),
  ];
  if (s === 'risco') return [
    mk('Separar evidências',            'executar',  'evidencias',    '1'),
    mk('Simular cenário',               'executar',  'simular',       '2'),
    mk('O que muda se ignorado?',       'executar',  'ignorar',       '3'),
    mk('Preparar mensagem',             'executar',  'mensagem',      '4'),
    mk('Ver sinais relacionados',       'pesquisar', 'cruzar',        '5'),
  ];
  if (s === 'oportunidade' || s === 'dados') return [
    mk('Separar evidências',            'executar',  'evidencias',    '1'),
    mk('Comparar com mercado',          'executar',  'mercado',       '2'),
    mk('Simular cenário',               'executar',  'simular',       '3'),
    mk('Ver impacto por canal',         'executar',  'canal',         '4'),
    mk('Preparar mensagem',             'executar',  'mensagem',      '5'),
  ];
  if (s === 'mensagem') return [
    mk('Adaptar versão para equipe',    'executar',  'mensagem',      '1'),
    mk('Preparar para reunião',         'executar',  'mensagem',      '2'),
    mk('Separar evidências',            'executar',  'evidencias',    '3'),
    mk('Resumir sinal',                 'pesquisar', 'resumir',       '4'),
    mk('Ver risco comercial',           'executar',  'risco',         '5'),
  ];

  // ── ENTENDER — atalhos por sub ────────────────────────────────────────────
  if (s === 'comparar') return [
    mk('Ver impacto competitivo',       'executar',  'territorial',   '1'),
    mk('Separar evidências',            'executar',  'evidencias',    '2'),
    mk('Ver pontos de risco',           'pesquisar', 'risco',         '3'),
    mk('Onde está a oportunidade?',     'pesquisar', 'oportunidade',  '4'),
    mk('Simular cenário',               'executar',  'simular',       '5'),
  ];
  if (m === 'pesquisar') return [
    mk('Explicar mais simples',         'pesquisar', 'explicar',      '1'),
    mk('Ver evidências',                'pesquisar', 'evidencias',    '2'),
    mk('Ver risco',                     'pesquisar', 'risco',         '3'),
    mk('Ver oportunidade',              'pesquisar', 'oportunidade',  '4'),
    mk('Separar evidências',            'executar',  'evidencias',    '5'),
  ];

  // ── APRENDER — atalhos por sub ────────────────────────────────────────────
  if (s === 'exemplo') return [
    mk('Exemplo p/ meu negócio',        'aprender',  'exemplo',       '1'),
    mk('Separar evidências',            'executar',  'evidencias',    '2'),
    mk('Preparar mensagem',             'executar',  'mensagem',      '3'),
    mk('Simular cenário',               'executar',  'simular',       '4'),
    mk('Próximo nível',                 'aprender',  'nivel',         '5'),
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
    mk('Entender melhor',               'pesquisar', 'explicar',    '1'),
    mk('Separar evidências',            'executar',  'evidencias',  '2'),
    mk('Preparar mensagem',             'executar',  'mensagem',    '3'),
    mk('Simular cenário',               'executar',  'simular',     '4'),
    mk('Salvar referência',             'aprender',  'memoria',     '5'),
  ];
}

// TESTE (08/ago/2026) — Lote 1: 5 campos densos escritos à mão pra os 5
// primeiros cards da Combrasil, no lugar dos 5 genéricos (_ctx) + 10 de
// fórmula do executar. Escopo: só os card.id abaixo + mode 'executar'.
// Nenhum outro card ou perfil passa por aqui — buildModeBlock cai no fluxo
// de sempre pra todo o resto. Ver docs/MODELO_MOTOR_OS1.md, "Método de
// geração em lote".
type DenseCtx = { o_que_aconteceu: string; por_que_importa: string; onde_afeta: string; risco: string; oportunidade: string };
const DENSE_TEST_CTX: Record<string, DenseCtx> = {
  'demo-combrasil-camil': {
    o_que_aconteceu: `A Camil, líder do setor de arroz no Brasil, atravessou um trimestre de números mistos: a receita veio mais fraca no 4º trimestre de 2025, e o lucro líquido caiu 57,6% no 1º trimestre de 2026 (Investing.com Brasil, 5/ago/2026; visaoagro.com.br, 17/jul/2026). O padrão isolado sugeriria uma empresa perdendo fôlego.\n\nMas em 1º de junho de 2026 — antes mesmo do resultado mais fraco ser divulgado — a Camil já havia proposto um aumento de capital de R$ 1,39 bilhão, sem emissão de novas ações (InfoMoney, 1/jun/2026). Não é uma resposta a um momento ruim: é um reforço estrutural que antecede o próprio resultado fraco, o que muda o que esse conjunto de fatos significa.`,
    por_que_importa: `Resultado fraco isolado costuma ser lido como sinal de fraqueza — um momento em que concorrentes menores ganham fôlego relativo. Mas quando o resultado fraco vem acompanhado de reforço de capital, a leitura muda: o que te separava da Camil — a escala dela pra sustentar preço, promoção e presença em categoria por mais tempo do que qualquer regional consegue — não está encolhendo junto com o resultado. Está sendo defendido de propósito.\n\nIsso importa porque a distância competitiva entre um líder nacional e uma indústria regional normalmente se mede pelo resultado do momento. Aqui, o resultado e a decisão de capitalização estão andando em direções opostas — e é a decisão de capitalização que tende a pesar mais no médio prazo, porque é ela que financia a manutenção da vantagem, não o trimestre isolado.`,
    onde_afeta: `O ponto onde essa diferença tende a ser testada primeiro é na negociação com o mesmo distribuidor ou rede de varejo que atende a Camil e a Combrasil ao mesmo tempo — é ali que a capacidade de sustentar margem menor por mais tempo aparece na prática, não no resultado trimestral em si.\n\nUm segundo ponto tende a ser o investimento em marca e portfólio: reforço de capital costuma anteceder decisão de expansão ou reposicionamento, não só resistência financeira passiva. Se a Camil usar esse capital pra ampliar linha ou entrar em segmento adjacente, o motivo pelo qual o cliente escolhe um produto regional — proximidade, especificidade, relação direta — pode ser testado por um portfólio maior, não só por preço.`,
    risco: `O risco não está no resultado fraco da Camil — está em ler esse resultado como sinal de que o líder vai recuar. Se o reforço de capital virar investimento comercial ativo (campanha, expansão, negociação agressiva) nos próximos meses, a distância que hoje parece estável pode encolher rápido, e o resultado fraco já vai ter passado despercebido como o momento certo de reagir.\n\nOutro risco é operar com a leitura de que "líder fraco significa janela aberta" — o padrão financeiro aqui sugere o oposto: um líder se preparando pra sustentar posição mesmo sob pressão, não um líder recuando.`,
    oportunidade: `Enquanto o reforço de capital não se traduzir em movimento comercial visível, existe uma janela real: o líder está, por ora, ocupado sustentando a própria estrutura financeira — não necessariamente investindo agressivamente em disputa de categoria. Esse intervalo, entre o anúncio do capital e o efeito dele aparecer em campanha ou portfólio, tende a ser o momento mais barato pra reforçar o que já distingue a Combrasil hoje, antes que a resposta do líder apareça.\n\nVale lembrar que o motivo pelo qual um cliente regional escolhe a Combrasil raramente é o mesmo motivo pelo qual escolhe a Camil — escala nacional e relação regional são vantagens diferentes, não a mesma vantagem em tamanhos diferentes. Reforçar essa diferença específica tende a valer mais do que tentar competir na mesma frente que o capital da Camil está defendendo.`,
  },
  'demo-combrasil-josapar': {
    o_que_aconteceu: `A Josapar, dona da marca Tio João, encerrou 2024 com lucro líquido de R$ 23,4 milhões — alta de 47% em relação ao ano anterior (Globo Rural, 25/mar/2025). O resultado marca uma recuperação depois de um período mais difícil para a empresa.\n\nNão é o número de um trimestre isolado — é o fechamento de um ano inteiro, o que costuma pesar mais numa decisão de reinvestimento do que um resultado pontual.`,
    por_que_importa: `Recuperação financeira depois de um período difícil costuma vir acompanhada de decisão de reinvestir — e isso normalmente aparece primeiro no que sustenta a escolha do cliente: marca reconhecida, comunicação, disponibilidade constante do produto. O que te separava da Josapar durante o período de dificuldade dela — ela com menos fôlego pra disputar, você com campo mais livre — tende a voltar a ser testado.\n\nA distância que se abriu enquanto a Josapar estava fragilizada não é permanente: foi consequência de um momento financeiro específico, não de uma vantagem estrutural sua.`,
    onde_afeta: `O ponto mais direto é a disputa pelo mesmo motivo de escolha do cliente final em arroz — sabor, marca reconhecida, disponibilidade constante. Se a Josapar volta a investir em marketing com a mesma intensidade de antes, o argumento que fazia o cliente te escolher no lugar dela pode voltar a ser comparado lado a lado, não só por preço.\n\nUm segundo ponto é a relação comercial com o mesmo parceiro de distribuição: concorrente mais capitalizado costuma negociar condição com mais força, o que pode mudar o equilíbrio de barganha que você tem hoje.`,
    risco: `O risco não é a recuperação da Josapar em si — é presumir que o campo mais livre que existia durante a dificuldade dela vai continuar existindo. Se o reinvestimento em marca vier rápido, a distância que parecia estável pode encolher antes que dê tempo de reagir.\n\nHá também o risco de ler isso como notícia financeira de terceiro, sem conectar ao que muda na disputa direta pelo cliente — lucro maior em 2024 tende a virar orçamento de marketing depois, não fica só no balanço.`,
    oportunidade: `Enquanto o reinvestimento da Josapar ainda não apareceu em campanha, existe uma janela pra consolidar o motivo pelo qual o cliente te escolhe hoje — antes que a comparação direta volte a ficar mais equilibrada.\n\nO período de dificuldade da Josapar não foi causado por você — foi financeiro, interno a ela. Isso significa que a distância atual também não é garantida só porque você não fez nada: a oportunidade real está em reforçar ativamente o que já te distingue, não em assumir que ela se mantém sozinha.`,
  },
  'demo-combrasil-broto-feijao': {
    o_que_aconteceu: `A Broto Legal, marca de grãos da Urbano Alimentos, lançou um feijão preto em pote que fica pronto em 1 minuto no micro-ondas (IstoÉ Dinheiro, 24/jan/2025). É um produto de conveniência, pensado pra quem quer feijão sem passar pelo processo de cozinhar do zero.\n\nO lançamento não compete diretamente com o feijão tradicional em grão do jeito usual — ele cria uma categoria de consumo separada, ligada à rapidez, não à receita.`,
    por_que_importa: `Todo negócio tradicional de grãos é escolhido por um motivo específico — sabor, tipo de grão, tradição, preço por quilo. Esse motivo simplesmente não existe pra quem está decidindo entre cozinhar ou não cozinhar. É um critério de escolha diferente, e ele estava livre até a Broto Legal ocupá-lo.\n\nIsso importa porque seu portfólio tradicional não perde nada diretamente com esse lançamento — mas também não ganha nada, porque nunca disputou esse motivo de escolha. A questão não é defender uma vantagem que já existia; é decidir se vale abrir uma vantagem nova onde ainda não há nenhuma.`,
    onde_afeta: `Afeta diretamente a linha de feijão, mas numa frente de decisão que seu portfólio tradicional nunca ocupou — a ocasião de consumo rápido, sem preparo. Não é uma comparação de produto contra produto; é fazer parte ou não dessa categoria de escolha inteira.\n\nUm efeito secundário tende a aparecer na percepção geral da marca: quem lança conveniência primeiro costuma ser lembrado como a marca que resolve o problema, mesmo entre clientes que nunca compram esse produto específico.`,
    risco: `O risco não é perder cliente pro feijão pronto — é a categoria de conveniência virar padrão esperado antes de você ter qualquer presença nela, o que tornaria mais caro entrar depois. Motivo de escolha recém-aberto tende a ficar mais barato de ocupar enquanto poucos disputam.\n\nHá também o risco de tratar isso como irrelevante por ser pequeno hoje — ocasião de consumo nova raramente nasce grande, ela cresce.`,
    oportunidade: `Existe uma janela real enquanto a Broto Legal é uma das poucas ocupando esse motivo de escolha — pouca disputa significa que qualquer entrada custa menos agora do que depois de consolidada. Vale tanto pra entrar na mesma categoria quanto pra decidir, conscientemente, reforçar outro motivo de escolha em vez disso.\n\nO fato de essa ocasião ainda não ter disputa forte também significa que ela não tem líder definido — não é preciso competir com a Broto Legal especificamente, é preciso decidir que motivo de escolha vale a pena ter.`,
  },
  'demo-combrasil-broto-gluten': {
    o_que_aconteceu: `A Broto Legal ampliou a oferta de produtos sem glúten dentro do seu portfólio de grãos (Giro News, 24/jun/2026). É um movimento de segmentação por restrição alimentar, não um lançamento isolado de produto.\n\nO fato em si é pequeno — não vem acompanhado de número de faturamento ou volume — mas o padrão que ele revela (concorrente indo atrás de um público definido por dieta, não por categoria de produto) costuma valer mais do que o tamanho do lançamento sugere.`,
    por_que_importa: `Empresa tradicional de grãos tende a olhar concorrência pela categoria de produto — quem mais vende arroz, quem mais vende feijão. Mas quem decide por restrição alimentar não escolhe por categoria, escolhe por um critério que sua linha tradicional nunca foi construída pra atender. É exatamente esse tipo de movimento, pequeno demais pra aparecer no radar de concorrência tradicional, que costuma crescer sem que ninguém perceba a tempo.\n\nO que te distinguia até agora nesse público — nada, porque ele nunca foi seu foco — deixa de ser neutro e passa a ser uma ausência real, agora que alguém está ativamente atendendo esse critério.`,
    onde_afeta: `Afeta seu portfólio de grãos e farináceos de um jeito indireto: não é disputa do cliente que já te escolhe, é disputa por um cliente que talvez nunca tenha te considerado — porque o motivo pelo qual esse cliente decide (restrição alimentar) nunca fez parte do que te distingue hoje.\n\nO efeito tende a aparecer primeiro em canais mais especializados (produtos naturais, e-commerce de nicho) antes de chegar ao varejo tradicional onde você compete — o que significa que a distância nesse público pode crescer um bom tempo antes de você perceber.`,
    risco: `O risco central é o viés de achar que, por ser pequeno hoje, não merece leitura — é exatamente esse tipo de raciocínio que deixa concorrente menor crescer despercebido num canto que o líder tradicional não olha. Segmento de dieta específica tende a começar pequeno e ganhar tração por fidelidade, não por volume — o que não aparece em número de mercado geral tão cedo.\n\nHá também o risco de, quando o movimento finalmente aparecer grande o suficiente pra ser notado, o critério de escolha desse público já estar consolidado em torno de quem chegou primeiro.`,
    oportunidade: `Como o movimento ainda é recente e pequeno, ainda não existe um critério de escolha consolidado nesse público — quem entrar agora ajuda a defini-lo, em vez de competir contra um padrão já formado. Essa é uma vantagem que ainda não tem dono.\n\nVale considerar que esse não precisa ser um motivo de escolha construído do zero — pode ser uma extensão do que já te distingue hoje (tradição, procedência, qualidade do grão) aplicado a um público que ainda não foi apresentado a esse argumento.`,
  },
  'demo-combrasil-kicaldo-preco': {
    o_que_aconteceu: `A Kicaldo, historicamente conhecida por feijão, entrou no mercado de arroz com a marca Rosalito, comprada em leilão por R$ 35,2 milhões (Agrofy News Brasil, 14/abr/2025). A entrada efetiva no mercado foi noticiada mais de um ano depois, em maio de 2026 (CNN Brasil, 17/mai/2026) — no mesmo período em que o preço da saca de arroz passou de R$ 63 (MINUTO MT, 18/jul/2026).\n\nSão dois fatos com datas diferentes que compõem uma única leitura: uma compra de ativo feita com antecedência, e uma entrada de mercado que se concretiza justo quando o custo do insumo já está mais alto pra todo mundo.`,
    por_que_importa: `Até agora, o que te distinguia da Kicaldo era simples: vocês não competiam na mesma categoria. Ela era referência em feijão, você em arroz — categorias vizinhas, não concorrentes diretas. Essa distinção acaba de deixar de existir.\n\nUm concorrente que muda de categoria costuma ser mais difícil de prever do que um concorrente que sempre disputou com você diretamente — porque ele não chega com o mesmo manual que os concorrentes tradicionais de arroz usam. O motivo pelo qual ele pode ganhar cliente não é necessariamente o mesmo motivo que Camil ou Josapar usariam.`,
    onde_afeta: `O que separava suas linhas de arroz e feijão — cada uma com seu próprio conjunto de concorrentes — deixou de existir. Agora a Kicaldo aparece nas duas frentes ao mesmo tempo, o que muda o cálculo de quantos concorrentes reais você tem em cada categoria.\n\nUm segundo ponto é o momento: como a entrada dela no arroz coincide com o custo do insumo mais alto pra todo mundo, o motivo pelo qual ela consegue (ou não) sustentar preço nessa categoria nova tende a ficar visível mais rápido do que num cenário de custo estável.`,
    risco: `O risco não é a Kicaldo ser forte em arroz imediatamente — é ela testar, sem pressa, qual argumento de escolha funciona nessa categoria nova pra ela, enquanto ainda não é vista como concorrente direta pelos players tradicionais. Concorrente que entra por adjacência de categoria costuma ser subestimado justamente por não ter histórico ali.\n\nHá também o risco de tratar isso como um evento pontual (uma compra em leilão) em vez de uma mudança estrutural de quem compete com quem — a compra foi em 2025, mas o efeito dela continua se desenrolando mais de um ano depois.`,
    oportunidade: `Enquanto a Kicaldo ainda está estabelecendo o que a distingue nessa categoria nova, existe uma janela pra observar qual argumento ela está testando — preço, marca herdada da Rosalito, ou outro — antes de precisar reagir a algo consolidado.\n\nVale lembrar que uma marca comprada em leilão de massa falida carrega uma história prévia — o que a Rosalito não conseguiu sustentar antes pode não ser automaticamente resolvido só por ter dono novo. O que te distinguia da Rosalito original pode continuar te distinguindo da versão Kicaldo dela, até prova em contrário.`,
  },
  'demo-combrasil-yoki': {
    o_que_aconteceu: `A Yoki, marca de temperos, farináceos e grãos processados, mudou de dono: a 3Corações comprou as operações da General Mills no Brasil — incluindo Yoki e a marca Kitano — por R$ 800 milhões (Folha de S.Paulo, 17/mar/2026). O negócio inclui as fábricas brasileiras da General Mills.\n\nNão é uma troca de controle qualquer: a 3Corações é um grupo com estrutura de distribuição própria consolidada em outras categorias, o que muda o tipo de estrutura que passa a sustentar a Yoki a partir de agora.`,
    por_que_importa: `Até a venda, a vantagem que você tinha sobre a Yoki em ser mais fácil de encontrar na decisão de compra local podia estar ligada a uma estrutura de distribuição que não era necessariamente a mais agressiva do setor. Isso muda com um comprador que já opera rede própria consolidada.\n\nO que te distinguia da Yoki não era o produto em si — temperos e farináceos têm concorrência historicamente grande — era, em parte, o quanto ela conseguia aparecer na frente do cliente. Se isso deixa de ser um ponto fraco dela, a distância que você tinha ali tende a diminuir, mesmo sem nenhuma mudança no seu lado.`,
    onde_afeta: `Afeta diretamente as linhas de farináceos, temperos e grãos processados, onde o que te distinguia da Yoki dependia em parte da estrutura antiga por trás dela — agora substituída. O efeito real tende a aparecer não no produto, mas em quão fácil fica pro cliente encontrar a Yoki a partir de agora.\n\nUm segundo ponto é a força de negociação com o mesmo canal de distribuição: um grupo maior por trás da Yoki tende a negociar condição comercial de um jeito diferente do que a estrutura anterior negociava.`,
    risco: `O risco não é a Yoki lançar produto novo — é a integração com a 3Corações levar tempo pra aparecer e, quando aparecer, vir de uma vez, sem sinal gradual pra reagir antes.\n\nHá também o risco de continuar competindo pelo mesmo motivo de sempre — pressupondo a mesma estrutura de distribuição da gestão anterior — quando na prática o que sustenta a diferença entre vocês já mudou.`,
    oportunidade: `Enquanto a integração entre Yoki e 3Corações ainda está em curso, existe uma janela em que a distribuição da marca provavelmente não está otimizada — processo de fusão tende a gerar um intervalo de menor eficiência antes de ganhar força.\n\nVale lembrar que o que já te distingue da Yoki — relação direta, especificidade regional — não depende de quem é dono dela. Essa parte da sua vantagem continua sua, independente da integração.`,
  },
  'demo-combrasil-mercado-safra': {
    o_que_aconteceu: `Duas notícias separadas, quando lidas juntas, mudam de figura: em novembro de 2025, a Conab ampliou pra 11,5% a estimativa de queda na safra brasileira de arroz de 2025/26 (Planeta Arroz, 14/nov/2025). Em julho de 2026, a exportação de arroz disparou mais de 80%, reduzindo a oferta interna disponível (portaldoagronegocio.com.br, 16/jul/2026).\n\nSão duas causas empurrando na mesma direção ao longo da mesma safra: menos produção e mais saída pro exterior. O resultado é menos arroz disponível dentro do Brasil do que em safras anteriores.`,
    por_que_importa: `Custo de matéria-prima em alta não afeta todo mundo do mesmo jeito — e é exatamente essa diferença que vai decidir quem segue competitivo nos próximos meses. Quem tem contrato de fornecimento travado, estoque formado com antecedência ou escala pra negociar direto com produtor tende a sentir menos o choque do que quem depende do mercado à vista mês a mês.\n\nEsse tipo de situação normalmente não separa empresa grande de empresa pequena — separa quem se preparou de quem não se preparou. É uma diferença que existe dentro do seu próprio negócio, não necessariamente entre você e um concorrente específico.`,
    onde_afeta: `Afeta toda a sua linha de arroz, mas o efeito real depende de como a sua compra de insumo está estruturada — não só do preço da saca em si. Duas empresas do mesmo porte, comprando na mesma safra, podem sentir esse aumento de forma completamente diferente dependendo de quando e como compraram.\n\nO ponto cego aqui costuma ser achar que o preço da saca conta a história inteira — o que te distingue de um concorrente nesse momento pode estar mais na forma como a compra foi estruturada meses atrás do que em qualquer decisão tomada agora.`,
    risco: `O risco não é o custo estar mais alto — isso já é público. O risco é não saber, com clareza, de que lado desse corte a sua própria operação está, e descobrir isso só quando a margem já apertou.\n\nHá também o risco de tratar essa alta como temporária, quando duas causas estruturais diferentes (safra menor e exportação maior) empurram na mesma direção ao mesmo tempo — o que costuma durar mais do que uma alta pontual.`,
    oportunidade: `Empresas que sentem menos esse choque — por contrato, estoque ou escala — abrem uma vantagem real sobre quem precisa repassar o custo de imediato: conseguem sustentar preço final por mais tempo, exatamente no momento em que o concorrente menos preparado está mais vulnerável. Se esse for o seu caso, existe uma janela pra ganhar terreno enquanto isso dura.\n\nSe não for o seu caso, a oportunidade está em outro ponto: entender com precisão o que te distingue — ou não — de quem está mais protegido, e corrigir essa estrutura antes da próxima safra chegar. É mais barato ajustar isso fora de um momento de pressão de custo do que durante ele.`,
  },
  'demo-combrasil-exemplo-preco': {
    o_que_aconteceu: `Este é um exemplo do tipo de leitura que o monitoramento direto de preço (scraper) traz — não é dado coletado agora, é uma ilustração de formato. No cenário ilustrado, o arroz tipo 1 de 5kg da Camil aparece listado a R$ 24,90 numa rede de varejo, com alta de 6% na semana.\n\nGoogle News não entrega esse tipo de informação — resultado financeiro trimestral sai meses depois do movimento de preço real acontecer. O motivo de existir esse tipo de card é mostrar a diferença de granularidade entre notícia pública e dado coletado direto do ponto de venda.`,
    por_que_importa: `Preço de prateleira é o dado mais direto que existe pra saber se a sua vantagem de preço num produto específico continua valendo ou já foi igualada — muito antes de qualquer resultado financeiro contar essa história. Uma variação de 6% numa semana pode ser ruído pontual ou início de mudança de posicionamento; só o acompanhamento direto permite diferenciar um do outro.\n\nO motivo pelo qual esse tipo de dado importa mais do que parece é que decisão de preço do concorrente é sempre uma decisão sobre o que o distingue — ou não — do seu produto.`,
    onde_afeta: `Afeta diretamente a comparação produto a produto na sua linha de arroz — não uma leitura de mercado geral, mas o ponto exato onde o cliente decide entre a sua marca e a da Camil, comparando os dois preços lado a lado.\n\nÉ também onde a diferença de velocidade de informação mais pesa: enquanto uma notícia sobre resultado leva meses pra sair, uma mudança de preço já está afetando a decisão do cliente no mesmo dia.`,
    risco: `O risco de não ter esse tipo de dado é operar sempre um passo atrás — reagindo à notícia financeira trimestral quando o que realmente decidiu se o cliente ficou com a sua marca ou trocou foi um preço que mudou meses antes, sem que ninguém tivesse visibilidade dele.\n\nHá também o risco de presumir que a sua vantagem de preço está estável só porque não há notícia nova — ausência de notícia não significa ausência de movimento, só significa ausência de visibilidade.`,
    oportunidade: `Um sistema de monitoramento direto permite reagir dentro da mesma semana em que a vantagem de preço começa a mudar, em vez de descobrir isso meses depois num resultado financeiro.\n\nEsse tipo de leitura também tende a revelar padrão: se o concorrente ajusta preço em datas específicas, esse padrão vira previsível — e o que é previsível deixa de pegar você desprevenido.`,
  },
  'demo-combrasil-exemplo-oferta': {
    o_que_aconteceu: `Este é um exemplo do tipo de sinal que só a checagem direta de loja ou site do concorrente captura — não é dado coletado agora, é ilustração de formato. No cenário ilustrado, a Tio João lança um combo promocional de arroz + feijão detectado em ponto de venda físico.\n\nPromoção pontual desse tipo raramente vira notícia de imprensa — ela existe só na loja, por alguns dias, e depois desaparece sem deixar rastro público. É exatamente o tipo de movimento que uma fonte baseada em notícia não tem como capturar.`,
    por_que_importa: `Uma promoção pontual pode ser exatamente o que testa, por alguns dias, se o cliente troca de marca só por causa de preço — um experimento barato pro concorrente descobrir o quanto a sua vantagem de marca realmente vale, sem comprometer o preço de tabela dele.\n\nSe esse teste se repetir e funcionar, tende a virar prática recorrente — e a essa altura, o motivo pelo qual o cliente te escolhia já foi corroído aos poucos, sem nenhuma notícia pra marcar o momento em que isso começou.`,
    onde_afeta: `Afeta o momento exato em que o cliente decide entre a sua marca e a do concorrente, dentro da loja — não dá pra ver isso de longe, só no ponto onde a decisão realmente acontece.\n\nEsse tipo de sinal também afeta a leitura de tendência: uma promoção isolada é ruído; a mesma promoção repetida em datas específicas é um padrão de calendário que revela como o concorrente pensa a própria estratégia de preço.`,
    risco: `O risco de não enxergar esse tipo de sinal é achar que o motivo pelo qual o cliente te escolhe é estável, quando na verdade ele já está sendo testado, promoção após promoção, sem que nenhuma métrica formal capture isso a tempo.\n\nHá também o risco de subestimar o efeito cumulativo: uma promoção isolada não muda nada; um padrão recorrente pode mudar o hábito de compra do cliente de forma permanente, sem um evento óbvio que sirva de alerta.`,
    oportunidade: `Enxergar esse tipo de movimento cedo permite entender se o cliente está migrando por preço ou se a sua vantagem de marca segue intacta — a diferença entre reagir a uma ameaça real e reagir a um evento isolado sem repetição.\n\nTambém abre a possibilidade de identificar um padrão de calendário no concorrente — se ele promove sempre nas mesmas datas, isso vira previsível, e o que é previsível pode ser antecipado em vez de apenas respondido.`,
  },
  'demo-combrasil-exemplo-site': {
    o_que_aconteceu: `Este é um exemplo do tipo de leitura que o rastreamento de site institucional traz — não é dado coletado agora, é ilustração de formato. No cenário ilustrado, a Broto Legal adiciona um SKU novo ao catálogo digital, sinal de expansão de portfólio em curso.\n\nMudança de catálogo costuma anteceder o lançamento oficial em semanas — o site é atualizado antes de qualquer campanha de mídia, porque a estrutura de e-commerce e distribuição precisa estar pronta antes do anúncio público.`,
    por_que_importa: `Site institucional é onde a intenção do concorrente aparece antes de virar notícia — é a chance de ver o que pode te distinguir, ou te igualar, antes de qualquer campanha de mídia tornar isso público. Quando o SKU já está no catálogo, a decisão já foi tomada; a única pergunta que resta é quando o mercado vai saber.\n\nO motivo pelo qual isso importa mais do que parece é que o custo de reagir cedo costuma ser bem menor do que reagir depois que a campanha já consolidou o produto na cabeça do cliente.`,
    onde_afeta: `Afeta diretamente o seu portfólio de grãos — mostra com antecedência se um concorrente está mirando um motivo de escolha que hoje só você oferece, ou se está apenas ampliando uma linha que já compete com a sua sem trazer nada novo.\n\nTambém afeta o tempo de resposta disponível: entre a mudança de catálogo e o lançamento oficial existe uma janela de semanas — é justamente esse intervalo que separa quem reage a tempo de quem só descobre depois que já é tarde.`,
    risco: `O risco de não acompanhar esse tipo de sinal é descobrir o novo produto do concorrente só quando a campanha de lançamento já está no ar — nesse ponto, o que te distinguia já não é mais verdade, mesmo que você reaja rápido a partir daí.\n\nHá também o risco de tratar catálogo digital como informação neutra, sem conectar ao que ele revela sobre a direção estratégica do concorrente — um SKU novo isolado pode não significar nada; um padrão de SKUs novos na mesma direção costuma significar bastante.`,
    oportunidade: `A janela entre a mudança de catálogo e o lançamento oficial é a oportunidade em si: dá tempo de decidir se vale correr na frente com algo parecido, reforçar o que já te distingue nesse mesmo ponto de decisão do cliente, ou ignorar por não ser relevante — mas a decisão é tomada com antecedência, não em cima da hora.\n\nEsse tipo de leitura também ensina o padrão de lançamento do concorrente ao longo do tempo — quantas semanas ele costuma levar entre catálogo e campanha — o que tende a tornar o próximo lançamento dele ainda mais previsível.`,
  },
  // McDonald's — Lote 1 (ago/2026), Google News RSS: Burger King, KFC,
  // Giraffas, Habib's, Keeta. Ver docs/MODELO_MOTOR_OS1.md, "Método de
  // geração em lote". Feed card correspondente em demo-feed-cards.ts.
  'demo-mcdonalds-burgerking': {
    o_que_aconteceu: `Depois de 20 anos de parceria, o Burger King deixou a Pepsi e passou a servir Coca-Cola no Brasil (Valor Econômico, Meio&Mensagem e outros, 14/mai/2026). A cobertura não especifica se a troca já vale pra todas as unidades ou é gradual.`,
    por_que_importa: `Ter Coca-Cola no balcão sempre foi um dos pontos de comparação mais simples entre redes de fast food — é o tipo de detalhe que o cliente nota sem pensar. O que te distinguia do Burger King nesse ponto específico deixou de existir: os dois agora servem a mesma marca.`,
    onde_afeta: `Afeta o momento exato da comparação de cardápio — não o produto principal (hambúrguer), mas o combo como um todo, onde a bebida historicamente pesava a favor de quem tinha Coca-Cola.`,
    risco: `O risco não é perder cliente por causa da bebida isoladamente — é presumir que esse pequeno diferencial ainda existe quando ele já não existe mais, e continuar comunicando como se fosse exclusivo.`,
    oportunidade: `Como a mudança é recente, o Burger King ainda não teve tempo de comunicar isso como vantagem própria — existe uma janela pra reforçar outros pontos do combo (qualidade, velocidade, McCafé) antes que ele capitalize a paridade recém-criada.`,
  },
  'demo-mcdonalds-kfc': {
    o_que_aconteceu: `A IMC vendeu sua participação total no KFC Brasil pra Kentucky Foods Chile por R$137 milhões (VEJA, 30/dez/2025). Dias antes, o KFC já havia anunciado plano de abrir até 60 lojas em 2026 com foco em drive-thru (Estadão, 22/dez/2025), com meta de chegar a 500 lojas até 2030 (dcomercio.com.br, 26/dez/2025).`,
    por_que_importa: `Drive-thru é um dos motivos clássicos pelos quais o cliente te escolhe em vez de uma opção sem esse formato. Um concorrente trocando de dono às vésperas de expandir justamente nesse formato muda o ritmo em que essa vantagem específica pode ser copiada.`,
    onde_afeta: `Afeta a comparação direta em qualquer praça onde McDonald's e KFC disputam o mesmo fluxo de carro — hoje uma vantagem menos discutida, porque o KFC historicamente não competia forte nesse formato no Brasil.`,
    risco: `O risco é tratar essa venda como ruído societário e não notar que ela veio empacotada com um plano de expansão específico — dono novo com capital costuma acelerar o que o dono anterior projetava devagar.`,
    oportunidade: `Enquanto a nova gestão ainda está estruturando as primeiras unidades, existe uma janela pra reforçar o que já sustenta a preferência por drive-thru hoje — tempo de espera, ticket, fila — antes que o KFC tenha escala nesse formato.`,
  },
  'demo-mcdonalds-giraffas': {
    o_que_aconteceu: `O Giraffas projeta crescimento de 8,5% pra 2026 (DComercio, 7/mar/2025) e mira R$1,1 bilhão de faturamento no ano, apostando em "picanha no prato-feito" como carro-chefe (NeoFeed, 29/mai/2026).`,
    por_que_importa: `O prato-feito não compete pelo mesmo motivo de escolha que o hambúrguer — é uma ocasião de consumo diferente (refeição "de verdade" x lanche rápido). Esse motivo de escolha nunca foi seu nem do Giraffas historicamente, mas agora ganhou investimento e meta pública por trás.`,
    onde_afeta: `Afeta o cliente que hoje evita hambúrguer no almoço por achar que "não é refeição de verdade" — um público que McDonald's não disputa ativamente hoje, mas que o Giraffas está tentando consolidar como hábito.`,
    risco: `O risco é tratar isso como fora da categoria e por isso irrelevante — ocasião de consumo nova raramente aparece grande de início, ela cresce enquanto ninguém do lado do hambúrguer está prestando atenção.`,
    oportunidade: `Como esse motivo de escolha ainda não tem dono consolidado, existe espaço pra decidir conscientemente se vale disputar esse público (ex.: opções de refeição mais completa) ou reforçar o que já distingue o hambúrguer como escolha própria, sem tentar competir na frente do concorrente.`,
  },
  'demo-mcdonalds-habibs': {
    o_que_aconteceu: `O Habib's investe R$6 milhões pra dobrar o número de lojas compartilhadas com a marca Ragazzo (Pequenas Empresas & Grandes Negócios, 7/jan/2025). O modelo reduz o custo de abrir cada ponto novo, já que duas marcas dividem a mesma estrutura.`,
    por_que_importa: `O que te distingue por ter loja própria, com formato e experiência mais robustos, pode contar menos como vantagem se o concorrente consegue multiplicar pontos de venda a um custo bem menor por unidade — é uma disputa de eficiência, não de qualidade.`,
    onde_afeta: `Afeta praças menores ou de segunda linha, onde o custo de abrir uma loja no formato tradicional é o que hoje freia a expansão de qualquer rede — inclusive a sua.`,
    risco: `O risco é medir esse concorrente pelo número de lojas "de verdade" e não notar o modelo híbrido crescendo em paralelo, justamente por parecer pequeno demais pra entrar no radar de comparação direta.`,
    oportunidade: `Enquanto o modelo compartilhado ainda está em expansão, dá pra observar quais praças ele está ocupando primeiro — geralmente aponta pra onde a demanda de fast food já existe mas ainda não tem oferta suficiente.`,
  },
  'demo-mcdonalds-keeta': {
    o_que_aconteceu: `O Keeta, app de delivery chinês, chegou a São Paulo em 26/nov/2025 (O Globo, Mobile Time, Folha, UOL) com cerca de 27 mil restaurantes parceiros já no lançamento, R$1 bilhão investido na operação e cupons de até R$200 pra novos usuários (TecMundo).`,
    por_que_importa: `Sua vantagem de preço no delivery — a diferença entre o que o cliente paga pelo mesmo pedido em canais distintos — fica mais difícil de sustentar quando um concorrente entra subsidiando pesado desde o primeiro dia, ainda que o subsídio não seja permanente.`,
    onde_afeta: `Afeta diretamente o pedido feito por delivery, onde cupom e taxa pesam mais na decisão do que marca — é o ponto de venda onde o cliente compara preço final, não experiência de loja.`,
    risco: `O risco é ler isso só como "mais um app" e não perceber que subsídio agressivo de entrada costuma alterar hábito de comparação de preço do cliente enquanto dura, mesmo que depois se normalize.`,
    oportunidade: `Enquanto o Keeta ainda está em fase de aquisição de usuário via cupom, a disputa é dele contra o iFood, não necessariamente contra sua marca — abre uma janela pra observar como a guerra entre apps se resolve antes de decidir se vale ajustar presença em algum canal específico.`,
  },
  // McDonald's — Lote 2 (ago/2026): Subway, Madero, Burger King (expansão),
  // Bob's, 99Food. Substitui o card de Popeyes (disputa entre terceiros, sem
  // McDonald's no meio) por um segundo ângulo do Burger King.
  'demo-mcdonalds-subway': {
    o_que_aconteceu: `Depois da recuperação judicial de 2024, o Subway foi comprado pela Zamp — mesma controladora do Burger King no Brasil — e já mostra vendas 30% maiores (Exame, 14/ago/2025), além de reconstruir relação com franqueados um ano após a aquisição (PEGN, 24/out/2025).`,
    por_que_importa: `A distância que se abriu com o Subway em crise não era permanente — era efeito de um momento financeiro específico. Um concorrente recuperado, sob dono com capital e experiência em fast food, tende a voltar a disputar o mesmo motivo de escolha que ficou mais fácil de vencer enquanto ele estava fragilizado.`,
    onde_afeta: `Afeta o público que busca opção percebida como mais saudável ou mais rápida pro almoço — motivo de escolha que o Subway disputava com força antes da crise e volta a disputar agora.`,
    risco: `O risco é continuar lendo o Subway pela imagem de crise de 2024, quando o dado mais recente já mostra recuperação de vendas e reaproximação com quem opera as lojas — realidade desatualizada custa reação atrasada.`,
    oportunidade: `Enquanto a recuperação ainda está em curso, existe uma janela pra observar se a Zamp está injetando cruzamento (marketing, insumo, real estate) entre BK e Subway — dois ativos da mesma controladora tendem a aprender rápido um com o outro.`,
  },
  'demo-mcdonalds-madero': {
    o_que_aconteceu: `O Madero lucrou R$103 milhões em 2025 sobre receita bruta de R$2,3 bilhões, encerrando o ano com 355 restaurantes (InfoMoney, 29/jan/2026; Giro News, 30/jan/2026) — e passou a testar dark kitchens e operação de empanada focada em delivery, formato de ticket mais baixo do que o hambúrguer de balcão da marca.`,
    por_que_importa: `O Madero sempre disputou um motivo de escolha diferente do seu — ticket alto, experiência de restaurante. Um movimento de teste em formato de baixo ticket via delivery é um concorrente premium entrando, mesmo que discretamente, num motivo de escolha que costumava ser mais seu do que dele.`,
    onde_afeta: `Afeta o pedido de delivery de ticket médio-baixo — não o hambúrguer artesanal em si, mas a ocasião de "comida rápida entregue em casa", onde o Madero historicamente não competia.`,
    risco: `O risco é ignorar esse teste por parecer pequeno e fora do core do Madero — movimento que nasce como piloto discreto tende a ser exatamente o tipo de entrada que passa despercebida até já ter escala.`,
    oportunidade: `Como ainda é fase de teste, dá pra observar se o formato de baixo ticket do Madero repete a qualidade premium da marca ou se é uma versão simplificada — a resposta tende a dizer se vale mesmo como ameaça ao seu ticket médio de delivery.`,
  },
  'demo-mcdonalds-burgerking-expansao': {
    o_que_aconteceu: `O Burger King abriu 19 novas lojas em janeiro de 2025, sinalizando expansão por todo o Brasil (Promoview, 15/jan/2025), e fechou 2025 acelerando ainda mais — 25 inaugurações só em dezembro (Portal Mie, 8/dez/2025), com plano de continuar em 2026.`,
    por_que_importa: `Ser a opção mais fácil de encontrar é um motivo de escolha tão relevante quanto sabor ou preço, principalmente pra quem decide por fast food no impulso, sem planejamento. Um concorrente acelerando abertura de loja nesse ritmo está disputando ativamente esse motivo específico, loja por loja.`,
    onde_afeta: `Afeta o cliente que escolhe fast food por estar mais perto no momento da fome — decisão de conveniência, não de preferência de marca. Cada loja nova do concorrente nessa categoria de decisão é uma chance a menos de ser a opção mais próxima.`,
    risco: `O risco é medir esse concorrente pelo total de lojas que ele já tem hoje, sem acompanhar o ritmo de abertura — 25 lojas num mês só é sinal de aceleração, não de manutenção do passo normal, e ritmo acelerado tende a continuar até encontrar algum limite.`,
    oportunidade: `Enquanto o ritmo de abertura do concorrente ainda está concentrado em praças específicas, existe uma janela pra mapear onde ele está mirando primeiro — histórico de expansão costuma seguir um padrão (shopping, avenida principal, bairro novo) que se repete loja após loja.`,
  },
  'demo-mcdonalds-bobs': {
    o_que_aconteceu: `O Bob's inaugurou, após reforma de R$800 mil, uma loja no Rio de Janeiro com robô que prepara milkshakes (InfoMoney, 19/jul/2025) — piloto de automação numa única unidade.`,
    por_que_importa: `Automação de preparo costuma prometer duas coisas ao mesmo tempo: consistência de produto e redução de custo de mão de obra — dois pontos que, se comprovados nesse piloto, tendem a se espalhar rápido pra outras unidades da rede, inclusive fora do Rio.`,
    onde_afeta: `Afeta diretamente a categoria de bebidas/sobremesas do cardápio, onde consistência de preparo (mesmo sabor, mesma textura, toda vez) costuma pesar na percepção de qualidade do cliente.`,
    risco: `O risco é tratar isso como curiosidade de uma loja só e não como piloto — testes de automação em fast food raramente ficam restritos à unidade onde nasceram quando comprovam ganho de custo.`,
    oportunidade: `Como é só uma unidade até agora, existe tempo pra acompanhar se o piloto expande antes de qualquer decisão precisar ser tomada — automação copiada tarde tende a custar mais do que automação testada a tempo.`,
  },
  'demo-mcdonalds-99food': {
    o_que_aconteceu: `O 99Food voltou a operar em São Paulo com R$500 milhões investidos (Mercado&Consumo, 12/ago/2025) e zerou taxas de restaurantes por 2 anos "contra o monopólio do delivery" (UOL Economia, 29/abr/2025) — já expandindo pra Recife e Belo Horizonte com mais R$100 milhões cada (Canaltech, 28/nov/2025; 14/nov/2025).`,
    por_que_importa: `Comissão de delivery é custo direto sobre cada pedido — não é benefício pro cliente, é estrutura de custo sua. Um concorrente de peso zerando essa taxa por 2 anos muda o que "custa competir" nesse canal, mesmo sem mexer em preço nenhum do seu cardápio.`,
    onde_afeta: `Afeta diretamente a margem de cada pedido feito por delivery — o efeito não aparece no preço que o cliente vê, aparece no que sobra depois da comissão — e também pressiona a decisão de qual app priorizar, já que um canal com comissão zero tende a virar mais atrativo pra operar do que os termos negociados hoje com iFood e outros.`,
    risco: `O risco é comparar apps só pelo volume de pedido que trazem hoje, sem notar que "comissão zero por 2 anos" tem prazo — quando o prazo acabar, o app que capturou volume nesse período tende a negociar de posição mais forte, não mais fraca.`,
    oportunidade: `Enquanto durar a comissão zero, existe uma janela real pra operar nesse canal com margem melhor do que a negociada hoje em outros apps — vale considerar se faz sentido priorizar volume ali enquanto a condição estiver ativa.`,
  },
  // Pacheco — ago/2026: CVM (ITR 2026), IBGE/SIDRA, CMED, OSM/Overpass.
  // Ver docs/kiq-pacheco.md (KIQs + as duas passadas de pesquisa) e
  // docs/pendencias-e-alcancabilidade.md (pch-1..12 seguem fictícios).
  'demo-pacheco-paguemenos': {
    o_que_aconteceu: `A Pague Menos, concorrente nacional de capital aberto, saiu de R$52,1 milhões de lucro líquido no 1º trimestre de 2026 para R$71,2 milhões no 2º — alta de 36,7% em três meses, segundo o balanço enviado à CVM (ITR 2026). A imprensa registrou o mesmo movimento ao longo do ano: lucro de R$286,6 milhões em 2025 (Visno Invest, 27/fev/2026), salto de 325,6% no 1T26 (MoneyTimes, 5/mai/2026) e redução de alavancagem no 2T26 (ADVFN, 4/ago/2026).`,
    por_que_importa: `Antes desse movimento, a Pague Menos vinha de um período de dificuldade financeira que costuma tirar fôlego de investimento em preço, marketing e expansão — exatamente o tipo de disputa que sustenta ou corrói o motivo pelo qual um cliente te escolhe e não a vizinha. Concorrente recuperando fôlego tende a voltar a investir justo nesses pontos.`,
    onde_afeta: `Afeta o motivo de escolha mais sensível a preço e disponibilidade — o cliente que hoje te escolhe em parte porque a alternativa parecia menos capaz de sustentar promoção ou ampliar cobertura. Esse argumento perde força na mesma medida em que o concorrente recupera capacidade financeira.`,
    risco: `O risco não é a recuperação em si — é continuar lendo a Pague Menos pela imagem de fragilidade que ela tinha até pouco tempo atrás, quando o balanço mais recente já mostra outra realidade.`,
    oportunidade: `Enquanto o reforço financeiro da Pague Menos ainda não virou investimento comercial visível, existe uma janela pra reforçar o que já te distingue hoje, antes que a resposta dela apareça no ponto de venda.`,
  },
  'demo-pacheco-rdsaude-escala': {
    o_que_aconteceu: `Cruzando os balanços de RD Saúde e Pague Menos enviados à CVM pro 2º trimestre de 2026, a RD Saúde faturou R$11,06 bilhões — quase 3 vezes os R$3,99 bilhões da Pague Menos — com margem líquida em torno de 3,8%, quase o dobro dos ~1,8% da Pague Menos.`,
    por_que_importa: `Nem todo concorrente que disputa cliente com você tem a mesma capacidade de sustentar essa disputa por muito tempo. Um concorrente com escala e margem muito maiores absorve período de preço agressivo ou investimento em marca sem comprometer o caixa — muda quanto tempo uma pressão competitiva dele tende a durar.`,
    onde_afeta: `Afeta a leitura de qual concorrente pesa mais quando os dois competem pelo mesmo cliente ao mesmo tempo — presumir que todo concorrente nacional tem o mesmo fôlego financeiro pode levar a subestimar justamente o mais difícil de superar.`,
    risco: `O risco é tratar RD Saúde e Pague Menos como ameaças equivalentes só por serem as duas redes nacionais de capital aberto — a diferença de escala e margem entre elas muda qual delas tende a sustentar uma disputa por mais tempo.`,
    oportunidade: `Saber qual concorrente tem mais fôlego financeiro ajuda a calibrar onde vale disputar palmo a palmo e onde vale mais reforçar o que já te distingue sem entrar em guerra de preço.`,
  },
  'demo-pacheco-territorio-rj': {
    o_que_aconteceu: `Um levantamento no OpenStreetMap, mapa colaborativo aberto, identificou 66 pontos com o nome Pacheco na cidade do Rio de Janeiro — contra 37 somando Droga Raia e Drogasil (RD Saúde) e 7 da Pague Menos. Panvel, Farmácias São João e Onofre não aparecem no mapeamento da cidade.`,
    por_que_importa: `Ser a opção mais fácil de encontrar no momento em que o cliente precisa é um dos motivos de escolha mais simples e mais difíceis de copiar rápido — não se constrói em poucos meses. O número de pontos mapeados sugere que essa vantagem ainda está do seu lado, por uma margem grande.`,
    onde_afeta: `Afeta a decisão do cliente que escolhe farmácia por estar mais perto no momento da necessidade — decisão de conveniência, não necessariamente de preferência de marca. É também o motivo de escolha mais visado por concorrente que queira crescer via abertura de loja.`,
    risco: `O risco não é essa vantagem ser pequena — é presumir que ela é permanente. OpenStreetMap é mapa colaborativo, não censo oficial: o número real pode variar, e qualquer concorrente que acelere abertura de loja no Rio reduz essa distância com o tempo, não de uma vez.`,
    oportunidade: `Enquanto a distância nesse ponto específico segue grande, vale reforçar ativamente esse motivo de escolha na comunicação — em vez de deixá-lo implícito — antes que algum concorrente feche parte dela com expansão própria.`,
  },
  'demo-pacheco-custo-setorial': {
    o_que_aconteceu: `O grupo "Saúde e cuidados pessoais" do IPCA acumula alta de 4,07% no ano até junho de 2026 — acima dos 3,36% do índice geral (IBGE/SIDRA, tabela 7060). No mesmo período, a CMED autorizou reajuste máximo de 3,81% pra medicamentos, vigente desde 1º de abril de 2026 (G1, Folha, CBN, JOTA Info, 31/mar/2026).`,
    por_que_importa: `Custo subindo mais rápido que a inflação geral não afeta toda farmácia do mesmo jeito — quem consegue absorver parte desse custo (escala de compra, marca própria, mix de categoria) sustenta preço final por mais tempo do que quem repassa de imediato.`,
    onde_afeta: `Afeta toda a operação de precificação e compra de medicamento, mas o efeito real depende de como a compra de insumo está estruturada — contrato com fornecedor, prazo de reposição, mix entre genérico e marca — não só do teto de reajuste em si.`,
    risco: `O risco é tratar esse reajuste como igual pra todo mundo e não perceber que ele testa, na prática, quem tem estrutura de compra mais eficiente — isso costuma aparecer só depois, na margem.`,
    oportunidade: `Entender de que lado desse aumento de custo a sua operação está — mais perto de quem absorve ou de quem repassa — é mais barato de resolver agora do que depois que a margem já apertou.`,
  },
};

function buildDenseTestBlock(card: IntelligenceCard, mode: MainKey, difficulty: Dificuldade): WorkspaceBlock {
  return {
    id:         `blk-mode-${mode}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    cardId:     card.id,
    mode,
    subKey:     'mode',
    subLabel:   MODE_TITLES[mode],
    endpoint:   null,
    result:     { _ctx: DENSE_TEST_CTX[card.id] },
    difficulty,
    pinned:     false,
    createdAt:  new Date().toISOString(),
    kind:       'mode',
  };
}

// Conteúdo do bloco de modo (Entender / Executar / Aprender) — fallback local.
export function buildModeBlock(card: IntelligenceCard, mode: MainKey, difficulty: Dificuldade): WorkspaceBlock {
  if (DENSE_TEST_CTX[card.id] && mode === 'executar') {
    return buildDenseTestBlock(card, mode, difficulty);
  }
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
        ? `O tema "${titulo}" é hipótese a validar sobre ${dom} no seu negócio. Não tratar como leitura medida — ainda depende de dado interno antes de qualquer conclusão.`
        : `O sinal "${titulo}" indica movimento concreto sobre ${dom}, com urgência ${urg}. Não é ruído isolado — combinado com indicadores correlatos, sugere mudança em curso que merece sua atenção nas próximas ${janela}.`,
      resumo_sinal:        `${resumo} O dado por trás disso normalmente vem da combinação de comportamento do seu cliente, movimento de concorrentes e variação interna de operação sobre ${dom}.`,
      por_que_importa:     card.por_que_importa
        ? (isHyp
            ? `${card.por_que_importa} Por ser hipótese, o foco é validar com indicador simples antes de comprometer recursos.`
            : `${card.por_que_importa} Ignorar significa abrir espaço pra concorrentes locais consolidarem posição enquanto o problema cresce.`)
        : (isHyp
            ? `Tema relevante em termos de ${dom} pro seu negócio, mas depende de validação com dado interno antes de virar ação ampla.`
            : `Esse sinal toca diretamente ${dom} no seu negócio e pode antecipar mudanças mais amplas — tratar antes dos pares tende a abrir vantagem competitiva; não tratar tende a significar perder terreno numa janela curta.`),
      pode_estar_por_tras: `Variações sobre ${dom} costumam refletir três vetores: (1) mudança no comportamento do seu cliente local, (2) movimento de concorrente próximo, (3) ajuste interno de operação ou equipe. Identificar qual vetor predomina costuma ser o primeiro filtro pra decisão.`,
      risco_ignorar:       isHyp
        ? `Sem dado medido, qualquer previsão numérica é palpite. O risco editorial aqui é tratar a hipótese como fato — trate como monitoramento até haver evidência suficiente.`
        : (urg === 'alta'
            ? `Alto — tende a pedir reação mais rápida que o normal. Concorrentes tendem a se antecipar, e a inação tende a tornar a recuperação progressivamente mais trabalhosa quanto mais tempo passa.`
            : urg === 'media'
              ? `Moderado — costuma valer monitorar a evolução nos próximos dias. O maior risco tende a ser normalizar a piora aos poucos e deixar passar o momento mais barato de agir.`
              : `Baixo — tende a valer manter acompanhamento periódico. O risco principal costuma ser o sinal sair do radar e só ser percebido quando já estiver mais visível.`),
      oportunidade_agir:   isHyp
        ? `Se a hipótese se confirmar com dado interno, abre espaço pra você calibrar melhor a decisão sobre ${dom}. Por ora, o ganho está em ter uma base antes de qualquer resposta mais ampla.`
        : `Reagir antes dos pares tende a te posicionar como referência sobre ${dom} na região — esse tipo de janela costuma se fechar com o tempo: depois de um ponto, os pares tendem a copiar ou o sinal vira commodity.`,
      observar_agora:      `Indicador direto sobre ${dom} (medição semanal), variação de avaliação pública (Google/iFood), comportamento de concorrentes próximos (mídia local + posts orgânicos), feedback qualitativo da sua equipe de linha de frente. Vale cruzar pelo menos 2 desses sinais nos próximos ${urg === 'alta' ? '7' : '30'} dias.`,
      impacto_negocio:     isHyp
        ? `Sem dado interno medido, não estimar impacto numérico. Vale acompanhar o tema com indicador próprio antes de discutir efeito em vendas, margem ou reputação.`
        : `Em vendas: tende a pesar no seu ticket médio e na frequência de compra se não houver resposta. Em reputação: nota pública em queda costuma reduzir conversão de novos clientes. Em operação: tende a aumentar a pressão sobre rotina e clima de equipe. Em margem: tende a pesar mais quanto mais tempo o sinal ficar sem leitura.`,
      hipotese:            `Hipótese principal: ${resumo} reflete movimento real do mercado sobre ${dom}, com janela curta de reação. Hipótese alternativa: pode ser flutuação sazonal ou ruído de medição — vale confirmar com 1-2 indicadores adicionais antes de decisão grande.`,
      proximo_passo:       isHyp
        ? `1) Definir 1 indicador interno simples para checar a hipótese. 2) Atribuir 1 responsável pela leitura. 3) Revisar quando a primeira medição estiver disponível. 4) Só depois discutir plano amplo.`
        : `1) Validar hipótese cruzando com 2 indicadores adicionais em 7 dias. 2) Se confirmada, executar ${acao}. 3) Definir KPI semanal de ${dom} com meta numérica. 4) Marcar revisão em ${urg === 'alta' ? '14' : '30'} dias com gestor responsável.`,
    };
  } else if (mode === 'executar') {
    result = {
      o_que_esta_em_jogo: isHyp
        ? `A hipótese "${titulo}" ainda não tem confirmação em ${dom} — o que está em jogo é a diferença entre um padrão real e uma flutuação pontual, algo que só um indicador interno consegue separar.`
        : `O que está em jogo em ${dom} é a distância entre reagir cedo e reagir tarde: sinais desse tipo tendem a crescer em custo de recuperação quanto mais tempo passam sem leitura.`,
      diagnostico:         isHyp
        ? `Hipótese: ${resumo} Por ora é tema sem dado interno medido — não é diagnóstico, é leitura editorial; costuma valer a pena observar com 1 indicador simples antes de tirar conclusões.`
        : `Situação atual: ${resumo} Sintoma principal em ${dom}. Causas prováveis costumam ser: (a) movimento competitivo, (b) gap operacional interno, (c) mudança no comportamento do cliente — identificar qual predomina tende a mudar a leitura do caso.`,
      por_onde_costuma_comecar: isHyp
        ? `Nesses casos, o padrão costuma ser começar pela leitura mais simples possível: uma conversa com a equipe e um indicador interno já acessível, sem comprometer recursos antes disso.`
        : `Nesses casos, o ponto de partida mais comum costuma ser a validação mais barata: uma conversa com quem está na ponta e a checagem de um indicador já disponível — costuma levar pouco tempo e evita seguir uma leitura errada.`,
      caminhos_possiveis: isHyp
        ? `Um caminho comum é validar a hipótese com um indicador interno simples antes de qualquer coisa; só depois da leitura é que costuma fazer sentido diferenciar entre monitoramento contínuo ou uma resposta mais estruturada.`
        : `Os caminhos que costumam aparecer aqui vão de um diagnóstico mais aprofundado até uma resposta pontual e localizada — a escolha tende a depender de quanto o sinal já se confirmou em mais de um indicador.`,
      quem_costuma_ser_afetado: `Sinais como esse costumam tocar ${dom} no seu negócio diretamente e, em seguida, atendimento e percepção do cliente — áreas que tendem a sentir o efeito primeiro são essas. Sua equipe mais próxima da operação geralmente nota a mudança antes de ela aparecer em indicadores formais.`,
      janela_de_tempo:     isHyp
        ? `O tempo até a leitura ficar clara depende da disponibilidade do dado interno — geralmente é uma questão de dias, não de meses, já que o propósito é só confirmar ou descartar o padrão.`
        : (urg === 'alta'
            ? `Situações com essa urgência costumam ter uma janela curta — os primeiros dias tendem a concentrar a maior parte do movimento, e o efeito costuma ficar mais visível dentro de duas semanas.`
            : `Situações como essa costumam evoluir num ritmo mais lento — o padrão tende a ficar mais claro ao longo de algumas semanas, com o efeito se consolidando perto de 30-60 dias.`),
      risco_antes:         `Situações parecidas costumam esbarrar em alguns pontos antes de virar decisão: se já existe algo semelhante em andamento, se há espaço de orçamento e equipe disponível, se há sensibilidade regulatória ou de imagem envolvida, e se o ganho esperado realmente compensa o esforço. Quando um desses pontos pesa mais, o caso tende a merecer mais cautela.`,
      como_saber_se_mudou: isHyp
        ? `Um sinal de que a hipótese se confirma costuma ser um padrão consistente em pelo menos 2 leituras do indicador interno; se a leitura não bater, o padrão tende a não se confirmar. Não é caso de meta numérica inventada — é caso de ter dado suficiente pra saber.`
        : `Sinais de que a situação mudou costumam aparecer primeiro no seu indicador direto sobre ${dom} voltando perto do nível anterior, seguido por estabilidade na nota pública e no ticket médio — quando os três se movem juntos, tende a ser um bom indício de que o quadro virou.`,
      cenarios_possiveis:  isHyp
        ? `Se a leitura não confirmar a hipótese, o tema tende a ficar como registro editorial revisitável, sem virar ação. Se confirmar, aí sim costuma abrir espaço pra uma resposta mais estruturada.`
        : `Alguns cenários costumam se desenhar a partir daqui: se a resposta inicial não render efeito em algumas semanas, a causa provável tende a estar mal identificada; se um concorrente se antecipar, a janela de reação tende a encurtar; se a capacidade interna for menor que o esperado, o escopo tende a precisar de ajuste.`,
      o_que_observar_a_seguir: isHyp
        ? `A partir daqui, o que costuma valer observar é qual indicador interno confirma ou descarta o padrão, e como ele se comporta na primeira leitura disponível.`
        : `Dali pra frente, o que costuma valer observar é como o seu indicador direto sobre ${dom} se comporta nas próximas semanas, se a nota pública se estabiliza, e se concorrentes próximos reagem primeiro — esses três sinais juntos tendem a indicar se o quadro está mudando de verdade.`,
    };
  } else {
    result = {
      conceito:           `${dom} costuma funcionar como termômetro operacional do seu negócio nessa área. Quando um sinal aparece ali, raramente é só sobre esse ponto isolado — costuma ser sobre como a operação como um todo está respondendo a mudanças. Tratar bem esse sinal tende a evitar problemas em cascata.`,
      explicacao_simples: `Pense em ${dom} como um indicador de saúde da sua operação: se algo está fora do esperado, costuma ser a primeira pista de que algo maior pode estar mudando. Ler esse sinal cedo tende a sair mais barato do que reagir tarde, quando o impacto já está visível.`,
      por_que_negocio:    card.por_que_importa
        ? `${card.por_que_importa} No nível estratégico, isso tende a afetar a percepção do cliente, a margem operacional e a sua capacidade de reagir a movimentos competitivos.`
        : `Sinais como este tendem a antecipar problemas maiores e oportunidades de diferenciação. Aprender a ler esse tipo de sinal cedo costuma abrir vantagem sobre concorrentes que só reagem quando o impacto já é público.`,
      exemplo:            `Caso A: uma empresa comparável reagiu a um sinal parecido sobre ${dom} com uma resposta na linha de "${acao}" e viu o indicador se recuperar. Caso B: outra rede ignorou um sinal parecido por um bom tempo e perdeu fluxo orgânico que levou meses pra recuperar. Padrão: agir cedo tende a custar pouco; agir tarde tende a custar muito mais.`,
      erro_comum:         `Três erros típicos: (1) agir antes de confirmar a causa raiz — gasta energia em solução errada; (2) delegar sem responsável claro — vira "todo mundo cuida ninguém cuida"; (3) ignorar a janela de reação adequada — toma decisão tarde demais quando o ganho já evaporou.`,
      como_medir:         `Sinal principal a acompanhar: indicador direto sobre ${dom} (medição periódica). Indicador de apoio: avaliação pública (Google/iFood/redes sociais). Sinal de impacto: ticket médio e frequência. Acompanhar mais de perto logo no início costuma valer a pena, espaçando conforme o padrão se estabiliza.`,
      empresa_madura:     `Empresas mais maduras nesse tipo de sinal costumam ter um ritual periódico de revisão do indicador, com responsável formal e meta clara. Quando um sinal aparece, tende a haver um protocolo de resposta já definido, e o aprendizado costuma ficar registrado pra repetir a resposta na próxima vez.`,
      aplicar_caso:       `No caso de "${titulo}", costuma valer cruzar o sinal com outros indicadores antes de tirar conclusão, ter clareza de quem acompanha e qual é a meta, tratar a primeira resposta como piloto antes de ampliar, medir o resultado depois de um tempo razoável, e guardar o aprendizado pra situações parecidas no futuro.`,
      proximo_nivel:      `Subir de nível costuma significar sair da reação manual pra uma resposta mais proativa: cruzar esse tipo de sinal automaticamente com indicadores externos (concorrência, mercado, sazonalidade), antecipar-se com mais folga, e ter um playbook documentado por tipo de sinal sobre ${dom}.`,
      regra_lembrar:      `Quando aparecer um novo sinal sobre ${dom} com urgência ${urg}, ${urg === 'alta' ? 'tende a valer uma resposta mais rápida, com responsável definido' : 'tende a valer agendar uma revisão com KPI claro'}. Cruzar com outros indicadores antes de qualquer decisão grande costuma ser um bom hábito. Guardar o resultado como aprendizado pra próxima vez também costuma valer a pena.`,
    };
  }
  return {
    id:         `blk-mode-${mode}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    cardId:     card.id,
    mode,
    subKey:     'mode',
    subLabel:   MODE_TITLES[mode],
    endpoint:   null,
    result:     { ...result, _ctx: DENSE_TEST_CTX[card.id] ?? buildInitialContextFields(card) },
    difficulty,
    pinned:     false,
    createdAt:  new Date().toISOString(),
    kind:       'mode',
  };
}
