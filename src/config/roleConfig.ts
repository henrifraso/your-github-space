export interface RoleBio {
  displayName: string;
  initials: string;
  gradientStyle: React.CSSProperties;
  bioText: string;
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

// Needed for React.CSSProperties
import React from 'react';

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
      { id: 'cod-2', titulo: 'Afiliado @afiliado', resumo: 'Converteu 3 de 5 demos esse mês. Taxa de 60%. Último contato: hoje.', tipo: 'informacao', urgencia: 'baixa', tags: ['afiliado'] },
      { id: 'cod-3', titulo: 'Parceiro @parceiro', resumo: '2 oportunidades de parceria ativas. Setor de estética com maior demanda.', tipo: 'informacao', urgencia: 'baixa', tags: ['parceiro'] },
    ],
    showApproveButtons: false,
    showPendingBadge: false,
    showSummaryBar: true,
    summaryNumbers: { empresas: 3, afiliados: 2, parceiros: 1 },
    useDefaultSectors: false,
  },

  affiliate: {
    bio: {
      displayName: 'Afiliado Demo',
      initials: 'AD',
      gradientStyle: { background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' },
      bioText: 'Afiliado · Vendas e pós-venda',
      showInviteButton: false,
    },
    swipeOptions: [
      { id: 'meus-clientes', label: 'Meus clientes' },
      { id: 'demos',         label: 'Demos' },
      { id: 'parceiros',     label: 'Parceiros' },
    ],
    feedCards: [
      { id: 'aff-1', titulo: 'Empresa Sabor & Arte',   resumo: 'Completou 80% das missões essa semana. Nota Google subiu de 4.2 pra 4.4. Pós-venda ativo — cliente engajado.',                                                            tipo: 'informacao', urgencia: 'baixa',  tags: ['pós-venda', 'ativo'] },
      { id: 'aff-2', titulo: 'Empresa Beleza Pura',    resumo: 'Não abriu o sistema há 5 dias. Última interação foi no feed de concorrência. Risco de churn. Ação recomendada: entrar em contato hoje.',                                   tipo: 'alerta',     urgencia: 'alta',   tags: ['risco', 'churn'] },
      { id: 'aff-3', titulo: 'Nova demo disponível',   resumo: 'Clínica Estética Renova — perfil completo com feed, mapa e 6 concorrentes mapeados. Pronta pra apresentação.',                                                               tipo: 'informacao', urgencia: 'media',  tags: ['demo', 'venda'] },
      { id: 'aff-4', titulo: 'Parceiro TechSupply',    resumo: 'Está buscando afiliados na região Sul. Comissão de 20% recorrente por indicação. Oportunidade de ampliar carteira.',                                                         tipo: 'informacao', urgencia: 'media',  tags: ['parceiro', 'oportunidade'] },
      { id: 'aff-5', titulo: 'Sua performance',        resumo: 'Taxa de conversão esse mês: 3 de 5 demos viraram clientes (60%). Meta mensal: 70%. Faltam 2 vendas pra bater.',                                                              tipo: 'informacao', urgencia: 'baixa',  tags: ['performance'] },
    ],
    showApproveButtons: false,
    showPendingBadge: false,
    showSummaryBar: false,
    useDefaultSectors: false,
  },

  franchisor: {
    bio: {
      displayName: 'Franqueador Demo',
      initials: 'FD',
      gradientStyle: { background: 'linear-gradient(135deg, #374151 0%, #111827 100%)' },
      bioText: 'Rede · Matriz e unidades',
      showInviteButton: true,
    },
    swipeOptions: [
      { id: 'minha-empresa',      label: 'Minha empresa' },
      { id: 'franquia-paulista',  label: 'Franquia Paulista' },
      { id: 'franquia-morumbi',   label: 'Franquia Morumbi' },
      { id: 'franquia-campinas',  label: 'Franquia Campinas' },
    ],
    feedCards: [
      { id: 'fr-1', titulo: 'Concorrência regional',      resumo: '2 novos concorrentes detectados na região metropolitana. Impacto potencial em 3 unidades da rede.',                                                   tipo: 'alerta',     urgencia: 'media', tags: ['concorrência'] },
      { id: 'fr-2', titulo: 'Fornecedor com condição',    resumo: 'Distribuidora Central oferece 12% de desconto pra redes com mais de 10 unidades. Válido até dia 30.',                                                 tipo: 'informacao', urgencia: 'baixa', tags: ['fornecedor'] },
      { id: 'fr-3', titulo: 'Franquia Paulista',          resumo: 'Concorrente novo detectado a 500m. Loja de açaí com nota 4.7 no Google. Aprovar envio do alerta pra unidade?',                                        tipo: 'alerta',     urgencia: 'alta',  tags: ['aprovação'], isPending: true, franchiseName: 'Franquia Paulista' },
      { id: 'fr-4', titulo: 'Franquia Morumbi',           resumo: 'Nota Google da unidade caiu de 4.5 pra 4.2. 3 avaliações negativas mencionam tempo de espera. Aprovar envio do alerta?',                              tipo: 'alerta',     urgencia: 'alta',  tags: ['aprovação'], isPending: true, franchiseName: 'Franquia Morumbi' },
      { id: 'fr-5', titulo: 'Franquia Campinas',          resumo: 'Fornecedor local com preço 15% menor que o atual da rede. Mesmo produto, avaliação 4.6. Aprovar recomendação pra unidade?',                           tipo: 'informacao', urgencia: 'media', tags: ['aprovação'], isPending: true, franchiseName: 'Franquia Campinas' },
    ],
    showApproveButtons: true,
    showPendingBadge: true,
    showSummaryBar: false,
    useDefaultSectors: false,
  },

  franchise: {
    bio: {
      displayName: 'Franquia Demo',
      initials: 'FD',
      gradientStyle: { background: 'linear-gradient(135deg, #065f46 0%, #064e3b 100%)' },
      bioText: 'Unidade · Av. Paulista',
      showInviteButton: false,
    },
    swipeOptions: [],
    feedCards: [],
    showApproveButtons: false,
    showPendingBadge: false,
    showSummaryBar: false,
    useDefaultSectors: true,
  },

  partner: {
    bio: {
      displayName: 'Parceiro Demo',
      initials: 'PD',
      gradientStyle: { background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)' },
      bioText: 'Parceiro · Oportunidades de mercado',
      showInviteButton: false,
    },
    swipeOptions: [],
    feedCards: [
      { id: 'par-1', titulo: 'Estética em crescimento',   resumo: 'Setor de estética cresceu 22% na região metropolitana. 47 clínicas ativas no OS¹. Alta demanda por fornecedores de cosméticos profissionais.',                    tipo: 'informacao', urgencia: 'media', tags: ['oportunidade', 'estética'] },
      { id: 'par-2', titulo: 'Canal de distribuição',     resumo: 'Fornecedor de embalagens biodegradáveis busca parceiros pra distribuição regional. Margem de 25% pra parceiro. Mínimo 50 unidades por pedido.',                    tipo: 'informacao', urgencia: 'media', tags: ['distribuição', 'sustentabilidade'] },
      { id: 'par-3', titulo: 'Demanda detectada',         resumo: 'Rede de 50 restaurantes precisa de fornecedor de descartáveis com entrega semanal. Volume estimado: R$ 15 mil/mês. Contato disponível no workspace.',              tipo: 'alerta',     urgencia: 'alta',  tags: ['demanda', 'alimentação'] },
      { id: 'par-4', titulo: 'Networking',                resumo: 'Evento empresarial em São Paulo dia 28. 200 empresários de 12 segmentos confirmados. Setor de alimentação e estética com maior presença.',                          tipo: 'informacao', urgencia: 'baixa', tags: ['evento', 'networking'] },
      { id: 'par-5', titulo: 'Área mais procurada',       resumo: 'Marketing é o setor com mais demanda de parceria entre os clientes OS¹. 68% das empresas buscam ferramentas e serviços de marketing digital.',                     tipo: 'informacao', urgencia: 'baixa', tags: ['tendência', 'marketing'] },
    ],
    showApproveButtons: false,
    showPendingBadge: false,
    showSummaryBar: false,
    useDefaultSectors: true,
  },

  // team_member usa o mesmo perfil do affiliate
  team_member: {
    bio: {
      displayName: 'Afiliado Demo',
      initials: 'AD',
      gradientStyle: { background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' },
      bioText: 'Afiliado · Vendas e pós-venda',
      showInviteButton: false,
    },
    swipeOptions: [
      { id: 'meus-clientes', label: 'Meus clientes' },
      { id: 'demos',         label: 'Demos' },
      { id: 'parceiros',     label: 'Parceiros' },
    ],
    feedCards: [
      { id: 'aff-1', titulo: 'Empresa Sabor & Arte',   resumo: 'Completou 80% das missões essa semana. Nota Google subiu de 4.2 pra 4.4. Pós-venda ativo — cliente engajado.',                                                            tipo: 'informacao', urgencia: 'baixa',  tags: ['pós-venda', 'ativo'] },
      { id: 'aff-2', titulo: 'Empresa Beleza Pura',    resumo: 'Não abriu o sistema há 5 dias. Última interação foi no feed de concorrência. Risco de churn. Ação recomendada: entrar em contato hoje.',                                   tipo: 'alerta',     urgencia: 'alta',   tags: ['risco', 'churn'] },
      { id: 'aff-3', titulo: 'Nova demo disponível',   resumo: 'Clínica Estética Renova — perfil completo com feed, mapa e 6 concorrentes mapeados. Pronta pra apresentação.',                                                               tipo: 'informacao', urgencia: 'media',  tags: ['demo', 'venda'] },
      { id: 'aff-5', titulo: 'Sua performance',        resumo: 'Taxa de conversão esse mês: 3 de 5 demos viraram clientes (60%). Meta mensal: 70%. Faltam 2 vendas pra bater.',                                                              tipo: 'informacao', urgencia: 'baixa',  tags: ['performance'] },
    ],
    showApproveButtons: false,
    showPendingBadge: false,
    showSummaryBar: false,
    useDefaultSectors: false,
  },
};

// independent: fallback técnico, sem experiência dedicada
const FRANCHISE_FALLBACK = ROLE_CONFIGS.franchise;

export function getRoleConfig(role: string): RoleConfig {
  return ROLE_CONFIGS[role] ?? FRANCHISE_FALLBACK;
}

// Roles que têm experiência personalizada (não usam o feed genérico do OS1)
export const PERSONALIZED_ROLES = new Set(['codify', 'affiliate', 'franchisor', 'franchise', 'partner', 'team_member']);

// Dados mock por tab para codify
export const CODIFY_TAB_DATA = {
  empresas: [
    { id: 'emp-1', nome: 'Sabor & Arte Restaurante', segmento: 'Alimentação', cidade: 'São Paulo', status: 'ativo' },
    { id: 'emp-2', nome: 'Beleza Pura Estética',     segmento: 'Estética',    cidade: 'São Paulo', status: 'em risco' },
    { id: 'emp-3', nome: 'TechCare Serviços',        segmento: 'Tecnologia',  cidade: 'Campinas',  status: 'implementando' },
  ],
  afiliados: [
    { id: 'afl-1', nome: '@afiliado',  conversao: '60%', clientes: 2, ultimoContato: 'hoje' },
    { id: 'afl-2', nome: '@afiliado2', conversao: '40%', clientes: 1, ultimoContato: '3 dias' },
  ],
  parceiros: [
    { id: 'par-1', nome: '@parceiro', setor: 'Distribuição', oportunidades: 2 },
  ],
};

// Dados mock por tab para afiliado
export const AFFILIATE_TAB_DATA = {
  'meus-clientes': [
    { id: 'cli-1', nome: 'Sabor & Arte',  status: 'ativo',         ultimaInteracao: 'hoje' },
    { id: 'cli-2', nome: 'Beleza Pura',   status: 'em risco',      ultimaInteracao: '5 dias' },
    { id: 'cli-3', nome: 'TechCare',      status: 'implementando', ultimaInteracao: '2 dias' },
  ],
  parceiros: [
    { id: 'par-1', nome: 'TechSupply',   setor: 'Tecnologia',     comissao: '20%' },
    { id: 'par-2', nome: 'LogiParceiro', setor: 'Logística',      comissao: '15%' },
  ],
};
