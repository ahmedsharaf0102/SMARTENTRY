import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  // Server
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database
  dbPath: process.env.DB_PATH || path.resolve(__dirname, '../../data/smartentry.db'),

  // Redis
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',

  // Binance
  binanceBaseUrl: process.env.BINANCE_BASE_URL || 'https://api.binance.com',

  // CoinGecko
  coingeckoBaseUrl: process.env.COINGECKO_BASE_URL || 'https://api.coingecko.com/api/v3',

  // Telegram
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
  telegramChannelId: process.env.TELEGRAM_CHANNEL_ID || '',
  telegramVipGroupId: process.env.TELEGRAM_VIP_GROUP_ID || '',

  // Binance Affiliate
  binanceAffiliateRef: process.env.BINANCE_AFFILIATE_REF || '',

  // Analysis Engine
  analysisUrl: process.env.ANALYSIS_URL || 'http://localhost:5000',

  // Cache TTLs (in seconds)
  cache: {
    signalsTTL: 300,       // 5 minutes
    pricesTTL: 60,         // 1 minute
    marketOverviewTTL: 120, // 2 minutes
  },
} as const;
