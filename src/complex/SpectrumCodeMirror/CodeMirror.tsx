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
import { DimensionValue } from '@react-types/shared';
import { SpectrumInputProps } from '../../spectrum-control/index';
import SpectrumProvider from '../../additional/SpectrumProvider';
import { Button, View } from '@adobe/react-spectrum';

import CodeMirror from '@uiw/react-codemirror';
import { json, jsonParseLinter } from '@codemirror/lang-json';
import { linter, lintGutter } from '@codemirror/lint';

import './index.css';

const circularReferenceReplacer = () => {
  const paths = new Map();
  const finalPaths = new Map();
  let root: any = null;

  return function (this: Object, field: string, value: any) {
    const p = paths.get(this) + '/' + field;
    const isComplex = value === Object(value);

    if (isComplex) paths.set(value, p);

    const existingPath = finalPaths.get(value) || '';
    const path = p.replace(/undefined\/\/?/, '');
    let val = existingPath ? { $ref: `#/${existingPath}` } : value;

    if (!root) {
      root = value;
    } else if (val === root) {
      val = { $ref: '#/' };
    }

    if (!existingPath && isComplex) finalPaths.set(value, path);

    return val;
  };
};

export const InputCodeMirror = React.memo(
  ({
    config,
    data,
    uischema,
    visible,
    handleChange,
    path,
    label,
  }: CellProps & SpectrumInputProps) => {
    const appliedUiSchemaOptions = merge({}, config, uischema.options);
    const width: DimensionValue | undefined = appliedUiSchemaOptions.trim ? undefined : '100%';
    const showSaveButton: boolean = appliedUiSchemaOptions.showSaveButton ?? false;
    const [value, setValue] = React.useState(data);
    const [initialValue, setInitialValue] = React.useState(data);
    const [cachedValue, setCachedValue] = React.useState(data);
    const err = getErr(value);
    const cachedErr = getErr(cachedValue);
    const [key, setKey] = React.useState(Math.random()); // used to force-rerender CodeMirror when Reset button is clicked
    const save = React.useCallback(() => {
      if (typeof cachedValue === 'string') {
        handleChange(path, JSON.parse(cachedValue));
        setValue(JSON.parse(cachedValue));
      } else {
        handleChange(path, JSON.parse(JSON.stringify(cachedValue, circularReferenceReplacer())));
        setValue(JSON.parse(JSON.stringify(cachedValue, circularReferenceReplacer())));
      }
    }, [cachedValue]);
    const saveAndFormat = () => {
      save();
      setInitialValue(JSON.parse(JSON.stringify(value, circularReferenceReplacer())));
      setKey(Math.random());
    };

    const onChangeHandler = React.useCallback((newValue: any, _viewUpdate: any) => {
      setCachedValue(newValue);
      if (!getErr(newValue) && !cachedErr && !showSaveButton) {
        setValue(JSON.parse(newValue));
        handleChange(path, JSON.parse(newValue));
      }
    }, []);

    function getErr(value: string) {
      if (!value) {
        return null;
      }

      try {
        if (typeof value === 'string') {
          JSON.parse(value);
        } else {
          JSON.parse(JSON.stringify(value, circularReferenceReplacer()));
        }
        return null;
      } catch (err) {
        return String(err);
      }
    }

    const theme = document.cookie.includes('preferTheme=dark')
      ? 'dark'
      : document.cookie.includes('preferTheme=light')
      ? 'light'
      : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

    return (
      <SpectrumProvider width={width} isHidden={!visible}>
        {label && <label className='SpectrumLabel'>{label}</label>}
        <CodeMirror
          key={key}
          value={JSON.stringify(initialValue, circularReferenceReplacer(), 2) || ''}
          onChange={onChangeHandler}
          extensions={
            err || cachedErr ? [json(), linter(jsonParseLinter()), lintGutter()] : [json()]
          }
          className='SpectrumCodeMirror'
          theme={theme}
        />
        <View paddingTop='size-50'>
          {cachedValue !== data && showSaveButton ? (
            <Button variant='cta' onPress={save} isDisabled={!!err || !!cachedErr}>
              Save
            </Button>
          ) : (
            <Button
              variant='cta'
              onPress={saveAndFormat}
              isDisabled={!!err || !!cachedErr || cachedValue === initialValue}
            >
              Format
            </Button>
          )}
        </View>
      </SpectrumProvider>
    );
  }
);
