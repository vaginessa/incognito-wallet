import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {useDispatch} from 'react-redux';
import {stakingActions} from '@screens/PDexV3/features/Staking/index';

const enhanceFetch = WrappedComp => props => {
  const dispatch = useDispatch();
  const handleFetchData = () => dispatch(stakingActions.actionFetchData());
  const handleChangeAccount = () => dispatch(stakingActions.actionChangeAccount());
  const handleFetchPool = () => dispatch(stakingActions.actionFetchStakingPool());
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          handleFetchData,
          handleChangeAccount,
          handleFetchPool,
        }}
      />
    </ErrorBoundary>
  );
};
export default enhanceFetch;

