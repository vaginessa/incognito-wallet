import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { useDispatch, useSelector } from 'react-redux';
import { actionInitSwapForm, actionReset } from './Swap.actions';
import { swapInfoSelector } from './Swap.selector';

const enhance = (WrappedComp) => (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const swapInfo = useSelector(swapInfoSelector);
  const handleReviewOrder = () =>
    !swapInfo?.disabledBtnSwap &&
    navigation.navigate(routeNames.ReviewOrderSwap);
  const initSwapForm = () => dispatch(actionInitSwapForm());
  React.useEffect(() => {
    initSwapForm();
    return () => {
      dispatch(actionReset());
    };
  }, []);
  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props, handleReviewOrder }} />
    </ErrorBoundary>
  );
};

export default enhance;
