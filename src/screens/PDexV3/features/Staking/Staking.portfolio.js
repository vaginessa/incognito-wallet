import React, {memo} from 'react';
import {FlatList, View} from 'react-native';
import PropTypes from 'prop-types';
import withFetch from '@screens/PDexV3/features/Staking/Staking.enhanceFetch';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {useSelector} from 'react-redux';
import {stakingSelector} from '@screens/PDexV3/features/Staking';
import {PortfolioItem} from '@screens/PDexV3/features/Staking/Staking.item';

const StakingPortfolio = ({ handleFetchData }) => {
  const coins = useSelector(stakingSelector.stakingCoinsSelector);
  const renderItem = (data) => <PortfolioItem item={data.item} />;
  return (
    <View style={mainStyle.fullFlex}>
      <FlatList
        data={coins}
        renderItem={renderItem}
        keyExtractor={(item) => item.tokenId}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

StakingPortfolio.propTypes = {
  handleFetchData: PropTypes.func.isRequired,
};

export default withFetch(memo(StakingPortfolio));
