## MODIFIED Requirements

### Requirement: Commitment timeline shows future installment projections from period start
O componente `CommitmentTimeline` SHALL exibir um grafico de barras agrupadas que projeta, mes a mes, o total de parcelas de despesas futuras em comparacao com a renda media mensal. O eixo X SHALL representar os meses a partir do inicio do periodo selecionado (nao mais fixo no mes atual). O componente SHALL consumir a computed `periodCommitmentProjection` do `useTransactions()`.

#### Scenario: Timeline projects installments from period start month
- **WHEN** o periodo selecionado e "Ultimos 3 meses" (abril a junho/2026) e ha uma despesa parcelada de R$ 1200,00 em 12x iniciada em janeiro/2026
- **THEN** o primeiro mes do grafico e abril/2026 ("Abr/26") e mostra R$ 100,00 de parcela

#### Scenario: Timeline starts from current month when period is current month
- **WHEN** o periodo selecionado e "Mes Atual" (junho/2026)
- **THEN** o primeiro mes do grafico e junho/2026 ("Jun/26"), mantendo o comportamento original

#### Scenario: Multiple installment transactions aggregate from period start
- **WHEN** o periodo e "Mes Atual" (junho/2026), com duas despesas parceladas: R$ 1200 em 12x (R$ 100/mes) e R$ 600 em 6x (R$ 100/mes), ambas iniciando em junho/2026
- **THEN** os primeiros 6 meses mostram R$ 200,00 de parcelas, e os meses 7-12 mostram R$ 100,00

#### Scenario: Timeline shows up to 12 months ahead from period start
- **WHEN** ha parcelas que se estendem por mais de 12 meses a partir do inicio do periodo
- **THEN** o grafico limita a exibicao a 12 meses a partir do mes inicial do periodo

#### Scenario: Empty timeline when no installments exist
- **WHEN** nao ha transacoes parceladas no historico
- **THEN** o grafico exibe mensagem de placeholder "Nenhuma parcela futura"

### Requirement: Average monthly income computed from months before period end
O `CommitmentTimeline` SHALL calcular a renda media mensal com base nas transacoes de receita (`type === 1`) dos ultimos 3 meses anteriores ao fim do periodo selecionado. Se nao houver receitas nesse intervalo, SHALL usar o total de receitas dividido pelo numero de meses distintos com receitas no historico completo.

#### Scenario: Average computed from last 3 months relative to period end
- **WHEN** o periodo selecionado termina em junho/2026 e ha receitas de R$ 3000 em abril, R$ 4000 em maio, e R$ 5000 em junho
- **THEN** a renda media mensal exibida e R$ 4000,00

#### Scenario: Fallback to all-time average
- **WHEN** o usuario tem apenas 1 mes de historico com receita de R$ 5000,00 no periodo
- **THEN** a renda media mensal e R$ 5000,00

#### Scenario: Zero income shows zero base bar
- **WHEN** nao ha nenhuma transacao de receita registrada
- **THEN** a barra de "Renda Media Mensal" exibe R$ 0,00 para todos os meses
