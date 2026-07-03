import type { CompanySectorFeeds } from '../../types';

const C = '#e11d48';

export const PACHECO_LOJA1_SECTOR_FEEDS: CompanySectorFeeds = {
  marketing: [
    {
      sectionTitle: 'Presença Local & Comunicação',
      cards: [
        {
          color: C,
          tag: 'BAIRRO',
          title: 'Vitrine da loja pode comunicar vacinação e dermocosméticos — dois serviços que o cliente não lembra que a farmácia oferece',
          detail: 'Clientes passam em frente à Pacheco todos os dias sem saber que existe vacinação sem agendamento e consultoria de dermocosmético disponível. Uma comunicação visual externa com esses dois serviços aumenta o tráfego de entrada sem custo de mídia.',
          badge: { label: 'Tráfego', type: 'info' },
        },
        {
          color: C,
          tag: 'GOOGLE',
          title: 'Avaliação 4.1 no Google — uma resposta pública ao comentário de fila pode virar diferencial',
          detail: 'Lojas que respondem avaliações negativas com solução concreta têm nota média 0,3 pontos acima das que ignoram. A reclamação de fila registrada há 3 semanas ainda aparece sem resposta — um retorno público com o número do SAC e resultado mostra gestão ativa.',
          badge: { label: 'Reputação', type: 'warn' },
        },
        {
          color: C,
          tag: 'WHATSAPP',
          title: 'WhatsApp Business da loja pode avisar cliente quando produto crônico for entregue — zero custo de fidelização',
          detail: 'Cliente de medicamento crônico que cadastra o WhatsApp recebe aviso de chegada antes de vir à loja. Isso elimina a visita frustrada por ruptura e cria um canal direto para promoção semanal de dermocosmético sem custo de mídia.',
          badge: { label: 'Retenção', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Evento & Saúde Preventiva',
      cards: [
        {
          color: C,
          tag: 'EVENTO',
          title: 'Semana de vacinação gratuita no corredor da loja pode gerar 80 a 120 novos cadastros',
          detail: 'Ação de vacinação em período de gripe ou meningite C atrai moradores do entorno que não costumam entrar na farmácia. Um formulário de WhatsApp na saída converte o tráfego em contato permanente — e o cliente entra pela primeira vez.',
          badge: { label: 'Prospecção', type: 'ok' },
        },
      ],
    },
  ],

  vendas: [
    {
      sectionTitle: 'Atendimento Farmacêutico & Conversão',
      cards: [
        {
          color: C,
          tag: 'CRÔNICO',
          title: 'Medicamento crônico é o produto com maior frequência de recompra — transformar numa assinatura mensal é retenção automática',
          detail: 'Cliente de anti-hipertensivo, diabetes ou colesterol compra todo mês, mas faz isso onde tiver conveniência. Oferecer separação antecipada com aviso via WhatsApp fideliza esse cliente antes que o Onofre+iFood ou a Venancio capturem com entrega em 30 minutos.',
          badge: { label: 'Retenção', type: 'ok' },
        },
        {
          color: C,
          tag: 'DERMOCOSMÉTICO',
          title: 'Consultoria gratuita de skincare no balcão pode triplicar o ticket médio da venda de creme',
          detail: 'Cliente que pede "um creme para manchas" sem orientação compra o produto mais barato. Farmacêutico que apresenta a rotina completa (protetor solar + sérum + hidratante) eleva o ticket médio de R$ 30 para R$ 90 sem argumento de venda — só educação.',
          badge: { label: 'Ticket +R$60', type: 'ok' },
        },
        {
          color: C,
          tag: 'EVER',
          title: 'Linha Ever tem margem 22 p.p. acima do genérico equivalente — priorizar quando cliente pede alternativa',
          detail: 'Quando o cliente pede "tem algo mais barato?" o farmacêutico que apresenta Ever (marca própria DPSP) entrega produto com qualidade equivalente e margem superior ao genérico de terceiro. Treinamento de 20 minutos já garante resultado na semana.',
          badge: { label: 'Alta margem', type: 'ok' },
        },
      ],
    },
    {
      sectionTitle: 'Entrega & Conveniência',
      cards: [
        {
          color: C,
          tag: 'DELIVERY',
          title: 'Entrega em 30 minutos no raio de 2 km pode ser o argumento final contra Onofre+iFood',
          detail: 'O cliente urbano que pede medicamento via app espera 45 a 90 minutos via Onofre/iFood. Loja Pacheco com motoboy próprio no bairro (ou parceria com entregador local) entrega em 30 min com atendimento farmacêutico — isso é impossível de replicar por plataforma.',
          badge: { label: 'Diferencial local', type: 'ok' },
        },
      ],
    },
  ],

  financeiro: [
    {
      sectionTitle: 'Mix & Margem por Categoria',
      cards: [
        {
          color: C,
          tag: 'MARGEM',
          title: 'Dermocosmético responde por 8% do giro mas 28% da margem da loja — mix está desbalanceado',
          detail: 'Se a prateleira de dermocosmético ocupa menos de 15% do espaço visível da loja, a loja está sub-otimizando a categoria de maior margem. Reorganizar a gôndola para ampliar dermocosméticos no nível dos olhos eleva margem sem alterar sortimento total.',
          badge: { label: 'Otimização de espaço', type: 'warn' },
        },
        {
          color: C,
          tag: 'EVER',
          title: 'Meta de penetração Ever 20% nas categorias-alvo elevaria margem global da loja em 4 pontos',
          detail: 'Linha Ever (marca própria DPSP) tem penetração média de 8% nas lojas abaixo da meta — quando chega a 20% nas categorias de cuidado pessoal e suplementos, a margem global da loja sobe significativamente sem crescimento de volume.',
          badge: { label: 'Meta de marca própria', type: 'info' },
        },
      ],
    },
  ],

  operacoes: [
    {
      sectionTitle: 'Estoque Farmacêutico & Fluxo',
      cards: [
        {
          color: C,
          tag: 'FILA',
          title: 'Fila no caixa farmacêutico acima de 4 minutos é o principal motivo de avaliação negativa — separação de filas resolve',
          detail: 'Lojas Pacheco com nota 4.3+ separaram o caixa de medicamentos tarjados do caixa de cosméticos e conveniência. A fila única gera percepção de demora mesmo quando o atendimento é rápido. Uma baia separada para tarjados elimina 80% das reclamações de espera.',
          badge: { label: 'Operação crítica', type: 'warn' },
        },
        {
          color: C,
          tag: 'PICO',
          title: 'Escala de farmacêutico no pico de 11h–13h e 17h–19h define o NPS do dia',
          detail: 'Os dois picos de tráfego em farmácia de bairro ocorrem no horário de almoço (funcionários vizinhos) e após o trabalho. Farmacêutico ausente nesses horários força balconista a realizar atendimento fora do escopo — que é notificável pela ANVISA e frustrante para o cliente.',
          badge: { label: 'Gestão de escala', type: 'warn' },
        },
      ],
    },
  ],

  rh: [
    {
      sectionTitle: 'Equipe & Treinamento',
      cards: [
        {
          color: C,
          tag: 'TREINAMENTO',
          title: 'Balconista que conhece Ever + rotina de skincare vende 3× mais dermocosmético do que quem só aponta a gôndola',
          detail: 'Treinamento de produto de 45 minutos com amostras dos 5 SKUs Ever mais vendidos capacita o balconista para converter a pergunta "o que você indica?" em venda consultiva. Custo zero — resultado aparece na semana seguinte.',
          badge: { label: 'Capacitação', type: 'ok' },
        },
        {
          color: C,
          tag: 'FARMACÊUTICO',
          title: 'Farmacêutico responsável deve estar disponível no caixa de tarjados — não apenas "a disposição"',
          detail: 'RDC 44/2009 exige farmacêutico disponível para orientação em venda de tarjado. Loja que mantém o farmacêutico visivelmente próximo ao caixa de medicamentos passa na fiscalização e cria percepção de credibilidade — dois resultados com uma ação.',
          badge: { label: 'Conformidade + reputação', type: 'info' },
        },
      ],
    },
  ],

  estoque: [
    {
      sectionTitle: 'Validade & Reposição',
      cards: [
        {
          color: C,
          tag: 'VALIDADE',
          title: 'Verificação semanal de vencimento é obrigatória e evita notificação ANVISA — lista dos 20 itens críticos',
          detail: 'Produto vencido na gôndola é a principal causa de interdição parcial de farmácia e notificação no SNGPC. Rotina semanal de 30 minutos com os 20 produtos de maior giro elimina esse risco. Lista deve ser fixa, não depender de memória da equipe.',
          badge: { label: 'Risco regulatório', type: 'warn' },
        },
        {
          color: C,
          tag: 'CRÔNICO',
          title: 'Ruptura em medicamento crônico é irreversível — cliente troca de farmácia e não volta',
          detail: 'Metformina, losartana e atorvastatina são os 3 medicamentos de maior saída em farmácia de bairro. Ruptura de 72h nesses produtos tem taxa de migração permanente de 40% — o cliente abre a conta no Venancio ou Onofre e passa a comprar tudo lá.',
          badge: { label: 'Risco de perda de cliente', type: 'warn' },
        },
      ],
    },
  ],

  juridico: [
    {
      sectionTitle: 'SNGPC & Regulatório',
      cards: [
        {
          color: C,
          tag: 'SNGPC',
          title: 'Divergência no SNGPC gera notificação automática da ANVISA — conferência mensal é obrigatória',
          detail: 'O Sistema Nacional de Gerenciamento de Produtos Controlados (SNGPC) deve fechar com o estoque físico mensalmente. Uma divergência de 5 unidades em psicotrópico gera notificação automática que pode chegar a R$ 25.000 de multa. A conferência leva 2 horas e previne 100% do risco.',
          badge: { label: 'Risco ANVISA', type: 'warn' },
        },
        {
          color: C,
          tag: 'PRESCRIÇÃO',
          title: 'Venda de tarjado sem receita retida é irregularidade — equipe precisa do protocolo correto',
          detail: 'Balconista que vende tarjado B sem reter a receita expõe a loja a autuação com multa entre R$ 2.000 e R$ 75.000 (RDC 44/2009). Protocolo visual colado no caixa de tarjados com os 10 medicamentos de maior venda e a exigência de receita elimina esse risco sem treinamento extenso.',
          badge: { label: 'Conformidade', type: 'warn' },
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
