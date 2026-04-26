import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm"
                style={{ background: 'var(--gradient-primary)' }}>
                SE
              </div>
              <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                Smart<span style={{ color: 'var(--accent-blue)' }}>Entry</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Free crypto trading signals powered by real-time technical analysis.
              Make smarter trading decisions.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}>
              Platform
            </h4>
            <div className="flex flex-col gap-2">
              <Link href="/signals" className="text-sm transition-colors hover:text-white"
                style={{ color: 'var(--text-secondary)' }}>
                Live Signals
              </Link>
              <Link href="/" className="text-sm transition-colors hover:text-white"
                style={{ color: 'var(--text-secondary)' }}>
                Dashboard
              </Link>
            </div>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}>
              Community
            </h4>
            <div className="flex flex-col gap-2">
              <a href="https://t.me/smartentry_signals" target="_blank" rel="noopener noreferrer"
                className="text-sm transition-colors hover:text-white"
                style={{ color: 'var(--text-secondary)' }}>
                Telegram Channel
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--border-color)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} SmartEntry. Not financial advice. Trade at your own risk.
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Data powered by Binance
          </p>
        </div>
      </div>
    </footer>
  );
}