## ADDED Requirements

### Requirement: Income and Expense cards display current month totals
Os cards de Receitas e Despesas no `AppHeader` SHALL exibir totais filtrados pelo mes corrente. O card de Saldo SHALL permanecer como total acumulado historico (sem filtro de mes). O `useTransactions` composable SHALL expor computed properties `currentMonthIncome` e `currentMonthExpense` que filtram transacoes cujo mes e ano da propriedade `date` coincidem com o mes e ano atuais.

#### Scenario: Income card shows only current month income
- **WHEN** ha transacoes de receita de R$ 1000,00 em maio/2026 e R$ 500,00 em junho/2026 (mes atual)
- **THEN** o card "Receitas" exibe R$ 500,00

#### Scenario: Expense card shows only current month expenses
- **WHEN** ha transacoes de despesa de R$ 300,00 em maio/2026 e R$ 150,00 em junho/2026 (mes atual)
- **THEN** o card "Despesas" exibe R$ 150,00

#### Scenario: Balance card remains total accumulated
- **WHEN** ha receitas de R$ 2000,00 no mes atual, despesas de R$ 800,00 no mes atual, e transacoes de meses anteriores totalizando receitas de R$ 5000,00 e despesas de R$ 2000,00
- **THEN** o card "Saldo" exibe R$ 4200,00 (total acumulado: 7000 - 2800), o card "Receitas" exibe R$ 2000,00 e o card "Despesas" exibe R$ 800,00

#### Scenario: Empty current month shows zero for income/expense only
- **WHEN** nao ha transacoes no mes atual, mas ha transacoes em meses anteriores
- **THEN** os cards "Receitas" e "Despesas" exibem R$ 0,00, mas o card "Saldo" exibe o total acumulado historico

#### Scenario: Cards recalculate reactively on transaction add
- **WHEN** o usuario cria uma nova transacao de despesa de R$ 300,00 com data do mes atual
- **THEN** o card "Despesas" atualiza imediatamente incluindo os R$ 300,00 no total do mes

### Requirement: Card labels indicate current month context on filtered cards
Os labels dos cards de Receitas e Despesas SHALL incluir indicacao visual de que os valores sao do mes corrente. O label base ("Receitas", "Despesas") SHALL ser complementado com um texto secundario sutil "(mes atual)". O card de Saldo SHALL exibir apenas "Saldo" sem indicador de mes, pois representa o total acumulado.

#### Scenario: Filtered cards show month indicator
- **WHEN** a pagina carrega com transacoes do mes atual
- **THEN** os cards "Receitas" e "Despesas" exibem o indicador "(mes atual)" em estilo secundario; o card "Saldo" nao exibe indicador de mes

### Requirement: useTransactions exposes current-month computed properties
O modulo `useTransactions.js` SHALL definir e exportar duas novas computed properties reativas: `currentMonthIncome` e `currentMonthExpense`. As computacoes SHALL usar `new Date()` para determinar o mes e ano correntes e filtrar `state.transactions` com base no campo `date` (ISO 8601) de cada transacao. A computed `balance` existente (total acumulado) SHALL permanecer inalterada. Nao SHALL existir `currentMonthBalance`.

#### Scenario: Computed reacts to array mutation
- **WHEN** `state.transactions` recebe um novo item via `push`
- **THEN** `currentMonthIncome` e `currentMonthExpense` sao recalculados automaticamente

#### Scenario: Computed handles year boundary
- **WHEN** a data atual e janeiro de 2026 e ha transacoes de dezembro de 2025 e janeiro de 2026
- **THEN** apenas as transacoes de janeiro de 2026 sao incluidas nos totais do mes corrente
