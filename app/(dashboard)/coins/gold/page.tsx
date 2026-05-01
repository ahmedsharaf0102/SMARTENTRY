import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { getBinanceTradeUrl } from '@/lib/constants';
import GoldTabs from './GoldTabs';

export default async function GoldPage() {
  const supabase = await createClient();

  // Fetch gold signals (PAXGUSDT = gold-backed token on Binance)
  const [signalsRes, macroRes] = await Promise.all([
    supabase.from('signals').select('*').eq('symbol', 'PAXGUSDT')
      .order('created_at', { ascending: false }).limit(10),
    supabase.from('gold_macro').select('*')
      .order('created_at', { ascending: false }).limit(1),
  ]);

  const signals = signalsRes.data || [];
  const macro = macroRes.data?.[0] || null;
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
          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: 'linear-gradient(135deg, rgba(255, 170, 0, 0.2), rgba(255, 215, 0, 0.1))', color: '#FFD700' }}>
            🥇
          </div>
          <div>
            <h1 className="text-2xl font-extrabold flex items-center gap-2"
              style={{ fontFamily: 'var(--font-display)' }}>
              XAUUSD
              {latestSignal && (
                <span className={
                  latestSignal.action === 'STRONG_BUY' ? 'badge-strong-buy' :
                  latestSignal.action === 'BUY' ? 'badge-buy' :
                  latestSignal.action === 'WATCH' ? 'badge-watch' :
                  latestSignal.action === 'WAIT' ? 'badge-wait' : 'badge-avoid'
                }>
                  {latestSignal.action.replace('_', ' ')}
                </span>
              )}
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Gold / USD — Macro + Technical Analysis
              {latestSignal?.price_at_signal && (
                <span className="ml-2 font-semibold" style={{ color: '#FFD700' }}>
                  ${latestSignal.price_at_signal.toLocaleString()}
                </span>
              )}
            </p>
          </div>
        </div>
        <a href="https://www.binance.com/en/trade/PAXG_USDT?ref=GRO_28502_BM9FA"
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-black hover:-translate-y-0.5 transition-all"
          style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}>
          Trade Gold <ExternalLink size={14} />
        </a>
      </div>

      {/* Tabs */}
      <GoldTabs signals={signals} macro={macro} />
    </div>
  );
}
