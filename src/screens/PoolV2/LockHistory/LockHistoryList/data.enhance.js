import React from 'react';
import { useNavigationParam } from 'react-navigation-hooks';

const LockStatus = {
  Inactive: 0,
  Active: 1,
};

const withData = WrappedComp => (props) => {
  const userData = useNavigationParam('userData');
  const coin = useNavigationParam('coin');

  const lockHistories = userData.filter(item => {
    return item.id === coin.id && item.locked === coin.locked && 
      item.lockTime === coin.lockTime && item.status === LockStatus.Active;
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