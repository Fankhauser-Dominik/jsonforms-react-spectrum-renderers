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
import { CellProps } from '@jsonforms/core';
import merge from 'lodash/merge';
import { ToggleButton } from '@adobe/react-spectrum';
import { SpectrumInputProps } from './index';
import { DimensionValue } from '@react-types/shared';
import SpectrumProvider from '../additional/SpectrumProvider';

export const InputBooleanButton = ({
  config,
  data,
  enabled,
  handleChange,
  id,
  label,
  path,
  schema,
  uischema,
}: CellProps & SpectrumInputProps) => {
  const appliedUiSchemaOptions = merge({}, config, uischema.options);
  const autoFocus = !!appliedUiSchemaOptions.focus;
  // !! causes undefined value to be converted to false, otherwise has no effect
  //const isSelected = data ?? schema?.default;
  let [isSelected, setSelected] = React.useState(false);
  const width: DimensionValue = appliedUiSchemaOptions.trim
    ? undefined
    : '100%';

  React.useEffect(() => {
    data ? null : handleSetSelected(schema?.default);
  }, [schema?.default]);

  const handleSetSelected = (isSelected: boolean) => {
    setSelected(isSelected);
    handleChange(path, isSelected);
  };

  return (
    <SpectrumProvider width={width}>
      <ToggleButton
        aria-label={label ? undefined : path}
        autoFocus={autoFocus}
        id={id}
        isDisabled={enabled === undefined ? false : !enabled}
        isEmphasized={appliedUiSchemaOptions.isEmphasized ?? false}
        isSelected={isSelected}
        onChange={handleSetSelected}
        isQuiet={appliedUiSchemaOptions.isQuiet ?? false}
        staticColor={appliedUiSchemaOptions.staticColor ?? null}
        width={width}
      >
        {label}
      </ToggleButton>
    </SpectrumProvider>
  );
};
