## ADDED Requirements

### Requirement: Landing page renders as Vue component tree

A aplicação SHALL renderizar a landing page como uma árvore de componentes Vue 3 usando Composition API (`<script setup>`). A página SHALL conter: cabeçalho com resumo financeiro, formulário de transação, histórico com filtros, modal de confirmação, e rodapé.

#### Scenario: Page mounts and initializes
- **WHEN** a página é carregada no navegador
- **THEN** Vue monta `App.vue` e renderiza todos os componentes filhos com dados iniciais do localStorage

#### Scenario: No vue-router dependency
- **WHEN** o bundle é analisado
- **THEN** `vue-router` não está presente nas dependências

### Requirement: Dashboard shows real-time financial summary

O componente `AppHeader` SHALL exibir três cards de resumo: Saldo, Receitas e Despesas. Os valores SHALL ser computados reativamente a partir do array de transações.

#### Scenario: Dashboard updates on transaction create
- **WHEN** o usuário cria uma nova transação de receita de R$ 1000,00
- **THEN** o card "Receitas" atualiza para R$ 1000,00 e o card "Saldo" atualiza para R$ 1000,00

#### Scenario: Dashboard updates on transaction delete
- **WHEN** o usuário exclui uma transação de despesa de R$ 500,00
- **THEN** o card "Despesas" reduz em R$ 500,00 e o card "Saldo" aumenta em R$ 500,00

#### Scenario: Empty dashboard shows zero values
- **WHEN** não há transações registradas
- **THEN** todos os cards exibem "R$ 0,00"

### Requirement: Monetary counters animate on value change

O componente `AnimatedCounter` SHALL interpolar o valor exibido do valor anterior até o valor alvo usando `requestAnimationFrame` com easing `easeOutExpo`. A animação SHALL durar aproximadamente 800ms.

#### Scenario: Counter animates from previous value
- **WHEN** o valor do card de Saldo muda de R$ 1000,00 para R$ 1500,00
- **THEN** o contador inicia em 1000,00 e anima até 1500,00 em aproximadamente 800ms

#### Scenario: Counter renders zero instantly on first mount
- **WHEN** o componente monta pela primeira vez com target = 0
- **THEN** o contador exibe "R$ 0,00" imediatamente, sem animação visível

### Requirement: Transaction form supports create and edit modes

O componente `TransactionForm` SHALL operar em dois modos: criação (título "Nova Transação", botão "Salvar") e edição (título "Editar Transação", botão "Atualizar"). O campo Data SHALL ser pré-preenchido com a data atual no modo de criação.

#### Scenario: Form opens in create mode by default
- **WHEN** a página carrega
- **THEN** o título do formulário é "Nova Transação" e o botão submit exibe "Salvar"

#### Scenario: Form switches to edit mode on edit click
- **WHEN** o usuário clica em "Editar" em uma transação existente
- **THEN** o formulário é preenchido com os dados da transação, o título muda para "Editar Transação", e o botão muda para "Atualizar"

#### Scenario: Cancel button resets form to create mode
- **WHEN** o usuário clica em "Cancelar" durante a edição
- **THEN** o formulário é resetado para o modo de criação com campos vazios (exceto data = hoje)

#### Scenario: Form scrolls into view on edit
- **WHEN** o usuário clica em "Editar" em uma transação fora da viewport
- **THEN** a página faz scroll suave até o formulário

### Requirement: Installment fields render conditionally based on transaction type

Os campos de parcelamento SHALL ser exibidos apenas quando o Tipo selecionado for "Despesa" (2). O checkbox "Compra parcelada?" e os campos "Quantidade de parcelas" e "Valor da parcela" SHALL aparecer dinamicamente.

#### Scenario: Installment section hidden for income type
- **WHEN** o usuário seleciona "Receita" (1) no campo Tipo
- **THEN** o checkbox "Compra parcelada?" e os campos de parcelamento NÃO são renderizados no DOM

#### Scenario: Installment section visible for expense type
- **WHEN** o usuário seleciona "Despesa" (2) no campo Tipo
- **THEN** o checkbox "Compra parcelada?" é renderizado

#### Scenario: Installment fields appear when checkbox is checked
- **WHEN** o usuário seleciona "Despesa" e marca "Compra parcelada?"
- **THEN** os campos "Quantidade de parcelas" e "Valor da parcela" são renderizados

### Requirement: Installment value auto-calculates from total amount

Quando "Compra parcelada?" está marcado e o usuário preenche Valor e Quantidade de parcelas, o campo "Valor da parcela" SHALL ser calculado automaticamente como `Valor / Quantidade de parcelas`.

#### Scenario: Auto-calculate on installments input
- **WHEN** Valor = 1200.00, checkbox marcado, e usuário digita "12" em Quantidade de parcelas
- **THEN** Valor da parcela é preenchido automaticamente com 100.00

#### Scenario: Manual edit preserves user value
- **WHEN** o valor da parcela foi auto-calculado e o usuário edita manualmente para 150.00
- **THEN** o valor 150.00 é preservado até que Valor ou Quantidade de parcelas sejam alterados novamente

### Requirement: Transaction history displays all transactions with filters

O componente `TransactionHistory` SHALL exibir uma tabela com todas as transações, ordenadas por data (mais recente primeiro). Filtros por categoria e tipo SHALL restringir os resultados exibidos reativamente.

#### Scenario: Transactions sorted by date descending
- **WHEN** há transações com datas 01/06/2026 e 15/05/2026
- **THEN** a transação de 01/06/2026 aparece antes da de 15/05/2026

#### Scenario: Filter by expense type
- **WHEN** o usuário seleciona "Despesas" no filtro de tipo
- **THEN** apenas transações com type=2 são exibidas na tabela

#### Scenario: Filter by category
- **WHEN** o usuário seleciona uma categoria específica no filtro
- **THEN** apenas transações com aquela categoria são exibidas

#### Scenario: Empty state with no transactions
- **WHEN** não há transações (ou os filtros não produzem resultados)
- **THEN** a tabela exibe a mensagem "Nenhuma transação registrada."

### Requirement: Category dropdown filters by selected transaction type

Ao alterar o campo Tipo no formulário, o dropdown de Categoria SHALL ser recarregado exibindo apenas categorias do tipo correspondente.

#### Scenario: Income categories shown for income type
- **WHEN** o usuário seleciona "Receita" (1) no campo Tipo
- **THEN** o dropdown de Categoria exibe apenas categorias com type=1

#### Scenario: Category selection resets on type change
- **WHEN** o usuário seleciona uma categoria e depois altera o Tipo
- **THEN** o dropdown de Categoria é resetado para "Sem categoria"

### Requirement: Delete confirmation modal uses Teleport

O componente `ConfirmModal` SHALL renderizar via `<Teleport to="body">` para garantir stacking context correto. O modal SHALL exibir mensagem de confirmação e botões "Excluir" e "Cancelar".

#### Scenario: Modal opens on delete click
- **WHEN** o usuário clica em "Excluir" em uma transação
- **THEN** o modal de confirmação é exibido com a mensagem "Tem certeza que deseja excluir esta transação?"

#### Scenario: Confirm delete removes transaction
- **WHEN** o usuário clica em "Excluir" no modal
- **THEN** a transação é removida do estado, o modal fecha, e o dashboard é atualizado

#### Scenario: Cancel closes modal without changes
- **WHEN** o usuário clica em "Cancelar" ou fora do modal
- **THEN** o modal fecha e a transação permanece inalterada

### Requirement: Transactions persist in localStorage

O estado das transações e categorias SHALL ser persistido automaticamente em localStorage sempre que houver mudanças. A leitura inicial do localStorage SHALL ocorrer uma unica vez no carregamento do modulo, nao a cada chamada de `useTransactions()`.

#### Scenario: Data survives page reload
- **WHEN** o usuário cria transações e recarrega a página
- **THEN** as transações são carregadas do localStorage uma vez durante a inicializacao do modulo e exibidas corretamente

#### Scenario: Categories persist across sessions
- **WHEN** o usuário fecha e reabre o navegador
- **THEN** as categorias previamente carregadas do servidor permanecem disponíveis

#### Scenario: State is not overwritten during session
- **WHEN** um componente monta apos outro ja ter modificado `state.transactions`
- **THEN** o estado nao eh sobrescrito com dados do localStorage, preservando as alteracoes em memoria

### Requirement: API sync runs in background

Ao carregar a página, o sistema SHALL buscar categorias do servidor. Transações com `syncStatus: "pending"` SHALL ser sincronizadas em background a cada 30 segundos via `setInterval`.

#### Scenario: Categories loaded from server on init
- **WHEN** a página carrega
- **THEN** `GET /api/categories` é chamado e as categorias são populadas nos dropdowns

#### Scenario: Pending transactions retried periodically
- **WHEN** uma transação foi criada offline (syncStatus = "pending")
- **THEN** o sistema tenta sincronizar com o servidor a cada 30 segundos

#### Scenario: Sync updates serverId on success
- **WHEN** uma transação pendente é sincronizada com sucesso
- **THEN** o campo `serverId` é atualizado e `syncStatus` muda para "synced"

### Requirement: Visual theme applies Kinetic Dark design system

A interface SHALL aplicar o tema Kinetic Dark: fundo escuro (#060B14) com grid dots overlay, cards com glass morphism (backdrop-blur, bordas translúcidas), tipografia Satoshi para headings e JetBrains Mono para valores monetários, cores accent cyan/emerald/coral, e animações staggered na entrada dos cards.

#### Scenario: Dark background with grid dots visible
- **WHEN** a página carrega
- **THEN** o fundo é escuro com um padrão de grid dots visível

#### Scenario: Summary cards have glass morphism effect
- **WHEN** a página carrega
- **THEN** os cards de resumo exibem efeito de vidro (background translúcido com blur)

#### Scenario: Monetary values use monospace font
- **WHEN** qualquer valor monetário é renderizado
- **THEN** o texto usa a fonte JetBrains Mono

### Requirement: Docker development environment with HMR

O Dockerfile SHALL usar `node:20-alpine`, instalar dependências via `npm install`, e rodar `vite --host 0.0.0.0`. O `docker-compose.yml` SHALL configurar volume mounts para `src/`, `public/`, e `index.html`, expondo a porta 5173. O Vite SHALL usar `watch.usePolling: true` para detecção de mudanças em bind mounts.

#### Scenario: HMR detects Vue file changes in Docker
- **WHEN** um arquivo `.vue` é modificado no host
- **THEN** o Vite detecta a mudança via polling e atualiza o navegador sem reload completo

#### Scenario: API proxy forwards requests to backend
- **WHEN** o frontend faz `fetch('/api/transactions')`
- **THEN** o Vite proxy encaminha a requisição para `http://backend:5000/api/transactions`

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
