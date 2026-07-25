# Admin — Feature Structure

```
src/
  features/           # One folder per admin feature
    auth/             # LoginPage
    dashboard/        # DashboardPage
    users/            # UsersPage, UserDetailPage
    revenue/
    ai/
    audit/
    support/
  shared/
    components/       # Pagination, PageStates
    services/         # api.ts
  App.tsx             # Router + layout shell
```

Import pages from `./features/<domain>/...` and shared utilities from `./shared/...`.
