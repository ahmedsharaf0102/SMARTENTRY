# 📊 SmartEntry — Plan Tracker & Dependencies

> **Last Updated:** 2026-04-29
> **Architecture:** v2 (Vercel + Oracle + Supabase)
> **Current Phase:** Phase 2 — Data Pipeline
> **Overall Progress:** ████████████░░ 60%

---

## 🏗️ Architecture (v2)

```
🟢 Vercel (FREE)           🔵 Oracle VPS (FREE)      ☁️ Supabase (FREE)
├── Next.js 16 (root)      ├── Python Analysis       ├── Auth (Email+Google)
├── API Routes             ├── n8n Automation        ├── PostgreSQL Database
├── Stripe Payments        ├── Telegram Bot          └── Row Level Security
└── Display data           └── Binance API fetching
```

> **Structure:** Next.js lives at repo root (like standard projects). `analysis/`, `telegram-bot/` sit alongside.

---

## ✅ Phase 1: Foundation — COMPLETE

| # | Task | Status |
|---|------|--------|
| 1–21 | All foundation tasks | ✅ All done |
| — | Auth (Email + Google), middleware, all pages, design system, Vercel deploy | ✅ |

---

## 🔄 Phase 2: Data Pipeline (Days 4–7) ← CURRENT

| # | Task | Status |
|---|------|--------|
| 1 | Run SQL migration in Supabase | ✅ Done by user |
| 2 | Set Supabase env vars in Vercel | ✅ Done by user |
| 3 | Enable Google Auth in Supabase | ✅ Done by user |
| 4 | Python → Supabase client | ✅ Done |
| 5 | Binance API client (rate-limited) | ✅ Done |
| 6 | Flask app.py (full pipeline) | ✅ Done |
| 7 | Signal system documentation | ✅ Done |
| 8 | TradingView charts on coin detail | ⬜ Next |
| 9 | Seed demo data via Vercel API route | ⬜ Next |
| 10 | Wire real signals to dashboard | ⬜ Next |

---

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
| 3 | Auto-alerts | ⬜ |

## Phase 5: Launch (Days 13–14)

| # | Task | Status |
|---|------|--------|
| 1 | Deploy Python to Oracle VPS | ⬜ |
| 2 | Domain + SSL | ⬜ |
| 3 | Final QA | ⬜ |

---

## 📦 Dependencies

### Root (Next.js — Installed ✅)

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

### To Install

| Package | Phase |
|---------|-------|
| `lightweight-charts` | Phase 2 |
| `stripe` + `@stripe/stripe-js` | Phase 3 |

### Python (`analysis/requirements.txt`)

| Package | Status |
|---------|--------|
| `flask`, `pandas`, `pandas-ta`, `numpy` | ✅ Coded |
| `requests`, `supabase`, `python-dotenv` | ✅ Coded |

---

## 📄 All Pages

| Route | Auth | Status |
|-------|------|--------|
| `/` | Public | ✅ |
| `/login` | Public | ✅ |
| `/signup` | Public | ✅ |
| `/pricing` | Public | ✅ |
| `/auth/callback` | Public | ✅ |
| `/dashboard` | 🔒 | ✅ |
| `/signals` | 🔒 | ✅ |
| `/coins` | 🔒 | ✅ |
| `/coins/[symbol]` | 🔒 | ✅ |
| `/profile` | 🔒 | ✅ |

---

## 📝 Key Files

| File | Purpose |
|------|---------|
| `signal-system-explained.md` | Signal system docs (keep updated) |
| `plan.md` | Full architecture plan |
| `plan-tracker-and-dependencies.md` | This file |
| `supabase/migrations/001_initial_schema.sql` | Database schema |
