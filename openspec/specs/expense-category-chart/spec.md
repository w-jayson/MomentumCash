## ADDED Requirements

### Requirement: Expense donut chart renders with ApexCharts
O componente `ExpenseChart` SHALL renderizar um grafico do tipo donut usando `vue3-apexcharts` que mostra a distribuicao percentual das despesas por categoria dentro do mes atual. O grafico SHALL ser responsivo e ocupar a largura total do seu container.

#### Scenario: Chart displays expense categories for current month
- **WHEN** ha despesas no mes atual: R$ 500,00 na categoria "Alimentacao" e R$ 300,00 na categoria "Transporte"
- **THEN** o donut exibe dois segmentos com os labels "Alimentacao" (62.5%) e "Transporte" (37.5%)

#### Scenario: Chart shows empty state when no expenses
- **WHEN** nao ha despesas no mes atual
- **THEN** o grafico exibe uma mensagem de placeholder "Sem despesas este mes" ou estado visual vazio equivalente

#### Scenario: Chart shows empty state when no categories match
- **WHEN** ha despesas mas nenhuma possui categoria associada (categoryId = null)
- **THEN** o grafico agrupa todas como "Sem categoria" em um unico segmento

### Requirement: Chart theme aligns with Kinetic Dark design system
O grafico SHALL usar cores que respeitam o tema Kinetic Dark: fundo transparente (para integrar com glass morphism), tooltip com background escuro e texto claro, e paleta de cores derivada dos tokens do design system (coral, emerald, cyan e variacoes). O grafico SHALL NAO usar cores padrao do ApexCharts.

#### Scenario: Dark theme applied to chart
- **WHEN** o componente monta
- **THEN** o fundo do grafico e transparente, o texto dos labels usa `#E8EDF5` (text-primary), e os tooltips usam `#1A233A` (midnight) como background

#### Scenario: Custom color palette for segments
- **WHEN** o donut renderiza multiplas categorias
- **THEN** cada segmento usa uma cor da paleta customizada (derivada de coral, emerald, cyan, amber, violet, etc.), nao das cores padrao do ApexCharts

### Requirement: Chart data is computed from useTransactions
O `ExpenseChart` SHALL usar as computed properties de `useTransactions()` para obter transacoes de despesa do mes atual, agrupadas por categoria. Nao SHALL fazer chamadas HTTP diretas nem acessar localStorage.

#### Scenario: Chart reacts to new expense transaction
- **WHEN** o usuario cria uma despesa no mes atual
- **THEN** o donut atualiza automaticamente com o novo segmento ou segmento expandido
