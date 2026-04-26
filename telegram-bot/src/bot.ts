/**
 * SmartEntry Telegram Bot
 * Delivers crypto trading signals to users via Telegram.
 * 
 * Commands:
 *   /start     - Welcome message & subscribe
 *   /signals   - Latest top 5 signals
 *   /coin BTC  - Quick analysis for a coin
 *   /help      - Show available commands
 */
import { Bot } from 'grammy';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API_URL = process.env.API_URL || 'http://localhost:4000';

if (!BOT_TOKEN) {
  console.error('TELEGRAM_BOT_TOKEN is required');
  process.exit(1);
}

const bot = new Bot(BOT_TOKEN);

// ── /start ─────────────────────────────────────────────
bot.command('start', async (ctx) => {
  await ctx.reply(
    `🚀 *Welcome to SmartEntry!*\n\n` +
    `I deliver real-time crypto trading signals powered by technical analysis.\n\n` +
    `📊 *Commands:*\n` +
    `/signals — Latest top signals\n` +
    `/coin BTC — Quick coin analysis\n` +
    `/help — Show all commands\n\n` +
    `💡 Signals are updated every 5 minutes.`,
    { parse_mode: 'Markdown' }
  );
});

// ── /signals ───────────────────────────────────────────
bot.command('signals', async (ctx) => {
  try {
    const res = await fetch(`${API_URL}/api/signals/top?limit=5`);
    const data = await res.json();

    if (!data.signals || data.signals.length === 0) {
      return ctx.reply('No active signals right now. Check back soon! 📊');
    }

    let message = '📊 *Top Trading Signals*\n\n';

    for (const signal of data.signals) {
      const emoji = signal.action === 'BUY' ? '🟢' : signal.action === 'WATCH' ? '🟡' : '🔴';
      const details = JSON.parse(signal.details || '{}');

      message += `${emoji} *${signal.symbol}* — ${signal.action}\n`;
      message += `   Strength: ${signal.strength}/100\n`;
      message += `   Type: ${signal.signal_type}\n`;
      message += `   Price: $${signal.price_at_signal}\n\n`;
    }

    message += `_Updated: ${new Date().toLocaleTimeString()}_`;

    await ctx.reply(message, { parse_mode: 'Markdown' });
  } catch (error) {
    await ctx.reply('⚠️ Unable to fetch signals. Please try again later.');
  }
});

// ── /coin <symbol> ─────────────────────────────────────
bot.command('coin', async (ctx) => {
  const symbol = ctx.match?.toUpperCase();

  if (!symbol) {
    return ctx.reply('Usage: `/coin BTC` or `/coin ETHUSDT`', { parse_mode: 'Markdown' });
  }

  const pair = symbol.endsWith('USDT') ? symbol : `${symbol}USDT`;

  try {
    const res = await fetch(`${API_URL}/api/coins/${pair}`);
    if (!res.ok) {
      return ctx.reply(`❌ Coin ${pair} not found.`);
    }
    const data = await res.json();

    let message = `📈 *${pair} Analysis*\n\n`;

    if (data.signals && data.signals.length > 0) {
      const latest = data.signals[0];
      const emoji = latest.action === 'BUY' ? '🟢' : latest.action === 'WATCH' ? '🟡' : '🔴';
      message += `Signal: ${emoji} *${latest.action}* (${latest.strength}/100)\n`;
      message += `Type: ${latest.signal_type}\n`;
      message += `Price: $${latest.price_at_signal}\n`;
    } else {
      message += `No active signals for this coin.\n`;
    }

    await ctx.reply(message, { parse_mode: 'Markdown' });
  } catch (error) {
    await ctx.reply('⚠️ Unable to fetch coin data. Please try again later.');
  }
});

// ── /help ──────────────────────────────────────────────
bot.command('help', async (ctx) => {
  await ctx.reply(
    `📋 *SmartEntry Commands*\n\n` +
    `/signals — Top 5 trading signals\n` +
    `/coin BTC — Analysis for a specific coin\n` +
    `/help — Show this message\n\n` +
    `🌐 Visit: smartentry.io`,
    { parse_mode: 'Markdown' }
  );
});

// ── Start Bot ──────────────────────────────────────────
bot.start();
console.log('🤖 SmartEntry Telegram Bot is running!');
