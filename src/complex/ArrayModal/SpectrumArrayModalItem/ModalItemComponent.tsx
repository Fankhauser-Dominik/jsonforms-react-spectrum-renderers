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
import { composePaths, findUISchema } from '@jsonforms/core';
import { JsonFormsDispatch } from '@jsonforms/react';
import { OwnPropsOfSpectrumArrayModalItem } from '.';

import ModalItemAnimatedWrapper from './ModalItemAnimationWrapper';

import './SpectrumArrayModalItem.css';

import SpectrumProvider from '../../../additional/SpectrumProvider';
import { indexOfFittingSchemaObject } from '../utils';
import ModalItemHeader from './ModalItemHeader';
import { openItemWhenInQueryParam } from './ModalItemUtils';

interface NonEmptyRowProps {
  rowIndex?: number | undefined;
  moveUpCreator?: (path: string, position: number) => () => void;
  moveDownCreator?: (path: string, position: number) => () => void;
  DNDHandle?: any;
}

const SpectrumArrayModalItem = React.memo(
  ({
    childData,
    index,
    childLabel,
    callbackFunction,
    path,
    removeItem,
    duplicateItem,
    renderers,
    schema,
    uischema,
    uischemas = [],
    DNDHandle = false,
  }: OwnPropsOfSpectrumArrayModalItem & NonEmptyRowProps) => {
    const foundUISchema = findUISchema(uischemas, schema, uischema.scope, path);
    const childPath = composePaths(path, `${index}`);
    /* If The Component has an empty Object, open it (true for a newly added Component) */
    const [expanded, setExpanded] = React.useState(
      JSON.stringify(childData) === '{}' ? true : false
    );
    const [isAnimating, setIsAnimating] = React.useState(false);

    const ref = React.useRef(null);

    const handleExpand = () => {
      setIsAnimating(true);
      if (expanded === false) {
        if (enableDetailedView === true) {
          window.postMessage(
            {
              type: 'expanded-item',
              index,
              path,
              breadCrumbLabel: childLabel,
              addToQuery: true,
            },
            '*'
          );
        }
        setExpanded(true);
        return;
      }
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
      setExpanded(false);

      const url = window.location.href;
      let newUrl: any = new URL(url);
      if (window.location.href.endsWith(`${path}.${index}`)) {
        newUrl = url.replace(`${path}.${index}`, '');
      } else {
        if (window.location.href.includes('formLocation=')) {
          newUrl = url.substring(0, url.lastIndexOf('-'));
        }
      }
      window.history.pushState('', '', newUrl);

      return;
    };

    const enableDetailedView = uischema?.options?.enableDetailedView;

    if (uischema.options?.OneOfModal) {
      indexOfFittingSchemaObject['OneOfModal'] = true;
    }
    if (uischema.options?.OneOfPicker) {
      indexOfFittingSchemaObject['OneOfPicker'] = true;
    }

    React.useEffect(() => {
      openItemWhenInQueryParam(path, index, setExpanded);
    }, []);

    function breadCrumbClose(message: MessageEvent) {
      if (message.data.type !== 'close-item-breadcrumb') {
        return;
      }
      if (message.data.path.includes(`${path}-${index}-${childLabel.replaceAll(/(-|_)/g, '+')}`)) {
        setIsAnimating(true);
        setExpanded(false);
      }
    }

    React.useEffect(() => {
      if (expanded) {
        window.addEventListener('message', breadCrumbClose);
      }
      return () => window.removeEventListener('message', breadCrumbClose);
    }, [expanded]);

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
        key={childPath}
        path={childPath}
        renderers={renderers}
        schema={schema}
        uischema={foundUISchema || uischema}
      />
    );

    const Header = (
      <ModalItemHeader
        expanded={expanded}
        enableDetailedView={enableDetailedView}
        index={index}
        path={path}
        handleExpand={handleExpand}
        removeItem={removeItem}
        duplicateItem={duplicateItem}
        childLabel={childLabel}
        childData={childData}
        DNDHandle={DNDHandle}
        customPicker={{
          enabled: uischema?.options?.picker,
          handler: customPickerHandler,
        }}
        uischema={uischema}
        JsonFormsDispatch={JsonFormsDispatchComponent}
      />
    );

    return (
      <SpectrumProvider
        flex='auto'
        width={uischema.options?.showSortButtons ? 'calc(100% - 66px)' : '100%'}
      >
        <View
          ref={ref}
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
          {Header}
          <ModalItemAnimatedWrapper
            expanded={expanded}
            handleExpand={handleExpand}
            enableDetailedView={enableDetailedView}
            isAnimating={isAnimating}
            setIsAnimating={setIsAnimating}
            path={path}
            callbackFunction={callbackFunction}
          >
            {expanded || isAnimating ? (
              <View UNSAFE_className='json-form-dispatch-wrapper'>
                {enableDetailedView && Header}
                {JsonFormsDispatchComponent}
              </View>
            ) : null}
          </ModalItemAnimatedWrapper>
        </View>
      </SpectrumProvider>
    );
  }
);

export default SpectrumArrayModalItem;
