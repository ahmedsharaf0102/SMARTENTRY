import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Market Analysis — SmartEntry',
  description: 'In-depth technical and fundamental analysis across crypto, stocks, and commodities.',
};

export default function AnalysisPage() {
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
            Market <span style={{ color: 'var(--accent-purple)' }}>Analysis</span>
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            In-depth technical and fundamental analysis across all asset classes.
          </p>
        </div>

        <div className="card p-12 text-center max-w-2xl mx-auto">
          <div className="text-6xl mb-6">🔬</div>
          <h2 className="text-2xl font-bold mb-4">Analysis Hub — Coming Soon</h2>
          <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Expert-level analysis reports with chart breakdowns, pattern recognition,
            support/resistance levels, and macro trend insights.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 max-w-sm mx-auto">
            {['Technical', 'Fundamental', 'Sentiment', 'Macro'].map((type) => (
              <div key={type} className="p-4 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
                <div className="skeleton w-full h-20 mb-3 rounded-lg" />
                <div className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{type}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
