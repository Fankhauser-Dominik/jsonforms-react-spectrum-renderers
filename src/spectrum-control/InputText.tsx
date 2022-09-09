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
import { TextField, ActionButton, Flex } from '@adobe/react-spectrum';
import { DimensionValue } from '@react-types/shared';
import { SpectrumInputProps } from './index';
import SpectrumProvider from '../additional/SpectrumProvider';
import { useDebouncedChange } from '../util/debounce';
import FolderOpen from '@spectrum-icons/workflow/FolderOpen';
import Link from '@spectrum-icons/workflow/Link';
import Asset from '@spectrum-icons/workflow/Asset';

import './InputText.css';

export const InputText = React.memo(
  ({
    config,
    data,
    enabled,
    handleChange,
    id,
    isValid,
    label,
    path,
    required,
    schema,
    uischema,
  }: CellProps & SpectrumInputProps) => {
    const appliedUiSchemaOptions = merge({}, config, uischema.options);
    //const uuid = (prefix: string) => `${prefix}-${uuidv4()}`;
    console.log('SCHEMA', schema);

    const width: DimensionValue | undefined = appliedUiSchemaOptions.trim ? undefined : '100%';

    const [inputText, onChange] = useDebouncedChange(
      handleChange,
      schema?.default ?? '',
      data,
      path
    );

    const isValidCheck = React.useMemo(() => {
      let minLength = appliedUiSchemaOptions.minLength ?? (required ? 1 : 0);
      let maxLength = appliedUiSchemaOptions.maxLength ?? Infinity;
      if (isValid && !inputText && minLength === 0) {
        return true;
      } else if (!inputText) {
        return false;
      } else if (isValid && inputText.length >= minLength && inputText.length <= maxLength) {
        return true;
      } else {
        return false;
      }
    }, [inputText, appliedUiSchemaOptions, isValid, required]);

    const errorMessage = () => {
      let minLength = appliedUiSchemaOptions.minLength ?? (required ? 1 : null);
      let maxLength = appliedUiSchemaOptions.maxLength;
      if (minLength && maxLength) {
        return `Must be between ${minLength} and ${maxLength} characters`;
      } else if (minLength) {
        return `Must be at least ${minLength} characters`;
      } else if (maxLength) {
        return `Must be at most ${maxLength} characters`;
      }
    };

    /* useEffect(() => {
      if (!data && schema?.default) {
        handleChange(path, schema.default);
      }
      if (!data && !schema.default && appliedUiSchemaOptions.defaultUUID) {
        handleChange(path, uuid(appliedUiSchemaOptions.defaultUUID));
      }
    }, [!data, schema?.default]); */

    /* useEffect(() => {
      if (
        !data &&
        !schema?.default &&
        appliedUiSchemaOptions.NonFocusPlaceholder
      ) {
        handleChange(path, appliedUiSchemaOptions.NonFocusPlaceholder);
      }
    }, [appliedUiSchemaOptions.NonFocusPlaceholder]); */

    /* const clearNonFocusPlaceholder = () => {
      if (data === appliedUiSchemaOptions.NonFocusPlaceholder) {
        handleChange(path, '');
      } else if (!data && !schema?.default) {
        handleChange(path, appliedUiSchemaOptions.NonFocusPlaceholder);
      }
    }; */

    const fileBrowser = uischema.options?.fileBrowser;
    const idlePostMessage = uischema.options?.idlePostMessage;
    const fileBrowserOptions =
      fileBrowser?.send?.message && fileBrowser?.receive?.message && fileBrowser?.receive?.type;

    const sendMessage = (message: any, targetOrigin: string = '*', transfer?: any) => {
      //var popUp = window.open(targetOrigin);
      window.postMessage(message, targetOrigin, transfer);
    };

    window.addEventListener('message', (e) => {
      if (e?.data?.type && e?.data?.type === fileBrowser?.receive?.type) {
        //handleChange(path, e.data.message);
        onChange(e.data.data);
      }
    });

    const firstRender = React.useRef(true);
    if (idlePostMessage) {
      React.useEffect(() => {
        if (firstRender.current) {
          firstRender.current = false;
          return;
        }
        const delayDebounceFn = setTimeout(() => {
          sendMessage(
            idlePostMessage?.info
              ? { key: uischema?.scope, value: inputText, path: path }
              : idlePostMessage?.message,
            idlePostMessage?.targetOrigin,
            idlePostMessage?.transfer
          );
        }, 3000);

        return () => clearTimeout(delayDebounceFn);
      }, [inputText]);
    }

    return (
      <SpectrumProvider width={width}>
        <Flex direction='row' alignItems='stretch' flex='auto inherit'>
          <TextField
            aria-label={label ? label : 'textfield'}
            autoFocus={appliedUiSchemaOptions.focus}
            description={appliedUiSchemaOptions.description ?? null}
            errorMessage={appliedUiSchemaOptions.errorMessage ?? errorMessage()}
            id={id && `${id}-input`}
            inputMode={appliedUiSchemaOptions.inputMode ?? 'none'}
            isDisabled={enabled === undefined ? false : !enabled}
            isQuiet={appliedUiSchemaOptions.isQuiet ?? false}
            isReadOnly={appliedUiSchemaOptions.readonly ?? schema.readOnly ?? false}
            isRequired={required}
            label={label}
            labelAlign={appliedUiSchemaOptions.labelAlign ?? null}
            labelPosition={appliedUiSchemaOptions.labelPosition ?? null}
            maxLength={appliedUiSchemaOptions.maxLength ?? null}
            width={width}
            minLength={appliedUiSchemaOptions.minLength ?? null}
            necessityIndicator={appliedUiSchemaOptions.necessityIndicator ?? null}
            /* onBlur={() =>
              sendMessage(
                idlePostMessage?.info
                  ? { key: uischema?.scope, value: inputText, path: path }
                  : idlePostMessage?.message,
                idlePostMessage?.targetOrigin,
                idlePostMessage?.transfer
              )
            } */
            onChange={onChange}
            //onFocusChange={clearNonFocusPlaceholder}
            type={appliedUiSchemaOptions.format ?? 'text'}
            validationState={isValidCheck ? 'valid' : 'invalid'}
            value={inputText}
          />
          {fileBrowserOptions && (
            <ActionButton
              onPress={() =>
                sendMessage(
                  fileBrowser?.send?.message,
                  fileBrowser?.send?.targetOrigin,
                  fileBrowser?.send?.transfer
                )
              }
              aria-label={fileBrowser?.buttonText ?? `Filebrowser`}
              UNSAFE_className='fileBrowserButton'
              UNSAFE_style={fileBrowser?.icon === false ? undefined : { paddingRight: 8 }}
            >
              {fileBrowser?.icon === false ? undefined : uischema.options?.fileBrowser?.icon ===
                'url' ? (
                <Link size='S' />
              ) : fileBrowser?.icon === 'asset' ? (
                <Asset size='S' />
              ) : (
                <FolderOpen size='S' />
              )}
              {fileBrowser?.buttonText ?? null}
            </ActionButton>
          )}
        </Flex>
      </SpectrumProvider>
    );
  }
);
