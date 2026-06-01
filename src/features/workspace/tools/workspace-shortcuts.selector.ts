// Seletor de atalhos contextuais.
//
// Devolve 1-3 atalhos curados por contexto, na ordem visual sugerida:
//   1. Atalho mais forte da área (kind='atalho' ou 'ferramenta')
//   2. Atalho secundário (referência/conexão)
//   3. [Dado] quando o tema é sensível (no topo, não-clicável)
//
// Áreas sensíveis (fiscal/jurídico/lgpd) sempre incluem o [Dado] de
// aviso no topo. Demais contextos priorizam o atalho mais acionável.

import type {
  WorkspaceShortcut,
  WorkspaceToolContext,
} from '../../../core/types/workspace';
import { isSensitiveDomain } from './workspace-tools.templates';
import {
  SHORTCUTS_CONCORRENCIA,
  SHORTCUTS_FINANCEIRO,
  SHORTCUTS_FISCAL,
  SHORTCUTS_JURIDICO,
  SHORTCUTS_MARKETING,
  SHORTCUTS_OPERACAO,
  SHORTCUTS_MAPA,
  SHORTCUTS_NAVEGADOR,
  SHORTCUTS_PERFIL_CENTRAL,
  SHORTCUTS_PERFIL_UNIDADE,
  SHORTCUTS_GERAIS,
} from './workspace-shortcuts.catalog';

// Preferência forte por 1 atalho contextual. Áreas sensíveis ganham um
// [Dado] de aviso no topo (sobe pra 2). Nunca passa de 2.
const MAX_SHORTCUTS_DEFAULT = 1;
const MAX_SHORTCUTS_SENSITIVE = 2;

const AREA_NORMALIZE = (s?: string): string =>
  (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

const matchArea = (a: string | undefined, keys: string[]): boolean => {
  const n = AREA_NORMALIZE(a);
  return keys.some((k) => n.includes(k));
};

function pickAreaShortcuts(ctx: WorkspaceToolContext): WorkspaceShortcut[] {
  const area = ctx.areaMacro || ctx.domain;
  if (matchArea(area, ['fiscal', 'contabil', 'tributario', 'tributaria'])) return SHORTCUTS_FISCAL;
  if (matchArea(area, ['juridico', 'compliance', 'lgpd', 'contrato', 'regulatorio'])) return SHORTCUTS_JURIDICO;
  if (matchArea(area, ['financ', 'tesouraria', 'caixa', 'credito'])) return SHORTCUTS_FINANCEIRO;
  if (matchArea(area, ['marketing', 'comunica', 'midia', 'publici', 'branding', 'vendas', 'comercial'])) return SHORTCUTS_MARKETING;
  if (matchArea(area, ['operac', 'producao', 'logist', 'qualidade', 'processos'])) return SHORTCUTS_OPERACAO;
  if (matchArea(area, ['concorrenc', 'mercado', 'territorio', 'preco', 'preço', 'expansao'])) return SHORTCUTS_CONCORRENCIA;
  return [];
}

function pickSourceShortcuts(ctx: WorkspaceToolContext): WorkspaceShortcut[] {
  if (ctx.source === 'map') return SHORTCUTS_MAPA;
  if (ctx.source === 'browser' || ctx.source === 'upload') return SHORTCUTS_NAVEGADOR;
  return [];
}

function pickProfileShortcuts(ctx: WorkspaceToolContext): WorkspaceShortcut[] {
  const role = (ctx.role || '').toLowerCase();
  if (!role) return [];
  if (role === 'franchisor' || role.includes('central') || role.includes('matriz')) return SHORTCUTS_PERFIL_CENTRAL;
  if (role === 'franchise' || role.includes('unidade') || role.includes('loja')) return SHORTCUTS_PERFIL_UNIDADE;
  return [];
}

/**
 * Devolve 1 atalho contextual (ou 2 quando o tema é sensível: Dado + acionável).
 *
 * Estratégia (preferência por 1 forte):
 *  - Sensível    → [Dado] de aviso + 1 atalho acionável da área.
 *  - Mapa/Navegador → 1 atalho da fonte (ferramenta ou atalho).
 *  - Área conhecida → 1 atalho mais forte (ferramenta preferencial; senão atalho).
 *  - Sem match → 1 atalho geral (plano de ação).
 *
 * O atalho mais forte de cada contexto é o PRIMEIRO da lista do catálogo —
 * curado manualmente em workspace-shortcuts.catalog.ts.
 */
export function getShortcutsForContext(ctx: WorkspaceToolContext): WorkspaceShortcut[] {
  const isSensitive = ctx.isSensitive ?? isSensitiveDomain(ctx.domain, ctx.areaMacro);
  const limit = isSensitive ? MAX_SHORTCUTS_SENSITIVE : MAX_SHORTCUTS_DEFAULT;

  const areaPool = pickAreaShortcuts(ctx);
  const sourcePool = pickSourceShortcuts(ctx);
  const profilePool = pickProfileShortcuts(ctx);

  const seen = new Set<string>();
  const out: WorkspaceShortcut[] = [];

  const tryAdd = (sc?: WorkspaceShortcut) => {
    if (!sc) return;
    if (seen.has(sc.id)) return;
    if (out.length >= limit) return;
    seen.add(sc.id);
    out.push(sc);
  };

  // 1) Sensível: [Dado] de aviso no topo (não-clicável)
  if (isSensitive) {
    const dado = areaPool.find(s => s.kind === 'dado');
    tryAdd(dado);
  }

  // 2) Atalho clicável principal — prioridade: source > área > perfil > geral
  const principal =
       sourcePool.find(s => s.kind === 'ferramenta' || s.kind === 'atalho')
    || areaPool.find(s => s.kind === 'ferramenta')
    || areaPool.find(s => s.kind === 'atalho')
    || profilePool.find(s => s.kind === 'ferramenta' || s.kind === 'atalho')
    || areaPool.find(s => s.kind === 'conexao' || s.kind === 'referencia')
    || profilePool.find(s => s.kind === 'conexao')
    || SHORTCUTS_GERAIS[0];
  tryAdd(principal);

  return out.slice(0, limit);
}
