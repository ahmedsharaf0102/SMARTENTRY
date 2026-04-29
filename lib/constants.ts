export const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const BINANCE_REF_CODE = process.env.NEXT_PUBLIC_BINANCE_AFFILIATE_REF || 'GRO_28502_BM9FA';

export const BINANCE_REFERRAL_URL = `https://www.binance.com/en/register?ref=${BINANCE_REF_CODE}`;

export function getBinanceTradeUrl(symbol: string): string {
  const base = symbol.replace('USDT', '');
  return `https://www.binance.com/en/trade/${base}_USDT?ref=${BINANCE_REF_CODE}`;
}

/**
 * Signal action labels and colors
 */
export const SIGNAL_ACTIONS = {
  BUY: { label: 'BUY', color: 'var(--accent-green)', class: 'badge-buy' },
  WATCH: { label: 'WATCH', color: 'var(--accent-yellow)', class: 'badge-watch' },
  WAIT: { label: 'WAIT', color: 'var(--accent-red)', class: 'badge-wait' },
} as const;

/**
 * Signal types with human-readable labels
 */
export const SIGNAL_TYPES = {
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
  SIGNALS: 60_000,      // 1 minute
  PRICES: 30_000,       // 30 seconds
  MARKET_OVERVIEW: 120_000, // 2 minutes
} as const;
