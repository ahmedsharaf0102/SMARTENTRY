# 📊 SmartEntry — Plan Tracker & Dependencies

> **Last Updated:** 2026-04-26
> **Current Phase:** Phase 1 — Foundation & Data Pipeline
> **Overall Progress:** ██████░░░░ 35%

---

## 📁 Project Structure (60 files)

```
smartentry/
├── .env.example                          ✅
├── .gitignore                            ✅
├── README.md                             ✅
├── plan.md                               ✅
├── plan-tracker-and-dependencies.md      ✅
│
├── frontend/                             ✅ Next.js 16 + Tailwind 4
│   ├── app/
│   │   ├── layout.tsx                    ✅ English LTR + Dark theme
│   │   ├── page.tsx                      ✅ Landing page (hero + features)
│   │   ├── globals.css                   ✅ Full design system
│   │   ├── signals/page.tsx              ✅ Signals list (skeleton)
│   │   ├── coin/[symbol]/page.tsx        ✅ Coin detail (skeleton)
│   │   └── components/
│   │       ├── Navbar.tsx                ✅ Glass navbar + mobile menu
│   │       └── Footer.tsx                ✅ Footer with links
│   ├── lib/
│   │   ├── api.ts                        ✅ API client
│   │   ├── utils.ts                      ✅ Formatting helpers
│   │   └── constants.ts                  ✅ Config constants
│   ├── package.json                      ✅ (from template)
│   └── next.config.ts                    ✅ Standalone output
│
├── backend/                              ✅ Node.js Express API
│   ├── package.json                      ✅
│   ├── tsconfig.json                     ✅
│   └── src/
│       ├── index.ts                      ✅ Server entry point
│       ├── config.ts                     ✅ Environment config
│       ├── routes/
│       │   ├── signals.ts                ✅ /api/signals endpoints
│       │   ├── coins.ts                  ✅ /api/coins endpoints
│       │   └── market.ts                 ✅ /api/market endpoints
│       ├── services/
│       │   ├── db.ts                     ✅ SQLite + WAL + schema
│       │   ├── cache.ts                  ✅ Redis with graceful fallback
│       │   ├── binance.ts                ✅ Binance API wrapper
│       │   └── telegram.ts              ✅ Telegram notifications
│       ├── models/
│       │   ├── signal.ts                 ✅ Signal interfaces
│       │   └── coin.ts                   ✅ Coin interfaces
│       └── utils/
│           ├── logger.ts                 ✅ Winston logger
│           └── helpers.ts                ✅ Format utilities
│
├── analysis/                             ✅ Python Flask Engine
│   ├── app.py                            ✅ Flask API + pipeline
│   ├── requirements.txt                  ✅ Dependencies
│   ├── engine/
│   │   ├── __init__.py                   ✅
│   │   ├── indicators.py                 ✅ RSI, MACD, SMA, EMA, BB
│   │   ├── signals.py                    ✅ Score-based signal gen
│   │   ├── volume.py                     ✅ Volume spike detection
│   │   └── trends.py                     ✅ Trend analysis (MA)
│   └── utils/
│       ├── __init__.py                   ✅
│       ├── binance_client.py             ✅ Rate-limited fetcher
│       └── helpers.py                    ✅
│
├── telegram-bot/                         ✅ grammY Bot
│   ├── package.json                      ✅
│   └── src/bot.ts                        ✅ /start /signals /coin /help
│
├── n8n/                                  ✅
│   └── README.md                         ✅ Workflow documentation
│
└── docker/                               ✅ Full Docker setup
    ├── docker-compose.yml                ✅ Production stack
    ├── docker-compose.dev.yml            ✅ Dev overrides
    ├── Dockerfile.frontend               ✅ Multi-stage build
    ├── Dockerfile.backend                ✅ Multi-stage build
    ├── Dockerfile.analysis               ✅ Python + Gunicorn
    └── nginx/nginx.conf                  ✅ Reverse proxy + rate limiting
```

---

## 🔄 Execution Log

### Phase 1: Foundation & Data Pipeline (Days 1–3)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Project folder structure | ✅ Done | 60 files across 6 services |
| 2 | Frontend init (Next.js 16) | ✅ Done | Converted to English LTR, dark theme |
| 3 | Backend init (Express + TS) | ✅ Done | Config, routes, services, models |
| 4 | Python analysis engine | ✅ Done | Flask + pandas-ta + 4 modules |
| 5 | SQLite schema + WAL mode | ✅ Done | 4 tables, 5 indexes |
| 6 | Docker Compose setup | ✅ Done | 5 services + dev overrides |
| 7 | Nginx config | ✅ Done | Reverse proxy, rate limiting, gzip |
| 8 | .env.example | ✅ Done | All keys documented |
| 9 | Binance data fetcher (Python) | ✅ Done | Rate-limited, top 50 pairs |
| 10 | TA engine (indicators.py) | ✅ Done | RSI, MACD, SMA, EMA, BB, volume |
| 11 | Signal scoring system | ✅ Done | Score-based BUY/WATCH/WAIT |
| 12 | Volume spike detection | ✅ Done | 2x+ average detection |
| 13 | Trend analysis | ✅ Done | SMA alignment scoring |
| 14 | Install backend deps | ⬜ Next | `cd backend && npm install` |
| 15 | Install Python deps | ⬜ Next | `cd analysis && pip install -r requirements.txt` |
| 16 | Test backend runs | ⬜ Next | `cd backend && npm run dev` |
| 17 | Test analysis runs | ⬜ Next | `cd analysis && python app.py` |

### Phase 2: API Layer & Caching (Days 4–5)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Express.js API routes | ✅ Done | signals, coins, market routes |
| 2 | Redis caching layer | ✅ Done | Graceful fallback if Redis down |
| 3 | Python Flask endpoints | ✅ Done | /analyze, /indicators, /health |
| 4 | Error handling | ✅ Done | 404, 500, middleware |
| 5 | Binance service (Node) | ✅ Done | Tickers, klines, current price |
| 6 | Telegram service (Node) | ✅ Done | Channel + VIP group alerts |
| 7 | Wire up frontend → API | ⬜ Pending | Connect SWR hooks to real API |
| 8 | Test full data flow | ⬜ Pending | Binance → Python → SQLite → API |

### Phase 3: Frontend Dashboard (Days 6–9)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Design system (CSS) | ✅ Done | Dark theme, badges, animations |
| 2 | Landing page | ✅ Done | Hero, features, CTA |
| 3 | Navbar + Footer | ✅ Done | Glassmorphism, responsive |
| 4 | Signals page (layout) | ✅ Done | Filter tabs + skeleton grid |
| 5 | Coin detail page (layout) | ✅ Done | Chart area + indicators sidebar |
| 6 | TradingView charts | ⬜ Pending | Install lightweight-charts |
| 7 | Signal cards (real data) | ⬜ Pending | Wire to API |
| 8 | Dashboard stats | ⬜ Pending | StatsCards, MarketOverview |
| 9 | Mobile responsive polish | ⬜ Pending | — |
| 10 | Micro-animations | ⬜ Pending | framer-motion |

### Phase 4: Automation & Alerts (Days 10–12)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | n8n workflow docs | ✅ Done | README with 4 workflow specs |
| 2 | Telegram bot | ✅ Done | /start /signals /coin /help |
| 3 | n8n workflow: fetch data | ⬜ Pending | Create in n8n UI |
| 4 | n8n workflow: analysis | ⬜ Pending | — |
| 5 | n8n workflow: alerts | ⬜ Pending | — |
| 6 | n8n workflow: daily report | ⬜ Pending | — |

### Phase 5: Deployment & Launch (Days 13–14)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Production Dockerfiles | ✅ Done | Multi-stage, optimized |
| 2 | Deploy to Oracle Cloud | ⬜ Pending | — |
| 3 | SSL / Domain setup | ⬜ Pending | — |
| 4 | Final QA | ⬜ Pending | — |

---

## 📦 Dependencies

### Frontend (`frontend/package.json`)

| Package | Version | Purpose | Status |
|---------|---------|---------|--------|
| `next` | 16.1.6 | React framework | ✅ Installed |
| `react` | 19.2.3 | UI library | ✅ Installed |
| `react-dom` | 19.2.3 | React DOM | ✅ Installed |
| `tailwindcss` | ^4 | CSS framework | ✅ Installed |
| `@tailwindcss/postcss` | ^4 | PostCSS plugin | ✅ Installed |
| `typescript` | ^5 | Type checking | ✅ Installed |
| `lightweight-charts` | latest | TradingView charts | ⬜ Phase 3 |
| `lucide-react` | latest | Icons | ⬜ Phase 3 |
| `swr` | latest | Data fetching | ⬜ Phase 3 |
| `clsx` | latest | Conditional classes | ⬜ Phase 3 |
| `framer-motion` | latest | Animations | ⬜ Phase 3 |

### Backend (`backend/package.json`)

| Package | Version | Purpose | Status |
|---------|---------|---------|--------|
| `express` | ^4.21 | HTTP server | ⬜ `npm install` |
| `cors` | ^2.8 | CORS | ⬜ `npm install` |
| `better-sqlite3` | ^11 | SQLite | ⬜ `npm install` |
| `ioredis` | ^5 | Redis | ⬜ `npm install` |
| `node-cron` | ^3 | Cron jobs | ⬜ `npm install` |
| `zod` | ^3 | Validation | ⬜ `npm install` |
| `helmet` | ^8 | Security | ⬜ `npm install` |
| `compression` | ^1 | Gzip | ⬜ `npm install` |
| `winston` | ^3 | Logging | ⬜ `npm install` |
| `dotenv` | ^16 | Env vars | ⬜ `npm install` |
| `typescript` | ^5 | Types | ⬜ `npm install` |
| `tsx` | ^4 | TS runner | ⬜ `npm install` |

### Python (`analysis/requirements.txt`)

| Package | Version | Purpose | Status |
|---------|---------|---------|--------|
| `flask` | 3.1.1 | HTTP API | ⬜ `pip install` |
| `pandas` | 2.2.3 | DataFrames | ⬜ `pip install` |
| `pandas-ta` | 0.3.14b1 | 150+ indicators | ⬜ `pip install` |
| `requests` | 2.32.3 | HTTP client | ⬜ `pip install` |
| `numpy` | 2.2.3 | Numerics | ⬜ `pip install` |
| `gunicorn` | 23.0.0 | WSGI server | ⬜ `pip install` |

### Telegram Bot (`telegram-bot/package.json`)

| Package | Version | Purpose | Status |
|---------|---------|---------|--------|
| `grammy` | ^1.35 | Bot framework | ⬜ Phase 4 |
| `dotenv` | ^16 | Env vars | ⬜ Phase 4 |

### Docker Services

| Service | Image | Status |
|---------|-------|--------|
| Nginx | `nginx:alpine` | ✅ Configured |
| Redis | `redis:7-alpine` | ✅ Configured |
| Frontend | Custom (Node 22) | ✅ Dockerfile ready |
| Backend | Custom (Node 22) | ✅ Dockerfile ready |
| Analysis | Custom (Python 3.12) | ✅ Dockerfile ready |

---

## 🔗 API Endpoints

| Method | Endpoint | Backend | Status |
|--------|----------|---------|--------|
| GET | `/api/health` | Node.js | ✅ Coded |
| GET | `/api/signals` | Node.js | ✅ Coded |
| GET | `/api/signals/top` | Node.js | ✅ Coded |
| GET | `/api/signals/summary` | Node.js | ✅ Coded |
| GET | `/api/coins` | Node.js | ✅ Coded |
| GET | `/api/coins/:symbol` | Node.js | ✅ Coded |
| GET | `/api/market/overview` | Node.js | ✅ Coded |
| POST | `/analyze` | Python | ✅ Coded |
| GET | `/indicators/:symbol` | Python | ✅ Coded |
| GET | `/health` | Python | ✅ Coded |

---

## 🎯 Next Steps

1. **Install dependencies** → `cd backend && npm install`
2. **Install Python deps** → `cd analysis && pip install -r requirements.txt`
3. **Test backend** → `cd backend && npm run dev`
4. **Test analysis engine** → `cd analysis && python app.py`
5. **Test frontend** → `cd frontend && npm run dev`
6. **Wire frontend to real API data**
7. **Add TradingView charts**

---

## 📝 Architecture Notes

- **Database:** SQLite with WAL mode (zero memory overhead for MVP)
- **Cache:** Redis with graceful fallback (app works without Redis)
- **Binance:** Public endpoints only, no API key needed for market data
- **Rate limiting:** Python client tracks weight usage (max 1200/min, we use ~200/cycle)
- **Cache TTL:** Signals = 5 min, Prices = 1 min, Market = 2 min
- **Signal scoring:** 0-100 score → BUY (≥70), WATCH (40-69), WAIT (<40)
