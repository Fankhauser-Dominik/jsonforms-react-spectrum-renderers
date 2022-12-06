import React from 'react';
import { Flex, TooltipTrigger, Tooltip, ActionButton } from '@adobe/react-spectrum';
import ArrowUp from '@spectrum-icons/workflow/ArrowUp';
import ArrowDown from '@spectrum-icons/workflow/ArrowDown';
import { settings } from '../../../util';

interface ArrayModalControlSortButtonsProps {
  data: any;
  index: number;
  path: any;
  removeItems: any;
  uischema: any;
  moveUp: any;
  moveDown: any;
}

function SortButtons({
  data,
  index,
  path,
  uischema,
  moveUp,
  moveDown,
}: ArrayModalControlSortButtonsProps) {
  return (
    <Flex
      direction={uischema.options?.sortButtonDirection === 'Horizontal' ? 'row' : 'column'}
      marginTop={uischema.options?.sortButtonDirection === 'Horizontal' ? 'size-225' : 'size-0'}
    >
      <TooltipTrigger delay={settings.toolTipDelay}>
        <ActionButton
          isQuiet
          onPress={moveUp(path, index)}
          aria-label={`move-item-${path}.${index}-up`}
          marginX='size-10'
          isDisabled={index <= 0}
        >
          <ArrowUp aria-label='ArrowUp' size='S' />
        </ActionButton>
        <Tooltip>Move upwards</Tooltip>
      </TooltipTrigger>
      <TooltipTrigger delay={settings.toolTipDelay}>
        <ActionButton
          isQuiet
          onPress={moveDown(path, index)}
          aria-label={`move-item-${path}.${index}-down`}
          marginX='size-10'
          isDisabled={index >= data.length - 1}
        >
          <ArrowDown aria-label='ArrowDown' size='S' />
        </ActionButton>
        <Tooltip>Move downwards</Tooltip>
      </TooltipTrigger>
    </Flex>
  );
}

export default React.memo(SortButtons);
