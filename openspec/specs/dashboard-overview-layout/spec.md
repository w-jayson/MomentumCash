## ADDED Requirements

### Requirement: Dashboard overview shows only expense chart and commitment timeline
A view principal do dashboard (overview) SHALL exibir apenas o grafico `ExpenseChart` (Despesas por Categoria) e o grafico `CommitmentTimeline` (Renda Comprometida), ambos fixos no mes corrente. O componente `PeriodSelector` NAO SHALL ser renderizado nesta view. O componente `TransactionForm` NAO SHALL ser renderizado nesta view. O componente `TransactionHistory` NAO SHALL ser renderizado nesta view.

#### Scenario: Dashboard loads with current month data
- **WHEN** o usuario acessa o dashboard pela primeira vez
- **THEN** a view exibe apenas AppHeader (com summary cards do mes corrente), ExpenseChart mostrando despesas do mes corrente, e CommitmentTimeline mostrando projecao de parcelas a partir do mes corrente

#### Scenario: PeriodSelector is not visible on dashboard
- **WHEN** o dashboard overview esta renderizado
- **THEN** nao ha nenhum controle de selecao de periodo visivel na tela

#### Scenario: TransactionForm is not visible on dashboard
- **WHEN** o dashboard overview esta renderizado
- **THEN** o formulario de nova transacao nao aparece em nenhum lugar da tela

#### Scenario: TransactionHistory is not visible on dashboard
- **WHEN** o dashboard overview esta renderizado
- **THEN** a tabela de historico de transacoes nao aparece em nenhum lugar da tela

### Requirement: Extrato completo button renders with prominent CTA design
O dashboard overview SHALL exibir um botao "Ver extrato completo" com design destacado, posicionado centralizado abaixo dos graficos. O botao SHALL usar o tema Kinetic Dark: classes `glass-elevated`, cor cyan, glow no hover, e animacao de entrada `scaleIn`.

#### Scenario: Button renders centered below charts
- **WHEN** o dashboard overview esta renderizado
- **THEN** um botao com texto "Ver extrato completo" aparece centralizado abaixo da grid de graficos (ExpenseChart + CommitmentTimeline)

#### Scenario: Button has cyan glass-elevated design
- **WHEN** o botao "Ver extrato completo" renderiza
- **THEN** ele usa as classes `glass-elevated`, cor de texto cyan, borda cyan com glow no hover, e tipografia Satoshi

#### Scenario: Button click navigates to extrato view
- **WHEN** o usuario clica no botao "Ver extrato completo"
- **THEN** a view transiciona para a view de extrato completo

### Requirement: Active period is locked to current month on dashboard
O `activePeriod` no `useTransactions` SHALL ser forcado para `{ mode: 'current-month', startDate: null, endDate: null }` sempre que a view dashboard overview estiver ativa. Ao navegar para a view dashboard a partir de qualquer outra view, o `activePeriod` SHALL ser resetado para mes corrente.

#### Scenario: Period resets when entering dashboard
- **WHEN** o usuario esta na view de extrato com periodo "Ultimos 6 meses" selecionado e clica em "Voltar ao dashboard"
- **THEN** o activePeriod e resetado para mes corrente e os graficos e summary cards refletem apenas o mes atual

#### Scenario: Period stays current month during dashboard session
- **WHEN** o usuario permanece na view dashboard overview
- **THEN** o activePeriod permanece em `current-month`; nao ha como o usuario altera-lo nesta view

### Requirement: View transition uses fade animation
A transicao entre dashboard overview e extrato completo SHALL usar animacao `fadeInUp` definida no design system para suavizar a troca de componentes.

#### Scenario: Transition from dashboard to extrato animates
- **WHEN** o usuario clica em "Ver extrato completo"
- **THEN** a view de extrato aparece com animacao fade-in-up (opacidade 0→1, translateY 24px→0 ao longo de 0.6s)

#### Scenario: Transition from extrato to dashboard animates
- **WHEN** o usuario clica em "Voltar ao dashboard" na view de extrato
- **THEN** a view dashboard aparece com animacao fade-in-up
