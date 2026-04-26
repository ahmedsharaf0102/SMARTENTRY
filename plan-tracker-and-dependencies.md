# 📊 SmartEntry — Plan Tracker & Dependencies

> **Last Updated:** 2026-04-26
> **Architecture:** v2 (Vercel + Oracle + Supabase)
> **Current Phase:** Phase 1 — Foundation
> **Overall Progress:** ██████░░░░ 25%

---

## 🏗️ Architecture (v2)

```
🟢 Vercel (FREE)           🔵 Oracle VPS (FREE)      ☁️ Supabase (FREE)
├── Next.js 16 Frontend    ├── Python Analysis       ├── Auth (Email+Google)
├── API Routes             ├── n8n Automation        ├── PostgreSQL Database
├── Stripe Payments        ├── Telegram Bot          └── Row Level Security
└── Display data           └── Binance API fetching
```

### What Changed (v1 → v2)
- ❌ Removed: Express.js backend → Next.js API Routes
- ❌ Removed: SQLite → Supabase PostgreSQL
- ❌ Removed: Redis → Next.js caching + Supabase
- ✅ Added: Supabase Auth (Email + Google)
- ✅ Added: Stripe ($19.99/mo subscription)
- ✅ Added: 30-day free trial
- ✅ Added: User registration required

---

## 🔄 Execution Log

### Phase 1: Foundation (Days 1–3)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Project folder structure | ✅ Done | Created |
| 2 | Frontend (Next.js 16 + Tailwind 4) | ✅ Done | Landing page, dark theme |
| 3 | Python analysis engine | ✅ Done | Flask + pandas-ta + indicators |
| 4 | Signal scoring system | ✅ Done | BUY/WATCH/WAIT logic |
| 5 | Vercel deployment | ✅ Done | Fixed monorepo + lightningcss |
| 6 | Docker setup (VPS) | ✅ Done | Python + Telegram only |
| 7 | Set up Supabase project | ⬜ Next | Create project + tables |
| 8 | Supabase Auth (signup/login) | ⬜ Next | Email + Google |
| 9 | Auth middleware | ⬜ Next | Protect dashboard routes |
| 10 | Connect Python → Supabase | ⬜ Next | Write signals to DB |

### Phase 2: Dashboard + Data (Days 4–7)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Real Binance data → Supabase | ⬜ Pending | — |
| 2 | Dashboard with real signals | ⬜ Pending | — |
| 3 | Signal cards + filters | ⬜ Pending | — |
| 4 | TradingView charts | ⬜ Pending | — |
| 5 | Tier-gated content | ⬜ Pending | Free trial vs Pro |
| 6 | Coin detail page | ⬜ Pending | — |

### Phase 3: Payments (Days 8–9)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Stripe integration | ⬜ Pending | — |
| 2 | Pricing page | ⬜ Pending | — |
| 3 | Checkout flow | ⬜ Pending | — |
| 4 | Webhook handler | ⬜ Pending | — |
| 5 | Trial expiry logic | ⬜ Pending | — |

### Phase 4: Automation (Days 10–12)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | n8n workflows | ⬜ Pending | — |
| 2 | Telegram bot | ✅ Done | Commands coded |
| 3 | Auto-alerts | ⬜ Pending | — |

### Phase 5: Launch (Days 13–14)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Deploy to Oracle VPS | ⬜ Pending | — |
| 2 | Domain + SSL | ⬜ Pending | — |
| 3 | Final QA | ⬜ Pending | — |

---

## 📦 Dependencies

### Frontend (`frontend/package.json`)

| Package | Purpose | Status |
|---------|---------|--------|
| `next` 16.1.6 | Framework | ✅ Installed |
| `react` 19.2.3 | UI | ✅ Installed |
| `tailwindcss` ^4 | Styling | ✅ Installed |
| `@supabase/supabase-js` | Auth + DB client | ⬜ Phase 1 |
| `@supabase/ssr` | Server-side auth | ⬜ Phase 1 |
| `stripe` | Payments (server) | ⬜ Phase 3 |
| `@stripe/stripe-js` | Payments (client) | ⬜ Phase 3 |
| `lightweight-charts` | TradingView charts | ⬜ Phase 2 |
| `lucide-react` | Icons | ⬜ Phase 2 |
| `swr` | Data fetching | ⬜ Phase 2 |
| `clsx` | Conditional classes | ⬜ Phase 2 |
| `framer-motion` | Animations | ⬜ Phase 2 |

### Python (`analysis/requirements.txt`)

| Package | Purpose | Status |
|---------|---------|--------|
| `flask` | HTTP API | ✅ Coded |
| `pandas` | DataFrames | ✅ Coded |
| `pandas-ta` | 150+ indicators | ✅ Coded |
| `requests` | HTTP client | ✅ Coded |
| `numpy` | Numerics | ✅ Coded |
| `supabase` | Write to DB | ⬜ Phase 1 |
| `gunicorn` | WSGI server | ⬜ Phase 5 |

### Telegram Bot (`telegram-bot/package.json`)

| Package | Purpose | Status |
|---------|---------|--------|
| `grammy` ^1.35 | Bot framework | ✅ Coded |
| `dotenv` ^16 | Env vars | ✅ Coded |

### Cloud Services

| Service | Purpose | Status |
|---------|---------|--------|
| Vercel | Frontend hosting | ✅ Deployed |
| Supabase | Auth + Database | ⬜ Create project |
| Stripe | Payments | ⬜ Create account |
| Oracle VPS | Python + n8n + Telegram | ⬜ Configure |

---

## 🎯 Immediate Next Steps

1. **Create Supabase project** → supabase.com (free)
2. **Run database migration** → Create tables
3. **Install Supabase SDK** → `cd frontend && npm i @supabase/supabase-js @supabase/ssr`
4. **Build auth pages** → Login, Signup, Google OAuth
5. **Protect dashboard routes** → Middleware auth check
6. **Update Python** → Write to Supabase instead of SQLite

---

## 📝 Architecture Notes

- **No Express.js** — Next.js API Routes handle all web API needs
- **No Redis** — Supabase + Next.js ISR caching is sufficient
- **No SQLite** — Supabase PostgreSQL (cloud, managed, free)
- **Supabase Auth** — Email + Google login, 50K users/month free
- **Stripe** — $0 until revenue, 2.9% + 30¢ per transaction
- **Trial** — 30 days free, then $19.99/month
- **VPS Load** — Only Python + n8n + Telegram (very light ~500MB)
