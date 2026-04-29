# 📊 SmartEntry Signal System — Technical Documentation

> **Last Updated:** 2026-04-29
> **Status:** Phase 1 Complete — 6 indicators active, 6 more planned
> **Update this file** whenever new indicators are added to the scoring system

---

## Active Indicators (Currently in Code)

| # | Indicator | File | Status |
|---|-----------|------|--------|
| 1 | RSI (14) | `indicators.py` | ✅ Active |
| 2 | MACD (12,26,9) | `indicators.py` | ✅ Active |
| 3 | SMA (9/21/50) | `indicators.py` | ✅ Active |
| 4 | EMA (9/21) | `indicators.py` | ✅ Active |
| 5 | Bollinger Bands (20,2σ) | `indicators.py` | ✅ Active |
| 6 | Volume Ratio (20-period) | `indicators.py` | ✅ Active |

## Planned Indicators (Phase 2)

| # | Indicator | Purpose | Status |
|---|-----------|---------|--------|
| 7 | Ichimoku Cloud | Trend direction + support/resistance | ⬜ Planned |
| 8 | MFI (Money Flow Index) | Volume-weighted RSI | ⬜ Planned |
| 9 | OBV (On-Balance Volume) | Accumulation/distribution | ⬜ Planned |
| 10 | VWAP | Institutional price level | ⬜ Planned |
| 11 | Stochastic RSI | Momentum within RSI | ⬜ Planned |
| 12 | ADX | Trend strength | ⬜ Planned |

---

## Signal Types (4 Active)

### 1. RSI Oversold (max 80 pts)
- RSI < 30 → +30 base
- RSI < 20 → +20 extreme bonus
- Price > SMA 50 → +15 trend bonus
- Volume > 1.5x → +15 volume bonus

### 2. MACD Bullish Crossover (max 65 pts)
- Histogram flips negative→positive → +20 base
- Price > SMA 50 → +15 trend bonus
- Volume > 1.5x → +15 volume bonus
- RSI < 35 → +15 RSI bonus

### 3. Volume Spike (max 55 pts)
- Volume > 2x average → +15 base
- Volume > 3x → +10 extreme bonus
- Price > SMA 50 → +15 trend bonus
- RSI < 35 → +15 RSI bonus

### 4. EMA 9/21 Crossover (max 50 pts)
- EMA 9 crosses above EMA 21 → +20 base
- Volume > 1.5x → +15 volume bonus
- RSI < 35 → +15 RSI bonus

---

## Scoring → Decision

| Score | Decision | Requirement |
|-------|----------|-------------|
| 70–100 | 🟢 BUY | Multiple indicators must confirm |
| 40–69 | 🟡 WATCH | Some indicators positive |
| 0–39 | 🔴 WAIT | Not enough confirmation |

---

## Data Flow

```
Every 5 minutes:
  n8n (cron) → Python script → Binance API
  → Calculate 6 indicators per coin
  → Score each signal type
  → Write to Supabase DB
  → If BUY + strength > 75 → Telegram alert

User visits site:
  Next.js → Supabase query → Show signals
  → User clicks "Trade on Binance" → affiliate link
```

---

## Files

| File | Purpose |
|------|---------|
| `analysis/engine/indicators.py` | Calculate all technical indicators |
| `analysis/engine/signals.py` | Scoring engine → BUY/WATCH/WAIT |
| `analysis/app.py` | Flask API entry point |
| `analysis/utils/binance_client.py` | Fetch OHLCV from Binance |
| `analysis/utils/supabase_client.py` | Write signals to Supabase |
