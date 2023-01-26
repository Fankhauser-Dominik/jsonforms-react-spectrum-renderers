import React from 'react';
import { Flex, TooltipTrigger, Tooltip, ActionButton } from '@adobe/react-spectrum';
import ArrowUp from '@spectrum-icons/workflow/ArrowUp';
import ArrowDown from '@spectrum-icons/workflow/ArrowDown';
import { settings } from '../../../util';

interface ArrayModalControlSortButtonsProps {
  autoFocus: boolean;
  data: any;
  index: number;
  moveDown: any;
  moveUp: any;
  path: any;
  removeItems: any;
  uischema: any;
  upOrDown: string;
  userIsOnMobileDevice: boolean;
}

function SortButtons({
  autoFocus,
  data,
  index,
  moveDown,
  moveUp,
  path,
  upOrDown,
  userIsOnMobileDevice,
}: ArrayModalControlSortButtonsProps) {
  return (
    <Flex direction={'column'}>
      <TooltipTrigger delay={settings.toolTipDelay}>
        <ActionButton
          autoFocus={autoFocus && upOrDown === 'up'}
          isQuiet
          onPress={() => moveUp()}
          aria-label={`move-item-${path}.${index}-up`}
          marginX='size-10'
          UNSAFE_style={{ position: 'absolute', marginTop: '-5px' }}
          UNSAFE_className={`${userIsOnMobileDevice ? 'ArrowIcon' : null} ${
            index <= 0 ? 'disabledMovement' : null
          }`}
          isDisabled={index <= 0}
          height='size-325'
        >
          <ArrowUp aria-label='ArrowUp' size='S' />
        </ActionButton>
        <Tooltip>Move upwards</Tooltip>
      </TooltipTrigger>
      <TooltipTrigger delay={settings.toolTipDelay}>
        <ActionButton
          autoFocus={autoFocus && upOrDown === 'down'}
          isQuiet
          onPress={() => moveDown()}
          aria-label={`move-item-${path}.${index}-down`}
          marginX='size-10'
          UNSAFE_style={{ position: 'absolute', marginTop: '15px' }}
          UNSAFE_className={`${userIsOnMobileDevice ? 'ArrowIcon' : null} ${
            index >= data.length - 1 ? 'disabledMovement' : ''
          }`}
          isDisabled={index >= data.length - 1}
          height='size-325'
        >
          <ArrowDown aria-label='ArrowDown' size='S' />
        </ActionButton>
        <Tooltip>Move downwards</Tooltip>
      </TooltipTrigger>
    </Flex>
  );
}

export default React.memo(SortButtons);
