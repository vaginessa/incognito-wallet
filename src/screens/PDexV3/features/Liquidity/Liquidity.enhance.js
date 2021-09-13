import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {useDispatch} from 'react-redux';
import {liquidityActions} from '@screens/PDexV3/features/Liquidity/index';

const withLiquidity = WrappedComp => props => {
  const dispatch = useDispatch();
  const onInitContribute = () => {
    dispatch(liquidityActions.actionInitContribute());
  };
  const onInitRemovePool = () => {
    dispatch(liquidityActions.actionInitRemovePool());
  };
  const onInitCreatePool = () => {
    dispatch(liquidityActions.actionInitCreatePool());
  };
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          onInitContribute,
          onInitRemovePool,
          onInitCreatePool,
        }}
      />
    </ErrorBoundary>
  );
};

export default withLiquidity;
