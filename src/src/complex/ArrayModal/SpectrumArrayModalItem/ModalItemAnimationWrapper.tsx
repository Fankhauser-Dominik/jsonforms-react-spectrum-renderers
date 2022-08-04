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

  const slidingDiv = React.useRef(null)
  

  return ReactDom.createPortal(
    <>
      <animated.div
        className={`animatedModalItem animatedModalItemDiv ${enableDetailedView ? 'detailedView' : ''}`}
        ref={slidingDiv}
        style={
          enableDetailedView
            ? {
                left: slideAnim.left,
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
                // @ts-ignore
                height: slidingDiv?.current?.clientHeight || '100%',
              }
            : { display: 'none' }
        }
      />
    </>,
    document.getElementById(`spectrum-renderer-arrayContentWrapper_${path}`)  || document.getElementById('root') || document.getElementById('__next') || document.body
  );
}