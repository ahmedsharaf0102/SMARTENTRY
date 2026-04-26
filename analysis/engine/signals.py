"""
Signal Generation Engine
Converts technical indicators into actionable trading signals (BUY / WATCH / WAIT).
Uses a score-based system for signal strength calculation.
"""


def generate_signals(symbol: str, indicators: dict, current_price: float) -> list[dict]:
    """
    Generate trading signals based on calculated indicators.
    
    Scoring System:
    - RSI oversold (< 30):      +30 points
    - RSI extremely oversold:   +20 bonus
    - RSI overbought (> 70):    +25 points (bearish signal)
    - Price above SMA 50:       +15 points (uptrend)
    - MACD bullish crossover:   +20 points
    - Volume spike (> 2x avg):  +15 points
    - EMA 9/21 bullish cross:   +20 points
    - BB lower touch:           +10 points
    
    Thresholds:
    - >= 70: BUY
    - 40-69: WATCH
    - < 40:  WAIT
    """
    signals = []
    price = float(current_price)

    # ── RSI Signals ─────────────────────────────────────
    rsi = indicators.get('rsi_14')
    if rsi is not None:
        if rsi < 30:
            score = 30
            if rsi < 20:
                score += 20  # Extremely oversold bonus

            # Add trend confirmation
            score += _trend_bonus(indicators)
            score += _volume_bonus(indicators)

            action = _score_to_action(score)
            signals.append({
                'symbol': symbol,
                'signal_type': 'RSI_OVERSOLD',
                'action': action,
                'strength': min(score, 100),
                'price_at_signal': price,
                'details': {
                    'rsi': round(rsi, 2),
                    'sma_50': indicators.get('sma_50'),
                    'volume_ratio': indicators.get('volume_ratio'),
                    'description': f'RSI at {rsi:.1f} — oversold territory'
                }
            })

        elif rsi > 70:
            score = 25
            if rsi > 80:
                score += 15

            signals.append({
                'symbol': symbol,
                'signal_type': 'RSI_OVERBOUGHT',
                'action': 'WAIT',
                'strength': min(score, 100),
                'price_at_signal': price,
                'details': {
                    'rsi': round(rsi, 2),
                    'description': f'RSI at {rsi:.1f} — overbought, risk of pullback'
                }
            })

    # ── MACD Crossover ──────────────────────────────────
    macd_hist = indicators.get('macd_hist')
    prev_macd_hist = indicators.get('prev_macd_hist')
    if macd_hist is not None and prev_macd_hist is not None:
        # Bullish crossover: histogram goes from negative to positive
        if prev_macd_hist < 0 and macd_hist > 0:
            score = 20
            score += _trend_bonus(indicators)
            score += _volume_bonus(indicators)
            score += _rsi_bonus(indicators)

            action = _score_to_action(score)
            signals.append({
                'symbol': symbol,
                'signal_type': 'MACD_CROSSOVER',
                'action': action,
                'strength': min(score, 100),
                'price_at_signal': price,
                'details': {
                    'macd': indicators.get('macd'),
                    'macd_signal': indicators.get('macd_signal'),
                    'description': 'MACD bullish crossover detected'
                }
            })

    # ── Volume Spike ────────────────────────────────────
    volume_ratio = indicators.get('volume_ratio')
    if volume_ratio is not None and volume_ratio > 2.0:
        score = 15
        score += _trend_bonus(indicators)
        score += _rsi_bonus(indicators)

        # Strong volume spike
        if volume_ratio > 3.0:
            score += 10

        action = _score_to_action(score)
        signals.append({
            'symbol': symbol,
            'signal_type': 'VOLUME_SPIKE',
            'action': action,
            'strength': min(score, 100),
            'price_at_signal': price,
            'details': {
                'volume_ratio': round(volume_ratio, 2),
                'description': f'Volume {volume_ratio:.1f}x above average'
            }
        })

    # ── EMA Crossover ───────────────────────────────────
    ema_cross = indicators.get('ema_9_cross_21')
    if ema_cross == 'bullish':
        score = 20
        score += _volume_bonus(indicators)
        score += _rsi_bonus(indicators)

        action = _score_to_action(score)
        signals.append({
            'symbol': symbol,
            'signal_type': 'EMA_CROSSOVER',
            'action': action,
            'strength': min(score, 100),
            'price_at_signal': price,
            'details': {
                'ema_9': indicators.get('ema_9'),
                'ema_21': indicators.get('ema_21'),
                'description': 'EMA 9/21 bullish crossover — momentum shift'
            }
        })

    return signals


def _score_to_action(score: int) -> str:
    """Convert score to action label."""
    if score >= 70:
        return 'BUY'
    elif score >= 40:
        return 'WATCH'
    else:
        return 'WAIT'


def _trend_bonus(indicators: dict) -> int:
    """Add bonus points if price is in an uptrend."""
    price = indicators.get('current_price')
    sma_50 = indicators.get('sma_50')
    if price and sma_50 and price > sma_50:
        return 15
    return 0


def _volume_bonus(indicators: dict) -> int:
    """Add bonus points for above-average volume."""
    ratio = indicators.get('volume_ratio')
    if ratio and ratio > 1.5:
        return 15
    elif ratio and ratio > 1.2:
        return 5
    return 0


def _rsi_bonus(indicators: dict) -> int:
    """Add bonus points if RSI supports the signal."""
    rsi = indicators.get('rsi_14')
    if rsi is None:
        return 0
    if rsi < 35:
        return 15  # Oversold supports buy
    if rsi > 50 and rsi < 70:
        return 5   # Neutral-bullish
    return 0
