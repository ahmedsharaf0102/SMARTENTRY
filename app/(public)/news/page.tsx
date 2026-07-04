import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Financial News — SmartEntry',
  description: 'Breaking financial news, market analysis, and economic updates from global markets.',
};

const CATEGORIES = ['all', 'crypto', 'stocks', 'economy', 'analysis', 'general'];

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = category || 'all';
  const supabase = await createClient();

  let query = supabase
    .from('articles')
    .select('id, title, slug, summary, category, image_url, published_at, created_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (activeCategory !== 'all') {
    query = query.eq('category', activeCategory);
  }

  const { data: articles } = await query;

  return (
    <div className="fade-in py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4"
            style={{ fontFamily: 'var(--font-display)' }}>
            Financial <span style={{ color: 'var(--accent-blue)' }}>News</span>
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Breaking news, market analysis, and economic insights.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={cat === 'all' ? '/news' : `/news?category=${cat}`}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5"
              style={{
                background: activeCategory === cat ? 'var(--accent-blue-dim)' : 'var(--bg-card)',
                color: activeCategory === cat ? 'var(--accent-blue)' : 'var(--text-secondary)',
                border: `1px solid ${activeCategory === cat ? 'rgba(51,102,255,0.3)' : 'var(--border-color)'}`,
              }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Link>
          ))}
        </div>

        {/* Articles Grid */}
        {articles && articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link key={article.id} href={`/news/${article.slug}`}
                className="card group block overflow-hidden" style={{ borderRadius: '16px' }}>
                {/* Cover Image */}
                {article.image_url ? (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="aspect-video flex items-center justify-center text-4xl"
                    style={{ background: 'var(--bg-tertiary)' }}>
                    📰
                  </div>
                )}

                <div className="p-5">
                  {/* Category + Date */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--accent-blue-dim)', color: 'var(--accent-blue)' }}>
                      {article.category}
                    </span>
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {article.published_at
                        ? new Date(article.published_at).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })
                        : ''}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-white transition-colors">
                    {article.title}
                  </h2>

                  {/* Summary */}
                  {article.summary && (
                    <p className="text-sm line-clamp-2 leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}>
                      {article.summary}
                    </p>
                  )}

                  {/* Read more */}
                  <div className="mt-4 text-sm font-semibold transition-transform group-hover:translate-x-1"
                    style={{ color: 'var(--accent-blue)' }}>
                    Read more →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card p-16 text-center max-w-xl mx-auto">
            <div className="text-6xl mb-6">📰</div>
            <h2 className="text-xl font-bold mb-3">No articles yet</h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {activeCategory !== 'all'
                ? `No ${activeCategory} articles published yet. Check back soon!`
                : 'Content is on the way. Check back soon for the latest financial news and analysis.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
