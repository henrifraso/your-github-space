import type { OmniData, StoryGroup } from './types';

export const MOCK_DATA: OmniData = {
  negocio: {
    nome_fantasia: "McDonald's",
    segmento: "Fast Food & Hamburgeria",
    cidade: "São Paulo",
    estado: "SP",
    telefone: "(11) 3266-1800",
    nivel: 5,
    pontos: 4800
  },
  semana_label: "Semana de 06 de Abril de 2026",
  mercado_nome: "Fast Food & Alimentação Rápida",
  mercado_tamanho: "R$ 2.1bi/mês no Brasil",
  ranking_local: 1,
  progresso_pct: 96,
  nivel_label: "Líder de Mercado",
  pontos_proximo: 5000,
  concorrentes: [
    {
      nome: "Burger King Paulista", nota_google: 4.2,
      endereco: "Av. Paulista, 900 — Bela Vista", cidade: "São Paulo", faixa_preco: "$$",
      proposta_principal: "Hambúrgueres grelhados na chama com identidade 'Have It Your Way'",
      diferencial: "Customização total do pedido e promoções agressivas via app próprio",
      faz_bem: ["Whopper icônico", "Promoções via app", "Alta personalização do pedido"],
      nao_oferece: ["Happy Meal / público infantil", "McCafé / café premium", "Sobremesas variadas"],
      mudancas_recentes: ["Lançou Double Whopper por R$ 24,90 via app", "Abriu autosserviço 24h na Paulista"],
      notas_digitais: [{ plataforma: "Google", nota: 4.2 }, { plataforma: "iFood", nota: 4.0 }, { plataforma: "Rappi", nota: 4.1 }]
    },
    {
      nome: "Bob's Consolação", nota_google: 4.0,
      endereco: "R. da Consolação, 2012 — Consolação", cidade: "São Paulo", faixa_preco: "$",
      proposta_principal: "Rede brasileira com Cheeseburgão e milk-shakes icônicos",
      diferencial: "Preço mais acessível e milk-shake cremoso como produto âncora",
      faz_bem: ["Preço competitivo", "Milk-shake cremoso", "Identidade brasileira"],
      nao_oferece: ["Drive-thru", "App com fidelidade", "Café da manhã robusto"],
      mudancas_recentes: ["Reformulou embalagens para reduzir plástico", "Adicionou opção vegana no cardápio"],
      notas_digitais: [{ plataforma: "Google", nota: 4.0 }, { plataforma: "iFood", nota: 3.8 }]
    },
    {
      nome: "KFC Paulista", nota_google: 4.3,
      endereco: "Av. Paulista, 1374 — Bela Vista", cidade: "São Paulo", faixa_preco: "$$",
      proposta_principal: "Frango frito com receita secreta de 11 especiarias desde 1952",
      diferencial: "Produto diferenciado (frango ≠ hambúrguer) — menor sobreposição direta",
      faz_bem: ["Frango crocante premium", "Ambiente diferenciado", "Combos família"],
      nao_oferece: ["Hambúrguer clássico", "Happy Meal", "Café da manhã"],
      mudancas_recentes: ["Lançou KFC Nuggets com molho coreano", "Delivery em até 25min pela Paulista"],
      notas_digitais: [{ plataforma: "Google", nota: 4.3 }, { plataforma: "iFood", nota: 4.4 }, { plataforma: "Rappi", nota: 4.2 }]
    },
    {
      nome: "Subway Augusta", nota_google: 4.1,
      endereco: "R. Augusta, 300 — Consolação", cidade: "São Paulo", faixa_preco: "$$",
      proposta_principal: "Sanduíches montados na hora com opções saudáveis e personalizáveis",
      diferencial: "Posicionamento 'saudável' atrai público fitness — menor sobreposição direta",
      faz_bem: ["Personalização total", "Opções low carb", "Percepção de saúde"],
      nao_oferece: ["Batata frita", "Hambúrguer", "Milk-shake"],
      mudancas_recentes: ["Novo pão artesanal italiano", "Programa de fidelidade relançado"],
      notas_digitais: [{ plataforma: "Google", nota: 4.1 }, { plataforma: "iFood", nota: 4.0 }]
    },
    {
      nome: "Giraffas Brigadeiro", nota_google: 3.9,
      endereco: "Av. Brigadeiro Luís Antônio, 2200", cidade: "São Paulo", faixa_preco: "$$",
      proposta_principal: "Refeição completa com feijão tropeiro e proteínas grelhadas",
      diferencial: "Cardápio com comida brasileira — atinge cliente que evita hambúrguer",
      faz_bem: ["Combo com arroz e feijão", "Preço médio acessível", "Prato quente completo"],
      nao_oferece: ["Frango frito", "Drive-thru", "Sobremesas variadas"],
      mudancas_recentes: ["Lançou frango grelhado light no menu", "Fechou 3 unidades no centro"],
      notas_digitais: [{ plataforma: "Google", nota: 3.9 }, { plataforma: "iFood", nota: 3.7 }]
    },
    {
      nome: "Habib's Centro", nota_google: 3.8,
      endereco: "R. Boa Vista, 254 — Centro", cidade: "São Paulo", faixa_preco: "$",
      proposta_principal: "Esfihas, coxinhas e salgados a preço popular 24 horas",
      diferencial: "Menor ticket médio da região + funcionamento 24h — atinge outro horário",
      faz_bem: ["Preço popular", "Funcionamento 24h", "Variedade árabe/brasileira"],
      nao_oferece: ["Hambúrguer premium", "Drive-thru estruturado", "Café da manhã reforçado"],
      mudancas_recentes: ["App Habib's relançado com cupons", "Expandiu cardápio com pizza individual"],
      notas_digitais: [{ plataforma: "Google", nota: 3.8 }, { plataforma: "iFood", nota: 3.6 }]
    },
    {
      nome: "Madero Burger Paulista", nota_google: 4.5,
      endereco: "Av. Paulista, 2100 — Cerqueira César", cidade: "São Paulo", faixa_preco: "$$$",
      proposta_principal: "Hambúrguer artesanal premium com carne angus e brioche artesanal",
      diferencial: "Experiência gastronômica superior — ticket 3x maior justificado pela qualidade",
      faz_bem: ["Qualidade premium", "Ambiente sofisticado", "Nota mais alta da região"],
      nao_oferece: ["Preço acessível", "Delivery rápido", "Menu infantil"],
      mudancas_recentes: ["Abriu nova unidade no Iguatemi", "Lançou card de fidelidade premium"],
      notas_digitais: [{ plataforma: "Google", nota: 4.5 }, { plataforma: "iFood", nota: 4.4 }, { plataforma: "Rappi", nota: 4.6 }]
    },
    {
      nome: "Popeyes Bela Vista", nota_google: 4.1,
      endereco: "R. 13 de Maio, 150 — Bela Vista", cidade: "São Paulo", faixa_preco: "$$",
      proposta_principal: "Frango estilo Louisiana com tempero cajun e biscoito de manteiga",
      diferencial: "Produto único no mercado brasileiro — proposta americana autêntica",
      faz_bem: ["Frango crocante cajun", "Biscoito de manteiga exclusivo", "Sanduíche de frango viral"],
      nao_oferece: ["Hambúrguer", "Happy Meal", "Café da manhã"],
      mudancas_recentes: ["Lançou sanduíche de frango crocante viral", "Entrada em SP gerou fila de 2h"],
      notas_digitais: [{ plataforma: "Google", nota: 4.1 }, { plataforma: "iFood", nota: 4.3 }]
    },
  ],
  fornecedores: [
    { nome: "Martin-Brower Brasil", cidade: "São Paulo", estado: "SP", telefone: "(11) 3500-7700", email: "operacoes@martinbrower.com.br", preco_referencia: 0, produto_servico: "Distribuição logística exclusiva McDonald's — insumos e embalagens" },
    { nome: "BRF S.A.", cidade: "Chapecó", estado: "SC", telefone: "(49) 3321-2200", email: "comercial@brf-br.com", preco_referencia: 18.90, produto_servico: "Carnes processadas, nuggets e proteínas de frango" },
    { nome: "Coca-Cola Brasil", cidade: "São Paulo", estado: "SP", telefone: "(11) 5908-4800", email: "parceiros@cocacola.com.br", preco_referencia: 4.50, produto_servico: "Bebidas carbonatadas e linha McCafé" },
    { nome: "Bunge Brasil", cidade: "São Paulo", estado: "SP", telefone: "(11) 2599-7000", email: "contato@bunge.com.br", preco_referencia: 12.80, produto_servico: "Óleos vegetais, farinhas e margarinas para pão" },
    { nome: "Pepsico do Brasil", cidade: "São Paulo", estado: "SP", telefone: "(11) 3030-4400", email: "trade@pepsico.com.br", preco_referencia: 5.20, produto_servico: "Batata Lay's e snacks para combo / upsell" },
  ],
  praticas: [
    { titulo: "App + Loyalty: Pedidos com Pontuação", conteudo: "Programas de fidelidade no app aumentam frequência de visita em 32%. Cada R$1 gasto = 1 ponto. Resgates em McNuggets, McFlurry e upgrades de tamanho reduzem custo de retenção em 18%.", fonte: "McKinsey QSR Report 2025" },
    { titulo: "Quiosques de Autoatendimento", conteudo: "Lojas com quiosques reduzem fila em 40% e aumentam ticket médio em 22% — cliente monta o próprio combo sem pressão de caixa. ROI médio: 18 meses em lojas com 300+ pedidos/dia.", fonte: "QSR Magazine 2025" },
    { titulo: "Campanhas Relâmpago via Push Notification", conteudo: "Notificações push entre 10h-11h (pré-almoço) e 17h-18h (pré-jantar) com oferta de 2h aumentam pedidos em 27% nos períodos de baixo movimento. Abertura média: 38% vs 12% do email.", fonte: "Apptopia 2025" },
    { titulo: "Delivery em 25 Minutos — Padrão Ouro", conteudo: "85% dos consumidores de fast food descartam o pedido se o tempo estimado ultrapassar 30min. Parceria com iFood Prioritário e Rappi Flash garante SLA de 25min e NPS 10pts acima da média.", fonte: "Abrasel 2026" },
    { titulo: "Cardápio Sazonais e Edições Limitadas", conteudo: "Lançamentos sazonais (McShaker Fries, McFlurry Ovomaltine) geram pico de 45% nas vendas durante a janela de disponibilidade. Urgência percebida aumenta decisão de compra em 3x.", fonte: "Euromonitor 2025" },
  ],
  previsao_clima: [
    { dia_label: "Seg", icone: "⛅", temp_max: 29, temp_min: 21, chuva_mm: 4 },
    { dia_label: "Ter", icone: "🌧️", temp_max: 25, temp_min: 20, chuva_mm: 22 },
    { dia_label: "Qua", icone: "🌦️", temp_max: 26, temp_min: 20, chuva_mm: 10 },
    { dia_label: "Qui", icone: "☀️", temp_max: 30, temp_min: 21, chuva_mm: 0 },
    { dia_label: "Sex", icone: "☀️", temp_max: 31, temp_min: 22, chuva_mm: 0 },
  ],
  gamificacao_log: [
    { acao: "Meta Semanal de Vendas Atingida", pontos: 200 },
    { acao: "NPS Acima de 80 no Mês", pontos: 150 },
    { acao: "Zero Ocorrências de Food Safety", pontos: 100 },
  ],
  pesquisa: {
    resumo: "Fast food no Brasil faturou R$ 25bi em 2025. São Paulo concentra 38% das unidades. Delivery já representa 31% das vendas no segmento. Tendências do semestre: personalização de pedido, menu digital e redução de embalagens plásticas. Ticket médio por pessoa: R$ 38–52."
  },
  timeline: [
    { id: '1', data: '05 Abr', tipo: 'concorrente', icone: '⚡', titulo: 'Burger King lançou Double Whopper por R$ 24,90', detalhe: 'Burger King (nota 4.2) lançou promoção agressiva no app: Double Whopper + batata + refri por R$ 24,90 — 35% abaixo do preço regular. Promoção válida por 7 dias. Risco de migração de clientes price-sensitive. Considere ativar oferta similar via app ou destacar diferencial de conveniência (drive-thru + McCafé).' },
    { id: '2', data: '03 Abr', tipo: 'mercado', icone: '📈', titulo: 'iFood elevou comissão para 27% a partir de maio', detalhe: 'iFood comunicou aumento da taxa de comissão de 25% para 27% a partir de 01/mai/2026 para restaurantes na categoria Fast Food. Impacto estimado: R$ 0,80–1,20 por pedido. Avalie renegociação de contrato, migração parcial para canal próprio (app) ou repasse de custo via preços de delivery.' },
    { id: '3', data: '01 Abr', tipo: 'mercado', icone: '🌊', titulo: 'Páscoa 2026 — pico de consumo na Paulista', detalhe: 'Semana da Páscoa (13–20/abr) historicamente gera +18% em fluxo de clientes na Av. Paulista. Lojas com campanha ativa no período registram +32% em vendas. Ative o McFlurry edição Páscoa, push notification com cupom e decoração temática no PDV.' },
    { id: '4', data: '30 Mar', tipo: 'fornecedor', icone: '📦', titulo: 'BRF com reajuste de 8% em carnes processadas', detalhe: 'BRF comunicou reajuste de 8% na linha de proteínas processadas (nuggets, hambúrguer bovino) a partir de 15/abr/2026, motivado por alta do milho e soja. Estocar acima do habitual antes do reajuste pode gerar economia de R$ 12.000–18.000/mês. Contato: (49) 3321-2200.' },
    { id: '5', data: '28 Mar', tipo: 'concorrente', icone: '🏪', titulo: 'Madero abriu nova unidade no Iguatemi SP', detalhe: 'Madero Burger (nota 4.5, maior nota premium da região) inaugurou unidade no Shopping Iguatemi — a 800m da Paulista. Atinge o ticket alto (R$ 75–110/pessoa) mas pode capturar ocasião de jantar de final de semana que antes ia ao McDonald\'s. Fortaleça posicionamento de conveniência e velocidade para diferenciar.' },
  ],
};

export const BARBER_PHOTOS = {
  profile:  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop',
  interior: 'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=600&h=900&fit=crop',
  cut1:     'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=900&fit=crop',
  cut2:     'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=900&fit=crop',
  tools:    'https://images.unsplash.com/photo-1619454016518-697bc231e7cb?w=600&h=900&fit=crop',
  chair:    'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=900&fit=crop',
  window:   'https://images.unsplash.com/photo-1561758033-7e924f619b47?w=600&h=900&fit=crop',
  pole:     'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=900&fit=crop',
  tMercado:    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&h=150&fit=crop',
  tFornecedor: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&h=150&fit=crop',
  tPraticas:   'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=150&h=150&fit=crop',
  tEvolucao:   'https://images.unsplash.com/photo-1561758033-7e924f619b47?w=150&h=150&fit=crop',
  tClima:      'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=150&h=150&fit=crop',
};

export const STORY_DURATION = 5000;

export function buildStories(data: OmniData): StoryGroup[] {
  return [
    {
      label: 'Mercado', seed: 'market2025', thumb: BARBER_PHOTOS.tMercado,
      slides: [
        { image: BARBER_PHOTOS.cut1, title: 'Análise de Mercado', body: data.pesquisa?.resumo ?? '—' },
        { image: BARBER_PHOTOS.chair, title: `${data.concorrentes.length} Concorrentes`, body: data.concorrentes.slice(0, 3).map(c => `⭐ ${c.nota_google ?? '—'}  ${c.nome}`).join('\n') || '—' },
      ],
    },
    {
      label: 'Fornecedores', seed: 'supply2025', thumb: BARBER_PHOTOS.tFornecedor,
      slides: data.fornecedores.slice(0, 3).map((f, i) => ({
        image: [BARBER_PHOTOS.tools, BARBER_PHOTOS.cut2, BARBER_PHOTOS.interior][i % 3],
        title: f.nome,
        body: `${f.produto_servico}\n📍 ${f.cidade}, ${f.estado}\n📞 ${f.telefone || '—'}`,
      })),
    },
    {
      label: 'Práticas', seed: 'practice2025', thumb: BARBER_PHOTOS.tPraticas,
      slides: data.praticas.slice(0, 3).map((p, i) => ({
        image: [BARBER_PHOTOS.cut2, BARBER_PHOTOS.cut1, BARBER_PHOTOS.tools][i % 3],
        title: p.titulo, body: p.conteudo,
      })),
    },
    {
      label: 'Evolução', seed: 'growth2025', thumb: BARBER_PHOTOS.tEvolucao,
      slides: [
        { image: BARBER_PHOTOS.window, title: `Nível ${data.negocio?.nivel ?? '—'} — ${data.nivel_label}`, body: `${data.negocio?.pontos ?? 0} pts\n${data.progresso_pct}% para o próximo nível` },
        ...data.gamificacao_log.slice(0, 2).map((g, i) => ({
          image: [BARBER_PHOTOS.pole, BARBER_PHOTOS.chair][i % 2],
          title: 'Conquista', body: `${g.acao}\n+${g.pontos} pts`,
        })),
      ],
    },
    {
      label: 'Clima', seed: 'sky2025', thumb: BARBER_PHOTOS.tClima,
      slides: data.previsao_clima.slice(0, 4).map((w, i) => ({
        image: [BARBER_PHOTOS.interior, BARBER_PHOTOS.chair, BARBER_PHOTOS.window, BARBER_PHOTOS.pole][i % 4],
        title: `${w.dia_label} — ${w.icone}`,
        body: `Máx ${w.temp_max}°  Mín ${w.temp_min}°${w.chuva_mm > 0 ? `\n🌧 ${w.chuva_mm}mm de chuva` : ''}`,
      })),
    },
  ];
}
