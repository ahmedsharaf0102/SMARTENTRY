/**
 * Signal data model — TypeScript interfaces
 */

export interface Signal {
  id: number;
  symbol: string;
  signal_type: SignalType;
  action: SignalAction;
  strength: number;
  price_at_signal: number;
  details: string; // JSON string
  created_at: string;
  expires_at: string | null;
}

export type SignalAction = 'BUY' | 'WATCH' | 'WAIT';

export type SignalType =
  | 'RSI_OVERSOLD'
  | 'RSI_OVERBOUGHT'
  | 'MACD_CROSSOVER'
  | 'VOLUME_SPIKE'
  | 'EMA_CROSSOVER';

export interface SignalDetails {
  rsi?: number;
  macd?: number;
  macd_signal?: number;
  volume_ratio?: number;
  ema_9?: number;
  ema_21?: number;
  sma_50?: number;
  description: string;
}

export interface SignalSummary {
  total_signals: number;
  buy_count: number;
  watch_count: number;
  wait_count: number;
  avg_strength: number;
}
