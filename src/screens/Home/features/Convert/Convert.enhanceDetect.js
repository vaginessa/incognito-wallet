import React, { useState } from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { debounce } from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import { accountSelector } from '@src/redux/selectors';
import { BottomBar } from '@components/core';
import { useFocusEffect, useNavigation } from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import { ExHandler } from '@services/exception';
import BottomLoading from '@components/core/BottomLoading';
import { actionFetchCoinsV1 } from '@screens/Home/features/Convert/Convert.actions';

const enhance = WrappedComp => (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
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
      const hasUnspentCoins = await dispatch(actionFetchCoinsV1());
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
  }, [account]));

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
