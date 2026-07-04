import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: article } = await supabase
    .from('articles')
    .select('title, summary, image_url')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (!article) return { title: 'Article Not Found — SmartEntry' };

  return {
    title: `${article.title} — SmartEntry News`,
    description: article.summary || article.title,
    openGraph: {
      title: article.title,
      description: article.summary || article.title,
      images: article.image_url ? [article.image_url] : [],
      type: 'article',
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (!article) {
    notFound();
  }

  return (
    <div className="fade-in py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link href="/news" className="inline-flex items-center gap-1 text-sm mb-8 transition-colors hover:text-white"
          style={{ color: 'var(--text-secondary)' }}>
          ← Back to News
        </Link>

        {/* Category + Date */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
            style={{ background: 'var(--accent-blue-dim)', color: 'var(--accent-blue)' }}>
            {article.category}
          </span>
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {article.published_at
              ? new Date(article.published_at).toLocaleDateString('en-GB', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                })
              : ''}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight"
          style={{ fontFamily: 'var(--font-display)' }}>
          {article.title}
        </h1>

        {/* Summary */}
        {article.summary && (
          <p className="text-lg mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {article.summary}
          </p>
        )}

        {/* Cover Image */}
        {article.image_url && (
          <div className="rounded-2xl overflow-hidden mb-10">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Article Content */}
        <article
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Bottom nav */}
        <div className="mt-16 pt-8 flex items-center justify-between"
          style={{ borderTop: '1px solid var(--border-color)' }}>
          <Link href="/news" className="text-sm font-semibold transition-colors hover:text-white"
            style={{ color: 'var(--accent-blue)' }}>
            ← More News
          </Link>
          <Link href="/markets" className="text-sm font-semibold transition-colors hover:text-white"
            style={{ color: 'var(--accent-blue)' }}>
            Markets Overview →
          </Link>
        </div>
      </div>
    </div>
  );
}
