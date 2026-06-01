## Why

O array reativo de transações no `useTransactions.js` não é atualizado corretamente após operações CRUD — a interface do `TransactionHistory` e os cards de dashboard permanecem estagnados até um F5. O bug ocorre porque `loadFromStorage()` é invocado a cada chamada de `useTransactions()`, sobrescrevendo `state.transactions` com dados stale do localStorage e quebrando a cadeia de reatividade entre componentes.

## What Changes

- **Corrigir `useTransactions.js`**: Remover a chamada `loadFromStorage()` do corpo da factory function. A inicialização do estado deve ocorrer uma única vez, no top-level do módulo. Cada componente que importa o composable passa a receber o mesmo estado reativo, sem sobreescrita.
- **Corrigir `deleteTransaction`**: Substituir `state.transactions = state.transactions.filter(...)` por `state.transactions.splice(...)` para mutar o array reativo in-place, eliminando a substituição do proxy que pode causar perda de tracking no destructuring.
- **Corrigir sincronização periódica**: `syncPendingTransactions` chama `useTransactions()` internamente (que disparava `loadFromStorage()`), potencialmente desfazendo alterações locais durante o polling de 30s.

## Capabilities

### New Capabilities
<!-- Nenhuma — trata-se de correção de bug em requisitos já especificados -->

### Modified Capabilities
- `vue-frontend`: Corrigir conformidade com os requisitos "Dashboard shows real-time financial summary" e "Transaction history displays all transactions with filters" — a reatividade após push/delete no array de transações não estava funcionando conforme especificado.

## Impact

- `frontend/src/composables/useTransactions.js`: Refatoração da inicialização do estado e das funções `deleteTransaction`/`addTransaction`
- `frontend/src/composables/useApi.js`: Remover dependência cíclica indireta causada por `useTransactions()` dentro de `syncPendingTransactions`
- Componentes consumidores (`TransactionHistory.vue`, `AppHeader.vue`, `TransactionForm.vue`): Sem alterações de API pública — apenas passam a observar o estado reativo corretamente
- Nenhuma dependência nova. Nenhuma breaking change de API.
