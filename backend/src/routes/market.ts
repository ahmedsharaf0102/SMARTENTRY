import { Router, Request, Response } from 'express';
import { getDb } from '../services/db';
import { getCached } from '../services/cache';
import { config } from '../config';

const router = Router();

/**
 * GET /api/market/overview
 * Returns market overview dashboard data
 */
router.get('/overview', async (_req: Request, res: Response) => {
  try {
    const cacheKey = 'market:overview';

    const result = await getCached(cacheKey, () => {
      const db = getDb();

      // Count active coins
      const { count: totalCoins } = db.prepare(
        'SELECT COUNT(*) as count FROM coins WHERE is_active = 1'
      ).get() as any;

      // Signals in last 24h
      const signalStats = db.prepare(`
        SELECT 
          COUNT(*) as total_signals,
          SUM(CASE WHEN action = 'BUY' THEN 1 ELSE 0 END) as buy_signals,
          SUM(CASE WHEN action = 'WATCH' THEN 1 ELSE 0 END) as watch_signals,
          SUM(CASE WHEN action = 'WAIT' THEN 1 ELSE 0 END) as wait_signals
        FROM signals
        WHERE created_at >= datetime('now', '-24 hours')
      `).get() as any;

      // Top gainers (by latest close vs previous)
      const topMovers = db.prepare(`
        SELECT DISTINCT symbol,
          (SELECT close FROM candles WHERE symbol = c.symbol AND interval = '1h' ORDER BY open_time DESC LIMIT 1) as current_price
        FROM candles c
        WHERE interval = '1h'
        ORDER BY open_time DESC
        LIMIT 10
      `).all();

      // Latest signal timestamp
      const lastUpdate = db.prepare(
        'SELECT created_at FROM signals ORDER BY created_at DESC LIMIT 1'
      ).get() as any;

      return {
        totalCoins,
        ...signalStats,
        topMovers,
        lastUpdate: lastUpdate?.created_at || null,
      };
    }, config.cache.marketOverviewTTL);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch market overview' });
  }
});

export default router;
