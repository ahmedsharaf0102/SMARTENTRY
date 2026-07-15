'use client';

import Link from 'next/link';
import TickerTape from '@/app/components/widgets/TickerTape';
import ForexCrossRates from '@/app/components/widgets/ForexCrossRates';
import ScreenerWidget from '@/app/components/widgets/ScreenerWidget';
import MarketOverview from '@/app/components/widgets/MarketOverview';

const forexTabs = [
  {
    title: 'Majors',
    symbols: [
      { s: 'FX:EURUSD', d: 'EUR/USD' },
      { s: 'FX:GBPUSD', d: 'GBP/USD' },
      { s: 'FX:USDJPY', d: 'USD/JPY' },
      { s: 'FX:USDCHF', d: 'USD/CHF' },
      { s: 'FX:AUDUSD', d: 'AUD/USD' },
      { s: 'FX:USDCAD', d: 'USD/CAD' },
    ],
  },
  {
    title: 'Crosses',
    symbols: [
      { s: 'FX:EURGBP', d: 'EUR/GBP' },
      { s: 'FX:EURJPY', d: 'EUR/JPY' },
      { s: 'FX:GBPJPY', d: 'GBP/JPY' },
      { s: 'FX:EURCHF', d: 'EUR/CHF' },
    ],
  },
  {
    title: 'Emerging',
    symbols: [
      { s: 'FX:USDTRY', d: 'USD/TRY' },
      { s: 'FX:USDMXN', d: 'USD/MXN' },
      { s: 'FX:USDZAR', d: 'USD/ZAR' },
    ],
  },
];

export default function ForexContent() {
  return (
    <div className="fade-in">
      <div style={{ borderBottom: '1px solid var(--border-color)' }}><TickerTape /></div>

      <section className="py-12 px-4" style={{ background: 'var(--gradient-hero)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">💱</span>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: 'var(--accent-blue-dim)', color: 'var(--accent-blue)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--accent-blue)' }} />
              LIVE
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Forex <span style={{ color: 'var(--accent-blue)' }}>Market</span>
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Live currency rates, cross rates table, and forex screener for major, cross, and emerging market pairs.
          </p>
        </div>
      </section>

      <section className="py-10 px-4" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>Currency Pairs</h2>
          <MarketOverview height={450} tabs={forexTabs} />
        </div>
      </section>

      <section className="py-10 px-4" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>Cross Rates Table</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Live exchange rates matrix for 8 major currencies</p>
          <ForexCrossRates height={420} />
        </div>
      </section>

      <section className="py-10 px-4" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>Forex Screener</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Filter by technical signals, volatility, and performance</p>
          <ScreenerWidget defaultScreen="forex_signal" defaultColumn="overview" market="forex" height={550} />
        </div>
      </section>

      <section className="py-12 px-4" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: '/stocks', icon: '📈', label: 'Stocks', desc: 'Indices & Equities' },
            { href: '/crypto', icon: '₿', label: 'Crypto', desc: 'Cryptocurrencies' },
            { href: '/commodities', icon: '🛢️', label: 'Commodities', desc: 'Gold, Oil & Metals' },
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
