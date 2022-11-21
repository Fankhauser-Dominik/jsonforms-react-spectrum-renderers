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
import Ajv from 'ajv';
import {
  getAjv,
  Actions,
  Dispatch,
  CoreActions,
  DispatchPropsOfArrayControl,
  update,
  ArrayControlProps,
  OwnPropsOfControl,
} from '@jsonforms/core';
import {
  ctxDispatchToControlProps,
  ctxToArrayControlProps,
  JsonFormsStateContext,
  useJsonForms,
  withJsonFormsContext,
} from '@jsonforms/react';

export interface AjvProps {
  ajv: Ajv;
}

export const withAjvProps =
  <P extends {}>(Component: React.ComponentType<AjvProps & P>) =>
  (props: P) => {
    const ctx = useJsonForms();
    const ajv = getAjv({ jsonforms: { ...ctx } });

    return <Component {...props} ajv={ajv} />;
  };

export interface HandleChangeProps {
  handleChange: (path: string, data: any) => void;
}

export const withHandleChange =
  <P extends {}>(Component: React.ComponentType<P & HandleChangeProps>) =>
  (props: P) => {
    const ctx = useJsonForms();
    const dispatch = ctx.dispatch;
    const handleChange = React.useCallback(
      (path: string, data: any) => {
        if (dispatch) {
          dispatch(Actions.update(path, () => data));
        }
      },
      [dispatch]
    );
    return <Component {...props} handleChange={handleChange} />;
  };

const mapDispatchToArrayControlProps = (
  dispatch: Dispatch<CoreActions>
): DispatchPropsOfArrayControl => ({
  // prettier-ignore
  addItem: (path: string, value: any) => () => {
    dispatch(
      update(
        path,
        (array: any[]) => (array ? [...array, value] : [value])
      )
    );
  },
  // prettier-ignore
  removeItems: (path: string, toDelete: number[]) => () => {
    dispatch(
      update(
        path,
        (array: any[]) => array.filter((_, index) => !toDelete.includes(index))
      )
    );
  },
  // prettier-ignore
  moveUp: (path, toMove: number) => () => {
    dispatch(
      update(
        path,
        (array: any[]) => (
          toMove > 0 && toMove < array.length
            ? array.map((_, index) =>
                array[
                  index > toMove || index < toMove - 1
                    ? index
                    : index === toMove
                      ? toMove - 1
                      : toMove
                ]
              )
            : array
        )
      )
    );
  },
  // prettier-ignore
  moveDown: (path, toMove: number) => () => {
    dispatch(
      update(path,
        (array: any[]) => (
          toMove < array.length - 1
            ? array.map(
                (_, index) =>
                  array[
                    index < toMove || index > toMove + 1
                      ? index
                      : index === toMove
                      ? toMove + 1
                      : toMove
                  ]
              )
            : array
        )
      )
    );
  },
});

const ctxDispatchToArrayControlProps = (dispatch: Dispatch<CoreActions>) => ({
  ...ctxDispatchToControlProps(dispatch as any),
  ...React.useMemo(() => mapDispatchToArrayControlProps(dispatch as any), [dispatch]),
});

const withContextToArrayControlProps =
  (Component: React.ComponentType<ArrayControlProps>) =>
  ({ ctx, props }: JsonFormsStateContext & ArrayControlProps) => {
    const stateProps = ctxToArrayControlProps(ctx, props);
    const dispatchProps = ctxDispatchToArrayControlProps(ctx.dispatch);

    return <Component {...props} {...stateProps} {...dispatchProps} />;
  };

export const withJsonFormsArrayControlProps = (
  Component: React.ComponentType<ArrayControlProps>,
  memoize = true
): React.ComponentType<OwnPropsOfControl> =>
  withJsonFormsContext(withContextToArrayControlProps(memoize ? React.memo(Component) : Component));
