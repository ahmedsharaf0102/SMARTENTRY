'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const EconomicCalendarWidget = dynamic(() => import('@/app/components/widgets/EconomicCalendarWidget'), { ssr: false });

/* ── Country Filter Presets ─────────────────────────────── */
const COUNTRY_PRESETS = [
  { label: '🌍 All Countries', value: 'us,eu,gb,jp,au,ca,ch,nz,cn', color: 'var(--accent-blue)' },
  { label: '🇺🇸 USD', value: 'us', color: '#22c55e' },
  { label: '🇪🇺 EUR', value: 'eu,de,fr,it,es', color: '#3b82f6' },
  { label: '🇬🇧 GBP', value: 'gb', color: '#a855f7' },
  { label: '🇯🇵 JPY', value: 'jp', color: '#ef4444' },
  { label: '🇦🇺 AUD', value: 'au', color: '#eab308' },
  { label: '🇨🇦 CAD', value: 'ca', color: '#f97316' },
  { label: '🇨🇭 CHF', value: 'ch', color: '#06b6d4' },
  { label: '🇳🇿 NZD', value: 'nz', color: '#10b981' },
  { label: '🇨🇳 CNY', value: 'cn', color: '#ef4444' },
];

const IMPORTANCE_PRESETS = [
  { label: '🔹 All', value: '-1,0,1' },
  { label: '🔴 High Only', value: '1' },
  { label: '🟡 Med + High', value: '0,1' },
];

/* ── Smart Analysis Cards (our added value) ─────────────── */
const SMART_INSIGHTS = [
  {
    title: 'FOMC / Fed Interest Rate',
    icon: '🏛️',
    assets: ['USD', 'S&P 500', 'BTC', 'Gold', 'EUR/USD', 'Bonds'],
    analysis: 'The most important market event. Hold rates → Bullish. Hike → Very bearish for all markets. Cut → Very bullish (strong rally expected).',
    color: '#ef4444',
  },
  {
    title: 'CPI (Consumer Price Index)',
    icon: '📊',
    assets: ['USD', 'BTC', 'ETH', 'S&P 500', 'NASDAQ', 'Gold'],
    analysis: 'Higher than expected → Bearish for stocks & crypto (Fed may hike rates). Lower than expected → Very bullish (rally likely).',
    color: '#eab308',
  },
  {
    title: 'NFP (Nonfarm Payrolls)',
    icon: '👷',
    assets: ['USD', 'Gold (XAU)', 'EUR/USD', 'GBP/USD', 'USD/JPY'],
    analysis: 'More jobs → USD strengthens → Gold drops. Fewer jobs → USD weakens → Gold rallies. Highest volatility day of the month.',
    color: '#22c55e',
  },
  {
    title: 'PCE Price Index',
    icon: '📈',
    assets: ['USD', 'BTC', 'ETH', 'S&P 500', 'Gold', 'Bonds'],
    analysis: "The Fed's #1 preferred inflation measure. Higher → Rate hike risk → Bearish. Lower → Bullish for risk assets.",
    color: '#a855f7',
  },
  {
    title: 'GDP Growth Rate',
    icon: '🏗️',
    assets: ['USD', 'S&P 500', 'NASDAQ', 'Dow Jones', 'BTC'],
    analysis: 'Higher than expected → Bullish for stocks & USD. Lower or negative → Recession fears → Bearish across the board.',
    color: '#3b82f6',
  },
  {
    title: 'ECB / BOE / BOJ Rate Decisions',
    icon: '🌍',
    assets: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'DAX', 'FTSE 100', 'Nikkei 225'],
    analysis: 'Central bank rate decisions directly impact their respective currencies and local stock markets. Hike → Currency up. Cut → Currency down.',
    color: '#06b6d4',
  },
  {
    title: 'Crude Oil Inventories (EIA)',
    icon: '🛢️',
    assets: ['Crude Oil (WTI)', 'Brent', 'XOM', 'CVX', 'OXY'],
    analysis: 'Build (more supply) → Oil drops. Draw (less supply) → Oil rises. Directly impacts energy stocks.',
    color: '#f97316',
  },
  {
    title: 'Unemployment Rate',
    icon: '📉',
    assets: ['USD', 'Gold (XAU)', 'BTC', 'S&P 500', 'EUR/USD'],
    analysis: 'Rising → Weak economy → Fed may cut rates → Bullish for Gold & Crypto. Falling → Strong economy → Bearish for Gold.',
    color: '#10b981',
  },
];

function AssetChip({ asset }: { asset: string }) {
  const getColor = (a: string) => {
    const u = a.toUpperCase();
    if (u === 'USD') return '#22c55e';
    if (u.includes('/')) return 'var(--accent-blue)';
    if (u.includes('XAU') || u.includes('GOLD')) return '#eab308';
    if (u.includes('OIL') || u.includes('CRUDE') || u.includes('BRENT')) return '#f97316';
    if (['BTC', 'ETH', 'SOL'].includes(u)) return 'var(--accent-yellow)';
    if (['S&P 500', 'NASDAQ', 'DOW JONES', 'FTSE 100', 'DAX', 'NIKKEI 225'].some(x => u.includes(x))) return 'var(--accent-green)';
    if (u.includes('BOND')) return 'var(--accent-purple)';
    return 'var(--text-muted)';
  };
  const color = getColor(asset);
  return (
    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded"
      style={{ background: `color-mix(in srgb, ${color} 12%, transparent)`, color }}>{asset}</span>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ══════════════════════════════════════════════════════════ */
export default function EconomicCalendarContent() {
  const [activeCountry, setActiveCountry] = useState(COUNTRY_PRESETS[0].value);
  const [activeImportance, setActiveImportance] = useState(IMPORTANCE_PRESETS[0].value);
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null);

  return (
    <div className="fade-in">
      {/* ── HERO ── */}
      <section className="py-10 px-4" style={{ background: 'var(--gradient-hero)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📅</span>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: 'rgba(6,182,212,0.15)', color: '#06b6d4' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#06b6d4' }} />
              LIVE — REAL-TIME DATA
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Economic <span style={{ color: '#06b6d4' }}>Calendar</span>
          </h1>
          <p className="text-lg max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
            Real-time economic events from 9 countries with live Actual, Forecast &amp; Previous data. Filter by country, currency, and impact level.
          </p>
        </div>
      </section>

      {/* ── FILTERS ── */}
      <section className="py-4 px-4 sticky top-16 z-20" style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="max-w-6xl mx-auto space-y-3">
          {/* Country Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {COUNTRY_PRESETS.map((p) => (
              <button key={p.value} onClick={() => setActiveCountry(p.value)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all"
                style={{
                  background: activeCountry === p.value ? `color-mix(in srgb, ${p.color} 20%, transparent)` : 'var(--bg-tertiary)',
                  color: activeCountry === p.value ? p.color : 'var(--text-muted)',
                  border: activeCountry === p.value ? `1px solid ${p.color}` : '1px solid transparent',
                }}>
                {p.label}
              </button>
            ))}
          </div>

          {/* Importance Buttons */}
          <div className="flex gap-2 items-center">
            <span className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Impact:</span>
            {IMPORTANCE_PRESETS.map((p) => (
              <button key={p.value} onClick={() => setActiveImportance(p.value)}
                className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all"
                style={{
                  background: activeImportance === p.value ? 'var(--bg-tertiary)' : 'transparent',
                  color: activeImportance === p.value ? 'var(--text-primary)' : 'var(--text-muted)',
                  border: activeImportance === p.value ? '1px solid var(--border-color)' : '1px solid transparent',
                }}>
                {p.label}
              </button>
            ))}
            <a href="https://www.tradingview.com/?aff_id=168777" target="_blank" rel="noopener noreferrer"
              className="ml-auto text-[10px] px-2 py-1 rounded-full hover:opacity-80 transition-opacity"
              style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
              Powered by TradingView
            </a>
          </div>
        </div>
      </section>

      {/* ── LIVE CALENDAR WIDGET ── */}
      <section className="px-4 py-6" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-color)' }}>
            <EconomicCalendarWidget
              height={700}
              colorTheme="dark"
              importanceFilter={activeImportance}
              countryFilter={activeCountry}
            />
          </div>
        </div>
      </section>

      {/* ── SMART ANALYSIS SECTION (our added value) ── */}
      <section className="py-10 px-4" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              🧠 SmartEntry <span style={{ color: 'var(--accent-blue)' }}>Impact Guide</span>
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
              How each event affects your assets
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SMART_INSIGHTS.map((insight, i) => (
              <div key={i} className="rounded-xl overflow-hidden transition-all duration-200"
                style={{
                  background: 'var(--bg-primary)',
                  border: `1px solid ${expandedInsight === i ? insight.color : 'var(--border-color)'}`,
                }}>
                <button onClick={() => setExpandedInsight(expandedInsight === i ? null : i)}
                  className="w-full flex items-center gap-3 p-4 text-left hover:brightness-110 transition-all">
                  <span className="text-2xl">{insight.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{insight.title}</div>
                  </div>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: insight.color }} />
                  <span className="text-xs transition-transform duration-200"
                    style={{ color: 'var(--text-muted)', transform: expandedInsight === i ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
                </button>

                {expandedInsight === i && (
                  <div className="px-4 pb-4 space-y-3">
                    {/* Affected Assets */}
                    <div className="p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)', borderLeft: `3px solid ${insight.color}` }}>
                      <div className="text-[10px] uppercase font-bold mb-2" style={{ color: insight.color }}>🎯 Affected Assets</div>
                      <div className="flex flex-wrap gap-1">
                        {insight.assets.map((a, j) => <AssetChip key={j} asset={a} />)}
                      </div>
                    </div>

                    {/* Analysis */}
                    <div className="p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)', borderLeft: '3px solid var(--accent-blue)' }}>
                      <div className="text-[10px] uppercase font-bold mb-1" style={{ color: 'var(--accent-blue)' }}>📊 Impact Analysis</div>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{insight.analysis}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEGEND ── */}
      <section className="py-8 px-4" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="card p-6">
            <h3 className="font-bold mb-4 text-sm">📖 How to Read the Calendar</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <div>
                <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>🔴 High Impact (3 bulls)</p>
                <p>Major market movers: FOMC, CPI, NFP. These events cause the biggest price swings. Avoid entering trades 30 min before.</p>
              </div>
              <div>
                <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>📊 Actual vs Forecast</p>
                <p>When Actual differs from Forecast, markets react fast. Green = better than expected. Red = worse than expected.</p>
              </div>
              <div>
                <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>⏰ Time Zones</p>
                <p>Times are shown in your local timezone. Most US events: 8:30 AM - 2:00 PM ET. EU events: 4:00 - 10:00 AM ET.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
