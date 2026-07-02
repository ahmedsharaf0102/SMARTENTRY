"""
SmartEntry Analysis Runner — GitHub Actions Edition
Standalone script that runs the full analysis pipeline without Flask.

Usage:
    python analysis/run_analysis.py

Required environment variables:
    SUPABASE_URL          — Supabase project URL
    SUPABASE_SERVICE_KEY  — Supabase service role key (bypasses RLS)
    FRED_API_KEY          — FRED API key (for gold macro data)
"""
import os
import sys
import time
import traceback
from pathlib import Path
from datetime import datetime, timezone

# ── Ensure correct imports ──────────────────────────────────
# When running as `python analysis/run_analysis.py` from repo root,
# the `analysis/` directory must be on sys.path so that
# `engine.*` and `utils.*` resolve correctly.
SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

# Load .env for local development (GitHub Actions uses env secrets instead)
from dotenv import load_dotenv
load_dotenv(dotenv_path=SCRIPT_DIR / '.env')

# ── Validate environment ────────────────────────────────────
SUPABASE_URL = os.getenv('SUPABASE_URL') or os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_KEY') or os.getenv('SUPABASE_SERVICE_ROLE_KEY')
FRED_KEY     = os.getenv('FRED_API_KEY')


def print_banner():
    now = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')
    print('=' * 60)
    print(f'🚀 SmartEntry Analysis Runner')
    print(f'⏰ {now}')
    print('=' * 60)
    print(f'   SUPABASE_URL : {"✅ " + SUPABASE_URL[:30] + "..." if SUPABASE_URL else "❌ NOT SET"}')
    print(f'   SUPABASE_KEY : {"✅ set (service_role)" if SUPABASE_KEY else "❌ NOT SET"}')
    print(f'   FRED_API_KEY : {"✅ set" if FRED_KEY else "❌ NOT SET"}')
    print('=' * 60)


def check_env():
    """Fail fast if critical secrets are missing."""
    missing = []
    if not SUPABASE_URL:
        missing.append('SUPABASE_URL')
    if not SUPABASE_KEY:
        missing.append('SUPABASE_SERVICE_KEY')
    if not FRED_KEY:
        missing.append('FRED_API_KEY')

    if missing:
        print(f'\n❌ FATAL: Missing required environment variables: {", ".join(missing)}')
        print('   Set them as GitHub Secrets or in analysis/.env for local dev.')
        sys.exit(1)


def main():
    print_banner()
    check_env()

    # Import analysis functions *after* sys.path is set
    from engine.indicators import calculate_indicators
    from engine.signals import generate_signals
    from engine.gold_signals import generate_gold_signal
    from utils.binance_client import fetch_klines
    from utils.supabase_client import (
        upsert_coins,
        insert_signals,
        insert_candles,
        upsert_gold_macro,
    )

    # ── Default coin list (same as app.py) ──────────────────
    DEFAULT_COINS = [
        'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT',
        'ADAUSDT', 'DOGEUSDT', 'AVAXUSDT', 'DOTUSDT', 'LINKUSDT',
        'MATICUSDT', 'SHIBUSDT', 'LTCUSDT', 'ATOMUSDT', 'NEARUSDT',
        'UNIUSDT', 'APTUSDT', 'ARBUSDT', 'OPUSDT', 'SUIUSDT',
        'PEPEUSDT', 'WIFUSDT', 'INJUSDT', 'TIAUSDT', 'SEIUSDT',
        'FETUSDT', 'RENDERUSDT', 'STXUSDT', 'IMXUSDT', 'RUNEUSDT',
    ]

    start_time = time.time()
    has_errors = False

    # ═══════════════════════════════════════════════════════
    # PHASE 1 — Crypto Analysis
    # ═══════════════════════════════════════════════════════
    print('\n' + '─' * 60)
    print('📊 PHASE 1: Crypto Analysis')
    print('─' * 60)

    analyzed = 0
    signals_count = 0
    crypto_errors = []

    # Register coins
    coins_data = [
        {
            'symbol': s,
            'base_asset': s.replace('USDT', ''),
            'quote_asset': 'USDT',
            'is_active': True,
        }
        for s in DEFAULT_COINS
    ]

    try:
        upsert_coins(coins_data)
    except Exception as e:
        crypto_errors.append(f'Coins upsert failed: {e}')
        print(f'❌ Coins upsert error: {e}')

    # Analyze each coin
    for symbol in DEFAULT_COINS:
        try:
            print(f'\n📊 Analyzing {symbol}...')

            # Fetch 1h candles
            klines = fetch_klines(symbol, interval='1h', limit=100)
            if not klines or len(klines) < 50:
                print(f'  ⚠️ Not enough data for {symbol}')
                continue

            # Save last 20 candles
            candle_records = [
                {
                    'symbol': symbol,
                    'interval': '1h',
                    'open_time': k['open_time'],
                    'open': k['open'],
                    'high': k['high'],
                    'low': k['low'],
                    'close': k['close'],
                    'volume': k['volume'],
                    'close_time': k.get('close_time'),
                }
                for k in klines[-20:]
            ]

            try:
                insert_candles(candle_records)
            except Exception as e:
                print(f'  ⚠️ Candle insert error: {e}')

            # Calculate indicators
            indicators = calculate_indicators(klines)
            if not indicators:
                print(f'  ⚠️ Could not calculate indicators for {symbol}')
                continue

            # Generate & insert signals
            signals = generate_signals(symbol, indicators, indicators['current_price'])
            if signals:
                insert_signals(signals)
                signals_count += len(signals)
                for s in signals:
                    emoji = '🟢' if s['action'] == 'BUY' else '🟡' if s['action'] == 'WATCH' else '🔴'
                    print(f'  {emoji} {s["action"]} — {s["signal_type"]} (strength: {s["strength"]})')
            else:
                print(f'  ⚪ No signals for {symbol}')

            analyzed += 1

        except Exception as e:
            crypto_errors.append(f'{symbol}: {e}')
            print(f'  ❌ Error: {e}')
            traceback.print_exc()

    print(f'\n✅ Crypto done: {analyzed} coins analyzed, {signals_count} signals generated')
    if crypto_errors:
        has_errors = True
        print(f'⚠️  Crypto errors: {len(crypto_errors)}')
        for err in crypto_errors:
            print(f'   • {err}')

    # ═══════════════════════════════════════════════════════
    # PHASE 2 — Gold Analysis
    # ═══════════════════════════════════════════════════════
    print('\n' + '─' * 60)
    print('🥇 PHASE 2: Gold Analysis')
    print('─' * 60)

    try:
        signal = generate_gold_signal()
        if signal:
            # Register XAUUSD
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
                    'data': {
                        k: v.get('current') if isinstance(v, dict) else v
                        for k, v in signal['details'].get('macro_breakdown', {}).items()
                    },
                    'scores': {
                        k: v.get('score', 0) if isinstance(v, dict) else 0
                        for k, v in signal['details'].get('macro_breakdown', {}).items()
                    },
                }
                try:
                    upsert_gold_macro(macro_record)
                except Exception as e:
                    print(f'  ⚠️ Gold macro save error: {e}')

            print('✅ Gold analysis complete')
        else:
            print('⚠️  Gold signal returned None')

    except Exception as e:
        has_errors = True
        print(f'❌ Gold analysis failed: {e}')
        traceback.print_exc()

    # ═══════════════════════════════════════════════════════
    # SUMMARY
    # ═══════════════════════════════════════════════════════
    elapsed = round(time.time() - start_time, 1)
    print('\n' + '=' * 60)
    print(f'🏁 All done in {elapsed}s')
    print(f'   Crypto: {analyzed}/{len(DEFAULT_COINS)} coins, {signals_count} signals')
    print(f'   Errors: {"Yes ⚠️" if has_errors else "None ✅"}')
    print('=' * 60)

    # Exit with non-zero if there were critical errors
    # (partial failures like a single coin failing are tolerated)
    if analyzed == 0 and len(DEFAULT_COINS) > 0:
        print('\n❌ CRITICAL: No coins were analyzed at all. Exiting with code 1.')
        sys.exit(1)

    sys.exit(0)


if __name__ == '__main__':
    main()
