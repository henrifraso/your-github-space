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

export const FRANCHISOR_FRANCHISE_NAMES = [
  'Franquia Paulista',
  'Franquia Morumbi',
  'Franquia Campinas',
  'Franquia Copacabana',
  'Franquia Savassi',
];
