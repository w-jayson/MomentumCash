## Context

O frontend atual é uma SPA vanilla servida via nginx em container Docker. Toda a lógica reside em 3 arquivos JS globais (`storage.js`, `api.js`, `app.js`) que manipulam diretamente o DOM e localStorage. O design segue um tema claro genérico com indigo como cor primária.

O backend é uma API .NET rodando em container separado, acessível via proxy reverso no nginx (`/api` → `backend:5000`). Há specs existentes para `category-type-association` e `installment-expenses` que definem o comportamento esperado — estas não mudam.

O objetivo é migrar para Vue 3 sem alterar rotas (zero routing), mantendo a landing page como única tela, com redesign visual completo (Kinetic Dark).

## Goals / Non-Goals

**Goals:**

- Migrar toda a lógica da landing page para componentes Vue 3 (Composition API, `<script setup>`)
- Extrair estado e side effects para composables reutilizáveis
- Substituir CSS custom properties por Tailwind CSS com configuração temática Kinetic Dark
- Implementar feedback visual rico (animated counters, glass morphism, staggered reveals, grid dots background)
- Configurar ambiente Docker dev com Vite HMR funcional via polling
- Manter contratos de API idênticos (mesmos endpoints, mesmos payloads)
- Manter comportamento offline-first com localStorage + sync em background

**Non-Goals:**

- Vue Router — zero routing, tela única
- Pinia — estado simples demais para justificar store externa
- Testes automatizados (Vitest configurado como scaffolding, mas sem testes escritos)
- Build de produção multi-stage (nginx + dist estático) — fica para change futuro
- PWA / Service Workers
- Novas telas ou features de negócio

## Decisions

### 1. Tailwind CSS como utility layer

**Escolha**: Tailwind CSS 3.x + PostCSS + Autoprefixer com configuração temática customizada.

**Alternativas consideradas**:
- **CSS Modules / `<style scoped>` puro**: Mais controle por componente, mas sem design tokens centralizados. Tailwind força consistência via config.
- **UnoCSS**: Mais leve e rápido que Tailwind, mas ecossistema menor e menos documentação. Tailwind é mais maduro para o ecossistema Vue/Vite.

**Rationale**: Tailwind atua como utility layer para responsividade e consistência espacial. O caráter visual (glass morphism, glow effects, grid dots, noise texture, animações) vem de CSS custom aplicado via `@layer components` e `@layer utilities` ou classes arbitrárias. A configuração `tailwind.config.js` define os tokens de cor, fontes e breakpoints — tudo que é "skin" fica centralizado ali.

### 2. Composables em vez de Pinia

**Escolha**: Composable functions com `reactive()` + `watch()` para persistência em localStorage.

**Alternativas consideradas**:
- **Pinia**: Store centralizada com devtools. Overkill para estado de uma única tela com ~3 entidades (transactions, categories, filters). Introduz boilerplate desnecessário.
- **provide/inject**: Funciona para árvore rasa, mas fica frágil se a hierarquia de componentes mudar.

**Rationale**: Uma composable `useTransactions()` exporta estado reativo + métodos CRUD. Componentes que precisam importam diretamente. O `watch` automático persiste no localStorage. Se no futuro houver múltiplas telas, migrar para Pinia é trivial — a API de composables mapeia 1:1 para stores.

### 3. Teleport para modal

**Escolha**: `<Teleport to="body">` no `ConfirmModal.vue`.

**Alternativas consideradas**:
- **Modal inline no DOM**: Funciona, mas perde garantia de stacking context (z-index).
- **Portal manual via `createApp`**: Mais complexo, desnecessário com `<Teleport>` nativo do Vue 3.

**Rationale**: `<Teleport>` é a solução idiomática do Vue 3 para overlays/modais. Garante que o modal renderize no `<body>`, fora de qualquer `overflow: hidden` ou `z-index` stacking acidental.

### 4. AnimatedCounter com requestAnimationFrame

**Escolha**: Componente `AnimatedCounter.vue` que recebe `target` (number) e `duration` (ms), usando `requestAnimationFrame` com easing `easeOutExpo`.

**Alternativas consideradas**:
- **CSS `@property` com `transition`**: Não funciona para texto (não há transição CSS entre strings).
- **GSAP**: Biblioteca externa. Desnecessária para uma animação pontual.
- **Vue `<Transition>`**: Funciona para mount/unmount, não para interpolação numérica contínua.

**Rationale**: `requestAnimationFrame` é nativo, performático, e permite controle fino do easing. O componente encapsula a complexidade e expõe props simples.

### 5. Docker dev com Vite polling

**Escolha**: Dockerfile baseado em `node:20-alpine` rodando `vite --host 0.0.0.0` com `server.watch.usePolling: true`.

**Alternativas consideradas**:
- **Manter nginx + build watch**: Perde HMR, feedback mais lento.
- **Vite sem polling**: Não detecta mudanças em bind mounts Docker (Linux/Windows cross-filesystem).
- **docker-sync ou mutagen**: Complexidade adicional desnecessária para este projeto.

**Rationale**: `usePolling: true` é a solução canônica para Vite em Docker. Custa um pouco mais de CPU em idle, mas garante HMR funcional em qualquer host OS.

### 6. Proxy reverso no Vite em vez de nginx

**Escolha**: `vite.config.js` com `server.proxy` apontando `/api` → `http://backend:5000`.

**Rationale**: Em desenvolvimento, o Vite substitui completamente o nginx como servidor + proxy. O `nginx.conf` antigo é removido. Para produção futura, um Dockerfile multi-stage fará `vite build` → nginx serve os assets estáticos com proxy reverso.

## Arquitetura de Componentes

```
App.vue
├── AppHeader.vue
│   └── SummaryCard.vue (×3, via v-for)
│       └── AnimatedCounter.vue
├── TransactionForm.vue
│   └── InstallmentFields.vue (v-if type === 2 && isInstallment)
├── TransactionHistory.vue
│   └── FilterBar.vue
├── ConfirmModal.vue (<Teleport to="body">)
└── AppFooter.vue
```

## Fluxo de Dados

```
┌──────────────────────────────────────────────────┐
│                  useTransactions()                │
│                                                  │
│  reactive({ transactions: [], categories: [] })  │
│                                                  │
│  watch(transactions) → localStorage.setItem()    │
│  watch(categories)  → localStorage.setItem()     │
│                                                  │
│  methods: add, update, delete, getById           │
│  computed: balance, totalIncome, totalExpense    │
│           filteredTransactions                   │
└────────┬──────────────────────────┬──────────────┘
         │                          │
         ▼                          ▼
   AppHeader.vue            TransactionHistory.vue
   (balance, income,        (filteredTransactions,
    expense)                 filters)
```

## Configuração Vite

```js
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: { usePolling: true },
    proxy: {
      '/api': {
        target: 'http://backend:5000',
        changeOrigin: true,
      },
    },
  },
})
```

## Configuração Tailwind — Tokens

```js
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        void:       '#060B14',
        deep:       '#0F1624',
        midnight:   '#1A233A',
        steel:      '#24304D',
        frost:      '#2D3B5A',
        cyan:       { DEFAULT: '#00E5FF', glow: '#00E5FF40', dim: '#006D7A' },
        emerald:    { DEFAULT: '#00E676', glow: '#00E67640' },
        coral:      { DEFAULT: '#FF3D60', glow: '#FF3D6040' },
        'text-primary':   '#E8EDF5',
        'text-secondary': '#7B89A1',
        'text-muted':     '#465570',
      },
      fontFamily: {
        display: ['Satoshi', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
    },
  },
}
```

## Estrutura de Diretórios Alvo

```
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── AppHeader.vue
│   │   ├── SummaryCard.vue
│   │   ├── AnimatedCounter.vue
│   │   ├── TransactionForm.vue
│   │   ├── InstallmentFields.vue
│   │   ├── TransactionHistory.vue
│   │   ├── FilterBar.vue
│   │   ├── ConfirmModal.vue
│   │   └── AppFooter.vue
│   ├── composables/
│   │   ├── useTransactions.js
│   │   ├── useApi.js
│   │   ├── useCategories.js
│   │   └── useFormat.js
│   ├── assets/
│   │   └── css/
│   │       └── main.css
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── Dockerfile
└── nginx.conf              (opcional, para prod build futura)
```

## Riscos / Trade-offs

- **[Desempenho] `usePolling: true` aumenta CPU em idle**: Mitigação — afeta apenas ambiente dev local. Em produção, build estático não usa polling.
- **[Complexidade] AnimatedCounter com requestAnimationFrame**: Mitigação — componente isolado com props simples. Se der problema de performance, basta trocar `duration` para 0 (instantâneo) sem quebrar API.
- **[Compatibilidade] localStorage no Docker**: Funciona normalmente no browser do host. O container não afeta `window.localStorage`.
- **[Regressão] Comportamento offline-first precisa ser preservado**: Mitigação — a composable `useTransactions` replica exatamente a lógica de `storage.js` usando `watch()` para persistência. O sync em background usa `setInterval` dentro de `onMounted`/`onUnmounted`.
- **[Curva de aprendizado] Tailwind em vez de CSS puro**: Mitigação — a configuração temática reduz a necessidade de classes arbitrárias. Componentes usam classes semânticas como `bg-midnight`, `text-cyan`, `border-steel`.

## Migration Plan

1. Executar `npm create vite@latest` para scaffold, instalar dependências
2. Configurar `tailwind.config.js`, `postcss.config.js`, `vite.config.js`
3. Criar `src/assets/css/main.css` com diretivas Tailwind + CSS custom (glass, grid dots, noise, animações)
4. Implementar componentes na ordem: `App.vue` → `AppHeader` → `SummaryCard` → `AnimatedCounter` → `TransactionForm` → `InstallmentFields` → `TransactionHistory` → `FilterBar` → `ConfirmModal` → `AppFooter`
5. Implementar composables: `useFormat` → `useTransactions` → `useCategories` → `useApi`
6. Integrar composables nos componentes
7. Criar Dockerfile dev + atualizar docker-compose.yml
8. Remover diretórios legados (`css/`, `js/`)
9. Atualizar `.gitignore` e `.dockerignore`

Sem rollback necessário — o git history preserva o frontend antigo. A migração é greenfield: novo código coexiste brevemente com o antigo, depois o antigo é removido no commit final.

## Open Questions

- Build de produção multi-stage (Vite build → nginx) será tratado em change separado? Ou neste mesmo change?
