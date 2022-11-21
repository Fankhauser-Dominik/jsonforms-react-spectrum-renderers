/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Copyright (c) 2022 headwire.com, Inc
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
import { ArrayControlProps, OwnPropsOfControl, createDefaultValue } from '@jsonforms/core';
import {
  TooltipTrigger,
  Tooltip,
  Flex,
  Heading,
  Text,
  View,
  ActionButton,
} from '@adobe/react-spectrum';
import SpectrumArrayModalItem from '../SpectrumArrayModalItem/ModalItemComponent';
import Add from '@spectrum-icons/workflow/Add';
import { indexOfFittingSchemaObject } from '../utils';
import DragAndDrop from './DragAndDrop';
import AddDialog from './AddDialog';
import SortButtons from './SortButtons';
import { withHandleChange, HandleChangeProps } from '../../../util';
import settings from '../../../util/settings';

export interface OverrideProps extends OwnPropsOfControl {
  indexOfFittingSchema?: number;
}

const SpectrumArrayModalControl = React.memo(
  ({
    addItem,
    data,
    enabled,
    handleChange,
    label,
    path,
    removeItems,
    renderers,
    schema,
    uischema,
    uischemas,
  }: ArrayControlProps & OverrideProps & HandleChangeProps) => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const [moveUpIndex, setMoveUpIndex]: any = React.useState(null);
    const [openedIndex, setOpenedIndex] = React.useState<number | undefined>(undefined);
    const handleClose = () => setOpen(false);

    const [indexOfFittingSchemaArray, setIndexOfFittingSchemaArray] = React.useState(
      data?.map((boundData: any) => (boundData ? undefined : 999)) ?? []
    );

    React.useEffect(() => {
      setIndexOfFittingSchemaArray(
        data?.map((boundData: any) => (boundData ? undefined : 999)) ?? []
      );
    }, []);

    const handleRemoveItem = React.useCallback(
      (path: string, value: any) => () => {
        if (removeItems) {
          console.log('removeItems', removeItems);
          removeItems(path, [value])();
          setRefKey(Math.random());
        }
        indexOfFittingSchemaArray.splice(value, 1);
      },
      [removeItems]
    );

    const handleOnConfirm = (handleClose: any, indexOfFittingSchema: number) => {
      setIndexOfFittingSchemaArray([
        ...indexOfFittingSchemaArray,
        Math.floor(indexOfFittingSchema),
      ]);
      if (schema.oneOf) {
        addItem(path, createDefaultValue(schema.oneOf[indexOfFittingSchema]))();
      }
      indexOfFittingSchemaObject[path + `.${data?.length}`] = selectedIndex;
      setSelectedIndex(0);
      handleClose();
      console.log('TEST', indexOfFittingSchemaObject[path + `.${data?.length}`]);
    };

    const duplicateContent = (index: number) => {
      data.push(data[index]);
      setRefKey(Math.random());
    };

    const [RefKey, setRefKey] = React.useState<number>(0);
    const callbackFunction = (editorJSON: any) => {
      setRefKey(editorJSON);
    };

    const callbackOpenedIndex = (index: number | undefined) => {
      setOpenedIndex(index);
    };

    const onPressHandler = React.useCallback(() => {
      if (uischema?.options?.picker) {
        window.postMessage({
          type: 'customPicker:open',
          open: true,
          schema,
          current: {
            path,
          },
        });
      } else if (schema?.oneOf?.length === 1) {
        addItem(path, createDefaultValue(schema.oneOf[0]))();
      } else {
        setOpen(true);
      }
    }, [open]);

    const handleCustomPickerMessage = (e: MessageEvent) => {
      if (e?.data?.type === 'customPicker:return' && e?.data?.path === path && e?.data?.data) {
        let newData = data ? [...data] : [];
        if (e?.data?.index && typeof e.data.index === 'number') {
          newData[e.data.index] = e.data.data;
        } else {
          newData.push(e.data.data);
        }
        handleChange(path, newData);
        setRefKey(Math.random());
      }
    };

    React.useEffect(() => {
      if (uischema?.options?.picker) {
        window.addEventListener('message', handleCustomPickerMessage);
      }

      return () => {
        if (uischema?.options?.picker) {
          window.removeEventListener('message', handleCustomPickerMessage);
        }
      };
    }, [data]);

    const sortMode: string | boolean = uischema?.options?.sortMode ?? 'DragAndDrop';
    return (
      <View id='json-form-array-wrapper'>
        <Flex direction='row' justifyContent='space-between'>
          <Heading level={4}>{label}</Heading>
          <AddDialog
            uischema={uischema}
            handleClose={handleClose}
            selectedIndex={selectedIndex}
            schema={schema}
            setSelectedIndex={setSelectedIndex}
            handleOnConfirm={handleOnConfirm}
            open={open}
          />
        </Flex>
        <Flex id={`spectrum-renderer-arrayContentWrapper_${path}`} direction='column'>
          {sortMode === 'DragAndDrop' && data && data?.length ? (
            <div>
              <DragAndDrop
                data={data}
                handleRemoveItem={handleRemoveItem}
                indexOfFittingSchemaArray={indexOfFittingSchemaArray}
                path={path}
                removeItems={removeItems}
                renderers={renderers}
                schema={schema}
                uischema={uischema}
                uischemas={uischemas}
                callbackFunction={callbackFunction}
                handleChange={handleChange}
                openedIndex={openedIndex}
                callbackOpenedIndex={callbackOpenedIndex}
                enabled={enabled}
                indexRefKey={RefKey}
                onPressHandler={onPressHandler}
                moveUpIndex={moveUpIndex}
                setMoveUpIndex={setMoveUpIndex}
              />
            </div>
          ) : data && data?.length ? (
            Array.from(Array(data?.length)).map((_, index) => {
              indexOfFittingSchemaObject[`${path}itemQuantity`] = data?.length;
              return (
                <Flex
                  key={`${index}_${RefKey}`}
                  direction='row'
                  alignItems='stretch'
                  flex='auto inherit'
                >
                  <SpectrumArrayModalItem
                    index={index}
                    indexOfFittingSchema={indexOfFittingSchemaArray[index]}
                    path={path}
                    removeItem={handleRemoveItem}
                    duplicateItem={duplicateContent}
                    renderers={renderers}
                    schema={schema}
                    uischema={uischema}
                    uischemas={uischemas}
                    callbackFunction={callbackFunction}
                    callbackOpenedIndex={callbackOpenedIndex}
                    enabled={enabled}
                  ></SpectrumArrayModalItem>
                  {sortMode === 'arrows' && (
                    <SortButtons
                      data={data}
                      index={index}
                      path={path}
                      removeItems={removeItems}
                      uischema={uischema}
                      callbackFunction={callbackFunction}
                    />
                  )}
                </Flex>
              );
            })
          ) : (
            <Text>No data</Text>
          )}
          <TooltipTrigger delay={settings.toolTipDelay}>
            <ActionButton
              onPress={() => onPressHandler()}
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
  }
);

export default withHandleChange(SpectrumArrayModalControl);
