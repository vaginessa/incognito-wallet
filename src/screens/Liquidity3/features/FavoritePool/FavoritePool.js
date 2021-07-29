import React, {memo} from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import {Row} from '@src/components';
import styled from '@screens/Liquidity3/features/FavoritePool/FavoritePool.styled';
import { MESSAGES } from '@screens/Liquidity3/Liquidity3.constants';
import { FixedHeaderPoolCard, PoolCard } from '@screens/Liquidity3/components';
import TotalReward from '@screens/PoolV2/Home/TotalReward';
import { useSelector } from 'react-redux';
import { selectedPrivacySelector } from '@src/redux/selectors';
import { PRV_ID } from '@screens/DexV2/constants';
import { ButtonBasic } from '@components/Button';
import { favoritePoolSelector, fetchingSelector } from '@screens/Liquidity3/Liquidity3.selector';
import enhance from '@screens/Liquidity3/features/FavoritePool/FavoritePool.enhance';
import PropTypes from 'prop-types';
import { v4 } from 'uuid';
import { RefreshControl } from '@components/core';

const GroupButton = React.memo(() => {
  return(
    <View>
      <Row style={styled.wrapperGroupButton}>
        <ButtonBasic title={MESSAGES.swap} btnStyle={styled.normalButton} />
        <ButtonBasic title={MESSAGES.create_pool} btnStyle={styled.largeButton} />
      </Row>
    </View>
  );
});

const FavoritePool = memo(({
  navigatePoolList,
  removeFavoritePool,
  onItemPress,
  onPullRefresh
}) => {
  const nativeToken = useSelector(selectedPrivacySelector.getPrivacyDataByTokenID)(PRV_ID);
  const favoritePools = useSelector(favoritePoolSelector);
  const { loadingFavorite } = useSelector(fetchingSelector);

  const renderItem = (data) => (
    <PoolCard
      swipable={(favoritePools || []).length > 1}
      data={data?.item}
      onPress={onItemPress}
      onRemove={removeFavoritePool}
    />
  );

  const renderKeyExtractor = (item) => item?.poolID || v4();

  const renderFooter = () => (
    <TouchableOpacity
      style={styled.wrapFooter}
      onPress={navigatePoolList}
    >
      <Text style={styled.addFavoriteText}>{MESSAGES.add_favorite}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styled.container}>
      <TotalReward
        total={10000}
        nativeToken={nativeToken}
        title={MESSAGES.trading_volume}
        style={styled.wrapperReward}
        balanceStyle={styled.balanceStyle}
      />
      <GroupButton navigatePoolList={navigatePoolList} />
      <Row style={styled.wrapperSearch}>
        <Text style={styled.titleText}>{MESSAGES.market_list}</Text>
        <TouchableOpacity
          style={styled.wrapButtonSearch}
          activeOpacity={0.5}
          onPress={() => {
            navigatePoolList(false);
          }}
        >
          <Text style={styled.searchText}>{MESSAGES.search_coin}</Text>
        </TouchableOpacity>
      </Row>
      <FixedHeaderPoolCard />
      <FlatList
        refreshControl={(
          <RefreshControl
            refreshing={loadingFavorite}
            onRefresh={onPullRefresh}
          />
        )}
        data={favoritePools}
        renderItem={renderItem}
        keyExtractor={renderKeyExtractor}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderFooter()}
      />
    </View>
  );
});

FavoritePool.propTypes = {
  navigatePoolList: PropTypes.func.isRequired,
  removeFavoritePool: PropTypes.func.isRequired,
  onItemPress: PropTypes.func.isRequired,
  onPullRefresh: PropTypes.func.isRequired,
};

export default enhance(FavoritePool);
