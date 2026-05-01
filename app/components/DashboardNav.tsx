'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard, Radio, BarChart3, UserCircle,
  LogOut, Menu, X, Crown
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface Props {
  user: User;
  profile: any;
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/signals', label: 'Signals', icon: Radio },
  { href: '/coins', label: 'Coins', icon: BarChart3 },
  { href: '/coins/gold', label: 'Gold', icon: Crown },
  { href: '/profile', label: 'Profile', icon: UserCircle },
];

export default function DashboardNav({ user, profile }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const supabase = createClient();

  const isPro = profile?.subscription_tier === 'pro';
  const isTrial = profile?.subscription_tier === 'trial';
  const trialEnds = profile?.trial_ends_at ? new Date(profile.trial_ends_at) : null;
  const trialDaysLeft = trialEnds
    ? Math.max(0, Math.ceil((trialEnds.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  const navContent = (
    <>
      {/* Logo */}
      <div className="p-6 pb-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white text-sm"
            style={{ background: 'var(--gradient-primary)' }}>
            SE
          </div>
          <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            Smart<span style={{ color: 'var(--accent-blue)' }}>Entry</span>
          </span>
        </Link>
      </div>

      {/* Trial/Pro badge */}
      <div className="px-4 mb-4">
        {isPro ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold"
            style={{ background: 'var(--accent-green-dim)', color: 'var(--accent-green)' }}>
            <Crown size={14} /> PRO Member
          </div>
        ) : isTrial ? (
          <div className="px-3 py-2 rounded-xl text-xs font-semibold"
            style={{ background: 'var(--accent-yellow-dim)', color: 'var(--accent-yellow)' }}>
            ⏳ Trial — {trialDaysLeft} days left
          </div>
        ) : (
          <Link href="/pricing"
            className="block px-3 py-2 rounded-xl text-xs font-semibold text-center"
            style={{ background: 'var(--accent-red-dim)', color: 'var(--accent-red)' }}>
            Trial expired — Upgrade →
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: isActive ? 'var(--accent-blue-dim)' : 'transparent',
                color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
              }}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: 'var(--accent-blue-dim)', color: 'var(--accent-blue)' }}>
            {(profile?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{profile?.full_name || 'User'}</p>
            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm w-full transition-all hover:bg-white/5"
          style={{ color: 'var(--text-secondary)' }}
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg glass"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col fixed left-0 top-0 bottom-0 w-64 z-40"
        style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)' }}>
        {navContent}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-72 z-50 flex flex-col fade-in"
            style={{ background: 'var(--bg-secondary)' }}>
            {navContent}
          </aside>
        </>
      )}
    </>
  );
}
