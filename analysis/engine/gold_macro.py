"""
Gold Macro Analysis Engine — FRED API
Fetches 9 macroeconomic indicators and scores them for gold signals.
"""
import os
import requests
import pandas as pd
from datetime import datetime, timedelta

FRED_API_KEY = os.getenv('FRED_API_KEY', '')
FRED_BASE = 'https://api.stlouisfed.org/fred/series/observations'

# FRED series IDs
SERIES = {
    'fed_rate': 'FEDFUNDS',
    'cpi': 'CPIAUCSL',
    'dxy': 'DTWEXBGS',
    'treasury_10y': 'DGS10',
    'treasury_2y': 'DGS2',
    'real_yield': 'DFII10',
    'vix': 'VIXCLS',
    'm2': 'M2SL',
    'unemployment': 'UNRATE',
}


def fetch_fred_series(series_id: str, limit: int = 5) -> list[float]:
    """Fetch the latest observations from a FRED series."""
    try:
        params = {
            'series_id': series_id,
            'api_key': FRED_API_KEY,
            'file_type': 'json',
            'sort_order': 'desc',
            'limit': limit,
        }
        res = requests.get(FRED_BASE, params=params, timeout=10)
        data = res.json().get('observations', [])
        values = []
        for obs in data:
            try:
                values.append(float(obs['value']))
            except (ValueError, TypeError):
                continue
        return values
    except Exception as e:
        print(f'  ⚠️ FRED error for {series_id}: {e}')
        return []


def get_all_macro_data() -> dict:
    """Fetch all macro indicators from FRED."""
    if not FRED_API_KEY:
        print('  ❌ FRED_API_KEY not set')
        return {}

    data = {}
    for key, series_id in SERIES.items():
        values = fetch_fred_series(series_id, limit=5)
        if values:
            data[key] = {
                'current': values[0],
                'previous': values[1] if len(values) > 1 else None,
                'trend': 'rising' if len(values) > 1 and values[0] > values[1] else 'falling',
            }
            print(f'  📊 {key}: {values[0]}')
        else:
            data[key] = None
    return data


def calculate_macro_score(data: dict) -> tuple[int, dict]:
    """
    Score macro indicators for gold (max 70 points).
    Returns (score, breakdown).
    """
    score = 0
    breakdown = {}

    # 1. Fed Rate — falling or paused = bullish for gold (+10)
    fed = data.get('fed_rate')
    if fed and fed.get('current') is not None:
        if fed['trend'] == 'falling':
            score += 10
            breakdown['fed_rate'] = {'score': 10, 'reason': 'Rate falling — bullish'}
        elif fed['previous'] and fed['current'] == fed['previous']:
            score += 5
            breakdown['fed_rate'] = {'score': 5, 'reason': 'Rate paused'}
        else:
            breakdown['fed_rate'] = {'score': 0, 'reason': 'Rate rising — bearish'}

    # 2. CPI — rising inflation > 3% = bullish (+10)
    cpi = data.get('cpi')
    if cpi and cpi.get('current') is not None:
        if cpi['previous']:
            yoy = ((cpi['current'] - cpi['previous']) / cpi['previous']) * 100 * 12
            if yoy > 3:
                score += 10
                breakdown['cpi'] = {'score': 10, 'reason': f'Inflation {yoy:.1f}% — bullish'}
            elif yoy > 2:
                score += 5
                breakdown['cpi'] = {'score': 5, 'reason': f'Inflation {yoy:.1f}% — moderate'}
            else:
                breakdown['cpi'] = {'score': 0, 'reason': f'Inflation {yoy:.1f}% — low'}

    # 3. DXY — dollar weakening = bullish (+10)
    dxy = data.get('dxy')
    if dxy and dxy.get('current') is not None:
        if dxy['trend'] == 'falling':
            score += 10
            breakdown['dxy'] = {'score': 10, 'reason': 'Dollar weakening — bullish'}
        else:
            breakdown['dxy'] = {'score': 0, 'reason': 'Dollar strengthening — bearish'}

    # 4. Treasury 10Y — yields falling = bullish (+7)
    t10 = data.get('treasury_10y')
    if t10 and t10.get('current') is not None:
        if t10['trend'] == 'falling':
            score += 7
            breakdown['treasury_10y'] = {'score': 7, 'reason': 'Yields falling — bullish'}
        else:
            breakdown['treasury_10y'] = {'score': 0, 'reason': 'Yields rising — bearish'}

    # 5. Yield curve inversion (2Y > 10Y) = bullish (+5)
    t2 = data.get('treasury_2y')
    if t2 and t10 and t2.get('current') and t10.get('current'):
        if t2['current'] > t10['current']:
            score += 5
            breakdown['treasury_2y'] = {'score': 5, 'reason': 'Yield curve inverted — recession risk'}
        else:
            breakdown['treasury_2y'] = {'score': 0, 'reason': 'Normal yield curve'}

    # 6. Real yields — negative or falling = bullish (+8)
    ry = data.get('real_yield')
    if ry and ry.get('current') is not None:
        if ry['current'] < 0:
            score += 8
            breakdown['real_yield'] = {'score': 8, 'reason': f'Real yield {ry["current"]:.2f}% — negative'}
        elif ry['trend'] == 'falling':
            score += 4
            breakdown['real_yield'] = {'score': 4, 'reason': 'Real yields falling'}
        else:
            breakdown['real_yield'] = {'score': 0, 'reason': 'Real yields positive & rising'}

    # 7. VIX — fear > 20 = bullish (+5)
    vix = data.get('vix')
    if vix and vix.get('current') is not None:
        if vix['current'] > 25:
            score += 5
            breakdown['vix'] = {'score': 5, 'reason': f'VIX {vix["current"]:.1f} — high fear'}
        elif vix['current'] > 20:
            score += 3
            breakdown['vix'] = {'score': 3, 'reason': f'VIX {vix["current"]:.1f} — moderate fear'}
        else:
            breakdown['vix'] = {'score': 0, 'reason': f'VIX {vix["current"]:.1f} — calm'}

    # 8. M2 — expanding = bullish (+8)
    m2 = data.get('m2')
    if m2 and m2.get('current') is not None:
        if m2['trend'] == 'rising':
            score += 8
            breakdown['m2'] = {'score': 8, 'reason': 'M2 expanding — money printing'}
        else:
            breakdown['m2'] = {'score': 0, 'reason': 'M2 contracting'}

    # 9. Unemployment — rising = bullish (+7)
    unemp = data.get('unemployment')
    if unemp and unemp.get('current') is not None:
        if unemp['trend'] == 'rising':
            score += 7
            breakdown['unemployment'] = {'score': 7, 'reason': 'Unemployment rising — recession hedge'}
        else:
            breakdown['unemployment'] = {'score': 0, 'reason': 'Jobs market strong'}

    return score, breakdown
