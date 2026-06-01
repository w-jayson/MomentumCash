## ADDED Requirements

### Requirement: useTransactions exposes reactive activePeriod state
O modulo `useTransactions.js` SHALL expor um `ref` reativo chamado `activePeriod` com a estrutura `{ mode: 'current-month' | 'custom', startDate: Date | null, endDate: Date | null }`. O valor default SHALL ser `{ mode: 'current-month', startDate: null, endDate: null }`. A funcao `useTransactions()` SHALL retornar `activePeriod` para que componentes possam le-lo e escreve-lo.

#### Scenario: Default activePeriod is current month
- **WHEN** `useTransactions()` e chamado pela primeira vez
- **THEN** `activePeriod.value.mode` e `'current-month'` e `startDate`/`endDate` sao `null`

#### Scenario: activePeriod is writable by components
- **WHEN** um componente define `activePeriod.value = { mode: 'custom', startDate: new Date('2026-03-01'), endDate: new Date('2026-05-31') }`
- **THEN** todas as computeds que dependem de `activePeriod` recalculam automaticamente

### Requirement: periodIncome computed reflects selected period
O composable SHALL expor uma computed `periodIncome` que soma o `amount` de todas as transacoes com `type === 1` cujo `date` esta dentro do periodo definido por `activePeriod`. Para o modo `current-month`, o intervalo e do primeiro ao ultimo dia do mes atual. Para o modo `custom`, o intervalo e `[startDate, endDate]`.

#### Scenario: periodIncome with current month
- **WHEN** `activePeriod.mode` e `'current-month'`, o mes atual e junho/2026, e ha receitas de R$ 1000 em maio e R$ 2000 em junho
- **THEN** `periodIncome.value` e `2000`

#### Scenario: periodIncome with custom range
- **WHEN** `activePeriod.mode` e `'custom'` com `startDate` 01/01/2026 e `endDate` 31/03/2026, e ha receitas de R$ 500 em janeiro, R$ 300 em fevereiro, e R$ 700 em abril
- **THEN** `periodIncome.value` e `800` (500 + 300)

#### Scenario: periodIncome is zero when no income in period
- **WHEN** o periodo selecionado nao contem nenhuma transacao de receita
- **THEN** `periodIncome.value` e `0`

### Requirement: periodExpense computed respects installment logic within period
O composable SHALL expor uma computed `periodExpense` que soma despesas (`type === 2`) dentro do periodo selecionado. Para transacoes parceladas, SHALL contar apenas o valor da parcela (`installmentValue` ou `amount / installments`) para os meses de parcela que caem dentro do periodo. Para transacoes nao-parceladas, SHALL contar o `amount` integral se o `date` estiver dentro do periodo.

#### Scenario: periodExpense counts non-installment expenses in period
- **WHEN** o periodo e "Mes Atual" (junho/2026) e ha uma despesa nao-parcelada de R$ 200 em junho e outra de R$ 150 em maio
- **THEN** `periodExpense.value` e `200`

#### Scenario: periodExpense counts installment portions in period
- **WHEN** o periodo e "Ultimos 3 meses" (abril a junho/2026) e ha uma despesa parcelada de R$ 1200 em 12x (R$ 100/mes) iniciada em janeiro/2026
- **THEN** `periodExpense.value` inclui R$ 300 referentes as 3 parcelas de abril, maio e junho

#### Scenario: periodExpense is zero when no expenses in period
- **WHEN** o periodo selecionado nao contem nenhuma transacao de despesa
- **THEN** `periodExpense.value` e `0`

### Requirement: periodBalance computed derives from periodIncome and periodExpense
O composable SHALL expor uma computed `periodBalance` definida como `periodIncome - periodExpense`. O valor SHALL ser reativo a mudancas em `activePeriod` e `state.transactions`.

#### Scenario: periodBalance equals income minus expense
- **WHEN** `periodIncome` e 5000 e `periodExpense` e 3200
- **THEN** `periodBalance.value` e `1800`

### Requirement: periodExpensesByCategory groups expenses by category within period
O composable SHALL expor uma computed `periodExpensesByCategory` que retorna um objeto `{ labels: string[], series: number[] }` onde `labels` sao nomes de categorias de despesa e `series` sao os totais de despesa agrupados por categoria dentro do periodo selecionado. Transacoes sem categoria (`categoryId === null`) SHALL ser agrupadas sob o label "Sem categoria". O agrupamento SHALL respeitar a logica de parcelas: apenas parcelas incidentes no periodo contam.

#### Scenario: Categories grouped for current month
- **WHEN** o periodo e o mes atual e ha despesas: R$ 500 em Alimentacao e R$ 300 em Transporte
- **THEN** `periodExpensesByCategory.value` tem `labels: ['Alimentacao', 'Transporte']` e `series: [500, 300]`

#### Scenario: Uncategorized expenses grouped as "Sem categoria"
- **WHEN** ha uma despesa de R$ 200 sem categoria (`categoryId === null`) no periodo
- **THEN** `periodExpensesByCategory.value.labels` inclui "Sem categoria" e `series` inclui 200

#### Scenario: Installment expenses aggregated correctly
- **WHEN** o periodo cobre 3 meses e ha uma despesa parcelada de categoria "Ensino" com parcelas de R$ 100/mes durante esses 3 meses
- **THEN** o total de "Ensino" em `periodExpensesByCategory.value.series` e 300

### Requirement: periodCommitmentProjection computes installment projection from period start
O composable SHALL expor uma computed `periodCommitmentProjection` que projeta as parcelas de despesas futuras a partir do mes inicial do periodo selecionado. A projecao SHALL cobrir 12 meses a partir do inicio do periodo e retornar `{ labels: string[], installmentSeries: number[] }`. A renda media mensal (`averageIncome`) SHALL ser calculada com base nas receitas dos ultimos 3 meses anteriores ao fim do periodo (ou media historica como fallback).

#### Scenario: Projection starts from period start month
- **WHEN** `activePeriod` e "Ultimos 3 meses" (abril a junho/2026) e ha parcelas que comecam em marco/2026
- **THEN** o primeiro mes da projecao e abril/2026 ("Abr/26") e inclui a parcela de marco que ainda esta ativa em abril

#### Scenario: Average income uses months before period end
- **WHEN** o periodo selecionado termina em junho/2026
- **THEN** a renda media mensal e calculada com base nas receitas de abril, maio e junho/2026

### Requirement: Legacy computed properties preserved as aliases
As computeds `currentMonthIncome` e `currentMonthExpense` SHALL continuar disponiveis na API publica de `useTransactions()` como wrappers que internamente usam `periodIncome` e `periodExpense` com periodo fixo no mes atual. As computeds `totalIncome`, `totalExpense` e `balance` SHALL ser mantidas como aliases que usam o periodo "todo o historico" (`mode: 'all'` ou intervalo cobrindo todas as transacoes).

#### Scenario: currentMonthIncome still works for backward compatibility
- **WHEN** um componente chama `currentMonthIncome` do `useTransactions()`
- **THEN** o valor retornado e identico ao que seria obtido com `periodIncome` usando modo `current-month`

#### Scenario: balance still works as all-time total
- **WHEN** um componente chama `balance` do `useTransactions()`
- **THEN** o valor retornado e a soma de todas as receitas de todas as epocas menos todas as despesas de todas as epocas (com logica de parcelas)
