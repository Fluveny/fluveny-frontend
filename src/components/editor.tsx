import { cn } from '@/app/utils/cn';
import { useGrammarRuleModuleWindows } from '@/features/module/stores/use-grammar-rule-module-windows';
import Color from '@tiptap/extension-color';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { EditorContent, EditorContext, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import { useFormContext, type FieldError } from 'react-hook-form';
import { Toolbar } from './toolbar';

interface EditorProps {
  registerCamp: string;
  initialContent?: string;
  error: FieldError | undefined;
}

export const Editor = ({
  registerCamp,
  initialContent,
  error,
}: EditorProps) => {
  const { register, setValue, getValues, formState } = useFormContext();
  const updateDraftData = useGrammarRuleModuleWindows(
    (state) => state.updateDraftData,
  );
  const currentPosition = useGrammarRuleModuleWindows(
    (state) => state.currentPosition,
  );

  useEffect(() => {
    register(registerCamp);
  }, [register, registerCamp]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: {
          autolink: true,
          openOnClick: true,
          defaultProtocol: 'https://',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Image,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: initialContent || '',
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      },
    },
    onUpdate({ editor }) {
      const html = editor.getHTML();
      const value = html === '<p></p>' ? '' : html;
      setValue(registerCamp, value, {
        shouldValidate: formState.isSubmitted,
        shouldDirty: true,
      });
    },
    onBlur() {
      if (currentPosition !== null) {
        const values = getValues();
        updateDraftData(currentPosition, values);
      }
    },
  });

  useEffect(() => {
    if (!editor || initialContent === undefined) {
      return;
    }

    const currentContent = editor.getHTML();

    if (currentContent !== initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [initialContent, editor]);

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className="space-y-3">
        <Toolbar />
        <EditorContent
          editor={editor}
          className={cn(
            'prose prose-sm md:prose-lg prose-img:mx-auto prose-p:text-lg min-h-50 max-w-none rounded-md border p-4 lg:min-h-100',
            error && 'animate-shake border-red-500 text-red-500',
          )}
        />
        {error && (
          <p className="flex text-center text-sm text-red-500">
            {error.message}
          </p>
        )}
      </div>
    </EditorContext.Provider>
  );
};
