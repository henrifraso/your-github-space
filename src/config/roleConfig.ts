import React from 'react';

export interface RoleBio {
  displayName: string;
  initials: string;
  gradientStyle: React.CSSProperties;
  bioText: string;
  bioSubtext?: string;
  showInviteButton: boolean;
}

export interface RoleSwipeOption {
  id: string;
  label: string;
}

export interface RoleFeedCard {
  id: string;
  titulo: string;
  resumo: string;
  tipo: 'informacao' | 'alerta';
  urgencia: 'baixa' | 'media' | 'alta';
  tags: string[];
  isPending?: boolean;
  franchiseName?: string;
}

export interface RoleSummaryNumbers {
  empresas: number;
  afiliados: number;
  parceiros: number;
}

export interface RoleConfig {
  bio: RoleBio;
  swipeOptions: RoleSwipeOption[];
  feedCards: RoleFeedCard[];
  showApproveButtons: boolean;
  showPendingBadge: boolean;
  showSummaryBar: boolean;
  summaryNumbers?: RoleSummaryNumbers;
  useDefaultSectors: boolean;
}

const ROLE_CONFIGS: Record<string, RoleConfig> = {
  codify: {
    bio: {
      displayName: 'Codify',
      initials: 'OS',
      gradientStyle: {
        background: 'radial-gradient(ellipse 100% 100% at 45% 40%, #5a5a5a 0%, #2a2a2a 40%, #080808 100%)',
      },
      bioText: 'Painel mestre · Empresas, afiliados e parceiros',
      showInviteButton: true,
    },
    swipeOptions: [
      { id: 'demos',     label: 'Demos' },
      { id: 'empresas',  label: 'Empresas' },
      { id: 'afiliados', label: 'Afiliados' },
      { id: 'parceiros', label: 'Parceiros' },
    ],
    feedCards: [
      { id: 'cod-1', titulo: 'Resumo semanal', resumo: '3 empresas ativas, 2 afiliados vendendo, 1 parceiro conectado. Nenhuma empresa em risco essa semana.', tipo: 'informacao', urgencia: 'baixa', tags: ['overview'] },
      { id: 'cod-2', titulo: 'Rafael Mendes (@afiliado)', resumo: 'Converteu 3 de 5 demos esse mês. Taxa de 67%. Melhor afiliado da carteira. Último contato: hoje.', tipo: 'informacao', urgencia: 'baixa', tags: ['afiliado'] },
      { id: 'cod-3', titulo: 'SupraNutri (@parceiro)', resumo: '3 oportunidades de parceria ativas. Setor de açaí com maior demanda. Contato disponível no workspace.', tipo: 'informacao', urgencia: 'baixa', tags: ['parceiro'] },
    ],
    showApproveButtons: false,
    showPendingBadge: false,
    showSummaryBar: true,
    summaryNumbers: { empresas: 3, afiliados: 2, parceiros: 1 },
    useDefaultSectors: false,
  },

  affiliate: {
    bio: {
      displayName: 'Rafael Mendes',
      initials: 'RM',
      gradientStyle: { background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)' },
      bioText: 'Consultor comercial · São Paulo, SP',
      bioSubtext: '12 empresas vendidas · 8 ativas · Taxa 67%',
      showInviteButton: false,
    },
    swipeOptions: [
      { id: 'meus-clientes', label: 'Meus clientes' },
      { id: 'demos',         label: 'Demos' },
      { id: 'parceiros',     label: 'Parceiros' },
    ],
    feedCards: [
      { id: 'aff-1', titulo: 'Sabor & Arte Restaurante', resumo: 'Completou 4 de 5 missões essa semana. Nota Google subiu de 4.1 pra 4.3. Cliente engajado, sem risco.', tipo: 'informacao', urgencia: 'baixa', tags: ['pós-venda', 'ativo'] },
      { id: 'aff-2', titulo: 'Beleza Pura Clínica', resumo: 'Não abriu o sistema há 6 dias. Última ação foi no feed de concorrência. Risco de cancelamento. Ligar hoje.', tipo: 'alerta', urgencia: 'alta', tags: ['risco', 'churn'] },
      { id: 'aff-3', titulo: 'Barbearia Dom Pedro', resumo: 'Implementação em andamento. Sincronizou 3 vezes essa semana. Feed sendo gerado. Previsão de ativação: 4 dias.', tipo: 'informacao', urgencia: 'media', tags: ['implementando'] },
      { id: 'aff-4', titulo: 'Nova demo: Pet Shop Amigo Fiel', resumo: 'Perfil completo com 5 concorrentes mapeados e feed pronto. Usar na reunião de quinta.', tipo: 'informacao', urgencia: 'media', tags: ['demo', 'venda'] },
      { id: 'aff-5', titulo: 'Oportunidade: TechSupply', resumo: 'Parceiro buscando afiliados na região de Campinas. Comissão de 20% recorrente. Oportunidade pra expandir carteira.', tipo: 'informacao', urgencia: 'media', tags: ['parceiro', 'oportunidade'] },
      { id: 'aff-6', titulo: 'Sua performance do mês', resumo: '3 vendas fechadas de 5 demos. Receita gerada: R$ 2.991. Meta: R$ 4.985. Faltam 2 vendas pra bater a meta.', tipo: 'informacao', urgencia: 'baixa', tags: ['performance'] },
    ],
    showApproveButtons: false,
    showPendingBadge: false,
    showSummaryBar: false,
    useDefaultSectors: false,
  },

  franchisor: {
    bio: {
      displayName: 'Açaí da Terra — Rede',
      initials: 'AT',
      gradientStyle: { background: 'linear-gradient(135deg, #15803d 0%, #a16207 100%)' },
      bioText: 'Franqueadora · 23 unidades · São Paulo, RJ e MG',
      bioSubtext: '3 pendentes · 20 ativas · Nota média da rede: 4.4',
      showInviteButton: true,
    },
    swipeOptions: [
      { id: 'rede',               label: 'Rede Açaí da Terra' },
      { id: 'franquia-paulista',  label: 'Franquia Paulista' },
      { id: 'franquia-morumbi',   label: 'Franquia Morumbi' },
      { id: 'franquia-campinas',  label: 'Franquia Campinas' },
      { id: 'franquia-copacabana',label: 'Franquia Copacabana' },
      { id: 'franquia-savassi',   label: 'Franquia Savassi' },
    ],
    feedCards: [
      // Cards da rede (sem isPending, sem franchiseName)
      { id: 'fr-1', titulo: 'Oakberry expande em SP', resumo: 'Oakberry abriu 2 novas unidades em São Paulo esse mês. Agora 15 unidades na região contra 8 suas. Monitorar impacto no movimento das unidades próximas.', tipo: 'alerta', urgencia: 'media', tags: ['concorrência'] },
      { id: 'fr-2', titulo: 'Condição especial de fornecedor', resumo: 'Distribuidora Frutas Premium oferece açaí em polpa com 12% de desconto pra redes com mais de 20 unidades. Condição válida até dia 30.', tipo: 'informacao', urgencia: 'baixa', tags: ['fornecedor'] },
      { id: 'fr-3', titulo: 'Tendência: açaí proteico', resumo: 'Busca por "açaí proteico" cresceu 45% nos últimos 60 dias em SP. Nenhuma unidade da rede oferece essa variação. Oportunidade de diferenciação.', tipo: 'informacao', urgencia: 'media', tags: ['tendência'] },
      // Cards pendentes por franquia
      { id: 'fr-4', titulo: 'Franquia Paulista — concorrente a 400m', resumo: 'Novo quiosque de açaí a 400m da unidade. Nota 4.8 no Google e preço 15% menor. Aprovar envio do alerta pra unidade?', tipo: 'alerta', urgencia: 'alta', tags: ['aprovação'], isPending: true, franchiseName: 'Franquia Paulista' },
      { id: 'fr-5', titulo: 'Franquia Morumbi — reputação em queda', resumo: 'Nota Google caiu de 4.6 pra 4.3 em 2 semanas. 5 avaliações negativas mencionam porção menor que o anunciado. Aprovar envio do alerta?', tipo: 'alerta', urgencia: 'alta', tags: ['aprovação'], isPending: true, franchiseName: 'Franquia Morumbi' },
      { id: 'fr-6', titulo: 'Franquia Campinas — fornecedor local', resumo: 'Fornecedor de granola artesanal com preço 20% menor que o da rede. Avaliação 4.7. Aprovar recomendação pra unidade?', tipo: 'informacao', urgencia: 'media', tags: ['aprovação'], isPending: true, franchiseName: 'Franquia Campinas' },
      // Cards específicos Copacabana
      { id: 'fr-7', titulo: 'Franquia Copacabana — alta temporada', resumo: 'Julho é alta temporada em Copacabana. Movimento previsto 40% acima da média. Recomendar reforço de estoque e equipe pra unidade?', tipo: 'informacao', urgencia: 'media', tags: ['sazonalidade'], franchiseName: 'Franquia Copacabana' },
      // Cards específicos Savassi
      { id: 'fr-8', titulo: 'Franquia Savassi — concorrente direto', resumo: 'Açaí Sabor Natural abriu unidade a 300m no Savassi. Preço similar, nota 4.5. Monitorar por 30 dias antes de aprovar ação.', tipo: 'alerta', urgencia: 'media', tags: ['concorrência'], franchiseName: 'Franquia Savassi' },
    ],
    showApproveButtons: true,
    showPendingBadge: true,
    showSummaryBar: false,
    useDefaultSectors: false,
  },

  franchise: {
    bio: {
      displayName: 'Açaí da Terra — Paulista',
      initials: 'AT',
      gradientStyle: { background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' },
      bioText: 'Unidade · Av. Paulista, 1234 · São Paulo',
      bioSubtext: 'Nota Google: 4.4 · 127 avaliações · Nível: Ativa',
      showInviteButton: false,
    },
    swipeOptions: [],
    feedCards: [
      { id: 'fran-1', titulo: 'Novo concorrente a 400m', resumo: 'Quiosque de açaí abriu na Paulista com nota 4.8 e preço médio R$ 18. Seu preço médio: R$ 22. Avaliar se diferencial justifica a diferença ou ajustar combo de entrada.', tipo: 'alerta', urgencia: 'alta', tags: ['concorrência'] },
      { id: 'fran-2', titulo: 'Reputação: ação necessária', resumo: 'Nota caiu de 4.6 pra 4.4. 3 avaliações recentes mencionam porção menor que o anunciado. Padronizar porcionamento e responder avaliações negativas em 24h.', tipo: 'alerta', urgencia: 'alta', tags: ['reputação'] },
      { id: 'fran-3', titulo: 'Recomendação do franqueador', resumo: 'Granola artesanal local aprovada pela rede. Preço 20% menor que o fornecedor atual. Mesma qualidade. Fornecedor: Grão Natural, Campinas.', tipo: 'informacao', urgencia: 'baixa', tags: ['fornecedor'] },
      { id: 'fran-4', titulo: 'Calor: preparar estoque', resumo: 'Temperaturas acima de 30°C previstas pra próxima semana. Restaurantes de açaí na região tiveram +25% no movimento em semanas quentes. Pedir reforço de polpa e frutas.', tipo: 'informacao', urgencia: 'media', tags: ['sazonalidade'] },
      { id: 'fran-5', titulo: 'Tendência: açaí proteico', resumo: '"Açaí proteico" em alta na região. Adicionar opção com whey e pasta de amendoim. Fornecedor de whey com entrega na Paulista: SupraNutri (já parceiro da rede).', tipo: 'informacao', urgencia: 'media', tags: ['tendência'] },
    ],
    showApproveButtons: false,
    showPendingBadge: false,
    showSummaryBar: false,
    useDefaultSectors: true,
  },

  partner: {
    bio: {
      displayName: 'SupraNutri Distribuidora',
      initials: 'SN',
      gradientStyle: { background: 'linear-gradient(135deg, #1d4ed8 0%, #0284c7 100%)' },
      bioText: 'Fornecedor · Suplementos e insumos saudáveis',
      bioSubtext: '3 oportunidades ativas · Região: SP, RJ e MG',
      showInviteButton: false,
    },
    swipeOptions: [],
    feedCards: [
      { id: 'par-1', titulo: 'Açaí em expansão — 47 lojas', resumo: 'Setor de açaí cresceu 31% na região metropolitana de SP. 47 lojas ativas no OS¹. 68% buscam fornecedor de whey protein e granola. Demanda estimada: R$ 85 mil/mês.', tipo: 'informacao', urgencia: 'alta', tags: ['oportunidade', 'açaí'] },
      { id: 'par-2', titulo: 'Rede Açaí da Terra — 23 unidades', resumo: 'Rede precisa de fornecedor de suplementos pra nova linha "açaí proteico". Volume estimado: 500kg/mês de whey. Contato disponível no workspace.', tipo: 'alerta', urgencia: 'alta', tags: ['demanda', 'rede'] },
      { id: 'par-3', titulo: 'Clínicas de estética — oportunidade', resumo: '12 clínicas de estética ativas na plataforma buscam parceiros de produtos naturais. Setor cresceu 22% no trimestre. Margem média de distribuição: 28%.', tipo: 'informacao', urgencia: 'media', tags: ['oportunidade', 'estética'] },
      { id: 'par-4', titulo: 'Feira Natural Tech — dia 15', resumo: 'São Paulo, dia 15. 300 empresários do setor de alimentação saudável confirmados. Stand disponível a partir de R$ 2.500. Maior evento do segmento no Sul-Sudeste.', tipo: 'informacao', urgencia: 'media', tags: ['evento', 'networking'] },
      { id: 'par-5', titulo: 'Categoria mais procurada', resumo: 'Fornecedores e operação são as áreas com mais busca entre clientes OS¹. 78% das empresas buscam novos fornecedores. Sua categoria (suplementos) está entre as 5 mais procuradas.', tipo: 'informacao', urgencia: 'baixa', tags: ['tendência'] },
    ],
    showApproveButtons: false,
    showPendingBadge: false,
    showSummaryBar: false,
    useDefaultSectors: true,
  },

  team_member: {
    bio: {
      displayName: 'Rafael Mendes',
      initials: 'RM',
      gradientStyle: { background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)' },
      bioText: 'Consultor comercial · São Paulo, SP',
      bioSubtext: '12 empresas vendidas · 8 ativas · Taxa 67%',
      showInviteButton: false,
    },
    swipeOptions: [
      { id: 'meus-clientes', label: 'Meus clientes' },
      { id: 'demos',         label: 'Demos' },
      { id: 'parceiros',     label: 'Parceiros' },
    ],
    feedCards: [
      { id: 'aff-1', titulo: 'Sabor & Arte Restaurante', resumo: 'Completou 4 de 5 missões essa semana. Nota Google subiu de 4.1 pra 4.3. Cliente engajado, sem risco.', tipo: 'informacao', urgencia: 'baixa', tags: ['pós-venda', 'ativo'] },
      { id: 'aff-2', titulo: 'Beleza Pura Clínica', resumo: 'Não abriu o sistema há 6 dias. Última ação foi no feed de concorrência. Risco de cancelamento. Ligar hoje.', tipo: 'alerta', urgencia: 'alta', tags: ['risco', 'churn'] },
      { id: 'aff-4', titulo: 'Nova demo: Pet Shop Amigo Fiel', resumo: 'Perfil completo com 5 concorrentes mapeados e feed pronto. Usar na reunião de quinta.', tipo: 'informacao', urgencia: 'media', tags: ['demo', 'venda'] },
      { id: 'aff-6', titulo: 'Sua performance do mês', resumo: '3 vendas fechadas de 5 demos. Receita gerada: R$ 2.991. Meta: R$ 4.985. Faltam 2 vendas pra bater a meta.', tipo: 'informacao', urgencia: 'baixa', tags: ['performance'] },
    ],
    showApproveButtons: false,
    showPendingBadge: false,
    showSummaryBar: false,
    useDefaultSectors: false,
  },
};

const FRANCHISE_FALLBACK = ROLE_CONFIGS.franchise;

export function getRoleConfig(role: string): RoleConfig {
  return ROLE_CONFIGS[role] ?? FRANCHISE_FALLBACK;
}

export const PERSONALIZED_ROLES = new Set(['codify', 'affiliate', 'franchisor', 'franchise', 'partner', 'team_member']);

export const CODIFY_TAB_DATA = {
  empresas: [
    { id: 'emp-1', nome: 'Sabor & Arte Restaurante', segmento: 'Alimentação', cidade: 'São Paulo', status: 'ativo' },
    { id: 'emp-2', nome: 'Beleza Pura Clínica',      segmento: 'Estética',    cidade: 'São Paulo', status: 'em risco' },
    { id: 'emp-3', nome: 'Barbearia Dom Pedro',       segmento: 'Barbearia',   cidade: 'São Paulo', status: 'implementando' },
    { id: 'emp-4', nome: 'Padaria Nova Era',          segmento: 'Alimentação', cidade: 'Campinas',  status: 'ativo' },
    { id: 'emp-5', nome: 'Açaí da Terra Paulista',    segmento: 'Açaí',        cidade: 'São Paulo', status: 'ativo' },
  ],
  afiliados: [
    { id: 'afl-1', nome: 'Rafael Mendes (@afiliado)', conversao: '67%', clientes: 5, ultimoContato: 'hoje' },
    { id: 'afl-2', nome: 'Carla Souza (@afiliado2)',  conversao: '45%', clientes: 2, ultimoContato: '2 dias' },
  ],
  parceiros: [
    { id: 'par-1', nome: 'SupraNutri (@parceiro)', setor: 'Suplementos', oportunidades: 3 },
  ],
};

export const AFFILIATE_TAB_DATA = {
  'meus-clientes': [
    { id: 'cli-1', nome: 'Sabor & Arte Restaurante', status: 'ativo',         ultimaInteracao: 'hoje' },
    { id: 'cli-2', nome: 'Beleza Pura Clínica',      status: 'em risco',      ultimaInteracao: '6 dias' },
    { id: 'cli-3', nome: 'Barbearia Dom Pedro',       status: 'implementando', ultimaInteracao: '3 dias' },
    { id: 'cli-4', nome: 'Padaria Nova Era',          status: 'ativo',         ultimaInteracao: 'ontem' },
    { id: 'cli-5', nome: 'Clínica Dental Plus',       status: 'ativo',         ultimaInteracao: '2 dias' },
  ],
  parceiros: [
    { id: 'par-1', nome: 'SupraNutri',  setor: 'Suplementos', comissao: '20%' },
    { id: 'par-2', nome: 'TechSupply',  setor: 'Tecnologia',  comissao: '15%' },
  ],
};

export const FRANCHISOR_FRANCHISE_NAMES = [
  'Franquia Paulista',
  'Franquia Morumbi',
  'Franquia Campinas',
  'Franquia Copacabana',
  'Franquia Savassi',
];
