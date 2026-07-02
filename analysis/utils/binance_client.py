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

BASE_URL = 'https://api.mexc.com'
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
    # MEXC uses 60m instead of 1h
    mexc_interval = '60m' if interval == '1h' else interval
    
    params = {
        'symbol': symbol,
        'interval': mexc_interval,
        'limit': limit,
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        WEIGHT_USED += 1

        if response.status_code != 200:
            print(f"  ❌ API error {response.status_code}: {response.text[:200]}")
            return []

        data = response.json()

        # MEXC/Binance may return a dict on error (e.g. {"code": -1121, "msg": "..."})
        if isinstance(data, dict):
            print(f"  ❌ API error for {symbol}: {data.get('msg', data)}")
            return []

        if not isinstance(data, list) or len(data) == 0:
            print(f"  ⚠️ Empty or invalid response for {symbol}")
            return []

        klines = []
        for i, k in enumerate(data):
            # Validate each kline — MEXC returns 7 elements, Binance returns 12
            if not isinstance(k, (list, tuple)) or len(k) < 6:
                if i == 0:
                    print(f"  ⚠️ Malformed kline for {symbol}: {str(k)[:100]}")
                continue

            klines.append({
                'open_time': int(k[0]),
                'open': float(k[1]),
                'high': float(k[2]),
                'low': float(k[3]),
                'close': float(k[4]),
                'volume': float(k[5]),
                'close_time': int(k[6]) if len(k) > 6 else None,
                'quote_volume': float(k[7]) if len(k) > 7 else 0.0,
                'trades': int(k[8]) if len(k) > 8 else 0,
            })

        if len(klines) == 0 and len(data) > 0:
            print(f"  ❌ All {len(data)} klines malformed for {symbol}")
            print(f"      First entry: {str(data[0])[:200]}")

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
