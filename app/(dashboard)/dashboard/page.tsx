import { createClient } from '@/lib/supabase/server';
import { Radio, TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch dashboard data
  const [signalsRes, topBuyRes, topWatchRes] = await Promise.all([
    supabase
      .from('signals')
      .select('action')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
    supabase
      .from('signals')
      .select('*')
      .eq('action', 'BUY')
      .order('strength', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('signals')
      .select('*')
      .eq('action', 'WATCH')
      .order('strength', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  const signals24h = signalsRes.data || [];
  const buyCount = signals24h.filter((s) => s.action === 'BUY').length;
  const watchCount = signals24h.filter((s) => s.action === 'WATCH').length;
  const waitCount = signals24h.filter((s) => s.action === 'WAIT').length;

  const topBuySignals = topBuyRes.data || [];
  const topWatchSignals = topWatchRes.data || [];

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-1"
          style={{ fontFamily: 'var(--font-display)' }}>
          Dashboard
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Real-time market overview — Updated every 5 minutes
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Radio size={20} />} label="Signals (24h)" value={signals24h.length.toString()} color="var(--accent-blue)" />
        <StatCard icon={<TrendingUp size={20} />} label="BUY Signals" value={buyCount.toString()} color="var(--accent-green)" />
        <StatCard icon={<Activity size={20} />} label="WATCH Signals" value={watchCount.toString()} color="var(--accent-yellow)" />
        <StatCard icon={<TrendingDown size={20} />} label="WAIT Signals" value={waitCount.toString()} color="var(--accent-red)" />
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top BUY Signals */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold flex items-center gap-2">
              <TrendingUp size={18} style={{ color: 'var(--accent-green)' }} />
              Top BUY Signals
            </h2>
            <Link href="/signals?action=BUY" className="text-xs font-medium" style={{ color: 'var(--accent-blue)' }}>
              View all →
            </Link>
          </div>
          {topBuySignals.length === 0 ? (
            <EmptyState message="No BUY signals right now" />
          ) : (
            <div className="space-y-3">
              {topBuySignals.map((signal) => (
                <SignalRow key={signal.id} signal={signal} />
              ))}
            </div>
          )}
        </div>

        {/* Top WATCH Signals */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold flex items-center gap-2">
              <Activity size={18} style={{ color: 'var(--accent-yellow)' }} />
              Top WATCH Signals
            </h2>
            <Link href="/signals?action=WATCH" className="text-xs font-medium" style={{ color: 'var(--accent-blue)' }}>
              View all →
            </Link>
          </div>
          {topWatchSignals.length === 0 ? (
            <EmptyState message="No WATCH signals right now" />
          ) : (
            <div className="space-y-3">
              {topWatchSignals.map((signal) => (
                <SignalRow key={signal.id} signal={signal} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 p-4 rounded-xl text-center text-xs"
        style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
        ⚠️ SmartEntry provides signals for educational purposes. This is not financial advice. Always DYOR.
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: {
  icon: React.ReactNode; label: string; value: string; color: string;
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-2">
        <div style={{ color }}>{icon}</div>
        <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</span>
      </div>
      <p className="text-2xl font-extrabold" style={{ color }}>{value}</p>
    </div>
  );
}

function SignalRow({ signal }: { signal: any }) {
  const details = signal.details || {};
  const actionClass = signal.action === 'BUY' ? 'badge-buy' : signal.action === 'WATCH' ? 'badge-watch' : 'badge-wait';

  return (
    <Link href={`/coins/${signal.symbol}`}
      className="flex items-center justify-between p-3 rounded-xl transition-all hover:bg-white/5"
      style={{ border: '1px solid var(--border-color)' }}>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold"
          style={{ background: 'var(--accent-blue-dim)', color: 'var(--accent-blue)' }}>
          {signal.symbol.replace('USDT', '').slice(0, 3)}
        </div>
        <div>
          <p className="text-sm font-semibold">{signal.symbol}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {signal.signal_type.replace(/_/g, ' ')} • ${signal.price_at_signal?.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-bold">{signal.strength}/100</p>
        </div>
        <span className={actionClass}>{signal.action}</span>
      </div>
    </Link>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <BarChart3 size={32} style={{ color: 'var(--text-muted)' }} className="mb-2" />
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{message}</p>
      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Signals will appear after analysis runs</p>
    </div>
  );
}
