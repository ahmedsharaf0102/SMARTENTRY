import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  // Only admins can access this section
  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div>
      {/* Admin top bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
              style={{ background: 'var(--accent-red-dim)', color: 'var(--accent-red)' }}>
              ADMIN
            </span>
            <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              Content Manager
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin"
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-white/5"
            style={{ color: 'var(--text-secondary)' }}>
            Dashboard
          </Link>
          <Link href="/admin/articles"
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-white/5"
            style={{ color: 'var(--text-secondary)' }}>
            Articles
          </Link>
          <Link href="/admin/articles/new"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:-translate-y-0.5"
            style={{ background: 'var(--gradient-primary)' }}>
            + New Article
          </Link>
        </div>
      </div>

      {children}
    </div>
  );
}
