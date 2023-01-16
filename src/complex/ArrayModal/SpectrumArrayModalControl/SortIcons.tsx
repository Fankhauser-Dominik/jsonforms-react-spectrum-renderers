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
}: SortIconsProps) => {
  const sortMode: string | boolean = uischema?.options?.sortMode ?? 'DragAndDrop';
  return (
    <>
      {sortMode === 'arrows' ? (
        <SortButtons
          data={data}
          index={index}
          path={path}
          removeItems={removeItems}
          uischema={uischema}
          moveUp={moveUp}
          moveDown={moveDown}
        />
      ) : (
        <>
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
        </>
      )}
    </>
  );
};

export default SortIcons;
