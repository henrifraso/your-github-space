// Geração local de conteúdo por sub-ação (fallback).
//
// `buildFallbackForSub` é o coração da geração local da Área de Trabalho.
// Cada sub-action (resumir, explicar, plano, checklist, ...) gera um
// shape de resultado compatível com o renderer do endpoint (pesquisar /
// executar / aprender / ...). Hoje 100% local; futuramente pode ser
// substituído por chamada LLM/backend mantendo a mesma interface.
//
// Conteúdo movido de src/components/ChatPanel.tsx (Fase 10) byte-a-byte.
// Nenhum texto, label, chave ou ordem foi alterado.

import type { IntelligenceCard } from '../../../core/types/card';
import type {
  Dificuldade,
  SubAction,
} from './workspace-generation';
import { DIFICULDADE_LABELS } from './workspace-generation';

// Fallback local específico por sub-ação. Cada botão gera conteúdo distinto,
// no shape compatível com o renderer do endpoint (pesquisar/executar/aprender/...).
export function buildFallbackForSub(card: IntelligenceCard, sub: SubAction, difficulty: Dificuldade): Record<string, unknown> {
  const titulo  = card.titulo;
  const resumo  = card.resumo || titulo;
  const dom     = card.area || card.dominio || 'operação';
  const urg     = card.urgencia || 'media';
  const acao    = card.o_que_fazer || 'definir próximo passo';
  const _dif    = DIFICULDADE_LABELS[difficulty];
  // F6b: cards de hipótese ganham variante conservadora nas sub-ações.
  const isHyp   = card.isHypothesis === true;

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
        pontos_chave: isHyp
          ? [
              `Explicação simples: ${resumo}`,
              `Contexto: o tema toca ${dom}, mas ainda depende de validação com dado interno antes de virar leitura medida.`,
              `Como tratar: como hipótese a validar — sem prescrição forte antes da primeira leitura.`,
              `Por que importa: vale acompanhar para não deixar tema relevante sair do radar; ao mesmo tempo, evitar agir como se já houvesse dado.`,
              `Próximo passo: definir 1 indicador interno simples e responsável pela leitura. Plano amplo só após confirmação.`,
            ]
          : [
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
        paragrafos: isHyp
          ? [
              `Análise editorial de "${titulo}" — tema com dado interno ainda pendente.`,
              `Contexto: ${dom} é área relevante para a operação, mas a leitura proposta aqui é hipótese, não medição.`,
              `Causas possíveis (caso a hipótese se confirme): movimento competitivo, gap operacional interno, mudança no comportamento do cliente local, sazonalidade ou evento externo. Vale lembrar que ordem de prioridade depende de dado interno.`,
              `Cuidados editoriais: sem dado medido, não estimar percentuais de impacto nem prazos rígidos de reação. O risco é tratar a hipótese como fato e desencadear plano amplo desnecessário.`,
              `Sinais relacionados que podem ajudar a validar: avaliações públicas, comportamento de concorrentes próximos, feedback qualitativo da equipe, variação de fluxo orgânico.`,
              `Hipótese principal: ${resumo}`,
              `Hipótese alternativa: pode ser flutuação sazonal ou ruído de medição — vale confirmar com 1-2 indicadores adicionais antes de decisão grande.`,
              `Recomendação: definir 1 indicador interno simples para checar a hipótese, com 1 responsável pela leitura. Sem plano operacional antes da primeira medição.`,
            ]
          : [
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
        pontos_chave: isHyp
          ? [
              `Risco editorial principal: tratar a hipótese como fato e desencadear plano amplo antes de ter dado interno.`,
              `Sem dado medido, não estimar impacto numérico. Qualquer percentual aqui é palpite.`,
              `Risco secundário: ignorar tema relevante e deixar sair do radar até virar problema visível.`,
              `Sinais que ajudariam a validar: leitura interna do indicador citado no card, conversa estruturada com a equipe, comparação com período anterior.`,
              `Ação preventiva: tratar como monitoramento até haver evidência suficiente — definir baseline antes de executar plano amplo.`,
            ]
          : [
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
        pontos_chave: isHyp
          ? [
              `Oportunidade principal: se a hipótese se confirmar com dado interno, decisão fica melhor calibrada em ${dom}.`,
              `Por que existe: tema relevante que ainda não foi medido pela própria empresa — espaço para tirar leitura própria antes do mercado.`,
              `Como começar: 1 indicador interno simples, 1 responsável pela leitura, ciclo curto de revisão.`,
              `Esforço necessário: baixo na fase de validação — basta atribuir leitura recorrente do indicador escolhido.`,
              `Retorno editorial: clareza sobre o que é hipótese e o que é dado medido. Plano operacional só depois.`,
            ]
          : [
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
