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
O componente `TransactionHistory` SHALL exibir uma tabela com todas as transacoes, ordenadas por data (mais recente primeiro). Filtros por categoria, tipo e periodo (data inicio/data fim) SHALL restringir os resultados exibidos reativamente. O filtro de periodo SHALL ser opcional — quando vazio, todas as transacoes sao exibidas. Para transacoes parceladas, a transacao SHALL aparecer no historico se alguma de suas parcelas incide no periodo filtrado.

#### Scenario: Transactions sorted by date descending
- **WHEN** ha transacoes com datas 01/06/2026 e 15/05/2026
- **THEN** a transacao de 01/06/2026 aparece antes da de 15/05/2026

#### Scenario: Filter by expense type
- **WHEN** o usuario seleciona "Despesas" no filtro de tipo
- **THEN** apenas transacoes com type=2 sao exibidas na tabela

#### Scenario: Filter by category
- **WHEN** o usuario seleciona uma categoria especifica no filtro
- **THEN** apenas transacoes com aquela categoria sao exibidas

#### Scenario: Filter by date period
- **WHEN** o usuario define data inicio 01/06/2026 e data fim 30/06/2026
- **THEN** apenas transacoes com data em junho/2026 sao exibidas; transacoes parceladas com parcela em junho tambem aparecem

#### Scenario: Date filter combined with other filters
- **WHEN** o usuario filtra por periodo "junho/2026", categoria "Alimentacao" e tipo "Despesas"
- **THEN** apenas despesas de Alimentacao em junho/2026 sao exibidas

#### Scenario: Clear date filter shows all transactions
- **WHEN** o usuario limpa o filtro de data (deixa vazio)
- **THEN** todas as transacoes voltam a ser exibidas (respeitando apenas filtros de categoria e tipo, se aplicados)

#### Scenario: Installment appears when parcel falls in period
- **WHEN** o periodo filtrado e junho/2026 e ha uma despesa parcelada de 12x iniciada em janeiro/2026 (com parcela em junho)
- **THEN** a transacao parcelada aparece no historico com seu valor original e badge "1/12 parcelas"

#### Scenario: Empty state with no transactions
- **WHEN** nao ha transacoes (ou os filtros nao produzem resultados)
- **THEN** a tabela exibe a mensagem "Nenhuma transacao registrada."

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

A interface SHALL aplicar o tema Kinetic Dark: fundo escuro (#060B14) com grid dots overlay, cards com glass morphism (backdrop-blur, bordas translucidas), tipografia Satoshi para headings e JetBrains Mono para valores monetarios, cores accent cyan/emerald/coral, e animacoes staggered na entrada dos cards. Componentes de grafico (ApexCharts) SHALL seguir o mesmo tema: fundo transparente, tooltips dark, paleta de cores derivada dos tokens do design system.

#### Scenario: Dark background with grid dots visible
- **WHEN** a página carrega
- **THEN** o fundo é escuro com um padrão de grid dots visível

#### Scenario: Summary cards have glass morphism effect
- **WHEN** a página carrega
- **THEN** os cards de resumo exibem efeito de vidro (background translúcido com blur)

#### Scenario: Monetary values use monospace font
- **WHEN** qualquer valor monetário é renderizado
- **THEN** o texto usa a fonte JetBrains Mono

#### Scenario: Chart components follow dark theme
- **WHEN** graficos ApexCharts sao renderizados
- **THEN** o fundo e transparente, textos usam text-primary (#E8EDF5), tooltips usam midnight (#1A233A), e cores de segmentos sao derivadas dos tokens do design system

### Requirement: ApexCharts dependency is declared in package.json
O projeto SHALL declarar `vue3-apexcharts` e `apexcharts` como dependencias no `package.json`. Nenhum comando de instalacao SHALL ser executado automaticamente — o desenvolvedor SHALL rodar `npm install` manualmente dentro do container Docker.

#### Scenario: Dependencies listed in package.json
- **WHEN** o `package.json` e inspecionado
- **THEN** `vue3-apexcharts` e `apexcharts` estao listados em `dependencies` com versoes especificas

#### Scenario: ApexCharts registered as Vue plugin
- **WHEN** a aplicacao inicializa em `main.js`
- **THEN** `VueApexCharts` e registrado como componente global via `app.component()`

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
