import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Markets Overview — SmartEntry',
  description: 'Live overview of global financial markets including crypto, stocks, commodities, and macroeconomic indicators.',
};

const marketSections = [
  {
    title: 'Crypto',
    description: 'Real-time signals for 30+ cryptocurrencies powered by RSI, MACD, and volume analysis.',
    href: '/crypto',
    icon: '₿',
    color: 'var(--accent-yellow)',
    colorDim: 'var(--accent-yellow-dim)',
    status: 'Live',
  },
  {
    title: 'Stocks',
    description: 'Track major indices, top movers, and sector performance across global stock markets.',
    href: '/stocks',
    icon: '📈',
    color: 'var(--accent-green)',
    colorDim: 'var(--accent-green-dim)',
    status: 'Coming Soon',
  },
  {
    title: 'News',
    description: 'Breaking financial news, market-moving events, and expert analysis from around the world.',
    href: '/news',
    icon: '📰',
    color: 'var(--accent-blue)',
    colorDim: 'var(--accent-blue-dim)',
    status: 'Coming Soon',
  },
  {
    title: 'Analysis',
    description: 'In-depth technical and fundamental analysis across all asset classes.',
    href: '/analysis',
    icon: '🔬',
    color: 'var(--accent-purple)',
    colorDim: 'rgba(168, 85, 247, 0.15)',
    status: 'Coming Soon',
  },
  {
    title: 'Tools',
    description: 'Position size calculators, risk management tools, and portfolio trackers.',
    href: '/tools',
    icon: '🛠️',
    color: '#f97316',
    colorDim: 'rgba(249, 115, 22, 0.15)',
    status: 'Coming Soon',
  },
  {
    title: 'Economic Calendar',
    description: 'Stay ahead with upcoming FOMC meetings, CPI releases, NFP reports, and more.',
    href: '/calendar/economic',
    icon: '📅',
    color: '#06b6d4',
    colorDim: 'rgba(6, 182, 212, 0.15)',
    status: 'Coming Soon',
  },
  {
    title: 'Crypto Events',
    description: 'Token unlocks, protocol upgrades, airdrops, and blockchain milestones.',
    href: '/calendar/crypto',
    icon: '🗓️',
    color: 'var(--accent-yellow)',
    colorDim: 'var(--accent-yellow-dim)',
    status: 'Coming Soon',
  },
  {
    title: 'Education',
    description: 'Learn trading fundamentals, technical analysis patterns, and risk management strategies.',
    href: '/education',
    icon: '🎓',
    color: 'var(--accent-green)',
    colorDim: 'var(--accent-green-dim)',
    status: 'Coming Soon',
  },
];

export default function MarketsHomePage() {
  return (
    <div className="fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24 px-4" style={{ background: 'var(--gradient-hero)' }}>
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full opacity-15"
            style={{ background: 'var(--accent-blue)', filter: 'blur(100px)' }} />
          <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full opacity-10"
            style={{ background: 'var(--accent-purple)', filter: 'blur(100px)' }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6 glass">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent-green)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Global Markets — Live Data</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}>
            Your Financial
            <span className="block bg-clip-text text-transparent"
              style={{ backgroundImage: 'var(--gradient-primary)' }}>
              Command Center
            </span>
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}>
            Crypto signals, stock market data, economic calendar, and expert analysis — all in one place.
          </p>
        </div>
      </section>

      {/* Market Sections Grid */}
      <section className="py-16 px-4" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {marketSections.map((section) => (
              <Link key={section.href} href={section.href} className="card p-6 group block">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-5 transition-transform group-hover:scale-110"
                  style={{ background: section.colorDim }}>
                  {section.icon}
                </div>

                {/* Title + Status */}
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-bold">{section.title}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{
                      background: section.status === 'Live' ? 'var(--accent-green-dim)' : 'rgba(100,100,100,0.15)',
                      color: section.status === 'Live' ? 'var(--accent-green)' : 'var(--text-muted)',
                    }}>
                    {section.status}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {section.description}
                </p>

                {/* Arrow */}
                <div className="mt-4 text-sm font-semibold transition-transform group-hover:translate-x-1"
                  style={{ color: section.color }}>
                  Explore →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
