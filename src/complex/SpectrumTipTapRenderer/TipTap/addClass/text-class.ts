import { getMarkAttributes, Mark, mergeAttributes } from '@tiptap/core';

export interface TextStyleOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    textStyle: {
      /**
       * Remove spans without inline style attributes.
       */
      removeEmptyTextStyle: () => ReturnType;
    };
  }
}

export const TextStyle = Mark.create<TextStyleOptions>({
  name: 'textStyle',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span',
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

  renderHTML({ HTMLAttributes }) {
    console.log('renderHTML', HTMLAttributes);
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addCommands() {
    return {
      removeEmptyTextStyle:
        () =>
        ({ state, commands }) => {
          const attributes = getMarkAttributes(state, this.type);
          const hasClass = Object.entries(attributes).some(([, value]) => !!value);
          console.log(state);
          //   if (hasClass) {
          //     return true;
          //   }

          return commands.unsetMark(this.name);
        },
    };
  },
});
