import { mergeAttributes, Node } from '@tiptap/core';

export interface classNodeOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    node: {
      /**
       * Set a classNode
       */
      setClassNode: (attributes: {
        classNames: string[];
        nodeName: string;
        level: number;
      }) => ReturnType;
      /**
       * Toggle a classNode
       */
      toggleClassNode: (attributes: {
        classNames: string[];
        nodeName: string;
        level: number;
      }) => ReturnType;
    };
  }
}

export const classNode = Node.create<classNodeOptions>({
  name: 'classNode',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  content: 'inline*',

  group: 'block',

  defining: true,

  addAttributes() {
    return {
      classNames: {
        default: [],
      },
      nodeName: {
        default: 'h2',
      },
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    // const hasLevel = this.options.levels.includes(node.attrs.level);
    // const level = hasLevel ? node.attrs.level : this.options.levels[0];
    console.log(
      'HTMLAttributes',
      HTMLAttributes.nodeName,
      HTMLAttributes.classNames,
      node.attrs.classNames
    );

    const classNames = HTMLAttributes.classNames.join(' ');
    const nodeName = HTMLAttributes.nodeName || 'h2';
    delete HTMLAttributes.nodeName;
    delete HTMLAttributes.classNames;

    if (classNames) HTMLAttributes.class = classNames;

    if (nodeName) console.log('nodeName', nodeName, HTMLAttributes);
    return [nodeName, mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setClassNode:
        (attributes) =>
        ({ commands }) => {
          console.log('toggle', attributes, commands, this);
          return commands.setNode(this.name, attributes);
        },
      toggleClassNode:
        (attributes) =>
        ({ commands }) => {
          console.log('toggle', attributes, commands, this);
          return commands.toggleNode(this.name, 'heading', attributes);
        },
    };
  },
});
