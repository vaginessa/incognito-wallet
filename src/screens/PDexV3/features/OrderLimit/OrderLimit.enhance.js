import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { compose } from 'recompose';
import { poolSelectedDataSelector } from './OrderLimit.selector';
import {
  actionInit,
  actionReset,
  actionSetDefaultPool,
} from './OrderLimit.actions';

const enhance = (WrappedComp) => (props) => {
  const dispatch = useDispatch();
  const handleUnmount = async () => {
    await dispatch(actionSetDefaultPool());
    dispatch(actionReset());
  };
  React.useEffect(() => {
    dispatch(actionInit());
    return () => {
      handleUnmount();
    };
  }, []);
  return (
    <ErrorBoundary>
      <WrappedComp {...props} />
    </ErrorBoundary>
  );
};

export default compose(enhance);
