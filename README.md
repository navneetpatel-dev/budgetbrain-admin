# ExpenseFlow Admin

Web dashboard for managing ExpenseFlow users and audit logs.

**Related repos:** [expenseflow-api](https://github.com/your-org/expenseflow-api) · [expenseflow-mobile](https://github.com/your-org/expenseflow-mobile)

## Stack

- React 19, TypeScript, Vite
- Calls ExpenseFlow API (`/api/v1/admin/*`)

## Prerequisites

- [ExpenseFlow API](https://github.com/your-org/expenseflow-api) running locally or deployed
- Admin user in the database (`role: admin`)

Create a dev admin via the API repo:

```bash
cd ../expenseflow-api   # or your API checkout
npm run db:seed
```

| Email | Password |
|-------|----------|
| `admin@expenseflow.app` | `Admin123!` |

## Quick start

```bash
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:5173

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:3000/api/v1` | ExpenseFlow API base URL |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

## Features

- Dashboard (users, MRR, conversion, AI usage)
- User management
- Audit logs
