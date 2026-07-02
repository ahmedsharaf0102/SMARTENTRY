import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Financial News — SmartEntry',
  description: 'Breaking financial news, market analysis, and economic updates from global markets.',
};

export default function NewsPage() {
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
            Financial <span style={{ color: 'var(--accent-blue)' }}>News</span>
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Breaking financial news, market-moving events, and expert analysis from around the world.
          </p>
        </div>

        <div className="card p-12 text-center max-w-2xl mx-auto">
          <div className="text-6xl mb-6">📰</div>
          <h2 className="text-2xl font-bold mb-4">News Feed — Coming Soon</h2>
          <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
            A curated news feed covering crypto, stocks, commodities, and macroeconomics.
            Filter by asset class, sentiment, and impact level.
          </p>
          <div className="mt-8 space-y-3 max-w-md mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl text-left" style={{ background: 'var(--bg-tertiary)' }}>
                <div className="skeleton w-16 h-16 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton w-3/4 h-4" />
                  <div className="skeleton w-1/2 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
