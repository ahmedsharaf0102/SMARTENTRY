import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import type { Metadata } from 'next';
import ArticleActions from './ArticleActions';

export const metadata: Metadata = {
  title: 'Manage Articles — SmartEntry Admin',
};

export default async function AdminArticlesPage() {
  const supabase = await createClient();

  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, slug, category, is_published, published_at, created_at')
    .order('created_at', { ascending: false });

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
          📋 All Articles
        </h2>
        <Link href="/admin/articles/new"
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
          style={{ background: 'var(--gradient-primary)' }}>
          + New Article
        </Link>
      </div>

      {articles && articles.length > 0 ? (
        <div className="space-y-3">
          {articles.map((article) => (
            <div key={article.id}
              className="card p-4 flex flex-col sm:flex-row sm:items-center gap-4"
              style={{ borderRadius: '12px' }}>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">{article.title}</h3>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded"
                    style={{ background: 'var(--accent-blue-dim)', color: 'var(--accent-blue)' }}>
                    {article.category}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded"
                    style={{
                      background: article.is_published ? 'var(--accent-green-dim)' : 'var(--accent-yellow-dim)',
                      color: article.is_published ? 'var(--accent-green)' : 'var(--accent-yellow)',
                    }}>
                    {article.is_published ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    {new Date(article.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </span>
                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    /news/{article.slug}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {article.is_published && (
                  <Link href={`/news/${article.slug}`} target="_blank"
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-white/10"
                    style={{ color: 'var(--text-secondary)' }}>
                    View
                  </Link>
                )}
                <Link href={`/admin/articles/${article.id}/edit`}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-white/10"
                  style={{ color: 'var(--accent-blue)' }}>
                  Edit
                </Link>
                <ArticleActions articleId={article.id} isPublished={article.is_published} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">📝</div>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            No articles yet. Start writing your first article!
          </p>
          <Link href="/admin/articles/new"
            className="inline-block px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
            style={{ background: 'var(--gradient-primary)' }}>
            Write First Article
          </Link>
        </div>
      )}
    </div>
  );
}
