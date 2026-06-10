// Tipos de domínio para cards do OS¹.
//
// IntelligenceCard é o shape canônico de qualquer card no sistema (feed,
// mapa, navegador, diagnóstico). Cards "sintéticos" carregam _synthetic=true
// e existem só no cliente (não vivem no backend).

export interface IntelligenceCard {
  id: string;
  titulo: string;
  resumo: string;
  por_que_importa?: string;
  onde_afeta?: string;
  o_que_fazer?: string;
  dominio: string;
  area: string;
  dificuldade?: string;
  confianca: string;
  confianca_score: number;
  impacto: string;
  risco_erro: number;
  sinais_usados?: string[];
  gap_id?: string;
  tipo_card: string;
  urgencia: string;
  versoes?: Record<string, {
    titulo: string;
    o_que_aconteceu: string;
    por_que_importa: string;
    onde_afeta: string;
    o_que_fazer: string;
  }>;
  share_token?: string;
  publicado_em?: string;
  tags?: string[];
  // Marca cards cujo conteúdo é hipótese a validar (sem dado medido).
  // Calculado no adapter de feed a partir de tags e texto do card.
  isHypothesis?: boolean;
  // Rastreador do pacote de ingestão que originou o card (publisher
  // do tools/codify_ingestion). Usado pelo hook de Contexto Editorial
  // para vincular itens estruturalmente. Vazio/None para cards demo
  // e cards F1 pré-fix F2.
  createdBy?: string | null;
  // Sintético = card mockado que não existe no backend.
  _synthetic?: boolean;
}

// Intenção do usuário ao abrir um card na Área de Trabalho.
export type WorkspaceIntent = 'utilizar' | 'perguntas' | 'exemplos' | 'compartilhar';
