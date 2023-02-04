import { Node, mergeAttributes } from '@tiptap/core';

export interface NodeOptions {
  HTMLAttributes: Record<string, any>;
  classes: Array<string>;
  tag: string;
  excludes: string;
  shortcuts: Array<string>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    nodes: {
      /**
       * Set a nodes
       */
      setNode: (attributes?: { class: string }) => ReturnType;
      /**
       * Toggle a nodes
       */
      toggleNode: (attributes?: { class: string }) => ReturnType;
    };
  }
}

export const Nodes = Node.create<NodeOptions>({
  name: 'nodes',

  addOptions() {
    return {
      tag: 'p',
      classes: [''],
      excludes: 'nodes',
      HTMLAttributes: {},
      shortcuts: [],
    };
  },

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
    };
  },

  parseHTML() {
    return [
      {
        tag: this.options.tag,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [this.options.tag, mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setNode:
        (attributes) =>
        ({ commands }) => {
          console.log('setNode', attributes, commands);
          return commands.setNode(this.name, { attributes });
        },
    };
  },

  addKeyboardShortcuts() {
    return Object.fromEntries(
      this.options.classes
        .slice(0, this.options.shortcuts.length)
        .flatMap((x, i) =>
          this.options.shortcuts[i]
            ? [[this.options.shortcuts[i], () => this.editor.commands.toggleNode({ class: x })]]
            : []
        )
    );
  },
});
