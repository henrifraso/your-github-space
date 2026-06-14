// Contexto unificado de ação para o executor central (W3.1).
//
// W3.1-A: apenas source='workspace' é executado no backend.
// Demais sources têm tipos declarados mas executeAction retorna null
// enquanto os endpoints correspondentes não existirem.

import type { IntelligenceCard } from '../../../core/types/card';
import type { MainKey, Dificuldade, SubAction } from '../generation/workspace-generation';

export type ActionSource =
  | 'workspace'   // sub-ação da Área de Trabalho (SUB_BTNS)
  | 'shortcut'    // atalho do catálogo (W3.1-B+)
  | 'tool'        // ferramenta da Área de Trabalho (W3.1-B+)
  | 'browser'     // ação do navegador OS¹ (W3.1-C+)
  | 'map'         // ação do mapa competitivo (W3.1-D+)
  | 'ontology';   // diagnóstico da empresa (W3.1-E+)

export interface ActionContext {
  source: ActionSource;

  // Área de Trabalho — obrigatório quando source = 'workspace'
  card?: IntelligenceCard;
  mode?: MainKey;
  sub?: SubAction;
  dificuldade?: Dificuldade;

  // Navegador — W3.1-C+
  browser?: {
    url: string;
    title: string;
    capturedText?: string;
    capturedAt: string;
  };

  // Mapa competitivo — W3.1-D+
  map?: {
    center: { lat: number; lng: number };
    radius: number;
    sector: string;
    businessName?: string;
    competitorsInRadius: Array<{ nome: string; nota_google?: string; dist_km?: number }>;
    totalInView: number;
    analysisSummary?: string;
  };

  // Ontologia/diagnóstico — W3.1-E+
  ontology?: {
    maturityScore: number;
    summary: string;
    criticalGaps: string[];
    opportunities: string[];
  };
}
