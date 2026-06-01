## 1. Export utility functions from useTransactions

- [x] 1.1 Adicionar `isDateInRange` ao objeto de retorno de `useTransactions()` para que componentes possam usa-la

## 2. Update FilterBar component

- [x] 2.1 Adicionar props `filterDateStart` e `filterDateEnd` (String, default '') ao `FilterBar.vue`
- [x] 2.2 Adicionar emits `update:filterDateStart` e `update:filterDateEnd`
- [x] 2.3 Adicionar dois `<input type="date">` no template (inicio e fim) com estilo Kinetic Dark
- [x] 2.4 Adicionar botao "Limpar" que emite ambos os eventos com string vazia
- [x] 2.5 Implementar handlers de change que emitem os eventos apropriados

## 3. Update TransactionHistory component

- [x] 3.1 Adicionar props `filterDateStart` e `filterDateEnd` ao `TransactionHistory.vue`
- [x] 3.2 Importar `isDateInRange` e `isInstallmentInPeriod` do `useTransactions()`
- [x] 3.3 Adicionar filtro de data na computed `filteredAndSorted`: se ambas as datas preenchidas, filtrar transacoes com `isDateInRange`; para parceladas, usar `isInstallmentInPeriod`
- [x] 3.4 Passar `filterDateStart` e `filterDateEnd` como props para `FilterBar` e emitir eventos de update

## 4. Update App.vue

- [x] 4.1 Adicionar `filterDateStart` e `filterDateEnd` como `ref('')` no `App.vue`
- [x] 4.2 Passar como props para `TransactionHistory` e escutar eventos de update

## 5. Verification

- [x] 5.1 Testar historico sem filtro de data — todas as transacoes visiveis (sem regressao)
- [x] 5.2 Testar filtro por mes atual — apenas transacoes do mes corrente
- [x] 5.3 Testar transacao parcelada aparece quando periodo do filtro cobre uma parcela
- [x] 5.4 Testar combinacao de filtros (data + categoria + tipo)
- [x] 5.5 Testar botao "Limpar" reseta filtro de data
- [x] 5.6 Rodar build do frontend para verificar compilacao
