## Context

O dashboard do MomentumCash e uma SPA Vue 3 sem router. Atualmente todos os componentes (PeriodSelector, graficos, TransactionForm, TransactionHistory) sao empilhados verticalmente em App.vue, sem separacao de visoes. O usuario quer um dashboard enxuto com foco nos graficos e acesso sob demanda ao extrato completo.

Stack: Vue 3 + ApexCharts + TailwindCSS com tema "Kinetic Dark" (glass morphism, paleta void/deep/midnight/cyan/emerald/coral). Estado global via composable `useTransactions` com persistencia em localStorage e sync otimista com backend .NET.

## Goals / Non-Goals

**Goals:**
- Separar o dashboard em duas visoes: overview (graficos) e extrato (historico + periodo)
- Manter o dashboard principal minimalista: apenas `ExpenseChart` e `CommitmentTimeline` fixos no mes corrente
- Botao "Ver extrato completo" com design destacado (cyan/glass) que transiciona para a view de extrato
- View de extrato com `PeriodSelector` funcional e `TransactionHistory` com todos os filtros
- `TransactionForm` acessivel na view de extrato

**Non-Goals:**
- Nao adicionar vue-router como dependencia
- Nao alterar a logica interna dos componentes existentes (PeriodSelector, TransactionForm, TransactionHistory, ExpenseChart, CommitmentTimeline)
- Nao modificar os composables (`useTransactions`, `useApi`, etc.)
- Nao adicionar paginacao ou exportacao no extrato
- Nao alterar o comportamento de sync ou persistencia

## Decisions

### 1. View switching via reactive ref (sem router)

**Decisao:** Usar uma `ref<string>('dashboard')` no App.vue com `v-if` condicional para alternar entre as views.

**Alternativas consideradas:**
- `vue-router`: adicionaria complexidade desnecessaria (SPA de pagina unica, apenas 2 estados de view). Rejeitado por overengineering.
- `v-show`: manteria ambos os conjuntos de componentes montados simultaneamente, consumindo memoria e potencialmente causando reatividade cruzada. Rejeitado.

**Racional:** `v-if` garante que apenas a view ativa e montada. Ao alternar para dashboard, o PeriodSelector e desmontado, e o `activePeriod` e resetado para mes corrente.

### 2. activePeriod reset ao alternar views

**Decisao:** Ao entrar na view dashboard, `activePeriod` e forcado para `{ mode: 'current-month', startDate: null, endDate: null }`. Ao entrar na view extrato, mantem-se o periodo default (mes corrente) ate o usuario interagir com o PeriodSelector.

**Racional:** O dashboard principal deve sempre refletir o mes corrente. Se o usuario selecionar "Ultimos 6 meses" no extrato e voltar ao dashboard, os graficos devem mostrar apenas o mes corrente, nao os ultimos 6 meses.

### 3. Estrutura de layout das views

**Dashboard view:**
```
AppHeader (summary cards do mes corrente)
ExpenseChart + CommitmentTimeline (grid 2 colunas)
Botao "Ver extrato completo" (center, cyan/glass)
```

**Extrato view:**
```
AppHeader (summary cards refletindo periodo selecionado)
Botao "Voltar ao dashboard"
PeriodSelector (todas as opcoes de periodo)
TransactionForm (Nova Transacao)
TransactionHistory (com FilterBar)
```

**Racional:** AppHeader e compartilhado entre as views e reage ao `activePeriod` automaticamente (ja consome `periodBalance/periodIncome/periodExpense`). No dashboard, periodo e mes corrente; no extrato, reflete a selecao do usuario.

### 4. TransactionForm toggle na view extrato

**Decisao:** O TransactionForm e inicialmente colapsado (nao visivel) na view extrato, com um botao "Nova Transacao" para expandi-lo. Apos salvar, o form colapsa novamente.

**Alternativas consideradas:**
- Sempre visivel: ocuparia espaco vertical excessivo, competindo com o foco no historico.
- Modal/Dialog: mais complexo de implementar e quebra a consistencia visual do glass morphism.

**Racional:** Collapse/expand mantem a view de extrato limpa, com foco no historico, e o form so aparece quando necessario.

### 5. Design do botao "Ver extrato completo"

**Decisao:** Botao tipo CTA com classes `glass-elevated`, cor cyan, icone de seta/listagem, texto "Ver extrato completo", hover com glow cyan, animacao `scaleIn`. Centralizado abaixo dos graficos.

**Racional:** Segue o design system Kinetic Dark existente com glows e glass morphism. Deve ser visualmente distinto e convidativo.

## Risks / Trade-offs

- **[Risco] Dupla montagem do AppHeader**: AppHeader e compartilhado por ambas as views via `v-if`, o que causa unmount/remount ao alternar. Pode causar flicker nas animacoes do AnimatedCounter. **Mitigacao:** Manter AppHeader fora do bloco `v-if`, renderizando-o sempre no topo, ja que ele reage ao `activePeriod` automaticamente.
- **[Trade-off] Sem animacao de transicao entre views**: Usar `v-if` sem `<Transition>` resulta em troca abrupta. **Mitigacao:** Adicionar `<Transition>` wrapper com `fadeInUp` nas views para suavizar a transicao.
- **[Risco] Estado do form ao alternar views**: Se o usuario estiver preenchendo o TransactionForm e clicar "Voltar", perde o estado. **Mitigacao:** Aceitavel -- o form so aparece sob demanda e o fluxo esperado e: preencher → salvar → fechar.
