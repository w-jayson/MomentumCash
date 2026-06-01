## Why

O dashboard agora tem filtro de periodo (via `PeriodSelector`), mas a tabela de Historico (`TransactionHistory`) continua exibindo todas as transacoes sem filtro temporal. Quando o usuario seleciona um periodo no dashboard e quer inspecionar as transacoes daquele periodo, ele nao consegue — o historico permanece integral. Isso quebra a experiencia de analise: o usuario ve dados filtrados nos cards/graficos mas nao pode conferir os detalhes na tabela.

## What Changes

- Adicionar filtro de periodo (data inicio / data fim) ao `FilterBar` do Historico
- Atualizar `TransactionHistory` para aplicar o filtro de data na listagem de transacoes
- Comportamento padrao: sem filtro de data (exibe todas as transacoes, como atualmente)
- Reutilizar `activePeriod` do `useTransactions` como fonte opcional do filtro, ou expor um controle independente
- Permitir que o usuario limpe o filtro de periodo para voltar a ver todas as transacoes

## Capabilities

### New Capabilities
- `history-period-filter`: Filtro de periodo (data inicio/data fim) aplicado a tabela de historico de transacoes, com opcao de limpar o filtro e voltar ao comportamento padrao (todas as transacoes)

### Modified Capabilities
- `vue-frontend`: O `FilterBar` e `TransactionHistory` passam a suportar filtro por data; a spec existente descreve os filtros atuais (categoria e tipo) e precisa incluir o novo filtro de periodo

## Impact

- **Frontend**: `FilterBar.vue` (adicionar inputs de data), `TransactionHistory.vue` (aplicar filtro de data na computed `filteredAndSorted`), `App.vue` (adicionar `filterPeriod` ref e passa-lo como prop)
- **Backend**: Sem impacto
- **UX**: Nenhuma quebra — filtro de data comeca vazio (todas as transacoes visiveis)
