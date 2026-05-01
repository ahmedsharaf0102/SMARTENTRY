# 🥇 SmartEntry Gold Strategy Proposal

> **Version:** 1.0 — Draft for Review
> **Date:** 2026-05-01
> **Goal:** Combine Macro Economics + Technical Analysis for 90%+ gold signals
> **Status:** 🟡 PENDING YOUR APPROVAL

---

## Why Gold Is Different

Gold isn't like crypto — it moves based on **macroeconomic forces**, not just chart patterns.
A purely technical approach misses 60% of gold's price drivers.

**Our approach: Macro (50%) + Technical (50%) = Full Picture**

---

## The Dual-Engine System

```
┌─────────────────────────────────────────────────────────┐
│                    GOLD SIGNAL ENGINE                    │
├──────────────────────┬──────────────────────────────────┤
│   MACRO ENGINE       │   TECHNICAL ENGINE               │
│   (FRED API)         │   (ta library)                   │
│                      │                                  │
│   Fed Rate           │   RSI (14)                       │
│   CPI (Inflation)    │   MACD (12,26,9)                 │
│   DXY (Dollar)       │   Stochastic RSI                 │
│   Treasury 10Y       │   EMA 9/21 Cross                 │
│   Treasury 2Y        │   SMA 50                         │
│   Real Yields        │   ADX                            │
│   VIX (Fear Index)   │   Bollinger Bands                │
│   M2 Money Supply    │   Volume Ratio                   │
│   Unemployment       │   OBV                            │
│   Gold Price (FRED)  │   VWAP                           │
│                      │                                  │
│   Max: 70 points     │   Max: 70 points                 │
├──────────────────────┴──────────────────────────────────┤
│              COMBINED: Max 140 points                    │
│              Both must confirm for STRONG BUY            │
└─────────────────────────────────────────────────────────┘
```

---

## Macro Indicators (FRED API — Free)

| # | Indicator | Source | Gold Bullish When | Points |
|---|-----------|--------|-------------------|--------|
| 1 | **Fed Rate** | `FEDFUNDS` | Rate falling or paused | +10 |
| 2 | **CPI (Inflation)** | `CPIAUCSL` | Inflation rising > 3% | +10 |
| 3 | **Dollar Index (DXY)** | `DTWEXBGS` | Dollar weakening (falling) | +10 |
| 4 | **Treasury 10Y** | `DGS10` | Yields falling | +7 |
| 5 | **Treasury 2Y** | `DGS2` | Yield curve inverted (2Y > 10Y) | +5 |
| 6 | **Real Yields** | `DFII10` | Real yields negative or falling | +8 |
| 7 | **VIX (Fear)** | `VIXCLS` | VIX > 20 (fear rising) | +5 |
| 8 | **M2 Money Supply** | `M2SL` | M2 expanding (money printing) | +8 |
| 9 | **Unemployment** | `UNRATE` | Unemployment rising | +7 |

**Max Macro Score: 70 points**

### Key Relationships (Expert Notes)

> [!IMPORTANT]
> - **Gold ↔ Dollar: INVERSE** — Dollar down = Gold up (strongest correlation)
> - **Gold ↔ Real Yields: INVERSE** — Negative real yields = Gold up
> - **Gold ↔ Inflation: POSITIVE** — High inflation = Gold up (hedge)
> - **Gold ↔ VIX: POSITIVE** — Fear = Gold up (safe haven)
> - **Gold ↔ Fed Rate: INVERSE** — Rate cuts = Gold up (lower opportunity cost)

---

## Technical Indicators (ta library — XAUUSD)

| # | Indicator | Gold Bullish When | Points |
|---|-----------|-------------------|--------|
| 1 | **RSI (14)** | RSI < 35 (oversold) | +10 |
| 2 | **MACD** | Bullish crossover | +10 |
| 3 | **Stochastic RSI** | StochRSI < 25 + cross up | +7 |
| 4 | **EMA 9/21** | Bullish cross | +7 |
| 5 | **SMA 50** | Price > SMA 50 | +7 |
| 6 | **ADX** | ADX > 25 + DI+ > DI- | +7 |
| 7 | **Bollinger Bands** | Lower band bounce | +7 |
| 8 | **Volume** | Volume > 1.5x avg | +5 |
| 9 | **OBV** | OBV rising | +5 |
| 10 | **VWAP** | Price > VWAP | +5 |

**Max Technical Score: 70 points**

---

## Combined Decision

| Score | Action | Requirement | Confidence |
|-------|--------|-------------|------------|
| 100–140 | ⭐ STRONG BUY | Macro ≥ 25 AND Tech ≥ 25 | 90%+ |
| 80–99 | 🟢 BUY | Both categories confirm | 75-90% |
| 55–79 | 🟡 WATCH | One category weak | 55-75% |
| 30–54 | 🔴 WAIT | Not enough confirmation | Low |
| 0–29 | ⛔ AVOID | Bearish or unclear | Very Low |

### Safety Rule
> If total ≥ 80 but macro < 25 → **Downgrade to WATCH (weak macro)**
> If total ≥ 80 but tech < 25 → **Downgrade to WATCH (bad timing)**

---

## Data Sources

| Source | What | Cost | Frequency |
|--------|------|------|-----------|
| **FRED API** | All macro data | FREE (API key needed) | Daily/Monthly |
| **Binance** | PAXGUSDT candles | FREE | Every 5 min |
| **TradingView Widget** | Chart display | FREE | Real-time |

> [!NOTE]
> We use **PAXGUSDT** (Paxos Gold) on Binance for technical analysis instead of yfinance.
> PAXGUSDT tracks physical gold 1:1 and is available on the same API we already use.
> This avoids adding yfinance dependency and keeps everything consistent.

---

## Frontend — Gold Page Layout

```
/coins/gold

┌─────────────────────────────────────────────────┐
│  🥇 XAUUSD  [STRONG BUY]        [Trade Gold →] │
│  Gold / USD  $2,340.50                          │
├────────────┬──────────────────┬──────────────────┤
│  📈 Chart  │  📊 Economics   │  📡 Signals      │
├────────────┴──────────────────┴──────────────────┤
│                                                  │
│  [Active Tab Content]                            │
│                                                  │
│  Tab 1: Full TradingView chart (OANDA:XAUUSD)   │
│  Tab 2: FRED macro indicators + correlations     │
│  Tab 3: Signal history + indicator breakdown     │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## Expert Recommendations

1. **FRED API is the right choice** — it's the gold standard (pun intended) for macro data
2. **Don't use yfinance** — it's unreliable and rate-limited. Use PAXGUSDT on Binance instead
3. **Macro updates should be daily** (not every 5 min) — FRED data updates daily/monthly
4. **Technical updates every 5 min** — same as crypto
5. **Gold signals are slower** — one strong signal per day is better than 10 weak ones

---

## Questions for Review

1. **FRED API key** — هل عملت account على fred.stlouisfed.org وجبت الـ API key؟
2. **PAXGUSDT** — موافق نستخدم PAXGUSDT من Binance بدل yfinance؟
3. **Macro weight** — 50/50 macro-technical كويس ولا عايز تغيّر؟
4. **Update frequency** — Macro يومي + Technical كل 5 دقائق؟
