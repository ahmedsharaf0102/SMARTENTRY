import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Education — SmartEntry',
  description: 'Learn trading fundamentals, technical analysis patterns, and risk management strategies.',
};

export default function EducationPage() {
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
            Trading <span style={{ color: 'var(--accent-green)' }}>Education</span>
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Learn trading from zero to hero — fundamentals, technical analysis, and risk management.
          </p>
        </div>

        <div className="card p-12 text-center max-w-2xl mx-auto">
          <div className="text-6xl mb-6">🎓</div>
          <h2 className="text-2xl font-bold mb-4">Education Center — Coming Soon</h2>
          <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Comprehensive courses and guides covering candlestick patterns, indicator mastery,
            portfolio management, and trading psychology.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 max-w-sm mx-auto">
            {[
              { title: 'Beginner Guide', lessons: 12 },
              { title: 'Technical Analysis', lessons: 18 },
              { title: 'Risk Management', lessons: 8 },
              { title: 'Trading Psychology', lessons: 10 },
            ].map((course) => (
              <div key={course.title} className="p-4 rounded-xl text-left" style={{ background: 'var(--bg-tertiary)' }}>
                <div className="skeleton w-full h-16 rounded-lg mb-3" />
                <div className="text-xs font-semibold mb-1">{course.title}</div>
                <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{course.lessons} lessons</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
