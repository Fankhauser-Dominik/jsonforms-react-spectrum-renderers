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
import { RendererProps, Layout } from '@jsonforms/core';
import { Flex, Heading, Text, View } from '@adobe/react-spectrum';
import CFRWithDetailLayoutItem from './ContentFragmentReferenceWithDetailLayoutItem';
import { renderChildren } from '../util';

export interface extendedLayoutRendererProps extends RendererProps {
  label: string;
}

export const SpectrumContentFragmentReference = React.memo(
  ({ path, renderers, schema, uischema, enabled, label }: extendedLayoutRendererProps) => {
    const layout = uischema as Layout;

    /* const handleCustomPickerMessage = (e: MessageEvent) => {
      console.log('handleCustomPickerMessage', e?.data);
      if (e?.data?.type === 'customPicker:return' && e?.data?.data) {
        console.log('handleCustomPickerMessage', e?.data?.data);
        let newData = [...data];
        if (e?.data?.index && typeof e.data.index === 'number') {
          console.log('replace existing data');
          newData[e.data.index] = e.data.data;
          console.log('newData', newData);
          console.log('data', data);
        } else {
          console.log('handleCustomPickerMessage addItem', e?.data?.data, data);
          newData.push(e.data.data);
        }
        data.splice(0, data.length);
        data.push(...newData);
        setRefKey(Math.random());
      }
    };

    useEffect(() => {
      if (uischema?.options?.picker) {
        window.addEventListener('message', handleCustomPickerMessage);
      }

      return () => {
        if (uischema?.options?.picker) {
          window.removeEventListener('message', handleCustomPickerMessage);
        }
      };
    }, [data]); */

    const elements = renderChildren(layout, schema, {}, path, enabled);

    return (
      <View id='json-form-array-wrapper'>
        <Flex direction='row' justifyContent='space-between'>
          <Heading level={4}>{label}</Heading>
        </Flex>
        <Flex
          id={`spectrum-renderer-arrayContentWrapper_${path}`}
          direction='column'
          gap='size-100'
        >
          {elements?.length ? (
            Array.from(Array(elements?.length)).map((_, index) => {
              return (
                <Flex key={index} direction='row' alignItems='stretch' flex='auto inherit'>
                  <CFRWithDetailLayoutItem
                    index={index}
                    path={path}
                    renderers={renderers}
                    schema={schema}
                    uischema={uischema}
                    elements={elements}
                    layout={layout?.elements[index]}
                  ></CFRWithDetailLayoutItem>
                </Flex>
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
