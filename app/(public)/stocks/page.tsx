import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stock Market — SmartEntry',
  description: 'Track major stock indices, sector performance, and top movers across global equity markets.',
};

export default function StocksPage() {
  return (
    <div className="fade-in py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'rgba(100,100,100,0.15)', color: 'var(--text-muted)' }}>
            COMING SOON
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4"
            style={{ fontFamily: 'var(--font-display)' }}>
            Stock <span style={{ color: 'var(--accent-green)' }}>Market</span>
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Track major indices, top movers, and sector performance across global equity markets.
          </p>
        </div>

        <div className="card p-12 text-center max-w-2xl mx-auto">
          <div className="text-6xl mb-6">📈</div>
          <h2 className="text-2xl font-bold mb-4">Stocks Module — Coming Soon</h2>
          <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
            We&apos;re building a comprehensive stock market section with live indices, sector heatmaps, 
            earnings calendars, and technical analysis for major US, EU, and emerging market equities.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-sm mx-auto">
            {['S&P 500', 'NASDAQ', 'FTSE 100'].map((index) => (
              <div key={index} className="p-3 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
                <div className="skeleton w-full h-4 mb-2" />
                <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{index}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
