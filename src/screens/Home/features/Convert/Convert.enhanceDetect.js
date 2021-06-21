import React, { useState } from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { debounce } from 'lodash';
import { useSelector } from 'react-redux';
import { accountSelector } from '@src/redux/selectors';
import { BottomBar } from '@components/core';
import { useFocusEffect, useNavigation } from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import accountService from '@services/wallet/accountService';
import { PRV_ID } from '@screens/Dex/constants';
import { ExHandler } from '@services/exception';
import BottomLoading from '@components/core/BottomLoading';

const enhance = WrappedComp => (props) => {
  const navigation = useNavigation();
  const account = useSelector(accountSelector.defaultAccountSelector);
  const wallet = useSelector((state) => state?.wallet);
  const [{
    loading,
    showConvert,
  }, setShowBottom] = useState({
    loading: true,
    showConvert: false,
  });

  const detectUTXOSV1 = React.useCallback(async () => {
    try {
      const { unspentCoins } = await accountService.getUnspentCoinsV1({
        account,
        wallet,
        fromApi: true
      });
      const hasUnspentCoins = unspentCoins.some(coin => {
        if (coin.tokenID === PRV_ID) {
          return coin.balance > 100;
        }
        return coin.balance > 0;
      });

      setShowBottom({
        loading: false,
        showConvert: hasUnspentCoins
      });
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  });

  const navigateConvert = () => {
    navigation.navigate(routeNames.Convert);
  };

  const debounceDetectUTXOSV1 = React.useCallback(debounce(detectUTXOSV1, 500), [account, wallet]);


  useFocusEffect(React.useCallback(() => {
    if (!account) return;
    setShowBottom({
      loading: true,
      showConvert: false
    });
    debounceDetectUTXOSV1.cancel();
    debounceDetectUTXOSV1();
  }, [account.PaymentAddress, wallet]));

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
        }}
      />
      {showConvert && (
        <BottomBar
          onPress={navigateConvert}
          text="Have unspent coins version 1"
        />
      )}
      <BottomLoading loading={loading} />
    </ErrorBoundary>
  );
};

export default enhance;
