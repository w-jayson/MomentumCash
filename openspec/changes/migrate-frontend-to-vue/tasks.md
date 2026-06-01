## 1. Vite + Vue Scaffold

- [x] 1.1 Inicializar projeto Vite com template Vue na raiz do `frontend/` (`npm create vite@latest . -- --template vue`)
- [x] 1.2 Instalar dependências: `vue`, `@vitejs/plugin-vue`, `tailwindcss`, `postcss`, `autoprefixer`
- [x] 1.3 Criar `vite.config.js` com plugin Vue, proxy `/api` → `http://backend:5000`, host `0.0.0.0`, `watch.usePolling: true`
- [x] 1.4 Criar `tailwind.config.js` com tokens Kinetic Dark (`void`, `deep`, `midnight`, `steel`, `frost`, `cyan`, `emerald`, `coral`, fontes Satoshi + JetBrains Mono)
- [x] 1.5 Criar `postcss.config.js` com plugins `tailwindcss` e `autoprefixer`
- [x] 1.6 Remover assets e boilerplate gerados pelo scaffold (substituir `src/style.css` por `src/assets/css/main.css`)

## 2. CSS Foundation — Tema Kinetic Dark

- [x] 2.1 Criar `src/assets/css/main.css` com diretivas `@tailwind base/components/utilities`
- [x] 2.2 Na camada `@layer base`: importar fontes Satoshi e JetBrains Mono via Google Fonts `@import`, aplicar `font-family: 'Satoshi'` ao body, background `bg-void`
- [x] 2.3 Na camada `@layer components`: grid dots background (radial-gradient no body::before), glass morphism utility (`.glass` com backdrop-blur + bg com opacidade + border translucent), noise overlay (::after com SVG noise, mix-blend-mode overlay)
- [x] 2.4 Na camada `@layer utilities`: text glow utilities (`.text-glow-cyan`, `.text-glow-emerald`, `.text-glow-coral` com text-shadow)
- [x] 2.5 Criar keyframes em `main.css`: `fade-in-up`, `fade-in-down`, `scale-in`, `staggered-reveal` com animation-delay custom properties

## 3. Composables — Lógica de Negócio

- [x] 3.1 Criar `src/composables/useFormat.js`: exportar `formatCurrency(value)` com `Intl.NumberFormat("pt-BR")` e `formatDate(dateStr)` com split/rejoin dd/mm/aaaa
- [x] 3.2 Criar `src/composables/useTransactions.js`: estado reativo `transactions` (array), `categories` (array); métodos `addTransaction`, `updateTransaction(id, data)`, `deleteTransaction(id)`, `getById(id)`, `getServerId(id)`; computed `balance`, `totalIncome`, `totalExpense`, `filteredTransactions(filters)`; watcher que persiste `transactions` e `categories` em localStorage
- [x] 3.3 Criar `src/composables/useCategories.js`: `loadFromServer()` chamando `GET /api/categories`, `getByType(type)` filtrando localmente, `populateCache(categories)`
- [x] 3.4 Criar `src/composables/useApi.js`: `apiFetch(url, options)` wrapper com error handling, `createTransaction`, `updateTransaction`, `deleteTransaction`, `syncPendingTransactions()` com `setInterval` 30s via `onMounted`/`onUnmounted`

## 4. Componentes Core

- [x] 4.1 Criar `AnimatedCounter.vue`: recebe props `target` (Number) e `duration` (Number, default 800); usa `requestAnimationFrame` com easing `easeOutExpo`; emite `formattedValue` via computed com `useFormat`; inicia de `previousValue` (ref interna) e anima até `target`
- [x] 4.2 Criar `SummaryCard.vue`: recebe props `label` (String), `amount` (Number), `variant` ('balance' | 'income' | 'expense'); aplica classes de cor condicionais; renderiza `<AnimatedCounter>` para o valor; estilo glass morphism com `.glass` class
- [x] 4.3 Criar `AppHeader.vue`: importa `useTransactions`; renderiza 3 `<SummaryCard>` com label/variant mapeados; título \"MomentumCash\" com animação fade-in-down
- [x] 4.4 Criar `AppFooter.vue`: texto \"MomentumCash © 2026\" centralizado, cor `text-muted`

## 5. TransactionForm + InstallmentFields

- [x] 5.1 Criar `InstallmentFields.vue`: recebe props `modelValue` (objeto com installments, installmentValue), expõe via `v-model`; campos number com min validation; expõe `isInstallment` checkbox; renderiza condicionalmente com `v-if`
- [x] 5.2 Criar `TransactionForm.vue`: estado reativo `form` (description, amount, type, date, categoryId, installments, installmentValue); prop `editingTransaction` (null para create, objeto para edit); computed `isEditing`; `@submit.prevent` handler que chama `useTransactions().addTransaction` ou `updateTransaction`; chamada de API via `useApi`; reset após submit; watch `form.type` para recarregar categorias; watch `form.amount` e `form.installments` para auto-calcular `installmentValue`; botão Cancelar visível apenas em modo edit
- [x] 5.3 Implementar auto-cálculo: `watch([amount, installments], () => { if (isInstallment && !userEditedInstallmentValue) { installmentValue = amount / installments } })`
- [x] 5.4 Validação visual: inputs com classe de erro condicional (`:class=\"{ 'border-coral': showError && !field }\"`)

## 6. TransactionHistory + Filters

- [x] 6.1 Criar `FilterBar.vue`: dois `<select>` — categoria (`v-model="filterCategory"`) e tipo (`v-model="filterType"`); emite os filtros via `defineEmits`; opções de categoria populadas de `useTransactions().categories`
- [x] 6.2 Criar `TransactionHistory.vue`: importa `useTransactions` e `useFormat`; computed `filteredAndSorted` que aplica filtros + sort por data desc; tabela com `v-for`; badges condicionais (tipo income/expense, sync pending, installment indicator \"1/N parcelas\"); botões Editar/Excluir com `@click` emitindo eventos ao pai; empty state com `v-if=\"filteredAndSorted.length === 0\"`

## 7. ConfirmModal com Teleport

- [x] 7.1 Criar `ConfirmModal.vue`: usa `<Teleport to=\"body\">`; recebe props `visible` (Boolean) e `message` (String); emite `@confirm` e `@cancel`; overlay fecha ao clicar fora (`@click.self`); botões Excluir (danger, `bg-coral`) e Cancelar (secondary, `bg-steel`); transição fade com `<Transition name=\"fade\">`

## 8. App.vue — Integração

- [x] 8.1 Criar `App.vue`: template com todos os componentes montados; estado local `editingTransaction` (ref null); estado local `modalVisible` + `pendingDeleteId`; handlers: `handleEdit(id)`, `handleDelete(id)`, `handleConfirmDelete()`, `handleCancelEdit()`; passar props e eventos entre componentes; `onMounted` carregar categorias do servidor + inicializar dashboard
- [x] 8.2 Atualizar `src/main.js`: `createApp(App).mount('#app')`
- [x] 8.3 Atualizar `index.html`: entry point Vite com `<div id="app">` e `<script type="module" src="/src/main.js">`

## 9. Docker + docker-compose

- [x] 9.1 Reescrever `frontend/Dockerfile`: base `node:20-alpine`, WORKDIR `/app`, COPY `package*.json`, RUN `npm install`, COPY `. .`, EXPOSE `5173`, CMD `[\"npm\", \"run\", \"dev\", \"--\", \"--host\", \"0.0.0.0\"]`
- [x] 9.2 Atualizar `docker-compose.yml` serviço `frontend`: porta `5173:5173`, volumes `./frontend/src:/app/src`, `./frontend/public:/app/public`, `./frontend/index.html:/app/index.html`, remover `8080:80`
- [x] 9.3 Atualizar `.gitignore`: adicionar `node_modules/`, `dist/`
- [x] 9.4 Atualizar `.dockerignore`: adicionar `node_modules/`

## 10. Cleanup — Remover Legado

- [x] 10.1 Remover `frontend/css/` (styles.css)
- [x] 10.2 Remover `frontend/js/` (api.js, app.js, storage.js)
- [x] 10.3 Remover `frontend/nginx.conf` (mantido opcional para prod build futura; remover do dir dev)
- [x] 10.4 Verificar que `docker compose up --build frontend` sobe sem erros e HMR funciona (alterar um .vue e ver atualização no browser)
