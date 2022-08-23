import * as React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import TypographyExtension from '@tiptap/extension-typography';
import UnderlineExtension from '@tiptap/extension-underline';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Dropcursor from '@tiptap/extension-dropcursor';
import Link from '@tiptap/extension-link';
import Code from '@tiptap/extension-code';
import TextAlign from '@tiptap/extension-text-align';
import Focus from '@tiptap/extension-focus';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';

import ProjectCreateContentToolbar from './Toolbar';
import './styles.css';

import { Flex } from '@adobe/react-spectrum';

interface TipTapProps {
  EditorJSONCallback: any;
}

export default function EditorComponent({
  // setContent,
  content,
  EditorJSONCallback,
}: TipTapProps & {
  // setContent: (value: string) => void;
  content: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Subscript,
      Superscript,
      Highlight,
      TypographyExtension,
      UnderlineExtension,
      Document,
      Paragraph,
      Text,
      Dropcursor,
      Code,
      Link,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Focus.configure({
        className: 'has-focus',
        mode: 'all',
      }),
    ],
    content: content,
  });

  const firstRender = React.useRef(true);
  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      EditorJSONCallback(editor?.getJSON());
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [editor?.getJSON()]);

  if (!editor) return null;

  return (
    <Flex direction='column'>
      <ProjectCreateContentToolbar editor={editor} />
      <EditorContent editor={editor} />
    </Flex>
  );
}
