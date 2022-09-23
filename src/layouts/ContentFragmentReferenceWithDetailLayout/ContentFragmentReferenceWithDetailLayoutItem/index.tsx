import React, { ComponentType } from 'react';
import CFRWithDetailLayoutItem from './Component';
import {
  ControlElement,
  JsonFormsState,
  JsonSchema,
  Resolve,
  composePaths,
  getData,
  update as updateAction,
} from '@jsonforms/core';
import { JsonFormsStateContext, withJsonFormsContext } from '@jsonforms/react';
//import areEqual from '../../../util/areEqual';
import { findValue } from '../utils';

export interface OwnPropsOfSpectrumArrayModalItem {
  childData?: any;
  childLabel: string;
  data: any;
  elements: any;
  index: number;
  layout: any;
  path: string;
  removeItem(path: string, value: number): () => void;
  schema: JsonSchema;
  uischema: ControlElement;
}

export interface HandleChange {
  handleChange: (path: string, data: any) => void;
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
  const firstPrimitiveProp = schema?.properties
    ? Object.keys(schema?.properties).find((propName) => {
        if (schema.properties) {
          const prop = schema?.properties[propName];
          return prop.type === 'string' || prop.type === 'number' || prop.type === 'integer';
        }
      })
    : undefined;
  const childPath = composePaths(path, `${index}`);
  const childData = Resolve.data(getData(state), childPath);
  const childLabel =
    uischema.options?.elementLabelProp ?? firstPrimitiveProp ?? uischema.options?.childDataAsLabel
      ? childData
      : undefined ?? typeof uischema.options?.dataAsLabel === 'number'
      ? Object.values(childData)[uischema.options?.dataAsLabel]
      : findValue(childData, uischema.options?.dataAsLabel) ?? `Item ${index + 1}`;

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
    Component: ComponentType<OwnPropsOfSpectrumArrayModalItem & HandleChange>
  ): ComponentType<OwnPropsOfSpectrumArrayModalItem> =>
  ({ ctx, props, DNDHandle }: JsonFormsStateContext & OwnPropsOfSpectrumArrayModalItem) => {
    const stateProps = ctxToSpectrumArrayModalItemProps(ctx, props);
    const handleChange = (path: string, data: any) => {
      ctx.dispatch(updateAction(path, () => data));
    };
    return <Component {...stateProps} {...DNDHandle} handleChange={handleChange} />;
  };

export const withJsonFormsSpectrumArrayModalItemProps = (
  Component: ComponentType<OwnPropsOfSpectrumArrayModalItem & HandleChange>
): ComponentType<any> =>
  withJsonFormsContext(
    withContextToSpectrumArrayModalItemProps(
      React.memo(
        Component //,
        // (
        //   prevProps: OwnPropsOfSpectrumArrayModalItem & HandleChange,
        //   nextProps: OwnPropsOfSpectrumArrayModalItem & HandleChange
        // ) => {
        //   const { removeItem: prevRemoveItem, ...restPrevProps } = prevProps;
        //   const { removeItem: nextRemoveItem, ...restNextProps } = nextProps;
        //   const v = areEqual(restPrevProps, restNextProps);
        //   console.log('memo', restPrevProps, restPrevProps, v);
        //   console.log('memo', prevProps, nextProps, v);
        //   return v;
        // }
      )
    )
  );

export default withJsonFormsSpectrumArrayModalItemProps(CFRWithDetailLayoutItem);
