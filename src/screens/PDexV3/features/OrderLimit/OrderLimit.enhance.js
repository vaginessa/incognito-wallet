import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { compose } from 'recompose';
import { withLayout_2 } from '@src/components/Layout';
import { useDispatch } from 'react-redux';
import { actionInit, actionReset } from './OrderLimit.actions';

const enhance = (WrappedComp) => (props) => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(actionInit());
    return () => {
      dispatch(actionReset());
    };
  }, []);
  return (
    <ErrorBoundary>
      <WrappedComp {...props} />
    </ErrorBoundary>
  );
};

export default compose(
  withLayout_2,
  enhance,
);
