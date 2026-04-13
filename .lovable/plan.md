

## Plano de Refinamento Visual — Omni

### Resumo
Ajustes puramente estéticos em todos os componentes visuais, mantendo 100% da lógica, estrutura e fluxo de dados intactos. O objetivo é atingir um padrão visual Linear/Vercel em dark mode.

---

### 1. Paleta de Cores e Fundo Global
**Arquivo:** `src/index.css`, `src/App.tsx`

- Fundo global: `#f0f2f5` → `#fafafa` (light), `#0d0d0d` → `#0a0a0a` (dark)
- Containers/cards: `#1c1c1c` / `#2a2a2a` → `#161616` (dark)
- Borders: `#dbdbdb` / `#333` → `#262626` (dark), `#e5e7eb` (light)
- Accent azul único: `#0095f6` → `#3b82f6` apenas em elementos de ação
- Navbar dark: `#2a2a2a` → `#111111`
- Subcards internos (`bg-[#f7f7f7]` / `bg-[#252525]`): `#1a1a1a` (dark)

### 2. Espaçamento e Respiração
**Arquivos:** `src/App.tsx`, `FeedComponents.tsx`, `BottomModal.tsx`

- Cards: `px-5 py-4` → `px-6 py-5`
- Gap entre cards no feed: `space-y-6` (já OK), garantir `gap-4` mínimo em grids
- Padding do feed container: `px-4` → `px-5`
- Modais: `p-6` → `p-6` (manter, já OK)
- Seções do perfil: `mb-6` → `mb-8`

### 3. Hierarquia Tipográfica
**Arquivos:** `FeedComponents.tsx`, `App.tsx`

- Títulos de seção (`FeedSection`): `text-sm font-bold` → `text-lg font-semibold`
- Subtítulos de cards: `text-sm font-semibold` → `text-base font-medium`
- Corpo: manter `text-sm`
- Meta/labels: `text-[10px]` → `text-xs text-neutral-500`
- Valores numéricos grandes: `font-bold` com contraste claro

### 4. Cantos Arredondados Consistentes
**Todos os componentes**

- Cards: `rounded-2xl` consistente (alguns já são, uniformizar)
- Botões (Plano/Estratégia/Prática): `rounded-lg` → `rounded-xl`
- Navbar: sem arredondamento (sticky top, está OK)
- Modais: já `rounded-2xl`, manter
- Ícones de seção `FeedSection`: `rounded-full` (já OK)

### 5. Eliminar Container-dentro-de-Container
**Arquivo:** `src/App.tsx` (modais Plano, Evolução, Estratégia, Prática)

- Remover subcards com `bg-[#f7f7f7] dark:bg-[#252525] rounded-xl border` que estão dentro de modais
- Conteúdo fica direto no modal, separado por `border-b` sutil ou espaço
- Exemplos: Modal Evolução (bloco de nível), Modal Estratégia (bloco de posição), Modal Prática (cards de prática)

### 6. Microinterações e Hover
**Arquivos:** `FeedComponents.tsx`, `App.tsx`, `TimelineComponents.tsx`

- Todos os clicáveis: `transition-all duration-200 hover:bg-neutral-800/50` (dark)
- Cards do feed: adicionar `hover:bg-[#f7f7f7] dark:hover:bg-[#1a1a1a]` com `transition-all duration-200`
- `cursor-pointer` em todos os elementos clicáveis
- Botões da navbar: já tem hover, refinar para `hover:bg-white/5` (dark)

### 7. Animações de Entrada com Stagger
**Arquivo:** `src/App.tsx` (seção de feed)

- Wrap das `FeedCard` em `motion.div` com `staggerChildren: 0.05`
- Cada card: `initial={{ opacity: 0, y: 10 }}` → `animate={{ opacity: 1, y: 0 }}`
- Transição: `duration: 0.3, ease: 'easeOut'`

### 8. Ícones Lucide Consistentes
**Arquivos:** `FeedComponents.tsx`, `App.tsx`

- Ícones em botões de ação: padronizar `size={20}`
- Ícones inline com texto: padronizar `size={16}`
- Ícones de seção `FeedSection`: `size={15}` → `size={18}`

### 9. Skeleton Screens e Empty States
**Novo:** Adicionar esqueletos para carregamento e estados vazios

- Skeleton genérico: div com `animate-pulse bg-neutral-800/50 rounded-xl` nos tamanhos dos cards
- Empty state: ícone Lucide grande (size 48) + texto `text-neutral-500` centralizado
- Aplicar em: seções de feed quando `data` arrays estão vazios, modal Salvos (já tem empty state, refinar visual)

### 10. Correção de Build Errors
**Arquivos:** `tsconfig.json` ou `vite.config.ts`

- Resolver erro de CSS import (`leaflet/dist/leaflet.css` e `./index.css`) — provavelmente falta o plugin `@vitejs/plugin-react` que foi removido no último diff. Restaurar dependências necessárias.

---

### Arquivos Modificados

| Arquivo | Tipo de mudança |
|---------|----------------|
| `src/index.css` | Cores globais |
| `src/App.tsx` | Espaçamento, cores, cantos, stagger, hover, eliminar subcards em modais |
| `src/components/FeedComponents.tsx` | Tipografia, espaçamento, hover, ícones |
| `src/components/BottomModal.tsx` | Cores de fundo |
| `src/components/CircleProgress.tsx` | Cores de track |
| `src/components/TimelineComponents.tsx` | Cores, hover |
| `src/components/ConcorrenteModal.tsx` | Cores de fundo |
| `src/components/GridItem.tsx` | Cantos, cores |
| `src/components/StoryViewer.tsx` | Sem mudanças (já clean) |
| `package.json` / `vite.config.ts` | Restaurar plugin react |

---

### O que NÃO será alterado
- Nenhum tipo em `types.ts`
- Nenhuma lógica em `mockData.ts`
- Nenhum fluxo de dados ou `window.__OMNI_DATA__`
- Nenhuma ação de botão (Utilizar, Perguntas, Ideias, Compartilhar)
- Nenhuma estrutura de componente ou navegação
- As 7 seções principais permanecem idênticas

