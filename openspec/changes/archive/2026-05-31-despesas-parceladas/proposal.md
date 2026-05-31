## Why

Hoje o sistema registra transações de forma pontual (data única), sem suporte a compras parceladas recorrentes. Isso impede a projeção de fluxo de caixa futuro para despesas como cartão de crédito e empréstimos, que comprometem a renda por múltiplos meses. O usuário precisa enxergar o impacto real dessas obrigações no orçamento mensal.

## What Changes

- Adicionar toggle "Compra parcelada?" no formulário de transação, visível apenas quando Tipo = Despesa
- Exibir campos de **Quantidade de parcelas** e **Valor da parcela** ao ativar o toggle
- Permitir cálculo automático do valor da parcela a partir do valor total da transação
- Incluir os campos `installments` e `installmentValue` no payload de criação/edição de transações
- Estender o modelo de domínio, DTOs e banco de dados para persistir os dados de parcelamento
- Renderizar indicador visual de parcelamento na listagem de transações (ex: "3/12 parcelas")

## Capabilities

### New Capabilities

- `installment-expenses`: Persistência e exibição de dados de parcelamento para transações do tipo Despesa, incluindo quantidade de parcelas e valor individual de cada parcela.

### Modified Capabilities

<!-- Nenhuma spec existente é alterada. -->

## Impact

- **Frontend**: `index.html` (novos campos no formulário), `app.js` (lógica de toggle + cálculo de parcela + serialização), `api.js` (payload estendido), `storage.js` (novos campos no cache offline)
- **Backend - Domínio**: `Transaction` (novos campos `Installments`, `InstallmentValue` no modelo e value objects)
- **Backend - Application**: `CreateTransactionDto`, `UpdateTransactionDto`, `TransactionDto` (novos campos)
- **Backend - Infrastructure**: Migration EF Core para novas colunas `Installments`, `InstallmentValue` na tabela `Transactions`
- **Banco de dados**: Colunas `installments INT NULL` e `installment_value DECIMAL NULL` na tabela `Transactions`
