import { FlatList } from '@src/components/core/FlatList';
import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import HomeTabHeader from '@screens/PDexV3/features/Home/Home.tabHeader';
import { listShareIDsSelector, totalShareSelector } from './Portfolio.selector';
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

const Portfolio = (props) => {
  const totalShare = useSelector(totalShareSelector);
  return (
    <View style={styled.container}>
      <HomeTabHeader title="Your return" desc={`$${totalShare}`} />
      <PortfolioList />
    </View>
  );
};

Portfolio.propTypes = {};

export default React.memo(Portfolio);
