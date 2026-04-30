import { NextResponse } from 'next/server';

/**
 * GET /api/candles/[symbol] — Fetch real candlestick data from Binance
 * Proxies Binance API so charts work immediately without Oracle VM.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const sym = symbol.toUpperCase();
  const { searchParams } = new URL(request.url);
  const interval = searchParams.get('interval') || '1h';
  const limit = searchParams.get('limit') || '100';

  try {
    const res = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${sym}&interval=${interval}&limit=${limit}`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'Binance API error' }, { status: res.status });
    }

    const data = await res.json();

    // Transform to lightweight-charts format
    const candles = data.map((k: any[]) => ({
      time: Math.floor(k[0] / 1000), // Unix timestamp in seconds
      open: parseFloat(k[1]),
      high: parseFloat(k[2]),
      low: parseFloat(k[3]),
      close: parseFloat(k[4]),
      volume: parseFloat(k[5]),
    }));

    return NextResponse.json(candles);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
