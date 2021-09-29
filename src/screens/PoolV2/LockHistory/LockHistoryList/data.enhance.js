import React from 'react';
import { useNavigationParam } from 'react-navigation-hooks';

const withData = WrappedComp => (props) => {
  const userData = useNavigationParam('userData');
  const coin = useNavigationParam('coin');

  const lockHistories = userData.filter(item => {
    return item.id === coin.id && item.locked === coin.locked && item.lockTime === coin.lockTime;
  });

  return (
    <WrappedComp
      {...{
        ...props,
        coin,
        lockHistories,
      }}
    />
  );
};

export default withData;