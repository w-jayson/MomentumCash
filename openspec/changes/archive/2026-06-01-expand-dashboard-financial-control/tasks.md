## 1. Dependencies & Setup

- [x] 1.1 Adicionar `vue3-apexcharts` e `apexcharts` ao `package.json` (dependencies)
- [x] 1.2 Registrar `VueApexCharts` como componente global em `main.js`
- [x] 1.3 Instruir o desenvolvedor a rodar `npm install` dentro do container Docker

## 2. Filtro de Mes Atual nos Summary Cards

- [x] 2.1 Adicionar computed properties `currentMonthIncome` e `currentMonthExpense` em `useTransactions.js` que filtram transacoes pelo mes e ano correntes
- [x] 2.2 Atualizar `AppHeader.vue` para usar `currentMonthIncome`/`currentMonthExpense` nos cards de Receitas/Despesas; manter `balance` (total acumulado) no card de Saldo
- [x] 2.3 Adicionar indicador visual "(mes atual)" apenas nos labels de Receitas e Despesas (nao no Saldo)
- [x] 2.4 Verificar comportamento com mes vazio (Receitas/Despesas = R$ 0,00; Saldo = total acumulado) e com transacoes de meses anteriores (nao afetam Receitas/Despesas)

## 3. Grafico de Distribuicao de Despesas por Categoria

- [x] 3.1 Criar `ExpenseChart.vue` usando `<script setup>` e componente `<apexchart>` do vue3-apexcharts
- [x] 3.2 Computar dados: agrupar despesas do mes atual por `categoryId`, obter nome da categoria via `useCategories`, somar valores
- [x] 3.3 Configurar opcoes do donut chart: fundo transparente, tooltip dark, paleta de cores customizada (coral, emerald, cyan, amber, violet)
- [x] 3.4 Implementar estado vazio (mensagem "Sem despesas este mes" quando nao houver dados)
- [x] 3.5 Agrupar transacoes sem categoria como "Sem categoria"

## 4. Timeline de Renda Comprometida

- [x] 4.1 Criar `CommitmentTimeline.vue` usando `<script setup>` e componente `<apexchart>`
- [x] 4.2 Computar projecao de parcelas: iterar transacoes com `installments > 0`, distribuir `installmentValue` por mes a partir do mes da transacao
- [x] 4.3 Computar renda media mensal: media das receitas (`type === 1`) dos ultimos 3 meses, com fallback para media historica
- [x] 4.4 Configurar opcoes do bar chart agrupado: eixo X = meses (ate 12 meses), series = ["Parcelas Projetadas", "Renda Media Mensal"], labels em portugues abreviados
- [x] 4.5 Aplicar tema dark: fundo transparente, grid lines em midnight, labels em text-secondary, cores coral/emerald
- [x] 4.6 Implementar estado vazio (mensagem quando nao houver transacoes parceladas)

## 5. Reorganizacao do Layout Grid

- [x] 5.1 Refatorar `App.vue`: adicionar secao de analytics com grid de duas colunas (`lg:grid-cols-2`) entre AppHeader e TransactionForm
- [x] 5.2 Posicionar `ExpenseChart` na coluna esquerda e `CommitmentTimeline` na coluna direita
- [x] 5.3 Envolver cada componente de grafico em container `glass-elevated` com titulo descritivo e padding
- [x] 5.4 Garantir comportamento responsivo: coluna unica em `md` (768px), grid de 3 colunas nos cards em `sm` (640px)
- [x] 5.5 Ajustar espacamento vertical entre secoes para manter fluxo visual coeso

## 6. Polish & Verificacao

- [x] 6.1 Verificar integridade visual: todos os graficos respeitam o tema Kinetic Dark (cores, glass morphism, tipografia)
- [x] 6.2 Verificar reatividade: criar/excluir transacao no formulario atualiza cards, grafico de despesas e timeline
- [x] 6.3 Verificar responsividade em viewports mobile (320px-768px) e desktop (1024px+)
- [x] 6.4 Verificar estados de borda: mes sem transacoes, mes sem despesas, sem parcelas, sem categorias
- [x] 6.5 Testar com dados reais do localStorage e confirmar que nao houve regressao nas funcionalidades existentes
