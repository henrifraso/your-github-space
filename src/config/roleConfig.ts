import React from 'react';

export interface RoleBio {
  displayName: string;
  initials: string;
  gradientStyle: React.CSSProperties;
  bioText: string;
  bioSubtext?: string;
  showInviteButton: boolean;
  photoUrl?: string;
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
  // Etapa 10 — rastreabilidade pra cards gerados por ações (navegador/mapa)
  /** Origem do card quando vier de ação externa (navegador, mapa, etc.). */
  origem?: 'navegador' | 'mapa' | 'diagnostico' | 'role';
  /** ID da evidência/sinal associado (rastreabilidade). */
  evidenceId?: string;
  /** URL de origem (cards do navegador). */
  sourceUrl?: string;
  /** Título da página de origem (cards do navegador). */
  sourceTitle?: string;
  /** Timestamp de criação do card. */
  createdAt?: string;
  // Etapa 11 — rastreabilidade pra cards do mapa
  /** ID do sinal territorial associado (cards do mapa). */
  mapSignalId?: string;
  /** Raio analisado em metros (cards do mapa). */
  radius?: number;
  /** Centro da análise (cards do mapa). */
  center?: { lat: number; lng: number };
  /** Quantidade de concorrentes considerados (cards do mapa). */
  competitorsCount?: number;
  /** Label legível da origem territorial (ex: "Raio 1,0 km · 8 concorrentes"). */
  sourceLabel?: string;
}

export interface RoleSummaryNumbers {
  empresas: number;
  afiliados: number;
  parceiros: number;
}

export interface RoleStatItem {
  value: string | number;
  label: string;
}

export interface RoleBioLine {
  icon: 'store' | 'mappin' | 'zap';
  text: string;
}

export interface RoleConfig {
  bio: RoleBio;
  swipeOptions: RoleSwipeOption[];
  feedCards: RoleFeedCard[];
  showApproveButtons: boolean;
  showPendingBadge: boolean;
  showSummaryBar: boolean;
  summaryNumbers?: RoleSummaryNumbers;
  roleStats?: RoleStatItem[];
  bioLines?: RoleBioLine[];
  useDefaultSectors: boolean;
}

const ROLE_CONFIGS: Record<string, RoleConfig> = {
  codify: {
    bio: {
      displayName: '001',
      initials: 'OS',
      gradientStyle: {
        background: 'radial-gradient(ellipse 100% 100% at 45% 40%, #5a5a5a 0%, #2a2a2a 40%, #080808 100%)',
      },
      bioText: '',
      showInviteButton: true,
      photoUrl: '/os1-profile.png',
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
    bioLines: [
      { icon: 'store',  text: 'Mercado · Software & IA' },
      { icon: 'mappin', text: 'Posição · líder do segmento' },
      { icon: 'zap',    text: 'Evolução · 96% pro próximo nível' },
    ],
    useDefaultSectors: false,
  },

  affiliate: {
    bio: {
      displayName: 'Afiliado Demo',
      initials: 'AD',
      gradientStyle: { background: 'radial-gradient(ellipse 100% 100% at 45% 40%, #1f2937 0%, #0b1220 45%, #050608 100%)' },
      bioText: 'Consultor comercial · São Paulo, SP',
      showInviteButton: true,
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
    roleStats: [
      { value: 5, label: 'clientes' },
      { value: 3, label: 'demos' },
      { value: '67%', label: 'conversão' },
    ],
    bioLines: [
      { icon: 'store',  text: 'Carteira · 5 clientes ativos' },
      { icon: 'mappin', text: 'Região · São Paulo capital' },
      { icon: 'zap',    text: 'Evolução · 60% da meta do mês' },
    ],
    useDefaultSectors: false,
  },

  // Role interna 'franchisor' mantida pra compat com backend/seeds/login.
  // Toda a linguagem visível usa "Perfil Central" / "Central" / "Estrutura, unidades e setores conectados".
  franchisor: {
    bio: {
      displayName: 'Perfil Central Demo',
      initials: 'PC',
      gradientStyle: { background: 'radial-gradient(ellipse 100% 100% at 45% 40%, #1f2937 0%, #0b1220 45%, #050608 100%)' },
      bioText: 'Central · Estrutura, unidades e setores conectados',
      showInviteButton: true,
    },
    swipeOptions: [
      { id: 'minha-empresa',    label: 'Central' },
      { id: 'unidade-paulista', label: 'Unidade Paulista' },
      { id: 'unidade-morumbi',  label: 'Unidade Morumbi' },
      { id: 'unidade-campinas', label: 'Unidade Campinas' },
    ],
    feedCards: [
      // Cards da Central (sem isPending, sem franchiseName) — concorrência, mercado, fornecedores, reputação, operação
      { id: 'fr-1', titulo: 'Concorrência: Oakberry expande em SP',     resumo: 'Oakberry abriu 2 novas unidades em São Paulo. Agora 15 unidades na região contra 8 suas. Monitorar impacto no movimento das unidades próximas.', tipo: 'alerta',     urgencia: 'media', tags: ['concorrência'] },
      { id: 'fr-2', titulo: 'Mercado: açaí proteico em alta',           resumo: 'Busca por "açaí proteico" cresceu 45% nos últimos 60 dias em SP. Nenhuma unidade da estrutura oferece a variação. Oportunidade de diferenciação.',                        tipo: 'informacao', urgencia: 'media', tags: ['mercado'] },
      { id: 'fr-3', titulo: 'Fornecedores: condição especial de polpa', resumo: 'Distribuidora Frutas Premium oferece açaí em polpa com 12% de desconto pra estruturas com mais de 20 unidades. Condição válida até dia 30.',                              tipo: 'informacao', urgencia: 'baixa', tags: ['fornecedores'] },
      { id: 'fr-4', titulo: 'Reputação: nota média da estrutura',       resumo: 'Nota média da estrutura subiu de 4.3 pra 4.4 no último mês. Paulista e Morumbi puxam pra cima, Campinas ainda em 4.1. Reforçar treinamento de atendimento na unidade.', tipo: 'informacao', urgencia: 'baixa', tags: ['reputação'] },
      { id: 'fr-5', titulo: 'Operação: padronização de porcionamento',  resumo: '7 unidades fora do padrão de porcionamento (variação acima de 10%). Sugerir auditoria interna e nova checklist nos próximos 15 dias.',                                tipo: 'alerta',     urgencia: 'media', tags: ['operação'] },
      // Cards pendentes por unidade conectada (textos do briefing)
      { id: 'fr-pend-1', titulo: 'Unidade Paulista — concorrente a 500m', resumo: 'Concorrente novo detectado a 500m da unidade. Aprovar envio do alerta pra unidade?',                       tipo: 'alerta',     urgencia: 'alta',  tags: ['aprovação'], isPending: true, franchiseName: 'Unidade Paulista' },
      { id: 'fr-pend-2', titulo: 'Unidade Morumbi — nota Google em queda', resumo: 'Nota Google da unidade caiu de 4.5 pra 4.2 nas últimas semanas. Aprovar envio do alerta pra unidade?',     tipo: 'alerta',     urgencia: 'alta',  tags: ['aprovação'], isPending: true, franchiseName: 'Unidade Morumbi' },
      { id: 'fr-pend-3', titulo: 'Unidade Campinas — fornecedor 15% mais barato', resumo: 'Fornecedor local com preço 15% menor que o da estrutura. Aprovar recomendação pra unidade?',           tipo: 'informacao', urgencia: 'media', tags: ['aprovação'], isPending: true, franchiseName: 'Unidade Campinas' },
    ],
    showApproveButtons: true,
    showPendingBadge: true,
    showSummaryBar: false,
    roleStats: [
      { value: 8, label: 'unidades' },
      { value: 3, label: 'pendências' },
      { value: '4.4', label: 'nota média' },
    ],
    bioLines: [
      { icon: 'store',  text: 'Central · Açaí da Terra' },
      { icon: 'mappin', text: 'Cobertura · Capital + Campinas' },
      { icon: 'zap',    text: 'Evolução · nota +0.1 no mês' },
    ],
    useDefaultSectors: false,
  },

  // Role interna 'franchise' mantida pra compat com backend/seeds/login.
  // Toda a linguagem visível usa "Perfil Unidade" / "Unidade conectada" / "Operação local".
  franchise: {
    bio: {
      displayName: 'Perfil Unidade Demo',
      initials: 'PU',
      gradientStyle: { background: 'radial-gradient(ellipse 100% 100% at 45% 40%, #1f2937 0%, #0b1220 45%, #050608 100%)' },
      bioText: 'Unidade conectada · Operação local',
      showInviteButton: true,
    },
    swipeOptions: [],
    feedCards: [
      { id: 'fran-1', titulo: 'Novo concorrente a 400m', resumo: 'Quiosque de açaí abriu na Paulista com nota 4.8 e preço médio R$ 18. Seu preço médio: R$ 22. Avaliar se diferencial justifica a diferença ou ajustar combo de entrada.', tipo: 'alerta', urgencia: 'alta', tags: ['concorrência'] },
      { id: 'fran-2', titulo: 'Reputação: ação necessária', resumo: 'Nota caiu de 4.6 pra 4.4. 3 avaliações recentes mencionam porção menor que o anunciado. Padronizar porcionamento e responder avaliações negativas em 24h.', tipo: 'alerta', urgencia: 'alta', tags: ['reputação'] },
      { id: 'fran-3', titulo: 'Recomendação da Central', resumo: 'Granola artesanal local aprovada pela estrutura. Preço 20% menor que o fornecedor atual. Mesma qualidade. Fornecedor: Grão Natural, Campinas.', tipo: 'informacao', urgencia: 'baixa', tags: ['fornecedor'] },
      { id: 'fran-4', titulo: 'Calor: preparar estoque', resumo: 'Temperaturas acima de 30°C previstas pra próxima semana. Restaurantes de açaí na região tiveram +25% no movimento em semanas quentes. Pedir reforço de polpa e frutas.', tipo: 'informacao', urgencia: 'media', tags: ['sazonalidade'] },
      { id: 'fran-5', titulo: 'Tendência: açaí proteico', resumo: '"Açaí proteico" em alta na região. Adicionar opção com whey e pasta de amendoim. Fornecedor de whey com entrega na Paulista: SupraNutri (já parceiro da estrutura).', tipo: 'informacao', urgencia: 'media', tags: ['tendência'] },
    ],
    showApproveButtons: false,
    showPendingBadge: false,
    showSummaryBar: false,
    roleStats: [
      { value: 5, label: 'oportunidades' },
      { value: 4, label: 'concorrentes' },
      { value: '4.4', label: 'nota' },
    ],
    bioLines: [
      { icon: 'store',  text: 'Mercado · Açaí & Saudáveis' },
      { icon: 'mappin', text: 'Posição · 3° de 7 na Av. Paulista' },
      { icon: 'zap',    text: 'Evolução · 62% pro próximo nível' },
    ],
    useDefaultSectors: true,
  },

  partner: {
    bio: {
      displayName: 'Parceiro Demo',
      initials: 'PD',
      gradientStyle: { background: 'radial-gradient(ellipse 100% 100% at 45% 40%, #1f2937 0%, #0b1220 45%, #050608 100%)' },
      bioText: 'Fornecedor · Suplementos e insumos saudáveis',
      showInviteButton: true,
    },
    swipeOptions: [
      { id: 'sold-1', label: 'Açaí da Terra Paulista' },
      { id: 'sold-2', label: 'Sabor & Arte Restaurante' },
      { id: 'sold-3', label: 'Beleza Pura Clínica' },
      { id: 'sold-4', label: 'Pet Shop Amigo Fiel' },
      { id: 'sold-5', label: 'Padaria Nova Era' },
    ],
    feedCards: [
      { id: 'par-1', titulo: 'Açaí em expansão — 47 lojas', resumo: 'Setor de açaí cresceu 31% na região metropolitana de SP. 47 lojas ativas no OS¹. 68% buscam fornecedor de whey protein e granola. Demanda estimada: R$ 85 mil/mês.', tipo: 'informacao', urgencia: 'alta', tags: ['oportunidade', 'açaí'] },
      { id: 'par-2', titulo: 'Estrutura Açaí da Terra — 23 unidades', resumo: 'Estrutura precisa de fornecedor de suplementos pra nova linha "açaí proteico". Volume estimado: 500kg/mês de whey. Contato disponível no workspace.', tipo: 'alerta', urgencia: 'alta', tags: ['demanda', 'estrutura'] },
      { id: 'par-3', titulo: 'Clínicas de estética — oportunidade', resumo: '12 clínicas de estética ativas na plataforma buscam parceiros de produtos naturais. Setor cresceu 22% no trimestre. Margem média de distribuição: 28%.', tipo: 'informacao', urgencia: 'media', tags: ['oportunidade', 'estética'] },
      { id: 'par-4', titulo: 'Feira Natural Tech — dia 15', resumo: 'São Paulo, dia 15. 300 empresários do setor de alimentação saudável confirmados. Stand disponível a partir de R$ 2.500. Maior evento do segmento no Sul-Sudeste.', tipo: 'informacao', urgencia: 'media', tags: ['evento', 'networking'] },
      { id: 'par-5', titulo: 'Categoria mais procurada', resumo: 'Fornecedores e operação são as áreas com mais busca entre clientes OS¹. 78% das empresas buscam novos fornecedores. Sua categoria (suplementos) está entre as 5 mais procuradas.', tipo: 'informacao', urgencia: 'baixa', tags: ['tendência'] },
    ],
    showApproveButtons: false,
    showPendingBadge: false,
    showSummaryBar: false,
    roleStats: [
      { value: 47, label: 'oportunidades' },
      { value: 12, label: 'concorrentes' },
      { value: '+22%', label: 'crescimento' },
    ],
    bioLines: [
      { icon: 'store',  text: 'Categoria · Suplementos & insumos' },
      { icon: 'mappin', text: 'Cobertura · São Paulo metropolitana' },
      { icon: 'zap',    text: 'Evolução · 22% no trimestre' },
    ],
    useDefaultSectors: false,
  },

  team_member: {
    bio: {
      displayName: 'Afiliado Demo',
      initials: 'AD',
      gradientStyle: { background: 'radial-gradient(ellipse 100% 100% at 45% 40%, #1f2937 0%, #0b1220 45%, #050608 100%)' },
      bioText: 'Consultor comercial · São Paulo, SP',
      showInviteButton: true,
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
    roleStats: [
      { value: 5, label: 'clientes' },
      { value: 3, label: 'demos' },
      { value: '67%', label: 'conversão' },
    ],
    bioLines: [
      { icon: 'store',  text: 'Carteira · 5 clientes ativos' },
      { icon: 'mappin', text: 'Região · São Paulo capital' },
      { icon: 'zap',    text: 'Evolução · 60% da meta do mês' },
    ],
    useDefaultSectors: false,
  },
};

const FRANCHISE_FALLBACK = ROLE_CONFIGS.franchise;

export function getRoleConfig(role: string): RoleConfig {
  return ROLE_CONFIGS[role] ?? FRANCHISE_FALLBACK;
}

export const PERSONALIZED_ROLES = new Set(['codify', 'affiliate', 'franchisor', 'franchise', 'partner', 'team_member']);

// Mocks de tab data e nomes de franquias migrados para src/data/roleMocks.ts.
