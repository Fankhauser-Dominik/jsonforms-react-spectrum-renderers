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
import { OwnPropsOfSpectrumArrayModalItem } from '.';

import ModalItemAnimatedWrapper from './AnimationWrapper';

import './Component.css';

import SpectrumProvider from '../../../additional/SpectrumProvider';
import ModalItemHeader from './Header';
import { openItemWhenInQueryParam } from '../utils';

const CFRWithDetailLayoutItem = React.memo(
  ({
    childData,
    childLabel,
    data,
    elements,
    index,
    layout,
    path,
    removeItem,
    uischema,
  }: OwnPropsOfSpectrumArrayModalItem) => {
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
      openItemWhenInQueryParam(path, index, setExpanded);
    }, []);

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
        current: {
          path,
          index,
          data: childData,
        },
      });
    };

    const Header = (
      <ModalItemHeader
        data={data}
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
        uischema={uischema}
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
          ></ModalItemAnimatedWrapper>
        </View>
      </SpectrumProvider>
    );
  }
);

export default CFRWithDetailLayoutItem;
