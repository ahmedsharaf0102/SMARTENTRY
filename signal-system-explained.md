# 📊 SmartEntry Signal System — Technical Documentation

> **Last Updated:** 2026-04-30
> **Version:** v2 — 12-Indicator Convergence System
> **Status:** All 12 indicators coded, pending Oracle VPS deployment

---

## Active Indicators (All 12 in Code ✅)

### Category A: Momentum (4 indicators — max 50 pts)

| # | Indicator | Settings | BUY Condition | Points | Status |
|---|-----------|----------|---------------|--------|--------|
| 1 | RSI | 14-period | RSI < 30 | +15 | ✅ |
| 2 | Stochastic RSI | 14,14,3,3 | StochRSI < 20 + cross up | +10 | ✅ |
| 3 | MACD | 12,26,9 | Histogram flip neg→pos | +15 | ✅ |
| 4 | MFI | 14-period | MFI < 25 | +10 | ✅ |

### Category B: Trend (4 indicators — max 45 pts)

| # | Indicator | Settings | BUY Condition | Points | Status |
|---|-----------|----------|---------------|--------|--------|
| 5 | EMA 9/21 | 9,21 | Bullish crossover | +10 | ✅ |
| 6 | SMA 50 | 50-period | Price > SMA 50 | +10 | ✅ |
| 7 | ADX | 14-period | ADX > 25 + DI+ > DI- | +10 | ✅ |
| 8 | Ichimoku Cloud | 9,26 | Price above cloud + Tenkan > Kijun | +15 | ✅ |

### Category C: Volume & Volatility (4 indicators — max 40 pts)

| # | Indicator | Settings | BUY Condition | Points | Status |
|---|-----------|----------|---------------|--------|--------|
| 9 | Volume Ratio | 20-period avg | Volume > 1.5x average | +10 | ✅ |
| 10 | OBV | 3-period slope | OBV rising | +10 | ✅ |
| 11 | VWAP | Daily | Price > VWAP | +10 | ✅ |
| 12 | Bollinger Bands | 20,2σ | Lower band bounce | +10 | ✅ |

---

## 5-Tier Decision System

| Score | Action | Min Indicators | Badge |
|-------|--------|----------------|-------|
| 95–135 | ⭐ STRONG BUY | 8+ (all 3 categories) | `badge-strong-buy` |
| 75–94 | 🟢 BUY | 6-7 (2+ categories) | `badge-buy` |
| 50–74 | 🟡 WATCH | 4-5 | `badge-watch` |
| 25–49 | 🔴 WAIT | 2-3 | `badge-wait` |
| 0–24 | ⛔ AVOID | 0-1 | `badge-avoid` |

---

## Signal Types (v2)

| Type | Trigger | Category |
|------|---------|----------|
| FULL_CONVERGENCE | 8+ indicators across all 3 categories | Cross-category |
| RSI_MOMENTUM_CONVERGENCE | RSI < 30 + 2 more momentum indicators | Category A |
| ICHIMOKU_BREAKOUT | Price above cloud + Tenkan > Kijun + volume | Category B |
| MOMENTUM_SURGE | Category A dominates | Category A |
| TREND_REVERSAL | Category B dominates | Category B |
| VOLUME_ACCUMULATION | Category C dominates | Category C |

---

## Bearish Penalties

| Condition | Penalty |
|-----------|---------|
| RSI > 70 | -15 pts |
| RSI > 80 | -25 pts total |
| MACD bearish cross | -15 pts |
| ADX < 15 (no trend) | -10 pts |

---

## Files

| File | Purpose |
|------|---------|
| `analysis/engine/indicators.py` | Calculate all 12 indicators |
| `analysis/engine/signals.py` | v2 scoring engine with categories |
| `analysis/app.py` | Flask API — full pipeline |
| `analysis/utils/binance_client.py` | Fetch OHLCV from Binance |
| `analysis/utils/supabase_client.py` | Write to Supabase DB |
| `strategy-proposal.md` | Full strategy with examples |
| `lib/constants.ts` | Frontend signal type labels + badge classes |
| `app/globals.css` | Badge CSS (strong-buy, buy, watch, wait, avoid) |
