import { config } from '../config';
import { logger } from '../utils/logger';

const BASE_URL = config.binanceBaseUrl;

export interface BinanceTicker {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  lastPrice: string;
  volume: string;
  quoteVolume: string;
  highPrice: string;
  lowPrice: string;
}

export interface BinanceKline {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
}

/**
 * Fetch 24hr ticker data for all USDT pairs
 */
export async function get24hrTickers(): Promise<BinanceTicker[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/v3/ticker/24hr`);
    if (!res.ok) throw new Error(`Binance API error: ${res.status}`);

    const data: BinanceTicker[] = await res.json();

    // Filter only USDT pairs with meaningful volume
    return data
      .filter(t => t.symbol.endsWith('USDT') && parseFloat(t.quoteVolume) > 100000)
      .sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
      .slice(0, 50); // Top 50 by volume
  } catch (error) {
    logger.error('Failed to fetch 24hr tickers:', error);
    return [];
  }
}

/**
 * Fetch kline (candlestick) data for a symbol
 */
export async function getKlines(
  symbol: string,
  interval: string = '1h',
  limit: number = 100
): Promise<BinanceKline[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
    );
    if (!res.ok) throw new Error(`Binance klines error: ${res.status}`);

    const data: any[][] = await res.json();

    return data.map(k => ({
      openTime: k[0],
      open: k[1],
      high: k[2],
      low: k[3],
      close: k[4],
      volume: k[5],
      closeTime: k[6],
    }));
  } catch (error) {
    logger.error(`Failed to fetch klines for ${symbol}:`, error);
    return [];
  }
}

/**
 * Fetch current price for a symbol
 */
export async function getCurrentPrice(symbol: string): Promise<number | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/v3/ticker/price?symbol=${symbol}`);
    if (!res.ok) return null;
    const data = await res.json();
    return parseFloat(data.price);
  } catch {
    return null;
  }
}

/**
 * Get exchange info to find valid trading pairs
 */
export async function getTopUsdtPairs(limit: number = 50): Promise<string[]> {
  const tickers = await get24hrTickers();
  return tickers.slice(0, limit).map(t => t.symbol);
}
