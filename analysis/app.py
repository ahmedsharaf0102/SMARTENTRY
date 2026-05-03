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

# Debug: confirm env vars loaded
print(f"📂 Loading .env from: {ENV_PATH}")
print(f"   SUPABASE_URL: {'✅ set' if os.getenv('SUPABASE_URL') else '❌ NOT SET'}")
print(f"   SUPABASE_SERVICE_KEY: {'✅ set' if os.getenv('SUPABASE_SERVICE_KEY') else '❌ NOT SET'}")
print(f"   FRED_API_KEY: {'✅ set' if os.getenv('FRED_API_KEY') else '❌ NOT SET'}")

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

    if os.environ.get('SUPABASE_URL'):
        print("🚀 Running initial crypto analysis...")
        run_analysis()

        print("\n🥇 Running gold analysis...")
        run_gold_analysis()

        print("\n🌐 Starting Flask server...")
    else:
        print("⚠️ SUPABASE_URL not set — running Flask server only")

    app.run(host='0.0.0.0', port=port, debug=False)
