/*
  The MIT License

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
import { EnumCellProps } from '@jsonforms/core';
import merge from 'lodash/merge';
import { SpectrumInputProps } from './index';
import { DimensionValue } from '@react-types/shared';
import { Item, ComboBox } from '@adobe/react-spectrum';
import SpectrumProvider from '../additional/SpectrumProvider';

export const InputEnumAutocomplete = ({
  config,
  data,
  enabled,
  handleChange,
  id,
  label,
  options,
  path,
  required,
  uischema,
}: EnumCellProps & SpectrumInputProps) => {
  const appliedUiSchemaOptions = merge({}, config, uischema.options);

  const width: DimensionValue = appliedUiSchemaOptions.trim
    ? undefined
    : '100%';

  return (
    <SpectrumProvider width={width}>
      <ComboBox
        key={id}
        id={id}
        label={label}
        isRequired={required}
        isDisabled={enabled === undefined ? false : !enabled}
        necessityIndicator={appliedUiSchemaOptions.necessityIndicator ?? null}
        width={width}
        selectedKey={data}
        onSelectionChange={(value) => handleChange(path, value)}
      >
        {options.map((item) => (
          <Item key={item.value}>{item.label}</Item>
        ))}
      </ComboBox>
    </SpectrumProvider>
  );
};
