// Metadados editoriais de medição — separados de IntelligenceCard/mkR() porque
// esse tipo é o shape de exibição, usado também por cards reais do backend que
// não passam por este processo. Formato id → atributos, pra migrar depois pra
// tabela no backend (omni) quando a medição de diferencial virar prioridade.
// Ver docs/MODELO_MOTOR_OS1.md, seção "Decisão de arquitetura — metadados de
// medição" (09/ago/2026).

export type Eixo = 'posicao' | 'ponto_cego' | 'espaco_vazio';

export interface CardMetadata {
  atributoTocado: string;
  concorrentes: string[];
  movimento: string;
  eixo: Eixo;
  dataFonte: string;
}

export const CARD_METADATA: Record<string, CardMetadata> = {
  'oscar-centauro-azzas-1t26': {
    atributoTocado: 'amplitude de portfólio (marca esportiva vs. marca de moda)',
    concorrentes: ['Centauro (Grupo SBF)', 'Azzas 2154 (Arezzo)'],
    movimento: 'Centauro ampliou receita; Azzas reduziu receita e lucro — mesmo trimestre',
    eixo: 'posicao',
    dataFonte: '2026-03-31',
  },
  'oscar-nike-lojas-proprias': {
    atributoTocado: 'distribuição/revenda de marca licenciada (Nike)',
    concorrentes: ['Nike'],
    movimento: 'Nike vai abrir 6 lojas próprias',
    eixo: 'ponto_cego',
    dataFonte: '2026-03-17',
  },
  'oscar-pmc-vestuario-virada': {
    atributoTocado: 'gestão de desconto em ciclo de baixa (fôlego de margem)',
    concorrentes: [],
    movimento: 'volume de vendas do setor vira positivo em maio após 4 meses negativos',
    eixo: 'posicao',
    dataFonte: '2026-05-31',
  },
  'oscar-confianca-consumidor': {
    atributoTocado: 'variedade de faixa de preço (entrada vs. premium)',
    concorrentes: [],
    movimento: 'confiança do consumidor cai pelo 3º mês seguido',
    eixo: 'posicao',
    dataFonte: '2026-07-27',
  },
};
