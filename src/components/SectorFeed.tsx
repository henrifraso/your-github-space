import React from 'react';
import { motion } from 'motion/react';
import {
  Megaphone, TrendingUp, Banknote, Users, Settings2, Package, Scale,
  ChevronRight, AlertTriangle, CheckCircle2, Clock
} from 'lucide-react';
import { FeedSection, FeedCard } from './FeedComponents';
import type { SectorId } from './SectorSwitcher';
import { SECTORS } from './SectorSwitcher';

const fadeItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] } },
};

function SimpleCard({ color, tag, title, detail, badge }: {
  color: string; tag: string; title: string; detail: string; badge?: { label: string; type: 'ok' | 'warn' | 'info' };
}) {
  return (
    <FeedCard>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color }}>{tag}</p>
          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 leading-snug">{title}</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">{detail}</p>
        </div>
        {badge && (
          <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5
            ${badge.type === 'ok'   ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
              badge.type === 'warn' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
              'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'}`}>
            {badge.label}
          </span>
        )}
      </div>
    </FeedCard>
  );
}

function MarketingFeed() {
  return (
    <>
      <motion.div variants={fadeItem}>
        <FeedSection title="Campanhas Ativas" icon={<Megaphone size={18}/>}>
          <SimpleCard color="#ec4899" tag="Campanha Sazonal" title="McFlurry Páscoa — lançamento 13/abr" detail="Kit ovo de Páscoa + McFlurry representa 18% do faturamento no período. Prazo para ativar ponto de venda: esta semana." badge={{ label: 'URGENTE', type: 'warn' }} />
          <SimpleCard color="#ec4899" tag="App Méqui" title="Desconto 30% off em combos via app — vigente até 30/abr" detail="Cupom MEQUIAPP30 impulsiona +22% de downloads na semana. Comunicar em todos os pontos de contato." badge={{ label: 'ATIVA', type: 'ok' }} />
          <SimpleCard color="#ec4899" tag="Kids" title="Nova campanha Méqui Kids — material disponível no portal" detail="Novos brinquedos McLanche Feliz com coleção Anime 2025. Retirar kits de montagem na fornecedora até sexta." />
        </FeedSection>
      </motion.div>

      <motion.div variants={fadeItem}>
        <FeedSection title="Marca & Reputação" icon={<ChevronRight size={18}/>}>
          <SimpleCard color="#ec4899" tag="Google Reviews" title="Nota 4.2 · 23 avaliações positivas esta semana" detail="Principais elogios: rapidez no atendimento e limpeza. Ponto de melhoria mais citado: tempo de espera no drive." badge={{ label: '4.2 ★', type: 'ok' }} />
          <SimpleCard color="#ec4899" tag="Influencer Local" title="@paulistastyle (52k seguidores) mencionou a loja no story" detail="Post orgânico com 3.8k views nas últimas 48h. Oportunidade de responder e amplificar no perfil oficial." badge={{ label: 'NOVO', type: 'info' }} />
        </FeedSection>
      </motion.div>

      <motion.div variants={fadeItem}>
        <FeedSection title="Oportunidades" icon={<TrendingUp size={18}/>}>
          <SimpleCard color="#ec4899" tag="Ação Sugerida" title="Festa Junina — prepare banner e promoção combo até 20/mai" detail="Concorrente Giraffas já anunciou campanha junina. Antecipar ação aumenta recall de marca na região em período sazonal." />
        </FeedSection>
      </motion.div>
    </>
  );
}

function VendasFeed() {
  return (
    <>
      <motion.div variants={fadeItem}>
        <FeedSection title="Resultados da Semana" icon={<TrendingUp size={18}/>}>
          <SimpleCard color="#10b981" tag="Ticket Médio" title="R$ 42 por cliente · +8% vs semana passada" detail="Combos são o principal driver de crescimento. Upsell de bebidas cresceu 14% após treinamento de atendimento." badge={{ label: '+8%', type: 'ok' }} />
          <SimpleCard color="#10b981" tag="Horário de Pico" title="11h–14h responde por 58% das vendas diárias" detail="Turnover de mesa em 7 min no pico. Considerar reforço de 2 atendentes na faixa das 12h." />
          <SimpleCard color="#10b981" tag="Meta Mensal" title="Combo Big Mac: 88% da meta — faltam 12%" detail="17 dias restantes no mês. Ritmo atual é suficiente se mantido. Alerta: feriadão de Tiradentes reduz fluxo em ~20%." badge={{ label: '88%', type: 'info' }} />
        </FeedSection>
      </motion.div>

      <motion.div variants={fadeItem}>
        <FeedSection title="Delivery" icon={<ChevronRight size={18}/>}>
          <SimpleCard color="#10b981" tag="iFood" title="iFood: 34% das vendas · meta 40% até Jun/25" detail="Taxa de cancelamento 3.2% — abaixo da média nacional (4.8%). Avaliação iFood: 4.5 estrelas." badge={{ label: '34%', type: 'info' }} />
          <SimpleCard color="#10b981" tag="Rappi" title="Rappi: 9% das vendas · crescimento 3pp em 30 dias" detail="Oportunidade de subir no ranking ativando promoção exclusiva Rappi — kit especial + frete grátis." />
        </FeedSection>
      </motion.div>

      <motion.div variants={fadeItem}>
        <FeedSection title="Ação da Semana" icon={<ChevronRight size={18}/>}>
          <SimpleCard color="#10b981" tag="Quick Win" title="Ativar combo sobremesa após as 15h para aumentar ticket" detail="Experiência de outras franquias: oferta de McFlurry após 15h eleva ticket médio em R$4–6 sem aumentar tempo de atendimento." />
        </FeedSection>
      </motion.div>
    </>
  );
}

function FinanceiroFeed() {
  return (
    <>
      <motion.div variants={fadeItem}>
        <FeedSection title="Fiscal & Impostos" icon={<Banknote size={18}/>}>
          <SimpleCard color="#f59e0b" tag="SIMPLES Nacional" title="Guia Abr/2026 vence em 20 dias — valor estimado R$ 4.240" detail="Regime: Simples Nacional Anexo I (alimentos). Alíquota efetiva 6.8%. Contador: confirmar com escritório até sexta." badge={{ label: 'PENDENTE', type: 'warn' }} />
          <SimpleCard color="#f59e0b" tag="NFe" title="Emissão de notas: 100% em dia · 0 rejeições no mês" detail="Certificado digital A1 vence em Out/2026. Renovação pode ser feita com 60 dias de antecedência." badge={{ label: 'OK', type: 'ok' }} />
          <SimpleCard color="#f59e0b" tag="SPED" title="EFD-ICMS/IPI entrega: em dia · próximo arquivo Mai/2026" detail="Obrigação acessória transmitida via SPED até dia 15 de cada mês. Conferir lançamentos de entradas com fornecedores." />
        </FeedSection>
      </motion.div>

      <motion.div variants={fadeItem}>
        <FeedSection title="Custos & Margens" icon={<ChevronRight size={18}/>}>
          <SimpleCard color="#f59e0b" tag="CMV" title="Custo de Mercadoria Vendida: 32% do faturamento (+1.2pp)" detail="Alta no preço do frango (+6.8% em 30 dias) impacta itens como McNuggets e McFrango. Revisar mix para manter margem." badge={{ label: '+1.2pp', type: 'warn' }} />
          <SimpleCard color="#f59e0b" tag="Energia" title="Consumo de energia +4% vs mesmo período do ano anterior" detail="Fritureiros e câmaras frias respondem por 68% do consumo. Verificar manutenção preventiva dos equipamentos." />
        </FeedSection>
      </motion.div>
    </>
  );
}

function RhFeed() {
  return (
    <>
      <motion.div variants={fadeItem}>
        <FeedSection title="Escala & Equipe" icon={<Users size={18}/>}>
          <SimpleCard color="#8b5cf6" tag="Cobertura de Turno" title="2 faltas não cobertas — turno domingo 08h–14h" detail="Equipe atual: 18 funcionários ativos. Banco de horas disponível para 3 colaboradores voluntários." badge={{ label: 'ATENÇÃO', type: 'warn' }} />
          <SimpleCard color="#8b5cf6" tag="Novas Contratações" title="3 contratados em período de experiência — 60 dias em Mai/2026" detail="Ana Costa, Pedro Lima e Juliana Reis — avaliação de performance agendada para 12/mai. Confirmar documentação até lá." badge={{ label: 'PRAZO', type: 'info' }} />
        </FeedSection>
      </motion.div>

      <motion.div variants={fadeItem}>
        <FeedSection title="Treinamentos" icon={<ChevronRight size={18}/>}>
          <SimpleCard color="#8b5cf6" tag="Higiene & Segurança" title="3 colaboradores pendentes no módulo de higiene alimentar" detail="Módulo obrigatório ANVISA. Prazo: antes da próxima auditoria (Mai/2026). Plataforma: https://treinamentos.mcdonalds.com.br" badge={{ label: 'PENDENTE', type: 'warn' }} />
          <SimpleCard color="#8b5cf6" tag="Atendimento" title="Treinamento de upsell concluído — 14 funcionários certificados" detail="NPS interno subiu 8 pontos após o treinamento em março. Próximo módulo: Gestão de Reclamações (Jun/2026)." badge={{ label: 'CONCLUÍDO', type: 'ok' }} />
        </FeedSection>
      </motion.div>

      <motion.div variants={fadeItem}>
        <FeedSection title="Legislação Trabalhista" icon={<Scale size={18}/>}>
          <SimpleCard color="#8b5cf6" tag="Convenção Coletiva 2025" title="Reajuste salarial 6.5% vigente desde Jan/2026 — já aplicado" detail="Piso da categoria: R$ 1.680. Horas extras: 50% (segunda a sábado), 100% (domingos e feriados). Conferir folha de pagamento." badge={{ label: 'EM DIA', type: 'ok' }} />
        </FeedSection>
      </motion.div>
    </>
  );
}

function OperacoesFeed() {
  return (
    <>
      <motion.div variants={fadeItem}>
        <FeedSection title="Qualidade & Equipamentos" icon={<Settings2 size={18}/>}>
          <SimpleCard color="#06b6d4" tag="Manutenção" title="Fritureiro #2 — temperatura irregular detectada ontem" detail="Temperatura oscilando entre 168°C e 182°C (padrão: 175°C ±3°C). Acionar assistência técnica antes do turno de amanhã." badge={{ label: 'ALERTA', type: 'warn' }} />
          <SimpleCard color="#06b6d4" tag="Câmara Fria" title="Câmara #1: -18°C · Câmara #2: -17.4°C — dentro do padrão" detail="Registros de temperatura dos últimos 7 dias dentro da faixa ANVISA. Calibração do sensor agendada para próxima semana." badge={{ label: 'OK', type: 'ok' }} />
          <SimpleCard color="#06b6d4" tag="Limpeza" title="Check de limpeza diário: 6/7 itens aprovados — pendente banheiro masculino" detail="Vistoria de abertura identificou falha no banheiro masculino. Corrigido às 08h15. Registrar no app de qualidade." />
        </FeedSection>
      </motion.div>

      <motion.div variants={fadeItem}>
        <FeedSection title="ANVISA & Compliance" icon={<CheckCircle2 size={18}/>}>
          <SimpleCard color="#06b6d4" tag="Auditoria" title="Próxima vistoria Vigilância Sanitária SP: Mai/2026" detail="Checklist de preparação: 14/18 itens concluídos. Pendentes: controle de pragas (renovar laudo), planilhas de temperatura impressas." badge={{ label: '4 PENDENTES', type: 'warn' }} />
          <SimpleCard color="#06b6d4" tag="RDC 216/2004" title="Rastreabilidade de alimentos: controles atualizados" detail="Registro de lotes e datas de validade em dia. Próxima auditoria interna prevista para 05/mai." badge={{ label: 'CONFORME', type: 'ok' }} />
        </FeedSection>
      </motion.div>
    </>
  );
}

function EstoqueFeed() {
  return (
    <>
      <motion.div variants={fadeItem}>
        <FeedSection title="Alertas de Estoque" icon={<Package size={18}/>}>
          <SimpleCard color="#84cc16" tag="CRÍTICO" title="Embalagens Big Mac: estoque para 2 dias — repor urgente" detail="Consumo médio: 340 unidades/dia. Saldo atual: 680 unidades. Solicitar pedido emergencial ao fornecedor Pactiv." badge={{ label: 'CRÍTICO', type: 'warn' }} />
          <SimpleCard color="#84cc16" tag="Atenção" title="Batata congelada McCain: estoque 60% — pedir nesta semana" detail="Pedido quinzenal com 7 dias de lead time. Prazo ideal para pedido: até quinta-feira." badge={{ label: 'ATENÇÃO', type: 'info' }} />
          <SimpleCard color="#84cc16" tag="OK" title="Bebidas e sucos: estoque para 12 dias" detail="Coca-Cola FEMSA: entrega confirmada para terça-feira. Nenhuma ação necessária." badge={{ label: 'OK', type: 'ok' }} />
        </FeedSection>
      </motion.div>

      <motion.div variants={fadeItem}>
        <FeedSection title="Pedidos em Trânsito" icon={<Clock size={18}/>}>
          <SimpleCard color="#84cc16" tag="Chegada Amanhã" title="3 pedidos com previsão de entrega amanhã (08h–12h)" detail="1· Pão brioche McDonald's (Bimbo) — 2· Molho especial Big Mac (caixa 12un) — 3· Luvas e EPI almoxarifado." />
          <SimpleCard color="#84cc16" tag="Sazonalidade" title="McFlurry Páscoa: demanda prevista +25% em 13–20/abr" detail="Solicitar incremento de 30% no pedido de calda Ovomaltine e cone waffle. Confirmar espaço em câmara fria." badge={{ label: 'PLANEJAR', type: 'info' }} />
        </FeedSection>
      </motion.div>
    </>
  );
}

function JuridicoFeed() {
  return (
    <>
      <motion.div variants={fadeItem}>
        <FeedSection title="Compliance & Regulatório" icon={<Scale size={18}/>}>
          <SimpleCard color="#f97316" tag="Vigilância Sanitária" title="Status regulatório: preparado para auditoria Q2/2026" detail="Alvará sanitário vigente até Dez/2026. Laudo de controle de pragas: renovar até 30/abr (prazo em 15 dias)." badge={{ label: 'ATENÇÃO', type: 'warn' }} />
          <SimpleCard color="#f97316" tag="PROCON" title="0 reclamações ativas no Procon SP nos últimos 90 dias" detail="Nenhuma notificação pendente. Monitoramento via sistema SINDEC em dia." badge={{ label: 'LIMPO', type: 'ok' }} />
          <SimpleCard color="#f97316" tag="ANVISA" title="RDC 216/2004 — conformidade verificada em Mar/2026" detail="Próxima auditoria interna: 05/mai. Registros de higiene e rastreabilidade disponíveis para inspeção." badge={{ label: 'CONFORME', type: 'ok' }} />
        </FeedSection>
      </motion.div>

      <motion.div variants={fadeItem}>
        <FeedSection title="Contratos & Obrigações" icon={<ChevronRight size={18}/>}>
          <SimpleCard color="#f97316" tag="Contrato de Locação" title="Renovação do contrato de aluguel: Jul/2026 — iniciar negociação" detail="Contrato atual: 5 anos (2021–2026), reajuste IGP-M. Proprietário: Laje Administradora. Iniciar negociação com 6 meses de antecedência." badge={{ label: 'JUL/2026', type: 'info' }} />
          <SimpleCard color="#f97316" tag="Legislação Nova" title="Lei de embalagens plásticas descartáveis — vigência Jun/2026" detail="Lei Municipal SP 17.261/2020 ampliada: proibição de canudos plásticos e caixinhas EPS. Substituição já em andamento pela franquia." badge={{ label: 'JUN/2026', type: 'warn' }} />
        </FeedSection>
      </motion.div>
    </>
  );
}

interface Props {
  sector: Exclude<SectorId, 'geral'>;
}

const SECTOR_FEEDS: Record<Exclude<SectorId, 'geral'>, React.ComponentType> = {
  marketing:  MarketingFeed,
  vendas:     VendasFeed,
  financeiro: FinanceiroFeed,
  rh:         RhFeed,
  operacoes:  OperacoesFeed,
  estoque:    EstoqueFeed,
  juridico:   JuridicoFeed,
};

export function SectorFeed({ sector }: Props) {
  const meta = SECTORS.find(s => s.id === sector)!;
  const FeedContent = SECTOR_FEEDS[sector];

  return (
    <motion.div
      className="max-w-[935px] mx-auto mt-4 sm:mt-6 pb-12 space-y-6 sm:space-y-8 px-4 sm:px-5"
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } }}
    >
      {/* Banner do setor ativo */}
      <motion.div
        variants={fadeItem}
        className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-dashed"
        style={{ borderColor: meta.color + '60', backgroundColor: meta.color + '0d' }}
      >
        <span style={{ color: meta.color }}>{meta.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide" style={{ color: meta.color }}>Feed de {meta.label}</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Notícias e alertas específicos para esta área</p>
        </div>
      </motion.div>

      <FeedContent />
    </motion.div>
  );
}
