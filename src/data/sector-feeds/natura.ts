import type { CompanySectorFeeds } from '../../types';

export const NATURA_SECTOR_FEEDS: CompanySectorFeeds = {
  marketing: [
    {
      sectionTitle: 'Consultoras & Canal Direto',
      cards: [
        {
          color: '#00a651',
          tag: 'CONSULTORAS',
          title: 'Rede de consultoras Natura: 1,8 mi ativas no Brasil — crescimento 4% YoY',
          detail: 'Base de consultoras CNs (Consultoras Natura) atingiu 1,8 mi no Brasil. Ticket médio por CN: R$ 2.840/trimestre. Receita por canal direto: R$ 8,2 bi/ano (64% da receita total). Programa de digitalização "CN Digital" tem 920 mil CNs com loja virtual própria.',
          badge: { label: '1,8mi consultoras', type: 'ok' },
        },
        {
          color: '#00a651',
          tag: 'RETENÇÃO',
          title: 'Retenção de consultoras: 72% após 12 meses — meta 78%',
          detail: 'Rotatividade de CNs ainda é o principal desafio do canal direto. Principais causas de saída: dificuldade de alcançar cota mínima (41%) e concorrência do catálogo Avon (34%). Programa "Espaço Natura" de suporte presencial foi expandido para 280 cidades.',
          badge: { label: 'Retenção 72%', type: 'warn' },
        },
        {
          color: '#00a651',
          tag: 'DIGITAL',
          title: 'App Natura: 14,2 mi de downloads — 38% dos pedidos já são via app das CNs',
          detail: 'Aplicativo Natura (consumidores finais) tem 14,2 mi de downloads. Pedidos realizados via app das consultoras cresceram para 38% do total. GMV digital: R$ 3,1 bi em 2025. Social selling via WhatsApp representa 62% dos pedidos digitais.',
          badge: { label: '38% pedidos app', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Ekos & Posicionamento Sustentável',
      cards: [
        {
          color: '#00a651',
          tag: 'EKOS',
          title: 'Linha Ekos: R$ 1,4 bi em receita — 18 ingredientes ativos da Amazônia',
          detail: 'Ekos é a linha premium da Natura com 18 ativos amazônicos (andiroba, murumuru, castanha, priprioca, entre outros). Receita: R$ 1,4 bi (11% da receita total). Crescimento: 22% YoY. Presente em 42 países. Linha mais exportada da Natura.',
          badge: { label: 'R$1,4bi receita', type: 'ok' },
        },
        {
          color: '#00a651',
          tag: 'CAMPANHA',
          title: '"Natura por Um Mundo Melhor": campanha de propósito com 180 mi de alcance',
          detail: 'Campanha institucional Q1/26 focada em biodiversidade e comunidades amazônicas atingiu 180 mi de impressões em mídia paga e orgânica. Sentimento positivo: 86%. Correlação com aumento de 3,1pp na intenção de compra medida em pesquisa Ipsos.',
          badge: { label: '180mi alcance', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Avon & Integração de Marcas',
      cards: [
        {
          color: '#00a651',
          tag: 'AVON',
          title: 'Avon Group: 4,6 mi de representantes ativos em 100+ países',
          detail: 'Após aquisição em 2020, Avon tem 4,6 mi de representantes globais. No Brasil, 1,1 mi de revendedoras Avon operam em paralelo às 1,8 mi de CNs Natura. Projeto de fusão de catálogos em mercados selecionados em teste na Colômbia.',
          badge: { label: '4,6mi representantes', type: 'info' },
        },
        {
          color: '#00a651',
          tag: 'INTEGRAÇÃO',
          title: 'Sinergias Avon-Natura: R$ 820 mi capturados de R$ 1,2 bi prometidos',
          detail: 'Programa de integração de back-office e supply chain capturou R$ 820 mi em sinergias acumuladas até dez/25. Meta original era R$ 1,2 bi até dez/26 — em risco por complexidade de sistemas legados Avon. Revisão do programa de integração em andamento.',
          badge: { label: 'R$820mi capturado', type: 'warn' },
        },
      ],
    },
  ],

  vendas: [
    {
      sectionTitle: 'Receita & Canais',
      cards: [
        {
          color: '#10b981',
          tag: 'RECEITA',
          title: 'Receita Natura Brasil Q1/26: R$ 3,2 bi — crescimento de 12% vs Q1/25',
          detail: 'Receita líquida do Q1/26 cresceu 12% impulsionada por aumento de preço médio (8%) e expansão de base de CNs (4%). Canal direto: R$ 2,1 bi. Varejo (Riachuelo, Americanas, Droga Raia): R$ 620 mi. E-commerce próprio: R$ 480 mi.',
          badge: { label: '+12% Q1/26', type: 'ok' },
        },
        {
          color: '#10b981',
          tag: 'CICLOS',
          title: '17 ciclos de vendas/ano — ciclo 5/26 cresceu 8,2% vs ciclo 5/25',
          detail: 'Natura opera com 17 ciclos de 21 dias. Ciclo 5 (abr/26) teve crescimento de 8,2% vs mesmo período de 2025. Categorias que puxaram crescimento: perfumaria (14,2%) e cuidados com o corpo (9,8%). Maquiagem perdeu 2,1% influenciada por entrada de concorrentes asiáticos.',
          badge: { label: 'Ciclo 5 +8,2%', type: 'ok' },
        },
        {
          color: '#10b981',
          tag: 'VAREJO',
          title: 'Expansão para 800 PDVs em farmácias — Drogaria São Paulo e Droga Raia',
          detail: 'Natura ingressou em farmácias com linha Ekos e Chronos em 2024. Em abr/26, opera em 800 PDVs de redes farmacêuticas. Ticket médio no canal farmácia: R$ 68 (vs R$ 142 no canal CN). Margem bruta no canal varejo: 38% (vs 52% no direto).',
          badge: { label: '800 PDVs farmácia', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Lançamentos & Pipeline',
      cards: [
        {
          color: '#10b981',
          tag: 'LANÇAMENTO',
          title: 'Ekos Castanha refis pack — lançamento mai/26 com meta de 480 mil unidades',
          detail: 'Embalagem de refil para a linha Ekos Castanha (hidratante corporal 400ml) tem meta de 480 mil unidades no primeiro ciclo. Preço refil: R$ 49,90 (vs embalagem primária R$ 69,90). Redução de plástico: 68% por unidade reabastecida.',
          badge: { label: 'meta 480k unidades', type: 'info' },
        },
        {
          color: '#10b981',
          tag: 'HOMENS',
          title: 'Natura Homem: categoria cresce 31% — nova linha de skincare masculino em beta',
          detail: 'Cuidados masculinos cresceram 31% em volume no Q1/26. Natura responde com nova linha de skincare masculino (hidratante FPS50, sérum antiidade, limpeza facial) a ser lançada no ciclo 9/26. Preço médio: R$ 89. Foco em CNs homens (82 mil ativos).',
          badge: { label: '+31% homens', type: 'ok' },
        },
      ],
    },
  ],

  financeiro: [
    {
      sectionTitle: 'Resultado Consolidado',
      cards: [
        {
          color: '#f59e0b',
          tag: 'EBITDA',
          title: 'EBITDA ajustado 2025: R$ 2,8 bi — margem de 11,2% (meta: 12%)',
          detail: 'Margem EBITDA de 11,2% ficou 0,8pp abaixo da meta. Pressão principal: custos de integração Avon (R$ 320 mi) e alta do dólar (+18% vs 2024) encarecendo matérias-primas importadas. Programa de eficiência "Fit to Win" deve recuperar 1,5pp de margem em 2026.',
          badge: { label: 'Margem 11,2%', type: 'warn' },
        },
        {
          color: '#f59e0b',
          tag: 'DÍVIDA',
          title: 'Dívida líquida: R$ 14,2 bi — alavancagem de 5,1x EBITDA pós-aquisição Avon',
          detail: 'Alavancagem elevada resultado da aquisição da Avon por US$ 2 bi (2020). Agenda de desalavancagem prevê reduzir para 3,5x até dez/27. Vencimentos relevantes: R$ 2,1 bi em 2026 e R$ 3,4 bi em 2027. Rating: Fitch BB+ / Moody\'s Ba1.',
          badge: { label: 'Alavancagem 5,1x', type: 'warn' },
        },
        {
          color: '#f59e0b',
          tag: 'CÂMBIO',
          title: 'Exposição cambial: 28% dos custos em USD — hedge cobre 60% até dez/26',
          detail: '28% dos custos de COGS são denominados em dólar (insumos, embalagens, royalties de tecnologia). Política de hedge cobre 60% da exposição até dez/26. A cada R$ 0,10 de apreciação do USD, impacto de R$ 18 mi no COGS trimestral.',
          badge: { label: 'Hedge 60%', type: 'info' },
        },
      ],
    },
    {
      sectionTitle: 'Royalties & Biodiversidade',
      cards: [
        {
          color: '#f59e0b',
          tag: 'NAGOYA',
          title: 'Royalties Nagoya: R$ 62 mi pagos a comunidades em 2025 — 18 contratos ativos',
          detail: 'Natura é signatária do Protocolo de Nagoya e pagou R$ 62 mi em royalties pelo uso de conhecimento tradicional associado à biodiversidade. 18 contratos ativos com comunidades indígenas e quilombolas. IBAMA e CGEN auditam contratos anualmente.',
          badge: { label: 'R$62mi royalties', type: 'ok' },
        },
        {
          color: '#f59e0b',
          tag: 'CGEN',
          title: 'Cadastro de acesso ao patrimônio genético: 42 ativos regularizados no SisGen',
          detail: 'Natura regularizou 42 ativos de biodiversidade no Sistema Nacional de Gestão do Patrimônio Genético (SisGen/MCTI). Multa por uso irregular pode chegar a R$ 10 mi por ativo. 6 ativos em processo de regularização com prazo até set/26.',
          badge: { label: '6 em regularização', type: 'warn' },
        },
      ],
    },
  ],

  rh: [
    {
      sectionTitle: 'Colaboradores & Diversidade',
      cards: [
        {
          color: '#8b5cf6',
          tag: 'HEADCOUNT',
          title: '34.200 colaboradores globais — 21.800 no Brasil (4.100 P&D e tecnologia)',
          detail: 'Natura &Co Group emprega 34.200 pessoas em 40 países. No Brasil: 21.800, distribuídos entre Cajamar/SP (sede e P&D, 8.200), unidades produtivas MG e GO (9.400) e comercial/suporte (4.200). Quadro cresceu 4,2% em 12 meses.',
          badge: { label: '21,8k no Brasil', type: 'info' },
        },
        {
          color: '#8b5cf6',
          tag: 'DIVERSIDADE',
          title: 'Mulheres: 68% do headcount — 48% em cargos de liderança sênior',
          detail: 'Natura tem 68% de mulheres no quadro global e 48% em posições de liderança sênior. Negros e pardos representam 54% no Brasil. Programa "Raízes" de liderança inclusiva formou 420 profissionais em 2025. Meta: 55% de líderes negros até 2027.',
          badge: { label: '54% negros/pardos', type: 'ok' },
        },
        {
          color: '#8b5cf6',
          tag: 'ENGAJAMENTO',
          title: 'eNPS: 74 — integração Avon causa ruído em times de back-office',
          detail: 'eNPS geral estável em 74. Queda de 9 pontos em times de TI e Finanças, afetados por migração de sistemas Avon. Times de P&D e Marketing mantêm eNPS acima de 80. Pesquisa de engajamento Q2/26 em campo.',
          badge: { label: 'eNPS 74', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Desenvolvimento & Cultura',
      cards: [
        {
          color: '#8b5cf6',
          tag: 'TREINAMENTO',
          title: '94h de treinamento/colaborador em 2025 — Natura Universidade com 1.200 cursos',
          detail: 'Média de 94 horas de treinamento por colaborador em 2025 (meta: 80h). Plataforma "Natura Universidade" oferece 1.200 cursos online. 34% dos líderes seniores passaram por rotação internacional. Custo de T&D: R$ 180 mi/ano.',
          badge: { label: '94h/colaborador', type: 'ok' },
        },
        {
          color: '#8b5cf6',
          tag: 'REMUNERAÇÃO',
          title: 'Participação nos resultados: R$ 240 mi distribuídos em 2025 — 14% acima de 2024',
          detail: 'Programa de PLR (Participação nos Lucros e Resultados) distribuiu R$ 240 mi em 2025. Média por colaborador: R$ 7.020 (14% acima de 2024). Fórmula vinculada a EBITDA, NPS de consultoras e metas ESG. Aprovação do programa: 91%.',
          badge: { label: 'PLR R$240mi', type: 'ok' },
        },
      ],
    },
  ],

  operacoes: [
    {
      sectionTitle: 'Manufatura & Produção',
      cards: [
        {
          color: '#06b6d4',
          tag: 'PRODUÇÃO',
          title: 'Complexo Cajamar: 220 mi de unidades/ano — capacidade utilizada: 78%',
          detail: 'Fábrica principal em Cajamar/SP produz 220 mi de unidades/ano com 78% de capacidade utilizada. 3 linhas de produção automatizadas para fragrâncias, 2 para hidratantes e 1 para maquiagem. Expansão de linha de fragrâncias com capex de R$ 94 mi em andamento.',
          badge: { label: '78% capacidade', type: 'ok' },
        },
        {
          color: '#06b6d4',
          tag: 'CARBONO',
          title: 'Emissões Escopo 1+2 neutras desde 2021 — Escopo 3 reduzido 18% em 2025',
          detail: 'Natura é carbono neutro em Escopo 1 e 2 desde 2021 (certificação GHG Protocol). Emissões de Escopo 3 (supply chain, consultoras, descarte) reduziram 18% em 2025 vs 2020. Metas 2030: -46% Escopo 1+2, -28% Escopo 3 (Science Based Targets).',
          badge: { label: 'Escopo 3 -18%', type: 'ok' },
        },
        {
          color: '#06b6d4',
          tag: 'ENERGIA',
          title: '96% de energia renovável nas operações BR — matriz solar em Cajamar opera desde jan/26',
          detail: 'Usina solar própria em Cajamar (8,4 MWp) entrou em operação em jan/26 e fornece 34% da energia da fábrica. Contratos de energia renovável (I-REC) cobrem os 62% restantes. Meta: 100% renovável em todas as operações globais até 2025 — atraso de 1 ano nas unidades Avon.',
          badge: { label: '96% renovável', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Logística & Distribuição',
      cards: [
        {
          color: '#06b6d4',
          tag: 'LOGÍSTICA',
          title: 'Centros de distribuição: 8 no Brasil — pedido entregue em 3,8 dias úteis (média)',
          detail: 'Rede logística com 8 CDs regionais (SP, RJ, MG, RS, PE, BA, GO, AM). Prazo médio de entrega de pedido de consultora: 3,8 dias úteis — meta de 3,5 dias. Principal gargalo: região Norte (Amazônia) com prazo médio de 6,2 dias.',
          badge: { label: '3,8 dias prazo médio', type: 'warn' },
        },
        {
          color: '#06b6d4',
          tag: 'REFIS',
          title: 'Programa de refis: 48 mi de embalagens reabastecidas em 2025 — redução de 1.800 t de plástico',
          detail: 'Programa de embalagens refil evitou 1.800 toneladas de plástico virgem em 2025. 48 mi de unidades refil vendidas. Taxa de adoção refil na linha Ekos: 31%. Meta 2030: refil disponível para 100% do portfólio líquido. Pontos de coleta de embalagens: 4.200 no Brasil.',
          badge: { label: '1.800t plástico evitado', type: 'ok' },
        },
      ],
    },
  ],

  estoque: [
    {
      sectionTitle: 'Inventário & Giro',
      cards: [
        {
          color: '#84cc16',
          tag: 'GIRO',
          title: 'Giro de estoque: 6,2x/ano — dias de cobertura médios: 58 dias',
          detail: 'Giro de estoque de 6,2x/ano (meta: 6,8x). Cobertura média de 58 dias, sendo 42 dias em produtos acabados e 16 dias em matérias-primas. Categorias com maior estoque: fragrâncias (82 dias) por sazonalidade do perfume no Natal.',
          badge: { label: '58 dias cobertura', type: 'warn' },
        },
        {
          color: '#84cc16',
          tag: 'OBSOLESCÊNCIA',
          title: 'Taxa de obsolescência: 1,4% do inventário — R$ 48 mi em write-off em 2025',
          detail: 'Obsolescência de produtos (ciclo de vida curto de maquiagem, sazonalidade de perfumes) gerou write-off de R$ 48 mi em 2025. Principal causa: mudanças de embalagem Ekos sem escoamento do estoque anterior. Política de promoção para estoque aging implementada em jan/26.',
          badge: { label: 'Write-off R$48mi', type: 'warn' },
        },
        {
          color: '#84cc16',
          tag: 'PREVISÃO',
          title: 'Acurácia de previsão de demanda: 81% — abaixo da meta de 86%',
          detail: 'Acurácia do forecast em 81% — 5pp abaixo da meta. Maior erro em lançamentos (acurácia de 64%) e produtos descontinuados. Natura implementou modelo S&OP (Sales & Operations Planning) mensal em 2025 com previsão de ganhar 3pp de acurácia em 12 meses.',
          badge: { label: 'Acurácia 81%', type: 'warn' },
        },
      ],
    },
    {
      sectionTitle: 'Insumos & Cadeia Amazônica',
      cards: [
        {
          color: '#84cc16',
          tag: 'BIOATIVOS',
          title: '38 comunidades fornecedoras de bioativos — volume comprado: R$ 94 mi em 2025',
          detail: 'Natura compra bioativos de 38 comunidades extrativistas na Amazônia, Cerrado e Mata Atlântica. Volume total: R$ 94 mi em 2025 (+18% YoY). Ingrediente com maior volume: castanha (R$ 22 mi) e andiroba (R$ 14 mi). Certificação de cadeia justa: 28 dos 38 fornecedores.',
          badge: { label: 'R$94mi bioativos', type: 'ok' },
        },
        {
          color: '#84cc16',
          tag: 'RISCO',
          title: 'Seca amazônica 2025 afetou colheita de andiroba — preço subiu 34%',
          detail: 'A seca histórica de 2025 na Amazônia reduziu em 22% a produção de andiroba (ativo-chave da linha Ekos Olha o Mundo). Preço do barril de óleo de andiroba subiu 34%. Natura ativou estoque estratégico e está mapeando novas comunidades fornecedoras no Pará.',
          badge: { label: 'Preço +34%', type: 'warn' },
        },
      ],
    },
  ],

  juridico: [
    {
      sectionTitle: 'ANVISA & Regulação de Cosméticos',
      cards: [
        {
          color: '#f97316',
          tag: 'ANVISA',
          title: 'RDC 752/2023 ANVISA: 28 produtos reformulados para adequação — prazo abr/26',
          detail: 'Resolução ANVISA 752/23 restringiu 14 substâncias em cosméticos (conservantes, filtros UV). Natura reformulou 28 SKUs. Custos de reformulação: R$ 18 mi. 4 produtos tiveram vendas suspensas temporariamente durante adequação — prejuízo de R$ 6,2 mi.',
          badge: { label: '28 produtos reformulados', type: 'ok' },
        },
        {
          color: '#f97316',
          tag: 'CLAIMS',
          title: 'CONAR: 3 notificações por claims de sustentabilidade em 2025 — "greenwashing"',
          detail: 'CONAR notificou Natura por 3 peças publicitárias com claims de sustentabilidade considerados insuficientemente comprovados. Casos encerrados com adequação dos anúncios. Natura implantou protocolo de validação jurídica prévia para todos os claims ESG em comunicação.',
          badge: { label: '3 notificações CONAR', type: 'warn' },
        },
        {
          color: '#f97316',
          tag: 'CERTIFICAÇÃO',
          title: 'Recertificação B Corp 2025: pontuação 121,4 — 4ª vez consecutiva certificada',
          detail: 'Natura obteve pontuação de 121,4 na recertificação B Corp (mínimo: 80). Destaques: governança (32,1), meio ambiente (28,4) e trabalhadores (22,8). Certificação é pilar do posicionamento de marca premium e acesso a mercados europeus exigentes.',
          badge: { label: 'B Corp 121,4pts', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Litígios & Compliance',
      cards: [
        {
          color: '#f97316',
          tag: 'TRIBUTÁRIO',
          title: 'Créditos de ICMS contestados: R$ 380 mi — processo no CARF há 4 anos',
          detail: 'Natura tem R$ 380 mi em créditos de ICMS sobre insumos contestados pela Receita Federal no CARF (Conselho Administrativo de Recursos Fiscais). Tese da Receita: insumos de bioativos não seriam créditos de ICMS-ST. Decisão de primeira instância favorável à Natura em mar/26.',
          badge: { label: 'R$380mi em disputa', type: 'warn' },
        },
        {
          color: '#f97316',
          tag: 'LGPD',
          title: 'Programa de adequação LGPD: 94% de conformidade auditada — DPO externo designado',
          detail: 'Auditoria interna de LGPD (Deloitte, dez/25) apontou 94% de conformidade. Pontos de atenção: dados biométricos de colaboradores em fábricas (câmeras de reconhecimento facial para acesso) e compartilhamento de dados de consultoras com parceiros de crédito. Plano de remediação com prazo set/26.',
          badge: { label: '94% conformidade', type: 'ok' },
        },
      ],
    },
  ],
};
