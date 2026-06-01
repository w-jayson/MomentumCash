## Why

O dashboard exibe dados financeiros com escopo temporal inconsistente: o card de Saldo usa o total historico acumulado, os cards de Receita/Despesa usam apenas o mes atual, e os graficos (Despesas por Categoria e Renda Comprometida) tambem estao fixados no mes corrente. O usuario nao consegue filtrar dados por um periodo customizado — so ve o total geral ou o mes atual, sem meio-termo. Isso impede analises como "quanto gastei em Alimentacao nos ultimos 3 meses" ou "qual foi minha renda comprometida entre janeiro e marco".

## What Changes

- Adicionar um seletor de periodo (mes atual / intervalo customizado) ao topo do dashboard
- Refatorar `useTransactions` para expor computed properties que respeitam o periodo selecionado dinamicamente (substituindo as atuais fixas `currentMonthIncome`/`currentMonthExpense`)
- Atualizar os SummaryCards (Saldo, Receitas, Despesas) para refletirem o periodo selecionado
- Atualizar `ExpenseChart` (Despesas por Categoria) para reagir ao periodo selecionado
- Atualizar `CommitmentTimeline` (Renda Comprometida) para projetar a partir do periodo selecionado
- Manter o comportamento atual como default (mes atual) para nao quebrar a experiencia existente

## Capabilities

### New Capabilities
- `dashboard-period-selector`: Componente UI de selecao de periodo com opcoes pre-definidas (Mes Atual, Ultimos 3 meses, Ultimos 6 meses, Ultimo ano) e opcao de intervalo customizado (data inicio e data fim)
- `period-aware-computations`: Logica reativa no `useTransactions` que recalcula totais de receita, despesa, saldo, agrupamento por categoria e projecao de parcelas com base no periodo selecionado

### Modified Capabilities
- `dashboard-month-filter`: As computed properties `currentMonthIncome` e `currentMonthExpense` serao substituidas por `periodIncome`, `periodExpense` e `periodBalance` que aceitam um intervalo dinamico; a API publica existente sera mantida com fallback para mes atual
- `expense-category-chart`: O grafico donut deixara de usar `new Date()` estatico e passara a consumir o periodo selecionado do `useTransactions`, reagindo a mudancas de filtro
- `commitment-timeline`: O grafico de projecao de parcelas usara o periodo selecionado como referencia de inicio da projecao (em vez de sempre o mes atual), e a renda media mensal sera calculada com base nas receitas do periodo

## Impact

- **Frontend**: `useTransactions.js` (nova logica de filtro por periodo, novas computeds), `App.vue` (novo componente PeriodSelector), `AppHeader.vue` (consumir novas computeds), `ExpenseChart.vue` (consumir periodo), `CommitmentTimeline.vue` (consumir periodo)
- **Backend**: Sem impacto imediato — toda a filtragem permanece client-side. Uma futura iteracao pode mover a logica para o backend com queries por periodo na API
- **UX**: Nenhuma quebra — periodo default e "Mes Atual", preservando o comportamento atual
