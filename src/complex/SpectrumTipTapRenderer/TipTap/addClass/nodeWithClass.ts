import { Node, mergeAttributes } from '@tiptap/core';

declare type Level = 1 | 2 | 3 | 4 | 5 | 6;
export interface MarkerOptions {
  level: Level;
  HTMLAttributes: Record<string, any>;
  classes: Array<string>;
  tag: string;
  nodeName: string;
  excludes: string;
  shortcuts: Array<string>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    nodeWithClass: {
      /**
       * Set a nodeWithClass
       */
      setNodeWithClass: (attributes: {
        class: string;
        tag: string;
        nodeName?: string;
      }) => ReturnType;
      /**
       * Toggle a nodeWithClass
       */
      toggleNodeWithClass: (attributes: {
        class: string;
        tag: string;
        nodeName?: string;
        level?: Level;
      }) => ReturnType;
      /**
       * Unset a nodeWithClass
       */
      unsetNodeWithClass: () => ReturnType;
    };
  }
}

export const nodeWithClass = Node.create<MarkerOptions>({
  name: 'nodeWithClass',

  addOptions() {
    return {
      tag: 'p',
      nodeName: 'paragraph',
      classes: [''],
      level: 6,
      excludes: 'nodeWithClass',
      HTMLAttributes: {},
      shortcuts: [],
    };
  },

  content: 'inline*',

  group: 'block',

  defining: true,

  addAttributes() {
    return {
      class: {
        default: this.options.classes[0],
        parseHTML: (element) => element.getAttribute('class'),
        renderHTML: (attributes) => {
          if (!attributes.class) {
            return {};
          }
          return {
            class: attributes.class,
          };
        },
      },
      tag: {
        default: 'span',
        parseHTML: (element) => element.getAttribute('tag'),
        renderHTML: (attributes) => {
          if (!attributes.tag) {
            return {};
          }
          return {
            tag: attributes.tag,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: this.options.tag,
        getAttrs: (element) => {
          const hasClass = (element as HTMLElement).hasAttribute('class');
          console.log('parseHTML', hasClass);

          if (!hasClass) {
            return false;
          }

          return {};
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    const tag = HTMLAttributes?.tag || this?.options?.tag;
    delete HTMLAttributes?.tag;
    //delete HTMLAttributes?.level;
    console.log(node);
    return [tag, mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setNodeWithClass:
        (attributes) =>
        ({ commands }) => {
          return commands.setNode(this.name, attributes);
        },
      toggleNodeWithClass:
        (attributes) =>
        ({ chain, editor }) => {
          const nodeName: string = attributes?.nodeName || this.options?.nodeName || 'paragraph';
          const currentClass: string = editor.getAttributes(nodeName).class ?? '';
          const newClass: string = currentClass.replace(attributes.class, '');
          let nodeClass: string | undefined = undefined;
          if (newClass !== currentClass) {
            if (newClass !== '') {
              nodeClass = newClass;
            } else {
              nodeClass = undefined;
            }
          } else {
            nodeClass = attributes.class;
          }

          console.log('currentClasses', currentClass, newClass);
          if (nodeName === 'heading') {
            const level: Level = attributes.level || this.options.level || 6;
            return chain()
              .setHeading({ level: level })
              .updateAttributes(nodeName, {
                class: nodeClass,
              })
              .unsetBlockquote()
              .run();
          } else if (nodeName === 'blockquote') {
            return chain().setNode(this.name, attributes).setParagraph().setBlockquote().run();
          } else {
            return chain().setNode(this.name, attributes).setParagraph().unsetBlockquote().run();
          }
        },
    };
  },
});
