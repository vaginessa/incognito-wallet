import React from 'react';
import { useStreamLine } from '@screens/Streamline';
import { BottomBar } from '@components/core';
import {useSelector} from 'react-redux';
import {convertHasUnspentCoinsSelector} from '@screens/Home/features/Convert/Convert.selector';

const StreamLineBottomBar = React.memo(() => {
  const { hasExceededMaxInputPRV, isFetchingUTXOS, onNavigateStreamLine } = useStreamLine({ fetchUTXO: true });
  const hasUnspentCoins = useSelector(convertHasUnspentCoinsSelector);
  if (!hasExceededMaxInputPRV || !!isFetchingUTXOS || hasUnspentCoins) {
    return null;
  }
  return (
    <BottomBar
      onPress={onNavigateStreamLine}
      text="Streamline this keychain now for efficient transactions"
    />
  );
});

export default StreamLineBottomBar;
