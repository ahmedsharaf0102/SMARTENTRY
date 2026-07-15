'use client';

import Link from 'next/link';
import TickerTape from '@/app/components/widgets/TickerTape';
import MarketOverview from '@/app/components/widgets/MarketOverview';
import Heatmap from '@/app/components/widgets/Heatmap';

const quickLinks = [
  { href: '/stocks', label: 'Stocks', icon: '📈', color: 'var(--accent-green)', desc: 'US & Global Equities' },
  { href: '/crypto', label: 'Crypto', icon: '₿', color: 'var(--accent-yellow)', desc: 'Bitcoin, Ethereum & more' },
  { href: '/forex', label: 'Forex', icon: '💱', color: 'var(--accent-blue)', desc: 'Currency Pairs' },
  { href: '/commodities', label: 'Commodities', icon: '🛢️', color: '#f97316', desc: 'Gold, Oil & Metals' },
  { href: '/news', label: 'News', icon: '📰', color: 'var(--accent-purple)', desc: 'Financial News' },
  { href: '/calendar/economic', label: 'Calendar', icon: '📅', color: '#06b6d4', desc: 'Economic Events' },
];

export default function MarketsContent() {
  return (
    <div className="fade-in">
      {/* Ticker Tape */}
      <div style={{ borderBottom: '1px solid var(--border-color)' }}>
        <TickerTape />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden py-14 md:py-20 px-4" style={{ background: 'var(--gradient-hero)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full opacity-15"
            style={{ background: 'var(--accent-blue)', filter: 'blur(100px)' }} />
          <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full opacity-10"
            style={{ background: 'var(--accent-purple)', filter: 'blur(100px)' }} />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6 glass">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent-green)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Live Market Data</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}>
            Global <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-primary)' }}>Markets</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}>
            Real-time quotes, charts, and analysis for stocks, crypto, forex, and commodities.
          </p>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8 px-4" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="card p-4 group block text-center transition-all hover:-translate-y-1">
                <div className="text-2xl mb-2">{link.icon}</div>
                <h3 className="text-sm font-bold mb-0.5">{link.label}</h3>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Market Overview Widget */}
      <section className="py-10 px-4" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Market Overview</h2>
            <span className="text-xs px-3 py-1 rounded-full glass" style={{ color: 'var(--text-muted)' }}>
              Powered by TradingView
            </span>
          </div>
          <MarketOverview height={500} />
        </div>
      </section>

      {/* S&P 500 Heatmap */}
      <section className="py-10 px-4" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>S&P 500 Heatmap</h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Sector performance at a glance — sized by market cap, colored by price change
              </p>
            </div>
            <Link href="/stocks" className="text-sm font-semibold hover:underline" style={{ color: 'var(--accent-blue)' }}>
              View Stocks →
            </Link>
          </div>
          <Heatmap dataSource="SPX500" height={500} />
        </div>
      </section>

      {/* Crypto Heatmap */}
      <section className="py-10 px-4" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Crypto Heatmap</h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Top cryptocurrencies by market cap — colored by 24h price change
              </p>
            </div>
            <Link href="/crypto" className="text-sm font-semibold hover:underline" style={{ color: 'var(--accent-yellow)' }}>
              View Crypto →
            </Link>
          </div>
          <Heatmap dataSource="Crypto" height={500} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Ready to start trading?
          </h2>
          <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
            Get real-time signals, technical analysis, and portfolio tracking — all for free.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="px-8 py-3 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
              style={{ background: 'var(--gradient-primary)' }}>
              Create Free Account →
            </Link>
            <Link href="/news" className="px-8 py-3 rounded-xl text-sm font-bold glass transition-all hover:-translate-y-0.5"
              style={{ color: 'var(--text-primary)' }}>
              Read Latest News
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
