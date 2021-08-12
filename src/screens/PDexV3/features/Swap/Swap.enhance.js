import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { useDispatch, useSelector } from 'react-redux';
import { actionSetSellToken, actionSetBuyToken } from './Swap.actions';
import { defaultPairSelector } from './Swap.selector';

const enhance = (WrappedComp) => (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const defaultPair = useSelector(defaultPairSelector);
  const handleReviewOrder = () => {
    navigation.navigate(routeNames.ReviewOrderSwap);
  };
  const initDefaultPairSwap = () => {
    if (defaultPair && defaultPair?.token1IdStr && defaultPair?.token2IdStr) {
      dispatch(actionSetSellToken(defaultPair.token1IdStr));
      dispatch(actionSetBuyToken(defaultPair.token2IdStr));
      // dispatch(actionEstimateTrade());
    }
  };
  React.useEffect(() => {
    initDefaultPairSwap();
  }, []);
  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props, handleReviewOrder }} />
    </ErrorBoundary>
  );
};

export default enhance;
