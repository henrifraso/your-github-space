// Mocks de dados por role consumidos pelas abas dos perfis personalizados.
// Layout/config ficam em src/config/roleConfig.ts — aqui é só dado.

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

// Nomes das unidades conectadas exibidos para o Perfil Central.
// Chave do export mantida (compat de import); valores atualizados pra nova linguagem.
export const FRANCHISOR_FRANCHISE_NAMES = [
  'Unidade Paulista',
  'Unidade Morumbi',
  'Unidade Campinas',
];

export type PartnerSoldCompany = {
  id: string;
  nome: string;
  segmento: string;
  cidade: string;
  valor: string;
  status: 'ativo' | 'pendente' | 'renovação';
  contato: string;
  desde: string;
};

export const PARTNER_SOLD_COMPANIES: PartnerSoldCompany[] = [
  { id: 'sold-1', nome: 'Açaí da Terra Paulista',  segmento: 'Açaí',          cidade: 'São Paulo',   valor: 'R$ 4.200/mês', status: 'ativo',      contato: 'Marcos Lima · (11) 9 8765-1234',   desde: 'Jan/2026' },
  { id: 'sold-2', nome: 'Sabor & Arte Restaurante', segmento: 'Alimentação',   cidade: 'São Paulo',   valor: 'R$ 2.800/mês', status: 'ativo',      contato: 'Joana Reis · (11) 9 8123-4567',     desde: 'Fev/2026' },
  { id: 'sold-3', nome: 'Beleza Pura Clínica',      segmento: 'Estética',      cidade: 'São Paulo',   valor: 'R$ 1.950/mês', status: 'renovação', contato: 'Patrícia Souza · (11) 9 9912-3344', desde: 'Mar/2025' },
  { id: 'sold-4', nome: 'Pet Shop Amigo Fiel',      segmento: 'Pet',           cidade: 'Campinas',    valor: 'R$ 1.500/mês', status: 'pendente',  contato: 'André Costa · (19) 9 8877-6655',   desde: 'Abr/2026' },
  { id: 'sold-5', nome: 'Padaria Nova Era',         segmento: 'Alimentação',   cidade: 'Campinas',    valor: 'R$ 2.100/mês', status: 'ativo',      contato: 'Eduardo Pinto · (19) 9 9123-7788',  desde: 'Dez/2025' },
];
