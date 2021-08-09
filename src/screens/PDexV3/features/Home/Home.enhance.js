import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { compose } from 'recompose';
import { withLayout_2 } from '@src/components/Layout';
import { useDispatch } from 'react-redux';
import { actionFreeHomePDexV3, actionRefresh } from './Home.actions';

const enhance = (WrappedComp) => (props) => {
  const dispatch = useDispatch();
  const handleOnRefresh = () => {
    dispatch(actionRefresh());
  };
  React.useEffect(() => {
    handleOnRefresh();
    return () => {
      dispatch(actionFreeHomePDexV3());
    };
  }, []);
  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props, handleOnRefresh }} />
    </ErrorBoundary>
  );
};

export default compose(
  withLayout_2,
  enhance,
);
