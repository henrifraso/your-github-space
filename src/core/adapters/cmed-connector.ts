// Estrutura de conectores Fase 2 — ainda não conectada ao fluxo de feed.
// Ver projeto_omni_perfis_demo.md.
//
// Conector CMED/ANVISA — fonte pública de preços de medicamentos.
// Publicada pelo Ministério da Saúde, licença aberta para uso comercial.
// URL base (quando fetch real): https://www.gov.br/anvisa/pt-br/assuntos/medicamentos/cmed/precos
//
// toIntelligenceCards recebe um array de linhas da tabela CMED (tipicamente
// CMED_FIXTURE para demo, ou JSON parseado de CSV real no futuro) e
// gera cards descritivos de preço regulado prontos para o feed da Pacheco.

import type { IntelligenceCard } from '../types/card';
import type { SourceConnector } from './source-connector';

// Sanitiza uma string para uso como parte de id de card (sem espaços/caracteres especiais).
function toSlug(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

interface CmedRow {
  produto: string;
  apresentacao: string;
  principioAtivo: string;
  pfSemImposto: number;
  pmcSemImposto?: number;
}

function isCmedRow(x: unknown): x is CmedRow {
  if (!x || typeof x !== 'object') return false;
  const r = x as Record<string, unknown>;
  return (
    typeof r.produto === 'string' &&
    typeof r.apresentacao === 'string' &&
    typeof r.principioAtivo === 'string' &&
    typeof r.pfSemImposto === 'number'
  );
}

function rowToCard(row: CmedRow): IntelligenceCard {
  const pf  = row.pfSemImposto.toFixed(2).replace('.', ',');
  const pmc = row.pmcSemImposto != null
    ? ` · PMC s/imposto: R$ ${row.pmcSemImposto.toFixed(2).replace('.', ',')}`
    : '';

  return {
    id:              `cmed-${toSlug(row.principioAtivo)}-${toSlug(row.apresentacao)}`,
    titulo:          `Teto CMED: ${row.produto} (${row.apresentacao})`,
    resumo:          `Preço de Fábrica s/imposto: R$ ${pf}${pmc}. Fonte: tabela CMED/ANVISA vigente.`,
    por_que_importa: `O teto CMED define o preço máximo legal de venda. Comprar acima do PF ou vender acima do PMC expõe a farmácia a penalidades da ANVISA.`,
    o_que_fazer:     `Conferir se o preço praticado está dentro do teto regulatório. Em caso de divergência, acionar o fornecedor antes do próximo pedido.`,
    onde_afeta:      'Compras · Precificação · Compliance regulatório',
    dominio:         'REGULATÓRIO',
    area:            'Medicamentos',
    tipo_card:       'regulatorio',
    urgencia:        'media',
    confianca:       'alta',
    confianca_score: 0.91,
    impacto:         'moderado',
    risco_erro:      0.08,
    tags:            ['cmed', 'anvisa', 'preco-regulado', row.principioAtivo.toLowerCase()],
    _synthetic:      true,
  };
}

export const CMED_CONNECTOR: SourceConnector = {
  id:            'cmed',
  name:          'CMED/ANVISA — Tabela de Preços de Medicamentos',
  analysisTypes: ['descritiva'],
  license:       'publica',
  status:        'disponivel',

  toIntelligenceCards: (raw: unknown): IntelligenceCard[] => {
    try {
      if (!Array.isArray(raw)) return [];
      return raw.filter(isCmedRow).map(rowToCard);
    } catch {
      return [];
    }
  },
};
