import React, {memo} from 'react';
import {FlatList, View} from 'react-native';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import withFetch from '@screens/PDexV3/features/Staking/Staking.enhanceFetch';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {stakingSelector} from '@screens/PDexV3/features/Staking';
import {PoolItem} from '@screens/PDexV3/features/Staking/Staking.item';
import {RefreshControl} from '@components/core';

const StakingPools = ({ handleFetchStakingPools }) => {
  const pools = useSelector(stakingSelector.stakingPoolSelector);
  const isFetching = useSelector(stakingSelector.isFetchingPoolSelector);
  const renderItem = (data) => <PoolItem item={data.item} />;
  return (
    <View style={mainStyle.fullFlex}>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={handleFetchStakingPools} />
        }
        data={pools}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

StakingPools.propTypes = {
  handleFetchStakingPools: PropTypes.func.isRequired,
};

export default withFetch(memo(StakingPools));
