import React, {useCallback, useState} from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { debounce } from 'lodash';
import { useSelector } from 'react-redux';
import { accountSelector } from '@src/redux/selectors';
import { BottomBar } from '@components/core';
import { useFocusEffect, useNavigation } from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import accountService from '@services/wallet/accountService';
import { PRV_ID } from '@screens/Dex/constants';

const enhance = WrappedComp => (props) => {
  const navigation = useNavigation();
  const account = useSelector(accountSelector.defaultAccountSelector);
  const wallet = useSelector((state) => state?.wallet);
  const [showBottom, setShowBottom] = useState(false);

  const detectUTXOSV1 = React.useCallback(debounce(async () => {
    const { unspentCoins } = await accountService.getUnspentCoinsV1({
      account,
      wallet,
      fromApi: true
    });
    const hasUnspentCoins = unspentCoins.some(coin => {
      if (coin.tokenId === PRV_ID) {
        return coin.balance > 100;
      }
      return coin.balance > 0;
    });
    setShowBottom(hasUnspentCoins);
  }, 1000),[account, wallet]);

  const navigateConvert = () => {
    navigation.navigate(routeNames.Convert);
  };

  useFocusEffect(useCallback(() => {
    if (!account) return;
    detectUTXOSV1.cancel();
    detectUTXOSV1();
  }, [account.PaymentAddress]));

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
        }}
      />
      {showBottom && (
        <BottomBar
          onPress={navigateConvert}
          text="Have unspent coins version 1"
        />
      )}
    </ErrorBoundary>
  );
};

export default enhance;
