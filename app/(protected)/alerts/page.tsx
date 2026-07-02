import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Price Alerts — SmartEntry',
  description: 'Set custom price alerts and get notified when your target prices are hit.',
};

export default function AlertsPage() {
  return (
    <div className="fade-in">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-2"
          style={{ fontFamily: 'var(--font-display)' }}>
          Price Alerts
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Set custom alerts and get notified when your target prices are hit.
        </p>
      </div>

      <div className="card p-12 text-center max-w-xl mx-auto">
        <div className="text-5xl mb-6">🔔</div>
        <h2 className="text-xl font-bold mb-3">Alerts — Coming Soon</h2>
        <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Configure price alerts for any tracked coin. Get notified via Telegram, email, 
          or in-app when conditions are met.
        </p>
      </div>
    </div>
  );
}
