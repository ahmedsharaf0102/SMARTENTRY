"""
SmartEntry Economic Calendar Engine
Rule-based analysis for major economic events.

Uses Finnhub's free economic calendar API to fetch upcoming events,
then matches them against a predefined dictionary of event analysis
to provide Arabic-language market impact insights.
"""

import os
import requests
from datetime import datetime, timezone, timedelta

# ══════════════════════════════════════════════════════════════
# EVENT ANALYSIS DICTIONARY (Rule-Based System)
# Maps event keywords → target market + Arabic impact analysis
# ══════════════════════════════════════════════════════════════

EVENT_RULES = {
    # ── INFLATION ────────────────────────────────────────────
    "CPI": {
        "target_market": "Crypto & Stocks",
        "importance": "HIGH",
        "analysis": "📊 مؤشر التضخم (CPI): إذا جاءت النسبة أعلى من المتوقع → سلبي للأسواق (هبوط الأسهم والكريبتو لأن الفيدرالي قد يرفع الفائدة). أقل من المتوقع → إيجابي جداً (صعود)."
    },
    "Core CPI": {
        "target_market": "Crypto & Stocks",
        "importance": "HIGH",
        "analysis": "📊 التضخم الأساسي (Core CPI): يستثني الغذاء والطاقة. أعلى من المتوقع → سلبي (يشير لتضخم مستمر). أقل → إيجابي للأسواق."
    },
    "PPI": {
        "target_market": "Stocks",
        "importance": "MEDIUM",
        "analysis": "🏭 مؤشر أسعار المنتجين (PPI): يقيس التضخم على مستوى الإنتاج. ارتفاعه يسبق ارتفاع أسعار المستهلك وسلبي للأسهم."
    },
    "PCE": {
        "target_market": "Crypto & Stocks",
        "importance": "HIGH",
        "analysis": "📊 مؤشر PCE (المفضل للفيدرالي): هذا المؤشر يراقبه الفيدرالي عن كثب. أعلى من المتوقع → خطر رفع فائدة → هبوط. أقل → صعود."
    },

    # ── FEDERAL RESERVE ──────────────────────────────────────
    "FOMC": {
        "target_market": "All Markets",
        "importance": "HIGH",
        "analysis": "🏛️ اجتماع الفيدرالي (FOMC): أهم حدث في السوق. تثبيت الفائدة → إيجابي. رفع الفائدة → سلبي جداً لكل الأسواق. خفض الفائدة → إيجابي جداً (صعود قوي)."
    },
    "Fed Interest Rate": {
        "target_market": "All Markets",
        "importance": "HIGH",
        "analysis": "🏛️ قرار الفائدة الأمريكية: رفع الفائدة → الدولار يقوى والأسهم والكريبتو والذهب تهبط. خفض الفائدة → العكس تماماً. تثبيت → استقرار نسبي."
    },
    "Federal Funds Rate": {
        "target_market": "All Markets",
        "importance": "HIGH",
        "analysis": "🏛️ سعر الفائدة الفيدرالي: تغيير الفائدة يؤثر على كل الأسواق العالمية. رفع = سلبي، خفض = إيجابي، تثبيت = حيادي."
    },
    "Fed Chair": {
        "target_market": "All Markets",
        "importance": "HIGH",
        "analysis": "🎤 خطاب رئيس الفيدرالي: أي تلميح لرفع أو خفض الفائدة يحرك الأسواق بقوة. نبرة متشددة (Hawkish) → سلبي. نبرة مرنة (Dovish) → إيجابي."
    },
    "FOMC Minutes": {
        "target_market": "All Markets",
        "importance": "MEDIUM",
        "analysis": "📋 محضر اجتماع الفيدرالي: يكشف تفاصيل نقاشات أعضاء الفيدرالي. قد يعطي إشارات مبكرة عن اتجاه الفائدة القادم."
    },

    # ── EMPLOYMENT ────────────────────────────────────────────
    "Nonfarm Payrolls": {
        "target_market": "Forex & Gold",
        "importance": "HIGH",
        "analysis": "👷 تقرير الوظائف الأمريكية (NFP): وظائف أكثر من المتوقع → الدولار يقوى → الذهب يهبط. وظائف أقل → الدولار يضعف → الذهب يصعد."
    },
    "NFP": {
        "target_market": "Forex & Gold",
        "importance": "HIGH",
        "analysis": "👷 تقرير الوظائف (NFP): أكثر من المتوقع → دولار قوي، ذهب يهبط. أقل من المتوقع → دولار ضعيف، ذهب يصعد."
    },
    "Unemployment Rate": {
        "target_market": "Forex & Gold",
        "importance": "HIGH",
        "analysis": "📉 معدل البطالة: ارتفاع البطالة → ضعف الاقتصاد → الفيدرالي قد يخفض الفائدة → إيجابي للذهب والكريبتو. انخفاض → العكس."
    },
    "Initial Jobless Claims": {
        "target_market": "Forex & Stocks",
        "importance": "MEDIUM",
        "analysis": "📋 طلبات إعانة البطالة: رقم أعلى = سوق عمل ضعيف → سلبي للدولار. رقم أقل = سوق عمل قوي → إيجابي للدولار."
    },
    "ADP": {
        "target_market": "Forex & Stocks",
        "importance": "MEDIUM",
        "analysis": "👥 تقرير ADP للوظائف الخاصة: مؤشر مبكر لتقرير NFP. أعلى من المتوقع → دولار قوي. أقل → دولار ضعيف."
    },

    # ── GDP & GROWTH ─────────────────────────────────────────
    "GDP": {
        "target_market": "Stocks",
        "importance": "HIGH",
        "analysis": "📈 الناتج المحلي الإجمالي (GDP): نمو أعلى من المتوقع → إيجابي للأسهم والدولار. نمو أقل أو سلبي → مخاوف ركود → هبوط."
    },
    "Retail Sales": {
        "target_market": "Stocks",
        "importance": "MEDIUM",
        "analysis": "🛒 مبيعات التجزئة: تعكس إنفاق المستهلك. أعلى من المتوقع → اقتصاد قوي → إيجابي للأسهم. أقل → سلبي."
    },

    # ── HOUSING ───────────────────────────────────────────────
    "Housing Starts": {
        "target_market": "Stocks",
        "importance": "LOW",
        "analysis": "🏠 بدايات البناء: مؤشر على صحة قطاع العقارات. ارتفاع → نشاط اقتصادي. انخفاض → تباطؤ."
    },
    "Existing Home Sales": {
        "target_market": "Stocks",
        "importance": "LOW",
        "analysis": "🏡 مبيعات المنازل القائمة: تعكس حالة سوق العقارات وثقة المستهلك."
    },

    # ── MANUFACTURING ─────────────────────────────────────────
    "ISM Manufacturing": {
        "target_market": "Stocks",
        "importance": "MEDIUM",
        "analysis": "🏭 مؤشر ISM الصناعي: فوق 50 = توسع اقتصادي → إيجابي. تحت 50 = انكماش → سلبي للأسهم."
    },
    "ISM Services": {
        "target_market": "Stocks",
        "importance": "MEDIUM",
        "analysis": "🏢 مؤشر ISM للخدمات: يغطي 75% من الاقتصاد. فوق 50 → توسع → إيجابي. تحت 50 → انكماش → سلبي."
    },
    "PMI": {
        "target_market": "Stocks",
        "importance": "MEDIUM",
        "analysis": "📊 مؤشر مديري المشتريات (PMI): فوق 50 = نمو القطاع. تحت 50 = انكماش. يؤثر على أسهم القطاع الصناعي."
    },

    # ── CONSUMER CONFIDENCE ───────────────────────────────────
    "Consumer Confidence": {
        "target_market": "Stocks",
        "importance": "MEDIUM",
        "analysis": "😊 ثقة المستهلك: ارتفاع → المستهلكين متفائلين → إنفاق أكثر → إيجابي للأسهم. انخفاض → سلبي."
    },
    "Michigan Consumer": {
        "target_market": "Stocks",
        "importance": "MEDIUM",
        "analysis": "📊 مؤشر ميشيغان لثقة المستهلك: يقيس توقعات المستهلكين. ارتفاع → إيجابي للأسهم. انخفاض → سلبي."
    },

    # ── TRADE & DOLLAR ────────────────────────────────────────
    "Trade Balance": {
        "target_market": "Forex",
        "importance": "LOW",
        "analysis": "⚖️ الميزان التجاري: عجز أكبر → ضغط على الدولار. فائض أو عجز أقل → دعم للدولار."
    },
    "Durable Goods": {
        "target_market": "Stocks",
        "importance": "MEDIUM",
        "analysis": "🔧 طلبيات السلع المعمرة: تعكس الاستثمار في المعدات. ارتفاع → ثقة في الاقتصاد → إيجابي للأسهم."
    },

    # ── CRYPTO-SPECIFIC ───────────────────────────────────────
    "Bitcoin": {
        "target_market": "Crypto",
        "importance": "HIGH",
        "analysis": "₿ حدث متعلق بالبيتكوين: راقب التأثير المباشر على سوق الكريبتو. أخبار إيجابية (ETF, تبني مؤسسي) → صعود. تنظيمات سلبية → هبوط."
    },
    "Crypto": {
        "target_market": "Crypto",
        "importance": "MEDIUM",
        "analysis": "🪙 حدث متعلق بالكريبتو: تابع تأثيره على السوق. تنظيمات جديدة، اختراقات، أو تبني مؤسسي كلها تحرك السوق."
    },

    # ── ECB (European) ────────────────────────────────────────
    "ECB": {
        "target_market": "Forex",
        "importance": "HIGH",
        "analysis": "🇪🇺 البنك المركزي الأوروبي: قرارات الفائدة تؤثر على EUR/USD. رفع → اليورو يقوى. خفض → اليورو يضعف."
    },

    # ── BOE (British) ─────────────────────────────────────────
    "BOE": {
        "target_market": "Forex",
        "importance": "HIGH",
        "analysis": "🇬🇧 بنك إنجلترا: قرارات الفائدة تؤثر على GBP/USD. رفع → الجنيه يقوى. خفض → الجنيه يضعف."
    },

    # ── BOJ (Japan) ───────────────────────────────────────────
    "BOJ": {
        "target_market": "Forex",
        "importance": "HIGH",
        "analysis": "🇯🇵 بنك اليابان: أي تغيير في سياسة التحكم في منحنى العائد يؤثر بقوة على USD/JPY والأسواق الآسيوية."
    },
}

# Default analysis for events that don't match any rule
DEFAULT_ANALYSIS = {
    "HIGH": "⚠️ حدث اقتصادي عالي التأثير: تابع النتيجة الفعلية مقارنة بالمتوقع. فرق كبير = تحرك قوي في السوق.",
    "MEDIUM": "📊 حدث اقتصادي متوسط التأثير: قد يسبب تقلبات مؤقتة في السوق.",
    "LOW": "📋 حدث اقتصادي منخفض التأثير: تأثيره محدود عادةً ما لم يكن هناك مفاجأة كبيرة.",
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
    add Arabic analysis, and return Supabase-ready records.
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

        # Get analysis and target market
        if rule:
            analysis = rule["analysis"]
            target_market = rule["target_market"]
        else:
            analysis = DEFAULT_ANALYSIS.get(importance, DEFAULT_ANALYSIS["MEDIUM"])
            target_market = "All Markets"

        # Build record
        record = {
            "event_name": event_name,
            "event_time": event.get("time", datetime.now(timezone.utc).isoformat()),
            "country": event.get("country", "US"),
            "actual": str(event.get("actual", "")) if event.get("actual") is not None else None,
            "forecast": str(event.get("estimate", "")) if event.get("estimate") is not None else None,
            "previous": str(event.get("prev", "")) if event.get("prev") is not None else None,
            "target_market": target_market,
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
