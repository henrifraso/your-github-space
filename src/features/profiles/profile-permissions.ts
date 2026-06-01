// Permissões simples por role.
//
// Esta camada NÃO substitui um sistema de autorização real (o backend
// continua sendo a fonte da verdade). Aqui só centralizamos flags
// booleanas puras que já são derivadas no App.tsx via comparação direta
// de strings. Centralizar facilita testar, ler e evitar inconsistência
// quando uma nova feature consulta a mesma regra.
//
// IMPORTANTE: nesta fase NENHUMA destas funções é aplicada nos call
// sites existentes. Elas só espelham o padrão atual e ficam disponíveis
// para uso a partir das próximas fases.

// Codify só vê a Esfera Ontológica quando está no perfil "os1".
// Padrão atual no App.tsx: `(role === 'codify' && activeSector === 'os1')`.
export function canAccessOntology(role?: string, activeSector?: string): boolean {
  return role === 'codify' && activeSector === 'os1';
}

// Aba "Demos" do feed é compartilhada por codify, affiliate e team_member.
// Padrão atual no App.tsx: `(role === 'codify' || role === 'affiliate' || role === 'team_member')`.
export function showsRoleDemos(role?: string): boolean {
  return role === 'codify' || role === 'affiliate' || role === 'team_member';
}

// Franchisor/Partner não devem ver a lista de perfis demo na sidebar.
// Padrão atual no App.tsx: `hideDemoProfiles={role === 'franchisor' || role === 'partner'}`.
export function hidesDemoProfiles(role?: string): boolean {
  return role === 'franchisor' || role === 'partner';
}

// Perfil Central na linguagem visível = role 'franchisor' no backend.
export function isCentralRole(role?: string): boolean {
  return role === 'franchisor';
}

// Perfil Unidade na linguagem visível = role 'franchise' no backend.
export function isUnitRole(role?: string): boolean {
  return role === 'franchise';
}

// Codify é o perfil interno operacional (Codify Demo, Esfera, etc.).
export function isCodifyRole(role?: string): boolean {
  return role === 'codify';
}

// Afiliado representa tanto 'affiliate' quanto 'team_member' no backend.
export function isAffiliateRole(role?: string): boolean {
  return role === 'affiliate' || role === 'team_member';
}

// Parceiro comercial.
export function isPartnerRole(role?: string): boolean {
  return role === 'partner';
}
