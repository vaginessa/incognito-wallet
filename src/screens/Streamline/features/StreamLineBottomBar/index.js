import React from 'react';
import { useStreamLine } from '@screens/Streamline';
import { BottomBar } from '@components/core';
import BottomLoading from '@components/core/BottomLoading';

const StreamLineBottomBar = React.memo(() => {
  const { hasExceededMaxInputPRV, isFetchingUTXOS, onNavigateStreamLine } = useStreamLine({ fetchUTXO: true });
  if (isFetchingUTXOS) {
    return <BottomLoading loading />;
  }
  if (!hasExceededMaxInputPRV) {
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
