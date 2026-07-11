# OS¹ — by Codify

Plataforma de inteligência de mercado. O lugar onde as empresas existem.

Transforma dado de mercado em direção acionável para o dono do negócio — via app desktop (Electron) e web.

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
