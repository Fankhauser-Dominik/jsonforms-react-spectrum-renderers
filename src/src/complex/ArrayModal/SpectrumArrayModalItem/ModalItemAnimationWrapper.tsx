import React from 'react';
import { useSpring, animated, easings } from 'react-spring';

interface AnimationWrapperProps {
  expanded: boolean;
  handleExpand: () => void;
  enableDetailedView: boolean;
  isAnimating: boolean;
  setIsAnimating: (isAnimating: boolean) => void;
  children: React.ReactNode;
}

export default function ModalItemAnimationWrapper({
  expanded,
  handleExpand,
  enableDetailedView,
  isAnimating,
  setIsAnimating,
  children,
}: AnimationWrapperProps) {
  const [isBlackoutHovered, setIsBlackoutHovered] = React.useState(true);

  const slideAnim = useSpring({
    config: { duration: 700, easing: easings.easeOutQuart },
    left: expanded
      ? isBlackoutHovered && !isAnimating
        ? 'calc(10% - 1px)'
        : 'calc(5% - 1px)'
      : 'calc(100% - 1px)',
    onRest: () => setIsAnimating(false),
  });

  const darkenAnim = useSpring({
    opacity: expanded ? 0.5 : 0,
    display: expanded ? 1 : 0,
  });

  return (
    <>
      <animated.div
        className={'animatedModalItemDiv'}
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
        className={'darkenBackground'}
        style={
          enableDetailedView
            ? {
                opacity: darkenAnim.opacity,
                display: darkenAnim.display.to((e) =>
                  e > 0 ? 'block' : 'none'
                ),
              }
            : { display: 'none' }
        }
      />
    </>
  );
}