## Context

O `balance` computed em `useTransactions.js:72-80` soma todas as receitas (`type===1`) e subtrai todas as despesas (`type===2`) usando `t.amount` integral, ignorando se a despesa é parcelada. Para despesas parceladas, `t.amount` é o valor total da compra — que será pago ao longo de meses — e `t.installmentValue` é o valor mensal. Isso faz o saldo parecer menor do que realmente está disponível.

A função auxiliar `isCurrentMonth(dateStr)` (linha 94) já existe e será reutilizada para determinar se uma parcela incide no mês corrente.

## Goals / Non-Goals

**Goals:**
- Alterar `balance` para que despesas parceladas contribuam apenas com `installmentValue` quando a data de início + offset da parcela cair no mês corrente
- Despesas não parceladas (`!installments || installments <= 0`) continuam subtraindo `amount` integral

**Non-Goals:**
- Não alterar `totalExpense`, `currentMonthExpense`, `totalIncome` nem `currentMonthIncome`
- Não alterar o `CommitmentTimeline` nem `ExpenseChart`
- Não alterar a estrutura de dados das transações

## Decisions

### Lógica de filtro para parcelas no mês corrente

Para cada despesa parcelada, determina-se se **alguma** parcela incide no mês corrente e soma-se `installmentValue` apenas uma vez (o valor mensal já representa o que sai no mês).

Critério: uma transação com `installments = N`, data de início `date`, incide no mês corrente se o mês atual estiver entre `startMonth` e `startMonth + N - 1` (inclusive).

Se a data de início for futura (ainda não começou), nenhuma parcela incide — contribui 0.

Se a data de início for passada mas ainda houver parcelas restantes no mês corrente, contribui `installmentValue`.

Decisão: reutilizar `isCurrentMonth` para cada mês do range, em vez de calcular offsets manuais — mais legível e consistente com o código existente.

### Valor da parcela (fallback)

Usar `tx.installmentValue || (tx.amount / tx.installments)` como fallback, consistente com `CommitmentTimeline.vue:31`.

## Risks / Trade-offs

- **[Risco]** Se `installmentValue` não estiver definido em transações antigas (antes da feature de parcelamento), o fallback `amount / installments` é usado. Para transações sem `installmentValue` e com `installments > 0`, o cálculo é correto.
- **[Trade-off]** O saldo pode parecer "subir" após esta mudança para usuários com muitas parcelas lançadas, pois o valor integral deixa de ser descontado. Isso é intencional — o saldo agora reflete liquidez real.
