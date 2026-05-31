## ADDED Requirements

### Requirement: Installment toggle is visible only for expense transactions

No formulário de "Nova Transação", o campo "Compra parcelada?" (checkbox) SHALL ser exibido apenas quando o campo Tipo estiver com o valor "Despesa" (2). Ao alternar o Tipo para "Receita" (1), o toggle e os campos de parcelamento associados SHALL ser ocultados e resetados.

#### Scenario: Toggle hidden when type is income
- **WHEN** o usuário seleciona "Receita" (valor 1) no campo Tipo
- **THEN** o checkbox "Compra parcelada?" e a seção de campos de parcelamento NÃO são exibidos no formulário

#### Scenario: Toggle shown when type is expense
- **WHEN** o usuário seleciona "Despesa" (valor 2) no campo Tipo
- **THEN** o checkbox "Compra parcelada?" é exibido no formulário, abaixo do campo Tipo

#### Scenario: Changing type from expense to income resets installment state
- **WHEN** o usuário marca "Compra parcelada?" e preenche campos de parcelamento com Tipo = Despesa, e então altera o Tipo para Receita
- **THEN** o checkbox é desmarcado, os campos de parcelamento são ocultados, e os valores de `installments` e `installmentValue` são resetados para null

### Requirement: Installment fields are shown when toggle is activated

Quando o checkbox "Compra parcelada?" estiver marcado, o formulário SHALL exibir dois novos inputs: "Quantidade de parcelas" (number, integer, min 2) e "Valor da parcela" (number, decimal, min 0.01). Ambos os campos SHALL ser obrigatórios enquanto o toggle estiver ativo.

#### Scenario: Fields appear on toggle activation
- **WHEN** o usuário marca o checkbox "Compra parcelada?" com Tipo = Despesa
- **THEN** os campos "Quantidade de parcelas" e "Valor da parcela" tornam-se visíveis

#### Scenario: Fields hidden on toggle deactivation
- **WHEN** o usuário desmarca o checkbox "Compra parcelada?"
- **THEN** os campos "Quantidade de parcelas" e "Valor da parcela" são ocultados e seus valores são resetados

#### Scenario: Validation fails when fields are empty with toggle active
- **WHEN** o usuário submete o formulário com "Compra parcelada?" marcado mas sem preencher "Quantidade de parcelas" ou "Valor da parcela"
- **THEN** o formulário NÃO é enviado e os campos não preenchidos recebem destaque de erro (classe `error`)

### Requirement: Auto-calculation of installment value from total amount

Quando o campo "Quantidade de parcelas" é preenchido e o campo "Valor" (amount) já possui valor, o sistema SHALL calcular automaticamente `Valor da parcela = Valor / Quantidade de parcelas` e preencher o campo. O campo "Valor da parcela" SHALL permanecer editável para ajuste manual.

#### Scenario: Auto-fill installment value on installments change
- **WHEN** o usuário preenche Valor = 1200.00, marca "Compra parcelada?" e digita "12" no campo Quantidade de parcelas
- **THEN** o campo Valor da parcela é automaticamente preenchido com 100.00

#### Scenario: Auto-fill installment value on amount change
- **WHEN** o usuário já preencheu Quantidade de parcelas = 6 e então altera o campo Valor para 600.00
- **THEN** o campo Valor da parcela é atualizado para 100.00

#### Scenario: Manual override of auto-calculated value
- **WHEN** o valor da parcela foi auto-calculado e o usuário edita manualmente o campo "Valor da parcela" para um valor diferente
- **THEN** o valor digitado manualmente é mantido e não é sobrescrito pelo auto-cálculo até que o usuário altere novamente o Valor ou a Quantidade de parcelas

### Requirement: Installment data is included in transaction payload

O payload enviado ao backend via `POST /api/transactions` e `PUT /api/transactions/{id}` SHALL incluir os campos opcionais `installments` (int) e `installmentValue` (decimal). Quando a transação não for parcelada, ambos os campos SHALL ser omitidos ou enviados como `null`.

#### Scenario: Create installment expense
- **WHEN** o sistema envia `POST /api/transactions` com body `{ "description": "Notebook", "amount": 3600.00, "date": "2026-06-01T00:00:00", "type": 2, "installments": 12, "installmentValue": 300.00 }`
- **THEN** o backend cria a transação com `Installments = 12` e `InstallmentValue = 300.00` e retorna o DTO com esses campos

#### Scenario: Create non-installment expense
- **WHEN** o sistema envia `POST /api/transactions` com body `{ "description": "Supermercado", "amount": 250.00, "date": "2026-06-01T00:00:00", "type": 2 }`
- **THEN** o backend cria a transação com `Installments = null` e `InstallmentValue = null`

#### Scenario: Create income transaction ignores installment fields
- **WHEN** o sistema envia `POST /api/transactions` com body `{ "description": "Salário", "amount": 5000.00, "date": "2026-06-01T00:00:00", "type": 1, "installments": 3, "installmentValue": 1666.67 }`
- **THEN** o backend ignora os campos de parcelamento e cria a transação com `Installments = null` e `InstallmentValue = null`

### Requirement: Installment data is persisted and returned in queries

A tabela `Transactions` SHALL conter as colunas `installments` (INT NULL) e `installment_value` (DECIMAL NULL). O endpoint `GET /api/transactions` SHALL retornar esses campos em cada `TransactionDto`. O endpoint `GET /api/transactions/{id}` SHALL também retorná-los.

#### Scenario: Get all transactions includes installment data
- **WHEN** o sistema recebe `GET /api/transactions`
- **THEN** o JSON de resposta contém, para cada transação parcelada, os campos `installments` e `installmentValue` com os valores persistidos

#### Scenario: Get single transaction includes installment data
- **WHEN** o sistema recebe `GET /api/transactions/{id}` para uma transação parcelada
- **THEN** o JSON de resposta contém `installments` e `installmentValue`

### Requirement: Installment indicator is displayed in transaction table

Na tabela de histórico, transações parceladas SHALL exibir um indicador visual (texto) no formato "N/M parcelas", onde N é o número da parcela atual (fixo como 1 neste change) e M é a quantidade total. Transações sem parcelamento NÃO devem exibir esse indicador.

#### Scenario: Expense with installments shows indicator
- **WHEN** a tabela renderiza uma transação despesa com `installments = 12` e `installmentValue = 300.00`
- **THEN** a linha exibe "1/12 parcelas" próximo à descrição

#### Scenario: Expense without installments shows no indicator
- **WHEN** a tabela renderiza uma transação despesa sem `installments`
- **THEN** a linha NÃO exibe indicador de parcelamento

#### Scenario: Edit form restores installment fields
- **WHEN** o usuário clica em "Editar" em uma transação parcelada
- **THEN** o formulário é preenchido com Tipo = Despesa, o checkbox "Compra parcelada?" aparece marcado, e os campos de parcelamento exibem os valores salvos
