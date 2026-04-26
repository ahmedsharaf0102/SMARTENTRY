/**
 * Telegram notification service
 * Used by the backend to send alerts when triggered by n8n or internal cron.
 */
import { config } from '../config';
import { logger } from '../utils/logger';

const TELEGRAM_API = `https://api.telegram.org/bot${config.telegramBotToken}`;

interface SendMessageOptions {
  chatId: string;
  text: string;
  parseMode?: 'Markdown' | 'HTML';
}

/**
 * Send a message to a Telegram chat/channel
 */
export async function sendTelegramMessage(options: SendMessageOptions): Promise<boolean> {
  if (!config.telegramBotToken) {
    logger.warn('Telegram bot token not configured — skipping message');
    return false;
  }

  try {
    const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: options.chatId,
        text: options.text,
        parse_mode: options.parseMode || 'Markdown',
        disable_web_page_preview: true,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      logger.error('Telegram API error:', error);
      return false;
    }

    return true;
  } catch (error) {
    logger.error('Failed to send Telegram message:', error);
    return false;
  }
}

/**
 * Send a signal alert to the public channel
 */
export async function sendSignalAlert(signal: {
  symbol: string;
  action: string;
  strength: number;
  signal_type: string;
  price_at_signal: number;
  details: string;
}): Promise<void> {
  const emoji = signal.action === 'BUY' ? '🟢' : signal.action === 'WATCH' ? '🟡' : '🔴';
  const details = JSON.parse(signal.details || '{}');

  const message =
    `${emoji} *${signal.action} Signal — ${signal.symbol}*\n\n` +
    `📊 Type: ${signal.signal_type}\n` +
    `💪 Strength: ${signal.strength}/100\n` +
    `💰 Price: $${signal.price_at_signal}\n` +
    `${details.description ? `📝 ${details.description}\n` : ''}` +
    `\n_SmartEntry — Trade Smarter_`;

  // Send to free channel
  if (config.telegramChannelId) {
    await sendTelegramMessage({
      chatId: config.telegramChannelId,
      text: message,
    });
  }

  // Send strong signals to VIP group too
  if (signal.strength >= 70 && config.telegramVipGroupId) {
    await sendTelegramMessage({
      chatId: config.telegramVipGroupId,
      text: `🔥 *VIP SIGNAL*\n\n${message}`,
    });
  }
}
