import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { BarChart3 } from 'lucide-react';

export default async function CoinsPage() {
  const supabase = await createClient();

  const { data: coins } = await supabase
    .from('coins')
    .select('*')
    .eq('is_active', true)
    .order('symbol');

  const { data: latestSignals } = await supabase
    .from('signals')
    .select('symbol, action, strength, created_at')
    .order('created_at', { ascending: false });

  const signalMap: Record<string, any> = {};
  latestSignals?.forEach((s) => {
    if (!signalMap[s.symbol]) signalMap[s.symbol] = s;
  });

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2"
          style={{ fontFamily: 'var(--font-display)' }}>
          <BarChart3 size={28} style={{ color: 'var(--accent-blue)' }} />
          Tracked Coins
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          {coins?.length || 0} coins being analyzed
        </p>
      </div>

      {!coins || coins.length === 0 ? (
        <div className="card p-12 text-center">
          <BarChart3 size={40} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="font-semibold mb-1">No coins tracked yet</p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Coins will appear after the analysis engine runs.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {coins.map((coin) => {
            const signal = signalMap[coin.symbol];
            const ac = signal?.action === 'BUY' ? 'badge-buy' :
              signal?.action === 'WATCH' ? 'badge-watch' : signal?.action === 'WAIT' ? 'badge-wait' : '';
            return (
              <Link key={coin.symbol} href={`/coins/${coin.symbol}`} className="card p-5 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                      style={{ background: 'var(--accent-blue-dim)', color: 'var(--accent-blue)' }}>
                      {coin.base_asset.slice(0, 3)}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{coin.symbol}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{coin.base_asset}/{coin.quote_asset}</p>
                    </div>
                  </div>
                  {signal && <span className={ac}>{signal.action}</span>}
                </div>
                {signal ? (
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Strength: {signal.strength}/100</p>
                ) : (
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No signals yet</p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
