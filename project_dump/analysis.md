# Folder: analysis

Generated from SmartEntry project.
Secrets are automatically redacted.


---

## File: analysis\app.py

```python
"""
SmartEntry Analysis Engine
Main entry point — fetches data from Binance, calculates indicators,
generates signals, and writes everything to Supabase.

Can be run:
  - Directly: python app.py
  - As Flask API: serves /analyze and /health endpoints
  - Via n8n: triggered by cron every 5 minutes
"""
import os
import json
import traceback
from pathlib import Path
from flask import Flask, jsonify
from dotenv import load_dotenv

# Always load .env from the same directory as this script
ENV_PATH = Path(__file__).resolve().parent / '.env'
load_dotenv(dotenv_path=ENV_PATH)

# Resolve env var aliases (accept both Next.js and Python naming)
SUPABASE_URL = os.getenv('SUPABASE_URL') or os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_KEY') or os.getenv('SUPABASE_SERVICE_ROLE_KEY')
FRED_KEY = os.getenv('FRED_API_KEY')

print(f"📂 Loading .env from: {ENV_PATH}")
print(f"   SUPABASE_URL: {'✅ ' + SUPABASE_URL[:30] + '...' if SUPABASE_URL else '❌ NOT SET'}")
print(f"   SUPABASE_KEY: {'✅ set (service_role)' if SUPABASE_KEY else '❌ NOT SET'}")
print(f"   FRED_API_KEY: {'✅ set' if FRED_KEY else '❌ NOT SET'}")

from engine.indicators import calculate_indicators
from engine.signals import generate_signals
from engine.gold_signals import generate_gold_signal
from utils.binance_client import fetch_klines, get_top_coins
from utils.supabase_client import upsert_coins, insert_signals, insert_candles, upsert_gold_macro

app = Flask(__name__)

# ── Top coins to track ──────────────────────────────────
DEFAULT_COINS = [
    'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT',
    'ADAUSDT', 'DOGEUSDT', 'AVAXUSDT', 'DOTUSDT', 'LINKUSDT',
    'MATICUSDT', 'SHIBUSDT', 'LTCUSDT', 'ATOMUSDT', 'NEARUSDT',
    'UNIUSDT', 'APTUSDT', 'ARBUSDT', 'OPUSDT', 'SUIUSDT',
    'PEPEUSDT', 'WIFUSDT', 'INJUSDT', 'TIAUSDT', 'SEIUSDT',
    'FETUSDT', 'RENDERUSDT', 'STXUSDT', 'IMXUSDT', 'RUNEUSDT',
]


def run_analysis(symbols: list[str] | None = None) -> dict:
    """
    Run the full analysis pipeline:
    1. Fetch OHLCV data from Binance
    2. Calculate technical indicators
    3. Generate signals
    4. Write everything to Supabase
    """
    symbols = symbols or DEFAULT_COINS
    results = {
        'analyzed': 0,
        'signals_generated': 0,
        'errors': [],
        'signals': [],
    }

    # Step 1: Register coins in Supabase
    coins_data = []
    for symbol in symbols:
        base = symbol.replace('USDT', '')
        coins_data.append({
            'symbol': symbol,
            'base_asset': base,
            'quote_asset': 'USDT',
            'is_active': True,
        })

    try:
        upsert_coins(coins_data)
    except Exception as e:
        results['errors'].append(f"Coins upsert failed: {str(e)}")
        print(f"❌ Coins upsert error: {e}")

    # Step 2: Analyze each coin
    for symbol in symbols:
        try:
            print(f"\n📊 Analyzing {symbol}...")

            # Fetch 1h candles (100 candles = ~4 days of data)
            klines = fetch_klines(symbol, interval='1h', limit=100)
            if not klines or len(klines) < 50:
                print(f"  ⚠️ Not enough data for {symbol}")
                continue

            # Save candles to Supabase
            candle_records = []
            for k in klines[-20:]:  # Save last 20 candles
                candle_records.append({
                    'symbol': symbol,
                    'interval': '1h',
                    'open_time': k['open_time'],
                    'open': k['open'],
                    'high': k['high'],
                    'low': k['low'],
                    'close': k['close'],
                    'volume': k['volume'],
                    'close_time': k.get('close_time'),
                })

            try:
                insert_candles(candle_records)
            except Exception as e:
                print(f"  ⚠️ Candle insert error: {e}")

            # Calculate indicators
            indicators = calculate_indicators(klines)
            if not indicators:
                print(f"  ⚠️ Could not calculate indicators for {symbol}")
                continue

            # Generate signals
            signals = generate_signals(symbol, indicators, indicators['current_price'])

            if signals:
                insert_signals(signals)
                results['signals'].extend(signals)
                results['signals_generated'] += len(signals)
                for s in signals:
                    emoji = '🟢' if s['action'] == 'BUY' else '🟡' if s['action'] == 'WATCH' else '🔴'
                    print(f"  {emoji} {s['action']} — {s['signal_type']} (strength: {s['strength']})")
            else:
                print(f"  ⚪ No signals for {symbol}")

            results['analyzed'] += 1

        except Exception as e:
            error_msg = f"{symbol}: {str(e)}"
            results['errors'].append(error_msg)
            print(f"  ❌ Error: {e}")
            traceback.print_exc()

    print(f"\n{'='*50}")
    print(f"✅ Analysis complete: {results['analyzed']} coins, {results['signals_generated']} signals")
    if results['errors']:
        print(f"⚠️ Errors: {len(results['errors'])}")
    print(f"{'='*50}")

    return results


def run_gold_analysis() -> dict | None:
    """Run gold-specific analysis (macro + technical)."""
    try:
        signal = generate_gold_signal()
        if signal:
            # Register XAUUSD as a coin
            upsert_coins([{
                'symbol': 'XAUUSD',
                'base_asset': 'XAU',
                'quote_asset': 'USD',
                'is_active': True,
            }])
            insert_signals([signal])

            # Save macro data for frontend
            if signal['details'].get('macro_breakdown'):
                macro_record = {
                    'macro_score': signal['details']['macro_score'],
                    'tech_score': signal['details']['tech_score'],
                    'total_score': signal['details']['total_score'],
                    'data': {k: v.get('current') if isinstance(v, dict) else v
                             for k, v in signal['details'].get('macro_breakdown', {}).items()},
                    'scores': {k: v.get('score', 0) if isinstance(v, dict) else 0
                               for k, v in signal['details'].get('macro_breakdown', {}).items()},
                }
                try:
                    upsert_gold_macro(macro_record)
                except Exception as e:
                    print(f'  ⚠️ Gold macro save error: {e}')

            return signal
    except Exception as e:
        print(f'  ❌ Gold analysis error: {e}')
        import traceback
        traceback.print_exc()
    return None


# ── Flask Routes ────────────────────────────────────────

@app.route('/health')
def health():
    return jsonify({'status': 'ok', 'service': 'smartentry-analysis'})


@app.route('/analyze', methods=['POST'])
def analyze():
    """Trigger analysis — called by n8n cron."""
    try:
        results = run_analysis()
        return jsonify({
            'success': True,
            'analyzed': results['analyzed'],
            'signals': results['signals_generated'],
            'errors': len(results['errors']),
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/analyze/<symbol>', methods=['GET'])
def analyze_single(symbol: str):
    """Analyze a single coin."""
    symbol = symbol.upper()
    if not symbol.endswith('USDT'):
        symbol += 'USDT'
    try:
        results = run_analysis([symbol])
        return jsonify({
            'success': True,
            'symbol': symbol,
            'signals': results['signals'],
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ── CLI Mode ─────────────────────────────────────────────

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))

    supabase_url = os.getenv('SUPABASE_URL') or os.getenv('NEXT_PUBLIC_SUPABASE_URL')
    if supabase_url:
        print("🚀 Running initial crypto analysis...")
        run_analysis()

        print("\n🥇 Running gold analysis...")
        run_gold_analysis()

        print("\n🌐 Starting Flask server...")
    else:
        print("⚠️ SUPABASE_URL not set — running Flask server only")

    app.run(host='0.0.0.0', port=port, debug=False)

```

---

## File: analysis\engine\__init__.py

```python
# Analysis Engine

```

---

## File: analysis\engine\gold_macro.py

```python
"""
Gold Macro Analysis Engine — FRED API
Fetches 9 macroeconomic indicators and scores them for gold signals.
"""
import os
import requests
import pandas as pd
from datetime import datetime, timedelta

FRED_API_KEY = os.getenv('FRED_API_KEY', '')
FRED_BASE = 'https://api.stlouisfed.org/fred/series/observations'

# FRED series IDs
SERIES = {
    'fed_rate': 'FEDFUNDS',
    'cpi': 'CPIAUCSL',
    'dxy': 'DTWEXBGS',
    'treasury_10y': 'DGS10',
    'treasury_2y': 'DGS2',
    'real_yield': 'DFII10',
    'vix': 'VIXCLS',
    'm2': 'M2SL',
    'unemployment': 'UNRATE',
}


def fetch_fred_series(series_id: str, limit: int = 5) -> list[float]:
    """Fetch the latest observations from a FRED series."""
    try:
        params = {
            'series_id': series_id,
            'api_key': FRED_API_KEY,
            'file_type': 'json',
            'sort_order': 'desc',
            'limit': limit,
        }
        res = requests.get(FRED_BASE, params=params, timeout=10)
        data = res.json().get('observations', [])
        values = []
        for obs in data:
            try:
                values.append(float(obs['value']))
            except (ValueError, TypeError):
                continue
        return values
    except Exception as e:
        print(f'  ⚠️ FRED error for {series_id}: {e}')
        return []


def get_all_macro_data() -> dict:
    """Fetch all macro indicators from FRED."""
    if not FRED_API_KEY:
        print('  ❌ FRED_API_KEY not set')
        return {}

    data = {}
    for key, series_id in SERIES.items():
        values = fetch_fred_series(series_id, limit=5)
        if values:
            data[key] = {
                'current': values[0],
                'previous': values[1] if len(values) > 1 else None,
                'trend': 'rising' if len(values) > 1 and values[0] > values[1] else 'falling',
            }
            print(f'  📊 {key}: {values[0]}')
        else:
            data[key] = None
    return data


def calculate_macro_score(data: dict) -> tuple[int, dict]:
    """
    Score macro indicators for gold (max 70 points).
    Returns (score, breakdown).
    """
    score = 0
    breakdown = {}

    # 1. Fed Rate — falling or paused = bullish for gold (+10)
    fed = data.get('fed_rate')
    if fed and fed.get('current') is not None:
        if fed['trend'] == 'falling':
            score += 10
            breakdown['fed_rate'] = {'score': 10, 'reason': 'Rate falling — bullish'}
        elif fed['previous'] and fed['current'] == fed['previous']:
            score += 5
            breakdown['fed_rate'] = {'score': 5, 'reason': 'Rate paused'}
        else:
            breakdown['fed_rate'] = {'score': 0, 'reason': 'Rate rising — bearish'}

    # 2. CPI — rising inflation > 3% = bullish (+10)
    cpi = data.get('cpi')
    if cpi and cpi.get('current') is not None:
        if cpi['previous']:
            yoy = ((cpi['current'] - cpi['previous']) / cpi['previous']) * 100 * 12
            if yoy > 3:
                score += 10
                breakdown['cpi'] = {'score': 10, 'reason': f'Inflation {yoy:.1f}% — bullish'}
            elif yoy > 2:
                score += 5
                breakdown['cpi'] = {'score': 5, 'reason': f'Inflation {yoy:.1f}% — moderate'}
            else:
                breakdown['cpi'] = {'score': 0, 'reason': f'Inflation {yoy:.1f}% — low'}

    # 3. DXY — dollar weakening = bullish (+10)
    dxy = data.get('dxy')
    if dxy and dxy.get('current') is not None:
        if dxy['trend'] == 'falling':
            score += 10
            breakdown['dxy'] = {'score': 10, 'reason': 'Dollar weakening — bullish'}
        else:
            breakdown['dxy'] = {'score': 0, 'reason': 'Dollar strengthening — bearish'}

    # 4. Treasury 10Y — yields falling = bullish (+7)
    t10 = data.get('treasury_10y')
    if t10 and t10.get('current') is not None:
        if t10['trend'] == 'falling':
            score += 7
            breakdown['treasury_10y'] = {'score': 7, 'reason': 'Yields falling — bullish'}
        else:
            breakdown['treasury_10y'] = {'score': 0, 'reason': 'Yields rising — bearish'}

    # 5. Yield curve inversion (2Y > 10Y) = bullish (+5)
    t2 = data.get('treasury_2y')
    if t2 and t10 and t2.get('current') and t10.get('current'):
        if t2['current'] > t10['current']:
            score += 5
            breakdown['treasury_2y'] = {'score': 5, 'reason': 'Yield curve inverted — recession risk'}
        else:
            breakdown['treasury_2y'] = {'score': 0, 'reason': 'Normal yield curve'}

    # 6. Real yields — negative or falling = bullish (+8)
    ry = data.get('real_yield')
    if ry and ry.get('current') is not None:
        if ry['current'] < 0:
            score += 8
            breakdown['real_yield'] = {'score': 8, 'reason': f'Real yield {ry["current"]:.2f}% — negative'}
        elif ry['trend'] == 'falling':
            score += 4
            breakdown['real_yield'] = {'score': 4, 'reason': 'Real yields falling'}
        else:
            breakdown['real_yield'] = {'score': 0, 'reason': 'Real yields positive & rising'}

    # 7. VIX — fear > 20 = bullish (+5)
    vix = data.get('vix')
    if vix and vix.get('current') is not None:
        if vix['current'] > 25:
            score += 5
            breakdown['vix'] = {'score': 5, 'reason': f'VIX {vix["current"]:.1f} — high fear'}
        elif vix['current'] > 20:
            score += 3
            breakdown['vix'] = {'score': 3, 'reason': f'VIX {vix["current"]:.1f} — moderate fear'}
        else:
            breakdown['vix'] = {'score': 0, 'reason': f'VIX {vix["current"]:.1f} — calm'}

    # 8. M2 — expanding = bullish (+8)
    m2 = data.get('m2')
    if m2 and m2.get('current') is not None:
        if m2['trend'] == 'rising':
            score += 8
            breakdown['m2'] = {'score': 8, 'reason': 'M2 expanding — money printing'}
        else:
            breakdown['m2'] = {'score': 0, 'reason': 'M2 contracting'}

    # 9. Unemployment — rising = bullish (+7)
    unemp = data.get('unemployment')
    if unemp and unemp.get('current') is not None:
        if unemp['trend'] == 'rising':
            score += 7
            breakdown['unemployment'] = {'score': 7, 'reason': 'Unemployment rising — recession hedge'}
        else:
            breakdown['unemployment'] = {'score': 0, 'reason': 'Jobs market strong'}

    return score, breakdown

```

---

## File: analysis\engine\gold_signals.py

```python
"""
Gold Signal Engine — Combines Macro (FRED) + Technical (yfinance) scoring.
Max score: 140 (70 macro + 70 technical)
"""
import yfinance as yf
import pandas as pd
import ta as ta_lib
from engine.gold_macro import get_all_macro_data, calculate_macro_score


def get_gold_technical_data() -> pd.DataFrame | None:
    """Fetch gold OHLCV data from Yahoo Finance (GC=F = Gold Futures)."""
    try:
        gold = yf.download('GC=F', period='3mo', interval='1h', progress=False)
        if gold.empty:
            print('  ⚠️ yfinance returned empty data, trying daily...')
            gold = yf.download('GC=F', period='6mo', interval='1d', progress=False)
        if gold.empty:
            return None

        # Flatten MultiIndex columns if present
        if hasattr(gold.columns, 'levels'):
            gold.columns = gold.columns.get_level_values(0)

        gold = gold.reset_index()
        return gold
    except Exception as e:
        print(f'  ❌ yfinance error: {e}')
        return None


def calculate_gold_technical_score(df: pd.DataFrame) -> tuple[int, dict]:
    """
    Calculate technical score for gold (max 70 points).
    Uses the same indicators as crypto but tuned for gold.
    """
    if df is None or len(df) < 50:
        return 0, {'error': 'Insufficient data'}

    close = df['Close']
    high = df['High']
    low = df['Low']
    volume = df['Volume']

    score = 0
    breakdown = {}

    # 1. RSI (max 10)
    rsi_val = ta_lib.momentum.RSIIndicator(close, window=14).rsi().iloc[-1]
    if pd.notna(rsi_val):
        if rsi_val < 35:
            score += 10
            breakdown['rsi'] = {'score': 10, 'value': round(rsi_val, 1), 'reason': 'Oversold'}
        elif rsi_val < 45:
            score += 4
            breakdown['rsi'] = {'score': 4, 'value': round(rsi_val, 1), 'reason': 'Low RSI'}
        else:
            breakdown['rsi'] = {'score': 0, 'value': round(rsi_val, 1), 'reason': 'Neutral/Overbought'}

    # 2. MACD (max 10)
    macd = ta_lib.trend.MACD(close, window_slow=26, window_fast=12, window_sign=9)
    hist = macd.macd_diff()
    if len(hist) >= 2 and pd.notna(hist.iloc[-1]) and pd.notna(hist.iloc[-2]):
        if hist.iloc[-2] < 0 and hist.iloc[-1] > 0:
            score += 10
            breakdown['macd'] = {'score': 10, 'reason': 'Bullish crossover'}
        elif hist.iloc[-1] > 0 and hist.iloc[-1] > hist.iloc[-2]:
            score += 4
            breakdown['macd'] = {'score': 4, 'reason': 'Momentum rising'}
        else:
            breakdown['macd'] = {'score': 0, 'reason': 'Bearish/Flat'}

    # 3. Stochastic RSI (max 7)
    stoch = ta_lib.momentum.StochRSIIndicator(close, window=14, smooth1=3, smooth2=3)
    stoch_k = stoch.stochrsi_k().iloc[-1] * 100
    if pd.notna(stoch_k):
        if stoch_k < 25:
            score += 7
            breakdown['stochrsi'] = {'score': 7, 'value': round(stoch_k, 1), 'reason': 'Oversold'}
        else:
            breakdown['stochrsi'] = {'score': 0, 'value': round(stoch_k, 1), 'reason': 'Not oversold'}

    # 4. EMA 9/21 (max 7)
    ema9 = ta_lib.trend.EMAIndicator(close, window=9).ema_indicator()
    ema21 = ta_lib.trend.EMAIndicator(close, window=21).ema_indicator()
    if pd.notna(ema9.iloc[-1]) and pd.notna(ema21.iloc[-1]):
        if ema9.iloc[-2] <= ema21.iloc[-2] and ema9.iloc[-1] > ema21.iloc[-1]:
            score += 7
            breakdown['ema_cross'] = {'score': 7, 'reason': 'Bullish crossover'}
        elif ema9.iloc[-1] > ema21.iloc[-1]:
            score += 3
            breakdown['ema_cross'] = {'score': 3, 'reason': 'EMA 9 above 21'}
        else:
            breakdown['ema_cross'] = {'score': 0, 'reason': 'Bearish'}

    # 5. SMA 50 (max 7)
    sma50 = ta_lib.trend.SMAIndicator(close, window=50).sma_indicator().iloc[-1]
    price = close.iloc[-1]
    if pd.notna(sma50):
        if price > sma50:
            score += 7
            breakdown['sma50'] = {'score': 7, 'reason': 'Price above SMA 50'}
        else:
            breakdown['sma50'] = {'score': 0, 'reason': 'Price below SMA 50'}

    # 6. ADX (max 7)
    adx = ta_lib.trend.ADXIndicator(high, low, close, window=14)
    adx_val = adx.adx().iloc[-1]
    dmp = adx.adx_pos().iloc[-1]
    dmn = adx.adx_neg().iloc[-1]
    if pd.notna(adx_val):
        if adx_val > 25 and dmp > dmn:
            score += 7
            breakdown['adx'] = {'score': 7, 'value': round(adx_val, 1), 'reason': 'Strong bullish trend'}
        elif adx_val > 25:
            score += 3
            breakdown['adx'] = {'score': 3, 'value': round(adx_val, 1), 'reason': 'Strong trend (bearish)'}
        else:
            breakdown['adx'] = {'score': 0, 'value': round(adx_val, 1), 'reason': 'Weak trend'}

    # 7. Bollinger Bands (max 7)
    bb = ta_lib.volatility.BollingerBands(close, window=20, window_dev=2)
    bb_lower = bb.bollinger_lband().iloc[-1]
    prev_close = close.iloc[-2]
    if pd.notna(bb_lower):
        if prev_close <= bb_lower and price > bb_lower:
            score += 7
            breakdown['bb'] = {'score': 7, 'reason': 'Lower band bounce'}
        else:
            breakdown['bb'] = {'score': 0, 'reason': 'No bounce'}

    # 8. Volume (max 5)
    vol_avg = volume.rolling(20).mean().iloc[-1]
    if pd.notna(vol_avg) and vol_avg > 0:
        ratio = volume.iloc[-1] / vol_avg
        if ratio > 1.5:
            score += 5
            breakdown['volume'] = {'score': 5, 'value': round(ratio, 2), 'reason': 'High volume'}
        else:
            breakdown['volume'] = {'score': 0, 'value': round(ratio, 2), 'reason': 'Normal volume'}

    # 9. OBV (max 5)
    obv = ta_lib.volume.OnBalanceVolumeIndicator(close, volume).on_balance_volume()
    obv_vals = obv.iloc[-3:].tolist()
    if all(pd.notna(v) for v in obv_vals):
        if obv_vals[-1] > obv_vals[0]:
            score += 5
            breakdown['obv'] = {'score': 5, 'reason': 'OBV rising — accumulation'}
        else:
            breakdown['obv'] = {'score': 0, 'reason': 'OBV falling'}

    # 10. VWAP (max 5)
    try:
        vwap = ta_lib.volume.VolumeWeightedAveragePrice(high, low, close, volume)
        vwap_val = vwap.volume_weighted_average_price().iloc[-1]
        if pd.notna(vwap_val) and price > vwap_val:
            score += 5
            breakdown['vwap'] = {'score': 5, 'reason': 'Price above VWAP'}
        else:
            breakdown['vwap'] = {'score': 0, 'reason': 'Below VWAP'}
    except Exception:
        breakdown['vwap'] = {'score': 0, 'reason': 'VWAP unavailable'}

    breakdown['current_price'] = float(price)
    return score, breakdown


def generate_gold_signal() -> dict | None:
    """
    Main gold signal generator — combines macro + technical.
    """
    print('\n🥇 Analyzing Gold (XAUUSD)...')

    # Macro
    print('  📡 Fetching FRED macro data...')
    macro_data = get_all_macro_data()
    macro_score, macro_breakdown = calculate_macro_score(macro_data)
    print(f'  📊 Macro score: {macro_score}/70')

    # Technical
    print('  📈 Fetching gold technical data...')
    gold_df = get_gold_technical_data()
    tech_score, tech_breakdown = calculate_gold_technical_score(gold_df)
    print(f'  📊 Technical score: {tech_score}/70')

    # Combined
    total_score = macro_score + tech_score
    macro_confirmed = macro_score >= 25
    tech_confirmed = tech_score >= 25

    # Decision with downgrade logic
    if total_score >= 100 and macro_confirmed and tech_confirmed:
        action = 'STRONG_BUY'
    elif total_score >= 80 and macro_confirmed and tech_confirmed:
        action = 'BUY'
    elif total_score >= 80 and not macro_confirmed:
        action = 'WATCH'  # Downgraded — weak macro
    elif total_score >= 80 and not tech_confirmed:
        action = 'WATCH'  # Downgraded — bad timing
    elif total_score >= 55:
        action = 'WATCH'
    elif total_score >= 30:
        action = 'WAIT'
    else:
        action = 'AVOID'

    price = tech_breakdown.get('current_price', 0)
    strength = min(total_score, 100)

    signal = {
        'symbol': 'XAUUSD',
        'signal_type': 'GOLD_MACRO_TECHNICAL',
        'action': action,
        'strength': strength,
        'price_at_signal': price,
        'details': {
            'total_score': total_score,
            'max_score': 140,
            'macro_score': macro_score,
            'tech_score': tech_score,
            'macro_confirmed': macro_confirmed,
            'tech_confirmed': tech_confirmed,
            'macro_breakdown': macro_breakdown,
            'tech_breakdown': tech_breakdown,
            'rsi': tech_breakdown.get('rsi', {}).get('value'),
            'adx': tech_breakdown.get('adx', {}).get('value'),
            'volume_ratio': tech_breakdown.get('volume', {}).get('value'),
            'description': f'{action} — Score {total_score}/140 | Macro {macro_score}/70 | Technical {tech_score}/70',
        },
    }

    emoji = '⭐' if action == 'STRONG_BUY' else '🟢' if action == 'BUY' else '🟡' if action == 'WATCH' else '🔴' if action == 'WAIT' else '⛔'
    print(f'  {emoji} Gold: {action} (strength: {strength})')

    return signal

```

---

## File: analysis\engine\indicators.py

```python
"""
Technical Indicators Calculator — v2 (12 Indicators)
Uses the `ta` library (bukosabino) — stable, maintained, PyPI available.

Active Indicators:
  Category A (Momentum): RSI, Stochastic RSI, MACD, MFI
  Category B (Trend): EMA 9/21, SMA 50, ADX, Ichimoku Cloud
  Category C (Volume & Volatility): Volume Ratio, OBV, VWAP, Bollinger Bands
"""
import pandas as pd
import ta


def calculate_indicators(klines: list[dict]) -> dict | None:
    """
    Calculate all 12 technical indicators from kline data.

    Args:
        klines: List of OHLCV dicts with keys: open, high, low, close, volume

    Returns:
        Dictionary with calculated indicator values, or None if insufficient data.
    """
    if len(klines) < 60:
        return None

    df = pd.DataFrame(klines)
    for col in ['open', 'high', 'low', 'close', 'volume']:
        df[col] = pd.to_numeric(df[col], errors='coerce')

    high = df['high']
    low = df['low']
    close = df['close']
    volume = df['volume']

    # ════════════════════════════════════════════════════
    # CATEGORY A: Momentum
    # ════════════════════════════════════════════════════

    # 1. RSI (14-period)
    rsi_ind = ta.momentum.RSIIndicator(close, window=14)
    df['rsi_14'] = rsi_ind.rsi()

    # 2. Stochastic RSI
    stoch_rsi = ta.momentum.StochRSIIndicator(close, window=14, smooth1=3, smooth2=3)
    df['stochrsi_k'] = stoch_rsi.stochrsi_k() * 100  # Scale to 0-100
    df['stochrsi_d'] = stoch_rsi.stochrsi_d() * 100

    # 3. MACD (12, 26, 9)
    macd_ind = ta.trend.MACD(close, window_slow=26, window_fast=12, window_sign=9)
    df['macd'] = macd_ind.macd()
    df['macd_signal'] = macd_ind.macd_signal()
    df['macd_hist'] = macd_ind.macd_diff()

    # 4. MFI (Money Flow Index — 14-period)
    mfi_ind = ta.volume.MFIIndicator(high, low, close, volume, window=14)
    df['mfi_14'] = mfi_ind.money_flow_index()

    # ════════════════════════════════════════════════════
    # CATEGORY B: Trend
    # ════════════════════════════════════════════════════

    # 5. EMA (9, 21)
    df['ema_9'] = ta.trend.EMAIndicator(close, window=9).ema_indicator()
    df['ema_21'] = ta.trend.EMAIndicator(close, window=21).ema_indicator()

    # 6. SMA (9, 21, 50)
    df['sma_9'] = ta.trend.SMAIndicator(close, window=9).sma_indicator()
    df['sma_21'] = ta.trend.SMAIndicator(close, window=21).sma_indicator()
    df['sma_50'] = ta.trend.SMAIndicator(close, window=50).sma_indicator()

    # 7. ADX (14-period)
    adx_ind = ta.trend.ADXIndicator(high, low, close, window=14)
    df['adx_14'] = adx_ind.adx()
    df['dmp_14'] = adx_ind.adx_pos()  # +DI
    df['dmn_14'] = adx_ind.adx_neg()  # -DI

    # 8. Ichimoku Cloud
    ichi = ta.trend.IchimokuIndicator(high, low, window1=9, window2=26, window3=52)
    df['ichi_tenkan'] = ichi.ichimoku_conversion_line()
    df['ichi_kijun'] = ichi.ichimoku_base_line()
    df['ichi_senkou_a'] = ichi.ichimoku_a()
    df['ichi_senkou_b'] = ichi.ichimoku_b()

    # ════════════════════════════════════════════════════
    # CATEGORY C: Volume & Volatility
    # ════════════════════════════════════════════════════

    # 9. Volume SMA (20-period) + Ratio
    df['volume_sma_20'] = volume.rolling(window=20).mean()
    df['volume_ratio'] = volume / df['volume_sma_20']

    # 10. OBV (On-Balance Volume)
    obv_ind = ta.volume.OnBalanceVolumeIndicator(close, volume)
    df['obv'] = obv_ind.on_balance_volume()

    # 11. VWAP
    vwap_ind = ta.volume.VolumeWeightedAveragePrice(high, low, close, volume)
    df['vwap'] = vwap_ind.volume_weighted_average_price()

    # 12. Bollinger Bands (20, 2σ)
    bb = ta.volatility.BollingerBands(close, window=20, window_dev=2)
    df['bb_upper'] = bb.bollinger_hband()
    df['bb_middle'] = bb.bollinger_mavg()
    df['bb_lower'] = bb.bollinger_lband()

    # ════════════════════════════════════════════════════
    # Extract latest values
    # ════════════════════════════════════════════════════
    latest = df.iloc[-1]
    prev = df.iloc[-2]

    result = {
        # Price
        'current_price': float(latest['close']),
        'prev_close': float(prev['close']),

        # ── Category A: Momentum ──────────────────────
        'rsi_14': safe_float(latest.get('rsi_14')),
        'stochrsi_k': safe_float(latest.get('stochrsi_k')),
        'stochrsi_d': safe_float(latest.get('stochrsi_d')),
        'prev_stochrsi_k': safe_float(prev.get('stochrsi_k')),
        'prev_stochrsi_d': safe_float(prev.get('stochrsi_d')),
        'macd': safe_float(latest.get('macd')),
        'macd_signal': safe_float(latest.get('macd_signal')),
        'macd_hist': safe_float(latest.get('macd_hist')),
        'prev_macd_hist': safe_float(prev.get('macd_hist')),
        'mfi_14': safe_float(latest.get('mfi_14')),

        # ── Category B: Trend ─────────────────────────
        'ema_9': safe_float(latest.get('ema_9')),
        'ema_21': safe_float(latest.get('ema_21')),
        'ema_9_cross_21': _detect_crossover(df, 'ema_9', 'ema_21'),
        'sma_9': safe_float(latest.get('sma_9')),
        'sma_21': safe_float(latest.get('sma_21')),
        'sma_50': safe_float(latest.get('sma_50')),
        'adx_14': safe_float(latest.get('adx_14')),
        'dmp_14': safe_float(latest.get('dmp_14')),
        'dmn_14': safe_float(latest.get('dmn_14')),
        'ichi_tenkan': safe_float(latest.get('ichi_tenkan')),
        'ichi_kijun': safe_float(latest.get('ichi_kijun')),
        'ichi_senkou_a': safe_float(latest.get('ichi_senkou_a')),
        'ichi_senkou_b': safe_float(latest.get('ichi_senkou_b')),

        # ── Category C: Volume & Volatility ───────────
        'volume': float(latest['volume']),
        'volume_sma_20': safe_float(latest.get('volume_sma_20')),
        'volume_ratio': safe_float(latest.get('volume_ratio')),
        'obv': safe_float(latest.get('obv')),
        'obv_prev': safe_float(prev.get('obv')),
        'obv_rising': _is_obv_rising(df),
        'vwap': safe_float(latest.get('vwap')),
        'bb_upper': safe_float(latest.get('bb_upper')),
        'bb_middle': safe_float(latest.get('bb_middle')),
        'bb_lower': safe_float(latest.get('bb_lower')),

        # Crossovers
        'sma_9_cross_21': _detect_crossover(df, 'sma_9', 'sma_21'),
    }

    return result


def safe_float(value) -> float | None:
    """Safely convert to float, returning None for NaN/None."""
    if value is None or pd.isna(value):
        return None
    return round(float(value), 8)


def _detect_crossover(df: pd.DataFrame, fast_col: str, slow_col: str) -> str | None:
    """Detect if a crossover happened in the last 2 candles."""
    if fast_col not in df.columns or slow_col not in df.columns:
        return None

    curr_fast = df.iloc[-1].get(fast_col)
    curr_slow = df.iloc[-1].get(slow_col)
    prev_fast = df.iloc[-2].get(fast_col)
    prev_slow = df.iloc[-2].get(slow_col)

    if any(pd.isna(v) for v in [curr_fast, curr_slow, prev_fast, prev_slow]):
        return None

    if prev_fast <= prev_slow and curr_fast > curr_slow:
        return 'bullish'
    if prev_fast >= prev_slow and curr_fast < curr_slow:
        return 'bearish'
    return None


def _is_obv_rising(df: pd.DataFrame) -> bool | None:
    """Check if OBV has been rising over the last 3 periods."""
    if 'obv' not in df.columns:
        return None
    last3 = df['obv'].iloc[-3:].tolist()
    if any(pd.isna(v) for v in last3):
        return None
    return last3[-1] > last3[0]

```

---

## File: analysis\engine\signals.py

```python
"""
Signal Generation Engine — v2 (12-Indicator Convergence System)

Scoring Categories:
  A: Momentum  (RSI, StochRSI, MACD, MFI)        — max 50 pts
  B: Trend     (EMA Cross, SMA 50, ADX, Ichimoku) — max 45 pts
  C: Volume    (Volume Ratio, OBV, VWAP, BB)      — max 40 pts

Total maximum: 135 pts

Decision Thresholds:
  95-135  → STRONG BUY (8+ indicators, all 3 categories)
  75-94   → BUY (6-7 indicators)
  50-74   → WATCH (4-5 indicators)
  25-49   → WAIT (2-3 indicators)
  0-24    → AVOID
"""


def generate_signals(symbol: str, indicators: dict, current_price: float) -> list[dict]:
    """
    Generate trading signals using the 12-indicator convergence system.
    Requires multi-category confirmation for high-confidence signals.
    """
    price = float(current_price)

    # Calculate scores per category
    cat_a = _score_momentum(indicators)
    cat_b = _score_trend(indicators, price)
    cat_c = _score_volume(indicators, price)

    total_score = cat_a['score'] + cat_b['score'] + cat_c['score']
    total_indicators = cat_a['count'] + cat_b['count'] + cat_c['count']
    categories_confirmed = sum([
        1 if cat_a['count'] >= 2 else 0,
        1 if cat_b['count'] >= 2 else 0,
        1 if cat_c['count'] >= 2 else 0,
    ])

    # Apply bearish penalties
    penalties = _bearish_penalties(indicators)
    total_score = max(0, total_score + penalties['penalty'])

    # Determine action
    action = _score_to_action(total_score, categories_confirmed)

    # Determine primary signal type
    signal_type = _determine_signal_type(cat_a, cat_b, cat_c, indicators)

    signals = []

    if total_score > 0:
        signals.append({
            'symbol': symbol,
            'signal_type': signal_type,
            'action': action,
            'strength': min(total_score, 100),  # Normalize to 0-100
            'price_at_signal': price,
            'details': {
                'total_score': total_score,
                'max_score': 135,
                'indicators_agreeing': total_indicators,
                'categories_confirmed': categories_confirmed,
                'category_a_momentum': cat_a,
                'category_b_trend': cat_b,
                'category_c_volume': cat_c,
                'penalties': penalties,
                'rsi': indicators.get('rsi_14'),
                'stochrsi': indicators.get('stochrsi_k'),
                'macd_hist': indicators.get('macd_hist'),
                'mfi': indicators.get('mfi_14'),
                'adx': indicators.get('adx_14'),
                'volume_ratio': indicators.get('volume_ratio'),
                'obv_rising': indicators.get('obv_rising'),
                'description': _build_description(action, total_score, total_indicators, cat_a, cat_b, cat_c),
            },
        })

    return signals


# ═══════════════════════════════════════════════════════════
# Category Scoring Functions
# ═══════════════════════════════════════════════════════════

def _score_momentum(ind: dict) -> dict:
    """Category A: Momentum indicators (max 50 pts)."""
    score = 0
    count = 0
    details = []

    # 1. RSI (max 15)
    rsi = ind.get('rsi_14')
    if rsi is not None:
        if rsi < 30:
            score += 15
            count += 1
            details.append(f'RSI oversold ({rsi:.1f})')
        elif rsi < 40:
            score += 5
            details.append(f'RSI low ({rsi:.1f})')

    # 2. Stochastic RSI (max 10)
    stoch_k = ind.get('stochrsi_k')
    stoch_d = ind.get('stochrsi_d')
    prev_k = ind.get('prev_stochrsi_k')
    prev_d = ind.get('prev_stochrsi_d')
    if stoch_k is not None and stoch_d is not None:
        if stoch_k < 20:
            score += 5
            if prev_k is not None and prev_d is not None:
                if prev_k <= prev_d and stoch_k > stoch_d:
                    score += 5  # Bullish crossover in oversold
                    count += 1
                    details.append(f'StochRSI bullish cross ({stoch_k:.1f})')
                else:
                    count += 1
                    details.append(f'StochRSI oversold ({stoch_k:.1f})')
            else:
                count += 1
                details.append(f'StochRSI oversold ({stoch_k:.1f})')

    # 3. MACD (max 15)
    macd_hist = ind.get('macd_hist')
    prev_hist = ind.get('prev_macd_hist')
    if macd_hist is not None and prev_hist is not None:
        if prev_hist < 0 and macd_hist > 0:
            score += 15
            count += 1
            details.append('MACD bullish crossover')
        elif macd_hist > 0 and macd_hist > prev_hist:
            score += 5
            details.append('MACD momentum rising')

    # 4. MFI (max 10)
    mfi = ind.get('mfi_14')
    if mfi is not None:
        if mfi < 25:
            score += 10
            count += 1
            details.append(f'MFI oversold ({mfi:.1f})')
        elif mfi < 40:
            score += 3
            details.append(f'MFI low ({mfi:.1f})')

    return {'score': score, 'count': count, 'max': 50, 'details': details}


def _score_trend(ind: dict, price: float) -> dict:
    """Category B: Trend indicators (max 45 pts)."""
    score = 0
    count = 0
    details = []

    # 5. EMA 9/21 Cross (max 10)
    ema_cross = ind.get('ema_9_cross_21')
    if ema_cross == 'bullish':
        score += 10
        count += 1
        details.append('EMA 9/21 bullish cross')
    elif ind.get('ema_9') and ind.get('ema_21'):
        if ind['ema_9'] > ind['ema_21']:
            score += 3
            details.append('EMA 9 above 21')

    # 6. SMA 50 (max 10)
    sma_50 = ind.get('sma_50')
    if sma_50 is not None and price > sma_50:
        score += 10
        count += 1
        details.append('Price above SMA 50 (uptrend)')

    # 7. ADX (max 10)
    adx = ind.get('adx_14')
    dmp = ind.get('dmp_14')
    dmn = ind.get('dmn_14')
    if adx is not None:
        if adx > 25:
            score += 5
            if dmp is not None and dmn is not None and dmp > dmn:
                score += 5
                count += 1
                details.append(f'ADX strong bullish trend ({adx:.1f})')
            else:
                count += 1
                details.append(f'ADX strong trend ({adx:.1f})')

    # 8. Ichimoku Cloud (max 15)
    tenkan = ind.get('ichi_tenkan')
    kijun = ind.get('ichi_kijun')
    senkou_a = ind.get('ichi_senkou_a')
    senkou_b = ind.get('ichi_senkou_b')
    if all(v is not None for v in [tenkan, kijun, senkou_a, senkou_b]):
        cloud_top = max(senkou_a, senkou_b)
        if price > cloud_top:
            score += 10
            count += 1
            details.append('Price above Ichimoku cloud')
            if tenkan > kijun:
                score += 5
                details.append('Tenkan > Kijun (bullish)')
        elif price > min(senkou_a, senkou_b):
            score += 3
            details.append('Price inside Ichimoku cloud')

    return {'score': score, 'count': count, 'max': 45, 'details': details}


def _score_volume(ind: dict, price: float) -> dict:
    """Category C: Volume & Volatility indicators (max 40 pts)."""
    score = 0
    count = 0
    details = []

    # 9. Volume Ratio (max 10)
    vol_ratio = ind.get('volume_ratio')
    if vol_ratio is not None:
        if vol_ratio > 2.0:
            score += 10
            count += 1
            details.append(f'Volume spike ({vol_ratio:.1f}x)')
        elif vol_ratio > 1.5:
            score += 5
            count += 1
            details.append(f'Above avg volume ({vol_ratio:.1f}x)')

    # 10. OBV (max 10)
    obv_rising = ind.get('obv_rising')
    if obv_rising is True:
        score += 10
        count += 1
        details.append('OBV rising (accumulation)')

    # 11. VWAP (max 10)
    vwap = ind.get('vwap')
    if vwap is not None and price > vwap:
        score += 10
        count += 1
        details.append('Price above VWAP')

    # 12. Bollinger Bands (max 10)
    bb_lower = ind.get('bb_lower')
    bb_middle = ind.get('bb_middle')
    prev_close = ind.get('prev_close')
    if bb_lower is not None and bb_middle is not None and prev_close is not None:
        if prev_close <= bb_lower and price > bb_lower:
            score += 10
            count += 1
            details.append('BB lower band bounce')
        elif price < bb_middle and price > bb_lower:
            score += 3
            details.append('Price near BB lower')

    return {'score': score, 'count': count, 'max': 40, 'details': details}


def _bearish_penalties(ind: dict) -> dict:
    """Apply penalties for bearish conditions."""
    penalty = 0
    reasons = []

    rsi = ind.get('rsi_14')
    if rsi is not None and rsi > 70:
        penalty -= 15
        reasons.append(f'RSI overbought ({rsi:.1f})')
    if rsi is not None and rsi > 80:
        penalty -= 10
        reasons.append('RSI extreme overbought')

    macd_hist = ind.get('macd_hist')
    prev_hist = ind.get('prev_macd_hist')
    if macd_hist is not None and prev_hist is not None:
        if prev_hist > 0 and macd_hist < 0:
            penalty -= 15
            reasons.append('MACD bearish crossover')

    adx = ind.get('adx_14')
    if adx is not None and adx < 15:
        penalty -= 10
        reasons.append('No clear trend (ADX < 15)')

    return {'penalty': penalty, 'reasons': reasons}


def _score_to_action(score: int, categories_confirmed: int) -> str:
    """Convert score + category count to action."""
    if score >= 95 and categories_confirmed >= 3:
        return 'STRONG_BUY'
    elif score >= 75 and categories_confirmed >= 2:
        return 'BUY'
    elif score >= 50:
        return 'WATCH'
    elif score >= 25:
        return 'WAIT'
    else:
        return 'AVOID'


def _determine_signal_type(cat_a: dict, cat_b: dict, cat_c: dict, ind: dict) -> str:
    """Determine the primary signal type based on which category dominates."""
    if cat_a['count'] >= 3 and cat_b['count'] >= 2 and cat_c['count'] >= 2:
        return 'FULL_CONVERGENCE'

    scores = [
        ('MOMENTUM_SURGE', cat_a['score']),
        ('TREND_REVERSAL', cat_b['score']),
        ('VOLUME_ACCUMULATION', cat_c['score']),
    ]
    scores.sort(key=lambda x: x[1], reverse=True)

    # Check for Ichimoku breakout
    tenkan = ind.get('ichi_tenkan')
    kijun = ind.get('ichi_kijun')
    senkou_a = ind.get('ichi_senkou_a')
    senkou_b = ind.get('ichi_senkou_b')
    price = ind.get('current_price', 0)
    if all(v is not None for v in [tenkan, kijun, senkou_a, senkou_b]):
        if price > max(senkou_a, senkou_b) and tenkan > kijun:
            if cat_c['count'] >= 1:
                return 'ICHIMOKU_BREAKOUT'

    # Check for RSI convergence
    rsi = ind.get('rsi_14')
    if rsi is not None and rsi < 30 and cat_a['count'] >= 2:
        return 'RSI_MOMENTUM_CONVERGENCE'

    return scores[0][0]


def _build_description(action: str, score: int, count: int,
                       cat_a: dict, cat_b: dict, cat_c: dict) -> str:
    """Build human-readable signal description."""
    parts = []
    parts.append(f'{action} — Score {score}/135, {count}/12 indicators agree')

    if cat_a['details']:
        parts.append(f"Momentum: {', '.join(cat_a['details'][:2])}")
    if cat_b['details']:
        parts.append(f"Trend: {', '.join(cat_b['details'][:2])}")
    if cat_c['details']:
        parts.append(f"Volume: {', '.join(cat_c['details'][:2])}")

    return ' | '.join(parts)

```

---

## File: analysis\engine\trends.py

```python
"""
Trend Analysis Module
Detects trend direction using Moving Average analysis.
"""
import pandas as pd


def analyze_trend(klines: list[dict]) -> dict:
    """
    Analyze the overall trend using SMA crossovers and price position.
    
    Returns:
        Dict with trend analysis:
        - direction: 'bullish', 'bearish', or 'neutral'
        - strength: 'strong', 'moderate', or 'weak'
        - details: human-readable description
    """
    if len(klines) < 50:
        return {'direction': 'neutral', 'strength': 'weak', 'details': 'Insufficient data'}

    df = pd.DataFrame(klines)
    df['close'] = pd.to_numeric(df['close'], errors='coerce')

    # Calculate SMAs
    df['sma_9'] = df['close'].rolling(9).mean()
    df['sma_21'] = df['close'].rolling(21).mean()
    df['sma_50'] = df['close'].rolling(50).mean()

    latest = df.iloc[-1]
    price = float(latest['close'])
    sma_9 = float(latest['sma_9']) if not pd.isna(latest['sma_9']) else None
    sma_21 = float(latest['sma_21']) if not pd.isna(latest['sma_21']) else None
    sma_50 = float(latest['sma_50']) if not pd.isna(latest['sma_50']) else None

    if not all([sma_9, sma_21, sma_50]):
        return {'direction': 'neutral', 'strength': 'weak', 'details': 'Insufficient MA data'}

    # Score bullish/bearish signals
    bullish_score = 0
    bearish_score = 0

    # Price vs SMAs
    if price > sma_9:
        bullish_score += 1
    else:
        bearish_score += 1

    if price > sma_21:
        bullish_score += 1
    else:
        bearish_score += 1

    if price > sma_50:
        bullish_score += 2  # Weighted more
    else:
        bearish_score += 2

    # SMA alignment (9 > 21 > 50 = strong uptrend)
    if sma_9 > sma_21 > sma_50:
        bullish_score += 2
    elif sma_9 < sma_21 < sma_50:
        bearish_score += 2

    # Determine trend
    total = bullish_score + bearish_score
    if bullish_score > bearish_score:
        direction = 'bullish'
        ratio = bullish_score / total
    elif bearish_score > bullish_score:
        direction = 'bearish'
        ratio = bearish_score / total
    else:
        direction = 'neutral'
        ratio = 0.5

    # Determine strength
    if ratio >= 0.8:
        strength = 'strong'
    elif ratio >= 0.6:
        strength = 'moderate'
    else:
        strength = 'weak'

    details = f'{strength.capitalize()} {direction} trend — Price {"above" if price > sma_50 else "below"} SMA 50'

    return {
        'direction': direction,
        'strength': strength,
        'bullish_score': bullish_score,
        'bearish_score': bearish_score,
        'price': price,
        'sma_9': round(sma_9, 8),
        'sma_21': round(sma_21, 8),
        'sma_50': round(sma_50, 8),
        'details': details,
    }

```

---

## File: analysis\engine\volume.py

```python
"""
Volume Analysis Module
Detects volume spikes and analyzes volume patterns.
"""
import pandas as pd


def detect_volume_spikes(klines: list[dict], threshold: float = 2.0, window: int = 20) -> dict:
    """
    Detect volume spikes by comparing current volume to the moving average.
    
    Args:
        klines: List of OHLCV dicts
        threshold: Multiplier above average to qualify as a spike (default 2x)
        window: Moving average window (default 20 periods)
    
    Returns:
        Dict with volume analysis results
    """
    if len(klines) < window:
        return {'has_spike': False, 'volume_ratio': 0}

    df = pd.DataFrame(klines)
    df['volume'] = pd.to_numeric(df['volume'], errors='coerce')

    # Calculate volume moving average
    df['vol_ma'] = df['volume'].rolling(window=window).mean()

    latest = df.iloc[-1]
    vol_ma = latest['vol_ma']

    if pd.isna(vol_ma) or vol_ma == 0:
        return {'has_spike': False, 'volume_ratio': 0}

    ratio = float(latest['volume'] / vol_ma)

    return {
        'has_spike': ratio >= threshold,
        'volume_ratio': round(ratio, 2),
        'current_volume': float(latest['volume']),
        'average_volume': round(float(vol_ma), 2),
        'threshold': threshold,
    }


def analyze_volume_trend(klines: list[dict], periods: int = 5) -> str:
    """
    Analyze recent volume trend direction.
    
    Returns: 'increasing', 'decreasing', or 'stable'
    """
    if len(klines) < periods + 1:
        return 'stable'

    df = pd.DataFrame(klines)
    df['volume'] = pd.to_numeric(df['volume'], errors='coerce')

    recent = df['volume'].tail(periods).values
    increasing = sum(1 for i in range(1, len(recent)) if recent[i] > recent[i-1])

    if increasing >= periods * 0.7:
        return 'increasing'
    elif increasing <= periods * 0.3:
        return 'decreasing'
    return 'stable'

```

---

## File: analysis\requirements.txt

```
# SmartEntry Analysis Engine
# Tested on: Python 3.10+ / Ubuntu 22.04

# Web framework
flask==3.0.3
gunicorn==22.0.0

# Data analysis
pandas==2.1.4
numpy>=1.24,<2.0

# Technical indicators (stable, maintained, PyPI)
ta==0.11.0

# Gold — Yahoo Finance for OHLCV data
yfinance>=0.2.30,<1.0

# Gold — FRED API for macro economic data
fredapi>=0.5.0,<1.0

# HTTP client
requests==2.31.0

# Supabase
supabase>=2.0.0,<3.0.0

# Environment
python-dotenv==1.0.1

```

---

## File: analysis\setup-oracle.sh

```bash
#!/bin/bash
# ═══════════════════════════════════════════════════
# SmartEntry — Oracle VM Setup Script
# Run this on your Oracle Cloud VM (Ubuntu/Oracle Linux)
# ═══════════════════════════════════════════════════

set -e

echo "🚀 SmartEntry Analysis Engine — Setup"
echo "════════════════════════════════════════"

# Step 1: Update system
echo "📦 Updating system..."
sudo apt update && sudo apt upgrade -y 2>/dev/null || sudo dnf update -y

# Step 2: Install Python 3.11+ and pip
echo "🐍 Installing Python..."
sudo apt install -y python3 python3-pip python3-venv git 2>/dev/null || \
sudo dnf install -y python3 python3-pip git

# Step 3: Clone the repo
echo "📂 Cloning SmartEntry..."
cd ~
if [ -d "SMARTENTRY" ]; then
  cd SMARTENTRY && git pull
else
  git clone https://github.com/ahmedsharaf0102/SMARTENTRY.git
  cd SMARTENTRY
fi

# Step 4: Setup Python virtual environment
echo "🔧 Setting up virtual environment..."
cd analysis
python3 -m venv venv
source venv/bin/activate

# Step 5: Install dependencies
echo "📦 Installing Python packages..."
pip install --upgrade pip
pip install -r requirements.txt

# Step 6: Create .env file
echo "🔐 Creating .env file..."
if [ ! -f .env ]; then
cat > .env << 'EOF'
# Supabase (service role — bypasses RLS)
SUPABASE_URL=https://jemalqgdlnzftjpymqwz.supabase.co
SUPABASE_SERVICE_KEY=YOUR_SERVICE_ROLE_KEY_HERE

# Flask
PORT=5000
EOF
echo "⚠️  EDIT .env and replace YOUR_SERVICE_ROLE_KEY_HERE with your actual key!"
echo "    Run: nano .env"
else
echo "✅ .env already exists"
fi

# Step 7: Test run
echo ""
echo "════════════════════════════════════════"
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit the .env file:  nano .env"
echo "  2. Add your SUPABASE_SERVICE_KEY"
echo "  3. Run analysis:  source venv/bin/activate && python app.py"
echo "  4. To run in background:  nohup python app.py > analysis.log 2>&1 &"
echo ""
echo "To set up auto-run every 5 minutes, add this cron:"
echo "  crontab -e"
echo "  */5 * * * * cd ~/SMARTENTRY/analysis && source venv/bin/activate && python -c 'from app import run_analysis; run_analysis()' >> ~/analysis.log 2>&1"
echo "════════════════════════════════════════"

```

---

## File: analysis\utils\__init__.py

```python
# Analysis Utils

```

---

## File: analysis\utils\binance_client.py

```python
"""
Binance Public API Client
Fetches OHLCV (candlestick) data from Binance.
No API key required — uses public endpoints only.

Rate Limits:
  - 1200 weight per minute
  - Klines request = ~1 weight per call
  - With 30 coins × 1 call = 30 weight per cycle (well within limits)
"""
import time
import requests

BASE_URL = 'https://api.binance.com'
WEIGHT_USED = 0
WEIGHT_LIMIT = 1200
LAST_RESET = time.time()


def _check_rate_limit():
    """Reset weight counter every 60 seconds."""
    global WEIGHT_USED, LAST_RESET
    now = time.time()
    if now - LAST_RESET >= 60:
        WEIGHT_USED = 0
        LAST_RESET = now


def fetch_klines(symbol: str, interval: str = '1h', limit: int = 100) -> list[dict]:
    """
    Fetch candlestick data from Binance.

    Args:
        symbol: Trading pair (e.g., 'BTCUSDT')
        interval: Candle interval ('1m', '5m', '15m', '1h', '4h', '1d')
        limit: Number of candles (max 1000)

    Returns:
        List of OHLCV dictionaries
    """
    global WEIGHT_USED
    _check_rate_limit()

    if WEIGHT_USED >= WEIGHT_LIMIT - 10:
        print(f"  ⚠️ Rate limit approaching ({WEIGHT_USED}/{WEIGHT_LIMIT}), waiting...")
        time.sleep(60)
        WEIGHT_USED = 0

    url = f"{BASE_URL}/api/v3/klines"
    params = {
        'symbol': symbol,
        'interval': interval,
        'limit': limit,
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        WEIGHT_USED += 1

        if response.status_code != 200:
            print(f"  ❌ Binance API error {response.status_code}: {response.text[:200]}")
            return []

        data = response.json()
        klines = []
        for k in data:
            klines.append({
                'open_time': int(k[0]),
                'open': float(k[1]),
                'high': float(k[2]),
                'low': float(k[3]),
                'close': float(k[4]),
                'volume': float(k[5]),
                'close_time': int(k[6]),
                'quote_volume': float(k[7]),
                'trades': int(k[8]),
            })

        return klines

    except requests.exceptions.Timeout:
        print(f"  ❌ Timeout fetching {symbol}")
        return []
    except Exception as e:
        print(f"  ❌ Error fetching {symbol}: {e}")
        return []


def get_top_coins(limit: int = 30) -> list[str]:
    """
    Get top trading pairs by 24h volume from Binance.

    Returns:
        List of symbol strings (e.g., ['BTCUSDT', 'ETHUSDT', ...])
    """
    global WEIGHT_USED
    _check_rate_limit()

    url = f"{BASE_URL}/api/v3/ticker/24hr"
    try:
        response = requests.get(url, timeout=15)
        WEIGHT_USED += 40  # This endpoint costs 40 weight

        if response.status_code != 200:
            return []

        tickers = response.json()
        # Filter USDT pairs only, sort by volume
        usdt_pairs = [
            t for t in tickers
            if t['symbol'].endswith('USDT')
            and not t['symbol'].endswith('DOWNUSDT')
            and not t['symbol'].endswith('UPUSDT')
            and float(t['quoteVolume']) > 0
        ]

        usdt_pairs.sort(key=lambda x: float(x['quoteVolume']), reverse=True)
        return [t['symbol'] for t in usdt_pairs[:limit]]

    except Exception as e:
        print(f"  ❌ Error fetching top coins: {e}")
        return []


def fetch_current_price(symbol: str) -> float | None:
    """Fetch the current price for a symbol."""
    global WEIGHT_USED
    _check_rate_limit()

    url = f"{BASE_URL}/api/v3/ticker/price"
    try:
        response = requests.get(url, params={'symbol': symbol}, timeout=5)
        WEIGHT_USED += 1
        if response.status_code == 200:
            return float(response.json()['price'])
    except Exception:
        pass
    return None

```

---

## File: analysis\utils\helpers.py

```python
"""Utility helpers for the analysis engine."""


def format_price(price: float) -> str:
    """Format price for display."""
    if price >= 1:
        return f'{price:,.2f}'
    return f'{price:.8f}'


def format_percentage(value: float) -> str:
    """Format percentage with sign."""
    sign = '+' if value >= 0 else ''
    return f'{sign}{value:.2f}%'

```

---

## File: analysis\utils\supabase_client.py

```python
"""
Supabase Client for Python Analysis Engine
Writes signals, coins, and candles to the Supabase database.
Uses the service_role key to bypass RLS (server-side only).
"""
import os
from supabase import create_client, Client


def get_client() -> Client:
    """Create a Supabase client with service role key."""
    # Accept both naming conventions (Next.js style and Python style)
    url = os.environ.get('SUPABASE_URL') or os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_KEY') or os.environ.get('SUPABASE_SERVICE_ROLE_KEY')

    if not url or not key:
        raise ValueError(
            "Supabase credentials not found. Set either:\n"
            "  SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL\n"
            "  SUPABASE_SERVICE_KEY / SUPABASE_SERVICE_ROLE_KEY"
        )

    return create_client(url, key)


def upsert_coins(coins: list[dict]) -> None:
    """Insert or update coin records."""
    client = get_client()
    client.table('coins').upsert(coins, on_conflict='symbol').execute()
    print(f"  ✅ Upserted {len(coins)} coins")


def insert_signals(signals: list[dict]) -> None:
    """Insert new signals into the database."""
    if not signals:
        return
    client = get_client()
    client.table('signals').insert(signals).execute()
    print(f"  ✅ Inserted {len(signals)} signals")


def insert_candles(candles: list[dict]) -> None:
    """Insert candle data (upsert to avoid duplicates)."""
    if not candles:
        return
    client = get_client()
    # Upsert based on unique constraint (symbol, interval, open_time)
    client.table('candles').upsert(
        candles,
        on_conflict='symbol,interval,open_time'
    ).execute()
    print(f"  ✅ Upserted {len(candles)} candles")


def get_latest_signal(symbol: str) -> dict | None:
    """Get the most recent signal for a coin."""
    client = get_client()
    result = client.table('signals') \
        .select('*') \
        .eq('symbol', symbol) \
        .order('created_at', desc=True) \
        .limit(1) \
        .execute()
    return result.data[0] if result.data else None


def upsert_gold_macro(record: dict) -> None:
    """Insert or update gold macro data for the frontend economics tab."""
    if not record:
        return
    client = get_client()
    try:
        client.table('gold_macro').insert(record).execute()
        print(f"  ✅ Saved gold macro data")
    except Exception as e:
        print(f"  ⚠️ Gold macro insert error (table may not exist yet): {e}")


```
