---
name: Benedictus Architecture
description: Key decisions for the Benedictus spiritual platform — routes, auth, Stripe, DB schema namespace
---

# Benedictus Architecture

## Route prefix
All Benedictus API routes use `/api/b/` prefix to avoid collision with Intessuto routes (`/api/auth`, `/api/leads`, etc.).
Auth sub-routes: `/api/b/auth/register`, `/api/b/auth/login`, `/api/b/auth/me`, `/api/b/auth/logout`.

**Why:** Intessuto already owns `/api/auth` and `/api/dashboard`. A dedicated `/b/` namespace keeps both apps in the same Express server without conflict.

## JWT Auth pattern
- Token stored in `localStorage` as `benedictus_token`
- Sent as `Authorization: Bearer <token>` header
- `setAuthTokenGetter()` from `@workspace/api-client-react` wires it into all API calls
- `JWT_SECRET` env var required in production (default fallback only for dev)

**How to apply:** After login/register mutation succeeds, call `setToken(data.token)` in AuthContext. On mount, read from localStorage and call `setAuthTokenGetter`.

## DB schema namespace
All Benedictus tables are prefixed `b_`:
- `b_users`, `b_lectio`, `b_episodes`, `b_workshops`, `b_workshop_registrations`
- `b_testimonials`, `b_graduates`, `b_newsletter_subscribers`

Schema file: `lib/db/src/schema/benedictus.ts`, exported from `lib/db/src/schema/index.ts`.

## Tier access control
Three tiers: `pellegrino` (0) < `monaco` (1) < `abbas` (2).
Lectio body gating: compare `TIER_LEVEL[user.tier]` vs `TIER_LEVEL[article.requiredTier]` in the route handler.
Unauthenticated users default to `pellegrino` tier.

## Stripe
- Webhook route registered BEFORE `express.json()` in `app.ts` — uses `express.raw({ type: 'application/json' })`
- `stripeClient.ts` fetches credentials via Replit Connectors API (hostname + X_REPLIT_TOKEN)
- Plan price IDs stored as env vars: `STRIPE_MONACO_MONTHLY_PRICE_ID`, `STRIPE_MONACO_ANNUAL_PRICE_ID`, `STRIPE_ABBAS_MONTHLY_PRICE_ID`, `STRIPE_ABBAS_ANNUAL_PRICE_ID`
- Checkout: POST `/api/b/checkout` → creates Stripe session → returns `{url}` → frontend does `window.location.href = url`

## Frontend pages
17 pages under `artifacts/benedictus/src/pages/`. All use real API hooks from `@workspace/api-client-react` (no mock data). AuthContext in `src/lib/auth.tsx`.

## Seed data
Initial content seeded via `psql "$DATABASE_URL"` directly. 5 lectio, 3 episodes, 3 workshops, 4 testimonials, 5 graduates.
