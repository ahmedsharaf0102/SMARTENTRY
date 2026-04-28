'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm"
              style={{ background: 'var(--gradient-primary)' }}>SE</div>
            <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              Smart<span style={{ color: 'var(--accent-blue)' }}>Entry</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/pricing" className="text-sm font-medium transition-colors hover:text-white"
              style={{ color: 'var(--text-secondary)' }}>Pricing</Link>
            {user ? (
              <Link href="/dashboard"
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                style={{ background: 'var(--gradient-primary)' }}>Dashboard →</Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium transition-colors hover:text-white"
                  style={{ color: 'var(--text-secondary)' }}>Sign In</Link>
                <Link href="/signup"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                  style={{ background: 'var(--gradient-primary)' }}>Start Free Trial</Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
            <div className="space-y-1.5">
              <span className={`block w-6 h-0.5 transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`}
                style={{ background: 'var(--text-primary)' }} />
              <span className={`block w-6 h-0.5 transition-all ${isOpen ? 'opacity-0' : ''}`}
                style={{ background: 'var(--text-primary)' }} />
              <span className={`block w-6 h-0.5 transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}
                style={{ background: 'var(--text-primary)' }} />
            </div>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden px-4 pb-4 fade-in" style={{ background: 'var(--bg-secondary)' }}>
          <div className="flex flex-col gap-3">
            <Link href="/pricing" className="py-2 text-sm" style={{ color: 'var(--text-secondary)' }}
              onClick={() => setIsOpen(false)}>Pricing</Link>
            {user ? (
              <Link href="/dashboard" className="py-2 px-4 rounded-lg text-sm font-semibold text-white text-center"
                style={{ background: 'var(--gradient-primary)' }}>Dashboard →</Link>
            ) : (
              <>
                <Link href="/login" className="py-2 text-sm" style={{ color: 'var(--text-secondary)' }}
                  onClick={() => setIsOpen(false)}>Sign In</Link>
                <Link href="/signup" className="py-2 px-4 rounded-lg text-sm font-semibold text-white text-center"
                  style={{ background: 'var(--gradient-primary)' }}>Start Free Trial</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}