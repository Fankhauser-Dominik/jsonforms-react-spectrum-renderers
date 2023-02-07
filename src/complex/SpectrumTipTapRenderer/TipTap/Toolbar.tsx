import React, { Key } from 'react';
import { Editor } from '@tiptap/react';
import TextAlignLeft from '@spectrum-icons/workflow/TextAlignLeft';
import TextAlignCenter from '@spectrum-icons/workflow/TextAlignCenter';
import TextAlignRight from '@spectrum-icons/workflow/TextAlignRight';
import TextAlignJustify from '@spectrum-icons/workflow/TextAlignJustify';
import TagBold from '@spectrum-icons/workflow/TagBold';
import TagItalic from '@spectrum-icons/workflow/TagItalic';
import TextSuperscript from '@spectrum-icons/workflow/TextSuperscript';
import TextSubscript from '@spectrum-icons/workflow/TextSubscript';
import TagUnderline from '@spectrum-icons/workflow/TagUnderline';
import TextStrikethrough from '@spectrum-icons/workflow/TextStrikethrough';
import TextBulleted from '@spectrum-icons/workflow/TextBulleted';
import TextNumbered from '@spectrum-icons/workflow/TextNumbered';
import Undo from '@spectrum-icons/workflow/Undo';
import Redo from '@spectrum-icons/workflow/Redo';
import {
  Flex,
  Item,
  Picker,
  ToggleButton,
  Tooltip,
  TooltipTrigger,
  View,
} from '@adobe/react-spectrum';
import { settings } from '../../../util';
import HeadingToolbarButtons from './toolbars/HeadingToolbarButtons';

const ProjectCreateContentToolbar = ({
  editor,
  readOnly,
  uischema,
}: {
  editor: Editor;
  readOnly: boolean;
  uischema: any;
}) => {
  const [selectedNodeOption, setSelectedNodeOption] = React.useState<Key | null>(null);
  let nodeOptions = uischema.options.nodeClasses.map((nodeClass: any) => {
    return { id: nodeClass.class, name: nodeClass.name ?? nodeClass.class };
  });

  const activeNodeOption = (selected: Key) => {
    setSelectedNodeOption(selected);
    editor
      .chain()
      .focus()
      .toggleNodeWithClass({
        class: selected.toString(),
      })
      .run();
  };
  return (
    <View
      borderWidth='thin'
      borderColor='dark'
      borderRadius='regular'
      UNSAFE_className='TipTapToolbar'
    >
      <Flex gap='size-25' margin='size-100' wrap>
        <HeadingToolbarButtons editor={editor} readOnly={readOnly} />
        <TooltipTrigger delay={settings.toolTipDelay}>
          <ToggleButton
            onPress={() =>
              editor.chain().focus().toggleMarker({ class: 'test', tag: 'span' }).run()
            }
            aria-label='bold'
            isSelected={editor.isActive('marker')}
            isDisabled={readOnly}
          >
            Marker1
          </ToggleButton>
          <Tooltip>Test</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger delay={settings.toolTipDelay}>
          <ToggleButton
            onPress={() =>
              editor.chain().focus().toggleMarker({ class: 'markerino', tag: 'span' }).run()
            }
            aria-label='bold'
            isSelected={editor.isActive('marker')}
            isDisabled={readOnly}
          >
            Marker2
          </ToggleButton>
          <Tooltip>Test</Tooltip>
        </TooltipTrigger>
        {nodeOptions && (
          <TooltipTrigger delay={settings.toolTipDelay}>
            <Picker
              items={nodeOptions}
              selectedKey={selectedNodeOption}
              aria-label='Add a class'
              onSelectionChange={(selected) => activeNodeOption(selected)}
            >
              {(item: any) => <Item>{item.name}</Item>}
            </Picker>
            <Tooltip>Test</Tooltip>
          </TooltipTrigger>
        )}
        <TooltipTrigger delay={settings.toolTipDelay}>
          <ToggleButton
            onPress={() => editor.chain().focus().toggleBold().run()}
            aria-label='bold'
            isSelected={editor.isActive('bold')}
            isDisabled={readOnly}
          >
            <TagBold size='S' />
          </ToggleButton>
          <Tooltip>Text Bold</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger delay={settings.toolTipDelay}>
          <ToggleButton
            onPress={() => editor.chain().focus().toggleItalic().run()}
            aria-label='italic'
            isSelected={editor.isActive('italic')}
            isDisabled={readOnly}
          >
            <TagItalic size='S' />
          </ToggleButton>
          <Tooltip>Text Italic</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger delay={settings.toolTipDelay}>
          <ToggleButton
            onPress={() => editor.chain().focus().toggleUnderline().run()}
            aria-label='underline'
            isSelected={editor.isActive('underline')}
            isDisabled={readOnly}
          >
            <TagUnderline size='S' />
          </ToggleButton>
          <Tooltip>Text Underlined</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger delay={settings.toolTipDelay}>
          <ToggleButton
            onPress={() => editor.chain().focus().toggleStrike().run()}
            aria-label='strike'
            isSelected={editor.isActive('strike')}
            isDisabled={readOnly}
          >
            <TextStrikethrough size='S' />
          </ToggleButton>
          <Tooltip>Text Strikethrough</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger delay={settings.toolTipDelay}>
          <ToggleButton
            onPress={() => editor.chain().focus().setTextAlign('left').run()}
            aria-label='left aligned'
            isSelected={editor.isActive({ textAlign: 'left' })}
            isDisabled={readOnly}
          >
            <TextAlignLeft size='S' />
          </ToggleButton>
          <Tooltip>Align left</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger delay={settings.toolTipDelay}>
          <ToggleButton
            onPress={() => editor.chain().focus().setTextAlign('center').run()}
            aria-label='Center aligned'
            isSelected={editor.isActive({ textAlign: 'center' })}
            isDisabled={readOnly}
          >
            <TextAlignCenter size='S' />
          </ToggleButton>
          <Tooltip>Align centered</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger delay={settings.toolTipDelay}>
          <ToggleButton
            onPress={() => editor.chain().focus().setTextAlign('right').run()}
            aria-label='Right aligned'
            isSelected={editor.isActive({ textAlign: 'right' })}
            isDisabled={readOnly}
          >
            <TextAlignRight size='S' />
          </ToggleButton>
          <Tooltip>Align right</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger delay={settings.toolTipDelay}>
          <ToggleButton
            onPress={() => editor.chain().focus().setTextAlign('justify').run()}
            aria-label='Justify aligned'
            isSelected={editor.isActive({ textAlign: 'justify' })}
            isDisabled={readOnly}
          >
            <TextAlignJustify size='S' />
          </ToggleButton>
          <Tooltip>Align justified</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger delay={settings.toolTipDelay}>
          <ToggleButton
            onPress={() => editor.chain().focus().toggleSuperscript().run()}
            aria-label='superscript'
            isSelected={editor.isActive('superscript')}
            isDisabled={readOnly}
          >
            <TextSuperscript size='S' />
          </ToggleButton>
          <Tooltip>Superscript</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger delay={settings.toolTipDelay}>
          <ToggleButton
            onPress={() => editor.chain().focus().toggleSubscript().run()}
            aria-label='subscript'
            isSelected={editor.isActive('subscript')}
            isDisabled={readOnly}
          >
            <TextSubscript size='S' />
          </ToggleButton>
          <Tooltip>Subscript</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger delay={settings.toolTipDelay}>
          <ToggleButton
            onPress={() => editor.chain().focus().toggleBulletList().run()}
            aria-label='bullettList'
            isSelected={editor.isActive('bulletList')}
            isDisabled={readOnly}
          >
            <TextBulleted size='S' />
          </ToggleButton>
          <Tooltip>Bullet List</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger delay={settings.toolTipDelay}>
          <ToggleButton
            onPress={() => editor.chain().focus().toggleOrderedList().run()}
            aria-label='orderedList'
            isSelected={editor.isActive('orderedList')}
            isDisabled={readOnly}
          >
            <TextNumbered size='S' />
          </ToggleButton>
          <Tooltip>Ordered List</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger delay={settings.toolTipDelay}>
          <ToggleButton
            onPress={() => editor.chain().focus().undo().run()}
            aria-label='undo'
            isSelected={false}
            isDisabled={!editor.can().undo() ?? readOnly}
          >
            <Undo size='S' />
          </ToggleButton>
          <Tooltip>Undo</Tooltip>
        </TooltipTrigger>
        <TooltipTrigger delay={settings.toolTipDelay}>
          <ToggleButton
            onPress={() => editor.chain().focus().redo().run()}
            aria-label='redo'
            isSelected={false}
            isDisabled={!editor.can().redo() ?? readOnly}
            UNSAFE_className='LastToolbarButton'
          >
            <Redo size='S' />
          </ToggleButton>
          <Tooltip>Redo</Tooltip>
        </TooltipTrigger>
      </Flex>
    </View>
  );
};

export default ProjectCreateContentToolbar;
