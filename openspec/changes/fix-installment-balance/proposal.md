## Why

O saldo total acumulado (`balance`) desconta o valor integral de uma despesa parcelada no momento do lançamento, distorcendo a visão real do saldo disponível. Uma compra de R$ 1.200 em 12x reduz o saldo em R$ 1.200 imediatamente, quando na prática apenas R$ 100/mês sairão do caixa. Isso inviabiliza o uso do saldo como indicador confiável de liquidez.

## What Changes

- **`balance` computed**: Despesas parceladas passam a contribuir apenas com o valor da parcela que incide no mês corrente, em vez do valor total. Despesas não parceladas mantêm comportamento atual (valor integral).
- Receitas e `totalIncome`/`totalExpense` permanecem inalterados.

## Capabilities

### New Capabilities

<!-- Nenhuma nova capability necessária — a alteração é restrita a comportamento existente. -->

### Modified Capabilities

- `vue-frontend`: O requisito "Dashboard shows real-time financial summary" é alterado — a computed `balance` deve considerar apenas a parcela do mês corrente para despesas parceladas.

## Impact

- `frontend/src/composables/useTransactions.js:72-80` — função `balance` computed
- Nenhuma API, dependência ou breaking change.
