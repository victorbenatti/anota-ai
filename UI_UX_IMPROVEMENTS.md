# UI/UX Improvements — Spec

Spec/TDD das melhorias de interface do dashboard do AnotAI. Cada task descreve **o problema**, **a solução proposta** e **critérios de aceite**. Implementação incremental — não precisa fazer tudo de uma vez.

Legenda de status:
- 🟢 **Done** — implementado e validado em build.
- 🟡 **In progress** — código em andamento.
- ⚪ **Todo** — ainda não começado.

---

## 🎯 Alto impacto · baixo esforço

### Task 1 — Hero number maior no topo 🟢 Done

**Problema.** Os 4 cards do `SummaryCards` (Receitas, Despesas, Saldo, Taxa de sobra) têm peso visual idêntico. O usuário não tem uma "primeira leitura" — bate o olho e tudo grita igual.

**Solução.** Repartir em layout assimétrico: **1 card hero grande à esquerda** (saldo do período em tipografia 5xl–6xl com breakdown receitas/despesas) e **3 cards menores empilhados à direita** (Receitas, Despesas, Taxa de sobra). Em mobile vira coluna única.

**Critérios de aceite.**
- Card hero ocupa pelo menos 55% da largura em desktop (>= lg).
- Valor do saldo em fonte tabular num, ≥ 4xl, cor condicional (verde se ≥0, vermelho se <0).
- Breakdown receitas + despesas visível abaixo do saldo, com cores corretas.
- Tipografia dos 3 secundários menor (text-xl) — hierarquia perceptível.
- Layout responsivo: mobile empilha em coluna única.

---

### Task 2 — Filtro contextual perto dos gráficos 🟢 Done

**Problema.** O dropdown de período está só no header. Pra trocar de "Esta semana" pra "Este mês" o usuário precisa rolar até o topo.

**Solução.** Adicionar chips horizontais (`Semana · Mês · 30 dias`) ancorados no header do `WeeklyTrendChart`, sincronizados com o filtro principal. **Nota:** opção "Custom" não implementada por requerer date range picker — fica como parking lot.

**Critérios de aceite.**
- Os chips refletem o estado atual do filtro do header. ✅
- Clicar num chip atualiza o filtro global (estado compartilhado). ✅
- Chip ativo tem cor brand, inativos têm cor surface. ✅
- Em mobile fica horizontal scrollável. ✅

---

### Task 3 — Ícones de transação na lista 🟢 Done

**Problema.** A `TransactionsList` mostra só texto + valor. Visual scan é lento.

**Solução.** Adicionar **ícone circular** à esquerda de cada linha refletindo a categoria. Cores derivadas de `CATEGORY_META`, ícones da lucide-react.

**Critérios de aceite.**
- Cada categoria de despesa e receita tem um ícone mapeado.
- Ícone renderizado como badge circular 40×40, bg em tinta da categoria com alpha baixa, ícone na cor cheia.
- Mapping fonte única em `CATEGORY_META` (campo `icon`).
- Ícones também aparecem no `CategoryChart` (legenda das fatias) — opcional bonus.

---

### Task 4 — Empty states ilustrados ⚪ Todo

**Problema.** Quando o período não tem lançamento, mostra só texto cinza ("Nada para listar"). Sem direção.

**Solução.** Substituir por bloco com SVG/emoji sutil + frase amigável + atalho explícito ("Manda 'gastei 30 no almoço' pelo WhatsApp") com botão de copy do número vinculado.

**Critérios de aceite.**
- Empty state do `TransactionsList` redesenhado.
- Empty state do `CategoryChart` redesenhado.
- Empty state do dashboard inteiro (zero lançamentos no período) com CTA pra primeiro uso.
- Botão "Copiar número" copia o `whatsapp_phone` do profile pro clipboard.

---

### Task 5 — Saldo running no gráfico de barras 🟢 Done

**Problema.** O `WeeklyTrendChart` mostra receita + despesa lado a lado por dia, mas não dá pra ver o saldo evoluindo.

**Solução.** Sobrepor um **`Line`** do recharts em cima das barras com o saldo acumulado dia-a-dia. Usa `ComposedChart` com 2 eixos Y (esquerda = flow diário, direita = saldo acumulado).

**Critérios de aceite.**
- Componente migra de `BarChart` para `ComposedChart`. ✅
- Linha de saldo acumulado em cor brand, com pontos visíveis nos dias. ✅
- Tooltip mostra os 3 valores (receitas, despesas, saldo acumulado). ✅
- Toggle pra esconder/mostrar a linha. ✅
- Eixo Y direito (saldo acumulado) escondido quando linha está oculta. ✅

---

## 💎 Médio esforço · alto wow

### Task 6 — Insights inteligentes 🟢 Done

**Problema.** O dashboard mostra dados crus. Não interpreta nada pelo usuário.

**Solução.** Card no topo do dashboard que mostra 1–3 insights derivados do período + comparação:
- "Top categoria do período: **Alimentação** (32% das despesas)"
- "Você gastou **R$ 42 a mais** com alimentação que no período anterior."
- "Maior despesa: **Aluguel** — R$ 1.500 em 05/05"
- "Dia com mais gastos: **terça-feira (07/05)** — R$ 287"

**Critérios de aceite.**
- Hook `useInsights(transactions, range)` retorna array tipado.
- Componente `InsightsCard` renderiza acima do `MonthComparisonCard`.
- 3 a 4 insights distintos rotacionados ou empilhados.
- Cada insight tem ícone próprio + tone (positivo/alerta/neutro).
- Quando não tem dados suficientes, esconde graciosamente (sem placeholder vazio).

---

### Task 7 — Comparação no gráfico de categorias ⚪ Todo

**Problema.** O `CategoryChart` mostra só o período atual. Não dá pra perceber tendências entre meses.

**Solução.** Dois donuts lado a lado: **Este mês** vs **Mês passado**. Highlight nas categorias que cresceram ≥ 20% ou caíram ≥ 20%.

**Critérios de aceite.**
- Layout side-by-side responsivo (empilha em mobile).
- Indicador delta % por categoria.
- Toggle entre modo "atual" e "comparativo".

---

### Task 8 — Edição inline de lançamento ⚪ Todo

**Problema.** Hoje o usuário só pode deletar via WhatsApp. Não consegue corrigir valores no dashboard.

**Solução.** Clicar numa linha do `TransactionsList` abre um modal/sheet com formulário pra editar `amount`, `description`, `category`, `occurred_at`. Salvar atualiza o Supabase. Botão pra deletar com confirmação.

**Critérios de aceite.**
- Modal com formulário usando shadcn `Dialog` ou drawer.
- Validação (valor > 0, descrição não vazia).
- Realtime ainda funciona (refetch após update).
- Botão de deletar visível dentro do modal.
- Permite trocar entre receita/despesa.

---

### Task 9 — Tagging livre / notas ⚪ Todo

**Problema.** Não tem como adicionar contexto extra a um lançamento ("reembolsável", "viagem SP", "cartão Caju").

**Solução.** Coluna `note: text | null` em `expenses` + campo opcional na modal de edição + suporte do agente pra extrair pós-mensagem ("gastei 30 na padaria // reembolsável").

**Critérios de aceite.**
- Migration adicionando coluna.
- Modal de edição expõe campo de nota.
- Lista mostra nota truncada quando existe.
- Filtro lateral por tags futuras (parking lot).

---

### Task 10 — Pesquisa global (Cmd/Ctrl+K) ⚪ Todo

**Problema.** Pra achar uma transação específica entre dezenas, só rolando.

**Solução.** Command palette acionada por Cmd/Ctrl+K que busca em `description + raw_message + note`. Resultados clicáveis abrem o modal de edição.

**Critérios de aceite.**
- Atalho global registrado (mesmo no input de outro campo? — opcional).
- Busca debounced 200ms.
- Mostra até 10 resultados.
- Highlight do termo no resultado.

---

## 🌈 Polish & detalhes

### Task 11 — CountUp no card de saldo ⚪ Todo

**Problema.** Valor aparece estático.

**Solução.** Animar de 0 até o valor final em ~600ms ao montar/mudar.

**Critérios de aceite.**
- Card hero usa CountUp suave (curva ease-out).
- Respeita `prefers-reduced-motion`.
- Apenas no card hero — não em todos os números (overload visual).

---

### Task 12 — Skeleton com shimmer ⚪ Todo

**Problema.** Skeleton atual é só um retângulo opaco animado.

**Solução.** Adicionar `background-image: linear-gradient` que desliza, dando o "shimmer" clássico.

**Critérios de aceite.**
- Classe `.skeleton-shimmer` ou modifier do componente existente.
- Funciona em ambos os temas (light/dark).
- `prefers-reduced-motion` desativa o slide.

---

### Task 13 — Exportar/imprimir ⚪ Todo

**Problema.** O dashboard não permite levar os dados embora.

**Solução.** Botão "Exportar" no topo do dashboard que oferece **CSV** (período atual) e **PDF** (snapshot HTML → window.print stylized).

**Critérios de aceite.**
- Dropdown com 2 opções.
- CSV inclui todas as colunas relevantes do período.
- PDF tem layout dedicado (`@media print` no CSS) com header de marca.
- Já existe um `ExportDataCard` em Settings — botão no dashboard chama a mesma lógica.

---

### Task 14 — Sidebar lateral em desktop largo ⚪ Todo

**Problema.** A nav top funciona bem em mobile mas em telas grandes desperdiça vertical.

**Solução.** Em viewports ≥ 1280px, transformar nav em **sidebar fixa à esquerda** (240px) com: logo, navegação (Dashboard, Configurações), bloco de status (agente online), ações (theme, logout) no rodapé.

**Critérios de aceite.**
- Layout só ativa em `xl:` breakpoint.
- Mobile e tablet mantêm a nav top atual.
- Estado de rota destacado.

---

### Task 15 — Transição suave do dark mode ⚪ Todo

**Problema.** Toggle atual é snap entre temas. Bate desagradável.

**Solução.** Adicionar `transition` no `body` (background, color) + `view-transition-api` se disponível.

**Critérios de aceite.**
- Transição de 200–300ms.
- Bordas e shadows também transicionam.
- Respeita `prefers-reduced-motion`.

---

## 🏆 Golden bullet pro TCC

### Task 16 — Dashboard adaptativo por uso ⚪ Todo

**Problema.** Usuário novo vê o mesmo layout que usuário com 200 transações. Onboarding zero.

**Solução.** Render condicional baseado em estado do profile/transações:
- **Novo** (sem WhatsApp vinculado) → onboarding em fullscreen com 3 passos.
- **Iniciante** (≤ 5 transações) → dashboard simplificado + dica de "Mande sua próxima despesa".
- **Maduro** (> 5 transações) → dashboard completo.

**Critérios de aceite.**
- Variável de "estado do usuário" derivada de profile + transactions count.
- 3 layouts distintos.
- Sem regressão para usuários atuais.

---

## Princípios gerais (aplicam-se a todas)

- **Sem novas deps** quando der pra fazer com CSS/lib existente.
- **Mobile-first** — todo componente novo testado em 375px primeiro.
- **Sem regressão de tipos** — `npx tsc -b` precisa passar limpo.
- **Sem regressão de tema** — toda mudança visual checada em light e dark.
- **A11y default** — focus rings visíveis, aria labels, contraste 4.5:1+.
