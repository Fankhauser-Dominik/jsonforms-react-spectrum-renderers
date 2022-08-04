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
  const [isBlackoutHovered, setIsBlackoutHovered] = React.useState(true);

  const slideAnim = useSpring({
    config: { duration: 700, easing: easings.easeOutQuart },
    left: expanded
      ? isBlackoutHovered && !isAnimating
        ? '10%'
        : '5%'
      : '100%',
    onRest: () => setIsAnimating(false),
  });

  const darkenAnim = useSpring({
    opacity: expanded ? 0.5 : 0,
    display: expanded ? 1 : 0,
  });

  const jsonformsWrapper =
    document.getElementById('json-form-wrapper') ||
    document.getElementsByClassName('App-Form')[0];
  const addToZIndex = path.split('.').length;

  return ReactDom.createPortal(
    <div
      className={`animatedModalItem animatedModalWrapper ${
        expanded ? 'expanded' : ''
      }`}
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
                height: jsonformsWrapper.clientHeight,
                width: jsonformsWrapper.clientWidth / 2,
                position: 'fixed',
                top: jsonformsWrapper.getBoundingClientRect().top,
                left: jsonformsWrapper.getBoundingClientRect().left,
                zIndex: 8000 + addToZIndex,
              }
            : { display: 'none' }
        }
      />
    </div>,
    document.getElementById(`spectrum-renderer-arrayContentWrapper_${path}`) ||
      document.getElementById('root') ||
      document.getElementById('__next') ||
      document.body
  );
}
