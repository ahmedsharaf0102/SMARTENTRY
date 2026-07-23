"""
SmartEntry Economic Calendar Engine
Rule-based analysis for major economic events.

Uses Finnhub's free economic calendar API to fetch upcoming events,
then matches them against a predefined dictionary of event analysis
to provide market impact insights and affected asset identification.
"""

import os
import requests
from datetime import datetime, timezone, timedelta

# ══════════════════════════════════════════════════════════════
# EVENT ANALYSIS DICTIONARY (Rule-Based System)
# Maps event keywords → target market + impact analysis + affected assets
# ══════════════════════════════════════════════════════════════

EVENT_RULES = {
    # ── INFLATION ────────────────────────────────────────────
    "CPI": {
        "target_market": "Crypto & Stocks",
        "importance": "HIGH",
        "affected_assets": "USD, BTC, ETH, S&P 500, NASDAQ, Gold",
        "analysis": "📊 Consumer Price Index (CPI): Higher than expected → Bearish for stocks & crypto (Fed may hike rates). Lower than expected → Very bullish (rally likely)."
    },
    "Core CPI": {
        "target_market": "Crypto & Stocks",
        "importance": "HIGH",
        "affected_assets": "USD, BTC, ETH, S&P 500, NASDAQ",
        "analysis": "📊 Core CPI (excludes food & energy): Higher → Bearish (signals persistent inflation). Lower → Bullish for risk assets."
    },
    "PPI": {
        "target_market": "Stocks",
        "importance": "MEDIUM",
        "affected_assets": "USD, S&P 500, Industrial Stocks",
        "analysis": "🏭 Producer Price Index (PPI): Measures wholesale inflation. Rising PPI often leads to higher consumer prices → Bearish for stocks."
    },
    "PCE": {
        "target_market": "Crypto & Stocks",
        "importance": "HIGH",
        "affected_assets": "USD, BTC, ETH, S&P 500, Gold, Bonds",
        "analysis": "📊 PCE Price Index (Fed's preferred measure): Higher than expected → Rate hike risk → Bearish. Lower → Bullish. This is the #1 inflation indicator the Fed watches."
    },

    # ── FEDERAL RESERVE ──────────────────────────────────────
    "FOMC": {
        "target_market": "All Markets",
        "importance": "HIGH",
        "affected_assets": "USD, BTC, ETH, S&P 500, NASDAQ, Gold, EUR/USD, Bonds",
        "analysis": "🏛️ FOMC Meeting: The most important market event. Hold rates → Bullish. Hike rates → Very bearish for all markets. Cut rates → Very bullish (strong rally)."
    },
    "Fed Interest Rate": {
        "target_market": "All Markets",
        "importance": "HIGH",
        "affected_assets": "USD, BTC, ETH, S&P 500, NASDAQ, Gold, EUR/USD, GBP/USD, Bonds",
        "analysis": "🏛️ Fed Interest Rate Decision: Rate hike → USD strengthens, stocks/crypto/gold drop. Rate cut → USD weakens, everything else rallies. Hold → Relatively stable."
    },
    "Federal Funds Rate": {
        "target_market": "All Markets",
        "importance": "HIGH",
        "affected_assets": "USD, All Forex Pairs, S&P 500, BTC, Gold, Bonds",
        "analysis": "🏛️ Federal Funds Rate: Changes impact all global markets. Hike = Bearish, Cut = Bullish, Hold = Neutral."
    },
    "Fed Chair": {
        "target_market": "All Markets",
        "importance": "HIGH",
        "affected_assets": "USD, S&P 500, NASDAQ, BTC, Gold, EUR/USD",
        "analysis": "🎤 Fed Chair Speech: Any hint about rate changes moves markets sharply. Hawkish tone → Bearish. Dovish tone → Bullish."
    },
    "FOMC Minutes": {
        "target_market": "All Markets",
        "importance": "MEDIUM",
        "affected_assets": "USD, S&P 500, BTC, Gold, Bonds",
        "analysis": "📋 FOMC Minutes: Reveals internal Fed discussions. May give early signals about the next rate decision direction."
    },

    # ── EMPLOYMENT ────────────────────────────────────────────
    "Nonfarm Payrolls": {
        "target_market": "Forex & Gold",
        "importance": "HIGH",
        "affected_assets": "USD, Gold (XAU), EUR/USD, GBP/USD, USD/JPY",
        "analysis": "👷 Nonfarm Payrolls (NFP): More jobs than expected → USD strengthens → Gold drops. Fewer jobs → USD weakens → Gold rallies."
    },
    "NFP": {
        "target_market": "Forex & Gold",
        "importance": "HIGH",
        "affected_assets": "USD, Gold (XAU), EUR/USD, GBP/USD, USD/JPY",
        "analysis": "👷 NFP Report: Higher than forecast → Strong USD, Gold drops. Lower → Weak USD, Gold rallies. One of the most volatile trading days."
    },
    "Unemployment Rate": {
        "target_market": "Forex & Gold",
        "importance": "HIGH",
        "affected_assets": "USD, Gold (XAU), BTC, S&P 500, EUR/USD",
        "analysis": "📉 Unemployment Rate: Rising → Weak economy → Fed may cut rates → Bullish for Gold & Crypto. Falling → Strong economy → Bearish for Gold."
    },
    "Initial Jobless Claims": {
        "target_market": "Forex & Stocks",
        "importance": "MEDIUM",
        "affected_assets": "USD, S&P 500, EUR/USD",
        "analysis": "📋 Initial Jobless Claims: Higher = Weak labor market → Bearish for USD. Lower = Strong labor market → Bullish for USD."
    },
    "ADP": {
        "target_market": "Forex & Stocks",
        "importance": "MEDIUM",
        "affected_assets": "USD, S&P 500, EUR/USD, Gold",
        "analysis": "👥 ADP Employment Report: Leading indicator for NFP. Higher → Strong USD. Lower → Weak USD. Released 2 days before NFP."
    },

    # ── GDP & GROWTH ─────────────────────────────────────────
    "GDP": {
        "target_market": "Stocks",
        "importance": "HIGH",
        "affected_assets": "USD, S&P 500, NASDAQ, Dow Jones, BTC",
        "analysis": "📈 GDP Growth Rate: Higher than expected → Bullish for stocks & USD. Lower or negative → Recession fears → Bearish."
    },
    "Retail Sales": {
        "target_market": "Stocks",
        "importance": "MEDIUM",
        "affected_assets": "USD, S&P 500, Consumer Stocks (AMZN, WMT, TGT)",
        "analysis": "🛒 Retail Sales: Reflects consumer spending. Higher → Strong economy → Bullish for stocks. Lower → Bearish, especially retail sector."
    },

    # ── HOUSING ───────────────────────────────────────────────
    "Housing Starts": {
        "target_market": "Stocks",
        "importance": "LOW",
        "affected_assets": "Real Estate Stocks, Homebuilders (DHI, LEN, PHM)",
        "analysis": "🏠 Housing Starts: Indicator of real estate health. Rising → Economic activity. Falling → Slowdown."
    },
    "Existing Home Sales": {
        "target_market": "Stocks",
        "importance": "LOW",
        "affected_assets": "Real Estate Stocks, Mortgage REITs, USD",
        "analysis": "🏡 Existing Home Sales: Reflects housing market & consumer confidence."
    },

    # ── MANUFACTURING ─────────────────────────────────────────
    "ISM Manufacturing": {
        "target_market": "Stocks",
        "importance": "MEDIUM",
        "affected_assets": "USD, S&P 500, Industrial Stocks (CAT, DE, GE)",
        "analysis": "🏭 ISM Manufacturing PMI: Above 50 = Expansion → Bullish. Below 50 = Contraction → Bearish for industrial stocks."
    },
    "ISM Services": {
        "target_market": "Stocks",
        "importance": "MEDIUM",
        "affected_assets": "USD, S&P 500, Service Sector Stocks",
        "analysis": "🏢 ISM Services PMI: Covers 75% of the economy. Above 50 → Expansion → Bullish. Below 50 → Contraction → Bearish."
    },
    "PMI": {
        "target_market": "Stocks",
        "importance": "MEDIUM",
        "affected_assets": "USD, S&P 500, Industrial Stocks",
        "analysis": "📊 Purchasing Managers' Index (PMI): Above 50 = Sector growth. Below 50 = Contraction. Impacts industrial sector stocks."
    },

    # ── CONSUMER CONFIDENCE ───────────────────────────────────
    "Consumer Confidence": {
        "target_market": "Stocks",
        "importance": "MEDIUM",
        "affected_assets": "S&P 500, Consumer Discretionary Stocks, USD",
        "analysis": "😊 Consumer Confidence: Rising → Optimistic consumers → More spending → Bullish for stocks. Falling → Bearish."
    },
    "Michigan Consumer": {
        "target_market": "Stocks",
        "importance": "MEDIUM",
        "affected_assets": "S&P 500, Consumer Stocks, USD",
        "analysis": "📊 Michigan Consumer Sentiment: Measures consumer expectations. Rising → Bullish for stocks. Falling → Bearish."
    },

    # ── TRADE & DOLLAR ────────────────────────────────────────
    "Trade Balance": {
        "target_market": "Forex",
        "importance": "LOW",
        "affected_assets": "USD, EUR/USD, USD/CNH",
        "analysis": "⚖️ Trade Balance: Larger deficit → Pressure on USD. Surplus or smaller deficit → USD support."
    },
    "Durable Goods": {
        "target_market": "Stocks",
        "importance": "MEDIUM",
        "affected_assets": "USD, S&P 500, Boeing (BA), Industrial Stocks",
        "analysis": "🔧 Durable Goods Orders: Reflects business investment. Rising → Confidence in economy → Bullish for stocks."
    },

    # ── CRYPTO-SPECIFIC ───────────────────────────────────────
    "Bitcoin": {
        "target_market": "Crypto",
        "importance": "HIGH",
        "affected_assets": "BTC, ETH, SOL, Total Crypto Market",
        "analysis": "₿ Bitcoin Event: Watch for direct crypto market impact. Positive news (ETF, adoption) → Rally. Negative regulation → Dump."
    },
    "Crypto": {
        "target_market": "Crypto",
        "importance": "MEDIUM",
        "affected_assets": "BTC, ETH, Altcoins, Total Crypto Market",
        "analysis": "🪙 Crypto Event: Monitor for market impact. New regulations, hacks, or institutional adoption all move the market."
    },

    # ── ECB (European) ────────────────────────────────────────
    "ECB": {
        "target_market": "Forex",
        "importance": "HIGH",
        "affected_assets": "EUR/USD, EUR/GBP, EUR/JPY, DAX, Euro Stoxx 50",
        "analysis": "🇪🇺 ECB Interest Rate Decision: Rate hike → EUR strengthens. Rate cut → EUR weakens. Impacts all EUR pairs and European stocks."
    },

    # ── BOE (British) ─────────────────────────────────────────
    "BOE": {
        "target_market": "Forex",
        "importance": "HIGH",
        "affected_assets": "GBP/USD, EUR/GBP, GBP/JPY, FTSE 100",
        "analysis": "🇬🇧 Bank of England Decision: Rate hike → GBP strengthens. Rate cut → GBP weakens. Impacts all GBP pairs and UK stocks."
    },

    # ── BOJ (Japan) ───────────────────────────────────────────
    "BOJ": {
        "target_market": "Forex",
        "importance": "HIGH",
        "affected_assets": "USD/JPY, EUR/JPY, GBP/JPY, Nikkei 225",
        "analysis": "🇯🇵 Bank of Japan Decision: Any policy shift strongly impacts USD/JPY and Asian markets. Yield curve control changes cause extreme volatility."
    },

    # ── RBA (Australian) ──────────────────────────────────────
    "RBA": {
        "target_market": "Forex",
        "importance": "HIGH",
        "affected_assets": "AUD/USD, AUD/JPY, AUD/NZD, ASX 200",
        "analysis": "🇦🇺 Reserve Bank of Australia Decision: Rate hike → AUD strengthens. Rate cut → AUD weakens. Impacts all AUD pairs."
    },

    # ── SNB (Swiss) ───────────────────────────────────────────
    "SNB": {
        "target_market": "Forex",
        "importance": "HIGH",
        "affected_assets": "USD/CHF, EUR/CHF, CHF/JPY",
        "analysis": "🇨🇭 Swiss National Bank Decision: Impacts CHF pairs. SNB is known for surprise interventions in currency markets."
    },

    # ── RBNZ (New Zealand) ────────────────────────────────────
    "RBNZ": {
        "target_market": "Forex",
        "importance": "MEDIUM",
        "affected_assets": "NZD/USD, AUD/NZD, NZD/JPY",
        "analysis": "🇳🇿 Reserve Bank of NZ Decision: Impacts NZD pairs directly. Rate decisions influence AUD/NZD correlation."
    },

    # ── OIL ───────────────────────────────────────────────────
    "Crude Oil Inventories": {
        "target_market": "Commodities",
        "importance": "MEDIUM",
        "affected_assets": "Crude Oil (WTI), Brent Oil, Energy Stocks (XOM, CVX, OXY)",
        "analysis": "🛢️ EIA Crude Oil Inventories: Build (more supply) → Oil price drops. Draw (less supply) → Oil price rises. Impacts energy stocks."
    },
}

# Default analysis for events that don't match any rule
DEFAULT_ANALYSIS = {
    "HIGH": "⚠️ High-impact economic event: Watch the actual result vs forecast. A big surprise = strong market move.",
    "MEDIUM": "📊 Medium-impact event: May cause temporary market volatility.",
    "LOW": "📋 Low-impact event: Usually limited impact unless there's a major surprise.",
}


def match_event(event_name: str) -> dict | None:
    """Match an event name against our rule dictionary."""
    name_upper = event_name.upper()
    for keyword, rule in EVENT_RULES.items():
        if keyword.upper() in name_upper:
            return rule
    return None


def fetch_finnhub_calendar(from_date: str, to_date: str) -> list[dict]:
    """
    Fetch economic calendar from Finnhub API (free tier).
    Returns a list of events.
    """
    api_key = os.environ.get('FINNHUB_API_KEY', '')
    if not api_key:
        print("  ⚠️ FINNHUB_API_KEY not set, using fallback calendar")
        return []

    url = "https://finnhub.io/api/v1/calendar/economic"
    params = {
        "from": from_date,
        "to": to_date,
        "token": api_key,
    }

    try:
        resp = requests.get(url, params=params, timeout=15)
        resp.raise_for_status()
        data = resp.json()
        events = data.get("economicCalendar", [])
        print(f"  📥 Fetched {len(events)} events from Finnhub ({from_date} → {to_date})")
        return events
    except Exception as e:
        print(f"  ❌ Finnhub API error: {e}")
        return []


def generate_fallback_events() -> list[dict]:
    """
    Generate a static set of recurring major events when no API key is available.
    These are the most important US economic events that repeat monthly.
    """
    now = datetime.now(timezone.utc)
    current_month = now.month
    current_year = now.year

    # Major recurring events with approximate dates
    recurring = [
        {"event": "FOMC Meeting / Fed Interest Rate Decision", "day": 15, "importance": "HIGH"},
        {"event": "CPI (Consumer Price Index) m/m", "day": 12, "importance": "HIGH"},
        {"event": "Core CPI m/m", "day": 12, "importance": "HIGH"},
        {"event": "Nonfarm Payrolls (NFP)", "day": 5, "importance": "HIGH"},
        {"event": "Unemployment Rate", "day": 5, "importance": "HIGH"},
        {"event": "GDP Growth Rate q/q", "day": 25, "importance": "HIGH"},
        {"event": "PCE Price Index m/m", "day": 28, "importance": "HIGH"},
        {"event": "Fed Chair Powell Speech", "day": 16, "importance": "HIGH"},
        {"event": "ISM Manufacturing PMI", "day": 1, "importance": "MEDIUM"},
        {"event": "ISM Services PMI", "day": 3, "importance": "MEDIUM"},
        {"event": "Retail Sales m/m", "day": 14, "importance": "MEDIUM"},
        {"event": "Initial Jobless Claims", "day": 8, "importance": "MEDIUM"},
        {"event": "Initial Jobless Claims", "day": 15, "importance": "MEDIUM"},
        {"event": "Initial Jobless Claims", "day": 22, "importance": "MEDIUM"},
        {"event": "ADP Nonfarm Employment Change", "day": 4, "importance": "MEDIUM"},
        {"event": "Consumer Confidence Index", "day": 26, "importance": "MEDIUM"},
        {"event": "Durable Goods Orders m/m", "day": 24, "importance": "MEDIUM"},
        {"event": "PPI (Producer Price Index) m/m", "day": 11, "importance": "MEDIUM"},
        {"event": "Michigan Consumer Sentiment", "day": 13, "importance": "MEDIUM"},
        {"event": "Crude Oil Inventories", "day": 10, "importance": "MEDIUM"},
        {"event": "Crude Oil Inventories", "day": 17, "importance": "MEDIUM"},
        {"event": "Existing Home Sales", "day": 20, "importance": "LOW"},
        {"event": "Housing Starts", "day": 17, "importance": "LOW"},
        {"event": "Trade Balance", "day": 6, "importance": "LOW"},
    ]

    events = []
    # Generate for current month and next month
    for month_offset in range(2):
        month = current_month + month_offset
        year = current_year
        if month > 12:
            month -= 12
            year += 1

        for item in recurring:
            try:
                event_date = datetime(year, month, min(item["day"], 28), 14, 30,
                                     tzinfo=timezone.utc)
                events.append({
                    "event": item["event"],
                    "time": event_date.isoformat(),
                    "country": "US",
                    "impact": item["importance"].lower(),
                    "actual": None,
                    "estimate": None,
                    "prev": None,
                })
            except ValueError:
                continue

    print(f"  📋 Generated {len(events)} fallback events (no API key)")
    return events


def process_events(raw_events: list[dict]) -> list[dict]:
    """
    Process raw events: match against our rules dictionary,
    add English analysis + affected assets, and return Supabase-ready records.
    """
    processed = []
    for event in raw_events:
        event_name = event.get("event", "")
        if not event_name:
            continue

        # Try to match against rules
        rule = match_event(event_name)

        # Determine importance
        raw_impact = event.get("impact", "medium").upper()
        if raw_impact in ("HIGH", "MEDIUM", "LOW"):
            importance = raw_impact
        elif rule:
            importance = rule["importance"]
        else:
            importance = "MEDIUM"

        # Get analysis, target market, and affected assets
        if rule:
            analysis = rule["analysis"]
            target_market = rule["target_market"]
            affected_assets = rule["affected_assets"]
        else:
            analysis = DEFAULT_ANALYSIS.get(importance, DEFAULT_ANALYSIS["MEDIUM"])
            target_market = "All Markets"
            affected_assets = "USD"

        # Build record
        record = {
            "event_name": event_name,
            "event_time": event.get("time", datetime.now(timezone.utc).isoformat()),
            "country": event.get("country", "US"),
            "actual": str(event.get("actual", "")) if event.get("actual") is not None else None,
            "forecast": str(event.get("estimate", "")) if event.get("estimate") is not None else None,
            "previous": str(event.get("prev", "")) if event.get("prev") is not None else None,
            "target_market": target_market,
            "affected_assets": affected_assets,
            "impact_analysis": analysis,
            "importance": importance,
        }
        processed.append(record)

    print(f"  🧠 Processed {len(processed)} events with smart analysis")
    return processed


def run_calendar_pipeline():
    """Main entry point: fetch → analyze → save to Supabase."""
    from utils.supabase_client import get_client

    print("\n📅 Fetching economic calendar data...")

    # Date range: today → 30 days ahead
    now = datetime.now(timezone.utc)
    from_date = now.strftime("%Y-%m-%d")
    to_date = (now + timedelta(days=30)).strftime("%Y-%m-%d")

    # Try Finnhub API first, fallback to static events
    raw_events = fetch_finnhub_calendar(from_date, to_date)
    if not raw_events:
        raw_events = generate_fallback_events()

    if not raw_events:
        print("  ⚠️ No events to process")
        return

    # Process with smart analysis
    processed = process_events(raw_events)
    if not processed:
        print("  ⚠️ No events after processing")
        return

    # Save to Supabase (upsert to avoid duplicates)
    client = get_client()
    try:
        client.table("economic_calendar").upsert(
            processed,
            on_conflict="event_name,event_time"
        ).execute()
        print(f"  ✅ Saved {len(processed)} events to Supabase")
    except Exception as e:
        print(f"  ❌ Supabase save error: {e}")
        raise
