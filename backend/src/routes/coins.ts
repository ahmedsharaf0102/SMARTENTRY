import { Router, Request, Response } from 'express';
import { getDb } from '../services/db';
import { getCached } from '../services/cache';
import { config } from '../config';

const router = Router();

/**
 * GET /api/coins/:symbol
 * Returns coin detail with latest signals and candle data
 */
router.get('/:symbol', async (req: Request, res: Response) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const cacheKey = `coin:${symbol}`;

    const result = await getCached(cacheKey, () => {
      const db = getDb();

      // Get coin info
      const coin = db.prepare('SELECT * FROM coins WHERE symbol = ?').get(symbol);
      if (!coin) {
        return null;
      }

      // Get latest signals for this coin
      const signals = db.prepare(`
        SELECT id, signal_type, action, strength, price_at_signal, details, created_at
        FROM signals
        WHERE symbol = ?
        ORDER BY created_at DESC
        LIMIT 10
      `).all(symbol);

      // Get recent candles (1h interval, last 100)
      const candles = db.prepare(`
        SELECT open_time, open, high, low, close, volume
        FROM candles
        WHERE symbol = ? AND interval = '1h'
        ORDER BY open_time DESC
        LIMIT 100
      `).all(symbol);

      return { coin, signals, candles: candles.reverse() };
    }, config.cache.pricesTTL);

    if (!result) {
      return res.status(404).json({ error: 'Coin not found' });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch coin data' });
  }
});

/**
 * GET /api/coins
 * Returns list of tracked coins with latest price info
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const cacheKey = `coins:list:${limit}`;

    const result = await getCached(cacheKey, () => {
      const db = getDb();
      const coins = db.prepare(`
        SELECT c.symbol, c.base_asset, c.quote_asset,
          (SELECT close FROM candles WHERE symbol = c.symbol AND interval = '1h' ORDER BY open_time DESC LIMIT 1) as last_price,
          (SELECT action FROM signals WHERE symbol = c.symbol ORDER BY created_at DESC LIMIT 1) as latest_signal
        FROM coins c
        WHERE c.is_active = 1
        ORDER BY c.symbol
        LIMIT ?
      `).all(limit);

      return { coins };
    }, config.cache.pricesTTL);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch coins' });
  }
});

export default router;
