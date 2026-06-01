## Context

Atualmente o dashboard tem escopo temporal inconsistente: `balance` usa historico total, `currentMonthIncome`/`currentMonthExpense` usam mes atual fixo, e o `ExpenseChart`/`CommitmentTimeline` capturam `new Date()` estaticamente no `setup()`. Nao ha mecanismo reativo para alternar entre periodos.

O `useTransactions.js` (`frontend/src/composables/useTransactions.js`) e o unico modulo de estado financeiro — ele expoe `state.transactions` (array reativo) e varias computeds. Toda a UI consome esse composable. A estrategia e injetar o conceito de "periodo ativo" diretamente nesse modulo, para que todos os consumidores recebam dados filtrados automaticamente.

> RESTRICAO: Nao modificar o backend agora. Toda filtragem e client-side. O `balance` deve refletir o periodo selecionado (nao mais o total historico inevitavelmente — o usuario escolhe).

## Goals / Non-Goals

**Goals:**
- Permitir que o usuario selecione um periodo (predefinido ou customizado) e veja todos os cards e graficos refletirem esse periodo
- Manter o comportamento default como "Mes Atual" (preservando a experiencia atual)
- Implementar reatividade: ao mudar o periodo, todos os componentes atualizam automaticamente
- Separar corretamente a logica de parcelamento: se o periodo selecionado cobre meses onde parcelas incidem, elas devem ser contabilizadas proporcionalmente

**Non-Goals:**
- Nao alterar o backend ou a API REST
- Nao persistir a preferencia de periodo (reseta ao recarregar a pagina)
- Nao implementar filtro de periodo no `TransactionHistory` (escopo separado)
- Nao alterar a paleta de cores ou design system existente

## Decisions

### 1. Estado do periodo no `useTransactions` (composable)

**Decisao:** Adicionar um `ref` reativo `activePeriod` dentro do escopo do modulo `useTransactions`, com default `{ mode: 'current-month', startDate: null, endDate: null }`.

**Alternativa considerada:** Estado no `App.vue` passado via props. Rejeitado porque exigiria prop drilling para `ExpenseChart`, `CommitmentTimeline`, `AppHeader`, e `SummaryCard` — poluindo a interface de 4+ componentes.

**Racional:** O periodo e uma preocupacao transversal do dominio financeiro. Centralizar no composable que ja detem os dados evita acoplamento entre componentes de UI.

```js
const activePeriod = ref({
  mode: 'current-month', // 'current-month' | 'custom'
  startDate: null,       // Date | null (ISO string no storage)
  endDate: null,         // Date | null (ISO string no storage)
})
```

### 2. Funcao utilitaria `isInPeriod(dateStr, startDate, endDate)` + `isInstallmentInPeriod(tx, startDate, endDate)`

**Decisao:** Criar uma funcao pura `isInPeriod` que recebe uma data ISO 8601 e um intervalo `[start, end]` e retorna booleano. Para o modo `current-month`, `start` e `end` sao o primeiro e ultimo dia do mes atual. Para `custom`, sao as datas escolhidas pelo usuario.

Para parcelas, `isInstallmentInPeriod` calcula se alguma das parcelas da transacao cai dentro do periodo `[start, end]`, retornando a soma apenas das parcelas que incidem no intervalo (nao o valor total da compra).

**Alternativa considerada:** Usar `Date.parse` direto nas computeds sem abstracao. Rejeitado por duplicacao e fragilidade em diferentes timezones.

### 3. Substituir computeds fixas por computeds baseadas em periodo

**Decisao:** As computeds atuais (`currentMonthIncome`, `currentMonthExpense`, `totalIncome`, `totalExpense`) serao substituidas por:

| Computed (nova) | Descricao |
|---|---|
| `periodIncome` | Soma de receitas no periodo |
| `periodExpense` | Soma de despesas no periodo (com logica de parcelas) |
| `periodBalance` | `periodIncome - periodExpense` |
| `periodExpensesByCategory` | `Map<categoryId, total>` das despesas no periodo |
| `periodCommitmentProjection` | Projecao de parcelas futuras a partir do mes inicial do periodo |

**Manter `currentMonthIncome` e `currentMonthExpense` como aliases (computed wrappers)** para nao quebrar consumidores que possam importa-las, mas marcar como deprecated internamente.

**Racional:** As computeds antigas tinham nomes que implicavam escopo fixo. Renomear comunica claramente que o valor depende do `activePeriod`.

### 4. Componente `PeriodSelector.vue`

**Decisao:** Criar um componente `PeriodSelector.vue` posicionado entre `AppHeader` e a grid de graficos. Ele exibe:
- Botao/badge "Mes Atual" (default selecionado)
- Ao clicar, dropdown com: "Mes Atual", "Ultimos 3 meses", "Ultimos 6 meses", "Ultimo ano", "Personalizado..."
- Se "Personalizado" for selecionado, expande dois `<input type="date">` para inicio e fim

```html
<div class="flex items-center gap-3">
  <span class="text-sm text-text-secondary">Periodo:</span>
  <select v-model="periodMode"> ... </select>
  <input v-if="periodMode === 'custom'" type="date" v-model="customStart" />
  <input v-if="periodMode === 'custom'" type="date" v-model="customEnd" />
</div>
```

**Alternativa considerada:** Date range picker de biblioteca externa (ex: `vue-datepicker`). Rejeitado para evitar nova dependencia — inputs nativos `type="date"` sao suficientes.

### 5. Adaptation do `CommitmentTimeline`

**Decisao:** Quando o periodo selecionado for diferente de "Mes Atual", o `CommitmentTimeline` projetara parcelas a partir do **mes inicial do periodo** (nao do mes atual). A renda media usara apenas receitas dentro do periodo selecionado.

**Racional:** Se o usuario seleciona "Ultimos 3 meses" e estamos em Junho, as parcelas devem ser projetadas a partir de Abril. Isso mantem coerencia: o usuario esta analisando um recorte temporal, e a projecao deve comecar do inicio desse recorte.

### 6. Estrutura de arquivos

Decisao final de arquivos novos e modificados:

| Arquivo | Acao |
|---|---|
| `frontend/src/composables/useTransactions.js` | **Modificar**: adicionar `activePeriod`, `isInPeriod`, `isInstallmentInPeriod`, computeds `period*` |
| `frontend/src/components/PeriodSelector.vue` | **Novo**: componente de selecao de periodo |
| `frontend/src/components/AppHeader.vue` | **Modificar**: consumir `periodBalance`, `periodIncome`, `periodExpense` |
| `frontend/src/components/ExpenseChart.vue` | **Modificar**: consumir `periodExpensesByCategory` em vez de logica inline |
| `frontend/src/components/CommitmentTimeline.vue` | **Modificar**: consumir `periodCommitmentProjection` e `activePeriod` |
| `frontend/src/App.vue` | **Modificar**: adicionar `<PeriodSelector>` entre header e graficos |

## Risks / Trade-offs

- **[Performance] Filtrar array de transacoes em cada computed:** Com centenas de transacoes o impacto e negligenciavel. Se escalar, podemos memoizar com `computed` encadeado. → **Mitigacao:** `periodIncome` e `periodExpense` ja sao computeds Vue — so recalculam quando `state.transactions` ou `activePeriod` mudam.
- **[Parcelas em periodo parcial] Contabilizacao de parcelas no intervalo customizado:** Se o usuario seleciona "10/Maio a 20/Maio", uma parcela que vence em Maio deve ser contada integralmente (nao proporcional por dia). → **Mitigacao:** `isInstallmentInPeriod` opera em granularidade de mes — se o mes da parcela esta coberto pelo periodo, o valor cheio da parcela conta. Nao ha rateio diario.
- **[Timezone] Datas ISO 8601:** As transacoes armazenam `date` como ISO string. `new Date(dateStr)` no browser interpreta como UTC ou local dependendo do formato. → **Mitigacao:** Usar comparacao por `getFullYear()` + `getMonth()` + `getDate()` em vez de timestamps absolutos. Manter consistencia com o padrao ja usado no codigo existente (`isCurrentMonth`).

## Open Questions

- Nenhuma. Premissas estabelecidas acima sao suficientes para implementacao.
