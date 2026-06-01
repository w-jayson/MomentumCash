## Why

O frontend atual é um monolito procedural vanilla JS (~470 linhas no `app.js`) acoplado via objetos globais. Qualquer nova feature exige manipulação manual de DOM, não há componentização, e o design segue um tema genérico. Migrar para Vue 3 com Composition API resolve a manutenibilidade, habilita crescimento do produto com componentes reutilizáveis, e eleva a percepção de qualidade com o redesign Kinetic Dark.

## What Changes

- Substituição completa do frontend vanilla HTML/CSS/JS por Vue 3 + Vite + Tailwind CSS
- Remoção dos arquivos `frontend/css/`, `frontend/js/` e `frontend/nginx.conf` (dev)
- Componentização da landing page em: `AppHeader`, `SummaryCard`, `AnimatedCounter`, `TransactionForm`, `InstallmentFields`, `TransactionHistory`, `FilterBar`, `ConfirmModal`, `AppFooter`
- Extração da lógica para composables: `useTransactions`, `useApi`, `useCategories`, `useFormat`
- Redesign visual completo: tema Kinetic Dark (dark mode, glass morphism, tipografia Satoshi + JetBrains Mono, grid dots background, animated counters com spring easing)
- Substituição do Dockerfile de produção (nginx estático) por Dockerfile de desenvolvimento (Vite dev server com HMR via polling)
- Atualização do `docker-compose.yml` para volume mounts e porta 5173
- **BREAKING**: substituição total do frontend anterior; arquivos vanilla JS/CSS/nginx.conf removidos

## Capabilities

### New Capabilities

- `vue-frontend`: Frontend Vue 3 com Composition API, Vite, Tailwind CSS, tema Kinetic Dark, componentes reativos, composables para estado e API, Docker dev com HMR

### Modified Capabilities

Nenhum. As specs existentes (`category-type-association`, `installment-expenses`) definem comportamento de API e regras de negócio que não mudam — apenas a camada de apresentação é refeita mantendo os mesmos contratos.

## Impact

- **frontend/css/styles.css**: removido
- **frontend/js/*.js**: removido (api.js, app.js, storage.js)
- **frontend/nginx.conf**: removido do dev (mantido opcional para prod build futura)
- **frontend/Dockerfile**: reescrito para node dev server
- **frontend/index.html**: substituído pelo entry point do Vite
- **docker-compose.yml**: serviço `frontend` atualizado (portas, volumes, build context)
- **.gitignore**: adicionar `node_modules/`, `dist/`
- **.dockerignore**: adicionar `node_modules/`
- Dependências novas: vue, vite, @vitejs/plugin-vue, tailwindcss, postcss, autoprefixer
