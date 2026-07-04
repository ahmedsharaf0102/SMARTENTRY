import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard — SmartEntry',
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch article stats
  const { count: totalArticles } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true });

  const { count: publishedArticles } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true);

  const { count: draftArticles } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', false);

  const { data: recentArticles } = await supabase
    .from('articles')
    .select('id, title, slug, category, is_published, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  const stats = [
    { label: 'Total Articles', value: totalArticles || 0, color: 'var(--accent-blue)' },
    { label: 'Published', value: publishedArticles || 0, color: 'var(--accent-green)' },
    { label: 'Drafts', value: draftArticles || 0, color: 'var(--accent-yellow)' },
  ];

  return (
    <div className="fade-in">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-6">
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
              {stat.label}
            </p>
            <p className="text-3xl font-extrabold" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card p-6 mb-8">
        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/articles/new"
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
            style={{ background: 'var(--gradient-primary)' }}>
            ✏️ Write New Article
          </Link>
          <Link href="/admin/articles"
            className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 glass"
            style={{ color: 'var(--text-primary)' }}>
            📋 Manage Articles
          </Link>
          <Link href="/news" target="_blank"
            className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 glass"
            style={{ color: 'var(--text-primary)' }}>
            🌐 View Public News
          </Link>
        </div>
      </div>

      {/* Recent Articles */}
      <div className="card p-6">
        <h2 className="text-lg font-bold mb-4">Recent Articles</h2>
        {recentArticles && recentArticles.length > 0 ? (
          <div className="space-y-3">
            {recentArticles.map((article) => (
              <div key={article.id}
                className="flex items-center justify-between p-3 rounded-xl transition-all hover:bg-white/5"
                style={{ background: 'var(--bg-tertiary)' }}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{article.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded"
                      style={{ background: 'var(--accent-blue-dim)', color: 'var(--accent-blue)' }}>
                      {article.category}
                    </span>
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {new Date(article.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded"
                    style={{
                      background: article.is_published ? 'var(--accent-green-dim)' : 'var(--accent-yellow-dim)',
                      color: article.is_published ? 'var(--accent-green)' : 'var(--accent-yellow)',
                    }}>
                    {article.is_published ? 'Published' : 'Draft'}
                  </span>
                  <Link href={`/admin/articles/${article.id}/edit`}
                    className="text-xs font-medium px-2 py-1 rounded-lg hover:bg-white/10 transition-all"
                    style={{ color: 'var(--accent-blue)' }}>
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>
            No articles yet. Click &quot;Write New Article&quot; to get started!
          </p>
        )}
      </div>
    </div>
  );
}
