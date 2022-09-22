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
import { RendererProps } from '@jsonforms/core';
import { Flex, Heading, Text, View } from '@adobe/react-spectrum';
import CFRWithDetailLayoutItem from './ContentFragmentReferenceWithDetailLayoutItem';
export interface extendedLayoutRendererProps extends RendererProps {
  data: any;
  label: string;
  elements: JSX.Element[];
  layout: any;
}

export const SpectrumContentFragmentReference = React.memo(
  ({
    data,
    path,
    renderers,
    elements,
    layout,
    schema,
    uischema,
    label,
  }: extendedLayoutRendererProps) => {
    return (
      <View>
        <Flex direction='row' justifyContent='space-between'>
          <Heading level={4}>{label}</Heading>
        </Flex>
        <Flex direction='column' gap='size-100'>
          {elements?.length ? (
            Array.from(Array(elements?.length)).map((_, index) => {
              return (
                <Flex key={index} direction='row' alignItems='stretch' flex='auto inherit'>
                  <CFRWithDetailLayoutItem
                    data={data}
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
