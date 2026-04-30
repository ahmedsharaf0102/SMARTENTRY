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
