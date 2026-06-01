## MODIFIED Requirements

### Requirement: Transaction history displays all transactions with filters
O componente `TransactionHistory` SHALL exibir uma tabela com todas as transacoes, ordenadas por data (mais recente primeiro). Filtros por categoria, tipo e periodo (data inicio/data fim) SHALL restringir os resultados exibidos reativamente. O filtro de periodo SHALL ser opcional — quando vazio, todas as transacoes sao exibidas. Para transacoes parceladas, a transacao SHALL aparecer no historico se alguma de suas parcelas incide no periodo filtrado.

#### Scenario: Transactions sorted by date descending
- **WHEN** ha transacoes com datas 01/06/2026 e 15/05/2026
- **THEN** a transacao de 01/06/2026 aparece antes da de 15/05/2026

#### Scenario: Filter by expense type
- **WHEN** o usuario seleciona "Despesas" no filtro de tipo
- **THEN** apenas transacoes com type=2 sao exibidas na tabela

#### Scenario: Filter by category
- **WHEN** o usuario seleciona uma categoria especifica no filtro
- **THEN** apenas transacoes com aquela categoria sao exibidas

#### Scenario: Filter by date period
- **WHEN** o usuario define data inicio 01/06/2026 e data fim 30/06/2026
- **THEN** apenas transacoes com data em junho/2026 sao exibidas; transacoes parceladas com parcela em junho tambem aparecem

#### Scenario: Date filter combined with other filters
- **WHEN** o usuario filtra por periodo "junho/2026", categoria "Alimentacao" e tipo "Despesas"
- **THEN** apenas despesas de Alimentacao em junho/2026 sao exibidas

#### Scenario: Clear date filter shows all transactions
- **WHEN** o usuario limpa o filtro de data (deixa vazio)
- **THEN** todas as transacoes voltam a ser exibidas (respeitando apenas filtros de categoria e tipo, se aplicados)

#### Scenario: Installment appears when parcel falls in period
- **WHEN** o periodo filtrado e junho/2026 e ha uma despesa parcelada de 12x iniciada em janeiro/2026 (com parcela em junho)
- **THEN** a transacao parcelada aparece no historico com seu valor original e badge "1/12 parcelas"

#### Scenario: Empty state with no transactions
- **WHEN** nao ha transacoes (ou os filtros nao produzem resultados)
- **THEN** a tabela exibe a mensagem "Nenhuma transacao registrada."
