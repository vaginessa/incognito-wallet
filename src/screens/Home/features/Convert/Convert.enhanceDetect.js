import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {useDispatch, useSelector} from 'react-redux';
import { accountSelector } from '@src/redux/selectors';
import { BottomBar } from '@components/core';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import { ExHandler } from '@services/exception';
import { actionClearConvertData, actionFetchCoinsV1 } from '@screens/Home/features/Convert/Convert.actions';
import { convertCoinsDataSelector } from '@screens/Home/features/Convert/Convert.selector';

const enhance = WrappedComp => (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const account = useSelector(accountSelector.defaultAccountSelector);
  const { isConvert } = useSelector(convertCoinsDataSelector);

  const fetchCoinsVersion1 = () => {
    try {
      dispatch(actionFetchCoinsV1());
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };

  const navigateConvert = () => {
    navigation.navigate(routeNames.ConvertTokenList);
  };

  React.useEffect(() => {
    return () => {
      dispatch(actionClearConvertData());
    };
  }, []);

  React.useEffect(() => {
    if (!account) return;
    fetchCoinsVersion1();
  }, [account]);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
        }}
      />
      {isConvert && (
        <BottomBar
          onPress={navigateConvert}
          text="Have unspent coins version 1"
        />
      )}
    </ErrorBoundary>
  );
};

export default enhance;
