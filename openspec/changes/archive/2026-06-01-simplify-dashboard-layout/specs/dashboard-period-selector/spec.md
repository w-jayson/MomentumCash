## MODIFIED Requirements

### Requirement: Period selector renders preset options and custom date range
O componente `PeriodSelector` SHALL renderizar um controle de selecao de periodo na view de extrato completo, posicionado acima do `TransactionHistory`. O PeriodSelector NAO SHALL ser renderizado na view dashboard overview. O controle SHALL exibir o periodo atualmente selecionado e, ao ser clicado, expandir um menu com opcoes pre-definidas e a opcao de intervalo customizado.

#### Scenario: Default period is current month
- **WHEN** a view de extrato carrega pela primeira vez
- **THEN** o PeriodSelector exibe "Mes Atual" como periodo selecionado e todos os dados do extrato refletem o mes corrente

#### Scenario: User selects a preset period
- **WHEN** o usuario clica no PeriodSelector (na view extrato) e seleciona "Ultimos 3 meses"
- **THEN** o periodo ativo muda para os ultimos 3 meses (incluindo o mes atual), o label exibe "Ultimos 3 meses", e todos os cards/graficos/historico atualizam para refletir os dados desse intervalo

#### Scenario: User selects custom date range
- **WHEN** o usuario seleciona "Personalizado..." e define data inicio como 01/03/2026 e data fim como 31/05/2026
- **THEN** o periodo ativo muda para o intervalo customizado, o label exibe as datas selecionadas (ex: "01/03/2026 - 31/05/2026"), e todos os cards/graficos/historico atualizam

#### Scenario: Preset options available
- **WHEN** o menu do PeriodSelector esta aberto
- **THEN** as opcoes exibidas sao: "Mes Atual", "Ultimos 3 meses", "Ultimos 6 meses", "Ultimo ano", "Proximos 3 meses", "Proximos 6 meses", "Proximo ano", e "Personalizado..."

#### Scenario: Custom inputs appear only when custom mode is selected
- **WHEN** o usuario seleciona "Personalizado..."
- **THEN** dois inputs do tipo `date` (data inicio e data fim) tornam-se visiveis abaixo do seletor; quando qualquer outro modo e selecionado, os inputs desaparecem

#### Scenario: PeriodSelector integrates with useTransactions activePeriod
- **WHEN** o usuario altera o periodo no PeriodSelector
- **THEN** a propriedade reativa `activePeriod` no `useTransactions` e atualizada, disparando recalculacao de todas as computeds dependentes

#### Scenario: PeriodSelector is absent from dashboard overview
- **WHEN** a view dashboard overview esta ativa
- **THEN** o PeriodSelector nao e renderizado em nenhum lugar da tela

### Requirement: PeriodSelector follows Kinetic Dark design system
O PeriodSelector SHALL usar o tema Kinetic Dark: fundo glass morphism (`glass` ou `glass-elevated`), texto em `#E8EDF5` e `#7B89A1`, bordas em `#1A233A`, e fonte Satoshi. O menu dropdown SHALL ter estilo consistente com os demais componentes do dashboard.

#### Scenario: Visual consistency with dashboard
- **WHEN** o PeriodSelector renderiza na view de extrato
- **THEN** ele usa a classe `glass` ou `glass-elevated`, cores do design system, e tipografia Satoshi/JetBrains Mono, alinhando-se visualmente com `AppHeader`, `SummaryCard`, e demais componentes
