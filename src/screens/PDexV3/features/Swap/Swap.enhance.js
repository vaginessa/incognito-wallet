import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { useDispatch, useSelector } from 'react-redux';
import { actionInitSwapForm } from './Swap.actions';
import { defaultPairSelector } from './Swap.selector';

const enhance = (WrappedComp) => (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const handleReviewOrder = () =>
    navigation.navigate(routeNames.ReviewOrderSwap);
  const defaultPair = useSelector(defaultPairSelector);
  const initSwapForm = React.useCallback(() => {
    dispatch(actionInitSwapForm());
  }, []);
  React.useEffect(() => {
    initSwapForm();
  }, []);
  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props, handleReviewOrder }} />
    </ErrorBoundary>
  );
};

export default enhance;
