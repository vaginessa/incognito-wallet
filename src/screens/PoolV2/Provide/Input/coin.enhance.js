import React from 'react';
import { useNavigationParam } from 'react-navigation-hooks';
import { MAX_FEE_PER_TX } from '@components/EstimateFee/EstimateFee.utils';
import { COINS } from '@src/constants';

const withCoinData = WrappedComp => (props) => {
  const coins       = useNavigationParam('coins');
  const coin        = useNavigationParam('coin');
  const prvBalance  = useNavigationParam('prvBalance');
  const isPrv       = useNavigationParam('isPrv');

  let initIndex = 0;
  if (coin.locked) {
    // todo: remove
    coin.terms = [
      {apy: '30', lockTime: 6, termID: 1},
      {apy: '40', lockTime: 12, termID: 2},
    ];

    const isDefaultTIme = (element) => element.lockTime == 12;
    initIndex = coin.terms.findIndex(isDefaultTIme);
  }

  return (
    <WrappedComp
      {...{
        ...props,
        coins,
        coin,
        inputToken: coin,
        inputBalance: coin.balance,
        initIndex,
        // inputMin: (coin.id === COINS.PRV_ID ? coin.min + MAX_FEE_PER_TX : coin.min) || MAX_FEE_PER_TX,
        inputMin: coin.min || MAX_FEE_PER_TX,
        fee: MAX_FEE_PER_TX,
        feeToken: COINS.PRV,
        prvBalance,
        isPrv
      }}
    />
  );
};

export default withCoinData;
