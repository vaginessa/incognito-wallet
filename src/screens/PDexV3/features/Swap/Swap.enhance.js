import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';

const enhance = (WrappedComp) => (props) => {
  const navigation = useNavigation();
  const handleReviewOrder = () => {
    navigation.navigate(routeNames.ReviewOrderSwap);
  };
  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props, handleReviewOrder }} />
    </ErrorBoundary>
  );
};

export default enhance;
