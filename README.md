# SmartEntry — Crypto Trading Insights Platform

> Real-time crypto trading signals powered by RSI, MACD, volume analysis, and more.

## 🏗️ Architecture

```
smartentry/
├── frontend/          → Next.js 16 + Tailwind CSS 4 (Dashboard & Landing)
├── backend/           → Node.js Express API (REST endpoints + caching)
├── analysis/          → Python Flask (Technical analysis engine)
├── telegram-bot/      → Telegram bot (grammY) for signal alerts
├── n8n/               → Automation workflow configs
├── docker/            → Docker Compose + Nginx + Dockerfiles
└── data/              → SQLite database (auto-created)
```

## 🚀 Quick Start (Development)

### Prerequisites
- Node.js 22+
- Python 3.12+
- Docker & Docker Compose (for Redis)

### 1. Clone & Setup
```bash
git clone <repo-url>
cd smartentry
cp .env.example .env
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

### 3. Backend
```bash
cd backend
npm install
npm run dev
# → http://localhost:4000
```

### 4. Analysis Engine
```bash
cd analysis
pip install -r requirements.txt
python app.py
# → http://localhost:5000
```

### 5. Redis (via Docker)
```bash
docker run -d --name redis -p 6379:6379 redis:7-alpine
```

## 🐳 Production (Docker Compose)

```bash
cd docker
docker compose up -d
# → http://localhost (Nginx proxies everything)
```

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/signals` | Latest signals (paginated) |
| GET | `/api/signals/top` | Top signals by strength |
| GET | `/api/signals/summary` | Dashboard stats |
| GET | `/api/coins/:symbol` | Coin detail + indicators |
| GET | `/api/coins` | All tracked coins |
| GET | `/api/market/overview` | Market overview |
| GET | `/api/health` | Health check |

## ⚠️ Disclaimer

This platform is for educational and informational purposes only.
It does not constitute financial advice. Trade at your own risk.

## 📄 License

MIT
