import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import CoinChartSection from './CoinChartSection';

export default async function CoinDetailPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const sym = symbol.toUpperCase();
  const supabase = await createClient();

  const [coinRes, signalsRes, candlesRes] = await Promise.all([
    supabase.from('coins').select('*').eq('symbol', sym).single(),
    supabase.from('signals').select('*').eq('symbol', sym)
      .order('created_at', { ascending: false }).limit(10),
    supabase.from('candles').select('*').eq('symbol', sym).eq('interval', '1h')
      .order('open_time', { ascending: true }).limit(100),
  ]);

  const coin = coinRes.data;
  const signals = signalsRes.data || [];
  const candles = candlesRes.data || [];

  // Format candles for chart
  const chartData = candles.map((c) => ({
    time: new Date(c.open_time).toISOString().split('T')[0],
    open: c.open,
    high: c.high,
    low: c.low,
    close: c.close,
  }));

  const latestSignal = signals[0];
  const latestPrice = latestSignal?.price_at_signal || candles[candles.length - 1]?.close;

  return (
    <div className="fade-in">
      <Link href="/coins" className="flex items-center gap-1 text-sm mb-6 hover:underline"
        style={{ color: 'var(--accent-blue)' }}>
        <ArrowLeft size={16} /> Back to Coins
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold"
            style={{ background: 'var(--accent-blue-dim)', color: 'var(--accent-blue)' }}>
            {sym.replace('USDT', '').slice(0, 3)}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold flex items-center gap-2"
              style={{ fontFamily: 'var(--font-display)' }}>
              {sym}
              {latestSignal && (
                <span className={latestSignal.action === 'BUY' ? 'badge-buy' :
                  latestSignal.action === 'WATCH' ? 'badge-watch' : 'badge-wait'}>
                  {latestSignal.action}
                </span>
              )}
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {coin?.base_asset || sym.replace('USDT', '')} / USDT
              {latestPrice && <span className="ml-2 font-semibold" style={{ color: 'var(--text-primary)' }}>
                ${latestPrice.toLocaleString()}
              </span>}
            </p>
          </div>
        </div>
        <a href={`https://www.binance.com/en/trade/${sym.replace('USDT', '')}_USDT`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white hover:-translate-y-0.5 transition-all"
          style={{ background: 'var(--gradient-primary)' }}>
          Trade on Binance <ExternalLink size={14} />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 card p-6">
          <h2 className="font-bold mb-4">Price Chart (1H)</h2>
          <CoinChartSection data={chartData} />
        </div>

        {/* Signal History */}
        <div className="space-y-4">
          <div className="card p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4"
              style={{ color: 'var(--text-muted)' }}>Signal History</h3>
            {signals.length === 0 ? (
              <p className="text-sm py-4 text-center" style={{ color: 'var(--text-muted)' }}>
                No signals yet — run analysis to generate
              </p>
            ) : (
              <div className="space-y-3">
                {signals.map((s) => {
                  const ac = s.action === 'BUY' ? 'badge-buy' : s.action === 'WATCH' ? 'badge-watch' : 'badge-wait';
                  const timeAgo = getTimeAgo(s.created_at);
                  return (
                    <div key={s.id} className="p-3 rounded-xl"
                      style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={ac}>{s.action}</span>
                        <span className="text-sm font-bold">{s.strength}/100</span>
                      </div>
                      <p className="text-xs font-medium">{s.signal_type.replace(/_/g, ' ')}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                        ${s.price_at_signal?.toLocaleString()} • {timeAgo}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Indicator Summary */}
          {latestSignal?.details && (
            <div className="card p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4"
                style={{ color: 'var(--text-muted)' }}>Latest Indicators</h3>
              <div className="space-y-2">
                {latestSignal.details.rsi && (
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--text-secondary)' }}>RSI (14)</span>
                    <span className="font-medium">{latestSignal.details.rsi}</span>
                  </div>
                )}
                {latestSignal.details.volume_ratio && (
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--text-secondary)' }}>Volume Ratio</span>
                    <span className="font-medium">{latestSignal.details.volume_ratio}x</span>
                  </div>
                )}
                {latestSignal.details.description && (
                  <p className="text-xs mt-2 p-2 rounded-lg"
                    style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                    {latestSignal.details.description}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
