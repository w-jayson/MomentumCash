## ADDED Requirements

### Requirement: Extrato completo view contains PeriodSelector and TransactionHistory
A view de extrato completo SHALL renderizar o componente `PeriodSelector` com todas as opcoes de periodo (Mes Atual, Ultimos 3/6/12 meses, Proximos 3/6/12 meses, Personalizado) e o componente `TransactionHistory` com sua `FilterBar` integrada. O `PeriodSelector` SHALL ser posicionado acima do `TransactionHistory`.

#### Scenario: PeriodSelector renders with all preset options
- **WHEN** a view de extrato completo esta ativa
- **THEN** o PeriodSelector e exibido com dropdown contendo: Mes Atual, Ultimos 3 meses, Ultimos 6 meses, Ultimo ano, Proximos 3 meses, Proximos 6 meses, Proximo ano, e Personalizado...

#### Scenario: Custom date range inputs appear in extrato view
- **WHEN** o usuario seleciona "Personalizado..." no PeriodSelector da view de extrato
- **THEN** os inputs de data inicio e data fim aparecem abaixo do seletor, permitindo selecao de intervalo customizado

#### Scenario: TransactionHistory renders below PeriodSelector
- **WHEN** a view de extrato completo esta ativa
- **THEN** o componente TransactionHistory com sua FilterBar e renderizado abaixo do PeriodSelector, exibindo transacoes filtradas pelo periodo selecionado

#### Scenario: Changing period updates history and summary cards
- **WHEN** o usuario altera o periodo de "Mes Atual" para "Ultimos 3 meses" no PeriodSelector da view extrato
- **THEN** o TransactionHistory atualiza para mostrar apenas transacoes dos ultimos 3 meses, e os summary cards no AppHeader refletem os totais do novo periodo

### Requirement: Extrato view has back navigation to dashboard
A view de extrato completo SHALL conter um botao ou link "Voltar ao dashboard" que retorna o usuario para a view dashboard overview. O botao SHALL ser posicionado de forma clara e acessivel.

#### Scenario: Back button navigates to dashboard overview
- **WHEN** o usuario clica em "Voltar ao dashboard" na view de extrato
- **THEN** a view transiciona de volta para o dashboard overview, com activePeriod resetado para mes corrente

#### Scenario: Back button is visually distinct
- **WHEN** a view de extrato esta renderizada
- **THEN** o botao "Voltar ao dashboard" e visivel e usa estilo glass com cor secundaria, distinguindo-se do botao CTA "Ver extrato completo"

### Requirement: TransactionForm is accessible via toggle in extrato view
A view de extrato completo SHALL disponibilizar o componente `TransactionForm` atraves de um botao "Nova Transacao". O formulario SHALL iniciar colapsado (nao visivel) e expandir ao clicar no botao. Apos salvar com sucesso, o formulario SHALL colapsar novamente.

#### Scenario: TransactionForm is initially hidden
- **WHEN** a view de extrato completo carrega pela primeira vez
- **THEN** o formulario de transacao nao esta visivel; apenas o botao "Nova Transacao" e exibido

#### Scenario: Clicking Nova Transacao shows form
- **WHEN** o usuario clica no botao "Nova Transacao"
- **THEN** o TransactionForm expande com animacao, exibindo todos os campos (descricao, valor, tipo, data, categoria, parcelamento)

#### Scenario: Saving transaction collapses form
- **WHEN** o usuario preenche e salva uma transacao com sucesso
- **THEN** o TransactionForm colapsa, o botao "Nova Transacao" volta a ser exibido, e o TransactionHistory atualiza com a nova transacao

#### Scenario: Editing transaction scrolls to form
- **WHEN** o usuario clica em "Editar" em uma transacao no TransactionHistory
- **THEN** o TransactionForm expande (se estiver colapsado) e e preenchido com os dados da transacao selecionada

### Requirement: AppHeader summary cards reflect active period in extrato view
O componente `AppHeader` SHALL permanecer visivel em ambas as views (dashboard e extrato). Na view de extrato, os summary cards (Saldo, Receitas, Despesas) SHALL refletir o periodo selecionado pelo usuario no PeriodSelector, e os sublabels SHALL indicar o periodo ativo.

#### Scenario: Summary cards show current month by default in extrato
- **WHEN** a view de extrato carrega pela primeira vez (periodo default = Mes Atual)
- **THEN** os cards exibem Saldo, Receitas e Despesas do mes corrente, com sublabel "(mes atual)"

#### Scenario: Summary cards update on period change in extrato
- **WHEN** o usuario seleciona "Ultimos 6 meses" no PeriodSelector da view extrato
- **THEN** os cards de Saldo, Receitas e Despesas atualizam para refletir os totais dos ultimos 6 meses, com sublabel "(ultimos 6 meses)"
