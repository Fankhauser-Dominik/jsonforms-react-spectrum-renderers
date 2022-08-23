import React from 'react';
import ReactDom from 'react-dom';
import { useSpring, animated, easings } from 'react-spring';

interface AnimationWrapperProps {
  expanded: boolean;
  handleExpand: () => void;
  enableDetailedView: boolean;
  isAnimating: boolean;
  setIsAnimating: (isAnimating: boolean) => void;
  path: string;
  children: React.ReactNode;
}

export default function ModalItemAnimationWrapper({
  expanded,
  handleExpand,
  enableDetailedView,
  isAnimating,
  setIsAnimating,
  path,
  children,
}: AnimationWrapperProps) {
  const [isBlackoutHovered, setIsBlackoutHovered] = React.useState(false);
  const jsonFormWrapper = document.getElementById('json-form-wrapper') || document.getElementsByClassName('App-Form')[0]
  
  const addToZIndex = path.split('.').length;
  const leftOffset = (addToZIndex - 2) * 2.5;


  const slideAnim = useSpring({
    config: { duration: 700, easing: easings.easeOutQuart },
    left: expanded
      ? isBlackoutHovered && !isAnimating
        ? `${10 + (leftOffset)}%`
        : `${5 + (leftOffset)}%`
      : '100%',
    onRest: () => setIsAnimating(false),
  });

  const darkenAnim = useSpring({
    opacity: expanded ? 0.5 : 0,
    display: expanded ? 1 : 0,
  });


  return ReactDom.createPortal(
    <div
      className={`animatedModalItem animatedModalWrapper ${
        expanded ? 'expanded' : ''
      }`}
      style={{
        display: expanded || isAnimating ? 'block' : 'none',
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
                width: `${95 - (leftOffset)}%`,
              }
            : {}
        }
      >
        {children}
      </animated.div>
      <animated.div
        onClick={() => handleExpand()}
        onMouseEnter={() => setIsBlackoutHovered(true)}
        onMouseLeave={() => setIsBlackoutHovered(false)}
        className={'animatedModalItem darkenBackground'}
        style={
          enableDetailedView
            ? {
                opacity: darkenAnim.opacity,
                display: darkenAnim.display.to((e) =>
                  e > 0 ? 'block' : 'none'
                ),
                zIndex: 8000 + addToZIndex,
              }
            : { display: 'none' }
        }
      />
    </div>,
    jsonFormWrapper ||
      document.getElementById('root') ||
      document.getElementById('__next') ||
      document.body
  );
}
