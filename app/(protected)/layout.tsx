import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardNav from '@/app/components/DashboardNav';

export default async function DashboardLayout({
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
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <DashboardNav user={user} profile={profile} />

      {/* Main Content */}
      <main className="flex-1 min-h-screen ml-0 md:ml-64">
        <div className="p-4 md:p-8 pt-20 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
