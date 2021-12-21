import React from 'react';
import { useNavigationParam, useNavigation } from 'react-navigation-hooks';
import { batch, useDispatch, useSelector } from 'react-redux';
import { withLayout_2 } from '@src/components/Layout';
import { liquidityActions } from '@screens/PDexV3/features/Liquidity';
import routeNames from '@routers/routeNames';
import PoolsList from './Pools.list';
import {
  listPoolsSelector,
} from './Pools.selector';

const PoolsTab = () => {
  const onPressPoolParam = useNavigationParam('onPressPool');
  const dispatch = useDispatch();
  const listPools = useSelector(listPoolsSelector);
  const navigation = useNavigation();
  const onPressPool = (poolId) => {
    if (typeof onPressPoolParam === 'function') {
      return onPressPoolParam(poolId);
    }
    batch(() => {
      dispatch(liquidityActions.actionSetContributeID({ poolId, nftId: '' }));
      navigation.navigate(routeNames.ContributePool);
    });
    // goBack();
  };
  return (
    <PoolsList listPools={listPools} onPressPool={onPressPool} />
  );
};

export default withLayout_2(React.memo(PoolsTab));
