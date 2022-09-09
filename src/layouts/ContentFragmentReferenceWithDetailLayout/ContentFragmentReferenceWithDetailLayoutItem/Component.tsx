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

import ModalItemAnimatedWrapper from './AnimationWrapper';

import './Component.css';

import SpectrumProvider from '../../../additional/SpectrumProvider';
import ModalItemHeader from './Header';

const CFRWithDetailLayoutItem = React.memo(
  ({
    childData,
    index,
    childLabel,
    path,
    removeItem,
    renderers,
    schema,
    uischema,
    uischemas = [],
    elements,
    layout,
  }: OwnPropsOfSpectrumArrayModalItem) => {
    const foundUISchema = findUISchema(uischemas, schema, uischema.scope, path);
    const childPath = composePaths(path, `${index}`);
    const [expanded, setExpanded] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);

    const ref = React.useRef(null);

    const handleExpand = () => {
      setIsAnimating(true);
      if (expanded === false) {
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
        setExpanded(true);
        return;
      }
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
      setExpanded(false);
      return;
    };

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

    const Header = (
      <ModalItemHeader
        expanded={expanded}
        index={index}
        path={path}
        handleExpand={handleExpand}
        removeItem={removeItem}
        childLabel={childLabel}
        childData={childData}
        customPicker={{
          enabled: uischema?.options?.picker,
          handler: customPickerHandler,
        }}
        layout={layout}
      />
    );

    return (
      <SpectrumProvider
        flex='auto'
        width={uischema.options?.showSortButtons ? 'calc(100% - 66px)' : '100%'}
      >
        <View
          ref={ref}
          UNSAFE_className={`list-array-item enableDetailedView ${
            expanded ? 'expanded' : 'collapsed'
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
            isAnimating={isAnimating}
            setIsAnimating={setIsAnimating}
            path={path}
            elements={elements[index]}
            Header={Header}
          >
            {expanded || isAnimating ? (
              <View UNSAFE_className='json-form-dispatch-wrapper'>
                {Header}
                <JsonFormsDispatch
                  key={childPath}
                  path={childPath}
                  renderers={renderers}
                  schema={schema}
                  uischema={foundUISchema || uischema}
                />
              </View>
            ) : null}
          </ModalItemAnimatedWrapper>
        </View>
      </SpectrumProvider>
    );
  }
);

export default CFRWithDetailLayoutItem;
