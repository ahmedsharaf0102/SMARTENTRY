# Folder: app

Generated from SmartEntry project.
Secrets are automatically redacted.


---

## File: app\(dashboard)\coins\[symbol]\CoinChartSection.tsx

```tsx
[Could not read file: A parameter cannot be found that matches parameter name 'Raw'.]
```

---

## File: app\(dashboard)\coins\[symbol]\CoinTabs.tsx

```tsx
[Could not read file: A parameter cannot be found that matches parameter name 'Raw'.]
```

---

## File: app\(dashboard)\coins\[symbol]\page.tsx

```tsx
[Could not read file: A parameter cannot be found that matches parameter name 'Raw'.]
```

---

## File: app\(dashboard)\coins\gold\GoldTabs.tsx

```tsx
'use client';

import { useState } from 'react';
import { BarChart3, Globe, Radio } from 'lucide-react';
import TradingViewChart from '@/app/components/TradingViewChart';

interface GoldTabsProps {
  signals: any[];
  macro: any;
}

export default function GoldTabs({ signals, macro }: GoldTabsProps) {
  const [activeTab, setActiveTab] = useState<'chart' | 'economics' | 'signals'>('chart');

  const tabs = [
    { id: 'chart' as const, label: 'Chart', icon: <BarChart3 size={16} /> },
    { id: 'economics' as const, label: 'Economic Analysis', icon: <Globe size={16} /> },
    { id: 'signals' as const, label: 'Signals', icon: <Radio size={16} /> },
  ];

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center"
            style={{
              background: activeTab === tab.id ? 'var(--bg-card)' : 'transparent',
              color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
              boxShadow: activeTab === tab.id ? 'var(--shadow-card)' : 'none',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="fade-in">
        {activeTab === 'chart' && <ChartTab />}
        {activeTab === 'economics' && <EconomicsTab macro={macro} />}
        {activeTab === 'signals' && <SignalsTab signals={signals} />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// Tab 1: Full TradingView Chart
// ═══════════════════════════════════════════════════
function ChartTab() {
  return (
    <div className="-mx-4 md:-mx-8 overflow-hidden" style={{ borderRadius: 0 }}>
      <TradingViewChart symbol="OANDA:XAUUSD" fullScreen />
    </div>
  );
}

// ═══════════════════════════════════════════════════
// Tab 2: Economic Analysis (FRED Data)
// ═══════════════════════════════════════════════════
function EconomicsTab({ macro }: { macro: any }) {
  const indicators = [
    { key: 'fed_rate', label: 'Federal Funds Rate', icon: '🏛️', unit: '%',
      desc: 'Lower rates → Gold bullish (lower opportunity cost)' },
    { key: 'cpi', label: 'CPI (Inflation)', icon: '📈', unit: '%',
      desc: 'Higher inflation → Gold bullish (inflation hedge)' },
    { key: 'dxy', label: 'Dollar Index (DXY)', icon: '💵', unit: '',
      desc: 'Weaker dollar → Gold bullish (inverse correlation)' },
    { key: 'treasury_10y', label: 'Treasury 10Y Yield', icon: '📊', unit: '%',
      desc: 'Lower yields → Gold bullish' },
    { key: 'treasury_2y', label: 'Treasury 2Y Yield', icon: '📉', unit: '%',
      desc: 'Yield curve inversion → Gold bullish (recession fear)' },
    { key: 'real_yield', label: 'Real Yields (TIPS)', icon: '⚖️', unit: '%',
      desc: 'Negative real yields → Gold bullish' },
    { key: 'vix', label: 'VIX (Fear Index)', icon: '😨', unit: '',
      desc: 'VIX > 20 → Gold bullish (safe haven demand)' },
    { key: 'm2', label: 'M2 Money Supply', icon: '🖨️', unit: 'T$',
      desc: 'M2 expanding → Gold bullish (currency debasement)' },
    { key: 'unemployment', label: 'Unemployment Rate', icon: '👷', unit: '%',
      desc: 'Rising unemployment → Gold bullish (recession hedge)' },
  ];

  if (!macro) {
    return (
      <div className="card p-8 text-center">
        <Globe size={40} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
        <p className="text-sm font-medium mb-1">Economic data coming soon</p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          FRED API macro indicators will appear here once the gold engine runs on Oracle VM
        </p>
      </div>
    );
  }

  const macroScore = macro?.macro_score || 0;
  const maxScore = 70;

  return (
    <div className="space-y-4">
      {/* Macro Score Card */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">Macro Score</h3>
          <span className="text-2xl font-extrabold" style={{ color: macroScore >= 40 ? 'var(--accent-green)' : macroScore >= 20 ? 'var(--accent-yellow)' : 'var(--accent-red)' }}>
            {macroScore}/{maxScore}
          </span>
        </div>
        <div className="w-full h-2 rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
          <div className="h-2 rounded-full transition-all" style={{
            width: `${(macroScore / maxScore) * 100}%`,
            background: macroScore >= 40 ? 'var(--accent-green)' : macroScore >= 20 ? 'var(--accent-yellow)' : 'var(--accent-red)',
          }} />
        </div>
      </div>

      {/* Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {indicators.map((ind) => {
          const value = macro?.data?.[ind.key];
          const score = macro?.scores?.[ind.key] || 0;
          return (
            <div key={ind.key} className="card p-4 hover:scale-[1.01]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{ind.icon}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md"
                  style={{
                    background: score > 0 ? 'var(--accent-green-dim)' : 'var(--accent-red-dim)',
                    color: score > 0 ? 'var(--accent-green)' : 'var(--accent-red)',
                  }}>
                  {score > 0 ? `+${score}` : '0'} pts
                </span>
              </div>
              <p className="text-sm font-semibold">{ind.label}</p>
              <p className="text-lg font-bold mt-1">
                {value != null ? `${value}${ind.unit}` : '—'}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{ind.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// Tab 3: Signal History + Indicators
// ═══════════════════════════════════════════════════
function SignalsTab({ signals }: { signals: any[] }) {
  if (signals.length === 0) {
    return (
      <div className="card p-8 text-center">
        <Radio size={40} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
        <p className="text-sm font-medium mb-1">No gold signals yet</p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Add PAXGUSDT to the analysis engine to generate gold signals
        </p>
      </div>
    );
  }

  const latestSignal = signals[0];
  const details = latestSignal?.details || {};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Signal History */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4"
          style={{ color: 'var(--text-muted)' }}>Signal History</h3>
        <div className="space-y-3">
          {signals.map((s) => {
            const ac = s.action === 'STRONG_BUY' ? 'badge-strong-buy' :
              s.action === 'BUY' ? 'badge-buy' : s.action === 'WATCH' ? 'badge-watch' :
              s.action === 'WAIT' ? 'badge-wait' : 'badge-avoid';
            return (
              <div key={s.id} className="p-3 rounded-xl"
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className={ac}>{s.action.replace('_', ' ')}</span>
                  <span className="text-sm font-bold">{s.strength}/100</span>
                </div>
                <p className="text-xs font-medium">{s.signal_type?.replace(/_/g, ' ')}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  ${s.price_at_signal?.toLocaleString()} • {getTimeAgo(s.created_at)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Latest Indicators */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4"
          style={{ color: 'var(--text-muted)' }}>Latest Indicators</h3>
        <div className="space-y-2">
          {details.rsi && <IndicatorRow label="RSI (14)" value={details.rsi} />}
          {details.stochrsi && <IndicatorRow label="Stochastic RSI" value={details.stochrsi} />}
          {details.macd_hist && <IndicatorRow label="MACD Histogram" value={details.macd_hist} />}
          {details.mfi && <IndicatorRow label="MFI" value={details.mfi} />}
          {details.adx && <IndicatorRow label="ADX" value={details.adx} />}
          {details.volume_ratio && <IndicatorRow label="Volume Ratio" value={`${details.volume_ratio}x`} />}
          {details.obv_rising != null && <IndicatorRow label="OBV Trend" value={details.obv_rising ? 'Rising ↑' : 'Falling ↓'} />}
          {details.description && (
            <p className="text-xs mt-3 p-3 rounded-lg"
              style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
              {details.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function IndicatorRow({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between text-sm py-1.5" style={{ borderBottom: '1px solid var(--border-color)' }}>
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span className="font-medium">{typeof value === 'number' ? value.toFixed(2) : value}</span>
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

```

---

## File: app\(dashboard)\coins\gold\page.tsx

```tsx
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { GOLD_REFERRAL_URL } from '@/lib/constants';
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
        <a href={GOLD_REFERRAL_URL}
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

```

---

## File: app\(dashboard)\coins\page.tsx

```tsx
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

```

---

## File: app\(dashboard)\dashboard\page.tsx

```tsx
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

```

---

## File: app\(dashboard)\layout.tsx

```tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardNav from '@/app/components/DashboardNav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <DashboardNav user={user} profile={profile} />

      {/* Main Content */}
      <main className="flex-1 min-h-screen ml-0 md:ml-64">
        <div className="p-4 md:p-8 pt-20 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}

```

---

## File: app\(dashboard)\profile\page.tsx

```tsx
import { createClient } from '@/lib/supabase/server';
import { UserCircle, Mail, Calendar, Crown, Shield } from 'lucide-react';
import Link from 'next/link';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user!.id).single();

  const isPro = profile?.subscription_tier === 'pro';
  const isTrial = profile?.subscription_tier === 'trial';
  const trialEnds = profile?.trial_ends_at ? new Date(profile.trial_ends_at) : null;
  const daysLeft = trialEnds ? Math.max(0, Math.ceil((trialEnds.getTime() - Date.now()) / (86400000))) : 0;

  return (
    <div className="fade-in max-w-2xl">
      <h1 className="text-2xl font-extrabold mb-8 flex items-center gap-2"
        style={{ fontFamily: 'var(--font-display)' }}>
        <UserCircle size={28} style={{ color: 'var(--accent-blue)' }} /> Profile
      </h1>

      <div className="card p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{ background: 'var(--accent-blue-dim)', color: 'var(--accent-blue)' }}>
            {(profile?.full_name?.[0] || 'U').toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold">{profile?.full_name || 'User'}</h2>
            <p className="text-sm flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
              <Mail size={14} /> {user?.email}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
            <span className="text-sm flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              <Calendar size={14} /> Member since
            </span>
            <span className="text-sm font-medium">
              {new Date(profile?.created_at || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div className="flex justify-between p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
            <span className="text-sm flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              <Shield size={14} /> Subscription
            </span>
            <span className={`text-sm font-semibold ${isPro ? '' : isTrial ? '' : ''}`}
              style={{ color: isPro ? 'var(--accent-green)' : isTrial ? 'var(--accent-yellow)' : 'var(--accent-red)' }}>
              {isPro ? 'PRO' : isTrial ? `Trial (${daysLeft} days left)` : 'Expired'}
            </span>
          </div>
        </div>
      </div>

      {!isPro && (
        <Link href="/pricing"
          className="card p-6 flex items-center justify-between hover:-translate-y-1 transition-all"
          style={{ border: '1px solid rgba(51,102,255,0.3)' }}>
          <div className="flex items-center gap-3">
            <Crown size={24} style={{ color: 'var(--accent-yellow)' }} />
            <div>
              <p className="font-bold">Upgrade to PRO</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Full access to all signals, alerts & charts
              </p>
            </div>
          </div>
          <span className="font-bold" style={{ color: 'var(--accent-blue)' }}>$19.99/mo →</span>
        </Link>
      )}
    </div>
  );
}

```

---

## File: app\(dashboard)\signals\page.tsx

```tsx
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Radio, Filter } from 'lucide-react';

export default async function SignalsPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; page?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const actionFilter = params.action?.toUpperCase();
  const page = parseInt(params.page || '1', 10);
  const perPage = 20;

  let query = supabase
    .from('signals')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);

  if (actionFilter && ['BUY', 'WATCH', 'WAIT'].includes(actionFilter)) {
    query = query.eq('action', actionFilter);
  }

  const { data: signals, count } = await query;
  const totalPages = Math.ceil((count || 0) / perPage);

  const filters = [
    { label: 'All', value: '', count: null },
    { label: 'BUY', value: 'BUY', color: 'var(--accent-green)' },
    { label: 'WATCH', value: 'WATCH', color: 'var(--accent-yellow)' },
    { label: 'WAIT', value: 'WAIT', color: 'var(--accent-red)' },
  ];

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2"
            style={{ fontFamily: 'var(--font-display)' }}>
            <Radio size={28} style={{ color: 'var(--accent-blue)' }} />
            Trading Signals
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {count || 0} signals found {actionFilter && `• Filtered by ${actionFilter}`}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map((f) => {
          const isActive = (actionFilter || '') === f.value;
          return (
            <Link
              key={f.label}
              href={f.value ? `/signals?action=${f.value}` : '/signals'}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: isActive ? 'var(--accent-blue-dim)' : 'var(--bg-card)',
                color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
              }}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {/* Signals Table */}
      {!signals || signals.length === 0 ? (
        <div className="card p-12 text-center">
          <Filter size={40} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="font-semibold mb-1">No signals found</p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Signals will appear after the analysis engine runs.
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}>Coin</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}>Signal</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}>Action</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}>Strength</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}>Price</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {signals.map((signal) => {
                  const actionClass = signal.action === 'BUY' ? 'badge-buy' : signal.action === 'WATCH' ? 'badge-watch' : 'badge-wait';
                  const timeAgo = getTimeAgo(signal.created_at);
                  return (
                    <tr key={signal.id}
                      className="transition-colors hover:bg-white/5"
                      style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td className="px-6 py-4">
                        <Link href={`/coins/${signal.symbol}`}
                          className="flex items-center gap-3 hover:underline">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                            style={{ background: 'var(--accent-blue-dim)', color: 'var(--accent-blue)' }}>
                            {signal.symbol.replace('USDT', '').slice(0, 3)}
                          </div>
                          <span className="font-semibold text-sm">{signal.symbol}</span>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {signal.signal_type.replace(/_/g, ' ')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={actionClass}>{signal.action}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                            <div className="h-full rounded-full" style={{
                              width: `${signal.strength}%`,
                              background: signal.strength >= 70 ? 'var(--accent-green)' :
                                signal.strength >= 40 ? 'var(--accent-yellow)' : 'var(--accent-red)',
                            }} />
                          </div>
                          <span className="text-sm font-medium">{signal.strength}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        ${signal.price_at_signal?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                        {timeAgo}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y" style={{ borderColor: 'var(--border-color)' }}>
            {signals.map((signal) => {
              const actionClass = signal.action === 'BUY' ? 'badge-buy' : signal.action === 'WATCH' ? 'badge-watch' : 'badge-wait';
              return (
                <Link key={signal.id} href={`/coins/${signal.symbol}`}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ background: 'var(--accent-blue-dim)', color: 'var(--accent-blue)' }}>
                      {signal.symbol.replace('USDT', '').slice(0, 3)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{signal.symbol}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {signal.signal_type.replace(/_/g, ' ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold">{signal.strength}</span>
                    <span className={actionClass}>{signal.action}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {page > 1 && (
            <Link href={`/signals?action=${actionFilter || ''}&page=${page - 1}`}
              className="px-4 py-2 rounded-lg text-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              ← Prev
            </Link>
          )}
          <span className="text-sm px-3" style={{ color: 'var(--text-secondary)' }}>
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/signals?action=${actionFilter || ''}&page=${page + 1}`}
              className="px-4 py-2 rounded-lg text-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              Next →
            </Link>
          )}
        </div>
      )}
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

```

---

## File: app\api\candles\[symbol]\route.ts

```typescript
[Could not read file: A parameter cannot be found that matches parameter name 'Raw'.]
```

---

## File: app\api\seed\route.ts

```typescript
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

```

---

## File: app\auth\callback\route.ts

```typescript
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth error — redirect to login
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}

```

---

## File: app\components\DashboardNav.tsx

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard, Radio, BarChart3, UserCircle,
  LogOut, Menu, X, Crown
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface Props {
  user: User;
  profile: any;
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/signals', label: 'Signals', icon: Radio },
  { href: '/coins', label: 'Coins', icon: BarChart3 },
  { href: '/coins/gold', label: 'Gold', icon: Crown },
  { href: '/profile', label: 'Profile', icon: UserCircle },
];

export default function DashboardNav({ user, profile }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const supabase = createClient();

  const isPro = profile?.subscription_tier === 'pro';
  const isTrial = profile?.subscription_tier === 'trial';
  const trialEnds = profile?.trial_ends_at ? new Date(profile.trial_ends_at) : null;
  const trialDaysLeft = trialEnds
    ? Math.max(0, Math.ceil((trialEnds.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  const navContent = (
    <>
      {/* Logo */}
      <div className="p-6 pb-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white text-sm"
            style={{ background: 'var(--gradient-primary)' }}>
            SE
          </div>
          <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            Smart<span style={{ color: 'var(--accent-blue)' }}>Entry</span>
          </span>
        </Link>
      </div>

      {/* Trial/Pro badge */}
      <div className="px-4 mb-4">
        {isPro ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold"
            style={{ background: 'var(--accent-green-dim)', color: 'var(--accent-green)' }}>
            <Crown size={14} /> PRO Member
          </div>
        ) : isTrial ? (
          <div className="px-3 py-2 rounded-xl text-xs font-semibold"
            style={{ background: 'var(--accent-yellow-dim)', color: 'var(--accent-yellow)' }}>
            ⏳ Trial — {trialDaysLeft} days left
          </div>
        ) : (
          <Link href="/pricing"
            className="block px-3 py-2 rounded-xl text-xs font-semibold text-center"
            style={{ background: 'var(--accent-red-dim)', color: 'var(--accent-red)' }}>
            Trial expired — Upgrade →
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          // Exact match for specific routes; startsWith for sub-routes
          // But /coins should NOT be active when on /coins/gold
          let isActive = pathname === href;
          if (!isActive && href !== '/dashboard') {
            isActive = pathname.startsWith(href + '/') || pathname.startsWith(href + '?');
            // Don't mark /coins active when /coins/gold is active
            if (href === '/coins' && pathname.startsWith('/coins/gold')) {
              isActive = false;
            }
          }
          const isGold = href === '/coins/gold';
          const activeColor = isGold ? '#FFD700' : 'var(--accent-blue)';
          const activeBg = isGold ? 'rgba(255, 215, 0, 0.1)' : 'var(--accent-blue-dim)';
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: isActive ? activeBg : 'transparent',
                color: isActive ? activeColor : 'var(--text-secondary)',
              }}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: 'var(--accent-blue-dim)', color: 'var(--accent-blue)' }}>
            {(profile?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{profile?.full_name || 'User'}</p>
            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm w-full transition-all hover:bg-white/5"
          style={{ color: 'var(--text-secondary)' }}
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg glass"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col fixed left-0 top-0 bottom-0 w-64 z-40"
        style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)' }}>
        {navContent}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-72 z-50 flex flex-col fade-in"
            style={{ background: 'var(--bg-secondary)' }}>
            {navContent}
          </aside>
        </>
      )}
    </>
  );
}

```

---

## File: app\components\Footer.tsx

```tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm"
                style={{ background: 'var(--gradient-primary)' }}>
                SE
              </div>
              <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                Smart<span style={{ color: 'var(--accent-blue)' }}>Entry</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Free crypto trading signals powered by real-time technical analysis.
              Make smarter trading decisions.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}>
              Platform
            </h4>
            <div className="flex flex-col gap-2">
              <Link href="/signals" className="text-sm transition-colors hover:text-white"
                style={{ color: 'var(--text-secondary)' }}>
                Live Signals
              </Link>
              <Link href="/" className="text-sm transition-colors hover:text-white"
                style={{ color: 'var(--text-secondary)' }}>
                Dashboard
              </Link>
            </div>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}>
              Community
            </h4>
            <div className="flex flex-col gap-2">
              <a href="https://t.me/smartentry_signals" target="_blank" rel="noopener noreferrer"
                className="text-sm transition-colors hover:text-white"
                style={{ color: 'var(--text-secondary)' }}>
                Telegram Channel
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--border-color)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} SmartEntry. Not financial advice. Trade at your own risk.
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Data powered by Binance
          </p>
        </div>
      </div>
    </footer>
  );
}
```

---

## File: app\components\Navbar.tsx

```tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm"
              style={{ background: 'var(--gradient-primary)' }}>SE</div>
            <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              Smart<span style={{ color: 'var(--accent-blue)' }}>Entry</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/pricing" className="text-sm font-medium transition-colors hover:text-white"
              style={{ color: 'var(--text-secondary)' }}>Pricing</Link>
            {user ? (
              <Link href="/dashboard"
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                style={{ background: 'var(--gradient-primary)' }}>Dashboard →</Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium transition-colors hover:text-white"
                  style={{ color: 'var(--text-secondary)' }}>Sign In</Link>
                <Link href="/signup"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                  style={{ background: 'var(--gradient-primary)' }}>Start Free Trial</Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
            <div className="space-y-1.5">
              <span className={`block w-6 h-0.5 transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`}
                style={{ background: 'var(--text-primary)' }} />
              <span className={`block w-6 h-0.5 transition-all ${isOpen ? 'opacity-0' : ''}`}
                style={{ background: 'var(--text-primary)' }} />
              <span className={`block w-6 h-0.5 transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}
                style={{ background: 'var(--text-primary)' }} />
            </div>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden px-4 pb-4 fade-in" style={{ background: 'var(--bg-secondary)' }}>
          <div className="flex flex-col gap-3">
            <Link href="/pricing" className="py-2 text-sm" style={{ color: 'var(--text-secondary)' }}
              onClick={() => setIsOpen(false)}>Pricing</Link>
            {user ? (
              <Link href="/dashboard" className="py-2 px-4 rounded-lg text-sm font-semibold text-white text-center"
                style={{ background: 'var(--gradient-primary)' }}>Dashboard →</Link>
            ) : (
              <>
                <Link href="/login" className="py-2 text-sm" style={{ color: 'var(--text-secondary)' }}
                  onClick={() => setIsOpen(false)}>Sign In</Link>
                <Link href="/signup" className="py-2 px-4 rounded-lg text-sm font-semibold text-white text-center"
                  style={{ background: 'var(--gradient-primary)' }}>Start Free Trial</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
```

---

## File: app\components\PriceChart.tsx

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries, type IChartApi } from 'lightweight-charts';

interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface PriceChartProps {
  data: CandleData[];
  height?: number;
}

export default function PriceChart({ data, height = 350 }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;

    // Clean up previous chart
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: 'rgba(255, 255, 255, 0.5)',
        fontFamily: 'Inter, sans-serif',
        fontSize: 11,
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.04)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.04)' },
      },
      crosshair: {
        vertLine: { color: 'rgba(51, 102, 255, 0.3)', width: 1, labelBackgroundColor: '#3366ff' },
        horzLine: { color: 'rgba(51, 102, 255, 0.3)', width: 1, labelBackgroundColor: '#3366ff' },
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.08)',
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.08)',
        timeVisible: true,
        secondsVisible: false,
      },
      width: chartContainerRef.current.clientWidth,
      height: height,
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#00d68f',
      downColor: '#ff3d71',
      borderUpColor: '#00d68f',
      borderDownColor: '#ff3d71',
      wickUpColor: '#00d68f',
      wickDownColor: '#ff3d71',
    });

    candleSeries.setData(data as any);
    chart.timeScale().fitContent();
    chartRef.current = chart;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
      chartRef.current = null;
    };
  }, [data, height]);

  if (data.length === 0) {
    return (
      <div className="w-full flex items-center justify-center"
        style={{ height, background: 'var(--bg-tertiary)', borderRadius: '12px', color: 'var(--text-muted)' }}>
        <p className="text-sm">📈 No chart data available yet</p>
      </div>
    );
  }

  return <div ref={chartContainerRef} className="w-full rounded-xl overflow-hidden" />;
}

```

---

## File: app\components\TradingViewChart.tsx

```tsx
'use client';

import { useEffect, useRef } from 'react';

interface TradingViewChartProps {
  symbol: string;
  height?: number;
  fullScreen?: boolean;
}

export default function TradingViewChart({ symbol, height = 500, fullScreen = false }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const tvSymbol = symbol.includes(':') ? symbol : `BINANCE:${symbol}`;

    // Create the widget container FIRST with explicit dimensions
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = '100%';
    widgetDiv.style.width = '100%';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: tvSymbol,
      interval: '60',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      backgroundColor: 'rgba(10, 14, 23, 1)',
      gridColor: 'rgba(255, 255, 255, 0.04)',
      hide_top_toolbar: false,
      hide_side_toolbar: false,
      hide_legend: false,
      allow_symbol_change: false,
      save_image: true,
      calendar: false,
      hide_volume: false,
      details: true,
      hotlist: false,
      support_host: 'https://www.tradingview.com',
      studies: [
        'RSI@tv-basicstudies',
        'MACD@tv-basicstudies',
      ],
    });

    widgetContainer.appendChild(widgetDiv);
    widgetContainer.appendChild(script);
    containerRef.current.appendChild(widgetContainer);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${fullScreen ? '' : 'rounded-xl'}`}
      style={{
        height: fullScreen ? 'calc(100dvh - 130px)' : `${height}px`,
        width: '100%',
        minHeight: fullScreen ? '600px' : '400px',
      }}
    />
  );
}

```

---

## File: app\globals.css

```css
@import "tailwindcss";

/* ── SmartEntry Design System ─────────────────────────── */

:root {
  /* Backgrounds */
  --bg-primary: #0a0e17;
  --bg-secondary: #111827;
  --bg-tertiary: #1a2035;
  --bg-card: #151c2c;
  --bg-hover: #1e2a42;

  /* Accent Colors */
  --accent-green: #00d68f;
  --accent-green-dim: rgba(0, 214, 143, 0.15);
  --accent-red: #ff3d71;
  --accent-red-dim: rgba(255, 61, 113, 0.15);
  --accent-yellow: #ffaa00;
  --accent-yellow-dim: rgba(255, 170, 0, 0.15);
  --accent-blue: #3366ff;
  --accent-blue-dim: rgba(51, 102, 255, 0.15);
  --accent-purple: #a855f7;

  /* Text */
  --text-primary: #e4e6eb;
  --text-secondary: #8b95a5;
  --text-muted: #5a6478;

  /* Borders */
  --border-color: #1e2a3a;
  --border-hover: #2d3a4f;

  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #3366ff, #a855f7);
  --gradient-green: linear-gradient(135deg, #00d68f, #00b87a);
  --gradient-hero: linear-gradient(180deg, #0a0e17 0%, #111827 50%, #0a0e17 100%);

  /* Fonts */
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-display: 'Space Grotesk', 'Inter', sans-serif;

  /* Shadows */
  --shadow-card: 0 4px 24px rgba(0, 0, 0, 0.3);
  --shadow-glow-green: 0 0 20px rgba(0, 214, 143, 0.2);
  --shadow-glow-blue: 0 0 20px rgba(51, 102, 255, 0.2);
}

/* ── Base Styles ──────────────────────────────────────── */

body {
  font-family: var(--font-sans);
  background: var(--bg-primary);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ── Scrollbar ────────────────────────────────────────── */

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: var(--bg-primary);
}

::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--border-hover);
}

/* ── Utility Classes ──────────────────────────────────── */

.glass {
  background: rgba(17, 24, 39, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-color);
}

.card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.card:hover {
  border-color: var(--border-hover);
  box-shadow: var(--shadow-card);
  transform: translateY(-2px);
}

.badge-strong-buy {
  background: linear-gradient(135deg, rgba(0, 214, 143, 0.25), rgba(255, 170, 0, 0.15));
  color: #00d68f;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 0 12px rgba(0, 214, 143, 0.3);
}

.badge-buy {
  background: var(--accent-green-dim);
  color: var(--accent-green);
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-wait {
  background: var(--accent-red-dim);
  color: var(--accent-red);
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-watch {
  background: var(--accent-yellow-dim);
  color: var(--accent-yellow);
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-avoid {
  background: rgba(100, 100, 100, 0.15);
  color: #8b95a5;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.glow-green {
  box-shadow: var(--shadow-glow-green);
}

.glow-blue {
  box-shadow: var(--shadow-glow-blue);
}

/* ── Animations ───────────────────────────────────────── */

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse-glow {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.fade-in {
  animation: fadeInUp 0.6s ease-out;
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-tertiary) 25%,
    var(--bg-hover) 50%,
    var(--bg-tertiary) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

```

---

## File: app\layout.tsx

```tsx
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SmartEntry — Crypto Trading Signals & Insights',
  description: 'Real-time crypto trading signals powered by RSI, MACD, volume analysis. Get actionable BUY, WATCH, and WAIT decisions for top cryptocurrencies.',
  keywords: ['crypto', 'trading signals', 'RSI', 'MACD', 'Bitcoin', 'cryptocurrency', 'technical analysis'],
  openGraph: {
    title: 'SmartEntry — Crypto Trading Signals',
    description: 'Actionable crypto trading insights powered by real-time technical analysis.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
```

---

## File: app\login\page.tsx

```tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const supabase = createClient();

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.href = '/dashboard';
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--gradient-hero)' }}>
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full opacity-15"
          style={{ background: 'var(--accent-blue)', filter: 'blur(100px)' }} />
        <div className="absolute bottom-20 left-20 w-72 h-72 rounded-full opacity-10"
          style={{ background: 'var(--accent-purple)', filter: 'blur(100px)' }} />
      </div>

      <div className="relative z-10 w-full max-w-md fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white"
              style={{ background: 'var(--gradient-primary)' }}>
              SE
            </div>
            <span className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              Smart<span style={{ color: 'var(--accent-blue)' }}>Entry</span>
            </span>
          </Link>
          <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Sign in to access your trading signals
          </p>
        </div>

        {/* Card */}
        <div className="card p-8">
          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-50 mb-6"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>or sign in with email</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg text-sm" style={{ background: 'var(--accent-red-dim)', color: 'var(--accent-red)' }}>
                {error}
              </div>
            )}

            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'var(--accent-blue)',
                } as React.CSSProperties}
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'var(--accent-blue)',
                } as React.CSSProperties}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-muted)' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
              style={{ background: 'var(--gradient-primary)' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>
        </div>

        {/* Sign up link */}
        <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-semibold hover:underline" style={{ color: 'var(--accent-blue)' }}>
            Start free trial →
          </Link>
        </p>
      </div>
    </div>
  );
}

```

---

## File: app\page.tsx

```tsx
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export default function Home() {
  return (
    <div>
      <Navbar />
      {/* ========== Hero Section ========== */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ background: 'var(--gradient-hero)' }}>
        {/* Decorative background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-80 h-80 rounded-full opacity-20"
            style={{ background: 'var(--accent-blue)', filter: 'blur(100px)' }} />
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full opacity-15"
            style={{ background: 'var(--accent-purple)', filter: 'blur(100px)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10"
            style={{ background: 'var(--accent-green)', filter: 'blur(120px)' }} />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto fade-in">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8 glass">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent-green)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Live Crypto Trading Signals</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}>
            Smart Trading
            <span className="block bg-clip-text text-transparent"
              style={{ backgroundImage: 'var(--gradient-primary)' }}>
              Starts Here
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}>
            Real-time crypto signals powered by RSI, MACD, and volume analysis.
            Stop guessing — get actionable <strong className="font-semibold" style={{ color: 'var(--accent-green)' }}>BUY</strong>,
            {' '}<strong className="font-semibold" style={{ color: 'var(--accent-yellow)' }}>WATCH</strong>,
            {' '}and <strong className="font-semibold" style={{ color: 'var(--accent-red)' }}>WAIT</strong> decisions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/signup"
              className="px-8 py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{ background: 'var(--gradient-primary)' }}>
              Start Free Trial →
            </a>
            <a href="https://t.me/smartentry_signals" target="_blank" rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:-translate-y-1 glass"
              style={{ color: 'var(--text-primary)' }}>
              Join Telegram Channel
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto">
            <div>
              <div className="text-3xl md:text-4xl font-extrabold" style={{ color: 'var(--accent-green)' }}>50+</div>
              <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Coins Tracked</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold" style={{ color: 'var(--accent-blue)' }}>24/7</div>
              <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Live Analysis</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold" style={{ color: 'var(--accent-purple)' }}>30</div>
              <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Days Free Trial</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== Features Section ========== */}
      <section className="py-20 px-4" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4"
              style={{ fontFamily: 'var(--font-display)' }}>
              How It Works
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Our engine analyzes the market every 5 minutes and delivers clear, actionable signals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card p-8">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6"
                style={{ background: 'var(--accent-blue-dim)' }}>
                📊
              </div>
              <h3 className="text-xl font-bold mb-3">Technical Analysis</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                RSI, MACD, Moving Averages, Volume Analysis — calculated automatically across multiple timeframes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card p-8">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6"
                style={{ background: 'var(--accent-green-dim)' }}>
                🎯
              </div>
              <h3 className="text-xl font-bold mb-3">Actionable Signals</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Clear BUY, WATCH, or WAIT decisions with confidence scores. No noise, just decisions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card p-8">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6"
                style={{ background: 'var(--accent-purple)', opacity: 0.15 }}>
                🔔
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Alerts</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Get signals delivered straight to your Telegram. Never miss a trading opportunity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA Section ========== */}
      <section className="py-20 px-4" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6"
            style={{ fontFamily: 'var(--font-display)' }}>
            Ready to Trade Smarter?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Join thousands of traders using SmartEntry to make better decisions.
          </p>
          <a href="/signup"
            className="inline-block px-10 py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            style={{ background: 'var(--gradient-primary)' }}>
            Start Free Trial →
          </a>
        </div>
      </section>
      <Footer />
    </div>
  );
}
```

---

## File: app\pricing\page.tsx

```tsx
import { Check } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 px-4 pb-20" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-4xl mx-auto text-center fade-in">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4"
            style={{ fontFamily: 'var(--font-display)' }}>
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg mb-12" style={{ color: 'var(--text-secondary)' }}>
            Start free. Upgrade when you&apos;re ready.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Trial */}
            <div className="card p-8 text-left">
              <h3 className="text-lg font-bold mb-1">Free Trial</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Try everything for 30 days</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">$0</span>
                <span className="text-sm ml-1" style={{ color: 'var(--text-muted)' }}>/ 30 days</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Top 5 signals daily', 'Basic dashboard', 'Email alerts', '30-day access'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check size={16} style={{ color: 'var(--accent-green)' }} /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup"
                className="block w-full text-center py-3 rounded-xl font-bold transition-all hover:-translate-y-0.5"
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                Start Free Trial
              </Link>
            </div>

            {/* Pro */}
            <div className="card p-8 text-left relative overflow-hidden glow-blue"
              style={{ border: '1px solid rgba(51,102,255,0.4)' }}>
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: 'var(--gradient-primary)', color: 'white' }}>
                POPULAR
              </div>
              <h3 className="text-lg font-bold mb-1">Pro</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Full access, unlimited signals</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">$19.99</span>
                <span className="text-sm ml-1" style={{ color: 'var(--text-muted)' }}>/ month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'All 50+ coin signals', 'Real-time Telegram alerts', 'Full TradingView charts',
                  'Daily market reports', 'Priority support', 'Cancel anytime',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check size={16} style={{ color: 'var(--accent-green)' }} /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup"
                className="block w-full text-center py-3 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5"
                style={{ background: 'var(--gradient-primary)' }}>
                Get Started →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

```

---

## File: app\signup\page.tsx

```tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--gradient-hero)' }}>
        <div className="relative z-10 w-full max-w-md text-center fade-in">
          <div className="card p-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'var(--accent-green-dim)' }}>
              <Check size={32} style={{ color: 'var(--accent-green)' }} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Check your email!</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              We sent a confirmation link to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>.
              Click the link to activate your 30-day free trial.
            </p>
            <Link href="/login" className="text-sm font-semibold" style={{ color: 'var(--accent-blue)' }}>
              ← Back to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--gradient-hero)' }}>
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full opacity-15"
          style={{ background: 'var(--accent-purple)', filter: 'blur(100px)' }} />
        <div className="absolute bottom-20 right-20 w-72 h-72 rounded-full opacity-10"
          style={{ background: 'var(--accent-green)', filter: 'blur(100px)' }} />
      </div>

      <div className="relative z-10 w-full max-w-md fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white"
              style={{ background: 'var(--gradient-primary)' }}>
              SE
            </div>
            <span className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              Smart<span style={{ color: 'var(--accent-blue)' }}>Entry</span>
            </span>
          </Link>
          <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Start your 30-day free trial — no credit card required
          </p>
        </div>

        {/* Card */}
        <div className="card p-8">
          {/* Trial badge */}
          <div className="flex items-center gap-2 p-3 rounded-xl mb-6"
            style={{ background: 'var(--accent-green-dim)', border: '1px solid rgba(0,214,143,0.2)' }}>
            <span className="text-lg">🎉</span>
            <span className="text-sm font-medium" style={{ color: 'var(--accent-green)' }}>
              30 days free — Full access to all features
            </span>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-50 mb-6"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>or sign up with email</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg text-sm" style={{ background: 'var(--accent-red-dim)', color: 'var(--accent-red)' }}>
                {error}
              </div>
            )}

            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>

            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
              style={{ background: 'var(--gradient-primary)' }}
            >
              {loading ? 'Creating account...' : 'Start Free Trial'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="text-xs text-center mt-4" style={{ color: 'var(--text-muted)' }}>
            By signing up, you agree to our Terms of Service
          </p>
        </div>

        {/* Login link */}
        <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link href="/login" className="font-semibold hover:underline" style={{ color: 'var(--accent-blue)' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

```
