# 📊 SmartEntry — Plan Tracker & Dependencies

> **Last Updated:** 2026-05-01
> **Architecture:** v2 (Vercel + Oracle + Supabase)
> **Current Phase:** Phase 2 — Gold + Dashboard Wiring
> **Overall Progress:** ██████████████░ 70%

---

## ✅ Phase 1: Foundation — COMPLETE

All 21 tasks done ✅

## ✅ Phase 2a: Data Pipeline — COMPLETE

| # | Task | Status |
|---|------|--------|
| 1 | Supabase setup (migration, env vars, Google Auth) | ✅ |
| 2 | Python analysis engine (12 indicators, `ta` library) | ✅ |
| 3 | Binance client + Supabase writer | ✅ |
| 4 | Oracle VM deployed + running | ✅ |
| 5 | 30 coins analyzed, 25 real signals | ✅ |
| 6 | TradingView chart widget | ✅ |
| 7 | Migration 002 (STRONG_BUY, AVOID) | ✅ |
| 8 | `ta` library replacing `pandas-ta` | ✅ |
| 9 | Referral link (GRO_28502_BM9FA) | ✅ |

## 🔄 Phase 2b: Gold + UI Polish ← CURRENT

| # | Task | Status |
|---|------|--------|
| 1 | Gold strategy proposal | ✅ Done |
| 2 | Gold page with 3 tabs (Chart / Economics / Signals) | ⬜ Next |
| 3 | FRED API integration (macro indicators) | ⬜ Next |
| 4 | Gold analysis engine (macro + technical) | ⬜ Next |
| 5 | Update coin pages → 2 tabs (Chart / Signals) | ⬜ Next |
| 6 | Migration 003: Gold tables | ⬜ Next |
| 7 | Sidebar "Gold" link | ⬜ Next |

## Phase 3: Payments (Days 8–9)

| # | Task | Status |
|---|------|--------|
| 1 | Stripe integration | ⬜ |
| 2 | Checkout + webhook | ⬜ |
| 3 | Trial expiry logic | ⬜ |

## Phase 4: Automation (Days 10–12)

| # | Task | Status |
|---|------|--------|
| 1 | n8n cron (every 5 min) | ⬜ |
| 2 | Telegram bot | ⬜ |
| 3 | Auto-alerts for pro users | ⬜ |

## Phase 5: Launch (Days 13–14)

| # | Task | Status |
|---|------|--------|
| 1 | Domain + SSL | ⬜ |
| 2 | Final QA | ⬜ |
| 3 | Launch 🚀 | ⬜ |

---

## 📦 Dependencies

### Python (`analysis/requirements.txt`)
| Package | Purpose | Status |
|---------|---------|--------|
| `ta==0.11.0` | Technical indicators | ✅ |
| `flask==3.0.3` | API server | ✅ |
| `pandas==2.1.4` | Data analysis | ✅ |
| `supabase>=2.0.0` | Database | ✅ |
| `fredapi` | FRED macro data (Gold) | ⬜ Phase 2b |

### Frontend (npm)
| Package | Purpose | Status |
|---------|---------|--------|
| `next` 16, `react` 19 | Framework | ✅ |
| `@supabase/ssr` | Auth | ✅ |
| `lightweight-charts` | Charts (backup) | ✅ |
| `lucide-react` | Icons | ✅ |
