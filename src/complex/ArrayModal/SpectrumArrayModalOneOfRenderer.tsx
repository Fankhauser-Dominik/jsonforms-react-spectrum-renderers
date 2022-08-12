import { useState } from "react";
import {
  // RankedTester,
  createCombinatorRenderInfos,
  CombinatorSubSchemaRenderInfo,
  CombinatorRendererProps,
  OwnPropsOfControl,
  // UISchemaElement,
  // JsonSchema,
  // TesterContext,
  // isOneOfControl,
} from '@jsonforms/core';
import { 
  JsonFormsDispatch, 
  withJsonFormsOneOfProps, 
} from '@jsonforms/react';
import {
  Content,
  /*
  Divider,
  Heading,
  Item,
  */
  View,
} from '@adobe/react-spectrum';
import SpectrumProvider from '../../additional/SpectrumProvider';
import CombinatorProperties from '../CombinatorProperties';

const SpectrumArrayModalOneOfRenderer = (props: { [key: string]: any }) => {
  console.log("SpectrumArrayModalOneOfRenderer",props);
  const { path, schema, visible, rootSchema, uischema, uischemas, cells, renderers, indexOfFittingSchema } = props;

  let childInfo: CombinatorSubSchemaRenderInfo[] = [];
  if (schema?.oneOf) {
    childInfo = createCombinatorRenderInfos(
      schema?.oneOf,
      rootSchema,
      'oneOf',
      uischema,
      path,
      uischemas
    );
  }

  const [selectedIndex] = useState(indexOfFittingSchema ?? 0);
  childInfo = childInfo.filter((_, index) => index === selectedIndex);

  console.log('childInfo', childInfo);
  console.log('props', props);
  return (
    <SpectrumProvider>
      <View isHidden={!visible}>
        <CombinatorProperties
          combinatorKeyword={'oneOf'}
          path={path}
          schema={schema}
        />
        <Content margin='size-160'>
          {childInfo?.map((child, index: number) => (
            <JsonFormsDispatch
              cells={cells}
              key={index}
              path={path}
              renderers={renderers}
              schema={child.schema}
              uischema={child.uischema}
            />
          ))}
        </Content>
      </View>
    </SpectrumProvider>
  );
}

//export declare const withJsonFormsOneOfProps: (Component: ComponentType<CombinatorRendererProps>, memoize?: boolean) => ComponentType<OwnPropsOfControl>;
/*
 *
 * So I need to use something like withJsonFormsOneOfProps because it will give me the
 * props I need for this to work as a oneOf renderer.
 *
 * Right now it 'works' but it won't build, 
 * beacuse there's a conflict in the typing of the uischema 
 * in the parent ModalItemComponent
 *
 * I was exploring 'extending' the withJsonFormsOneOfProps type
 * to remove/change the scope property

const customOneOfProps = (props) => {
  return SpectrumArrayModalOneOfRenderer;
}
 */

export default withJsonFormsOneOfProps(SpectrumArrayModalOneOfRenderer);
