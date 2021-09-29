import React from 'react';
import { useNavigationParam } from 'react-navigation-hooks';
import { MAX_FEE_PER_TX } from '@components/EstimateFee/EstimateFee.utils';
import { COINS } from '@src/constants';

const withCoinData = WrappedComp => (props) => {
  const data = useNavigationParam('data');
  const coins = useNavigationParam('coins');
  const coin = data?.coin;

  return (
    <WrappedComp
      {...{
        ...props,
        data,
        coins,
        coin,
        inputToken: coin,
        inputBalance: data.balance,
        inputMin: coin.min || MAX_FEE_PER_TX,
        fee: 0,
        feeToken: COINS.PRV,
      }}
    />
  );
};

export default withCoinData;
