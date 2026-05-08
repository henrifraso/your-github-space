import type { CompanySectorFeeds } from '../../types';

export const NETFLIX_SECTOR_FEEDS: CompanySectorFeeds = {
  marketing: [
    {
      sectionTitle: "O que mudou em Marketing",
      cards: [
        {
          color: "#e50914",
          tag: "Assinantes",
          title: "Assinantes globais Q1/26: 301 mi — +4,4% a/a",
          detail: "Netflix atingiu 301 mi de assinantes pagos. Crescimento liderado por LATAM (+6,8%) e APAC (+9,1%). EUA/Canada estabilizados com churn baixo (1,8%/mês). Compartilhamento de senha praticamente eliminado após rollout global.",
          badge: { label: "+4,4%", type: "ok" },
        },
        {
          color: "#e50914",
          tag: "Plano com Anúncios",
          title: "Ad-Supported Plan: 94 mi de usuários ativos — crescimento de 34%",
          detail: "Plano com anúncios a US$6,99/mês representa 31% da base global. CPM médio: US$42 nos EUA (premium vs. TV linear). Receita de publicidade projetada para 2026: US$3,8 bi. Parceria exclusiva com The Trade Desk para programática.",
          badge: { label: "CRESCENDO", type: "ok" },
        },
        {
          color: "#e50914",
          tag: "Live Events",
          title: "Estratégia live events: WWE, NFL e Beyoncé — 68 mi de streaks",
          detail: "NFL Christmas Day 2025 atingiu 68 mi de streams simultâneos — recorde Netflix. WWE Raw no ar desde jan/26 com 6,2 mi de espectadores por episódio. Beyoncé Halftime Show: 31 mi de streams ao vivo.",
          badge: { label: "RECORDE", type: "ok" },
        },
      ],
    },
    {
      sectionTitle: "Conteúdo & Algoritmo",
      cards: [
        {
          color: "#e50914",
          tag: "Top 10",
          title: "Squid Game S3 — 142 mi de streams na semana de estreia",
          detail: "Maior estreia não-inglesa da plataforma. 34 idiomas dublados, 12 idiomas legendados. Taxa de conclusão de episódios: 81% — acima da média de 64%. Renovado antes mesmo de S2 estrear.",
          badge: { label: "RECORDE", type: "ok" },
        },
        {
          color: "#e50914",
          tag: "Algoritmo",
          title: "Novo algoritmo de recomendação — redução de 11% no churn",
          detail: "Modelo neural 'Minerva v4' com 1.200 features por usuário. Personalização de thumbnails em tempo real para 14 variantes por título. Taxa de satisfação com recomendações: 78% (vs. 71% em 2024).",
          badge: { label: "ATIVO", type: "info" },
        },
        {
          color: "#e50914",
          tag: "Games",
          title: "Netflix Games: 98 títulos ativos — 4,2 mi de jogadores diários",
          detail: "Grand Theft Auto: The Trilogy exclusivo por 6 meses impulsionou 3x o DAU de games. Investimento em estúdio próprio: US$900 mi acumulado. Receita de games ainda insignificante no P&L mas estratégica para retenção.",
        },
      ],
    },
    {
      sectionTitle: "Expansão & Localização",
      cards: [
        {
          color: "#e50914",
          tag: "Brasil",
          title: "Brasil: 22 mi de assinantes — maior mercado LATAM",
          detail: "Conteúdo local representa 38% do consumo dos usuários brasileiros. Produções originais no Brasil: Sintonia S5, Travessia S2, Senna doc com 48 mi de streams. Investimento local 2026: R$2,2 bi aprovado.",
          badge: { label: "PRINCIPAL LATAM", type: "ok" },
        },
        {
          color: "#e50914",
          tag: "India",
          title: "India: 12,8 mi de assinantes — plano mobile a INR 149/mês",
          detail: "Plano mobile-only (1 tela, HD) estratégico para mercado com ARPU baixo. Conteúdo hindi e regional aumentou consumo 44%. Parceria com Jio para bundle em 180 mi de usuários. Mercado projetado para 20 mi até 2027.",
          badge: { label: "EM EXPANSÃO", type: "info" },
        },
      ],
    },
  ],

  vendas: [
    {
      sectionTitle: "O que mudou em Receita",
      cards: [
        {
          color: "#10b981",
          tag: "Receita",
          title: "Receita Q1/26: US$10,5 bi — +12,5% a/a",
          detail: "Crescimento por combinação de reajuste de preços, expansão da base e publicidade. ARPU global: US$17,84 (vs. US$16,22 Q1/25). ARPU EUA: US$22,14. EPS: US$5,92 — acima da estimativa de US$5,68.",
          badge: { label: "+12,5%", type: "ok" },
        },
        {
          color: "#10b981",
          tag: "Publicidade",
          title: "Receita de ads Q1/26: US$780 mi — 7,4% da receita total",
          detail: "Crescimento de 68% a/a. Projeção de US$3,8 bi para 2026 inteiro. Netflix Ads Suite lançada para anunciantes self-serve em jan/26. Inventário ainda com escassez: fill rate de 72% nos EUA.",
          badge: { label: "CRESCENDO", type: "ok" },
        },
        {
          color: "#10b981",
          tag: "Preços",
          title: "Reajuste de preços nos EUA: Standard de US$15,49 → US$17,99",
          detail: "Reajuste aplicado em fev/26 para novos clientes, migração de base existente em 90 dias. Churn pós-reajuste: 0,4 pts acima do normal por 30 dias, normalizado em seguida. Histórico: reajustes não geram churn persistente.",
          badge: { label: "APLICADO", type: "info" },
        },
      ],
    },
    {
      sectionTitle: "Licenciamento & Parcerias",
      cards: [
        {
          color: "#10b981",
          tag: "Licenciamento",
          title: "Licenciamento de conteúdo para terceiros — US$420 mi em 2025",
          detail: "Séries Netflix licenciadas para Globoplay (Brasil), Canal+ (França) e Sky (UK). Estratégia: monetizar catálogo antigo sem canibalizar base própria. Acordo com Globoplay inclui 40 títulos por 36 meses.",
          badge: { label: "INFO", type: "info" },
        },
        {
          color: "#10b981",
          tag: "Bundling",
          title: "Bundle Apple One inclui Netflix — 18 mi de novos usuários em 12 meses",
          detail: "Acordo com Apple distribui Netflix via Apple One Premier (US$37,95/mês). Netflix recebe US$8 por assinante/mês. Perfil de usuário Apple: churn 40% menor que média. Renovação do contrato em negociação.",
          badge: { label: "ATIVO", type: "ok" },
        },
      ],
    },
  ],

  financeiro: [
    {
      sectionTitle: "O que mudou em Financeiro",
      cards: [
        {
          color: "#f59e0b",
          tag: "Margem Operacional",
          title: "Margem operacional Q1/26: 28,1% — meta anual de 29%",
          detail: "Melhora contínua: 19% (2023) → 24% (2024) → 28% (Q1/26). Alavancagem operacional com crescimento de receita diluindo custo fixo de conteúdo. Guidance 2026: 29% de margem operacional.",
          badge: { label: "OK", type: "ok" },
        },
        {
          color: "#f59e0b",
          tag: "Conteúdo",
          title: "Budget de conteúdo 2026: US$18 bi — alocação por tipo",
          detail: "Original series: US$9,2 bi | Filmes originais: US$2,8 bi | Licenciamento: US$3,6 bi | Live events/sports: US$1,4 bi | Games: US$1 bi. Amortização contábil em 4 anos para séries, 2 anos para filmes.",
          badge: { label: "US$18 BI", type: "info" },
        },
        {
          color: "#f59e0b",
          tag: "Free Cash Flow",
          title: "FCF Q1/26: US$2,1 bi — US$8 bi projetado para o ano",
          detail: "Primeira vez que Netflix entra em ciclo de geração consistente de FCF. Uso: recompra de ações (US$6 bi aprovado para 2026) e dívida. Dívida líquida: US$8,6 bi com prazo médio de 12 anos.",
          badge: { label: "+68% a/a", type: "ok" },
        },
      ],
    },
    {
      sectionTitle: "Custo de Conteúdo & Câmbio",
      cards: [
        {
          color: "#f59e0b",
          tag: "Amortização",
          title: "Amortização de conteúdo Q1/26: US$3,9 bi — 37% da receita",
          detail: "Redução progressiva como % da receita desde 2022 (45%). Conteúdo produzido localmente tem custo 60% menor que produção nos EUA. Estratégia de local content em 50 países reduz custo médio por hora de conteúdo.",
        },
        {
          color: "#f59e0b",
          tag: "Câmbio",
          title: "Exposição cambial: 40% da receita em moedas não-USD",
          detail: "Real, Euro, Won coreano e Libra são as maiores exposições. Queda do Real em 8% em Q1/26 reduziu ARPU Brasil de US$8,20 para US$7,54. Hedge natural parcial via produção local que gera custos em reais.",
          badge: { label: "ATENÇÃO", type: "warn" },
        },
      ],
    },
  ],

  rh: [
    {
      sectionTitle: "O que mudou em RH",
      cards: [
        {
          color: "#8b5cf6",
          tag: "Headcount",
          title: "Headcount global: 14.200 colaboradores — crescimento controlado",
          detail: "Netflix opera com quadro enxuto vs. receita de US$40 bi/ano (~US$2,8 mi/colaborador). Política de 'keeper test': gestores revisam anualmente se manteriam cada colaborador. Turnover voluntário: 8% (baixo para setor de tech).",
          badge: { label: "OK", type: "ok" },
        },
        {
          color: "#8b5cf6",
          tag: "Remuneração",
          title: "Remuneração: 100% em cash — sem RSU para maioria dos colaboradores",
          detail: "Filosofia Netflix: pagar top of market em cash e deixar colaborador investir onde quiser. Salário médio de engenheiro sênior: US$380.000/ano. Banda salarial transparente internamente. Exceção: RSU para liderança executiva.",
          badge: { label: "TOP OF MARKET", type: "info" },
        },
        {
          color: "#8b5cf6",
          tag: "Férias",
          title: "Política de férias ilimitadas — 100% dos cargos elegíveis",
          detail: "Netflix não rastreia dias de férias tirados. Média real observada: 22 dias/ano (acima da média americana de 14). Política de licença parental: 52 semanas com salário integral para pais e mães.",
        },
      ],
    },
    {
      sectionTitle: "Talent & Cultura",
      cards: [
        {
          color: "#8b5cf6",
          tag: "Talentos Criativos",
          title: "Contratação de showrunners: 12 acordos de exclusividade ativos em 2026",
          detail: "Acordos com Shonda Rhimes (renovado, US$150 mi), Ryan Murphy, David Fincher e outros. Netflix paga premium por exclusividade criativa. Modelo: parceria plurianual vs. por projeto.",
          badge: { label: "EXCLUSIVOS", type: "info" },
        },
        {
          color: "#8b5cf6",
          tag: "Diversidade",
          title: "Meta de representação: 50% de conteúdo local produzido por talentos locais",
          detail: "Em 2026: 78% dos diretores de originais locais são do mesmo país do conteúdo. Brasil: 100%. Korea: 95%. Índia: 88%. Programa de desenvolvimento de roteiristas em 12 países.",
          badge: { label: "META SUPERADA", type: "ok" },
        },
      ],
    },
  ],

  operacoes: [
    {
      sectionTitle: "O que mudou em Operações",
      cards: [
        {
          color: "#06b6d4",
          tag: "Infraestrutura",
          title: "Open Connect CDN: 17.000 servidores em 1.000 locais em 175 países",
          detail: "CDN própria entrega 95% do tráfego. Acordo com ISPs para instalação de servidores dentro dos provedores reduz latência e custo de bandwidth. Custo de streaming por hora: US$0,004 — redução de 30% vs. 2022.",
          badge: { label: "OK", type: "ok" },
        },
        {
          color: "#06b6d4",
          tag: "Produção",
          title: "Netflix Studios: 5 estúdios próprios — Los Angeles, Madrid, Roma, Mumbai e Rio",
          detail: "Estúdio do Rio (Jacarepaguá) inaugurado em out/25 com 8 sets. Capacidade: 12 produções simultâneas. Reduziu custo de produção no Brasil em 28%. Estúdio de Madrid em expansão para 2027.",
          badge: { label: "EXPANDINDO", type: "info" },
        },
        {
          color: "#06b6d4",
          tag: "AI em Produção",
          title: "AI em VFX: 40% das produções usam ferramentas proprietárias de IA",
          detail: "Netflix AI Studio usa modelos próprios para VFX, dublagem automática e geração de thumbnails. Dublagem por IA com voice cloning reduziu custo de localização em 55% em títulos de baixo volume. Atores precisam autorizar uso por contrato.",
          badge: { label: "NOVO", type: "info" },
        },
      ],
    },
    {
      sectionTitle: "Qualidade & Entrega",
      cards: [
        {
          color: "#06b6d4",
          tag: "Uptime",
          title: "Uptime de plataforma: 99,97% em Q1/26 — SLA mantido",
          detail: "Downtime planejado: zero. Incidente de 18 min em jan/26 durante NFL por pico de 85 mi de streams simultâneos. Capacidade de CDN expandida 40% para suportar live events. Próximo evento crítico: Copa 2026.",
          badge: { label: "OK", type: "ok" },
        },
        {
          color: "#06b6d4",
          tag: "Qualidade",
          title: "AV1 codec em 100% do catálogo — redução de 35% no bandwidth",
          detail: "Migração para codec AV1 concluída em dez/25. Mesma qualidade visual com 35% menos dados transferidos. Economia anual estimada em custos de CDN: US$280 mi. Benefício também para usuários em planos de dados móveis.",
          badge: { label: "CONCLUÍDO", type: "ok" },
        },
      ],
    },
  ],

  estoque: [
    {
      sectionTitle: "Catálogo & Licenças",
      cards: [
        {
          color: "#84cc16",
          tag: "Catálogo",
          title: "Catálogo global: 18.400 títulos — originais representam 42%",
          detail: "Séries originais: 3.200 | Filmes originais: 2.100 | Conteúdo licenciado: 13.100. Catálogo de originais cresceu 18% a/a. Conteúdo licenciado reduzido estrategicamente para priorizar investimento em original.",
          badge: { label: "INFO", type: "info" },
        },
        {
          color: "#84cc16",
          tag: "Licenças Vencendo",
          title: "48 títulos com licença vencendo em Q2/26 — renovação em análise",
          detail: "Principais: The Office S1-9 (Peacock reivindica exclusividade), Breaking Bad e Parks & Recreation. Decisão: renovar apenas títulos com consumo >500K streams/mês. Estimativa de custo de renovação: US$320 mi.",
          badge: { label: "ATENÇÃO", type: "warn" },
        },
        {
          color: "#84cc16",
          tag: "Conteúdo em Produção",
          title: "Pipeline de produção: 220 títulos em diferentes fases",
          detail: "Desenvolvimento: 80 | Pré-produção: 62 | Produção: 54 | Pós-produção: 24. Tempo médio do greenlight à estreia: 22 meses para séries, 14 meses para filmes. Cancelamento de séries S1: taxa de 31% (custo de desenvolvimento perdido).",
          badge: { label: "INFO", type: "info" },
        },
      ],
    },
    {
      sectionTitle: "Ativos Técnicos",
      cards: [
        {
          color: "#84cc16",
          tag: "Masters de Conteúdo",
          title: "Arquivo de masters: 600 PB de conteúdo em datacenters AWS",
          detail: "Netflix migrou 100% do storage para AWS S3 Glacier para catálogo inativo. Custo de armazenamento: US$0,004/GB/mês. Redundância em 3 regiões AWS. Catálogo ativo em hot storage para entrega CDN imediata.",
          badge: { label: "SEGURO", type: "ok" },
        },
        {
          color: "#84cc16",
          tag: "Equipamento Produção",
          title: "Inventário de câmeras e equipamentos de produção: 4.200 itens",
          detail: "Distribuídos entre os 5 estúdios próprios. Depreciação anual: US$48 mi. Câmeras principais: ARRI ALEXA 35 (480 unidades) e Sony VENICE 2 (220 unidades). Taxa de utilização média: 71%.",
        },
      ],
    },
  ],

  juridico: [
    {
      sectionTitle: "O que mudou em Jurídico",
      cards: [
        {
          color: "#f97316",
          tag: "ANCINE / Brasil",
          title: "ANCINE: obrigatoriedade de 10% de conteúdo nacional em catálogo BR",
          detail: "Regulação de mar/26 exige que plataformas com mais de 2 mi de assinantes no Brasil exibam mínimo de 10% de conteúdo nacional. Netflix (22 mi assinantes) já atinge 14%. Relatório semestral obrigatório à ANCINE a partir de jul/26.",
          badge: { label: "CONFORMIDADE OK", type: "ok" },
        },
        {
          color: "#f97316",
          tag: "GDPR",
          title: "DPC Irlanda: multa de €12 mi por uso de dados para treinar algoritmo de ads",
          detail: "Data Protection Commission europeia aplicou multa em fev/26 por uso de dados de visualização sem consentimento explícito para segmentação de anúncios. Netflix apelou e implementou opt-in explícito. Decisão final: Q4/26.",
          badge: { label: "MULTA APLICADA", type: "warn" },
        },
        {
          color: "#f97316",
          tag: "Guilds & SAG",
          title: "Acordo SAG-AFTRA com cláusula de IA — vigente até dez/27",
          detail: "Contrato renovado em jan/26 inclui: remuneração por uso de likeness/voice cloning em IA, fundo de transição de US$200 mi para atores afetados por automação e aprovação prévia obrigatória por contrato individual.",
          badge: { label: "ASSINADO", type: "ok" },
        },
      ],
    },
    {
      sectionTitle: "Compliance & Conteúdo",
      cards: [
        {
          color: "#f97316",
          tag: "Censura",
          title: "Conteúdo removido por exigência regulatória: 142 títulos em 2025",
          detail: "Principais mercados: Turquia (47 títulos), Índia (38), Rússia (bloqueado total), Arabia Saudita (22). Estratégia: produzir versões alternativas de episódios para mercados com restrições. Custo de compliance de conteúdo: US$28 mi/ano.",
          badge: { label: "MONITORAR", type: "warn" },
        },
        {
          color: "#f97316",
          tag: "Anti-Pirataria",
          title: "Bloqueio de 14.000 URLs piratas em 2025 — parceria com ACE",
          detail: "Alliance for Creativity and Entertainment lidera ações coordenadas. Netflix contribui US$18 mi/ano para ACE. Brasil é 3° maior mercado de pirataria de conteúdo Netflix. Operação de takedown com Anatel: 1.200 domínios bloqueados.",
          badge: { label: "ATIVO", type: "info" },
        },
      ],
    },
  ],
};
