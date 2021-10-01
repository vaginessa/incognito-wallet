import React, {memo} from 'react';
import {FlatList, View} from 'react-native';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import withFetch from '@screens/PDexV3/features/Staking/Staking.enhanceFetch';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {stakingSelector} from '@screens/PDexV3/features/Staking';
import {PoolItem} from '@screens/PDexV3/features/Staking/Staking.item';

const StakingPools = ({ handleFetchStakingPools }) => {
  const pools = useSelector(stakingSelector.stakingPoolSelector);
  const renderItem = (data) => <PoolItem item={data.item} />;
  return (
    <View style={mainStyle.fullFlex}>
      <FlatList
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
