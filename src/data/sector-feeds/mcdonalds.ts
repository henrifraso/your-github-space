import type { CompanySectorFeeds } from '../../types';

export const MCDONALDS_SECTOR_FEEDS: CompanySectorFeeds = {
  marketing: [
    {
      sectionTitle: 'Campanhas Ativas',
      cards: [
        {
          color: '#ec4899',
          tag: 'CAMPANHA',
          title: 'McFlurry Páscoa — última semana de veiculação',
          detail: 'Campanha do McFlurry Ovomaltine Páscoa entra na última semana de veiculação. Material nos painéis internos e totens digitais programados até domingo 11/05. Venda do produto subiu 34% vs. período equivalente sem ação. Estoque de calda Ovomaltine verificar (ver Estoque).',
          badge: { label: 'Encerrando', type: 'warn' },
        },
        {
          color: '#ec4899',
          tag: 'PROMOÇÃO',
          title: 'App Méqui: cupom 30% OFF — 1.840 resgates esta semana',
          detail: 'Cupom de 30% OFF no App Méqui gerou 1.840 resgates na semana, tíquete médio R$38,20. Margem ligeiramente reduzida, mas tráfego aumentou 22% nos horários de desconto (11h-12h). Próximo cupom programado para semana do Dia das Mães.',
          badge: { label: '1.840 resgates', type: 'ok' },
        },
        {
          color: '#ec4899',
          tag: 'SAZONAL',
          title: 'McLanche Feliz Maio — brinquedo novo a confirmar',
          detail: 'Coleção de maio do McLanche Feliz ainda sem confirmação do brinquedo por parte da franqueadora. Fornecimento deve ser confirmado até 13/05. Material de ponto-de-venda impresso aguarda liberação. Impacto nas vendas infantis nos finais de semana.',
          badge: { label: 'Aguardando', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Reputação Digital',
      cards: [
        {
          color: '#ec4899',
          tag: 'REVIEWS',
          title: 'Google Reviews: 4,2 ⭐ — 3 avaliações negativas esta semana',
          detail: '3 avaliações de 1-2 estrelas na semana: 2 reclamações de demora no drive-thru e 1 sobre pedido errado via delivery. Gerente respondeu a todas em menos de 12h. Ação: revisão do processo de conferência de sacola no turno da tarde.',
          badge: { label: '4,2/5', type: 'ok' },
        },
        {
          color: '#ec4899',
          tag: 'REDES SOCIAIS',
          title: 'Instagram da unidade: post Dia das Mães agendado',
          detail: 'Post especial para o Dia das Mães (11/05) agendado para publicação às 08h00. Conteúdo aprovado pela central de comunicação da franquia. Story promocional com link para o app Méqui incluso. Alcance esperado: 2.800 contas.',
          badge: { label: 'Agendado', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Fidelização e App',
      cards: [
        {
          color: '#ec4899',
          tag: 'APP',
          title: 'Méqui App: 68% dos pedidos no balcão via QR Code',
          detail: '68% dos clientes que passam pelo balcão utilizam o App Méqui para identificação e acúmulo de pontos. Meta da rede: 75%. Ação local: treinamento do time para incentivar o download no momento do atendimento — iniciado esta semana.',
          badge: { label: 'Meta: 75%', type: 'warn' },
        },
      ],
    },
  ],

  vendas: [
    {
      sectionTitle: 'Faturamento e Ticket',
      cards: [
        {
          color: '#10b981',
          tag: 'FATURAMENTO',
          title: 'Faturamento semanal: R$198.400 — +4,2% vs. semana anterior',
          detail: 'Faturamento da semana superou R$198.000, alta de 4,2% em relação à semana passada. Domingo (R$42.600) e sábado (R$38.900) continuam líderes. Segunda-feira segue como dia mais fraco (R$21.300). Meta semanal da franquia: R$195.000 — atingida.',
          badge: { label: 'Meta atingida', type: 'ok' },
        },
        {
          color: '#10b981',
          tag: 'TICKET MÉDIO',
          title: 'Ticket médio: R$42,80 — queda de R$1,20 vs. mês anterior',
          detail: 'Ticket médio caiu de R$44,00 para R$42,80 em abril. Análise aponta maior uso de cupons de desconto como causa principal. Meta corporativa: manter acima de R$42. Iniciativa: treinamento de upsell (oferta de combo e sobremesa) para o turno da manhã.',
          badge: { label: 'Monitorar', type: 'warn' },
        },
        {
          color: '#10b981',
          tag: 'PRODUTO',
          title: 'Big Mac: 91% da meta de vendas — acima da semana passada',
          detail: 'Venda de Big Mac atingiu 91% da meta semanal de 680 unidades (620 vendidos). Crescimento de 6 pontos percentuais vs. semana anterior (85%). Período do dia com maior venda: jantar (18h-21h), responsável por 38% do total.',
          badge: { label: '91% da meta', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Canais e Pico',
      cards: [
        {
          color: '#10b981',
          tag: 'DELIVERY',
          title: 'Delivery: 43% do faturamento — iFood (34%) e Rappi (9%)',
          detail: 'Canal delivery representa 43% do faturamento total da semana. iFood lidera com 34% (R$67.500) e Rappi com 9% (R$17.800). Tempo médio de preparo para delivery: 4m20s — abaixo do SLA de 5min. Taxa de cancelamento: 1,8%.',
          badge: { label: '43% do total', type: 'ok' },
        },
        {
          color: '#10b981',
          tag: 'PICO',
          title: 'Horário de pico: 11h-14h — fila acima de 8 min às 12h30',
          detail: 'Pico de vendas concentrado entre 11h e 14h (52% do faturamento diário). Às 12h30, tempo de espera médio no balcão chegou a 8min30s — acima do padrão de 6min. Escala reforçada com 2 atendentes extras aos dias de semana a partir desta semana.',
          badge: { label: 'Fila monitorar', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Drive-Thru e Autoatendimento',
      cards: [
        {
          color: '#10b981',
          tag: 'DRIVE-THRU',
          title: 'Drive-thru: tempo médio 3m42s — meta 4min cumprida',
          detail: 'Tempo médio de atendimento no drive-thru foi de 3m42s na semana — dentro da meta de 4 minutos. 74% dos carros atendidos em menos de 4 minutos. Ocorrência de travamento no sistema de pagamento na quinta-feira gerou atraso de 12 minutos — já corrigido.',
          badge: { label: '3m42s — OK', type: 'ok' },
        },
        {
          color: '#10b981',
          tag: 'TOTEM',
          title: 'Totens de autoatendimento: R$58.200 — 29% do balcão',
          detail: '3 totens de autoatendimento geraram R$58.200 na semana, representando 29% das vendas do balcão. Ticket médio nos totens é R$4,60 maior do que no balcão humano — clientes tendem a adicionar mais itens. Totem 2 com tela com leve lag — manutenção agendada.',
          badge: { label: '29% do balcão', type: 'info' },
        },
      ],
    },
  ],

  financeiro: [
    {
      sectionTitle: 'Custos e CMV',
      cards: [
        {
          color: '#f59e0b',
          tag: 'CMV',
          title: 'CMV abril: 32,4% — alta de 1,2pp vs. meta de 31%',
          detail: 'Custo da Mercadoria Vendida subiu para 32,4% do faturamento em abril, 1,2 ponto percentual acima da meta de 31%. Principal driver: reajuste de 8% no preço da batata congelada pelo fornecedor McCain. Análise em andamento para absorção ou repasse parcial no preço do combo.',
          badge: { label: 'Acima da meta', type: 'warn' },
        },
        {
          color: '#f59e0b',
          tag: 'ENERGIA',
          title: 'Conta de energia: R$28.400 — alta de 4% vs. março',
          detail: 'Fatura de energia elétrica atingiu R$28.400 em abril, aumento de 4% versus março. Equipamentos com maior consumo: fritadeiras (38%), climatização (29%), câmaras frias (18%). Técnico de manutenção avaliará eficiência das câmaras frias na próxima visita.',
          badge: { label: '+4% vs. março', type: 'warn' },
        },
        {
          color: '#f59e0b',
          tag: 'FOLHA',
          title: 'Folha de abril: R$92.600 — dentro do orçamento',
          detail: 'Folha de pagamento de abril (48 colaboradores): R$92.600, incluindo encargos. Valor dentro do orçamento mensal de R$95.000. Horas extras representaram 3,2% do total (R$2.960) — concentradas nos finais de semana e feriado de Tiradentes.',
          badge: { label: 'No orçamento', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Obrigações Fiscais',
      cards: [
        {
          color: '#f59e0b',
          tag: 'SIMPLES',
          title: 'DAS — SIMPLES Nacional vence em 20 dias (20/05)',
          detail: 'Guia DAS do SIMPLES Nacional com vencimento em 20/05. Valor estimado: R$41.800 sobre o faturamento de abril. Contador já emitiu guia e aguarda aprovação do gestor para pagamento. Caixa disponível confirmado pelo financeiro.',
          badge: { label: 'Vence em 20 dias', type: 'warn' },
        },
        {
          color: '#f59e0b',
          tag: 'FISCAL',
          title: 'NF-e: 100% emitidas — sem pendências fiscais',
          detail: 'Todas as notas fiscais de fornecedores do mês de abril conferidas e lançadas. Nenhuma divergência ou nota cancelada. Certificado digital A1 válido até novembro/2026. Escrituração fiscal digital (EFD) enviada ao SEFAZ dentro do prazo.',
          badge: { label: '100% em dia', type: 'ok' },
        },
      ],
    },
  ],

  rh: [
    {
      sectionTitle: 'Quadro de Pessoal',
      cards: [
        {
          color: '#8b5cf6',
          tag: 'AUSÊNCIA',
          title: '2 faltas no turno de domingo sem aviso prévio',
          detail: '2 colaboradores do turno da tarde de domingo (12h-20h) faltaram sem comunicação prévia. Time ficou com 6 atendentes em vez de 8 no horário de maior movimento. Gerente de turno acionou reserva técnica — 1 cobriu. Conversas individuais agendadas para segunda-feira.',
          badge: { label: 'Ocorrência', type: 'warn' },
        },
        {
          color: '#8b5cf6',
          tag: 'EXPERIÊNCIA',
          title: '3 colaboradores em período de experiência — avaliação em 30 dias',
          detail: '3 novos colaboradores (2 atendentes de balcão + 1 cozinheiro) completam 45 dias de experiência em 06/06. Avaliação de performance parcial realizada: todos com desempenho satisfatório. Decisão de efetivação será tomada após avaliação final.',
          badge: { label: 'Avaliação em 30d', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Treinamentos',
      cards: [
        {
          color: '#8b5cf6',
          tag: 'TREINAMENTO',
          title: 'Higiene e Manipulação de Alimentos — 3 pendentes',
          detail: 'Treinamento obrigatório de Boas Práticas de Manipulação de Alimentos (ANVISA) com 3 colaboradores pendentes. Prazo da franqueadora: 31/05. 2 são dos novos contratados (aguardando turma), 1 é colaborador antigo que faltou à última sessão. Nova data: 16/05.',
          badge: { label: '3 pendentes', type: 'warn' },
        },
        {
          color: '#8b5cf6',
          tag: 'TREINAMENTO',
          title: 'Treinamento Atendimento ao Cliente — concluído com 94%',
          detail: 'Módulo de atendimento ao cliente do McDonald\'s University concluído por 47 de 48 colaboradores (98%). 1 colaborador afastado por licença médica completará ao retorno. Avaliação média da turma: 8,6/10. Próximo módulo: Segurança Alimentar (junho).',
          badge: { label: '98% concluído', type: 'ok' },
        },
        {
          color: '#8b5cf6',
          tag: 'ESCALA',
          title: 'Escala de Dia das Mães (11/05) — confirmação até sexta',
          detail: 'Domingo 11/05 (Dia das Mães) é historicamente o dia de maior movimento do ano — faturamento 35% acima da média. Escala reforçada com 12 atendentes (vs. 8 habituais) e 4 cozinheiros (vs. 3). Necessário confirmar presença de todos até sexta-feira 09/05.',
          badge: { label: 'Confirmar até sex', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Benefícios e Encargos',
      cards: [
        {
          color: '#8b5cf6',
          tag: 'BENEFÍCIOS',
          title: 'Vale Transporte — recarga mensal processada',
          detail: 'Recarga do Vale Transporte de maio processada para 38 colaboradores beneficiados. Total: R$9.240. 4 colaboradores atualizaram endereço e tiveram valores recalculados. Créditos disponíveis nos cartões a partir de 08/05.',
          badge: { label: 'Processado', type: 'ok' },
        },
      ],
    },
  ],

  operacoes: [
    {
      sectionTitle: 'Equipamentos',
      cards: [
        {
          color: '#06b6d4',
          tag: 'MANUTENÇÃO',
          title: 'Fritureiro #2 — temperatura irregular, técnico acionado',
          detail: 'Fritureiro #2 da linha de produção apresenta variação de temperatura (165°C-185°C, fora da faixa padrão de 175°C±2°C). Produção de batata frita foi temporariamente direcionada para os fritureiros #1 e #3. Técnico da MF Refrigeração agendado para amanhã 07h.',
          badge: { label: 'Técnico acionado', type: 'warn' },
        },
        {
          color: '#06b6d4',
          tag: 'OK',
          title: 'Câmaras frias — todas dentro da temperatura padrão',
          detail: '4 câmaras frias monitoradas: câmara de carnes (2°C), câmara de laticínios (3°C), câmara de vegetais (4°C) e câmara de sobremesas/produtos (4°C). Todas dentro dos padrões ANVISA. Limpeza profunda quinzenal realizada em 28/04, próxima em 12/05.',
          badge: { label: 'Tudo OK', type: 'ok' },
        },
        {
          color: '#06b6d4',
          tag: 'MANUTENÇÃO',
          title: 'Máquina de sorvete — limpeza diária em dia por 7 dias',
          detail: 'Máquina de sorvete/McFlurry com registro de limpeza diária completado pelos últimos 7 dias consecutivos. Registro fotográfico arquivado conforme exigência da franqueadora. Temperatura de serviço: -5°C (padrão McDonald\'s). Próxima manutenção preventiva: 20/05.',
          badge: { label: '7/7 dias OK', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Checklist e Higiene',
      cards: [
        {
          color: '#06b6d4',
          tag: 'HIGIENE',
          title: 'Checklist de limpeza: 6/7 áreas OK — banheiro masculino pendente',
          detail: 'Checklist diário de limpeza: 6 de 7 áreas aprovadas no turno da tarde. Banheiro masculino com pendência: dispensador de sabonete vazio (não reabastecido no turno da manhã). Corrigido às 15h30. Responsável de turno notificado e registro atualizado.',
          badge: { label: '6/7 — 1 pendência', type: 'warn' },
        },
        {
          color: '#06b6d4',
          tag: 'DELIVERY',
          title: 'Tempo de preparo delivery: 4m18s — dentro do SLA de 5min',
          detail: 'Tempo médio de preparo dos pedidos de delivery (iFood + Rappi): 4m18s na semana. Meta SLA: 5 minutos. Taxa de pedidos entregues no prazo: 96,4%. 3,6% atrasados por pico não previsto na sexta-feira às 19h. Equipe de cozinha reforçada neste horário.',
          badge: { label: '4m18s — OK', type: 'ok' },
        },
      ],
    },
  ],

  estoque: [
    {
      sectionTitle: 'Insumos Críticos',
      cards: [
        {
          color: '#84cc16',
          tag: 'CRÍTICO',
          title: 'Embalagens Big Mac — estoque para 2 dias, pedido urgente',
          detail: 'Estoque de embalagens exclusivas do Big Mac atingiu nível crítico: apenas 420 unidades restantes, equivalente a 2 dias de produção na média atual (210 unidades/dia). Pedido de reposição emitido com urgência ao fornecedor Bempack. Prazo de entrega: 48-72h.',
          badge: { label: 'CRÍTICO 2 dias', type: 'warn' },
        },
        {
          color: '#84cc16',
          tag: 'ATENÇÃO',
          title: 'Batata congelada McCain — 60% do estoque mínimo',
          detail: 'Estoque de batata congelada em 60% do ponto de reabastecimento. Consumo semanal médio: 480kg. Estoque atual: 290kg (aproximadamente 4 dias). Pedido já inserido no sistema de abastecimento da rede — entrega programada para 09/05 (sexta). Fritureiro #2 parado agrava consumo no #3.',
          badge: { label: '60% — atenção', type: 'warn' },
        },
        {
          color: '#84cc16',
          tag: 'CALDA',
          title: 'Calda Ovomaltine (McFlurry Páscoa) — estoque até domingo',
          detail: 'Estoque de calda Ovomaltine para o McFlurry Páscoa suficiente até domingo 11/05, alinhado ao fim da campanha. Não será realizado novo pedido — produto saindo de linha. Caso a venda acelere no final de semana, comunicar gerência para possível antecipação de retirada do cardápio.',
          badge: { label: 'Suficiente até dom', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Estoque Geral',
      cards: [
        {
          color: '#84cc16',
          tag: 'OK',
          title: 'Bebidas e refrigerantes — estoque para 12 dias',
          detail: 'Estoque de bebidas (Coca-Cola, Fanta, Sprite, água) regularizado após entrega de 07/05. Inventário atual cobre 12 dias de operação. Geladeira de exposição em temperatura correta (4°C). Ruptura zero nas últimas 3 semanas.',
          badge: { label: '12 dias — OK', type: 'ok' },
        },
        {
          color: '#84cc16',
          tag: 'INVENTÁRIO',
          title: 'Inventário mensal realizado — 2 divergências identificadas',
          detail: 'Inventário mensal realizado em 30/04. 2 divergências identificadas: 14 unidades de McNuggets 10 peças (sobra não registrada) e 6 sorvetes casquinha (falta). Valores totais dentro da margem de tolerância de 0,5%. Lançamento de ajuste realizado no sistema.',
          badge: { label: '2 divergências', type: 'info' },
        },
      ],
    },
  ],

  juridico: [
    {
      sectionTitle: 'Saúde Regulatória',
      cards: [
        {
          color: '#f97316',
          tag: 'VIGILÂNCIA',
          title: 'Vigilância Sanitária — auditoria Q2 prevista para junho',
          detail: 'Auditoria trimestral da Vigilância Sanitária prevista para junho de 2026 (data exata não comunicada). Última auditoria (março): aprovação com pontuação 9,2/10 — 2 observações de baixo risco já corrigidas. Checklist de preparação disponível com o gerente operacional.',
          badge: { label: 'Audita em jun', type: 'info' },
        },
        {
          color: '#f97316',
          tag: 'PROCON',
          title: 'PROCON — 0 reclamações ativas no mês',
          detail: 'Nenhuma reclamação registrada no PROCON em abril. Histórico do ano: 2 reclamações em fevereiro (ambas encerradas com acordo) e 0 em março. Política de resolução imediata no balcão — gerente autorizado a refazer pedido ou reembolsar até R$80 sem necessidade de aprovação superior.',
          badge: { label: '0 reclamações', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Contratos',
      cards: [
        {
          color: '#f97316',
          tag: 'ALUGUEL',
          title: 'Contrato de locação — renovação em julho/2026',
          detail: 'Contrato de locação do imóvel vence em 31/07/2026. Locador já sinalizou interesse em renovação com reajuste pelo IGPM (acumulado 12 meses: 6,8%). Negociação iniciada pelo jurídico da franquia. Meta: assinar renovação até 30/05 para garantir condições atuais.',
          badge: { label: 'Renovar até mai', type: 'warn' },
        },
        {
          color: '#f97316',
          tag: 'FRANQUIA',
          title: 'Taxa de royalties — pagamento mensal em dia',
          detail: 'Royalties mensais da franquia McDonald\'s (4% do faturamento bruto + 4% fundo de propaganda) pagos em dia. Abril: R$31.744 (faturamento bruto R$396.800). Comprovante enviado à franqueadora via portal. Próximo vencimento: 10/06.',
          badge: { label: 'Em dia', type: 'ok' },
        },
        {
          color: '#f97316',
          tag: 'TRABALHISTA',
          title: 'Ação trabalhista ex-colaborador — audiência 22/05',
          detail: 'Ação trabalhista movida por ex-colaborador demitido em outubro/2025 (alegação de horas extras não pagas). Audiência de conciliação marcada para 22/05 na Vara do Trabalho. Advogado trabalhista contratado. Proposta de acordo pré-audiência em análise (R$3.200).',
          badge: { label: 'Audiência 22/05', type: 'warn' },
        },
      ],
    },
  ],
  administrativo: [],
  comercial: [],
  compras: [],
  ti: [],
  atendimento: [],
};
