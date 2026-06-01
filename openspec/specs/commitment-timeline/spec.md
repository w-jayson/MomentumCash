## ADDED Requirements

### Requirement: Commitment timeline shows future installment projections
O componente `CommitmentTimeline` SHALL exibir um grafico de barras agrupadas que projeta, mes a mes, o total de parcelas de despesas futuras em comparacao com a renda media mensal. O eixo X SHALL representar os meses (atual + proximos N meses) e o eixo Y SHALL representar valores em R$. Cada mes SHALL ter duas barras lado a lado: "Parcelas Projetadas" e "Renda Media Mensal".

#### Scenario: Timeline projects installments across months
- **WHEN** ha uma despesa parcelada de R$ 1200,00 em 12x criada em junho/2026
- **THEN** o grafico mostra barras de R$ 100,00 por mes de junho/2026 ate maio/2027

#### Scenario: Multiple installment transactions aggregate per month
- **WHEN** ha duas despesas parceladas: R$ 1200,00 em 12x (R$ 100/mes) e R$ 600,00 em 6x (R$ 100/mes), ambas iniciando em junho/2026
- **THEN** os primeiros 6 meses mostram R$ 200,00 de parcelas, e os meses 7-12 mostram R$ 100,00

#### Scenario: Timeline shows up to 12 months ahead
- **WHEN** ha parcelas que se estendem por mais de 12 meses
- **THEN** o grafico limita a exibicao a 12 meses (incluindo o mes atual)

#### Scenario: Empty timeline when no installments exist
- **WHEN** nao ha transacoes parceladas no historico
- **THEN** o grafico exibe mensagem de placeholder "Nenhuma parcela futura" ou renderiza barras com valor zero

### Requirement: Average monthly income is computed from transaction history
O `CommitmentTimeline` SHALL calcular a renda media mensal com base nas transacoes de receita (`type === 1`) dos ultimos 3 meses (incluindo o mes atual). Se nao houver receitas nesse periodo, SHALL usar o total de receitas dividido pelo numero de meses distintos com receitas no historico completo.

#### Scenario: Average computed from last 3 months
- **WHEN** o usuario teve receitas de R$ 3000,00, R$ 4000,00 e R$ 5000,00 nos ultimos 3 meses
- **THEN** a renda media mensal exibida no grafico e R$ 4000,00

#### Scenario: Fallback to all-time average
- **WHEN** o usuario tem apenas 1 mes de historico com receita de R$ 5000,00
- **THEN** a renda media mensal e R$ 5000,00

#### Scenario: Zero income shows zero base bar
- **WHEN** nao ha nenhuma transacao de receita registrada
- **THEN** a barra de "Renda Media Mensal" exibe R$ 0,00 para todos os meses

### Requirement: Timeline uses ApexCharts bar chart with dark theme
O componente SHALL usar `vue3-apexcharts` com tipo `bar`. O grafico SHALL ter fundo transparente, tooltips com tema dark, e paleta de cores: coral para "Parcelas Projetadas" e emerald/cyan para "Renda Media Mensal". O layout SHALL ser horizontal (eixo X = meses) com altura fixa de ~300px.

#### Scenario: Dark theme bar chart renders
- **WHEN** o componente monta
- **THEN** o grafico de barras agrupadas renderiza com fundo transparente, grid lines sutis em `#1A233A`, labels dos eixos em `#7B89A1` (text-secondary)

#### Scenario: Tooltip shows details on hover
- **WHEN** o usuario passa o mouse sobre uma barra de mes
- **THEN** o tooltip exibe o nome do mes, o valor total de parcelas e o valor da renda media

### Requirement: Month labels display abbreviated names in Portuguese
Os rotulos do eixo X SHALL usar nomes de meses abreviados em portugues: "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez".

#### Scenario: Current month is June 2026
- **WHEN** o mes atual e junho de 2026
- **THEN** o primeiro rotulo do eixo X e "Jun/26", o segundo e "Jul/26", etc.
