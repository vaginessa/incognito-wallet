import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigationParam, useNavigation } from 'react-navigation-hooks';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Tabs } from '@src/components/core';
import { withLayout_2 } from '@src/components/Layout';
import { Header } from '@src/components';
import PoolsList from './Pools.list';
import {
  listPoolsSelector,
  listPoolsFollowingSelector,
} from './Pools.selector';

const ROOT_TAB_POOLS = 'ROOT_TAB_POOLS';
const TAB_MARKET = `${ROOT_TAB_POOLS}-TAB_MARKET`;
const TAB_FOLLOWING = `${ROOT_TAB_POOLS}-TAB_FOLLOWING`;

const styled = StyleSheet.create({
  container: { flex: 1 },
});

const TabFollowing = React.memo(({ onPressPool }) => {
  const listPools = useSelector(listPoolsFollowingSelector);
  return <PoolsList listPools={listPools} onPressPool={onPressPool} />;
});

const TabMarket = React.memo(({ onPressPool }) => {
  const listPools = useSelector(listPoolsSelector);
  return <PoolsList listPools={listPools} onPressPool={onPressPool} />;
});

const PoolsTab = () => {
  const onPressPoolParam = useNavigationParam('onPressPool');
  const { goBack } = useNavigation();
  const onPressPool = (poolId) => {
    if (typeof onPressPoolParam === 'function') {
      onPressPoolParam(poolId);
    }
    goBack();
  };
  return (
    <View style={styled.container}>
      <Header title="Select coins" />
      <Tabs rootTabID={ROOT_TAB_POOLS} useTab1 style={styled.tabs}>
        <View tabID={TAB_FOLLOWING} label="All" onChangeTab={() => null}>
          <TabMarket onPressPool={onPressPool} />
        </View>
        <View tabID={TAB_MARKET} label="Favorites" onChangeTab={() => null}>
          <TabFollowing onPressPool={onPressPool} />
        </View>
      </Tabs>
    </View>
  );
};

PoolsTab.propTypes = {
  onPressPool: PropTypes.func.isRequired,
};

export default withLayout_2(React.memo(PoolsTab));
