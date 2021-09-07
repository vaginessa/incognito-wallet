import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { compose } from 'recompose';
import { withLayout_2 } from '@src/components/Layout';
import { useDispatch } from 'react-redux';
import { useNavigationParam } from 'react-navigation-hooks';
import { actionFetch, actionSetSelectedPool } from './Chart.actions';

const enhance = (WrappedComp) => (props) => {
  const poolid = useNavigationParam('poolId');
  const dispatch = useDispatch();
  const fetchData = async () => {
    if (!poolid) {
      return;
    }
    await dispatch(actionSetSelectedPool(poolid));
    dispatch(actionFetch());
  };
  React.useEffect(() => {
    fetchData();
  }, [poolid]);
  return (
    <ErrorBoundary>
      <WrappedComp {...props} />
    </ErrorBoundary>
  );
};

export default compose(
  enhance,
  withLayout_2,
);
