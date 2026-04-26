import { Router, Request, Response } from 'express';
import { getDb } from '../services/db';
import { getCached } from '../services/cache';
import { config } from '../config';

const router = Router();

/**
 * GET /api/signals
 * Returns latest signals with optional filters
 * Query params: ?action=BUY&limit=20&offset=0
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const action = req.query.action as string | undefined;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const cacheKey = `signals:list:${action || 'all'}:${limit}:${offset}`;

    const result = await getCached(cacheKey, () => {
      const db = getDb();
      let query = `
        SELECT id, symbol, signal_type, action, strength, price_at_signal, details, created_at, expires_at
        FROM signals
      `;
      const params: any[] = [];

      if (action) {
        query += ' WHERE action = ?';
        params.push(action.toUpperCase());
      }

      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const signals = db.prepare(query).all(...params);

      // Get total count
      let countQuery = 'SELECT COUNT(*) as total FROM signals';
      if (action) {
        countQuery += ' WHERE action = ?';
      }
      const { total } = db.prepare(countQuery).get(...(action ? [action.toUpperCase()] : [])) as any;

      return { signals, total, limit, offset };
    }, config.cache.signalsTTL);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch signals' });
  }
});

/**
 * GET /api/signals/top
 * Returns top signals by strength score
 * Query params: ?limit=10
 */
router.get('/top', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
    const cacheKey = `signals:top:${limit}`;

    const result = await getCached(cacheKey, () => {
      const db = getDb();
      const signals = db.prepare(`
        SELECT id, symbol, signal_type, action, strength, price_at_signal, details, created_at
        FROM signals
        WHERE created_at >= datetime('now', '-24 hours')
        ORDER BY strength DESC
        LIMIT ?
      `).all(limit);

      return { signals };
    }, config.cache.signalsTTL);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top signals' });
  }
});

/**
 * GET /api/signals/summary
 * Returns signal summary stats for the dashboard
 */
router.get('/summary', async (_req: Request, res: Response) => {
  try {
    const cacheKey = 'signals:summary';

    const result = await getCached(cacheKey, () => {
      const db = getDb();

      const stats = db.prepare(`
        SELECT 
          COUNT(*) as total_signals,
          SUM(CASE WHEN action = 'BUY' THEN 1 ELSE 0 END) as buy_count,
          SUM(CASE WHEN action = 'WATCH' THEN 1 ELSE 0 END) as watch_count,
          SUM(CASE WHEN action = 'WAIT' THEN 1 ELSE 0 END) as wait_count,
          AVG(strength) as avg_strength
        FROM signals
        WHERE created_at >= datetime('now', '-24 hours')
      `).get() as any;

      return stats;
    }, config.cache.signalsTTL);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch signal summary' });
  }
});

export default router;
