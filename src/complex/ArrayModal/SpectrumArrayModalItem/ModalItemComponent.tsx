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
import { View } from '@adobe/react-spectrum';
import { JsonFormsDispatch, JsonFormsStateContext, withJsonFormsContext } from '@jsonforms/react';
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
import SpectrumProvider from '../../../additional/SpectrumProvider';
import { indexOfFittingSchemaObject } from '../utils';
import ModalItemHeader from './ModalItemHeader';
import { findValue } from './ModalItemUtils';
import { checkIfUserIsOnMobileDevice, ModalItemAnimationWrapper } from '../../../util';
import { Breadcrumbs, useBreadcrumbs } from '../../../context';

interface NonEmptyRowProps {
  rowIndex?: number | undefined;
  moveUpCreator?: (path: string, position: number) => () => void;
  moveDownCreator?: (path: string, position: number) => () => void;
  DNDHandle?: any;
}

const SpectrumArrayModalItem = React.memo(
  ({
    DNDHandle = false,
    callbackOpenedIndex,
    childData,
    childLabel,
    duplicateItem,
    enabled,
    index,
    openIndex,
    path,
    removeItem,
    renderers,
    schema,
    uischema,
    uischemas = [],
  }: OwnPropsOfSpectrumArrayModalItem & NonEmptyRowProps) => {
    let foundUISchema = findUISchema(uischemas, schema, uischema.scope, path);

    // ContentFragmentReferenceWithDetail needs to be stripped
    // or we open a double panel (picker already provided by array).
    if (foundUISchema.type === 'ContentFragmentReferenceWithDetail') {
      foundUISchema = (foundUISchema as any).elements[0];
    }

    const childPath = composePaths(path, `${index}`);
    /* If The Component has an empty Object, open it (true for a newly added Component) */
    const [expanded, setExpanded] = React.useState(
      JSON.stringify(childData) === '{}' ? true : openIndex === index ? true : false
    );
    const [isAnimating, setIsAnimating] = React.useState(false);
    const enableDetailedView = uischema?.options?.enableDetailedView ?? true;

    const userIsOnMobileDevice: boolean = checkIfUserIsOnMobileDevice(
      navigator.userAgent.toLowerCase()
    );

    const { breadcrumbs, addBreadcrumb, deleteBreadcrumb } = useBreadcrumbs();

    const toggleExpanded = React.useCallback(
      (desiredState?: boolean) => {
        console.log('toggleExpanded', desiredState, expanded);
        if (desiredState === undefined) {
          desiredState = !expanded;
        }
        if (desiredState) {
          addBreadcrumb({
            path: childPath,
            name: childLabel,
          });
        } else {
          deleteBreadcrumb(childPath);
        }
        if (desiredState === expanded) {
          return;
        }
        if (!userIsOnMobileDevice) {
          setIsAnimating(true);
        }
        setExpanded(desiredState);
        if (desiredState) {
          if (enableDetailedView === true) {
            window.postMessage(
              {
                type: 'expanded-item',
                index,
                path,
                crxPath: childData?._path,
                breadCrumbLabel: childLabel,
                addToQuery: true,
              },
              '*'
            );
          }
          callbackOpenedIndex(index);
        } else {
          if (enableDetailedView === true) {
            window.postMessage(
              {
                type: 'expanded-item',
                index,
                path,
                breadCrumbLabel: childLabel,
                addToQuery: false,
              },
              '*'
            );
          }
          callbackOpenedIndex(undefined);
        }
      },
      [
        expanded,
        setExpanded,
        childLabel,
        enableDetailedView,
        breadcrumbs,
        deleteBreadcrumb,
        addBreadcrumb,
      ]
    );

    const breadcrumbsRef = React.useRef<Breadcrumbs | null>(null);

    React.useEffect(() => {
      if (breadcrumbs.hasPrefix(childPath)) {
        toggleExpanded(true);
      } else if (
        breadcrumbsRef.current &&
        breadcrumbsRef.current.hasPrefix(childPath) &&
        !breadcrumbs.hasPrefix(childPath)
      ) {
        toggleExpanded(false);
      }
      breadcrumbsRef.current = breadcrumbs;
    }, [breadcrumbs]);

    if (uischema.options?.oneOfModal) {
      indexOfFittingSchemaObject['oneOfModal'] = true;
    }
    if (uischema.options?.OneOfPicker) {
      indexOfFittingSchemaObject['OneOfPicker'] = true;
    }

    const customPickerHandler = () => {
      window.postMessage({
        type: 'customPicker:open',
        open: true,
        schema,
        current: {
          path,
          index,
          data: childData,
        },
      });
    };

    const JsonFormsDispatchComponent = (
      <JsonFormsDispatch
        enabled={enabled}
        visible={false}
        key={childPath}
        path={childPath}
        renderers={renderers}
        schema={schema}
        uischema={foundUISchema || uischema}
      />
    );

    const header = (
      <ModalItemHeader
        DNDHandle={DNDHandle}
        JsonFormsDispatch={JsonFormsDispatchComponent}
        childData={childData}
        childLabel={childLabel}
        customPicker={{ enabled: uischema?.options?.picker, handler: customPickerHandler }}
        duplicateItem={duplicateItem}
        enableDetailedView={enableDetailedView}
        expanded={expanded}
        handleExpand={toggleExpanded}
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
              expanded={expanded}
              handleExpand={toggleExpanded}
              isAnimating={isAnimating}
              path={path}
              setIsAnimating={setIsAnimating}
            >
              {expanded || isAnimating ? (
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
  }
);

export interface OwnPropsOfSpectrumArrayModalItem {
  index: number;
  openIndex: number;
  DNDHandle: any;
  enabled: boolean;
  path: string;
  schema: JsonSchema;
  removeItem(path: string, value: number): () => void;
  duplicateItem(index: number): () => void;
  uischema: ControlElement;
  renderers?: JsonFormsRendererRegistryEntry[];
  uischemas?: {
    tester: UISchemaTester;
    uischema: UISchemaElement;
  }[];
  childLabel: string;
  childData?: any;
  rowIndex?: number;
  moveUpCreator?: ((path: string, position: number) => () => void) | undefined;
  moveDownCreator?: ((path: string, position: number) => () => void) | undefined;
  callbackOpenedIndex: any;
}

/**
 * Map state to control props.No indexOfFittingSchema found
 * @param state the store's state
 * @param ownProps any own props
 * @returns {StatePropsOfControl} state props for a control
 */
export const mapStateToSpectrumArrayModalItemProps = (
  state: JsonFormsState,
  ownProps: OwnPropsOfSpectrumArrayModalItem
): OwnPropsOfSpectrumArrayModalItem => {
  const { schema, path, index, uischema } = ownProps;
  const childPath = composePaths(path, `${index}`);
  const childData = Resolve.data(getData(state), childPath);

  // If not given explicitly in the UISchema,
  // we try find the first property that has type like "string" or ["string, "null"]
  // to get an automatic meaningful label for array items.
  const labelProp =
    uischema.options?.elementLabelProp ||
    uischema.options?.childDataAsLabel ||
    (schema?.properties &&
      Object.entries(schema.properties).find(([propName, prop]) => {
        return (
          !['_model', '_model_path', '_path', '_variations', '_metadata'].includes(propName) &&
          ['string', 'number', 'integer'].some((type) => {
            return (
              prop.type === type ||
              (Array.isArray(prop.type) &&
                prop.type.includes(type) &&
                prop.type.includes('null') &&
                prop.type.length === 2)
            );
          })
        );
      })?.[0]);
  const childLabel =
    (labelProp && childData[labelProp]) ||
    (typeof uischema.options?.dataAsLabel === 'number'
      ? Object.values(childData)[uischema.options?.dataAsLabel]
      : findValue(childData, uischema.options?.dataAsLabel) ?? `Item ${index + 1}`);

  return {
    ...ownProps,
    childLabel,
    childData,
  };
};

export const ctxToSpectrumArrayModalItemProps = (
  ctx: JsonFormsStateContext,
  ownProps: OwnPropsOfSpectrumArrayModalItem
) => mapStateToSpectrumArrayModalItemProps({ jsonforms: { ...ctx } }, ownProps);

const withContextToSpectrumArrayModalItemProps =
  (
    Component: React.ComponentType<OwnPropsOfSpectrumArrayModalItem>
  ): React.ComponentType<OwnPropsOfSpectrumArrayModalItem> =>
  ({ ctx, props, DNDHandle }: JsonFormsStateContext & OwnPropsOfSpectrumArrayModalItem) => {
    const stateProps = ctxToSpectrumArrayModalItemProps(ctx, props);
    return <Component {...stateProps} {...DNDHandle} />;
  };

export const withJsonFormsSpectrumArrayModalItemProps = (
  Component: React.ComponentType<OwnPropsOfSpectrumArrayModalItem>
): React.ComponentType<any> =>
  withJsonFormsContext(withContextToSpectrumArrayModalItemProps(React.memo(Component)));

export default withJsonFormsSpectrumArrayModalItemProps(SpectrumArrayModalItem);
