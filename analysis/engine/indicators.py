"""
Technical Indicators Calculator
Uses pandas-ta to calculate RSI, MACD, SMA, EMA, and Bollinger Bands.
"""
import pandas as pd
import pandas_ta as ta


def calculate_indicators(klines: list[dict]) -> dict | None:
    """
    Calculate all technical indicators from kline data.
    
    Args:
        klines: List of OHLCV dicts with keys: open, high, low, close, volume
    
    Returns:
        Dictionary with calculated indicator values, or None if insufficient data.
    """
    if len(klines) < 50:
        return None

    # Build DataFrame
    df = pd.DataFrame(klines)
    for col in ['open', 'high', 'low', 'close', 'volume']:
        df[col] = pd.to_numeric(df[col], errors='coerce')

    # ── RSI (14-period) ─────────────────────────────────
    df.ta.rsi(length=14, append=True)

    # ── MACD (12, 26, 9) ────────────────────────────────
    df.ta.macd(fast=12, slow=26, signal=9, append=True)

    # ── Simple Moving Averages ──────────────────────────
    df.ta.sma(length=9, append=True)
    df.ta.sma(length=21, append=True)
    df.ta.sma(length=50, append=True)

    # ── Exponential Moving Averages ─────────────────────
    df.ta.ema(length=9, append=True)
    df.ta.ema(length=21, append=True)

    # ── Bollinger Bands ─────────────────────────────────
    df.ta.bbands(length=20, append=True)

    # ── Volume SMA (20-period) ──────────────────────────
    df['volume_sma_20'] = df['volume'].rolling(window=20).mean()
    df['volume_ratio'] = df['volume'] / df['volume_sma_20']

    # Get the latest row
    latest = df.iloc[-1]
    prev = df.iloc[-2]

    result = {
        # Price
        'current_price': float(latest['close']),
        'prev_close': float(prev['close']),

        # RSI
        'rsi_14': safe_float(latest.get('RSI_14')),

        # MACD
        'macd': safe_float(latest.get('MACD_12_26_9')),
        'macd_signal': safe_float(latest.get('MACDs_12_26_9')),
        'macd_hist': safe_float(latest.get('MACDh_12_26_9')),
        'prev_macd_hist': safe_float(prev.get('MACDh_12_26_9')),

        # Moving Averages
        'sma_9': safe_float(latest.get('SMA_9')),
        'sma_21': safe_float(latest.get('SMA_21')),
        'sma_50': safe_float(latest.get('SMA_50')),
        'ema_9': safe_float(latest.get('EMA_9')),
        'ema_21': safe_float(latest.get('EMA_21')),

        # Bollinger Bands
        'bb_upper': safe_float(latest.get('BBU_20_2.0')),
        'bb_middle': safe_float(latest.get('BBM_20_2.0')),
        'bb_lower': safe_float(latest.get('BBL_20_2.0')),

        # Volume
        'volume': float(latest['volume']),
        'volume_sma_20': safe_float(latest.get('volume_sma_20')),
        'volume_ratio': safe_float(latest.get('volume_ratio')),

        # MA Crossover detection
        'sma_9_cross_21': detect_crossover(df, 'SMA_9', 'SMA_21'),
        'ema_9_cross_21': detect_crossover(df, 'EMA_9', 'EMA_21'),
    }

    return result


def safe_float(value) -> float | None:
    """Safely convert to float, returning None for NaN/None."""
    if value is None or pd.isna(value):
        return None
    return round(float(value), 8)


def detect_crossover(df: pd.DataFrame, fast_col: str, slow_col: str) -> str | None:
    """
    Detect if a crossover happened in the last 2 candles.
    Returns 'bullish', 'bearish', or None.
    """
    if fast_col not in df.columns or slow_col not in df.columns:
        return None

    curr_fast = df.iloc[-1].get(fast_col)
    curr_slow = df.iloc[-1].get(slow_col)
    prev_fast = df.iloc[-2].get(fast_col)
    prev_slow = df.iloc[-2].get(slow_col)

    if any(pd.isna(v) for v in [curr_fast, curr_slow, prev_fast, prev_slow]):
        return None

    # Bullish crossover: fast crosses above slow
    if prev_fast <= prev_slow and curr_fast > curr_slow:
        return 'bullish'
    # Bearish crossover: fast crosses below slow
    if prev_fast >= prev_slow and curr_fast < curr_slow:
        return 'bearish'

    return None
