import ArrowDown from '@spectrum-icons/workflow/ArrowDown';
import ArrowUp from '@spectrum-icons/workflow/ArrowUp';
import DragHandle from '@spectrum-icons/workflow/DragHandle';
import SortButtons from './SortButtons';

interface SortIconsProps {
  keyboardClass: string;
  index: number;
  grabbedIndex: number | undefined;
  data: any;
  moveDown: any;
  moveUp: any;
  path: any;
  removeItems: any;
  uischema: any;
  disabled: boolean;
  DragHandleRef: any;
  onFocus: any;
  onBlur: any;
  onMouseEnter: any;
  onMouseLeave: any;
  onTouchMove: any;
  onKeyDown: any;
  upOrDown: string;
  userIsOnMobileDevice: boolean;
}

const SortIcons = ({
  keyboardClass,
  index,
  grabbedIndex,
  data,
  moveDown,
  moveUp,
  path,
  removeItems,
  uischema,
  disabled,
  DragHandleRef,
  onFocus,
  onBlur,
  onMouseEnter,
  onMouseLeave,
  onTouchMove,
  onKeyDown,
  upOrDown,
  userIsOnMobileDevice,
}: SortIconsProps) => {
  const sortMode: string | boolean = uischema?.options?.sortMode ?? 'DragAndDrop';
  return sortMode === 'arrows' ? (
    <div
      className={`arrowContainer grabbable ${sortMode === 'arrows' ? '' : 'grabcursor'} ${
        disabled ? 'disabledMovement' : ''
      }`}
      onBlur={onBlur}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onTouchMove={onTouchMove}
      ref={DragHandleRef}
    >
      <SortButtons
        autoFocus={grabbedIndex === index}
        data={data}
        index={index}
        moveDown={moveDown}
        moveUp={moveUp}
        path={path}
        removeItems={removeItems}
        uischema={uischema}
        upOrDown={upOrDown}
        userIsOnMobileDevice={userIsOnMobileDevice}
      />
    </div>
  ) : (
    <button
      disabled={disabled}
      ref={DragHandleRef}
      autoFocus={grabbedIndex === index}
      className={`grabbable ${disabled ? 'disabledMovement' : ''}`}
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onTouchMove={onTouchMove}
      onKeyDown={onKeyDown}
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
        UNSAFE_className={'mouseDragHandle'}
      />
    </button>
  );
};

export default SortIcons;
