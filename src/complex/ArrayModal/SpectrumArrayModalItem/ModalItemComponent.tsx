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
import React, { useState, useEffect } from 'react';
import { View } from '@adobe/react-spectrum';
import { composePaths, findUISchema } from '@jsonforms/core';
// import { JsonFormsDispatch } from '@jsonforms/react';
import { OwnPropsOfSpectrumArrayModalItem } from '.';

import ModalItemAnimatedWrapper from './ModalItemAnimationWrapper';
import SpectrumArrayModalOneOfRenderer from '../SpectrumArrayModalOneOfRenderer';

import './SpectrumArrayModalItem.css';

import SpectrumProvider from '../../../additional/SpectrumProvider';
// import { indexOfFittingSchemaObject } from '../utils';
import ModalItemHeader from './ModalItemHeader';
import { openItemWhenInQueryParam } from './ModalItemUtils';

interface NonEmptyRowProps {
  rowIndex?: number | undefined;
  moveUpCreator?: (path: string, position: number) => () => void;
  moveDownCreator?: (path: string, position: number) => () => void;
}

const SpectrumArrayModalItem = React.memo(
  (props: OwnPropsOfSpectrumArrayModalItem & NonEmptyRowProps) => {
    const {
      childLabel = '',
        // childData,
      index,
      // indexOfFittingSchema,
      path,
      removeItem,
      duplicateItem,
      renderers,
      schema,
      uischema,
      uischemas = [],
    } = props;
    const foundUISchema = findUISchema(uischemas, schema, uischema.scope, path);
    const childPath = composePaths(path, `${index}`);
    const [expanded, setExpanded] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

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

    useEffect(() => {
      openItemWhenInQueryParam(path, index, childLabel, handleExpand);
    }, []);

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
      />
    );

    console.log("foundUISchema", foundUISchema); 
    console.log("uiSchema", uischema); 
    const childUISchema = {
      scope: uischema.scope,
      type: "VerticalLayout",
      elements: [{
        scope: "#",
        type: "Control"
      }]
    };

    return (
      <SpectrumProvider flex='auto' width={'100%'}>
        <View
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
                <SpectrumArrayModalOneOfRenderer
                  {...props}
                  key={childPath}
                  path={childPath}
                  renderers={renderers}
                  schema={schema}
                  uischema={foundUISchema}
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
