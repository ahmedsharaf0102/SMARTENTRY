# Folder: lib

Generated from SmartEntry project.
Secrets are automatically redacted.


---

## File: lib\api.ts

```typescript
/**
 * SmartEntry API Client
 * Centralized fetch wrapper for all API calls.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return { data: null, error: errorData.error || `HTTP ${res.status}` };
    }

    const data = await res.json();
    return { data, error: null };
  } catch (err) {
    return { data: null, error: 'Network error — please try again' };
  }
}

// ── Signal Endpoints ─────────────────────────────────

export async function getSignals(params?: { action?: string; limit?: number; offset?: number }) {
  const query = new URLSearchParams();
  if (params?.action) query.set('action', params.action);
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.offset) query.set('offset', String(params.offset));

  return fetchApi(`/signals?${query.toString()}`);
}

export async function getTopSignals(limit: number = 10) {
  return fetchApi(`/signals/top?limit=${limit}`);
}

export async function getSignalsSummary() {
  return fetchApi('/signals/summary');
}

// ── Coin Endpoints ───────────────────────────────────

export async function getCoinDetail(symbol: string) {
  return fetchApi(`/coins/${symbol}`);
}

export async function getCoinsList(limit: number = 50) {
  return fetchApi(`/coins?limit=${limit}`);
}

// ── Market Endpoints ─────────────────────────────────

export async function getMarketOverview() {
  return fetchApi('/market/overview');
}

```

---

## File: lib\constants.ts

```typescript
export const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const BINANCE_REF_CODE = process.env.NEXT_PUBLIC_BINANCE_AFFILIATE_REF || 'GRO_28502_BM9FA';

export const BINANCE_REFERRAL_URL = `https://www.binance.com/en/register?ref=${BINANCE_REF_CODE}`;

// Gold — Exness referral
export const GOLD_REFERRAL_URL = 'https://one.exnessonelink.com/a/8n69d5vrfl';

export function getBinanceTradeUrl(symbol: string): string {
  const base = symbol.replace('USDT', '');
  return `https://www.binance.com/en/trade/${base}_USDT?ref=${BINANCE_REF_CODE}`;
}

/**
 * Get the CSS class for a signal action badge
 */
export function getActionBadgeClass(action: string): string {
  switch (action) {
    case 'STRONG_BUY': return 'badge-strong-buy';
    case 'BUY': return 'badge-buy';
    case 'WATCH': return 'badge-watch';
    case 'WAIT': return 'badge-wait';
    case 'AVOID': return 'badge-avoid';
    default: return 'badge-wait';
  }
}

/**
 * Signal action display labels
 */
export const SIGNAL_ACTIONS = {
  STRONG_BUY: { label: 'STRONG BUY', color: 'var(--accent-green)', class: 'badge-strong-buy' },
  BUY: { label: 'BUY', color: 'var(--accent-green)', class: 'badge-buy' },
  WATCH: { label: 'WATCH', color: 'var(--accent-yellow)', class: 'badge-watch' },
  WAIT: { label: 'WAIT', color: 'var(--accent-red)', class: 'badge-wait' },
  AVOID: { label: 'AVOID', color: 'var(--text-muted)', class: 'badge-avoid' },
} as const;

/**
 * Signal types — v2 (12-indicator system)
 */
export const SIGNAL_TYPES = {
  FULL_CONVERGENCE: 'Full Convergence',
  RSI_MOMENTUM_CONVERGENCE: 'RSI + Momentum Convergence',
  ICHIMOKU_BREAKOUT: 'Ichimoku Breakout',
  MOMENTUM_SURGE: 'Momentum Surge',
  TREND_REVERSAL: 'Trend Reversal',
  VOLUME_ACCUMULATION: 'Volume Accumulation',
  // Legacy types
  RSI_OVERSOLD: 'RSI Oversold',
  RSI_OVERBOUGHT: 'RSI Overbought',
  MACD_CROSSOVER: 'MACD Crossover',
  VOLUME_SPIKE: 'Volume Spike',
  EMA_CROSSOVER: 'EMA Crossover',
} as const;

/**
 * Refresh intervals (in milliseconds)
 */
export const REFRESH_INTERVALS = {
  SIGNALS: 60_000,
  PRICES: 30_000,
  MARKET_OVERVIEW: 120_000,
} as const;

```

---

## File: lib\supabase\client.ts

```typescript
/**
 * Supabase Browser Client
 * Use this in Client Components (use client)
 */
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

```

---

## File: lib\supabase\server.ts

```typescript
/**
 * Supabase Server Client
 * Use this in Server Components, API Routes, and Server Actions
 */
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignore errors in Server Components (read-only)
          }
        },
      },
    }
  );
}

/**
 * Admin client with service role key — bypasses RLS
 * Only use in server-side code for admin operations
 */
export function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return []; },
        setAll() {},
      },
    }
  );
}

```

---

## File: lib\utils.ts

```typescript
/**
 * Format a number as a currency price
 */
export function formatPrice(price: number): string {
  if (price >= 1) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return price.toPrecision(4);
}

/**
 * Format large numbers with K/M/B suffixes
 */
export function formatVolume(volume: number): string {
  if (volume >= 1_000_000_000) return `${(volume / 1_000_000_000).toFixed(2)}B`;
  if (volume >= 1_000_000) return `${(volume / 1_000_000).toFixed(2)}M`;
  if (volume >= 1_000) return `${(volume / 1_000).toFixed(2)}K`;
  return volume.toFixed(2);
}

/**
 * Format percentage with sign
 */
export function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Get action badge CSS class
 */
export function getActionClass(action: string): string {
  switch (action.toUpperCase()) {
    case 'BUY': return 'badge-buy';
    case 'WATCH': return 'badge-watch';
    case 'WAIT': return 'badge-wait';
    default: return '';
  }
}

/**
 * Get action color
 */
export function getActionColor(action: string): string {
  switch (action.toUpperCase()) {
    case 'BUY': return 'var(--accent-green)';
    case 'WATCH': return 'var(--accent-yellow)';
    case 'WAIT': return 'var(--accent-red)';
    default: return 'var(--text-secondary)';
  }
}

/**
 * Format relative time (e.g., "2 minutes ago")
 */
export function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

```
