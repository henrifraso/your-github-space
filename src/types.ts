export interface Competitor {
  nome: string;
  nota_google: number | string;
  endereco: string;
  cidade: string;
  faixa_preco: string;
  faz_bem?: string[];
  nao_oferece?: string[];
  mudancas_recentes?: string[];
  proposta_principal?: string;
  diferencial?: string;
  notas_digitais?: { plataforma: string; nota: number }[];
}

export interface TimelineEvent {
  id: string;
  data: string;
  tipo: 'concorrente' | 'fornecedor' | 'mercado';
  icone: string;
  titulo: string;
  detalhe: string;
}

export interface Supplier {
  nome: string;
  cidade: string;
  estado: string;
  telefone: string;
  email: string;
  preco_referencia: number;
  produto_servico: string;
}

export interface Practice {
  titulo: string;
  conteudo: string;
  fonte: string;
}

export interface Weather {
  dia_label: string;
  icone: string;
  temp_max: number;
  temp_min: number;
  chuva_mm: number;
}

export interface GamificationLog {
  acao: string;
  pontos: number;
}

export interface PEPItem {
  tipo: string;
  texto: string;
  icone?: string;
  acao?: string;
}

export interface PEPContainer {
  plano: PEPItem[];
  estrategia: PEPItem[];
  pratica: PEPItem[];
}

export interface OmniData {
  negocio: {
    id?: string;
    nome_fantasia: string;
    segmento: string;
    cidade: string;
    estado: string;
    telefone: string;
    nivel: number;
    pontos: number;
  };
  semana_label: string;
  mercado_nome?: string;
  mercado_tamanho?: string;
  ranking_local?: number;
  progresso_pct: number;
  nivel_label: string;
  pontos_proximo: number;
  concorrentes: Competitor[];
  fornecedores: Supplier[];
  praticas: Practice[];
  previsao_clima: Weather[];
  gamificacao_log: GamificationLog[];
  pesquisa: { resumo: string };
  timeline?: TimelineEvent[];
  pep?: Record<string, PEPContainer>;
}

export interface StorySlide {
  image: string;
  title: string;
  body: string;
}

export interface StoryGroup {
  label: string;
  seed: string;
  thumb: string;
  slides: StorySlide[];
}
