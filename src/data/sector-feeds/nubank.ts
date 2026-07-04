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
      sectionTitle: 'Decisão no PDV',
      cards: [
        {
          color: '#10b981',
          tag: 'DECISÃO NO PDV',
          title: '73% dos clientes de farmácia decidem a marca do medicamento no balcão — não antes de entrar na loja',
          detail: '73% das escolhas de marca em OTC ocorrem no ponto de venda, não em casa. O balconista que sugere ativamente uma alternativa equivalente influencia 68% das decisões. A venda começa quando o cliente abre a boca. Fonte: pesquisa de jornada de compra / Abrafarma 2025.',
          badge: { label: '73% decide no balcão', type: 'info' },
        },
        {
          color: '#10b981',
          tag: 'TEMPO DE ATENDIMENTO',
          title: 'Atendimentos de 3 a 5 minutos têm ticket 42% maior que os de menos de 1 minuto — o cliente que foi ouvido compra mais, e a fila não cresce',
          detail: 'Atendimentos de 3–5 min têm ticket 42% superior aos de menos de 1 min. Farmácias com TMA médio de 4 min mantêm NPS 18 pontos acima e fila estável. O tempo extra não é custo — é margem. Fonte: análise de eficiência de atendimento no varejo / Abrafarma 2026.',
          badge: { label: 'Ticket 42% maior', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Balcão & Conversão',
      cards: [
        {
          color: '#10b981',
          tag: 'VENDA INCOMPLETA',
          title: 'Balconista que não oferece o complemento no ato perde em média R$ 23 por atendimento — o cliente quase nunca volta para buscar o produto que não foi sugerido',
          detail: 'Farmácias com protocolo ativo de sugestão de complemento têm ticket 37% maior. Cliente que sai sem o complemento retorna para buscá-lo em apenas 9% dos casos. Fonte: análise de comportamento de compra no PDV / Abrafarma 2025.',
          badge: { label: 'R$23 perdido/atend.', type: 'warn' },
        },
        {
          color: '#10b981',
          tag: 'PERGUNTA ABERTA',
          title: 'Uma pergunta aberta no balcão ("para quem é o medicamento?") eleva o ticket em R$ 18 e abre pelo menos 1 item complementar em 44% dos casos',
          detail: '"Para quem é?" e "há quanto tempo?" são as perguntas que mais abrem vendas no varejo farmacêutico. Balconistas treinados em escuta ativa têm ticket 31% maior e NPS 14 pontos acima da média. Fonte: Abrafarma Treinamento de Vendas 2025.',
          badge: { label: '+R$18 com pergunta', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Movimentos de Mercado',
      cards: [
        {
          color: '#10b981',
          tag: 'TREINAMENTO CONCORRENTE',
          title: 'A Ultrafarma treinou 100% dos balconistas em rotina de skincare e dobrou a receita da categoria dermo em 8 meses — sem ampliar o espaço de gôndola',
          detail: 'Ultrafarma: protocolo de skincare consultivo no balcão elevou receita dermo 2x em 8 meses. Ticket médio da categoria passou de R$ 48 para R$ 94. Espaço de gôndola inalterado — só o protocolo de abordagem mudou. Fonte: análise de posicionamento de rede / Abrafarma Varejo 2026.',
          badge: { label: 'Dermo 2x em 8 meses', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Comportamento no PDV',
      cards: [
        {
          color: '#10b981',
          tag: 'OBJEÇÃO DE PREÇO',
          title: 'Quando o cliente diz "está caro" no balcão, em 71% dos casos está comparando com o preço que lembra da visita anterior — não com o concorrente',
          detail: '71% das objeções de preço no balcão são comparações com memória própria, não com o concorrente. Balconistas que explicam a variação (reajuste, embalagem) convertem 58% dessas objeções em venda. A objeção raramente é sobre preço real. Fonte: pesquisa de comportamento no PDV / Abrafarma 2025.',
          badge: { label: '71% vs memória própria', type: 'info' },
        },
        {
          color: '#10b981',
          tag: 'JANELA DE URGÊNCIA',
          title: 'Cliente com sintoma agudo decide a compra em até 4 minutos no PDV — depois desse tempo a percepção de urgência cai 40% e o ticket com ela',
          detail: 'Clientes com sintoma agudo (gripe, dor, febre) têm janela de decisão de 4 min no PDV. Abordagem nos primeiros 90 segundos eleva ticket em 34% e reduz abandono em 22%. Após 4 min, conversão de complementares cai 40%. Fonte: análise de comportamento de compra agudo / Abrafarma 2026.',
          badge: { label: 'Janela: 4 min', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Técnicas de Balcão',
      cards: [
        {
          color: '#10b981',
          tag: 'AMOSTRA NO PDV',
          title: 'Oferecer uma amostra no ato do atendimento converte em compra no mesmo dia em 41% dos casos — e o cliente que experimenta gasta 2,3x mais na visita seguinte',
          detail: 'Amostra entregue no balcão converte em compra imediata em 41% dos casos. Cliente que experimenta retorna em 30 dias a 68% e tem LTV 2,3x maior em 12 meses. O custo da amostra é absorvido pela margem da venda que ela gera. Fonte: Abrafarma PDV Report 2025.',
          badge: { label: 'Conv. 41% amostra', type: 'ok' },
        },
        {
          color: '#10b981',
          tag: 'TOQUE NO PRODUTO',
          title: 'Cliente que pega o produto na mão tem 78% de chance de levar — vs 31% de quem só olha na gôndola. O balconista que coloca o produto na mão dobra a conversão',
          detail: 'Taxa de conversão de quem toca o produto: 78% vs 31% de quem só visualiza. Balconistas treinados a colocar o produto na mão durante a demonstração dobram o fechamento em cuidado pessoal e suplementos. Fonte: análise de comportamento de compra no PDV / Abrafarma 2025.',
          badge: { label: '78% conversão ao tocar', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Riscos de Conversão',
      cards: [
        {
          color: '#10b981',
          tag: 'ABANDONO NA FILA',
          title: 'Fila de caixa acima de 4 minutos cancela 18% das intenções de compra por impulso — os produtos que o cliente já havia separado no balcão',
          detail: 'Cada minuto adicional de espera no caixa reduz em 4,5% a probabilidade de compra de impulso. Acima de 4 min: 18% dos itens são abandonados. Farmácias com checkout abaixo de 3 min têm ticket de impulso 26% maior. Fonte: análise de comportamento no PDV / Abrafarma 2026.',
          badge: { label: '18% abandono 4min+', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Movimentos & Oportunidades',
      cards: [
        {
          color: '#10b981',
          tag: 'MOVIMENTO CONCORRENTE',
          title: 'Raia e Drogasil adotaram SMS automático 48h antes do vencimento da receita — e estão capturando os reabastecimentos de crônicos que antes iam para farmácias de bairro',
          detail: 'Raia/Drogasil implantaram régua de SMS e push via app 48h antes do vencimento de receitas cadastradas. Taxa de reabastecimento no mesmo PDV subiu de 41% para 67% nos crônicos impactados. Farmácias sem esse gatilho perdem o reabastecimento recorrente sem saber por quê. Fonte: Abrafarma Benchmark de Fidelização 2026.',
          badge: { label: 'Reabastecimento +26pp', type: 'warn' },
        },
        {
          color: '#10b981',
          tag: 'POLIFARMÁCIA',
          title: 'Paciente com 3 ou mais medicamentos regulares compra em 2,4 pontos diferentes — oferecer "revisar a lista" no balcão centraliza tudo e rende R$ 180 a mais por mês',
          detail: 'Pacientes polimedicados fragmentam compras em 2,4 PDVs por hábito, não por preço. Farmácias que oferecem revisão da lista no balcão e entregam tudo de uma vez convertem 38% para compra única no ponto. Ticket mensal sobe R$ 180 e churn cai 3x. Fonte: análise de padrão de compra / Abrafarma Crônico 2025.',
          badge: { label: '+R$180/mês polifarmácia', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Riscos de Frequência',
      cards: [
        {
          color: '#10b981',
          tag: 'RUPTURA SEM ALTERNATIVA',
          title: 'Produto em falta sem oferta de equivalente no ato: 62% dos clientes saem "pra ver em outro lugar" e não voltam naquele mês — a ruptura vira perda de frequência, não só de venda',
          detail: 'Quando o produto está em falta e o balconista não oferece equivalente imediato, 62% dos clientes buscam outro PDV — e 44% desses fazem a próxima compra rotineira no concorrente. Protocolo de equivalência no balcão retém 71% desses clientes. Fonte: análise de comportamento pós-ruptura / Abrafarma 2025.',
          badge: { label: '62% não voltam no mês', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Fidelização no PDV',
      cards: [
        {
          color: '#10b981',
          tag: 'RETENÇÃO POR EQUIPAMENTO',
          title: 'Farmácia que vende termômetro, aferidor de pressão ou oxímetro tem retenção de crônicos 2,9x maior — o equipamento ancora a farmácia como referência de saúde, não só de compra',
          detail: 'Clientes que compram equipamentos de saúde retornam em 30 dias a 74%, contra 26% dos que compram só medicamento. Retenção 2,9x maior. Ticket anual do cliente de equipamento: R$ 1.840 vs R$ 620. Fonte: Abrafarma PDV Report 2026.',
          badge: { label: 'Retenção 2,9x equipamento', type: 'info' },
        },
        {
          color: '#10b981',
          tag: 'NOVO VS FIEL',
          title: 'Cliente fidelizado gasta 2,8x mais por ano que o eventual — mas 80% do esforço de vendas no balcão vai para atrair cliente novo, que custa 5x mais para converter',
          detail: 'Cliente fidelizado (4+ compras/ano) tem ticket anual 2,8x maior que o eventual. Custo de aquisição de novo cliente: 5x o de retenção. Inverter a proporção para 60% retenção / 40% atração eleva receita total em 34% sem aumentar custo. Fonte: análise de LTV em farmácia independente / Abrafarma Fidelidade 2025.',
          badge: { label: 'Fiel = 2,8x mais gasto', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Abordagem & Timing',
      cards: [
        {
          color: '#10b981',
          tag: 'PEDIDO DE MAIS BARATO',
          title: '"Me dá o mais barato" é abertura de conversa, não fim — em 67% dos casos o cliente aceita a opção com melhor custo-benefício se o balconista explicar em até 30 segundos',
          detail: 'Pesquisa de comportamento no PDV mostra que 67% dos clientes que pedem "o mais barato" aceitam uma alternativa de melhor custo-benefício quando o balconista apresenta a diferença de forma clara e rápida. O pedido sinaliza sensibilidade a preço, não rejeição ao produto. Balconistas treinados nessa abordagem elevam o ticket médio dessas interações em R$ 29. Fonte: análise de linguagem de compra no PDV / Abrafarma 2025.',
          badge: { label: '67% aceitam upgrade', type: 'ok' },
        },
        {
          color: '#10b981',
          tag: 'JANELA SAZONAL',
          title: 'Farmácias que preparam o balcão 21 dias antes do pico sazonal (inverno, dengue, gripe) capturam 47% mais demanda — as que reagem no pico chegam sem estoque e sem abordagem',
          detail: 'Campanhas sazonais têm janela de preparo de 3 semanas antes do pico. Farmácias com exposição de balcão, script de abordagem e estoque posicionados com 21 dias de antecedência capturam 47% mais volume que as que reagem ao movimento. O pico não avisa — o calendário avisa. Fonte: análise de performance sazonal no varejo farmacêutico / Abrafarma Sazonalidade 2026.',
          badge: { label: '47% mais demanda 21d antes', type: 'warn' },
        },
        {
          color: '#10b981',
          tag: 'FIDELIDADE NO CAIXA',
          title: 'Mencionar o programa de fidelidade no momento do pagamento — não antes — converte 3x mais inscrições. Apenas 12% das farmácias têm esse protocolo no caixa',
          detail: 'Clientes abordados sobre o programa de fidelidade no ato do pagamento convertem 3x mais que os abordados na entrada ou durante o atendimento. O momento do pagamento tem atenção natural do cliente e baixo custo de interrupção. Apenas 12% das farmácias independentes têm esse protocolo formalizado. Fonte: análise de conversão de fidelização / Abrafarma Independentes 2025.',
          badge: { label: 'Conv. 3x no pagamento', type: 'ok' },
        },
        {
          color: '#10b981',
          tag: 'SEGUNDA-FEIRA DE DOR',
          title: 'Segunda-feira tem 31% mais vendas de analgésico e anti-inflamatório que a média semanal — farmácia com esses itens na entrada nesse dia tem ticket 19% maior no período',
          detail: 'Segunda-feira é o dia de maior volume de compras de analgésicos e anti-inflamatórios no varejo farmacêutico — 31% acima da média semanal. Clientes chegam com sintoma acumulado do fim de semana e decisão de compra já formada. Posicionamento desses itens na entrada às segundas eleva o ticket do período em 19%. Fonte: análise de volume de venda por dia da semana / Abrafarma PDV 2026.',
          badge: { label: '+31% analgésico na seg.', type: 'info' },
        },
        {
          color: '#10b981',
          tag: 'TRIAGEM DE SINTOMAS',
          title: 'Farmácias Nissei implantaram balcão de triagem com 3 perguntas antes de indicar o produto — NPS subiu 17 pontos e devolução caiu 34% em 6 meses',
          detail: 'A rede Nissei (PR) treinou balconistas para fazer 3 perguntas de triagem de sintomas antes de qualquer indicação de produto. Resultado em 6 meses: NPS +17 pontos, devolução de produto -34% e ticket médio +22%. O cliente que recebe o produto certo na primeira vez não precisa voltar para trocar — e confia mais na próxima. Fonte: Abrafarma Cases de Atendimento 2026.',
          badge: { label: 'NPS +17 · devolução -34%', type: 'ok' },
        },
      ],
    },
  ],

  financeiro: [
    {
      sectionTitle: 'Margem & Mix de Mercado',
      cards: [
        {
          color: '#f59e0b',
          tag: 'MIX E MARGEM',
          title: 'Cada 1 ponto percentual que migra de medicamento de referência para não-medicamento eleva a margem bruta em 0,6 p.p. — dermocosméticos e suplementos têm margem 3x maior que referência',
          detail: 'Margem bruta média em medicamentos de referência: 22–24%. Dermocosméticos e suplementos: 40–52%. Para cada 1 p.p. transferido do mix para essas categorias, a margem sobe 0,5–0,7 p.p. Farmácias com não-medicamentos acima de 30% do faturamento têm margem 8–12 p.p. superior à média do setor. Fonte: análise de composição de margem no varejo farmacêutico / Abrafarma Mix Report 2026.',
          badge: { label: 'Dermo = margem 3x maior', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Riscos Financeiros do Setor',
      cards: [
        {
          color: '#f59e0b',
          tag: 'INADIMPLÊNCIA SETORIAL',
          title: 'Inadimplência no crediário próprio acima de 4% corrói mais margem do que a receita extra que o crédito gera — o crediário vira armadilha sem controle de risco',
          detail: 'Inadimplência média no crediário de farmácias: 3,2% (dentro do aceitável). Acima de 4%, o custo de provisão + cobrança + capital parado supera o ganho de volume gerado. O setor registrou alta de 0,8 p.p. em H1/26, puxada por pressão de renda nas classes C/D. Fonte: BNDES + Abrafarma Crédito ao Consumidor 2026.',
          badge: { label: 'Inadimpl. +0,8pp H1/26', type: 'warn' },
        },
        {
          color: '#f59e0b',
          tag: 'CUSTO DE ESTOQUE',
          title: 'Manter estoque parado custa em média 3,2% do faturamento anual — segundo maior custo operacional de uma farmácia, logo atrás da folha de pagamento',
          detail: 'O custo total de manutenção de estoque (capital imobilizado, vencimento, armazenagem, perdas) representa 3,2% do faturamento no varejo farmacêutico independente. Farmácias com giro de estoque abaixo de 8x/ano pagam 1,4 p.p. a mais que as que giram 12x+. Reduzir o prazo médio em 5 dias libera R$ 12–18 mil para cada R$ 1 mi de faturamento. Fonte: CFF + Abrafarma Custo Operacional 2025.',
          badge: { label: '3,2% do fat. em estoque', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Capital de Giro & Fornecedores',
      cards: [
        {
          color: '#f59e0b',
          tag: 'PRAZO DE FORNECEDOR',
          title: 'Distribuidoras de genéricos oferecem até 90 dias de prazo para farmácias com compra mínima de R$ 50 mil/mês — capital de giro gratuito que apenas 34% das elegíveis negociam',
          detail: 'Distribuidoras Profarma, Neodist e Panarello concedem prazo de 60–90 dias para compradores com volume acima de R$ 50 mil/mês e histórico limpo. Apenas 34% das farmácias elegíveis negociam esse prazo formalmente. O prazo extra libera caixa equivalente a 2–3 semanas de capital de giro sem custo financeiro. Fonte: análise de condições comerciais no atacado farmacêutico / Abrafarma Distribuição 2025.',
          badge: { label: 'Até 90 dias sem custo', type: 'ok' },
        },
        {
          color: '#f59e0b',
          tag: 'CUSTO DE CAPITAL',
          title: 'Raia e Drogasil antecipam recebíveis via FIDC próprio a CDI+0,8% — farmácias independentes pagam CDI+3% pelo mesmo serviço nos bancos, diferença de R$ 15–22 mil/ano por R$ 1 mi em cartão',
          detail: 'Raia Drogasil e DPSP operam FIDCs próprios para antecipação de recebíveis de cartão a CDI+0,8%–1,2%. Farmácias independentes acessam o mesmo serviço via banco a CDI+3%–4%. A diferença equivale a R$ 15–22 mil/ano para cada R$ 1 mi de faturamento em cartão. Cooperativas como Unifarma oferecem FIDC coletivo — mas só 18% dos associados aderem. Fonte: Abrafarma Finanças + CVM 2026.',
          badge: { label: 'CDI+0,8% vs CDI+3%', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Compras & Fornecedores',
      cards: [
        {
          color: '#f59e0b',
          tag: 'DIRETO VS DISTRIBUIDOR',
          title: 'Comprar genérico direto do laboratório rende margem 6–9 p.p. maior que pelo distribuidor — mas exige R$ 150 mil/mês de volume. Cooperativas como Unifarma chegam lá comprando junto',
          detail: 'Compra direta junto a laboratórios como Eurofarma, Teuto e EMS eleva margem bruta em 6–9 p.p. vs distribuidor intermediário. Exigência: volume mínimo de R$ 150 mil/mês por linha. Cooperativas Unifarma e FarmaClub consolidam volume de dezenas de associadas para atingir o threshold. Taxa de adesão atual: 22% das farmácias elegíveis. Fonte: análise de cadeia de fornecimento farmacêutico / Abrafarma Compras 2026.',
          badge: { label: '+6–9pp compra direta', type: 'ok' },
        },
        {
          color: '#f59e0b',
          tag: 'VARIAÇÃO NO ATACADO',
          title: 'O mesmo genérico pode custar até 34% a menos em uma distribuidora do que em outra — farmácias sem cotação mensal deixam em média R$ 28 mil/ano na mesa',
          detail: 'Levantamento de 200 genéricos de alto giro em 5 distribuidoras registrou variação de até 34% para o mesmo produto. Dispersão maior em antibióticos, anti-hipertensivos e ansiolíticos. Farmácias com processo de cotação mensal automatizada economizam em média R$ 28 mil/ano vs as que compram do fornecedor habitual sem comparação. Fonte: análise de preço no atacado farmacêutico / Abrafarma Compras 2026.',
          badge: { label: 'Variação até 34% no atacado', type: 'info' },
        },
        {
          color: '#f59e0b',
          tag: 'RISCO DE PRAZO REVOGADO',
          title: 'Distribuidor que concede 60 dias pode revogar o prazo após 2 boletos em atraso e recolocar em 30 — o custo de capital do estoque dobra e a renegociação leva em média 4 meses',
          detail: 'Contratos de distribuição farmacêutica permitem revisão unilateral de prazo após inadimplência de 2+ títulos. Farmácias que perdem o prazo estendido precisam financiar o mesmo estoque com capital próprio ou crédito bancário — custo adicional de R$ 8–14 mil/mês por R$ 1 mi de estoque. Renegociação após revogação: média de 4 meses. Fonte: análise de contratos de distribuição / Abrafarma + CFF 2025.',
          badge: { label: '4 meses p/ renegociar', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Tributário & Precificação',
      cards: [
        {
          color: '#f59e0b',
          tag: 'REGIME TRIBUTÁRIO',
          title: 'Farmácia com até R$ 4,8 mi/ano no Lucro Presumido paga até 10 p.p. mais imposto do que poderia no Simples Nacional — 59% não revisa o enquadramento anualmente',
          detail: 'Até R$ 4,8 mi/ano de faturamento, o Simples Nacional pode reduzir a carga tributária efetiva em 6–10 p.p. no varejo farmacêutico vs Lucro Presumido. Apenas 41% das farmácias independentes revisam o regime anualmente. Simulação com contador custa menos de R$ 500 e pode render R$ 30–80 mil/ano em economia fiscal. Fonte: Receita Federal + Abrafarma Gestão Tributária 2025.',
          badge: { label: 'Até 10pp a menos no Simples', type: 'ok' },
        },
        {
          color: '#f59e0b',
          tag: 'JANELA DO REAJUSTE CMED',
          title: 'CMED publica o teto em março com vigência em abril — farmácia que demora a atualizar tabela vende estoque reajustado no preço antigo e comprime margem por um trimestre',
          detail: 'O calendário CMED é fixo: publicação em março, vigência 1º de abril. Distribuidoras repassam imediatamente. Atraso médio de atualização de tabela no varejo independente: 18 dias. Cada dia de atraso equivale a 0,016 p.p. de margem perdida por medicamento reajustado — acumulado no trimestre chega a 0,9 p.p. Fonte: CMED + análise de repasse de preço / Abrafarma Precificação 2026.',
          badge: { label: 'Atraso médio: 18 dias', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Gestão de Estoque & Precificação',
      cards: [
        {
          color: '#f59e0b',
          tag: 'COMPRA PROGRAMADA',
          title: 'RaiaDrogasil e DPSP usam forecast automático de demanda para comprar com 30 dias de antecedência — independentes compram por intuição e têm estoque 40% mais gordo com o dobro de ruptura',
          detail: 'Redes com compra programada por algoritmo de demanda histórica mantêm estoque médio 40% menor e ruptura 54% menor que independentes sem o sistema. O excesso de estoque nas independentes representa capital imobilizado de R$ 18–35 mil para cada R$ 500 mil de faturamento mensal. Fonte: análise de gestão de estoque no varejo farmacêutico / Abrafarma Tech 2026.',
          badge: { label: 'Estoque 40% mais gordo', type: 'warn' },
        },
        {
          color: '#f59e0b',
          tag: 'CUSTO DA RUPTURA',
          title: 'O custo de ruptura de estoque equivale a 2,1x o custo do excesso que a farmácia tentou evitar — cortar pedido por medo de encalhe sai mais caro do que manter o item a mais',
          detail: 'Ruptura gera perda imediata da venda + 34% de chance de o cliente não retornar naquele mês. Custo total por evento de ruptura: 2,1x o custo de manter o item extra em gôndola. Farmácias que cortam pedido preventivamente pagam o dobro em receita perdida. Fonte: análise de custo total de estoque / Abrafarma + FGV Logística 2025.',
          badge: { label: 'Ruptura custa 2,1x o excesso', type: 'info' },
        },
        {
          color: '#f59e0b',
          tag: 'PREÇO DE REPOSIÇÃO',
          title: 'Farmácia que precifica pelo custo de reposição — não pelo que pagou — tem margem 3–5 p.p. maior em períodos de reajuste. A maioria precifica pelo passado e vende abaixo do mercado sem perceber',
          detail: 'Precificação pelo custo de aquisição gera descasamento em reajustes: a farmácia vende pelo preço antigo enquanto o próximo pedido já será mais caro. Precificação pelo custo de reposição preserva 3–5 p.p. de margem nos meses de reajuste CMED. Apenas 29% das independentes adotam o método. Fonte: análise de política de precificação / Abrafarma Gestão 2025.',
          badge: { label: '+3–5pp com preço de reposição', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Receita & Risco Fiscal',
      cards: [
        {
          color: '#f59e0b',
          tag: 'SERVIÇOS FARMACÊUTICOS',
          title: 'Serviços farmacêuticos (aferição de pressão, teste de glicemia, injetável) têm margem de 60–80% e isenção de ICMS em 14 estados — menos de 20% das farmácias cobram formalmente',
          detail: 'A RDC 44/09 autoriza cobrança por serviços farmacêuticos clínicos. Margem bruta: 60–80% sem custo de produto. Quatorze estados concedem isenção de ICMS sobre a receita de serviços. Farmácias que formalizam a cobrança faturam em média R$ 4.200/mês adicionais com os mesmos recursos. Menos de 20% das independentes adotam. Fonte: CFF + Abrafarma Serviços Farmacêuticos 2026.',
          badge: { label: 'Margem 60–80% em serviços', type: 'ok' },
        },
        {
          color: '#f59e0b',
          tag: 'BONIFICAÇÃO TRIBUTADA',
          title: 'Bonificação de indústria (produto grátis no pedido) é tributada como receita desde 2024 — farmácias que não ajustaram a contabilidade acumulam passivo fiscal retroativo de até 5 anos',
          detail: 'A Solução de Consulta COSIT 215/2023 consolidou tributação de bonificações em produto como receita operacional. IRPJ, CSLL, PIS e COFINS incidem sobre o valor de mercado do produto bonificado. Farmácias no Lucro Real ou Presumido sem ajuste contábil ficam expostas a autuação retroativa de até 5 anos. Fonte: Receita Federal COSIT 215/2023 + Abrafarma Fiscal 2024.',
          badge: { label: 'Passivo retroativo 5 anos', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Crédito & Indicadores Econômicos',
      cards: [
        {
          color: '#f59e0b',
          tag: 'CUSTO DO BOLETO NÃO PAGO',
          title: 'O custo total de um boleto não pago (tarifa + cobrança + administrativo) chega a R$ 47 em média — mais do que o valor de vários boletos de pequenos fornecedores. Inadimplir sai mais caro do que antecipar',
          detail: 'Custo médio de um boleto não pago no varejo: R$ 14 de tarifa bancária + R$ 18 de custo de cobrança + R$ 15 de custo administrativo interno = R$ 47. Para fornecedores com boletos abaixo de R$ 200, o custo da inadimplência supera 23% do valor da dívida. Antecipar com desconto de 1–2% é sempre mais barato. Fonte: análise de custo de inadimplência no atacado / Abrafarma + Febraban 2025.',
          badge: { label: 'R$47 por boleto não pago', type: 'info' },
        },
        {
          color: '#f59e0b',
          tag: 'PRONAMPE',
          title: 'Farmácias com faturamento acima de R$ 2 mi/ano acessam Pronampe a Selic+1,25% para capital de giro — custo 60% menor que o cheque especial PJ. Apenas 11% das elegíveis usaram em 2025',
          detail: 'O Pronampe oferece crédito a Selic+1,25% com prazo de até 48 meses. Custo efetivo anual: ~13% vs 34–42% do cheque especial PJ. Apenas 11% das farmácias elegíveis acessaram a linha em 2025 — a maioria desconhece a elegibilidade ou usa crédito bancário por inércia. Fonte: SEBRAE + Abrafarma Finanças 2026.',
          badge: { label: 'Selic+1,25% vs 34% cheque esp.', type: 'ok' },
        },
        {
          color: '#f59e0b',
          tag: 'DESCASAMENTO DE CONVÊNIO',
          title: 'Convênios pagam em 32 dias; estoque vence em 28 — os 4 dias de descasamento criam necessidade de capital de giro permanente de R$ 12–18 mil para cada R$ 1 mi faturado em plano de saúde',
          detail: 'Prazo médio de recebimento de convênios no varejo farmacêutico: 32 dias. Prazo médio de pagamento de estoque: 28 dias. O descasamento de 4 dias exige capital de giro permanente de R$ 12–18 mil por R$ 1 mi de faturamento em convênio. Farmácias com carteira de convênio acima de 40% do faturamento sentem o efeito no fluxo de caixa toda quinzena. Fonte: Abrafarma + ANS 2026.',
          badge: { label: '4 dias de descasamento', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Tributário & Benefícios',
      cards: [
        {
          color: '#f59e0b',
          tag: 'REFORMA TRIBUTÁRIA',
          title: 'A substituição de PIS/COFINS pelo CBS começa em 2027 — medicamentos hoje isentos podem perder a isenção parcialmente. Farmácias que não modelaram o impacto até 2026 serão pegas de surpresa na margem',
          detail: 'A reforma tributária (LC 214/2024) substitui PIS/COFINS pelo CBS a partir de 2027. Medicamentos isentos de PIS/COFINS podem ter tratamento distinto no novo regime conforme a lista de essencialidade. Impacto estimado na margem bruta: 2–5 p.p. para produtos sem confirmação de isenção no CBS. Modelagem recomendada: contratada até dez/26. Fonte: LC 214/2024 + Abrafarma Fiscal 2026.',
          badge: { label: 'CBS vigência 2027', type: 'warn' },
        },
        {
          color: '#f59e0b',
          tag: 'ANTECIPAÇÃO DE FGTS',
          title: 'Pague Menos e Extrafarma oferecem antecipação de FGTS como benefício ao colaborador — turnover cai 18% e o custo de substituição (R$ 5.800/pessoa) reduz sem tocar na folha',
          detail: 'Pague Menos e Extrafarma integraram plataformas de antecipação de FGTS (Saque-Aniversário) como benefício corporativo. Resultado: turnover -18% nas lojas do programa vs grupo de controle. Custo de substituição de colaborador no varejo farmacêutico: R$ 5.800. O benefício não aumenta a folha — redistribui acesso ao crédito do próprio trabalhador. Fonte: Abrafarma RH + relatórios de benefícios corporativos 2026.',
          badge: { label: 'Turnover -18% sem custo', type: 'ok' },
        },
      ],
    },
  ],

  rh: [
    {
      sectionTitle: 'Retenção & Risco Operacional',
      cards: [
        {
          color: '#8b5cf6',
          tag: 'TREINO DELEGADO',
          title: 'Farmácias que deixam o treinamento inicial ao representante de laboratório têm turnover 2,7x maior — o representante treina para vender o produto dele, não para reter o colaborador',
          detail: 'Balconistas com onboarding estruturado pela própria farmácia permanecem 12 meses a 71% vs 29% dos treinados por laboratório. 63% das independentes do RJ delegam o treinamento de entrada ao rep de indústria. O que parece gratuito custa R$ 4.200 por saída prematura. Fonte: Abrafarma Treinamento & Retenção 2026.',
          badge: { label: 'Turnover 2,7x sem onboarding', type: 'warn' },
        },
        {
          color: '#8b5cf6',
          tag: 'JANELA DE CONTRATAÇÃO',
          title: '38% das vagas do varejo farmacêutico abrem entre maio e julho — quem não contratou até agora vai disputar os mesmos candidatos no pico sazonal de inverno',
          detail: '38% das contratações anuais no varejo farmacêutico ocorrem no 2º trimestre, coincidindo com alta de gripe e inverno. Tempo médio de filling de balconista no RJ: 19 dias. Quem inicia agora entrega o profissional treinado no pico; quem atrasa entrega depois que o movimento passou. Fonte: CAGED/MTE + Abrafarma Sazonal 2026.',
          badge: { label: 'Janela: mai–jul', type: 'warn' },
        },
        {
          color: '#8b5cf6',
          tag: 'BÔNUS DE NPS',
          title: 'Farmácias que atrelam bônus do balconista ao NPS da loja têm turnover 44% menor — e o modelo ainda é raro no varejo independente, que paga fixo e perde para quem paga variável',
          detail: 'Farmácias com remuneração variável vinculada a NPS e meta de setor têm turnover anual de 18% vs 32% da média. O bônus médio (R$ 200–320/mês) é absorvido pela economia com substituição (R$ 4.200/saída). Pague Menos adotou o modelo em 2024 — independentes têm a mesma alavanca sem burocracia de rede. Fonte: Abrafarma RH + ABRH 2026.',
          badge: { label: 'Turnover 44% menor', type: 'ok' },
        },
        {
          color: '#8b5cf6',
          tag: 'RISCO RT AUSENTE',
          title: 'Farmácia sem farmacêutico RT presente no horário de funcionamento está sujeita a interdição imediata — e a rotatividade do setor cria janelas de risco que a maioria não monitora',
          detail: 'A RDC 44/2009 exige presença de RT durante todo o horário de funcionamento. Farmácias com mais de 3 trocas de RT/ano acumulam em média 14 dias/ano sem cobertura formal. Cada dia sem RT é passível de interdição e multa de até R$ 1,5 mi. Fonte: ANVISA + CFF Fiscalização 2025.',
          badge: { label: '14 dias/ano sem RT em média', type: 'warn' },
        },
        {
          color: '#8b5cf6',
          tag: 'BALCONISTA VS FARMACÊUTICO',
          title: 'O turnover de balconistas no varejo farmacêutico do RJ é 51% — quase o dobro do de farmacêuticos. A saída que mais acontece não é a mais cara, mas é a que ninguém coloca no orçamento',
          detail: 'Turnover anual de balconistas no RJ: 51% vs 31% de farmacêuticos. Custo de substituição de balconista: R$ 4.200. Farmácia com 8 balconistas troca em média 4 por ano — R$ 16.800/ano em reposição silenciosa sem linha no orçamento. Fonte: CAGED/MTE + Abrafarma Workforce 2026.',
          badge: { label: 'Turnover 51% balconistas', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Mercado de Trabalho Farmacêutico',
      cards: [
        {
          color: '#8b5cf6',
          tag: 'ESCASSEZ TÉCNICA',
          title: 'O Brasil forma 30 mil farmacêuticos por ano — mas o varejo só retém 41% deles após 12 meses. A maioria prefere indústria e hospitais antes mesmo de cogitar o balcão',
          detail: 'Farmacêuticos com CRF ativo: 310 mil no Brasil. Apenas 28% optam pelo varejo como destino principal. Taxa de retenção no varejo após 12 meses: 41% vs 79% na indústria. O gargalo não é formação — é o que o setor oferece para quem ficou. Fonte: CFF + IBGE PNAD 2025.',
          badge: { label: 'Retenção 41% no varejo', type: 'warn' },
        },
        {
          color: '#8b5cf6',
          tag: 'CUSTO DE SUBSTITUIÇÃO',
          title: 'Cada farmacêutico que sai custa R$ 12.400 para ser reposto — recrutamento, treinamento e produtividade perdida. Com turnover de 32%/ano no setor, é sangria silenciosa e constante',
          detail: 'Custo total de substituição de farmacêutico no varejo: R$ 12.400 (recrutamento R$ 3.200 + treinamento R$ 4.800 + produtividade perdida R$ 4.400). Rede com 100 farmacêuticos e 32% de turnover gasta R$ 396 mil/ano só para repor quem saiu. Reter custa 4x menos do que substituir. Fonte: CFF + Abrafarma RH Report 2026.',
          badge: { label: 'R$ 12.400 por saída', type: 'warn' },
        },
        {
          color: '#8b5cf6',
          tag: 'FARMACÊUTICO CLÍNICO',
          title: 'Farmácias que usam o farmacêutico como consultor clínico — não só operador de balcão — têm NPS 19 pontos acima e ticket 26% maior sem contratar mais ninguém',
          detail: 'Farmácias com modelo de atenção farmacêutica ativa (agenda de aferição, glicemia, orientação) elevaram NPS em 19 pontos e ticket médio em 26%. O mesmo CRF exigido pela vigilância sanitária gera receita extra quando usado ativamente. Menos de 15% do varejo explora esse modelo. Fonte: CFF / Abrafarma Serviços Clínicos 2026.',
          badge: { label: 'NPS +19 sem contratar', type: 'ok' },
        },
        {
          color: '#8b5cf6',
          tag: 'SALÁRIO RJ',
          title: 'Farmacêutico RT no RJ ganha em média R$ 4.800/mês — mas vagas que oferecem R$ 5.400 recebem 4x mais candidatos e fecham em metade do tempo',
          detail: 'Salário médio de farmacêutico RT no varejo do RJ: R$ 4.800/mês (CAGED jun/26). Vagas com remuneração acima de R$ 5.400 recebem 4x mais candidaturas e fecham em 8 dias vs 17 das demais. O gap de R$ 600/mês representa R$ 7.200/ano — menos do que o custo de uma substituição não planejada. Fonte: CAGED/MTE + CFF Mercado de Trabalho 2026.',
          badge: { label: 'Gap R$ 600/mês fecha 2x mais rápido', type: 'info' },
        },
        {
          color: '#8b5cf6',
          tag: 'CONCORRENTE RECRUTA',
          title: 'A RD Saúde abriu 340 vagas de trainee farmacêutico com auxílio CRF e bônus de permanência — e está absorvendo recém-formados antes que o varejo independente chegue perto',
          detail: 'RD Saúde: 340 vagas de trainee farmacêutico em 2026 com auxílio CRF + plano de carreira em 18 meses + bônus de permanência de R$ 1.800 após 12 meses. Taxa de adesão em faculdades parceiras: 71%. Quem não tem programa estruturado compete pelo que sobra depois que as redes escolheram. Fonte: LinkedIn Jobs / Abrafarma Workforce 2026.',
          badge: { label: '340 vagas trainee RD', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Legislação & Modelos de Contratação',
      cards: [
        {
          color: '#8b5cf6',
          tag: 'TÉCNICO EM FARMÁCIA',
          title: 'Técnico em farmácia formado pelo SENAC cobre a maioria das funções de balcão legalmente — mas 78% das independentes continuam contratando só farmacêuticos para funções que o técnico pode exercer',
          detail: 'O técnico em farmácia (CBO 3201-05) executa dispensação de não-controlados, fracionamento e atendimento geral sob supervisão do RT. Salário médio no RJ: R$ 1.900 vs R$ 4.800 do farmacêutico. 78% das independentes não usam o cargo por desconhecimento da legislação. Fonte: CFF Resolução 586/2013 + SENAC-RJ 2025.',
          badge: { label: 'Técnico cobre balcão a R$ 1.900', type: 'info' },
        },
        {
          color: '#8b5cf6',
          tag: 'CONVENÇÃO VENCENDO',
          title: 'A convenção coletiva dos balconistas do varejo farmacêutico do RJ vence em setembro de 2026 — farmácias que não modelaram o impacto do reajuste esperado de 8–11% já estão atrasadas',
          detail: 'A CCT do varejo farmacêutico RJ (SINDIFARMA-RJ) renova em set/26. Reajuste médio dos últimos 3 ciclos: 9,4% acima do INPC. Folha representa 18–24% do custo operacional de uma independente. Cada 1% de reajuste acima do planejado reduz a margem bruta em 0,2–0,3 p.p. Fonte: SINDIFARMA-RJ + Abrafarma Gestão 2026.',
          badge: { label: 'CCT vence set/26', type: 'warn' },
        },
        {
          color: '#8b5cf6',
          tag: 'RECRUTAMENTO POR INDICAÇÃO',
          title: 'Farmácias que pagam bônus de R$ 300 para colaboradores que indicam candidatos contratados reduzem o custo de recrutamento em 62% e preenchem vagas em metade do tempo',
          detail: 'Custo médio de filling de balconista via agência/job board no RJ: R$ 1.100. Via indicação com bônus de R$ 300: R$ 420 — 62% mais barato. Tempo de filling: 8 dias vs 19. Taxa de permanência em 6 meses: 74% (indicados) vs 51% (canal aberto). Fonte: Abrafarma Recrutamento + ABRH-RJ 2025.',
          badge: { label: 'Custo 62% menor via indicação', type: 'ok' },
        },
        {
          color: '#8b5cf6',
          tag: 'ESCALA 12X36',
          title: '67% dos farmacêuticos do varejo do RJ preferem escala 12x36 a horário comercial — mas menos de 30% das farmácias oferecem o modelo, perdendo candidatos antes mesmo da entrevista',
          detail: 'CRF-RJ 2026: 67% dos farmacêuticos no varejo preferem 12x36 por compatibilidade com segundo emprego ou estudos. Farmácias que oferecem o modelo têm 3,1x mais candidaturas por vaga e filling 40% mais rápido. Mudança não aumenta custo — redistribui a jornada. Apenas 28% das independentes oferecem a escala formalmente. Fonte: CRF-RJ Pesquisa de Mercado + Abrafarma 2026.',
          badge: { label: '67% preferem 12x36', type: 'info' },
        },
        {
          color: '#8b5cf6',
          tag: 'PAGUE MENOS ACADEMY',
          title: 'O Pague Menos lançou plataforma EAD para balconistas com certificação reconhecida pelo CRF — e usa o treinamento como argumento de recrutamento antes de mencionar salário',
          detail: 'Pague Menos Academy: 47 módulos EAD com certificação reconhecida pelo CRF como hora técnica. Candidaturas espontâneas cresceram 41% após o lançamento. Farmácias independentes que montaram trilha similar — mesmo que 5 módulos gravados — relatam recrutamento 28% mais fácil. Fonte: Pague Menos RI + Abrafarma Workforce 2026.',
          badge: { label: 'Candidatura +41% com EAD', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Disputa por Talento',
      cards: [
        {
          color: '#8b5cf6',
          tag: 'MANIPULAÇÃO RECRUTA',
          title: 'Farmácias de manipulação pagam R$ 1.300/mês a mais que o varejo convencional para o mesmo CRF — e estão captando exatamente o perfil técnico que o varejo mais precisa reter',
          detail: 'Salário médio de farmacêutico em manipulação no RJ: R$ 6.100 vs R$ 4.800 no varejo convencional. Diferença de R$ 1.300/mês = R$ 15.600/ano. O setor de manipulação cresce 18%/ano e abre vagas com benefícios superiores. O perfil técnico mais qualificado é absorvido antes de chegar ao balcão. Fonte: CFF + CAGED/MTE 2026.',
          badge: { label: 'Manipulação paga R$ 1.300/mês a mais', type: 'warn' },
        },
        {
          color: '#8b5cf6',
          tag: 'FARMACÊUTICO REMOTO',
          title: 'A RDC 548/2021 autoriza supervisão farmacêutica remota para farmácias de menor porte — modelo reduz custo de RT em 40% e quase nenhum independente sabe que pode usar',
          detail: 'Supervisão remota permite que um farmacêutico atenda até 3 farmácias simultaneamente com presença física programada. Custo de RT remoto: R$ 2.800/mês vs R$ 4.800 presencial. Adoção abaixo de 8% no varejo independente do RJ. Exige câmera, sistema de chamada e protocolo registrado no CRF. Fonte: ANVISA RDC 548/2021 + CFF 2025.',
          badge: { label: 'RT 40% mais barato remoto', type: 'ok' },
        },
        {
          color: '#8b5cf6',
          tag: 'FUGA PARA HEALTHTECH',
          title: 'Healthtechs e fintechs de saúde pagam 2,1x mais que o varejo farmacêutico para o mesmo CRF — e recrutam ativamente nas mesmas faculdades que formam os farmacêuticos do setor',
          detail: 'Salário médio de farmacêutico em healthtech (Dr. Consulta, Alice, Hapvida Digital): R$ 9.800 vs R$ 4.800 no varejo. Benefícios: stock options, home office, PLR. LinkedIn registrou 34% de aumento nas candidaturas de farmacêuticos para healthtechs em 2025 vs 2024. Fonte: CFF + Glassdoor Brasil 2026.',
          badge: { label: 'Healthtech paga 2,1x mais', type: 'warn' },
        },
        {
          color: '#8b5cf6',
          tag: 'TEMPO ATÉ O CRF',
          title: 'Farmacêutico recém-formado leva em média 47 dias para receber o CRF provisório — e 31% aceitam outra oferta antes de receber o registro, reduzindo a oferta antes de o varejo chegar',
          detail: 'Prazo médio de emissão do CRF provisório após colação de grau: 47 dias (CRF-RJ, 2026). Nesse intervalo o candidato não pode atuar como RT e busca outras ocupações. 31% dos recém-formados aceitam outro emprego antes de receber o registro. O intervalo burocrático é o primeiro filtro que encolhe a oferta. Fonte: CRF-RJ + pesquisa de empregabilidade farmacêutica 2026.',
          badge: { label: '47 dias para ter o CRF', type: 'info' },
        },
        {
          color: '#8b5cf6',
          tag: 'CONCURSO PÚBLICO',
          title: 'Uma vaga de farmacêutico no serviço público do RJ recebe 8x mais candidatos que no varejo — e os perfis mais qualificados escolhem o público primeiro, antes de o varejo aparecer no radar',
          detail: 'Concursos para farmacêutico na rede pública do RJ registraram média de 14 candidatos/vaga em 2025 vs 1,7 no varejo privado. Salário público: R$ 5.200 + estabilidade. Varejo: R$ 4.800 sem estabilidade. O candidato mais qualificado não está no LinkedIn — está aguardando resultado de concurso. Fonte: SEPLAG-RJ + CFF Mercado de Trabalho 2025.',
          badge: { label: '8x mais candidatos no público', type: 'info' },
        },
      ],
    },
  ],

  operacoes: [
    {
      sectionTitle: 'Layout, Fluxo & Produtividade',
      cards: [
        {
          color: '#06b6d4',
          tag: 'ENTRADA DA LOJA',
          title: '94% das compras por impulso no varejo farmacêutico acontecem nos primeiros 4 metros após a entrada — o produto certo nessa faixa gera ticket 31% maior sem nenhum desconto',
          detail: '94% das compras não planejadas ocorrem na faixa de entrada (primeiros 4m). Redes que redesenharam o layout de entrada com foco em sazonal e lançamento cresceram a categoria de impulso em 28%. O custo da mudança é zero — só reposicionamento de gôndola. Fonte: Abrafarma Layout & Conversão 2025.',
          badge: { label: '94% do impulso nos primeiros 4m', type: 'info' },
        },
        {
          color: '#06b6d4',
          tag: 'HORÁRIO CRÍTICO',
          title: 'Farmácias que fecham às 21h perdem em média 11% do faturamento mensal para concorrentes com horário estendido — e as últimas 2 horas são desproporcionalmente altas em OTC',
          detail: 'Venda de OTC nas 2h finais do horário representa 19% do volume diário — acima da média por hora. Farmácias que estendem para 22h em bairros residenciais crescem 11% no faturamento mensal. Custo da extensão: 1 colaborador a mais por turno. Fonte: Abrafarma Operações + análise de volume por hora 2025.',
          badge: { label: '11% de fat. nas últimas 2h', type: 'warn' },
        },
        {
          color: '#06b6d4',
          tag: 'AUTOATENDIMENTO',
          title: 'Self-checkout em farmácias reduz o tempo de espera em 61% e eleva a satisfação do cliente com pressa — e o custo de instalação caiu 58% desde 2022 com equipamentos nacionais',
          detail: 'Totem de autoatendimento para não-controlados reduz o checkout de 6,2 para 2,4 min. NPS do segmento "cliente com pressa" sobe 22 pontos. Custo de totem nacional: R$ 18–28 mil vs R$ 65 mil do importado em 2022. Payback médio: 14 meses. Fonte: Abrafarma Tech + ABRAS 2026.',
          badge: { label: 'Checkout 6,2→2,4 min', type: 'ok' },
        },
        {
          color: '#06b6d4',
          tag: 'PRODUTIVIDADE POR M²',
          title: 'A farmácia mais produtiva do Brasil fatura R$ 142 mil/m²/ano — a média do setor é R$ 28 mil. O gap não é de localização: é de mix, layout e giro',
          detail: 'Produtividade média por m² no varejo farmacêutico: R$ 28 mil/ano. Top 5% das lojas: R$ 95–142 mil/m²/ano. Mix de alta margem acima de 30% + layout de fluxo + giro de estoque acima de 12x explicam o gap. Localização responde por só 34% da diferença. Fonte: Abrafarma Benchmark Operacional 2026.',
          badge: { label: 'Gap: R$ 28k vs R$ 142k/m²', type: 'info' },
        },
        {
          color: '#06b6d4',
          tag: 'RETIRADA EM LOJA',
          title: 'A RD Saúde instalou balcão exclusivo de retirada de pedidos digitais em 340 lojas — e o cliente que retira compra R$ 24 a mais em impulso do que o que recebeu em casa',
          detail: 'RD Saúde: 340 lojas com balcão de retirada em até 30 min. Cliente que retira adiciona R$ 24 em compras de impulso na visita vs R$ 8 do cliente de delivery que não entra na loja. Tempo de checkout de retirada: 90 segundos. Fonte: RD Saúde RI + Abrafarma Digital Commerce 2026.',
          badge: { label: '+R$ 24 impulso na retirada', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Escala & Modelos de Atendimento',
      cards: [
        {
          color: '#06b6d4',
          tag: 'FARMÁCIA 24H',
          title: 'Farmácias que operam 24h faturam em média 2,4x mais que as de horário comercial — mas só 11% das independentes do RJ têm autorização para o modelo',
          detail: 'Farmácias 24h no RJ faturam em média R$ 2,1 mi/mês vs R$ 870 mil das de horário comercial. Volume das 22h–6h: 34% do faturamento diário concentrado em urgência e crônico. Custo adicional: 2 colaboradores por turno noturno. Aprovação ANVISA para 24h: 45 dias. Fonte: ANVISA + Abrafarma Operações 24h 2026.',
          badge: { label: 'Faturamento 2,4x no 24h', type: 'info' },
        },
        {
          color: '#06b6d4',
          tag: 'DIMENSIONAMENTO SAZONAL',
          title: 'O varejo farmacêutico do RJ entra no pico de fluxo de inverno nos próximos 21 dias — lojas que não ajustaram a escala de balcão antes do pico atenderão mal no momento certo',
          detail: 'Fluxo de farmácias no RJ sobe 38% entre a 3ª semana de junho e o fim de julho. Farmácias que escalaram 1 balconista extra por turno nessa janela mantiveram TMA abaixo de 5 min e NPS 14 pontos acima das que não escalaram. A janela de preparação dura 3 semanas — e já está na 1ª. Fonte: Abrafarma Sazonalidade Operacional 2026.',
          badge: { label: 'Pico: próximos 21 dias', type: 'warn' },
        },
        {
          color: '#06b6d4',
          tag: 'DRIVE-THRU FARMA',
          title: 'Drive-thru farmacêutico tem ticket médio 22% maior que o balcão — o cliente que não quer sair do carro compra mais porque não sente o atrito da loja',
          detail: 'Farmácias com janela drive-thru no RJ registram ticket médio de R$ 94 vs R$ 77 no balcão. TMA: 3,2 min. Mix: crônico (62%) + OTC (28%) + dermo (10%). Custo de instalação: R$ 8–14 mil. Payback médio: 8 meses. Apenas 3% das independentes do RJ têm o modelo. Fonte: Abrafarma Canais de Atendimento 2026.',
          badge: { label: 'Ticket 22% maior no drive-thru', type: 'ok' },
        },
        {
          color: '#06b6d4',
          tag: 'GÔNDOLA VAZIA',
          title: 'Gôndola com mais de 20% de espaço vazio reduz o ticket do corredor em 31% — o cliente interpreta o vazio como ruptura, mesmo quando o produto está no estoque',
          detail: 'Vazio visual acima de 20% reduz o ticket do corredor em 31% e a permanência no espaço em 24%. O produto pode estar no estoque — o cliente não verifica; ele sai. Reposição a cada 90 min em horário de pico resolve sem custo extra de estoque. Fonte: Abrafarma Visual Merchandising 2025.',
          badge: { label: 'Ticket -31% com gôndola vazia', type: 'warn' },
        },
        {
          color: '#06b6d4',
          tag: 'TEMPO NA LOJA',
          title: 'Cada minuto a mais que o cliente passa dentro de uma farmácia vale R$ 9 em ticket adicional — mas o layout médio do setor foi projetado para saída rápida, não para permanência',
          detail: 'Correlação tempo de permanência/ticket no varejo farmacêutico: R$ 9/min adicional. Cliente que fica 8 min gasta em média R$ 87 vs R$ 42 de quem fica 3 min. Farmácias com área de espera confortável, sinalização educativa e banco de aferição têm permanência 3,1 min maior. Fonte: Abrafarma Comportamento de Shopper 2025.',
          badge: { label: 'R$ 9/min adicional de permanência', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Tecnologia & Formatos',
      cards: [
        {
          color: '#06b6d4',
          tag: 'FORMATO EXPRESS',
          title: 'A Droga Raia abriu 23 unidades no formato Express em 2026 — lojas de 80m² com 2.000 SKUs de alto giro que ocupam espaços onde a farmácia tradicional não consegue entrar',
          detail: 'Droga Raia Express: 80m², 2.000 SKUs de maior giro, foco em OTC/crônico/conveniência. Faturamento médio: R$ 380 mil/mês com custo operacional 58% menor que uma loja padrão. O formato avança em corredores comerciais e galerias onde o padrão não cabe. Fonte: Droga Raia RI + Abrafarma Formatos 2026.',
          badge: { label: '23 unidades Express Raia 2026', type: 'warn' },
        },
        {
          color: '#06b6d4',
          tag: 'ETIQUETA DIGITAL',
          title: 'Etiquetas eletrônicas de preço eliminam o risco de preço errado na gôndola e reduzem o custo de atualização de tabela em 94% — payback no varejo farmacêutico é de 18 meses',
          detail: 'Troca manual de etiqueta custa R$ 0,38/SKU/atualização. Com 3.000 SKUs e reajuste CMED + promoções mensais, uma farmácia faz 8.000+ trocas/ano — R$ 3.040 em mão de obra. Etiqueta eletrônica: atualização de toda a loja em 4 min. Payback médio: 18 meses. Fonte: Abrafarma Tech + GS1 Brasil 2026.',
          badge: { label: 'Payback 18 meses', type: 'ok' },
        },
        {
          color: '#06b6d4',
          tag: 'CADEIA DE FRIO',
          title: '12% dos medicamentos termolábeis no varejo chegam ao cliente fora da faixa de temperatura recomendada — e 71% das falhas começam no expositor da loja, não no transporte',
          detail: 'Auditoria ANVISA 2025: 12% dos termolábeis amostrados no varejo com histórico de temperatura fora da faixa (2–8°C). 71% das ocorrências: falha no expositor da loja, não no CD. Multa por infração: R$ 15–150 mil. Produto degradado é devolvido — custo de imagem além do fiscal. Fonte: ANVISA Relatório de Inspeção 2025.',
          badge: { label: '12% fora da faixa de temp.', type: 'warn' },
        },
        {
          color: '#06b6d4',
          tag: 'BREAK-EVEN INDEPENDENTE',
          title: 'Abrir uma farmácia independente no RJ custa R$ 380 mil e leva 14 meses para atingir o break-even — redes chegam ao mesmo ponto em 8 meses com escala de fornecimento',
          detail: 'Investimento médio para abrir farmácia independente no RJ: R$ 380 mil (reforma + estoque + licenças). Break-even médio: 14 meses. Redes com compra centralizada chegam em 8 meses no mesmo ponto. O gap de 6 meses = R$ 180 mil em capital de giro adicional que a independente precisa ter reservado. Fonte: SEBRAE + Abrafarma Abertura 2026.',
          badge: { label: 'Break-even 14m vs 8m de rede', type: 'info' },
        },
        {
          color: '#06b6d4',
          tag: 'CONVERSÃO FÍSICA VS DIGITAL',
          title: 'Taxa de conversão de uma farmácia física bem operada é 68% — vs 3,2% de um e-commerce farmacêutico. O canal que mais converte no setor ainda é o balcão',
          detail: 'Taxa de conversão visita→compra no varejo farmacêutico físico: 68% (Abrafarma 2026). E-commerce farmacêutico: 3,2% (ABCOMM). A loja física converte 21x mais que o digital — porque o cliente já decidiu antes de entrar. Investir na experiência dentro da loja tem ROI estruturalmente superior ao digital no varejo de saúde. Fonte: Abrafarma + ABCOMM 2026.',
          badge: { label: 'Conv. física 68% vs digital 3,2%', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Eficiência & Inovação Operacional',
      cards: [
        {
          color: '#06b6d4',
          tag: 'SOM AMBIENTE',
          title: 'Farmácias que tocam música em ritmo lento (60–80 BPM) têm permanência 18% maior e ticket 11% acima das que ficam em silêncio ou tocam rádio com anúncios',
          detail: 'Ritmo musical abaixo de 80 BPM reduz o passo do cliente em 14% e eleva a permanência em 18%. No varejo farmacêutico, cada minuto adicional vale R$ 9 em ticket. Custo: playlist licenciada por R$ 89/mês. Menor investimento operacional com retorno mensurável no setor. Fonte: Abrafarma + Journal of Consumer Research aplicado ao varejo 2025.',
          badge: { label: 'Permanência +18% com ritmo lento', type: 'info' },
        },
        {
          color: '#06b6d4',
          tag: 'ALVARÁ VENCENDO',
          title: 'Alvarás sanitários emitidos em 2021 vencem em agosto de 2026 — renovação leva 47 dias e quem não protocolou ainda opera com risco real de interdição',
          detail: 'Alvarás de Funcionamento do ciclo 2021 (5 anos) vencem em agosto/26. Renovação na VISA-RJ: 47 dias em média (protocolo + vistoria + emissão). Farmácia com alvará vencido sujeita a interdição imediata e multa de R$ 15–80 mil. Janela segura para protocolo: encerrou em junho/26. Fonte: VISA-RJ + Abrafarma Compliance 2026.',
          badge: { label: 'Alvará vence ago/26', type: 'warn' },
        },
        {
          color: '#06b6d4',
          tag: 'LOCKER FARMACÊUTICO',
          title: 'Locker de retirada 24h na entrada da farmácia captura pedidos fora do horário de funcionamento — custo de R$ 12 mil, payback em 6 meses, zero colaborador envolvido',
          detail: 'Farmácias com locker 24h registram 18–34 retiradas/dia fora do horário. Ticket médio do pedido de locker: R$ 68. Instalação: R$ 12 mil. Payback médio: 6 meses. O cliente recebe código e retira sem interação — não exige escala adicional de equipe. Fonte: Abrafarma Canais 24h + ABCOMM 2026.',
          badge: { label: 'Payback 6 meses · zero colaborador', type: 'ok' },
        },
        {
          color: '#06b6d4',
          tag: 'SKU POR M²',
          title: 'A farmácia média expõe 14 SKUs por m² de gôndola — as mais produtivas do setor expõem 22 SKUs/m² no mesmo espaço, só reorganizando a verticalização',
          detail: 'Densidade de exposição média no varejo farmacêutico: 14 SKUs/m². Top 10% em produtividade: 22 SKUs/m² — 57% mais produto no mesmo espaço via verticalização e eliminação de espaços mortos. Cada SKU adicional por m² gera R$ 180–240/ano em receita extra no segmento de alta rotação. Fonte: Abrafarma Gestão de Espaço 2026.',
          badge: { label: '14 vs 22 SKUs/m²', type: 'info' },
        },
        {
          color: '#06b6d4',
          tag: 'FARMÁCIA CLÍNICA',
          title: 'O Pague Menos transformou 180 lojas em farmácias clínicas com sala de consulta farmacêutica — e o modelo eleva o ticket médio da loja em 34% sem ampliar a área de vendas',
          detail: 'Pague Menos Clínica: 180 lojas com sala de atendimento clínico (consulta, aferição avançada, gestão de crônico). Ticket médio 34% acima das lojas padrão. Tempo de permanência: +7 min. NPS: 81 vs 64 das demais. Meta da rede: 400 lojas clínicas até 2027. Fonte: Pague Menos RI + Abrafarma Serviços Clínicos 2026.',
          badge: { label: 'Ticket +34% no modelo clínico', type: 'warn' },
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
