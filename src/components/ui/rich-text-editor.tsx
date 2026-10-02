'use client';

import { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

function normalizeHtml(html: string): string {
  if (!html || html === '<p></p>') return '';
  return html;
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(
        'h-8 w-8',
        active && 'bg-blue-100 text-blue-700 hover:bg-blue-100'
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Escriba aquí...',
  disabled = false,
  className,
}: RichTextEditorProps) {
  const syncingFromProps = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Placeholder.configure({ placeholder })],
    content: value || '',
    editable: !disabled,
    onUpdate: ({ editor: ed }) => {
      if (syncingFromProps.current) return;
      onChange(ed.isEmpty ? '' : ed.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const next = normalizeHtml(value);
    const current = normalizeHtml(editor.getHTML());
    if (next === current) return;

    syncingFromProps.current = true;
    editor.commands.setContent(value || '', { emitUpdate: false });
    requestAnimationFrame(() => {
      syncingFromProps.current = false;
    });
  }, [editor, value]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  if (!editor) {
    return (
      <div
        className={cn(
          'min-h-[200px] rounded-xl border-2 border-slate-100 bg-slate-50',
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border-2 border-slate-100 bg-white shadow-sm transition-all focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      <div className="flex flex-wrap gap-1 border-b border-slate-100 bg-slate-50/80 p-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          disabled={disabled}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          disabled={disabled}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive('heading', { level: 2 })}
          disabled={disabled}
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive('heading', { level: 3 })}
          disabled={disabled}
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          disabled={disabled}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          disabled={disabled}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
      </div>
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none px-4 py-3 [&_.ProseMirror]:min-h-[200px] [&_.ProseMirror]:outline-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-slate-400 [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]"
      />
    </div>
  );
}
