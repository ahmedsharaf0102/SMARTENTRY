export default function Home() {
  return (
    <div>
      {/* ========== Hero Section ========== */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ background: 'var(--gradient-hero)' }}>
        {/* Decorative background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-80 h-80 rounded-full opacity-20"
            style={{ background: 'var(--accent-blue)', filter: 'blur(100px)' }} />
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full opacity-15"
            style={{ background: 'var(--accent-purple)', filter: 'blur(100px)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10"
            style={{ background: 'var(--accent-green)', filter: 'blur(120px)' }} />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto fade-in">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8 glass">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent-green)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Live Crypto Trading Signals</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}>
            Smart Trading
            <span className="block bg-clip-text text-transparent"
              style={{ backgroundImage: 'var(--gradient-primary)' }}>
              Starts Here
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}>
            Real-time crypto signals powered by RSI, MACD, and volume analysis.
            Stop guessing — get actionable <strong className="font-semibold" style={{ color: 'var(--accent-green)' }}>BUY</strong>,
            {' '}<strong className="font-semibold" style={{ color: 'var(--accent-yellow)' }}>WATCH</strong>,
            {' '}and <strong className="font-semibold" style={{ color: 'var(--accent-red)' }}>WAIT</strong> decisions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/signals"
              className="px-8 py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{ background: 'var(--gradient-primary)' }}>
              View Live Signals →
            </a>
            <a href="https://t.me/smartentry_signals" target="_blank" rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:-translate-y-1 glass"
              style={{ color: 'var(--text-primary)' }}>
              Join Telegram Channel
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto">
            <div>
              <div className="text-3xl md:text-4xl font-extrabold" style={{ color: 'var(--accent-green)' }}>50+</div>
              <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Coins Tracked</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold" style={{ color: 'var(--accent-blue)' }}>24/7</div>
              <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Live Analysis</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold" style={{ color: 'var(--accent-purple)' }}>FREE</div>
              <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>No Hidden Costs</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== Features Section ========== */}
      <section className="py-20 px-4" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4"
              style={{ fontFamily: 'var(--font-display)' }}>
              How It Works
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Our engine analyzes the market every 5 minutes and delivers clear, actionable signals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card p-8">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6"
                style={{ background: 'var(--accent-blue-dim)' }}>
                📊
              </div>
              <h3 className="text-xl font-bold mb-3">Technical Analysis</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                RSI, MACD, Moving Averages, Volume Analysis — calculated automatically across multiple timeframes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card p-8">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6"
                style={{ background: 'var(--accent-green-dim)' }}>
                🎯
              </div>
              <h3 className="text-xl font-bold mb-3">Actionable Signals</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Clear BUY, WATCH, or WAIT decisions with confidence scores. No noise, just decisions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card p-8">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6"
                style={{ background: 'var(--accent-purple)', opacity: 0.15 }}>
                🔔
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Alerts</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Get signals delivered straight to your Telegram. Never miss a trading opportunity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA Section ========== */}
      <section className="py-20 px-4" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6"
            style={{ fontFamily: 'var(--font-display)' }}>
            Ready to Trade Smarter?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Join thousands of traders using SmartEntry to make better decisions.
          </p>
          <a href="/signals"
            className="inline-block px-10 py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            style={{ background: 'var(--gradient-primary)' }}>
            Get Started — It&apos;s Free →
          </a>
        </div>
      </section>
    </div>
  );
}