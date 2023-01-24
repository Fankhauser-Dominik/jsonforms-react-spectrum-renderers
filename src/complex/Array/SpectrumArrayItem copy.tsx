/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

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
import { View } from '@adobe/react-spectrum';
import {
  ControlElement,
  JsonFormsRendererRegistryEntry,
  JsonFormsState,
  JsonSchema,
  Resolve,
  UISchemaElement,
  UISchemaTester,
  composePaths,
  findUISchema,
  getData,
} from '@jsonforms/core';
import { JsonFormsStateContext, JsonFormsDispatch, withJsonFormsContext } from '@jsonforms/react';
import SpectrumProvider from '../../additional/SpectrumProvider';
import { ModalItemAnimationWrapper } from '../../util/animatedModalWrapper';
import ModalItemHeader from '../ArrayModal/SpectrumArrayModalItem/ModalItemHeader';

export interface OwnPropsOfSpectrumArrayItem {
  data: any;
  childLabel?: string;
  duplicateItem: any;
  enabled?: boolean;
  expanded: number | undefined;
  handleExpand(index: number): () => void;
  index: number;
  path: string;
  removeItem: (path: string, value: number) => () => void;
  renderers?: JsonFormsRendererRegistryEntry[];
  schema: JsonSchema;
  uischema: ControlElement;
  uischemas?: {
    tester: UISchemaTester;
    uischema: UISchemaElement;
  }[];
}

const SpectrumArrayItem = ({
  data,
  childLabel,
  duplicateItem,
  enabled,
  expanded,
  handleExpand,
  index,
  path,
  removeItem,
  renderers,
  schema,
  uischema,
  uischemas = [],
}: OwnPropsOfSpectrumArrayItem) => {
  const foundUISchema = findUISchema(uischemas, schema, uischema.scope, path);
  const childPath = composePaths(path, `${index}`);
  const [open, setOpen] = React.useState(false);
  const handleClose = React.useCallback(() => setOpen(false), [setOpen]);
  const newExpanded = expanded;
  const isExpanded = newExpanded === index;

  childLabel = childLabel ?? `Item ${index + 1}`;

  const enableDetailedView = uischema?.options?.enableDetailedView ?? false;
  const showItemNumber = uischema?.options?.showItemNumber ?? false;

  const pathFilter = uischema?.options?.pathFilter;

  let displayPath = '';
  if (typeof pathFilter === 'string') {
    displayPath = data?._path?.replace(pathFilter, '') || '';
    if (displayPath.startsWith('/')) {
      displayPath = displayPath.substring(1);
    }
  } else {
    displayPath = data?._path?.split('/').slice(3).join('/') || '';
    if (displayPath) {
      displayPath = `/${displayPath}/`;
    }
  }

  const JsonFormsDispatchComponent = (
    <JsonFormsDispatch
      enabled={enabled}
      key={childPath}
      path={childPath}
      renderers={renderers}
      schema={schema}
      uischema={foundUISchema || uischema}
    />
  );

  /* const header = (
    <SpectrumArrayHeader
      childLabel={childLabel}
      data={data}
      displayPath={displayPath}
      expanded={expanded}
      handleClose={handleClose}
      handleExpand={handleExpand}
      index={index}
      isExpanded={isExpanded}
      open={open}
      path={path}
      removeItem={removeItem}
      setOpen={setOpen}
      showItemNumber={showItemNumber}
    />
  ); */

  const header = (
    <ModalItemHeader
      // DNDHandle={DNDHandle}
      JsonFormsDispatch={JsonFormsDispatchComponent}
      // childData={childData}
      childData={data}
      childLabel={childLabel}
      // customPicker={{ enabled: uischema?.options?.picker, handler: customPickerHandler }}
      customPicker={{ enabled: uischema?.options?.picker, handler: () => {} }}
      // duplicateItem={duplicateItem}
      duplicateItem={duplicateItem}
      enableDetailedView={enableDetailedView}
      expanded={isExpanded}
      // handleExpand={toggleExpanded}
      handleExpand={() => !isExpanded}
      index={index}
      path={path}
      removeItem={removeItem}
      uischema={uischema}
    />
  );

  return (
    <SpectrumProvider
      flex='auto'
      width={uischema.options?.sortMode === 'arrows' ? 'calc(100% - 66px)' : '100%'}
    >
      <View
        UNSAFE_className={`list-array-item ${
          enableDetailedView ? 'enableDetailedView' : 'accordionView'
        } ${expanded ? 'expanded' : 'collapsed'} ${
          uischema?.options?.noAccordion ? 'noAccordion' : null
        }`}
        borderWidth='thin'
        borderColor='dark'
        borderRadius='medium'
        padding='size-150'
      >
        {header}
        {expanded && !enableDetailedView && (
          <View UNSAFE_className='json-form-dispatch-wrapper'>
            {enableDetailedView && header}
            {JsonFormsDispatchComponent}
          </View>
        )}
        {enableDetailedView && (
          <ModalItemAnimationWrapper
            enableDetailedView={enableDetailedView}
            expanded={!!isExpanded}
            handleExpand={() => handleExpand(index)}
            isAnimating={false}
            path={path}
            setIsAnimating={() => false}
          >
            {expanded ? (
              <View UNSAFE_className='json-form-dispatch-wrapper'>
                {enableDetailedView && header}
                {JsonFormsDispatchComponent}
              </View>
            ) : null}
          </ModalItemAnimationWrapper>
        )}
      </View>
    </SpectrumProvider>
  );
};

/**
 * Map state to control props.
 * @param state the store's state
 * @param ownProps any own props
 * @returns {StatePropsOfControl} state props for a control
 */
export const mapStateToSpectrumArrayItemProps = (
  state: JsonFormsState,
  ownProps: OwnPropsOfSpectrumArrayItem
): OwnPropsOfSpectrumArrayItem => {
  const { schema, path, index, uischema } = ownProps;
  const firstPrimitiveProp = schema?.properties
    ? Object.keys(schema?.properties).find((propName) => {
        const prop = schema?.properties ? schema?.properties[propName] : { type: 'string' };
        return prop.type === 'string' || prop.type === 'number' || prop.type === 'integer';
      })
    : undefined;
  const childPath = composePaths(path, `${index}`);
  const childData = Resolve.data(getData(state), childPath);
  const childLabel = uischema.options?.elementLabelProp
    ? childData[uischema.options.elementLabelProp]
    : firstPrimitiveProp
    ? childData[firstPrimitiveProp]
    : `Item ${index + 1}`;

  return {
    ...ownProps,
    childLabel,
  };
};

export const ctxToSpectrumArrayItemProps = (
  ctx: JsonFormsStateContext,
  ownProps: OwnPropsOfSpectrumArrayItem
) => mapStateToSpectrumArrayItemProps({ jsonforms: { ...ctx } }, ownProps);

const withContextToSpectrumArrayItemProps =
  (
    Component: React.ComponentType<OwnPropsOfSpectrumArrayItem>
  ): React.ComponentType<OwnPropsOfSpectrumArrayItem> =>
  ({ ctx, props }: JsonFormsStateContext & OwnPropsOfSpectrumArrayItem) => {
    const stateProps = ctxToSpectrumArrayItemProps(ctx, props);
    return <Component {...stateProps} />;
  };

export const withJsonFormsSpectrumArrayItemProps = (
  Component: React.ComponentType<OwnPropsOfSpectrumArrayItem>
): React.ComponentType<any> =>
  withJsonFormsContext(withContextToSpectrumArrayItemProps(React.memo(Component)));

//export default withJsonFormsSpectrumArrayItemProps(SpectrumArrayItem);
