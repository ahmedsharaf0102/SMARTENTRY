'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm"
              style={{ background: 'var(--gradient-primary)' }}>
              SE
            </div>
            <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              Smart<span style={{ color: 'var(--accent-blue)' }}>Entry</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/signals" className="text-sm font-medium transition-colors hover:text-white"
              style={{ color: 'var(--text-secondary)' }}>
              Signals
            </Link>
            <Link href="/signals" className="text-sm font-medium transition-colors hover:text-white"
              style={{ color: 'var(--text-secondary)' }}>
              Dashboard
            </Link>
            <a href="https://t.me/smartentry_signals" target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
              style={{ background: 'var(--gradient-primary)' }}>
              Join Telegram
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
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

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 fade-in" style={{ background: 'var(--bg-secondary)' }}>
          <div className="flex flex-col gap-3">
            <Link href="/signals" className="py-2 text-sm font-medium"
              style={{ color: 'var(--text-secondary)' }}
              onClick={() => setIsOpen(false)}>
              Signals
            </Link>
            <Link href="/signals" className="py-2 text-sm font-medium"
              style={{ color: 'var(--text-secondary)' }}
              onClick={() => setIsOpen(false)}>
              Dashboard
            </Link>
            <a href="https://t.me/smartentry_signals" target="_blank" rel="noopener noreferrer"
              className="py-2 px-4 rounded-lg text-sm font-semibold text-white text-center"
              style={{ background: 'var(--gradient-primary)' }}>
              Join Telegram
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}