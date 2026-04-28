import { createClient } from '@/lib/supabase/server';
import { UserCircle, Mail, Calendar, Crown, Shield } from 'lucide-react';
import Link from 'next/link';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user!.id).single();

  const isPro = profile?.subscription_tier === 'pro';
  const isTrial = profile?.subscription_tier === 'trial';
  const trialEnds = profile?.trial_ends_at ? new Date(profile.trial_ends_at) : null;
  const daysLeft = trialEnds ? Math.max(0, Math.ceil((trialEnds.getTime() - Date.now()) / (86400000))) : 0;

  return (
    <div className="fade-in max-w-2xl">
      <h1 className="text-2xl font-extrabold mb-8 flex items-center gap-2"
        style={{ fontFamily: 'var(--font-display)' }}>
        <UserCircle size={28} style={{ color: 'var(--accent-blue)' }} /> Profile
      </h1>

      <div className="card p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{ background: 'var(--accent-blue-dim)', color: 'var(--accent-blue)' }}>
            {(profile?.full_name?.[0] || 'U').toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold">{profile?.full_name || 'User'}</h2>
            <p className="text-sm flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
              <Mail size={14} /> {user?.email}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
            <span className="text-sm flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              <Calendar size={14} /> Member since
            </span>
            <span className="text-sm font-medium">
              {new Date(profile?.created_at || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div className="flex justify-between p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
            <span className="text-sm flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              <Shield size={14} /> Subscription
            </span>
            <span className={`text-sm font-semibold ${isPro ? '' : isTrial ? '' : ''}`}
              style={{ color: isPro ? 'var(--accent-green)' : isTrial ? 'var(--accent-yellow)' : 'var(--accent-red)' }}>
              {isPro ? 'PRO' : isTrial ? `Trial (${daysLeft} days left)` : 'Expired'}
            </span>
          </div>
        </div>
      </div>

      {!isPro && (
        <Link href="/pricing"
          className="card p-6 flex items-center justify-between hover:-translate-y-1 transition-all"
          style={{ border: '1px solid rgba(51,102,255,0.3)' }}>
          <div className="flex items-center gap-3">
            <Crown size={24} style={{ color: 'var(--accent-yellow)' }} />
            <div>
              <p className="font-bold">Upgrade to PRO</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Full access to all signals, alerts & charts
              </p>
            </div>
          </div>
          <span className="font-bold" style={{ color: 'var(--accent-blue)' }}>$19.99/mo →</span>
        </Link>
      )}
    </div>
  );
}
