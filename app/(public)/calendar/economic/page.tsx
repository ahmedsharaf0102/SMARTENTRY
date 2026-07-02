import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Economic Calendar — SmartEntry',
  description: 'Track FOMC meetings, CPI releases, NFP reports, GDP data, and other market-moving economic events.',
};

export default function EconomicCalendarPage() {
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
            Economic <span style={{ color: '#06b6d4' }}>Calendar</span>
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Stay ahead with upcoming FOMC meetings, CPI releases, NFP reports, and more.
          </p>
        </div>

        <div className="card p-12 text-center max-w-2xl mx-auto">
          <div className="text-6xl mb-6">📅</div>
          <h2 className="text-2xl font-bold mb-4">Economic Calendar — Coming Soon</h2>
          <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
            A real-time economic calendar tracking all major events that move markets — 
            interest rate decisions, inflation data, employment reports, and central bank speeches.
          </p>
          <div className="mt-8 space-y-2 max-w-sm mx-auto">
            {[
              { event: 'FOMC Meeting', impact: 'High' },
              { event: 'CPI Release', impact: 'High' },
              { event: 'NFP Report', impact: 'High' },
              { event: 'GDP Data', impact: 'Medium' },
            ].map((item) => (
              <div key={item.event} className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: 'var(--bg-tertiary)' }}>
                <div className="flex items-center gap-3">
                  <div className="skeleton w-16 h-4 rounded" />
                  <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{item.event}</span>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                  style={{
                    background: item.impact === 'High' ? 'var(--accent-red-dim)' : 'var(--accent-yellow-dim)',
                    color: item.impact === 'High' ? 'var(--accent-red)' : 'var(--accent-yellow)',
                  }}>
                  {item.impact}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
