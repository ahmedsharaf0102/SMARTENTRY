'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Save, Eye, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Dynamic import to avoid SSR issues with TipTap
const RichTextEditor = dynamic(() => import('@/app/components/RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="rounded-xl p-8 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
      <div className="skeleton w-full h-[400px]" />
    </div>
  ),
});

const CATEGORIES = [
  { value: 'crypto', label: 'Crypto' },
  { value: 'stocks', label: 'Stocks' },
  { value: 'economy', label: 'Economy' },
  { value: 'analysis', label: 'Analysis' },
  { value: 'general', label: 'General' },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function ArticleEditorForm({
  initialData,
}: {
  initialData?: {
    id?: number;
    title: string;
    slug: string;
    summary: string;
    content: string;
    category: string;
    image_url: string;
    is_published: boolean;
  };
}) {
  const isEditing = !!initialData?.id;
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [category, setCategory] = useState(initialData?.category || 'general');
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '');
  const [isPublished, setIsPublished] = useState(initialData?.is_published || false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!isEditing) {
      setSlug(slugify(value));
    }
  }

  async function handleSave(publish: boolean) {
    setSaving(true);
    setError('');
    setSuccess('');

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      setSaving(false);
      return;
    }

    const articleData = {
      title: title.trim(),
      slug: slug.trim() || slugify(title),
      summary: summary.trim() || null,
      content,
      category,
      image_url: imageUrl.trim() || null,
      is_published: publish,
      published_at: publish ? new Date().toISOString() : null,
    };

    try {
      if (isEditing && initialData?.id) {
        const { error: err } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', initialData.id);
        if (err) throw err;
        setSuccess(publish ? 'Article published!' : 'Draft saved!');
      } else {
        const { error: err } = await supabase
          .from('articles')
          .insert(articleData);
        if (err) throw err;
        setSuccess(publish ? 'Article published!' : 'Draft saved!');
        setTimeout(() => router.push('/admin/articles'), 1000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save article');
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = {
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
  };

  return (
    <div className="fade-in max-w-4xl">
      <Link href="/admin/articles" className="inline-flex items-center gap-1 text-sm mb-6 transition-colors hover:text-white"
        style={{ color: 'var(--text-secondary)' }}>
        <ArrowLeft size={14} /> Back to articles
      </Link>

      {/* Status messages */}
      {error && (
        <div className="p-3 rounded-lg text-sm mb-4" style={{ background: 'var(--accent-red-dim)', color: 'var(--accent-red)' }}>
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 rounded-lg text-sm mb-4" style={{ background: 'var(--accent-green-dim)', color: 'var(--accent-green)' }}>
          {success}
        </div>
      )}

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Article title..."
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
            style={{ ...inputStyle, '--tw-ring-color': 'var(--accent-blue)' } as React.CSSProperties}
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Slug <span className="font-normal" style={{ color: 'var(--text-muted)' }}>(URL path)</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>/news/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="article-url-slug"
              className="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
              style={{ ...inputStyle, '--tw-ring-color': 'var(--accent-blue)' } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Category & Cover Image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none cursor-pointer"
              style={inputStyle}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Cover Image URL <span className="font-normal" style={{ color: 'var(--text-muted)' }}>(optional)</span>
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
              style={{ ...inputStyle, '--tw-ring-color': 'var(--accent-blue)' } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Summary */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Summary <span className="font-normal" style={{ color: 'var(--text-muted)' }}>(for article cards & SEO)</span>
          </label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="A brief 1-2 sentence summary..."
            rows={2}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all focus:ring-2"
            style={{ ...inputStyle, '--tw-ring-color': 'var(--accent-blue)' } as React.CSSProperties}
          />
        </div>

        {/* Content Editor */}
        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <RichTextEditor content={content} onChange={setContent} />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4"
          style={{ borderTop: '1px solid var(--border-color)' }}>
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 disabled:opacity-50 glass"
            style={{ color: 'var(--text-primary)' }}
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
            style={{ background: 'var(--gradient-primary)' }}
          >
            <Eye size={16} />
            {saving ? 'Publishing...' : isPublished ? 'Update & Publish' : 'Publish Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
