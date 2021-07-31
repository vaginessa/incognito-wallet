import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import { useDispatch } from 'react-redux';
import { actionGetFavoritePool, actionRemoveFavoritePool } from '@screens/Liquidity3/Liquidity3.actions';

const enhance = WrappedComp => props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const navigatePoolList = (isFavorite = true) => navigation.navigate(routeNames.PoolListLiquidity3, { isFavorite });

  const handleRemoveFavoritePool = (poolID) => dispatch(actionRemoveFavoritePool(poolID));

  const handlePullRefresh = () => dispatch(actionGetFavoritePool());

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          navigatePoolList,
          removeFavoritePool: handleRemoveFavoritePool,
          onPullRefresh: handlePullRefresh
        }}
      />
    </ErrorBoundary>
  );
};

export default enhance;
