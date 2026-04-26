/**
 * Coin data model — TypeScript interfaces
 */

export interface Coin {
  symbol: string;
  base_asset: string;
  quote_asset: string;
  is_active: number;
  created_at: string;
}

export interface CoinWithPrice extends Coin {
  last_price: number | null;
  latest_signal: string | null;
}

export interface CoinDetail {
  coin: Coin;
  signals: any[];
  candles: Candle[];
}

export interface Candle {
  open_time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
