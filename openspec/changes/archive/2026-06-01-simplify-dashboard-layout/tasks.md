## 1. App.vue view switching logic

- [x] 1.1 Adicionar ref `currentView` ('dashboard' | 'extrato') no script setup de App.vue
- [x] 1.2 Adicionar funcao `goToExtrato()` que define currentView como 'extrato' mantendo activePeriod default
- [x] 1.3 Adicionar funcao `goToDashboard()` que reseta `activePeriod` para mes corrente e define currentView como 'dashboard'
- [x] 1.4 Envolver AppHeader fora dos blocos condicionais para evitar remount ao alternar views
- [x] 1.5 Adicionar wrapper `<Transition>` com animacao `fadeInUp` entre as views

## 2. Dashboard overview layout

- [x] 2.1 Criar bloco condicional `v-if="currentView === 'dashboard'"` contendo apenas ExpenseChart e CommitmentTimeline em grid 2 colunas
- [x] 2.2 Remover PeriodSelector, TransactionForm e TransactionHistory do bloco dashboard
- [x] 2.3 Manter ConfirmModal acessivel em ambas as views (extrair para fora dos blocos condicionais)

## 3. Botao Ver extrato completo

- [x] 3.1 Criar botao "Ver extrato completo" no bloco dashboard, abaixo da grid de graficos
- [x] 3.2 Aplicar estilo CTA: classes `glass-elevated`, cor cyan, glow no hover, icone de listagem/seta, animacao `scaleIn`
- [x] 3.3 Conectar clique do botao a `goToExtrato()`

## 4. Extrato completo view layout

- [x] 4.1 Criar bloco condicional `v-if="currentView === 'extrato'"` contendo PeriodSelector, botao Nova Transacao, TransactionForm (colapsavel) e TransactionHistory
- [x] 4.2 Adicionar botao "Voltar ao dashboard" no topo da view extrato com estilo glass secundario
- [x] 4.3 Conectar clique do botao voltar a `goToDashboard()`

## 5. TransactionForm toggle na view extrato

- [x] 5.1 Adicionar ref `showForm` controlado por botao "Nova Transacao" (toggle)
- [x] 5.2 Exibir TransactionForm apenas quando `showForm === true`, com transicao suave
- [x] 5.3 Colapsar formulario automaticamente apos evento `@saved`
- [x] 5.4 Expandir formulario e preencher dados ao receber evento `@edit` (manter handler `handleEdit` existente)
