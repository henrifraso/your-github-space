import type { CompanySectorFeeds } from '../../types';

export const NUBANK_SECTOR_FEEDS: CompanySectorFeeds = {
  marketing: [
    {
      sectionTitle: 'Percepção & Recall',
      cards: [
        {
          color: '#ec4899',
          tag: 'BOCA A BOCA',
          title: 'O canal de aquisição com melhor ROI no varejo farmacêutico não é o Google nem o iFood — é a indicação de quem já foi atendido na loja',
          detail: 'Indicação espontânea responde por 38% das primeiras visitas a farmácias de bairro no RJ. NPS 70+ = CAC 41% menor do que depender de mídia paga. O cliente satisfeito hoje é o anúncio de amanhã. Fonte: pesquisa de comportamento do consumidor / Abrafarma 2025.',
          badge: { label: 'CAC 41% menor', type: 'ok' },
        },
        {
          color: '#ec4899',
          tag: 'RECALL SECUNDÁRIO',
          title: '81% dos cariocas não conseguem nomear a segunda farmácia do bairro — a disputa de marca mais valiosa do setor está acontecendo numa posição que ninguém mede',
          detail: '71% dos cariocas lembram só 1 farmácia por bairro; 19% lembram a segunda. Lojas que comunicam especialidade (dermo, crônico) sobem 34% no recall secundário. O ponto de decisão acontece na memória, não no corredor. Fonte: pesquisa de percepção do consumidor / Abrafarma 2025.',
          badge: { label: '19% recall 2ª', type: 'info' },
        },
        {
          color: '#ec4899',
          tag: 'FREQUÊNCIA DE MARCA',
          title: 'Consumidores de farmácia pensam na marca com que compraram em média 8 horas depois da compra — mas a maioria das farmácias nunca faz contato nessa janela',
          detail: 'A janela de 6–12h pós-compra é o momento de maior recall espontâneo de marca no varejo farmacêutico. Uma mensagem de agradecimento nesse período eleva o NPS em 11 pontos e a taxa de retorno em 30 dias em 28%. Custo: R$ 0,08 por cliente. Fonte: pesquisa de experiência pós-compra / Abrafarma CRM 2025.',
          badge: { label: '+28% retorno 30d', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Reputação Digital',
      cards: [
        {
          color: '#ec4899',
          tag: 'REPUTAÇÃO GOOGLE',
          title: 'Uma avaliação 1 estrela sem resposta no Google Maps reduz visitas em até 9% no mês seguinte — e o tempo médio para detectar é 47 dias',
          detail: '1 estrela perdida no Maps retira até 9% de visitas no raio de 1 km. Tempo médio para detectar queda de nota sem monitoramento: 47 dias. Resposta pública recupera 33% dos leitores. Fonte: análise de presença digital local / Abrafarma Digital 2025.',
          badge: { label: '-9% visitas', type: 'warn' },
        },
        {
          color: '#ec4899',
          tag: 'RECLAMAÇÃO OCULTA',
          title: '62% dos clientes insatisfeitos com farmácias reclamam nas redes sem nunca ter falado com a loja — o problema que a gestão não vê já chegou ao público',
          detail: '62% dos clientes insatisfeitos publicam reclamação online sem nunca falar com a loja. Monitoramento ativo de redes detecta crise 34 dias antes do NPS interno acusar queda. O cliente silencioso é o mais perigoso. Fonte: pesquisa de comportamento pós-compra / Abrafarma 2025.',
          badge: { label: '62% silenciosos', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Canais & Conteúdo',
      cards: [
        {
          color: '#ec4899',
          tag: 'NANO INFLUÊNCIA',
          title: 'Nano influenciadores de saúde com 10k–50k seguidores convertem em visita à loja 3x mais que perfis com 1 milhão — e quase nenhuma farmácia ativou esse canal',
          detail: 'Nano e micro influenciadores de saúde têm engajamento 4x superior e conversão em visita 3x maior que perfis com 1M+. Custo médio: R$ 800–2.400/post. Canal com menor saturação de farmácias hoje. Fonte: Abrafarma Influência Digital 2026.',
          badge: { label: 'Conv. 3x maior', type: 'ok' },
        },
        {
          color: '#ec4899',
          tag: 'CONTEÚDO CONCORRENTE',
          title: 'O Onofre acumulou 2,1 mi de visualizações em 90 dias com série educativa no YouTube — nenhuma rede farmacêutica regional lançou canal próprio ainda',
          detail: 'Onofre: 2,1 mi de views em 90 dias com série de saúde preventiva, CPM zero. Farmácias com canal de conteúdo têm awareness 28% maior entre 25–40 anos. A mídia mais barata do setor já está sendo feita. Fonte: análise de presença digital / Abrafarma 2026.',
          badge: { label: '2,1mi views', type: 'warn' },
        },
        {
          color: '#ec4899',
          tag: 'REVIEW EM VÍDEO',
          title: 'Vídeos de clientes reais avaliando produtos de farmácia têm taxa de conversão 4,7x maior que fotos da embalagem — e qualquer balconista pode gravar com o celular',
          detail: 'Conteúdo de review em vídeo converte 4,7x mais do que imagem estática de produto no varejo farmacêutico. Custo de produção: zero com smartphone. Farmácias com 3+ vídeos no perfil do Google têm 38% mais cliques. Fonte: Abrafarma Influência Digital 2026.',
          badge: { label: 'Conv. 4,7x vídeo', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Mix & Comunicação',
      cards: [
        {
          color: '#ec4899',
          tag: 'MIX DE MÍDIA',
          title: 'Farmácias alocam 68% do budget em TV e OOH — o canal que mais converte cliente novo em recorrente é o WhatsApp da própria loja, sem custo de mídia',
          detail: 'WhatsApp ativo na loja converte 54% dos clientes novos em segunda compra em 30 dias vs 19% sem contato pós-venda. TV e OOH têm alto impacto de aquisição e baixo índice de retenção. O canal mais barato é o que já existe. Fonte: Abrafarma Commerce Digital 2025.',
          badge: { label: '54% recorrência WA', type: 'ok' },
        },
        {
          color: '#ec4899',
          tag: 'JANELA INVERNO',
          title: 'Campanhas de saúde preventiva que chegam antes do pico de gripe capturam 31% mais clientes novos — a janela dura 3 semanas e a primeira já passou',
          detail: 'Campanhas antes do pico de inverno capturam 31% mais clientes novos; as que chegam após o pico têm conversão 58% menor. A janela de atenção dura 3 semanas — e já está na 1ª. Fonte: relatório sazonal de varejo farmacêutico / Abrafarma 2025.',
          badge: { label: 'Janela: 2 semanas', type: 'warn' },
        },
        {
          color: '#ec4899',
          tag: 'TOM DE CAMPANHA',
          title: 'Campanhas com tom educativo têm CTR 2,8x maior que as promocionais — e 74% das campanhas de farmácia do setor ainda são promoções de preço',
          detail: 'Consumidor de saúde engaja 2,8x mais com conteúdo educativo do que com desconto em categorias farmacêuticas. Farmácias que trocaram 1 campanha promocional por conteúdo educativo mantiveram volume e subiram NPS 6 pontos. Fonte: Abrafarma Comunicação 2026.',
          badge: { label: 'CTR 2,8x educativo', type: 'info' },
        },
        {
          color: '#ec4899',
          tag: 'AWARENESS VS ATIVAÇÃO',
          title: '92% dos moradores do bairro já conhecem a farmácia mais próxima — o problema de crescimento não é awareness, é fazer quem já conhece escolher a sua loja',
          detail: '92% dos moradores num raio de 500m já sabem que a farmácia existe. Investir em alcance de novos públicos tem ROI 3,8x menor do que ativar quem já conhece mas compra no concorrente. O problema não é visibilidade — é preferência. Fonte: pesquisa de comportamento local / Abrafarma 2025.',
          badge: { label: 'ROI 3,8x ativação', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Riscos de Comunicação',
      cards: [
        {
          color: '#ec4899',
          tag: 'INCONSISTÊNCIA OMNI',
          title: 'Consumidor que vê uma oferta no app e não encontra o produto na loja tem 3,1x mais chance de não voltar do que se nunca tivesse recebido a oferta',
          detail: 'Divergência entre oferta digital e disponibilidade na loja gera churn 3,1x maior do que não ter feito a comunicação. O consumidor traído não volta — e não avisa por quê. Consistência omnicanal retém mais do que qualquer desconto. Fonte: pesquisa de jornada do consumidor / Abrafarma 2025.',
          badge: { label: 'Churn 3,1x', type: 'warn' },
        },
        {
          color: '#ec4899',
          tag: 'ÂNCORA DE DESCONTO',
          title: 'Farmácias que repetem a mesma promoção por 3 meses consecutivos treinam o cliente a esperar — e o preço cheio para de ser percebido como justo',
          detail: 'Promoção repetida por 3+ meses cria âncora: 67% dos clientes passam a considerar o desconto como preço real. Reverter leva 5–7 meses — e o volume cai 18% nesse período. O desconto que parece seguro é uma armadilha de margem. Fonte: pesquisa de percepção de preço / Abrafarma Pricing 2025.',
          badge: { label: 'Armadilha 3+ meses', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Segmentos & Canais',
      cards: [
        {
          color: '#ec4899',
          tag: 'SMS CRÔNICOS',
          title: 'Pacientes crônicos acima de 55 anos têm taxa de abertura de SMS de 94% vs 28% do e-mail — e são o segmento de maior LTV da farmácia',
          detail: 'SMS para público 55+ tem abertura 94% e conversão em visita 31% — vs 28% e 8% do e-mail no mesmo segmento. Custo por envio: R$ 0,08. LTV médio do crônico 55+: R$ 4.200/ano. Canal subutilizado no setor. Fonte: Abrafarma CRM Report 2025.',
          badge: { label: '94% abertura SMS', type: 'ok' },
        },
        {
          color: '#ec4899',
          tag: 'HORÁRIO DE CONVERSÃO',
          title: 'Buscas por farmácia entre 15h e 18h têm conversão em visita 2,9x maior — são pós-consulta médica com receita na mão, e nenhuma campanha local está calibrada pra esse horário',
          detail: '15h–18h: janela de pós-consulta com conversão em visita 2,9x maior — cliente com receita na mão, intenção imediata. CPA 47% menor em campanhas calibradas pra esse horário. Nenhuma rede do RJ segmenta por essa janela. Fonte: análise de busca local / Abrafarma Digital 2025.',
          badge: { label: 'CPA 47% menor', type: 'ok' },
        },
        {
          color: '#ec4899',
          tag: 'PÚBLICO MASCULINO',
          title: 'Homens representam 41% das compras em farmácia mas só 12% do público-alvo de campanhas do setor — a maioria das mensagens de marketing ignora quase metade dos compradores',
          detail: 'Homens respondem por 41% do volume de compras em farmácias do RJ — mas campanhas do setor direcionam 88% do criativo para mulheres. Mensagens neutras ou voltadas ao masculino têm CTR 34% maior entre esse público e CAC 28% menor. Fonte: pesquisa de perfil de consumidor / Abrafarma 2025.',
          badge: { label: '41% ignorados', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Movimentos de Mercado',
      cards: [
        {
          color: '#ec4899',
          tag: 'CONCORRENTE PLANO',
          title: 'A RD Saúde fechou acordo de farmácia preferencial com o Bradesco Saúde no RJ — credenciados passam a ter coparticipação zero em medicamentos na rede',
          detail: 'Farmácia preferencial de plano captura fluxo passivo: o beneficiário vai por necessidade financeira, não por escolha. RD+Bradesco: 280 mil elegíveis no RJ em cobertura estimada. Volume movido por esse acordo é silencioso e difícil de reverter. Fonte: ANS / Abrafarma Credenciamento 2026.',
          badge: { label: '280k elegíveis RD', type: 'warn' },
        },
        {
          color: '#ec4899',
          tag: 'REAJUSTE E COMUNICAÇÃO',
          title: 'O reajuste CMED de 5,8% em julho é uma janela de 3 semanas para posicionar a marca como transparente — depois disso a narrativa pertence às reclamações',
          detail: 'Farmácias que comunicaram o reajuste antes de 1º/jul via WhatsApp tiveram 34% menos reclamações e NPS 7 pontos superior. 63% dos consumidores aceitam reajuste com naturalidade quando informados antes. A narrativa está disponível por mais 3 semanas. Fonte: CMED/ANVISA / Abrafarma jun/26.',
          badge: { label: 'Prazo: 3 semanas', type: 'warn' },
        },
        {
          color: '#ec4899',
          tag: 'BRAND APP CONCORRENTE',
          title: 'O app da RD Saúde passou a exibir conteúdo de saúde personalizado antes de mostrar promoções — e o tempo de sessão subiu 3,1x enquanto o da Pacheco caiu 18%',
          detail: 'RD Saúde reformulou o app priorizando conteúdo educativo sobre ofertas. Tempo médio de sessão: 4,2 min vs 1,4 min da versão anterior. Engajamento alto no app antecede aumento de frequência de compra em 6–8 semanas. Fonte: análise de presença digital / Abrafarma Digital 2026.',
          badge: { label: 'Sessão 3,1x RD', type: 'warn' },
        },
      ],
    },
  ],

  vendas: [
    {
      sectionTitle: 'Novos Clientes & Ativação',
      cards: [
        {
          color: '#10b981',
          tag: 'GMV',
          title: 'GMV mai/26: R$ 1,42 bi — +14% vs mai/25',
          detail: 'Mês fechado em alta acima da projeção do setor (+10,6%). Categoria dermocosmético puxou ticket. Top 10 lojas no RJ tiveram crescimento +21% YoY. Sell-through de campanhas Dia das Mães: 87%.',
          badge: { label: '+14% YoY', type: 'ok' },
        },
        {
          color: '#10b981',
          tag: 'TICKET',
          title: 'Ticket médio mai/26: R$ 62 — alta de R$ 4 vs mai/25',
          detail: 'Mix de conveniência e dermocosmético eleva ticket. Lojas com programa Bem-Estar Premium: R$ 84 (vs R$ 62 média). Crônicos com assinatura têm ticket R$ 98 e frequência mensal.',
          badge: { label: '+R$4 ticket', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Categorias em Foco',
      cards: [
        {
          color: '#10b981',
          tag: 'DERMOCOSMÉTICO',
          title: 'Dermocosmético: +22% YoY — categoria mais lucrativa',
          detail: 'Receita dermocosmético cresce 22% em 12 meses. Margem bruta 42% (vs 26% medicamento). Marcas líderes: La Roche, Vichy, Eucerin. Pacheco testa corner dermo nas 200 maiores lojas com presença de dermo consultoras.',
          badge: { label: 'Margem 42%', type: 'ok' },
        },
        {
          color: '#10b981',
          tag: 'CRÔNICOS',
          title: 'Crônicos assinatura: 280 mil pacientes ativos',
          detail: 'Programa de recompra automática de medicamentos crônicos atinge 280 mil pacientes. Renovação mensal: 94%. Recomendação: integrar Bem-Estar + Caixinha de Crônicos pra elevar adesão pra 500 mil até dez/26.',
          badge: { label: '94% renov', type: 'ok' },
        },
        {
          color: '#10b981',
          tag: 'CONVENIÊNCIA',
          title: 'Conveniência (hortifrúti+higiene) cresce 19% YoY',
          detail: 'Categoria adicionada em 2024 segue crescendo. Lojas com mix expandido têm ticket R$ 18 maior. Foco H2 26: expandir absorventes/íntimo (segmento liderado pela DPSP).',
          badge: { label: '+19% YoY', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Metas Q2 2026',
      cards: [
        {
          color: '#10b981',
          tag: 'META',
          title: 'Meta Q2 2026: R$ 4,8 bi — pace 93%',
          detail: 'Acumulado até semana 4 de Q2: R$ 1,87 bi. Alavancas: Inverno (gripe/imunidade), Dia dos Namorados, reposição pós-CMED. Risco: ANVISA estuda novas regras de adesão a programas em pacientes crônicos.',
          badge: { label: '93% pace', type: 'info' },
        },
        {
          color: '#10b981',
          tag: 'BUNDLING',
          title: 'Bundle "Anti-Gripe Inverno" eleva ticket 28%',
          detail: 'Combo Anti-Gripe (vitamina C + analgésico + spray nasal) testado em 80 lojas RJ. Aceitação 38% no checkout. Margem 51% (vs 32% itens solo). Ação: ampliar pra 1.600 lojas até 10/jun.',
          badge: { label: '+28% ticket', type: 'ok' },
        },
      ],
    },
  ],

  financeiro: [
    {
      sectionTitle: 'Margens & Mix',
      cards: [
        {
          color: '#f59e0b',
          tag: 'MARGEM',
          title: 'Margem bruta consolidada 28% — Ever puxa pra cima',
          detail: 'Marcas próprias Ever rendem 18 p.p. de margem extra vs medicamento comercial. Ever respondeu por 14% do mix e 24% da margem em mai/26. Meta 2026: ampliar Ever pra 20% do mix.',
          badge: { label: '+18pp Ever', type: 'ok' },
        },
        {
          color: '#f59e0b',
          tag: 'CMED',
          title: 'CMED autoriza reajuste de 5,8% — impacto positivo na margem',
          detail: 'Câmara de Regulação aprovou teto de reajuste anual de 5,8% em medicamentos. Compensa 1,2 p.p. na margem bruta do 2T26. Comunicação à indústria já enviada. Repasse em ondas a partir de 01/jul.',
          badge: { label: '+1,2pp margem', type: 'ok' },
        },
        {
          color: '#f59e0b',
          tag: 'CARTÃO/PIX',
          title: 'PIX = 38% do tíquete em loja física',
          detail: 'PIX cresceu 8 p.p. em 12 meses no mix de pagamentos. Margem PIX é melhor: zero taxa de antecipação. Campanha "Compra com PIX, ganha R$ 10 de cashback" rodando em SP em jun/26.',
          badge: { label: '38% PIX', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Resultado Grupo DPSP',
      cards: [
        {
          color: '#f59e0b',
          tag: 'EBITDA',
          title: 'EBITDA 1T26: R$ 412 mi — +18% YoY',
          detail: 'Sinergia operacional Pacheco+DSP rende R$ 32 mi/ano em overhead reduzido. CD compartilhado (7 ao todo) corta frete em 14%. Margem operacional 9,1% (vs 8,2% no 1T25).',
          badge: { label: '+18% YoY', type: 'ok' },
        },
        {
          color: '#f59e0b',
          tag: 'CAPEX',
          title: 'CAPEX expansão: R$ 1,2 bi pra 400 lojas até 2028',
          detail: 'Plano de expansão aprovado prevê 400 novas lojas, com CAPEX médio de R$ 3 mi/loja. Foco: Grande SP (180), interior SP (110), MG/ES (70), Nordeste novo (40). ROI projetado: 22 meses por loja.',
          badge: { label: 'R$ 1,2 bi', type: 'info' },
        },
      ],
    },
  ],

  rh: [
    {
      sectionTitle: 'Equipe Grupo DPSP',
      cards: [
        {
          color: '#8b5cf6',
          tag: 'HEADCOUNT',
          title: '29.600 colaboradores no grupo — 12.000 só na Pacheco',
          detail: 'Grupo DPSP atinge 29.600 colaboradores. Pacheco isolada tem 12.000. Turnover varejo farma: 32%/ano. Custo de substituição R$ 5.800/colaborador. Programa "Carreira Pacheco" cria trilha de balconista a gerente em 24 meses.',
          badge: { label: 'Turnover 32%', type: 'warn' },
        },
        {
          color: '#8b5cf6',
          tag: 'CONTRATAÇÃO',
          title: '420 vagas abertas para expansão Q2 26',
          detail: 'Prioridade: 180 atendentes RJ/SP, 120 farmacêuticos, 80 gerentes de loja, 40 backoffice. Tempo médio de hiring: 24 dias (meta 18). Parceria com CRF-RJ pra acelerar credenciamento de farmacêuticos.',
          badge: { label: '420 vagas', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Cultura & Desenvolvimento',
      cards: [
        {
          color: '#8b5cf6',
          tag: 'CULTURA',
          title: 'Pesquisa de clima 2026: eNPS 64 — alta de 6pts vs 2025',
          detail: 'Programa "Você é Pacheco" elevou engajamento. Principais ganhos: clareza de carreira (78%) e orgulho de marca (89%). Gap: salário (54%). Ação: revisão de remuneração variável atrelada a NPS de loja em jul/26.',
          badge: { label: 'eNPS 64', type: 'ok' },
        },
        {
          color: '#8b5cf6',
          tag: 'ACADEMY',
          title: 'Pacheco Academy: 6.200 horas de treinamento em Q1 2026',
          detail: 'Foco em atendimento humanizado + storytelling Ever. 91% de conclusão do módulo "Cuide do Seu Cliente". Certificação obrigatória pra promoção a balconista sênior desde jan/26. Próximo módulo: "Vendas Dermo".',
          badge: { label: '91% conclusão', type: 'ok' },
        },
        {
          color: '#8b5cf6',
          tag: 'D&I',
          title: 'Mulheres em liderança: 47% — meta 55% até 2028',
          detail: 'Pacheco está acima da média do setor varejo farma (38%). Mentoria estruturada com 80 mulheres em pipeline. Foco H2 26: ampliar acesso a cargo de gerência regional. Bandeira DSP tem 52% de gerentes mulheres.',
          badge: { label: '47% liderança', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Atendimento Farmacêutico',
      cards: [
        {
          color: '#8b5cf6',
          tag: 'CRF',
          title: '4.800 farmacêuticos ativos — TMA de 4 min no balcão',
          detail: 'Time farmacêutico totalmente credenciado pelo CRF. TMA balcão 4 min (benchmark setor 7). Ferramenta de IA "Pacheco AI" sugere medicamentos similares e interações — reduziu erro de orientação em 38%.',
          badge: { label: 'TMA 4min', type: 'ok' },
        },
      ],
    },
  ],

  operacoes: [
    {
      sectionTitle: 'Rede de 1.600 Lojas',
      cards: [
        {
          color: '#06b6d4',
          tag: 'FLAGSHIP RJ',
          title: 'Loja Pacheco Av. Marechal Floriano: 8.200 visitas/dia',
          detail: 'Loja histórica no Centro do Rio (Rua dos Andradas/Av. Marechal Floriano) — maior em movimento da rede. Faturamento R$ 3,8 mi/mês. Mix completo: medicamento, dermo, conveniência, manipulação.',
          badge: { label: 'Top 1 RJ', type: 'ok' },
        },
        {
          color: '#06b6d4',
          tag: 'EXPANSÃO',
          title: 'Plano 2026: abrir 150 lojas (95 Grande SP + 35 interior + 20 NE)',
          detail: 'CAPEX médio R$ 3 mi/loja. Parte do plano 400 lojas até 2028. Foco: shoppings premium + ruas de alto fluxo. Estratégia "encostar na RD Saúde em SP" segundo Neofeed.',
          badge: { label: '+150 lojas', type: 'info' },
        },
        {
          color: '#06b6d4',
          tag: 'VISUAL MERCH',
          title: 'Replano-grama Inverno 26 finalizado em 94% das lojas',
          detail: 'Replano focado em vitamina C, anti-gripal e dermocosmético de inverno. 6% restantes em RS pós-chuvas. Kit unificado garantiu consistência visual. Próximo: Black Friday novembro.',
          badge: { label: '1.504/1.600', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Logística & Same-day',
      cards: [
        {
          color: '#06b6d4',
          tag: 'CDS',
          title: '7 centros de distribuição ativos — RJ, SP, MG, PE, BA',
          detail: 'Sete CDs operam pra 1.600 lojas. CD principal RJ (Rod. Pres. Dutra, 56.000 m²) processa 280 mil itens/dia. CDs Recife e Salvador suportam expansão NE. Investimento de R$ 180 mi em modernização 2025-26.',
          badge: { label: '7 CDs', type: 'info' },
        },
        {
          color: '#06b6d4',
          tag: 'SAME-DAY',
          title: 'Same-day delivery Loggi: 90% de cobertura no RJ',
          detail: 'Parceria com Loggi entrega em 2h em casos urgentes. NPS digital: 76. Vendas digitais 12% do total. Expansão pra Grande SP em jul/26 e BH em set/26. Meta cobertura SP: 50% em dez/26.',
          badge: { label: '90% RJ', type: 'ok' },
        },
      ],
    },
  ],

  estoque: [
    {
      sectionTitle: 'Mix de Medicamentos',
      cards: [
        {
          color: '#84cc16',
          tag: 'GIRO',
          title: 'Giro de estoque crônicos: 28 dias — ideal pra programa de assinatura',
          detail: 'Categoria crônicos tem giro 4x mais rápido que medicamento comum. Programa de assinatura "Crônicos Fácil" eleva previsibilidade de demanda em 87%. Recomendação: ampliar programa de 280 pra 500 mil pacientes em H2 26.',
          badge: { label: '28 dias giro', type: 'ok' },
        },
        {
          color: '#84cc16',
          tag: 'RUPTURA',
          title: 'Ruptura semanal: 1,4% — meta 1,2%',
          detail: 'Ruptura concentrada em medicamentos hospitalares (3,8%) e raros (8,1%). Sistema de previsão Vtex+SAP reduziu ruptura geral em 0,6 p.p. em 6 meses. Ação: integrar previsão com dados de gripe sazonal pra Inverno 26.',
          badge: { label: '1,4% ruptura', type: 'warn' },
        },
        {
          color: '#84cc16',
          tag: 'DEAD STOCK',
          title: 'Dead stock dermatológico Verão 25: R$ 4,2 mi em RJ/SP',
          detail: 'Protetores solares e protetores capilares Verão 25 encalhados nas lojas RJ. Custo de oportunidade R$ 4,2 mi. Outlet ativo com -40% até jun/26. Recomendação: revisar planejamento de SKUs sazonais.',
          badge: { label: 'R$ 4,2 mi', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Marcas Próprias Ever',
      cards: [
        {
          color: '#84cc16',
          tag: 'EVER',
          title: 'Ever: 800 SKUs ativos — 100 novos lançamentos em 2025-26',
          detail: 'Linhas Ever Baby, Ever Care, Ever You, Ever Nutri respondem por 14% do faturamento e 24% da margem. 100 novos SKUs previstos pra H2 26 (suplementos + dermo). Margem 18 p.p. acima das marcas comerciais.',
          badge: { label: '800 SKUs', type: 'ok' },
        },
        {
          color: '#84cc16',
          tag: 'FORNECIMENTO',
          title: 'EMS (28%) + Eurofarma + Hypera = 58% do volume',
          detail: 'Top 3 fornecedores externos = 58% do volume total. EMS puxa volume de genéricos populares (28%). Risco: dependência alta em EMS, mas margens superiores em marcas próprias compensam o risco de barganha.',
          badge: { label: '58% top 3', type: 'info' },
        },
      ],
    },
  ],

  juridico: [
    {
      sectionTitle: 'ANVISA & Compliance',
      cards: [
        {
          color: '#f97316',
          tag: 'ANVISA',
          title: 'RDC 44/2009 e renovação de licenças: 1.600 lojas em compliance',
          detail: 'Todas as 1.600 lojas com Autorização de Funcionamento (AFE) renovada. Auditoria ANVISA Q1 26 sem ressalvas. Compliance farmacêutico responsável (RT) garantido em todas as unidades.',
          badge: { label: '100% AFE', type: 'ok' },
        },
        {
          color: '#f97316',
          tag: 'CMED',
          title: 'CMED reajuste 5,8%: comunicação pra 32 fornecedores',
          detail: 'Comunicação formal enviada a 32 fornecedores principais sobre reajuste autorizado. Cronograma de repasse em ondas — crônicos primeiro (01/jul), depois OTC e MIPs. Compliance fiscal validado pelo PwC.',
          badge: { label: 'OK', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Marcas Próprias & IP',
      cards: [
        {
          color: '#f97316',
          tag: 'IP',
          title: 'Registros Ever: 800 SKUs com proteção marcária no INPI',
          detail: 'Todas as 4 linhas Ever (Baby, Care, You, Nutri) com marca registrada. 12 oposições por terceiros — defesa em andamento via escritório Pinheiro Neto. Renovação programada pra 2027-2028.',
          badge: { label: '12 oposições', type: 'warn' },
        },
        {
          color: '#f97316',
          tag: 'CONTRATOS',
          title: 'Renovação contratos fornecedores estratégicos em 1T/2T 26',
          detail: 'EMS, Eurofarma e Hypera em renegociação. Cláusulas em revisão: ANS sazonalidade, escala de descontos, exclusividade em marcas próprias. Time jurídico do grupo DPSP centralizou todos os contratos pós-fusão.',
          badge: { label: 'Em curso', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'LGPD & Consumidor',
      cards: [
        {
          color: '#f97316',
          tag: 'LGPD',
          title: 'DPO ativo + ANPD: 0 incidentes em 18 meses',
          detail: 'Adequação LGPD completa em app + site + 1.600 lojas. Auditoria PwC anual sem ressalvas. Sistema de consentimento integrado ao Bem-Estar pra ofertas personalizadas com base legal sólida.',
          badge: { label: 'OK ANPD', type: 'ok' },
        },
        {
          color: '#f97316',
          tag: 'PROCON',
          title: 'Reclamações Procon RJ: -28% em 12 meses pós-treinamento',
          detail: 'Programa "Atende com Empatia" reduziu reclamações em RJ. Acervo Procon-RJ: 87 (vs 121). Recomendação: replicar treinamento em SP onde acervo é 142.',
          badge: { label: '-28% RJ', type: 'ok' },
        },
      ],
    },
  ],
  administrativo: [],
  comercial: [
    {
      sectionTitle: 'Posicionamento & Concorrência',
      cards: [
        {
          color: '#0ea5e9',
          tag: 'MAPA COMERCIAL',
          title: 'Existe um vácuo de posicionamento em "dermocosmético" num raio de 800 m de várias lojas Pacheco — e o cliente está buscando agora',
          detail: '2.400 buscas/mês por "farmácia com dermo" num raio de 1 km em bairros B/C do RJ — e quase nenhuma loja aparece. Ficha Google com tag de especialidade gera 34% mais cliques no Maps. A primeira que posicionar captura esse fluxo por padrão; custo de ocupar o vácuo: zero. Fonte: Google Business Insights / Abrafarma Digital 2025.',
          badge: { label: 'Vácuo aberto', type: 'info' },
        },
        {
          color: '#0ea5e9',
          tag: 'CONCORRENTE RD',
          title: 'A RD Saúde prevê mais 47 lojas no RJ até dezembro — cada abertura cria um raio de captura de 1,5 km que absorve clientes fidelizados pela proximidade',
          detail: 'Nova farmácia de rede no raio de 700 m reduz faturamento vizinho em até 19% nos 90 dias seguintes — e 43% dos clientes que migram não voltam. A RD planeja mais 47 lojas no RJ até dezembro, além das 12 abertas em 2026. Cada unidade age como recrutador silencioso no raio de 1,5 km. Fonte: monitor de varejo farmacêutico / Neofeed jun/26.',
          badge: { label: '+47 lojas RD no RJ', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Canais & Captação',
      cards: [
        {
          color: '#0ea5e9',
          tag: 'B2B CONVÊNIO',
          title: 'Planos de saúde que reembolsam medicamentos são uma carteira B2B de volume constante que a maioria das lojas Pacheco ainda não prospecta ativamente',
          detail: 'Bradesco, SulAmérica e Amil reembolsam R$ 380/mês por beneficiário credenciado. No raio de 2 km de uma loja em zona comercial do RJ há 8.000 a 14.000 elegíveis — receita previsível sem promoção ou desconto. Taxa de conversão após credenciamento ativo: 11–17%. Cada empresa do bairro com plano é uma carteira cativa ainda não ativada. Fonte: ANS / dados de credenciamento 2025.',
          badge: { label: 'R$ 380/mês por beneficiário', type: 'ok' },
        },
        {
          color: '#0ea5e9',
          tag: 'BUSCAS NOTURNAS',
          title: '4 em cada 10 buscas por farmácia no RJ acontecem depois das 20h — e a maioria das fichas Google das lojas não está otimizada para esse horário',
          detail: '41% das buscas por farmácia no RJ ocorrem entre 19h e 23h — mas a maioria das fichas Google não tem horário confirmado nem foto atualizada. Quem aparece nessa janela com perfil completo tem 2,7x mais conversão de mapa para visita. O cliente que vai de noite volta de manhã. Custo de ajustar: zero. Fonte: Google Business Insights / Abrafarma Digital 2025.',
          badge: { label: '41% das buscas à noite', type: 'info' },
        },
        {
          color: '#0ea5e9',
          tag: 'iFOOD FARMA',
          title: 'O Venancio subsidiou frete grátis no iFood Farma e saltou da posição #7 para #3 no RJ em 60 dias — a Pacheco ainda aparece abaixo no app',
          detail: 'O Venancio saltou da posição #7 para #3 no iFood Farma RJ em 60 dias subsidiando frete a R$ 4/entrega — cada posição ganha vale +7% de volume. 29% dos clientes via app repetem em 30 dias, criando hábito fora da loja física. No delivery, posição é visibilidade; visibilidade é pedido. Fonte: iFood Seller Center / análise de posicionamento jun/26.',
          badge: { label: 'Concorrente: #3 no app', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Retenção & Margem',
      cards: [
        {
          color: '#0ea5e9',
          tag: 'RUPTURA VS PREÇO',
          title: 'Todo mundo acha que farmácia perde cliente por preço — os dados mostram que ruptura de produto é o motivo real em 3 de cada 5 trocas',
          detail: '68% dos consumidores trocam de farmácia por ruptura de produto — só 22% citam preço. Lojas com ruptura abaixo de 1,2% têm NPS 18 pontos acima da média e retenção 31% superior. Disponibilidade retém mais do que desconto. Fonte: análise de comportamento de compra do setor / relatório de saúde do varejo 2025.',
          badge: { label: 'Dado contra-intuitivo', type: 'info' },
        },
        {
          color: '#0ea5e9',
          tag: 'FIDELIDADE',
          title: 'O cliente Bem-Estar que não voltou nos últimos 60 dias tem 67% de chance de já estar comprando no concorrente — e a janela de reativação está fechando',
          detail: 'Após 90 dias sem compra, a taxa de recuperação de cliente cai para menos de 12%. 67% dos que ficam 60+ dias inativos no Bem-Estar já migraram para o concorrente. Reativar via WhatsApp custa R$ 0,08 — vs R$ 24 de CAC de cliente novo. Fonte: Salesforce / Braze Benchmark Pharma 2025.',
          badge: { label: 'Reativar até 90 dias', type: 'warn' },
        },
        {
          color: '#0ea5e9',
          tag: 'SUPLEMENTOS',
          title: 'Suplementos têm margem bruta de até 44% — quase o dobro do genérico — e a maioria das lojas ainda precifica por tabela sem estratégia',
          detail: 'Suplementos: margem de 38–44% vs 22–28% do OTC, cresceram 31% YoY no RJ. Farmácias que precificaram 5–8% acima da tabela base em premium não perderam volume — o cliente tem renda superior e menor sensibilidade a preço. A margem está disponível; falta a estratégia. Fonte: painel de OTC do varejo farmacêutico 2025.',
          badge: { label: 'Margem até 44%', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Sazonalidade & Captação',
      cards: [
        {
          color: '#0ea5e9',
          tag: 'JANELA INVERNO',
          title: 'A janela de captação do cliente de saúde preventiva abre em 3 semanas — depois disso, quem posicionou fica, quem não posicionou perde pelo ano',
          detail: 'Anti-gripais e imunidade crescem 38% no varejo farmacêutico de jun–ago, com pico na 3ª semana de junho. Cliente de saúde preventiva tem 31% de chance de virar recorrente. Farmácias que antecipam com mix e comunicação capturam 22% mais novos clientes no pico. A janela é curta. Fonte: relatório sazonal de varejo farmacêutico / análise de mercado de consumo 2025.',
          badge: { label: 'Janela: 3 semanas', type: 'warn' },
        },
        {
          color: '#0ea5e9',
          tag: 'CLIENTE ROPO',
          title: 'Existe um perfil de cliente que pesquisa no app, decide na loja e tem ticket 40% maior — mas nenhum canal está capturando o CPF dele',
          detail: '54% dos compradores pesquisam online antes de ir à farmácia — mas a maioria não é cadastrada. Lojas com captura de CPF em 100% das compras têm LTV 2,8x maior em 12 meses. Recaptura via WhatsApp em 30 dias: 41%. Cada CPF perdido é uma venda sem retorno. Fonte: painel de comportamento do shopper / Salesforce Health Retail 2025.',
          badge: { label: 'LTV 2,8x com CPF', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Concorrência & Share de Carteira',
      cards: [
        {
          color: '#0ea5e9',
          tag: 'ASSINATURA CRÔNICO',
          title: 'O Onofre lançou assinatura mensal de medicamentos crônicos com frete grátis — e já tem 80 mil assinantes no RJ em 4 meses',
          detail: 'Onofre+iFood: 80 mil assinantes de crônico no RJ em 4 meses, cancelamento 6%/mês. Cada assinante é R$ 290/mês que sai da loja física — e o programa cresce 18%/mês. O hábito de visita que gera cross-sell vai junto. Fonte: iFood Health Partnerships / Abrafarma Digital 2026.',
          badge: { label: '80k assinantes RJ', type: 'warn' },
        },
        {
          color: '#0ea5e9',
          tag: 'SHARE DE CARTEIRA',
          title: '7 em cada 10 pacientes crônicos do RJ compram em mais de uma farmácia por mês — a Pacheco pode não ser a principal para todos eles',
          detail: '71% dos pacientes crônicos do RJ dividem o gasto entre 2+ farmácias por mês — ticket médio R$ 340. Quem oferece separação antecipada via WhatsApp concentra 68% do gasto desse perfil vs 41% das que não oferecem. Capturar 20% a mais dos existentes não exige cliente novo. Fonte: análise de comportamento de compra do setor / Abrafarma CRM 2025.',
          badge: { label: '71% dividem gasto', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Mix & Abordagem Comercial',
      cards: [
        {
          color: '#0ea5e9',
          tag: 'SKINCARE CONSULTIVO',
          title: 'Existe uma abordagem de balcão que triplica o ticket de quem entrou pedindo "só um creme para manchas"',
          detail: 'Ticket de skincare sobe de R$ 35 para R$ 110 quando o farmacêutico apresenta a rotina completa — sem argumento de preço, só educação. Retorno em 30 dias sobe 38%. Farmácias que treinaram 5 SKUs de rotina cresceram 26% na dermo em 60 dias. Fonte: painel de dermocosméticos do varejo / L\'Oréal Pharma Channel 2025.',
          badge: { label: 'Ticket 3x com rotina', type: 'ok' },
        },
        {
          color: '#0ea5e9',
          tag: 'CATÁLOGO DIGITAL',
          title: 'Clientes mandam mensagem no WhatsApp da loja perguntando preço — sem catálogo digital, a resposta demora e a venda vai para o app do concorrente',
          detail: 'Farmácias com catálogo ativo no WhatsApp convertem consulta em pedido a 52% vs 19% sem catálogo — e respondem 4x mais rápido. Média de 34 mensagens/dia em farmácias de bairro do RJ. Custo de ativação: zero. Fonte: Meta Business / Abrafarma Digital Commerce 2025.',
          badge: { label: 'Conversão 52% com catálogo', type: 'ok' },
        },
        {
          color: '#0ea5e9',
          tag: 'PROMOÇÃO DE SERVIÇO',
          title: 'Todo mundo faz promoção de desconto em farmácia — mas cliente que veio por preço vai embora pelo próximo desconto do concorrente',
          detail: 'Cliente que usa serviço gratuito (aferição, glicemia, orientação) tem LTV 3,1x maior em 12 meses e retorna em 30 dias a 71% vs 23% do cliente de desconto. Custo marginal: zero — o farmacêutico já está presente. Desconto compra uma visita; serviço compra o hábito. Fonte: Abrafarma / CFF 2025.',
          badge: { label: 'LTV 3x maior', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Parcerias & Movimentos de Mercado',
      cards: [
        {
          color: '#0ea5e9',
          tag: 'PRESCRITOR LOCAL',
          title: 'O médico clínico-geral que atende a 3 quadras da loja pode ser o canal de indicação mais barato que existe — mas ninguém foi até ele',
          detail: 'Farmácias com 3+ prescritores próximos ativos têm volume 24% superior em medicamentos tarjados e NPS 11 pontos acima da média. Conversão de paciente indicado por médico: 78% na primeira visita vs 34% orgânico. Custo da visita: zero. Fonte: Abrafarma / CFF Canal Prescritores 2025.',
          badge: { label: 'Conversão 78%', type: 'ok' },
        },
        {
          color: '#0ea5e9',
          tag: 'FARMÁCIA NO CARREFOUR',
          title: 'A Raia Drogasil abriu 8 unidades dentro de Carrefour no RJ — o cliente resolve tudo numa parada e para de ir até a farmácia de rua',
          detail: 'RD abriu 8 unidades no Carrefour RJ em 2026, meta de 23 até dez/26. Farmácias em supermercado capturam 31% das compras de OTC que antes iam para lojas de rua no raio de 800 m. O cliente não migra por escolha — migra por comodidade instalada. Fonte: Raia Drogasil RI / pesquisa de jornada de compra 2025.',
          badge: { label: '8 lojas Carrefour RJ', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Precificação & Programa',
      cards: [
        {
          color: '#0ea5e9',
          tag: 'REAJUSTE CMED',
          title: 'O reajuste CMED de 5,8% entra em 1º de julho — há 3 semanas para comunicar com transparência antes que o cliente perceba como oportunismo',
          detail: 'Farmácias que comunicaram o reajuste de 5,8% via WhatsApp antes de 1º/jul tiveram 34% menos reclamações e NPS 7 pontos superior. 63% dos consumidores aceitam com naturalidade quando informados antes — o cliente surpreendido reclama no Reclame Aqui. Prazo não espera. Fonte: CMED/ANVISA / Abrafarma jun/26.',
          badge: { label: 'Prazo: 1º de julho', type: 'warn' },
        },
        {
          color: '#0ea5e9',
          tag: 'BEM-ESTAR+',
          title: 'Membros Bem-Estar+ têm ticket de R$ 84 vs R$ 62 da base geral — o gap de R$ 22 por visita ainda não foi ativado na maioria dos elegíveis',
          detail: 'Conversão para Bem-Estar+ ainda em 11% da base elegível em SP. Membros+ têm frequência 2,4x maior e ticket 35% superior — 5% de migração adicional rende R$ 8.200/mês por loja sem cliente novo. A alavanca está na base ativa; falta a abordagem no balcão. Fonte: dados DPSP / Abrafarma Loyalty 2025.',
          badge: { label: '+R$22 por visita no +', type: 'ok' },
        },
        {
          color: '#0ea5e9',
          tag: 'KIT SAZONAL',
          title: 'Existe um bundle de inverno que eleva o ticket em 28% sem negociação de preço — e nenhum concorrente local montou o kit ainda',
          detail: 'Kit Anti-Gripe Inverno (vitamina C + analgésico + spray nasal): ticket 28% superior e margem combinada 51% vs 32% dos itens vendidos isoladamente. Adesão no checkout quando oferecido ativamente: 38%. O produto está na gôndola — falta o kit. Fonte: Abrafarma / análise de cesta de compras do varejo 2025.',
          badge: { label: '+28% ticket', type: 'ok' },
        },
      ],
    },
  ],
  compras: [],
  ti: [],
  atendimento: [],
};
