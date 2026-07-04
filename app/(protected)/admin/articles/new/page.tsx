import type { Metadata } from 'next';
import ArticleEditorForm from '@/app/components/ArticleEditorForm';

export const metadata: Metadata = {
  title: 'New Article — SmartEntry Admin',
};

export default function NewArticlePage() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>
        ✏️ Write New Article
      </h2>
      <ArticleEditorForm />
    </div>
  );
}
