import React from 'react';
import { Text } from '@src/components/core';
import { useSelector } from 'react-redux';
import { Hook, styled as extraStyled } from '@screens/PDexV3/features/Extra';
import { swapInfoSelector } from './Swap.selector';

export const MaxPriceAndImpact = React.memo(() => {
  const swapInfo = useSelector(swapInfoSelector);
  return (
    <Text numberOfLines={1} ellipsizeMode="tail" style={extraStyled.value}>
      {`${swapInfo?.maxPriceStr ?? ''}`}{' '}
      <Text style={[extraStyled.value, extraStyled.orangeValue]}>
        ({swapInfo?.sizeimpactStr || '0'}%)
      </Text>
    </Text>
  );
});
