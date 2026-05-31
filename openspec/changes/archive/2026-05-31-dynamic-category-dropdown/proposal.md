## Why

O formulário de "Nova Transação" exibe todas as categorias cadastradas independentemente do tipo de transação selecionado (Receita/Despesa). Isso prejudica a experiência do usuário, que precisa navegar por opções irrelevantes (ex.: "Salário" aparece mesmo quando o tipo é "Despesa"). A correção melhora a usabilidade e reduz erros de categorização.

## What Changes

- Associar cada categoria a um tipo de transação (`TransactionTypeEnum`: Income=1, Expense=2)
- Adicionar seed data com as categorias padrão de Receita e Despesa definidas pelo domínio
- Tornar o endpoint `GET /api/categories` filtrável por tipo via query parameter `?type=1`
- Frontend: popular o dropdown de categoria dinamicamente conforme o tipo selecionado, recarregando da API/cache ao trocar o campo Tipo
- **BREAKING**: `CategoryDto` e `CreateCategoryDto` ganham o campo `Type` (int); `POST /api/categories` passa a exigir `type` no body
- **BREAKING**: Migration adiciona coluna `Type` na tabela `Categories` (valores existentes precisam de valor default ou backfill)

## Capabilities

### New Capabilities
- `category-type-association`: Associa categorias a um tipo de transação (Receita ou Despesa) e expõe filtro por tipo na API de listagem

### Modified Capabilities
<!-- Nenhuma capability existente em openspec/specs/ -->

## Impact

- **Backend**: Entity `Category`, DTOs `CategoryDto`/`CreateCategoryDto`, `CategoryService`, `CategoriesController`, `AppDbContext` (migration + seed)
- **Frontend**: `app.js` (`populateCategorySelects`, novo event listener no campo Tipo), `api.js` (`fetchCategories` com parâmetro opcional `type`), `storage.js` (categorias passam a armazenar campo `type`)
- **Banco de dados**: Migration `AddTypeToCategory` + seed data das 16 categorias padrão
