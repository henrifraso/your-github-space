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

// LEGADO — substituído por canAccessCompanyVision (mais amplo).
// Mantido por compat, mas não deve ser usado em novos call sites.
// O label visível na UI é "Visão da empresa" — sem "ontologia".
export function canAccessOntology(role?: string, activeSector?: string): boolean {
  return role === 'codify' && activeSector === 'os1';
}

// Permite acessar Visão da Empresa / Unidade / Setor (esfera + análise).
// Liberado para os 6 perfis demo do fluxo interno. Vocabulário na UI
// usa "Visão" e "Análise" — nunca "ontologia".
export function canAccessCompanyVision(role?: string): boolean {
  return (
    role === 'codify' ||
    role === 'franchisor' ||
    role === 'franchise' ||
    role === 'affiliate' ||
    role === 'team_member' ||
    role === 'partner'
  );
}

// Rótulo do botão "Visão da X" (tooltip do botão Home) baseado em
// role + departamento ativo. Centraliza a regra de linguagem visível.
export function companyVisionLabel(
  role?: string,
  activeDepartment?: string,
): 'Visão da empresa' | 'Visão da unidade' | 'Visão do setor' {
  if (activeDepartment && activeDepartment !== 'geral') return 'Visão do setor';
  if (role === 'franchise') return 'Visão da unidade';
  return 'Visão da empresa';
}

// Rótulo do botão "Analisar X" (dentro da Esfera) baseado em role +
// departamento ativo. Mesma fonte de verdade do tooltip.
export function analyzeLabel(
  role?: string,
  activeDepartment?: string,
): 'Analisar empresa' | 'Analisar unidade' | 'Analisar setor' {
  if (activeDepartment && activeDepartment !== 'geral') return 'Analisar setor';
  if (role === 'franchise') return 'Analisar unidade';
  return 'Analisar empresa';
}

// Título do bloco gerado na Área de Trabalho quando a análise é
// despachada. Inclui o nome do setor entre colchetes quando aplicável.
export function analysisBlockTitle(
  role?: string,
  activeDepartment?: string,
  departmentLabel?: string,
): string {
  if (activeDepartment && activeDepartment !== 'geral') {
    return departmentLabel
      ? `Análise do setor: ${departmentLabel}`
      : 'Análise do setor';
  }
  if (role === 'franchise') return 'Análise da unidade';
  return 'Análise da empresa';
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
