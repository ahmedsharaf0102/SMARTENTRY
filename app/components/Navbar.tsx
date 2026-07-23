'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

/* ── Menu Structure ──────────────────────────────────── */

interface MenuItem {
  label: string;
  href: string;
  description?: string;
  icon?: string;
  badge?: string;
}

interface NavSection {
  label: string;
  href?: string;          // Direct link (no dropdown)
  items?: MenuItem[];     // Dropdown items
}

const navSections: NavSection[] = [
  {
    label: 'Markets',
    items: [
      { label: 'Overview', href: '/markets', icon: '🌍', description: 'Global markets at a glance' },
      { label: 'Crypto', href: '/crypto', icon: '₿', description: 'Live crypto signals & analysis', badge: 'Live' },
      { label: 'Stocks', href: '/stocks', icon: '📈', description: 'Major indices & equities', badge: 'Live' },
      { label: 'Forex', href: '/forex', icon: '💱', description: 'Currency pairs & cross rates', badge: 'Live' },
      { label: 'Commodities', href: '/commodities', icon: '🛢️', description: 'Gold, oil & metals', badge: 'Live' },
    ],
  },
  { label: 'News', href: '/news' },
  { label: 'Analysis', href: '/analysis' },
  { label: 'Tools', href: '/tools' },
  {
    label: 'Calendar',
    items: [
      { label: 'Economic Calendar', href: '/calendar/economic', icon: '📅', description: 'FOMC, CPI, NFP & more', badge: 'Live' },
      { label: 'Crypto Events', href: '/calendar/crypto', icon: '🗓️', description: 'Unlocks, upgrades & airdrops', badge: 'Soon' },
    ],
  },
  { label: 'Education', href: '/education' },
];

/* ── Dropdown Component ──────────────────────────────── */

function NavDropdown({ section, isOpen, onToggle }: {
  section: NavSection;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const isChildActive = section.items?.some(
    (item) => pathname === item.href || pathname.startsWith(item.href + '/')
  );

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/5"
        style={{ color: isChildActive ? 'var(--accent-blue)' : 'var(--text-secondary)' }}
      >
        {section.label}
        <svg className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 rounded-xl p-2 shadow-2xl fade-in z-50"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
          {section.items?.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onToggle}
                className="flex items-start gap-3 px-3 py-3 rounded-lg transition-all hover:bg-white/5 group"
                style={{ background: isActive ? 'var(--accent-blue-dim)' : undefined }}
              >
                {item.icon && <span className="text-lg mt-0.5">{item.icon}</span>}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold"
                      style={{ color: isActive ? 'var(--accent-blue)' : 'var(--text-primary)' }}>
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                        style={{
                          background: item.badge === 'Live' ? 'var(--accent-green-dim)' : 'rgba(100,100,100,0.15)',
                          color: item.badge === 'Live' ? 'var(--accent-green)' : 'var(--text-muted)',
                        }}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.description}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Main Navbar ─────────────────────────────────────── */

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setOpenDropdown(null);
    setMobileOpen(false);
    setMobileExpanded(null);
  }, [pathname]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm"
              style={{ background: 'var(--gradient-primary)' }}>SE</div>
            <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              Smart<span style={{ color: 'var(--accent-blue)' }}>Entry</span>
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden lg:flex items-center gap-1">
            {navSections.map((section) =>
              section.items ? (
                <NavDropdown
                  key={section.label}
                  section={section}
                  isOpen={openDropdown === section.label}
                  onToggle={() =>
                    setOpenDropdown(openDropdown === section.label ? null : section.label)
                  }
                />
              ) : (
                <Link
                  key={section.label}
                  href={section.href!}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/5"
                  style={{
                    color: pathname === section.href ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  }}
                >
                  {section.label}
                </Link>
              )
            )}
          </div>

          {/* ── Desktop Auth ── */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/pricing" className="px-3 py-2 text-sm font-medium transition-colors hover:text-white"
              style={{ color: 'var(--text-secondary)' }}>Pricing</Link>
            {user ? (
              <Link href="/dashboard"
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                style={{ background: 'var(--gradient-primary)' }}>Dashboard →</Link>
            ) : (
              <>
                <Link href="/login" className="px-3 py-2 text-sm font-medium transition-colors hover:text-white"
                  style={{ color: 'var(--text-secondary)' }}>Sign In</Link>
                <Link href="/signup"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                  style={{ background: 'var(--gradient-primary)' }}>Start Free Trial</Link>
              </>
            )}
          </div>

          {/* ── Mobile Hamburger ── */}
          <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            <div className="space-y-1.5">
              <span className={`block w-6 h-0.5 transition-all ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`}
                style={{ background: 'var(--text-primary)' }} />
              <span className={`block w-6 h-0.5 transition-all ${mobileOpen ? 'opacity-0' : ''}`}
                style={{ background: 'var(--text-primary)' }} />
              <span className={`block w-6 h-0.5 transition-all ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`}
                style={{ background: 'var(--text-primary)' }} />
            </div>
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="lg:hidden px-4 pb-4 fade-in max-h-[80vh] overflow-y-auto"
          style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
          <div className="flex flex-col py-2">
            {navSections.map((section) =>
              section.items ? (
                <div key={section.label}>
                  <button
                    onClick={() => setMobileExpanded(mobileExpanded === section.label ? null : section.label)}
                    className="w-full flex items-center justify-between py-3 text-sm font-medium"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {section.label}
                    <svg className={`w-4 h-4 transition-transform ${mobileExpanded === section.label ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {mobileExpanded === section.label && (
                    <div className="pl-4 pb-2 space-y-1 fade-in">
                      {section.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm transition-all hover:bg-white/5"
                          style={{ color: pathname === item.href ? 'var(--accent-blue)' : 'var(--text-primary)' }}
                        >
                          {item.icon && <span>{item.icon}</span>}
                          {item.label}
                          {item.badge && (
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ml-auto"
                              style={{
                                background: item.badge === 'Live' ? 'var(--accent-green-dim)' : 'rgba(100,100,100,0.15)',
                                color: item.badge === 'Live' ? 'var(--accent-green)' : 'var(--text-muted)',
                              }}>
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={section.label}
                  href={section.href!}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 text-sm font-medium transition-colors"
                  style={{ color: pathname === section.href ? 'var(--accent-blue)' : 'var(--text-secondary)' }}
                >
                  {section.label}
                </Link>
              )
            )}

            {/* Auth section */}
            <div className="mt-4 pt-4 flex flex-col gap-2" style={{ borderTop: '1px solid var(--border-color)' }}>
              <Link href="/pricing" className="py-2 text-sm" style={{ color: 'var(--text-secondary)' }}
                onClick={() => setMobileOpen(false)}>Pricing</Link>
              {user ? (
                <Link href="/dashboard" className="py-2 px-4 rounded-lg text-sm font-semibold text-white text-center"
                  style={{ background: 'var(--gradient-primary)' }}>Dashboard →</Link>
              ) : (
                <>
                  <Link href="/login" className="py-2 text-sm" style={{ color: 'var(--text-secondary)' }}
                    onClick={() => setMobileOpen(false)}>Sign In</Link>
                  <Link href="/signup" className="py-2 px-4 rounded-lg text-sm font-semibold text-white text-center"
                    style={{ background: 'var(--gradient-primary)' }}>Start Free Trial</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}