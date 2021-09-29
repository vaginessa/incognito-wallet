import { FlatList } from '@src/components/core/FlatList';
import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import HomeTabHeader from '@screens/PDexV3/features/Home/Home.tabHeader';
import {LoadingContainer} from '@components/core';
import Empty from '@components/Empty';
import PortfolioModal from '@screens/PDexV3/features/Portfolio/Portfolio.detail';
import withTransaction from '@screens/PDexV3/features/Liquidity/Liquidity.enhanceTransaction';
import {ACCOUNT_CONSTANT} from 'incognito-chain-web-js/build/wallet';
import {
  getDataShareByPoolIdSelector,
  isFetchingSelector,
  listShareIDsSelector,
  totalShareSelector
} from './Portfolio.selector';
import { styled } from './Portfolio.styled';
import PortfolioItem from './Portfolio.item';

const PortfolioList = withTransaction(React.memo(({ onCreateWithdrawFeeLP }) => {
  const data = useSelector(listShareIDsSelector);
  const getDataShare = useSelector(getDataShareByPoolIdSelector);
  const onWithdrawFeeLP = (poolId) => {
    const dataShare = getDataShare(poolId);
    if (!dataShare && typeof onCreateWithdrawFeeLP !== 'function') return;
    const { token1Reward, token2Reward, nftId, tokenId1, tokenId2 } = dataShare;
    const params = {
      fee: ACCOUNT_CONSTANT.MAX_FEE_PER_TX,
      withdrawTokenIDs: [tokenId1, tokenId2],
      poolPairID: poolId,
      nftID: nftId,
      amount1: token1Reward,
      amount2: token2Reward
    };
    onCreateWithdrawFeeLP(params);
  };
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <PortfolioItem shareId={item} onWithdrawFeeLP={onWithdrawFeeLP} />}
      keyExtractor={(item) => item?.shareId}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={<Empty />}
      style={styled.list}
    />
  );
}));

const Portfolio = () => {
  const totalShare = useSelector(totalShareSelector);
  const isFetching = useSelector(isFetchingSelector);
  return (
    <>
      <View style={styled.container}>
        <HomeTabHeader title="Your return" desc={`$${totalShare}`} />
        {isFetching ? (<LoadingContainer />) : (<PortfolioList />)}
      </View>
      <PortfolioModal />
    </>
  );
};

export default React.memo(Portfolio);
