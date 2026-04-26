import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { config } from './config';
import { logger } from './utils/logger';
import { initDatabase } from './services/db';
import signalRoutes from './routes/signals';
import coinRoutes from './routes/coins';
import marketRoutes from './routes/market';

const app = express();

// ── Middleware ──────────────────────────────────────────
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

// ── Health Check ───────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'smartentry-api',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ── API Routes ─────────────────────────────────────────
app.use('/api/signals', signalRoutes);
app.use('/api/coins', coinRoutes);
app.use('/api/market', marketRoutes);

// ── 404 Handler ────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ── Error Handler ──────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start Server ───────────────────────────────────────
async function start() {
  try {
    // Initialize database
    initDatabase();
    logger.info('Database initialized');

    // Start listening
    app.listen(config.port, () => {
      logger.info(`SmartEntry API running on port ${config.port}`);
      logger.info(`Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
