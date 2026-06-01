## Why

O dashboard atual empilha todos os componentes verticalmente (gráficos, formulário de transação, histórico/extrato) em uma única página, o que sobrecarrega visualmente a tela principal e dilui o foco nos indicadores financeiros mais importantes. Separar as visões permite um dashboard enxuto focado em "Despesas por Categoria" e "Renda Comprometida", enquanto extrato e nova transação ficam acessíveis sob demanda em uma view dedicada.

## What Changes

- **Remover** o `PeriodSelector` da tela principal do dashboard
- **Manter** apenas os gráficos `ExpenseChart` (Despesas por Categoria) e `CommitmentTimeline` (Renda Comprometida) como conteúdo principal, fixos no mês corrente
- **Adicionar** botão "Ver extrato completo" com design destacado que redireciona para a view de extrato
- **Criar** view de extrato completo que contém: `PeriodSelector` (com todas as opções de período) e `TransactionHistory` com filtros
- **Mover** o `TransactionForm` para ser acessível via botão "Nova Transação" na view de extrato ou na própria tela de extrato
- **Remover** `TransactionForm` e `TransactionHistory` da tela principal do dashboard
- **Manter** o `AppHeader` com summary cards (Saldo, Receitas, Despesas) refletindo o mês corrente em ambos os modos

## Capabilities

### New Capabilities
- `dashboard-overview-layout`: Layout simplificado do dashboard principal exibindo apenas os gráficos ExpenseChart e CommitmentTimeline fixos no mês corrente, sem PeriodSelector, com botão de atalho para extrato completo
- `extrato-completo-view`: View dedicada de extrato completo contendo PeriodSelector (todos os presets e custom), TransactionHistory com FilterBar, e acesso ao TransactionForm

### Modified Capabilities
- `dashboard-period-selector`: O PeriodSelector deixa de ser exibido no dashboard principal e passa a renderizar exclusivamente na view de extrato completo; sua API reativa (`activePeriod`) permanece inalterada

## Impact

- `App.vue`: reestruturação do template e gerenciamento de visões (modo dashboard vs modo extrato)
- `components/PeriodSelector.vue`: sem alterações internas; apenas remoção do template principal
- `components/ExpenseChart.vue`: sem alterações; continuará consumindo `periodExpensesByCategory` com período fixo no mês corrente
- `components/CommitmentTimeline.vue`: sem alterações; continuará consumindo `periodCommitmentProjection` com período fixo no mês corrente
- `components/TransactionForm.vue`: sem alterações internas; movido de local no layout
- `components/TransactionHistory.vue`: sem alterações internas; movido de local no layout
- `components/AppHeader.vue`: cards de summary devem refletir o período ativo (mês corrente no dashboard, período selecionado no extrato)
- `composables/useTransactions.js`: sem alterações; `activePeriod` permanece como fonte reativa global
