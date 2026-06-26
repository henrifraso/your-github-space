import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { apiFetch } from '../../api';
import { getContextUploads, resolveUploadOrgBu, type ContextUpload } from './contextUploads';
import { calcScoreInicial, nivelLabelCalculado } from './score-formula';
import {
  TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp,
  FileText, BarChart2, ShieldCheck, MapPin, Zap,
  ExternalLink, ArrowRight, RefreshCw, ClipboardList, X, Globe,
} from 'lucide-react';
import { loadNavigatedSources, type NavigatedSource } from '../../features/browser/navigated-sources';
import { CircleProgress } from '../../components/CircleProgress';

interface Dimensao { id: string; label: string; score: number; icon: React.ElementType; descricao: string; }
interface Evidencia { id: number; tipo: string; fonte: string; confianca: number; impacto: number; titulo: string; descricao: string; }
interface Conteudo { nome: string; tipo: string; data: string; }
interface ScoreMock {
  companyName: string; status: string; periodo: string; scoreGeral: number;
  dimensoes: Dimensao[]; evolucao: { semana: string; score: number }[];
  evidencias: Evidencia[]; conteudos: Conteudo[]; cardsRelacionados: string[]; explicacao: string;
}

const OSCAR_MOCK: ScoreMock = {
  companyName: 'Oscar Calçados', status: 'Em monitoramento', periodo: 'Últimos 30 dias', scoreGeral: 72,
  dimensoes: [
    { id: 'mercado', label: 'Mercado', score: 81, icon: TrendingUp, descricao: 'Sinais positivos de demanda e tendência no setor de calçados.' },
    { id: 'concorrencia', label: 'Concorrência', score: 64, icon: BarChart2, descricao: 'Atenção por movimentação de concorrentes próximos no raio competitivo.' },
    { id: 'reputacao', label: 'Reputação', score: 76, icon: ShieldCheck, descricao: 'Avaliações estáveis com pontos de atenção em preço e atendimento.' },
    { id: 'presenca', label: 'Presença Local', score: 69, icon: MapPin, descricao: 'Visibilidade média na região. Abaixo da média do raio competitivo.' },
    { id: 'execucao', label: 'Ações', score: 58, icon: Zap, descricao: 'Poucos cards transformados em plano na Área de Trabalho.' },
  ],
  evolucao: [{ semana: 'Início', score: 61 }, { semana: 'Semana 2', score: 66 }, { semana: 'Semana 3', score: 70 }, { semana: 'Agora', score: 72 }],
  evidencias: [
    { id: 1, tipo: 'Concorrência', fonte: 'Google Maps', confianca: 0.70, impacto: -3, titulo: 'Concorrente no raio competitivo', descricao: 'Arezzo e Mr. Cat com avaliações acima de 4.4★ a menos de 2 km.' },
    { id: 2, tipo: 'Mercado', fonte: 'Valor Econômico', confianca: 0.82, impacto: 5, titulo: 'Crescimento do varejo de calçados em SP', descricao: 'Setor cresceu 8% no primeiro semestre. Demanda por marcas nacionais em alta.' },
    { id: 3, tipo: 'Reputação', fonte: 'Reclame Aqui', confianca: 0.85, impacto: -2, titulo: 'Menções a preço e atendimento', descricao: 'Varejistas com política de troca clara têm 40% mais satisfação.' },
    { id: 4, tipo: 'Ações', fonte: 'Área de Trabalho', confianca: 1.0, impacto: 4, titulo: 'Card transformado em plano', descricao: 'Plano de revisão de mix de produtos iniciado.' },
    { id: 5, tipo: 'Conteúdo', fonte: 'Empresa', confianca: 0.90, impacto: 2, titulo: 'Conteúdo enviado para análise', descricao: 'Relatório comercial e campanha compõem o contexto atual.' },
  ],
  conteudos: [
    { nome: 'Relatório comercial.pdf', tipo: 'PDF', data: '12/06/2026' },
    { nome: 'Campanha Dia dos Namorados.docx', tipo: 'DOCX', data: '08/06/2026' },
    { nome: 'Lista de unidades.csv', tipo: 'CSV', data: '01/06/2026' },
    { nome: 'Observação manual do gestor', tipo: 'Texto', data: '18/06/2026' },
  ],
  cardsRelacionados: [
    'Concorrentes em SP podem estar se reposicionando',
    'Reputação local exige atenção em atendimento e política de troca',
    'Presença digital abaixo da média do raio competitivo',
  ],
  explicacao: 'O score subiu porque o sistema já possui uma leitura inicial do ambiente externo. A precisão aumentará conforme a empresa enviar contexto interno, novos sinais forem coletados e ações forem executadas na Área de Trabalho.',
};

const NEUTRO_BASE: Omit<ScoreMock, 'companyName'> = {
  status: 'Leitura inicial', periodo: 'Últimos 30 dias', scoreGeral: 68,
  dimensoes: [
    { id: 'mercado', label: 'Mercado', score: 72, icon: TrendingUp, descricao: 'Sinais de mercado em coleta.' },
    { id: 'concorrencia', label: 'Concorrência', score: 61, icon: BarChart2, descricao: 'Análise de concorrência em andamento.' },
    { id: 'reputacao', label: 'Reputação', score: 70, icon: ShieldCheck, descricao: 'Dados de reputação em validação.' },
    { id: 'presenca', label: 'Presença Local', score: 65, icon: MapPin, descricao: 'Visibilidade local em análise.' },
    { id: 'execucao', label: 'Ações', score: 54, icon: Zap, descricao: 'Histórico de ações ainda em construção.' },
  ],
  evolucao: [{ semana: 'Início', score: 60 }, { semana: 'Semana 2', score: 63 }, { semana: 'Semana 3', score: 66 }, { semana: 'Agora', score: 68 }],
  evidencias: [
    { id: 1, tipo: 'Mercado', fonte: 'Sinal externo', confianca: 0.60, impacto: 2, titulo: 'Sinal externo em monitoramento', descricao: 'Fonte pública identificada e em validação.' },
    { id: 2, tipo: 'Reputação', fonte: 'Sinal externo', confianca: 0.55, impacto: 0, titulo: 'Fonte pública em validação', descricao: 'Dados ainda sendo processados pelo sistema.' },
    { id: 3, tipo: 'Ações', fonte: 'Área de Trabalho', confianca: 0.80, impacto: 1, titulo: 'Card em análise pelo sistema', descricao: 'Ação identificada, aguardando execução.' },
    { id: 4, tipo: 'Conteúdo', fonte: 'Empresa', confianca: 0.50, impacto: 0, titulo: 'A empresa ainda não enviou contexto interno para enriquecer a leitura.', descricao: 'Envie relatórios ou observações para enriquecer a leitura.' },
  ],
  conteudos: [],
  cardsRelacionados: ['Contexto da empresa em construção — envie dados para enriquecer a análise'],
  explicacao: 'Este score é uma leitura inicial. Ele ficará mais preciso conforme o OS¹ acumular sinais externos, evidências, conteúdos enviados e ações executadas.',
};

const NOME_POR_SECTOR: Record<string, string> = {
  mcdonalds: "McDonald's Brasil", nike: 'Oscar Calçados', nubank: 'Drogarias Pacheco',
  'cerveja-imperio': 'Cerveja Império', 'cerveja-imperio-distribuidora-01': 'Distribuidora Império',
  ifood: 'iFood', ambev: 'Ambev', magalu: 'Magazine Luiza',
  embraer: 'Embraer', tesla: 'Tesla', netflix: 'Netflix',
  spotify: 'Spotify', airbnb: 'Airbnb', uber: 'Uber',
  apple: 'Apple', amazon: 'Amazon', natura: 'Natura', os1: 'OS¹',
};

const CERVEJA_IMPERIO_MOCK: ScoreMock = {
  companyName: 'Cerveja Império', status: 'Leitura inicial com oportunidade territorial', periodo: 'Últimos 30 dias', scoreGeral: 71,
  dimensoes: [
    { id: 'mercado', label: 'Mercado', score: 78, icon: TrendingUp, descricao: 'Setor de cervejas regionais em crescimento de 18% ao ano — janela favorável para expansão de presença e posicionamento.' },
    { id: 'concorrencia', label: 'Concorrência', score: 59, icon: BarChart2, descricao: 'Ambev e Heineken ampliam ações de trade com comodato em PDVs da região. Pressão competitiva crescente no território serrano.' },
    { id: 'reputacao', label: 'Reputação', score: 74, icon: ShieldCheck, descricao: 'Menções públicas positivas associadas à origem serrana. Monitoramento de Reclame Aqui e Google Avaliações em andamento.' },
    { id: 'presenca', label: 'Presença Territorial', score: 63, icon: MapPin, descricao: 'Cobertura regional ainda em expansão. Regiões dos Lagos e Sul Fluminense com potencial identificado sem cobertura ativa.' },
    { id: 'execucao', label: 'Ações', score: 61, icon: Zap, descricao: 'Cards de inteligência gerados. Ações de PDV e eventos em processo de execução pela equipe comercial.' },
  ],
  evolucao: [{ semana: 'Início', score: 58 }, { semana: 'Semana 2', score: 63 }, { semana: 'Semana 3', score: 68 }, { semana: 'Agora', score: 71 }],
  evidencias: [
    { id: 1, tipo: 'Mercado', fonte: 'Leitura demonstrativa', confianca: 0.74, impacto: 5, titulo: 'Cervejas regionais crescem 18% ao ano', descricao: 'Consumidor busca identidade e origem — Petrópolis como ativo de posicionamento tem vantagem que marcas nacionais não conseguem replicar.' },
    { id: 2, tipo: 'Concorrência', fonte: 'Sinal demonstrativo', confianca: 0.68, impacto: -4, titulo: 'Ambev com comodato em PDVs da rota', descricao: 'Freezers instalados em bares estratégicos criam barreira de entrada. 6 pontos na rota leste receberam equipamento nos últimos 45 dias.' },
    { id: 3, tipo: 'Território', fonte: 'Mapa OS¹ · Demo', confianca: 0.70, impacto: 4, titulo: 'Região dos Lagos sem marca regional dominante', descricao: 'Janela de entrada antes do verão — 8 municípios com alta demanda sazonal e mix concorrente ainda não consolidado.' },
    { id: 4, tipo: 'Reputação', fonte: 'Fonte monitorável', confianca: 0.60, impacto: 2, titulo: 'Menções positivas à origem serrana', descricao: 'Associação com Petrópolis e tradição cervejeira regional aparece em menções espontâneas. Monitoramento de Reclame Aqui ativo.' },
    { id: 5, tipo: 'Eventos', fonte: 'Calendário regional · Demo', confianca: 0.72, impacto: 3, titulo: 'Calendário de festivais cresce 35% em RJ/ES/MG', descricao: 'Oportunidade de exposição de marca em eventos de perfil compatível com posicionamento premium regional.' },
  ],
  conteudos: [
    { nome: 'Mix de portfólio Império 2026.pdf', tipo: 'PDF', data: '10/06/2026' },
    { nome: 'Estratégia comercial distribuidoras.docx', tipo: 'DOCX', data: '05/06/2026' },
    { nome: 'Calendário de eventos RJ 2T26.csv', tipo: 'CSV', data: '01/06/2026' },
  ],
  cardsRelacionados: [
    'A Império pode estar deixando espaço nos canais onde o giro acontece',
    'Grandes marcas podem ocupar o território antes da próxima janela de consumo',
    'O mapa mostra regiões onde a Império pode crescer antes do concorrente perceber',
  ],
  explicacao: 'Score baseado em leitura demonstrativa para apresentação comercial do OS¹. A nota reflete sinais de mercado, pressão competitiva e oportunidade territorial identificados. Base demonstrativa — precisão aumenta com dados reais da empresa.',
};

const DISTRIBUIDORA_IMPERIO_MOCK: ScoreMock = {
  companyName: 'Distribuidora Império', status: 'Operação com potencial de expansão', periodo: 'Últimos 30 dias', scoreGeral: 67,
  dimensoes: [
    { id: 'mercado', label: 'Demanda Regional', score: 74, icon: TrendingUp, descricao: 'Pré-verão com crescimento de demanda detectado na Região dos Lagos e no entorno dos festivais serranos.' },
    { id: 'concorrencia', label: 'Pressão Competitiva', score: 55, icon: BarChart2, descricao: 'Distribuidoras concorrentes com ação intensa de comodato e visita semanal nos mesmos PDVs. Atenção: 2 pontos âncora em risco.' },
    { id: 'reputacao', label: 'Relacionamento PDV', score: 72, icon: ShieldCheck, descricao: 'Visita semanal consolidada nos principais pontos. Relacionamento pessoal com donos de bar é o principal ativo da operação.' },
    { id: 'presenca', label: 'Cobertura de Rota', score: 61, icon: MapPin, descricao: 'Rota ativa com cobertura de PDVs estabelecida. Regiões de Correias, Nogueira e Litoral Leste sem cobertura regular identificadas.' },
    { id: 'execucao', label: 'Operação', score: 58, icon: Zap, descricao: 'Gargalo de entrega em dois dias da semana detectado. Oportunidade de redistribuição de rota para aumentar confiabilidade.' },
  ],
  evolucao: [{ semana: 'Início', score: 54 }, { semana: 'Semana 2', score: 59 }, { semana: 'Semana 3', score: 63 }, { semana: 'Agora', score: 67 }],
  evidencias: [
    { id: 1, tipo: 'Operação', fonte: 'Sinal demonstrativo', confianca: 0.76, impacto: -3, titulo: 'Gargalo de entrega em terças e quintas', descricao: '70% das entregas concentradas em 2 dias. PDVs de segunda e sexta relatam atrasos — concorrente já abordou 2 desses pontos.' },
    { id: 2, tipo: 'Concorrência', fonte: 'Sinal demonstrativo', confianca: 0.72, impacto: -5, titulo: 'Comodato concorrente em 6 bares da rota leste', descricao: 'Freezers instalados criam dependência de marca. Janela de ação em 15 dias para os 3 pontos ainda sem equipamento ativado.' },
    { id: 3, tipo: 'Oportunidade', fonte: 'Mapa OS¹ · Demo', confianca: 0.68, impacto: 6, titulo: 'Região dos Lagos sem distribuidora regional especializada', descricao: 'Entrada antes de setembro com 20 PDVs âncora garante presença no pico sazonal de verão — custo de entrada 3× menor que em dezembro.' },
    { id: 4, tipo: 'PDV', fonte: 'Sinal demonstrativo', confianca: 0.80, impacto: 3, titulo: '2 PDVs vulneráveis com proposta concorrente aberta', descricao: 'PDV Itamarati e PDV Centro com propostas de freezer Heineken em avaliação. Visita de relacionamento esta semana pode manter os dois pontos.' },
    { id: 5, tipo: 'Expansão', fonte: 'Leitura demonstrativa', confianca: 0.65, impacto: 4, titulo: 'Distritos de Correias e Nogueira sem cobertura ativa', descricao: 'Território dentro da cidade sem distribuidora especializada — 23 PDVs potenciais acessíveis sem custo de deslocamento extra.' },
  ],
  conteudos: [
    { nome: 'Plano de rota junho 2026.xlsx', tipo: 'XLSX', data: '01/06/2026' },
    { nome: 'Lista de PDVs ativos.csv', tipo: 'CSV', data: '15/06/2026' },
    { nome: 'Relatório de visita semanal.pdf', tipo: 'PDF', data: '20/06/2026' },
  ],
  cardsRelacionados: [
    'A pressão concorrente pode estar chegando antes da reposição',
    'Alguns PDVs podem estar prontos para girar mais Império',
    'A operação pode ganhar margem priorizando os pontos certos',
  ],
  explicacao: 'Score baseado em leitura demonstrativa para apresentação comercial do OS¹. Reflete sinais de operação, pressão competitiva e oportunidade de expansão identificados na rota. Base demonstrativa — precisão aumenta com dados reais da operação.',
};

const OSCAR_LOJA1_MOCK: ScoreMock = {
  companyName: 'Oscar Loja 1', status: 'Raio competitivo mais disputado', periodo: 'Últimos 30 dias', scoreGeral: 74,
  dimensoes: [
    { id: 'mercado', label: 'Demanda Local', score: 80, icon: TrendingUp, descricao: 'Demanda de inverno em alta no Vale do Paraíba. Botas, couro feminino e conforto lideram o interesse de busca na região.' },
    { id: 'concorrencia', label: 'Raio Competitivo', score: 62, icon: BarChart2, descricao: 'Centauro, Constance, Studio Z, Di Gaspi e World Tennis no mesmo raio. Raio competitivo da loja ficou mais denso nos últimos 6 meses.' },
    { id: 'reputacao', label: 'Reputação Local', score: 76, icon: ShieldCheck, descricao: 'Avaliações Google estáveis. Atendimento consultivo é o diferencial mais citado. Fotos do Google Meu Negócio precisam de atualização.' },
    { id: 'presenca', label: 'Presença no Bairro', score: 71, icon: MapPin, descricao: 'Visibilidade no Center Vale sólida. Bairros residenciais no raio de 3 km ainda com penetração baixa — público qualificado não chegou até a loja.' },
    { id: 'execucao', label: 'Ações', score: 67, icon: Zap, descricao: 'Cards de inteligência gerados. Vitrine, mix Diadora e reputação local são as ações prioritárias da semana.' },
  ],
  evolucao: [{ semana: 'Início', score: 64 }, { semana: 'Semana 2', score: 68 }, { semana: 'Semana 3', score: 72 }, { semana: 'Agora', score: 74 }],
  evidencias: [
    { id: 1, tipo: 'Concorrência', fonte: 'Google Maps · Demo', confianca: 0.82, impacto: -4, titulo: 'Centauro e Constance no mesmo raio de 2 km', descricao: 'Centauro no Center Vale com esportivo premium + drops Nike. Constance no Jd. Satélite com conforto feminino. Dois dos segmentos mais fortes da Oscar com concorrente direto.' },
    { id: 2, tipo: 'Produto', fonte: 'Leitura demonstrativa', confianca: 0.88, impacto: 6, titulo: 'Exclusividade Diadora: argumento que o concorrente não tem', descricao: 'Licença exclusiva Diadora no Brasil — nenhum concorrente no mesmo shopping oferece o mesmo produto. É o diferencial mais forte da loja e o menos comunicado.' },
    { id: 3, tipo: 'Reputação', fonte: 'Google Avaliações · Demo', confianca: 0.75, impacto: 2, titulo: 'Avaliação Google estável com atendimento como diferencial', descricao: 'Atendimento consultivo aparece nas avaliações positivas. Fotos desatualizadas e falta de resposta a avaliações recentes podem reduzir conversão de busca.' },
    { id: 4, tipo: 'Mercado', fonte: 'Tendência regional · Demo', confianca: 0.72, impacto: 4, titulo: 'Inverno com demanda aquecida em calçado feminino', descricao: 'Buscas por "botas femininas SJC" e "couro feminino" crescem desde maio. Vitrine atualizada para o inverno captura esse público antes do concorrente.' },
    { id: 5, tipo: 'Presença', fonte: 'Leitura demonstrativa', confianca: 0.65, impacto: 3, titulo: 'Bairros residenciais no raio com baixa penetração', descricao: 'Moradores do Jd. Satélite e entorno próximos da loja mas com baixa frequência de visita — sinal de que a comunicação local ainda não chegou até eles.' },
  ],
  conteudos: [
    { nome: 'Inventário loja junho 2026.xlsx', tipo: 'XLSX', data: '18/06/2026' },
    { nome: 'Relatório de vendas semanal.pdf', tipo: 'PDF', data: '20/06/2026' },
    { nome: 'Fotos vitrine inverno.jpg', tipo: 'Imagem', data: '15/06/2026' },
  ],
  cardsRelacionados: [
    'A Centauro pode estar capturando o cliente esportivo antes de entrar na Oscar',
    'Os drops Diadora podem ser o diferencial que nenhuma outra loja do shopping tem',
    'A vitrine de inverno pode definir quem fica na memória do cliente até a próxima compra',
  ],
  explicacao: 'Score baseado em leitura demonstrativa para apresentação comercial do OS¹. Reflete o raio competitivo da Oscar Loja 1, oportunidades de produto e presença local. Base demonstrativa — precisão aumenta com dados reais da operação.',
};

const PACHECO_MOCK: ScoreMock = {
  companyName: 'Drogarias Pacheco', status: 'Liderança consolidada sob pressão crescente', periodo: 'Últimos 30 dias', scoreGeral: 79,
  dimensoes: [
    { id: 'mercado', label: 'Mercado & Setor', score: 85, icon: TrendingUp, descricao: 'Varejo farmacêutico cresce 14,9% ao ano. Reajuste CMED de 5,8% favorece margem. Setor em consolidação com oportunidades de M&A.' },
    { id: 'concorrencia', label: 'Pressão Competitiva', score: 68, icon: BarChart2, descricao: 'RD Saúde com adensamento agressivo em SP. Tamoio avança na Baixada Fluminense. Digital (Onofre+iFood) captura cliente de urgência.' },
    { id: 'reputacao', label: 'Reputação', score: 81, icon: ShieldCheck, descricao: 'NPS regional 78 — acima da média do setor (64). 71% de reconhecimento espontâneo no RJ. Reclame Aqui com oportunidade de melhoria em prazo de resposta.' },
    { id: 'presenca', label: 'Presença Territorial', score: 82, icon: MapPin, descricao: '700+ lojas no RJ + expansão em SP com 400 lojas planejadas até 2028. Presença zero no Nordeste — região em consolidação com oportunidade de M&A via Pague Menos.' },
    { id: 'execucao', label: 'Ações', score: 74, icon: Zap, descricao: 'Same-day RJ em 90% de cobertura. App com 4 mi de downloads. Ever crescendo 30%. Próximas ações: assinatura de crônicos, adensamento SP e resposta ao digital concorrente.' },
  ],
  evolucao: [{ semana: 'Início', score: 73 }, { semana: 'Semana 2', score: 75 }, { semana: 'Semana 3', score: 77 }, { semana: 'Agora', score: 79 }],
  evidencias: [
    { id: 1, tipo: 'Concorrência', fonte: 'Setor farma · Demo', confianca: 0.84, impacto: -5, titulo: 'RD Saúde com +60 lojas em SP nos próximos 12 meses', descricao: 'Líder do setor com R$ 14,2bi no 1T26 (+14,9% YoY) acelera adensamento paulista. Cada nova Droga Raia ou Drogasil reduz o raio de influência das lojas Pacheco em SP.' },
    { id: 2, tipo: 'Produto', fonte: 'Relatório DPSP · Demo', confianca: 0.90, impacto: 8, titulo: 'Margem Ever 18 p.p. acima de marcas comerciais', descricao: 'Linha Ever representa 14% do faturamento com 130+ SKUs. Margem bruta 18 p.p. superior. Cada ponto de share da Ever é dinheiro que ia para o fornecedor — agora fica no grupo.' },
    { id: 3, tipo: 'Digital', fonte: 'Leitura demonstrativa', confianca: 0.76, impacto: -3, titulo: 'Assinatura digital de crônicos capturando base fidelizada', descricao: 'Farmácia Permanente com 500k assinantes e Onofre+iFood com entrega em 30 min disputam o cliente de crônico e urgência que a Pacheco atende via loja física.' },
    { id: 4, tipo: 'M&A', fonte: 'Mercado · Demo', confianca: 0.72, impacto: 6, titulo: 'Pague Menos com -R$ 600 mi — janela de aquisição aberta', descricao: 'Vice-líder em reestruturação com ativos no Nordeste — região com 56 mi de habitantes onde a Pacheco tem zero presença. Janela de M&A a desconto raramente dura mais de 18 meses.' },
    { id: 5, tipo: 'Reputação', fonte: 'Fonte monitorável · Demo', confianca: 0.80, impacto: 3, titulo: 'NPS 78 — líder regional com 134 anos de tradição', descricao: '71% de reconhecimento espontâneo no RJ e NPS 14 pontos acima da média do setor são o maior ativo defensivo da Pacheco frente ao adensamento da RD.' },
  ],
  conteudos: [
    { nome: 'Plano de expansão SP 2026.pdf', tipo: 'PDF', data: '10/06/2026' },
    { nome: 'Relatório Ever Q1 2026.pptx', tipo: 'PPTX', data: '05/06/2026' },
    { nome: 'Pipeline M&A Nordeste.xlsx', tipo: 'XLSX', data: '01/06/2026' },
    { nome: 'Análise Reclame Aqui jun/26.pdf', tipo: 'PDF', data: '20/06/2026' },
  ],
  cardsRelacionados: [
    'A RD Saúde pode estar abrindo no mesmo quarteirão antes que você perceba o risco',
    'A margem da Ever pode estar sendo deixada na mesa em quase todas as lojas',
    'A Pague Menos em reestruturação pode ser a janela de M&A mais acessível dos últimos anos',
  ],
  explicacao: 'Score baseado em leitura demonstrativa para apresentação comercial do OS¹. Reflete posição de mercado, pressão competitiva e oportunidades estratégicas da Drogarias Pacheco. Base demonstrativa — precisão aumenta com dados reais da operação.',
};

const OSCAR_SECTORS = new Set(['oscar-piloto-01', 'nike']);

function getMock(activeSector?: string): ScoreMock {
  if (activeSector === 'nike') return OSCAR_MOCK;
  if (activeSector === 'oscar-piloto-01') return OSCAR_LOJA1_MOCK;
  if (activeSector === 'cerveja-imperio') return CERVEJA_IMPERIO_MOCK;
  if (activeSector === 'cerveja-imperio-distribuidora-01') return DISTRIBUIDORA_IMPERIO_MOCK;
  if (activeSector === 'nubank') return PACHECO_MOCK;
  const nome = activeSector ? (NOME_POR_SECTOR[activeSector] ?? 'Empresa selecionada') : 'Empresa selecionada';
  return { ...NEUTRO_BASE, companyName: nome };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function nivelLabel(s: number) {
  return nivelLabelCalculado(s);
}

function ImpactoTag({ v }: { v: number }) {
  if (v > 0) return (
    <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
      <TrendingUp size={10} strokeWidth={2} />+{v}
    </span>
  );
  if (v < 0) return (
    <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-neutral-500 dark:text-neutral-500">
      <TrendingDown size={10} strokeWidth={2} />{v}
    </span>
  );
  return (
    <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-neutral-400 dark:text-neutral-600">
      <Minus size={10} />0
    </span>
  );
}

// ── Gráfico SVG — curva bezier + grid sutil + currentColor ───────────────────

function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return '';
  const t = 0.35;
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) * t;
    const cp1y = p1.y + (p2.y - p0.y) * t;
    const cp2x = p2.x - (p3.x - p1.x) * t;
    const cp2y = p2.y - (p3.y - p1.y) * t;
    d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return d;
}

function Grafico({ pts }: { pts: { semana: string; score: number }[] }) {
  const W = 320, H = 80, PX = 14, PY = 14, min = 50, max = 88;
  const coords = pts.map((e, i) => ({
    x: PX + (i / (pts.length - 1)) * (W - PX * 2),
    y: H - PY - ((e.score - min) / (max - min)) * (H - PY * 2),
    ...e,
  }));
  const linePath = smoothPath(coords);
  const lastC = coords[coords.length - 1];
  const firstC = coords[0];
  const areaPath = `${linePath} L${lastC.x},${H - PY} L${firstC.x},${H - PY} Z`;
  // grid lines horizontais a 25/50/75% do range visível
  const gridYs = [0.25, 0.5, 0.75].map(f => H - PY - f * (H - PY * 2));

  return (
    <div className="text-neutral-900 dark:text-white w-full -mx-1">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* grid lines */}
        {gridYs.map((gy, i) => (
          <line key={i} x1={PX} y1={gy} x2={W - PX} y2={gy}
            stroke="currentColor" strokeOpacity="0.06" strokeWidth="0.8" strokeDasharray="3 4" />
        ))}
        {/* área */}
        <path d={areaPath} fill="currentColor" opacity="0.05" />
        {/* linha */}
        <path d={linePath} fill="none" stroke="currentColor" strokeWidth="1.4"
          strokeOpacity="0.75" strokeLinecap="round" strokeLinejoin="round" />
        {/* pontos + labels */}
        {coords.map(p => (
          <g key={p.semana}>
            <circle cx={p.x} cy={p.y} r={2.5} fill="currentColor" opacity="0.85" />
            <text x={p.x} y={p.y - 7} textAnchor="middle" fontSize="8.5"
              fill="currentColor" fillOpacity="0.65" fontFamily="system-ui" fontWeight="600">{p.score}</text>
            <text x={p.x} y={H - 2} textAnchor="middle" fontSize="7"
              fill="currentColor" fillOpacity="0.3" fontFamily="system-ui">{p.semana}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ── Classes de container — igual ao feed ─────────────────────────────────────

const cardCls = 'bg-[#f0f2f4] dark:bg-[#323232] border-[0.5px] border-neutral-200 dark:border-[#414141] rounded-2xl shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),0_2px_6px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_24px_-4px_rgba(0,0,0,0.6),0_2px_8px_rgba(0,0,0,0.4)]';
const innerCls = 'bg-neutral-50 dark:bg-[#2a2a2a] border-[0.5px] border-neutral-200 dark:border-[#3a3a3a] rounded-xl shadow-[inset_0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_1px_4px_rgba(0,0,0,0.28),0_1px_2px_rgba(0,0,0,0.2)]';

function SecaoHeader({ icon: Icon, titulo, badge }: { icon: React.ElementType; titulo: string; badge?: string | number }) {
  return (
    <div className="flex items-center gap-2.5 mb-3">
      <Icon size={15} className="text-neutral-400" strokeWidth={1.8} />
      <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-100">{titulo}</h3>
      {badge !== undefined && (
        <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-[#353535] px-2 py-0.5 rounded-full">{badge}</span>
      )}
    </div>
  );
}

function InfoChip({ label, icon: Icon }: { label: string; icon: React.ElementType }) {
  return (
    <div className="flex flex-col items-center text-center gap-1.5 px-2 py-3 rounded-xl border-[0.5px] bg-[#f7f8f9] dark:bg-[#2f2f2f] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_2px_6px_-1px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(255,255,255,0.6)] dark:shadow-[0_2px_6px_-1px_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(255,255,255,0.04)] select-none">
      <Icon size={14} strokeWidth={1.6} className="text-neutral-400 dark:text-neutral-500 flex-shrink-0" />
      <span className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400 leading-tight">{label}</span>
    </div>
  );
}

function EvidenciaItem({ ev }: { ev: Evidencia }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-neutral-100 dark:border-[#3a3a3a] last:border-0">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-start gap-3 py-2.5 hover:bg-neutral-50 dark:hover:bg-[#2a2a2a] rounded-xl px-2 -mx-2 transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-[#353535] px-1.5 py-0.5 rounded-full">{ev.tipo}</span>
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500">{ev.fonte}</span>
            <span className="ml-auto flex items-center gap-2">
              <ImpactoTag v={ev.impacto} />
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500">Confiança {Math.round(ev.confianca * 100)}%</span>
            </span>
          </div>
          <p className="text-[13px] font-medium text-neutral-700 dark:text-neutral-200">{ev.titulo}</p>
        </div>
        <span className="text-neutral-400 mt-0.5 flex-shrink-0">{open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}</span>
      </button>
      {open && <p className="text-[12px] text-neutral-500 dark:text-neutral-400 pb-2.5 px-2 leading-relaxed">{ev.descricao}</p>}
    </div>
  );
}

// ── Score Grid — destaques estilo bio com fontes e Score no centro ────────────

function BigScoreCircle({ score }: { score: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 2800;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [score]);

  return (
    <div className="relative w-64 h-64">
      <div className="absolute inset-0 rounded-2xl shadow-[0_6px_16px_-3px_rgba(0,0,0,0.22),0_2px_4px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_20px_-3px_rgba(0,0,0,0.6),0_2px_6px_rgba(0,0,0,0.4)] pointer-events-none" />
      <div className="absolute inset-0 rounded-2xl border-[0.5px] border-neutral-200 dark:border-[#4a4a4a] pointer-events-none z-[2]" />
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 64 64" style={{ filter: 'drop-shadow(0 0 1.5px #88888855)' }}>
        <rect x="6" y="6" width="52" height="52" rx="16" ry="16" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" className="text-neutral-400 dark:text-[#4a4a4a]" />
        <motion.rect
          x="6" y="6" width="52" height="52" rx="16" ry="16"
          fill="none" stroke="#888888" strokeWidth="1"
          strokeLinejoin="round" strokeLinecap="butt"
          pathLength={100} strokeDasharray="100"
          initial={{ strokeDashoffset: 100 }}
          animate={{ strokeDashoffset: 100 - score }}
          transition={{ duration: 2.8, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-[20%] rounded-full bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] shadow-[0_4px_10px_-1px_rgba(0,0,0,0.22),0_1px_3px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.6)] dark:shadow-[0_4px_10px_-1px_rgba(0,0,0,0.55),0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.04)]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-6xl font-black tabular-nums text-neutral-800 dark:text-neutral-100">
          {display}
        </span>
      </div>
    </div>
  );
}

function ScoreRevealCard({ scoreGeral, cardCls }: { scoreGeral: number; cardCls: string }) {
  // Mesma cor neutra para todas as fontes; Score ligeiramente mais forte
  const COR_FONTE = '#888888';
  const COR_SCORE = '#444444';

  const items: { pct: number; label: string; cor: string; isScore?: boolean }[] = [
    { pct: 74, label: 'Reclame Aqui', cor: COR_FONTE },
    { pct: 81, label: 'Google',        cor: COR_FONTE },
    { pct: scoreGeral, label: 'Jornais', cor: COR_SCORE, isScore: true },
    { pct: 68, label: 'Redes Sociais', cor: COR_FONTE },
    { pct: 77, label: 'Avaliações',    cor: COR_FONTE },
    { pct: 62, label: 'Notícias',      cor: COR_FONTE },
    { pct: 71, label: 'Tripadvisor',   cor: COR_FONTE },
    { pct: 65, label: 'Facebook',      cor: COR_FONTE },
    { pct: 79, label: 'Instagram',     cor: COR_FONTE },
    { pct: 58, label: 'Foursquare',    cor: COR_FONTE },
    { pct: 83, label: 'Yelp',          cor: COR_FONTE },
    { pct: 70, label: 'Seu Crédito',   cor: COR_FONTE },
    { pct: 66, label: 'Procon',        cor: COR_FONTE },
  ];

  return (
    <div className={`${cardCls} overflow-hidden transition-transform duration-200 hover:scale-[1.01]`}>
      <div className="flex flex-row items-start gap-3 px-4 py-5 overflow-x-auto [&::-webkit-scrollbar]:hidden">
        {items.map((item, i) => (
          <div key={item.label} className="flex-shrink-0">
            <CircleProgress pct={item.pct} label={item.label} color={item.cor} delay={i * 0.07} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tipos públicos ────────────────────────────────────────────────────────────

export interface ScoreInsight { titulo: string; resumo?: string; dominio?: string; urgencia?: string; }

// ── Painel principal ──────────────────────────────────────────────────────────

interface ScoreOS1PanelProps { onClose?: () => void; activeSector?: string; role?: string; standalone?: boolean; insights?: ScoreInsight[]; }

export function ScoreOS1Panel({ onClose, activeSector, role: _role, standalone = true, insights }: ScoreOS1PanelProps) {
  const mock = getMock(activeSector);
  const [evidenciasReais, setEvidenciasReais] = useState<Evidencia[] | null>(null);

  useEffect(() => {
    // Sectores Oscar e OS¹ (Codify puro) usam mock — sem chamada de evidências
    if (!activeSector || OSCAR_SECTORS.has(activeSector) || activeSector === 'os1') return;
    const orgId = localStorage.getItem('os1_org_id');
    const buId  = localStorage.getItem('os1_bu_id');
    if (!orgId || !buId) return;
    apiFetch(`/api/codify/v0/evidences?organizationId=${encodeURIComponent(orgId)}&unitId=${encodeURIComponent(buId)}&limit=5`)
      .then((res: any) => {
        const items = res?.data?.items;
        if (!Array.isArray(items) || items.length === 0) return;
        setEvidenciasReais(items.map((ev: any, i: number) => ({
          id: i + 1,
          titulo: ev.title ?? ev.sourceTitle ?? 'Evidência identificada',
          descricao: ev.summary ?? '',
          confianca: typeof ev.confidence === 'number' ? ev.confidence : 0.5,
          tipo: ev.evidenceType ?? 'Sinal externo',
          fonte: ev.sourceTitle ?? ev.source ?? ev.url ?? 'Fonte pública',
          impacto: 0,
        })));
      })
      .catch(() => {});
  }, [activeSector]);

  const evidencias = evidenciasReais ?? mock.evidencias;

  const [uploads, setUploads] = useState<ContextUpload[]>([]);
  useEffect(() => {
    const rawOrgId = localStorage.getItem('os1_org_id') ?? undefined;
    const rawBuId  = localStorage.getItem('os1_bu_id')  ?? undefined;
    const { orgId, buId } = resolveUploadOrgBu(activeSector, rawOrgId, rawBuId);
    setUploads(getContextUploads(orgId, buId, activeSector));
  }, [activeSector]);

  const [navigatedSources, setNavigatedSources] = useState<NavigatedSource[]>([]);
  const refreshNavigatedSources = useCallback(() => {
    if (activeSector) setNavigatedSources(loadNavigatedSources(activeSector));
  }, [activeSector]);
  useEffect(() => { refreshNavigatedSources(); }, [refreshNavigatedSources]);

  const mappedUploads = uploads.map(u => ({
    nome: u.name,
    tipo: u.extension ? u.extension.toUpperCase() : 'Arquivo',
    data: new Date(u.uploadedAt).toLocaleDateString('pt-BR'),
  }));
  const conteudosToShow: { nome: string; tipo: string; data: string }[] =
    (activeSector && OSCAR_SECTORS.has(activeSector))
      ? [...mock.conteudos, ...mappedUploads]
      : mappedUploads;

  // Score calculado apenas quando `insights` prop está presente (perfis com codifyScope).
  // Codify puro (os1) passa insights=undefined → scoreGeral permanece do mock.
  const scoreGeral = useMemo(() => {
    if (!insights) return mock.scoreGeral;
    return calcScoreInicial(insights, uploads.length);
  }, [insights, uploads.length, mock.scoreGeral]);

  // Completude de conteúdo: cada fator preenchido = +20 (máx 100).
  // Quando chega em 100, refreshKey incrementa e re-renderiza as seções abaixo.
  const completeness = useMemo(() => {
    const fatores = [
      evidencias.length > 0,           // tem sinais/evidências
      conteudosToShow.length > 0,      // tem contexto enviado
      navigatedSources.length > 0,     // tem fontes navegadas
      mock.dimensoes.length >= 3,      // tem dimensões ativas
      scoreGeral >= 65,                // score inicial razoável
    ];
    return fatores.filter(Boolean).length * 20;
  }, [evidencias.length, conteudosToShow.length, navigatedSources.length, mock.dimensoes.length, scoreGeral]);

  const [refreshKey, setRefreshKey] = useState(0);
  const prevCompleteness = useRef(0);
  useEffect(() => {
    if (completeness >= 100 && prevCompleteness.current < 100) {
      setRefreshKey(k => k + 1);
    }
    prevCompleteness.current = completeness;
  }, [completeness]);

  return (
    <div className="flex flex-col h-full bg-[#dcdfe2] dark:bg-[#181818] text-neutral-800 dark:text-neutral-200 overflow-hidden">

      {/* Barra própria — standalone usa breadcrumb; dentro do BrowserView usa pill com barra de conteúdo */}
      {standalone ? (
        <div className="flex items-center gap-2 px-4 pt-10 pb-3 bg-[#f0f2f4] dark:bg-[#323232] border-b border-neutral-200 dark:border-[#414141] shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] flex-shrink-0">
          <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">OS¹</span>
          <span className="text-neutral-300 dark:text-neutral-600">/</span>
          <span className="text-[12px] font-medium text-neutral-600 dark:text-neutral-300">Score OS¹</span>
          {onClose && (
            <button onClick={onClose} className="ml-auto p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-[#2a2a2a] transition-colors">
              <X size={13} />
            </button>
          )}
        </div>
      ) : (
        <div className="flex-shrink-0 px-5 pt-8 pb-2">
          <div className="bg-[#f0f2f4] dark:bg-[#323232] border-[0.5px] border-neutral-100 dark:border-[#414141] rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.18),0_1px_3px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.5),0_1px_3px_rgba(0,0,0,0.3)] px-4 py-3 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">Conteúdo</p>
              <span className="text-[10px] font-bold tabular-nums text-neutral-700 dark:text-neutral-200">
                {completeness}<span className="text-neutral-400 dark:text-neutral-500 font-normal">/100</span>
                {completeness >= 100 && <span className="ml-2 text-[9px] font-semibold text-neutral-500 dark:text-neutral-400">✓</span>}
              </span>
              {onClose && (
                <button onClick={onClose} className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-[#2a2a2a] transition-colors">
                  <X size={13} />
                </button>
              )}
            </div>
            <div className="h-1.5 bg-neutral-200 dark:bg-[#2a2a2a] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-neutral-700 dark:bg-neutral-300"
                initial={{ width: 0 }}
                animate={{ width: `${completeness}%` }}
                transition={{ duration: 1.6, ease: 'easeOut', delay: 0.1 }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4 [&::-webkit-scrollbar]:hidden">

        {/* Seções abaixo — re-renderizam com fade quando completeness atinge 100 */}
        <AnimatePresence mode="wait">
        <motion.div key={refreshKey} className="space-y-4"
          initial={{ opacity: refreshKey === 0 ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >

        {/* Stack: fundo com dados nas laterais, score flutuando por cima no centro */}
        <div className="relative">

          {/* Fundo — vazio, só visual */}
          <div className={`${cardCls}`} style={{ minHeight: 380 }} />

          {/* Score — flutua por cima, dados nos cantos */}
          <div className={`${cardCls} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center transition-transform duration-200 hover:scale-[1.01]`} style={{ width: 'calc(100% - 24px)' }}>

            {/* Esquerda — Sinais */}
            <div className="flex flex-col gap-0 flex-1 self-stretch border-r border-neutral-100 dark:border-[#3a3a3a]">
              <p className="text-[8px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 px-3 pt-4 pb-2">Sinais · 30d</p>
              {([
                { titulo: 'Reclamações',  valor: '0',                                                                    badge: 'Sem alertas'   },
                { titulo: 'Positivos',    valor: `${Math.max(0, evidencias.filter(e => e.impacto > 0).length)}`,        badge: 'Leitura inicial' },
                { titulo: 'Ext. naveg.',  valor: navigatedSources.length > 0 ? `${navigatedSources.length} URLs` : '—', badge: navigatedSources.length > 0 ? 'Ativo' : 'Em formação' },
                { titulo: 'Contexto',     valor: conteudosToShow.length > 0 ? `${conteudosToShow.length} arq.` : '—',   badge: conteudosToShow.length > 0 ? 'Recebido' : 'Aguardando' },
                { titulo: 'Feed',         valor: 'Cards ativos',                                                         badge: 'Ver Feed'      },
              ] as { titulo: string; valor: string; badge: string }[]).map(s => (
                <div key={s.titulo} className="flex items-center justify-between gap-2 px-3 py-2 border-t border-neutral-100 dark:border-[#2e2e2e]">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-neutral-700 dark:text-neutral-200 truncate">{s.titulo}</p>
                    <p className="text-[11px] font-bold tabular-nums text-neutral-500 dark:text-neutral-400">{s.valor}</p>
                  </div>
                  <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full border border-neutral-200 dark:border-[#3a3a3a] text-neutral-400 dark:text-neutral-500 whitespace-nowrap flex-shrink-0">{s.badge}</span>
                </div>
              ))}
            </div>

            {/* Centro — círculo */}
            <div className="flex-shrink-0 flex flex-col items-center gap-3 px-5 py-8">
              <BigScoreCircle score={scoreGeral} />
              <span className="text-[13px] font-semibold text-neutral-500 dark:text-neutral-300 tracking-tight">Score OS¹</span>
            </div>

            {/* Direita — Indicadores */}
            <div className="flex flex-col gap-0 flex-1 self-stretch border-l border-neutral-100 dark:border-[#3a3a3a]">
              <p className="text-[8px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 px-3 pt-4 pb-2">Indicadores</p>
              {mock.dimensoes.map(dim => (
                <div key={dim.id} className="flex items-center justify-between gap-2 px-3 py-2 border-t border-neutral-100 dark:border-[#2e2e2e]">
                  <p className="text-[10px] font-semibold text-neutral-700 dark:text-neutral-200 truncate">{dim.label}</p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-16 h-[2px] bg-neutral-100 dark:bg-[#3a3a3a] rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-neutral-400 dark:bg-neutral-500 transition-all duration-700" style={{ width: `${dim.score}%` }} />
                    </div>
                    <span className="text-[11px] font-bold tabular-nums text-neutral-500 dark:text-neutral-400 w-6 text-right">{dim.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Score grid — destaques estilo bio: fontes + Score no centro */}
        <ScoreRevealCard scoreGeral={scoreGeral} cardCls={cardCls} />

        {/* Evolução do Score */}
        <div className={`${cardCls} overflow-hidden`}>
          <div className="px-4 pt-4 pb-3 border-b border-neutral-200 dark:border-[#3a3a3a]">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-neutral-400" strokeWidth={1.8} />
              <h3 className="text-[13px] font-semibold text-neutral-800 dark:text-neutral-100">Evolução do Score</h3>
            </div>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">A evolução acompanha o aumento de fontes, sinais e contextos considerados pelo OS¹.</p>
          </div>

          {/* Timeline vertical */}
          <div className="px-4 py-3">
            {mock.evolucao.map((pt, i) => {
              const isLast = i === mock.evolucao.length - 1;
              return (
                <div key={pt.semana} className="flex gap-3">
                  {/* Coluna da linha + dot */}
                  <div className="flex flex-col items-center w-6 flex-shrink-0">
                    <div className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center mt-0.5 ${
                      isLast
                        ? 'bg-neutral-700 dark:bg-neutral-200 border-neutral-700 dark:border-neutral-200'
                        : 'bg-neutral-100 dark:bg-[#2a2a2a] border-neutral-300 dark:border-[#484848]'
                    }`}>
                      {isLast && <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-[#181818]" />}
                    </div>
                    {!isLast && <div className="w-px flex-1 bg-neutral-200 dark:bg-[#3a3a3a] my-1" />}
                  </div>
                  {/* Conteúdo da linha */}
                  <div className={`flex-1 min-w-0 ${!isLast ? 'pb-3' : ''}`}>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={`text-[12px] font-semibold ${isLast ? 'text-neutral-800 dark:text-neutral-100' : 'text-neutral-500 dark:text-neutral-400'}`}>{pt.semana}</span>
                      <span className={`text-[13px] font-bold tabular-nums ${isLast ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400'}`}>{pt.score}</span>
                    </div>
                    <div className="h-[2px] bg-neutral-100 dark:bg-[#3a3a3a] rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-neutral-500 dark:bg-neutral-400 transition-all duration-700"
                        style={{ width: `${pt.score}%`, opacity: isLast ? 0.9 : 0.4 }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rodapé: variação total */}
          {(() => {
            const d = mock.evolucao[mock.evolucao.length - 1].score - mock.evolucao[0].score;
            return (
              <div className="px-4 pb-4">
                <div className="flex items-center justify-between px-3 py-2 bg-neutral-50 dark:bg-[#252525] border border-neutral-200 dark:border-[#3a3a3a] rounded-xl">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">Variação total</span>
                  <span className="text-[14px] font-black tabular-nums text-neutral-900 dark:text-white">{d >= 0 ? `+${d}` : d}</span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Cards relacionados */}
        {(() => {
          const realInsights = insights && insights.length > 0 ? insights.slice(0, 5) : null;
          const badge = realInsights ? realInsights.length : mock.cardsRelacionados.length;
          return (
            <div className={`${cardCls} p-4`}>
              <SecaoHeader icon={ClipboardList} titulo="Sinais no Feed" badge={badge} />
              <div className="bg-neutral-50 dark:bg-[#252525] border-[0.5px] border-neutral-200 dark:border-[#3a3a3a] rounded-xl p-1.5 space-y-1 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_1px_4px_rgba(0,0,0,0.28),0_1px_2px_rgba(0,0,0,0.2)]">
                {realInsights
                  ? realInsights.map((ins, i) => (
                      <div key={i} className="flex items-start gap-3 px-3 py-2.5 bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] rounded-lg shadow-[0_2px_6px_-1px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_6px_-1px_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.2)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 flex-shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] text-neutral-700 dark:text-neutral-300 leading-snug">{ins.titulo}</p>
                          {ins.dominio && <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5 uppercase tracking-wide">{ins.dominio}</p>}
                        </div>
                        <ArrowRight size={11} className="text-neutral-400 flex-shrink-0 mt-1" />
                      </div>
                    ))
                  : mock.cardsRelacionados.map((c, i) => (
                      <div key={i} className="flex items-center gap-3 px-3 py-2.5 bg-[#f7f8f9] dark:bg-[#2f2f2f] border-[0.5px] border-neutral-200 dark:border-[#3d3d3d] rounded-lg shadow-[0_2px_6px_-1px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_6px_-1px_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.2)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 flex-shrink-0" />
                        <span className="text-[12px] text-neutral-700 dark:text-neutral-300 flex-1 leading-snug">{c}</span>
                        <ArrowRight size={11} className="text-neutral-400 flex-shrink-0" />
                      </div>
                    ))}
              </div>
            </div>
          );
        })()}

        {/* O que está pesando no Score */}
        <div className={`${cardCls} p-4`}>
          <SecaoHeader icon={Zap} titulo="O que está pesando no Score" />
          <div className="bg-neutral-50 dark:bg-[#252525] border-[0.5px] border-neutral-200 dark:border-[#3a3a3a] rounded-xl p-3 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_1px_4px_rgba(0,0,0,0.28),0_1px_2px_rgba(0,0,0,0.2)]">
            <p className="text-[12px] text-neutral-600 dark:text-neutral-400 leading-relaxed">{mock.explicacao}</p>
          </div>
        </div>

        {/* Sobre o Score OS¹ */}
        <div className={`${cardCls} p-4`}>
          <SecaoHeader icon={ShieldCheck} titulo="Sobre o Score OS¹" />
          <div className="bg-neutral-50 dark:bg-[#252525] border-[0.5px] border-neutral-200 dark:border-[#3a3a3a] rounded-xl p-2 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_1px_4px_rgba(0,0,0,0.28),0_1px_2px_rgba(0,0,0,0.2)] grid grid-cols-4 gap-1.5">
            <InfoChip label="Painel de indicadores e reputação da empresa" icon={BarChart2} />
            <InfoChip label="Baseado nos sinais, fontes e contexto disponíveis" icon={FileText} />
            <InfoChip label="Aumenta conforme mais fontes e contextos entram" icon={RefreshCw} />
            <InfoChip label="Leitura inicial — não substitui decisão estratégica" icon={ShieldCheck} />
          </div>
        </div>

        <div className="h-4" />
        </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
