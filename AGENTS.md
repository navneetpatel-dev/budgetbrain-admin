# Admin — Feature Structure

Next.js 15 App Router (port 5173). `src/app/` is the route layer only: each `page.tsx` re-exports a feature page. Route groups `(auth)` and `(dashboard)` do not appear in the URL.

```
src/
  app/
    layout.tsx
    (auth)/                 # login, error boundary
    (dashboard)/            # layout, error boundary, feature routes
  features/                 # ai, audit, auth, dashboard, subscriptions, support, users
    <feature>/
      api/
      components/
      hooks/
      pages/
      styles/
      types/
  shared/
    api/                    # admin.api.ts — session + HTTP client
    components/
    hooks/
    styles/
    utils/
    validation/
```

`subscriptions/` also has `utils/`. Import another feature through its `index.ts` barrel (`@/features/<name>`), not its internal folders. Import shared code from `@/shared/...`.
