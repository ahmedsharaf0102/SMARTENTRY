"""
SmartEntry Economic Calendar Engine v2 — Global Coverage
Fetches global economic events, matches against rule dictionary,
provides impact analysis with affected assets, currency, and status tracking.

Supports: US, EU, UK, Japan, Australia, Canada, Switzerland, New Zealand, China
"""

import os
import requests
from datetime import datetime, timezone, timedelta

# ══════════════════════════════════════════════════════════════
# COUNTRY → CURRENCY MAPPING
# ══════════════════════════════════════════════════════════════

COUNTRY_CURRENCY = {
    "US": "USD", "United States": "USD",
    "EU": "EUR", "EMU": "EUR", "Eurozone": "EUR", "Euro Area": "EUR",
    "GB": "GBP", "UK": "GBP", "United Kingdom": "GBP",
    "JP": "JPY", "Japan": "JPY",
    "AU": "AUD", "Australia": "AUD",
    "CA": "CAD", "Canada": "CAD",
    "CH": "CHF", "Switzerland": "CHF",
    "NZ": "NZD", "New Zealand": "NZD",
    "CN": "CNY", "China": "CNY",
    "DE": "EUR", "Germany": "EUR",
    "FR": "EUR", "France": "EUR",
    "IT": "EUR", "Italy": "EUR",
    "ES": "EUR", "Spain": "EUR",
}

# ══════════════════════════════════════════════════════════════
# EVENT DESCRIPTIONS (what each indicator measures)
# ══════════════════════════════════════════════════════════════

EVENT_DESCRIPTIONS = {
    "CPI": "Measures the average change in prices paid by consumers for goods and services. The primary gauge of consumer inflation.",
    "Core CPI": "CPI excluding volatile food and energy prices. Gives a clearer picture of underlying inflation trends.",
    "PPI": "Measures average change in selling prices received by domestic producers. A leading indicator of consumer inflation.",
    "PCE": "The Federal Reserve's preferred inflation measure. Tracks changes in prices of goods and services purchased by consumers.",
    "FOMC": "The Federal Open Market Committee sets US monetary policy, including the federal funds rate target.",
    "Fed Interest Rate": "The target rate at which banks lend to each other overnight. The most important rate in global finance.",
    "Federal Funds Rate": "The benchmark interest rate set by the Federal Reserve that influences all other rates in the economy.",
    "Fed Chair": "Speech by the Federal Reserve Chair. Markets closely watch for signals about future monetary policy.",
    "FOMC Minutes": "Detailed record of the FOMC meeting discussions, providing insight into the committee's thinking on rates.",
    "Nonfarm Payrolls": "Measures the number of jobs added/lost in the US economy, excluding farm workers. Key employment indicator.",
    "NFP": "Nonfarm Payrolls — total number of paid US workers excluding farm employees, government, and nonprofits.",
    "Unemployment Rate": "Percentage of the labor force that is unemployed and actively seeking work.",
    "Initial Jobless Claims": "Weekly count of new applications for unemployment insurance benefits. A timely labor market indicator.",
    "ADP": "Monthly report on US private-sector employment changes. Often seen as a preview of the official NFP report.",
    "GDP": "The total monetary value of all goods and services produced. The broadest measure of economic activity.",
    "Retail Sales": "Measures total receipts of retail stores. Reflects consumer spending, which drives ~70% of US GDP.",
    "ISM Manufacturing": "Survey of purchasing managers in the manufacturing sector. Above 50 indicates expansion.",
    "ISM Services": "Survey of purchasing managers in the service sector. Covers ~75% of the US economy.",
    "PMI": "Purchasing Managers' Index — a survey-based indicator of economic health in manufacturing or services.",
    "Consumer Confidence": "Survey measuring how optimistic consumers feel about the economy and their personal finances.",
    "Michigan Consumer": "University of Michigan survey of consumer sentiment and inflation expectations.",
    "Trade Balance": "The difference between a country's exports and imports. Affects currency valuation.",
    "Durable Goods": "Orders for long-lasting manufactured goods. Reflects business investment and confidence.",
    "Crude Oil Inventories": "Weekly change in US commercial crude oil stockpiles. Directly impacts oil prices.",
    "Housing Starts": "Number of new residential construction projects begun. Indicator of real estate market health.",
    "Existing Home Sales": "Monthly measure of closed sales of previously owned homes.",
    "ECB": "European Central Bank interest rate decision. Determines monetary policy for the Eurozone.",
    "BOE": "Bank of England interest rate decision. Sets monetary policy for the United Kingdom.",
    "BOJ": "Bank of Japan monetary policy decision. Known for unconventional policies like yield curve control.",
    "RBA": "Reserve Bank of Australia interest rate decision. Key driver of AUD exchange rates.",
    "SNB": "Swiss National Bank policy rate decision. Known for surprise currency interventions.",
    "RBNZ": "Reserve Bank of New Zealand interest rate decision. Impacts NZD pairs globally.",
}

# ══════════════════════════════════════════════════════════════
# OFFICIAL DATA SOURCES
# ══════════════════════════════════════════════════════════════

EVENT_SOURCES = {
    "CPI": ("Bureau of Labor Statistics", "https://www.bls.gov/cpi/"),
    "Core CPI": ("Bureau of Labor Statistics", "https://www.bls.gov/cpi/"),
    "PPI": ("Bureau of Labor Statistics", "https://www.bls.gov/ppi/"),
    "PCE": ("Bureau of Economic Analysis", "https://www.bea.gov/data/personal-consumption-expenditures-price-index"),
    "FOMC": ("Federal Reserve", "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm"),
    "Fed Interest Rate": ("Federal Reserve", "https://www.federalreserve.gov/monetarypolicy.htm"),
    "Federal Funds Rate": ("Federal Reserve", "https://www.federalreserve.gov/monetarypolicy.htm"),
    "Fed Chair": ("Federal Reserve", "https://www.federalreserve.gov/newsevents/speeches.htm"),
    "FOMC Minutes": ("Federal Reserve", "https://www.federalreserve.gov/monetarypolicy/fomcminutes.htm"),
    "Nonfarm Payrolls": ("Bureau of Labor Statistics", "https://www.bls.gov/ces/"),
    "NFP": ("Bureau of Labor Statistics", "https://www.bls.gov/ces/"),
    "Unemployment Rate": ("Bureau of Labor Statistics", "https://www.bls.gov/cps/"),
    "Initial Jobless Claims": ("Dept. of Labor", "https://www.dol.gov/ui/data.pdf"),
    "ADP": ("ADP Research Institute", "https://adpemploymentreport.com/"),
    "GDP": ("Bureau of Economic Analysis", "https://www.bea.gov/data/gdp"),
    "Retail Sales": ("Census Bureau", "https://www.census.gov/retail/index.html"),
    "ISM Manufacturing": ("Institute for Supply Management", "https://www.ismworld.org/supply-management-news-and-reports/reports/ism-report-on-business/"),
    "ISM Services": ("Institute for Supply Management", "https://www.ismworld.org/"),
    "Consumer Confidence": ("The Conference Board", "https://www.conference-board.org/"),
    "Michigan Consumer": ("University of Michigan", "http://www.sca.isr.umich.edu/"),
    "Trade Balance": ("Census Bureau", "https://www.census.gov/foreign-trade/index.html"),
    "Durable Goods": ("Census Bureau", "https://www.census.gov/manufacturing/m3/index.html"),
    "Crude Oil Inventories": ("EIA", "https://www.eia.gov/petroleum/supply/weekly/"),
    "ECB": ("European Central Bank", "https://www.ecb.europa.eu/mopo/decisions/html/index.en.html"),
    "BOE": ("Bank of England", "https://www.bankofengland.co.uk/monetary-policy"),
    "BOJ": ("Bank of Japan", "https://www.boj.or.jp/en/mopo/index.htm"),
    "RBA": ("Reserve Bank of Australia", "https://www.rba.gov.au/monetary-policy/"),
    "SNB": ("Swiss National Bank", "https://www.snb.ch/en/ifor/finmkt/id/finmkt_interest"),
    "RBNZ": ("Reserve Bank of New Zealand", "https://www.rbnz.govt.nz/monetary-policy"),
}

# ══════════════════════════════════════════════════════════════
# EVENT ANALYSIS RULES (market impact + affected assets)
# ══════════════════════════════════════════════════════════════

EVENT_RULES = {
    "CPI": {
        "target_market": "Crypto & Stocks", "importance": "HIGH",
        "affected_assets": "USD, BTC, ETH, S&P 500, NASDAQ, Gold",
        "analysis": "📊 Consumer Price Index (CPI): Higher than expected → Bearish for stocks & crypto (Fed may hike rates). Lower than expected → Very bullish (rally likely)."
    },
    "Core CPI": {
        "target_market": "Crypto & Stocks", "importance": "HIGH",
        "affected_assets": "USD, BTC, ETH, S&P 500, NASDAQ",
        "analysis": "📊 Core CPI (excludes food & energy): Higher → Bearish (signals persistent inflation). Lower → Bullish for risk assets."
    },
    "PPI": {
        "target_market": "Stocks", "importance": "MEDIUM",
        "affected_assets": "USD, S&P 500, Industrial Stocks",
        "analysis": "🏭 Producer Price Index (PPI): Measures wholesale inflation. Rising PPI often leads to higher consumer prices → Bearish for stocks."
    },
    "PCE": {
        "target_market": "Crypto & Stocks", "importance": "HIGH",
        "affected_assets": "USD, BTC, ETH, S&P 500, Gold, Bonds",
        "analysis": "📊 PCE Price Index (Fed's preferred measure): Higher → Rate hike risk → Bearish. Lower → Bullish. The #1 indicator the Fed watches."
    },
    "FOMC": {
        "target_market": "All Markets", "importance": "HIGH",
        "affected_assets": "USD, BTC, ETH, S&P 500, NASDAQ, Gold, EUR/USD, Bonds",
        "analysis": "🏛️ FOMC Meeting: The most important market event. Hold rates → Bullish. Hike → Very bearish. Cut → Very bullish (strong rally)."
    },
    "Fed Interest Rate": {
        "target_market": "All Markets", "importance": "HIGH",
        "affected_assets": "USD, BTC, ETH, S&P 500, NASDAQ, Gold, EUR/USD, GBP/USD, Bonds",
        "analysis": "🏛️ Fed Rate Decision: Hike → USD up, stocks/crypto/gold down. Cut → USD down, everything rallies. Hold → Stable."
    },
    "Federal Funds Rate": {
        "target_market": "All Markets", "importance": "HIGH",
        "affected_assets": "USD, All Forex Pairs, S&P 500, BTC, Gold, Bonds",
        "analysis": "🏛️ Federal Funds Rate: Hike = Bearish, Cut = Bullish, Hold = Neutral for all global markets."
    },
    "Fed Chair": {
        "target_market": "All Markets", "importance": "HIGH",
        "affected_assets": "USD, S&P 500, NASDAQ, BTC, Gold, EUR/USD",
        "analysis": "🎤 Fed Chair Speech: Hawkish tone → Bearish. Dovish tone → Bullish. Markets react to every word."
    },
    "FOMC Minutes": {
        "target_market": "All Markets", "importance": "MEDIUM",
        "affected_assets": "USD, S&P 500, BTC, Gold, Bonds",
        "analysis": "📋 FOMC Minutes: Reveals internal Fed discussions. May signal the next rate decision direction."
    },
    "Nonfarm Payrolls": {
        "target_market": "Forex & Gold", "importance": "HIGH",
        "affected_assets": "USD, Gold (XAU), EUR/USD, GBP/USD, USD/JPY",
        "analysis": "👷 NFP: More jobs than expected → USD up → Gold down. Fewer jobs → USD down → Gold up."
    },
    "NFP": {
        "target_market": "Forex & Gold", "importance": "HIGH",
        "affected_assets": "USD, Gold (XAU), EUR/USD, GBP/USD, USD/JPY",
        "analysis": "👷 NFP: Higher → Strong USD, Gold drops. Lower → Weak USD, Gold rallies. Highest volatility day of the month."
    },
    "Unemployment Rate": {
        "target_market": "Forex & Gold", "importance": "HIGH",
        "affected_assets": "USD, Gold (XAU), BTC, S&P 500, EUR/USD",
        "analysis": "📉 Unemployment: Rising → Weak economy → Fed may cut → Bullish Gold & Crypto. Falling → Bearish Gold."
    },
    "Initial Jobless Claims": {
        "target_market": "Forex & Stocks", "importance": "MEDIUM",
        "affected_assets": "USD, S&P 500, EUR/USD",
        "analysis": "📋 Jobless Claims: Higher = Weak labor → Bearish USD. Lower = Strong labor → Bullish USD."
    },
    "ADP": {
        "target_market": "Forex & Stocks", "importance": "MEDIUM",
        "affected_assets": "USD, S&P 500, EUR/USD, Gold",
        "analysis": "👥 ADP Employment: Leading indicator for NFP. Higher → Strong USD. Lower → Weak USD."
    },
    "GDP": {
        "target_market": "Stocks", "importance": "HIGH",
        "affected_assets": "USD, S&P 500, NASDAQ, Dow Jones, BTC",
        "analysis": "📈 GDP Growth: Higher → Bullish stocks & USD. Lower/negative → Recession fears → Bearish."
    },
    "Retail Sales": {
        "target_market": "Stocks", "importance": "MEDIUM",
        "affected_assets": "USD, S&P 500, Consumer Stocks (AMZN, WMT, TGT)",
        "analysis": "🛒 Retail Sales: Higher → Strong economy → Bullish stocks. Lower → Bearish retail sector."
    },
    "Housing Starts": {
        "target_market": "Stocks", "importance": "LOW",
        "affected_assets": "Real Estate Stocks, Homebuilders (DHI, LEN, PHM)",
        "analysis": "🏠 Housing Starts: Rising → Economic activity. Falling → Slowdown."
    },
    "Existing Home Sales": {
        "target_market": "Stocks", "importance": "LOW",
        "affected_assets": "Real Estate Stocks, Mortgage REITs, USD",
        "analysis": "🏡 Existing Home Sales: Reflects housing market & consumer confidence."
    },
    "ISM Manufacturing": {
        "target_market": "Stocks", "importance": "MEDIUM",
        "affected_assets": "USD, S&P 500, Industrial Stocks (CAT, DE, GE)",
        "analysis": "🏭 ISM Manufacturing: Above 50 = Expansion → Bullish. Below 50 = Contraction → Bearish."
    },
    "ISM Services": {
        "target_market": "Stocks", "importance": "MEDIUM",
        "affected_assets": "USD, S&P 500, Service Sector Stocks",
        "analysis": "🏢 ISM Services: Covers 75% of economy. Above 50 → Bullish. Below 50 → Bearish."
    },
    "PMI": {
        "target_market": "Stocks", "importance": "MEDIUM",
        "affected_assets": "USD, S&P 500, Industrial Stocks",
        "analysis": "📊 PMI: Above 50 = Growth. Below 50 = Contraction. Impacts industrial sector."
    },
    "Consumer Confidence": {
        "target_market": "Stocks", "importance": "MEDIUM",
        "affected_assets": "S&P 500, Consumer Discretionary Stocks, USD",
        "analysis": "😊 Consumer Confidence: Rising → More spending → Bullish stocks. Falling → Bearish."
    },
    "Michigan Consumer": {
        "target_market": "Stocks", "importance": "MEDIUM",
        "affected_assets": "S&P 500, Consumer Stocks, USD",
        "analysis": "📊 Michigan Sentiment: Rising → Bullish stocks. Falling → Bearish."
    },
    "Trade Balance": {
        "target_market": "Forex", "importance": "LOW",
        "affected_assets": "USD, EUR/USD, USD/CNH",
        "analysis": "⚖️ Trade Balance: Larger deficit → Pressure on USD. Surplus → USD support."
    },
    "Durable Goods": {
        "target_market": "Stocks", "importance": "MEDIUM",
        "affected_assets": "USD, S&P 500, Boeing (BA), Industrial Stocks",
        "analysis": "🔧 Durable Goods: Rising → Confidence in economy → Bullish stocks."
    },
    "Bitcoin": {
        "target_market": "Crypto", "importance": "HIGH",
        "affected_assets": "BTC, ETH, SOL, Total Crypto Market",
        "analysis": "₿ Bitcoin Event: Positive (ETF, adoption) → Rally. Negative regulation → Dump."
    },
    "Crypto": {
        "target_market": "Crypto", "importance": "MEDIUM",
        "affected_assets": "BTC, ETH, Altcoins, Total Crypto Market",
        "analysis": "🪙 Crypto Event: Regulations, hacks, or institutional adoption all move the market."
    },
    "ECB": {
        "target_market": "Forex", "importance": "HIGH",
        "affected_assets": "EUR/USD, EUR/GBP, EUR/JPY, DAX, Euro Stoxx 50",
        "analysis": "🇪🇺 ECB Decision: Hike → EUR up. Cut → EUR down. Impacts all EUR pairs and European stocks."
    },
    "BOE": {
        "target_market": "Forex", "importance": "HIGH",
        "affected_assets": "GBP/USD, EUR/GBP, GBP/JPY, FTSE 100",
        "analysis": "🇬🇧 BOE Decision: Hike → GBP up. Cut → GBP down. Impacts all GBP pairs and UK stocks."
    },
    "BOJ": {
        "target_market": "Forex", "importance": "HIGH",
        "affected_assets": "USD/JPY, EUR/JPY, GBP/JPY, Nikkei 225",
        "analysis": "🇯🇵 BOJ Decision: Policy shift strongly impacts USD/JPY and Asian markets. Extreme volatility possible."
    },
    "RBA": {
        "target_market": "Forex", "importance": "HIGH",
        "affected_assets": "AUD/USD, AUD/JPY, AUD/NZD, ASX 200",
        "analysis": "🇦🇺 RBA Decision: Hike → AUD up. Cut → AUD down. Impacts all AUD pairs."
    },
    "SNB": {
        "target_market": "Forex", "importance": "HIGH",
        "affected_assets": "USD/CHF, EUR/CHF, CHF/JPY",
        "analysis": "🇨🇭 SNB Decision: Known for surprise currency interventions. Impacts CHF pairs."
    },
    "RBNZ": {
        "target_market": "Forex", "importance": "MEDIUM",
        "affected_assets": "NZD/USD, AUD/NZD, NZD/JPY",
        "analysis": "🇳🇿 RBNZ Decision: Impacts NZD pairs. Rate decisions influence AUD/NZD correlation."
    },
    "Crude Oil Inventories": {
        "target_market": "Commodities", "importance": "MEDIUM",
        "affected_assets": "Crude Oil (WTI), Brent Oil, Energy Stocks (XOM, CVX, OXY)",
        "analysis": "🛢️ EIA Crude Inventories: Build → Oil drops. Draw → Oil rises. Impacts energy stocks."
    },
}

DEFAULT_ANALYSIS = {
    "HIGH": "⚠️ High-impact event: Watch actual vs forecast. A big surprise = strong market move.",
    "MEDIUM": "📊 Medium-impact event: May cause temporary volatility.",
    "LOW": "📋 Low-impact event: Usually limited impact unless major surprise.",
}


def match_event(event_name: str) -> dict | None:
    """Match an event name against our rule dictionary."""
    name_upper = event_name.upper()
    for keyword, rule in EVENT_RULES.items():
        if keyword.upper() in name_upper:
            return rule
    return None


def get_description(event_name: str) -> str | None:
    """Get the description for an event from our dictionary."""
    name_upper = event_name.upper()
    for keyword, desc in EVENT_DESCRIPTIONS.items():
        if keyword.upper() in name_upper:
            return desc
    return None


def get_source(event_name: str) -> tuple[str | None, str | None]:
    """Get official source name and URL for an event."""
    name_upper = event_name.upper()
    for keyword, (name, url) in EVENT_SOURCES.items():
        if keyword.upper() in name_upper:
            return name, url
    return None, None


def get_currency(country: str) -> str:
    """Map country code to currency."""
    return COUNTRY_CURRENCY.get(country, "USD")


def determine_status(actual_val) -> str:
    """Determine event status based on actual value."""
    if actual_val is not None and str(actual_val).strip() not in ("", "None"):
        return "Released"
    return "Upcoming"


def fetch_finnhub_calendar(from_date: str, to_date: str) -> list[dict]:
    """Fetch economic calendar from Finnhub API (free tier — global events)."""
    api_key = os.environ.get('FINNHUB_API_KEY', '')
    if not api_key:
        print("  ⚠️ FINNHUB_API_KEY not set, using fallback calendar")
        return []

    url = "https://finnhub.io/api/v1/calendar/economic"
    params = {"from": from_date, "to": to_date, "token": api_key}

    try:
        resp = requests.get(url, params=params, timeout=15)
        resp.raise_for_status()
        data = resp.json()
        events = data.get("economicCalendar", [])
        print(f"  📥 Fetched {len(events)} global events from Finnhub ({from_date} → {to_date})")
        return events
    except Exception as e:
        print(f"  ❌ Finnhub API error: {e}")
        return []


def generate_fallback_events() -> list[dict]:
    """Generate recurring events for US + global when no API key available."""
    now = datetime.now(timezone.utc)
    current_month = now.month
    current_year = now.year

    recurring = [
        # US Events
        {"event": "FOMC Meeting / Fed Interest Rate Decision", "day": 15, "importance": "HIGH", "country": "US"},
        {"event": "CPI (Consumer Price Index) m/m", "day": 12, "importance": "HIGH", "country": "US"},
        {"event": "Core CPI m/m", "day": 12, "importance": "HIGH", "country": "US"},
        {"event": "Nonfarm Payrolls (NFP)", "day": 5, "importance": "HIGH", "country": "US"},
        {"event": "Unemployment Rate", "day": 5, "importance": "HIGH", "country": "US"},
        {"event": "GDP Growth Rate q/q", "day": 25, "importance": "HIGH", "country": "US"},
        {"event": "PCE Price Index m/m", "day": 28, "importance": "HIGH", "country": "US"},
        {"event": "Fed Chair Powell Speech", "day": 16, "importance": "HIGH", "country": "US"},
        {"event": "ISM Manufacturing PMI", "day": 1, "importance": "MEDIUM", "country": "US"},
        {"event": "ISM Services PMI", "day": 3, "importance": "MEDIUM", "country": "US"},
        {"event": "Retail Sales m/m", "day": 14, "importance": "MEDIUM", "country": "US"},
        {"event": "Initial Jobless Claims", "day": 8, "importance": "MEDIUM", "country": "US"},
        {"event": "Initial Jobless Claims", "day": 22, "importance": "MEDIUM", "country": "US"},
        {"event": "ADP Nonfarm Employment Change", "day": 4, "importance": "MEDIUM", "country": "US"},
        {"event": "Consumer Confidence Index", "day": 26, "importance": "MEDIUM", "country": "US"},
        {"event": "Durable Goods Orders m/m", "day": 24, "importance": "MEDIUM", "country": "US"},
        {"event": "PPI (Producer Price Index) m/m", "day": 11, "importance": "MEDIUM", "country": "US"},
        {"event": "Crude Oil Inventories", "day": 10, "importance": "MEDIUM", "country": "US"},
        # European Events
        {"event": "ECB Interest Rate Decision", "day": 10, "importance": "HIGH", "country": "EU"},
        {"event": "ECB Press Conference", "day": 10, "importance": "HIGH", "country": "EU"},
        {"event": "CPI (Consumer Price Index) y/y", "day": 18, "importance": "HIGH", "country": "EU"},
        {"event": "GDP Growth Rate q/q", "day": 20, "importance": "MEDIUM", "country": "EU"},
        # UK Events
        {"event": "BOE Interest Rate Decision", "day": 6, "importance": "HIGH", "country": "GB"},
        {"event": "CPI (Consumer Price Index) y/y", "day": 15, "importance": "HIGH", "country": "GB"},
        {"event": "GDP Growth Rate q/q", "day": 22, "importance": "MEDIUM", "country": "GB"},
        {"event": "Unemployment Rate", "day": 17, "importance": "MEDIUM", "country": "GB"},
        # Japan Events
        {"event": "BOJ Interest Rate Decision", "day": 20, "importance": "HIGH", "country": "JP"},
        {"event": "GDP Growth Rate q/q", "day": 15, "importance": "MEDIUM", "country": "JP"},
        {"event": "CPI (Consumer Price Index) y/y", "day": 19, "importance": "MEDIUM", "country": "JP"},
        # Australia Events
        {"event": "RBA Interest Rate Decision", "day": 3, "importance": "HIGH", "country": "AU"},
        {"event": "Unemployment Rate", "day": 19, "importance": "MEDIUM", "country": "AU"},
        # Canada Events
        {"event": "BOC Interest Rate Decision", "day": 8, "importance": "HIGH", "country": "CA"},
        {"event": "CPI (Consumer Price Index) m/m", "day": 16, "importance": "MEDIUM", "country": "CA"},
        # Switzerland
        {"event": "SNB Interest Rate Decision", "day": 12, "importance": "HIGH", "country": "CH"},
        # New Zealand
        {"event": "RBNZ Interest Rate Decision", "day": 9, "importance": "MEDIUM", "country": "NZ"},
        # China
        {"event": "GDP Growth Rate y/y", "day": 15, "importance": "HIGH", "country": "CN"},
        {"event": "PMI Manufacturing", "day": 1, "importance": "MEDIUM", "country": "CN"},
    ]

    events = []
    for month_offset in range(2):
        month = current_month + month_offset
        year = current_year
        if month > 12:
            month -= 12
            year += 1

        for item in recurring:
            try:
                event_date = datetime(year, month, min(item["day"], 28), 14, 30, tzinfo=timezone.utc)
                events.append({
                    "event": item["event"],
                    "time": event_date.isoformat(),
                    "country": item["country"],
                    "impact": item["importance"].lower(),
                    "actual": None,
                    "estimate": None,
                    "prev": None,
                })
            except ValueError:
                continue

    print(f"  📋 Generated {len(events)} global fallback events")
    return events


def process_events(raw_events: list[dict]) -> list[dict]:
    """Process raw events: match rules, add analysis, affected assets, source, description."""
    processed = []
    for event in raw_events:
        event_name = event.get("event", "")
        if not event_name:
            continue

        rule = match_event(event_name)
        country = event.get("country", "US")
        currency = get_currency(country)

        # Importance
        raw_impact = event.get("impact", "medium").upper()
        if raw_impact in ("HIGH", "MEDIUM", "LOW"):
            importance = raw_impact
        elif rule:
            importance = rule["importance"]
        else:
            importance = "MEDIUM"

        # Analysis + assets
        if rule:
            analysis = rule["analysis"]
            target_market = rule["target_market"]
            affected_assets = rule["affected_assets"]
        else:
            analysis = DEFAULT_ANALYSIS.get(importance, DEFAULT_ANALYSIS["MEDIUM"])
            target_market = "All Markets"
            affected_assets = currency

        # Actual/forecast/previous
        actual_raw = event.get("actual")
        forecast_raw = event.get("estimate")
        prev_raw = event.get("prev")

        actual = str(actual_raw) if actual_raw is not None else None
        forecast = str(forecast_raw) if forecast_raw is not None else None
        previous = str(prev_raw) if prev_raw is not None else None

        # Status
        status = determine_status(actual_raw)

        # Description & Source
        description = get_description(event_name)
        source_name, source_url = get_source(event_name)

        # ── CRITICAL: Normalize event time to UTC ISO 8601 ──
        # Finnhub returns time as "2026-08-17 13:30:00" (no timezone)
        # We must append +00:00 to tell Supabase it's UTC
        raw_time = event.get("time", "")
        try:
            if "T" in raw_time:
                # Already ISO format
                et = datetime.fromisoformat(raw_time.replace("Z", "+00:00"))
            elif raw_time:
                # Finnhub format: "2026-08-17 13:30:00"
                et = datetime.strptime(raw_time, "%Y-%m-%d %H:%M:%S").replace(tzinfo=timezone.utc)
            else:
                et = datetime.now(timezone.utc)
            event_time_iso = et.isoformat()
            data_period = et.strftime("%b %Y")
        except Exception:
            event_time_iso = datetime.now(timezone.utc).isoformat()
            data_period = None

        record = {
            "event_name": event_name,
            "event_time": event_time_iso,
            "country": country,
            "currency": currency,
            "actual": actual,
            "forecast": forecast,
            "previous": previous,
            "previous_revised": None,
            "target_market": target_market,
            "affected_assets": affected_assets,
            "impact_analysis": analysis,
            "importance": importance,
            "status": status,
            "description": description,
            "data_period": data_period,
            "official_source_name": source_name,
            "official_source_url": source_url,
            "unit": event.get("unit"),
        }
        processed.append(record)

    print(f"  🧠 Processed {len(processed)} events with analysis + metadata")
    return processed


def run_calendar_pipeline():
    """Main entry point: fetch → analyze → save to Supabase."""
    from utils.supabase_client import get_client

    print("\n📅 Fetching global economic calendar...")

    now = datetime.now(timezone.utc)
    from_date = now.strftime("%Y-%m-%d")
    to_date = (now + timedelta(days=30)).strftime("%Y-%m-%d")

    raw_events = fetch_finnhub_calendar(from_date, to_date)
    if not raw_events:
        raw_events = generate_fallback_events()

    if not raw_events:
        print("  ⚠️ No events to process")
        return

    processed = process_events(raw_events)
    if not processed:
        print("  ⚠️ No events after processing")
        return

    client = get_client()
    try:
        client.table("economic_calendar").upsert(
            processed, on_conflict="event_name,event_time"
        ).execute()
        print(f"  ✅ Saved {len(processed)} events to Supabase")
    except Exception as e:
        print(f"  ❌ Supabase save error: {e}")
        raise
