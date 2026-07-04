import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ArticleEditorForm from '@/app/components/ArticleEditorForm';

export const metadata: Metadata = {
  title: 'Edit Article — SmartEntry Admin',
};

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();

  if (!article) {
    notFound();
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>
        ✏️ Edit Article
      </h2>
      <ArticleEditorForm
        initialData={{
          id: article.id,
          title: article.title,
          slug: article.slug,
          summary: article.summary || '',
          content: article.content,
          category: article.category,
          image_url: article.image_url || '',
          is_published: article.is_published,
        }}
      />
    </div>
  );
}
