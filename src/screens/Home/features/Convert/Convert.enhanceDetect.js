import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { debounce } from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import { accountSelector } from '@src/redux/selectors';
import { BottomBar } from '@components/core';
import { useFocusEffect, useNavigation } from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import { ExHandler } from '@services/exception';
import {actionClearConvertData, actionFetchCoinsV1} from '@screens/Home/features/Convert/Convert.actions';
import { convertHasUnspentCoinsSelector } from '@screens/Home/features/Convert/Convert.selector';

const enhance = WrappedComp => (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const account = useSelector(accountSelector.defaultAccountSelector);
  const hasUnspentCoins = useSelector(convertHasUnspentCoinsSelector);

  const detectUTXOSV1 = () => {
    try {
      dispatch(actionFetchCoinsV1());
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };

  const navigateConvert = () => {
    navigation.navigate(routeNames.Convert);
  };

  const debounceDetectUTXOSV1 = React.useCallback(debounce(detectUTXOSV1, 500), []);

  React.useEffect(() => {
    return () => {
      dispatch(actionClearConvertData());
    };
  }, []);

  useFocusEffect(React.useCallback(() => {
    if (!account) return;
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
      {hasUnspentCoins && (
        <BottomBar
          onPress={navigateConvert}
          text="Have unspent coins version 1"
        />
      )}
    </ErrorBoundary>
  );
};

export default enhance;
