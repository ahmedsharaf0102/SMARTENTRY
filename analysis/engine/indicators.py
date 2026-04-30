"""
Technical Indicators Calculator — v2 (12 Indicators)
Uses pandas-ta to calculate all indicators for the SmartEntry scoring system.

Active Indicators:
  Category A (Momentum): RSI, Stochastic RSI, MACD, MFI
  Category B (Trend): EMA 9/21, SMA 50, ADX, Ichimoku Cloud
  Category C (Volume & Volatility): Volume Ratio, OBV, VWAP, Bollinger Bands
"""
import pandas as pd
import pandas_ta as ta


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

    # Build DataFrame
    df = pd.DataFrame(klines)
    for col in ['open', 'high', 'low', 'close', 'volume']:
        df[col] = pd.to_numeric(df[col], errors='coerce')

    # ════════════════════════════════════════════════════
    # CATEGORY A: Momentum
    # ════════════════════════════════════════════════════

    # 1. RSI (14-period)
    df.ta.rsi(length=14, append=True)

    # 2. Stochastic RSI
    df.ta.stochrsi(length=14, rsi_length=14, k=3, d=3, append=True)

    # 3. MACD (12, 26, 9)
    df.ta.macd(fast=12, slow=26, signal=9, append=True)

    # 4. MFI (Money Flow Index — 14-period)
    df.ta.mfi(length=14, append=True)

    # ════════════════════════════════════════════════════
    # CATEGORY B: Trend
    # ════════════════════════════════════════════════════

    # 5. EMA (9, 21)
    df.ta.ema(length=9, append=True)
    df.ta.ema(length=21, append=True)

    # 6. SMA (9, 21, 50)
    df.ta.sma(length=9, append=True)
    df.ta.sma(length=21, append=True)
    df.ta.sma(length=50, append=True)

    # 7. ADX (14-period)
    df.ta.adx(length=14, append=True)

    # 8. Ichimoku Cloud
    df.ta.ichimoku(append=True)

    # ════════════════════════════════════════════════════
    # CATEGORY C: Volume & Volatility
    # ════════════════════════════════════════════════════

    # 9. Volume SMA (20-period) + Ratio
    df['volume_sma_20'] = df['volume'].rolling(window=20).mean()
    df['volume_ratio'] = df['volume'] / df['volume_sma_20']

    # 10. OBV (On-Balance Volume)
    df.ta.obv(append=True)

    # 11. VWAP
    df.ta.vwap(append=True)

    # 12. Bollinger Bands (20, 2σ)
    df.ta.bbands(length=20, append=True)

    # ════════════════════════════════════════════════════
    # Extract latest values
    # ════════════════════════════════════════════════════
    latest = df.iloc[-1]
    prev = df.iloc[-2]
    prev3 = df.iloc[-4:-1]  # Last 3 candles for slope

    result = {
        # Price
        'current_price': float(latest['close']),
        'prev_close': float(prev['close']),

        # ── Category A: Momentum ──────────────────────
        # 1. RSI
        'rsi_14': safe_float(latest.get('RSI_14')),

        # 2. Stochastic RSI
        'stochrsi_k': safe_float(latest.get('STOCHRSIk_14_14_3_3')),
        'stochrsi_d': safe_float(latest.get('STOCHRSId_14_14_3_3')),
        'prev_stochrsi_k': safe_float(prev.get('STOCHRSIk_14_14_3_3')),
        'prev_stochrsi_d': safe_float(prev.get('STOCHRSId_14_14_3_3')),

        # 3. MACD
        'macd': safe_float(latest.get('MACD_12_26_9')),
        'macd_signal': safe_float(latest.get('MACDs_12_26_9')),
        'macd_hist': safe_float(latest.get('MACDh_12_26_9')),
        'prev_macd_hist': safe_float(prev.get('MACDh_12_26_9')),

        # 4. MFI
        'mfi_14': safe_float(latest.get('MFI_14')),

        # ── Category B: Trend ─────────────────────────
        # 5. EMA
        'ema_9': safe_float(latest.get('EMA_9')),
        'ema_21': safe_float(latest.get('EMA_21')),
        'ema_9_cross_21': detect_crossover(df, 'EMA_9', 'EMA_21'),

        # 6. SMA
        'sma_9': safe_float(latest.get('SMA_9')),
        'sma_21': safe_float(latest.get('SMA_21')),
        'sma_50': safe_float(latest.get('SMA_50')),

        # 7. ADX
        'adx_14': safe_float(latest.get('ADX_14')),
        'dmp_14': safe_float(latest.get('DMP_14')),  # +DI
        'dmn_14': safe_float(latest.get('DMN_14')),  # -DI

        # 8. Ichimoku
        'ichi_tenkan': safe_float(latest.get('ITS_9')),
        'ichi_kijun': safe_float(latest.get('IKS_26')),
        'ichi_senkou_a': safe_float(latest.get('ISA_9')),
        'ichi_senkou_b': safe_float(latest.get('ISB_26')),

        # ── Category C: Volume & Volatility ───────────
        # 9. Volume
        'volume': float(latest['volume']),
        'volume_sma_20': safe_float(latest.get('volume_sma_20')),
        'volume_ratio': safe_float(latest.get('volume_ratio')),

        # 10. OBV
        'obv': safe_float(latest.get('OBV')),
        'obv_prev': safe_float(prev.get('OBV')),
        'obv_rising': _is_obv_rising(df),

        # 11. VWAP
        'vwap': safe_float(latest.get('VWAP_D')),

        # 12. Bollinger Bands
        'bb_upper': safe_float(latest.get('BBU_20_2.0')),
        'bb_middle': safe_float(latest.get('BBM_20_2.0')),
        'bb_lower': safe_float(latest.get('BBL_20_2.0')),

        # MA Crossover detection
        'sma_9_cross_21': detect_crossover(df, 'SMA_9', 'SMA_21'),
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

    if prev_fast <= prev_slow and curr_fast > curr_slow:
        return 'bullish'
    if prev_fast >= prev_slow and curr_fast < curr_slow:
        return 'bearish'

    return None


def _is_obv_rising(df: pd.DataFrame) -> bool | None:
    """Check if OBV has been rising over the last 3 periods."""
    if 'OBV' not in df.columns:
        return None
    last3 = df['OBV'].iloc[-3:].tolist()
    if any(pd.isna(v) for v in last3):
        return None
    return last3[-1] > last3[0]
