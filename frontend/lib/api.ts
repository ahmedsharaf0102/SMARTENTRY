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
