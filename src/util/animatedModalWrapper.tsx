import React from 'react';
import ReactDom from 'react-dom';
import { useSpring, animated, easings } from 'react-spring';
import { Content, View } from '@adobe/react-spectrum';
import ReactFocusLock from 'react-focus-lock';

interface AnimationWrapperProps {
  expanded: boolean;
  handleExpand: () => void;
  enableDetailedView?: boolean;
  isAnimating: boolean;
  setIsAnimating: (isAnimating: boolean) => void;
  path: string;
  Header?: any;
  elements?: any;
  callbackFunction?: any;
  children?: React.ReactNode;
}

export function ModalItemAnimationWrapper({
  enableDetailedView = true,
  expanded,
  handleExpand,
  isAnimating,
  setIsAnimating,
  path,
  elements,
  Header,
  callbackFunction,
  children,
}: AnimationWrapperProps) {
  const [isBlackoutHovered, setIsBlackoutHovered] = React.useState(false);
  const jsonFormWrapper =
    document.getElementById('json-form-wrapper') || document.getElementsByClassName('App-Form')[0];

  // addToZIndex should always be rounded up to an even number so array items, and single items have the same amount of offset
  const addToZIndex = 2 * Math.round((path?.split('.').length ?? 1) / 2);
  const leftOffset = (addToZIndex - 2) * 2.5;

  const onRestFunction = () => {
    setIsAnimating(false);
    if (!expanded && callbackFunction) {
      callbackFunction(Math.random());
    }
  };

  const slideAnim = useSpring({
    config: { duration: 700, easing: easings.easeOutQuart },
    left: expanded
      ? isBlackoutHovered && !isAnimating
        ? `${10 + leftOffset}%`
        : `${5 + leftOffset}%`
      : '100%',
    onRest: () => onRestFunction(),
  });

  const darkenAnim = useSpring({
    config: { duration: 400, easing: easings.easeInOutCubic },
    opacity: expanded ? 0.5 : 0,
    display: expanded ? 1 : 0,
  });

  return ReactDom.createPortal(
    <ReactFocusLock
      className='spectrum-detailed-view-dialog-wrapper'
      disabled={!expanded || isAnimating}
      returnFocus={true}
      as={'div'}
      shards={[document.getElementById('debug-menu-button') as HTMLElement]}
    >
      <div
        className={`animatedModalItem animatedModalWrapper ${expanded ? 'expanded' : ''}`}
        style={{
          visibility: expanded || isAnimating ? 'visible' : 'collapse',
        }}
      >
        <animated.div
          className={`animatedModalItem animatedModalItemDiv ${
            enableDetailedView ? 'detailedView' : ''
          }`}
          style={
            enableDetailedView
              ? {
                  left: slideAnim.left,
                  zIndex: 8001 + addToZIndex,
                  width: `${95 - leftOffset}%`,
                }
              : {}
          }
        >
          {elements ? (
            expanded || isAnimating ? (
              <View UNSAFE_className='json-form-dispatch-wrapper'>
                {Header}
                <Content marginX='size-250'>{elements}</Content>
              </View>
            ) : null
          ) : expanded || isAnimating ? (
            children
          ) : null}
        </animated.div>
        <animated.div
          onClick={() => expanded && handleExpand()}
          onMouseEnter={() => setIsBlackoutHovered(true)}
          onMouseLeave={() => setIsBlackoutHovered(false)}
          className={'animatedModalItem darkenBackground'}
          style={{
            opacity: darkenAnim.opacity,
            display: darkenAnim.display.to((e) => (e > 0 ? 'block' : 'none')),
            zIndex: 8000 + addToZIndex,
            cursor: expanded ? 'pointer' : 'default',
          }}
        />
      </div>
    </ReactFocusLock>,
    jsonFormWrapper ||
      document.getElementById('root') ||
      document.getElementById('__next') ||
      document.body
  );
}
