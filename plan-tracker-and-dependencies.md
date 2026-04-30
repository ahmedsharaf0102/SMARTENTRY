# 📊 SmartEntry — Plan Tracker & Dependencies

> **Last Updated:** 2026-04-30
> **Architecture:** v2 (Vercel + Oracle + Supabase)
> **Current Phase:** Phase 2 — Connecting Oracle VM
> **Overall Progress:** ██████████░░░░ 55%

---

## 🏗️ Architecture (v2)

```
🟢 Vercel               🔵 Oracle VPS (12GB)     ☁️ Supabase
├── Next.js 16 (root)   ├── Python Analysis      ├── Auth (Email+Google)
├── API Routes          ├── n8n (later)          ├── PostgreSQL
├── TradingView Charts  ├── Telegram Bot (later) └── RLS
└── Display signals     └── Runs every 5 min
```

---

## ✅ Phase 1: Foundation — COMPLETE

| # | Task | Status |
|---|------|--------|
| 1–21 | All foundation tasks | ✅ All done |

---

## 🔄 Phase 2: Data Pipeline ← CURRENT

| # | Task | Status |
|---|------|--------|
| 1 | Run SQL migration in Supabase | ✅ Done by user |
| 2 | Set Supabase env vars in Vercel | ✅ Done by user |
| 3 | Enable Google Auth in Supabase | ✅ Done by user |
| 4 | Python → Supabase client code | ✅ Code written |
| 5 | Binance API client code | ✅ Code written |
| 6 | Flask app.py pipeline code | ✅ Code written |
| 7 | 12-indicator system + strategy proposal | ✅ Code written |
| 8 | TradingView chart component | ✅ Code written (needs candle data) |
| 9 | Seed route fixed | ✅ Code fixed (test after deploy) |
| 10 | **Deploy Python to Oracle VM** | ⬜ **CURRENT** |
| 11 | Run analysis → real signals in Supabase | ⬜ Blocked by #10 |
| 12 | Dashboard shows real data | ⬜ Blocked by #11 |

---

## Phase 3–5: Unchanged

| Phase | Tasks | Status |
|-------|-------|--------|
| 3 | Stripe payments | ⬜ |
| 4 | n8n + Telegram | ⬜ |
| 5 | Launch | ⬜ |

---

## 📦 Key Files

| File | Purpose |
|------|---------|
| `strategy-proposal.md` | Signal strategy (pending review) |
| `signal-system-explained.md` | Signal system docs (v2) |
| `analysis/` | Python engine (deploy to Oracle) |
