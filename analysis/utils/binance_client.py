"""
Binance API Client
Fetches market data using only FREE public endpoints (no API key required).
"""
import time
import requests

BASE_URL = 'https://api.binance.com'

# Rate limiting: track weight usage
_weight_used = 0
_weight_reset_time = 0


def _check_rate_limit():
    """Simple rate limiter — pause if we're using too much weight."""
    global _weight_used, _weight_reset_time
    now = time.time()
    if now > _weight_reset_time:
        _weight_used = 0
        _weight_reset_time = now + 60  # Reset every minute
    if _weight_used > 1000:  # Leave 200 weight buffer
        sleep_time = _weight_reset_time - now
        if sleep_time > 0:
            time.sleep(sleep_time)
        _weight_used = 0


def fetch_top_pairs(limit: int = 50) -> list[str]:
    """
    Fetch top USDT trading pairs by 24h volume.
    API Weight: 40
    """
    global _weight_used
    _check_rate_limit()

    try:
        resp = requests.get(f'{BASE_URL}/api/v3/ticker/24hr', timeout=10)
        _weight_used += 40
        resp.raise_for_status()
        data = resp.json()

        # Filter USDT pairs with meaningful volume
        usdt_pairs = [
            t for t in data
            if t['symbol'].endswith('USDT')
            and float(t.get('quoteVolume', 0)) > 100000
        ]

        # Sort by quote volume descending
        usdt_pairs.sort(key=lambda x: float(x.get('quoteVolume', 0)), reverse=True)

        return [p['symbol'] for p in usdt_pairs[:limit]]

    except Exception as e:
        print(f'Error fetching top pairs: {e}')
        return []


def fetch_klines(symbol: str, interval: str = '1h', limit: int = 200) -> list[dict]:
    """
    Fetch kline/candlestick data for a symbol.
    API Weight: 2
    
    Args:
        symbol: Trading pair (e.g., 'BTCUSDT')
        interval: Kline interval (e.g., '1h', '4h', '1d')
        limit: Number of candles (max 1000)
    
    Returns:
        List of OHLCV dicts
    """
    global _weight_used
    _check_rate_limit()

    try:
        resp = requests.get(
            f'{BASE_URL}/api/v3/klines',
            params={'symbol': symbol, 'interval': interval, 'limit': limit},
            timeout=10
        )
        _weight_used += 2
        resp.raise_for_status()
        data = resp.json()

        return [
            {
                'open_time': int(k[0]),
                'open': float(k[1]),
                'high': float(k[2]),
                'low': float(k[3]),
                'close': float(k[4]),
                'volume': float(k[5]),
                'close_time': int(k[6]),
            }
            for k in data
        ]

    except Exception as e:
        print(f'Error fetching klines for {symbol}: {e}')
        return []


def fetch_current_price(symbol: str) -> float | None:
    """
    Fetch current price for a symbol.
    API Weight: 2
    """
    global _weight_used
    _check_rate_limit()

    try:
        resp = requests.get(
            f'{BASE_URL}/api/v3/ticker/price',
            params={'symbol': symbol},
            timeout=5
        )
        _weight_used += 2
        resp.raise_for_status()
        return float(resp.json()['price'])
    except Exception:
        return None
