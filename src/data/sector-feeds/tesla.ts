import type { CompanySectorFeeds } from '../../types';

export const TESLA_SECTOR_FEEDS: CompanySectorFeeds = {
  marketing: [
    {
      sectionTitle: "O que mudou em Marketing",
      cards: [
        {
          color: "#cc0000",
          tag: "Deliveries Q1/26",
          title: "Entregas Q1/26: 336.681 veículos — queda de 8,5% a/a",
          detail: "Pior Q1 desde 2022. Model Y restylado (Juniper) sofreu com transição de linha em Fremont e Shanghai. Model 3 manteve demanda estável. Musk admitiu em earnings call que rebrand pós-político afetou percepção de marca.",
          badge: { label: "QUEDA", type: "warn" },
        },
        {
          color: "#cc0000",
          tag: "Marca",
          title: "Brand sentiment nos EUA: índice YouGov caiu 14 pts em 12 meses",
          detail: "Posicionamento político de Elon Musk associado a DOGE gerou boicotes em mercados europeus. Alemanha: queda de 18% no volume de emplacamentos Tesla em fev/26. Noruega: -11%.",
          badge: { label: "RISCO", type: "warn" },
        },
        {
          color: "#cc0000",
          tag: "Publicidade",
          title: "Primeira campanha paga de TV no ar — 'Drive the Future'",
          detail: "Tesla estreou publicidade tradicional em mar/26 pela primeira vez em 21 anos de história. Agência: TBWA\\Chiat\\Day. Mídia: NBC, ESPN e YouTube. Orçamento estimado: US$50 mi. Recall de marca +6 pts em 30 dias.",
          badge: { label: "NOVO", type: "info" },
        },
      ],
    },
    {
      sectionTitle: "Produto & Lançamentos",
      cards: [
        {
          color: "#cc0000",
          tag: "Cybercab",
          title: "Cybercab — produção em lote piloto a partir de jun/26 em Austin",
          detail: "Robotaxi sem volante e sem pedais. Capacidade inicial: 2.500 unidades/mês. Preço alvo: US$30.000. FSD v14 obrigatório. Austin e San Francisco serão os primeiros mercados para frota própria.",
          badge: { label: "EM PRODUÇÃO", type: "info" },
        },
        {
          color: "#cc0000",
          tag: "Model Y Juniper",
          title: "Model Y Juniper: 148.000 unidades entregues no Q1/26",
          detail: "Restylado com interior redesenhado, faróis sequenciais e nova central de 15,4''. Wait time em Shanghai: 4 semanas. Margem bruta do veículo: 16,3% — abaixo da meta de 18%.",
        },
        {
          color: "#cc0000",
          tag: "Optimus",
          title: "Optimus Gen 3 — 1.000 unidades operando nas Gigafactories",
          detail: "Robô humanoide realizando tarefas de montagem de baterias em Fremont. Custo de produção atual: US$22.000/unidade. Musk projeta custo de US$10.000 em escala. Receita via aluguel para terceiros prevista para Q4/26.",
          badge: { label: "INFO", type: "info" },
        },
      ],
    },
    {
      sectionTitle: "Supercharger & Energia",
      cards: [
        {
          color: "#cc0000",
          tag: "Supercharger",
          title: "Rede Supercharger: 65.000 pontos em 140 países — +12% a/a",
          detail: "Uptime global: 99,1%. Receita de carregamento Q1/26: US$820 mi (+34% a/a). Ford, GM, Rivian e BMW já adotaram conector NACS. Expansão de 8.000 novos stalls prevista para 2026.",
          badge: { label: "OK", type: "ok" },
        },
        {
          color: "#cc0000",
          tag: "Megapack",
          title: "Megapack: 10,4 GWh implantados no Q1/26 — recorde histórico",
          detail: "Contratos firmados com PG&E (2 GWh), AGL Australians (1,5 GWh) e Enel Chile (1,2 GWh). Backlog de pedidos: 28 GWh. Fábrica de Lathrop (CA) ampliada para 40 GWh/ano.",
          badge: { label: "RECORDE", type: "ok" },
        },
      ],
    },
  ],

  vendas: [
    {
      sectionTitle: "O que mudou em Vendas",
      cards: [
        {
          color: "#10b981",
          tag: "Receita",
          title: "Receita total Q1/26: US$19,3 bi — -9% a/a",
          detail: "Queda puxada por descontos agressivos no Model Y e Model 3 para manter volume. Receita de serviços e energia cresceu 32% e compensou parcialmente. Margem bruta total: 13,9%.",
          badge: { label: "QUEDA", type: "warn" },
        },
        {
          color: "#10b981",
          tag: "FSD",
          title: "FSD: 700.000 assinantes ativos — receita recorrente US$250 mi/trim",
          detail: "Full Self-Driving a US$99/mês ou US$8.000 à vista. Attach rate em novos veículos: 14% (meta: 25%). Versão FSD v13.2 com zero intervenções em 98% das viagens em área urbana nos EUA.",
          badge: { label: "+18% a/a", type: "ok" },
        },
        {
          color: "#10b981",
          tag: "China",
          title: "China: 135.000 unidades vendidas no Q1/26 — share de 18,4%",
          detail: "BYD lidera com 32% de share. Pressão de preço intensa: Model Y vendido a CNY 249.900 após 3 reduções desde jan/25. Fila de espera Shanghai: 3 semanas para Juniper. Subsídio do governo chinês venceu em dez/25.",
          badge: { label: "PRESSÃO", type: "warn" },
        },
      ],
    },
    {
      sectionTitle: "Canais & Precificação",
      cards: [
        {
          color: "#10b981",
          tag: "Desconto",
          title: "Desconto médio por veículo nos EUA: US$3.200 em Q1/26",
          detail: "Incentivos em cash back, taxa zero de financiamento e crédito de carregamento. Custo total de incentivos no trimestre: US$390 mi. Necessário para competir com crédito fiscal IRA de concorrentes.",
          badge: { label: "ATENÇÃO", type: "warn" },
        },
        {
          color: "#10b981",
          tag: "Energia",
          title: "Segmento Energy (Megapack + Powerwall): US$2,7 bi em Q1/26",
          detail: "Margem bruta de Energy: 24,6% — superior à de veículos. Powerwall 3 com 3,8 mi de unidades instaladas globalmente. Demanda residencial crescendo 44% a/a nos EUA.",
          badge: { label: "+44%", type: "ok" },
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
          tag: "Margem Bruta",
          title: "Margem bruta Q1/26: 13,9% — abaixo da meta de 17%",
          detail: "Queda de 4,5 pts a/a por descontos em veículos, ramp-up do Cybertruck e custos de transição de linha do Juniper. Última vez com margem acima de 20% foi Q2/23. Guidance: recuperação em H2/26.",
          badge: { label: "ABAIXO", type: "warn" },
        },
        {
          color: "#f59e0b",
          tag: "Capex",
          title: "Capex Q1/26: US$2,4 bi — Gigafactory Mexico ainda em pausa",
          detail: "Gigafactory de Monterrey suspensa por incerteza regulatória e tarifas. Investimento concentrado em Austin (Cybercab), Lathrop (Megapack) e Shangai (expansão +20% de capacidade). Total Capex 2026 guidance: US$10 bi.",
          badge: { label: "PAUSA", type: "warn" },
        },
        {
          color: "#f59e0b",
          tag: "Caixa",
          title: "Caixa & equivalentes: US$36,6 bi — posição sólida",
          detail: "Free cash flow Q1/26: US$664 mi (vs. US$2,5 bi Q1/25). Queda por Capex elevado e menor margem. Sem dívida de longo prazo significativa. Recompra de ações: US$1 bi aprovado para 2026.",
          badge: { label: "SÓLIDO", type: "ok" },
        },
      ],
    },
    {
      sectionTitle: "Tarifas & Câmbio",
      cards: [
        {
          color: "#f59e0b",
          tag: "Tarifas",
          title: "Tarifas EUA-China: impacto de US$1,2 bi/ano sobre componentes",
          detail: "Tarifa de 145% sobre peças importadas da China afeta células LFP (Shanghai → Fremont). Tesla negociando isenção para componentes sem substituto doméstico. Resultado esperado: Q3/26.",
          badge: { label: "RISCO", type: "warn" },
        },
        {
          color: "#f59e0b",
          tag: "Câmbio",
          title: "Exposição cambial: 35% da receita fora dos EUA em moedas locais",
          detail: "Yuan fraco (-4,2% vs. USD no Q1) reduziu receita chinesa em US$180 mi. Euro e GBP estáveis. Hedge natural parcial via produção em Shanghai e Berlim para mercados locais.",
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
          title: "Headcount global: 121.000 colaboradores — redução de 14% vs. 2024",
          detail: "Tesla demitiu ~20.000 pessoas em dois rounds em 2024–2025 por directiva de Elon Musk de 'corte agressivo de custos'. Em 2026, contratações retomadas em Engenharia de AI e Optimus. Saldo líquido negativo ainda.",
          badge: { label: "ATENÇÃO", type: "warn" },
        },
        {
          color: "#8b5cf6",
          tag: "Engenharia AI",
          title: "400 engenheiros de AI contratados no Q1/26 — foco em Dojo e FSD",
          detail: "Disputa direta com Google DeepMind e OpenAI por talentos. Pacote médio: US$320.000/ano em cash + RSUs. Time de Autopilot com 1.800 engenheiros. Dojo supercomputador em expansão em Austin.",
          badge: { label: "CONTRATANDO", type: "info" },
        },
        {
          color: "#8b5cf6",
          tag: "Optimus Team",
          title: "Time Optimus: 2.200 pessoas — maior crescimento por área em 2026",
          detail: "Engenheiros mecânicos, de robótica e de visão computacional. Maioria contratada externamente (Boston Dynamics, Agility Robotics, ex-NASA). Cultura de entrega em ciclos de 6 semanas.",
        },
      ],
    },
    {
      sectionTitle: "Clima & Retenção",
      cards: [
        {
          color: "#8b5cf6",
          tag: "Turnover",
          title: "Turnover voluntário: 18% em 2025 — acima da média do setor (11%)",
          detail: "Principais razões: pressão de carga horária (semanas de 60–70h relatadas no Glassdoor), incerteza com posicionamento político de Musk e cortes. Plano de retenção com RSU refresh aprovado para engenheiros sênior.",
          badge: { label: "RISCO", type: "warn" },
        },
        {
          color: "#8b5cf6",
          tag: "Retorno ao Escritório",
          title: "Política 100% presencial — 5 dias/semana obrigatório",
          detail: "Diretiva de Elon Musk em vigor desde 2023. Escritórios em Austin, Fremont e Palo Alto. Resistência interna em times de software. Tesla não flexibiliza por posição pública do CEO.",
          badge: { label: "MANTIDO", type: "info" },
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
          tag: "Produção",
          title: "Capacidade instalada global: 2,35 mi veículos/ano — utilização 73%",
          detail: "Fremont (CA): 550K/ano, Shanghai: 950K/ano, Berlin: 375K/ano, Austin: 250K/ano (ramp Cybertruck + Cybercab). Utilização abaixo de 80% por demanda aquém da capacidade. Meta 2026: 1,8 mi entregas.",
          badge: { label: "73%", type: "warn" },
        },
        {
          color: "#06b6d4",
          tag: "Gigafactory Berlin",
          title: "Berlin: 375.000 unidades/ano — eficiência de linha +18% com robôs",
          detail: "Mais automatizada das 4 plantas. Model Y Juniper produzido para Europa e parte do Oriente Médio. Meta de autonomia energética com 300 MW de painéis solares no telhado — conclusão set/26.",
          badge: { label: "OK", type: "ok" },
        },
        {
          color: "#06b6d4",
          tag: "Dojo",
          title: "Supercomputador Dojo: 1 ExaFLOP de capacidade — treinamento FSD",
          detail: "Dojo 2 em Austin com clusters NVLink e processadores D1 customizados. Reduz dependência de Nvidia A100/H100 para treinar modelos de visão. Custo de treinamento FSD por versão: US$30 mi.",
          badge: { label: "ATIVO", type: "info" },
        },
      ],
    },
    {
      sectionTitle: "Supply Chain",
      cards: [
        {
          color: "#06b6d4",
          tag: "Bateria 4680",
          title: "Célula 4680: produção de 2 bi de células/ano em Fremont e Austin",
          detail: "Custo atual: US$65/kWh — meta de US$50/kWh até dez/26. Densidade energética 17% superior à célula 2170 (Panasonic). Ramp ainda abaixo da curva por problemas de rendimento na linha seca de eletrodo.",
          badge: { label: "EM RAMP", type: "warn" },
        },
        {
          color: "#06b6d4",
          tag: "Supply Chain",
          title: "Fornecedor de chips CMOS: risco de concentração em TSMC Taiwan",
          detail: "Tesla depende de TSMC para chips de inferência FSD HW4. Qualquer evento no Estreito de Taiwan interromperia linhas de produção em 60–90 dias. Avaliação de fornecedor alternativo (Samsung 3nm) em andamento.",
          badge: { label: "RISCO", type: "warn" },
        },
      ],
    },
  ],

  estoque: [
    {
      sectionTitle: "O que mudou em Estoque",
      cards: [
        {
          color: "#84cc16",
          tag: "Inventário de Veículos",
          title: "Inventário de veículos acabados: 28 dias — acima do ideal",
          detail: "Ideal operacional de Tesla: 15–20 dias. Aumento por desaceleração de demanda na Europa e EUA. Model S/X com 52 dias de estoque — pressão para descontos adicionais.",
          badge: { label: "ELEVADO", type: "warn" },
        },
        {
          color: "#84cc16",
          tag: "Células LFP",
          title: "Estoque de células LFP (CATL/BYD): 45 dias de cobertura",
          detail: "Cells LFP usadas no Model 3 RWD e Model Y Standard Range. Impacto de tarifas 145% sobre importação da China pode forçar migração para célula 4680 (Tesla própria). Decisão estratégica em Q2/26.",
          badge: { label: "MONITORAR", type: "warn" },
        },
        {
          color: "#84cc16",
          tag: "Megapack",
          title: "Backlog Megapack: 28 GWh — lead time de entrega 14 meses",
          detail: "Demanda supera capacidade de produção em Lathrop. Tesla priorizando contratos de utilidades com maior margem. Lead time caiu de 18 para 14 meses com expansão da fábrica em jan/26.",
          badge: { label: "OK", type: "ok" },
        },
      ],
    },
    {
      sectionTitle: "Componentes Críticos",
      cards: [
        {
          color: "#84cc16",
          tag: "Chip HW4",
          title: "Chip FSD HW4 (TSMC 7nm): estoque de 90 dias — seguro",
          detail: "Tesla mantém buffer estratégico após escassez de 2021. HW4 presente em 100% dos veículos produzidos desde mai/23. Migração para HW5 (3nm) planejada para H2/27. Sem risco de desabastecimento no curto prazo.",
          badge: { label: "OK", type: "ok" },
        },
        {
          color: "#84cc16",
          tag: "Cobre & Alumínio",
          title: "Cobre: exposição de US$480 mi/ano — preço no LME a US$9.800/t",
          detail: "Cada Tesla usa 83 kg de cobre. Alta de 12% no LME vs. jan/26. Contratos de hedge cobrem 50% do volume até set/26. Alumínio: Alta pressão tarifária americana (+25%) sobre importação.",
          badge: { label: "ATENÇÃO", type: "warn" },
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
          tag: "FSD Liability",
          title: "62 ações civis ativas nos EUA relacionadas a acidentes com FSD",
          detail: "Maioria em California, Texas e Florida. Argumento recorrente: autopilot comercializado como 'Full Self-Driving' sem capacidade total. Tesla vence 70% dos casos por prova de intervenção humana disponível. 4 acordos em 2026.",
          badge: { label: "MONITORAR", type: "warn" },
        },
        {
          color: "#f97316",
          tag: "NHTSA",
          title: "NHTSA: investigação sobre 400.000 Model 3/Y com falha em câmera lateral",
          detail: "Câmera lateral esquerda pode falhar sob calor extremo (>45°C) em certos lotes de produção 2022–2023. Tesla propõe correção via OTA. NHTSA avalia se OTA é suficiente ou recall físico é necessário. Decisão: Q3/26.",
          badge: { label: "EM INVESTIGAÇÃO", type: "warn" },
        },
        {
          color: "#f97316",
          tag: "SEC",
          title: "SEC: investigação sobre divulgações de range de autonomia — aberta em fev/26",
          detail: "Reuters revelou que Tesla usava algoritmo interno diferente para calcular range exibido ao motorista vs. range real. Investigação formal aberta. Tesla cooperando. Risco de multa estimado: US$200–500 mi.",
          badge: { label: "ABERTA", type: "warn" },
        },
      ],
    },
    {
      sectionTitle: "Propriedade Intelectual & Regulação",
      cards: [
        {
          color: "#f97316",
          tag: "Patentes",
          title: "Tesla mantém política open source de patentes — 890 patentes ativas",
          detail: "Elon Musk publicou todas as patentes de EV em 2014. Estratégia: acelerar ecossistema EV para justificar investimento em rede Supercharger. Rivian e Lucid citam 12 patentes Tesla em seus projetos.",
          badge: { label: "OPEN", type: "info" },
        },
        {
          color: "#f97316",
          tag: "Europa",
          title: "UE: conformidade com EU AI Act para FSD — prazo ago/26",
          detail: "FSD classificado como sistema de IA de alto risco pela Comissão Europeia. Exige auditoria de terceiros, documentação técnica e mecanismo de supervisão humana explícito. Tesla contratou DNV para certificação.",
          badge: { label: "PRAZO AGO/26", type: "warn" },
        },
        {
          color: "#f97316",
          tag: "Cybercab",
          title: "Regulação Robotaxi — Austin aprovada, California pendente",
          detail: "Texas aprovou operação de veículos autônomos sem operador em mar/26. California DMV ainda analisa. NYC e Chicago em fase pré-regulatória. Tesla não pode operar Cybercab comercialmente fora de Austin até aprovação.",
          badge: { label: "PARCIAL", type: "info" },
        },
      ],
    },
  ],
  administrativo: [],
  comercial: [],
  compras: [],
  ti: [],
  atendimento: [],
};
