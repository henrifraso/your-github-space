// Registry de entradas do motor de inteligência OS¹.
// Cada entrada descreve uma fonte ou tipo de dado que alimenta Feed, Score, Mapa e Área de Trabalho.
// Não exibir IDs técnicos ao usuário final — usar label e description.

export type InputOrigin = 'manual' | 'upload' | 'browser' | 'map' | 'public' | 'api';
export type InputType = 'context' | 'signal' | 'reputation' | 'competitor' | 'territory' | 'internal';
export type InputMotor = 'horizontal' | 'vertical';
export type InputStatus = 'ativo' | 'demo' | 'futuro' | 'api_vertical';
export type FeedScreen = 'Feed' | 'Score' | 'Mapa' | 'Área de Trabalho';

export interface IntelligenceInput {
  id: string;
  label: string;
  description: string;
  origin: InputOrigin;
  type: InputType;
  motor: InputMotor;
  screens: FeedScreen[];
  status: InputStatus;
}

export const INTELLIGENCE_INPUTS: IntelligenceInput[] = [
  {
    id: 'manual_context',
    label: 'Contexto da empresa',
    description: 'Informações inseridas manualmente via Configuração da Empresa ou chat.',
    origin: 'manual',
    type: 'context',
    motor: 'horizontal',
    screens: ['Feed', 'Score', 'Área de Trabalho'],
    status: 'ativo',
  },
  {
    id: 'uploaded_file',
    label: 'Arquivos enviados',
    description: 'Documentos, planilhas ou textos enviados pelo usuário como contexto interno.',
    origin: 'upload',
    type: 'context',
    motor: 'horizontal',
    screens: ['Score', 'Área de Trabalho'],
    status: 'ativo',
  },
  {
    id: 'company_settings',
    label: 'Configuração do negócio',
    description: 'Dados estruturados da Configuração da Empresa — porte, metas, canais, território.',
    origin: 'manual',
    type: 'context',
    motor: 'horizontal',
    screens: ['Feed', 'Score', 'Mapa', 'Área de Trabalho'],
    status: 'ativo',
  },
  {
    id: 'browser_url',
    label: 'Navegador conectado',
    description: 'Páginas navegadas pelo usuário no Navegador OS¹ — fonte de sinais contextuais.',
    origin: 'browser',
    type: 'signal',
    motor: 'horizontal',
    screens: ['Feed', 'Área de Trabalho'],
    status: 'ativo',
  },
  {
    id: 'map_signal',
    label: 'Sinais do Mapa',
    description: 'Dados geográficos e competitivos captados no Mapa — concorrentes, raio, território.',
    origin: 'map',
    type: 'territory',
    motor: 'horizontal',
    screens: ['Mapa', 'Feed', 'Score'],
    status: 'ativo',
  },
  {
    id: 'public_reputation',
    label: 'Reputação pública',
    description: 'Avaliações, notas e menções públicas — Google, Reclame Aqui, redes sociais.',
    origin: 'public',
    type: 'reputation',
    motor: 'horizontal',
    screens: ['Score', 'Feed'],
    status: 'ativo',
  },
  {
    id: 'competitor_signal',
    label: 'Sinais de concorrência',
    description: 'Movimentações de concorrentes — novos produtos, preços, aberturas, reputação.',
    origin: 'public',
    type: 'competitor',
    motor: 'horizontal',
    screens: ['Feed', 'Mapa', 'Score'],
    status: 'demo',
  },
  {
    id: 'news_signal',
    label: 'Notícias e tendências',
    description: 'Sinais de mercado de fontes jornalísticas e setoriais relevantes.',
    origin: 'public',
    type: 'signal',
    motor: 'horizontal',
    screens: ['Feed', 'Área de Trabalho'],
    status: 'demo',
  },
  {
    id: 'official_registry_signal',
    label: 'Registros oficiais',
    description: 'Dados de fontes públicas — CNPJ, alvarás, registros setoriais, órgãos reguladores.',
    origin: 'public',
    type: 'signal',
    motor: 'horizontal',
    screens: ['Score', 'Feed'],
    status: 'futuro',
  },
  {
    id: 'sales_api',
    label: 'Dados de vendas',
    description: 'Volume, ticket médio, mix e tendência de vendas — integração futura com ERP/PDV.',
    origin: 'api',
    type: 'internal',
    motor: 'vertical',
    screens: ['Feed', 'Score', 'Área de Trabalho'],
    status: 'api_vertical',
  },
  {
    id: 'crm_api',
    label: 'CRM e relacionamento',
    description: 'Dados de clientes, pipeline comercial e histórico de interações.',
    origin: 'api',
    type: 'internal',
    motor: 'vertical',
    screens: ['Feed', 'Área de Trabalho'],
    status: 'api_vertical',
  },
  {
    id: 'erp_api',
    label: 'ERP e gestão',
    description: 'Dados financeiros, contábeis e operacionais do sistema de gestão.',
    origin: 'api',
    type: 'internal',
    motor: 'vertical',
    screens: ['Score', 'Área de Trabalho'],
    status: 'api_vertical',
  },
  {
    id: 'pdv_api',
    label: 'Ponto de venda',
    description: 'Dados de transações, ruptura e desempenho por PDV.',
    origin: 'api',
    type: 'internal',
    motor: 'vertical',
    screens: ['Feed', 'Mapa', 'Score'],
    status: 'api_vertical',
  },
  {
    id: 'inventory_api',
    label: 'Estoque',
    description: 'Níveis de estoque, giro, ruptura e cobertura por produto.',
    origin: 'api',
    type: 'internal',
    motor: 'vertical',
    screens: ['Feed', 'Área de Trabalho'],
    status: 'api_vertical',
  },
  {
    id: 'orders_api',
    label: 'Pedidos',
    description: 'Volume, status e histórico de pedidos — integração com sistemas de distribuição.',
    origin: 'api',
    type: 'internal',
    motor: 'vertical',
    screens: ['Feed', 'Área de Trabalho'],
    status: 'api_vertical',
  },
  {
    id: 'reviews_api',
    label: 'Avaliações internas',
    description: 'Notas e comentários de clientes coletados diretamente pela empresa.',
    origin: 'api',
    type: 'reputation',
    motor: 'vertical',
    screens: ['Score', 'Feed'],
    status: 'api_vertical',
  },
  {
    id: 'support_api',
    label: 'Atendimento',
    description: 'Tickets, chamados e histórico de suporte — volume, tempo de resposta, motivos.',
    origin: 'api',
    type: 'internal',
    motor: 'vertical',
    screens: ['Score', 'Área de Trabalho'],
    status: 'api_vertical',
  },
  {
    id: 'logistics_api',
    label: 'Logística',
    description: 'Entregas, frota, rotas e desempenho logístico operacional.',
    origin: 'api',
    type: 'internal',
    motor: 'vertical',
    screens: ['Mapa', 'Feed'],
    status: 'api_vertical',
  },
  {
    id: 'events_api',
    label: 'Eventos e calendário',
    description: 'Eventos regionais, feiras, sazonalidades e datas relevantes para o setor.',
    origin: 'public',
    type: 'signal',
    motor: 'horizontal',
    screens: ['Feed', 'Mapa'],
    status: 'futuro',
  },
];

export const ACTIVE_INPUTS = INTELLIGENCE_INPUTS.filter(i => i.status === 'ativo');
export const DEMO_INPUTS   = INTELLIGENCE_INPUTS.filter(i => i.status === 'demo');
export const FUTURE_INPUTS = INTELLIGENCE_INPUTS.filter(i => i.status === 'futuro' || i.status === 'api_vertical');
