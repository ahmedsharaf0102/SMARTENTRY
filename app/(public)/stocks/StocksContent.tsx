'use client';

import Link from 'next/link';
import TickerTape from '@/app/components/widgets/TickerTape';
import Heatmap from '@/app/components/widgets/Heatmap';
import ScreenerWidget from '@/app/components/widgets/ScreenerWidget';
import MarketOverview from '@/app/components/widgets/MarketOverview';

const indicesTabs = [
  {
    title: 'US Indices',
    symbols: [
      { s: 'FOREXCOM:SPXUSD', d: 'S&P 500' },
      { s: 'FOREXCOM:NSXUSD', d: 'Nasdaq 100' },
      { s: 'FOREXCOM:DJI', d: 'Dow Jones' },
      { s: 'AMEX:IWM', d: 'Russell 2000' },
    ],
  },
  {
    title: 'Europe',
    symbols: [
      { s: 'INDEX:DAX', d: 'DAX (Germany)' },
      { s: 'FOREXCOM:UKXGBP', d: 'FTSE 100 (UK)' },
      { s: 'INDEX:CAC40', d: 'CAC 40 (France)' },
    ],
  },
  {
    title: 'Asia',
    symbols: [
      { s: 'INDEX:NKY', d: 'Nikkei 225' },
      { s: 'HSI:HSI', d: 'Hang Seng' },
      { s: 'KRX:KOSPI', d: 'KOSPI' },
    ],
  },
];

export default function StocksContent() {
  return (
    <div className="fade-in">
      <div style={{ borderBottom: '1px solid var(--border-color)' }}><TickerTape /></div>

      <section className="py-12 px-4" style={{ background: 'var(--gradient-hero)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📈</span>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: 'var(--accent-green-dim)', color: 'var(--accent-green)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--accent-green)' }} />
              LIVE
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Stock <span style={{ color: 'var(--accent-green)' }}>Market</span>
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Track major indices, sector heatmaps, and screen stocks across US, European, and Asian markets.
          </p>
        </div>
      </section>

      <section className="py-10 px-4" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>Global Indices</h2>
          <MarketOverview height={450} tabs={indicesTabs} />
        </div>
      </section>

      <section className="py-10 px-4" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>S&P 500 Heatmap</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Sector performance by market cap</p>
          <Heatmap dataSource="SPX500" height={500} />
        </div>
      </section>

      <section className="py-10 px-4" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>NASDAQ 100 Heatmap</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Tech-heavy index performance</p>
          <Heatmap dataSource="NASDAQ100" height={500} />
        </div>
      </section>

      <section className="py-10 px-4" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>Stock Screener</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Filter stocks by fundamental and technical criteria</p>
          <ScreenerWidget defaultScreen="general" defaultColumn="overview" market="america" height={600} />
        </div>
      </section>

      <section className="py-12 px-4" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: '/crypto', icon: '₿', label: 'Crypto', desc: 'Cryptocurrencies' },
            { href: '/forex', icon: '💱', label: 'Forex', desc: 'Currency Pairs' },
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
