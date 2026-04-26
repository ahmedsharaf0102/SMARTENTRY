# 🚀 SmartEntry — Crypto Trading Insights Platform

## Complete MVP Implementation Plan

> **Goal:** Build a production-ready MVP in 7–14 days that provides actionable crypto trading signals, market insights, and automated analysis — deployed on Oracle Cloud Free Tier.

---

## 📐 System Architecture

```
┌───────────────────────────────────────────────────────────────────┐
│                  Oracle Cloud VPS (Free Tier)                     │
│                                                                   │
│  ┌─────────┐    ┌──────────────┐    ┌──────────────────┐         │
│  │  Nginx   │───▶│  Next.js      │    │  n8n (existing)  │         │
│  │ :80/:443 │    │  Frontend     │    │  :5678           │         │
│  │          │    │  :3000        │    │                  │         │
│  └────┬─────┘    └──────────────┘    └──────┬───────────┘         │
│       │                                      │                    │
│       │ /api/*                    Cron triggers every 5 min       │
│       ▼                                      │                    │
│  ┌──────────────┐                  ┌─────────▼──────────┐        │
│  │  Node.js API  │◄────signals────▶│  Python Analysis    │        │
│  │  (Express)    │                 │  Engine (Flask)     │        │
│  │  :4000        │                 │  :5000              │        │
│  └───┬──────┬────┘                 └──────────┬─────────┘        │
│      │      │                                 │                   │
│      ▼      ▼                                 ▼                   │
│  ┌───────┐ ┌───────┐              ┌───────────────────┐          │
│  │ Redis │ │SQLite │◄────────────▶│ Binance API       │          │
│  │ :6379 │ │  DB   │              │ (public, free)    │          │
│  └───────┘ └───────┘              └───────────────────┘          │
│      │                                                            │
│      ▼                                                            │
│  ┌──────────────┐                                                │
│  │ Telegram Bot  │───▶ Telegram Channel / VIP Group              │
│  │ (grammY)      │                                                │
│  └──────────────┘                                                │
└───────────────────────────────────────────────────────────────────┘

Data Flow:
═════════
Binance API ──▶ n8n (cron) ──▶ Python (analysis) ──▶ SQLite (store)
                                                          │
                                                          ▼
User Browser ──▶ Nginx ──▶ Next.js ──▶ Node API ──▶ Redis Cache ──▶ SQLite
                                          │
                                          ▼
                                    Telegram Bot ──▶ Users
```

### Architecture Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| **Database** | SQLite (WAL mode) | Zero memory overhead, perfect for MVP scale |
| **Cache** | Redis | Fast signal lookups, avoid repeated API calls |
| **Frontend** | Next.js 16 + Tailwind 4 | Already in your template, SSR for SEO |
| **API** | Express.js (Node) | Lightweight, fast, handles REST |
| **Analysis** | Python + pandas-ta | Best TA library ecosystem, 150+ indicators |
| **Automation** | n8n (existing) | Already installed, visual workflow builder |
| **Charts** | TradingView Lightweight Charts | Free, fast, professional look |
| **Alerts** | grammY (Telegram Bot) | Modern, TypeScript-first, lightweight |
| **Deployment** | Docker Compose | All services in one stack, easy management |

---

## 📦 Open-Source Libraries & Tools

### Frontend (Node.js / Next.js)

| Package | Purpose | Install |
|---------|---------|---------|
| `next` 16.x | React framework (already installed) | ✅ |
| `react` 19.x | UI library (already installed) | ✅ |
| `tailwindcss` 4.x | Styling (already installed) | ✅ |
| `lightweight-charts` | TradingView charts | `npm i lightweight-charts` |
| `lucide-react` | Icon library | `npm i lucide-react` |
| `swr` | Data fetching + caching | `npm i swr` |
| `clsx` | Conditional classnames | `npm i clsx` |
| `framer-motion` | Animations | `npm i framer-motion` |

### Backend (Node.js API)

| Package | Purpose | Install |
|---------|---------|---------|
| `express` | HTTP server | `npm i express` |
| `cors` | Cross-origin support | `npm i cors` |
| `better-sqlite3` | SQLite driver (fast, sync) | `npm i better-sqlite3` |
| `ioredis` | Redis client | `npm i ioredis` |
| `grammy` | Telegram Bot framework | `npm i grammy` |
| `node-cron` | Scheduled tasks | `npm i node-cron` |
| `zod` | Input validation | `npm i zod` |
| `helmet` | Security headers | `npm i helmet` |
| `compression` | Gzip responses | `npm i compression` |
| `winston` | Logging | `npm i winston` |

### Python Analysis Engine

| Package | Purpose | Install |
|---------|---------|---------|
| `flask` | Lightweight HTTP API | `pip install flask` |
| `pandas` | Data manipulation | `pip install pandas` |
| `pandas-ta` | 150+ technical indicators | `pip install pandas-ta` |
| `requests` | HTTP client | `pip install requests` |
| `numpy` | Numerical computing | `pip install numpy` |
| `gunicorn` | Production WSGI server | `pip install gunicorn` |

### Open-Source Repos to Reference / Integrate

| Repo | Stars | Use For |
|------|-------|---------|
| [CryptoSignal/Crypto-Signal](https://github.com/CryptoSignal/Crypto-Signal) | 4.5k+ | Signal generation patterns, indicator logic |
| [freqtrade/freqtrade](https://github.com/freqtrade/freqtrade) | 30k+ | Strategy patterns, Binance integration patterns |
| [tradingview/lightweight-charts](https://github.com/tradingview/lightweight-charts) | 8k+ | Chart component (direct dependency) |
| [python-binance](https://github.com/sammchardy/python-binance) | 5k+ | Reference for Binance API patterns |
| [grammyjs/grammY](https://github.com/grammyjs/grammY) | 2k+ | Telegram bot (direct dependency) |

---

## 📁 Project Folder Structure

```
smartentry/
├── frontend/                    # Next.js 16 App
│   ├── app/
│   │   ├── layout.tsx           # Root layout (LTR English)
│   │   ├── page.tsx             # Landing / Dashboard
│   │   ├── globals.css          # Global styles
│   │   ├── signals/
│   │   │   └── page.tsx         # Signals list page
│   │   └── coin/
│   │       └── [symbol]/
│   │           └── page.tsx     # Individual coin analysis
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── charts/
│   │   │   ├── PriceChart.tsx        # TradingView lightweight chart
│   │   │   ├── MiniChart.tsx         # Small sparkline chart
│   │   │   └── VolumeChart.tsx
│   │   ├── signals/
│   │   │   ├── SignalCard.tsx         # Individual signal card
│   │   │   ├── SignalTable.tsx        # Signals table view
│   │   │   └── SignalBadge.tsx        # BUY/WAIT/WATCH badge
│   │   ├── dashboard/
│   │   │   ├── TopSignals.tsx         # Top 10 oversold etc.
│   │   │   ├── MarketOverview.tsx     # Market summary
│   │   │   ├── TrendingCoins.tsx
│   │   │   └── StatsCards.tsx
│   │   └── ui/
│   │       ├── Card.tsx
│   │       ├── Badge.tsx
│   │       ├── Skeleton.tsx
│   │       └── Tooltip.tsx
│   ├── lib/
│   │   ├── api.ts               # API client (fetch wrapper)
│   │   ├── utils.ts             # Formatting, helpers
│   │   └── constants.ts         # Config values
│   ├── hooks/
│   │   ├── useSignals.ts        # SWR hook for signals
│   │   └── useMarketData.ts     # SWR hook for market data
│   ├── package.json
│   ├── next.config.ts
│   └── tsconfig.json
│
├── backend/                     # Node.js Express API
│   ├── src/
│   │   ├── index.ts             # Entry point
│   │   ├── routes/
│   │   │   ├── signals.ts       # GET /api/signals
│   │   │   ├── coins.ts         # GET /api/coins/:symbol
│   │   │   └── market.ts        # GET /api/market/overview
│   │   ├── services/
│   │   │   ├── binance.ts       # Binance API wrapper
│   │   │   ├── cache.ts         # Redis cache layer
│   │   │   ├── db.ts            # SQLite database
│   │   │   └── telegram.ts      # Telegram bot service
│   │   ├── models/
│   │   │   ├── signal.ts        # Signal data model
│   │   │   └── coin.ts          # Coin data model
│   │   ├── utils/
│   │   │   ├── logger.ts
│   │   │   └── helpers.ts
│   │   └── config.ts            # Environment config
│   ├── package.json
│   └── tsconfig.json
│
├── analysis/                    # Python Analysis Engine
│   ├── app.py                   # Flask API entry
│   ├── engine/
│   │   ├── indicators.py        # RSI, MACD, SMA calculations
│   │   ├── signals.py           # Signal generation logic
│   │   ├── volume.py            # Volume spike detection
│   │   └── trends.py            # Trend analysis (MA crossover)
│   ├── utils/
│   │   ├── binance_client.py    # Binance data fetcher
│   │   └── helpers.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── n8n/                         # n8n Workflow Exports
│   ├── workflows/
│   │   ├── fetch-market-data.json
│   │   ├── run-analysis.json
│   │   ├── send-telegram-alerts.json
│   │   └── daily-report.json
│   └── README.md
│
├── telegram-bot/                # Telegram Bot (standalone)
│   ├── src/
│   │   ├── bot.ts
│   │   ├── commands/
│   │   │   ├── start.ts
│   │   │   ├── signals.ts
│   │   │   └── subscribe.ts
│   │   └── handlers/
│   │       └── alerts.ts
│   ├── package.json
│   └── tsconfig.json
│
├── docker/
│   ├── docker-compose.yml       # Full stack compose
│   ├── docker-compose.dev.yml   # Development overrides
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   ├── Dockerfile.analysis
│   └── nginx/
│       └── nginx.conf
│
├── .env.example
├── .gitignore
└── README.md
```

---

## 🗓️ Phase-by-Phase Implementation Plan

---

### PHASE 1: Foundation & Data Pipeline (Days 1–3)

**Goal:** Get data flowing from Binance → Python → SQLite

#### Day 1: Project Setup

- [ ] Initialize Next.js frontend (convert template to English LTR)
- [ ] Initialize Node.js backend (Express + TypeScript)
- [ ] Initialize Python analysis engine (Flask)
- [ ] Set up SQLite database schema
- [ ] Set up Redis (Docker)
- [ ] Create Docker Compose for all services
- [ ] Set up `.env` configuration

**Database Schema (SQLite):**

```sql
-- Coins we track
CREATE TABLE coins (
  symbol TEXT PRIMARY KEY,        -- e.g., 'BTCUSDT'
  base_asset TEXT,                -- e.g., 'BTC'
  quote_asset TEXT,               -- e.g., 'USDT'
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Price data (OHLCV candles)
CREATE TABLE candles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  symbol TEXT NOT NULL,
  interval TEXT NOT NULL,          -- '1h', '4h', '1d'
  open_time INTEGER NOT NULL,
  open REAL, high REAL, low REAL, close REAL,
  volume REAL,
  UNIQUE(symbol, interval, open_time)
);

-- Generated signals
CREATE TABLE signals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  symbol TEXT NOT NULL,
  signal_type TEXT NOT NULL,       -- 'RSI_OVERSOLD', 'MA_CROSSOVER', 'VOLUME_SPIKE'
  action TEXT NOT NULL,            -- 'BUY', 'WAIT', 'WATCH'
  strength REAL,                   -- 0-100 confidence score
  price_at_signal REAL,
  details TEXT,                    -- JSON with indicator values
  created_at TEXT DEFAULT (datetime('now')),
  expires_at TEXT
);

-- Alert subscribers
CREATE TABLE subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_chat_id TEXT UNIQUE,
  tier TEXT DEFAULT 'free',        -- 'free', 'vip'
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);
```

#### Day 2: Binance Data Fetcher (Python)

- [ ] Build Binance API client (public endpoints only, no auth needed)
- [ ] Fetch top 50 USDT trading pairs by volume
- [ ] Fetch klines (candlestick data) — 1h, 4h, 1d intervals
- [ ] Store raw OHLCV data in SQLite
- [ ] Implement rate limiting (stay under 1200 weight/min)

**Key Binance Endpoints (FREE, no auth):**

```
GET /api/v3/ticker/24hr           → 24h price changes (weight: 40)
GET /api/v3/klines                → Candlestick data (weight: 2)
GET /api/v3/exchangeInfo          → Available pairs (weight: 20)
GET /api/v3/ticker/price          → Current prices (weight: 2)
```

#### Day 3: Technical Analysis Engine (Python)

- [ ] Build indicator calculation module using `pandas-ta`
- [ ] RSI (14-period) — oversold < 30, overbought > 70
- [ ] SMA/EMA crossover (9/21, 50/200)
- [ ] Volume spike detection (volume > 2x 20-period average)
- [ ] MACD signal line crossover
- [ ] Build signal scoring system (0–100 confidence)
- [ ] Generate actionable decisions: **BUY / WAIT / WATCH**

**Signal Logic:**

```
Score-based signal generation:
- RSI < 30         → +30 points (oversold = potential buy)
- RSI < 20         → +20 bonus (extremely oversold)
- Price > SMA_50   → +15 points (uptrend)
- MACD crossover   → +20 points (bullish momentum)
- Volume spike     → +15 points (confirmation)

Score thresholds:
- >= 70  → BUY
- 40-69  → WATCH
- < 40   → WAIT
```

---

### PHASE 2: API Layer & Caching (Days 4–5)

**Goal:** Node.js API serves cached signals to frontend

#### Day 4: Backend API

- [ ] Express.js server with TypeScript
- [ ] `GET /api/signals` — Latest signals (paginated)
- [ ] `GET /api/signals/top` — Top 10 by strength
- [ ] `GET /api/coins/:symbol` — Coin detail + indicators
- [ ] `GET /api/market/overview` — Market summary stats
- [ ] Redis caching layer (TTL: 5 min for signals, 1 min for prices)
- [ ] Error handling + rate limiting middleware

**Caching Strategy:**

```
User Request → Check Redis Cache
  ├─ HIT  → Return cached data (fast)
  └─ MISS → Query SQLite → Cache → Return

n8n runs analysis every 5 minutes
  → Python writes to SQLite
  → Invalidate relevant Redis keys

Result: Users NEVER hit Binance directly
```

#### Day 5: Python Flask API

- [ ] `POST /analyze` — Trigger full analysis run
- [ ] `GET /health` — Health check
- [ ] `GET /indicators/:symbol` — Get indicators for a coin
- [ ] Connect Python → SQLite (read candles, write signals)
- [ ] Add Gunicorn for production serving

---

### PHASE 3: Frontend Dashboard (Days 6–9)

**Goal:** Beautiful, fast-loading dashboard with charts and signals

#### Day 6: Layout & Design System

- [ ] Convert template from Arabic RTL → English LTR
- [ ] Create dark theme color palette (crypto-native feel)
- [ ] Build Navbar, Sidebar, Footer components
- [ ] Set up responsive grid layout
- [ ] Import Google Font (Inter or Space Grotesk)
- [ ] Create reusable UI components (Card, Badge, Skeleton)

**Color Palette (Dark Crypto Theme):**

```css
--bg-primary:    #0a0e17;    /* Deep navy black */
--bg-secondary:  #111827;    /* Card backgrounds */
--bg-tertiary:   #1a2035;    /* Hover states */
--accent-green:  #00d68f;    /* BUY / Bullish */
--accent-red:    #ff3d71;    /* SELL / Bearish */
--accent-yellow: #ffaa00;    /* WATCH / Caution */
--accent-blue:   #3366ff;    /* Primary actions */
--text-primary:  #e4e6eb;    /* Main text */
--text-secondary:#8b95a5;    /* Muted text */
```

#### Day 7: Dashboard Components

- [ ] **StatsCards** — Total signals today, market sentiment, top gainer
- [ ] **TopSignals** — Top 10 oversold/overbought with signal badges
- [ ] **SignalCard** — Coin icon, price, RSI, action badge, confidence bar
- [ ] **MarketOverview** — BTC dominance, total market cap, fear/greed
- [ ] **TrendingCoins** — Coins with most signal activity

#### Day 8: Charts Integration

- [ ] **PriceChart** — TradingView Lightweight Charts (candlestick)
- [ ] **MiniChart** — Sparkline for signal cards
- [ ] **VolumeChart** — Volume bars with spike highlighting
- [ ] Coin detail page (`/coin/BTCUSDT`) with full analysis view

#### Day 9: Polish & Interactions

- [ ] Loading skeletons (no spinners)
- [ ] Auto-refresh with SWR (every 60 seconds)
- [ ] Hover micro-animations on cards
- [ ] Mobile-responsive layout
- [ ] Error states and empty states
- [ ] SEO meta tags per page

---

### PHASE 4: Automation & Alerts (Days 10–12)

**Goal:** n8n workflows + Telegram bot delivering signals automatically

#### Day 10: n8n Workflows

**Workflow 1: Fetch Market Data (every 5 min)**

```
[Cron Trigger: */5 * * * *]
    → [HTTP Request: Binance /ticker/24hr]
    → [HTTP Request: Binance /klines for top 50 pairs]
    → [Code Node: Format data]
    → [HTTP Request: POST to Python /analyze]
    → [IF: New signals generated?]
        → YES: [HTTP Request: POST to Node API /internal/cache-invalidate]
        → NO:  [End]
```

**Workflow 2: Send Telegram Alerts (triggered by Workflow 1)**

```
[Webhook Trigger: /new-signal]
    → [Code Node: Format signal message]
    → [IF: Signal strength >= 70?]
        → YES: [Telegram: Send to VIP channel]
        → YES: [Telegram: Send to Free channel]
    → [IF: Signal strength 50-69?]
        → YES: [Telegram: Send to Free channel only]
```

**Workflow 3: Daily Report (every day at 8 AM UTC)**

```
[Cron Trigger: 0 8 * * *]
    → [HTTP Request: GET /api/signals/daily-summary]
    → [Code Node: Build markdown report]
    → [Telegram: Send daily digest to all subscribers]
```

#### Day 11: Telegram Bot

- [ ] Create bot via @BotFather
- [ ] Implement commands:
  - `/start` — Welcome + subscribe
  - `/signals` — Latest top 5 signals
  - `/coin BTC` — Quick analysis for a coin
  - `/subscribe` — Join alerts
  - `/unsubscribe` — Leave alerts
- [ ] Create Telegram Channel for public signals
- [ ] Create VIP Telegram Group (for future paid tier)

#### Day 12: Testing & Integration

- [ ] End-to-end test: Binance → Python → SQLite → API → Frontend
- [ ] Test Telegram alerts delivery
- [ ] Test n8n workflow reliability
- [ ] Load test API with concurrent requests
- [ ] Fix edge cases (missing data, API errors, timeouts)

---

### PHASE 5: Deployment & Launch (Days 13–14)

**Goal:** Deploy to Oracle Cloud, go live

#### Day 13: Docker & Deployment

- [ ] Write production Dockerfiles (multi-stage builds)
- [ ] Docker Compose with all services
- [ ] Nginx config (SSL with Let's Encrypt / Certbot)
- [ ] Deploy to Oracle Cloud VPS
- [ ] Set up domain + DNS

**Docker Compose Overview:**

```yaml
services:
  nginx:
    image: nginx:alpine
    ports: ["80:80", "443:443"]

  frontend:
    build: ./frontend
    # Next.js standalone output

  backend:
    build: ./backend
    environment:
      - REDIS_URL=redis://redis:6379
      - DB_PATH=/data/smartentry.db
    volumes:
      - db-data:/data

  analysis:
    build: ./analysis
    volumes:
      - db-data:/data

  redis:
    image: redis:7-alpine
    command: redis-server --maxmemory 64mb --maxmemory-policy allkeys-lru

volumes:
  db-data:
```

**Memory Budget (Oracle Free Tier):**

```
Service             | Est. Memory
--------------------|------------
Nginx               |    30 MB
Next.js (standalone)|   150 MB
Node.js API         |   100 MB
Python + Gunicorn   |   200 MB
Redis               |    64 MB
SQLite              |    ~0 MB
n8n (existing)      |   400 MB
Docker overhead     |   100 MB
--------------------|------------
TOTAL               | ~1.05 GB  ✅
```

#### Day 14: Launch Checklist

- [ ] Final QA on all pages
- [ ] Set up monitoring (health check endpoint)
- [ ] Configure n8n cron schedules
- [ ] Announce on Telegram channel
- [ ] Binance affiliate link integration
- [ ] Write README with setup instructions

---

## 💰 Monetization Strategy

### Phase 1: Free Launch (Day 1–30)
- Public Telegram channel with free signals
- Binance affiliate referral links on every coin page
  - Earn commission on every trade users make

### Phase 2: VIP Tier (Month 2+)
- **VIP Telegram Group** — $9.99/month
  - Faster signals (1 min vs 5 min delay)
  - More coins analyzed (100 vs 50)
  - Custom alerts

### Phase 3: Premium Dashboard (Month 3+)
- **Pro Web Dashboard** — $19.99/month
  - Portfolio tracker
  - Custom watchlists
  - Historical signal accuracy stats

---

## 📈 Scaling Roadmap

### 0 → 100 Users (Current Plan)
- Single Oracle VPS, SQLite, Redis, Docker Compose

### 100 → 1,000 Users
- Add CDN (Cloudflare free tier)
- Increase Redis cache TTL
- Add connection pooling

### 1,000 → 10,000 Users
- Migrate SQLite → PostgreSQL
- Separate frontend to Vercel (free tier)
- Add second Oracle VPS for Python analysis
- Implement WebSocket for real-time updates

---

## 🧠 Suggestions to Improve the Idea

1. **Signal Accuracy Tracking** — Track hit rate of signals. Display accuracy % to build trust.
2. **Fear & Greed Index** — Integrate free Alternative.me API for market sentiment.
3. **Multi-Timeframe Analysis** — Show signals across 1H, 4H, 1D. Agreement = stronger signal.
4. **Social Proof** — "423 traders watching BTC" — simple page view counter.
5. **AI Summary** — Use Ollama (local LLM) for natural language signal summaries.
6. **Backtesting Page** — Show historical signal performance. Builds massive trust.
7. **Landing Page** — Marketing page with testimonials and accuracy stats.

---

## 🔑 Environment Variables (.env.example)

```env
# General
NODE_ENV=production
PORT=4000

# Database
DB_PATH=./data/smartentry.db

# Redis
REDIS_URL=redis://redis:6379

# Binance (no auth needed for public endpoints)
BINANCE_BASE_URL=https://api.binance.com

# CoinGecko
COINGECKO_BASE_URL=https://api.coingecko.com/api/v3

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
TELEGRAM_CHANNEL_ID=@smartentry_signals
TELEGRAM_VIP_GROUP_ID=-100xxxxxxxxxx

# Binance Affiliate
BINANCE_AFFILIATE_REF=your_referral_id

# n8n
N8N_WEBHOOK_URL=http://n8n:5678

# Analysis Engine
ANALYSIS_URL=http://analysis:5000
```

---

## ✅ Pre-Implementation Checklist

Before we start coding, confirm:

- [ ] Domain name ready?
- [ ] Oracle VPS SSH access working?
- [ ] Docker + Docker Compose installed on VPS?
- [ ] n8n accessible on VPS?
- [ ] Telegram account ready for bot creation?
- [ ] Binance affiliate account set up?
- [ ] Git repository initialized?

---

> **Next Step:** Review this plan, give me your feedback, and then I'll start implementing Phase 1.
