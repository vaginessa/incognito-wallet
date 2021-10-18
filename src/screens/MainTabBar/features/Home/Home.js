import React, {memo} from 'react';
import {ScrollView, View} from 'react-native';
import {homeStyled} from '@screens/MainTabBar/MainTabBar.styled';
import {COLORS} from '@src/styles';
import MainTab from '@screens/MainTabBar/features/Home/Home.tabs';
import Header from './Home.header';
import Banner from './Home.banner';
import Category from './Home.category';

const TabHome = () => {
  return (
    <View style={{ backgroundColor: COLORS.white, flex: 1 }}>
      <View style={homeStyled.wrapHeader}>
        <Header />
      </View>
      <ScrollView style={homeStyled.wrapHeader}>
        <Banner />
        <Category />
        <MainTab />
      </ScrollView>
    </View>
  );
};

TabHome.propTypes = {};

export default memo(TabHome);
