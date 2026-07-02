import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trading Tools — SmartEntry',
  description: 'Position size calculators, risk management tools, and portfolio trackers for smart trading.',
};

export default function ToolsPage() {
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
            Trading <span style={{ color: '#f97316' }}>Tools</span>
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Position size calculators, risk management tools, and portfolio trackers.
          </p>
        </div>

        <div className="card p-12 text-center max-w-2xl mx-auto">
          <div className="text-6xl mb-6">🛠️</div>
          <h2 className="text-2xl font-bold mb-4">Tools Suite — Coming Soon</h2>
          <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Professional-grade trading tools including position size calculators, 
            risk/reward analyzers, correlation matrices, and portfolio rebalancing utilities.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 max-w-sm mx-auto">
            {['Position Sizer', 'Risk Calculator', 'Correlation Matrix', 'Portfolio Tracker'].map((tool) => (
              <div key={tool} className="p-4 rounded-xl flex items-center gap-3" style={{ background: 'var(--bg-tertiary)' }}>
                <div className="w-8 h-8 rounded-lg skeleton shrink-0" />
                <div className="text-xs font-semibold text-left" style={{ color: 'var(--text-muted)' }}>{tool}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
