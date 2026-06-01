// Catálogo de Ferramentas da Área de Trabalho.
//
// Conteúdo movido de src/lib/workspace-tools.ts (Fase 7). Cada bloco
// `TOOLS_*` é um array de WorkspaceTool — os templates dependem dos
// helpers compartilhados em ./workspace-tools.templates.
//
// IMPORTANTE: nenhum byte de conteúdo das ferramentas foi alterado nesta
// fase. Labels, descrições, ids, grupos, templates e regras de
// sensibilidade são exatamente os mesmos da versão original.

import type { WorkspaceTool } from '../../../core/types/workspace';
import {
  SENSITIVE_NOTICE,
  ctxPhrase,
  mkSensitive,
  urgencyWindow,
} from './workspace-tools.templates';

// ─────────────────────────────────────────────────────────────────────
// FERRAMENTAS GERAIS — servem em quase qualquer contexto
// ─────────────────────────────────────────────────────────────────────
export const TOOLS_GERAIS: WorkspaceTool[] = [
  {
    id: 'gen-plano-acao', label: 'Criar plano de ação', group: 'execucao', appliesTo: ['*'],
    description: 'Plano prático com etapas, responsáveis e prazo.',
    template: (ctx) => ({
      title: 'Plano de ação sugerido',
      context: `Plano organizado para tratar ${ctxPhrase(ctx)}.`,
      items: [
        'Etapa 1 — Confirmar entendimento do tema com 1 pessoa-chave em até 24h.',
        'Etapa 2 — Mapear evidências disponíveis e classificar por confiabilidade.',
        'Etapa 3 — Listar opções de resposta (pelo menos 2) com custo e prazo.',
        'Etapa 4 — Atribuir responsável claro por executar a opção escolhida.',
        `Etapa 5 — Definir prazo de retorno: ${urgencyWindow(ctx.urgency)}.`,
        'Etapa 6 — Medir resultado e registrar aprendizado pra próxima vez.',
      ],
      expectedResult: 'Plano executável com responsável, prazo e métrica de sucesso.',
      nextStep: 'Indique quem é o responsável e a data limite antes de iniciar a execução.',
      sensitiveNotice: mkSensitive(ctx),
    }),
  },
  {
    id: 'gen-checklist', label: 'Criar checklist', group: 'execucao', appliesTo: ['*'],
    description: 'Lista de verificação prática pra não esquecer nada.',
    template: (ctx) => ({
      title: 'Checklist sugerido',
      context: `Checklist organizado para apoiar a execução sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Revisar o ponto principal identificado e validar entendimento.',
        'Separar evidências disponíveis (documentos, screenshots, links).',
        'Confirmar responsável pela análise e quem precisa aprovar.',
        'Validar impacto no setor relacionado antes de comunicar.',
        'Definir prazo de retorno coerente com a urgência.',
        'Registrar decisão tomada ou hipótese descartada.',
        'Criar acompanhamento se houver dependência externa.',
      ],
      expectedResult: 'Checklist marcável que evita perder etapa importante.',
      nextStep: 'Escolha um responsável e valide os pontos críticos antes de executar.',
      sensitiveNotice: mkSensitive(ctx),
    }),
  },
  {
    id: 'gen-missao', label: 'Transformar em missão', group: 'execucao', appliesTo: ['*'],
    description: 'Missão com objetivo, etapas, prazo e critério de conclusão.',
    template: (ctx) => ({
      title: 'Missão sugerida',
      context: `Missão estruturada com base em ${ctxPhrase(ctx)}.`,
      items: [
        `Objetivo: tratar ${ctx.cardTitle || 'o tema'} de forma prática e mensurável.`,
        `Prazo recomendado: ${urgencyWindow(ctx.urgency)}.`,
        'Etapas: mapear, validar, propor, executar, medir.',
        `Responsável sugerido: gestor de ${ctx.domain || ctx.areaMacro || 'área'}.`,
        'Evidências: usar conteúdo deste bloco como ponto de partida.',
        'Métrica de sucesso: indicador específico do tema definido em até 2 dias.',
        'Critério de conclusão: ação executada + métrica registrada.',
      ],
      expectedResult: 'Missão pronta pra entrar em rotina de acompanhamento.',
      nextStep: 'Atribuir responsável formal e iniciar pela etapa 1.',
      sensitiveNotice: mkSensitive(ctx),
    }),
  },
  {
    id: 'gen-evidencias', label: 'Separar evidências', group: 'evidencia', appliesTo: ['*'],
    description: 'Lista evidências disponíveis e o que ainda falta.',
    template: (ctx) => ({
      title: 'Evidências organizadas',
      context: `Mapeamento de evidências para ${ctxPhrase(ctx)}.`,
      items: [
        'Evidências disponíveis: conteúdo deste bloco + sinais coletados na sessão.',
        'Evidência forte: dado quantitativo verificável (número, data, fonte).',
        'Evidência média: relato com contexto (caso comparável, observação).',
        'Evidência fraca: percepção/opinião sem fonte estruturada.',
        'Lacunas identificadas: o que precisaria ser confirmado por especialista.',
        'Fontes externas a buscar: documentos formais, indicadores oficiais.',
        'Registrar cada evidência com data, fonte e quem coletou.',
      ],
      expectedResult: 'Pacote de evidências pronto pra revisão ou auditoria.',
      nextStep: 'Validar evidências fortes com responsável antes de tomar decisão.',
      sensitiveNotice: mkSensitive(ctx),
    }),
  },
  {
    id: 'gen-resumo-exec', label: 'Criar resumo executivo', group: 'comunicacao', appliesTo: ['*'],
    description: 'Resumo curto para gestor ou diretoria.',
    template: (ctx) => ({
      title: 'Resumo executivo',
      context: `Resumo direto sobre ${ctxPhrase(ctx)} para tomada de decisão rápida.`,
      items: [
        `Tema: ${ctx.cardTitle || '(definir título do tema)'}.`,
        `Área impactada: ${ctx.domain || ctx.areaMacro || 'a definir'}.`,
        `Urgência: ${ctx.urgency || 'média'} — janela ${urgencyWindow(ctx.urgency)}.`,
        `Recomendação principal: ${ctx.cardSummary?.slice(0, 140) || 'avaliar opções e escolher 1 em até 7 dias'}.`,
        'Riscos de não agir: perda de janela competitiva ou aumento de retrabalho.',
        'Custo estimado de ação: a definir após validação com responsável.',
        'Quem precisa aprovar: gestor da área + financeiro se houver investimento.',
      ],
      expectedResult: 'Documento de 1 página para apresentar em reunião curta.',
      nextStep: 'Enviar pro decisor e agendar 15 min de alinhamento.',
      sensitiveNotice: mkSensitive(ctx),
    }),
  },
  {
    id: 'gen-enviar-resp', label: 'Enviar para responsável', group: 'comunicacao', appliesTo: ['*'],
    description: 'Mensagem pronta pra repassar a alguém da equipe.',
    template: (ctx) => ({
      title: 'Mensagem pronta para envio',
      context: 'Texto pronto para repassar via WhatsApp, e-mail ou chat interno.',
      items: [
        `Assunto: ${ctx.cardTitle || 'Tema para validação'}.`,
        '— Conteúdo —',
        `Olá, preciso da sua avaliação sobre ${ctxPhrase(ctx)}.`,
        `Resumo: ${ctx.cardSummary?.slice(0, 180) || 'detalhes no anexo/link.'}`,
        `Urgência: ${ctx.urgency || 'média'} (responder em ${urgencyWindow(ctx.urgency)}).`,
        'O que preciso de você: confirmar entendimento e indicar próxima ação.',
        '— Fim do conteúdo —',
      ],
      expectedResult: 'Mensagem copiável e personalizável.',
      nextStep: 'Ajustar nome do destinatário e enviar pelo canal habitual.',
      sensitiveNotice: mkSensitive(ctx),
    }),
  },
  {
    id: 'gen-proximo-passo', label: 'Definir próximo passo', group: 'decisao', appliesTo: ['*'],
    description: 'Transforma em decisão simples de próxima ação.',
    template: (ctx) => ({
      title: 'Próximo passo recomendado',
      context: `Decisão prática para destravar ${ctxPhrase(ctx)}.`,
      items: [
        'Opção A (segura): validar mais 1 sinal antes de agir — custo baixo, prazo curto.',
        'Opção B (intermediária): executar ação pequena reversível em 7 dias.',
        'Opção C (ousada): comprometer recurso significativo agora.',
        'Critério de escolha: maturidade do sinal × custo de errar × janela de tempo.',
        'Recomendação default: começar pela Opção A se houver dúvida estruturada.',
        'Marcar quem decide e data limite para a decisão.',
      ],
      expectedResult: 'Decisão clara escrita com responsável e prazo.',
      nextStep: 'Registrar a opção escolhida e comunicar à equipe.',
      sensitiveNotice: mkSensitive(ctx),
    }),
  },
  {
    id: 'gen-simular', label: 'Simular cenário', group: 'analise', appliesTo: ['*'],
    description: 'Cenário conservador, provável e agressivo.',
    template: (ctx) => ({
      title: 'Simulação de impacto',
      context: `Três cenários organizados para apoiar a decisão sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Cenário conservador: ação limitada, baixo investimento, baixo risco. Esperado: pouco movimento, mas baixa exposição.',
        'Cenário provável: ação moderada com responsável claro e acompanhamento semanal. Esperado: resultado visível em 30–60 dias.',
        'Cenário agressivo: investimento significativo + reorganização interna. Esperado: maior impacto, exige controle próximo.',
        'Riscos comuns: subdimensionar custo, perder janela ou agir sem dados suficientes.',
        'Variáveis críticas a monitorar: custo realizado, indicador-alvo, reação de stakeholders.',
        'Indicadores de sucesso por cenário: definir antes de começar.',
      ],
      expectedResult: 'Comparativo 3-cenários pronto para reunião de decisão.',
      nextStep: 'Definir qual cenário será usado como referência para a ação.',
      sensitiveNotice: mkSensitive(ctx),
    }),
  },
  {
    id: 'gen-comparar-empresa', label: 'Comparar com dados da empresa', group: 'analise', appliesTo: ['*'],
    description: 'Confronta com sinais internos disponíveis.',
    template: (ctx) => ({
      title: 'Comparação com a empresa',
      context: `Comparação entre o tema "${ctx.cardTitle || '—'}" e os sinais internos disponíveis nesta sessão.`,
      items: [
        'Sinais internos relevantes: ver dados de feed, navegador e mapa salvos localmente.',
        'Pontos de convergência: aspectos do tema já presentes na operação.',
        'Pontos de divergência: aspectos do tema ainda ausentes na operação.',
        'Hipóteses sobre causa da divergência: prioridade ou capacidade.',
        'Decisão: alinhar prática interna ao tema ou justificar diferença.',
        'Evidência a registrar: documentar a comparação com data.',
      ],
      expectedResult: 'Quadro comparativo simples — empresa vs. tema.',
      nextStep: 'Marcar quais divergências viram missão ou risco a acompanhar.',
      sensitiveNotice: mkSensitive(ctx),
    }),
  },
  {
    id: 'gen-comparar-mercado', label: 'Comparar com mercado', group: 'analise', appliesTo: ['*'],
    description: 'Confronta com sinais externos ou referência local.',
    template: (ctx) => ({
      title: 'Comparação com mercado',
      context: `Como o mercado vem tratando ${ctxPhrase(ctx)}.`,
      items: [
        'Práticas observadas no setor: tendências recentes documentadas.',
        'Players de referência: 2-3 empresas de comparação direta.',
        'Distância estimada vs. mercado: cobertura próxima, atrás ou à frente.',
        'Sinais de mudança: novidades regulatórias, tecnológicas ou de comportamento.',
        'Risco de inação: quanto se perde por não acompanhar.',
        'Oportunidade de salto: onde se pode liderar em vez de seguir.',
      ],
      expectedResult: 'Leitura comparativa pra calibrar ambição da ação.',
      nextStep: 'Decidir se a meta é igualar o mercado ou diferenciar.',
      sensitiveNotice: mkSensitive(ctx),
    }),
  },
  {
    id: 'gen-alerta', label: 'Criar alerta', group: 'monitoramento', appliesTo: ['*'],
    description: 'Alerta local ou sugestão de alerta.',
    template: (ctx) => ({
      title: 'Alerta sugerido',
      context: `Alerta para acompanhar evolução de ${ctxPhrase(ctx)}.`,
      items: [
        'Condição de disparo: definir métrica ou evento que aciona o alerta.',
        'Frequência: diária / semanal / sob mudança.',
        'Canal: feed, e-mail, painel.',
        'Responsável: quem recebe e age sobre o alerta.',
        'Ação esperada quando disparar: passo concreto, não só notificação.',
        'Critério de desativação: quando deixa de fazer sentido.',
      ],
      expectedResult: 'Definição clara de alerta pronto pra ativar.',
      nextStep: 'Confirmar canal e responsável antes de habilitar.',
      sensitiveNotice: mkSensitive(ctx),
    }),
  },
  {
    id: 'gen-registrar-decisao', label: 'Registrar decisão', group: 'evidencia', appliesTo: ['*'],
    description: 'Registro resumido de decisão tomada ou recomendada.',
    template: (ctx) => ({
      title: 'Registro de decisão',
      context: `Documentação curta da decisão sobre ${ctxPhrase(ctx)}.`,
      items: [
        `Decisão: (escrever em 1 frase clara).`,
        `Data: ${new Date().toLocaleDateString('pt-BR')}.`,
        `Quem decidiu: (nome do responsável).`,
        `Por quê: principais fatores que justificam.`,
        `Alternativas consideradas: outras opções avaliadas e por que descartadas.`,
        `Quando rever: data ou evento de revisão.`,
        `Impacto esperado: indicador que vai mostrar se a decisão funcionou.`,
      ],
      expectedResult: 'Registro auditável pra consulta futura.',
      nextStep: 'Salvar como evidência e comunicar a equipe afetada.',
      sensitiveNotice: mkSensitive(ctx),
    }),
  },
  {
    id: 'gen-pendencia', label: 'Marcar pendência', group: 'monitoramento', appliesTo: ['*'],
    description: 'Pendência rastreável para acompanhamento.',
    template: (ctx) => ({
      title: 'Pendência registrada',
      context: `Pendência aberta a partir de ${ctxPhrase(ctx)}.`,
      items: [
        `Descrição da pendência: o que está esperando para destravar.`,
        `Responsável por destravar: (atribuir nome).`,
        `Dependência externa: pessoa, sistema ou aprovação que falta.`,
        `Impacto se não destravar: consequência prática.`,
        `Prazo limite: data realista de retorno.`,
        `Como saberei que destravou: critério objetivo de sucesso.`,
      ],
      expectedResult: 'Pendência rastreável até resolução.',
      nextStep: 'Notificar responsável e agendar follow-up.',
      sensitiveNotice: mkSensitive(ctx),
    }),
  },
  {
    id: 'gen-apresentacao', label: 'Preparar apresentação', group: 'documento', appliesTo: ['*'],
    description: 'Bullets para apresentar o assunto em reunião.',
    template: (ctx) => ({
      title: 'Roteiro de apresentação',
      context: `Bullets organizados para apresentar ${ctxPhrase(ctx)} em ~5 minutos.`,
      items: [
        `Slide 1 — Contexto: por que estamos falando disso agora.`,
        `Slide 2 — Sinal/observação central: 1 fato que sustenta o tema.`,
        `Slide 3 — Implicações: o que acontece se nada mudar.`,
        `Slide 4 — Opções: 2-3 caminhos com prós/contras.`,
        `Slide 5 — Recomendação: opção escolhida + por quê.`,
        `Slide 6 — Plano: próximas 2 semanas com responsáveis.`,
      ],
      expectedResult: 'Roteiro pronto pra montar deck ou conduzir reunião.',
      nextStep: 'Validar com 1 par antes da apresentação oficial.',
      sensitiveNotice: mkSensitive(ctx),
    }),
  },
  {
    id: 'gen-dossie', label: 'Criar dossiê', group: 'documento', appliesTo: ['*'],
    description: 'Agrupa o conteúdo como parte de um dossiê.',
    template: (ctx) => ({
      title: 'Dossiê criado',
      context: `Conteúdo agrupado em dossiê sobre ${ctx.domain || ctx.areaMacro || 'o tema'}.`,
      items: [
        `Nome do dossiê: "${ctx.domain || ctx.areaMacro || 'Tema central'}".`,
        `Bloco adicionado: ${ctx.cardTitle || 'tema atual'}.`,
        `Data de inclusão: ${new Date().toLocaleDateString('pt-BR')}.`,
        `Tipo de evidência: documento / análise / registro.`,
        `Conexões com outros temas: identificar 1-2 pontos relacionados.`,
        `Quem mais deveria ver: lista de leitores recomendados.`,
      ],
      expectedResult: 'Dossiê crescendo de forma rastreável.',
      nextStep: 'Continuar adicionando blocos relacionados ao mesmo dossiê.',
      sensitiveNotice: mkSensitive(ctx),
    }),
  },
];

// ─────────────────────────────────────────────────────────────────────
// FERRAMENTAS POR ÁREA — Fiscal / Contábil
// ─────────────────────────────────────────────────────────────────────
export const TOOLS_FISCAL: WorkspaceTool[] = [
  {
    id: 'fis-revisar-impacto', label: 'Revisar impacto fiscal', group: 'analise',
    appliesTo: ['fiscal', 'contabil', 'contábil', 'jurídico-regulatório'],
    sensitive: true,
    template: (ctx) => ({
      title: 'Revisão de impacto fiscal',
      context: `Indícios e pontos de atenção sobre ${ctxPhrase(ctx)} — para revisão fiscal preliminar.`,
      items: [
        'Possível impacto no regime tributário vigente (validar com contador).',
        'Obrigações acessórias que podem ser afetadas (revisar prazos).',
        'Apuração do período em curso: ponto de atenção identificado.',
        'Documentos fiscais relacionados: separar para conferência.',
        'Histórico do contribuinte: comparar com fechamentos anteriores.',
        'Janela de regularização disponível antes do próximo prazo.',
      ],
      expectedResult: 'Diagnóstico preliminar para discussão com responsável fiscal.',
      nextStep: 'Encaminhar para contador/responsável fiscal antes de qualquer ajuste em sistema.',
      sensitiveNotice: SENSITIVE_NOTICE,
    }),
  },
  {
    id: 'fis-separar-docs', label: 'Separar documentos necessários', group: 'evidencia',
    appliesTo: ['fiscal', 'contabil', 'contábil'], sensitive: true,
    template: (ctx) => ({
      title: 'Documentos a separar',
      context: `Lista de documentos fiscais relacionados a ${ctxPhrase(ctx)}.`,
      items: [
        'Notas fiscais do período (entrada e saída).',
        'Apurações de tributos vigentes (DAS, DARF, GNRE conforme regime).',
        'Obrigações acessórias entregues recentemente (SPED, ECF, ECD se aplicável).',
        'Comprovantes de recolhimento dos últimos 3 períodos.',
        'Certidão negativa federal, estadual e municipal.',
        'Cadastros: CNPJ, inscrições e alvarás.',
      ],
      expectedResult: 'Conjunto de evidências pronto para revisão.',
      nextStep: 'Encaminhar pacote ao contador antes de movimentação ou parcelamento.',
      sensitiveNotice: SENSITIVE_NOTICE,
    }),
  },
  {
    id: 'fis-checklist-conf', label: 'Criar checklist de conferência', group: 'execucao',
    appliesTo: ['fiscal', 'contabil', 'contábil'], sensitive: true,
    template: (ctx) => ({
      title: 'Checklist de conferência fiscal',
      context: `Itens de conferência preliminares relacionados a ${ctxPhrase(ctx)}.`,
      items: [
        'Conferir regime tributário ativo e enquadramento atual.',
        'Validar alíquotas aplicadas no período.',
        'Conferir notas canceladas ou substitutas.',
        'Verificar conciliação contábil x fiscal.',
        'Conferir provisões e baixas do período.',
        'Validar saldos credor/devedor de tributos.',
        'Sinalizar divergências para análise do responsável.',
      ],
      expectedResult: 'Checklist marcável para conferência por especialista.',
      nextStep: 'Validar cada item com contador antes de fechar a apuração.',
      sensitiveNotice: SENSITIVE_NOTICE,
    }),
  },
  {
    id: 'fis-mensagem-contador', label: 'Preparar mensagem para contador', group: 'comunicacao',
    appliesTo: ['fiscal', 'contabil', 'contábil'], sensitive: true,
    template: (ctx) => ({
      title: 'Mensagem preparada para contador',
      context: 'Texto pronto para enviar ao responsável fiscal/contábil.',
      items: [
        `Assunto: ${ctx.cardTitle || 'Ponto de atenção fiscal'}.`,
        '— Conteúdo —',
        `Identifiquei um indício relacionado a ${ctxPhrase(ctx)} que pode merecer atenção.`,
        'Resumo do ponto: (descrever observação).',
        'Documentos que separei: (listar).',
        'O que preciso da sua avaliação: validar se há ajuste necessário e qual o prazo.',
        '— Fim —',
      ],
      expectedResult: 'Mensagem clara para iniciar a conversa.',
      nextStep: 'Enviar com os documentos anexados.',
      sensitiveNotice: SENSITIVE_NOTICE,
    }),
  },
  {
    id: 'fis-simular-caixa', label: 'Simular impacto no caixa', group: 'analise',
    appliesTo: ['fiscal', 'contabil', 'financeiro'],
    template: (ctx) => ({
      title: 'Simulação de impacto no caixa',
      context: `Três cenários de impacto financeiro relacionados a ${ctxPhrase(ctx)}.`,
      items: [
        'Cenário conservador: impacto mínimo, dentro do colchão atual de caixa.',
        'Cenário provável: necessidade de provisão pontual sem ajuste estrutural.',
        'Cenário agressivo: necessidade de renegociar prazos ou buscar crédito.',
        'Variáveis críticas: valor estimado, prazo de pagamento, juros aplicáveis.',
        'Pontos de atenção: refletir no fluxo de caixa projetado.',
        'Decisão recomendada: optar pelo cenário que preserva liquidez mínima.',
      ],
      expectedResult: 'Comparativo financeiro para apoiar decisão.',
      nextStep: 'Validar premissas com financeiro antes de comprometer caixa.',
      sensitiveNotice: mkSensitive(ctx),
    }),
  },
  {
    id: 'fis-validacao-obrig', label: 'Marcar validação obrigatória', group: 'validacao',
    appliesTo: ['fiscal', 'contabil', 'jurídico-regulatório'], sensitive: true,
    template: (ctx) => ({
      title: 'Validação humana obrigatória',
      context: `Sinalização de necessidade de revisão humana antes de qualquer ação prática sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Bloqueio temporário até revisão por responsável fiscal/contábil.',
        'Não automatizar ajustes em sistemas internos sem essa validação.',
        'Documentar a comunicação com o responsável (e-mail, mensagem).',
        'Registrar data e nome do validador.',
        'Aguardar parecer formal antes de qualquer movimentação.',
        'Registrar a decisão como evidência local após validação.',
      ],
      expectedResult: 'Tema marcado como dependente de validação humana.',
      nextStep: 'Aguardar parecer e registrar como evidência.',
      sensitiveNotice: SENSITIVE_NOTICE,
    }),
  },
  {
    id: 'fis-conferir-obrigacoes', label: 'Conferir obrigações relacionadas', group: 'analise',
    appliesTo: ['fiscal', 'contabil', 'jurídico-regulatório'], sensitive: true,
    template: (ctx) => ({
      title: 'Obrigações relacionadas',
      context: `Mapeamento de obrigações que podem ser impactadas pelo tema ${ctxPhrase(ctx)}.`,
      items: [
        'Obrigações principais vencendo no período próximo.',
        'Obrigações acessórias atreladas ao tema.',
        'Calendário do mês vigente: prazos críticos.',
        'Histórico de cumprimento das últimas 3 competências.',
        'Multas e juros: indícios de exposição.',
        'Janela de regularização ainda disponível.',
      ],
      expectedResult: 'Mapa de obrigações para acompanhar de perto.',
      nextStep: 'Compartilhar com responsável fiscal e priorizar urgência.',
      sensitiveNotice: SENSITIVE_NOTICE,
    }),
  },
];

// ─────────────────────────────────────────────────────────────────────
// FERRAMENTAS POR ÁREA — Jurídico / Compliance / LGPD
// ─────────────────────────────────────────────────────────────────────
export const TOOLS_JURIDICO: WorkspaceTool[] = [
  {
    id: 'jur-clausulas-criticas', label: 'Separar cláusulas críticas', group: 'analise',
    appliesTo: ['juridico', 'jurídico', 'compliance', 'jurídico-regulatório', 'contratos'], sensitive: true,
    template: (ctx) => ({
      title: 'Cláusulas críticas a observar',
      context: `Pontos contratuais que geralmente exigem atenção em temas como ${ctxPhrase(ctx)}.`,
      items: [
        'Cláusula penal: condições de incidência.',
        'Cláusula resolutiva expressa: gatilhos de rescisão.',
        'Cláusula de não concorrência: prazo, território, compensação.',
        'Cláusula compromissória: foro ou arbitragem.',
        'Cláusula de reajuste/indexação: índice e periodicidade.',
        'Cláusula de SLA / nível de serviço.',
        'Cláusula de confidencialidade e LGPD.',
      ],
      expectedResult: 'Lista pronta para revisão por advogado.',
      nextStep: 'Encaminhar ao jurídico antes de assinar ou rescindir.',
      sensitiveNotice: SENSITIVE_NOTICE,
    }),
  },
  {
    id: 'jur-risco-contratual', label: 'Marcar risco contratual', group: 'monitoramento',
    appliesTo: ['juridico', 'jurídico', 'jurídico-regulatório', 'contratos'], sensitive: true,
    template: (ctx) => ({
      title: 'Risco contratual sinalizado',
      context: `Pontos de atenção contratual relacionados a ${ctxPhrase(ctx)}.`,
      items: [
        'Possível ambiguidade em cláusulas críticas.',
        'Aderência a prazos contratuais nas últimas execuções.',
        'Histórico de aditivos e renegociações recentes.',
        'Riscos de inadimplemento por contraparte.',
        'Garantias previstas no instrumento.',
        'Janela disponível para renegociar antes da renovação.',
      ],
      expectedResult: 'Marcação para o jurídico revisar com prioridade.',
      nextStep: 'Encaminhar formalmente ao jurídico responsável.',
      sensitiveNotice: SENSITIVE_NOTICE,
    }),
  },
  {
    id: 'jur-msg-juridico', label: 'Preparar mensagem para jurídico', group: 'comunicacao',
    appliesTo: ['juridico', 'jurídico', 'compliance', 'jurídico-regulatório'], sensitive: true,
    template: (ctx) => ({
      title: 'Mensagem preparada para jurídico',
      context: 'Texto curto pra repassar ao responsável jurídico.',
      items: [
        `Assunto: ${ctx.cardTitle || 'Ponto sensível para análise jurídica'}.`,
        '— Conteúdo —',
        `Preciso da sua avaliação preliminar sobre ${ctxPhrase(ctx)}.`,
        'Trata-se de um ponto de atenção; ainda não é decisão formal.',
        'O que preciso: confirmar se há risco e qual o caminho recomendado.',
        '— Fim —',
      ],
      expectedResult: 'Mensagem pronta para enviar.',
      nextStep: 'Ajustar destinatário e enviar com documentos relevantes.',
      sensitiveNotice: SENSITIVE_NOTICE,
    }),
  },
  {
    id: 'jur-fatos-hipoteses', label: 'Separar fatos e hipóteses', group: 'analise',
    appliesTo: ['juridico', 'jurídico', 'compliance', 'lgpd', 'jurídico-regulatório'], sensitive: true,
    template: (ctx) => ({
      title: 'Fatos vs hipóteses',
      context: `Separação entre evidências verificadas e suposições sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Fatos confirmados: o que está documentado com fonte e data.',
        'Fatos pendentes de confirmação: indícios sem documentação completa.',
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
    id: 'jur-parecer-prelim', label: 'Preparar parecer preliminar', group: 'documento',
    appliesTo: ['juridico', 'jurídico', 'compliance'], sensitive: true,
    template: (ctx) => ({
      title: 'Parecer preliminar (não definitivo)',
      context: `Estrutura de parecer preliminar para ${ctxPhrase(ctx)} — não substitui parecer formal de advogado.`,
      items: [
        'Resumo do tema: contexto e perguntas centrais.',
        'Pontos de atenção identificados (não conclusivos).',
        'Hipóteses de risco: alto / médio / baixo.',
        'Caminhos possíveis: opções e prós/contras.',
        'Recomendação preliminar: caminho mais seguro inicial.',
        'Necessidade de confirmação: pontos que dependem de revisão formal.',
      ],
      expectedResult: 'Parecer preliminar pronto para discussão com jurídico.',
      nextStep: 'Submeter ao jurídico para validação e formalização.',
      sensitiveNotice: SENSITIVE_NOTICE,
    }),
  },
];

// ─────────────────────────────────────────────────────────────────────
// FERRAMENTAS POR ÁREA — Financeiro
// ─────────────────────────────────────────────────────────────────────
export const TOOLS_FINANCEIRO: WorkspaceTool[] = [
  {
    id: 'fin-simular-caixa', label: 'Simular impacto no caixa', group: 'analise',
    appliesTo: ['financeiro', 'caixa'],
    template: (ctx) => ({
      title: 'Simulação no fluxo de caixa',
      context: `Três cenários de fluxo para apoiar decisão sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Conservador: impacto absorvido pelo colchão atual.',
        'Provável: leve pressão no caixa, sem comprometer pagamentos.',
        'Agressivo: necessidade de antecipação de recebíveis ou crédito.',
        'Variáveis-chave: prazo médio de recebimento (PMR), prazo médio de pagamento (PMP), capital de giro.',
        'Risco principal: ruptura de liquidez no ciclo seguinte.',
        'Marcadores de monitoramento: saldo diário e aging de recebíveis.',
      ],
      expectedResult: 'Comparativo financeiro com decisão recomendada.',
      nextStep: 'Validar premissas com tesouraria antes de comprometer caixa.',
    }),
  },
  {
    id: 'fin-projetar-30', label: 'Projetar próximos 30 dias', group: 'analise',
    appliesTo: ['financeiro', 'caixa', 'contas a pagar', 'contas a receber'],
    template: (ctx) => ({
      title: 'Projeção financeira — 30 dias',
      context: `Projeção rápida considerando ${ctxPhrase(ctx)}.`,
      items: [
        'Entradas previstas (recebimentos confirmados).',
        'Saídas obrigatórias (folha, tributos, fornecedores críticos).',
        'Entradas variáveis (vendas previstas, comissões).',
        'Saídas variáveis (manutenções, eventuais).',
        'Saldo projetado no dia 15 e dia 30.',
        'Ponto de atenção: dias com saldo próximo ao mínimo operacional.',
      ],
      expectedResult: 'Quadro de projeção semanal para decisão.',
      nextStep: 'Atualizar diariamente até passar pelo mês.',
    }),
  },
  {
    id: 'fin-plano-contencao', label: 'Criar plano de contenção', group: 'execucao',
    appliesTo: ['financeiro', 'custos', 'orçamento'],
    template: (ctx) => ({
      title: 'Plano de contenção',
      context: `Conjunto de medidas para reduzir custos diante de ${ctxPhrase(ctx)}.`,
      items: [
        'Identificar custos discricionários adiáveis sem prejuízo operacional.',
        'Renegociar prazos com fornecedores não críticos.',
        'Revisar contratos recorrentes com baixa utilização.',
        'Postergar investimentos que não estão em rota crítica.',
        'Acelerar cobrança ativa em recebíveis com atraso recente.',
        'Comunicação clara à equipe sobre prioridades.',
      ],
      expectedResult: 'Lista de ações imediatas com responsável.',
      nextStep: 'Selecionar 2-3 medidas e iniciar nas próximas 48h.',
    }),
  },
  {
    id: 'fin-resumo-financeiro', label: 'Gerar resumo financeiro', group: 'documento',
    appliesTo: ['financeiro', 'indicadores financeiros'],
    template: (ctx) => ({
      title: 'Resumo financeiro',
      context: `Resumo curto sobre ${ctxPhrase(ctx)} para a liderança.`,
      items: [
        'Indicador-chave do período: tendência e variação.',
        'Comparativo com período anterior: diferença significativa.',
        'Comparativo com orçamento previsto.',
        'Principais fatores explicativos.',
        'Risco prioritário a acompanhar.',
        'Recomendação financeira em 1 frase.',
      ],
      expectedResult: 'Resumo de 1 página para diretoria.',
      nextStep: 'Enviar com indicador-foco da próxima semana.',
    }),
  },
];

// ─────────────────────────────────────────────────────────────────────
// FERRAMENTAS POR ÁREA — Marketing / Vendas
// ─────────────────────────────────────────────────────────────────────
export const TOOLS_MARKETING: WorkspaceTool[] = [
  {
    id: 'mkt-briefing', label: 'Criar briefing de campanha', group: 'documento',
    appliesTo: ['marketing', 'campanhas', 'comercial'],
    template: (ctx) => ({
      title: 'Briefing de campanha',
      context: `Briefing rápido para campanha sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Objetivo da campanha: vendas, leads, awareness ou retenção.',
        'Público-alvo: segmento, persona, momento da jornada.',
        'Mensagem central em 1 frase.',
        'Canais recomendados: meta, google, e-mail, social, físico.',
        'Critérios de sucesso: CTR, CPA, leads, vendas atribuídas.',
        'Prazo de execução e orçamento aproximado.',
      ],
      expectedResult: 'Briefing pronto pra entregar à equipe ou agência.',
      nextStep: 'Validar com responsável de marketing antes de execução.',
    }),
  },
  {
    id: 'mkt-comparar-concorr', label: 'Comparar com concorrência', group: 'analise',
    appliesTo: ['marketing', 'reputação', 'concorrência', 'mercado'],
    template: (ctx) => ({
      title: 'Comparação com concorrência',
      context: `Análise comparativa sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Concorrentes diretos relevantes (até 3).',
        'O que cada um vem fazendo bem nesse tema.',
        'O que cada um vem deixando de fazer.',
        'Diferenciais possíveis da nossa marca.',
        'Riscos competitivos no curto prazo.',
        'Oportunidade de posicionamento alternativo.',
      ],
      expectedResult: 'Quadro comparativo simples pra decidir abordagem.',
      nextStep: 'Validar percepção com 2-3 clientes antes de lançar mensagem.',
    }),
  },
  {
    id: 'mkt-plano-7dias', label: 'Gerar plano de 7 dias', group: 'execucao',
    appliesTo: ['marketing', 'campanhas', 'redes sociais'],
    template: (ctx) => ({
      title: 'Plano de marketing — 7 dias',
      context: `Plano semanal sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Dia 1: definir mensagem e responsável.',
        'Dia 2-3: produção de criativo e copy.',
        'Dia 4: revisão interna e ajustes.',
        'Dia 5: ativação inicial em canal piloto.',
        'Dia 6: leitura de métricas iniciais.',
        'Dia 7: ajuste, escala ou parada.',
      ],
      expectedResult: 'Plano sprint pra rodar e aprender rápido.',
      nextStep: 'Atribuir responsável diário e definir métrica do dia.',
    }),
  },
  {
    id: 'mkt-mensagem-oferta', label: 'Criar mensagem de oferta', group: 'comunicacao',
    appliesTo: ['marketing', 'comercial', 'vendas'],
    template: (ctx) => ({
      title: 'Mensagem de oferta',
      context: `Mensagem promocional sobre ${ctxPhrase(ctx)} para teste local.`,
      items: [
        'Gancho de abertura (1 frase, focado em benefício).',
        'Promessa central concreta e específica.',
        'Prova ou validação social curta.',
        'Chamada para ação clara.',
        'Senso de urgência ou exclusividade.',
        'Versão alternativa A/B para testar.',
      ],
      expectedResult: 'Texto pronto para testar em campanha de baixo custo.',
      nextStep: 'Rodar em 1 canal por 48h e medir conversão.',
    }),
  },
];

// ─────────────────────────────────────────────────────────────────────
// FERRAMENTAS POR ÁREA — Vendas / Comercial
// ─────────────────────────────────────────────────────────────────────
export const TOOLS_VENDAS: WorkspaceTool[] = [
  {
    id: 'vnd-abordagem', label: 'Criar abordagem comercial', group: 'execucao',
    appliesTo: ['vendas', 'comercial', 'crm', 'prospecção'],
    template: (ctx) => ({
      title: 'Abordagem comercial',
      context: `Roteiro de abordagem para ${ctxPhrase(ctx)}.`,
      items: [
        'Gatilho de abordagem: porquê falar agora.',
        'Pergunta de descoberta: 1 que abre conversa real.',
        'Conexão com dor do cliente.',
        'Prova rápida (caso de sucesso comparável).',
        'Próximo passo proposto (ex.: agendar reunião curta).',
        'Plano B se cliente não engajar.',
      ],
      expectedResult: 'Roteiro pra usar em ligação ou conversa direta.',
      nextStep: 'Testar com 5 leads similares e refinar.',
    }),
  },
  {
    id: 'vnd-roteiro', label: 'Gerar roteiro de venda', group: 'documento',
    appliesTo: ['vendas', 'comercial'],
    template: (ctx) => ({
      title: 'Roteiro de venda',
      context: `Roteiro estruturado para conversa de venda sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Abertura: contexto + razão da conversa.',
        'Descoberta: 3 perguntas pra entender o cliente.',
        'Apresentação: solução conectada à necessidade.',
        'Tratamento de objeção: 2-3 prováveis e como responder.',
        'Fechamento: pergunta de avanço (calendário, proposta).',
        'Acompanhamento: o que enviar pós-conversa.',
      ],
      expectedResult: 'Roteiro pra padronizar e treinar time.',
      nextStep: 'Compartilhar com vendedores e medir conversão.',
    }),
  },
  {
    id: 'vnd-followup', label: 'Criar follow-up', group: 'comunicacao',
    appliesTo: ['vendas', 'comercial', 'pós-venda'],
    template: (ctx) => ({
      title: 'Follow-up estruturado',
      context: `Sequência de follow-up para ${ctxPhrase(ctx)}.`,
      items: [
        'Mensagem 1 (D+1): retomar conversa com pergunta direta.',
        'Mensagem 2 (D+4): trazer novidade ou caso comparável.',
        'Mensagem 3 (D+10): oferta condicional ou prazo limite.',
        'Mensagem 4 (D+20): última tentativa amistosa.',
        'Critério de encerramento: 4 mensagens sem retorno.',
        'Registro: anotar resposta ou silêncio no CRM.',
      ],
      expectedResult: 'Cadência pronta pra cole em ferramenta de envio.',
      nextStep: 'Configurar em CRM/automação e medir resposta.',
    }),
  },
  {
    id: 'vnd-analisar-perda', label: 'Analisar perda de venda', group: 'analise',
    appliesTo: ['vendas', 'comercial', 'conversão'],
    template: (ctx) => ({
      title: 'Análise de perda',
      context: `Investigação estruturada sobre perdas relacionadas a ${ctxPhrase(ctx)}.`,
      items: [
        'Em qual etapa do funil aconteceu a perda.',
        'Objeção declarada pelo cliente.',
        'Objeção provável não declarada.',
        'Concorrente envolvido (se identificado).',
        'O que faltou na abordagem.',
        'O que mudaria em uma próxima tentativa.',
      ],
      expectedResult: 'Padrões identificados pra ajustar processo de venda.',
      nextStep: 'Compartilhar aprendizado com time em ritual semanal.',
    }),
  },
];

// ─────────────────────────────────────────────────────────────────────
// FERRAMENTAS POR ÁREA — Operação
// ─────────────────────────────────────────────────────────────────────
export const TOOLS_OPERACAO: WorkspaceTool[] = [
  {
    id: 'op-checklist-op', label: 'Criar checklist operacional', group: 'execucao',
    appliesTo: ['operacional', 'operação', 'processos', 'qualidade'],
    template: (ctx) => ({
      title: 'Checklist operacional',
      context: `Lista de verificação para operação envolvendo ${ctxPhrase(ctx)}.`,
      items: [
        'Validar entrada do processo (insumo correto, no prazo).',
        'Conferir parâmetros operacionais críticos.',
        'Aplicar padrão de execução (SOP vigente).',
        'Registrar não conformidade caso identificada.',
        'Conferir saída do processo (qualidade, quantidade).',
        'Repassar pra próxima etapa com documento.',
        'Encerrar com indicador de produtividade do turno.',
      ],
      expectedResult: 'Checklist marcável pra rotina diária.',
      nextStep: 'Treinar equipe e medir aderência por 7 dias.',
    }),
  },
  {
    id: 'op-gargalos', label: 'Listar gargalos', group: 'analise',
    appliesTo: ['operacional', 'operação', 'processos', 'produtividade'],
    template: (ctx) => ({
      title: 'Gargalos identificados',
      context: `Mapeamento dos principais pontos de bloqueio em ${ctxPhrase(ctx)}.`,
      items: [
        'Gargalo de capacidade: etapa que limita o ritmo total.',
        'Gargalo de habilidade: função que depende de poucas pessoas.',
        'Gargalo de informação: dado que demora a chegar.',
        'Gargalo de aprovação: decisão que trava o fluxo.',
        'Gargalo de fornecedor: dependência externa crítica.',
        'Gargalo de tecnologia: sistema lento ou indisponível.',
      ],
      expectedResult: 'Diagnóstico simples pra priorizar 1 melhoria.',
      nextStep: 'Escolher 1 gargalo e definir ação corretiva em 14 dias.',
    }),
  },
  {
    id: 'op-causa-provavel', label: 'Separar causa provável', group: 'analise',
    appliesTo: ['operacional', 'operação', 'qualidade'],
    template: (ctx) => ({
      title: 'Causas prováveis',
      context: `Análise rápida de causa para ${ctxPhrase(ctx)} — método 5 porquês adaptado.`,
      items: [
        '1. Por que aconteceu? (sintoma imediato)',
        '2. Por que esse sintoma surgiu? (causa intermediária)',
        '3. Por que essa causa existe? (condição estrutural)',
        '4. Por que essa condição se manteve? (gestão/responsabilidade)',
        '5. Por que não foi prevista? (sistema de monitoramento)',
        'Causa raiz provável: nível 4 ou 5 — mas validar com fatos.',
      ],
      expectedResult: 'Causa raiz hipotética pra confirmar com dados.',
      nextStep: 'Confirmar causa antes de implementar ação corretiva.',
    }),
  },
  {
    id: 'op-nao-conformidade', label: 'Registrar não conformidade', group: 'evidencia',
    appliesTo: ['operacional', 'qualidade'],
    template: (ctx) => ({
      title: 'Registro de não conformidade',
      context: `Documentação estruturada de NC relacionada a ${ctxPhrase(ctx)}.`,
      items: [
        `Data do evento: ${new Date().toLocaleDateString('pt-BR')}.`,
        'Local/equipamento/processo envolvido.',
        'Descrição factual (sem julgamentos).',
        'Evidência objetiva: foto, medição, registro de sistema.',
        'Impacto observado: cliente, prazo, custo, qualidade.',
        'Ação imediata aplicada (contenção).',
        'Responsável por investigar causa raiz.',
      ],
      expectedResult: 'NC documentada pra ação corretiva e auditoria.',
      nextStep: 'Atribuir responsável por CAPA e prazo de fechamento.',
    }),
  },
];

// ─────────────────────────────────────────────────────────────────────
// FERRAMENTAS POR ÁREA — Compras / Fornecedores
// ─────────────────────────────────────────────────────────────────────
export const TOOLS_COMPRAS: WorkspaceTool[] = [
  {
    id: 'cmp-comparar-forn', label: 'Comparar fornecedores', group: 'analise',
    appliesTo: ['compras', 'fornecedores', 'cadeia de valor'],
    template: (ctx) => ({
      title: 'Comparação entre fornecedores',
      context: `Matriz comparativa para decisão sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Fornecedor A: preço, prazo, qualidade, condição de pagamento.',
        'Fornecedor B: preço, prazo, qualidade, condição de pagamento.',
        'Fornecedor C (alternativa): mesma estrutura.',
        'Critérios ponderados: custo total (não só preço).',
        'Riscos por fornecedor: dependência, histórico, geografia.',
        'Recomendação: opção com melhor relação custo total × risco.',
      ],
      expectedResult: 'Matriz de decisão pronta pra aprovação.',
      nextStep: 'Validar com compras e financeiro antes de fechar.',
    }),
  },
  {
    id: 'cmp-cotacao', label: 'Preparar pedido de cotação', group: 'comunicacao',
    appliesTo: ['compras', 'cotações', 'fornecedores'],
    template: (ctx) => ({
      title: 'Pedido de cotação (RFQ)',
      context: 'Template pronto para envio aos fornecedores.',
      items: [
        `Item solicitado: ${ctx.cardTitle || '(descrever)'}.`,
        'Especificação técnica detalhada.',
        'Quantidade e prazo de entrega esperado.',
        'Condições de pagamento aceitas.',
        'Local de entrega e responsabilidade pelo frete.',
        'Documentação fiscal e certificações exigidas.',
        'Prazo para retorno da cotação.',
      ],
      expectedResult: 'RFQ pronto para envio a 3+ fornecedores.',
      nextStep: 'Enviar simultaneamente e comparar respostas.',
    }),
  },
  {
    id: 'cmp-risco-forn', label: 'Listar riscos do fornecedor', group: 'analise',
    appliesTo: ['compras', 'fornecedores', 'risco operacional'],
    template: (ctx) => ({
      title: 'Riscos do fornecedor',
      context: `Avaliação rápida de riscos sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Dependência única (single source) — vulnerabilidade alta.',
        'Concentração geográfica — risco climático ou logístico.',
        'Saúde financeira do fornecedor (indícios públicos).',
        'Histórico de cumprimento de prazo nas últimas entregas.',
        'Risco trabalhista/regulatório do fornecedor.',
        'Capacidade de escalar caso o pedido cresça.',
      ],
      expectedResult: 'Mapa de risco pra orientar plano de contingência.',
      nextStep: 'Identificar fornecedor backup para risco crítico.',
    }),
  },
  {
    id: 'cmp-economia', label: 'Simular economia', group: 'analise',
    appliesTo: ['compras', 'custos'],
    template: (ctx) => ({
      title: 'Simulação de economia',
      context: `Estimativa de economia em troca/renegociação sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Custo unitário atual × novo custo unitário.',
        'Volume mensal × diferença = economia mês.',
        'Custos de troca (setup, migração, treinamento).',
        'Tempo de payback estimado.',
        'Riscos da mudança (qualidade, prazo).',
        'Economia anualizada líquida de riscos.',
      ],
      expectedResult: 'Quadro financeiro pra decisão de mudança.',
      nextStep: 'Validar premissas com fornecedor antes de fechar.',
    }),
  },
];

// ─────────────────────────────────────────────────────────────────────
// FERRAMENTAS POR ÁREA — RH / Pessoas
// ─────────────────────────────────────────────────────────────────────
export const TOOLS_RH: WorkspaceTool[] = [
  {
    id: 'rh-plano-treino', label: 'Criar plano de treinamento', group: 'execucao',
    appliesTo: ['rh', 'pessoas', 'treinamento'],
    template: (ctx) => ({
      title: 'Plano de treinamento',
      context: `Plano de capacitação sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Objetivo do treinamento: capacidade específica a ganhar.',
        'Público-alvo: quem precisa participar.',
        'Conteúdo: 3-5 módulos principais.',
        'Formato: online, presencial, on-the-job ou misto.',
        'Carga horária estimada.',
        'Avaliação: como medir aprendizado.',
        'Multiplicador: quem treina os próximos.',
      ],
      expectedResult: 'Plano pronto pra agendar com responsável.',
      nextStep: 'Validar com líder da área antes de convocar equipe.',
    }),
  },
  {
    id: 'rh-riscos-trab', label: 'Listar riscos trabalhistas', group: 'analise',
    appliesTo: ['rh', 'trabalhista', 'jurídico-regulatório'], sensitive: true,
    template: (ctx) => ({
      title: 'Riscos trabalhistas — pontos de atenção',
      context: `Pontos preliminares sobre ${ctxPhrase(ctx)} — não substitui análise do jurídico.`,
      items: [
        'Aderência a normas regulamentadoras vigentes (NRs).',
        'Controle de jornada e banco de horas.',
        'Adicionais devidos (insalubridade, periculosidade, noturno).',
        'Documentação trabalhista (admissão, alteração, rescisão).',
        'Cumprimento de convenção coletiva da categoria.',
        'Indícios em fechamentos trabalhistas anteriores.',
      ],
      expectedResult: 'Pontos para conversa com RH e jurídico trabalhista.',
      nextStep: 'Encaminhar para validação antes de qualquer ação prática.',
      sensitiveNotice: SENSITIVE_NOTICE,
    }),
  },
  {
    id: 'rh-feedback', label: 'Preparar feedback', group: 'comunicacao',
    appliesTo: ['rh', 'pessoas', 'performance', 'liderança'],
    template: (ctx) => ({
      title: 'Estrutura de feedback',
      context: `Roteiro estruturado de feedback (SBI) para ${ctxPhrase(ctx)}.`,
      items: [
        'Situação (S): contexto factual em que algo ocorreu.',
        'Comportamento (B): o que a pessoa fez/disse, sem julgamento.',
        'Impacto (I): consequência observada para outras pessoas/projeto.',
        'Espaço para a outra pessoa: convidar a perspectiva dela.',
        'Acordo de próximo passo: o que muda a partir daqui.',
        'Reconhecimento: pelo menos 1 ponto que está funcionando.',
      ],
      expectedResult: 'Conversa pronta para um-a-um estruturado.',
      nextStep: 'Agendar conversa em ambiente reservado.',
    }),
  },
  {
    id: 'rh-checklist-cont', label: 'Criar checklist de contratação', group: 'execucao',
    appliesTo: ['rh', 'recrutamento'],
    template: (ctx) => ({
      title: 'Checklist de contratação',
      context: `Etapas para fechar contratação relacionada a ${ctxPhrase(ctx)}.`,
      items: [
        'Vaga e descrição publicadas.',
        'Triagem de currículos por critério objetivo.',
        'Entrevistas com pelo menos 2 entrevistadores.',
        'Teste prático ou case (quando aplicável).',
        'Checagem de referências.',
        'Proposta formal com pacote completo.',
        'Onboarding programado.',
      ],
      expectedResult: 'Funil completo pra padronizar contratação.',
      nextStep: 'Aplicar nas próximas vagas e medir tempo de fechamento.',
    }),
  },
];

// ─────────────────────────────────────────────────────────────────────
// FERRAMENTAS POR ÁREA — Tecnologia / Dados
// ─────────────────────────────────────────────────────────────────────
export const TOOLS_TECNOLOGIA: WorkspaceTool[] = [
  {
    id: 'tec-mapear-sistemas', label: 'Mapear sistemas envolvidos', group: 'analise',
    appliesTo: ['tecnologia', 'sistemas', 'integrações'],
    template: (ctx) => ({
      title: 'Sistemas envolvidos',
      context: `Mapa de sistemas e integrações relevantes para ${ctxPhrase(ctx)}.`,
      items: [
        'Sistemas de origem do dado/fluxo.',
        'Integrações em uso (APIs, webhooks, batches).',
        'Dependências críticas e SLA contratado.',
        'Dono técnico de cada sistema.',
        'Pontos de falha conhecidos.',
        'Backup/contingência atual.',
      ],
      expectedResult: 'Mapa simples pra orientar decisão técnica.',
      nextStep: 'Atualizar inventário de integrações com o time.',
    }),
  },
  {
    id: 'tec-riscos-tec', label: 'Listar riscos técnicos', group: 'analise',
    appliesTo: ['tecnologia', 'segurança da informação', 'infraestrutura'], sensitive: true,
    template: (ctx) => ({
      title: 'Riscos técnicos identificados',
      context: `Riscos preliminares sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Risco de indisponibilidade do sistema.',
        'Risco de perda de dados (backup defasado).',
        'Risco de acesso indevido (controle de identidade).',
        'Risco de vulnerabilidade não corrigida.',
        'Risco de dependência única (single point of failure).',
        'Risco de não conformidade regulatória.',
      ],
      expectedResult: 'Quadro de risco pra discussão com responsável de TI.',
      nextStep: 'Encaminhar para CISO/responsável antes de qualquer mudança em produção.',
      sensitiveNotice: SENSITIVE_NOTICE,
    }),
  },
  {
    id: 'tec-checklist-integ', label: 'Criar checklist de integração', group: 'execucao',
    appliesTo: ['tecnologia', 'sistemas', 'integrações', 'automação'],
    template: (ctx) => ({
      title: 'Checklist de integração',
      context: `Itens para validar antes de habilitar integração sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Documentação técnica da API de destino.',
        'Autenticação e gestão de chave/token.',
        'Tratamento de erro e retry.',
        'Volume esperado e rate limit.',
        'Monitoramento de chamadas.',
        'Plano de rollback se falhar.',
        'Logs e auditoria.',
      ],
      expectedResult: 'Checklist pronto pra go-live com baixo risco.',
      nextStep: 'Validar cada item com responsável técnico antes do deploy.',
    }),
  },
  {
    id: 'tec-incidente', label: 'Registrar incidente', group: 'evidencia',
    appliesTo: ['tecnologia', 'segurança da informação', 'infraestrutura'], sensitive: true,
    template: (ctx) => ({
      title: 'Registro de incidente técnico',
      context: `Documentação de incidente envolvendo ${ctxPhrase(ctx)}.`,
      items: [
        `Data/hora de início e detecção.`,
        'Sistema afetado e severidade.',
        'Impacto observado: usuários, processos, dados.',
        'Ação de contenção aplicada.',
        'Comunicação interna realizada.',
        'Responsável pela investigação root cause.',
        'Prazo de post-mortem.',
      ],
      expectedResult: 'Registro pra histórico e aprendizado.',
      nextStep: 'Conduzir post-mortem em até 5 dias.',
      sensitiveNotice: SENSITIVE_NOTICE,
    }),
  },
];

// ─────────────────────────────────────────────────────────────────────
// FERRAMENTAS POR ÁREA — Mercado / Concorrência / Mapa
// ─────────────────────────────────────────────────────────────────────
export const TOOLS_MERCADO: WorkspaceTool[] = [
  {
    id: 'mer-analisar-conc', label: 'Analisar concorrente', group: 'analise',
    appliesTo: ['mercado', 'concorrência'],
    template: (ctx) => ({
      title: 'Análise de concorrente',
      context: `Análise estruturada sobre concorrente relevante para ${ctxPhrase(ctx)}.`,
      items: [
        'Proposta de valor principal.',
        'Pontos fortes percebidos pelo cliente.',
        'Pontos fracos observáveis.',
        'Movimento recente (lançamento, expansão, mudança de time).',
        'Diferença de preço/posicionamento.',
        'Como nos diferenciamos hoje e onde podemos melhorar.',
      ],
      expectedResult: 'Quadro de leitura pra ajustar posicionamento.',
      nextStep: 'Discutir em ritual semanal de comercial/marketing.',
    }),
  },
  {
    id: 'mer-comparar-regioes', label: 'Comparar regiões', group: 'analise',
    appliesTo: ['mercado', 'território', 'expansão'],
    template: (ctx) => ({
      title: 'Comparação entre regiões',
      context: `Quadro comparativo de regiões considerando ${ctxPhrase(ctx)}.`,
      items: [
        'Região A: densidade, concorrência, demanda observada.',
        'Região B: mesma estrutura.',
        'Custos operacionais por região.',
        'Risco competitivo por região.',
        'Oportunidade de captura imediata.',
        'Recomendação: priorizar região com melhor relação risco × retorno.',
      ],
      expectedResult: 'Comparativo pra decisão territorial.',
      nextStep: 'Validar com responsável de expansão antes de definir foco.',
    }),
  },
  {
    id: 'mer-campanha-raio', label: 'Criar campanha por raio', group: 'execucao',
    appliesTo: ['mercado', 'marketing', 'território'],
    template: (ctx) => ({
      title: 'Campanha hiperlocal por raio',
      context: `Plano de campanha territorial sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Definir raio inicial (ex.: 3 km do ponto central).',
        'Segmento de público dentro do raio.',
        'Mensagem regional (referência local).',
        'Canais: geofence, social local, parcerias de bairro.',
        'Orçamento limitado para teste de 7 dias.',
        'Métrica de sucesso: visitas, conversas, vendas no raio.',
      ],
      expectedResult: 'Plano executável pra testar em 1 semana.',
      nextStep: 'Atribuir responsável e iniciar com orçamento controlado.',
    }),
  },
  {
    id: 'mer-monitorar-terr', label: 'Monitorar território', group: 'monitoramento',
    appliesTo: ['mercado', 'território', 'concorrência'],
    template: (ctx) => ({
      title: 'Monitoramento de território',
      context: `Plano de monitoramento contínuo sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Métricas a acompanhar: novos concorrentes, reputação, preço médio.',
        'Frequência de leitura: semanal ou quinzenal.',
        'Responsável por consolidar leitura.',
        'Fontes: mapa público, redes sociais, parceiros locais.',
        'Critério de alerta: mudança relevante (>10% de variação).',
        'Plano de resposta inicial pra cada tipo de alerta.',
      ],
      expectedResult: 'Rotina de monitoramento ativa.',
      nextStep: 'Definir responsável e marcar primeira leitura.',
    }),
  },
];

// ─────────────────────────────────────────────────────────────────────
// FERRAMENTAS POR ÁREA — Navegador / Documento / Upload
// ─────────────────────────────────────────────────────────────────────
export const TOOLS_DOCUMENTO: WorkspaceTool[] = [
  {
    id: 'doc-evidencia', label: 'Salvar como evidência', group: 'evidencia',
    appliesTo: ['*'], source: ['browser', 'upload'],
    template: (ctx) => ({
      title: 'Evidência registrada',
      context: `Conteúdo salvo como evidência rastreável: ${ctxPhrase(ctx)}.`,
      items: [
        `Origem: ${ctx.source || 'documento'}.`,
        `Data de captura: ${new Date().toLocaleDateString('pt-BR')}.`,
        'Tipo de evidência: documento, link, transcrição.',
        'Confiabilidade: alta, média ou a confirmar.',
        'Vínculo com o tema central.',
        'Onde será arquivada (dossiê/sistema).',
      ],
      expectedResult: 'Evidência catalogada localmente.',
      nextStep: 'Incluir em dossiê e revisar trimestralmente.',
      sensitiveNotice: mkSensitive(ctx),
    }),
  },
  {
    id: 'doc-extrair-criticos', label: 'Extrair pontos críticos', group: 'analise',
    appliesTo: ['*'], source: ['browser', 'upload', 'workspace'],
    template: (ctx) => ({
      title: 'Pontos críticos extraídos',
      context: `Síntese dos pontos críticos do conteúdo sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Afirmação principal do documento.',
        'Dados ou números que sustentam a afirmação.',
        'Pressuposto não declarado relevante.',
        'Ponto contestável que merece validação.',
        'Implicação prática direta.',
        'Recomendação implícita ou explícita.',
      ],
      expectedResult: 'Resumo dos pontos-chave pra leitura rápida.',
      nextStep: 'Validar pontos críticos com especialista da área.',
      sensitiveNotice: mkSensitive(ctx),
    }),
  },
];

// ─────────────────────────────────────────────────────────────────────
// FERRAMENTAS POR PERFIL
// ─────────────────────────────────────────────────────────────────────
export const TOOLS_PERFIL_CENTRAL: WorkspaceTool[] = [
  {
    id: 'pc-comparar-unidades', label: 'Comparar unidades', group: 'analise',
    appliesTo: ['*'], profile: ['franchisor', 'codify'],
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
    id: 'pc-visao-consolidada', label: 'Gerar visão consolidada', group: 'documento',
    appliesTo: ['*'], profile: ['franchisor', 'codify'],
    template: (ctx) => ({
      title: 'Visão consolidada da estrutura',
      context: `Visão de rede sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Métrica agregada da estrutura.',
        'Distribuição por porte de unidade.',
        'Concentração regional.',
        'Tendência das últimas semanas.',
        'Alertas ativos por unidade.',
        'Próxima decisão estratégica recomendada.',
      ],
      expectedResult: 'Painel pra reunião de direção.',
      nextStep: 'Distribuir pra liderança e comentar em ritual mensal.',
    }),
  },
  {
    id: 'pc-enviar-unidade', label: 'Enviar para unidade', group: 'comunicacao',
    appliesTo: ['*'], profile: ['franchisor'],
    template: (ctx) => ({
      title: 'Comunicado para unidade',
      context: 'Mensagem padronizada para repassar à unidade conectada.',
      items: [
        `Assunto: ${ctx.cardTitle || 'Orientação da Central'}.`,
        '— Conteúdo —',
        `Tema: ${ctxPhrase(ctx)}.`,
        'Contexto: por que estamos comunicando agora.',
        'Orientação prática: o que esperamos da unidade.',
        'Prazo de retorno e responsável central.',
        '— Fim —',
      ],
      expectedResult: 'Comunicado pronto pra envio aos gestores locais.',
      nextStep: 'Personalizar destinatário e enviar.',
    }),
  },
];

export const TOOLS_PERFIL_UNIDADE: WorkspaceTool[] = [
  {
    id: 'pu-executar-orient', label: 'Executar orientação da central', group: 'execucao',
    appliesTo: ['*'], profile: ['franchise'],
    template: (ctx) => ({
      title: 'Execução de orientação',
      context: `Plano local para executar orientação sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Entendimento da orientação central em 1 frase.',
        'Tradução para a realidade da unidade.',
        'Responsável local pela execução.',
        'Prazo realista de execução.',
        'Riscos locais que podem atrapalhar.',
        'Como reportar conclusão à central.',
      ],
      expectedResult: 'Plano local executável.',
      nextStep: 'Iniciar a execução e reportar à central no prazo.',
    }),
  },
  {
    id: 'pu-reportar-pend', label: 'Reportar pendência', group: 'comunicacao',
    appliesTo: ['*'], profile: ['franchise'],
    template: (ctx) => ({
      title: 'Reporte de pendência para central',
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
      nextStep: 'Enviar para responsável da Central e acompanhar.',
    }),
  },
];

export const TOOLS_PERFIL_CODIFY: WorkspaceTool[] = [
  {
    id: 'cf-auditar-sistema', label: 'Auditar sistema', group: 'analise',
    appliesTo: ['*'], profile: ['codify'],
    template: (ctx) => ({
      title: 'Auditoria de sistema',
      context: `Roteiro rápido de auditoria sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Comportamento esperado documentado.',
        'Comportamento observado real.',
        'Diferença que justifica a observação.',
        'Hipótese de causa (dado, lógica, integração).',
        'Plano de teste pra confirmar hipótese.',
        'Correção mínima possível.',
      ],
      expectedResult: 'Roteiro de auditoria pra time técnico.',
      nextStep: 'Criar tarefa de teste e atribuir.',
    }),
  },
  {
    id: 'cf-rel-tecnico', label: 'Gerar relatório técnico', group: 'documento',
    appliesTo: ['*'], profile: ['codify'],
    template: (ctx) => ({
      title: 'Relatório técnico',
      context: `Estrutura de relatório técnico sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Contexto técnico.',
        'Problema observado com evidências.',
        'Análise de causa raiz.',
        'Opções de solução com prós/contras.',
        'Recomendação técnica.',
        'Próximos passos e responsáveis.',
      ],
      expectedResult: 'Relatório pronto pra revisão de pares.',
      nextStep: 'Submeter pra revisão e atualizar documentação.',
    }),
  },
];

export const TOOLS_PERFIL_AFILIADO: WorkspaceTool[] = [
  {
    id: 'af-indicacao', label: 'Gerar indicação', group: 'comunicacao',
    appliesTo: ['*'], profile: ['affiliate', 'team_member'],
    template: (ctx) => ({
      title: 'Indicação estruturada',
      context: `Mensagem pra indicar contato relevante sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Quem está sendo indicado e por quê.',
        'Encaixe com o cliente em potencial.',
        'Próximo passo proposto (apresentação, reunião).',
        'Material de apoio que vai junto.',
        'Quando esperar retorno.',
        'Critério de sucesso da indicação.',
      ],
      expectedResult: 'Indicação pronta pra registrar e enviar.',
      nextStep: 'Registrar em CRM ou planilha de acompanhamento.',
    }),
  },
];

export const TOOLS_PERFIL_PARCEIRO: WorkspaceTool[] = [
  {
    id: 'pr-proposta-parceria', label: 'Criar proposta de parceria', group: 'documento',
    appliesTo: ['*'], profile: ['partner'],
    template: (ctx) => ({
      title: 'Proposta de parceria',
      context: `Estrutura de proposta de parceria sobre ${ctxPhrase(ctx)}.`,
      items: [
        'Valor que cada parte traz.',
        'Modelo proposto: comissão, fee, troca, equity.',
        'Compromissos mútuos com prazo.',
        'Métricas de sucesso compartilhadas.',
        'Critério de revisão.',
        'Cláusulas críticas a alinhar com jurídico.',
      ],
      expectedResult: 'Esboço pronto pra conversa formal.',
      nextStep: 'Validar com jurídico antes de assinar.',
      sensitiveNotice: mkSensitive(ctx),
    }),
  },
];
