## ADDED Requirements

### Requirement: Dashboard uses two-column grid for analytics section
O `App.vue` SHALL organizar a secao intermediaria (entre os cards de resumo e o historico) em um grid de duas colunas usando CSS Grid (`grid-template-columns: 1fr 1fr`). A coluna da esquerda SHALL conter o `ExpenseChart` e a coluna da direita SHALL conter o `CommitmentTimeline`. Em viewports menores que 768px, o grid SHALL colapsar para coluna unica.

#### Scenario: Side-by-side layout on desktop
- **WHEN** a viewport tem largura >= 768px
- **THEN** o ExpenseChart e o CommitmentTimeline sao exibidos lado a lado com larguras iguais

#### Scenario: Stacked layout on mobile
- **WHEN** a viewport tem largura < 768px
- **THEN** o ExpenseChart e o CommitmentTimeline sao empilhados verticalmente, cada um ocupando largura total

#### Scenario: Equal height columns
- **WHEN** o grid de duas colunas e renderizado
- **THEN** ambas as colunas tem a mesma altura, independente do conteudo de cada componente

### Requirement: Summary cards remain full-width at top
Os tres cards de resumo (Saldo, Receitas, Despesas) SHALL permanecer em grid de 3 colunas no topo do dashboard, acima da secao de analytics. O grid de cards SHALL colapsar para coluna unica em viewports < 640px (comportamento atual mantido).

#### Scenario: Cards above analytics section
- **WHEN** a pagina renderiza
- **THEN** os cards de resumo aparecem no topo, seguidos pelo grid de analytics (ExpenseChart + CommitmentTimeline), seguidos pelo TransactionForm, e por ultimo o TransactionHistory

### Requirement: Transaction form retains current position
O `TransactionForm` SHALL permanecer em largura total (full-width) entre a secao de analytics e a tabela de historico. Nao SHALL ser movido para uma coluna lateral.

#### Scenario: Form stays full-width
- **WHEN** a pagina e renderizada em desktop
- **THEN** o formulario ocupa 100% da largura do container, abaixo do grid de analytics

### Requirement: Analytics cards use glass-elevated panel styling
Cada secao de analytics (ExpenseChart e CommitmentTimeline) SHALL ser envolvida em um container com a classe `glass-elevated` (glass morphism elevado), com titulo descritivo e padding interno consistente com o restante da UI.

#### Scenario: Chart panel has glass styling and title
- **WHEN** a pagina renderiza
- **THEN** cada painel de grafico exibe um titulo (ex: "Despesas por Categoria", "Linha do Tempo de Comprometimento") dentro de um container com efeito glass-elevated
