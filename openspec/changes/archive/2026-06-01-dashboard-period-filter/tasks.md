## 1. Core Period Logic in useTransactions

- [x] 1.1 Adicionar `activePeriod` ref reativo com estrutura `{ mode, startDate, endDate }` e default `{ mode: 'current-month', startDate: null, endDate: null }`
- [x] 1.2 Criar funcao utilitaria `getPeriodRange(activePeriod)` que retorna `{ start, end }` (Date objects) com base no modo (`current-month` → primeiro/ultimo dia do mes atual; `custom` → startDate/endDate)
- [x] 1.3 Criar funcao pura `isDateInRange(dateStr, startDate, endDate)` que retorna booleano comparando ano/mes/dia com o intervalo
- [x] 1.4 Criar funcao pura `isInstallmentInPeriod(tx, startDate, endDate)` que verifica se alguma parcela da transacao cai dentro do intervalo, retornando `{ active: boolean, valueInPeriod: number }`
- [x] 1.5 Implementar computed `periodIncome` — soma de `amount` de transacoes `type === 1` com `date` dentro do intervalo
- [x] 1.6 Implementar computed `periodExpense` — soma de despesas `type === 2` com logica de parcelamento (usar `isInstallmentInPeriod`) e nao-parceladas (usar `isDateInRange`)
- [x] 1.7 Implementar computed `periodBalance` — `periodIncome - periodExpense`
- [x] 1.8 Implementar computed `periodExpensesByCategory` — agrupar despesas do periodo por `categoryId`, retornar `{ labels: string[], series: number[] }` com label "Sem categoria" para `null`
- [x] 1.9 Implementar computed `periodCommitmentProjection` — projetar parcelas 12 meses a partir do inicio do periodo, com renda media dos ultimos 3 meses antes do fim do periodo (fallback para media historica)
- [x] 1.10 Manter computeds legadas (`currentMonthIncome`, `currentMonthExpense`, `totalIncome`, `totalExpense`, `balance`) como wrappers que delegam para as novas computeds de periodo
- [x] 1.11 Exportar `activePeriod`, `getPeriodRange` e todas as novas computeds no retorno de `useTransactions()`

## 2. PeriodSelector Component

- [x] 2.1 Criar `frontend/src/components/PeriodSelector.vue` com `select` para modos pre-definidos e inputs `type="date"` condicionais para modo customizado
- [x] 2.2 Implementar opcoes pre-definidas: "Mes Atual", "Ultimos 3 meses", "Ultimos 6 meses", "Ultimo ano", "Personalizado..."
- [x] 2.3 Implementar logica de atualizacao do `activePeriod` no `useTransactions` quando o usuario altera o modo ou as datas customizadas
- [x] 2.4 Aplicar estilo Kinetic Dark: classes `glass`/`glass-elevated`, cores do design system (`#E8EDF5`, `#7B89A1`, `#1A233A`), fontes Satoshi/JetBrains Mono
- [x] 2.5 Exibir label dinamico do periodo ativo (ex: "Mes Atual", "Ultimos 3 meses", "01/03/2026 - 31/05/2026")

## 3. Update Existing Components

- [x] 3.1 Atualizar `AppHeader.vue` para consumir `periodBalance`, `periodIncome`, `periodExpense` em vez de `balance`, `currentMonthIncome`, `currentMonthExpense`; passar sublabel dinamico baseado no periodo ativo
- [x] 3.2 Atualizar `ExpenseChart.vue` para consumir `periodExpensesByCategory` do `useTransactions()` em vez de calcular dados internamente com `new Date()` estatico; remover logica inline de filtro e agrupamento
- [x] 3.3 Atualizar label de estado vazio do `ExpenseChart` de "Sem despesas este mes" para mensagem dinamica conforme periodo
- [x] 3.4 Atualizar `CommitmentTimeline.vue` para consumir `periodCommitmentProjection` e `periodExpensesByCategory` do `useTransactions()` em vez de calcular projecao e renda media internamente
- [x] 3.5 Atualizar `App.vue` para renderizar `<PeriodSelector>` entre `<AppHeader>` e a `<section>` de graficos

## 4. Verification

- [x] 4.1 Testar modo "Mes Atual" — verificar que todos os cards e graficos mostram dados identicos ao comportamento atual (sem regressao)
- [x] 4.2 Testar modos pre-definidos ("Ultimos 3 meses", "Ultimos 6 meses", "Ultimo ano") — verificar que totais e graficos refletem corretamente o intervalo
- [x] 4.3 Testar modo "Personalizado" — selecionar intervalo customizado e verificar totais, grafico donut e timeline de parcelas
- [x] 4.4 Testar reatividade — alternar entre modos e verificar que todos os componentes atualizam sem reload da pagina
- [x] 4.5 Testar cenario sem transacoes — verificar que cards mostram R$ 0,00 e graficos mostram estado vazio apropriado
- [x] 4.6 Testar parcelamento em periodo parcial — verificar que apenas parcelas incidentes no intervalo sao contabilizadas
- [x] 4.7 Rodar lint/typecheck do frontend para garantir que nao ha erros de sintaxe ou tipos
