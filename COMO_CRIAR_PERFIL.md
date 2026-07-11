# Como criar um perfil novo no OS¹

Receita testada — baseada na criação do perfil Combrasil. Siga os passos em ordem.

---

## Checklist

### Passo 1 — `src/components/SectorSwitcher.tsx`

**O que faz:** registra o id no sistema de tipos e na lista de perfis.

1. Adicionar o id na union `SectorId` (linha 6).
2. Adicionar entrada em `SECTORS[]`:

```ts
{
  id: 'meu-perfil',
  label: 'Nome da Empresa',   // ← alimenta o nome do topo automaticamente
  niche: 'Setor / Nicho',
  desc: 'Descrição curta da empresa e localização.',
  color: '#hex',
  logo: 'XX',                 // 2 letras para o avatar
  active: false,
},
```

> `label` já é usado pelo App.tsx para exibir o nome no container do topo — não precisa preencher nome em lugar nenhum além daqui.

---

### Passo 2 — `src/core/product/product-registry.ts`

**O que faz:** define a versão do produto (formato, módulos, metadados).

Adicionar entrada em `PRODUCT_VERSION_REGISTRY`:

```ts
{
  id:                  'meu-perfil',
  sectorId:            'meu-perfil',
  feedKey:             'meu-perfil',
  arrowsUnlocked:      false,
  name:                'OS¹ Setor — Descrição do produto',
  badge:               'Vertical Segmentado',        // ou 'Horizontal' etc.
  format:              'vertical',                   // 'horizontal' | 'vertical' | 'hibrida'
  analysisTypes:       ['descritiva', 'comparativa'],// ver os 10 tipos disponíveis
  sourceIds:           [],
  blocksStoreSwitcher: true,
  versionLabel:        'Descrição curta da versão',
},
```

> `realOrgId` e `realUnitId` só quando houver org cadastrada no backend. Omitir enquanto não houver.

**Tipos de análise disponíveis:** `descritiva` · `diagnóstica` · `preditiva` · `prescritiva` · `cognitiva` · `exploratória` · `inferencial` · `comparativa` · `tendencias` · `sentimento`

---

### Passo 3 — `src/features/feed/codify-sector-scope.ts`

**O que faz:** controla se o perfil busca dados no backend ou não.

Adicionar em `SCOPE_MAP`:

```ts
'meu-perfil': null,   // null = sem backend real ainda; não faz fetch
```

---

### Passo 4 — `src/components/ChatPanel.tsx`

**O que faz:** faz o perfil aparecer na troca de perfil dentro da Área de Trabalho.

Adicionar o id em `PROFILE_SWITCHER_IDS` (procurar pela constante no arquivo):

```ts
const PROFILE_SWITCHER_IDS = ['os1', 'mcdonalds', ..., 'meu-perfil'];
```

---

### Passo 5 — `src/mockData.ts`

**O que faz:** fornece os dados do negócio usados em telas que lêem `PROFILE_MOCK_DATA`.

Adicionar entrada em `PROFILE_MOCK_DATA`:

```ts
'meu-perfil': {
  ...MCDONALDS_DATA,           // spread de qualquer base existente
  negocio: {
    ...MCDONALDS_DATA.negocio,
    nome_fantasia: 'Nome da Empresa',
    segmento: 'Setor / Nicho',
    cidade: 'Cidade',
    estado: 'UF',
    telefone: '(xx) xxxx-xxxx',
  },
},
```

---

### Passo 6 — `src/data/sector-feeds/[meu-perfil].ts` (arquivo novo)

**O que faz:** define o feed de cards por área (aba de setores dentro do perfil).

Criar `src/data/sector-feeds/meu-perfil.ts` com a estrutura:

```ts
import type { CompanySectorFeeds } from '../../types';

const C = '#hex'; // cor do perfil

export const MEU_PERFIL_SECTOR_FEEDS: CompanySectorFeeds = {
  marketing: [
    {
      sectionTitle: 'Título da Seção — Placeholder',
      cards: [
        {
          color: C,
          tag: 'AGUARDANDO DADOS',
          title: 'Aqui aparecerá ... gerada pelo motor.',
          detail: 'Placeholder de estrutura.',
          badge: { label: 'Em breve', type: 'info' },
        },
      ],
    },
  ],
  // repetir para cada área necessária
};
```

Depois registrar em **`src/data/sector-feeds/index.ts`**:

```ts
import { MEU_PERFIL_SECTOR_FEEDS } from './meu-perfil';
// ...
'meu-perfil': MEU_PERFIL_SECTOR_FEEDS,
```

---

### Passo 7 — `src/data/demo-feed-cards.ts`

**O que faz:** define os cards do feed principal (aba inicial do perfil).

Adicionar ao final do arquivo:

```ts
DEMO_FEED_CARDS['meu-perfil'] = [
  mkR('mp-1', 'Título do card',
    'Resumo do card.', 'dominio', 'media', 'informacao',
    'Por que importa.', 'Onde afeta.', 'O que fazer.'),
  // mais 4 cards...
];
```

**Molde `mkR()` — 9 argumentos em ordem:**

| # | Arg | Tipo | Valores possíveis |
|---|-----|------|-------------------|
| 1 | `id` | string | slug único, ex: `'mp-1'` |
| 2 | `titulo` | string | título do card |
| 3 | `resumo` | string | corpo principal |
| 4 | `dominio` | string | área temática (`'mercado'`, `'regulatorio'`, etc.) |
| 5 | `urgencia` | U | `'alta'` · `'media'` · `'baixa'` |
| 6 | `tipo` | T | `'alerta'` · `'informacao'` · `'oportunidade'` · `'risco'` |
| 7 | `pq` | string | `por_que_importa` |
| 8 | `onde` | string | `onde_afeta` |
| 9 | `acao` | string | `o_que_fazer` |

> Use `mk()` (7 args, sem `pq` e `onde`) para cards mais simples. `mkR()` é o molde rico, preferido para perfis com módulos verticais.

---

### Passo 8 (opcional) — Loja conectada

Quando o perfil tiver unidades filhas (ex: `'meu-perfil-loja-01'`):

- Repetir **Passos 1, 2, 3 e 4** com o id da loja.
- No `product-registry.ts`, usar `realOrgId` e `realUnitId` quando a loja tiver org no backend.
- O feed da loja pode apontar para o mesmo sector-feed do perfil mãe se o conteúdo for o mesmo.

---

## Notas

- **Cards começam como PLACEHOLDER ÓBVIO.** Todo conteúdo gerado agora é estrutura demonstrativa. O dado real vem quando o motor (Fase 2) estiver conectado. Use `tag: 'AGUARDANDO DADOS'` e título no formato `"Aqui aparecerá ... gerada pelo motor."` para deixar claro.

- **Verificar o build** (`npm run build`) após cada passo para pegar erros de tipo cedo.
