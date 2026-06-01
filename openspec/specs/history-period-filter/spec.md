## ADDED Requirements

### Requirement: FilterBar includes date range inputs for period filtering
O componente `FilterBar` SHALL incluir dois inputs `type="date"` (data inicio e data fim) e um botao "Limpar" para resetar o filtro de periodo. Os inputs SHALL seguir o estilo Kinetic Dark (`bg-midnight border-steel text-text-primary text-xs rounded-xl px-3 py-2 input-glow`). Quando ambas as datas estao preenchidas, o `FilterBar` SHALL emitir eventos `update:filterDateStart` e `update:filterDateEnd` com os valores ISO.

#### Scenario: Date inputs render next to existing filters
- **WHEN** o `FilterBar` renderiza
- **THEN** os inputs de data inicio e data fim aparecem a direita dos dropdowns de categoria e tipo, com um botao "Limpar" ao lado

#### Scenario: Clear button resets date filters
- **WHEN** o usuario clica no botao "Limpar" apos ter preenchido datas
- **THEN** ambos os inputs de data sao limpos (string vazia) e os eventos `update:filterDateStart` e `update:filterDateEnd` emitem `''`

#### Scenario: Date change emits event
- **WHEN** o usuario seleciona 01/06/2026 no input de data inicio
- **THEN** o evento `update:filterDateStart` emite `'2026-06-01'`

#### Scenario: Default state has empty dates
- **WHEN** o `FilterBar` monta pela primeira vez
- **THEN** ambos os inputs de data estao vazios e nenhum filtro de periodo e aplicado

### Requirement: TransactionHistory applies date filter to transaction list
O `TransactionHistory` SHALL aplicar filtro de data na computed `filteredAndSorted`. Quando `filterDateStart` e `filterDateEnd` estao preenchidos, SHALL usar `isDateInRange(t.date, start, end)` para filtrar transacoes cujo `date` esta no intervalo. Para transacoes parceladas (`installments > 0`), SHALL usar `isInstallmentInPeriod` para incluir a transacao se alguma parcela incide no periodo. Quando as datas estao vazias, SHALL exibir todas as transacoes (comportamento padrao).

#### Scenario: Date filter restricts transactions
- **WHEN** `filterDateStart` e '2026-06-01' e `filterDateEnd` e '2026-06-30' e ha transacoes em maio e junho
- **THEN** apenas transacoes com data em junho/2026 sao exibidas

#### Scenario: Installment transaction appears when installment falls in period
- **WHEN** o periodo filtrado e junho/2026 e ha uma despesa parcelada de janeiro/2026 com parcela em junho
- **THEN** a transacao parcelada aparece no historico (mesmo com data original em janeiro)

#### Scenario: Empty dates show all transactions
- **WHEN** `filterDateStart` e `filterDateEnd` estao vazios
- **THEN** todas as transacoes sao exibidas (comportamento padrao, sem filtro de data)

#### Scenario: Date filter combines with category and type filters
- **WHEN** o usuario filtra por periodo "junho/2026", categoria "Alimentacao" e tipo "Despesas"
- **THEN** apenas despesas de Alimentacao em junho/2026 sao exibidas
