import { Check } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 px-4 pb-20" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-4xl mx-auto text-center fade-in">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4"
            style={{ fontFamily: 'var(--font-display)' }}>
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg mb-12" style={{ color: 'var(--text-secondary)' }}>
            Start free. Upgrade when you&apos;re ready.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Trial */}
            <div className="card p-8 text-left">
              <h3 className="text-lg font-bold mb-1">Free Trial</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Try everything for 30 days</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">$0</span>
                <span className="text-sm ml-1" style={{ color: 'var(--text-muted)' }}>/ 30 days</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Top 5 signals daily', 'Basic dashboard', 'Email alerts', '30-day access'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check size={16} style={{ color: 'var(--accent-green)' }} /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup"
                className="block w-full text-center py-3 rounded-xl font-bold transition-all hover:-translate-y-0.5"
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                Start Free Trial
              </Link>
            </div>

            {/* Pro */}
            <div className="card p-8 text-left relative overflow-hidden glow-blue"
              style={{ border: '1px solid rgba(51,102,255,0.4)' }}>
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: 'var(--gradient-primary)', color: 'white' }}>
                POPULAR
              </div>
              <h3 className="text-lg font-bold mb-1">Pro</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Full access, unlimited signals</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">$19.99</span>
                <span className="text-sm ml-1" style={{ color: 'var(--text-muted)' }}>/ month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'All 50+ coin signals', 'Real-time Telegram alerts', 'Full TradingView charts',
                  'Daily market reports', 'Priority support', 'Cancel anytime',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check size={16} style={{ color: 'var(--accent-green)' }} /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup"
                className="block w-full text-center py-3 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5"
                style={{ background: 'var(--gradient-primary)' }}>
                Get Started →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
