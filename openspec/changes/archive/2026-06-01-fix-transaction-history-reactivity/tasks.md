## 1. Fix useTransactions.js reactive state initialization

- [x] 1.1 Mover `loadFromStorage()` para o top-level do modulo, executada uma unica vez
- [x] 1.2 Remover chamada `loadFromStorage()` do corpo de `useTransactions()`
- [x] 1.3 Alterar `deleteTransaction` para usar `findIndex` + `splice` em vez de `filter` + reatribuicao
- [x] 1.4 Verificar se `addTransaction` (`state.transactions.push(...)`) ja esta correto (mutacao in-place)

## 2. Fix useApi.js syncPendingTransactions

- [x] 2.1 Remover chamada `useTransactions()` de dentro de `syncPendingTransactions`
- [x] 2.2 Acessar `state.transactions` e `updateTransaction` diretamente via import do module scope de `useTransactions.js`

## 3. Verify reactivity end-to-end

- [x] 3.1 Testar: criar nova transacao via formulario → historico atualiza imediatamente sem F5
- [x] 3.2 Testar: excluir transacao via modal → item desaparece da tabela de historico sem F5
- [x] 3.3 Testar: cards de dashboard (Saldo, Receitas, Despesas) atualizam apos create e delete
- [x] 3.4 Testar: filtros de categoria e tipo continuam funcionando apos as mudancas de reatividade
