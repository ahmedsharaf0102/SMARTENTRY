# 📊 SmartEntry — Plan Tracker & Dependencies

> **Last Updated:** 2026-04-28
> **Architecture:** v2 (Vercel + Oracle + Supabase)
> **Current Phase:** Phase 1 → Phase 2 transition
> **Overall Progress:** ██████████░░ 50%

---

## 🏗️ Architecture (v2)

```
🟢 Vercel (FREE)           🔵 Oracle VPS (FREE)      ☁️ Supabase (FREE)
├── Next.js 16 Frontend    ├── Python Analysis       ├── Auth (Email+Google)
├── API Routes             ├── n8n Automation        ├── PostgreSQL Database
├── Stripe Payments        ├── Telegram Bot          └── Row Level Security
└── Display data           └── Binance API fetching
```

---

## 🔄 Phase 1: Foundation ✅ COMPLETE

| # | Task | Status |
|---|------|--------|
| 1 | Project structure | ✅ |
| 2 | Next.js 16 + Tailwind 4 frontend | ✅ |
| 3 | Python analysis engine (Flask + pandas-ta) | ✅ |
| 4 | Vercel deployment | ✅ |
| 5 | Supabase client setup (browser + server) | ✅ |
| 6 | Auth middleware (protect routes) | ✅ |
| 7 | Login page (Email + Google) | ✅ |
| 8 | Signup page (30-day trial) | ✅ |
| 9 | OAuth callback handler | ✅ |
| 10 | Dashboard layout + sidebar nav | ✅ |
| 11 | Dashboard page (stats + signals) | ✅ |
| 12 | Signals page (table + filters + pagination) | ✅ |
| 13 | Coins listing page (grid) | ✅ |
| 14 | Coin detail page (chart placeholder + signals) | ✅ |
| 15 | Profile page (subscription status) | ✅ |
| 16 | Pricing page (Free Trial vs Pro) | ✅ |
| 17 | Navbar (auth-aware) | ✅ |
| 18 | Footer | ✅ |
| 19 | Landing page (hero + features + CTA) | ✅ |
| 20 | Database schema SQL migration | ✅ |
| 21 | Design system (dark theme, badges, animations) | ✅ |

---

## 🔄 Phase 2: Data Pipeline (Days 4–7) ← CURRENT

| # | Task | Status |
|---|------|--------|
| 1 | **Run SQL migration** in Supabase SQL Editor | ⬜ ACTION NEEDED |
| 2 | Set Supabase env vars in Vercel | ⬜ ACTION NEEDED |
| 3 | Enable Google Auth in Supabase | ⬜ ACTION NEEDED |
| 4 | Update Python → write to Supabase | ⬜ Next |
| 5 | Test full data flow (Binance → Python → DB) | ⬜ Pending |
| 6 | TradingView charts | ⬜ Pending |
| 7 | Wire real data to dashboard | ⬜ Pending |

## Phase 3: Payments (Days 8–9)

| # | Task | Status |
|---|------|--------|
| 1 | Stripe integration | ⬜ |
| 2 | Checkout flow | ⬜ |
| 3 | Webhook handler | ⬜ |
| 4 | Trial expiry logic | ⬜ |

## Phase 4: Automation (Days 10–12)

| # | Task | Status |
|---|------|--------|
| 1 | n8n workflows | ⬜ |
| 2 | Telegram bot deploy | ⬜ |
| 3 | Auto-alerts for paid users | ⬜ |

## Phase 5: Launch (Days 13–14)

| # | Task | Status |
|---|------|--------|
| 1 | Deploy to Oracle VPS | ⬜ |
| 2 | Domain + SSL | ⬜ |
| 3 | Final QA | ⬜ |

---

## 📦 Dependencies

### Frontend (Installed ✅)

| Package | Status |
|---------|--------|
| `next` 16.1.6 | ✅ |
| `react` 19.2.3 | ✅ |
| `tailwindcss` ^4 | ✅ |
| `@supabase/supabase-js` | ✅ |
| `@supabase/ssr` | ✅ |
| `lucide-react` | ✅ |
| `clsx` | ✅ |
| `swr` | ✅ |

### To Install Later

| Package | Phase |
|---------|-------|
| `stripe` + `@stripe/stripe-js` | Phase 3 |
| `lightweight-charts` | Phase 2 |
| `framer-motion` | Phase 2 |

---

## 📄 All Pages Built

| Route | Type | Auth | Status |
|-------|------|------|--------|
| `/` | Landing | Public | ✅ |
| `/login` | Auth | Public | ✅ |
| `/signup` | Auth | Public | ✅ |
| `/pricing` | Pricing | Public | ✅ |
| `/auth/callback` | OAuth | Public | ✅ |
| `/dashboard` | Dashboard | 🔒 Protected | ✅ |
| `/signals` | Signals list | 🔒 Protected | ✅ |
| `/coins` | Coins grid | 🔒 Protected | ✅ |
| `/coins/[symbol]` | Coin detail | 🔒 Protected | ✅ |
| `/profile` | User profile | 🔒 Protected | ✅ |

---

## 🎯 Immediate Next Steps (User Actions)

1. **Run SQL migration** → Go to Supabase → SQL Editor → Paste `supabase/migrations/001_initial_schema.sql` → Run
2. **Set env vars in Vercel** → Project Settings → Environment Variables → Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. **Enable Google Auth** → Supabase → Authentication → Providers → Google → Enable
4. **Redeploy** on Vercel
