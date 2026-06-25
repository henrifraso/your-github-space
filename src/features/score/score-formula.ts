import type { ScoreInsight } from './ScoreOS1Panel';

const HIGH_RISK_DOMAINS = ['reputacao', 'concorrencia'];

export function calcScoreInicial(insights: ScoreInsight[], uploadsCount: number): number {
  const BASE = 62;

  const altaCount     = insights.filter(i => i.urgencia === 'alta').length;
  const moderadaCount = insights.filter(i => i.urgencia === 'moderada').length;
  const penUrg        = Math.min(altaCount * 5 + moderadaCount * 2, 20);

  const highRiskCount = insights.filter(i => HIGH_RISK_DOMAINS.includes(i.dominio ?? '')).length;
  const penDom        = Math.min(highRiskCount * 3, 12);

  const bonusCtx      = Math.min(uploadsCount * 3, 9);
  const bonusSinais   = Math.min(insights.length * 2, 10);

  const penEscassos   = insights.length === 0 ? 10 : insights.length < 2 ? 5 : 0;

  const raw = BASE - penUrg - penDom + bonusCtx + bonusSinais - penEscassos;
  return Math.max(15, Math.min(95, raw));
}

export function nivelLabelCalculado(s: number): string {
  if (s >= 80) return 'Estável';
  if (s >= 60) return 'Atenção leve';
  if (s >= 40) return 'Atenção moderada';
  if (s >= 20) return 'Atenção alta';
  return 'Atenção crítica';
}
