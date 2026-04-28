import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function CoinDetailPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const supabase = await createClient();

  const [coinRes, signalsRes] = await Promise.all([
    supabase.from('coins').select('*').eq('symbol', symbol.toUpperCase()).single(),
    supabase.from('signals').select('*').eq('symbol', symbol.toUpperCase())
      .order('created_at', { ascending: false }).limit(10),
  ]);

  const coin = coinRes.data;
  const signals = signalsRes.data || [];

  return (
    <div className="fade-in">
      <Link href="/coins" className="flex items-center gap-1 text-sm mb-6 hover:underline"
        style={{ color: 'var(--accent-blue)' }}>
        <ArrowLeft size={16} /> Back to Coins
      </Link>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold"
          style={{ background: 'var(--accent-blue-dim)', color: 'var(--accent-blue)' }}>
          {symbol.replace('USDT', '').slice(0, 3).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold" style={{ fontFamily: 'var(--font-display)' }}>
            {symbol.toUpperCase()}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {coin?.base_asset || symbol.replace('USDT', '')} / {coin?.quote_asset || 'USDT'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="font-bold mb-4">Price Chart</h2>
            <div className="w-full h-80 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
              📈 TradingView chart — coming in Phase 2
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4"
              style={{ color: 'var(--text-muted)' }}>Signal History</h3>
            {signals.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No signals yet</p>
            ) : (
              <div className="space-y-3">
                {signals.map((s) => {
                  const ac = s.action === 'BUY' ? 'badge-buy' : s.action === 'WATCH' ? 'badge-watch' : 'badge-wait';
                  return (
                    <div key={s.id} className="flex items-center justify-between p-2 rounded-lg"
                      style={{ background: 'var(--bg-tertiary)' }}>
                      <div>
                        <span className={ac}>{s.action}</span>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                          {s.signal_type.replace(/_/g, ' ')}
                        </p>
                      </div>
                      <span className="text-sm font-bold">{s.strength}/100</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <a href={`https://www.binance.com/en/trade/${symbol.replace('USDT', '')}_USDT`}
            target="_blank" rel="noopener noreferrer"
            className="block w-full text-center py-3 rounded-xl font-bold text-white hover:-translate-y-0.5 transition-all"
            style={{ background: 'var(--gradient-primary)' }}>
            Trade on Binance →
          </a>
        </div>
      </div>
    </div>
  );
}
