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
