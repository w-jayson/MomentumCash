## ADDED Requirements

### Requirement: Reactive state is initialized once at module load

O estado reativo (`state.transactions`, `state.categories`) SHALL ser inicializado uma unica vez, no top-level do modulo `useTransactions.js`, lendo do localStorage. A factory function `useTransactions()` SHALL retornar referencias ao estado sem causar re-leitura do localStorage.

#### Scenario: Multiple consumers share same reactive reference
- **WHEN** dois ou mais componentes chamam `useTransactions()`
- **THEN** todas as referencias retornadas apontam para o mesmo objeto reativo `state`, sem disparar `loadFromStorage()` a cada invocacao

#### Scenario: State persists correctly after multiple composable calls
- **WHEN** o componente A chama `useTransactions()` e adiciona uma transacao via `addTransaction`
- **THEN** o componente B, que tambem chamou `useTransactions()`, reflete a nova transacao sem precisar recarregar do localStorage

### Requirement: Transaction deletion mutates reactive array in-place

A funcao `deleteTransaction` SHALL usar `splice` para remover o item do array `state.transactions` diretamente, sem substituir a referencia do array. A operacao SHALL ser reativa e refletida imediatamente em todos os componentes que iteram sobre o array.

#### Scenario: Delete triggers immediate DOM update
- **WHEN** o usuario confirma a exclusao de uma transacao no modal
- **THEN** a linha correspondente desaparece da tabela de historico sem necessidade de F5

#### Scenario: Dashboard cards recalculate after delete
- **WHEN** uma transacao de despesa eh excluida via `deleteTransaction`
- **THEN** os cards "Despesas" e "Saldo" no dashboard atualizam seus valores imediatamente

### Requirement: Background sync does not trigger state reload

A funcao `syncPendingTransactions` SHALL acessar o estado reativo diretamente do module scope, sem invocar `useTransactions()`. A sincronizacao periodica (30s) SHALL nao causar re-leitura do localStorage nem substituicao do array `state.transactions`.

#### Scenario: Sync runs without overwriting recent changes
- **WHEN** o usuario cria uma transacao e, em seguida, o intervalo de 30s dispara `syncPendingTransactions`
- **THEN** a transacao recem-criada permanece no estado, com seu `syncStatus` atualizado corretamente apos a resposta do servidor, sem ser sobrescrita por dados stale do localStorage

#### Scenario: Sync does not trigger loadFromStorage
- **WHEN** `syncPendingTransactions` e executado pelo `setInterval`
- **THEN** a funcao `loadFromStorage()` NAO eh invocada, e o array `state.transactions` nao eh substituido

## MODIFIED Requirements

### Requirement: Transactions persist in localStorage

O estado das transacoes e categorias SHALL ser persistido automaticamente em localStorage sempre que houver mudancas. A leitura inicial do localStorage SHALL ocorrer uma unica vez no carregamento do modulo, nao a cada chamada de `useTransactions()`.

#### Scenario: Data survives page reload
- **WHEN** o usuario cria transacoes e recarrega a pagina
- **THEN** as transacoes sao carregadas do localStorage uma vez durante a inicializacao do modulo e exibidas corretamente

#### Scenario: Categories persist across sessions
- **WHEN** o usuario fecha e reabre o navegador
- **THEN** as categorias previamente carregadas do servidor permanecem disponiveis

#### Scenario: State is not overwritten during session
- **WHEN** um componente monta apos outro ja ter modificado `state.transactions`
- **THEN** o estado nao eh sobrescrito com dados do localStorage, preservando as alteracoes em memoria
