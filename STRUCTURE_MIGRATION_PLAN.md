# Admin — Structure Migration Plan

**Scope correction:** root `README.md` calls admin a "Vite React admin dashboard." It is actually **Next.js 15 (App Router)** — confirmed via `admin/package.json` (`"next": "^15.5.25"`, scripts `next dev -p 5173` / `next build` / `next start -p 5173`). It just runs on port 5173 instead of the Next.js default. Consequence: both `structure/web-admin/WEB-STRUCTURE-CONVENTIONS.md` (generic) and `structure/web-admin/NEXTJS-STRUCTURE-CONVENTIONS.md` (framework-specific) apply here, same as `web/`.

Admin is its own separate app/repo. `NEXTJS-STRUCTURE-CONVENTIONS.md`'s illustrative tree nests an `admin/` route group inside one combined web app — that example does not apply literally. Only the doc's **generic rules** (thin route files, features/shared hierarchy, Tailwind dictionary styling, suffix naming, `error.tsx`/`loading.tsx`, overlay inventory, cross-feature barrels, money-math lint) were evaluated against admin's actual `(auth)` / `(dashboard)` route groups. The absence of a literal `admin/` folder is **not** a violation.

`admin/AGENTS.md` is **stale** — it documents a pre-Next.js Vite/React-Router shape (`App.tsx` router+layout shell, a `revenue/` feature, `shared/services/api.ts` as the only shared category) that no longer matches reality: there is no `App.tsx`, there is no `revenue` feature, and the actual feature set is `ai, audit, auth, dashboard, subscriptions, support, users`. Treat `structure/web-admin/*.md` as authoritative; `admin/AGENTS.md` needs a rewrite, not the code.

## Compliance summary

| Rule area | Status | Evidence |
|---|---|---|
| Feature folder shape (`api/components/hooks/pages/styles/types`) | ✅ Pass | All 7 features present with the full set (see below) |
| Dot-suffix naming inside features (`.api.ts`, `.component.tsx`, `.hook.ts`, `.page.tsx`, `.styles.ts`, `.types.ts`) | ✅ Pass | 100% of files under `src/features/**` sampled follow it exactly |
| `.styles.ts` are real Tailwind `as const` dictionaries | ✅ Pass | e.g. `src/features/subscriptions/styles/subscriptions.styles.ts` |
| List/Row component split, no inline `.map()` in parents | ✅ Pass | `SubscriptionsTable.component.tsx` owns `.map()`, `SubscriptionRow.component.tsx` is the row |
| Money-math client-arithmetic lint guardrail | ✅ Pass — already implemented | `eslint.config.js` has a `no-restricted-syntax` rule explicitly citing `NEXTJS-STRUCTURE-CONVENTIONS.md §8`, mirroring web's guardrail |
| `app/**/page.tsx` thinness | ⚠️ Mostly pass, 1 violation | Login route file contains a hook + inline handler (below) |
| `error.tsx` coverage | ⚠️ Partial | Only `(dashboard)/error.tsx` exists; `(auth)` segment has none |
| Shared-layer suffix/category naming | ❌ Fail | `shared/components/*.tsx` (no `.component.tsx`), `shared/hooks/useCachedResource.ts` (no `.hook.ts`), `shared/services/api.ts` (should be `shared/api/`) |
| No hardcoded `className` strings | ⚠️ Minor, scattered | 32 grep hits, mostly one-off utility classes layered onto a dictionary value, concentrated in `shared/components/*` (which have no `.styles.ts` at all) |
| Cross-feature import enforcement | ❌ Missing mechanism | Every feature has an `index.ts` barrel, but `eslint.config.js` has no `no-restricted-imports` rule enforcing it (doc says this must be lint-enforced) |
| `admin/AGENTS.md` accuracy | ❌ Stale | Describes a pre-Next.js architecture that no longer exists |
| root `README.md` framework description | ❌ Stale | Calls admin "Vite React"; it is Next.js |

**Overall: admin is the most structurally compliant module in this audit.** All 7 features already match the doc's target shape at the file level, not just folder names. The remaining gaps are narrow: the `shared/` layer never received the same suffix treatment as `features/`, one route file has leaked logic, one segment is missing an error boundary, and the barrel-import rule isn't lint-enforced yet.

## Findings

1. **`shared/components/*.tsx` missing `.component.tsx` suffix and paired styles** — `BrandMark.tsx`, `PageStates.tsx`, `Pagination.tsx`, `Skeleton.tsx`, `SortableHeader.tsx`. These are exactly the shared components responsible for most of the 32 hardcoded-className hits (doc: "every style in every component comes from a `.styles.ts` import").
2. **`shared/hooks/useCachedResource.ts` missing `.hook.ts` suffix.**
3. **`shared/services/api.ts` should live under `shared/api/`** with `.api.ts` naming, per the doc's shared category list (`api, components, hooks, styles, utils, types, constants, stores, containers`). Admin currently calls this category `services/`, which doesn't appear in that list.
4. **`src/app/(auth)/login/page.tsx` contains real logic**, not a thin re-export:
   ```tsx
   'use client';
   import { useRouter } from 'next/navigation';
   import { LoginPage } from '@/features/auth';
   export default function Page() {
     const router = useRouter();
     return <LoginPage onLogin={() => router.replace('/')} />;
   }
   ```
   Doc: `app/**/page.tsx` is forbidden from containing hooks or business logic. The `useRouter()` call and the inline arrow handler belong inside `LoginPage`/`useLoginForm.hook.ts`, with the route file reduced to `export default function Page() { return <LoginPage />; }` — or `LoginPage` should accept an already-bound `onLogin` from its own hook rather than the route file constructing one.
5. **`(auth)` route segment has no `error.tsx`.** Only `(dashboard)/error.tsx` exists. Login/TOTP flows call APIs and can throw during render; per doc, copy the existing `(dashboard)/error.tsx` template.
6. **No `no-restricted-imports` ESLint rule for feature-barrel enforcement**, even though every feature already exports through `index.ts`. The doc treats this as a required lint rule, not just a convention.
7. **Scattered hardcoded `className` strings (32 occurrences)** outside `shared/components/*` in: `subscriptions/components/SubscriptionRow.component.tsx`, `subscriptions/pages/SubscriptionsPage.page.tsx`, `audit/pages/AuditLogsPage.page.tsx`, `support/components/TicketRow.component.tsx`, `support/pages/SupportTicketsPage.page.tsx`, `ai/components/AiConversationRow.component.tsx`, `users/components/UserActionsCard.component.tsx`, `users/pages/UsersPage.page.tsx`. Mostly small one-off classes (`text-[11px] text-text-tertiary mt-0.5`) layered next to a dictionary reference rather than being added as a new dictionary key.
8. **No client-side money arithmetic found** — clean. The existing lint guardrail is doing its job; no violations to fix.
9. **`auth` feature has no `types/` folder** while every other feature does. Not a violation by itself (nothing currently needs a shared type there), but worth a quick check before closing this plan — if `login.api.ts`/`totp.api.ts` request/response shapes are inlined instead of centralized, extract them to `auth/types/auth.types.ts` for consistency with the other 6 features.
10. **`loading.tsx` is absent everywhere.** Per doc, this is only required "when inheriting the parent segment's skeleton would show the wrong shape" — not a default requirement. No action needed unless a specific route shows a wrong-shaped fallback today.

No violations found for: functionality-subfolder nesting rules (every feature's file count per responsibility is low enough that flat is correct), List/Row `.map()` discipline, `.page.tsx` composition thinness (outside login), cross-feature reach-in imports (not checked file-by-file beyond the barrel-existence check — recommend confirming during step 6 below), or money-math on the client.

## Step-by-step migration plan

### Phase 1 — Shared layer suffix/category alignment
- [ ] Rename `shared/services/api.ts` → `shared/api/admin.api.ts` (or split per concern if `api.ts` already covers multiple unrelated endpoints — check its contents first). Update all imports.
- [ ] Rename `shared/hooks/useCachedResource.ts` → `shared/hooks/useCachedResource.hook.ts`. Update imports.
- [ ] Rename shared components to add `.component.tsx`: `BrandMark.component.tsx`, `PageStates.component.tsx`, `Pagination.component.tsx`, `Skeleton.component.tsx`, `SortableHeader.component.tsx`. Update imports (barrels/consumers).
- [ ] Add `shared/styles/` dictionaries for the above components and replace their hardcoded `className` strings with dictionary references (this also resolves most of Finding 7's non-feature occurrences).

### Phase 2 — Route-layer cleanup
- [ ] Fix `src/app/(auth)/login/page.tsx`: move the `useRouter()` + navigation callback into `features/auth` (either inside `LoginPage.page.tsx` or a hook it already uses), leaving the route file as a bare re-export.
- [ ] Add `src/app/(auth)/error.tsx`, copying the structure of `src/app/(dashboard)/error.tsx` (`"use client"`, `{ error, reset }`, named boundary, shared error-boundary styles).

### Phase 3 — Lint enforcement
- [ ] Add a `no-restricted-imports` rule to `eslint.config.js` blocking imports that reach into another feature's internal folders (`@/features/<name>/{api,components,hooks,pages,styles,types}/**`) from outside that feature, mirroring however `web/eslint.config.js` implements its `FEATURES` list (check `web/eslint.config.js` for the exact pattern to reuse, since it's referenced from admin's own money-math guardrail comment as a sibling implementation).

### Phase 4 — Feature-level polish
- [ ] Replace the remaining scattered inline `className` strings listed in Finding 7 with new keys added to each feature's existing `.styles.ts` dictionary (do not create a second styling system or per-component style files).
- [ ] Decide on `auth/types/auth.types.ts`: add it only if `login.api.ts` / `totp.api.ts` currently inline request/response shapes that should be named types for consistency with the other 6 features.

### Phase 5 — Documentation correction
- [ ] Rewrite `admin/AGENTS.md` to describe the actual Next.js App Router structure (`src/app` route layer, `src/features/<name>/{api,components,hooks,pages,styles,types}`, `src/shared/{api,components,hooks,styles,utils,validation}` post-Phase-1), removing the stale `App.tsx` / `revenue` feature / `shared/services` references.
- [ ] Correct root `README.md`'s description of admin from "Vite React admin dashboard" to "Next.js App Router admin dashboard."

### Phase 6 — Verification gate (per `NEXTJS-STRUCTURE-CONVENTIONS.md` §9)
- [ ] `npm run typecheck` (or add one if `admin/package.json` doesn't have it yet — not currently listed among its scripts; confirm and add if missing)
- [ ] `npm run lint`
- [ ] `npm test`
- [ ] `npm run dev` and a breakpoint pass (phone/tablet/desktop, light/dark) on every touched page: login, (dashboard) error boundary, subscriptions, support, audit, users
