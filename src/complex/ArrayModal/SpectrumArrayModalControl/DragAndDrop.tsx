import React, { useState } from 'react';
import { Flex } from '@adobe/react-spectrum';
import DragHandle from '@spectrum-icons/workflow/DragHandle';
import SpectrumArrayModalItem from '../SpectrumArrayModalItem/ModalItemComponent';
import { swap, clamp } from '../utils';
import { useSprings, useSpringRef, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

interface ArrayModalControlDragAndDropProps {
  indexRefKey: number;
  callbackFunction: any;
  callbackOpenedIndex: any;
  data: any;
  enabled: boolean;
  handleChange: any;
  handleRemoveItem: any;
  indexOfFittingSchemaArray: any[];
  openedIndex: number | undefined;
  path: string;
  removeItems: any;
  renderers: any;
  schema: any;
  uischema: any;
  uischemas: any;
}

const DragAndDrop = ({
  callbackFunction,
  callbackOpenedIndex,
  data,
  enabled,
  handleChange,
  handleRemoveItem,
  indexOfFittingSchemaArray,
  indexRefKey,
  openedIndex,
  path,
  renderers,
  schema,
  uischema,
  uischemas,
}: ArrayModalControlDragAndDropProps) => {
  if (!data) {
    return null;
  }
  console.log('Rendering');
  const [_, rerender] = useState(0);
  const order = React.useRef<number[]>(data?.map((_: any, index: any) => index));
  const HEIGHT_OF_COMPONENT = 70;
  const fn =
    (order: number[], active: boolean = false) =>
    (index: number) =>
      active
        ? {
            y: order.indexOf(index) * HEIGHT_OF_COMPONENT,
            immediate: false,
          }
        : {
            y: order.indexOf(index) * HEIGHT_OF_COMPONENT,
            immediate: true,
          };
  const [springs, setSprings] = useSprings(data?.length ?? 0, fn(order.current));
  const DragHandleRef: any = useSpringRef();
  const bind: any = useDrag(({ args: [originalIndex], active, movement: [, y] }) => {
    if (originalIndex !== null) {
      const curRow = clamp(
        Math.round((originalIndex * HEIGHT_OF_COMPONENT + y) / HEIGHT_OF_COMPONENT),
        0,
        data?.length - 1
      );
      const newOrder = swap(
        order.current,
        order.current.indexOf(order.current[originalIndex]),
        order.current.indexOf(order.current[curRow])
      );
      setSprings.start(fn(newOrder, active)); // Feed springs new style data, they'll animate the view without causing a single render

      if (
        order.current.indexOf(order.current[originalIndex]) ===
          order.current.indexOf(order.current[curRow]) ||
        order.current === newOrder
      ) {
        return;
      }

      if (!active) {
        order.current = newOrder;
        handleChange(
          path,
          data.map((_: any, index: number) => data[newOrder[index]])
        );
        console.log('emiting', {
          newData: JSON.stringify(data.map((_: any, index: number) => data[newOrder[index]])),
        });
        setSprings.start(fn(newOrder, active));
        rerender((x) => x + 1);
      }
    }
  });

  const duplicateContent = (index: number) => {
    const newData = [...data, data[index]];
    order.current = newData.map((_: any, index: any) => index);
    handleChange(path, newData);
    console.log('emiting', { newData: JSON.stringify(newData) });
    setSprings.start(fn(newData, false));
  };

  React.useEffect(() => {
    console.log('useEffect');
    if (openedIndex === undefined) {
      order.current = data?.map((_: any, index: any) => index);
      setSprings.start(fn(order.current, false));
    }
    rerender((x) => x + 1);
  }, [openedIndex, data, indexRefKey]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: data?.length ? HEIGHT_OF_COMPONENT * data?.length : 0,
        touchAction: 'none',
        transformOrigin: '50% 50% 0px',
        position: 'relative',
      }}
    >
      {springs?.map(({ y }, index: number) => (
        <animated.div
          {...bind(index)}
          key={`${path}_${index}`}
          style={{
            y,
            width: '100%',
            touchAction: 'none',
            transformOrigin: '50% 50% 0px',
            position: 'absolute',
          }}
          height={HEIGHT_OF_COMPONENT + 'px'}
        >
          <Flex direction='row' alignItems='stretch' flex='auto inherit'>
            <SpectrumArrayModalItem
              index={index}
              callbackFunction={callbackFunction}
              enabled={enabled}
              indexOfFittingSchema={indexOfFittingSchemaArray[index]}
              path={path}
              removeItem={handleRemoveItem}
              duplicateItem={duplicateContent}
              renderers={renderers}
              schema={schema}
              uischema={uischema}
              uischemas={uischemas}
              callbackOpenedIndex={callbackOpenedIndex}
              DNDHandle={
                <div
                  ref={DragHandleRef}
                  className='grabbable'
                  style={{
                    display: 'flex',
                    width: '50px',
                    marginRight: '-12px',
                  }}
                >
                  <DragHandle
                    aria-label='Drag and Drop Handle'
                    size='L'
                    alignSelf='center'
                    width={'100%'}
                    UNSAFE_style={{ margin: '-2px 0' }}
                  />
                </div>
              }
            />
          </Flex>
        </animated.div>
      ))}
    </div>
  );
};

export default DragAndDrop;
