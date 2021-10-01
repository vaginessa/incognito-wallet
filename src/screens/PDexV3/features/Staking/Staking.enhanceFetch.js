import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {useDispatch} from 'react-redux';
import {stakingActions} from '@screens/PDexV3/features/Staking/index';

const enhanceFetch = WrappedComp => props => {
  const dispatch = useDispatch();
  const handleFetchData = () => dispatch(stakingActions.actionFetchData());
  const handleChangeAccount = () => dispatch(stakingActions.actionChangeAccount());
  const handleFetchStakingPools = () => dispatch(stakingActions.actionFetchStakingPools());
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          handleFetchData,
          handleChangeAccount,
          handleFetchStakingPools,
        }}
      />
    </ErrorBoundary>
  );
};
export default enhanceFetch;

