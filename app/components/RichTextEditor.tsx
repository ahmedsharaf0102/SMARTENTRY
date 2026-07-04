'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, Quote, Code, Image as ImageIcon,
  Link as LinkIcon, Heading1, Heading2, Heading3, Undo, Redo,
  AlignLeft, AlignCenter, AlignRight, Minus,
} from 'lucide-react';

interface Props {
  content: string;
  onChange: (html: string) => void;
}

function ToolbarButton({ onClick, active, children, title }: {
  onClick: () => void; active?: boolean; children: React.ReactNode; title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="p-1.5 rounded-lg transition-all hover:bg-white/10"
      style={{
        background: active ? 'var(--accent-blue-dim)' : 'transparent',
        color: active ? 'var(--accent-blue)' : 'var(--text-secondary)',
      }}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-blue-400 underline' },
      }),
      Image.configure({
        HTMLAttributes: { class: 'rounded-lg max-w-full mx-auto my-4' },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your article...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none min-h-[400px] outline-none p-4',
      },
    },
  });

  if (!editor) return null;

  function addImage() {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }

  function addLink() {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-color)' }}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2"
        style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
        {/* Headings */}
        <ToolbarButton title="Heading 1" active={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          <Heading1 size={16} />
        </ToolbarButton>
        <ToolbarButton title="Heading 2" active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton title="Heading 3" active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 size={16} />
        </ToolbarButton>

        <div className="w-px h-5 mx-1" style={{ background: 'var(--border-color)' }} />

        {/* Formatting */}
        <ToolbarButton title="Bold" active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton title="Italic" active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton title="Underline" active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon size={16} />
        </ToolbarButton>
        <ToolbarButton title="Strikethrough" active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough size={16} />
        </ToolbarButton>

        <div className="w-px h-5 mx-1" style={{ background: 'var(--border-color)' }} />

        {/* Alignment */}
        <ToolbarButton title="Align Left" active={editor.isActive({ textAlign: 'left' })}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}>
          <AlignLeft size={16} />
        </ToolbarButton>
        <ToolbarButton title="Align Center" active={editor.isActive({ textAlign: 'center' })}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}>
          <AlignCenter size={16} />
        </ToolbarButton>
        <ToolbarButton title="Align Right" active={editor.isActive({ textAlign: 'right' })}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}>
          <AlignRight size={16} />
        </ToolbarButton>

        <div className="w-px h-5 mx-1" style={{ background: 'var(--border-color)' }} />

        {/* Lists */}
        <ToolbarButton title="Bullet List" active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton title="Numbered List" active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={16} />
        </ToolbarButton>

        <div className="w-px h-5 mx-1" style={{ background: 'var(--border-color)' }} />

        {/* Block elements */}
        <ToolbarButton title="Quote" active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote size={16} />
        </ToolbarButton>
        <ToolbarButton title="Code Block" active={editor.isActive('codeBlock')}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          <Code size={16} />
        </ToolbarButton>
        <ToolbarButton title="Horizontal Rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus size={16} />
        </ToolbarButton>

        <div className="w-px h-5 mx-1" style={{ background: 'var(--border-color)' }} />

        {/* Media */}
        <ToolbarButton title="Insert Image" onClick={addImage}>
          <ImageIcon size={16} />
        </ToolbarButton>
        <ToolbarButton title="Insert Link" active={editor.isActive('link')} onClick={addLink}>
          <LinkIcon size={16} />
        </ToolbarButton>

        <div className="w-px h-5 mx-1" style={{ background: 'var(--border-color)' }} />

        {/* Undo/Redo */}
        <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()}>
          <Undo size={16} />
        </ToolbarButton>
        <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()}>
          <Redo size={16} />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <div style={{ background: 'var(--bg-card)' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
