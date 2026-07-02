import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Crypto Signals — SmartEntry',
  description: 'Real-time crypto trading signals for 30+ coins. RSI, MACD, volume analysis, and actionable BUY/WATCH/WAIT decisions.',
};

export default function CryptoPage() {
  return (
    <div className="fade-in py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'var(--accent-green-dim)', color: 'var(--accent-green)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--accent-green)' }} />
            LIVE
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4"
            style={{ fontFamily: 'var(--font-display)' }}>
            Crypto <span style={{ color: 'var(--accent-blue)' }}>Signals</span>
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Real-time trading signals for the top 30 cryptocurrencies, powered by technical analysis.
          </p>
        </div>

        {/* Action Card */}
        <div className="card p-8 text-center max-w-lg mx-auto">
          <div className="text-5xl mb-6">₿</div>
          <h2 className="text-xl font-bold mb-3">Access Live Crypto Signals</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Sign in to view real-time BUY, WATCH, and WAIT signals with strength scores and indicator breakdowns.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signals"
              className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
              style={{ background: 'var(--gradient-primary)' }}>
              View Signals →
            </Link>
            <Link href="/coins"
              className="px-6 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 glass"
              style={{ color: 'var(--text-primary)' }}>
              Browse Coins
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
