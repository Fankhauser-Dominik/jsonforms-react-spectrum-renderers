import * as React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import TypographyExtension from '@tiptap/extension-typography';
import UnderlineExtension from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Focus from '@tiptap/extension-focus';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import ProjectCreateContentToolbar from './Toolbar';
import { Marker } from './addClass';
import { classNode } from './addClass/classNode';
import { nodeWithClass } from './addClass/nodeWithClass';
import { TextStyle } from './addClass/text-class';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Heading } from '@tiptap/extension-heading';
import { Flex } from '@adobe/react-spectrum';

interface TipTapProps {
  EditorJSONCallback: any;
  returnMode: any;
  noToolbar: boolean;
  readOnly: boolean;
  uischema: any;
}

export default function EditorComponent({
  content,
  EditorJSONCallback,
  noToolbar = false,
  returnMode = false,
  readOnly = false,
  uischema,
}: TipTapProps & {
  content: string;
}) {
  const CustomParagraph = Paragraph.extend({
    addAttributes() {
      return {
        class: {
          default: null,
          // Customize the HTML parsing (for example, to load the initial content)
          parseHTML: (element) => element.getAttribute('class'),
          // … and customize the HTML rendering.
          renderHTML: (attributes) => {
            return {
              class: attributes.class,
            };
          },
        },
      };
    },
  });
  const CustomHeading = Heading.extend({
    addAttributes() {
      return {
        class: {
          default: null,
          // Customize the HTML parsing (for example, to load the initial content)
          parseHTML: (element) => element.getAttribute('class'),
          // … and customize the HTML rendering.
          renderHTML: (attributes) => {
            return {
              class: attributes.class,
            };
          },
        },
      };
    },
  });
  const editor = useEditor({
    editable: !readOnly,
    extensions: [
      StarterKit,
      Subscript,
      Superscript,
      Highlight,
      TypographyExtension,
      UnderlineExtension,
      Link,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Focus.configure({
        className: 'has-focus',
        mode: 'all',
      }),
      CustomParagraph,
      CustomHeading,
      Marker,
      // Nodes,
      classNode,
      nodeWithClass,
      TextStyle,
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
      if (returnMode === 'json') {
        EditorJSONCallback(editor?.getJSON());
      } else if (returnMode === 'text') {
        EditorJSONCallback(editor?.getText());
      } else {
        EditorJSONCallback(editor?.getHTML());
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [editor?.getHTML()]);

  if (!editor) return null;

  return (
    <Flex direction='column'>
      {!noToolbar && (
        <ProjectCreateContentToolbar editor={editor} readOnly={readOnly} uischema={uischema} />
      )}
      <EditorContent
        editor={editor}
        className={`${noToolbar ? 'noToolbar' : ''} ${readOnly ? 'readOnly' : ''}`}
      />
    </Flex>
  );
}
