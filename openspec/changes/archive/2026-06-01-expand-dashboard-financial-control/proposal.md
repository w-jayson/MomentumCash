## Why

O dashboard atual do MomentumCash é exclusivamente numérico — três cards com totais acumulados usando contadores animados. Não há visualização temporal, projeção de gastos futuros, nem análise de distribuição de despesas. O usuário não consegue responder perguntas básicas como "quanto gastei esse mês?" ou "até quando meu salário está comprometido?". O layout é puramente vertical (cards → formulário → tabela), desperdiçando espaço horizontal em resoluções maiores.

## What Changes

- **Filtro de mês atual nos Summary Cards**: Refatorar `totalIncome` e `totalExpense` no `useTransactions` para oferecer variantes filtradas por mês corrente nos cards de Receitas e Despesas. O card de Saldo permanece como total acumulado histórico (sem filtro de mês).
- **Gráfico de distribuição de despesas por categoria**: Novo componente `ExpenseChart` usando `vue3-apexcharts` (donut chart) para visualizar percentual de gastos por categoria no mês atual. Estilização alinhada ao tema dark com cores neon.
- **Timeline de renda comprometida**: Novo componente `CommitmentTimeline` que projeta mês a mês o volume de parcelas futuras contra a renda média mensal, mostrando visualmente até quando a renda está comprometida.
- **Reorganização do layout com CSS Grid**: Grid de duas colunas na seção intermediária (gráfico de categorias + timeline lado a lado), cards otimizados, seção de histórico mantida como full-width abaixo.

## Capabilities

### New Capabilities
- `dashboard-month-filter`: Exibição dos totais financeiros filtrados por mês corrente nos Summary Cards, com fallback para o total acumulado quando não houver transações no mês.
- `expense-category-chart`: Gráfico donut com distribuição percentual de despesas por categoria dentro do mês atual, usando ApexCharts com tema dark customizado.
- `commitment-timeline`: Projeção visual de despesas parceladas futuras (linha do tempo horizontal ou barras empilhadas), comparando o total de parcelas por mês com a renda média mensal.
- `dashboard-grid-layout`: Reorganização do layout do dashboard usando CSS Grid com distribuição em duas colunas na região central (chart + timeline) e full-width nas demais seções.

### Modified Capabilities
- `vue-frontend`: Os Summary Cards (`SummaryCard.vue`) e o composable `useTransactions.js` serão modificados para suportar filtro por mês. `AppHeader.vue` e `App.vue` terão ajustes de layout.

## Impact

- **Affected code**: `frontend/src/App.vue` (layout grid), `frontend/src/components/AppHeader.vue` (cards com mês atual), `frontend/src/composables/useTransactions.js` (novas computed properties filtradas por mês)
- **New files**: `frontend/src/components/ExpenseChart.vue`, `frontend/src/components/CommitmentTimeline.vue`
- **New dependency**: `vue3-apexcharts` (depende de `apexcharts` como peer)
- **Breaking**: Nenhum. As mudanças são incrementais — os cards acumulados podem coexistir como fallback.
