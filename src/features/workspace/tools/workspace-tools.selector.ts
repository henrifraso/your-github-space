// Seleção contextual de Ferramentas.
//
// Recebe um WorkspaceToolContext e devolve um conjunto enxuto (~12)
// de ferramentas distribuídas em 4 buckets: gerais, área, perfil,
// origem. Conteúdo movido de src/lib/workspace-tools.ts (Fase 7).
//
// Nenhuma regra de seleção foi alterada — limites, ordenação,
// deduplicação, filtros por modo/source/sensibilidade são idênticos.

import type {
  ToolGroup,
  WorkspaceTool,
  WorkspaceToolContext,
} from '../../../core/types/workspace';
import { isSensitiveDomain } from './workspace-tools.templates';
import {
  TOOLS_GERAIS,
  TOOLS_FISCAL,
  TOOLS_JURIDICO,
  TOOLS_FINANCEIRO,
  TOOLS_MARKETING,
  TOOLS_VENDAS,
  TOOLS_OPERACAO,
  TOOLS_COMPRAS,
  TOOLS_RH,
  TOOLS_TECNOLOGIA,
  TOOLS_MERCADO,
  TOOLS_DOCUMENTO,
  TOOLS_PERFIL_CENTRAL,
  TOOLS_PERFIL_UNIDADE,
  TOOLS_PERFIL_CODIFY,
  TOOLS_PERFIL_AFILIADO,
  TOOLS_PERFIL_PARCEIRO,
} from './workspace-tools.catalog';

// ─────────────────────────────────────────────────────────────────────
// MAPEAMENTO ÁREA/DOMÍNIO → CONJUNTO DE FERRAMENTAS
// ─────────────────────────────────────────────────────────────────────
const AREA_NORMALIZE = (s?: string): string =>
  (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

const matchArea = (a: string | undefined, keys: string[]): boolean => {
  const n = AREA_NORMALIZE(a);
  return keys.some((k) => n.includes(k));
};

function pickAreaTools(ctx: WorkspaceToolContext): WorkspaceTool[] {
  const area = ctx.areaMacro || ctx.domain;
  if (matchArea(area, ['fiscal', 'contabil', 'tributario', 'tributaria'])) return TOOLS_FISCAL;
  if (matchArea(area, ['juridico', 'contrato', 'legal', 'compliance', 'regulatorio'])) return TOOLS_JURIDICO;
  if (matchArea(area, ['financ', 'tesouraria', 'caixa', 'credito'])) return TOOLS_FINANCEIRO;
  if (matchArea(area, ['marketing', 'comunica', 'midia', 'publici', 'branding'])) return TOOLS_MARKETING;
  if (matchArea(area, ['vendas', 'comercial', 'pre-vendas', 'pos-vendas'])) return TOOLS_VENDAS;
  if (matchArea(area, ['operac', 'producao', 'logist', 'qualidade'])) return TOOLS_OPERACAO;
  if (matchArea(area, ['compras', 'suprimento', 'fornecedor', 'procurement'])) return TOOLS_COMPRAS;
  if (matchArea(area, ['rh', 'recursos humanos', 'gente', 'pessoas', 'recrutamento', 'trabalhista'])) return TOOLS_RH;
  if (matchArea(area, ['tecnologia', 'ti', 'sistema', 'integra', 'seguranca', 'dados', 'data', 'engenharia'])) return TOOLS_TECNOLOGIA;
  if (matchArea(area, ['mercado', 'concorrenc', 'territorio', 'expansao'])) return TOOLS_MERCADO;
  return [];
}

function pickProfileTools(ctx: WorkspaceToolContext): WorkspaceTool[] {
  // Perfil vem APENAS do role real do usuário. activeSector é só contexto de
  // setor — não decide quais ferramentas de perfil aparecem.
  const role = (ctx.role || '').toLowerCase();
  if (!role) return [];

  if (role === 'codify' || role.includes('codify')) return TOOLS_PERFIL_CODIFY;
  if (role === 'franchisor' || role.includes('central') || role.includes('matriz')) return TOOLS_PERFIL_CENTRAL;
  if (role === 'franchise' || role.includes('unidade') || role.includes('loja')) return TOOLS_PERFIL_UNIDADE;
  if (role === 'partner' || role.includes('parceir')) return TOOLS_PERFIL_PARCEIRO;
  if (role === 'affiliate' || role === 'team_member' || role.includes('afiliad')) return TOOLS_PERFIL_AFILIADO;
  return [];
}

function pickSourceTools(ctx: WorkspaceToolContext): WorkspaceTool[] {
  if (ctx.source === 'browser' || ctx.source === 'upload') return TOOLS_DOCUMENTO;
  return [];
}

// ─────────────────────────────────────────────────────────────────────
// SELETOR INTELIGENTE
// ─────────────────────────────────────────────────────────────────────
// Devolve no máx. ~12 ferramentas: 4 gerais + 4 área + 2 perfil + 2 source.
// Filtra ferramentas sensíveis quando o contexto não é sensível
// (para evitar oferecer tools jurídicas/fiscais em conteúdo de marketing).
export function getToolsForContext(ctx: WorkspaceToolContext): {
  gerais: WorkspaceTool[];
  area: WorkspaceTool[];
  perfil: WorkspaceTool[];
  origem: WorkspaceTool[];
  total: number;
} {
  const isSensitive = ctx.isSensitive ?? isSensitiveDomain(ctx.domain) ?? isSensitiveDomain(ctx.areaMacro);

  const filterByMode = (t: WorkspaceTool): boolean => {
    if (!t.modes || t.modes.length === 0) return true;
    if (!ctx.mode) return true;
    return t.modes.includes(ctx.mode);
  };

  const filterBySource = (t: WorkspaceTool): boolean => {
    if (!t.source || t.source.length === 0) return true;
    if (!ctx.source) return true;
    return t.source.includes(ctx.source);
  };

  const sensitiveOk = (t: WorkspaceTool): boolean => {
    if (!t.sensitive) return true;
    return !!isSensitive;
  };

  const gerais = TOOLS_GERAIS.filter(filterByMode).filter(filterBySource).filter(sensitiveOk).slice(0, 4);

  const areaPool = pickAreaTools(ctx);
  const area = areaPool.filter(filterByMode).filter(filterBySource).slice(0, 4);

  const perfilPool = pickProfileTools(ctx);
  const perfil = perfilPool.filter(filterByMode).filter(filterBySource).slice(0, 2);

  const origemPool = pickSourceTools(ctx);
  const origem = origemPool.filter(filterByMode).slice(0, 2);

  // Deduplica por id (caso uma tool apareça em mais de um pool)
  const seen = new Set<string>();
  const dedupe = (list: WorkspaceTool[]) =>
    list.filter((t) => (seen.has(t.id) ? false : (seen.add(t.id), true)));

  const g = dedupe(gerais);
  const a = dedupe(area);
  const p = dedupe(perfil);
  const o = dedupe(origem);

  return {
    gerais: g,
    area: a,
    perfil: p,
    origem: o,
    total: g.length + a.length + p.length + o.length,
  };
}

// ─────────────────────────────────────────────────────────────────────
// METADADOS DE GRUPO (rótulos curtos pra UI)
// ─────────────────────────────────────────────────────────────────────
export const GROUP_LABEL: Record<ToolGroup, string> = {
  decisao: 'Decisão',
  execucao: 'Execução',
  evidencia: 'Evidência',
  comunicacao: 'Comunicação',
  monitoramento: 'Monitoramento',
  validacao: 'Validação',
  analise: 'Análise',
  documento: 'Documento',
};

// Ordem visual padrão (decisão e execução primeiro, comunicação e documento por último)
export const GROUP_ORDER: ToolGroup[] = [
  'decisao',
  'execucao',
  'analise',
  'evidencia',
  'validacao',
  'monitoramento',
  'comunicacao',
  'documento',
];

export function groupTools(tools: WorkspaceTool[]): Record<ToolGroup, WorkspaceTool[]> {
  const out = {} as Record<ToolGroup, WorkspaceTool[]>;
  for (const g of GROUP_ORDER) out[g] = [];
  for (const t of tools) {
    if (!out[t.group]) out[t.group] = [];
    out[t.group].push(t);
  }
  return out;
}
