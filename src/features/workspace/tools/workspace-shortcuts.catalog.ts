// Catálogo curado de atalhos por área/contexto.
//
// Cada atalho segue o formato: [Tipo] Frase curta descritiva. CTA →
// Aqui só metadados + template do bloco gerado no clique. O seletor
// (workspace-shortcuts.selector.ts) escolhe 1-3 por contexto.

import type {
  WorkspaceShortcut,
  WorkspaceToolContext,
  ToolOutput,
} from '../../../core/types/workspace';
import {
  ctxPhrase,
  mkSensitive,
  urgencyWindow,
  SENSITIVE_NOTICE,
} from './workspace-tools.templates';

// Helper: bloco "simulador de impacto" reutilizável (3 cenários).
function simuladorImpactoOutput(ctx: WorkspaceToolContext, foco: string): ToolOutput {
  return {
    title: 'Simulador de impacto',
    context: `Três cenários para apoiar a decisão sobre ${ctxPhrase(ctx)} — foco em ${foco}.`,
    items: [
      'Cenário conservador: manter posição atual. Esperado: pouco movimento, baixa exposição.',
      'Cenário provável: ação moderada com responsável e acompanhamento semanal. Esperado: resultado visível em 30-60 dias.',
      'Cenário agressivo: ação ampla com investimento direto. Esperado: maior impacto, exige controle próximo.',
      `Indicador-chave a monitorar: ${foco}.`,
      `Janela de leitura: ${urgencyWindow(ctx.urgency)}.`,
      'Risco principal: subdimensionar custo ou perder janela.',
    ],
    expectedResult: 'Comparativo 3-cenários pronto para reunião de decisão.',
    nextStep: 'Definir qual cenário usar como referência e atribuir responsável.',
    sensitiveNotice: mkSensitive(ctx),
  };
}

// ─────────────────────────────────────────────────────────────────────
// CONCORRÊNCIA / MERCADO
// ─────────────────────────────────────────────────────────────────────
export const SHORTCUTS_CONCORRENCIA: WorkspaceShortcut[] = [
  {
    id: 'sc-conc-simulador',
    kind: 'ferramenta',
    tagline: 'Antes de reagir ao movimento do concorrente, simule o impacto em margem, volume e percepção de preço. Compare manter o valor, repassar o aumento ou ajustar a oferta sem mexer no preço final — para decidir com dado em mãos, não no escuro.',
    cta: 'Abrir simulador',
    appliesTo: ['concorrencia', 'mercado', 'preço', 'preco'],
    template: (ctx) => simuladorImpactoOutput(ctx, 'margem × volume'),
  },
  {
    id: 'sc-conc-referencia',
    kind: 'referencia',
    tagline: 'Veja como outras empresas reagiram a movimentos parecidos do concorrente — repassar gradual, segurar preço e capturar clientes ou reposicionar a oferta. Cada padrão tem custo e janela diferente; comparar antes de escolher evita reagir cedo demais ou tarde demais.',
    cta: 'Ver como fizeram',
    appliesTo: ['concorrencia', 'mercado'],
    template: (ctx) => ({
      title: 'Casos comparáveis',
      context: `Três padrões de resposta observados no mercado sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Padrão A — repassar gradual: aumento parcelado em 2-3 ciclos, comunicação clara ao cliente.',
        'Padrão B — manter e capturar: segurar preço por 30-60 dias, comunicar diferencial e capturar clientes do concorrente.',
        'Padrão C — reposicionar: manter preço e mudar oferta (bundle, atendimento, conveniência) para justificar diferença.',
        'Critério de escolha: ticket médio, elasticidade do cliente local, capacidade operacional.',
        'Risco de copiar sem adaptar: cada caso depende de capacidade interna e perfil de cliente.',
      ],
      expectedResult: 'Quadro com 3 padrões e quando cada um se aplica.',
      nextStep: 'Escolher 1 padrão e desenhar plano-piloto de 30 dias.',
    }),
  },
  {
    id: 'sc-conc-plano',
    kind: 'atalho',
    // C1-A: id renomeado de 'sc-conc-missao' pra 'sc-conc-plano' pra
    // alinhar com o rótulo visual "Preparar ação competitiva" — template
    // local, sem POST. Label visual preservado.
    tagline: 'Organize este sinal em uma ação prática para o time comercial: mapear preços do concorrente, revisar mix de oferta e propor 2 movimentos com prazo curto. O OS¹ separa etapas, responsável e métrica, evitando que vire só observação na reunião.',
    cta: 'Preparar ação competitiva',
    appliesTo: ['concorrencia', 'mercado'],
    template: (ctx) => ({
      title: 'Plano de resposta competitiva',
      context: `Plano para tratar ${ctxPhrase(ctx)} em ciclo curto.`,
      items: [
        'Objetivo: reagir ao movimento competitivo sem comprometer margem.',
        'Etapa 1 — Mapear 3 concorrentes mais próximos e seus preços/ofertas atuais.',
        'Etapa 2 — Revisar mix de oferta e identificar onde está a vantagem.',
        'Etapa 3 — Propor 2 movimentos: 1 conservador, 1 ousado.',
        `Prazo: ${urgencyWindow(ctx.urgency)} pra primeira leitura.`,
        'Métrica: ticket médio, volume, conversão local em 30 dias.',
      ],
      expectedResult: 'Plano atribuível pra time comercial.',
      nextStep: 'Atribuir responsável e iniciar pela etapa 1.',
    }),
  },
  {
    id: 'sc-conc-fornecedores',
    kind: 'conexao',
    tagline: 'Se o custo subiu para o mercado, procure alternativas antes de repassar ao cliente. Veja fornecedores próximos com capacidade equivalente, melhor prazo logístico e abertura para negociação — use isso como base para reduzir pressão de margem sem perder qualidade.',
    cta: 'Ver opções',
    appliesTo: ['concorrencia', 'mercado', 'compras', 'fornecedor'],
    template: (ctx) => ({
      title: 'Fornecedores próximos',
      context: `Mapa de fornecedores potenciais para reduzir custo relacionado a ${ctxPhrase(ctx)}.`,
      items: [
        'Critério 1 — proximidade geográfica (reduz prazo e custo logístico).',
        'Critério 2 — capacidade de atender o volume atual.',
        'Critério 3 — referência de qualidade equivalente.',
        'Critério 4 — disposição para negociação de prazo.',
        'Sugestão: cotar com 3 fornecedores em paralelo antes de trocar.',
      ],
      expectedResult: 'Lista de candidatos pra cotação.',
      nextStep: 'Solicitar cotação formal e comparar em 7 dias.',
    }),
  },
  {
    id: 'sc-conc-dado',
    kind: 'dado',
    tagline: 'Concorrente direto alterou condição de oferta dentro do raio monitorado — preço, formato de pagamento ou comunicação local mudaram. Considere isso como gatilho para revisão, não como crise imediata.',
    appliesTo: ['concorrencia', 'mercado'],
  },
];

// ─────────────────────────────────────────────────────────────────────
// FINANCEIRO
// ─────────────────────────────────────────────────────────────────────
export const SHORTCUTS_FINANCEIRO: WorkspaceShortcut[] = [
  {
    id: 'sc-fin-simulador',
    kind: 'ferramenta',
    tagline: 'Antes de comprometer caixa, simule o efeito da decisão nos próximos 30 dias. Veja entradas previstas, saídas obrigatórias e saldo projetado a cada semana — para identificar onde o caixa fica apertado e ajustar antes que vire urgência.',
    cta: 'Abrir simulador',
    appliesTo: ['financeiro', 'caixa', 'contas a pagar', 'contas a receber'],
    template: (ctx) => ({
      title: 'Simulador de caixa — 30 dias',
      context: `Projeção curta para apoiar decisão sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Entradas previstas (recebimentos confirmados).',
        'Saídas obrigatórias (folha, tributos, fornecedores críticos).',
        'Entradas variáveis (vendas previstas, comissões).',
        'Saídas variáveis (manutenções, eventuais).',
        'Saldo projetado no dia 15 e dia 30.',
        'Ponto de atenção: dias com saldo próximo do mínimo operacional.',
      ],
      expectedResult: 'Quadro semanal pra decisão.',
      nextStep: 'Atualizar diariamente até o fim do mês.',
    }),
  },
  {
    id: 'sc-fin-checklist',
    kind: 'atalho',
    tagline: 'Antes de aprovar custo novo ou cortar despesa, revise o que já está comprometido. O checklist organiza custos fixos, contratos recorrentes com baixa utilização, recebíveis em atraso e linhas de crédito disponíveis — para decidir sabendo o tamanho real da folga.',
    cta: 'Gerar checklist',
    appliesTo: ['financeiro', 'custos', 'orçamento'],
    template: (ctx) => ({
      title: 'Checklist de custos críticos',
      context: `Itens a revisar antes de decidir sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Custos fixos atuais e tendência das últimas 4 semanas.',
        'Contratos recorrentes com baixa utilização.',
        'Recebíveis em atraso e ações de cobrança.',
        'Linhas de crédito disponíveis com custo conhecido.',
        'Compromissos firmes nos próximos 30 dias.',
        'Provisões abertas (tributárias, trabalhistas, judiciais).',
      ],
      expectedResult: 'Checklist marcável pra discussão com tesouraria.',
      nextStep: 'Validar com responsável antes de comprometer caixa.',
    }),
  },
  {
    id: 'sc-fin-cenarios',
    kind: 'referencia',
    tagline: 'Veja o mesmo movimento em três cenários — conservador, provável e agressivo. Compare risco, tempo de retorno e exposição em cada um para evitar dimensionar a decisão pelo otimismo ou pelo medo isolado.',
    cta: 'Ver cenários',
    appliesTo: ['financeiro', 'caixa'],
    template: (ctx) => simuladorImpactoOutput(ctx, 'caixa em 30 dias'),
  },
  {
    id: 'sc-fin-conexao',
    kind: 'conexao',
    tagline: 'Antes de buscar crédito caro ou apertar operação, mapeie alternativas. Veja opções de renegociação com fornecedores, cobrança ativa, antecipação de recebíveis e linhas parceiras com custo conhecido — para destravar caixa pelo caminho de menor pressão.',
    cta: 'Ver opções',
    appliesTo: ['financeiro', 'credito', 'crédito'],
    template: (ctx) => ({
      title: 'Opções financeiras próximas',
      context: `Caminhos de curto prazo para tratar ${ctxPhrase(ctx)}.`,
      items: [
        'Renegociar prazo com fornecedores não-críticos.',
        'Acelerar cobrança ativa com desconto pontual.',
        'Avaliar linhas de antecipação de recebíveis disponíveis.',
        'Postergar investimento não essencial.',
        'Conversar com 2 instituições parceiras antes de fechar.',
      ],
      expectedResult: 'Lista de caminhos pra avaliar com tesouraria.',
      nextStep: 'Validar com responsável antes de comprometer.',
    }),
  },
];

// ─────────────────────────────────────────────────────────────────────
// FISCAL / CONTÁBIL (sensível — linguagem segura obrigatória)
// ─────────────────────────────────────────────────────────────────────
export const SHORTCUTS_FISCAL: WorkspaceShortcut[] = [
  {
    id: 'sc-fis-dado',
    kind: 'dado',
    tagline: 'Área sensível: trate como ponto de atenção para revisão preliminar, não como decisão final. Antes de qualquer ajuste em sistema ou comunicação externa, valide com o responsável fiscal/contábil — o OS¹ ajuda a organizar evidências, não a substituir o parecer humano.',
    appliesTo: ['fiscal', 'contabil', 'contábil'],
    sensitive: true,
  },
  {
    id: 'sc-fis-checklist',
    kind: 'atalho',
    tagline: 'Organize os pontos sensíveis antes do fechamento do período. O checklist separa regime tributário, alíquotas aplicadas, conciliação contábil x fiscal e pendências de validação — para o contador receber um pacote claro em vez de pergunta avulsa, e reduzir retrabalho na conferência.',
    cta: 'Gerar checklist',
    appliesTo: ['fiscal', 'contabil', 'contábil'],
    sensitive: true,
    template: (ctx) => ({
      title: 'Checklist de conferência fiscal',
      context: `Itens preliminares relacionados a ${ctxPhrase(ctx)}.`,
      items: [
        'Conferir regime tributário ativo e enquadramento atual.',
        'Validar alíquotas aplicadas no período.',
        'Conferir notas canceladas ou substitutas.',
        'Verificar conciliação contábil x fiscal.',
        'Conferir saldos credor/devedor de tributos.',
        'Sinalizar pontos de atenção para análise do responsável.',
      ],
      expectedResult: 'Checklist marcável para conferência por especialista.',
      nextStep: 'Validar cada item com contador antes de fechar.',
      sensitiveNotice: SENSITIVE_NOTICE,
    }),
  },
  {
    id: 'sc-fis-evidencias',
    kind: 'ferramenta',
    tagline: 'Antes de marcar reunião com o responsável fiscal, separe o pacote de evidências. Notas, apurações, comprovantes e obrigações acessórias entram numa estrutura única — assim a conversa começa pelo conteúdo, não pela busca de documento solto.',
    cta: 'Abrir revisão',
    appliesTo: ['fiscal', 'contabil', 'contábil'],
    sensitive: true,
    template: (ctx) => ({
      title: 'Separador de evidências',
      context: `Organização de documentos e pontos de atenção sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Notas fiscais do período (entrada e saída).',
        'Apurações de tributos vigentes.',
        'Obrigações acessórias entregues recentemente.',
        'Comprovantes de recolhimento.',
        'Certidões negativas atualizadas.',
        'Cadastros e inscrições.',
      ],
      expectedResult: 'Pacote pronto para revisão por responsável.',
      nextStep: 'Encaminhar ao contador antes de qualquer ajuste.',
      sensitiveNotice: SENSITIVE_NOTICE,
    }),
  },
  {
    id: 'sc-fis-referencia',
    kind: 'referencia',
    tagline: 'Veja quais obrigações principais e acessórias podem ser afetadas pelo ponto identificado, com prazos do mês vigente e histórico das últimas 3 competências. Use isso para evitar tratar um sinal isolado sem ver o calendário completo.',
    cta: 'Ver referência',
    appliesTo: ['fiscal', 'contabil', 'contábil'],
    sensitive: true,
    template: (ctx) => ({
      title: 'Obrigações relacionadas',
      context: `Mapa de obrigações potencialmente impactadas por ${ctxPhrase(ctx)}.`,
      items: [
        'Obrigações principais no próximo vencimento.',
        'Obrigações acessórias atreladas ao tema.',
        'Calendário do mês: prazos críticos.',
        'Histórico das últimas 3 competências.',
        'Janela de regularização disponível.',
      ],
      expectedResult: 'Mapa de obrigações para acompanhar.',
      nextStep: 'Compartilhar com responsável fiscal e priorizar.',
      sensitiveNotice: SENSITIVE_NOTICE,
    }),
  },
  {
    id: 'sc-fis-mensagem',
    kind: 'conexao',
    tagline: 'Em vez de mandar mensagem solta para o contador, prepare um pedido claro. O texto pronto traz o assunto, o indício, os documentos separados e o que você precisa de retorno — assim a resposta volta em horas, não em dias.',
    cta: 'Gerar mensagem',
    appliesTo: ['fiscal', 'contabil', 'contábil'],
    sensitive: true,
    template: (ctx) => ({
      title: 'Mensagem para contador',
      context: 'Texto pronto para enviar ao responsável fiscal/contábil.',
      items: [
        `Assunto: ${ctx.cardTitle || 'Ponto de atenção fiscal'}.`,
        '— Conteúdo —',
        `Identifiquei um indício relacionado a ${ctxPhrase(ctx)} que pode merecer revisão.`,
        'Resumo: (descrever observação em 1-2 frases).',
        'Documentos que separei: (listar).',
        'O que preciso: validar se há ajuste necessário e qual o prazo.',
        '— Fim —',
      ],
      expectedResult: 'Mensagem clara pra iniciar a conversa.',
      nextStep: 'Enviar com os documentos anexados.',
      sensitiveNotice: SENSITIVE_NOTICE,
    }),
  },
];

// ─────────────────────────────────────────────────────────────────────
// JURÍDICO / COMPLIANCE / LGPD (sensível — linguagem segura)
// ─────────────────────────────────────────────────────────────────────
export const SHORTCUTS_JURIDICO: WorkspaceShortcut[] = [
  {
    id: 'sc-jur-dado',
    kind: 'dado',
    tagline: 'Área sensível: este tema exige validação humana antes de qualquer decisão ou comunicação externa. Use o OS¹ para organizar fatos, hipóteses e pendências — mas a palavra final continua sendo do jurídico, compliance ou DPO responsável.',
    appliesTo: ['juridico', 'jurídico', 'compliance', 'lgpd', 'jurídico-regulatório'],
    sensitive: true,
  },
  {
    id: 'sc-jur-fatos',
    kind: 'atalho',
    tagline: 'Antes de tratar isso como decisão final, separe o que é fato documentado, o que é hipótese plausível e o que ainda depende de validação. Reduz risco de comunicar para o jurídico ou para o cliente com informação incompleta — e acelera o parecer do responsável.',
    cta: 'Separar agora',
    appliesTo: ['juridico', 'jurídico', 'compliance', 'lgpd'],
    sensitive: true,
    template: (ctx) => ({
      title: 'Fatos vs hipóteses',
      context: `Separação entre evidências verificadas e suposições sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Fatos confirmados: o que está documentado com fonte e data.',
        'Fatos pendentes: indícios sem documentação completa.',
        'Hipóteses: suposições razoáveis sem base documental.',
        'Critério para reclassificar: documento, testemunha ou evidência sistêmica.',
        'O que conversar com o responsável: validar cada hipótese.',
        'Lacunas que dependem de especialista externo.',
      ],
      expectedResult: 'Pacote estruturado fato/hipótese pra revisão técnica.',
      nextStep: 'Submeter ao especialista antes de comunicar terceiros.',
      sensitiveNotice: SENSITIVE_NOTICE,
    }),
  },
  {
    id: 'sc-jur-checklist',
    kind: 'ferramenta',
    tagline: 'Use o checklist de revisão para olhar cláusulas críticas — penal, resolutiva, não concorrência, foro, SLA, confidencialidade e LGPD — antes de assinar, rescindir ou aceitar aditivo. É uma leitura preliminar para chegar no jurídico com o ponto certo, não para substituir parecer formal.',
    cta: 'Abrir checklist',
    appliesTo: ['juridico', 'jurídico', 'contratos', 'compliance'],
    sensitive: true,
    template: (ctx) => ({
      title: 'Checklist de revisão',
      context: `Itens contratuais/regulatórios que geralmente exigem atenção em ${ctxPhrase(ctx)}.`,
      items: [
        'Cláusula penal: condições de incidência.',
        'Cláusula resolutiva: gatilhos de rescisão.',
        'Cláusula de não concorrência: prazo, território, compensação.',
        'Cláusula compromissória: foro ou arbitragem.',
        'Cláusula de SLA / nível de serviço.',
        'Cláusula de confidencialidade e LGPD.',
      ],
      expectedResult: 'Lista pronta para revisão por advogado.',
      nextStep: 'Encaminhar ao jurídico antes de assinar ou rescindir.',
      sensitiveNotice: SENSITIVE_NOTICE,
    }),
  },
  {
    id: 'sc-jur-mensagem',
    kind: 'conexao',
    tagline: 'Escreva ao jurídico com o ponto pronto: tema, indício observado, pergunta direta e o que você precisa de retorno. Evita troca de mensagem para esclarecer o básico e dá ao advogado o contexto para responder em uma rodada só.',
    cta: 'Gerar mensagem',
    appliesTo: ['juridico', 'jurídico', 'compliance', 'lgpd'],
    sensitive: true,
    template: (ctx) => ({
      title: 'Mensagem para jurídico',
      context: 'Texto curto pra repassar ao responsável jurídico.',
      items: [
        `Assunto: ${ctx.cardTitle || 'Ponto sensível para análise jurídica'}.`,
        '— Conteúdo —',
        `Preciso da sua avaliação preliminar sobre ${ctxPhrase(ctx)}.`,
        'Trata-se de ponto de atenção; ainda não é decisão formal.',
        'O que preciso: confirmar se há risco e qual o caminho recomendado.',
        '— Fim —',
      ],
      expectedResult: 'Mensagem pronta pra envio.',
      nextStep: 'Ajustar destinatário e enviar com documentos relevantes.',
      sensitiveNotice: SENSITIVE_NOTICE,
    }),
  },
];

// ─────────────────────────────────────────────────────────────────────
// MARKETING / VENDAS
// ─────────────────────────────────────────────────────────────────────
export const SHORTCUTS_MARKETING: WorkspaceShortcut[] = [
  {
    id: 'sc-mkt-campanha',
    kind: 'ferramenta',
    tagline: 'Transforme este sinal em uma campanha local testável. O OS¹ gera briefing com objetivo, público, mensagem central, canal e métrica de sucesso — para você rodar um teste curto e barato antes de comprometer orçamento em campanha grande.',
    cta: 'Abrir campanha',
    appliesTo: ['marketing', 'campanhas', 'vendas', 'comercial'],
    template: (ctx) => ({
      title: 'Briefing de campanha local',
      context: `Briefing pra campanha relacionada a ${ctxPhrase(ctx)}.`,
      items: [
        'Objetivo: vendas, leads, awareness ou retenção.',
        'Público-alvo: segmento e momento da jornada.',
        'Mensagem central em 1 frase.',
        'Canais recomendados: geofence, social local, parcerias.',
        'Critérios de sucesso: CTR, CPA, leads, vendas atribuídas.',
        'Prazo: 7-14 dias pra primeiro teste.',
      ],
      expectedResult: 'Briefing pronto pra time ou agência.',
      nextStep: 'Validar com responsável de marketing antes de ativar.',
    }),
  },
  {
    id: 'sc-mkt-plano7',
    kind: 'atalho',
    tagline: 'Em vez de virar projeto de mês, transforme a oportunidade em sprint de 7 dias. Dia a dia com responsável, criativo, ativação, leitura de métrica e decisão de escalar ou parar — para aprender com risco pequeno antes de comprometer time grande.',
    cta: 'Criar plano',
    appliesTo: ['marketing', 'campanhas', 'vendas'],
    template: (ctx) => ({
      title: 'Plano de 7 dias',
      context: `Plano sprint pra testar a hipótese sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Dia 1: definir mensagem e responsável.',
        'Dia 2-3: produção de criativo e copy.',
        'Dia 4: revisão interna e ajustes.',
        'Dia 5: ativação em canal piloto.',
        'Dia 6: leitura de métricas iniciais.',
        'Dia 7: ajuste, escala ou parada.',
      ],
      expectedResult: 'Plano sprint pra rodar e aprender rápido.',
      nextStep: 'Atribuir responsável diário e definir métrica.',
    }),
  },
  {
    id: 'sc-mkt-exemplos',
    kind: 'referencia',
    tagline: 'Veja referências de ganchos e estruturas que funcionaram para públicos parecidos — benefício direto, comparação social ou janela curta de oportunidade. Use como ponto de partida e adapte ao contexto local, em vez de começar criativo do zero.',
    cta: 'Ver exemplos',
    appliesTo: ['marketing', 'comercial', 'vendas'],
    template: (ctx) => ({
      title: 'Exemplos de abordagem',
      context: `Referências de mensagens que funcionaram em contextos similares a ${ctxPhrase(ctx)}.`,
      items: [
        'Gancho A — benefício direto: "Reduza X em Y dias".',
        'Gancho B — comparação social: "Empresas como a sua já economizam X".',
        'Gancho C — escassez/oportunidade: "Janela curta de X até Y".',
        'Estrutura sugerida: gancho → prova → CTA único.',
        'Erro comum: 2 CTAs concorrentes na mesma peça.',
      ],
      expectedResult: 'Quadro de referências pra adaptar.',
      nextStep: 'Escolher 1 gancho e testar antes de escalar.',
    }),
  },
  {
    id: 'sc-mkt-canais',
    kind: 'conexao',
    tagline: 'Antes de comprar mídia paga grande, veja onde a ativação local custa menos. Lista de canais próprios, parceiros de bairro, mídia regional e micro-influência por bairro — para começar pelo de menor custo de teste e medir antes de escalar.',
    cta: 'Ver opções',
    appliesTo: ['marketing', 'comercial', 'vendas'],
    template: (ctx) => ({
      title: 'Canais e parceiros próximos',
      context: `Opções de ativação para ${ctxPhrase(ctx)}.`,
      items: [
        'Canal próprio — base de WhatsApp / e-mail.',
        'Mídia paga local — geofence, social regional.',
        'Parceiros de bairro — cross-promo com 2-3 negócios próximos.',
        'Eventos locais — patrocínio pontual.',
        'Influência regional — micro-influenciador de bairro.',
      ],
      expectedResult: 'Lista de canais pra priorizar.',
      nextStep: 'Escolher 2 canais com menor custo de teste.',
    }),
  },
];

// ─────────────────────────────────────────────────────────────────────
// OPERAÇÃO
// ─────────────────────────────────────────────────────────────────────
export const SHORTCUTS_OPERACAO: WorkspaceShortcut[] = [
  {
    id: 'sc-op-checklist',
    kind: 'atalho',
    tagline: 'Não deixe o gargalo virar relatório de reunião. O checklist organiza causa provável, responsável, prazo e critério de correção, e entra na rotina de execução do time — para que a observação vire ação medida em dias, não em semanas.',
    cta: 'Gerar checklist',
    appliesTo: ['operacao', 'operação', 'processos', 'qualidade'],
    template: (ctx) => ({
      title: 'Checklist operacional',
      context: `Lista de verificação para o ponto identificado em ${ctxPhrase(ctx)}.`,
      items: [
        'Validar entrada do processo (insumo correto, no prazo).',
        'Conferir parâmetros operacionais críticos.',
        'Aplicar padrão de execução (SOP vigente).',
        'Registrar não conformidade caso identificada.',
        'Conferir saída do processo (qualidade, quantidade).',
        'Repassar pra próxima etapa com documento.',
      ],
      expectedResult: 'Checklist marcável pra rotina diária.',
      nextStep: 'Treinar equipe e medir aderência por 7 dias.',
    }),
  },
  {
    id: 'sc-op-simulador',
    kind: 'ferramenta',
    tagline: 'Antes de mudar processo ou trocar fornecedor, simule o impacto operacional em prazo, custo e capacidade. Compare cenário conservador, provável e agressivo para identificar onde a mudança gera ganho real e onde gera só agitação.',
    cta: 'Abrir simulador',
    appliesTo: ['operacao', 'operação', 'logistica', 'logística'],
    template: (ctx) => simuladorImpactoOutput(ctx, 'prazo × custo × capacidade'),
  },
  {
    id: 'sc-op-referencia',
    kind: 'referencia',
    tagline: 'Veja o procedimento de redução de falha — identificar etapa exata, aplicar 5 porquês até a causa raiz, definir CAPA com responsável e prazo, e validar correção com controle de saída. Use como referência para não tratar sintoma como solução.',
    cta: 'Ver referência',
    appliesTo: ['operacao', 'operação', 'qualidade'],
    template: (ctx) => ({
      title: 'Procedimento de redução de falha',
      context: `Referência prática para tratar ${ctxPhrase(ctx)}.`,
      items: [
        'Identificar a etapa exata onde a falha acontece.',
        'Aplicar 5 porquês até a causa raiz.',
        'Definir ação corretiva (CAPA) com responsável e prazo.',
        'Aplicar controle de saída pra confirmar correção.',
        'Documentar lição aprendida.',
      ],
      expectedResult: 'Procedimento pronto pra replicar.',
      nextStep: 'Atribuir responsável pela CAPA.',
    }),
  },
  {
    id: 'sc-op-recursos',
    kind: 'conexao',
    tagline: 'Antes de partir só na força da equipe, veja o que destravaria mais rápido. Lista de fornecedores alternativos, equipe de apoio interna, capacitação rápida e consultoria pontual — para escolher o caminho com melhor relação tempo × custo.',
    cta: 'Ver opções',
    appliesTo: ['operacao', 'operação', 'fornecedor'],
    template: (ctx) => ({
      title: 'Recursos necessários',
      context: `Mapa de recursos para destravar ${ctxPhrase(ctx)}.`,
      items: [
        'Fornecedor alternativo com prazo conhecido.',
        'Equipe de apoio interna disponível.',
        'Equipamento ou ferramenta complementar.',
        'Capacitação rápida (1-2 horas) para o time.',
        'Recurso externo (consultoria pontual) se necessário.',
      ],
      expectedResult: 'Lista de recursos pra acionar.',
      nextStep: 'Priorizar 1 recurso e iniciar em 48h.',
    }),
  },
  {
    id: 'sc-op-dado',
    kind: 'dado',
    tagline: 'Gargalo operacional identificado no fluxo: ponto onde o ritmo total fica limitado por capacidade, habilidade, aprovação ou dependência externa. Trate como tema prioritário para a próxima rotina de revisão.',
    appliesTo: ['operacao', 'operação'],
  },
];

// ─────────────────────────────────────────────────────────────────────
// MAPA / TERRITÓRIO (source='map')
// ─────────────────────────────────────────────────────────────────────
export const SHORTCUTS_MAPA: WorkspaceShortcut[] = [
  {
    id: 'sc-map-simulador',
    kind: 'ferramenta',
    tagline: 'Antes de mover equipe ou verba pro território, simule onde a ação tem mais chance de retorno. Compare raio, concorrência local, reputação observada e oportunidade — para escolher onde plantar primeiro em vez de espalhar esforço.',
    cta: 'Abrir simulador',
    source: ['map'],
    template: (ctx) => simuladorImpactoOutput(ctx, 'engajamento regional'),
  },
  {
    id: 'sc-map-plano',
    kind: 'atalho',
    // C1-A: id renomeado de 'sc-map-missao'. Template local, sem POST.
    tagline: 'Organize a leitura do raio em um plano para a unidade mais afetada. O OS¹ monta mapeamento de concorrentes, revisão de reputação local, campanha por proximidade e métrica de 7 dias — para o gestor local saber o que fazer e o que medir.',
    cta: 'Preparar plano territorial',
    source: ['map'],
    template: (ctx) => ({
      title: 'Plano territorial',
      context: `Plano territorial para tratar ${ctxPhrase(ctx)}.`,
      items: [
        'Mapear os 3 concorrentes mais fortes do raio.',
        'Revisar reputação local nas últimas 30 avaliações.',
        'Criar campanha por raio com mensagem regional.',
        'Definir oferta ou mensagem específica da região.',
        'Medir resposta em 7 dias e ajustar.',
      ],
      expectedResult: 'Plano territorial pronto para atribuir.',
      nextStep: 'Atribuir responsável local e iniciar.',
    }),
  },
  {
    id: 'sc-map-conexao',
    kind: 'conexao',
    tagline: 'Veja quem está no raio analisado e pode virar parceria, fornecedor ou cross-promo. Lista priorizada por proximidade, perfil indireto compatível e abertura para abordagem — para começar conversa com os 2-3 mais próximos antes de expandir esforço.',
    cta: 'Ver lista',
    source: ['map'],
    template: (ctx) => ({
      title: 'Próximos na região',
      context: `Lista de candidatos próximos sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Candidatos a parceiro/fornecedor no raio.',
        'Empresas indiretas com bundling potencial.',
        'Oportunidade de cross-promo regional.',
        'Avaliar 3 mais próximos antes de expandir o raio.',
      ],
      expectedResult: 'Lista priorizada pra abordagem.',
      nextStep: 'Iniciar contato com o mais próximo.',
    }),
  },
  {
    id: 'sc-map-comparacao',
    kind: 'referencia',
    tagline: 'Antes de generalizar a leitura, compare a região atual com outra unidade ou raio. Densidade, demanda, custo operacional e concorrência mudam por bairro — isso evita decisão local baseada em padrão de outra praça.',
    cta: 'Ver comparação',
    source: ['map'],
    template: (ctx) => ({
      title: 'Comparação entre regiões',
      context: `Quadro comparativo de regiões sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Região A: densidade, concorrência, demanda observada.',
        'Região B: mesma estrutura.',
        'Diferença de custo operacional por região.',
        'Risco competitivo por região.',
        'Recomendação: priorizar região com melhor relação risco × retorno.',
      ],
      expectedResult: 'Comparativo pra decisão territorial.',
      nextStep: 'Validar com expansão antes de definir foco.',
    }),
  },
  {
    id: 'sc-map-dado',
    kind: 'dado',
    tagline: 'O raio analisado mostra padrão diferente do esperado — pode ser concentração de concorrência, risco competitivo ou oportunidade ainda sub-mapeada. Trate como gatilho de revisão territorial para a próxima semana.',
    source: ['map'],
  },

  // ── Atalhos contextuais por área (Etapa 13) ─────────────────────────
  // appliesTo usa as 'area' que useOS1MapBridge define nos cards do mapa:
  //   concorrencia-territorial / oportunidade / oportunidade-setorial /
  //   comparacao-territorial / missao-territorial / risco-territorial /
  //   parceiros-territoriais / simulacao / mapa-feed
  {
    id: 'sc-map-comparacao-competitiva',
    kind: 'ferramenta',
    tagline: 'Antes de reagir à concorrência do raio, compare quem está pressionando reputação, preço e presença local. O OS¹ organiza os concorrentes mais fortes, os mais próximos e a brecha mais provável para agir sem desperdiçar esforço.',
    cta: 'Abrir comparação',
    appliesTo: ['concorrencia-territorial', 'concorrencia'],
    source: ['map'],
    template: (ctx) => ({
      title: 'Comparação competitiva do raio',
      context: `Quadro competitivo do raio sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Concorrentes mais próximos (top 3) e nota.',
        'Concorrentes mais fortes (top 3) e diferencial percebido.',
        'Brechas de reputação (concorrentes com nota < 4.0).',
        'Risco de saturação ou disputa concentrada.',
        'Ação recomendada proporcional ao risco.',
        'Indicador a monitorar nos próximos 14 dias.',
      ],
      expectedResult: 'Diagnóstico competitivo do raio pronto para decisão.',
      nextStep: 'Atribuir responsável local e definir contra-medida.',
    }),
  },
  {
    id: 'sc-map-oportunidade-rascunho',
    kind: 'atalho',
    // C1-A: id renomeado de 'sc-map-oportunidade-missao'. Template local, sem POST.
    tagline: 'Organize a principal oportunidade do raio em uma ação prática para a unidade. Defina responsável, prazo e critério de sucesso para testar sem virar apenas observação territorial.',
    cta: 'Organizar próximos passos',
    appliesTo: ['oportunidade', 'oportunidade-setorial'],
    source: ['map'],
    template: (ctx) => ({
      title: 'Plano territorial',
      context: `Plano de execução a partir da oportunidade em ${ctxPhrase(ctx)}.`,
      items: [
        'Objetivo: (descrever o que se quer alcançar no raio).',
        'Evidência territorial usada (raio + concorrentes considerados).',
        'Responsável sugerido pelo perfil do setor.',
        'Prazo recomendado pela urgência da oportunidade.',
        'Etapas operacionais (3-5 passos).',
        'Métrica de sucesso medida em 7-14 dias.',
      ],
      expectedResult: 'Plano territorial pronto para atribuir.',
      nextStep: 'Atribuir responsável local e iniciar execução.',
    }),
  },
  {
    id: 'sc-map-risco-priorizacao',
    kind: 'atalho',
    tagline: 'Separe os riscos territoriais por urgência antes de mover verba ou equipe. O OS¹ organiza o que exige ação imediata, o que deve ser acompanhado e o que pode esperar — para tratar o que importa antes que vire problema.',
    cta: 'Priorizar riscos',
    appliesTo: ['risco-territorial', 'risco'],
    source: ['map'],
    template: (ctx) => ({
      title: 'Priorização de riscos territoriais',
      context: `Triagem de riscos sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Riscos altos: exigem ação imediata (24-48h).',
        'Riscos médios: acompanhamento semanal e responsável definido.',
        'Riscos baixos: monitorar em ciclo quinzenal.',
        'Primeira ação recomendada para o risco principal.',
        'Ciclo de acompanhamento sugerido por nível.',
        'Indicador territorial pra reabrir avaliação.',
      ],
      expectedResult: 'Plano de mitigação dimensionado por urgência.',
      nextStep: 'Atribuir responsável por nível de risco.',
    }),
  },
  {
    id: 'sc-map-parceiros-candidatos',
    kind: 'conexao',
    tagline: 'Avalie os parceiros e fornecedores próximos antes de abordar. Separe quem pode reduzir custo, ampliar canal ou virar oportunidade local sem confundir concorrente direto com parceria — para a primeira conversa ter pé no chão.',
    cta: 'Ver candidatos',
    appliesTo: ['parceiros-territoriais', 'parceiros'],
    source: ['map'],
    template: (ctx) => ({
      title: 'Candidatos a parceria local',
      context: `Lista de candidatos no raio sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Parceiros elegíveis (cross-promo, co-marketing).',
        'Fornecedores potenciais (custo, prazo, capacidade).',
        'Complementares (bundling de oferta).',
        'Concorrentes a monitorar (NÃO são candidatos a parceria).',
        'Recomendação de abordagem priorizada.',
        'Próximo contato sugerido.',
      ],
      expectedResult: 'Lista priorizada pra primeira abordagem.',
      nextStep: 'Iniciar contato com o candidato mais próximo.',
    }),
  },
  {
    id: 'sc-map-simulacao',
    kind: 'ferramenta',
    tagline: 'Antes de executar a ação local, compare os cenários conservador, provável e agressivo. Use a simulação para decidir se vale campanha, parceria, reforço de reputação ou ajuste operacional no raio — sem comprometer recurso no escuro.',
    cta: 'Abrir simulação',
    appliesTo: ['simulacao'],
    source: ['map'],
    template: (ctx) => ({
      title: 'Simulação territorial — cenários comparados',
      context: `Cenários comparados para ação em ${ctxPhrase(ctx)}.`,
      items: [
        'Cenário conservador: resultado e métrica estimada.',
        'Cenário provável: resultado e métrica estimada.',
        'Cenário agressivo: resultado e métrica estimada.',
        'Fundamento da estimativa (densidade, reputação, etc.).',
        'Risco principal por cenário.',
        'Decisão recomendada com base no contexto.',
      ],
      expectedResult: 'Quadro de cenários pronto para reunião de decisão.',
      nextStep: 'Escolher cenário de referência e atribuir execução.',
      sensitiveNotice: 'Estimativa territorial — não é previsão garantida. Serve para comparar decisões.',
    }),
  },
  {
    id: 'sc-map-comparacao-regional',
    kind: 'referencia',
    tagline: 'Compare o raio atual com uma área menor ou maior antes de decidir onde agir. O OS¹ mostra se a oportunidade está concentrada, espalhada ou saturada demais para justificar esforço de ativação.',
    cta: 'Ver comparação',
    appliesTo: ['comparacao-territorial'],
    source: ['map'],
    template: (ctx) => ({
      title: 'Comparação entre raios',
      context: `Análise comparativa de raios sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Região A (raio atual): densidade, reputação, número de concorrentes.',
        'Região B (raio comparativo): mesma estrutura.',
        'Diferença de saturação entre as duas.',
        'Diferença de oportunidade efetiva.',
        'Recomendação de foco territorial.',
        'Onde concentrar a próxima ação local.',
      ],
      expectedResult: 'Comparativo claro pra escolha territorial.',
      nextStep: 'Definir raio de foco e atribuir responsável.',
    }),
  },
  {
    id: 'sc-map-feed-plano',
    kind: 'atalho',
    tagline: 'Transforme este sinal territorial em plano de ação. O OS¹ separa raio, concorrentes, evidência local e próximo passo para a unidade agir com critério — em vez de só ler o card no feed.',
    cta: 'Criar plano',
    appliesTo: ['mapa-feed'],
    source: ['map'],
    template: (ctx) => ({
      title: 'Plano de ação territorial',
      context: `Plano gerado a partir do sinal de feed sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Sinal territorial identificado.',
        'Raio e centro analisados.',
        'Concorrentes considerados no sinal.',
        'Evidência local que justifica a ação.',
        'Primeiro passo operacional (próximas 72h).',
        'Quem executa e quem acompanha.',
      ],
      expectedResult: 'Plano de ação territorial pronto pra atribuir.',
      nextStep: 'Atribuir responsável local e definir métrica de 7 dias.',
    }),
  },
  {
    id: 'sc-map-plano-unidade',
    kind: 'ferramenta',
    // C1-A: id renomeado de 'sc-map-missao-publicar'. Sem publicação real
    // — template local que prepara texto para canal interno.
    tagline: 'Antes de levar este plano territorial pra equipe da unidade, valide responsável, prazo e métrica de sucesso. O OS¹ monta o resumo, conecta a evidência territorial e prepara o aviso pra canal interno — sem precisar refazer texto.',
    cta: 'Preparar plano para a unidade',
    // C1-A: aceita o nome canônico novo ('plano-territorial') e mantém
    // 'missao-territorial' por 1 release pra compat com cards persistidos.
    appliesTo: ['plano-territorial', 'missao-territorial'],
    source: ['map'],
    template: (ctx) => ({
      title: 'Publicação do plano territorial',
      context: `Preparação para divulgar o plano territorial sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Resumo curto do plano territorial (1-2 frases).',
        'Raio e centro analisados.',
        'Evidência territorial associada.',
        'Responsável atribuído (unidade ou time local).',
        'Prazo confirmado e métrica de sucesso.',
        'Canal de comunicação sugerido.',
      ],
      expectedResult: 'Texto pronto para publicar e plano ativo.',
      nextStep: 'Confirmar destinatários e publicar.',
    }),
  },
];

// ─────────────────────────────────────────────────────────────────────
// NAVEGADOR / DOCUMENTO / UPLOAD (source='browser' | 'upload')
// ─────────────────────────────────────────────────────────────────────
export const SHORTCUTS_NAVEGADOR: WorkspaceShortcut[] = [
  {
    id: 'sc-doc-pontos',
    kind: 'atalho',
    tagline: 'Em vez de ler o documento inteiro de novo, extraia os pontos críticos com estrutura. Afirmação principal, dados que sustentam, pressuposto não declarado, ponto contestável, implicação prática e recomendação — para virar leitura de minutos, não de horas.',
    cta: 'Extrair pontos',
    source: ['browser', 'upload', 'workspace'],
    template: (ctx) => ({
      title: 'Pontos críticos extraídos',
      context: `Síntese dos pontos críticos sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Afirmação principal do documento.',
        'Dados ou números que sustentam a afirmação.',
        'Pressuposto não declarado relevante.',
        'Ponto contestável que merece validação.',
        'Implicação prática direta.',
        'Recomendação implícita ou explícita.',
      ],
      expectedResult: 'Resumo pra leitura rápida.',
      nextStep: 'Validar pontos críticos com especialista.',
      sensitiveNotice: mkSensitive(ctx),
    }),
  },
  {
    id: 'sc-doc-dossie',
    kind: 'ferramenta',
    tagline: 'Não deixe a evidência solta numa aba do navegador. Crie o dossiê do tema com data de inclusão, tipo de evidência, conexão com outros documentos e leitores recomendados — para o conhecimento ficar rastreável quando a equipe trocar.',
    cta: 'Criar dossiê',
    source: ['browser', 'upload'],
    template: (ctx) => ({
      title: 'Dossiê criado',
      context: `Conteúdo agrupado em dossiê sobre ${ctx.domain || ctx.areaMacro || 'o tema'}.`,
      items: [
        `Nome do dossiê: "${ctx.domain || ctx.areaMacro || 'Tema central'}".`,
        `Bloco adicionado: ${ctx.cardTitle || 'tema atual'}.`,
        `Data de inclusão: ${new Date().toLocaleDateString('pt-BR')}.`,
        'Tipo de evidência: documento / análise / registro.',
        'Conexões com outros temas: 1-2 pontos relacionados.',
        'Quem mais deveria ver: lista de leitores recomendados.',
      ],
      expectedResult: 'Dossiê crescendo de forma rastreável.',
      nextStep: 'Continuar adicionando blocos relacionados.',
    }),
  },
  {
    id: 'sc-doc-comparacao',
    kind: 'referencia',
    tagline: 'Antes de adotar o que este conteúdo sugere, compare com o padrão interno atual. Pontos de convergência, divergência e hipóteses sobre a diferença — para decidir entre alinhar ao padrão observado ou justificar onde a empresa segue caminho próprio.',
    cta: 'Ver comparação',
    source: ['browser', 'upload', 'workspace'],
    template: (ctx) => ({
      title: 'Comparação com padrão interno',
      context: `Como este conteúdo se compara ao padrão observado sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Pontos de convergência com padrão atual.',
        'Pontos de divergência relevantes.',
        'Hipóteses sobre causa da divergência.',
        'Decisão: alinhar ao padrão ou justificar diferença.',
        'Evidência a registrar pra histórico.',
      ],
      expectedResult: 'Quadro comparativo simples.',
      nextStep: 'Marcar divergências relevantes pra acompanhar.',
    }),
  },
  {
    id: 'sc-doc-mensagem',
    kind: 'conexao',
    tagline: 'Em vez de encaminhar o link cru, prepare a mensagem pronta. Assunto, resumo do ponto principal e o que você precisa de retorno — para o responsável receber contexto suficiente para responder em uma rodada, não em várias trocas.',
    cta: 'Gerar mensagem',
    source: ['browser', 'upload', 'workspace'],
    template: (ctx) => ({
      title: 'Mensagem para responsável',
      context: 'Texto pronto para repassar via canal interno.',
      items: [
        `Assunto: ${ctx.cardTitle || 'Conteúdo para sua avaliação'}.`,
        '— Conteúdo —',
        `Estou compartilhando esta análise sobre ${ctxPhrase(ctx)}.`,
        'Resumo do ponto principal: (descrever em 1-2 frases).',
        'Preciso da sua avaliação para os próximos passos.',
        '— Fim —',
      ],
      expectedResult: 'Mensagem pronta para enviar.',
      nextStep: 'Ajustar destinatário e enviar.',
      sensitiveNotice: mkSensitive(ctx),
    }),
  },
  {
    id: 'sc-doc-dado',
    kind: 'dado',
    tagline: 'Documento ou página em uso como evidência da análise atual. Mantenha o link e a data registrados — assim a leitura pode ser revisitada e auditada depois sem depender de memória do time.',
    source: ['browser', 'upload'],
  },

  // ── Atalhos contextuais por tipo de página (Etapa 12) ───────────────
  // appliesTo aqui usa as 'area' que o useOS1BrowserBridge define nos cards:
  //   regulatório / preço / concorrente / fornecedor / notícia /
  //   rede-social / pesquisa / missao / dossie / relatorio-sessao /
  //   leitura-setor / navegador-feed
  {
    id: 'sc-doc-regulatorio',
    kind: 'atalho',
    tagline: 'Antes de qualquer decisão sobre esta atualização regulatória, organize a regra. Separe a norma, prazo de vigência, área afetada e responsável pela adequação — para validar conformidade com segurança e sem improviso.',
    cta: 'Gerar checklist',
    appliesTo: ['regulatório', 'regulatorio', 'compliance'],
    source: ['browser'],
    template: (ctx) => ({
      title: 'Checklist de revisão regulatória',
      context: `Roteiro de adequação sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Confirmar origem oficial e data de vigência da norma.',
        'Identificar área(s) interna(s) afetada(s) pela mudança.',
        'Listar processos que precisam de adequação.',
        'Validar responsável pela implementação.',
        'Definir prazo de adequação e métrica de conformidade.',
        'Registrar evidência (link da norma + data) pra auditoria.',
      ],
      expectedResult: 'Checklist pronto pra circular com a área de compliance.',
      nextStep: 'Atribuir responsável e prazo, validar com liderança.',
      sensitiveNotice: mkSensitive(ctx),
    }),
  },
  {
    id: 'sc-doc-preco',
    kind: 'ferramenta',
    tagline: 'Compare este sinal de preço com a sua oferta atual antes de reagir. Veja se o impacto está em margem, posicionamento ou comunicação — pra decidir entre ajustar valor, criar combo ou manter posição com diferencial mais claro.',
    cta: 'Abrir comparação',
    appliesTo: ['preço', 'preco'],
    source: ['browser'],
    template: (ctx) => ({
      title: 'Comparação com sua oferta',
      context: `Análise do sinal de preço identificado em ${ctxPhrase(ctx)}.`,
      items: [
        'Preço/condição da página vs preço atual da empresa.',
        'Diferença em valor, parcela ou condição comercial.',
        'Impacto estimado em margem se acompanhar.',
        'Impacto em posicionamento se ignorar.',
        'Opções: acompanhar valor · ajustar mix · reforçar diferencial.',
        'Recomendação inicial baseada no contexto.',
      ],
      expectedResult: 'Comparativo claro pra decisão comercial em 48h.',
      nextStep: 'Validar com time comercial e decidir resposta.',
    }),
  },
  {
    id: 'sc-doc-concorrente',
    kind: 'atalho',
    tagline: 'Resuma o movimento competitivo em uma frase, avalie o alcance e defina a resposta antes do mercado reagir por você. Separe: o que mudou, quem afeta, em quanto tempo e qual é a contra-medida proporcional ao risco real.',
    cta: 'Mapear movimento',
    appliesTo: ['concorrente'],
    source: ['browser'],
    template: (ctx) => ({
      title: 'Mapeamento do movimento competitivo',
      context: `Sinal competitivo identificado em ${ctxPhrase(ctx)}.`,
      items: [
        'Movimento detectado em uma frase: (descrever).',
        'Abrangência: regional, segmento, canal, marca.',
        'Quem é mais impactado dentro do nosso pipeline.',
        'Janela de tempo (curto / médio / longo prazo).',
        'Resposta possível: defender · neutralizar · ignorar.',
        'Indicador a monitorar nos próximos 14 dias.',
      ],
      expectedResult: 'Plano de resposta dimensionado pela ameaça.',
      nextStep: 'Comunicar time comercial e definir contra-medida.',
    }),
  },
  {
    id: 'sc-doc-relatorio-sessao',
    kind: 'atalho',
    // GM1 limpeza: era "Criar missão"; só gera template local. Renomeado.
    tagline: 'Organize os principais achados desta sessão em uma lista de execução. O OS¹ separa prioridade, evidência e próximo responsável — para a navegação virar plano de ação, não pasta de favoritos.',
    cta: 'Criar plano',
    appliesTo: ['relatorio-sessao'],
    source: ['browser'],
    template: (ctx) => ({
      title: 'Plano criado da sessão',
      context: `Plano de execução a partir dos achados em ${ctxPhrase(ctx)}.`,
      items: [
        'Achado principal: (1 frase).',
        'Por que merece ação primeiro.',
        'Evidência associada (link da página).',
        'Responsável sugerido.',
        'Prazo recomendado pela urgência.',
        'Critério de conclusão.',
      ],
      expectedResult: 'Plano executável pronto pra atribuir.',
      nextStep: 'Atribuir responsável e prazo, registrar como plano ativo.',
    }),
  },
  {
    id: 'sc-doc-dossie-revisao',
    kind: 'referencia',
    tagline: 'Revise as páginas mais importantes deste dossiê e identifique quais viram ação, quais viram acompanhamento e quais podem ser descartadas. O OS¹ separa por tema central, evidência e relevância — para o conhecimento parar de inflar sem critério.',
    cta: 'Ver revisão',
    appliesTo: ['dossie'],
    source: ['browser'],
    template: (ctx) => ({
      title: 'Revisão do dossiê',
      context: `Triagem das páginas incluídas em ${ctxPhrase(ctx)}.`,
      items: [
        'Tema central do dossiê em 1 frase.',
        'Páginas mais relevantes (top 3).',
        'Quais viram plano / ação imediata.',
        'Quais ficam em acompanhamento (sem ação ainda).',
        'Quais podem ser descartadas com justificativa.',
        'Próxima revisão do dossiê (data sugerida).',
      ],
      expectedResult: 'Dossiê limpo, com foco mantido.',
      nextStep: 'Aplicar triagem e definir próxima revisão.',
    }),
  },
  {
    id: 'sc-doc-plano-unidade',
    kind: 'ferramenta',
    // C1-A: id renomeado de 'sc-doc-missao-publicar'. Sem publicação real —
    // template local que prepara texto para canal interno. `appliesTo`
    // ganhou 'rascunho' como nome canônico; 'missao' mantido por 1 release
    // pra compat com cards persistidos antes da renomeação.
    tagline: 'Antes de levar este plano para a equipe, valide responsável, prazo e métrica de sucesso. O OS¹ monta o resumo, conecta a evidência e prepara o aviso para o canal interno — sem precisar refazer texto.',
    cta: 'Preparar plano para a unidade',
    appliesTo: ['rascunho', 'missao'],
    source: ['browser'],
    template: (ctx) => ({
      title: 'Publicação do plano',
      context: `Preparação para divulgar o plano sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Resumo curto do plano (1-2 frases).',
        'Evidência principal (link).',
        'Responsável atribuído.',
        'Prazo confirmado.',
        'Métrica de sucesso (como medir).',
        'Canal de comunicação sugerido.',
      ],
      expectedResult: 'Texto pronto para publicar e plano ativo.',
      nextStep: 'Confirmar destinatários e publicar.',
    }),
  },
];

// ─────────────────────────────────────────────────────────────────────
// PERFIL CENTRAL (role=franchisor)
// ─────────────────────────────────────────────────────────────────────
export const SHORTCUTS_PERFIL_CENTRAL: WorkspaceShortcut[] = [
  {
    id: 'sc-pc-enviar',
    kind: 'atalho',
    tagline: 'Transforme esta análise em orientação clara para as unidades. O OS¹ gera comunicado com tema, contexto, o que esperar da unidade, prazo de retorno e responsável central — para a mensagem chegar pronta para execução, não pronta para perguntas.',
    cta: 'Preparar envio',
    profile: ['franchisor'],
    template: (ctx) => ({
      title: 'Orientação para unidade',
      context: 'Mensagem padronizada pra repassar à unidade conectada.',
      items: [
        `Assunto: ${ctx.cardTitle || 'Orientação da Central'}.`,
        '— Conteúdo —',
        `Tema: ${ctxPhrase(ctx)}.`,
        'Contexto: por que estamos comunicando agora.',
        'Orientação prática: o que esperamos da unidade.',
        'Prazo de retorno e responsável central.',
        '— Fim —',
      ],
      expectedResult: 'Comunicado pronto pra envio.',
      nextStep: 'Personalizar destinatário e enviar.',
    }),
  },
  {
    id: 'sc-pc-comparador',
    kind: 'ferramenta',
    tagline: 'Antes de espalhar a orientação para a rede toda, compare unidades pelo indicador central. Top 3 e bottom 3, variação relativa, hipóteses de causa e boas práticas a replicar — para concentrar atenção onde a ação tem maior efeito imediato.',
    cta: 'Abrir comparação',
    profile: ['franchisor', 'codify'],
    template: (ctx) => ({
      title: 'Comparação entre unidades',
      context: `Análise comparativa de desempenho entre unidades sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Indicador central por unidade.',
        'Top 3 e bottom 3 da estrutura.',
        'Variação relativa entre unidades.',
        'Hipóteses para a variação observada.',
        'Boas práticas a replicar.',
        'Ações específicas para unidades em baixa.',
      ],
      expectedResult: 'Quadro comparativo da estrutura.',
      nextStep: 'Atribuir responsável por unidade em alerta.',
    }),
  },
  {
    id: 'sc-pc-conexao',
    kind: 'conexao',
    tagline: 'Veja as unidades que mais se distanciam do indicador esperado e têm tendência negativa nas últimas 4 semanas. Lista priorizada para acompanhamento — para o conselho começar pelas 3 mais críticas em vez de tentar olhar a rede inteira ao mesmo tempo.',
    cta: 'Ver unidades',
    profile: ['franchisor', 'codify'],
    template: (ctx) => ({
      title: 'Unidades em acompanhamento',
      context: `Lista priorizada de unidades pra acompanhar sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Critério 1 — distância do indicador esperado.',
        'Critério 2 — tendência das últimas 4 semanas.',
        'Critério 3 — capacidade de execução local.',
        'Sugestão: iniciar contato com as 3 mais críticas.',
        'Definir cadência semanal de check-in.',
      ],
      expectedResult: 'Lista priorizada pra ação imediata.',
      nextStep: 'Marcar reunião com a unidade mais crítica.',
    }),
  },
  {
    id: 'sc-pc-dado',
    kind: 'dado',
    tagline: 'Diferença relevante entre unidades ou setores detectada. Trate como gatilho para revisão da rede — pode ser oportunidade de boas práticas em algumas unidades ou ponto de atenção em outras.',
    profile: ['franchisor', 'codify'],
  },
];

// ─────────────────────────────────────────────────────────────────────
// PERFIL UNIDADE (role=franchise)
// ─────────────────────────────────────────────────────────────────────
export const SHORTCUTS_PERFIL_UNIDADE: WorkspaceShortcut[] = [
  {
    id: 'sc-pu-reportar',
    kind: 'atalho',
    tagline: 'Em vez de mandar mensagem solta para a Central, prepare o reporte com estrutura. Pendência observada, o que tentamos fazer localmente, o que falta destravar e qual o impacto se não resolver — para a Central responder com decisão, não pedir esclarecimento.',
    cta: 'Reportar agora',
    profile: ['franchise'],
    template: (ctx) => ({
      title: 'Reporte para central',
      context: 'Mensagem estruturada para informar a central.',
      items: [
        `Assunto: Pendência sobre ${ctx.cardTitle || 'o tema'}.`,
        '— Conteúdo —',
        'Pendência identificada: descrição factual.',
        'O que tentamos fazer localmente.',
        'O que falta para resolver (decisão, recurso, autorização).',
        'Impacto se não destravar.',
        '— Fim —',
      ],
      expectedResult: 'Reporte transparente e acionável.',
      nextStep: 'Enviar pra Central e acompanhar retorno.',
    }),
  },
  {
    id: 'sc-pu-checklist',
    kind: 'ferramenta',
    tagline: 'Converta a orientação da Central em execução local. O checklist traduz a mensagem para a realidade da unidade, define responsável local, prazo realista e como reportar conclusão — para garantir que a ação acontece em vez de aguardar nova reunião.',
    cta: 'Abrir checklist',
    profile: ['franchise'],
    template: (ctx) => ({
      title: 'Checklist da unidade',
      context: `Itens locais para executar a orientação sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Entendimento da orientação central em 1 frase.',
        'Tradução para a realidade da unidade.',
        'Responsável local pela execução.',
        'Prazo realista de execução.',
        'Riscos locais que podem atrapalhar.',
        'Como reportar conclusão à central.',
      ],
      expectedResult: 'Plano local executável.',
      nextStep: 'Iniciar pela etapa 1 e reportar no prazo.',
    }),
  },
  {
    id: 'sc-pu-apoio',
    kind: 'conexao',
    tagline: 'Quando o bloqueio local depende de decisão, recurso ou autorização da Central, formalize o pedido. Tema, o que tentamos, tipo de apoio necessário e prazo limite — para o apoio chegar no tempo que ainda destrava a operação.',
    cta: 'Solicitar apoio',
    profile: ['franchise'],
    template: (ctx) => ({
      title: 'Solicitação de apoio',
      context: 'Pedido formal de apoio para destravar a execução local.',
      items: [
        `Tema: ${ctxPhrase(ctx)}.`,
        'O que está bloqueando localmente.',
        'O que tentamos fazer.',
        'Tipo de apoio necessário (decisão, recurso, capacitação).',
        'Prazo limite pra não travar a operação.',
      ],
      expectedResult: 'Pedido pronto pra enviar à central.',
      nextStep: 'Enviar e marcar follow-up em 48h.',
    }),
  },
  {
    id: 'sc-pu-dado',
    kind: 'dado',
    tagline: 'Ponto local identificado para revisão e ação da unidade. Trate como gatilho de execução semanal — a observação só vira resultado se entrar na rotina da unidade.',
    profile: ['franchise'],
  },
];

// ─────────────────────────────────────────────────────────────────────
// GERAIS (default — quando contexto for genérico)
// ─────────────────────────────────────────────────────────────────────
export const SHORTCUTS_GERAIS: WorkspaceShortcut[] = [
  {
    id: 'sc-gen-plano',
    kind: 'atalho',
    tagline: 'Transforme esta análise em plano executável de verdade. Etapas práticas, responsável claro, prazo realista, indicador de acompanhamento e ponto de revisão — para o que foi discutido aqui virar ação medida, não só intenção registrada.',
    cta: 'Criar plano',
    appliesTo: ['*'],
    template: (ctx) => ({
      title: 'Plano de ação',
      context: `Plano prático para tratar ${ctxPhrase(ctx)}.`,
      items: [
        'Etapa 1 — Confirmar entendimento do tema com 1 pessoa-chave em até 24h.',
        'Etapa 2 — Mapear evidências disponíveis e classificar por confiabilidade.',
        'Etapa 3 — Listar 2 opções de resposta com custo e prazo.',
        'Etapa 4 — Atribuir responsável claro pela opção escolhida.',
        `Etapa 5 — Definir prazo de retorno: ${urgencyWindow(ctx.urgency)}.`,
        'Etapa 6 — Medir resultado e registrar aprendizado.',
      ],
      expectedResult: 'Plano executável com responsável, prazo e métrica.',
      nextStep: 'Iniciar pela etapa 1.',
      sensitiveNotice: mkSensitive(ctx),
    }),
  },
  {
    id: 'sc-gen-checklist',
    kind: 'atalho',
    tagline: 'Em vez de seguir adiante na memória, gere um checklist dos próximos passos. Revisar evidência, validar entendimento, confirmar responsável, definir prazo e registrar decisão — para o trabalho avançar mesmo quando a equipe trocar de pessoa.',
    cta: 'Gerar checklist',
    appliesTo: ['*'],
    template: (ctx) => ({
      title: 'Checklist sugerido',
      context: `Checklist organizado para apoiar a execução sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Revisar o ponto principal e validar entendimento.',
        'Separar evidências disponíveis.',
        'Confirmar responsável pela análise.',
        'Validar impacto antes de comunicar.',
        'Definir prazo coerente com a urgência.',
        'Registrar decisão tomada ou descartada.',
      ],
      expectedResult: 'Checklist marcável.',
      nextStep: 'Escolher responsável e iniciar.',
      sensitiveNotice: mkSensitive(ctx),
    }),
  },
  {
    id: 'sc-gen-simulador',
    kind: 'ferramenta',
    tagline: 'Antes de escolher resposta, simule o mesmo movimento em três tamanhos — conservador, provável e agressivo. Compare risco, resultado esperado e indicador a acompanhar em cada um, para evitar dimensionar pelo otimismo ou pelo medo isolado.',
    cta: 'Abrir simulador',
    appliesTo: ['*'],
    template: (ctx) => simuladorImpactoOutput(ctx, 'indicador principal'),
  },
  {
    id: 'sc-gen-referencia',
    kind: 'referencia',
    tagline: 'Antes de decidir só com leitura interna, compare com práticas observadas no setor. Players de referência, distância atual da empresa em relação ao mercado e sinais de mudança em curso — para calibrar ambição e separar igualar o mercado de tentar liderar.',
    cta: 'Ver referência',
    appliesTo: ['*'],
    template: (ctx) => ({
      title: 'Práticas comparáveis',
      context: `Como o mercado vem tratando temas similares a ${ctxPhrase(ctx)}.`,
      items: [
        'Práticas observadas no setor.',
        'Players de referência (2-3 empresas).',
        'Distância estimada vs. mercado.',
        'Sinais de mudança em curso.',
        'Risco de inação.',
        'Oportunidade de salto.',
      ],
      expectedResult: 'Leitura comparativa pra calibrar ambição.',
      nextStep: 'Decidir se a meta é igualar ou diferenciar.',
    }),
  },
];
