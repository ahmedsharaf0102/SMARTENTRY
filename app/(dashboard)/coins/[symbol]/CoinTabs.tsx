'use client';

import { useState } from 'react';
import { BarChart3, Radio } from 'lucide-react';
import TradingViewChart from '@/app/components/TradingViewChart';

interface CoinTabsProps {
  symbol: string;
  signals: any[];
}

export default function CoinTabs({ symbol, signals }: CoinTabsProps) {
  const [activeTab, setActiveTab] = useState<'chart' | 'signals'>('chart');

  const tabs = [
    { id: 'chart' as const, label: 'Chart', icon: <BarChart3 size={16} /> },
    { id: 'signals' as const, label: 'Signals & Indicators', icon: <Radio size={16} /> },
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
        {activeTab === 'chart' && (
          <div className="card p-4 overflow-hidden">
            <TradingViewChart symbol={symbol} height={550} />
          </div>
        )}

        {activeTab === 'signals' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Signal History */}
            <div className="card p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4"
                style={{ color: 'var(--text-muted)' }}>Signal History</h3>
              {signals.length === 0 ? (
                <p className="text-sm py-4 text-center" style={{ color: 'var(--text-muted)' }}>
                  No signals yet
                </p>
              ) : (
                <div className="space-y-3">
                  {signals.map((s) => {
                    const ac = s.action === 'STRONG_BUY' ? 'badge-strong-buy' :
                      s.action === 'BUY' ? 'badge-buy' : s.action === 'WATCH' ? 'badge-watch' :
                      s.action === 'WAIT' ? 'badge-wait' : 'badge-avoid';
                    return (
                      <div key={s.id} className="p-3 rounded-xl"
                        style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={ac}>{s.action?.replace('_', ' ')}</span>
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
              )}
            </div>

            {/* Latest Indicators */}
            {signals[0]?.details && (
              <div className="card p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4"
                  style={{ color: 'var(--text-muted)' }}>Latest Indicators</h3>
                <div className="space-y-2">
                  {signals[0].details.rsi && (
                    <Row label="RSI (14)" value={signals[0].details.rsi} />
                  )}
                  {signals[0].details.stochrsi && (
                    <Row label="Stochastic RSI" value={signals[0].details.stochrsi} />
                  )}
                  {signals[0].details.mfi && (
                    <Row label="MFI" value={signals[0].details.mfi} />
                  )}
                  {signals[0].details.adx && (
                    <Row label="ADX" value={signals[0].details.adx} />
                  )}
                  {signals[0].details.volume_ratio && (
                    <Row label="Volume Ratio" value={`${signals[0].details.volume_ratio}x`} />
                  )}
                  {signals[0].details.obv_rising != null && (
                    <Row label="OBV Trend" value={signals[0].details.obv_rising ? 'Rising ↑' : 'Falling ↓'} />
                  )}
                  {signals[0].details.categories_confirmed != null && (
                    <Row label="Categories Confirmed" value={`${signals[0].details.categories_confirmed}/3`} />
                  )}
                  {signals[0].details.indicators_agreeing != null && (
                    <Row label="Indicators Agreeing" value={`${signals[0].details.indicators_agreeing}/12`} />
                  )}
                  {signals[0].details.description && (
                    <p className="text-xs mt-3 p-3 rounded-lg"
                      style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                      {signals[0].details.description}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: any }) {
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
