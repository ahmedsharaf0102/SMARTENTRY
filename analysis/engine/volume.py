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
