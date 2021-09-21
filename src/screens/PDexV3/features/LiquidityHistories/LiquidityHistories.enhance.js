import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {useDispatch} from 'react-redux';
import {liquidityHistoryActions} from '@screens/PDexV3/features/LiquidityHistories/index';

const withHistories = WrappedComp => props => {
  const dispatch = useDispatch();
  const onLoadData = () => dispatch(liquidityHistoryActions.actionGetHistories());
  React.useEffect(() => { onLoadData(); }, []);
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
        }}
      />
    </ErrorBoundary>
  );
};

export default withHistories;
