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

## 🗓️ Updated Phase Plan

### PHASE 1: Foundation (Days 1–3)
- [x] Project structure
- [x] Frontend template (Next.js + Tailwind)
- [x] Python analysis engine
- [x] Docker setup
- [ ] **NEW: Set up Supabase project** (create tables, enable auth)
- [ ] **NEW: Supabase Auth integration** (signup, login, Google)
- [ ] **NEW: Auth middleware** (protect dashboard routes)
- [ ] Connect Python → Supabase (write signals)

### PHASE 2: Dashboard + Data (Days 4–7)
- [ ] Fetch real data from Binance → Python → Supabase
- [ ] Build dashboard with real signals
- [ ] Signal cards, tables, filters
- [ ] TradingView charts on coin detail page
- [ ] Tier-gated content (free trial vs pro)

### PHASE 3: Payments + Subscriptions (Days 8–9)
- [ ] Stripe integration
- [ ] Pricing page
- [ ] Checkout flow
- [ ] Webhook → update subscription in Supabase
- [ ] 30-day trial logic
- [ ] Expired trial → redirect to pricing

### PHASE 4: Automation + Alerts (Days 10–12)
- [ ] n8n workflows
- [ ] Telegram bot
- [ ] Auto-alerts for paid users
- [ ] Daily reports

### PHASE 5: Deployment + Launch (Days 13–14)
- [ ] Deploy Python + Telegram to Oracle VPS
- [ ] Configure n8n workflows
- [ ] Domain + SSL
- [ ] Final QA
- [ ] Launch

---

## 🔑 Environment Variables (Updated)

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
BINANCE_AFFILIATE_REF=your_referral_id
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

- [ ] Create Supabase project (supabase.com — free)
- [ ] Create Stripe account (stripe.com — free)
- [ ] Get Supabase URL + keys
- [ ] Get Stripe keys
- [ ] Enable Google Auth in Supabase dashboard
- [ ] Domain name ready?
- [ ] Oracle VPS SSH access working?
- [ ] Telegram bot created via @BotFather?

---

> **Next Step:** Set up Supabase + Auth + update the codebase to use the new architecture.
