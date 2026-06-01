## MODIFIED Requirements

### Requirement: Expense donut chart renders with ApexCharts using selected period
O componente `ExpenseChart` SHALL renderizar um grafico do tipo donut usando `vue3-apexcharts` que mostra a distribuicao percentual das despesas por categoria dentro do periodo selecionado (nao mais fixo no mes atual). O componente SHALL consumir a computed `periodExpensesByCategory` do `useTransactions()` em vez de calcular internamente com `new Date()`.

#### Scenario: Chart displays expense categories for selected period
- **WHEN** o periodo selecionado e "Ultimos 3 meses" e ha despesas: R$ 500,00 na categoria "Alimentacao" e R$ 300,00 na categoria "Transporte"
- **THEN** o donut exibe dois segmentos com os labels "Alimentacao" (62.5%) e "Transporte" (37.5%)

#### Scenario: Chart updates when period changes
- **WHEN** o usuario altera o periodo de "Mes Atual" para "Ultimos 6 meses"
- **THEN** o grafico donut atualiza automaticamente com os dados do novo periodo

#### Scenario: Chart shows empty state when no expenses in period
- **WHEN** nao ha despesas no periodo selecionado
- **THEN** o grafico exibe uma mensagem de placeholder "Sem despesas no periodo" ou estado visual vazio equivalente

#### Scenario: Chart shows empty state when no categories match
- **WHEN** ha despesas mas nenhuma possui categoria associada (categoryId = null)
- **THEN** o grafico agrupa todas como "Sem categoria" em um unico segmento

### Requirement: Chart data is computed from useTransactions periodExpensesByCategory
O `ExpenseChart` SHALL consumir a computed `periodExpensesByCategory` de `useTransactions()`, que ja retorna `{ labels, series }` agrupados por categoria para o periodo ativo. Nao SHALL mais conter logica propria de filtro de data ou agrupamento. Nao SHALL fazer chamadas HTTP diretas nem acessar localStorage.

#### Scenario: Chart reacts to new expense transaction
- **WHEN** o usuario cria uma despesa com data dentro do periodo ativo
- **THEN** o donut atualiza automaticamente com o novo segmento ou segmento expandido

#### Scenario: Chart reacts to period change
- **WHEN** o usuario muda o periodo via PeriodSelector
- **THEN** o donut recalcula e re-renderiza com os dados do novo intervalo
