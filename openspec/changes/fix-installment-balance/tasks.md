## 1. Core Implementation

- [x] 1.1 Modificar `balance` computed em `frontend/src/composables/useTransactions.js:72-80` para que despesas parceladas (`installments > 0`) contribuam apenas com o valor da parcela do mês corrente (`installmentValue` com fallback `amount / installments`)

## 2. Verification

- [x] 2.1 Verificar manualmente: criar despesa parcelada e confirmar que o Saldo reduz apenas o valor da parcela do mês corrente
- [x] 2.2 Verificar manualmente: criar despesa não parcelada e confirmar que o Saldo reduz o valor integral (comportamento mantido)
- [x] 2.3 Verificar manualmente: criar despesa parcelada com data futura e confirmar que o Saldo não é alterado
