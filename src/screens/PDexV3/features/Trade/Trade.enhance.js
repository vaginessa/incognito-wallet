import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { withLayout_2 } from '@src/components/Layout';
import { compose } from 'recompose';
import { useDispatch } from 'react-redux';
import { actionFetch } from './Trade.actions';

const enhance = (WrappedComp) => (props) => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(actionFetch());
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
