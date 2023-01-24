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
import {
  ActionButton,
  Button,
  ButtonGroup,
  Content,
  Dialog,
  DialogContainer,
  Divider,
  Flex,
  Heading,
  Text,
  Tooltip,
  TooltipTrigger,
  View,
} from '@adobe/react-spectrum';
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
import Delete from '@spectrum-icons/workflow/Delete';
import ChevronDown from '@spectrum-icons/workflow/ChevronDown';
import ChevronUp from '@spectrum-icons/workflow/ChevronUp';
import SpectrumProvider from '../../additional/SpectrumProvider';
import { settings } from '../../util';

export interface OwnPropsOfSpectrumArrayItem {
  data: any;
  childLabel?: string;
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

  const enableDetailedView = uischema?.options?.enableDetailedView ?? true;
  const showItemNumber = uischema?.options?.showItemNumber ?? false;

  const pathFilter = uischema?.options?.pathFilter;

  let displayPath = '';
  if (typeof pathFilter === 'string') {
    displayPath = data?._path?.replace(pathFilter, '') || '';
  } else {
    displayPath = data?._path?.split('/').slice(3).join('/') || '';
    if (displayPath) {
      displayPath = `/${displayPath}`;
    }
  }

  return (
    <SpectrumProvider>
      <View
        UNSAFE_className={`list-array-item ${
          enableDetailedView ? 'enableDetailedView' : 'accordionView'
        } ${uischema?.options?.noAccordion ? 'noAccordion' : null}`}
        borderWidth='thin'
        borderColor='dark'
        borderRadius='medium'
        padding='size-150'
      >
        <View aria-selected={isExpanded} width={'100%'}>
          <Flex
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            UNSAFE_className='spectrum-array-item-container'
          >
            {showItemNumber && (
              <View UNSAFE_className='spectrum-array-item-number'>
                <Text>{index + 1}</Text>
              </View>
            )}
            <ActionButton
              flex='auto'
              isQuiet
              onPress={handleExpand(index)}
              aria-label={`expand-item-${childLabel}`}
            >
              {data?._path ? (
                <Text
                  UNSAFE_style={{
                    position: 'absolute',
                    direction: 'rtl',
                    opacity: 0.7,
                    bottom: -5,
                    left: 0,
                    fontSize: '12px',
                    height: 18,
                    maxWidth: 'calc(100% - 12px)',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textAlign: 'left',
                    alignSelf: 'start',
                    justifyContent: 'start',
                  }}
                >
                  {/* The "&lrm;" fixes an issue caused by the direction: 'rtl' property */}
                  &lrm;{displayPath}
                </Text>
              ) : null}
              <Text
                UNSAFE_style={{
                  textAlign: 'left',
                  width: '100%',
                  transform: data?._path ? 'translateY(-20%)' : '',
                  fontWeight: 600,
                }}
              >
                {childLabel}
              </Text>
            </ActionButton>
            <View>
              <TooltipTrigger delay={settings.toolTipDelay}>
                <ActionButton
                  onPress={handleExpand(index)}
                  isQuiet={true}
                  aria-label={`expand-item-${childLabel}`}
                >
                  {isExpanded ? (
                    <ChevronUp aria-label='Collapse' size='S' />
                  ) : (
                    <ChevronDown aria-label='Expand' size='S' />
                  )}
                </ActionButton>
                <Tooltip>{isExpanded ? 'Collapse' : 'Expand'}</Tooltip>
              </TooltipTrigger>
              <TooltipTrigger delay={settings.toolTipDelay}>
                <ActionButton
                  onPress={() => setOpen(true)}
                  aria-label={`delete-item-${childLabel}`}
                >
                  <Delete aria-label='Delete' size='S' />
                </ActionButton>
                <Tooltip>Delete</Tooltip>
              </TooltipTrigger>
              <DialogContainer onDismiss={handleClose}>
                {open && (
                  <Dialog>
                    <Heading>Delete Item?</Heading>
                    <Divider />
                    <Content>Are you sure you wish to delete this item?</Content>
                    <ButtonGroup>
                      <Button variant='secondary' onPress={handleClose}>
                        Cancel
                      </Button>
                      <Button
                        autoFocus
                        variant='cta'
                        onPressStart={removeItem(path, index)}
                        onPressEnd={handleClose}
                      >
                        Delete
                      </Button>
                    </ButtonGroup>
                  </Dialog>
                )}
              </DialogContainer>
            </View>
          </Flex>
        </View>
        {isExpanded ? (
          <View>
            <JsonFormsDispatch
              enabled={enabled}
              key={childPath}
              path={childPath}
              renderers={renderers}
              schema={schema}
              uischema={foundUISchema || uischema}
            />
          </View>
        ) : (
          ''
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

export default withJsonFormsSpectrumArrayItemProps(SpectrumArrayItem);
