import React from 'react';
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
  const stringified = (arr: any) => {
    return arr?.map((item: any, index: number) => {
      try {
        item._arrayIndex = index;
      } finally {
        return JSON.stringify(item);
      }
    });
  };
  const stringified2 = (arr: any) => {
    return arr?.map((item: any) => {
      delete item._arrayIndex;
      return JSON.stringify(item);
    });
  };
  if (!data) {
    return null;
  }
  const [RefKey, setRefKey] = React.useState(0);
  const order = React.useRef(Array.from(Array(data))?.map((data: any, _: any) => data));
  const HEIGHT_OF_COMPONENT = 70;
  const fn =
    (order: any[], active: boolean = false) =>
    (index: number) =>
      active
        ? {
            y: stringified(order).indexOf(JSON.stringify(data[index])) * HEIGHT_OF_COMPONENT,
            immediate: false,
          }
        : {
            y: stringified(order).indexOf(JSON.stringify(data[index])) * HEIGHT_OF_COMPONENT,
            immediate: true,
          };
  const [springs, setSprings] = useSprings(data?.length ?? 0, fn(order.current[0]));
  const DragHandleRef: any = useSpringRef();

  const [grabbedIndex, setGrabbedIndex]: any = React.useState(undefined);
  const bind: any = useDrag(({ args: [originalIndex], active, movement: [, y] }) => {
    if (!originalIndex) return;
    if (grabbedIndex !== null) {
      const curRow = clamp(
        Math.round((grabbedIndex * HEIGHT_OF_COMPONENT + y) / HEIGHT_OF_COMPONENT),
        0,
        data?.length - 1
      );
      const newOrder = swap(
        order.current[0],
        stringified(order.current[0]).indexOf(JSON.stringify(order.current[0][grabbedIndex])),
        stringified(order.current[0]).indexOf(JSON.stringify(order.current[0][curRow]))
      );
      setSprings.start(fn(newOrder, active)); // Feed springs new style data, they'll animate the view without causing a single render

      if (
        stringified2(order.current[0]).indexOf(JSON.stringify(order.current[0][grabbedIndex])) ===
          stringified2(order.current[0]).indexOf(JSON.stringify(order.current[0][curRow])) ||
        data === newOrder
      ) {
        return;
      }

      if (!active) {
        order.current[0] = newOrder;
        data.splice(0, data?.length);
        data.push(...newOrder);
        handleChange(path, newOrder);
        setSprings.start(fn(newOrder, active));
        callbackFunction(Math.random());
        setRefKey(RefKey + 1);
        setGrabbedIndex(null);
      }
    }
  });

  const duplicateContent = (index: number) => {
    /* Implement a way to include a change of _path while cloning */
    setRefKey(RefKey + 1);
    data.push(data[index]);
    order.current[0] = data;
    handleChange(path, data);
    setSprings.start(fn(data, false));
    callbackFunction(Math.random());
    setRefKey(RefKey + 1);
  };

  React.useEffect(() => {
    if (openedIndex === undefined) {
      order.current[0] = data;
      setSprings.start(fn(data, false));
      setRefKey(RefKey + 1);
    }
  }, [openedIndex]);

  React.useEffect(() => {
    order.current[0] = data;
    setSprings.start(fn(data, false));
  }, [data]);

  React.useEffect(() => {
    order.current[0] = data;
    setSprings.start(fn(data, false));
    setRefKey(Math.random());
  }, [indexRefKey]);

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
      key={RefKey}
    >
      {springs?.map(({ y }, index: number) => (
        <animated.div
          {...bind(`${path}_${index}_${RefKey}`)}
          key={`${path}_${index}_${RefKey}`}
          style={{
            zIndex: grabbedIndex === index ? 30 : 20,
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
                  onMouseDown={() => setGrabbedIndex(index)}
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
