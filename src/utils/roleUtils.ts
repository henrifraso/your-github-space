import type { RoleFeedCard } from '../config/roleConfig';
import { PERSONALIZED_ROLES } from '../config/roleConfig';

export function isPersonalizedRole(role: string): boolean {
  return PERSONALIZED_ROLES.has(role);
}

export function getPendingCount(cards: RoleFeedCard[]): number {
  return cards.filter(c => c.isPending).length;
}

// Cards do role "Perfil Central" (interno: franchisor) por aba:
// - minha-empresa / rede / central → cards sem franchiseName (visão da Central)
// - unidade-<slug> / franquia-<slug> (legacy) → cards cujo franchiseName casa com o slug
export function filterFranchisorCardsByTab(cards: RoleFeedCard[], activeTab: string): RoleFeedCard[] {
  const isCentralTab = activeTab === 'minha-empresa' || activeTab === 'rede' || activeTab === 'central';
  if (isCentralTab) return cards.filter(c => !c.franchiseName);
  const slug = activeTab.replace(/^(unidade|franquia)-/, '').toLowerCase();
  return cards.filter(c => c.franchiseName?.toLowerCase().includes(slug));
}

// Aba "Demos" é compartilhada por codify, affiliate e team_member.
export function shouldShowRoleDemos(role: string, activeTab: string): boolean {
  if (activeTab !== 'demos') return false;
  return role === 'codify' || role === 'affiliate' || role === 'team_member';
}
