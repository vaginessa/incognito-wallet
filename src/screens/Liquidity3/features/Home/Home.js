import React from 'react';
import { View } from 'react-native';
import { Header } from '@src/components';
import { HEADER_TABS, HEADER_TITLES } from '@screens/Liquidity3/Liquidity3.constants';
import { compose } from 'recompose';
import styled from '@screens/Liquidity3/features/Home/Home.styled';
import { HeaderTab } from '@screens/Liquidity3/components';
import FavoritePool from '@screens/Liquidity3/features/FavoritePool/FavoritePool';

const HomeDex = React.memo(() => {
  return (
    <View style={styled.container}>
      <Header title={HEADER_TITLES.Market} />
      <HeaderTab tabs={HEADER_TABS.Home} selected="Pool" />
      <FavoritePool />
    </View>
  );
});

export default compose(
)(HomeDex);
