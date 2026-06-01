## Context

O `TransactionHistory` atualmente filtra por categoria e tipo apenas. O `useTransactions` ja possui `isDateInRange` e `isInstallmentInPeriod` (modulo-level, nao exportadas via `useTransactions()`). O `PeriodSelector` do dashboard gerencia `activePeriod` globalmente, mas nao queremos acoplar o filtro do historico ao dashboard — o usuario pode querer inspecionar transacoes de um periodo diferente do dashboard.

## Goals / Non-Goals

**Goals:**
- Adicionar filtro de data inicio/data fim no `FilterBar` do Historico
- Filtrar transacoes na tabela por periodo selecionado
- Comportamento padrao: sem filtro (todas as transacoes visiveis)
- Botao "Limpar" para resetar o filtro de data
- Reutilizar `isDateInRange` e `isInstallmentInPeriod` do `useTransactions`

**Non-Goals:**
- Nao acoplar o filtro do historico ao `activePeriod` do dashboard
- Nao adicionar presets (Mes Atual, Ultimos 3 meses, etc.) — apenas datas customizadas
- Nao alterar o `PeriodSelector` existente
- Nao alterar o backend

## Decisions

### 1. Estado do filtro de data no `App.vue`

**Decisao:** Adicionar `filterDateStart` e `filterDateEnd` como `ref('')` no `App.vue`, passados como props para `TransactionHistory` → `FilterBar`. Mantendo o padrao existente de `filterCategory` e `filterType`.

**Alternativa considerada:** Estado no proprio `FilterBar` ou `TransactionHistory`. Rejeitado porque quebra o padrao existente de two-way binding com emits.

### 2. Exportar `isDateInRange` do `useTransactions()`

**Decisao:** Adicionar `isDateInRange` e `isInstallmentInPeriod` ao objeto de retorno de `useTransactions()`. Ambas ja existem como funcoes module-level — so precisam ser incluidas no return.

**Alternativa considerada:** Duplicar a logica no componente. Rejeitado — DRY.

### 3. Layout do FilterBar com datas

**Decisao:** Adicionar dois `<input type="date">` (inicio e fim) e um `<button>` "Limpar" ao lado dos dropdowns existentes. Usar mesmo estilo Kinetic Dark (`bg-midnight border-steel text-text-primary text-xs rounded-xl px-3 py-2 input-glow`).

```html
<input type="date" ... class="..." placeholder="Inicio" />
<input type="date" ... class="..." placeholder="Fim" />
<button @click="clearDates" class="...">Limpar</button>
```

**Alternativa considerada:** Usar um date range picker de biblioteca externa. Rejeitado — inputs nativos `type="date"` sao suficientes e nao adicionam dependencia.

### 4. Logica de filtro de data no TransactionHistory

**Decisao:** Na computed `filteredAndSorted`, adicionar um bloco que filtra por `isDateInRange` se ambas as datas estiverem preenchidas. Para despesas parceladas, usar `isInstallmentInPeriod` se `installments > 0` para mostrar transacoes cujas parcelas incidem no periodo (mesmo que a data original da transacao esteja fora).

**Racional:** Se o usuario filtra o historico por "junho/2026", uma compra parcelada de janeiro que tem parcela em junho deve aparecer.

### 5. Parcelas no historico filtrado

**Decisao:** Para transacoes parceladas filtradas por periodo, mostrar a transacao normalmente (linha completa), mas sem recalcular o valor — exibe-se o `amount` total como sempre. O filtro e binario: "esta transacao tem (ou tera) alguma parcela neste periodo?".

**Racional:** O historico mostra transacoes, nao parcelas individuais. Nao queremos duplicar linhas. Se o usuario tem uma compra de R$ 1200 em 12x e filtra por junho, a transacao aparece na tabela com seu valor original, indicando "1/12 parcelas".

## Risks / Trade-offs

- **[UX] Filtrar por datas e esquecer de limpar:** Se o usuario define um filtro de data e depois esquece, pode pensar que nao tem transacoes. → **Mitigacao:** Botao "Limpar" visivel ao lado dos inputs; os inputs mostram as datas selecionadas claramente.
- **[Perf] Computed filtra array inteiro:** Filtro adicional em `filteredAndSorted` e O(n). Com centenas de transacoes e negligenciavel. → **Mitigacao:** Vue `computed` ja e lazy e memoizado.
