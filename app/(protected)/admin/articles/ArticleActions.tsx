'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ArticleActions({ articleId, isPublished }: {
  articleId: number;
  isPublished: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function togglePublish() {
    setLoading(true);
    await supabase
      .from('articles')
      .update({
        is_published: !isPublished,
        published_at: !isPublished ? new Date().toISOString() : null,
      })
      .eq('id', articleId);
    router.refresh();
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this article?')) return;
    setLoading(true);
    await supabase.from('articles').delete().eq('id', articleId);
    router.refresh();
    setLoading(false);
  }

  return (
    <>
      <button
        onClick={togglePublish}
        disabled={loading}
        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-white/10 disabled:opacity-50"
        style={{ color: isPublished ? 'var(--accent-yellow)' : 'var(--accent-green)' }}
      >
        {isPublished ? 'Unpublish' : 'Publish'}
      </button>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-white/10 disabled:opacity-50"
        style={{ color: 'var(--accent-red)' }}
      >
        Delete
      </button>
    </>
  );
}
