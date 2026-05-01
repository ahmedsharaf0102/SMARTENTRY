"""
Gold Signal Engine — Combines Macro (FRED) + Technical (yfinance) scoring.
Max score: 140 (70 macro + 70 technical)
"""
import yfinance as yf
import pandas as pd
import ta as ta_lib
from engine.gold_macro import get_all_macro_data, calculate_macro_score


def get_gold_technical_data() -> pd.DataFrame | None:
    """Fetch gold OHLCV data from Yahoo Finance (GC=F = Gold Futures)."""
    try:
        gold = yf.download('GC=F', period='3mo', interval='1h', progress=False)
        if gold.empty:
            print('  ⚠️ yfinance returned empty data, trying daily...')
            gold = yf.download('GC=F', period='6mo', interval='1d', progress=False)
        if gold.empty:
            return None

        # Flatten MultiIndex columns if present
        if hasattr(gold.columns, 'levels'):
            gold.columns = gold.columns.get_level_values(0)

        gold = gold.reset_index()
        return gold
    except Exception as e:
        print(f'  ❌ yfinance error: {e}')
        return None


def calculate_gold_technical_score(df: pd.DataFrame) -> tuple[int, dict]:
    """
    Calculate technical score for gold (max 70 points).
    Uses the same indicators as crypto but tuned for gold.
    """
    if df is None or len(df) < 50:
        return 0, {'error': 'Insufficient data'}

    close = df['Close']
    high = df['High']
    low = df['Low']
    volume = df['Volume']

    score = 0
    breakdown = {}

    # 1. RSI (max 10)
    rsi_val = ta_lib.momentum.RSIIndicator(close, window=14).rsi().iloc[-1]
    if pd.notna(rsi_val):
        if rsi_val < 35:
            score += 10
            breakdown['rsi'] = {'score': 10, 'value': round(rsi_val, 1), 'reason': 'Oversold'}
        elif rsi_val < 45:
            score += 4
            breakdown['rsi'] = {'score': 4, 'value': round(rsi_val, 1), 'reason': 'Low RSI'}
        else:
            breakdown['rsi'] = {'score': 0, 'value': round(rsi_val, 1), 'reason': 'Neutral/Overbought'}

    # 2. MACD (max 10)
    macd = ta_lib.trend.MACD(close, window_slow=26, window_fast=12, window_sign=9)
    hist = macd.macd_diff()
    if len(hist) >= 2 and pd.notna(hist.iloc[-1]) and pd.notna(hist.iloc[-2]):
        if hist.iloc[-2] < 0 and hist.iloc[-1] > 0:
            score += 10
            breakdown['macd'] = {'score': 10, 'reason': 'Bullish crossover'}
        elif hist.iloc[-1] > 0 and hist.iloc[-1] > hist.iloc[-2]:
            score += 4
            breakdown['macd'] = {'score': 4, 'reason': 'Momentum rising'}
        else:
            breakdown['macd'] = {'score': 0, 'reason': 'Bearish/Flat'}

    # 3. Stochastic RSI (max 7)
    stoch = ta_lib.momentum.StochRSIIndicator(close, window=14, smooth1=3, smooth2=3)
    stoch_k = stoch.stochrsi_k().iloc[-1] * 100
    if pd.notna(stoch_k):
        if stoch_k < 25:
            score += 7
            breakdown['stochrsi'] = {'score': 7, 'value': round(stoch_k, 1), 'reason': 'Oversold'}
        else:
            breakdown['stochrsi'] = {'score': 0, 'value': round(stoch_k, 1), 'reason': 'Not oversold'}

    # 4. EMA 9/21 (max 7)
    ema9 = ta_lib.trend.EMAIndicator(close, window=9).ema_indicator()
    ema21 = ta_lib.trend.EMAIndicator(close, window=21).ema_indicator()
    if pd.notna(ema9.iloc[-1]) and pd.notna(ema21.iloc[-1]):
        if ema9.iloc[-2] <= ema21.iloc[-2] and ema9.iloc[-1] > ema21.iloc[-1]:
            score += 7
            breakdown['ema_cross'] = {'score': 7, 'reason': 'Bullish crossover'}
        elif ema9.iloc[-1] > ema21.iloc[-1]:
            score += 3
            breakdown['ema_cross'] = {'score': 3, 'reason': 'EMA 9 above 21'}
        else:
            breakdown['ema_cross'] = {'score': 0, 'reason': 'Bearish'}

    # 5. SMA 50 (max 7)
    sma50 = ta_lib.trend.SMAIndicator(close, window=50).sma_indicator().iloc[-1]
    price = close.iloc[-1]
    if pd.notna(sma50):
        if price > sma50:
            score += 7
            breakdown['sma50'] = {'score': 7, 'reason': 'Price above SMA 50'}
        else:
            breakdown['sma50'] = {'score': 0, 'reason': 'Price below SMA 50'}

    # 6. ADX (max 7)
    adx = ta_lib.trend.ADXIndicator(high, low, close, window=14)
    adx_val = adx.adx().iloc[-1]
    dmp = adx.adx_pos().iloc[-1]
    dmn = adx.adx_neg().iloc[-1]
    if pd.notna(adx_val):
        if adx_val > 25 and dmp > dmn:
            score += 7
            breakdown['adx'] = {'score': 7, 'value': round(adx_val, 1), 'reason': 'Strong bullish trend'}
        elif adx_val > 25:
            score += 3
            breakdown['adx'] = {'score': 3, 'value': round(adx_val, 1), 'reason': 'Strong trend (bearish)'}
        else:
            breakdown['adx'] = {'score': 0, 'value': round(adx_val, 1), 'reason': 'Weak trend'}

    # 7. Bollinger Bands (max 7)
    bb = ta_lib.volatility.BollingerBands(close, window=20, window_dev=2)
    bb_lower = bb.bollinger_lband().iloc[-1]
    prev_close = close.iloc[-2]
    if pd.notna(bb_lower):
        if prev_close <= bb_lower and price > bb_lower:
            score += 7
            breakdown['bb'] = {'score': 7, 'reason': 'Lower band bounce'}
        else:
            breakdown['bb'] = {'score': 0, 'reason': 'No bounce'}

    # 8. Volume (max 5)
    vol_avg = volume.rolling(20).mean().iloc[-1]
    if pd.notna(vol_avg) and vol_avg > 0:
        ratio = volume.iloc[-1] / vol_avg
        if ratio > 1.5:
            score += 5
            breakdown['volume'] = {'score': 5, 'value': round(ratio, 2), 'reason': 'High volume'}
        else:
            breakdown['volume'] = {'score': 0, 'value': round(ratio, 2), 'reason': 'Normal volume'}

    # 9. OBV (max 5)
    obv = ta_lib.volume.OnBalanceVolumeIndicator(close, volume).on_balance_volume()
    obv_vals = obv.iloc[-3:].tolist()
    if all(pd.notna(v) for v in obv_vals):
        if obv_vals[-1] > obv_vals[0]:
            score += 5
            breakdown['obv'] = {'score': 5, 'reason': 'OBV rising — accumulation'}
        else:
            breakdown['obv'] = {'score': 0, 'reason': 'OBV falling'}

    # 10. VWAP (max 5)
    try:
        vwap = ta_lib.volume.VolumeWeightedAveragePrice(high, low, close, volume)
        vwap_val = vwap.volume_weighted_average_price().iloc[-1]
        if pd.notna(vwap_val) and price > vwap_val:
            score += 5
            breakdown['vwap'] = {'score': 5, 'reason': 'Price above VWAP'}
        else:
            breakdown['vwap'] = {'score': 0, 'reason': 'Below VWAP'}
    except Exception:
        breakdown['vwap'] = {'score': 0, 'reason': 'VWAP unavailable'}

    breakdown['current_price'] = float(price)
    return score, breakdown


def generate_gold_signal() -> dict | None:
    """
    Main gold signal generator — combines macro + technical.
    """
    print('\n🥇 Analyzing Gold (XAUUSD)...')

    # Macro
    print('  📡 Fetching FRED macro data...')
    macro_data = get_all_macro_data()
    macro_score, macro_breakdown = calculate_macro_score(macro_data)
    print(f'  📊 Macro score: {macro_score}/70')

    # Technical
    print('  📈 Fetching gold technical data...')
    gold_df = get_gold_technical_data()
    tech_score, tech_breakdown = calculate_gold_technical_score(gold_df)
    print(f'  📊 Technical score: {tech_score}/70')

    # Combined
    total_score = macro_score + tech_score
    macro_confirmed = macro_score >= 25
    tech_confirmed = tech_score >= 25

    # Decision with downgrade logic
    if total_score >= 100 and macro_confirmed and tech_confirmed:
        action = 'STRONG_BUY'
    elif total_score >= 80 and macro_confirmed and tech_confirmed:
        action = 'BUY'
    elif total_score >= 80 and not macro_confirmed:
        action = 'WATCH'  # Downgraded — weak macro
    elif total_score >= 80 and not tech_confirmed:
        action = 'WATCH'  # Downgraded — bad timing
    elif total_score >= 55:
        action = 'WATCH'
    elif total_score >= 30:
        action = 'WAIT'
    else:
        action = 'AVOID'

    price = tech_breakdown.get('current_price', 0)
    strength = min(total_score, 100)

    signal = {
        'symbol': 'XAUUSD',
        'signal_type': 'GOLD_MACRO_TECHNICAL',
        'action': action,
        'strength': strength,
        'price_at_signal': price,
        'details': {
            'total_score': total_score,
            'max_score': 140,
            'macro_score': macro_score,
            'tech_score': tech_score,
            'macro_confirmed': macro_confirmed,
            'tech_confirmed': tech_confirmed,
            'macro_breakdown': macro_breakdown,
            'tech_breakdown': tech_breakdown,
            'rsi': tech_breakdown.get('rsi', {}).get('value'),
            'adx': tech_breakdown.get('adx', {}).get('value'),
            'volume_ratio': tech_breakdown.get('volume', {}).get('value'),
            'description': f'{action} — Score {total_score}/140 | Macro {macro_score}/70 | Technical {tech_score}/70',
        },
    }

    emoji = '⭐' if action == 'STRONG_BUY' else '🟢' if action == 'BUY' else '🟡' if action == 'WATCH' else '🔴' if action == 'WAIT' else '⛔'
    print(f'  {emoji} Gold: {action} (strength: {strength})')

    return signal
