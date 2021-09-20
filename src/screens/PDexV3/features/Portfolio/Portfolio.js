import { FlatList } from '@src/components/core/FlatList';
import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import HomeTabHeader from '@screens/PDexV3/features/Home/Home.tabHeader';
import {LoadingContainer} from '@components/core';
import {isFetchingSelector, listShareIDsSelector, totalShareSelector} from './Portfolio.selector';
import { styled } from './Portfolio.styled';
import PortfolioItem from './Portfolio.item';

const PortfolioList = React.memo(() => {
  const data = useSelector(listShareIDsSelector);
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <PortfolioItem shareId={item} />}
      keyExtractor={(item) => item?.shareId}
      showsVerticalScrollIndicator={false}
      style={styled.list}
    />
  );
});

const Portfolio = () => {
  const totalShare = useSelector(totalShareSelector);
  const isFetching = useSelector(isFetchingSelector);
  return (
    <View style={styled.container}>
      <HomeTabHeader title="Your return" desc={`$${totalShare}`} />
      {isFetching ? (<LoadingContainer />) : (<PortfolioList />)}
    </View>
  );
};

export default React.memo(Portfolio);
