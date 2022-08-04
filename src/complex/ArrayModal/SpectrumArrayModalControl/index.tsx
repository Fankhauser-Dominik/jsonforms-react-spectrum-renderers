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
import React, { useCallback, useState } from 'react';
import {
  ArrayControlProps,
  OwnPropsOfControl,
  createDefaultValue,
} from '@jsonforms/core';
import { Button, Flex, Heading, Text, View } from '@adobe/react-spectrum';
import SpectrumArrayModalItem from '../SpectrumArrayModalItem';
import Add from '@spectrum-icons/workflow/Add';
import { indexOfFittingSchemaObject } from '../utils';
import DragAndDrop from './DragAndDrop';
import AddDialog from './AddDialog';
import SortButtons from './SortButtons';

export interface OverrideProps extends OwnPropsOfControl {
  indexOfFittingSchema?: number;
}

export const SpectrumArrayModalControl = React.memo(
  ({
    addItem,
    data,
    label,
    path,
    removeItems,
    renderers,
    schema,
    uischema,
    uischemas,
  }: ArrayControlProps & OverrideProps) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    const [indexOfFittingSchemaArray, setIndexOfFittingSchemaArray] = useState(
      data?.map((boundData: any) => (boundData ? undefined : 999)) ?? []
    );

    React.useEffect(() => {
      setIndexOfFittingSchemaArray(
        data?.map((boundData: any) => (boundData ? undefined : 999)) ?? []
      );
    }, []);

    const handleRemoveItem = useCallback(
      (path: string, value: any) => () => {
        if (removeItems) {
          removeItems(path, [value])();
        }
        indexOfFittingSchemaArray.splice(value, 1);
      },
      [removeItems]
    );

    const handleOnConfirm = (handleClose: any, index: number) => {
      setIndexOfFittingSchemaArray([
        ...indexOfFittingSchemaArray,
        Math.floor(index),
      ]);
      if (schema.oneOf) {
        addItem(path, createDefaultValue(schema.oneOf[index]))();
      }
      setSelectedIndex(0);
      handleClose();
    };

    const duplicateContent = (index: number) => {
      data.push(data[index]);
      if (removeItems) {
        removeItems(path, [999999999])();
      }
    };

    return (
      <View>
        <Flex direction='row' justifyContent='space-between'>
          <Heading level={4}>{label}</Heading>
          <Button
            alignSelf='center'
            onPress={useCallback(() => {
              setOpen(true);
            }, [open])}
            variant='primary'
          >
            <Add aria-label='Add' size='S' />
          </Button>
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
        <Flex
          id={`spectrum-renderer-arrayContentWrapper_${path}`}
          direction='column'
          gap='size-100'
        >
          {uischema?.options?.DND ? (
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
            />
          ) : data && data?.length ? (
            Array.from(Array(data?.length)).map((_, index) => {
              indexOfFittingSchemaObject[`${path}itemQuantity`] = data?.length;
              return (
                <div key={index}>
                  <Flex
                    key={index}
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
                    ></SpectrumArrayModalItem>
                    {uischema.options?.showSortButtons && (
                      <SortButtons
                        data={data}
                        index={index}
                        path={path}
                        removeItems={removeItems}
                        uischema={uischema}
                      />
                    )}
                  </Flex>
                </div>
              );
            })
          ) : (
            <Text>No data</Text>
          )}
        </Flex>
      </View>
    );
  }
);
