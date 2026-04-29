# 🚀 SmartEntry — Crypto Trading Signals & Insights

## Complete MVP Implementation Plan (v2 — Updated)

> **Goal:** Build a production-ready crypto signals platform with auth, subscriptions, and automated analysis.
> **Business Model:** 30-day free trial → $19.99/month subscription
> **Cost:** $0/month infrastructure (Vercel + Supabase + Oracle free tiers)

---

## 📐 System Architecture (v2)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLOUD SERVICES (FREE)                        │
│                                                                     │
│  ┌──────────────────────┐    ┌───────────────────────────────────┐  │
│  │   Vercel (FREE)       │    │   Supabase (FREE)                │  │
│  │                       │    │                                   │  │
│  │  Next.js 16 Frontend  │◄──►│  Auth (Email + Google)           │  │
│  │  + API Routes         │    │  PostgreSQL Database             │  │
│  │  + Server Actions     │    │  Row Level Security              │  │
│  │                       │    │  Real-time subscriptions         │  │
│  │  Pages:               │    │                                   │  │
│  │  - Landing            │    │  Tables:                          │  │
│  │  - Login / Signup     │    │  - profiles (user data)          │  │
│  │  - Dashboard          │    │  - coins                         │  │
│  │  - Signals            │    │  - candles                       │  │
│  │  - Coin Detail        │    │  - signals                       │  │
│  │  - Pricing            │    │  - subscriptions                 │  │
│  │  - Profile            │    │                                   │  │
│  └──────────┬────────────┘    └───────────────┬───────────────────┘  │
│             │                                 │                      │
│             │          ┌──────────────┐        │                      │
│             └──────────│  Stripe      │────────┘                      │
│                        │  Payments    │                               │
│                        │  $19.99/mo   │                               │
│                        └──────────────┘                               │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    Oracle Cloud VPS (FREE)                           │
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │  Python Analysis  │  │  n8n Automation   │  │  Telegram Bot    │  │
│  │  Engine (Flask)   │  │  (existing)       │  │  (grammY)        │  │
│  │                   │  │                   │  │                  │  │
│  │  - Fetch Binance  │  │  - Cron: 5 min    │  │  - /signals      │  │
│  │  - RSI / MACD     │  │  - Trigger Python │  │  - /coin BTC     │  │
│  │  - Signal scoring │  │  - Send alerts    │  │  - Auto-alerts   │  │
│  │  - Write to       │  │  - Daily report   │  │                  │  │
│  │    Supabase DB    │  │                   │  │                  │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
│                                                                     │
│  Binance API (FREE) ──► n8n ──► Python ──► Supabase DB             │
└─────────────────────────────────────────────────────────────────────┘

Data Flow:
═════════
Binance API ──► n8n (cron 5min) ──► Python (analysis) ──► Supabase DB
                                                              │
User Browser ──► Vercel (Next.js) ──► Supabase (direct query) ─┘
                      │
                      ├── Supabase Auth (login/signup)
                      └── Stripe (payments)
```

### What Changed from v1

| Component | v1 (Old) | v2 (New) | Why |
|-----------|----------|----------|-----|
| **Database** | SQLite on VPS | Supabase PostgreSQL | Cloud-hosted, auth included, free |
| **Auth** | None | Supabase Auth | Email + Google login, free |
| **Backend API** | Express.js on VPS | Next.js API Routes on Vercel | Less load on VPS, serverless |
| **Cache** | Redis on VPS | Next.js ISR + Supabase | One less service to manage |
| **Payments** | None | Stripe | Industry standard, pay only on revenue |
| **VPS Load** | Heavy (6 services) | Light (3 services) | Python + n8n + Telegram only |

### Architecture Decisions (v2)

| Decision | Choice | Why |
|----------|--------|-----|
| **Auth** | Supabase Auth | Free, Email + Google, 50K users/month |
| **Database** | Supabase PostgreSQL | Free, managed, RLS for security |
| **Frontend + API** | Next.js 16 on Vercel | Free hosting, API Routes = no Express needed |
| **Analysis** | Python + pandas-ta on VPS | Heavy computation stays on VPS |
| **Automation** | n8n on VPS | Already installed, visual workflows |
| **Payments** | Stripe | $0 until revenue, handles subscriptions |
| **Alerts** | Telegram Bot on VPS | Runs 24/7, no serverless limits |
| **Charts** | TradingView Lightweight Charts | Free, fast, professional |

---

## 💰 Business Model

### Subscription Tiers

| | Free Trial | Pro ($19.99/mo) |
|---|---|---|
| **Duration** | 30 days | Monthly subscription |
| **Signals** | Top 5 signals only | All 50+ coins |
| **Charts** | Basic view | Full TradingView charts |
| **Telegram Alerts** | ❌ | ✅ Real-time alerts |
| **Daily Reports** | ❌ | ✅ Email + Telegram |
| **Coin Detail** | Limited | Full analysis + indicators |
| **API Access** | ❌ | Future feature |

### Revenue Streams

1. **Subscriptions** — $19.99/month per user
2. **Binance Affiliate** — Commission on every trade via referral link
3. **Telegram VIP Group** — Exclusive access for paid users

---

## 📦 Tech Stack (Updated)

### Frontend (Vercel — Next.js 16)

| Package | Purpose |
|---------|---------|
| `next` 16.1.6 | Framework (already installed) |
| `react` 19.2.3 | UI (already installed) |
| `tailwindcss` ^4 | Styling (already installed) |
| `@supabase/supabase-js` | Auth + Database client |
| `@supabase/ssr` | Server-side Supabase for Next.js |
| `stripe` | Stripe server SDK |
| `@stripe/stripe-js` | Stripe client SDK |
| `lightweight-charts` | TradingView charts |
| `lucide-react` | Icons |
| `swr` | Data fetching + caching |
| `clsx` | Conditional classnames |
| `framer-motion` | Animations |

### Oracle VPS (Python + Node.js)

| Package | Purpose |
|---------|---------|
| `flask` | Python API |
| `pandas` + `pandas-ta` | Technical analysis |
| `supabase` (Python) | Write signals to Supabase DB |
| `requests` | HTTP client |
| `grammy` | Telegram bot |
| `n8n` | Automation (already installed) |

### Cloud Services (All FREE)

| Service | Free Tier Limit | Our Usage |
|---------|-----------------|-----------|
| **Vercel** | 100GB bandwidth/month | ~5GB |
| **Supabase** | 50K users, 500MB DB, 5GB bandwidth | Well within |
| **Stripe** | $0/month, 2.9% + 30¢ per transaction | Pay only on revenue |
| **Oracle VPS** | 4 OCPU, 24GB RAM | Using ~2GB |
| **Binance API** | 1200 weight/min | Using ~200/cycle |

---

## 🗄️ Database Schema (Supabase PostgreSQL)

```sql
-- ═══════════════════════════════════════════
-- Users & Auth (Supabase Auth handles this)
-- ═══════════════════════════════════════════

-- User profiles (extends Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'trial',  -- 'trial', 'pro', 'expired'
  trial_starts_at TIMESTAMPTZ DEFAULT now(),
  trial_ends_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '30 days'),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  telegram_chat_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════
-- Market Data
-- ═══════════════════════════════════════════

CREATE TABLE coins (
  symbol TEXT PRIMARY KEY,
  base_asset TEXT NOT NULL,
  quote_asset TEXT DEFAULT 'USDT',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE candles (
  id BIGSERIAL PRIMARY KEY,
  symbol TEXT NOT NULL REFERENCES coins(symbol),
  interval TEXT NOT NULL,
  open_time BIGINT NOT NULL,
  open DOUBLE PRECISION NOT NULL,
  high DOUBLE PRECISION NOT NULL,
  low DOUBLE PRECISION NOT NULL,
  close DOUBLE PRECISION NOT NULL,
  volume DOUBLE PRECISION NOT NULL,
  close_time BIGINT,
  UNIQUE(symbol, interval, open_time)
);

CREATE TABLE signals (
  id BIGSERIAL PRIMARY KEY,
  symbol TEXT NOT NULL,
  signal_type TEXT NOT NULL,
  action TEXT NOT NULL,
  strength DOUBLE PRECISION DEFAULT 0,
  price_at_signal DOUBLE PRECISION,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ
);

-- ═══════════════════════════════════════════
-- Subscriptions
-- ═══════════════════════════════════════════

CREATE TABLE subscriptions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT DEFAULT 'active',  -- 'active', 'canceled', 'past_due'
  plan TEXT DEFAULT 'pro',
  price_cents INTEGER DEFAULT 1999,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════
-- Row Level Security (RLS)
-- ═══════════════════════════════════════════

-- Everyone can read coins and public signals
ALTER TABLE coins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Coins are public" ON coins FOR SELECT USING (true);

ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
-- Free users: only top 5 signals (handled in API, not RLS)
CREATE POLICY "Signals are readable by authenticated users"
  ON signals FOR SELECT
  USING (auth.role() = 'authenticated');

-- Profiles: users can only read/update their own
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Subscriptions: users can only read their own
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own subscriptions"
  ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Python analysis engine writes via service role (bypasses RLS)

-- ═══════════════════════════════════════════
-- Indexes
-- ═══════════════════════════════════════════
CREATE INDEX idx_candles_symbol_interval ON candles(symbol, interval);
CREATE INDEX idx_candles_open_time ON candles(open_time DESC);
CREATE INDEX idx_signals_created_at ON signals(created_at DESC);
CREATE INDEX idx_signals_action ON signals(action);
CREATE INDEX idx_signals_symbol ON signals(symbol);
CREATE INDEX idx_profiles_stripe ON profiles(stripe_customer_id);
```

---

## 📁 Project Structure (v2 — Updated)

```
smartentry/
├── frontend/                         # Next.js 16 (Vercel)
│   ├── app/
│   │   ├── layout.tsx                # Root layout + Supabase provider
│   │   ├── page.tsx                  # Landing page
│   │   ├── globals.css               # Design system
│   │   │
│   │   ├── (auth)/                   # Auth pages (no navbar)
│   │   │   ├── login/page.tsx        # Email + Google login
│   │   │   ├── signup/page.tsx       # Registration
│   │   │   └── callback/route.ts     # OAuth callback
│   │   │
│   │   ├── (dashboard)/              # Protected pages (behind auth)
│   │   │   ├── layout.tsx            # Dashboard layout + auth check
│   │   │   ├── dashboard/page.tsx    # Main dashboard
│   │   │   ├── signals/page.tsx      # All signals
│   │   │   ├── coin/[symbol]/page.tsx # Coin detail
│   │   │   └── profile/page.tsx      # User profile + subscription
│   │   │
│   │   ├── pricing/page.tsx          # Pricing page (public)
│   │   │
│   │   └── api/                      # API Routes (serverless)
│   │       ├── signals/route.ts      # GET signals (tier-gated)
│   │       ├── coins/[symbol]/route.ts
│   │       ├── market/route.ts
│   │       ├── stripe/
│   │       │   ├── checkout/route.ts # Create Stripe session
│   │       │   └── webhook/route.ts  # Stripe webhook handler
│   │       └── auth/
│   │           └── callback/route.ts # Supabase auth callback
│   │
│   ├── components/
│   │   ├── layout/ (Navbar, Footer, Sidebar)
│   │   ├── charts/ (PriceChart, MiniChart)
│   │   ├── signals/ (SignalCard, SignalTable)
│   │   ├── dashboard/ (StatsCards, TopSignals)
│   │   ├── auth/ (LoginForm, SignupForm, GoogleButton)
│   │   └── ui/ (Card, Badge, Skeleton, Modal)
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser Supabase client
│   │   │   ├── server.ts             # Server Supabase client
│   │   │   └── middleware.ts         # Auth middleware
│   │   ├── stripe.ts                 # Stripe client
│   │   ├── utils.ts
│   │   └── constants.ts
│   │
│   ├── hooks/
│   │   ├── useUser.ts                # Current user hook
│   │   ├── useSubscription.ts        # Subscription status
│   │   └── useSignals.ts             # Signals data
│   │
│   └── middleware.ts                 # Next.js middleware (auth redirect)
│
├── analysis/                         # Python (Oracle VPS)
│   ├── app.py                        # Flask API
│   ├── engine/
│   │   ├── indicators.py             # RSI, MACD, SMA, EMA
│   │   ├── signals.py                # Signal scoring
│   │   ├── volume.py                 # Volume spikes
│   │   └── trends.py                 # Trend analysis
│   ├── utils/
│   │   ├── binance_client.py         # Binance API
│   │   └── supabase_client.py        # Write to Supabase DB
│   ├── requirements.txt
│   └── Dockerfile
│
├── telegram-bot/                     # Telegram (Oracle VPS)
│   ├── src/bot.ts
│   └── package.json
│
├── n8n/                              # Automation configs
│   └── README.md
│
├── docker/                           # Docker for VPS only
│   ├── docker-compose.yml            # Python + Telegram only
│   └── Dockerfile.analysis
│
├── supabase/                         # Database migrations
│   └── migrations/
│       └── 001_initial_schema.sql
│
├── .env.example
├── vercel.json
├── package.json
└── README.md
```

### What's Removed from v1
- ❌ `backend/` folder (Express.js) → replaced by Next.js API Routes
- ❌ Redis → not needed with Supabase + ISR caching
- ❌ SQLite → replaced by Supabase PostgreSQL
- ❌ Nginx → Vercel handles frontend, VPS only needs Docker

---

## 📚 Open Source References & Inspirations

These battle-tested repos are used as reference for our analysis engine:

| Repo | Stars | What We Take |
|------|-------|-------------|
| [CryptoSignal/Crypto-Signal](https://github.com/CryptoSignal/Crypto-Signal) | 5,500+ ⭐ | Ichimoku Cloud, MFI, OBV, VWAP algorithms, multi-exchange patterns |
| [ccxt/ccxt](https://github.com/ccxt/ccxt) | 33,000+ ⭐ | Unified multi-exchange API (100+ exchanges), used for our data fetching |
| [twopirllc/pandas-ta](https://github.com/twopirllc/pandas-ta) | 5,200+ ⭐ | Core TA library — 130+ indicators (RSI, MACD, BB, etc.) |
| [bukosabino/ta](https://github.com/bukosabino/ta) | 4,400+ ⭐ | Additional TA reference — Bollinger %B, Keltner, Donchian |
| [freqtrade/freqtrade](https://github.com/freqtrade/freqtrade) | 30,000+ ⭐ | Strategy patterns, backtesting logic, signal confidence scoring |
| [jesse-ai/jesse](https://github.com/jesse-ai/jesse) | 5,800+ ⭐ | Advanced strategy framework, risk management patterns |
| [tradingview/lightweight-charts](https://github.com/tradingview/lightweight-charts) | 9,500+ ⭐ | Our charting library on frontend |

---

## 🔄 Multi-Exchange Support (via ccxt)

### Supported Exchanges (All Free Public APIs)

| Exchange | Region | Free API | What We Fetch |
|----------|--------|----------|---------------|
| **Binance** | Global | ✅ | OHLCV, Ticker, Volume |
| **Coinbase** | US/EU | ✅ | OHLCV, Ticker |
| **Kraken** | Global | ✅ | OHLCV, Ticker |
| **KuCoin** | Global | ✅ | OHLCV, Ticker, Volume |
| **OKX** | Global | ✅ | OHLCV, Ticker |
| **Bybit** | Global | ✅ | OHLCV, Ticker |

### How ccxt Works for Us

```python
import ccxt

# One unified API for ALL exchanges
exchanges = {
    'binance': ccxt.binance(),
    'coinbase': ccxt.coinbase(),
    'kraken': ccxt.kraken(),
    'kucoin': ccxt.kucoin(),
    'okx': ccxt.okx(),
    'bybit': ccxt.bybit(),
}

# Same code works for ANY exchange
for name, exchange in exchanges.items():
    ohlcv = exchange.fetch_ohlcv('BTC/USDT', '1h', limit=100)
    ticker = exchange.fetch_ticker('BTC/USDT')
```

### Benefits
- **Cross-exchange signals** — compare prices across exchanges
- **Arbitrage detection** — spot price differences
- **Better accuracy** — aggregate data from multiple sources
- **More coins** — some coins only on certain exchanges

---

## 📊 Enhanced Technical Indicators

### Current Indicators (Phase 1 ✅)
| Indicator | Category | Status |
|-----------|----------|--------|
| RSI (14) | Momentum | ✅ Done |
| MACD (12,26,9) | Momentum | ✅ Done |
| SMA (20, 50, 200) | Trend | ✅ Done |
| EMA (12, 26) | Trend | ✅ Done |
| Bollinger Bands (20,2) | Volatility | ✅ Done |
| Volume Spike Detection | Volume | ✅ Done |

### New Indicators (Phase 2 — from Crypto-Signal)
| Indicator | Category | Source | Priority |
|-----------|----------|--------|----------|
| **Ichimoku Cloud** | Trend | Crypto-Signal | 🔴 High |
| **MFI** (Money Flow Index) | Volume | Crypto-Signal | 🔴 High |
| **OBV** (On-Balance Volume) | Volume | Crypto-Signal | 🟡 Medium |
| **VWAP** (Volume Weighted Avg Price) | Volume | Crypto-Signal | 🟡 Medium |
| **Stochastic RSI** | Momentum | pandas-ta | 🟡 Medium |
| **ADX** (Average Directional Index) | Trend Strength | pandas-ta | 🟡 Medium |
| **ATR** (Average True Range) | Volatility | pandas-ta | 🟢 Low |
| **Fibonacci Retracement** | Support/Resistance | Custom | 🟢 Low |
| **Bollinger %B** | Volatility | ta lib | 🟢 Low |
| **Keltner Channel** | Volatility | ta lib | 🟢 Low |

### Scoring System (Enhanced)
```
Signal Score = (
  RSI Score (15%) +
  MACD Score (15%) +
  MA Cross Score (10%) +
  Ichimoku Score (15%) +      ← NEW
  MFI Score (10%) +           ← NEW
  Volume Score (10%) +
  OBV Score (10%) +           ← NEW
  Stochastic RSI Score (10%) + ← NEW
  ADX Score (5%)              ← NEW
)

BUY:   Score ≥ 70/100
WATCH: Score 40-69/100
WAIT:  Score < 40/100
```

---

## 📰 Daily Market Reports (Auto-generated)

### Concept
Every morning, n8n triggers the Python engine to generate a **daily market report** — a human-readable article summarizing yesterday's market activity, top signals, and outlook. Published automatically to the website for SEO traffic.

### Report Structure
```
📰 SmartEntry Daily Report — April 29, 2026
═══════════════════════════════════════════

🟢 Market Summary
- BTC: $67,450 (+2.3%) — Bullish momentum continues
- Total signals: 47 BUY, 23 WATCH, 30 WAIT

🔥 Top BUY Signals
1. ETH/USDT — Score 89/100 — RSI oversold bounce + MACD crossover
2. SOL/USDT — Score 85/100 — Ichimoku bullish cloud breakout
3. AVAX/USDT — Score 78/100 — Volume spike + MFI confirmation

⚡ Key Events
- BTC broke above 200 SMA for first time in 2 weeks
- ETH volume 340% above average
- 3 new BUY signals triggered overnight

📊 Technical Outlook
- Support: $65,200 | Resistance: $69,800
- RSI: 58 (neutral-bullish)
- Overall market: CAUTIOUSLY BULLISH
```

### Pipeline
```
n8n (6:00 AM UTC daily)
  │
  ├── Trigger Python analysis engine
  │     └── Generate report from last 24h signals
  │
  ├── Save report to Supabase (reports table)
  │
  ├── Publish to website (/reports page)
  │
  ├── Send to Telegram channel
  │
  └── Email to Pro subscribers
```

### Database Addition
```sql
CREATE TABLE IF NOT EXISTS reports (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,          -- Markdown content
  summary TEXT,                   -- Short summary for cards
  market_sentiment TEXT,          -- BULLISH, BEARISH, NEUTRAL
  btc_price DOUBLE PRECISION,
  total_buy_signals INTEGER,
  total_watch_signals INTEGER,
  total_wait_signals INTEGER,
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_reports_published ON reports(published_at DESC);
CREATE INDEX idx_reports_slug ON reports(slug);
```

### Frontend Pages
- `/reports` — List of all daily reports (public, SEO-friendly)
- `/reports/[slug]` — Individual report page (public)
- Widget on dashboard showing latest report summary

---

## 🗓️ Updated Phase Plan

### PHASE 1: Foundation (Days 1–3) ✅ COMPLETE
- [x] Project structure
- [x] Frontend template (Next.js 16 + Tailwind 4)
- [x] Python analysis engine (RSI, MACD, SMA, EMA, BB)
- [x] Docker setup
- [x] Supabase project setup (tables, auth, RLS)
- [x] Auth system (Email + Google login)
- [x] Auth middleware (protected routes)
- [x] All pages (dashboard, signals, coins, profile, pricing)
- [x] Vercel deployment

### PHASE 2: Data Pipeline + Enhanced Analysis (Days 4–7) ← CURRENT
- [ ] Install ccxt for multi-exchange support
- [ ] Connect Python → Supabase (write signals)
- [ ] Fetch real data from Binance + 5 exchanges
- [ ] Add new indicators (Ichimoku, MFI, OBV, VWAP, StochRSI, ADX)
- [ ] Enhanced scoring system (9 indicators)
- [ ] TradingView charts on coin detail page
- [ ] Tier-gated content (free trial vs pro)
- [ ] Wire real signals to dashboard

### PHASE 3: Payments + Subscriptions (Days 8–9)
- [ ] Stripe integration
- [ ] Checkout flow
- [ ] Webhook → update subscription in Supabase
- [ ] 30-day trial logic
- [ ] Expired trial → redirect to pricing

### PHASE 4: Daily Reports + Automation (Days 10–12)
- [ ] Python report generator
- [ ] Reports database table
- [ ] `/reports` and `/reports/[slug]` pages
- [ ] n8n daily cron workflow (6 AM UTC)
- [ ] Telegram bot alerts
- [ ] Email reports to Pro subscribers
- [ ] Dashboard report widget

### PHASE 5: Deployment + Launch (Days 13–14)
- [ ] Deploy Python + Telegram + n8n to Oracle VPS
- [ ] Configure all n8n workflows
- [ ] Domain + SSL
- [ ] SEO optimization (reports = organic traffic)
- [ ] Final QA
- [ ] Launch 🚀

---

## 🔑 Environment Variables

```env
# === Supabase ===
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# === Stripe ===
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_PRICE_ID=price_xxxxx

# === Binance (no auth needed) ===
BINANCE_BASE_URL=https://api.binance.com
NEXT_PUBLIC_BINANCE_AFFILIATE_REF=your_referral_id

# === Telegram Bot ===
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHANNEL_ID=@smartentry_signals

# === Analysis Engine (VPS) ===
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIs...
```

---

## ✅ Pre-Implementation Checklist

- [x] Create Supabase project ✅
- [x] Run SQL migration ✅
- [x] Set Supabase env vars in Vercel ✅
- [x] Enable Google Auth ✅
- [ ] Create Stripe account (stripe.com — free)
- [ ] Domain name ready?
- [ ] Oracle VPS SSH access working?
- [ ] Telegram bot created via @BotFather?

---

> **Current Focus:** Phase 2 — Connect real data pipeline, add enhanced indicators, multi-exchange support.
