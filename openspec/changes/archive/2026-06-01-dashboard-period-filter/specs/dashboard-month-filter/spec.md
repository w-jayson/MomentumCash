## MODIFIED Requirements

### Requirement: Income and Expense cards display totals for selected period
Os cards de Receitas e Despesas no `AppHeader` SHALL exibir totais filtrados pelo periodo selecionado no `PeriodSelector` (nao mais fixo no mes atual). O card de Saldo SHALL exibir o saldo do periodo selecionado. O `useTransactions` composable SHALL expor as computed properties `periodIncome`, `periodExpense` e `periodBalance` que filtram transacoes conforme o `activePeriod`.

#### Scenario: Income card shows period income
- **WHEN** o periodo selecionado e "Mes Atual" (junho/2026) e ha transacoes de receita de R$ 1000,00 em maio/2026 e R$ 500,00 em junho/2026
- **THEN** o card "Receitas" exibe R$ 500,00

#### Scenario: Expense card shows period expenses
- **WHEN** o periodo selecionado e "Ultimos 3 meses" (abril a junho/2026) e ha despesas de R$ 300,00 em marco, R$ 150,00 em abril, e R$ 200,00 em maio
- **THEN** o card "Despesas" exibe R$ 350,00 (apenas abril + maio; junho sem despesas no cenario)

#### Scenario: Balance card reflects period balance
- **WHEN** o periodo selecionado e "Mes Atual", com receitas de R$ 2000,00 e despesas de R$ 800,00 no mes atual, e transacoes de meses anteriores totalizando receitas de R$ 5000,00 e despesas de R$ 2000,00
- **THEN** o card "Saldo" exibe R$ 1200,00 (2000 - 800, apenas periodo atual), o card "Receitas" exibe R$ 2000,00 e o card "Despesas" exibe R$ 800,00

#### Scenario: Empty period shows zero for all cards
- **WHEN** o periodo selecionado e um intervalo customizado sem transacoes, mas ha transacoes em meses fora do intervalo
- **THEN** todos os cards (Saldo, Receitas, Despesas) exibem R$ 0,00

#### Scenario: Cards recalculate reactively on period change
- **WHEN** o usuario altera o periodo de "Mes Atual" para "Ultimos 3 meses"
- **THEN** os tres cards atualizam imediatamente com os totais do novo periodo

### Requirement: Card labels indicate active period context
Os labels dos cards SHALL indicar dinamicamente o periodo ativo. Quando o periodo e "Mes Atual", os labels de Receitas e Despesas SHALL exibir "(mes atual)" como sublabel. Quando o periodo e customizado ou predefinido, o sublabel SHALL refletir o periodo (ex: "(ultimos 3 meses)", "(01/03 - 31/05)"). O card de Saldo SHALL exibir o sublabel do periodo ativo em vez de permanecer sem indicacao.

#### Scenario: Current month indicator preserved
- **WHEN** o periodo selecionado e "Mes Atual"
- **THEN** os cards "Receitas" e "Despesas" exibem o indicador "(mes atual)" e o card "Saldo" exibe "(mes atual)"

#### Scenario: Custom period indicator shown
- **WHEN** o periodo selecionado e "Ultimos 6 meses"
- **THEN** os sublabels dos tres cards exibem "(ultimos 6 meses)"

### Requirement: useTransactions exposes period-aware computed properties
O modulo `useTransactions.js` SHALL definir e exportar as computed properties reativas `periodIncome`, `periodExpense` e `periodBalance`. As computacoes SHALL usar `activePeriod` (ref reativo) para determinar o intervalo de datas e filtrar `state.transactions` com base no campo `date` (ISO 8601) e na logica de parcelamento. As computeds `currentMonthIncome` e `currentMonthExpense` SHALL ser mantidas como wrappers para compatibilidade, internamente delegando para as computeds de periodo com modo `current-month`.

#### Scenario: Computed reacts to period mutation
- **WHEN** `activePeriod.value` e alterado para um novo intervalo
- **THEN** `periodIncome`, `periodExpense` e `periodBalance` sao recalculados automaticamente

#### Scenario: Computed reacts to array mutation
- **WHEN** `state.transactions` recebe um novo item via `push`
- **THEN** `periodIncome`, `periodExpense` e `periodBalance` sao recalculados automaticamente

#### Scenario: Computed handles year boundary in custom period
- **WHEN** o periodo customizado e 01/11/2025 a 28/02/2026 e ha transacoes nesses meses
- **THEN** apenas transacoes entre novembro/2025 e fevereiro/2026 sao incluidas nos totais
