import React from 'react';
import { Button, Flex } from '@adobe/react-spectrum';
import DragHandle from '@spectrum-icons/workflow/DragHandle';
import ArrowUp from '@spectrum-icons/workflow/ArrowUp';
import ArrowDown from '@spectrum-icons/workflow/ArrowDown';
import SpectrumArrayModalItem from '../SpectrumArrayModalItem/ModalItemComponent';
import { swap, clamp } from '../utils';
import { useSprings, useSpringRef, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import Add from '@spectrum-icons/workflow/Add';
import { checkIfUserIsOnMobileDevice } from '../../../util';
interface ArrayModalControlDragAndDropProps {
  callbackOpenedIndex: any;
  data: any;
  enabled: boolean;
  handleChange: any;
  handleRemoveItem: any;
  openedIndex: number | undefined;
  path: string;
  removeItems: any;
  renderers: any;
  schema: any;
  uischema: any;
  uischemas: any;
  onPressHandler: any;
  moveUpIndex: number | null;
  setMoveUpIndex: any;
}

const DragAndDrop = ({
  callbackOpenedIndex,
  data,
  enabled,
  handleChange,
  handleRemoveItem,
  openedIndex,
  moveUpIndex,
  setMoveUpIndex,
  onPressHandler,
  path,
  renderers,
  schema,
  uischema,
  uischemas,
}: ArrayModalControlDragAndDropProps) => {
  if (!data) {
    return null;
  }
  const [rerender, setRerender] = React.useState(0);
  const order = React.useRef<number[]>(data?.map((_: any, index: any) => index));
  const HEIGHT_OF_COMPONENT = 70;
  const fn =
    (order: number[], active: boolean = false) =>
    (index: number) =>
      active
        ? {
            y: order.indexOf(index) * HEIGHT_OF_COMPONENT,
            immediate: false,
            keys: false,
          }
        : {
            y: order.indexOf(index) * HEIGHT_OF_COMPONENT,
            immediate: true,
            keys: false,
          };
  const [springs, setSprings] = useSprings(data?.length ?? 0, fn(order.current));
  const DragHandleRef: any = useSpringRef();

  const [grabbedIndex, setGrabbedIndex]: any = React.useState(null);
  const [hoveredIndex, setHoveredIndex]: any = React.useState(null);
  const [delayHandler, setDelayHandler]: any = React.useState(null);
  const [touchMovement, setTouchMovement] = React.useState(false);
  const dragConfig = {
    pointer: { keys: false },
  };
  const bind: any = useDrag(
    ({ args: [originalIndex], active, movement: [, y] }) => {
      if (originalIndex !== null && grabbedIndex !== null) {
        if (touchMovement) {
          setTouchMovement(false);
          setGrabbedIndex(null);
        }
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
          finalChange(newOrder);
        }
      }
    },
    { ...dragConfig }
  );

  const finalChange = (newOrder: any) => {
    order.current = newOrder;
    handleChange(
      path,
      data.map((_: any, index: number) => data[newOrder[index]])
    );
    setSprings.start(fn(newOrder, false));
    setRerender((x: number) => x + 1);
  };

  let [keyboardClass, setKeyboardClass] = React.useState('');

  const move = (pressedKey: string, index: number) => {
    let newOrder: any = false;
    if (pressedKey === 'ArrowUp' && index > 0) {
      setKeyboardClass('keyboardUp');
      newOrder = swap(
        order.current,
        order.current.indexOf(order.current[index]),
        order.current.indexOf(order.current[index - 1])
      );
      setSprings.start(fn(newOrder, true));
      setTimeout(() => {
        setGrabbedIndex(index - 1);
        finalChange(newOrder);
        setKeyboardClass('');
        setGrabbedIndex(index - 1);
      }, 500);
    } else if (pressedKey === 'ArrowDown' && index < data?.length - 1) {
      setKeyboardClass('keyboardDown');
      newOrder = swap(
        order.current,
        order.current.indexOf(order.current[index]),
        order.current.indexOf(order.current[index + 1])
      );
      setSprings.start(fn(newOrder, true));
      setTimeout(() => {
        setGrabbedIndex(index + 1);
        finalChange(newOrder);
        setKeyboardClass('');
        setGrabbedIndex(index + 1);
      }, 500);
    }
  };

  const duplicateContent = (index: number) => {
    const newData = [...data, data[index]];
    order.current = newData.map((_: any, index: any) => index);
    handleChange(path, newData);
    setSprings.start(fn(newData, false));
  };

  React.useEffect(() => {
    if (openedIndex === undefined) {
      order.current = data?.map((_: any, index: any) => index);
      setSprings.start(fn(order.current, false));
    }
  }, [openedIndex]);

  React.useEffect(() => {
    order.current = data?.map((_: any, index: any) => index);
    setSprings.start(fn(order.current, false));
  }, [data]);

  const enableTouch = (index: number) => {
    setGrabbedIndex(index);
    setTouchMovement(true);
  };

  const showAddBetween = (index: number) => {
    setDelayHandler(
      setTimeout(() => {
        setHoveredIndex(index);
      }, 500)
    );
  };

  const hideAddBetween = () => {
    clearTimeout(delayHandler);
    setHoveredIndex(null);
  };

  const addBetween = (index: number, event: any) => {
    setMoveUpIndex(index);
    onPressHandler();
    event?.target?.blur();
  };

  React.useEffect(() => {
    if (moveUpIndex !== null) {
      const newOrder = swap(
        order.current,
        order.current.indexOf(order.current[data.length - 1]),
        order.current.indexOf(order.current[moveUpIndex])
      );
      finalChange(newOrder);
      setMoveUpIndex(null);
    }
  }, [data.length]);

  const userIsOnMobileDevice: boolean = checkIfUserIsOnMobileDevice(
    navigator.userAgent.toLowerCase()
  );

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
          key={`${path}_${index}_${rerender}`}
          style={{
            y,
            width: '100%',
            touchAction: 'none',
            transformOrigin: '50% 50% 0px',
            position: 'absolute',
          }}
          height={HEIGHT_OF_COMPONENT + 'px'}
        >
          <div
            style={{
              width: '100%',
              display: userIsOnMobileDevice ? 'none' : 'flex',
              justifyContent: 'center',
              zIndex: 80,
              position: 'absolute',
              top: '-20px',
              opacity: hoveredIndex === index ? 1 : 0,
            }}
            key={`${path}_${index}_addBetween`}
            onMouseEnter={() => showAddBetween(index)}
            onMouseLeave={() => hideAddBetween()}
            onFocus={() => setHoveredIndex(index)}
            onBlur={() => hideAddBetween()}
            className='add-container'
          >
            <Button variant='cta' onPress={(event: any) => addBetween(index, event)}>
              <Add />
            </Button>
          </div>
          <Flex
            direction='row'
            alignItems='stretch'
            flex='auto inherit'
            UNSAFE_style={{ zIndex: grabbedIndex === index ? 30 : 20 }}
          >
            <SpectrumArrayModalItem
              index={index}
              enabled={enabled}
              path={path}
              removeItem={handleRemoveItem}
              duplicateItem={duplicateContent}
              renderers={renderers}
              schema={schema}
              uischema={uischema}
              uischemas={uischemas}
              callbackOpenedIndex={callbackOpenedIndex}
              DNDHandle={
                <button
                  ref={DragHandleRef}
                  autoFocus={grabbedIndex === index}
                  className='grabbable'
                  onFocus={() => setGrabbedIndex(index)}
                  onBlur={() => setGrabbedIndex(null)}
                  onMouseEnter={() => setGrabbedIndex(index)}
                  onMouseLeave={() => setGrabbedIndex(null)}
                  onTouchMove={() => enableTouch(index)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                      move(e.key, index);
                    }
                  }}
                >
                  <ArrowUp
                    aria-label='Arrow Up'
                    size='S'
                    alignSelf='center'
                    width={'100%'}
                    UNSAFE_className={
                      keyboardClass === 'keyboardUp' && index === grabbedIndex
                        ? 'keyboardMovement'
                        : 'keyboardUser'
                    }
                  />
                  <ArrowDown
                    aria-label='Arrow Down'
                    size='S'
                    alignSelf='center'
                    width={'100%'}
                    UNSAFE_className={
                      keyboardClass === 'keyboardDown' && index === grabbedIndex
                        ? 'keyboardMovement'
                        : 'keyboardUser'
                    }
                  />
                  <DragHandle
                    aria-label='Drag and Drop Handle'
                    size='L'
                    alignSelf='center'
                    width={'100%'}
                    UNSAFE_className={
                      index === grabbedIndex ? 'keyboardMovement mouseUser' : 'mouseUser'
                    }
                  />
                </button>
              }
            />
          </Flex>
        </animated.div>
      ))}
    </div>
  );
};

export default DragAndDrop;
