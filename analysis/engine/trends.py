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
