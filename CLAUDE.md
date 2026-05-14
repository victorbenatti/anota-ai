# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Sobre o projeto

**ANOTA-AI** é o dashboard de um sistema de controle financeiro pessoal, parte de um TCC da FATEC. Os dados **não são inseridos pela UI** — eles chegam de um agente de IA no WhatsApp que grava despesas no Supabase. Esta aplicação é puramente de leitura/visualização. Realtime do Supabase escuta INSERTs e atualiza o dashboard.

## Comandos

```bash
npm run dev      # vite dev server (HMR)
npm run build    # tsc -b && vite build
npm run preview  # serve dist/
npx tsc -b       # só typecheck, sem build
```

Não há suíte de testes. Não há linter configurado além do TypeScript estrito (`noUnusedLocals`, `noUnusedParameters`, `strict`).

## Variáveis de ambiente

`.env.local` precisa de:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Se ausentes, `src/lib/supabase.ts` cai num placeholder (`https://placeholder.supabase.co`) pra **não quebrar o import** do app — as queries falham em runtime e o Dashboard mostra um banner "Aviso da redação". Não tente refatorar isso pra throw na inicialização: a UI deve carregar mesmo sem credenciais (decisão consciente pra DX).

## Arquitetura

### Fluxo de dados
1. `useExpenses(range)` consulta `expenses` no Supabase filtrando por `occurred_at` (gte/lte com ISO UTC).
2. `useSupabaseRealtime(onInsert)` assina `postgres_changes` (INSERT) no canal `expenses-realtime`.
3. Quando chega INSERT, `Dashboard` chama `refetch()` em vez de fazer merge manual — mais simples e consistente com o filtro de período.
4. Todos os componentes são puramente apresentacionais: recebem `expenses`/`loading` e calculam o que precisam via `useMemo`. **Nenhuma lógica de negócio fora de hooks.**

### Convenções de dado
- **Dinheiro em centavos** (`amount: 3250` = R$ 32,50). A divisão por 100 acontece só em `formatCurrency()` (`src/lib/utils.ts`) e no eixo Y do `WeeklyTrendChart` (pra ficar legível). Não introduza floats em outros pontos.
- **`occurred_at`** = quando o gasto aconteceu (filtro principal). **`created_at`** = quando o registro foi inserido (não usado pra agregação).
- **Categorias** são um union literal em `src/types/expense.ts`. A fonte única de verdade pra rótulo PT-BR e cor de cada categoria é `CATEGORY_META` no mesmo arquivo — sempre atualizar lá, todo componente lê dali.
- Para adicionar uma categoria nova: estender o union `ExpenseCategory` E adicionar entrada em `CATEGORY_META`. TypeScript pega o resto.

### Schema esperado no Supabase (tabela `expenses`)
`id` (uuid), `amount` (int, centavos), `description` (text), `category` (text, um dos valores de `ExpenseCategory`), `occurred_at` (timestamptz), `created_at` (timestamptz), `raw_message` (text). Realtime precisa estar habilitado pra `expenses` (Database → Replication no painel Supabase).

## Sistema de design — "Editorial Ledger"

Não é shadcn padrão. Direção visual deliberada: livro-razão / revista editorial. Antes de mudar visual, preserve estas escolhas:

- **Fontes**: `Fraunces` (serif variável, eixo `opsz` 9–144) para display/body; `IBM Plex Mono` para números, eyebrows, datas. Carregadas via `<link>` no `index.html`.
- **Paleta** (CSS vars em `src/index.css`): `--paper` (creme), `--ink` (quase preto), `--stamp` (vermelho-carimbo), `--rule` (hairlines). Os tokens shadcn (`--background`, `--foreground`, etc.) mapeiam pra esses.
- **Classes utilitárias custom** definidas em `index.css`:
  - `.eyebrow` — mono, uppercase, tracking largo, usado pra labels
  - `.num` — mono com `tabular-nums`
  - `.display` — Fraunces opsz 96, letter-spacing negativo
  - `.hairline` — `border-color: hsl(var(--rule))`
- **Texturas**: o `body` tem um grão de papel via `background-image` com dois `radial-gradient` pontilhados. Não remover.
- **Recharts overrides** no `@layer components` (eixos, legenda, gridlines tracejadas) padronizam todos os gráficos.
- **Numeração romana de seções** (I, II, III, IV) é parte da metáfora editorial — manter ao adicionar novas seções no `Dashboard.tsx`.
- **Valores monetários** sempre em `text-stamp` (vermelho-tinta) e alinhados à direita com `.num`.

## shadcn/ui

Componentes em `src/components/ui/*` foram escritos manualmente (não via `npx shadcn add`) pra evitar prompts interativos. Style: `new-york`. Se adicionar componentes novos via CLI, vai funcionar — `components.json` está configurado. O `Toaster` usa **sonner** com classes `!important` pra encaixar no tema (sombra dura `4px 4px 0 ink`).

## Aliases

`@/*` → `src/*` (configurado em `tsconfig.app.json` e `vite.config.ts` — manter os dois sincronizados).
