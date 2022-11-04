import React from 'react';
import {
  Button,
  ButtonGroup,
  Content,
  Dialog,
  DialogContainer,
  Divider,
  Heading,
} from '@adobe/react-spectrum';

interface ModalItemDeleteProps {
  callbackFunction: any;
  deleteModalOpen: boolean;
  expanded: boolean;
  handleExpand: () => void;
  index: number;
  path: string;
  removeItem: (path: string, value: number) => () => void;
  setDeleteModalOpen: (value: boolean) => void;
}

export default function ModalItemDelete({
  callbackFunction,
  deleteModalOpen,
  expanded,
  handleExpand,
  index,
  path,
  removeItem,
  setDeleteModalOpen,
}: ModalItemDeleteProps) {
  const [durationBeforeDelete, setDurationBeforeDelete] = React.useState(0);
  const onPressStartHandler = () => {
    if (expanded) {
      handleExpand();
      setDurationBeforeDelete(700);
    }
  };

  const onPressEndHandler = () => {
    setDeleteModalOpen(false);
    setTimeout(() => {
      // console.log('removeItem', removeItem);
      removeItem(path, index)();
      if (callbackFunction) {
        callbackFunction(Math.random());
      }
      // callbackFunction(() => Math.random());
    }, durationBeforeDelete);
  };

  React.useEffect(() => {
    // callbackFunction(Math.random());
  }, [deleteModalOpen]);

  return (
    <DialogContainer onDismiss={() => setDeleteModalOpen(false)}>
      {deleteModalOpen && (
        <Dialog>
          <Heading>Delete Item?</Heading>
          <Divider />
          <Content>Are you sure you wish to delete this item?</Content>
          <ButtonGroup>
            <Button variant='secondary' onPress={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              autoFocus
              variant='cta'
              onPressStart={onPressStartHandler}
              onPressEnd={onPressEndHandler}
            >
              Delete
            </Button>
          </ButtonGroup>
        </Dialog>
      )}
    </DialogContainer>
  );
}
