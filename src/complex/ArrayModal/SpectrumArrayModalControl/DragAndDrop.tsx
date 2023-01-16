import React from 'react';
import { Button, Flex } from '@adobe/react-spectrum';
import SpectrumArrayModalItem from '../SpectrumArrayModalItem/ModalItemComponent';
import { swap, clamp } from '../utils';
import { useSprings, useSpringRef, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import Add from '@spectrum-icons/workflow/Add';
import { checkIfUserIsOnMobileDevice } from '../../../util';
import SortIcons from './SortIcons';
interface ArrayModalControlDragAndDropProps {
  callbackOpenedIndex: any;
  data: any;
  enabled: boolean;
  handleChange: any;
  handleRemoveItem: any;
  indexOfFittingSchemaArray: any[];
  moveDown: any;
  moveUp: any;
  moveUpIndex: number | null;
  onPressHandler: any;
  openedIndex: number | undefined;
  path: string;
  removeItems: any;
  renderers: any;
  schema: any;
  setMoveUpIndex: any;
  uischema: any;
  uischemas: any;
}

const DragAndDrop = ({
  callbackOpenedIndex,
  data,
  enabled,
  handleChange,
  handleRemoveItem,
  indexOfFittingSchemaArray,
  moveDown,
  moveUp,
  moveUpIndex,
  onPressHandler,
  openedIndex,
  path,
  removeItems,
  renderers,
  schema,
  setMoveUpIndex,
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

  const expanded = openedIndex !== undefined;

  const modalItem = (index: number, disabled: boolean = false) => (
    <SpectrumArrayModalItem
      callbackOpenedIndex={callbackOpenedIndex}
      openIndex={openedIndex}
      duplicateItem={duplicateContent}
      enabled={enabled}
      index={index}
      indexOfFittingSchema={indexOfFittingSchemaArray}
      path={path}
      removeItem={handleRemoveItem}
      renderers={renderers}
      schema={schema}
      uischema={uischema}
      uischemas={uischemas}
      DNDHandle={
        <button
          disabled={disabled}
          ref={DragHandleRef}
          autoFocus={grabbedIndex === index}
          className={`grabbable ${disabled ? 'disabledMovement' : ''}`}
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
          <SortIcons
            keyboardClass={keyboardClass}
            index={index}
            grabbedIndex={grabbedIndex}
            data={data}
            moveDown={moveDown}
            moveUp={moveUp}
            path={path}
            removeItems={removeItems}
            uischema={uischema}
          />
        </button>
      }
    />
  );

  if (expanded) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: data?.length ? HEIGHT_OF_COMPONENT * data?.length : 0,
          position: 'relative',
          touchAction: 'none',
          transformOrigin: '50% 50% 0px',
        }}
      >
        {springs?.map(({ y }, index: number) => (
          <animated.div
            {...bind(index)}
            key={`${path}_${index}_${rerender}`}
            style={{
              position: 'absolute',
              touchAction: 'none',
              transformOrigin: '50% 50% 0px',
              width: '100%',
              y,
              zIndex: grabbedIndex === index ? 30 : 20,
            }}
            height={HEIGHT_OF_COMPONENT + 'px'}
          >
            <div
              style={{
                display: userIsOnMobileDevice ? 'none' : 'flex',
                justifyContent: 'center',
                opacity: hoveredIndex === index ? 1 : 0,
                position: 'absolute',
                top: '-20px',
                width: '100%',
                zIndex: 80,
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
              UNSAFE_style={{ zIndex: grabbedIndex === index ? 40 : 20 }}
            >
              {modalItem(index, true)}
            </Flex>
          </animated.div>
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: data?.length ? HEIGHT_OF_COMPONENT * data?.length : 0,
        position: 'relative',
        touchAction: 'none',
        transformOrigin: '50% 50% 0px',
      }}
    >
      {springs?.map(({ y }, index: number) => (
        <animated.div
          {...bind(index)}
          key={`${path}_${index}_${rerender}`}
          style={{
            position: 'absolute',
            touchAction: 'none',
            transformOrigin: '50% 50% 0px',
            width: '100%',
            y,
            zIndex: grabbedIndex === index ? 30 : 20,
          }}
          height={HEIGHT_OF_COMPONENT + 'px'}
        >
          <div
            style={{
              display: userIsOnMobileDevice ? 'none' : 'flex',
              justifyContent: 'center',
              opacity: hoveredIndex === index ? 1 : 0,
              position: 'absolute',
              top: '-20px',
              width: '100%',
              zIndex: 80,
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
            UNSAFE_style={{ zIndex: grabbedIndex === index ? 40 : 20 }}
          >
            {modalItem(index)}
          </Flex>
        </animated.div>
      ))}
    </div>
  );
};

export default DragAndDrop;
