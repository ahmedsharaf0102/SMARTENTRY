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
    <div className="card p-4 overflow-hidden">
      <TradingViewChart symbol="OANDA:XAUUSD" height={600} />
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
