export default async function CoinPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;

  return (
    <div className="min-h-screen pt-20 px-4" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Coin Header */}
        <div className="mb-8 fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold"
              style={{ background: 'var(--accent-blue-dim)', color: 'var(--accent-blue)' }}>
              {symbol.replace('USDT', '').slice(0, 3)}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold"
                style={{ fontFamily: 'var(--font-display)' }}>
                {symbol.toUpperCase()}
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {symbol.replace('USDT', '')} / USDT
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Area — 2 columns */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h2 className="text-lg font-bold mb-4">Price Chart</h2>
              {/* TradingView Lightweight Chart will go here */}
              <div className="w-full h-96 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
                📈 Chart component — Phase 3
              </div>
            </div>
          </div>

          {/* Sidebar — Signals & Indicators */}
          <div className="space-y-4">
            {/* Current Signal */}
            <div className="card p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4"
                style={{ color: 'var(--text-muted)' }}>
                Latest Signal
              </h3>
              <div className="skeleton w-full h-20" />
            </div>

            {/* Indicators */}
            <div className="card p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4"
                style={{ color: 'var(--text-muted)' }}>
                Technical Indicators
              </h3>
              <div className="space-y-3">
                {['RSI (14)', 'MACD', 'SMA 50', 'Volume'].map((indicator) => (
                  <div key={indicator} className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{indicator}</span>
                    <div className="skeleton w-16 h-5" />
                  </div>
                ))}
              </div>
            </div>

            {/* Trade CTA */}
            <a href={`https://www.binance.com/en/trade/${symbol.replace('USDT', '')}_USDT`}
              target="_blank" rel="noopener noreferrer"
              className="block w-full text-center py-3 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5"
              style={{ background: 'var(--gradient-primary)' }}>
              Trade on Binance →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
