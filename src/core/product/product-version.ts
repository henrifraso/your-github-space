// ProductVersion — molde de produto versionado (Fase 2). Ainda NÃO ligado ao App.tsx;
// a migração do framing é etapa futura. Ver projeto_omni_perfis_demo.md.
//
// Um ProductVersion descreve um produto OS¹ completo: qual sector usa, como se chama,
// qual formato de análise demonstra, quais fontes o alimentariam e se tem guard de loja.
// Objetivo: colapsar os 6 pontos de toque dispersos (SectorSwitcher, sector-feeds,
// demo-feed-cards, codify-sector-scope, App.tsx framing, guards) em um registro central.

import type { SectorId } from '../../components/SectorSwitcher';
import type { AnalysisType } from '../adapters/source-connector';

// Direção do produto — maturidade tecnológica da empresa cliente (decisão 30/jun/2026).
// HORIZONTAL = empresa sem inteligência de mercado (entrada); pode receber módulos conforme cresce.
// VERTICAL   = empresa que já tem tecnologia (avançada); tem módulo(s) dentro.
// HIBRIDA    = transição: horizontal que ganhou a camada vertical.
export type ProductFormat = 'horizontal' | 'vertical' | 'hibrida';

export interface ProductVersion {
  // Identificador semântico do produto (não é o sectorId legado).
  id: string;

  // Sector existente ao qual este produto está mapeado.
  // Os nomes 'nubank'/'nike' são legados do SectorSwitcher — não indicam as empresas.
  sectorId: SectorId;

  // Nome visual completo exibido no header e na Área de Trabalho.
  name: string;

  // Badge de formato exibido abaixo do nome.
  badge: string;

  // Direção geométrica — define o "tipo de leitura" do produto.
  format: ProductFormat;

  // Quais dos 10 tipos de análise este produto demonstra hoje.
  // Lista parcial: o produto pode demonstrar mais quando as fontes reais forem conectadas.
  analysisTypes: AnalysisType[];

  // IDs de conectores do source-registry que alimentariam este produto na Fase 2.
  // Vazio = produto ainda usa apenas DEMO_FEED_CARDS.
  sourceIds: string[];

  // Organização real no backend Codify (copiado de codify-sector-scope — não importado).
  // undefined = sem org real ainda (apenas demo).
  realOrgId?: string;

  // Unidade real no backend Codify.
  realUnitId?: string;

  // true quando o botão "+" de loja/abas está bloqueado via guard no App.tsx.
  // Todos os 3 produtos em ar têm true — os sector-feeds internos estão sujos ou incompletos.
  blocksStoreSwitcher: boolean;

  // Texto da versão exibido na bio ("Versão · X"), sem o prefixo "OS¹ [setor] — ".
  versionLabel: string;
}
