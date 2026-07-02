import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crypto Events Calendar — SmartEntry',
  description: 'Track token unlocks, protocol upgrades, airdrops, and blockchain milestones.',
};

export default function CryptoCalendarPage() {
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
            Crypto <span style={{ color: 'var(--accent-yellow)' }}>Events</span>
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Token unlocks, protocol upgrades, airdrops, and blockchain milestones.
          </p>
        </div>

        <div className="card p-12 text-center max-w-2xl mx-auto">
          <div className="text-6xl mb-6">🗓️</div>
          <h2 className="text-2xl font-bold mb-4">Crypto Events — Coming Soon</h2>
          <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Stay ahead of the market with token unlock schedules, hard fork dates,
            mainnet launches, governance votes, and airdrop opportunities.
          </p>
          <div className="mt-8 space-y-2 max-w-sm mx-auto">
            {[
              { event: 'Token Unlock', icon: '🔓' },
              { event: 'Protocol Upgrade', icon: '⬆️' },
              { event: 'Airdrop', icon: '🪂' },
              { event: 'Mainnet Launch', icon: '🚀' },
            ].map((item) => (
              <div key={item.event} className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: 'var(--bg-tertiary)' }}>
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{item.event}</span>
                <div className="flex-1" />
                <div className="skeleton w-20 h-4 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
