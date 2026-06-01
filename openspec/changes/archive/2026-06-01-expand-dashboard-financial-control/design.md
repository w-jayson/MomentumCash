## Context

O MomentumCash é uma SPA Vue 3 com estado gerenciado via composables reativos (`useTransactions`). O dashboard atual é puramente numérico — três cards com totais acumulados — sem nenhuma visualização gráfica ou projeção temporal. O layout é linear (vertical), sem aproveitamento do espaço horizontal em telas maiores.

Convenções do projeto:
- Composition API com `<script setup>`
- Estado reativo via singleton composable (module-level `reactive`)
- Tailwind CSS 3.4 com tema customizado "Kinetic Dark" (cores neon: cyan, emerald, coral)
- Glass morphism nos cards (`backdrop-blur` + bordas translúcidas)
- Tipografia: Satoshi (display) + JetBrains Mono (valores)
- Sem Pinia, sem vue-router, sem bibliotecas de gráficos

## Goals / Non-Goals

**Goals:**
- Filtrar Receitas e Despesas dos summary cards por mês corrente; Saldo permanece como total acumulado histórico
- Visualizar distribuição de despesas por categoria com gráfico donut (ApexCharts)
- Projetar comprometimento de renda futura com base em parcelas (timeline horizontal)
- Reorganizar layout em grid de duas colunas para seção intermediária

**Non-Goals:**
- Não adicionar vue-router (continua single-page)
- Não migrar estado para Pinia (mantém composable singleton)
- Não alterar a lógica de sync com backend nem o schema de transações
- Não implementar drill-down interativo nos gráficos (o donut é estático)
- Não adicionar filtro de período customizado nos cards (apenas mês atual)

## Decisions

### 1. ApexCharts via `vue3-apexcharts` (não Chart.js, não ECharts)

**Escolha**: `vue3-apexcharts` + `apexcharts` como peer dependency.
**Alternativas consideradas**:
- Chart.js + vue-chartjs: Mais leve, mas exige wrapper manual para cada tipo de gráfico. API menos expressiva para temas dark customizados.
- ECharts + vue-echarts: Muito poderoso, mas bundle pesado (~1MB). Overkill para um donut e um gráfico de barras.
- D3 puro: Controle total, mas exige boilerplate extenso para tooltips, legendas e responsividade.
**Razão**: ApexCharts tem suporte nativo a temas, tooltips ricos e responsividade, com API declarativa. O wrapper `vue3-apexcharts` fornece componente `<apexchart>` com props reativas — alinhado ao padrão Composition API.

### 2. Computed properties no useTransactions (não filtro nos componentes)

**Escolha**: Adicionar `currentMonthIncome` e `currentMonthExpense` como computed properties no `useTransactions.js`. O `balance` existente (total acumulado) permanece inalterado para o card de Saldo.
**Alternativas consideradas**:
- Filtrar nos componentes via computed local: Duplicaria lógica de filtro em AppHeader, ExpenseChart e CommitmentTimeline.
- Criar um composable separado `useDashboard`: Fragmentaria o estado sem ganho real.
**Razão**: Centralizar no `useTransactions` evita duplicação e mantém a reatividade automática. O módulo já é o single source of truth.

### 3. Timeline horizontal como gráfico de barras agrupadas (não linha do tempo CSS pura)

**Escolha**: Reutilizar ApexCharts com gráfico de barras agrupadas (categoria = mês, séries = total parcelas vs renda média).
**Alternativas consideradas**:
- Timeline CSS pura com barras horizontais: Difícil de escalar para muitos meses, sem tooltips, sem responsividade nativa.
- Gráfico de área empilhada: Menos intuitivo para comparação mês a mês.
**Razão**: Barras agrupadas permitem comparação direta "gasto projetado vs renda disponível" por mês, com tooltips informativos. Consistência visual usando a mesma biblioteca.

### 4. CSS Grid no App.vue (não componente wrapper)

**Escolha**: Modificar `App.vue` para usar `grid-template-columns` na seção intermediária (ExpenseChart + CommitmentTimeline lado a lado).
**Alternativas consideradas**:
- Criar `DashboardLayout.vue` wrapper: Adiciona indireção desnecessária para um layout que só existe em uma página.
- Usar Flexbox com `flex-wrap`: Menos controle sobre alturas iguais entre chart e timeline.
**Razão**: CSS Grid garante alinhamento preciso de alturas e distribuição de espaço sem JavaScript. O grid é aplicado diretamente no template de App.vue, mantendo a simplicidade.

### 5. Adição manual da dependência no package.json (sem npm install)

**Escolha**: Instruir o desenvolvedor a adicionar `vue3-apexcharts` e `apexcharts` no `package.json` e rodar `npm install`. NÃO executar comandos de instalação via terminal pois o ambiente é Docker.
**Razão**: O projeto roda em containers. Instalação de dependências deve ser feita pelo desenvolvedor no contexto correto do container.

## Risks / Trade-offs

- **Bundle size**: ApexCharts adiciona ~450KB (gzipped ~120KB). Para um dashboard financeiro com apenas dois gráficos, o custo é aceitável. → Mitigação: Lazy-load dos componentes de gráfico com `defineAsyncComponent` se necessário no futuro.
- **Dependência externa mantida manualmente**: Sem npm install automatizado, o dev precisa garantir que as versões são compatíveis. → Mitigação: Especificar versões exatas no `tasks.md`.
- **Mês corrente sem transações**: Se não houver transações no mês atual, Receitas e Despesas mostrarão R$ 0,00 — pode confundir usuários acostumados com o acumulado. → Mitigação: Adicionar indicador visual "(mês atual)" nos labels de Receitas e Despesas. O Saldo permanece como total acumulado, servindo de referência.
- **Parcelas sem data de vencimento**: As transações parceladas não armazenam data de vencimento individual, apenas quantidade e valor. → Mitigação: Assumir distribuição uniforme a partir do mês da transação (1 parcela por mês).

## Open Questions

- Nenhuma pendência identificada. O design system e as estruturas de dados existentes são suficientes para implementação.
