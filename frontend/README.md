# Financy Frontend

Aplicação React para gerenciamento de transações e categorias, integrada à API GraphQL do Financy.

## Tecnologias

- React 18 + TypeScript
- Vite
- TailwindCSS
- React Query + graphql-request
- React Hook Form + Zod
- React Router DOM
- lucide-react

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

```
VITE_BACKEND_URL=http://localhost:3001
```

## Desenvolvimento

```bash
yarn install
yarn dev
```

## Build

```bash
yarn build
```

## Estrutura

- `src/components/` – Componentes reutilizáveis e dialogs
- `src/contexts/` – AuthContext
- `src/graphql/` – Queries e mutations GraphQL
- `src/hooks/` – Hooks (useAuth, useTransactions, useCategories)
- `src/lib/` – Cliente GraphQL e utilitários
- `src/pages/` – Páginas (Login, Cadastro, Dashboard, Transações, Categorias, Perfil)
