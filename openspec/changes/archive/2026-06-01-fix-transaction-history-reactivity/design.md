## Context

A aplicacao Vue 3 usa um singleton `reactive` compartilhado em module scope para gerenciar estado (`useTransactions.js`). A factory function `useTransactions()` chama `loadFromStorage()` a cada invocacao, sobrescrevendo `state.transactions` com dados parseados do localStorage. Embora Vue 3 use Proxies para reatividade profunda, a substituicao repetida do array (via `state.transactions = ...`) combinada com destructuring nos componentes cria janelas onde a referencia reativa de um componente pode divergir da referencia atual em `state`.

O `syncPendingTransactions` (chamado a cada 30s em `App.vue`) tambem invoca `useTransactions()`, disparando nova leitura do localStorage e risco de overwrite do estado durante operacoes concorrentes.

## Goals / Non-Goals

**Goals:**
- Garantir que `addTransaction` (push) e `deleteTransaction` (remocao) disparem atualizacao reativa imediata no `TransactionHistory` e nos cards de dashboard
- Eliminar chamadas redundantes a `loadFromStorage()` que sobrescrevem o estado reativo
- Corrigir `syncPendingTransactions` para nao depender da re-chamada de `useTransactions()`

**Non-Goals:**
- Migrar para Pinia ou Vuex (fora de escopo)
- Alterar a estrutura dos componentes consumidores (API publica do composable permanece igual)
- Modificar o fluxo de sync com o backend alem da correcao de reatividade

## Decisions

### 1. Inicializacao do estado no module scope, nao dentro da factory

**Decisao:** Mover `loadFromStorage()` para o topo do modulo, executando uma unica vez. A factory `useTransactions()` apenas retorna referencias ao estado ja inicializado, sem efeitos colaterais.

**Alternativa considerada:** Manter a chamada dentro da factory com guard `if (state.transactions.length === 0)`. Rejeitada porque nao resolve o problema de forma definitiva — se o array for esvaziado intencionalmente, perde-se a referencia inicial.

**Trade-off:** Nao ha mais recarga do localStorage durante o ciclo de vida da app. A unica fonte da verdade passa a ser o estado em memoria + persistencia via watchers.

### 2. `deleteTransaction` usa `splice` em vez de `filter` + reatribuicao

**Decisao:** Substituir `state.transactions = state.transactions.filter(...)` por:
1. Encontrar o indice via `findIndex`
2. `state.transactions.splice(index, 1)`

**Alternativa considerada:** Manter filtro mas usar `toRef` nos componentes. Rejeitada porque adiciona boilerplate desnecessario.

**Rationale:** `splice` e uma mutacao in-place do array reativo. Nao substitui o proxy, eliminando qualquer risco de perda de tracking em componentes que ja fizeram destructuring da referencia.

### 3. `syncPendingTransactions` acessa estado diretamente, sem chamar `useTransactions()`

**Decisao:** A funcao de sync eh extraida para acessar `state.transactions` diretamente do module scope, sem invocar a factory `useTransactions()`.

**Alternativa considerada:** Passar o estado como parametro. Rejeitada porque adiciona complexidade desnecessaria — o estado ja esta no module scope.

## Risks / Trade-offs

- **[Risk]** `syncPendingTransactions` executa `forEach` async sem `await`, disparando multiplas chamadas HTTP concorrentes que modificam `state.transactions` simultaneamente → **Mitigacao:** Escopo existente do ticket nao cobre race conditions de sync; sera tratado em change separado.
- **[Risk]** Aplicacao sem router pode perder dados se usuario navegar para outra pagina durante sync → **Mitigacao:** A sync falha silenciosamente (`catch` vazio), transacoes permanecem como `pending` e sao retentadas no proximo ciclo.
