## ADDED Requirements

### Requirement: Category is associated with a transaction type

Cada categoria SHALL pertencer a exatamente um tipo de transação: Receita (Income=1) ou Despesa (Expense=2). O campo `Type` é obrigatório na criação de novas categorias.

#### Scenario: Create income category
- **WHEN** o sistema recebe `POST /api/categories` com body `{ "name": "Salário", "type": 1 }`
- **THEN** a categoria é criada com `Type = Income` e retornada no response com o campo `type: 1`

#### Scenario: Create expense category
- **WHEN** o sistema recebe `POST /api/categories` com body `{ "name": "Alimentação", "type": 2 }`
- **THEN** a categoria é criada com `Type = Expense` e retornada no response com o campo `type: 2`

#### Scenario: Create category without type fails validation
- **WHEN** o sistema recebe `POST /api/categories` sem o campo `type`
- **THEN** retorna HTTP 400 com mensagem de validação indicando que `type` é obrigatório

### Requirement: List categories filtered by type

O endpoint `GET /api/categories` SHALL aceitar um query parameter opcional `type`. Quando informado, retorna apenas categorias do tipo especificado. Quando omitido, retorna todas as categorias.

#### Scenario: Filter income categories
- **WHEN** o sistema recebe `GET /api/categories?type=1`
- **THEN** retorna apenas categorias cujo `Type` é igual a `1` (Income)

#### Scenario: Filter expense categories
- **WHEN** o sistema recebe `GET /api/categories?type=2`
- **THEN** retorna apenas categorias cujo `Type` é igual a `2` (Expense)

#### Scenario: List all categories without filter
- **WHEN** o sistema recebe `GET /api/categories` sem o parâmetro `type`
- **THEN** retorna todas as categorias independentemente do tipo

### Requirement: Category dropdown filters dynamically by selected type

No formulário de "Nova Transação", o dropdown de Categoria SHALL exibir apenas as categorias correspondentes ao tipo selecionado no campo Tipo. Ao alterar o Tipo, o dropdown de Categoria SHALL ser recarregado automaticamente.

#### Scenario: Select income type shows income categories
- **WHEN** o usuário seleciona "Receita" (valor 1) no campo Tipo
- **THEN** o dropdown de Categoria exibe apenas categorias com `Type = 1` (ex.: Salário, Freelance, Rendimentos, Vendas, Cashbacks, Outros)

#### Scenario: Select expense type shows expense categories
- **WHEN** o usuário seleciona "Despesa" (valor 2) no campo Tipo
- **THEN** o dropdown de Categoria exibe apenas categorias com `Type = 2` (ex.: Alimentação, Transporte, Saúde, Lazer, etc.)

#### Scenario: Change type resets category selection
- **WHEN** o usuário altera o campo Tipo após já ter selecionado uma categoria
- **THEN** o dropdown de Categoria é recarregado com as categorias do novo tipo e a seleção anterior é redefinida para "Sem categoria"

### Requirement: Default categories are seeded with type association

O sistema SHALL conter seed data com as categorias padrão de Receita e Despesa, cada uma com seu respectivo tipo e GUID fixo.

#### Scenario: Income seed categories exist after migration
- **WHEN** a migration é aplicada
- **THEN** as categorias Salário, Freelance, Rendimentos, Vendas, Cashbacks e Outros existem no banco com `Type = 1`

#### Scenario: Expense seed categories exist after migration
- **WHEN** a migration é aplicada
- **THEN** as categorias Ensino, Cartão de Crédito, Empréstimo, Habitação, Alimentação, Transporte, Saúde, Lazer, Assinaturas e Imprevistos existem no banco com `Type = 2`
