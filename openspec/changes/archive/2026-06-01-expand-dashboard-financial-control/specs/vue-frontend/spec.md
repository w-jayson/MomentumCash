## MODIFIED Requirements

### Requirement: Dashboard shows real-time financial summary

O componente `AppHeader` SHALL exibir tres cards de resumo: Saldo, Receitas e Despesas. Os valores de Receitas e Despesas SHALL ser filtrados pelo mes corrente usando `currentMonthIncome` e `currentMonthExpense`. O Saldo SHALL permanecer como total acumulado historico usando a computed `balance` existente. Os labels de Receitas e Despesas SHALL incluir indicacao "(mes atual)". O label de Saldo SHALL permanecer sem indicador de mes.

#### Scenario: Dashboard updates on transaction create
- **WHEN** o usuario cria uma nova transacao de receita de R$ 1000,00 com data do mes atual
- **THEN** o card "Receitas" (mes atual) atualiza para incluir R$ 1000,00 e o card "Saldo" (total acumulado) atualiza correspondentemente

#### Scenario: Dashboard updates on transaction delete
- **WHEN** o usuario exclui uma transacao de despesa de R$ 500,00 do mes atual
- **THEN** o card "Despesas" (mes atual) reduz em R$ 500,00 e o card "Saldo" (total acumulado) aumenta em R$ 500,00

#### Scenario: Empty current month shows zero for income/expense
- **WHEN** nao ha transacoes no mes atual mas ha transacoes em meses anteriores
- **THEN** os cards "Receitas" e "Despesas" exibem R$ 0,00; o card "Saldo" exibe o total acumulado historico

#### Scenario: Current month filter only affects income and expense cards
- **WHEN** ha transacoes de meses anteriores mas nenhuma no mes atual
- **THEN** Receitas e Despesas exibem R$ 0,00; Saldo exibe o valor liquido total de todo o historico

### Requirement: Visual theme applies Kinetic Dark design system

A interface SHALL aplicar o tema Kinetic Dark: fundo escuro (#060B14) com grid dots overlay, cards com glass morphism (backdrop-blur, bordas translucidas), tipografia Satoshi para headings e JetBrains Mono para valores monetarios, cores accent cyan/emerald/coral, e animacoes staggered na entrada dos cards. Componentes de grafico (ApexCharts) SHALL seguir o mesmo tema: fundo transparente, tooltips dark, paleta de cores derivada dos tokens do design system.

#### Scenario: Dark background with grid dots visible
- **WHEN** a pagina carrega
- **THEN** o fundo e escuro com um padrao de grid dots visivel

#### Scenario: Summary cards have glass morphism effect
- **WHEN** a pagina carrega
- **THEN** os cards de resumo exibem efeito de vidro (background translucido com blur)

#### Scenario: Monetary values use monospace font
- **WHEN** qualquer valor monetario e renderizado
- **THEN** o texto usa a fonte JetBrains Mono

#### Scenario: Chart components follow dark theme
- **WHEN** graficos ApexCharts sao renderizados
- **THEN** o fundo e transparente, textos usam text-primary (#E8EDF5), tooltips usam midnight (#1A233A), e cores de segmentos sao derivadas dos tokens do design system

## ADDED Requirements

### Requirement: ApexCharts dependency is declared in package.json
O projeto SHALL declarar `vue3-apexcharts` e `apexcharts` como dependencias no `package.json`. Nenhum comando de instalacao SHALL ser executado automaticamente — o desenvolvedor SHALL rodar `npm install` manualmente dentro do container Docker.

#### Scenario: Dependencies listed in package.json
- **WHEN** o `package.json` e inspecionado
- **THEN** `vue3-apexcharts` e `apexcharts` estao listados em `dependencies` com versoes especificas

#### Scenario: ApexCharts registered as Vue plugin
- **WHEN** a aplicacao inicializa em `main.js`
- **THEN** `VueApexCharts` e registrado como componente global via `app.component()`
