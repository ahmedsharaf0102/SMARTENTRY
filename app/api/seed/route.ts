import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/seed — Populate database with real Binance data + demo signals
 * This runs on Vercel serverless — no local Python needed for initial data.
 * Protected by a secret key to prevent abuse.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  // Simple protection
  if (key !== 'smartentry2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();

  try {
    // Step 1: Insert coins
    const coins = [
      'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT',
      'ADAUSDT', 'DOGEUSDT', 'AVAXUSDT', 'DOTUSDT', 'LINKUSDT',
      'LTCUSDT', 'ATOMUSDT', 'NEARUSDT', 'UNIUSDT', 'APTUSDT',
      'ARBUSDT', 'OPUSDT', 'SUIUSDT', 'PEPEUSDT', 'INJUSDT',
    ].map((symbol) => ({
      symbol,
      base_asset: symbol.replace('USDT', ''),
      quote_asset: 'USDT',
      is_active: true,
    }));

    await supabase.from('coins').upsert(coins, { onConflict: 'symbol' });

    // Step 2: Fetch real prices from Binance
    const priceRes = await fetch('https://api.binance.com/api/v3/ticker/price');
    const allPrices = await priceRes.json();
    const priceMap: Record<string, number> = {};
    allPrices.forEach((p: { symbol: string; price: string }) => {
      priceMap[p.symbol] = parseFloat(p.price);
    });

    // Step 3: Generate realistic signals based on real prices
    const signalTypes = [
      { type: 'RSI_OVERSOLD', actions: ['BUY', 'WATCH'], strengthRange: [55, 88] },
      { type: 'MACD_CROSSOVER', actions: ['BUY', 'WATCH'], strengthRange: [40, 72] },
      { type: 'VOLUME_SPIKE', actions: ['WATCH', 'WAIT'], strengthRange: [30, 58] },
      { type: 'EMA_CROSSOVER', actions: ['WATCH', 'WAIT'], strengthRange: [35, 55] },
    ];

    const signals = [];
    for (const coin of coins) {
      const price = priceMap[coin.symbol] || 0;
      if (!price) continue;

      // Generate 1-3 signals per coin
      const numSignals = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numSignals; i++) {
        const sigType = signalTypes[Math.floor(Math.random() * signalTypes.length)];
        const strength = Math.floor(
          Math.random() * (sigType.strengthRange[1] - sigType.strengthRange[0]) + sigType.strengthRange[0]
        );
        const action = strength >= 70 ? 'BUY' : strength >= 40 ? 'WATCH' : 'WAIT';

        signals.push({
          symbol: coin.symbol,
          signal_type: sigType.type,
          action,
          strength,
          price_at_signal: price,
          details: {
            rsi: parseFloat((Math.random() * 50 + 15).toFixed(1)),
            volume_ratio: parseFloat((Math.random() * 2 + 0.8).toFixed(2)),
            description: `${sigType.type.replace(/_/g, ' ')} detected at $${price.toLocaleString()}`,
          },
          created_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        });
      }
    }

    await supabase.from('signals').insert(signals);

    return NextResponse.json({
      success: true,
      coins_inserted: coins.length,
      signals_inserted: signals.length,
      message: 'Database seeded with real Binance prices!',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
