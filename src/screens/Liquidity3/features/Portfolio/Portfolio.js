import React, {memo} from 'react';
import {FlatList, View} from 'react-native';
import PropTypes from 'prop-types';
import TotalReward from '@screens/PoolV2/Home/TotalReward';
import {MESSAGES} from '@screens/Liquidity3/Liquidity3.constants';
import styled from '@screens/Liquidity3/features/FavoritePool/FavoritePool.styled';
import {useSelector} from 'react-redux';
import {selectedPrivacySelector} from '@src/redux/selectors';
import {PRV_ID} from '@screens/DexV2/constants';
import {RefreshControl} from '@components/core';
import {MOCKUP_PORTFOLIO} from '@screens/Liquidity3/Liquidity3.mockup';
import PortfolioCard from '@screens/Liquidity3/components/PortfolioCard/PortfolioCard';
import enhance from './Portfolio.enhance';

const Portfolio = React.memo(() => {
  const nativeToken = useSelector(selectedPrivacySelector.getPrivacyDataByTokenID)(PRV_ID);
  const renderItem = (data) => <PortfolioCard data={data?.item} />;
  const renderKeyExtractor = (item) => item?.poolID;
  return (
    <View style={{ flex: 1 }}>
      <TotalReward
        total={10000}
        nativeToken={nativeToken}
        title={MESSAGES.your_return}
        style={styled.wrapperReward}
        balanceStyle={styled.balanceStyle}
      />
      <FlatList
        // refreshControl={(
        //   <RefreshControl
        //     refreshing={loadingFavorite}
        //     onRefresh={onPullRefresh}
        //   />
        // )}
        data={MOCKUP_PORTFOLIO}
        renderItem={renderItem}
        keyExtractor={renderKeyExtractor}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
});

Portfolio.propTypes = {};


export default enhance(Portfolio);
