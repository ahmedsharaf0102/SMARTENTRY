'use client';

import Link from 'next/link';
import TickerTape from '@/app/components/widgets/TickerTape';
import MarketOverview from '@/app/components/widgets/MarketOverview';
import TradingViewChart from '@/app/components/TradingViewChart';

const commodityTabs = [
  {
    title: 'Metals',
    symbols: [
      { s: 'TVC:GOLD', d: 'Gold' },
      { s: 'TVC:SILVER', d: 'Silver' },
      { s: 'TVC:PLATINUM', d: 'Platinum' },
      { s: 'TVC:PALLADIUM', d: 'Palladium' },
    ],
  },
  {
    title: 'Energy',
    symbols: [
      { s: 'TVC:USOIL', d: 'Crude Oil WTI' },
      { s: 'TVC:UKOIL', d: 'Brent Oil' },
      { s: 'TVC:NATGAS', d: 'Natural Gas' },
    ],
  },
  {
    title: 'Agriculture',
    symbols: [
      { s: 'CBOT:ZC1!', d: 'Corn' },
      { s: 'CBOT:ZW1!', d: 'Wheat' },
      { s: 'CBOT:ZS1!', d: 'Soybeans' },
    ],
  },
];

const spotlightCommodities = [
  { symbol: 'TVC:GOLD', name: 'Gold', icon: '🥇', color: 'var(--accent-yellow)', link: '/coins/gold' },
  { symbol: 'TVC:SILVER', name: 'Silver', icon: '🥈', color: '#C0C0C0', link: null },
  { symbol: 'TVC:USOIL', name: 'Crude Oil', icon: '🛢️', color: '#f97316', link: null },
  { symbol: 'TVC:NATGAS', name: 'Natural Gas', icon: '🔥', color: '#06b6d4', link: null },
];

export default function CommoditiesContent() {
  return (
    <div className="fade-in">
      <div style={{ borderBottom: '1px solid var(--border-color)' }}><TickerTape /></div>

      <section className="py-12 px-4" style={{ background: 'var(--gradient-hero)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🛢️</span>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#f97316' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#f97316' }} />
              LIVE
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            <span style={{ color: 'var(--accent-yellow)' }}>Commodities</span>
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Live prices for precious metals, energy, and agricultural commodities with interactive charts.
          </p>
        </div>
      </section>

      <section className="py-10 px-4" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>Commodity Prices</h2>
          <MarketOverview height={450} tabs={commodityTabs} />
        </div>
      </section>

      <section className="py-10 px-4" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>Key Commodities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {spotlightCommodities.map((commodity) => (
              <div key={commodity.symbol} className="card overflow-hidden">
                <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{commodity.icon}</span>
                    <h3 className="font-bold">{commodity.name}</h3>
                  </div>
                  {commodity.link && (
                    <Link href={commodity.link} className="text-xs font-semibold hover:underline"
                      style={{ color: commodity.color }}>Full Analysis →</Link>
                  )}
                </div>
                <TradingViewChart symbol={commodity.symbol} height={300} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 md:p-10 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-10"
              style={{ background: 'linear-gradient(135deg, var(--accent-yellow), transparent)' }} />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <div className="text-5xl">🥇</div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-xl font-bold mb-2">SmartEntry Gold Analysis</h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Get hourly RSI, MACD, and volume signals for gold — powered by our Python analysis engine.
                </p>
              </div>
              <Link href="/coins/gold" className="px-6 py-3 rounded-xl text-sm font-bold text-white whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #D4A017, #B8860B)' }}>Gold Signals →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: '/stocks', icon: '📈', label: 'Stocks', desc: 'Indices & Equities' },
            { href: '/crypto', icon: '₿', label: 'Crypto', desc: 'Cryptocurrencies' },
            { href: '/forex', icon: '💱', label: 'Forex', desc: 'Currency Pairs' },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="card p-6 group block text-center transition-all hover:-translate-y-1">
              <div className="text-3xl mb-3">{l.icon}</div>
              <h3 className="font-bold mb-1">{l.label}</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{l.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
