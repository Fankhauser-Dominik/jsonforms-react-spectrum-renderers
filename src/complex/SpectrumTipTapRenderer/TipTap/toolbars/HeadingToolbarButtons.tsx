import React from 'react';
import { Editor } from '@tiptap/react';

import { Flex, ToggleButton, Picker, Item } from '@adobe/react-spectrum';

export default function HeadingToolbarButtons({ editor }: { editor: Editor }) {
  const currentText = () => {
    if (editor.isActive('heading')) {
      'H' + editor.getAttributes('heading').level;
    } else {
      ('Paragraph');
    }
  };

  const picker = true;

  let options = [
    { name: 'Paragraph' },
    { name: 'H2' },
    { name: 'H3' },
    { name: 'H4' },
    { name: 'H5' },
    { name: 'H6' },
    // { name: "Span" },
    //{ name: "Blockquote" },
  ];
  let [heading, setHeading]: any = React.useState(currentText());

  const pickerChange = (selected: string) => {
    setHeading(selected);
    switch (selected) {
      case 'Paragraph':
        editor.chain().focus().setParagraph().run();
        break;
      case 'H1':
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case 'H2':
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case 'H3':
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case 'H4':
        editor.chain().focus().toggleHeading({ level: 4 }).run();
        break;
      case 'H5':
        editor.chain().focus().toggleHeading({ level: 5 }).run();
        break;
      case 'H6':
        editor.chain().focus().toggleHeading({ level: 6 }).run();
        break;
      /* case "Span":
        editor.chain().focus().setParagraph().run();
        break; */
      case 'Blockquote':
        editor.chain().focus().setBlockquote().run();
        break;
      default:
        break;
    }
  };

  React.useEffect(() => {
    setHeading(
      editor.isActive('heading')
        ? 'H' + editor.getAttributes('heading').level
        : 'Paragraph'
    );
  }, [editor, currentText]);

  return (
    <Flex alignItems='center'>
      {picker ? (
        <Picker
          aria-label='Picker'
          label={false}
          items={options}
          selectedKey={heading}
          onSelectionChange={(selected: any) => pickerChange(selected)}
        >
          {(item) => <Item key={item.name}>{item.name}</Item>}
        </Picker>
      ) : (
        <div>
          {options.map((item: any, _index: number) => {
            return (
              <ToggleButton
                UNSAFE_className='ToggleButton'
                aria-label={item.name}
                isQuiet
                isSelected={heading === item.name}
                key={item.name}
                onPress={() => pickerChange(item.name)}
              >
                <strong>{item.name}</strong>
              </ToggleButton>
            );
          })}
        </div>
      )}
    </Flex>
  );
}
