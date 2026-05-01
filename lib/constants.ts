export const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const BINANCE_REF_CODE = process.env.NEXT_PUBLIC_BINANCE_AFFILIATE_REF || 'GRO_28502_BM9FA';

export const BINANCE_REFERRAL_URL = `https://www.binance.com/en/register?ref=${BINANCE_REF_CODE}`;

// Gold — Exness referral
export const GOLD_REFERRAL_URL = 'https://one.exnessonelink.com/a/8n69d5vrfl';

export function getBinanceTradeUrl(symbol: string): string {
  const base = symbol.replace('USDT', '');
  return `https://www.binance.com/en/trade/${base}_USDT?ref=${BINANCE_REF_CODE}`;
}

/**
 * Get the CSS class for a signal action badge
 */
export function getActionBadgeClass(action: string): string {
  switch (action) {
    case 'STRONG_BUY': return 'badge-strong-buy';
    case 'BUY': return 'badge-buy';
    case 'WATCH': return 'badge-watch';
    case 'WAIT': return 'badge-wait';
    case 'AVOID': return 'badge-avoid';
    default: return 'badge-wait';
  }
}

/**
 * Signal action display labels
 */
export const SIGNAL_ACTIONS = {
  STRONG_BUY: { label: 'STRONG BUY', color: 'var(--accent-green)', class: 'badge-strong-buy' },
  BUY: { label: 'BUY', color: 'var(--accent-green)', class: 'badge-buy' },
  WATCH: { label: 'WATCH', color: 'var(--accent-yellow)', class: 'badge-watch' },
  WAIT: { label: 'WAIT', color: 'var(--accent-red)', class: 'badge-wait' },
  AVOID: { label: 'AVOID', color: 'var(--text-muted)', class: 'badge-avoid' },
} as const;

/**
 * Signal types — v2 (12-indicator system)
 */
export const SIGNAL_TYPES = {
  FULL_CONVERGENCE: 'Full Convergence',
  RSI_MOMENTUM_CONVERGENCE: 'RSI + Momentum Convergence',
  ICHIMOKU_BREAKOUT: 'Ichimoku Breakout',
  MOMENTUM_SURGE: 'Momentum Surge',
  TREND_REVERSAL: 'Trend Reversal',
  VOLUME_ACCUMULATION: 'Volume Accumulation',
  // Legacy types
  RSI_OVERSOLD: 'RSI Oversold',
  RSI_OVERBOUGHT: 'RSI Overbought',
  MACD_CROSSOVER: 'MACD Crossover',
  VOLUME_SPIKE: 'Volume Spike',
  EMA_CROSSOVER: 'EMA Crossover',
} as const;

/**
 * Refresh intervals (in milliseconds)
 */
export const REFRESH_INTERVALS = {
  SIGNALS: 60_000,
  PRICES: 30_000,
  MARKET_OVERVIEW: 120_000,
} as const;
