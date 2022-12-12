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
import { Item, ComboBox, ContextualHelp, Heading, Content, Text } from '@adobe/react-spectrum';
import { TagGroup } from '@react-spectrum/tag';
import SpectrumProvider from '../additional/SpectrumProvider';

export const InputEnumAutocompleteWithTagGroup = React.memo(
  ({
    config,
    data,
    enabled,
    handleChange,
    id,
    label,
    options,
    path,
    required,
    schema,
    uischema,
  }: EnumCellProps & SpectrumInputProps) => {
    const appliedUiSchemaOptions = merge({}, config, uischema.options);

    const width: DimensionValue | undefined = appliedUiSchemaOptions.trim ? undefined : '100%';

    let [value, setValue] = React.useState(data ?? '');
    const handleOnChange = (value: any) => {
      setValue(value);
      if (data?.indexOf(value) === undefined || data?.indexOf(value) === -1) {
        if (data) {
          handleChange(path, [...data, value]);
        } else {
          handleChange(path, [value]);
        }
      }
      setTimeout(() => {
        setValue(null);
      }, 100);
    };

    React.useEffect(() => {
      if (!data && schema?.default) {
        handleOnChange(schema.default);
      }
    }, [schema?.default]);

    label = label === '' || !label ? 'Enum' : label;

    const contextualHelp = appliedUiSchemaOptions?.contextualHelp ?? schema?.fieldDescription;

    const [RefKey, setRefKey] = React.useState(0);

    const deleteTag = (value: any[]) => {
      const tags = data;
      tags.splice(tags?.indexOf(value), 1);
      handleChange(path, tags);
      setRefKey(RefKey + 1);
    };

    return (
      <SpectrumProvider width={width}>
        {options && (
          <ComboBox
            allowsCustomValue={appliedUiSchemaOptions.allowsCustomValue ?? false}
            aria-label={label ?? 'combobox'}
            autoFocus={appliedUiSchemaOptions.focus}
            description={appliedUiSchemaOptions.description ?? false}
            direction={appliedUiSchemaOptions.direction ?? 'bottom'}
            errorMessage={appliedUiSchemaOptions.errorMessage ?? false}
            id={id}
            isDisabled={enabled === undefined ? false : !enabled}
            isQuiet={appliedUiSchemaOptions.isQuiet ?? false}
            isReadOnly={appliedUiSchemaOptions.readonly ?? schema.readOnly ?? false}
            isRequired={required}
            key={id}
            label={label}
            labelAlign={appliedUiSchemaOptions.labelAlign ?? 'start'}
            labelPosition={appliedUiSchemaOptions.labelPosition ?? 'top'}
            menuTrigger={appliedUiSchemaOptions.menuTrigger ?? 'input'}
            minWidth={appliedUiSchemaOptions.minWidth ?? 'size-2000'}
            necessityIndicator={appliedUiSchemaOptions.necessityIndicator ?? false}
            onSelectionChange={handleOnChange}
            selectedKey={value}
            shouldFlip={appliedUiSchemaOptions.shouldFlip ?? true}
            shouldFocusWrap={appliedUiSchemaOptions.shouldFocusWrap ?? false}
            width={width}
          >
            {options.map((item) => (
              <Item key={item.value}>{item.label}</Item>
            ))}
          </ComboBox>
        )}
        {contextualHelp ? (
          <ContextualHelp variant={contextualHelp?.variant === 'help' ? 'help' : 'info'}>
            {contextualHelp?.title && <Heading>{contextualHelp?.title}</Heading>}
            <Content>
              <Text>{schema?.fieldDescription ?? contextualHelp?.content}</Text>
            </Content>
          </ContextualHelp>
        ) : null}
        <TagGroup
          items={data}
          allowsRemoving
          onRemove={(key: React.Key) => deleteTag([key])}
          aria-label='TagGroup'
        >
          {data?.map((item: string) => (
            <Item key={`${item}`}>{item}</Item>
          ))}
        </TagGroup>
      </SpectrumProvider>
    );
  }
);
