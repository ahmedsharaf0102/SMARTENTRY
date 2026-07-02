import Link from 'next/link';

const footerSections = [
  {
    title: 'Markets',
    links: [
      { label: 'Crypto Signals', href: '/crypto' },
      { label: 'Stocks', href: '/stocks' },
      { label: 'Markets Overview', href: '/markets' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'News', href: '/news' },
      { label: 'Analysis', href: '/analysis' },
      { label: 'Education', href: '/education' },
      { label: 'Trading Tools', href: '/tools' },
    ],
  },
  {
    title: 'Calendar',
    links: [
      { label: 'Economic Calendar', href: '/calendar/economic' },
      { label: 'Crypto Events', href: '/calendar/crypto' },
    ],
  },
  {
    title: 'Platform',
    links: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Sign Up', href: '/signup' },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm"
                style={{ background: 'var(--gradient-primary)' }}>
                SE
              </div>
              <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                Smart<span style={{ color: 'var(--accent-blue)' }}>Entry</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              Your comprehensive financial portal — crypto signals, market data, and trading tools.
            </p>
            <a href="https://t.me/smartentry_signals" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-white"
              style={{ color: 'var(--accent-blue)' }}>
              📱 Telegram Channel
            </a>
          </div>

          {/* Link Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider"
                style={{ color: 'var(--text-muted)' }}>
                {section.title}
              </h4>
              <div className="flex flex-col gap-2.5">
                {section.links.map((link) => (
                  <Link key={link.href} href={link.href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: 'var(--text-secondary)' }}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--border-color)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} SmartEntry. Not financial advice. Trade at your own risk.
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Data powered by MEXC, Yahoo Finance & FRED
          </p>
        </div>
      </div>
    </footer>
  );
}