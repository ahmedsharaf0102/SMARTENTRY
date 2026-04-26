# n8n Workflows for SmartEntry

This directory contains exportable n8n workflow JSON files.

## Workflows

### 1. `fetch-market-data.json`
**Trigger:** Cron — every 5 minutes (`*/5 * * * *`)
**Flow:**
1. HTTP Request → Binance `/api/v3/ticker/24hr`
2. Code Node → Filter top 50 USDT pairs
3. HTTP Request → POST to Python Analysis Engine `/analyze`
4. IF Node → Check if new signals were generated
5. HTTP Request → POST to Backend `/api/internal/cache-invalidate`

### 2. `run-analysis.json`
**Trigger:** Webhook (called by workflow 1 or manually)
**Flow:**
1. Receive symbol list
2. Loop through symbols
3. POST each to Python `/analyze`
4. Aggregate results

### 3. `send-telegram-alerts.json`
**Trigger:** Webhook (called after analysis completes)
**Flow:**
1. Receive new signals
2. Code Node → Format Telegram message with emojis
3. IF Node → Check signal strength
   - >= 70 (BUY): Send to both VIP and Free channels
   - 50-69 (WATCH): Send to Free channel only
4. Telegram Node → Send message

### 4. `daily-report.json`
**Trigger:** Cron — daily at 8:00 AM UTC (`0 8 * * *`)
**Flow:**
1. HTTP Request → GET `/api/signals/summary`
2. HTTP Request → GET `/api/signals/top?limit=10`
3. Code Node → Build daily digest markdown
4. Telegram Node → Send to all channels

## Setup Instructions

1. Open n8n dashboard
2. Go to **Workflows → Import from File**
3. Import each JSON file
4. Configure credentials:
   - Telegram Bot Token
   - Internal API URL (http://backend:4000)
   - Analysis URL (http://analysis:5000)
5. Activate workflows

## Important Notes

- Workflows use internal Docker network URLs (service names)
- Rate limiting is handled by the Python analysis engine
- Cache invalidation ensures the frontend always shows fresh data
