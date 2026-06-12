// useOS1BrowserBridge — ponte do Navegador OS¹.
//
// Escuta `OS1_EVENTS.BROWSER_ACTION` e roteia cada uma das 10 ações:
//   send-to-workspace, create-mission, save-evidence, generate-feed-card,
//   analyze-session, compare-tabs, monitor-page, capture-snippet,
//   create-dossier, ask-sector-agent.
//
// As ações silenciosas (`save-evidence`, `monitor-page`, `capture-snippet`,
// `create-dossier`) já persistem em localStorage no próprio BrowserView;
// aqui não fazemos nada com elas.
//
// Conteúdo extraído de src/App.tsx (Fase 17) — sem alteração de
// comportamento. Mesmas closures, mesmo dep array (`[activeSector]`),
// mesmos cases, mesmas mensagens, mesmo `setBrowserOpen(false)` no fim
// das ações que enviam para a Área de Trabalho.

import { useEffect } from 'react';
import { OS1_EVENTS } from './os1-events';
import type { IntelligenceCard, WorkspaceIntent } from '../types/card';
import type { RoleFeedCard } from '../../config/roleConfig';
import {
  browserPayloadToFeedCard,
  type BrowserGeneratedPayload,
} from '../../features/feed/feed-generated-cards';
import { analyzePageContext, saveEvidence } from '../../features/browser/actions/browser-actions.builders';

interface UseOS1BrowserBridgeArgs {
  activeSector: string;
  /** Mesma assinatura de `openWorkspaceFromCard` do App.tsx. */
  onWorkspaceCard: (card: IntelligenceCard, intent: WorkspaceIntent) => void;
  /** Adiciona um card no TOPO da lista de cards gerados pelo navegador. */
  onBrowserCard: (card: RoleFeedCard) => void;
  /** Fecha o overlay do BrowserView (= `setBrowserOpen(false)`). */
  closeBrowser: () => void;
}

export function useOS1BrowserBridge({
  activeSector, onWorkspaceCard, onBrowserCard, closeBrowser,
}: UseOS1BrowserBridgeArgs): void {
  useEffect(() => {
    function handler(e: Event) {
      const ce = e as CustomEvent<{
        type: 'send-to-workspace' | 'create-mission' | 'save-evidence' | 'generate-feed-card' | 'analyze-session'
            | 'compare-tabs' | 'monitor-page' | 'capture-snippet' | 'create-dossier' | 'ask-sector-agent';
        context: { url: string; title: string; capturedText?: string; capturedAt: string };
        payload?: any;
      }>;
      const d = ce.detail;
      if (!d) return;
      const sector = activeSector || 'os1';
      const fechaUrl = d.context.url;
      const synthBase = {
        id: `synth-browser-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        confianca: 'media' as const,
        confianca_score: 0.5,
        impacto: 'a avaliar',
        risco_erro: 0.4,
        _synthetic: true as const,
      };
      if (d.type === 'send-to-workspace') {
        const a = analyzePageContext({ url: fechaUrl, title: d.context.title, capturedText: d.context.capturedText });

        // Evidência vinculada (Etapa 8): registra que o conteúdo foi
        // levado pra Área de Trabalho. Faz dedupe automático se já
        // existir mesma URL+action sem snippet.
        saveEvidence(
          { url: fechaUrl, title: d.context.title, capturedText: d.context.capturedText, capturedAt: d.context.capturedAt || new Date().toISOString(), origin: 'navegador' },
          { sector, action: 'send-to-workspace', usedInWorkspace: true, evidenceLabel: 'Análise enviada para Área de Trabalho' }
        );

        // Sinal identificado: primeira observação factual
        const sinal = a.signals[0] || (d.context.capturedText ? 'Conteúdo capturado da página atual.' : 'Página revisada sem texto capturado.');

        // Etapa 14: título contextual por tipo — mais específico que
        // o genérico "Análise da página".
        const tituloMap: Record<string, string> = {
          'regulatório': 'Análise regulatória da página',
          'preço':       'Sinal de preço identificado',
          'concorrente': 'Sinal competitivo identificado',
          'fornecedor':  'Fornecedor para análise',
          'notícia':     'Análise da notícia',
          'rede-social': 'Sinal reputacional capturado',
          'pesquisa':    'Achado de pesquisa para aprofundar',
          'genérico':    'Análise da página',
        };

        // Por que importa: contextualizado por tipo + setor
        const porQueMap: Record<string, string> = {
          'regulatório': `Afeta conformidade do setor ${sector}. Avaliar prazos e adequação antes da próxima decisão.`,
          'preço':       `Pode impactar margem ou posicionamento comercial em ${sector}. Compare antes de reagir.`,
          'concorrente': `Sinaliza movimento competitivo relevante para ${sector}. Dimensione resposta proporcional ao risco.`,
          'fornecedor':  `Pode reduzir custo ou prazo na cadeia de ${sector}. Validar capacidade antes de pilotar.`,
          'notícia':     `Pode repercutir em clientes ou mercado de ${sector}. Avaliar necessidade de comunicação.`,
          'rede-social': `Possível sinal de reputação ou tendência relevante a ${sector}. Capturar e decidir resposta.`,
          'pesquisa':    `Achado em curso — aprofundar com fontes complementares antes de consolidar.`,
          'genérico':    `Avaliar se afeta operação, comunicação ou estratégia de ${sector}.`,
        };
        const porQue = porQueMap[a.pageType];

        // Próximos passos: contextualizados
        const passosMap: Record<string, string> = {
          'regulatório': 'Identificar a norma e prazo de vigência · Mapear processos afetados · Definir plano de adequação com responsável',
          'preço':       'Comparar com oferta atual · Decidir resposta comercial · Medir impacto em 7 dias',
          'concorrente': 'Resumir o movimento em uma frase · Avaliar alcance e janela de tempo · Definir resposta competitiva',
          'fornecedor':  'Validar capacidade e termos · Cotar substituição parcial · Decidir teste piloto',
          'notícia':     'Extrair fato principal · Avaliar repercussão para o setor · Decidir comunicação interna ou externa',
          'rede-social': 'Capturar sinal e contexto · Avaliar tom e alcance · Decidir resposta ou monitoramento',
          'pesquisa':    'Listar 3 fontes complementares · Validar achado central · Consolidar conclusão',
          'genérico':    'Identificar fato principal · Cruzar com dados internos · Decidir próxima ação',
        };

        const card: IntelligenceCard = {
          ...synthBase,
          titulo: tituloMap[a.pageType],
          resumo: `${sinal}${a.hostname ? ` · Origem: ${a.hostname}` : ''}.`,
          por_que_importa: porQue,
          onde_afeta: sector,
          o_que_fazer: passosMap[a.pageType],
          dominio: 'análise externa',
          area: a.pageType === 'genérico' ? 'análise externa' : a.pageType,
          urgencia: a.urgencyHint,
          tipo_card: a.pageType === 'regulatório' ? 'alerta' : 'informacao',
        };
        onWorkspaceCard(card, 'utilizar');
        closeBrowser();
        return;
      }
      if (d.type === 'create-mission') {
        const m = d.payload;
        // Por que importa: contexto + responsável + prazo. Evita "Evidência: <url>" cru.
        const porQue = [
          m?.objetivo ? m.objetivo : null,
          m?.responsavelSugerido ? `Responsável sugerido: ${m.responsavelSugerido}` : null,
          m?.prazoSugerido ? `Prazo: ${m.prazoSugerido}` : null,
          d.context.title ? `Evidência: ${d.context.title}` : `Origem: ${fechaUrl}`,
        ].filter(Boolean).join(' · ');
        // C1-A: novos cards gerados localmente usam 'rascunho' como tipo
        // canônico (em vez do legado 'missao'). Cards persistidos antes da
        // renomeação continuam sendo lidos pelo type union que aceita ambos.
        // C1-B: 'area' e 'dominio' representam o DOMÍNIO/área do conteúdo
        // (análise externa, comercial, etc.) — não o formato da ação nem o
        // ID visual do sector. 'análise externa' é o domínio neutro seguro
        // para cards gerados pelo browser, evitando que slugs de entidade
        // ('nike', 'mcdonalds') virem frases tipo "indicador de nike".
        const card: IntelligenceCard = {
          ...synthBase,
          titulo: m?.titulo ?? 'Plano da página',
          resumo: m?.objetivo ?? 'Plano operacional gerado da página atual.',
          por_que_importa: porQue,
          onde_afeta: sector,
          o_que_fazer: (m?.etapas ?? []).join(' · ') + (m?.criterioConclusao ? ` · Critério de conclusão: ${m.criterioConclusao}` : ''),
          dominio: 'análise externa',
          area: 'análise externa',
          urgencia: 'media',
          tipo_card: 'rascunho',
        };
        onWorkspaceCard(card, 'utilizar');
        closeBrowser();
        return;
      }
      if (d.type === 'analyze-session') {
        const r = d.payload;
        // Estrutura premium: padrões percebidos + riscos + o que merece ação.
        const padroes = (r?.sinaisDetectados ?? []).slice(0, 3).join(' · ');
        const riscosTxt = (r?.riscos ?? []).length > 0 ? ` · Riscos: ${(r.riscos ?? []).join(' · ')}` : '';
        const merecemAcaoTxt = (r?.oportunidades ?? []).length > 0
          ? `Merecem ação: ${(r.oportunidades ?? []).join(' · ')}`
          : '';
        const card: IntelligenceCard = {
          ...synthBase,
          titulo: 'Relatório da sessão de navegação',
          resumo: r?.resumo ?? 'Resumo da sessão atual.',
          por_que_importa: `${padroes}${riscosTxt}${merecemAcaoTxt ? ` · ${merecemAcaoTxt}` : ''}`,
          onde_afeta: sector,
          o_que_fazer: (r?.proximosPassos ?? []).join(' · '),
          dominio: 'análise externa',
          area: 'relatorio-sessao',
          urgencia: (r?.riscos ?? []).length > 0 ? 'media' : 'baixa',
          tipo_card: 'informacao',
        };
        onWorkspaceCard(card, 'utilizar');
        closeBrowser();
        return;
      }
      if (d.type === 'generate-feed-card') {
        const newCard = browserPayloadToFeedCard(d.payload as BrowserGeneratedPayload | undefined, sector);
        onBrowserCard(newCard);
        return;
      }
      // 'save-evidence', 'monitor-page', 'capture-snippet': já persistem em
      // localStorage no próprio BrowserView; aqui são silenciosos.

      // 'create-dossier' deixou de ser silencioso: agora abre a Área de
      // Trabalho com a síntese mínima do dossiê (tema central, pontos
      // críticos, pendências, próximos passos). O payload é a
      // DossierSynthesis montada no BrowserView.
      if (d.type === 'create-dossier') {
        const syn = d.payload;
        if (!syn?.dossier) return; // fallback: sem síntese, não abre workspace
        // Por que importa: pontos críticos + pendências (não só lista).
        const pontos = (syn.pontosCriticos ?? []).slice(0, 3).join(' · ');
        const pendenciasTxt = (syn.pendencias ?? []).length > 0
          ? ` · Pendências: ${(syn.pendencias ?? []).slice(0, 2).join(' · ')}`
          : '';
        const card: IntelligenceCard = {
          ...synthBase,
          id: `synth-browser-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          titulo: `Síntese de dossiê: ${syn.dossier.nome}`,
          resumo: `${syn.temaCentral ?? ''}${syn.dossier.pages?.length ? ` · ${syn.dossier.pages.length} página(s) incluída(s).` : ''}`,
          por_que_importa: `${pontos}${pendenciasTxt}`,
          onde_afeta: sector,
          o_que_fazer: (syn.proximosPassos ?? []).join(' · '),
          dominio: 'análise externa',
          area: 'dossie',
          urgencia: 'baixa',
          tipo_card: 'informacao',
        };
        onWorkspaceCard(card, 'utilizar');
        closeBrowser();
        return;
      }

      // Comparar páginas recentes (renomeado de "Comparar abas abertas" —
      // não comparamos abas reais; comparamos as últimas N visitas).
      if (d.type === 'compare-tabs') {
        const cmp = d.payload;
        // Por que importa: lista as diferenças + riscos. Inclui melhor opção destacada.
        const diferencas = (cmp?.diferencas ?? []).slice(0, 3).join(' · ');
        const riscosTxt = (cmp?.riscos ?? []).length > 0 ? ` · Atenção: ${(cmp?.riscos ?? []).slice(0, 2).join(' · ')}` : '';
        const melhor = cmp?.melhorOpcao ? ` · Merece ação primeiro: ${cmp.melhorOpcao}` : '';
        const card: IntelligenceCard = {
          ...synthBase,
          id: `synth-browser-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          titulo: 'Análise de páginas recentes',
          resumo: cmp?.resumo ?? 'Análise das páginas recentes da sessão.',
          por_que_importa: `${diferencas}${riscosTxt}${melhor}`,
          onde_afeta: sector,
          o_que_fazer: cmp?.recomendacao ?? '',
          dominio: 'análise externa',
          area: 'comparacao',
          urgencia: 'baixa',
          tipo_card: 'informacao',
        };
        onWorkspaceCard(card, 'utilizar');
        closeBrowser();
        return;
      }
      // Leitura contextual preliminar por setor (renomeado de "Perguntar
      // ao agente do setor" — não chamamos IA; é leitura heurística
      // anotada com o ponto de vista do setor).
      if (d.type === 'ask-sector-agent') {
        const a = d.payload;
        const aviso = '⚠ Leitura preliminar (heurística) — não é resposta de IA. Confirme antes de transformar em decisão.';
        const card: IntelligenceCard = {
          ...synthBase,
          id: `synth-browser-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          titulo: `Leitura preliminar — ${sector}`,
          resumo: a?.analise ?? '',
          por_que_importa: `${aviso} · ${(a?.observacoes ?? []).join(' · ')}`,
          onde_afeta: sector,
          o_que_fazer: (a?.proximosPassos ?? []).join(' · '),
          dominio: 'análise externa',
          area: 'leitura-setor',
          urgencia: 'baixa',
          tipo_card: 'informacao',
        };
        onWorkspaceCard(card, 'utilizar');
        closeBrowser();
        return;
      }
    }
    window.addEventListener(OS1_EVENTS.BROWSER_ACTION, handler as EventListener);
    return () => window.removeEventListener(OS1_EVENTS.BROWSER_ACTION, handler as EventListener);
  }, [activeSector]); // eslint-disable-line react-hooks/exhaustive-deps
}
