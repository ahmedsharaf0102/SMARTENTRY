'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--gradient-hero)' }}>
        <div className="relative z-10 w-full max-w-md text-center fade-in">
          <div className="card p-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'var(--accent-green-dim)' }}>
              <Check size={32} style={{ color: 'var(--accent-green)' }} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Check your email!</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              We sent a confirmation link to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>.
              Click the link to activate your 30-day free trial.
            </p>
            <Link href="/login" className="text-sm font-semibold" style={{ color: 'var(--accent-blue)' }}>
              ← Back to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--gradient-hero)' }}>
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full opacity-15"
          style={{ background: 'var(--accent-purple)', filter: 'blur(100px)' }} />
        <div className="absolute bottom-20 right-20 w-72 h-72 rounded-full opacity-10"
          style={{ background: 'var(--accent-green)', filter: 'blur(100px)' }} />
      </div>

      <div className="relative z-10 w-full max-w-md fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white"
              style={{ background: 'var(--gradient-primary)' }}>
              SE
            </div>
            <span className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              Smart<span style={{ color: 'var(--accent-blue)' }}>Entry</span>
            </span>
          </Link>
          <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Start your 30-day free trial — no credit card required
          </p>
        </div>

        {/* Card */}
        <div className="card p-8">
          {/* Trial badge */}
          <div className="flex items-center gap-2 p-3 rounded-xl mb-6"
            style={{ background: 'var(--accent-green-dim)', border: '1px solid rgba(0,214,143,0.2)' }}>
            <span className="text-lg">🎉</span>
            <span className="text-sm font-medium" style={{ color: 'var(--accent-green)' }}>
              30 days free — Full access to all features
            </span>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-50 mb-6"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Continue with Google
          </button>

          {/* Facebook Login (Coming Soon) */}
          <button
            disabled
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed mb-3"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            title="Coming soon"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Continue with Facebook
            <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ml-auto"
              style={{ background: 'rgba(100,100,100,0.2)', color: 'var(--text-muted)' }}>Soon</span>
          </button>

          {/* Phone Login (Coming Soon) */}
          <button
            disabled
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed mb-6"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            title="Coming soon"
          >
            <span className="text-lg">📱</span>
            Continue with Phone
            <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ml-auto"
              style={{ background: 'rgba(100,100,100,0.2)', color: 'var(--text-muted)' }}>Soon</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>or sign up with email</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg text-sm" style={{ background: 'var(--accent-red-dim)', color: 'var(--accent-red)' }}>
                {error}
              </div>
            )}

            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>

            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
              style={{ background: 'var(--gradient-primary)' }}
            >
              {loading ? 'Creating account...' : 'Start Free Trial'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="text-xs text-center mt-4" style={{ color: 'var(--text-muted)' }}>
            By signing up, you agree to our Terms of Service
          </p>
        </div>

        {/* Login link */}
        <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link href="/login" className="font-semibold hover:underline" style={{ color: 'var(--accent-blue)' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
