## Context

O sistema MomentumCash possui um formulário de "Nova Transação" com dropdown de Tipo (Receita/Despesa) e dropdown de Categoria. Atualmente, o dropdown de categoria exibe todas as categorias cadastradas, sem qualquer relação com o tipo selecionado. A entidade `Category` (domínio) possui apenas `Id` e `Name`, sem associação a `TransactionTypeEnum`. O frontend consome `GET /api/categories` e popula ambos os dropdowns (formulário + filtro) com todas as categorias indistintamente.

## Goals / Non-Goals

**Goals:**
- Associar cada categoria a um tipo (Income=1 ou Expense=2) no domínio, banco e DTOs
- Frontend deve filtrar dinamicamente as opções do dropdown de categoria conforme o tipo selecionado
- O filtro de categoria no histórico também deve respeitar o filtro de tipo já existente
- Seed data com as 16 categorias padrão fornecidas (6 receitas + 10 despesas)

**Non-Goals:**
- Permitir que o usuário crie novas categorias pelo frontend (já existe endpoint mas sem UI)
- Alterar a lógica de edição de transação (exibir categoria já associada corretamente é suficiente)
- Alterar a tabela de histórico além de já usar o filtro de tipo existente

## Decisions

### 1. Campo `Type` como `int` no domínio, mapeado para `TransactionTypeEnum` no serviço

**Escolha**: Adicionar `public TransactionTypeEnum Type { get; private set; }` na entidade `Category`, mapeado como coluna `type` (integer) no EF Core.

**Alternativa considerada**: Criar duas tabelas separadas (`IncomeCategories`, `ExpenseCategories`). Rejeitada por complexidade desnecessária — a semântica é a mesma entidade com um atributo discriminador.

### 2. Filtragem frontend via API com cache local

**Escolha**: O frontend buscará `GET /api/categories?type={typeValue}` ao trocar o campo Tipo. As categorias também serão cacheadas no localStorage com o campo `type`, permitindo filtragem offline quando o servidor estiver indisponível.

**Alternativa considerada**: Buscar todas as categorias uma vez e filtrar 100% no cliente. Rejeitada porque o modelo de dados muda (campo `type` é novo) e a filtragem server-side é mais consistente com a arquitetura existente.

### 3. Seed data via HasData no EF Core

**Escolha**: Configurar seed data no `OnModelCreating` com GUIDs fixos para as 16 categorias padrão.

**Alternativa considerada**: Script SQL separado ou endpoint de seed. Rejeitada — `HasData` é a abordagem padrão do EF Core, integrada ao fluxo de migration, e garante idempotência.

### 4. Query parameter opcional no endpoint de listagem

**Escolha**: `GET /api/categories?type=1` com parâmetro opcional. Se omitido, retorna todas as categorias (compatibilidade com filtro do histórico e outros consumidores).

**Razão**: Não quebra consumidores existentes; adiciona filtragem incremental.

## Risks / Trade-offs

- **[Dados existentes]** Categorias criadas pelo usuário antes da migration não terão `Type` definido → **Mitigação**: Migration define valor default `1` (Income) para registros existentes ou usa `null` permitido temporariamente e backfill em script separado.
- **[Breaking API]** `POST /api/categories` exige `type` no body; se houver clientes externos, quebrará → **Mitigação**: Apenas o próprio frontend consome a API; sem clientes externos conhecidos.
- **[Sincronização offline]** Transações criadas offline com categoria de um tipo podem ficar inconsistentes se o servidor retornar categorias diferentes → **Mitigação**: O campo `type` é armazenado junto com a categoria no localStorage, garantindo consistência local.

## Open Questions

- Nenhuma pendência identificada. As listas de categorias e regras de UX estão completamente definidas.
