## 1. Domain & DTOs

- [x] 1.1 Adicionar propriedade `Type` (`TransactionTypeEnum`) na entidade `Category` com validação no construtor e método `SetType`
- [x] 1.2 Adicionar campo `Type` (`int`) no record `CategoryDto`
- [x] 1.3 Adicionar campo `Type` (`int`) no record `CreateCategoryDto`
- [x] 1.4 Atualizar `CategoryService.CreateAsync` para aceitar e propagar o campo `Type`

## 2. Infraestrutura & Banco de Dados

- [x] 2.1 Configurar mapeamento EF Core da nova propriedade `Type` na entidade `Category` no `AppDbContext`
- [x] 2.2 Gerar migration `AddTypeToCategory` com coluna `type` (int, NOT NULL, default 1 para registros existentes)
- [x] 2.3 Configurar seed data no `OnModelCreating` com as 16 categorias padrão usando GUIDs fixos:
  - Receita (type=1): Salário, Freelance, Rendimentos, Vendas, Cashbacks, Outros
  - Despesa (type=2): Ensino, Cartão de Crédito, Empréstimo, Habitação, Alimentação, Transporte, Saúde, Lazer, Assinaturas, Imprevistos

## 3. API

- [x] 3.1 Adicionar query parameter opcional `type` (`int?`) no `CategoriesController.GetAll` e repassar ao `CategoryService`
- [x] 3.2 Implementar filtro por `Type` no `CategoryService.GetAllAsync` (se `type` informado, filtrar; senão retornar todas)
- [x] 3.3 Adicionar validação `[Range(1, 2)]` no `CreateCategoryDto.Type`

## 4. Frontend — API Client & Storage

- [x] 4.1 Alterar `Api.fetchCategories` para aceitar parâmetro opcional `type` e enviá-lo como query string (`?type=1`)
- [x] 4.2 Atualizar `Storage.saveCategories` para persistir e recuperar o campo `type` junto com cada categoria no localStorage

## 5. Frontend — Lógica da UI

- [x] 5.1 Refatorar `App.populateCategorySelects` para aceitar um filtro opcional de tipo e popular apenas o dropdown do formulário (`#category`) com categorias do tipo selecionado
- [x] 5.2 Adicionar event listener `change` no campo `#type` que dispara `populateCategorySelects` com o tipo selecionado e reseta a seleção do dropdown de categoria para "Sem categoria"
- [x] 5.3 Manter dropdown de filtro (`#filterCategory`) populado com todas as categorias (sem filtro de tipo), já que o filtro de tipo é independente no histórico
- [x] 5.4 Ajustar `App.init()` para popular o dropdown de categoria no carregamento inicial conforme o tipo padrão selecionado (Receita)

## 6. Testes & Verificação

- [x] 6.1 Testar fluxo: selecionar Receita → dropdown de categoria exibe apenas categorias de receita
- [x] 6.2 Testar fluxo: selecionar Despesa → dropdown de categoria exibe apenas categorias de despesa
- [x] 6.3 Testar fluxo: trocar de Despesa para Receita → dropdown recarrega e reseta seleção
- [x] 6.4 Testar criar transação com categoria filtrada corretamente (Receita + "Salário")
- [x] 6.5 Testar criar transação com categoria filtrada corretamente (Despesa + "Alimentação")
- [x] 6.6 Testar modo de edição: categoria da transação existente aparece corretamente no dropdown
- [x] 6.7 Testar `GET /api/categories?type=1` retorna apenas categorias de receita
- [x] 6.8 Testar `GET /api/categories?type=2` retorna apenas categorias de despesa
- [x] 6.9 Testar `GET /api/categories` (sem type) retorna todas as categorias
- [x] 6.10 Rodar `docker compose up --build` e verificar se a aplicação sobe sem erros
