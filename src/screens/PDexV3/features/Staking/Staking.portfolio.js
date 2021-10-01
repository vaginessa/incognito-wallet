import React, {memo} from 'react';
import {FlatList, View} from 'react-native';
import PropTypes from 'prop-types';
import withFetch from '@screens/PDexV3/features/Staking/Staking.enhanceFetch';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {useDispatch, useSelector} from 'react-redux';
import {stakingSelector} from '@screens/PDexV3/features/Staking';
import {HeaderModal, OneLineRow, PortfolioItem} from '@screens/PDexV3/features/Staking/Staking.item';
import {RefreshControl} from '@components/core';
import {BottomModalActions} from '@components/core/BottomModal';

const StakingPortfolio = ({ handleFetchCoins }) => {
  const dispatch = useDispatch();
  const coins = useSelector(stakingSelector.stakingCoinsSelector);
  const isFetching = useSelector(stakingSelector.isFetchingCoinsSelector);
  const renderModelCell = ({ token, rewardStr }) => <OneLineRow token={token} valueText={rewardStr} />;
  const showDetailReward = (rewardsMerged) => {
    dispatch(BottomModalActions.actionOpenModal({
      title: 'Exchange rate',
      customHeader: <HeaderModal array={['Name', 'Amount']} />,
      customContent: <View style={{ marginTop: 24 }}>{rewardsMerged.map(renderModelCell)}</View>
    }));
  };
  const renderItem = (data) => (
    <PortfolioItem
      item={data.item}
      onPressArrow={showDetailReward}
    />
  );
  return (
    <View style={mainStyle.fullFlex}>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={handleFetchCoins} />
        }
        data={coins}
        renderItem={renderItem}
        keyExtractor={(item) => item.tokenId}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

StakingPortfolio.propTypes = {
  handleFetchCoins: PropTypes.func.isRequired,
};

export default withFetch(memo(StakingPortfolio));
