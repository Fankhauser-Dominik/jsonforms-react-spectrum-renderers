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
// import { findValue } from './ModalItemUtils';

import './SpectrumArrayModalItem.css';

import SpectrumProvider from '../../../additional/SpectrumProvider';
import { indexOfFittingSchemaObject } from '../utils';
import ModalItemHeader from './ModalItemHeader';
import { openItemWhenInQueryParam } from './ModalItemUtils';

interface NonEmptyRowProps {
  rowIndex?: number | undefined;
  moveUpCreator?: (path: string, position: number) => () => void;
  moveDownCreator?: (path: string, position: number) => () => void;
}

const SpectrumArrayModalItem = React.memo(
  ({
    childLabel = '',
    childData,
    index,
    // indexOfFittingSchema,
    path,
    removeItem,
    duplicateItem,
    renderers,
    schema,
    uischema,
    uischemas = [],
  }: OwnPropsOfSpectrumArrayModalItem & NonEmptyRowProps) => {
    const foundUISchema = findUISchema(uischemas, schema, uischema.scope, path);
    const childPath = composePaths(path, `${index}`);
    const [expanded, setExpanded] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);

    const ref = React.useRef(null);

    const handleExpand = () => {
      setIsAnimating(true);
      if (expanded === false) {
        if (enableDetailedView === true) {window.postMessage({ type: 'expanded-item', index, path, breadCrumbLabel: childLabel, addToQuery: true }, '*')} // prettier-ignore
        setExpanded(true);
        return;
      }
      if (enableDetailedView === true) {window.postMessage({ type: 'expanded-item', index, path, breadCrumbLabel: childLabel, addToQuery: false }, '*')} // prettier-ignore
      setExpanded(false);
      return;
    };


    const enableDetailedView = uischema?.options?.enableDetailedView;

    /* indexOfFittingSchemaObject[childPath] =
      indexOfFittingSchema ?? findValue(childData, 'indexOfFittingSchema') ?? 0; */

    if (uischema.options?.OneOfModal) {
      indexOfFittingSchemaObject['OneOfModal'] = true;
    }
    if (uischema.options?.OneOfPicker) {
      indexOfFittingSchemaObject['OneOfPicker'] = true;
    }

    React.useEffect(() => {
      openItemWhenInQueryParam(path, index, childLabel, handleExpand);
    }, []);

    function breadCrumbClose(message: MessageEvent) {
      if (message.data.type !== 'close-item-breadcrumb') {
        return;
      }
      console.log("\x1b[31m~ message.data", message.data)
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
          } ${expanded ? 'expanded' : 'collapsed'}`}
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
          >
            {expanded || isAnimating ? (
              <View UNSAFE_className='json-form-dispatch-wrapper'>
                {enableDetailedView && Header}
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

export default SpectrumArrayModalItem;
