import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET /api/seed — Populate database with real Binance prices + demo signals
 * Uses direct Supabase client (not SSR) to avoid cookie issues on API routes.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (key !== 'smartentry2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({
      error: 'Missing env vars',
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
    }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Step 1: Insert coins
    const coinSymbols = [
      'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT',
      'ADAUSDT', 'DOGEUSDT', 'AVAXUSDT', 'DOTUSDT', 'LINKUSDT',
      'LTCUSDT', 'ATOMUSDT', 'NEARUSDT', 'UNIUSDT', 'APTUSDT',
      'ARBUSDT', 'OPUSDT', 'SUIUSDT', 'PEPEUSDT', 'INJUSDT',
    ];

    const coins = coinSymbols.map((symbol) => ({
      symbol,
      base_asset: symbol.replace('USDT', ''),
      quote_asset: 'USDT',
      is_active: true,
    }));

    const { error: coinsError } = await supabase.from('coins').upsert(coins, { onConflict: 'symbol' });
    if (coinsError) {
      return NextResponse.json({ error: 'Coins insert failed', details: coinsError.message }, { status: 500 });
    }

    // Step 2: Fetch real prices from Binance
    let priceMap: Record<string, number> = {};
    try {
      const priceRes = await fetch('https://api.binance.com/api/v3/ticker/price', {
        signal: AbortSignal.timeout(8000),
      });
      const allPrices = await priceRes.json();
      allPrices.forEach((p: { symbol: string; price: string }) => {
        priceMap[p.symbol] = parseFloat(p.price);
      });
    } catch {
      // Fallback prices if Binance is unreachable
      priceMap = {
        BTCUSDT: 67420, ETHUSDT: 3280, BNBUSDT: 598, SOLUSDT: 148,
        XRPUSDT: 0.52, ADAUSDT: 0.44, DOGEUSDT: 0.15, AVAXUSDT: 35.6,
        DOTUSDT: 7.12, LINKUSDT: 14.3, LTCUSDT: 83, ATOMUSDT: 8.9,
        NEARUSDT: 5.4, UNIUSDT: 7.8, APTUSDT: 8.5, ARBUSDT: 1.05,
        OPUSDT: 2.3, SUIUSDT: 3.2, PEPEUSDT: 0.0000089, INJUSDT: 24.5,
      };
    }

    // Step 3: Generate realistic signals
    const signalTypes = [
      { type: 'RSI_OVERSOLD', baseStrength: [55, 88] },
      { type: 'MACD_CROSSOVER', baseStrength: [40, 75] },
      { type: 'VOLUME_SPIKE', baseStrength: [30, 60] },
      { type: 'EMA_CROSSOVER', baseStrength: [35, 58] },
    ];

    const signals = [];
    for (const sym of coinSymbols) {
      const price = priceMap[sym] || 100;
      const numSignals = Math.floor(Math.random() * 3) + 1;

      for (let i = 0; i < numSignals; i++) {
        const sigType = signalTypes[Math.floor(Math.random() * signalTypes.length)];
        const strength = Math.floor(
          Math.random() * (sigType.baseStrength[1] - sigType.baseStrength[0]) + sigType.baseStrength[0]
        );
        const action = strength >= 70 ? 'BUY' : strength >= 40 ? 'WATCH' : 'WAIT';
        const rsi = parseFloat((Math.random() * 50 + 15).toFixed(1));
        const volumeRatio = parseFloat((Math.random() * 2 + 0.8).toFixed(2));

        signals.push({
          symbol: sym,
          signal_type: sigType.type,
          action,
          strength,
          price_at_signal: price,
          details: {
            rsi,
            volume_ratio: volumeRatio,
            sma_50: price * (0.95 + Math.random() * 0.1),
            description: `${sigType.type.replace(/_/g, ' ')} — RSI at ${rsi}, Volume ${volumeRatio}x avg`,
          },
          created_at: new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000).toISOString(),
        });
      }
    }

    const { error: signalsError } = await supabase.from('signals').insert(signals);
    if (signalsError) {
      return NextResponse.json({ error: 'Signals insert failed', details: signalsError.message }, { status: 500 });
    }

    const buyCount = signals.filter((s) => s.action === 'BUY').length;
    const watchCount = signals.filter((s) => s.action === 'WATCH').length;
    const waitCount = signals.filter((s) => s.action === 'WAIT').length;

    return NextResponse.json({
      success: true,
      coins_inserted: coins.length,
      signals_inserted: signals.length,
      breakdown: { BUY: buyCount, WATCH: watchCount, WAIT: waitCount },
      sample_prices: {
        BTC: priceMap['BTCUSDT'],
        ETH: priceMap['ETHUSDT'],
        SOL: priceMap['SOLUSDT'],
      },
      message: '✅ Database seeded successfully!',
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack?.split('\n').slice(0, 3),
    }, { status: 500 });
  }
}
