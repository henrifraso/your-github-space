# OS¹ — by Codify

Plataforma de inteligência de mercado. O lugar onde as empresas existem.

Transforma dado de mercado em direção acionável para o dono do negócio — via app desktop (Electron) e web.

Este repositório é o **frontend** (interface). O backend (API, banco, autenticação) fica no repositório separado `henrifraso/omni`, normalmente clonado em `~/codify/omni`.

---

## Estado atual (visão rápida)

**Já pronto (interface — Fase 1 completa):**
- Feed de cards por empresa/setor, Área de Trabalho, Mapa competitivo, Navegador embutido (Electron)
- Bio da empresa com destaques/medidores, dark mode, múltiplos perfis de demonstração
- Login/autenticação, configuração da empresa, 8 botões de "destrinchar" card
- App desktop empacotável (Electron) além da versão web

**O que falta (o "motor"):**
- A coleta de dados externos ainda é manual/assistida por perfil — não existe ainda um motor automático que busca dado real e gera cards sozinho para qualquer empresa nova
- Alguns blocos (ex. botões de destrinchar, InsightsCard) usam templates locais fixos, não LLM/backend real, em parte dos perfis
- Detalhes de prioridade e status honesto ficam em `QUALIDADE.md` na raiz

**Onde estão as partes principais:**
- `src/App.tsx` — arquivo central da aplicação (tela principal, estado, navegação)
- `src/components/` — componentes de UI reutilizáveis
- `src/features/` — funcionalidades por domínio (feed, workspace, navegador, score...)
- `src/core/` — motor de análise, conectores de fonte, registro de produto/versão
- `src/data/sector-feeds/` — dados de feed por empresa/perfil (McDonald's, Oscar, Pacheco, Combrasil, Cerveja Império...)
- `electron/` — processo principal do app desktop (Electron)
- `COMO_CRIAR_PERFIL.md` — receita passo a passo pra criar um novo perfil de empresa demo

---

## Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Desktop:** Electron
- **Backend:** FastAPI (Railway)
- **Mapas:** Leaflet / React-Leaflet + Google Maps API

---

## Desenvolvimento

```bash
npm install
```

| Script | Descrição |
|---|---|
| `npm run dev` | Web em `localhost:3000` |
| `npm run electron:dev` | Inicia o Vite em modo Electron |
| `npm run electron:start` | Vite + abre o Electron |
| `npm run build` | Build de produção (web) |
| `npm run electron:build` | Build do instalador desktop (DMG / NSIS) |
| `npm run lint` | Checagem de tipos TypeScript |
| `npm run preview` | Serve o build localmente |

---

## Estrutura

```
src/
├── components/   # Componentes de UI reutilizáveis
├── features/     # Funcionalidades por domínio (feed, workspace, mapa…)
├── core/         # Motor de análise, conectores, produto e relações
└── data/         # Feeds, cards e fixtures por setor
```

---

## Licença

Projeto privado e proprietário — © Codify. Todos os direitos reservados.
