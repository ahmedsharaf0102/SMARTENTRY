import Database from 'better-sqlite3';
import path from 'path';
import { config } from '../config';
import { logger } from '../utils/logger';

let db: Database.Database;

/**
 * Get the database instance (singleton)
 */
export function getDb(): Database.Database {
  if (!db) {
    initDatabase();
  }
  return db;
}

/**
 * Initialize the SQLite database with WAL mode and create tables
 */
export function initDatabase(): void {
  const dbDir = path.dirname(config.dbPath);

  // Ensure data directory exists
  const fs = require('fs');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  db = new Database(config.dbPath);

  // Enable WAL mode for better concurrent read performance
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
  db.pragma('cache_size = -64000'); // 64MB cache
  db.pragma('foreign_keys = ON');

  // Create tables
  db.exec(`
    -- Coins we track
    CREATE TABLE IF NOT EXISTS coins (
      symbol TEXT PRIMARY KEY,
      base_asset TEXT NOT NULL,
      quote_asset TEXT NOT NULL DEFAULT 'USDT',
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Price data (OHLCV candles)
    CREATE TABLE IF NOT EXISTS candles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      symbol TEXT NOT NULL,
      interval TEXT NOT NULL,
      open_time INTEGER NOT NULL,
      open REAL NOT NULL,
      high REAL NOT NULL,
      low REAL NOT NULL,
      close REAL NOT NULL,
      volume REAL NOT NULL,
      close_time INTEGER,
      UNIQUE(symbol, interval, open_time)
    );

    -- Generated signals
    CREATE TABLE IF NOT EXISTS signals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      symbol TEXT NOT NULL,
      signal_type TEXT NOT NULL,
      action TEXT NOT NULL,
      strength REAL NOT NULL DEFAULT 0,
      price_at_signal REAL,
      details TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      expires_at TEXT
    );

    -- Telegram subscribers
    CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      telegram_chat_id TEXT UNIQUE NOT NULL,
      username TEXT,
      tier TEXT DEFAULT 'free',
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Create indexes for performance
    CREATE INDEX IF NOT EXISTS idx_candles_symbol_interval 
      ON candles(symbol, interval);
    CREATE INDEX IF NOT EXISTS idx_candles_open_time 
      ON candles(open_time);
    CREATE INDEX IF NOT EXISTS idx_signals_symbol 
      ON signals(symbol);
    CREATE INDEX IF NOT EXISTS idx_signals_created_at 
      ON signals(created_at);
    CREATE INDEX IF NOT EXISTS idx_signals_action 
      ON signals(action);
  `);

  logger.info(`Database initialized at ${config.dbPath}`);
}
