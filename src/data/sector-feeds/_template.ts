// Template de referência para feeds de setor por empresa
// Copie este arquivo e preencha com dados da empresa específica
// Cada seção (SectorSection) tem: sectionTitle + cards[]
// Cada card (SectorCard) tem: color, tag, title, detail, badge? (ok | warn | info)

import type { CompanySectorFeeds } from '../../types';

export const TEMPLATE_FEEDS: CompanySectorFeeds = {
  marketing: [
    {
      sectionTitle: "O que mudou em Marketing",
      cards: [
        { color: "#ec4899", tag: "Campanha", title: "Título da campanha", detail: "Detalhe explicando a campanha e próximos passos.", badge: { label: "ATIVA", type: "ok" } },
      ]
    },
    {
      sectionTitle: "Marca & Reputação",
      cards: [
        { color: "#ec4899", tag: "Avaliações", title: "Nota X.X · Y avaliações esta semana", detail: "Principais elogios e pontos de melhoria identificados." },
      ]
    },
    {
      sectionTitle: "Oportunidades",
      cards: [
        { color: "#ec4899", tag: "Ação Sugerida", title: "Título da oportunidade", detail: "Contexto e ação recomendada." },
      ]
    },
  ],
  vendas: [
    {
      sectionTitle: "O que mudou em Vendas",
      cards: [
        { color: "#10b981", tag: "Resultado", title: "Título do resultado", detail: "Detalhe do resultado de vendas.", badge: { label: "+X%", type: "ok" } },
      ]
    },
  ],
  financeiro: [
    {
      sectionTitle: "O que mudou em Financeiro",
      cards: [
        { color: "#f59e0b", tag: "Obrigação", title: "Título da obrigação fiscal", detail: "Detalhe e prazo.", badge: { label: "PENDENTE", type: "warn" } },
      ]
    },
  ],
  rh: [
    {
      sectionTitle: "O que mudou em RH",
      cards: [
        { color: "#8b5cf6", tag: "Equipe", title: "Título do evento de RH", detail: "Detalhe sobre a equipe." },
      ]
    },
  ],
  operacoes: [
    {
      sectionTitle: "O que mudou em Operações",
      cards: [
        { color: "#06b6d4", tag: "Processo", title: "Título do evento operacional", detail: "Detalhe e ação necessária." },
      ]
    },
  ],
  estoque: [
    {
      sectionTitle: "O que mudou em Estoque",
      cards: [
        { color: "#84cc16", tag: "Nível", title: "Produto X: estoque para Y dias", detail: "Ação recomendada." },
      ]
    },
  ],
  juridico: [
    {
      sectionTitle: "O que mudou em Jurídico",
      cards: [
        { color: "#f97316", tag: "Compliance", title: "Título do item jurídico", detail: "Status e prazo.", badge: { label: "OK", type: "ok" } },
      ]
    },
  ],
};
