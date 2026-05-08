import type { OmniData, StoryGroup } from './types';

export const MOCK_DATA: OmniData = {
  negocio: {
    nome_fantasia: "OS1",
    segmento: "Software & Inteligência Artificial",
    cidade: "São Paulo",
    estado: "SP",
    telefone: "(11) 9 9000-0001",
    nivel: 5,
    pontos: 4800
  },
  semana_label: "Semana de 06 de Maio de 2026",
  mercado_nome: "SaaS & Inteligência Artificial B2B",
  mercado_tamanho: "R$ 4.8bi/mês no Brasil",
  ranking_local: 1,
  progresso_pct: 96,
  nivel_label: "Líder de Mercado",
  pontos_proximo: 5000,
  concorrentes: [
    {
      nome: "Salesforce Brasil", nota_google: 4.2,
      endereco: "Av. Paulista, 2300 — Bela Vista", cidade: "São Paulo", faixa_preco: "$$$",
      proposta_principal: "CRM enterprise líder global com plataforma Einstein AI integrada",
      diferencial: "Ecossistema de parceiros e integrações sem paralelo — mais de 4.000 apps no AppExchange",
      faz_bem: ["CRM robusto", "Einstein AI nativa", "Ecossistema de parceiros"],
      nao_oferece: ["Preço acessível para PMEs", "Onboarding rápido", "Interface simplificada"],
      mudancas_recentes: ["Lançou Agentforce com IA autônoma para vendas", "Adquiriu Informatica por US$ 11bi"],
      notas_digitais: [{ plataforma: "G2", nota: 4.2 }, { plataforma: "Capterra", nota: 4.1 }, { plataforma: "Gartner", nota: 4.3 }]
    },
    {
      nome: "HubSpot Brasil", nota_google: 4.4,
      endereco: "Av. Faria Lima, 3600 — Itaim Bibi", cidade: "São Paulo", faixa_preco: "$$",
      proposta_principal: "Plataforma de inbound marketing, CRM e automação para médias empresas",
      diferencial: "Freemium agressivo com curva de aprendizado baixa — favorito de startups",
      faz_bem: ["UX intuitivo", "Plano gratuito robusto", "Conteúdo educacional"],
      nao_oferece: ["IA generativa avançada", "Análise preditiva profunda", "Customização enterprise"],
      mudancas_recentes: ["Lançou HubSpot AI com geração de copy e análise de sentimento", "Expandiu equipe no Brasil em 40%"],
      notas_digitais: [{ plataforma: "G2", nota: 4.4 }, { plataforma: "Capterra", nota: 4.5 }]
    },
    {
      nome: "Pipedrive LATAM", nota_google: 4.3,
      endereco: "Av. Brigadeiro Faria Lima, 1663", cidade: "São Paulo", faixa_preco: "$$",
      proposta_principal: "CRM focado em pipeline de vendas com interface visual de drag-and-drop",
      diferencial: "Simplicidade extrema — equipe de vendas adota em menos de 1 semana",
      faz_bem: ["Pipeline visual", "App mobile robusto", "Preço justo"],
      nao_oferece: ["Marketing automation completo", "BI avançado", "IA preditiva"],
      mudancas_recentes: ["Lançou Pipedrive AI com sugestões de próximo passo", "Abriu escritório em São Paulo"],
      notas_digitais: [{ plataforma: "G2", nota: 4.3 }, { plataforma: "Capterra", nota: 4.2 }]
    },
    {
      nome: "Monday.com Brasil", nota_google: 4.5,
      endereco: "R. Funchal, 418 — Vila Olímpia", cidade: "São Paulo", faixa_preco: "$$",
      proposta_principal: "Work OS para gestão de projetos e processos com automações visuais",
      diferencial: "Flexibilidade extrema — serve como CRM, gestão de projetos e BI ao mesmo tempo",
      faz_bem: ["Automações sem código", "Templates prontos", "Interface colorida e intuitiva"],
      nao_oferece: ["CRM profundo", "Pipeline de vendas dedicado", "Relatórios financeiros"],
      mudancas_recentes: ["Monday AI lançado com geração de automações em linguagem natural", "IPO avalia empresa em US$ 14bi"],
      notas_digitais: [{ plataforma: "G2", nota: 4.5 }, { plataforma: "Capterra", nota: 4.6 }]
    },
    {
      nome: "Moskit CRM", nota_google: 4.1,
      endereco: "R. Prof. Atílio Innocenti, 165 — Vila Olímpia", cidade: "São Paulo", faixa_preco: "$",
      proposta_principal: "CRM 100% brasileiro focado em PMEs com suporte em português",
      diferencial: "Preço em real, suporte local, sem barreira de idioma — vantagem com PMEs",
      faz_bem: ["Preço acessível", "Suporte em PT", "Integração WhatsApp"],
      nao_oferece: ["IA avançada", "Relatórios corporativos", "API robusta"],
      mudancas_recentes: ["Integrou WhatsApp Business API nativamente", "Lançou plano por R$ 49/usuário/mês"],
      notas_digitais: [{ plataforma: "G2", nota: 4.1 }, { plataforma: "Capterra", nota: 4.0 }]
    },
    {
      nome: "Agendor", nota_google: 4.0,
      endereco: "Av. Paulista, 726 — Bela Vista", cidade: "São Paulo", faixa_preco: "$",
      proposta_principal: "CRM brasileiro com foco em gestão comercial e funil de vendas",
      diferencial: "Simples e barato — ideal para equipes comerciais de até 15 pessoas",
      faz_bem: ["Preço competitivo", "App mobile", "Relatórios simples"],
      nao_oferece: ["Automação de marketing", "IA", "Integrações avançadas"],
      mudancas_recentes: ["Lançou painel de metas para gestores", "Parceria com RD Station"],
      notas_digitais: [{ plataforma: "G2", nota: 4.0 }, { plataforma: "Capterra", nota: 3.9 }]
    },
    {
      nome: "Zoho CRM Brasil", nota_google: 4.2,
      endereco: "Av. das Nações Unidas, 12551 — Brooklin", cidade: "São Paulo", faixa_preco: "$$",
      proposta_principal: "Suite completa com 50+ apps integrados e IA Zia para previsão de vendas",
      diferencial: "Custo-benefício máximo — uma assinatura cobre CRM, email, RH e contabilidade",
      faz_bem: ["Suite completa", "Zia AI integrada", "Preço por usuário baixo"],
      nao_oferece: ["UX refinado", "Onboarding estruturado", "Suporte premium em PT"],
      mudancas_recentes: ["Zia AI ganhou análise de sentimento de emails", "Abriu data center no Brasil"],
      notas_digitais: [{ plataforma: "G2", nota: 4.2 }, { plataforma: "Capterra", nota: 4.1 }]
    },
    {
      nome: "RD Station CRM", nota_google: 4.3,
      endereco: "Al. Vicente Pinzon, 54 — Vila Olímpia", cidade: "São Paulo", faixa_preco: "$$",
      proposta_principal: "CRM + marketing automation 100% brasileiro com foco em geração de leads",
      diferencial: "Único player que integra marketing e vendas nativamente em português — ecossistema local",
      faz_bem: ["Marketing automation nativo", "Integração total com Google Ads", "Suporte em PT"],
      nao_oferece: ["IA generativa", "Relatórios financeiros avançados", "Customização profunda"],
      mudancas_recentes: ["Adquirido pela Totvs por R$ 1,86bi", "Lançou RD AI com scoring de leads"],
      notas_digitais: [{ plataforma: "G2", nota: 4.3 }, { plataforma: "Capterra", nota: 4.4 }]
    },
  ],
  fornecedores: [
    { nome: "Amazon Web Services (AWS)", cidade: "São Paulo", estado: "SP", telefone: "(11) 3958-2000", email: "aws-br@amazon.com", preco_referencia: 0, produto_servico: "Infraestrutura cloud — compute, storage, IA/ML e bancos de dados gerenciados" },
    { nome: "OpenAI API", cidade: "San Francisco", estado: "CA", telefone: "+1 415-000-0000", email: "api@openai.com", preco_referencia: 0.015, produto_servico: "GPT-4o e modelos de linguagem para features de IA generativa e agentes" },
    { nome: "Stripe Pagamentos", cidade: "São Paulo", estado: "SP", telefone: "(11) 3230-3500", email: "support@stripe.com", preco_referencia: 3.99, produto_servico: "Processamento de pagamentos, assinaturas SaaS e gestão de receita recorrente" },
    { nome: "Vercel Inc.", cidade: "San Francisco", estado: "CA", telefone: "+1 888-000-0001", email: "sales@vercel.com", preco_referencia: 20, produto_servico: "Hospedagem e CI/CD para frontend — deploy instantâneo com edge network global" },
    { nome: "Datadog Brasil", cidade: "São Paulo", estado: "SP", telefone: "(11) 4000-2222", email: "brasil@datadoghq.com", preco_referencia: 15, produto_servico: "Observabilidade, monitoramento de infraestrutura e alertas de performance em tempo real" },
  ],
  praticas: [
    { titulo: "Product-Led Growth: free tier como aquisição", conteudo: "SaaS com PLG converte 3x mais que outbound puro. Um plano gratuito com valor real reduz CAC em 62% e encurta o ciclo de vendas de 90 para 14 dias. Empresas PLG crescem 2x mais rápido que as tradicionais (OpenView 2025).", fonte: "OpenView SaaS Benchmark 2025" },
    { titulo: "Churn abaixo de 2%: playbook de CS proativo", conteudo: "Customer Success proativo com health score reduz churn de 8% para 1.8% em 6 meses. Contato nos dias 3, 14 e 30 pós-ativação aumenta retenção em 40%. Cada 1% de redução no churn vale +12% no LTV.", fonte: "Gainsight CS Report 2025" },
    { titulo: "IA nas features: aumento de 35% no NPS", conteudo: "Features de IA generativa contextual elevam NPS de 42 para 67 em média. O segredo: IA que antecipa o próximo passo do usuário dentro do próprio workflow, sem sair da tela.", fonte: "Andreessen Horowitz SaaS 2025" },
    { titulo: "Precificação anual: ARR cresce 3x mais rápido", conteudo: "Oferecer desconto de 20% no plano anual aumenta % de contratos anuais de 30% para 68%. ARR cresce 3x mais rápido com base anual e reduz pressão de renovação mensal sobre o time de CS.", fonte: "ChartMogul SaaS Metrics 2025" },
    { titulo: "SEO técnico: 70% do tráfego orgânico em SaaS", conteudo: "SaaS B2B com blog técnico ativo e SEO on-page geram 70% do tráfego de forma orgânica. Artigos que respondem buscas de 'como fazer X' convertem em trial 4x mais que landing pages genéricas.", fonte: "Ahrefs SaaS SEO Study 2025" },
  ],
  previsao_clima: [
    { dia_label: "Seg", icone: "⛅", temp_max: 29, temp_min: 21, chuva_mm: 4 },
    { dia_label: "Ter", icone: "🌧️", temp_max: 25, temp_min: 20, chuva_mm: 22 },
    { dia_label: "Qua", icone: "🌦️", temp_max: 26, temp_min: 20, chuva_mm: 10 },
    { dia_label: "Qui", icone: "☀️", temp_max: 30, temp_min: 21, chuva_mm: 0 },
    { dia_label: "Sex", icone: "☀️", temp_max: 31, temp_min: 22, chuva_mm: 0 },
  ],
  gamificacao_log: [
    { acao: "Meta de MRR Semanal Atingida", pontos: 200 },
    { acao: "NPS Acima de 60 no Mês", pontos: 150 },
    { acao: "Zero Downtime na Semana", pontos: 100 },
  ],
  pesquisa: {
    resumo: "O mercado de SaaS B2B no Brasil movimentou R$ 58bi em 2025. São Paulo concentra 61% das empresas de tecnologia. IA generativa é o maior vetor de crescimento: 78% dos CFOs planejam aumentar investimento em software com IA em 2026. Ticket médio de SaaS B2B: R$ 800–4.200/mês por empresa. Churn médio do setor: 6.2% ao mês. NPS médio: 42."
  },
  timeline: [
    { id: '1', data: '05 Mai', tipo: 'concorrente', icone: '⚡', titulo: 'Salesforce lançou Agentforce 2.0 com agentes autônomos', detalhe: 'Salesforce anunciou Agentforce 2.0: agentes de IA que operam CRM de forma autônoma — prospecção, follow-up e fechamento sem intervenção humana. Preço: US$ 2/conversa. Risco: reposiciona Salesforce de CRM para sistema operacional de vendas com IA. Diferencial OS1: integração nativa com dados do negócio local e contexto de mercado em tempo real.' },
    { id: '2', data: '03 Mai', tipo: 'mercado', icone: '📈', titulo: 'Totvs adquiriu RD Station por R$ 1,86bi', detalhe: 'A aquisição une o maior ERP brasileiro com a maior plataforma de marketing automation LATAM. Cria uma suite de gestão empresarial completa para o mercado brasileiro. Oportunidade: empresas que usam Totvs + RD Station agora têm um fornecedor único — pode reduzir espaço para especialistas. Estratégia recomendada: posicionar OS1 como camada de IA que complementa essas suites.' },
    { id: '3', data: '01 Mai', tipo: 'mercado', icone: '🌊', titulo: 'Gartner: 80% dos CEOs vão exigir ROI de IA até Q3/2026', detalhe: 'Relatório Gartner aponta que 80% dos CEOs entrevistarão fornecedores de software apenas se houver ROI mensurável de IA demonstrado em menos de 90 dias. Impacto: ciclo de vendas vai exigir proof-of-concept rápido. Ação: preparar demo de ROI com dados reais do cliente em até 30 minutos de conversa.' },
    { id: '4', data: '28 Abr', tipo: 'fornecedor', icone: '📦', titulo: 'OpenAI reajustou preços da API GPT-4o em +15%', detalhe: 'OpenAI aumentou o custo por token do GPT-4o em 15% a partir de 01/mai/2026. Impacto estimado no custo de infraestrutura de IA: +R$ 8.000–22.000/mês dependendo do volume de chamadas. Alternativas avaliadas: Claude 3.5 Haiku (30% mais barato, 95% da performance) e Llama 3.3 70B self-hosted (custo fixo em AWS).' },
    { id: '5', data: '25 Abr', tipo: 'concorrente', icone: '🏪', titulo: 'HubSpot abriu escritório em São Paulo com 80 vagas', detalhe: 'HubSpot inaugura hub LATAM em SP com foco em vendas enterprise e CS local. Traz 80 vagas de SDR, CS e engenharia. Risco: maior capacidade de atendimento em português e onboarding presencial no Brasil. Ação recomendada: fortalecer diferenciais de IA contextual e velocidade de implantação (OS1 ao vivo em 48h vs. 90 dias do HubSpot enterprise).' },
  ],
};

export const OS1_PHOTOS = {
  profile:  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop',
  interior: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=900&fit=crop',
  cut1:     'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=900&fit=crop',
  cut2:     'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=900&fit=crop',
  tools:    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=900&fit=crop',
  chair:    'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=900&fit=crop',
  window:   'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=900&fit=crop',
  pole:     'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=900&fit=crop',
  tMercado:    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&h=150&fit=crop',
  tFornecedor: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&h=150&fit=crop',
  tPraticas:   'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=150&h=150&fit=crop',
  tEvolucao:   'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=150&h=150&fit=crop',
  tClima:      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150&h=150&fit=crop',
};

export const BARBER_PHOTOS = OS1_PHOTOS;

export const STORY_DURATION = 5000;

const CLIMA_SP: OmniData['previsao_clima'] = [
  { dia_label: 'Seg', icone: '⛅', temp_max: 29, temp_min: 21, chuva_mm: 4 },
  { dia_label: 'Ter', icone: '🌧️', temp_max: 25, temp_min: 20, chuva_mm: 22 },
  { dia_label: 'Qua', icone: '🌦️', temp_max: 26, temp_min: 20, chuva_mm: 10 },
  { dia_label: 'Qui', icone: '☀️', temp_max: 30, temp_min: 21, chuva_mm: 0 },
  { dia_label: 'Sex', icone: '☀️', temp_max: 31, temp_min: 22, chuva_mm: 0 },
];

const MCDONALDS_DATA: OmniData = {
  negocio: { nome_fantasia: "McDonald's", segmento: "Fast Food & Hamburgeria", cidade: "São Paulo", estado: "SP", telefone: "(11) 3266-1800", nivel: 5, pontos: 4800 },
  semana_label: "Semana de 06 de Maio de 2026",
  mercado_nome: "Fast Food & Alimentação Rápida",
  mercado_tamanho: "R$ 2.1bi/mês no Brasil",
  ranking_local: 1, progresso_pct: 96, nivel_label: "Líder de Mercado", pontos_proximo: 5000,
  concorrentes: [
    { nome: "Burger King Paulista", nota_google: 4.2, endereco: "Av. Paulista, 900 — Bela Vista", cidade: "São Paulo", faixa_preco: "$$", proposta_principal: "Hambúrgueres grelhados na chama com identidade 'Have It Your Way'", diferencial: "Customização total do pedido e promoções agressivas via app próprio", faz_bem: ["Whopper icônico", "Promoções via app", "Alta personalização"], nao_oferece: ["Happy Meal / público infantil", "McCafé / café premium", "Sobremesas variadas"], mudancas_recentes: ["Lançou Double Whopper por R$ 24,90 via app", "Abriu autosserviço 24h na Paulista"], notas_digitais: [{ plataforma: "Google", nota: 4.2 }, { plataforma: "iFood", nota: 4.0 }, { plataforma: "Rappi", nota: 4.1 }] },
    { nome: "Bob's Consolação", nota_google: 4.0, endereco: "R. da Consolação, 2012 — Consolação", cidade: "São Paulo", faixa_preco: "$", proposta_principal: "Rede brasileira com Cheeseburgão e milk-shakes icônicos", diferencial: "Preço mais acessível e milk-shake cremoso como produto âncora", faz_bem: ["Preço competitivo", "Milk-shake cremoso", "Identidade brasileira"], nao_oferece: ["Drive-thru", "App com fidelidade", "Café da manhã robusto"], mudancas_recentes: ["Reformulou embalagens para reduzir plástico", "Adicionou opção vegana"], notas_digitais: [{ plataforma: "Google", nota: 4.0 }, { plataforma: "iFood", nota: 3.8 }] },
    { nome: "KFC Paulista", nota_google: 4.3, endereco: "Av. Paulista, 1374 — Bela Vista", cidade: "São Paulo", faixa_preco: "$$", proposta_principal: "Frango frito com receita secreta de 11 especiarias desde 1952", diferencial: "Produto diferenciado — frango vs hambúrguer, menor sobreposição direta", faz_bem: ["Frango crocante premium", "Ambiente diferenciado", "Combos família"], nao_oferece: ["Hambúrguer clássico", "Happy Meal", "Café da manhã"], mudancas_recentes: ["Lançou KFC Nuggets com molho coreano", "Delivery em até 25min"], notas_digitais: [{ plataforma: "Google", nota: 4.3 }, { plataforma: "iFood", nota: 4.4 }] },
    { nome: "Subway Augusta", nota_google: 4.1, endereco: "R. Augusta, 300 — Consolação", cidade: "São Paulo", faixa_preco: "$$", proposta_principal: "Sanduíches montados na hora com opções saudáveis e personalizáveis", diferencial: "Posicionamento saudável atrai público fitness — menor sobreposição direta", faz_bem: ["Personalização total", "Opções low carb", "Percepção de saúde"], nao_oferece: ["Batata frita", "Hambúrguer", "Milk-shake"], mudancas_recentes: ["Novo pão artesanal italiano", "Programa de fidelidade relançado"], notas_digitais: [{ plataforma: "Google", nota: 4.1 }, { plataforma: "iFood", nota: 4.0 }] },
    { nome: "Madero Burger Paulista", nota_google: 4.5, endereco: "Av. Paulista, 2100 — Cerqueira César", cidade: "São Paulo", faixa_preco: "$$$", proposta_principal: "Hambúrguer artesanal premium com carne angus e brioche artesanal", diferencial: "Experiência gastronômica superior — ticket 3x maior justificado pela qualidade", faz_bem: ["Qualidade premium", "Ambiente sofisticado", "Nota mais alta da região"], nao_oferece: ["Preço acessível", "Delivery rápido", "Menu infantil"], mudancas_recentes: ["Abriu nova unidade no Iguatemi", "Lançou card de fidelidade premium"], notas_digitais: [{ plataforma: "Google", nota: 4.5 }, { plataforma: "iFood", nota: 4.4 }] },
    { nome: "Habib's Centro", nota_google: 3.8, endereco: "R. Boa Vista, 254 — Centro", cidade: "São Paulo", faixa_preco: "$", proposta_principal: "Esfihas, coxinhas e salgados a preço popular 24 horas", diferencial: "Menor ticket médio + funcionamento 24h — atinge outro horário de consumo", faz_bem: ["Preço popular", "Funcionamento 24h", "Variedade árabe/brasileira"], nao_oferece: ["Hambúrguer premium", "Drive-thru estruturado", "Café da manhã reforçado"], mudancas_recentes: ["App Habib's relançado com cupons", "Expandiu cardápio com pizza individual"], notas_digitais: [{ plataforma: "Google", nota: 3.8 }, { plataforma: "iFood", nota: 3.6 }] },
    { nome: "Popeyes Bela Vista", nota_google: 4.1, endereco: "R. 13 de Maio, 150 — Bela Vista", cidade: "São Paulo", faixa_preco: "$$", proposta_principal: "Frango estilo Louisiana com tempero cajun e biscoito de manteiga", diferencial: "Produto único no mercado brasileiro — proposta americana autêntica", faz_bem: ["Frango crocante cajun", "Biscoito de manteiga exclusivo", "Sanduíche viral"], nao_oferece: ["Hambúrguer", "Happy Meal", "Café da manhã"], mudancas_recentes: ["Sanduíche de frango crocante viral", "Entrada em SP gerou fila de 2h"], notas_digitais: [{ plataforma: "Google", nota: 4.1 }, { plataforma: "iFood", nota: 4.3 }] },
    { nome: "Giraffas Brigadeiro", nota_google: 3.9, endereco: "Av. Brigadeiro Luís Antônio, 2200", cidade: "São Paulo", faixa_preco: "$$", proposta_principal: "Refeição completa com feijão tropeiro e proteínas grelhadas", diferencial: "Cardápio com comida brasileira — atinge cliente que evita hambúrguer", faz_bem: ["Combo com arroz e feijão", "Preço médio acessível", "Prato quente completo"], nao_oferece: ["Frango frito", "Drive-thru", "Sobremesas variadas"], mudancas_recentes: ["Frango grelhado light no menu", "Fechou 3 unidades no centro"], notas_digitais: [{ plataforma: "Google", nota: 3.9 }, { plataforma: "iFood", nota: 3.7 }] },
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
    { titulo: "Campanhas Relâmpago via Push Notification", conteudo: "Notificações push entre 10h–11h e 17h–18h com oferta de 2h aumentam pedidos em 27% nos períodos de baixo movimento. Abertura média: 38% vs 12% do email.", fonte: "Apptopia 2025" },
    { titulo: "Delivery em 25 Minutos — Padrão Ouro", conteudo: "85% dos consumidores descartam pedido se estimativa ultrapassar 30min. Parceria com iFood Prioritário e Rappi Flash garante SLA de 25min e NPS 10pts acima da média.", fonte: "Abrasel 2026" },
    { titulo: "Cardápios Sazonais e Edições Limitadas", conteudo: "Lançamentos sazonais (McShaker Fries, McFlurry Ovomaltine) geram pico de 45% nas vendas durante a janela de disponibilidade. Urgência percebida aumenta decisão de compra em 3x.", fonte: "Euromonitor 2025" },
  ],
  previsao_clima: CLIMA_SP,
  gamificacao_log: [
    { acao: "Meta Semanal de Vendas Atingida", pontos: 200 },
    { acao: "NPS Acima de 80 no Mês", pontos: 150 },
    { acao: "Zero Ocorrências de Food Safety", pontos: 100 },
  ],
  pesquisa: { resumo: "Fast food no Brasil faturou R$ 25bi em 2025. São Paulo concentra 38% das unidades. Delivery já representa 31% das vendas no segmento. Tendências do semestre: personalização de pedido, menu digital e redução de embalagens plásticas. Ticket médio por pessoa: R$ 38–52." },
  timeline: [
    { id: '1', data: '05 Mai', tipo: 'concorrente', icone: '⚡', titulo: 'Burger King lançou Double Whopper por R$ 24,90', detalhe: 'Promoção via app válida por 7 dias — 35% abaixo do preço regular. Risco de migração de clientes price-sensitive. Considere ativar oferta similar via app ou destacar diferencial de conveniência (drive-thru + McCafé).' },
    { id: '2', data: '03 Mai', tipo: 'mercado', icone: '📈', titulo: 'iFood elevou comissão para 27% a partir de maio', detalhe: 'Aumento de 25% para 27% a partir de 01/mai/2026 para restaurantes na categoria Fast Food. Impacto estimado: R$ 0,80–1,20 por pedido. Avalie renegociação de contrato ou migração parcial para canal próprio.' },
    { id: '3', data: '01 Mai', tipo: 'mercado', icone: '🌊', titulo: 'Dia das Mães 11/mai — pico histórico na Paulista', detalhe: 'Dia das Mães gera +22% em fluxo de clientes. Lojas com campanha ativa registram +35% em vendas. Ative McFlurry edição especial, push notification com cupom e decoração temática no PDV.' },
    { id: '4', data: '28 Abr', tipo: 'fornecedor', icone: '📦', titulo: 'BRF com reajuste de 8% em carnes processadas', detalhe: 'Reajuste a partir de 15/abr/2026, motivado por alta do milho e soja. Estocar acima do habitual antes do reajuste pode gerar economia de R$ 12.000–18.000/mês. Contato: (49) 3321-2200.' },
    { id: '5', data: '25 Abr', tipo: 'concorrente', icone: '🏪', titulo: 'Madero abriu nova unidade no Iguatemi SP', detalhe: 'Madero (nota 4.5) inaugurou no Shopping Iguatemi — a 800m da Paulista. Atinge ticket alto (R$ 75–110/pessoa). Fortaleça posicionamento de conveniência e velocidade para diferenciar.' },
  ],
};

const NIKE_DATA: OmniData = {
  negocio: { nome_fantasia: "Nike", segmento: "Moda & Artigos Esportivos", cidade: "São Paulo", estado: "SP", telefone: "(11) 3025-4800", nivel: 5, pontos: 4950 },
  semana_label: "Semana de 06 de Maio de 2026",
  mercado_nome: "Artigos Esportivos & Moda Ativa",
  mercado_tamanho: "R$ 1.8bi/mês no Brasil",
  ranking_local: 1, progresso_pct: 99, nivel_label: "Líder Global", pontos_proximo: 5000,
  concorrentes: [
    { nome: "Adidas Brasil", nota_google: 4.4, endereco: "Av. Paulista, 1374 — Bela Vista", cidade: "São Paulo", faixa_preco: "$$$", proposta_principal: "Esporte e streetwear premium com legado olímpico e collabs de moda", diferencial: "Yeezy / Originals — ponte entre esporte e alta moda, cultura hip-hop e lifestyle", faz_bem: ["Originals / Yeezy streetwear", "Parcerias de alto impacto", "Sustentabilidade Primegreen"], nao_oferece: ["Running tecnológico de ponta", "App de treino robusto", "Customização massiva"], mudancas_recentes: ["Encerrou parceria Yeezy após polêmica", "Lançou Adizero Boston 12 para maratona"], notas_digitais: [{ plataforma: "Google", nota: 4.4 }, { plataforma: "Reclame Aqui", nota: 3.8 }] },
    { nome: "Puma Brasil", nota_google: 4.2, endereco: "R. Funchal, 418 — Vila Olímpia", cidade: "São Paulo", faixa_preco: "$$", proposta_principal: "Esporte + moda com foco em futebol, running e lifestyle acessível", diferencial: "Preço 20% abaixo de Nike e Adidas com qualidade percebida aceitável", faz_bem: ["Preço competitivo", "Futebol (Neymar Jr.)", "Design moderno"], nao_oferece: ["Tecnologia de performance premium", "Ecossistema digital", "Running sério"], mudancas_recentes: ["Lançou Nitro Elite para running competitivo", "Renovou com Neymar Jr. até 2026"], notas_digitais: [{ plataforma: "Google", nota: 4.2 }] },
    { nome: "Under Armour Brasil", nota_google: 4.1, endereco: "Shopping JK Iguatemi — Itaim Bibi", cidade: "São Paulo", faixa_preco: "$$$", proposta_principal: "Performance técnica para atletas sérios — compressão, calor e tecnologia HeatGear", diferencial: "Posicionamento 100% performance — não compete em lifestyle, só em resultado", faz_bem: ["Compressão técnica", "Basketball (Curry)", "Público fitness intenso"], nao_oferece: ["Lifestyle/streetwear", "Futebol", "Preço acessível"], mudancas_recentes: ["Lançou Hovr Phantom 3 para corrida", "Expandiu linha feminina no Brasil"], notas_digitais: [{ plataforma: "Google", nota: 4.1 }] },
    { nome: "New Balance Brasil", nota_google: 4.3, endereco: "Shopping Cidade Jardim — Alto de Pinheiros", cidade: "São Paulo", faixa_preco: "$$$", proposta_principal: "Running premium e lifestyle retrô com fabricação nos EUA e UK", diferencial: "Único grande player com fabricação local nos EUA — autenticidade premium e cultura dad shoe", faz_bem: ["Running sério (990v6)", "Lifestyle retrô trendy", "Qualidade percebida alta"], nao_oferece: ["Futebol", "App de treino", "Preço médio"], mudancas_recentes: ["990v6 Made in USA esgotou em 72h no Brasil", "Abriu flagship na Oscar Freire"], notas_digitais: [{ plataforma: "Google", nota: 4.3 }] },
    { nome: "Olympikus Brasil", nota_google: 3.9, endereco: "Lojas Renner / Centros Comerciais", cidade: "Porto Alegre", faixa_preco: "$", proposta_principal: "Tênis brasileiro acessível para o mercado de massa", diferencial: "Preço imbatível para baixa renda — domina classes C e D com distribuição massiva", faz_bem: ["Preço acessível", "Distribuição ampla", "Tênis casual"], nao_oferece: ["Performance técnica", "Status social", "Streetwear"], mudancas_recentes: ["Lançou Corre! com amortecimento EVA melhorado", "Parceria com Esporte Clube Grêmio"], notas_digitais: [{ plataforma: "Google", nota: 3.9 }] },
    { nome: "Asics Brasil", nota_google: 4.2, endereco: "Shopping Morumbi — Morumbi", cidade: "São Paulo", faixa_preco: "$$$", proposta_principal: "Running científico com tecnologia GEL para redução de impacto articular", diferencial: "Credencial médica — recomendado por ortopedistas e fisioterapeutas no Brasil", faz_bem: ["Running técnico", "Credencial ortopédica", "Durabilidade"], nao_oferece: ["Lifestyle/streetwear", "Futebol", "Customização"], mudancas_recentes: ["Gel-Nimbus 26 lançado com nova espuma FF Blast+", "Patrocinou SP Marathon 2026"], notas_digitais: [{ plataforma: "Google", nota: 4.2 }] },
  ],
  fornecedores: [
    { nome: "Fábrica Yue Yuen — Vietnã", cidade: "Ho Chi Minh City", estado: "VN", telefone: "+84 28 3776 1234", email: "brazil@yueyuen.com", preco_referencia: 0, produto_servico: "Manufatura de calçados — 35% da produção global Nike, especialista em Air Max e React" },
    { nome: "Alpargatas S.A.", cidade: "João Pessoa", estado: "PB", telefone: "(83) 2101-5000", email: "parceiros@alpargatas.com.br", preco_referencia: 0, produto_servico: "Produção licenciada de produtos Nike para o mercado brasileiro" },
    { nome: "Totvs Varejo (ERP)", cidade: "São Paulo", estado: "SP", telefone: "(11) 4003-0022", email: "varejo@totvs.com.br", preco_referencia: 8500, produto_servico: "Sistema de gestão de lojas, estoque e integração e-commerce para operações Nike Store Brasil" },
    { nome: "DHL Supply Chain Brasil", cidade: "Barueri", estado: "SP", telefone: "(11) 4133-8000", email: "scm@dhl.com.br", preco_referencia: 0, produto_servico: "Logística e distribuição — armazém central SP para 220 lojas e e-commerce Nike Brasil" },
    { nome: "Cia. de Tecidos Norte de Minas", cidade: "Montes Claros", estado: "MG", telefone: "(38) 3229-2000", email: "comercial@coteminas.com.br", preco_referencia: 42, produto_servico: "Tecidos técnicos Dri-FIT e Therma para vestuário esportivo produzido localmente" },
  ],
  praticas: [
    { titulo: "SNKRS Drops: escassez como motor de desejo", conteudo: "Lançamentos exclusivos no app SNKRS com estoque limitado geram filas virtuais de 400k usuários. Sneakers com estoque de 5k pares criam buzz orgânico equivalente a R$ 12mi em mídia. Exclusividade percebida aumenta disposição a pagar em 3.2x.", fonte: "Nike Inc. Earnings Report Q3/2025" },
    { titulo: "Direct-to-Consumer: margem 40% maior que atacado", conteudo: "Nike Direct (app + site + lojas próprias) representa 45% da receita e 60% da margem. DTC elimina intermediários e captura dados do consumidor — cada transação direta vale 3x mais dados que o atacado.", fonte: "Nike Annual Report 2025" },
    { titulo: "Comunidade de Corrida: aquisição com custo zero", conteudo: "Nike Run Club com 80mi usuários globais é o maior canal de aquisição de atletas. Corredores que usam o app compram 2.3x mais tênis por ano e têm churn 60% menor. Custo de aquisição via NRC: R$ 0.", fonte: "SportIntelligence Digital 2025" },
    { titulo: "Collabs com Artistas: ROI de 8x em awareness", conteudo: "Colaborações com Travis Scott, Off-White e Fear of God elevaram o AFF (Average Footwear Footprint) de 18-24 anos em 34%. Uma collab bem executada gera ROI de awareness 8x maior que campanha de mídia equivalente.", fonte: "Business of Fashion 2025" },
    { titulo: "Sustentabilidade Move to Zero: 28% das vendas influenciadas", conteudo: "28% dos consumidores brasileiros de 18-35 anos escolhem Nike parcialmente pelo compromisso Move to Zero. Tênis com material reciclado reciclado têm NPS 12pts maior e menor devolução nas lojas próprias.", fonte: "GreenPrint Consumer Survey 2025" },
  ],
  previsao_clima: CLIMA_SP,
  gamificacao_log: [
    { acao: "Meta de Sell-through Semanal Atingida", pontos: 200 },
    { acao: "NPS de Loja Acima de 75", pontos: 150 },
    { acao: "Zero Stockout em Itens Core", pontos: 100 },
  ],
  pesquisa: { resumo: "Mercado de artigos esportivos no Brasil movimentou R$ 21bi em 2025. São Paulo concentra 42% das vendas premium. Tênis running e lifestyle respondem por 68% das vendas de calçados esportivos. Tendência dominante: athleisure — 74% dos tênis esportivos são usados fora da prática de esportes. Ticket médio: R$ 380–820." },
  timeline: [
    { id: '1', data: '05 Mai', tipo: 'concorrente', icone: '⚡', titulo: 'New Balance 990v6 esgotou em 72h no Brasil', detalhe: 'O 990v6 Made in USA atingiu sold-out em todas as plataformas em 72h após lançamento — 4.200 pares vendidos. Preço médio revendido no mercado secundário: R$ 2.800 (+55% do MSRP). Oportunidade: intensificar drops exclusivos SNKRS para capturar demanda por exclusividade.' },
    { id: '2', data: '03 Mai', tipo: 'mercado', icone: '📈', titulo: 'Athleisure cresce 31% no Brasil em 2025', detalhe: 'Categoria athleisure (tênis fora do esporte) cresceu 31% YoY — maior crescimento da última década. SP e RJ concentram 58% das vendas premium. Consumidor de 22-35 anos usa tênis "de academia" no dia a dia 5 dias por semana.' },
    { id: '3', data: '01 Mai', tipo: 'mercado', icone: '🌊', titulo: 'Shopee entra no segmento de tênis esportivos com preços 70% abaixo', detalhe: 'Shopee lançou campanha agressiva de tênis "esportivos" importados da China a partir de R$ 59. Segmento afetado: entrada de mercado (classes C/D). Risco de canibalização: baixo para Nike (premium), mas monitore percepção de valor da categoria.' },
    { id: '4', data: '28 Abr', tipo: 'fornecedor', icone: '📦', titulo: 'Alpargatas reajustou custo de produção local em 12%', detalhe: 'Reajuste de 12% motivado por alta do algodão e câmbio. Impacto estimado nas margens de produtos produzidos localmente: -2.1 p.p. Alternativa avaliada: aumentar importação direta da Ásia em 15% para compensar custo.' },
    { id: '5', data: '25 Abr', tipo: 'concorrente', icone: '🏪', titulo: 'Adidas abriu megastore de 1.200m² na Oscar Freire', detalhe: 'Adidas inaugura sua maior loja da América Latina na Oscar Freire com experiência imersiva e personalização de produtos na hora. Investimento: R$ 18mi. Localização estratégica a 600m da Nike Flagship. Monitore fluxo de clientes na própria loja nas próximas 4 semanas.' },
  ],
};

const NUBANK_DATA: OmniData = {
  negocio: { nome_fantasia: "Nubank", segmento: "Fintech & Banco Digital", cidade: "São Paulo", estado: "SP", telefone: "(11) 4003-3271", nivel: 5, pontos: 4900 },
  semana_label: "Semana de 06 de Maio de 2026",
  mercado_nome: "Banco Digital & Serviços Financeiros",
  mercado_tamanho: "R$ 3.2bi/mês no Brasil",
  ranking_local: 1, progresso_pct: 98, nivel_label: "Maior Fintech da América Latina", pontos_proximo: 5000,
  concorrentes: [
    { nome: "Itaú Unibanco", nota_google: 3.6, endereco: "Praça Alfredo Egydio de Souza Aranha, 100 — Vila Olímpia", cidade: "São Paulo", faixa_preco: "$$$", proposta_principal: "Maior banco privado da América Latina com ecossistema financeiro completo", diferencial: "Credibilidade institucional de 100 anos, rede de agências e cofre de dados únicos", faz_bem: ["Crédito corporativo", "Private banking", "Rede de agências"], nao_oferece: ["UX digital de ponta", "Zero tarifas", "Atendimento humanizado rápido"], mudancas_recentes: ["Lançou íon como super app financeiro", "Adquiriu participação na XP"], notas_digitais: [{ plataforma: "Google", nota: 3.6 }, { plataforma: "Reclame Aqui", nota: 6.2 }] },
    { nome: "Banco Inter", nota_google: 3.8, endereco: "Av. Barbacena, 1219 — Belo Horizonte", cidade: "Belo Horizonte", faixa_preco: "$", proposta_principal: "Super app financeiro com conta digital, corretora, marketplace e cashback", diferencial: "Ecossistema mais completo entre digitais — do crédito ao shopping em um só app", faz_bem: ["Cashback Inter Loop", "Investimentos integrados", "Conta global em dólar"], nao_oferece: ["Cartão de crédito premium Black agressivo", "UX tão fluido quanto Nubank", "Identidade de marca forte"], mudancas_recentes: ["Lançou Inter & Co nos EUA com conta em dólar", "Atingiu 35mi clientes"], notas_digitais: [{ plataforma: "Google", nota: 3.8 }, { plataforma: "Reclame Aqui", nota: 7.1 }] },
    { nome: "C6 Bank", nota_google: 3.9, endereco: "Av. Chedid Jafet, 75 — Vila Olímpia", cidade: "São Paulo", faixa_preco: "$$", proposta_principal: "Banco digital com cartão de crédito premium e programa de pontos Carbon", diferencial: "Cartão Carbon com câmbio zero e pontos para milhas — atinge viajantes frequentes premium", faz_bem: ["Cartão Carbon (câmbio zero)", "Milhas Carbon", "App robusto"], nao_oferece: ["Marca icônica", "Base massiva de usuários", "Pricing agressivo no básico"], mudancas_recentes: ["JP Morgan elevou participação para 40%", "Lançou C6 Pay para pagamentos NFC avançados"], notas_digitais: [{ plataforma: "Google", nota: 3.9 }] },
    { nome: "Mercado Pago", nota_google: 3.7, endereco: "Av. das Nações Unidas, 3.003 — Bonfim", cidade: "Osasco", faixa_preco: "$", proposta_principal: "Carteira digital integrada ao Mercado Livre com crédito instantâneo e maquininha", diferencial: "Ecossistema Mercado Livre — 60mi compradores cativos que já têm o app instalado", faz_bem: ["Integração MercadoLivre", "Maquininha acessível", "Crédito para vendedores"], nao_oferece: ["Conta corrente completa", "Cartão de crédito premium", "Investimentos"], mudancas_recentes: ["Lançou Mercado Pago Conta para PJ com CDB 105% CDI", "Expandiu maquininha Point Smart 3"], notas_digitais: [{ plataforma: "Google", nota: 3.7 }, { plataforma: "Reclame Aqui", nota: 6.8 }] },
    { nome: "PicPay", nota_google: 3.5, endereco: "Av. Brigadeiro Faria Lima, 4300 — Itaim Bibi", cidade: "São Paulo", faixa_preco: "$", proposta_principal: "Carteira digital P2P com super app financeiro e marketplace", diferencial: "Pioneiro em P2P no Brasil — base instalada de 35mi usuários com hábito de transferência social", faz_bem: ["Transferências P2P", "PicPay Store cashback", "Recarga de celular"], nao_oferece: ["Cartão Black premium", "Investimentos robustos", "PJ completo"], mudancas_recentes: ["Lançou PicPay Business com maquininha", "Atingiu R$ 1bi em crédito pessoal"], notas_digitais: [{ plataforma: "Google", nota: 3.5 }, { plataforma: "Reclame Aqui", nota: 5.9 }] },
    { nome: "Bradesco Next", nota_google: 3.4, endereco: "Cidade de Deus — Osasco", cidade: "Osasco", faixa_preco: "$$", proposta_principal: "Conta digital do Bradesco para jovens com UX moderno e zero tarifas", diferencial: "Credibilidade do Bradesco (100 anos) com experiência digital — bridge para classe média", faz_bem: ["Confiança Bradesco", "Zero tarifa básica", "Crédito fácil"], nao_oferece: ["Identidade própria forte", "NPS competitivo", "Inovação de produto"], mudancas_recentes: ["Rebranding visual em jan/2026", "Integração com carteira Bradesco Pay"], notas_digitais: [{ plataforma: "Google", nota: 3.4 }, { plataforma: "Reclame Aqui", nota: 5.1 }] },
  ],
  fornecedores: [
    { nome: "Mastercard International", cidade: "São Paulo", estado: "SP", telefone: "(11) 3848-5900", email: "parceiros@mastercard.com", preco_referencia: 0, produto_servico: "Rede de pagamentos e infraestrutura de cartão de crédito/débito para todos os produtos Nubank" },
    { nome: "Amazon Web Services (AWS)", cidade: "São Paulo", estado: "SP", telefone: "(11) 3958-2000", email: "aws-br@amazon.com", preco_referencia: 0, produto_servico: "Infraestrutura cloud — 100% da operação Nubank roda em AWS com multi-AZ no Brasil" },
    { nome: "Serasa Experian Brasil", cidade: "São Paulo", estado: "SP", telefone: "(11) 3003-4747", email: "financeiro@serasa.com.br", preco_referencia: 0, produto_servico: "Bureau de crédito — score, histórico e dados para análise de risco de concessão de crédito" },
    { nome: "Conductor Tecnologia", cidade: "São Paulo", estado: "SP", telefone: "(11) 3040-4060", email: "sales@conductor.com.br", preco_referencia: 0, produto_servico: "Processamento de transações e gestão do programa de cartões de crédito Nubank" },
    { nome: "Dock (ex-Conductor Pay)", cidade: "São Paulo", estado: "SP", telefone: "(11) 3847-7200", email: "parceiros@dock.tech", preco_referencia: 0, produto_servico: "Banking-as-a-Service para emissão de cartões, contas e infraestrutura de pagamentos Pix" },
  ],
  praticas: [
    { titulo: "NPS como religião: 80+ sustentado por 8 anos", conteudo: "Nubank mantém NPS médio de 83 — 40 pontos acima dos bancos tradicionais. Cada ponto de NPS equivale a R$ 45mi em receita via indicação. O programa de indicação gerou 38% dos novos clientes em 2024 com custo de aquisição zero.", fonte: "Nubank Investor Relations 2025" },
    { titulo: "Crédito com IA: inadimplência 2.1% vs 4.8% do setor", conteudo: "Modelo de crédito proprietário com 3.200 variáveis comportamentais mantém inadimplência em 2.1% — metade da média do setor. Cada 0.1% de redução na inadimplência equivale a R$ 180mi de provisão liberada.", fonte: "Banco Central do Brasil — Relatório de Estabilidade 2025" },
    { titulo: "Ultravioleta: halo effect no Roxinho", conteudo: "Cartão Nubank Ultravioleta (R$ 49/mês) elevou receita por cliente em 280%. O halo effect: clientes com Ultravioleta usam 4.2x mais produtos Nubank vs básicos. Ticket médio de crédito: R$ 28.000 vs R$ 4.200 do básico.", fonte: "Nubank Product Report 2025" },
    { titulo: "Expansão LATAM: México e Colômbia como alavanca", conteudo: "México (Nu México) com 8.2mi clientes e Colômbia com 1.4mi — operações fora do Brasil crescem 180% YoY. Custo de aquisição 60% menor que no Brasil em 2019. Template replicável para mais 4 países até 2027.", fonte: "Nu Holdings Annual Report 2025" },
    { titulo: "Anti-banco: posicionamento anti-fee como moat", conteudo: "Zero tarifa de manutenção, zero anuidade no básico e atendimento 24h via chat geraram 'antipatia transferida' — clientes Nubank têm 3.4x mais chances de recomendar a amigos do que clientes de bancos tradicionais.", fonte: "Kantar BrandZ Brasil 2025" },
  ],
  previsao_clima: CLIMA_SP,
  gamificacao_log: [
    { acao: "Meta de NPS Mensal Superada", pontos: 200 },
    { acao: "Recorde de Novos Clientes na Semana", pontos: 150 },
    { acao: "Zero Reclamações no Reclame Aqui", pontos: 100 },
  ],
  pesquisa: { resumo: "Fintechs brasileiras captaram R$ 4.2bi em investimentos em 2025. O Nubank já tem 92mi clientes globais — maior banco digital do mundo fora da China. Brasil tem 8.4mi desbancarizados ainda a capturar. Pix processa R$ 5.2 trilhões/mês. Open Finance tem 42mi consentimentos ativos. Margem líquida dos bancos digitais: 18-24% vs 12% dos tradicionais." },
  timeline: [
    { id: '1', data: '05 Mai', tipo: 'concorrente', icone: '⚡', titulo: 'Itaú lançou íon com carteira de investimentos integrada', detalhe: 'Itaú relançou o app íon com corretora, CDB, fundos e previdência integrados em UI redesenhada. Investimento: R$ 2.1bi em tecnologia. Risco: aproxima UX do Itaú ao padrão Nubank. Diferencial Nubank: NPS 40pts acima, sem agências e sem tarifas escondidas.' },
    { id: '2', data: '03 Mai', tipo: 'mercado', icone: '📈', titulo: 'Banco Central aprovou Open Finance fase 4 — dados de investimentos', detalhe: 'Fase 4 do Open Finance libera portabilidade de dados de investimentos entre instituições. Oportunidade: atrair clientes com investimentos em bancos tradicionais para o Nubank com proposta de taxas menores e UX superior.' },
    { id: '3', data: '01 Mai', tipo: 'mercado', icone: '🌊', titulo: 'Pix por aproximação (NFC) aprovado pelo Banco Central', detalhe: 'BC aprovou Pix NFC — pagamento por aproximação sem app aberto. Lançamento previsto para Q3/2026. Nubank já tem infraestrutura preparada. Será o primeiro grande banco a ativar o recurso nativamente no app.' },
    { id: '4', data: '28 Abr', tipo: 'fornecedor', icone: '📦', titulo: 'AWS anunciou nova região no Brasil com latência 40% menor', detalhe: 'AWS inaugurou AZ adicional em Campinas (SP) reduzindo latência de 28ms para 17ms nas transações. Impacto na operação Nubank: 15% de redução no tempo de resposta das APIs de pagamento — experiência mais rápida no app.' },
    { id: '5', data: '25 Abr', tipo: 'concorrente', icone: '🏪', titulo: 'Inter atingiu 35mi clientes com super app completo', detalhe: 'Banco Inter divulgou 35mi clientes ativos com o super app — marketplace, câmbio, investimentos e seguro em um só lugar. Crescimento de 4.2mi clientes em 6 meses. Monitorar especialmente a proposta de câmbio zero para viajantes, que compete com o Nubank Travel.' },
  ],
};

const IFOOD_DATA: OmniData = {
  negocio: { nome_fantasia: "iFood", segmento: "Delivery & Foodtech", cidade: "Osasco", estado: "SP", telefone: "(11) 3074-2600", nivel: 5, pontos: 4850 },
  semana_label: "Semana de 06 de Maio de 2026",
  mercado_nome: "Delivery de Alimentação & Foodtech",
  mercado_tamanho: "R$ 1.5bi/mês no Brasil",
  ranking_local: 1, progresso_pct: 97, nivel_label: "Líder Absoluto de Delivery", pontos_proximo: 5000,
  concorrentes: [
    { nome: "Rappi Brasil", nota_google: 3.8, endereco: "Av. Brigadeiro Faria Lima, 4300 — Itaim Bibi", cidade: "São Paulo", faixa_preco: "$$", proposta_principal: "Super app de delivery com mercado, remédios, conveniência e dinheiro em 10min", diferencial: "Vertical de conveniência (RappiTurbo 10min) e Turbo Pay — além de comida", faz_bem: ["Entrega ultrarrápida de conveniência", "Rappi Prime assinatura", "Diversidade de verticais"], nao_oferece: ["Market share de comida > 15%", "Lucratividade", "Escala nacional consolidada"], mudancas_recentes: ["Lançou Turbo para farmácias em 25 cidades", "Softbank injetou US$ 500mi"], notas_digitais: [{ plataforma: "Google", nota: 3.8 }, { plataforma: "Reclame Aqui", nota: 5.4 }] },
    { nome: "Uber Eats Brasil", nota_google: 3.9, endereco: "Av. Faria Lima, 3477 — Itaim Bibi", cidade: "São Paulo", faixa_preco: "$$", proposta_principal: "Delivery de comida integrado ao app Uber com base de usuários de transporte", diferencial: "Cross-sell com Uber: usuário do carro vira usuário de comida com fricção zero", faz_bem: ["Base de usuários Uber", "Integração de conta única", "Cobertura em cidades médias"], nao_oferece: ["Domínio de mercado", "Logística própria", "App específico de delivery"], mudancas_recentes: ["Integrou Uber One com iFood rival: R$ 19,90/mês com desconto em ambos", "Expandiu para 80 cidades no interior"], notas_digitais: [{ plataforma: "Google", nota: 3.9 }, { plataforma: "Reclame Aqui", nota: 6.1 }] },
    { nome: "Zé Delivery", nota_google: 4.1, endereco: "R. Dr. Renato Paes de Barros, 1017 — Itaim Bibi", cidade: "São Paulo", faixa_preco: "$$", proposta_principal: "Delivery de bebidas geladas em 30min com preço de supermercado", diferencial: "Nicho único: bebidas geladas em 30min via distribuidores Ambev — sem competição direta", faz_bem: ["Bebidas geladas em 30min", "Preço competitivo", "Cobertura nacional via Ambev"], nao_oferece: ["Comida", "Conveniência geral", "Farmácia"], mudancas_recentes: ["Expandiu para 800 cidades com rede Ambev", "Lançou Zé+ com assinatura de bebidas"], notas_digitais: [{ plataforma: "Google", nota: 4.1 }] },
    { nome: "Getir Brasil", nota_google: 3.7, endereco: "Av. Paulista, 1000 — Bela Vista", cidade: "São Paulo", faixa_preco: "$$$", proposta_principal: "Conveniência ultrarrápida em 10min via dark stores próprias em SP", diferencial: "Dark stores próprias garantem controle de estoque e entrega em 10min sem depender de parceiros", faz_bem: ["10min garantidos", "Estoque próprio", "App ultra-simplificado"], nao_oferece: ["Comida de restaurantes", "Cobertura nacional", "Preço competitivo"], mudancas_recentes: ["Encerrou operações no RJ por falta de escala", "Recebeu aporte de US$ 120mi"], notas_digitais: [{ plataforma: "Google", nota: 3.7 }] },
    { nome: "James Delivery (Grupo Bom Prato)", nota_google: 3.6, endereco: "Curitiba", estado: "PR", cidade: "Curitiba", faixa_preco: "$", proposta_principal: "Delivery regional no Sul com foco em restaurantes locais e preço sem anuidade", diferencial: "Única plataforma sem taxa de entrega para restaurantes no Sul — atrai o restaurante local", faz_bem: ["Zero taxa de cadastro", "Foco regional Sul", "Restaurantes independentes"], nao_oferece: ["Cobertura nacional", "App refinado", "Volume de pedidos"], mudancas_recentes: ["Expandiu para Florianópolis e Joinville", "Parceria com rede de farmácias do Sul"], notas_digitais: [{ plataforma: "Google", nota: 3.6 }] },
  ],
  fornecedores: [
    { nome: "Movile (controlador iFood)", cidade: "Campinas", estado: "SP", telefone: "(19) 3776-5000", email: "ir@movile.com", preco_referencia: 0, produto_servico: "Holding controladora — capital, estratégia e participação de 55% no iFood" },
    { nome: "Prosus / Naspers", cidade: "Amsterdam", estado: "NL", telefone: "+31 20 001 0001", email: "ir@prosus.com", preco_referencia: 0, produto_servico: "Investidor estratégico com 37% do iFood — capital para expansão LATAM" },
    { nome: "Loggi", cidade: "São Paulo", estado: "SP", telefone: "(11) 3230-2801", email: "parceiros@loggi.com", preco_referencia: 0, produto_servico: "Infraestrutura de última milha — entregadores e rotas otimizadas para iFood Flash" },
    { nome: "Totvs (PDV Restaurantes)", cidade: "São Paulo", estado: "SP", telefone: "(11) 4003-0022", email: "gastronomia@totvs.com.br", preco_referencia: 280, produto_servico: "Sistema de PDV e integração com iFood para 180k restaurantes parceiros no Brasil" },
    { nome: "Google Cloud (IA de recomendação)", cidade: "São Paulo", estado: "SP", telefone: "(11) 2395-9000", email: "cloud@google.com.br", preco_referencia: 0, produto_servico: "IA de recomendação de restaurantes e previsão de demanda — motor do feed personalizado" },
  ],
  praticas: [
    { titulo: "iFood Card: assinatura como moat de retenção", conteudo: "iFood Card (R$ 9,90/mês) gera frequência 3.8x maior que usuários sem assinatura. Assinantes fazem 11 pedidos/mês vs 2.9 dos não-assinantes. A assinatura elimina a decisão de 'qual app usar' — cria hábito automático.", fonte: "iFood Business Review 2025" },
    { titulo: "Dark Kitchens: margem 40% maior que restaurante físico", conteudo: "Cozinhas iFood (dark kitchens) têm custo operacional 42% menor que restaurante físico e margem 40% maior. Restaurante virtual pode operar 3 marcas distintas na mesma cozinha, maximizando ROI por m².", fonte: "Abrasel Foodtech Report 2025" },
    { titulo: "Push notification no horário do fome: CTR de 38%", conteudo: "Push notifications enviados entre 11h-11h30 (pré-almoço) e 17h30-18h (pré-jantar) têm CTR de 38% — 4x a média de outros horários. Segmentação por última categoria pedida aumenta conversão em 2.2x.", fonte: "Adjust Mobile Insights 2025" },
    { titulo: "Cashback como motor de LTV: ROI de 12x", conteudo: "Programa de cashback em supermercados iFood elevou LTV médio em 58%. Usuário com cashback ativo tem churn 73% menor. Cada R$ 1 investido em cashback gera R$ 12 em receita incremental via pedidos adicionais.", fonte: "iFood Growth Report 2025" },
    { titulo: "Restaurante Parceiro Premium: conversão 2.8x maior", conteudo: "Restaurantes com badge iFood Premium (NPS > 70, entrega < 35min) têm conversão 2.8x maior no feed. A plataforma prioriza esses no algoritmo de recomendação — feedback loop que melhora qualidade do ecossistema.", fonte: "iFood Partner Success 2025" },
  ],
  previsao_clima: CLIMA_SP,
  gamificacao_log: [
    { acao: "Recorde de Pedidos por Hora Atingido", pontos: 200 },
    { acao: "NPS de Restaurantes Parceiros > 72", pontos: 150 },
    { acao: "SLA de Entrega < 35min Sustentado", pontos: 100 },
  ],
  pesquisa: { resumo: "Mercado de delivery de comida no Brasil movimentou R$ 18bi em 2025. iFood detém 83% do market share em pedidos online. Delivery já representa 31% das vendas de fast food. Cidades acima de 100k habitantes têm penetração de 42%. Ticket médio por pedido: R$ 62. Frequência média: 3.2 pedidos/mês por usuário ativo. Taxa de comissão média: 25-27%." },
  timeline: [
    { id: '1', data: '05 Mai', tipo: 'mercado', icone: '📈', titulo: 'iFood atinge 80mi pedidos em abril — recorde histórico', detalhe: '80mi pedidos em abril/2026 — crescimento de 18% YoY. SP e RJ concentram 48% do volume. Categoria que mais cresceu: mercado e conveniência (+67% YoY). Oportunidade: expandir iFood Mercado para mais 50 cidades até Q3/2026.' },
    { id: '2', data: '03 Mai', tipo: 'concorrente', icone: '⚡', titulo: 'Rappi lançou RappiTurbo para farmácias em 25 cidades', detalhe: 'Rappi expandiu entrega ultrarrápida (10min) para farmácias em 25 cidades brasileiras. Risco: canibaliza vertical de conveniência iFood. Ação recomendada: acelerar integração com redes de farmácia via iFood Saúde.' },
    { id: '3', data: '01 Mai', tipo: 'mercado', icone: '🌊', titulo: 'Anvisa regulamentou entrega de medicamentos por apps', detalhe: 'Anvisa publicou RDC aprovando delivery de medicamentos isentos por plataformas digitais. Mercado estimado: R$ 2.4bi/ano. iFood Saúde pode capturar 15-20% com parceria com redes farmacêuticas já integradas.' },
    { id: '4', data: '28 Abr', tipo: 'fornecedor', icone: '📦', titulo: 'Loggi reajustou preços de entrega em +11%', detalhe: 'Loggi anunciou reajuste de 11% no custo de última milha para plataformas digitais, motivado por alta do combustível e remuneração mínima dos entregadores. Impacto: +R$ 0,40-0,70 por pedido iFood Flash. Avaliar absorção parcial vs repasse.' },
    { id: '5', data: '25 Abr', tipo: 'concorrente', icone: '🏪', titulo: 'Uber Eats integrou Uber One com desconto cruzado', detalhe: 'Uber One (R$ 19,90/mês) passou a incluir desconto em Uber Eats e Uber simultaneamente. Estratégia: usar base de 38mi usuários Uber para migrar para delivery. Monitor de impacto: penetração Uber Eats em SP cresceu 4 p.p. no último trimestre.' },
  ],
};

const AMBEV_DATA: OmniData = {
  negocio: { nome_fantasia: "Ambev", segmento: "Bebidas & FMCG", cidade: "São Paulo", estado: "SP", telefone: "(11) 2122-1313", nivel: 5, pontos: 4820 },
  semana_label: "Semana de 06 de Maio de 2026",
  mercado_nome: "Bebidas Alcoólicas & Não Alcoólicas",
  mercado_tamanho: "R$ 8.5bi/mês no Brasil",
  ranking_local: 1, progresso_pct: 96, nivel_label: "Líder Absoluto de Bebidas", pontos_proximo: 5000,
  concorrentes: [
    { nome: "Heineken Brasil", nota_google: 4.3, endereco: "Av. Dr. Gastão Vidigal, 1946 — Vila Leopoldina", cidade: "São Paulo", faixa_preco: "$$$", proposta_principal: "Premium internacional com cerveja verde icônica e portfólio aspiracional", diferencial: "Posicionamento premium aspiracional — copo de Heineken vira símbolo de status em eventos", faz_bem: ["Posicionamento premium", "Patrocínio Champions League", "Amstel para segmento médio"], nao_oferece: ["Escala de preço popular", "Cachaça / destilados", "Soft drinks"], mudancas_recentes: ["Adquiriu Devassa e Eisenbahn", "Lançou Heineken Silver para segmento intermediário"], notas_digitais: [{ plataforma: "Euromonitor", nota: 4.3 }] },
    { nome: "Grupo Petrópolis (Itaipava)", nota_google: 3.8, endereco: "Petrópolis", estado: "RJ", cidade: "Petrópolis", faixa_preco: "$", proposta_principal: "Cerveja brasileira popular com foco em preço e capilaridade no interior", diferencial: "Melhor preço no segmento popular — domina bares e mercearias do interior", faz_bem: ["Preço imbatível", "Distribuição capilar interior", "Itaipava como marca de verão"], nao_oferece: ["Portfólio premium", "Exportação", "Soft drinks"], mudancas_recentes: ["Pediu recuperação judicial por dívida de R$ 5bi", "Vendeu fábricas para quitar dívida"], notas_digitais: [{ plataforma: "Euromonitor", nota: 3.8 }] },
    { nome: "Diageo Brasil", nota_google: 4.5, endereco: "Av. das Nações Unidas, 12995 — Brooklin", cidade: "São Paulo", faixa_preco: "$$$$", proposta_principal: "Destilados premium globais — Johnnie Walker, Smirnoff, Tanqueray, Baileys", diferencial: "Portfólio de marcas icônicas que o consumidor pede pelo nome, não pela categoria", faz_bem: ["Whisky premium (JW)", "Rum Capitão Morgan", "Gin Tanqueray"], nao_oferece: ["Cerveja", "Soft drinks", "Bebidas populares"], mudancas_recentes: ["Lançou JW Blue Label edição especial Brasil", "Parceria com bares premium em SP e RJ"], notas_digitais: [{ plataforma: "Euromonitor", nota: 4.5 }] },
    { nome: "Coca-Cola Brasil (SPAL)", nota_google: 4.2, endereco: "Av. Morumbi, 8234 — Morumbi", cidade: "São Paulo", faixa_preco: "$$", proposta_principal: "Refrigerantes, sucos e águas — portfólio de soft drinks líder global", diferencial: "Marca mais reconhecida do mundo em soft drinks — penetração de 98% nos pontos de venda", faz_bem: ["Coca-Cola clássica", "Distribução capilar", "Sprite e Fanta"], nao_oferece: ["Cerveja", "Destilados", "Bebidas alcoólicas"], mudancas_recentes: ["Lançou Coca-Cola com Café no Brasil", "Adquiriu marca de água de coco Kero Coco"], notas_digitais: [{ plataforma: "Euromonitor", nota: 4.2 }] },
    { nome: "San Juan (Cachaça 51)", nota_google: 3.6, endereco: "Pirassununga", estado: "SP", cidade: "Pirassununga", faixa_preco: "$", proposta_principal: "Cachaça industrializada líder com foco em caipirinha e consumo popular", diferencial: "Cachaça 51 é a bebida destilada mais vendida do mundo — domina segmento nacional de caipirinha", faz_bem: ["Escala de produção", "Preço popular", "Distribuição nacional"], nao_oferece: ["Cachaça premium artesanal", "Exportação sofisticada", "Posicionamento aspiracional"], mudancas_recentes: ["Lançou 51 Zero Açúcar para público fitness", "Retomou exportação para EUA via Brazilian Spirits"], notas_digitais: [{ plataforma: "Euromonitor", nota: 3.6 }] },
  ],
  fornecedores: [
    { nome: "Cevada Barke — Cooperativa SP/MG", cidade: "Ribeirão Preto", estado: "SP", telefone: "(16) 3610-2200", email: "grãos@cooperativa-barke.com.br", preco_referencia: 1.85, produto_servico: "Cevada malteada — principal insumo para cervejas Brahma, Skol e Antarctica (65% da produção nacional)" },
    { nome: "Owens-Illinois (Vidros)", cidade: "Jacareí", estado: "SP", telefone: "(12) 3953-3000", email: "comercial@o-i.com", preco_referencia: 0.42, produto_servico: "Garrafas de vidro para toda a linha Ambev — 2.8 bilhões de unidades/ano" },
    { nome: "Crown Holdings (Latas)", cidade: "Extrema", estado: "MG", telefone: "(35) 3439-4000", email: "brasil@crowncork.com", preco_referencia: 0.18, produto_servico: "Latas de alumínio para Brahma, Skol, Budweiser e Colorado — principal embalagem de crescimento" },
    { nome: "Ambev Logística (Própria)", cidade: "São Paulo", estado: "SP", telefone: "(11) 2122-1500", email: "logistica@ambev.com.br", preco_referencia: 0, produto_servico: "Frota própria de 8.200 caminhões — distribuição direta para 1.2mi pontos de venda no Brasil" },
    { nome: "Ecolab Brasil (Higiene Industrial)", cidade: "São Paulo", estado: "SP", telefone: "(11) 4196-9600", email: "industrial@ecolab.com.br", preco_referencia: 12, produto_servico: "Higiene e sanitização das 36 cervejarias Ambev no Brasil — padrão global de qualidade" },
  ],
  praticas: [
    { titulo: "Perfect Store: o ponto de venda como mídia", conteudo: "O programa Perfect Store Ambev avalia 180 critérios por ponto de venda — geladeira, disposição, preço e material de PDV. Bares com nota > 85 têm sell-out 38% maior. Cada 1 ponto no score equivale a +0.4% de market share local.", fonte: "Ambev Trade Marketing Report 2025" },
    { titulo: "Zé Delivery: canal D2C com margem 28% maior", conteudo: "Zé Delivery (plataforma própria) elimina dois intermediários na cadeia — distribuidor e varejista. Margem por litro vendido é 28% maior via Zé vs canal tradicional. 800 cidades cobertas em 2025 com 30min de entrega.", fonte: "Ambev Digital Channels 2025" },
    { titulo: "Share of Throat: presença no momento do consumo", conteudo: "Ambev usa dados de consumo por horário e ocasião para mapear 'share of throat'. Patrocínio de eventos de domingo à tarde captura 62% das ocasiões de churrasco — momento de maior consumo per capita. ROI de patrocínio: 5.8x em sell-out pós-evento.", fonte: "Nielsen Beverage Panel Brasil 2025" },
    { titulo: "Colorado e Wäls: premiumização como alavanca de margem", conteudo: "Cervejas premium e artesanais (Colorado, Wäls, Serramalte) têm margem 3.2x maior que Skol/Brahma. Crescimento de 41% YoY no segmento craft dentro da Ambev. Estratégia: usar distribuição Ambev para escalar marcas premium.", fonte: "Ambev Earnings Q4/2025" },
    { titulo: "Dados de CRM para trade: 18% de aumento no sell-out", conteudo: "CRM de bares com histórico de pedidos, sazonalidade e mix ideal gerou 18% de aumento no sell-out quando revendedores recebem sugestão de pedido personalizada. Algoritmo roda em 420k pontos de venda cadastrados.", fonte: "Ambev Data & Analytics 2025" },
  ],
  previsao_clima: CLIMA_SP,
  gamificacao_log: [
    { acao: "Meta de Volume Semanal Superada", pontos: 200 },
    { acao: "Perfect Store Score > 88 na Região", pontos: 150 },
    { acao: "Zero Devolução por Qualidade na Semana", pontos: 100 },
  ],
  pesquisa: { resumo: "Mercado de bebidas no Brasil movimentou R$ 102bi em 2025. Ambev detém 67% do mercado de cervejas. Segmento premium cresce 28% ao ano — 4x mais rápido que o popular. Consumo de cerveja per capita: 68 litros/ano. Bebidas sem álcool crescem 19% impulsionadas por geração Z. Canais digitais (Zé Delivery, iFood Bebidas) já representam 12% do volume Ambev." },
  timeline: [
    { id: '1', data: '05 Mai', tipo: 'concorrente', icone: '⚡', titulo: 'Heineken lançou Silver para atacar segmento médio Skol', detalhe: 'Heineken Silver posicionada a R$ 4,20 a lata — 30% abaixo da Heineken original e 15% acima da Skol. Ataca diretamente o segmento de transição da Ambev. Ação recomendada: fortalecer Brahma Extra e Original como alternativa premium acessível.' },
    { id: '2', data: '03 Mai', tipo: 'mercado', icone: '📈', titulo: 'Vendas de cerveja crescem 14% na entrada do verão', detalhe: 'Temperatura acima da média em maio antecipou pico de consumo. Volume de cerveja em SP cresceu 14% vs mesmo período de 2025. Zé Delivery registrou recorde de pedidos em domingo — 4.2mi pedidos em um único dia.' },
    { id: '3', data: '01 Mai', tipo: 'mercado', icone: '🌊', titulo: 'Geração Z reduz consumo de álcool — sober curious cresce 31%', detalhe: 'Pesquisa Kantar: 31% dos consumidores de 18-25 anos reduziram consumo de álcool em 2025. Oportunidade: Guaraná Antarctica Zero e linha Ambev sem álcool — segmento que já cresce 19% YoY dentro do portfólio.' },
    { id: '4', data: '28 Abr', tipo: 'fornecedor', icone: '📦', titulo: 'Cevada com reajuste de 9% por seca no RS', detalhe: 'Seca no Rio Grande do Sul reduziu colheita de cevada em 22%. Fornecedores anunciaram reajuste de 9% a partir de jun/2026. Impacto estimado: +R$ 0,03 por litro de cerveja produzido. Estoque estratégico de 4 meses já ativado.' },
    { id: '5', data: '25 Abr', tipo: 'concorrente', icone: '🏪', titulo: 'Grupo Petrópolis em recuperação judicial — janela de market share', detalhe: 'Grupo Petrópolis (Itaipava, Crystal, Petra) entrou em recuperação judicial com dívida de R$ 5.3bi. Distribuidores do interior estão migrando para Ambev. Janela estimada: 6 meses para capturar 3-4 p.p. de market share no segmento popular.' },
  ],
};

const MAGALU_DATA: OmniData = {
  negocio: { nome_fantasia: "Magazine Luiza", segmento: "Varejo & E-commerce", cidade: "Franca", estado: "SP", telefone: "(11) 3504-2000", nivel: 5, pontos: 4750 },
  semana_label: "Semana de 06 de Maio de 2026",
  mercado_nome: "Varejo Omnichannel & E-commerce",
  mercado_tamanho: "R$ 15bi/mês no Brasil",
  ranking_local: 1, progresso_pct: 95, nivel_label: "Líder Omnichannel", pontos_proximo: 5000,
  concorrentes: [
    { nome: "Mercado Livre Brasil", nota_google: 4.1, endereco: "Av. das Nações Unidas, 3.003 — Bonfim", cidade: "Osasco", faixa_preco: "$$", proposta_principal: "Maior marketplace da América Latina com fintech e logística integradas", diferencial: "Efeito de rede imbatível: 60mi compradores e 12mi vendedores criam liquidez que ninguém replica", faz_bem: ["Maior catálogo", "Mercado Pago integrado", "Fulfillment próprio Meli"], nao_oferece: ["Lojas físicas", "Atendimento humanizado", "Crédito no boleto físico"], mudancas_recentes: ["Meli Air — frota própria de aviões para entrega D+1", "Lançou Meli+ com Disney+ e Deezer"], notas_digitais: [{ plataforma: "Google", nota: 4.1 }, { plataforma: "Reclame Aqui", nota: 7.2 }] },
    { nome: "Amazon Brasil", nota_google: 4.2, endereco: "Av. das Nações Unidas, 12999 — Brooklin", cidade: "São Paulo", faixa_preco: "$$", proposta_principal: "E-commerce global com Prime, logística rápida e ecossistema digital", diferencial: "Prime Video + Music + entrega D+1 cria lock-in de assinatura que vai além do varejo", faz_bem: ["Entrega rápida Prime", "Ecossistema digital", "Preço competitivo em eletrônicos"], nao_oferece: ["Parcelamento 12x no boleto", "Atendimento em PT fluido", "Lojas físicas no Brasil"], mudancas_recentes: ["Inaugurou 3 centros de distribuição em SP", "Amazon Prime atingiu 25mi assinantes no Brasil"], notas_digitais: [{ plataforma: "Google", nota: 4.2 }, { plataforma: "Reclame Aqui", nota: 6.8 }] },
    { nome: "Casas Bahia (Grupo VCRDI)", nota_google: 3.4, endereco: "Av. das Nações Unidas, 8501 — Pinheiros", cidade: "São Paulo", faixa_preco: "$", proposta_principal: "Varejo de eletrodomésticos para classe C/D com parcelamento estendido", diferencial: "Crediário próprio para clientes sem cartão de crédito — acessa 40% da população desbancarizada", faz_bem: ["Parcelamento sem cartão", "Lojas em cidades do interior", "Marca reconhecida"], nao_oferece: ["E-commerce robusto", "Logística rápida", "Produto premium"], mudancas_recentes: ["Pediu recuperação judicial por dívida de R$ 4.1bi", "Fechou 100 lojas em 2025"], notas_digitais: [{ plataforma: "Google", nota: 3.4 }, { plataforma: "Reclame Aqui", nota: 4.8 }] },
    { nome: "Shopee Brasil", nota_google: 3.6, endereco: "São Paulo", estado: "SP", cidade: "São Paulo", faixa_preco: "$", proposta_principal: "Marketplace asiático com preços extremamente baixos e frete grátis agressivo", diferencial: "Produtos importados da China a preços inalcançáveis — destrói a categoria de entrada de mercado", faz_bem: ["Preço mais baixo do mercado", "Frete grátis", "App ultra-engajante com gamificação"], nao_oferece: ["Produtos nacionais competitivos", "Pós-venda confiável", "Eletrônicos premium"], mudancas_recentes: ["Imposto de 20% em importados impactou crescimento", "Lançou Shopee Garantida com devolução em 7 dias"], notas_digitais: [{ plataforma: "Google", nota: 3.6 }, { plataforma: "Reclame Aqui", nota: 5.2 }] },
    { nome: "Americanas (Recuperação Judicial)", nota_google: 2.8, endereco: "R. Sacadura Cabral, 102 — Saúde", cidade: "Rio de Janeiro", faixa_preco: "$$", proposta_principal: "Varejo tradicional em recuperação após fraude contábil de R$ 40bi", diferencial: "Marca centenária ainda com recall — mas credibilidade fortemente comprometida pelo escândalo", faz_bem: ["Marca histórica conhecida", "Lojas físicas em shoppings", "Base de clientes fidelizados"], nao_oferece: ["Crédito para fornecedores", "Logística confiável", "App funcional"], mudancas_recentes: ["Plano de recuperação judicial aprovado", "Fechou 450 lojas físicas em 2025"], notas_digitais: [{ plataforma: "Google", nota: 2.8 }, { plataforma: "Reclame Aqui", nota: 3.1 }] },
  ],
  fornecedores: [
    { nome: "Samsung Brasil", cidade: "Campinas", estado: "SP", telefone: "(0800) 124-1234", email: "b2b@samsung.com.br", preco_referencia: 0, produto_servico: "Principal fornecedor de smartphones e TVs — 28% do GMV de eletrônicos Magalu" },
    { nome: "LG Electronics Brasil", cidade: "Manaus", estado: "AM", telefone: "(92) 3613-0000", email: "comercial@lge.com.br", preco_referencia: 0, produto_servico: "Eletrodomésticos e TVs OLED — parceria exclusiva para combos de linha branca" },
    { nome: "Whirlpool Brasil (Brastemp/Consul)", cidade: "Rio Claro", estado: "SP", telefone: "(19) 3524-1000", email: "trade@whirlpool.com.br", preco_referencia: 0, produto_servico: "Linha branca — geladeiras, fogões, lavadoras Brastemp e Consul para todo o Brasil" },
    { nome: "Luizacred (Itaú Unibanco)", cidade: "São Paulo", estado: "SP", telefone: "(11) 3003-5000", email: "luizacred@itau-unibanco.com.br", preco_referencia: 0, produto_servico: "Financiamento ao consumidor — cartão Magalu e crédito parcelado para 28mi clientes" },
    { nome: "Logística Magalu (Própria)", cidade: "Louveira", estado: "SP", telefone: "(11) 3504-2500", email: "logistica@magazineluiza.com.br", preco_referencia: 0, produto_servico: "Centro de distribuição em Louveira — fulfillment para e-commerce com entrega D+1 para SP" },
  ],
  praticas: [
    { titulo: "Super App: do varejo ao ecossistema digital", conteudo: "Magalu super app integrou marketplace, serviços financeiros (Luizacred), delivery (Magalu Entregas) e seguros. Usuários com 3+ serviços têm LTV 4.8x maior e churn 68% menor. Ecossistema retém o cliente além da compra.", fonte: "Magalu Investor Day 2025" },
    { titulo: "Lu do Magalu: influenciadora virtual com 7mi seguidores", conteudo: "Lu do Magalu é a influenciadora virtual mais seguida do mundo — 7mi no Instagram, 4mi no TikTok. Campanhas com Lu têm CPM 62% menor que mídia paga tradicional e CTR 3.8x maior. Custo por venda via Lu: R$ 4,20 vs R$ 18 do Google Ads.", fonte: "Magalu Marketing Report 2025" },
    { titulo: "Seller Marketplace: 200k vendedores como alavanca", conteudo: "Marketplace com 200k sellers terceiros ampliou catálogo de 400k para 48mi produtos sem investimento em estoque. GMV de marketplace já representa 41% do total Magalu. Cada R$ 1 de take rate de marketplace tem margem 3x maior que revenda direta.", fonte: "Magalu Q4/2025 Earnings" },
    { titulo: "Lojas como mini CDs: entrega same-day em 1.500 cidades", conteudo: "1.500 lojas físicas funcionam como dark stores para entrega same-day em cidades do interior — vantagem que Mercado Livre e Amazon não têm. Produtos retirados em loja têm 45% menos devolução e geram upsell de R$ 85 por visita.", fonte: "Magalu Omni Report 2025" },
    { titulo: "Crédito via Luizacred: 40% das vendas financiadas", conteudo: "40% do GMV Magalu passa pelo Luizacred — financiamento próprio com margem líquida de 18%. Clientes com cartão Magalu compram 3.1x mais vezes ao ano. Inadimplência controlada em 4.2% via score comportamental baseado em histórico de compras.", fonte: "Luizacred Relatório Anual 2025" },
  ],
  previsao_clima: CLIMA_SP,
  gamificacao_log: [
    { acao: "Recorde de GMV Diário Atingido", pontos: 200 },
    { acao: "NPS de Loja Física > 72", pontos: 150 },
    { acao: "Taxa de Devolução Abaixo de 3%", pontos: 100 },
  ],
  pesquisa: { resumo: "E-commerce brasileiro faturou R$ 185bi em 2025 — crescimento de 12% YoY. Mercado Livre lidera com 32% de market share, seguido por Amazon (18%) e Magalu (14%). Black Friday e Natal concentram 31% das vendas anuais. Ticket médio: R$ 320. Categoria de maior crescimento: saúde e beleza (+38%). Frete grátis é critério de compra para 74% dos consumidores." },
  timeline: [
    { id: '1', data: '05 Mai', tipo: 'concorrente', icone: '⚡', titulo: 'Meli Air — Mercado Livre lançou frota de aviões própria', detalhe: 'Mercado Livre anunciou Meli Air com 12 aviões para entrega D+1 no Brasil inteiro. Investimento: US$ 420mi. Risco: reduz vantagem logística da Magalu no interior. Ação: acelerar parceria com transportadoras locais para garantir D+1 nas 1.500 cidades que já são cobertas por lojas.' },
    { id: '2', data: '03 Mai', tipo: 'mercado', icone: '📈', titulo: 'Imposto de 20% em importados beneficia varejistas nacionais', detalhe: 'Decreto que taxa em 20% produtos importados de plataformas asiáticas (Shopee, Shein) gerou migração de 8% do GMV dessas plataformas para varejistas nacionais. Magalu capturou 2.3 p.p. de market share em 60 dias.' },
    { id: '3', data: '01 Mai', tipo: 'mercado', icone: '🌊', titulo: 'Casas Bahia fechou 100 lojas — oportunidade de expansão física', detalhe: 'Casas Bahia (recuperação judicial) fechou mais 100 lojas em cidades do interior paulista e nordestino. 38 cidades ficaram sem loja de eletrodoméstico físico. Magalu tem plano de abertura acelerada em 22 dessas cidades até Q3/2026.' },
    { id: '4', data: '28 Abr', tipo: 'fornecedor', icone: '📦', titulo: 'Samsung reajustou tabela de preços em +7% por câmbio', detalhe: 'Samsung reajustou preços de fábrica em 7% motivado por dólar acima de R$ 5,80. Impacto estimado no GMV de smartphones Magalu: +R$ 120-180 de ticket médio por aparelho. Estratégia: antecipar compra de estoque de modelos A-series antes do reajuste.' },
    { id: '5', data: '25 Abr', tipo: 'concorrente', icone: '🏪', titulo: 'Amazon inaugurou 3 CDs em SP com capacidade para 2mi itens', detalhe: 'Amazon abriu 3 novos centros de distribuição em Cajamar, Jundiaí e Santo André com capacidade total de 2mi itens. Prime entrega agora em D+1 para 95% da Grande SP. Monitorar impacto nas categorias de eletrônicos e livros — maior sobreposição com Magalu.' },
  ],
};

const EMBRAER_DATA: OmniData = {
  negocio: { nome_fantasia: "Embraer", segmento: "Aeronáutica & Defesa", cidade: "São José dos Campos", estado: "SP", telefone: "(12) 3927-1000", nivel: 5, pontos: 4880 },
  semana_label: "Semana de 06 de Maio de 2026",
  mercado_nome: "Aviação Comercial, Executiva & Defesa",
  mercado_tamanho: "US$ 4.2bi/ano em receita",
  ranking_local: 1, progresso_pct: 97, nivel_label: "3ª Maior Fabricante do Mundo", pontos_proximo: 5000,
  concorrentes: [
    { nome: "Bombardier (Canadá)", nota_google: 4.2, endereco: "Montreal, QC", cidade: "Montreal", faixa_preco: "$$$$", proposta_principal: "Jatos regionais e executivos premium — série CRJ e Global para aviação de negócios", diferencial: "Global 7500 é o avião executivo de maior alcance do mundo — nicho ultra-premium sem concorrência", faz_bem: ["Global 7500 ultra-long range", "Interior de luxo customizável", "Base de clientes corporativos fiéis"], nao_oferece: ["Aviação comercial regional (saiu)", "Avião para menos de 50 pax", "Preço competitivo"], mudancas_recentes: ["Saiu completamente da aviação comercial", "Global 8000 com alcance de 14.278km anunciado"], notas_digitais: [{ plataforma: "Aviation Week", nota: 4.2 }] },
    { nome: "ATR (Airbus/Leonardo)", nota_google: 4.0, endereco: "Toulouse", cidade: "Toulouse", faixa_preco: "$$$", proposta_principal: "Turbohélices regionais ATR 42/72 para rotas curtas e pistas não pavimentadas", diferencial: "Único competidor em turbohélice para rotas de até 1.500km — nicho onde jato é antieconômico", faz_bem: ["Eficiência em rotas curtas", "Pistas não pavimentadas", "Consumo 45% menor que jato"], nao_oferece: ["Velocidade de jato", "Conforto para voos > 2h", "Alcance > 1.500km"], mudancas_recentes: ["ATR 42-600S para pistas de 800m lançado", "Pedido de 100 aeronaves da IndiGo (Índia)"], notas_digitais: [{ plataforma: "Aviation Week", nota: 4.0 }] },
    { nome: "Boeing (Divisão Comercial)", nota_google: 3.5, endereco: "Arlington, VA", cidade: "Arlington", faixa_preco: "$$$$", proposta_principal: "Fabricante líder de aeronaves wide e narrow body — 737, 787 e 777", diferencial: "Maior carreira instalada do mundo — 12.000 aviões em operação criam vínculo de manutenção eterno", faz_bem: ["737 MAX (narrow body)", "787 Dreamliner", "Fidelidade de clientes"], nao_oferece: ["Aviação regional < 150 pax", "Preço competitivo vs Airbus", "Confiabilidade pós-MAX"], mudancas_recentes: ["737 MAX voltou a voar após crise de portas", "Greve de 7 semanas custou US$ 6bi"], notas_digitais: [{ plataforma: "Aviation Week", nota: 3.5 }] },
    { nome: "COMAC (China)", nota_google: 3.8, endereco: "Xangai", cidade: "Xangai", faixa_preco: "$$", proposta_principal: "Fabricante estatal chinesa com C919 para mercado doméstico e exportação", diferencial: "Suporte do Estado chinês ilimitado — pode vender abaixo do custo para conquistar market share", faz_bem: ["Preço subsidiado", "Mercado chinês cativo", "C919 certificado pela CAAC"], nao_oferece: ["Certificação FAA/EASA", "Rede de suporte global", "Confiabilidade comprovada"], mudancas_recentes: ["C919 em operação comercial pela Air China", "Acordo com 40 países para exportação"], notas_digitais: [{ plataforma: "Aviation Week", nota: 3.8 }] },
    { nome: "Mitsubishi Regional Jet (SpaceJet)", nota_google: 3.2, endereco: "Nagoia", cidade: "Nagoia", faixa_preco: "$$$", proposta_principal: "Jato regional japonês SpaceJet para 70-90 passageiros — programa em pausa", diferencial: "Tecnologia japonesa de qualidade premium — se certificado, entraria direto no nicho E175", faz_bem: ["Engenharia japonesa", "Interior mais largo do segmento", "Suporte Toyota Group"], nao_oferece: ["Certificação FAA (ainda pendente)", "Rede de suporte global", "Prazo de entrega"], mudancas_recentes: ["Programa SpaceJet em pausa indefinida por custos", "Mitsubishi anunciou revisão estratégica do projeto"], notas_digitais: [{ plataforma: "Aviation Week", nota: 3.2 }] },
  ],
  fornecedores: [
    { nome: "GE Aviation (CFM International)", cidade: "Cincinnati, OH", estado: "US", telefone: "+1 513 243 2000", email: "commercial@ge.com", preco_referencia: 0, produto_servico: "Motores LEAP-1E para E2 — principal componente do custo unitário (~35% do preço do avião)" },
    { nome: "Pratt & Whitney", cidade: "East Hartford, CT", estado: "US", telefone: "+1 860 565 4321", email: "commercial@pw.com", preco_referencia: 0, produto_servico: "Motores PW1700G e PW1900G — família geared turbofan para E175-E2 e E190-E2" },
    { nome: "Collins Aerospace", cidade: "Charlotte, NC", estado: "US", telefone: "+1 704 423 7000", email: "partners@collinsaerospace.com", preco_referencia: 0, produto_servico: "Aviônica, sistemas de voo e interiores — flight deck Pro Line Fusion para família E-Jet E2" },
    { nome: "Liebherr Aerospace", cidade: "Toulouse", estado: "FR", telefone: "+33 562 174 100", email: "aerospace@liebherr.com", preco_referencia: 0, produto_servico: "Sistema de ar condicionado, trem de pouso e sistemas hidráulicos da família E-Jet" },
    { nome: "Embraer Aeroestruturas (Própria)", cidade: "Gavião Peixoto", estado: "SP", telefone: "(14) 3469-2000", email: "aeroestruturas@embraer.com.br", preco_referencia: 0, produto_servico: "Fabricação de fuselagem, asas e componentes estruturais em Gavião Peixoto — verticalização crítica" },
  ],
  praticas: [
    { titulo: "E2: família atualizada com 25% menos consumo de combustível", conteudo: "Família E-Jet E2 (E175-E2, E190-E2, E195-E2) oferece 25% menos consumo que a geração anterior — principal argumento de venda para companhias aéreas em cenário de combustível caro. A cada US$ 1 de alta no barril de petróleo, a economia do E2 vale mais US$ 400k ao longo da vida útil.", fonte: "Embraer Market Outlook 2025" },
    { titulo: "Aftermarket: receita recorrente de US$ 1.1bi/ano", conteudo: "Serviços de manutenção, reparo e overhaul (MRO) geram US$ 1.1bi/ano — 26% da receita total com margem de 32%. Cada avião vendido gera 25 anos de receita de serviços. Pool de peças Embraer em 12 países garante AOG (avião em solo) < 24h.", fonte: "Embraer Services & Support 2025" },
    { titulo: "Eve: eVTOL como próxima fronteira de crescimento", conteudo: "Eve Urban Air Mobility (subsidiária da Embraer) tem carteira de 2.850 aeronaves eVTOL — valor de US$ 14.3bi. Certificação FAA esperada para 2026. São Paulo é o principal mercado-alvo com helipads e infraestrutura existente.", fonte: "Eve Air Mobility — Investor Relations 2025" },
    { titulo: "Defesa: KC-390 como plataforma de exportação estratégica", conteudo: "KC-390 (avião de transporte militar) exportado para Portugal, Países Baixos e Hungria — 3 países da NATO. Cada contrato de defesa vale US$ 180-240mi com serviços de 30 anos. Pipeline de 12 países em negociação.", fonte: "Embraer Defense & Security 2025" },
    { titulo: "Backlog de 900+ aeronaves: visibilidade de receita por 7 anos", conteudo: "Backlog de US$ 21.1bi representa 7 anos de produção garantida. Carteira firme de 900+ aeronaves elimina risco de ociosidade fabril. E195-E2 já tem 78% da capacidade produtiva 2026 vendida — poder de pricing acima da inflação.", fonte: "Embraer Q1/2026 Results" },
  ],
  previsao_clima: CLIMA_SP,
  gamificacao_log: [
    { acao: "Entrega de Aeronave no Prazo", pontos: 200 },
    { acao: "Zero Discrepâncias em Auditoria FAA", pontos: 150 },
    { acao: "Nova Encomenda Firme Assinada", pontos: 100 },
  ],
  pesquisa: { resumo: "Mercado global de aviação regional movimentou US$ 28bi em 2025. Embraer detém 48% do segmento de jatos regionais entre 70-150 assentos. Demanda por novos aviões: 9.800 unidades nos próximos 20 anos só no segmento regional. Pós-COVID, companhias aéreas priorizam aeronaves menores e mais eficientes para rotas não-hub. Brasil tem 95 destinos com menos de 3 voos/dia — oportunidade de 200+ aeronaves E170/E175." },
  timeline: [
    { id: '1', data: '05 Mai', tipo: 'mercado', icone: '📈', titulo: 'LATAM Airlines encomendou 50 E195-E2 — US$ 3.1bi', detalhe: 'LATAM Airlines assinou carta de intenção para 50 E195-E2 com opção para mais 20. Entrega prevista 2027-2031. É a maior encomenda da Embraer em 5 anos. Motivação: substituição de 737-700 com 25% menos consumo em rotas regionais do Cone Sul.' },
    { id: '2', data: '03 Mai', tipo: 'concorrente', icone: '⚡', titulo: 'Boeing 737 MAX sofreu nova crise de porta em voo da United', detalhe: 'Novo incidente com painel de porta do 737 MAX em voo da United Airlines. FAA abriu investigação. Impacto positivo para Embraer: 3 companhias aéreas americanas aceleraram conversas sobre E175 como alternativa de 70-80 pax sem histórico de problemas.' },
    { id: '3', data: '01 Mai', tipo: 'mercado', icone: '🌊', titulo: 'Carbono: CORSIA obriga companhias a compensar emissões', detalhe: 'CORSIA (Carbon Offsetting Scheme) entra em fase obrigatória em jan/2027. Companhias que operam E2 economizam US$ 180k/avião/ano em créditos de carbono vs geração anterior. Argumento comercial para renovação de frota acelerada.' },
    { id: '4', data: '28 Abr', tipo: 'fornecedor', icone: '📦', titulo: 'GE Aviation com atraso na entrega de motores LEAP — impacto Q3', detalhe: 'GE Aviation comunicou atraso de 60-90 dias na entrega de motores LEAP-1E para Q3/2026. Impacto: 8 aeronaves E2 com entrega postergada. Equipe de supply chain já acionou cláusula de penalidade contratual. Receita de Q3 pode ser impactada em US$ 280-320mi.' },
    { id: '5', data: '25 Abr', tipo: 'concorrente', icone: '🏪', titulo: 'COMAC C919 recebeu primeiro pedido fora da China — Air Tanzania', detalhe: 'Air Tanzania assinou MOU para 2 aeronaves C919 — primeiro cliente fora da China. Alerta: se C919 obtiver certificação EASA em 2027 (como planejado), entrará diretamente no segmento de 150 pax onde Embraer E195-E2 compete.' },
  ],
};

const TESLA_DATA: OmniData = {
  negocio: { nome_fantasia: "Tesla", segmento: "Veículos Elétricos & Energia", cidade: "São Paulo", estado: "SP", telefone: "(11) 3055-8000", nivel: 5, pontos: 4900 },
  semana_label: "Semana de 06 de Maio de 2026",
  mercado_nome: "Veículos Elétricos & Energia Limpa",
  mercado_tamanho: "R$ 8.2bi/ano no Brasil",
  ranking_local: 1, progresso_pct: 98, nivel_label: "Líder de Mercado Global", pontos_proximo: 5000,
  concorrentes: [
    { nome: "BYD Brasil", nota_google: 4.3, endereco: "Av. Paulista, 1000 — Bela Vista", cidade: "São Paulo", faixa_preco: "$$", proposta_principal: "EVs chineses com melhor custo-benefício — Dolphin, Seal e Atto 3 no Brasil", diferencial: "Bateria Blade própria + preço 25-30% abaixo da Tesla com alcance comparável", faz_bem: ["Preço competitivo", "Bateria Blade segura", "Rede de concessionárias crescendo"], nao_oferece: ["Supercharger exclusivo", "Autopilot avançado", "Software over-the-air"], mudancas_recentes: ["Fábrica em Camaçari anunciada — 150k unidades/ano", "BYD Seal lançado por R$ 249.800"], notas_digitais: [{ plataforma: "Reclame Aqui", nota: 3.8 }, { plataforma: "Google", nota: 4.3 }] },
    { nome: "Volkswagen EV (ID.4)", nota_google: 4.1, endereco: "Av. Ibirapuera, 2907", cidade: "São Paulo", faixa_preco: "$$$", proposta_principal: "SUV elétrico premium com herança VW — ID.4 e ID.3 para o mercado brasileiro", diferencial: "Confiança da marca + rede de assistência de 800 concessionárias no Brasil", faz_bem: ["Rede de atendimento extensa", "Confiabilidade percebida", "Design europeu"], nao_oferece: ["Autonomia acima de 400km", "Supercharger dedicado", "OTA frequente"], mudancas_recentes: ["ID.4 produzido em Taubaté a partir de 2027", "Investimento de R$ 9bi na eletrificação"], notas_digitais: [{ plataforma: "Google", nota: 4.1 }] },
    { nome: "Hyundai IONIQ 6", nota_google: 4.4, endereco: "R. José Guerra, 110", cidade: "São Paulo", faixa_preco: "$$$", proposta_principal: "Sedan elétrico aerodinâmico com carregamento ultrarrápido de 800V", diferencial: "Carregamento 800V: 0→80% em 18 minutos — mais rápido que Model 3 Long Range", faz_bem: ["Carregamento ultrarrápido", "Autonomia 614km (WLTP)", "Design premiado"], nao_oferece: ["Software nativo avançado", "Rede própria de carregadores", "Over-the-air robusto"], mudancas_recentes: ["IONIQ 6 eleito World Car of the Year 2023", "Lançado no Brasil por R$ 329.990"], notas_digitais: [{ plataforma: "Google", nota: 4.4 }] },
    { nome: "Rivian Brasil (importado)", nota_google: 4.2, endereco: "—", cidade: "São Paulo", faixa_preco: "$$$$", proposta_principal: "Pickups e SUVs elétricos premium para aventura — R1T e R1S", diferencial: "Único EV pickup elétrico disponível no Brasil — nicho sem concorrência direta", faz_bem: ["Off-road elétrico", "Capacidade de carga", "Software proprietário"], nao_oferece: ["Rede de serviço local", "Preço acessível", "Peças com estoque local"], mudancas_recentes: ["Acordo com Amazon para 100k vans de entrega", "Expandindo para LATAM em 2026"], notas_digitais: [{ plataforma: "Google", nota: 4.2 }] },
    { nome: "GM Chevrolet Bolt EV", nota_google: 3.9, endereco: "Av. Goiás, 1200 — São Caetano", cidade: "São Caetano do Sul", faixa_preco: "$$", proposta_principal: "Hatch elétrico acessível com autonomia de 416km — opção de entrada no segmento", diferencial: "Menor preço de entrada no segmento EV com marca conhecida no Brasil", faz_bem: ["Preço de entrada", "Autonomia adequada", "Rede GM para manutenção"], nao_oferece: ["Autopilot", "Supercharger", "Design premium"], mudancas_recentes: ["Reajuste para R$ 219.990 após crise de recall de bateria", "GM cancelou Bolt nos EUA"], notas_digitais: [{ plataforma: "Reclame Aqui", nota: 3.5 }, { plataforma: "Google", nota: 3.9 }] },
    { nome: "Polestar 2 Brasil", nota_google: 4.3, endereco: "Av. Juscelino Kubitschek, 1600", cidade: "São Paulo", faixa_preco: "$$$", proposta_principal: "Fastback elétrico sueco-chinês com foco em design e performance", diferencial: "Android Automotive nativo — integração Google total sem Android Auto intermediário", faz_bem: ["Android Automotive nativo", "Design escandinavo", "Performance (0→100 em 4.5s)"], nao_oferece: ["Rede de serviço ampla", "Autopilot comparável ao Tesla", "Preço competitivo"], mudancas_recentes: ["Polestar 2 lançado no Brasil por R$ 359.000", "Parceria com Volvo Car para serviços"], notas_digitais: [{ plataforma: "Google", nota: 4.3 }] },
  ],
  fornecedores: [
    { nome: "Panasonic Energy (Japão)", cidade: "Osaka", estado: "JP", telefone: "+81 6 6908 1121", email: "energy@panasonic.com", preco_referencia: 0, produto_servico: "Células de bateria cilíndricas 2170 e 4680 para Model 3/Y/S/X — parceria Gigafactory Nevada" },
    { nome: "CATL (China)", cidade: "Ningde", estado: "CN", telefone: "+86 593 8988 000", email: "global@catl.com", preco_referencia: 0, produto_servico: "Baterias LFP para Model 3 Standard Range — tecnologia sem cobalto para redução de custo" },
    { nome: "NVIDIA (EUA)", cidade: "Santa Clara, CA", estado: "US", telefone: "+1 408 486 2000", email: "auto@nvidia.com", preco_referencia: 0, produto_servico: "Chips de processamento para sistema de navegação e câmeras — substituído por chip próprio FSD" },
    { nome: "Samsung SDI (Coreia)", cidade: "Yongin", estado: "KR", telefone: "+82 31 8006 3114", email: "automotive@samsungsdi.com", preco_referencia: 0, produto_servico: "Células de bateria para Powerwall e Megapack — linha de armazenamento de energia estacionária" },
    { nome: "Gerdau (Brasil)", cidade: "Porto Alegre", estado: "RS", telefone: "(51) 3323-2000", email: "comercial@gerdau.com.br", preco_referencia: 0, produto_servico: "Aço estrutural reciclado para chassis e componentes — parceria para produção local de veículos" },
  ],
  praticas: [
    { titulo: "Supercharger: rede própria como vantagem competitiva", conteudo: "Tesla opera 50.000+ Superchargers no mundo — a maior rede de carregamento dedicado. No Brasil: 120 estações, em expansão para 300 até 2027. Tempo de recarga: 15-30min para 80%. Proprietários Tesla raramente usam carregadores de terceiros — fidelização por infraestrutura.", fonte: "Tesla Charging Report 2025" },
    { titulo: "Over-the-Air: carro melhora enquanto você dorme", conteudo: "Tesla lança 8-12 atualizações OTA por ano — recursos novos aparecem sem visita ao serviço. FSD 13.0 adicionou 40% de melhoria em navegação urbana. Valor percebido aumenta com o tempo, único carro do segmento que 'envelhece ao contrário'.", fonte: "Tesla Software Release Notes 2025" },
    { titulo: "Energia: Powerwall + Megapack — receita além dos carros", conteudo: "Divisão de Energia cresceu 67% em 2025 — receita de US$ 9.2bi. Megapack vendido a utilities de 40 países. Powerwall 3 domina mercado de armazenamento residencial. Brasil: 8.200 Powerwalls instalados em 2025, alta de 120% YoY com incentivos solares.", fonte: "Tesla Q4/2025 Earnings" },
    { titulo: "Autopilot e FSD: monetização do software", conteudo: "FSD (Full Self-Driving) subscrição a US$ 99/mês ou US$ 8.000 compra. Base instalada de 500k assinantes gera receita recorrente de US$ 600mi/ano com custo marginal próximo de zero. Cada melhoria de FSD aumenta a base de assinantes sem novo hardware.", fonte: "Tesla AI Day 2025" },
    { titulo: "Fábrica de São Paulo: localização como estratégia fiscal", conteudo: "Gigafactory São Paulo (Caçapava) prevista para 2028 — 50.000 veículos/ano. IPI zerado para EV brasileiro elimina R$ 80.000 de imposto por veículo importado. Preço do Model Y nacional deve cair de R$ 359.990 para R$ 249.990 — abre mercado premium-médio.", fonte: "Tesla Brazil Strategy 2026" },
  ],
  previsao_clima: CLIMA_SP,
  gamificacao_log: [
    { acao: "Meta de Entregas Trimestrais Atingida", pontos: 200 },
    { acao: "NPS Acima de 85 no Brasil", pontos: 150 },
    { acao: "Zero Recalls no Trimestre", pontos: 100 },
  ],
  pesquisa: { resumo: "Mercado de EVs no Brasil cresceu 127% em 2025 — 92.400 unidades vendidas. Tesla lidera o segmento premium com 38% de market share acima de R$ 300k. Infraestrutura de recarga: 4.200 pontos públicos (crescimento de 85% ao ano). Incentivos fiscais: IPI zerado para EVs importados até 2026, prorrogação em análise. Custo total de propriedade do EV é 35% menor que ICE após 5 anos no Brasil." },
  timeline: [
    { id: '1', data: '05 Mai', tipo: 'mercado', icone: '📈', titulo: 'BYD anunciou fábrica em Camaçari — 150k EVs/ano a partir de 2027', detalhe: 'BYD confirmou investimento de R$ 3bi em Camaçari (BA) — capacidade de 150.000 EVs/ano. Impacto direto: BYD produzido no Brasil terá IPI zerado + custo 20% menor. Modelo Seal brasileiro pode chegar a R$ 189.900 — 25% abaixo do Model 3. Urgência: acelerar Gigafactory SP.' },
    { id: '2', data: '03 Mai', tipo: 'concorrente', icone: '⚡', titulo: 'Volkswagen iniciou produção do ID.4 em Taubaté — 30k/ano', detalhe: 'VW confirmou início da produção do ID.4 em Taubaté a partir de set/2026. Preço estimado: R$ 279.990 — R$ 80k abaixo do Model Y importado. VW tem 800 concessionárias no Brasil vs 18 Tesla Stores. Ação: reforçar Supercharger e FSD como diferencial.' },
    { id: '3', data: '01 Mai', tipo: 'mercado', icone: '🌊', titulo: 'Governo prorroga IPI zero para EVs importados até dez/2026', detalhe: 'Câmara aprovouemenda prorrogando IPI zero para EVs importados até dez/2026. Impacto positivo: mantém preço competitivo por mais 18 meses. Risco: a partir de jan/2027 sem fábrica local, Tesla paga ~30% de IPI — Model Y pode chegar a R$ 480k.' },
    { id: '4', data: '28 Abr', tipo: 'fornecedor', icone: '📦', titulo: 'CATL reajustou preço de células LFP em 12% — impacto em margens', detalhe: 'CATL comunicou reajuste de 12% nas células LFP para contratos 2026. Impacto estimado: redução de 1.8pp na margem bruta do Model 3 SR. Opções: repassar para o preço (arriscado) ou absorver temporariamente enquanto Gigafactory Nevada aumenta produção de 4680.' },
    { id: '5', data: '25 Abr', tipo: 'concorrente', icone: '🏪', titulo: 'Hyundai IONIQ 6 ganhou prêmio de design do IAB Brasil', detalhe: 'IONIQ 6 eleito "Carro Mais Bonito do Ano" pelo IAB Brasil — cobertura massiva de mídia. Impacto: associação positiva com design premium no segmento EV. Ação: reforçar campanha de test drive do Model S e Cybertruck para diferenciar por tecnologia vs estética.' },
  ],
};

const NETFLIX_DATA: OmniData = {
  negocio: { nome_fantasia: "Netflix", segmento: "Streaming & Entretenimento Digital", cidade: "São Paulo", estado: "SP", telefone: "(11) 4130-7000", nivel: 5, pontos: 4870 },
  semana_label: "Semana de 06 de Maio de 2026",
  mercado_nome: "Streaming & Entretenimento Digital",
  mercado_tamanho: "R$ 5.8bi/ano no Brasil",
  ranking_local: 1, progresso_pct: 97, nivel_label: "Líder de Streaming Global", pontos_proximo: 5000,
  concorrentes: [
    { nome: "Prime Video Brasil", nota_google: 4.2, endereco: "Av. Faria Lima, 3900 — Itaim Bibi", cidade: "São Paulo", faixa_preco: "$", proposta_principal: "Streaming incluso no Amazon Prime com esportes ao vivo — NFL, Champions e Brasileirão", diferencial: "Bundling com Prime (frete grátis + música): custo percebido próximo de zero pelo consumidor", faz_bem: ["Esportes ao vivo", "Preço (incluso no Prime)", "Thursday Night Football"], nao_oferece: ["Catálogo original comparável ao Netflix", "Downloads offline ilimitados", "Interface intuitiva"], mudancas_recentes: ["Adquiriu direitos do Brasileirão 2026–2030 por R$ 450mi", "Lançou Prime Video Canal+ no Brasil"], notas_digitais: [{ plataforma: "Google Play", nota: 4.2 }, { plataforma: "App Store", nota: 4.1 }] },
    { nome: "Disney+ Brasil", nota_google: 4.3, endereco: "Av. das Nações Unidas, 12551", cidade: "São Paulo", faixa_preco: "$$", proposta_principal: "Streaming do universo Disney — Marvel, Star Wars, Pixar e National Geographic", diferencial: "IP insubstituível: Avengers, Mandalorian e Disney clássicos — conteúdo sem equivalente", faz_bem: ["Marvel e Star Wars", "Conteúdo infantil premium", "Star (adultos)"], nao_oferece: ["Produção local robusta", "Reality shows e dramas não-americanos", "Esportes ao vivo"], mudancas_recentes: ["Fusão com Hulu no Brasil via pacote bundle", "Daredevil: Born Again bateu recorde de estreia"], notas_digitais: [{ plataforma: "Google Play", nota: 4.3 }] },
    { nome: "HBO Max Brasil (Max)", nota_google: 4.4, endereco: "Av. Paulista, 2300", cidade: "São Paulo", faixa_preco: "$$", proposta_principal: "Streaming premium com HBO, Warner e DC — House of the Dragon, The Last of Us, Succession", diferencial: "Qualidade percebida superior: HBO = prestígio e produções cinematográficas longas", faz_bem: ["Dramas premium HBO", "Filmes Warner no mesmo dia do cinema", "DC Universe"], nao_oferece: ["Volume de lançamentos semanais", "Algoritmo de recomendação forte", "Preço competitivo"], mudancas_recentes: ["Renomeado para Max no Brasil", "The Last of Us S2 bateu recorde histórico do HBO"], notas_digitais: [{ plataforma: "Google Play", nota: 4.4 }] },
    { nome: "Globoplay", nota_google: 3.8, endereco: "R. Lopes Quintas, 303 — Jardim Botânico", cidade: "Rio de Janeiro", faixa_preco: "$", proposta_principal: "Streaming da Globo com novelas, BBB e futebol brasileiro ao vivo", diferencial: "Conteúdo local insubstituível: Globo tem 60% de audiência TV aberta — novelas e BBB ao vivo", faz_bem: ["Novelas", "BBB ao vivo", "Futebol brasileiro"], nao_oferece: ["Produções originais internacionais", "Filmes de cinema", "Interface moderna"], mudancas_recentes: ["Globoplay atingiu 30mi de assinantes no Brasil", "Parceria com Disney para conteúdo Star"], notas_digitais: [{ plataforma: "Google Play", nota: 3.8 }] },
    { nome: "Apple TV+ Brasil", nota_google: 4.5, endereco: "—", cidade: "São Paulo", faixa_preco: "$$", proposta_principal: "Streaming Apple com produções originais exclusivas — Ted Lasso, The Morning Show, Severance", diferencial: "Menor catálogo, maior qualidade média: taxa de Emmy Awards/título é a maior do streaming", faz_bem: ["Qualidade de produção", "Severance e Ted Lasso virais", "Grátis com Apple One"], nao_oferece: ["Volume de catálogo", "Conteúdo local", "Preço individual competitivo"], mudancas_recentes: ["Severance S2 foi o mais premiado do Emmy 2025", "Apple TV+ chegou a 40mi de assinantes globais"], notas_digitais: [{ plataforma: "App Store", nota: 4.5 }] },
    { nome: "Paramount+ Brasil", nota_google: 3.9, endereco: "Av. das Américas, 3434 — Barra da Tijuca", cidade: "Rio de Janeiro", faixa_preco: "$", proposta_principal: "Streaming com catálogo Paramount, MTV, Nickelodeon e esportes ESPN", diferencial: "Bundle com Canais Paramount no cabo — fideliza audiência TV tradicional em transição para OTT", faz_bem: ["Preço acessível", "Star Trek", "Futebol UEFA via ESPN"], nao_oferece: ["Originais de impacto", "Interface competitiva", "Volume de lançamentos"], mudancas_recentes: ["Fusão com Skydance anunciada — novo posicionamento em 2026", "Paramount+ atingiu 71mi de assinantes globais"], notas_digitais: [{ plataforma: "Google Play", nota: 3.9 }] },
  ],
  fornecedores: [
    { nome: "AWS (Amazon Web Services)", cidade: "Seattle, WA", estado: "US", telefone: "+1 206 266 1000", email: "streaming@aws.amazon.com", preco_referencia: 0, produto_servico: "Infraestrutura de streaming global — 99.97% de uptime para 300mi de assinantes simultâneos" },
    { nome: "Sony Pictures Entertainment", cidade: "Culver City, CA", estado: "US", telefone: "+1 310 244 4000", email: "licensing@sony.com", preco_referencia: 0, produto_servico: "Licenciamento de filmes e séries — catálogo de 4.000+ títulos Sony para a plataforma" },
    { nome: "Universal Studios (Comcast)", cidade: "Los Angeles, CA", estado: "US", telefone: "+1 818 777 1000", email: "licensing@nbcuni.com", preco_referencia: 0, produto_servico: "Licenciamento de filmes Universal — Fast & Furious, Jurassic World, Oppenheimer" },
    { nome: "Globo Studios (Brasil)", cidade: "Rio de Janeiro", estado: "RJ", telefone: "(21) 2540-4822", email: "cooproducoes@globo.com", preco_referencia: 0, produto_servico: "Co-produções originais brasileiras — La Casa de Papel Brasil, Round 6 LATAM" },
    { nome: "Akamai Technologies", cidade: "Cambridge, MA", estado: "US", telefone: "+1 617 444 3000", email: "media@akamai.com", preco_referencia: 0, produto_servico: "CDN (Content Delivery Network) para distribuição de vídeo de baixa latência no Brasil" },
  ],
  praticas: [
    { titulo: "Algoritmo de recomendação: 80% do consumo vem de sugestões", conteudo: "80% do que os assinantes assistem na Netflix vem do algoritmo de recomendação — não de busca. Cada título recebe thumbnail personalizada por perfil (A/B test com 27 variações). Netflix economiza US$ 1bi/ano em churn graças ao algoritmo que mantém o usuário engajado.", fonte: "Netflix Technology Blog 2025" },
    { titulo: "Conteúdo local: produções brasileiras com alcance global", conteudo: "Produções brasileiras como '3%', 'Sintonia' e 'Bom Dia, Verônica' são consumidas em 100+ países. Custo de produção local (R$ 8-15mi/temporada) vs licenciamento internacional (US$ 3-8mi): ROI 4x superior. Brasil é o 2º maior mercado produtor da Netflix fora dos EUA.", fonte: "Netflix Content Strategy LATAM 2025" },
    { titulo: "Plano com anúncios: crescimento de 40% em assinantes de entrada", conteudo: "Plano com publicidade (R$ 18,90/mês) cresceu 40% em assinantes no Brasil em 2025 — receita total por assinante supera o plano básico devido ao CPM de publicidade de R$ 45. Reduz barreira de entrada e captura segmento price-sensitive sem canibalizar planos premium.", fonte: "Netflix Ads Report Q4/2025" },
    { titulo: "Live events: FIFA, WWE e stand-up como novo vetor de crescimento", conteudo: "Netflix transmitiu a Copa do Mundo Feminina 2025 e luta Jake Paul vs Mike Tyson (108mi de espectadores simultâneos — maior evento ao vivo da história do streaming). Live content reduz churn em 35% no mês do evento por criar senso de urgência.", fonte: "Netflix Live Strategy 2025" },
    { titulo: "Games: extensão da assinatura sem custo adicional", conteudo: "Netflix Games tem 80 jogos inclusos na assinatura — sem custo adicional. Título Netflix exclusivo 'Squid Game: Unleashed' teve 82mi de downloads. Estratégia: games aumentam tempo na plataforma de 2.1h para 2.8h/dia, reduzindo cancelamento em 22%.", fonte: "Netflix Games Annual Report 2025" },
  ],
  previsao_clima: CLIMA_SP,
  gamificacao_log: [
    { acao: "Série Original Entrou no Top 10 Global", pontos: 200 },
    { acao: "Churn Abaixo de 2% no Mês", pontos: 150 },
    { acao: "Novo Recorde de Assinantes no Brasil", pontos: 100 },
  ],
  pesquisa: { resumo: "Mercado de streaming no Brasil movimentou R$ 5.8bi em 2025. Netflix lidera com 47mi de assinantes, seguida de Globoplay (30mi) e Prime Video (22mi). Penetração de streaming: 68% dos domicílios com internet. Média de plataformas por casa: 2.3. Churn médio do setor: 4.2%/mês — retenção é o principal desafio. Conteúdo local é o principal driver de retenção (72% dos usuários citam como motivo para manter assinatura)." },
  timeline: [
    { id: '1', data: '05 Mai', tipo: 'mercado', icone: '📈', titulo: 'Prime Video adquiriu direitos do Brasileirão 2026-2030 por R$ 450mi', detalhe: 'Amazon confirmou compra exclusiva dos direitos do Brasileirão Série A (2026–2030) por R$ 450mi. Impacto direto: usuários que assinam Netflix por esportes podem migrar para Prime. Ação urgente: acelerar negociação com Conmebol para Copa Libertadores — único grande torneio disponível.' },
    { id: '2', data: '03 Mai', tipo: 'concorrente', icone: '⚡', titulo: 'Disney+ atingiu 160mi de assinantes globais — superou projeção', detalhe: 'Disney+ reportou 160mi de assinantes globais — 12% acima da projeção dos analistas. Crescimento liderado pela Marvel e Star Wars. Brasil: Disney+ cresceu 38% YoY. Daredevil: Born Again foi o título mais assistido da plataforma em mai/2026. Monitorar: Avengers 6 estreia em jul/2026.' },
    { id: '3', data: '01 Mai', tipo: 'mercado', icone: '🌊', titulo: 'ANATEL propôs regulação de streaming — cota de 30% conteúdo nacional', detalhe: 'ANATEL publicou proposta de regulação exigindo 30% de conteúdo nacional em plataformas de streaming. Netflix já atende (Brasil é 2º maior produtor). Impacto positivo: cria barreira para novos entrantes. Custo estimado de adequação para concorrentes menores: R$ 120-200mi/ano.' },
    { id: '4', data: '28 Abr', tipo: 'concorrente', icone: '📦', titulo: 'Globoplay atingiu 30mi de assinantes — acelerou produção original', detalhe: 'Globoplay anunciou 30mi de assinantes e investimento de R$ 800mi em produções originais para 2026. Risco: 8 séries originais confirmadas — podem competir com audiência de produções Netflix Brasil. Globo tem vantagem de IP próprio (novelas) como ancora de conteúdo.' },
    { id: '5', data: '25 Abr', tipo: 'concorrente', icone: '🏪', titulo: 'Severance S2 gerou pico de 12mi de visualizações no Apple TV+', detalhe: 'Severance S2 foi o título mais comentado do streaming em abr/2026 — Apple TV+ registrou pico de 12mi de visualizações em uma semana. Apple tem apenas 40mi de assinantes globais mas NPS de 72 (vs Netflix 65). Risco: percepção de qualidade Apple pode crescer.' },
  ],
};

const SPOTIFY_DATA: OmniData = {
  negocio: { nome_fantasia: "Spotify", segmento: "Música & Áudio Digital", cidade: "São Paulo", estado: "SP", telefone: "(11) 4080-0000", nivel: 5, pontos: 4820 },
  semana_label: "Semana de 06 de Maio de 2026",
  mercado_nome: "Streaming de Música & Podcasts",
  mercado_tamanho: "R$ 2.9bi/ano no Brasil",
  ranking_local: 1, progresso_pct: 96, nivel_label: "Líder Global de Música", pontos_proximo: 5000,
  concorrentes: [
    { nome: "Apple Music Brasil", nota_google: 4.3, endereco: "—", cidade: "São Paulo", faixa_preco: "$$", proposta_principal: "Streaming de música com 100mi de músicas em áudio lossless e Spatial Audio", diferencial: "Áudio Dolby Atmos sem custo adicional + integração perfeita com iPhone e AirPods", faz_bem: ["Áudio lossless Dolby Atmos", "Integração Apple ecosystem", "Radio stations curadas"], nao_oferece: ["Versão gratuita", "Algoritmo de descoberta comparável", "Podcasts nativos"], mudancas_recentes: ["Apple Music Classical lançado globalmente", "Spatial Audio chegou a 60% do catálogo"], notas_digitais: [{ plataforma: "App Store", nota: 4.5 }, { plataforma: "Google Play", nota: 4.3 }] },
    { nome: "YouTube Music Brasil", nota_google: 4.1, endereco: "—", cidade: "São Paulo", faixa_preco: "$", proposta_principal: "Streaming de música integrado ao YouTube — catálogo infinito incluindo covers e ao vivo", diferencial: "Acesso a conteúdo impossível de licenciar: covers, bootlegs e ao vivo do YouTube como diferencial único", faz_bem: ["Cobertura de catálogo infinita", "Integração YouTube", "Vídeos ao vivo"], nao_oferece: ["Descoberta de novos artistas", "Interface intuitiva", "Experiência de podcast"], mudancas_recentes: ["Integrado ao Google One — bundle com Drive e Gmail", "YouTube Music atingiu 100mi de assinantes globais"], notas_digitais: [{ plataforma: "Google Play", nota: 4.1 }] },
    { nome: "Amazon Music Brasil", nota_google: 4.0, endereco: "—", cidade: "São Paulo", faixa_preco: "$", proposta_principal: "Streaming incluso no Prime com 100mi de músicas e áudio HD sem custo adicional", diferencial: "Bundling Prime elimina custo percebido — usuário recebe música como 'brinde' do frete grátis", faz_bem: ["Preço (incluso no Prime)", "Alexa integration", "Áudio HD no plano padrão"], nao_oferece: ["Catálogo de podcasts", "Descoberta algorítmica avançada", "Playlist personalização"], mudancas_recentes: ["Amazon Music Unlimited passou para US$ 10.99/mês", "Integração com Echo Show para letras na tela"], notas_digitais: [{ plataforma: "App Store", nota: 4.0 }] },
    { nome: "Deezer Brasil", nota_google: 3.8, endereco: "Av. Paulista, 1374", cidade: "São Paulo", faixa_preco: "$", proposta_principal: "Streaming francês com áudio FLAC lossless e curadoria humana diferenciada", diferencial: "Fluxo (Flow) = playlist infinita personalizada por IA + curadoria humana híbrida, pioneiro no Brasil", faz_bem: ["Áudio FLAC sem extra", "Flow (mix personalizado)", "Suporte a artistas independentes"], nao_oferece: ["Catálogo de podcasts competitivo", "Algoritmo de recomendação avançado", "Base de usuários ampla"], mudancas_recentes: ["Parceria com TIM Brasil — Deezer incluso em planos pós-pagos", "Deezer HiFi lossless sem custo adicional"], notas_digitais: [{ plataforma: "Google Play", nota: 3.8 }] },
    { nome: "Tidal Brasil", nota_google: 4.2, endereco: "—", cidade: "São Paulo", faixa_preco: "$$$", proposta_principal: "Streaming premium com áudio Master Quality e foco em artistas independentes", diferencial: "Royalties mais altos para artistas — posicionamento ético como alternativa ao Spotify", faz_bem: ["Qualidade de áudio Master", "Royalties justos para artistas", "Conteúdo exclusivo de artistas"], nao_oferece: ["Versão gratuita", "Base de usuários ampla", "Podcasts"], mudancas_recentes: ["Jack Dorsey (Square) adquiriu parcela da Tidal", "Beyoncé e Jay-Z mantêm exclusivos na plataforma"], notas_digitais: [{ plataforma: "App Store", nota: 4.2 }] },
  ],
  fornecedores: [
    { nome: "Universal Music Group", cidade: "Santa Monica, CA", estado: "US", telefone: "+1 310 865 5000", email: "licensing@umusic.com", preco_referencia: 0, produto_servico: "Licenciamento do maior catálogo musical do mundo — 40% das músicas mais tocadas são UMG" },
    { nome: "Sony Music Entertainment", cidade: "New York, NY", estado: "US", telefone: "+1 212 833 8000", email: "licensing@sonymusic.com", preco_referencia: 0, produto_servico: "Licenciamento de catálogo Sony — Beyoncé, Adele, Harry Styles e catalogos históricos" },
    { nome: "Warner Music Group", cidade: "New York, NY", estado: "US", telefone: "+1 212 275 2000", email: "licensing@wmg.com", preco_referencia: 0, produto_servico: "Licenciamento Warner — Ed Sheeran, Bruno Mars, Coldplay e catalogos Elektra/Atlantic" },
    { nome: "Google Cloud (GCP)", cidade: "Mountain View, CA", estado: "US", telefone: "+1 650 253 0000", email: "media@google.com", preco_referencia: 0, produto_servico: "Infraestrutura de streaming e armazenamento de 100mi de faixas — processamento de recomendações ML" },
    { nome: "Anchor (própria)", cidade: "New York, NY", estado: "US", telefone: "+1 212 555 0100", email: "creators@anchor.fm", preco_referencia: 0, produto_servico: "Plataforma de criação e hospedagem de podcasts adquirida em 2019 — base de 5mi de podcasters" },
  ],
  praticas: [
    { titulo: "Wrapped: marketing viral de dados pessoais — US$ 0 de custo", conteudo: "Spotify Wrapped gera cobertura de mídia equivalente a US$ 60mi em publicidade gratuita anualmente. Em 2025, 780mi de posts com #SpotifyWrapped. ROI: zero custo de produção para o maior evento de marketing do ano. Modelo replicado por Netflix, Duolingo e Uber — Spotify foi o pioneiro.", fonte: "Spotify Marketing Annual Report 2025" },
    { titulo: "Descoberta algorítmica: Discover Weekly com 30mi de ouvintes únicos", conteudo: "Discover Weekly (lançado em 2015) tem 30mi de ouvintes únicos por semana — a playlist mais ouvida do mundo. Artistas independentes que 'explodem' via Discover Weekly geram receita adicional de US$ 500k-2mi sem custo de marketing. Fidelização: usuários com playlist personalizada têm churn 60% menor.", fonte: "Spotify Loud & Clear 2025" },
    { titulo: "Podcasts: US$ 1bi investido, liderança com 250mi de ouvintes", conteudo: "Spotify é a maior plataforma de podcasts do mundo com 250mi de ouvintes mensais. Investimento de US$ 1bi em exclusivos (Joe Rogan, Obama) gerou 40% de crescimento na categoria. The Joe Rogan Experience sozinho atraiu 11mi de novos assinantes Premium — ROI positivo em 18 meses.", fonte: "Spotify Podcast Report 2025" },
    { titulo: "Spotify for Artists: ferramenta de retenção de criadores", conteudo: "Spotify for Artists tem 1.2mi de artistas ativos — dados de streaming em tempo real, ferramentas de pitch para playlists editoriais e campanhas de Marquee (promoção paga). Artistas com acesso ao painel têm 3x mais probabilidade de lançar exclusivamente no Spotify.", fonte: "Spotify Creator Economy Report 2025" },
    { titulo: "Bundling Spotify Premium Duo/Família: redução de churn em 55%", conteudo: "Planos Duo (2 pessoas) e Família (6 pessoas) representam 38% da receita Premium. Churn dos planos família é 55% menor que individual — custo de aquisição amortizado por múltiplos usuários. Desconto efetivo de 40% por usuário cria lock-in por ciclo de vida familiar.", fonte: "Spotify Q4/2025 Earnings" },
  ],
  previsao_clima: CLIMA_SP,
  gamificacao_log: [
    { acao: "Spotify Wrapped Viral — Top 3 Trending Brasil", pontos: 200 },
    { acao: "Churn Premium Abaixo de 3.5% no Trimestre", pontos: 150 },
    { acao: "Novo Artista Brasileiro no Top 50 Global", pontos: 100 },
  ],
  pesquisa: { resumo: "Brasil é o 4º maior mercado de streaming musical do mundo — 58mi de ouvintes mensais ativos. Spotify lidera com 67% de market share. Penetração de streaming pago: 38% dos ouvintes ativos. Sertanejo representa 32% do consumo, seguido de funk (18%) e pop (15%). Podcasts: crescimento de 45% em 2025 — Brasil é o 2º maior mercado de podcasts do mundo." },
  timeline: [
    { id: '1', data: '05 Mai', tipo: 'mercado', icone: '📈', titulo: 'Apple Music Classic chegou ao Brasil — 100mi de faixas clássicas grátis', detalhe: 'Apple Music Classical lançado no Brasil — catálogo exclusivo de música clássica sem custo adicional. Ameaça indireta: Spotify não tem catálogo clássico curado. Artistas clássicos representam 8% do nosso catálogo premium. Ação: lançar Spotify Classical em parceria com Deutsche Grammophon.' },
    { id: '2', data: '03 Mai', tipo: 'concorrente', icone: '⚡', titulo: 'YouTube Music atingiu 100mi de assinantes — 3x mais que Tidal', detalhe: 'YouTube Music reportou 100mi de assinantes pagos globais — crescimento de 28% YoY. No Brasil, YT Music está incluso no YouTube Premium (R$ 29,90/mês) — proposta de valor maior que Spotify Individual (R$ 21,90). Risco: bundle YouTube premium atrai usuário jovem.' },
    { id: '3', data: '01 Mai', tipo: 'mercado', icone: '🌊', titulo: 'ECAD vai ao STF pedir revisão de royalties para streaming — impacto de R$ 280mi', detalhe: 'ECAD (arrecadação de direitos autorais) entrou com ação no STF pedindo revisão da base de cálculo de royalties para streaming. Cenário adverso: royalties do Spotify no Brasil podem subir de 52% para 61% da receita. Custo adicional estimado: R$ 280mi/ano — equipe jurídica monitorando.' },
    { id: '4', data: '28 Abr', tipo: 'concorrente', icone: '📦', titulo: 'Deezer firmou parceria com TIM — incluso em 15mi de linhas pós-pagas', detalhe: 'Deezer fechou parceria com TIM Brasil — Deezer incluído gratuitamente em todos os planos pós-pagos acima de R$ 69,90. 15mi de linhas TIM pós-pagas = 15mi de usuários Deezer potenciais. Monitorar impacto em mercado jovem onde TIM é forte.' },
    { id: '5', data: '25 Abr', tipo: 'concorrente', icone: '🏪', titulo: 'Joe Rogan renovou exclusividade com Spotify por US$ 250mi — 5 anos', detalhe: 'Joe Rogan assinou renovação de contrato com Spotify por US$ 250mi (5 anos). The Joe Rogan Experience mantém 14mi de ouvintes/episódio — maior podcast do mundo. Impacto: competidores sem acesso ao JRE perdem 8-12% de usuários potenciais na base masculina 25-44.' },
  ],
};

const AIRBNB_DATA: OmniData = {
  negocio: { nome_fantasia: "Airbnb", segmento: "Viagens & Hospitalidade", cidade: "São Paulo", estado: "SP", telefone: "(11) 4130-9000", nivel: 5, pontos: 4750 },
  semana_label: "Semana de 06 de Maio de 2026",
  mercado_nome: "Aluguel por Temporada & Viagens",
  mercado_tamanho: "R$ 12.4bi/ano no Brasil",
  ranking_local: 1, progresso_pct: 95, nivel_label: "Líder Global de Hospitalidade", pontos_proximo: 5000,
  concorrentes: [
    { nome: "Booking.com Brasil", nota_google: 4.2, endereco: "Av. das Nações Unidas, 12.399", cidade: "São Paulo", faixa_preco: "$$", proposta_principal: "OTA líder com hotéis, pousadas e apartamentos — 28mi de listagens globais", diferencial: "Inventário de hotéis é 10x maior que Airbnb — atinge viajante de negócios que prefere hotel tradicional", faz_bem: ["Variedade de hotéis", "Pontuação de avaliação confiável", "Cancelamento grátis"], nao_oferece: ["Experiências locais autênticas", "Propriedades únicas (castelos, cabanas)", "Comunidade de hosts"], mudancas_recentes: ["Genius 3 com benefícios para viajantes frequentes", "Expandiu apartamentos para 6mi de listagens"], notas_digitais: [{ plataforma: "Trustpilot", nota: 4.2 }, { plataforma: "Google", nota: 4.0 }] },
    { nome: "VRBO Brasil (Expedia)", nota_google: 3.9, endereco: "—", cidade: "São Paulo", faixa_preco: "$$$", proposta_principal: "Aluguel de casas inteiras para famílias — foco em propriedades premium de temporada", diferencial: "Apenas casas inteiras — sem quartos compartilhados, posicionamento para famílias e grupos grandes", faz_bem: ["Casas inteiras premium", "Suporte 24h", "Integração com Expedia"], nao_oferece: ["Experiências locais", "Quartos individuais", "Preço competitivo de entrada"], mudancas_recentes: ["VRBO integrado ao Expedia One Key loyalty", "Expandiu para 160.000 propriedades no Brasil"], notas_digitais: [{ plataforma: "Trustpilot", nota: 3.9 }] },
    { nome: "Decolar.com", nota_google: 3.7, endereco: "Av. Paulista, 807", cidade: "São Paulo", faixa_preco: "$$", proposta_principal: "OTA brasileira com voos, hotéis e pacotes — forte em pacotes turísticos completos", diferencial: "Pacotes all-inclusive: voo + hotel + transfer em um clique — conveniência para o brasileiro que quer praticidade", faz_bem: ["Pacotes completos", "Conteúdo em português", "Suporte local"], nao_oferece: ["Propriedades únicas", "Experiências locais", "Estadias longas com desconto"], mudancas_recentes: ["Parceria com Latam Airlines para pacotes exclusivos", "App redesenhado com IA de busca de voos baratos"], notas_digitais: [{ plataforma: "Reclame Aqui", nota: 3.5 }, { plataforma: "Google", nota: 3.7 }] },
    { nome: "Hoteis.com (Expedia)", nota_google: 4.0, endereco: "—", cidade: "São Paulo", faixa_preco: "$$", proposta_principal: "Plataforma de reserva de hotéis com programa de fidelidade — 1 noite grátis a cada 10", diferencial: "Programa 'Colete 10, Ganhe 1' — única OTA com noite gratuita garantida, fideliza viajante frequente", faz_bem: ["Programa de noites gratuitas", "Variedade de hotéis", "App bem avaliado"], nao_oferece: ["Aluguel por temporada", "Experiências locais", "Propriedades únicas"], mudancas_recentes: ["Migrado para Expedia One Key — pontos unificados com Vrbo e Expedia", "Hoteis.com Business lançado para viajantes corporativos"], notas_digitais: [{ plataforma: "App Store", nota: 4.0 }] },
    { nome: "Alugue Temporada (Brasil)", nota_google: 3.6, endereco: "R. Maranhão, 481 — Higienópolis", cidade: "São Paulo", faixa_preco: "$", proposta_principal: "Plataforma brasileira de aluguel por temporada — foco em praia e temporada de verão", diferencial: "Conteúdo 100% nacional + suporte em português com horário comercial local — menor atrito cultural", faz_bem: ["Destinos brasileiros", "Suporte em português", "Preço menor (menos comissão)"], nao_oferece: ["Cobertura internacional", "App de qualidade competitiva", "Experiências locais"], mudancas_recentes: ["Parceria com Banco do Brasil para financiamento de temporada", "Expandiu para 180.000 imóveis no Brasil"], notas_digitais: [{ plataforma: "Reclame Aqui", nota: 3.4 }] },
  ],
  fornecedores: [
    { nome: "Stripe (Pagamentos)", cidade: "San Francisco, CA", estado: "US", telefone: "+1 888 963 8358", email: "partnerships@stripe.com", preco_referencia: 0, produto_servico: "Processamento de pagamentos em 190 países — split automático entre hóspede, Airbnb e host em tempo real" },
    { nome: "AWS (Amazon Web Services)", cidade: "Seattle, WA", estado: "US", telefone: "+1 206 266 1000", email: "travel@aws.amazon.com", preco_referencia: 0, produto_servico: "Infraestrutura de plataforma — busca, reservas e sistema de avaliação para 7mi de anúncios globais" },
    { nome: "Google Maps Platform", cidade: "Mountain View, CA", estado: "US", telefone: "+1 650 253 0000", email: "maps@google.com", preco_referencia: 0, produto_servico: "APIs de mapeamento e geolocalização — busca por mapa, rotas e pontos de interesse nos anúncios" },
    { nome: "Superhost Partners (Rede)", cidade: "São Paulo", estado: "SP", telefone: "—", email: "superhosts@airbnb.com", preco_referencia: 0, produto_servico: "Rede de 500k+ Superhosts globais (20k no Brasil) — geram 30% das reservas com NPS 30% acima da média" },
    { nome: "AXA Insurance (Seguro)", cidade: "Paris", estado: "FR", telefone: "+33 1 47 74 46 00", email: "partnerships@axa.com", preco_referencia: 0, produto_servico: "Seguro AirCover — proteção de até US$ 3mi por propriedade para danos e responsabilidade civil" },
  ],
  praticas: [
    { titulo: "Superhost: programa de qualidade que se vende sozinho", conteudo: "Superhosts (4.8+ estrelas, taxa de resposta >90%, <1% cancelamento) têm 40% mais reservas e cobram 12% a mais. O badge Superhost é o maior ativo de conversão da plataforma — hóspedes pagam mais para garantir experiência. 20.000 Superhosts no Brasil geram 38% da receita local.", fonte: "Airbnb Superhost Report 2025" },
    { titulo: "Experiências Airbnb: diversificação com margem de 82%", conteudo: "Airbnb Experiences (tours, aulas, experiências locais) cresceu 67% em 2025 — margem de 82% vs 15% em hospedagem. Brasil tem 2.400 experiências ativas — capoeira, gastronomia e ecoturismo lideram. Ticket médio: R$ 180/pessoa. Usuários que fazem Experiences têm NPS 28pts acima da média.", fonte: "Airbnb Experiences Annual 2025" },
    { titulo: "Estadias longas (+28 dias): novo mercado pós-pandemia", conteudo: "Estadias longas (28+ dias) representam 21% das noites reservadas — crescimento de 150% desde 2019. Trabalho remoto criou a categoria de 'nômade digital'. Brasil é o 3º maior destino de estadias longas da América do Sul. Desconto médio de 30% para mensalidade atrai freelancers internacionais.", fonte: "Airbnb Long-Term Stay Report 2025" },
    { titulo: "Precificação dinâmica: algoritmo que maximiza receita do host", conteudo: "Smart Pricing ajusta preço automaticamente por demanda, sazonalidade, eventos locais e competidores. Hosts que usam Smart Pricing têm 16% mais receita anual. Durante eventos de grande porte (Rock in Rio, Carnaval), preços sobem 3-5x automaticamente — maximizando receita sem ação manual.", fonte: "Airbnb Host Tools 2025" },
    { titulo: "Anti-party features: proteção da reputação como estratégia B2B", conteudo: "Sistema de Party Prevention bloqueia reservas de 1 noite em finais de semana para contas novas. Câmeras externas verificadas e vizinhos notificados opcionalmente. Redução de 40% em ocorrências de festas desde 2023. Resultado: regulação favorável em cidades que ameaçavam banir o Airbnb.", fonte: "Airbnb Community Policy 2025" },
  ],
  previsao_clima: CLIMA_SP,
  gamificacao_log: [
    { acao: "Novo Recorde de Noites Reservadas no Brasil", pontos: 200 },
    { acao: "NPS de Hóspedes Acima de 75", pontos: 150 },
    { acao: "Meta de Superhosts no Brasil Atingida", pontos: 100 },
  ],
  pesquisa: { resumo: "Mercado de aluguel por temporada no Brasil movimentou R$ 12.4bi em 2025. Airbnb domina com 67% de market share e 1.2mi de anúncios ativos no país. Rio de Janeiro é o 3º destino mais listado do mundo. Temporada de verão (dez–jan) representa 34% da receita anual. Média de avaliação dos anfitriões brasileiros: 4.71 estrelas — acima da média global de 4.65." },
  timeline: [
    { id: '1', data: '05 Mai', tipo: 'mercado', icone: '📈', titulo: 'EMBRATUR lançou campanha "Brasil, o Destino" — R$ 800mi em marketing internacional', detalhe: 'EMBRATUR anunciou campanha de R$ 800mi para atrair turistas internacionais ao Brasil (2026-2028). Foco: Copa do Mundo 2030 (Brasil é sede) — demanda estimada de 6.5mi de turistas internacionais. Airbnb tem capacidade para absorver 40% dessa demanda vs 28% dos hotéis tradicionais.' },
    { id: '2', data: '03 Mai', tipo: 'concorrente', icone: '⚡', titulo: 'Booking.com lançou "Booking Homes" com 8mi de propriedades únicas', detalhe: 'Booking.com relançou categoria de aluguel de temporada como "Booking Homes" — 8mi de propriedades globais. Integração com 500mi de usuários cadastrados é o principal diferencial. Ação: reforçar proposta de autenticidade e comunidade de hosts vs volume de inventário do Booking.' },
    { id: '3', data: '01 Mai', tipo: 'mercado', icone: '🌊', titulo: 'Câmara aprovou PL que regulamenta Airbnb — IPTU e licença obrigatória', detalhe: 'PL 2630/2025 aprovado em 1ª votação — exige licença municipal e recolhimento de IPTU comercial para imóveis usados em plataformas de aluguel por temporada acima de 180 dias/ano. Custo estimado para hosts: +R$ 3.200/ano em média. Risco: redução de 15-20% no inventário ativo no Brasil.' },
    { id: '4', data: '28 Abr', tipo: 'fornecedor', icone: '📦', titulo: 'Stripe aumentou taxa de processamento no Brasil para 3.2% + R$ 0,60', detalhe: 'Stripe anunciou reajuste de 2.9% para 3.2% nas transações em real a partir de jun/2026. Impacto: custo adicional de R$ 18mi/ano nas transações brasileiras. Opções: negociar desconto por volume (Airbnb processa R$ 6bi/ano no Brasil) ou avaliar alternativas como Adyen para mercado local.' },
    { id: '5', data: '25 Abr', tipo: 'concorrente', icone: '🏪', titulo: 'Decolar lançou "Casa Decolar" — aluguel por temporada com bundle de voos', detalhe: 'Decolar lançou categoria de aluguel por temporada com bundle de voo + acomodação. 45.000 propriedades cadastradas no lançamento — foco em destinos de praia brasileiros. Diferencial: 1 clique para reservar voo + casa + transfer. Risco: atinge viajante brasileiro que prefere praticidade ao preço.' },
  ],
};

const UBER_DATA: OmniData = {
  negocio: { nome_fantasia: "Uber", segmento: "Mobilidade Urbana & Logística", cidade: "São Paulo", estado: "SP", telefone: "(11) 4130-6000", nivel: 5, pontos: 4830 },
  semana_label: "Semana de 06 de Maio de 2026",
  mercado_nome: "Mobilidade Urbana & Entrega sob Demanda",
  mercado_tamanho: "R$ 22bi/ano no Brasil",
  ranking_local: 1, progresso_pct: 96, nivel_label: "Líder de Mobilidade Urbana", pontos_proximo: 5000,
  concorrentes: [
    { nome: "99 (DiDi) Brasil", nota_google: 4.0, endereco: "Av. Faria Lima, 4440", cidade: "São Paulo", faixa_preco: "$", proposta_principal: "Plataforma brasileira de mobilidade (adquirida pelo DiDi) com foco em preço e motoristas", diferencial: "Marca percebida como 'brasileira' — menos regulação negativa + preço médio 12% menor que Uber", faz_bem: ["Preço mais baixo", "Remuneração de motoristas maior", "Corridas de moto (99Moto)"], nao_oferece: ["Uber Eats equivalente", "Uber for Business robusto", "Cobertura em cidades menores"], mudancas_recentes: ["99Pop com preço congelado — campanha contra aumento da Uber", "99Food lançado em São Paulo e Rio"], notas_digitais: [{ plataforma: "Google Play", nota: 4.0 }, { plataforma: "App Store", nota: 3.9 }] },
    { nome: "inDriver Brasil", nota_google: 4.2, endereco: "—", cidade: "São Paulo", faixa_preco: "$", proposta_principal: "Plataforma de corrida onde passageiro propõe o preço e motorista aceita ou negocia", diferencial: "Modelo de negociação elimina algoritmo — motoristas preferem inDriver por ter controle do preço", faz_bem: ["Modelo de preço negociado", "Zero algoritmo de precificação", "Crescimento em cidades médias"], nao_oferece: ["Uber Eats / delivery", "Uber Business", "Suporte ao usuário escalável"], mudancas_recentes: ["inDriver atingiu 100mi de usuários globais", "Lançou inDriver Cargo para frete urbano"], notas_digitais: [{ plataforma: "Google Play", nota: 4.2 }] },
    { nome: "Cabify Brasil", nota_google: 4.3, endereco: "Av. Rebouças, 1585", cidade: "São Paulo", faixa_preco: "$$$", proposta_principal: "Mobilidade premium espanhola com foco em corporativo — frota própria e contrato B2B", diferencial: "Único com frota própria (não terceirizada) — previsibilidade de qualidade para cliente corporativo", faz_bem: ["Atendimento corporativo", "Previsibilidade de qualidade", "App sem publicidade"], nao_oferece: ["Delivery de comida", "Preço popular", "Cobertura nacional ampla"], mudancas_recentes: ["Parceria com empresas Fortune 500 para mobilidade corporativa", "Cabify Bikes em São Paulo e Rio"], notas_digitais: [{ plataforma: "Google Play", nota: 4.3 }] },
    { nome: "Rappi (transporte)", nota_google: 3.8, endereco: "Av. JK, 2235", cidade: "São Paulo", faixa_preco: "$$", proposta_principal: "Super-app colombiano com delivery + mobilidade + mercado — tudo em um app", diferencial: "Super-app: 1 app para delivery, mercado, farmácia, transporte e serviços financeiros — conveniência total", faz_bem: ["Ecossistema completo", "RappiPrime com entrega grátis ilimitada", "Rappi Pay com cashback"], nao_oferece: ["Qualidade de motorista comparável", "Cobertura de motoristas nas periferias", "Experiência de app limpa"], mudancas_recentes: ["Rappi atingiu 1mi de pedidos/dia no Brasil", "Parceria com Santander para Rappi Card"], notas_digitais: [{ plataforma: "Google Play", nota: 3.8 }] },
    { nome: "Loggi (frete)", nota_google: 4.1, endereco: "Av. Paulista, 1374", cidade: "São Paulo", faixa_preco: "$$", proposta_principal: "Plataforma de logística last-mile para e-commerce e entrega corporativa no Brasil", diferencial: "Foco B2B — integração com Shopify/VTEX para entrega same-day em 150 cidades brasileiras", faz_bem: ["Integração e-commerce", "Same-day delivery", "Rastreio em tempo real"], nao_oferece: ["Transporte de passageiros", "Super-app consumer", "Cobertura nacional rural"], mudancas_recentes: ["Loggi atingiu R$ 1.2bi em GMV", "Parceria com Shopify para fulfillment"], notas_digitais: [{ plataforma: "Reclame Aqui", nota: 4.1 }] },
  ],
  fornecedores: [
    { nome: "Google Maps Platform", cidade: "Mountain View, CA", estado: "US", telefone: "+1 650 253 0000", email: "maps@google.com", preco_referencia: 0, produto_servico: "APIs de roteamento, ETA e geolocalização — backbone de navegação para motoristas e estimativas" },
    { nome: "AWS (Amazon Web Services)", cidade: "Seattle, WA", estado: "US", telefone: "+1 206 266 1000", email: "mobility@aws.amazon.com", preco_referencia: 0, produto_servico: "Infraestrutura de matching entre passageiro e motorista — processamento de 25mi de corridas/dia no Brasil" },
    { nome: "Braintree (PayPal)", cidade: "Chicago, IL", estado: "US", telefone: "+1 866 728 3939", email: "partnerships@braintree.com", preco_referencia: 0, produto_servico: "Processamento de pagamentos globais — cartões, Pix e carteiras digitais em 65 países" },
    { nome: "HERE Technologies", cidade: "Amsterdam", estado: "NL", telefone: "+31 20 480 0000", email: "mobility@here.com", preco_referencia: 0, produto_servico: "Dados de mapa e tráfego em tempo real — backup de routing e dados de congestionamento em tempo real" },
    { nome: "Twilio (Comunicação)", cidade: "San Francisco, CA", estado: "US", telefone: "+1 415 390 2337", email: "partnerships@twilio.com", preco_referencia: 0, produto_servico: "SMS, notificações push e ligações mascaradas entre motorista e passageiro — privacidade de número" },
  ],
  praticas: [
    { titulo: "Surge Pricing: algoritmo que equilibra oferta e demanda", conteudo: "Preço dinâmico (surge) aumenta em até 5x durante pico — atrai mais motoristas para zonas de demanda alta, reduzindo tempo de espera de 8min para 3min. Em São Paulo, 3% do tempo opera em surge mas gera 18% da receita. Motoristas ganham 40% mais por hora em surge — maior driver de satisfação do parceiro.", fonte: "Uber Movement Data Brazil 2025" },
    { titulo: "Uber One: assinatura como motor de recorrência", conteudo: "Uber One (R$ 29,90/mês) oferece sem taxa de entrega no Eats + 10% de desconto em corridas. Assinantes fazem 3.2x mais corridas e 4.1x mais pedidos Eats vs não-assinantes. LTV do assinante Uber One é 7x maior. Brasil tem 4.2mi de assinantes Uber One — crescimento de 95% em 2025.", fonte: "Uber One Brazil Report 2025" },
    { titulo: "Uber for Business: B2B como canal de menor churn", conteudo: "Uber for Business (corporativo) tem 40.000 empresas no Brasil — ticket médio 2.3x maior que usuário pessoal. Churn corporativo é 90% menor: decisão de cancelamento passa por RH, não pelo indivíduo. Reembolso automático e relatórios de despesas integram com ERPs — fidelização por processo.", fonte: "Uber for Business LATAM 2025" },
    { titulo: "Green: frota elétrica como diferencial ESG e de custo", conteudo: "Uber Green (veículos elétricos e híbridos) cresceu 180% no Brasil em 2025 — 12.000 motoristas EV. Custo operacional do motorista EV é 35% menor — repassado em pricing mais competitivo. Empresas com política ESG preferem Uber Green para deslocamentos corporativos: 28% do mix Uber Business.", fonte: "Uber Sustainability Report 2025" },
    { titulo: "Safety Toolkit: produto de segurança como retenção de usuário", conteudo: "Verificação RG + selfie de motorista antes de cada corrida, botão SOS, compartilhamento de rota em tempo real. 78% dos usuários citam segurança como razão principal para preferir Uber vs alternativas. Safety Toolkit reduziu incidentes em 62% desde 2021 — dado público para pressionar reguladores.", fonte: "Uber Safety Report 2025" },
  ],
  previsao_clima: CLIMA_SP,
  gamificacao_log: [
    { acao: "Novo Recorde de Corridas em São Paulo — 2.1mi/dia", pontos: 200 },
    { acao: "NPS de Passageiros Acima de 72", pontos: 150 },
    { acao: "Meta de Assinantes Uber One no Brasil", pontos: 100 },
  ],
  pesquisa: { resumo: "Mercado de mobilidade urbana no Brasil movimentou R$ 22bi em 2025. Uber lidera com 68% de market share, seguida de 99 (23%) e outros (9%). Brasil é o 2º maior mercado da Uber no mundo (atrás dos EUA). São Paulo: 2.1mi de corridas/dia. Motoristas ativos no Brasil: 1.2mi. Penetração de apps de mobilidade em SP: 82% dos adultos usam ao menos 1x/mês." },
  timeline: [
    { id: '1', data: '05 Mai', tipo: 'mercado', icone: '📈', titulo: 'Prefeitura de SP aprovou regulação de mototáxi — Uber Moto pode expandir', detalhe: 'Câmara Municipal de São Paulo aprovou regulação de mototáxi digital — Uber Moto pode operar legalmente em toda a cidade a partir de ago/2026. Potencial: 800k corridas/dia em SP só de mototáxi. 99Moto já opera ilegalmente com 150k corridas/dia — Uber Moto legalizado tem vantagem competitiva.' },
    { id: '2', data: '03 Mai', tipo: 'concorrente', icone: '⚡', titulo: '99 lançou 99Pop com preço congelado por 30 dias — campanha anti-Uber', detalhe: '99 lançou campanha com preço congelado de R$ 7,90 por corridas curtas no 99Pop — duração de 30 dias. Financiado pela DiDi com prejuízo intencional para ganhar market share. Monitorar impacto na demanda de UberX em São Paulo. Resposta possível: Uber Juntos (carpool) com preço reduzido.' },
    { id: '3', data: '01 Mai', tipo: 'mercado', icone: '🌊', titulo: 'ANTT publicou resolução — plataformas de mobilidade devem segurar motoristas', detalhe: 'ANTT (Agência Nacional de Transportes Terrestres) publicou resolução exigindo seguro de vida para motoristas de app a partir de jan/2027. Custo estimado para Uber: R$ 180-220mi/ano. Positivo: eleva custo de entrada para novos competidores e pode ser repassado como diferencial ao motorista.' },
    { id: '4', data: '28 Abr', tipo: 'fornecedor', icone: '📦', titulo: 'Google Maps API reajustou preços em 22% para plataformas de mobilidade', detalhe: 'Google Maps Platform anunciou reajuste de 22% nas APIs de routing e geolocalização para plataformas com >1bi de chamadas/mês. Impacto estimado para Uber Brasil: US$ 28mi adicionais/ano. Opções: migrar parcialmente para HERE Technologies ou OpenStreetMap para reduzir dependência.' },
    { id: '5', data: '25 Abr', tipo: 'concorrente', icone: '🏪', titulo: 'inDriver atingiu 100mi de usuários globais — crescendo no interior do Brasil', detalhe: 'inDriver reportou 100mi de usuários globais — crescimento de 45% YoY. No Brasil, foco em cidades médias (50-500k habitantes) onde Uber tem menos motoristas. inDriver tem 18% de market share em cidades de 100-500k hab — crescendo para cidades que Uber não prioriza.' },
  ],
};

const APPLE_DATA: OmniData = {
  negocio: { nome_fantasia: "Apple", segmento: "Eletrônicos & Ecossistema Digital", cidade: "São Paulo", estado: "SP", telefone: "(11) 4780-0000", nivel: 5, pontos: 4980 },
  semana_label: "Semana de 06 de Maio de 2026",
  mercado_nome: "Smartphones Premium & Ecossistema Digital",
  mercado_tamanho: "R$ 45bi/ano no Brasil",
  ranking_local: 1, progresso_pct: 99, nivel_label: "Empresa Mais Valiosa do Mundo", pontos_proximo: 5000,
  concorrentes: [
    { nome: "Samsung Brasil", nota_google: 4.2, endereco: "Av. Paulista, 2001", cidade: "São Paulo", faixa_preco: "$$", proposta_principal: "Líder global em volume de smartphones com linha Galaxy S, A e Z Fold", diferencial: "Maior distribuição e variedade de preço — do Galaxy A14 (R$ 999) ao Z Fold 6 (R$ 12.999) em um ecossistema", faz_bem: ["Distribuição ampla", "Variedade de faixas de preço", "Câmera Zoom Galaxy S Ultra"], nao_oferece: ["Ecossistema fechado integrado", "Valorização residual do produto", "Privacidade como produto"], mudancas_recentes: ["Galaxy AI lançado com Circle to Search e Live Translate", "Z Fold 6 com preço abaixo do esperado: R$ 11.999"], notas_digitais: [{ plataforma: "Reclame Aqui", nota: 4.0 }, { plataforma: "Google", nota: 4.2 }] },
    { nome: "Xiaomi Brasil", nota_google: 4.1, endereco: "Av. das Nações Unidas, 14401", cidade: "São Paulo", faixa_preco: "$", proposta_principal: "Smartphones premium a preço acessível — Xiaomi 14 Ultra com câmera Leica por R$ 5.999", diferencial: "Relação custo-benefício imbatível: especificações de flagship por 40-60% do preço da Apple", faz_bem: ["Custo-benefício", "Câmera Leica (linha 14)", "Carregamento ultrarrápido 90W"], nao_oferece: ["Ecossistema integrado", "Valorização residual", "Suporte pós-venda robusto"], mudancas_recentes: ["Xiaomi 14 Ultra com Leica lançado por R$ 5.999 no Brasil", "Xiaomi HyperOS unifica celulares, TVs e wearables"], notas_digitais: [{ plataforma: "Reclame Aqui", nota: 3.7 }, { plataforma: "Google", nota: 4.1 }] },
    { nome: "Motorola Brasil (Lenovo)", nota_google: 4.0, endereco: "Av. das Nações Unidas, 12.399", cidade: "São Paulo", faixa_preco: "$", proposta_principal: "Smartphones intermediários e dobráveis com foco no mercado brasileiro — Razr e Edge", diferencial: "Marca de herança forte no Brasil + fábrica local em Manaus (Moto G) — menor imposto = melhor preço", faz_bem: ["Marca confiável", "Preço competitivo no mid-range", "Razr (dobrável) por R$ 4.999"], nao_oferece: ["Ecossistema de serviços", "Câmera de ponta", "Atualizações longas (5+ anos)"], mudancas_recentes: ["Moto G84 fabricado em Manaus com incentivo fiscal", "Razr 50 Ultra lançado por R$ 4.999"], notas_digitais: [{ plataforma: "Reclame Aqui", nota: 4.0 }] },
    { nome: "Google Pixel (Brasil)", nota_google: 4.4, endereco: "—", cidade: "São Paulo", faixa_preco: "$$$", proposta_principal: "Smartphone Google com IA nativa — Gemini, Magic Eraser e 7 anos de atualização garantidos", diferencial: "IA do Google nativa no hardware — funcionalidades exclusivas que nenhum outro Android tem", faz_bem: ["Gemini AI integrado", "7 anos de update garantido", "Câmera computacional líder"], nao_oferece: ["Distribuição física no Brasil", "Rede de assistência técnica local", "Preço competitivo vs Samsung"], mudancas_recentes: ["Pixel 9 com Gemini Ultra — disponível no Brasil via importação", "Tensor G4 processa IA localmente sem nuvem"], notas_digitais: [{ plataforma: "Google", nota: 4.4 }] },
    { nome: "Huawei Brasil", nota_google: 3.6, endereco: "Av. das Nações Unidas, 8.501", cidade: "São Paulo", faixa_preco: "$$$", proposta_principal: "Ecossistema Huawei com HarmonyOS — sem Google, mas câmera Leica líder de categoria", diferencial: "Câmera Leica co-desenvolvida permanece referência de fotografia — Mate 60 supera iPhone em zoom", faz_bem: ["Câmera Leica premium", "Build quality", "Ecossistema HarmonyOS (na China)"], nao_oferece: ["Google Play e apps nativos", "Software sem restrição de exportação", "Suporte no Brasil"], mudancas_recentes: ["Mate 60 Pro com chip Kirin 9000S fabricado na China — dribles às sanções EUA", "HarmonyOS 4 com IA generativa embarcada"], notas_digitais: [{ plataforma: "Google", nota: 3.6 }] },
  ],
  fornecedores: [
    { nome: "TSMC (Taiwan)", cidade: "Hsinchu", estado: "TW", telefone: "+886 3 563 6688", email: "business@tsmc.com", preco_referencia: 0, produto_servico: "Fabricação exclusiva do chip A18 Pro (3nm) para iPhone 16 Pro — único fornecedor de chips Apple Silicon" },
    { nome: "Samsung Display (Coreia)", cidade: "Yongin", estado: "KR", telefone: "+82 31 200 1114", email: "display@samsung.com", preco_referencia: 0, produto_servico: "Painéis OLED ProMotion 120Hz para iPhone 16 — 60% dos painéis OLED do iPhone são Samsung" },
    { nome: "Sony Semiconductor (Japão)", cidade: "Kumamoto", estado: "JP", telefone: "+81 96 373 2111", email: "imaging@sony.com", preco_referencia: 0, produto_servico: "Sensores de câmera IMX 48MP para iPhone 16 Pro — sensor principal de toda a linha Pro" },
    { nome: "Foxconn (Hon Hai)", cidade: "Shenzhen", estado: "CN", telefone: "+86 755 8192 9999", email: "apple@foxconn.com", preco_referencia: 0, produto_servico: "Montagem final de iPhones em Zhengzhou (China) e Chennai (Índia) — 50% do volume de iPhone 16" },
    { nome: "Corning (EUA)", cidade: "Corning, NY", estado: "US", telefone: "+1 607 974 9000", email: "ceramic@corning.com", preco_referencia: 0, produto_servico: "Vidro Ceramic Shield para tela do iPhone — exclusivo Apple, co-desenvolvido para durabilidade 4x maior" },
  ],
  praticas: [
    { titulo: "Serviços: US$ 100bi/ano — a Apple além do hardware", conteudo: "Apple Services (App Store, iCloud, Apple TV+, Music, Pay) faturou US$ 100bi em 2025 — 26% da receita total com margem de 73% vs 36% do hardware. Serviços crescem 15% ao ano mesmo com vendas de iPhone estáveis. Cada iPhone vendido é a porta de entrada para US$ 400/ano em serviços recorrentes.", fonte: "Apple Q4/2025 Earnings" },
    { titulo: "Privacidade como produto: diferencial vs Android", conteudo: "Privacy Nutrition Labels, App Tracking Transparency e Lockdown Mode são recursos exclusivos do iOS. 92% dos usuários Apple citam privacidade como razão para não migrar para Android. ATT (App Tracking Transparency) custou R$ 800mi em receita de publicidade para Meta — fortalecendo posicionamento Apple como aliado do usuário.", fonte: "Apple Privacy Report 2025" },
    { titulo: "Ecossistema: lock-in por conveniência, não por contrato", conteudo: "Handoff, AirDrop, iMessage, AirPlay e Continuity Camera criam integração seamless entre iPhone, Mac, iPad e Watch. Usuário com 2+ dispositivos Apple tem churn 8x menor. Apple Watch 70% de market share em smartwatches — funciona completo apenas com iPhone. Cada produto Apple vende o próximo.", fonte: "Apple Ecosystem Report 2025" },
    { titulo: "Apple Silicon: independência de chip como vantagem estratégica", conteudo: "Migração de Intel para Apple Silicon (M1→M4) reduziu dependência de fornecedores externos e aumentou margem de Mac em 12pp. M4 Pro 3x mais eficiente por watt que Intel — MacBook Pro com 24h de bateria. Apple controla hardware + software + chip = único ator com stack completo.", fonte: "Apple Silicon Developer Report 2025" },
    { titulo: "Trade-in e recompra: mercado de usados como estratégia de upgrade", conteudo: "Apple Trade-in paga até R$ 4.200 pelo iPhone 14 Pro em bom estado — subsidia upgrade para linha mais nova. 35% das vendas de iPhone novo no Brasil têm trade-in. iPhone retém 70% do valor após 2 anos vs 35% do Android médio — argumento de TCO para converter usuário de faixa premium.", fonte: "Apple Retail Brazil 2025" },
  ],
  previsao_clima: CLIMA_SP,
  gamificacao_log: [
    { acao: "iPhone 16 Bateu Recorde de Vendas no Brasil", pontos: 200 },
    { acao: "App Store — Melhor Ecosistema pelo 8º Ano", pontos: 150 },
    { acao: "Apple Watch Manteve 70% de Market Share em Wearables", pontos: 100 },
  ],
  pesquisa: { resumo: "Mercado de smartphones premium (acima de R$ 4.000) no Brasil movimentou R$ 18bi em 2025. Apple lidera o segmento premium com 72% de market share acima de R$ 6.000. Total de iPhones ativos no Brasil: 58mi. Serviços Apple no Brasil: R$ 8.2bi/ano — App Store, iCloud e Apple TV+. Brasil é o 7º maior mercado global da Apple. Penetração de Mac no mercado corporativo cresceu de 18% para 31% nos últimos 3 anos." },
  timeline: [
    { id: '1', data: '05 Mai', tipo: 'mercado', icone: '📈', titulo: 'iPhone 16e lançado por R$ 4.299 — abre segmento mid-premium', detalhe: 'iPhone 16e lançado no Brasil por R$ 4.299 — menor preço de entrada em iPhone novo da história. Inclui chip A16 e Apple Intelligence. Objetivo: capturar usuário Android de R$ 3-5k que nunca considerou iPhone. Projeção: +800k novos usuários iOS no Brasil em 2026.' },
    { id: '2', data: '03 Mai', tipo: 'concorrente', icone: '⚡', titulo: 'Samsung Galaxy AI teve 200mi de ativações — maior feature de IA em Android', detalhe: 'Samsung reportou 200mi de ativações do Galaxy AI globalmente — Circle to Search e Live Translate são os features mais usados. No Brasil, Galaxy S25 cresceu 28% vs S24. Ação: reforçar Apple Intelligence como IA mais integrada ao sistema — funciona sem nuvem no iPhone 16 Pro.' },
    { id: '3', data: '01 Mai', tipo: 'mercado', icone: '🌊', titulo: 'CADE aprovou investigação do App Store — modelo de 30% sob escrutínio', detalhe: 'CADE (Conselho Administrativo de Defesa Econômica) abriu investigação formal sobre taxa de 30% da App Store no Brasil. União Europeia já multou Apple em €1.8bi. Risco: obrigação de abrir sideloading (instalação fora da App Store) no Brasil — impacto estimado de R$ 1.2bi/ano em receita de serviços.' },
    { id: '4', data: '28 Abr', tipo: 'fornecedor', icone: '📦', titulo: 'TSMC anunciou chip A19 em processo 2nm para iPhone 17 — produção em ago', detalhe: 'TSMC confirmou início de produção em massa do chip A19 em processo N2 (2nm) para agosto. iPhone 17 Pro terá A19 Pro com Neural Engine 40% mais rápido — processa modelos LLM de 3bi de parâmetros localmente. Impacto: Apple Intelligence sem dependência de nuvem — diferencial de privacidade ampliado.' },
    { id: '5', data: '25 Abr', tipo: 'concorrente', icone: '🏪', titulo: 'Xiaomi 14 Ultra com câmera Leica lançado por R$ 5.999 — divide mercado premium', detalhe: 'Xiaomi 14 Ultra chegou ao Brasil por R$ 5.999 com câmera Leica 1" e zoom 120x. Pontua melhor que iPhone 16 Pro Max em DxOMark (161 vs 158). Ameaça: usuário que troca de celular por câmera pode migrar. Resposta: iPhone 17 Ultra com câmera tetraprismática de 5x zoom + sensor maior confirmado para set/2026.' },
  ],
};

const AMAZON_DATA: OmniData = {
  negocio: { nome_fantasia: "Amazon", segmento: "E-commerce & Cloud Computing", cidade: "São Paulo", estado: "SP", telefone: "(11) 3728-3000", nivel: 5, pontos: 4960 },
  semana_label: "Semana de 06 de Maio de 2026",
  mercado_nome: "E-commerce, Logística & Cloud",
  mercado_tamanho: "R$ 210bi/ano no Brasil",
  ranking_local: 2, progresso_pct: 94, nivel_label: "2º Maior E-commerce do Brasil", pontos_proximo: 5000,
  concorrentes: [
    { nome: "Mercado Livre Brasil", nota_google: 4.2, endereco: "Av. das Nações Unidas, 3003", cidade: "São Paulo", faixa_preco: "$$", proposta_principal: "Líder absoluto do e-commerce brasileiro com marketplace, fintech (Mercado Pago) e logística (MELI)", diferencial: "Ecossistema financeiro integrado: Mercado Pago com 50mi de usuários — produto financeiro junto ao e-commerce sem par", faz_bem: ["Mercado Pago integrado", "Vendedores confiantes no mercado", "MELI Logística"], nao_oferece: ["Cloud computing (AWS)", "Streaming (Prime Video)", "Dispositivos próprios (Echo, Kindle)"], mudancas_recentes: ["Mercado Envios Full chegou a 98% do Brasil em D+1", "MELI atingiu R$ 400bi em volume total de pagamentos"], notas_digitais: [{ plataforma: "Reclame Aqui", nota: 3.9 }, { plataforma: "Google", nota: 4.2 }] },
    { nome: "Magazine Luiza (Magalu)", nota_google: 4.0, endereco: "Rua Boulevard Tamboré, 656", cidade: "Barueri", faixa_preco: "$$", proposta_principal: "Líder omnichannel brasileiro com 1.600 lojas físicas + e-commerce + marketplace + fintech", diferencial: "Presença física + digital: único e-commerce com 1.600 lojas para retirada, troca e assistência técnica presencial", faz_bem: ["Rede física para retirada", "Luizacred financiamento", "App com 60mi de usuários"], nao_oferece: ["Cloud computing", "Streaming", "Conteúdo digital"], mudancas_recentes: ["Magalu atingiu GMV de R$ 52bi em 2025", "Parceria com Shopee encerrada"], notas_digitais: [{ plataforma: "Reclame Aqui", nota: 3.8 }, { plataforma: "Google", nota: 4.0 }] },
    { nome: "Shopee Brasil", nota_google: 3.8, endereco: "Av. das Nações Unidas, 12.399", cidade: "São Paulo", faixa_preco: "$", proposta_principal: "Marketplace asiático com produtos ultra-baratos, gamificação e frete grátis agressivo", diferencial: "Frete grátis real (subsidiado pelo Sea Group) + gamificação de compra — maior engajamento de app do setor", faz_bem: ["Frete grátis subsidiado", "Gamificação (moedas, jogos)", "Preço mais baixo do mercado"], nao_oferece: ["Confiabilidade de prazo", "Serviço pós-venda", "Produtos originais garantidos"], mudancas_recentes: ["Shopee Pay lançado no Brasil com cashback de 15%", "Shopee Live (live commerce) com 2mi de espectadores/dia"], notas_digitais: [{ plataforma: "Reclame Aqui", nota: 3.2 }, { plataforma: "Google Play", nota: 3.8 }] },
    { nome: "Microsoft Azure (cloud)", nota_google: 4.3, endereco: "Av. das Nações Unidas, 12.551", cidade: "São Paulo", faixa_preco: "$$$", proposta_principal: "Plataforma cloud #2 global com foco em enterprise — Teams, Office 365, Azure AI e GitHub", diferencial: "Integração Office 365 + Azure = stack corporativo completo — CIO escolhe Azure para não ter 2 fornecedores", faz_bem: ["Integração Microsoft 365", "Azure OpenAI Service", "Hybrid cloud com Windows Server"], nao_oferece: ["E-commerce", "Marketplace B2C", "Dispositivos consumer"], mudancas_recentes: ["Azure OpenAI com GPT-4o disponível na região Brazil South", "Microsoft Cloud for Retail expandiu para 200 varejistas brasileiros"], notas_digitais: [{ plataforma: "Gartner", nota: 4.3 }] },
    { nome: "Google Cloud (GCP)", nota_google: 4.2, endereco: "R. Leopoldo Couto de Magalhães Jr., 700", cidade: "São Paulo", faixa_preco: "$$$", proposta_principal: "Plataforma cloud #3 com foco em dados, ML e Kubernetes — BigQuery e Vertex AI como diferenciais", diferencial: "BigQuery e Vertex AI são referência de mercado em analytics e ML — organizações data-first escolhem GCP", faz_bem: ["BigQuery (analytics)", "Vertex AI (ML)", "Kubernetes (GKE)"], nao_oferece: ["E-commerce", "Serviços consumer", "Ecosistema enterprise comparável ao Azure"], mudancas_recentes: ["GCP abriu 2ª região no Brasil (São Paulo + Rio)", "Gemini Ultra disponível via Vertex AI no Brasil"], notas_digitais: [{ plataforma: "Gartner", nota: 4.2 }] },
  ],
  fornecedores: [
    { nome: "Intel (Processadores)", cidade: "Santa Clara, CA", estado: "US", telefone: "+1 408 765 8080", email: "aws@intel.com", preco_referencia: 0, produto_servico: "Processadores Xeon para datacenters AWS — 40% da frota de servidores, sendo substituída por Graviton próprio" },
    { nome: "UPS Supply Chain Brasil", cidade: "São Paulo", estado: "SP", telefone: "(11) 3029-5700", email: "br.logistics@ups.com", preco_referencia: 0, produto_servico: "Logística last-mile para Amazon.com.br — entrega em 24-48h em 3.200 municípios brasileiros" },
    { nome: "Nvidia (GPUs para AI)", cidade: "Santa Clara, CA", estado: "US", telefone: "+1 408 486 2000", email: "cloud@nvidia.com", preco_referencia: 0, produto_servico: "GPUs H100 e H200 para infraestrutura de IA da AWS — Bedrock, SageMaker e Trainium" },
    { nome: "Foxconn Industrial (Echo/Kindle)", cidade: "Shenzhen", estado: "CN", telefone: "+86 755 8192 9999", email: "devices@foxconn.com", preco_referencia: 0, produto_servico: "Fabricação de dispositivos Amazon — Echo, Kindle e Fire TV para o mercado global" },
    { nome: "Samsung Semiconductors", cidade: "Suwon", estado: "KR", telefone: "+82 31 200 1114", email: "b2b@samsung.com", preco_referencia: 0, produto_servico: "Memória DRAM e SSDs para servidores AWS — 30% do armazenamento da frota de cloud da Amazon" },
  ],
  praticas: [
    { titulo: "AWS: 67% do lucro operacional da Amazon", conteudo: "AWS gerou US$ 105bi de receita em 2025 com margem de 38% — responsável por 67% do lucro operacional total da Amazon. E-commerce subsidia crescimento mas AWS paga os dividendos. Brasil: AWS tem 3 datacenters em São Paulo com PUE de 1.2 — referência de eficiência energética na América Latina.", fonte: "Amazon Q4/2025 Earnings" },
    { titulo: "Prime: ecossistema de fidelidade com LTV de US$ 1.500/ano", conteudo: "Amazon Prime tem 230mi de membros globais e 15mi no Brasil — LTV médio de US$ 1.500/ano vs US$ 600 de não-Prime. Prime combina: frete grátis em 24h, Prime Video, Music Unlimited, Gaming e armazenamento de fotos. Churn de Prime: 4% ao ano vs 32% de clientes sem Prime.", fonte: "Consumer Intelligence Research 2025" },
    { titulo: "Marketplace: 60% das vendas são de terceiros", conteudo: "60% das unidades vendidas na Amazon.com.br são de vendedores terceiros — Amazon cobra 8-20% de comissão + taxa de fulfillment. Fulfillment by Amazon (FBA) tem 180.000 vendedores ativos no Brasil. Modelo marketplace cresce sem inventário próprio — capital eficiente e escalável.", fonte: "Amazon Marketplace Report 2025" },
    { titulo: "Alexa e dispositivos: trojan horse do ecossistema doméstico", conteudo: "Echo Dot é o dispositivo de IA doméstica mais vendido do Brasil — 3.2mi de unidades ativas. Cada Echo gera US$ 180/ano em compras adicionais via Alexa Shopping. Kindle tem 2.8mi de usuários ativos no Brasil — Kindle Unlimited (R$ 19,90/mês) com margem de 85%.", fonte: "Amazon Devices Brazil 2025" },
    { titulo: "Logística proprietária: concorrência com Correios e FedEx", conteudo: "Amazon Logistics (própria) já entrega 72% dos pedidos Prime no Brasil — eliminando dependência de Correios e transportadoras. Custo de entrega própria: R$ 12,40 vs R$ 18,90 de terceiros. Frota de 180 vans elétricas em São Paulo. Meta: 95% de entrega própria em SP e RJ até 2027.", fonte: "Amazon Logistics Brazil 2025" },
  ],
  previsao_clima: CLIMA_SP,
  gamificacao_log: [
    { acao: "AWS Bateu US$ 25bi de Receita no Trimestre", pontos: 200 },
    { acao: "Amazon Prime Atingiu 15mi de Membros no Brasil", pontos: 150 },
    { acao: "NPS de Compradores Acima de 78", pontos: 100 },
  ],
  pesquisa: { resumo: "E-commerce no Brasil movimentou R$ 210bi em 2025. Mercado Livre lidera com 27% de market share, seguido de Shopee (19%) e Amazon (16%). AWS: 33% do mercado cloud brasileiro — receita de R$ 4.8bi/ano. Amazon Prime no Brasil: 15mi de membros, crescimento de 65% em 2025. Logística: Amazon Logistics já entrega 72% dos próprios pedidos em São Paulo. Kindle é o e-reader #1 no Brasil com 2.8mi de unidades ativas." },
  timeline: [
    { id: '1', data: '05 Mai', tipo: 'mercado', icone: '📈', titulo: 'Mercado Livre atingiu R$ 400bi em volume de pagamentos — maior que muitos bancos', detalhe: 'MELI reportou R$ 400bi em TPV (Total Payment Volume) em 2025 — maior que Cielo e PagSeguro combinados. Mercado Pago tem 50mi de usuários no Brasil. Ameaça: MELI está se tornando banco e e-commerce ao mesmo tempo — dupla vantagem competitiva que Amazon ainda não tem no Brasil.' },
    { id: '2', data: '03 Mai', tipo: 'concorrente', icone: '⚡', titulo: 'Shopee Live atingiu 2mi de espectadores simultâneos — live commerce cresce 300%', detalhe: 'Shopee Live registrou pico de 2mi de espectadores simultâneos em live de influencer. Live commerce cresceu 300% em 2025 no Brasil — formato cria urgência e conteúdo ao mesmo tempo. Amazon Live existe mas tem <50k espectadores. Ação: investir em Amazon Live Brasil com influenciadores tech e beleza.' },
    { id: '3', data: '01 Mai', tipo: 'mercado', icone: '🌊', titulo: 'Receita Federal implementou tributação de importados acima de US$ 20', detalhe: 'Receita Federal começou a cobrar 20% de imposto em importados acima de US$ 20 — afeta Shopee e AliExpress diretamente. Impacto positivo para Amazon: produtos vendidos por sellers nacionais têm imposto recolhido automaticamente. Shopee pode perder 15-20% de competitividade em produtos chineses.' },
    { id: '4', data: '28 Abr', tipo: 'fornecedor', icone: '📦', titulo: 'Nvidia alocou 40% das GPUs H200 para AWS — concorrente do Azure fica em espera', detalhe: 'Nvidia priorizou AWS na alocação de GPUs H200 — AWS garantiu 40% da produção de H200 para 2026. Microsoft Azure e GCP com alocações reduzidas. Impacto: Amazon Bedrock tem acesso antecipado a modelos de IA de nova geração — vantagem competitiva em cloud AI por 12-18 meses.' },
    { id: '5', data: '25 Abr', tipo: 'concorrente', icone: '🏪', titulo: 'Magazine Luiza fechou 80 lojas físicas — sinaliza pressão de e-commerce', detalhe: 'Magalu anunciou fechamento de 80 lojas físicas com baixo desempenho — foco em lojas âncora e digitais. Paradoxo: Magalu fecha lojas mas Amazon está abrindo Amazon Go no Brasil (conveniência física sem caixa). Lição: o futuro é omnichannel — não só digital.' },
  ],
};

const NATURA_DATA: OmniData = {
  negocio: { nome_fantasia: "Natura", segmento: "Cosméticos & Sustentabilidade", cidade: "São Paulo", estado: "SP", telefone: "(11) 4446-2000", nivel: 5, pontos: 4780 },
  semana_label: "Semana de 06 de Maio de 2026",
  mercado_nome: "Cosméticos, Perfumaria & Higiene Pessoal",
  mercado_tamanho: "R$ 48bi/ano no Brasil",
  ranking_local: 1, progresso_pct: 95, nivel_label: "Maior Grupo de Beleza Sustentável", pontos_proximo: 5000,
  concorrentes: [
    { nome: "O Boticário", nota_google: 4.4, endereco: "Av. Roque Petroni Jr., 1089", cidade: "São Paulo", faixa_preco: "$$", proposta_principal: "Maior rede de franquias de cosméticos do Brasil — 3.900 lojas em formato premium de perfumaria", diferencial: "Rede física de 3.900 franquias cria presença capilar impossível de replicar — conveniência do shopping para cosméticos", faz_bem: ["Rede física ampla", "Branding premium de perfumaria", "Programa Fidelidade bem estruturado"], nao_oferece: ["Proposta de sustentabilidade comparável", "Canal de vendas por consultoras", "Ativos da Amazônia"], mudancas_recentes: ["Boticário lançou linha vegana Vegan Forever", "Atingiu R$ 18bi em vendas de grupo em 2025"], notas_digitais: [{ plataforma: "Reclame Aqui", nota: 4.2 }, { plataforma: "Google", nota: 4.4 }] },
    { nome: "Avon Brasil (Natura Group)", nota_google: 3.7, endereco: "Av. das Nações Unidas, 14.261", cidade: "São Paulo", faixa_preco: "$", proposta_principal: "Venda direta de cosméticos por revendedoras — modelo porta-a-porta com 1.5mi de consultoras no Brasil", diferencial: "1.5mi de consultoras é a maior rede de venda direta do Brasil — alcança onde não há loja física nem e-commerce", faz_bem: ["Rede de consultoras massiva", "Preço acessível", "Alcance em periferias e interior"], nao_oferece: ["Posicionamento premium", "Sustentabilidade como diferencial", "Experiência de loja física"], mudancas_recentes: ["Avon faz parte do Grupo Natura desde 2020 — sinergia de logística", "Rejuvenescimento da marca com campanha 'Avon Muda'"], notas_digitais: [{ plataforma: "Reclame Aqui", nota: 3.5 }] },
    { nome: "L'Oréal Brasil", nota_google: 4.3, endereco: "Av. Presidente Dutra, 4.501", cidade: "São Paulo", faixa_preco: "$$$", proposta_principal: "Multinacional francesa líder global em cosméticos — 36 marcas do popular ao ultra-premium", diferencial: "Portfólio de 36 marcas cobre todos os segmentos — de Maybelline (R$ 25) a Lancôme (R$ 450) sem canibalização", faz_bem: ["Portfólio multi-marca", "P&D de formulação líder global", "Distribuição em farmácias e supermercados"], nao_oferece: ["Sustentabilidade como core de negócio", "Venda direta por consultoras", "Ingredientes amazônicos exclusivos"], mudancas_recentes: ["L'Oréal adquiriu Aesop por US$ 2.5bi — entrada no ultra-premium", "L'Oréal Beauty Tech com IA para personalização de cor"], notas_digitais: [{ plataforma: "Google", nota: 4.3 }] },
    { nome: "Unilever Brasil (Beauty)", nota_google: 4.0, endereco: "Av. Eng. Armando de Arruda Pereira, 3300", cidade: "São Paulo", faixa_preco: "$$", proposta_principal: "Divisão de beleza da Unilever — Dove, TRESemmé, Seda, Rexona e Pond's para higiene e cuidados", diferencial: "Distribuição em 400.000 pontos de venda no Brasil — nenhum concorrente tem penetração tão capilar em massa", faz_bem: ["Distribuição massiva", "Reconhecimento de marca (Dove)", "Preço popular com qualidade"], nao_oferece: ["Sustentabilidade amazônica", "Perfumaria premium", "Consultoras de venda direta"], mudancas_recentes: ["Unilever separou divisão de beleza como empresa independente (Beauty & Wellbeing)", "Dove lançou campanha anti-filtro com +100mi de views no Brasil"], notas_digitais: [{ plataforma: "Google", nota: 4.0 }] },
    { nome: "NIVEA Brasil (Beiersdorf)", nota_google: 4.2, endereco: "Av. das Nações Unidas, 8.501", cidade: "São Paulo", faixa_preco: "$$", proposta_principal: "Líder global em hidratação e cuidados com a pele — a lata azul mais reconhecida do mundo", diferencial: "NIVEA Creme (lata azul) é o produto de cuidados com a pele mais vendido do mundo — reconhecimento universal", faz_bem: ["Reconhecimento de marca icônico", "Qualidade consistente de dermocosméticos", "Preço médio acessível"], nao_oferece: ["Perfumaria de alta", "Maquiagem", "Sustentabilidade como proposta central"], mudancas_recentes: ["NIVEA derma+ lançada como linha farmácia com formulação médica", "Parceria com dermatologistas brasileiros para linha solar"], notas_digitais: [{ plataforma: "Google", nota: 4.2 }] },
  ],
  fornecedores: [
    { nome: "Associação de Comunidades da Amazônia", cidade: "Manaus", estado: "AM", telefone: "(92) 3301-2200", email: "parceiros@natura.net", preco_referencia: 0, produto_servico: "Extração sustentável de 35 ativos amazônicos — andiroba, copaíba, castanha-do-pará e murumuru para formulações" },
    { nome: "Symrise AG (Alemanha)", cidade: "Holzminden", estado: "DE", telefone: "+49 5531 90 0", email: "ingredients@symrise.com", preco_referencia: 0, produto_servico: "Fragrâncias e ingredientes naturais premium para linha Ekos e Una — parceria de 20 anos" },
    { nome: "Givaudan (Suíça)", cidade: "Vernier", estado: "CH", telefone: "+41 22 780 9111", email: "naturals@givaudan.com", preco_referencia: 0, produto_servico: "Compostos aromáticos para linha de perfumaria — Natura Humor, Essencial e Kaiak" },
    { nome: "Braskem (Embalagens)", cidade: "São Paulo", estado: "SP", telefone: "(11) 3576-9000", email: "ecodesign@braskem.com.br", preco_referencia: 0, produto_servico: "Plástico verde (biopolietileno de cana-de-açúcar) para embalagens refil — 40% do portfólio já em bioplástico" },
    { nome: "Beraca Ingredientes (Brasil)", cidade: "Belém", estado: "PA", telefone: "(91) 3248-2000", email: "comercial@beraca.com", preco_referencia: 0, produto_servico: "Extração e certificação de ativos da biodiversidade amazônica — fornecedor exclusivo de 12 ingredientes Ekos" },
  ],
  praticas: [
    { titulo: "Rede de consultoras: 2.1mi de empreendedoras como canal de vendas", conteudo: "Natura tem 2.1mi de consultoras de beleza no Brasil — a maior força de venda direta do país. Consultora média ganha R$ 1.800-3.200/mês vendendo Natura. Modelo cria lock-in duplo: cliente compra da 'sua' consultora (relação pessoal) e consultora não migra por receio de perder clientes fidelizados.", fonte: "Natura Relatório Anual 2025" },
    { titulo: "Ekos: biodiversidade amazônica como diferencial inalcançável", conteudo: "Linha Ekos usa 35 ingredientes amazônicos exclusivos com rastreabilidade 100% — 7.000 famílias de comunidades tradicionais na cadeia. Certificação Fair Wild e UEBT. Margem de Ekos é 28% acima da média do portfólio. Nenhum concorrente tem acesso à mesma rede de coleta sustentável.", fonte: "Natura Ekos Impact Report 2025" },
    { titulo: "Refil: modelo circular que reduz custo e aumenta recompra", conteudo: "Linha de refis representa 32% das vendas em volume — embalagem 70% menor, preço 18% abaixo. Reduz 1.200 toneladas de plástico por ano. Resultado inesperado: frequência de recompra do refil é 2.3x maior que embalagem convencional — cliente volta mais rápido.", fonte: "Natura Sustentabilidade 2025" },
    { titulo: "Beauty Tech: experiência digital personalizada com IA", conteudo: "Natura Conecta (app) usa IA para sugerir produtos por tipo de pele, tom e rotina. Virtual try-on de maquiagem com 94% de satisfação. App tem 18mi de downloads — consultoras usam para mostrar produtos em visita. Ticket médio em compras via app: R$ 185 vs R$ 95 pelo catálogo físico.", fonte: "Natura Digital Report 2025" },
    { titulo: "Bem Estar Bem: propósito como vantagem competitiva real", conteudo: "Natura B Corp desde 2014 — menor custo de capital (juros 1.8pp abaixo de concorrentes por ESG rating alto). Atrai talento de alto nível sem pagar premium: 3 CVs por vaga aberta (benchmark: 1.2). Compradores ESG (fundos) representam 42% da base acionária — estabilidade de longo prazo.", fonte: "Natura B Corp Impact Report 2025" },
  ],
  previsao_clima: CLIMA_SP,
  gamificacao_log: [
    { acao: "Ekos Atingiu R$ 2.8bi em Vendas — Recorde Histórico", pontos: 200 },
    { acao: "Emissão de Carbono Net Zero Atingida", pontos: 150 },
    { acao: "2.1mi de Consultoras Ativas no Brasil", pontos: 100 },
  ],
  pesquisa: { resumo: "Mercado de cosméticos no Brasil movimentou R$ 48bi em 2025 — 3º maior do mundo. Natura &Co (grupo) tem receita de R$ 32bi incluindo Avon, The Body Shop e Aesop. Venda direta representa 28% do mercado brasileiro — Natura domina com 35% do canal. Beleza sustentável cresceu 42% em 2025 — o dobro do mercado convencional. Ingredientes amazônicos: tendência global — exportações de ativos naturais brasileiros cresceram 67% para a Europa." },
  timeline: [
    { id: '1', data: '05 Mai', tipo: 'mercado', icone: '📈', titulo: 'Beleza sustentável cresceu 42% em 2025 — Europa proíbe microplásticos', detalhe: 'Diretiva europeia proíbe microplásticos em cosméticos a partir de jan/2026 — impacta L\'Oréal, Unilever e NIVEA que precisam reformular 30-40% do portfólio. Natura não usa microplásticos desde 2015 — vantagem imediata no mercado europeu. Exportações da linha Ekos para Europa podem crescer 80% em 2026.' },
    { id: '2', data: '03 Mai', tipo: 'concorrente', icone: '⚡', titulo: 'O Boticário lançou linha vegana "Vegan Forever" com 80 produtos', detalhe: 'Boticário lançou linha vegana com 80 produtos e certificação PETA. R$ 120mi de investimento em comunicação. Ameaça: Boticário está se posicionando no terreno de sustentabilidade que era exclusivo da Natura. Diferencial a reforçar: Natura tem rastreabilidade amazônica real vs "vegano" sem origem declarada.' },
    { id: '3', data: '01 Mai', tipo: 'mercado', icone: '🌊', titulo: 'ANVISA aprovou regulação de "natural" — 32% dos produtos precisam reformular', detalhe: 'ANVISA publicou resolução definindo critérios para "cosmético natural" — ingredientes sintéticos acima de 5% proíbem o uso do termo. 32% dos produtos rotulados como "naturais" no mercado não atendem — Natura atende 91% sem reformulação. Vantagem competitiva regulatória confirmada.' },
    { id: '4', data: '28 Abr', tipo: 'fornecedor', icone: '📦', titulo: 'Beraca vai aumentar preço de ativos amazônicos em 15% — impacto em Ekos', detalhe: 'Beraca (fornecedor exclusivo de 12 ingredientes Ekos) comunicou reajuste de 15% a partir de jul/2026 — motivado por custo de certificação Fair Wild e alta do dólar. Impacto estimado: redução de 2.1pp na margem de Ekos. Opção: repassar ao consumidor (aceitação ESG alta) ou ampliar coleta direta com comunidades.' },
    { id: '5', data: '25 Abr', tipo: 'concorrente', icone: '🏪', titulo: 'L\'Oréal adquiriu startup de biocosméticos brasileira por R$ 280mi', detalhe: 'L\'Oréal adquiriu Burt\'s Bees LATAM + startup brasileira Pantheryx (ativos amazônicos sintéticos) por R$ 280mi total. Sinal: L\'Oréal quer competir em naturalidade com rotas alternativas (síntese vs coleta). Pantheryx replica via síntese química 8 ativos amazônicos a custo 60% menor — ameaça de médio prazo para posicionamento Ekos.' },
  ],
};

export const PROFILE_MOCK_DATA: Record<string, OmniData> = {
  os1:       MOCK_DATA,
  mcdonalds: MCDONALDS_DATA,
  nike:      NIKE_DATA,
  nubank:    NUBANK_DATA,
  ifood:     IFOOD_DATA,
  ambev:     AMBEV_DATA,
  magalu:    MAGALU_DATA,
  embraer:   EMBRAER_DATA,
  tesla:     TESLA_DATA,
  netflix:   NETFLIX_DATA,
  spotify:   SPOTIFY_DATA,
  airbnb:    AIRBNB_DATA,
  uber:      UBER_DATA,
  apple:     APPLE_DATA,
  amazon:    AMAZON_DATA,
  natura:    NATURA_DATA,
};

export function buildStories(data: OmniData): StoryGroup[] {
  return [
    {
      label: 'Mercado', seed: 'market2025', thumb: OS1_PHOTOS.tMercado,
      slides: [
        { image: OS1_PHOTOS.cut1, title: 'Análise de Mercado', body: data.pesquisa?.resumo ?? '—' },
        { image: OS1_PHOTOS.chair, title: `${data.concorrentes.length} Concorrentes`, body: data.concorrentes.slice(0, 3).map(c => `⭐ ${c.nota_google ?? '—'}  ${c.nome}`).join('\n') || '—' },
      ],
    },
    {
      label: 'Fornecedores', seed: 'supply2025', thumb: OS1_PHOTOS.tFornecedor,
      slides: data.fornecedores.slice(0, 3).map((f, i) => ({
        image: [OS1_PHOTOS.tools, OS1_PHOTOS.cut2, OS1_PHOTOS.interior][i % 3],
        title: f.nome,
        body: `${f.produto_servico}\n📍 ${f.cidade}, ${f.estado}\n📞 ${f.telefone || '—'}`,
      })),
    },
    {
      label: 'Práticas', seed: 'practice2025', thumb: OS1_PHOTOS.tPraticas,
      slides: data.praticas.slice(0, 3).map((p, i) => ({
        image: [OS1_PHOTOS.cut2, OS1_PHOTOS.cut1, OS1_PHOTOS.tools][i % 3],
        title: p.titulo, body: p.conteudo,
      })),
    },
    {
      label: 'Evolução', seed: 'growth2025', thumb: OS1_PHOTOS.tEvolucao,
      slides: [
        { image: OS1_PHOTOS.window, title: `Nível ${data.negocio?.nivel ?? '—'} — ${data.nivel_label}`, body: `${data.negocio?.pontos ?? 0} pts\n${data.progresso_pct}% para o próximo nível` },
        ...data.gamificacao_log.slice(0, 2).map((g, i) => ({
          image: [OS1_PHOTOS.pole, OS1_PHOTOS.chair][i % 2],
          title: 'Conquista', body: `${g.acao}\n+${g.pontos} pts`,
        })),
      ],
    },
    {
      label: 'Clima', seed: 'sky2025', thumb: OS1_PHOTOS.tClima,
      slides: data.previsao_clima.slice(0, 4).map((w, i) => ({
        image: [OS1_PHOTOS.interior, OS1_PHOTOS.chair, OS1_PHOTOS.window, OS1_PHOTOS.pole][i % 4],
        title: `${w.dia_label} — ${w.icone}`,
        body: `Máx ${w.temp_max}°  Mín ${w.temp_min}°${w.chuva_mm > 0 ? `\n🌧 ${w.chuva_mm}mm de chuva` : ''}`,
      })),
    },
  ];
}
