## MODIFIED Requirements

### Requirement: Dashboard shows real-time financial summary

O componente `AppHeader` SHALL exibir tres cards de resumo: Saldo, Receitas e Despesas. Os valores de Receitas e Despesas SHALL ser filtrados pelo mes corrente usando `currentMonthIncome` e `currentMonthExpense`. O Saldo SHALL permanecer como total acumulado historico usando a computed `balance` existente. Os labels de Receitas e Despesas SHALL incluir indicacao "(mes atual)". O label de Saldo SHALL permanecer sem indicador de mes.

Para o calculo do Saldo e do card "Despesas (mes atual)", despesas parceladas (`installments > 0`) SHALL contribuir apenas com o valor da parcela que incide no mes corrente (`installmentValue` ou `amount / installments` como fallback), em vez do valor total da compra. Despesas nao parceladas (`installments <= 0` ou ausente) SHALL continuar usando o valor integral (`amount`). Receitas SHALL permanecer inalteradas.

#### Scenario: Dashboard updates on transaction create
- **WHEN** o usuario cria uma nova transacao de receita de R$ 1000,00 com data do mes atual
- **THEN** o card "Receitas" (mes atual) atualiza para incluir R$ 1000,00 e o card "Saldo" (total acumulado) atualiza correspondentemente

#### Scenario: Dashboard updates on transaction delete
- **WHEN** o usuario exclui uma transacao de despesa de R$ 500,00 do mes atual
- **THEN** o card "Despesas" (mes atual) reduz em R$ 500,00 e o card "Saldo" (total acumulado) aumenta em R$ 500,00

#### Scenario: Empty current month shows zero for income/expense
- **WHEN** nao ha transacoes no mes atual mas ha transacoes em meses anteriores
- **THEN** os cards "Receitas" e "Despesas" exibem R$ 0,00; o card "Saldo" exibe o total acumulado historico

#### Scenario: Current month filter only affects income and expense cards
- **WHEN** ha transacoes de meses anteriores mas nenhuma no mes atual
- **THEN** Receitas e Despesas exibem R$ 0,00; Saldo exibe o valor liquido total de todo o historico

#### Scenario: Parceled expense deducts only current-month installment from balance
- **WHEN** o usuario cria uma despesa parcelada de R$ 1200,00 em 12x de R$ 100,00 com data de inicio no mes corrente
- **THEN** o card "Saldo" reduz em R$ 100,00 (nao R$ 1200,00)

#### Scenario: Parceled expense with future start date does not affect balance
- **WHEN** o usuario cria uma despesa parcelada com data de inicio em um mes futuro
- **THEN** o card "Saldo" nao eh alterado pela despesa parcelada

#### Scenario: Non-parceled expense deducts full amount from balance
- **WHEN** o usuario cria uma despesa nao parcelada de R$ 500,00 no mes corrente
- **THEN** o card "Saldo" reduz em R$ 500,00

#### Scenario: Parceled expense spanning current month from past
- **WHEN** existe uma despesa parcelada criada ha 3 meses em 6x de R$ 200,00, e o mes corrente ainda esta dentro do periodo de parcelas
- **THEN** o card "Saldo" reflete a deducao de R$ 200,00 referente a parcela do mes corrente

#### Scenario: Current-month expense card shows installment value for parceled expenses
- **WHEN** o usuario cria uma despesa parcelada de R$ 1200,00 em 12x de R$ 100,00 com data de inicio no mes corrente
- **THEN** o card "Despesas (mes atual)" exibe apenas R$ 100,00 (nao R$ 1200,00)
