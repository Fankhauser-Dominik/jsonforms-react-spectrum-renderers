/*
  The MIT License

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
import { CellProps } from '@jsonforms/core';
import merge from 'lodash/merge';
import { TextField } from '@adobe/react-spectrum';
import { DimensionValue } from '@react-types/shared';
import { SpectrumInputProps } from './index';

export class InputText extends React.PureComponent<
  CellProps & SpectrumInputProps
> {
  render() {
    const {
      data,
      config,
      id,
      enabled,
      uischema,
      required,
      isValid,
      path,
      handleChange,
      schema,
      label,
    } = this.props;

    const maxLength = schema.maxLength;
    const minLength = schema.minLength;

    const appliedUiSchemaOptions = merge({}, config, uischema.options);

    const onChange = (value: string) => handleChange(path, value);

    // TODO: react-spectrum has no concept of "hide the asterisk" - the value is either required or not
    // check if setting required to false has some unwanted consequences
    const isRequired = required && !appliedUiSchemaOptions.hideRequiredAsterisk;

    const width: DimensionValue = appliedUiSchemaOptions.trim
      ? undefined
      : '100%';

    return (
      <TextField
        type={
          appliedUiSchemaOptions.format === 'password' ? 'password' : 'text'
        }
        isRequired={isRequired}
        value={data ?? ''}
        label={label}
        onChange={onChange}
        id={id && `${id}-input`}
        isDisabled={!enabled}
        autoFocus={appliedUiSchemaOptions.focus}
        maxLength={maxLength}
        minLength={minLength}
        validationState={isValid ? 'valid' : 'invalid'}
        width={width}
      />
    );
  }
}
