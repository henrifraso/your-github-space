// Estrutura de conectores Fase 2 — ainda não conectada ao fluxo de feed.
// Ver projeto_omni_perfis_demo.md.
//
// SourceConnector define o contrato que toda fonte de dado externa deve
// implementar para ser plugada ao Business Brain sem reprogramar o sistema.
// Contratar uma fonte nova = criar um conector que satisfaz esta interface.

import type { IntelligenceCard } from '../types/card';

// Os 10 tipos de análise que uma fonte pode alimentar.
// Decididos em 29/jun/2026 — escada Gartner + extensões OS¹.
export type AnalysisType =
  | 'descritiva'
  | 'diagnostica'
  | 'preditiva'
  | 'prescritiva'
  | 'comparativa'
  | 'tendencias'
  | 'sentimento'
  | 'inferencial'
  | 'exploratoria'
  | 'cognitiva';

export type SourceLicense =
  | 'publica'      // dado aberto, sem restrição de uso comercial
  | 'aberta'       // licença permissiva, uso comercial permitido com atribuição
  | 'comercial'    // requer contrato/pagamento para uso comercial
  | 'restrita';    // uso limitado — consultar advogado antes de usar

export type SourceStatus =
  | 'disponivel'   // conector implementado, pronto para uso
  | 'planejado'    // fonte identificada, conector ainda não implementado
  | 'contratado';  // licença adquirida, aguardando implementação

export interface SourceConnector {
  // Identificador único da fonte (ex: 'cmed', 'brightdata-ecommerce').
  id: string;

  // Nome legível para exibição e catálogo.
  name: string;

  // Quais dos 10 tipos de análise esta fonte é capaz de alimentar.
  analysisTypes: AnalysisType[];

  // Tipo de licença. NUNCA usar 'restrita' em prod sem aprovação jurídica.
  license: SourceLicense;

  // Estado do conector no sistema.
  status: SourceStatus;

  // Converte o dado bruto da fonte em IntelligenceCards prontos para o feed.
  // `raw` é unknown porque cada fonte entrega um formato diferente —
  // é responsabilidade do conector fazer a conversão e validação.
  // Retorna [] em qualquer falha (sem lançar exceção).
  toIntelligenceCards: (raw: unknown) => IntelligenceCard[];
}
