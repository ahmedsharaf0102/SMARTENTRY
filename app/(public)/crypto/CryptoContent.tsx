'use client';

import Link from 'next/link';
import TickerTape from '@/app/components/widgets/TickerTape';
import Heatmap from '@/app/components/widgets/Heatmap';
import ScreenerWidget from '@/app/components/widgets/ScreenerWidget';
import MarketOverview from '@/app/components/widgets/MarketOverview';

const cryptoTabs = [
  {
    title: 'Top Coins',
    symbols: [
      { s: 'BITSTAMP:BTCUSD', d: 'Bitcoin' },
      { s: 'BITSTAMP:ETHUSD', d: 'Ethereum' },
      { s: 'BINANCE:SOLUSDT', d: 'Solana' },
      { s: 'BINANCE:BNBUSDT', d: 'BNB' },
      { s: 'BINANCE:XRPUSDT', d: 'XRP' },
      { s: 'BINANCE:ADAUSDT', d: 'Cardano' },
    ],
  },
  {
    title: 'DeFi',
    symbols: [
      { s: 'BINANCE:AVAXUSDT', d: 'Avalanche' },
      { s: 'BINANCE:LINKUSDT', d: 'Chainlink' },
      { s: 'BINANCE:UNIUSDT', d: 'Uniswap' },
      { s: 'BINANCE:AAVEUSDT', d: 'Aave' },
    ],
  },
  {
    title: 'Layer 2',
    symbols: [
      { s: 'BINANCE:MATICUSDT', d: 'Polygon' },
      { s: 'BINANCE:ARBUSDT', d: 'Arbitrum' },
      { s: 'BINANCE:OPUSDT', d: 'Optimism' },
    ],
  },
  {
    title: 'Meme Coins',
    symbols: [
      { s: 'BINANCE:DOGEUSDT', d: 'Dogecoin' },
      { s: 'BINANCE:SHIBUSDT', d: 'Shiba Inu' },
      { s: 'BINANCE:PEPEUSDT', d: 'PEPE' },
    ],
  },
];

export default function CryptoContent() {
  return (
    <div className="fade-in">
      <div style={{ borderBottom: '1px solid var(--border-color)' }}><TickerTape /></div>

      <section className="py-12 px-4" style={{ background: 'var(--gradient-hero)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">₿</span>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: 'var(--accent-yellow-dim)', color: 'var(--accent-yellow)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--accent-yellow)' }} />
              LIVE
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Crypto <span style={{ color: 'var(--accent-yellow)' }}>Market</span>
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Live cryptocurrency prices, market cap rankings, heatmaps, and trading signals.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link href="/signals" className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
              style={{ background: 'var(--gradient-primary)' }}>View Signals →</Link>
            <Link href="/coins" className="px-5 py-2.5 rounded-xl text-sm font-bold glass transition-all hover:-translate-y-0.5"
              style={{ color: 'var(--text-primary)' }}>Browse All Coins</Link>
          </div>
        </div>
      </section>

      <section className="py-10 px-4" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>Crypto Prices</h2>
          <MarketOverview height={450} tabs={cryptoTabs} />
        </div>
      </section>

      <section className="py-10 px-4" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>Crypto Heatmap</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>All coins by market cap — green = up, red = down (24h)</p>
          <Heatmap dataSource="Crypto" height={500} />
        </div>
      </section>

      <section className="py-10 px-4" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>Crypto Screener</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Filter by market cap, volume, and technical indicators</p>
          <ScreenerWidget defaultScreen="crypto_mkt_cap" defaultColumn="overview" market="crypto" height={600} />
        </div>
      </section>

      <section className="py-12 px-4" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ background: 'var(--gradient-primary)' }} />
            <div className="relative z-10">
              <div className="text-4xl mb-4">🚀</div>
              <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>SmartEntry Crypto Signals</h2>
              <p className="text-sm mb-6 max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Get AI-powered BUY, WATCH, and WAIT signals for 30+ cryptocurrencies.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/signals" className="px-6 py-3 rounded-xl text-sm font-bold text-white"
                  style={{ background: 'var(--gradient-primary)' }}>View Live Signals →</Link>
                <Link href="/coins/gold" className="px-6 py-3 rounded-xl text-sm font-bold glass">Gold Analysis →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
