/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Copyright (c) 2020 headwire.com, Inc
  https://github.com/headwirecom/jsonforms-react-spectrum-renderers


  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import {
  ActionButton,
  Button,
  ButtonGroup,
  Content,
  Dialog,
  DialogContainer,
  Divider,
  Flex,
  Heading,
  Text,
  Tooltip,
  TooltipTrigger,
  View,
} from '@adobe/react-spectrum';
import Delete from '@spectrum-icons/workflow/Delete';
import ChevronDown from '@spectrum-icons/workflow/ChevronDown';
import ChevronUp from '@spectrum-icons/workflow/ChevronUp';
import { settings } from '../../util';

export interface OwnPropsOfSpectrumArrayItem {
  childLabel?: string;
  data: any;
  displayPath?: string;
  expanded: number | undefined;
  handleClose?: any;
  handleExpand(index: number): () => void;
  index: number;
  isExpanded?: boolean;
  open?: boolean;
  path: string;
  removeItem: (path: string, value: number) => () => void;
  setOpen?: any;
  showItemNumber?: boolean;
}

const SpectrumArrayHeader = ({
  childLabel,
  data,
  displayPath,
  expanded,
  handleClose,
  handleExpand,
  index,
  isExpanded,
  open,
  path,
  removeItem,
  setOpen,
  showItemNumber,
}: OwnPropsOfSpectrumArrayItem) => {
  return (
    <View
      aria-selected={expanded}
      UNSAFE_className='array-item-header'
      UNSAFE_style={expanded ? { zIndex: 50 } : {}}
    >
      <Flex
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        // UNSAFE_className='spectrum-array-item-container'
      >
        {showItemNumber && (
          <View UNSAFE_className='spectrum-array-item-number'>
            <Text>{index + 1}</Text>
          </View>
        )}
        <ActionButton
          flex='auto'
          isQuiet
          onPress={handleExpand(index)}
          aria-label={`expand-item-${childLabel}`}
        >
          {data?._path ? (
            <Text
              UNSAFE_style={{
                position: 'absolute',
                direction: 'rtl',
                opacity: 0.7,
                bottom: -5,
                left: 0,
                fontSize: '12px',
                height: 18,
                maxWidth: 'calc(100% - 12px)',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textAlign: 'left',
                alignSelf: 'start',
                justifyContent: 'start',
              }}
            >
              {displayPath}
            </Text>
          ) : null}
          <Text
            UNSAFE_style={{
              textAlign: 'left',
              width: '100%',
              transform: data?._path ? 'translateY(-20%)' : '',
              fontWeight: 600,
            }}
          >
            {childLabel}
          </Text>
        </ActionButton>
        <View>
          <TooltipTrigger delay={settings.toolTipDelay}>
            <ActionButton
              onPress={handleExpand(index)}
              isQuiet={true}
              aria-label={`expand-item-${childLabel}`}
            >
              {isExpanded ? (
                <ChevronUp aria-label='Collapse' size='S' />
              ) : (
                <ChevronDown aria-label='Expand' size='S' />
              )}
            </ActionButton>
            <Tooltip>{isExpanded ? 'Collapse' : 'Expand'}</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger delay={settings.toolTipDelay}>
            <ActionButton onPress={() => setOpen(true)} aria-label={`delete-item-${childLabel}`}>
              <Delete aria-label='Delete' size='S' />
            </ActionButton>
            <Tooltip>Delete</Tooltip>
          </TooltipTrigger>
          <DialogContainer onDismiss={handleClose}>
            {open && (
              <Dialog>
                <Heading>Delete Item?</Heading>
                <Divider />
                <Content>Are you sure you wish to delete this item?</Content>
                <ButtonGroup>
                  <Button variant='secondary' onPress={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    autoFocus
                    variant='cta'
                    onPressStart={removeItem(path, index)}
                    onPressEnd={handleClose}
                  >
                    Delete
                  </Button>
                </ButtonGroup>
              </Dialog>
            )}
          </DialogContainer>
        </View>
      </Flex>
    </View>
  );
};

export default SpectrumArrayHeader;
