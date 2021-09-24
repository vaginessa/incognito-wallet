import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {useDispatch, useSelector} from 'react-redux';
import {liquidityActions} from '@screens/PDexV3/features/Liquidity/index';
import debounce from 'lodash/debounce';
import {actionRefresh} from '@screens/PDexV3/features/Home';
import {switchAccountSelector} from '@src/redux/selectors/account';

const withLiquidity = WrappedComp => props => {
  const dispatch = useDispatch();
  const switching = useSelector(switchAccountSelector);
  const onInitContribute = () => dispatch(liquidityActions.actionInitContribute());
  const _debounceInitContribute = React.useCallback(debounce(onInitContribute, 500), []);
  const onInitRemovePool = () => dispatch(liquidityActions.actionInitRemovePool());
  const _debounceInitRemovePool = React.useCallback(debounce(onInitRemovePool, 500), []);
  const onInitCreatePool = () => dispatch(liquidityActions.actionInitCreatePool());
  const _debounceInitCreatePool = React.useCallback(debounce(onInitCreatePool, 500), []);
  const onRefreshPool = () => dispatch(actionRefresh());
  const _debounceRefreshPool = React.useCallback(debounce(onRefreshPool, 500), []);
  React.useEffect(() => {
    if(switching) return;
    _debounceRefreshPool();
  }, [switching]);
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          onInitContribute: _debounceInitContribute,
          onInitRemovePool: _debounceInitRemovePool,
          onInitCreatePool: _debounceInitCreatePool,
        }}
      />
    </ErrorBoundary>
  );
};

export default withLiquidity;
