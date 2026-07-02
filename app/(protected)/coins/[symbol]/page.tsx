import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { getBinanceTradeUrl, getActionBadgeClass } from '@/lib/constants';
import CoinTabs from './CoinTabs';

export default async function CoinDetailPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const sym = symbol.toUpperCase();

  // Don't render for /coins/gold — that has its own page
  if (sym === 'GOLD') return null;

  const supabase = await createClient();

  const [coinRes, signalsRes] = await Promise.all([
    supabase.from('coins').select('*').eq('symbol', sym).single(),
    supabase.from('signals').select('*').eq('symbol', sym)
      .order('created_at', { ascending: false }).limit(10),
  ]);

  const coin = coinRes.data;
  const signals = signalsRes.data || [];
  const latestSignal = signals[0];

  return (
    <div className="fade-in">
      <Link href="/coins" className="flex items-center gap-1 text-sm mb-6 hover:underline"
        style={{ color: 'var(--accent-blue)' }}>
        <ArrowLeft size={16} /> Back to Coins
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
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
                <span className={getActionBadgeClass(latestSignal.action)}>
                  {latestSignal.action.replace('_', ' ')}
                </span>
              )}
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {coin?.base_asset || sym.replace('USDT', '')} / USDT
              {latestSignal?.price_at_signal && (
                <span className="ml-2 font-semibold" style={{ color: 'var(--text-primary)' }}>
                  ${latestSignal.price_at_signal.toLocaleString()}
                </span>
              )}
            </p>
          </div>
        </div>
        <a href={getBinanceTradeUrl(sym)}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white hover:-translate-y-0.5 transition-all"
          style={{ background: 'var(--gradient-primary)' }}>
          Trade on Binance <ExternalLink size={14} />
        </a>
      </div>

      {/* Tabs: Chart | Signals */}
      <CoinTabs symbol={sym} signals={signals} />
    </div>
  );
}
