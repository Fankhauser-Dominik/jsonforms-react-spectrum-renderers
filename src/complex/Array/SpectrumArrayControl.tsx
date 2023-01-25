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
import React from 'react';
import { ArrayControlProps, createDefaultValue } from '@jsonforms/core';
import {
  ActionButton,
  Flex,
  Heading,
  Text,
  Tooltip,
  TooltipTrigger,
  View,
} from '@adobe/react-spectrum';
import SpectrumArrayItem from './SpectrumArrayItem';
import Add from '@spectrum-icons/workflow/Add';
import { HandleChangeProps, settings, withHandleChange } from '../../util';
import DragAndDrop from '../ArrayModal/SpectrumArrayModalControl/DragAndDrop';

const SpectrumArrayControl = ({
  addItem,
  data,
  enabled,
  handleChange,
  label,
  moveDown,
  moveUp,
  path,
  removeItems,
  renderers,
  schema,
  uischema,
  uischemas,
}: ArrayControlProps & HandleChangeProps) => {
  const [moveUpIndex, setMoveUpIndex]: any = React.useState(null);
  const [openedIndex, setOpenedIndex] = React.useState<number | undefined>(undefined);
  const handleRemoveItem = React.useCallback(
    (p: string, value: any) => () => {
      if (removeItems) {
        removeItems(p, [value])();
      }
    },
    [removeItems]
  );

  const [indexOfFittingSchemaArray, setIndexOfFittingSchemaArray] = React.useState(
    data?.map((boundData: any) => (boundData ? undefined : 999)) ?? []
  );

  React.useEffect(() => {
    setIndexOfFittingSchemaArray(
      data?.map((boundData: any) => (boundData ? undefined : 999)) ?? []
    );
  }, []);

  const [expanded, setExpanded] = React.useState<number>(-1);

  const onExpand = React.useCallback(
    (index: number) => () => {
      setExpanded((current) => (current === index ? -1 : index));
    },
    [setExpanded]
  );

  const onPressHandler = () => {
    addItem(path, createDefaultValue(schema ?? {}))();
  };

  const callbackOpenedIndex = (index: number | undefined) => {
    setOpenedIndex(index);
  };

  const sortMode: string | boolean = uischema?.options?.sortMode ?? 'DragAndDrop';

  return (
    <View id='json-form-array-wrapper'>
      <Flex direction='row' justifyContent='space-between'>
        <Heading level={4}>{label}</Heading>
      </Flex>
      <Flex direction='column' id={`spectrum-renderer-arrayContentWrapper_${path}`} gap='size-100'>
        {data && data.length ? (
          <>
            {sortMode ? (
              <DragAndDrop
                callbackOpenedIndex={callbackOpenedIndex}
                data={data}
                enabled={enabled}
                handleChange={handleChange}
                handleRemoveItem={handleRemoveItem}
                indexOfFittingSchemaArray={indexOfFittingSchemaArray}
                moveDown={moveDown}
                moveUp={moveUp}
                moveUpIndex={moveUpIndex}
                onPressHandler={onPressHandler}
                openedIndex={openedIndex}
                path={path}
                removeItems={removeItems}
                renderers={renderers}
                schema={schema}
                setMoveUpIndex={setMoveUpIndex}
                uischema={uischema}
                uischemas={uischemas}
              />
            ) : (
              Array.from(Array(data.length)).map((_, index) => {
                return (
                  <Flex key={index} direction='column' alignItems='stretch' flex='auto inherit'>
                    <SpectrumArrayItem
                      data={data[index]}
                      index={index}
                      path={path}
                      schema={schema}
                      handleExpand={onExpand}
                      removeItem={handleRemoveItem}
                      expanded={expanded}
                      uischema={uischema}
                      uischemas={uischemas}
                      renderers={renderers}
                      key={index + (expanded === index ? 9999 : 0)}
                    ></SpectrumArrayItem>
                  </Flex>
                );
              })
            )}
          </>
        ) : (
          <Text>No data</Text>
        )}
        <TooltipTrigger delay={settings.toolTipDelay}>
          <ActionButton
            onPress={addItem(path, createDefaultValue(schema ?? {}))}
            isQuiet={true}
            aria-label='add a new item'
            UNSAFE_className='add-item'
          >
            <Add aria-label='Change Reference' size='L' />
          </ActionButton>
          <Tooltip>Add a new Item</Tooltip>
        </TooltipTrigger>
      </Flex>
    </View>
  );
};

export default withHandleChange(SpectrumArrayControl);
