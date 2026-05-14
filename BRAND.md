# BRAND.md — AnotAI

## 1. Essência da Marca

**AnotAI** é um dashboard de controle financeiro pessoal conectado a um agente de IA no WhatsApp.

A proposta visual não deve parecer um dashboard genérico de SaaS ou fintech moderna comum. A identidade do projeto segue a direção **Editorial Ledger**: uma mistura de **livro-razão financeiro, relatório editorial, jornal econômico e dashboard inteligente**.

A interface deve transmitir:

* Clareza financeira
* Controle pessoal
* Confiança
* Inteligência discreta
* Organização
* Sofisticação editorial
* Sensação de relatório financeiro bem diagramado

O AnotAI não deve parecer “mais um app de IA roxo”. Deve parecer uma ferramenta financeira elegante, séria e bem construída.

---

## 2. Direção Visual

Nome da direção:

```txt
Editorial Ledger
```

Descrição:

```txt
Um dashboard financeiro com estética de livro-razão moderno, inspirado em relatórios editoriais, jornais financeiros e sistemas de análise pessoal. Visual limpo, tipografia forte, fundo de papel, linhas finas, números em destaque e uso controlado de cor.
```

A UI deve parecer:

```txt
Editorial, financeira, inteligente, minimalista e confiável.
```

Evitar:

```txt
- Visual genérico de SaaS
- Gradientes pesados
- Roxo padrão de IA
- Cards muito arredondados estilo startup comum
- Sombras suaves demais estilo shadcn padrão
- Excesso de cores nos gráficos
- Estética infantil ou muito “appzinho”
```

Preferir:

```txt
- Fundo creme/papel
- Tipografia editorial
- Linhas finas
- Hierarquia forte
- Valores monetários em destaque
- Números monoespaçados
- Divisões claras por seções
- Gráficos limpos e bem diagramados
```

---

## 3. Paleta Principal

A paleta deve preservar a identidade atual do projeto, baseada em papel, tinta, carimbo e linhas editoriais.

```css
:root {
  --paper: 42 36% 94%;
  --paper-soft: 42 32% 97%;
  --paper-muted: 40 22% 89%;

  --ink: 170 46% 13%;
  --ink-soft: 170 28% 24%;
  --ink-muted: 170 12% 42%;

  --stamp: 2 64% 43%;
  --stamp-soft: 2 58% 52%;
  --stamp-muted: 2 38% 86%;

  --rule: 40 16% 78%;
  --rule-strong: 40 18% 66%;

  --accent: 75 66% 45%;
  --accent-soft: 75 54% 78%;
}
```

---

## 4. Cores em Hexadecimal

Versão prática em HEX para usar no dashboard, Figma ou documentação:

```css
:root {
  --color-paper: #F4EFE3;
  --color-paper-soft: #FAF8F2;
  --color-paper-muted: #E8E0D0;

  --color-ink: #12302B;
  --color-ink-soft: #294B45;
  --color-ink-muted: #667571;

  --color-stamp: #B8332F;
  --color-stamp-soft: #CF4B45;
  --color-stamp-muted: #EFD6D3;

  --color-rule: #D3C8B5;
  --color-rule-strong: #B9AB94;

  --color-accent: #9FBE27;
  --color-accent-soft: #D6E89A;

  --color-white: #FFFFFF;
}
```

---

## 5. Mapeamento de Cores

### Fundo principal

Usar fundo creme/papel.

```css
background: var(--color-paper);
color: var(--color-ink);
```

Uso:

```txt
- Body
- Dashboard geral
- Áreas principais
- Seções editoriais
```

---

### Superfícies

Cards e blocos podem usar papel mais claro.

```css
background: var(--color-paper-soft);
border: 1px solid var(--color-rule);
```

Uso:

```txt
- Cards
- Containers
- Tabelas
- Blocos de gráfico
- Painéis de resumo
```

---

### Tinta principal

O verde petróleo da logo deve aparecer como a cor de texto principal.

```css
color: var(--color-ink);
```

Uso:

```txt
- Títulos
- Labels importantes
- Ícones principais
- Bordas fortes
- Elementos estruturais
```

---

### Vermelho-carimbo

O vermelho-carimbo é uma decisão visual importante do projeto.

```css
color: var(--color-stamp);
```

Uso obrigatório:

```txt
- Valores monetários principais
- Totais
- Métricas financeiras
- Números de impacto
- Destaques de gasto
```

Regra importante:

```txt
Valores monetários sempre devem usar vermelho-carimbo e classe numérica monoespaçada.
```

---

### Verde lima da logo

O verde lima deve ser usado apenas como acento.

```css
color: var(--color-accent);
```

Uso:

```txt
- Status positivo
- Crescimento
- Confirmações
- Pequenos detalhes visuais
- Ícones de sucesso
- Elementos relacionados ao agente de IA
```

Evitar usar o verde lima como cor dominante.

---

## 6. Tipografia

A tipografia é parte central da identidade do projeto.

### Fonte editorial principal

```css
font-family: "Fraunces", serif;
```

Uso:

```txt
- Títulos
- Textos principais
- Blocos editoriais
- Headers de seção
- Cards com linguagem mais humana
```

A fonte **Fraunces** cria a sensação editorial e diferencia o projeto de dashboards comuns.

---

### Fonte monoespaçada

```css
font-family: "IBM Plex Mono", monospace;
```

Uso:

```txt
- Valores numéricos
- Datas
- Eyebrows
- Labels técnicas
- Percentuais
- Eixos de gráfico
- Tabelas financeiras
```

Números devem usar:

```css
font-variant-numeric: tabular-nums;
```

---

## 7. Classes Utilitárias da Marca

Manter e respeitar as classes já existentes no projeto.

### Eyebrow

```css
.eyebrow {
  font-family: "IBM Plex Mono", monospace;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.72rem;
  color: var(--color-ink-muted);
}
```

Uso:

```txt
- Labels de seção
- Pequenos títulos acima de headings
- Marcadores editoriais
```

Exemplo:

```txt
I — RESUMO FINANCEIRO
```

---

### Num

```css
.num {
  font-family: "IBM Plex Mono", monospace;
  font-variant-numeric: tabular-nums;
}
```

Uso:

```txt
- R$ 1.250,00
- 32%
- 14/05/2026
- Quantidades e métricas
```

---

### Display

```css
.display {
  font-family: "Fraunces", serif;
  font-variation-settings: "opsz" 96;
  letter-spacing: -0.04em;
}
```

Uso:

```txt
- Título principal do dashboard
- Valor principal em destaque
- Headlines de relatório
```

---

### Hairline

```css
.hairline {
  border-color: var(--color-rule);
}
```

Uso:

```txt
- Separadores
- Divisórias
- Bordas de cards
- Linhas editoriais
```

---

## 8. Identidade da Logo dentro da UI

A logo do **AnotAI** usa:

```txt
- Verde petróleo
- Verde lima
- Símbolo de conversa
- Elementos financeiros
- Gráfico de crescimento
- Check de confirmação
```

Na interface:

```txt
- “Anot” deve aparecer em verde petróleo.
- “AI” deve aparecer em verde lima.
- Não usar subtítulo abaixo da logo no dashboard.
- Não misturar a logo com efeitos, sombras ou fundos poluídos.
```

Versão textual:

```html
<span class="logo-anot">Anot</span><span class="logo-ai">AI</span>
```

```css
.logo-anot {
  color: var(--color-ink);
  font-weight: 700;
}

.logo-ai {
  color: var(--color-accent);
  font-weight: 700;
}
```

---

## 9. Layout do Dashboard

A estrutura deve lembrar um relatório financeiro editorial.

Regras:

```txt
- Usar seções bem separadas.
- Manter numeração romana: I, II, III, IV.
- Criar hierarquia clara entre seções.
- Priorizar leitura rápida dos dados.
- Usar bastante espaço negativo.
- Evitar excesso de cards genéricos.
- Usar linhas finas como divisórias.
```

Exemplo de estrutura:

```txt
I — Visão Geral
II — Evolução Semanal
III — Categorias
IV — Últimos Lançamentos
V — Insights do Agente
```

A numeração romana faz parte da metáfora editorial e deve ser preservada.

---

## 10. Cards

Cards devem parecer blocos de relatório, não caixinhas genéricas.

```css
.card {
  background: var(--color-paper-soft);
  border: 1px solid var(--color-rule);
  border-radius: 6px;
  box-shadow: 4px 4px 0 var(--color-ink);
  padding: 24px;
}
```

Direção:

```txt
- Menos arredondado
- Mais editorial
- Bordas visíveis
- Sombra dura e sutil
- Aparência de bloco impresso
```

Evitar:

```txt
- border-radius muito grande
- shadow blur muito suave
- glassmorphism
- cards coloridos demais
```

---

## 11. Valores Monetários

Regra central:

```txt
Todo valor monetário importante deve usar vermelho-carimbo e fonte monoespaçada.
```

Exemplo:

```tsx
<p className="num text-stamp text-3xl">
  R$ 1.250,00
</p>
```

Estilo recomendado:

```css
.money {
  font-family: "IBM Plex Mono", monospace;
  font-variant-numeric: tabular-nums;
  color: var(--color-stamp);
  text-align: right;
}
```

Uso:

```txt
- Total gasto
- Saldo
- Média semanal
- Maior despesa
- Valores em tabela
```

---

## 12. Gráficos

Os gráficos devem parecer parte de um relatório editorial.

Direção:

```txt
- Linhas finas
- Grid tracejado
- Poucas cores
- Eixos discretos
- Legendas pequenas em mono
- Sem excesso de preenchimentos coloridos
```

Paleta para gráficos:

```css
:root {
  --chart-primary: #12302B;
  --chart-accent: #9FBE27;
  --chart-expense: #B8332F;
  --chart-muted: #D3C8B5;
  --chart-grid: #D3C8B5;
}
```

Uso:

```txt
- Verde petróleo: dado principal
- Vermelho-carimbo: despesas/valores monetários
- Verde lima: crescimento, positivo ou destaque
- Bege/cinza: grid, linhas auxiliares e contexto
```

Evitar:

```txt
- Gráficos muito coloridos
- Paleta arco-íris
- Gradientes fortes
- Tooltips genéricos sem identidade
```

---

## 13. Tabelas e Listas

Tabelas devem parecer extratos de livro-razão.

```css
.table {
  border-collapse: collapse;
  width: 100%;
}

.table-row {
  border-bottom: 1px solid var(--color-rule);
}

.table-date,
.table-amount {
  font-family: "IBM Plex Mono", monospace;
  font-variant-numeric: tabular-nums;
}

.table-amount {
  color: var(--color-stamp);
  text-align: right;
}
```

Direção:

```txt
- Linhas horizontais finas
- Datas em mono
- Valores alinhados à direita
- Categorias com badges discretas
- Descrições com Fraunces ou texto serifado
```

---

## 14. Badges

Badges devem ser discretas e editoriais.

```css
.badge {
  border: 1px solid var(--color-rule);
  background: transparent;
  color: var(--color-ink-soft);
  font-family: "IBM Plex Mono", monospace;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 11px;
  border-radius: 999px;
  padding: 4px 8px;
}
```

Badge positiva:

```css
.badge-positive {
  border-color: var(--color-accent);
  color: var(--color-ink);
  background: rgba(159, 190, 39, 0.16);
}
```

Badge de alerta:

```css
.badge-warning {
  border-color: var(--color-stamp);
  color: var(--color-stamp);
  background: rgba(184, 51, 47, 0.10);
}
```

---

## 15. Botões

Botões devem manter a estética editorial, com bordas fortes e pouca decoração.

### Botão primário

```css
.button-primary {
  background: var(--color-ink);
  color: var(--color-paper-soft);
  border: 1px solid var(--color-ink);
  border-radius: 4px;
  font-family: "IBM Plex Mono", monospace;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
}
```

### Botão secundário

```css
.button-secondary {
  background: transparent;
  color: var(--color-ink);
  border: 1px solid var(--color-rule-strong);
  border-radius: 4px;
  font-family: "IBM Plex Mono", monospace;
}
```

### Botão de ação positiva

```css
.button-accent {
  background: var(--color-accent);
  color: var(--color-ink);
  border: 1px solid var(--color-ink);
  border-radius: 4px;
  font-family: "IBM Plex Mono", monospace;
  font-weight: 700;
}
```

---

## 16. Inputs e Filtros

Mesmo o dashboard sendo principalmente leitura, filtros de período e controles devem seguir a identidade.

```css
.input {
  background: var(--color-paper-soft);
  color: var(--color-ink);
  border: 1px solid var(--color-rule);
  border-radius: 4px;
  font-family: "IBM Plex Mono", monospace;
}
```

Focus:

```css
.input:focus {
  outline: none;
  border-color: var(--color-ink);
  box-shadow: 3px 3px 0 var(--color-rule);
}
```

---

## 17. Ícones

Biblioteca recomendada:

```txt
lucide-react
```

Ícones adequados:

```txt
MessageCircle
Bot
Wallet
BarChart3
TrendingUp
ReceiptText
CheckCircle
CalendarDays
CreditCard
Newspaper
BookOpen
Landmark
ScrollText
```

Estilo:

```css
.icon {
  stroke-width: 1.75;
  color: var(--color-ink);
}
```

Uso do verde lima:

```txt
Usar apenas em ícones de confirmação, crescimento ou IA ativa.
```

Uso do vermelho-carimbo:

```txt
Usar em ícones ligados a gastos, alertas ou valores financeiros.
```

---

## 18. Textura de Papel

A textura de papel faz parte da identidade e não deve ser removida.

Direção:

```txt
O fundo deve ter um grão sutil, criado por radial-gradients pontilhados. Isso reforça a estética editorial/livro-razão.
```

Exemplo:

```css
body {
  background-color: var(--color-paper);
  background-image:
    radial-gradient(rgba(18, 48, 43, 0.055) 0.6px, transparent 0.6px),
    radial-gradient(rgba(18, 48, 43, 0.035) 0.7px, transparent 0.7px);
  background-size: 18px 18px, 26px 26px;
  background-position: 0 0, 8px 10px;
}
```

---

## 19. Sonner / Toasts

Os toasts devem manter a sombra dura editorial.

```css
.toast {
  background: var(--color-paper-soft);
  color: var(--color-ink);
  border: 1px solid var(--color-ink);
  box-shadow: 4px 4px 0 var(--color-ink);
  border-radius: 4px;
}
```

Direção:

```txt
- Aparência de etiqueta/carimbo
- Sem glassmorphism
- Sem sombra suave padrão
```

---

## 20. Regras de Refatoração da UI

Ao alterar qualquer componente visual, seguir estas regras:

```txt
1. Preservar a direção Editorial Ledger.
2. Não transformar a UI em shadcn padrão.
3. Manter Fraunces e IBM Plex Mono.
4. Manter textura de papel no body.
5. Manter valores monetários em vermelho-carimbo.
6. Manter números usando classe .num.
7. Manter labels pequenas com .eyebrow.
8. Manter numeração romana nas seções.
9. Manter gráficos com gridlines discretas/tracejadas.
10. Evitar floats para dinheiro; valores vêm em centavos.
11. Não adicionar lógica de negócio nos componentes visuais.
12. Componentes devem continuar apresentacionais.
```

---

## 21. Tokens CSS Consolidados

```css
:root {
  /* Brand */
  --color-paper: #F4EFE3;
  --color-paper-soft: #FAF8F2;
  --color-paper-muted: #E8E0D0;

  --color-ink: #12302B;
  --color-ink-soft: #294B45;
  --color-ink-muted: #667571;

  --color-stamp: #B8332F;
  --color-stamp-soft: #CF4B45;
  --color-stamp-muted: #EFD6D3;

  --color-rule: #D3C8B5;
  --color-rule-strong: #B9AB94;

  --color-accent: #9FBE27;
  --color-accent-soft: #D6E89A;

  /* Charts */
  --chart-primary: #12302B;
  --chart-accent: #9FBE27;
  --chart-expense: #B8332F;
  --chart-muted: #D3C8B5;
  --chart-grid: #D3C8B5;

  /* Typography */
  --font-display: "Fraunces", serif;
  --font-body: "Fraunces", serif;
  --font-mono: "IBM Plex Mono", monospace;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-pill: 999px;

  /* Shadows */
  --shadow-editorial-sm: 2px 2px 0 #12302B;
  --shadow-editorial-md: 4px 4px 0 #12302B;
  --shadow-editorial-lg: 6px 6px 0 #12302B;
}
```