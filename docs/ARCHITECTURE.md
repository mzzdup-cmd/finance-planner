# Finance Planner — Architecture

## Overview

Premium mobile-first personal finance PWA built with Next.js 14 App Router.

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (PWA)                         │
│  Next.js 14 · Tailwind · shadcn/ui · Framer Motion          │
│  Zustand stores · Recharts · next-themes                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                     API Layer (services/)                    │
│  payments · salary · goals · vacation · analytics · auth    │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    Supabase (PostgreSQL)                      │
│  Auth · RLS · Realtime · Edge Functions (notifications)      │
└─────────────────────────────────────────────────────────────┘
```

## Folder Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (app)/              # Authenticated shell with bottom nav
│   │   ├── page.tsx        # Dashboard
│   │   ├── payments/
│   │   ├── salary/
│   │   ├── goals/
│   │   ├── vacation/
│   │   ├── calendar/
│   │   ├── analytics/
│   │   └── notifications/
│   ├── auth/               # Login / Signup
│   ├── onboarding/         # First-run wizard
│   └── layout.tsx
├── components/
│   ├── ui/                 # shadcn primitives
│   ├── layout/             # AppShell, BottomNav, Header
│   ├── cards/              # Dashboard stat cards
│   ├── charts/             # Recharts wrappers
│   ├── payments/
│   ├── goals/
│   ├── vacation/
│   ├── onboarding/
│   └── skeletons/
├── hooks/                  # useDashboard, usePayments, etc.
├── stores/                 # Zustand global state
├── services/               # Supabase CRUD + business logic
├── lib/                    # supabase client, utils, constants
├── types/                  # TypeScript domain types
└── data/                   # Demo seed data (offline dev)
supabase/
├── schema.sql              # Full database schema
└── seed.sql                # Demo data
```

## Navigation (Bottom Tabs)

| Tab | Route | Icon |
|-----|-------|------|
| Главная | `/` | Home |
| Платежи | `/payments` | CreditCard |
| Цели | `/goals` | Target |
| Календарь | `/calendar` | Calendar |
| Ещё | `/more` | Menu |

Secondary routes via "Ещё": Salary, Vacation, Analytics, Notifications, Settings.

## Design System

- **Colors**: graphite dark `#1A1D23`, accent green `#00D68F`, premium blue `#4C6EF5`, soft red `#FF6B6B`
- **Glass**: `backdrop-blur-xl` + semi-transparent borders
- **Typography**: Geist Sans, tabular numbers for amounts
- **Motion**: Framer Motion page transitions, card stagger, spring taps
- **Safe areas**: `env(safe-area-inset-*)` for iPhone notch/home bar

## Data Model

See `supabase/schema.sql` for full DDL. Core entities:

- `profiles` — user settings, currency, onboarding flag
- `monthly_incomes` — salary + extra income per month
- `payments` — recurring & one-off mandatory payments
- `payment_instances` — per-month payment status (paid/pending/overdue)
- `savings_goals` — accumulation targets
- `vacation_trips` + `vacation_expenses` — trip planner
- `notifications` — in-app + push schedule

## State Management

Zustand slices mirror domain services. Stores hydrate from Supabase on mount; demo mode uses `data/demo.ts` when `NEXT_PUBLIC_DEMO_MODE=true`.

## PWA

- `next-pwa` service worker
- `manifest.json` with standalone display
- Offline: cache shell + last-known dashboard snapshot in IndexedDB
